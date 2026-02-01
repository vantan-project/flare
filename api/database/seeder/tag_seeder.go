package seeder

import (
	"fmt"

	"github.com/vantan-project/flare/internal/custom"
	"github.com/vantan-project/flare/internal/model"
)

func TagSeeder(db *custom.Gorm) error {
	tags := []model.Tag{
		{Name: "オムライス"},
		{Name: "ハンバーグ"},
		{Name: "筋トレ"},
	}
	for i := range tags {
		if err := db.Create(&tags[i]).Error; err != nil {
			fmt.Println("タグの作成で失敗しました。")
			return err
		}
	}
	fmt.Println("タグの作成が完了しました。")
	return nil
}

func init() {
	Register("tag_seeder", TagSeeder)
}
