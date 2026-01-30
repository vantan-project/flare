package blogs

import (
	"time"

	"github.com/vantan-project/flare/internal/custom"
	"github.com/vantan-project/flare/internal/model"
)

type indexReqest struct {
	OrderBy string `query:"orderBy" validate:"oneof=createdAt flarePoint corePoint"`
	Limit   uint   `query:"limit"`
	Offset  uint   `query:"offset"`
	UserId  uint   `query:"userId"`
	DaysAgo uint   `query:"daysAgo"`
}

type indexResponseData struct {
	Id               uint     `json:"id"`
	Title            string   `json:"title"`
	ThumbnailImageId uint     `json:"thumbnailImageId"`
	User             User     `json:"user"`
	WishesCount      uint     `json:"wishesCount"`
	Tags             []string `json:"tags"`
	UpdatedAt        string   `json:"updatedAt"`
}

type User struct {
	Id          uint   `json:"id"`
	Name        string `json:"name"`
	UserIconUrl string `json:"userIconUrl"`
}

type indexResponse struct {
	Data  []indexResponseData `json:"data"`
	Total uint                `json:"total"`
}

func Index(cc *custom.Context) error {
	var req indexReqest
	fieldErrors, err := cc.Validate(&req, nil)
	if err != nil {
		return cc.JSON(500, nil)
	}
	// クエリにエラー
	if len(fieldErrors) > 0 {
		return cc.JSON(400, nil)
	}

	query := cc.DB.Model(&model.Blog{})
	// ユーザーIDが存在していた場合。
	if req.UserId > 0 {
		query = query.Where("user_id = ?", req.UserId)
	}
	if req.DaysAgo > 0 {
		query = query.Where("updated_at > ?", time.Now().AddDate(0, 0, int(-req.DaysAgo)))
	}
}
