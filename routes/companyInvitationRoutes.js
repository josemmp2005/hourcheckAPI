import express from "express";
import { createCompanyInvitation, checkCompanyInvitation } from "../controllers/companyInvitationController.js";

const router = express.Router();

router.post("/generate-invitation", createCompanyInvitation);
router.post("/check-invitation", checkCompanyInvitation);

export default router;