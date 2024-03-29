
module.exports = (sequelize,Sequelize) =>{

    const incident_uploads = sequelize.define('incident_uploads', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      incident_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "incidents",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      file_path: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    })

    return incident_uploads
}