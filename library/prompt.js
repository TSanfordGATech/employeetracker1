// Following the read me, lets add in the dependicies: 
// Database is going through mysql
const mysql = require("mysql");
const inquirer = require("inquirer");
const db = require("../db");
const colors = require("colors")

// Build a command-line application that at a minimum allows the user to:
// Determine what action they wish to complete: 

function promptone() {
    inquirer.prompt([
        {
            type: "list",
            message: "would you like to add, view, or modify?",
            name: "firstprompta"
        }
    ]).then(function (deptAnswers) {
        if (deptAnswers.firstQChoice === "add") {
            addWhat(deptAnswers)
        } else if (deptAnswers.firstQChoice === "view") {
            viewWhat(deptAnswers)
        } else {
            modifyWhat(deptAnswers)
        }
    });
}

//   * Add departments, roles, employees
//   * View departments, roles, employees
//   * Update employee roles

// Bonus points if you're able to:
//   * Update employee managers
//   * View employees by manager
//   * Delete departments, roles, and employees
//   * View the total utilized budget of a department -- ie the combined salaries of all employees in that department


