package blogs

import (
	"github.com/vantan-project/flare/internal/custom"
	"github.com/vantan-project/flare/internal/model"
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

	if err := cc.DB.Where("id = ? AND deleted_at IS NULL", req.BlogID).
		Delete(&model.Blog{}).Error; err != nil {
		return cc.JSON(500, deleteResponse{
			Status:  "error",
			Message: "ブログの削除に失敗しました。",
		})
	}

	// 既に削除してある場合でも成功する
	return cc.JSON(200, deleteResponse{
		Status:  "success",
		Message: "ブログを削除しました。",
	})
}
