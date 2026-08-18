import {
    getAttendance,
    createAttendance
} from "../models/attendanceModel.js";


const getAllAttendance = async (req, res) => {
    try{
        const { page, limit } = req.query;

        const { rows, total } = await getAttendance(page, limit);

        if (!page || !limit) {
            return res.json(rows);
        }

        res.jon({
            data: rows,
            total,
            page: Number(page),
            totaalPages: Math.ceil(total / Number(limit))
        });
    } catch (err) {
        next(err);
    }
};


const markAttendance = async (req, res) => {
    const {
        employee_id,
        date,
        status
    } = req.body;

    await createAttendance(
        employee_id,
        date,
        status
    );

    res.json({
        message: "Attendance marked successfully"
    });
};


export {
    getAllAttendance,
    markAttendance
};