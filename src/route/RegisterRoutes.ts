import { Request, Response } from "express";
import Service from "../service/RegistrationService";
const Express = require("express");

const RegistrationRoutes = Express.Router();

RegistrationRoutes.post("", (req: Request, res: Response) => {
  return Service.RegisterUser(req, res);
});

export default RegistrationRoutes;
