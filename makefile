test:
	@node_modules/.bin/mocha
	@make commit
#continuous testing
ct:
	@bin/ct.sh
install:
	npm install
commit:
	@git add .
	@git commit -am"auto update `date`" || : 
push: commit
	@git push origin master || : 
publish:
	@npm publish
build:
	@node_modules/.bin/tsc typescript-sources/mpm.form.ts --outDir js --module commonjs --declaration --sourcemap --target ES5
.PHONY: test install commit push