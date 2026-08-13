import { useState } from 'react'

const regBadge = (s) => {
  if (s === 'Confirmé') return <span className="badge badge-green">{s}</span>
  if (s === 'En attente') return <span className="badge badge-orange">{s}</span>
  if (s === 'Annulé') return <span className="badge badge-red">{s}</span>
  if (s === 'En liste d\'attente') return <span className="badge badge-purple">{s}</span>
  return <span className="badge badge-gray">{s}</span>
}

const attendBadge = (s) => {
  if (s === 'Présent') return <span className="badge badge-green">{s}</span>
  if (s === 'Absent') return <span className="badge badge-red">{s}</span>
  return <span className="badge badge-gray">{s}</span>
}

export default function Participants({ shared }) {
  const participants = shared?.participants || []
  const addParticipant = shared?.addParticipant || (() => {})
  const deleteParticipants = shared?.deleteParticipants || (() => {})
  const events = shared?.events || []

  const [search, setSearch] = useState('')
  const [regFilter, setRegFilter] = useState('Tous')
  const [attendFilter, setAttendFilter] = useState('Tous')
  const [selected, setSelected] = useState([])
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', event: '' })
  const [errors, setErrors] = useState({})

  const filtered = participants.filter(p => {
    const matchSearch = (p.name || '').toLowerCase().includes(search.toLowerCase()) || (p.email || '').toLowerCase().includes(search.toLowerCase()) || (p.event || '').toLowerCase().includes(search.toLowerCase())
    const matchReg = regFilter === 'Tous' || p.regStatus === regFilter
    const matchAttend = attendFilter === 'Tous' || p.attendance === attendFilter
    return matchSearch && matchReg && matchAttend
  })

  const toggleSelect = (id) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id])
  const toggleAll = () => setSelected(selected.length === filtered.length ? [] : filtered.map(p => p.id))

  const confirmed = participants.filter(p => p.regStatus === 'Confirmé').length
  const present = participants.filter(p => p.attendance === 'Présent').length

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const handleAdd = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Le nom est requis.'
    if (!form.email.trim()) errs.email = 'L\'e-mail est requis.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errs.email = 'Adresse e-mail invalide.'
    setErrors(errs)
    if (Object.keys(errs).length > 0) return
    addParticipant({
      name: form.name,
      email: form.email,
      event: form.event || (events[0]?.name || '—'),
    })
    setForm({ name: '', email: '', event: '' })
    setShowAdd(false)
    setErrors({})
  }

  return (
    <div>
      <div style={{ marginBottom: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>Participants</h1>
          <p style={{ fontSize: 14, color: '#64748b' }}>{participants.length} inscrits &middot; {confirmed} confirmés &middot; {present} présents</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn-secondary" onClick={() => setShowAdd(true)}>
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Ajouter
          </button>
          <button className="btn-primary">
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Exporter en CSV
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 20 }}>
        {[
          { label: 'Total des inscrits', value: participants.length, color: '#365E8D', bg: '#eff6ff' },
          { label: 'Confirmés', value: confirmed, color: '#10b981', bg: '#ecfdf5' },
          { label: 'Présents', value: present, color: '#f59e0b', bg: '#fffbeb' },
          { label: 'Annulés', value: participants.filter(p => p.regStatus === 'Annulé').length, color: '#ef4444', bg: '#fef2f2' },
        ].map((s) => (
          <div key={s.label} className="card" style={{ padding: '16px 20px' }}>
            <div style={{ fontSize: 13, color: '#64748b', marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="card" style={{ padding: '14px 20px', marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
              <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input className="form-input" placeholder="Rechercher par nom, e-mail ou événement..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 36 }} />
          </div>
          <select className="form-input" style={{ width: 180 }} value={regFilter} onChange={e => setRegFilter(e.target.value)}>
            <option>Tous</option>
            <option>Confirmé</option>
            <option>En attente</option>
            <option>Annulé</option>
            <option>En liste d&apos;attente</option>
          </select>
          <select className="form-input" style={{ width: 180 }} value={attendFilter} onChange={e => setAttendFilter(e.target.value)}>
            <option>Tous</option>
            <option>Présent</option>
            <option>Absent</option>
            <option>En attente</option>
          </select>
          {selected.length > 0 && (
            <button className="btn-secondary" style={{ color: '#dc2626', borderColor: '#fca5a5' }} onClick={() => { deleteParticipants(selected); setSelected([]) }}>
              Supprimer la sélection ({selected.length})
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="card">
        {participants.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #f1f5f9', background: '#fafbfc' }}>
                  <th style={{ padding: '12px 20px', width: 40 }}>
                    <input type="checkbox" checked={selected.length === filtered.length && filtered.length > 0} onChange={toggleAll} style={{ cursor: 'pointer', width: 16, height: 16, accentColor: '#365E8D' }} />
                  </th>
                  {['Participant', 'Événement', 'Inscrit le', 'Billet #', 'Statut d&apos;inscription', 'Présence'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => (
                  <tr key={p.id} className="table-row" style={{ borderBottom: i < filtered.length - 1 ? '1px solid #f8fafc' : 'none' }}>
                    <td style={{ padding: '12px 20px' }}>
                      <input type="checkbox" checked={selected.includes(p.id)} onChange={() => toggleSelect(p.id)} style={{ cursor: 'pointer', width: 16, height: 16, accentColor: '#365E8D' }} />
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                          background: `hsl(${(p.id || 1) * 47 % 360}, 60%, 92%)`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 13, fontWeight: 700, color: `hsl(${(p.id || 1) * 47 % 360}, 50%, 35%)`,
                        }}>
                          {(p.name || '').split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{p.name}</div>
                          <div style={{ fontSize: 12, color: '#94a3b8' }}>{p.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 13, color: '#64748b', whiteSpace: 'nowrap' }}>{p.event}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13, color: '#64748b', whiteSpace: 'nowrap' }}>{p.registered}</td>
                    <td style={{ padding: '12px 16px', fontSize: 12, color: '#94a3b8', fontFamily: 'monospace' }}>{p.ticket}</td>
                    <td style={{ padding: '12px 16px' }}>{regBadge(p.regStatus)}</td>
                    <td style={{ padding: '12px 16px' }}>{attendBadge(p.attendance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ padding: '64px 32px', textAlign: 'center', color: '#94a3b8' }}>
            <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ margin: '0 auto 12px', display: 'block', opacity: 0.4 }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" strokeWidth={1.5} />
            </svg>
            <div style={{ fontSize: 16, fontWeight: 600, color: '#64748b', marginBottom: 4 }}>Aucun participant inscrit</div>
            <div style={{ fontSize: 14 }}>Cliquez sur « Ajouter » pour inscrire votre premier participant.</div>
          </div>
        )}
        {participants.length > 0 && filtered.length === 0 && (
          <div style={{ padding: '48px', textAlign: 'center', color: '#94a3b8' }}>Aucun participant ne correspond à vos filtres</div>
        )}
      </div>

      {/* Add participant modal */}
      {showAdd && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: 24 }}
          onClick={() => setShowAdd(false)}>
          <div className="card" style={{ maxWidth: 420, width: '100%', padding: 32 }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', marginBottom: 24 }}>Ajouter un participant</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label className="form-label">Nom complet <span style={{ color: '#ef4444' }}>*</span></label>
                <input className="form-input" placeholder="ex. Marie Dupont" value={form.name} onChange={e => set('name', e.target.value)} />
                {errors.name && <div style={{ fontSize: 12, color: '#dc2626', marginTop: 4 }}>{errors.name}</div>}
              </div>
              <div>
                <label className="form-label">Adresse e-mail <span style={{ color: '#ef4444' }}>*</span></label>
                <input className="form-input" type="email" placeholder="marie@exemple.com" value={form.email} onChange={e => set('email', e.target.value)} />
                {errors.email && <div style={{ fontSize: 12, color: '#dc2626', marginTop: 4 }}>{errors.email}</div>}
              </div>
              <div>
                <label className="form-label">Événement</label>
                <select className="form-input" value={form.event} onChange={e => set('event', e.target.value)}>
                  <option value="">—</option>
                  {events.map(ev => <option key={ev.id} value={ev.name}>{ev.name}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <button className="btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={handleAdd}>Ajouter</button>
              <button className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setShowAdd(false)}>Annuler</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
