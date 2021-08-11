// Prepare dotenv, will load environment variables
require("dotenv").config();
// Get API port from environment variables or default to 8080
const PORT = process.env.PORT || 8080;

// Empty variable for server
let server: any;

// Imports
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
import ActivityOrientationRoutes from "./route/ActivityOrientationRoutes";
import AdminRoutes from "./route/AdminRoutes";
import RegistrationRoutes from "./route/RegisterRoutes";

// Utility imports
import bodyParser = require("body-parser");
import logger from "./util/logger";

//Only run in dev mode
import { createTestJobsAndAccounts } from "./util/createTestJobs";

//Configure express & some middleware
const app = express();
// Attach JSON parser and CORS middlewares
app.use(bodyParser.json());
app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// Init function, this will prepare the API
const init = async () => {
  // Connect to Mongo
  await Database.connect();
  // Scaffold default activity orientations (unused feature)
  await Boot.createDefaultActivityOrientations();
  // Load all degrees offered (unused feature)
  await Boot.loadDegrees();
  // If roles don't yet exist in DB, create them
  await Boot.createDefaultRoles();
  // Check if an admin user exists, and if not, then create one.
  await Boot.createAdminUser();
  logger.info(`Got env vars: ${process.env.ACCESS_TOKEN_SECRET}
  ${process.env.RECAPTCHA_SECRET}`);
  // If process is running in test mode, use in memory database.
  if (process.env.DB_MODE === DB_MODE.ETHEREAL)
    await createTestJobsAndAccounts();
};

// Configure API routes
const apiUrl = "/api";
//Register all the routes
app.use(apiUrl + "/job", JobRoutes);
app.use(apiUrl + "/degree", DegreeRoutes);
app.use(apiUrl + "/attachment", AttachmentRoutes);
app.use(apiUrl + "/orientation", ActivityOrientationRoutes);
app.use(apiUrl + "/admin", AdminRoutes);
app.use(apiUrl + "/register", RegistrationRoutes);
app.use(apiUrl, AuthRoutes);
//Wait for server start before we give it to the test suite
init().then(() => {
  server = app.listen(PORT, () => {
    Logger.info(`Service started on port ${PORT}!`);
    app.emit("started");
  });
});

export default app;
