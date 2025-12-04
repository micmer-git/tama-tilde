
export enum GameState {
  IDLE = 'IDLE',
  EATING = 'EATING',
  SLEEPING = 'SLEEPING',
  POOPING = 'POOPING',
  DEAD = 'DEAD',
  PLAYING = 'PLAYING'
}

export enum FoodType {
  AVOCADO = 'Avocado',
  UOVA_PEPE = 'Uova e Pepe',
  CAFFE = 'Caffè'
}

export interface Quote {
  text: string;
  source: string;
  category: 'lyric' | 'nerd' | 'design';
}

export interface Stats {
  hunger: number; // 0-100 (100 is full)
  happiness: number; // 0-100 (100 is happy)
  energy: number; // 0-100 (100 is rested)
  poopCount: number;
}

export interface Track {
  title: string;
  artist: string;
  src: string; // Relative path to audio file
}
