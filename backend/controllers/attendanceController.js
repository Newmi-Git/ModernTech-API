import {
    getAttendance,
    createAttendance
} from "../models/attendanceModel.js";

import asyncHandler from "../utils/asyncHandler.js";

const getAllAttendance = async (req, res) => {
    const { page, limit } = req.query;
    const attendance = await getAttendance(page, limit);

    res.json(attendance);
};


const markAttendance = asyncHandler(async (req, res) => {
    const { employee_id, date, status } = req.body;

    try {
        await createAttendance(employee_id, date, status);
        res.json({success: true, message: "Attendance marked successfully" });
    } catch (err) {
        if (err.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                success: false,
                message: "Attendance for this employee on this date has already been recorded."
            });
        }
        throw err;
    }
});


export {
    getAllAttendance,
    markAttendance
};