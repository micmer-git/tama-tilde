
import { Quote, Track } from './types';

// Full Playlist - App will filter based on location
export const FULL_PLAYLIST: Track[] = [
  // KERALA DUST (Greece Vibe)
  { title: 'Nevada', artist: 'Kerala Dust', src: './audio/nevada.mp3' },
  { title: 'Closer', artist: 'Kerala Dust', src: './audio/closer.mp3' },
  
  // FACCIANUVOLA (Bergamo Vibe)
  { title: 'Verticale', artist: 'Faccianuvola', src: './audio/faccianuvola_verticale.mp3' },
  { title: 'Primavera', artist: 'Faccianuvola', src: './audio/faccianuvola_primavera.mp3' },
  { title: 'Albero', artist: 'Eugenio in Via Di Gioia', src: './audio/albero.mp3' },

  // INDIA VIBE
  { title: 'Mantra', artist: 'Spiritual Eye', src: './audio/india.mp3' }
];

export const QUOTES: Quote[] = [
  // --- SYSTEM / TILDE (General) ---
  { text: "Tilde, tutto questo è per te.", source: "System", category: "system" },
  { text: "Tilde, il server è freddo stasera.", source: "Furetto", category: "system" },
  { text: "Ciao Tilde, sei reale o sei un render?", source: "Furetto", category: "system" },
  { text: "Voglio andare altrove...", source: "Furetto", category: "system" },
  { text: "Ho bisogno di vacanza.", source: "Furetto", category: "system" },

  // --- BERGAMO (Faccianuvola Lyrics) ---
  { text: "Tutto si muove, ma io resto fermo qui.", source: "Faccianuvola", category: "faccianuvola" },
  { text: "🎵 Le piante crescono anche senza di noi... 🎵", source: "Faccianuvola", category: "faccianuvola" },
  { text: "Ho perso il conto dei giorni in questa stanza blu.", source: "Faccianuvola", category: "faccianuvola" },
  { text: "Respirare piano per non fare rumore.", source: "Faccianuvola", category: "faccianuvola" },
  { text: "La città è vuota, o sono io che non ci sono?", source: "Faccianuvola", category: "faccianuvola" },
  { text: "🎵 Siamo solo pixel in un render sbagliato... 🎵", source: "Faccianuvola", category: "faccianuvola" },
  { text: "Cercami dove non c'è connessione.", source: "Faccianuvola", category: "faccianuvola" },
  { text: "Il caffè è freddo, come le tue risposte.", source: "Faccianuvola", category: "faccianuvola" },
  { text: "Vorrei essere un file da cancellare.", source: "Faccianuvola", category: "faccianuvola" },
  { text: "🎵 Luci al neon che tagliano la nebbia... 🎵", source: "Faccianuvola", category: "faccianuvola" },
  { text: "L'attesa è l'unica cosa che ci rimane.", source: "Faccianuvola", category: "faccianuvola" },
  { text: "Non siamo ancora pronti per quel futuro.", source: "Faccianuvola", category: "faccianuvola" },
  
  // --- GREECE (Kerala Dust Lyrics) ---
  { text: "The moon is a heavy thing to carry.", source: "Kerala Dust", category: "kerala" },
  { text: "🎵 Shake off the dust... 🎵", source: "Kerala Dust", category: "kerala" },
  { text: "Late night, Berlin lights.", source: "Kerala Dust", category: "kerala" },
  { text: "Pulse ticking like a clock.", source: "Kerala Dust", category: "kerala" },
  { text: "Different spaces, different times.", source: "Kerala Dust", category: "kerala" },
  { text: "🎵 I put a spell on you... 🎵", source: "Kerala Dust", category: "kerala" },

  // --- VILLA PANZA (Light, Space, Minimalism) ---
  { text: "La luce di Dan Flavin cambia il mio colore.", source: "Villa Panza", category: "panza" },
  { text: "James Turrell ha aperto un buco nel cielo.", source: "Villa Panza", category: "panza" },
  { text: "Monocromo assoluto.", source: "Villa Panza", category: "panza" },
  { text: "Lo spazio non è vuoto, è pieno di luce.", source: "Villa Panza", category: "panza" },
  { text: "Robert Irwin vede cose che noi ignoriamo.", source: "Villa Panza", category: "panza" },
  { text: "Minimalismo radicale nella scuderia.", source: "Villa Panza", category: "panza" },
  { text: "Neon vibes only.", source: "Villa Panza", category: "panza" },
  { text: "Collezione Panza: l'arte dell'invisibile.", source: "Villa Panza", category: "panza" }
];
