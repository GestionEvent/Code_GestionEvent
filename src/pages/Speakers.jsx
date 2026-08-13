import { useState } from 'react'

export default function Speakers({ shared }) {
  const speakers = shared?.speakers || []
  const addSpeaker = shared?.addSpeaker || (() => {})
  const updateSpeaker = shared?.updateSpeaker || (() => {})
  const deleteSpeaker = shared?.deleteSpeaker || (() => {})

  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)
  const [showAdd, setShowAdd] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [form, setForm] = useState({ name: '', role: '', company: '', email: '', bio: '' })
  const [errors, setErrors] = useState({})

  const filtered = speakers.filter(s =>
    (s.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (s.company || '').toLowerCase().includes(search.toLowerCase()) ||
    (s.topics || []).some(t => (t || '').toLowerCase().includes(search.toLowerCase()))
  )

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const openAdd = () => {
    setForm({ name: '', role: '', company: '', email: '', bio: '' })
    setErrors({})
    setShowAdd(true)
  }

  const openEdit = (sp) => {
    setForm({ name: sp.name, role: sp.role, company: sp.company, email: sp.email, bio: sp.bio })
    setErrors({})
    setSelected(sp)
  }

  const handleSave = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Le nom est requis.'
    if (!form.email.trim()) errs.email = 'L\'e-mail est requis.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errs.email = 'Adresse e-mail invalide.'
    setErrors(errs)
    if (Object.keys(errs).length > 0) return
    if (selected) {
      updateSpeaker(selected.id, form)
    } else {
      addSpeaker(form)
    }
    setForm({ name: '', role: '', company: '', email: '', bio: '' })
    setSelected(null)
    setShowAdd(false)
    setErrors({})
  }

  const openMessages = () => {}

  return (
    <div>
      <div style={{ marginBottom: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>Intervenants</h1>
          <p style={{ fontSize: 14, color: '#64748b' }}>{speakers.length} intervenants &middot; {speakers.reduce((a, s) => a + (s.events || 0), 0)} apparitions</p>
        </div>
        <button className="btn-primary" onClick={openAdd}>
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Ajouter un intervenant
        </button>
      </div>

      {/* Search */}
      <div className="card" style={{ padding: '14px 20px', marginBottom: 24 }}>
        <div style={{ position: 'relative', maxWidth: 400 }}>
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input className="form-input" placeholder="Rechercher par nom, entreprise ou thème..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 36 }} />
        </div>
      </div>

      {/* Speaker cards grid */}
      {speakers.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {filtered.map(sp => (
            <div key={sp.id} className="speaker-card" onClick={() => openEdit(sp)} style={{ cursor: 'pointer', position: 'relative' }}>
              <div style={{ display: 'flex', gap: 14, marginBottom: 16 }}>
                <div style={{
                  width: 60, height: 60, borderRadius: 12, flexShrink: 0,
                  background: `hsl(${(sp.id || 1) * 47 % 360}, 60%, 92%)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 20, fontWeight: 700, color: `hsl(${(sp.id || 1) * 47 % 360}, 50%, 35%)`,
                  border: '2px solid #e2e8f0',
                }}>
                  {(sp.name || '?').split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 2 }}>{sp.name}</div>
                  <div style={{ fontSize: 13, color: '#365E8D', fontWeight: 600, marginBottom: 2 }}>{sp.role || '—'}</div>
                  <div style={{ fontSize: 12, color: '#94a3b8' }}>{sp.company || '—'}</div>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); setConfirmDelete(sp.id) }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 4, alignSelf: 'flex-start', fontSize: 16 }}
                  title="Supprimer"
                >
                  <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>

              {sp.bio ? (
                <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6, marginBottom: 14, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {sp.bio}
                </p>
              ) : (
                <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.6, marginBottom: 14 }}>Aucune biographie renseignée.</p>
              )}

              {/* Contact */}
              <div style={{ display: 'flex', gap: 12, borderTop: '1px solid #f1f5f9', paddingTop: 14 }}>
                <a style={{ fontSize: 12, color: '#64748b', display: 'flex', alignItems: 'center', gap: 5, textDecoration: 'none' }}>
                  <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {sp.email}
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card" style={{ padding: '64px 32px', textAlign: 'center', color: '#94a3b8' }}>
          <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ margin: '0 auto 12px', display: 'block', opacity: 0.4 }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" strokeWidth={1.5} />
          </svg>
          <div style={{ fontSize: 16, fontWeight: 600, color: '#64748b', marginBottom: 4 }}>Aucun intervenant</div>
          <div style={{ fontSize: 14 }}>Cliquez sur « Ajouter un intervenant » pour en créer un.</div>
        </div>
      )}
      {speakers.length > 0 && filtered.length === 0 && (
        <div style={{ padding: '48px', textAlign: 'center', color: '#94a3b8' }}>Aucun intervenant ne correspond à votre recherche</div>
      )}

      {/* Add/Edit modal */}
      {showAdd && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: 24 }}
          onClick={() => { setShowAdd(false); setSelected(null) }}>
          <div className="card" style={{ maxWidth: 480, width: '100%', padding: 32, maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#0f172a' }}>{selected ? 'Modifier l\'intervenant' : 'Ajouter un nouvel intervenant'}</div>
              <button onClick={() => { setShowAdd(false); setSelected(null) }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label className="form-label">Nom complet <span style={{ color: '#ef4444' }}>*</span></label>
                  <input className="form-input" placeholder="Dr. Jane Smith" value={form.name} onChange={e => set('name', e.target.value)} />
                  {errors.name && <div style={{ fontSize: 12, color: '#dc2626', marginTop: 4 }}>{errors.name}</div>}
                </div>
                <div>
                  <label className="form-label">Titre / Rôle</label>
                  <input className="form-input" placeholder="CTO chez Acme" value={form.role} onChange={e => set('role', e.target.value)} />
                </div>
              </div>
              <div><label className="form-label">Entreprise</label><input className="form-input" placeholder="Acme Corp" value={form.company} onChange={e => set('company', e.target.value)} /></div>
              <div>
                <label className="form-label">E-mail <span style={{ color: '#ef4444' }}>*</span></label>
                <input className="form-input" type="email" placeholder="jane@acme.com" value={form.email} onChange={e => set('email', e.target.value)} />
                {errors.email && <div style={{ fontSize: 12, color: '#dc2626', marginTop: 4 }}>{errors.email}</div>}
              </div>
              <div><label className="form-label">Biographie</label><textarea className="form-input" rows={3} placeholder="Brève bio..." value={form.bio} onChange={e => set('bio', e.target.value)} style={{ resize: 'vertical' }} /></div>
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <button className="btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={handleSave}>{selected ? 'Enregistrer' : 'Ajouter l\'intervenant'}</button>
              <button className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => { setShowAdd(false); setSelected(null) }}>Annuler</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm modal */}
      {confirmDelete && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: 24 }}
          onClick={() => setConfirmDelete(null)}>
          <div className="card" style={{ maxWidth: 400, width: '100%', padding: 32 }} onClick={e => e.stopPropagation()}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#dc2626" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>Supprimer l&apos;intervenant</div>
            <div style={{ fontSize: 14, color: '#64748b', marginBottom: 24, lineHeight: 1.6 }}>Êtes-vous sûr de vouloir supprimer cet intervenant ? Cette action est irréversible.</div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setConfirmDelete(null)}>Annuler</button>
              <button className="btn-primary" style={{ flex: 1, justifyContent: 'center', background: '#dc2626' }} onClick={() => { deleteSpeaker(confirmDelete); setConfirmDelete(null) }}>Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
