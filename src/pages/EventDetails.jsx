import { useState } from 'react'

const typeColors = {
  keynote: '#365E8D',
  workshop: '#10b981',
  panel: '#f59e0b',
  break: '#e2e8f0',
}
const typeTextColors = {
  keynote: '#365E8D',
  workshop: '#059669',
  panel: '#d97706',
  break: '#94a3b8',
}
const typeBg = {
  keynote: '#eff6ff',
  workshop: '#ecfdf5',
  panel: '#fffbeb',
  break: '#f8fafc',
}

export default function EventDetails({ shared, onNavigate }) {
  const events = shared?.events || []
  const participants = shared?.participants || []
  const speakers = shared?.speakers || []
  const current = events[0]

  const [activeTab, setActiveTab] = useState('overview')

  const tabs = ['overview', 'schedule', 'speakers', 'participants', 'resources', 'budget']

  const eventParticipants = current ? participants.filter(p => !p.event || p.event === current.name) : []
  const eventSpeakers = current?.speakers || []

  return (
    <div>
      {/* Back */}
      <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => onNavigate('events')} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 500 }}>
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Tous les événements
        </button>
        <span style={{ color: '#e2e8f0' }}>/</span>
        <span style={{ fontSize: 14, color: '#64748b' }}>{current ? current.name : 'Événement'}</span>
      </div>

      {!current ? (
        <div className="card" style={{ padding: '64px 32px', textAlign: 'center', color: '#94a3b8' }}>
          <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ margin: '0 auto 12px', display: 'block', opacity: 0.4 }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeWidth={1.5} />
          </svg>
          <div style={{ fontSize: 16, fontWeight: 600, color: '#64748b', marginBottom: 4 }}>Aucun événement sélectionné</div>
          <div style={{ fontSize: 14 }}>Créez ou ouvrez un événement pour voir ses détails.</div>
        </div>
      ) : (
        <>
          {/* Banner */}
          <div style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', marginBottom: 24, height: 220, background: 'linear-gradient(120deg, #365E8D, #1e40af)' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(15,23,42,0.75) 0%, rgba(15,23,42,0.3) 60%, transparent 100%)' }} />
            <div style={{ position: 'absolute', left: 36, bottom: 28 }}>
              <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                <span className="badge badge-green">{current.status || 'Actif'}</span>
                <span className="badge badge-blue">{current.category || '—'}</span>
              </div>
              <h1 style={{ fontSize: 28, fontWeight: 800, color: 'white', marginBottom: 6 }}>{current.name}</h1>
              <div style={{ display: 'flex', gap: 20, color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  {current.date || '—'}{current.time ? ' · ' + current.time : ''}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              {current.venue ? current.venue + ', ' + current.location : (current.location || '—')}
                </span>
              </div>
            </div>
            <div style={{ position: 'absolute', right: 24, top: 24, display: 'flex', gap: 8 }}>
              <button className="btn-secondary" style={{ fontSize: 13, padding: '7px 14px', background: 'rgba(255,255,255,0.9)' }}>
                Partager
              </button>
              <button className="btn-primary" style={{ fontSize: 13, padding: '7px 14px' }} onClick={() => onNavigate('create-event')}>
                Modifier l&apos;événement
              </button>
            </div>
          </div>

          {/* Quick stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
            {[
              { label: 'Inscrits', value: current.registered || 0, total: current.capacity || 0, color: '#365E8D' },
              { label: 'Participants', value: eventParticipants.length, total: '', color: '#10b981' },
              { label: 'Intervenants', value: eventSpeakers.length, total: '', color: '#f59e0b' },
              { label: 'Capacité', value: current.capacity || 0, total: '', color: '#8b5cf6' },
            ].map(s => (
              <div key={s.label} className="card" style={{ padding: '16px 20px' }}>
                <div style={{ fontSize: 13, color: '#64748b', marginBottom: 6 }}>{s.label}</div>
                <div style={{ fontSize: 26, fontWeight: 800, color: s.color }}>
                  {s.value}
                  {s.total ? <span style={{ fontSize: 14, color: '#94a3b8', fontWeight: 400 }}>/{s.total}</span> : null}
                </div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid #e2e8f0', marginBottom: 24 }}>
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '10px 16px', border: 'none', background: 'none', cursor: 'pointer',
                  fontSize: 14, fontWeight: activeTab === tab ? 600 : 500,
                  color: activeTab === tab ? '#365E8D' : '#64748b',
                  borderBottom: `2px solid ${activeTab === tab ? '#365E8D' : 'transparent'}`,
                  marginBottom: -1, transition: 'all 0.15s', textTransform: 'capitalize',
                }}
              >
                {tab === 'overview' ? 'Aperçu' : tab === 'schedule' ? 'Programme' : tab === 'speakers' ? 'Intervenants' : tab === 'participants' ? 'Participants' : tab === 'resources' ? 'Ressources' : 'Budget'}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {activeTab === 'overview' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>
              <div className="card" style={{ padding: 28 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 16 }}>À propos de cet événement</div>
                <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.8 }}>
                  {current.description || 'Aucune description fournie pour cet événement.'}
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 24 }}>
                  {[
                    { label: 'Organisateur', value: 'EventFlow Inc.' },
                    { label: 'Format', value: 'En présentiel' },
                    { label: 'Catégorie', value: current.category || '—' },
                    { label: 'Lieu', value: current.venue || '—' },
                  ].map(d => (
                    <div key={d.label} style={{ padding: '14px 16px', background: '#f8fafc', borderRadius: 8 }}>
                      <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 4 }}>{d.label}</div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>{d.value}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="card" style={{ padding: 20 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 14 }}>Progression des inscriptions</div>
                  <div style={{ marginBottom: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 13, color: '#64748b' }}>Capacité remplie</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{current.registered || 0}/{current.capacity || 0}</span>
                    </div>
                    <div style={{ height: 8, background: '#f1f5f9', borderRadius: 4 }}>
                      <div style={{ height: 8, borderRadius: 4, background: 'linear-gradient(90deg, #365E8D, #3b82f6)', width: `${current.capacity ? (current.registered || 0) / current.capacity * 100 : 0}%` }} />
                    </div>
                  </div>
                </div>
                <div className="card" style={{ padding: 20 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 14 }}>Détails du lieu</div>
                  <div style={{ fontSize: 13, color: '#374151', marginBottom: 8 }}>
                    <strong>{current.venue || '—'}</strong><br />{current.location || '—'}
                  </div>
                  <div style={{ height: 100, background: '#f1f5f9', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: 13 }}>
                    Vue de la carte
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'schedule' && (
            <div className="card" style={{ padding: 24 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 24 }}>Programme de la journée</div>
              <div style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>
                Aucun programme défini pour le moment.
              </div>
            </div>
          )}

          {activeTab === 'speakers' && (
            <div className="card" style={{ padding: 24 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 20 }}>Intervenants de l&apos;événement</div>
              {eventSpeakers.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {eventSpeakers.map((sp, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 16px', background: '#f8fafc', borderRadius: 10, border: '1px solid #f1f5f9' }}>
                      <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#365E8D' }}>
                        {(sp.name || '?')[0]}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>{sp.name}</div>
                        <div style={{ fontSize: 12, color: '#94a3b8' }}>{sp.role || '—'}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>
                  Aucun intervenant assigné à cet événement.
                </div>
              )}
            </div>
          )}

          {activeTab === 'participants' && (
            <div className="card" style={{ padding: 24 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 20 }}>Participants inscrits</div>
              {eventParticipants.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {eventParticipants.map(p => (
                    <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 16px', background: '#f8fafc', borderRadius: 10, border: '1px solid #f1f5f9' }}>
                      <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#365E8D' }}>
                        {(p.name || '?')[0]}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>{p.name}</div>
                        <div style={{ fontSize: 12, color: '#94a3b8' }}>{p.email}</div>
                      </div>
                      <span className="badge badge-green">{p.regStatus || 'Confirmé'}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>
                  Aucun participant inscrit à cet événement.
                </div>
              )}
            </div>
          )}

          {activeTab === 'resources' && (
            <div className="card" style={{ padding: 24 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 20 }}>Ressources de l&apos;événement</div>
              <div style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>
                Aucune ressource disponible pour le moment.
              </div>
            </div>
          )}

          {activeTab === 'budget' && (
            <div className="card" style={{ padding: 24 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 24 }}>Budget</div>
              <div style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>
                Aucune donnée budgétaire disponible pour le moment.
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
