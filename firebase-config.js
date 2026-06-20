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
// ====== QUESTIONS DU JOUR (bilingue FR/EN) ======
// La question affichée change chaque jour, identique pour les deux.
const QUESTIONS = [
  // --- Romantiques / sur nous ---
  { fr: "Quel est ton souvenir préféré de nous deux ?", en: "What's your favorite memory of us?" },
  { fr: "Quand as-tu su que tu étais amoureux(se) de moi ?", en: "When did you know you were in love with me?" },
  { fr: "Qu'est-ce qui t'a attiré chez moi au début ?", en: "What first attracted you to me?" },
  { fr: "Décris notre couple en trois mots.", en: "Describe our relationship in three words." },
  { fr: "Quel petit détail de moi adores-tu ?", en: "What little detail about me do you adore?" },
  { fr: "Qu'est-ce qui te fait te sentir aimé(e) ?", en: "What makes you feel loved?" },
  { fr: "Quelle est la chose la plus romantique que tu aies envie de faire ?", en: "What's the most romantic thing you'd like to do?" },
  { fr: "Qu'est-ce qui te rend fier(e) de nous ?", en: "What makes you proud of us?" },
  { fr: "Quel moment avec moi rejouerais-tu en boucle ?", en: "Which moment with me would you replay over and over?" },
  { fr: "Si tu pouvais figer un instant avec moi pour toujours, lequel ?", en: "If you could freeze one moment with me forever, which one?" },
  { fr: "Qu'est-ce que tu admires le plus chez moi ?", en: "What do you admire most about me?" },
  { fr: "Quelle photo de nous est ta préférée ?", en: "What's your favorite photo of us?" },
  { fr: "Qu'est-ce que j'ai changé dans ta vie ?", en: "How have I changed your life?" },
  { fr: "Quel est ton geste d'affection préféré ?", en: "What's your favorite gesture of affection?" },
  { fr: "Qu'est-ce qui te manque le plus de moi physiquement ?", en: "What do you miss most about me physically?" },
  { fr: "Quelle est ta façon préférée de te sentir proche de moi malgré la distance ?", en: "What's your favorite way to feel close to me despite the distance?" },
  { fr: "Quel mot ou phrase de moi te fait fondre ?", en: "What word or phrase from me melts your heart?" },
  { fr: "Quand t'es-tu senti(e) le plus connecté(e) à moi ?", en: "When did you feel most connected to me?" },
  { fr: "Qu'est-ce que tu trouves le plus sexy chez moi ?", en: "What do you find sexiest about me?" },
  { fr: "Si tu devais m'écrire une lettre d'amour en une phrase, ce serait quoi ?", en: "If you had to write me a love letter in one sentence, what would it be?" },

  // --- Le futur / projets ---
  { fr: "Quelle est la première chose que tu veux faire quand on se retrouve ?", en: "What's the first thing you want to do when we reunite?" },
  { fr: "Quel est ton rêve pour nous dans cinq ans ?", en: "What's your dream for us in five years?" },
  { fr: "Comment imagines-tu notre vie quand on vivra ensemble ?", en: "How do you picture our life when we live together?" },
  { fr: "Dans quelle ville rêverais-tu qu'on habite ensemble ?", en: "What city would you dream of us living in together?" },
  { fr: "Quelle tradition aimerais-tu qu'on crée rien qu'à nous ?", en: "What tradition would you love us to create, just ours?" },
  { fr: "Quel voyage veux-tu absolument qu'on fasse un jour ?", en: "What trip do you absolutely want us to take someday?" },
  { fr: "Combien d'enfants imagines-tu pour nous, si tu en veux ?", en: "How many kids do you imagine for us, if any?" },
  { fr: "À quoi ressemblerait notre maison idéale ?", en: "What would our ideal home look like?" },
  { fr: "Quel défi aimerais-tu qu'on relève ensemble ?", en: "What challenge would you love us to take on together?" },
  { fr: "Comment veux-tu qu'on fête notre première année ensemble pour de vrai ?", en: "How do you want us to celebrate our first year together for real?" },
  { fr: "Quel animal de compagnie aimerais-tu qu'on adopte ?", en: "What pet would you love us to adopt?" },
  { fr: "Quelle serait notre journée parfaite quand on vivra ensemble ?", en: "What would our perfect day look like once we live together?" },
  { fr: "Qu'est-ce que tu as le plus hâte de partager au quotidien avec moi ?", en: "What everyday thing are you most excited to share with me?" },

  // --- Souvenirs / passé ---
  { fr: "Quel a été notre plus beau moment ensemble jusqu'ici ?", en: "What's been our best moment together so far?" },
  { fr: "De quoi te souviens-tu de notre première conversation ?", en: "What do you remember about our first conversation?" },
  { fr: "Quel fou rire avec moi n'oublieras-tu jamais ?", en: "What fit of laughter with me will you never forget?" },
  { fr: "Quel a été ton moment le plus gênant avec moi ?", en: "What was your most embarrassing moment with me?" },
  { fr: "Quelle est la chose la plus folle qu'on ait faite ensemble ?", en: "What's the craziest thing we've done together?" },
  { fr: "Quel cadeau que je t'ai fait t'a le plus touché(e) ?", en: "Which gift I gave you touched you the most?" },
  { fr: "Quel moment difficile a renforcé notre couple ?", en: "What hard time made our relationship stronger?" },

  // --- Profondes / introspectives ---
  { fr: "Comment te sens-tu, vraiment, en ce moment ?", en: "How are you really feeling right now?" },
  { fr: "Quel est ton plus grand rêve dans la vie ?", en: "What's your biggest dream in life?" },
  { fr: "Qu'est-ce que tu as appris sur toi grâce à notre relation ?", en: "What have you learned about yourself through our relationship?" },
  { fr: "De quoi as-tu le plus peur en ce moment ?", en: "What are you most afraid of right now?" },
  { fr: "Qu'est-ce qui te rend le plus heureux(se) dans la vie ?", en: "What makes you happiest in life?" },
  { fr: "Quelle est ta plus grande fierté ?", en: "What are you most proud of?" },
  { fr: "Qu'est-ce que tu aimerais changer chez toi ?", en: "What would you like to change about yourself?" },
  { fr: "Quel est le meilleur conseil qu'on t'ait donné ?", en: "What's the best advice you've ever received?" },
  { fr: "Qu'est-ce qui te donne de l'énergie le matin ?", en: "What gives you energy in the morning?" },
  { fr: "Quelle est ta plus belle qualité selon toi ?", en: "What do you think is your best quality?" },
  { fr: "Si tu pouvais dire une chose à ton toi d'il y a 5 ans, ce serait quoi ?", en: "If you could tell your 5-years-ago self one thing, what would it be?" },
  { fr: "Qu'est-ce qui compte le plus pour toi dans la vie ?", en: "What matters most to you in life?" },
  { fr: "Qu'est-ce qui te fait te sentir vivant(e) ?", en: "What makes you feel alive?" },

  // --- Préférerais-tu / choix ---
  { fr: "Préférerais-tu un week-end à la plage ou à la montagne avec moi ?", en: "Would you rather a beach or mountain weekend with me?" },
  { fr: "Préférerais-tu qu'on voyage tout le temps ou qu'on ait un cocon bien à nous ?", en: "Would you rather we travel all the time or have a cozy home of our own?" },
  { fr: "Soirée ciné à la maison ou sortie animée ?", en: "Movie night at home or a lively night out?" },
  { fr: "Préférerais-tu lire dans mes pensées ou que je lise dans les tiennes ?", en: "Would you rather read my mind or have me read yours?" },
  { fr: "Lever de soleil ou coucher de soleil ensemble ?", en: "Sunrise or sunset together?" },
  { fr: "Préférerais-tu cuisiner ensemble ou qu'on se fasse livrer ?", en: "Would you rather cook together or order in?" },
  { fr: "Un petit resto cosy ou un pique-nique improvisé ?", en: "A cozy little restaurant or an impromptu picnic?" },
  { fr: "Préférerais-tu danser sous la pluie ou se blottir devant un feu ?", en: "Would you rather dance in the rain or cuddle by a fire?" },

  // --- Légères / quotidien ---
  { fr: "Qu'est-ce qui t'a fait sourire aujourd'hui ?", en: "What made you smile today?" },
  { fr: "Quel a été le meilleur moment de ta semaine ?", en: "What was the best moment of your week?" },
  { fr: "Qu'est-ce que tu as hâte de me raconter en ce moment ?", en: "What are you excited to tell me right now?" },
  { fr: "Quelle chanson tournes-tu en boucle en ce moment ?", en: "What song are you playing on repeat right now?" },
  { fr: "Quel est ton moment préféré de la journée ?", en: "What's your favorite time of day?" },
  { fr: "Qu'est-ce que tu as mangé de bon récemment ?", en: "What's something good you've eaten recently?" },
  { fr: "Quelle série ou quel film regardes-tu en ce moment ?", en: "What show or movie are you watching right now?" },
  { fr: "Qu'est-ce qui t'a énervé(e) cette semaine ?", en: "What annoyed you this week?" },
  { fr: "Quel petit plaisir t'es-tu offert récemment ?", en: "What little treat did you give yourself recently?" },
  { fr: "Comment s'est passée ta journée, vraiment ?", en: "How was your day, really?" },
  { fr: "Qu'est-ce qui t'occupe l'esprit en ce moment ?", en: "What's on your mind right now?" },
  { fr: "Quelle est la dernière chose qui t'a fait rire aux éclats ?", en: "What's the last thing that made you laugh out loud?" },
  { fr: "Quel temps fait-il chez toi et ça te met dans quelle humeur ?", en: "What's the weather like where you are and how does it make you feel?" },
  { fr: "Qu'est-ce que tu portes là tout de suite ?", en: "What are you wearing right now?" },
  { fr: "Quelle est ta boisson chaude réconfortante préférée ?", en: "What's your favorite comforting hot drink?" },

  // --- Goûts / favoris ---
  { fr: "Quel est ton plat préféré que tu aimerais qu'on cuisine ensemble ?", en: "What dish would you love us to cook together?" },
  { fr: "Quelle chanson te fait penser à moi ?", en: "What song reminds you of me?" },
  { fr: "Quel film aimerais-tu qu'on regarde collés l'un à l'autre ?", en: "What movie would you love to watch cuddled up together?" },
  { fr: "Quelle est ta destination de voyage de rêve avec moi ?", en: "What's your dream travel destination with me?" },
  { fr: "Quel est ton endroit préféré au monde ?", en: "What's your favorite place in the world?" },
  { fr: "Quelle saison te fait le plus penser à nous ?", en: "Which season reminds you most of us?" },
  { fr: "Quelle odeur te rappelle un bon souvenir avec moi ?", en: "What smell reminds you of a good memory with me?" },
  { fr: "Quel est ton dessert préféré ?", en: "What's your favorite dessert?" },
  { fr: "Quelle est ta façon préférée de te détendre ?", en: "What's your favorite way to relax?" },
  { fr: "Quel livre ou quelle histoire t'a marqué(e) ?", en: "What book or story has stuck with you?" },
  { fr: "Si tu pouvais maîtriser un talent instantanément, lequel ?", en: "If you could instantly master one skill, which one?" },
  { fr: "Quelle est ta fête ou ta période préférée de l'année ?", en: "What's your favorite holiday or time of year?" },
  { fr: "Quel plat de ton enfance te réconforte le plus ?", en: "What childhood dish comforts you most?" },

  // --- Imagination / hypothétiques ---
  { fr: "Si on pouvait être ensemble n'importe où là maintenant, où serait-on ?", en: "If we could be together anywhere right now, where would we be?" },
  { fr: "Si on gagnait au loto demain, qu'est-ce qu'on ferait en premier ?", en: "If we won the lottery tomorrow, what would we do first?" },
  { fr: "Si tu pouvais me téléporter à toi pour une heure, on ferait quoi ?", en: "If you could teleport me to you for one hour, what would we do?" },
  { fr: "Si on écrivait un livre sur notre histoire, quel serait le titre ?", en: "If we wrote a book about our story, what would the title be?" },
  { fr: "Si tu devais m'offrir n'importe quoi, ce serait quoi ?", en: "If you could give me anything, what would it be?" },
  { fr: "Si on avait une journée entière ensemble sans contrainte, on ferait quoi ?", en: "If we had a whole free day together, what would we do?" },
  { fr: "Si on pouvait revivre un de nos moments, lequel choisirais-tu ?", en: "If we could relive one of our moments, which would you choose?" },
  { fr: "Si tu pouvais dîner avec n'importe qui ce soir, qui choisirais-tu (à part moi) ?", en: "If you could have dinner with anyone tonight, who would you pick (besides me)?" },
  { fr: "Si notre amour était une chanson, ce serait laquelle ?", en: "If our love were a song, which one would it be?" },
  { fr: "Si tu pouvais m'emmener dans ton endroit préféré, ce serait où ?", en: "If you could take me to your favorite place, where would it be?" },

  // --- Distance / manque ---
  { fr: "Qu'est-ce qui te manque le plus quand on est loin ?", en: "What do you miss most when we're apart?" },
  { fr: "Qu'est-ce qui te réconforte quand je ne suis pas là ?", en: "What comforts you when I'm not there?" },
  { fr: "Comment gères-tu les jours où je te manque trop ?", en: "How do you cope on days you miss me too much?" },
  { fr: "Qu'est-ce qui te redonne le sourire quand la distance est dure ?", en: "What brings your smile back when the distance is hard?" },
  { fr: "Quelle habitude as-tu prise qui te fait penser à moi ?", en: "What habit have you picked up that makes you think of me?" },
  { fr: "Qu'est-ce que tu veux qu'on fasse plus souvent malgré la distance ?", en: "What do you want us to do more often despite the distance?" },
  { fr: "À quel moment de la journée penses-tu le plus à moi ?", en: "What time of day do you think of me most?" },

  // --- Drôles / légères ---
  { fr: "Quel surnom ridicule pourrais-tu me donner ?", en: "What ridiculous nickname could you give me?" },
  { fr: "Quel est ton talent caché le plus inutile ?", en: "What's your most useless hidden talent?" },
  { fr: "Quelle est la chose la plus bizarre que tu aimes manger ?", en: "What's the weirdest thing you love to eat?" },
  { fr: "Si j'étais un animal, lequel serais-je selon toi ?", en: "If I were an animal, which one would I be?" },
  { fr: "Quelle est ta plus grande maladresse récente ?", en: "What's your most recent clumsy moment?" },
  { fr: "Quel emoji me représente le mieux ?", en: "What emoji represents me best?" },
  { fr: "Quelle chanson honteuse connais-tu par cœur ?", en: "What guilty-pleasure song do you know by heart?" },
  { fr: "Si on était un duo célèbre, lequel serait-on ?", en: "If we were a famous duo, which one would we be?" },
  { fr: "Quel est ton pire défaut que tu assumes complètement ?", en: "What's your worst flaw that you fully own?" },
  { fr: "Quelle nourriture pourrais-tu manger tous les jours sans t'en lasser ?", en: "What food could you eat every day without getting tired of it?" },

  // --- Tendres / quotidien du couple ---
  { fr: "Qu'est-ce que tu aimes faire le dimanche matin ?", en: "What do you love doing on Sunday mornings?" },
  { fr: "Quel est ton surnom préféré que je te donne ?", en: "What's your favorite nickname I give you?" },
  { fr: "Que ferais-tu si on était ensemble ce soir ?", en: "What would you do if we were together tonight?" },
  { fr: "Quel film veux-tu absolument qu'on regarde ensemble bientôt ?", en: "What movie do you really want us to watch together soon?" },
  { fr: "Quelle est la première chose que tu remarques sur une photo de moi ?", en: "What's the first thing you notice in a photo of me?" },
  { fr: "Qu'est-ce qui te ferait te sentir choyé(e) là maintenant ?", en: "What would make you feel pampered right now?" },
  { fr: "Quel petit rituel à deux aimerais-tu qu'on garde pour toujours ?", en: "What little couple ritual would you love us to keep forever?" },
  { fr: "Qu'est-ce que tu trouves attachant chez moi même si c'est un défaut ?", en: "What do you find endearing about me even if it's a flaw?" },
  { fr: "Comment aimerais-tu qu'on passe notre prochain appel ?", en: "How would you like us to spend our next call?" },
  { fr: "Qu'est-ce que tu veux que je te dise plus souvent ?", en: "What do you want me to tell you more often?" },
  { fr: "Quel a été le meilleur compliment que je t'aie fait ?", en: "What's the best compliment I've given you?" },
  { fr: "Qu'est-ce qui te ferait te sentir spécial(e) aujourd'hui ?", en: "What would make you feel special today?" },
  // --- Lot bonus 2 ---
  // Intimité / complicité
  { fr: "Quel est ton fantasme de soirée parfaite à deux ?", en: "What's your fantasy of a perfect night together?" },
  { fr: "Qu'est-ce qui te fait craquer instantanément chez moi ?", en: "What instantly makes you weak for me?" },
  { fr: "Quel est ton souvenir le plus passionné avec moi ?", en: "What's your most passionate memory with me?" },
  { fr: "Qu'est-ce que tu adores qu'on fasse rien qu'à deux ?", en: "What do you love doing just the two of us?" },
  { fr: "Quel moment d'intimité te manque le plus ?", en: "What intimate moment do you miss the most?" },
  { fr: "Qu'est-ce qui te rend irrésistiblement attiré(e) par moi ?", en: "What makes you irresistibly drawn to me?" },
  { fr: "Quel est le baiser dont tu te souviens le mieux ?", en: "Which kiss do you remember best?" },
  { fr: "Comment aimes-tu qu'on se réveille un matin ensemble ?", en: "How do you love us waking up together in the morning?" },
  { fr: "Quel détail de notre intimité te fait sourire en y repensant ?", en: "What detail of our intimacy makes you smile when you think back?" },
  { fr: "Qu'est-ce que tu veux qu'on essaie ensemble un jour ?", en: "What do you want us to try together someday?" },

  // Apprendre à se connaître
  { fr: "Quelle est ta plus grande qualité que les gens ne voient pas tout de suite ?", en: "What's your greatest quality people don't see right away?" },
  { fr: "Quel est ton péché mignon ?", en: "What's your guilty pleasure?" },
  { fr: "Qu'est-ce qui te met de bonne humeur à coup sûr ?", en: "What always puts you in a good mood?" },
  { fr: "Quelle est ta plus grande source de stress en ce moment ?", en: "What's your biggest source of stress right now?" },
  { fr: "Comment recharges-tu tes batteries ?", en: "How do you recharge your batteries?" },
  { fr: "Quel est ton plus beau trait de caractère selon tes proches ?", en: "What's your best personality trait according to your loved ones?" },
  { fr: "Qu'est-ce que tu n'oserais avouer qu'à moi ?", en: "What would you only dare admit to me?" },
  { fr: "Quelle est ta plus grande ambition cette année ?", en: "What's your biggest ambition this year?" },
  { fr: "Quel défaut chez les autres ne supportes-tu pas ?", en: "What flaw in others can't you stand?" },
  { fr: "Quelle est la dernière fois que tu as pleuré et pourquoi ?", en: "When was the last time you cried and why?" },
  { fr: "Qu'est-ce qui te rend nostalgique ?", en: "What makes you nostalgic?" },
  { fr: "Quel est ton rapport au temps : plutôt en avance ou en retard ?", en: "Are you usually early or late?" },
  { fr: "Qu'est-ce que tu fais quand personne ne te regarde ?", en: "What do you do when no one's watching?" },

  // Nous, encore
  { fr: "Quelle est la chose la plus gentille que j'aie faite pour toi ?", en: "What's the kindest thing I've done for you?" },
  { fr: "Qu'est-ce que tu veux qu'on n'oublie jamais de notre histoire ?", en: "What do you never want us to forget about our story?" },
  { fr: "Quel moment t'a fait penser 'c'est lui/elle, la bonne personne' ?", en: "What moment made you think 'this is the one'?" },
  { fr: "Qu'est-ce que notre relation t'apporte que tu n'avais jamais eu ?", en: "What does our relationship give you that you never had before?" },
  { fr: "Quelle est ta plus grande peur concernant nous ?", en: "What's your biggest fear about us?" },
  { fr: "Comment sais-tu que je tiens à toi ?", en: "How do you know I care about you?" },
  { fr: "Qu'est-ce qui te rassure quand tu doutes ?", en: "What reassures you when you doubt?" },
  { fr: "Quel est notre point commun que tu adores ?", en: "What's something we have in common that you love?" },
  { fr: "Quelle différence entre nous trouves-tu attachante ?", en: "What difference between us do you find endearing?" },
  { fr: "Si tu devais résumer notre amour en une image, laquelle ?", en: "If you had to sum up our love in one image, what would it be?" },
  { fr: "Qu'est-ce que tu as hâte de vivre avec moi que tu n'as pas encore vécu ?", en: "What are you excited to experience with me that you haven't yet?" },

  // Voyages / aventures
  { fr: "Quel pays rêves-tu de découvrir avec moi en premier ?", en: "What country do you dream of discovering with me first?" },
  { fr: "Plutôt road trip ou séjour tout confort ?", en: "Road trip or all-inclusive stay?" },
  { fr: "Quelle aventure un peu folle aimerais-tu qu'on tente ?", en: "What slightly crazy adventure would you love us to try?" },
  { fr: "Quelle ville t'a le plus marqué(e) dans ta vie ?", en: "What city has marked you the most in your life?" },
  { fr: "Mer, montagne ou ville pour nos vacances de rêve ?", en: "Sea, mountains, or city for our dream vacation?" },
  { fr: "Quel plat local rêves-tu de goûter en voyage avec moi ?", en: "What local dish do you dream of tasting while traveling with me?" },
  { fr: "Si on partait demain sans rien prévoir, où irais-tu ?", en: "If we left tomorrow with no plan, where would you go?" },

  // Valeurs / vie
  { fr: "Qu'est-ce qui te rend reconnaissant(e) aujourd'hui ?", en: "What are you grateful for today?" },
  { fr: "Quelle valeur est non négociable pour toi ?", en: "What value is non-negotiable for you?" },
  { fr: "Comment veux-tu qu'on se soutienne dans les moments durs ?", en: "How do you want us to support each other in hard times?" },
  { fr: "Quelle est ta définition du bonheur ?", en: "What's your definition of happiness?" },
  { fr: "Qu'est-ce qui te donne le sentiment de réussir ta vie ?", en: "What gives you the feeling of a successful life?" },
  { fr: "Qu'est-ce que tu veux accomplir avant tes 40 ans ?", en: "What do you want to accomplish before you turn 40?" },
  { fr: "Quelle leçon de vie aimerais-tu transmettre un jour ?", en: "What life lesson would you like to pass on someday?" },
  { fr: "Qu'est-ce qui compte plus pour toi : la liberté ou la sécurité ?", en: "What matters more to you: freedom or security?" },

  // Légères et fun
  { fr: "Quel super-pouvoir choisirais-tu et pourquoi ?", en: "What superpower would you choose and why?" },
  { fr: "Quel plat es-tu incapable de réussir en cuisine ?", en: "What dish can you never get right in the kitchen?" },
  { fr: "Quelle est ta réplique de film préférée ?", en: "What's your favorite movie line?" },
  { fr: "Si tu étais un dessert, lequel serais-tu ?", en: "If you were a dessert, which would you be?" },
  { fr: "Quelle est la dépense la plus inutile que tu aies faite ?", en: "What's the most useless thing you've ever bought?" },
  { fr: "Quel est ton karaoké de prédilection ?", en: "What's your go-to karaoke song?" },
  { fr: "Plutôt lève-tôt ou couche-tard ?", en: "Early bird or night owl?" },
  { fr: "Quelle est ta manie quand tu réfléchis ?", en: "What's your quirk when you're thinking?" },
  { fr: "Quel objet ne quitte jamais ton sac ou ta poche ?", en: "What item never leaves your bag or pocket?" },
  { fr: "Quel est ton goûter régressif préféré ?", en: "What's your favorite childhood-style snack?" },
  { fr: "Si tu pouvais dîner dans n'importe quel film, lequel ?", en: "If you could have dinner inside any movie, which one?" },
  { fr: "Quelle chanson te donne envie de danser à coup sûr ?", en: "What song always makes you want to dance?" },
  { fr: "Quel est le truc le plus enfantin que tu aimes encore faire ?", en: "What's the most childish thing you still love doing?" },

  // Souvenirs d'enfance / passé
  { fr: "Quel était ton rêve de métier quand tu étais petit(e) ?", en: "What did you want to be when you were little?" },
  { fr: "Quel est ton plus beau souvenir d'enfance ?", en: "What's your best childhood memory?" },
  { fr: "Quelle odeur te ramène directement en enfance ?", en: "What smell takes you straight back to childhood?" },
  { fr: "Quel dessin animé ou film as-tu regardé en boucle petit(e) ?", en: "What cartoon or movie did you watch on repeat as a kid?" },
  { fr: "Qui était ton modèle quand tu étais jeune ?", en: "Who was your role model when you were young?" },
  { fr: "Quelle bêtise d'enfant te fait encore rire ?", en: "What childhood mischief still makes you laugh?" },
  { fr: "Quel goût te rappelle les vacances de ton enfance ?", en: "What taste reminds you of your childhood holidays?" },

  // Projets à deux concrets
  { fr: "Quel projet aimerais-tu qu'on lance ensemble cette année ?", en: "What project would you love us to start together this year?" },
  { fr: "Qu'est-ce qu'on devrait planifier dès maintenant pour nos retrouvailles ?", en: "What should we plan right now for our reunion?" },
  { fr: "Quel hobby aimerais-tu qu'on partage ?", en: "What hobby would you love us to share?" },
  { fr: "Quelle compétence aimerais-tu qu'on apprenne ensemble ?", en: "What skill would you love us to learn together?" },
  { fr: "Quel défi de couple aimerais-tu qu'on se lance ce mois-ci ?", en: "What couple challenge would you love us to take this month?" },
  { fr: "Qu'est-ce qu'on pourrait faire chacun de notre côté en même temps ?", en: "What could we do at the same time, each on our own side?" },
  { fr: "Quel rendez-vous virtuel original aimerais-tu qu'on organise ?", en: "What original virtual date would you love us to set up?" },

  // Émotions / connexion
  { fr: "Qu'est-ce qui te fait te sentir compris(e) par moi ?", en: "What makes you feel understood by me?" },
  { fr: "Quand t'ai-je rendu(e) le plus fier(e) ?", en: "When have I made you proudest?" },
  { fr: "Qu'est-ce que tu aimerais que je comprenne mieux de toi ?", en: "What would you like me to understand better about you?" },
  { fr: "Comment préfères-tu être réconforté(e) quand ça ne va pas ?", en: "How do you prefer to be comforted when you're down?" },
  { fr: "Qu'est-ce qui te touche le plus dans un geste d'amour ?", en: "What touches you most in a loving gesture?" },
  { fr: "Quelle émotion as-tu du mal à exprimer ?", en: "What emotion do you struggle to express?" },
  { fr: "Qu'est-ce que tu ressens quand tu vois mon prénom s'afficher sur ton téléphone ?", en: "What do you feel when you see my name pop up on your phone?" },
  { fr: "Quand t'es-tu senti(e) le plus en sécurité avec moi ?", en: "When did you feel safest with me?" },

  // Imaginaire / rêverie
  { fr: "Si on avait une maison de rêve, quelle serait LA pièce qu'on adorerait ?", en: "If we had a dream house, what would be THE room we'd love?" },
  { fr: "Si on pouvait s'endormir ensemble ce soir, comment serait ce moment ?", en: "If we could fall asleep together tonight, what would that moment be like?" },
  { fr: "Si notre relation était un film, quel en serait le genre ?", en: "If our relationship were a movie, what genre would it be?" },
  { fr: "Si tu pouvais m'offrir une journée entière, à quoi ressemblerait-elle ?", en: "If you could give me a whole day, what would it look like?" },
  { fr: "Si on vieillissait ensemble, à quoi ressemblerait notre quotidien à 70 ans ?", en: "If we grew old together, what would our daily life look like at 70?" },
  { fr: "Si tu pouvais m'envoyer un objet là maintenant, lequel ?", en: "If you could send me one object right now, what would it be?" },
  { fr: "Si on avait un lieu secret rien qu'à nous, à quoi ressemblerait-il ?", en: "If we had a secret place just for us, what would it look like?" },

  // Quotidien tendre
  { fr: "Qu'est-ce qui te ferait du bien à entendre là maintenant ?", en: "What would feel good to hear right now?" },
  { fr: "Quelle est la dernière chose qui t'a ému(e) ?", en: "What's the last thing that moved you?" },
  { fr: "Qu'est-ce que tu attends avec impatience cette semaine ?", en: "What are you looking forward to this week?" },
  { fr: "Comment puis-je te rendre la journée plus douce aujourd'hui ?", en: "How can I make your day softer today?" },
  { fr: "Qu'est-ce que tu aimerais qu'on fasse lors de notre prochain appel ?", en: "What would you like us to do on our next call?" },
  { fr: "Quel petit bonheur as-tu vécu aujourd'hui ?", en: "What small joy did you have today?" },
  { fr: "Qu'est-ce qui te rendrait fier(e) de toi cette semaine ?", en: "What would make you proud of yourself this week?" },
  { fr: "Quelle est la prochaine chose sympa sur ta to-do list ?", en: "What's the next fun thing on your to-do list?" },
  { fr: "Si je pouvais t'apporter une chose là maintenant, qu'est-ce qui te ferait plaisir ?", en: "If I could bring you one thing right now, what would make you happy?" },
  { fr: "Quel moment de notre journée d'aujourd'hui aimerais-tu rejouer ?", en: "What moment from our day today would you love to replay?" },

  // Drôles / jeux
  { fr: "Si on devait se déguiser en duo pour Halloween, en quoi ?", en: "If we had to dress as a duo for Halloween, as what?" },
  { fr: "Quel surnom gênant tes parents te donnaient-ils ?", en: "What embarrassing nickname did your parents give you?" },
  { fr: "Quelle est la chose la plus ringarde que tu adores ?", en: "What's the cheesiest thing you secretly love?" },
  { fr: "Si tu pouvais manger un seul plat à vie, lequel ?", en: "If you could eat only one dish for life, which one?" },
  { fr: "Quel talent inutile aimerais-tu avoir ?", en: "What useless talent would you love to have?" },
  { fr: "Quelle est ta plus grande peur irrationnelle ?", en: "What's your biggest irrational fear?" },
  { fr: "Si on avait un groupe de musique, ça s'appellerait comment ?", en: "If we had a band, what would it be called?" },
  { fr: "Quel est le pire film que tu aies adoré quand même ?", en: "What's the worst movie you loved anyway?" },
  // --- Lot bonus 3 ---
  // Communication & relation
  { fr: "Qu'est-ce que je fais qui te fait te sentir prioritaire ?", en: "What do I do that makes you feel like a priority?" },
  { fr: "Comment préfères-tu qu'on règle nos désaccords ?", en: "How do you prefer we handle our disagreements?" },
  { fr: "Quelle est la plus belle preuve d'amour qu'on puisse te donner ?", en: "What's the most beautiful proof of love someone can give you?" },
  { fr: "Qu'est-ce que tu aimerais qu'on se dise plus souvent ?", en: "What would you like us to say to each other more often?" },
  { fr: "Comment veux-tu qu'on garde la flamme malgré la distance ?", en: "How do you want us to keep the spark despite the distance?" },
  { fr: "Quel est ton langage de l'amour principal ?", en: "What's your main love language?" },
  { fr: "Qu'est-ce qui te fait te sentir écouté(e) par moi ?", en: "What makes you feel heard by me?" },
  { fr: "Quelle petite attention te touche le plus ?", en: "What small gesture touches you the most?" },
  { fr: "Comment sais-tu que tu peux me faire confiance ?", en: "How do you know you can trust me?" },
  { fr: "Qu'est-ce que tu apprécies le plus dans notre façon de communiquer ?", en: "What do you appreciate most about how we communicate?" },

  // Toi en profondeur
  { fr: "De quoi es-tu le/la plus fier(e) cette année ?", en: "What are you most proud of this year?" },
  { fr: "Quel est ton plus grand regret, si tu en as un ?", en: "What's your biggest regret, if you have one?" },
  { fr: "Qu'est-ce qui te fait te sentir puissant(e) ?", en: "What makes you feel powerful?" },
  { fr: "Quelle partie de ta personnalité aimerais-tu développer ?", en: "What part of your personality would you like to grow?" },
  { fr: "Qu'est-ce que tu fais quand tu te sens dépassé(e) ?", en: "What do you do when you feel overwhelmed?" },
  { fr: "Quel compliment te touche le plus à recevoir ?", en: "What compliment touches you most to receive?" },
  { fr: "Quelle est la décision la plus courageuse que tu aies prise ?", en: "What's the bravest decision you've ever made?" },
  { fr: "Qu'est-ce qui te donne confiance en toi ?", en: "What gives you self-confidence?" },
  { fr: "Quel trait de ta famille retrouves-tu en toi ?", en: "What family trait do you see in yourself?" },
  { fr: "Qu'est-ce qui te passionne au point d'en oublier l'heure ?", en: "What are you so passionate about that you lose track of time?" },
  { fr: "Quelle est ta plus grande qualité en amour ?", en: "What's your greatest quality in love?" },
  { fr: "Qu'est-ce que tu aimerais que les gens sachent de toi ?", en: "What would you like people to know about you?" },

  // Le quotidien ensemble (futur)
  { fr: "Qui ferait la cuisine et qui ferait la vaisselle chez nous ?", en: "Who'd cook and who'd do the dishes at our place?" },
  { fr: "Comment décorerait-on notre premier appartement ?", en: "How would we decorate our first apartment?" },
  { fr: "Quel serait notre rituel du soir en couple ?", en: "What would our evening couple ritual be?" },
  { fr: "Quel petit-déjeuner te préparerais-je le week-end ?", en: "What breakfast would I make you on weekends?" },
  { fr: "Quel film regarderait-on systématiquement à Noël ?", en: "What movie would we always watch at Christmas?" },
  { fr: "Comment occuperait-on un dimanche pluvieux ensemble ?", en: "How would we spend a rainy Sunday together?" },
  { fr: "Quelle serait notre dispute la plus probable sur la déco ?", en: "What would our most likely argument about decor be?" },
  { fr: "Qui serait le/la plus matinal(e) de nous deux ?", en: "Who'd be the early riser between us?" },
  { fr: "Quel plat deviendrait notre spécialité maison ?", en: "What dish would become our house specialty?" },

  // Préférerais-tu (suite)
  { fr: "Préférerais-tu un mariage intime ou une grande fête ?", en: "Would you rather an intimate wedding or a big party?" },
  { fr: "Vivre au bord de la mer ou en pleine nature ?", en: "Live by the sea or in the heart of nature?" },
  { fr: "Préférerais-tu voyager léger ou avoir tout le confort ?", en: "Would you rather travel light or have all the comfort?" },
  { fr: "Un chien ou un chat pour commencer ?", en: "A dog or a cat to start with?" },
  { fr: "Préférerais-tu un café tranquille ou un brunch animé ?", en: "Would you rather a quiet coffee or a lively brunch?" },
  { fr: "Plutôt nuit étoilée ou aurore boréale ensemble ?", en: "Starry night or northern lights together?" },
  { fr: "Préférerais-tu qu'on s'écrive de longues lettres ou des messages courts toute la journée ?", en: "Would you rather we write long letters or short messages all day?" },
  { fr: "Soirée jeux de société ou soirée film ?", en: "Board game night or movie night?" },
  { fr: "Préférerais-tu vivre un grand amour passionnel ou un amour doux et stable (avec moi tu as les deux) ?", en: "Would you rather a passionate love or a soft, steady one (with me you get both)?" },

  // Émotions & tendresse
  { fr: "Qu'est-ce qui t'a fait te sentir aimé(e) cette semaine ?", en: "What made you feel loved this week?" },
  { fr: "Quand penses-tu à moi sans raison particulière ?", en: "When do you think of me for no particular reason?" },
  { fr: "Qu'est-ce que tu ressens quand on raccroche après un long appel ?", en: "What do you feel when we hang up after a long call?" },
  { fr: "Quelle chanson te fait pleurer en pensant à nous ?", en: "What song makes you cry thinking about us?" },
  { fr: "Qu'est-ce qui te donne espoir pour notre avenir ?", en: "What gives you hope for our future?" },
  { fr: "Quel mot doux aimerais-tu entendre là maintenant ?", en: "What sweet word would you love to hear right now?" },
  { fr: "Qu'est-ce qui rend la distance supportable pour toi ?", en: "What makes the distance bearable for you?" },
  { fr: "Quel est ton moment préféré dans une journée où on se parle ?", en: "What's your favorite moment in a day when we talk?" },

  // Hypothétiques fun
  { fr: "Si on était bloqués sur une île déserte, qu'emporterais-tu ?", en: "If we were stuck on a desert island, what would you bring?" },
  { fr: "Si tu pouvais figer le temps une journée, on ferait quoi ?", en: "If you could freeze time for a day, what would we do?" },
  { fr: "Si on échangeait nos vies une journée, qu'est-ce qui te surprendrait ?", en: "If we swapped lives for a day, what would surprise you?" },
  { fr: "Si tu pouvais voir un seul jour de notre futur, lequel choisirais-tu ?", en: "If you could see one day of our future, which would you choose?" },
  { fr: "Si on gagnait un voyage gratuit demain, on partirait où ?", en: "If we won a free trip tomorrow, where would we go?" },
  { fr: "Si tu pouvais me faire découvrir une chose de ta culture, ce serait quoi ?", en: "If you could show me one thing from your culture, what would it be?" },
  { fr: "Si on avait un restaurant ensemble, on servirait quoi ?", en: "If we had a restaurant together, what would we serve?" },
  { fr: "Si tu pouvais me téléporter ton plat préféré, lequel m'enverrais-tu ?", en: "If you could teleport me your favorite dish, which would you send?" },

  // Découverte mutuelle culturelle (couple international)
  { fr: "Quelle tradition de ton pays aimerais-tu me faire vivre ?", en: "What tradition from your country would you love me to experience?" },
  { fr: "Quel mot dans ta langue trouves-tu intraduisible et beau ?", en: "What word in your language do you find untranslatable and beautiful?" },
  { fr: "Quel plat typique de chez toi veux-tu absolument me faire goûter ?", en: "What typical dish from your home do you absolutely want me to try?" },
  { fr: "Quelle fête de ton pays aimerais-tu qu'on célèbre ensemble ?", en: "What holiday from your country would you love us to celebrate together?" },
  { fr: "Qu'est-ce qui te manque le plus de chez toi quand tu es loin ?", en: "What do you miss most from home when you're away?" },
  { fr: "Quel endroit de ta région rêves-tu de me montrer ?", en: "What place in your area do you dream of showing me?" },
  { fr: "Quelle chanson de ton enfance aimerais-tu me faire écouter ?", en: "What song from your childhood would you love me to hear?" },

  // Légères du jour
  { fr: "Quelle est la meilleure chose qui te soit arrivée aujourd'hui ?", en: "What's the best thing that happened to you today?" },
  { fr: "Qu'as-tu prévu de sympa bientôt ?", en: "What fun thing do you have coming up soon?" },
  { fr: "Quelle est ta humeur en trois emojis ?", en: "What's your mood in three emojis?" },
  { fr: "Qu'est-ce que tu écoutes en ce moment ?", en: "What are you listening to right now?" },
  { fr: "Quel a été ton repas préféré aujourd'hui ?", en: "What was your favorite meal today?" },
  { fr: "Qu'est-ce qui t'a fait penser à moi aujourd'hui ?", en: "What made you think of me today?" },
  { fr: "Comment décrirais-tu ta journée en un mot ?", en: "How would you describe your day in one word?" },
  { fr: "Quel est ton plan pour ce soir ?", en: "What's your plan for tonight?" },
  { fr: "Qu'est-ce qui te ferait sourire là maintenant ?", en: "What would make you smile right now?" },
  { fr: "Quelle petite victoire as-tu eue aujourd'hui ?", en: "What small win did you have today?" },

  // Rêves & ambitions
  { fr: "Quel est le voyage de toute une vie pour toi ?", en: "What's the trip of a lifetime for you?" },
  { fr: "Qu'est-ce que tu veux absolument réaliser avant de mourir ?", en: "What do you absolutely want to achieve before you die?" },
  { fr: "Quel métier aurais-tu adoré faire dans une autre vie ?", en: "What job would you have loved in another life?" },
  { fr: "Si l'argent n'existait pas, que ferais-tu de tes journées ?", en: "If money didn't exist, what would you do with your days?" },
  { fr: "Quel rêve as-tu mis de côté que tu aimerais raviver ?", en: "What dream have you set aside that you'd love to revive?" },
  { fr: "Qu'est-ce que tu veux apprendre cette année ?", en: "What do you want to learn this year?" },
  { fr: "Où te vois-tu vivre idéalement dans 10 ans ?", en: "Where do you ideally see yourself living in 10 years?" },
  { fr: "Quelle cause te tient vraiment à cœur ?", en: "What cause really matters to you?" },

  // Intimité & complicité (suite)
  { fr: "Qu'est-ce qui te rend complètement à l'aise avec moi ?", en: "What makes you completely at ease with me?" },
  { fr: "Quel est ton moment de tendresse préféré avec moi ?", en: "What's your favorite tender moment with me?" },
  { fr: "Comment aimes-tu qu'on se dise bonne nuit ?", en: "How do you like us to say goodnight?" },
  { fr: "Qu'est-ce qui te fait te sentir désiré(e) ?", en: "What makes you feel desired?" },
  { fr: "Quel petit geste à distance te fait fondre ?", en: "What small long-distance gesture melts you?" },
  { fr: "Qu'est-ce que tu adores qu'on se murmure ?", en: "What do you love us whispering to each other?" },
  { fr: "Quel souvenir de câlin avec moi chéris-tu ?", en: "What cuddle memory with me do you cherish?" },
  { fr: "Comment aimerais-tu que je t'accueille à l'aéroport ?", en: "How would you like me to greet you at the airport?" },

  // Notre histoire / méta
  { fr: "Quel chapitre de notre histoire préfères-tu jusqu'ici ?", en: "What chapter of our story is your favorite so far?" },
  { fr: "Qu'est-ce qui te fait dire qu'on est faits l'un pour l'autre ?", en: "What makes you say we're made for each other?" },
  { fr: "Quel surnom donnerais-tu à notre amour ?", en: "What nickname would you give our love?" },
  { fr: "Qu'est-ce que tu raconterais de nous à nos petits-enfants ?", en: "What would you tell our grandchildren about us?" },
  { fr: "Quelle date de notre relation veux-tu qu'on célèbre chaque année ?", en: "What date from our relationship do you want us to celebrate every year?" },
  { fr: "Quel moment de notre rencontre rejouerais-tu ?", en: "What moment from when we met would you replay?" },
  { fr: "Si notre amour avait une couleur, laquelle serait-ce ?", en: "If our love had a color, what would it be?" },
  { fr: "Qu'est-ce qui te rend certain(e) de nous ?", en: "What makes you certain about us?" },

  // Pour rire
  { fr: "Quelle est ta danse la plus embarrassante ?", en: "What's your most embarrassing dance move?" },
  { fr: "Quel aliment détestes-tu au point de le bannir ?", en: "What food do you hate enough to ban it?" },
  { fr: "Quelle est la dernière vidéo qui t'a fait rire ?", en: "What's the last video that made you laugh?" },
  { fr: "Si tu étais une saison, laquelle serais-tu ?", en: "If you were a season, which would you be?" },
  { fr: "Quel est ton talent secret pour impressionner ?", en: "What's your secret talent to impress?" },
  { fr: "Quelle habitude de moi te fait lever les yeux au ciel (gentiment) ?", en: "What habit of mine makes you roll your eyes (sweetly)?" },
  { fr: "Quel surnom d'animal te correspondrait le mieux ?", en: "What animal nickname would suit you best?" },
  { fr: "Si on avait un podcast ensemble, de quoi on parlerait ?", en: "If we had a podcast together, what would we talk about?" },
  // --- Lot bonus 4 ---
  // Ce jour / instantané
  { fr: "Qu'est-ce que tu vois autour de toi là tout de suite ?", en: "What do you see around you right now?" },
  { fr: "Quelle est la dernière photo dans ta galerie ?", en: "What's the last photo in your gallery?" },
  { fr: "Quel goût as-tu dans la bouche là maintenant ?", en: "What taste do you have in your mouth right now?" },
  { fr: "Quelle est la première chose que tu feras en te levant demain ?", en: "What's the first thing you'll do when you wake up tomorrow?" },
  { fr: "Quel son entends-tu autour de toi ?", en: "What sound do you hear around you?" },
  { fr: "Comment te sens-tu physiquement en ce moment ?", en: "How do you feel physically right now?" },
  { fr: "Quelle est la dernière personne à qui tu as parlé avant moi ?", en: "Who's the last person you talked to before me?" },
  { fr: "Qu'est-ce que tu remets toujours à demain ?", en: "What do you always put off until tomorrow?" },

  // Préférences profondes
  { fr: "Qu'est-ce qui te fait te sentir vraiment toi-même ?", en: "What makes you feel truly yourself?" },
  { fr: "Quel est le compliment que tu n'oublieras jamais ?", en: "What's the compliment you'll never forget?" },
  { fr: "Quelle musique te met les larmes aux yeux ?", en: "What music brings tears to your eyes?" },
  { fr: "Qu'est-ce qui te fait te sentir chez toi ?", en: "What makes you feel at home?" },
  { fr: "Quel est le plus beau cadeau que tu aies reçu ?", en: "What's the best gift you've ever received?" },
  { fr: "Quelle est ta façon préférée de montrer que tu aimes ?", en: "What's your favorite way to show love?" },
  { fr: "Qu'est-ce qui te rend instantanément calme ?", en: "What instantly calms you down?" },
  { fr: "Quel lieu te fait te sentir en paix ?", en: "What place makes you feel at peace?" },

  // Nous deux (encore et toujours)
  { fr: "Quel est le plus beau message que je t'aie envoyé ?", en: "What's the most beautiful message I've sent you?" },
  { fr: "Qu'est-ce que tu veux qu'on fasse ensemble avant la fin de l'année ?", en: "What do you want us to do together before the year ends?" },
  { fr: "Quelle est la chose la plus douce que je t'aie dite ?", en: "What's the sweetest thing I've said to you?" },
  { fr: "Qu'est-ce qui te fait te sentir choisi(e) par moi chaque jour ?", en: "What makes you feel chosen by me every day?" },
  { fr: "Quel rêve as-tu pour nous que tu n'as jamais osé dire ?", en: "What dream do you have for us that you've never dared to say?" },
  { fr: "Qu'est-ce que tu veux que je sache sur ce que tu ressens en ce moment ?", en: "What do you want me to know about how you feel right now?" },
  { fr: "Quel est ton moment préféré quand on se retrouve enfin ?", en: "What's your favorite moment when we finally reunite?" },
  { fr: "Comment as-tu changé depuis qu'on est ensemble ?", en: "How have you changed since we got together?" },
  { fr: "Quelle est la promesse silencieuse que tu te fais à propos de nous ?", en: "What silent promise do you make to yourself about us?" },
  { fr: "Qu'est-ce qui te rend reconnaissant(e) de m'avoir rencontré(e) ?", en: "What makes you grateful you met me?" },

  // Futur lointain & engagement
  { fr: "Comment imagines-tu notre dixième anniversaire ?", en: "How do you picture our tenth anniversary?" },
  { fr: "Qu'est-ce qu'on regardera en arrière avec le plus de fierté ?", en: "What will we look back on with the most pride?" },
  { fr: "Quel genre de parents penses-tu qu'on serait ?", en: "What kind of parents do you think we'd be?" },
  { fr: "Quelle maison de vacances rêverais-tu qu'on ait un jour ?", en: "What vacation home would you dream of us having someday?" },
  { fr: "Comment veux-tu qu'on vieillisse ensemble ?", en: "How do you want us to grow old together?" },
  { fr: "Quelle aventure veux-tu absolument vivre avec moi avant 30 ans ?", en: "What adventure do you absolutely want to live with me before 30?" },
  { fr: "Qu'est-ce qu'on devrait s'autoriser à faire plus souvent ?", en: "What should we allow ourselves to do more often?" },

  // Légères & ludiques
  { fr: "Quel est ton émission de télé coupable préférée ?", en: "What's your favorite guilty-pleasure TV show?" },
  { fr: "Si tu pouvais avoir un animal exotique, lequel ?", en: "If you could have an exotic pet, which one?" },
  { fr: "Quelle est la pire mode que tu aies suivie ?", en: "What's the worst fashion trend you followed?" },
  { fr: "Quel jeu vidéo ou jeu de société pourrais-tu jouer des heures ?", en: "What video game or board game could you play for hours?" },
  { fr: "Quelle est ta plus grande peur en montagnes russes ?", en: "What's your biggest fear on roller coasters?" },
  { fr: "Si tu étais un personnage de dessin animé, lequel ?", en: "If you were a cartoon character, which one?" },
  { fr: "Quel est ton meilleur souvenir de fou rire récent ?", en: "What's your best recent laughing-fit memory?" },
  { fr: "Quel accent aimerais-tu savoir imiter ?", en: "What accent would you love to be able to imitate?" },
  { fr: "Quelle est la chose la plus spontanée que tu aies faite ?", en: "What's the most spontaneous thing you've ever done?" },
  { fr: "Si tu pouvais être célèbre pour une chose, ce serait quoi ?", en: "If you could be famous for one thing, what would it be?" },

  // Petites confidences
  { fr: "Quel est ton plus grand rêve secret ?", en: "What's your biggest secret dream?" },
  { fr: "Qu'est-ce que tu n'as jamais dit à personne d'autre ?", en: "What have you never told anyone else?" },
  { fr: "Quelle est ta plus grande insécurité ?", en: "What's your biggest insecurity?" },
  { fr: "De quoi rêves-tu la nuit en ce moment ?", en: "What do you dream about at night lately?" },
  { fr: "Quel est ton souhait le plus profond pour cette année ?", en: "What's your deepest wish for this year?" },
  { fr: "Qu'est-ce qui te ferait te sentir totalement épanoui(e) ?", en: "What would make you feel completely fulfilled?" },
  { fr: "Quelle vérité sur toi aimerais-tu que je devine ?", en: "What truth about you would you like me to guess?" },
  { fr: "Quel est le moment où tu t'es senti(e) le plus vivant(e) cette année ?", en: "When did you feel most alive this year?" },

  // Reconnaissance & positif
  { fr: "Pour quoi es-tu reconnaissant(e) dans notre relation ?", en: "What are you grateful for in our relationship?" },
  { fr: "Quelle est la plus belle leçon que notre amour t'a apprise ?", en: "What's the most beautiful lesson our love has taught you?" },
  { fr: "Qu'est-ce qui te rend optimiste pour nous ?", en: "What makes you optimistic about us?" },
  { fr: "Quel progrès as-tu fait grâce à notre relation ?", en: "What progress have you made thanks to our relationship?" },
  { fr: "Qu'est-ce que tu apprécies chez toi en ce moment ?", en: "What do you appreciate about yourself right now?" },
  { fr: "Quelle belle surprise t'a marqué(e) récemment ?", en: "What nice surprise marked you recently?" },
  { fr: "Qui dans ta vie mérite plus de gratitude de ta part ?", en: "Who in your life deserves more gratitude from you?" },

  // Saint-Valentin / occasions
  { fr: "Quelle serait ta Saint-Valentin parfaite avec moi ?", en: "What would your perfect Valentine's Day with me be?" },
  { fr: "Comment aimerais-tu fêter ton prochain anniversaire avec moi ?", en: "How would you like to celebrate your next birthday with me?" },
  { fr: "Quel cadeau te ferait le plus plaisir, peu importe le prix ?", en: "What gift would make you happiest, no matter the price?" },
  { fr: "Quelle surprise rêverais-tu que je te prépare ?", en: "What surprise would you dream I'd prepare for you?" },
  { fr: "Comment aimerais-tu qu'on célèbre notre prochaine retrouvaille ?", en: "How would you like us to celebrate our next reunion?" },

  // Nourriture & plaisirs
  { fr: "Quel repas te rappelle le plus le bonheur ?", en: "What meal reminds you most of happiness?" },
  { fr: "Quel est ton petit-déjeuner idéal ?", en: "What's your ideal breakfast?" },
  { fr: "Quelle cuisine du monde aimerais-tu qu'on explore ensemble ?", en: "What world cuisine would you love us to explore together?" },
  { fr: "Quel plat te réconforte après une mauvaise journée ?", en: "What dish comforts you after a bad day?" },
  { fr: "Sucré ou salé, tu choisis quoi sans hésiter ?", en: "Sweet or savory, what do you pick without hesitation?" },
  { fr: "Quel restaurant rêves-tu qu'on essaie ensemble ?", en: "What restaurant do you dream of us trying together?" },
  { fr: "Quelle est la chose que tu cuisines le mieux ?", en: "What's the thing you cook best?" },

  // Saisons & ambiances
  { fr: "Quelle est ton ambiance d'automne préférée ?", en: "What's your favorite autumn vibe?" },
  { fr: "Qu'est-ce que tu aimes faire quand il neige ?", en: "What do you love doing when it snows?" },
  { fr: "Quel est ton moment préféré d'une journée d'été ?", en: "What's your favorite moment of a summer day?" },
  { fr: "Quelle activité de printemps aimerais-tu qu'on partage ?", en: "What spring activity would you love us to share?" },
  { fr: "Plage en été ou chalet en hiver avec moi ?", en: "Beach in summer or cabin in winter with me?" },
  { fr: "Quel temps te rend le plus heureux(se) ?", en: "What weather makes you happiest?" },

  // Connexion à distance
  { fr: "Qu'est-ce qui te ferait te sentir proche de moi ce soir ?", en: "What would make you feel close to me tonight?" },
  { fr: "Quelle activité à distance aimerais-tu qu'on fasse ensemble ?", en: "What long-distance activity would you love us to do together?" },
  { fr: "Comment aimerais-tu que je te réveille à distance ?", en: "How would you like me to wake you up from afar?" },
  { fr: "Quel film regarderait-on en même temps chacun de notre côté ?", en: "What movie would we watch at the same time, each on our side?" },
  { fr: "Qu'est-ce qui te fait sentir que je suis là malgré la distance ?", en: "What makes you feel I'm there despite the distance?" },
  { fr: "Quelle routine à deux à distance aimerais-tu qu'on instaure ?", en: "What long-distance couple routine would you love us to set up?" },

  // Pour mieux se connaître encore
  { fr: "Quel est ton plus grand accomplissement dont tu parles peu ?", en: "What's your biggest accomplishment you rarely talk about?" },
  { fr: "Qu'est-ce qui t'a fait grandir le plus ces dernières années ?", en: "What made you grow the most these past years?" },
  { fr: "Quelle est ta relation avec ta famille en quelques mots ?", en: "What's your relationship with your family in a few words?" },
  { fr: "Quel ami compte énormément pour toi et pourquoi ?", en: "What friend matters a lot to you and why?" },
  { fr: "Qu'est-ce que tu fais pour prendre soin de toi ?", en: "What do you do to take care of yourself?" },
  { fr: "Quelle est ta plus grande source de motivation ?", en: "What's your greatest source of motivation?" },
  { fr: "Quel est ton rapport à l'argent : dépensier ou économe ?", en: "What's your relationship with money: spender or saver?" },
  { fr: "Qu'est-ce qui te fait te sentir respecté(e) ?", en: "What makes you feel respected?" },

  // Tendres pour finir
  { fr: "Qu'est-ce que tu aimerais que je te chuchote à l'oreille ?", en: "What would you like me to whisper in your ear?" },
  { fr: "Quel est ton endroit préféré pour être blotti(e) contre moi ?", en: "What's your favorite place to be cuddled against me?" },
  { fr: "Comment te sens-tu quand je te dis que je t'aime ?", en: "How do you feel when I tell you I love you?" },
  { fr: "Qu'est-ce qui te fait te sentir en sécurité dans mes bras ?", en: "What makes you feel safe in my arms?" },
  { fr: "Quel souvenir de nous te réchauffe le cœur quand il fait froid ?", en: "What memory of us warms your heart when it's cold?" },
  { fr: "Quelle est la chose la plus précieuse que notre amour t'a donnée ?", en: "What's the most precious thing our love has given you?" },
  { fr: "Qu'est-ce que tu veux que je n'oublie jamais à propos de toi ?", en: "What do you want me to never forget about you?" },
  { fr: "Si tu pouvais me dire une seule chose là maintenant, ce serait quoi ?", en: "If you could tell me just one thing right now, what would it be?" }
];

// Choisit la question du jour (change chaque jour, identique pour les deux)
function questionDuJour() {
  const debut = new Date("2025-01-01").getTime();
  const aujourdhui = new Date();
  const jour = Math.floor((aujourdhui - debut) / (1000 * 60 * 60 * 24));
  const index = ((jour % QUESTIONS.length) + QUESTIONS.length) % QUESTIONS.length;
  return { index: index, texte: LANGUE_US ? QUESTIONS[index].en : QUESTIONS[index].fr };
}

// Identifiant du jour (pour stocker les réponses par jour dans Firebase)
function idJour() {
  const d = new Date();
  return d.getFullYear() + "-" + String(d.getMonth()+1).padStart(2,"0") + "-" + String(d.getDate()).padStart(2,"0");
}
