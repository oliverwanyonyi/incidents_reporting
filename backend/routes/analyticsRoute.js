const sequelize = require("sequelize");
const { Incident } = require("../models");
const db = require("../models");
const { protect } = require("../middlewares/auth");

const router = require("express").Router();

router.get("/admin", protect, async (req, res, next) => {
  try {
    const totalIncidents = await Incident.count({
      where: {
        ward: req.user.ward,
      },
    });

    // Number of incidents per incident type
    const incidentTypes = await Incident.findAll({
      where: {
        ward: req.user.ward,
      },
      attributes: [
        "incident_type",
        [sequelize.fn("COUNT", sequelize.col("incident_type")), "count"],
      ],
      group: ["incident_type"],
      raw: true,
    });

    // Count of incidents for each unique status
    const incidentStatuses = await Incident.findAll({
      where: {
        ward: req.user.ward,
      },
      attributes: [
        "status",
        [sequelize.fn("COUNT", sequelize.col("status")), "count"],
      ],
      group: ["status"],
      raw: true,
    });

    const totalUsers = await db.User.count({
      include: [
        {
          model: db.Role,
          where: {
            name: { [db.Sequelize.Op.ne]: "system-admin" }, // Exclude users with 'system-admin' role
          },
        },
      ],
    });

    const totalActiveUsers = await db.User.count({
      where: { active: true }, // Count only active users
      include: [
        {
          model: db.Role,
          where: {
            name: { [db.Sequelize.Op.ne]: "system-admin" }, // Exclude users with 'system-admin' role
          },
        },
      ],
    });

    const totalWardOfficers = await db.User.count({
      where: {
        ward: req.user.ward,
      },
      include: [
        {
          model: db.Role,
          where: { name: "ward-officer" }, // Count only users with 'ward-officer' role
        },
      ],
    });

    const anonymous = await db.Incident.count({
     
      where: { reporter_id: null,
        ward:req.user.ward }, // Count incidents where reporter_id is null
    });

    // Prepare response
    const analyticsData = {
      totalIncidents,
      incidentTypes,
      incidentStatuses,
      totalUsers,
      totalActiveUsers,
      totalWardOfficers,
      anonymous,
    };
    console.log(analyticsData);

    res.json(analyticsData);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
