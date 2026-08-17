import { useState } from 'react'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Events from './pages/Events'
import CreateEvent from './pages/CreateEvent'
import Participants from './pages/Participants'
import Speakers from './pages/Speakers'
import EventDetails from './pages/EventDetails'
import Profile from './pages/Profile'
import Logistics from './pages/Logistics'
import Communications from './pages/Communications'
import Billing from './pages/Billing'
import Administration from './pages/Administration'
import Layout from './components/Layout'
import {
  loadEvents, saveEvents,
  loadParticipants, saveParticipants,
  loadSpeakers, saveSpeakers,
  loadRooms, saveRooms,
  loadEquipment, saveEquipment,
  loadEmailTemplates, saveEmailTemplates,
  loadEmailLogs, saveEmailLogs,
  loadTicketTypes, saveTicketTypes,
  loadTransactions, saveTransactions,
  loadUsers, saveUsers,
  loadRoles, saveRoles,
  loadAccount,
  uid,
} from './store'

export default function App() {
  const [page, setPage] = useState('login')
  const [currentUser, setCurrentUser] = useState(null)
  const [justRegistered, setJustRegistered] = useState(false)
  const [prefillEmail, setPrefillEmail] = useState(() => loadAccount()?.email || '')
  const [events, setEvents] = useState(() => loadEvents())
  const [participants, setParticipants] = useState(() => loadParticipants())
  const [speakers, setSpeakers] = useState(() => loadSpeakers())

  // Beta module state
  const [rooms, setRooms] = useState(() => loadRooms())
  const [equipment, setEquipment] = useState(() => loadEquipment())
  const [emailTemplates, setEmailTemplates] = useState(() => loadEmailTemplates())
  const [emailLogs, setEmailLogs] = useState(() => loadEmailLogs())
  const [ticketTypes, setTicketTypes] = useState(() => loadTicketTypes())
  const [transactions, setTransactions] = useState(() => loadTransactions())
  const [users, setUsers] = useState(() => loadUsers())
  const [roles, setRoles] = useState(() => loadRoles())

  const navigate = (p) => setPage(p)

  // Account creation (simulated — no real backend/auth server in this demo).
  const handleRegister = ({ firstName, lastName, email, company }) => {
    // Pre-fill the profile page (src/pages/Profile.jsx reads the same 'ge_profile' key on mount).
    try {
      const existing = JSON.parse(localStorage.getItem('ge_profile') || '{}')
      localStorage.setItem('ge_profile', JSON.stringify({ ...existing, firstName, lastName, email, company }))
    } catch {
      // ignore storage errors
    }
    setPrefillEmail(email)
    setJustRegistered(true)
    setPage('login')
  }

  // Events CRUD
  const addEvent = (data) => {
    const newEvent = {
      id: uid(),
      ...data,
      registered: 0,
      status: 'Actif',
    }
    setEvents((prev) => {
      const next = [newEvent, ...prev]
      saveEvents(next)
      return next
    })
    return newEvent
  }

  const updateEvent = (id, data) => {
    setEvents((prev) => {
      const next = prev.map((e) => (e.id === id ? { ...e, ...data } : e))
      saveEvents(next)
      return next
    })
  }

  const deleteEvent = (id) => {
    setEvents((prev) => {
      const next = prev.filter((e) => e.id !== id)
      saveEvents(next)
      return next
    })
  }

  // Participants CRUD
  const addParticipant = (data) => {
    const newP = {
      id: uid(),
      registered: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      regStatus: 'Confirmé',
      attendance: 'En attente',
      ticket: '#GE-' + Math.random().toString(36).slice(2, 6).toUpperCase(),
      ...data,
    }
    setParticipants((prev) => {
      const next = [newP, ...prev]
      saveParticipants(next)
      return next
    })

    // Beta: auto-log a simulated "confirmation" email if a matching active template exists
    const confirmationTemplate = emailTemplates.find((t) => t.trigger === 'Inscription' && t.active)
    if (confirmationTemplate) {
      sendSimulatedEmail({
        to: newP.email,
        subject: confirmationTemplate.subject,
        template: confirmationTemplate.name,
        event: newP.event || '—',
      })
    }
  }

  const deleteParticipants = (ids) => {
    setParticipants((prev) => {
      const set = new Set(ids)
      const next = prev.filter((p) => !set.has(p.id))
      saveParticipants(next)
      return next
    })
  }

  // Speakers CRUD
  const addSpeaker = (data) => {
    const newS = {
      id: uid(),
      sessions: [],
      topics: [],
      events: 0,
      ...data,
    }
    setSpeakers((prev) => {
      const next = [newS, ...prev]
      saveSpeakers(next)
      return next
    })
  }

  const updateSpeaker = (id, data) => {
    setSpeakers((prev) => {
      const next = prev.map((s) => (s.id === id ? { ...s, ...data } : s))
      saveSpeakers(next)
      return next
    })
  }

  const deleteSpeaker = (id) => {
    setSpeakers((prev) => {
      const next = prev.filter((s) => s.id !== id)
      saveSpeakers(next)
      return next
    })
  }

  // --- Logistique : Salles ---
  const addRoom = (data) => {
    setRooms((prev) => {
      const next = [{ id: uid(), ...data }, ...prev]
      saveRooms(next)
      return next
    })
  }
  const updateRoom = (id, data) => {
    setRooms((prev) => {
      const next = prev.map((r) => (r.id === id ? { ...r, ...data } : r))
      saveRooms(next)
      return next
    })
  }
  const deleteRoom = (id) => {
    setRooms((prev) => {
      const next = prev.filter((r) => r.id !== id)
      saveRooms(next)
      return next
    })
  }

  // --- Logistique : Matériel ---
  const addEquipmentItem = (data) => {
    setEquipment((prev) => {
      const next = [{ id: uid(), ...data }, ...prev]
      saveEquipment(next)
      return next
    })
  }
  const updateEquipmentItem = (id, data) => {
    setEquipment((prev) => {
      const next = prev.map((e) => (e.id === id ? { ...e, ...data } : e))
      saveEquipment(next)
      return next
    })
  }
  const deleteEquipmentItem = (id) => {
    setEquipment((prev) => {
      const next = prev.filter((e) => e.id !== id)
      saveEquipment(next)
      return next
    })
  }

  // --- Communication : Modèles ---
  const addEmailTemplate = (data) => {
    setEmailTemplates((prev) => {
      const next = [{ id: uid(), ...data }, ...prev]
      saveEmailTemplates(next)
      return next
    })
  }
  const updateEmailTemplate = (id, data) => {
    setEmailTemplates((prev) => {
      const next = prev.map((t) => (t.id === id ? { ...t, ...data } : t))
      saveEmailTemplates(next)
      return next
    })
  }
  const deleteEmailTemplate = (id) => {
    setEmailTemplates((prev) => {
      const next = prev.filter((t) => t.id !== id)
      saveEmailTemplates(next)
      return next
    })
  }

  // --- Communication : simulation d'envoi (aucun e-mail réel n'est transmis) ---
  const sendSimulatedEmail = ({ to, subject, template, event }) => {
    const entry = {
      id: uid(),
      to,
      subject,
      template,
      event,
      status: 'Envoyé',
      sentAt: new Date().toLocaleString('fr-FR', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
    }
    setEmailLogs((prev) => {
      const next = [entry, ...prev]
      saveEmailLogs(next)
      return next
    })
  }

  // --- Billetterie : Types de billets ---
  const addTicketType = (data) => {
    setTicketTypes((prev) => {
      const next = [{ id: uid(), ...data }, ...prev]
      saveTicketTypes(next)
      return next
    })
  }
  const updateTicketType = (id, data) => {
    setTicketTypes((prev) => {
      const next = prev.map((t) => (t.id === id ? { ...t, ...data } : t))
      saveTicketTypes(next)
      return next
    })
  }
  const deleteTicketType = (id) => {
    setTicketTypes((prev) => {
      const next = prev.filter((t) => t.id !== id)
      saveTicketTypes(next)
      return next
    })
  }

  // --- Billetterie : Transactions ---
  const addTransaction = (data) => {
    setTransactions((prev) => {
      const next = [{ id: uid(), ...data }, ...prev]
      saveTransactions(next)
      return next
    })
  }
  const updateTransaction = (id, data) => {
    setTransactions((prev) => {
      const next = prev.map((t) => (t.id === id ? { ...t, ...data } : t))
      saveTransactions(next)
      return next
    })
  }

  // --- Administration : Utilisateurs ---
  const addUser = (data) => {
    setUsers((prev) => {
      const next = [{ id: uid(), lastLogin: 'Jamais connecté', ...data }, ...prev]
      saveUsers(next)
      return next
    })
  }
  const updateUser = (id, data) => {
    setUsers((prev) => {
      const next = prev.map((u) => (u.id === id ? { ...u, ...data } : u))
      saveUsers(next)
      return next
    })
  }
  const deleteUser = (id) => {
    setUsers((prev) => {
      const next = prev.filter((u) => u.id !== id)
      saveUsers(next)
      return next
    })
  }

  // --- Administration : Rôles ---
  const addRole = (data) => {
    setRoles((prev) => {
      const next = [{ id: uid(), system: false, ...data }, ...prev]
      saveRoles(next)
      return next
    })
  }
  const updateRole = (id, data) => {
    setRoles((prev) => {
      const next = prev.map((r) => (r.id === id ? { ...r, ...data } : r))
      saveRoles(next)
      return next
    })
  }
  const deleteRole = (id) => {
    setRoles((prev) => {
      const next = prev.filter((r) => r.id !== id)
      saveRoles(next)
      return next
    })
  }

  const shared = {
    events,
    participants,
    speakers,
    addEvent,
    updateEvent,
    deleteEvent,
    addParticipant,
    deleteParticipants,
    addSpeaker,
    updateSpeaker,
    deleteSpeaker,
    // Logistique
    rooms,
    equipment,
    addRoom,
    updateRoom,
    deleteRoom,
    addEquipment: addEquipmentItem,
    updateEquipment: updateEquipmentItem,
    deleteEquipment: deleteEquipmentItem,
    // Communication
    emailTemplates,
    emailLogs,
    addEmailTemplate,
    updateEmailTemplate,
    deleteEmailTemplate,
    sendSimulatedEmail,
    // Billetterie
    ticketTypes,
    transactions,
    addTicketType,
    updateTicketType,
    deleteTicketType,
    addTransaction,
    updateTransaction,
    // Administration
    users,
    roles,
    addUser,
    updateUser,
    deleteUser,
    addRole,
    updateRole,
    deleteRole,
  }

  if (page === 'login') {
    return (
      <Login
        onLogin={(userData) => { setCurrentUser(userData); setPage('dashboard') }}
        onGoToRegister={() => { setJustRegistered(false); setPage('register') }}
        prefillEmail={prefillEmail}
        justRegistered={justRegistered}
      />
    )
  }

  if (page === 'register') {
    return <Register onRegister={handleRegister} onGoToLogin={() => setPage('login')} />
  }

  return (
    <Layout current={page} onNavigate={navigate} onLogout={() => { setCurrentUser(null); setPage('login') }}>
      {page === 'dashboard' && <Dashboard shared={shared} onNavigate={navigate} />}
      {page === 'events' && <Events shared={shared} onNavigate={navigate} />}
      {page === 'create-event' && <CreateEvent shared={shared} onNavigate={navigate} />}
      {page === 'participants' && <Participants shared={shared} />}
      {page === 'speakers' && <Speakers shared={shared} />}
      {page === 'event-details' && <EventDetails shared={shared} onNavigate={navigate} />}
      {page === 'profile' && <Profile currentUser={currentUser} />}
      {page === 'logistics' && <Logistics shared={shared} />}
      {page === 'communications' && <Communications shared={shared} />}
      {page === 'billing' && <Billing shared={shared} />}
      {page === 'administration' && <Administration shared={shared} />}
    </Layout>
  )
}
