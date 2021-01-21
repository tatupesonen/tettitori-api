import Job from '../schema/Job';
import Logger from './logger';
import User from '../schema/User';
import Role from '../schema/Role';
import Degree from '../schema/Degree';

export const createTestJobsAndAccounts = async () => {
    let role = await Role.findOne({ name: "workplace"}).lean();
    //Let's get some example degrees
    let degrees = await Degree.find({}).limit(20);
    //Prepare objectId list for use in notices

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
        body: {
            description: "Esimerkki kuvauskentästä"
        },
        authorDisplayName: users[0].username,
        author: users[0]._id,
        relevantDegrees: degrees.map(d => d._id)
    }),
    new Job({
        title: "Toinen esimerkki",
        body: {
            description: "Vaihtoehtoinen esimerkki."
        },
        authorDisplayName: users[0].username,
        author: users[0]._id,
        relevantDegrees: degrees.map(d => d._id)
    }),
    new Job({
        title: "Eri kuvauskentällä",
        body: {
            description: "Tässä ilmoituksessa eri kuvauskenttä"
        },
        authorDisplayName: users[0].username,
        author: users[0]._id,
        relevantDegrees: degrees.map(d => d._id)
    }),
    new Job({
        title: "Hellou!",
        body: {
            description: "Uusi!"
        },
        authorDisplayName: users[0].username,
        author: users[0]._id,
        relevantDegrees: degrees.map(d => d._id)
    }),
    new Job({
        title: "Esimerkki 2",
        body: {
            description: "Esimerkki kuvauskentästä"
        },
        authorDisplayName: users[1].username,
        author: users[0]._id,
        relevantDegrees: degrees.map(d => d._id)
    })];

    jobs.forEach(async j => {
        Logger.warn(`Creating test job ${j.title}`);
        await j.save();
    })
}
