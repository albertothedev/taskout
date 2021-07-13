import passport from "passport";
import jwt from "jsonwebtoken";
import express from "express";

const { User } = require("../config/sequelize");

module.exports = (app: express.Application) =>
  app.get(
    "/confirmEmail/:token",
    (req: express.Request, res: express.Response, next: express.NextFunction) =>
      passport.authenticate("jwt", (err, user, info) => {
        if (!user || user.dataValues.confirmed) return res.status(400).end();

        if (user && !user.dataValues.confirmed) {
          const token = jwt.sign(
            { user_id: user.dataValues.user_id.toString() },
            <string>process.env.TASKOUT_JWT_SECRET
          );

          res.clearCookie("jwt", { path: "/confirmEmail" });

          res.cookie("jwt", token);

          User.findOne({ where: { user_id: user.dataValues.user_id } })
            .then((user: any) => user.update({ confirmed: true }))
            .catch((err: any) => next(err));

          return res.status(200).end();
        }
      })(req, res, next)
  );
