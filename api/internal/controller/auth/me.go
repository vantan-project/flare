package auth

import (
	"github.com/vantan-project/flare/internal/custom"
	"github.com/vantan-project/flare/internal/model"
)

type meResponse struct {
	Data myData `json:"data"`
}

type myData struct {
	Id            uint   `json:"id"`
	Name          string `json:"name"`
	IconImageUrl  string `json:"iconImageUrl"`
	WishedIds     []uint `json:"wishedIds"`
	BookmarkedIds []uint `json:"bookmarkedIds"`
}

func Me(cc *custom.Context) error {
	var user model.User
	if err := cc.DB.Where("id = ?", cc.AuthID).
		Preload("Profile.Image").
		Preload("WishedBlogs").
		Preload("BookmarkedBlogs").
		First(&user).Error; err != nil {
		return cc.JSON(404, nil)
	}

	wished := make([]uint, len(user.WishedBlogs))
	for i, blog := range user.WishedBlogs {
		wished[i] = blog.ID
	}

	bookmarked := make([]uint, len(user.BookmarkedBlogs))
	for i, blog := range user.BookmarkedBlogs {
		bookmarked[i] = blog.ID
	}

	return cc.JSON(200, meResponse{
		Data: myData{
			Id:            user.ID,
			Name:          user.Profile.Name,
			IconImageUrl:  user.Profile.Image.URL,
			WishedIds:     wished,
			BookmarkedIds: bookmarked,
		},
	})
}
