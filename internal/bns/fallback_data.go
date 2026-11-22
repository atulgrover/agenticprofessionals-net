package bns

// FallbackDeal represents a default law enforcement administrative unit or police station.
// Fields match the JSON keys returned by the DB query in handleRadarAssets.
type FallbackDeal struct {
	ID                  string  `json:"id"`
	Cin                 string  `json:"cin"`
	CompanyName         string  `json:"companyName"`
	Sector              string  `json:"sector"`
	State               string  `json:"state"`
	AssetCity           string  `json:"assetCity"`
	NcltBench           string  `json:"ncltBench"`
	CaseNumber          string  `json:"caseNumber"`
	Regime              string  `json:"regime"`
	CirpStage           string  `json:"cirpStage"`
	ClaimsAdmittedInr   string  `json:"claimsAdmittedInr"`
	LiquidationValueInr string  `json:"liquidationValueInr"`
	ReadinessScore      int     `json:"readinessScore"`
	RpName              string  `json:"rpName"`
	RpEmail             string  `json:"rpEmail"`
	KeyAssetsSummary    string  `json:"keyAssetsSummary"`
	Latitude            float64 `json:"latitude"`
	Longitude           float64 `json:"longitude"`
}

// FallbackProfessional represents a criminal defense counsel, forensic examiner, or public prosecutor.
type FallbackProfessional struct {
	ID             string  `json:"id"`
	Slug           string  `json:"slug"`
	Name           string  `json:"name"`
	Role           string  `json:"role"`
	Designation    string  `json:"designation"`
	RegNo          string  `json:"reg_no"`
	Firm           string  `json:"firm"`
	Bench          string  `json:"bench"`
	City           string  `json:"city"`
	State          string  `json:"state"`
	Lat            float64 `json:"lat"`
	Lng            float64 `json:"lng"`
	Email          string  `json:"email"`
	Phone          string  `json:"phone"`
	Initials       string  `json:"initials"`
	IsVerified     bool    `json:"is_verified"`
	Specialization string  `json:"specialization"`
	ActiveMandates int     `json:"active_mandates"`
}

var fallbackDeals = []FallbackDeal{
	{
		ID:                  "ps-1",
		Cin:                 "PS-DL-CP-001",
		CompanyName:         "Connaught Place Police Station (Cyber Cell)",
		Sector:              "Cyber Financial Fraud & Data Theft Unit",
		State:               "Delhi",
		NcltBench:           "Patiala House Courts / CMM",
		CaseNumber:          "FIR No. 248/2024",
		Regime:              "BNS / BSA SEC 63",
		CirpStage:           "INVESTIGATION_ACTIVE",
		ClaimsAdmittedInr:   "45000000.00",
		LiquidationValueInr: "28000000.00",
		ReadinessScore:      94,
		RpName:              "ACP Vikramaditya Singh (IO)",
		RpEmail:             "io.cyber@delhipolice.gov.in",
		KeyAssetsSummary:    "Dedicated electronic seizure vault, digital forensic station, Section 105 BNSS videography unit.",
		Latitude:            28.6328,
		Longitude:           77.2197,
		AssetCity:           "New Delhi",
	},
	{
		ID:                  "ps-2",
		Cin:                 "PS-MH-BANDRA-009",
		CompanyName:         "Bandra Police Station & Crime Branch Unit IX",
		Sector:              "Organized Crime & Extortion Special Cell",
		State:               "Maharashtra",
		NcltBench:           "Esplanade Court / CMM Mumbai",
		CaseNumber:          "CR No. 112/2024",
		Regime:              "BNS SEC 111 / MCOCA",
		CirpStage:           "CHARGE_SHEET_VETTING",
		ClaimsAdmittedInr:   "125000000.00",
		LiquidationValueInr: "64000000.00",
		ReadinessScore:      91,
		RpName:              "Sr. Inspector Rajesh Kadam (IO)",
		RpEmail:             "cb.unit9@mumbaipolice.gov.in",
		KeyAssetsSummary:    "Inter-state syndicate tracking unit, CDR triangulation dock, witness protection cell.",
		Latitude:            19.0596,
		Longitude:           72.8295,
		AssetCity:           "Mumbai",
	},
	{
		ID:                  "ps-3",
		Cin:                 "PS-KA-CID-042",
		CompanyName:         "Cyber Crime Police Station (CID Karnataka)",
		Sector:              "Corporate Embezzlement & Cryptojacking Squad",
		State:               "Karnataka",
		NcltBench:           "Chief Metropolitan Magistrate Bangalore",
		CaseNumber:          "Crime No. 89/2024",
		Regime:              "BNS SEC 318(4) / IT ACT",
		CirpStage:           "FSL_ANALYSIS_PENDING",
		ClaimsAdmittedInr:   "88000000.00",
		LiquidationValueInr: "39000000.00",
		ReadinessScore:      89,
		RpName:              "DySP Ananya Rao (IO)",
		RpEmail:             "cybercrime.cid@ksp.gov.in",
		KeyAssetsSummary:    "High-throughput cloud forensic imaging cluster, blockchain transaction tracing ledger.",
		Latitude:            12.9716,
		Longitude:           77.5946,
		AssetCity:           "Bengaluru",
	},
	{
		ID:                  "ps-4",
		Cin:                 "PS-TS-CYB-018",
		CompanyName:         "Cyberabad Police Commissionerate (Economic Offences Wing)",
		Sector:              "Multi-Level Syndicate & Hawala Division",
		State:               "Telangana",
		NcltBench:           "Metropolitan Sessions Judge Hyderabad",
		CaseNumber:          "FIR No. 342/2024",
		Regime:              "BNS SEC 111 / 316",
		CirpStage:           "SANCTION_AWAITING",
		ClaimsAdmittedInr:   "184000000.00",
		LiquidationValueInr: "92000000.00",
		ReadinessScore:      93,
		RpName:              "ACP K. S. Reddy (IO)",
		RpEmail:             "eow.cyberabad@tspolice.gov.in",
		KeyAssetsSummary:    "Financial auditing team, automated MCA-21 director nexus scraper, freeze order registry.",
		Latitude:            17.4401,
		Longitude:           78.3489,
		AssetCity:           "Hyderabad",
	},
	{
		ID:                  "ps-5",
		Cin:                 "PS-WB-LALBAZAR-003",
		CompanyName:         "Bowbazar Police Station & Detective Department (Lalbazar)",
		Sector:              "Commercial Fraud & Forgery Section",
		State:               "West Bengal",
		NcltBench:           "Bankshall Court / CMM Kolkata",
		CaseNumber:          "Case No. 76/2024",
		Regime:              "BNS SEC 336 / 340",
		CirpStage:           "INVESTIGATION_ACTIVE",
		ClaimsAdmittedInr:   "32000000.00",
		LiquidationValueInr: "16000000.00",
		ReadinessScore:      88,
		RpName:              "Inspector Subrata Roy (IO)",
		RpEmail:             "dd.lalbazar@kolkatapolice.gov.in",
		KeyAssetsSummary:    "Questioned documents examination wing, handwriting biometrics station, safe-custody malkhana.",
		Latitude:            22.5697,
		Longitude:           88.3697,
		AssetCity:           "Kolkata",
	},
}

