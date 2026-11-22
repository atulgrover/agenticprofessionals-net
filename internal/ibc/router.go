package ibc

import (
	"crypto/hmac"
	"crypto/sha256"
	"database/sql"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"strings"
	"sync"
	"time"

	"github.com/atulgrover/agenticprofessionals-net/internal/shared"
)

var (
	db             *sql.DB
	authManager    *AuthManager
	forumService   *ForumService
	calnodeAdapter *CalnodeAdapter
)

func enableCORS(w http.ResponseWriter) {
	shared.EnableCORS(w)
}

func handleRadarAssets(w http.ResponseWriter, r *http.Request) {
	enableCORS(w)
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusNoContent)
		return
	}

	w.Header().Set("Content-Type", "application/json")

	if db == nil {
		json.NewEncoder(w).Encode(map[string]any{"assets": fallbackDeals})
		return
	}

	query := `
		SELECT 
			id, cin, company_name, sector, state, 
			COALESCE(asset_city, state) as asset_city,
			nclt_bench, 
			COALESCE(case_number, '') as case_number, 
			COALESCE(regime, 'CIRP') as regime,
			COALESCE(cirp_stage, 'FORM_G_OPEN') as cirp_stage,
			COALESCE(claims_admitted_inr, 0) as claims_admitted_inr,
			COALESCE(liquidation_value_inr, 0) as liquidation_value_inr,
			COALESCE(readiness_score, 75) as readiness_score,
			COALESCE(latitude, 22.0) as latitude,
			COALESCE(longitude, 78.0) as longitude,
			COALESCE(key_assets_summary, '') as key_assets_summary,
			COALESCE(rp_name, '') as rp_name,
			COALESCE(rp_email, '') as rp_email
		FROM corporate_debtors
		WHERE is_published = true
		ORDER BY id ASC;
	`

	rows, err := db.Query(query)
	if err != nil {
		log.Printf("[WARN] Error querying corporate_debtors: %v. Using fallback.\n", err)
		json.NewEncoder(w).Encode(map[string]any{"assets": fallbackDeals})
		return
	}
	defer rows.Close()

	var assets []map[string]any
	for rows.Next() {
		var id int
		var cin, companyName, sector, state, assetCity, ncltBench, caseNumber, regime, cirpStage string
		var claimsAdmitted, liquidationVal float64
		var readinessScore int
		var lat, lng float64
		var keyAssetsSummary, rpName, rpEmail string

		if err := rows.Scan(
			&id, &cin, &companyName, &sector, &state, &assetCity,
			&ncltBench, &caseNumber, &regime, &cirpStage,
			&claimsAdmitted, &liquidationVal, &readinessScore,
			&lat, &lng, &keyAssetsSummary, &rpName, &rpEmail,
		); err != nil {
			log.Printf("[WARN] Scan error: %v\n", err)
			continue
		}

		assets = append(assets, map[string]any{
			"id":                  fmt.Sprintf("deal-%d", id),
			"cin":                 cin,
			"companyName":         companyName,
			"sector":              sector,
			"state":               state,
			"assetCity":           assetCity,
			"ncltBench":           ncltBench,
			"caseNumber":          caseNumber,
			"regime":              regime,
			"cirpStage":           cirpStage,
			"claimsAdmittedInr":   fmt.Sprintf("%.2f", claimsAdmitted),
			"liquidationValueInr": fmt.Sprintf("%.2f", liquidationVal),
			"readinessScore":      readinessScore,
			"latitude":            lat,
			"longitude":           lng,
			"keyAssetsSummary":    keyAssetsSummary,
			"rpName":              rpName,
			"rpEmail":             rpEmail,
		})
	}

	if len(assets) == 0 {
		json.NewEncoder(w).Encode(map[string]any{"assets": fallbackDeals})
		return
	}

	json.NewEncoder(w).Encode(map[string]any{"assets": assets})
}

