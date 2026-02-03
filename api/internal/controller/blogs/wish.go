package blogs

import (
	"github.com/vantan-project/flare/internal/custom"
	"github.com/vantan-project/flare/internal/model"
	"gorm.io/gorm"
)

type wishRequest struct {
	BlogID uint `param:"blogId"`
}

type wishResponse struct {
	Status  string `json:"status"`
	Message string `json:"message"`
}

func Wish(cc *custom.Context) error {
	var req wishRequest
	cc.BindValidate(&req, nil)

	var blog model.Blog
	if err := cc.DB.Where("id = ? AND deleted_at IS NULL", req.BlogID).First(&blog).Error; err != nil {
		return cc.JSON(404, wishResponse{
			Status:  "error",
			Message: "ブログが見つかりません。",
		})
	}

	user := model.User{
		Model: gorm.Model{
			ID: cc.AuthID,
		},
	}
	if err := cc.DB.Model(&blog).Association("WishedUsers").Append(&user); err != nil {
		return cc.JSON(500, wishResponse{
			Status:  "error",
			Message: "やってみたいの追加に失敗しました。",
		})
	}

	return cc.JSON(200, wishResponse{
		Status:  "success",
		Message: "やってみたいに追加しました。",
	})
}
