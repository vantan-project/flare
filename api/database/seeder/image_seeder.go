package seeder

import (
	"fmt"

	"github.com/vantan-project/flare/internal/custom"
	"github.com/vantan-project/flare/internal/model"
)

func ImageSeeder(db *custom.Gorm) error {
	image := model.Image{
		URL:  "https://example.com/image.jpg",
		Path: "public/images/image.jpg",
	}
	if err := db.Create(&image).Error; err != nil {
		fmt.Println("画像の作成で失敗しました。")
		return err
	}
	fmt.Println("画像の作成が完了しました。")
	return nil
}

func init() {
	Register("image_seeder", ImageSeeder)
}
