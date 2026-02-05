package blogs

import (
	"github.com/vantan-project/flare/internal/custom"
)

type wishRequest struct {
	BlogID uint `param:"blogId"`
}

type wishResponse struct {
	Status  string `json:"status"`
	Message string `json:"message"`
}

type wish struct {
	UserID uint
	BlogID uint
}

func Wish(cc *custom.Context) error {
	var req wishRequest
	cc.BindValidate(&req, nil)

	wish := wish{
		UserID: cc.AuthID,
		BlogID: req.BlogID,
	}
	if err := cc.DB.Table("wishes").Create(&wish).Error; err != nil {
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
