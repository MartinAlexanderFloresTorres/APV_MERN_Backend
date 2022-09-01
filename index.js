import express from "express";
import dotenv from "dotenv";
import cros from "cors";
import conectarDB from "./config/db.js";
import veterinarioRoutes from "./routers/veterinarioRoutes.js";
import pacienteRoutes from "./routers/pacienteRoutes.js";

const app = express();

// configuracion de CORS
const dominiosPermitidos = [
  process.env.FRONTEND_URL || "http://127.0.0.1:5173",
];
const corsOpciones = {
  origin: function (origin, callback) {
    /* dominiosPermitidos.includes(origin) */
    if (dominiosPermitidos.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Dominio no permitido por CORS"));
    }
  },
};
app.use(cros(corsOpciones));
// Habilitar json
app.use(express.json());
// env
dotenv.config();
// Puerto
const PORT = process.env.PORT || 4000;
// ContectarDB
conectarDB();

// Rutas
app.use("/api/veterinarios", veterinarioRoutes);
app.use("/api/pacientes", pacienteRoutes);

// Arranca el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto: ${PORT}`);
});
