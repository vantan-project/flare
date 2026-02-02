package blogs

import (
	"fmt"

	"github.com/vantan-project/flare/internal/custom"
	"github.com/vantan-project/flare/internal/model"
	"gorm.io/gorm"
)

type updateRequest struct {
	BlogID           uint   `param:"blogId"`
	Title            string `json:"title" validate:"required,max=64"`
	Content          string `json:"content" validate:"required"`
	TagIds           []uint `json:"tagIds"`
	ThumbnailImageID uint   `json:"thumbnailImageId" validate:"required"`
}

type updateResponse struct {
	Status  string `json:"status"`
	Message string `json:"message"`
}

func Update(cc *custom.Context) error {
	var req updateRequest
	cc.BindValidate(&req, map[string]map[string]string{
		"title": {
			"required": "タイトルは必須です。",
			"max":      "タイトルは64文字以内で入力してください。",
		},
		"content": {
			"required": "内容は必須です。",
		},
		"thumbnailImageId": {
			"required": "サムネイル画像は必須です。",
		},
	})

	err := cc.DB.Transaction(func(tx *gorm.DB) error {
		// idは変更ないのでいらないと思うが、id無しだと失敗した。gormの仕様？？
		newBlog := model.Blog{
			Model: gorm.Model{
				ID: req.BlogID,
			},
			Title:            req.Title,
			Content:          req.Content,
			ThumbnailImageID: req.ThumbnailImageID,
		}

		result := tx.Where("id = ? AND deleted_at IS NULL", req.BlogID).
			Updates(&newBlog)

		if result.Error != nil || result.RowsAffected == 0 {
			return fmt.Errorf("ブログの更新に失敗")
		}

		// タグは常に全て更新する。
		tags := make([]model.Tag, len(req.TagIds))
		for i, id := range req.TagIds {
			tags[i] = model.Tag{Model: gorm.Model{
				ID: id,
			}}
		}
		if err := tx.Model(&newBlog).Association("Tags").Replace(&tags); err != nil {
			return err
		}

		return nil
	})
	if err != nil {
		return cc.JSON(500, updateResponse{
			Status:  "error",
			Message: "ブログの更新に失敗しました。",
		})
	}

	return cc.JSON(200, updateResponse{
		Status:  "success",
		Message: "ブログの更新に成功しました。",
	})
}
