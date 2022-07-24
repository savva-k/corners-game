# Knex

It's assumed that all commands are ran from the "db" folder, otherwise you might need to specify `--knexfile path/to/db/knexfile.ts`

## Create migration

```knex migrate:make create_users_table```

## Run migration

```knex migrate:latest```
