package blogs

import (
	"time"

	"github.com/vantan-project/flare/internal/custom"
	"github.com/vantan-project/flare/internal/model"
)

type wishIndexRequest struct {
	UserID *uint `query:"userId" validate:"required,min=1"`
	Limit  *int  `query:"limit" validate:"omitempty,min=1,max=20"`
	Offset *int  `query:"offset" validate:"omitempty,min=0"`
}

type wishIndexResponse struct {
	Data  []indexResponseData `json:"data"`
	Total uint                `json:"total"`
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

func Index(cc *custom.Context) error {
	var req wishIndexRequest
	cc.BindValidate(&req, nil)

	query := cc.DB.Model(&model.Blog{}).
		Joins("INNER JOIN wishes ON wishes.blog_id = blogs.id").
		Where("wishes.user_id = ?", req.UserID).
		Where("wishes.deleted_at IS NULL").
		Where("blogs.deleted_at IS NULL")

	if req.Limit != nil {
		query = query.Limit(*req.Limit)
	}

	if req.Offset != nil && req.Limit != nil {
		query = query.Offset(*req.Offset)
	}

	var total int64
	if err := query.Count(&total).Error; err != nil {
		return cc.JSON(500, nil)
	}

	query = query.Select("blogs.id,blogs.title,blogs.user_id,blogs.thumbnail_image_id,blogs.updated_at," +
		"(SELECT COUNT(*) FROM wishes WHERE wishes.blog_id = blogs.id AND wishes.deleted_at IS NULL) AS WishedCount," +
		"(SELECT COUNT(*) FROM bookmarks WHERE bookmarks.blog_id = blogs.id AND bookmarks.deleted_at IS NULL) AS BookmarkedCount").
		Preload("User.Profile.Image").
		Preload("Tags").
		Preload("Image")

	var blogs []model.Blog
	if err := query.Find(&blogs).Error; err != nil {
		return cc.JSON(500, nil)
	}

	data := make([]indexResponseData, len(blogs))
	for i, blog := range blogs {
		var tags []string
		for _, tag := range blog.Tags {
			tags = append(tags, tag.Name)
		}
		var userIconUrl string
		if blog.User.Profile.Image.ID != 0 {
			userIconUrl = blog.User.Profile.Image.URL
		}
		data[i] = indexResponseData{
			Id:                blog.ID,
			Title:             blog.Title,
			ThumbnailImageUrl: blog.Image.URL,
			User: User{
				Id:          blog.UserID,
				Name:        blog.User.Profile.Name,
				UserIconUrl: userIconUrl,
			},
			WishesCount:    uint(blog.WishedCount),
			BookmarksCount: uint(blog.BookmarkedCount),
			Tags:           tags,
			UpdatedAt:      blog.UpdatedAt.Format(time.DateTime),
		}
	}

	return cc.JSON(200, wishIndexResponse{
		Data:  data,
		Total: uint(total),
	})
}
