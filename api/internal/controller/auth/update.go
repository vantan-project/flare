package auth

import (
	"github.com/vantan-project/flare/internal/custom"
	"github.com/vantan-project/flare/internal/model"
)

type updateRequest struct {
	Name        *string `json:"name" validate:"omitempty,max=20,min=1"`
	IconImageId *uint   `json:"iconImageId" validate:"omitempty,min=1"`
}

type updateResponse struct {
	Status  string `json:"status"`
	Message string `json:"message"`
}

func Update(cc *custom.Context) error {
	var req updateRequest
	cc.BindValidate(&req, map[string]map[string]string{
		"name": {
			"max": "ユーザー名は20文字以内で入力してください。",
			"min": "ユーザー名は1文字以上で入力してください。",
		},
		"iconImageId": {
			"min": "アイコン画像は必須です。",
		},
	})

	var profile model.Profile
	if req.Name != nil {
		profile.Name = *req.Name
	}
	if req.IconImageId != nil {
		profile.IconImageID = req.IconImageId
	}

	if err := cc.DB.Where("user_id = ?", cc.AuthID).Updates(&profile).Error; err != nil {
		return cc.JSON(500, updateResponse{
			Status:  "error",
			Message: "プロフィールの更新に失敗しました。",
		})
	}

	return cc.JSON(200, updateResponse{
		Status:  "success",
		Message: "プロフィールの更新に成功しました。",
	})
}
