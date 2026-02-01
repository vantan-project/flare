package model

import "gorm.io/gorm"

type Tag struct {
	gorm.Model
	Name  string
	Blogs []Blog `gorm:"many2many:blog_tags"`
}
