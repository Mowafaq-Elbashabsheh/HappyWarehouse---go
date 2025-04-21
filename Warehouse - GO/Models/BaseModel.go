package models

import (
	"time"
)

type BaseModel struct {
	ID        int       `gorm:"primaryKey" json:"id"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}
