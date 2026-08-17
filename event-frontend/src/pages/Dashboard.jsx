import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'

const statusBadge = (s) => {
  if (s === 'Actif') return <span className="badge badge-green">{s}</span>
  if (s === 'À venir') return <span className="badge badge-blue">{s}</span>
  if (s === 'Terminé') return <span className="badge badge-gray">{s}</span>
  return <span className="badge badge-orange">{s}</span>
}

export default function Dashboard({ shared, onNavigate }) {
  const events = shared?.events || []
  const participants = shared?.participants || []
  const speakers = shared?.speakers || []

  // Beta modules
  const rooms = shared?.rooms || []
  const equipment = shared?.equipment || []
  const emailLogs = shared?.emailLogs || []
  const transactions = shared?.transactions || []
  const users = shared?.users || []

  const totalEvents = events.length
  const totalParticipants = participants.length
  const upcoming = events.filter(e => e.status === 'Actif' || e.status === 'À venir').length
  const totalCapacity = events.reduce((a, e) => a + (Number(e.capacity) || 0), 0)

  const revenue = transactions.filter(t => t.status === 'Payé').reduce((a, t) => a + (Number(t.amount) || 0), 0)
  const reservedRooms = rooms.filter(r => r.status === 'Réservée').length
  const emailsSent = emailLogs.filter(l => l.status === 'Envoyé').length
  const activeUsers = users.filter(u => u.status === 'Actif').length

  const recapCards = [
    {
      label: 'Revenus (billetterie)',
      value: `${revenue.toLocaleString('fr-FR', { minimumFractionDigits: 0 })} $`,
      color: '#10b981', bg: '#ecfdf5', target: 'billing',
      icon: (
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      label: 'Salles réservées', value: `${reservedRooms}/${rooms.length}`,
      color: '#365E8D', bg: '#eff6ff', target: 'logistics',
      icon: (
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
    },
    {
      label: 'E-mails envoyés', value: emailsSent,
      color: '#f59e0b', bg: '#fffbeb', target: 'communications',
      icon: (
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      label: 'Utilisateurs actifs', value: `${activeUsers}/${users.length}`,
      color: '#7c3aed', bg: '#f5f3ff', target: 'administration',
      icon: (
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
  ]

  const statCards = [
    {
      label: 'Total des événements',
      value: totalEvents,
      change: '0',
      up: true,
      color: '#365E8D',
      bg: '#eff6ff',
      icon: (
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      label: 'Participants Inscrits',
      value: totalParticipants,
      change: '0',
      up: true,
      color: '#10b981',
      bg: '#ecfdf5',
      icon: (
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      label: 'Événements à venir',
      value: upcoming,
      change: '0',
      up: true,
      color: '#f59e0b',
      bg: '#fffbeb',
      icon: (
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: 'Capacité totale',
      value: totalCapacity,
      change: '0',
      up: true,
      color: '#8b5cf6',
      bg: '#f5f3ff',
      icon: (
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
  ]

  const recentEvents = events.slice(0, 5)
  const hasData = events.length > 0

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>Tableau de bord</h1>
        <p style={{ fontSize: 14, color: '#64748b' }}>Bon retour ! Voici ce qui se passe avec vos événements.</p>
      </div>

      {/* Empty state */}
      {!hasData && (
        <div className="card" style={{ padding: '64px 32px', textAlign: 'center', marginBottom: 28 }}>
          <div style={{ width: 64, height: 64, borderRadius: 16, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#365E8D" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>Aucun événement pour le moment</h2>
          <p style={{ fontSize: 14, color: '#64748b', maxWidth: 420, margin: '0 auto 24px', lineHeight: 1.6 }}>
            Créez votre premier événement pour commencer à organiser et à gérer vos participants, intervenants et ressources.
          </p>
          <button className="btn-primary" style={{ justifyContent: 'center' }} onClick={() => onNavigate('create-event')}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Créer un événement
          </button>
        </div>
      )}

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 28 }}>
        {statCards.map((card) => (
          <div key={card.label} className="stat-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 13, color: '#64748b', fontWeight: 500, marginBottom: 8 }}>{card.label}</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: '#0f172a' }}>{card.value}</div>
              </div>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: card.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: card.color }}>
                {card.icon}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{
                display: 'flex', alignItems: 'center', gap: 3, fontSize: 12, fontWeight: 600,
                color: card.up ? '#10b981' : '#ef4444',
              }}>
                <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={card.up ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
                </svg>
                {card.change}
              </span>
              <span style={{ fontSize: 12, color: '#94a3b8' }}>vs mois dernier</span>
            </div>
          </div>
        ))}
      </div>

      {/* Beta modules recap */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 2 }}>Récapitulatif des modules</div>
        <div style={{ fontSize: 13, color: '#64748b' }}>Vue d'ensemble de la logistique, la communication, la billetterie et l'administration</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 28 }}>
        {recapCards.map((card) => (
          <div
            key={card.label}
            className="stat-card"
            style={{ cursor: 'pointer' }}
            onClick={() => onNavigate(card.target)}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: 13, color: '#64748b', fontWeight: 500, marginBottom: 8 }}>{card.label}</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#0f172a' }}>{card.value}</div>
              </div>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: card.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: card.color, flexShrink: 0 }}>
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20, marginBottom: 28 }}>
        {/* Area chart */}
        <div className="card" style={{ padding: '24px 24px 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a' }}>Statistiques des événements</div>
              <div style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>Participants et événements au fil du temps</div>
            </div>
            <select className="form-input" style={{ width: 'auto', padding: '6px 12px', fontSize: 13 }}>
              <option>Les 8 derniers mois</option>
              <option>Les 6 derniers mois</option>
              <option>Cette année</option>
            </select>
          </div>
          {hasData ? (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={[{ month: 'Aujourd\'hui', events: events.length, participants: participants.length }]} margin={{ top: 0, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPart" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#365E8D" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#365E8D" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13, boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}
                />
                <Area type="monotone" dataKey="participants" stroke="#365E8D" strokeWidth={2} fill="url(#colorPart)" name="Participants" />
                <Area type="monotone" dataKey="events" stroke="#10b981" strokeWidth={2} fill="url(#colorRev)" name="Événements" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: 14 }}>
              Aucune donnée à afficher pour le moment
            </div>
          )}
        </div>

        {/* Upcoming sessions */}
        <div className="card" style={{ padding: 24 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>Événements à venir</div>
          <div style={{ fontSize: 13, color: '#64748b', marginBottom: 20 }}>Vos prochains événements</div>
          {events.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {events.slice(0, 4).map((s) => (
                <div key={s.id} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{ width: 3, minHeight: 48, borderRadius: 2, background: '#365E8D', flexShrink: 0, marginTop: 2 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.name}</div>
                    <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>{s.date}</div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <span style={{ fontSize: 11, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 3 }}>
                        <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {s.location}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: '32px 0', textAlign: 'center', color: '#94a3b8', fontSize: 14 }}>
              Aucun événement à venir
            </div>
          )}
        </div>
      </div>

      {/* Recent Events Table */}
      <div className="card">
        <div style={{ padding: '20px 24px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9' }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a' }}>Événements récents</div>
            <div style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>Les derniers événements de votre portefeuille</div>
          </div>
          <button className="btn-primary" style={{ padding: '8px 16px', fontSize: 13 }} onClick={() => onNavigate('events')}>
            Voir Tout
          </button>
        </div>
        {recentEvents.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  {["Nom de l'événement", 'Date', 'Lieu', 'Catégorie', 'Capacité', 'Statut'].map((h) => (
                    <th key={h} style={{ padding: '12px 24px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentEvents.map((ev, i) => (
                  <tr key={ev.id} className="table-row" style={{ borderBottom: i < recentEvents.length - 1 ? '1px solid #f8fafc' : 'none', cursor: 'pointer' }}
                    onClick={() => onNavigate('event-details')}>
                    <td style={{ padding: '14px 24px' }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>{ev.name}</div>
                    </td>
                    <td style={{ padding: '14px 24px', fontSize: 13, color: '#64748b', whiteSpace: 'nowrap' }}>{ev.date}</td>
                    <td style={{ padding: '14px 24px', fontSize: 13, color: '#64748b', whiteSpace: 'nowrap' }}>{ev.location}</td>
                    <td style={{ padding: '14px 24px' }}>
                      <span className="badge badge-blue" style={{ fontSize: 11 }}>{ev.category || '—'}</span>
                    </td>
                    <td style={{ padding: '14px 24px' }}>
                      <div style={{ fontSize: 13, color: '#0f172a', fontWeight: 500 }}>{ev.registered || 0}/{ev.capacity || 0}</div>
                      <div style={{ height: 4, background: '#f1f5f9', borderRadius: 2, marginTop: 4, width: 80 }}>
                        <div style={{
                          height: 4, borderRadius: 2, background: '#365E8D',
                          width: `${ev.capacity ? (ev.registered || 0) / ev.capacity * 100 : 0}%`,
                        }} />
                      </div>
                    </td>
                    <td style={{ padding: '14px 24px' }}>{statusBadge(ev.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ padding: '48px', textAlign: 'center', color: '#94a3b8' }}>
            Aucun événement trouvé
          </div>
        )}
      </div>
    </div>
  )
}
