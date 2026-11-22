package bns

import (
	"bytes"
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"strings"
	"sync"
	"time"

	"github.com/lib/pq"
	"github.com/yuin/goldmark"
	"github.com/yuin/goldmark/extension"
	"github.com/yuin/goldmark/parser"
	"github.com/yuin/goldmark/renderer/html"
)

// ForumQuestion represents a statutory question in the OpenIBC forum.
type ForumQuestion struct {
	ID                   int64     `json:"id"`
	AuthorID             *string   `json:"author_id,omitempty"`
	AuthorName           string    `json:"author_name"`
	AuthorRole           string    `json:"author_role"`
	Title                string    `json:"title"`
	Slug                 string    `json:"slug"`
	ContentMarkdown      string    `json:"content_markdown"`
	ContentHTML          string    `json:"content_html,omitempty"`
	Tags                 []string  `json:"tags"`
	StakeholderTrack     string    `json:"stakeholder_track"`
	IsStatutoryPrecedent bool      `json:"is_statutory_precedent"`
	ViewCount            int       `json:"view_count"`
	AnswerCount          int       `json:"answer_count"`
	CreatedAt            time.Time `json:"created_at"`
	UpdatedAt            time.Time `json:"updated_at"`
}

// ForumAnswer represents a response/verdict to a statutory question.
type ForumAnswer struct {
	ID                  int64     `json:"id"`
	QuestionID          int64     `json:"question_id"`
	AuthorID            *string   `json:"author_id,omitempty"`
	AuthorName          string    `json:"author_name"`
	AuthorRole          string    `json:"author_role"`
	ContentMarkdown     string    `json:"content_markdown"`
	ContentHTML         string    `json:"content_html,omitempty"`
	IsVerifiedStatutory bool      `json:"is_verified_statutory"`
	Upvotes             int       `json:"upvotes"`
	CreatedAt           time.Time `json:"created_at"`
	UpdatedAt           time.Time `json:"updated_at"`
}

// ForumService manages Q&A queries and markdown conversion.
type ForumService struct {
	db               *sql.DB
	md               goldmark.Markdown
	mu               sync.RWMutex
	fallbackQuestions []ForumQuestion
	fallbackAnswers  map[int64][]ForumAnswer
}

// NewForumService creates a new ForumService instance.
func NewForumService(db *sql.DB) *ForumService {
	md := goldmark.New(
		goldmark.WithExtensions(extension.GFM),
		goldmark.WithParserOptions(
			parser.WithAutoHeadingID(),
		),
		goldmark.WithRendererOptions(
			html.WithHardWraps(),
			html.WithXHTML(),
		),
	)

	s := &ForumService{
		db:              db,
		md:              md,
		fallbackAnswers: make(map[int64][]ForumAnswer),
	}
	s.seedFallbackQuestions()
	return s
}

// RenderMarkdown safely transforms markdown text into styled HTML.
func (s *ForumService) RenderMarkdown(raw string) string {
	var buf bytes.Buffer
	if err := s.md.Convert([]byte(raw), &buf); err != nil {
		return raw
	}
	return buf.String()
}

