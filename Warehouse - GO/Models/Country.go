package models

type Country struct {
	BaseModel
	Name string `gorm:"unique;not null" json:"name"`
}
