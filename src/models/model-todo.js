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

