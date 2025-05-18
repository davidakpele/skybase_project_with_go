package controllers

import (
	"api-service/services"
	"net/http"
	"strconv"
	"strings"
	"github.com/gin-gonic/gin"
)

type APIController struct {
	APIService services.APIService
}

func NewAPIController(APIService services.APIService) *APIController {
	return &APIController{APIService: APIService}
}

func (ctrl *APIController) Collect(c *gin.Context) {
	if c.Request.Method != http.MethodGet {
		c.JSON(http.StatusMethodNotAllowed, gin.H{
			"status":  "error",
			"message": "Method not allowed",
		})
		return
	}

	action := c.Query("action")

	switch action {
	case "get_journal_year_list":
		ctrl.handleGetJournalYearList(c)
	case "package_items":
		ctrl.handleUserSubscribedSuject(c)
	case "search":
		ctrl.handleUserSearch(c)
	case "getCategoryListOnparent":
		ctrl.handleUserCategoryList(c)
	case "getCategoryListOnparentChild":
		ctrl.handleUserCategoryOnParentChildrenList(c)
	case "dataContext":
		ctrl.handleUseBookshalvesJournalsList(c)
	case "category_journal_list_all":
		ctrl.handleUseCategoryJournalsList(c)
	case "bookcase_journal_list_all":
		ctrl.handleUseBookCaseJournalsList(c)
	case "journal":
		ctrl.handleFetchJournalById(c)
	case "issue_year":
		ctrl.handleFetchIssueYearByJournalId(c)
	case "publicationYear":
		ctrl.HandleFetchAllJournalPublicationYear(c)
	case "issue":
		ctrl.HandleFetchAllIssueByJournalId(c)
	case "articles":
		ctrl.HandleFetchAllArticlesByJournalIdAndIssueId(c)
	default:
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "error",
			"message": "Invalid action or missing parameters",
		})
	}
}

func (ctrl *APIController) handleUserCategoryList(c *gin.Context) {
	sid := c.Query("subject")

	if sid == "" {
		c.JSON(http.StatusUnauthorized, gin.H{
			"status":  "error",
			"message": "Subject ID parameter is require.*",
		})
		return
	}

	subjectId, err := strconv.Atoi(sid)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "error",
			"message": "Invalid Subject ID format",
		})
		return
	}

	data, err := ctrl.APIService.GetSubjectListByID(subjectId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status":  "error",
			"message": "Failed to fetch subject list",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": data,
	})
}

func (ctrl *APIController) handleGetJournalYearList(c *gin.Context) {
	query := c.Query("query")
	journalIdStr := c.Query("journalId")

	if query != "publish_year_list" || journalIdStr == "" {
		c.JSON(http.StatusUnauthorized, gin.H{
			"status":  "error",
			"message": "Missing parameters or invalid data for publish year.",
		})
		return
	}

	journalId, err := strconv.Atoi(journalIdStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "error",
			"message": "Invalid journal ID format",
		})
		return
	}

	data, err := ctrl.APIService.GetJournalDetailsByID(journalId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status":  "error",
			"message": "Failed to fetch journal details",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": data,
	})
}

func (ctrl *APIController) handleUserSubscribedSuject(c *gin.Context) {
	packageId := c.Query("packageId")

	if packageId == "" {
		c.JSON(http.StatusUnauthorized, gin.H{
			"status":  "error",
			"inc":     false,
			"data":    "Package ID missing",
			"message": "Missing parameters or invalid data for package id",
		})
		return
	}

	id, err := strconv.Atoi(packageId)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "error",
			"message": "Invalid Package ID format",
		})
		return
	}

	data, err := ctrl.APIService.GetUserSubscribedSujectsList(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status":  "error",
			"message": "Failed to fetch journal details",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"_items": data,
	})
}

func (ctrl *APIController) handleUserSearch(c *gin.Context) {
	action := c.Query("action")
	if action == "" {
		c.JSON(http.StatusUnauthorized, gin.H{
			"status":  "error",
			"message": "Object to this endpoint is `search`",
		})
		return
	}
	user_search := c.Query("query")
	packageIdStr := c.Query("packageId")

	if user_search == "" {
		c.JSON(http.StatusUnauthorized, gin.H{
			"status":  "error",
			"data":    "Search Input Empty",
			"message": "Enter anything you want to search.",
		})
		return
	}

	if packageIdStr == "" {
		c.JSON(http.StatusUnauthorized, gin.H{
			"status":  "error",
			"data":    "Package ID missing",
			"message": "Missing parameters or invalid data for package id",
		})
		return
	}
	filter_action := c.Query("filter")

	packageId, err := strconv.Atoi(packageIdStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "error",
			"message": "Invalid Package ID format",
		})
		return
	}


	if action != "" && user_search != "" && packageIdStr != "" && filter_action == "" {
		// call search Data
		data, err := ctrl.APIService.GetUserSearch(user_search, packageId)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"status":  "error",
				"message": "Failed to fetch journal details",
			})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"data": data,
			"type": "all",
		})
	} else if action != "" && user_search != "" && packageIdStr != "" && filter_action != "" && filter_action == "subjectsOnly" {
		// call filter function
		data, err := ctrl.APIService.GetUserSearchForSubjectOnlyResultFilter(user_search, packageId)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"status":  "error",
				"message": "Failed to fetch subject details",
			})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"data": data,
			"type": "subjects_only",
		})
	} else if action != "" && user_search != "" && packageIdStr != "" && filter_action != "" && filter_action == "journalsOnly" {
		// call filter function
		data, err := ctrl.APIService.GetUserSearchForJournalOnlyResultFilter(user_search, packageId)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"status":  "error",
				"message": "Failed to fetch journal details",
			})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"data": data,
			"type": "journals_only",
		})
	}

}

