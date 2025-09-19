import express from "express";
import { createShift, updateShifts, getCompanyShifts, getEmployeesShifts } from "../controllers/shiftsController.js";

const router = express.Router();

router.post("/", createShift);
router.put("/:id", updateShifts);
router.get("/:company_id", getCompanyShifts);
router.get("/:company_id/employees", getEmployeesShifts);

export default router;