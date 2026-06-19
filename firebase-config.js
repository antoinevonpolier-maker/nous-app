// ============================================================
//  CONFIGURATION FIREBASE — Antoine & Silvia
// ============================================================
//  Ces clés sont PUBLIQUES par nature : c'est normal et sans
//  danger. La vraie sécurité vient des règles Firestore/Storage.
// ============================================================

const firebaseConfig = {
  apiKey: "AIzaSyDhElWRPp22QuatNhTc8EMZvJlBUQOu0Eo",
  authDomain: "nous-app-b013d.firebaseapp.com",
  projectId: "nous-app-b013d",
  storageBucket: "nous-app-b013d.firebasestorage.app",
  messagingSenderId: "109510423373",
  appId: "1:109510423373:web:8093cac74d785fca6ebd04"
};

// --- Initialisation (ne pas modifier) ---
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// ============================================================
//  PARAMÈTRES DU COUPLE
// ============================================================
const COUPLE = {
  // Date de début de votre relation
  dateDebut: "2025-04-12",

  personneA: {
    prenom: "Antoine",
    ville: "Paris",
    drapeau: "🇫🇷",
    timezone: "Europe/Paris",
    lat: 48.8566,
    lon: 2.3522
  },
  personneB: {
    prenom: "Silvia",
    ville: "La Nouvelle-Orléans",
    drapeau: "🇺🇸",
    timezone: "America/Chicago",
    lat: 29.9511,
    lon: -90.0715
  }
};

// --- Protection des pages : redirige vers login si non connecté ---
function protegerPage() {
  auth.onAuthStateChanged((user) => {
    if (!user) {
      window.location.href = "index.html";
    }
  });
}

// ============================================================
//  SYSTÈME DE LANGUE (FR pour Antoine, EN pour Silvia)
// ============================================================
// Détermine si l'utilisateur connecté est anglophone (Silvia)
function estAnglophone(email) {
  const local = (email || "").toLowerCase();
  return local.includes(COUPLE.personneB.prenom.toLowerCase());
}

// Dictionnaire de toutes les traductions de l'interface
const TRADUCTIONS = {
  // --- Accueil ---
  "Photo du jour": "Photo of the day",
  "Dernier dessin": "Latest drawing",
  "Météo": "Weather",
  "Prochains moments": "Upcoming moments",
  "jours": "days",
  "Chargement…": "Loading…",
  "Aucun moment prévu.": "No moments planned.",
  "Ajoutez-en un ! →": "Add one! →",
  // --- Photos ---
  "Nos photos": "Our photos",
  "Touche le coeur pour garder une photo. Les autres s'effacent apres 7 jours.": "Tap the heart to keep a photo. Others are deleted after 7 days.",
  "Aucune photo pour l'instant.": "No photos yet.",
  "Appuie sur + pour partager la première !": "Tap + to share the first one!",
  "Garder": "Keep",
  "Ne plus garder": "Stop keeping",
  "Supprimer": "Delete",
  "Supprimer cette photo ?": "Delete this photo?",
  "Gardée — ne sera pas supprimée": "Kept — won't be deleted",
  "S'effacera après 7 jours": "Will be deleted after 7 days",
  // --- Agenda ---
  "Notre agenda": "Our calendar",
  "Nouveau moment 💕": "New moment 💕",
  "Quoi ?": "What?",
  "Quand ?": "When?",
  "Ajouter": "Add",
  "Annuler": "Cancel",
  "Prochain moment": "Next moment",
  "À venir": "Upcoming",
  "Souvenirs": "Memories",
  "Passé": "Past",
  "ajouté par": "added by",
  "Supprimer ce moment ?": "Delete this moment?",
  "Donne un titre à ce moment.": "Give this moment a title.",
  "Choisis une date.": "Choose a date.",
  "Ex : Appel vidéo, Voyage à Paris…": "E.g. Video call, Trip to Paris…",
  "Aucun moment prévu.<br>Appuie sur + pour planifier votre prochain rendez-vous !": "No moments planned.<br>Tap + to plan your next date!",
  // --- Notes ---
  "Nos notes": "Our notes",
  "À jour": "Saved",
  "Sauvegarde…": "Saving…",
  "Erreur de connexion": "Connection error",
  "Erreur de sauvegarde": "Save error",
  "Bloc-notes partagé, sauvegarde automatique.": "Shared notepad, auto-save.",
  "Dernière modif :": "Last edit:",
  "Écrivez ici à deux…\n\n🛒 Courses : lait, œufs, pâtes\n🎬 Films à voir : Inception, Amélie Poulain\n💡 Idées : week-end à la mer ?\n\nTout ce que vous tapez est partagé en temps réel.": "Write here together…\n\n🛒 Groceries: milk, eggs, pasta\n🎬 Movies to watch: Inception, Amélie\n💡 Ideas: weekend at the beach?\n\nEverything you type is shared in real time.",
  // --- Dessin ---
  "Tableau partagé": "Shared board",
  "Votre toile commune 💕": "Your shared canvas 💕",
  "Couleur": "Color",
  "Épaisseur": "Size",
  "Tout effacer": "Clear all",
  "Enregistrer 💌": "Save 💌",
  "Enregistré ! 💕": "Saved! 💕",
  "✏️ Dessine avec ton doigt": "✏️ Draw with your finger",
  "Chargement de la toile…": "Loading canvas…",
  "Une seule toile partagée : dessinez chacun votre tour.": "One shared canvas: take turns drawing.",
  "Dernière touche :": "Last touch:",
  "Effacer toute la toile et repartir d'une page blanche ?": "Clear the whole canvas and start fresh?",
  "Le dessin est trop lourd. Essaie d'effacer une partie et de réessayer.": "The drawing is too heavy. Try erasing part of it and retry.",
  "Gomme": "Eraser",
  // --- Connexion ---
  "Se connecter": "Sign in",
  "Adresse email": "Email address",
  "Mot de passe": "Password",
  "Email ou mot de passe incorrect.": "Incorrect email or password.",
  "Adresse email invalide.": "Invalid email address.",
  "Remplis les deux champs.": "Fill in both fields.",
  // --- Temps relatif ---
  "à l'instant": "just now",
  "il y a": "",  // géré spécialement
  "min": "min",
  "dans": "in",
  "maintenant": "now",
  "bientôt": "soon",
  "Se déconnecter": "Sign out"
};

