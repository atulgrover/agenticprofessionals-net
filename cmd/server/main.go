package main

import (
	"log"
	"net"
	"net/http"
	"os"
	"strings"

	"github.com/atulgrover/agenticprofessionals-net/internal/bns"
	"github.com/atulgrover/agenticprofessionals-net/internal/home"
	"github.com/atulgrover/agenticprofessionals-net/internal/ibc"
	"github.com/atulgrover/agenticprofessionals-net/internal/shared"
)

// MultiHostRouter directs incoming requests to the appropriate domain handler
// based on the HTTP Host header or custom override headers/parameters.
type MultiHostRouter struct {
	home http.Handler
	ibc  http.Handler
	bns  http.Handler
}

func (m *MultiHostRouter) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	host := r.Host
	if h, _, err := net.SplitHostPort(host); err == nil {
		host = h
	}

	// 1. URL Query parameter override for easy debugging (?domain=ibc or ?domain=bns)
	if q := r.URL.Query().Get("domain"); q != "" {
		host = q
	}

	// 2. Reverse proxy / cloud header inspection
	if xh := r.Header.Get("X-Forwarded-Host"); xh != "" {
		if h, _, err := net.SplitHostPort(xh); err == nil {
			host = h
		} else {
			host = xh
		}
	}
	if xs := r.Header.Get("X-Subdomain"); xs != "" {
		host = xs
	}

	host = strings.ToLower(host)

	// 3. Domain Dispatch:
	// - ibc.agenticprofessionals.net / ibc.* -> IBC Practice Hub
	// - bns.agenticprofessionals.net / bns.* -> BNS Criminal Law Hub
	// - agenticprofessionals.net / www.* / fallback -> Root Gateway
	switch {
	case strings.HasPrefix(host, "ibc.") || host == "ibc":
		m.ibc.ServeHTTP(w, r)
	case strings.HasPrefix(host, "bns.") || host == "bns":
		m.bns.ServeHTTP(w, r)
	default:
		m.home.ServeHTTP(w, r)
	}
}

func main() {
	shared.LoadDotEnvIfPresent(".env")

	db := shared.InitDB()
	defer func() {
		if db != nil {
			_ = db.Close()
		}
	}()

	// Instantiate Domain Handlers
	homeHandler := home.NewRouter(db, "public/home")
	ibcHandler := ibc.NewRouter(db, "public/ibc")
	bnsHandler := bns.NewRouter(db, "public/bns")

	masterRouter := &MultiHostRouter{
		home: homeHandler,
		ibc:  ibcHandler,
		bns:  bnsHandler,
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	isRender := os.Getenv("RENDER") != "" || os.Getenv("RENDER_SERVICE_ID") != ""

	// In local dev mode (not Render), spawn dedicated backward-compatible listeners
	// on ports 3000, 3002, 3003 in background goroutines if ports are available.
	if !isRender && os.Getenv("DISABLE_DEV_PORTS") != "true" {
		startDevListener := func(portStr, name string, handler http.Handler) {
			l, err := net.Listen("tcp", ":"+portStr)
			if err != nil {
				log.Printf("[DEV_PORT] Port %s in use or unavailable (%s), skipping dedicated listener\n", portStr, name)
				return
			}
			log.Printf("[DEV_PORT] %s listening locally on http://localhost:%s\n", name, portStr)
			go func() {
				if err := http.Serve(l, handler); err != nil && err != http.ErrServerClosed {
					log.Printf("[DEV_PORT] %s listener stopped: %v\n", name, err)
				}
			}()
		}

		startDevListener("3000", "Root Gateway", homeHandler)
		startDevListener("3002", "IBC Practice Hub", ibcHandler)
		startDevListener("3003", "BNS Criminal Law Hub", bnsHandler)
	}

	addr := ":" + port
	log.Printf("[INFO] ================================================================")
	log.Printf("[INFO] Agentic Professionals Multi-Domain Sovereign Engine")
	log.Printf("[INFO] ================================================================")
	log.Printf("[INFO] Unified Host Router listening on http://localhost%s\n", addr)
	log.Printf("[INFO]   • Root Gateway:    http://agenticprofessionals.net (or localhost%s)\n", addr)
	log.Printf("[INFO]   • IBC Hub:         http://ibc.agenticprofessionals.net (or ?domain=ibc)\n")
	log.Printf("[INFO]   • BNS Hub:         http://bns.agenticprofessionals.net (or ?domain=bns)\n")
	log.Printf("[INFO] ================================================================")

	if err := http.ListenAndServe(addr, masterRouter); err != nil {
		log.Fatalf("Server failed: %v", err)
	}
}
