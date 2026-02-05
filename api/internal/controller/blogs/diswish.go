package blogs

import (
	"github.com/vantan-project/flare/internal/custom"
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

	wish := wish{
		UserID: cc.AuthID,
		BlogID: req.BlogID,
	}
	if err := cc.DB.Table("wishes").
		Where("user_id = ? AND blog_id = ?", cc.AuthID, req.BlogID).
		Unscoped().Delete(&wish).Error; err != nil {
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
