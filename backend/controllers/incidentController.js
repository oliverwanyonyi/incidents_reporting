const { validationResult } = require("express-validator");
const {
  Incident,
  Incident_Upload,
  Incident_FollowUp,
  User,
  Notification,
  NotificationUser,
  Role,
  Ward_Authority,
} = require("../models");

const reportIncident = async (req, res, next) => {
  const agents_online = req.agents_online;
  const ward_authorities = req.ward_authorities;
  const io = req.io;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: errors.array(),
    });
  }
  try {
    let incident;
    if (req.body.reporter_id) {
      incident = await Incident.create({
        ...req.body,
        reporter_id: req.body.reporter_id,
      });
    } else {
      incident = await Incident.create(req.body);
    }

    for (const image of req.files) {
      await Incident_Upload.create({
        incident_id: incident.id,
        file_path: image.path,
      });
    }

    const notif_targets = await User.findAll({
      where: {
        ward: req.body.ward,
      },
      include: [
        { model: Role, where: { name: "ward-admin" } },
        {
          model: Ward_Authority,
          where: { designation: req.body.incident_type },
        },
      ],
    });

    const userIds = notif_targets.map((user) => user.dataValues.id);

    const promises = userIds.map((userId) => {
      return Notification.create({
        initiator_id: req.body.reporter_id,
        message: `New Incident Reported`,
        receiver_id: userId,
      });
    });

    await Promise.all(promises);

    const ward_admins_online = [...ward_authorities.values()].filter(
      (agent) =>
        agent.ward === +req.body.ward &&
        agent.designation === req.body.incident_type
    );

    ward_admins_online.forEach((admin) => {
      const socket = admin.socket_id;

      io.to(socket).emit("new_incident_notif", {
        message: notification.message,
        read: false,
        id: notification.id,
      });
    });
    res.send("Your Incident has been reported successfully");
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const retrieveIncidents = async (req, res, next) => {
  const {
    county,
    sub_county,
    ward,
    page,
    perPage = 5,
    designation,
  } = req.query;

  try {
    if (page) {
      const isWardAdmin = req.user.roles
        .map((role) => role.name)
        .includes("ward-admin");
      let condition = {
        county: county,
        ward: ward,
        sub_county: sub_county,
        incident_type: designation,
      };
      console.log(req.user.id, isWardAdmin, designation);

      if (!isWardAdmin) {
        condition = { assignedTo: req.query.user_id };
      }

      let { rows: incidents, count } = await Incident.findAndCountAll({
        where: condition,
        include: [{ model: Incident_Upload }],
        order: [["createdAt", "DESC"]],
        offset: (page - 1) * perPage,
        limit: perPage,
      });
      return res.json({ pageCount: Math.ceil(count / perPage), incidents });
    } else {
      const incidents = await Incident.findAll();

      return res.json(incidents);
    }
  } catch (error) {
    next(error);
  }
};

const retrieveUserIncidents = async (req, res, next) => {
  try {
    const { page = 1, perPage = 10 } = req.query;

    let { rows: incidents, count } = await Incident.findAndCountAll({
      where: {
        reporter_id: req.user.id,
      },
      include: [{ model: Incident_Upload }],

      order: [["createdAt", "DESC"]],
      offset: (page - 1) * perPage,
      limit: perPage,
    });

    return res.json({ pageCount: Math.ceil(count / perPage), incidents });
  } catch (error) {
    next(error);
  }
};

const updateFollowUp = async (req, res, next) => {
  try {
    const users_online = req.users_online;
    const io = req.io;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json(errors);
    }

    if (req.body.description) {
      await Incident_FollowUp.create({
        incident_id: req.params.incidentId,
        description: req.body.description,
      });
    }
    const incident = await Incident.findOne({
      where: { id: req.params.incidentId },
    });

    incident.status = req.body.status;

    await incident.save();

    if (incident.reporter_id) {
      const notif = await Notification.create({
        initiator_id: req.user.id,
        receiver_id: incident.reporter_id,
        message: "You have new follow up update for an incident you reported",
      });

      const user_socket = users_online.find(
        (user) => user.id === incident.reporter_id
      )?.socket_id;

      if (user_socket) {
        io.to(user_socket).emit("new_incident_notif", {
          message: notif.message,
          read: false,
          id: notif.id,
        });
      }
    }

    return res.send("Incident updated successfully.");
  } catch (error) {
    next(error);
  }
};

async function updateNotification(req, res, next) {
  try {
    await Notification.update(
      { read: true },
      { where: { id: req.params.notifId } }
    );
    res.send("notification updated");
  } catch (error) {
    next(error);
  }
}

module.exports = {
  reportIncident,
  retrieveIncidents,
  retrieveUserIncidents,
  updateFollowUp,
  updateNotification,
};
