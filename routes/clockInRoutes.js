import express from "express";
import { clockIn, clockOut, checkClockInStatus, getClockToday, getClockHistory, getLastThreeClocks, getMinutesWorkedToday } from "../controllers/clockInController.js";

const router = express.Router();

router.post("/in", clockIn);
router.post("/out", clockOut);
router.get("/status/:companyId", checkClockInStatus);
router.post("/today", getClockToday);
router.post("/history", getClockHistory);
router.post('/last-three', getLastThreeClocks);
router.post("/minutes-today", getMinutesWorkedToday);

export default router;