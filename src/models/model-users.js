class User {
  constructor({ user_id, username,name, password_hash }) {
    this.user_id = user_id
    this.username = username
    this.name = name
    this.password_hash = password_hash
  }
}
  
module.exports = User



