import { useState } from 'react'
import { StatCard, EmptyState, Tabs, Modal, ConfirmModal } from '../components/ui'

const ROOM_TYPES = ['Salle de conférence', 'Salle de réunion', 'Auditorium', 'Espace extérieur', 'Atelier']
const ROOM_STATUSES = ['Disponible', 'Réservée', 'Maintenance']
const EQUIPMENT_CATEGORIES = ['Audiovisuel', 'Mobilier', 'Informatique', 'Restauration', 'Signalétique']
const EQUIPMENT_STATUSES = ['Disponible', "En cours d'utilisation", 'Maintenance']

const statusColor = (s) => {
  if (s === 'Disponible') return <span className="badge badge-green">{s}</span>
  if (s === 'Réservée' || s === "En cours d'utilisation") return <span className="badge badge-blue">{s}</span>
  if (s === 'Maintenance') return <span className="badge badge-orange">{s}</span>
  return <span className="badge badge-gray">{s}</span>
}

const EMPTY_ROOM = { name: '', type: '', capacity: '', location: '', status: 'Disponible', event: '' }
const EMPTY_EQUIPMENT = { name: '', category: '', quantity: '', status: 'Disponible', event: '' }

export default function Logistics({ shared }) {
  const events = shared?.events || []
  const rooms = shared?.rooms || []
  const equipment = shared?.equipment || []
  const addRoom = shared?.addRoom || (() => {})
  const updateRoom = shared?.updateRoom || (() => {})
  const deleteRoom = shared?.deleteRoom || (() => {})
  const addEquipment = shared?.addEquipment || (() => {})
  const updateEquipment = shared?.updateEquipment || (() => {})
  const deleteEquipment = shared?.deleteEquipment || (() => {})

  const [tab, setTab] = useState('rooms')
  const [search, setSearch] = useState('')

  const [roomModal, setRoomModal] = useState(null) // null | 'new' | room object
  const [roomForm, setRoomForm] = useState(EMPTY_ROOM)
  const [roomErrors, setRoomErrors] = useState({})
  const [deleteRoomId, setDeleteRoomId] = useState(null)

  const [eqModal, setEqModal] = useState(null)
  const [eqForm, setEqForm] = useState(EMPTY_EQUIPMENT)
  const [eqErrors, setEqErrors] = useState({})
  const [deleteEqId, setDeleteEqId] = useState(null)

  const filteredRooms = rooms.filter(r =>
    (r.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (r.location || '').toLowerCase().includes(search.toLowerCase())
  )
  const filteredEquipment = equipment.filter(e =>
    (e.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (e.category || '').toLowerCase().includes(search.toLowerCase())
  )

  const openNewRoom = () => { setRoomForm(EMPTY_ROOM); setRoomErrors({}); setRoomModal('new') }
  const openEditRoom = (r) => { setRoomForm({ ...EMPTY_ROOM, ...r }); setRoomErrors({}); setRoomModal(r) }
  const saveRoom = () => {
    const errs = {}
    if (!roomForm.name.trim()) errs.name = 'Le nom de la salle est requis.'
    if (!roomForm.capacity || Number(roomForm.capacity) <= 0) errs.capacity = 'La capacité doit être positive.'
    setRoomErrors(errs)
    if (Object.keys(errs).length > 0) return
    const payload = { ...roomForm, capacity: Number(roomForm.capacity) }
    if (roomModal && roomModal !== 'new') updateRoom(roomModal.id, payload)
    else addRoom(payload)
    setRoomModal(null)
  }

  const openNewEquipment = () => { setEqForm(EMPTY_EQUIPMENT); setEqErrors({}); setEqModal('new') }
  const openEditEquipment = (e) => { setEqForm({ ...EMPTY_EQUIPMENT, ...e }); setEqErrors({}); setEqModal(e) }
  const saveEquipment = () => {
    const errs = {}
    if (!eqForm.name.trim()) errs.name = "Le nom de l'équipement est requis."
    if (!eqForm.quantity || Number(eqForm.quantity) <= 0) errs.quantity = 'La quantité doit être positive.'
    setEqErrors(errs)
    if (Object.keys(errs).length > 0) return
    const payload = { ...eqForm, quantity: Number(eqForm.quantity) }
    if (eqModal && eqModal !== 'new') updateEquipment(eqModal.id, payload)
    else addEquipment(payload)
    setEqModal(null)
  }

  const availableRooms = rooms.filter(r => r.status === 'Disponible').length
  const reservedRooms = rooms.filter(r => r.status === 'Réservée').length
  const availableEquipment = equipment.filter(e => e.status === 'Disponible').length
  const totalEquipmentUnits = equipment.reduce((a, e) => a + (Number(e.quantity) || 0), 0)

  return (
    <div>
      <div style={{ marginBottom: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>Logistique</h1>
          <p style={{ fontSize: 14, color: '#64748b' }}>Gérez les salles et le matériel affectés à vos événements</p>
        </div>
        <button className="btn-primary" onClick={tab === 'rooms' ? openNewRoom : openNewEquipment}>
          <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          {tab === 'rooms' ? 'Ajouter une salle' : 'Ajouter un équipement'}
        </button>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <StatCard label="Salles disponibles" value={availableRooms} color="#10b981" bg="#ecfdf5" />
        <StatCard label="Salles réservées" value={reservedRooms} color="#365E8D" bg="#eff6ff" />
        <StatCard label="Équipements disponibles" value={availableEquipment} color="#8b5cf6" bg="#f5f3ff" />
        <StatCard label="Unités de matériel" value={totalEquipmentUnits} color="#f59e0b" bg="#fffbeb" />
      </div>

      <Tabs tabs={[['rooms', 'Salles'], ['equipment', 'Matériel']]} active={tab} onChange={(t) => { setTab(t); setSearch('') }} />

      {/* Search */}
      <div className="card" style={{ padding: '14px 20px', marginBottom: 20 }}>
        <div style={{ position: 'relative', maxWidth: 400 }}>
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            className="form-input"
            placeholder={tab === 'rooms' ? 'Rechercher une salle...' : 'Rechercher un équipement...'}
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: 36 }}
          />
        </div>
      </div>

      {tab === 'rooms' ? (
        <div className="card">
          {rooms.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #f1f5f9', background: '#fafbfc' }}>
                    {['Salle', 'Type', 'Capacité', 'Lieu', 'Événement associé', 'Statut', 'Actions'].map(h => (
                      <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredRooms.map((r, i) => (
                    <tr key={r.id} className="table-row" style={{ borderBottom: i < filteredRooms.length - 1 ? '1px solid #f8fafc' : 'none' }}>
                      <td style={{ padding: '14px 20px', fontSize: 14, fontWeight: 600, color: '#0f172a' }}>{r.name}</td>
                      <td style={{ padding: '14px 20px', fontSize: 13, color: '#64748b' }}>{r.type || '—'}</td>
                      <td style={{ padding: '14px 20px', fontSize: 13, color: '#64748b' }}>{r.capacity || 0} pers.</td>
                      <td style={{ padding: '14px 20px', fontSize: 13, color: '#64748b' }}>{r.location || '—'}</td>
                      <td style={{ padding: '14px 20px', fontSize: 13, color: '#64748b' }}>{r.event || '—'}</td>
                      <td style={{ padding: '14px 20px' }}>{statusColor(r.status)}</td>
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ display: 'flex', gap: 4 }}>
                          <button onClick={() => openEditRoom(r)} className="btn-secondary" style={{ padding: '6px 10px', fontSize: 12 }}>Modifier</button>
                          <button onClick={() => setDeleteRoomId(r.id)} className="btn-secondary" style={{ padding: '6px 10px', fontSize: 12, color: '#dc2626' }}>Supprimer</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredRooms.length === 0 && (
                <div style={{ padding: '48px', textAlign: 'center', color: '#94a3b8' }}>Aucune salle ne correspond à votre recherche</div>
              )}
            </div>
          ) : (
            <EmptyState
              title="Aucune salle enregistrée"
              message="Ajoutez une salle pour commencer à organiser vos espaces."
              icon={<path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />}
            />
          )}
        </div>
      ) : (
        <div className="card">
          {equipment.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #f1f5f9', background: '#fafbfc' }}>
                    {['Équipement', 'Catégorie', 'Quantité', 'Événement associé', 'Statut', 'Actions'].map(h => (
                      <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredEquipment.map((e, i) => (
                    <tr key={e.id} className="table-row" style={{ borderBottom: i < filteredEquipment.length - 1 ? '1px solid #f8fafc' : 'none' }}>
                      <td style={{ padding: '14px 20px', fontSize: 14, fontWeight: 600, color: '#0f172a' }}>{e.name}</td>
                      <td style={{ padding: '14px 20px', fontSize: 13, color: '#64748b' }}>{e.category || '—'}</td>
                      <td style={{ padding: '14px 20px', fontSize: 13, color: '#64748b' }}>{e.quantity || 0}</td>
                      <td style={{ padding: '14px 20px', fontSize: 13, color: '#64748b' }}>{e.event || '—'}</td>
                      <td style={{ padding: '14px 20px' }}>{statusColor(e.status)}</td>
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ display: 'flex', gap: 4 }}>
                          <button onClick={() => openEditEquipment(e)} className="btn-secondary" style={{ padding: '6px 10px', fontSize: 12 }}>Modifier</button>
                          <button onClick={() => setDeleteEqId(e.id)} className="btn-secondary" style={{ padding: '6px 10px', fontSize: 12, color: '#dc2626' }}>Supprimer</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredEquipment.length === 0 && (
                <div style={{ padding: '48px', textAlign: 'center', color: '#94a3b8' }}>Aucun équipement ne correspond à votre recherche</div>
              )}
            </div>
          ) : (
            <EmptyState
              title="Aucun équipement enregistré"
              message="Ajoutez du matériel pour suivre vos ressources techniques."
              icon={<path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z" />}
            />
          )}
        </div>
      )}

      {/* Room modal */}
      {roomModal && (
        <Modal onClose={() => setRoomModal(null)}>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', marginBottom: 24 }}>{roomModal === 'new' ? 'Ajouter une salle' : 'Modifier la salle'}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label className="form-label">Nom de la salle <span style={{ color: '#ef4444' }}>*</span></label>
              <input className="form-input" placeholder="ex. Salle Aurora" value={roomForm.name} onChange={e => setRoomForm(f => ({ ...f, name: e.target.value }))} />
              {roomErrors.name && <div style={{ fontSize: 12, color: '#dc2626', marginTop: 4 }}>{roomErrors.name}</div>}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label className="form-label">Type</label>
                <select className="form-input" value={roomForm.type} onChange={e => setRoomForm(f => ({ ...f, type: e.target.value }))}>
                  <option value="">Sélectionnez</option>
                  {ROOM_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">Capacité <span style={{ color: '#ef4444' }}>*</span></label>
                <input className="form-input" type="number" placeholder="100" value={roomForm.capacity} onChange={e => setRoomForm(f => ({ ...f, capacity: e.target.value }))} />
                {roomErrors.capacity && <div style={{ fontSize: 12, color: '#dc2626', marginTop: 4 }}>{roomErrors.capacity}</div>}
              </div>
            </div>
            <div>
              <label className="form-label">Lieu / Bâtiment</label>
              <input className="form-input" placeholder="ex. Bâtiment A, 2e étage" value={roomForm.location} onChange={e => setRoomForm(f => ({ ...f, location: e.target.value }))} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label className="form-label">Statut</label>
                <select className="form-input" value={roomForm.status} onChange={e => setRoomForm(f => ({ ...f, status: e.target.value }))}>
                  {ROOM_STATUSES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">Événement associé</label>
                <select className="form-input" value={roomForm.event} onChange={e => setRoomForm(f => ({ ...f, event: e.target.value }))}>
                  <option value="">—</option>
                  {events.map(ev => <option key={ev.id} value={ev.name}>{ev.name}</option>)}
                </select>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
            <button className="btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={saveRoom}>Enregistrer</button>
            <button className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setRoomModal(null)}>Annuler</button>
          </div>
        </Modal>
      )}

      {/* Equipment modal */}
      {eqModal && (
        <Modal onClose={() => setEqModal(null)}>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', marginBottom: 24 }}>{eqModal === 'new' ? 'Ajouter un équipement' : "Modifier l'équipement"}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label className="form-label">Nom de l&apos;équipement <span style={{ color: '#ef4444' }}>*</span></label>
              <input className="form-input" placeholder="ex. Vidéoprojecteur" value={eqForm.name} onChange={e => setEqForm(f => ({ ...f, name: e.target.value }))} />
              {eqErrors.name && <div style={{ fontSize: 12, color: '#dc2626', marginTop: 4 }}>{eqErrors.name}</div>}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label className="form-label">Catégorie</label>
                <select className="form-input" value={eqForm.category} onChange={e => setEqForm(f => ({ ...f, category: e.target.value }))}>
                  <option value="">Sélectionnez</option>
                  {EQUIPMENT_CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">Quantité <span style={{ color: '#ef4444' }}>*</span></label>
                <input className="form-input" type="number" placeholder="10" value={eqForm.quantity} onChange={e => setEqForm(f => ({ ...f, quantity: e.target.value }))} />
                {eqErrors.quantity && <div style={{ fontSize: 12, color: '#dc2626', marginTop: 4 }}>{eqErrors.quantity}</div>}
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label className="form-label">Statut</label>
                <select className="form-input" value={eqForm.status} onChange={e => setEqForm(f => ({ ...f, status: e.target.value }))}>
                  {EQUIPMENT_STATUSES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">Événement associé</label>
                <select className="form-input" value={eqForm.event} onChange={e => setEqForm(f => ({ ...f, event: e.target.value }))}>
                  <option value="">—</option>
                  {events.map(ev => <option key={ev.id} value={ev.name}>{ev.name}</option>)}
                </select>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
            <button className="btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={saveEquipment}>Enregistrer</button>
            <button className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setEqModal(null)}>Annuler</button>
          </div>
        </Modal>
      )}

      {deleteRoomId && (
        <ConfirmModal
          title="Supprimer la salle"
          message="Êtes-vous sûr de vouloir supprimer cette salle ? Cette action est irréversible."
          onCancel={() => setDeleteRoomId(null)}
          onConfirm={() => { deleteRoom(deleteRoomId); setDeleteRoomId(null) }}
        />
      )}
      {deleteEqId && (
        <ConfirmModal
          title="Supprimer l'équipement"
          message="Êtes-vous sûr de vouloir supprimer cet équipement ? Cette action est irréversible."
          onCancel={() => setDeleteEqId(null)}
          onConfirm={() => { deleteEquipment(deleteEqId); setDeleteEqId(null) }}
        />
      )}
    </div>
  )
}
