package model

import "gorm.io/gorm"

type User struct {
	gorm.Model
	Name     string
	Email    string
	Password string
	Profile  Profile `gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE"`
	// Blogs      []Blog  `gorm:"foreignKey:AuthorID"`
	// WishedBlogs []WishedBlog  `gorm:"many2many:wishes;joinForeignKey:UserID;joinReferences:BlogID"`
}
