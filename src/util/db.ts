const Mongoose = require("mongoose");
const mongoUrl = process.env.DB_HOST;
const mode = process.env.DB_MODE;
import { MongoMemoryServer } from "mongodb-memory-server";
import { ConnectOptions, mongo } from "mongoose";
import { DB_MODE } from "./Constants";
import Logger from "./logger";

// Mongo options used for all instance connections
const mongoOpts: ConnectOptions = {
  useFindAndModify: false,
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

export default {
  async connect() {
    //If the db mode in .env is configured to be ethereal, use in memory server.
    if (mode == DB_MODE.ETHEREAL) {
      const mongod = new MongoMemoryServer();
      Logger.info(
        `Attempting to connect to database on ${await mongod.getUri()}`
      );

      // Spread in mongo opts. This creates an in memory server.
      let response = await this.mongooseConnection(
        {
          ...mongoOpts,
        },
        // Gets URI from MongoMemoryServer
        await mongod.getUri()
      );
      if (response) {
        console.log(response);
      }
      // Successfully connected
      Logger.info(`Connected using DB mode ${mode}`);
    } else {
      Logger.info(`Attempting to connect to database on ${mongoUrl}`);
      // Connect to MongoDB instance
      let response = await this.mongooseConnection(
        {
          user: process.env.DB_USERNAME,
          pass: process.env.DB_PASSWORD,
          dbName: process.env.DB_NAME,
          reconnectInterval: process.env.DB_CONNECT_INTERVAL,
          reconnectTries: process.env.DB_CONNECT_TRIES,
          ...mongoOpts,
        },
        mongoUrl
      );
      if (response) {
        console.log(response);
      }
      Logger.warn(`Connected using DB mode ${mode}`);
    }
  },

  // Asynchronous wrapper for creating Mongoose connections
  mongooseConnection(parameters: any, mongo_url: any) {
    return new Promise((resolve: any, reject: any) => {
      Mongoose.connect(mongo_url, parameters, (err: Error) => {
        if (err) {
          return reject(err);
        }
        return resolve();
      });
    });
  },
};
