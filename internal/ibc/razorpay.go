package ibc

import (
	"bytes"
	"crypto/hmac"
	"crypto/rand"
	"crypto/sha256"
	"database/sql"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/mail"
	"os"
	"strings"
	"sync"
	"time"
)

var razorpayHTTPClient = &http.Client{Timeout: 12 * time.Second}
var razorpayAPIBaseURL = "https://api.razorpay.com"

// In-memory order storage fallback when PostgreSQL db is nil.
var (
	memOrdersMu      sync.RWMutex
	memOrdersByID    = make(map[string]*ReportOrder)
	memOrdersByRzpID = make(map[string]*ReportOrder)
)

// resetMemOrdersForTest resets in-memory order maps during test suites.
func resetMemOrdersForTest() {
	memOrdersMu.Lock()
	defer memOrdersMu.Unlock()
	memOrdersByID = make(map[string]*ReportOrder)
	memOrdersByRzpID = make(map[string]*ReportOrder)
}

// initReportOrdersDB initializes the report_orders table in Neon PostgreSQL if db != nil.
func initReportOrdersDB() {
	if db == nil {
		return
	}
	schema := `
	CREATE TABLE IF NOT EXISTS report_orders (
		id VARCHAR(64) PRIMARY KEY,
		report_slug VARCHAR(120) NOT NULL,
		report_title VARCHAR(255) NOT NULL,
		amount_paise BIGINT NOT NULL,
		currency VARCHAR(10) NOT NULL DEFAULT 'INR',
		buyer_name VARCHAR(255) NOT NULL,
		buyer_email VARCHAR(255) NOT NULL,
		buyer_phone VARCHAR(50) NOT NULL,
		target_entity VARCHAR(255) NOT NULL,
		notes TEXT,
		razorpay_order_id VARCHAR(120) UNIQUE,
		razorpay_payment_id VARCHAR(120),
		razorpay_signature VARCHAR(255),
		status VARCHAR(32) NOT NULL DEFAULT 'CREATED',
		mode VARCHAR(16) NOT NULL DEFAULT 'live',
		email_sent_at TIMESTAMP WITH TIME ZONE,
		created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
		paid_at TIMESTAMP WITH TIME ZONE
	);`
	if _, err := db.Exec(schema); err != nil {
		log.Printf("[WARN] Failed to create report_orders table: %v\n", err)
	} else {
		log.Println("[INFO] Successfully initialized report_orders table in Neon PostgreSQL!")
	}
}

// isRazorpayConfigured checks if live Razorpay credentials are present in the environment.
func isRazorpayConfigured() bool {
	keyID := strings.TrimSpace(os.Getenv("RAZORPAY_KEY_ID"))
	keySecret := strings.TrimSpace(os.Getenv("RAZORPAY_KEY_SECRET"))
	return keyID != "" && keySecret != ""
}

// computeHMACSHA256Hex generates lowercase hexadecimal HMAC-SHA256 digest.
func computeHMACSHA256Hex(secret, message string) string {
	mac := hmac.New(sha256.New, []byte(secret))
	mac.Write([]byte(message))
	return hex.EncodeToString(mac.Sum(nil))
}

// verifyRazorpayPaymentSignature validates client payment signature against HMAC-SHA256(order_id|payment_id).
func verifyRazorpayPaymentSignature(orderID, paymentID, sig, secret string) bool {
	if secret == "" || sig == "" || orderID == "" || paymentID == "" {
		return false
	}
	sigBytes, err := hex.DecodeString(sig)
	if err != nil {
		return false
	}
	mac := hmac.New(sha256.New, []byte(secret))
	mac.Write([]byte(orderID + "|" + paymentID))
	expected := mac.Sum(nil)
	return hmac.Equal(sigBytes, expected)
}

// verifyRazorpayWebhookSignature validates raw webhook body against X-Razorpay-Signature header.
func verifyRazorpayWebhookSignature(rawBody []byte, headerSig, secret string) bool {
	if secret == "" || headerSig == "" {
		return false
	}
	sigBytes, err := hex.DecodeString(headerSig)
	if err != nil {
		return false
	}
	mac := hmac.New(sha256.New, []byte(secret))
	mac.Write(rawBody)
	expected := mac.Sum(nil)
	return hmac.Equal(sigBytes, expected)
}

