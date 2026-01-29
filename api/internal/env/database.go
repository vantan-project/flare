package env

import "os"

func DBHost() string     { return os.Getenv("DB_HOST") }
func DBPort() string     { return os.Getenv("DB_PORT") }
func DBDatabase() string { return os.Getenv("DB_DATABASE") }
func DBUsername() string { return os.Getenv("DB_USERNAME") }
func DBPassword() string { return os.Getenv("DB_PASSWORD") }
