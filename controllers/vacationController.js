import supabase from "../config/supabase.js";
import BreakModel from "../models/breakModel.js";
import dotenv from "dotenv";
import { verifyAuthToken } from "../utils/jwt.js";

dotenv.config();

export const requestVacation = async(req, res) => {
    const decoded = verifyAuthToken(req, res);
    if (!decoded) return;

    const { user_id, leave_type_id, start_date, end_date, status } = req.body;

    const { data, error } = await supabase
        .from(VacationModel.table)
        .insert([{
            user_id,
            leave_type_id,
            start_date,
            end_date,
            status,
            created_at: new Date()
        }]);

    if (error) {
        console.error("Error requesting vacation:", error);
        return res.status(500).json({ error: "Error requesting vacation" });
    }

    res.status(201).json({ message: "Vacation requested successfully", data });
}