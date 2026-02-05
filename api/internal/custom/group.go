package custom

import (
	"github.com/labstack/echo/v4"
)

// custom.Group
type Group struct {
	eg      *echo.Group
	DB      *Gorm
	Storage *S3
	AI      *AI
	AuthID  uint
}

func (cg *Group) Wrap(ch HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		cc, ok := c.(*Context)
		if !ok {
			cc = &Context{
				Context: c,
				DB:      cg.DB,
				Storage: cg.Storage,
				AI:      cg.AI,
				AuthID:  cg.AuthID,
			}
		}
		return ch(cc) // custom.Context を渡す
	}
}

func (cg *Group) WrapMiddleware(cm MiddlewareFunc) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			cc, ok := c.(*Context)
			if !ok {
				cc = &Context{
					Context: c,
					DB:      cg.DB,
					Storage: cg.Storage,
					AI:      cg.AI,
					AuthID:  cg.AuthID,
				}
			}
			customNext := func(ctx *Context) error {
				return next(ctx)
			}
			wrappedHandler := cm(customNext)
			return wrappedHandler(cc)
		}
	}
}

func (cg *Group) GET(path string, ch HandlerFunc, m ...MiddlewareFunc) *echo.Route {
	echoMiddlewares := make([]echo.MiddlewareFunc, len(m))
	for i, middleware := range m {
		echoMiddlewares[i] = cg.WrapMiddleware(middleware)
	}
	return cg.eg.GET(path, cg.Wrap(ch), echoMiddlewares...)
}

func (cg *Group) POST(path string, ch HandlerFunc, m ...MiddlewareFunc) *echo.Route {
	echoMiddlewares := make([]echo.MiddlewareFunc, len(m))
	for i, middleware := range m {
		echoMiddlewares[i] = cg.WrapMiddleware(middleware)
	}
	return cg.eg.POST(path, cg.Wrap(ch), echoMiddlewares...)
}

func (cg *Group) PUT(path string, ch HandlerFunc, m ...MiddlewareFunc) *echo.Route {
	echoMiddlewares := make([]echo.MiddlewareFunc, len(m))
	for i, middleware := range m {
		echoMiddlewares[i] = cg.WrapMiddleware(middleware)
	}
	return cg.eg.PUT(path, cg.Wrap(ch), echoMiddlewares...)
}

func (cg *Group) DELETE(path string, ch HandlerFunc, m ...MiddlewareFunc) *echo.Route {
	echoMiddlewares := make([]echo.MiddlewareFunc, len(m))
	for i, middleware := range m {
		echoMiddlewares[i] = cg.WrapMiddleware(middleware)
	}
	return cg.eg.DELETE(path, cg.Wrap(ch), echoMiddlewares...)
}

func (cg *Group) PATCH(path string, ch HandlerFunc, m ...MiddlewareFunc) *echo.Route {
	echoMiddlewares := make([]echo.MiddlewareFunc, len(m))
	for i, middleware := range m {
		echoMiddlewares[i] = cg.WrapMiddleware(middleware)
	}
	return cg.eg.PATCH(path, cg.Wrap(ch), echoMiddlewares...)
}

func (cg *Group) Group(prefix string, m ...MiddlewareFunc) *Group {
	echoMiddlewares := make([]echo.MiddlewareFunc, len(m))
	for i, middleware := range m {
		echoMiddlewares[i] = cg.WrapMiddleware(middleware)
	}
	return &Group{
		eg:      cg.eg.Group(prefix, echoMiddlewares...),
		DB:      cg.DB,
		Storage: cg.Storage,
		AI:      cg.AI,
		AuthID:  cg.AuthID,
	}
}

func (cg *Group) Use(middleware ...MiddlewareFunc) {
	for _, m := range middleware {
		cg.eg.Use(cg.WrapMiddleware(m))
	}
}
