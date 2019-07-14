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
        FROM Datawarehouse.CuboViajes cv 
        INNER JOIN Datawarehouse.LK_Vehiculo v ON v.IdVehiculo = cv.IdVehiculo 
        GROUP BY v.Descipcion 
        HAVING AVG(MinutosViaje) > 0;`;
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
