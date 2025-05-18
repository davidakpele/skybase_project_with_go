package repositories

import (
	"api-service/dto"
	"api-service/mapper"
	"api-service/models"
	"errors"
	"fmt"
	"strconv"
	"strings"

	"gorm.io/gorm"
)

type APIRepository struct {
	db *gorm.DB
}

func NewAPIRepository(db *gorm.DB) *APIRepository {
	return &APIRepository{db: db}
}

// repository function
func (r *APIRepository) GetJournalDetailsByID(journalId int) (interface{}, error) {
	type JournalResult struct {
		BookshelvesID       int    `gorm:"column:bookshelvesid"`
		BookshelvesName     string `gorm:"column:bookshelves_name"`
		JournalID           int    `gorm:"column:journal_id"`
		CategoryID          int    `gorm:"column:categoryid"`
		JournalName         string `gorm:"column:journal_name"`
		RelationalID        int    `gorm:"column:relational_id"`
		IssueDate           string `gorm:"column:issue_date"`
		IssueTitle          string `gorm:"column:issue_title"`
		IssueVolume         string `gorm:"column:issue_volume"`
		VolumeTitle         string `gorm:"column:volume_title"`
		VolumeNumber        string `gorm:"column:volume_number"`
		ArticleAuthor       string `gorm:"column:article_author"`
		APIWebInContextLink string `gorm:"column:apiWebInContextLink"`
		ArticleDate         string `gorm:"column:article_date"`
		OpenAccess          string `gorm:"column:openAccess"`
		ArticleTitle        string `gorm:"column:article_title"`
	}

	var results []JournalResult

	err := r.db.Table("journals j").
		Select("b.bookshelvesid, b.bookshelves_name, j.journalid AS journal_id, j.categoryid, j.bookshelvesid, "+
			"j.journal_name, j.bookshelvesid AS relational_id, i.date AS issue_date, i.title AS issue_title, "+
			"i.volume AS issue_volume, v.title AS volume_title, v.volume_number, a.author AS article_author, "+
			"a.link AS apiWebInContextLink, a.date AS article_date, a.open_access AS openAccess, "+
			"a.title AS article_title").
		Joins("INNER JOIN issues i ON j.journalid = i.journalid").
		Joins("INNER JOIN volumes v ON i.id = v.issue_id").
		Joins("INNER JOIN articles a ON v.volume_id = a.volume_id").
		Joins("INNER JOIN bookshelves b ON b.bookshelvesid = j.bookshelvesid").
		Where("j.journalid = ?", journalId).
		Find(&results).Error

	if err != nil {
		return nil, err
	}

	if len(results) == 0 {
		return []interface{}{}, nil
	}

	// Initialize the response structure
	journal := map[string]interface{}{
		"categorieid":      results[0].CategoryID,
		"bookshelvesid":    results[0].BookshelvesID,
		"journal_name":     results[0].JournalName,
		"related_journals": results[0].BookshelvesName,
		"issues":           make(map[string]interface{}),
	}

	// Process each row
	for _, result := range results {
		// Group by issue date
		issueDate := result.IssueDate
		if _, exists := journal["issues"].(map[string]interface{})[issueDate]; !exists {
			journal["issues"].(map[string]interface{})[issueDate] = map[string]interface{}{
				"volumes": make(map[string]interface{}),
			}
		}

		// Group by volume title within the issue date
		volumeTitle := result.VolumeTitle
		if _, exists := journal["issues"].(map[string]interface{})[issueDate].(map[string]interface{})["volumes"].(map[string]interface{})[volumeTitle]; !exists {
			journal["issues"].(map[string]interface{})[issueDate].(map[string]interface{})["volumes"].(map[string]interface{})[volumeTitle] = map[string]interface{}{
				"title":    result.VolumeTitle,
				"volume":   result.IssueVolume,
				"articles": []interface{}{},
			}
		}

		// Add each article to the corresponding volume
		volume := journal["issues"].(map[string]interface{})[issueDate].(map[string]interface{})["volumes"].(map[string]interface{})[volumeTitle]
		articles := volume.(map[string]interface{})["articles"].([]interface{})

		articles = append(articles, map[string]interface{}{
			"author":              result.ArticleAuthor,
			"apiWebInContextLink": result.APIWebInContextLink,
			"date":                result.ArticleDate,
			"openAccess":          result.OpenAccess == "true",
			"title":               result.ArticleTitle,
		})

		volume.(map[string]interface{})["articles"] = articles
	}

	return journal, nil
}

