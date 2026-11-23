package home

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/atulgrover/agenticprofessionals-net/internal/shared"
)

// Space represents a work-from-cafe or AI research library.
type Space struct {
	ID            string  `json:"id"`
	SpaceCode     string  `json:"spaceCode"`
	Type          string  `json:"type"` // "cafe" or "library"
	Name          string  `json:"name"`
	City          string  `json:"city"`
	State         string  `json:"state"`
	Location      string  `json:"location"`
	Proximity     string  `json:"proximity"`
	Latitude      float64 `json:"latitude"`
	Longitude     float64 `json:"longitude"`
	WifiSpeed     string  `json:"wifiSpeed"`
	PowerSockets  string  `json:"powerSockets"`
	NoiseLevel    string  `json:"noiseLevel"`
	Specialty     string  `json:"specialty"`
	Terminals     string  `json:"terminals,omitempty"`
	AIBooks       string  `json:"aiBooks,omitempty"`
	OpeningHours  string  `json:"openingHours"`
	DirectionsURL string  `json:"directionsUrl"`
	BookingURL    string  `json:"bookingUrl"`
}

// Professional represents a registered practitioner across all roles/cohorts.
type Professional struct {
	ID             string  `json:"id"`
	Slug           string  `json:"slug"`
	Name           string  `json:"name"`
	Role           string  `json:"role"` // "ip", "advocate", "cyber_specialist", "valuer", "arbitrator", "researcher", "learner"
	Designation    string  `json:"designation"`
	RegNo          string  `json:"regNo"`
	Firm           string  `json:"firm"`
	Bench          string  `json:"bench"`
	City           string  `json:"city"`
	State          string  `json:"state"`
	Latitude       float64 `json:"latitude"`
	Longitude      float64 `json:"longitude"`
	Email          string  `json:"email"`
	Phone          string  `json:"phone"`
	Initials       string  `json:"initials"`
	IsVerified     bool    `json:"isVerified"`
	Specialization string  `json:"specialization"`
	Bio            string  `json:"bio"`
	ActiveMandates int     `json:"activeMandates"`
}

