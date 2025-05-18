package models


type PublicationYears struct {
	ID        uint     `gorm:"primaryKey;autoIncrement;column:id" json:"id"`
	Year      int64    `gorm:"column:year;type:bigint(200);not null" json:"year"`
	JournalID string   `gorm:"column:journal_id;type:text;not null" json:"journal_id"` // stores "1,5,6"
	Title     *string  `gorm:"column:title;type:text" json:"title,omitempty"`

	Issues []Issue `gorm:"foreignKey:PublicationYearID;references:ID" json:"issues"` 
}


func (PublicationYears) TableName() string {
	return "publication_years"
}

