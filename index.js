import express from "express";
import dotenv from "dotenv";
import usuarioRoutes from "./routes/userRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";
import companyInvitationRoutes from "./routes/companyInvitationRoutes.js";
import companyUserRoutes from "./routes/companyUserRoutes.js";
import clockInRoutes from "./routes/clockInRoutes.js";
import breakRoutes from "./routes/breakRoutes.js";
import absensenceRoutes from "./routes/absenceRoutes.js";
import vacationRoutes from "./routes/vacationRoutes.js";
import shiftRoutes from "./routes/shiftsRoutes.js";
import roleRoutes from "./routes/roleRoutes.js";
import workModeRoutes from "./routes/workModeRoutes.js";
import dailySigningCodeRoutes from "./routes/dailySingingCodeRoutes.js";
import "./cronJobs.js";
import cors from "cors";

dotenv.config();

const app = express();

app.use(cors({
    origin: ["http://localhost:5173", "https://hourcheck.netlify.app"],
    credentials: true
}));

app.use(express.json());

// Rutas
app.use("/users", usuarioRoutes);
app.use("/companies", companyRoutes);
app.use("/company-invitations", companyInvitationRoutes);
app.use("/company-users", companyUserRoutes);
app.use("/clock", clockInRoutes);
app.use("/breaks", breakRoutes);
app.use("/absences", absensenceRoutes);
app.use("/vacations", vacationRoutes);
app.use("/shifts", shiftRoutes);
app.use("/roles", roleRoutes);
app.use("/work-modes", workModeRoutes);
app.use("/daily-singing-code", dailySigningCodeRoutes);

// Servidor
app.listen(process.env.PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${process.env.PORT}`);
});