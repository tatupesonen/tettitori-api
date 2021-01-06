//Prepare dotenv
require('dotenv').config();
const PORT = process.env.PORT || 3000;
let server: any;

import express from 'express';
import Database from './util/db';
import Logger from './util/logger';
import Boot from './util/boot';

//Import routes
import JobRoutes from './route/JobRoutes';
import AuthRoutes from './route/AuthRoutes'

//Express middleware imports
import bodyParser = require('body-parser');
import Job from './schema/Job';

//Configure express
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true,
}))

//Import this, remove when not testing
import { createTestJobsAndAccounts, } from './util/createTestJobs';

const init = async () => {
    await Database.connect();
    await Boot.createDefaultRoles();
    await Boot.createAdminUser();

    //test jobs
    await createTestJobsAndAccounts();
};

const apiUrl = '/api';

//Register all the routes
app.use(apiUrl + "/job", JobRoutes);
app.use(apiUrl, AuthRoutes);

//Wait for server staret before we give it to the test suite
init().then(done => {
    server = app.listen(PORT, () => {
        Logger.info(`Service started on port ${PORT}!`);
        app.emit("started");
    })
})


export default app;


