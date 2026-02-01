package custom

import (
	"fmt"
	"net/http"
	"reflect"
	"strings"

	"github.com/go-playground/validator/v10"
	"github.com/labstack/echo/v4"
)

// custom.Context
type Context struct {
	ec      echo.Context
	AuthID  uint
	DB      *Gorm
	Storage *S3
	AI      *AI
}

type validateRessponse struct {
	Status      string            `json:"status"`
	FieldErrors map[string]string `json:"fieldErrors"`
}

func newContext(ec echo.Context, db *Gorm, storage *S3, ai *AI) *Context {
	return &Context{
		ec:      ec,
		DB:      db,
		Storage: storage,
		AI:      ai,
	}
}

func (cc *Context) Validate(i interface{}, rules map[string]map[string]string) {
	if err := cc.ec.Bind(i); err != nil {
		cc.ec.NoContent(http.StatusInternalServerError)
		panic(Panic{})
	}

	err := cc.ec.Validate(i)
	if err == nil {
		return
	}

	ves, ok := err.(validator.ValidationErrors)
	if !ok {
		cc.ec.NoContent(http.StatusInternalServerError)
		panic(Panic{})
	}

	fieldErrors := make(map[string]string)
	t := reflect.TypeOf(i)
	if t.Kind() == reflect.Ptr {
		t = t.Elem()
	}

	for _, ve := range ves {
		structField := ve.Field()
		tag := ve.Tag()

		field, found := t.FieldByName(structField)
		jsonKey := structField
		if found {
			if jsonTag := field.Tag.Get("json"); jsonTag != "" {
				jsonKey = strings.Split(jsonTag, ",")[0]
			}
		}
		if _, exists := fieldErrors[jsonKey]; exists {
			continue
		}
		if fieldRule, ok := rules[jsonKey]; ok {
			if msg, ok := fieldRule[tag]; ok {
				fieldErrors[jsonKey] = msg
				continue
			}
		}

		fieldErrors[jsonKey] = fmt.Sprintf("Field validation for '%s' failed on the '%s' tag", jsonKey, tag)
	}

	cc.JSON(http.StatusUnprocessableEntity, validateRessponse{
		Status:      "Validation",
		FieldErrors: fieldErrors,
	})
	panic(Panic{})
}

func (cc *Context) JSON(code int, i interface{}) error {
	return cc.ec.JSON(code, i)
}

func (cc *Context) NoContent(code int) error {
	return cc.ec.NoContent(code)
}

func (cc *Context) Request() *http.Request {
	return cc.ec.Request()
}

func (cc *Context) Logger() echo.Logger {
	return cc.ec.Logger()
}
