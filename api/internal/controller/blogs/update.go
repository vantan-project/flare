package blogs

import (
	"fmt"

	"github.com/vantan-project/flare/internal/custom"
	"github.com/vantan-project/flare/internal/model"
	"gorm.io/gorm"
)

type updateRequest struct {
	BlogID           uint    `param:"blogId"`
	Title            *string `json:"title" validate:"omitempty,max=64,min=1"`
	Content          *string `json:"content" validate:"omitempty,min=1"`
	TagIds           *[]uint `json:"tagIds"`
	ThumbnailImageID *uint   `json:"thumbnailImageId"`
}

type updateResponse struct {
	Status  string `json:"status"`
	Message string `json:"message"`
}

func Update(cc *custom.Context) error {
	var req updateRequest
	cc.BindValidate(&req, map[string]map[string]string{
		"title": {
			"max": "タイトルは64文字以内で入力してください。",
			"min": "タイトルは1文字以上で入力してください。",
		},
		"content": {
			"min": "内容は1文字以上で入力してください。",
		},
	})
	err := cc.DB.Transaction(func(tx *gorm.DB) error {
		// gormはゼロ値を無視するため、mapにする
		newBlog := map[string]any{}
		if req.Title != nil {
			newBlog["title"] = *req.Title
		}
		if req.Content != nil {
			newBlog["content"] = *req.Content
		}
		if req.ThumbnailImageID != nil {
			newBlog["thumbnail_image_id"] = *req.ThumbnailImageID
		}

		if len(newBlog) > 0 {
			result := tx.Model(&model.Blog{}).Where("id = ? AND deleted_at IS NULL AND user_id = ?", req.BlogID, cc.AuthID).
				Updates(newBlog)

			if result.Error != nil || result.RowsAffected == 0 {
				return fmt.Errorf("ブログの更新に失敗")
			}
		}

		if req.TagIds != nil {
			targetBlog := model.Blog{Model: gorm.Model{ID: req.BlogID}}

			tags := make([]model.Tag, len(*req.TagIds))
			for i, id := range *req.TagIds {
				tags[i] = model.Tag{Model: gorm.Model{ID: id}}
			}

			if err := tx.Model(&targetBlog).Association("Tags").Replace(&tags); err != nil {
				return err
			}
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