func (r *APIRepository) GetUserSubscribedSujectsList(packageId int) ([]map[string]interface{}, error) {
	var results []map[string]interface{}

	err := r.db.Table("subject").
		Select("subjectid, package_id, subjects_name").
		Where("package_id = ?", packageId).
		Find(&results).Error

	if err != nil {
		return nil, fmt.Errorf("failed to fetch subscribed subjects: %w", err)
	}

	if len(results) == 0 {
		return nil, nil
	}

	return results, nil
}

func (r *APIRepository) GetUserSearch(searchQuery string, packageID int) (map[string]interface{}, error) {
	result := map[string]interface{}{
		"subjects":    []map[string]interface{}{},
		"journals":    []map[string]interface{}{},
		"bookshelves": []map[string]interface{}{},
		"total":       0,
		"totalPages":  0,
	}

	// ---------- SUBJECTS ----------
	subjects := []map[string]interface{}{}
	var subjectCount int64

	subjectQuery := r.db.Table("subject a").
		Select("a.*, b.packageid").
		Joins("INNER JOIN package b ON b.packageid = a.package_id").
		Where("a.package_id = ? AND (a.subjects_name LIKE ? OR a.subjects_name LIKE ? OR a.subjects_name LIKE ? OR a.subjects_name LIKE ? OR a.subjects_name LIKE ?)",
			packageID,
			"%"+searchQuery+"%",
			"%"+searchQuery,
			searchQuery+"%",
			"_"+searchQuery+"%",
			searchQuery+" _%").
		Group("a.subjects_name")

	if err := subjectQuery.Count(&subjectCount).Error; err != nil {
		return nil, fmt.Errorf("failed to count subjects: %w", err)
	}
	if err := subjectQuery.Order("RAND()").Find(&subjects).Error; err != nil {
		return nil, fmt.Errorf("failed to search subjects: %w", err)
	}
	result["subjects"] = subjects

	// ---------- JOURNALS ----------
	journals := []map[string]interface{}{}
	var journalCount int64

	journalQuery := r.db.Table("journals").
		Where("(journal_name LIKE ? OR journal_name LIKE ? OR journal_name LIKE ? OR journal_name LIKE ? OR journal_name LIKE ?) AND status = 'APPROVED'",
			"%"+searchQuery+"%",
			"%"+searchQuery,
			searchQuery+"%",
			"_"+searchQuery+"%",
			searchQuery+" _%").
		Group("journal_name")

	if err := journalQuery.Count(&journalCount).Error; err != nil {
		return nil, fmt.Errorf("failed to count journals: %w", err)
	}
	if err := journalQuery.Order("RAND()").Find(&journals).Error; err != nil {
		return nil, fmt.Errorf("failed to search journals: %w", err)
	}
	result["journals"] = journals

	// ---------- BOOKSHELVES ----------
	bookshelves := []map[string]interface{}{}
	var bookshelfCount int64

	bookshelfQuery := r.db.Table("bookshelves a").
		Select("a.*, b.subjectid, b.categoryid, c.subjectid, c.package_id, e.packageid").
		Joins("INNER JOIN category b ON a.categoriesid = b.categoryid").
		Joins("INNER JOIN subject c ON c.subjectid = b.subjectid").
		Joins("INNER JOIN package e ON e.packageid = c.package_id").
		Where("a.bookshelves_name LIKE ? OR a.bookshelves_name LIKE ? OR a.bookshelves_name LIKE ? OR a.bookshelves_name LIKE ? OR a.bookshelves_name LIKE ?",
			"%"+searchQuery+"%",
			"%"+searchQuery,
			searchQuery+"%",
			"_"+searchQuery+"%",
			searchQuery+" _%").
		Group("a.bookshelves_name")

	if err := bookshelfQuery.Count(&bookshelfCount).Error; err != nil {
		return nil, fmt.Errorf("failed to count bookshelves: %w", err)
	}
	if err := bookshelfQuery.Order("RAND()").Find(&bookshelves).Error; err != nil {
		return nil, fmt.Errorf("failed to search bookshelves: %w", err)
	}
	result["bookshelves"] = bookshelves

	// ---------- META ----------
	total := subjectCount
	if journalCount > total {
		total = journalCount
	}
	if bookshelfCount > total {
		total = bookshelfCount
	}

	result["total"] = total

	return result, nil
}


