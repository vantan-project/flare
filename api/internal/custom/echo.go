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

func (ce *Echo) Group(prefix string, m ...MiddlewareFunc) *Group {
	echoMiddlewares := make([]echo.MiddlewareFunc, len(m))
	for i, middleware := range m {
		echoMiddlewares[i] = WrapMiddleware(middleware, ce.DB, ce.Storage, ce.AI)
	}
	return newGroup(ce.DB, ce.ee.Group(prefix, echoMiddlewares...))
}

func (ce *Echo) Use(middleware ...MiddlewareFunc) {
	for _, m := range middleware {
		ce.ee.Use(WrapMiddleware(m, ce.DB, ce.Storage, ce.AI))
	}
}

func (ce *Echo) Start(address string) error {
	return ce.ee.Start(address)
}

func (ce *Echo) GET(path string, h HandlerFunc, m ...MiddlewareFunc) *echo.Route {
	echoMiddlewares := make([]echo.MiddlewareFunc, len(m))
	for i, middleware := range m {
		echoMiddlewares[i] = WrapMiddleware(middleware, ce.DB, ce.Storage, ce.AI)
	}
	return ce.ee.GET(path, Wrap(h, ce.DB, ce.Storage, ce.AI), echoMiddlewares...)
}

func (ce *Echo) POST(path string, h HandlerFunc, m ...MiddlewareFunc) *echo.Route {
	echoMiddlewares := make([]echo.MiddlewareFunc, len(m))
	for i, middleware := range m {
		echoMiddlewares[i] = WrapMiddleware(middleware, ce.DB, ce.Storage, ce.AI)
	}
	return ce.ee.POST(path, Wrap(h, ce.DB, ce.Storage, ce.AI), echoMiddlewares...)
}

func (ce *Echo) PUT(path string, h HandlerFunc, m ...MiddlewareFunc) *echo.Route {
	echoMiddlewares := make([]echo.MiddlewareFunc, len(m))
	for i, middleware := range m {
		echoMiddlewares[i] = WrapMiddleware(middleware, ce.DB, ce.Storage, ce.AI)
	}
	return ce.ee.PUT(path, Wrap(h, ce.DB, ce.Storage, ce.AI), echoMiddlewares...)
}

func (ce *Echo) DELETE(path string, h HandlerFunc, m ...MiddlewareFunc) *echo.Route {
	echoMiddlewares := make([]echo.MiddlewareFunc, len(m))
	for i, middleware := range m {
		echoMiddlewares[i] = WrapMiddleware(middleware, ce.DB, ce.Storage, ce.AI)
	}
	return ce.ee.DELETE(path, Wrap(h, ce.DB, ce.Storage, ce.AI), echoMiddlewares...)
}

func (ce *Echo) PATCH(path string, h HandlerFunc, m ...MiddlewareFunc) *echo.Route {
	echoMiddlewares := make([]echo.MiddlewareFunc, len(m))
	for i, middleware := range m {
		echoMiddlewares[i] = WrapMiddleware(middleware, ce.DB, ce.Storage, ce.AI)
	}
	return ce.ee.PATCH(path, Wrap(h, ce.DB, ce.Storage, ce.AI), echoMiddlewares...)
}
