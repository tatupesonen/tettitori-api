"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Mongoose = require("mongoose");
var mongoUrl = process.env.DB_HOST;
var mode = process.env.DB_MODE;
var mongodb_memory_server_1 = require("mongodb-memory-server");
var Constants_1 = require("./Constants");
var logger_1 = __importDefault(require("./logger"));
exports.default = {
    connect: function () {
        return __awaiter(this, void 0, void 0, function () {
            var mongod, _a, _b, _c, response, _d, _e, response;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        if (!(mode == Constants_1.DB_MODE.ETHEREAL)) return [3 /*break*/, 4];
                        mongod = new mongodb_memory_server_1.MongoMemoryServer();
                        _b = (_a = logger_1.default).info;
                        _c = "Attempting to connect to database on ";
                        return [4 /*yield*/, mongod.getUri()];
                    case 1:
                        _b.apply(_a, [_c + (_f.sent())]);
                        _d = this.mongooseConnection;
                        _e = [{
                                useUnifiedTopology: true,
                                useNewUrlParser: true
                            }];
                        return [4 /*yield*/, mongod.getUri()];
                    case 2: return [4 /*yield*/, _d.apply(this, _e.concat([_f.sent()]))];
                    case 3:
                        response = _f.sent();
                        if (response) {
                            console.log(response);
                        }
                        logger_1.default.info("Connected using DB mode " + mode);
                        return [3 /*break*/, 6];
                    case 4:
                        logger_1.default.info("Attempting to connect to database on " + mongoUrl);
                        return [4 /*yield*/, this.mongooseConnection({
                                user: process.env.DB_USERNAME,
                                pass: process.env.DB_PASSWORD,
                                dbName: process.env.DB_NAME,
                                reconnectInterval: process.env.DB_CONNECT_INTERVAL,
                                reconnectTries: process.env.DB_CONNECT_TRIES,
                                useUnifiedTopology: true,
                                useNewUrlParser: true
                            }, mongoUrl)];
                    case 5:
                        response = _f.sent();
                        if (response) {
                            console.log(response);
                        }
                        logger_1.default.info("Connected using DB mode " + mode);
                        _f.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        });
    },
    mongooseConnection: function (parameters, mongo_url) {
        return new Promise(function (resolve, reject) {
            Mongoose.connect(mongo_url, parameters, function (err) {
                if (err) {
                    return reject(err);
                }
                return void resolve();
            });
        });
    },
};
