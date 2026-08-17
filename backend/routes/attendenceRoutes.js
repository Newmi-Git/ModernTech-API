import express from "express";
import { verifyToken, requireRole } from "../middleware/auth.js";
import { validateAttendance, handleValidation } from "../validators/attendanceValidator.js";
import {
    getAllAttendance,
    markAttendance
} from "../controllers/attendanceController.js";

const router = express.Router();

router.get("/", verifyToken, getAllAttendance);

+router.post("/", verifyToken, requireRole("hr", "manager"), validateAttendance, handleValidation, markAttendance);


export default router;