// setReportCORS applies CORS headers and strict Cache-Control: no-store on report API endpoints.
func setReportCORS(w http.ResponseWriter) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS, POST")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Razorpay-Signature")
	w.Header().Set("Cache-Control", "no-store")
}

// saveReportOrder persists a ReportOrder to PostgreSQL or in-memory fallback.
func saveReportOrder(order *ReportOrder) error {
	if order == nil {
		return errors.New("cannot save nil report order")
	}
	if db != nil {
		_, err := db.Exec(`
			INSERT INTO report_orders (
				id, report_slug, report_title, amount_paise, currency,
				buyer_name, buyer_email, buyer_phone, target_entity, notes,
				razorpay_order_id, razorpay_payment_id, razorpay_signature,
				status, mode, email_sent_at, created_at, paid_at
			) VALUES (
				$1, $2, $3, $4, $5,
				$6, $7, $8, $9, $10,
				$11, $12, $13,
				$14, $15, $16, $17, $18
			)`,
			order.ID, order.ReportSlug, order.ReportTitle, order.AmountPaise, order.Currency,
			order.BuyerName, order.BuyerEmail, order.BuyerPhone, order.TargetEntity, order.Notes,
			order.RazorpayOrderID, order.RazorpayPaymentID, order.RazorpaySignature,
			order.Status, order.Mode, order.EmailSentAt, order.CreatedAt, order.PaidAt,
		)
		return err
	}

	memOrdersMu.Lock()
	defer memOrdersMu.Unlock()
	copied := *order
	memOrdersByID[order.ID] = &copied
	if order.RazorpayOrderID != "" {
		memOrdersByRzpID[order.RazorpayOrderID] = &copied
	}
	return nil
}

// getReportOrderByID retrieves a ReportOrder by its ID.
func getReportOrderByID(id string) (*ReportOrder, error) {
	if db != nil {
		row := db.QueryRow(`
			SELECT id, report_slug, report_title, amount_paise, currency,
			       buyer_name, buyer_email, buyer_phone, target_entity, notes,
			       COALESCE(razorpay_order_id, ''), COALESCE(razorpay_payment_id, ''), COALESCE(razorpay_signature, ''),
			       status, mode, email_sent_at, created_at, paid_at
			FROM report_orders
			WHERE id = $1`, id)
		var o ReportOrder
		var rzpOrder, rzpPay, rzpSig sql.NullString
		err := row.Scan(
			&o.ID, &o.ReportSlug, &o.ReportTitle, &o.AmountPaise, &o.Currency,
			&o.BuyerName, &o.BuyerEmail, &o.BuyerPhone, &o.TargetEntity, &o.Notes,
			&rzpOrder, &rzpPay, &rzpSig,
			&o.Status, &o.Mode, &o.EmailSentAt, &o.CreatedAt, &o.PaidAt,
		)
		if err != nil {
			return nil, err
		}
		o.RazorpayOrderID = rzpOrder.String
		o.RazorpayPaymentID = rzpPay.String
		o.RazorpaySignature = rzpSig.String
		return &o, nil
	}

	memOrdersMu.RLock()
	defer memOrdersMu.RUnlock()
	order, ok := memOrdersByID[id]
	if !ok {
		return nil, sql.ErrNoRows
	}
	copied := *order
	return &copied, nil
}

// getReportOrderByRzpID retrieves a ReportOrder by its Razorpay Order ID.
func getReportOrderByRzpID(rzpID string) (*ReportOrder, error) {
	if db != nil {
		row := db.QueryRow(`
			SELECT id, report_slug, report_title, amount_paise, currency,
			       buyer_name, buyer_email, buyer_phone, target_entity, notes,
			       COALESCE(razorpay_order_id, ''), COALESCE(razorpay_payment_id, ''), COALESCE(razorpay_signature, ''),
			       status, mode, email_sent_at, created_at, paid_at
			FROM report_orders
			WHERE razorpay_order_id = $1`, rzpID)
		var o ReportOrder
		var rzpOrder, rzpPay, rzpSig sql.NullString
		err := row.Scan(
			&o.ID, &o.ReportSlug, &o.ReportTitle, &o.AmountPaise, &o.Currency,
			&o.BuyerName, &o.BuyerEmail, &o.BuyerPhone, &o.TargetEntity, &o.Notes,
			&rzpOrder, &rzpPay, &rzpSig,
			&o.Status, &o.Mode, &o.EmailSentAt, &o.CreatedAt, &o.PaidAt,
		)
		if err != nil {
			return nil, err
		}
		o.RazorpayOrderID = rzpOrder.String
		o.RazorpayPaymentID = rzpPay.String
		o.RazorpaySignature = rzpSig.String
		return &o, nil
	}

	memOrdersMu.RLock()
	defer memOrdersMu.RUnlock()
	order, ok := memOrdersByRzpID[rzpID]
	if !ok {
		return nil, sql.ErrNoRows
	}
	copied := *order
	return &copied, nil
}

