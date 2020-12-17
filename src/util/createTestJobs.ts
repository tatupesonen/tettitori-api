import Job from '../schema/Job';
import Logger from './logger';
import User from '../schema/User';
import Role from '../schema/Role';

export const createTestJobsAndAccounts = async () => {
    let role = await Role.findOne({ name: "workplace"}).lean();

    let users = [new User({
        username: "testuser1",
        password: "password1",
        email: "test@test.fi",
        role: role._id
    }),
    new User({
        username: "testuser2",
        password: "password2",
        email: "test2@test.fi",
        role: role._id
    })];

    users.map(async j => {
        Logger.warn(`Creating test user ${j.username}`);
        return await j.save();
    })


    let jobs = [new Job({
        title: "Esimerkki työpaikkailmoituksesta",
        body: "Tähän kenttään työpaikan sisällöstä",
        author: users[0]._id,
    }),
    new Job({
        title: "Esimerkki 2",
        body: "Tähän kenttään työpaikan sisällöstä",
        author: users[0]._id,
    })];

    jobs.forEach(async j => {
        Logger.warn(`Creating test job ${j.title}`);
        await j.save();
    })
}

export const createTestAccounts = async () => {
   
}