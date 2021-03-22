import { Request, Response } from "express";
import Job, { JobDoc } from "../schema/Job";
import Role, { IRole } from "../schema/Role";
import User, { IUser } from "../schema/User";
import logger from "../util/logger";

const getAllUsers = async (req: Request, res: Response) => {
  const users = await User.find({}).select("-password").lean();
  return res.status(200).json(users);
};

const deleteUser = async (req: Request, res: Response) => {
  let userIdToBeRemoved = req.query.id;
  try {
    //prevent admins from deleting themselves
    let adminRole = await Role.findOne({ isAdmin: true }).lean();
    //Find the user to be deleted and check if it is NOT an admin
    let userToBeRemoved = (await User.findOne({ _id: userIdToBeRemoved })
      .populate("role")
      .lean()) as IUser;
    let userToBeRemovedRole = userToBeRemoved.role as IRole;
    if (!userToBeRemoved)
      return res
        .status(404)
        .json({ message: "Couldn't find user for given user ID" });
    if (userToBeRemovedRole.isAdmin)
      return res.status(418).json({ message: "Can't remove yourself" });
    //first remove all the job notices associated with the user
    let deletedJobs = await Job.deleteMany({
      author: userIdToBeRemoved,
    }).lean();

    const deletedUser = await User.findOneAndDelete({
      _id: userIdToBeRemoved,
    }).lean();
    logger.warn(`Admin is deleting user ${userIdToBeRemoved}`);

    return res.status(200).json({ message: "User deleted as admin" });
  } catch (err: any) {
    throw new Error(err);
  }
};

const createUser = async (req: Request, res: Response) => {
  let { body } = req;
  //get workplace role
  const workplaceRole = (await Role.findOne({
    name: "workplace",
  }).lean()) as IRole;

  if (!body.username && !body.password && !body.email)
    return res.status(400).json({ message: "Missing fields in user body" });
  const password = Math.random().toString(36).slice(-11);
  //check that the given username doesn't already exist
  const exists = await User.exists({ username: body.username });
  if (exists)
    return res
      .status(409)
      .json({ message: "User with this username already exists" });
  const userdata = {
    password: password,
    username: body.username,
    email: body.email,
    role: workplaceRole._id,
  } as IUser;

  const user = new User(userdata);
  let userInDb = await user.save();
  if (userInDb) {
    logger.info("User created:", userdata.username);
    return res.status(201).json(userdata);
  }
  return res.status(500).json({ message: "Database connection failed" });
};

export default { getAllUsers, deleteUser, createUser };
