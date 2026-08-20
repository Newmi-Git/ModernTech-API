
# Backend Contributions — Newmi

**Role:** Authentication & Server-side Validation
**Rubric components covered:** Implementation of secure authentication,
Server-side data validation and processing

## Overview

The frontend originally used fake authentication: HR logged in with a
hardcoded access code, and employees logged in by matching `employeeId` +
surname — no password, no server-side check of any kind. This work
replaces that with real, verified authentication backed by the database,
plus server-side validation across all write endpoints.

## Authentication

### Users table
Confirmed the `users` table structure with Stephan: `userId`, `employeeId`
(nullable), `email`, `password_hash`, `role` (`hr` / `manager` / `employee`),
matching the case study's requirement for differentiated access levels.

### Seeded accounts
Since this is a closed system with no public signup, initial accounts are
created via script/SQL insert rather than a registration form. Passwords
are hashed with bcrypt (`bcrypt.hash(password, 10)`) before being inserted
— plaintext passwords are never stored.

### Login endpoint
`POST /api/auth/login` accepts email/employeeId + password, looks up the
user, and verifies the password with `bcrypt.compare()` against the stored
hash. On success, it issues a JWT (`jsonwebtoken`) containing `userId`,
`employeeId`, and `role`. On failure, it returns a generic "invalid
credentials" error — it does not reveal whether the email or the password
was the incorrect part, to avoid leaking account existence.

### Role-based route protection
Two middleware functions in `middleware/auth.js`:
- `verifyToken` — reads the JWT from the `Authorization` header, verifies
  it, and attaches the decoded payload to `req.user`.
- `requireRole(...)` — checks `req.user.role` against an allowed-roles
  list for that route, returning `403 Forbidden` if the role isn't
  permitted (e.g. only `hr`/`manager` can view or approve all leave
  requests; only `hr` can delete an employee).

These are applied across every sensitive route: employees, payroll,
attendance, and leave requests.

**Identity spoofing fix:** `POST /api/leave-requests` originally trusted
whatever `employee_id` was sent in the request body, meaning a logged-in
employee could submit a leave request under someone else's name. Fixed so
employees can only ever submit for themselves — `req.body.employee_id` is
ignored for the `employee` role, and the employee_id is always taken from
the verified token instead. `hr`/`manager` retain the ability to submit on
behalf of another employee when needed.

## Server-side Validation

Every `POST`/`PUT` endpoint (add employee, edit employee, submit leave
request, update payroll) validates that required fields are present, types
are correct (salary is a number, dates are valid), and values fall within
sensible ranges — using `express-validator`. Failures return `400` with a
specific message (e.g. "Salary must be a positive number.") rather than a
generic error.

**Null-value validation bug fix:** `express-validator`'s `.optional()`
only skips `undefined` fields by default, not `null`. This caused
`POST /api/employees` to reject every new-hire submission where `score`
was `null` (i.e. every new employee, since scores are only set later).
Fixed by adding `{ nullable: true }` to the relevant validator rules.

**Auto-hashing on employee creation:** implemented automatic bcrypt
password hashing and auto-generated login credentials
(`firstname.lastname@moderntech.com` + random temp password) whenever a
new employee record is created via `POST /api/employees`, so every new
hire gets a working login without a manual seeding step.

## Testing

- Verified login succeeds with correct credentials and fails cleanly with
  incorrect ones.
- Verified an `employee`-role token is rejected with `403` on HR-only
  routes.
- Verified invalid submissions (empty name, negative salary, malformed
  date, null score) are rejected with specific, actionable error messages
  rather than generic 500s.

## Related Files

- `middleware/auth.js` — token verification & role gating
- `controllers/leaverequestController.js` — leave request submission logic
- `validators/employeeValidator.js` — employee field validation
- `validators/leaveRequestValidator.js` — leave request field validation
- `scripts/fixPasswords.js` — one-off script to seed/reset account passwords