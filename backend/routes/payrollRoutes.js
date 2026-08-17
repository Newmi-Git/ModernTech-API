import express from "express";
import { verifyToken, requireRole } from "../middleware/auth.js";
import { validatePayrollUpdate, handleValidation } from "../validators/payrollValidator.js";
import {
    getAllPayrollsController,
    getOnePayroll,
    editPayroll
} from "../controllers/payrollsController.js";

const router = express.Router();

router.get("/", verifyToken, requireRole("hr", "manager"), getAllPayrollsController);

router.get("/:employee_id", verifyToken, getOnePayroll);

router.put("/:employee_id", verifyToken, requireRole("hr", "manager"), validatePayrollUpdate, handleValidation, editPayroll);

export default router;