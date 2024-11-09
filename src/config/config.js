// const { config } = require("nodemon")

const { default: Separator } = require("inquirer/lib/objects/separator")

// require config()
require("dotenv").config()
const config = {
    database: {
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME,
    },
    // Table name
    table: {
        department: "department",
        role: "role",
        employee: "employee",
    },
// Field constraints
    constraints: {
       maxNameLength: 30,
       minSalary: 0,
    },
    // Menu Configurations
    menuStyle: {
        Separator: new Separator(),
    },
}