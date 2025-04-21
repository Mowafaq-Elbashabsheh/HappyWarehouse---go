package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
	models "github.com/mowafaq-elbashabsheh/gowarehouse/Models"
	"gorm.io/driver/sqlserver"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDatabase() {
	godotenv.Load()

	connectionString := os.Getenv("DB_URL")
	if connectionString == "" {
		log.Fatal("Database connection string is missing")
	}

	var err error
	DB, err = gorm.Open(sqlserver.Open(connectionString), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database: ", err)
	}

	DB.AutoMigrate(&models.Users{}, &models.Role{}, &models.Country{}, &models.Warehouse{}, &models.Item{})
	log.Println("Database migrated successfully!")
}
