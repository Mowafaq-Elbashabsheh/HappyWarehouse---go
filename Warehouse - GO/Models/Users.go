package models

import "golang.org/x/crypto/bcrypt"

type Users struct {
	BaseModel
	FullName string `gorm:"not null" json:"fullName"`
	Email    string `gorm:"unique;not null" json:"email"`
	Password string `gorm:"not null" json:"password"`
	RoleID   int    `gorm:"not null" json:"roleId"`
	Role     Role   `gorm:"foreignKey:RoleID" json:"role"`
	Active   bool   `gorm:"not null" json:"active"`
}

func (u *Users) HashPassword() error {

	hashed, err := bcrypt.GenerateFromPassword([]byte(u.Password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	u.Password = string(hashed)
	return nil
}

func (u *Users) CheckPassword(password string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(u.Password), []byte(password))
	return err == nil
}
