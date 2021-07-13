require("dotenv").config();

import express from "express";
import cors from "cors";
import passport from "passport";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    credentials: true,
    origin: process.env.TASKOUT_UI_URL || "http://localhost:8080",
  })
);
app.use(cookieParser());
app.use(passport.initialize());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

require("./config/passport");

require("./routes/trial")(app);
require("./routes/signUp")(app);
require("./routes/signIn")(app);
require("./routes/dashboard")(app);
require("./routes/confirmEmail")(app);
require("./routes/isUser")(app);
require("./routes/logout")(app);
require("./routes/recoverPassword")(app);
require("./routes/addItem")(app);
require("./routes/deleteItem")(app);
require("./routes/updateItem")(app);

app.listen(process.env.TASKOUT_PORT || 5003, () => console.log(`Listening on PORT ${process.env.TASKOUT_PORT || 5003}`));
