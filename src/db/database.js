const { Pool } = require('pg');
require('dotenv').config();

class DB {
    constructor() {
        this.pool = new Pool({
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            password: process.env.DB_PASSWORD,
            port: process.env.DB_PORT,
        });
    }

    // Department operations
    async getAllDepartments() {
        return this.pool.query('SELECT * FROM department ORDER BY id');
    }

    async addDepartment(name) {
        return this.pool.query(
            'INSERT INTO department (name) VALUES ($1) RETURNING *',
            [name]
        );
    }

    async deleteDepartment(id) {
        return this.pool.query('DELETE FROM department WHERE id = $1', [id]);
    }

    // Role operations
    async getAllRoles() {
        const query = `
            SELECT r.id, r.title, d.name AS department, r.salary 
            FROM role r 
            LEFT JOIN department d ON r.department_id = d.id 
            ORDER BY r.id
        `;
        return this.pool.query(query);
    }

    async addRole(title, salary, department_id) {
        return this.pool.query(
            'INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3) RETURNING *',
            [title, salary, department_id]
        );
    }

    async deleteRole(id) {
        return this.pool.query('DELETE FROM role WHERE id = $1', [id]);
    }

    // Employee operations
    async getAllEmployees() {
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
        return this.pool.query(query);
    }

    async addEmployee(firstName, lastName, roleId, managerId) {
        return this.pool.query(
            'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4) RETURNING *',
            [firstName, lastName, roleId, managerId]
        );
    }

    async updateEmployeeRole(employeeId, roleId) {
        return this.pool.query(
            'UPDATE employee SET role_id = $1 WHERE id = $2 RETURNING *',
            [roleId, employeeId]
        );
    }

    async updateEmployeeManager(employeeId, managerId) {
        return this.pool.query(
            'UPDATE employee SET manager_id = $1 WHERE id = $2 RETURNING *',
            [managerId, employeeId]
        );
    }

    async deleteEmployee(id) {
        return this.pool.query('DELETE FROM employee WHERE id = $1', [id]);
    }
}

module.exports = DB;
// updateEmployeeRole(employeeId, roleId) {