var fallbackProfessionals = []Professional{
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
		Latitude:       23.022500,
		Longitude:      72.571400,
		Email:          "sgupta.ip@deloitte.com",
		Phone:          "+91 79 6671 2000",
		Initials:       "SG",
		IsVerified:     true,
		Specialization: "Heavy Industrial, Power & Utilities CIRP",
		Bio:            "Empaneled Insolvency Professional with extensive resolution experience in heavy manufacturing, energy sector restructuring, and cross-border assets under IBC 2016.",
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
		Bench:          "NCLT New Delhi (Principal Bench)",
		City:           "Delhi NCR",
		State:          "Delhi",
		Latitude:       28.613900,
		Longitude:      77.209000,
		Email:          "anuj.jain.ip@pwc.com",
		Phone:          "+91 11 4115 0000",
		Initials:       "AJ",
		IsVerified:     true,
		Specialization: "Real Estate & Mega Infrastructure",
		Bio:            "Lead Resolution Professional in landmark real estate restructuring matters with multi-lender committee coordination under CIRP regulations.",
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
		Latitude:       18.930400,
		Longitude:      72.831700,
		Email:          "mkasodekar.ip@kpmg.com",
		Phone:          "+91 22 3090 1000",
		Initials:       "MK",
		IsVerified:     true,
		Specialization: "EPC Contracting, Ports & Aviation Logistics",
		Bio:            "Over 20 years in corporate turnaround and forensic valuation. Registered Insolvency Professional with high liquidation and resolution success rate.",
		ActiveMandates: 4,
	},
	{
		ID:             "pro-4",
		Slug:           "adv-radhika-sharma",
		Name:           "Adv. Radhika Sharma",
		Role:           "advocate",
		Designation:    "High Court Senior Advocate",
		RegNo:          "D/1420/2012 (Bar Council of Delhi)",
		Firm:           "Sharma & Associates Chambers",
		Bench:          "Delhi High Court & Saket District Court",
		City:           "Delhi NCR",
		State:          "Delhi",
		Latitude:       28.520400,
		Longitude:      77.201500,
		Email:          "radhika@sharmachambers.in",
		Phone:          "+91 11 2651 8840",
		Initials:       "RS",
		IsVerified:     true,
		Specialization: "Commercial Disputes, BNS Cyber Forensics & IBC Appeals",
		Bio:            "Practicing Advocate representing lenders and resolution applicants before NCLAT and Supreme Court of India. Regular speaker on Agentic NSQF legal standards.",
		ActiveMandates: 6,
	},
	{
		ID:             "pro-5",
		Slug:           "dr-vikram-aditya-nair",
		Name:           "Dr. Vikram Aditya Nair",
		Role:           "cyber_specialist",
		Designation:    "Chief Cyber Forensic Analyst & BNS Specialist",
		RegNo:          "DSCI/CE-2021/889",
		Firm:           "National Digital Forensics Center",
		Bench:          "Cyber Police Cells & Karnataka High Court",
		City:           "Bengaluru",
		State:          "Karnataka",
		Latitude:       12.971600,
		Longitude:      77.594600,
		Email:          "vikram.nair@cyberjuris.org",
		Phone:          "+91 80 4120 7765",
		Initials:       "VN",
		IsVerified:     true,
		Specialization: "BNS Section 111 Organized Cyber Crime & Electronic Evidences",
		Bio:            "Certified digital forensics expert specializing in Section 65B/BNS 2023 evidentiary compliance, sovereign LLM inference for evidence hashing, and blockchain tracing.",
		ActiveMandates: 5,
	},
	{
		ID:             "pro-6",
		Slug:           "adv-kavita-krishnan",
		Name:           "Adv. Kavita Krishnan",
		Role:           "advocate",
		Designation:    "Commercial & Appellate Counsel",
		RegNo:          "KAR/892/2015 (Karnataka Bar Council)",
		Firm:           "Apex Law Partners",
		Bench:          "High Court of Karnataka (Vidhana Soudha)",
		City:           "Bengaluru",
		State:          "Karnataka",
		Latitude:       12.986600,
		Longitude:      77.597500,
		Email:          "kavita@apexlawpartners.com",
		Phone:          "+91 80 2221 4450",
		Initials:       "KK",
		IsVerified:     true,
		Specialization: "Commercial Contracts, CPC Section 89 Mediation & Arbitration",
		Bio:            "Senior counsel in cross-border commercial contracts and dispute resolution. Empaneled mediator with over 150 successfully settled commercial disputes.",
		ActiveMandates: 4,
	},
	{
		ID:             "pro-7",
		Slug:           "rajesh-subramanian",
		Name:           "Rajesh Subramanian",
		Role:           "valuer",
		Designation:    "Registered Valuer (Securities & Financial Assets)",
		RegNo:          "IBBI/RV/06/2019/11045",
		Firm:           "Sundaram & Subramanian Valuation Advisory",
		Bench:          "NCLT Hyderabad Bench",
		City:           "Hyderabad",
		State:          "Telangana",
		Latitude:       17.415600,
		Longitude:      78.434700,
		Email:          "rajesh.val@ssadvisory.in",
		Phone:          "+91 40 2335 9901",
		Initials:       "RS",
		IsVerified:     true,
		Specialization: "Liquidation Value Audits & Intangible AI Assets",
		Bio:            "IBBI-registered valuer with over 80 statutory CIRP valuation reports submitted across NCLT benches. Pioneer in valuing algorithmic models and data pipelines.",
		ActiveMandates: 7,
	},
	{
		ID:             "pro-8",
		Slug:           "prof-arundhati-sen",
		Name:           "Prof. Arundhati Sen",
		Role:           "researcher",
		Designation:    "Chair Professor & Computational Law Researcher",
		RegNo:          "NUJS/FAC/2018/042",
		Firm:           "WBNUJS Legal Informatics Center",
		Bench:          "Calcutta High Court Precinct",
		City:           "Kolkata",
		State:          "West Bengal",
		Latitude:       22.570100,
		Longitude:      88.406700,
		Email:          "asen@nujs.edu",
		Phone:          "+91 33 2335 7379",
		Initials:       "AS",
		IsVerified:     true,
		Specialization: "Agentic NSQF Curriculum & Legal Knowledge Graphs",
		Bio:            "Principal investigator on legal ontologies, judicial decision prediction models, and statutory graph reasoning frameworks for Indian law.",
		ActiveMandates: 2,
	},
	{
		ID:             "pro-9",
		Slug:           "adv-harpreet-singh",
		Name:           "Adv. Harpreet Singh",
		Role:           "advocate",
		Designation:    "Criminal Jurisprudence Counsel",
		RegNo:          "PH/3421/2011",
		Firm:           "Capitol Chambers",
		Bench:          "Punjab & Haryana High Court",
		City:           "Chandigarh",
		State:          "Punjab & Haryana",
		Latitude:       30.758900,
		Longitude:      76.804900,
		Email:          "harpreet@capitolchambers.law",
		Phone:          "+91 172 274 0012",
		Initials:       "HS",
		IsVerified:     true,
		Specialization: "BNS 2023 Statutory Transition & Appellate Defense",
		Bio:            "Trial lawyer and author of comparative commentaries between IPC and Bharatiya Nyaya Sanhita (BNS 2023). Regular counsel before the High Court.",
		ActiveMandates: 5,
	},
	{
		ID:             "pro-10",
		Slug:           "tanya-mehta",
		Name:           "Tanya Mehta",
		Role:           "learner",
		Designation:    "Agentic AI Apprentice & Law Scholar",
		RegNo:          "NLSIU/LLB-AI/2024/019",
		Firm:           "National Law School of India University",
		Bench:          "NLSIU AI Commons",
		City:           "Bengaluru",
		State:          "Karnataka",
		Latitude:       12.955800,
		Longitude:      77.512600,
		Email:          "tanya.mehta@nlsiu.ac.in",
		Phone:          "+91 80 2316 0532",
		Initials:       "TM",
		IsVerified:     true,
		Specialization: "Prompt Engineering for Legal Discovery & NSQF L7.0",
		Bio:            "Graduate researcher in agentic workflows, multi-agent arbitration simulations, and air-gapped legal assistance tools.",
		ActiveMandates: 1,
	},
}

