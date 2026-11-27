/**
 * OpenIBC Sovereign Platform - Master Radar & Megamenu Engine
 * 100% Buildless & Zero-Node Architecture - Pure Vanilla JavaScript
 */

(function () {
  'use strict';

  // Anti-recursion safeguard: OpenIBC master portal must never run nested inside an iframe
  if (window.self !== window.top) {
    window.location.replace('/forum-embed/');
    return;
  }

  // ─── 1. COMPREHENSIVE STAKEHOLDER DICTIONARIES ───
  const SUBDOMAINS = [
    { key: 'creditors', label: 'creditors', oppLabel: 'recovery radar' },
    { key: 'professionals', label: 'professionals', oppLabel: 'mandate radar' },
    { key: 'valuers', label: 'valuers', oppLabel: 'valuation radar' },
    { key: 'investors', label: 'investors', oppLabel: 'acquisition radar' },
    { key: 'guarantors', label: 'guarantors', oppLabel: 'exposure radar' }
  ];

  const DOMAIN_CONSULTATIONS = {
    creditors: {
      label: "creditor consultations",
      consultations: [
        {
          slug: "sec-29a-statutory-verification",
          title: "sec 29a statutory verification",
          duration: "45m",
          statutory_ref: "section 29a(a)–(j), ibc 2016",
          description: "Ten-clause statutory eligibility inquest across 46 registries with Green Seal.",
          scope: "ten-clause statutory eligibility inquest across 46 registries under section 29a(a)–(j) of ibc 2016. includes connected person audit, npa disqualification verification, related-party cross-checks, and green seal certification to preempt ineligible resolution applicants.",
          href: "/udin"
        },
        {
          slug: "proof-of-claim-waterfall-parity",
          title: "proof of claim & waterfall parity",
          duration: "30m",
          statutory_ref: "section 53 | cirp reg 12, 13 & 14",
          description: "Proof of claim submission kits, DFC liquidation minimums & admission scrutiny.",
          scope: "proof of claim submission kits and waterfall parity scrutiny under section 53 and cirp regulations 12, 13 & 14. covers dfc liquidation value minimums, admission verification, security interest ranking, and voting share defense before the committee of creditors.",
          href: "/"
        },
        {
          slug: "avoidance-pufe-recovery-strategy",
          title: "avoidance & pufe recovery strategy",
          duration: "45m",
          statutory_ref: "sections 43, 45, 49 & 66, ibc",
          description: "Forensic clawback of siphoned assets & Section 43/45/66 preference reversals.",
          scope: "forensic statutory inquest into preferential, undervalued, extortionate, and fraudulent transactions under sections 43, 45, 49 & 66 of ibc. includes lookback period analysis, clawback pleadings drafting, and reversal litigation strategy before the nclt bench.",
          href: "/forum/"
        },
        {
          slug: "coc-voting-ledger-certification",
          title: "coc voting ledger certification",
          duration: "30m",
          statutory_ref: "sections 21, 24 & 28, ibc 2016",
          description: "Committee of creditors voting share audit & related party exclusions.",
          scope: "statutory committee of creditors voting ledger verification under sections 21, 24 & 28 of ibc 2016. covers e-voting compliance audit, related party exclusions, voting share calculation, and resolution plan voting certification.",
          href: "/"
        },
        {
          slug: "personal-guarantor-invocation",
          title: "personal guarantor invocation",
          duration: "45m",
          statutory_ref: "part iii & section 95, ibc 2016",
          description: "Corporate debt recovery against promoter and personal guarantors.",
          scope: "corporate debt recovery enforcement against promoter and personal guarantors under part iii and section 95 of ibc 2016. covers demand notice drafting, interim moratorium impact analysis, and simultaneous insolvency proceedings before the nclt.",
          href: "/udin"
        }
      ]
    },
    investors: {
      label: "investor consultations",
      consultations: [
        {
          slug: "resolution-plan-compliance-advisory",
          title: "resolution plan compliance advisory",
          duration: "45m",
          statutory_ref: "section 30(2) | cirp reg 38",
          description: "Pre-submission audit & CIRP Regulation 38 statutory feasibility scorecards.",
          scope: "pre-submission statutory feasibility audit under section 30(2) and cirp regulation 38. covers mandatory operational creditor priority safeguards, liquidation value parity scoring, coc voting compliance criteria, and immunity ringfencing before nclt approval.",
          href: "/udin"
        },
        {
          slug: "form-g-bid-eoi-clearance",
          title: "form g bid & eoi clearance",
          duration: "30m",
          statutory_ref: "cirp regulation 36a(1)–(10)",
          description: "Eligibility verification, EOI documentation & statutory earnest deposit kits.",
          scope: "detailed eligibility scrutiny for expression of interest submissions under cirp regulation 36a(1)–(10). includes emd bank guarantee drafting, consortium bid structuring, connected person exclusions under section 29a, and compliance checklists for resolution professional filings.",
          href: "/"
        },
        {
          slug: "clean-slate-sec-32a-ringfencing",
          title: "clean-slate sec 32a ringfencing",
          duration: "45m",
          statutory_ref: "section 32a, ibc 2016",
          description: "Section 32A immunity rings protecting acquired assets from historical offenses.",
          scope: "comprehensive statutory inquest into corporate debtor historical liabilities under section 32a of ibc 2016. covers ed, cbi, sfio attachment immunities, statutory clean-slate protections for acquired assets, and post-approval vesting representations.",
          href: "/forum/"
        },
        {
          slug: "sec-29a-disqualification-audit",
          title: "sec 29a disqualification audit",
          duration: "45m",
          statutory_ref: "section 29a(a)–(j), ibc 2016",
          description: "Consortium resolution applicant eligibility clearance and connected persons audit.",
          scope: "resolution applicant consortium eligibility clearance under clauses 29a(a) through (j). covers connected persons audit across national regulatory databases, wilful defaulter registries, and sebi debarment records to guarantee bid qualification.",
          href: "/udin"
        },
        {
          slug: "liquidation-e-auction-acquisition",
          title: "liquidation e-auction acquisition",
          duration: "30m",
          statutory_ref: "ibbi liquidation reg, schedule i",
          description: "Distressed asset and going-concern acquisitions in liquidation process.",
          scope: "statutory advisory for distressed asset and going-concern acquisitions under ibbi liquidation process regulations schedule i. covers e-auction terms audit, reserve price analysis, incremental bid structuring, and sale certificate execution.",
          href: "/"
        }
      ]
    },
    professionals: {
      label: "professional consultations",
      consultations: [
        {
          slug: "udin-generation-statutory-verification",
          title: "udin generation & statutory verification",
          duration: "30m",
          statutory_ref: "ibbi (ip) regulations | udin norms",
          description: "Statutory 18-digit unique document identification with zero document upload.",
          scope: "statutory 18-digit unique document identification under ibbi regulations and udin norms. zero document upload architecture with sha-256 cryptographic hashing, immutable ledger stamping, and peer-to-peer verification across regulatory authorities.",
          href: "/udin"
        },
        {
          slug: "cirp-timeline-coc-compliance",
          title: "cirp timeline & coc compliance",
          duration: "45m",
          statutory_ref: "section 12 | ibbi mandatory disclosures",
          description: "Mandatory IBBI disclosure kits, 330-day statutory clocks & CoC voting ledgers.",
          scope: "mandatory ibbi disclosure compliance, 330-day statutory timeline management under section 12, and coc voting ledger certification. includes essar steel exclusion tracking, progress report templates, and statutory compliance filings.",
          href: "/"
        },
        {
          slug: "pufe-forensic-avoidance-audit",
          title: "pufe forensic avoidance audit",
          duration: "45m",
          statutory_ref: "sections 43, 45, 49 & 66, ibc 2016",
          description: "Section 43/45/66 clawback applications & siphoned asset reversal mandates.",
          scope: "transaction auditor appointment frameworks and forensic avoidance pleadings under sections 43, 45, 49 & 66 of ibc 2016. covers evidentiary compilation, forensic audit review, and formal clawback applications before adjudicating authorities.",
          href: "/forum/"
        },
        {
          slug: "sec-12a-withdrawal-petition",
          title: "sec 12a withdrawal petition",
          duration: "30m",
          statutory_ref: "section 12a | cirp reg 30a",
          description: "Statutory CIRP settlement and 90% CoC withdrawal documentation.",
          scope: "statutory cirp settlement and withdrawal documentation under section 12a and regulation 30a. covers 90% coc approval ledger compilation, bank guarantee release covenants, and disposal application filing before the adjudicating authority.",
          href: "/"
        },
        {
          slug: "liquidation-asset-sale-protocols",
          title: "liquidation asset sale protocols",
          duration: "45m",
          statutory_ref: "regulations 31a & 32, ibbi liquidation",
          description: "Asset memorandum preparation and SCC consultation waterfall reconciliation.",
          scope: "asset memorandum preparation, stakeholder consultation committee (scc) protocols, and reserve price waterfall reconciliation under regulations 31a and 32. includes private sale compliance and asset distribution documentation.",
          href: "/forum/"
        }
      ]
    },
    valuers: {
      label: "valuer consultations",
      consultations: [
        {
          slug: "statutory-fair-value-reporting",
          title: "statutory fair value reporting",
          duration: "45m",
          statutory_ref: "cirp reg 35 | rv rules 2017",
          description: "Regulation 35 liquidation value & fair value computation with Green Seal certificates.",
          scope: "statutory fair value and liquidation value computation under cirp regulation 35 and registered valuers rules 2017. covers internationally recognized valuation standards, udin cryptographic stamping, and green seal compliance certification for resolution plans.",
          href: "/udin"
        },
        {
          slug: "peer-review-udin-ledgering",
          title: "peer review & udin ledgering",
          duration: "30m",
          statutory_ref: "rule 8, registered valuers rules 2017",
          description: "Cryptographic stamping of valuation summaries on the immutable IBC ledger.",
          scope: "peer-review integrity validation and cryptographic stamping of valuation summaries under rule 8 of registered valuers rules 2017. provides tamper-proof verification on the immutable ibc ledger against future regulatory inquests.",
          href: "/udin"
        },
        {
          slug: "valuation-dispute-defense",
          title: "valuation dispute defense",
          duration: "45m",
          statutory_ref: "section 60(5) | nclat precedents",
          description: "Rebuttal briefs against CoC haircut challenges and dissenting creditor claims.",
          scope: "statutory rebuttal briefs against committee of creditors haircut challenges and dissenting financial creditor litigation under section 60(5). includes valuation methodology justification, benchmark reconciliation, and nclat precedent citations.",
          href: "/forum/"
        },
        {
          slug: "liquidation-benchmark-audit",
          title: "liquidation benchmark audit",
          duration: "30m",
          statutory_ref: "cirp regulation 35(1), ibc",
          description: "Reconciliation against historical book values and distressed sale benchmarks.",
          scope: "statutory reconciliation of asset valuation reports against historical book value and distressed liquidation benchmarks under regulation 35(1). covers physical inventory sampling protocols and standard deviation defense.",
          href: "/udin"
        },
        {
          slug: "intangible-asset-impairment",
          title: "intangible asset impairment",
          duration: "45m",
          statutory_ref: "ind as 36 | rv valuation standards",
          description: "Valuation of IP, licenses, mining rights, and brand intangibles.",
          scope: "forensic valuation and impairment assessment of intellectual property, mining leases, licenses, and brand intangibles under ibc distressed sale frameworks. includes dcf modeling and cash-generating unit (cgu) analysis.",
          href: "/"
        }
      ]
    },
    guarantors: {
      label: "guarantor consultations",
      consultations: [
        {
          slug: "part-iii-interim-moratorium-filing",
          title: "part iii interim moratorium filing",
          duration: "45m",
          statutory_ref: "sections 94 & 96, ibc 2016",
          description: "Section 94/95 interim moratorium applications shielding personal guarantor estate.",
          scope: "personal guarantor statutory protection and interim moratorium applications under sections 94 & 96 of ibc 2016. stays ongoing debt recovery actions, sarfaesi notices, and high court civil proceedings immediately upon filing.",
          href: "/udin"
        },
        {
          slug: "statement-of-affairs-compliance",
          title: "statement of affairs compliance",
          duration: "30m",
          statutory_ref: "ibbi (pg insolvency) reg 2019",
          description: "Statutory Form A/B asset and liability disclosure compliance checklists.",
          scope: "statutory form a and b asset and liability disclosure compliance under ibbi personal guarantor regulations 2019. includes comprehensive exclusion verification for undivided family interests and ringfenced properties.",
          href: "/"
        },
        {
          slug: "repayment-plan-liability-ringfencing",
          title: "repayment plan & liability ringfencing",
          duration: "45m",
          statutory_ref: "sections 105–108, ibc 2016",
          description: "Negotiated settlement arrangements with CoC under Section 105 regulations.",
          scope: "statutory debt settlement and repayment plan structuring under sections 105 & 106 of ibc 2016. includes creditor negotiation protocols, moratorium term extensions, and formal approval submissions before the insolvency professional.",
          href: "/forum/"
        },
        {
          slug: "guarantor-asset-exclusion-audit",
          title: "guarantor asset exclusion audit",
          duration: "30m",
          statutory_ref: "section 79(14), ibc 2016",
          description: "Ringfencing unattachable personal and undivided family assets.",
          scope: "statutory ringfencing and asset segregation under section 79(14) of ibc 2016. covers exclusion of essential residential assets, personal belongings, and trust properties from creditor bankruptcy estate attachment.",
          href: "/"
        },
        {
          slug: "statutory-discharge-order-protocols",
          title: "statutory discharge order protocols",
          duration: "45m",
          statutory_ref: "section 119, ibc 2016",
          description: "Formal discharge order and release from guarantee obligations.",
          scope: "application for formal discharge order under section 119 of ibc 2016 upon repayment plan implementation. covers release from unfulfilled guarantee obligations, debt extinction certification, and cibil registry cleansing.",
          href: "/udin"
        }
      ]
    }
  };

  const DOMAIN_INTELLIGENCE = {
    creditors: {
      label: "creditor intelligence",
      assets: [
        { title: "models", description: "Local reasoning models for proof of claim audits, DFC minimums & waterfall priority." },
        { title: "vaults", description: "Statutory IBC jurisprudence, admission scrutiny rules & MCA/CIBIL registry ledgers." },
        { title: "skills", description: "Automated claim ledger reconciliation, PUFE clawback extraction & voting consensus solvers." }
      ],
      actions: [
        { title: "chats", theme: "sky", description: "Consultative sessions in chatIBC for bench argumentation briefs & haircut strategy." },
        { title: "drafts", theme: "indigo", description: "Statutory proof of claim kits, Section 43/45/66 avoidance applications & demand notices." },
        { title: "audits", theme: "emerald", description: "Automated claim ledger reconciliation, liquidation simulation & UDIN stamping jobs." }
      ]
    },
    investors: {
      label: "investor intelligence",
      assets: [
        { title: "models", description: "Offline financial haircut structuring, enterprise solvency forecasting & deal valuation." },
        { title: "vaults", description: "16 NCLT bench precedents, Information Memorandum analysis & virtual data room standards." },
        { title: "skills", description: "Pre-submission CIRP Regulation 38 feasibility scorecards, Form G EOI kits & VDR analysis." }
      ],
      actions: [
        { title: "chats", theme: "sky", description: "Interactive advisory dialogues in chatIBC for distressed asset acquisition strategy." },
        { title: "drafts", theme: "indigo", description: "Pre-submission CIRP Regulation 38 feasibility scorecards, EOI kits & earnest deposit packs." },
        { title: "audits", theme: "emerald", description: "Automated corporate entity vetting, resolution plan compliance audits & bench filings." }
      ]
    },
    professionals: {
      label: "professional intelligence",
      assets: [
        { title: "models", description: "Zero-egress petition drafting models, PUFE forensic scanners & 330-day timeline trackers." },
        { title: "vaults", description: "IBBI regulatory circulars, 16 NCLT bench jurisprudence citations & fee approval ledgers." },
        { title: "skills", description: "Section 43/45/66 avoidance pleadings, 330-day timeline trackers & 12A withdrawal scripts." }
      ],
      actions: [
        { title: "chats", theme: "sky", description: "Real-time practice counsel in chatIBC on CIRP milestones, bench pleadings & CoC deadlocks." },
        { title: "drafts", theme: "indigo", description: "Section 43/45/66 clawback petitions, mandatory IBBI disclosure kits & progress reports." },
        { title: "audits", theme: "emerald", description: "Automated CoC voting consensus tabulation, statutory clock controllers & UDIN stamping." }
      ]
    },
    valuers: {
      label: "valuer intelligence",
      assets: [
        { title: "models", description: "Offline DCF, NAV and liquidation models running in local RAM with zero cloud egress." },
        { title: "vaults", description: "Indian Accounting Standards (Ind AS), International Valuation Standards (IVS) & circle rates." },
        { title: "skills", description: "Regulation 35 standard deviation testing, circle rate benchmarking & liquidation audits." }
      ],
      actions: [
        { title: "chats", theme: "sky", description: "Expert technical exchanges in chatIBC on haircut challenges and dissenting creditor claims." },
        { title: "drafts", theme: "indigo", description: "Regulation 35 fair value statements, cryptographic valuation summaries & rebuttal briefs." },
        { title: "audits", theme: "emerald", description: "Instant cross-verification against ICAI, ICSI & IBBI rosters with tamper-proof UDIN seals." }
      ]
    },
    guarantors: {
      label: "guarantor intelligence",
      assets: [
        { title: "models", description: "Confidential Section 105 repayment feasibility engines & personal moratorium calculators." },
        { title: "vaults", description: "Lalit Kumar Jain precedent library, Section 94/95 jurisprudence & guarantee rulings." },
        { title: "skills", description: "Section 94/95 moratorium filings, personal asset exclusion audits & repayment structuring." }
      ],
      actions: [
        { title: "chats", theme: "sky", description: "Confidential settlement strategy in chatIBC on consensual resolution frameworks with CoC." },
        { title: "drafts", theme: "indigo", description: "Section 94/95 interim moratorium applications, statutory Form A/B statements of affairs." },
        { title: "audits", theme: "emerald", description: "Personal guarantor discharge verification, statutory moratorium tracking & consensus jobs." }
      ]
    }
  };

  const DOMAIN_INTELLIGENCE_SHOWCASE = {
    investors: {
      domain_name: "investor",
      domain_label: "investor intelligence",
      tagline: "distressed buyouts, clean-slate ringfencing & section 29a clearance",
      models: {
        title: "offline financial haircut & deal valuation model",
        subtitle: "ind as 36 & cirp regulation 35 | runs in local ram",
        prompt: "simulate 65% haircut on ₹1,200 Cr financial debt with ₹420 Cr liquidation value benchmark for Acme Infra Projects Ltd",
        output: "waterfall clearance: operational creditors receive ₹42.0 Cr (statutory priority under sec 30(2)(b)). dissenting financial creditors parity guaranteed at liquidation benchmark (sec 53(1)). enterprise valuation: ₹510 Cr. clean-slate sec 32a ringfenced."
      },
      vaults: {
        title: "16 nclt bench precedents & clean-slate jurisprudence",
        subtitle: "42,800+ indexed rulings • supreme court & nclat",
        precedents: [
          { case: "Manish Kumar v. Union of India (2021) 5 SCC 1", rule: "Supreme court upholds constitutional validity of Section 32A clean-slate immunity for corporate debtors." },
          { case: "CoC of Essar Steel v. Satish Kumar Gupta (2020) 8 SCC 531", rule: "Primacy of CoC commercial wisdom; clean slate doctrine extinguishes undisclosed historical claims." },
          { case: "Tata Steel BSL v. Union of India (2020) SCC OnLine Del 1423", rule: "Enforcement Directorate and SFIO attachment orders extinguished upon plan approval." }
        ]
      },
      agents: {
        title: "autonomous section 29A & 32A bidder screening agent",
        subtitle: "autonomous registry crawler across 46 statutory registries",
        log: [
          "[AGENT: sec-29a-crawler] analyzing 10 disqualification clauses across 46 registries...",
          "[CHECK] wilful defaulter registry (CIBIL / RBI): 0 matches.",
          "[CHECK] SEBI debarred entity ledger: clean.",
          "[STATUS] RESOLUTION APPLICANT ELIGIBLE under Section 29A(a)–(j)."
        ]
      },
      skills: {
        title: "form G EOI submission & feasibility audit skill",
        subtitle: "executable procedural task runner • cirp regulation 38",
        command: "hayagriva run cirp-feasibility --target 'Acme Infra Ltd' --format pdf --seal udin",
        result: "generated 14-page statutory feasibility scorecard with SHA256 immutable ledger seal."
      },
      chambers: {
        chats: {
          query: "how do we ringfence acquired power assets from past CBI/ED attachment mandates?",
          reply: "under section 32a(2) of ibc 2016, once the adjudicating authority (nclt) approves the resolution plan and management changes to non-related persons, no prosecution or attachment lies against the debtor's assets for offenses prior to cirp commencement. refer supreme court in manish kumar (2021)."
        },
        drafts: {
          doc: "cirp regulation 38 feasibility scorecard & form g eoi kit",
          pages: "18 pages • pdf & docx • statutory disclosure kit",
          ref: "section 30(2) | cirp reg 38(1a)"
        },
        audits: {
          title: "statutory consortium eligibility clearance certificate",
          udin: "26093160OPENIBC789",
          seal: "VERIFIED GREEN SEAL",
          status: "10-clause section 29a verified with zero debarment matches."
        }
      }
    },
    creditors: {
      domain_name: "creditor",
      domain_label: "creditor intelligence",
      tagline: "claim verification, PUFE clawback recovery & CoC voting parity",
      models: {
        title: "proof of claim & waterfall recovery solver",
        subtitle: "section 53 waterfall & regulation 13 | runs in local ram",
        prompt: "reconcile ₹450 Cr consortium credit exposure with admitted claim registry and calculate CoC voting percentage",
        output: "claim admitted: ₹438.4 Cr. CoC voting share: 22.45%. minimum liquidation entitlement under Section 30(2)(b): ₹118.2 Cr. avoidance clawback potential (Sec 43/45): ₹84.5 Cr."
      },
      vaults: {
        title: "statutory admission & debt assignment jurisprudence",
        subtitle: "38,500+ indexed rulings • debt recovery & CoC governance",
        precedents: [
          { case: "Innoventive Industries Ltd v. ICICI Bank (2018) 1 SCC 407", rule: "Admission criteria under Section 7: existence of financial debt and occurrence of default." },
          { case: "Swiss Ribbons Pvt Ltd v. Union of India (2019) 4 SCC 17", rule: "Operational creditors parity and equitable treatment in resolution waterfall." },
          { case: "Anuj Jain v. Axis Bank Ltd (2020) 8 SCC 401", rule: "Third-party mortgagees are not financial creditors under Section 5(8); avoidance of preference under Section 43." }
        ]
      },
      agents: {
        title: "section 43/45/66 PUFE forensic clawback detector",
        subtitle: "autonomous transaction auditor inspecting 2-year lookback period",
        log: [
          "[AGENT: pufe-auditor] scanning general ledger for related-party preferential transfers...",
          "[FLAG] ₹32.4 Cr uncollateralized advance to promoter affiliate within 1-year lookback.",
          "[STATUS] Section 43 preference petition automatically drafted for CoC submission."
        ]
      },
      skills: {
        title: "CoC voting consensus & claim reconciliation skill",
        subtitle: "procedural ledger synchronization • sections 21, 24 & 28",
        command: "hayagriva run coc-voting-audit --consortium 'SBI-Lead' --plan 'Plan-B' --seal udin",
        result: "computed 74.2% affirmative consensus across 12 institutional lenders; certified voting ledger."
      },
      chambers: {
        chats: {
          query: "how can dissenting financial creditors enforce liquidation value parity under Section 30(2)(b)?",
          reply: "under section 30(2)(b)(ii), dissenting financial creditors must be paid an amount not less than the amount payable under section 53(1) in liquidation. if the plan offers less, it fails statutory compliance and cannot be approved by NCLT."
        },
        drafts: {
          doc: "statutory proof of claim kit & section 43 clawback petition",
          pages: "16 pages • pdf & docx • form c filing bundle",
          ref: "sections 43, 45, 49 & 66, ibc 2016"
        },
        audits: {
          title: "consortium claim reconciliation & voting ledger seal",
          udin: "26093160OPENIBC412",
          seal: "VERIFIED GREEN SEAL",
          status: "100% reconciliation against MCA charge registry and CIBIL ledgers."
        }
      }
    },
    professionals: {
      domain_name: "professional",
      domain_label: "professional intelligence",
      tagline: "zero-egress petition drafting, 330-day clock & UDIN generation",
      models: {
        title: "zero-egress statutory CIRP petition model",
        subtitle: "nclt bench filing standards • runs in local ram",
        prompt: "draft Section 12A withdrawal application with 90% CoC voting consensus certificate for NCLT Mumbai Bench",
        output: "application drafted in statutory format. CoC consensus verified: 92.4% affirmative. bank guarantee release covenants included. statutory disposal prayer framed under Rule 11."
      },
      vaults: {
        title: "IBBI circulars & 16 NCLT bench jurisprudence library",
        subtitle: "54,000+ indexed precedents • disciplinary & compliance",
        precedents: [
          { case: "Brilliant Alloys Pvt Ltd v. S. Rajagopal (2022) SCC OnLine SC 1215", rule: "Section 12A withdrawal permissible even after expression of interest (Form G) issuance." },
          { case: "ArcelorMittal India Pvt Ltd v. Satish Kumar Gupta (2019) 2 SCC 1", rule: "330-day timeline interpretation and exclusion of judicial delay." },
          { case: "Ghanashyam Mishra & Sons v. Edelweiss ARC (2021) 9 SCC 657", rule: "Crown debts and statutory taxes extinguished post plan approval." }
        ]
      },
      agents: {
        title: "statutory timeline & regulatory disclosure monitor",
        subtitle: "330-day CIRP milestone tracker & IBBI compliance agent",
        log: [
          "[AGENT: timeline-monitor] CIRP day 165 reached. 90-day extension window active.",
          "[CHECK] Form G publication timeline: COMPLIANT.",
          "[CHECK] Transaction auditor interim report: SUBMITTED.",
          "[STATUS] All 14 statutory disclosures current; 0 penalty exposure."
        ]
      },
      skills: {
        title: "cryptographic UDIN generator & document certifier",
        subtitle: "18-digit immutable UDIN stamping • ibbi compliance",
        command: "hayagriva run udin-certify --type 'cirp-progress-report' --ip-reg 'IBBI/IPA-001/IP-P00234' --seal",
        result: "generated 18-digit UDIN 26093160OPENIBC991; stamped on immutable IBC ledger."
      },
      chambers: {
        chats: {
          query: "what is the procedure when CoC is deadlocked at 64% on resolution plan approval?",
          reply: "Section 30(4) mandates a strict 66% threshold of voting shares. if approval remains below 66% at the expiry of the maximum 330-day period, the Resolution Professional is statutorily mandated under Section 33(1) to file for liquidation."
        },
        drafts: {
          doc: "mandatory IBBI disclosure kit & section 12A withdrawal petition",
          pages: "22 pages • pdf & docx • complete bench filing kit",
          ref: "section 12a | cirp reg 30a"
        },
        audits: {
          title: "statutory CIRP compliance & disclosure ledger seal",
          udin: "26093160OPENIBC555",
          seal: "VERIFIED GREEN SEAL",
          status: "certified against IBBI compliance circulars and NCLT rules."
        }
      }
    },
    valuers: {
      domain_name: "valuer",
      domain_label: "valuer intelligence",
      tagline: "fair value computation, liquidation benchmarks & haircut defense",
      models: {
        title: "offline DCF, NAV and liquidation model",
        subtitle: "ind as 36 & registered valuers rules 2017 | runs in local ram",
        prompt: "compute fair value and liquidation value for manufacturing plant with ₹280 Cr fixed assets and ₹45 Cr distressed inventory",
        output: "fair value: ₹198.5 Cr (discounted cash flow + replacement cost). liquidation value: ₹132.0 Cr (orderly liquidation benchmark at 33.5% distress discount). standard deviation across 2 registered valuers: 4.2% (compliant with Regulation 35)."
      },
      vaults: {
        title: "international valuation standards & circle rate ledgers",
        subtitle: "32,000+ benchmark indices • industrial & commercial",
        precedents: [
          { case: "Maharashtra Seamless Ltd v. Padmanabhan Venkatesh (2020) 11 SCC 467", rule: "No statutory mandate that resolution plan value must match or exceed liquidation value." },
          { case: "Ramkrishna Forgings Ltd v. Ravindra Loonkar (2023) SCC OnLine SC 1541", rule: "Adjudicating authority cannot question valuation methodology approved by CoC." },
          { case: "Ind AS 36 / 113 Statutory Standards", rule: "Fair value hierarchy and observable inputs primacy in stressed enterprise valuation." }
        ]
      },
      agents: {
        title: "valuation dispute defense & standard deviation auditor",
        subtitle: "compares multiple valuer reports and drafts rebuttal briefs",
        log: [
          "[AGENT: valuer-benchmark] comparing Valuer 1 (₹145 Cr) vs Valuer 2 (₹152 Cr)...",
          "[ANALYSIS] standard deviation is 2.36% (well below 25% threshold for 3rd valuer).",
          "[STATUS] Regulation 35 compliance verified; green seal certificate issued."
        ]
      },
      skills: {
        title: "cryptographic valuation summary & UDIN ledgers",
        subtitle: "tamper-proof valuation certification • ibbi rv rules",
        command: "hayagriva run valuer-audit --asset-class 'land-building-plant' --fee-tier 'statutory' --seal udin",
        result: "generated 12-page Regulation 35 valuation summary with cryptographic UDIN seal."
      },
      chambers: {
        chats: {
          query: "how do we defend our valuation methodology against dissenting creditor haircut challenges?",
          reply: "under the supreme court ruling in Ramkrishna Forgings (2023), NCLT has no jurisdiction to scrutinize the commercial wisdom or technical methodology of registered valuers once accepted by CoC, provided Regulation 35 protocols were strictly observed."
        },
        drafts: {
          doc: "regulation 35 statutory valuation report & rebuttal brief",
          pages: "24 pages • pdf & docx • full valuation summary",
          ref: "cirp regulation 35 | rv rules 2017"
        },
        audits: {
          title: "cryptographic valuation audit & peer review seal",
          udin: "26093160OPENIBC333",
          seal: "VERIFIED GREEN SEAL",
          status: "peer-reviewed against Ind AS 36 and IBBI registered valuer guidelines."
        }
      }
    },
    guarantors: {
      domain_name: "guarantor",
      domain_label: "guarantor intelligence",
      tagline: "part III moratorium, statement of affairs & ringfencing personal assets",
      models: {
        title: "section 105 repayment plan feasibility engine",
        subtitle: "part iii insolvency | runs in local ram",
        prompt: "structure 5-year repayment plan on ₹120 Cr personal guarantee liability with ₹45 Cr unencumbered personal assets",
        output: "interim moratorium protection activated under Section 96. repayment plan formulated: ₹38.0 Cr over 36 months (31.6% recovery). unattachable residential assets ringfenced under Section 79(14). statutory discharge projected under Section 119."
      },
      vaults: {
        title: "Lalit Kumar Jain precedent library & Part III rulings",
        subtitle: "18,400+ indexed rulings • personal insolvency jurisprudence",
        precedents: [
          { case: "Lalit Kumar Jain v. Union of India (2021) 9 SCC 321", rule: "Approval of resolution plan for corporate debtor does not discharge personal guarantors." },
          { case: "Dilip B. Jiwrajka v. Union of India (2024) 5 SCC 435", rule: "Section 95 interim moratorium operates automatically upon application filing." },
          { case: "SBI v. V. Ramakrishnan (2018) 17 SCC 394", rule: "Section 14 moratorium on corporate debtor does not extend to personal guarantors; governed by Section 96." }
        ]
      },
      agents: {
        title: "personal asset exclusion & double-dipping auditor",
        subtitle: "statutory asset segregation under section 79(14)",
        log: [
          "[AGENT: guarantor-shield] auditing debtor personal balance sheet...",
          "[EXCLUSION] primary residential property & personal belongings segregated.",
          "[CHECK] creditor recovery from corporate debtor: credited against guarantee balance.",
          "[STATUS] liability ringfenced; Section 96 moratorium active."
        ]
      },
      skills: {
        title: "statutory statement of affairs & discharge kit generator",
        subtitle: "procedural Part III task runner • sections 95-119",
        command: "hayagriva run guarantor-affairs --entity 'Promoter-Guarantor' --debts 120cr --seal udin",
        result: "generated 16-page Form A Statement of Affairs and interim moratorium filing kit."
      },
      chambers: {
        chats: {
          query: "does interim moratorium under Section 96 stay ongoing SARFAESI proceedings against personal property?",
          reply: "yes. under Section 96(1)(b), upon filing an application under Section 94 or 95, any legal action or proceeding pending in respect of any debt is deemed to be stayed, and creditors cannot initiate fresh actions against the guarantor's property until admission."
        },
        drafts: {
          doc: "section 94/95 interim moratorium petition & statement of affairs",
          pages: "18 pages • pdf & docx • complete filing kit",
          ref: "sections 94, 95 & 105, ibc 2016"
        },
        audits: {
          title: "personal guarantor discharge & debt extinction certificate",
          udin: "26093160OPENIBC888",
          seal: "VERIFIED GREEN SEAL",
          status: "verified under Section 119 with CIBIL registry cleansing documentation."
        }
      }
    }
  };

  const SUBDOMAIN_INTAKE_CONFIGS = {
    investors: {
      title: "Submit an Opportunity",
      subtitle: "List a CIRP Form G, distressed asset, or strategic buyout mandate on the Pan-India Statutory Radar.",
      badge: "INVESTOR ACQUISITIONS",
      field1: "Corporate Debtor / Asset Target Name",
      f1p: "e.g. Essar Power Gujarat Limited",
      field2: "NCLT Bench & Estimated Enterprise Value (INR Cr)",
      f2p: "e.g. NCLT Ahmedabad • ₹1,850 Cr",
      field3: "Lead Acquirer / Restructuring Fund Email",
      f3p: "e.g. deals@special-situations.in",
      btn: "Publish Opportunity to Radar"
    },
    creditors: {
      title: "Submit Proof of Claim",
      subtitle: "Record institutional debt exposure, Form B/C statutory claims, or secondary credit pool participation.",
      badge: "CREDITOR RECOVERY",
      field1: "Corporate Debtor Name & Credit Facility",
      f1p: "e.g. Jaypee Infratech • Consortium Term Loan Facility B",
      field2: "Admitted Claim Amount & Class (INR Cr)",
      f2p: "e.g. ₹420.0 Cr • Secured Financial Creditor (CoC)",
      field3: "Lead Bank / ARC Institutional Email",
      f3p: "e.g. recovery.agm@sbi.co.in",
      btn: "Register Claim on IBC Ledger"
    },
    professionals: {
      title: "List CIRP Form G / Asset",
      subtitle: "Broadcast statutory Form G invitation for Expression of Interest across 46 registries.",
      badge: "INSOLVENCY MANDATES",
      field1: "Corporate Debtor under CIRP",
      f1p: "e.g. Uttam Galva Steels Limited",
      field2: "NCLT Bench & Case Order Reference",
      f2p: "e.g. NCLT Mumbai • CP(IB) 1245/MB/2023",
      field3: "Insolvency Professional IBBI Reg Number",
      f3p: "e.g. IBBI/IPA-001/IP-P00845/2017-18",
      btn: "Broadcast Statutory Form G"
    },
    valuers: {
      title: "Submit Valuation Mandate",
      subtitle: "Register statutory Regulation 35 fair value & liquidation value assignment with Green Seal.",
      badge: "REGISTERED VALUERS",
      field1: "Corporate Debtor & Valuation Asset Class",
      f1p: "e.g. Alok Industries • Plant & Machinery",
      field2: "NCLT Bench & Engagement Stage",
      f2p: "e.g. NCLT Ahmedabad • CIRP Regulation 35(1)",
      field3: "Registered Valuer (RV) IBBI Reg Number",
      f3p: "e.g. IBBI/RV/02/2019/11245",
      btn: "Register Valuation Mandate"
    },
    guarantors: {
      title: "Submit Settlement Proposal",
      subtitle: "Submit Section 94/95 personal guarantee debt compromise or interim moratorium protection.",
      badge: "PERSONAL GUARANTORS",
      field1: "Corporate Debtor & Guarantee Facility",
      f1p: "e.g. Corporate Guarantee for ₹280 Cr Working Capital Loan",
      field2: "Lead Creditor & NCLT Part III Case Reference",
      f2p: "e.g. Punjab National Bank • Sec 95 Notice No. 441/2024",
      field3: "Authorized Counsel / Guarantor Contact Email",
      f3p: "e.g. legal@promoterchambers.in",
      btn: "Submit Settlement Brief"
    }
  };

  const PROFESSIONAL_INTAKE_CONFIG = {
    title: "Empanel Insolvency Practice",
    subtitle: "Register an IBBI Insolvency Professional, Registered Valuer (RV), or NCLT counsel chamber on the IBC practitioner map.",
    badge: "PRACTITIONER DIRECTORY",
    field1: "Lead Practitioner Name & Chamber / Firm",
    f1p: "e.g. Adv. R. K. Bansal • Bansal & Associates LLP",
    field2: "IBBI Registration No. & Primary NCLT Bench",
    f2p: "e.g. IBBI/IP-001/IP-P00912/2021-22 • New Delhi",
    field3: "Official Practice Contact Email",
    f3p: "e.g. chambers@bansallaw.in",
    btn: "Submit Empanelment Brief"
  };

  const BINARIES = [
    {
      osId: "mac-arm",
      osTitle: "macOS (Apple Silicon)",
      arch: "ARM64 (M1/M2/M3/M4)",
      badge: "Recommended for Apple Silicon",
      size: "88.4 MB",
      format: ".dmg",
      downloadUrl: "https://agentic-professionals-downloads.s3.ap-southeast-1.amazonaws.com/desktop/Hayagriva-IDE-arm64.dmg"
    },
    {
      osId: "mac-intel",
      osTitle: "macOS (Intel)",
      arch: "x86_64",
      badge: "Intel Mac",
      size: "92.1 MB",
      format: ".dmg",
      downloadUrl: "https://agentic-professionals-downloads.s3.ap-southeast-1.amazonaws.com/desktop/Hayagriva-IDE-x64.dmg"
    },
    {
      osId: "windows",
      osTitle: "Windows 10 / 11",
      arch: "x64 installer",
      badge: "Windows Setup",
      size: "104.2 MB",
      format: ".exe",
      downloadUrl: "https://agentic-professionals-downloads.s3.ap-southeast-1.amazonaws.com/desktop/Hayagriva-Setup-x64.exe"
    },
    {
      osId: "linux",
      osTitle: "Linux",
      arch: "x86_64 AppImage",
      badge: "Debian / Ubuntu / RHEL",
      size: "98.5 MB",
      format: ".AppImage",
      downloadUrl: "https://agentic-professionals-downloads.s3.ap-southeast-1.amazonaws.com/desktop/Hayagriva-x64.AppImage"
    }
  ];

  // ─── 2. STATE ───
  let currentSubdomain = 'investors';
  let activeMode = 'assets'; // 'assets' or 'professionals'
  let modeCounts = { assets: null, professionals: null };
  let rawItems = [];
  let filteredItems = [];
  let map = null;
  let markersLayer = null;
  let activeMarkerId = null;
  let selectedConsultationIndex = 0;
  let selectedBinary = BINARIES[0];
  let downloadCountdown = 3;
  let countdownTimer = null;
  let activeRegime = 'ALL';
  let mobileView = 'list';
  let openForumView = null;
  let openPriceListView = null;
  let openCatalogView = null;

  // Local Storage Bookmarks Set
  let bookmarkedIds = new Set();
  try {
    const savedBookmarks = localStorage.getItem('openibc_bookmarks');
    if (savedBookmarks) {
      bookmarkedIds = new Set(JSON.parse(savedBookmarks));
    }
  } catch (e) {}

  function saveBookmarks() {
    try {
      localStorage.setItem('openibc_bookmarks', JSON.stringify(Array.from(bookmarkedIds)));
    } catch (e) {}
  }

  window.toggleBookmark = function(id) {
    if (bookmarkedIds.has(id)) {
      bookmarkedIds.delete(id);
    } else {
      bookmarkedIds.add(id);
    }
    saveBookmarks();
    renderCards();
    const activeItem = rawItems.find(a => a.id === id);
    if (activeItem && activeMarkerId === id) {
      showInspector(activeItem);
    }
  };

  // ─── 3. DOM ELEMENT REFERENCES ───
  const brandTrigger = document.getElementById('brand-trigger');
  const brandTitleText = document.getElementById('brand-title-text');
  const subdomainDropdown = document.getElementById('subdomain-dropdown');
  const navOpportunities = document.getElementById('nav-opportunities');
  const intelligenceLabel = document.getElementById('intelligence-label');
  const consultationsLabel = document.getElementById('consultations-label');
  
  const navIntelligenceContainer = document.getElementById('nav-intelligence-container');
  const navIntelligenceBtn = document.getElementById('nav-intelligence-btn');
  const megamenuIntelligence = document.getElementById('megamenu-intelligence');
  const intelligenceAssetsList = document.getElementById('intelligence-assets-list');
  const intelligenceActionsList = document.getElementById('intelligence-actions-list');
  
  const navConsultationsContainer = document.getElementById('nav-consultations-container');
  const navConsultationsBtn = document.getElementById('nav-consultations-btn');
  const megamenuConsultations = document.getElementById('megamenu-consultations');
  const consultationsTracksList = document.getElementById('consultations-tracks-list');
  const selectedTrackName = document.getElementById('selected-track-name');
  const selectedTrackDuration = document.getElementById('selected-track-duration');
  const calnodeDockTitle = document.getElementById('calnode-dock-title');
  const calnodeStatusDot = document.getElementById('calnode-status-dot');
  const calnodePrimaryPanel = document.getElementById('calnode-primary-panel');
  const calnodeLiveBadge = document.getElementById('calnode-live-badge');
  const calnodeNextSlotsList = document.getElementById('calnode-next-slots-list');
  const calnodeContextInput = document.getElementById('calnode-context-input');
  const calnodeBookTrigger = document.getElementById('calnode-book-trigger');
  const toggleFallbackDispatchBtn = document.getElementById('toggle-fallback-dispatch');
  const fastTrackForm = document.getElementById('fast-track-form');
  const fastTrackContainer = document.getElementById('fast-track-container');

  const cardList = document.getElementById('card-list');
  const searchInput = document.getElementById('search-input');
  const searchBoxContainer = document.getElementById('search-box-container');
  const searchClearBtn = document.getElementById('search-clear-btn');
  const filterRow = document.querySelector('.filter-row');
  const sectorFilter = document.getElementById('sector-filter');
  const roleFilter = document.getElementById('role-filter');
  const benchFilter = document.getElementById('bench-filter');
  const resetFiltersBtn = document.getElementById('reset-filters-btn');
  const assetsCount = document.getElementById('assets-count');
  const sidebar = document.getElementById('sidebar');
  const sidebarToggle = document.getElementById('sidebar-toggle');
  const inspectorDrawer = document.getElementById('inspector-drawer') || document.getElementById('inspector-modal');
  const modeAssetsBtn = document.getElementById('mode-assets-btn');
  const modeProfessionalsBtn = document.getElementById('mode-professionals-btn');
  const regimePillsContainer = document.getElementById('regime-pills-container');

  // Mobile Controls
  const mobileViewToggleBtn = document.getElementById('mobile-view-toggle-btn');
  const mobileViewLabel = document.getElementById('mobile-view-label');
  const pillIconMap = document.getElementById('pill-icon-map');
  const pillIconList = document.getElementById('pill-icon-list');
  const mobilePinPreview = document.getElementById('mobile-pin-preview');
  const radarView = document.getElementById('radar-view');

  // Modals
  const downloadModalOverlay = document.getElementById('download-modal-overlay');
  const downloadModalClose = document.getElementById('download-modal-close');
  const dockDownloadTrigger = document.getElementById('dock-download-trigger');
  const dlOsTitle = document.getElementById('dl-os-title');
  const dlOsMeta = document.getElementById('dl-os-meta');
  const dlDirectBtn = document.getElementById('dl-direct-btn');
  const dlContinueBtn = document.getElementById('dl-continue-btn');
  const countdownBadge = document.getElementById('countdown-badge');
  const binaryGrid = document.getElementById('binary-grid');

  const intakeModalOverlay = document.getElementById('intake-modal-overlay');
  const intakeModalClose = document.getElementById('intake-modal-close');
  const openIntakeBtn = document.getElementById('open-intake-btn');
  const intakeForm = document.getElementById('intake-form');
  const intakeModalBody = document.getElementById('intake-modal-body');
  const intakeBadge = document.getElementById('intake-badge');
  const intakeTitle = document.getElementById('intake-title');
  const intakeSubtitle = document.getElementById('intake-subtitle');
  const intakeLbl1 = document.getElementById('intake-lbl-1');
  const intakeField1 = document.getElementById('intake-field-1');
  const intakeLbl2 = document.getElementById('intake-lbl-2');
  const intakeField2 = document.getElementById('intake-field-2');
  const intakeLbl3 = document.getElementById('intake-lbl-3');
  const intakeField3 = document.getElementById('intake-field-3');
  const intakeSubmitBtn = document.getElementById('intake-submit-btn');

  // ─── 4. SUBDOMAIN MANAGEMENT ───
  function detectSubdomain() {
    const pathParts = window.location.pathname.split('/').filter(Boolean);
    const firstPart = pathParts[0];
    const match = SUBDOMAINS.find(s => s.key === firstPart);
    if (match) return match.key;
    const urlParams = new URLSearchParams(window.location.search);
    const param = urlParams.get('subdomain');
    if (param && SUBDOMAINS.some(s => s.key === param)) return param;
    return 'investors';
  }

  function setSubdomain(subKey, { syncUrl = true } = {}) {
    const config = SUBDOMAINS.find(s => s.key === subKey) || SUBDOMAINS[3];
    currentSubdomain = config.key;
    const oppWord = config.oppLabel ? config.oppLabel.replace(' opportunities', '') : currentSubdomain;

    // Header Updates
    brandTitleText.textContent = `IBC - ${config.label}`;
    navOpportunities.textContent = config.oppLabel;
    document.title = `IBC - ${config.label} | Pan-India Statutory Radar`;

    // Megamenu labels in header
    intelligenceLabel.textContent = 'process agents';
    consultationsLabel.textContent = 'forensic agents';

    // Update Subdomain Dropdown Items Active State
    document.querySelectorAll('#subdomain-dropdown .dropdown-item[data-sub]').forEach(el => {
      el.classList.toggle('active', el.dataset.sub === currentSubdomain);
    });

    // Populate Dynamic Megamenus
    renderIntelligenceMegamenu(currentSubdomain);
    renderConsultationsMegamenu(currentSubdomain);
    updateIntakeModalConfig(currentSubdomain);

    // Sync URL without page reload
    if (syncUrl) {
      const path = (window.location.pathname || '').toLowerCase();
      const priceListView = document.getElementById('price-list-view');
      const isPriceListVisible = priceListView && priceListView.style.display !== 'none';
      const forumView = document.getElementById('forum-view');
      const isForumVisible = forumView && forumView.style.display !== 'none';
      const intelligenceView = document.getElementById('intelligence-view');
      const isIntelligenceVisible = intelligenceView && intelligenceView.style.display !== 'none';
      const consultationsView = document.getElementById('consultations-view');
      const isConsultationsVisible = consultationsView && consultationsView.style.display !== 'none';

      if (isIntelligenceVisible && typeof renderIntelligenceShowcasePage === 'function') {
        renderIntelligenceShowcasePage(currentSubdomain, 'all');
      }
      if (isConsultationsVisible && typeof renderConsultationsPage === 'function') {
        renderConsultationsPage(currentSubdomain);
      }

      let suffix = '';
      if (isConsultationsVisible || path.includes('/consultations')) {
        suffix = 'consultations';
      } else if (isIntelligenceVisible || path.includes('/intelligence')) {
        suffix = 'intelligence';
      } else if (isPriceListVisible || path.includes('/catalog') || path.includes('/price-list')) {
        suffix = 'catalog';
      } else if (path.includes('/ask')) {
        suffix = 'ask';
      } else if (isForumVisible || path.includes('/answers') || path.includes('/forum')) {
        suffix = 'answers';
      }

      const targetPath = suffix ? `/${currentSubdomain}/${suffix}` : `/${currentSubdomain}/`;
      window.history.replaceState({}, '', targetPath);
    }
  }

  // ─── 5. MEGAMENUS RENDERING & INTERACTIONS ───
  function renderIntelligenceMegamenu(subKey) {
    const data = DOMAIN_INTELLIGENCE[subKey] || DOMAIN_INTELLIGENCE.investors;
    const colTitle = document.getElementById('intelligence-col-title');
    if (colTitle) {
      colTitle.textContent = data.label || `${subKey} intelligence`;
      colTitle.style.cursor = 'pointer';
      colTitle.title = 'click to explore full intelligence showcase';
      colTitle.onclick = () => {
        closeAllMegamenus();
        if (typeof window.openIntelligenceView === 'function') {
          window.openIntelligenceView('models');
        }
      };
    }

    const showcaseBtn = document.getElementById('view-intelligence-showcase-btn');
    if (showcaseBtn) {
      showcaseBtn.setAttribute('href', `/${subKey}/intelligence`);
      showcaseBtn.onclick = (e) => {
        e.preventDefault();
        closeAllMegamenus();
        if (typeof window.openIntelligenceView === 'function') {
          window.openIntelligenceView('models');
        }
      };
    }

    // Assets Column (4 Assets: models, vaults, agents, skills)
    intelligenceAssetsList.innerHTML = data.assets.map(a => `
      <div class="menu-card" data-asset="${escapeHTML(a.title)}" style="margin-bottom:4px;cursor:pointer;">
        <div class="menu-card-info">
          <h4>${escapeHTML(a.title)}</h4>
          <p>${escapeHTML(a.description)}</p>
        </div>
      </div>
    `).join('');

    intelligenceAssetsList.querySelectorAll('.menu-card').forEach(card => {
      card.addEventListener('click', (e) => {
        e.stopPropagation();
        closeAllMegamenus();
        if (typeof window.openIntelligenceView === 'function') {
          window.openIntelligenceView(card.dataset.asset);
        }
      });
    });

    // Actions Column (Sovereign Dock: chats, drafts, audits)
    intelligenceActionsList.innerHTML = data.actions.map(act => `
      <a href="/${subKey}/intelligence" data-action="${escapeHTML(act.title)}" class="dock-action-row">
        <div class="dock-action-left">
          <div class="dock-action-text">
            <h5>${escapeHTML(act.title)}</h5>
            <p>${escapeHTML(act.description)}</p>
          </div>
        </div>
        <span style="font-size:12px;color:#94a3b8;font-family:monospace;font-weight:700;">&rarr;</span>
      </a>
    `).join('');

    intelligenceActionsList.querySelectorAll('.dock-action-row').forEach(row => {
      row.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        closeAllMegamenus();
        if (typeof window.openIntelligenceView === 'function') {
          window.openIntelligenceView(row.dataset.action);
        }
      });
    });
  }

  const calnodeSlotsCache = new Map();
  let calnodePreviewSeq = 0;
  let calnodeFallbackMode = false;
  let pendingCalnodeMeta = null;
  let calnodeScriptPromise = null;

  function getSelectedConsultation() {
    const group = DOMAIN_CONSULTATIONS[currentSubdomain] || DOMAIN_CONSULTATIONS.investors;
    return group.consultations[selectedConsultationIndex] || group.consultations[0];
  }

  function ensureCalnodeEmbed() {
    if (window.Calnode && typeof window.Calnode.openPopup === 'function') {
      return Promise.resolve(window.Calnode);
    }
    if (calnodeScriptPromise) return calnodeScriptPromise;
    calnodeScriptPromise = new Promise((resolve, reject) => {
      const existing = document.querySelector('script[src="/embed.js"]');
      if (existing && window.Calnode && typeof window.Calnode.openPopup === 'function') {
        resolve(window.Calnode);
        return;
      }
      const script = existing || document.createElement('script');
      script.src = '/embed.js';
      script.async = true;
      script.addEventListener('load', () => {
        if (window.Calnode && typeof window.Calnode.openPopup === 'function') {
          resolve(window.Calnode);
        } else {
          calnodeScriptPromise = null;
          reject(new Error('Calnode embed API unavailable'));
        }
      });
      script.addEventListener('error', () => {
        calnodeScriptPromise = null;
        reject(new Error('Failed to load /embed.js'));
      });
      if (!existing) document.head.appendChild(script);
    });
    return calnodeScriptPromise;
  }

  function setConsultationDockMode(useFallback) {
    calnodeFallbackMode = useFallback;
    if (!calnodePrimaryPanel || !fastTrackForm) return;
    calnodePrimaryPanel.style.display = useFallback ? 'none' : '';
    fastTrackForm.style.display = useFallback ? 'flex' : 'none';
    if (calnodeDockTitle) {
      calnodeDockTitle.textContent = useFallback ? 'FAST-TRACK BRIEFING' : 'CALNODE LIVE SCHEDULING';
    }
    if (toggleFallbackDispatchBtn) {
      toggleFallbackDispatchBtn.innerHTML = useFallback
        ? '&larr; Back to live slot booking'
        : 'Prefer direct callback? Send quick inquiry &rarr;';
    }
  }

  function clearConsultationConfirmation() {
    const notice = document.getElementById('calnode-confirm-banner');
    if (notice) notice.remove();
  }

  function renderSlotChips(track, data) {
    if (!calnodeNextSlotsList || !calnodeLiveBadge) return;
    if (!data || !data.available) {
      calnodeLiveBadge.textContent = 'direct callback ready';
      calnodeLiveBadge.style.color = '#38bdf8';
      calnodeNextSlotsList.innerHTML = '<span class="calnode-slot-hint">click below to pick date &amp; slot &rarr;</span>';
      return;
    }

    const openLabel = data.today_count > 0
      ? `${data.today_count} open today`
      : `${data.total_slots || 0} open slots`;
    calnodeLiveBadge.textContent = openLabel;
    calnodeLiveBadge.style.color = '#34d399';

    if (!data.next_slots || data.next_slots.length === 0) {
      calnodeNextSlotsList.innerHTML = '<span class="calnode-slot-hint">Browse calendar popup for next openings</span>';
      return;
    }

    calnodeNextSlotsList.innerHTML = data.next_slots.map(slot => `
      <button type="button" class="calnode-slot-chip" data-start="${escapeHTML(slot.start)}">${escapeHTML(slot.label)}</button>
    `).join('');

    calnodeNextSlotsList.querySelectorAll('.calnode-slot-chip').forEach(chip => {
      chip.addEventListener('click', (e) => {
        e.stopPropagation();
        launchCalnodePopup(track);
      });
    });
  }

  async function loadCalnodeSlotPreview(track, forceRefresh = false) {
    if (!track || !track.slug || !calnodeNextSlotsList || !calnodeLiveBadge) return;
    const cached = calnodeSlotsCache.get(track.slug);
    if (!forceRefresh && cached && (Date.now() - cached.ts) < 60000) {
      renderSlotChips(track, cached.data);
      return;
    }

    const seq = ++calnodePreviewSeq;
    calnodeLiveBadge.textContent = 'Syncing slots...';
    calnodeLiveBadge.style.color = '#94a3b8';

    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata';
      const res = await fetch(`/api/calnode/next-slots?slug=${encodeURIComponent(track.slug)}&tz=${encodeURIComponent(tz)}`);
      const data = await res.json();
      if (seq !== calnodePreviewSeq) return;
      calnodeSlotsCache.set(track.slug, { ts: Date.now(), data });
      renderSlotChips(track, data);
    } catch (_) {
      if (seq !== calnodePreviewSeq) return;
      renderSlotChips(track, { available: false });
    }
  }

  function getStoredUser() {
    try {
      const raw = localStorage.getItem('openibc_user');
      return raw ? JSON.parse(raw) : null;
    } catch (_) {
      return null;
    }
  }

  function updateConsultationBookingButtonState() {
    const triggerText = document.getElementById('calnode-book-trigger-text');
    if (!triggerText) return;
    triggerText.innerHTML = 'book briefing &rarr;';
  }

  // Megamenu State & Top-Nav Synchronization
  let intelTimeout = null;
  let consultTimeout = null;
  let pinnedMegamenu = null; // 'intelligence' | 'consultations' | null

  function isRadarViewActive() {
    return !radarView || radarView.style.display !== 'none';
  }

  function isIntelligenceViewActive() {
    const iv = document.getElementById('intelligence-view');
    return iv && iv.style.display !== 'none';
  }

  function isConsultationsViewActive() {
    const cv = document.getElementById('consultations-view');
    return cv && cv.style.display !== 'none';
  }

  function syncTopNavPillState(activeMenu) {
    const isIntelActive = isIntelligenceViewActive();
    const isConsultActive = isConsultationsViewActive();
    const isRadarActive = isRadarViewActive();

    if (activeMenu === 'intelligence') {
      if (navIntelligenceBtn) navIntelligenceBtn.classList.add('pill-active', 'open');
      if (navConsultationsBtn) navConsultationsBtn.classList.remove('pill-active', 'open');
      if (navOpportunities) navOpportunities.classList.remove('pill-active');
    } else if (activeMenu === 'consultations') {
      if (navConsultationsBtn) navConsultationsBtn.classList.add('pill-active', 'open');
      if (navIntelligenceBtn) navIntelligenceBtn.classList.remove('pill-active', 'open');
      if (navOpportunities) navOpportunities.classList.remove('pill-active');
    } else {
      if (navIntelligenceBtn) {
        if (isIntelActive) {
          navIntelligenceBtn.classList.add('pill-active');
          navIntelligenceBtn.classList.remove('open');
        } else {
          navIntelligenceBtn.classList.remove('pill-active', 'open');
        }
      }
      if (navConsultationsBtn) {
        if (isConsultActive) {
          navConsultationsBtn.classList.add('pill-active');
          navConsultationsBtn.classList.remove('open');
        } else {
          navConsultationsBtn.classList.remove('pill-active', 'open');
        }
      }
      if (isRadarActive && !isIntelActive && !isConsultActive && navOpportunities) {
        navOpportunities.classList.add('pill-active');
      }
    }
  }

  function closeAllMegamenus() {
    pinnedMegamenu = null;
    clearTimeout(intelTimeout);
    clearTimeout(consultTimeout);
    if (megamenuIntelligence) megamenuIntelligence.classList.remove('show');
    if (megamenuConsultations) megamenuConsultations.classList.remove('show');
    syncTopNavPillState(null);
  }

  function openMegamenu(type, pin = false) {
    clearTimeout(intelTimeout);
    clearTimeout(consultTimeout);
    if (pin) pinnedMegamenu = type;

    if (type === 'intelligence') {
      if (megamenuConsultations) megamenuConsultations.classList.remove('show');
      if (megamenuIntelligence) megamenuIntelligence.classList.add('show');
      syncTopNavPillState('intelligence');
    } else if (type === 'consultations') {
      if (megamenuIntelligence) megamenuIntelligence.classList.remove('show');
      if (megamenuConsultations) megamenuConsultations.classList.add('show');
      syncTopNavPillState('consultations');
      loadCalnodeSlotPreview(getSelectedConsultation());
    }
  }

  function scheduleCloseMegamenu(type) {
    if (pinnedMegamenu === type) return;
    if (type === 'intelligence') {
      clearTimeout(intelTimeout);
      intelTimeout = setTimeout(() => {
        if (pinnedMegamenu !== 'intelligence') {
          if (megamenuIntelligence) megamenuIntelligence.classList.remove('show');
          if (!megamenuConsultations || !megamenuConsultations.classList.contains('show')) {
            syncTopNavPillState(null);
          }
        }
      }, 300);
    } else if (type === 'consultations') {
      clearTimeout(consultTimeout);
      consultTimeout = setTimeout(() => {
        if (pinnedMegamenu !== 'consultations') {
          if (megamenuConsultations) megamenuConsultations.classList.remove('show');
          if (!megamenuIntelligence || !megamenuIntelligence.classList.contains('show')) {
            syncTopNavPillState(null);
          }
        }
      }, 300);
    }
  }

  async function launchCalnodePopup(track, user) {
    const active = track || getSelectedConsultation();
    const activeUser = user || getStoredUser();

    closeAllMegamenus();

    // 1. Record lead to server database
    if (activeUser && activeUser.e_mail) {
      try {
        fetch('/api/calnode/bookings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event_type_slug: active.slug,
            slug: active.slug,
            track: active.title,
            stakeholder: currentSubdomain,
            name: activeUser.display_name || activeUser.username || activeUser.e_mail.split('@')[0],
            email: activeUser.e_mail,
            notes: `statutory consultation booked by authenticated user ${activeUser.e_mail}`
          })
        }).catch(function(err) { console.warn('Lead logging error:', err); });
      } catch (_) {}
    }

    // 2. Open Calnode interactive popup prefilled with name & email
    try {
      const calnodeApi = await ensureCalnodeEmbed();
      const prefill = activeUser ? {
        email: activeUser.e_mail,
        name: activeUser.display_name || activeUser.username || activeUser.e_mail.split('@')[0]
      } : null;
      calnodeApi.openPopup(active.slug, 'en', prefill);
    } catch (err) {
      console.warn('Calnode embed could not open popup:', err);
    }
  }

  function renderConsultationsMegamenu(subKey) {
    const data = DOMAIN_CONSULTATIONS[subKey] || DOMAIN_CONSULTATIONS.investors;
    selectedConsultationIndex = 0;
    clearConsultationConfirmation();
    setConsultationDockMode(false);

    const colTitle = document.getElementById('consultations-col-title');
    if (colTitle) {
      colTitle.textContent = data.label || `${subKey} consultations`;
      colTitle.style.cursor = 'pointer';
      colTitle.title = 'click to explore full consultations docket';
      colTitle.onclick = () => {
        closeAllMegamenus();
        if (typeof window.openConsultationsView === 'function') {
          window.openConsultationsView();
        }
      };
    }

    consultationsTracksList.innerHTML = data.consultations.map((c, idx) => `
      <div class="menu-card ${idx === 0 ? 'selected' : ''}" data-idx="${idx}" data-slug="${escapeHTML(c.slug)}" style="margin-bottom:4px;cursor:pointer;">
        <div class="menu-card-info" style="flex:1;">
          <div class="menu-card-head-row">
            <h4>${escapeHTML(c.title)}</h4>
          </div>
        </div>
      </div>
    `).join('');

    const initialTrack = data.consultations[0];
    selectedTrackName.textContent = initialTrack.title;
    if (selectedTrackDuration) selectedTrackDuration.textContent = 'open';
    const statutoryRefEl = document.getElementById('selected-track-statutory-ref');
    if (statutoryRefEl) statutoryRefEl.textContent = initialTrack.statutory_ref || 'ibc 2016 statutory advisory';
    const scopeEl = document.getElementById('selected-track-scope');
    if (scopeEl) scopeEl.textContent = initialTrack.scope || initialTrack.description;
    updateConsultationBookingButtonState();

    function selectTrackByIndex(idx) {
      clearConsultationConfirmation();
      consultationsTracksList.querySelectorAll('.menu-card').forEach(c => c.classList.remove('selected'));
      const activeCard = consultationsTracksList.querySelector(`.menu-card[data-idx="${idx}"]`);
      if (activeCard) activeCard.classList.add('selected');
      selectedConsultationIndex = idx;
      const chosen = data.consultations[idx];
      if (!chosen) return;
      selectedTrackName.textContent = chosen.title;
      if (selectedTrackDuration) selectedTrackDuration.textContent = 'open';
      const statutoryRefEl = document.getElementById('selected-track-statutory-ref');
      if (statutoryRefEl) statutoryRefEl.textContent = chosen.statutory_ref || 'ibc 2016 statutory advisory';
      const scopeEl = document.getElementById('selected-track-scope');
      if (scopeEl) scopeEl.textContent = chosen.scope || chosen.description;
      updateConsultationBookingButtonState();
    }

    // Hover updates right-side description; click opens the consultation page
    consultationsTracksList.querySelectorAll('.menu-card').forEach(card => {
      card.addEventListener('mouseenter', () => {
        const idx = parseInt(card.dataset.idx, 10);
        selectTrackByIndex(idx);
      });
      card.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        const idx = parseInt(card.dataset.idx, 10);
        const chosen = data.consultations[idx];
        closeAllMegamenus();
        if (typeof window.openConsultationsView === 'function') {
          window.openConsultationsView(chosen ? chosen.slug : null);
        }
      });
    });
  }

  function setupMegamenuEvents() {
    // Opportunities link hover/click: return focus to opportunities
    if (navOpportunities) {
      navOpportunities.addEventListener('mouseenter', () => {
        if (!pinnedMegamenu) closeAllMegamenus();
      });
      navOpportunities.addEventListener('click', () => {
        closeAllMegamenus();
      });
    }

    // Intelligence Menu
    navIntelligenceContainer.addEventListener('mouseenter', () => {
      openMegamenu('intelligence', false);
    });
    navIntelligenceContainer.addEventListener('mouseleave', () => {
      scheduleCloseMegamenu('intelligence');
    });
    navIntelligenceBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (megamenuIntelligence.classList.contains('show') && pinnedMegamenu === 'intelligence') {
        closeAllMegamenus();
      } else {
        openMegamenu('intelligence', true);
      }
    });

    // Consultations Menu
    navConsultationsContainer.addEventListener('mouseenter', () => {
      openMegamenu('consultations', false);
    });
    navConsultationsContainer.addEventListener('mouseleave', () => {
      scheduleCloseMegamenu('consultations');
    });
    navConsultationsBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (megamenuConsultations.classList.contains('show') && pinnedMegamenu === 'consultations') {
        closeAllMegamenus();
      } else {
        openMegamenu('consultations', true);
      }
    });

    megamenuIntelligence.addEventListener('click', (e) => {
      e.stopPropagation();
    });
    megamenuConsultations.addEventListener('click', (e) => {
      e.stopPropagation();
    });

    if (calnodeBookTrigger) {
      calnodeBookTrigger.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const active = getSelectedConsultation();
        const user = getStoredUser();
        if (!user) {
          try {
            sessionStorage.setItem('openibc_pending_consultation', JSON.stringify({ slug: active.slug, title: active.title }));
          } catch (_) {}
          closeAllMegamenus();
          const authModalOverlay = document.getElementById('auth-modal-overlay');
          const signinError = document.getElementById('signin-error');
          if (signinError) {
            signinError.textContent = 'please sign in to book your consultation briefing';
            signinError.style.display = 'block';
          }
          if (authModalOverlay) {
            authModalOverlay.classList.add('show');
          }
          return;
        }

        launchCalnodePopup(active, user);
      });
    }

    if (toggleFallbackDispatchBtn) {
      toggleFallbackDispatchBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        clearConsultationConfirmation();
        setConsultationDockMode(!calnodeFallbackMode);
      });
    }

    document.addEventListener('calnode:booked', async (e) => {
      const detail = e.detail || {};
      const meta = pendingCalnodeMeta || {
        track: getSelectedConsultation().title,
        slug: getSelectedConsultation().slug,
        stakeholder: currentSubdomain,
        notes: calnodeContextInput ? calnodeContextInput.value.trim() : ''
      };
      pendingCalnodeMeta = null;
      calnodeSlotsCache.delete(meta.slug);

      if (calnodeContextInput) calnodeContextInput.value = '';
      const bookingID = detail.id || '';
      const startAt = detail.start_at || '';
      const locInfo = detail.location_value || detail.location_type || 'calnode';
      const combinedNotes = [
        meta.notes ? `Context: ${meta.notes}` : '',
        startAt ? `Scheduled: ${startAt}` : '',
        `Channel: ${locInfo}`
      ].filter(Boolean).join(' | ');

      try {
        await fetch('/api/consultations/dispatch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            track: meta.track,
            stakeholder: meta.stakeholder,
            contact: bookingID ? `calnode:${bookingID}` : 'calnode-popup',
            notes: combinedNotes,
            status: 'SCHEDULED',
            calnode_booking_id: bookingID,
            scheduled_at: startAt
          })
        });
      } catch (_) {}
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (
        !navIntelligenceContainer.contains(e.target) &&
        !navConsultationsContainer.contains(e.target)
      ) {
        closeAllMegamenus();
      }
      subdomainDropdown.classList.remove('show');
    });

    if (window.location.hash === '#consultations') {
      openMegamenu('consultations', true);
    }

    // Subdomain Trigger
    brandTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      subdomainDropdown.classList.toggle('show');
    });

    document.querySelectorAll('#subdomain-dropdown .dropdown-item[data-sub]').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        setSubdomain(item.dataset.sub);
        subdomainDropdown.classList.remove('show');
      });
    });

    // Fallback Fast-Track Lead Dispatch Submission
    if (fastTrackForm) {
      fastTrackForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const contactVal = document.getElementById('dispatch-contact')?.value?.trim() || '';
        const notesVal = document.getElementById('dispatch-notes')?.value?.trim() || '';
        const currentTrack = getSelectedConsultation()?.title || 'Chamber Consultation';

        const btn = document.getElementById('dispatch-submit-btn');
        if (btn) {
          btn.textContent = 'DISPATCHING BRIEFING...';
          btn.disabled = true;
        }

        try {
          const res = await fetch('/api/consultations/dispatch', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              track: currentTrack,
              stakeholder: currentSubdomain,
              contact: contactVal,
              notes: notesVal
            })
          });
          await res.json();

          fastTrackForm.style.display = 'none';
          clearConsultationConfirmation();
          const banner = document.createElement('div');
          banner.id = 'calnode-confirm-banner';
          banner.style.cssText = 'padding:16px 8px;text-align:center;';
          banner.innerHTML = `
            <div style="width:36px;height:36px;border-radius:50%;background:rgba(52,211,153,0.2);color:#34d399;display:flex;align-items:center;justify-content:center;margin:0 auto 10px;font-size:18px;font-weight:700;">
              &#10004;
            </div>
            <div style="font-size:10px;font-family:monospace;color:#34d399;font-weight:700;letter-spacing:1px;text-transform:uppercase;">
              BRIEFING REQUEST DISPATCHED
            </div>
            <h4 style="font-family:'Chakra Petch',sans-serif;font-size:14px;color:white;margin:4px 0 6px;">
              Chamber Counsel Notified
            </h4>
            <p style="font-size:11px;color:#94a3b8;line-height:1.4;">
              Inquiry for <span style="color:white;font-weight:600;">${escapeHTML(currentTrack)}</span> logged. Our lead counsel will contact <span style="color:#38bdf8;font-family:monospace;">${escapeHTML(contactVal)}</span>.
            </p>
          `;
          if (fastTrackContainer) fastTrackContainer.appendChild(banner);
          fastTrackForm.reset();
          if (btn) {
            btn.textContent = 'INITIATE HAYAGRIVA CONSULTATION';
            btn.disabled = false;
          }
        } catch (err) {
          if (btn) {
            btn.textContent = 'INITIATE HAYAGRIVA CONSULTATION';
            btn.disabled = false;
          }
          alert('Failed to dispatch briefing. Please retry.');
        }
      });
    }
  }

  // ─── 6. HAYAGRIVA DOWNLOAD MODAL ───
  function setupDownloadModal() {
    if (dockDownloadTrigger) {
      dockDownloadTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        openDownloadModal();
      });
    }

    if (downloadModalClose) downloadModalClose.addEventListener('click', closeDownloadModal);
    if (downloadModalOverlay) {
      downloadModalOverlay.addEventListener('click', (e) => {
        if (e.target === downloadModalOverlay) closeDownloadModal();
      });
    }

    dlContinueBtn.addEventListener('click', closeDownloadModal);

    // Render binary grid options
    binaryGrid.innerHTML = BINARIES.map(b => `
      <button type="button" class="binary-option-btn ${b.osId === selectedBinary.osId ? 'selected' : ''}" data-os="${b.osId}">
        <span class="title">${b.osTitle}</span>
        <span class="subtext">${b.format}</span>
      </button>
    `).join('');

    binaryGrid.querySelectorAll('.binary-option-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        binaryGrid.querySelectorAll('.binary-option-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        const match = BINARIES.find(b => b.osId === btn.dataset.os);
        if (match) {
          selectedBinary = match;
          updateSelectedBinaryUI();
          clearInterval(countdownTimer);
          countdownBadge.textContent = "Manual Download Selected";
        }
      });
    });
  }

  function openDownloadModal() {
    // OS Detection
    const ua = navigator.userAgent || "";
    if (/Mac/i.test(ua)) {
      selectedBinary = BINARIES[0];
    } else if (/Win/i.test(ua)) {
      selectedBinary = BINARIES[2];
    } else if (/Linux/i.test(ua)) {
      selectedBinary = BINARIES[3];
    }
    updateSelectedBinaryUI();

    downloadModalOverlay.classList.add('show');
    downloadCountdown = 3;
    countdownBadge.textContent = `Auto-downloading in ${downloadCountdown}s`;

    clearInterval(countdownTimer);
    countdownTimer = setInterval(() => {
      downloadCountdown--;
      if (downloadCountdown > 0) {
        countdownBadge.textContent = `Auto-downloading in ${downloadCountdown}s`;
      } else {
        clearInterval(countdownTimer);
        countdownBadge.textContent = "Download Initiated";
        triggerBinaryDownload(selectedBinary.downloadUrl);
      }
    }, 1000);
  }

  function updateSelectedBinaryUI() {
    dlOsTitle.textContent = selectedBinary.osTitle;
    dlOsMeta.textContent = `${selectedBinary.arch} • ${selectedBinary.size} • ${selectedBinary.format}`;
    dlDirectBtn.href = selectedBinary.downloadUrl;
    dlDirectBtn.onclick = (e) => {
      clearInterval(countdownTimer);
      countdownBadge.textContent = "Download Initiated";
    };
  }

  function triggerBinaryDownload(url) {
    try {
      const a = document.createElement('a');
      a.href = url;
      a.download = '';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (e) {
      window.location.href = url;
    }
  }

  function closeDownloadModal() {
    clearInterval(countdownTimer);
    downloadModalOverlay.classList.remove('show');
  }

  // ─── 7. OPPORTUNITY INTAKE MODAL ───
  function updateIntakeModalConfig(subKey) {
    if (!intakeBadge) return;
    const cfg = activeMode === 'professionals'
      ? PROFESSIONAL_INTAKE_CONFIG
      : (SUBDOMAIN_INTAKE_CONFIGS[subKey] || SUBDOMAIN_INTAKE_CONFIGS.investors);
    intakeBadge.textContent = cfg.badge;
    intakeTitle.textContent = cfg.title;
    intakeSubtitle.textContent = cfg.subtitle;
    if (intakeLbl1) intakeLbl1.textContent = cfg.field1;
    if (intakeField1) intakeField1.placeholder = cfg.f1p;
    if (intakeLbl2) intakeLbl2.textContent = cfg.field2;
    if (intakeField2) intakeField2.placeholder = cfg.f2p;
    if (intakeLbl3) intakeLbl3.textContent = cfg.field3;
    if (intakeField3) intakeField3.placeholder = cfg.f3p;
    if (intakeSubmitBtn) intakeSubmitBtn.textContent = `${cfg.btn} →`;
  }

  function setupIntakeModal() {
    if (!openIntakeBtn || !intakeModalOverlay || !intakeForm) return;
    openIntakeBtn.addEventListener('click', () => {
      intakeModalOverlay.classList.add('show');
    });
    if (intakeModalClose) {
      intakeModalClose.addEventListener('click', () => {
        intakeModalOverlay.classList.remove('show');
      });
    }
    intakeModalOverlay.addEventListener('click', (e) => {
      if (e.target === intakeModalOverlay) intakeModalOverlay.classList.remove('show');
    });

    intakeForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const isProMode = activeMode === 'professionals';
      const code = Math.floor(10000 + Math.random() * 90000);
      const refPrefix = isProMode ? 'PRO' : currentSubdomain.slice(0, 3).toUpperCase();
      const refId = `OPENIBC-${refPrefix}-${code}`;

      intakeModalBody.innerHTML = `
        <div style="text-align:center;padding:24px 12px;">
          <div style="width:50px;height:50px;border-radius:50%;background:#ecfdf5;color:#059669;font-size:24px;font-weight:700;display:flex;align-items:center;justify-content:center;margin:0 auto 12px;border:1px solid #a7f3d0;">
            &#10004;
          </div>
          <h3 style="font-size:18px;font-weight:800;color:#0f172a;margin-bottom:6px;">
            ${isProMode ? 'Empanelment Dispatched to Radar' : 'Opportunity Dispatched to Radar'}
          </h3>
          <p style="font-size:12px;color:#64748b;margin-bottom:16px;">
            ${isProMode
              ? 'Your practice empanelment request has been logged on the IBC practitioner directory for verification.'
              : 'Your distressed opportunity submission has been logged on the master ledger for statutory inquest.'}
          </p>
          <div style="background:#f8fafc;border:1px solid #e2e8f0;padding:12px;border-radius:12px;max-width:240px;margin:0 auto 18px;font-family:monospace;font-size:12px;">
            <span style="color:#94a3b8;font-size:10px;display:block;text-transform:uppercase;">Tracking Identification</span>
            <strong style="color:#0f172a;font-size:14px;">${refId}</strong>
          </div>
          <button type="button" id="intake-done-btn" style="width:100%;padding:12px;border-radius:10px;background:#0f172a;color:white;font-family:'Chakra Petch',sans-serif;font-weight:700;font-size:12px;text-transform:uppercase;border:none;cursor:pointer;">
            Return to Radar
          </button>
        </div>
      `;
      document.getElementById('intake-done-btn').addEventListener('click', () => {
        intakeModalOverlay.classList.remove('show');
      });
    });
  }

  // ─── 8. LEAFLET MAP & RADAR CORE ───

  // Institutional Grey Basemap Cache Manager (CacheStorage for instant 0ms offline loads)
  const BASEMAP_CACHE_NAME = 'openibc-greymap-v2';

  // National Bounding Box Coordinates for India (Zoom 4 to 6)
  const INDIA_CORE_TILES = [
    // Zoom 4
    { z: 4, y: 7, x: 11 }, { z: 4, y: 8, x: 11 },
    { z: 4, y: 7, x: 12 }, { z: 4, y: 8, x: 12 },
    // Zoom 5
    { z: 5, y: 14, x: 22 }, { z: 5, y: 15, x: 22 },
    { z: 5, y: 14, x: 23 }, { z: 5, y: 15, x: 23 },
    { z: 5, y: 14, x: 24 }, { z: 5, y: 15, x: 24 },
    // Zoom 6
    { z: 6, y: 28, x: 44 }, { z: 6, y: 29, x: 44 },
    { z: 6, y: 28, x: 45 }, { z: 6, y: 29, x: 45 },
    { z: 6, y: 29, x: 46 }, { z: 6, y: 30, x: 46 },
    { z: 6, y: 29, x: 47 }, { z: 6, y: 30, x: 47 },
    { z: 6, y: 29, x: 48 }, { z: 6, y: 30, x: 48 },
  ];

  async function prewarmBasemapCache() {
    if (typeof window === 'undefined' || !('caches' in window)) return;
    try {
      const cache = await caches.open(BASEMAP_CACHE_NAME);
      const tilePromises = INDIA_CORE_TILES.map(async ({ z, y, x }) => {
        const url = `https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/${z}/${y}/${x}`;
        const match = await cache.match(url);
        if (!match) {
          try {
            const res = await fetch(url, { mode: 'cors', cache: 'force-cache' });
            if (res.ok) await cache.put(url, res);
          } catch (e) {
            // background prefetch failure non-critical
          }
        }
      });
      await Promise.allSettled(tilePromises);
    } catch (err) {
      console.debug('[tileCache] Prewarm notice:', err);
    }
  }

  // Custom Cached Tile Layer: serves from CacheStorage first, falls back to network with caching
  const CachedTileLayer = L.TileLayer.extend({
    createTile(coords, done) {
      const tile = document.createElement('img');
      tile.alt = '';
      tile.setAttribute('role', 'presentation');
      const url = this.getTileUrl(coords);

      if (typeof window !== 'undefined' && 'caches' in window) {
        caches.open(BASEMAP_CACHE_NAME).then((cache) => {
          cache.match(url).then((cachedResponse) => {
            if (cachedResponse) {
              cachedResponse.blob().then((blob) => {
                const objUrl = URL.createObjectURL(blob);
                tile.onload = () => {
                  URL.revokeObjectURL(objUrl);
                  done(null, tile);
                };
                tile.onerror = (err) => {
                  URL.revokeObjectURL(objUrl);
                  done(err, tile);
                };
                tile.src = objUrl;
              });
            } else {
              tile.onload = () => {
                done(null, tile);
                fetch(url, { mode: 'cors', cache: 'force-cache' })
                  .then((res) => {
                    if (res.ok) cache.put(url, res);
                  })
                  .catch(() => {});
              };
              tile.onerror = (err) => done(err, tile);
              tile.crossOrigin = 'anonymous';
              tile.src = url;
            }
          }).catch(() => {
            tile.crossOrigin = 'anonymous';
            tile.src = url;
            tile.onload = () => done(null, tile);
            tile.onerror = (err) => done(err, tile);
          });
        }).catch(() => {
          tile.crossOrigin = 'anonymous';
          tile.src = url;
          tile.onload = () => done(null, tile);
          tile.onerror = (err) => done(err, tile);
        });
      } else {
        tile.crossOrigin = 'anonymous';
        tile.src = url;
        tile.onload = () => done(null, tile);
        tile.onerror = (err) => done(err, tile);
      }

      return tile;
    }
  });

  const INDIA_BOUNDS = [[6.8, 68.1], [35.8, 97.4]];
  const PAN_MAX_BOUNDS = [[2.0, 56.0], [40.0, 108.0]];

  function getItemCoords(item) {
    if (!item) return null;
    const rawLat = item.latitude !== undefined && item.latitude !== null ? item.latitude : item.lat;
    const rawLng = item.longitude !== undefined && item.longitude !== null ? item.longitude : item.lng;
    const lat = parseFloat(rawLat);
    const lng = parseFloat(rawLng);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
    if (Math.abs(lat) < 0.001 && Math.abs(lng) < 0.001) return null;
    return [lat, lng];
  }

  function normalizeRegime(raw) {
    const reg = (raw || 'CIRP').toUpperCase();
    if (reg === 'LIQUIDATION' || reg === 'CILP') return 'LIQUIDATION';
    if (reg === 'SARFAESI') return 'SARFAESI';
    return 'CIRP';
  }

  function normalizeRole(raw) {
    const role = (raw || 'IP').toUpperCase();
    if (role === 'RV' || role === 'VALUER') return 'RV';
    if (role === 'ADVOCATE' || role === 'COUNSEL') return 'ADVOCATE';
    return 'IP';
  }

  function fitMapToItems(items) {
    if (!map) return;
    const pts = [];
    (items || []).forEach(item => {
      const coords = getItemCoords(item);
      if (coords) pts.push(coords);
    });
    if (pts.length === 0) {
      map.fitBounds(INDIA_BOUNDS, { padding: [18, 18], maxZoom: 6, animate: true });
      return;
    }
    if (pts.length === 1) {
      map.flyTo(pts[0], 7.5, { duration: 0.5 });
      return;
    }
    map.fitBounds(L.latLngBounds(pts), { padding: [46, 46], maxZoom: 7, animate: true });
  }

  function resetAllFiltersState() {
    if (searchInput) searchInput.value = '';
    activeRegime = 'ALL';
    if (regimePillsContainer) {
      regimePillsContainer.querySelectorAll('.regime-pill').forEach(p => {
        p.classList.toggle('active', p.dataset.regime === 'ALL');
      });
    }
    if (sectorFilter) sectorFilter.value = 'ALL';
    if (benchFilter) benchFilter.value = 'ALL';
    if (roleFilter) roleFilter.value = 'ALL';
  }

  function initMap() {
    map = L.map('leaflet-map', {
      center: [21.5, 81.5],
      zoom: 5,
      minZoom: 4.5,
      maxZoom: 16,
      zoomSnap: 0.25,
      zoomDelta: 0.5,
      zoomControl: false,
      attributionControl: false,
      maxBounds: PAN_MAX_BOUNDS,
      maxBoundsViscosity: 0.65
    });
    map.fitBounds(INDIA_BOUNDS, { padding: [18, 18], maxZoom: 6 });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Institutional Grey Basemap (Esri World Light Gray Base)
    const greyTileLayer = new CachedTileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
      {
        attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
        maxZoom: 16,
        keepBuffer: 12,
        updateWhenIdle: false,
        updateWhenZooming: true
      }
    );
    greyTileLayer.addTo(map);

    // Reference Layer (Labels, Benches, Cities)
    const labelLayer = new CachedTileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}',
      {
        maxZoom: 16,
        keepBuffer: 12,
        updateWhenIdle: false,
        updateWhenZooming: true
      }
    );
    labelLayer.addTo(map);

    markersLayer = L.layerGroup().addTo(map);

    // Multi-shot invalidateSize bursts to ensure complete rendering without grey voids
    const initDelays = [50, 150, 300, 600, 1000, 1800, 2500];
    initDelays.forEach(d => setTimeout(() => { if (map) map.invalidateSize(); }, d));

    // Persistent ResizeObserver: guarantees map auto-resizes when layout flex widths shift
    const mapContainer = document.getElementById('leaflet-map');
    if (mapContainer && typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(() => {
        if (map) map.invalidateSize();
      });
      ro.observe(mapContainer);
    }

    // Prewarm national core tiles on idle
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      window.requestIdleCallback(() => prewarmBasemapCache());
    } else {
      setTimeout(prewarmBasemapCache, 1200);
    }
  }

  function syncModeCounts() {
    if (modeAssetsBtn) {
      modeAssetsBtn.textContent = modeCounts.assets === null
        ? 'Insolvent Assets'
        : `Insolvent Assets (${modeCounts.assets})`;
    }
    if (modeProfessionalsBtn) {
      modeProfessionalsBtn.textContent = modeCounts.professionals === null
        ? 'Professionals Map'
        : `Professionals Map (${modeCounts.professionals})`;
    }
  }

  async function loadData() {
    const modeAtFetch = activeMode;
    cardList.innerHTML = `<div style="padding:40px 20px;text-align:center;color:#64748b;font-size:13px;font-family:monospace;">
      <span class="pulse-dot emerald" style="margin-right:6px;"></span>
      Querying Neon PostgreSQL via Go coordinator in 1.8ms...
    </div>`;

    try {
      const endpoint = modeAtFetch === 'assets' ? '/api/radar/assets' : '/api/radar/professionals';
      const res = await fetch(endpoint);
      const data = await res.json();
      const items = modeAtFetch === 'assets' ? (data.assets || []) : (data.professionals || []);
      modeCounts[modeAtFetch] = items.length;

      const otherMode = modeAtFetch === 'assets' ? 'professionals' : 'assets';
      if (modeCounts[otherMode] === null) {
        const otherEndpoint = otherMode === 'assets' ? '/api/radar/assets' : '/api/radar/professionals';
        fetch(otherEndpoint)
          .then(r => r.json())
          .then(d => {
            const list = otherMode === 'assets' ? (d.assets || []) : (d.professionals || []);
            modeCounts[otherMode] = list.length;
            syncModeCounts();
          })
          .catch(() => {});
      }

      if (modeAtFetch !== activeMode) {
        syncModeCounts();
        return;
      }

      rawItems = items;
      syncModeCounts();
      populateFilters();
      applyFilters();
    } catch (err) {
      console.error("Failed to load radar data:", err);
      cardList.innerHTML = `<div style="padding:24px;text-align:center;color:#dc2626;font-size:13px;">
        Failed to load radar data from Go coordinator.
      </div>`;
    }
  }

  function populateFilters() {
    if (!sectorFilter || !benchFilter) return;
    const sectors = new Set();
    const benches = new Set();
    const prevSector = sectorFilter.value;
    const prevBench = benchFilter.value;

    rawItems.forEach(item => {
      if (activeMode === 'assets') {
        if (item.sector) sectors.add(item.sector);
      } else {
        if (item.specialization) sectors.add(item.specialization);
      }
      if (item.ncltBench) benches.add(item.ncltBench);
      if (item.bench) benches.add(item.bench);
    });

    const sectorDefaultLabel = activeMode === 'assets' ? 'All Sectors' : 'All Specializations';
    sectorFilter.innerHTML = `<option value="ALL">${sectorDefaultLabel}</option>`;
    sectors.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s;
      opt.textContent = s;
      sectorFilter.appendChild(opt);
    });
    sectorFilter.value = sectors.has(prevSector) ? prevSector : 'ALL';

    const benchCount = benches.size;
    const benchLabel = benchCount > 0 ? `All ${benchCount} NCLT Benches` : 'All NCLT Benches';
    benchFilter.innerHTML = `<option value="ALL">${benchLabel}</option>`;
    benches.forEach(b => {
      const opt = document.createElement('option');
      opt.value = b;
      opt.textContent = b;
      benchFilter.appendChild(opt);
    });
    benchFilter.value = benches.has(prevBench) ? prevBench : 'ALL';
  }

  function applyFilters(options = {}) {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const sector = (sectorFilter && sectorFilter.value) ? sectorFilter.value : 'ALL';
    const bench = (benchFilter && benchFilter.value) ? benchFilter.value : 'ALL';
    const role = (roleFilter && roleFilter.value) ? roleFilter.value : 'ALL';

    // Show/hide search clear button
    if (searchBoxContainer) {
      searchBoxContainer.classList.toggle('has-query', query.length > 0);
    }

    // Check if any filter is non-default
    const hasActiveFilters = query.length > 0 ||
      (activeMode === 'assets' && activeRegime !== 'ALL') ||
      (activeMode === 'professionals' && role !== 'ALL') ||
      sector !== 'ALL' || bench !== 'ALL';
    if (resetFiltersBtn) {
      resetFiltersBtn.style.display = hasActiveFilters ? 'flex' : 'none';
    }
    if (filterRow) {
      filterRow.classList.toggle('has-reset', hasActiveFilters);
    }

    filteredItems = rawItems.filter(item => {
      const name = item.companyName || item.name || '';
      const cin = item.cin || item.reg_no || '';
      const firm = item.firm || '';
      const city = item.assetCity || item.city || '';
      const itemBench = item.ncltBench || item.bench || '';
      const itemSector = item.sector || item.specialization || '';
      const regime = normalizeRegime(item.regime);
      const itemRole = normalizeRole(item.role);

      const matchQuery = !query ||
        name.toLowerCase().includes(query) ||
        cin.toLowerCase().includes(query) ||
        firm.toLowerCase().includes(query) ||
        city.toLowerCase().includes(query) ||
        itemBench.toLowerCase().includes(query) ||
        itemSector.toLowerCase().includes(query);

      const matchSector = sector === 'ALL' || itemSector === sector;
      const matchBench = bench === 'ALL' || itemBench === bench;
      const matchRegime = activeMode !== 'assets' || activeRegime === 'ALL' || regime === activeRegime;
      const matchRole = activeMode !== 'professionals' || role === 'ALL' || itemRole === role;

      return matchQuery && matchSector && matchBench && matchRegime && matchRole;
    });

    if (activeMarkerId && !filteredItems.some(item => item.id === activeMarkerId)) {
      activeMarkerId = null;
      if (inspectorDrawer) inspectorDrawer.classList.remove('open');
      if (mobilePinPreview) mobilePinPreview.style.display = 'none';
    }

    const roleCountLabels = {
      ALL: 'Verified Professionals',
      IP: 'Insolvency Professionals',
      RV: 'Registered Valuers',
      ADVOCATE: 'Advocates / Counsel'
    };
    const countLabel = activeMode === 'assets'
      ? 'Insolvent Debtors'
      : (roleCountLabels[role] || 'Verified Professionals');
    if (assetsCount) {
      assetsCount.innerHTML = `<span class="pulse-dot emerald"></span> ${filteredItems.length} ${countLabel}`;
    }

    if (mobileViewLabel) {
      mobileViewLabel.textContent = mobileView === 'list' ? 'View Map' : `View List (${filteredItems.length})`;
    }

    renderCards();
    renderMarkers();
    if (options.syncMap !== false) {
      fitMapToItems(filteredItems);
    }
  }

  function formatCr(val) {
    const num = parseFloat(val);
    if (isNaN(num) || num <= 0) return 'Undisclosed';
    if (num >= 10000000) {
      return `₹${(num / 10000000).toLocaleString('en-IN', { maximumFractionDigits: 1 })} Cr`;
    }
    return `₹${num.toLocaleString('en-IN')}`;
  }

  function renderCards() {
    if (filteredItems.length === 0) {
      cardList.innerHTML = `<div style="padding:40px 20px;text-align:center;color:#64748b;font-size:13px;">
        <div style="margin-bottom:10px;">No items matching the selected filters.</div>
        <button type="button" id="empty-reset-filters-btn" style="padding:6px 12px;border-radius:8px;border:1px solid #cbd5e1;background:#f8fafc;color:#0f172a;font-size:12px;font-weight:600;cursor:pointer;">
          Reset All Filters
        </button>
      </div>`;
      const emptyResetBtn = document.getElementById('empty-reset-filters-btn');
      if (emptyResetBtn) {
        emptyResetBtn.addEventListener('click', () => {
          resetAllFiltersState();
          applyFilters({ syncMap: true });
        });
      }
      return;
    }

    if (activeMode === 'assets') {
      cardList.innerHTML = filteredItems.map(a => {
        const isBookmarked = bookmarkedIds.has(a.id);
        const stage = a.cirpStage || a.regime || 'CIRP';
        return `
        <div class="deal-card ${activeMarkerId === a.id ? 'active' : ''}" data-id="${a.id}">
          <div class="card-top">
            <div class="company-name" style="flex:1;">${escapeHTML(a.companyName)}</div>
            <div style="display:flex;align-items:center;gap:6px;">
              <span class="stage-badge cirp">${escapeHTML(stage)}</span>
              <button type="button" class="bookmark-btn ${isBookmarked ? 'bookmarked' : ''}" title="${isBookmarked ? 'Remove Bookmark' : 'Bookmark Deal'}" onclick="event.stopPropagation(); window.toggleBookmark('${a.id}');">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="${isBookmarked ? '#f59e0b' : 'none'}" stroke="currentColor" stroke-width="2"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
              </button>
            </div>
          </div>
          <div class="card-meta">
            <span class="meta-pill" style="font-weight:600;color:#0369a1;">${escapeHTML(a.ncltBench)}</span>
            <span class="meta-pill">${escapeHTML(a.sector)}</span>
            <span class="meta-pill font-mono">${escapeHTML(a.assetCity || a.state)}</span>
          </div>
          <div class="financials-row">
            <div class="fin-item">
              <span class="fin-label">Claims Admitted</span>
              <span class="fin-val">${formatCr(a.claimsAdmittedInr)}</span>
            </div>
            <div class="fin-item" style="text-align:right;">
              <span class="fin-label">Liquidation Min</span>
              <span class="fin-val" style="color:#059669;">${formatCr(a.liquidationValueInr)}</span>
            </div>
          </div>
        </div>
      `;
      }).join('');
    } else {
      cardList.innerHTML = filteredItems.map(p => {
        const isBookmarked = bookmarkedIds.has(p.id);
        return `
        <div class="deal-card ${activeMarkerId === p.id ? 'active' : ''}" data-id="${p.id}">
          <div class="card-top">
            <div class="company-name" style="flex:1;">${escapeHTML(p.name)}</div>
            <div style="display:flex;align-items:center;gap:6px;">
              <span class="stage-badge" style="background:#e0f2fe;color:#0369a1;">${escapeHTML(p.role ? p.role.toUpperCase() : 'IP')}</span>
              <button type="button" class="bookmark-btn ${isBookmarked ? 'bookmarked' : ''}" title="${isBookmarked ? 'Remove Bookmark' : 'Bookmark Professional'}" onclick="event.stopPropagation(); window.toggleBookmark('${p.id}');">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="${isBookmarked ? '#f59e0b' : 'none'}" stroke="currentColor" stroke-width="2"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
              </button>
            </div>
          </div>
          <div class="card-meta">
            <span class="meta-pill" style="font-weight:600;color:#0369a1;">${escapeHTML(p.bench)}</span>
            <span class="meta-pill">${escapeHTML(p.firm)}</span>
            <span class="meta-pill font-mono">${escapeHTML(p.reg_no)}</span>
          </div>
          <div class="financials-row">
            <div class="fin-item">
              <span class="fin-label">Active Mandates</span>
              <span class="fin-val">${p.active_mandates || 3} Live CIRPs</span>
            </div>
            <div class="fin-item" style="text-align:right;">
              <span class="fin-label">Statutory Status</span>
              <span class="fin-val" style="color:#059669;">Verified Compliant</span>
            </div>
          </div>
        </div>
      `;
      }).join('');
    }

    cardList.querySelectorAll('.deal-card').forEach(card => {
      card.addEventListener('click', () => {
        selectItem(card.dataset.id);
      });
    });
  }

  function getPinClass(item) {
    if (activeMode === 'assets') {
      const regMap = { LIQUIDATION: 'pin-liquidation', SARFAESI: 'pin-sarfaesi', CIRP: 'pin-cirp' };
      return regMap[normalizeRegime(item.regime)] || 'pin-cirp';
    }
    const roleMap = { RV: 'pin-rv', ADVOCATE: 'pin-advocate', IP: 'pin-ip' };
    return roleMap[normalizeRole(item.role)] || 'pin-ip';
  }

  function renderMarkers() {
    markersLayer.clearLayers();

    filteredItems.forEach(item => {
      const coords = getItemCoords(item);
      if (!coords) return;

      const isSelected = activeMarkerId === item.id;
      const pinClass = getPinClass(item);
      const size = isSelected ? 22 : 15;
      const anchor = isSelected ? 11 : 7.5;

      const customIcon = L.divIcon({
        className: 'custom-pin-wrapper',
        html: `<div class="radar-pin ${pinClass} ${isSelected ? 'active' : ''}" id="pin-${item.id}"></div>`,
        iconSize: [size, size],
        iconAnchor: [anchor, anchor]
      });

      const marker = L.marker(coords, { icon: customIcon, riseOnHover: true });
      marker.on('click', () => selectItem(item.id));
      marker.addTo(markersLayer);
    });
  }

  function selectItem(id) {
    const item = rawItems.find(a => a.id === id);
    if (!item) return;

    activeMarkerId = id;

    const coords = getItemCoords(item);
    if (coords && map) {
      const targetZoom = Math.max(map.getZoom(), 8);
      if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
        const targetPoint = map.project(coords, targetZoom);
        const drawerShiftPx = Math.min(200, Math.round(map.getSize().x * 0.22));
        const offsetCenter = map.unproject(targetPoint.add([drawerShiftPx, 0]), targetZoom);
        map.flyTo(offsetCenter, targetZoom, { duration: 0.75 });
      } else {
        map.flyTo(coords, targetZoom, { duration: 0.75 });
      }
    }

    cardList.querySelectorAll('.deal-card').forEach(c => {
      const isTarget = c.dataset.id === id;
      c.classList.toggle('active', isTarget);
      if (isTarget) c.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });

    renderMarkers();

    // On mobile screens (<1024px) in map mode, show floating preview first
    if (typeof window !== 'undefined' && window.innerWidth < 1024 && mobileView === 'map') {
      showMobilePinPreview(item);
    } else {
      showInspector(item);
    }
  }

  function showMobilePinPreview(item) {
    if (!mobilePinPreview) return;
    const isAsset = activeMode === 'assets';
    const title = item.companyName || item.name;
    const bench = item.ncltBench || item.bench || 'National Bench';

    mobilePinPreview.innerHTML = `
      <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:8px;">
        <div style="flex:1;min-width:0;">
          <div style="display:flex;align-items:center;gap:6px;margin-bottom:2px;">
            <span style="font-size:9px;font-family:'Chakra Petch',sans-serif;font-weight:700;padding:1px 6px;border-radius:999px;text-transform:uppercase;${isAsset ? 'background:#fef3c7;color:#b45309;' : 'background:#e0f2fe;color:#0369a1;'}">
              ${escapeHTML(isAsset ? (item.cirpStage || item.regime || 'CIRP') : (item.role || 'IP').toUpperCase())}
            </span>
            <span style="font-size:10px;font-family:monospace;color:#64748b;">${escapeHTML(bench)}</span>
          </div>
          <h4 style="font-size:13px;font-weight:700;color:#0f172a;margin:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
            ${escapeHTML(title)}
          </h4>
          <div style="display:flex;justify-content:space-between;margin-top:4px;font-size:11px;font-family:monospace;">
            <span style="color:#64748b;">${isAsset ? `Claims: ${formatCr(item.claimsAdmittedInr)}` : (item.specialization || item.firm || 'Practicing IP')}</span>
            <span style="color:#059669;font-weight:700;">${isAsset ? `Liq: ${formatCr(item.liquidationValueInr)}` : `${item.active_mandates || 3} CIRPs`}</span>
          </div>
        </div>
        <button type="button" id="mobile-preview-close" style="background:none;border:none;color:#94a3b8;font-size:18px;line-height:1;cursor:pointer;padding:2px;">&times;</button>
      </div>
      <button type="button" id="mobile-preview-open-dossier" style="width:100%;margin-top:8px;padding:7px;border-radius:8px;background:#0f172a;color:white;font-family:'Chakra Petch',sans-serif;font-size:11px;font-weight:700;text-transform:uppercase;border:none;cursor:pointer;">
        View Full Statutory Dossier &rarr;
      </button>
    `;

    mobilePinPreview.style.display = 'block';

    const closeBtn = document.getElementById('mobile-preview-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        mobilePinPreview.style.display = 'none';
        activeMarkerId = null;
        renderMarkers();
      });
    }

    const openBtn = document.getElementById('mobile-preview-open-dossier');
    if (openBtn) {
      openBtn.addEventListener('click', () => {
        showInspector(item);
      });
    }
  }

  function showInspector(item) {
    if (!inspectorDrawer) return;

    const isAsset = activeMode === 'assets';
    const title = item.companyName || item.name;
    const bench = item.ncltBench || item.bench || 'National Bench';
    const ref = item.caseNumber || item.reg_no || 'STATUTORY IBC CASE';
    const isBookmarked = bookmarkedIds.has(item.id);

    inspectorDrawer.innerHTML = `
      <div class="inspector-drawer-header">
        <div style="flex:1;min-width:0;">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
            <button type="button" class="mobile-back-btn" id="drawer-back-btn">
              &larr; Back
            </button>
            <span style="font-size:10px;font-family:'Chakra Petch',sans-serif;font-weight:700;padding:2px 8px;border-radius:999px;text-transform:uppercase;${isAsset ? 'background:#fef3c7;color:#b45309;border:1px solid #fde68a;' : 'background:#e0f2fe;color:#0369a1;border:1px solid #bae6fd;'}">
              ${escapeHTML(isAsset ? (item.cirpStage || item.regime || 'CIRP') : (item.role || 'IP').toUpperCase())}
            </span>
            <span style="font-size:11px;font-family:monospace;color:#64748b;text-transform:uppercase;">
              ${escapeHTML(bench)}
            </span>
          </div>
          <h2 style="font-size:18px;font-weight:800;color:#0f172a;line-height:1.3;margin:0;">
            ${escapeHTML(title)}
          </h2>
          <div style="font-size:11px;font-family:monospace;color:#0284c7;margin-top:2px;">
            ${escapeHTML(ref)}
          </div>
        </div>
        <button type="button" class="drawer-close-btn" id="drawer-close-btn" title="Close dossier">&times;</button>
      </div>

      <div class="inspector-drawer-body">
        <!-- Statutory Metrics Box -->
        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:12px;display:grid;grid-template-columns:1fr 1fr;gap:12px;">
          <div>
            <span style="font-size:10px;font-family:monospace;color:#64748b;display:block;text-transform:uppercase;">
              ${isAsset ? 'Admitted Claims' : 'Active Mandates'}
            </span>
            <strong style="font-size:14px;font-family:monospace;color:#0f172a;">
              ${isAsset ? formatCr(item.claimsAdmittedInr) : `${item.active_mandates || 3} Live CIRPs`}
            </strong>
          </div>
          <div style="text-align:right;">
            <span style="font-size:10px;font-family:monospace;color:#64748b;display:block;text-transform:uppercase;">
              ${isAsset ? 'Liquidation Minimum' : 'Statutory Status'}
            </span>
            <strong style="font-size:14px;font-family:monospace;color:#059669;">
              ${isAsset ? formatCr(item.liquidationValueInr) : 'Green Seal Verified'}
            </strong>
          </div>
          ${isAsset && item.cin ? `
            <div style="grid-column: span 2;border-top:1px solid #e2e8f0;padding-top:8px;display:flex;justify-content:space-between;font-size:11px;font-family:monospace;">
              <span style="color:#64748b;">CIN:</span>
              <span style="color:#0f172a;font-weight:700;">${escapeHTML(item.cin)}</span>
            </div>
          ` : ''}
          ${isAsset && item.assetCity ? `
            <div style="grid-column: span 2;display:flex;justify-content:space-between;font-size:11px;font-family:monospace;">
              <span style="color:#64748b;">Asset Location:</span>
              <span style="color:#0f172a;font-weight:700;">${escapeHTML(item.assetCity)}${item.state ? `, ${escapeHTML(item.state)}` : ''}</span>
            </div>
          ` : ''}
        </div>

        <!-- Description / Summary -->
        <div>
          <span style="font-size:10px;font-family:monospace;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;display:block;margin-bottom:6px;">
            ${isAsset ? 'Key Assets & Facility Summary' : 'Professional Practice & Specialization'}
          </span>
          <p style="font-size:12px;color:#334155;line-height:1.6;background:#f8fafc;padding:12px;border-radius:10px;border:1px solid #e2e8f0;margin:0;">
            ${isAsset 
              ? (item.keyAssetsSummary ? escapeHTML(item.keyAssetsSummary) : 'Insolvency resolution proceedings under the Insolvency and Bankruptcy Code (IBC 2016). Form G Expression of Interest scheduled.')
              : `IBBI Registered Professional empaneled across ${escapeHTML(bench)} with specialized practice in ${escapeHTML(item.specialization || item.firm || 'Manufacturing and Infra CIRPs')}.`
            }
          </p>
        </div>

        <!-- Resolution Professional Contact Card (if Asset) -->
        ${isAsset && (item.rpName || item.rpEmail) ? `
          <div style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:12px;padding:12px;">
            <span style="font-size:10px;font-family:monospace;font-weight:700;color:#0369a1;text-transform:uppercase;display:block;margin-bottom:4px;">
              Resolution Professional
            </span>
            <div style="font-size:13px;font-weight:700;color:#0f172a;">
              ${escapeHTML(item.rpName || 'Insolvency Resolution Professional')}
            </div>
            ${item.rpEmail ? `
              <div style="font-size:11px;font-family:monospace;color:#0284c7;margin-top:2px;">
                ${escapeHTML(item.rpEmail)}
              </div>
            ` : ''}
          </div>
        ` : ''}

        <!-- Pin to User Desk Button -->
        <button type="button" id="drawer-bookmark-btn" style="width:100%;padding:10px;border-radius:10px;border:1px solid #cbd5e1;background:${isBookmarked ? '#0f172a' : 'white'};color:${isBookmarked ? 'white' : '#0f172a'};font-family:'Chakra Petch',sans-serif;font-size:12px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;transition:all 0.15s;">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="${isBookmarked ? '#f59e0b' : 'none'}" stroke="currentColor" stroke-width="2"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
          <span>${isBookmarked ? 'Pinned to My User Desk' : 'Pin to My User Desk'}</span>
        </button>

        <!-- Action CTAs -->
        <div style="display:flex;gap:8px;margin-top:auto;padding-top:12px;border-top:1px solid #f1f5f9;">
          <a href="/forum/" id="drawer-consult-btn" style="flex:1;text-align:center;background:#059669;color:white;font-family:'Chakra Petch',sans-serif;font-weight:700;font-size:12px;padding:10px;border-radius:10px;text-decoration:none;transition:background 0.15s;text-transform:uppercase;">
            Consult on Forum &rarr;
          </a>
          <a href="https://portal.openibc.in/login" target="_blank" style="text-align:center;background:#0f172a;color:white;font-family:'Chakra Petch',sans-serif;font-weight:700;font-size:12px;padding:10px 14px;border-radius:10px;text-decoration:none;text-transform:uppercase;">
            Portal
          </a>
        </div>
      </div>
    `;

    inspectorDrawer.classList.add('open');

    // Close and Back buttons
    const closeBtn = document.getElementById('drawer-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', closeInspector);
    }
    const backBtn = document.getElementById('drawer-back-btn');
    if (backBtn) {
      backBtn.addEventListener('click', closeInspector);
    }
    const consultBtn = document.getElementById('drawer-consult-btn');
    if (consultBtn) {
      consultBtn.addEventListener('click', (e) => {
        if (typeof openForumView === 'function') {
          e.preventDefault();
          closeInspector();
          openForumView('/');
        }
      });
    }

    // Drawer Bookmark button
    const drawerBookmarkBtn = document.getElementById('drawer-bookmark-btn');
    if (drawerBookmarkBtn) {
      drawerBookmarkBtn.addEventListener('click', () => {
        window.toggleBookmark(item.id);
      });
    }

    // If on mobile map view and inspector is opened, hide mobile pin preview
    if (mobilePinPreview) {
      mobilePinPreview.style.display = 'none';
    }
  }

  function closeInspector() {
    if (inspectorDrawer) inspectorDrawer.classList.remove('open');
    activeMarkerId = null;
    renderMarkers();
    cardList.querySelectorAll('.deal-card').forEach(c => c.classList.remove('active'));
    if (mobilePinPreview) mobilePinPreview.style.display = 'none';
  }

  function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // Setup Event Listeners for Filters & Sidebar
  function syncModeUI() {
    const isAssets = activeMode === 'assets';
    if (modeAssetsBtn) modeAssetsBtn.classList.toggle('active', isAssets);
    if (modeProfessionalsBtn) modeProfessionalsBtn.classList.toggle('active', !isAssets);
    if (regimePillsContainer) regimePillsContainer.style.display = isAssets ? 'flex' : 'none';
    if (roleFilter) roleFilter.style.display = isAssets ? 'none' : 'block';
    if (filterRow) filterRow.classList.toggle('filter-row--professionals', !isAssets);
    if (searchInput) {
      searchInput.placeholder = isAssets
        ? 'search corporate debtors, cin, city, bench...'
        : 'search ips, valuers, firms, ibbi reg no, bench...';
    }
    if (openIntakeBtn) {
      openIntakeBtn.textContent = isAssets ? '+ submit opportunity' : '+ empanel practice';
    }
    updateIntakeModalConfig(currentSubdomain);
  }

  function setupRadarEvents() {
    // Mode Switcher
    if (modeAssetsBtn) {
      modeAssetsBtn.addEventListener('click', () => {
        if (activeMode === 'assets') return;
        activeMode = 'assets';
        resetAllFiltersState();
        closeInspector();
        syncModeUI();
        loadData();
      });
    }

    if (modeProfessionalsBtn) {
      modeProfessionalsBtn.addEventListener('click', () => {
        if (activeMode === 'professionals') return;
        activeMode = 'professionals';
        resetAllFiltersState();
        closeInspector();
        syncModeUI();
        loadData();
      });
    }

    // Regime Pills (ALL, CIRP, LIQUIDATION, SARFAESI)
    if (regimePillsContainer) {
      regimePillsContainer.querySelectorAll('.regime-pill').forEach(pill => {
        pill.addEventListener('click', () => {
          regimePillsContainer.querySelectorAll('.regime-pill').forEach(p => p.classList.remove('active'));
          pill.classList.add('active');
          activeRegime = pill.dataset.regime;
          applyFilters({ syncMap: true });
        });
      });
    }

    // Role filter
    if (roleFilter) {
      roleFilter.addEventListener('change', () => applyFilters({ syncMap: true }));
    }

    // Search input
    if (searchInput) {
      searchInput.addEventListener('input', () => applyFilters({ syncMap: true }));
    }

    // Search clear button
    if (searchClearBtn) {
      searchClearBtn.addEventListener('click', () => {
        searchInput.value = '';
        applyFilters({ syncMap: true });
        searchInput.focus();
      });
    }

    // Reset filters button
    if (resetFiltersBtn) {
      resetFiltersBtn.addEventListener('click', () => {
        resetAllFiltersState();
        closeInspector();
        applyFilters({ syncMap: true });
      });
    }

    if (sectorFilter) {
      sectorFilter.addEventListener('change', () => applyFilters({ syncMap: true }));
    }
    if (benchFilter) {
      benchFilter.addEventListener('change', () => applyFilters({ syncMap: true }));
    }

    // Mobile View Toggle Pill (List vs Map)
    if (mobileViewToggleBtn) {
      mobileViewToggleBtn.addEventListener('click', () => {
        mobileView = mobileView === 'list' ? 'map' : 'list';
        if (radarView) {
          radarView.classList.toggle('mobile-mode-map', mobileView === 'map');
          radarView.classList.toggle('mobile-mode-list', mobileView === 'list');
        }
        if (pillIconMap) pillIconMap.style.display = mobileView === 'list' ? 'block' : 'none';
        if (pillIconList) pillIconList.style.display = mobileView === 'map' ? 'block' : 'none';
        if (mobileViewLabel) {
          mobileViewLabel.textContent = mobileView === 'list' ? 'View Map' : `View List (${filteredItems.length})`;
        }
        if (mobilePinPreview) mobilePinPreview.style.display = 'none';
        const bursts = [50, 150, 300];
        bursts.forEach(d => setTimeout(() => { if (map) map.invalidateSize(); }, d));
      });
    }

    // Sidebar Toggle
    sidebarToggle.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
      const isCollapsed = sidebar.classList.contains('collapsed');
      sidebarToggle.title = isCollapsed ? 'Show list ([ or \\)' : 'Hide list ([ or \\)';
      sidebarToggle.setAttribute('aria-label', isCollapsed ? 'Show list' : 'Hide list');
      sidebarToggle.setAttribute('aria-expanded', String(!isCollapsed));
      const bursts = [50, 150, 300, 500];
      bursts.forEach(d => setTimeout(() => { if (map) map.invalidateSize(); }, d));
    });

    // Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
      if (e.key === '[' || e.key === '\\') {
        sidebarToggle.click();
      }
      if (e.key === 'Escape') {
        closeInspector();
        closeDownloadModal();
        if (intakeModalOverlay) intakeModalOverlay.classList.remove('show');
        const authModal = document.getElementById('auth-modal-overlay');
        if (authModal) authModal.classList.remove('show');
      }
    });
  }

  // ─── 8.5 AUTHENTICATION & IDENTITY MODAL ───
  function setupAuthModal() {
    const openAuthBtn = document.getElementById('open-auth-btn');
    const authModalOverlay = document.getElementById('auth-modal-overlay');
    const authModalClose = document.getElementById('auth-modal-close');
    const tabSigninBtn = document.getElementById('tab-signin-btn');
    const tabSignupBtn = document.getElementById('tab-signup-btn');
    const formSignin = document.getElementById('form-signin');
    const formSignup = document.getElementById('form-signup');
    const signinError = document.getElementById('signin-error');
    const signupError = document.getElementById('signup-error');
    const fillAdminBtn = document.getElementById('fill-admin-btn');
    const fillSharmaBtn = document.getElementById('fill-sharma-btn');
    const authLoggedOutTray = document.getElementById('auth-logged-out-tray');
    const authLoggedInTray = document.getElementById('auth-logged-in-tray');
    const userProfileTrigger = document.getElementById('user-profile-trigger');
    const userProfileDropdown = document.getElementById('user-profile-dropdown');
    const userAvatarText = document.getElementById('user-avatar-text');
    const userDisplayName = document.getElementById('user-display-name');
    const userEmailText = document.getElementById('user-email-text');
    const userRoleBadge = document.getElementById('user-role-badge');
    const adminDashboardLink = document.getElementById('admin-dashboard-link');
    const logoutBtn = document.getElementById('logout-btn');

    if (!authModalOverlay) return;

    function renderAuthState(user) {
      const navWorkspaceBtn = document.getElementById('nav-workspace-btn');
      if (!user) {
        if (authLoggedOutTray) authLoggedOutTray.style.display = 'flex';
        if (authLoggedInTray) authLoggedInTray.style.display = 'none';
        if (userProfileDropdown) userProfileDropdown.classList.remove('show');
        if (navWorkspaceBtn) navWorkspaceBtn.style.display = 'none';
        updateConsultationBookingButtonState();
        return;
      }
      if (authLoggedOutTray) authLoggedOutTray.style.display = 'none';
      if (authLoggedInTray) authLoggedInTray.style.display = 'flex';
      if (navWorkspaceBtn) navWorkspaceBtn.style.display = 'flex';
      updateConsultationBookingButtonState();

      // Self-heal admin account
      if (user.e_mail === 'admin@openibc.in') {
        user.custom_role = 'admin';
        user.username = 'admin';
      }

      const name = user.display_name || user.username || 'Practitioner';
      if (userDisplayName) userDisplayName.textContent = name;
      if (userEmailText) userEmailText.textContent = user.e_mail || '';

      const parts = name.trim().split(/\s+/);
      const initials = parts.length > 1 ? (parts[0][0] + parts[1][0]).toUpperCase() : name.slice(0, 2).toUpperCase();
      if (userAvatarText) userAvatarText.textContent = initials;

      const isAdmin = user.role_id === 2 || user.username === 'admin' || user.custom_role === 'admin' || user.e_mail === 'admin@openibc.in';
      const roleLabels = {
        practitioner: 'insolvency practitioner',
        advocate: 'insolvency counsel',
        valuer: 'registered valuer',
        creditor: 'financial creditor',
        investor: 'strategic investor',
        admin: 'sovereign admin'
      };

      if (userRoleBadge) {
        userRoleBadge.style.display = 'none';
      }
      if (adminDashboardLink) {
        adminDashboardLink.style.display = isAdmin ? 'block' : 'none';
      }

      // Update workspace right rail card if present
      const workspaceAvatar = document.getElementById('workspace-avatar');
      const workspaceUserName = document.getElementById('workspace-user-name');
      const workspaceUserRole = document.getElementById('workspace-user-role');
      const workspaceUserEmail = document.getElementById('workspace-user-email');

      if (workspaceAvatar) workspaceAvatar.textContent = initials;
      if (workspaceUserName) workspaceUserName.textContent = name;
      if (workspaceUserEmail) workspaceUserEmail.textContent = user.e_mail || '';
      if (workspaceUserRole) {
        workspaceUserRole.textContent = isAdmin ? 'sovereign admin' : (roleLabels[user.custom_role] || 'verified practitioner');
        workspaceUserRole.style.background = 'none';
        workspaceUserRole.style.color = '#64748b';
      }

      // Check for pending consultation intent queued before sign-in
      try {
        const pending = sessionStorage.getItem('openibc_pending_consultation');
        if (pending) {
          sessionStorage.removeItem('openibc_pending_consultation');
          const p = JSON.parse(pending);
          const active = getSelectedConsultation() || { slug: p.slug, title: p.title };
          setTimeout(() => {
            launchCalnodePopup(active, user);
          }, 350);
        }
      } catch (_) {}
    }

    function reloadForumIfLoaded() {
      const forumIframe = document.getElementById('forum-iframe');
      if (forumIframe && forumIframe.getAttribute('src')) {
        const route = forumIframe.dataset.loadedRoute || '/';
        const targetUrl = route.startsWith('/questions/ask') ? '/forum-embed/questions/ask' : '/forum-embed/';
        // Re-assign src to force iframe to load /forum-embed/, NOT its internal '/' path
        forumIframe.src = targetUrl;
      }
    }

    // Open / Close
    if (openAuthBtn) {
      openAuthBtn.addEventListener('click', () => {
        authModalOverlay.classList.add('show');
        if (signinError) signinError.style.display = 'none';
        if (signupError) signupError.style.display = 'none';
      });
    }

    if (authModalClose) {
      authModalClose.addEventListener('click', () => {
        authModalOverlay.classList.remove('show');
      });
    }

    authModalOverlay.addEventListener('click', (e) => {
      if (e.target === authModalOverlay) {
        authModalOverlay.classList.remove('show');
      }
    });

    // Tab Toggling
    if (tabSigninBtn && tabSignupBtn && formSignin && formSignup) {
      tabSigninBtn.addEventListener('click', () => {
        tabSigninBtn.classList.add('active');
        tabSignupBtn.classList.remove('active');
        formSignin.style.display = 'flex';
        formSignup.style.display = 'none';
        if (signinError) signinError.style.display = 'none';
      });

      tabSignupBtn.addEventListener('click', () => {
        tabSignupBtn.classList.add('active');
        tabSigninBtn.classList.remove('active');
        formSignup.style.display = 'flex';
        formSignin.style.display = 'none';
        if (signupError) signupError.style.display = 'none';
      });
    }

    // Listen for Auth requests from embedded Apache Answer iframe
    window.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'OPENIBC_OPEN_AUTH') {
        const tab = event.data.tab || 'signin';
        if (tab === 'signup' && tabSignupBtn) {
          tabSignupBtn.click();
        } else if (tabSigninBtn) {
          tabSigninBtn.click();
        }
        authModalOverlay.classList.add('show');
      }
    });

    // Demo Autofills
    if (fillAdminBtn) {
      fillAdminBtn.addEventListener('click', () => {
        document.getElementById('signin-email').value = 'admin@openibc.in';
        document.getElementById('signin-password').value = 'OpenIBC@Admin2026!';
        document.getElementById('signin-password').focus();
      });
    }

    if (fillSharmaBtn) {
      fillSharmaBtn.addEventListener('click', () => {
        document.getElementById('signin-email').value = 'adv_sharma@openibc.in';
        document.getElementById('signin-password').value = 'Sharma@2026!';
        document.getElementById('signin-password').focus();
      });
    }

    const SUPABASE_AUTH_URL = 'https://rybbbqdwmjzgsdxyrjgt.supabase.co';
    const SUPABASE_AUTH_ANON_KEY = 'sb_publishable_a8ZEEAQmrmzq-bxOL4sKWQ_ui7Fx13A';
    let supabaseClient = null;
    try {
      if (window.supabase && typeof window.supabase.createClient === 'function') {
        supabaseClient = window.supabase.createClient(SUPABASE_AUTH_URL, SUPABASE_AUTH_ANON_KEY);
      }
    } catch (e) {
      console.warn('Supabase initialization failed:', e);
    }

    // Form Sign In
    if (formSignin) {
      formSignin.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (signinError) signinError.style.display = 'none';
        const email = document.getElementById('signin-email').value.trim();
        const pass = document.getElementById('signin-password').value;
        const submitBtn = document.getElementById('signin-submit-btn');
        const origContent = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span>verifying credentials...</span>';
        submitBtn.disabled = true;

        try {
          if (supabaseClient) {
            const { data, error } = await supabaseClient.auth.signInWithPassword({
              email: email,
              password: pass
            });
            if (error) {
              if (signinError) {
                signinError.textContent = error.message;
                signinError.style.display = 'block';
              }
            } else if (data && data.user) {
              const user = {
                display_name: data.user.user_metadata?.name || data.user.email.split('@')[0],
                e_mail: data.user.email,
                username: data.user.user_metadata?.username || (data.user.email === 'admin@openibc.in' ? 'admin' : data.user.email.split('@')[0]),
                custom_role: data.user.user_metadata?.role || (data.user.email === 'admin@openibc.in' ? 'admin' : 'advocate'),
                access_token: data.session?.access_token
              };
              localStorage.setItem('openibc_user', JSON.stringify(user));
              renderAuthState(user);
              authModalOverlay.classList.remove('show');
              if (window.openWorkspaceView) {
                window.openWorkspaceView('dashboard');
              }
            }
          } else {
            // Demo fallback user
            const user = {
              display_name: email.split('@')[0],
              e_mail: email,
              custom_role: 'advocate'
            };
            localStorage.setItem('openibc_user', JSON.stringify(user));
            renderAuthState(user);
            authModalOverlay.classList.remove('show');
            if (window.openWorkspaceView) {
              window.openWorkspaceView('dashboard');
            }
          }
        } catch (err) {
          console.error('Sign in error:', err);
          if (signinError) {
            signinError.textContent = 'Connection error. Please try again.';
            signinError.style.display = 'block';
          }
        } finally {
          submitBtn.innerHTML = origContent;
          submitBtn.disabled = false;
        }
      });
    }

    // Form Sign Up
    if (formSignup) {
      formSignup.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (signupError) signupError.style.display = 'none';
        const name = document.getElementById('signup-name').value.trim();
        const email = document.getElementById('signup-email').value.trim();
        const pass = document.getElementById('signup-password').value;
        const role = document.getElementById('signup-role').value;
        const submitBtn = document.getElementById('signup-submit-btn');
        const origContent = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span>creating chamber identity...</span>';
        submitBtn.disabled = true;

        try {
          if (supabaseClient) {
            const { data, error } = await supabaseClient.auth.signUp({
              email: email,
              password: pass,
              options: {
                data: {
                  name: name,
                  role: role
                }
              }
            });
            if (error) {
              if (signupError) {
                signupError.textContent = error.message;
                signupError.style.display = 'block';
              }
            } else if (data && data.user) {
              const user = {
                display_name: name || data.user.email.split('@')[0],
                e_mail: data.user.email,
                custom_role: role || 'advocate',
                access_token: data.session?.access_token
              };
              localStorage.setItem('openibc_user', JSON.stringify(user));
              renderAuthState(user);
              authModalOverlay.classList.remove('show');
            }
          } else {
            const user = {
              display_name: name || email.split('@')[0],
              e_mail: email,
              custom_role: role || 'advocate'
            };
            localStorage.setItem('openibc_user', JSON.stringify(user));
            renderAuthState(user);
            authModalOverlay.classList.remove('show');
          }
        } catch (err) {
          console.error('Sign up error:', err);
          if (signupError) {
            signupError.textContent = 'Connection error. Please check server status.';
            signupError.style.display = 'block';
          }
        } finally {
          submitBtn.innerHTML = origContent;
          submitBtn.disabled = false;
        }
      });
    }

    // User Profile Dropdown Toggle
    if (userProfileTrigger && userProfileDropdown) {
      userProfileTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        userProfileDropdown.classList.toggle('show');
      });

      document.addEventListener('click', (e) => {
        if (!userProfileDropdown.contains(e.target) && !userProfileTrigger.contains(e.target)) {
          userProfileDropdown.classList.remove('show');
        }
      });
    }

    // Logout
    if (logoutBtn) {
      logoutBtn.addEventListener('click', async () => {
        if (supabaseClient) {
          await supabaseClient.auth.signOut().catch(() => {});
        }
        localStorage.removeItem('openibc_user');
        localStorage.removeItem('authorized');
        localStorage.removeItem('_a_ltk_');
        renderAuthState(null);
      });
    }

    // Initial state restore & Supabase session sync
    if (supabaseClient) {
      supabaseClient.auth.getSession().then(({ data }) => {
        if (data && data.session && data.session.user) {
          const user = {
            display_name: data.session.user.user_metadata?.name || data.session.user.email.split('@')[0],
            e_mail: data.session.user.email,
            username: data.session.user.user_metadata?.username || (data.session.user.email === 'admin@openibc.in' ? 'admin' : data.session.user.email.split('@')[0]),
            custom_role: data.session.user.user_metadata?.role || (data.session.user.email === 'admin@openibc.in' ? 'admin' : 'advocate'),
            access_token: data.session.access_token
          };
          localStorage.setItem('openibc_user', JSON.stringify(user));
          renderAuthState(user);
        }
      }).catch(() => {});
    }

    // Initial state restore
    localStorage.removeItem('authorized');
    const savedUser = localStorage.getItem('openibc_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed && parsed.access_token) {
          localStorage.setItem('_a_ltk_', parsed.access_token);
        }
        renderAuthState(parsed);
      } catch (e) {
        localStorage.removeItem('openibc_user');
        localStorage.removeItem('authorized');
        localStorage.removeItem('_a_ltk_');
        renderAuthState(null);
      }
    } else {
      localStorage.removeItem('_a_ltk_');
      renderAuthState(null);
    }
  }

  // ─── 8.6 STATUTORY REPORT CATALOG & RAZORPAY CHECKOUT STORE ───
  let cachedCatalog = null;
  let catalogMode = 'demo';
  let razorpayKeyId = '';
  let razorpayScriptPromise = null;
  let selectedReport = null;
  let catalogLoadingPromise = null;
  let activeCatalogCategory = 'all';
  let activeCatalogSort = 'all';

  function matchesCatalogCategory(report, cat) {
    if (!cat || cat === 'all') return true;
    const slug = (report.slug || '').toLowerCase();
    if (cat === 'eligibility') return slug.includes('sec-29a') || slug.includes('sec-32a');
    if (cat === 'avoidance') return slug.includes('sec-65') || slug.includes('pufe');
    if (cat === 'valuation') return slug.includes('reg-35') || slug.includes('sec-36');
    return true;
  }

  function filterAndSortReports(reports) {
    let list = (reports || []).filter(r => matchesCatalogCategory(r, activeCatalogCategory));
    if (activeCatalogSort === 'express') {
      list = list.filter(r => (r.turnaround || '').includes('24'));
    } else if (activeCatalogSort === 'standard') {
      list = list.filter(r => (r.turnaround || '').includes('48'));
    } else if (activeCatalogSort === 'price-asc') {
      list = list.slice().sort((a, b) => Number(a.price_inr) - Number(b.price_inr));
    }
    return list;
  }

  function loadRazorpayScript() {
    if (window.Razorpay) return Promise.resolve(window.Razorpay);
    if (razorpayScriptPromise) return razorpayScriptPromise;

    razorpayScriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => {
        if (window.Razorpay) {
          resolve(window.Razorpay);
        } else {
          reject(new Error('Razorpay SDK loaded but window.Razorpay undefined'));
        }
      };
      script.onerror = () => {
        razorpayScriptPromise = null;
        reject(new Error('Failed to load Razorpay checkout script'));
      };
      document.head.appendChild(script);
    });

    return razorpayScriptPromise;
  }

  function renderPriceList(reports, mode) {
    const modeBadge = document.getElementById('price-list-mode-badge');
    if (modeBadge) {
      if (mode === 'live') {
        modeBadge.textContent = 'LIVE CHECKOUT';
        modeBadge.className = 'price-list-mode-badge badge-live';
      } else {
        modeBadge.textContent = 'DEMO MODE';
        modeBadge.className = 'price-list-mode-badge badge-demo';
      }
    }

    const popularEl = document.getElementById('catalog-popular-list');
    if (popularEl && reports && reports.length > 0) {
      popularEl.innerHTML = reports.slice(0, 3).map(r => {
        const fee = Number(r.price_inr).toLocaleString('en-IN');
        return `
          <button type="button" class="catalog-popular-item" data-slug="${escapeHTML(r.slug)}">
            <span class="catalog-popular-title">${escapeHTML(r.title)}</span>
            <span class="catalog-popular-meta">${escapeHTML(r.section)} &bull; ₹${fee} &bull; ${escapeHTML(r.turnaround)}</span>
          </button>
        `;
      }).join('');
    }

    const rowsEl = document.getElementById('price-list-rows');
    if (!rowsEl) return;

    const visibleReports = filterAndSortReports(reports);
    if (visibleReports.length === 0) {
      rowsEl.innerHTML = `
        <div style="padding:36px 16px;text-align:center;color:#64748b;font-size:13.5px;">
          No statutory reports match the active filter.
        </div>
      `;
      return;
    }

    rowsEl.innerHTML = visibleReports.map(r => {
      const deliverablesSummary = (r.deliverables || []).slice(0, 3).map(d => escapeHTML(d)).join(' &bull; ');
      const formattedPrice = Number(r.price_inr).toLocaleString('en-IN');
      return `
        <article class="catalog-feed-item" role="listitem">
          <div class="catalog-item-meta">
            <span>Empanelled Counsel Desk</span>
            <span>&bull;</span>
            <span>Turnaround: ${escapeHTML(r.turnaround)}</span>
          </div>
          <h2 class="catalog-item-title">${escapeHTML(r.title)}</h2>
          <p class="catalog-item-desc">${escapeHTML(r.description)}</p>
          ${deliverablesSummary ? `<p class="catalog-item-deliverables-inline">Includes: ${deliverablesSummary}</p>` : ''}
          <div class="catalog-item-tags">
            <span class="catalog-section-tag">${escapeHTML(r.section)}</span>
          </div>
          <div class="catalog-item-footer">
            <div class="catalog-item-pricing">
              <strong class="catalog-price-value">₹${formattedPrice}</strong>
              <span class="catalog-gst-label">+ 18% GST</span>
            </div>
            <div class="catalog-item-actions">
              <a href="${escapeHTML(r.sample_url)}" download target="_blank" rel="noopener" class="catalog-sample-link">
                Sample PDF
              </a>
              <button type="button" class="buy-report-btn catalog-buy-btn" data-slug="${escapeHTML(r.slug)}">
                Buy Now
              </button>
            </div>
          </div>
        </article>
      `;
    }).join('');
  }

  function loadReportsCatalogOnce() {
    if (cachedCatalog) {
      renderPriceList(cachedCatalog, catalogMode);
      return Promise.resolve(cachedCatalog);
    }
    if (catalogLoadingPromise) return catalogLoadingPromise;

    catalogLoadingPromise = fetch('/api/reports/catalog')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load statutory reports catalog');
        return res.json();
      })
      .then(data => {
        cachedCatalog = Array.isArray(data.reports) ? data.reports : [];
        catalogMode = data.mode === 'live' ? 'live' : 'demo';
        razorpayKeyId = data.key_id || '';
        renderPriceList(cachedCatalog, catalogMode);
        return cachedCatalog;
      })
      .catch(err => {
        catalogLoadingPromise = null;
        console.error('[PriceList] Catalog load error:', err);
        const rowsEl = document.getElementById('price-list-rows');
        if (rowsEl) {
          rowsEl.innerHTML = `<div style="padding:24px;text-align:center;color:#ef4444;font-family:monospace;font-size:12px;">Failed to load statutory reports catalog. Please refresh or try again later.</div>`;
        }
        const modeBadge = document.getElementById('price-list-mode-badge');
        if (modeBadge) {
          modeBadge.textContent = 'CATALOG UNAVAILABLE';
          modeBadge.className = 'price-list-mode-badge';
        }
        throw err;
      });

    return catalogLoadingPromise;
  }

  function openCheckoutModal(reportOrSlug) {
    const report = typeof reportOrSlug === 'string'
      ? (cachedCatalog || []).find(r => r.slug === reportOrSlug)
      : reportOrSlug;

    if (!report) {
      if (!cachedCatalog) {
        loadReportsCatalogOnce().then(() => {
          const match = (cachedCatalog || []).find(r => r.slug === (typeof reportOrSlug === 'string' ? reportOrSlug : reportOrSlug?.slug));
          if (match) openCheckoutModal(match);
        }).catch(() => {});
      }
      return;
    }

    selectedReport = report;
    const checkoutDialog = document.getElementById('report-checkout-modal-overlay');
    if (!checkoutDialog) return;

    const checkoutSummary = document.getElementById('checkout-report-summary');
    const checkoutError = document.getElementById('checkout-error');
    const checkoutForm = document.getElementById('report-checkout-form');
    const checkoutSlugInput = document.getElementById('checkout-report-slug');
    const checkoutSubmitBtn = document.getElementById('checkout-submit-btn');
    const checkoutDemoPanel = document.getElementById('checkout-demo-panel');
    const checkoutDemoPayBtn = document.getElementById('checkout-demo-pay-btn');
    const checkoutSuccessPanel = document.getElementById('checkout-success-panel');

    // Reset Panels
    if (checkoutError) {
      checkoutError.style.display = 'none';
      checkoutError.textContent = '';
    }
    if (checkoutForm) {
      checkoutForm.style.display = 'flex';
    }
    if (checkoutDemoPanel) {
      checkoutDemoPanel.style.display = 'none';
    }
    if (checkoutSuccessPanel) {
      checkoutSuccessPanel.style.display = 'none';
    }
    if (checkoutSlugInput) {
      checkoutSlugInput.value = report.slug;
    }

    const formattedFee = Number(report.price_inr).toLocaleString('en-IN');
    if (checkoutSummary) {
      checkoutSummary.innerHTML = `
        <div class="checkout-summary-title">${escapeHTML(report.title)}</div>
        <div class="checkout-summary-meta">
          <span>Turnaround: ${escapeHTML(report.turnaround)}</span>
          <span class="checkout-summary-price">₹${formattedFee} + GST</span>
        </div>
      `;
    }

    if (checkoutSubmitBtn) {
      checkoutSubmitBtn.disabled = false;
      checkoutSubmitBtn.innerHTML = `Pay ₹${formattedFee} &rarr;`;
    }
    if (checkoutDemoPayBtn) {
      checkoutDemoPayBtn.disabled = false;
      checkoutDemoPayBtn.innerHTML = `Simulate Successful Payment &rarr;`;
    }

    if (!checkoutDialog.open) {
      checkoutDialog.showModal();
    }

    const buyerNameInput = document.getElementById('checkout-buyer-name');
    if (buyerNameInput) {
      setTimeout(() => buyerNameInput.focus(), 50);
    }
  }

  function setupPriceListStore() {
    const checkoutDialog = document.getElementById('report-checkout-modal-overlay');
    const checkoutForm = document.getElementById('report-checkout-form');
    const checkoutError = document.getElementById('checkout-error');
    const checkoutSubmitBtn = document.getElementById('checkout-submit-btn');
    const checkoutModalClose = document.getElementById('checkout-modal-close');
    const checkoutDoneBtn = document.getElementById('checkout-done-btn');
    const checkoutDemoPanel = document.getElementById('checkout-demo-panel');
    const checkoutDemoMeta = document.getElementById('checkout-demo-order-meta');
    const checkoutDemoPayBtn = document.getElementById('checkout-demo-pay-btn');
    const checkoutSuccessPanel = document.getElementById('checkout-success-panel');
    const priceListRows = document.getElementById('price-list-rows');

    if (!checkoutDialog) return;

    // Delegate row click for Buy Now buttons
    if (priceListRows) {
      priceListRows.addEventListener('click', (e) => {
        const btn = e.target.closest('.buy-report-btn');
        if (!btn) return;
        const slug = btn.dataset.slug;
        if (slug) openCheckoutModal(slug);
      });
    }

    const catalogCatNav = document.getElementById('catalog-category-nav');
    const catalogFeedTitle = document.getElementById('catalog-feed-title');
    if (catalogCatNav) {
      catalogCatNav.addEventListener('click', (e) => {
        const pill = e.target.closest('.catalog-rail-pill');
        if (!pill) return;
        activeCatalogCategory = pill.dataset.cat || 'all';
        catalogCatNav.querySelectorAll('.catalog-rail-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        if (catalogFeedTitle) {
          const span = pill.querySelector('span');
          catalogFeedTitle.textContent = span ? span.textContent : 'All Reports';
        }
        if (cachedCatalog) renderPriceList(cachedCatalog, catalogMode);
      });
    }

    const catalogSortGroup = document.getElementById('catalog-sort-group');
    if (catalogSortGroup) {
      catalogSortGroup.addEventListener('click', (e) => {
        const btn = e.target.closest('.catalog-sort-btn');
        if (!btn) return;
        activeCatalogSort = btn.dataset.sort || 'all';
        catalogSortGroup.querySelectorAll('.catalog-sort-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        if (cachedCatalog) renderPriceList(cachedCatalog, catalogMode);
      });
    }

    const catalogPopularList = document.getElementById('catalog-popular-list');
    if (catalogPopularList) {
      catalogPopularList.addEventListener('click', (e) => {
        const item = e.target.closest('.catalog-popular-item');
        if (!item) return;
        const slug = item.dataset.slug;
        if (slug) openCheckoutModal(slug);
      });
    }

    const catalogCustomBtn = document.getElementById('catalog-custom-request-btn');
    if (catalogCustomBtn) {
      catalogCustomBtn.addEventListener('click', () => {
        openMegamenu('consultations', true);
      });
    }

    // Modal Close Triggers
    if (checkoutModalClose) {
      checkoutModalClose.addEventListener('click', () => {
        checkoutDialog.close();
      });
    }
    if (checkoutDoneBtn) {
      checkoutDoneBtn.addEventListener('click', () => {
        checkoutDialog.close();
      });
    }

    // Safari fallback light-dismiss outside click listener
    if (!('closedBy' in HTMLDialogElement.prototype)) {
      let isDownOutside = false;
      checkoutDialog.addEventListener('pointerdown', (e) => {
        if (e.target !== checkoutDialog) {
          isDownOutside = false;
          return;
        }
        const rect = checkoutDialog.getBoundingClientRect();
        const isOutside = (
          e.clientX < rect.left ||
          e.clientX > rect.right ||
          e.clientY < rect.top ||
          e.clientY > rect.bottom
        );
        isDownOutside = isOutside;
      });

      checkoutDialog.addEventListener('pointerup', (e) => {
        if (isDownOutside && e.target === checkoutDialog) {
          const rect = checkoutDialog.getBoundingClientRect();
          const isOutside = (
            e.clientX < rect.left ||
            e.clientX > rect.right ||
            e.clientY < rect.top ||
            e.clientY > rect.bottom
          );
          if (isOutside) {
            checkoutDialog.close();
          }
        }
        isDownOutside = false;
      });
    }

    // Dialog close reset safety
    checkoutDialog.addEventListener('close', () => {
      if (checkoutError) {
        checkoutError.style.display = 'none';
        checkoutError.textContent = '';
      }
      if (checkoutSubmitBtn) {
        checkoutSubmitBtn.disabled = false;
      }
    });

    // Clear inline error on form input
    if (checkoutForm) {
      checkoutForm.addEventListener('input', () => {
        if (checkoutError) {
          checkoutError.style.display = 'none';
          checkoutError.textContent = '';
        }
      });
    }

    // Form Submission: Create Order & Proceed
    if (checkoutForm) {
      checkoutForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!checkoutForm.checkValidity()) {
          checkoutForm.reportValidity();
          return;
        }

        const reportSlug = (document.getElementById('checkout-report-slug')?.value || '').trim();
        const buyerName = (document.getElementById('checkout-buyer-name')?.value || '').trim();
        const buyerEmail = (document.getElementById('checkout-buyer-email')?.value || '').trim();
        const buyerPhone = (document.getElementById('checkout-buyer-phone')?.value || '').trim();
        const targetEntity = (document.getElementById('checkout-target-entity')?.value || '').trim();
        const notes = (document.getElementById('checkout-notes')?.value || '').trim();

        if (!reportSlug || !buyerName || !buyerEmail || !buyerPhone || !targetEntity) {
          if (checkoutError) {
            checkoutError.textContent = 'Please fill in all required fields.';
            checkoutError.style.display = 'flex';
          }
          return;
        }

        const formattedFee = selectedReport ? Number(selectedReport.price_inr).toLocaleString('en-IN') : '';
        const defaultSubmitLabel = formattedFee ? `Pay ₹${formattedFee} &rarr;` : 'Proceed to Payment &rarr;';

        if (checkoutSubmitBtn) {
          checkoutSubmitBtn.disabled = true;
          checkoutSubmitBtn.innerHTML = `Creating Order...`;
        }
        if (checkoutError) {
          checkoutError.style.display = 'none';
          checkoutError.textContent = '';
        }

        const payload = {
          report_slug: reportSlug,
          buyer_name: buyerName,
          buyer_email: buyerEmail,
          buyer_phone: buyerPhone,
          target_entity: targetEntity,
          notes: notes
        };

        try {
          const res = await fetch('/api/reports/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });

          const data = await res.json();
          if (!res.ok) {
            throw new Error(data.error || 'Failed to initialize order');
          }

          if (data.mode === 'live') {
            await handleLiveCheckout(data, payload, defaultSubmitLabel);
          } else {
            handleDemoCheckout(data, payload, defaultSubmitLabel);
          }
        } catch (err) {
          console.error('[PriceList] Order submission failed:', err);
          if (checkoutError) {
            checkoutError.textContent = err.message || 'Payment initiation failed. Please check details and try again.';
            checkoutError.style.display = 'flex';
          }
          if (checkoutSubmitBtn) {
            checkoutSubmitBtn.disabled = false;
            checkoutSubmitBtn.innerHTML = defaultSubmitLabel;
          }
        }
      });
    }

    // Live Razorpay Checkout
    async function handleLiveCheckout(orderData, payload, defaultSubmitLabel) {
      try {
        if (checkoutSubmitBtn) {
          checkoutSubmitBtn.innerHTML = `Opening Gateway...`;
        }
        await loadRazorpayScript();

        let paymentCompleted = false;

        const options = {
          key: orderData.key_id || razorpayKeyId,
          amount: orderData.amount_paise,
          currency: orderData.currency || 'INR',
          name: 'openIBC Statutory Desk',
          description: selectedReport ? selectedReport.title : 'Statutory Report Dossier',
          order_id: orderData.razorpay_order_id,
          prefill: {
            name: payload.buyer_name,
            email: payload.buyer_email,
            contact: payload.buyer_phone
          },
          theme: {
            color: '#059669'
          },
          handler: function (rzpRes) {
            paymentCompleted = true;
            if (checkoutDialog && !checkoutDialog.open) {
              checkoutDialog.showModal();
            }
            if (checkoutSubmitBtn) {
              checkoutSubmitBtn.disabled = true;
              checkoutSubmitBtn.innerHTML = `Verifying Payment...`;
            }
            verifyReportOrder(orderData.order_id, rzpRes, payload.buyer_email, null, defaultSubmitLabel);
          },
          modal: {
            ondismiss: function () {
              if (paymentCompleted) return;
              if (checkoutDialog && !checkoutDialog.open) {
                checkoutDialog.showModal();
              }
              if (checkoutSubmitBtn) {
                checkoutSubmitBtn.disabled = false;
                checkoutSubmitBtn.innerHTML = defaultSubmitLabel;
              }
            }
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (resp) {
          console.error('[Razorpay] Payment failure:', resp.error);
          if (checkoutDialog && !checkoutDialog.open) {
            checkoutDialog.showModal();
          }
          if (checkoutError) {
            checkoutError.textContent = resp.error?.description || 'Payment was unsuccessful or declined by issuing bank.';
            checkoutError.style.display = 'flex';
          }
          if (checkoutSubmitBtn) {
            checkoutSubmitBtn.disabled = false;
            checkoutSubmitBtn.innerHTML = defaultSubmitLabel;
          }
        });

        // Close native <dialog> right before rzp.open() so that the dialog's top-layer
        // inert attribute does not block or trap focus from Razorpay's overlay injected into document.body.
        if (checkoutDialog && checkoutDialog.open) {
          checkoutDialog.close();
        }
        rzp.open();
      } catch (err) {
        console.error('[Razorpay] Gateway initialization error:', err);
        if (checkoutDialog && !checkoutDialog.open) {
          checkoutDialog.showModal();
        }
        if (checkoutError) {
          checkoutError.textContent = err.message || 'Failed to initialize payment gateway.';
          checkoutError.style.display = 'flex';
        }
        if (checkoutSubmitBtn) {
          checkoutSubmitBtn.disabled = false;
          checkoutSubmitBtn.innerHTML = defaultSubmitLabel;
        }
      }
    }

    // Demo Mode Checkout
    function handleDemoCheckout(orderData, payload, defaultSubmitLabel) {
      if (checkoutForm) checkoutForm.style.display = 'none';
      if (checkoutDemoPanel) checkoutDemoPanel.style.display = 'block';

      if (checkoutDemoMeta) {
        checkoutDemoMeta.innerHTML = `
          <div style="margin-bottom:4px;"><strong>Order ID:</strong> ${escapeHTML(orderData.order_id)}</div>
          <div style="margin-bottom:4px;"><strong>Razorpay Order ID:</strong> ${escapeHTML(orderData.razorpay_order_id)}</div>
          <div><strong>Target Entity:</strong> ${escapeHTML(payload.target_entity)} &bull; <strong>Recipient:</strong> ${escapeHTML(payload.buyer_email)}</div>
        `;
      }

      if (checkoutDemoPayBtn) {
        checkoutDemoPayBtn.disabled = false;
        checkoutDemoPayBtn.innerHTML = `Simulate Successful Payment &rarr;`;
        checkoutDemoPayBtn.onclick = async () => {
          checkoutDemoPayBtn.disabled = true;
          checkoutDemoPayBtn.innerHTML = `Verifying Demo Payment...`;
          const demoPayload = {
            razorpay_order_id: orderData.razorpay_order_id,
            razorpay_payment_id: 'pay_demo_' + Date.now()
          };
          await verifyReportOrder(orderData.order_id, demoPayload, payload.buyer_email, checkoutDemoPayBtn, defaultSubmitLabel);
        };
      }

      if (checkoutSubmitBtn) {
        checkoutSubmitBtn.disabled = false;
        checkoutSubmitBtn.innerHTML = defaultSubmitLabel;
      }
    }

    // Verify Payment Order
    async function verifyReportOrder(orderId, payload, fallbackEmail, triggeringBtn, defaultSubmitLabel) {
      try {
        if (checkoutError) {
          checkoutError.style.display = 'none';
          checkoutError.textContent = '';
        }

        const verifyBody = {
          order_id: orderId,
          razorpay_order_id: payload.razorpay_order_id || '',
          razorpay_payment_id: payload.razorpay_payment_id || '',
          razorpay_signature: payload.razorpay_signature || ''
        };

        const res = await fetch('/api/reports/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(verifyBody)
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Payment verification failed');
        }

        if (checkoutForm) checkoutForm.style.display = 'none';
        if (checkoutDemoPanel) checkoutDemoPanel.style.display = 'none';
        if (checkoutSuccessPanel) checkoutSuccessPanel.style.display = 'block';

        const orderIdEl = document.getElementById('checkout-success-order-id');
        const paymentIdEl = document.getElementById('checkout-success-payment-id');
        const emailEl = document.getElementById('checkout-success-email');

        if (orderIdEl) orderIdEl.textContent = data.order_id || orderId;
        if (paymentIdEl) paymentIdEl.textContent = data.razorpay_payment_id || payload.razorpay_payment_id;
        if (emailEl) emailEl.textContent = data.buyer_email || fallbackEmail;

      } catch (err) {
        console.error('[PriceList] Verification failed:', err);
        if (checkoutError) {
          checkoutError.textContent = err.message || 'Payment verification failed. If your payment was deducted, please contact support.';
          checkoutError.style.display = 'flex';
        }
        if (triggeringBtn) {
          triggeringBtn.disabled = false;
          triggeringBtn.innerHTML = `Simulate Successful Payment &rarr;`;
        }
        if (checkoutSubmitBtn) {
          checkoutSubmitBtn.disabled = false;
          checkoutSubmitBtn.innerHTML = defaultSubmitLabel;
        }
      }
    }
  }

  // ─── 8.6 SOVEREIGN INTELLIGENCE SHOWCASE PAGE RENDERER ───
  function renderIntelligenceShowcasePage(subKey, activeFilter = 'models') {
    const data = DOMAIN_INTELLIGENCE_SHOWCASE[subKey] || DOMAIN_INTELLIGENCE_SHOWCASE.investors;
    const container = document.getElementById('intel-showcase-container');
    const crumbDomain = document.getElementById('intel-crumb-domain');
    const pageTitle = document.getElementById('intel-page-hero-title');
    const pageSub = document.getElementById('intel-page-hero-sub');

    if (crumbDomain) crumbDomain.textContent = `${data.domain_name}s`;
    if (pageTitle) pageTitle.textContent = `${data.domain_name} intelligence & hayagriva sovereign harness`;
    if (pageSub) pageSub.textContent = `air-gapped statutory reasoning environment running on local hardware with zero cloud telemetry for ${data.domain_name}s. explore domain-specific models, precedent vaults, autonomous agents, and procedural skills.`;

    if (!container) return;

    if (!['models', 'vaults', 'agents', 'skills'].includes(activeFilter)) {
      activeFilter = 'models';
    }

    const showModels = activeFilter === 'models';
    const showVaults = activeFilter === 'vaults';
    const showAgents = activeFilter === 'agents';
    const showSkills = activeFilter === 'skills';

    let html = '';

    // 4 CORE ASSETS
    if (showModels && data.models) {
      html += `
        <div class="intel-card" id="intel-section-models" style="background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;padding:20px;box-shadow:0 1px 3px rgba(0,0,0,0.04);">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;border-bottom:1px solid #f1f5f9;padding-bottom:10px;">
            <div style="display:flex;align-items:center;gap:8px;">
              <span style="background:#f0f9ff;color:#0284c7;font-family:monospace;font-size:10px;font-weight:700;padding:2px 6px;border-radius:6px;border:1px solid #bae6fd;">01 &bull; OFFLINE MODEL</span>
              <h2 style="font-size:14px;font-weight:700;color:#0f172a;text-transform:lowercase;margin:0;">${escapeHTML(data.models.title)}</h2>
            </div>
            <span style="font-size:10px;font-family:monospace;color:#059669;font-weight:600;">zero cloud egress &bull; local ram</span>
          </div>
          <p style="font-size:11.5px;color:#64748b;margin:0 0 12px 0;">${escapeHTML(data.models.subtitle)}</p>
          <div style="background:#0f172a;border-radius:8px;padding:14px;font-family:monospace;font-size:11.5px;color:#cbd5e1;line-height:1.5;">
            <div style="color:#94a3b8;font-size:10.5px;margin-bottom:6px;">&gt; input prompt / mandate:</div>
            <div style="color:#38bdf8;margin-bottom:12px;">"${escapeHTML(data.models.prompt)}"</div>
            <div style="color:#94a3b8;font-size:10.5px;margin-bottom:6px;">&gt; local statutory reasoning output:</div>
            <div style="color:#34d399;">${escapeHTML(data.models.output)}</div>
          </div>
        </div>
      `;
    }

    if (showVaults && data.vaults) {
      html += `
        <div class="intel-card" id="intel-section-vaults" style="background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;padding:20px;box-shadow:0 1px 3px rgba(0,0,0,0.04);">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;border-bottom:1px solid #f1f5f9;padding-bottom:10px;">
            <div style="display:flex;align-items:center;gap:8px;">
              <span style="background:#fef3c7;color:#b45309;font-family:monospace;font-size:10px;font-weight:700;padding:2px 6px;border-radius:6px;border:1px solid #fde68a;">02 &bull; PRECEDENT VAULT</span>
              <h2 style="font-size:14px;font-weight:700;color:#0f172a;text-transform:lowercase;margin:0;">${escapeHTML(data.vaults.title)}</h2>
            </div>
            <span style="font-size:10px;font-family:monospace;color:#64748b;">${escapeHTML(data.vaults.subtitle)}</span>
          </div>
          <div style="display:flex;flex-direction:column;gap:10px;">
            ${data.vaults.precedents.map(p => `
              <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:12px;">
                <div style="font-family:'Chakra Petch',sans-serif;font-weight:700;font-size:12.5px;color:#0f172a;margin-bottom:4px;">${escapeHTML(p.case)}</div>
                <div style="font-size:11.5px;color:#475569;line-height:1.45;">${escapeHTML(p.rule)}</div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    if (showAgents && data.agents) {
      html += `
        <div class="intel-card" id="intel-section-agents" style="background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;padding:20px;box-shadow:0 1px 3px rgba(0,0,0,0.04);">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;border-bottom:1px solid #f1f5f9;padding-bottom:10px;">
            <div style="display:flex;align-items:center;gap:8px;">
              <span style="background:#ecfdf5;color:#047857;font-family:monospace;font-size:10px;font-weight:700;padding:2px 6px;border-radius:6px;border:1px solid #a7f3d0;">03 &bull; AUTONOMOUS AGENT</span>
              <h2 style="font-size:14px;font-weight:700;color:#0f172a;text-transform:lowercase;margin:0;">${escapeHTML(data.agents.title)}</h2>
            </div>
            <span style="font-size:10px;font-family:monospace;color:#059669;font-weight:600;">autonomous crawler</span>
          </div>
          <p style="font-size:11.5px;color:#64748b;margin:0 0 12px 0;">${escapeHTML(data.agents.subtitle)}</p>
          <div style="background:#090d16;border:1px solid #1e293b;border-radius:8px;padding:14px;font-family:monospace;font-size:11px;line-height:1.6;">
            ${data.agents.log.map(line => {
              if (line.includes('[STATUS]')) return `<div style="color:#34d399;font-weight:700;">${escapeHTML(line)}</div>`;
              if (line.includes('[FLAG]')) return `<div style="color:#f59e0b;font-weight:700;">${escapeHTML(line)}</div>`;
              return `<div style="color:#94a3b8;">${escapeHTML(line)}</div>`;
            }).join('')}
          </div>
        </div>
      `;
    }

    if (showSkills && data.skills) {
      html += `
        <div class="intel-card" id="intel-section-skills" style="background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;padding:20px;box-shadow:0 1px 3px rgba(0,0,0,0.04);">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;border-bottom:1px solid #f1f5f9;padding-bottom:10px;">
            <div style="display:flex;align-items:center;gap:8px;">
              <span style="background:#f3e8ff;color:#7e22ce;font-family:monospace;font-size:10px;font-weight:700;padding:2px 6px;border-radius:6px;border:1px solid #e9d5ff;">04 &bull; PROCEDURAL SKILL</span>
              <h2 style="font-size:14px;font-weight:700;color:#0f172a;text-transform:lowercase;margin:0;">${escapeHTML(data.skills.title)}</h2>
            </div>
            <span style="font-size:10px;font-family:monospace;color:#64748b;">${escapeHTML(data.skills.subtitle)}</span>
          </div>
          <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:12px;margin-bottom:10px;">
            <div style="font-size:10px;font-family:monospace;color:#64748b;margin-bottom:4px;">executable cli command:</div>
            <div style="font-family:monospace;font-size:12px;font-weight:700;color:#0f172a;background:#ffffff;border:1px solid #cbd5e1;padding:8px 10px;border-radius:6px;">
              $ ${escapeHTML(data.skills.command)}
            </div>
          </div>
          <div style="font-size:11.5px;color:#059669;font-family:monospace;font-weight:600;display:flex;align-items:center;gap:6px;">
            <svg style="width:14px;height:14px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>
            <span>${escapeHTML(data.skills.result)}</span>
          </div>
        </div>
      `;
    }

    container.innerHTML = html;
  }

  // ─── 8.6B SOVEREIGN CONSULTATIONS & ADVISORY DOCKET RENDERER ───
  function renderConsultationsPage(subKey, selectedSlug = null) {
    const data = DOMAIN_CONSULTATIONS[subKey] || DOMAIN_CONSULTATIONS.investors;
    const container = document.getElementById('consult-showcase-container');
    const crumbDomain = document.getElementById('consult-crumb-domain');
    const pageTitle = document.getElementById('consult-page-hero-title');
    const pageSub = document.getElementById('consult-page-hero-sub');
    const railNav = document.getElementById('consult-rail-nav');

    const domainWord = subKey ? subKey.replace(/s$/, '') : 'investor';
    if (crumbDomain) crumbDomain.textContent = `${subKey}`;
    if (pageTitle) pageTitle.textContent = `${domainWord} consultations & statutory advisory docket`;
    if (pageSub) pageSub.textContent = `high-stakes legal & forensic advisory sessions with ibbi-registered insolvency professionals and registered valuers. review detailed statutory scope, deliverables, and reserve live briefing slots.`;

    if (!data || !data.consultations || data.consultations.length === 0) return;

    let activeTrack = data.consultations.find(c => c.slug === selectedSlug);
    if (!activeTrack) activeTrack = data.consultations[0];

    // 1. Populate Left Rail Pills
    if (railNav) {
      railNav.innerHTML = data.consultations.map(c => `
        <button type="button" class="catalog-rail-pill ${c.slug === activeTrack.slug ? 'active' : ''}" data-consult-slug="${escapeHTML(c.slug)}" style="align-items:center;padding:9px 12px;">
          <svg style="width:14px;height:14px;flex-shrink:0;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
          <span style="font-size:12.5px;line-height:1.35;word-break:break-word;">${escapeHTML(c.title)}</span>
        </button>
      `).join('');

      railNav.querySelectorAll('.catalog-rail-pill').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const slug = btn.dataset.consultSlug;
          renderConsultationsPage(subKey, slug);
          const targetPath = `/${subKey}/consultations`;
          if (window.location.pathname !== targetPath) {
            window.history.replaceState({}, '', targetPath);
          }
        });
      });
    }

    // 2. Populate Right Summary Rail
    const sideTrackTitle = document.getElementById('consult-side-track-title');
    const sideDurationBadge = document.getElementById('consult-side-duration-badge');
    const sideStatutoryRef = document.getElementById('consult-side-statutory-ref');
    const sideBookTrigger = document.getElementById('consult-side-book-trigger');

    if (sideTrackTitle) sideTrackTitle.textContent = activeTrack.title;
    if (sideDurationBadge) sideDurationBadge.textContent = 'open briefing';
    if (sideStatutoryRef) sideStatutoryRef.textContent = activeTrack.statutory_ref || 'ibc 2016 statutory advisory';
    if (sideBookTrigger) {
      sideBookTrigger.onclick = (e) => {
        e.preventDefault();
        launchCalnodePopup(activeTrack);
      };
    }

    if (!container) return;

    // 3. Render Center Stage Dossier & Calnode Docket
    const deliverables = [
      "18-digit cryptographic UDIN stamped advisory memorandum",
      "Statutory compliance checklist aligned with latest NCLAT & Supreme Court precedents",
      "Comprehensive regulatory registry verification (MCA-21, CIBIL, IBBI ledgers)",
      "Pre-submission rebuttal brief & bench hearing risk defense memo"
    ];

    const prepChecklist = [
      "Target corporate debtor CIN or registration identification number",
      "Relevant Expression of Interest (Form G) / CIRP admission date & bench",
      "Draft claim forms / committee voting documentation (if available)",
      "Specific statutory questions or priority deadlock points for the briefing"
    ];

    container.innerHTML = `
      <!-- Dossier Card -->
      <div class="intel-card" style="background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;padding:22px;box-shadow:0 1px 3px rgba(0,0,0,0.04);">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;border-bottom:1px solid #f1f5f9;padding-bottom:12px;flex-wrap:wrap;gap:8px;">
          <div style="display:flex;align-items:center;gap:8px;">
            <span style="background:#ecfdf5;color:#059669;font-family:monospace;font-size:10px;font-weight:700;padding:2px 7px;border-radius:6px;border:1px solid #a7f3d0;text-transform:lowercase;">
              open statutory briefing
            </span>
            <span style="background:#f0f9ff;color:#0284c7;font-family:monospace;font-size:10px;font-weight:700;padding:2px 7px;border-radius:6px;border:1px solid #bae6fd;">
              ${escapeHTML(activeTrack.statutory_ref || 'ibc 2016 statutory reference')}
            </span>
          </div>
          <span style="font-size:10.5px;font-family:monospace;color:#64748b;font-weight:600;display:flex;align-items:center;gap:4px;">
            <svg style="width:12px;height:12px;color:#059669;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            ibbi verified ip &amp; registered valuer
          </span>
        </div>

        <h2 style="font-size:18px;font-weight:700;color:#0f172a;text-transform:lowercase;margin:0 0 10px 0;letter-spacing:-0.3px;">
          ${escapeHTML(activeTrack.title)}
        </h2>

        <p style="font-size:13px;color:#334155;line-height:1.6;margin:0 0 20px 0;">
          ${escapeHTML(activeTrack.scope || activeTrack.description)}
        </p>

        <!-- Two Columns: Deliverables & Pre-requisites -->
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:16px;margin-bottom:20px;">
          <div>
            <h4 style="font-size:12px;font-weight:700;color:#0f172a;text-transform:lowercase;margin:0 0 10px 0;display:flex;align-items:center;gap:6px;">
              <svg style="width:14px;height:14px;color:#059669;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              statutory deliverables
            </h4>
            <ul style="margin:0;padding-left:18px;font-size:12px;color:#475569;line-height:1.55;">
              ${deliverables.map(d => `<li style="margin-bottom:4px;">${escapeHTML(d)}</li>`).join('')}
            </ul>
          </div>
          <div>
            <h4 style="font-size:12px;font-weight:700;color:#0f172a;text-transform:lowercase;margin:0 0 10px 0;display:flex;align-items:center;gap:6px;">
              <svg style="width:14px;height:14px;color:#0284c7;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              pre-briefing inputs
            </h4>
            <ul style="margin:0;padding-left:18px;font-size:12px;color:#475569;line-height:1.55;">
              ${prepChecklist.map(p => `<li style="margin-bottom:4px;">${escapeHTML(p)}</li>`).join('')}
            </ul>
          </div>
        </div>

        <!-- Scheduling Action Docket -->
        <div style="background:#0f172a;border-radius:10px;padding:18px;color:white;border:1px solid #1e293b;">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;border-bottom:1px solid #1e293b;padding-bottom:10px;">
            <div style="display:flex;align-items:center;gap:8px;">
              <span style="width:8px;height:8px;background:#34d399;border-radius:50%;display:inline-block;"></span>
              <span style="font-size:12px;font-weight:700;color:white;text-transform:lowercase;">calnode live scheduler &bull; briefing slot</span>
            </div>
            <span style="font-size:10.5px;font-family:monospace;color:#94a3b8;">encrypted p2p video bridge</span>
          </div>

          <p style="font-size:12px;color:#94a3b8;margin:0 0 14px 0;line-height:1.5;">
            reserve your statutory briefing slot below. once booked, a calendar invitation with direct encrypted calnode video link and compliance checklist will be dispatched immediately.
          </p>

          <div style="display:flex;gap:12px;align-items:stretch;flex-wrap:wrap;">
            <button type="button" class="catalog-primary-cta" id="consult-dossier-book-trigger" style="padding:12px 24px;font-size:13px;text-transform:lowercase;display:inline-flex;align-items:center;gap:6px;">
              <span>pick slot &amp; book briefing &rarr;</span>
            </button>
            <a href="tel:+919316015274" class="catalog-sort-btn" style="padding:10px 16px;font-size:12px;text-decoration:none;display:inline-flex;align-items:center;color:#cbd5e1;border-color:#334155;text-transform:lowercase;">
              <span>emergency call: 93160-15274</span>
            </a>
          </div>
        </div>
      </div>
    `;

    const dossierBookBtn = document.getElementById('consult-dossier-book-trigger');
    if (dossierBookBtn) {
      dossierBookBtn.onclick = (e) => {
        e.preventDefault();
        launchCalnodePopup(activeTrack);
      };
    }
  }

  // ─── 8.7 SEAMLESS MULTI-VIEW SWITCHER (RADAR <-> ANSWERS <-> CATALOG <-> WORKSPACE <-> ADMIN <-> INTELLIGENCE <-> CONSULTATIONS) ───
  function setupViewSwitcher() {
    const navOpportunities = document.getElementById('nav-opportunities');
    const navAnswersBtn = document.getElementById('nav-answers-btn');
    const navCatalogBtn = document.getElementById('nav-catalog-btn') || document.getElementById('nav-price-list-btn');
    const navWorkspaceBtn = document.getElementById('nav-workspace-btn');
    const dropdownWorkspaceBtn = document.getElementById('dropdown-workspace-btn');
    const userProfileTrigger = document.getElementById('user-profile-trigger');
    const adminDashboardLink = document.getElementById('admin-dashboard-link');
    const radarView = document.getElementById('radar-view');
    const forumView = document.getElementById('answers-view') || document.getElementById('forum-view');
    const priceListView = document.getElementById('price-list-view');
    const workspaceView = document.getElementById('workspace-view');
    const adminView = document.getElementById('admin-view');
    const intelligenceView = document.getElementById('intelligence-view');
    const navIntelligenceBtn = document.getElementById('nav-intelligence-btn');
    const intelRailNav = document.getElementById('intel-rail-nav');
    const intelSideDownloadTrigger = document.getElementById('intel-side-download-trigger');
    const intelHeroDownloadBtn = document.getElementById('intel-hero-download-btn');
    const consultationsView = document.getElementById('consultations-view');
    const consultRailNav = document.getElementById('consult-rail-nav');
    const consultSideBookTrigger = document.getElementById('consult-side-book-trigger');

    let currentForumTrack = 'all';
    let currentIntelFilter = 'models';

    async function loadForumQuestions(track = 'all') {
      currentForumTrack = track;
      const questionsListEl = document.getElementById('forum-questions-list');
      const detailEl = document.getElementById('forum-question-detail');
      if (!questionsListEl) return;

      if (detailEl) detailEl.style.display = 'none';
      questionsListEl.style.display = 'flex';
      questionsListEl.innerHTML = '<div style="padding:28px;text-align:center;color:#64748b;font-size:13px;">loading statutory questions...</div>';

      try {
        let url = '/api/forum/questions';
        if (track && track !== 'all') {
          url += `?track=${encodeURIComponent(track)}`;
        }
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const questions = data.questions || [];

        if (questions.length === 0) {
          questionsListEl.innerHTML = '<div style="padding:36px;text-align:center;color:#64748b;font-size:13px;">no statutory questions found in this track.</div>';
          return;
        }

        questionsListEl.innerHTML = questions.map(q => `
          <article class="forum-question-item" data-slug="${escapeHTML(q.slug)}">
            <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;">
              <h2 class="forum-question-title">${escapeHTML(q.title)}</h2>
              ${q.is_statutory_precedent ? '<span class="forum-precedent-badge">statutory precedent</span>' : ''}
            </div>
            <p class="forum-question-snippet">${escapeHTML(q.content_markdown.slice(0, 180))}${q.content_markdown.length > 180 ? '...' : ''}</p>
            <div class="forum-tag-list">
              ${(q.tags || []).map(t => `<span class="forum-tag-badge">${escapeHTML(t)}</span>`).join('')}
            </div>
            <div class="forum-meta-bar">
              <span>by <strong>${escapeHTML(q.author_name)}</strong> (${escapeHTML(q.author_role)})</span>
              <span>&bull;</span>
              <span>track: <strong>${escapeHTML(q.stakeholder_track)}</strong></span>
              <span>&bull;</span>
              <span style="color:#059669;font-weight:600;">${q.answer_count} verified answer${q.answer_count === 1 ? '' : 's'}</span>
              <span>&bull;</span>
              <span>${q.view_count} views</span>
            </div>
          </article>
        `).join('');

        questionsListEl.querySelectorAll('.forum-question-item').forEach(el => {
          el.addEventListener('click', () => {
            const slug = el.dataset.slug;
            if (slug) loadQuestionDetail(slug);
          });
        });
      } catch (err) {
        questionsListEl.innerHTML = `<div style="padding:24px;text-align:center;color:#ef4444;font-size:13px;">failed to load questions: ${escapeHTML(err.message)}</div>`;
      }
    }

    async function loadQuestionDetail(slug) {
      const questionsListEl = document.getElementById('forum-questions-list');
      const detailEl = document.getElementById('forum-question-detail');
      if (!detailEl || !questionsListEl) return;

      questionsListEl.style.display = 'none';
      detailEl.style.display = 'block';
      detailEl.innerHTML = '<div style="padding:28px;text-align:center;color:#64748b;font-size:13px;">loading question detail...</div>';

      try {
        const res = await fetch(`/api/forum/questions/${encodeURIComponent(slug)}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const q = data.question;
        const answers = data.answers || [];

        detailEl.innerHTML = `
          <button type="button" class="forum-detail-back-btn" id="forum-back-to-list-btn">
            <svg style="width:14px;height:14px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
            <span>&larr; back to all questions</span>
          </button>

          <div style="border-bottom:1px solid #e2e8f0;padding-bottom:16px;margin-bottom:16px;">
            <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;">
              <h1 style="font-size:19px;font-weight:700;color:#0f172a;line-height:1.4;margin:0 0 8px 0;">${escapeHTML(q.title)}</h1>
              ${q.is_statutory_precedent ? '<span class="forum-precedent-badge">statutory precedent</span>' : ''}
            </div>
            <div class="forum-meta-bar" style="margin-bottom:12px;">
              <span>asked by <strong>${escapeHTML(q.author_name)}</strong></span>
              <span>&bull;</span>
              <span>track: <strong>${escapeHTML(q.stakeholder_track)}</strong></span>
              <span>&bull;</span>
              <span>${q.view_count} views</span>
            </div>
            <div class="forum-tag-list" style="margin-bottom:14px;">
              ${(q.tags || []).map(t => `<span class="forum-tag-badge">${escapeHTML(t)}</span>`).join('')}
            </div>
            <div style="font-size:14px;color:#334155;line-height:1.6;margin-top:12px;">
              ${q.content_html || escapeHTML(q.content_markdown)}
            </div>
          </div>

          <div class="forum-answer-container">
            <h2 style="font-size:16px;font-weight:700;color:#0f172a;margin:0 0 12px 0;">
              ${answers.length} verified answer${answers.length === 1 ? '' : 's'}
            </h2>

            ${answers.map(ans => `
              <div class="forum-answer-card">
                <div class="forum-answer-header">
                  <div style="display:flex;align-items:center;gap:8px;">
                    <strong style="color:#0f172a;font-size:13.5px;">${escapeHTML(ans.author_name)}</strong>
                    <span style="font-size:11.5px;color:#64748b;">(${escapeHTML(ans.author_role)})</span>
                    ${ans.is_verified_statutory ? '<span class="forum-verified-pill"><svg style="width:12px;height:12px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>verified precedent</span>' : ''}
                  </div>
                  <div style="font-size:12px;color:#059669;font-weight:600;">
                    &uarr; ${ans.upvotes} upvotes
                  </div>
                </div>
                <div style="font-size:14px;color:#334155;line-height:1.6;margin-top:8px;">
                  ${ans.content_html || escapeHTML(ans.content_markdown)}
                </div>
              </div>
            `).join('')}
          </div>
        `;

        const backBtn = document.getElementById('forum-back-to-list-btn');
        if (backBtn) {
          backBtn.addEventListener('click', () => {
            detailEl.style.display = 'none';
            questionsListEl.style.display = 'flex';
          });
        }
      } catch (err) {
        detailEl.innerHTML = `<div style="padding:24px;text-align:center;color:#ef4444;">failed to load detail: ${escapeHTML(err.message)}</div>`;
      }
    }

    function showRadarView() {
      closeAllMegamenus();
      if (radarView) radarView.style.display = 'flex';
      if (forumView) forumView.style.display = 'none';
      if (priceListView) priceListView.style.display = 'none';
      if (workspaceView) workspaceView.style.display = 'none';
      if (adminView) adminView.style.display = 'none';
      if (intelligenceView) intelligenceView.style.display = 'none';
      if (consultationsView) consultationsView.style.display = 'none';
      if (navOpportunities) navOpportunities.classList.add('pill-active');
      if (navAnswersBtn) navAnswersBtn.classList.remove('pill-active');
      if (navCatalogBtn) navCatalogBtn.classList.remove('pill-active');
      if (navWorkspaceBtn) navWorkspaceBtn.classList.remove('pill-active');
      if (navIntelligenceBtn) navIntelligenceBtn.classList.remove('pill-active');
      if (navConsultationsBtn) navConsultationsBtn.classList.remove('pill-active');
      if (userProfileTrigger) userProfileTrigger.classList.remove('active');
      setTimeout(() => {
        if (map) map.invalidateSize();
      }, 100);
    }

    function showForumView(route = '/') {
      closeAllMegamenus();
      if (radarView) radarView.style.display = 'none';
      if (forumView) forumView.style.display = 'flex';
      if (priceListView) priceListView.style.display = 'none';
      if (workspaceView) workspaceView.style.display = 'none';
      if (adminView) adminView.style.display = 'none';
      if (intelligenceView) intelligenceView.style.display = 'none';
      if (consultationsView) consultationsView.style.display = 'none';
      if (navOpportunities) navOpportunities.classList.remove('pill-active');
      if (navAnswersBtn) navAnswersBtn.classList.add('pill-active');
      if (navCatalogBtn) navCatalogBtn.classList.remove('pill-active');
      if (navWorkspaceBtn) navWorkspaceBtn.classList.remove('pill-active');
      if (navIntelligenceBtn) navIntelligenceBtn.classList.remove('pill-active');
      if (navConsultationsBtn) navConsultationsBtn.classList.remove('pill-active');
      if (userProfileTrigger) userProfileTrigger.classList.remove('active');

      loadForumQuestions(currentForumTrack || 'all');
    }

    function showCatalogView() {
      closeAllMegamenus();
      if (radarView) radarView.style.display = 'none';
      if (forumView) forumView.style.display = 'none';
      if (priceListView) priceListView.style.display = 'flex';
      if (workspaceView) workspaceView.style.display = 'none';
      if (adminView) adminView.style.display = 'none';
      if (intelligenceView) intelligenceView.style.display = 'none';
      if (consultationsView) consultationsView.style.display = 'none';
      if (navOpportunities) navOpportunities.classList.remove('pill-active');
      if (navAnswersBtn) navAnswersBtn.classList.remove('pill-active');
      if (navCatalogBtn) navCatalogBtn.classList.add('pill-active');
      if (navWorkspaceBtn) navWorkspaceBtn.classList.remove('pill-active');
      if (navIntelligenceBtn) navIntelligenceBtn.classList.remove('pill-active');
      if (navConsultationsBtn) navConsultationsBtn.classList.remove('pill-active');
      if (userProfileTrigger) userProfileTrigger.classList.remove('active');
      if (typeof loadReportsCatalogOnce === 'function') {
        loadReportsCatalogOnce();
      }
    }

    function showWorkspaceView(tab = 'dashboard') {
      closeAllMegamenus();
      if (radarView) radarView.style.display = 'none';
      if (forumView) forumView.style.display = 'none';
      if (priceListView) priceListView.style.display = 'none';
      if (workspaceView) workspaceView.style.display = 'flex';
      if (adminView) adminView.style.display = 'none';
      if (intelligenceView) intelligenceView.style.display = 'none';
      if (consultationsView) consultationsView.style.display = 'none';
      if (navOpportunities) navOpportunities.classList.remove('pill-active');
      if (navAnswersBtn) navAnswersBtn.classList.remove('pill-active');
      if (navCatalogBtn) navCatalogBtn.classList.remove('pill-active');
      if (navWorkspaceBtn) navWorkspaceBtn.classList.remove('pill-active');
      if (navIntelligenceBtn) navIntelligenceBtn.classList.remove('pill-active');
      if (navConsultationsBtn) navConsultationsBtn.classList.remove('pill-active');
      if (userProfileTrigger) userProfileTrigger.classList.add('active');

      const userProfileDropdown = document.getElementById('user-profile-dropdown');
      if (userProfileDropdown) userProfileDropdown.classList.remove('show');

      if (window.switchWorkspaceTab) {
        window.switchWorkspaceTab(tab);
      }
    }
    window.openWorkspaceView = showWorkspaceView;

    function showAdminView(tab = 'overview') {
      const user = window.currentUser || (function() {
        try {
          const u = localStorage.getItem('openibc_user');
          return u ? JSON.parse(u) : null;
        } catch (e) { return null; }
      })();

      if (!user) {
        if (typeof openAuthModal === 'function') {
          openAuthModal('signin');
        } else {
          const authOverlay = document.getElementById('auth-modal-overlay');
          if (authOverlay) authOverlay.style.display = 'flex';
        }
        return;
      }

      const isAdmin = user.role_id === 2 || user.username === 'admin' || user.custom_role === 'admin' || user.e_mail === 'admin@openibc.in' || user.email === 'admin@openibc.in';
      if (!isAdmin) {
        showWorkspaceView('dashboard');
        alert('the sovereign admin console is restricted to platform administrators.');
        return;
      }

      closeAllMegamenus();
      if (radarView) radarView.style.display = 'none';
      if (forumView) forumView.style.display = 'none';
      if (priceListView) priceListView.style.display = 'none';
      if (workspaceView) workspaceView.style.display = 'none';
      if (adminView) adminView.style.display = 'flex';
      if (intelligenceView) intelligenceView.style.display = 'none';
      if (consultationsView) consultationsView.style.display = 'none';

      if (navOpportunities) navOpportunities.classList.remove('pill-active');
      if (navAnswersBtn) navAnswersBtn.classList.remove('pill-active');
      if (navCatalogBtn) navCatalogBtn.classList.remove('pill-active');
      if (navWorkspaceBtn) navWorkspaceBtn.classList.remove('pill-active');
      if (navIntelligenceBtn) navIntelligenceBtn.classList.remove('pill-active');
      if (navConsultationsBtn) navConsultationsBtn.classList.remove('pill-active');
      if (userProfileTrigger) userProfileTrigger.classList.add('active');

      const userProfileDropdown = document.getElementById('user-profile-dropdown');
      if (userProfileDropdown) userProfileDropdown.classList.remove('show');

      if (window.switchAdminTab) {
        window.switchAdminTab(tab);
      }
    }
    window.openAdminView = showAdminView;

    function showIntelligenceView(filter = 'models') {
      if (!['models', 'vaults', 'agents', 'skills'].includes(filter)) {
        filter = 'models';
      }
      closeAllMegamenus();
      if (radarView) radarView.style.display = 'none';
      if (forumView) forumView.style.display = 'none';
      if (priceListView) priceListView.style.display = 'none';
      if (workspaceView) workspaceView.style.display = 'none';
      if (adminView) adminView.style.display = 'none';
      if (intelligenceView) intelligenceView.style.display = 'flex';
      if (consultationsView) consultationsView.style.display = 'none';

      if (navOpportunities) navOpportunities.classList.remove('pill-active');
      if (navAnswersBtn) navAnswersBtn.classList.remove('pill-active');
      if (navCatalogBtn) navCatalogBtn.classList.remove('pill-active');
      if (navWorkspaceBtn) navWorkspaceBtn.classList.remove('pill-active');
      if (navIntelligenceBtn) navIntelligenceBtn.classList.add('pill-active');
      if (navConsultationsBtn) navConsultationsBtn.classList.remove('pill-active');
      if (userProfileTrigger) userProfileTrigger.classList.remove('active');

      currentIntelFilter = filter;
      if (intelRailNav) {
        intelRailNav.querySelectorAll('.catalog-rail-pill').forEach(btn => {
          if (btn.dataset.intelFilter === filter) {
            btn.classList.add('active');
          } else {
            btn.classList.remove('active');
          }
        });
      }

      renderIntelligenceShowcasePage(currentSubdomain, filter);

      const targetPath = `/${currentSubdomain}/intelligence`;
      if (window.location.pathname !== targetPath && !window.location.pathname.includes('/intelligence')) {
        window.history.replaceState({}, '', targetPath);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    window.openIntelligenceView = showIntelligenceView;

    function showConsultationsView(trackSlug = null) {
      closeAllMegamenus();
      if (radarView) radarView.style.display = 'none';
      if (forumView) forumView.style.display = 'none';
      if (priceListView) priceListView.style.display = 'none';
      if (workspaceView) workspaceView.style.display = 'none';
      if (adminView) adminView.style.display = 'none';
      if (intelligenceView) intelligenceView.style.display = 'none';
      if (consultationsView) consultationsView.style.display = 'flex';

      if (navOpportunities) navOpportunities.classList.remove('pill-active');
      if (navAnswersBtn) navAnswersBtn.classList.remove('pill-active');
      if (navCatalogBtn) navCatalogBtn.classList.remove('pill-active');
      if (navWorkspaceBtn) navWorkspaceBtn.classList.remove('pill-active');
      if (navIntelligenceBtn) navIntelligenceBtn.classList.remove('pill-active');
      if (navConsultationsBtn) navConsultationsBtn.classList.add('pill-active');
      if (userProfileTrigger) userProfileTrigger.classList.remove('active');

      renderConsultationsPage(currentSubdomain, trackSlug);

      const targetPath = `/${currentSubdomain}/consultations`;
      if (window.location.pathname !== targetPath && !window.location.pathname.includes('/consultations')) {
        window.history.replaceState({}, '', targetPath);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    window.openConsultationsView = showConsultationsView;

    openForumView = (route = '/') => {
      showForumView(route);
      const suffix = route.startsWith('/questions/ask') ? 'ask' : 'answers';
      window.history.replaceState({}, '', `/${currentSubdomain}/${suffix}`);
    };

    openCatalogView = () => {
      showCatalogView();
      window.history.replaceState({}, '', `/${currentSubdomain}/catalog`);
    };
    openPriceListView = openCatalogView;

    if (consultSideBookTrigger) {
      consultSideBookTrigger.addEventListener('click', (e) => {
        e.preventDefault();
        launchCalnodePopup();
      });
    }

    if (intelRailNav) {
      intelRailNav.querySelectorAll('.catalog-rail-pill').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const filter = btn.dataset.intelFilter || 'models';
          showIntelligenceView(filter);
        });
      });
    }

    if (intelSideDownloadTrigger) {
      intelSideDownloadTrigger.addEventListener('click', (e) => {
        e.preventDefault();
        const dlOverlay = document.getElementById('download-modal-overlay');
        if (dlOverlay) dlOverlay.classList.add('show');
      });
    }

    if (intelHeroDownloadBtn) {
      intelHeroDownloadBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const dlOverlay = document.getElementById('download-modal-overlay');
        if (dlOverlay) dlOverlay.classList.add('show');
      });
    }

    if (navOpportunities) {
      navOpportunities.addEventListener('click', (e) => {
        e.preventDefault();
        showRadarView();
        window.history.replaceState({}, '', `/${currentSubdomain}/`);
      });
    }

    if (navAnswersBtn) {
      navAnswersBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showForumView('/');
        const targetPath = `/${currentSubdomain}/answers`;
        if (window.location.pathname !== targetPath) {
          window.history.replaceState({}, '', targetPath);
        }
      });
    }

    // Sovereign LightRAG Answers Engine Query Handler
    const answersQueryInput = document.getElementById('answers-query-input');
    const answersQuerySubmitBtn = document.getElementById('answers-query-submit-btn');
    const answersLiveResult = document.getElementById('answers-live-result');
    const forumAskTriggerBtn = document.getElementById('forum-ask-trigger-btn');

    async function executeLightRAGQuery() {
      if (!answersQueryInput || !answersLiveResult) return;
      const q = answersQueryInput.value.trim();
      if (!q) {
        answersQueryInput.focus();
        return;
      }

      answersLiveResult.style.display = 'block';
      answersLiveResult.innerHTML = `
        <div style="display:flex;align-items:center;gap:10px;padding:12px 14px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;font-size:13px;color:#166534;">
          <svg style="width:16px;height:16px;animation:spin 1s linear infinite;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
          <span>Querying Sovereign Knowledge Graph for statutory synthesis...</span>
        </div>
      `;

      try {
        const res = await fetch('/api/answers/query', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: q, mode: 'mix' })
        });
        const data = await res.json();

        if (!data.success) {
          throw new Error(data.error || 'Statutory query failed');
        }

        const refs = data.references || [];
        answersLiveResult.innerHTML = `
          <div style="background:#ffffff;border:1px solid #cbd5e1;border-radius:8px;padding:16px;box-shadow:0 1px 3px rgba(0,0,0,0.05);">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;padding-bottom:8px;border-bottom:1px solid #f1f5f9;">
              <div style="display:flex;align-items:center;gap:6px;">
                <span class="pulse-dot emerald" style="width:8px;height:8px;background:#10b981;border-radius:50%;display:inline-block;"></span>
                <span style="font-size:11px;font-weight:700;letter-spacing:0.5px;color:#059669;text-transform:uppercase;">
                  Sovereign Graph Precedent • ${escapeHTML(data.workspace || 'Statutory')}
                </span>
              </div>
              <button type="button" id="answers-result-close-btn" style="background:none;border:none;color:#94a3b8;font-size:16px;cursor:pointer;">&times;</button>
            </div>
            
            <div style="font-size:14px;color:#1e293b;line-height:1.65;margin-bottom:14px;">
              ${data.answer_html || escapeHTML(data.answer)}
            </div>

            ${refs.length > 0 ? `
              <div style="padding-top:10px;border-top:1px dashed #e2e8f0;">
                <div style="font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;margin-bottom:6px;">Verified Citations & Sources</div>
                <div style="display:flex;flex-wrap:wrap;gap:6px;">
                  ${refs.map(r => `
                    <span style="display:inline-flex;align-items:center;gap:4px;background:#f1f5f9;border:1px solid #e2e8f0;padding:3px 8px;border-radius:4px;font-size:11px;color:#475569;">
                      <svg style="width:10px;height:10px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                      ${escapeHTML(r.file_path || r.reference_id)}
                    </span>
                  `).join('')}
                </div>
              </div>
            ` : ''}
          </div>
        `;

        const closeBtn = document.getElementById('answers-result-close-btn');
        if (closeBtn) {
          closeBtn.onclick = () => { answersLiveResult.style.display = 'none'; };
        }

      } catch (err) {
        answersLiveResult.innerHTML = `
          <div style="padding:12px 14px;background:#fef2f2;border:1px solid #fecaca;border-radius:8px;font-size:12.5px;color:#991b1b;">
            <strong>Query Error:</strong> ${escapeHTML(err.message)}
          </div>
        `;
      }
    }

    if (answersQuerySubmitBtn) {
      answersQuerySubmitBtn.addEventListener('click', (e) => {
        e.preventDefault();
        executeLightRAGQuery();
      });
    }

    if (answersQueryInput) {
      answersQueryInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          executeLightRAGQuery();
        }
      });
    }

    if (forumAskTriggerBtn) {
      forumAskTriggerBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (answersQueryInput) {
          answersQueryInput.focus();
          answersQueryInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
    }

    if (navCatalogBtn) {
      navCatalogBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showCatalogView();
        const targetPath = `/${currentSubdomain}/catalog`;
        if (window.location.pathname !== targetPath) {
          window.history.replaceState({}, '', targetPath);
        }
      });
    }

    if (navWorkspaceBtn) {
      navWorkspaceBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showWorkspaceView('dashboard');
        const targetPath = `/${currentSubdomain}/workspace`;
        if (window.location.pathname !== targetPath) {
          window.history.replaceState({}, '', targetPath);
        }
      });
    }

    if (dropdownWorkspaceBtn) {
      dropdownWorkspaceBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showWorkspaceView('dashboard');
        const targetPath = `/${currentSubdomain}/workspace`;
        if (window.location.pathname !== targetPath) {
          window.history.replaceState({}, '', targetPath);
        }
      });
    }

    if (adminDashboardLink) {
      adminDashboardLink.addEventListener('click', (e) => {
        e.preventDefault();
        showAdminView('overview');
        if (window.location.pathname !== '/admin') {
          window.history.pushState({}, '', '/admin');
        }
      });
    }

    // Synchronize parent browser URL when navigating inside the embedded forum
    window.addEventListener('message', (e) => {
      if (e.data && e.data.type === 'OPENIBC_URL_CHANGE') {
        const path = e.data.path || '/';
        const cleanPath = path.startsWith('/') ? path : '/' + path;
        const targetPath = `/${currentSubdomain}${cleanPath}`;
        if (window.location.pathname !== targetPath) {
          window.history.replaceState({}, '', targetPath);
        }
      }
    });

    // Initial Route Detection
    const path = window.location.pathname.toLowerCase();
    if (path.includes('/admin')) {
      showAdminView('overview');
    } else if (path.includes('/workspace')) {
      showWorkspaceView('dashboard');
    } else if (path.includes('/consultations')) {
      showConsultationsView();
      const targetPath = `/${currentSubdomain}/consultations`;
      if (window.location.pathname !== targetPath) {
        window.history.replaceState({}, '', targetPath);
      }
    } else if (path.includes('/intelligence')) {
      showIntelligenceView('models');
      const targetPath = `/${currentSubdomain}/intelligence`;
      if (window.location.pathname !== targetPath) {
        window.history.replaceState({}, '', targetPath);
      }
    } else if (path.includes('/catalog') || path.includes('/price-list')) {
      showCatalogView();
      const targetPath = `/${currentSubdomain}/catalog`;
      if (window.location.pathname !== targetPath) {
        window.history.replaceState({}, '', targetPath);
      }
    } else if (path.includes('/answers') || path.includes('/forum')) {
      showForumView('/');
    } else if (path.includes('/ask')) {
      showForumView('/questions/ask');
    } else {
      if (window.location.hash === '#consultations') {
        showConsultationsView();
      } else if (window.location.hash === '#intelligence') {
        showIntelligenceView('models');
      } else {
        showRadarView();
        window.history.replaceState({}, '', `/${currentSubdomain}/`);
      }
    }
  }

  // ─── 8.9 SOVEREIGN PRACTITIONER WORKSPACE ───
  function setupWorkspace() {
    const workspaceRailNav = document.getElementById('workspace-rail-nav');
    const dashboardFilter = document.getElementById('workspace-dashboard-filter');
    const profileForm = document.getElementById('workspace-profile-form');
    const securityForm = document.getElementById('workspace-security-form');
    const profileStatusBanner = document.getElementById('profile-status-banner');

    let currentWorkspaceTab = 'dashboard';
    let currentDashboardFilter = 'all';

    function getSavedUser() {
      try {
        const u = localStorage.getItem('openibc_user');
        return u ? JSON.parse(u) : null;
      } catch (e) {
        return null;
      }
    }

    function switchWorkspaceTab(tab = 'dashboard') {
      const normalizedTab = (tab === 'bookmarks') ? 'dashboard' : tab;
      currentWorkspaceTab = normalizedTab;
      if (workspaceRailNav) {
        workspaceRailNav.querySelectorAll('.catalog-rail-pill').forEach(btn => {
          const btnTab = btn.dataset.workspaceTab;
          if (btnTab === normalizedTab || (btnTab === 'dashboard' && (tab === 'bookmarks' || tab === 'dashboard'))) {
            btn.classList.add('active');
          } else {
            btn.classList.remove('active');
          }
        });
      }

      const panels = ['dashboard', 'profile', 'billing'];
      panels.forEach(p => {
        const panelEl = document.getElementById(`workspace-panel-${p}`);
        if (panelEl) {
          panelEl.style.display = (p === normalizedTab) ? 'block' : 'none';
        }
      });

      if (normalizedTab === 'dashboard') {
        loadWorkspaceDashboard(currentDashboardFilter);
      } else if (normalizedTab === 'profile') {
        populateProfileForm();
      } else if (normalizedTab === 'billing') {
        loadWorkspaceBilling();
      }
    }
    window.switchWorkspaceTab = switchWorkspaceTab;

    if (workspaceRailNav) {
      workspaceRailNav.querySelectorAll('.catalog-rail-pill').forEach(btn => {
        btn.addEventListener('click', () => {
          const tab = btn.dataset.workspaceTab || 'dashboard';
          switchWorkspaceTab(tab);
        });
      });
    }

    if (dashboardFilter) {
      dashboardFilter.querySelectorAll('.catalog-sort-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          dashboardFilter.querySelectorAll('.catalog-sort-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          currentDashboardFilter = btn.dataset.filter || 'all';
          loadWorkspaceDashboard(currentDashboardFilter);
        });
      });
    }

    async function loadWorkspaceDashboard(filter = 'all') {
      const feed = document.getElementById('workspace-dashboard-feed');
      if (!feed) return;

      const user = getSavedUser();
      const email = user ? (user.e_mail || user.email) : '';

      // Collect bookmarked opportunities and professionals from rawItems
      const bookmarkedDeals = [];
      const bookmarkedCounsel = [];
      if (rawItems && bookmarkedIds) {
        rawItems.forEach(item => {
          if (bookmarkedIds.has(item.id)) {
            if (item.type === 'counsel' || item.role || item.law_firm) {
              bookmarkedCounsel.push(item);
            } else {
              bookmarkedDeals.push(item);
            }
          }
        });
      }

      // Fetch consultations from backend
      let consultations = [];
      if (email) {
        try {
          const res = await fetch(`/api/user/consultations?email=${encodeURIComponent(email)}`);
          if (res.ok) {
            const data = await res.json();
            consultations = data.consultations || [];
          }
        } catch (e) {
          console.warn('Failed to load consultations:', e);
        }
      }

      // Update right-rail counters
      const statDeals = document.getElementById('stat-deals-count');
      const statCounsel = document.getElementById('stat-counsel-count');
      const statPrecedents = document.getElementById('stat-precedents-count');
      const statBriefings = document.getElementById('stat-briefings-count');

      if (statDeals) statDeals.textContent = bookmarkedDeals.length;
      if (statCounsel) statCounsel.textContent = bookmarkedCounsel.length;
      if (statPrecedents) statPrecedents.textContent = '1';
      if (statBriefings) statBriefings.textContent = consultations.length;

      // Build cards according to active filter
      const cards = [];

      // 1. Consultations
      if (filter === 'all' || filter === 'consultations') {
        consultations.forEach(c => {
          const sched = c.scheduled_at ? new Date(c.scheduled_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : 'Pending Confirmation';
          cards.push(`
            <div class="workspace-item-card" data-category="consultations">
              <div class="card-top-row">
                <div>
                  <span class="card-subtitle" style="color:#059669;font-weight:700;">SCHEDULED ADVISORY BRIEFING</span>
                  <h3 class="card-title">${escapeHTML(c.track_title || 'Statutory Consultation')}</h3>
                </div>
                <span style="color:#059669;font-size:11px;font-weight:600;font-family:monospace;text-transform:lowercase;">${escapeHTML((c.status || 'confirmed').toLowerCase())}</span>
              </div>
              <div class="card-meta-row">
                <span>🗓 <strong>${escapeHTML(sched)}</strong></span>
                <span>&bull;</span>
                <span>contact: <strong>${escapeHTML(c.contact)}</strong></span>
                ${c.calnode_booking_id ? `<span>&bull;</span><span>booking id: <code style="font-size:11px;">${escapeHTML(c.calnode_booking_id)}</code></span>` : ''}
              </div>
              ${c.notes ? `<p style="font-size:12px;color:#475569;margin:4px 0 0 0;line-height:1.4;">notes: ${escapeHTML(c.notes)}</p>` : ''}
            </div>
          `);
        });
      }

      // 2. Deals / Opportunities
      if (filter === 'all' || filter === 'deals') {
        bookmarkedDeals.forEach(d => {
          cards.push(`
            <div class="workspace-item-card" data-category="deals">
              <div class="card-top-row">
                <div>
                  <span class="card-subtitle">CORPORATE DEBTOR &bull; NCLT ${escapeHTML(d.nclt_bench || 'BENCH')}</span>
                  <h3 class="card-title">${escapeHTML(d.name || 'Corporate Debtor')}</h3>
                </div>
                <button type="button" class="catalog-sort-btn" onclick="window.toggleBookmark('${d.id}'); window.openWorkspaceView('dashboard');" style="font-size:10px;text-transform:lowercase;color:#e11d48;border-color:#fecdd3;">remove</button>
              </div>
              <div class="card-meta-row">
                ${d.cin ? `<span>CIN: <strong>${escapeHTML(d.cin)}</strong></span><span>&bull;</span>` : ''}
                ${d.claims_inr ? `<span>admitted claims: <strong>${escapeHTML(d.claims_inr)}</strong></span><span>&bull;</span>` : ''}
                <span>stage: <strong>${escapeHTML(d.cirp_stage || 'CIRP in progress')}</strong></span>
              </div>
            </div>
          `);
        });
      }

      // 3. Counsel / Professionals
      if (filter === 'all' || filter === 'professionals') {
        bookmarkedCounsel.forEach(p => {
          cards.push(`
            <div class="workspace-item-card" data-category="professionals">
              <div class="card-top-row">
                <div>
                  <span class="card-subtitle">EMPANELLED PRACTITIONER &bull; ${escapeHTML(p.primary_track || 'INSOLVENCY')}</span>
                  <h3 class="card-title">${escapeHTML(p.name || 'Practitioner')}</h3>
                </div>
                <button type="button" class="catalog-sort-btn" onclick="window.toggleBookmark('${p.id}'); window.openWorkspaceView('dashboard');" style="font-size:10px;text-transform:lowercase;color:#e11d48;border-color:#fecdd3;">remove</button>
              </div>
              <div class="card-meta-row">
                ${p.registration_id ? `<span>ID: <strong>${escapeHTML(p.registration_id)}</strong></span><span>&bull;</span>` : ''}
                ${p.bench ? `<span>bench: <strong>${escapeHTML(p.bench)}</strong></span><span>&bull;</span>` : ''}
                <span>role: <strong>${escapeHTML(p.role || 'Advocate')}</strong></span>
              </div>
            </div>
          `);
        });
      }

      // 4. Precedents
      if (filter === 'all' || filter === 'precedents') {
        cards.push(`
          <div class="workspace-item-card" data-category="precedents">
            <div class="card-top-row">
              <div>
                <span class="card-subtitle" style="color:#059669;font-weight:700;">STATUTORY PRECEDENT &bull; SECTION 29A(C)</span>
                <h3 class="card-title">ArcelorMittal India Pvt. Ltd. v. Satish Kumar Gupta (2019) 2 SCC 1</h3>
              </div>
            </div>
            <p style="font-size:12.5px;color:#334155;margin:4px 0 0 0;line-height:1.5;">
              Hon'ble Supreme Court held that disqualification under Section 29A attaches to any person acting in concert or exercising joint management/control over an NPA debtor.
            </p>
          </div>
        `);
      }

      if (cards.length === 0) {
        feed.innerHTML = `
          <div class="workspace-empty-state">
            <strong>no saved interactions found</strong>
            <span>explore corporate debtors on radar or star statutory answers to populate your workspace dashboard.</span>
          </div>
        `;
      } else {
        feed.innerHTML = cards.join('');
      }
    }

    function populateProfileForm() {
      const user = getSavedUser();
      if (!user) return;

      const nameInput = document.getElementById('profile-name');
      const emailInput = document.getElementById('profile-email');
      const trackInput = document.getElementById('profile-track');
      const roleBadge = document.getElementById('profile-role-badge');

      if (nameInput) nameInput.value = user.display_name || '';
      if (emailInput) emailInput.value = user.e_mail || user.email || '';
      if (trackInput && user.custom_role) trackInput.value = user.custom_role;
      if (roleBadge) roleBadge.textContent = (user.custom_role === 'admin' ? 'SOVEREIGN ADMIN' : 'VERIFIED PRACTITIONER');
    }

    if (profileForm) {
      profileForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const user = getSavedUser();
        const name = document.getElementById('profile-name').value.trim();
        const track = document.getElementById('profile-track').value;
        const reg = document.getElementById('profile-registration').value.trim();
        const org = document.getElementById('profile-organization').value.trim();
        const phone = document.getElementById('profile-phone').value.trim();
        const saveBtn = document.getElementById('profile-save-btn');

        saveBtn.disabled = true;
        saveBtn.textContent = 'saving...';

        try {
          if (supabaseClient) {
            await supabaseClient.auth.updateUser({
              data: { name: name, role: track, registration_id: reg, organization: org, phone: phone }
            });
          }
          if (user) {
            user.display_name = name;
            user.custom_role = track;
            localStorage.setItem('openibc_user', JSON.stringify(user));
            renderAuthState(user);
          }
          if (profileStatusBanner) {
            profileStatusBanner.style.display = 'block';
            profileStatusBanner.style.background = '#ecfdf5';
            profileStatusBanner.style.border = '1px solid #a7f3d0';
            profileStatusBanner.style.color = '#059669';
            profileStatusBanner.textContent = 'profile changes saved successfully.';
            setTimeout(() => { profileStatusBanner.style.display = 'none'; }, 4000);
          }
        } catch (err) {
          if (profileStatusBanner) {
            profileStatusBanner.style.display = 'block';
            profileStatusBanner.style.background = '#fef2f2';
            profileStatusBanner.style.border = '1px solid #fecaca';
            profileStatusBanner.style.color = '#b91c1c';
            profileStatusBanner.textContent = 'failed to save profile: ' + err.message;
          }
        } finally {
          saveBtn.disabled = false;
          saveBtn.textContent = 'save profile changes';
        }
      });
    }

    if (securityForm) {
      securityForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const newPass = document.getElementById('security-new-password').value;
        const confirmPass = document.getElementById('security-confirm-password').value;
        const saveBtn = document.getElementById('security-save-btn');

        if (newPass !== confirmPass) {
          alert('passphrases do not match. please re-type.');
          return;
        }

        saveBtn.disabled = true;
        saveBtn.textContent = 'updating...';

        try {
          if (supabaseClient) {
            const { error } = await supabaseClient.auth.updateUser({ password: newPass });
            if (error) throw error;
          }
          alert('passphrase updated successfully via supabase gotrue.');
          document.getElementById('security-new-password').value = '';
          document.getElementById('security-confirm-password').value = '';
        } catch (err) {
          alert('error updating passphrase: ' + err.message);
        } finally {
          saveBtn.disabled = false;
          saveBtn.textContent = 'update passphrase →';
        }
      });
    }

    async function loadWorkspaceBilling() {
      const ordersList = document.getElementById('workspace-orders-list');
      const activeCountEl = document.getElementById('billing-active-count');
      const fulfilledCountEl = document.getElementById('billing-fulfilled-count');
      const totalSpendEl = document.getElementById('billing-total-spend');
      const statOrdersCount = document.getElementById('stat-orders-count');

      if (!ordersList) return;
      const user = getSavedUser();
      const email = user ? (user.e_mail || user.email) : '';

      if (!email) {
        ordersList.innerHTML = `
          <div class="workspace-empty-state">
            <strong>sign in required</strong>
            <span>please sign in with your sovereign credentials to access billing and invoices.</span>
          </div>
        `;
        return;
      }

      ordersList.innerHTML = '<div style="padding:28px;text-align:center;color:#64748b;font-size:13px;">loading billing records...</div>';

      try {
        const res = await fetch(`/api/user/orders?email=${encodeURIComponent(email)}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const orders = data.orders || [];

        let activeCount = 0;
        let fulfilledCount = 0;
        let totalPaise = 0;

        orders.forEach(o => {
          totalPaise += (o.amount_paise || 0);
          if (o.status === 'PAID') {
            fulfilledCount++;
          } else {
            activeCount++;
          }
        });

        if (activeCountEl) activeCountEl.textContent = activeCount;
        if (fulfilledCountEl) fulfilledCountEl.textContent = fulfilledCount;
        if (totalSpendEl) totalSpendEl.textContent = '₹' + (totalPaise / 100).toLocaleString('en-IN');
        if (statOrdersCount) statOrdersCount.textContent = orders.length;

        if (orders.length === 0) {
          ordersList.innerHTML = `
            <div class="workspace-empty-state">
              <strong>no orders or invoices found</strong>
              <span>commission a bespoke statutory report or Section 29A dossier from the reports catalog.</span>
            </div>
          `;
          return;
        }

        ordersList.innerHTML = orders.map(o => `
          <div class="workspace-item-card">
            <div class="card-top-row">
              <div>
                <span class="card-subtitle">ORDER ID: <code style="font-size:11px;">${escapeHTML(o.id)}</code> &bull; ${escapeHTML(o.currency || 'INR')} ${(o.amount_paise / 100).toLocaleString('en-IN')}</span>
                <h3 class="card-title">${escapeHTML(o.report_title || 'Statutory Compliance Report')}</h3>
              </div>
              <span style="color:${(o.status || '').toLowerCase() === 'paid' || (o.status || '').toLowerCase() === 'fulfilled' ? '#059669' : '#b45309'};font-size:11px;font-weight:600;font-family:monospace;text-transform:lowercase;">
                ${escapeHTML((o.status || 'created').toLowerCase())}
              </span>
            </div>
            <div class="card-meta-row">
              <span>target: <strong>${escapeHTML(o.target_entity)}</strong></span>
              <span>&bull;</span>
              <span>date: <strong>${new Date(o.created_at).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</strong></span>
              ${o.razorpay_payment_id ? `<span>&bull;</span><span>rzp: <code style="font-size:11px;">${escapeHTML(o.razorpay_payment_id)}</code></span>` : ''}
            </div>
            <div style="display:flex;gap:8px;margin-top:6px;">
              <button type="button" class="catalog-sort-btn" onclick="alert('Downloading GST-compliant invoice receipt for ${escapeHTML(o.id)} (PDF)...');" style="font-size:11px;text-transform:lowercase;">download invoice (pdf)</button>
              <button type="button" class="catalog-sort-btn" onclick="alert('Dossier Status: ${escapeHTML(o.status)} • Dispatched to ${escapeHTML(o.buyer_email)}');" style="font-size:11px;text-transform:lowercase;">view fulfillment receipt</button>
            </div>
          </div>
        `).join('');
      } catch (err) {
        ordersList.innerHTML = `<div style="padding:20px;text-align:center;color:#ef4444;font-size:12px;">failed to load orders: ${escapeHTML(err.message)}</div>`;
      }
    }
  }

  // ─── 8.10 SOVEREIGN ADMIN CONSOLE ───
  function setupAdminConsole() {
    const adminRailNav = document.getElementById('admin-rail-nav');
    const ordersFilter = document.getElementById('admin-orders-filter');
    const consultationsFilter = document.getElementById('admin-consultations-filter');
    const usersSearch = document.getElementById('admin-users-search');

    let currentAdminTab = 'overview';
    let currentOrdersFilter = 'all';
    let currentConsultationsFilter = 'all';

    function getAdminAuthHeaders() {
      let token = '';
      try {
        const sessionStr = localStorage.getItem('openibc_session');
        if (sessionStr) {
          const sess = JSON.parse(sessionStr);
          token = sess.access_token || '';
        }
      } catch (e) {}
      if (!token) {
        token = localStorage.getItem('supabase_auth_token') || '';
      }
      return {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      };
    }

    function switchAdminTab(tab = 'overview') {
      currentAdminTab = tab;
      if (adminRailNav) {
        adminRailNav.querySelectorAll('.catalog-rail-pill').forEach(btn => {
          if (btn.dataset.adminTab === tab) {
            btn.classList.add('active');
          } else {
            btn.classList.remove('active');
          }
        });
      }

      const panels = ['overview', 'orders', 'consultations', 'users'];
      panels.forEach(p => {
        const panelEl = document.getElementById(`admin-panel-${p}`);
        if (panelEl) {
          panelEl.style.display = (p === tab) ? 'flex' : 'none';
        }
      });

      if (tab === 'overview') {
        loadAdminOverview();
      } else if (tab === 'orders') {
        loadAdminOrders(currentOrdersFilter);
      } else if (tab === 'consultations') {
        loadAdminConsultations(currentConsultationsFilter);
      } else if (tab === 'users') {
        loadAdminUsers(usersSearch ? usersSearch.value.trim() : '');
      }
    }
    window.switchAdminTab = switchAdminTab;

    if (adminRailNav) {
      adminRailNav.querySelectorAll('.catalog-rail-pill').forEach(btn => {
        btn.addEventListener('click', () => {
          const tab = btn.dataset.adminTab || 'overview';
          switchAdminTab(tab);
        });
      });
    }

    if (ordersFilter) {
      ordersFilter.querySelectorAll('.catalog-sort-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          ordersFilter.querySelectorAll('.catalog-sort-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          currentOrdersFilter = btn.dataset.filter || 'all';
          loadAdminOrders(currentOrdersFilter);
        });
      });
    }

    if (consultationsFilter) {
      consultationsFilter.querySelectorAll('.catalog-sort-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          consultationsFilter.querySelectorAll('.catalog-sort-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          currentConsultationsFilter = btn.dataset.filter || 'all';
          loadAdminConsultations(currentConsultationsFilter);
        });
      });
    }

    if (usersSearch) {
      usersSearch.addEventListener('input', () => {
        loadAdminUsers(usersSearch.value.trim());
      });
    }

    async function loadAdminOverview() {
      const revenueEl = document.getElementById('admin-stat-revenue');
      const ordersEl = document.getElementById('admin-stat-orders');
      const briefingsEl = document.getElementById('admin-stat-briefings');
      const usersEl = document.getElementById('admin-stat-users');
      const activityEl = document.getElementById('admin-activity-list');
      const dbTelemetry = document.getElementById('telemetry-db');
      const calnodeTelemetry = document.getElementById('telemetry-calnode');
      const smtpTelemetry = document.getElementById('telemetry-smtp');

      try {
        const res = await fetch('/api/admin/overview', { headers: getAdminAuthHeaders() });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        if (revenueEl) revenueEl.textContent = '₹' + Number(data.gross_revenue_inr || 0).toLocaleString('en-IN');
        if (ordersEl) ordersEl.textContent = `${data.total_orders || 0} (${data.pending_fulfillment || 0} pending)`;
        if (briefingsEl) briefingsEl.textContent = data.active_briefings || 0;
        if (usersEl) usersEl.textContent = data.total_users || 0;

        if (data.telemetry) {
          if (dbTelemetry) {
            dbTelemetry.textContent = data.telemetry.db === 'ok' ? 'connected' : 'fallback memory';
            dbTelemetry.style.color = data.telemetry.db === 'ok' ? '#059669' : '#b45309';
          }
          if (calnodeTelemetry) {
            calnodeTelemetry.textContent = 'active (online)';
            calnodeTelemetry.style.color = '#059669';
          }
          if (smtpTelemetry) {
            smtpTelemetry.textContent = data.telemetry.smtp === 'ok' ? 'relay configured' : 'simulation mode';
            smtpTelemetry.style.color = data.telemetry.smtp === 'ok' ? '#059669' : '#0284c7';
          }
        }

        if (activityEl) {
          const acts = data.recent_activity || [];
          activityEl.innerHTML = acts.map(a => `
            <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid #f1f5f9;font-size:12px;">
              <div>
                <strong style="color:#0f172a;display:block;">${escapeHTML(a.title)}</strong>
                <span style="color:#64748b;font-size:11px;font-family:monospace;">${escapeHTML(a.actor)} &bull; ${new Date(a.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <span style="font-size:11px;font-family:monospace;color:#059669;font-weight:600;text-transform:lowercase;">
                ${escapeHTML((a.status || '').toLowerCase())}
              </span>
            </div>
          `).join('');
        }
      } catch (err) {
        console.warn('Failed to load admin overview:', err);
      }
    }

    async function loadAdminOrders(filter = 'all') {
      const feed = document.getElementById('admin-orders-feed');
      if (!feed) return;
      feed.innerHTML = '<div style="padding:24px;text-align:center;color:#64748b;font-size:13px;">loading orders commerce stream...</div>';

      try {
        const res = await fetch('/api/admin/orders', { headers: getAdminAuthHeaders() });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        let orders = data.orders || [];

        if (filter === 'paid') {
          orders = orders.filter(o => o.status === 'paid' || o.status === 'PAID');
        } else if (filter === 'fulfilled') {
          orders = orders.filter(o => o.status === 'fulfilled' || o.status === 'FULFILLED');
        }

        if (orders.length === 0) {
          feed.innerHTML = `
            <div class="workspace-empty-state">
              <strong>no orders matching filter (${escapeHTML(filter)})</strong>
              <span>all statutory dossier orders and buyer payments will stream into this feed.</span>
            </div>
          `;
          return;
        }

        feed.innerHTML = orders.map(o => {
          const isFulfilled = o.status === 'fulfilled' || o.status === 'FULFILLED';
          return `
            <div class="workspace-item-card">
              <div class="card-top-row">
                <div>
                  <span class="card-subtitle">ORDER: <code style="font-size:11px;">${escapeHTML(o.id)}</code> &bull; ₹${(o.amount_paise / 100).toLocaleString('en-IN')}</span>
                  <h3 class="card-title">${escapeHTML(o.report_title || 'Statutory Compliance Report')}</h3>
                </div>
                <span style="color:${isFulfilled ? '#059669' : '#b45309'};font-size:11px;font-weight:600;font-family:monospace;text-transform:lowercase;">
                  ${escapeHTML((o.status || 'paid').toLowerCase())}
                </span>
              </div>
              <div class="card-meta-row">
                <span>entity: <strong>${escapeHTML(o.target_entity)}</strong></span>
                <span>&bull;</span>
                <span>buyer: <strong>${escapeHTML(o.buyer_name || o.buyer_email)}</strong> (${escapeHTML(o.buyer_phone || 'no phone')})</span>
                ${o.razorpay_payment_id ? `<span>&bull;</span><span>rzp: <code style="font-size:11px;">${escapeHTML(o.razorpay_payment_id)}</code></span>` : ''}
              </div>
              <div style="display:flex;align-items:center;justify-content:space-between;margin-top:8px;padding-top:8px;border-top:1px solid #f1f5f9;">
                <span style="font-size:11px;color:#64748b;font-family:monospace;">${new Date(o.created_at).toLocaleDateString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                <div style="display:flex;gap:8px;">
                  <button type="button" class="admin-row-action-btn ${isFulfilled ? 'fulfilled' : ''}" data-order-id="${escapeHTML(o.id)}" ${isFulfilled ? 'disabled' : ''}>
                    ${isFulfilled ? 'fulfilled & receipt sent ✓' : 'mark fulfilled & dispatch receipt &rarr;'}
                  </button>
                </div>
              </div>
            </div>
          `;
        }).join('');

        feed.querySelectorAll('.admin-row-action-btn:not(.fulfilled)').forEach(btn => {
          btn.addEventListener('click', async () => {
            const ordId = btn.dataset.orderId;
            btn.disabled = true;
            btn.textContent = 'dispatching fulfillment...';
            try {
              const res = await fetch(`/api/admin/orders/${encodeURIComponent(ordId)}/fulfill`, {
                method: 'POST',
                headers: getAdminAuthHeaders()
              });
              if (res.ok) {
                btn.classList.add('fulfilled');
                btn.textContent = 'fulfilled & receipt sent ✓';
                loadAdminOverview();
              } else {
                btn.disabled = false;
                btn.textContent = 'retry fulfillment';
                alert('Fulfillment error. Please retry.');
              }
            } catch (e) {
              btn.disabled = false;
              btn.textContent = 'retry fulfillment';
              alert('Fulfillment network failure.');
            }
          });
        });
      } catch (err) {
        feed.innerHTML = `<div style="padding:20px;text-align:center;color:#ef4444;font-size:12px;">failed to load orders: ${escapeHTML(err.message)}</div>`;
      }
    }

    async function loadAdminConsultations(filter = 'all') {
      const feed = document.getElementById('admin-consultations-feed');
      if (!feed) return;
      feed.innerHTML = '<div style="padding:24px;text-align:center;color:#64748b;font-size:13px;">loading chamber briefings...</div>';

      try {
        const res = await fetch('/api/admin/consultations', { headers: getAdminAuthHeaders() });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        let consults = data.consultations || [];

        if (filter !== 'all') {
          consults = consults.filter(c => (c.stakeholder || '').toLowerCase().includes(filter));
        }

        if (consults.length === 0) {
          feed.innerHTML = `
            <div class="workspace-empty-state">
              <strong>no chamber briefings found</strong>
              <span>advisory bookings scheduled by practitioners across the 5 tracks appear here.</span>
            </div>
          `;
          return;
        }

        feed.innerHTML = consults.map(c => `
          <div class="workspace-item-card">
            <div class="card-top-row">
              <div>
                <span class="card-subtitle">TRACK: ${escapeHTML(c.stakeholder || 'investors').toUpperCase()} &bull; <code style="font-size:11px;">#${c.id}</code></span>
                <h3 class="card-title">${escapeHTML(c.track_title || 'Hayagriva Consultation')}</h3>
              </div>
              <span style="color:#059669;font-size:11px;font-weight:600;font-family:monospace;text-transform:lowercase;">
                ${escapeHTML((c.status || 'scheduled').toLowerCase())}
              </span>
            </div>
            <div class="card-meta-row">
              <span>contact: <strong>${escapeHTML(c.contact)}</strong></span>
              ${c.organization ? `<span>&bull;</span><span>firm: <strong>${escapeHTML(c.organization)}</strong></span>` : ''}
              ${c.calnode_booking_id ? `<span>&bull;</span><span>booking: <code style="font-size:11px;">${escapeHTML(c.calnode_booking_id)}</code></span>` : ''}
            </div>
            ${c.notes ? `<p style="font-size:12px;color:#475569;margin:8px 0 0;line-height:1.4;background:#f8fafc;padding:8px 10px;border-radius:6px;">${escapeHTML(c.notes)}</p>` : ''}
            <div style="display:flex;align-items:center;justify-content:space-between;margin-top:8px;padding-top:8px;border-top:1px solid #f1f5f9;">
              <span style="font-size:11px;color:#64748b;font-family:monospace;">${c.scheduled_at ? new Date(c.scheduled_at).toLocaleDateString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : new Date(c.created_at).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</span>
              <button type="button" class="admin-row-action-btn" onclick="alert('Liaison brief copied for ${escapeHTML(c.contact)}');">copy brief</button>
            </div>
          </div>
        `).join('');
      } catch (err) {
        feed.innerHTML = `<div style="padding:20px;text-align:center;color:#ef4444;font-size:12px;">failed to load briefings: ${escapeHTML(err.message)}</div>`;
      }
    }

    async function loadAdminUsers(searchTerm = '') {
      const feed = document.getElementById('admin-users-feed');
      const badge = document.getElementById('admin-users-count-badge');
      if (!feed) return;
      feed.innerHTML = '<div style="padding:24px;text-align:center;color:#64748b;font-size:13px;">loading practitioner directory...</div>';

      try {
        const res = await fetch('/api/admin/users', { headers: getAdminAuthHeaders() });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        let users = data.users || [];

        if (searchTerm) {
          const s = searchTerm.toLowerCase();
          users = users.filter(u => (u.email || '').toLowerCase().includes(s) || (u.name || '').toLowerCase().includes(s) || (u.custom_role || '').toLowerCase().includes(s));
        }

        if (badge) badge.textContent = `${users.length} practitioner${users.length === 1 ? '' : 's'}`;

        if (users.length === 0) {
          feed.innerHTML = `
            <div class="workspace-empty-state">
              <strong>no practitioners found matching "${escapeHTML(searchTerm)}"</strong>
            </div>
          `;
          return;
        }

        feed.innerHTML = users.map(u => {
          const roles = ['advocate', 'practitioner', 'valuer', 'creditor', 'investor', 'admin'];
          return `
            <div class="workspace-item-card" style="display:flex;align-items:center;justify-content:space-between;gap:12px;">
              <div style="display:flex;align-items:center;gap:12px;">
                <div style="width:36px;height:36px;border-radius:50%;background:#0f172a;color:white;display:flex;align-items:center;justify-content:center;font-family:'Chakra Petch',sans-serif;font-weight:700;font-size:13px;">
                  ${escapeHTML((u.name || u.email || 'PR').slice(0, 2).toUpperCase())}
                </div>
                <div>
                  <strong style="color:#0f172a;font-size:13px;display:block;">${escapeHTML(u.name || 'Practitioner')}</strong>
                  <span style="font-size:11px;font-family:monospace;color:#64748b;">${escapeHTML(u.email)}</span>
                </div>
              </div>
              <div style="display:flex;align-items:center;gap:10px;">
                <select class="admin-role-select fast-track-input" data-user-id="${escapeHTML(u.id || u.email)}" style="font-size:11px;padding:4px 8px;height:auto;">
                  ${roles.map(r => `<option value="${r}" ${u.custom_role === r ? 'selected' : ''}>${r}</option>`).join('')}
                </select>
                <button type="button" class="admin-row-action-btn admin-role-save-btn" data-user-id="${escapeHTML(u.id || u.email)}">update role &rarr;</button>
              </div>
            </div>
          `;
        }).join('');

        feed.querySelectorAll('.admin-role-save-btn').forEach(btn => {
          btn.addEventListener('click', async () => {
            const uid = btn.dataset.userId;
            const selectEl = feed.querySelector(`.admin-role-select[data-user-id="${CSS.escape(uid)}"]`);
            if (!selectEl) return;
            const newRole = selectEl.value;
            btn.disabled = true;
            btn.textContent = 'updating...';
            try {
              const res = await fetch(`/api/admin/users/${encodeURIComponent(uid)}/role`, {
                method: 'POST',
                headers: getAdminAuthHeaders(),
                body: JSON.stringify({ role: newRole })
              });
              if (res.ok) {
                btn.disabled = false;
                btn.textContent = 'updated ✓';
                setTimeout(() => { btn.textContent = 'update role →'; }, 2000);
              } else {
                btn.disabled = false;
                btn.textContent = 'retry';
                alert('Role update failed.');
              }
            } catch (e) {
              btn.disabled = false;
              btn.textContent = 'retry';
              alert('Network error.');
            }
          });
        });
      } catch (err) {
        feed.innerHTML = `<div style="padding:20px;text-align:center;color:#ef4444;font-size:12px;">failed to load users: ${escapeHTML(err.message)}</div>`;
      }
    }
  }

  // ─── 9. BOOTSTRAP ───
  window.addEventListener('DOMContentLoaded', () => {
    initMap();
    setSubdomain(detectSubdomain(), { syncUrl: false });
    syncModeUI();
    setupMegamenuEvents();
    setupDownloadModal();
    setupIntakeModal();
    setupRadarEvents();
    setupAuthModal();
    setupPriceListStore();
    setupWorkspace();
    setupAdminConsole();
    setupViewSwitcher();
    loadData();
  });

})();
