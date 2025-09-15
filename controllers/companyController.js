import supabase from "../config/supabase.js";
import { CompanyModel } from "../models/companyModel.js";
import { UserModel } from "../models/userModel.js";
import { verifyAuthToken } from "../utils/jwt.js";


export const getCompany = async(req, res) => {
    const decoded = verifyAuthToken(req, res);
    if (!decoded) return;

    const companyId = req.body.id;

    console.log("Decoded Token:", decoded);

    try {
        const { data, error } = await supabase
            .from(CompanyModel.table)
            .select("*")
            .eq("id", companyId)
            .single();
        if (error) throw error;
        if (!data) {
            return res.status(404).json({ detail: "Company not found" });
        }
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};


export const createCompany = async(req, res) => {
    try {
        const decoded = verifyAuthToken(req, res);
        if (!decoded) return;

        const { data: user, error: userError } = await supabase
            .from(UserModel.table)
            .select("*")
            .eq("email", decoded.email)
            .single();

        if (userError || !user) {
            return res.status(403).json({ error: "User not found" });
        }

        const { name, address, phone, email, photo_url } = req.body;

        const { data, error } = await supabase
            .from(CompanyModel.table)
            .insert([{ name, address, phone, email, photo_url }])
            .select();

        if (error) throw error;

        if (data && data.length > 0) {
            const companyId = data[0].id;
            await supabase
                .from("user_companies")
                .insert([{ user_id: user.id, company_id: companyId, role_id: 2 }]);
        }

        res.status(201).json(data);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const updateCompany = async(req, res) => {
    try {
        const decoded = verifyAuthToken(req, res);
        if (!decoded) return;

        const { data: user, error: userError } = await supabase
            .from(UserModel.table)
            .select("*")
            .eq("email", decoded.email)
            .single();

        if (userError || !user) {
            return res.status(403).json({ error: "User not found" });
        }

        const { id, name, address, phone, email, photo_url } = req.body;

        const { data, error } = await supabase
            .from(CompanyModel.table)
            .update({ name, address, phone, email, photo_url })
            .eq("id", id)
            .select();

        if (error) throw error;

        res.status(200).json(data);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};