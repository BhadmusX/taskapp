-- Up Migration
DELETE FROM users
WHERE
    email IS NULL;

ALTER TABLE users
ADD CONSTRAINT users_email_unique UNIQUE (email),
ALTER COLUMN email
SET NOT NULL;

-- Down Migration
ALTER TABLE users
DROP CONSTRAINT users_email_unique,
ALTER COLUMN email
DROP NOT NULL;