var fallbackSpaces = []Space{
	// ─── 8 WORK-FROM-CAFES ───
	{
		ID:            "cafe-bt-saket",
		SpaceCode:     "SPACE-CF-001",
		Type:          "cafe",
		Name:          "Blue Tokai Coffee Roasters — Saket",
		City:          "Delhi NCR",
		State:         "Delhi",
		Location:      "Saidulajab, Saket, New Delhi 110030",
		Proximity:     "350 meters from Saket District Court",
		Latitude:      28.520400,
		Longitude:     77.201500,
		WifiSpeed:     "350 Mbps",
		PowerSockets:  "Every table & private booth",
		NoiseLevel:    "Quiet ambient focus",
		Specialty:     "Cold Brew, Pour-overs, Sourdough Croissants & Artisan Donuts",
		OpeningHours:  "07:30 AM – 10:30 PM",
		DirectionsURL: "https://maps.google.com/?q=28.5204,77.2015",
		BookingURL:    "#reserve-cafe",
	},
	{
		ID:            "cafe-sb-bkc",
		SpaceCode:     "SPACE-CF-002",
		Type:          "cafe",
		Name:          "Starbucks Reserve — BKC",
		City:          "Mumbai",
		State:         "Maharashtra",
		Location:      "G Block BKC, Bandra Kurla Complex, Mumbai 400051",
		Proximity:     "400 meters from NCLT Mumbai Benches 1–5",
		Latitude:      19.066000,
		Longitude:     72.868500,
		WifiSpeed:     "400 Mbps",
		PowerSockets:  "Dual universal sockets at every lounge seat",
		NoiseLevel:    "Executive corporate hum",
		Specialty:     "Micro-lot Reserve Espresso, Nitro Cold Brew & Fresh Bagels",
		OpeningHours:  "07:00 AM – 11:00 PM",
		DirectionsURL: "https://maps.google.com/?q=19.0660,72.8685",
		BookingURL:    "#reserve-cafe",
	},
	{
		ID:            "cafe-tw-vidhana",
		SpaceCode:     "SPACE-CF-003",
		Type:          "cafe",
		Name:          "Third Wave Coffee Roasters — Cunningham",
		City:          "Bengaluru",
		State:         "Karnataka",
		Location:      "Cunningham Road, Vasanth Nagar, Bengaluru 560052",
		Proximity:     "Direct Metro access to Karnataka High Court (Vidhana Soudha)",
		Latitude:      12.986600,
		Longitude:     77.597500,
		WifiSpeed:     "300 Mbps",
		PowerSockets:  "Under-desk power strip with USB-C PD",
		NoiseLevel:    "Quiet focus zone",
		Specialty:     "Single-origin pour-overs, Cinnamon Cruffins & Chocochip Pancakes",
		OpeningHours:  "08:00 AM – 11:30 PM",
		DirectionsURL: "https://maps.google.com/?q=12.9866,77.5975",
		BookingURL:    "#reserve-cafe",
	},
	{
		ID:            "cafe-roastery-hyd",
		SpaceCode:     "SPACE-CF-004",
		Type:          "cafe",
		Name:          "Roastery Coffee House — Banjara Hills",
		City:          "Hyderabad",
		State:         "Telangana",
		Location:      "Road No. 14, Banjara Hills, Hyderabad 500034",
		Proximity:     "15 min drive from Telangana High Court & NCLT Hyderabad",
		Latitude:      17.415600,
		Longitude:     78.434700,
		WifiSpeed:     "300 Mbps",
		PowerSockets:  "Garden patio & interior study booths with dedicated outlets",
		NoiseLevel:    "Serene courtyard library atmosphere",
		Specialty:     "Monsooned Malabar, Cascara Artisanal Brews & Baked Cheesecakes",
		OpeningHours:  "08:00 AM – 11:00 PM",
		DirectionsURL: "https://maps.google.com/?q=17.4156,78.4347",
		BookingURL:    "#reserve-cafe",
	},
	{
		ID:            "cafe-bt-parkst",
		SpaceCode:     "SPACE-CF-005",
		Type:          "cafe",
		Name:          "Blue Tokai Coffee Roasters — Park Street",
		City:          "Kolkata",
		State:         "West Bengal",
		Location:      "Park Street Heritage Zone, Kolkata 700016",
		Proximity:     "1.2 km from Calcutta High Court & City Civil Court",
		Latitude:      22.551000,
		Longitude:     88.352400,
		WifiSpeed:     "300 Mbps",
		PowerSockets:  "Work counters equipped with universal plug points",
		NoiseLevel:    "Tranquil reading lounge",
		Specialty:     "French Press, Sea Salt Hot Chocolate & Artisanal Brioche Donuts",
		OpeningHours:  "08:00 AM – 10:30 PM",
		DirectionsURL: "https://maps.google.com/?q=22.5510,88.3524",
		BookingURL:    "#reserve-cafe",
	},
	{
		ID:            "cafe-sec7-chd",
		SpaceCode:     "SPACE-CF-006",
		Type:          "cafe",
		Name:          "Sector 7 Social & Work Cafe",
		City:          "Chandigarh",
		State:         "Punjab & Haryana",
		Location:      "Madhya Marg, Sector 7-C, Chandigarh 160019",
		Proximity:     "2.5 km from Punjab & Haryana High Court (Sector 1)",
		Latitude:      30.730200,
		Longitude:     76.804100,
		WifiSpeed:     "350 Mbps",
		PowerSockets:  "Executive work tables with high-power AC outlets",
		NoiseLevel:    "Daytime quiet co-working mode",
		Specialty:     "Espresso Tonic, Avocado Brioche & Fresh Doughnuts",
		OpeningHours:  "09:00 AM – 11:00 PM",
		DirectionsURL: "https://maps.google.com/?q=30.7302,76.8041",
		BookingURL:    "#reserve-cafe",
	},
	{
		ID:            "cafe-onedegree-pune",
		SpaceCode:     "SPACE-CF-007",
		Type:          "cafe",
		Name:          "One Degree Coffee Roasters — Kalyani Nagar",
		City:          "Pune",
		State:         "Maharashtra",
		Location:      "East Avenue, Kalyani Nagar, Pune 411006",
		Proximity:     "10 min drive from Shivaji Nagar District & Sessions Court",
		Latitude:      18.548200,
		Longitude:     73.902200,
		WifiSpeed:     "300 Mbps",
		PowerSockets:  "Every desk and communal table",
		NoiseLevel:    "Quiet focus alcove",
		Specialty:     "Aeropress Special Reserve, Blueberry Glazed Donuts & Quiches",
		OpeningHours:  "08:00 AM – 10:00 PM",
		DirectionsURL: "https://maps.google.com/?q=18.5482,73.9022",
		BookingURL:    "#reserve-cafe",
	},
	{
		ID:            "cafe-mocha-ahmedabad",
		SpaceCode:     "SPACE-CF-008",
		Type:          "cafe",
		Name:          "Mocha Work Cafe — Bodakdev",
		City:          "Ahmedabad",
		State:         "Gujarat",
		Location:      "Sindhu Bhavan Marg, Bodakdev, Ahmedabad 380054",
		Proximity:     "Direct corridor to Gujarat High Court (Sola)",
		Latitude:      23.039600,
		Longitude:     72.508500,
		WifiSpeed:     "350 Mbps",
		PowerSockets:  "Dedicated laptop power bank at all booths",
		NoiseLevel:    "Spacious quiet zone",
		Specialty:     "Affogato, Chocolate Mud Cake, Cinnamon Buns & Filter Roasts",
		OpeningHours:  "09:00 AM – 11:30 PM",
		DirectionsURL: "https://maps.google.com/?q=23.0396,72.5085",
		BookingURL:    "#reserve-cafe",
	},

	// ─── 8 AI LIBRARIES WITH COMPUTERS & AI BOOKS ───
	{
		ID:            "lib-delhi-ai",
		SpaceCode:     "SPACE-LB-001",
		Type:          "library",
		Name:          "National Cyber & Legal AI Terminals — Saket",
		City:          "Delhi NCR",
		State:         "Delhi",
		Location:      "Institutional Area, Saket District Court Precinct, New Delhi 110017",
		Proximity:     "Adjacent to Saket Lawyers Chambers & Bar Library",
		Latitude:      28.524500,
		Longitude:     77.206200,
		WifiSpeed:     "1 Gbps Dedicated Fiber",
		PowerSockets:  "Dual surge-protected power rails & UPS backup",
		NoiseLevel:    "Silent research sanctuary (<30 dB)",
		Specialty:     "Full Corpus of Agentic LLMs, Constitutional AI & Statutory NLP",
		Terminals:     "10 High-Performance Workstations with Dual 4K Displays & Dev Containers",
		AIBooks:       "Reinforcement Learning (Sutton & Barto), Modern Agent Architectures, Constitutional AI Standards, BNS 2023 Digital Commentary",
		OpeningHours:  "08:00 AM – 09:00 PM",
		DirectionsURL: "https://maps.google.com/?q=28.5245,77.2062",
		BookingURL:    "#reserve-library",
	},
	{
		ID:            "lib-mumbai-fort",
		SpaceCode:     "SPACE-LB-002",
		Type:          "library",
		Name:          "Mumbai Legal Tech & AI Reading Room — Fort",
		City:          "Mumbai",
		State:         "Maharashtra",
		Location:      "High Court Annexe, Fort Heritage Precinct, Mumbai 400032",
		Proximity:     "Walking distance to Bombay High Court & City Civil Court",
		Latitude:      18.930400,
		Longitude:     72.831700,
		WifiSpeed:     "1 Gbps Fiber",
		PowerSockets:  "Desktop terminals with USB-C PD & Ethernet drops",
		NoiseLevel:    "Strict silent study zone",
		Specialty:     "BNS, IBC & CPC Vector Embeddings & Offline Precedent Retrieval",
		Terminals:     "8 GPU-enabled Workstations (RTX 4090) for local LLM inference experiments",
		AIBooks:       "Deep Learning (Goodfellow), Pattern Recognition & Machine Learning, Agentic Workflows for Legal Discovery, Supreme Court AI Benchmarks",
		OpeningHours:  "08:30 AM – 08:30 PM",
		DirectionsURL: "https://maps.google.com/?q=18.9304,72.8317",
		BookingURL:    "#reserve-library",
	},
	{
		ID:            "lib-nlsiu-blr",
		SpaceCode:     "SPACE-LB-003",
		Type:          "library",
		Name:          "NLSIU AI & Computational Law Commons",
		City:          "Bengaluru",
		State:         "Karnataka",
		Location:      "Nagarbhavi Academic Campus, Bengaluru 560072",
		Proximity:     "National Law School of India University Central Library",
		Latitude:      12.955800,
		Longitude:     77.512600,
		WifiSpeed:     "1 Gbps NKN Campus Network",
		PowerSockets:  "Integrated carrel power modules with surge suppressors",
		NoiseLevel:    "Deep academic silence",
		Specialty:     "Skillpedia NSQF Level 7.0 & Level 8.0 Agentic Curriculum Reserve",
		Terminals:     "12 Dual-Monitor Linux Workstations pre-loaded with Python SDK & LightRAG",
		AIBooks:       "Artificial Intelligence: A Modern Approach (Russell & Norvig), Multi-Agent Systems (Wooldridge), Generative AI for Sovereign Governance",
		OpeningHours:  "08:00 AM – Midnight",
		DirectionsURL: "https://maps.google.com/?q=12.9558,77.5126",
		BookingURL:    "#reserve-library",
	},
	{
		ID:            "lib-nalsar-hyd",
		SpaceCode:     "SPACE-LB-004",
		Type:          "library",
		Name:          "NALSAR Sovereign Agent Lab & Law Library",
		City:          "Hyderabad",
		State:         "Telangana",
		Location:      "Justice City, Shameerpet, Hyderabad 500101",
		Proximity:     "NALSAR Law University Digital Informatics Center",
		Latitude:      17.595600,
		Longitude:     78.572400,
		WifiSpeed:     "1 Gbps High-Speed Academic Link",
		PowerSockets:  "Every study desk with universal dual outlets",
		NoiseLevel:    "Quiet focus repository",
		Specialty:     "Judicial Precedents Graph, Section 29A IBC Automations & BNS Cyber Datasets",
		Terminals:     "10 High-spec Terminals with JupyterLab, HuggingFace Local Models & LangChain",
		AIBooks:       "Foundations of Large Language Models, Prompt Engineering & Autonomous Agents, Insolvency Law & Restructuring Precedents (2016–2026)",
		OpeningHours:  "09:00 AM – 10:00 PM",
		DirectionsURL: "https://maps.google.com/?q=17.5956,78.5724",
		BookingURL:    "#reserve-library",
	},
	{
		ID:            "lib-nujs-kolkata",
		SpaceCode:     "SPACE-LB-005",
		Type:          "library",
		Name:          "WBNUJS AI Statutory Informatics Center",
		City:          "Kolkata",
		State:         "West Bengal",
		Location:      "12 LB Block, Sector III, Salt Lake City, Kolkata 700098",
		Proximity:     "National University of Juridical Sciences (Salt Lake)",
		Latitude:      22.570100,
		Longitude:     88.406700,
		WifiSpeed:     "1 Gbps Optical Fiber",
		PowerSockets:  "Built-in desk power strips & wireless phone charging pads",
		NoiseLevel:    "Silent research hall",
		Specialty:     "Commercial Drafting AI Corpora, Cross-Border Insolvency & Forensics",
		Terminals:     "8 Development Terminals with Git, Docker & Sovereign Knowledge Graphs",
		AIBooks:       "Designing Data-Intensive Applications, Machine Learning Engineering, Admiralty & Company Law Precedents Compendium",
		OpeningHours:  "08:30 AM – 09:30 PM",
		DirectionsURL: "https://maps.google.com/?q=22.5701,88.4067",
		BookingURL:    "#reserve-library",
	},
	{
		ID:            "lib-chd-bar",
		SpaceCode:     "SPACE-LB-006",
		Type:          "library",
		Name:          "Punjab & Haryana High Court Bar AI Library",
		City:          "Chandigarh",
		State:         "Punjab & Haryana",
		Location:      "Capitol Complex, Sector 1, Chandigarh 160001",
		Proximity:     "High Court Bar Association Heritage Building",
		Latitude:      30.758900,
		Longitude:     76.804900,
		WifiSpeed:     "500 Mbps Dedicated Legal Network",
		PowerSockets:  "Individual carrels with 3-pin universal sockets",
		NoiseLevel:    "Chambers silent study environment",
		Specialty:     "Criminal Jurisprudence (BNS 2023) & Criminal Procedure (BNSS 2023) AI Corpus",
		Terminals:     "6 Dedicated Legal Research Workstations with All India Reporter & SCC Online AI",
		AIBooks:       "Speech and Language Processing (Jurafsky), Probabilistic Graphical Models, Penal Code to BNS Comparative Concordance",
		OpeningHours:  "09:00 AM – 07:00 PM",
		DirectionsURL: "https://maps.google.com/?q=30.7589,76.8049",
		BookingURL:    "#reserve-library",
	},
	{
		ID:            "lib-ils-pune",
		SpaceCode:     "SPACE-LB-007",
		Type:          "library",
		Name:          "ILS Law College AI & Empirical Research Desk",
		City:          "Pune",
		State:         "Maharashtra",
		Location:      "Law College Road, Shivajinagar, Pune 411004",
		Proximity:     "ILS Law College Campus Library",
		Latitude:      18.517300,
		Longitude:     73.829300,
		WifiSpeed:     "500 Mbps Campus Fiber",
		PowerSockets:  "Power at all reading desks with surge protection",
		NoiseLevel:    "Scholarly quiet zone",
		Specialty:     "Legal Knowledge Engineering & Statutory Ontologies",
		Terminals:     "8 Dual-Screen Workstations with VS Code, Ollama & Python LLM harnesses",
		AIBooks:       "Hands-On Machine Learning with Scikit-Learn, Keras and TensorFlow, Deep Learning for NLP, Corporate Debt Restructuring Cases",
		OpeningHours:  "08:00 AM – 08:00 PM",
		DirectionsURL: "https://maps.google.com/?q=18.5173,73.8293",
		BookingURL:    "#reserve-library",
	},
	{
		ID:            "lib-gnlu-ahmedabad",
		SpaceCode:     "SPACE-LB-008",
		Type:          "library",
		Name:          "GNLU Autonomous Agentics & Legal AI Archive",
		City:          "Ahmedabad",
		State:         "Gujarat",
		Location:      "Attalika Avenue, Knowledge Corridor, Koba, Gandhinagar 382426",
		Proximity:     "Gujarat National Law University Research Block",
		Latitude:      23.161000,
		Longitude:     72.636900,
		WifiSpeed:     "1 Gbps Optical Backbone",
		PowerSockets:  "Power carrels with modular surge-protected blocks",
		NoiseLevel:    "Ultra-silent study sanctum",
		Specialty:     "Cross-Border Trade Law, AI Governance & Maritime Dispute Resolution",
		Terminals:     "10 Workstations configured for multi-agent legal simulations & mock arbitrations",
		AIBooks:       "Reinforcement Learning from Human Feedback, Building Systems with the ChatGPT API, Law & Autonomous Systems Treatise",
		OpeningHours:  "08:00 AM – 11:00 PM",
		DirectionsURL: "https://maps.google.com/?q=23.1610,72.6369",
		BookingURL:    "#reserve-library",
	},
}

