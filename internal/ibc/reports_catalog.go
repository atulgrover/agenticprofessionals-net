package ibc

import (
	"time"
)

// ReportProduct represents a statutory research & audit product available on OpenIBC.
type ReportProduct struct {
	Slug         string   `json:"slug"`
	Section      string   `json:"section"`
	Title        string   `json:"title"`
	Description  string   `json:"description"`
	Turnaround   string   `json:"turnaround"`
	PriceINR     int64    `json:"price_inr"`
	AmountPaise  int64    `json:"amount_paise"`
	SampleURL    string   `json:"sample_url"`
	Deliverables []string `json:"deliverables"`
}

// ReportOrder represents a purchased or pending statutory report order.
type ReportOrder struct {
	ID                string     `json:"id"`
	ReportSlug        string     `json:"report_slug"`
	ReportTitle       string     `json:"report_title"`
	AmountPaise       int64      `json:"amount_paise"`
	Currency          string     `json:"currency"`
	BuyerName         string     `json:"buyer_name"`
	BuyerEmail        string     `json:"buyer_email"`
	BuyerPhone        string     `json:"buyer_phone"`
	TargetEntity      string     `json:"target_entity"`
	Notes             string     `json:"notes"`
	RazorpayOrderID   string     `json:"razorpay_order_id"`
	RazorpayPaymentID string     `json:"razorpay_payment_id"`
	RazorpaySignature string     `json:"-"`
	Status            string     `json:"status"`
	Mode              string     `json:"mode"`
	EmailSentAt       *time.Time `json:"email_sent_at,omitempty"`
	CreatedAt         time.Time  `json:"created_at"`
	PaidAt            *time.Time `json:"paid_at,omitempty"`
}

// Authoritative statutory report catalog per Design Spec §4.2.
var reportCatalog = []ReportProduct{
	{
		Slug:        "sec-29a-report",
		Section:     "SEC 29A",
		Title:       "Section 29A Disqualification & Eligibility Audit",
		Description: "10-clause statutory inquest across promoter, connected-person, and NPA default registries.",
		Turnaround:  "24 hrs",
		PriceINR:    15000,
		AmountPaise: 1500000,
		SampleURL:   "/samples/sec-29a-sample.pdf",
		Deliverables: []string{
			"10-Clause Inquest Checklist (Clauses 29A(a) through 29A(j))",
			"Connected Person & Related Party Mapping Matrix",
			"Wilful Defaulter & NPA Classification Screening",
			"Statutory Eligibility Certificate signed for RP/CoC submission",
		},
	},
	{
		Slug:        "sec-65-report",
		Section:     "SEC 65",
		Title:       "Section 65 Fraudulent & Malicious Initiation Dossier",
		Description: "Evidentiary analysis and precedent matrix establishing ulterior motive beyond debt resolution.",
		Turnaround:  "48 hrs",
		PriceINR:    18000,
		AmountPaise: 1800000,
		SampleURL:   "/samples/sec-65-sample.pdf",
		Deliverables: []string{
			"Ulterior Motive & Malice Inquest Dossier",
			"Precedent Benchmark Matrix (NCLAT & Supreme Court Rulings)",
			"Penalty & Section 65 Defense/Petition Draft Annexures",
			"Evidentiary Timeline of Section 7/9/10 Initiation",
		},
	},
	{
		Slug:        "sec-36-report",
		Section:     "SEC 36",
		Title:       "Section 36 Liquidation Estate Segregation Report",
		Description: "Statutory demarcation of liquidation estate assets vs third-party, trust, and ringfenced holdings.",
		Turnaround:  "48 hrs",
		PriceINR:    20000,
		AmountPaise: 2000000,
		SampleURL:   "/samples/sec-36-sample.pdf",
		Deliverables: []string{
			"Liquidation Estate Asset Segregation Schedule",
			"Third-Party Asset, Trust & Bailment Demarcation Checklist",
			"Section 36(4) Excluded Asset Classification Audit",
			"Liquidator Vesting Opinion & Asset Inventory Ledger",
		},
	},
	{
		Slug:        "pufe-avoidance-report",
		Section:     "SEC 43/45/66",
		Title:       "PUFE Avoidance & Clawback Forensic Audit",
		Description: "Look-back period screening of preferential, undervalued, extortionate, and fraudulent transactions.",
		Turnaround:  "48–72 hrs",
		PriceINR:    25000,
		AmountPaise: 2500000,
		SampleURL:   "/samples/pufe-avoidance-sample.pdf",
		Deliverables: []string{
			"Preferential Transaction Forensic Log (Section 43)",
			"Undervalued Transaction Assessment (Section 45)",
			"Extortionate Credit Screening (Section 50)",
			"Fraudulent / Wrongful Trading Inquest (Section 66)",
		},
	},
	{
		Slug:        "reg-35-valuation-report",
		Section:     "REG 35",
		Title:       "Regulation 35 Fair Value & Liquidation Benchmark",
		Description: "Comparative fair-value vs liquidation-value stress scorecard with CoC haircut modeling.",
		Turnaround:  "48 hrs",
		PriceINR:    22000,
		AmountPaise: 2200000,
		SampleURL:   "/samples/reg-35-valuation-sample.pdf",
		Deliverables: []string{
			"Regulation 35 Fair Value & Liquidation Benchmark Card",
			"CoC Haircut Stress Model & Payout Waterfall Scenarios",
			"Registered Valuer Methodology Comparative Matrix",
			"Liquidation Value Floor Sensitivity Model",
		},
	},
	{
		Slug:        "sec-32a-shield-report",
		Section:     "SEC 32A",
		Title:       "Section 32A Clean-Slate Acquisition Immunity Report",
		Description: "Post-resolution-plan liability ringfencing checklist protecting assets from prior offenses.",
		Turnaround:  "24–48 hrs",
		PriceINR:    18000,
		AmountPaise: 1800000,
		SampleURL:   "/samples/sec-32a-sample.pdf",
		Deliverables: []string{
			"Clean-Slate Immunity Assessment under Section 32A",
			"Prior Offenses & Regulatory Attachment Shield Audit",
			"New Management / Resolution Applicant Ringfencing Checklist",
			"Enforcement Agency & ED Attachment Precedent Defense Note",
		},
	},
}

// ListReportCatalog returns a defensive deep copy of the statutory report catalog.
func ListReportCatalog() []ReportProduct {
	out := make([]ReportProduct, len(reportCatalog))
	for i, r := range reportCatalog {
		out[i] = r
		if len(r.Deliverables) > 0 {
			out[i].Deliverables = make([]string, len(r.Deliverables))
			copy(out[i].Deliverables, r.Deliverables)
		}
	}
	return out
}

// LookupReport returns the ReportProduct matching slug, or false if not found.
func LookupReport(slug string) (ReportProduct, bool) {
	for _, r := range reportCatalog {
		if r.Slug == slug {
			res := r
			if len(r.Deliverables) > 0 {
				res.Deliverables = make([]string, len(r.Deliverables))
				copy(res.Deliverables, r.Deliverables)
			}
			return res, true
		}
	}
	return ReportProduct{}, false
}
