import passport from "passport";
import express from "express";

const { Habit, Task, Event } = require("../config/sequelize");

module.exports = (app: express.Application) =>
  app.post("/deleteItem", passport.authenticate("jwt", { session: false }), (req: any, res: express.Response) => {
    switch (req.body.data.item) {
      case "habits":
        Habit.destroy({ where: { habit_id: req.body.data.value.habit_id } })
          .then(() => res.status(200).end())
          .catch((error: any) => console.error(error));
        break;

      case "tasks":
        Task.destroy({ where: { task_id: req.body.data.value.task_id } })
          .then(() => res.status(200).end())
          .catch((error: any) => console.error(error));
        break;

      case "events":
        Event.destroy({ where: { event_id: req.body.data.value.event_id } })
          .then(() => res.status(200).end())
          .catch((error: any) => console.error(error));
        break;
    }
  });
