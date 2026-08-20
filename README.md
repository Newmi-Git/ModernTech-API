# ModernTech API

Backend service for the ModernTech HR & Payroll Management System — a
Node.js/Express REST API backed by MySQL, providing employee management,
authentication, payroll, attendance, and leave request functionality for
the ModernTech Solutions frontend.

## Tech Stack

- **Runtime:** Node.js + Express
- **Database:** MySQL
- **Auth:** JWT (jsonwebtoken) + bcrypt password hashing
- **Validation:** express-validator
- **Hosting:** Railway (API + MySQL)

## Project Structure

backend/
├── config/ # DB connection config
├── controllers/ # Route handler logic
├── middleware/ # Auth (verifyToken, requireRole)
├── models/ # DB query layer
├── routes/ # Express route definitions
├── validators/ # Request validation rules
├── utils/ # Shared helpers (caching, etc.)
├── scripts/ # One-off maintenance scripts
└── Modern-Tech-Db.sql # Full schema + seed data



## Getting Started

1. Clone the repo and install dependencies:
```bash
   cd backend
   npm install
```
2. Set up environment variables (`.env`) — DB host/user/password, `JWT_SECRET`.
3. Run the schema against your MySQL instance:
```bash
   mysql -u <user> -p < backend/Modern-Tech-Db.sql
```
4. Start the server:
```bash
   npm start
```


# USER LOGINS

## HR LOGIN
EMAIL: lungile.moyo@moderntech.com
Password: HrAdmin123!

## Employee LOGIN
EMAIL: thabo.molefe@moderntech.com
Password: Employee123!

## Documentation

Each core area of the system is documented separately by the person who
built it:

| Area | Author | Docs |
|---|---|---|
| Database schema, ERD & seed data | Stephan | [backend/README.md](./backend/README.md) |
| Auth, authorization & caching strategy | Newmi | [docs/backend-auth-caching.md](./docs/backend-auth-caching.md) |
| _(add area)_ | Vuyo | *coming soon* |
| _(add area)_ | Karah | *coming soon* |

## API Testing

Postman collection and testing notes are in [`Testing/`](./Testing).

## Related Repos

- Frontend: [ModernTech-Solutions](https://github.com/Newmi-Git/ModernTech-Solutions)


## Authentication & Authorization

Login (`POST /api/auth/login`) verifies credentials with bcrypt and issues a
JWT containing `userId`, `employeeId`, and `role`. Every protected route
passes through `verifyToken` middleware, which validates the token and
attaches the decoded payload to `req.user`. Role-gated routes additionally
use `requireRole(...)`, e.g. only `hr` and `manager` can view all leave
requests or approve/deny them. Employees can only submit leave requests for
themselves — `req.body.employee_id` is ignored for the `employee` role and
the employee_id is always taken from the verified token instead, preventing
a logged-in employee from filing a request under someone else's name.

## Caching Strategy

`GET /api/employees` and `GET /api/payrolls` are cached in-memory for 30
seconds (`utils/cache.js`) to reduce redundant DB reads on frequently
polled dashboard endpoints. Any write (create/update/delete) to that
resource calls `clearCached(...)` immediately afterward, so the cache never
serves stale data past the next mutation.