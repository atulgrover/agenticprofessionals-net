package bns

import (
	"context"
	"crypto/hmac"
	"crypto/sha256"
	"encoding/base64"
	"encoding/json"
	"errors"
	"net/http"
	"strings"
	"time"
)

type contextKey string

const userContextKey = contextKey("openibc_auth_user")

// AuthUser represents an authenticated Supabase user.
type AuthUser struct {
	ID        string         `json:"id"`
	Email     string         `json:"email"`
	Role      string         `json:"role"`
	RawClaims map[string]any `json:"raw_claims"`
}

// AuthManager verifies Supabase GoTrue JWT tokens.
type AuthManager struct {
	jwtSecret string
}

// NewAuthManager creates an AuthManager with the given secret.
func NewAuthManager(secret string) *AuthManager {
	return &AuthManager{jwtSecret: secret}
}

// GetAuthenticatedUser extracts the AuthUser from the request context.
func GetAuthenticatedUser(r *http.Request) *AuthUser {
	if u, ok := r.Context().Value(userContextKey).(*AuthUser); ok {
		return u
	}
	return nil
}

// ValidateToken verifies a JWT string and returns the parsed AuthUser.
func (a *AuthManager) ValidateToken(tokenStr string) (*AuthUser, error) {
	if a.jwtSecret == "" {
		return nil, errors.New("jwt secret not configured; rejecting token")
	}

	parts := strings.Split(tokenStr, ".")
	if len(parts) != 3 {
		return nil, errors.New("invalid jwt format")
	}

	headerB64, payloadB64, signatureB64 := parts[0], parts[1], parts[2]

	// Verify HMAC-SHA256 signature
	signingInput := headerB64 + "." + payloadB64
	mac := hmac.New(sha256.New, []byte(a.jwtSecret))
	mac.Write([]byte(signingInput))
	expectedSig := mac.Sum(nil)

	actualSig, err := base64.RawURLEncoding.DecodeString(signatureB64)
	if err != nil {
		return nil, errors.New("invalid signature encoding")
	}

	if !hmac.Equal(expectedSig, actualSig) {
		return nil, errors.New("invalid token signature")
	}

	payloadBytes, err := base64.RawURLEncoding.DecodeString(payloadB64)
	if err != nil {
		return nil, errors.New("invalid payload encoding")
	}

	var claims map[string]any
	if err := json.Unmarshal(payloadBytes, &claims); err != nil {
		return nil, errors.New("failed to parse claims")
	}

	// Verify expiration
	if exp, ok := claims["exp"].(float64); ok {
		if time.Now().Unix() > int64(exp) {
			return nil, errors.New("token expired")
		}
	}

	user := &AuthUser{
		RawClaims: claims,
	}

	if sub, ok := claims["sub"].(string); ok {
		user.ID = sub
	}
	if email, ok := claims["email"].(string); ok {
		user.Email = email
	}

	// Extract role: prefer user_metadata.role, then app_metadata.role, then claims.role
	if uMeta, ok := claims["user_metadata"].(map[string]any); ok {
		if role, ok := uMeta["role"].(string); ok && role != "" {
			user.Role = role
		}
	}
	if user.Role == "" {
		if aMeta, ok := claims["app_metadata"].(map[string]any); ok {
			if role, ok := aMeta["role"].(string); ok && role != "" {
				user.Role = role
			}
		}
	}
	if user.Role == "" {
		if role, ok := claims["role"].(string); ok && role != "" {
			user.Role = role
		} else {
			user.Role = "authenticated"
		}
	}

	return user, nil
}

// RequireAuth middleware ensures a valid Supabase token is present.
func (a *AuthManager) RequireAuth(next http.Handler) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
			http.Error(w, `{"error":"missing or invalid authorization header"}`, http.StatusUnauthorized)
			return
		}

		tokenStr := strings.TrimPrefix(authHeader, "Bearer ")
		user, err := a.ValidateToken(tokenStr)
		if err != nil {
			http.Error(w, `{"error":"`+err.Error()+`"}`, http.StatusUnauthorized)
			return
		}

		ctx := context.WithValue(r.Context(), userContextKey, user)
		next.ServeHTTP(w, r.WithContext(ctx))
	}
}

// OptionalAuth middleware extracts a user if a valid token is present, but doesn't block unauthenticated requests.
func (a *AuthManager) OptionalAuth(next http.Handler) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader != "" && strings.HasPrefix(authHeader, "Bearer ") {
			tokenStr := strings.TrimPrefix(authHeader, "Bearer ")
			if user, err := a.ValidateToken(tokenStr); err == nil {
				ctx := context.WithValue(r.Context(), userContextKey, user)
				r = r.WithContext(ctx)
			}
		}
		next.ServeHTTP(w, r)
	}
}

