const { signup, login, reporterSignup, tokenRefresh, updateProfile } = require("../controllers/authController");
const {body} = require('express-validator');
const db = require("../models");
const {Role,User} = db
const bcryptjs = require("bcryptjs");
const { protect } = require("../middlewares/auth");
const router = require("express").Router();

router
  .route("/authority/signup")
  .post(
    [
    body("full_name").notEmpty().withMessage("This field is required"),
      body("email").isEmail().normalizeEmail().withMessage("Invalid Email"),
      body("phone").notEmpty().withMessage("This field is required"),
      body("password").isLength({ min: 8 }).withMessage("Password should be atleast 8 characters"),
      body("position").notEmpty().withMessage("This field is required"),
      body("designation").notEmpty().withMessage("This field is required"),
      body("county").notEmpty().withMessage("This field is required"),
      body("sub_county").notEmpty().withMessage("This field is required"),
      body("ward").notEmpty().withMessage("This field is required")

    ],
    signup
  );

  router.route('/admin/seed').get(async(req,res,next)=>{
try {
  const role = await Role.findOne({where:{
    name:"system-admin"}
  })
 const user =  await User.create({
     full_name:"Oliver Wanyonyi",
     phone:"0741237462",
     email:"olivered202@gmail.com",
     password:bcryptjs.hashSync('123456',10)
  })

await user.addRole(role)

res.send("User Seeded")
  
} catch (error) {

  next(error)
}
    

  })


  router.route('/reporter/signup').post( [
    body("full_name").notEmpty().withMessage("This field is required"),
    body("phone").notEmpty().withMessage("This field is required"),
    body("email").isEmail().normalizeEmail().withMessage("Invalid Email"),
    body("password").isLength({ min: 8 }).withMessage("Password should be atleast 8 characters"),
    body("county").notEmpty().withMessage("This field is required"),
    body("sub_county").notEmpty().withMessage("This field is required"),
    body("ward").notEmpty().withMessage("This field is required")

  ],reporterSignup)

router.route("/login").post(login);

router.get('/token/refresh', tokenRefresh)

router.post('profile/update', protect, [
body("full_name").notEmpty().withMessage("This field is required"),
body("email").isEmail().normalizeEmail().withMessage("Invalid Email"),
body("phone").notEmpty().withMessage("This field is required"),
]

,updateProfile)

// await axiosPrivate.delete(`/auth/user/${user}/delete`)
// message = "County Authority Deleted"
// }else{
// await axiosPrivate.put(`/auth/user/${user.id}/activate`, {active: user.value})
// message = 'County Authority Updated'

router.delete('/user/:userId/delete', async(req,res,next)=>{
  try {

    const user  = await User.findOne({where:{id:req.params.userId}})

    await user.destroy()

    res.send('user deleted')
    
  } catch (error) {
    next(error)
  }
} )

router.put('/user/:userId/activate', async (req,res,next)=>{
  try {

    console.log(req.params.userId);

    await User.update(req.body, {where:{id:req.params.userId}})

    res.send("user activated")
    
  } catch (error) {
    next(error)
  }
})

module.exports = router;
