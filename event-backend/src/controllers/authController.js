const bcrypt = require('bcryptjs')
const pool = require('../config/db')
const { asyncHandler } = require('../middleware/errorHandler')

// POST /api/auth/register
// Utile pour creer le premier compte de test (le frontend actuel
// n'a pas d'ecran d'inscription, donc pense a creer un utilisateur
// via cette route ou directement en base avant de tester le login).
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'name, email et password sont requis.' })
  }

  const passwordHash = await bcrypt.hash(password, 10)

  const [result] = await pool.query(
    'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
    [name, email, passwordHash]
  )

  res.status(201).json({ id: result.insertId, name, email })
})

// POST /api/auth/login
// Auth minimale demandee pour l'alpha : on verifie email + mot de
// passe contre la base et on renvoie l'utilisateur. Pas de session
// ni de token pour l'instant -> le frontend garde juste l'info en
// memoire cote client, comme il le fait deja avec onLogin().
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'email et password sont requis.' })
  }

  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email])
  const user = rows[0]

  if (!user) {
    return res.status(401).json({ error: 'Identifiants invalides.' })
  }

  const valid = await bcrypt.compare(password, user.password_hash)
  if (!valid) {
    return res.status(401).json({ error: 'Identifiants invalides.' })
  }

  res.json({ id: user.id, name: user.name, email: user.email })
})

// PUT /api/auth/password
// Change le mot de passe d'un utilisateur déjà connecté : on exige
// le mot de passe actuel pour vérifier l'identité, comme le fait
// n'importe quel formulaire "changer le mot de passe" sérieux.
const changePassword = asyncHandler(async (req, res) => {
  const { email, currentPassword, newPassword } = req.body

  if (!email || !currentPassword || !newPassword) {
    return res.status(400).json({ error: 'email, currentPassword et newPassword sont requis.' })
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'Le nouveau mot de passe doit contenir au moins 6 caractères.' })
  }

  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email])
  const user = rows[0]
  if (!user) {
    return res.status(404).json({ error: 'Utilisateur introuvable.' })
  }

  const valid = await bcrypt.compare(currentPassword, user.password_hash)
  if (!valid) {
    return res.status(401).json({ error: 'Le mot de passe actuel est incorrect.' })
  }

  const newHash = await bcrypt.hash(newPassword, 10)
  await pool.query('UPDATE users SET password_hash = ? WHERE id = ?', [newHash, user.id])

  res.json({ updated: true })
})

// POST /api/auth/forgot-password
// Alpha uniquement : réinitialise directement le mot de passe à
// partir de l'email, sans lien de confirmation envoyé par e-mail
// (il n'y a pas de service d'envoi de mail dans ce projet). Ce
// n'est PAS une implémentation sûre pour de la production — n'importe
// qui connaissant un email pourrait réinitialiser ce compte. Avant
// une vraie mise en ligne, il faudra un token à usage unique envoyé
// par e-mail.
const forgotPassword = asyncHandler(async (req, res) => {
  const { email, newPassword } = req.body

  if (!email || !newPassword) {
    return res.status(400).json({ error: 'email et newPassword sont requis.' })
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'Le nouveau mot de passe doit contenir au moins 6 caractères.' })
  }

  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email])
  const user = rows[0]
  if (!user) {
    return res.status(404).json({ error: 'Aucun compte ne correspond à cet email.' })
  }

  const newHash = await bcrypt.hash(newPassword, 10)
  await pool.query('UPDATE users SET password_hash = ? WHERE id = ?', [newHash, user.id])

  res.json({ updated: true })
})

module.exports = { register, login, changePassword, forgotPassword }
