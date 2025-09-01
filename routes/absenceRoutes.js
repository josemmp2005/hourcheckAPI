import express from "express";
import { createAbsence } from "../controllers/absenceController.js";

const router = express.Router();

router.post("/", createAbsence);

export default router;