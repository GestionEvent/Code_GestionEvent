// Shared in-memory + localStorage backed store for the alpha version.
// All data starts empty and persists in the browser via localStorage.

const KEYS = {
  events: 'ge_events',
  participants: 'ge_participants',
  speakers: 'ge_speakers',
}

function read(key) {
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch (err) {
    console.warn(`Impossible de lire les données (${key})`, err)
    return []
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (err) {
    console.warn(`Impossible de sauvegarder les données (${key})`, err)
  }
}

export function loadEvents() {
  return read(KEYS.events)
}

export function saveEvents(events) {
  write(KEYS.events, events)
}

export function loadParticipants() {
  return read(KEYS.participants)
}

export function saveParticipants(participants) {
  write(KEYS.participants, participants)
}

export function loadSpeakers() {
  return read(KEYS.speakers)
}

export function saveSpeakers(speakers) {
  write(KEYS.speakers, speakers)
}

// Simple unique id generator
export function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

