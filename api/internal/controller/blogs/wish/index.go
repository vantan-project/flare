package wish

import (
	"time"

	"github.com/vantan-project/flare/internal/custom"
	"github.com/vantan-project/flare/internal/model"
)

type indexReqest struct {
	OrderBy *string `query:"orderBy"`
	Limit   *int    `query:"limit"`
	Offset  *int    `query:"offset"`
	DaysAgo *uint   `query:"daysAgo"`
}

type indexResponseData struct {
	Id                uint     `json:"id"`
	Title             string   `json:"title"`
	ThumbnailImageUrl string   `json:"thumbnailImageUrl"`
	User              User     `json:"user"`
	WishesCount       uint     `json:"wishesCount"`
	BookmarksCount    uint     `json:"bookmarksCount"`
	Tags              []string `json:"tags"`
	UpdatedAt         string   `json:"updatedAt"`
}

type User struct {
	Id          uint   `json:"id"`
	Name        string `json:"name"`
	UserIconUrl string `json:"userIconUrl,omitempty"`
}

type indexResponse struct {
	Data  []indexResponseData `json:"data"`
	Total uint                `json:"total"`
}

func Index(cc *custom.Context) error {
	var req indexReqest
	cc.BindValidate(&req, nil)

	query := cc.DB.
    Table("blogs AS b").
    Joins(`
        JOIN wishes AS wj
          ON wj.blog_id = b.id
         AND wj.deleted_at IS NULL
    `).
    Where("wj.user_id = ?", cc.AuthID)

	if req.DaysAgo != nil {
		query = query.Where("updated_at > ?", time.Now().AddDate(0, 0, int(*req.DaysAgo)))
	}
	if req.Limit != nil {
		query = query.Limit(*req.Limit)
	}
	if req.Offset != nil {
		query = query.Offset(*req.Offset)
	}

	var total int64
	if err := query.Count(&total).Error; err != nil {
		return cc.JSON(500, nil)
	}
	// リレーション
	query = query.Select(`
				b.id,
				b.title,
				b.user_id,
				b.thumbnail_image_id,
				b.updated_at,
				(
						SELECT COUNT(*)
						FROM wishes w
						WHERE w.blog_id = b.id
							AND w.deleted_at IS NULL
				) AS wished_count,
				(
						SELECT COUNT(*)
						FROM bookmarks bm
						WHERE bm.blog_id = b.id
							AND bm.deleted_at IS NULL
				) AS bookmarked_count
		`).
		Preload("User.Profile.Image").
		Preload("Tags").
		Preload("Image")

	if req.OrderBy != nil {
		switch *req.OrderBy {
		case "createdAt":
			query = query.Order("created_at DESC")
		case "flarePoint":
			query = query.Order("flare_point DESC")
		case "corePoint":
			query = query.Order("core_point DESC")
		case "wish":
			query = query.Order("WishedCount DESC")
		case "bookmark":
			query = query.Order("BookmarkedCount DESC")
		}
	}

	// ここでエラー
	var blogs []model.Blog
	if err := query.Find(&blogs).Error; err != nil {
		cc.JSON(200, err)
		return cc.JSON(500, nil)
	}

	data := make([]indexResponseData, len(blogs))
	for i, blog := range blogs {
		data[i] = indexResponseData{
			Id:                blog.ID,
			Title:             blog.Title,
			ThumbnailImageUrl: blog.Image.URL,
			User: User{
				Id:          blog.UserID,
				Name:        blog.User.Profile.Name,
				UserIconUrl: blog.User.Profile.Image.URL,
			},
			WishesCount:    uint(blog.WishedCount),
			BookmarksCount: uint(blog.BookmarkedCount),
			UpdatedAt:      blog.UpdatedAt.Format(time.DateTime),
		}
	}

	return cc.JSON(200, indexResponse{
		Data:  data,
		Total: uint(total),
	})
}
