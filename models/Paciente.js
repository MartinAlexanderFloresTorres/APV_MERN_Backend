import mongoose from "mongoose";

const pacienteShema = mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    propietario: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
    },
    fechaAlta: {
      type: Date,
      required: true,
      default: Date.now(),
    },
    sintomas: {
      type: String,
      required: true,
    },
    veterinario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Veterinario",
    },
  },
  {
    // crea dos columnas de creado y actualizado
    timestamps: true,
  }
);

const Paciente = mongoose.model("Paciente", pacienteShema);
export default Paciente;
