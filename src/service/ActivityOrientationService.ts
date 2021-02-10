import { Request, Response } from "express";
import ActivityOrientation from "../schema/ActivityOrientation";

const showActivityOrientations = async (req: Request, res: Response) => {
  let orientations = await ActivityOrientation.find({});
  return res.json(orientations);
};

export default {
  showActivityOrientations,
};
