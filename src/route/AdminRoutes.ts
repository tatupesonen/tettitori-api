// Imports
import { Request, Response } from "express";
import Service from "../service/AdminService";
import AuthService from "../service/AuthService";

const Express = require("express");
const AdminRoutes = Express.Router();

// Register route handlers
AdminRoutes.get(
  "/user",
  // Define middleware and required roles for route
  [AuthService.authenticateToken, AuthService.needsRole(["admin"])],
  (req: Request, res: Response) => {
    return Service.getAllUsers(req, res);
  }
);

AdminRoutes.delete(
  "/user",
  [AuthService.authenticateToken, AuthService.needsRole(["admin"])],
  (req: Request, res: Response) => {
    return Service.deleteUser(req, res);
  }
);

AdminRoutes.post(
  "/user",
  [AuthService.authenticateToken, AuthService.needsRole(["admin"])],
  (req: Request, res: Response) => {
    return Service.createUser(req, res);
  }
);

export default AdminRoutes;
