import { useState } from 'react'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Events from './pages/Events'
import CreateEvent from './pages/CreateEvent'
import Participants from './pages/Participants'
import Speakers from './pages/Speakers'
import EventDetails from './pages/EventDetails'
import Profile from './pages/Profile'
import Layout from './components/Layout'
import { loadEvents, saveEvents, loadParticipants, saveParticipants, loadSpeakers, saveSpeakers, uid } from './store'

// Simple placeholders for new modules
const Logistics = () => <div className="p-6"><h2>Logistique (Salles et équipements)</h2><p className="text-gray-500 mt-2">Module en cours de développement...</p></div>
const Communications = () => <div className="p-6"><h2>Communication (Gestion des e-mails)</h2><p className="text-gray-500 mt-2">Module en cours de développement...</p></div>
const Administration = () => <div className="p-6"><h2>Administration (Rôles et utilisateurs)</h2><p className="text-gray-500 mt-2">Module en cours de développement...</p></div>

export default function App() {
  const [page, setPage] = useState('login')
  const [events, setEvents] = useState(() => loadEvents())
  const [participants, setParticipants] = useState(() => loadParticipants())
  const [speakers, setSpeakers] = useState(() => loadSpeakers())

  const navigate = (p) => setPage(p)

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
  }

  if (page === 'login') {
    return <Login onLogin={() => setPage('dashboard')} />
  }

  return (
    <Layout current={page} onNavigate={navigate}>
      {page === 'dashboard' && <Dashboard shared={shared} onNavigate={navigate} />}
      {page === 'events' && <Events shared={shared} onNavigate={navigate} />}
      {page === 'create-event' && <CreateEvent shared={shared} onNavigate={navigate} />}
      {page === 'participants' && <Participants shared={shared} />}
      {page === 'speakers' && <Speakers shared={shared} />}
      {page === 'event-details' && <EventDetails shared={shared} onNavigate={navigate} />}
      {page === 'profile' && <Profile />}
      {page === 'logistics' && <Logistics />}
      {page === 'communications' && <Communications />}
      {page === 'administration' && <Administration />}
    </Layout>
  )
}

