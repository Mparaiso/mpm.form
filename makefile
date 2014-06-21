test:
	@npm test
#continuous testing
ct:
	@bin/ct.sh
install:
	npm install
commit:
	@git add .
	@git commit -am"$(message) `date`" || : 
push: commit
	@git push 
publish:
	@make test
	@npm publish
doc:
	@npm run doc
.PHONY: test install commit push doc

