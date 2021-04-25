// Following the read me, lets add in the dependicies: 
// Database is going through mysql
const mysql = require("mysql");
const inquirer = require("inquirer");
const db = require("./db");
const colors = require("colors")
// template:
// From https://www.npmjs.com/package/inquirer
// var inquirer = require('inquirer');
// inquirer 
//   .prompt([
//     /* Pass your questions in here */
//   ])
//   .then(answers => {
//     // Use user feedback for... whatever!!
//   })
//   .catch(error => {
//     if(error.isTtyError) {
//       // Prompt couldn't be rendered in the current environment
//     } else {
//       // Something else went wrong
//     }
//   });
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
// Option selected to just view the roles
function viewWhat() {
    inquirer.prompt([
        {
            type: "list",
            message: "Sounds good, what would you like to view?",
            name: "viewWhatChoice",
            choices: ["Departments", "Roles", "Employees"]
        }
    ]).then(function (viewWhatAnswers) {
        if (viewWhatAnswers.viewWhatChoice === "Departments") {
            viewDept()
        } else if (viewWhatAnswers.viewWhatChoice === "Roles") {
            viewRole()
        } else {
            viewEmployee();
        }
    })
}
//   * Update employee roles
// read me didnt say what we were to allow them to modify so I am opening an item from the bonus which is manager
// * Update employee managers
// user chose to update a role
function modifyWhat() {
    inquirer.prompt([
        {
            type: "list",
            message: "what would you like to change?",
            name: "modifyWhatChoice",
            choices: ["Change an employee's manager", "Change an employee's role"]
        }
    ]).then(function (modifyWhatAnswers) {
        if (modifyWhatAnswers.modifyWhatChoice === "Change an employee's manager") {
            modifyMgrEmplSel()
        } else {
            modifyRoleEmplSel()
        }
    })
}
//   * Add departments, roles, employees
// user selected add - so from read me we need to be able to give them the ability to add in and select which one
// -- department piece
function addDept() {
    inquirer.prompt([
        {
            type: "input",
            message: "what is the department name?",
            name: "addDeptAnswer",
        }
    ]).then(function (newDeptResults) {
        db.connection.query(
            "INSERT INTO department SET ?",
            {
                name: newDeptResults.addDeptAnswer,
            },
            function (err, res) {
                if (err) throw err;
                console.log(`Success! ${newDeptResults.addDeptAnswer}`.underline.brightGreen)
                continueOption();
            })
    }
    )
};
// -- Roles piece ---- fields taken from schema png
function addRole() {
    db.connection.query("SELECT * FROM department", function (err, res) {
        if (err) throw err;
        inquirer.prompt([
            {
                type: "input",
                message: "Job Title?",
                name: "addRoleTitle",
            },
            {
                type: "input",
                message: "Salary?",
                name: "addRoleSalary",
            },
            {
                type: "list",
                message: "What Deparment, AKA Org, will this role be in?",
                name: "addRoleDept",
                choices: function () {
                    const choiceArrayDepts = []
                    for (let i = 0; i < res.length; i++) {
                        choiceArrayDepts.push(`${res[i].id} | ${res[i].name}`);
                    }
                    return choiceArrayDepts
                }
            },
        ]).then(function (newRoleResults) {
            if (newRoleResults.addRoleSalary != parseInt(newRoleResults.addRoleSalary)) {
                // validaiton not working
                console.log(`The salary must be numbers only.`);
                addRole();
            } else {
                db.connection.query("INSERT INTO role SET ?",
                    {
                        title: newRoleResults.addRoleTitle,
                        salary: newRoleResults.addRoleSalary,
                        department_id: parseInt(newRoleResults.addRoleDept.slice(0, 3))
                    },
                    function (err, res) {
                        if (err) throw err;
                        console.log(`Success! ${newRoleResults.addRoleTitle}`.underline.brightGreen)
                        continueOption();
                    })
            }
        })
    }
    )
}
// -- Add employee ---- fields taken from schema png
function addEmployee() {
    db.connection.query("SELECT * FROM role", function (err, res) {
        if (err) throw err;
        inquirer.prompt([
            {
                type: "input",
                message: "employee's first name",
                name: "addEmployeeNameF",
            },
            {
                type: "input",
                message: "employee's last name",
                name: "addEmployeeNameL",
            },
            {
                type: "list",
                message: "What team?",
                name: "addEmployeeRole",
                choices: function () {
                    const choiceArrayRoles = []
                    for (let i = 0; i < res.length; i++) {
                        choiceArrayRoles.push(`${res[i].id} | ${res[i].title}`);
                    }
                    return choiceArrayRoles
                }
            },
            {
                //   need to determine what type of ID to give
                type: "confirm",
                message: "Are they a Manager?",
                name: "addEmployeeIsMgr",
            },
            {
                type: "confirm",
                message: "Will they report to a manager?",
                name: "addEmployeeHasMgr",
            },
        ]).then(function (newEmployeeResults) {
            let query = db.connection.query(
                "INSERT INTO employee SET ?",
                {
                    first_name: newEmployeeResults.addEmployeeNameF,
                    last_name: newEmployeeResults.addEmployeeNameL,
                    role_id: parseInt(newEmployeeResults.addEmployeeRole.slice(0, 5)),
                    is_manager: newEmployeeResults.addEmployeeIsMgr,
                },
                function (err, res) {
                    if (err) throw err;
                    console.log(res.affectedRows + " employee inserted!\n");
                    if (newEmployeeResults.addEmployeeHasMgr === true) {
                        console.log(`associate ${newEmployeeResults.addEmployeeNameF} ${newEmployeeResults.addEmployeeNameL}, just a couple of questions about their manager`.underline.brightGreen)
                        getMgr()
                    } else {
                        console.log(`You have added` `${newEmployeeResults.addEmployeeNameF} ${newEmployeeResults.addEmployeeNameL}`.underline.brightGreen`to the team!`)
                        continueOption();
                    }
                }
            )
        })
    })
};
// Schema has IDs to relate manager and associates to. Create assignments: 
function getMgr() {
    db.connection.query("SELECT * FROM employee WHERE is_manager=1", function (err, res) {
        if (err) throw err;
        inquirer.prompt([
            {
                type: "list",
                message: "Who is their manager?",
                name: "addEmployeeMgr",
                choices: function () {
                    const choiceArrayMgrs = []
                    for (let i = 0; i < res.length - 1; i++) {
                        choiceArrayMgrs.push(`${res[i].id} | ${res[i].first_name} ${res[i].last_name}`);
                    }
                    return choiceArrayMgrs
                }
            }
        ]).then(function (mgrQ) {
            const idArr = []
            db.connection.query("SELECT id FROM employee", function (err, ans) {
                for (let i = 0; i < ans.length; i++) {
                    idArr.push(ans[i].id)
                }
                const newest = idArr[idArr.length - 1];
                const mgr = parseInt(mgrQ.addEmployeeMgr.slice(0, 5));
                if (newest === mgr) {
                    console.log(`manager and employee cannot be the same.`)
                    getMgr();
                } else {
                    addMgr(newest, mgr);
                }
            });
        })
    })
}

