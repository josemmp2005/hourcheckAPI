import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const sendInvitationEmail = async(to, invitationToken) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const invitationUrl = `http://localhost:5173/invitation/accept?token=${invitationToken}`;
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject: "Invitación para unirte a la empresa",
        html: `
            <p>Has sido invitado a unirte a la empresa.</p>
            <p>Haz clic en el siguiente enlace para aceptar la invitación:</p>
            <a href="${invitationUrl}">${invitationUrl}</a>
            <p>Este enlace expirará en 24 horas.</p>
        `
    };

    return transporter.sendMail(mailOptions);
};