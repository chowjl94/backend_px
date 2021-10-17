const { Pool } = require('pg')
const fs = require('fs')

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
      FOREIGN KEY (uid) REFERENCES UsersTodo(user_id) on DELETE CASCADE

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
  FOREIGN KEY (todo_id) REFERENCES Todo(todo_id) on DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES UsersTodo(user_id) on DELETE CASCADE
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
    FOREIGN KEY (todo_id) REFERENCES todo(todo_id) on DELETE CASCADE

  )
  `)
}

  db.dropAccess = async () => {
    await pool.query(`DROP TABLE IF EXISTS access CASCADE`)
  }
  
  db.dropIndivtask = async () => {
    await pool.query(`DROP TABLE IF EXISTS indivtask CASCADE`)
  }

  db.dropTodo = async () => {
    await pool.query(`DROP TABLE IF EXISTS todo CASCADE`)
  }

  db.dropUserstodo = async () => {
    await pool.query(`DROP TABLE IF EXISTS userstodo CASCADE`)
  }

  db.clearAccess = async () => {
    await pool.query(`
      TRUNCATE access CASCADE;
      ALTER SEQUENCE access_access_id_seq RESTART
      `)
  }

  db.clearIndivtask = async () => {
    await pool.query(`
    TRUNCATE indivtask CASCADE;
    ALTER SEQUENCE indivtask_task_id_seq RESTART`)
  }

  db.clearTodo = async () => {
    await pool.query(`
    TRUNCATE todo CASCADE;
    ALTER SEQUENCE todo_todo_id_seq RESTART`)
  }

  db.clearUserstodo = async () => {
    await pool.query(`
    TRUNCATE Userstodo CASCADE;
    ALTER SEQUENCE userstodo_user_id_seq RESTART`)
  }

db.end = async () => {
  await pool.end()
}

module.exports = db