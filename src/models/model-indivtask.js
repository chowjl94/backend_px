class Indivtask {
  constructor({ task_id,todo_id,task_title,updated_by,updated_on,isFinished,soft_delete}) {
    this.task_id = task_id
    this.todo_id = todo_id
    this.task_title = task_title
    this.updated_by = updated_by
    this.updated_on = updated_on
    this.isFinished = isFinished
    this.soft_delete = soft_delete
  }
}
    
module.exports = Indivtask
  

// task_id SERIAL PRIMARY KEY,
// todo_id INTEGER NOT NULL,
// task_title VARCHAR(100) NOT NULL,
// updated_by VARCHAR(100),
// updated_on DATE,
// isFinished BOOLEAN NOT NULL DEFAULT FALSE,
// soft_delete BOOLEAN NOT NULL DEFAULT FALSE,
// FOREIGN KEY (todo_id) REFERENCES todo(todo_id)

