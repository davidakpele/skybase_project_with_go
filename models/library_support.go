// models/library_support.go
package models

import "gorm.io/gorm"

type LibrarySupport struct {
	gorm.Model
	LibraryID uint
	Site      string
	APIKey    string
}