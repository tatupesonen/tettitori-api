import { request, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { Func } from 'mocha';
import { userInfo } from 'os';
import User from '../schema/User';
import Logger from '../util/logger';

//Generates an access token
//TODO! Add password hashing
const Login = async (req: Request, res: Response) => {
    if(req.body.password && req.body.username) {
        //try to find the user
        let user = await User.findOne({ username: req.body.username })
        .populate('role').lean();
        if(user && user.password === req.body.password) {
            Logger.info(`User ${user.username} logged in successfully!`);
            let jwtUser = { username: user.username, role: user.role.name };
            let accessToken = jwt.sign(jwtUser, process.env.ACCESS_TOKEN_SECRET!)
            return res.status(200).json({ accessToken });
        } else {
            return res.status(401).json({ message: "Wrong username or password"});
        }
    } else {
        return res.json({ message: "Missing password or username" });
    }
}

const authenticateToken = (req: any, res: Response, next: Function) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];
    if(token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!, (err: any, user: any) => {
        if(err) return res.sendStatus(403)
        req.user = user;
        next();
    })
}

const needsRole = (allowed: [string]) => {
    return (req: any, res: Response, next: Function) => {
        let user = req.user;
        if(user.role == "admin") {
            //Allow anything for admin
            return next();
        }
        //If the provided list of allowed roles contains the role of the user
        if(allowed.includes(user.role)) {
            return next();
        } else {
            Logger.warn(`User ${user.username} tried to access unprivileged route`) 
            return res.status(401).json({ message: "Unauthorized" })
        }
    }
}

export default {
    authenticateToken,
    needsRole,
    Login
}