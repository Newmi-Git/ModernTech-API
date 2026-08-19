import { body, param, validationResult } from "express-validator";

const validateRequestId = [
  param('request_id')
    .isInt({ min: 1 })
    .withMessage('Request ID must be a positive integer.')
];

const validateLeaveRequest = [
  body('employee_id').isInt().withMessage('Valid employee_id is required.'),
  body('start_date').isDate().withMessage('A valid start date is required.'),
  body('end_date').isDate().withMessage('A valid end date is required.'),
  body('reason').trim().escape().notEmpty().withMessage('Reason is required.'),
  body('status').optional().isIn(['Pending', 'Approved', 'Denied']).withMessage("Status must be 'Pending', 'Approved', or 'Denied'."),
];
const validateLeaveStatusUpdate = [
  body('status').isIn(['Pending', 'Approved', 'Denied']).withMessage("Status must be 'Pending', 'Approved', or 'Denied'."),
];

function handleValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
}

export { validateLeaveRequest, validateLeaveStatusUpdate, validateRequestId, handleValidation };