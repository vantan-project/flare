package router

import (
	"github.com/vantan-project/flare/internal/controller/auth"
	"github.com/vantan-project/flare/internal/controller/blogs"
	"github.com/vantan-project/flare/internal/controller/tags"
	"github.com/vantan-project/flare/internal/custom"
	"github.com/vantan-project/flare/internal/middleware"
)

func Api(e *custom.Group) {
	a := e.Group("/auth")
	a.POST("/register", auth.Register)
	a.POST("/login", auth.Login)

	b := e.Group("/blogs")
	b.GET("", blogs.Index)
	b.GET("/:blogId", blogs.Detail)
	b.POST("", blogs.Create, middleware.AuthMiddleware)
	b.PATCH("/:blogId/update", blogs.Update, middleware.AuthMiddleware)
	b.DELETE("/:blogId/delete", blogs.Delete, middleware.AuthMiddleware)

	t := e.Group("/tags")
	t.GET("", tags.Index)
	t.POST("", tags.Create, middleware.AuthMiddleware)
}
