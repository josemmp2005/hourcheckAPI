import express from "express";
import { updateCompanyUser } from "../controllers/companyUserController.js";

const router = express.Router();

router.put("/:id", updateCompanyUser);

export default router;