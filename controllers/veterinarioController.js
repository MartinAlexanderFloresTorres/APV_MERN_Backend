import Veterinario from "../models/Veterinario.js";
import generarToken from "../helpers/generarToken.js";
import generarJWT from "../helpers/generarJWT.js";
import { emailRegistro, emailOlvidePassword } from "../helpers/email.js";

// REGISTRAR UN VETERINARIO
const registrar = async (req, res) => {
  const { nombre, email, password } = req.body;

  try {
    const existe = await Veterinario.findOne({ email });
    // verificar si el usuario existe
    if (existe) {
      const error = new Error("El usuario ya existe");
      return res.status(400).json({ msg: error.message });
    }
    // guardar el veterinario
    const veterinario = new Veterinario({ nombre, email, password });
    veterinario.token = generarToken();
    await veterinario.save();
    // enviar email
    emailRegistro({ nombre, email, token: veterinario.token });

    res.json({
      msg: "Cuenta creada correctamente, Revisa su email para confirmar tu cuenta",
    });
  } catch (error) {
    console.log(error);
  }
};

// CONFIRMAR USUARIO
const confirmar = async (req, res) => {
  const { token } = req.params;
  try {
    const usuario = await Veterinario.findOne({ token });
    // verificar si el token no es valido
    if (!usuario) {
      const error = new Error("Token no válido");
      return res.status(404).json({ msg: error.message });
    }
    // confirmar usuario
    usuario.token = null;
    usuario.confirmado = true;
    await usuario.save();
    res.json({ msg: "Su cuenta ha sido confirmada, ya puedes iniciar sesión" });
  } catch (error) {
    console.log(error);
  }
};

// AUTENTICAR USUARIO
const auntenticar = async (req, res) => {
  const { email, password } = req.body;
  try {
    const usuario = await Veterinario.findOne({ email });
    // verificar si el usuario no existe
    if (!usuario) {
      const error = new Error("El usuario no existe");
      return res.status(404).json({ msg: error.message });
    }
    // verificar si su cuenta esta confirmada
    if (!usuario.confirmado) {
      const error = new Error("El usuario no ha confirmado su cuenta");
      return res.status(403).json({ msg: error.message });
    }
    // autenticar usuario
    const correcto = await usuario.comprobarPassword(password);
    if (correcto) {
      // generar JWT
      const token = generarJWT({ id: usuario._id });
      const user = {
        _id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        telefono: usuario.telefono,
        web: usuario.web,
      };
      res.json({ user, token });
    } else {
      const error = new Error("El password es incorrecto");
      return res.status(401).json({ msg: error.message });
    }
  } catch (error) {
    console.log(error);
  }
};

// OBTENER EL PERFIL
const perfil = (req, res) => {
  const { veterinario } = req;
  res.json(veterinario);
};

// OLVIDE PASSWORD
const olvidePassword = async (req, res) => {
  const { email } = req.body;
  try {
    const usuario = await Veterinario.findOne({ email });
    // verificar si el usuario existe
    if (!usuario) {
      const error = new Error("El usuario no existe");
      return res.status(404).json({ msg: error.message });
    }
    // verificar si su cuenta esta confirmada
    if (!usuario.confirmado) {
      const error = new Error("El usuario no ha confirmado su cuenta");
      return res.status(403).json({ msg: error.message });
    }
    // generar token
    usuario.token = generarToken();
    await usuario.save();
    // enviar email
    emailOlvidePassword({
      nombre: usuario.nombre,
      email,
      token: usuario.token,
    });
    res.json({ msg: "Hemos enviado un email con las instruciones" });
  } catch (error) {
    console.log(error);
  }
};

// COMPROBAR TOKEN
const comprobarToken = async (req, res) => {
  const { token } = req.params;
  try {
    const usuario = await Veterinario.findOne({ token });
    // verificar si el token no es valido
    if (!usuario) {
      const error = new Error("Token no válido");
      return res.status(404).json({ msg: error.message });
    }

    res.json({ msg: "token valido" });
  } catch (error) {
    console.log(error);
  }
};

// NUEVO PASSWORD
const nuevoPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  try {
    const usuario = await Veterinario.findOne({ token });
    // verificar si el token no es valido
    if (!usuario) {
      const error = new Error("Token no válido");
      return res.status(404).json({ msg: error.message });
    }
    // guardar nuevo password
    usuario.token = null;
    usuario.password = password;
    await usuario.save();
    res.json({ msg: "Password modificado correctamente" });
  } catch (error) {
    console.log(error);
  }
};

// ACTUALIZAR PERFIL
const actualizarPerfil = async (req, res) => {
  const { id } = req.params;
  const { nombre, email, web, telefono } = req.body;

  try {
    const usuario = await Veterinario.findById(id).select(
      "-password -token -confirmado -createdAt -updatedAt -__v"
    );
    // El usuario no existe
    if (!usuario) {
      const error = new Error("El usuario no existe");
      return res.status(404).json({ msg: error.message });
    }

    // email es direfente
    if (usuario.email !== email) {
      const existe = await Veterinario.findOne({ email });
      if (existe) {
        const error = new Error("Ese email ya esta en uso");
        return res.status(400).json({ msg: error.message });
      }
      if (email) {
        usuario.email = email;
      }
    }

    // actualizar
    if (nombre) {
      usuario.nombre = nombre;
    }
    usuario.telefono = telefono || null;
    usuario.web = web || null;

    // Guardar
    const veterinarioActualizado = await usuario.save();
    res.json(veterinarioActualizado);
  } catch (error) {
    console.log(error);
  }
};

// ACTUALIZAR PASSWORD
const actualizarPassword = async (req, res) => {
  const { _id } = req.veterinario;
  const { password, passwordNuevo } = req.body;
  try {
    const usuario = await Veterinario.findById(_id);
    // verificar si no existe el usuario
    if (!usuario) {
      const error = new Error("Usuario no encontrado");
      return res.status(404).json({ msg: error.message });
    }
    // verificar si su cuenta esta confirmada
    if (!usuario.confirmado) {
      const error = new Error("El usuario no ha confirmado su cuenta");
      return res.status(403).json({ msg: error.message });
    }
    // autenticar usuario
    const correcto = await usuario.comprobarPassword(password);
    if (correcto) {
      // actualizar datos
      usuario.password = passwordNuevo;
      await usuario.save();
      res.json({ msg: "El password ha sido actualizado correctamente" });
    } else {
      const error = new Error("El password es incorrecto");
      return res.status(401).json({ msg: error.message });
    }
  } catch (error) {
    console.log(error);
  }
};
export {
  registrar,
  perfil,
  confirmar,
  auntenticar,
  olvidePassword,
  comprobarToken,
  nuevoPassword,
  actualizarPerfil,
  actualizarPassword,
};
