import supabase from "../config/supabase.js";
import BreakModel from "../models/breakModel.js";
import dotenv from "dotenv";
import { verifyAuthToken } from "../utils/jwt.js";
import { VacationModel } from "../models/vacationModel.js";

dotenv.config();

export const requestVacation = async(req, res) => {
    const decoded = verifyAuthToken(req, res);
    if (!decoded) return;

    const { user_id, leave_type_id, start_date, end_date } = req.body;

    const { data, error } = await supabase
        .from(VacationModel.table)
        .insert([{
            user_id,
            leave_type_id,
            start_date,
            end_date,
            status: "pending",
            created_at: new Date()
        }]);

    if (error) {
        console.error("Error requesting vacation:", error);
        return res.status(500).json({ error: "Error requesting vacation" });
    }

    res.status(201).json({ message: "Vacation requested successfully", data });
}

export const getVacationUserRequests = async(req, res) => {
    const decoded = verifyAuthToken(req, res);
    if (!decoded) return;
    const userId = decoded.id;
    const companyId = req.body.company_id;
    try {
        const { data, error } = await supabase
            .from(VacationModel.table)
            .select('*')
            .eq('user_id', userId)
            .eq('company_id', companyId);
        if (error) {
            console.error("Error fetching vacation requests:", error);
            return res.status(500).json({ error: "Error fetching vacation requests" });
        }
        res.status(200).json({ data });
    } catch (error) {
        console.error("Error fetching vacation requests:", error);
        res.status(500).json({ error: "Error fetching vacation requests" });
    }
}

export const getLastsVacationUserRequest = async(req, res) => {
    const decoded = verifyAuthToken(req, res);
    if (!decoded) return;
    const userId = decoded.id;
    const companyId = req.body.company_id;
    try {
        const { data, error } = await supabase
            .from(VacationModel.table)
            .select('*')
            .eq('user_id', userId)
            .eq('company_id', companyId)
            .order('created_at', { ascending: false })
            .limit(3);
        if (error) {
            console.error("Error fetching last vacation request:", error);
            return res.status(500).json({ error: "Error fetching last vacation request" });
        }
        res.status(200).json({ data });
    } catch (error) {
        console.error("Error fetching last vacation request:", error);
        res.status(500).json({ error: "Error fetching last vacation request" });
    }
}

export const approveVacation = async(req, res) => {}