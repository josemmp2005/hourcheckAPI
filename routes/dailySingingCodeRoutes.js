import express from "express";
import { getDailyCode } from "../controllers/dailySigningCodeController.js";

const router = express.Router();

router.get("/:company_id", getDailyCode);

export default router;