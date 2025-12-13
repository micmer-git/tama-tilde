
import { Quote, Track } from './types';

const AUDIO_BASE = "https://micmer-git.github.io/audio/";

// Full Playlist - App will filter based on location
export const FULL_PLAYLIST: Track[] = [
  // KERALA DUST (Greece Vibe)
  { title: 'Nevada', artist: 'Kerala Dust', src: `${AUDIO_BASE}nevada.mp3` },
  { title: 'Closer', artist: 'Kerala Dust', src: `${AUDIO_BASE}closer.mp3` },
  
  // FACCIANUVOLA (Bergamo Vibe)
  { title: 'Verticale', artist: 'Faccianuvola', src: `${AUDIO_BASE}faccianuvola_verticale.mp3` },
  { title: 'Primavera', artist: 'Faccianuvola', src: `${AUDIO_BASE}faccianuvola_primavera.mp3` },
  { title: 'Albero', artist: 'Eugenio in Via Di Gioia', src: `${AUDIO_BASE}albero.mp3` },

  // INDIA VIBE
  { title: 'Mantra', artist: 'Spiritual Eye', src: `${AUDIO_BASE}india.mp3` }
];

export const QUOTES: Quote[] = [
  // --- SYSTEM / TILDE (General) ---
  { text: "Tilde, tutto questo è per te.", source: "System", category: "system" },
  { text: "Tilde, il server è freddo stasera.", source: "Furetto", category: "system" },
  { text: "Ciao Tilde, sei reale o sei un render?", source: "Furetto", category: "system" },
  { text: "Voglio andare altrove...", source: "Furetto", category: "system" },
  { text: "Ho bisogno di vacanza.", source: "Furetto", category: "system" },
  { text: "Porco dimari che corsa.", source: "Furetto", category: "system" },

  // --- BERGAMO (Faccianuvola Lyrics) ---
  { text: "Disperata gioventù non vuol tornare a casa sua.", source: "Faccianuvola", category: "faccianuvola", reference: "Disperata Gioventù" },
  { text: "Restiamo perpendicolari al mondo che ci guarda storto.", source: "Faccianuvola", category: "faccianuvola", reference: "Verticale" },
  { text: "Non avremo più paura di rincorrerci per gioco.", source: "Faccianuvola", category: "faccianuvola", reference: "Primavera" },
  { text: "Tornerò sulle mie impronte soltanto per non perdermi.", source: "Faccianuvola", category: "faccianuvola", reference: "Primavera" },
  { text: "Passeranno giorni e settimane tra le nuvole.", source: "Faccianuvola", category: "faccianuvola", reference: "Verticale" },
  { text: "Acqua sotto al ponte, prima o poi sarò di nuovo da te.", source: "Faccianuvola", category: "faccianuvola", reference: "Albero" },
  { text: "C'era una frase che ti dovevo dire.", source: "Faccianuvola", category: "faccianuvola", reference: "Disperata Gioventù" },
  { text: "Mi piacerebbe incontrarti dove il mio cielo finisce.", source: "Faccianuvola", category: "faccianuvola", reference: "Verticale" },
  { text: "E il tempo scorre all'insù.", source: "Faccianuvola", category: "faccianuvola", reference: "Verticale" },
  { text: "Il nostro amore era un singhiozzo della dolce ingenuità.", source: "Faccianuvola", category: "faccianuvola", reference: "Primavera" },
  { text: "Un giorno che era già finito e che mai più ritornerà.", source: "Faccianuvola", category: "faccianuvola", reference: "Primavera" },
  { text: "Poi tu scendi dalla luna.", source: "Faccianuvola", category: "faccianuvola", reference: "Disperata Gioventù" },
  { text: "Poi ti porto lungo il fiume e ti grido che ti amo.", source: "Faccianuvola", category: "faccianuvola", reference: "Albero" },
  { text: "Parlerò di te come dei vestiti che mettevo per dormire.", source: "Faccianuvola", category: "faccianuvola", reference: "Verticale" },
  { text: "Come una storia che non voglio raccontare.", source: "Faccianuvola", category: "faccianuvola", reference: "Disperata Gioventù" },
  { text: "Un uccellino sul sentiero mi sussurra: non è vero che non tornerai.", source: "Faccianuvola", category: "faccianuvola", reference: "Primavera" },
  { text: "Mi ricorderò di noi come due bambini che giocavano alle corse.", source: "Faccianuvola", category: "faccianuvola", reference: "Albero" },
  { text: "A nascondino nelle vigne o sotto a un ponte.", source: "Faccianuvola", category: "faccianuvola", reference: "Verticale" },
  { text: "Vorrei un'ora come prima, degli occhi da bambina.", source: "Faccianuvola", category: "faccianuvola", reference: "Primavera" },
  { text: "Vorrei la luna piena e delle mani con cui toccarla ancora.", source: "Faccianuvola", category: "faccianuvola", reference: "Verticale" },
  { text: "Il vento del mattino mi sveglia nei sogni in cui non ci sei.", source: "Faccianuvola", category: "faccianuvola", reference: "Disperata Gioventù" },
  { text: "Ci prenderemo per la mano e torneremo piano piano.", source: "Faccianuvola", category: "faccianuvola", reference: "Albero" },
  { text: "Non ricordi il giorno in cui gridammo alla felicità?", source: "Faccianuvola", category: "faccianuvola", reference: "Primavera" },
  { text: "Lunghi baci tra i cespugli.", source: "Faccianuvola", category: "faccianuvola", reference: "Verticale" },
  { text: "La faccia nella brina.", source: "Faccianuvola", category: "faccianuvola", reference: "Disperata Gioventù" },
  
  // --- GREECE (Kerala Dust Lyrics) ---
  { text: "The moon is a heavy thing to carry.", source: "Kerala Dust", category: "kerala", reference: "Nevada" },
  { text: "🎵 Shake off the dust... 🎵", source: "Kerala Dust", category: "kerala", reference: "Closer" },
  { text: "Late night, Berlin lights.", source: "Kerala Dust", category: "kerala", reference: "Nevada" },
  { text: "Pulse ticking like a clock.", source: "Kerala Dust", category: "kerala", reference: "Closer" },
  { text: "Different spaces, different times.", source: "Kerala Dust", category: "kerala", reference: "Nevada" },
  { text: "🎵 I put a spell on you... 🎵", source: "Kerala Dust", category: "kerala", reference: "Closer" },

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
