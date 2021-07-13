import jwt from "jsonwebtoken";
import express from "express";

const { User } = require("../config/sequelize");
const sendEmail = require("../config/nodemailer");

module.exports = (app: express.Application) =>
  app.post("/recoverPassword", (req: express.Request, res: express.Response) =>
    User.findOne({ where: { email: req.body.data.email } })
      .then((user: any) => {
        if (user) {
          const token = jwt.sign(
            { user_id: user.dataValues.user_id.toString() },
            process.env.TASKOUT_JWT_SECRET as string,
            { expiresIn: "15m" }
          );

          sendEmail(
            {
              name: "Alberto Vilches",
              email: process.env.TASKOUT_EMAIL_ACCOUNT as string,
            },
            req.body.data.email,
            `<div style="background-color:#ff971f; padding: 40px 0;">
              <div style="width: 400px; background-color: white; margin: auto; padding: 40px">
                <h2 style="color: #ff971f; margin: 0 0 15px 0; font-size: 32px;">Password recovery</h2>
                <p style="margin: 0">You have requested a password change. Please, click the link below to reset it:</p>
                <div style="text-align: center; padding: 5px; box-sizing: border-box; width: 150px; height: 35px; margin: 15px 0; border-radius: 3px; background-color: #ff971f;">
                  <a style="line-height: 25px; text-decoration: none; font-size: 18px; color: white;" href='http://localhost:8080/resetPassword/${token}' target='_blank'>RESET</a>
                </div>
                <p style="margin: 0">This link will expire in 15 minutes.</p>
              </div>
            </div>`
          );
          res.status(200).end();
        } else res.status(404).end();
      })
      .catch((err: any) => console.error(err))
  );