func (ctrl *APIController) handleUserCategoryOnParentChildrenList(c *gin.Context) {
	bid := c.Query("bookcases")
	cid := c.Query("bookcases")

	if bid == "" || cid == "" {
		c.JSON(http.StatusUnauthorized, gin.H{
			"status":  "error",
			"message": "Missing parameters or invalid data for bookcases id",
		})
		return
	}

	bookcasesId, err := strconv.Atoi(bid)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "error",
			"message": "Invalid Bookcases ID format",
		})
		return
	}

	categoryid, err := strconv.Atoi(cid)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "error",
			"message": "Invalid Bookcases ID format",
		})
		return
	}

	data, err := ctrl.APIService.GetUserBookcasseListByIdAndCategoryId(bookcasesId, categoryid)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status":  "error",
			"message": "Failed to fetch journal details",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": data,
	})
}

func (ctrl *APIController) handleUseBookshalvesJournalsList(c *gin.Context) {
	// Check all required query parameters
	bookcases := c.Query("bookcases")
	bookshelves := c.Query("bookshelves")

	if bookcases == "" || bookshelves == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "error",
			"message": "Invalid or missing parameters",
		})
		return
	}

	// Get pagination parameters
	pageStr := c.DefaultQuery("page", "1")
	page, err := strconv.Atoi(pageStr)
	if err != nil || page < 1 {
		page = 1
	}

	itemsPerPage := 50
	offset := (page - 1) * itemsPerPage

	// Get library and subject IDs
	libraryStr := c.Query("library")
	subjectStr := c.Query("subject")

	library, err := strconv.Atoi(strings.TrimSpace(libraryStr))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "error",
			"message": "Invalid library ID format",
		})
		return
	}

	subject, err := strconv.Atoi(strings.TrimSpace(subjectStr))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "error",
			"message": "Invalid subject ID format",
		})
		return
	}

	// Get bookshelves and category IDs
	bookshelvesID, err := strconv.Atoi(bookshelves)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "error",
			"message": "Invalid bookshelves ID format",
		})
		return
	}

	categoryID, err := strconv.Atoi(bookcases)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "error",
			"message": "Invalid bookcases ID format",
		})
		return
	}

	// Call service with all parameters
	journals, err := ctrl.APIService.GetJournalsOnBookshelves(
		library,
		subject,
		categoryID,
		bookshelvesID,
		offset,
		itemsPerPage,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status":  "error",
			"message": "Failed to fetch journals",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"_items": journals,
	})
}

func (ctrl *APIController) handleUseCategoryJournalsList(c *gin.Context) {
	// Check all required query parameters
	libraryStr := c.Query("library")
	subjectStr := c.Query("subject")

	if subjectStr == "" || libraryStr == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "error",
			"message": "Invalid or missing parameters",
		})
		return
	}

	// Get pagination parameters
	pageStr := c.DefaultQuery("page", "1")
	page, err := strconv.Atoi(pageStr)
	if err != nil || page < 1 {
		page = 1
	}

	itemsPerPage := 50
	offset := (page - 1) * itemsPerPage

	library, err := strconv.Atoi(strings.TrimSpace(libraryStr))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "error",
			"message": "Invalid library ID format",
		})
		return
	}

	subject, err := strconv.Atoi(strings.TrimSpace(subjectStr))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "error",
			"message": "Invalid subject ID format",
		})
		return
	}

	// Call service with all parameters
	journals, err := ctrl.APIService.GetJournalsOnCategory(
		library,
		subject,
		offset,
		itemsPerPage,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status":  "error",
			"message": "Failed to fetch journals",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"_items": journals,
	})
}