// markOrderPaid updates status to 'PAID', paid_at to now, and stores payment ID and signature.
func markOrderPaid(id string, paymentID, signature string) error {
	if db != nil {
		_, err := db.Exec(`
			UPDATE report_orders
			SET status = 'PAID',
			    paid_at = COALESCE(paid_at, NOW()),
			    razorpay_payment_id = COALESCE(NULLIF($2, ''), razorpay_payment_id),
			    razorpay_signature = COALESCE(NULLIF($3, ''), razorpay_signature)
			WHERE id = $1`, id, paymentID, signature)
		return err
	}

	memOrdersMu.Lock()
	defer memOrdersMu.Unlock()
	order, ok := memOrdersByID[id]
	if !ok {
		return sql.ErrNoRows
	}
	order.Status = "PAID"
	if order.PaidAt == nil {
		now := time.Now()
		order.PaidAt = &now
	}
	if paymentID != "" {
		order.RazorpayPaymentID = paymentID
	}
	if signature != "" {
		order.RazorpaySignature = signature
	}
	return nil
}

// claimOrderEmailSend atomically claims the single email dispatch permission for an order.
func claimOrderEmailSend(id string) bool {
	if db != nil {
		res, err := db.Exec(`UPDATE report_orders SET email_sent_at = NOW() WHERE id = $1 AND email_sent_at IS NULL`, id)
		if err != nil {
			return false
		}
		rows, err := res.RowsAffected()
		return err == nil && rows > 0
	}

	memOrdersMu.Lock()
	defer memOrdersMu.Unlock()
	order, ok := memOrdersByID[id]
	if !ok || order.EmailSentAt != nil {
		return false
	}
	now := time.Now()
	order.EmailSentAt = &now
	return true
}

// releaseOrderEmailClaim clears the email_sent_at timestamp if transactional email failed.
func releaseOrderEmailClaim(id string) error {
	if db != nil {
		_, err := db.Exec(`UPDATE report_orders SET email_sent_at = NULL WHERE id = $1`, id)
		return err
	}

	memOrdersMu.Lock()
	defer memOrdersMu.Unlock()
	if order, ok := memOrdersByID[id]; ok {
		order.EmailSentAt = nil
	}
	return nil
}

// generateOrderID creates a unique order identifier ORD-<unix_ms>-<4byte_hex>.
func generateOrderID() string {
	b := make([]byte, 4)
	if _, err := rand.Read(b); err != nil {
		return fmt.Sprintf("ORD-%d-%08x", time.Now().UnixMilli(), time.Now().Nanosecond()&0xffffffff)
	}
	return fmt.Sprintf("ORD-%d-%s", time.Now().UnixMilli(), hex.EncodeToString(b))
}

// handleReportCatalog handles GET /api/reports/catalog.
func handleReportCatalog(w http.ResponseWriter, r *http.Request) {
	setReportCORS(w)
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusNoContent)
		return
	}
	if r.Method != http.MethodGet {
		http.Error(w, `{"error":"method not allowed"}`, http.StatusMethodNotAllowed)
		return
	}
	w.Header().Set("Content-Type", "application/json")

	mode := "demo"
	keyID := ""
	if isRazorpayConfigured() {
		mode = "live"
		keyID = strings.TrimSpace(os.Getenv("RAZORPAY_KEY_ID"))
	}

	catalog := ListReportCatalog()
	_ = json.NewEncoder(w).Encode(map[string]any{
		"reports": catalog,
		"catalog": catalog,
		"mode":    mode,
		"key_id":  keyID,
	})
}

