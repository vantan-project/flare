package custom

import (
	"github.com/go-playground/validator/v10"
)

// custom.Validator
type Validator struct {
	validate *validator.Validate
}

func NewValidator() *Validator {
	return &Validator{
		validate: validator.New(),
	}
}

func (cv *Validator) Validate(i interface{}) error {
	return cv.validate.Struct(i)
}
