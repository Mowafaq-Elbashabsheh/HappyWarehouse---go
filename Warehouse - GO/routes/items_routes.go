package routes

import (
	"github.com/go-chi/chi"
	handlers "github.com/mowafaq-elbashabsheh/gowarehouse/Handlers"
	middlewares "github.com/mowafaq-elbashabsheh/gowarehouse/Middlewares"
	RolesEnum "github.com/mowafaq-elbashabsheh/gowarehouse/constants"
)

func ItemsRoutes() chi.Router {
	r := chi.NewRouter()

	r.Get("/GetItemsByWarehouseId", middlewares.AuthMiddleware([]RolesEnum.RolesEnum{RolesEnum.All}, handlers.GetItemsByWarehouseIdHandler))
	r.Post("/AddItem", middlewares.AuthMiddleware([]RolesEnum.RolesEnum{RolesEnum.All}, handlers.AddItemToWarehouseHandler))
	r.Post("/EditItem", middlewares.AuthMiddleware([]RolesEnum.RolesEnum{RolesEnum.All}, handlers.UpdateItemHandler))
	r.Get("/DeleteItem", middlewares.AuthMiddleware([]RolesEnum.RolesEnum{RolesEnum.All}, handlers.DeleteItemHandler))

	return r
}
