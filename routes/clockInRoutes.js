import express from "express";
import { clockIn } from "../controllers/clockInController.js";

const router = express.Router();

router.post("/clock-in", clockIn);

export default router;