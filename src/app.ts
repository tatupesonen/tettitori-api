//Prepare dotenv
require("dotenv").config();
const PORT = process.env.PORT || 8080;
let server: any;

import express from "express";
import Database from "./util/db";
import Logger from "./util/logger";
import Boot from "./util/boot";
import cors from "cors";
import { DB_MODE } from "./util/Constants";

//Import routes
import JobRoutes from "./route/JobRoutes";
import AuthRoutes from "./route/AuthRoutes";
import DegreeRoutes from "./route/DegreeRoutes";
import AttachmentRoutes from "./route/AttachmentRoutes";

//Only run in dev mode
import { createTestJobsAndAccounts } from "./util/createTestJobs";

//Express middleware imports
import bodyParser = require("body-parser");
import Job from "./schema/Job";
import ActivityOrientationRoutes from "./route/ActivityOrientationRoutes";
import AdminRoutes from "./route/AdminRoutes";
import logger from "./util/logger";
import RegistrationRoutes from "./route/RegisterRoutes";

//Configure express & some middleware
const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

const init = async () => {
  await Database.connect();
  await Boot.createDefaultActivityOrientations();
  await Boot.loadDegrees();
  await Boot.createDefaultRoles();
  await Boot.createAdminUser();
  logger.info(`Got env vars: ${process.env.ACCESS_TOKEN_SECRET}
  ${process.env.RECAPTCHA_SECRET}`);
  if (process.env.DB_MODE === DB_MODE.ETHEREAL)
    await createTestJobsAndAccounts();
};

const apiUrl = "/api";
//Register all the routes
app.use(apiUrl + "/job", JobRoutes);
app.use(apiUrl + "/degree", DegreeRoutes);
app.use(apiUrl + "/attachment", AttachmentRoutes);
app.use(apiUrl + "/orientation", ActivityOrientationRoutes);
app.use(apiUrl + "/admin", AdminRoutes);
app.use(apiUrl + "/register", RegistrationRoutes);
app.use(apiUrl, AuthRoutes);
//Wait for server staret before we give it to the test suite
init().then(() => {
  server = app.listen(PORT, () => {
    Logger.info(`Service started on port ${PORT}!`);
    app.emit("started");
  });
});

export default app;
