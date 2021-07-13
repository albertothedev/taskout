import passport from "passport";
import jwt from "jsonwebtoken";
import express from "express";

module.exports = (app: express.Application) =>
  app.post(
    "/signIn",
    (req: express.Request, res: express.Response, next: express.NextFunction) =>
      passport.authenticate("signIn", (err, user, info) => {
        if (err) return next(err);

        if (info) res.status(200).json({ msg: info.msg });

        if (user) {
          const token = jwt.sign(
            { user_id: user.dataValues.user_id },
            process.env.TASKOUT_JWT_SECRET as string
          );

          res.cookie("jwt", token);

          if (user.confirmed)
            req.login(user, { session: false }, (err) => {
              if (err) res.send(err);

              return res.status(200).json({ user });
            });
          else if (!user.confirmed)
            return res.status(400).send("Please confirm your registration");
        }
      })(req, res, next)
  );
