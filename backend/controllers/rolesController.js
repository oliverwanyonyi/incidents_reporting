const { Role } = require("../models")

const addRole = async(req,res,next)=>{
    try {

        for (const role of req.body.roles){
            await Role.create({
                name:role.name
            })
        }
      
        return res.send("Role added")
        
    } catch (error) {
        next(error)
    }
}

const retrieveRoles = async(req,res,next)  =>{

    const {page = 1,perPage = 10} = req.query;
    try {

        const {count, rows:roles} = await Role.findAndCountAll({
            order: [["createdAt", "DESC"]],
            offset: (page - 1) * perPage,
            limit: perPage,
        })

        res.json({
            roles,
            pageCount:(count/perPage),      
        })

    } catch (error) {
        next(error)
    }
}
module.exports = {addRole,retrieveRoles}