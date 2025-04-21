package routes

import (
	"github.com/go-chi/chi"
	handlers "github.com/mowafaq-elbashabsheh/gowarehouse/Handlers"
	middlewares "github.com/mowafaq-elbashabsheh/gowarehouse/Middlewares"
	RolesEnum "github.com/mowafaq-elbashabsheh/gowarehouse/constants"
)

func WarehouseRoutes() chi.Router {
	r := chi.NewRouter()

	r.Get("/GetAllWarehouses", middlewares.AuthMiddleware([]RolesEnum.RolesEnum{RolesEnum.All}, handlers.GetWarehousesHandler))
	r.Post("/EditWarehouse", middlewares.AuthMiddleware([]RolesEnum.RolesEnum{RolesEnum.All}, handlers.UpdateWarehouseHandler))
	r.Post("/AddWarehouse", middlewares.AuthMiddleware([]RolesEnum.RolesEnum{RolesEnum.All}, handlers.CreateWarehouseHandler))
	r.Get("/DeleteWarehouse", middlewares.AuthMiddleware([]RolesEnum.RolesEnum{RolesEnum.All}, handlers.DeleteWarehouseHandler))

	return r
}
