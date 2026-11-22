package bns

import (
	"crypto/rand"
	"database/sql"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"
	"sync"
	"time"
)

// ConsultationEventType represents one of the 15 statutory IBC advisory tracks.
type ConsultationEventType struct {
	Slug        string `json:"slug"`
	Title       string `json:"title"`
	DurationMin int    `json:"duration_minutes"`
	Description string `json:"description"`
	Stakeholder string `json:"stakeholder"`
}

// CalnodeAdapter provides embedded, in-process Calnode scheduling without an external daemon.
type CalnodeAdapter struct {
	db             *sql.DB
	eventTypes     map[string]ConsultationEventType
	mu             sync.RWMutex
	embedPath      string
	bookingCSSPath string
	i18nRaw        json.RawMessage
}

// NewCalnodeAdapter initializes the embedded scheduler with all 15 IBC consultation tracks.
func NewCalnodeAdapter(db *sql.DB) *CalnodeAdapter {
	adapter := &CalnodeAdapter{
		db:         db,
		eventTypes: make(map[string]ConsultationEventType),
	}

	tracks := []ConsultationEventType{
		// Creditors
		{
			Slug:        "admitted-claims-distribution-briefing",
			Title:       "admitted claims & distribution briefing",
			DurationMin: 45,
			Description: "Section 53 waterfall ranking, voting share audit & interim distribution clearance.",
			Stakeholder: "creditors",
		},
		{
			Slug:        "coc-representation-voting-advisory",
			Title:       "coc representation & voting advisory",
			DurationMin: 30,
			Description: "E-voting compliance, dissenting financial creditor protection & statutory agendas.",
			Stakeholder: "creditors",
		},
		{
			Slug:        "avoidance-pufe-recovery-strategy",
			Title:       "avoidance & pufe recovery strategy",
			DurationMin: 45,
			Description: "Forensic clawback of siphoned assets & Section 43/45/66 preference reversals.",
			Stakeholder: "creditors",
		},
		// Investors
		{
			Slug:        "resolution-plan-compliance-advisory",
			Title:       "resolution plan compliance advisory",
			DurationMin: 45,
			Description: "Pre-submission audit & CIRP Regulation 38 statutory feasibility scorecards.",
			Stakeholder: "investors",
		},
		{
			Slug:        "form-g-bid-eoi-clearance",
			Title:       "form g bid & eoi clearance",
			DurationMin: 30,
			Description: "Eligibility verification, EOI documentation & statutory earnest deposit kits.",
			Stakeholder: "investors",
		},
		{
			Slug:        "clean-slate-sec-32a-ringfencing",
			Title:       "clean-slate sec 32a ringfencing",
			DurationMin: 45,
			Description: "Section 32A immunity rings protecting acquired assets from historical offenses.",
			Stakeholder: "investors",
		},
		// Professionals
		{
			Slug:        "udin-generation-statutory-verification",
			Title:       "udin generation & statutory verification",
			DurationMin: 30,
			Description: "Statutory 18-digit unique document identification with zero document upload.",
			Stakeholder: "professionals",
		},
		{
			Slug:        "cirp-timeline-coc-compliance",
			Title:       "cirp timeline & coc compliance",
			DurationMin: 45,
			Description: "Mandatory IBBI disclosure kits, 330-day statutory clocks & CoC voting ledgers.",
			Stakeholder: "professionals",
		},
		{
			Slug:        "pufe-forensic-avoidance-audit",
			Title:       "pufe forensic avoidance audit",
			DurationMin: 45,
			Description: "Section 43/45/66 clawback applications & siphoned asset reversal mandates.",
			Stakeholder: "professionals",
		},
		// Valuers
		{
			Slug:        "liquidation-fair-value-synthesis",
			Title:       "liquidation & fair value synthesis",
			DurationMin: 45,
			Description: "Methodology alignment under Regulation 35 with dual-valuer variance reconciliation.",
			Stakeholder: "valuers",
		},
		{
			Slug:        "plant-machinery-discounting-review",
			Title:       "plant & machinery discounting review",
			DurationMin: 30,
			Description: "Statutory depreciation matrices, scrap vs going-concern valuation audits.",
			Stakeholder: "valuers",
		},
		{
			Slug:        "section-29a-haircut-analysis",
			Title:       "section 29a haircut & realization analysis",
			DurationMin: 45,
			Description: "Resolution applicant connected-party checks & stressed asset recovery models.",
			Stakeholder: "valuers",
		},
		// Guarantors
		{
			Slug:        "personal-guarantor-insolvency-defense",
			Title:       "personal guarantor insolvency defense",
			DurationMin: 45,
			Description: "Part III proceedings, demand notice vetting & dual-proceeding co-extensive risk audits.",
			Stakeholder: "guarantors",
		},
		{
			Slug:        "interim-moratorium-ringfence",
			Title:       "interim moratorium ringfence",
			DurationMin: 30,
			Description: "Section 96 protective bubbles staying civil enforcement during creditor negotiation.",
			Stakeholder: "guarantors",
		},
		{
			Slug:        "repayment-plan-negotiation",
			Title:       "repayment plan negotiation & mediation",
			DurationMin: 45,
			Description: "Pre-bankruptcy structured settlement packs & guarantor debt composition frameworks.",
			Stakeholder: "guarantors",
		},
	}

	for _, t := range tracks {
		adapter.eventTypes[t.Slug] = t
	}

	// Resolve path to calnode embed.js
	possiblePaths := []string{
		"calnode/internal/handler/embed.js",
		"../calnode/internal/handler/embed.js",
	}
	for _, p := range possiblePaths {
		if _, err := os.Stat(p); err == nil {
			adapter.embedPath = p
			break
		}
	}

	// Resolve path to booking.css
	possibleCSS := []string{
		"calnode/internal/handler/templates/booking.css",
		"../calnode/internal/handler/templates/booking.css",
	}
	for _, p := range possibleCSS {
		if _, err := os.Stat(p); err == nil {
			adapter.bookingCSSPath = p
			break
		}
	}

	// Resolve path to en.json i18n
	possibleI18n := []string{
		"calnode/internal/i18n/locales/en.json",
		"../calnode/internal/i18n/locales/en.json",
	}
	for _, p := range possibleI18n {
		if data, err := os.ReadFile(p); err == nil {
			adapter.i18nRaw = json.RawMessage(data)
			break
		}
	}

	return adapter
}

