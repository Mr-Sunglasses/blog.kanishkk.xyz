.DEFAULT_GOAL := help

PNPM ?= pnpm

.PHONY: help setup install dev build preview check type-check format lint new-post clean

help:
	@printf "Available commands:\n"
	@printf "  make setup       Install project dependencies\n"
	@printf "  make dev         Start the local development server\n"
	@printf "  make build       Build the production site\n"
	@printf "  make preview     Preview the production build\n"
	@printf "  make check       Check the project for errors\n"
	@printf "  make type-check  Run the TypeScript compiler\n"
	@printf "  make format      Format source files\n"
	@printf "  make lint        Check and fix source files\n"
	@printf "  make new-post    Create a post: make new-post NAME=my-post\n"
	@printf "  make clean       Remove generated build output\n"

setup: install

install:
	@command -v $(PNPM) >/dev/null 2>&1 || { printf "Error: pnpm is required. Install pnpm 9 or newer.\n" >&2; exit 1; }
	$(PNPM) install --frozen-lockfile

dev:
	$(PNPM) dev

build:
	$(PNPM) build

preview:
	$(PNPM) preview

check:
	$(PNPM) check

type-check:
	$(PNPM) type-check

format:
	$(PNPM) format

lint:
	$(PNPM) lint

new-post:
	@test -n "$(NAME)" || { printf "Usage: make new-post NAME=my-post\n" >&2; exit 1; }
	$(PNPM) new-post $(NAME)

clean:
	rm -rf dist .astro