package custom

import "github.com/labstack/echo/v4"

// custom.MiddlewareFunc
type MiddlewareFunc func(HandlerFunc) HandlerFunc

func WrapMiddleware(cm MiddlewareFunc, db *Gorm, storage *S3, ai *AI) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			cc := newContext(c, db, storage, ai)
			customNext := func(ctx *Context) error {
				return next(ctx.ec)
			}
			wrappedHandler := cm(customNext)
			return wrappedHandler(cc)
		}
	}
}
