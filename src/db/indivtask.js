
const Indivtask = require('../models/model-indivtask')

module.exports = (pool) => {
  const db = {}
  
  db.insertIndivtask = async (task)=>{
    const res = await pool.query(
      'INSERT INTO Indivtask (todo_id,task_title,updated_by,updated_on) VALUES ($1,$2,$3,$4) RETURNING *',
      [task.todo_id,task.task_title,task.updated_by,task.updated_on]
    )
    return new Indivtask(res.rows[0])
  }

  db.getTodoIdFromTask = async (task_id)=>{
    const res = await pool.query(
      'SELECT * FROM Indivtask where task_id =$1',
      [task_id]
    )
    return res.rowCount ? new Indivtask(res.rows[0]) : null
  }

  db.updateTaskofTaskId = async (task,task_id) =>{
    const res = await pool.query(
      'UPDATE indivtask SET task_title=$1, updated_by=$2,updated_on=$3,isFinished=$4 where task_id = $5 RETURNING *',
      [task.task_title,task.updated_by,task.updated_on,task.isFinished,task_id]
    )
    return new Indivtask(res.rows[0])
  }


  db.doSoftDeleteTask = async (task_id) =>{
    const res = await pool.query(
      'UPDATE indivtask SET soft_delete = $1 where task_id = $2 RETURNING *',
      [true, task_id]
    )
    return new Indivtask(res.rows[0])
  }

  return db
}