const { Pool } = require('pg')

// establish a connection string 

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
})

const db = {
  ...require('./todo')(pool),
  ...require('./users')(pool),
  ...require('./access')(pool),
  ...require('./indivtask')(pool)
}

/// if table not in db have to do migration . with npm run db:migrate

db.initialise = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS UsersTodo (
      user_id SERIAL PRIMARY KEY,
      username VARCHAR(100) NOT NULL,
      name VARCHAR(30) NOT NULL,
      password_hash VARCHAR(100) NOT NULL
    )
  `)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS Todo (
      todo_id SERIAL PRIMARY KEY,
      title VARCHAR(100) NOT NULL,
      by VARCHAR(100) NOT NULL,
      uid INTEGER NOT NULL,
      created_on DATE NOT NULL DEFAULT CURRENT_DATE,
      updated_by VARCHAR(100),
      updated_on DATE,
      soft_delete BOOLEAN NOT NULL DEFAULT FALSE,
      FOREIGN KEY (uid) REFERENCES UsersTodo(user_id)  

    )
  `)

  await pool.query(`
  DROP TYPE IF EXISTS my_roles;
    CREATE TYPE my_roles AS ENUM ('creator', 'collaborator', 'read-only');

  CREATE TABLE IF NOT EXISTS access (
  access_id     SERIAL PRIMARY KEY,
  todo_id       INTEGER NOT NULL, 
  todo_title    VARCHAR(100) NOT NULL,
  user_id       INTEGER NOT NULL,
  nameof        VARCHAR(100) NOT NULL,
  role          my_roles NOT NULL,
  FOREIGN KEY (todo_id) REFERENCES Todo(todo_id),
  FOREIGN KEY (user_id) REFERENCES UsersTodo(user_id)
)
`)

  await pool.query(`
  CREATE TABLE IF NOT EXISTS Indivtask (
    task_id SERIAL PRIMARY KEY,
    todo_id INTEGER NOT NULL,
    task_title VARCHAR(100) NOT NULL,
    updated_by VARCHAR(100),
    updated_on DATE,
    isFinished BOOLEAN NOT NULL DEFAULT FALSE,
    soft_delete BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (todo_id) REFERENCES todo(todo_id)

  )
  `)
}



db.end = async () => {
  await pool.end()
}

module.exports = db