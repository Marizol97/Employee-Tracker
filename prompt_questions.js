require("console.table");
const mysql = require('mysql2');
const inquirer = require("inquirer");


// Connect to database
const db = mysql.createConnection(
    {
      host: 'localhost',
      // Your MySQL username,
      user: 'root',
      // Your MySQL password
      password: 'Ravebabe12!',
      database: 'employeeTracker'
    },
);

const questionToFunction = {
    'View Departments': viewDepartments,
    'View Roles': viewRoles,
    'View Employees': viewEmployees,
    'Add A Department': addDepartment,
    'Add A Role': addRole,
    'Add An Employee': addEmployee,
    'Update A Role': updateEmployeeRole,
    'Update An Employee Manager': updateEmployeeManager,
    'Delete Department': deleteDepartment,
    'Delete Role': deleteRole,
    'Delete Employee': deleteEmployee
}

const questions = [...Object.keys(questionToFunction)]



// Start the prompt functions
function askQuestions() {
    inquirer.prompt({
            type: 'list',
            name: 'menu',
            message: 'What would you like to do?',
            choices: questions, 

    }).then( answer => {
        var key = answer['menu']
        var functionToCall = questionToFunction[key]
        functionToCall.call()
    })
 };



// View all departments
function viewDepartments() {
    const sql = `SELECT * FROM department`;
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err.message)
            // res.status(500).json({ error: err.message })
            return;
        }
        console.table(result);
        askQuestions();
    });
};

// View all roles
function viewRoles() {
    const sql = `SELECT * FROM role`;
    db.query(sql, (err, result) => {
        if (err) {
            // res.status(500).json({ error: err.message })
            return;
        }
        console.table(result);
        askQuestions();
    });
};

// View all employees
function viewEmployees() {
    const sql = `SELECT employee.id,
                employee.first_name,
                employee.last_name,
                role.title AS job_title,
                department.department_name,
                role.salary,
                CONCAT(manager.first_name, ' ' ,manager.last_name) AS manager
                FROM employee
                LEFT JOIN role ON employee.role_id = role.id
                LEFT JOIN department ON role.department_id = department.id
                LEFT JOIN employee AS manager ON employee.manager_id = manager.id
                ORDER By employee.id`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        console.table(result);
        askQuestions();
    });
};

// Add departments
function addDepartment() {
    inquirer.prompt([
        {
            name: "department_name",
            type: "input",
            message: "Enter the name of the new department:"
        }
    ]).then((answer) => {

    const sql = `INSERT INTO department (department_name)
                VALUES (?)`;
    const params = [answer.department_name];
    db.query(sql, params, (err, result) => {
    if (err) throw err;
    console.log('The new department entered has been added');

        db.query(`SELECT * FROM department`, (err, result) => {
            if (err) {
                // res.status(500).json({ error: err.message })
                return;
            }
            console.table(result);
            askQuestions();
        });
    });
});
};

// Add a role
function addRole() {
    inquirer.prompt([
        {
            name: "title",
            type: "input",
            message: "Enter the title of role you want to add."
        },
        {
            name: "salary",
            type: "input",
            message: "Enter the salary associated with the role you want to add. (no dots, space or commas)"
        },
        {
            name: "department_id",
            type: "number",
            message: "Enter the department id associated with the role."
        }
    ]).then(function (response) {
        db.query("INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)", [response.title, response.salary, response.department_id], function (err, data) {
            if (err) throw err;
            console.log('The new role has been added successfully.');

            db.query(`SELECT * FROM role`, (err, result) => {
                if (err) {
                    // res.status(500).json({ error: err.message })
                    askQuestions();
                }
                console.table(result);
                askQuestions();
            });
        })
});
};

// Add employees
function addEmployee() {
    inquirer.prompt([
        {
            name: "first_name",
            type: "input",
            message: "Enter the first name of the employee."
        },
        {
            name: "last_name",
            type: "input",
            message: "Enter the last name of the employee."
        },
        {
            name: "role_id",
            type: "number",
            message: "Enter the role id associated with the employee. Enter ONLY numbers."
        },
        {
            name: "manager_id",
            type: "number",
            message: "Enter the manager's id associated with the employee. Enter ONLY numbers."
        }

    ]).then(function (response) {
        db.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)", [response.first_name, response.last_name, response.role_id, response.manager_id], function (err, data) {
            if (err) throw err;
            console.log('The new employee entered has been added successfully.');

            db.query(`SELECT * FROM employee`, (err, result) => {
                if (err) {
                    res.status(500).json({ error: err.message })
                    askQuestions();
                }
                console.table(result);
                askQuestions();
            });
        })
});
};

