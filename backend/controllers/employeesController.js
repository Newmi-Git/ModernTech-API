import {
    getEmployees,
    getEmployeeById,
    createEmployee,
    updateEmployee,
    deleteEmployee
} from "../models/employeeModel.js";

const getAllEmployees = async (req, res) => {
    const employees = await getEmployees();

    res.json(employees);
};

const getOneEmployee = async (req, res) => {
    const { employee_id } = req.params;
    const employee = await getEmployeeById(employee_id);

    if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
    }   

    res.json(employee);
};
import bcrypt from "bcrypt";
import crypto from "crypto";
import pool from "../config/db.js";

const createNewEmployee = async (req, res) => {
    const {
        name, position, department, salary,
        employment_history, contact, score, goals_met, goals_total,
        email, role
    } = req.body;

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const [empResult] = await connection.query(
            `INSERT INTO employees
            (name, position, department, salary, employment_history, contact, score, goals_met, goals_total)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [name, position, department, salary, employment_history, contact, score, goals_met, goals_total]
        );
        const employeeId = empResult.insertId;

        // Auto-generate email if HR didn't provide one
        const userEmail = email ||
            `${name.toLowerCase().trim().replace(/\s+/g, ".")}@moderntech.com`;

        // Generate a random temp password (e.g. "9f3a1c8b2e7d")
        const tempPassword = crypto.randomBytes(6).toString("hex");
        const passwordHash = await bcrypt.hash(tempPassword, 10);

        await connection.query(
            `INSERT INTO users (email, password_hash, role, employee_id)
            VALUES (?, ?, ?, ?)`,
            [userEmail, passwordHash, role || "employee", employeeId]
        );

        await connection.commit();

        res.status(201).json({
            message: "Employee and login account created successfully.",
            employee_id: employeeId,
            login: { email: userEmail, temporary_password: tempPassword }
        });
    } catch (err) {
        await connection.rollback();
        console.error(err);
        res.status(500).json({ success: false, message: "Failed to create employee." });
    } finally {
        connection.release();
    }
};

const editEmployee = async (req, res) => {
    const { employee_id } = req.params;

    const {
        name,
        position,
        department,
        salary,
        employment_history,
        contact,
        score,
        goals_met,
        goals_total
    } = req.body;

    await updateEmployee(
        employee_id,
        name,
        position,
        department,
        salary,
        employment_history,
        contact,
        score,
        goals_met,
        goals_total
    );

    res.json({
        message: "Employee updated successfully"
    });
};

const removeEmployee = async (req, res) => {
    const { employee_id } = req.params;

    await deleteEmployee(employee_id);

    res.json({
        message: "Employee deleted successfully"
    });
};

export {
    getAllEmployees,
    getOneEmployee,
    createNewEmployee,
    editEmployee,
    removeEmployee
};