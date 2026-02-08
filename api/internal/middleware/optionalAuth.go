package middleware

import (
	"strings"

	"github.com/vantan-project/flare/internal/custom"
	"github.com/vantan-project/flare/internal/model"
	"github.com/vantan-project/flare/pkg/jwt"
)

func OptionalAuth(next custom.HandlerFunc) custom.HandlerFunc {
	return func(cc *custom.Context) error {
		authHeader := cc.Request().Header.Get("Authorization")
		if authHeader == "" {
			// 未ログインのまま次へ
			return next(cc)
		}

		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		if tokenString == authHeader {
			return next(cc)
		}

		claims, err := jwt.Verify(tokenString)
		if err != nil {
			return next(cc)
		}

		var count int64
		err = cc.DB.Model(&model.User{}).
			Where("id = ? AND email = ?", claims.AuthID, claims.Email).
			Limit(1).
			Count(&count).Error

		if err != nil || count == 0 {
			return next(cc)
		}

		// ログインしている場合のみセット
		cc.AuthID = claims.AuthID

		return next(cc)
	}
}
