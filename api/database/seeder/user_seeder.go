package seeder

import (
	"fmt"
	"log"

	"github.com/vantan-project/flare/internal/custom"
	"github.com/vantan-project/flare/internal/model"
	"github.com/vantan-project/flare/pkg/hash"
)

func UserSeeder(db *custom.Gorm) error {
	users := []model.User{
		{Name: "nakao1", Email: "nakao1@example.com", Password: "password"},
	}

	for i := range users {
		hashed, err := hash.Make(users[i].Password)
		if err != nil {
			log.Fatalf("ハッシュ化に失敗しました: %v", err)
		}
		users[i].Password = hashed

		if err := db.Create(&users[i]).Error; err != nil {
			log.Fatalf("ユーザー登録に失敗しました: %v", err)
		}

		fmt.Printf("ユーザー登録成功: %s\n", users[i].Email)
	}

	return nil
}

func init() {
	Register("user_seeder", UserSeeder)
}
