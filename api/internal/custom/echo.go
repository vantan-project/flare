package custom

import (
	"github.com/labstack/echo/v4"
)

// custom.Echo
type Echo struct {
	ee        *echo.Echo
	DB        *Gorm
	Validator echo.Validator
	Logger    echo.Logger
	// 外部で使うものがあれば追加していく
}

func NewEcho(db *Gorm, storage *S3) *Echo {
	e := echo.New()
	e.Validator = NewValidator()
	return &Echo{
		ee:        e, // 外部からのアクセスを制限
		DB:        db,
		Validator: e.Validator,
		Logger:    e.Logger,
	}
}

func (ce *Echo) Group(prefix string, m ...MiddlewareFunc) *Group {
	echoMiddlewares := make([]echo.MiddlewareFunc, len(m))
	for i, middleware := range m {
		echoMiddlewares[i] = WrapMiddleware(ce.DB, middleware)
	}
	return newGroup(ce.DB, ce.ee.Group(prefix, echoMiddlewares...))
}

func (ce *Echo) Use(middleware ...MiddlewareFunc) {
	for _, m := range middleware {
		ce.ee.Use(WrapMiddleware(ce.DB, m))
	}
}

func (ce *Echo) Start(address string) error {
	return ce.ee.Start(address)
}

func (ce *Echo) GET(path string, h HandlerFunc, m ...MiddlewareFunc) *echo.Route {
	echoMiddlewares := make([]echo.MiddlewareFunc, len(m))
	for i, middleware := range m {
		echoMiddlewares[i] = WrapMiddleware(ce.DB, middleware)
	}
	return ce.ee.GET(path, Wrap(ce.DB, h), echoMiddlewares...)
}

func (ce *Echo) POST(path string, h HandlerFunc, m ...MiddlewareFunc) *echo.Route {
	echoMiddlewares := make([]echo.MiddlewareFunc, len(m))
	for i, middleware := range m {
		echoMiddlewares[i] = WrapMiddleware(ce.DB, middleware)
	}
	return ce.ee.POST(path, Wrap(ce.DB, h), echoMiddlewares...)
}

func (ce *Echo) PUT(path string, h HandlerFunc, m ...MiddlewareFunc) *echo.Route {
	echoMiddlewares := make([]echo.MiddlewareFunc, len(m))
	for i, middleware := range m {
		echoMiddlewares[i] = WrapMiddleware(ce.DB, middleware)
	}
	return ce.ee.PUT(path, Wrap(ce.DB, h), echoMiddlewares...)
}

func (ce *Echo) DELETE(path string, h HandlerFunc, m ...MiddlewareFunc) *echo.Route {
	echoMiddlewares := make([]echo.MiddlewareFunc, len(m))
	for i, middleware := range m {
		echoMiddlewares[i] = WrapMiddleware(ce.DB, middleware)
	}
	return ce.ee.DELETE(path, Wrap(ce.DB, h), echoMiddlewares...)
}

func (ce *Echo) PATCH(path string, h HandlerFunc, m ...MiddlewareFunc) *echo.Route {
	echoMiddlewares := make([]echo.MiddlewareFunc, len(m))
	for i, middleware := range m {
		echoMiddlewares[i] = WrapMiddleware(ce.DB, middleware)
	}
	return ce.ee.PATCH(path, Wrap(ce.DB, h), echoMiddlewares...)
}
