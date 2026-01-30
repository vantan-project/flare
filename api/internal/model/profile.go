package model

import "gorm.io/gorm"

type Profile struct {
	gorm.Model
	Name        string `gorm:"not null"`
	IconImageID uint   `gorm:"not null"`
	UserID      uint   `gorm:"not null;unique"`
}
