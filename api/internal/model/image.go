package model

import "gorm.io/gorm"

type Image struct {
	gorm.Model
	URL     string
	Path    string
	Profile *Profile `gorm:"foreignKey:IconImageID;constraint:OnDelete:CASCADE"`
	Blog    *Blog    `gorm:"foreignKey:ThumbnailImageID;constraint:OnDelete:CASCADE"`
}
