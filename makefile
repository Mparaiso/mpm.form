test:
	mocha
	@make commit
install:
	npm install
commit:
	@git add .
	@git commit -am"auto update `date`" || : 
push: commit
	@git push origin master || : 
publish:
	@npm publish
.PHONY: test install commit push