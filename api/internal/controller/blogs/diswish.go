package blogs

import (
	"github.com/vantan-project/flare/internal/custom"
	"github.com/vantan-project/flare/internal/model"
	"gorm.io/gorm"
)

type diswishRequest struct {
	BlogID uint `param:"blogId"`
}

type diswishResponse struct {
	Status  string `json:"status"`
	Message string `json:"message"`
}

func Diswish(cc *custom.Context) error {
	var req diswishRequest
	cc.BindValidate(&req, nil)

	var blog model.Blog
	if err := cc.DB.Where("id = ? AND deleted_at IS NULL", req.BlogID).First(&blog).Error; err != nil {
		return cc.JSON(404, diswishResponse{
			Status:  "error",
			Message: "ブログが見つかりません。",
		})
	}
	user := model.User{
		Model: gorm.Model{
			ID: cc.AuthID,
		},
	}
	if err := cc.DB.Model(&blog).Association("WishedUsers").Unscoped().Delete(&user); err != nil {
		return cc.JSON(500, diswishResponse{
			Status:  "error",
			Message: "やってみたいの削除に失敗しました。",
		})
	}
	return cc.JSON(200, diswishResponse{
		Status:  "success",
		Message: "やってみたいを削除しました。",
	})
}
