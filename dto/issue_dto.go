package dto

type IssueDTO struct {
	ID                   uint   `json:"id"`
	Title                string `json:"title"`
	Volume               string `json:"volume"`
	Number               string `json:"number"`
	Date                 string `json:"date"`
	IsValidIssue         bool   `json:"isValidIssue"`
	Suppressed           bool   `json:"suppressed"`
	AvailabilityMessage  string `json:"availabilityMessage"`
	Embargoed            bool   `json:"embargoed"`
	WithinSubscription   bool   `json:"withinSubscription"`
	JournalID            uint   `json:"journal"`
	ArticlesLink         string `json:"articlesLink"`
}
