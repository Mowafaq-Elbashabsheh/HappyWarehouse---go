package middlewares

import (
	"context"
	"net/http"
	"strings"

	utils "github.com/mowafaq-elbashabsheh/gowarehouse/Helpers"
	RolesEnum "github.com/mowafaq-elbashabsheh/gowarehouse/constants"
)

func AuthMiddleware(requiredRole []RolesEnum.RolesEnum, next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		tokenStr := strings.TrimPrefix(authHeader, "Bearer ")
		claims, err := utils.ValidateToken(tokenStr)
		if err != nil {
			http.Error(w, "Invalid Token", http.StatusUnauthorized)
			return
		}

		if requiredRole != nil {
			userRole := claims.RoleID
			roleMatched := false
			for _, role := range requiredRole {
				if RolesEnum.RolesEnum(userRole) == role || role == RolesEnum.All {
					roleMatched = true
					break
				}
			}

			if !roleMatched {
				http.Error(w, "Forbidden - Unauthorized", http.StatusForbidden)
				return
			}
		}

		ctx := context.WithValue(r.Context(), "userId", claims.UserID)
		ctx = context.WithValue(ctx, "roleId", claims.RoleID)
		next(w, r.WithContext(ctx))
	}
}
