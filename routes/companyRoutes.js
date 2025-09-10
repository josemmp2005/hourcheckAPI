import express from "express";
import { getCompanie, createCompany } from "../controllers/companyController.js";

const router = express.Router();

router.post("/info", getCompanie);
router.post("/", createCompany);


export default router;