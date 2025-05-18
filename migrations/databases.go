package migrations

import (
	"log"
	"api-service/models"
	"gorm.io/gorm"
)

// MigrateModels is an exported function to handle database migrations
func MigrateModels(db *gorm.DB) error {
	log.Println("Starting database migration...")
	err := db.AutoMigrate(
		&models.User{}, 
		&models.AccountVerification{},
		&models.Library{},
		&models.Journal{},
		&models.Bookshelves{},
		&models.Category{},
		&models.Issue{},
		&models.Package{},
		&models.Volume{},
		&models.Article{},
		&models.Subjects{},
		&models.LibraryAuthName{},
		&models.LibraryAZTemplate{},
		&models.LibraryNativeLoginInfo{},
		&models.LibraryWebLoginInfo{},
		&models.LibrarySubscription{},
		&models.LibrarySocialMedia{},
		&models.LibraryService{},
		&models.LibrarySupport{},
		&models.LibrarySectionLabel{},
		&models.LibraryLibkeyLabel{},
		&models.LibrarySubject{},
		&models.LibraryJournal{},
		&models.PublicationYears{},
	)
	if err == nil {
		log.Println("Database migrated successfully")
	}
	return err
}