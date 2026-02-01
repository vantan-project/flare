package custom

import "github.com/labstack/echo/v4"

// custom.HandlerFunc
type HandlerFunc func(*Context) error

func Wrap(ch HandlerFunc, db *Gorm, storage *S3, ai *AI) echo.HandlerFunc {
	return func(c echo.Context) error {
		cc := newContext(c, db, storage, ai)
		return ch(cc)
	}
}
