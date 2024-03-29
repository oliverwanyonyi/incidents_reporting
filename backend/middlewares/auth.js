const jwt = require('jsonwebtoken');
const { User, Role } = require('../models');

const checkRole = (requiredRole) => async (req, res, next) => {
    const user = req.user;
    try {
      if (!user || !user.roles.some((role) => role.name === requiredRole)) {
        res.status(403);
        throw new Error("Unauthorized");
      }
      next();
    } catch (error) {
      next(error);
    }
  };


  const protect = (req, res, next) => {
    try {
      let token = req.headers["authorization"];
      token = token?.split(" ")[1]; 
      jwt.verify(token, process.env.ACCESS_SECRET, async (err, payload) => {
        if (!err) {
        
          
          const user = await User.findOne({
            where: { id: payload.id },
           
            include: [{ model: Role, attributes: ["name", "id"] }],
          });
          if (!user) {
            res.status(404);
            const error = new Error("User not found");
            next(error);
          }
          req.user = user;
          next();
        } else {
          res.status(401);
          const error = new Error("Unauthorized");
          next(error);
        }
      });
    } catch (error) {
      next(error);
    }
  };


 

  module.exports = {checkRole,protect}