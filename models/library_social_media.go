// models/library_social_media.go
package models

import "gorm.io/gorm"

type LibrarySocialMedia struct {
	gorm.Model
	LibraryID   uint
	TwitterURL  string
	FacebookURL string
}