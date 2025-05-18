package models


type Category struct {
	Index              int       `gorm:"primaryKey;column:#;type:int(20);autoIncrement;not null" json:"index"`
	CategoryID          int64     `gorm:"column:categoryid;type:bigint(200);not null" json:"category_id"`
	SubjectID         int64     `gorm:"column:subjectid;type:bigint(250);not null" json:"subjectid"`
	CategoryName *string `gorm:"column:category_name;type:text" json:"category_name,omitempty"`
}

func (Category) TableName() string {
	return "category"
}