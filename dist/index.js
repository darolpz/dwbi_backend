"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./classes/server"));
const routes_1 = __importDefault(require("./routes/routes"));
const body_parser_1 = __importDefault(require("body-parser"));
const mysql_1 = __importDefault(require("mysql"));
const cors_1 = __importDefault(require("cors"));
const server = new server_1.default();
const DBC = require('./dbconfig');
console.log(DBC.dbconfig.host);
// Body parser
server.app.use(body_parser_1.default.urlencoded({ extended: true }));
server.app.use(body_parser_1.default.json());
// Rutas de mi app
server.app.use('/', routes_1.default);
const connection = mysql_1.default.createConnection({
    host: DBC.dbconfig.host,
    user: DBC.dbconfig.user,
    password: DBC.dbconfig.password,
    database: DBC.dbconfig.database,
});
// Conectar DB
connection.connect((err) => {
    if (err)
        throw err;
    console.log("Connected!");
    /** Agrego esto acá porque en algunos casos no me dejaba terminar el proceso con Ctrl-C */
    process.on('SIGINT', function () {
        console.log("\nGracefully shutting down from SIGINT (Ctrl-C)");
        // some other closing procedures go here
        process.exit(1);
    });
});
server.app.use(cors_1.default());
// Levantar express
server.start();
exports.default = connection;
