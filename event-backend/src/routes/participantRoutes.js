const express = require('express')
const {
  getParticipants, createParticipant, deleteParticipants,
} = require('../controllers/participantController')

const router = express.Router()

router.get('/', getParticipants)
router.post('/', createParticipant)
router.delete('/', deleteParticipants)

module.exports = router
