package model

import "gorm.io/gorm"

type Blog struct {
	gorm.Model
	UserID           uint
	ThumbnailImageID uint
	Title            string
	Content          string
	FlarePoint       int
	CorePoint        int
	WishedUsers      []User `gorm:"many2many:wishes"`
	BookmarkedUsers  []User `gorm:"many2many:bookmarks"`
	Tags             []Tag  `gorm:"many2many:blog_tags"`
	User             User
	Image            Image `gorm:"foreignKey:ThumbnailImageID"`

	WishedCount     int64 `gorm:"->"`
	BookmarkedCount int64 `gorm:"->"`
}
