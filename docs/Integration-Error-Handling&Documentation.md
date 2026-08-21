# Frontend Contributions — Karah

**Role:** Frontend-Backend Integration, Data Persistence, Error Handling & Documentation
**Rubric components covered:** Overall frontend-backend integration,
Data persistence implementation, Error handling and user feedback,
Github documentation quality

## Overview

The frontend originally relied on DummyData JSON files, localStorage and
client-side authentication to provide application data. This work
integrates the frontend with the team's real backend API, replacing the
original client-side data flow with requests to the deployed Express API
and database.

The integration includes a central API client, JWT authentication,
role-based access handling, real employee/payroll/attendance/leave-request
API operations, persistent database-backed data, and user-facing error
handling.

The frontend is connected to the team's deployed Railway backend rather
than relying on a local backend server.

## API Integration

### Central API client

Created `js/api.js` as the central communication layer between the
frontend and backend.

The API client provides:

- A central backend API base URL
- JWT token storage and retrieval
- Session management
- A reusable `apiRequest()` fetch wrapper
- Automatic `Authorization: Bearer <token>` headers
- Authentication requests
- Employee API operations
- Payroll API operations
- Attendance API operations
- Leave-request API operations

This keeps API communication consistent across the frontend instead of
having individual pages implement their own authentication and request
handling.

### Authentication integration

Replaced the original client-side authentication flow with the backend
authentication endpoint:

`POST /api/auth/login`

The login page sends the user's email and password to the backend. The
backend returns a JWT together with the authenticated user's role and
employee ID.

The frontend stores the returned session information and uses the JWT for
subsequent protected API requests.

Role checks are performed using the role returned by the backend rather
than relying on the previous locally simulated authentication system.

### Protected API requests

Authenticated requests are handled centrally by `apiRequest()`.

The function:

- Retrieves the stored JWT
- Adds the JWT to the `Authorization` header
- Sends the request to the deployed backend
- Handles unsuccessful HTTP responses
- Processes error messages returned by the backend
- Detects `401 Unauthorized` responses
- Clears the invalid session and redirects the user to login when
  authentication expires or becomes invalid

## Employee Integration

Updated `js/employees.js` to communicate with the backend employee API
instead of relying on client-side employee data.

The frontend uses:

- `GET /api/employees`
- `GET /api/employees/:id`
- `POST /api/employees`
- `PUT /api/employees/:id`
- `DELETE /api/employees/:id`

Employee creation, editing and deletion are therefore sent to the backend
and persisted through the database rather than existing only in frontend
state.

## Payroll Integration

Updated `js/payroll.js` to retrieve payroll information from the backend
API.

The frontend uses:

- `GET /api/payrolls`
- `GET /api/payrolls/summary`
- `GET /api/payrolls/:employeeId`
- `POST /api/payrolls`
- `PUT /api/payrolls/:employeeId`

The frontend displays the payroll information returned by the backend,
including the calculated payroll values provided by the server, instead of
relying on the previous DummyData approach.

## Attendance Integration

Updated `js/attendance.js` to communicate with the backend attendance API.

The frontend uses:

- `GET /api/attendance`
- `POST /api/attendance`

Attendance information is retrieved from the backend and attendance
updates are submitted through the API so that the data can be persisted in
the database.

Attendance functionality is also integrated with employee and
leave-request data where required by the frontend.

## Leave Request Integration

Updated the leave-request functionality to communicate with the backend
leave-request API.

The frontend uses:

- `GET /api/leave-requests`
- `POST /api/leave-requests`
- `PUT /api/leave-requests/:requestId`

Employees can submit leave requests through the frontend, while
authorised users can retrieve requests and update their status.

The requests page combines employee information with leave-request data
so that requests can be displayed against the relevant employee.

## Data Persistence

The frontend was changed from relying on DummyData JSON files and
client-side state to retrieving and modifying application data through the
backend API.

Employee, payroll, attendance and leave-request operations are now sent to
the backend, allowing the database to act as the persistent source of
application data.

This means frontend changes are not dependent on the browser's local
state and can be retrieved again from the backend.

## Error Handling and User Feedback

Implemented centralised error handling through the frontend API client.

`apiRequest()` handles:

- Network connection failures
- `401 Unauthorized` responses
- Other unsuccessful HTTP responses
- JSON error responses returned by the backend
- Invalid or expired authentication sessions

When the backend returns an error message, the frontend can display that
message through the relevant page's existing popup/user-feedback system.

Network failures are also converted into a clear user-facing message
rather than leaving the user with an unexplained failed request.

This allows backend validation and authentication errors to be communicated
to the user instead of being handled only by generic client-side checks.

## Frontend Structure

As part of the integration and organisation work, the HTML pages were
placed into the `html/` directory to maintain a consistent project
structure.

The HTML pages were updated to use the correct relative paths to the
shared CSS, JavaScript and data resources.

The relevant frontend pages include:

- `html/login.html`
- `html/index.html`
- `html/employee.html`
- `html/payroll.html`
- `html/attendance.html`
- `html/requests.html`
- `html/leave-request.html`
- `html/about.html`
- `html/contact.html`
- `html/performance.html`

## Related Files

### API and authentication

- `js/api.js` — central API client, authentication headers and session
  management
- `js/auth.js` — frontend authentication and role handling

### Employee management

- `js/employees.js` — employee CRUD operations

### Payroll

- `js/payroll.js` — payroll data retrieval and display

### Attendance

- `js/attendance.js` — attendance retrieval and updates

### Leave requests

- `js/requests.js` — leave-request retrieval and management
- `js/contact-page-script.js` — leave-request submission

### HTML pages

- `html/login.html`
- `html/index.html`
- `html/employee.html`
- `html/payroll.html`
- `html/attendance.html`
- `html/requests.html`
- `html/leave-request.html`

## Deployment Integration

The frontend was configured to communicate with the team's deployed
Railway backend:

`https://moderntech-api-production.up.railway.app/api`

The deployed API was tested directly to confirm that the backend was
reachable and responding to requests.

For example:

- `POST /api/auth/login` returned the expected validation response when
  credentials were missing.
- Protected `GET /api/employees` requests correctly returned
  `401 Unauthorized` when no authentication token was supplied.

These tests confirmed that the deployed backend was active and enforcing
authentication on protected endpoints.

## Testing

The frontend-backend integration was tested by:

- Confirming the deployed Railway API was reachable.
- Confirming the authentication endpoint responded correctly.
- Confirming protected API endpoints rejected unauthenticated requests.
- Checking that the frontend HTML pages load the shared API and
  authentication scripts.
- Checking that frontend JavaScript files use the central API methods.
- Confirming the frontend was successfully connected to the deployed
  backend.
- Testing the integrated website with the team and confirming that the
  live site was running correctly.

## Documentation

This documentation records the frontend integration work completed for
the ModernTech Solutions project, including the API communication layer,
authentication integration, database-backed data flow, error handling and
deployment configuration.

The README also documents the frontend files and API operations involved
in the integration so that the project's implementation and individual
team contributions are clear.
