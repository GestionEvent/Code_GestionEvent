import { useState } from 'react'
import { API_URL } from '../config'

export default function Login({ onLogin, onGoToRegister, prefillEmail = '', justRegistered = false }) {
  const [email, setEmail] = useState(prefillEmail)
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [mode, setMode] = useState('login')
  const [resetEmail, setResetEmail] = useState('')
  const [resetPassword, setResetPassword] = useState('')
  const [resetConfirm, setResetConfirm] = useState('')
  const [resetLoading, setResetLoading] = useState(false)
  const [resetError, setResetError] = useState('')
  const [resetDone, setResetDone] = useState(false)

  const handleResetSubmit = async (e) => {
    e.preventDefault()
    setResetError('')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resetEmail.trim())) {
      setResetError('Veuillez saisir une adresse e-mail valide.')
      return
    }
    if (resetPassword.length < 6) {
      setResetError('Le nouveau mot de passe doit contenir au moins 6 caractères.')
      return
    }
    if (resetPassword !== resetConfirm) {
      setResetError('Les mots de passe ne correspondent pas.')
      return
    }
    setResetLoading(true)
    try {
      const res = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail.trim(), newPassword: resetPassword }),
      })
      const data = await res.json()
      setResetLoading(false)
      if (!res.ok) {
        setResetError(data.error || 'Une erreur est survenue.')
        return
      }
      setResetDone(true)
    } catch (err) {
      setResetLoading(false)
      setResetError("Impossible de contacter le serveur. Vérifie que le backend tourne bien sur le port 4000.")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!email.trim()) {
      setError('Veuillez saisir votre adresse e-mail.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Veuillez saisir une adresse e-mail valide.')
      return
    }
    if (!password.trim()) {
      setError('Veuillez saisir votre mot de passe.')
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      })
      const data = await res.json()
      setLoading(false)
      if (!res.ok) {
        setError(data.error || 'Identifiants invalides.')
        return
      }
      onLogin(data)
    } catch (err) {
      setLoading(false)
      setError("Impossible de contacter le serveur. Vérifie que le backend tourne bien sur le port 4000.")
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f8fafc',
      display: 'flex',
      backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(37,99,235,0.06) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(16,185,129,0.05) 0%, transparent 50%)',
    }}>
      {/* Left panel */}
      <div style={{
        flex: 1,
        background: 'linear-gradient(145deg, #1e40af 0%, #365E8D 40%, #3b82f6 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '60px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background pattern */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle at center, rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 56 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: 'rgba(255,255,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 20, color: 'white' }}>Gestion d'événement</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>Suite de gestion</div>
            </div>
          </div>

          <h1 style={{ fontSize: 40, fontWeight: 800, color: 'white', lineHeight: 1.1, marginBottom: 20 }}>
            Gérez vos événements<br />en toute confiance
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.75)', lineHeight: 1.7, maxWidth: 400, marginBottom: 48 }}>
            Tout ce dont vous avez besoin pour planifier, promouvoir et organiser des événements réussis — de l'inscription aux analyses.
          </p>

          {/* Feature pills */}
          {['Suivi des participants en temps réel', 'Planification & calendriers intelligents', 'Analyses des revenus & du budget'].map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{
                width: 24, height: 24, borderRadius: '50%',
                background: 'rgba(255,255,255,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>{f}</span>
            </div>
          ))}
        </div>

        {/* Decorative circles */}
        <div style={{ position: 'absolute', bottom: -60, right: -60, width: 240, height: 240, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }} />
        <div style={{ position: 'absolute', bottom: 40, right: 40, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }} />
      </div>

      {/* Right panel */}
      <div style={{
        width: 480, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 56px',
      }}>
        <div style={{ width: '100%', maxWidth: 360 }}>
        {mode === 'login' ? (
          <>
          <div style={{ marginBottom: 36 }}>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>Bon retour</h2>
            <p style={{ fontSize: 14, color: '#64748b' }}>Connectez-vous à votre compte Gestion d'événement</p>
          </div>

          {justRegistered && (
            <div style={{ marginBottom: 20, padding: '10px 12px', background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 8, fontSize: 13, color: '#059669', display: 'flex', alignItems: 'center', gap: 8 }}>
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} style={{ flexShrink: 0 }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Compte créé avec succès ! Connectez-vous pour continuer.
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 20 }}>
              <label className="form-label">Adresse e-mail</label>
              <input
                className="form-input"
                type="email"
                placeholder="alex@entreprise.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            <div style={{ marginBottom: 8 }}>
              <label className="form-label">Mot de passe</label>
              <div style={{ position: 'relative' }}>
                <input
                  className="form-input"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Entrez votre mot de passe"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  style={{ paddingRight: 44 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 4,
                  }}
                >
                  {showPassword ? (
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div style={{ marginTop: 12, padding: '10px 12px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, fontSize: 13, color: '#dc2626' }}>
                {error}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <div
                  onClick={() => setRemember(!remember)}
                  style={{
                    width: 18, height: 18, borderRadius: 5,
                    border: remember ? 'none' : '1.5px solid #d1d5db',
                    background: remember ? '#365E8D' : 'white',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.15s', flexShrink: 0,
                  }}
                >
                  {remember && (
                    <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span style={{ fontSize: 13, color: '#374151' }}>Se souvenir de moi</span>
              </label>
              <a
                onClick={() => { setMode('forgot'); setResetEmail(email); setResetError(''); setResetDone(false) }}
                style={{ fontSize: 13, color: '#365E8D', fontWeight: 500, cursor: 'pointer', textDecoration: 'none' }}
              >
                Mot de passe oublié ?
              </a>
            </div>

            <button
              type="submit"
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', height: 44, fontSize: 15 }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} style={{ animation: 'spin 1s linear infinite' }}>
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round"/>
                  </svg>
                  Connexion en cours...
                </>
              ) : 'Se connecter'}
            </button>
          </form>

          <p style={{ fontSize: 13, color: '#94a3b8', textAlign: 'center', marginTop: 28 }}>
            Vous n&apos;avez pas de compte ?{' '}
            <a style={{ color: '#365E8D', fontWeight: 600, cursor: 'pointer' }} onClick={onGoToRegister}>Créer un compte</a>
          </p>
          </>
        ) : (
          <>
            <div style={{ marginBottom: 36 }}>
              <h2 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>Mot de passe oublié</h2>
              <p style={{ fontSize: 14, color: '#64748b' }}>
                Saisis ton adresse e-mail et choisis un nouveau mot de passe.
              </p>
            </div>

            {resetDone ? (
              <div style={{ padding: '14px 16px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, fontSize: 14, color: '#166534' }}>
                Mot de passe réinitialisé avec succès.{' '}
                <a
                  onClick={() => { setMode('login'); setPassword(''); setEmail(resetEmail) }}
                  style={{ color: '#166534', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Se connecter
                </a>
              </div>
            ) : (
              <form onSubmit={handleResetSubmit}>
                <div style={{ marginBottom: 20 }}>
                  <label className="form-label">Adresse e-mail</label>
                  <input
                    className="form-input"
                    type="email"
                    placeholder="alex@entreprise.com"
                    value={resetEmail}
                    onChange={e => setResetEmail(e.target.value)}
                    required
                  />
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label className="form-label">Nouveau mot de passe</label>
                  <input
                    className="form-input"
                    type="password"
                    placeholder="Au moins 6 caractères"
                    value={resetPassword}
                    onChange={e => setResetPassword(e.target.value)}
                    required
                  />
                </div>

                <div style={{ marginBottom: 8 }}>
                  <label className="form-label">Confirmer le nouveau mot de passe</label>
                  <input
                    className="form-input"
                    type="password"
                    placeholder="Répétez le mot de passe"
                    value={resetConfirm}
                    onChange={e => setResetConfirm(e.target.value)}
                    required
                  />
                </div>

                {resetError && (
                  <div style={{ marginTop: 12, padding: '10px 12px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, fontSize: 13, color: '#dc2626' }}>
                    {resetError}
                  </div>
                )}

                <button
                  type="submit"
                  className="btn-primary"
                  style={{ width: '100%', justifyContent: 'center', height: 44, fontSize: 15, marginTop: 24 }}
                  disabled={resetLoading}
                >
                  {resetLoading ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
                </button>
              </form>
            )}

            <p style={{ fontSize: 13, color: '#94a3b8', textAlign: 'center', marginTop: 28 }}>
              <a
                onClick={() => setMode('login')}
                style={{ color: '#365E8D', fontWeight: 600, cursor: 'pointer' }}
              >
                Retour à la connexion
              </a>
            </p>
          </>
        )}
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
