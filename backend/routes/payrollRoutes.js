import express from "express";
import { verifyToken, requireRole } from "../middleware/auth.js";
import { validatePayroll, validatePayrollUpdate, handleValidation } from "../validators/payrollValidator.js";
import {
    getAllPayrollsController,
    getOnePayroll,
    createNewPayroll,
    editPayroll,
    getPayrollSummaryController
} from "../controllers/payrollsController.js";

const router = express.Router();

router.get("/", verifyToken, requireRole("hr", "manager"), getAllPayrollsController);

router.get("/summary", verifyToken, requireRole("hr", "manager"), getPayrollSummaryController);

router.get("/:employee_id", verifyToken, getOnePayroll);

router.post("/", verifyToken, requireRole("hr", "manager"), validatePayroll, handleValidation, createNewPayroll);

router.put("/:employee_id", verifyToken, requireRole("hr", "manager"), validatePayrollUpdate, handleValidation, editPayroll);

export default router;