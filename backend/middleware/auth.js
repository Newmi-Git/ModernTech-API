import jwt from "jsonwebtoken";

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'No token provided.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }
}

function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'You do not have permission to do this.' });
    }
    next();
  };
}


// Lets hr/manager (or whichever roles are passed in) access any record.
// Anyone else can only access the record matching their own employeeId.
// Helps with security
function requireOwnerOrRole(...allowedRoles) {
  return (req, res, next) => {
    const targetId = Number(req.params.employee_id);
    if (allowedRoles.includes(req.user.role) || req.user.employeeId === targetId) {
      return next();
    }
    return res.status(403).json({ success: false, message: 'You do not have permission to view this record.' });
  };
}

export { verifyToken, requireRole, requireOwnerOrRole };