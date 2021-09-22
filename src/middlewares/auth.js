module.exports = (service) => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization
    // in POSTMAN we add a bearer token under authorisation
    // auth header in postmam will look like this example
    //Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIsImlhdCI6MTYzMDgwNjQ0NSwiZXhwIjoxNjMwODA3MzQ1fQ.ZDM0G58qp9fddM-gd59v__uxUWJc_ZkcyfV2MuL_bhY
    //split the token by space to get the token
    const token = authHeader && authHeader.split(' ')[1]
    // if token is valid, call service to verify the token
    if (token) {
      
      //verify token returns a UID
      const uid = service.verifyToken(token)
      if (uid !== null) {

        //has to correspond to the uid of payload in service.generateToken
        req.uid = uid
        //then call the next middleware
        return next()
      }
    }
    //only if it is verified the then it will passed to the next middleware
    res.status(401).send('Unauthorized')
  }
}