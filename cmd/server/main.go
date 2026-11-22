package main

import (
	"log"
	"net"
	"net/http"
	"os"
	"path/filepath"
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
	// 1. Direct portal path switchers: /bns, /ibc, /home
	switch r.URL.Path {
	case "/bns", "/bns/":
		http.SetCookie(w, &http.Cookie{
			Name:     "ap_portal",
			Value:    "bns",
			Path:     "/",
			MaxAge:   86400 * 30, // 30 days
			SameSite: http.SameSiteLaxMode,
		})
		http.Redirect(w, r, "/", http.StatusFound)
		return
	case "/ibc", "/ibc/":
		http.SetCookie(w, &http.Cookie{
			Name:     "ap_portal",
			Value:    "ibc",
			Path:     "/",
			MaxAge:   86400 * 30,
			SameSite: http.SameSiteLaxMode,
		})
		http.Redirect(w, r, "/", http.StatusFound)
		return
	case "/home", "/home/":
		http.SetCookie(w, &http.Cookie{
			Name:     "ap_portal",
			Value:    "home",
			Path:     "/",
			MaxAge:   86400 * 30,
			SameSite: http.SameSiteLaxMode,
		})
		http.Redirect(w, r, "/", http.StatusFound)
		return
	}

	host := r.Host
	if h, _, err := net.SplitHostPort(host); err == nil {
		host = h
	}

	// 2. URL Query parameter override (?domain=ibc or ?domain=bns or ?domain=home)
	if q := r.URL.Query().Get("domain"); q != "" {
		http.SetCookie(w, &http.Cookie{
			Name:     "ap_portal",
			Value:    q,
			Path:     "/",
			MaxAge:   86400 * 30,
			SameSite: http.SameSiteLaxMode,
		})
		host = q
	}

	// 3. Reverse proxy / cloud header inspection
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

	// 4. If host is not an explicit subdomain, check cookie preference
	isExplicitSubdomain := strings.HasPrefix(host, "ibc.") || strings.HasPrefix(host, "bns.") || host == "ibc" || host == "bns"
	if !isExplicitSubdomain {
		if c, err := r.Cookie("ap_portal"); err == nil && c.Value != "" {
			host = c.Value
		}
	}

	// 5. Domain Dispatch:
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

func resolveStaticDir(rel string) string {
	if _, err := os.Stat(rel); err == nil {
		return rel
	}
	exe, err := os.Executable()
	if err == nil {
		dir := filepath.Dir(exe)
		cand := filepath.Join(dir, "..", rel)
		if _, err := os.Stat(cand); err == nil {
			return cand
		}
		cand2 := filepath.Join(dir, rel)
		if _, err := os.Stat(cand2); err == nil {
			return cand2
		}
	}
	return rel
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
	homeHandler := home.NewRouter(db, resolveStaticDir("public/home"))
	ibcHandler := ibc.NewRouter(db, resolveStaticDir("public/ibc"))
	bnsHandler := bns.NewRouter(db, resolveStaticDir("public/bns"))

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
