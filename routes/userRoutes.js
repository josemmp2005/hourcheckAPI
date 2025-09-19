import express from "express";
import { getUser, createUser, loginUser, getUserCompanies, loginUserGoogle, getUserCompanyInfo, updateUser } from "../controllers/userController.js";
const router = express.Router();

router.get("/info", getUser);
router.post("/register", createUser);
router.post("/login", loginUser);
router.get("/companies", getUserCompanies);
router.post("/login/google", loginUserGoogle);
router.post("/company/info", getUserCompanyInfo);
router.put("/update", updateUser);


export default router;