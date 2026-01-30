package model

import "gorm.io/gorm"

type Blog struct {
	gorm.Model
	UserID           uint   `gorm:"not null"`
	ThumbnailImageID uint   `gorm:"not null"`
	Title            string `gorm:"not null"`
	Content          string `gorm:"not null"`
	FlarePoint       int    `gorm:"not null"`
	CorePoint        int    `gorm:"not null"`
}
