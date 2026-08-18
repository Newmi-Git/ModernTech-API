import pool from "../config/db.js";

const getLeaveRequests = async (page, limit) => {
    if (!page || !limit) {
        const [rows] = await pool.query("SELECT * FROM leave_requests");
        return {
            rows,
            total: rows.length
        };
    }

    const offset = (Number(page) - 1) * Number(limit);

    const [rows] = await pool.query("SELECT COUNT(*)AS total FROM leave_requests");

    return {
        rows,
        total
    };
};

const createLeaveRequest = async (employee_id, start_date, end_date, reason) => {
    await pool.query(
        `INSERT INTO leave_requests
        (employee_id, start_date, end_date, reason)
        VALUES (?, ?, ?, ?)`,
        [employee_id, start_date, end_date, reason]
    );
};

const updateLeaveRequest = async (request_id, status) => {
    await pool.query(
        `UPDATE leave_requests SET status = ? WHERE request_id = ?`,
        [status, request_id]
    );
};

export { getLeaveRequests, createLeaveRequest, updateLeaveRequest };