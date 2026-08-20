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