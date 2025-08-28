import supabase from "../config/supabase.js";
import crypto from "crypto";

export const generateDailyCode = async(company_id) => {
    const today = new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'
    // Verificar si ya existe un código para hoy
    const { data: existing, error: selectError } = await supabase
        .from("daily_signing_codes")
        .select("*")
        .eq("company_id", company_id)
        .eq("date", today);

    if (selectError) throw selectError;
    if (existing && existing.length > 0) return existing[0].code;

    // Generar código aleatorio
    const code = crypto.randomBytes(6).toString("hex");

    // Insertar el nuevo código
    const { data, error: insertError } = await supabase
        .from("daily_signing_codes")
        .insert([{ company_id, code, date: today }])
        .select();

    if (insertError) throw insertError;
    return data[0].code;
};