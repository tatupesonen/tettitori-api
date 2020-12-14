"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var winston = require('winston');
var fs = require('fs');
var path = require('path');
var logDir = "logs";
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir); // if the log directory doesn't exist, create it.
}
var logger = winston.createLogger({
    levels: {
        error: 0,
        warn: 1,
        info: 2,
        debug: 3
    },
    format: winston.format.combine(winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
    }), winston.format.printf(function (info) {
        return info.timestamp + " " + info.level + ": " + info.message;
    })),
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(winston.format.timestamp({
                format: 'YYYY-MM-DD HH:mm:ss'
            }), winston.format.colorize(), winston.format.printf(function (info) {
                return info.timestamp + " " + info.level + ": " + info.message;
            }))
        }),
        new winston.transports.File({
            filename: path.join(logDir, 'app-info.log'),
            level: 'info'
        }),
        new winston.transports.File({
            filename: path.join(logDir, 'app-error.log'),
            level: 'error'
        }),
        new winston.transports.File({
            filename: path.join(logDir, 'app-debug.log'),
            level: 'debug'
        })
    ]
});
exports.default = logger;
