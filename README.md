## Access to postgres:

-   `localhost:5432`
-   **Username:** postgres (as a default)

## Access to PgAdmin:

-   **URL:** `http://localhost:5050`
-   **Username:** pgadmin4@pgadmin.org (as a default)
-   **Password:** admin (as a default)

## Add a new server in PgAdmin:

-   **Host name/address** `postgres`
-   **Port** `5432`
-   **Username** as `POSTGRES_USER`, by default: `postgres`

To verify if the the postgres docker container is running, run:

```bash
docker inpsect -f "{{.State.Running}}" pdb # where pdb is the container name
```
