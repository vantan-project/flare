package router

import (
	"github.com/vantan-project/flare/internal/controller/auth"
	"github.com/vantan-project/flare/internal/custom"
)

func Api(e *custom.Group) {
	a := e.Group("/auth")
	a.POST("/register", auth.Register)
	a.POST("/login", auth.Login)
}
