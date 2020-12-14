//Prepare dotenv
require('dotenv').config();
const PORT = process.env.PORT || 3000;

import express from 'express';
import Database from './util/db';
import Logger from './util/logger';
import Boot from './util/boot';

//Import routes
import JobRoutes from './route/JobRoutes';

//Express middleware imports
import bodyParser = require('body-parser');
import cookieParser = require('cookie-parser');


//Configure express
const app = express();
app.use(cookieParser());
app.use(bodyParser.json());

const init = async () => {
    await Database.connect();
    await Boot.createDefaultRoles();
    await Boot.createAdminUser();
};
init();

const apiUrl = '/api';

//Register all the routes
app.use(apiUrl + "/job", JobRoutes);

const server = app.listen(PORT, () => {
    Logger.info(`Service started on port ${PORT}!`);
})

export default server;