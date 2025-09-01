import express from "express";
import { startBreak, stopBreak } from "../controllers/breakController.js";

const router = express.Router();

router.post("/start", startBreak);
router.post("/stop", stopBreak);

export default router;