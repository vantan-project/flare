package jwt

import (
	"errors"
	"fmt"

	"github.com/golang-jwt/jwt/v5"
	"github.com/vantan-project/flare/internal/env"
)

var (
	ErrInvalidToken      = errors.New("無効なトークンです")
	ErrExpiredToken      = errors.New("トークンの有効期限が切れています")
	ErrInvalidSignature  = errors.New("トークンの署名が無効です")
	ErrMissingToken      = errors.New("トークンが指定されていません")
	ErrTokenVerification = errors.New("トークンの検証に失敗しました")
)

// JWTトークン検証
func Verify(tokenString string) (authID uint, err error) {
	if tokenString == "" {
		return 0, ErrMissingToken
	}

	token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("%w: %v", ErrInvalidSignature, token.Header["alg"])
		}
		return []byte(env.JWTSecret()), nil
	})

	if err != nil {
		// 有効期限切れの場合
		if errors.Is(err, jwt.ErrTokenExpired) {
			return 0, ErrExpiredToken
		}
		return 0, fmt.Errorf("%w: %v", ErrTokenVerification, err)
	}

	// JWTペイロードを検証
	claims, ok := token.Claims.(*Claims)
	if !ok || !token.Valid {
		return 0, ErrInvalidToken
	}

	return claims.AuthID, nil
}
