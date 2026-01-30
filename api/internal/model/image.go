package model

import "gorm.io/gorm"

type Image struct {
	gorm.Model
	URL     string  `gorm:"not null"`
	Path    string  `gorm:"not null"`
	Profile Profile `gorm:"foreignKey:IconImageID;constraint:OnDelete:CASCADE"`
	Blog    Blog    `gorm:"foreignKey:ThumbnailImageID;constraint:OnDelete:CASCADE"`
}
