import express from "express";
import { getCompany, createCompany } from "../controllers/companyController.js";

const router = express.Router();

router.post("/info", getCompany);
router.post("/", createCompany);


export default router;