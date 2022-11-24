import Paciente from '../models/Paciente.js'

// AGREGAR PACIENTE
const agregarPaciente = async (req, res) => {
  const { nombre, propietario, email, fechaAlta, sintomas } = req.body
  const { _id } = req.veterinario
  try {
    // obtener el id del usuario autenticado
    const veterinario = _id
    // crear paciente
    const paciente = new Paciente({
      nombre,
      propietario,
      email,
      fechaAlta,
      sintomas,
      veterinario
    })
    // almacenar paciente
    await paciente.save()
    res.json(paciente)
  } catch (error) {
    console.log(error)
  }
}

// OBTENER PACIENTES
const obtenerPacientes = async (req, res) => {
  const { _id } = req.veterinario
  try {
    // obtener los pacientes
    const pacientes = await Paciente.find().where('veterinario').equals(_id)
    res.json(pacientes)
  } catch (error) {
    console.log(error)
  }
}

// OBTENER UN PACIENTE
const obtenerPaciente = async (req, res) => {
  const { id } = req.params
  const { _id } = req.veterinario
  try {
    const paciente = await Paciente.findById(id)
    // comprobar si en paciente es del usuario
    if (paciente.veterinario.toString() !== _id.toString()) {
      const error = new Error('Permisos denegados')
      return res.status(401).json({ msg: error.message })
    }
    // retornar paciente
    res.json(paciente)
  } catch (e) {
    // si no existe paciente
    const error = new Error('url no válida')
    return res.status(404).json({ msg: error.message })
  }
}

// ACTUALIZAR UN PACIENTE
const actualizarPaciente = async (req, res) => {
  const { nombre, propietario, email, fechaAlta, sintomas } = req.body
  const { id } = req.params
  const { _id } = req.veterinario
  try {
    const paciente = await Paciente.findById(id)
    // comprobar si en paciente es del usuario
    if (paciente.veterinario.toString() !== _id.toString()) {
      const error = new Error('Permisos denegados')
      return res.status(401).json({ msg: error.message })
    }
    // actualizar paciente
    if (nombre) {
      paciente.nombre = nombre
    }
    if (propietario) {
      paciente.propietario = propietario
    }
    if (email) {
      paciente.email = email
    }
    if (fechaAlta) {
      paciente.fechaAlta = fechaAlta
    }
    if (sintomas) {
      paciente.sintomas = sintomas
    }
    const pacienteActualizado = await paciente.save()
    res.json(pacienteActualizado)
  } catch (e) {
    // si no existe paciente
    const error = new Error('url no válida')
    return res.status(404).json({ msg: error.message })
  }
}

// ELIMINAR UN PACIENTE
const eliminarPaciente = async (req, res) => {
  const { id } = req.params
  const { _id } = req.veterinario
  try {
    const paciente = await Paciente.findById(id)
    // comprobar si en paciente es del usuario
    if (paciente.veterinario.toString() !== _id.toString()) {
      const error = new Error('Permisos denegados')
      return res.status(401).json({ msg: error.message })
    }
    // eliminar paciente
    await paciente.deleteOne()
    res.json({ msg: 'Paciente eliminado correctamente' })
  } catch (e) {
    // si no existe paciente
    const error = new Error('url no válida')
    return res.status(404).json({ msg: error.message })
  }
}
export { agregarPaciente, obtenerPacientes, obtenerPaciente, actualizarPaciente, eliminarPaciente }
