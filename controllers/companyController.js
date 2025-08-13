import supabase from "../config/supabase.js";
import { CompanyModel } from "../models/companyModel.js";

export const getCompanies = async(req, res) => {
    try {
        const { data, error } = await supabase
            .from(CompanyModel.table)
            .select("*");

        if (error) throw error;

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createCompany = async(req, res) => {
    try {
        const { name, address, direction, phone, email } = req.body;

        const { data, error } = await supabase
            .from(CompanyModel.table)
            .insert([{ name, address, direction, phone, email }]);

        if (error) throw error;

        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};