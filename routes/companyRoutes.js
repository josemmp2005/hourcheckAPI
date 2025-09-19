import express from "express";
import { getCompany, createCompany, updateCompany, getEmployeesByCompany, getCompanyEmployee } from "../controllers/companyController.js";

const router = express.Router();

router.post("/info", getCompany);
router.post("/", createCompany);
router.put("/", updateCompany);
router.post("/employees", getEmployeesByCompany);
router.post("/employee/:user_id", getCompanyEmployee);



export default router;