import passport from "passport";
import express from "express";

module.exports = (app: express.Application) =>
  app.post("/addItem", (req: express.Request, res: express.Response, next: express.NextFunction) =>
    passport.authenticate("JWTFromCookie", (err, user, info) => {
      if (err) return next(err);

      if (!user) return res.redirect("/signIn");

      if (user) {
        switch (req.body.data.item) {
          case "habits":
            user
              .createHabit(req.body.data.value)
              .then((habit: any) => res.json(habit))
              .catch((error: any) => console.error(error));
            break;

          case "tasks":
            user
              .createTask(req.body.data.value)
              .then((task: any) => res.json(task))
              .catch((error: any) => console.error(error));
            break;

          case "events":
            user
              .createEvent(req.body.data.value)
              .then((evemt: any) => res.json(evemt))
              .catch((error: any) => console.error(error));
            break;
        }
      }
    })(req, res, next)
  );
