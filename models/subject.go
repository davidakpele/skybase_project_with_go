package models

import "gorm.io/gorm"

type Subjects struct {
    gorm.Model
    SubjectID     uint8  `gorm:"column:subjectid;type:bigint(200);not null;index" json:"subjectid"`
    PackageID     int64  `gorm:"column:package_id;type:bigint(200);not null" json:"package_id"`
    SubjectsName  string `gorm:"column:subjects_name;type:text;not null" json:"subjects_name"`
}

func (Subjects) TableName() string {
	return "subject"
}
