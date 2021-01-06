import { Request, Response } from "express";
const Express = require("express");

import AuthService from '../service/AuthService';
import Service from '../service/JobService';
const JobRoutes = Express.Router();

JobRoutes.get('', (req: Request, res: Response) => {
    return Service.showJobs(req, res);
})

JobRoutes.post('', [AuthService.authenticateToken, AuthService.needsRole(['workplace'])], (req: Request, res: Response) => {
    return Service.createJob(req, res);
})

JobRoutes.delete('/', [AuthService.authenticateToken, AuthService.needsRole(['workplace'])], (req: Request, res: Response) => {
    return Service.deleteJob(req, res);
})

export default JobRoutes;