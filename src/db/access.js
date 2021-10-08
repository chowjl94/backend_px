const Access = require('../models/model-access')


module.exports = (pool) => {
  const db = {}

  db.insertAccess = async (access) => {
    const res = await pool.query(
      'INSERT INTO access (todo_id, todo_title,user_id,nameof,role ) VALUES ($1,$2,$3,$4,$5) RETURNING *',
      [access.todo_id, access.todo_title,access.user_id,access.nameof,access.role]
    )
    return new Access(res.rows[0])
  }


  db.getAccessRights = async (uid,todo_id) => {
    const res = await pool.query(
      'SELECT * FROM access where todo_id =$1 and user_id=$2',
      [todo_id,uid]
    )
    return res.rows.map(row => new Access(row))
  }

  db.findAccessRolebyTodoid = async (todo_id)=>{
    const res = await pool.query(
      'SELECT * FROM access where todo_id= $1',
      [todo_id]
    )
    return new Access(res.rows[0])
  }

  db.findAccessRolebyUid = async (user_id)=>{
    const res = await pool.query(
      'SELECT * FROM access where user_id= $1',
      [user_id]
    )
    return res.rowCount ? new Access(res.rows[0]) : null
  }
  return db
}