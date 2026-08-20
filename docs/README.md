# ModernTech API

Backend REST API for the **ModernTech Solutions HR Management System**.

This backend provides API functionality for managing employees, payroll, attendance, leave requests, and authentication. The project was developed using Node.js, Express, and MySQL, with a focus on clean code organization, secure authentication, and performance optimization.

---

## Technologies Used

* **Node.js** — JavaScript runtime
* **Express.js** — API framework
* **MySQL** — Database
* **mysql2** — MySQL database driver
* **dotenv** — Environment variable management
* **JWT (jsonwebtoken)** — User authentication
* **bcrypt** — Password hashing
* **CORS** — Cross-origin requests
* **Express Rate Limit** — Login rate limiting
* **express-validator** — Server-side validation

---

# API Routes

All API routes use the `/api` prefix.

## Employees

Base route:

```text
/api/employees
```

Available operations include:

```http
GET    /api/employees
GET    /api/employees/:employee_id
POST   /api/employees
PUT    /api/employees/:employee_id
DELETE /api/employees/:employee_id
```

Employee list requests also support pagination:

```http
GET /api/employees?page=1&limit=10
```

---

## Payroll

Base route:

```text
/api/payrolls
```

Available operations:

```http
GET /api/payrolls
GET /api/payrolls/:employee_id
PUT /api/payrolls/:employee_id
GET /api/payrolls/summary
```

The payroll API handles payroll information including:

* Hours worked
* Leave deductions
* Final salary
* Hourly rate
* Tax
* Pension
* Medical deductions
* Net salary
* Annual salary

Payroll calculations are performed on the server so the frontend does not need to perform the calculations itself.

---

## Attendance

Base route:

```text
/api/attendance
```

The attendance API allows attendance records to be retrieved and managed.

Pagination is supported for large attendance datasets:

```http
GET /api/attendance?page=1&limit=20
```

---

## Leave Requests

Base route:

```text
/api/leave-requests
```

The leave request API supports submitting and managing employee leave requests.

Pagination is also supported:

```http
GET /api/leave-requests?page=1&limit=20
```

---

# Performance Optimizations

Several performance improvements were implemented.

---

## Connection Pooling

The API uses a MySQL connection pool rather than creating a new database connection for every request.

The pool is configured in:

```text
config/db.js
```

This allows database connections to be reused and improves the application's ability to handle multiple requests.

---

## Pagination

Pagination was added to resource lists to avoid retrieving an unnecessarily large number of records.

For example:

```http
GET /api/employees?page=1&limit=20
```

The API calculates the correct offset and retrieves only the requested records.

Pagination was implemented for:

* Employees
* Attendance
* Leave requests

This becomes increasingly useful as the database grows.

---

## Payroll Summary Caching

The payroll summary is cached temporarily in memory.

The cache stores the summary result and the time it was created.

If another request is made while the cache is still valid, the cached result can be returned instead of running another database query.

The cache is configured with a short expiration period so that the summary is refreshed regularly.

This is useful for dashboard information that does not change with every request.

---

# Code Organization

Each major API resource has its own route, controller, and model.

For example:

```text
Payroll request
      ↓
payrollRoutes.js
      ↓
payrollsController.js
      ↓
payrollModel.js
      ↓
MySQL
```

This separation makes the code easier to:

* Understand
* Test
* Debug
* Maintain
* Extend

The same approach is used for employees, attendance, and leave requests.

---

# API Testing

The API was tested using **Thunder Client**.

Testing included:

* Starting and stopping the server
* Testing GET endpoints
* Testing individual employee/payroll endpoints
* Testing POST and PUT requests
* Testing pagination
* Testing the payroll summary
* Testing authentication
* Testing protected endpoints
* Testing JWT authorization
* Checking database results

Example:

```http
GET http://localhost:5000/api/payrolls/summary
```

Protected endpoints require:

```text
Authorization: Bearer YOUR_TOKEN
```

---

