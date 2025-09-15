import express from "express";
import { getUser, createUser, loginUser, getUserCompanies, loginUserGoogle, getUserCompanyInfo } from "../controllers/userController.js";
const router = express.Router();

router.get("/info", getUser);
router.post("/register", createUser);
router.post("/login", loginUser);
router.get("/companies", getUserCompanies);
router.post("/login/google", loginUserGoogle);
router.post("/company/info", getUserCompanyInfo);


export default router;