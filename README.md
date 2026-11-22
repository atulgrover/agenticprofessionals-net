# Agentic Professionals Network (`agenticprofessionals-net`)

Sovereign multi-domain operating system for modern legal, restructuring, and criminal justice practitioners.

A **single, high-speed Go binary** that powers the entire Agentic Professionals network across multiple domains and subdomains on a **single Render Web Service (100% Free Tier compatible)**:

1. **Root Gateway:** `https://agenticprofessionals.net` (and alias `https://www.agenticprofessionals.net`)
2. **IBC Practice Hub:** `https://ibc.agenticprofessionals.net`
3. **BNS Criminal Law Hub:** `https://bns.agenticprofessionals.net`

---

## Architecture Highlights

- **Single Engine, Zero Node.js:** 100% compiled Go backend (`net/http`) serving clean buildless static frontends (vanilla HTML5, CSS3, ES modules).
- **Host-Header Routing (`MultiHostRouter`):** Inspects incoming HTTP `Host` headers to dispatch traffic dynamically to the correct domain handler:
  - `ibc.*` &rarr; IBC Insolvency Restructuring Hub (`public/ibc/`)
  - `bns.*` &rarr; BNS Criminal Jurisprudence Hub (`public/bns/`)
  - Default / `agenticprofessionals.net` / `www.*` &rarr; Root Gateway (`public/home/`)
- **Single Render Web Service (750 Free Hours):** Because the whole network is a single compiled Go binary on one port, you deploy **1 Web Service on Render** running 24/7 for $0/month.
- **Embedded Calnode Scheduling:** In-process consultation scheduler (`/embed.js`, `/v1/bookings`) with zero external daemons.
- **Unified Supabase Integration:** Single database pool for practitioner accounts, statutory leads, and telemetry.

---

## Directory Structure

```
agenticprofessionals-net/
├── cmd/
│   └── server/
│       └── main.go           # Master host-router & entrypoint
├── internal/
│   ├── shared/               # Shared DB connection pool, CORS, and streaming utils
│   ├── home/                 # Root Gateway handlers & health endpoints
│   ├── ibc/                  # IBC Insolvency hub handlers, Calnode & forum
│   └── bns/                  # BNS Criminal law hub handlers, Calnode & forum
├── public/
│   ├── home/                 # agenticprofessionals.net HTML/CSS/JS
│   ├── ibc/                  # ibc.agenticprofessionals.net HTML/CSS/JS
│   └── bns/                  # bns.agenticprofessionals.net HTML/CSS/JS
├── render.yaml               # Render 1-click Blueprint
├── go.mod
├── go.sum
└── README.md
```

---

## Local Development

### 1. Build & Run

```bash
# Build binary
go build -o bin/server ./cmd/server

# Run
./bin/server
```

The server binds to `http://localhost:8080`.

### 2. Multi-Domain Testing Locally

You can test all domains on the single port via query parameter or header:
- **Root Gateway:** `http://localhost:8080`
- **IBC Practice Hub:** `http://localhost:8080/?domain=ibc`
- **BNS Criminal Hub:** `http://localhost:8080/?domain=bns`

In local development, the Go server also automatically launches backward-compatible listeners on:
- `http://localhost:3000` &rarr; Root Gateway
- `http://localhost:3002` &rarr; IBC Hub
- `http://localhost:3003` &rarr; BNS Hub

---

## Production Deployment on Render

1. Create a new Web Service on Render linked to `github.com/atulgrover/agenticprofessionals-net`.
2. Configure settings:
   - **Environment:** `Go`
   - **Build Command:** `go build -o bin/server ./cmd/server`
   - **Start Command:** `./bin/server`
3. In the Render Dashboard under **Settings &rarr; Custom Domains**, add all 4 domains:
   - `agenticprofessionals.net`
   - `www.agenticprofessionals.net`
   - `ibc.agenticprofessionals.net`
   - `bns.agenticprofessionals.net`
4. Set the `DATABASE_URL` environment variable to your Supabase connection string.
5. Render will issue free SSL certificates for all 4 domains automatically.
