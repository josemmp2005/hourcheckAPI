import express from "express";
import { startBreak, stopBreak, breakStatus, getMinutesBreakToday, getBreaksHistory, getLastThreeBreaks } from "../controllers/breakController.js";

const router = express.Router();

router.post("/start", startBreak);
router.post("/stop", stopBreak);
router.get("/status/:company_id", breakStatus);
router.get("/minutes-today/:clock_in_id", getMinutesBreakToday);
router.post("/history", getBreaksHistory);
router.post('/last-three', getLastThreeBreaks);



export default router;