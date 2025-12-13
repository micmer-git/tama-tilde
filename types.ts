
export enum GameState {
  IDLE = 'IDLE',
  EATING = 'EATING',
  SLEEPING = 'SLEEPING',
  POOPING = 'POOPING',
  DEAD = 'DEAD',
  PLAYING = 'PLAYING',
  YOGA = 'YOGA'
}

export enum Location {
  BERGAMO = 'BERGAMO',
  GREECE = 'GREECE',
  VILLA_PANZA = 'VILLA_PANZA',
  INDIA = 'INDIA'
}

export interface Quote {
  text: string;
  source: string;
  // Category maps to locations: 'faccianuvola'->Bergamo, 'kerala'->Greece, 'panza'->Villa Panza, 'system'->Anywhere
  category: 'faccianuvola' | 'kerala' | 'panza' | 'system';
  reference?: string; // Song title or specific context
}

export interface Stats {
  hunger: number; // 0-100
  happiness: number; // 0-100
  caffeine: number; // 0-100
  relax: number; // 0-100
  poopCount: number;
}

export interface Track {
  title: string;
  artist: string;
  src: string; // URL to audio file
}
