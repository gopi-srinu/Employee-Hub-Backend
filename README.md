# Employee Hub Backend
This is the backend API for Employee Hub HR Management System built with Node.js, Express.js, and PostgreSQL. It provides RESTful API endpoints for employee management and dashboard analytics.

## Features
- **RESTful API**: Complete CRUD operations for employee management
- **Database Integration**: PostgreSQL for data persistence
- **Express Middleware**: CORS, body parsing, and error handling
- **Dashboard Analytics**: API endpoints for employee statistics
- **Data Validation**: Input validation and sanitization

## Technology Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM/Query Builder**: pg (node-postgres)
- **Middleware**: CORS, body-parser, helmet

## Prerequisites
- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn package manager

## Installation

### Clone Repository
```bash
git clone <repository-url>
cd employee-hub-backend
```

### Install Dependencies
```bash
npm install
```

### Database Setup
Create PostgreSQL database:
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE employee_hub;

# Create user (optional)
CREATE USER hr_admin WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE employee_hub TO hr_admin;
```

### Environment Configuration
Create a `.env` file in the root directory:
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=employee_hub
DB_USER=postgres
DB_PASSWORD=your_password

# Server Configuration
PORT=3000
NODE_ENV=development

# CORS Configuration
FRONTEND_URL=http://localhost:4200
```

## Database Schema
Create the employees table:
```sql
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    department VARCHAR(50) NOT NULL,
    position VARCHAR(50),
    hire_date DATE,
    salary DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Development Server
To start the development server, run:
```bash
npm start
```
The server will start on `http://localhost:3000` by default.


## API Endpoints

### Employee Management
| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| GET | `/api/employees` | Get all employees | - |
| GET | `/api/employees/:id` | Get employee by ID | - |
| POST | `/api/employees/employee` | Create new employee | Employee object |
| PUT | `/api/employees/:id` | Update employee | Updated employee object |
| DELETE | `/api/employees/:id` | Delete employee | - |


## Database Connection
The application uses connection pooling for optimal performance:
```javascript
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

## Security
- CORS enabled for frontend communication
- Input validation and sanitization
- SQL injection prevention using parameterized queries
- Environment variables for sensitive data
