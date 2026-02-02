package blogs

import (
	"errors"

	"github.com/vantan-project/flare/internal/custom"
	"github.com/vantan-project/flare/internal/model"
	"gorm.io/gorm"
)

type deleteRequest struct {
	BlogID uint `param:"blogId"`
}

type deleteResponse struct {
	Status  string `json:"status"`
	Message string `json:"message"`
}

func Delete(cc *custom.Context) error {
	var req deleteRequest
	cc.BindValidate(&req, nil)

	var blog model.Blog
	if err := cc.DB.Where("id = ?", req.BlogID).Where("deleted_at IS NULL").First(&blog).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return cc.JSON(404, deleteResponse{
				Status:  "error",
				Message: "削除するブログが存在しません。",
			})
		}
	}
	// ここもあとで修正
	// if blog.UserID != cc.AuthID {
	// 	return cc.JSON(403, deleteResponse{
	// 		Status:  "error",
	// 		Message: "このブログは削除できません。",
	// 	})
	// }

	// WhereはWhere("id = ? AND user_id = ?" , req.BlogID , cc.AuthID)にあとで変更
	if err := cc.DB.Where("id = ?", req.BlogID).Delete(&blog).Error; err != nil {
		return cc.JSON(500, deleteResponse{
			Status:  "error",
			Message: "ブログの削除に失敗しました。",
		})
	}

	return cc.JSON(200, deleteResponse{
		Status:  "success",
		Message: "ブログを削除しました。",
	})
}
