import { Request, Response } from "express";
import Attachment from "../schema/Attachment";

const sendAttachment = async (req: Request, res: Response) => {
  let body = req.body;
  let attachment = await Attachment.find({ _id: body.id }).lean();
};

const uploadAttachment = async (req: Request, res: Response) => {};

export default {
  sendAttachment,
  uploadAttachment,
};
