package ibc

// FallbackDeal represents a default distressed asset deal.
// Fields match the JSON keys returned by the DB query in handleRadarAssets.
type FallbackDeal struct {
	ID                  string  `json:"id"`
	Cin                 string  `json:"cin"`
	CompanyName         string  `json:"companyName"`
	Sector              string  `json:"sector"`
	State               string  `json:"state"`
	AssetCity           string  `json:"assetCity"` // COALESCE(asset_city, state) in DB
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

// FallbackProfessional represents a default insolvency professional
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
		ID:                  "deal-1",
		Cin:                 "U40102GJ2007PLC050981",
		CompanyName:         "Essar Power Gujarat Limited",
		Sector:              "Power & Energy",
		State:               "Gujarat",
		NcltBench:           "NCLT Ahmedabad",
		CaseNumber:          "CP(IB) No. 412/AHM/2021",
		Regime:              "CIRP",
		CirpStage:           "FORM_G_OPEN",
		ClaimsAdmittedInr:   "41200000000.00",
		LiquidationValueInr: "18500000000.00",
		ReadinessScore:      92,
		RpName:              "Sanjay Kumar Gupta (IP/P-00124)",
		RpEmail:             "cirp.essarpower@deloitte.com",
		KeyAssetsSummary:    "1,200 MW imported coal-fired thermal plant near Salaya port.",
		Latitude:            22.3081,
		Longitude:           69.5891,
		AssetCity:           "Salaya",
	},
	{
		ID:                  "deal-2",
		Cin:                 "U45201UP2007PLC033110",
		CompanyName:         "Jaypee Infratech Realty Assets",
		Sector:              "Real Estate & Infrastructure",
		State:               "Uttar Pradesh",
		NcltBench:           "NCLT New Delhi",
		CaseNumber:          "CP(IB) No. 77/ALD/2017",
		Regime:              "CIRP",
		CirpStage:           "FORM_G_OPEN",
		ClaimsAdmittedInr:   "98000000000.00",
		LiquidationValueInr: "42000000000.00",
		ReadinessScore:      89,
		RpName:              "Anuj Jain (IP/P-00088)",
		RpEmail:             "ip.jaypeeinfratech@pwc.com",
		KeyAssetsSummary:    "2,500 acres development land along Yamuna Expressway.",
		Latitude:            28.5355,
		Longitude:           77.3910,
		AssetCity:           "Noida",
	},
	{
		ID:                  "deal-3",
		Cin:                 "L27100MH1985PLC037359",
		CompanyName:         "Uttam Galva Steels Limited",
		Sector:              "Metals & Mining",
		State:               "Maharashtra",
		NcltBench:           "NCLT Mumbai (Court-I)",
		CaseNumber:          "CP(IB) No. 2205/MB/2019",
		Regime:              "CIRP",
		CirpStage:           "PLAN_APPROVED_COC",
		ClaimsAdmittedInr:   "94000000000.00",
		LiquidationValueInr: "31000000000.00",
		ReadinessScore:      95,
		RpName:              "Milind Kasodekar (IP/P-00112)",
		RpEmail:             "rp.uttamgalva@kpmg.com",
		KeyAssetsSummary:    "Cold rolling and galvanizing mills in Khopoli, Maharashtra.",
		Latitude:            18.7857,
		Longitude:           73.3444,
		AssetCity:           "Khopoli",
	},
	{
		ID:                  "deal-4",
		Cin:                 "L29220WB1998PLC087412",
		CompanyName:         "Bengal Heavy Forge & Casting Ltd",
		Sector:              "Manufacturing & Industrials",
		State:               "West Bengal",
		NcltBench:           "NCLT Kolkata",
		CaseNumber:          "CP(IB) No. 1184/KB/2020",
		Regime:              "LIQUIDATION",
		CirpStage:           "E_AUCTION_NOTICE",
		ClaimsAdmittedInr:   "18400000000.00",
		LiquidationValueInr: "7600000000.00",
		ReadinessScore:      88,
		RpName:              "Raghavendra Kulkarni (IP/P-00219)",
		RpEmail:             "liq.bengalforge@ibcchambers.in",
		KeyAssetsSummary:    "142-acre integrated forging plant and railway siding in Howrah industrial belt.",
		Latitude:            22.5958,
		Longitude:           88.2636,
		AssetCity:           "Howrah",
	},
	{
		ID:                  "deal-5",
		Cin:                 "U34100KA2011PLC058914",
		CompanyName:         "Deccan Precision Components Pvt Ltd",
		Sector:              "Automotive & Engineering",
		State:               "Karnataka",
		NcltBench:           "NCLT Bengaluru",
		CaseNumber:          "SA No. 294/BLR/2023",
		Regime:              "SARFAESI",
		CirpStage:           "SEC_13_4_POSSESSION",
		ClaimsAdmittedInr:   "6200000000.00",
		LiquidationValueInr: "3900000000.00",
		ReadinessScore:      91,
		RpName:              "ARSEC Recovery Consortium",
		RpEmail:             "sarfaesi.deccan@arsec.co.in",
		KeyAssetsSummary:    "CNC Aerospace & EV drivetrain machining park across Peenya Industrial Estate.",
		Latitude:            13.0285,
		Longitude:           77.5197,
		AssetCity:           "Bengaluru",
	},
}

