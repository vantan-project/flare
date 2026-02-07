package blogs

import (
	"context"
	"fmt"

	"github.com/vantan-project/flare/internal/custom"
	"github.com/vantan-project/flare/internal/model"
	"github.com/vantan-project/flare/pkg/openapi"
)

type publishRequest struct {
	BlogID uint `param:"blogId"`
}

type publishResponse struct {
	Status  string `json:"status"`
	Message string `json:"message"`
}

func Publish(cc *custom.Context) error {
	var req publishRequest
	cc.BindValidate(&req, nil)

	var blog model.Blog
	if err := cc.DB.Where("id = ? AND user_id = ?", req.BlogID, cc.AuthID).Preload("Tags").First(&blog).Error; err != nil {
		return cc.JSON(404, publishResponse{
			Status:  "error",
			Message: "ブログが見つかりません。",
		})
	}

	// ここから投稿の分析
	go func() {
		// タグの取得
		var tagNames []string
		if len(blog.Tags) > 0 {
			for _, tag := range blog.Tags {
				tagNames = append(tagNames, tag.Name)
			}
		}
		postData := openapi.PostInput{
			Title:   blog.Title,
			Content: blog.Content,
			Tags:    tagNames,
		}
		ana, err := openapi.Analyze(cc.AI, context.Background(), postData)
		if err != nil {
			fmt.Print("投稿の分析に失敗しました。")
			return
		}
		var status string
		if ana.IsHabit {
			status = "公開"
		} else {
			status = "習慣外"
		}
		addData := model.Blog{
			FlarePoint: ana.FlarePoint,
			CorePoint:  ana.CorePoint,
			Status:     status,
		}
		if err := cc.DB.Where("id = ?", req.BlogID).Updates(&addData).Error; err != nil {
			fmt.Print("フレアポイントとコアポイントの更新に失敗しました。")
			return
		}
	}()

	return cc.JSON(200, publishResponse{
		Status:  "success",
		Message: "ブログを公開しました。",
	})
}