// querySpacesFromDB attempts to fetch spaces from PostgreSQL, falling back to static seeds.
func querySpacesFromDB(db *sql.DB, spaceType string) []Space {
	if db == nil {
		return filterFallbackSpaces(spaceType)
	}

	query := `
		SELECT 
			id, space_code, type, name, city, COALESCE(state, '') as state,
			location, COALESCE(proximity, '') as proximity,
			latitude, longitude,
			COALESCE(wifi_speed, '300+ Mbps') as wifi_speed,
			COALESCE(power_sockets, 'At every workstation') as power_sockets,
			COALESCE(noise_level, 'Quiet focus') as noise_level,
			COALESCE(specialty, '') as specialty,
			COALESCE(terminals, '') as terminals,
			COALESCE(ai_books, '') as ai_books,
			COALESCE(opening_hours, '08:00 AM – 10:00 PM') as opening_hours,
			COALESCE(directions_url, '') as directions_url,
			COALESCE(booking_url, '#book') as booking_url
		FROM agentic_spaces
		WHERE is_published = true
	`
	var rows *sql.Rows
	var err error

	if spaceType != "" && !strings.EqualFold(spaceType, "all") {
		query += " AND type = $1 ORDER BY id ASC;"
		rows, err = db.Query(query, spaceType)
	} else {
		query += " ORDER BY type ASC, id ASC;"
		rows, err = db.Query(query)
	}

	if err != nil {
		log.Printf("[WARN] Error querying agentic_spaces: %v. Using fallback data.\n", err)
		return filterFallbackSpaces(spaceType)
	}
	defer rows.Close()

	var spaces []Space
	for rows.Next() {
		var s Space
		if err := rows.Scan(
			&s.ID, &s.SpaceCode, &s.Type, &s.Name, &s.City, &s.State,
			&s.Location, &s.Proximity, &s.Latitude, &s.Longitude,
			&s.WifiSpeed, &s.PowerSockets, &s.NoiseLevel,
			&s.Specialty, &s.Terminals, &s.AIBooks,
			&s.OpeningHours, &s.DirectionsURL, &s.BookingURL,
		); err != nil {
			log.Printf("[WARN] Scan error in agentic_spaces: %v\n", err)
			continue
		}
		spaces = append(spaces, s)
	}

	if len(spaces) == 0 {
		return filterFallbackSpaces(spaceType)
	}

	return spaces
}

