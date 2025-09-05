import express from "express";
import { clockIn, clockOut } from "../controllers/clockInController.js";

const router = express.Router();

router.post("/in", clockIn);
router.post("/out", clockOut);

export default router;