// seedFallbackQuestions populates canonical statutory precedents.
func (s *ForumService) seedFallbackQuestions() {
	s.mu.Lock()
	defer s.mu.Unlock()

	now := time.Now().UTC()

	q1 := ForumQuestion{
		ID:                   1,
		AuthorName:           "Criminal Justice Bar Association",
		AuthorRole:           "advocate",
		Title:                "How does Section 479 BNSS mandate undertrial release for first-time offenders who completed 1/3rd detention?",
		Slug:                 "section-479-bnss-undertrial-bail-first-time-offender",
		ContentMarkdown:      "Under the newly enacted Bharatiya Nagarik Suraksha Sanhita, 2023 (BNSS), Section 479(1) introduces a progressive proviso for first-time offenders. If an undertrial has undergone detention extending up to one-third of the maximum period of imprisonment specified for that offense under the Bharatiya Nyaya Sanhita, 2023 (BNS), what is the judicial discretion of the Court to deny bail?",
		Tags:                 []string{"section-479", "bnss", "undertrial-bail", "first-time-offender", "liberty"},
		StakeholderTrack:     "advocates",
		IsStatutoryPrecedent: true,
		ViewCount:            142,
		AnswerCount:          1,
		CreatedAt:            now.Add(-48 * time.Hour),
		UpdatedAt:            now.Add(-48 * time.Hour),
	}
	q1.ContentHTML = s.RenderMarkdown(q1.ContentMarkdown)

	a1 := ForumAnswer{
		ID:                  1,
		QuestionID:          1,
		AuthorName:          "BNS Statutory Desk",
		AuthorRole:          "advocate",
		ContentMarkdown:     "In *Satender Kumar Antil v. CBI* (2022) 10 SCC 51, read with the statutory enactment of the First Proviso to Section 479(1) BNSS, release of a first-time offender (who has never previously been convicted of any offense) upon completing one-third of the statutory sentence is mandatory unless the offense is punishable by death or life imprisonment. The Jail Superintendent is statutorily obligated to file an application on the prisoner's behalf.",
		IsVerifiedStatutory: true,
		Upvotes:             28,
		CreatedAt:           now.Add(-47 * time.Hour),
		UpdatedAt:           now.Add(-47 * time.Hour),
	}
	a1.ContentHTML = s.RenderMarkdown(a1.ContentMarkdown)

	q2 := ForumQuestion{
		ID:                   2,
		AuthorName:           "State Police Academy Research Wing",
		AuthorRole:           "investigator",
		Title:                "What are the mandatory Section 105 BNSS audio-video recording procedures during search and seizure?",
		Slug:                 "section-105-bnss-mandatory-audio-video-search-seizure",
		ContentMarkdown:      "Section 105 BNSS mandates that the process of conducting search of a place or seizure of any property shall be recorded through audio-video electronic means preferably by mobile phone. What is the evidentiary consequence under the Bharatiya Sakshya Adhiniyam, 2023 (BSA) if the police fail to record the seizure?",
		Tags:                 []string{"section-105", "bnss", "search-seizure", "videography", "electronic-evidence"},
		StakeholderTrack:     "investigators",
		IsStatutoryPrecedent: true,
		ViewCount:            98,
		AnswerCount:          1,
		CreatedAt:            now.Add(-72 * time.Hour),
		UpdatedAt:            now.Add(-72 * time.Hour),
	}
	q2.ContentHTML = s.RenderMarkdown(q2.ContentMarkdown)

	a2 := ForumAnswer{
		ID:                  2,
		QuestionID:          2,
		AuthorName:          "BNS Statutory Desk",
		AuthorRole:          "investigator",
		ContentMarkdown:     "Section 105 BNSS read with Section 63 BSA establishes that failure to record search and seizure through audio-video electronic means creates a statutory procedural defect. While irregular seizure does not automatically vitiate trial per *State of Maharashtra v. Natwarlal Damodardas Soni* (1980) 4 SCC 669, the non-compliance deprives the prosecution of the statutory presumption of regularity under Section 119 BSA and entitles the accused to cast doubt on the seizure memo (Panchnama).",
		IsVerifiedStatutory: true,
		Upvotes:             34,
		CreatedAt:           now.Add(-70 * time.Hour),
		UpdatedAt:           now.Add(-70 * time.Hour),
	}
	a2.ContentHTML = s.RenderMarkdown(a2.ContentMarkdown)

	q3 := ForumQuestion{
		ID:                   3,
		AuthorName:           "Digital Evidence & Cyber Forensic Forum",
		AuthorRole:           "forensic",
		Title:                "How does Section 63 BSA replace Section 65B Indian Evidence Act for electronic record admissibility?",
		Slug:                 "section-63-bsa-electronic-record-certificate-form-iii",
		ContentMarkdown:      "The Bharatiya Sakshya Adhiniyam, 2023 (BSA) replaces legacy Section 65B of the Indian Evidence Act with Section 63, accompanied by the Schedule containing statutory Form 'A' and 'B'. When is an independent expert certificate required for mobile device extractions and CCTV DVR recordings?",
		Tags:                 []string{"section-63", "bsa", "electronic-evidence", "hash-verification", "cctv-forensics"},
		StakeholderTrack:     "forensics",
		IsStatutoryPrecedent: true,
		ViewCount:            115,
		AnswerCount:          1,
		CreatedAt:            now.Add(-96 * time.Hour),
		UpdatedAt:            now.Add(-96 * time.Hour),
	}
	q3.ContentHTML = s.RenderMarkdown(q3.ContentMarkdown)

	a3 := ForumAnswer{
		ID:                  3,
		QuestionID:          3,
		AuthorName:          "BNS Statutory Desk",
		AuthorRole:          "forensic",
		ContentMarkdown:     "Under Section 63(4) BSA, any electronic record produced by a computer system requires a certificate signed by a person in official charge or an authorized expert. Following *Arjun Panditrao Khotkar v. Kailash Kushanrao Gorantyal* (2020) 7 SCC 1, contemporaneous production of the certificate alongside the digital hash (MD5/SHA-256) is mandatory at the time of filing the charge-sheet under Section 193 BNSS.",
		IsVerifiedStatutory: true,
		Upvotes:             19,
		CreatedAt:           now.Add(-95 * time.Hour),
		UpdatedAt:           now.Add(-95 * time.Hour),
	}
	a3.ContentHTML = s.RenderMarkdown(a3.ContentMarkdown)

	s.fallbackQuestions = []ForumQuestion{q1, q2, q3}
	s.fallbackAnswers[1] = []ForumAnswer{a1}
	s.fallbackAnswers[2] = []ForumAnswer{a2}
	s.fallbackAnswers[3] = []ForumAnswer{a3}
}

