package ibc

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"strings"
	"time"
)

// UserConsultation represents a scheduled briefing lead for the user.
type UserConsultation struct {
	ID               int64      `json:"id"`
	TrackTitle       string     `json:"track_title"`
	Stakeholder      string     `json:"stakeholder"`
	Contact          string     `json:"contact"`
	Organization     string     `json:"organization"`
	Notes            string     `json:"notes"`
	Status           string     `json:"status"`
	CalnodeBookingID string     `json:"calnode_booking_id"`
	ScheduledAt      *time.Time `json:"scheduled_at"`
	CreatedAt        time.Time  `json:"created_at"`
}

// UserWorkspaceService handles workspace queries for authenticated practitioners.
type UserWorkspaceService struct {
	db *sql.DB
}

// NewUserWorkspaceService initializes the workspace service.
func NewUserWorkspaceService(db *sql.DB) *UserWorkspaceService {
	return &UserWorkspaceService{db: db}
}

// HandleUserOrders returns reports and dossiers purchased by the user.
func (s *UserWorkspaceService) HandleUserOrders(w http.ResponseWriter, r *http.Request) {
	enableCORS(w)
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	email := strings.TrimSpace(strings.ToLower(r.URL.Query().Get("email")))
	if email == "" {
		// Attempt reading from authenticated user context if present
		if user := GetAuthenticatedUser(r); user != nil {
			email = strings.TrimSpace(strings.ToLower(user.Email))
		}
	}
	if email == "" {
		http.Error(w, `{"error":"missing required email query parameter"}`, http.StatusBadRequest)
		return
	}

	var orders []*ReportOrder

	if s.db != nil {
		rows, err := s.db.Query(`
			SELECT id, report_slug, report_title, amount_paise, currency, buyer_name, buyer_email, buyer_phone,
			       target_entity, notes, razorpay_order_id, razorpay_payment_id, status, mode, email_sent_at, created_at, paid_at
			FROM report_orders
			WHERE LOWER(buyer_email) = $1
			ORDER BY created_at DESC
		`, email)
		if err == nil {
			defer rows.Close()
			for rows.Next() {
				var o ReportOrder
				var emailSentAt, paidAt sql.NullTime
				var notes, rzpOrder, rzpPayment sql.NullString
				if err := rows.Scan(
					&o.ID, &o.ReportSlug, &o.ReportTitle, &o.AmountPaise, &o.Currency, &o.BuyerName, &o.BuyerEmail, &o.BuyerPhone,
					&o.TargetEntity, &notes, &rzpOrder, &rzpPayment, &o.Status, &o.Mode, &emailSentAt, &o.CreatedAt, &paidAt,
				); err == nil {
					if notes.Valid {
						o.Notes = notes.String
					}
					if rzpOrder.Valid {
						o.RazorpayOrderID = rzpOrder.String
					}
					if rzpPayment.Valid {
						o.RazorpayPaymentID = rzpPayment.String
					}
					if emailSentAt.Valid {
						t := emailSentAt.Time
						o.EmailSentAt = &t
					}
					if paidAt.Valid {
						t := paidAt.Time
						o.PaidAt = &t
					}
					orders = append(orders, &o)
				}
			}
		}
	}

	// In-memory fallback if db has no matches or db is nil
	if len(orders) == 0 {
		memOrdersMu.RLock()
		for _, o := range memOrdersByID {
			if strings.EqualFold(o.BuyerEmail, email) {
				orders = append(orders, o)
			}
		}
		memOrdersMu.RUnlock()
	}

	if orders == nil {
		orders = []*ReportOrder{}
	}

	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(map[string]any{
		"orders": orders,
		"count":  len(orders),
	})
}

// HandleUserConsultations returns Calnode advisory sessions booked by the user.
func (s *UserWorkspaceService) HandleUserConsultations(w http.ResponseWriter, r *http.Request) {
	enableCORS(w)
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	email := strings.TrimSpace(strings.ToLower(r.URL.Query().Get("email")))
	if email == "" {
		if user := GetAuthenticatedUser(r); user != nil {
			email = strings.TrimSpace(strings.ToLower(user.Email))
		}
	}
	if email == "" {
		http.Error(w, `{"error":"missing required email query parameter"}`, http.StatusBadRequest)
		return
	}

	var consultations []UserConsultation

	if s.db != nil {
		rows, err := s.db.Query(`
			SELECT id, track_title, stakeholder, contact, organization, notes, status,
			       COALESCE(calnode_booking_id, ''), scheduled_at, created_at
			FROM consultation_leads
			WHERE LOWER(contact) = $1
			ORDER BY COALESCE(scheduled_at, created_at) DESC
		`, email)
		if err == nil {
			defer rows.Close()
			for rows.Next() {
				var c UserConsultation
				var schedTime sql.NullTime
				if err := rows.Scan(
					&c.ID, &c.TrackTitle, &c.Stakeholder, &c.Contact, &c.Organization, &c.Notes,
					&c.Status, &c.CalnodeBookingID, &schedTime, &c.CreatedAt,
				); err == nil {
					if schedTime.Valid {
						t := schedTime.Time
						c.ScheduledAt = &t
					}
					consultations = append(consultations, c)
				}
			}
		}
	}

	if consultations == nil {
		consultations = []UserConsultation{}
	}

	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(map[string]any{
		"consultations": consultations,
		"count":         len(consultations),
	})
}

// HandleUserSummary returns aggregated counts for user orders and consultations.
func (s *UserWorkspaceService) HandleUserSummary(w http.ResponseWriter, r *http.Request) {
	enableCORS(w)
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	email := strings.TrimSpace(strings.ToLower(r.URL.Query().Get("email")))
	if email == "" {
		if user := GetAuthenticatedUser(r); user != nil {
			email = strings.TrimSpace(strings.ToLower(user.Email))
		}
	}
	if email == "" {
		http.Error(w, `{"error":"missing required email query parameter"}`, http.StatusBadRequest)
		return
	}

	var ordersCount int
	var consultationsCount int

	if s.db != nil {
		_ = s.db.QueryRow(`SELECT COUNT(*) FROM report_orders WHERE LOWER(buyer_email) = $1`, email).Scan(&ordersCount)
		_ = s.db.QueryRow(`SELECT COUNT(*) FROM consultation_leads WHERE LOWER(contact) = $1`, email).Scan(&consultationsCount)
	}

	if ordersCount == 0 {
		memOrdersMu.RLock()
		for _, o := range memOrdersByID {
			if strings.EqualFold(o.BuyerEmail, email) {
				ordersCount++
			}
		}
		memOrdersMu.RUnlock()
	}

	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(map[string]any{
		"email":               email,
		"orders_count":        ordersCount,
		"consultations_count": consultationsCount,
	})
}

