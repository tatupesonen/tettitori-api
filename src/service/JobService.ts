import { Request, Response } from "express";
import Mongoose from "mongoose";
import Logger from "../util/logger";
import Job from "../schema/Job";
import User from "../schema/User";

//Import objectID Checker from mongoose
const isValid = Mongoose.Types.ObjectId.isValid;

// Handler to fetch all jobs. Responds to the HTTP GET with a list of jobs in a JSON format.
const listAllJobs = async (req: Request, res: Response) => {
  let list = await Job.find()
    // Populate relation fields
    .populate("relevantDegrees")
    .populate("relevantOrientations")
    .lean();
  return res.status(200).json(list);
};

// Get one job with query.
const listSingleJob = async (req: Request, res: Response) => {
  let filterObject: any = {};

  // Create filter for Mongoose
  if (req.query.id) {
    filterObject._id = req.query.id;
  }
  if (req.query.name) {
    filterObject.name = req.query.name;
  }

  let job: any = {};

  // Check the passed ObjectID is valid
  if (isValid(filterObject._id)) {
    job = await Job.findOne(filterObject)
      .populate("relevantDegrees")
      .populate("relevantOrientations")
      .lean();
  } else {
    Logger.warn(
      `Request came with malformed ObjectID from ${req.connection.remoteAddress}`
    );
  }
  if (!job) {
    return res.status(204).json({
      message: "Could not find a job with given id!",
    });
  }

  return res.status(200).json(job);
};

// Send all jobs if no params, find with query if params.
const showJobs = async (req: Request, res: Response) => {
  //If no queryid or name, list all
  if (!req.query.id && !req.query.name) {
    return listAllJobs(req, res);
  }
  if (req.query.id || req.query.name) {
    return listSingleJob(req, res);
  }
};

// Service handler to create a new job posting.
const createJob = async (req: any, res: Response) => {
  // Get data from req.body;
  let jobdata = req.body;
  // Check that the user is valid and exists in database
  let user = await User.findOne({ username: req.user?.username });
  // Set relation on Job to the user creating it.
  jobdata.author = user?._id;
  // Also assing displayName, currently unused.
  jobdata.authorDisplayName = user?.username;

  // Validate job body
  if (!isValidJobBody(jobdata)) {
    Logger.warn(
      `${req.connection.remoteAddress} tried to create a malformed job!`
    );
    return res.status(400).json({
      message: "Missing fields in job creation",
    });
  }
  // Perform saving
  try {
    let job = new Job(jobdata);
    let item = await job.save();
    if (!item) {
      Logger.error(`Could not save a new job!!`);
      return res.status(400).json({
        message: "Job creation error",
      });
    }

    Logger.info(`${user?.username} created a new job!`);
    // Successful safe, respond with created item ID.
    return res.status(201).json({
      _id: item._id,
    });
  } catch (err) {
    return res.status(500);
  }
};

// Same as previous but check that there is an existing post.
const editJob = async (req: any, res: Response) => {
  const { id } = req.query;
  let jobdata = req.body;
  let user = await User.findOne({ username: req.user?.username });

  // Check that the user is editing his own notice, unless admin.

  jobdata.author = user?._id;
  jobdata.authorDisplayName = user?.username;

  if (!isValidJobBody(jobdata)) {
    Logger.warn(
      `${req.connection.remoteAddress} tried to create a malformed job!`
    );
    return res.status(400).json({
      message: "Missing fields in job editing",
    });
  }
  try {
    // Only find jobs that this user created.
    const done = await Job.findOneAndUpdate(
      { _id: id, author: user?._id },
      jobdata
    );
    if (!done) {
      Logger.error(`Could not edit job`);
      return res.status(400).json({
        message: "Job editing error",
      });
    }

    Logger.info(`${user?.username} edited new job!`);
    return res.status(201).json();
  } catch (err) {
    return res.status(500);
  }
};

// Deletes a job
const deleteJob = async (req: any, res: Response) => {
  let id = req.query.id;
  if (!id) {
    Logger.error("Illegal job id");
    return res.status(400).json({
      message: "Illegal ID",
    });
  }
  let user = req.user;
  //Only allow users to delete jobs created by them
  if (user) {
    //if the user is in the jwt, find the user in DB so we can get the id.
    let dbuser = await User.findOne({ username: user.username }).lean();

    //admin mode deletion
    if (user.role === "admin") {
      Logger.warn(`Deleting ${id} as admin`);
      let deleteResult = await Job.findOneAndDelete({ _id: id }).lean();
      console.log(deleteResult);
      if (deleteResult)
        return res.status(200).json({ message: "Job deleted as admin" });
    }

    // Only find jobs where the author is the same user deleting
    let deleteResult = await Job.findOneAndDelete({
      _id: id,
      author: dbuser._id,
    }).lean();
    if (deleteResult) {
      Logger.info(`${user.username} deleted job ${deleteResult._id}`);
      return res.status(200).json({
        message: "Job deleted",
      });
    }
  }
  return res.status(404).json({
    message: "Couldn't find job for this author with given ID",
  });
};

// Function to validate job body, returns boolean based on validity.
const isValidJobBody = (jobBody: any): boolean => {
  console.log(jobBody);
  if (
    !jobBody ||
    !jobBody.title ||
    !jobBody.body ||
    !jobBody.body.description ||
    !jobBody.author
  )
    return false;
  return true;
};

export default {
  showJobs,
  createJob,
  deleteJob,
  editJob,
};
