import express from "express";
import { clockIn, clockOut, checkClockInStatus } from "../controllers/clockInController.js";

const router = express.Router();

router.post("/in", clockIn);
router.post("/out", clockOut);
router.get("/status", checkClockInStatus);

export default router;