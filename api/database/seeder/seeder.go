package seeder

import (
	"fmt"

	"github.com/vantan-project/flare/internal/custom"
)

func Seed(db *custom.Gorm, seederName string) error {
	seederFunc, exists := Seeders[seederName]
	if !exists {
		return fmt.Errorf("seeder not found: %s", seederName)
	}

	return seederFunc(db)
}

func Register(name string, fn func(db *custom.Gorm) error) {
	Seeders[name] = fn
}

var Seeders = map[string]func(db *custom.Gorm) error{}
