package custom

import "github.com/labstack/echo/v4"

// custom.HandlerFunc
type HandlerFunc func(*Context) error

func Wrap(db *Gorm, ch HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		cc := newContext(c, db)
		return ch(cc)
	}
}
