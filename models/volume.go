package models

import (
	"time"
)

type Volume struct {
	ID           uint      `gorm:"primaryKey;column:id;autoIncrement" json:"id"`
	VolumeID     int       `gorm:"column:volume_id;not null" json:"volume_id"`
	IssueID      int       `gorm:"column:issue_id;not null" json:"issue_id"`
	Title        string    `gorm:"column:title;type:text;not null" json:"title"`
	VolumeNumber string    `gorm:"column:volume_number;type:varchar(100);not null" json:"volume_number"`
	CreatedAt    time.Time `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt    time.Time `gorm:"autoUpdateTime" json:"updated_at"`
}

func (Volume) TableName() string {
	return "volumes"
}