// handleCreateReportOrder handles POST /api/reports/orders.
func handleCreateReportOrder(w http.ResponseWriter, r *http.Request) {
	setReportCORS(w)
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusNoContent)
		return
	}
	if r.Method != http.MethodPost {
		http.Error(w, `{"error":"method not allowed"}`, http.StatusMethodNotAllowed)
		return
	}
	w.Header().Set("Content-Type", "application/json")

	var req struct {
		ReportSlug   string `json:"report_slug"`
		BuyerName    string `json:"buyer_name"`
		BuyerEmail   string `json:"buyer_email"`
		BuyerPhone   string `json:"buyer_phone"`
		TargetEntity string `json:"target_entity"`
		Notes        string `json:"notes"`
	}

	r.Body = http.MaxBytesReader(w, r.Body, 64<<10)

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		var maxBytesErr *http.MaxBytesError
		if errors.As(err, &maxBytesErr) {
			w.WriteHeader(http.StatusRequestEntityTooLarge)
			_ = json.NewEncoder(w).Encode(map[string]string{"error": "request body too large"})
			return
		}
		w.WriteHeader(http.StatusBadRequest)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": "invalid json payload"})
		return
	}

	req.ReportSlug = strings.TrimSpace(req.ReportSlug)
	req.BuyerName = strings.TrimSpace(req.BuyerName)
	req.BuyerEmail = strings.TrimSpace(req.BuyerEmail)
	req.BuyerPhone = strings.TrimSpace(req.BuyerPhone)
	req.TargetEntity = strings.TrimSpace(req.TargetEntity)
	req.Notes = strings.TrimSpace(req.Notes)

	if req.ReportSlug == "" {
		w.WriteHeader(http.StatusBadRequest)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": "report_slug is required"})
		return
	}
	product, ok := LookupReport(req.ReportSlug)
	if !ok {
		w.WriteHeader(http.StatusBadRequest)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": "unknown report_slug"})
		return
	}

	if req.BuyerName == "" {
		w.WriteHeader(http.StatusBadRequest)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": "buyer_name is required"})
		return
	}
	if req.BuyerPhone == "" {
		w.WriteHeader(http.StatusBadRequest)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": "buyer_phone is required"})
		return
	}
	if req.TargetEntity == "" {
		w.WriteHeader(http.StatusBadRequest)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": "target_entity is required"})
		return
	}
	if req.BuyerEmail == "" {
		w.WriteHeader(http.StatusBadRequest)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": "buyer_email is required"})
		return
	}
	addr, err := mail.ParseAddress(req.BuyerEmail)
	if err != nil || addr.Address == "" || !strings.Contains(addr.Address, "@") || strings.HasPrefix(addr.Address, "@") || strings.HasSuffix(addr.Address, "@") {
		w.WriteHeader(http.StatusBadRequest)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": "invalid buyer_email"})
		return
	}
	parts := strings.Split(addr.Address, "@")
	if len(parts) != 2 || parts[0] == "" || parts[1] == "" || !strings.Contains(parts[1], ".") {
		w.WriteHeader(http.StatusBadRequest)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": "invalid buyer_email"})
		return
	}

	orderID := generateOrderID()
	var mode string
	var keyID string
	var razorpayOrderID string

	if isRazorpayConfigured() {
		mode = "live"
		keyID = strings.TrimSpace(os.Getenv("RAZORPAY_KEY_ID"))
		keySecret := strings.TrimSpace(os.Getenv("RAZORPAY_KEY_SECRET"))

		rzpReqBody, _ := json.Marshal(map[string]any{
			"amount":   product.AmountPaise,
			"currency": "INR",
			"receipt":  orderID,
			"notes": map[string]string{
				"report_slug":   product.Slug,
				"buyer_email":  addr.Address,
				"target_entity": req.TargetEntity,
			},
		})

		apiURL := strings.TrimRight(razorpayAPIBaseURL, "/") + "/v1/orders"
		httpReq, err := http.NewRequest(http.MethodPost, apiURL, bytes.NewReader(rzpReqBody))
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			_ = json.NewEncoder(w).Encode(map[string]string{"error": "failed to build razorpay order request"})
			return
		}
		httpReq.SetBasicAuth(keyID, keySecret)
		httpReq.Header.Set("Content-Type", "application/json")

		resp, err := razorpayHTTPClient.Do(httpReq)
		if err != nil {
			log.Printf("[ERROR] Razorpay order creation request failed: %v", err)
			w.WriteHeader(http.StatusBadGateway)
			_ = json.NewEncoder(w).Encode(map[string]string{"error": "razorpay gateway communication error"})
			return
		}
		defer resp.Body.Close()

		if resp.StatusCode < 200 || resp.StatusCode >= 300 {
			respBody, _ := io.ReadAll(resp.Body)
			log.Printf("[ERROR] Razorpay order creation returned status %d: %s", resp.StatusCode, string(respBody))
			w.WriteHeader(http.StatusBadGateway)
			_ = json.NewEncoder(w).Encode(map[string]string{"error": "razorpay order creation failed"})
			return
		}

		var rzpResp struct {
			ID string `json:"id"`
		}
		if err := json.NewDecoder(resp.Body).Decode(&rzpResp); err != nil || rzpResp.ID == "" {
			log.Printf("[ERROR] Failed to parse Razorpay order response: %v", err)
			w.WriteHeader(http.StatusBadGateway)
			_ = json.NewEncoder(w).Encode(map[string]string{"error": "malformed razorpay order response"})
			return
		}
		razorpayOrderID = rzpResp.ID
	} else {
		mode = "demo"
		keyID = ""
		demoBytes := make([]byte, 8)
		_, _ = rand.Read(demoBytes)
		razorpayOrderID = "order_demo_" + hex.EncodeToString(demoBytes)
	}

	order := &ReportOrder{
		ID:              orderID,
		ReportSlug:      product.Slug,
		ReportTitle:     product.Title,
		AmountPaise:     product.AmountPaise,
		Currency:        "INR",
		BuyerName:       req.BuyerName,
		BuyerEmail:      addr.Address,
		BuyerPhone:      req.BuyerPhone,
		TargetEntity:    req.TargetEntity,
		Notes:           req.Notes,
		RazorpayOrderID: razorpayOrderID,
		Status:          "CREATED",
		Mode:            mode,
		CreatedAt:       time.Now(),
	}

	if err := saveReportOrder(order); err != nil {
		log.Printf("[ERROR] Failed to persist report order %s: %v", order.ID, err)
		w.WriteHeader(http.StatusInternalServerError)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": "failed to persist order"})
		return
	}

	w.WriteHeader(http.StatusCreated)
	_ = json.NewEncoder(w).Encode(map[string]any{
		"order_id":          order.ID,
		"razorpay_order_id": order.RazorpayOrderID,
		"amount_paise":      order.AmountPaise,
		"currency":          order.Currency,
		"key_id":            keyID,
		"mode":              mode,
		"status":            order.Status,
	})
}

