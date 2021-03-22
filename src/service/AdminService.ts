import { Request, Response } from "express";
import Job, { JobDoc } from "../schema/Job";
import Role from "../schema/Role";
import User from "../schema/User";
import logger from "../util/logger";

const getAllUsers = async (req: Request, res: Response) => {
  const users = await User.find({}).select("-password").lean();
  return res.status(200).json(users);
};

const deleteUser = async (req: Request, res: Response) => {
  let userIdToBeRemoved = req.query.id;
  try {
    //prevent admins from deleting themselves
    let adminRole = await Role.findOne({ isAdmin: true });
    //Find the user to be deleted and check if it is NOT an admin

    //first remove all the job notices associated with the user
    let deletedJobs = await Job.deleteMany({ author: userIdToBeRemoved });

    const deletedUser = await User.findOneAndDelete({ _id: userIdToBeRemoved });
    logger.warn(`Admin is deleting user ${userIdToBeRemoved}`);

    return res.status(200).json({ message: "User deleted as admin" });
  } catch (err: any) {
    throw new Error(err);
  }
};

export default { getAllUsers, deleteUser };
