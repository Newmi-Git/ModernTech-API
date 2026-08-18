import pool from "../config/db.js";

const getAttendance = async (page, limit) => {
    if (!page || !limit){
        const [rows]= await pool.query("SELECT * FROM employees");
        return {
            rows,
            total: rows.length
        };
    }

    const offset = (Number(page) -1) * Number(limit);

    const [rows]= await pool.query("SELECT * FROM attendance LIMIT ? OFFSET ?",
        [Number(limit), offset]
    );

    const [[{ total }]] = await pool.query("SELECT COUNT(*) AS total FROM attendance"
    );

    return {
        rows,
        total
    };
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