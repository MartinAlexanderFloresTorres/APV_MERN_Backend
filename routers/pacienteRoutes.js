import express from "express";
import {
  agregarPaciente,
  obtenerPacientes,
  obtenerPaciente,
  actualizarPaciente,
  eliminarPaciente,
} from "../controllers/pacienteControlles.js";
import checkAuth from "../middleware/authMiddleware.js";

const pacienteRoutes = express.Router();
pacienteRoutes
  .route("/")
  .post(checkAuth, agregarPaciente) // Agregar paciente
  .get(checkAuth, obtenerPacientes); // Obtener pacientes

pacienteRoutes
  .route("/:id")
  .get(checkAuth, obtenerPaciente) // Obtener un paciente
  .put(checkAuth, actualizarPaciente) // Actualizar un paciente
  .delete(checkAuth, eliminarPaciente); // Eliminar un paciente

export default pacienteRoutes;