func (r APIRepository) GetUserSearchOnSubjectFilter(searchQuery string, packageID int) (interface{}, error) {
	result := map[string]interface{}{
		"subjects":    []map[string]interface{}{},
		"journals":    []map[string]interface{}{},
		"bookshelves": []map[string]interface{}{},
		"total":       0,
	}

	subjects := []map[string]interface{}{}
	var subjectCount int64

	// Search Subjects
	subjectQuery := r.db.Table("subject a").
		Select("a.*, b.packageid").
		Joins("INNER JOIN package b ON b.packageid = a.package_id").
		Where("a.package_id = ? AND (a.subjects_name LIKE ? OR a.subjects_name LIKE ? OR a.subjects_name LIKE ? OR a.subjects_name LIKE ? OR a.subjects_name LIKE ?)",
			packageID,
			"%"+searchQuery+"%",
			"%"+searchQuery,
			searchQuery+"%",
			"_"+searchQuery+"%",
			searchQuery+" _%").
		Group("a.subjects_name")

	if err := subjectQuery.Count(&subjectCount).Error; err != nil {
		return nil, fmt.Errorf("failed to count subjects: %w", err)
	}
	if err := subjectQuery.Order("RAND()").Find(&subjects).Error; err != nil {
		return nil, fmt.Errorf("failed to search subjects: %w", err)
	}
	result["subjects"] = subjects

	bookshelves := []map[string]interface{}{}
	var bookshelfCount int64

	// Search Bookshelves
	bookshelfQuery := r.db.Table("bookshelves a").
		Select("a.*, b.subjectid, b.categoryid, c.subjectid, c.package_id, e.packageid").
		Joins("INNER JOIN category b ON a.categoriesid = b.categoryid").
		Joins("INNER JOIN subject c ON c.subjectid = b.subjectid").
		Joins("INNER JOIN package e ON e.packageid = c.package_id").
		Where("a.bookshelves_name LIKE ? OR a.bookshelves_name LIKE ? OR a.bookshelves_name LIKE ? OR a.bookshelves_name LIKE ? OR a.bookshelves_name LIKE ?",
			"%"+searchQuery+"%",
			"%"+searchQuery,
			searchQuery+"%",
			"_"+searchQuery+"%",
			searchQuery+" _%").
		Group("a.bookshelves_name")

	if err := bookshelfQuery.Count(&bookshelfCount).Error; err != nil {
		return nil, fmt.Errorf("failed to count bookshelves: %w", err)
	}
	if err := bookshelfQuery.Order("RAND()").Find(&bookshelves).Error; err != nil {
		return nil, fmt.Errorf("failed to search bookshelves: %w", err)
	}
	result["bookshelves"] = bookshelves

	var journalCount int64

	// Determine max count for total
	total := subjectCount
	if journalCount > total {
		total = journalCount
	}
	if bookshelfCount > total {
		total = bookshelfCount
	}

	result["total"] = total

	return result, nil
}


