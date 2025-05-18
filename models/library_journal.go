// models/library_journal.go
package models

import (
	"time"
	"gorm.io/gorm"
)

type LibraryJournal struct {
    ID        uint           `gorm:"primaryKey;autoIncrement"`
    LibraryID uint
    JournalID uint
    CreatedAt time.Time
    UpdatedAt time.Time
    DeletedAt gorm.DeletedAt `gorm:"index"`
}
