import express from "express";
import { verifyToken, requireRole } from "../middleware/auth.js";
import {
    getAllEmployees,
    getOneEmployee,
    createNewEmployee,
    editEmployee,
    removeEmployee
} from "../controllers/employeesController.js";
import { validateEmployee, validateEmployeeId, handleValidation } from "../validators/employeeValidator.js";


const router = express.Router();

router.get("/", verifyToken, getAllEmployees);
router.get("/:employee_id", verifyToken, validateEmployeeId, handleValidation, getOneEmployee);
router.post("/", verifyToken, requireRole("hr", "manager"), validateEmployee, handleValidation, createNewEmployee);
router.put("/:employee_id", verifyToken, requireRole("hr", "manager"), validateEmployeeId, validateEmployee, handleValidation, editEmployee);
router.delete("/:employee_id", verifyToken, requireRole("hr"), validateEmployeeId, handleValidation, removeEmployee);

export default router;