func (r APIRepository) GetUserSearchOnJournalFilter(searchQuery string, packageID int) (interface{}, error) {
	result := map[string]interface{}{
		"subjects":    []map[string]interface{}{},
		"journals":    []map[string]interface{}{},
		"bookshelves": []map[string]interface{}{},
		"total":       0,
	}

	var subjectCount int64

	// ---------- JOURNALS ----------
	journals := []map[string]interface{}{}
	var journalCount int64

	journalQuery := r.db.Table("journals").
		Where("(journal_name LIKE ? OR journal_name LIKE ? OR journal_name LIKE ? OR journal_name LIKE ? OR journal_name LIKE ?) AND status = 'APPROVED'",
			"%"+searchQuery+"%",
			"%"+searchQuery,
			searchQuery+"%",
			"_"+searchQuery+"%",
			searchQuery+" _%").
		Group("journal_name")

	if err := journalQuery.Count(&journalCount).Error; err != nil {
		return nil, fmt.Errorf("failed to count journals: %w", err)
	}

	if err := journalQuery.Order("RAND()").Find(&journals).Error; err != nil {
		return nil, fmt.Errorf("failed to search journals: %w", err)
	}
	result["journals"] = journals

	// ---------- BOOKSHELVES ----------
	var bookshelfCount int64

	// Calculate total max count
	total := subjectCount
	if journalCount > total {
		total = journalCount
	}
	if bookshelfCount > total {
		total = bookshelfCount
	}

	result["total"] = total

	return result, nil
}


func (r *APIRepository) GetSubjectListByID(subjectId int) (map[string]interface{}, error) {
	result := make(map[string]interface{})

	// 1. Get subject info - returns empty map if not found
	var subject map[string]interface{}
	err := r.db.Table("subject").
		Where("subjectid = ?", subjectId).
		Take(&subject).Error

	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, fmt.Errorf("failed to fetch subject: %w", err)
	}
	if len(subject) == 0 {
		subject = make(map[string]interface{})
	}
	result["subject"] = subject

	// 2. Get related categories - always returns at least empty slice
	var categories []map[string]interface{}
	err = r.db.Table("category a").
		Select("a.*, b.subjectid").
		Joins("INNER JOIN subject b ON a.subjectid = b.subjectid").
		Where("b.subjectid = ?", subjectId).
		Find(&categories).Error

	if err != nil {
		return nil, fmt.Errorf("failed to fetch categories: %w", err)
	}
	if categories == nil {
		categories = []map[string]interface{}{}
	}
	result["data"] = categories

	return result, nil
}

func (r *APIRepository) GetBookshelvesInfo(catID int, subjectID int) (map[string]interface{}, error) {
	result := make(map[string]interface{})

	// 1. Get category info - returns empty map if not found
	var category map[string]interface{}
	err := r.db.Table("category").
		Where("categoryid = ?", catID).
		Take(&category).Error

	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, fmt.Errorf("failed to fetch category: %w", err)
	}
	if len(category) == 0 {
		category = make(map[string]interface{})
	}
	result["category"] = category

	// 2. Get bookshelves
	var bookshelves []map[string]interface{}
	err = r.db.Table("bookshelves a").
		Select("a.*, b.subjectid, b.categoryid, c.subjectid, c.package_id").
		Joins("INNER JOIN category b ON a.categoriesid = b.categoryid").
		Joins("INNER JOIN subject c ON c.subjectid = b.subjectid").
		Where("b.categoryid = ?", subjectID).
		Find(&bookshelves).Error

	if err != nil {
		return nil, fmt.Errorf("failed to fetch bookshelves: %w", err)
	}
	if bookshelves == nil {
		bookshelves = []map[string]interface{}{}
	}
	result["bookcases"] = bookshelves

	return result, nil
}

