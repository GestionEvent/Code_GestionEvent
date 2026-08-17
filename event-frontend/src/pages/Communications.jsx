import { useState } from 'react'
import { StatCard, EmptyState, Tabs, Modal, ConfirmModal, Toggle } from '../components/ui'

const TRIGGERS = [
  'Inscription',
  'Rappel (24h avant)',
  'Annulation',
  'Nouvel intervenant',
  'Alerte de capacité',
  'Personnalisé',
]

const LOG_STATUSES = ['Envoyé', 'En attente', 'Échec']

const logBadge = (s) => {
  if (s === 'Envoyé') return <span className="badge badge-green">{s}</span>
  if (s === 'En attente') return <span className="badge badge-orange">{s}</span>
  if (s === 'Échec') return <span className="badge badge-red">{s}</span>
  return <span className="badge badge-gray">{s}</span>
}

const EMPTY_TEMPLATE = { name: '', trigger: '', subject: '', body: '', active: true }

export default function Communications({ shared }) {
  const events = shared?.events || []
  const participants = shared?.participants || []
  const templates = shared?.emailTemplates || []
  const logs = shared?.emailLogs || []
  const addTemplate = shared?.addEmailTemplate || (() => {})
  const updateTemplate = shared?.updateEmailTemplate || (() => {})
  const deleteTemplate = shared?.deleteEmailTemplate || (() => {})
  const sendSimulatedEmail = shared?.sendSimulatedEmail || (() => {})

  const [tab, setTab] = useState('templates')
  const [modal, setModal] = useState(null) // null | 'new' | template
  const [form, setForm] = useState(EMPTY_TEMPLATE)
  const [errors, setErrors] = useState({})
  const [deleteId, setDeleteId] = useState(null)
  const [testModal, setTestModal] = useState(null) // template being tested
  const [testTarget, setTestTarget] = useState({ to: '', event: '' })

  const openNew = () => { setForm(EMPTY_TEMPLATE); setErrors({}); setModal('new') }
  const openEdit = (t) => { setForm({ ...EMPTY_TEMPLATE, ...t }); setErrors({}); setModal(t) }

  const save = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Le nom du modèle est requis.'
    if (!form.subject.trim()) errs.subject = "L'objet est requis."
    if (!form.body.trim()) errs.body = 'Le contenu du message est requis.'
    setErrors(errs)
    if (Object.keys(errs).length > 0) return
    if (modal && modal !== 'new') updateTemplate(modal.id, form)
    else addTemplate(form)
    setModal(null)
  }

  const openTest = (t) => {
    setTestTarget({ to: participants[0]?.email || '', event: events[0]?.name || '' })
    setTestModal(t)
  }
  const confirmTest = () => {
    sendSimulatedEmail({
      to: testTarget.to || 'test@exemple.com',
      subject: testModal.subject,
      template: testModal.name,
      event: testTarget.event || '—',
    })
    setTestModal(null)
  }

  const activeCount = templates.filter(t => t.active).length
  const sentCount = logs.filter(l => l.status === 'Envoyé').length
  const failedCount = logs.filter(l => l.status === 'Échec').length

  return (
    <div>
      <div style={{ marginBottom: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>Communication</h1>
          <p style={{ fontSize: 14, color: '#64748b' }}>Automatisez les e-mails envoyés à vos participants et intervenants</p>
        </div>
        {tab === 'templates' && (
          <button className="btn-primary" onClick={openNew}>
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Nouveau modèle
          </button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <StatCard label="Modèles actifs" value={activeCount} color="#365E8D" bg="#eff6ff" />
        <StatCard label="Modèles au total" value={templates.length} color="#8b5cf6" bg="#f5f3ff" />
        <StatCard label="E-mails envoyés" value={sentCount} color="#10b981" bg="#ecfdf5" />
        <StatCard label="Échecs d'envoi" value={failedCount} color="#ef4444" bg="#fef2f2" />
      </div>

      <Tabs tabs={[['templates', 'Modèles'], ['history', 'Historique']]} active={tab} onChange={setTab} />

      {tab === 'templates' ? (
        templates.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {templates.map(t => (
              <div key={t.id} className="card" style={{ padding: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 42, height: 42, borderRadius: 10, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="19" height="19" fill="none" viewBox="0 0 24 24" stroke="#365E8D" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{t.name}</div>
                    <span className="badge badge-blue">{t.trigger || 'Personnalisé'}</span>
                    {!t.active && <span className="badge badge-gray">Inactif</span>}
                  </div>
                  <div style={{ fontSize: 13, color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.subject}</div>
                </div>
                <Toggle val={t.active} onToggle={() => updateTemplate(t.id, { active: !t.active })} />
                <div style={{ display: 'flex', gap: 6 }}>
                  <button className="btn-secondary" style={{ padding: '6px 10px', fontSize: 12 }} onClick={() => openTest(t)}>Envoyer un test</button>
                  <button className="btn-secondary" style={{ padding: '6px 10px', fontSize: 12 }} onClick={() => openEdit(t)}>Modifier</button>
                  <button className="btn-secondary" style={{ padding: '6px 10px', fontSize: 12, color: '#dc2626' }} onClick={() => setDeleteId(t.id)}>Supprimer</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="Aucun modèle d'e-mail"
            message="Créez un modèle pour automatiser vos communications."
            icon={<path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />}
          />
        )
      ) : (
        <div className="card">
          {logs.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #f1f5f9', background: '#fafbfc' }}>
                    {['Destinataire', 'Modèle', 'Objet', 'Événement', 'Envoyé le', 'Statut'].map(h => (
                      <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {logs.map((l, i) => (
                    <tr key={l.id} className="table-row" style={{ borderBottom: i < logs.length - 1 ? '1px solid #f8fafc' : 'none' }}>
                      <td style={{ padding: '12px 20px', fontSize: 13, color: '#0f172a', fontWeight: 500 }}>{l.to}</td>
                      <td style={{ padding: '12px 20px', fontSize: 13, color: '#64748b' }}>{l.template}</td>
                      <td style={{ padding: '12px 20px', fontSize: 13, color: '#64748b' }}>{l.subject}</td>
                      <td style={{ padding: '12px 20px', fontSize: 13, color: '#64748b' }}>{l.event || '—'}</td>
                      <td style={{ padding: '12px 20px', fontSize: 13, color: '#64748b', whiteSpace: 'nowrap' }}>{l.sentAt}</td>
                      <td style={{ padding: '12px 20px' }}>{logBadge(l.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              title="Aucun e-mail envoyé pour le moment"
              message="L'historique des envois automatiques et des tests apparaîtra ici."
              icon={<path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />}
            />
          )}
        </div>
      )}

      {/* Template modal */}
      {modal && (
        <Modal onClose={() => setModal(null)} maxWidth={560}>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', marginBottom: 24 }}>{modal === 'new' ? 'Nouveau modèle' : 'Modifier le modèle'}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label className="form-label">Nom du modèle <span style={{ color: '#ef4444' }}>*</span></label>
                <input className="form-input" placeholder="ex. Confirmation d'inscription" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                {errors.name && <div style={{ fontSize: 12, color: '#dc2626', marginTop: 4 }}>{errors.name}</div>}
              </div>
              <div>
                <label className="form-label">Déclencheur</label>
                <select className="form-input" value={form.trigger} onChange={e => setForm(f => ({ ...f, trigger: e.target.value }))}>
                  <option value="">Sélectionnez</option>
                  {TRIGGERS.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="form-label">Objet de l&apos;e-mail <span style={{ color: '#ef4444' }}>*</span></label>
              <input className="form-input" placeholder="ex. Votre inscription est confirmée" value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} />
              {errors.subject && <div style={{ fontSize: 12, color: '#dc2626', marginTop: 4 }}>{errors.subject}</div>}
            </div>
            <div>
              <label className="form-label">Contenu <span style={{ color: '#ef4444' }}>*</span></label>
              <textarea
                className="form-input"
                placeholder="Utilisez {{prenom}}, {{evenement}}, {{lieu}}, {{billet}} pour personnaliser le message."
                value={form.body}
                onChange={e => setForm(f => ({ ...f, body: e.target.value }))}
                rows={6}
                style={{ resize: 'vertical', lineHeight: 1.6 }}
              />
              {errors.body && <div style={{ fontSize: 12, color: '#dc2626', marginTop: 4 }}>{errors.body}</div>}
              <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 6 }}>Variables disponibles : <code>{'{{prenom}}'}</code>, <code>{'{{evenement}}'}</code>, <code>{'{{lieu}}'}</code>, <code>{'{{billet}}'}</code></div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#f8fafc', borderRadius: 8 }}>
              <span style={{ fontSize: 13, color: '#374151', fontWeight: 500 }}>Modèle actif</span>
              <Toggle val={form.active} onToggle={() => setForm(f => ({ ...f, active: !f.active }))} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
            <button className="btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={save}>Enregistrer</button>
            <button className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setModal(null)}>Annuler</button>
          </div>
        </Modal>
      )}

      {/* Test send modal */}
      {testModal && (
        <Modal onClose={() => setTestModal(null)} maxWidth={420}>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>Envoyer un e-mail de test</div>
          <div style={{ fontSize: 13, color: '#64748b', marginBottom: 20 }}>Modèle : <strong>{testModal.name}</strong></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label className="form-label">Destinataire</label>
              <input className="form-input" type="email" placeholder="test@exemple.com" value={testTarget.to} onChange={e => setTestTarget(t => ({ ...t, to: e.target.value }))} />
            </div>
            <div>
              <label className="form-label">Événement (pour les variables)</label>
              <select className="form-input" value={testTarget.event} onChange={e => setTestTarget(t => ({ ...t, event: e.target.value }))}>
                <option value="">—</option>
                {events.map(ev => <option key={ev.id} value={ev.name}>{ev.name}</option>)}
              </select>
            </div>
          </div>
          <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 12, lineHeight: 1.6 }}>
            Cet environnement simule l&apos;envoi : aucun e-mail réel n&apos;est transmis, l&apos;entrée sera simplement ajoutée à l&apos;historique.
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
            <button className="btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={confirmTest}>Envoyer</button>
            <button className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setTestModal(null)}>Annuler</button>
          </div>
        </Modal>
      )}

      {deleteId && (
        <ConfirmModal
          title="Supprimer le modèle"
          message="Êtes-vous sûr de vouloir supprimer ce modèle d'e-mail ? Cette action est irréversible."
          onCancel={() => setDeleteId(null)}
          onConfirm={() => { deleteTemplate(deleteId); setDeleteId(null) }}
        />
      )}
    </div>
  )
}