// HandleListQuestions handles GET /api/forum/questions
func (s *ForumService) HandleListQuestions(w http.ResponseWriter, r *http.Request) {
	enableCORS(w)
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusNoContent)
		return
	}

	track := r.URL.Query().Get("track")
	tag := r.URL.Query().Get("tag")

	if s.db != nil {
		questions, err := s.queryQuestionsFromDB(track, tag)
		if err == nil && len(questions) > 0 {
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(map[string]any{
				"questions": questions,
				"total":     len(questions),
			})
			return
		}
		if err != nil {
			log.Printf("[WARN] forum queryQuestionsFromDB failed: %v. Falling back to cached data.", err)
		}
	}

	// Serve fallback in-memory questions
	s.mu.RLock()
	defer s.mu.RUnlock()

	var filtered []ForumQuestion
	for _, q := range s.fallbackQuestions {
		if track != "" && !strings.EqualFold(q.StakeholderTrack, track) {
			continue
		}
		if tag != "" {
			matched := false
			for _, t := range q.Tags {
				if strings.EqualFold(t, tag) {
					matched = true
					break
				}
			}
			if !matched {
				continue
			}
		}
		filtered = append(filtered, q)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]any{
		"questions": filtered,
		"total":     len(filtered),
	})
}

// HandleGetQuestionDetail handles GET /api/forum/questions/:slug
func (s *ForumService) HandleGetQuestionDetail(w http.ResponseWriter, r *http.Request) {
	enableCORS(w)
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusNoContent)
		return
	}

	pathParts := strings.Split(strings.Trim(r.URL.Path, "/"), "/")
	if len(pathParts) < 4 {
		http.Error(w, `{"error":"missing question slug"}`, http.StatusBadRequest)
		return
	}
	slug := pathParts[3]

	if s.db != nil {
		q, answers, err := s.queryQuestionDetailFromDB(slug)
		if err == nil && q != nil {
			q.ContentHTML = s.RenderMarkdown(q.ContentMarkdown)
			for i := range answers {
				answers[i].ContentHTML = s.RenderMarkdown(answers[i].ContentMarkdown)
			}
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(map[string]any{
				"question": q,
				"answers":  answers,
			})
			return
		}
	}

	// In-memory fallback
	s.mu.RLock()
	defer s.mu.RUnlock()

	var foundQ *ForumQuestion
	for _, q := range s.fallbackQuestions {
		if q.Slug == slug {
			foundQ = &q
			break
		}
	}

	if foundQ == nil {
		http.Error(w, `{"error":"question not found"}`, http.StatusNotFound)
		return
	}

	answers := s.fallbackAnswers[foundQ.ID]
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]any{
		"question": foundQ,
		"answers":  answers,
	})
}

