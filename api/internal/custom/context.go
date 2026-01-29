package custom

import (
	"errors"
	"fmt"
	"net/http"
	"reflect"
	"strings"

	"github.com/go-playground/validator/v10"
	"github.com/labstack/echo/v4"
)

// custom.Context
type Context struct {
	ec     echo.Context
	AuthID uint
	DB     *Gorm
}

func newContext(ec echo.Context, db *Gorm) *Context {
	return &Context{
		ec: ec,
		DB: db,
	}
}

func (cc *Context) Validate(i interface{}, rules map[string]map[string]string) (fieldErrors map[string]string, err error) {
	if err = cc.ec.Bind(i); err != nil {
		return nil, err
	}

	err = cc.ec.Validate(i)
	if err == nil {
		return nil, nil
	}

	ves, ok := err.(validator.ValidationErrors)
	if !ok {
		return nil, errors.New("failed to validate")
	}

	fieldErrors = make(map[string]string)
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

	return fieldErrors, nil
}

func (cc *Context) JSON(code int, i interface{}) error {
	return cc.ec.JSON(code, i)
}

func (cc *Context) Request() *http.Request {
	return cc.ec.Request()
}
