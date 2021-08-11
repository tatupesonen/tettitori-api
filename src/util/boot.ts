import Role, { IRole } from "../schema/Role";
import User from "../schema/User";
import Degree from "../schema/Degree";
import ActivityOrientation from "../schema/ActivityOrientation";
import axios from "axios";
import Crypto from "./Crypto";
import Logger from "./logger";
import fs from "fs/promises";

// Function that creates an admin role if one does not yet exist in the database
const createAdminUser = async () => {
  // Find role to attach to admin user
  let role = await Role.findOne({
    name: "admin",
  });
  // Generate initial password
  let adminpass = Crypto.generateUUID();

  // Prepare admin object. This is not saved to the database yet.
  let admin = new User({
    username: "admin",
    password: adminpass,
    email: "admin@hameenlinna.fi",
    role: role!._id,
  });

  // Check whether an admin already exists
  let admincount = await User.countDocuments({ username: "admin" });

  //In case the admin user already exists, we don't want to create a new one.
  if (!admincount) {
    await admin.save();
    Logger.warn(`Admin user registered, password: ${adminpass}`);
  } else {
    Logger.info("Admin user exists, not creating a new one.");
  }
};

// Load default orientations (unused feature)
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

// Default roles for database
const createDefaultRoles = async () => {
  // Prepare roles array
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
  // Search by name and update roles found in database. If role does not exist, create one.
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

// Load degrees from opintopolku (unused feature)
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
        await Degree.findOneAndUpdate(
          { title: d[0].lyhytNimi },
          { $set: { title: d[0].lyhytNimi } },
          {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true,
          }
        );
        Logger.debug(`${d[0].lyhytNimi} degree created`);
      }
    });
    const total = await Degree.count();
    Logger.info(
      "Loaded degrees from " + dataURL + ", total documents count: " + total
    );
    Logger.info();
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