// GenerateSlots produces statutory advisory slots in IST between 11 am and 4 pm.
func (a *CalnodeAdapter) GenerateSlots(from, to time.Time, loc *time.Location, durationMin int) []map[string]string {
	if durationMin <= 0 {
		durationMin = 45
	}
	if loc == nil {
		loc = time.FixedZone("IST", 5*3600+1800)
	}

	slotHours := []int{11, 12, 14, 15} // 11 am, 12 pm, 2 pm, 3 pm
	var slots []map[string]string

	cur := time.Date(from.Year(), from.Month(), from.Day(), 0, 0, 0, 0, loc)
	end := time.Date(to.Year(), to.Month(), to.Day(), 23, 59, 59, 0, loc)

	now := time.Now().In(loc)

	for !cur.After(end) {
		// Skip weekends
		if cur.Weekday() != time.Saturday && cur.Weekday() != time.Sunday {
			for _, h := range slotHours {
				slotStart := time.Date(cur.Year(), cur.Month(), cur.Day(), h, 0, 0, 0, loc)
				if slotStart.After(now.Add(2 * time.Hour)) { // at least 2h lead time
					slotEnd := slotStart.Add(time.Duration(durationMin) * time.Minute)
					slots = append(slots, map[string]string{
						"start": slotStart.Format(time.RFC3339),
						"end":   slotEnd.Format(time.RFC3339),
						"label": slotStart.Format("Mon, Jan 02 · 3:04 PM"),
					})
				}
			}
		}
		cur = cur.AddDate(0, 0, 1)
	}

	return slots
}

