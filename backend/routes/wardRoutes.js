const { body, validationResult } = require("express-validator");
const {
  addCounty,
  addSubLocation,
  addWard,
  retrieveCounties,
  retrieveSublocations,
  retrieveWards,
  addSubCountyAuthority,
  retrieveSubCountyAuthorities,
  retrieveWardAuthorities,
  addWardAuthority,
  authorityCountyList,
} = require("../controllers/wardController");
const { protect } = require("../middlewares/auth");
const {
  County,
  SubLocation,
  Ward,
  User,
  SubCounty_Authority,
  Ward_Authority,
} = require("../models");

const router = require("express").Router();

router.route("/ward/authority/all").get(protect, retrieveWardAuthorities);


router.route("/ward/authority/add").post(
  [
    body("full_name").notEmpty().withMessage("This field is required"),
    body("phone").notEmpty().withMessage("This field is required"),
    body("email").notEmpty().withMessage("This field is required"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password should be atleast 8 characters"),
    // body("county").notEmpty().withMessage("This field is required"),
    // body("sub_county").notEmpty().withMessage("This field is required"),
    // body("ward").notEmpty().withMessage("This field is required"),

    body("position").notEmpty().withMessage("This field is required"),
    body("designation").notEmpty().withMessage("This field is required"),
  ],
  protect,
  addWardAuthority
);

router.route("/ward/authority/:userId/update").put(
  [
    body("full_name").notEmpty().withMessage("This field is required"),
    body("phone").notEmpty().withMessage("This field is required"),
    body("email").notEmpty().withMessage("This field is required"),
    body("position").notEmpty().withMessage("This field is required"),
    body("designation").notEmpty().withMessage("This field is required"),
  ],
  protect,
  async (req, res, next) => {
    try {
      await User.update(req.body, { where: { id: req.params.userId } });

      await Ward_Authority.update(
        { designation:req.body.designation, position:req.body.position },
        { where: { user_id: req.params.userId } }
      );

      res.send("ward authority updated");
    } catch (error) {
      next(error);
    }
  }
);


router.delete("/subcounty/authority/:authId/delete", async (req, res, next) => {
  try {
    await User.destroy({ where: { id: req.params.authId } });
    res.send("User removed");
  } catch (error) {
    next(error);
  }
});


router
  .route("/ward/authority/:userId/profile")
  .get(protect, async (req, res, next) => {
    try {
      const user = await User.findOne({
        where: {
          id: req.params.userId,
        },
        include:[{model:Ward_Authority}]
      });
      res.json(user);
    } catch (error) {
      next(error);
    }
  }
  )

router.route("/authorities/all").get(authorityCountyList);

module.exports = router;
