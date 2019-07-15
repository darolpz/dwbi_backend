import { Router, Request, Response } from 'express';
import express from 'express';
import ApiController from '../controllers/api';

const routes = Router();
const apiCtrl: ApiController = new ApiController();

routes.route('/').get(apiCtrl.index);
routes.route('/home').get(apiCtrl.home);
routes.route('/timeForvehicle').get(apiCtrl.timeForvehicle.bind(apiCtrl));
routes.route('/timeForvehicle-download').get(apiCtrl.generateExceltimeForvehicle.bind(apiCtrl));
routes.route('/cantidadPorEmpleado').get(apiCtrl.cantidadPorEmpleado.bind(apiCtrl));
routes.route('/cantidadPorTurno').get(apiCtrl.cantidadPorTurno.bind(apiCtrl));

export default routes;