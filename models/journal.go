package models

import (
	"time"
	"gorm.io/gorm"
)

type Journal struct {
	gorm.Model
	ID          		uint   `gorm:"primaryKey;type:bigint unsigned auto_increment" json:"id"`
	BookshelfID        string    `gorm:"column:bookshelvesid;type:varchar(100);not null" json:"bookshelf_id"`
	CategoryID         string    `gorm:"column:categoryid;type:varchar(100);not null" json:"category_id"`
	JournalName        string    `gorm:"column:journal_name;type:text;not null" json:"journal_name"`
	Status             string    `gorm:"column:status;type:enum('PENDING','IN-REVIEW','REJECTED','APPROVED');default:'PENDING'" json:"status"`
	IPAddress          *string   `gorm:"column:ipaddress;type:text" json:"ip_address,omitempty"`
	Views              int       `gorm:"column:views;type:int(11);not null" json:"views"`
	Pages              int       `gorm:"column:pages;type:int(11);not null" json:"pages"`
	Likes              int       `gorm:"column:likes;type:int(11);not null" json:"likes"`
	ResponseID         *string   `gorm:"column:responseid;type:text" json:"response_id,omitempty"`
	ISSN        	   string 	 `json:"issn"`
	EISSN       	   string 	 `json:"eissn"`
	ExternalReference  *string   `gorm:"column:externalreference;type:text" json:"external_reference,omitempty"`
	LocationLatitude   *string   `gorm:"column:locationlatitude;type:text" json:"location_latitude,omitempty"`
	LocationLongitude  *string   `gorm:"column:locationlongitude;type:text" json:"location_longitude,omitempty"`
	DistributionChannel *string  `gorm:"column:distributionchannel;type:text" json:"distribution_channel,omitempty"`
	UserLanguage       *string   `gorm:"column:userlanguage;type:text" json:"user_language,omitempty"`
	UserID             int       `gorm:"column:user_id;type:int(11);not null" json:"user_id"`
	ResourceTitle      *string   `gorm:"column:resource_title;type:varchar(255)" json:"resource_title,omitempty"`
	ResourceDescription *string  `gorm:"column:resource_description;type:text" json:"resource_description,omitempty"`
	ResourceType       *string   `gorm:"column:resource_type;type:varchar(255)" json:"resource_type,omitempty"`
	ResourceCategory   *string   `gorm:"column:resource_category;type:varchar(255)" json:"resource_category,omitempty"`
	ResourceIdentityGroup string `gorm:"column:resource_identity_group;type:text;not null" json:"resource_identity_group"`
	TargetAudience     *string   `gorm:"column:target_audience;type:varchar(255)" json:"target_audience,omitempty"`
	ResourceSuppose    *string   `gorm:"column:resource_suppose;type:varchar(255)" json:"resource_suppose,omitempty"`
	ResourceLink       *string   `gorm:"column:resource_link;type:text" json:"resource_link,omitempty"`
	File               *string   `gorm:"column:file;type:varchar(255)" json:"file,omitempty"`
	FileName           *string   `gorm:"column:file_name;type:varchar(255)" json:"file_name,omitempty"`
	FileSize           *int      `gorm:"column:file_size;type:int(11)" json:"file_size,omitempty"`
	FileType           *string   `gorm:"column:file_type;type:varchar(255)" json:"file_type,omitempty"`
	CreatedAt          time.Time `gorm:"column:createdAt;autoCreateTime" json:"created_at"`
	UpdatedAt          time.Time `gorm:"column:updatedAt;autoUpdateTime" json:"updated_at"`

	// Relationships
	Issues    []Issue `gorm:"foreignKey:JournalID"`
    LibraryID uint    `gorm:"type:bigint unsigned" json:"-"`
}


func (j *Journal) ToRelationshipData() map[string]interface{} {
	return map[string]interface{}{
		"data": map[string]interface{}{
			"type": "journals",
			"id":   j.ID,
		},
	}
}

func (Journal) TableName() string {
	return "journals"
}
