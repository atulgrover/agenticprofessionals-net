package ibc

import (
	"bytes"
	"errors"
	"fmt"
	"log"
	"net/smtp"
	"os"
	"strings"
	"time"
)

// smtpSendMail holds the SMTP transmission function, overridable in tests.
var smtpSendMail = smtp.SendMail

// sanitizeHeaderValue strips all CR and LF characters to prevent SMTP header injection.
func sanitizeHeaderValue(v string) string {
	v = strings.ReplaceAll(v, "\r", "")
	v = strings.ReplaceAll(v, "\n", "")
	return v
}

// buildMIMEMessage formats an RFC 5322 compliant plain text MIME message.
// All header fields are sanitized to prevent header injection attacks.
func buildMIMEMessage(from, to, subject, body string) []byte {
	cleanFrom := sanitizeHeaderValue(from)
	cleanTo := sanitizeHeaderValue(to)
	cleanSubject := sanitizeHeaderValue(subject)

	var buf bytes.Buffer
	buf.WriteString("From: " + cleanFrom + "\r\n")
	buf.WriteString("To: " + cleanTo + "\r\n")
	buf.WriteString("Subject: " + cleanSubject + "\r\n")
	buf.WriteString("MIME-Version: 1.0\r\n")
	buf.WriteString("Content-Type: text/plain; charset=UTF-8\r\n")
	buf.WriteString("\r\n")
	buf.WriteString(body)
	return buf.Bytes()
}

