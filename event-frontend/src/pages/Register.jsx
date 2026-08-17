import { useState } from 'react'
import { API_URL } from '../config'

export default function Register({ onRegister, onGoToLogin }) {
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', company: '', password: '', confirmPassword: '',
  })
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  const validate = () => {
    if (!form.firstName.trim()) return 'Veuillez saisir votre prénom.'
    if (!form.lastName.trim()) return 'Veuillez saisir votre nom.'
    if (!form.email.trim()) return 'Veuillez saisir votre adresse e-mail.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) return 'Veuillez saisir une adresse e-mail valide.'
    if (!form.password) return 'Veuillez choisir un mot de passe.'
    if (form.password.length < 8) return 'Le mot de passe doit contenir au moins 8 caractères.'
    if (form.password !== form.confirmPassword) return 'Les mots de passe ne correspondent pas.'
    if (!acceptTerms) return "Vous devez accepter les conditions d'utilisation pour continuer."
    return ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    setError(errs)
    if (errs) return
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${form.firstName.trim()} ${form.lastName.trim()}`.trim(),
          email: form.email.trim(),
          password: form.password,
        }),
      })
      const data = await res.json()
      setLoading(false)
      if (!res.ok) {
        setError(data.error || 'Une erreur est survenue.')
        return
      }
      onRegister({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        company: form.company,
      })
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
            Créez votre compte<br />en quelques secondes
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.75)', lineHeight: 1.7, maxWidth: 400, marginBottom: 48 }}>
            Rejoignez la suite complète pour planifier, promouvoir et organiser des événements réussis — de l'inscription à la facturation.
          </p>

          {/* Feature pills */}
          {['Logistique, salles & matériel centralisés', 'E-mails automatisés à chaque étape', 'Billetterie et paiements intégrés', 'Rôles et droits d\u2019accès avancés'].map((f, i) => (
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
        width: 480, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 56px', overflowY: 'auto',
      }}>
        <div style={{ width: '100%', maxWidth: 360 }}>
          <div style={{ marginBottom: 28 }}>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>Créer un compte</h2>
            <p style={{ fontSize: 14, color: '#64748b' }}>Renseignez vos informations pour commencer</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
              <div>
                <label className="form-label">Prénom</label>
                <input className="form-input" placeholder="Alex" value={form.firstName} onChange={e => set('firstName', e.target.value)} required />
              </div>
              <div>
                <label className="form-label">Nom</label>
                <input className="form-input" placeholder="Martin" value={form.lastName} onChange={e => set('lastName', e.target.value)} required />
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label className="form-label">Adresse e-mail</label>
              <input
                className="form-input"
                type="email"
                placeholder="alex@entreprise.com"
                value={form.email}
                onChange={e => set('email', e.target.value)}
                required
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label className="form-label">Entreprise / Organisation</label>
              <input className="form-input" placeholder="ex. Acme Events (facultatif)" value={form.company} onChange={e => set('company', e.target.value)} />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label className="form-label">Mot de passe</label>
              <div style={{ position: 'relative' }}>
                <input
                  className="form-input"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Au moins 8 caractères"
                  value={form.password}
                  onChange={e => set('password', e.target.value)}
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

            <div style={{ marginBottom: 8 }}>
              <label className="form-label">Confirmer le mot de passe</label>
              <input
                className="form-input"
                type={showPassword ? 'text' : 'password'}
                placeholder="Répétez le mot de passe"
                value={form.confirmPassword}
                onChange={e => set('confirmPassword', e.target.value)}
                required
              />
            </div>

            {error && (
              <div style={{ marginTop: 12, padding: '10px 12px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, fontSize: 13, color: '#dc2626' }}>
                {error}
              </div>
            )}

            <label style={{ display: 'flex', alignItems: 'flex-start', gap: 8, cursor: 'pointer', marginTop: 20, marginBottom: 24 }}>
              <div
                onClick={() => setAcceptTerms(!acceptTerms)}
                style={{
                  width: 18, height: 18, borderRadius: 5, marginTop: 1,
                  border: acceptTerms ? 'none' : '1.5px solid #d1d5db',
                  background: acceptTerms ? '#365E8D' : 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.15s', flexShrink: 0,
                }}
              >
                {acceptTerms && (
                  <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span style={{ fontSize: 13, color: '#374151', lineHeight: 1.5 }}>
                J&apos;accepte les <a style={{ color: '#365E8D', fontWeight: 600, cursor: 'pointer', textDecoration: 'none' }}>conditions d&apos;utilisation</a> et la <a style={{ color: '#365E8D', fontWeight: 600, cursor: 'pointer', textDecoration: 'none' }}>politique de confidentialité</a>
              </span>
            </label>

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
                  Création du compte...
                </>
              ) : 'Créer mon compte'}
            </button>
          </form>

          <p style={{ fontSize: 13, color: '#94a3b8', textAlign: 'center', marginTop: 28 }}>
            Vous avez déjà un compte ?{' '}
            <a style={{ color: '#365E8D', fontWeight: 600, cursor: 'pointer' }} onClick={onGoToLogin}>Se connecter</a>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
