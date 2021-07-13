module.exports = (sequelize: any, type: any) =>
  sequelize.define(
    "task",
    {
      task_id: {
        type: type.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      description: {
        type: type.STRING,
        allowNull: false,
      },
      completed: {
        type: type.BOOLEAN,
        allowNull: false,
        defaultValue: 0,
      },
      user_id: {
        type: type.INTEGER,
        allowNull: false,
      },
    },
    {
      timestamps: false,
      tableName: "task",
    }
  );
