# 🚀 Prodigy_FS_02

![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-5.x-000000?logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react&logoColor=black)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-000000?logo=jsonwebtokens&logoColor=white)

A full-stack employee management system with secure admin authentication, role-based access control, and CRUD operations for employee records.

This repository contains:
- `src/` — backend API built with Node.js, Express, and MongoDB
- `Frontend/` — React + Vite dashboard with Tailwind CSS

## Table of Contents

- [🚀 Prodigy\_FS\_02](#-prodigy_fs_02)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Features](#features)
  - [Architecture](#architecture)
  - [Project Structure](#project-structure)
  - [Tech Stack](#tech-stack)
  - [Setup](#setup)
    - [Backend](#backend)
    - [Frontend](#frontend)
  - [Environment Variables](#environment-variables)
    - [Backend (`.env`)](#backend-env)
    - [Frontend (`Frontend/.env`)](#frontend-frontendenv)
  - [Running the Application](#running-the-application)
    - [Start the backend](#start-the-backend)
    - [Start the frontend](#start-the-frontend)
  - [API Endpoints](#api-endpoints)
    - [Authentication](#authentication)
    - [Employees](#employees)
  - [Authentication Notes](#authentication-notes)
  - [Troubleshooting](#troubleshooting)
  - [License](#license)
  - [Author](#author)

## Overview

`Prodigy_FS_02` is an admin-focused employee management application. The backend exposes a secure REST API, while the frontend provides a modern dashboard for managing employees with search, pagination, and inline edit/delete actions.

## Features

- JWT-based authentication
- Role-based access control for admin users
- Full employee CRUD operations
- Search and pagination for employee listings
- Responsive React dashboard with reusable UI components
- Centralized backend validation and error handling

## Architecture

```
Frontend (React + Vite)
  └── Axios calls to backend API
Backend (Node.js + Express)
  ├── Auth middleware
  ├── Role middleware
  ├── Employee routes
  ├── Auth routes
  └── MongoDB via Mongoose
```

## Project Structure

```
Prodigy_FS_02/
├── Frontend/
│   ├── src/
│   ├── package.json
│   └── README.md
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── app.js
│   └── server.js
├── .env.example
├── .gitignore
├── LICENSE
├── package.json
└── README.md
```

## Tech Stack

- Node.js
- Express.js
- MongoDB / MongoDB Atlas
- Mongoose
- JSON Web Tokens (JWT)
- React
- Vite
- Tailwind CSS
- Axios

## Setup

### Backend

```bash
cd D:\Projects\Prodigy_FS_02
npm install
copy .env.example .env
```

Edit `.env` with your MongoDB connection string and JWT secret.

### Frontend

```bash
cd D:\Projects\Prodigy_FS_02\Frontend
npm install
copy .env.example .env
```

If the backend is not running at `http://localhost:5000/api`, update `VITE_API_URL` in `Frontend/.env`.

## Environment Variables

### Backend (`.env`)

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

### Frontend (`Frontend/.env`)

```env
VITE_API_URL=http://localhost:5000/api
```

## Running the Application

### Start the backend

```bash
cd D:\Projects\Prodigy_FS_02
npm run dev
```

### Start the frontend

```bash
cd D:\Projects\Prodigy_FS_02\Frontend
npm run dev
```

Open the frontend at:

- `http://localhost:5173`

## API Endpoints

### Authentication

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/users/profile`

### Employees

- `GET /api/employees`
- `GET /api/employees/:id`
- `POST /api/employees`
- `PUT /api/employees/:id`
- `DELETE /api/employees/:id`

## Authentication Notes

- All employee routes require a valid JWT.
- Only users with `role: admin` can access employee management endpoints.
- For testing, sign up a user and manually set the `role` field to `admin` in MongoDB.

## Troubleshooting

- `MONGO_URI` undefined: ensure `.env` exists and is loaded from the project root.
- `bad auth : authentication failed`: verify your MongoDB Atlas username and password.
- Frontend cannot reach backend: confirm `VITE_API_URL` and restart the frontend server.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Author

**Adarsh Pratap Singh**

Built as part of the Prodigy InfoTech Full Stack Web Development Internship (Task 2).
