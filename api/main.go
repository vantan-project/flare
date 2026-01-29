package main

import (
	"log"
	"net/http"

	"github.com/joho/godotenv"
	"github.com/vantan-project/flare/internal/custom"
	"github.com/vantan-project/flare/internal/router"
)

func main() {
	_ = godotenv.Load()

	db, err := custom.NewGorm()
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close() // 後処理

	e := custom.NewEcho(db)

	e.GET("/", func(cc *custom.Context) error {
		return cc.JSON(http.StatusOK, "Hello Echo!")
	})
	router.Api(e.Group("api"))

	e.Logger.Fatal(e.Start(":8080"))
}
