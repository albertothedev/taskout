import passport from "passport";
import express from "express";

module.exports = (app: express.Application) =>
  app.get("/isUser", (req: express.Request, res: express.Response, next: express.NextFunction) =>
    passport.authenticate("JWTFromCookie", async (err, user, info) => {
      if (err) return next(err);

      if (!user || !user.dataValues.confirmed) return res.status(400).end();

      if (user && user.dataValues.confirmed) return res.status(200).end();
    })(req, res, next)
  );
