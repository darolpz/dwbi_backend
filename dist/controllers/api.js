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
const moment_1 = __importDefault(require("moment"));
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
    getEmployees(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `SELECT  emp.DNI AS dni, emp.Nombre as nombre,count(*) AS cantidad FROM CuboViajes cv
        INNER JOIN LK_Empleado emp ON emp.DNI=cv.DNIEmpleado
        GROUP BY emp.DNI
        HAVING cantidad > 0`;
            try {
                const result = yield this.select(query);
                res.json({
                    status: 200,
                    result: result,
                });
            }
            catch (err) {
                console.log(err);
                res.json({
                    status: 400,
                    error: err,
                });
            }
        });
    }
    QuantityForEaD(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const employeeId = req.body.employee;
            const year = req.body.year;
            const month = parseInt(req.body.month) - 1;
            let initDate = moment_1.default().year(year).month(month).startOf('month');
            const endDate = moment_1.default().year(year).month(month).endOf('month');
            const finalResult = [];
            while (initDate <= endDate) {
                const query = `SELECT Fecha as fecha,count(*) AS cantidad
            FROM CuboViajes
            WHERE DNIEmpleado = ${employeeId}
            AND Fecha = '${initDate.format('YYYY-MM-DD')}'
            GROUP BY fecha;
            `;
                const result = yield this.select(query);
                //result.fecha = moment(result.fecha).format('YYYY-MM-DD');
                if (result.length != 0) {
                    const data = {
                        fecha: initDate.format('YYYY-MM-DD'),
                        cantidad: result[0].cantidad
                    };
                    finalResult.push(data);
                }
                else {
                    const data = {
                        fecha: initDate.format('YYYY-MM-DD'),
                        cantidad: 0
                    };
                    finalResult.push(data);
                }
                initDate.add(1, 'days');
            }
            res.json({
                status: 200,
                result: finalResult,
            });
        });
    }
    timeForvehicle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const desde = req.body.desde;
            const hasta = req.body.hasta;
            let desdeQuery = ``;
            let hastaQuery = ``;
            if (desde)
                desdeQuery = `AND cv.Fecha >= ${desde}`;
            if (hasta)
                hastaQuery = `AND cv.Fecha < ${hasta}`;
            const query = `SELECT v.Descipcion AS vehiculo, AVG(MinutosViaje) AS tiempo 
            FROM ${DBC.dbconfig.database}.CuboViajes cv 
            INNER JOIN ${DBC.dbconfig.database}.LK_Vehiculo v ON v.IdVehiculo = cv.IdVehiculo
            WHERE 1 = 1 
            ${desdeQuery} 
            ${hastaQuery} 
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
            var sheet = workbook.addWorksheet('Tiempo de viaje'); //creating worksheet
            var data = yield this.select(`SELECT v.Descipcion  AS Vehiculo, AVG(MinutosViaje) AS Tiempo 
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
            var desde = req.query.fechaDesde;
            var hasta = req.query.fechaHasta;
            var desdeQuery = ``;
            var hastaQuery = ``;
            if (desde)
                desdeQuery = `AND cv.Fecha >= ${desde}`;
            if (hasta)
                hastaQuery = `AND cv.Fecha < ${hasta}`;
            const query = `SELECT e.Horario AS horario, COUNT(*) AS cantidad 
            FROM ${DBC.dbconfig.database}.CuboViajes cv 
            INNER JOIN ${DBC.dbconfig.database}.LK_Empleado e ON e.DNI = cv.DNIEmpleado
            WHERE 1 = 1 ${desdeQuery} ${hastaQuery} 
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
            var desde = req.query.fechaDesde;
            var hasta = req.query.fechaHasta;
            var desdeQuery = ``;
            var hastaQuery = ``;
            if (desde)
                desdeQuery = `AND cv.Fecha >= ${desde}`;
            if (hasta)
                hastaQuery = `AND cv.Fecha < ${hasta}`;
            const query = `SELECT e.nombre, e.DNI AS dni, COUNT(*) AS cantidad 
            FROM ${DBC.dbconfig.database}.CuboViajes cv
            INNER JOIN ${DBC.dbconfig.database}.LK_Empleado e ON e.DNI = cv.DNIEmpleado 
            WHERE 1 = 1 ${desdeQuery} ${hastaQuery} 
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
