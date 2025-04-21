package routes

import (
	"github.com/go-chi/chi"
	handlers "github.com/mowafaq-elbashabsheh/gowarehouse/Handlers"
	middlewares "github.com/mowafaq-elbashabsheh/gowarehouse/Middlewares"
	RolesEnum "github.com/mowafaq-elbashabsheh/gowarehouse/constants"
)

func UserRoutes() chi.Router {
	r := chi.NewRouter()

	r.Post("/Login", handlers.LoginHandler)
	r.Post("/Register", middlewares.AuthMiddleware([]RolesEnum.RolesEnum{RolesEnum.Admin}, handlers.RegisterHandler))
	r.Put("/UpdateUser", middlewares.AuthMiddleware([]RolesEnum.RolesEnum{RolesEnum.Admin}, handlers.UpdateUserHandler))
	r.Delete("/DeleteUser", middlewares.AuthMiddleware([]RolesEnum.RolesEnum{RolesEnum.Admin}, handlers.DeleteUserHandler))
	r.Get("/GetUsers", middlewares.AuthMiddleware([]RolesEnum.RolesEnum{RolesEnum.Admin}, handlers.GetUsersHandler))

	return r
}
