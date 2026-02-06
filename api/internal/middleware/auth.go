package middleware

import (
	"strings"

	"github.com/vantan-project/flare/internal/custom"
	"github.com/vantan-project/flare/internal/model"
	"github.com/vantan-project/flare/pkg/jwt"
)

// 認証ミドルウェア
func Auth(next custom.HandlerFunc) custom.HandlerFunc {
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

		claims, err := jwt.Verify(tokenString)
		if err != nil {
			return cc.JSON(401, map[string]string{
				"error": "無効なトークン形式です",
			})
		}

		var count int64
		err = cc.DB.Model(&model.User{}).
			Where("id = ? AND email = ?", claims.AuthID, claims.Email).
			Limit(1).
			Count(&count).Error

		if err != nil || count == 0 {
			return cc.JSON(401, map[string]string{
				"error": "無効なトークン形式です",
			})
		}

		// コンテキストにユーザーIDを設定
		cc.AuthID = claims.AuthID

		return next(cc)
	}
}
