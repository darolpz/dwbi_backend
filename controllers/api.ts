import { Router, Request, Response } from 'express';
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
            `SELECT v.Descipcion AS Vehiculo, AVG(MinutosViaje) AS Tiempo 
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

    private select(query: string) {
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