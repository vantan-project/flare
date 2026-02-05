package tags

import (
	"github.com/vantan-project/flare/internal/custom"
	"github.com/vantan-project/flare/internal/model"
)

type createRequest struct {
	Name string `json:"name" validate:"required,max=20,min=1"`
}

type createResponse struct {
	Status  string `json:"status"`
	Message string `json:"message"`
	TagId   uint   `json:"tagId,omitempty"`
}

func Create(cc *custom.Context) error {
	var req createRequest
	cc.BindValidate(&req, map[string]map[string]string{
		"name": {
			"required": "タグ名は必須です。",
			"max":      "タグ名は20文字以内で入力してください。",
			"min":      "タグ名は1文字以上で入力してください。",
		},
	})
	tag := model.Tag{
		Name: req.Name,
	}
	if err := cc.DB.Create(&tag).Error; err != nil {
		return cc.JSON(500, createResponse{
			Status:  "error",
			Message: "タグの作成に失敗しました。",
		})
	}
	return cc.JSON(200, createResponse{
		Status:  "success",
		Message: "タグの作成に成功しました。",
		TagId:   tag.ID,
	})
}
