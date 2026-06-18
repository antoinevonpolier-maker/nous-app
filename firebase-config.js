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
