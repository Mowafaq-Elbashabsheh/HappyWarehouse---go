package main

import (
	"log"
	"net/http"
	"os"

	"github.com/go-chi/chi"
	"github.com/go-chi/cors"

	middlewares "github.com/mowafaq-elbashabsheh/gowarehouse/Middlewares"
	config "github.com/mowafaq-elbashabsheh/gowarehouse/config"
	"github.com/mowafaq-elbashabsheh/gowarehouse/routes"
)

func main() {

	config.ConnectDatabase()

	portString := os.Getenv("PORT")
	if portString == "" {
		log.Fatal("PORT is not found")
	}

	router := chi.NewRouter()

	router.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"https://*", "http://*"},
		AllowedMethods:   []string{"GET", "POST", "DELETE", "PUT", "OPTIONS"},
		AllowedHeaders:   []string{"*"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: false,
		MaxAge:           300,
	}))

	v1Router := chi.NewRouter()
	v1Router.Use(middlewares.LoggerMiddleware)

	v1Router.Mount("/Users", routes.UserRoutes())
	v1Router.Mount("/Warehouse", routes.WarehouseRoutes())
	v1Router.Mount("/Items", routes.ItemsRoutes())
	v1Router.Mount("/Dashboard", routes.DashboardRoutes())
	v1Router.Mount("/Admin", routes.AdminRoutes())

	router.Mount("/v1", v1Router)

	srv := &http.Server{
		Handler: router,
		Addr:    ":" + portString,
	}

	log.Printf("Server starting on port: %v", portString)
	err := srv.ListenAndServe()

	if err != nil {
		log.Fatal(err)
	}
}
