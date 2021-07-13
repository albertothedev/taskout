import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  "taskout",
  process.env.TASKOUT_MYSQL_USERNAME || "taskout-user",
  process.env.TASKOUT_MYSQL_PASSWORD || "taskout-pwd",
  {
    host: process.env.TASKOUT_MYSQL_HOST || "taskout-db",
    dialect: "mysql",
    port: Number(process.env.TASKOUT_MYSQL_PORT) || 3306,
  }
);

sequelize
  .authenticate()
  .then(() => console.log("Connection has been established successfully."))
  .catch((error: any) => console.error("Unable to connect to the database:", error));

const UserModel = require("../models/User");
const TaskModel = require("../models/Task");
const HabitModel = require("../models/Habit");
const EventModel = require("../models/Event");

const User = UserModel(sequelize, Sequelize);
const Task = TaskModel(sequelize, Sequelize);
const Habit = HabitModel(sequelize, Sequelize);
const Event = EventModel(sequelize, Sequelize);

User.hasMany(Task, { as: "Tasks", foreignKey: "user_id" });
Task.belongsTo(User, { as: "User", foreignKey: "user_id" });

User.hasMany(Habit, { as: "Habits", foreignKey: "user_id" });
Habit.belongsTo(User, { as: "User", foreignKey: "user_id" });

User.hasMany(Event, { as: "Events", foreignKey: "user_id" });
Event.belongsTo(User, { as: "User", foreignKey: "user_id" });

module.exports = { User, Task, Habit, Event };
