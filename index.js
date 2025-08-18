import express from "express";
import dotenv from "dotenv";
import usuarioRoutes from "./routes/userRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";
import companyInvitationRoutes from "./routes/companyInvitationRoutes.js";
import companyUserRoutes from "./routes/companyUserModel.js";

dotenv.config();

const app = express();

app.use(express.json());

// Rutas
app.use("/users", usuarioRoutes);
app.use("/companies", companyRoutes);
app.use("/company-invitations", companyInvitationRoutes);
app.use("/company-users", companyUserRoutes);

// Servidor
app.listen(process.env.PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${process.env.PORT}`);
});