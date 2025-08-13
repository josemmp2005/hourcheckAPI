import supabase from "../config/supabase.js";
import { UserModel } from "../models/userModel.js";

export const getUsuarios = async(req, res) => {
    try {
        const { data, error } = await supabase
            .from(UserModel.table)
            .select("*");

        if (error) throw error;

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};