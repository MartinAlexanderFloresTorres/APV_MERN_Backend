import mongoose from "mongoose";
import bcrypt from "bcrypt";

const veterinarioShema = mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    telefono: {
      type: String,
      default: null,
      trim: true,
    },
    web: {
      type: String,
      default: null,
    },
    token: {
      type: String,
      default: null,
    },
    confirmado: {
      type: Boolean,
      default: false,
    },
  },
  {
    // crea dos columnas de creado y actualizado
    timestamps: true,
  }
);
// generar password encriptado
veterinarioShema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salRounds = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salRounds);
});

// comparar password
veterinarioShema.methods.comprobarPassword = async function (passwordUser) {
  return await bcrypt.compare(passwordUser, this.password);
}

const Veterinario = mongoose.model("Veterinario", veterinarioShema);

export default Veterinario;
