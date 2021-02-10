import { Request, Response } from "express";
const Express = require("express");

import AuthService from "../service/AuthService";
import Service from "../service/AttachmentService";
const AttachmentRoutes = Express.Router();

//Configure multer
import multer from "multer";
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "/src/my-images");
  },
  filename: (req, file, callback) => {
    callback(null, file.fieldname);
  },
});

AttachmentRoutes.get("/", (req: Request, res: Response) => {
  return Service.sendAttachment(req, res);
});

AttachmentRoutes.post(
  "",
  [AuthService.authenticateToken, AuthService.needsRole(["workplace"])],
  (req: Request, res: Response) => {
    return Service.uploadAttachment(req, res);
  }
);

export default AttachmentRoutes;
