import { Request, Response } from "express";

const Express = require("express");
import Service from '../service/JobService';
const JobRoutes = Express.Router();

JobRoutes.get('', (req: Request, res: Response) => {
    return Service.showJobs(req, res);
})

JobRoutes.post('', (req: Request, res: Response) => {
    return Service.createJob(req, res);
})

export default JobRoutes;