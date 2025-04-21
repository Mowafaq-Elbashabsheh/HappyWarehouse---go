package RolesEnum

type RolesEnum int

const (
	Admin RolesEnum = iota + 1
	Management
	Auditor
	All
)
