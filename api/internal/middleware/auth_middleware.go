package middleware

import (
	"strings"

	"github.com/vantan-project/flare/internal/custom"
	"github.com/vantan-project/flare/pkg/jwt"
)

// 認証ミドルウェア
func AuthMiddleware(next custom.HandlerFunc) custom.HandlerFunc {
	return func(cc *custom.Context) error {
		authHeader := cc.Request().Header.Get("Authorization")
		if authHeader == "" {
			return cc.JSON(401, map[string]string{
				"error": "認証トークンが必要です",
			})
		}

		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		if tokenString == authHeader {
			return cc.JSON(401, map[string]string{
				"error": "無効なトークン形式です",
			})
		}

		authID, err := jwt.Verify(tokenString)
		if err != nil {
			return cc.JSON(401, map[string]string{
				"error": err.Error(),
			})
		}

		// コンテキストにユーザーIDを設定
		cc.AuthID = authID

		return next(cc)
	}
}
