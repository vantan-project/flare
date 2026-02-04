package bookmark

import (
	"time"

	"github.com/vantan-project/flare/internal/custom"
	"github.com/vantan-project/flare/internal/model"
)

type indexReqest struct {
	Limit   *int    `query:"limit"`
	Offset  *int    `query:"offset"`
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
        JOIN bookmarks AS bj
          ON bj.blog_id = b.id
          AND bj.deleted_at IS NULL
    `).
    Where("bj.user_id = ?", cc.AuthID)
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
						FROM wishes w2
						WHERE w2.blog_id = b.id
							AND w2.deleted_at IS NULL
				) AS wished_count,
				(
						SELECT COUNT(*)
						FROM bookmarks bm2
						WHERE bm2.blog_id = b.id
							AND bm2.deleted_at IS NULL
				) AS bookmarked_count
		`).
		Preload("User.Profile.Image").
		Preload("Tags").
		Preload("Image").
		Order("bj.created_at DESC")

	var blogs []model.Blog
	if err := query.Find(&blogs).Error; err != nil {
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
