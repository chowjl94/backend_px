class User {
  constructor({ user_id, username,name, password_hash }) {
    this.user_id = user_id
    this.username = username
    this.name = name
    this.password_hash = password_hash
  }
}
  
module.exports = User



// CREATE TABLE IF NOT EXISTS UsersTodo (
//   user_id SERIAL PRIMARY KEY,
//   username VARCHAR(100) NOT NULL,
//   name VARCHAR(30) NOT NULL,
//   password_hash VARCHAR(100) NOT NULL