func (ctrl *APIController) handleUseBookCaseJournalsList(c *gin.Context) {
	// Check all required query parameters
	libraryStr := c.Query("library")
	subjectStr := c.Query("subject")
	bookcasesStr := c.Query("bookcases")

	if subjectStr == "" || libraryStr == "" || bookcasesStr == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "error",
			"message": "Invalid or missing parameters",
		})
		return
	}

	// Get pagination parameters
	pageStr := c.DefaultQuery("page", "1")
	page, err := strconv.Atoi(pageStr)
	if err != nil || page < 1 {
		page = 1
	}

	itemsPerPage := 50
	offset := (page - 1) * itemsPerPage

	library, err := strconv.Atoi(strings.TrimSpace(libraryStr))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "error",
			"message": "Invalid library ID format",
		})
		return
	}

	subject, err := strconv.Atoi(strings.TrimSpace(subjectStr))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "error",
			"message": "Invalid subject ID format",
		})
		return
	}

	bookcases, err := strconv.Atoi(strings.TrimSpace(bookcasesStr))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "error",
			"message": "Invalid Bookcases ID format",
		})
		return
	}

	// Call service with all parameters
	journals, err := ctrl.APIService.GetJournalsOnBookcase(
		library,
		subject,
		bookcases,
		offset,
		itemsPerPage,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status":  "error",
			"message": "Failed to fetch journals",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"_items": journals,
	})
}

func (ctrl *APIController) handleFetchIssueYearByJournalId(c *gin.Context) {
	journalID := c.Query("id")

	if journalID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{
			"status":  "error",
			"message": "Missing parameters or invalid data for Journal ID",
		})
		return
	}

	id, err := strconv.Atoi(journalID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "error",
			"message": "Invalid Package ID format",
		})
		return
	}

	data, err := ctrl.APIService.GetIssueYearsByJournalID(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status":  "error",
			"message": "Failed to fetch Issued Year data",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": data,
	})
}

func (ctrl *APIController) handleFetchJournalById(c *gin.Context) {
	journalID := c.Query("id")

	if journalID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{
			"status":  "error",
			"message": "Missing parameters or invalid data for Journal ID",
		})
		return
	}

	id, err := strconv.Atoi(journalID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "error",
			"message": "Invalid Package ID format",
		})
		return
	}

	data, err := ctrl.APIService.GetJournalID(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status":  "error",
			"message": "Failed to fetch Journal data",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": data,
	})
}

func (ctrl *APIController) HandleFetchAllJournalForByAdmin(c *gin.Context) {
	data, err := ctrl.APIService.GetJournalsGroupedByStatus()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status":  "error",
			"message": "Failed to fetch Journal data",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": data,
	})
}

func (ctrl *APIController) HandleFetchAllJournalPublicationYear(c *gin.Context) {
	journalIDsQuery := c.Query("id") // e.g., "1,5,6"

	if journalIDsQuery == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "error",
			"message": "Missing 'id' query parameter",
		})
		return
	}

	// Split and convert to []int
	strIDs := strings.Split(journalIDsQuery, ",")
	var journalIDs []int
	for _, strID := range strIDs {
		id, err := strconv.Atoi(strings.TrimSpace(strID))
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"status":  "error",
				"message": "Invalid journal ID in query",
			})
			return
		}
		journalIDs = append(journalIDs, id)
	}

	// Call service method with []int
	data, err := ctrl.APIService.FetchAllPublicationYearByJournalId(journalIDs)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status":  "error",
			"message": "Failed to fetch Journal data",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data":   data,
	})
}

func (ctrl *APIController) HandleFetchAllIssueByJournalId(c *gin.Context) {
	journalID := c.Query("journalId")
	packageId:= c.Query("packageId")
	if journalID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{
			"status":  "error",
			"message": "Missing parameters or invalid data for Journal ID",
		})
		return
	}

	if packageId == "" {
		c.JSON(http.StatusUnauthorized, gin.H{
			"status":  "error",
			"message": "Missing parameters or invalid data for Package ID",
		})
		return
	}

	journal_Id, err := strconv.Atoi(journalID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "error",
			"message": "Invalid Journal ID format",
		})
		return
	}

	package_Id, err := strconv.Atoi(packageId)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "error",
			"message": "Invalid Package ID format",
		})
		return
	}

	data, err := ctrl.APIService.GetIssueByJournalID(journal_Id, package_Id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status":  "error",
			"message": "Failed to fetch Journal data",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": data,
	})
}

func (ctrl *APIController) HandleFetchAllArticlesByJournalIdAndIssueId(c *gin.Context) {
	journalID := c.Query("journalid")
	issueId:= c.Query("issueid")
	if journalID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{
			"status":  "error",
			"message": "Missing parameters or invalid data for Journal ID",
		})
		return
	}

	if issueId == "" {
		c.JSON(http.StatusUnauthorized, gin.H{
			"status":  "error",
			"message": "Missing parameters or invalid data for Issue ID",
		})
		return
	}

	journal_Id, err := strconv.Atoi(journalID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "error",
			"message": "Invalid Journal ID format",
		})
		return
	}

	issue_Id, err := strconv.Atoi(issueId)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "error",
			"message": "Invalid Issue ID format",
		})
		return
	}

	data, err := ctrl.APIService.GetArticlesByJournalID(journal_Id, issue_Id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status":  "error",
			"message": "Failed to fetch Journal data",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": data,
	})
}