// Function that physically adds the manager_id attribute into the employee entry, where appropraite
function addMgr(manager, employee) {
    db.connection.query("UPDATE employee SET manager_id = ? WHERE id = ?", [employee, manager], function (err, res) {
        if (err) {
            console.log(err)
        } else {
            console.log(`Employee and manager added.`.underline.brightGreen)
            continueOption();
        }
    })
}
//   * View departments, roles, employees
// Have to create the view for each one that the user selected: 
// departments
function viewDept() {
    db.connection.query("SELECT * FROM department", function (err, res) {
        if (err) throw err;
        const deptArr = []
        for (var i = 0; i < res.length; i++) {
            deptArr.push(res[i])
        }
        console.table(deptArr);
        continueOption();
    });
}
// roles
function viewRole() {
    db.connection.query("SELECT * FROM role", function (err, res) {
        if (err) throw err;
        const roleArr = []
        for (var i = 0; i < res.length; i++) {
            roleArr.push(res[i])
        }
        console.table(roleArr);
        continueOption();
    });
}
// employees
function viewEmployee() {
    db.connection.query("SELECT * FROM employee", function (err, res) {
        if (err) throw err;
        const empArr = []
        for (var i = 0; i < res.length; i++) {
            empArr.push(res[i]);
        }
        console.table(empArr);
        continueOption();
    });
}
// update employee ---- 
function modifyRoleRoleSel(empl) {
    const employee = empl
    db.connection.query("SELECT id, title FROM role", function (err, res) {
        inquirer.prompt([
            {
                type: "list",
                message: "New role title?",
                name: "modifyRoleChangedR",
                choices: function () {
                    const choiceArrayRole = []
                    for (let i = 0; i < res.length; i++) {
                        choiceArrayRole.push(`${res[i].id} | ${res[i].title}`);
                    }
                    return choiceArrayRole
                }
            },
        ]).then(function (role) {
            const newRole = parseInt(role.modifyRoleChangedR.slice(0, 5));
            const changingEmpl = role.employee
            let query = db.connection.query("UPDATE employee SET role_id = ? WHERE id = ?", [newRole, employee], function (err, res) {
                if (err) {
                } else {
                    console.log("updated".underline.brightGreen)
                    continueOption();
                }
            })
        })
    })
}
// If chose to update the manager of an associate 
function modifyMgrEmplSel() {
    db.connection.query("SELECT id, first_name, last_name FROM employee", function (err, res) {
        if (err) throw err;
        inquirer.prompt([
            {
                type: "list",
                message: "Which employee?",
                name: "modifyMgrChangedE",
                choices: function () {
                    const choiceArrayEmpl = []
                    for (let i = 0; i < res.length; i++) {
                        choiceArrayEmpl.push(`${res[i].id} | ${res[i].first_name} ${res[i].last_name}`);
                    }
                    return choiceArrayEmpl
                }
            },
        ]).then(function (empl) {
            const changingEmpl = parseInt(empl.modifyMgrChangedE.slice(0, 5));
            modifyMgrMgrSel(changingEmpl)
        })
    })
}
// function to assign the manager
function modifyMgrMgrSel(empl) {
    const employee = empl
    db.connection.query("SELECT id, first_name, last_name FROM employee WHERE is_manager = 1", function (err, res) {
        inquirer.prompt([
            {
                type: "list",
                message: "Updated manager name?",
                name: "modifyMgrChangedM",
                choices: function () {
                    const choiceArrayMgr = []
                    for (let i = 0; i < res.length; i++) {
                        choiceArrayMgr.push(`${res[i].id} | ${res[i].first_name} ${res[i].last_name}`);
                    }
                    return choiceArrayMgr
                }
            },
        ]).then(function (people) {
            const mgr = parseInt(people.modifyMgrChangedM.slice(0, 5));
            const changingEmpl = employee

            if (mgr === changingEmpl) {
                console.log(`manager and employee id cannot be the same.`.underline.red)
                modifyMgrEmplSel()
            } else {
                db.connection.query("UPDATE employee SET manager_id = ? WHERE id = ?", [mgr, changingEmpl], function (err, res) {
                    if (err) {
                    } else {
                        console.log(`updated`.underline.brightGreen)
                        continueOption();
                    }
                })
            }
        })
    })
}
// to cycle the function and allow user to start over 
function continueOption() {
    inquirer.prompt([
        {
            type: "list",
            message: "Do you need to work on more items?",
            name: "loopAnswer",
            choices: ["yes", "no"]
        }
    ]).then(function (answer) {
        if (answer.loopAnswer === "yes") {
            firstQ()
        } else {
            console.log("session completed!".underline.brightGreen)
            db.connection.end()
        }
    })
}
exports.firstQ = firstQ
// Bonus points if you're able to:
//   * Update employee managers --- Did this one 
//   * View employees by manager
//   * Delete departments, roles, and employees
//   * View the total utilized budget of a department -- ie the combined salaries of all employees in that department
// IDK what the last one is - a number I make up or am I missing that info? 