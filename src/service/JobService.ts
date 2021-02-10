import { Request, Response } from "express";
import Mongoose from "mongoose";
import Logger from "../util/logger";
import Job from "../schema/Job";
import User from "../schema/User";

//Import objectID Checker from mongoose
const isValid = Mongoose.Types.ObjectId.isValid;

const listAllJobs = async (req: Request, res: Response) => {
  let list = await Job.find().populate("relevantDegrees").lean();
  return res.status(200).json(list);
};

const listSingleJob = async (req: Request, res: Response) => {
  let filterObject: any = {};

  if (req.query.id) {
    filterObject._id = req.query.id;
  }
  if (req.query.name) {
    filterObject.name = req.query.name;
  }

  let job: any = {};

  if (isValid(filterObject._id)) {
    job = await Job.findOne(filterObject).populate("relevantDegrees").lean();
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

const showJobs = async (req: Request, res: Response) => {
  //If no queryid or name, list all
  if (!req.query.id && !req.query.name) {
    return listAllJobs(req, res);
  }
  if (req.query.id || req.query.name) {
    return listSingleJob(req, res);
  }
};

const createJob = async (req: any, res: Response) => {
  let jobdata = req.body;
  console.log(jobdata);
  let user = await User.findOne({ username: req.user?.username });
  jobdata.author = user?._id;
  jobdata.authorDisplayName = user?.username;

  if (!isValidJobBody(jobdata)) {
    Logger.warn(
      `${req.connection.remoteAddress} tried to create a malformed job!`
    );
    return res.status(400).json({
      message: "Missing fields in job creation",
    });
  }

  let job = new Job(jobdata);
  let item = await job.save();
  if (!item) {
    Logger.error(`Could not save a new job!!`);
    return res.status(400).json({
      message: "Job creation error",
    });
  }

  Logger.info(`${user?.username} created a new job!`);
  return res.status(201).json({
    _id: item._id,
  });
};

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
    user = await User.findOne({ username: user.username }).lean();

    let deleteResult = await Job.findOneAndDelete({
      _id: id,
      author: user._id,
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

const isValidJobBody = (jobBody: any): boolean => {
  console.log(jobBody);
  if (!jobBody || !jobBody.title || !jobBody.body || !jobBody.body.description)
    return false;
  return true;
};

export default {
  showJobs,
  createJob,
  deleteJob,
};
