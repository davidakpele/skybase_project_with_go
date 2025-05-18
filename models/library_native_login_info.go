// models/library_native_login_info.go
package models

import "gorm.io/gorm"

type LibraryNativeLoginInfo struct {
	gorm.Model
	LibraryID     uint
	Title         string
	Description   string
	ContinueLabel string
	LinkLabel     string
	LinkURL       string
}