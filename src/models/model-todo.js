class Todo {
  constructor({ todo_id,title,by,uid, created_on,updated_by,updated_on,soft_delete }) {
    this.todo_id = todo_id
    this.title=title
    this.by = by
    this.uid = uid
    this.created_on = created_on
    this.updated_by = updated_by
    this.updated_on = updated_on
    this.soft_delete = soft_delete

  }
}

module.exports = Todo


// `
// CREATE TABLE IF NOT EXISTS Todo (
//   todo_id SERIAL PRIMARY KEY,
//   title VARCHAR(100) NOT NULL,
//   by VARCHAR(100) NOT NULL,
//   uid INTEGER NOT NULL,
//   created_on DATE NOT NULL DEFAULT CURRENT_DATE,
//   updated_by VARCHAR(100),
//   updated_on DATE,
//   soft_delete BOOLEAN NOT NULL DEFAULT FALSE
//   FOREIGN KEY (uid) REFERENCES UsersTodo(user_id)  

// )
// `