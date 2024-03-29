const Sequelize = require("sequelize");

require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.HOST,
    dialect: process.env.DB_DIALECT,
    port: process.env.DB_PORT,
    logging: false,
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require("./User")(sequelize, Sequelize);
db.Role = require("./Role")(sequelize, Sequelize);
db.Ward_Authority = require("./Ward_Authority")(sequelize, Sequelize);
db.Incident = require("./Incident")(sequelize, Sequelize);
db.Incident_Upload = require("./Incident_Upload")(sequelize, Sequelize);
db.Chat = require("./Chat")(sequelize, Sequelize);
db.Message = require("./Message")(sequelize, Sequelize);
db.User.belongsToMany(db.Role, { through: "userRole" });
db.ChatUser = require("./ChatUser")(sequelize, Sequelize);

db.Notification = require("./Notification")(sequelize, Sequelize);

db.ChatUser.belongsTo(db.Chat, { foreignKey: "chat_id" });
db.Chat.hasMany(db.ChatUser, { foreignKey: "chat_id" });

db.Incident.hasMany(db.Incident_Upload, { foreignKey: "incident_id" });
db.Incident_Upload.belongsTo(db.Incident, { foreignKey: "incident_id" });


db.User.hasOne(db.Ward_Authority, { foreignKey: "user_id" });
db.Ward_Authority.belongsTo(db.User, { foreignKey: "user_id" });




db.Incident_FollowUp = require("./Incident_FollowUp")(sequelize, Sequelize);

db.Chat.hasMany(db.Message, { foreignKey: "chat_id" });
db.Message.belongsTo(db.Chat, { foreignKey: "chat_id" });
db.Message.belongsTo(db.User, { foreignKey: "sender", as: "senderInfo" });
db.Message.belongsTo(db.User, { foreignKey: "receiver", as: "receiverInfo" });

db.User.hasMany(db.ChatUser, { foreignKey: "user", as: "chatUser" });
db.ChatUser.belongsTo(db.User, { foreignKey: "user", as: "chatUser" });


db.User.hasMany(db.Incident, { foreignKey: "assignedTo" });
db.Incident.belongsTo(db.User, { foreignKey: "assignedTo" });

module.exports = db;