func filterFallbackSpaces(spaceType string) []Space {
	if spaceType == "" || strings.EqualFold(spaceType, "all") {
		return fallbackSpaces
	}
	var filtered []Space
	for _, s := range fallbackSpaces {
		if strings.EqualFold(s.Type, spaceType) {
			filtered = append(filtered, s)
		}
	}
	return filtered
}

// queryProfessionalsFromDB attempts to fetch registered professionals from PostgreSQL, falling back to static seeds.
func queryProfessionalsFromDB(db *sql.DB, role string) []Professional {
	if db == nil {
		return filterFallbackProfessionals(role)
	}

	query := `
		SELECT 
			id, slug, name, role, designation,
			COALESCE(reg_no, '') as reg_no,
			COALESCE(firm, '') as firm,
			COALESCE(bench, '') as bench,
			city, COALESCE(state, '') as state,
			latitude, longitude,
			COALESCE(email, '') as email,
			COALESCE(phone, '') as phone,
			COALESCE(initials, '') as initials,
			is_verified,
			COALESCE(specialization, '') as specialization,
			COALESCE(bio, '') as bio,
			COALESCE(active_mandates, 1) as active_mandates
		FROM agentic_professionals
	`
	var rows *sql.Rows
	var err error

	if role != "" && !strings.EqualFold(role, "all") {
		query += " WHERE role = $1 ORDER BY id ASC;"
		rows, err = db.Query(query, role)
	} else {
		query += " ORDER BY id ASC;"
		rows, err = db.Query(query)
	}

	if err != nil {
		log.Printf("[WARN] Error querying agentic_professionals: %v. Using fallback data.\n", err)
		return filterFallbackProfessionals(role)
	}
	defer rows.Close()

	var pros []Professional
	for rows.Next() {
		var p Professional
		if err := rows.Scan(
			&p.ID, &p.Slug, &p.Name, &p.Role, &p.Designation,
			&p.RegNo, &p.Firm, &p.Bench, &p.City, &p.State,
			&p.Latitude, &p.Longitude, &p.Email, &p.Phone,
			&p.Initials, &p.IsVerified, &p.Specialization,
			&p.Bio, &p.ActiveMandates,
		); err != nil {
			log.Printf("[WARN] Scan error in agentic_professionals: %v\n", err)
			continue
		}
		pros = append(pros, p)
	}

	if len(pros) == 0 {
		return filterFallbackProfessionals(role)
	}

	return pros
}

