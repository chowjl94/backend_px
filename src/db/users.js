const User = require('../models/model-users')

module.exports = (pool) => {
  const db = {}

  db.insertUser = async (user) => {
    const res = await pool.query(
      'INSERT INTO userstodo (username, name, password_hash) VALUES ($1,$2, $3) RETURNING *',
      [user.username, user.name, user.password_hash]
    )
    return new User(res.rows[0])
  }
  
  db.findUserById = async (id) => {
    const res = await pool.query(
      'SELECT * FROM userstodo WHERE id = $1',
      [id]
    )
    return res.rowCount ? new User(res.rows[0]) : null
  }

  db.findUserByUsername = async (username) => {
    const res = await pool.query(
      'SELECT * FROM userstodo WHERE username = $1',
      [username]
    )
    return res.rowCount ? new User(res.rows[0]) : null
  }


  return db
}