// handleVerifyReportPayment handles POST /api/reports/verify.
func handleVerifyReportPayment(w http.ResponseWriter, r *http.Request) {
	setReportCORS(w)
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusNoContent)
		return
	}
	if r.Method != http.MethodPost {
		http.Error(w, `{"error":"method not allowed"}`, http.StatusMethodNotAllowed)
		return
	}
	w.Header().Set("Content-Type", "application/json")

	var req struct {
		OrderID           string `json:"order_id"`
		RazorpayOrderID   string `json:"razorpay_order_id"`
		RazorpayPaymentID string `json:"razorpay_payment_id"`
		RazorpaySignature string `json:"razorpay_signature"`
	}

	r.Body = http.MaxBytesReader(w, r.Body, 64<<10)

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		var maxBytesErr *http.MaxBytesError
		if errors.As(err, &maxBytesErr) {
			w.WriteHeader(http.StatusRequestEntityTooLarge)
			_ = json.NewEncoder(w).Encode(map[string]string{"error": "request body too large"})
			return
		}
		w.WriteHeader(http.StatusBadRequest)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": "invalid json payload"})
		return
	}

	req.OrderID = strings.TrimSpace(req.OrderID)
	req.RazorpayOrderID = strings.TrimSpace(req.RazorpayOrderID)
	req.RazorpayPaymentID = strings.TrimSpace(req.RazorpayPaymentID)
	req.RazorpaySignature = strings.TrimSpace(req.RazorpaySignature)

	if req.OrderID == "" {
		w.WriteHeader(http.StatusBadRequest)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": "order_id is required"})
		return
	}

	order, err := getReportOrderByID(req.OrderID)
	if err != nil || order == nil {
		w.WriteHeader(http.StatusBadRequest)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": "order not found"})
		return
	}

	if req.RazorpayOrderID == "" || order.RazorpayOrderID != req.RazorpayOrderID {
		w.WriteHeader(http.StatusBadRequest)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": "mismatched razorpay_order_id"})
		return
	}

	// Idempotent return for already-paid orders. If transient SMTP failure previously prevented
	// email dispatch (email_sent_at == nil), attempt retry delivery.
	if order.Status == "PAID" {
		if order.EmailSentAt == nil {
			if claimOrderEmailSend(order.ID) {
				if err := sendOrderConfirmationEmails(order); err != nil {
					log.Printf("[ERROR] Retry sendOrderConfirmationEmails failed for %s: %v", order.ID, err)
					_ = releaseOrderEmailClaim(order.ID)
				}
			}
		}

		w.WriteHeader(http.StatusOK)
		_ = json.NewEncoder(w).Encode(map[string]any{
			"verified":            true,
			"already_paid":        true,
			"status":              "PAID",
			"order_id":            order.ID,
			"report_title":        order.ReportTitle,
			"amount_inr":          float64(order.AmountPaise) / 100.0,
			"buyer_email":         order.BuyerEmail,
			"razorpay_payment_id": order.RazorpayPaymentID,
		})
		return
	}

	isLive := isRazorpayConfigured()
	if isLive {
		// When live Razorpay is configured, synthetic demo verification is strictly prohibited
		if order.Mode != "live" {
			w.WriteHeader(http.StatusForbidden)
			_ = json.NewEncoder(w).Encode(map[string]string{"error": "demo order verification blocked when live Razorpay is configured"})
			return
		}
		if req.RazorpayPaymentID == "" || req.RazorpaySignature == "" {
			w.WriteHeader(http.StatusBadRequest)
			_ = json.NewEncoder(w).Encode(map[string]string{"error": "missing signature or payment id"})
			return
		}
		secret := strings.TrimSpace(os.Getenv("RAZORPAY_KEY_SECRET"))
		if !verifyRazorpayPaymentSignature(req.RazorpayOrderID, req.RazorpayPaymentID, req.RazorpaySignature, secret) {
			w.WriteHeader(http.StatusBadRequest)
			_ = json.NewEncoder(w).Encode(map[string]string{"error": "invalid signature"})
			return
		}
	} else {
		// Demo mode is only permitted when Razorpay keys are unconfigured and order is demo mode
		if order.Mode != "demo" {
			w.WriteHeader(http.StatusBadRequest)
			_ = json.NewEncoder(w).Encode(map[string]string{"error": "live orders cannot be verified in demo mode"})
			return
		}
		if req.RazorpayPaymentID == "" {
			w.WriteHeader(http.StatusBadRequest)
			_ = json.NewEncoder(w).Encode(map[string]string{"error": "missing razorpay_payment_id"})
			return
		}
	}

	// Update order to PAID in persistence
	if err := markOrderPaid(order.ID, req.RazorpayPaymentID, req.RazorpaySignature); err != nil {
		log.Printf("[ERROR] Failed to mark order %s paid: %v", order.ID, err)
		w.WriteHeader(http.StatusInternalServerError)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": "failed to record payment"})
		return
	}
	order.Status = "PAID"
	order.RazorpayPaymentID = req.RazorpayPaymentID
	order.RazorpaySignature = req.RazorpaySignature
	now := time.Now()
	order.PaidAt = &now

	// Trigger transactional emails under atomic claim so concurrent verify/webhook never double-sends
	if claimOrderEmailSend(order.ID) {
		if err := sendOrderConfirmationEmails(order); err != nil {
			log.Printf("[ERROR] sendOrderConfirmationEmails failed for %s: %v", order.ID, err)
			_ = releaseOrderEmailClaim(order.ID)
		}
	}

	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(map[string]any{
		"verified":            true,
		"already_paid":        false,
		"status":              "PAID",
		"order_id":            order.ID,
		"report_title":        order.ReportTitle,
		"amount_inr":          float64(order.AmountPaise) / 100.0,
		"buyer_email":         order.BuyerEmail,
		"razorpay_payment_id": order.RazorpayPaymentID,
	})
}

