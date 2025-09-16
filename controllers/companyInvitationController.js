import supabase from "../config/supabase.js";
import { CompanyInvitationModel } from "../models/companyInvitationModel.js";
import crypto from "crypto";
import dotenv from "dotenv";
import { verifyAuthToken } from "../utils/jwt.js";
import { sendInvitationEmail } from "../utils/sendInvitationEmail.js";

dotenv.config();


export const createCompanyInvitation = async(req, res) => {

    const decoded = verifyAuthToken(req, res);
    if (!decoded) return;

    const { company_id, role_id, email, work_mode_id } = req.body;

    const invited_by = decoded.id;

    const invitationToken = crypto.randomBytes(32).toString("hex");


    const newInviation = {
        company_id: company_id,
        role_id: role_id,
        work_mode_id: work_mode_id,
        email: email,
        invited_by: invited_by,
        status: "pending",
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000)
    }

    try {
        const checkAvaibleEmail = await supabase
            .from("user")
            .select("email")
            .eq("email", email)
            .single();
        if (!checkAvaibleEmail.data) {
            return res.status(400).json({ error: "User with this email does not exist" });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }

    const invitation = await supabase
        .from(CompanyInvitationModel.table)
        .insert([{...newInviation, token: invitationToken }])
        .single();

    if (!invitation) {
        return res.status(500).json({ error: "Error creating invitation" });
    }

    // Enviar email de invitación
    try {
        await sendInvitationEmail(email, invitationToken);
    } catch (mailError) {
        return res.status(500).json({ error: "Invitation created but email failed to send", mailError });
    }

    res.status(201).json({ message: "Invitation created and email sent", invitation });
}

export const checkCompanyInvitation = async(req, res) => {
    const decoded = verifyAuthToken(req, res);
    if (!decoded) return;

    const { token } = req.body;

    const { data: invitation, error } = await supabase
        .from(CompanyInvitationModel.table)
        .select("*")
        .eq("token", token)
        .single();

    if (error || !invitation) {
        return res.status(404).json({ error: "Invitation not found" });
    }

    if (invitation.status === "accepted") {
        return res.status(400).json({ error: "Invitation already accepted" });
    }

    // console.log("Invitation details:", invitation);
    // console.log("Decoded user details:", decoded);

    if (invitation.status === "pending" && new Date(invitation.expires_at) > new Date() && invitation.email === decoded.email) {
        const userCompanyData = {
            user_id: decoded.id,
            company_id: invitation.company_id,
            role_id: invitation.role_id,
            work_mode_id: invitation.work_mode_id,
        }

        const { data: userCompany, error } = await supabase
            .from("user_companies")
            .insert([userCompanyData])
            .single();

        if (error) {
            return res.status(500).json({ error: "Error accepting invitation" });
        }

        const { data: updateInvitation, error: updateError } = await supabase
            .from(CompanyInvitationModel.table)
            .update({ status: "accepted" })
            .eq("id", invitation.id)
            .select();

        if (updateError) {
            return res.status(500).json({ error: "Error updating invitation" });
        }

        return res.status(200).json({ message: "Invitation accepted", userCompany });
    }

    res.status(400).json({ error: "Invalid or expired invitation" });
}