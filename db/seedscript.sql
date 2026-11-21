TRUNCATE users,
tasks restart IDENTITY CASCADE;

INSERT INTO
    users (first_name, last_name, age, email)
SELECT
    'first' || n,
    'last' || n,
    random(18, 77),
    'user' || n || '@example.com'
FROM
    generate_series(1, 5000) AS n;

INSERT INTO
    tasks (task_name, user_id, stat)
SELECT
    'task' || n,
    floor(random() * 5000 + 1)::int,
    random() < 0.5
FROM
    generate_series(1, 500000) AS n;