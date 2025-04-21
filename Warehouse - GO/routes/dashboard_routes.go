package routes

import (
	"github.com/go-chi/chi"
	handlers "github.com/mowafaq-elbashabsheh/gowarehouse/Handlers"
	middlewares "github.com/mowafaq-elbashabsheh/gowarehouse/Middlewares"
	RolesEnum "github.com/mowafaq-elbashabsheh/gowarehouse/constants"
)

func DashboardRoutes() chi.Router {
	r := chi.NewRouter()

	r.Get("/GetTopItems", middlewares.AuthMiddleware([]RolesEnum.RolesEnum{RolesEnum.Admin}, handlers.GetTopItemsHandler))
	r.Get("/GetWarehouseStatus", middlewares.AuthMiddleware([]RolesEnum.RolesEnum{RolesEnum.Admin}, handlers.GetWarehouseStatus))

	return r
}
