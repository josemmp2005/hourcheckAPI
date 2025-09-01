import supabase from "../config/supabase";
import { absenceModel } from "../models/absenceModel";
import dotenv from "dotenv";
import { verifyAuthToken } from "../utils/jwt";

dotenv.config();

export const createAbsence = async(req, res) => {
    const decoded = verifyAuthToken(req, res)
    if (!decoded) return;

    const { user_id } = decoded;

    try {
        const { data, error } = await supabase
            .from(absenceModel)
            .insert([{ user_id, start_time: new Date() }]);

        if (error) throw error;

        res.status(201).json({ message: "Absence created", data });
    } catch (error) {
        console.error("Error creating absence:", error);
        res.status(500).json({ message: "Error creating absence", error });
    }
}