package shared

import (
	"database/sql"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	_ "github.com/lib/pq"
)

// StaticResponseWriter wraps http.ResponseWriter to hide optional interfaces
// such as io.ReaderFrom. This ensures standard user-space buffered streaming
// and avoids Darwin sendfile(2) system call restrictions in sandboxed runtimes.
type StaticResponseWriter struct {
	http.ResponseWriter
}

// EnableCORS writes standard permissive CORS headers.
func EnableCORS(w http.ResponseWriter) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS, POST")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
	w.Header().Set("Cache-Control", "public, max-age=60, s-maxage=300")
}

// LoadDotEnvIfPresent reads a KEY=VALUE .env file if it exists and sets environment
// variables for keys not already defined in the process environment.
func LoadDotEnvIfPresent(path string) {
	data, err := os.ReadFile(path)
	if err != nil {
		return
	}
	lines := strings.Split(string(data), "\n")
	for _, rawLine := range lines {
		line := strings.TrimSpace(rawLine)
		if line == "" || strings.HasPrefix(line, "#") {
			continue
		}
		if strings.HasPrefix(line, "export ") {
			line = strings.TrimPrefix(line, "export ")
			line = strings.TrimSpace(line)
		}
		if line == "" || strings.HasPrefix(line, "#") {
			continue
		}
		parts := strings.SplitN(line, "=", 2)
		if len(parts) != 2 {
			continue
		}
		key := strings.TrimSpace(parts[0])
		val := strings.TrimSpace(parts[1])
		if (strings.HasPrefix(val, "\"") && strings.HasSuffix(val, "\"")) ||
			(strings.HasPrefix(val, "'") && strings.HasSuffix(val, "'")) {
			if len(val) >= 2 {
				val = val[1 : len(val)-1]
			}
		}
		if key == "" {
			continue
		}
		if _, exists := os.LookupEnv(key); !exists {
			_ = os.Setenv(key, val)
		}
	}
}

// InitDB initializes the Supabase/Neon PostgreSQL database pool.
func InitDB() *sql.DB {
	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		dbURL = os.Getenv("SUPABASE_DATABASE_URL")
	}
	if dbURL == "" {
		dbURL = os.Getenv("SUPABASE_POOLER_URL")
	}
	if dbURL == "" {
		log.Println("[WARN] DATABASE_URL / SUPABASE_DATABASE_URL is not set — running in FALLBACK MODE.")
		return nil
	}

	db, err := sql.Open("postgres", dbURL)
	if err != nil {
		log.Printf("[WARN] Failed to open database: %v\n", err)
		return nil
	}

	db.SetMaxOpenConns(10)
	db.SetMaxIdleConns(5)
	db.SetConnMaxLifetime(5 * time.Minute)

	if err = db.Ping(); err != nil {
		log.Printf("[WARN] Database ping failed (will use fallback data): %v\n", err)
	} else {
		log.Println("[INFO] Successfully connected to Supabase PostgreSQL!")
		_, err = db.Exec(`
			CREATE TABLE IF NOT EXISTS consultation_leads (
				id SERIAL PRIMARY KEY,
				track_title VARCHAR(255) NOT NULL,
				stakeholder VARCHAR(50) NOT NULL,
				contact VARCHAR(255) NOT NULL,
				organization VARCHAR(255),
				notes TEXT,
				status VARCHAR(50) DEFAULT 'PENDING' NOT NULL,
				calnode_booking_id VARCHAR(120),
				scheduled_at TIMESTAMP WITH TIME ZONE,
				created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
			);
			ALTER TABLE consultation_leads ADD COLUMN IF NOT EXISTS calnode_booking_id VARCHAR(120);
			ALTER TABLE consultation_leads ADD COLUMN IF NOT EXISTS scheduled_at TIMESTAMP WITH TIME ZONE;
		`)
		if err != nil {
			log.Printf("[WARN] Failed to create consultation_leads table: %v\n", err)
		}
	}

	return db
}
