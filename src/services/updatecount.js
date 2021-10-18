require('dotenv').config()



module.exports = (db) => {
    const service = {}
    service.updateCount = async ()=>{
        const finished = await db.countIsFinished()        
        console.log(`Number of Finised Task is ${finished}`)
        return finished
    }
    return service
}
  
  