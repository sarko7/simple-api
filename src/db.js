const mysql = require('mysql');
const dotenv = require('dotenv');
dotenv.config();

var mysqldriver = mysqldriver = mysql.createConnection({
    host: process.env.MYSQL_URL,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB
});

let connectDB = async () => {
    try {
        await mysqldriver.connect();
        console.log('Connected to database');
    } catch (err) {
        console.error(`Error while connecting to database ${err}`, err);
    }
};

exports.mysqldriver = mysqldriver;
exports.connectDB = connectDB;
// exports.mysqldriver = mysqldriver;