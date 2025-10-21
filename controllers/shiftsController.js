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

    const { employee_id, company_id } = req.params;

    if (!company_id || !employee_id) {
        return res.status(400).json({ error: "company_id and employee_id are required" });
    }

    try {
        const { data, error } = await supabase
            .from("user_shifts")
            .select("*")
            .eq("user_id", employee_id)
            .eq("company_id", company_id)
            .single();

        if (error) throw error;
        // console.log("User shift data:", data);
        // console.log("Shift ID:", data.shift_id);

        // Corrige la destructuración aquí
        const { data: shiftData, error: shiftError } = await supabase
            .from(ShiftModel.table)
            .select("*")
            .eq("id", data.shift_id)
            .single();

        if (shiftError) throw shiftError;
        // console.log("Shift data:", shiftData);

        res.status(200).json({ shift: shiftData });
    } catch (error) {
        console.error("Error details:", error);
        res.status(500).json({ message: "Error retrieving employee shift", error });
    }
}