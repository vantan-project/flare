package env

import "os"

func JWTSecret() string { return os.Getenv("JWT_SECRET") }
