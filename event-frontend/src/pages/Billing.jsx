import { useState } from 'react'
import { StatCard, EmptyState, Tabs, Modal, ConfirmModal } from '../components/ui'

const PAYMENT_METHODS = ['Carte bancaire', 'PayPal', 'Virement bancaire', 'Espèces']
const TX_STATUSES = ['Payé', 'En attente', 'Remboursé', 'Échoué']
const TICKET_STATUSES = ['Actif', 'Épuisé', 'Désactivé']

const txBadge = (s) => {
  if (s === 'Payé') return <span className="badge badge-green">{s}</span>
  if (s === 'En attente') return <span className="badge badge-orange">{s}</span>
  if (s === 'Remboursé') return <span className="badge badge-purple">{s}</span>
  if (s === 'Échoué') return <span className="badge badge-red">{s}</span>
  return <span className="badge badge-gray">{s}</span>
}
const ticketBadge = (s) => {
  if (s === 'Actif') return <span className="badge badge-green">{s}</span>
  if (s === 'Épuisé') return <span className="badge badge-orange">{s}</span>
  return <span className="badge badge-gray">{s}</span>
}

const fmtMoney = (n) => `${Number(n || 0).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} $`

const EMPTY_TICKET = { event: '', name: '', price: '', quantity: '', status: 'Actif' }
const EMPTY_TX = { participant: '', email: '', event: '', ticketType: '', amount: '', method: 'Carte bancaire', status: 'Payé' }

