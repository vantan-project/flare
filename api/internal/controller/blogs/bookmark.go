package blogs

import (
	"github.com/vantan-project/flare/internal/custom"
	"github.com/vantan-project/flare/internal/model"
	"gorm.io/gorm"
)

type bookmarkRequest struct {
	BlogId uint `param:"blogId"`
}

type bookmarkResponse struct {
	Status  string `json:"status"`
	Message string `json:"message"`
}

func Bookmark(cc *custom.Context) error {
	var req bookmarkRequest
	cc.BindValidate(&req, nil)

	var blog model.Blog
	if err := cc.DB.Where("id = ? AND deleted_at IS NULL", req.BlogId).First(&blog).Error; err != nil {
		return cc.JSON(404, bookmarkResponse{
			Status:  "error",
			Message: "ブログが見つかりません。",
		})
	}

	user := model.User{
		Model: gorm.Model{
			ID: cc.AuthID,
		},
	}

	if err := cc.DB.Model(&blog).Association("BookmarkedUsers").Append(&user); err != nil {
		return cc.JSON(500, bookmarkResponse{
			Status:  "error",
			Message: "ブログのブックマークに追加に失敗しました。",
		})
	}
	return cc.JSON(200, bookmarkResponse{
		Status:  "success",
		Message: "ブログをブックマークしました。",
	})
}
