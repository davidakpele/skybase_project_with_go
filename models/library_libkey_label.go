// models/library_libkey_label.go
package models

import "gorm.io/gorm"

type LibraryLibkeyLabel struct {
	gorm.Model
	LibraryID                        uint
	LinkResolverOpenURLTemplateLabel string `gorm:"column:link_resolver_open_url_template_label"`
	EmailArticleRequestTemplateLabel string
	PubMedFallbackTemplateLabel      string
	LibkeyFallbackTemplateLabel      string
	LibkeyFallbackURLLabel           string
	LibkeyCustomPDFLinkLabel         string
	LibkeyCustomArticleLinkLabel     string
	LibkeyCustomTroubleLinkLabel     string
	LibkeyCustomArticleInContextLabel string
}