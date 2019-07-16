import { Router, Request, Response } from 'express';
import connection from '..';
import moment from 'moment';
const DBC = require('../dbconfig');
class OrdersController {

    async getCompanies(req: Request, res: Response) {
        const query = `
        SELECT DISTINCT company_id,company_name FROM LK_users;
        `;
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

    async getFoods(req: Request, res: Response) {
        const query = `
        SELECT DISTINCT id,detail FROM LK_food;
        `;
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

    public async quantityForCompany(req: Request, res: Response) {
        const body = req.body;
        const companyId = req.body.company;
        const year = req.body.year;
        const month = parseInt(req.body.month) - 1;

        let initDate = moment().year(year).month(month).startOf('month');
        const endDate = moment().year(year).month(month).endOf('month');
        const finalResult: Array<any> = [];
        try {

            while (initDate <= endDate) {

                const query = `SELECT ord.date AS 'fecha',COUNT(*) AS 'cantidad' FROM BT_orders ord
                INNER JOIN LK_users usr ON usr.user_id = ord.user_id
                WHERE usr.company_id = ${companyId} 
                AND ord.date = '${initDate.format('YYYY-MM-DD')}'
                GROUP BY ord.date;
                `;
                const result = await this.select(query);
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
        } catch (err) {
            res.json({
                status: 400,
                error: err,
            })
        }
    }

    public async amountForCompany(req: Request, res: Response) {
        const companyId = req.body.company;
        const year = req.body.year;
        const month = parseInt(req.body.month) - 1;

        let initDate = moment().year(year).month(month).startOf('month');
        const endDate = moment().year(year).month(month).endOf('month');
        const finalResult: Array<any> = [];
        while (initDate <= endDate) {

            const query = `SELECT ord.date AS 'fecha',SUM(ord.amount) AS'cantidad' FROM BT_orders ord
            INNER JOIN LK_users usr ON usr.user_id = ord.user_id
            WHERE usr.company_id = ${companyId} 
            AND ord.date = '${initDate.format('YYYY-MM-DD')}'
            GROUP BY ord.date;
            `;
            const result = await this.select(query);
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

    public async quantityForFood(req: Request, res: Response) {
        const foodId = req.body.food;
        const typeFood = req.body.type;
        const year = req.body.year;
        const month = parseInt(req.body.month) - 1;

        let initDate = moment().year(year).month(month).startOf('month');
        const endDate = moment().year(year).month(month).endOf('month');
        const finalResult: Array<any> = [];
        while (initDate <= endDate) {

            const query = `SELECT food.detail AS 'fecha',COUNT(*) AS'cantidad' FROM BT_orders ord
            INNER JOIN LK_food food ON food.id = ord.plato_principal_id
            WHERE ord.${typeFood} = ${foodId} 
            AND ord.date = '${initDate.format('YYYY-MM-DD')}'
            GROUP BY food.detail;
            `;
            const result = await this.select(query);
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

    public async amountForFood(req: Request, res: Response) {
        const foodId = req.body.food;
        const typeFood = req.body.type;
        const year = req.body.year;
        const month = parseInt(req.body.month) - 1;

        let initDate = moment().year(year).month(month).startOf('month');
        const endDate = moment().year(year).month(month).endOf('month');
        const finalResult: Array<any> = [];
        while (initDate <= endDate) {

            const query = `SELECT food.detail AS 'fecha',SUM(ord.amount) AS'cantidad' FROM BT_orders ord
            INNER JOIN LK_food food ON food.id = ord.plato_principal_id
            WHERE ord.${typeFood} = ${foodId} 
            AND ord.date = '${initDate.format('YYYY-MM-DD')}'
            GROUP BY food.detail;
            `;
            const result = await this.select(query);
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

    public async amountFoodsForCompany(req: Request, res: Response) {
        const companyId = req.body.company;
        const date = req.body.date;
        console.log(req.body);
        const query = `SELECT food.detail AS 'detalle',SUM(ord.amount) AS'cantidad' 
        FROM BT_orders ord
        INNER JOIN LK_food food ON food.id = ord.plato_principal_id
        INNER JOIN LK_users usr ON usr.user_id = ord.user_id
        WHERE usr.company_id = ${companyId} AND ord.date='${date}'
        GROUP BY food.detail;`;
        const result = await this.select(query);
        res.json({
            status: 200,
            result: result,
        })
    }

    public async quantityByCompany(req: Request, res: Response) {

        const mode = req.body.mode;

        /* -- orders por company */
        const count = `SELECT usr.company_name AS company,
        COUNT(*) AS cantidad
        FROM BT_orders ord
        INNER JOIN LK_users usr ON usr.user_id = ord.user_id
        GROUP BY usr.company_name
        ORDER BY cantidad DESC;`
            ;

        /* -- amount por company */
        const amount = `SELECT usr.company_name AS company,
        SUM(ord.amount) AS cantidad
        FROM BT_orders ord
        INNER JOIN LK_users usr ON usr.user_id = ord.user_id
        GROUP BY usr.company_name
        ORDER BY cantidad DESC;`;
        const query = (mode === 'count') ? count : amount;
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

export default OrdersController;