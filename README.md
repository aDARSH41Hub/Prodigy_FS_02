# 🚀 Prodigy_FS_02 — Secure Employee Management REST API

![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-4.x-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-000000?logo=jsonwebtokens&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue.svg)
![GitHub stars](https://img.shields.io/github/stars/aDARSH41Hub/Prodigy_FS_02?style=social)

A secure backend system that allows **administrators** to perform full CRUD (Create, Read, Update, Delete) operations on employee records, built with **Node.js, Express.js, and MongoDB**, developed as part of the **Prodigy InfoTech Full Stack Web Development Internship** (Task 2).

Access to every employee route is restricted to authenticated admin users only, built on top of the JWT authentication system from Task 1.

---

## 📑 Table of Contents

- [🚀 Prodigy\_FS\_02 — Secure Employee Management REST API](#-prodigy_fs_02--secure-employee-management-rest-api)
  - [📑 Table of Contents](#-table-of-contents)
  - [✨ Features](#-features)
    - [🗂️ Employee Management (CRUD)](#️-employee-management-crud)
    - [🔐 Authentication \& Authorization](#-authentication--authorization)
    - [🛡️ Data Validation \& Security](#️-data-validation--security)
    - [⚙️ Backend Engineering](#️-backend-engineering)
  - [🏗️ Architecture](#️-architecture)
  - [📂 Project Structure](#-project-structure)
  - [🛠️ Tech Stack](#️-tech-stack)
  - [📌 API Documentation](#-api-documentation)
    - [0. Authentication (Signup \& Login)](#0-authentication-signup--login)
    - [1. Create Employee](#1-create-employee)
    - [2. Get All Employees (Pagination + Search)](#2-get-all-employees-pagination--search)
    - [3. Get Employee by ID](#3-get-employee-by-id)
    - [4. Update Employee](#4-update-employee)
    - [5. Delete Employee](#5-delete-employee)
  - [⚙️ Installation \& Setup](#️-installation--setup)
  - [🔑 Environment Variables](#-environment-variables)
  - [🚀 Quick API Test](#-quick-api-test)
  - [✅ Testing Checklist](#-testing-checklist)
  - [🔒 Security Highlights](#-security-highlights)
  - [🚀 Future Improvements](#-future-improvements)
  - [📄 License](#-license)
  - [👨‍💻 Author](#-author)

---

## ✨ Features

### 🗂️ Employee Management (CRUD)
- Create new employee records
- Retrieve all employees with pagination and search
- Retrieve a single employee by ID
- Update employee details
- Delete employee records

### 🔐 Authentication & Authorization
- JWT-based authentication (reused from Task 1)
- Role-based access control — every employee route is **admin-only**
- Protected routes via middleware chain (`protect` → `authorize('admin')`)

### 🛡️ Data Validation & Security
- Required-field validation (name, email, position, department, salary)
- Duplicate email prevention
- Email format validation
- Non-negative salary constraint
- Centralized error handling with meaningful status codes

### ⚙️ Backend Engineering
- RESTful API architecture
- Modular folder structure (controllers, models, routes, middleware)
- Pagination and search on list endpoint
- Audit trail via `createdBy` (tracks which admin created each record)
- MongoDB Atlas integration

---

## 🏗️ Architecture

```
Client (Admin)
  |
  | REST API Requests (with JWT)
  ↓
Express.js Server
  |
  ├── Auth Middleware (protect)
  ├── Role Middleware (authorize: admin)
  ├── Employee Routes
  ├── Employee Controller
  ├── Employee Model
  ↓
MongoDB Atlas Database
```

> Every employee request passes through JWT authentication and role-based authorization before reaching the controller, ensuring only authenticated administrators can perform CRUD operations.

---

## 📂 Project Structure

```
Prodigy_FS_02/
│
├── src/
│   │
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   └── employeeController.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── roleMiddleware.js
│   │
│   ├── models/
│   │   ├── user.js
│   │   └── employee.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   └── employeeRoutes.js
│   │
│   ├── utils/
│   │   └── generateToken.js
│   │
│   ├── app.js
│   └── server.js
│
├── .env.example
├── .gitignore
├── LICENSE
├── package.json
├── package-lock.json
└── README.md
```

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| Backend | Node.js, Express.js |
| Database | MongoDB, MongoDB Atlas, Mongoose ODM |
| Authentication & Security | JSON Web Tokens (JWT), bcrypt |
| Dev Tools | Git, GitHub, Postman, VS Code |

---

## 📌 API Documentation

> All employee endpoints require a valid JWT belonging to a user with `role: "admin"`. Sign up, log in, then include the returned token as:
> `Authorization: Bearer <JWT_TOKEN>`

### 0. Authentication (Signup & Login)

**Endpoint**
```
POST /api/auth/signup
```
```json
{
  "name": "Adarsh",
  "email": "example@gmail.com",
  "password": "password123"
}
```

**Endpoint**
```
POST /api/auth/login
```
```json
{
  "email": "example@gmail.com",
  "password": "password123"
}
```
Returns a JWT on success. To test admin-only routes below, manually set that user's `role` to `"admin"` in MongoDB Atlas after signing up — full details on the auth system are in [Prodigy_FS_01](https://github.com/aDARSH41Hub/Prodigy_FS_01).

---

### 1. Create Employee

**Endpoint**
```
POST /api/employees
```

**Request Body**
```json
{
  "name": "Priya Sharma",
  "email": "priya.sharma@company.com",
  "position": "Software Engineer",
  "department": "Engineering",
  "salary": 65000
}
```

**Response — 201 Created**
```json
{
  "success": true,
  "message": "Employee created successfully",
  "data": {
    "_id": "64f...",
    "name": "Priya Sharma",
    "email": "priya.sharma@company.com",
    "position": "Software Engineer",
    "department": "Engineering",
    "salary": 65000,
    "createdBy": "64a...",
    "createdAt": "2026-07-18T10:00:00.000Z"
  }
}
```

**Response — 400 Bad Request** (missing fields or duplicate email)
```json
{
  "success": false,
  "message": "Employee already exists"
}
```

**Response — 403 Forbidden** (non-admin user)
```json
{
  "success": false,
  "message": "Access denied: admin only"
}
```

---

### 2. Get All Employees (Pagination + Search)

**Endpoint**
```
GET /api/employees?page=1&limit=10&search=engineering
```

| Query Param | Type | Description |
|---|---|---|
| `page` | number | Page number (default: 1) |
| `limit` | number | Results per page (default: 10) |
| `search` | string | Matches against `name` or `department` (case-insensitive) |

**Response — 200 OK**
```json
{
  "success": true,
  "total": 24,
  "page": 1,
  "pages": 3,
  "count": 10,
  "data": [ /* array of employee objects */ ]
}
```

---

### 3. Get Employee by ID

**Endpoint**
```
GET /api/employees/:id
```

**Response — 200 OK**
```json
{
  "success": true,
  "data": {
    "_id": "64f...",
    "name": "Priya Sharma",
    "position": "Software Engineer",
    "department": "Engineering",
    "salary": 65000
  }
}
```

**Response — 404 Not Found**
```json
{
  "success": false,
  "message": "Employee not found"
}
```

---

### 4. Update Employee

**Endpoint**
```
PUT /api/employees/:id
```

**Request Body** (any subset of fields)
```json
{
  "position": "Senior Software Engineer",
  "salary": 78000
}
```

**Response — 200 OK**
```json
{
  "success": true,
  "message": "Employee updated successfully",
  "data": { /* updated employee object */ }
}
```

---

### 5. Delete Employee

**Endpoint**
```
DELETE /api/employees/:id
```

**Response — 200 OK**
```json
{
  "success": true,
  "message": "Employee deleted successfully"
}
```

**Response — 404 Not Found**
```json
{
  "success": false,
  "message": "Employee not found"
}
```

---

## ⚙️ Installation & Setup

```bash
# Clone the repository
git clone https://github.com/aDARSH41Hub/Prodigy_FS_02.git

# Navigate to project
cd Prodigy_FS_02

# Install dependencies
npm install

# Create your .env file (see below)

# Run in development (with nodemon)
npm run dev

# Run in production
npm start
```

> ℹ️ To test admin-only routes, sign up a user via `/api/auth/signup`, then manually set that user's `role` field to `"admin"` in MongoDB Atlas — there is intentionally no public endpoint to self-assign admin access.

---

## 🔑 Environment Variables

Copy `.env.example` to `.env` and fill in your own values:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

> ⚠️ Never commit your actual `.env` file. It's already excluded via `.gitignore`.

---

## 🚀 Quick API Test

1. **Register a user**
   `POST /api/auth/signup`

2. **Log in to obtain a JWT**
   `POST /api/auth/login`

3. **Promote your test user to `admin`** in MongoDB Atlas (edit the `role` field on that user's document directly — there's no public endpoint to self-assign admin).

4. **Include the JWT in every request below**
   `Authorization: Bearer <JWT_TOKEN>`

5. **Test the employee CRUD endpoints**
   - `POST /api/employees` — create a record
   - `GET /api/employees` — list, with optional `?page=&limit=&search=`
   - `GET /api/employees/:id` — fetch one
   - `PUT /api/employees/:id` — update
   - `DELETE /api/employees/:id` — remove

6. **Confirm access control** by repeating step 5 with a non-admin token (expect `403`) and with no token at all (expect `401`).

---

## ✅ Testing Checklist

Verified manually using Postman:

- [x] Create employee as admin → 201, record saved with `createdBy`
- [x] Create employee as non-admin → 403 Access denied
- [x] Create employee with missing required field → 400
- [x] Create employee with duplicate email → 400
- [x] Get all employees → returns paginated list
- [x] Get all employees with `?search=` → filters by name/department
- [x] Get employee by valid ID → 200 with record
- [x] Get employee by non-existent ID → 404
- [x] Update employee → 200, fields updated, validators still enforced
- [x] Delete employee → 200, then GET on same ID → 404
- [x] Access any employee route with no token → 401
- [x] Access any employee route with expired/invalid token → 401

---

## 🔒 Security Highlights

✅ JWT authentication required on every route
✅ Password hashing using bcrypt
✅ Role-based access control (admin-only employee management)
✅ Server-side input validation on all writes
✅ Duplicate-record prevention
✅ Environment variable protection (`.env` excluded from version control)
✅ Audit trail via `createdBy` reference to the creating admin

---

## 🚀 Future Improvements

- Soft delete (archive instead of permanent removal)
- Bulk import/export (CSV)
- Department-level access scoping for non-super-admins
- Activity/audit log for updates and deletions
- API documentation using Swagger
- Frontend admin dashboard
- Unit and integration testing
- Docker deployment

---

## 📄 License

This project is licensed under the MIT License.
See the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Adarsh Pratap Singh**
Computer Science Engineering Student

GitHub: [@aDARSH41Hub](https://github.com/aDARSH41Hub)
LinkedIn: [linkedin.com/in/adarsh493](https://www.linkedin.com/in/adarsh493/)

---

⭐ If you found this project useful, consider giving it a star.

*Built as part of the Prodigy InfoTech Full Stack Web Development Internship (Task 2 — Employee Management CRUD System).*