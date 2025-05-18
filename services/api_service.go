package services

import (
	"api-service/repositories"
)

type APIService struct {
	apiRepo repositories.APIRepository
}

func NewAPIService(apiRepo repositories.APIRepository) *APIService {
	return &APIService{apiRepo: apiRepo}
}

func (s *APIService) GetJournalDetailsByID(journalId int) (interface{}, error) {
	return s.apiRepo.GetJournalDetailsByID(journalId)
}

func (s *APIService) GetUserSubscribedSujectsList(packageId int) (interface{}, error) {
	return s.apiRepo.GetUserSubscribedSujectsList(packageId)
}

func (s APIService) GetUserSearch(user_search string, packageId int) (interface{}, error) {
	return s.apiRepo.GetUserSearch(user_search, packageId)
}

func (s APIService) GetUserSearchForSubjectOnlyResultFilter(user_search string, packageId int) (interface{}, error) {
	return s.apiRepo.GetUserSearchOnSubjectFilter(user_search, packageId)
}

func (s APIService) GetUserSearchForJournalOnlyResultFilter(user_search string, packageId int) (interface{}, error) {
	return s.apiRepo.GetUserSearchOnJournalFilter(user_search, packageId)
}

func (s APIService) GetSubjectListByID(subjectId int) (any, error) {
	return s.apiRepo.GetSubjectListByID(subjectId)
}

func (s APIService) GetUserBookcasseListByIdAndCategoryId(bookcasesId int, categoryid int) (any, error) {
	return s.apiRepo.GetBookshelvesInfo(categoryid, bookcasesId)
}

func (s APIService) GetJournalsOnBookshelves(library int, subject int, categoryID int, bookshelvesID int, offset int, itemsPerPage int) (interface{}, error) {
	return s.apiRepo.GetJournalsOnBookshelves(library, subject, categoryID, bookshelvesID, offset, itemsPerPage)
}

func (s APIService) GetJournalsOnCategory(library int, subject int, offset int, itemsPerPage int) (any, error) {
	return s.apiRepo.GetJournalsOnCategory(library, subject, offset, itemsPerPage)
}

func (s APIService) GetJournalsOnBookcase(library int, subject int, bookcases int, offset int, itemsPerPage int) (any, error) {
	return s.apiRepo.GetJournalsOnBookcase(library, subject, bookcases, offset, itemsPerPage)
}

func (s APIService) GetIssueYearsByJournalID(journalId int) (any, error) {
	return s.apiRepo.GetIssueYears(journalId)
}

func (s APIService) GetJournalID(journalId int) (any, error) {
	return s.apiRepo.GetJournal(journalId)
}

func (s APIService) GetJournalsGroupedByStatus() (any, error) {
	return s.apiRepo.GetJournalsGroupedByStatus()
}

func (s APIService) FetchAllPublicationYearByJournalId(journalIDs []int) (any, any) {
	return s.apiRepo.GetPublicationYearByJournalId(journalIDs)
}

func (s APIService) GetIssueByJournalID(journalId int, packageId int) (any, error) {
	return s.apiRepo.GetIssueByJournalId(journalId, packageId)
}

func (s APIService) GetArticlesByJournalID(journal_Id int, issue_Id int) (any, error) {
	journalIDUint := uint(journal_Id)
	issueUint := uint(issue_Id)
	return s.apiRepo.GetArticlesByIssueAndJournal(journalIDUint, issueUint)
}