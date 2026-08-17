import express from "express";
import dotenv from "dotenv";

import employeeRoutes from "./routes/employeeRoutes.js";

import payrollRoutes from "./routes/payrollRoutes.js";

import attendanceRoutes from "./routes/attendenceRoutes.js";

import leaveRequestRoutes from "./routes/leaverequestRoutes.js";

import authRoutes from "./routes/auth.js"

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/employees", employeeRoutes);

app.use("/api/payrolls", payrollRoutes);

app.use("/api/attendance", attendanceRoutes);

app.use("/api/leave-requests", leaveRequestRoutes);

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;


app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal server error."
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});