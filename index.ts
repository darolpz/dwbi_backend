import Server from './classes/server';
import routes from './routes/routes';
import bodyParser from 'body-parser';
import mysql from 'mysql';
import cors from 'cors';

const server = new Server();
const DBC = require( './dbconfig');

console.log(DBC.dbconfig.host);

// Body parser
server.app.use(bodyParser.urlencoded({ extended: true }));
server.app.use(bodyParser.json());

// Rutas de mi app
server.app.use('/', routes);

const connection = mysql.createConnection({
    host: DBC.dbconfig.host,
    user: DBC.dbconfig.user,
    password: DBC.dbconfig.password,
    database: DBC.dbconfig.database,
});

// Conectar DB
connection.connect((err) => {
    if (err) throw err;
    console.log("Connected!");
})

server.app.use(cors());

// Levantar express
server.start();

export default connection;