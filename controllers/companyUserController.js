import supabase from "../config/supabase.js";
import { CompanyUserModel } from "../models/companyUserModel.js";
import { verifyAuthToken } from "../utils/jwt.js";

export const updateCompanyUser = async(req, res) => {
    const decoded = verifyAuthToken(req, res);
    if (!decoded) return;

    if (decoded.role === 4 || decoded.role === null) {
        return res.status(403).json({ error: "Forbidden" });
    }
};