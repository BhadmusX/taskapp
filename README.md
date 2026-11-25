# Taskapp

A small REST API for users and their tasks, built with Express and PostgreSQL. It uses raw SQL through the `pg` driver, an MVC-style folder structure, and `node-pg-migrate` for versioned schema changes.

This is a learning project for practising Postgres, migrations, connection pooling and parameterised queries.

## Tech stack

- Node.js and Express
- PostgreSQL (`pg` connection pool)
- node-pg-migrate (plain SQL migrations)
- dotenv
- Docker(Optional, for running PostgresSQL locally)

## Project structure

```
taskapp/
├── index.js              # entry point: loads env, mounts routes, starts server
├── db/
│   └── index.js          # shared pg Pool
├── routes/               # maps URLs and methods to controllers
├── controllers/          # reads req, validates input, sends res
├── models/               # all SQL lives here
├── migrations/           # versioned schema changes (SQL)
├── .env                  # local config (not committed)
├── .env.example         # public config
├── docker-compose.yml    # docker compose YAML config file
└── package.json
```

**Layer rules:** routes only map URLs, controllers handle HTTP (validation, status codes), and models run SQL and return plain data. SQL stays in models, and `req`/`res` stay in controllers.

## Prerequisites

- Node.js 18 or newer
- PostgreSQL installed and running locally
- npm
- Docker(Optional with docker compose plugin)

## Run without Docker

### 1. Clone and install

```bash
git clone <your-repo-url>
cd taskapp
npm install
```

### 2. Create the database role and database

Open `psql` as a superuser and run:

```sql
CREATE ROLE app_user WITH LOGIN PASSWORD 'choose-a-password';
CREATE DATABASE taskdb OWNER app_user;
```

Use a simple password with only letters and numbers, since special characters such as `@` break the connection URL unless they are URL-encoded.

Check the login works:

```bash
psql "postgresql://app_user:choose-a-password@localhost:5432/taskdb"
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```
DATABASE_URL=postgresql://app_user:choose-a-password@localhost:5432/taskdb
PORT=3000
```

Make sure `.env` and `node_modules` are listed in `.gitignore`.

### 4. Run the migrations

```bash
npm run migrate up
```

This creates the tables and a `pgmigrations` table, which node-pg-migrate uses to record which migration files have already run.

### 5. Start the server

```bash
npm run dev
```

The API runs at `http://localhost:3000`.

## Run with Docker (PostgreSQL)

Docker runs PostgreSQL in a container, so you don't need to install Postgres on your machine. Everyone who follows these steps gets the same version and setup.

### Prerequisites

- Docker Engine and the Compose plugin (`docker --version` and `docker compose version` should both work)
- Node.js 18 or newer

### Steps

1. **Copy the example environment file**

   ```bash
   cp .env.example .env
   ```

2. **Set a real password in `.env`.** Change `choose-a-password` to your own value in both `DB_PASSWORD` and `DATABASE_URL`. They must match, and the password should use letters and numbers only.

3. **Start the database**

   ```bash
   docker compose up -d
   ```

4. **Check that it is running**

   ```bash
   docker compose ps
   docker compose logs db
   ```

   The logs should end with a message saying the database system is ready to accept connections.

5. **Install dependencies and create the tables**

   ```bash
   npm install
   npm run migrate up
   ```

6. **Start the API**

   ```bash
   npm run dev
   ```

### Useful commands

| Command | What it does |
|---|---|
| `docker compose up -d` | Start the database in the background |
| `docker compose down` | Stop and remove the container (data is kept) |
| `docker compose down -v` | Stop and remove the container **and delete all data** |
| `docker compose logs db` | Show database logs |
| `docker compose exec db psql -U app_user -d taskdb` | Open a `psql` session inside the container |

### Notes

- The database is available on `localhost:5433`, so it does not clash with a local Postgres on port 5432. It is bound to `127.0.0.1`, so only your own machine can reach it.
- The `DB_*` values in `.env` are only applied the first time the container starts with an empty volume. To change the user or password later, run `docker compose down -v` and start again. This deletes the data.
- Data is stored in a named Docker volume, which is not a backup. Use `pg_dump` for backups.

## Migrations

Schema changes live in `migrations/`, one file per change. Each file has an `Up` and a `Down` section.

| Command | What it does |
|---|---|
| `npm run migrate create <name>` | Generate a new empty migration file |
| `npm run migrate up` | Apply all pending migrations |
| `npm run migrate down` | Undo the most recent migration |

Rules:

- Never edit a migration that has already run. Write a new migration instead.
- Always write the `Down` section so a change can be undone.
- Save the file before running `up`.
- Don't edit the `pgmigrations` table by hand.

## API endpoints


