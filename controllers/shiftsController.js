import supabase from supabase;
import { ShiftModel } from "../models/shiftModel";
import dotenv from "dotenv";
import { verifyAuthToken } from "../utils/jwt.js";

dotenv.config();

export const createShift = async(req, res) => {
    const { start_time, end_time, break_minutes } = req.body;

    try {
        const { data, error } = await supabase
            .from(ShiftModel.table)
            .insert({ start_time, end_time, break_minutes });

        if (error) throw error;

        res.status(201).json({ message: "Shift created successfully", data });
    } catch (error) {
        res.status(500).json({ message: "Error creating shift", error });
    }
}


export const updateShifts = async(req, res) => {
    const { id } = req.params;
    const { start_time, end_time, break_minutes } = req.body;

    try {
        const { data, error } = await supabase
            .from(ShiftModel.table)
            .update({ start_time, end_time, break_minutes })
            .eq("id", id);

        if (error) throw error;

        res.status(200).json({ message: "Shift updated successfully", data });
    } catch (error) {
        res.status(500).json({ message: "Error updating shift", error });
    }
}