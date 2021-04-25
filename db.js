// create the DB
// db will be mysql
const mysql = require("mysql");
// where it will get the prompts from
const prompts = require("./prompt");
// make connection
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Fatty2020",
    database: "employeetracker1"
});

// throw error (copied off my previous activities) if connection cannot be established
connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    prompts.firstQ();
});

exports.connection = connection

// Documentation from  https://www.npmjs.com/package/mysql
// var mysql      = require('mysql');
// var connection = mysql.createConnection({
//   host     : 'localhost',
//   user     : 'me',
//   password : 'secret',
//   database : 'my_db'
// });
 
// connection.connect();
 
// connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
//   if (error) throw error;
//   console.log('The solution is: ', results[0].solution);
// });
 
// connection.end();