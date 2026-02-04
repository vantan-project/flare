package blogs

import (
	"github.com/vantan-project/flare/internal/custom"
)

type disbookmarkRequest struct {
	BlogId uint `param:"blogId"`
}

type disbookmarkResponse struct {
	Status  string `json:"status"`
	Message string `json:"message"`
}

func Disbookmark(cc *custom.Context) error {
	var req disbookmarkRequest
	cc.BindValidate(&req, nil)

	bookmark := bookmark{
		UserID: cc.AuthID,
		BlogID: req.BlogId,
	}
	if err := cc.DB.Table("bookmarks").Where("user_id = ? AND blog_id = ?", cc.AuthID, req.BlogId).Unscoped().Delete(&bookmark).Error; err != nil {
		return cc.JSON(500, disbookmarkResponse{
			Status:  "error",
			Message: "ブックマークから削除に失敗しました。",
		})
	}
	return cc.JSON(200, disbookmarkResponse{
		Status:  "success",
		Message: "ブログのブックマークから削除しました。",
	})
}
