const winston = require("winston");
const fs = require("fs");
const path = require("path");
const logDir = "logs";

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir); // if the log directory doesn't exist, create it.
}

const logger = winston.createLogger({
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
  },

  format: winston.format.combine(
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    winston.format.printf(
      (info: { timestamp: any; level: any; message: any }) => {
        return `${info.timestamp} ${info.level}: ${info.message}`;
      }
    )
  ),
  transports: [
    new winston.transports.Console({
      silent: process.env.NODE_ENV === "test" ? true : false,
      format: winston.format.combine(
        winston.format.timestamp({
          format: "YYYY-MM-DD HH:mm:ss",
        }),
        winston.format.colorize(),
        winston.format.printf(
          (info: { timestamp: any; level: any; message: any }) => {
            return `${info.timestamp} ${info.level}: ${info.message}`;
          }
        )
      ),
    }),
    new winston.transports.File({
      filename: path.join(logDir, "app-info.log"),
      level: "info",
    }),
    new winston.transports.File({
      filename: path.join(logDir, "app-error.log"),
      level: "error",
    }),
    new winston.transports.File({
      filename: path.join(logDir, "app-debug.log"),
      level: "debug",
    }),
  ],
});

export default logger;
