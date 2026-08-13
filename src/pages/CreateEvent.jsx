import { useState } from 'react'

const categories = ['Technologie', 'Design', 'Affaires', 'Marketing', 'Produit', 'Science', 'Art & Culture', 'Sports']

export default function CreateEvent({ shared, onNavigate }) {
  const addEvent = shared?.addEvent || (() => {})
  const [form, setForm] = useState({
    title: '', description: '', category: '', date: '', time: '', endTime: '',
    location: '', venue: '', capacity: '', ticketPrice: '',
  })
  const [speakers, setSpeakers] = useState([{ name: '', role: '', bio: '' }])
  const [dragOver, setDragOver] = useState(false)
  const [bannerPreview, setBannerPreview] = useState(null)
  const [errors, setErrors] = useState({})

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const addSpeaker = () => setSpeakers(s => [...s, { name: '', role: '', bio: '' }])
  const removeSpeaker = (i) => setSpeakers(s => s.filter((_, idx) => idx !== i))
  const updateSpeaker = (i, key, val) =>
    setSpeakers(s => s.map((sp, idx) => idx === i ? { ...sp, [key]: val } : sp))

  const handleBanner = (e) => {
    const file = e.target.files?.[0]
    if (file) setBannerPreview(URL.createObjectURL(file))
  }

  const validate = () => {
    const errs = {}
    if (!form.title.trim()) errs.title = 'Le titre est requis.'
    if (!form.description.trim()) errs.description = 'La description est requise.'
    if (!form.date.trim()) errs.date = 'La date est requise.'
    if (!form.location.trim()) errs.location = 'La localisation est requise.'
    if (!form.capacity.trim()) errs.capacity = 'La capacité est requise.'
    else if (Number(form.capacity) <= 0) errs.capacity = 'La capacité doit être positive.'
    return errs
  }

  const handlePublish = () => {
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length > 0) return
    addEvent({
      name: form.title,
      description: form.description,
      category: form.category || 'Général',
      date: form.date,
      time: form.time,
      endTime: form.endTime,
      location: form.location,
      venue: form.venue,
      capacity: Number(form.capacity) || 0,
      ticketPrice: form.ticketPrice || '0',
      speakers: speakers.filter(s => s.name.trim()).map(s => ({ name: s.name, role: s.role, bio: s.bio })),
    })
    setForm({
      title: '', description: '', category: '', date: '', time: '', endTime: '',
      location: '', venue: '', capacity: '', ticketPrice: '',
    })
    setSpeakers([{ name: '', role: '', bio: '' }])
    setErrors({})
    onNavigate('events')
  }

  return (
    <div style={{ maxWidth: 860, margin: '0 auto' }}>
      <div style={{ marginBottom: 28, display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          onClick={() => onNavigate('events')}
          style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 500 }}
        >
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Retour
        </button>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a' }}>Créer un nouvel événement</h1>
          <p style={{ fontSize: 14, color: '#64748b', marginTop: 2 }}>Renseignez les détails pour publier votre événement</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>
        {/* Main form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Basic info */}
          <div className="card" style={{ padding: 24 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 24, height: 24, borderRadius: 6, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="#365E8D" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              Informations de base
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label className="form-label">Titre de l&apos;événement <span style={{ color: '#ef4444' }}>*</span></label>
                <input className="form-input" placeholder="ex. TechConf 2025 — L'avenir de l'innovation" value={form.title} onChange={e => set('title', e.target.value)} />
                {errors.title && <div style={{ fontSize: 12, color: '#dc2626', marginTop: 4 }}>{errors.title}</div>}
              </div>
              <div>
                <label className="form-label">Description <span style={{ color: '#ef4444' }}>*</span></label>
                <textarea
                  className="form-input"
                  placeholder="Décrivez votre événement — à quoi vous attendre, qui devrait y participer, pourquoi il compte..."
                  value={form.description}
                  onChange={e => set('description', e.target.value)}
                  rows={4}
                  style={{ resize: 'vertical', lineHeight: 1.6 }}
                />
                {errors.description && <div style={{ fontSize: 12, color: '#dc2626', marginTop: 4 }}>{errors.description}</div>}
              </div>
              <div>
                <label className="form-label">Catégorie</label>
                <select className="form-input" value={form.category} onChange={e => set('category', e.target.value)}>
                  <option value="">Sélectionnez une catégorie</option>
                  {categories.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Date & Time */}
          <div className="card" style={{ padding: 24 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 24, height: 24, borderRadius: 6, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="#365E8D" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              Date & Heure
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
              <div>
                <label className="form-label">Date de l&apos;événement <span style={{ color: '#ef4444' }}>*</span></label>
                <input className="form-input" type="date" value={form.date} onChange={e => set('date', e.target.value)} />
                {errors.date && <div style={{ fontSize: 12, color: '#dc2626', marginTop: 4 }}>{errors.date}</div>}
              </div>
              <div>
                <label className="form-label">Heure de début</label>
                <input className="form-input" type="time" value={form.time} onChange={e => set('time', e.target.value)} />
              </div>
              <div>
                <label className="form-label">Heure de fin</label>
                <input className="form-input" type="time" value={form.endTime} onChange={e => set('endTime', e.target.value)} />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="card" style={{ padding: 24 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 24, height: 24, borderRadius: 6, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="#365E8D" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              Localisation
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label className="form-label">Ville / Région <span style={{ color: '#ef4444' }}>*</span></label>
                <input className="form-input" placeholder="ex. San Francisco, CA" value={form.location} onChange={e => set('location', e.target.value)} />
                {errors.location && <div style={{ fontSize: 12, color: '#dc2626', marginTop: 4 }}>{errors.location}</div>}
              </div>
              <div>
                <label className="form-label">Nom du lieu</label>
                <input className="form-input" placeholder="ex. Moscone Center, Hall B" value={form.venue} onChange={e => set('venue', e.target.value)} />
              </div>
            </div>
          </div>

          {/* Speakers */}
          <div className="card" style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 24, height: 24, borderRadius: 6, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="#365E8D" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </div>
                Ajouter des intervenants
              </div>
              <button className="btn-secondary" onClick={addSpeaker} style={{ fontSize: 13, padding: '7px 14px' }}>
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Ajouter un intervenant
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {speakers.map((sp, i) => (
                <div key={i} style={{ padding: 16, background: '#f8fafc', borderRadius: 10, border: '1px solid #f1f5f9' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#64748b' }}>Intervenant {i + 1}</span>
                    {speakers.length > 1 && (
                      <button onClick={() => removeSpeaker(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 4 }}>
                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                    <div>
                      <label className="form-label">Nom complet</label>
                      <input className="form-input" placeholder="Dr. Jane Smith" value={sp.name} onChange={e => updateSpeaker(i, 'name', e.target.value)} />
                    </div>
                    <div>
                      <label className="form-label">Rôle / Titre</label>
                      <input className="form-input" placeholder="CTO chez Acme Corp" value={sp.role} onChange={e => updateSpeaker(i, 'role', e.target.value)} />
                    </div>
                  </div>
                  <div>
                    <label className="form-label">Bio courte</label>
                    <textarea className="form-input" placeholder="Brève bio pour la page de l'événement..." value={sp.bio} onChange={e => updateSpeaker(i, 'bio', e.target.value)} rows={2} style={{ resize: 'vertical' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Banner upload */}
          <div className="card" style={{ padding: 24 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 16 }}>Image de bannière</div>
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => { e.preventDefault(); setDragOver(false) }}
              style={{
                border: `2px dashed ${dragOver ? '#365E8D' : '#e2e8f0'}`,
                borderRadius: 10, padding: 24, textAlign: 'center',
                background: dragOver ? '#eff6ff' : '#f8fafc',
                transition: 'all 0.15s', cursor: 'pointer',
                overflow: 'hidden',
              }}
              onClick={() => document.getElementById('bannerInput')?.click()}
            >
              {bannerPreview ? (
                <img src={bannerPreview} alt="Banner preview" style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 8 }} />
              ) : (
                <>
                  <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="#94a3b8" style={{ margin: '0 auto 12px', display: 'block' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#64748b', marginBottom: 4 }}>Cliquez ou glissez-déposez</div>
                  <div style={{ fontSize: 12, color: '#94a3b8' }}>PNG, JPG, WebP jusqu&apos;à 5 Mo</div>
                  <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>Recommandé : 1200 × 630 px</div>
                </>
              )}
              <input id="bannerInput" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleBanner} />
            </div>
          </div>

          {/* Capacity & Ticket */}
          <div className="card" style={{ padding: 24 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 16 }}>Capacité & Tarification</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label className="form-label">Capacité maximale <span style={{ color: '#ef4444' }}>*</span></label>
                <input className="form-input" type="number" placeholder="500" value={form.capacity} onChange={e => set('capacity', e.target.value)} />
                {errors.capacity && <div style={{ fontSize: 12, color: '#dc2626', marginTop: 4 }}>{errors.capacity}</div>}
              </div>
              <div>
                <label className="form-label">Prix du billet (USD)</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: 14, fontWeight: 500 }}>$</span>
                  <input className="form-input" type="number" placeholder="0,00 (gratuit)" value={form.ticketPrice} onChange={e => set('ticketPrice', e.target.value)} style={{ paddingLeft: 28 }} />
                </div>
              </div>
            </div>
          </div>

          {/* Summary card */}
          <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 12, padding: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#1e40af', marginBottom: 12 }}>Liste de contrôle de publication</div>
            {[
              { label: 'Titre de l&apos;événement', done: !!form.title },
              { label: 'Description', done: !!form.description },
              { label: 'Date et heure', done: !!form.date },
              { label: 'Localisation', done: !!form.location },
              { label: 'Capacité définie', done: !!form.capacity },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <div style={{
                  width: 16, height: 16, borderRadius: '50%',
                  background: item.done ? '#10b981' : '#e2e8f0',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  {item.done && (
                    <svg width="9" height="9" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span style={{ fontSize: 13, color: item.done ? '#1e40af' : '#94a3b8' }}>{item.label}</span>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button className="btn-primary" style={{ justifyContent: 'center', height: 44 }} onClick={handlePublish}>
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Publier l&apos;événement
            </button>
            <button className="btn-secondary" style={{ justifyContent: 'center', height: 44 }}>
              Enregistrer comme brouillon
            </button>
            <button onClick={() => onNavigate('events')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: 13, padding: '8px', textDecoration: 'underline' }}>
              Annuler
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