func (r *APIRepository) GetJournalsOnBookshelves(packageID int, subjectID int, categoryID int, bookshelvesID int, offset int, itemsPerPage int) (map[string]interface{}, error) {
	result := make(map[string]interface{})
	data := make(map[string]interface{})
	result["data"] = data

	// Execute the main query
	var journalList []map[string]interface{}
	err := r.db.Table("package p").
		Select(`p.packageid, s.subjectid, s.package_id, c.subjectid, 
                c.categoryid, bsh.categoriesid, bsh.bookshelvesid, jn.*`).
		Joins("INNER JOIN subject s ON s.package_id = p.packageid").
		Joins("INNER JOIN category c ON c.subjectid = s.subjectid").
		Joins("INNER JOIN bookshelves bsh ON bsh.categoriesid = c.categoryid").
		Joins("INNER JOIN journals jn ON jn.bookshelvesid = bsh.bookshelvesid").
		Where("jn.bookshelvesid = ? AND bsh.bookshelvesid = ? AND p.packageid = ? AND c.categoryid = ? AND s.subjectid = ?",
			bookshelvesID, bookshelvesID, packageID, categoryID, subjectID).
		Group("jn.journal_name").
		Order("jn.journal_name ASC").
		Offset(offset).
		Limit(itemsPerPage).
		Find(&journalList).Error

	if err != nil {
		return nil, fmt.Errorf("failed to fetch journals: %w", err)
	}

	// Set default empty array if no results
	if journalList == nil {
		journalList = []map[string]interface{}{}
	}

	// Add attributes to each journal
	attributes := map[string]interface{}{
		"title":                              "Translational Neuroscience",
		"simplifiedTitle":                    "translational neuroscience",
		"scimagoRank":                        0.391,
		"homePageAtPublisherSite":            nil,
		"available":                          true,
		"scimagoURL":                         "http://www.scimagojr.com/journalsearch.php?q=2081-3856&tip=iss",
		"aToZListUrl":                        "",
		"externalSearchLocation":             "https://idiscover.lib.cam.ac.uk/primo-explore/search?query=any,exact,2081-3856,OR&query=any,exact,(2081-6936),AND&pfilter=pfilter,exact,journals,AND&tab=cam_lib_coll&search_scope=SCOP_CAM_ALL&sortby=rank&vid=44CAM_PROD&mode=advanced&offset=0",
		"accessedThroughAggregator":          false,
		"externalSearchLinkMessage":          "",
		"articlesInPressAvailabilityMessage": "",
		"embargoDescription":                 "",
		"proxyRequired":                      true,
		"issn":                               "2081-3856",
		"SkybaseWebJournalLink":              "libraries/603/journals/7581/?sort=title",
		"context-Relation": map[string]interface{}{
			"relationships": map[string]interface{}{
				"library": map[string]interface{}{
					"links": map[string]string{
						"related": "/v2/libraries/603",
					},
				},
				"currentIssue": map[string]interface{}{
					"links": map[string]string{
						"related": "/v2/libraries/603/journals/33707/issues/current",
					},
				},
				"latestFullTextIssue": map[string]interface{}{
					"links": map[string]string{
						"related": "/v2/libraries/603/journals/33707/issues/latest-full-text",
					},
				},
				"issues": map[string]interface{}{
					"links": map[string]string{
						"related": "/v2/libraries/603/journals/33707/issues",
					},
				},
				"publicationYears": map[string]interface{}{
					"links": map[string]string{
						"related": "/v2/libraries/603/journals/33707/publication-years",
					},
				},
				"subjects": map[string]interface{}{
					"links": map[string]string{
						"related": "/v2/libraries/603/journals/33707/subjects",
					},
				},
				"bookshelves": map[string]interface{}{
					"links": map[string]string{
						"related": "/v2/libraries/603/journals/33707/bookshelves",
					},
				},
				"articlesInPress": map[string]interface{}{
					"links": map[string]string{
						"related": "/v2/libraries/603/journals/33707/articles-in-press",
					},
				},
			},
		},
	}

	const baseURL = "http://localhost:7099/static/"

    for i := range journalList {
        // Prefix file path if it exists and is a string
        if filePath, ok := journalList[i]["file"].(string); ok && filePath != "" {
            journalList[i]["file"] = baseURL + filePath
        }

        journalList[i]["attributes"] = attributes
    }

	data["journalList"] = journalList

	// Get row count (implementation depends on your DB driver)
	var count int64
	err = r.db.Table("journals jn").
		Joins("INNER JOIN bookshelves bsh ON bsh.bookshelvesid = jn.bookshelvesid").
		Joins("INNER JOIN category c ON c.categoryid = bsh.categoriesid").
		Joins("INNER JOIN subject s ON s.subjectid = c.subjectid").
		Joins("INNER JOIN package p ON p.packageid = s.package_id").
		Where("jn.bookshelvesid = ? AND bsh.bookshelvesid = ? AND p.packageid = ? AND c.categoryid = ? AND s.subjectid = ?",
			bookshelvesID, bookshelvesID, packageID, categoryID, subjectID).
		Group("jn.journal_name").
		Count(&count).Error

	if err != nil {
		return nil, fmt.Errorf("failed to count journals: %w", err)
	}

	result["rowCount"] = count
	result["meta"] = map[string]interface{}{
		"cursor": []interface{}{},
	}

	return result, nil
}

