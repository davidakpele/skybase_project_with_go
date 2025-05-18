package models

import "gorm.io/gorm"

type LibraryAuthName struct {
	gorm.Model
	LibraryID uint
	AuthName1 string
	AuthName2 string
	AuthName3 string
}