package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"
	"time"

	utils "github.com/mowafaq-elbashabsheh/gowarehouse/Helpers"
	models "github.com/mowafaq-elbashabsheh/gowarehouse/Models"
	config "github.com/mowafaq-elbashabsheh/gowarehouse/config"
	"gorm.io/gorm"
)

func RegisterHandler(w http.ResponseWriter, r *http.Request) {
	var user models.Users

	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if err := user.HashPassword(); err != nil {
		http.Error(w, "Error hashing password", http.StatusInternalServerError)
		return
	}

	if err := config.DB.Create(&user).Error; err != nil {
		http.Error(w, "Error creating user \n"+err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"message": "User Created Successfully <3"})
}

func LoginHandler(w http.ResponseWriter, r *http.Request) {
	var input struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	var user models.Users

	if err := config.DB.Preload("Role").Where("email = ?", input.Email).First(&user).Error; err != nil {
		http.Error(w, "Invalid Email", http.StatusUnauthorized)
		return
	}

	if !user.CheckPassword(input.Password) {
		http.Error(w, "Invalid Password", http.StatusUnauthorized)
		return
	}

	token, err := utils.GenerateToken(user.ID, user.RoleID, user.Email, user.FullName)
	if err != nil {
		http.Error(w, "Could not generate token", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"token": token, "role": user.Role.Name, "email": user.Email})
}

func UpdateUserHandler(w http.ResponseWriter, r *http.Request) {

	var req models.Users

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	userID := req.ID

	if !(userID > 0) {
		http.Error(w, "User ID is Required", http.StatusBadRequest)
		return
	}

	var user models.Users
	if err := config.DB.First(&user, userID).Error; err != nil {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	if req.Password != "" {
		if err := req.HashPassword(); err != nil {
			http.Error(w, "Error hashing password", http.StatusInternalServerError)
			return
		}
		user.Password = req.Password
	}

	if req.FullName != "" {
		user.FullName = req.FullName
	}
	if req.Email != "" {
		user.Email = req.Email
	}
	if req.RoleID != user.ID && req.RoleID > 0 {
		user.RoleID = req.RoleID
	}
	user.Active = req.Active
	user.UpdatedAt = time.Now()

	if err := config.DB.Save(&user).Error; err != nil {
		http.Error(w, "Failed to update user", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "User updated successfully"})
}

func DeleteUserHandler(w http.ResponseWriter, r *http.Request) {
	userID, err := strconv.Atoi(r.URL.Query().Get("id"))

	if !(userID > 0) || err != nil {
		http.Error(w, "User ID is Required", http.StatusBadRequest)
		return
	}

	var user models.Users
	if err := config.DB.First(&user, userID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			http.Error(w, "User not found", http.StatusNotFound)
		} else {
			http.Error(w, "Database error", http.StatusInternalServerError)
		}
		return
	}

	if err := config.DB.Delete(&user).Error; err != nil {
		http.Error(w, "Failed to delete user", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "User deleted successfully"})
}

func GetUsersHandler(w http.ResponseWriter, r *http.Request) {
	var users []models.Users

	if err := config.DB.Joins("Role").Find(&users).Error; err != nil {
		http.Error(w, "Somthing went wrong: \n"+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(users)
}

// not needed
func GetUserByIdHandler(w http.ResponseWriter, r *http.Request) {
	userID, err := strconv.Atoi(r.URL.Query().Get("id"))

	if !(userID > 0) || err != nil {
		http.Error(w, "User ID is Required", http.StatusBadRequest)
		return
	}

	var user models.Users

	if err := config.DB.Joins("Role").First(&user, userID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			http.Error(w, "User not found", http.StatusNotFound)
		} else {
			http.Error(w, "Database error", http.StatusInternalServerError)
		}
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(user)
}
