bundle.js: app.js package.json
	./node_modules/.bin/browserify app.js > bundle.js
