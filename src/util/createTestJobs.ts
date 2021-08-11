import Job, { JobDoc } from "../schema/Job";
import Logger from "./logger";
import User from "../schema/User";
import Role from "../schema/Role";
import Degree from "../schema/Degree";
import ActivityOrientation from "../schema/ActivityOrientation";

// Only used in ethereal DB mode to have some testing data when the API runs.
export const createTestJobsAndAccounts = async () => {
  let role = await Role.findOne({ name: "workplace" }).lean();
  let orientations = await ActivityOrientation.find({});
  //Let's get some example degrees
  let degrees = await Degree.find({}).limit(20);
  //Prepare objectId list for use in notices

  let users = [
    new User({
      username: "testuser1",
      password: "password1",
      email: "test@test.fi",
      role: role?._id,
    }),
    new User({
      username: "testuser2",
      password: "password2",
      email: "test2@test.fi",
      role: role?._id,
    }),
  ];

  users.map(async (j) => {
    Logger.warn(`Creating test user ${j.username}`);
    return await j.save();
  });

  let jobs = [
    new Job({
      title: "Asiakaspalvelu",
      companyName: "Pertin puuhailu Oy",
      body: {
        description: "Esimerkki kuvauskentästä",
        additionalInfo: "Yhteydenotot puhelimitse",
        contactInfo: {
          email: "test@google.com",
          phoneNumber: "045 55 2155",
        },
        address: {
          city: "Hameenlinna",
          zipcode: "13700",
          streetaddress: "Pertinkatu 55",
        },
      },
      authorDisplayName: users[0].username,
      author: users[0]._id,
      relevantDegrees: degrees.map((d) => d._id),
      relevantOrientations: orientations.map((o) => o._id),
    } as JobDoc),
    new Job({
      title: "Asiakaspalvelu",
      companyName: "Pertin puuhailu Oy",
      body: {
        description: "Esimerkki kuvauskentästä",
        additionalInfo: "Yhteydenotot puhelimitse",
        contactInfo: {
          email: "test@google.com",
          phoneNumber: "045 55 2155",
        },
        address: {
          city: "Hameenlinna",
          zipcode: "13700",
          streetaddress: "Pertinkatu 55",
        },
      },
      authorDisplayName: users[0].username,
      author: users[0]._id,
      relevantDegrees: degrees.map((d) => d._id),
    } as JobDoc),
    new Job({
      title: "Puutöitä",
      companyName: "Pertin puuhailu Oy",
      body: {
        description: "Esimerkki kuvauskentästä",
        additionalInfo: "Yhteydenotot puhelimitse",
        contactInfo: {
          email: "test@google.com",
          phoneNumber: "045 55 2155",
        },
        address: {
          city: "Hameenlinna",
          zipcode: "13700",
          streetaddress: "Pertinkatu 55",
        },
      },
      authorDisplayName: users[0].username,
      author: users[0]._id,
      relevantDegrees: degrees.map((d) => d._id),
    }),
  ];

  jobs.forEach(async (j) => {
    Logger.warn(`Creating test job ${j.title}`);
    await j.save();
  });
};
