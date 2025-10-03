import supabase from "../config/supabase.js";
import { ShiftModel } from "../models/shiftModel.js";
import dotenv from "dotenv";
import { verifyAuthToken } from "../utils/jwt.js";

dotenv.config();

export const createShift = async(req, res) => {
    const decoded = verifyAuthToken(req, res);
    if (!decoded) return;

    const { company_id, name, start_time, end_time, break_minutes } = req.body;

    try {
        const { data, error } = await supabase
            .from(ShiftModel.table)
            .insert({ company_id, name, start_time, end_time, break_minutes });

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

export const getCompanyShifts = async(req, res) => {
    const decoded = verifyAuthToken(req, res);
    if (!decoded) return;

    const company_id = req.params.company_id;

    try {
        const { data, error } = await supabase
            .from(ShiftModel.table)
            .select("*")
            .eq("company_id", company_id);

        if (error) throw error;

        res.status(200).json({ data });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving shifts", error });
    }
};

export const getEmployeesShifts = async(req, res) => {
    const decoded = verifyAuthToken(req, res);
    if (!decoded) return;

    const company_id = req.params.company_id;

    try {
        const { data, error } = await supabase
            .from("user_shifts")
            .select("*")
            .eq("company_id", company_id)

        if (error) throw error;

        res.status(200).json({ data });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving employee shifts", error });
    }
}

export const getEmployeeShift = async(req, res) => {
    const decoded = verifyAuthToken(req, res);
    if (!decoded) return;

    const { user_id, company_id } = req.params;

    try {
        const { data, error } = await supabase
            .from("user_shifts")
            .select("*")
            .eq("user_id", user_id)
            .eq("company_id", company_id)
            .single();
        if (error) throw error;
        res.status(200).json({ data });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving employee shift", error });
    }
}