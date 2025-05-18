// models/library_subscription.go
package models

import "gorm.io/gorm"

type LibrarySubscription struct {
	gorm.Model
	LibraryID uint
	Platform  string `gorm:"not null"` // 'ios', 'android', 'web', etc.
	Active    bool   `gorm:"default:false"`
	Type      string
}