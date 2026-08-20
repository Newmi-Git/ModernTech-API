import {
    getLeaveRequests,
    createLeaveRequest,
    updateLeaveRequest
} from "../models/leaveRequestModel.js";

import pool from "../config/db.js";
import asyncHandler from "../utils/asyncHandler.js";

const getAllLeaveRequests = async (req, res) => {
    const requests = await getLeaveRequests();
    res.json(requests);
};


const submitLeaveRequest = asyncHandler(async (req, res) => {
    const { start_date, end_date, reason } = req.body;

    const employee_id = (req.user.role === "hr" || req.user.role === "manager")
        ? (req.body.employee_id || req.user.employeeId)
        : req.user.employeeId;

    if (!employee_id) {
        return res.status(400).json({ success: false, message: "No employee record linked to this account." });
    }

    if (new Date(end_date) < new Date(start_date)) {
        return res.status(400).json({ success: false, message: "End date cannot be before start date." });
    }

    await createLeaveRequest(employee_id, start_date, end_date, reason);
    res.json({success: true, message: "Leave request submitted successfully" });
});

const updateLeaveRequestStatus = async (req, res) => {
    const { request_id } = req.params;
    const { status } = req.body;

    await updateLeaveRequest(request_id, status);

    if (status === "Approved") {
        const [request] = await pool.query(
            `SELECT employee_id, start_date, end_date
             FROM leave_requests
             WHERE request_id = ?`,
            [request_id]
        );

        if (request.length > 0) {
            const { employee_id, start_date, end_date } = request[0];

            let current = new Date(start_date);
            const end = new Date(end_date);

            while (current <= end) {
                await pool.query(
                    `INSERT INTO attendance (employee_id, date, status)
                     VALUES (?, ?, 'Leave')
                     ON DUPLICATE KEY UPDATE status = 'Leave'`,
                    [employee_id, current.toISOString().slice(0, 10)]
                );
                current.setDate(current.getDate() + 1);
            }
        }
    }

    res.json({success: true, message: `Leave request ${status.toLowerCase()} successfully` });
};


export {
    getAllLeaveRequests,
    submitLeaveRequest,
    updateLeaveRequestStatus
};