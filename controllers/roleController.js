import supabase from "../config/supabase.js";

export const getRoles = async(req, res) => {
    try {
        const { data, error } = await supabase
            .from('roles')
            .select('*');
        if (error) throw error;
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export const getRole = async(req, res) => {
    const roleId = req.params.id;
    try {
        const { data, error } = await supabase
            .from('roles')
            .select('*')
            .eq('id', roleId)
            .single();
        if (error) throw error;
        if (!data) {
            return res.status(404).json({ detail: "Role not found" });
        }
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}