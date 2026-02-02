package custom

import (
	"github.com/labstack/echo/v4"
)

// custom.Echo
type Echo struct {
	ee        *echo.Echo
	DB        *Gorm
	Storage   *S3
	AI        *AI
	Validator echo.Validator
	Logger    echo.Logger
	// 外部で使うものがあれば追加していく
}

func NewEcho(db *Gorm, storage *S3, ai *AI) *Echo {
	e := echo.New()
	e.Validator = NewValidator()
	return &Echo{
		ee:        e, // 外部からのアクセスを制限
		DB:        db,
		Storage:   storage,
		AI:        ai,
		Validator: e.Validator,
		Logger:    e.Logger,
	}
}

func (ce *Echo) Wrap(ch HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		cc := &Context{
			Context: c,
			DB:      ce.DB,
			Storage: ce.Storage,
			AI:      ce.AI,
		}
		return ch(cc) // custom.Context を渡す
	}
}

func (ce *Echo) WrapMiddleware(cm MiddlewareFunc) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			cc := &Context{
				Context: c,
				DB:      ce.DB,
				Storage: ce.Storage,
				AI:      ce.AI,
			}
			customNext := func(ctx *Context) error {
				return next(ctx)
			}
			wrappedHandler := cm(customNext)
			return wrappedHandler(cc)
		}
	}
}

func (ce *Echo) Group(prefix string, m ...MiddlewareFunc) *Group {
	echoMiddlewares := make([]echo.MiddlewareFunc, len(m))
	for i, middleware := range m {
		echoMiddlewares[i] = ce.WrapMiddleware(middleware)
	}
	return &Group{
		eg:      ce.ee.Group(prefix, echoMiddlewares...),
		DB:      ce.DB,
		Storage: ce.Storage,
		AI:      ce.AI,
	}
}

func (ce *Echo) Use(middleware ...MiddlewareFunc) {
	for _, m := range middleware {
		ce.ee.Use(ce.WrapMiddleware(m))
	}
}

func (ce *Echo) Start(address string) error {
	return ce.ee.Start(address)
}

func (ce *Echo) GET(path string, h HandlerFunc, m ...MiddlewareFunc) *echo.Route {
	echoMiddlewares := make([]echo.MiddlewareFunc, len(m))
	for i, middleware := range m {
		echoMiddlewares[i] = ce.WrapMiddleware(middleware)
	}
	return ce.ee.GET(path, ce.Wrap(h), echoMiddlewares...)
}

func (ce *Echo) POST(path string, h HandlerFunc, m ...MiddlewareFunc) *echo.Route {
	echoMiddlewares := make([]echo.MiddlewareFunc, len(m))
	for i, middleware := range m {
		echoMiddlewares[i] = ce.WrapMiddleware(middleware)
	}
	return ce.ee.POST(path, ce.Wrap(h), echoMiddlewares...)
}

func (ce *Echo) PUT(path string, h HandlerFunc, m ...MiddlewareFunc) *echo.Route {
	echoMiddlewares := make([]echo.MiddlewareFunc, len(m))
	for i, middleware := range m {
		echoMiddlewares[i] = ce.WrapMiddleware(middleware)
	}
	return ce.ee.PUT(path, ce.Wrap(h), echoMiddlewares...)
}

func (ce *Echo) DELETE(path string, h HandlerFunc, m ...MiddlewareFunc) *echo.Route {
	echoMiddlewares := make([]echo.MiddlewareFunc, len(m))
	for i, middleware := range m {
		echoMiddlewares[i] = ce.WrapMiddleware(middleware)
	}
	return ce.ee.DELETE(path, ce.Wrap(h), echoMiddlewares...)
}

func (ce *Echo) PATCH(path string, h HandlerFunc, m ...MiddlewareFunc) *echo.Route {
	echoMiddlewares := make([]echo.MiddlewareFunc, len(m))
	for i, middleware := range m {
		echoMiddlewares[i] = ce.WrapMiddleware(middleware)
	}
	return ce.ee.PATCH(path, ce.Wrap(h), echoMiddlewares...)
}
