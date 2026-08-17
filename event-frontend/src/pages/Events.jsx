import { useState } from 'react'

const statusBadge = (s) => {
  if (s === 'Actif') return <span className="badge badge-green">{s}</span>
  if (s === 'À venir') return <span className="badge badge-blue">{s}</span>
  if (s === 'Terminé') return <span className="badge badge-gray">{s}</span>
  if (s === 'Brouillon') return <span className="badge badge-orange">{s}</span>
  return <span className="badge badge-gray">{s}</span>
}

export default function Events({ shared, onNavigate }) {
  const events = shared?.events || []
  const deleteEvent = shared?.deleteEvent || (() => {})
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('Toutes')
  const [statusFilter, setStatusFilter] = useState('Tous')
  const [deleteId, setDeleteId] = useState(null)

  const filtered = events.filter(ev => {
    const matchSearch = (ev.name || '').toLowerCase().includes(search.toLowerCase()) || (ev.location || '').toLowerCase().includes(search.toLowerCase())
    const matchCat = category === 'Toutes' || ev.category === category
    const matchStatus = statusFilter === 'Tous' || ev.status === statusFilter
    return matchSearch && matchCat && matchStatus
  })

  const categories = ['Technologie', 'Design', 'Affaires', 'Marketing', 'Produit', 'Science', 'Art & Culture', 'Sports']

  return (
    <div>
      <div style={{ marginBottom: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>Gestion des événements</h1>
          <p style={{ fontSize: 14, color: '#64748b' }}>{events.length} événements au total &middot; {events.filter(e => e.status === 'Actif').length} actifs</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card" style={{ padding: '16px 20px', marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 240 }}>
            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              className="form-input"
              placeholder="Rechercher des événements..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft: 38 }}
            />
          </div>

          <select className="form-input" style={{ width: 160 }} value={category} onChange={e => setCategory(e.target.value)}>
            <option>Toutes</option>
            {categories.map(c => <option key={c}>{c}</option>)}
          </select>

          <select className="form-input" style={{ width: 160 }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option>Tous</option>
            <option>Actif</option>
            <option>À venir</option>
            <option>Terminé</option>
            <option>Brouillon</option>
          </select>

          <button className="btn-secondary" style={{ whiteSpace: 'nowrap' }}>
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Exporter
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #f1f5f9', background: '#fafbfc' }}>
                {["Nom de l'événement", 'Date', 'Lieu', 'Capacité', 'Statut', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((ev, i) => (
                <tr key={ev.id} className="table-row" style={{ borderBottom: i < filtered.length - 1 ? '1px solid #f8fafc' : 'none' }}>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>{ev.name}</div>
                    <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{ev.category || '—'}</div>
                  </td>
                  <td style={{ padding: '14px 20px', fontSize: 13, color: '#64748b', whiteSpace: 'nowrap' }}>{ev.date}</td>
                  <td style={{ padding: '14px 20px', fontSize: 13, color: '#64748b', whiteSpace: 'nowrap' }}>{ev.location}</td>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: '#0f172a', marginBottom: 4 }}>{ev.registered || 0}/{ev.capacity || 0}</div>
                    <div style={{ height: 4, background: '#f1f5f9', borderRadius: 2, width: 80 }}>
                      <div style={{
                        height: 4, borderRadius: 2,
                        background: ev.capacity && (ev.registered || 0) / ev.capacity > 0.9 ? '#10b981' : '#365E8D',
                        width: `${ev.capacity ? (ev.registered || 0) / ev.capacity * 100 : 0}%`,
                      }} />
                    </div>
                  </td>
                  <td style={{ padding: '14px 20px' }}>{statusBadge(ev.status)}</td>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button
                        onClick={() => onNavigate('event-details')}
                        style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', color: '#64748b', fontSize: 12, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4, transition: 'all 0.15s' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = '#365E8D'; e.currentTarget.style.color = '#365E8D' }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#64748b' }}
                      >
                        <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        Voir
                      </button>
                      <button
                        onClick={() => onNavigate('create-event')}
                        style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', color: '#64748b', fontSize: 12, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4, transition: 'all 0.15s' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = '#10b981'; e.currentTarget.style.color = '#10b981' }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#64748b' }}
                      >
                        <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Modifier
                      </button>
                      <button
                        onClick={() => setDeleteId(ev.id)}
                        style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', color: '#64748b', fontSize: 12, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4, transition: 'all 0.15s' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = '#dc2626'; e.currentTarget.style.color = '#dc2626' }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#64748b' }}
                      >
                        <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div style={{ padding: '48px', textAlign: 'center', color: '#94a3b8' }}>
            <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ margin: '0 auto 12px', display: 'block', opacity: 0.4 }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeWidth={1.5} />
            </svg>
            {events.length === 0 ? 'Aucun événement trouvé. Créez votre premier événement !' : 'Aucun événement ne correspond à vos filtres'}
          </div>
        )}
      </div>

      {/* FAB */}
      <button
        className="btn-primary"
        onClick={() => onNavigate('create-event')}
        style={{
          position: 'fixed', bottom: 32, right: 32, borderRadius: 50,
          padding: '14px 24px', fontSize: 14, boxShadow: '0 8px 24px rgba(37,99,235,0.35)',
          display: 'flex', alignItems: 'center', gap: 8, zIndex: 50,
        }}
      >
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        Créer un événement
      </button>

      {/* Delete confirm modal */}
      {deleteId && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}
          onClick={() => setDeleteId(null)}>
          <div className="card" style={{ padding: 32, maxWidth: 400, width: '90%', margin: '0 16px' }} onClick={e => e.stopPropagation()}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#dc2626" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>Supprimer l&apos;événement</div>
            <div style={{ fontSize: 14, color: '#64748b', marginBottom: 24, lineHeight: 1.6 }}>Êtes-vous sûr de vouloir supprimer cet événement ? Toutes les données associées, y compris les inscriptions, seront définitivement supprimées.</div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setDeleteId(null)}>Annuler</button>
              <button className="btn-primary" style={{ flex: 1, justifyContent: 'center', background: '#dc2626' }} onClick={() => { deleteEvent(deleteId); setDeleteId(null) }}>Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
