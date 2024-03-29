
module.exports = function (sequelize,Sequelize){
    const incident_follow_ups = sequelize.define('incident_follow_ups',{
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
          },
          description: {
            type: Sequelize.TEXT,
            allowNull: false,
          },
          incident_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
              model: 'incidents',
              key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
          },
          createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
            defaultValue: Sequelize.fn('NOW'),
          },
          updatedAt: {
            allowNull: false,
            type: Sequelize.DATE,
            defaultValue: Sequelize.fn('NOW'),
          },
    })

    return incident_follow_ups
}