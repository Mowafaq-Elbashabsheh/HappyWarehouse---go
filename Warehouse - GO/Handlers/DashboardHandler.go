package handlers

import (
	"encoding/json"
	"net/http"

	models "github.com/mowafaq-elbashabsheh/gowarehouse/Models"
	"github.com/mowafaq-elbashabsheh/gowarehouse/config"
)

type ItemsQuantity struct {
	Name     string `json:"name"`
	Quantity int    `json:"quantity"`
}

type TopItems struct {
	MaxItems []ItemsQuantity `json:"maxItems"`
	MinItems []ItemsQuantity `json:"minItems"`
}

type WarehouseStatus struct {
	WarehouseName string `json:"warehouseName"`
	ItemsCount    int    `json:"itemsCount"`
}

func GetTopItemsHandler(w http.ResponseWriter, r *http.Request) {
	var maxItems []ItemsQuantity
	var minItems []ItemsQuantity
	var topItems TopItems

	if err := config.DB.Model(&models.Item{}).Select("name, quantity").Order("quantity DESC").Limit(10).Find(&maxItems).Error; err != nil {
		http.Error(w, "Somthin went wrong: "+err.Error(), http.StatusInternalServerError)
		return
	}

	if err := config.DB.Model(&models.Item{}).Select("name, quantity").Order("quantity").Limit(10).Find(&minItems).Error; err != nil {
		http.Error(w, "Somthin went wrong: "+err.Error(), http.StatusInternalServerError)
		return
	}

	topItems.MaxItems = maxItems
	topItems.MinItems = minItems

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(topItems)
}

func GetWarehouseStatus(w http.ResponseWriter, r *http.Request) {
	var warehouseStatus []WarehouseStatus

	if err := config.DB.Table("warehouses").Select("warehouses.name as warehouse_name, COALESCE(SUM(items.quantity), 0) as items_count").Joins("left join items on items.warehouse_id = warehouses.id").Group("warehouses.name").Find(&warehouseStatus).Error; err != nil {
		http.Error(w, "Somthin went wrong: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(warehouseStatus)
}
