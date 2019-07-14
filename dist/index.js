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
// Body parser
server.app.use(body_parser_1.default.urlencoded({ extended: true }));
server.app.use(body_parser_1.default.json());
// Rutas de mi app
server.app.use('/', routes_1.default);
const connection = mysql_1.default.createConnection({
    host: "localhost",
    user: "daropl12",
    password: "Biney12",
    database: "dwbi",
});
// Conectar DB
connection.connect((err) => {
    if (err)
        throw err;
    console.log("Connected!");
});
server.app.use(cors_1.default());
// Levantar express
server.start();
exports.default = connection;
