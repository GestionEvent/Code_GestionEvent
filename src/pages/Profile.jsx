import { useState } from 'react'

const EMPTY_INFO = {
  firstName: '', lastName: '',
  email: '', phone: '',
  role: '', company: '', location: '',
  bio: '', timezone: 'Europe/Paris',
}

function loadInfo() {
  try {
    const raw = localStorage.getItem('ge_profile')
    return raw ? { ...EMPTY_INFO, ...JSON.parse(raw) } : { ...EMPTY_INFO }
  } catch {
    return { ...EMPTY_INFO }
  }
}

export default function Profile() {
  const [activeTab, setActiveTab] = useState('info')
  const [info, setInfo] = useState(loadInfo)
  const [notifs, setNotifs] = useState({
    newRegistrations: true,
    eventReminders: true,
    speakerConfirmations: true,
    capacityAlerts: true,
    weeklyReports: false,
    marketingEmails: false,
    browserPush: true,
    smsAlerts: false,
  })
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    try {
      localStorage.setItem('ge_profile', JSON.stringify(info))
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch {
      // ignore storage errors
    }
  }

const fullName = info.firstName || info.lastName ? `${info.firstName} ${info.lastName}`.trim() : 'Gestionnaire'
  const initials = (info.firstName || info.lastName)
    ? fullName.split(' ').map(n => n[0]).join('').slice(0, 2)
    : 'G'

  const Toggle = ({ val, onToggle }) => (
    <div
      onClick={onToggle}
      style={{
        width: 44, height: 24, borderRadius: 12,
        background: val ? '#365E8D' : '#e2e8f0',
        cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0,
      }}
    >
      <div style={{
        width: 18, height: 18, borderRadius: '50%', background: 'white',
        position: 'absolute', top: 3, left: val ? 23 : 3, transition: 'left 0.2s',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
      }} />
    </div>
  )

  const setInfoField = (key, val) => setInfo(i => ({ ...i, [key]: val }))

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>Mon Profil</h1>
        <p style={{ fontSize: 14, color: '#64748b' }}>Gérez vos informations personnelles et vos préférences</p>
      </div>

{/* Profile avatar */}
      <div className="card" style={{ padding: '32px', marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ position: 'relative' }}>
          <div style={{
            width: 96, height: 96, borderRadius: '50%', background: '#eff6ff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: 30, color: '#365E8D', border: '3px solid #e2e8f0',
            overflow: 'hidden',
          }}>
            {initials}
          </div>
          <button style={{
            position: 'absolute', bottom: 2, right: 2, width: 26, height: 26, borderRadius: '50%',
            background: '#365E8D', border: '2px solid white', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid #e2e8f0', marginBottom: 24 }}>
        {([['info', 'Informations personnelles'], ['password', 'Changer le mot de passe'], ['notifications', 'Notifications']]).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            style={{
              padding: '10px 18px', border: 'none', background: 'none', cursor: 'pointer',
              fontSize: 14, fontWeight: activeTab === id ? 600 : 500,
              color: activeTab === id ? '#365E8D' : '#64748b',
              borderBottom: `2px solid ${activeTab === id ? '#365E8D' : 'transparent'}`,
              marginBottom: -1, transition: 'all 0.15s',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Personal Info */}
      {activeTab === 'info' && (
        <div className="card" style={{ padding: 32 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
            <div>
              <label className="form-label">Prénom</label>
              <input className="form-input" value={info.firstName} onChange={e => setInfoField('firstName', e.target.value)} />
            </div>
            <div>
              <label className="form-label">Nom</label>
              <input className="form-input" value={info.lastName} onChange={e => setInfoField('lastName', e.target.value)} />
            </div>
            <div>
              <label className="form-label">Adresse e-mail</label>
              <input className="form-input" type="email" value={info.email} onChange={e => setInfoField('email', e.target.value)} />
            </div>
            <div>
              <label className="form-label">Numéro de téléphone</label>
              <input className="form-input" value={info.phone} onChange={e => setInfoField('phone', e.target.value)} />
            </div>
            <div>
              <label className="form-label">Rôle / Intitulé du poste</label>
              <input className="form-input" value={info.role} onChange={e => setInfoField('role', e.target.value)} />
            </div>
            <div>
              <label className="form-label">Entreprise / Organisation</label>
              <input className="form-input" value={info.company} onChange={e => setInfoField('company', e.target.value)} />
            </div>
            <div>
              <label className="form-label">Localisation</label>
              <input className="form-input" value={info.location} onChange={e => setInfoField('location', e.target.value)} />
            </div>
            <div>
              <label className="form-label">Fuseau horaire</label>
              <select className="form-input" value={info.timezone} onChange={e => setInfoField('timezone', e.target.value)}>
                <option value="America/Los_Angeles">Heure du Pacifique (PT)</option>
                <option value="America/Denver">Heure des Rocheuses (MT)</option>
                <option value="America/Chicago">Heure du Centre (CT)</option>
                <option value="America/New_York">Heure de l'Est (ET)</option>
                <option value="Europe/London">Londres (GMT)</option>
                <option value="Europe/Paris">Paris (CET)</option>
              </select>
            </div>
          </div>
          <div style={{ marginBottom: 28 }}>
            <label className="form-label">Bio</label>
            <textarea className="form-input" value={info.bio} onChange={e => setInfoField('bio', e.target.value)} rows={3} style={{ resize: 'vertical', lineHeight: 1.6 }} />
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button className="btn-primary" onClick={handleSave}>
              {saved ? (
                <>
                  <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Enregistré !
                </>
              ) : 'Enregistrer les modifications'}
            </button>
            <button className="btn-secondary">Annuler les modifications</button>
          </div>
        </div>
      )}

      {/* Change password */}
      {activeTab === 'password' && (
        <div className="card" style={{ padding: 32, maxWidth: 440 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <label className="form-label">Mot de passe actuel</label>
              <input className="form-input" type="password" placeholder="Entrez le mot de passe actuel" />
            </div>
            <div>
              <label className="form-label">Nouveau mot de passe</label>
              <input className="form-input" type="password" placeholder="Au moins 8 caractères" />
            </div>
            <div>
              <label className="form-label">Confirmer le nouveau mot de passe</label>
              <input className="form-input" type="password" placeholder="Répétez le nouveau mot de passe" />
            </div>
          </div>
          <div style={{ marginTop: 24, padding: 16, background: '#f8fafc', borderRadius: 10, fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>
            Le mot de passe doit contenir au moins 8 caractères et inclure un mélange de lettres, de chiffres et de symboles.
          </div>
          <button className="btn-primary" style={{ marginTop: 24 }} onClick={handleSave}>
            {saved ? 'Mot de passe mis à jour !' : 'Mettre à jour le mot de passe'}
          </button>
        </div>
      )}

      {/* Notifications */}
      {activeTab === 'notifications' && (
        <div className="card" style={{ padding: 32 }}>
          {[
            {
              section: 'Notifications d&apos;événement',
              items: [
                { key: 'newRegistrations', label: 'Nouvelles inscriptions', desc: 'Soyez notifié lorsqu\'une personne s\'inscrit à votre événement' },
                { key: 'eventReminders', label: 'Rappels d\'événement', desc: 'Rappels 24 heures et 1 heure avant le début de votre événement' },
                { key: 'speakerConfirmations', label: 'Confirmations des intervenants', desc: 'Lorsqu\'un intervenant accepte ou décline votre invitation' },
                { key: 'capacityAlerts', label: 'Alertes de capacité', desc: 'Alerte lorsqu\'un événement atteint 80 % puis 100 % de sa capacité' },
              ],
            },
            {
              section: 'Rapports & Marketing',
              items: [
                { key: 'weeklyReports', label: 'Rapports de synthèse hebdomadaires', desc: 'Recevez un digest hebdomadaire des performances de vos événements' },
                { key: 'marketingEmails', label: 'Mises à jour produit & fonctionnalités', desc: 'Découvrez les nouvelles fonctionnalités et astuces EventFlow' },
              ],
            },
            {
              section: 'Canaux de diffusion',
              items: [
                { key: 'browserPush', label: 'Notifications push du navigateur', desc: 'Alertes dans le navigateur lorsque EventFlow est ouvert' },
                { key: 'smsAlerts', label: 'Alertes SMS', desc: 'Alertes par SMS uniquement pour les événements critiques' },
              ],
            },
          ].map(group => (
            <div key={group.section} style={{ marginBottom: 32 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid #f1f5f9' }}>{group.section}</div>
              {group.items.map(item => (
                <div key={item.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: '#0f172a', marginBottom: 2 }}>{item.label}</div>
                    <div style={{ fontSize: 13, color: '#94a3b8' }}>{item.desc}</div>
                  </div>
                  <Toggle
                    val={notifs[item.key]}
                    onToggle={() => setNotifs(n => ({ ...n, [item.key]: !n[item.key] }))}
                  />
                </div>
              ))}
            </div>
          ))}
          <button className="btn-primary" onClick={handleSave}>
            {saved ? 'Préférences enregistrées !' : 'Enregistrer les préférences'}
          </button>
        </div>
      )}
    </div>
  )
}
