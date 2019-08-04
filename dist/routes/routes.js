"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const api_1 = __importDefault(require("../controllers/api"));
const orders_1 = __importDefault(require("../controllers/orders"));
const routes = express_1.Router();
const apiCtrl = new api_1.default();
const orderCtrl = new orders_1.default();
routes.route('/getEmployees').get(apiCtrl.getEmployees.bind(apiCtrl));
routes.route('/timeForvehicle').post(apiCtrl.timeForvehicle.bind(apiCtrl));
routes.route('/timeForvehicle-download').get(apiCtrl.generateExceltimeForvehicle.bind(apiCtrl));
routes.route('/cantidadPorEmpleado').get(apiCtrl.cantidadPorEmpleado.bind(apiCtrl));
routes.route('/cantidadPorEmpleado-download').get(apiCtrl.generateExcelcantidadPorEmpleado.bind(apiCtrl));
routes.route('/cantidadPorTurno').get(apiCtrl.cantidadPorTurno.bind(apiCtrl));
routes.route('/QuantityForEaD').post(apiCtrl.quantityForEaD.bind(apiCtrl));
routes.route('/getCompanies').get(orderCtrl.getCompanies.bind(orderCtrl));
routes.route('/getFoods').get(orderCtrl.getFoods.bind(orderCtrl));
routes.route('/quantityForCompany').post(orderCtrl.quantityForCompany.bind(orderCtrl));
routes.route('/amountForCompany').post(orderCtrl.amountForCompany.bind(orderCtrl));
routes.route('/quantityForFood').post(orderCtrl.quantityForFood.bind(orderCtrl));
routes.route('/amountForFood').post(orderCtrl.amountForFood.bind(orderCtrl));
routes.route('/amountFoodsForCompany').post(orderCtrl.amountFoodsForCompany.bind(orderCtrl));
routes.route('/quantityByCompany').post(orderCtrl.quantityByCompany.bind(orderCtrl));
routes.route('/annualAmount').post(orderCtrl.annualAmount.bind(orderCtrl));
exports.default = routes;
