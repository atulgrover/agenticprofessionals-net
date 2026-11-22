package bns

import (
	"time"
)

// ReportProduct represents a statutory research & audit product available on OpenBNS.
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

// Authoritative statutory report catalog for OpenBNS (Act No. 45 of 2023).
var reportCatalog = []ReportProduct{
	{
		Slug:        "corporate-criminal-due-diligence",
		Section:     "BNS/PMLA",
		Title:       "Corporate Criminal & Regulatory Due Diligence Docket",
		Description: "Exhaustive institutional search across 46 statutory registries, e-courts district databases, SEBI debarment ledgers, and CIBIL wilful defaulter rosters.",
		Turnaround:  "24–48 hrs",
		PriceINR:    15000,
		AmountPaise: 1500000,
		SampleURL:   "/samples/corporate-criminal-due-diligence.pdf",
		Deliverables: []string{
			"10-Year Criminal Litigation Record across 672 District Courts",
			"Economic Offense, PMLA, and SFIO Probe Cross-Index",
			"Section 111 BNS Organized Syndicate Exposure Audit",
			"18-digit immutable UDIN certification stamp signed for judicial submission",
		},
	},
	{
		Slug:        "cdr-ipdr-forensic-triangulation-docket",
		Section:     "BSA SEC 63",
		Title:       "Telecom CDR/IPDR Forensic Triangulation Pack",
		Description: "Rigorous technical processing of raw telecom call detail records (CDR) and internet protocol detail records (IPDR) with cell tower azimuth mapping.",
		Turnaround:  "48 hrs",
		PriceINR:    25000,
		AmountPaise: 2500000,
		SampleURL:   "/samples/cdr-ipdr-forensic-triangulation-docket.pdf",
		Deliverables: []string{
			"Cell Tower Co-Location Probability Score & Tower Handover Sequence",
			"Sector Antenna Coverage Heatmaps & Frequency Distribution Matrix",
			"Section 63 BSA Digital Evidence Compliance Audit Memorandum",
			"Cross-Examination Blueprint for Prosecution Telecom Witness",
		},
	},
	{
		Slug:        "undertrial-detention-audit",
		Section:     "BNSS SEC 479",
		Title:       "Statutory Undertrial Custody & Bail Eligibility Audit",
		Description: "Statutory computation of time served in judicial custody against maximum sentence thresholds under Section 479 BNSS with Supreme Court precedents.",
		Turnaround:  "24 hrs",
		PriceINR:    7500,
		AmountPaise: 750000,
		SampleURL:   "/samples/undertrial-detention-audit.pdf",
		Deliverables: []string{
			"Section 479 BNSS Statutory Bail Eligibility Certificate",
			"1/3rd First-Time Offender Custody Duration Verification Card",
			"Satender Kumar Antil Guidelines Compliance Checklist",
			"Bench Argumentation Brief for Sessions & High Court Hearing",
		},
	},
	{
		Slug:        "sec-111-organized-crime-audit",
		Section:     "BNS SEC 111",
		Title:       "Section 111 BNS Organised Crime Sanction & Defense Audit",
		Description: "Statutory assessment of continuing unlawful activity criteria, syndicate nexus, and supervisory sanction requirements under Section 111 BNS.",
		Turnaround:  "48–72 hrs",
		PriceINR:    30000,
		AmountPaise: 3000000,
		SampleURL:   "/samples/sec-111-organized-crime-audit.pdf",
		Deliverables: []string{
			"10-Year Charge-Sheet Recidivism & Nexus Audit Matrix",
			"Economic Gain & Syndicate Association Evidence Scorecard",
			"Statutory Sanction Validity Assessment (SP/DGP Endorsement)",
			"Special Court Bail & Discharge Strategy Dossier",
		},
	},
	{
		Slug:        "digital-evidence-bsa-certification",
		Section:     "BSA SEC 63",
		Title:       "Digital Forensics & Section 63 BSA Chain-of-Custody Certification",
		Description: "End-to-end cryptographic integrity verification for mobile extractions, CCTV DVRs, and cloud logs replacing legacy Section 65B certifications.",
		Turnaround:  "48 hrs",
		PriceINR:    18000,
		AmountPaise: 1800000,
		SampleURL:   "/samples/digital-evidence-bsa-certification.pdf",
		Deliverables: []string{
			"SHA-256 / MD5 Bit-Stream Image Verification Certificate",
			"Section 105 BNSS Mandatory Videography Protocol Audit",
			"Statutory Form III Certificate signed by Forensic Examiner",
			"Tamper-Evident Chain-of-Custody Chronology Ledger",
		},
	},
	{
		Slug:        "fsl-chemical-ballistic-scrutiny",
		Section:     "BNSS SEC 184",
		Title:       "Forensic FSL Ballistic & Chemical Report Technical Scrutiny",
		Description: "Technical evaluation of government FSL reports identifying methodology gaps, calibration lapses, and chain-of-custody contamination.",
		Turnaround:  "48–72 hrs",
		PriceINR:    22000,
		AmountPaise: 2200000,
		SampleURL:   "/samples/fsl-chemical-ballistic-scrutiny.pdf",
		Deliverables: []string{
			"Forensic Laboratory Methodology & Instrumentation Critique",
			"GSR (Gunshot Residue) & Chemical Examiner Defect Log",
			"Judicial Precedent Matrix on Contaminated Sample Rejection",
			"25-Question Expert Witness Cross-Examination Questionnaire",
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
