import { Request, Response } from "express";
const Express = require("express");

import Service from '../service/AuthService';
const AuthRoutes = Express.Router();

AuthRoutes.post('/login', (req: Request, res: Response) => {
    return Service.Login(req, res);
})

AuthRoutes.post('/token', (req: Request, res: Response) => {

})

AuthRoutes.delete('/logout', (req: Request, res: Response) => {

})


export default AuthRoutes;