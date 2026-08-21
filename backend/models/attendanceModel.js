import pool from "../config/db.js";

const getAttendance = async (page, limit) => {
    if (page && limit) {
        const offset = (Number(page) - 1) * Number(limit);
        const [rows] = await pool.query(
            "SELECT * FROM attendance LIMIT ? OFFSET ?",
            [Number(limit), offset]
        );
        return rows;
    }
    const [rows] = await pool.query("SELECT * FROM attendance");
    return rows;
};

const createAttendance = async (employee_id, date, status) => {
    await pool.query(
        `INSERT INTO attendance (employee_id, date, status)
         VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE status = VALUES(status)`,
        [employee_id, date, status]
    );
};

export { getAttendance, createAttendance };