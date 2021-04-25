// Following the read me, lets add in the dependicies: 
// Database is going through mysql
const mysql = require("mysql");
const inquirer = require("inquirer");
const db = require("../db");
const colors = require("colors")
// Build a command-line application that at a minimum allows the user to:
// Determine what action they wish to complete: 
function firstQ() {
    inquirer.prompt([
        {
            type: "list",
            message: "would you like to add, view, or modify?",
            name: "firstQChoice",
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
// user selected add - so from read me we need to be able to give them the ability to add in and select which one
function addWhat() {
    inquirer.prompt([
        {
            type: "list",
            message: "what would you like to add?",
            name: "addWhatChoice",
            choices: ["Department", "Role", "Employee"]
        }
    ]).then(function (addWhatAnswers) {
        if (addWhatAnswers.addWhatChoice === "Department") {
            addDept()
        } else if (addWhatAnswers.addWhatChoice === "Role") {
            addRole()
        } else {
            addEmployee();
        }
    })
}
//   * View departments, roles, employees
//   * Update employee roles

// Bonus points if you're able to:
//   * Update employee managers
//   * View employees by manager
//   * Delete departments, roles, and employees
//   * View the total utilized budget of a department -- ie the combined salaries of all employees in that department


