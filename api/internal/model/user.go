package model

import "gorm.io/gorm"

type User struct {
	gorm.Model
	Name            string
	Email           string
	Password        string
	Profile         Profile `gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE"`
	Blogs           []Blog  `gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE"`
	WishedBlogs     []Blog  `gorm:"many2many:wishes"`
	BookmarkedBlogs []Blog  `gorm:"many2many:bookmarks"`
}