// Update employee role
function updateEmployeeRole() {
    inquirer.prompt([
        {
            name: "first_name",
            type: "input",
            message: "Enter the first name of the employee you want update."
        },
        {
            name: "role_id",
            type: "number",
            message: "Enter the new role number id associated with the employee you want to update. Enter ONLY numbers."
        }
    ]).then(function (response) {
        db.query("UPDATE employee SET role_id = ? WHERE first_name = ?", [response.role_id, response.first_name], function (err, data) {
            if (err) throw err;
            console.log('The new role entered has been added successfully.');

            db.query(`SELECT * FROM employee`, (err, result) => {
                if (err) {
                    // res.status(500).json({ error: err.message })
                    askQuestions();
                }
                console.table(result);
                askQuestions();
            });
        })
});
};

// Update employee manager
function updateEmployeeManager() {
    inquirer.prompt([
        {
            name: "first_name",
            type: "input",
            message: "Enter the first name of the employee you want update."
        },
        {
            name: "manager_id",
            type: "number",
            message: "Enter the new manager's id number associated with the employee you want to update. Enter ONLY numbers."
        }
    ]).then(function (response) {
        db.query("UPDATE employee SET manager_id = ? WHERE first_name = ?", [response.manager_id, response.first_name], function (err, data) {
            if (err) throw err;
            console.log("The new manager's id entered has been added successfully.");

            db.query(`SELECT * FROM employee`, (err, result) => {
                if (err) {
                    // res.status(500).json({ error: err.message })
                    askQuestions();
                }
                console.table(result);
                askQuestions();
            });
        })
});
};

// Delete department
function deleteDepartment() {
    inquirer.prompt([
        {
            name: "department_id",
            type: "number",
            message: "Enter the id of the department you want to delete. Enter ONLY numbers."
        }
    ]).then(function (response) {
        db.query("DELETE FROM department WHERE id = ?", [response.department_id], function (err, data) {
            if (err) throw err;
            console.log("The department entered has been deleted successfully.");

            db.query(`SELECT * FROM department`, (err, result) => {
                if (err) {
                    // res.status(500).json({ error: err.message })
                    askQuestions();
                }
                console.table(result);
                askQuestions();
            });
        })
});
};

// Delete role
function deleteRole() {
    inquirer.prompt([
        {
            name: "role_id",
            type: "number",
            message: "Enter the id of the role you want to delete. Enter ONLY numbers."
        }
    ]).then(function (response) {
        db.query("DELETE FROM role WHERE id = ?", [response.role_id], function (err, data) {
            if (err) throw err;
            console.log("The role entered has been deleted successfully.");

            db.query(`SELECT * FROM role`, (err, result) => {
                if (err) {
                    // res.status(500).json({ error: err.message })
                    askQuestions();
                }
                console.table(result);
                askQuestions();
            });
        })
});
};

// Delete Employee
function deleteEmployee() {
    inquirer.prompt([
        {
            name: "employee_id",
            type: "number",
            message: "Enter the id of the employee you want to delete. Enter ONLY numbers."
        }
    ]).then(function (response) {
        db.query("DELETE FROM employee WHERE id = ?", [response.employee_id], function (err, data) {
            if (err) throw err;
            console.log("The employee entered has been deleted successfully.");

            db.query(`SELECT * FROM employee`, (err, result) => {
                if (err) {
                    // res.status(500).json({ error: err.message })
                    askQuestions();
                }
                console.table(result);
                askQuestions();
            });
        })
});
};

// // View employee by manager
// function viewAllEmpByManager() {
//     const sql = `  SELECT 
//             CONCAT(manager.first_name, ' ' ,manager.last_name) AS manager,
//             employee.id, 
//             employee.first_name, 
//             employee.last_name,  
//             roles.title AS Title,
//             department.department_name, 
//             roles.salary
//             FROM employee 
//             JOIN roles ON employee.role_id = roles.id
//             JOIN department ON roles.department_id = department.id
//             LEFT JOIN  employee AS manager ON employee.manager_id = manager.id
//             ORDER BY manager`;
//       db.query(sql, (err, result) => {
//           if(err) {
//               res.status(400).json({ error: err.message });
//               return;
//           }
//           console.table(result);
//           startPrompt();
//       });
// }

module.exports = {askQuestions, db}
  