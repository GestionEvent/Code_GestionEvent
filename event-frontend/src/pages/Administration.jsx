import { useState } from 'react'
import { StatCard, EmptyState, Tabs, Modal, ConfirmModal, Toggle } from '../components/ui'
import { PERMISSION_MODULES } from '../store'

const ALL_ACTIONS = ['Lire', 'Créer', 'Modifier', 'Supprimer']

const EMPTY_USER = { name: '', email: '', role: '', status: 'Actif' }
const EMPTY_ROLE = { name: '', description: '', permissions: Object.fromEntries(PERMISSION_MODULES.map(m => [m, []])) }

export default function Administration({ shared }) {
  const users = shared?.users || []
  const roles = shared?.roles || []
  const addUser = shared?.addUser || (() => {})
  const updateUser = shared?.updateUser || (() => {})
  const deleteUser = shared?.deleteUser || (() => {})
  const addRole = shared?.addRole || (() => {})
  const updateRole = shared?.updateRole || (() => {})
  const deleteRole = shared?.deleteRole || (() => {})

  const [tab, setTab] = useState('users')

  const [userModal, setUserModal] = useState(null)
  const [userForm, setUserForm] = useState(EMPTY_USER)
  const [userErrors, setUserErrors] = useState({})
  const [deleteUserId, setDeleteUserId] = useState(null)

  const [roleModal, setRoleModal] = useState(null)
  const [roleForm, setRoleForm] = useState(EMPTY_ROLE)
  const [roleErrors, setRoleErrors] = useState({})
  const [deleteRoleId, setDeleteRoleId] = useState(null)

  const activeUsers = users.filter(u => u.status === 'Actif').length
  const adminCount = users.filter(u => u.role === 'Administrateur').length

  const openNewUser = () => { setUserForm(EMPTY_USER); setUserErrors({}); setUserModal('new') }
  const openEditUser = (u) => { setUserForm({ ...EMPTY_USER, ...u }); setUserErrors({}); setUserModal(u) }
  const saveUser = () => {
    const errs = {}
    if (!userForm.name.trim()) errs.name = 'Le nom est requis.'
    if (!userForm.email.trim()) errs.email = "L'e-mail est requis."
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userForm.email.trim())) errs.email = 'Adresse e-mail invalide.'
    if (!userForm.role) errs.role = 'Un rôle doit être attribué.'
    setUserErrors(errs)
    if (Object.keys(errs).length > 0) return
    if (userModal && userModal !== 'new') updateUser(userModal.id, userForm)
    else addUser(userForm)
    setUserModal(null)
  }

  const openNewRole = () => { setRoleForm(EMPTY_ROLE); setRoleErrors({}); setRoleModal('new') }
  const openEditRole = (r) => {
    setRoleForm({
      ...EMPTY_ROLE,
      ...r,
      permissions: { ...Object.fromEntries(PERMISSION_MODULES.map(m => [m, []])), ...r.permissions },
    })
    setRoleErrors({})
    setRoleModal(r)
  }
  const togglePermission = (mod, action) => {
    setRoleForm(f => {
      const current = f.permissions[mod] || []
      const next = current.includes(action) ? current.filter(a => a !== action) : [...current, action]
      return { ...f, permissions: { ...f.permissions, [mod]: next } }
    })
  }
  const saveRole = () => {
    const errs = {}
    if (!roleForm.name.trim()) errs.name = 'Le nom du rôle est requis.'
    setRoleErrors(errs)
    if (Object.keys(errs).length > 0) return
    if (roleModal && roleModal !== 'new') updateRole(roleModal.id, roleForm)
    else addRole(roleForm)
    setRoleModal(null)
  }

  return (
    <div>
      <div style={{ marginBottom: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>Administration</h1>
          <p style={{ fontSize: 14, color: '#64748b' }}>Gérez les utilisateurs, leurs rôles et leurs droits d&apos;accès</p>
        </div>
        <button className="btn-primary" onClick={tab === 'users' ? openNewUser : openNewRole}>
          <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          {tab === 'users' ? 'Inviter un utilisateur' : 'Créer un rôle'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <StatCard label="Utilisateurs" value={users.length} color="#365E8D" bg="#eff6ff" />
        <StatCard label="Utilisateurs actifs" value={activeUsers} color="#10b981" bg="#ecfdf5" />
        <StatCard label="Administrateurs" value={adminCount} color="#7c3aed" bg="#f5f3ff" />
        <StatCard label="Rôles définis" value={roles.length} color="#f59e0b" bg="#fffbeb" />
      </div>

      <Tabs tabs={[['users', 'Utilisateurs'], ['roles', 'Rôles & permissions']]} active={tab} onChange={setTab} />

      {tab === 'users' ? (
        <div className="card">
          {users.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #f1f5f9', background: '#fafbfc' }}>
                    {['Utilisateur', 'Rôle', 'Statut', 'Dernière connexion', 'Actions'].map(h => (
                      <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, i) => (
                    <tr key={u.id} className="table-row" style={{ borderBottom: i < users.length - 1 ? '1px solid #f8fafc' : 'none' }}>
                      <td style={{ padding: '12px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{
                            width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
                            background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 13, fontWeight: 700, color: '#365E8D',
                          }}>
                            {(u.name || '?').split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </div>
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{u.name}</div>
                            <div style={{ fontSize: 12, color: '#94a3b8' }}>{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '12px 20px' }}>
                        <select
                          className="form-input"
                          style={{ width: 170, padding: '5px 10px', fontSize: 12 }}
                          value={u.role}
                          onChange={e => updateUser(u.id, { role: e.target.value })}
                        >
                          {roles.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
                        </select>
                      </td>
                      <td style={{ padding: '12px 20px' }}>
                        <span className={`badge ${u.status === 'Actif' ? 'badge-green' : 'badge-gray'}`}>{u.status}</span>
                      </td>
                      <td style={{ padding: '12px 20px', fontSize: 13, color: '#64748b', whiteSpace: 'nowrap' }}>{u.lastLogin || 'Jamais connecté'}</td>
                      <td style={{ padding: '12px 20px' }}>
                        <div style={{ display: 'flex', gap: 4 }}>
                          <button className="btn-secondary" style={{ padding: '6px 10px', fontSize: 12 }} onClick={() => updateUser(u.id, { status: u.status === 'Actif' ? 'Inactif' : 'Actif' })}>
                            {u.status === 'Actif' ? 'Désactiver' : 'Activer'}
                          </button>
                          <button className="btn-secondary" style={{ padding: '6px 10px', fontSize: 12 }} onClick={() => openEditUser(u)}>Modifier</button>
                          <button className="btn-secondary" style={{ padding: '6px 10px', fontSize: 12, color: '#dc2626' }} onClick={() => setDeleteUserId(u.id)}>Supprimer</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              title="Aucun utilisateur"
              message="Invitez des membres de votre équipe et attribuez-leur un rôle."
              icon={<path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />}
            />
          )}
        </div>
      ) : (
        <div>
          {roles.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
              {roles.map(r => {
                const totalPerms = Object.values(r.permissions || {}).reduce((a, arr) => a + arr.length, 0)
                return (
                  <div key={r.id} className="card" style={{ padding: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>{r.name}</div>
                          {r.system && <span className="badge badge-blue">Système</span>}
                        </div>
                        <div style={{ fontSize: 13, color: '#64748b', marginTop: 4, lineHeight: 1.5 }}>{r.description || 'Aucune description.'}</div>
                      </div>
                    </div>
                    <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 14 }}>{totalPerms} permission{totalPerms > 1 ? 's' : ''} accordée{totalPerms > 1 ? 's' : ''} sur {PERMISSION_MODULES.length} modules</div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: 12 }} onClick={() => openEditRole(r)}>Modifier les permissions</button>
                      {!r.system && (
                        <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: 12, color: '#dc2626' }} onClick={() => setDeleteRoleId(r.id)}>Supprimer</button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <EmptyState
              title="Aucun rôle défini"
              message="Créez des rôles pour contrôler précisément les droits d'accès."
              icon={<path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />}
            />
          )}
        </div>
      )}

      {/* User modal */}
      {userModal && (
        <Modal onClose={() => setUserModal(null)}>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', marginBottom: 24 }}>{userModal === 'new' ? 'Inviter un utilisateur' : "Modifier l'utilisateur"}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label className="form-label">Nom complet <span style={{ color: '#ef4444' }}>*</span></label>
              <input className="form-input" placeholder="ex. Camille Martin" value={userForm.name} onChange={e => setUserForm(f => ({ ...f, name: e.target.value }))} />
              {userErrors.name && <div style={{ fontSize: 12, color: '#dc2626', marginTop: 4 }}>{userErrors.name}</div>}
            </div>
            <div>
              <label className="form-label">Adresse e-mail <span style={{ color: '#ef4444' }}>*</span></label>
              <input className="form-input" type="email" placeholder="camille@entreprise.com" value={userForm.email} onChange={e => setUserForm(f => ({ ...f, email: e.target.value }))} />
              {userErrors.email && <div style={{ fontSize: 12, color: '#dc2626', marginTop: 4 }}>{userErrors.email}</div>}
            </div>
            <div>
              <label className="form-label">Rôle <span style={{ color: '#ef4444' }}>*</span></label>
              <select className="form-input" value={userForm.role} onChange={e => setUserForm(f => ({ ...f, role: e.target.value }))}>
                <option value="">Sélectionnez un rôle</option>
                {roles.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
              </select>
              {userErrors.role && <div style={{ fontSize: 12, color: '#dc2626', marginTop: 4 }}>{userErrors.role}</div>}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#f8fafc', borderRadius: 8 }}>
              <span style={{ fontSize: 13, color: '#374151', fontWeight: 500 }}>Compte actif</span>
              <Toggle val={userForm.status === 'Actif'} onToggle={() => setUserForm(f => ({ ...f, status: f.status === 'Actif' ? 'Inactif' : 'Actif' }))} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
            <button className="btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={saveUser}>{userModal === 'new' ? 'Envoyer l\u2019invitation' : 'Enregistrer'}</button>
            <button className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setUserModal(null)}>Annuler</button>
          </div>
        </Modal>
      )}

      {/* Role modal with permission matrix */}
      {roleModal && (
        <Modal onClose={() => setRoleModal(null)} maxWidth={640}>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', marginBottom: 24 }}>{roleModal === 'new' ? 'Créer un rôle' : `Permissions — ${roleForm.name || ''}`}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label className="form-label">Nom du rôle <span style={{ color: '#ef4444' }}>*</span></label>
                <input
                  className="form-input"
                  placeholder="ex. Coordinateur logistique"
                  value={roleForm.name}
                  onChange={e => setRoleForm(f => ({ ...f, name: e.target.value }))}
                  disabled={!!roleModal.system}
                />
                {roleErrors.name && <div style={{ fontSize: 12, color: '#dc2626', marginTop: 4 }}>{roleErrors.name}</div>}
              </div>
              <div>
                <label className="form-label">Description</label>
                <input className="form-input" placeholder="Décrivez ce rôle en une phrase" value={roleForm.description} onChange={e => setRoleForm(f => ({ ...f, description: e.target.value }))} />
              </div>
            </div>
          </div>

          <div style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 10 }}>Matrice des permissions</div>
          <div style={{ overflowX: 'auto', border: '1px solid #f1f5f9', borderRadius: 10 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#94a3b8' }}>Module</th>
                  {ALL_ACTIONS.map(a => (
                    <th key={a} style={{ padding: '10px 14px', textAlign: 'center', fontSize: 12, fontWeight: 600, color: '#94a3b8' }}>{a}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PERMISSION_MODULES.map((mod, i) => (
                  <tr key={mod} style={{ borderTop: i > 0 ? '1px solid #f8fafc' : 'none' }}>
                    <td style={{ padding: '10px 14px', fontSize: 13, fontWeight: 500, color: '#0f172a' }}>{mod}</td>
                    {ALL_ACTIONS.map(action => (
                      <td key={action} style={{ padding: '10px 14px', textAlign: 'center' }}>
                        <input
                          type="checkbox"
                          checked={(roleForm.permissions[mod] || []).includes(action)}
                          onChange={() => togglePermission(mod, action)}
                          style={{ cursor: 'pointer', width: 16, height: 16, accentColor: '#365E8D' }}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
            <button className="btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={saveRole}>Enregistrer</button>
            <button className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setRoleModal(null)}>Annuler</button>
          </div>
        </Modal>
      )}

      {deleteUserId && (
        <ConfirmModal
          title="Supprimer l'utilisateur"
          message="Êtes-vous sûr de vouloir révoquer l'accès de cet utilisateur ? Cette action est irréversible."
          onCancel={() => setDeleteUserId(null)}
          onConfirm={() => { deleteUser(deleteUserId); setDeleteUserId(null) }}
        />
      )}
      {deleteRoleId && (
        <ConfirmModal
          title="Supprimer le rôle"
          message="Êtes-vous sûr de vouloir supprimer ce rôle ? Les utilisateurs qui l'utilisent devront être réaffectés."
          onCancel={() => setDeleteRoleId(null)}
          onConfirm={() => { deleteRole(deleteRoleId); setDeleteRoleId(null) }}
        />
      )}
    </div>
  )
}
