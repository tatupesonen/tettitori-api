import { Request, Response } from "express";
const Express = require("express");

import Service from '../service/DegreeService'
const DegreeRoutes = Express.Router();

DegreeRoutes.get('', (req: Request, res: Response) => {
    return Service.showDegrees(req, res);
})

export default DegreeRoutes;