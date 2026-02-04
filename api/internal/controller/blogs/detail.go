package blogs

import (
	"errors"
	"time"

	"github.com/vantan-project/flare/internal/custom"
	"github.com/vantan-project/flare/internal/model"
	"gorm.io/gorm"
)

type detailRequest struct {
	BlogID uint `param:"blogId"`
}

type detailResponse struct {
	Id                uint     `json:"id"`
	Title             string   `json:"title"`
	Content           string   `json:"content"`
	ThumbnailImageUrl string   `json:"thumbnailImageUrl"`
	User              user     `json:"user"`
	Tags              []string `json:"tags"`
	UpdatedAt         string   `json:"updatedAt"`
	WishesCount       uint     `json:"wishesCount"`
	BookmarksCount    uint     `json:"bookmarksCount"`
}

type user struct {
	Id          uint   `json:"id"`
	Name        string `json:"name"`
	UserIconUrl string `json:"userIconUrl,omitempty"`
}

func Detail(cc *custom.Context) error {
	var req detailRequest
	cc.BindValidate(&req, nil)

	var blog model.Blog
	query := cc.DB.Model(&model.Blog{}).
		Where("id = ?", req.BlogID).
		Where("deleted_at IS NULL").
		Preload("User.Profile.Image").
		Preload("Tags").
		Preload("Image").
		Select("id,title,user_id,thumbnail_image_id,updated_at," +
			"(SELECT COUNT(*) FROM wishes WHERE wishes.blog_id = blogs.id AND wishes.deleted_at IS NULL) AS WishedCount," +
			"(SELECT COUNT(*) FROM bookmarks WHERE bookmarks.blog_id = blogs.id AND bookmarks.deleted_at IS NULL) AS BookmarkedCount")

	if err := query.First(&blog).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return cc.JSON(404, nil)
		}
	}

	var tags []string
	for _, tag := range blog.Tags {
		tags = append(tags, tag.Name)
	}

	var userIconUrl string
	if blog.User.Profile.Image != nil {
		userIconUrl = blog.User.Profile.Image.URL
	}

	return cc.JSON(200, detailResponse{
		Id:                blog.ID,
		Title:             blog.Title,
		Content:           blog.Content,
		ThumbnailImageUrl: blog.Image.URL,
		User: user{
			Id:          blog.User.ID,
			Name:        blog.User.Profile.Name,
			UserIconUrl: userIconUrl,
		},
		Tags:           tags,
		UpdatedAt:      blog.UpdatedAt.Format(time.RFC3339),
		WishesCount:    uint(blog.WishedCount),
		BookmarksCount: uint(blog.BookmarkedCount),
	})
}
