import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy } from "passport-jwt";
import express from "express";

const { User } = require("./sequelize");

passport.use(
  "signIn",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    (email, password, done) =>
      User.findOne({ where: { email } })
        .then((user: any) => {
          if (user)
            if (user.validatePassword(user, password)) return done(null, user);
            else return done(null, user);
          else return done(null, false, { message: "Incorrect username." });
        })
        .catch((err: any) => console.error(err))
  )
);

passport.use(
  "signUp",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    (req, email, password, done) =>
      User.findOne({ where: { email: email } }).then((user: any) => {
        if (!user)
          User.create({
            username: req.body.username,
            email: email,
            password: password,
          })
            .then((user: any) => {
              return done(null, user);
            })
            .catch((err: any) => console.error(err));
        else if (user) return done(null, false, { message: "Email already in use" });
      })
  )
);

passport.use(
  "trial",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    (req, email, password, done) => {
      User.create({
        username: req.body.username,
        email,
        password,
        confirmed: 1,
      })
        .then((user: any) => {
          return done(null, user);
        })
        .catch((err: any) => console.error(err));
    }
  )
);

const extractJwt = require("passport-jwt").ExtractJwt;

passport.use(
  "JWTFromCookie",
  new JwtStrategy(
    {
      jwtFromRequest: (req: express.Request) => req.cookies.jwt,
      secretOrKey: process.env.TASKOUT_JWT_SECRET,
      passReqToCallback: true,
    },
    (req: any, jwtPayload: any, done: any) =>
      User.findOne({ where: { user_id: jwtPayload.user_id } })
        .then((user: any) => done(null, user))
        .catch((err: any) => done(err))
  )
);

passport.use(
  "JWTFromURLQueryParameter",
  new JwtStrategy(
    {
      jwtFromRequest: extractJwt.fromUrlQueryParameter("jwt"),
      secretOrKey: process.env.TASKOUT_JWT_SECRET,
      passReqToCallback: true, // Without this it crashes
    },
    (req: any, jwtPayload: any, done: any) =>
      User.findOne({ where: { user_id: jwtPayload.user_id } })
        .then((user: any) => done(null, user))
        .catch((err: any) => done(err))
  )
);
