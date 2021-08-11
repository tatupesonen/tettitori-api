// Imports
import { Request, Response } from "express";
import Service from "../service/ActivityOrientationService";
const Express = require("express");

const ActivityOrientationRoutes = Express.Router();
// Route controller
ActivityOrientationRoutes.get("", (req: Request, res: Response) => {
  return Service.showActivityOrientations(req, res);
});

export default ActivityOrientationRoutes;
