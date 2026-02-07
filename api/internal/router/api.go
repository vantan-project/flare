package router

import (
	"github.com/vantan-project/flare/internal/controller/auth"
	"github.com/vantan-project/flare/internal/controller/blogs"
	bbookmark "github.com/vantan-project/flare/internal/controller/blogs/bookmark"
	bwish "github.com/vantan-project/flare/internal/controller/blogs/wish"
	"github.com/vantan-project/flare/internal/controller/images"
	"github.com/vantan-project/flare/internal/controller/tags"
	"github.com/vantan-project/flare/internal/controller/user"
	"github.com/vantan-project/flare/internal/custom"
	"github.com/vantan-project/flare/internal/middleware"
)

func Api(e *custom.Group) {
	a := e.Group("/auth")
	a.POST("/register", auth.Register)
	a.POST("/login", auth.Login)
	a.GET("/me", auth.Me, middleware.Auth)
	a.PATCH("/me", auth.Update, middleware.Auth)
	a.DELETE("/destroy", auth.Delete, middleware.Auth)

	b := e.Group("/blogs")
	b.GET("", blogs.Index, middleware.OptionalAuth)
	b.GET("/:blogId", blogs.Detail)
	b.POST("", blogs.Create, middleware.Auth)
	b.PATCH("/:blogId", blogs.Update, middleware.Auth)
	b.DELETE("/:blogId", blogs.Delete, middleware.Auth)
	b.POST("/:blogId/wish", blogs.Wish, middleware.Auth)
	b.DELETE("/:blogId/wish", blogs.Diswish, middleware.Auth)
	b.POST("/:blogId/bookmark", blogs.Bookmark, middleware.Auth)
	b.DELETE("/:blogId/bookmark", blogs.Disbookmark, middleware.Auth)
	b.PATCH("/:blogId/publish", blogs.Publish, middleware.Auth)

	b.GET("/wish", bwish.Index)
	b.POST("/:blogId/wish", blogs.Wish, middleware.Auth)
	b.DELETE("/:blogId/wish", blogs.Diswish, middleware.Auth)

	b.GET("/bookmark", bbookmark.Index)
	b.POST("/:blogId/bookmark", blogs.Bookmark, middleware.Auth)
	b.DELETE("/:blogId/bookmark", blogs.Disbookmark, middleware.Auth)

	t := e.Group("/tags")
	t.GET("", tags.Index)
	t.POST("", tags.Create, middleware.Auth)

	i := e.Group("/images")
	i.POST("", images.Upload)

	u := e.Group("/users")
	u.GET("/:id", user.Detail)
}
