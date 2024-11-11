const inquirer = require('inquirer');
const figlet = require('figlet');
const gradient = require('gradient-string');
const { Pool } = require('pg');
const cTable = require('console.table');
const ora = require('ora');
const chalk = require('chalk');
require('dotenv').config();

// PostgreSQL connection configuration
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: 'staffsync_pro',
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Display banner
const displayBanner = () => {
    console.log('\n');
    console.log(
        gradient('#0066CC', '#2E8B57')(
            figlet.textSync('StaffSync Pro', {
                font: 'Standard',
                horizontalLayout: 'fitted'
            })
        )
    );
    console.log('\n');
    console.log(chalk.blue('═══════════════════════════════════════'));
    console.log(chalk.blue('  Modern Staff Management Solution v1  '));
    console.log(chalk.blue('═══════════════════════════════════════'));
    console.log('\n');
};

// Main menu options
const mainMenuChoices = [
    new inquirer.Separator(chalk.blue('════════ View Options ════════')),
    {
        name: '👥 View All Departments',
        value: 'VIEW_DEPARTMENTS'
    },
    {
        name: '💼 View All Roles',
        value: 'VIEW_ROLES'
    },
    {
        name: '👤 View All Employees',
        value: 'VIEW_EMPLOYEES'
    },
    new inquirer.Separator(chalk.blue('════════ Add Options ════════')),
    {
        name: '➕ Add Department',
        value: 'ADD_DEPARTMENT'
    },
    {
        name: '➕ Add Role',
        value: 'ADD_ROLE'
    },
    {
        name: '➕ Add Employee',
        value: 'ADD_EMPLOYEE'
    },
    new inquirer.Separator(chalk.blue('════════ Update Options ════════')),
    {
        name: '🔄 Update Employee Role',
        value: 'UPDATE_ROLE'
    },
    {
        name: '🔄 Update Employee Manager',
        value: 'UPDATE_MANAGER'
    },
    new inquirer.Separator(chalk.blue('════════ View By Options ════════')),
    {
        name: '📊 View Employees by Manager',
        value: 'VIEW_BY_MANAGER'
    },
    {
        name: '📊 View Employees by Department',
        value: 'VIEW_BY_DEPARTMENT'
    },
    {
        name: '💰 View Department Budget',
        value: 'VIEW_BUDGET'
    },
    new inquirer.Separator(chalk.blue('════════ Delete Options ════════')),
    {
        name: '❌ Delete Department',
        value: 'DELETE_DEPARTMENT'
    },
    {
        name: '❌ Delete Role',
        value: 'DELETE_ROLE'
    },
    {
        name: '❌ Delete Employee',
        value: 'DELETE_EMPLOYEE'
    },
    new inquirer.Separator(chalk.blue('════════ Exit ════════')),
    {
        name: '👋 Exit StaffSync Pro',
        value: 'EXIT'
    }
];

// Database queries
async function viewDepartments() {
    const spinner = ora('Loading departments...').start();
    try {
        const result = await pool.query('SELECT * FROM department ORDER BY id');
        spinner.succeed('Departments loaded');
        console.log('\n');
        console.table(result.rows);
    } catch (err) {
        spinner.fail('Error loading departments');
        console.error('Error:', err);
    }
    mainMenu();
}

async function viewRoles() {
    const spinner = ora('Loading roles...').start();
    try {
        const query = `
            SELECT r.id, r.title, d.name AS department, r.salary 
            FROM role r 
            LEFT JOIN department d ON r.department_id = d.id 
            ORDER BY r.id
        `;
        const result = await pool.query(query);
        spinner.succeed('Roles loaded');
        console.log('\n');
        console.table(result.rows);
    } catch (err) {
        spinner.fail('Error loading roles');
        console.error('Error:', err);
    }
    mainMenu();
}

async function viewEmployees() {
    const spinner = ora('Loading employees...').start();
    try {
        const query = `
            SELECT 
                e.id,
                e.first_name,
                e.last_name,
                r.title,
                d.name AS department,
                r.salary,
                CONCAT(m.first_name, ' ', m.last_name) AS manager
            FROM employee e
            LEFT JOIN role r ON e.role_id = r.id
            LEFT JOIN department d ON r.department_id = d.id
            LEFT JOIN employee m ON e.manager_id = m.id
            ORDER BY e.id
        `;
        const result = await pool.query(query);
        spinner.succeed('Employees loaded');
        console.log('\n');
        console.table(result.rows);
    } catch (err) {
        spinner.fail('Error loading employees');
        console.error('Error:', err);
    }
    mainMenu();
}

