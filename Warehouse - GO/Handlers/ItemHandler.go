package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"
	"time"

	models "github.com/mowafaq-elbashabsheh/gowarehouse/Models"
	"github.com/mowafaq-elbashabsheh/gowarehouse/config"
	"gorm.io/gorm"
)

func GetItemsByWarehouseIdHandler(w http.ResponseWriter, r *http.Request) {
	warehouseID, err := strconv.Atoi(r.URL.Query().Get("warehouseId"))
	if !(warehouseID > 0) || err != nil {
		http.Error(w, "Warehouse ID is Required", http.StatusBadRequest)
		return
	}

	var items []models.Item
	if err := config.DB.Preload("Warehouse").Where("warehouse_id = ?", warehouseID).Find(&items).Error; err != nil {
		http.Error(w, "Something went wrong: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(items)
}

func GetItemByIdHanlder(w http.ResponseWriter, r *http.Request) {
	itemID, err := strconv.Atoi(r.URL.Query().Get("id"))
	if !(itemID > 0) || err != nil {
		http.Error(w, "Item ID is Required", http.StatusBadRequest)
		return
	}

	var item models.Item
	if err := config.DB.First(&item, itemID).Error; err != nil {
		http.Error(w, "Something went wrong: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(item)
}

func AddItemToWarehouseHandler(w http.ResponseWriter, r *http.Request) {
	var item models.Item

	if err := json.NewDecoder(r.Body).Decode(&item); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if item.WarehouseID <= 0 {
		http.Error(w, "Invalid request: warehouseID must be greater than 0!", http.StatusBadRequest)
		return
	}

	if err := config.DB.Create(&item).Error; err != nil {
		http.Error(w, "Error creating item \n"+err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Item Created Successfully <3"})
}

func UpdateItemHandler(w http.ResponseWriter, r *http.Request) {
	var req models.Item
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	itemID := req.ID

	if !(itemID > 0) {
		http.Error(w, "Item ID is Required", http.StatusBadRequest)
		return
	}

	var item models.Item
	if err := config.DB.First(&item, itemID).Error; err != nil {
		http.Error(w, "Item not found", http.StatusNotFound)
		return
	}
	if req.Name != "" {
		item.Name = req.Name
	}
	item.SKUCode = req.SKUCode
	if req.Quantity > 0 {
		item.Quantity = req.Quantity
	}
	if req.CostPrice > 0 {
		item.CostPrice = req.CostPrice
	}
	item.MSRPPrice = req.MSRPPrice
	item.UpdatedAt = time.Now()

	if err := config.DB.Save(&item).Error; err != nil {
		http.Error(w, "Failed to update item", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "item updated successfully"})
}

func DeleteItemHandler(w http.ResponseWriter, r *http.Request) {
	itemID, err := strconv.Atoi(r.URL.Query().Get("id"))
	if !(itemID > 0) || err != nil {
		http.Error(w, "Item ID is Required", http.StatusBadRequest)
		return
	}

	var item models.Item
	if err := config.DB.First(&item, itemID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			http.Error(w, "Item not found", http.StatusNotFound)
		} else {
			http.Error(w, "Database error", http.StatusInternalServerError)
		}
		return
	}

	if err := config.DB.Delete(item).Error; err != nil {
		http.Error(w, "Failed to delete item", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Item deleted successfully"})
}
