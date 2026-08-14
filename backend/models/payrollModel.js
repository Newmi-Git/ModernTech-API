import pool from "../config/db.js";

let payrollSummaryCache = null;
let payrollSummaryCacheTime = 0;

const CACHE_DURATION = 60 * 1000; // 60 seconds

const getAllPayrolls = async () => {
    const [rows] = await pool.query(
        "SELECT * FROM payroll"
    );

    return rows;
};

const getPayrollByEmployeeId = async (employee_id) => {
    const [rows] = await pool.query(
        "SELECT * FROM payroll WHERE employee_id = ?",
        [employee_id]
    );

    return rows;
};

const updatePayroll = async (
    employee_id,
    hours_worked,
    leave_deductions
) => {
    await pool.query(
        `UPDATE payroll
        SET hours_worked = ?,
            leave_deductions = ?
        WHERE employee_id = ?`,
        [hours_worked, leave_deductions, employee_id]
    );
};

const getPayrollSummary = async () => {
    const now = Date.now();

    if (
        payrollSummaryCache &&
        now - payrollSummaryCacheTime < CACHE_DURATION
    ) {
        return payrollSummaryCache;
    }

    const [rows] = await pool.query(`
        SELECT 
            SUM(final_salary) AS totalSalary,
            AVG(final_salary) AS averageSalary,
            COUNT(*) AS employeeCount
        FROM payroll
    `);

    payrollSummaryCache = rows[0];
    payrollSummaryCacheTime = now;

    return payrollSummaryCache;
};

export {
    getAllPayrolls,
    getPayrollByEmployeeId,
    updatePayroll,
    getPayrollSummary
};