func (r *APIRepository) GetJournalsOnCategory(packageID int, subjectID int, offset int, itemsPerPage int) (map[string]interface{}, error) {
    result := make(map[string]interface{})
    data := make(map[string]interface{})
    result["data"] = data

    // Execute the main query
    var journalList []map[string]interface{}
    err := r.db.Table("package p").
        Select("p.packageid, s.subjectid, s.package_id, c.subjectid, c.categoryid, jn.*").
        Joins("INNER JOIN subject s ON s.package_id = p.packageid").
        Joins("INNER JOIN category c ON c.subjectid = s.subjectid").
        Joins("INNER JOIN journals jn ON jn.categoryid = c.categoryid").
        Where("p.packageid = ? AND s.subjectid = ?", packageID, subjectID).
        Group("jn.journal_name").
        Order("jn.journal_name ASC").
        Offset(offset).
        Limit(itemsPerPage).
        Find(&journalList).Error

    if err != nil {
        return nil, fmt.Errorf("failed to fetch journals: %w", err)
    }

    // Set default empty array if no results
    if journalList == nil {
        journalList = []map[string]interface{}{}
    }
    
    const baseURL = "http://localhost:7099/static/"
    attributes := map[string]interface{}{
        "read":    true,
        "bookmark": false,
    }

    for i := range journalList {
        if imgPath, ok := journalList[i]["file"].(string); ok && imgPath != "" {
            journalList[i]["file"] = baseURL + imgPath
        }
        journalList[i]["attributes"] = attributes
    }
    data["journalList"] = journalList

    // Get total count
    var count int64
    err = r.db.Table("package p").
        Joins("INNER JOIN subject s ON s.package_id = p.packageid").
        Joins("INNER JOIN category c ON c.subjectid = s.subjectid").
        Joins("INNER JOIN journals jn ON jn.categoryid = c.categoryid").
        Where("p.packageid = ? AND s.subjectid = ?", packageID, subjectID).
        Group("jn.journal_name").
        Count(&count).Error

    if err != nil {
        return nil, fmt.Errorf("failed to count journals: %w", err)
    }

    result["rowCount"] = count
    
    // Calculate itemsTotal 
    itemsTotal := 50
    if offset != 0 {
        itemsTotal = offset + 50
    }
    result["itemsTotal"] = itemsTotal

    return result, nil
}

