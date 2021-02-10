const Mongoose = require("mongoose");
const mongoUrl = process.env.DB_HOST;
const mode = process.env.DB_MODE;
import { MongoMemoryServer } from "mongodb-memory-server";
import { DB_MODE } from "./Constants";
import Logger from "./logger";

Mongoose.set("useFindAndModify", false); //Remove deprecation error

export default {
  async connect() {
    //If the db mode in .env is configured to be ethereal, use in memory server.
    if (mode == DB_MODE.ETHEREAL) {
      const mongod = new MongoMemoryServer();
      Logger.info(
        `Attempting to connect to database on ${await mongod.getUri()}`
      );

      let response = await this.mongooseConnection(
        {
          useUnifiedTopology: true,
          useNewUrlParser: true,
        },
        await mongod.getUri()
      );
      if (response) {
        console.log(response);
      }
      Logger.info(`Connected using DB mode ${mode}`);
    } else {
      Logger.info(`Attempting to connect to database on ${mongoUrl}`);
      let response = await this.mongooseConnection(
        {
          user: process.env.DB_USERNAME,
          pass: process.env.DB_PASSWORD,
          dbName: process.env.DB_NAME,
          reconnectInterval: process.env.DB_CONNECT_INTERVAL,
          reconnectTries: process.env.DB_CONNECT_TRIES,
          useUnifiedTopology: true,
          useNewUrlParser: true,
        },
        mongoUrl
      );
      if (response) {
        console.log(response);
      }
      Logger.warn(`Connected using DB mode ${mode}`);
    }
  },

  mongooseConnection(parameters: any, mongo_url: any) {
    return new Promise((resolve: any, reject: any) => {
      Mongoose.connect(mongo_url, parameters, function (err: Error) {
        if (err) {
          return reject(err);
        }
        return resolve();
      });
    });
  },
};
