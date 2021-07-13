import { Sequelize } from "sequelize";

module.exports = (sequelize: Sequelize, type: any) =>
  sequelize.define(
    "habit",
    {
      habit_id: {
        type: type.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      description: {
        type: type.STRING,
        allowNull: false,
      },
      schedule: {
        type: type.STRING,
        allowNull: false,
      },
      completions: {
        type: type.INTEGER,
        allowNull: false,
      },
      daily: {
        type: type.DATEONLY,
        allowNull: true,
        defaultValue: null,
      },
      user_id: {
        type: type.INTEGER,
        allowNull: false,
      },
    },
    {
      timestamps: false,
      tableName: "habit",
    }
  );
