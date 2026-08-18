import {
    getLeaveRequests,
    createLeaveRequest,
    updateLeaveRequest
} from "../models/leaveRequestModel.js";

import pool from "../config/db.js";


const getAllLeaveRequests = async (req, res) => {
    try{
        const { page, limit } = req.query;

        const { rows, total } = await getLeaveRequests(page, limit);

        if (!page || !limit) {
            return res.json(rows);
        }

        res.json({
            data: rows,
            total,
            page: Number(page),
            totalPages: Math.ceil(total / Number(limit))
        });
    } catch (err) {
        next(err);
    }
};


const submitLeaveRequest = async (req, res) => {
    const { employee_id, start_date, end_date, reason } = req.body;

    await createLeaveRequest(employee_id, start_date, end_date, reason);

    res.json({ message: "Leave request submitted successfully" });
};


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

    res.json({ message: `Leave request ${status.toLowerCase()} successfully` });
};


export {
    getAllLeaveRequests,
    submitLeaveRequest,
    updateLeaveRequestStatus
};