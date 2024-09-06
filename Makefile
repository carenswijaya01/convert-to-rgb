include .env

ifeq ($(NODE_ENV),production)
setup:
	@make pull
	@make up
else
setup:
	@make build
	@make up
endif

build:
	docker compose build --no-cache --force-rm
up:
	docker compose up -d --no-build
down:
	docker compose down --remove-orphans
pull:
	docker compose pull
exec:
	docker exec -it $(CONTAINER_NAME) sh
logs:
	docker logs $(CONTAINER_NAME) -f