| Method | Path | Description |
|---|---|---|
| POST | `api/users/create` | Create a user |
| GET | `api/users/get` | List all users |
| GET | `api/users/get/:id` | Get one user |
| PATCH | `api/users/update/:id` | Update a user |
| DELETE | `api/users/delete/:id` | Delete a user (their tasks are deleted too) |
| POST | `api/tasks/create` | Create a task for a user |
| GET | `api/tasks/get/user/:id` | List a user's tasks |
| PATCH | `api/tasks/update/:id` | Update a task |
| DELETE | `api/tasks/delete/:id` | Delete a task |
| GET | `api/tasks/get/stat/user/:id` | List user task stat|

### Example requests

Create a user:

```bash
curl -i -X POST http://localhost:3000/api/users/create \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Ada","lastName":"Obi","age":25,"email":"ada@example.com"}'
```

Get a user:

```bash
curl -i http://localhost:3000/api/users/get/1
```

Get tasks: 

```bash
curl -i "http://localhost:3000/api/tasks/get?userId=42&stat=false&page=2&limit=5"
```

### Status codes

| Code | Meaning |
|---|---|
| 200 | Success |
| 201 | Resource created |
| 400 | Missing or invalid input |
| 404 | Resource not found |
| 409 | Conflict, such as a duplicate email |
| 500 | Unexpected server error |

## Database design

- `users` has a generated primary key and a unique `email` column.
- `tasks` belongs to a user through a foreign key to `users`, with `ON DELETE CASCADE`, so deleting a user also deletes their tasks.
- Primary keys are identity columns, so Postgres generates the ids.

Check the current structure at any time with `\d users` and `\d tasks` in `psql`.

## Notes on how queries are written

- All user input goes through placeholders (`$1`, `$2`), never string concatenation, to prevent SQL injection.
- One shared `Pool` is created in `db/index.js` and reused everywhere.
- Duplicate emails are handled twice: a pre-check in the controller for a friendly error, and a catch for Postgres error code `23505` to cover simultaneous requests.

## Index performance test

Tested on a separate `taskdb_perf` database seeded with generated data (`db/seed.sql`), using PostgreSQL 18.

**Query under test:**

```sql
SELECT * FROM tasks WHERE user_id = 42 ORDER BY task_id DESC;
```

**Query A:** `SELECT * FROM tasks WHERE user_id = 42 ORDER BY task_id DESC;`
**Query B:** `SELECT * FROM tasks WHERE user_id = 42 AND stat = false ORDER BY task_id DESC;`

| # | Query | Stage | Users | Tasks | Index | Scan type | Sort step | Rows removed by filter* | Execution time (ms) |
|---|-------|-------|------:|------:|-------|-----------|-----------|------------------------:|--------------------:|
| 1 | A | Baseline (small data) | 100 | 1,000 | none (primary key only) | Seq Scan | Yes (quicksort) | 990 | 0.777 |
| 2 | A | **Before index** | 5,000 | 500,000 | none (primary key only) | Parallel Seq Scan | Yes (quicksort) | 166,638 | 39.210 |
| 3 | A | After index | 5,000 | 500,000 | `(user_id)` | Bitmap Index Scan + Bitmap Heap Scan | Yes (quicksort) | 0 | 0.733 |
| 4 | A | After index | 5,000 | 500,000 | `(user_id, task_id DESC)` |Bitmap Index Scan + Bitmap Heap Scan | Yes(quicksort) | 0 | 0.521 |
| 5 | B | **Before index** | 5,000 | 500,000 | `(user_id, task_id DESC)` | Bitmap Index Scan + Bitmap Heap Scan | Yes(quicksort) | 43 | 0.631 |
| 6 | B | After index | 5,000 | 500,000 | `(user_id, task_id DESC)` + partial index on `stat = false` | Bitmap Index Scan + Bitmap Heap Scan |Yes(quicksort) | 0 | 0.306 |

\* Per-worker average for parallel scans, so the total rows discarded in row 2 is about 499,914.

Rows 2 to 4 are compared with row 2. Row 6 is compared with row 5.

### Findings

- Without an index, Postgres used a parallel sequential scan over 500,000 rows and took about 39 ms. An index on `user_id` brought the same query to about 0.7 ms, roughly 50 times faster, because the scan stopped reading rows that don't belong to the user.
- The composite index `(user_id, task_id DESC)` made little difference for the unlimited query. The planner kept a bitmap scan plus a small in-memory sort.
- The partial index on `stat = false` removed the filter step and roughly halved execution time for query B (0.631 ms to 0.306 ms). Because `stat` is split about 50/50 in the seeded data, the absolute gain is small. A partial index pays off more when the filtered subset is a small share of the table.
- A standalone index on `stat` was skipped, because a boolean column has only two values.

### How to reproduce

1. Create the test database and run the migrations against it.
2. Run `db/seed.sql` against `taskdb_perf`.
3. Run `ANALYZE tasks;`.
4. Run `EXPLAIN ANALYZE` on the query above.

## Roadmap

- [x] Stronger input validation (types, ranges, email format)
- [x] Index on `tasks.user_id`
- [x] User stats endpoint (total and completed tasks)
- [x] Pagination for list endpoints
- [x] Docker setup for Postgres

## License

For learning purposes.