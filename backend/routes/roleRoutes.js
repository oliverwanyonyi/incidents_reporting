const { addRole, retrieveRoles } = require("../controllers/rolesController");
const { Role } = require("../models");

const router = require("express").Router();

router.route("/add").post(addRole);

router.delete("/:roleId/delete", async (req, res, next) => {
  try {
    await Role.destroy({ where: { id: req.params.roleId } });

    res.send("role removed");
  } catch (error) {
    next(error);
  }
});
router.route("/").get(retrieveRoles);

module.exports = router;