// handleRazorpayWebhook handles POST /api/reports/webhook.
func handleRazorpayWebhook(w http.ResponseWriter, r *http.Request) {
	setReportCORS(w)
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusNoContent)
		return
	}
	if r.Method != http.MethodPost {
		http.Error(w, `{"error":"method not allowed"}`, http.StatusMethodNotAllowed)
		return
	}
	w.Header().Set("Content-Type", "application/json")

	r.Body = http.MaxBytesReader(w, r.Body, 256<<10)

	webhookSecret := strings.TrimSpace(os.Getenv("RAZORPAY_WEBHOOK_SECRET"))
	if webhookSecret == "" {
		w.WriteHeader(http.StatusServiceUnavailable)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": "webhook secret unconfigured"})
		return
	}

	sigHeader := r.Header.Get("X-Razorpay-Signature")
	bodyBytes, err := io.ReadAll(r.Body)
	if err != nil {
		var maxBytesErr *http.MaxBytesError
		if errors.As(err, &maxBytesErr) {
			w.WriteHeader(http.StatusRequestEntityTooLarge)
			_ = json.NewEncoder(w).Encode(map[string]string{"error": "request body too large"})
			return
		}
		w.WriteHeader(http.StatusBadRequest)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": "cannot read request body"})
		return
	}

	if !verifyRazorpayWebhookSignature(bodyBytes, sigHeader, webhookSecret) {
		w.WriteHeader(http.StatusUnauthorized)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": "invalid webhook signature"})
		return
	}

	var event struct {
		Event   string `json:"event"`
		Payload struct {
			Payment struct {
				Entity struct {
					ID      string `json:"id"`
					OrderID string `json:"order_id"`
					Amount  int64  `json:"amount"`
					Status  string `json:"status"`
				} `json:"entity"`
			} `json:"payment"`
		} `json:"payload"`
	}

	if err := json.Unmarshal(bodyBytes, &event); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		_ = json.NewEncoder(w).Encode(map[string]string{"error": "malformed webhook json"})
		return
	}

	if event.Event != "payment.captured" {
		w.WriteHeader(http.StatusOK)
		_ = json.NewEncoder(w).Encode(map[string]string{"status": "ignored"})
		return
	}

	rzpOrderID := event.Payload.Payment.Entity.OrderID
	paymentID := event.Payload.Payment.Entity.ID
	if rzpOrderID == "" {
		w.WriteHeader(http.StatusOK)
		_ = json.NewEncoder(w).Encode(map[string]string{"status": "ignored"})
		return
	}

	order, err := getReportOrderByRzpID(rzpOrderID)
	if err != nil || order == nil {
		log.Printf("[WARN] Webhook payment.captured for unknown rzp_order_id %s", rzpOrderID)
		w.WriteHeader(http.StatusOK)
		_ = json.NewEncoder(w).Encode(map[string]string{"status": "order_not_found"})
		return
	}

	if order.Status == "CREATED" {
		_ = markOrderPaid(order.ID, paymentID, sigHeader)
		order.Status = "PAID"
		order.RazorpayPaymentID = paymentID
		now := time.Now()
		order.PaidAt = &now

		if claimOrderEmailSend(order.ID) {
			if err := sendOrderConfirmationEmails(order); err != nil {
				log.Printf("[ERROR] Webhook email fulfillment failed for %s: %v", order.ID, err)
				_ = releaseOrderEmailClaim(order.ID)
			}
		}
	} else if order.Status == "PAID" && order.EmailSentAt == nil {
		if order.RazorpayPaymentID == "" && paymentID != "" {
			order.RazorpayPaymentID = paymentID
			_ = markOrderPaid(order.ID, paymentID, sigHeader)
		}
		if claimOrderEmailSend(order.ID) {
			if err := sendOrderConfirmationEmails(order); err != nil {
				log.Printf("[ERROR] Webhook retry email fulfillment failed for %s: %v", order.ID, err)
				_ = releaseOrderEmailClaim(order.ID)
			}
		}
	}

	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(map[string]string{"status": "processed"})
}
