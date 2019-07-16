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
const __1 = __importDefault(require(".."));
const moment_1 = __importDefault(require("moment"));
const DBC = require('../dbconfig');
class OrdersController {
    getCompanies(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
        SELECT DISTINCT company_id,company_name FROM LK_users;
        `;
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
    getFoods(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
        SELECT DISTINCT id,detail FROM LK_food;
        `;
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
    quantityForCompany(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const companyId = req.body.company;
            const year = req.body.year;
            const month = parseInt(req.body.month) - 1;
            let initDate = moment_1.default().year(year).month(month).startOf('month');
            const endDate = moment_1.default().year(year).month(month).endOf('month');
            const finalResult = [];
            try {
                while (initDate <= endDate) {
                    const query = `SELECT ord.date AS 'fecha',COUNT(*) AS 'cantidad' FROM BT_orders ord
                INNER JOIN LK_users usr ON usr.user_id = ord.user_id
                WHERE usr.company_id = ${companyId} 
                AND ord.date = '${initDate.format('YYYY-MM-DD')}'
                GROUP BY ord.date;
                `;
                    const result = yield this.select(query);
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
            }
            catch (err) {
                res.json({
                    status: 400,
                    error: err,
                });
            }
        });
    }
    amountForCompany(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const companyId = req.body.company;
            const year = req.body.year;
            const month = parseInt(req.body.month) - 1;
            let initDate = moment_1.default().year(year).month(month).startOf('month');
            const endDate = moment_1.default().year(year).month(month).endOf('month');
            const finalResult = [];
            while (initDate <= endDate) {
                const query = `SELECT ord.date AS 'fecha',SUM(ord.amount) AS'cantidad' FROM BT_orders ord
            INNER JOIN LK_users usr ON usr.user_id = ord.user_id
            WHERE usr.company_id = ${companyId} 
            AND ord.date = '${initDate.format('YYYY-MM-DD')}'
            GROUP BY ord.date;
            `;
                const result = yield this.select(query);
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
    quantityForFood(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const foodId = req.body.food;
            const typeFood = req.body.type;
            const year = req.body.year;
            const month = parseInt(req.body.month) - 1;
            let initDate = moment_1.default().year(year).month(month).startOf('month');
            const endDate = moment_1.default().year(year).month(month).endOf('month');
            const finalResult = [];
            while (initDate <= endDate) {
                const query = `SELECT food.detail AS 'fecha',COUNT(*) AS'cantidad' FROM BT_orders ord
            INNER JOIN LK_food food ON food.id = ord.plato_principal_id
            WHERE ord.${typeFood} = ${foodId} 
            AND ord.date = '${initDate.format('YYYY-MM-DD')}'
            GROUP BY food.detail;
            `;
                const result = yield this.select(query);
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
    amountForFood(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const foodId = req.body.food;
            const typeFood = req.body.type;
            const year = req.body.year;
            const month = parseInt(req.body.month) - 1;
            let initDate = moment_1.default().year(year).month(month).startOf('month');
            const endDate = moment_1.default().year(year).month(month).endOf('month');
            const finalResult = [];
            while (initDate <= endDate) {
                const query = `SELECT food.detail AS 'fecha',SUM(ord.amount) AS'cantidad' FROM BT_orders ord
            INNER JOIN LK_food food ON food.id = ord.plato_principal_id
            WHERE ord.${typeFood} = ${foodId} 
            AND ord.date = '${initDate.format('YYYY-MM-DD')}'
            GROUP BY food.detail;
            `;
                const result = yield this.select(query);
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
    amountFoodsForCompany(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const companyId = req.body.company;
            const date = req.body.date;
            console.log(req.body);
            const query = `SELECT food.detail AS 'detalle',SUM(ord.amount) AS'cantidad' 
        FROM BT_orders ord
        INNER JOIN LK_food food ON food.id = ord.plato_principal_id
        INNER JOIN LK_users usr ON usr.user_id = ord.user_id
        WHERE usr.company_id = ${companyId} AND ord.date='${date}'
        GROUP BY food.detail;`;
            const result = yield this.select(query);
            res.json({
                status: 200,
                result: result,
            });
        });
    }
    quantityByCompany(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const mode = req.body.mode;
            /* -- orders por company */
            const count = `SELECT usr.company_name AS company,
        COUNT(*) AS cantidad
        FROM BT_orders ord
        INNER JOIN LK_users usr ON usr.user_id = ord.user_id
        GROUP BY usr.company_name
        ORDER BY cantidad DESC;`;
            /* -- amount por company */
            const amount = `SELECT usr.company_name AS company,
        SUM(ord.amount) AS cantidad
        FROM BT_orders ord
        INNER JOIN LK_users usr ON usr.user_id = ord.user_id
        GROUP BY usr.company_name
        ORDER BY cantidad DESC;`;
            const query = (mode === 'count') ? count : amount;
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
exports.default = OrdersController;
