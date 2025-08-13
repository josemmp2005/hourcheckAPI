import express from "express";
import dotenv from "dotenv";
import usuarioRoutes from "./routes/userRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";

dotenv.config();

const app = express();

app.use(express.json());

// Rutas
app.use("/users", usuarioRoutes);
app.use("/companies", companyRoutes);

// Servidor
app.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${process.env.PORT}`);
});
