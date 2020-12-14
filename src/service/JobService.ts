import { Request, Response } from 'express';
import Mongoose from 'mongoose';
import Logger from '../util/logger';
import Job from '../schema/Job';
import * as validator from 'express-validator';

//Import objectID Checker from mongoose
const isValid = Mongoose.Types.ObjectId.isValid;

const listAllJobs = async (req: Request, res: Response) => {
    let list = await Job.find().lean();
    return res.status(200).json(list);
}

const listSingleJob = async (req: Request, res: Response) => {
    let filterObject: any = {
    };

    if (req.query.id) {
        filterObject._id = req.query.id;
    }
    if (req.query.name) {
        filterObject.name = req.query.name;
    }

    let job: any = {};

    if (isValid(filterObject._id)) {
        job = await Job.findOne(filterObject).lean();
    } else {
        Logger.warn(`Request came with malformed ObjectID from ${req.connection.remoteAddress}`);
    }
    if (!job) {
        return res.status(204).json({
            message: "Could not find a job with given id!"
        })
    }

    return res.status(200).json(job);
}

const showJobs = async (req: Request, res: Response) => {

    //If no queryid or name, list all
    if (!req.query.id && !req.query.name) {
        return listAllJobs(req, res);
    }
    if (req.query.id || req.query.name) {
        return listSingleJob(req, res);
    }
}

const createJob = async (req: Request, res: Response) => {
    let jobdata = req.body;
    if (!isValidJobBody) {
        Logger.warn(`${req.connection.remoteAddress} tried to create a malformed job!`);
        return res.status(400).json({
            message: "Missing fields in job creation"
        })
    }

    let job = new Job(jobdata);
    let item = await job.save();
    if (!item) {
        Logger.error(`Could not save a new job!!`)
        res.status(400).json({
            message: "Job creation error"
        })
    }

    Logger.info("New job created!");
    res.status(201).json({
        _id: item._id
    })
}

const isValidJobBody = (body: any): boolean => {
    if (!body)
        return false;
    if (typeof body.title !== "string" || typeof body.body !== "string")
        return false;

    return true;
}


export default {
    showJobs,
    createJob
}