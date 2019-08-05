import { Router, Request, Response } from 'express';
import express from 'express';
import ApiController from '../controllers/api';
import OrdersController from '../controllers/orders';

const routes = Router();
const apiCtrl: ApiController = new ApiController();
const orderCtrl: OrdersController = new OrdersController();

routes.route('/').get(apiCtrl.getIndex.bind(apiCtrl));

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

export default routes;



