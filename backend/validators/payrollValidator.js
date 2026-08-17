import { body, validationResult } from "express-validator";

const validatePayrollUpdate = [
  body('hours_worked').isFloat({ min: 0 }).withMessage('Hours worked must be a positive number.'),
  body('leave_deductions').optional().isFloat({ min: 0 }).withMessage('Leave deductions must be 0 or more.'),
];


function handleValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
}

export { handleValidation, validatePayrollUpdate };