const pool = require('../config/db')
const { asyncHandler } = require('../middleware/errorHandler')

function mapSpeaker(row) {
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    company: row.company,
    email: row.email,
    bio: row.bio,
  }
}

// GET /api/speakers
const getSpeakers = asyncHandler(async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM speakers ORDER BY created_at DESC')
  res.json(rows.map(mapSpeaker))
})

// POST /api/speakers
const createSpeaker = asyncHandler(async (req, res) => {
  const { name, role, company, email, bio } = req.body
  if (!name) return res.status(400).json({ error: 'name est requis.' })

  const [result] = await pool.query(
    'INSERT INTO speakers (name, role, company, email, bio) VALUES (?, ?, ?, ?, ?)',
    [name, role || null, company || null, email || null, bio || null]
  )
  res.status(201).json({ id: result.insertId })
})

// PUT /api/speakers/:id
const updateSpeaker = asyncHandler(async (req, res) => {
  const { id } = req.params
  const { name, role, company, email, bio } = req.body

  const [result] = await pool.query(
    `UPDATE speakers SET
      name = COALESCE(?, name),
      role = COALESCE(?, role),
      company = COALESCE(?, company),
      email = COALESCE(?, email),
      bio = COALESCE(?, bio)
     WHERE id = ?`,
    [name, role, company, email, bio, id]
  )
  if (result.affectedRows === 0) return res.status(404).json({ error: 'Intervenant introuvable.' })
  res.json({ updated: true })
})

// DELETE /api/speakers/:id
const deleteSpeaker = asyncHandler(async (req, res) => {
  const { id } = req.params
  const [result] = await pool.query('DELETE FROM speakers WHERE id = ?', [id])
  if (result.affectedRows === 0) return res.status(404).json({ error: 'Intervenant introuvable.' })
  res.json({ deleted: true })
})

module.exports = { getSpeakers, createSpeaker, updateSpeaker, deleteSpeaker }
