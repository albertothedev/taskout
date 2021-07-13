import passport from "passport";
import express from "express";

const { Habit, Task, Event } = require("../config/sequelize");

module.exports = (app: express.Application) =>
  app.post("/updateItem", passport.authenticate("jwt", { session: false }), (req: any, res: express.Response) => {
    switch (req.body.data.item) {
      case "habits":
        Habit.findOne({
          where: { habit_id: req.body.data.value.habit_id },
        })
          .then((habit: any) =>
            habit
              .update(req.body.data.value)
              .then(() => res.status(200).end())
              .catch((err: any) => console.error(err))
          )
          .catch((err: any) => console.error(err));
        break;

      case "tasks":
        Task.findOne({
          where: { task_id: req.body.data.value.task_id },
        })
          .then((task: any) =>
            task
              .update(req.body.data.value)
              .then(() => res.status(200).end())
              .catch((err: any) => console.error(err))
          )
          .catch((err: any) => console.error(err));
        break;

      case "events":
        Event.findOne({
          where: { event_id: req.body.data.value.event_id },
        })
          .then((event: any) =>
            event
              .update(req.body.data.value)
              .then(() => res.status(200).end())
              .catch((err: any) => console.error(err))
          )
          .catch((err: any) => console.error(err));
        break;
    }
  });
