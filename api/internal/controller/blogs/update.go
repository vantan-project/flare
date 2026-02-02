package blogs

import (
	"errors"

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
	// ブログの取得
	var blog model.Blog
	if err := cc.DB.Where("id = ?", req.BlogID).
		Where("deleted_at IS NULL").
		First(&blog).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return cc.JSON(404, updateResponse{
				Status:  "error",
				Message: "更新するブログが存在しません。",
			})
		}
	}

	// 認証ユーザーのブログであるかどうか
	// if blog.UserID != cc.AuthID {
	// 	return cc.JSON(403, updateResponse{
	// 		Status:  "error",
	// 		Message: "このブログは更新できません。",
	// 	})
	// }

	err := cc.DB.Transaction(func(tx *gorm.DB) error {
		newBlog := model.Blog{
			Title:            req.Title,
			Content:          req.Content,
			ThumbnailImageID: req.ThumbnailImageID,
		}

		if err := tx.Where("id = ?", req.BlogID).Updates(&newBlog).Error; err != nil {
			return err
		}

		if len(req.TagIds) > 0 {
			tags := make([]model.Tag, len(req.TagIds))
			for i, id := range req.TagIds {
				tags[i] = model.Tag{Model: gorm.Model{
					ID: id,
				}}
			}
			if err := tx.Model(&blog).Association("Tags").Replace(&tags); err != nil {
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
