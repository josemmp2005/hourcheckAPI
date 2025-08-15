import supabase from "../config/supabase.js";
import { UserModel } from "../models/userModel.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

export const getUsers = async(req, res) => {
    try {
        const { data, error } = await supabase
            .from(UserModel.table)
            .select("*");

        if (error) throw error;

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createUser = async(req, res) => {
    const { name, email, password_hash, company_id } = req.body;
    // console.log("Received data:", req.body);
    if (!password_hash) {
        return res.status(400).json({ error: "Password is required" });
    }
    const saltRounds = parseInt(process.env.HASH_SECRET);
    if (isNaN(saltRounds)) {
        return res.status(500).json({ error: "HASH_SECRET must be a number in .env" });
    }
    try {
        // Verificar si el usuario ya existe
        const { data: existingUser, error: selectError } = await supabase
            .from(UserModel.table)
            .select("*")
            .eq("email", email);

        if (selectError) throw selectError;
        if (existingUser && existingUser.length > 0) {
            return res.status(400).json({ detail: "Email already registered" });
        }

        const hashedPassword = await bcrypt.hash(password_hash, saltRounds); // Hashea el password recibido

        // console.log("Hashed Password:", hashedPassword);
        // Preparar datos del usuario
        const userData = {
            role_id: 5, // Rol por defecto None
            company_id,
            name,
            email,
            password_hash: hashedPassword, // Guarda como password_hash en la BBDD
        };

        // Insertar usuario
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


export const loginUser = async(req, res) => {
    const { email, password_hash } = req.body;
    if (!email || !password_hash) {
        return res.status(400).json({ detail: "Email and password are required" });
    }

    try {
        // Buscar usuario por email
        const { data: user, error } = await supabase
            .from(UserModel.table)
            .select("*")
            .eq("email", email)
            .single();

        if (error) throw error;
        if (!user) {
            return res.status(401).json({ detail: "Invalid credentials" });
        }

        // Verificar contraseña
        const isPasswordValid = await bcrypt.compare(password_hash, user.password_hash);
        if (!isPasswordValid) {
            return res.status(401).json({ detail: "Invalid credentials" });
        }

        // Generar JWT
        const token = jwt.sign({ name: user.name, email: user.email },
            process.env.JWT_SECRET, { expiresIn: "1h" }
        );

        return res.status(200).json({ token });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}