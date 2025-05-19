check: lint test

lint:
	./node_modules/.bin/biome ci

format::
	./node_modules/.bin/biome check --fix

test:
	node --require should --test

.PHONY: check format lint test
