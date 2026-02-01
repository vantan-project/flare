package seeder

import (
	"fmt"

	"github.com/vantan-project/flare/internal/custom"
)

func BlogTagSeeder(db *custom.Gorm) error {
	// 中間テーブル用の匿名構造体
	type BlogTag struct {
		BlogID uint `gorm:"column:blog_id"`
		TagID  uint `gorm:"column:tag_id"`
	}

	blogTags := []BlogTag{
		{BlogID: 5, TagID: 1},
		{BlogID: 5, TagID: 2},
		{BlogID: 5, TagID: 3},
	}

	for _, blogTag := range blogTags {
		if err := db.Table("blog_tags").Create(&blogTag).Error; err != nil {
			fmt.Println("ブログタグの作成で失敗しました。")
			return err
		}
	}

	fmt.Println("ブログタグの作成が完了しました。")
	return nil
}

func init() {
	Register("blog_tag_seeder", BlogTagSeeder)
}
