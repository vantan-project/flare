package custom

import "github.com/labstack/echo/v4"

// custom.MiddlewareFunc
type MiddlewareFunc func(HandlerFunc) HandlerFunc

func WrapMiddleware(db *Gorm, cm MiddlewareFunc) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			cc := newContext(c, db)
			customNext := func(ctx *Context) error {
				return next(ctx.ec)
			}
			wrappedHandler := cm(customNext)
			return wrappedHandler(cc)
		}
	}
}
