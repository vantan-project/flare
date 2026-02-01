package seeder

import (
	"fmt"

	"github.com/vantan-project/flare/internal/custom"
	"github.com/vantan-project/flare/internal/model"
)

func ProfileSeeder(db *custom.Gorm) error {
	profiles := model.Profile{
		Name: "takuya", UserID: 1,
	}
	if err := db.Create(&profiles).Error; err != nil {
		fmt.Println("プロフィールの作成で失敗しました。")
		return err
	}
	fmt.Println("プロフィールの作成が完了しました。")
	return nil
}

func init() {
	Register("profile_seeder", ProfileSeeder)
}
