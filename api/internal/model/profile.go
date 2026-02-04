package model

import "gorm.io/gorm"

type Profile struct {
	gorm.Model
	Name        string
	IconImageID *uint
	UserID      uint
	Image       Image `gorm:"foreignKey:IconImageID"`
}
