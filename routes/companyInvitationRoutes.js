import express from "express";
import { createCompanyInvitation } from "../controllers/companyInvitationController.js";

const router = express.Router();

router.post("/generate-invitation", createCompanyInvitation);

export default router;