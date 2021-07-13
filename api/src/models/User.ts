import bcrypt from "bcryptjs";
import { Sequelize } from "sequelize";

module.exports = (sequelize: Sequelize, type: any) => {
  const User = sequelize.define(
    "User",
    {
      user_id: {
        type: type.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      username: {
        type: type.STRING,
        allowNull: false,
      },
      email: {
        type: type.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
          notEmpty: true,
        },
      },
      password: {
        type: type.STRING,
        allowNull: false,
      },
      confirmed: {
        type: type.BOOLEAN,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      timestamps: false,
      tableName: "user",
    }
  );

  User.beforeCreate(async (user: any) => {
    user.password = await bcrypt.hashSync(user.password, 10);
  });
  User.prototype.validatePassword = async (user: any, password: any) => await bcrypt.compare(password, user.password);

  return User;
};
