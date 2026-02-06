package jwt

import (
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/vantan-project/flare/internal/env"
)

// トークンの有効期限（7日間）
const (
	TokenExpiry = 7 * 24 * time.Hour
)

// トークン生成
func Generate(userID uint, email string) (string, error) {
	now := time.Now()
	claims := &Claims{
		AuthID: userID,
		Email:  email,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(now.Add(TokenExpiry)),
			IssuedAt:  jwt.NewNumericDate(now),
			NotBefore: jwt.NewNumericDate(now),
			Issuer:    "flare-api", // API名
			Subject:   string(rune(userID)),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(env.JWTSecret()))
}
