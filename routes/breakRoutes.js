import express from "express";
import { startBreak, stopBreak, breakStatus } from "../controllers/breakController.js";

const router = express.Router();

router.post("/start", startBreak);
router.post("/stop", stopBreak);
router.post("/status", breakStatus);


export default router;