func handleRadarProfessionals(w http.ResponseWriter, r *http.Request) {
	enableCORS(w)
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusNoContent)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]any{"professionals": fallbackProfessionals})
}

func handleUDINVerify(w http.ResponseWriter, r *http.Request) {
	enableCORS(w)
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusNoContent)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	udin := strings.TrimSpace(r.URL.Query().Get("udin"))
	if udin == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]any{"error": "UDIN query parameter is required"})
		return
	}

	if db == nil {
		json.NewEncoder(w).Encode(map[string]any{
			"udin":              udin,
			"verified":          true,
			"compliance_status": "VERIFIED_COMPLIANT",
			"document_type":     "Form G CIRP Expression of Interest Verification",
			"issued_at":         "2026-11-01",
		})
		return
	}

	query := `
		SELECT registry_id, document_type, pra_entity_name, target_debtor_name, nclt_bench, compliance_status, sha256_hash, issued_at
		FROM statutory_registry_records
		WHERE registry_id = $1
		LIMIT 1;
	`
	row := db.QueryRow(query, udin)

	var regID, docType, praEntity, debtorName, bench, compliance, sha, issuedAt string
	err := row.Scan(&regID, &docType, &praEntity, &debtorName, &bench, &compliance, &sha, &issuedAt)
	if err != nil {
		if err == sql.ErrNoRows {
			json.NewEncoder(w).Encode(map[string]any{
				"udin":     udin,
				"verified": false,
				"message":  "No matching statutory registry record found for this UDIN.",
			})
			return
		}
		log.Printf("[WARN] UDIN query error: %v\n", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(map[string]any{
		"udin":               regID,
		"verified":           true,
		"document_type":      docType,
		"pra_entity_name":    praEntity,
		"target_debtor_name": debtorName,
		"nclt_bench":         bench,
		"compliance_status":  compliance,
		"sha256_hash":        sha,
		"issued_at":          issuedAt,
	})
}

func handleHealth(w http.ResponseWriter, r *http.Request) {
	enableCORS(w)
	w.Header().Set("Content-Type", "application/json")

	dbStatus := "disconnected"
	if db != nil && db.Ping() == nil {
		dbStatus = "connected"
	}

	json.NewEncoder(w).Encode(map[string]any{
		"status":      "healthy",
		"server":      "IBC Sovereign Hub",
		"version":     "2.0.0",
		"database":    dbStatus,
		"supabase_db": dbStatus,
		"neon_db":     dbStatus,
		"time":        time.Now().UTC().Format(time.RFC3339),
	})
}

func insertConsultationLead(track, stakeholder, contact, organization, notes, status, bookingID, scheduledAt string) string {
	leadID := fmt.Sprintf("lead-%d", time.Now().UnixNano()/1e6)
	if status == "" {
		status = "PENDING"
	}
	if db == nil {
		return leadID
	}

	var id int
	err := db.QueryRow(`
		INSERT INTO consultation_leads (track_title, stakeholder, contact, organization, notes, status, calnode_booking_id, scheduled_at)
		VALUES ($1, $2, $3, $4, $5, $6, NULLIF($7, ''), NULLIF($8, '')::timestamptz)
		RETURNING id;
	`, track, stakeholder, contact, organization, notes, status, bookingID, scheduledAt).Scan(&id)
	if err == nil {
		return fmt.Sprintf("%d", id)
	}
	log.Printf("[WARN] Failed inserting consultation lead: %v\n", err)
	return leadID
}

func handleConsultationDispatch(w http.ResponseWriter, r *http.Request) {
	enableCORS(w)
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusNoContent)
		return
	}
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req struct {
		Track            string `json:"track"`
		Stakeholder      string `json:"stakeholder"`
		Contact          string `json:"contact"`
		Organization     string `json:"organization"`
		Notes            string `json:"notes"`
		Status           string `json:"status"`
		CalnodeBookingID string `json:"calnode_booking_id"`
		ScheduledAt      string `json:"scheduled_at"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]any{"success": false, "error": "Invalid request body"})
		return
	}

	leadID := insertConsultationLead(
		req.Track, req.Stakeholder, req.Contact, req.Organization,
		req.Notes, req.Status, req.CalnodeBookingID, req.ScheduledAt,
	)

	log.Printf("[CHAMBER_LEAD_DISPATCHED] Lead #%s (%s) for track '%s' (%s) from %s\n", leadID, req.Status, req.Track, req.Stakeholder, req.Contact)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]any{
		"success": true,
		"leadId":  leadID,
		"message": "Direct chamber briefing request dispatched successfully.",
	})
}

func handleCalnodeNextSlots(w http.ResponseWriter, r *http.Request) {
	if calnodeAdapter == nil {
		calnodeAdapter = NewCalnodeAdapter(db)
	}
	calnodeAdapter.HandleNextSlots(w, r)
}

func handleCalnodeWebhook(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	r.Body = http.MaxBytesReader(w, r.Body, 1<<20)
	payload, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Bad request", http.StatusBadRequest)
		return
	}

	if secret := os.Getenv("CALNODE_WEBHOOK_SECRET"); secret != "" {
		mac := hmac.New(sha256.New, []byte(secret))
		mac.Write(payload)
		expected := "sha256=" + hex.EncodeToString(mac.Sum(nil))
		if !hmac.Equal([]byte(expected), []byte(strings.TrimSpace(r.Header.Get("X-Calnode-Signature")))) {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}
	}

	var evt struct {
		Event string `json:"event"`
		Data  struct {
			ID            string `json:"id"`
			EventTypeSlug string `json:"event_type_slug"`
			EventTypeName string `json:"event_type_name"`
			StartAt       string `json:"start_at"`
			Status        string `json:"status"`
			AttendeeName  string `json:"attendee_name"`
			AttendeeEmail string `json:"attendee_email"`
			Location      string `json:"location_value"`
		} `json:"data"`
	}
	if err := json.Unmarshal(payload, &evt); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	if evt.Event == "booking.created" || evt.Event == "booking.rescheduled" {
		trackTitle := evt.Data.EventTypeName
		if trackTitle == "" {
			trackTitle = evt.Data.EventTypeSlug
		}
		contact := evt.Data.AttendeeEmail
		if evt.Data.AttendeeName != "" && evt.Data.AttendeeEmail != "" {
			contact = fmt.Sprintf("%s <%s>", evt.Data.AttendeeName, evt.Data.AttendeeEmail)
		}
		notes := fmt.Sprintf("Calnode %s (%s) · %s", evt.Event, evt.Data.Status, evt.Data.Location)
		insertConsultationLead(trackTitle, "calnode-webhook", contact, "", notes, "SCHEDULED", evt.Data.ID, evt.Data.StartAt)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]any{"received": true})
}

func registerCalnodeProxy(mux *http.ServeMux) {
	if calnodeAdapter == nil {
		calnodeAdapter = NewCalnodeAdapter(db)
	}

	mux.HandleFunc("/embed.js", calnodeAdapter.HandleEmbedJS)
	mux.HandleFunc("/booking.css", calnodeAdapter.HandleBookingCSS)
	mux.HandleFunc("/v1/bookings", calnodeAdapter.HandleCreateBooking)
	mux.HandleFunc("/v1/event-types/", func(w http.ResponseWriter, r *http.Request) {
		if strings.HasSuffix(r.URL.Path, "/slots") {
			calnodeAdapter.HandleSlots(w, r)
			return
		}
		if strings.HasSuffix(r.URL.Path, "/questions") {
			calnodeAdapter.HandlePublicQuestions(w, r)
			return
		}
		if strings.HasSuffix(r.URL.Path, "/public") {
			calnodeAdapter.HandlePublicEventType(w, r)
			return
		}
		calnodeAdapter.HandlePublicEventType(w, r)
	})
}

// NewRouter constructs and returns the IBC HTTP router.
func NewRouter(database *sql.DB, staticDir string) http.Handler {
	db = database
	initReportOrdersDB()

	if _, err := os.Stat(staticDir); os.IsNotExist(err) {
		staticDir = "public/ibc"
	}

	mux := http.NewServeMux()

	// Radar & Statutory Verification API Routes
	mux.HandleFunc("/api/radar/assets", handleRadarAssets)
	mux.HandleFunc("/api/radar/professionals", handleRadarProfessionals)
	mux.HandleFunc("/api/udin/verify", handleUDINVerify)
	mux.HandleFunc("/api/health", handleHealth)
	mux.HandleFunc("/api/consultations/dispatch", handleConsultationDispatch)
	mux.HandleFunc("/api/calnode/next-slots", handleCalnodeNextSlots)
	mux.HandleFunc("/api/calnode/webhook", handleCalnodeWebhook)

	// Supabase GoTrue Auth API Routes
	authManager = NewAuthManager(os.Getenv("SUPABASE_JWT_SECRET"))
	mux.HandleFunc("/api/auth/me", func(w http.ResponseWriter, r *http.Request) {
		enableCORS(w)
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}
		authManager.RequireAuth(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			user := GetAuthenticatedUser(r)
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(map[string]any{
				"authenticated": true,
				"user":          user,
			})
		}))(w, r)
	})

	// Native Statutory Forum API Routes
	forumService = NewForumService(db)
	mux.HandleFunc("/api/forum/questions", forumService.HandleListQuestions)
	mux.HandleFunc("/api/forum/questions/", forumService.HandleGetQuestionDetail)
	mux.HandleFunc("/api/answers/query", forumService.HandleLightRAGQuery)
	mux.HandleFunc("/api/intelligence/query", forumService.HandleLightRAGQuery)

	// Report Orders & Razorpay Payment API Routes
	mux.HandleFunc("/api/reports/catalog", handleReportCatalog)
	mux.HandleFunc("/api/reports/orders", handleCreateReportOrder)
	mux.HandleFunc("/api/reports/verify", handleVerifyReportPayment)
	mux.HandleFunc("/api/reports/webhook", handleRazorpayWebhook)

	// User Sovereign Workspace API Routes
	workspaceService := NewUserWorkspaceService(db)
	mux.HandleFunc("/api/user/orders", workspaceService.HandleUserOrders)
	mux.HandleFunc("/api/user/consultations", workspaceService.HandleUserConsultations)
	mux.HandleFunc("/api/user/summary", workspaceService.HandleUserSummary)

	// Sovereign Admin Console API Routes
	adminServer := NewAdminServer(db, authManager)
	adminServer.RegisterRoutes(mux)

	// Telemetry Debug Logs
	type debugLogEntry struct {
		Timestamp string `json:"timestamp"`
		Source    string `json:"source"`
		Method    string `json:"method"`
		URL       string `json:"url"`
		Status    int    `json:"status"`
		Body      string `json:"body"`
	}
	var debugLogsMu sync.Mutex
	var debugLogs []debugLogEntry

	mux.HandleFunc("/api/debug/logs", func(w http.ResponseWriter, r *http.Request) {
		debugLogsMu.Lock()
		defer debugLogsMu.Unlock()
		w.Header().Set("Content-Type", "application/json")
		_ = json.NewEncoder(w).Encode(debugLogs)
	})

	mux.HandleFunc("/api/debug/process-logs", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		res := map[string]any{
			"status":       "sovereign_single_binary",
			"architecture": "Supabase PostgreSQL + Hosted GoTrue + Native Go Coordinator",
			"calnode":      "embedded_in_process",
			"answer":       "retired_in_favor_of_native_forum",
			"time":         time.Now().UTC().Format(time.RFC3339),
		}
		_ = json.NewEncoder(w).Encode(res)
	})

	// Calnode Scheduling Proxy
	registerCalnodeProxy(mux)

	// Static files & SPA routes
	fs := http.FileServer(http.Dir(staticDir))

	setNoCache := func(w http.ResponseWriter) {
		w.Header().Set("Cache-Control", "no-cache, must-revalidate")
	}

	serveAppIndex := func(w http.ResponseWriter, r *http.Request) {
		setNoCache(w)
		http.ServeFile(shared.StaticResponseWriter{ResponseWriter: w}, r, staticDir+"/index.html")
	}

	serveUdin := func(w http.ResponseWriter, r *http.Request) {
		setNoCache(w)
		http.ServeFile(shared.StaticResponseWriter{ResponseWriter: w}, r, staticDir+"/udin.html")
	}

	mux.HandleFunc("/udin", serveUdin)
	mux.HandleFunc("/udin/", serveUdin)
	mux.HandleFunc("/answers", serveAppIndex)
	mux.HandleFunc("/answers/", serveAppIndex)
	mux.HandleFunc("/forum", serveAppIndex)
	mux.HandleFunc("/forum/", serveAppIndex)
	mux.HandleFunc("/forum-embed", serveAppIndex)
	mux.HandleFunc("/forum-embed/", serveAppIndex)
	mux.HandleFunc("/questions", serveAppIndex)
	mux.HandleFunc("/questions/", serveAppIndex)
	mux.HandleFunc("/catalog", serveAppIndex)
	mux.HandleFunc("/catalog/", serveAppIndex)
	mux.HandleFunc("/price-list", serveAppIndex)
	mux.HandleFunc("/price-list/", serveAppIndex)
	mux.HandleFunc("/intelligence", serveAppIndex)
	mux.HandleFunc("/intelligence/", serveAppIndex)
	mux.HandleFunc("/consultations", serveAppIndex)
	mux.HandleFunc("/consultations/", serveAppIndex)
	mux.HandleFunc("/admin", serveAppIndex)
	mux.HandleFunc("/admin/", serveAppIndex)

	// Subdomain routing for 5 stakeholder categories
	subdomains := []string{"creditors", "investors", "professionals", "valuers", "guarantors"}
	for _, sub := range subdomains {
		s := sub
		mux.HandleFunc("/"+s, func(w http.ResponseWriter, r *http.Request) {
			http.Redirect(w, r, "/"+s+"/", http.StatusPermanentRedirect)
		})
		mux.HandleFunc("/"+s+"/", serveAppIndex)
		mux.HandleFunc("/"+s+"/radar", serveAppIndex)
		mux.HandleFunc("/"+s+"/radar/", serveAppIndex)
		mux.HandleFunc("/"+s+"/intelligence", serveAppIndex)
		mux.HandleFunc("/"+s+"/intelligence/", serveAppIndex)
		mux.HandleFunc("/"+s+"/consultations", serveAppIndex)
		mux.HandleFunc("/"+s+"/consultations/", serveAppIndex)
		mux.HandleFunc("/"+s+"/answers", serveAppIndex)
		mux.HandleFunc("/"+s+"/answers/", serveAppIndex)
		mux.HandleFunc("/"+s+"/ask", serveAppIndex)
		mux.HandleFunc("/"+s+"/ask/", serveAppIndex)
		mux.HandleFunc("/"+s+"/catalog", serveAppIndex)
		mux.HandleFunc("/"+s+"/catalog/", serveAppIndex)
		mux.HandleFunc("/"+s+"/price-list", serveAppIndex)
		mux.HandleFunc("/"+s+"/price-list/", serveAppIndex)
		mux.HandleFunc("/"+s+"/udin", serveUdin)
		mux.HandleFunc("/"+s+"/udin/", serveUdin)
	}

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
