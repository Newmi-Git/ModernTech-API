import pool from "../config/db.js";

const getAllPayrolls = async () => {
    const [rows] = await pool.query("SELECT * FROM payroll");
    return rows;
};

const getPayrollByEmployeeId = async (employee_id) => {
    const [rows] = await pool.query(
        "SELECT * FROM payroll WHERE employee_id = ?",
        [employee_id]
    );
    return rows;
};

const createPayroll = async (employee_id, hours_worked, leave_deductions, base_salary, bonus, deductions) => {
    const final_salary = base_salary + bonus - deductions;

    const [result] = await pool.query(
        `INSERT INTO payroll
        (employee_id, hours_worked, leave_deductions, base_salary, bonus, deductions, final_salary)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [employee_id, hours_worked, leave_deductions, base_salary, bonus, deductions, final_salary]
    );
    return result.insertId;
};

const updatePayroll = async (employee_id, hours_worked, leave_deductions, bonus, deductions) => {
    const [existing] = await pool.query(
        "SELECT base_salary FROM payroll WHERE employee_id = ?",
        [employee_id]
    );

    if (existing.length === 0) {
        throw Object.assign(new Error("Payroll record not found."), { status: 404 });
    }

    const final_salary = existing[0].base_salary + bonus - deductions;

    await pool.query(
        `UPDATE payroll
        SET hours_worked = ?,
            leave_deductions = ?,
            bonus = ?,
            deductions = ?,
            final_salary = ?
        WHERE employee_id = ?`,
        [hours_worked, leave_deductions, bonus, deductions, final_salary, employee_id]
    );
};

const getPayrollSummary = async () => {
    const [rows] = await pool.query(`
        SELECT
            SUM(final_salary) AS totalSalary,
            AVG(final_salary) AS averageSalary,
            COUNT(*) AS employeeCount
        FROM payroll
    `);
    return rows[0];
};

export {
    getAllPayrolls,
    getPayrollByEmployeeId,
    createPayroll,
    updatePayroll,
    getPayrollSummary
};