// HandlePublicEventType serves GET /v1/event-types/:slug/public
func (a *CalnodeAdapter) HandlePublicEventType(w http.ResponseWriter, r *http.Request) {
	enableCORS(w)
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusNoContent)
		return
	}

	parts := strings.Split(strings.Trim(r.URL.Path, "/"), "/")
	if len(parts) < 3 {
		http.Error(w, `{"error":"missing event type slug"}`, http.StatusBadRequest)
		return
	}
	slug := parts[2]

	a.mu.RLock()
	et, exists := a.eventTypes[slug]
	a.mu.RUnlock()

	if !exists {
		// Provide default statutory event type
		et = ConsultationEventType{
			Slug:        slug,
			Title:       strings.ReplaceAll(slug, "-", " "),
			DurationMin: 45,
			Description: "Statutory IBC Chamber Consultation",
			Stakeholder: "general",
		}
	}

	durLabel := fmt.Sprintf("%d min", et.DurationMin)
	if et.DurationMin >= 60 && et.DurationMin%60 == 0 {
		durLabel = fmt.Sprintf("%d hour", et.DurationMin/60)
	}

	i18nData := a.i18nRaw
	if len(i18nData) == 0 {
		i18nData = json.RawMessage(`{
			"book_by_chat": "Book by chat",
			"close": "Close",
			"show_more": "Show more",
			"show_less": "Show less",
			"select_day_hint": "Select a day to see available times.",
			"back": "Back",
			"name_label": "Name",
			"name_placeholder": "Your full name",
			"email_label": "Email",
			"email_placeholder": "you@example.com",
			"choose_option": "Choose an option",
			"confirm_booking": "Confirm booking",
			"confirming": "Confirming…",
			"booking_confirmed": "Booking confirmed",
			"confirmation_email_sent": "A confirmation email has been sent to you.",
			"slot_taken": "already booked",
			"slot_taken_error": "That slot was just taken. Please choose another time.",
			"booking_failed_error": "Booking failed. Please try again.",
			"no_available_times": "No available times on %s. Try another date.",
			"no_available_times_host": "%[1]s has no available times on %[2]s. Try another date.",
			"all_times_taken": "Every time on this day is booked.",
			"times_shown_in": "Times shown in ",
			"time_period": "Time of day",
			"time_morning": "Morning",
			"time_afternoon": "Afternoon",
			"time_evening": "Evening",
			"min_notice_hint": "Bookings must be made at least %s in advance.",
			"list_separator": ", ",
			"list_conjunction": " & ",
			"other": "other",
			"others": "others",
			"powered_by": "powered by"
		}`)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]any{
		"slug":                      et.Slug,
		"name":                      et.Title,
		"title":                     et.Title,
		"duration_minutes":          et.DurationMin,
		"duration_label":            durLabel,
		"description":               et.Description,
		"stakeholder":               et.Stakeholder,
		"location_type":             "video",
		"location_label":            "Chamber / Video Advisory",
		"booking_accent":            "#059669",
		"booking_accent_foreground": "#ffffff",
		"max_future_days":           30,
		"min_notice_minutes":        120,
		"min_notice_label":          "2 hours",
		"allow_phone_call":          false,
		"assistant_enabled":         false,
		"assistant_greeting":        "",
		"price_cents":               0,
		"currency":                  "INR",
		"timezone":                  "Asia/Kolkata",
		"locale":                    "en",
		"i18n":                      i18nData,
		"hosts": []map[string]any{
			{
				"name": "OpenIBC Statutory Desk",
			},
		},
		"booking_fields": []map[string]any{
			{"name": "name", "type": "text", "required": true, "label": "Full Name"},
			{"name": "email", "type": "email", "required": true, "label": "Email Address"},
			{"name": "phone", "type": "phone", "required": false, "label": "Mobile Phone"},
			{"name": "notes", "type": "textarea", "required": false, "label": "Case Brief / NCLT Bench"},
		},
	})
}

// HandlePublicQuestions serves GET /v1/event-types/:slug/questions
func (a *CalnodeAdapter) HandlePublicQuestions(w http.ResponseWriter, r *http.Request) {
	enableCORS(w)
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusNoContent)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]any{
		"items": []any{},
	})
}

// HandleBookingCSS serves /booking.css for the Calnode embed component
func (a *CalnodeAdapter) HandleBookingCSS(w http.ResponseWriter, r *http.Request) {
	enableCORS(w)
	w.Header().Set("Content-Type", "text/css; charset=utf-8")
	w.Header().Set("Cache-Control", "public, max-age=3600")

	if a.bookingCSSPath != "" {
		http.ServeFile(w, r, a.bookingCSSPath)
		return
	}

	w.Write([]byte("/* OpenIBC booking styles */\n"))
}

// HandleSlots serves GET /v1/event-types/:slug/slots
func (a *CalnodeAdapter) HandleSlots(w http.ResponseWriter, r *http.Request) {
	enableCORS(w)
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusNoContent)
		return
	}

	parts := strings.Split(strings.Trim(r.URL.Path, "/"), "/")
	if len(parts) < 3 {
		http.Error(w, `{"error":"missing event type slug"}`, http.StatusBadRequest)
		return
	}
	slug := parts[2]

	a.mu.RLock()
	et, exists := a.eventTypes[slug]
	a.mu.RUnlock()

	dur := 45
	if exists && et.DurationMin > 0 {
		dur = et.DurationMin
	}

	tzName := r.URL.Query().Get("tz")
	if tzName == "" {
		tzName = "Asia/Kolkata"
	}
	loc, err := time.LoadLocation(tzName)
	if err != nil {
		loc = time.FixedZone("IST", 5*3600+1800)
	}

	fromStr := r.URL.Query().Get("from")
	toStr := r.URL.Query().Get("to")

	now := time.Now().In(loc)
	from := now
	to := now.AddDate(0, 0, 7)

	if fromStr != "" {
		if t, err := time.Parse("2006-01-02", fromStr); err == nil {
			from = t
		}
	}
	if toStr != "" {
		if t, err := time.Parse("2006-01-02", toStr); err == nil {
			to = t
		}
	}

	slots := a.GenerateSlots(from, to, loc, dur)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]any{
		"slots": slots,
	})
}

