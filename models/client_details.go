package models

import (
	"time"
)

type ClientDetails struct {
	ID        uint      `gorm:"primaryKey;column:id;autoIncrement" json:"id"`
	Email         string    `gorm:"type:varchar(255);uniqueIndex;not null"`
	Role          string    `gorm:"column:role;type:enum('USER', 'LIBERIAN');default:'USER'"`
	InstitutionName     string    `gorm:"column:institution_name;type:text;not null" json:"institution_name"`
	InstitutionLogo    string    `gorm:"column:institution_logo;type:text;not null" json:"institution_logo"`
	Country    string    `gorm:"column:country;type:text;not null" json:"country"`
	Mobile        string    `gorm:"column:mobile;type:varchar(20);not null"`
	Enabled       bool      `gorm:"type:boolean;default:false;not null"`
	CreatedAt     time.Time `gorm:"column:date;default:current_timestamp();not null" json:"date"`
}

func (ClientDetails) TableName() string {
	return "client_details"
}