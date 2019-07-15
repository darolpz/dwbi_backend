import { Router, Request, Response } from 'express';
import { Workbook, Worksheet } from 'exceljs';
import connection from '..';

const DBC = require('../dbconfig');

class ApiController {
    public index(req: Request, res: Response) {
        /* Post params */
        const body = req.body;
        /* Query string params */
        const query = req.query;
        res.json({
            page: 'index',
        });
    }

    public home(req: Request, res: Response) {
        /* Post params */
        const body = req.body;
        /* Query string params */
        const query = req.query;
        res.json({
            page: 'home',
        });
    }

    public async timeForvehicle(req: Request, res: Response) {
        const query =
            `SELECT v.Descipcion AS vehiculo, AVG(MinutosViaje) AS tiempo 
            FROM ${DBC.dbconfig.database}.CuboViajes cv 
            INNER JOIN ${DBC.dbconfig.database}.LK_Vehiculo v ON v.IdVehiculo = cv.IdVehiculo 
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
        console.log(workbook);
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
        const query =
            `SELECT e.Horario AS horario, COUNT(*) AS cantidad FROM ${DBC.dbconfig.database}.CuboViajes cv 
            INNER JOIN ${DBC.dbconfig.database}.LK_Empleado e ON e.DNI = cv.DNIEmpleado
            GROUP BY e.Horario;`;
        const result = await this.select(query);
        res.json({
            status: 200,
            result: result,
        })
    }

    public async cantidadPorEmpleado(req: Request, res: Response) {
        const query =
            `SELECT e.nombre, e.DNI AS dni, COUNT(*) AS cantidad 
            FROM ${DBC.dbconfig.database}.CuboViajes cv
            INNER JOIN ${DBC.dbconfig.database}.LK_Empleado e ON e.DNI = cv.DNIEmpleado
            GROUP BY e.DNI, e.Nombre;`;
        const result = await this.select(query);
        res.json({
            status: 200,
            result: result,
        })
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