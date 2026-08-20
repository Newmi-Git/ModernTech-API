import {
    getAllPayrolls,
    getPayrollByEmployeeId,
    createPayroll,
    updatePayroll,
    getPayrollSummary
} from "../models/payrollModel.js";

import { getCached, setCached, clearCached } from "../utils/cache.js";

const calculatePayroll = (payroll) => {
   const denom = payroll.hours_worked - payroll.leave_deductions;
   if (!denom) {
       throw Object.assign(new Error("Invalid hours/leave deduction values."), { status: 400 });
   }
    const hourlyRate = payroll.final_salary / denom;

    const tax = payroll.final_salary * 0.18;
    const pension = payroll.final_salary * 0.05;
    const medical = payroll.final_salary * 0.02;

    const netSalary = payroll.final_salary - (tax + pension + medical);

    const annualSalary = payroll.final_salary * 12;

    return {
        ...payroll,
        hourly_rate: Number(hourlyRate.toFixed(2)),
        tax: Number(tax.toFixed(2)),
        pension: Number(pension.toFixed(2)),
        medical: Number(medical.toFixed(2)),
        net_salary: Number(netSalary.toFixed(2)),
        annual_salary: annualSalary
    };
};


const getAllPayrollsController = async (req, res) => {
    const cached = getCached("payrolls:all");

    if (cached) {
        return res.json(cached);
    }

    const payrolls = await getAllPayrolls();
    const calculatedPayrolls = payrolls.map(payroll => calculatePayroll(payroll));

    setCached("payrolls:all", calculatedPayrolls, 30_000);

    res.json(calculatedPayrolls);
};


const getOnePayroll = async (req, res) => {
    const { employee_id } = req.params;
    const payroll = await getPayrollByEmployeeId(employee_id);

    if (payroll.length === 0) {
        return res.status(404).json({success: false, message: "Payroll record not found" });
    }

    const calculatedPayroll = calculatePayroll(payroll[0]);
    res.json(calculatedPayroll);
};


const createNewPayroll = async (req, res) => {
    const { employee_id, hours_worked, leave_deductions, base_salary, bonus, deductions } = req.body;

    const payrollId = await createPayroll(
        employee_id,
        hours_worked,
        leave_deductions || 0,
        base_salary,
        bonus || 0,
        deductions || 0
    );

    clearCached("payrolls:all");

    res.status(201).json({
        success: true,
        message: "Payroll record created successfully.",
        payroll_id: payrollId
    });
};


const editPayroll = async (req, res) => {
    const { employee_id } = req.params;
    const { hours_worked, leave_deductions, bonus, deductions } = req.body;

    await updatePayroll(
        employee_id,
        hours_worked,
        leave_deductions || 0,
        bonus || 0,
        deductions || 0
    );

    clearCached("payrolls:all")

    const payroll = await getPayrollByEmployeeId(employee_id);
    const calculatedPayroll = calculatePayroll(payroll[0]);

    res.json({success: false, message: "Payroll updated successfully", payroll: calculatedPayroll });
};


const getPayrollSummaryController = async (req, res) => {
    const summary = await getPayrollSummary();
    res.json(summary);
};


export {
    getAllPayrollsController,
    getOnePayroll,
    createNewPayroll,
    editPayroll,
    getPayrollSummaryController
};