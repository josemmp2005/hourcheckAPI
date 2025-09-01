import supabase from '../config/supabase.js'
import { BreakModel } from '../models/breakModel.js'
import dotenv from 'dotenv'
import { verifyAuthToken } from '../utils/jwt.js'

dotenv.config();

export const startBreak = async(req, res) => {
    const decoded = verifyAuthToken(req, res);

    if (!decoded) return;

    const { user_id } = decoded;

    try {
        const { data, error } = await supabase
            .from(BreakModel)
            .insert([{ user_id, start_time: new Date() }]);

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

    const { user_id } = decoded;

    try {
        const { data, error } = await supabase
            .from(BreakModel)
            .update({ end_time: new Date() })
            .match({ user_id, end_time: null });

        if (error) throw error;

        res.status(200).json({ message: "Break stopped", data });
    } catch (error) {
        console.error("Error stopping break:", error);
        res.status(500).json({ message: "Error stopping break", error });
    }
}