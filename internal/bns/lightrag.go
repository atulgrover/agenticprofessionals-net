package bns

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"strings"
	"time"
)

// LightRAGQueryRequest is the inbound payload for /api/answers/query
type LightRAGQueryRequest struct {
	Query     string `json:"query"`
	Mode      string `json:"mode,omitempty"`
	Workspace string `json:"workspace,omitempty"`
}

// LightRAGReferenceItem holds a document source citation returned by LightRAG
type LightRAGReferenceItem struct {
	ReferenceID string   `json:"reference_id"`
	FilePath    string   `json:"file_path"`
	Content     []string `json:"content,omitempty"`
}

// LightRAGUpstreamResponse matches the JSON structure returned by LightRAG /query
type LightRAGUpstreamResponse struct {
	Response   string                  `json:"response"`
	References []LightRAGReferenceItem `json:"references,omitempty"`
	Detail     any                     `json:"detail,omitempty"`
}

// LightRAGQueryResponse is returned to the frontend
type LightRAGQueryResponse struct {
	Success    bool                    `json:"success"`
	Workspace  string                  `json:"workspace"`
	Query      string                  `json:"query"`
	Answer     string                  `json:"answer"`
	AnswerHTML string                  `json:"answer_html"`
	References []LightRAGReferenceItem `json:"references,omitempty"`
	Error      string                  `json:"error,omitempty"`
}

// HandleLightRAGQuery proxies statutory questions to the sovereign LightRAG server
func (s *ForumService) HandleLightRAGQuery(w http.ResponseWriter, r *http.Request) {
	enableCORS(w)
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusNoContent)
		return
	}

	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req LightRAGQueryRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(LightRAGQueryResponse{
			Success: false,
			Error:   "Invalid JSON payload: " + err.Error(),
		})
		return
	}

	query := strings.TrimSpace(req.Query)
	if query == "" {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(LightRAGQueryResponse{
			Success: false,
			Error:   "Query cannot be empty",
		})
		return
	}

	// Resolve target workspace (priority: request payload -> env var -> "bns")
	workspace := strings.TrimSpace(req.Workspace)
	if workspace == "" {
		workspace = os.Getenv("LIGHTRAG_WORKSPACE")
	}
	if workspace == "" {
		workspace = "bns"
	}

	// Resolve LightRAG base URL
	baseURL := strings.TrimRight(os.Getenv("LIGHTRAG_API_URL"), "/")
	if baseURL == "" {
		baseURL = "http://20.198.0.59"
	}

	mode := strings.TrimSpace(req.Mode)
	if mode == "" {
		mode = "mix"
	}

	upstreamPayload := map[string]any{
		"query":              query,
		"mode":               mode,
		"workspace":          workspace,
		"include_references": true,
	}

	payloadBytes, err := json.Marshal(upstreamPayload)
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(LightRAGQueryResponse{
			Success: false,
			Error:   "Failed to encode request: " + err.Error(),
		})
		return
	}

	ctx, cancel := context.WithTimeout(r.Context(), 90*time.Second)
	defer cancel()

	endpointURL := fmt.Sprintf("%s/query", baseURL)
	httpReq, err := http.NewRequestWithContext(ctx, http.MethodPost, endpointURL, bytes.NewReader(payloadBytes))
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(LightRAGQueryResponse{
			Success: false,
			Error:   "Failed to create upstream request: " + err.Error(),
		})
		return
	}

	httpReq.Header.Set("Content-Type", "application/json")
	httpReq.Header.Set("LIGHTRAG-WORKSPACE", workspace)
	if apiKey := os.Getenv("LIGHTRAG_API_KEY"); apiKey != "" {
		httpReq.Header.Set("X-API-Key", apiKey)
	}

	client := &http.Client{Timeout: 90 * time.Second}
	resp, err := client.Do(httpReq)
	if err != nil {
		log.Printf("[ERROR] LightRAG upstream query failed (%s): %v", endpointURL, err)
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadGateway)
		json.NewEncoder(w).Encode(LightRAGQueryResponse{
			Success:   false,
			Workspace: workspace,
			Query:     query,
			Error:     fmt.Sprintf("Failed to reach LightRAG sovereign node at %s: %v", baseURL, err),
		})
		return
	}
	defer resp.Body.Close()

	respBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadGateway)
		json.NewEncoder(w).Encode(LightRAGQueryResponse{
			Success:   false,
			Workspace: workspace,
			Query:     query,
			Error:     "Failed to read LightRAG response: " + err.Error(),
		})
		return
	}

	if resp.StatusCode != http.StatusOK {
		log.Printf("[WARN] LightRAG upstream error status %d: %s", resp.StatusCode, string(respBytes))
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(resp.StatusCode)
		json.NewEncoder(w).Encode(LightRAGQueryResponse{
			Success:   false,
			Workspace: workspace,
			Query:     query,
			Error:     fmt.Sprintf("LightRAG responded with HTTP %d: %s", resp.StatusCode, string(respBytes)),
		})
		return
	}

	var upstreamResp LightRAGUpstreamResponse
	if err := json.Unmarshal(respBytes, &upstreamResp); err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadGateway)
		json.NewEncoder(w).Encode(LightRAGQueryResponse{
			Success:   false,
			Workspace: workspace,
			Query:     query,
			Error:     "Failed to parse LightRAG JSON: " + err.Error(),
		})
		return
	}

	htmlOutput := s.RenderMarkdown(upstreamResp.Response)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(LightRAGQueryResponse{
		Success:    true,
		Workspace:  workspace,
		Query:      query,
		Answer:     upstreamResp.Response,
		AnswerHTML: htmlOutput,
		References: upstreamResp.References,
	})
}
