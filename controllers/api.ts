import { Router, Request, Response } from 'express';
import { Workbook, Worksheet } from 'exceljs';
import connection from '..';
import moment from 'moment';
const DBC = require('../dbconfig');

class ApiController {

    public async getEmployees(req: Request, res: Response) {
        const query = `SELECT  emp.DNI AS dni, emp.Nombre as nombre,count(*) AS cantidad FROM CuboViajes cv
        INNER JOIN LK_Empleado emp ON emp.DNI=cv.DNIEmpleado
        GROUP BY emp.DNI
        HAVING cantidad > 0`;
        try {
            const result = await this.select(query);
            res.json({
                status: 200,
                result: result,
            })

        } catch (err) {
            console.log(err);
            res.json({
                status: 400,
                error: err,
            })
        }
    }

    public async getIndex(req: Request, res: Response) {
        res.json({
            status: 200,
            message: 'Hola mundo',
        })
    }

    public async quantityForEaD(req: Request, res: Response) {
        const body = req.body;
        const employeeId = req.body.employee;
        const year = req.body.year;
        const month = parseInt(req.body.month) - 1;

        let initDate = moment().year(year).month(month).startOf('month');
        const endDate = moment().year(year).month(month).endOf('month');
        const finalResult: Array<any> = [];
        while (initDate <= endDate) {
            const query = `SELECT Fecha as fecha,count(*) AS cantidad
            FROM CuboViajes
            WHERE DNIEmpleado = ${employeeId}
            AND Fecha = '${initDate.format('YYYY-MM-DD')}'
            GROUP BY fecha;
            `;
            const result = await this.select(query);
            //result.fecha = moment(result.fecha).format('YYYY-MM-DD');
            if (result.length != 0) {
                const data = {
                    fecha: initDate.format('YYYY-MM-DD'),
                    cantidad: result[0].cantidad
                }
                finalResult.push(data);
            } else {
                const data = {
                    fecha: initDate.format('YYYY-MM-DD'),
                    cantidad: 0
                }
                finalResult.push(data);
            }
            initDate.add(1, 'days');
        }
        res.json({
            status: 200,
            result: finalResult,
        })
    }

    public async timeForvehicle(req: Request, res: Response) {
        const body = req.body;
        const desde = req.body.desde;
        const hasta = req.body.hasta;
        let desdeQuery = ``;
        let hastaQuery = ``;

        if (desde) desdeQuery = `AND cv.Fecha >= ${desde}`;
        if (hasta) hastaQuery = `AND cv.Fecha < ${hasta}`;

        const query =
            `SELECT v.Descipcion AS vehiculo, AVG(MinutosViaje) AS tiempo 
            FROM ${DBC.dbconfig.database}.CuboViajes cv 
            INNER JOIN ${DBC.dbconfig.database}.LK_Vehiculo v ON v.IdVehiculo = cv.IdVehiculo
            WHERE 1 = 1 
            ${desdeQuery} 
            ${hastaQuery} 
            GROUP BY v.Descipcion 
            HAVING AVG(MinutosViaje) > 0;`;

        const result = await this.select(query);
        res.json({
            status: 200,
            result: result,
        })
    }

    public async generateExceltimeForvehicle(req: Request, res: Response) {
        var workbook = new Workbook();
        var sheet = workbook.addWorksheet('Tiempo de viaje'); //creating worksheet

        var data: any[] = await this.select(
            `SELECT v.Descipcion  AS Vehiculo, AVG(MinutosViaje) AS Tiempo 
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

    }

    public async cantidadPorTurno(req: Request, res: Response) {
        var desde = req.query.fechaDesde;
        var hasta = req.query.fechaHasta;
        var desdeQuery = ``;
        var hastaQuery = ``;
        if (desde) desdeQuery = `AND cv.Fecha >= ${desde}`;
        if (hasta) hastaQuery = `AND cv.Fecha < ${hasta}`;

        const query =
            `SELECT e.Horario AS horario, COUNT(*) AS cantidad 
            FROM ${DBC.dbconfig.database}.CuboViajes cv 
            INNER JOIN ${DBC.dbconfig.database}.LK_Empleado e ON e.DNI = cv.DNIEmpleado
            WHERE 1 = 1 ${desdeQuery} ${hastaQuery} 
            GROUP BY e.Horario;`;

        const result = await this.select(query);
        res.json({
            status: 200,
            result: result,
        })
    }

    public async cantidadPorEmpleado(req: Request, res: Response) {
        var desde = req.query.fechaDesde;
        var hasta = req.query.fechaHasta;
        var desdeQuery = ``;
        var hastaQuery = ``;
        if (desde) desdeQuery = `AND cv.Fecha >= ${desde}`;
        if (hasta) hastaQuery = `AND cv.Fecha < ${hasta}`;

        const query =
            `SELECT e.nombre, e.DNI AS dni, COUNT(*) AS cantidad 
            FROM ${DBC.dbconfig.database}.CuboViajes cv
            INNER JOIN ${DBC.dbconfig.database}.LK_Empleado e ON e.DNI = cv.DNIEmpleado 
            WHERE 1 = 1 ${desdeQuery} ${hastaQuery} 
            GROUP BY e.DNI, e.Nombre;`;
        const result = await this.select(query);
        res.json({
            status: 200,
            result: result,
        })
    }

    public async generateExcelcantidadPorEmpleado(req: Request, res: Response) {
        var workbook = new Workbook();
        var sheet = workbook.addWorksheet('Cantidad por empleado'); //creating worksheet

        var data: any[] = await this.select(
            `SELECT e.nombre, e.DNI AS dni, COUNT(*) AS cantidad 
            FROM ${DBC.dbconfig.database}.CuboViajes cv
            INNER JOIN ${DBC.dbconfig.database}.LK_Empleado e ON e.DNI = cv.DNIEmpleado 
            GROUP BY e.DNI, e.Nombre;`);
        var encabezados = ['Empleado', 'Cantidad'];
        sheet.addRow(encabezados);

        data.forEach(x => {
            sheet.addRow([x.nombre, x.cantidad]);
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

    }



    private select(query: string): any[] | any {
        let promise = new Promise((resolve, reject) => {
            connection.query(query, (err, result) => {
                if (err) { reject(err); }
                resolve(result)
            })
        })
        return promise;
    }
}

export default ApiController;