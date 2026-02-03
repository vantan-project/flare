package blogs

import (
	"github.com/vantan-project/flare/internal/custom"
	"github.com/vantan-project/flare/internal/model"
	"gorm.io/gorm"
)

type disbookmarkRequest struct {
	BlogId uint `param:"blogId"`
}

type disbookmarkResponse struct {
	Status  string `json:"status"`
	Message string `json:"message"`
}

func Disbookmark(cc *custom.Context) error {
	var req disbookmarkRequest
	cc.BindValidate(&req, nil)

	var blog model.Blog
	if err := cc.DB.Where("id = ? AND deleted_at IS NULL", req.BlogId).First(&blog).Error; err != nil {
		return cc.JSON(404, disbookmarkResponse{
			Status:  "error",
			Message: "ブログが見つかりません。",
		})
	}

	user := model.User{
		Model: gorm.Model{
			ID: cc.AuthID,
		},
	}

	if err := cc.DB.Model(&blog).Association("BookmarkedUsers").Unscoped().Delete(&user); err != nil {
		return cc.JSON(500, disbookmarkResponse{
			Status:  "error",
			Message: "ブログのブックマークから削除に失敗しました。",
		})
	}
	return cc.JSON(200, disbookmarkResponse{
		Status:  "success",
		Message: "ブログのブックマークから削除しました。",
	})
}
