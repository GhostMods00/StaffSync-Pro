
# StaffSync Pro 👥

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[![Node.js Version](https://img.shields.io/badge/node-v14+-blue.svg)](https://nodejs.org/)

[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-v13+-blue.svg)](https://www.postgresql.org/)

[![Inquirer](https://img.shields.io/badge/Inquirer-v8.2.4-green.svg)](https://www.npmjs.com/package/inquirer)

A modern, command-line employee management system built with Node.js and PostgreSQL. StaffSync Pro provides a robust solution for managing your organization's departments, roles, and employees with an intuitive interface and comprehensive features.

![StaffSync Pro Banner](https://i.imgur.com/JZMaiTY.png)

## 🌟 Features

- **Department Management**
  - View all departments
  - Add new departments
  - Delete departments
  - View department budgets

- **Role Management**
  - View all roles with salaries
  - Add new roles
  - Delete roles
  - Associate roles with departments

- **Employee Management**
  - View all employees
  - Add new employees
  - Update employee roles
  - Update employee managers
  - View employees by manager
  - View employees by department

## Video Demo

https://drive.google.com/file/d/1lpsFRjFF3QWJ3FauO0sCKjiCxsI3a9pd/view

## 📋 Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (v14 or higher)
- PostgreSQL (v13 or higher)
- npm (Node Package Manager)

## 🚀 Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/staffsync-pro.git
cd staffsync-pro
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
DB_USER=postgres
DB_HOST=localhost
DB_NAME=staffsync_pro
DB_PASSWORD=your_password
DB_PORT=5432
```

4. Set up the database:
```bash
psql -U postgres -f src/db/schema.sql
```

5. Start the application:
```bash
npm start
```

## 💻 Usage

Navigate through the application using the arrow keys and Enter key. The main menu provides the following options:

### View Operations
- 👥 View All Departments
- 💼 View All Roles
- 👤 View All Employees

### Add Operations
- ➕ Add Department
- ➕ Add Role
- ➕ Add Employee

### Update Operations
- 🔄 Update Employee Role
- 🔄 Update Employee Manager

### Analysis Operations
- 📊 View Employees by Manager
- 📊 View Employees by Department
- 💰 View Department Budget

### Delete Operations
- ❌ Delete Department
- ❌ Delete Role
- ❌ Delete Employee

## 🛠️ Tech Stack

- **Node.js** - Runtime environment
- **PostgreSQL** - Database
- **Inquirer** - Command line interface
- **pg** - PostgreSQL client
- **console.table** - Table formatting
- **chalk** - Terminal styling
- **figlet** - ASCII art text
- **gradient-string** - Colorful gradients
- **ora** - Terminal spinners

## 📁 Project Structure

```
staffsync-pro/
├── src/
│   ├── db/
│   │   ├── schema.sql
│   │   └── database.js
│   └── config/
│       └── theme.js
├── .env
├── .gitignore
├── index.js
├── package.json
└── README.md
```

## 📝 Database Schema

```sql
department
- id: SERIAL PRIMARY KEY
- name: VARCHAR(30)

role
- id: SERIAL PRIMARY KEY
- title: VARCHAR(30)
- salary: DECIMAL
- department_id: INTEGER

employee
- id: SERIAL PRIMARY KEY
- first_name: VARCHAR(30)
- last_name: VARCHAR(30)
- role_id: INTEGER
- manager_id: INTEGER
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - [![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)

## 👏 Acknowledgments

- Node.js community
- PostgreSQL community
- All contributors and users of StaffSync Pro

## 📞 Support

For support, please open an issue in the GitHub repository.

## 🚀 Roadmap

- [ ]  User authentication and authorization
- [ ]  Data export functionality
- [ ]  Advanced reporting features
- [ ]  Web interface
- [ ]  API endpoints
- [ ]  Multi-language support

---


  Made with ❤️ by Waleed Zaryab
