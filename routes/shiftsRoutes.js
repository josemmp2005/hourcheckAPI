import express from "express";
import { createShift, updateShifts, getCompanyShifts, getEmployeesShifts, getEmployeeShift } from "../controllers/shiftsController.js";

const router = express.Router();

router.post("/", createShift);
router.put("/:id", updateShifts);
router.get("/:company_id", getCompanyShifts);
router.get("/:company_id/employees", getEmployeesShifts);
router.get("/:company_id/employee/:employee_id", getEmployeeShift);


export default router;