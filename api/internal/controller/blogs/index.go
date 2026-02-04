package blogs

import (
	"time"

	"github.com/vantan-project/flare/internal/custom"
	"github.com/vantan-project/flare/internal/model"
)

type indexReqest struct {
	OrderBy *string `query:"orderBy"`
	Limit   *int    `query:"limit"`
	Offset  *int    `query:"offset"`
	UserId  *uint   `query:"userId"`
	DaysAgo *uint   `query:"daysAgo"`
	TagIds  *[]uint `query:"tagIds"`
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

	query := cc.DB.Model(&model.Blog{})
	// ユーザーIDが存在していた場合。
	if req.UserId != nil {
		query = query.Where("user_id = ?", req.UserId)
	}
	if req.DaysAgo != nil {
		query = query.Where("updated_at > ?", time.Now().AddDate(0, 0, int(*req.DaysAgo)))
	}

	if req.TagIds != nil {
		query = query.Joins("JOIN blog_tags ON blog_tags.blog_id = blogs.id ").
			Where("blog_tags.tag_id IN (?)", req.TagIds)
	}

	var total int64
	if err := query.Count(&total).Error; err != nil {
		return cc.JSON(500, nil)
	}

	// リレーション
	query = query.Select("blogs.id,blogs.title,blogs.user_id,blogs.thumbnail_image_id,blogs.updated_at," +
		"(SELECT COUNT(*) FROM wishes WHERE wishes.blog_id = blogs.id AND wishes.deleted_at IS NULL) AS WishedCount," +
		"(SELECT COUNT(*) FROM bookmarks WHERE bookmarks.blog_id = blogs.id AND bookmarks.deleted_at IS NULL) AS BookmarkedCount").
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

	if req.Limit != nil {
		query = query.Limit(*req.Limit)
	}
	// offsetはlimitと一緒じゃないとダメみたい。
	if req.Offset != nil && req.Limit != nil {
		query = query.Offset(*req.Offset)
	}

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
			Tags:           tags,
			UpdatedAt:      blog.UpdatedAt.Format(time.DateTime),
		}
	}

	return cc.JSON(200, indexResponse{
		Data:  data,
		Total: uint(total),
	})
}