func filterFallbackProfessionals(role string) []Professional {
	if role == "" || strings.EqualFold(role, "all") {
		return fallbackProfessionals
	}
	var filtered []Professional
	for _, p := range fallbackProfessionals {
		if strings.EqualFold(p.Role, role) {
			filtered = append(filtered, p)
		}
	}
	return filtered
}

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

	// ─── RADAR SPACES ENDPOINTS ───
	mux.HandleFunc("/api/radar/spaces", func(w http.ResponseWriter, r *http.Request) {
		shared.EnableCORS(w)
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		spaceType := strings.ToLower(r.URL.Query().Get("type"))
		spaces := querySpacesFromDB(db, spaceType)
		json.NewEncoder(w).Encode(map[string]any{"spaces": spaces})
	})

	mux.HandleFunc("/api/radar/cafes", func(w http.ResponseWriter, r *http.Request) {
		shared.EnableCORS(w)
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		cafes := querySpacesFromDB(db, "cafe")
		json.NewEncoder(w).Encode(map[string]any{"cafes": cafes, "spaces": cafes})
	})

	mux.HandleFunc("/api/radar/libraries", func(w http.ResponseWriter, r *http.Request) {
		shared.EnableCORS(w)
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		libs := querySpacesFromDB(db, "library")
		json.NewEncoder(w).Encode(map[string]any{"libraries": libs, "spaces": libs})
	})

	// ─── RADAR PROFESSIONALS ENDPOINT ───
	mux.HandleFunc("/api/radar/professionals", func(w http.ResponseWriter, r *http.Request) {
		shared.EnableCORS(w)
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		role := strings.ToLower(r.URL.Query().Get("role"))
		pros := queryProfessionalsFromDB(db, role)
		json.NewEncoder(w).Encode(map[string]any{"professionals": pros})
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
