// models/library_web_login_info.go
package models

import "gorm.io/gorm"

type LibraryWebLoginInfo struct {
	gorm.Model
	LibraryID     uint
	Title         string
	Description   string
	ContinueLabel string
	LinkLabel     string
	LinkURL       string
}