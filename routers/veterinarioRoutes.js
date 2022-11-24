import express from 'express'
import {
  registrar,
  perfil,
  confirmar,
  auntenticar,
  olvidePassword,
  comprobarToken,
  nuevoPassword,
  actualizarPerfil,
  actualizarPassword
} from '../controllers/veterinarioController.js'
import checkAuth from '../middleware/authMiddleware.js'

const veterinarioRoutes = express.Router()

veterinarioRoutes.post('/', registrar) // registrar usuario
veterinarioRoutes.get('/confirmar/:token', confirmar) // Confirmar usuario
veterinarioRoutes.post('/login', auntenticar) // auntenticar usuario
veterinarioRoutes.post('/olvide-password', olvidePassword) // generar token
veterinarioRoutes
  .route('/olvide-password/:token')
  .get(comprobarToken) // Validar token
  .post(nuevoPassword) // Guardar password

// rutas privadas
veterinarioRoutes.get('/perfil', checkAuth, perfil) // Obtener el perfil del usuario
veterinarioRoutes.put('/perfil/:id', checkAuth, actualizarPerfil) // Actualizar perfil
veterinarioRoutes.put('/actualizar-password', checkAuth, actualizarPassword) // Actualizar password

export default veterinarioRoutes
