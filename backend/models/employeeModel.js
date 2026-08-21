import pool from "../config/db.js";

const getEmployees = async (page, limit) => {
    if (page && limit) {
        const offset = (Number(page) - 1) * Number(limit);
        const [rows] = await pool.query(
            "SELECT * FROM employees LIMIT ? OFFSET ?",
            [Number(limit), offset]
        );
        return rows;
    }
    const [rows] = await pool.query("SELECT * FROM employees");
    return rows;
};

const getEmployeeById = async (employee_id) => {
    const [rows] = await pool.query(
        "SELECT * FROM employees WHERE employee_id = ?",
        [employee_id]
    );
    return rows[0];
};

const createEmployee = async (
    name, position, department, salary,
    employment_history, contact, score, goals_met, goals_total
) => {
    const [result] = await pool.query(
        `INSERT INTO employees
        (name, position, department, salary, employment_history, contact, score, goals_met, goals_total)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [name, position, department, salary, employment_history, contact, score, goals_met, goals_total]
    );
    return result.insertId;
};

const updateEmployee = async (
    employee_id, name, position, department, salary,
    employment_history, contact, score, goals_met, goals_total
) => {
    await pool.query(
        `UPDATE employees
        SET name = ?, position = ?, department = ?, salary = ?,
            employment_history = ?, contact = ?, score = ?, goals_met = ?, goals_total = ?
        WHERE employee_id = ?`,
        [name, position, department, salary, employment_history, contact, score, goals_met, goals_total, employee_id]
    );
};

const deleteEmployee = async (employee_id) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        // Delete the login FIRST. If we delete the employee first, the FK's
        // ON DELETE SET NULL just nulls employee_id on this row instead of
        // removing it — leaving an orphaned account whose email is
        // permanently marked as taken, even though nothing shows it anywhere.
        await connection.query("DELETE FROM users WHERE employee_id = ?", [employee_id]);
        await connection.query("DELETE FROM employees WHERE employee_id = ?", [employee_id]);
        await connection.commit();
    } catch (err) {
        await connection.rollback();
        throw err;
    } finally {
        connection.release();
    }
};

export {
    getEmployees,
    getEmployeeById,
    createEmployee,
    updateEmployee,
    deleteEmployee
};