// sendOrderConfirmationEmails dispatches transactional confirmation emails
// for a verified report order:
// 1. Buyer Receipt to order.BuyerEmail.
// 2. Chamber Fulfillment dossier notification to ADMIN_NOTIFY_EMAIL.
// In simulation mode (SMTP_HOST unset), it logs cleanly without failing.
func sendOrderConfirmationEmails(order *ReportOrder) error {
	if order == nil {
		return errors.New("cannot send confirmation emails: order is nil")
	}

	cleanBuyerEmail := strings.TrimSpace(order.BuyerEmail)
	if cleanBuyerEmail == "" {
		return fmt.Errorf("cannot send confirmation email: buyer email is empty for order %s", order.ID)
	}

	smtpHost := strings.TrimSpace(os.Getenv("SMTP_HOST"))
	smtpPort := strings.TrimSpace(os.Getenv("SMTP_PORT"))
	if smtpPort == "" {
		smtpPort = "587"
	}
	smtpUser := strings.TrimSpace(os.Getenv("SMTP_USER"))
	smtpPass := os.Getenv("SMTP_PASS")
	smtpFrom := strings.TrimSpace(os.Getenv("SMTP_FROM"))
	if smtpFrom == "" {
		smtpFrom = "contact@openibc.in"
	}
	adminEmail := strings.TrimSpace(os.Getenv("ADMIN_NOTIFY_EMAIL"))
	if adminEmail == "" {
		adminEmail = "contact@openibc.in"
	}

	// Resolve turnaround SLA from catalog if available
	turnaround := "24–48 hrs"
	if prod, ok := LookupReport(order.ReportSlug); ok && prod.Turnaround != "" {
		turnaround = prod.Turnaround
	}

	// Buyer Receipt Email Content
	buyerSubject := fmt.Sprintf("OpenIBC Order Confirmation: %s [%s]", order.ReportTitle, order.ID)
	buyerBody := fmt.Sprintf(
		`Dear %s,

Thank you for your order with the OpenIBC Statutory Research Chamber. Your payment has been successfully verified.

ORDER DETAILS:
--------------------------------------------------
Order ID:            %s
Report Title:        %s
Target Entity/CIN:   %s
Amount Paid:         INR %.2f
Payment ID:          %s
Delivery Turnaround: %s

Our forensic research team has initiated statutory docket preparation for %s.
Your final report dossier will be delivered directly to %s within %s.

If you have additional documentation or specific queries, reply directly to this email or reach us at contact@openibc.in.

Sincerely,
OpenIBC Statutory Chambers
Autonomous Resolution Intelligence
https://openibc.in
`,
		order.BuyerName,
		order.ID,
		order.ReportTitle,
		order.TargetEntity,
		float64(order.AmountPaise)/100.0,
		order.RazorpayPaymentID,
		turnaround,
		order.TargetEntity,
		cleanBuyerEmail,
		turnaround,
	)

	// Chamber Fulfillment Email Content
	adminSubject := fmt.Sprintf("[OPENIBC DISPATCH] New Paid Report Order: %s [%s]", order.ReportTitle, order.ID)
	adminBody := fmt.Sprintf(
		`NEW STATUTORY REPORT ORDER RECEIVED & PAID

ORDER DETAILS:
--------------------------------------------------
Order ID:             %s
Report Slug:          %s
Report Title:         %s
Amount:               INR %.2f (%d paise)
Currency:             %s
Mode:                 %s
Razorpay Order ID:    %s
Razorpay Payment ID:  %s

BUYER INFORMATION:
--------------------------------------------------
Buyer Name:           %s
Buyer Email:          %s
Buyer Phone:          %s

CASE INQUEST INPUTS:
--------------------------------------------------
Target Entity / CIN:  %s
Turnaround SLA:       %s
Buyer Notes / Brief:
%s

ACTION REQUIRED:
--------------------------------------------------
1. Verify target entity filing status and court registries.
2. Compile and review statutory findings per product deliverables.
3. Deliver compiled PDF report to %s within %s.
`,
		order.ID,
		order.ReportSlug,
		order.ReportTitle,
		float64(order.AmountPaise)/100.0,
		order.AmountPaise,
		order.Currency,
		order.Mode,
		order.RazorpayOrderID,
		order.RazorpayPaymentID,
		order.BuyerName,
		cleanBuyerEmail,
		order.BuyerPhone,
		order.TargetEntity,
		turnaround,
		order.Notes,
		cleanBuyerEmail,
		turnaround,
	)

	// Simulation mode: when SMTP_HOST is not configured
	if smtpHost == "" {
		log.Printf("[REPORT_ORDER_EMAIL_SIMULATION] Buyer Receipt for order %s to %s | Entity: %s | Payment: %s | Amount: INR %.2f",
			order.ID, cleanBuyerEmail, order.TargetEntity, order.RazorpayPaymentID, float64(order.AmountPaise)/100.0)
		log.Printf("[REPORT_ORDER_EMAIL_SIMULATION] Chamber Fulfillment for order %s to %s | Entity: %s | Buyer: %s (%s) | Notes: %s",
			order.ID, adminEmail, order.TargetEntity, order.BuyerName, order.BuyerPhone, order.Notes)
		if order.EmailSentAt == nil {
			now := time.Now()
			order.EmailSentAt = &now
		}
		return nil
	}

	// SMTP delivery mode
	addr := fmt.Sprintf("%s:%s", smtpHost, smtpPort)
	var auth smtp.Auth
	if smtpUser != "" {
		auth = smtp.PlainAuth("", smtpUser, smtpPass, smtpHost)
	}

	buyerMsg := buildMIMEMessage(smtpFrom, cleanBuyerEmail, buyerSubject, buyerBody)
	if err := smtpSendMail(addr, auth, smtpFrom, []string{cleanBuyerEmail}, buyerMsg); err != nil {
		return fmt.Errorf("failed to send buyer receipt email: %w", err)
	}

	adminMsg := buildMIMEMessage(smtpFrom, adminEmail, adminSubject, adminBody)
	if err := smtpSendMail(addr, auth, smtpFrom, []string{adminEmail}, adminMsg); err != nil {
		return fmt.Errorf("failed to send chamber fulfillment email: %w", err)
	}

	if order.EmailSentAt == nil {
		now := time.Now()
		order.EmailSentAt = &now
	}

	return nil
}