var fallbackProfessionals = []FallbackProfessional{
	{
		ID:             "pro-1",
		Slug:           "sanjay-kumar-gupta",
		Name:           "Sanjay Kumar Gupta",
		Role:           "ip",
		Designation:    "Insolvency Professional",
		RegNo:          "IBBI/IPA-002/IP-N00124/2017-2018/10311",
		Firm:           "Deloitte Touche Tohmatsu India LLP",
		Bench:          "NCLT Ahmedabad",
		City:           "Ahmedabad",
		State:          "Gujarat",
		Lat:            23.0225,
		Lng:            72.5714,
		Email:          "sgupta.ip@deloitte.com",
		Phone:          "+91 79 6671 2000",
		Initials:       "SG",
		IsVerified:     true,
		Specialization: "Heavy Industrial, Power & Utilities",
		ActiveMandates: 3,
	},
	{
		ID:             "pro-2",
		Slug:           "anuj-jain",
		Name:           "Anuj Jain",
		Role:           "ip",
		Designation:    "Senior Insolvency Professional",
		RegNo:          "IBBI/IPA-001/IP-P00088/2017-2018/10184",
		Firm:           "PricewaterhouseCoopers",
		Bench:          "NCLT New Delhi",
		City:           "New Delhi",
		State:          "Delhi",
		Lat:            28.6139,
		Lng:            77.2090,
		Email:          "anuj.jain.ip@pwc.com",
		Phone:          "+91 11 4115 0000",
		Initials:       "AJ",
		IsVerified:     true,
		Specialization: "Real Estate & Mega Infrastructure",
		ActiveMandates: 2,
	},
	{
		ID:             "pro-3",
		Slug:           "milind-kasodekar",
		Name:           "Milind Kasodekar",
		Role:           "ip",
		Designation:    "Partner - Insolvency & Restructuring",
		RegNo:          "IBBI/IPA-002/IP-N00112/2017-2018/10280",
		Firm:           "KPMG India",
		Bench:          "NCLT Mumbai (Court-I)",
		City:           "Mumbai",
		State:          "Maharashtra",
		Lat:            19.0760,
		Lng:            72.8777,
		Email:          "mkasodekar@kpmg.com",
		Phone:          "+91 22 3090 2000",
		Initials:       "MK",
		IsVerified:     true,
		Specialization: "Metals, Manufacturing & Turnaround",
		ActiveMandates: 4,
	},
	{
		ID:             "pro-4",
		Slug:           "meenakshi-sundaram",
		Name:           "Meenakshi Sundaram",
		Role:           "rv",
		Designation:    "Registered Valuer (Plant & Machinery)",
		RegNo:          "IBBI/RV/02/2019/11408",
		Firm:           "Sundaram Industrial Valuers LLP",
		Bench:          "NCLT Chennai",
		City:           "Chennai",
		State:          "Tamil Nadu",
		Lat:            13.0827,
		Lng:            80.2707,
		Email:          "msundaram@sundaramvaluers.in",
		Phone:          "+91 44 2815 4400",
		Initials:       "MS",
		IsVerified:     true,
		Specialization: "Plant, Machinery & Fair Value Liquidation",
		ActiveMandates: 6,
	},
	{
		ID:             "pro-5",
		Slug:           "raghavendra-kulkarni",
		Name:           "Adv. Raghavendra Kulkarni",
		Role:           "advocate",
		Designation:    "Insolvency Counsel (CoC & SRA)",
		RegNo:          "WB/4812/2011",
		Firm:           "Kulkarni Chambers & IBC Practice",
		Bench:          "NCLT Kolkata",
		City:           "Kolkata",
		State:          "West Bengal",
		Lat:            22.5726,
		Lng:            88.3639,
		Email:          "rkulkarni@ibcchambers.in",
		Phone:          "+91 33 2248 9100",
		Initials:       "RK",
		IsVerified:     true,
		Specialization: "Resolution Plan Litigation & NCLAT Appeals",
		ActiveMandates: 5,
	},
}

