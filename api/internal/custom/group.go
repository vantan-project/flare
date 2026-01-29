package custom

import (
	"github.com/labstack/echo/v4"
)

// custom.Group
type Group struct {
	DB *Gorm
	eg *echo.Group
}

// NOTE: custom.Groupはfunc (ce *custom.Echo) Groupを介して生成するので、外部からのアクセスを制限
func newGroup(db *Gorm, eg *echo.Group) *Group {
	return &Group{
		eg: eg,
		DB: db,
	}
}

func (cg *Group) GET(path string, ch HandlerFunc, m ...MiddlewareFunc) *echo.Route {
	echoMiddlewares := make([]echo.MiddlewareFunc, len(m))
	for i, middleware := range m {
		echoMiddlewares[i] = WrapMiddleware(cg.DB, middleware)
	}
	return cg.eg.GET(path, Wrap(cg.DB, ch), echoMiddlewares...)
}

func (cg *Group) POST(path string, ch HandlerFunc, m ...MiddlewareFunc) *echo.Route {
	echoMiddlewares := make([]echo.MiddlewareFunc, len(m))
	for i, middleware := range m {
		echoMiddlewares[i] = WrapMiddleware(cg.DB, middleware)
	}
	return cg.eg.POST(path, Wrap(cg.DB, ch), echoMiddlewares...)
}

func (cg *Group) PUT(path string, ch HandlerFunc, m ...MiddlewareFunc) *echo.Route {
	echoMiddlewares := make([]echo.MiddlewareFunc, len(m))
	for i, middleware := range m {
		echoMiddlewares[i] = WrapMiddleware(cg.DB, middleware)
	}
	return cg.eg.PUT(path, Wrap(cg.DB, ch), echoMiddlewares...)
}

func (cg *Group) DELETE(path string, ch HandlerFunc, m ...MiddlewareFunc) *echo.Route {
	echoMiddlewares := make([]echo.MiddlewareFunc, len(m))
	for i, middleware := range m {
		echoMiddlewares[i] = WrapMiddleware(cg.DB, middleware)
	}
	return cg.eg.DELETE(path, Wrap(cg.DB, ch), echoMiddlewares...)
}

func (cg *Group) PATCH(path string, ch HandlerFunc, m ...MiddlewareFunc) *echo.Route {
	echoMiddlewares := make([]echo.MiddlewareFunc, len(m))
	for i, middleware := range m {
		echoMiddlewares[i] = WrapMiddleware(cg.DB, middleware)
	}
	return cg.eg.PATCH(path, Wrap(cg.DB, ch), echoMiddlewares...)
}

func (cg *Group) Group(prefix string, m ...MiddlewareFunc) *Group {
	echoMiddlewares := make([]echo.MiddlewareFunc, len(m))
	for i, middleware := range m {
		echoMiddlewares[i] = WrapMiddleware(cg.DB, middleware)
	}
	return newGroup(cg.DB, cg.eg.Group(prefix, echoMiddlewares...))
}

func (cg *Group) Use(middleware ...MiddlewareFunc) {
	for _, m := range middleware {
		cg.eg.Use(WrapMiddleware(cg.DB, m))
	}
}