async function addDepartment() {
    try {
        const answer = await inquirer.prompt([
            {
                type: 'input',
                name: 'name',
                message: 'What is the name of the department?',
                validate: input => input ? true : 'Department name cannot be empty'
            }
        ]);

        const spinner = ora('Adding department...').start();
        await pool.query('INSERT INTO department (name) VALUES ($1)', [answer.name]);
        spinner.succeed(`Added ${answer.name} to departments`);
    } catch (err) {
        console.error('Error adding department:', err);
    }
    mainMenu();
}

async function addRole() {
    try {
        const departments = await pool.query('SELECT * FROM department');
        
        const answers = await inquirer.prompt([
            {
                type: 'input',
                name: 'title',
                message: 'What is the title of the role?',
                validate: input => input ? true : 'Role title cannot be empty'
            },
            {
                type: 'input',
                name: 'salary',
                message: 'What is the salary for this role?',
                validate: input => !isNaN(input) && input > 0 ? true : 'Please enter a valid salary'
            },
            {
                type: 'list',
                name: 'department_id',
                message: 'Which department does this role belong to?',
                choices: departments.rows.map(dept => ({
                    name: dept.name,
                    value: dept.id
                }))
            }
        ]);

        const spinner = ora('Adding role...').start();
        await pool.query(
            'INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)',
            [answers.title, answers.salary, answers.department_id]
        );
        spinner.succeed(`Added ${answers.title} role`);
    } catch (err) {
        console.error('Error adding role:', err);
    }
    mainMenu();
}

async function addEmployee() {
    try {
        const roles = await pool.query('SELECT * FROM role');
        const employees = await pool.query('SELECT * FROM employee');

        const answers = await inquirer.prompt([
            {
                type: 'input',
                name: 'first_name',
                message: "What is the employee's first name?",
                validate: input => input ? true : 'First name cannot be empty'
            },
            {
                type: 'input',
                name: 'last_name',
                message: "What is the employee's last name?",
                validate: input => input ? true : 'Last name cannot be empty'
            },
            {
                type: 'list',
                name: 'role_id',
                message: "What is the employee's role?",
                choices: roles.rows.map(role => ({
                    name: role.title,
                    value: role.id
                }))
            },
            {
                type: 'list',
                name: 'manager_id',
                message: "Who is the employee's manager?",
                choices: [
                    { name: 'None', value: null },
                    ...employees.rows.map(emp => ({
                        name: `${emp.first_name} ${emp.last_name}`,
                        value: emp.id
                    }))
                ]
            }
        ]);

        const spinner = ora('Adding employee...').start();
        await pool.query(
            'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)',
            [answers.first_name, answers.last_name, answers.role_id, answers.manager_id]
        );
        spinner.succeed(`Added ${answers.first_name} ${answers.last_name} to employees`);
    } catch (err) {
        console.error('Error adding employee:', err);
    }
    mainMenu();
}

// Update Employee Role
async function updateEmployeeRole() {
    try {
        // Get all employees and roles
        const employees = await pool.query('SELECT * FROM employee');
        const roles = await pool.query('SELECT * FROM role');

        const answers = await inquirer.prompt([
            {
                type: 'list',
                name: 'employee_id',
                message: 'Which employee\'s role do you want to update?',
                choices: employees.rows.map(emp => ({
                    name: `${emp.first_name} ${emp.last_name}`,
                    value: emp.id
                }))
            },
            {
                type: 'list',
                name: 'role_id',
                message: 'Which role do you want to assign to the employee?',
                choices: roles.rows.map(role => ({
                    name: role.title,
                    value: role.id
                }))
            }
        ]);

        const spinner = ora('Updating employee role...').start();
        await pool.query(
            'UPDATE employee SET role_id = $1 WHERE id = $2',
            [answers.role_id, answers.employee_id]
        );
        spinner.succeed('Employee role updated successfully');
    } catch (err) {
        console.error('Error updating employee role:', err);
    }
    mainMenu();
}

