package blogs

import (
	"errors"

	"github.com/vantan-project/flare/internal/custom"
	"github.com/vantan-project/flare/internal/model"
	"gorm.io/gorm"
)

type detailRequest struct {
	BlogID uint `param:"blogId"`
}

type detailResponse struct {
	Data detailBlog `json:"data"`
}

type detailBlog struct {
	Id                uint       `json:"id"`
	Title             string     `json:"title"`
	Content           string     `json:"content"`
	ThumbnailImageUrl string     `json:"thumbnailImageUrl"`
	User              detailUser `json:"user"`
	Tags              []rtag     `json:"tags"`
	UpdatedAt         string     `json:"updatedAt"`
	WishesCount       uint       `json:"wishesCount"`
	BookmarksCount    uint       `json:"bookmarksCount"`
}

type detailUser struct {
	Id          uint   `json:"id"`
	Name        string `json:"name"`
	UserIconUrl string `json:"userIconUrl,omitempty"`
}

type rtag struct {
	ID   uint   `json:"id"`
	Name string `json:"name"`
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
		Select("id,title,user_id,content,thumbnail_image_id,updated_at," +
			"(SELECT COUNT(*) FROM wishes WHERE wishes.blog_id = blogs.id AND wishes.deleted_at IS NULL) AS WishedCount," +
			"(SELECT COUNT(*) FROM bookmarks WHERE bookmarks.blog_id = blogs.id AND bookmarks.deleted_at IS NULL) AS BookmarkedCount")

	if err := query.First(&blog).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return cc.JSON(404, nil)
		}
	}

	tags := make([]rtag, 0)
	for _, tag := range blog.Tags {
		tags = append(tags, rtag{
			ID:   tag.ID,
			Name: tag.Name,
		})
	}

	var userIconUrl string
	if blog.User.Profile.Image.ID != 0 {
		userIconUrl = blog.User.Profile.Image.URL
	}

	return cc.JSON(200, detailResponse{
		Data: detailBlog{
			Id:                blog.ID,
			Title:             blog.Title,
			Content:           blog.Content,
			ThumbnailImageUrl: blog.Image.URL,
			User: detailUser{
				Id:          blog.User.ID,
				Name:        blog.User.Profile.Name,
				UserIconUrl: userIconUrl,
			},
			Tags:           tags,
			UpdatedAt:      blog.UpdatedAt.Format("2006-01-02   15:04"),
			WishesCount:    uint(blog.WishedCount),
			BookmarksCount: uint(blog.BookmarkedCount),
		},
	})
}
