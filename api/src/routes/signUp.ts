import passport from "passport";
import jwt from "jsonwebtoken";
import express from "express";

const sendEmail = require("../config/nodemailer");

module.exports = (app: express.Application) =>
  app.post("/signUp", (req: express.Request, res: express.Response) => {
    passport.authenticate("signUp", (err, user, info) => {
      if (err) return res.status(500).end();

      if (user)
        req.login(user, { session: false }, (err) => {
          if (err) return res.status(500).end();

          const token: string = jwt.sign({ user_id: user.dataValues.user_id.toString() }, <string>process.env.TASKOUT_JWT_SECRET, {
            expiresIn: "10m",
          });

          sendEmail(
            {
              name: "Alberto Vilches",
              email: process.env.TASKOUT_EMAIL_ACCOUNT,
            },
            user.dataValues.email,
            `<div style="background-color:#6699cc; padding: 40px 0;">
              <div style="width: 400px; background-color: white; margin: auto; padding: 40px">
                <h2 style="color: #1c5d99; margin: 0 0 15px 0; font-size: 32px;">Welcome to my website!</h2>
                <p style="margin: 0">Thank you for signing up. Please, click the link below to activate your account:</p>
                <div style="text-align: center; padding: 5px; box-sizing: border-box; width: 150px; height: 35px; margin: 15px 0; border-radius: 3px; background-color: #1c5d99;">
                  <a style="line-height: 25px; text-decoration: none; font-size: 18px; color: white;" href='http://localhost:8080/confirmEmail/${token}' target='_blank'>ACTIVATE</a>
                </div>
                <p style="margin: 0">This link will expire in 10 minutes.</p>
              </div>
            </div>`
          );

          return res.status(200).end();
        });

      if (!user) return res.status(409).end();
    })(req, res);
  });