// Update Employee Manager
async function updateEmployeeManager() {
    try {
        const employees = await pool.query('SELECT * FROM employee');

        const answers = await inquirer.prompt([
            {
                type: 'list',
                name: 'employee_id',
                message: 'Which employee\'s manager do you want to update?',
                choices: employees.rows.map(emp => ({
                    name: `${emp.first_name} ${emp.last_name}`,
                    value: emp.id
                }))
            },
            {
                type: 'list',
                name: 'manager_id',
                message: 'Who is the new manager?',
                choices: [
                    { name: 'None', value: null },
                    ...employees.rows.map(emp => ({
                        name: `${emp.first_name} ${emp.last_name}`,
                        value: emp.id
                    })).filter(emp => emp.value !== answers?.employee_id)
                ]
            }
        ]);

        const spinner = ora('Updating employee manager...').start();
        await pool.query(
            'UPDATE employee SET manager_id = $1 WHERE id = $2',
            [answers.manager_id, answers.employee_id]
        );
        spinner.succeed('Employee manager updated successfully');
    } catch (err) {
        console.error('Error updating employee manager:', err);
    }
    mainMenu();
}

// View Employees by Manager
async function viewEmployeesByManager() {
    const spinner = ora('Loading employees by manager...').start();
    try {
        const query = `
            SELECT 
                CONCAT(m.first_name, ' ', m.last_name) AS manager,
                STRING_AGG(CONCAT(e.first_name, ' ', e.last_name), ', ') AS employees,
                COUNT(*) as employee_count
            FROM employee e
            LEFT JOIN employee m ON e.manager_id = m.id
            WHERE e.manager_id IS NOT NULL
            GROUP BY m.id, m.first_name, m.last_name
            ORDER BY m.first_name, m.last_name
        `;
        const result = await pool.query(query);
        spinner.succeed('Employees by manager loaded');
        console.log('\n');
        console.table(result.rows);
    } catch (err) {
        spinner.fail('Error loading employees by manager');
        console.error('Error:', err);
    }
    mainMenu();
}

// View Employees by Department
async function viewEmployeesByDepartment() {
    const spinner = ora('Loading employees by department...').start();
    try {
        const query = `
            SELECT 
                d.name AS department,
                STRING_AGG(CONCAT(e.first_name, ' ', e.last_name), ', ') AS employees,
                COUNT(*) as employee_count
            FROM employee e
            JOIN role r ON e.role_id = r.id
            JOIN department d ON r.department_id = d.id
            GROUP BY d.id, d.name
            ORDER BY d.name
        `;
        const result = await pool.query(query);
        spinner.succeed('Employees by department loaded');
        console.log('\n');
        console.table(result.rows);
    } catch (err) {
        spinner.fail('Error loading employees by department');
        console.error('Error:', err);
    }
    mainMenu();
}

// View Department Budget
async function viewDepartmentBudget() {
    const spinner = ora('Calculating department budgets...').start();
    try {
        const query = `
            SELECT 
                d.name AS department,
                COUNT(e.id) AS employee_count,
                SUM(r.salary) AS total_budget
            FROM department d
            LEFT JOIN role r ON d.id = r.department_id
            LEFT JOIN employee e ON r.id = e.role_id
            GROUP BY d.id, d.name
            ORDER BY total_budget DESC
        `;
        const result = await pool.query(query);
        spinner.succeed('Department budgets calculated');
        console.log('\n');
        console.table(result.rows);
    } catch (err) {
        spinner.fail('Error calculating department budgets');
        console.error('Error:', err);
    }
    mainMenu();
}

// Delete department
async function deleteDepartment() {
    try {
        const departments = await pool.query('SELECT * FROM department');

        if (departments.rows.length === 0) {
            console.log(chalk.yellow('\nNo departments available to delete.'));
            return mainMenu();
        }

        const answers = await inquirer.prompt([
            {
                type: 'list',
                name: 'id',
                message: 'Which department would you like to delete?',
                choices: departments.rows.map(dept => ({
                    name: dept.name,
                    value: dept.id
                }))
            },
            {
                type: 'confirm',
                name: 'confirm',
                message: chalk.red('WARNING: This will also delete all associated roles and employees. Are you sure?'),
                default: false
            }
        ]);

        if (answers.confirm) {
            const spinner = ora('Deleting department...').start();
            await pool.query('DELETE FROM department WHERE id = $1', [answers.id]);
            spinner.succeed(chalk.green('Department deleted successfully'));
        } else {
            console.log(chalk.yellow('Deletion cancelled'));
        }
    } catch (err) {
        console.error('Error deleting department:', err);
    }
    mainMenu();
}

