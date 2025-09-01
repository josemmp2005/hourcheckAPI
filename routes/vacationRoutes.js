import express from "express";
import { requestVacation } from "../controllers/vacationController.js";

const router = express.Router();

router.post("/", requestVacation);

export default router;