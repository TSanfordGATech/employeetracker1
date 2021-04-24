// create the DB
// db will be mysql
const mysql = require("mysql")
// where it will get the prompts from
const prompts = require("./library.prompts.js")

// make connection
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password1",
    database: "employeetracker1"
});

// throw error (copied off my previous activities) if connection cannot be established
connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    prompts.firstQ();
});

exports.connection = connection


