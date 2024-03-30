const {
  reportIncident,
  retrieveIncidents,
  retrieveUserIncidents,
  updateFollowUp,
  updateNotification,
} = require("../controllers/incidentController");
const path = require("path");
const { protect } = require("../middlewares/auth");
const multer = require("multer");
const { body, check } = require("express-validator");
const {
  User,
  Incident,
  Role,
  Notification,
} = require("../models");
const { Op, fn, col, literal } = require("sequelize");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); 
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

exports.upload = upload;

const router = require("express").Router();

router
  .route("/report")
  .post(
    upload.array("images", 5),
    [
      check("incident_type").notEmpty().withMessage("This field is required"),
      check("incident").notEmpty().withMessage("This field is required"),
      check("county").notEmpty().withMessage("This field is required"),
      check("sub_county").notEmpty().withMessage("This field is required"),
      check("ward").notEmpty().withMessage("This field is required"),
      check("description").notEmpty().withMessage("This field is required"),
    ],
    reportIncident
  );

router.route("/all").get(protect, retrieveIncidents);

router.route("/user").get(protect, retrieveUserIncidents);

router.route("/:incidentId/update").put(
  protect,
  [check("status").notEmpty().withMessage("This field is required")],

  updateFollowUp
);

router.route("/:incidentId/delete").delete(protect, async (req, res, next) => {
  await Incident.destroy({
    where: {
      id: req.params.incidentId,
    },
  });

  res.send("incident removed");
});

router.route("/notification/:notifId/update").put(protect, updateNotification);

router.get("/ward", async (req, res, next) => {
  try {
    const { search, county, sub_county, ward } = req.query;
    const conditions = {};

    if (search) {
      conditions[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { county: { [Op.like]: `%${search}%` } },
        { sub_county: { [Op.like]: `%${search}%` } },
        { ward: { [Op.like]: `%${search}%` } },
      ];
    }

    if (county) {
      conditions.county = county;
    }

    if (sub_county) {
      conditions.sub_county = sub_county;
    }

    if (ward) {
      conditions.ward = ward;
    }

    county.designation = req.query.designation;

    const wardAdmins = await User.findAll({
      where: conditions,

      include: [{ model: Role, where: { name: "ward-officer" } }],
      attributes: {
        include: [
          [
            literal(
              `(SELECT COUNT(*) FROM incidents WHERE incidents.assignedTo = users.id AND incidents.status = 'investigation_in_progress')`
            ),
            "underInvestigationIncidents",
          ],
          [
            literal(
              `(SELECT COUNT(*) FROM incidents WHERE incidents.assignedTo = users.id AND incidents.status = 'resolved')`
            ),
            "completedIncidents",
          ],
        ],
      },
    });

    res.json(wardAdmins);
  } catch (error) {
    next(error);
  }
});

router.put("/:id/assign", protect, async (req, res, next) => {
  try {
    const incident = await Incident.findByPk(req.params.id);
    if (!incident) {
      return res.status(404).json({ message: "Incident not found" });
    }

    const wardAdmin = await User.findByPk(req.body.user_id);
    if (!wardAdmin) {
      return res.status(404).json({ message: "Ward admin not found" });
    }

    if (incident.assignedTo) {
      return res.status(400).json({
        message: "This incident is already assigned to another authority",
      });
    }

    incident.assignedTo = req.body.user_id;

    incident.approved = true;

    incident.status = "investigation_in_progress";

    await incident.save();
    

    await Notification.create({
      initiator_id: req.user.id,
      receiver_id: req.body.user_id,
      message: "You have been asigned new incident",
    });

    res.send("success");
  } catch (error) {
    next(error);
  }
});
module.exports = router;
