install:
	npm install

lint:
	gulp lint

build:
	gulp

develop:
	gulp server

start:
	gulp && gulp server

deploy:
	npx surge ./build/
