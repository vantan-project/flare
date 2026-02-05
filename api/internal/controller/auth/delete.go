package auth

import (
	"github.com/vantan-project/flare/internal/custom"
	"github.com/vantan-project/flare/internal/model"
)

type deleteResponse struct {
	Status  string `json:"status"`
	Message string `json:"message"`
}

func Delete(cc *custom.Context) error {
	if err := cc.DB.Where("id = ?", cc.AuthID).Unscoped().Delete(&model.User{}).Error; err != nil {
		return cc.JSON(500, deleteResponse{
			Status:  "error",
			Message: "ユーザーの削除に失敗しました。",
		})
	}

	return cc.JSON(200, deleteResponse{
		Status:  "success",
		Message: "ユーザーの削除に成功しました。",
	})
}
