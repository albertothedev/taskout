import passport from "passport";
import express from "express";

module.exports = (app: express.Application) =>
  app.get("/dashboard", (req: express.Request, res: express.Response, next: express.NextFunction) =>
    passport.authenticate("JWTFromCookie", async (err, user, info) => {
      if (err) return res.status(500).end();

      if (!user) return res.status(401).end();

      if (user) {
        let items: any = { tasks: [], habits: [], events: [] };

        await user
          .getHabits({
            order: [["habit_id", "ASC"]],
          })
          .then((habits: any) => habits.forEach((habit: any) => items.habits.push(habit.dataValues)));

        await user
          .getTasks({
            order: [["task_id", "ASC"]],
          })
          .then((tasks: any) => tasks.forEach((task: any) => items.tasks.push(task.dataValues)));

        await user
          .getEvents({
            order: [["event_id", "ASC"]],
          })
          .then((events: any) => events.forEach((event: any) => items.events.push(event.dataValues)));

        return res.status(200).send(items).end();
      }
    })(req, res, next)
  );
