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