let LANGUE_US = false; // défini à la connexion via definirLangue()
function definirLangue(email) { LANGUE_US = estAnglophone(email); }

// Traduit un texte : renvoie l'anglais si Silvia est connectée, sinon le français
function t(texteFr) {
  if (!LANGUE_US) return texteFr;
  return TRADUCTIONS[texteFr] !== undefined ? TRADUCTIONS[texteFr] : texteFr;
}

// Traduit automatiquement la barre de navigation (commune à toutes les pages)
function traduireNavCommune() {
  if (!LANGUE_US) return;
  const libelles = { "Accueil": "Home", "Photos": "Photos", "Agenda": "Calendar", "Notes": "Notes", "Dessin": "Drawing" };
  document.querySelectorAll(".nav a").forEach(a => {
    const noeudTexte = Array.from(a.childNodes).find(n => n.nodeType === 3 && n.textContent.trim());
    if (noeudTexte) {
      const texte = noeudTexte.textContent.trim();
      if (libelles[texte]) noeudTexte.textContent = libelles[texte];
    }
  });
}

// ====== FONCTIONS DE TEMPS BILINGUES (communes à toutes les pages) ======
// "il y a 5 min" / "5 min ago"
function tempsEcouleBilingue(timestamp) {
  if (!timestamp) return "";
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  const sec = Math.floor((Date.now() - date) / 1000);
  if (LANGUE_US) {
    if (sec < 60) return "just now";
    if (sec < 3600) return Math.floor(sec / 60) + " min ago";
    if (sec < 86400) return Math.floor(sec / 3600) + " h ago";
    return Math.floor(sec / 86400) + " d ago";
  } else {
    if (sec < 60) return "à l'instant";
    if (sec < 3600) return "il y a " + Math.floor(sec / 60) + " min";
    if (sec < 86400) return "il y a " + Math.floor(sec / 3600) + " h";
    return "il y a " + Math.floor(sec / 86400) + " j";
  }
}

// "dans 3 jours" / "in 3 days"
function compteAReboursBilingue(timestamp) {
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  const diff = date - Date.now();
  const jours = Math.floor(diff / (1000 * 60 * 60 * 24));
  const heures = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  if (LANGUE_US) {
    if (diff <= 0) return "now";
    if (jours >= 1) return "in " + jours + (jours > 1 ? " days" : " day");
    if (heures >= 1) return "in " + heures + " h";
    const min = Math.floor(diff / (1000 * 60));
    return "in " + min + " min";
  } else {
    if (diff <= 0) return "maintenant";
    if (jours >= 1) return "dans " + jours + (jours > 1 ? " jours" : " jour");
    if (heures >= 1) return "dans " + heures + " h";
    const min = Math.floor(diff / (1000 * 60));
    return "dans " + min + " min";
  }
}
