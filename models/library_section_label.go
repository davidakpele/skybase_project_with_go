// models/library_section_label.go
package models

import "gorm.io/gorm"

type LibrarySectionLabel struct {
	gorm.Model
	LibraryID     uint
	BrowzineLibrary string
	Info          string
}