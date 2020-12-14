"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
//Prepare dotenv
var express = require('express');
var db_1 = __importDefault(require("./util/db"));
var logger_1 = __importDefault(require("./util/logger"));
logger_1.default.info("Test!!");
db_1.default.connect();
