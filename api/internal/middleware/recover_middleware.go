package middleware

import (
	"net/http"

	"github.com/vantan-project/flare/internal/custom"
)

func RecoverMiddleware(next custom.HandlerFunc) custom.HandlerFunc {
	return func(cc *custom.Context) error {
		defer func() {
			if r := recover(); r != nil {
				// custom.Panicの場合は何もしない（レスポンス送信済み）
				if _, ok := r.(custom.Panic); ok {
					return
				}

				// その他のpanicは500エラー
				cc.Logger().Error("panic: ", r)
				cc.NoContent(http.StatusInternalServerError)
			}
		}()
		return next(cc)
	}
}
