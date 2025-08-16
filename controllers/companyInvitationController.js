import supabase from "../config/supabase.js";
import { CompanyInvitationModel } from "../models/companyInvitationModel.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

export const createCompanyInvitation = async(req, res) => {

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

    const { company_id, role_id, email } = req.body;

    const invited_by = decoded.id;

    const invitationToken = crypto.randomBytes(32).toString("hex");


    const newInviation = {
        company_id: company_id,
        role_id: role_id,
        email: email,
        invited_by: invited_by,
        status: "pending",
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000)
    }

    const invitation = await supabase
        .from(CompanyInvitationModel.table)
        .insert([{...newInviation, token: invitationToken }])
        .single();

    if (!invitation) {
        return res.status(500).json({ error: "Error creating invitation" });
    }

    res.status(201).json({ message: "Invitation created", invitation });
}

export const checkCompanyInvitation = async(req, res) => {

}