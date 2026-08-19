import { body, param, validationResult } from "express-validator";

const validateEmployeeId = [
  param('employee_id')
    .isInt({ min: 1 })
    .withMessage('Employee ID must be a positive integer.')
];

const validateEmployee = [
  body('name').trim().escape().notEmpty().withMessage('Name is required.'),
  body('position').trim().escape().notEmpty().withMessage('Position is required.'),
  body('department').trim().escape().notEmpty().withMessage('Department is required.'),
  body('salary').isFloat({ min: 0 }).withMessage('Salary must be a positive number.'),
  body('contact').trim().escape().notEmpty().withMessage('Contact is required.'),
  body('score').optional({ nullable: true }).isInt({ min: 0, max: 100 }).withMessage('Score must be between 0 and 100.'),
  body('goals_met').optional().isInt({ min: 0 }).withMessage('Goals met must be 0 or more.'),
  body('goals_total').optional().isInt({ min: 0 }).withMessage('Goals total must be 0 or more.'),
];



function handleValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
}

export { validateEmployee, validateEmployeeId, handleValidation };
