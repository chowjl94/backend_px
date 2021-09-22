const express = require('express')
const Item = require('../models/item')

module.exports = (db) => {
  const router = express.Router()
  
  router.post('/', async (req, res, next) => {
    const uid = req.uid
    const { name, quantity } = req.body
    const newItem = new Item({ name, quantity, uid })
    const item = await db.insertItem(newItem)
    res.status(201).send(item)
  })

  router.get('/', async (req, res, next) => {
    const items = await db.findAllItems()
    res.send(items)
  })

  router.get('/:id', async (req, res, next) => {
    console.log('got item of id 3 from item')
    const id = req.params.id
    const item = await db.findItem(id)
    if (item) {
      res.send(item)
    } else {
      res.status(400).send(`Item id ${id} not found`)
    }
  })

  router.get('/unique/:uid',async(req,res,next)=>{
    console.log('yes')
    const uid = req.params.uid
    const items = await db.findAllUidItems(uid)
    console.log(items)
    if (items){
      res.send(items)
    } else {
      res.status(400).send('user does not have any items')
    }
  })




  // put api can only be called by the user that created item
  router.put('/edit/:id', async (req, res, next) => {
    //this is id of user in user table 
    const uid = req.uid
    console.log(`id of user is ${uid} obtained from user log in`)
    //id of item
    const id = req.params.id
    //getting item from item id 
    const item = await db.findItem(id)
    //getting uid of item
    const uid_item = item.uid
    
    console.log(item)
    console.log(`uid of item is ${uid_item} obtained from items table`)
    if (uid===uid_item){
      const { name, quantity } = req.body
      const updatedItem = new Item({ name, quantity, uid })
      const edited_item = await db.updateItem(id, updatedItem)
      res.send(edited_item)
    }
    else{
      res.status(400).send('user cannot edit these items')
    }
  })

  router.delete('/:id', async (req, res, next) => {
    const id = req.params.id
    const success = await db.deleteItem(id)
    if (success) {
      res.send(`Deleted item ${id} successfully`)
    } else {
      res.status(400).send(`Item id ${id} not found`)
    }
  })

  return router
}