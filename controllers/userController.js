import supabase from "../config/supabase.js";
import { UserModel } from "../models/userModel.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { verifyAuthToken } from "../utils/jwt.js";
import { OAuth2Client } from "google-auth-library";

dotenv.config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const getUser = async(req, res) => {
    const decoded = verifyAuthToken(req, res);
    if (!decoded) return;

    try {
        const { data, error } = await supabase
            .from(UserModel.table)
            .select("name, email, active, photo_url")
            .eq("id", decoded.id)
            .single();
        if (error) throw error;
        if (!data) {
            return res.status(404).json({ detail: "User not found" });
        }
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const createUser = async(req, res) => {
    const { name, email, password_hash, active, photo_url } = req.body;
    if (!password_hash) {
        return res.status(400).json({ error: "Password is required" });
    }
    const saltRounds = parseInt(process.env.HASH_SECRET);
    if (isNaN(saltRounds)) {
        return res.status(500).json({ error: "HASH_SECRET must be a number in .env" });
    }
    try {
        const { data: existingUser, error: selectError } = await supabase
            .from(UserModel.table)
            .select("*")
            .eq("email", email);

        if (selectError) throw selectError;
        if (existingUser && existingUser.length > 0) {
            return res.status(400).json({ detail: "Email already registered" });
        }

        const hashedPassword = await bcrypt.hash(password_hash, saltRounds);
        // console.log("Hashed Password:", hashedPassword);

        const userData = {
            name,
            email,
            password_hash: hashedPassword,
            active,
            photo_url
        };

        const { data: insertData, error: insertError } = await supabase
            .from(UserModel.table)
            .insert([userData])
            .select();

        if (insertError) throw insertError;
        if (!insertData || insertData.length === 0) {
            return res.status(500).json({ detail: "Error creating user" });
        }

        return res.status(201).json(insertData[0]);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const updateUser = async(req, res) => {
    const { id } = req.params;
    const { name, email, active, photo_url } = req.body;

    try {
        const { data, error } = await supabase
            .from(UserModel.table)
            .update({ name, email, active, photo_url })
            .eq("id", id)
            .select();

        if (error) throw error;
        if (!data || data.length === 0) {
            return res.status(404).json({ detail: "User not found" });
        }

        return res.status(200).json(data[0]);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export const loginUser = async(req, res) => {
    const { email, password_hash } = req.body;
    if (!email || !password_hash) {
        return res.status(400).json({ detail: "Email and password are required" });
    }

    try {
        const { data: user, error } = await supabase
            .from(UserModel.table)
            .select("*")
            .eq("email", email)
            .single();

        if (error) throw error;
        if (!user) {
            return res.status(401).json({ detail: "Invalid credentials" });
        }

        const isPasswordValid = await bcrypt.compare(password_hash, user.password_hash);
        if (!isPasswordValid) {
            return res.status(401).json({ detail: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user.id, name: user.name, email: user.email },
            process.env.JWT_SECRET, { expiresIn: "1h" }
        );

        return res.status(200).json({ token });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export const loginUserGoogle = async(req, res) => {
    const { id_token } = req.body;
    if (!id_token) {
        console.log("No id_token recibido");
        return res.status(400).json({ error: "Google token is required" });
    }

    try {
        // Verifica el token de Google
        const ticket = await client.verifyIdToken({
            idToken: id_token,
            audience: process.env.GOOGLE_CLIENT_ID
        });
        const payload = ticket.getPayload();
        console.log("Payload de Google:", payload);

        const email = payload.email;
        const name = payload.name;
        const photo_url = payload.picture;

        // Busca el usuario en la base de datos
        const { data: user, error } = await supabase
            .from(UserModel.table)
            .select("*")
            .eq("email", email)
            .single();

        if (error) console.log("Error buscando usuario:", error);

        let userId;
        if (!user) {
            // Si no existe, crea el usuario
            const { data: newUser, error: insertError } = await supabase
                .from(UserModel.table)
                .insert([{ name, email, photo_url, active: true }])
                .select()
                .single();
            if (insertError) {
                console.log("Error insertando usuario:", insertError);
                throw insertError;
            }
            userId = newUser.id;
        } else {
            userId = user.id;
        }

        // Genera el JWT
        const token = jwt.sign({ id: userId, name, email }, process.env.JWT_SECRET, { expiresIn: "1h" });

        return res.status(200).json({ token });
    } catch (error) {
        console.error("Error en loginUserGoogle:", error);
        return res.status(500).json({ error: error.message });
    }
}

export const getUserCompanies = async(req, res) => {
    const decoded = verifyAuthToken(req, res);
    if (!decoded) return;

    try {
        const { data, error } = await supabase
            .from('user_companies')
            .select('company_id')
            .eq('user_id', decoded.id);

        if (error) throw error;

        for (let i = 0; i < data.length; i++) {
            const companyId = data[i].company_id;
            const { data: companyData, error: companyError } = await supabase
                .from('companies')
                .select('*')
                .eq('id', companyId)
                .single();
            if (companyError) throw companyError;
            data[i].company = companyData;
        }
        res.status(200).json(data);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const getUserCompanyInfo = async(req, res) => {
    const decoded = verifyAuthToken(req, res);
    if (!decoded) return;

    const companyId = req.body.id;

    try {
        const { data, error } = await supabase
            .from('user_companies')
            .select('role_id, work_mode_id')
            .eq('user_id', decoded.id)
            .eq('company_id', companyId)
            .single();

        if (error) throw error;

        if (!data) {
            return res.status(404).json({ detail: "User-Company relation not found" });
        }


        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}