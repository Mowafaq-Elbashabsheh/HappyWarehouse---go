package routes

import (
	"github.com/go-chi/chi"
	handlers "github.com/mowafaq-elbashabsheh/gowarehouse/Handlers"
	middlewares "github.com/mowafaq-elbashabsheh/gowarehouse/Middlewares"
	RolesEnum "github.com/mowafaq-elbashabsheh/gowarehouse/constants"
)

func AdminRoutes() chi.Router {
	r := chi.NewRouter()

	r.Get("/GetLogs", middlewares.AuthMiddleware([]RolesEnum.RolesEnum{RolesEnum.Admin}, handlers.GetLogsHandler))

	return r
}
