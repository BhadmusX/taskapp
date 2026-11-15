CREATE TABLE IF NOT EXISTS users(
    User_id INT PRIMARY KEY,
    First_Name TEXT,
    Last_Name TEXT,
    Age INT,
    task_id INT NOT NULL REFERENCES users(User_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS tasks(
    task_id INT PRIMARY KEY,
    task_name TEXT
)
