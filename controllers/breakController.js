import supabase from '../config/supabase.js'
import { BreakModel } from '../models/breakModel.js'
import dotenv from 'dotenv'
import { verifyAuthToken } from '../utils/jwt.js'

dotenv.config();

export const startBreak = async(req, res) => {
    const decoded = verifyAuthToken(req, res);

    if (!decoded) return;

    const clock_in_id = req.body.clock_in_id;

    try {
        const { data, error } = await supabase
            .from(BreakModel.table)
            .insert([{ clock_in_id, start_time: new Date() }]);

        if (error) throw error;

        res.status(201).json({ message: "Break started", data });
    } catch (error) {
        console.error("Error starting break:", error);
        res.status(500).json({ message: "Error starting break", error });
    }
}

export const stopBreak = async(req, res) => {
    const decoded = verifyAuthToken(req, res);

    if (!decoded) return;

    const clock_in_id = req.body.clock_in_id;

    try {
        const { data, error } = await supabase
            .from(BreakModel.table)
            .update({ end_time: new Date() })
            .match({ clock_in_id });

        if (error) throw error;

        res.status(200).json({ message: "Break ended", data });
    } catch (error) {
        console.error("Error ending break:", error);
        res.status(500).json({ message: "Error ending break", error });
    }
}


export const breakStatus = async(req, res) => {
    const decoded = verifyAuthToken(req, res);
    if (!decoded) return;

    const companyId = req.params.company_id;

    try {
        const { data, error } = await supabase
            .from("clock_ins")
            .select("*")
            .eq("user_id", decoded.id)
            .eq("company_id", companyId)
            .is("check_out", null)
            .order("check_in", { ascending: false })
            .limit(1);


        if (error) {
            console.error("Supabase error:", error);
            return res.status(500).json({ message: "Error fetching break status", error });
        }
        if (data.length === 0) {
            return res.status(404).json({ message: "No active clock-in found" });
        }

        const clockInId = data[0].id;

        const { data: breakData, error: breakError } = await supabase
            .from(BreakModel.table)
            .select("*")
            .eq("clock_in_id", clockInId)
            .is("end_time", null)
            .order("start_time", { ascending: false })
            .limit(1);
        if (breakError) {
            console.error("Supabase error:", breakError);
            return res.status(500).json({ message: "Error fetching break status", error: breakError });
        }
        if (breakData.length === 0) {
            return res.status(200).json({ onBreak: false });
        }
        return res.status(200).json({ onBreak: true, breakData: breakData[0] });
    } catch (error) {
        console.error("Error fetching break status:", error);
        res.status(500).json({ message: "Error fetching break status", error });
    }
}