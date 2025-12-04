
import { Quote, Track } from './types';

// Playlist focusing on Faccianuvola and Kerala Dust
// NOTE: For standalone deployment, place these files in an 'audio' folder
export const PLAYLIST: Track[] = [
  { title: 'Nevada', artist: 'Kerala Dust', src: './audio/nevada.mp3' },
  { title: 'Verticale', artist: 'Faccianuvola', src: './audio/faccianuvola_verticale.mp3' },
  { title: 'Primavera', artist: 'Faccianuvola', src: './audio/faccianuvola_primavera.mp3' },
  { title: 'Closer', artist: 'Kerala Dust', src: './audio/closer.mp3' }
];

export const QUOTES: Quote[] = [
  // --- PERSONALIZED FOR TILDE ---
  { text: "Tilde, tutto questo è per te.", source: "System", category: "nerd" },
  { text: "Tilde, hai portato l'avocado?", source: "Furetto", category: "lyric" },
  { text: "Tilde, il server è freddo stasera.", source: "Furetto", category: "nerd" },
  { text: "Ciao Tilde, sei reale o sei un render?", source: "Furetto", category: "design" },
  
  // --- FACCIANUVOLA LYRICS ---
  { text: "Tutto si muove, ma io resto fermo qui.", source: "Faccianuvola", category: "lyric" },
  { text: "Le piante crescono anche senza di noi.", source: "Faccianuvola", category: "lyric" },
  { text: "Ho perso il conto dei giorni in questa stanza blu.", source: "Faccianuvola", category: "lyric" },
  { text: "Respirare piano per non fare rumore.", source: "Faccianuvola", category: "lyric" },
  { text: "La città è vuota, o sono io che non ci sono?", source: "Faccianuvola", category: "lyric" },
  { text: "Siamo solo pixel in un render sbagliato.", source: "Faccianuvola", category: "lyric" },
  { text: "Cercami dove non c'è connessione.", source: "Faccianuvola", category: "lyric" },
  { text: "Il caffè è freddo, come le tue risposte.", source: "Faccianuvola", category: "lyric" },
  { text: "Vorrei essere un file da cancellare.", source: "Faccianuvola", category: "lyric" },
  { text: "Luci al neon che tagliano la nebbia.", source: "Faccianuvola", category: "lyric" },
  
  // --- KERALA DUST VIBES ---
  { text: "The moon is a heavy thing to carry.", source: "Kerala Dust", category: "lyric" },
  { text: "Shake off the dust.", source: "Kerala Dust", category: "lyric" },
  { text: "Late night, Berlin lights.", source: "Kerala Dust", category: "lyric" },
  { text: "Pulse ticking like a clock.", source: "Kerala Dust", category: "lyric" },

  // --- ITALIAN DESIGN & CONTEMPORARY HISTORY ---
  { text: "Da cosa nasce cosa.", source: "Bruno Munari", category: "design" },
  { text: "Less is more, ma l'avocado è extra.", source: "Mies / Design Pop", category: "design" },
  { text: "La forma segue la funzione, o la colazione?", source: "Sullivan (remix)", category: "design" },
  { text: "Il design è l'anima di un oggetto creato dall'uomo.", source: "Steve Jobs (Olivetti style)", category: "design" },
  { text: "Sottrazione di peso.", source: "Italo Calvino", category: "design" },
  { text: "Non è cemento, è brutalismo emotivo.", source: "Architettura Ita", category: "design" },
  { text: "Superstudio aveva ragione: la vita è un render.", source: "Radical Design", category: "design" },
  { text: "Memphis Milano: colori contro il grigiore.", source: "Ettore Sottsass", category: "design" },
  { text: "Un computer in ogni casa? Magari un furetto.", source: "Olivetti vision", category: "design" },
  { text: "Grafica è rendere memorabile l'utile.", source: "Vignelli", category: "design" },
  { text: "L'architettura è un fatto d'arte.", source: "Gio Ponti", category: "design" },
  
  // --- NERD / ART REFERENCES ---
  { text: "I've seen things you people wouldn't believe...", source: "Blade Runner", category: "nerd" },
  { text: "So long, and thanks for all the fish.", source: "Hitchhiker's Guide", category: "nerd" },
  { text: "It's dangerous to go alone! Take this.", source: "Zelda", category: "nerd" },
  { text: "The cake is a lie.", source: "Portal", category: "nerd" },
  { text: "42.", source: "Hitchhiker's Guide", category: "nerd" },
  { text: "Do, or do not. There is no try.", source: "Yoda", category: "nerd" },
  { text: "A glitch in the matrix.", source: "The Matrix", category: "nerd" },
  { text: "Siamo fatti della stessa sostanza dei sogni.", source: "Shakespeare / Tempest", category: "nerd" },
  { text: "Who watches the Watchmen?", source: "Moore", category: "nerd" },
  { text: "Hello World.", source: "Programming", category: "nerd" },
  { text: "Have you tried turning it off and on again?", source: "IT Crowd", category: "nerd" }
];
