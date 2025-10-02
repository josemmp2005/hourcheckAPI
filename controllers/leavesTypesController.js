import supabase from "../config/supabase.js";

export const getLeaveTypes = async(req, res) => {
    try {
        const { data, error } = await supabase
            .from('leave_types')
            .select('*');
        if (error) throw error;
        res.status(200).json({ data });
    } catch (error) {
        console.error("Error fetching leave types:", error);
        res.status(500).json({ message: "Error fetching leave types", error });
    }
}