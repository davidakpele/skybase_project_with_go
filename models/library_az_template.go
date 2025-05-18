package models

import "gorm.io/gorm"

type LibraryAZTemplate struct {
	gorm.Model
	LibraryID                 uint
	AZISSNSearchTemplate      string `gorm:"column:az_issn_search_template"`
	AZPreProxy                string `gorm:"column:az_pre_proxy"`
	AZTitleSearchTemplate     string `gorm:"column:az_title_search_template"`
	KnownJournalLookupTemplate string
	LinkResolverOpenURLTemplate string `gorm:"column:link_resolver_open_url_template"`
}