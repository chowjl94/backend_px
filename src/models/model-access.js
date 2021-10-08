class AccessControl {
  constructor({ access_id,todo_id,todo_title,user_id,nameof,role }) {
    this.access_id = access_id
    this.todo_id = todo_id
    this.todo_title = todo_title
    this.user_id = user_id
    this.nameof = nameof
    this.role = role
  }
}
  
module.exports = AccessControl




// `
//   DROP TYPE IF EXISTS my_roles;
//     CREATE TYPE my_roles AS ENUM ('creator', 'collaborator', 'read-only');

//   CREATE TABLE IF NOT EXISTS access (
//   access_id     SERIAL PRIMARY KEY,
//   todo_id       INTEGER NOT NULL, 
//   todo_title    VARCHAR(100) NOT NULL,
//   user_id       INTEGER NOT NULL,
//   nameof        VARCHAR(100) NOT NULL,
//   role          my_roles NOT NULL
//   FOREIGN KEY (todo_id) REFERENCES Todo(todo_id)
//   FOREIGN KEY (user_id) REFERENCES UsersTodo(user_id)
// )
// `
