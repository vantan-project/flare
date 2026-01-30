package custom

import (
	"fmt"
	"time"

	"github.com/vantan-project/flare/internal/env"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

// cunstom.Gorm
type Gorm struct {
	*gorm.DB
	DSN string
}

func NewGorm() (*Gorm, error) {
	dsn, err := newDsn()
	if err != nil {
		return nil, err
	}

	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{
		TranslateError: true,
		Logger:         logger.Default.LogMode(logger.Warn),
	})
	if err != nil {
		return nil, fmt.Errorf("failed to open database: %w", err)
	}

	sqlDB, err := db.DB()
	if err != nil {
		return nil, fmt.Errorf("failed to get sql.DB: %w", err)
	}

	sqlDB.SetMaxOpenConns(25)
	sqlDB.SetMaxIdleConns(10)
	sqlDB.SetConnMaxLifetime(5 * time.Minute)

	if err := sqlDB.Ping(); err != nil {
		return nil, fmt.Errorf("failed to ping database: %w", err)
	}

	return &Gorm{
		DB:  db,
		DSN: dsn,
	}, nil
}

func (o *Gorm) Close() error {
	sqlDB, err := o.DB.DB()
	if err != nil {
		return fmt.Errorf("failed to get sql.DB: %w", err)
	}
	return sqlDB.Close()
}

func newDsn() (string, error) {
	host := env.DBHost()
	port := env.DBPort()
	database := env.DBDatabase()
	username := env.DBUsername()
	password := env.DBPassword()

	if host == "" || port == "" || database == "" || username == "" {
		return "", fmt.Errorf("required database env is not set")
	}

	return fmt.Sprintf(
		"%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
		username,
		password,
		host,
		port,
		database,
	), nil
}
