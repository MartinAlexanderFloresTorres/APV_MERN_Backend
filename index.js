import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import conectarDB from './config/db.js'
import veterinarioRoutes from './routers/veterinarioRoutes.js'
import pacienteRoutes from './routers/pacienteRoutes.js'

const app = express()

// configuracion de CORS
app.use(cors({ origin: '*' }))

// Habilitar json
app.use(express.json())
// env
dotenv.config()
// Puerto
const PORT = process.env.PORT || 4000
// ContectarDB
conectarDB()

// Rutas
app.use('/api/veterinarios', veterinarioRoutes)
app.use('/api/pacientes', pacienteRoutes)

// Arranca el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto: ${PORT}`)
})
