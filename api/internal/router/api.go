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
	b.POST("", blogs.Create, middleware.Auth)
	b.PATCH("/:blogId", blogs.Update, middleware.Auth)
	b.DELETE("/:blogId", blogs.Delete, middleware.Auth)
	b.POST("/:blogId/wish", blogs.Wish, middleware.Auth)
	b.DELETE("/:blogId/wish", blogs.Diswish, middleware.Auth)

	t := e.Group("/tags")
	t.GET("", tags.Index)
	t.POST("", tags.Create, middleware.Auth)
}
