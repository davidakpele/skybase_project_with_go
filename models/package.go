package models

type Package struct {
	Index       uint      `gorm:"primaryKey;autoIncrement"`
	PackageID   int64  `gorm:"column:packageid;type:bigint(200);not null;index" json:"package_id"`
	PackageName string `gorm:"column:package_name;type:varchar(200);not null" json:"package_name"`
}

func (Package) TableName() string {
	return "package"
}
