const Todo = require('../models/model-todo')

module.exports = (pool) => {
  const db = {}
  db.insertTodo = async (todo) => {
    const res = await pool.query(
      'INSERT INTO Todo (title, by, created_on,uid) VALUES ($1,$2,$3,$4) RETURNING *',
      [todo.title, todo.by, todo.created_on,todo.uid]
    )
    console.log(todo)
    return new Todo(res.rows[0])
  }

  db.findTodoByTodoidUserId = async (uid) => {
    const res = await pool.query(
      'SELECT distinct title,by FROM Todo where  uid=$1',
      [uid]
    )
    return res.rows.map(row => new Todo(row))
    // return res.rowCount ? new Todo(res.rows[0]) : null
  }


  db.getTodoListByUidId = async (uid,todo_id) => {
    const res = await pool.query(
      'SELECT * FROM todo where todo_id =$1 and uid=$2',
      [todo_id,uid]
    )
    return res.rows.map(row => new Todo(row))
    // return res.rowCount ? new Todo(res.rows[0]) : null
  }

  db.getTodoListById = async (todo_id) => {
    const res = await pool.query(
      'SELECT * FROM todo where todo_id =$1',
      [todo_id]
    )
    return res.rows.map(row => new Todo(row))[0]
    // return res.rowCount ? new Todo(res.rows[0]) : null
  }

  db.getTodoListByUid = async (uid) => {
    const res = await pool.query(
      'SELECT * FROM todo where uid=$1',
      [uid]
    )
    return res.rows.map(row => new Todo(row))
    // return res.rowCount ? new Todo(res.rows[0]) : null
  }


  db.updateTodo = async (todo_id, todo) => {
    const res = await pool.query(
      'UPDATE todo SET title=$2,updated_by=$3,updated_on=$4,soft_delete=$5 WHERE todo_id=$1 RETURNING *',
      [todo_id, todo.title,todo.updated_by,todo.updated_on,todo.soft_delete]
    )
    return new Todo(res.rows[0])
  }



  db.doSoftDelete = async (todo_id) => {
    const res = await pool.query(
      'UPDATE todo SET soft_delete=$1 where todo_id =$2 RETURNING*',
      [true,todo_id]
    )
    return new Todo(res.rows[0])
    
  }


  return db
}