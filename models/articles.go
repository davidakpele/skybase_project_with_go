// models/article.go
package models

import (
	"strconv"
	"time"
	"gorm.io/gorm"
)

type Article struct {
	gorm.Model
	ID       				 uint `gorm:"primaryKey;type:bigint unsigned" json:"id"`
	Type     				  string `gorm:"type:varchar(50);default:'articles'" json:"type"`
	SyncID                    uint      `json:"syncId" gorm:"column:sync_id"`
	Title                     string    `json:"title"`
	Date                      time.Time `json:"date" gorm:"type:date"`
	Authors                   string    `json:"authors"`
	StartPage                 string    `json:"startPage" gorm:"column:start_page"`
	EndPage                   string    `json:"endPage" gorm:"column:end_page"`
	ILLURL                    string    `json:"ILLURL" gorm:"column:ill_url"`
	LinkResolverOpenurlLink   string    `json:"linkResolverOpenurlLink" gorm:"column:link_resolver_openurl_link"`
	EmailArticleRequestLink   string    `json:"emailArticleRequestLink"`
	Permalink                 string    `json:"permalink"`
	DOI                       string    `json:"doi" gorm:"column:doi"`
	Suppressed                bool      `json:"suppressed" gorm:"default:false"`
	InPress                   bool      `json:"inPress" gorm:"column:in_press;default:false"`
	OpenAccess                bool      `json:"openAccess" gorm:"column:open_access;default:false"`
	PMID                      string    `json:"pmid" gorm:"column:pmid"`
	Abstract                  string    `json:"abstract"`
	PlatformID                string    `json:"platformId" gorm:"column:platform_id"`
	RetractionDOI             *string   `json:"retractionDoi" gorm:"column:retraction_doi"`
	RetractionDate            *time.Time `json:"retractionDate" gorm:"column:retraction_date"`
	RetractionRelatedURLs     *string   `json:"retractionRelatedUrls" gorm:"column:retraction_related_urls"`
	UnpaywallDataSuppressed   bool      `json:"unpaywallDataSuppressed" gorm:"column:unpaywall_data_suppressed;default:false"`
	ExpressionOfConcernDOI    *string   `json:"expressionOfConcernDoi" gorm:"column:expression_of_concern_doi"`
	WithinLibraryHoldings     bool      `json:"withinLibraryHoldings" gorm:"column:within_library_holdings;default:true"`
	BrowzineWebInContextLink  string    `json:"browzineWebInContextLink" gorm:"column:browzine_web_in_context_link"`
	ContentLocation          string    `json:"contentLocation" gorm:"column:content_location"`
	LibkeyContentLocation    string    `json:"libkeyContentLocation" gorm:"column:libkey_content_location"`
	FullTextFile             string    `json:"fullTextFile" gorm:"column:full_text_file"`
	LibkeyFullTextFile       string    `json:"libkeyFullTextFile" gorm:"column:libkey_full_text_file"`
	NomadFallbackURL         string    `json:"nomadFallbackURL" gorm:"column:nomad_fallback_url"`
	
	// Relationships
    JournalID uint `gorm:"column:journal_id;type:bigint unsigned" json:"-"`
    Journal   Journal `gorm:"foreignKey:JournalID;references:ID"`
    
    IssueID uint `gorm:"column:issue_id;type:bigint unsigned" json:"-"`
    Issue   Issue `gorm:"foreignKey:IssueID;references:ID"`
    
    LibraryID uint `gorm:"type:bigint unsigned" json:"-"`
}

