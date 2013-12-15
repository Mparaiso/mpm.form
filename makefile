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
.PHONY: test install commit push