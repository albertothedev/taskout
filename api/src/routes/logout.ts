import express from "express";

module.exports = (app: express.Application) =>
  app.get("/logout", (req: express.Request, res: express.Response) => {
    res.clearCookie("jwt");
    res.status(200).end();
  });
