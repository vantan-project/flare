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
}
