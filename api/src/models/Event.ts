module.exports = (sequelize: any, type: any) =>
  sequelize.define(
    "event",
    {
      event_id: {
        type: type.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      description: {
        type: type.STRING,
        allowNull: false,
      },
      date: {
        type: type.DATE,
        allowNull: false,
      },
      user_id: {
        type: type.INTEGER,
        allowNull: false,
      },
    },
    {
      timestamps: false,
      tableName: "event",
    }
  );
