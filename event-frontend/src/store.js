// Shared in-memory + localStorage backed store for Gestion d'événement.
// All data starts empty and persists in the browser via localStorage.

const KEYS = {
  events: 'ge_events',
  participants: 'ge_participants',
  speakers: 'ge_speakers',
  // Beta additions
  rooms: 'ge_rooms',
  equipment: 'ge_equipment',
  emailTemplates: 'ge_email_templates',
  emailLogs: 'ge_email_logs',
  ticketTypes: 'ge_ticket_types',
  transactions: 'ge_transactions',
  users: 'ge_users',
  roles: 'ge_roles',
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

// --- Logistique : Salles ---
export function loadRooms() {
  return read(KEYS.rooms)
}
export function saveRooms(rooms) {
  write(KEYS.rooms, rooms)
}

// --- Logistique : Matériel ---
export function loadEquipment() {
  return read(KEYS.equipment)
}
export function saveEquipment(equipment) {
  write(KEYS.equipment, equipment)
}

// --- Communication : Modèles d'e-mails ---
const DEFAULT_TEMPLATES = [
  {
    id: 'tpl-confirmation',
    name: "Confirmation d'inscription",
    trigger: 'Inscription',
    subject: 'Votre inscription à {{evenement}} est confirmée',
    body: "Bonjour {{prenom}},\n\nVotre inscription à \"{{evenement}}\" est confirmée. Votre billet : {{billet}}.\n\nÀ très bientôt !",
    active: true,
  },
  {
    id: 'tpl-rappel',
    name: "Rappel avant l'événement",
    trigger: 'Rappel (24h avant)',
    subject: "Ça commence bientôt : {{evenement}}",
    body: "Bonjour {{prenom}},\n\nPetit rappel : \"{{evenement}}\" a lieu demain à {{lieu}}. Nous avons hâte de vous y voir !",
    active: true,
  },
  {
    id: 'tpl-annulation',
    name: "Annulation d'inscription",
    trigger: 'Annulation',
    subject: 'Votre inscription à {{evenement}} a été annulée',
    body: "Bonjour {{prenom}},\n\nNous confirmons l'annulation de votre inscription à \"{{evenement}}\". N'hésitez pas à nous contacter pour toute question.",
    active: true,
  },
  {
    id: 'tpl-bienvenue-intervenant',
    name: 'Bienvenue intervenant',
    trigger: 'Nouvel intervenant',
    subject: 'Bienvenue parmi les intervenants de {{evenement}}',
    body: "Bonjour {{prenom}},\n\nMerci d'avoir accepté d'intervenir à \"{{evenement}}\" ! Nous reviendrons vers vous avec les détails du programme.",
    active: false,
  },
]

export function loadEmailTemplates() {
  const raw = localStorage.getItem(KEYS.emailTemplates)
  if (raw === null) return DEFAULT_TEMPLATES
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : DEFAULT_TEMPLATES
  } catch (err) {
    console.warn('Impossible de lire les modèles d\'e-mails', err)
    return DEFAULT_TEMPLATES
  }
}
export function saveEmailTemplates(templates) {
  write(KEYS.emailTemplates, templates)
}

// --- Communication : Historique d'envoi ---
export function loadEmailLogs() {
  return read(KEYS.emailLogs)
}
export function saveEmailLogs(logs) {
  write(KEYS.emailLogs, logs)
}

// --- Billetterie : Types de billets ---
export function loadTicketTypes() {
  return read(KEYS.ticketTypes)
}
export function saveTicketTypes(ticketTypes) {
  write(KEYS.ticketTypes, ticketTypes)
}

// --- Billetterie : Transactions ---
export function loadTransactions() {
  return read(KEYS.transactions)
}
export function saveTransactions(transactions) {
  write(KEYS.transactions, transactions)
}

// --- Administration : Utilisateurs ---
export function loadUsers() {
  return read(KEYS.users)
}
export function saveUsers(users) {
  write(KEYS.users, users)
}

// --- Administration : Rôles & permissions ---
export const PERMISSION_MODULES = [
  'Événements',
  'Participants',
  'Intervenants',
  'Logistique',
  'Communication',
  'Billetterie',
  'Administration',
]

const DEFAULT_ROLES = [
  {
    id: 'role-admin',
    name: 'Administrateur',
    description: 'Accès complet à toutes les fonctionnalités de la plateforme.',
    system: true,
    permissions: Object.fromEntries(PERMISSION_MODULES.map((m) => [m, ['Lire', 'Créer', 'Modifier', 'Supprimer']])),
  },
  {
    id: 'role-organisateur',
    name: 'Organisateur',
    description: "Gère les événements, participants, intervenants et la logistique associée.",
    system: true,
    permissions: {
      'Événements': ['Lire', 'Créer', 'Modifier', 'Supprimer'],
      'Participants': ['Lire', 'Créer', 'Modifier', 'Supprimer'],
      'Intervenants': ['Lire', 'Créer', 'Modifier', 'Supprimer'],
      'Logistique': ['Lire', 'Créer', 'Modifier'],
      'Communication': ['Lire', 'Créer'],
      'Billetterie': ['Lire'],
      'Administration': [],
    },
  },
  {
    id: 'role-moderateur',
    name: 'Modérateur',
    description: 'Gère les participants et la communication au quotidien.',
    system: true,
    permissions: {
      'Événements': ['Lire'],
      'Participants': ['Lire', 'Créer', 'Modifier'],
      'Intervenants': ['Lire'],
      'Logistique': ['Lire'],
      'Communication': ['Lire', 'Créer', 'Modifier'],
      'Billetterie': ['Lire'],
      'Administration': [],
    },
  },
  {
    id: 'role-intervenant',
    name: 'Intervenant',
    description: 'Accès limité à son propre profil et au programme des événements.',
    system: true,
    permissions: {
      'Événements': ['Lire'],
      'Participants': [],
      'Intervenants': ['Lire'],
      'Logistique': [],
      'Communication': [],
      'Billetterie': [],
      'Administration': [],
    },
  },
  {
    id: 'role-lecture',
    name: 'Lecture seule',
    description: "Consultation uniquement, aucune modification possible.",
    system: true,
    permissions: Object.fromEntries(PERMISSION_MODULES.map((m) => [m, ['Lire']])),
  },
]

export function loadRoles() {
  const raw = localStorage.getItem(KEYS.roles)
  if (raw === null) return DEFAULT_ROLES
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_ROLES
  } catch (err) {
    console.warn('Impossible de lire les rôles', err)
    return DEFAULT_ROLES
  }
}
export function saveRoles(roles) {
  write(KEYS.roles, roles)
}

// --- Compte utilisateur (inscription simulée, sans backend) ---
export function loadAccount() {
  try {
    const raw = localStorage.getItem('ge_account')
    return raw ? JSON.parse(raw) : null
  } catch (err) {
    console.warn('Impossible de lire le compte', err)
    return null
  }
}
export function saveAccount(account) {
  try {
    localStorage.setItem('ge_account', JSON.stringify(account))
  } catch (err) {
    console.warn('Impossible d\'enregistrer le compte', err)
  }
}

// Simple unique id generator
export function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

