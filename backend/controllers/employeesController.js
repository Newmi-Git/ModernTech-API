import bcrypt from "bcrypt";
import crypto from "crypto";
import pool from "../config/db.js";
import {
    getEmployees,
    getEmployeeById,
    updateEmployee,
    deleteEmployee
} from "../models/employeeModel.js";
import { getCached, setCached, clearCached } from "../utils/cache.js";

const getAllEmployees = async (req, res) => {
    const cached = getCached("employees:all");

    if (cached) {
        return res.json(cached);
    }

    const employees = await getEmployees();

    setCached("employees:all", employees, 30_000);

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

        const userEmail = email ||
            `${name.toLowerCase().trim().replace(/\s+/g, ".")}@moderntech.com`;

        const tempPassword = crypto.randomBytes(6).toString("hex");
        const passwordHash = await bcrypt.hash(tempPassword, 10);

        await connection.query(
            `INSERT INTO users (email, password_hash, role, employee_id)
            VALUES (?, ?, ?, ?)`,
            [userEmail, passwordHash, role || "employee", employeeId]
        );

        await connection.commit();

        clearCached("employees:all")

        res.status(201).json({
            message: "Employee and login account created successfully.",
            employee_id: employeeId,
            login: { email: userEmail, temporary_password: tempPassword }
        });
    } catch (err) {
        await connection.rollback();
        console.error(err);

        if (err.code === "ER_DUP_ENTRY") {
            if (err.sqlMessage.includes("contact")) {
                return res.status(409).json({ success: false, message: "An employee with this contact already exists." });
            }
            if (err.sqlMessage.includes("email")) {
                return res.status(409).json({ success: false, message: "A login with this email already exists." });
            }
        }

        res.status(500).json({ success: false, message: "Failed to create employee." });
    } finally {
        connection.release();
    }
};

const editEmployee = async (req, res) => {
    const { employee_id } = req.params;

    const {
        name, position, department, salary,
        employment_history, contact, score, goals_met, goals_total
    } = req.body;

    await updateEmployee(
        employee_id, name, position, department, salary,
        employment_history, contact, score, goals_met, goals_total
    );

    clearCached("employees:all");

    res.json({ message: "Employee updated successfully" });
};

const removeEmployee = async (req, res) => {
    const { employee_id } = req.params;
    await deleteEmployee(employee_id);
    clearCached("employees:all");
    res.json({ message: "Employee deleted successfully" });
};

export {
    getAllEmployees,
    getOneEmployee,
    createNewEmployee,
    editEmployee,
    removeEmployee
};