import express from "express";
import { createShift, updateShifts } from "../controllers/shiftsController.js";

const router = express.Router();

router.post("/", createShift);
router.put("/:id", updateShifts);

export default router;