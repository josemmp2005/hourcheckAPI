import supabase from "../config/supabase.js";
import jwt from "jsonwebtoken";
import { CompanyModel } from "../models/companyModel.js";
import { UserModel } from "../models/userModel.js";


export const getCompanies = async(req, res) => {
    try {
        const { data, error } = await supabase
            .from(CompanyModel.table)
            .select("*");

        if (error) throw error;

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const createCompany = async(req, res) => {
    try {
        // Verificar JWT
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ error: "No token provided" });
        }
        const token = authHeader.split(" ")[1];
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return res.status(401).json({ error: "Invalid token" });
        }

        // Comprobar que el email del JWT existe en la base de datos
        const { data: user, error: userError } = await supabase
            .from(UserModel.table)
            .select("*")
            .eq("email", decoded.email)
            .single();

        if (userError || !user) {
            return res.status(403).json({ error: "User not found" });
        }

        const { name, address, phone, email, photo_url } = req.body;

        // Insertar la empresa
        const { data, error } = await supabase
            .from(CompanyModel.table)
            .insert([{ name, address, phone, email, photo_url }])
            .select();

        if (error) throw error;

        // Relacionar el usuario con la empresa recién creada (por ejemplo, en una tabla user_company)
        if (data && data.length > 0) {
            const companyId = data[0].id;
            await supabase
                .from("user_companies")
                .insert([{ user_id: user.id, company_id: companyId, role_id: 2 }]);
        }

        res.status(201).json(data);


    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};