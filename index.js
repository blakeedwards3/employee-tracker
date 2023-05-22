const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'company_db'
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to the database');
    startApp();
})

function startApp() {
    inquirer.prompt([
        {
            name: 'action',
            type: 'list',
            message: 'What would you like to do?',
            choices: [
                'View all departments',
                'View all roles',
                'View all employees',
                'Add a department',
                'Add a role',
                'Add an employee',
                'Update an employee role',
                'Exit'
            ],
        },
    ])
        .then((answer) => {
            if (answer.action === 'View all departments') {
                viewAllDepartments()
            } else if (answer.action === 'View all employees') {
                viewAllEmployees()
            } else if (answer.action === 'View all Roles') {
                viewAllRoles()
            } else if (answer.action === 'Add new employee') {
                addNewEmployee()
            } else if (answer.action === 'Add new department') {
                addNewDepartment()
            } else if (answer.action === 'Add new role') {
                addNewRole()
            } else if (answer.action === 'Update employee role') {
                updateEmployeeRole()
            } else {
                connection.end()
            }
        })
}