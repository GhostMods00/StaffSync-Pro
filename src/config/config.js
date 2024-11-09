require('dotenv').config();

const config = {
    database: {
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
    },
    
    // Table names
    tables: {
        department: 'department',
        role: 'role',
        employee: 'employee'
    },
    
    // Field constraints
    constraints: {
        maxNameLength: 30,
        minSalary: 0,
    },
    
    // Menu configurations
    menuStyles: {
        separator: '═══════════════════════════════════',
        prefix: '→',
        exitOption: 'Exit Application'
    }
};

module.exports = config;