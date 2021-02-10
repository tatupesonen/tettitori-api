import { Request, Response } from "express";
import Degree from "../schema/Degree";

const showDegrees = async (req: Request, res: Response) => {
  let degrees = await Degree.find({}).lean();
  res.status(200).send(degrees);
};

export default {
  showDegrees,
};