func (r *APIRepository) GetJournalsOnBookcase(packageID int, subjectID int, categoryID int, offset int, itemsPerPage int) (map[string]interface{}, error) {
    result := make(map[string]interface{})
    data := make(map[string]interface{})
    result["data"] = data

    // Execute the main query
    var journalList []map[string]interface{}
    err := r.db.Table("package p").
        Select("p.packageid, s.subjectid, s.package_id, c.subjectid, c.categoryid, jn.*").
        Joins("INNER JOIN subject s ON s.package_id = p.packageid").
        Joins("INNER JOIN category c ON c.subjectid = s.subjectid").
        Joins("INNER JOIN journals jn ON jn.categoryid = c.categoryid").
        Where("p.packageid = ? AND c.categoryid = ? AND s.subjectid = ?", 
            packageID, categoryID, subjectID).
        Group("jn.journal_name").
        Order("jn.journal_name ASC").
        Offset(offset).
        Limit(itemsPerPage).
        Find(&journalList).Error

    if err != nil {
        return nil, fmt.Errorf("failed to fetch journals: %w", err)
    }

    // Set default empty array if no results
    if journalList == nil {
        journalList = []map[string]interface{}{}
    }
    const baseURL = "http://localhost:7099/static/"
    attributes := map[string]interface{}{
        "read":    true,
        "bookmark": false,
    }

    for i := range journalList {
        if imgPath, ok := journalList[i]["file"].(string); ok && imgPath != "" {
            journalList[i]["file"] = baseURL + imgPath
        }
        journalList[i]["attributes"] = attributes
    }
    data["journalList"] = journalList

    // Get total count
    var count int64
    err = r.db.Table("package p").
        Joins("INNER JOIN subject s ON s.package_id = p.packageid").
        Joins("INNER JOIN category c ON c.subjectid = s.subjectid").
        Joins("INNER JOIN journals jn ON jn.categoryid = c.categoryid").
        Where("p.packageid = ? AND c.categoryid = ? AND s.subjectid = ?", 
            packageID, categoryID, subjectID).
        Group("jn.journal_name").
        Count(&count).Error

    if err != nil {
        return nil, fmt.Errorf("failed to count journals: %w", err)
    }

    result["rowCount"] = count

    return result, nil
}

func (r *APIRepository) SelectBookshelves() ([]map[string]interface{}, error) {
    var bookshelves []map[string]interface{}

    err := r.db.Table("bookshelves").
        Find(&bookshelves).Error

    if err != nil {
        return nil, fmt.Errorf("failed to fetch bookshelves: %w", err)
    }
    if bookshelves == nil {
        bookshelves = []map[string]interface{}{}
    }

    return bookshelves, nil
}

func (r *APIRepository) GetIssueYears(journalID int) ([]map[string]interface{}, error) {
    var issueYears []map[string]interface{}

    err := r.db.Table("issues").
        Where("journalid = ?", journalID).
        Find(&issueYears).Error

    if err != nil {
        return nil, fmt.Errorf("failed to fetch issue years: %w", err)
    }
    if issueYears == nil {
        issueYears = []map[string]interface{}{}
    }

    return issueYears, nil
}

func (r *APIRepository) GetJournal(journalId int) (*dto.JournalResponse, error) {
    var journal models.Journal

    // Preload Issues to eagerly load them with the Journal
    if err := r.db.Preload("Issues").First(&journal, journalId).Error; err != nil {
        return nil, errors.New("journal not found")
    }

    // Map the journal to the response
    response := mapper.MapJournalToResponse(&journal)
    return &response, nil
}

func (r *APIRepository) GetJournalsGroupedByStatus() (map[string]interface{}, error) {
    result := make(map[string]interface{})
    statuses := []string{"APPROVED", "PENDING", "IN-REVIEW", "REJECTED"}

    // 1. Get total count of all journals
    var totalCount int64
    if err := r.db.Table("journals").Count(&totalCount).Error; err != nil {
        return nil, fmt.Errorf("failed to count total journals: %w", err)
    }
    result["total_items"] = totalCount

    // 2. Get counts and journals for each status
    for _, status := range statuses {
        // Get count for this status
        var count int64
        if err := r.db.Table("journals").
            Where("status = ?", status).
            Count(&count).Error; err != nil {
            return nil, fmt.Errorf("failed to count %s journals: %w", status, err)
        }

        // Get journals for this status (limit to 50 per status for performance)
        var journals []map[string]interface{}
        if err := r.db.Table("journals").
            Where("status = ?", status).
            Limit(50).
            Find(&journals).Error; err != nil {
            return nil, fmt.Errorf("failed to fetch %s journals: %w", status, err)
        }

        result[status] = map[string]interface{}{
            "count":    count,
            "journals": journals,
        }
    }

    // 3. Get trending journals (top 10 most viewed)
    var trendingJournals []map[string]interface{}
    if err := r.db.Table("journals").
        Order("views DESC").
        Limit(10).
        Find(&trendingJournals).Error; err != nil {
        return nil, fmt.Errorf("failed to fetch trending journals: %w", err)
    }

    result["TopViews"] = map[string]interface{}{
        "count":    len(trendingJournals),
        "journals": trendingJournals,
    }

    return result, nil
}

