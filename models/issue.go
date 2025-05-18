// models/issue.go
package models

import (
	"fmt"
	"time"

	"gorm.io/gorm"
)

// issue.go
type Issue struct {
	gorm.Model
	ID                  uint      `gorm:"primaryKey;type:bigint unsigned auto_increment" json:"id"`
	Type                string    `gorm:"type:varchar(50);default:'issues'" json:"type"`
	IsValidIssue        bool      `gorm:"column:is_valid_issue" json:"isValidIssue"`
	Title               string    `gorm:"type:varchar(255)" json:"title"`
	Volume              string    `gorm:"type:varchar(50)" json:"volume"`
	Number              string    `gorm:"type:varchar(50)" json:"number"`
	Date                time.Time `gorm:"type:date" json:"date"`
	Suppressed          bool      `gorm:"default:false" json:"suppressed"`
	AvailabilityMessage string    `gorm:"type:text" json:"availabilityMessage"`
	Embargoed           bool      `gorm:"default:false" json:"embargoed"`
	WithinSubscription  bool      `gorm:"column:within_subscription;default:true" json:"withinSubscription"`

	JournalID uint    `gorm:"column:journal_id;type:bigint unsigned;not null" json:"journal"`
	Journal   Journal `gorm:"foreignKey:JournalID;references:ID"`

	PublicationYearID uint             `gorm:"column:publication_year_id;not null" json:"publicationYearId"`
	PublicationYear   PublicationYears `gorm:"foreignKey:PublicationYearID;references:ID"`

	Articles []Article `gorm:"foreignKey:IssueID"`
}



// IssueLinks represents the links object in the JSON response
type IssueLinks struct {
	Articles string `json:"articles"`
}

// IssueAttributes represents the attributes object in the JSON response
type IssueAttributes struct {
	IsValidIssue        bool   `json:"isValidIssue"`
	Title              string `json:"title"`
	Volume             string `json:"volume"`
	Number             string `json:"number"`
	Date               string `json:"date"`
	Journal            uint   `json:"journal"`
	Suppressed         bool   `json:"suppressed"`
	AvailabilityMessage string `json:"availabilityMessage"`
	Embargoed          bool   `json:"embargoed"`
	WithinSubscription bool   `json:"withinSubscription"`
}

// ToAPIFormat converts the Issue model to the API response format
func (i *Issue) ToAPIFormat(libraryID uint) map[string]interface{} {
	return map[string]interface{}{
		"id":   i.ID,
		"type": "issues",
		"attributes": IssueAttributes{
			IsValidIssue:        i.IsValidIssue,
			Title:              i.Title,
			Volume:             i.Volume,
			Number:             i.Number,
			Date:               i.Date.Format("2006-01-02"),
			Journal:            i.JournalID,
			Suppressed:         i.Suppressed,
			AvailabilityMessage: i.AvailabilityMessage,
			Embargoed:          i.Embargoed,
			WithinSubscription: i.WithinSubscription,
		},
		"isValidIssue":        i.IsValidIssue,
		"title":              i.Title,
		"volume":             i.Volume,
		"number":             i.Number,
		"date":               i.Date.Format("2006-01-02"),
		"journal":            i.JournalID,
		"suppressed":         i.Suppressed,
		"availabilityMessage": i.AvailabilityMessage,
		"embargoed":          i.Embargoed,
		"withinSubscription": i.WithinSubscription,
		"publicationYearId":    i.PublicationYearID,
		"links": IssueLinks{
			Articles:   i.GenerateArticlesLink(libraryID),
		},
	}
}

// GenerateArticlesLink creates the articles link for this issue
func (i *Issue) GenerateArticlesLink(libraryID uint) string {
	return fmt.Sprintf("/v2/libraries/%d/issues/%d/articles", libraryID, i.ID)
}

func (i *Issue) ToRelationshipData() map[string]interface{} {
	return map[string]interface{}{
		"data": map[string]interface{}{
			"type": "issues",
			"id":   i.ID,
		},
	}
}

func (Issue) TableName() string {
	return "issues"
}