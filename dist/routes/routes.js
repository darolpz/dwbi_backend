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
routes.route('/getEmployees').get(apiCtrl.getEmployees.bind(apiCtrl));
routes.route('/timeForvehicle').post(apiCtrl.timeForvehicle.bind(apiCtrl));
routes.route('/timeForvehicle-download').get(apiCtrl.generateExceltimeForvehicle.bind(apiCtrl));
routes.route('/cantidadPorEmpleado').get(apiCtrl.cantidadPorEmpleado.bind(apiCtrl));
routes.route('/cantidadPorEmpleado-download').get(apiCtrl.generateExcelcantidadPorEmpleado.bind(apiCtrl));
routes.route('/cantidadPorTurno').get(apiCtrl.cantidadPorTurno.bind(apiCtrl));
routes.route('/QuantityForEaD').post(apiCtrl.QuantityForEaD.bind(apiCtrl));
exports.default = routes;
