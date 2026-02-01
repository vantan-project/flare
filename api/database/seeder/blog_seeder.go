package seeder

import (
	"fmt"

	"github.com/vantan-project/flare/internal/custom"
	"github.com/vantan-project/flare/internal/model"
)

func BlogSeeder(db *custom.Gorm) error {
	blogs := []model.Blog{
		{Title: "初めてのブログ", Content: "これは初めてのブログです。", FlarePoint: 10, CorePoint: 10, UserID: 1, ThumbnailImageID: 1}}
	for i := range blogs {
		if err := db.Create(&blogs[i]).Error; err != nil {
			fmt.Println("ブログの作成で失敗しました。")
			return err
		}
	}
	fmt.Println("ブログの作成が完了しました。")
	return nil
}

func init() {
	Register("blog_seeder", BlogSeeder)
}
