import express from "express";

import {
  getAllPayrollsController,
  getOnePayroll,
  editPayroll,
  getPayrollSummaryController,
} from "../controllers/payrollsController.js";

const router = express.Router();

router.get("/", getAllPayrollsController);

router.get("/summary", getPayrollSummaryController);

router.get("/:employee_id", getOnePayroll);

router.put("/:employee_id", editPayroll);

export default router;
