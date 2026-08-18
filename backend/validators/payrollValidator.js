import { body, validationResult } from "express-validator";

const validatePayroll = [
  body('employee_id').isInt().withMessage('Valid employee_id is required.'),
  body('hours_worked').isFloat({ min: 0 }).withMessage('Hours worked must be a positive number.'),
  body('leave_deductions').optional().isFloat({ min: 0 }).withMessage('Leave deductions must be 0 or more.'),
  body('base_salary').isFloat({ min: 0 }).withMessage('Base salary must be a positive number.'),
  body('bonus').optional().isFloat({ min: 0 }).withMessage('Bonus must be 0 or more.'),
  body('deductions').optional().isFloat({ min: 0 }).withMessage('Deductions must be 0 or more.'),
];

const validatePayrollUpdate = [
  body('hours_worked').isFloat({ min: 0 }).withMessage('Hours worked must be a positive number.'),
  body('leave_deductions').optional().isFloat({ min: 0 }).withMessage('Leave deductions must be 0 or more.'),
  body('bonus').optional().isFloat({ min: 0 }).withMessage('Bonus must be 0 or more.'),
  body('deductions').optional().isFloat({ min: 0 }).withMessage('Deductions must be 0 or more.'),
];

function handleValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
}

export { validatePayroll, validatePayrollUpdate, handleValidation };