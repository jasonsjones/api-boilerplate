# API Boilerplate

> Node API for exploring new technologies and libraries

This project is a Node API used to try out new technologies and libraries, both in this project itself, as well as providing an actual API to explore different client-side technologies. This version of the project exposes a single GraphQL endpoint and is backed by a Postgres data store.

Other interesting items to note:

-   Written in Typescript
-   Utilizes TypeORM and Type GraphQL
-   Postgres & pgAdmin (web interface to manage postgres) run as docker containers

## Postgres & pgAdmin

To get Postgres up and running, assuming docker is installed, run:

```bash
docker-compose up -d
```

To bring down the containers and remove any associated docker volumes, run:

```bash
docker-compose down -v
```

### Access to postgres:

-   `localhost:5432`
-   **Username:** postgres (as a default)

### Access to PgAdmin:

-   **URL:** `http://localhost:5050`
-   **Username:** pgadmin4@pgadmin.org (as a default)
-   **Password:** admin (as a default)

### Add a new server in PgAdmin:

-   **Host name/address** `postgres`
-   **Port** `5432`
-   **Username** as `POSTGRES_USER`, by default: `postgres`

### Postgres data

The out-of-the-box configuration is to persist all postgres data in the 'data/` at the root of the project. This directory is currently ignored by git.

#### Notes:

To verify if the the postgres docker container is running, run:

```bash
docker inpsect -f "{{.State.Running}}" pdb # where pdb is the container name
```
