const express = require('express')
const {
  getSpeakers, createSpeaker, updateSpeaker, deleteSpeaker,
} = require('../controllers/speakerController')

const router = express.Router()

router.get('/', getSpeakers)
router.post('/', createSpeaker)
router.put('/:id', updateSpeaker)
router.delete('/:id', deleteSpeaker)

module.exports = router
