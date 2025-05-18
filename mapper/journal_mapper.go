package mapper

import (
	"api-service/dto"
	"api-service/models"
	"fmt"
	"strings"
)
func MapJournalToResponse(journal *models.Journal) dto.JournalResponse {
	var response dto.JournalResponse

	response.Data.ID = journal.ID
	response.Data.Type = "journals"

	// Map Issues to IssueDTO
	var issues []dto.IssueDTO
	for _, issue := range journal.Issues {
		issues = append(issues, dto.IssueDTO{
			ID:                  issue.ID,
			Title:               issue.Title,
			Volume:              issue.Volume,
			Number:              issue.Number,
			Date:                issue.Date.Format("2006-01-02"),
			IsValidIssue:        issue.IsValidIssue,
			Suppressed:          issue.Suppressed,
			AvailabilityMessage: issue.AvailabilityMessage,
			Embargoed:           issue.Embargoed,
			WithinSubscription:  issue.WithinSubscription,
			JournalID:           issue.JournalID,
			ArticlesLink:        issue.GenerateArticlesLink(journal.LibraryID),
		})
	}

	response.Data.Attributes = dto.JournalAttributes{
		Title:                   journal.JournalName,
		BookshelvesId:           journal.BookshelfID,
		SimplifiedTitle:         strings.ToLower(journal.JournalName),
		ScimagoRank:             2.584,
		CoverURL:                "https://s3.amazonaws.com/thirdiron-assets/images/covers/" + journal.ISSN + ".png",
		HomePageAtPublisherSite: getResourceLink(journal),
		Available:               true,
		ScimagoURL:              "http://www.scimagojr.com/journalsearch.php?q=" + journal.ISSN + "&tip=iss",
		ISSN:                    journal.ISSN,
		BrowzineWebJournalLink:  "https://browzine.com/libraries/603/journals/" + fmt.Sprint(journal.ID),
		CategoryID:              journal.CategoryID,
		Status:                  journal.Status,
		Views:                   journal.Views,
		Pages:                   journal.Pages,
		Likes:                   journal.Likes,
		ResponseID:              getString(journal.ResponseID),
		ExternalReference:       getString(journal.ExternalReference),
		DistributionChannel:     getString(journal.DistributionChannel),
		UserLanguage:            getString(journal.UserLanguage),
		ResourceTitle:           journal.JournalName,
		ResourceDescription:     getString(journal.ResourceDescription),
		ResourceCategory:        getString(journal.ResourceCategory),
		ResourceIdentityGroup:   journal.ResourceIdentityGroup,
		TargetAudience:          getString(journal.TargetAudience),
		ResourceSuppose:         getString(journal.ResourceSuppose),
		ResourceLink:            getResourceLink(journal),
		File:                   "http://localhost:7099/static/"+getString(journal.File),
		FileName:                getString(journal.File),
		LibraryID:               journal.LibraryID,
		Issues:                  issues,
	}
	
	response.Data.Relationships.Library.Links.Related = fmt.Sprintf("/v2/libraries/%d", journal.LibraryID)
	response.Data.Relationships.Issues.Links.Related = fmt.Sprintf("/v2/libraries/%d/journals/%d/issues", journal.LibraryID, journal.ID)

	return response
}


func getResourceLink(journal *models.Journal) string {
	if journal.ResourceLink != nil {
		return *journal.ResourceLink
	}
	return "https://default-journal-link.example.com"
}


func getString(s *string) string {
	if s != nil {
		return *s
	}
	return ""
}
