import passport from "passport";
import jwt from "jsonwebtoken";
import express from "express";

module.exports = (app: express.Application) =>
  app.post("/trial", (req: express.Request, res: express.Response) =>
    passport.authenticate("trial", (err, user, info) => {
      if (err) return res.status(500).end();

      if (info) return res.status(500).end();

      if (user)
        req.login(user, { session: false }, (err) => {
          if (err) return res.status(500).end();

          const token: string = jwt.sign({ user_id: user.dataValues.user_id.toString() }, <string>process.env.TASKOUT_JWT_SECRET);

          return res.status(200).send(token);
        });

      if (!user) return res.status(409).end();
    })(req, res)
  );
