"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const exceljs_1 = require("exceljs");
const __1 = __importDefault(require(".."));
const DBC = require('../dbconfig');
class ApiController {
    index(req, res) {
        /* Post params */
        const body = req.body;
        /* Query string params */
        const query = req.query;
        res.json({
            page: 'index',
        });
    }
    home(req, res) {
        /* Post params */
        const body = req.body;
        /* Query string params */
        const query = req.query;
        res.json({
            page: 'home',
        });
    }
    timeForvehicle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `SELECT v.Descipcion AS Vehiculo, AVG(MinutosViaje) AS Tiempo 
            FROM ${DBC.dbconfig.database}.CuboViajes cv 
            INNER JOIN ${DBC.dbconfig.database}.LK_Vehiculo v ON v.IdVehiculo = cv.IdVehiculo 
            GROUP BY v.Descipcion 
            HAVING AVG(MinutosViaje) > 0;`;
            const result = yield this.select(query);
            res.json({
                status: 200,
                result: result,
            });
        });
    }
    generateExceltimeForvehicle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var workbook = new exceljs_1.Workbook();
            console.log(workbook);
            var sheet = workbook.addWorksheet('Tiempo de viaje'); //creating worksheet
            var data = yield this.select(`SELECT v.Descipcion AS Vehiculo, AVG(MinutosViaje) AS Tiempo 
            FROM ${DBC.dbconfig.database}.CuboViajes cv 
            INNER JOIN Datawarehouse.LK_Vehiculo v ON v.IdVehiculo = cv.IdVehiculo 
            GROUP BY v.Descipcion 
            HAVING AVG(MinutosViaje) > 0;`);
            var encabezados = ['Vehiculo', 'Minutos promedio'];
            sheet.addRow(encabezados);
            data.forEach(x => {
                sheet.addRow([x.Vehiculo, x.Tiempo]);
            });
            var tempfile = require('tempfile');
            var tempFilePath = tempfile('.xlsx');
            console.log("tempFilePath : ", { root: '/tmp/' }, tempFilePath);
            workbook.xlsx.writeFile(tempFilePath).then(function () {
                res.sendFile(tempFilePath, function (err) {
                    if (!!err) {
                        console.log('---------- error downloading file: ', err);
                        res.status(500).end();
                    }
                    else {
                        console.log("Todo OK");
                    }
                });
            });
        });
    }
    cantidadPorTurno(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `SELECT e.Horario, COUNT(*) AS Cantidad FROM ${DBC.dbconfig.database}.CuboViajes cv 
            INNER JOIN ${DBC.dbconfig.database}.LK_Empleado e ON e.DNI = cv.DNIEmpleado
            GROUP BY e.Horario;`;
            const result = yield this.select(query);
            res.json({
                status: 200,
                result: result,
            });
        });
    }
    cantidadPorEmpleado(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `SELECT e.Nombre, e.DNI, COUNT(*) AS Cantidad 
            FROM ${DBC.dbconfig.database}.CuboViajes cv
            INNER JOIN ${DBC.dbconfig.database}.LK_Empleado e ON e.DNI = cv.DNIEmpleado
            GROUP BY e.DNI, e.Nombre;`;
            const result = yield this.select(query);
            res.json({
                status: 200,
                result: result,
            });
        });
    }
    select(query) {
        let promise = new Promise((resolve, reject) => {
            __1.default.query(query, (err, result) => {
                if (err) {
                    reject(err);
                }
                resolve(result);
            });
        });
        return promise;
    }
}
exports.default = ApiController;
