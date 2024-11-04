commit:
	docker compose exec frontend npm run test
	git add .
	git commit -m "$(c)"
	git push

# make commit c="nom commit"

restart:
	docker compose down
	docker compose up --build -d