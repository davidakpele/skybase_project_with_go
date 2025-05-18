// models/library_service.go
package models

import "gorm.io/gorm"

type LibraryService struct {
	gorm.Model
	LibraryID       uint
	ZoteroEnabled   bool `gorm:"default:false"`
	MendeleyEnabled bool `gorm:"default:false"`
	EndnoteEnabled  bool `gorm:"default:false"`
	RefworksEnabled bool `gorm:"default:false"`
	RefworksServer  string
}