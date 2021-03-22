import Role, { IRole } from "../schema/Role";
import User from "../schema/User";
import Degree from "../schema/Degree";
import ActivityOrientation from "../schema/ActivityOrientation";
import axios from "axios";
import Crypto from "./Crypto";
import Logger from "./logger";

//Import fs
import fs from "fs/promises";

const createAdminUser = async () => {
  let role = await Role.findOne({
    name: "admin",
  });
  let adminpass = Crypto.generateUUID();

  let admin = new User({
    username: "admin",
    password: adminpass,
    email: "admin@hameenlinna.fi",
    role: role!._id,
  });

  let admincount = await User.countDocuments({ username: "admin" });
  //In case the admin user already exists, we don't want to create a new one.
  if (!admincount) {
    await admin.save();
    Logger.warn(`Admin user registered, password: ${adminpass}`);
  } else {
    Logger.info("Admin user exists, not creating a new one.");
  }
};

const createDefaultActivityOrientations = async () => {
  let data = await fs.readFile("data/orientations.json", "utf-8");
  const orientations = JSON.parse(data);
  orientations.forEach((o: any) => {
    ActivityOrientation.findOneAndUpdate(
      { title: o.title },
      { $set: o },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).then((val) => {
      Logger.info(`Created activity orientation ${val.title}`);
    });
  });
};

const createDefaultRoles = async () => {
  let roles = [
    {
      name: "admin",
      isAdmin: true,
      permissions: {
        canCreateJobPosting: true,
      },
    },
    {
      name: "workplace",
      isAdmin: false,
      permissions: {
        canCreateJobPosting: true,
      },
    },
  ];
  roles.forEach(async (r) => {
    Role.findOneAndUpdate(
      {
        name: r.name,
      },
      {
        $set: r,
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    ).then((val) => {
      Logger.info(`Created role ${val.name}`);
    });
  });
};

const loadDegrees = async () => {
  const dataURL =
    "https://koski.opintopolku.fi/koski/api/koodisto/tutkintonimikkeet/latest";
  //We load all the available degrees using KOSKI API.
  try {
    let response = await axios.get(dataURL);
    let degrees = response.data.map((item: any) => {
      //Filter only finnish metadatas into objects for now
      return item.metadata.filter((m: any) => m.kieli === "FI");
    });

    //Create every degree in db
    degrees.forEach(async (d: any) => {
      if (d[0].lyhytNimi) {
        Degree.create({ title: d[0].lyhytNimi });
        Logger.debug(`${d[0].lyhytNimi} degree created`);
      }
    });
    Logger.info("Loaded degrees from " + dataURL);
  } catch (err) {
    Logger.error("Couldn't load available degrees. Using empty degrees list.");
  }
};

export default {
  createAdminUser,
  createDefaultRoles,
  loadDegrees,
  createDefaultActivityOrientations,
};
