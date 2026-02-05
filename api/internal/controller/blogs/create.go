package blogs

import (
	"context"
	"fmt"

	"github.com/vantan-project/flare/internal/custom"
	"github.com/vantan-project/flare/internal/model"
	"github.com/vantan-project/flare/pkg/openapi"
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
			Title:            req.Title,
			Content:          req.Content,
			FlarePoint:       0,
			CorePoint:        0,
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

	// ここから投稿の分析
	go func() {
		// タグの取得
		var tagNames []string
		if len(req.TagIds) > 0 {
			var tags []model.Tag
			if err := cc.DB.Where("id IN (?)", req.TagIds).Find(&tags).Error; err != nil {
				fmt.Print("タグの取得に失敗しました。")
				return
			}
			for _, tag := range tags {
				tagNames = append(tagNames, tag.Name)
			}
		}
		postData := openapi.PostInput{
			Title:   req.Title,
			Content: req.Content,
			Tags:    tagNames,
		}
		ana, err := openapi.Analyze(cc.AI, context.Background(), postData)
		if err != nil {
			fmt.Print("投稿の分析に失敗しました。")
			return
		}
		addData := model.Blog{
			FlarePoint: ana.FlarePoint,
			CorePoint:  ana.CorePoint,
		}
		if err := cc.DB.Where("id = ?", blogID).Updates(&addData).Error; err != nil {
			fmt.Print("フレアポイントとコアポイントの更新に失敗しました。")
			return
		}
	}()

	return cc.JSON(200, createResponse{
		Status:  "success",
		Message: "ブログの作成に成功しました。",
		BlogID:  blogID,
	})
}
