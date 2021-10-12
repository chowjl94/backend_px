# Using JWT , with postgres and DI refactoring to extend a CRUD app with authorisation 

### Features

###### GET /items/unique/:uid

- Retrieve all items of a specific user(uid is the unique id of user)


###### PUT /items/edit/:id

- restrict updating of the item by its user only

other users can still

- View all items created by all users
- Delete any item created by any user
