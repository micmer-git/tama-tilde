
import React, { useState, useEffect, useRef } from 'react';
import PixelFerret from './components/PixelFerret';
import MusicPlayer from './components/MusicPlayer';
import { GameState, Stats, FoodType, Quote } from './types';
import { QUOTES, PLAYLIST } from './constants';
import { Utensils, Zap, Heart, Trash2, Moon, MessageSquare, Battery, Coffee, Smile, ChevronUp, ChevronDown } from 'lucide-react';

const USER_NAME = "Tilde";

const INITIAL_STATS: Stats = {
  hunger: 100,
  happiness: 100,
  energy: 100,
  caffeine: 80, // Starts well caffeinated
  relax: 80,    // Starts relaxed
  poopCount: 0
};

type MenuState = 'IDLE' | 'MAIN_MENU' | 'FOOD_MENU' | 'STATS_VIEW';

const MENU_OPTIONS = ['CIBO', 'YOGA', 'PULISCI', 'LUCE', 'PARLA', 'STATS'];

const App: React.FC = () => {
  // --- STATE ---
  const [stats, setStats] = useState<Stats>(INITIAL_STATS);
  const [gameState, setGameState] = useState<GameState>(GameState.IDLE);
  const [menuState, setMenuState] = useState<MenuState>('IDLE');
  const [menuIndex, setMenuIndex] = useState(0);
  const [frame, setFrame] = useState(0); 
  const [message, setMessage] = useState<string>("");
  const [isMessageVisible, setIsMessageVisible] = useState(false);
  
  // Game Loop Ref
  const tickRef = useRef<number | null>(null);

  // --- HELPERS ---
  const getRandomQuote = (category?: Quote['category']) => {
    let pool = QUOTES;
    if (category) {
      pool = QUOTES.filter(q => q.category === category);
    }
    const rand = pool[Math.floor(Math.random() * pool.length)];
    return rand;
  };

  const showQuote = (forcedQuote?: string, duration = 4000) => {
    if (gameState === GameState.DEAD) return;
    
    let text = "";
    if (forcedQuote) {
      text = forcedQuote;
    } else {
      const q = getRandomQuote();
      if (Math.random() < 0.4) {
          text = `${USER_NAME}, "${q.text.toLowerCase()}"`;
      } else {
          text = `"${q.text}"`;
      }
    }

    setMessage(text);
    setIsMessageVisible(true);
    setTimeout(() => {
      setIsMessageVisible(false);
    }, duration);
  };

  // --- GAME LOOP ---
  useEffect(() => {
    tickRef.current = window.setInterval(() => {
      setFrame(f => (f === 0 ? 1 : 0));

      if (gameState !== GameState.DEAD) {
        setStats(prev => {
          // --- DECAY RATES ---
          
          // Caffeine Decay: Drops slowly.
          const newCaffeine = Math.max(0, prev.caffeine - 0.04);
          
          // Relax Decay: Drops moderately.
          const newRelax = Math.max(0, prev.relax - 0.03);

          // Hunger
          const newHunger = Math.max(0, prev.hunger - 0.02); 

          // Energy: 
          // If Sleeping: +Recovery
          // If Awake: -Decay (accelerated if Caffeine is low)
          let newEnergy = prev.energy;
          if (gameState === GameState.SLEEPING) {
             newEnergy = Math.min(100, prev.energy + 2.0);
          } else {
             const energyDecay = newCaffeine < 20 ? 0.1 : 0.005; // Tired without coffee
             newEnergy = Math.max(0, prev.energy - energyDecay);
          }

          // Happiness: 
          // Affected by Hunger, Poop, Relax level
          let happinessDecay = 0.02;
          if (prev.relax < 30) happinessDecay += 0.02; // Stress hurts happiness
          if (prev.poopCount > 0) happinessDecay += 0.05;
          const newHappiness = Math.max(0, prev.happiness - happinessDecay);
          
          // Poop Logic
          let newPoop = prev.poopCount;
          if (prev.hunger > 20 && Math.random() < 0.001 && prev.poopCount < 4 && gameState !== GameState.SLEEPING && gameState !== GameState.YOGA) {
            newPoop += 1;
          }

          // Death check
          if (newHunger <= 0 || newHappiness <= 0 || newEnergy <= 0) {
            setGameState(GameState.DEAD);
            setMessage(`System Failure.`);
            setIsMessageVisible(true);
          }

          // Auto wake up
          if (gameState === GameState.SLEEPING && newEnergy >= 100) {
            setGameState(GameState.IDLE);
            showQuote(`Buongiorno ${USER_NAME}. Serve caffè.`);
          }

          // Auto finish Yoga
          if (gameState === GameState.YOGA && newRelax >= 100) {
              setGameState(GameState.IDLE);
              showQuote(`Namastè, ${USER_NAME}.`);
          }

          return {
            hunger: newHunger,
            energy: newEnergy,
            happiness: newHappiness,
            caffeine: newCaffeine,
            relax: newRelax,
            poopCount: newPoop
          };
        });
      }
    }, 1000);

    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, [gameState]);


  // --- CONTROLS ---

  const handleUp = () => {
    if (gameState === GameState.DEAD) return;
    if (menuState === 'MAIN_MENU') {
        setMenuIndex(prev => (prev - 1 + MENU_OPTIONS.length) % MENU_OPTIONS.length);
    } else if (menuState === 'FOOD_MENU') {
        setMenuIndex(prev => (prev - 1 + 3) % 3);
    }
  };

  const handleDown = () => {
    if (gameState === GameState.DEAD) return;
    if (menuState === 'MAIN_MENU') {
        setMenuIndex(prev => (prev + 1) % MENU_OPTIONS.length);
    } else if (menuState === 'FOOD_MENU') {
        setMenuIndex(prev => (prev + 1) % 3);
    }
  };

  const handleConfirm = () => { // Button A
    if (gameState === GameState.DEAD) return;

    if (menuState === 'IDLE') {
        // Open Menu
        setMenuState('MAIN_MENU');
        setMenuIndex(0);
    } 
    else if (menuState === 'MAIN_MENU') {
        handleMainMenuSelection();
    } 
    else if (menuState === 'FOOD_MENU') {
        confirmFood(menuIndex);
    } 
    else if (menuState === 'STATS_VIEW') {
        setMenuState('IDLE'); // Exit stats
    }
  };

  const handleBack = () => { // Button B
    if (gameState === GameState.DEAD) return;

    if (menuState === 'IDLE') {
        // IDLE ACTION: Toggle Stats / Quick Talk
        if (Math.random() > 0.5) showQuote();
        else setMenuState('STATS_VIEW');
    } else {
        // Back to Idle
        setMenuState('IDLE');
        setMenuIndex(0);
    }
  };

  // --- LOGIC ---

  const handleMainMenuSelection = () => {
    const selected = MENU_OPTIONS[menuIndex];

    switch (selected) {
        case 'CIBO':
            setMenuState('FOOD_MENU');
            setMenuIndex(0);
            break;
        case 'YOGA':
            startYoga();
            break;
        case 'PULISCI':
            cleanPoop();
            break;
        case 'LUCE':
            toggleSleep();
            break;
        case 'PARLA':
            setMenuState('IDLE');
            showQuote();
            break;
        case 'STATS':
            setMenuState('STATS_VIEW');
            break;
    }
  };

  const confirmFood = (index: number) => {
    const foods = Object.values(FoodType);
    const selectedFood = foods[index];
    
    setMenuState('IDLE');
    setGameState(GameState.EATING);
    
    setTimeout(() => {
        setStats(prev => {
            let newCaffeine = prev.caffeine;
            let newHunger = prev.hunger;
            let newHappiness = prev.happiness;

            if (selectedFood === FoodType.CAFFE) {
                newCaffeine = Math.min(100, prev.caffeine + 50);
                newHappiness += 5;
                showQuote(`Carburante liquido. Grazie ${USER_NAME}.`);
            } else if (selectedFood === FoodType.AVOCADO) {
                newHunger = Math.min(100, prev.hunger + 40);
                newHappiness += 10;
                showQuote(`Grassi buoni. Ottimo.`);
            } else {
                newHunger = Math.min(100, prev.hunger + 50);
                newHappiness += 5;
                showQuote(`Proteine.`);
            }

            return {
                ...prev,
                caffeine: newCaffeine,
                hunger: newHunger,
                happiness: Math.min(100, newHappiness)
            };
        });
        setGameState(GameState.IDLE);
    }, 2000);
  };

  const startYoga = () => {
    setMenuState('IDLE');
    if (gameState === GameState.SLEEPING) return;
    
    setGameState(GameState.YOGA);
    showQuote("Inizio sequenza Zen...", 2000);
    
    // Yoga replenishes Relax over time in the tick loop
    // Also gives a boost now
    setStats(prev => ({
        ...prev,
        relax: Math.min(100, prev.relax + 10)
    }));
  };

  const cleanPoop = () => {
    setMenuState('IDLE');
    if (stats.poopCount > 0) {
        setStats(prev => ({ ...prev, poopCount: 0, happiness: Math.min(100, prev.happiness + 20) }));
        showQuote(`Minimalismo ripristinato.`);
    } else {
        showQuote(`Tutto pulito, ${USER_NAME}.`);
    }
  };

  const toggleSleep = () => {
    setMenuState('IDLE');
    if (gameState === GameState.SLEEPING) {
        setGameState(GameState.IDLE);
        showQuote("Troppa luce...");
    } else {
        setGameState(GameState.SLEEPING);
    }
  };

  // --- RENDERERS ---

  const renderProgressBar = (value: number, colorClass: string) => (
    <div className="w-full h-2 bg-[#8b967e] border border-[#4a5043] mt-1 relative">
        <div 
            className={`h-full ${colorClass}`} 
            style={{ width: `${value}%` }}
        />
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-purple-900 to-indigo-900 text-neutral-200">
      
      {/* HEADER */}
      <h1 className="text-xl mb-6 text-center text-white/80 tracking-widest uppercase text-shadow-glow">
        Furetto <span className="text-pink-400">Pixel</span>
      </h1>

      {/* TAMAGOTCHI SHELL */}
      <div className="relative w-[320px] h-[380px] bg-[#f0f0f0] rounded-[50%_50%_45%_45%_/_55%_55%_40%_40%] shadow-[inset_-5px_-5px_15px_rgba(0,0,0,0.1),_0_20px_40px_rgba(0,0,0,0.6)] border-4 border-[#dcdcdc] flex flex-col items-center pt-12 pb-8 overflow-hidden">
        
        {/* BRANDING */}
        <div className="absolute top-6 text-[#ccc] font-bold text-xs tracking-widest">BITLOVE</div>

        {/* SCREEN CONTAINER */}
        <div className="w-[200px] h-[180px] bg-[#9ea792] rounded-lg shadow-[inset_3px_3px_8px_rgba(0,0,0,0.3)] border-4 border-[#8b967e] relative p-1 flex flex-col justify-between">
            
            {/* SCANLINE OVERLAY */}
            <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] z-20"></div>

            {/* SCREEN CONTENT */}
            <div className="flex-1 relative flex flex-col items-center justify-center z-10 w-full h-full overflow-hidden">
              
                {/* 1. STATUS VIEW */}
                {menuState === 'STATS_VIEW' && (
                    <div className="w-full h-full p-2 text-[#2d3129] font-mono text-[8px] flex flex-col gap-1">
                        <div className="text-center border-b border-[#2d3129] mb-1">STATUS SYSTEM</div>
                        <div className="flex items-center gap-1">
                            <Utensils size={8} /> FAME
                            <div className="flex-1">{renderProgressBar(stats.hunger, 'bg-green-700')}</div>
                        </div>
                        <div className="flex items-center gap-1">
                            <Heart size={8} /> FELICITÀ
                            <div className="flex-1">{renderProgressBar(stats.happiness, 'bg-pink-700')}</div>
                        </div>
                        <div className="flex items-center gap-1">
                            <Battery size={8} /> ENERGIA
                            <div className="flex-1">{renderProgressBar(stats.energy, 'bg-yellow-700')}</div>
                        </div>
                        <div className="flex items-center gap-1">
                            <Coffee size={8} /> CAFFEINA
                            <div className="flex-1">{renderProgressBar(stats.caffeine, 'bg-amber-900')}</div>
                        </div>
                        <div className="flex items-center gap-1">
                            <Smile size={8} /> RELAX
                            <div className="flex-1">{renderProgressBar(stats.relax, 'bg-blue-700')}</div>
                        </div>
                        <div className="mt-auto text-center opacity-60">PRESS B TO EXIT</div>
                    </div>
                )}

                {/* 2. GAME VIEW (IDLE/MENUS) */}
                {menuState !== 'STATS_VIEW' && (
                    <>
                        {/* Status Icons Top Row (Minimal) */}
                        <div className="absolute top-1 left-1 right-1 flex justify-between text-[#4a5043] opacity-60">
                             {gameState === GameState.SLEEPING && <Moon size={8} />}
                             {stats.caffeine < 20 && <Coffee size={8} className="animate-pulse text-red-800" />}
                             {stats.relax < 20 && <div className="text-[8px] animate-pulse">STRESS</div>}
                        </div>

                        {/* Speech Bubble */}
                        {isMessageVisible && (
                            <div className="absolute top-4 w-[90%] bg-[#4a5043] text-[#9ea792] p-2 text-[8px] leading-tight text-center border border-[#2d3129] shadow-md z-30">
                            {message}
                            </div>
                        )}

                        {/* FERRET */}
                        <div className={`w-32 h-32 relative transition-opacity ${menuState !== 'IDLE' ? 'opacity-20' : 'opacity-100'}`}>
                            <PixelFerret state={gameState} frame={frame} />
                            {stats.poopCount > 0 && <div className="absolute bottom-2 right-0 text-xl animate-pulse">💩</div>}
                        </div>

                        {/* MENUS OVERLAY */}
                        {menuState !== 'IDLE' && (
                            <div className="absolute inset-0 flex items-center justify-center z-40">
                                <div className="bg-[#9ea792] border-2 border-[#4a5043] p-1 w-[80%] shadow-[4px_4px_0px_rgba(0,0,0,0.2)]">
                                    {menuState === 'MAIN_MENU' && (
                                        <ul className="text-[10px] text-[#2d3129] font-bold">
                                            {MENU_OPTIONS.map((opt, i) => (
                                                <li key={opt} className={`px-2 py-1 ${i === menuIndex ? 'bg-[#4a5043] text-[#9ea792]' : ''}`}>
                                                    {i === menuIndex ? '> ' : '  '}{opt}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                    {menuState === 'FOOD_MENU' && (
                                        <ul className="text-[10px] text-[#2d3129] font-bold">
                                            {Object.values(FoodType).map((food, i) => (
                                                <li key={food} className={`px-2 py-1 ${i === menuIndex ? 'bg-[#4a5043] text-[#9ea792]' : ''}`}>
                                                    {i === menuIndex ? '> ' : '  '}{food}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        )}
                    </>
                )}

            </div>
        </div>

        {/* CONTROLS CONTAINER */}
        <div className="flex justify-between w-[240px] mt-6 px-2">
            
            {/* LEFT: D-PAD (UP/DOWN) */}
            <div className="flex flex-col gap-2 justify-center">
                 <button 
                   onClick={handleUp}
                   className="w-8 h-8 bg-neutral-800 rounded flex items-center justify-center shadow-[0_3px_0_#1a1a1a] active:translate-y-1 active:shadow-none hover:bg-neutral-700 transition-all text-neutral-400"
                   aria-label="Up"
                 >
                    <ChevronUp size={16} />
                 </button>
                 <button 
                   onClick={handleDown}
                   className="w-8 h-8 bg-neutral-800 rounded flex items-center justify-center shadow-[0_3px_0_#1a1a1a] active:translate-y-1 active:shadow-none hover:bg-neutral-700 transition-all text-neutral-400"
                   aria-label="Down"
                 >
                    <ChevronDown size={16} />
                 </button>
            </div>

            {/* RIGHT: A / B BUTTONS */}
            <div className="flex gap-4 items-end mb-2 rotate-[-10deg]">
                 <div className="flex flex-col items-center gap-1 translate-y-4">
                     <button 
                        onClick={handleBack}
                        className="w-10 h-10 bg-red-600 rounded-full shadow-[0_4px_0_#991b1b] active:shadow-none active:translate-y-1 active:bg-red-700 transition-all flex items-center justify-center text-red-900 font-bold text-xs"
                      >B</button>
                      <span className="text-[8px] font-bold text-gray-400">BACK</span>
                 </div>
                 <div className="flex flex-col items-center gap-1">
                     <button 
                        onClick={handleConfirm}
                        className="w-10 h-10 bg-blue-600 rounded-full shadow-[0_4px_0_#1e40af] active:shadow-none active:translate-y-1 active:bg-blue-700 transition-all flex items-center justify-center text-blue-900 font-bold text-xs"
                      >A</button>
                      <span className="text-[8px] font-bold text-gray-400">OK</span>
                 </div>
            </div>

        </div>

      </div>

      <MusicPlayer playlist={PLAYLIST} />

      <div className="mt-8 text-[8px] text-gray-500 text-center max-w-xs">
        <p>A: Confirm / Menu &bull; B: Back / Stats</p>
        <p>Up/Down: Navigate</p>
      </div>

    </div>
  );
};

export default App;
