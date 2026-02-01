up:
	docker compose up -d

down:
	docker compose down

build:
	docker compose build

in:
	docker compose exec api bash

migrate:
	go run ./cmd/migrate/migrate.go $(filter-out $@,$(MAKECMDGOALS))

seed:
	go run ./cmd/seed/seed.go $(filter-out $@,$(MAKECMDGOALS))

%:
	@: