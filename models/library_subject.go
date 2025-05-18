// models/library_subject.go
package models

import (
	"time"
	"gorm.io/gorm"
)

type LibrarySubject struct {
    LibraryID uint `gorm:"primaryKey"`
    SubjectID uint `gorm:"primaryKey"`
    CreatedAt time.Time
    UpdatedAt time.Time
    DeletedAt gorm.DeletedAt `gorm:"index"`
}