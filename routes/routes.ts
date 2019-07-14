import { Router, Request, Response } from 'express';
import express from 'express';
import ApiController from '../controllers/api';

const routes = Router();
const apiCtrl: ApiController = new ApiController();

routes.route('/').get(apiCtrl.index);
routes.route('/home').get(apiCtrl.home);
routes.route('/timeForvehicle').get(apiCtrl.timeForvehicle.bind(apiCtrl));

export default routes;