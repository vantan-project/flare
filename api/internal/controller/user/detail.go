package user

import (
	"errors"

	"github.com/vantan-project/flare/internal/custom"
	"github.com/vantan-project/flare/internal/model"
	"gorm.io/gorm"
)

type detailRequest struct {
	ID uint `param:"id"`
}

type detailResponse struct {
	Data detailUser `json:"data"`
}

type detailUser struct {
	Id           uint    `json:"id"`
	Name         string  `json:"name"`
	IconImageUrl *string `json:"iconImageUrl"`
}

func Detail(cc *custom.Context) error {
	var req detailRequest
	cc.BindValidate(&req, nil)

	var user model.User
	err := cc.DB.
		Preload("Profile").
		Preload("Profile.Image").
		Where("id = ?", req.ID).
		First(&user).Error

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return cc.JSON(404, nil)
		}
		return err
	}

	var iconImageUrl *string
	if user.Profile.Image.ID != 0 {
		url := user.Profile.Image.URL
		iconImageUrl = &url
	}

	return cc.JSON(200, detailResponse{
		Data: detailUser{
			Id:           user.ID,
			Name:         user.Profile.Name,
			IconImageUrl: iconImageUrl,
		},
	})
}
