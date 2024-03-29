const jwt = require('jsonwebtoken')
const generateToken =  (user,expiry,secret) =>{
   
    const token = jwt.sign(user,secret,{expiresIn:expiry});
    return token
}

module.exports = {generateToken}