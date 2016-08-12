SRCS := $(shell ls src/*.ts src/*.tsx)

WEBPACK := ./node_modules/.bin/webpack
TYPINGS := ./node_modules/.bin/typings
TSLINT := ./node_modules/.bin/tslint

PORT := 8888

./speak.js: $(SRCS) | ./typings/index.d.ts
	$(WEBPACK)
run: ./speak.js
	python3 -m http.server ${PORT}

./typings/index.d.ts: ./typings.json | ./node_modules/
	$(TYPINGS) install

./node_modules/: ./package.json
	npm install

lint: | ./node_modules/
	$(TSLINT) -c tslint.json $(SRCS)

clean:
	rm -f ./speak.js

distclean: | clean
	rm -rf ./node_modules/
	rm -rf ./typings/
