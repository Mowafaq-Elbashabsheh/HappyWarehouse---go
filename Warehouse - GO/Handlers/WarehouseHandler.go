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

func GetWarehousesHandler(w http.ResponseWriter, r *http.Request) {
	var warehouses []models.Warehouse

	if err := config.DB.Preload("Items").Joins("Country").Find(&warehouses).Error; err != nil {
		http.Error(w, "Somthin went wrong: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(warehouses)
}

func GetWarehouseByIdHandler(w http.ResponseWriter, r *http.Request) {

	warehouseID, err := strconv.Atoi(r.URL.Query().Get("id"))
	if !(warehouseID > 0) || err != nil {
		http.Error(w, "Warehouse ID is Required", http.StatusBadRequest)
		return
	}

	var warehouse models.Warehouse

	if err := config.DB.First(&warehouse, warehouseID).Error; err != nil {
		http.Error(w, "Warehouse Not Found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(warehouse)
}

func CreateWarehouseHandler(w http.ResponseWriter, r *http.Request) {
	var warehouse models.Warehouse

	if err := json.NewDecoder(r.Body).Decode(&warehouse); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if err := config.DB.Create(&warehouse).Error; err != nil {
		http.Error(w, "Error creating warehouse \n"+err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Warehouse Created Successfully <3"})
}

func UpdateWarehouseHandler(w http.ResponseWriter, r *http.Request) {
	var req models.Warehouse
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	warehouseID := req.ID
	if !(warehouseID > 0) {
		http.Error(w, "Warehouse ID is Required", http.StatusBadRequest)
		return
	}

	var warehouse models.Warehouse
	if err := config.DB.First(&warehouse, warehouseID).Error; err != nil {
		http.Error(w, "Warehouse not found", http.StatusNotFound)
		return
	}

	if req.Name != "" {
		warehouse.Name = req.Name
	}
	if req.Address != "" {
		warehouse.Address = req.Address
	}
	if req.City != "" {
		warehouse.City = req.City
	}
	if req.CountryID > 0 {
		warehouse.CountryID = req.CountryID
	}
	warehouse.UpdatedAt = time.Now()

	if err := config.DB.Save(&warehouse).Error; err != nil {
		http.Error(w, "Failed to update warehouse", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Warehouse updated successfully"})
}

func DeleteWarehouseHandler(w http.ResponseWriter, r *http.Request) {

	warehouseID, err := strconv.Atoi(r.URL.Query().Get("id"))
	if !(warehouseID > 0) || err != nil {
		http.Error(w, "Warehouse ID is Required", http.StatusBadRequest)
		return
	}

	var warehouse models.Warehouse
	if err := config.DB.First(&warehouse, warehouseID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			http.Error(w, "Warehouse not found", http.StatusNotFound)
		} else {
			http.Error(w, "Database error", http.StatusInternalServerError)
		}
		return
	}

	if err := config.DB.Delete(&warehouse).Error; err != nil {
		http.Error(w, "Failed to delete warehouse", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Warehouse deleted successfully"})
}
