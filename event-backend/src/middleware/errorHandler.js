// Centralise la gestion des erreurs pour eviter de repeter
// des try/catch identiques dans chaque controller.
// Usage : enrober chaque handler async avec `asyncHandler`.

function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  console.error(err)

  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({ error: 'Cette valeur existe déjà (doublon).' })
  }

  const status = err.status || 500
  res.status(status).json({ error: err.message || 'Erreur serveur interne.' })
}

module.exports = { asyncHandler, errorHandler }
