package models

type Warehouse struct {
	BaseModel
	Name      string  `gorm:"unique;not null" json:"name"`
	Address   string  `gorm:"not null" json:"address"`
	City      string  `gorm:"not null" json:"city"`
	CountryID int     `gorm:"not null" json:"countryId"`
	Country   Country `gorm:"foreignKey:CountryID" json:"country"`
	Items     []Item  `gorm:"foreignKey:WarehouseID" json:"items"`
}
