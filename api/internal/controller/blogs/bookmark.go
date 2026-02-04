package blogs

import (
	"github.com/vantan-project/flare/internal/custom"
)

type bookmarkRequest struct {
	BlogId uint `param:"blogId"`
}

type bookmarkResponse struct {
	Status  string `json:"status"`
	Message string `json:"message"`
}

type bookmark struct {
	UserID uint
	BlogID uint
}

func Bookmark(cc *custom.Context) error {
	var req bookmarkRequest
	cc.BindValidate(&req, nil)

	bookmark := bookmark{
		UserID: cc.AuthID,
		BlogID: req.BlogId,
	}
	if err := cc.DB.Table("bookmarks").Create(&bookmark).Error; err != nil {
		return cc.JSON(500, bookmarkResponse{
			Status:  "error",
			Message: "ブックマークに追加に失敗しました。",
		})
	}
	return cc.JSON(200, bookmarkResponse{
		Status:  "success",
		Message: "ブログをブックマークしました。",
	})
}
