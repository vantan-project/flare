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
	echo.Context
	AuthID  uint
	DB      *Gorm
	Storage *S3
	AI      *AI
}

type validateRessponse struct {
	Status      string            `json:"status"`
	FieldErrors map[string]string `json:"fieldErrors"`
}

func (cc *Context) BindValidate(i interface{}, rules map[string]map[string]string) {
	if err := cc.Bind(i); err != nil {
		cc.NoContent(http.StatusInternalServerError)
		panic(Panic{})
	}

	err := cc.Context.Validate(i)
	if err == nil {
		return
	}

	ves, ok := err.(validator.ValidationErrors)
	if !ok {
		cc.NoContent(http.StatusInternalServerError)
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
		Status:      "validation",
		FieldErrors: fieldErrors,
	})
	panic(Panic{})
}
