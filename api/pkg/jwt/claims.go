package jwt

import "github.com/golang-jwt/jwt/v5"

// JWTペイロード
type Claims struct {
	jwt.RegisteredClaims
	AuthID uint
}
