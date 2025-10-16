import express from "express";
import { clockIn, clockOut, checkClockInStatus, getClockToday } from "../controllers/clockInController.js";

const router = express.Router();

router.post("/in", clockIn);
router.post("/out", clockOut);
router.get("/status/:companyId", checkClockInStatus);
router.get("/history", getClockToday);


export default router;