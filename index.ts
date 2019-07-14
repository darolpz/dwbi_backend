import Server from './classes/server';
import routes from './routes/routes';
import bodyParser from 'body-parser';
import mysql from 'mysql';
import cors from 'cors';

const server = new Server();


// Body parser
server.app.use(bodyParser.urlencoded({ extended: true }));
server.app.use(bodyParser.json());

// Rutas de mi app
server.app.use('/', routes);

const connection = mysql.createConnection({
    host: "localhost",
    user: "daropl12",
    password: "Biney12",
    database: "dwbi",
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