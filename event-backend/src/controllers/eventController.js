const pool = require('../config/db')
const { asyncHandler } = require('../middleware/errorHandler')

// Formate une ligne "events" + son compteur d'inscrits + ses intervenants
// pour renvoyer exactement la forme attendue par le frontend
// (voir shared.events dans App.jsx : name, date, time, capacity, speakers...)
function mapEvent(row, speakers = []) {
  return {
    id: row.id,
    name: row.title,
    description: row.description,
    category: row.category,
    date: row.event_date,
    time: row.start_time,
    endTime: row.end_time,
    location: row.location,
    venue: row.venue,
    capacity: row.capacity,
    ticketPrice: String(row.ticket_price),
    status: row.status,
    registered: row.registered_count ?? 0,
    speakers,
  }
}

// GET /api/events
const getEvents = asyncHandler(async (req, res) => {
  const [rows] = await pool.query(`
    SELECT e.*, COUNT(p.id) AS registered_count
    FROM events e
    LEFT JOIN participants p ON p.event_id = e.id
    GROUP BY e.id
    ORDER BY e.event_date DESC
  `)
  res.json(rows.map((r) => mapEvent(r)))
})

// GET /api/events/:id
const getEventById = asyncHandler(async (req, res) => {
  const { id } = req.params

  const [rows] = await pool.query(
    `SELECT e.*, COUNT(p.id) AS registered_count
     FROM events e
     LEFT JOIN participants p ON p.event_id = e.id
     WHERE e.id = ?
     GROUP BY e.id`,
    [id]
  )
  const event = rows[0]
  if (!event) return res.status(404).json({ error: 'Événement introuvable.' })

  const [speakers] = await pool.query(
    'SELECT name, role, bio FROM event_speakers WHERE event_id = ?',
    [id]
  )

  res.json(mapEvent(event, speakers))
})

// POST /api/events
// Body attendu (identique a ce que CreateEvent.jsx envoie deja) :
// { name, description, category, date, time, endTime, location,
//   venue, capacity, ticketPrice, speakers: [{name, role, bio}] }
const createEvent = asyncHandler(async (req, res) => {
  const {
    name, description, category, date, time, endTime,
    location, venue, capacity, ticketPrice, speakers = [],
  } = req.body

  if (!name || !date || !location || !capacity) {
    return res.status(400).json({ error: 'name, date, location et capacity sont requis.' })
  }

  const conn = await pool.getConnection()
  try {
    await conn.beginTransaction()

    const [result] = await conn.query(
      `INSERT INTO events
        (title, description, category, event_date, start_time, end_time, location, venue, capacity, ticket_price)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, description, category || 'Général', date, time, endTime, location, venue, Number(capacity) || 0, Number(ticketPrice) || 0]
    )
    const eventId = result.insertId

    for (const sp of speakers) {
      if (!sp.name) continue
      await conn.query(
        'INSERT INTO event_speakers (event_id, name, role, bio) VALUES (?, ?, ?, ?)',
        [eventId, sp.name, sp.role || null, sp.bio || null]
      )
    }

    await conn.commit()
    res.status(201).json({ id: eventId })
  } catch (err) {
    await conn.rollback()
    throw err
  } finally {
    conn.release()
  }
})

// PUT /api/events/:id
const updateEvent = asyncHandler(async (req, res) => {
  const { id } = req.params
  const {
    name, description, category, date, time, endTime,
    location, venue, capacity, ticketPrice, status,
  } = req.body

  const [result] = await pool.query(
    `UPDATE events SET
      title = COALESCE(?, title),
      description = COALESCE(?, description),
      category = COALESCE(?, category),
      event_date = COALESCE(?, event_date),
      start_time = COALESCE(?, start_time),
      end_time = COALESCE(?, end_time),
      location = COALESCE(?, location),
      venue = COALESCE(?, venue),
      capacity = COALESCE(?, capacity),
      ticket_price = COALESCE(?, ticket_price),
      status = COALESCE(?, status)
     WHERE id = ?`,
    [name, description, category, date, time, endTime, location, venue, capacity, ticketPrice, status, id]
  )

  if (result.affectedRows === 0) return res.status(404).json({ error: 'Événement introuvable.' })
  res.json({ updated: true })
})

// DELETE /api/events/:id
const deleteEvent = asyncHandler(async (req, res) => {
  const { id } = req.params
  const [result] = await pool.query('DELETE FROM events WHERE id = ?', [id])
  if (result.affectedRows === 0) return res.status(404).json({ error: 'Événement introuvable.' })
  res.json({ deleted: true })
})

module.exports = { getEvents, getEventById, createEvent, updateEvent, deleteEvent }