// HandleCreateBooking serves POST /v1/bookings
func (a *CalnodeAdapter) HandleCreateBooking(w http.ResponseWriter, r *http.Request) {
	enableCORS(w)
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusNoContent)
		return
	}

	var req struct {
		Slug          string `json:"slug"`
		EventTypeSlug string `json:"event_type_slug"`
		Name          string `json:"name"`
		Email         string `json:"email"`
		Phone         string `json:"phone"`
		Notes         string `json:"notes"`
		StartTime     string `json:"start_time"`
		StartAt       string `json:"start_at"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, `{"error":"invalid request body"}`, http.StatusBadRequest)
		return
	}

	slug := req.EventTypeSlug
	if slug == "" {
		slug = req.Slug
	}
	startTime := req.StartAt
	if startTime == "" {
		startTime = req.StartTime
	}

	// Generate clean booking ID
	b := make([]byte, 8)
	_, _ = rand.Read(b)
	bookingID := "bk_" + hex.EncodeToString(b)

	// Save lead in database if available
	if a.db != nil {
		var schedTime sql.NullTime
		if t, err := time.Parse(time.RFC3339, startTime); err == nil {
			schedTime = sql.NullTime{Time: t, Valid: true}
		}

		_, err := a.db.Exec(`
			INSERT INTO consultation_leads (
				track_title, stakeholder, contact, organization, notes, status, calnode_booking_id, scheduled_at
			) VALUES ($1, $2, $3, $4, $5, 'CONFIRMED', $6, $7)
		`, slug, "consultation", req.Email, req.Name, req.Notes, bookingID, schedTime)
		if err != nil {
			log.Printf("[WARN] Failed to record booking in consultation_leads: %v", err)
		}
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]any{
		"id":           bookingID,
		"uid":          bookingID,
		"slug":         slug,
		"status":       "ACCEPTED",
		"scheduled_at": startTime,
		"contact":      req.Email,
		"message":      "Statutory briefing confirmed. Chambers will connect at the scheduled time.",
	})
}

// HandleNextSlots handles GET /api/calnode/next-slots directly in memory (< 1ms).
func (a *CalnodeAdapter) HandleNextSlots(w http.ResponseWriter, r *http.Request) {
	enableCORS(w)
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusNoContent)
		return
	}

	slug := strings.TrimSpace(r.URL.Query().Get("slug"))
	if slug == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]any{"available": false, "error": "slug is required"})
		return
	}

	tzName := strings.TrimSpace(r.URL.Query().Get("tz"))
	if tzName == "" {
		tzName = "Asia/Kolkata"
	}
	loc, err := time.LoadLocation(tzName)
	if err != nil {
		loc = time.FixedZone("IST", 5*3600+1800)
	}

	now := time.Now().In(loc)
	slots := a.GenerateSlots(now, now.AddDate(0, 0, 7), loc, 45)

	maxSlots := 3
	if len(slots) < maxSlots {
		maxSlots = len(slots)
	}

	nextChips := slots[:maxSlots]

	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Cache-Control", "no-store")
	json.NewEncoder(w).Encode(map[string]any{
		"available":   true,
		"total_slots": len(slots),
		"next_slots":  nextChips,
	})
}

// HandleEmbedJS serves /embed.js directly from disk.
func (a *CalnodeAdapter) HandleEmbedJS(w http.ResponseWriter, r *http.Request) {
	enableCORS(w)
	w.Header().Set("Content-Type", "application/javascript; charset=utf-8")
	w.Header().Set("Cache-Control", "public, max-age=3600")

	if a.embedPath != "" {
		http.ServeFile(w, r, a.embedPath)
		return
	}

	// Minimal fallback embed widget if embedPath is missing
	w.Write([]byte(`console.log("[OpenIBC] Calnode embedded scheduler active.");`))
}
