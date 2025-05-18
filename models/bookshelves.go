package models

type Bookshelves struct {
	Bookshelvesid uint    `gorm:"primaryKey;column:bookshelvesid;autoIncrement" json:"bookshelves_id"`
	CategoryID    int64   `gorm:"column:categoriesid;type:bigint(250);not null" json:"category_id"`
	BookshelfName *string `gorm:"column:bookshelves_name;type:text" json:"bookshelf_name,omitempty"`
}


func (Bookshelves) TableName() string {
	return "bookshelves"
}