export default function Billing({ shared }) {
  const events = shared?.events || []
  const ticketTypes = shared?.ticketTypes || []
  const transactions = shared?.transactions || []
  const addTicketType = shared?.addTicketType || (() => {})
  const updateTicketType = shared?.updateTicketType || (() => {})
  const deleteTicketType = shared?.deleteTicketType || (() => {})
  const addTransaction = shared?.addTransaction || (() => {})
  const updateTransaction = shared?.updateTransaction || (() => {})

  const [tab, setTab] = useState('transactions')
  const [statusFilter, setStatusFilter] = useState('Tous')

  const [ticketModal, setTicketModal] = useState(null)
  const [ticketForm, setTicketForm] = useState(EMPTY_TICKET)
  const [ticketErrors, setTicketErrors] = useState({})
  const [deleteTicketId, setDeleteTicketId] = useState(null)

  const [txModal, setTxModal] = useState(false)
  const [txForm, setTxForm] = useState(EMPTY_TX)
  const [txErrors, setTxErrors] = useState({})

  const totalRevenue = transactions.filter(t => t.status === 'Payé').reduce((a, t) => a + (Number(t.amount) || 0), 0)
  const paidCount = transactions.filter(t => t.status === 'Payé').length
  const pendingCount = transactions.filter(t => t.status === 'En attente').length
  const refundedAmount = transactions.filter(t => t.status === 'Remboursé').reduce((a, t) => a + (Number(t.amount) || 0), 0)

  const filteredTx = transactions.filter(t => statusFilter === 'Tous' || t.status === statusFilter)

  const openNewTicket = () => { setTicketForm(EMPTY_TICKET); setTicketErrors({}); setTicketModal('new') }
  const openEditTicket = (t) => { setTicketForm({ ...EMPTY_TICKET, ...t }); setTicketErrors({}); setTicketModal(t) }
  const saveTicket = () => {
    const errs = {}
    if (!ticketForm.event) errs.event = "L'événement est requis."
    if (!ticketForm.name.trim()) errs.name = 'Le nom du billet est requis.'
    if (ticketForm.price === '' || Number(ticketForm.price) < 0) errs.price = 'Le prix doit être positif ou nul.'
    if (!ticketForm.quantity || Number(ticketForm.quantity) <= 0) errs.quantity = 'La quantité doit être positive.'
    setTicketErrors(errs)
    if (Object.keys(errs).length > 0) return
    const payload = { ...ticketForm, price: Number(ticketForm.price), quantity: Number(ticketForm.quantity), sold: ticketForm.sold || 0 }
    if (ticketModal && ticketModal !== 'new') updateTicketType(ticketModal.id, payload)
    else addTicketType(payload)
    setTicketModal(null)
  }

  const openNewTx = () => { setTxForm(EMPTY_TX); setTxErrors({}); setTxModal(true) }
  const saveTx = () => {
    const errs = {}
    if (!txForm.participant.trim()) errs.participant = 'Le nom est requis.'
    if (!txForm.email.trim()) errs.email = "L'e-mail est requis."
    if (!txForm.event) errs.event = "L'événement est requis."
    if (txForm.amount === '' || Number(txForm.amount) < 0) errs.amount = 'Le montant doit être positif ou nul.'
    setTxErrors(errs)
    if (Object.keys(errs).length > 0) return
    addTransaction({
      ...txForm,
      amount: Number(txForm.amount),
      date: new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'short', day: 'numeric' }),
    })
    setTxModal(false)
  }

  return (
    <div>
      <div style={{ marginBottom: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>Billetterie & Paiements</h1>
          <p style={{ fontSize: 14, color: '#64748b' }}>Suivez les ventes de billets et les transactions de vos événements payants</p>
        </div>
        <button className="btn-primary" onClick={tab === 'transactions' ? openNewTx : openNewTicket}>
          <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          {tab === 'transactions' ? 'Ajouter une transaction' : 'Ajouter un type de billet'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <StatCard label="Revenus encaissés" value={fmtMoney(totalRevenue)} color="#10b981" bg="#ecfdf5" />
        <StatCard label="Transactions payées" value={paidCount} color="#365E8D" bg="#eff6ff" />
        <StatCard label="En attente de paiement" value={pendingCount} color="#f59e0b" bg="#fffbeb" />
        <StatCard label="Montant remboursé" value={fmtMoney(refundedAmount)} color="#7c3aed" bg="#f5f3ff" />
      </div>

      <Tabs tabs={[['transactions', 'Transactions'], ['tickets', 'Types de billets']]} active={tab} onChange={setTab} />

      {tab === 'transactions' ? (
        <>
          <div className="card" style={{ padding: '14px 20px', marginBottom: 20 }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>Statut :</span>
              <select className="form-input" style={{ width: 180 }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                <option>Tous</option>
                {TX_STATUSES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="card">
            {transactions.length > 0 ? (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #f1f5f9', background: '#fafbfc' }}>
                      {['Participant', 'Événement', 'Billet', 'Montant', 'Méthode', 'Date', 'Statut', 'Actions'].map(h => (
                        <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTx.map((t, i) => (
                      <tr key={t.id} className="table-row" style={{ borderBottom: i < filteredTx.length - 1 ? '1px solid #f8fafc' : 'none' }}>
                        <td style={{ padding: '12px 20px' }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{t.participant}</div>
                          <div style={{ fontSize: 12, color: '#94a3b8' }}>{t.email}</div>
                        </td>
                        <td style={{ padding: '12px 20px', fontSize: 13, color: '#64748b' }}>{t.event || '—'}</td>
                        <td style={{ padding: '12px 20px', fontSize: 13, color: '#64748b' }}>{t.ticketType || '—'}</td>
                        <td style={{ padding: '12px 20px', fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{fmtMoney(t.amount)}</td>
                        <td style={{ padding: '12px 20px', fontSize: 13, color: '#64748b' }}>{t.method}</td>
                        <td style={{ padding: '12px 20px', fontSize: 13, color: '#64748b', whiteSpace: 'nowrap' }}>{t.date}</td>
                        <td style={{ padding: '12px 20px' }}>{txBadge(t.status)}</td>
                        <td style={{ padding: '12px 20px' }}>
                          <select
                            className="form-input"
                            style={{ width: 130, padding: '4px 8px', fontSize: 12 }}
                            value={t.status}
                            onChange={e => updateTransaction(t.id, { status: e.target.value })}
                          >
                            {TX_STATUSES.map(s => <option key={s}>{s}</option>)}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredTx.length === 0 && (
                  <div style={{ padding: '48px', textAlign: 'center', color: '#94a3b8' }}>Aucune transaction ne correspond à ce filtre</div>
                )}
              </div>
            ) : (
              <EmptyState
                title="Aucune transaction enregistrée"
                message="Les paiements liés à vos événements payants apparaîtront ici."
                icon={<path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />}
              />
            )}
          </div>
        </>
      ) : (
        <div className="card">
          {ticketTypes.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #f1f5f9', background: '#fafbfc' }}>
                    {['Type de billet', 'Événement', 'Prix', 'Vendus', 'Disponibilité', 'Statut', 'Actions'].map(h => (
                      <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ticketTypes.map((t, i) => (
                    <tr key={t.id} className="table-row" style={{ borderBottom: i < ticketTypes.length - 1 ? '1px solid #f8fafc' : 'none' }}>
                      <td style={{ padding: '14px 20px', fontSize: 14, fontWeight: 600, color: '#0f172a' }}>{t.name}</td>
                      <td style={{ padding: '14px 20px', fontSize: 13, color: '#64748b' }}>{t.event || '—'}</td>
                      <td style={{ padding: '14px 20px', fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{Number(t.price) === 0 ? 'Gratuit' : fmtMoney(t.price)}</td>
                      <td style={{ padding: '14px 20px', fontSize: 13, color: '#64748b' }}>{t.sold || 0}/{t.quantity || 0}</td>
                      <td style={{ padding: '14px 20px', width: 120 }}>
                        <div style={{ height: 4, background: '#f1f5f9', borderRadius: 2 }}>
                          <div style={{ height: 4, borderRadius: 2, background: '#365E8D', width: `${t.quantity ? Math.min(100, (t.sold || 0) / t.quantity * 100) : 0}%` }} />
                        </div>
                      </td>
                      <td style={{ padding: '14px 20px' }}>{ticketBadge(t.status)}</td>
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ display: 'flex', gap: 4 }}>
                          <button onClick={() => openEditTicket(t)} className="btn-secondary" style={{ padding: '6px 10px', fontSize: 12 }}>Modifier</button>
                          <button onClick={() => setDeleteTicketId(t.id)} className="btn-secondary" style={{ padding: '6px 10px', fontSize: 12, color: '#dc2626' }}>Supprimer</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              title="Aucun type de billet configuré"
              message="Créez des billets (gratuits ou payants) pour vos événements."
              icon={<path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />}
            />
          )}
        </div>
      )}

      {/* Ticket type modal */}
      {ticketModal && (
        <Modal onClose={() => setTicketModal(null)}>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', marginBottom: 24 }}>{ticketModal === 'new' ? 'Nouveau type de billet' : 'Modifier le type de billet'}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label className="form-label">Événement <span style={{ color: '#ef4444' }}>*</span></label>
              <select className="form-input" value={ticketForm.event} onChange={e => setTicketForm(f => ({ ...f, event: e.target.value }))}>
                <option value="">Sélectionnez un événement</option>
                {events.map(ev => <option key={ev.id} value={ev.name}>{ev.name}</option>)}
              </select>
              {ticketErrors.event && <div style={{ fontSize: 12, color: '#dc2626', marginTop: 4 }}>{ticketErrors.event}</div>}
            </div>
            <div>
              <label className="form-label">Nom du billet <span style={{ color: '#ef4444' }}>*</span></label>
              <input className="form-input" placeholder="ex. Billet Standard, VIP, Early Bird..." value={ticketForm.name} onChange={e => setTicketForm(f => ({ ...f, name: e.target.value }))} />
              {ticketErrors.name && <div style={{ fontSize: 12, color: '#dc2626', marginTop: 4 }}>{ticketErrors.name}</div>}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label className="form-label">Prix (USD) <span style={{ color: '#ef4444' }}>*</span></label>
                <input className="form-input" type="number" placeholder="0,00 (gratuit)" value={ticketForm.price} onChange={e => setTicketForm(f => ({ ...f, price: e.target.value }))} />
                {ticketErrors.price && <div style={{ fontSize: 12, color: '#dc2626', marginTop: 4 }}>{ticketErrors.price}</div>}
              </div>
              <div>
                <label className="form-label">Quantité disponible <span style={{ color: '#ef4444' }}>*</span></label>
                <input className="form-input" type="number" placeholder="100" value={ticketForm.quantity} onChange={e => setTicketForm(f => ({ ...f, quantity: e.target.value }))} />
                {ticketErrors.quantity && <div style={{ fontSize: 12, color: '#dc2626', marginTop: 4 }}>{ticketErrors.quantity}</div>}
              </div>
            </div>
            <div>
              <label className="form-label">Statut</label>
              <select className="form-input" value={ticketForm.status} onChange={e => setTicketForm(f => ({ ...f, status: e.target.value }))}>
                {TICKET_STATUSES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
            <button className="btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={saveTicket}>Enregistrer</button>
            <button className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setTicketModal(null)}>Annuler</button>
          </div>
        </Modal>
      )}

      {/* Transaction modal */}
      {txModal && (
        <Modal onClose={() => setTxModal(false)}>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', marginBottom: 24 }}>Ajouter une transaction</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label className="form-label">Nom du participant <span style={{ color: '#ef4444' }}>*</span></label>
                <input className="form-input" placeholder="ex. Marie Dupont" value={txForm.participant} onChange={e => setTxForm(f => ({ ...f, participant: e.target.value }))} />
                {txErrors.participant && <div style={{ fontSize: 12, color: '#dc2626', marginTop: 4 }}>{txErrors.participant}</div>}
              </div>
              <div>
                <label className="form-label">E-mail <span style={{ color: '#ef4444' }}>*</span></label>
                <input className="form-input" type="email" placeholder="marie@exemple.com" value={txForm.email} onChange={e => setTxForm(f => ({ ...f, email: e.target.value }))} />
                {txErrors.email && <div style={{ fontSize: 12, color: '#dc2626', marginTop: 4 }}>{txErrors.email}</div>}
              </div>
            </div>
            <div>
              <label className="form-label">Événement <span style={{ color: '#ef4444' }}>*</span></label>
              <select className="form-input" value={txForm.event} onChange={e => setTxForm(f => ({ ...f, event: e.target.value }))}>
                <option value="">Sélectionnez un événement</option>
                {events.map(ev => <option key={ev.id} value={ev.name}>{ev.name}</option>)}
              </select>
              {txErrors.event && <div style={{ fontSize: 12, color: '#dc2626', marginTop: 4 }}>{txErrors.event}</div>}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label className="form-label">Type de billet</label>
                <select className="form-input" value={txForm.ticketType} onChange={e => setTxForm(f => ({ ...f, ticketType: e.target.value }))}>
                  <option value="">—</option>
                  {ticketTypes.filter(t => !txForm.event || t.event === txForm.event).map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">Montant (USD) <span style={{ color: '#ef4444' }}>*</span></label>
                <input className="form-input" type="number" placeholder="0,00" value={txForm.amount} onChange={e => setTxForm(f => ({ ...f, amount: e.target.value }))} />
                {txErrors.amount && <div style={{ fontSize: 12, color: '#dc2626', marginTop: 4 }}>{txErrors.amount}</div>}
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label className="form-label">Méthode de paiement</label>
                <select className="form-input" value={txForm.method} onChange={e => setTxForm(f => ({ ...f, method: e.target.value }))}>
                  {PAYMENT_METHODS.map(m => <option key={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">Statut</label>
                <select className="form-input" value={txForm.status} onChange={e => setTxForm(f => ({ ...f, status: e.target.value }))}>
                  {TX_STATUSES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
            <button className="btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={saveTx}>Enregistrer</button>
            <button className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setTxModal(false)}>Annuler</button>
          </div>
        </Modal>
      )}

      {deleteTicketId && (
        <ConfirmModal
          title="Supprimer ce type de billet"
          message="Êtes-vous sûr de vouloir supprimer ce type de billet ? Cette action est irréversible."
          onCancel={() => setDeleteTicketId(null)}
          onConfirm={() => { deleteTicketType(deleteTicketId); setDeleteTicketId(null) }}
        />
      )}
    </div>
  )
}
