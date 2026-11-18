# Taskapp

A small REST API for users and their tasks, built with Express and PostgreSQL. It uses raw SQL through the `pg` driver, an MVC-style folder structure, and `node-pg-migrate` for versioned schema changes.

This is a learning project for practising Postgres, migrations, connection pooling and parameterised queries.

## Tech stack

- Node.js and Express
- PostgreSQL (`pg` connection pool)
- node-pg-migrate (plain SQL migrations)
- dotenv

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
└── package.json
```

**Layer rules:** routes only map URLs, controllers handle HTTP (validation, status codes), and models run SQL and return plain data. SQL stays in models, and `req`/`res` stay in controllers.

## Prerequisites

- Node.js 18 or newer
- PostgreSQL installed and running locally
- npm

## Setup

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

Update this table to match the routes you actually built.

| Method | Path | Description |
|---|---|---|
| POST | `/users` | Create a user |
| GET | `/users` | List all users |
| GET | `/users/:id` | Get one user |
| PATCH | `/users/:id` | Update a user |
| DELETE | `/users/:id` | Delete a user (their tasks are deleted too) |
| POST | `/users/:id/tasks` | Create a task for a user |
| GET | `/users/:id/tasks` | List a user's tasks |
| PATCH | `/tasks/:id` | Update a task |
| DELETE | `/tasks/:id` | Delete a task |

### Example requests

Create a user:

```bash
curl -i -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Ada","lastName":"Obi","age":25,"email":"ada@example.com"}'
```

Get a user:

```bash
curl -i http://localhost:3000/users/1
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

## Roadmap

- [ ] Stronger input validation (types, ranges, email format)
- [ ] Index on `tasks.user_id`
- [ ] User stats endpoint (total and completed tasks)
- [ ] Pagination for list endpoints
- [ ] Docker setup for Postgres

## License

For learning purposes.