// Delete role
async function deleteRole() {
    try {
        const roles = await pool.query(`
            SELECT r.id, r.title, d.name as department 
            FROM role r 
            LEFT JOIN department d ON r.department_id = d.id
        `);

        if (roles.rows.length === 0) {
            console.log(chalk.yellow('\nNo roles available to delete.'));
            return mainMenu();
        }

        const answers = await inquirer.prompt([
            {
                type: 'list',
                name: 'id',
                message: 'Which role would you like to delete?',
                choices: roles.rows.map(role => ({
                    name: `${role.title} (${role.department})`,
                    value: role.id
                }))
            },
            {
                type: 'confirm',
                name: 'confirm',
                message: chalk.red('WARNING: This will remove this role from all employees. Are you sure?'),
                default: false
            }
        ]);

        if (answers.confirm) {
            const spinner = ora('Deleting role...').start();
            await pool.query('DELETE FROM role WHERE id = $1', [answers.id]);
            spinner.succeed(chalk.green('Role deleted successfully'));
        } else {
            console.log(chalk.yellow('Deletion cancelled'));
        }
    } catch (err) {
        console.error('Error deleting role:', err);
    }
    mainMenu();
}

// Delete employee
async function deleteEmployee() {
    try {
        const employees = await pool.query(`
            SELECT e.id, e.first_name, e.last_name, r.title, d.name as department
            FROM employee e
            LEFT JOIN role r ON e.role_id = r.id
            LEFT JOIN department d ON r.department_id = d.id
        `);

        if (employees.rows.length === 0) {
            console.log(chalk.yellow('\nNo employees available to delete.'));
            return mainMenu();
        }

        const answers = await inquirer.prompt([
            {
                type: 'list',
                name: 'id',
                message: 'Which employee would you like to delete?',
                choices: employees.rows.map(emp => ({
                    name: `${emp.first_name} ${emp.last_name} - ${emp.title} (${emp.department})`,
                    value: emp.id
                }))
            },
            {
                type: 'confirm',
                name: 'confirm',
                message: chalk.red('Are you sure you want to delete this employee?'),
                default: false
            }
        ]);

        if (answers.confirm) {
            const spinner = ora('Deleting employee...').start();
            await pool.query('DELETE FROM employee WHERE id = $1', [answers.id]);
            spinner.succeed(chalk.green('Employee deleted successfully'));
        } else {
            console.log(chalk.yellow('Deletion cancelled'));
        }
    } catch (err) {
        console.error('Error deleting employee:', err);
    }
}
// Main menu function
async function mainMenu() {
    try {
        const { choice } = await inquirer.prompt([
            {
                type: 'list',
                name: 'choice',
                message: 'What would you like to do?',
                choices: mainMenuChoices
            }
        ]);

        switch (choice) {
            case 'VIEW_DEPARTMENTS':
                await viewDepartments();
                break;
            case 'VIEW_ROLES':
                await viewRoles();
                break;
            case 'VIEW_EMPLOYEES':
                await viewEmployees();
                break;
            case 'ADD_DEPARTMENT':
                await addDepartment();
                break;
            case 'ADD_ROLE':
                await addRole();
                break;
            case 'ADD_EMPLOYEE':
                await addEmployee();
                break;
            case 'UPDATE_ROLE':
                await updateEmployeeRole();
                break;
            case 'UPDATE_MANAGER':
                await updateEmployeeManager();
                break;
            case 'VIEW_BY_MANAGER':
                await viewEmployeesByManager();
                break;
            case 'VIEW_BY_DEPARTMENT':
                await viewEmployeesByDepartment();
                break;
            case 'VIEW_BUDGET':
                await viewDepartmentBudget();
                break;
            case 'DELETE_DEPARTMENT':
                await deleteDepartment();
                break;
            case 'DELETE_ROLE':
                await deleteRole();
                break;
            case 'DELETE_EMPLOYEE':
                await deleteEmployee();
                break;
            case 'EXIT':
                console.log(chalk.blue('\nThank you for using StaffSync Pro!\n'));
                process.exit();
        }
    } catch (err) {
        console.error('Error:', err);
        mainMenu();
    }
}


// Initialize application
async function init() {
    try {
        displayBanner();
        mainMenu();
    } catch (error) {
        console.error(chalk.red('Failed to initialize application:', error));
        process.exit(1);
    }
}

// Start the application
init();