import express from "express";
import { verifyToken, requireRole } from "../middleware/auth.js";
import { validateLeaveRequest, validateLeaveStatusUpdate, handleValidation } from "../validators/leaveRequestValidator.js";
import {
    getAllLeaveRequests,
    submitLeaveRequest,
    updateLeaveRequestStatus
} from "../controllers/leaverequestController.js";

const router = express.Router();

router.get("/", verifyToken, requireRole("hr", "manager"), getAllLeaveRequests);

router.post("/", verifyToken, validateLeaveRequest, handleValidation, submitLeaveRequest);

router.put("/:request_id", verifyToken, requireRole("hr", "manager"), validateLeaveStatusUpdate, handleValidation, updateLeaveRequestStatus);

export default router;