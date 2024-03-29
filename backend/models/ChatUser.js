module.exports = (sequelize, Sequelize) => {
  const chat_user = sequelize.define(
    "chat_users",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "users", 
          key: "id",
        },
        onDelete: "CASCADE",
      },
      chat_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "chats",
          key: "id",
        },
        onDelete: "CASCADE",
      },
    },
    { timestamps: false }
  );

  return chat_user;
};