func (s *ForumService) queryQuestionsFromDB(track, tag string) ([]ForumQuestion, error) {
	query := `
		SELECT 
			q.id, q.author_id, q.author_name, q.author_role, q.title, q.slug, 
			q.content_markdown, q.tags, q.stakeholder_track, q.is_statutory_precedent, 
			q.view_count, COUNT(a.id) as answer_count, q.created_at, q.updated_at
		FROM forum_questions q
		LEFT JOIN forum_answers a ON q.id = a.question_id
		WHERE ($1 = '' OR q.stakeholder_track = $1)
		  AND ($2 = '' OR $2 = ANY(q.tags))
		GROUP BY q.id
		ORDER BY q.created_at DESC;
	`
	rows, err := s.db.Query(query, track, tag)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var questions []ForumQuestion
	for rows.Next() {
		var q ForumQuestion
		var authorID sql.NullString
		var tags pq.StringArray
		if err := rows.Scan(
			&q.ID, &authorID, &q.AuthorName, &q.AuthorRole, &q.Title, &q.Slug,
			&q.ContentMarkdown, &tags, &q.StakeholderTrack, &q.IsStatutoryPrecedent,
			&q.ViewCount, &q.AnswerCount, &q.CreatedAt, &q.UpdatedAt,
		); err != nil {
			return nil, err
		}
		if authorID.Valid {
			q.AuthorID = &authorID.String
		}
		q.Tags = []string(tags)
		q.ContentHTML = s.RenderMarkdown(q.ContentMarkdown)
		questions = append(questions, q)
	}
	return questions, nil
}

func (s *ForumService) queryQuestionDetailFromDB(slug string) (*ForumQuestion, []ForumAnswer, error) {
	qQuery := `
		SELECT 
			q.id, q.author_id, q.author_name, q.author_role, q.title, q.slug, 
			q.content_markdown, q.tags, q.stakeholder_track, q.is_statutory_precedent, 
			q.view_count, q.created_at, q.updated_at
		FROM forum_questions q
		WHERE q.slug = $1
		LIMIT 1;
	`
	var q ForumQuestion
	var authorID sql.NullString
	var tags pq.StringArray
	err := s.db.QueryRow(qQuery, slug).Scan(
		&q.ID, &authorID, &q.AuthorName, &q.AuthorRole, &q.Title, &q.Slug,
		&q.ContentMarkdown, &tags, &q.StakeholderTrack, &q.IsStatutoryPrecedent,
		&q.ViewCount, &q.CreatedAt, &q.UpdatedAt,
	)
	if err != nil {
		return nil, nil, err
	}
	if authorID.Valid {
		q.AuthorID = &authorID.String
	}
	q.Tags = []string(tags)

	aQuery := `
		SELECT 
			id, question_id, author_id, author_name, author_role, 
			content_markdown, is_verified_statutory, upvotes, created_at, updated_at
		FROM forum_answers
		WHERE question_id = $1
		ORDER BY created_at ASC;
	`
	rows, err := s.db.Query(aQuery, q.ID)
	if err != nil {
		return &q, nil, nil
	}
	defer rows.Close()

	var answers []ForumAnswer
	for rows.Next() {
		var a ForumAnswer
		var aAuthorID sql.NullString
		if err := rows.Scan(
			&a.ID, &a.QuestionID, &aAuthorID, &a.AuthorName, &a.AuthorRole,
			&a.ContentMarkdown, &a.IsVerifiedStatutory, &a.Upvotes, &a.CreatedAt, &a.UpdatedAt,
		); err != nil {
			continue
		}
		if aAuthorID.Valid {
			a.AuthorID = &aAuthorID.String
		}
		answers = append(answers, a)
	}
	q.AnswerCount = len(answers)
	return &q, answers, nil
}
