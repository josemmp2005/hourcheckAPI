import cron from "node-cron";
import supabase from "./config/supabase.js";
import { generateDailyCode } from "./controllers/dailySingCodeController.js";

// Ejecuta todos los días a las 00:01
// cron.schedule("* * * * *", async() => {
cron.schedule("1 0 * * *", async() => {
    console.log("Generando códigos diarios...");
    const { data: companies, error } = await supabase
        .from("companies")
        .select("id");

    if (error) {
        console.error("Error obteniendo empresas:", error.message);
        return;
    }

    for (const company of companies) {
        try {
            const code = await generateDailyCode(company.id);
            console.log(`Código generado para empresa ${company.id}: ${code}`);
        } catch (err) {
            console.error(`Error para empresa ${company.id}:`, err.message);
        }
    }
});