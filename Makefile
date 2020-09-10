ifdef TEST_FILTER
	PY_TEST_FILTER=-m $(TEST_FILTER)
	JS_TEST_FILTER=:$(TEST_FILTER)
endif

protos:
	scripts/build-protos.sh

frontend:
	cd app/frontend && yarn && yarn build
	cp -rT app/frontend/dist build/frontend

webserver:
	cd go/webrtc && ../../env.sh make

webservices:
	make protos
	make frontend
	make webserver

test:
	./env.sh pytest $(PY_TEST_FILTER)
	cd app/frontend && yarn test$(JS_TEST_FILTER)

test-integration:
	scripts/test-integration.sh

.PHONY: frontend protos test test-integration webserver webservices
