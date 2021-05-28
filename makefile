install:
	npm ci
	npm run build

lint:
	npx eslint ./src
