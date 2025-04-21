package models

type Item struct {
	BaseModel
	Name        string    `gorm:"unique;not null" json:"name"`
	SKUCode     string    `json:"skuName"`
	Quantity    int       `gorm:"not null" json:"quantity"`
	CostPrice   float32   `gorm:"not null" json:"costPrice"`
	MSRPPrice   float32   `json:"msrpPrice"`
	WarehouseID int       `gorm:"not null" json:"warehouseId"`
	Warehouse   Warehouse `gorm:"foreignKey:WarehouseID;references:ID" json:"warehouse"`
}
