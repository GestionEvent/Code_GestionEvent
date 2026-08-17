require('dotenv').config()
const express = require('express')
const cors = require('cors')

const authRoutes = require('./routes/authRoutes')
const eventRoutes = require('./routes/eventRoutes')
const participantRoutes = require('./routes/participantRoutes')
const speakerRoutes = require('./routes/speakerRoutes')
const { errorHandler } = require('./middleware/errorHandler')

const app = express()

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }))
app.use(express.json())

app.get('/api/health', (req, res) => res.json({ status: 'ok' }))

app.use('/api/auth', authRoutes)
app.use('/api/events', eventRoutes)
app.use('/api/participants', participantRoutes)
app.use('/api/speakers', speakerRoutes)

app.use((req, res) => res.status(404).json({ error: 'Route introuvable.' }))
app.use(errorHandler)

const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
  console.log(`API GestionEvent démarrée sur http://localhost:${PORT}`)
})
