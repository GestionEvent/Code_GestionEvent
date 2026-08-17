const pool = require('../config/db')
const { asyncHandler } = require('../middleware/errorHandler')

function mapParticipant(row) {
  return {
    id: row.id,
    eventId: row.event_id,
    name: row.name,
    email: row.email,
    regStatus: row.reg_status,
    attendance: row.attendance,
    ticket: row.ticket_code,
    registered: row.registered_at,
  }
}

function genTicketCode() {
  return '#GE-' + Math.random().toString(36).slice(2, 6).toUpperCase()
}

// GET /api/participants
const getParticipants = asyncHandler(async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM participants ORDER BY registered_at DESC')
  res.json(rows.map(mapParticipant))
})

// POST /api/participants
// Body attendu (voir Participants.jsx) : { name, email, event }
// "event" doit ici être l'id de l'événement (le frontend actuel
// stocke un libellé texte, ce qui est une des limites à corriger,
// voir remarque plus bas).
const createParticipant = asyncHandler(async (req, res) => {
  const { name, email, eventId } = req.body

  if (!name || !email || !eventId) {
    return res.status(400).json({ error: 'name, email et eventId sont requis.' })
  }

  const [result] = await pool.query(
    `INSERT INTO participants (event_id, name, email, ticket_code)
     VALUES (?, ?, ?, ?)`,
    [eventId, name, email, genTicketCode()]
  )

  res.status(201).json({ id: result.insertId })
})

// DELETE /api/participants
// Body : { ids: [1, 2, 3] } pour reprendre la suppression multiple
// deja geree cote frontend (deleteParticipants(ids) dans App.jsx)
const deleteParticipants = asyncHandler(async (req, res) => {
  const { ids } = req.body
  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ error: 'ids doit être un tableau non vide.' })
  }

  await pool.query('DELETE FROM participants WHERE id IN (?)', [ids])
  res.json({ deleted: ids.length })
})

module.exports = { getParticipants, createParticipant, deleteParticipants }
