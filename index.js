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
});

function startApp() {
    inquirer
    .prompt([
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
            } else if (answer.action === 'View all roles') {
                viewAllRoles()
            } else if (answer.action === 'View all employees') {
                viewAllEmployees()
            } else if (answer.action === 'Add a department') {
                addNewDepartment()
            } else if (answer.action === 'Add a role') {
                addNewRole()
            } else if (answer.action === 'Add an employee') {
                addNewEmployee()
            } else if (answer.action === 'Update an employee role') {
                updateEmployeeRole()
            } else {
                console.log('Goodbye!');
                connection.end();
            }
        });
}

function viewAllDepartments() {
    connection.query('SELECT * FROM department', (err, departments) => {
        if (err) throw err;
        console.table(departments);
        startApp();
    });
}

function viewAllRoles() {
    connection.query('SELECT * FROM role', (err, roles) => {
        if (err) throw err;
        console.table(roles);
        startApp();
    });
}

function viewAllEmployees() {
    const query = `
    SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, rol.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    FROM employee
    INNER JOIN role ON employee.role_id = role.id
    INNER JOIN department ON role.department_id = department.id
    LEFT JOIN employee AS manager ON employee.manager_id = manager.id
    `;
    connection.query(query, (err, employees) => {
        if (err) throw err;
        console.table(employees);
        startApp();
    });
}

function addNewDepartment() {
    inquirer
    .prompt([
        {
            name: 'name',
            type: 'input',
            message: 'Enter the name of the new department:',
            validate: (input) => {
                if (input.trim() === '') {
                    return 'Please enter the department name.';
                }
                return true;
            },
        },
    ])
    .then((answers) => {
        connection.query(
            'INSERT INTO department (name) VALUES (?)',
            [answers.name],
            (err) => {
                if (err) throw err;
                console.log('New department added successfully!');
                startApp();
            }
        );
    });
}

function addNewRole() {
    connection.query('SELECT * FROM department', (err, departments) => {
        if (err) throw err;
        const departmentChoices = departments.map((department) => ({
            name: department.name,
            value: department.id,
        }));
        inquirer
        .prompt([
            {
                name: 'title',
                type: 'input',
                message: 'Enter the title of the new role:',
                validate: (input) => {
                    if (input.trim() === '') {
                        return 'Please enter the role title.';
                    }
                    return true;
                },
            },
            {
                name: 'salary',
                type: 'number',
                message: 'Enter the salary for the new role:',
                validate: (input) => {
                    if (isNaN(input) || input <= 0) {
                        return 'Please enter a valid salary.';
                    }
                    return true;
                },
            },
            {
                name: 'departmentId',
                type: 'list',
                message: 'Select the department for the new role:',
                choices: departmentChoices,
            },
        ])
        .then((answers) => {
            connection.query(
                'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)',
                [answers.title, answers.salary, answers.departmentId],
                (err) => {
                    if (err) throw err;
                    console.log('New role added successfully!');
                    startApp();
                }
            );
        });
    });
}

function addNewEmployee() {
    connection.query('SELECT * FROM role', (err, roles) => {
        if (err) throw err;
        const roleChoices = roles.map((role) => ({
            name: role.title,
            value: role.id,
        }));
        inquirer.prompt([
            {
                name: 'firstName',
                type: 'input',
                message: "Enter the employee's first name:",
                validate: (input) => {
                    if (input.trim() === '') {
                        return "Please enter the employee's first name.";
                    }
                    return true;
                },
            },
            {
                name: 'lastName',
                type: 'input',
                message: "Enter the employee's last name:",
                validate: (input) => {
                    if (input.trim() === '') {
                        return "Please enter the employee's last name.";
                    }
                    return true;
                },
            },
            {
                name: 'roleId',
                type: 'list',
                message: "Select the employee's role:",
                choices: roleChoices,
            },
            {
                name: 'managerId',
                type: 'input',
                message: "Enter the employee's manager ID (optional):",
                validate: (input) => {
                    if (input.trim() === '') {
                        return true;
                    }
                    if (isNaN(input)) {
                        return 'Please enter a valid manager ID.';
                    }
                    return true;
                },
            },
        ])
        .then((answers) => {
            const employee = {
                first_name: answers.firstName,
                last_name: answers.lastName,
                role_id: answers.roleId,
                manager_id: answers.managerId ? answers.managerId : null,
            };
            connection.query(
                'INSERT INTO employee SET ?',
                employee,
                (err) => {
                    if (err) throw err;
                    console.log('New employee added successfully!');
                    startApp();
                }
            );
        });
    });
}

function updateEmployeeRole() {
    connection.query('SELECT * FROM employee', (err, employees) => {
        if (err) throw err;
        const employeeChoices = employees.map((employee) => ({
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.id,
        }));
        connection.query('SELECT * FROM role', (err, roles) => {
            if (err) throw err;
            const roleChoices = roles.map((role) => ({
                name: role.title,
                value: role.id,
            }));
            inquirer
            .prompt([
                {
                    name: 'employeeId',
                    type: 'list',
                    message: 'Select the employee to update:',
                    choices: employeeChoices,
                },
                {
                    name: 'roleId',
                    type: 'list',
                    message: 'Select the new role:',
                    choices: roleChoices,
                },
            ])
            .then((answers) => {
                connection.query(
                    'UPDATE employee SET role_id = ? WHERE id = ?',
                    [answers.roleId, answers.employeeId],
                    (err) => {
                        if (err) throw err;
                        console.log('Employee role updated successfully!');
                        startApp();
                    }
                );
            });
        });
    });
}