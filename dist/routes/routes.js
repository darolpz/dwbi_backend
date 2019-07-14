"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const api_1 = __importDefault(require("../controllers/api"));
const routes = express_1.Router();
const apiCtrl = new api_1.default();
routes.route('/').get(apiCtrl.index);
routes.route('/home').get(apiCtrl.home);
routes.route('/timeForvehicle').get(apiCtrl.timeForvehicle.bind(apiCtrl));
exports.default = routes;
