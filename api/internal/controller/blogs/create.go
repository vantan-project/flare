package blogs

import (
	"github.com/vantan-project/flare/internal/custom"
	"github.com/vantan-project/flare/internal/model"
	"gorm.io/gorm"
)

type createRequest struct {
	Title            string `json:"title" validate:"required,max=64"`
	Content          string `json:"content" validate:"required"`
	TagIds           []uint `json:"tagIds"`
	ThumbnailImageID uint   `json:"thumbnailImageId" validate:"required"`
}

type createResponse struct {
	Status  string `json:"status"`
	Message string `json:"message"`
	BlogID  uint   `json:"blogId"`
}

func Create(cc *custom.Context) error {
	var req createRequest
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

	var blogID uint
	err := cc.DB.Transaction(func(tx *gorm.DB) error {
		// ブログの作成
		blog := model.Blog{
			Title:      req.Title,
			Content:    req.Content,
			FlarePoint: 0,
			CorePoint:  0,
			// ダミー。ミドルウェアがなおったらcc.AuthIDを使用する。
			UserID:           cc.AuthID,
			ThumbnailImageID: req.ThumbnailImageID,
		}
		if err := tx.Create(&blog).Error; err != nil {
			return err
		}
		// 作成したブログIDを取得
		blogID = blog.ID
		// 中間テーブルのタグ生成
		if len(req.TagIds) > 0 {
			tags := make([]model.Tag, len(req.TagIds))
			for i, id := range req.TagIds {
				tags[i] = model.Tag{Model: gorm.Model{
					ID: id,
				}}
			}
			if err := tx.Model(&blog).Association("Tags").Append(&tags); err != nil {
				return err
			}
		}
		return nil
	})

	if err != nil {
		return cc.JSON(500, createResponse{
			Status:  "error",
			Message: "ブログの作成に失敗しました。",
		})
	}

	return cc.JSON(200, createResponse{
		Status:  "success",
		Message: "ブログの作成に成功しました。",
		BlogID:  blogID,
	})
}
