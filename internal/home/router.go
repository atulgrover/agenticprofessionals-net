package home

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"os"
	"time"

	"github.com/atulgrover/agenticprofessionals-net/internal/shared"
)

// NewRouter creates an http.Handler for the root gateway (agenticprofessionals.net / www).
func NewRouter(db *sql.DB, staticDir string) http.Handler {
	if _, err := os.Stat(staticDir); os.IsNotExist(err) {
		staticDir = "public/home"
	}

	mux := http.NewServeMux()

	setNoCache := func(w http.ResponseWriter) {
		w.Header().Set("Cache-Control", "no-cache, must-revalidate")
	}

	serveAppIndex := func(w http.ResponseWriter, r *http.Request) {
		setNoCache(w)
		http.ServeFile(shared.StaticResponseWriter{ResponseWriter: w}, r, staticDir+"/index.html")
	}

	// Status endpoint
	mux.HandleFunc("/api/status", func(w http.ResponseWriter, r *http.Request) {
		shared.EnableCORS(w)
		w.Header().Set("Content-Type", "application/json")
		dbStatus := "disconnected"
		if db != nil && db.Ping() == nil {
			dbStatus = "connected"
		}
		json.NewEncoder(w).Encode(map[string]any{
			"home":      true,
			"ibc":       true,
			"bns":       true,
			"database":  dbStatus,
			"timestamp": time.Now().UTC().Format(time.RFC3339),
		})
	})

	// Health check
	mux.HandleFunc("/api/health", func(w http.ResponseWriter, r *http.Request) {
		shared.EnableCORS(w)
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]any{
			"status":  "healthy",
			"server":  "Agentic Professionals Gateway",
			"version": "2.0.0",
			"time":    time.Now().UTC().Format(time.RFC3339),
		})
	})
	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("OK"))
	})

	// Serve root static files
	fs := http.FileServer(http.Dir(staticDir))
	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path == "/" || r.URL.Path == "/index.html" {
			serveAppIndex(w, r)
			return
		}
		setNoCache(w)
		fs.ServeHTTP(shared.StaticResponseWriter{ResponseWriter: w}, r)
	})

	return mux
}
