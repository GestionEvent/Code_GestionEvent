// Small shared UI building blocks used by the Beta modules
// (Logistique, Communication, Billetterie, Administration).
// Kept intentionally lightweight and dependency-free, matching the
// inline-style + utility-class conventions already used across the app.

export function StatCard({ label, value, color = '#365E8D', bg = '#eff6ff' }) {
  return (
    <div className="card" style={{ padding: '16px 20px' }}>
      <div style={{ fontSize: 13, color: '#64748b', marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 800, color }}>{value}</div>
      <div style={{ height: 3, borderRadius: 2, background: bg, marginTop: 10 }} />
    </div>
  )
}

export function EmptyState({ icon, title, message }) {
  return (
    <div className="card" style={{ padding: '64px 32px', textAlign: 'center', color: '#94a3b8' }}>
      {icon && (
        <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ margin: '0 auto 12px', display: 'block', opacity: 0.4 }} strokeWidth={1.5}>
          {icon}
        </svg>
      )}
      <div style={{ fontSize: 16, fontWeight: 600, color: '#64748b', marginBottom: 4 }}>{title}</div>
      {message && <div style={{ fontSize: 14 }}>{message}</div>}
    </div>
  )
}

export function Tabs({ tabs, active, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid #e2e8f0', marginBottom: 24 }}>
      {tabs.map(([id, label]) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          style={{
            padding: '10px 18px', border: 'none', background: 'none', cursor: 'pointer',
            fontSize: 14, fontWeight: active === id ? 600 : 500,
            color: active === id ? '#365E8D' : '#64748b',
            borderBottom: `2px solid ${active === id ? '#365E8D' : 'transparent'}`,
            marginBottom: -1, transition: 'all 0.15s',
          }}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

export function Modal({ onClose, maxWidth = 480, children }) {
  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: 24 }}
      onClick={onClose}
    >
      <div className="card" style={{ maxWidth, width: '100%', padding: 32, maxHeight: '90vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  )
}

export function ConfirmModal({ title, message, confirmLabel = 'Supprimer', danger = true, onCancel, onConfirm }) {
  return (
    <Modal onClose={onCancel} maxWidth={400}>
      <div style={{ width: 48, height: 48, borderRadius: 12, background: danger ? '#fef2f2' : '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke={danger ? '#dc2626' : '#365E8D'} strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <div style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>{title}</div>
      <div style={{ fontSize: 14, color: '#64748b', marginBottom: 24, lineHeight: 1.6 }}>{message}</div>
      <div style={{ display: 'flex', gap: 12 }}>
        <button className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={onCancel}>Annuler</button>
        <button className="btn-primary" style={{ flex: 1, justifyContent: 'center', background: danger ? '#dc2626' : undefined }} onClick={onConfirm}>{confirmLabel}</button>
      </div>
    </Modal>
  )
}

export function Toggle({ val, onToggle }) {
  return (
    <div
      onClick={onToggle}
      style={{
        width: 44, height: 24, borderRadius: 12,
        background: val ? '#365E8D' : '#e2e8f0',
        cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0,
      }}
    >
      <div style={{
        width: 18, height: 18, borderRadius: '50%', background: 'white',
        position: 'absolute', top: 3, left: val ? 23 : 3, transition: 'left 0.2s',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
      }} />
    </div>
  )
}
