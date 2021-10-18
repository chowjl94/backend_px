const UpdateService = require('../services/updatecount')
const db = require('../db')
const updateService = UpdateService(db)
const cron = require('node-cron')
let global


cron.schedule('*/1 * * * *',async ()=>{
    const count = await updateService.updateCount()
    global =count
    console.log(global)
})

