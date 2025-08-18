import supabase from "../config/supabase";
import { CompanyUserModel } from "../models/companyUserModel";
import { verifyAuthToken } from "../utils/jwt";

export const updateCompanyUser = async(req, res) => {
    const decoded = verifyAuthToken(req, res);
    if (!decoded) return;

    if (decoded.role !== 4) {
        return res.status(403).json({ error: "Forbidden" });
    }
};