// Home page api
func (r *APIRepository) GetUserSubscribedSubjects(packageID int) ([]map[string]interface{}, error) {
    var subjects []map[string]interface{}

    err := r.db.Table("subject").
        Select("subjectid, package_id, subjects_name").
        Where("package_id = ?", packageID).
        Find(&subjects).Error

    if err != nil {
        if errors.Is(err, gorm.ErrRecordNotFound) {
            return []map[string]interface{}{}, nil
        }
        return nil, fmt.Errorf("failed to fetch subscribed subjects: %w", err)
    }

    // Ensure we always return at least an empty slice
    if subjects == nil {
        subjects = []map[string]interface{}{}
    }

    return subjects, nil
}

func (r *APIRepository) GetPublicationYearByJournalId(journalIds []int) ([]map[string]interface{}, error) {
	// Explicitly initialize as empty slice (not nil)
	results := make([]map[string]interface{}, 0)

	if len(journalIds) == 0 {
		return results, nil
	}

	err := r.db.Raw(`
		SELECT * FROM publication_years
		WHERE ` + buildFindInSetConditions("journal_id", journalIds) + `
	`).Scan(&results).Error

	if err != nil {
		return nil, err
	}

	// Optional filtering logic
	for _, row := range results {
		if val, ok := row["journal_id"].(string); ok {
			ids := strings.Split(val, ",")
			for _, journalId := range journalIds {
				if containsID(ids, strconv.Itoa(journalId)) {
					row["journal_id"] = strconv.Itoa(journalId)
					break
				}
			}
		}
	}

	return results, nil
}


func (r *APIRepository) GetIssueByJournalId(journalId int, libraryID int) ([]map[string]interface{}, error) {
	var issues []models.Issue
	var result []map[string]interface{}

	journalIDUint := uint(journalId)
	libraryIDUint := uint(libraryID)

	// Fetch issues with matching journal_id
	err := r.db.Where("journal_id = ?", journalIDUint).Find(&issues).Error
	if err != nil {
		return nil, fmt.Errorf("failed to fetch issues: %w", err)
	}

	// If no issues found, return empty array
	if len(issues) == 0 {
		return []map[string]interface{}{}, nil
	}

	// Convert each issue to API format
	for _, issue := range issues {
		result = append(result, issue.ToAPIFormat(libraryIDUint))
	}

	return result, nil
}



func (r *APIRepository) GetArticlesByIssueAndJournal(journalId uint, issueId uint) ([]map[string]interface{}, error) {
	var articles []models.Article
    result := make([]map[string]interface{}, 0)
    
	err := r.db.Where("issue_id = ? AND journal_id = ?", issueId, journalId).Find(&articles).Error
	if err != nil {
		return nil, err
	}

	for _, article := range articles {
		result = append(result, article.ToAPIFormat())
	}

	return result, nil
}

func buildFindInSetConditions(column string, ids []int) string {
	conditions := make([]string, len(ids))
	for i, id := range ids {
		conditions[i] = fmt.Sprintf("FIND_IN_SET(%d, %s)", id, column)
	}
	return strings.Join(conditions, " OR ")
}

func containsID(idList []string, target string) bool {
	for _, id := range idList {
		if strings.TrimSpace(id) == target {
			return true
		}
	}
	return false
}