// ArticleAttributes represents the attributes object in the JSON response
type ArticleAttributes struct {
	SyncID                    uint       `json:"syncId"`
	Title                     string     `json:"title"`
	Date                      string     `json:"date"`
	Authors                   string     `json:"authors"`
	StartPage                 string     `json:"startPage"`
	EndPage                   string     `json:"endPage"`
	ILLURL                    string     `json:"ILLURL"`
	LinkResolverOpenurlLink   string     `json:"linkResolverOpenurlLink"`
	EmailArticleRequestLink   string     `json:"emailArticleRequestLink"`
	Permalink                 string     `json:"permalink"`
	DOI                       string     `json:"doi"`
	Suppressed                bool       `json:"suppressed"`
	InPress                   bool       `json:"inPress"`
	OpenAccess                bool       `json:"openAccess"`
	PMID                      string     `json:"pmid"`
	Abstract                  string     `json:"abstract"`
	PlatformID                string     `json:"platformId"`
	RetractionDOI             *string    `json:"retractionDoi"`
	RetractionDate            *string    `json:"retractionDate"`
	RetractionRelatedURLs     *string    `json:"retractionRelatedUrls"`
	UnpaywallDataSuppressed   bool       `json:"unpaywallDataSuppressed"`
	ExpressionOfConcernDOI    *string    `json:"expressionOfConcernDoi"`
	WithinLibraryHoldings     bool       `json:"withinLibraryHoldings"`
	BrowzineWebInContextLink  string     `json:"browzineWebInContextLink"`
	ContentLocation           string     `json:"contentLocation"`
	LibkeyContentLocation     string     `json:"libkeyContentLocation"`
	FullTextFile              string     `json:"fullTextFile"`
	LibkeyFullTextFile        string     `json:"libkeyFullTextFile"`
	NomadFallbackURL          string     `json:"nomadFallbackURL"`
}

// RelationshipData represents the relationship data in the JSON response
type RelationshipData struct {
	Type string `json:"type"`
	ID   string `json:"id"`
}

// ArticleRelationships represents the relationships object in the JSON response
type ArticleRelationships struct {
	Journal struct {
		Data RelationshipData `json:"data"`
	} `json:"journal"`
	Issue struct {
		Data RelationshipData `json:"data"`
	} `json:"issue"`
}

// ToAPIFormat converts the Article model to the API response format
func (a *Article) ToAPIFormat() map[string]interface{} {
	retractionDate := ""
	if a.RetractionDate != nil {
		retractionDate = a.RetractionDate.Format("2006-01-02")
	}

	return map[string]interface{}{
		"id":   a.ID,
		"type": "articles",
		"attributes": ArticleAttributes{
			SyncID:                    a.SyncID,
			Title:                     a.Title,
			Date:                      a.Date.Format("2006-01-02"),
			Authors:                   a.Authors,
			StartPage:                 a.StartPage,
			EndPage:                   a.EndPage,
			ILLURL:                    a.ILLURL,
			LinkResolverOpenurlLink:   a.LinkResolverOpenurlLink,
			EmailArticleRequestLink:   a.EmailArticleRequestLink,
			Permalink:                a.Permalink,
			DOI:                      a.DOI,
			Suppressed:               a.Suppressed,
			InPress:                  a.InPress,
			OpenAccess:               a.OpenAccess,
			PMID:                     a.PMID,
			Abstract:                 a.Abstract,
			PlatformID:               a.PlatformID,
			RetractionDOI:            a.RetractionDOI,
			RetractionDate:           &retractionDate,
			RetractionRelatedURLs:    a.RetractionRelatedURLs,
			UnpaywallDataSuppressed:  a.UnpaywallDataSuppressed,
			ExpressionOfConcernDOI:   a.ExpressionOfConcernDOI,
			WithinLibraryHoldings:    a.WithinLibraryHoldings,
			BrowzineWebInContextLink: a.BrowzineWebInContextLink,
			ContentLocation:         a.ContentLocation,
			LibkeyContentLocation:   a.LibkeyContentLocation,
			FullTextFile:            a.FullTextFile,
			LibkeyFullTextFile:      a.LibkeyFullTextFile,
			NomadFallbackURL:        a.NomadFallbackURL,
		},
		"relationships": ArticleRelationships{
			Journal: struct {
				Data RelationshipData `json:"data"`
			}{
				Data: RelationshipData{
					Type: "journals",
					ID:   strconv.FormatUint(uint64(a.JournalID), 10),
				},
			},
			Issue: struct {
				Data RelationshipData `json:"data"`
			}{
				Data: RelationshipData{
					Type: "issues",
					ID:   strconv.FormatUint(uint64(a.IssueID), 10),
				},
			},
		},
	}
}