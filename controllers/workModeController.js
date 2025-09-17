import supabase from "../config/supabase.js";

export const getWorkModes = async(req, res) => {
    try {
        const { data, error } = await supabase
            .from('work_modes')
            .select('*');
        if (error) throw error;
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}