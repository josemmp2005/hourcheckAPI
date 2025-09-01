import express from "express";
import { startBreak, stopBreak } from "../controllers/breakController";

const router = express.Router();

router.post("/start", startBreak);
router.post("/stop", stopBreak);

export default router;