var fallbackProfessionals = []FallbackProfessional{
	{
		ID:             "pro-1",
		Slug:           "siddharth-luthra",
		Name:           "Adv. Siddharth Luthra",
		Role:           "advocate",
		Designation:    "Senior Advocate (Criminal Defense)",
		RegNo:          "D/142/1998",
		Firm:           "Chambers of Criminal Defense",
		Bench:          "Supreme Court & Delhi High Court",
		City:           "New Delhi",
		State:          "Delhi",
		Lat:            28.6139,
		Lng:            77.2090,
		Email:          "chambers@luthra-defense.in",
		Phone:          "+91 11 2338 1200",
		Initials:       "SL",
		IsVerified:     true,
		Specialization: "Section 479 BNSS Undertrial Bail, Quashing & White Collar Defense",
		ActiveMandates: 6,
	},
	{
		ID:             "pro-2",
		Slug:           "dr-rohini-sen",
		Name:           "Dr. Rohini Sen",
		Role:           "forensic",
		Designation:    "Chief Cyber Forensic Examiner",
		RegNo:          "FSL/CYB/2018/044",
		Firm:           "Digital Forensics & Evidence Labs",
		Bench:          "Bombay High Court",
		City:           "Mumbai",
		State:          "Maharashtra",
		Lat:            19.0760,
		Lng:            72.8777,
		Email:          "dr.sen@cyberforensics.in",
		Phone:          "+91 22 2650 4400",
		Initials:       "RS",
		IsVerified:     true,
		Specialization: "Section 63 BSA Digital Certificates & CDR Triangulation",
		ActiveMandates: 8,
	},
	{
		ID:             "pro-3",
		Slug:           "maneka-guruswamy",
		Name:           "Adv. Maneka Guruswamy",
		Role:           "advocate",
		Designation:    "Senior Criminal Appellate Counsel",
		RegNo:          "KAR/892/2005",
		Firm:           "Guruswamy & Partners",
		Bench:          "Karnataka High Court",
		City:           "Bengaluru",
		State:          "Karnataka",
		Lat:            12.9716,
		Lng:            77.5946,
		Email:          "counsel@guruswamy.legal",
		Phone:          "+91 80 2221 8800",
		Initials:       "MG",
		IsVerified:     true,
		Specialization: "Organized Crime Defense, Constitutional Liberty & Section 111 BNS",
		ActiveMandates: 5,
	},
	{
		ID:             "pro-4",
		Slug:           "pv-ramana",
		Name:           "Adv. P. V. Ramana",
		Role:           "prosecutor",
		Designation:    "Special Public Prosecutor (EOW & Cyber)",
		RegNo:          "TS/512/2002",
		Firm:           "Directorate of Prosecution Telangana",
		Bench:          "Telangana High Court & Sessions",
		City:           "Hyderabad",
		State:          "Telangana",
		Lat:            17.3850,
		Lng:            78.4867,
		Email:          "spp.ramana@prosecution.gov.in",
		Phone:          "+91 40 2345 1100",
		Initials:       "PR",
		IsVerified:     true,
		Specialization: "Trial Advocacy, Organized Crime Sanction & Bail Rebuttal",
		ActiveMandates: 12,
	},
	{
		ID:             "pro-5",
		Slug:           "dr-anirban-mukherjee",
		Name:           "Dr. Anirban Mukherjee",
		Role:           "forensic",
		Designation:    "Senior Forensic Document & Ballistics Expert",
		RegNo:          "CFSL/DOC/2012/109",
		Firm:           "National Forensic Scrutiny Chambers",
		Bench:          "Calcutta High Court",
		City:           "Kolkata",
		State:          "West Bengal",
		Lat:            22.5726,
		Lng:            88.3639,
		Email:          "forensic@mukherjee-cfsl.in",
		Phone:          "+91 33 2248 3300",
		Initials:       "AM",
		IsVerified:     true,
		Specialization: "FSL Report Rebuttal, Ballistics & Section 105 BNSS Compliance",
		ActiveMandates: 7,
	},
}
