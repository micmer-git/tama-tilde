
import React, { useState, useEffect, useRef } from 'react';
import PixelFerret from './components/PixelFerret';
import MusicPlayer from './components/MusicPlayer';
import { GameState, Stats, Quote, Location } from './types';
import { QUOTES, FULL_PLAYLIST } from './constants';
import { Utensils, Zap, Heart, Trash2, Moon, MessageSquare, Battery, Coffee, Smile, ChevronUp, ChevronDown, MapPin, Plane, X } from 'lucide-react';

const USER_NAME = "Tilde";

const INITIAL_STATS: Stats = {
  hunger: 100,
  happiness: 50,
  caffeine: 80,
  relax: 50,
  poopCount: 0
};

type MenuState = 'IDLE' | 'MAIN_MENU' | 'FOOD_MENU' | 'TRAVEL_MENU';

const App: React.FC = () => {
  // --- STATE ---
  const [stats, setStats] = useState<Stats>(INITIAL_STATS);
  const [gameState, setGameState] = useState<GameState>(GameState.IDLE);
  const [menuState, setMenuState] = useState<MenuState>('IDLE');
  const [menuIndex, setMenuIndex] = useState(0);
  const [frame, setFrame] = useState(0); 
  const [message, setMessage] = useState<string>("");
  const [isMessageVisible, setIsMessageVisible] = useState(false);
  const [location, setLocation] = useState<Location>(Location.BERGAMO);
  const [interactionEmoji, setInteractionEmoji] = useState<string | null>(null);
  const [showIntro, setShowIntro] = useState(true);
  
  const tickRef = useRef<number | null>(null);

  // --- CONFIGS ---
  const getMainOptions = () => ['CIBO', 'YOGA', 'PULISCI', 'LUCE', 'VIAGGIA'];

  const getFoodOptions = () => {
    switch (location) {
      case Location.GREECE:
        return ['Pita Gyros', 'Zuppa Oporto', 'Caffè Sabbioso'];
      case Location.INDIA:
        // India specific items
        return ['Dahl Patate', 'Palak Spinaci', 'Chai', 'Burro d\'arachidi Penny'];
      case Location.VILLA_PANZA:
        return ['Avocado', 'Uova e Pepe', 'Caffè']; 
      case Location.BERGAMO:
      default:
        return ['Avocado', 'Uova e Pepe', 'Caffè', 'Bugan Pizza'];
    }
  };

  const getTravelOptions = () => ['BERGAMO', 'GRECIA', 'VILLA PANZA', 'INDIA'];

  // --- HELPERS ---

  const getCurrentPlaylist = () => {
    if (location === Location.GREECE) {
        return FULL_PLAYLIST.filter(t => t.artist === 'Kerala Dust');
    } else if (location === Location.INDIA) {
        return FULL_PLAYLIST.filter(t => t.src.includes('india'));
    } else if (location === Location.BERGAMO) {
        return FULL_PLAYLIST.filter(t => t.artist === 'Faccianuvola' || t.artist.includes('Eugenio'));
    } else {
        return FULL_PLAYLIST;
    }
  };

  const getRandomQuote = () => {
    let allowedCategories = ['system'];
    if (location === Location.BERGAMO) allowedCategories.push('faccianuvola');
    if (location === Location.GREECE) allowedCategories.push('kerala');
    if (location === Location.VILLA_PANZA) allowedCategories.push('panza');
    const pool = QUOTES.filter(q => allowedCategories.includes(q.category));
    return pool[Math.floor(Math.random() * pool.length)];
  };

  const showQuote = (forcedQuote?: string, duration = 6000) => {
    if (gameState === GameState.DEAD) return;
    
    let text = "";
    if (forcedQuote) {
      text = forcedQuote;
    } else {
      const q = getRandomQuote();
      if (q.reference) {
         text = `${q.text} (${q.reference})`;
      } else if (q.text.includes('🎵')) {
          text = q.text;
      } else if (Math.random() < 0.4 && q.category !== 'system') {
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

  const triggerAnimation = (emoji: string) => {
    setInteractionEmoji(emoji);
    setTimeout(() => setInteractionEmoji(null), 2000);
  };

  // --- GAME LOOP ---
  useEffect(() => {
    tickRef.current = window.setInterval(() => {
      setFrame(f => (f === 0 ? 1 : 0));

      // Passive Commentary
      if (gameState === GameState.IDLE && !isMessageVisible && !showIntro) {
          if (Math.random() < 0.05) {
             showQuote();
          }
      }

      if (gameState !== GameState.DEAD && !showIntro) {
        setStats(prev => {
          const newCaffeine = Math.max(0, prev.caffeine - 0.04);
          const newRelax = Math.max(0, prev.relax - 0.03);
          const newHunger = Math.max(0, prev.hunger - 0.02); 

          let happinessDecay = 0.01;
          if (prev.relax < 20) happinessDecay += 0.02;
          if (prev.poopCount > 0) happinessDecay += 0.05;
          const newHappiness = Math.max(0, prev.happiness - happinessDecay);
          
          let newPoop = prev.poopCount;
          let poopChance = 0.001;
          if (location === Location.INDIA && prev.poopCount < 4) poopChance = 0.005;

          if (prev.hunger > 20 && Math.random() < poopChance && prev.poopCount < 4 && gameState !== GameState.SLEEPING && gameState !== GameState.YOGA) {
            newPoop += 1;
            if (location === Location.INDIA) showQuote("Devo trovare un bagno... subito.");
          }

          if (newHunger <= 0) {
            setGameState(GameState.DEAD);
            setMessage(`System Failure. Fame.`);
            setIsMessageVisible(true);
          }

          if (gameState === GameState.YOGA && newRelax >= 100) {
              setGameState(GameState.IDLE);
              showQuote(`Namastè, ${USER_NAME}.`);
          }

          return {
            hunger: newHunger,
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
  }, [gameState, isMessageVisible, location, showIntro]);


  // --- CONTROLS ---

  const getCurrentMenuList = () => {
    switch (menuState) {
      case 'MAIN_MENU': return getMainOptions();
      case 'FOOD_MENU': return getFoodOptions();
      case 'TRAVEL_MENU': return getTravelOptions();
      default: return [];
    }
  };

  const handleUp = () => {
    if (gameState === GameState.DEAD || showIntro) return;
    const list = getCurrentMenuList();
    if (list.length > 0) setMenuIndex(prev => (prev - 1 + list.length) % list.length);
  };

  const handleDown = () => {
    if (gameState === GameState.DEAD || showIntro) return;
    const list = getCurrentMenuList();
    if (list.length > 0) setMenuIndex(prev => (prev + 1) % list.length);
  };

  const handleConfirm = () => {
    if (gameState === GameState.DEAD || showIntro) return;

    if (menuState === 'IDLE') {
        setMenuState('MAIN_MENU');
        setMenuIndex(0);
    } 
    else if (menuState === 'MAIN_MENU') {
        handleMainMenuSelection();
    } 
    else if (menuState === 'FOOD_MENU') {
        confirmFood(menuIndex);
    } 
    else if (menuState === 'TRAVEL_MENU') {
        confirmTravel(menuIndex);
    }
  };

  const handleBack = () => {
    if (gameState === GameState.DEAD || showIntro) return;
    setMenuState('IDLE');
    setMenuIndex(0);
  };

  // --- LOGIC ---

  const handleMainMenuSelection = () => {
    const options = getMainOptions();
    const selected = options[menuIndex];

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
        case 'VIAGGIA':
            setMenuState('TRAVEL_MENU');
            setMenuIndex(0);
            break;
    }
  };

  const confirmFood = (index: number) => {
    const foods = getFoodOptions();
    const selectedFood = foods[index];
    setMenuState('IDLE');
    setGameState(GameState.EATING);
    setTimeout(() => {
        setStats(prev => {
            let { caffeine, hunger, happiness, poopCount } = prev;
            
            if (selectedFood.includes('Caffè')) {
                caffeine = Math.min(100, caffeine + 50);
                happiness += 2;
                triggerAnimation("☕");
                showQuote(location === Location.GREECE ? "Caffè sabbioso." : `Carburante.`);
            } else if (selectedFood.includes('Chai')) {
                caffeine = Math.min(100, caffeine + 40);
                happiness += 5;
                triggerAnimation("☕");
                showQuote(`Come quello di casa.`);
            } else if (selectedFood.includes('Burro')) {
                hunger = Math.min(100, hunger + 60);
                happiness += 10;
                triggerAnimation("🥜");
                showQuote(`Burro d'arachidi del Penny.`);
            } else if (selectedFood.includes('Avocado')) {
                hunger = Math.min(100, hunger + 40);
                happiness += 5;
                triggerAnimation("🥑");
                showQuote(`Grassi buoni.`);
            } else if (selectedFood.includes('Bugan')) {
                hunger = Math.min(100, hunger + 80);
                happiness += 10;
                triggerAnimation("🍕");
                showQuote(`Sant' Alessandro 31.`);
            } else if (selectedFood.includes('Pita')) {
                hunger = Math.min(100, hunger + 60);
                happiness += 8;
                triggerAnimation("🥙");
            } else if (selectedFood.includes('Zuppa')) {
                hunger = Math.min(100, hunger + 50);
                happiness += 5;
                triggerAnimation("🍲");
            } else if (selectedFood.includes('Dahl') || selectedFood.includes('Palak')) {
                hunger = Math.min(100, hunger + 70);
                happiness += 8;
                triggerAnimation("🥘");
                showQuote("Speziato.");
                if (Math.random() < 0.4) {
                    poopCount = Math.min(4, poopCount + 1);
                    setTimeout(() => showQuote("Oh no... la pancia."), 2500);
                }
            } else if (selectedFood.includes('Lassi') || selectedFood.includes('Yogurt')) {
                hunger = Math.min(100, hunger + 30);
                happiness += 10;
                poopCount = 0;
                triggerAnimation("🥛");
                showQuote("Reset gastrico effettuato.");
            } else {
                hunger = Math.min(100, hunger + 50);
                happiness += 3;
                triggerAnimation("🍳");
            }

            return { ...prev, caffeine, hunger, happiness: Math.min(100, happiness), poopCount };
        });
        setGameState(GameState.IDLE);
    }, 2000);
  };

  const confirmTravel = (index: number) => {
    const destinations = [Location.BERGAMO, Location.GREECE, Location.VILLA_PANZA, Location.INDIA];
    const destination = destinations[index];
    setMenuState('IDLE');
    
    if (destination === location) {
      showQuote("Siamo già qui.");
      return;
    }

    if (destination === Location.INDIA) {
      const unlockDate = new Date('2025-12-29');
      if (Date.now() < unlockDate.getTime()) {
        showQuote("L'attesa è l'unica cosa che ci rimane. (Torna nel 2025)");
        return;
      }
    }

    setGameState(GameState.SLEEPING);
    setMessage(`Viaggio verso ${destination}...`);
    setIsMessageVisible(true);
    triggerAnimation("✈️");

    setTimeout(() => {
      setLocation(destination);
      setGameState(GameState.IDLE);
      setIsMessageVisible(false);
      setStats(prev => ({ ...prev, happiness: 100 }));
      if (destination === Location.GREECE) showQuote("Kalimera, Tilde.");
      if (destination === Location.VILLA_PANZA) showQuote("Luci al neon.");
      if (destination === Location.INDIA) showQuote("Namaste. Attenzione all'acqua.");
      if (destination === Location.BERGAMO) showQuote("Casa.");
    }, 3000);
  };

  const startYoga = () => {
    setMenuState('IDLE');
    if (gameState === GameState.SLEEPING) return;
    setGameState(GameState.YOGA);
    
    const hour = new Date().getHours();
    const isEarly = hour < 9;
    
    // Greece Logic
    if (location === Location.GREECE) {
       showQuote("Corsetta tra Renzo Piano e l'acropoli. 🏛️🏃", 6000);
       triggerAnimation("🏃");
    }
    // India Logic
    else if (location === Location.INDIA) {
       showQuote("Erica non sopporta i fumi di Varanasi! 😤", 6000);
       triggerAnimation("🔥"); // Crazier
    }
    // Standard Logic
    else {
       if (isEarly) showQuote("Sessione mattutina con Erica da Rovetta.", 4000);
       else showQuote("Yoga con Erica da Rovetta. Inspira...", 4000);
       triggerAnimation("🧘");
    }
    
    setStats(prev => ({ ...prev, relax: Math.min(100, prev.relax + 40) }));
  };

  const cleanPoop = () => {
    setMenuState('IDLE');
    if (stats.poopCount > 0) {
        setStats(prev => ({ ...prev, poopCount: 0, happiness: Math.min(100, prev.happiness + 10) }));
        showQuote(`Pulito.`);
        triggerAnimation("✨");
    } else {
        showQuote(`Tutto pulito.`);
        triggerAnimation("👍");
    }
  };

  const toggleSleep = () => {
    setMenuState('IDLE');
    if (gameState === GameState.SLEEPING) {
        setGameState(GameState.IDLE);
        showQuote("Sveglia.");
        triggerAnimation("☀️");
    } else {
        setGameState(GameState.SLEEPING);
        triggerAnimation("💤");
    }
  };

  // --- THEMING ---
  const getTheme = () => {
    if (location === Location.GREECE) {
      return {
        bg: "bg-gradient-to-b from-sky-400 to-blue-600",
        shell: "bg-white border-[#0057B8]",
        shellShadow: "shadow-[0_20px_40px_rgba(0,87,184,0.4)]",
        inner: "bg-[#e0f7fa] border-[#0057B8]",
        textMain: "text-[#0057B8]",
        highlight: "text-blue-500",
        branding: "GRECIA 3000",
        flag: "🇬🇷"
      };
    } else if (location === Location.VILLA_PANZA) {
      return {
        bg: "bg-neutral-950",
        shell: "bg-neutral-800 border-pink-500",
        shellShadow: "shadow-[0_0_30px_rgba(255,0,255,0.4)]",
        inner: "bg-black border-pink-500",
        textMain: "text-pink-500",
        highlight: "text-pink-400",
        branding: "NEON VILLA",
        flag: "🖼️"
      };
    } else if (location === Location.INDIA) {
      return {
        bg: "bg-gradient-to-br from-orange-500 via-amber-200 to-green-600",
        shell: "bg-orange-100 border-orange-600",
        shellShadow: "shadow-[0_20px_40px_rgba(234,88,12,0.5)]",
        inner: "bg-amber-50 border-orange-600",
        textMain: "text-orange-800",
        highlight: "text-green-600",
        branding: "फुरेटोगोत्ची",
        flag: "🇮🇳"
      };
    }
    return {
      bg: "bg-gradient-to-br from-purple-900 to-indigo-900",
      shell: "bg-[#b8e0d2] border-[#e8f3d6]",
      shellShadow: "shadow-[inset_-5px_-5px_15px_rgba(0,0,0,0.1),_0_20px_40px_rgba(0,0,0,0.6)]",
      inner: "bg-[#fcfc9c] border-[#95c556]",
      textMain: "text-[#4a5043]",
      highlight: "text-[#95c556]",
      branding: "FURETTOGOTCHI",
      flag: "🥑"
    };
  };

  const theme = getTheme();

  const renderSideStat = (label: string, value: number, color: string, icon: React.ReactNode) => (
    <div className="flex flex-col items-center gap-1 h-full">
        <div className="text-[10px] font-bold text-white/50 tracking-wider flex items-center gap-1">{icon} {label}</div>
        <div className="w-4 flex-1 bg-black/40 rounded-full relative overflow-hidden border border-white/10 shadow-inner">
            <div 
                className={`absolute bottom-0 left-0 right-0 transition-all duration-1000 ${color}`} 
                style={{ height: `${value}%` }}
            >
                <div className="w-full h-full opacity-30 bg-[linear-gradient(transparent_50%,rgba(255,255,255,0.5)_50%)] bg-[length:100%_4px]"></div>
            </div>
        </div>
        <div className="text-[9px] font-mono text-white/80">{Math.round(value)}%</div>
    </div>
  );

  return (
    <div className={`h-[100dvh] w-full flex flex-col items-center py-2 px-4 ${theme.bg} text-neutral-200 transition-colors duration-1000 overflow-hidden relative touch-none`}>
      
      {/* STARTUP POPUP */}
      {showIntro && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-6 animate-in fade-in duration-500">
           <div className={`max-w-xs w-full bg-neutral-900 border-2 ${theme.highlight.replace('text-', 'border-')} p-6 rounded-xl shadow-2xl text-center flex flex-col gap-4`}>
              <h2 className={`text-xl font-bold ${theme.highlight} tracking-widest uppercase`}>Furettogotchi v2.0</h2>
              <div className="text-xs text-neutral-400 font-mono space-y-2">
                 <p>Release: November 2024</p>
                 <div className="w-full h-px bg-white/10 my-2"></div>
                 <p className="text-white">NEXT UPDATE:</p>
                 <p className="text-lg font-bold text-yellow-400 animate-pulse">29 DEC 2025</p>
                 <p>(India Trip 🇮🇳)</p>
              </div>
              <button 
                onClick={() => setShowIntro(false)}
                className={`mt-4 py-3 px-6 bg-white text-black font-bold rounded hover:scale-105 active:scale-95 transition-all`}
              >
                START
              </button>
           </div>
        </div>
      )}

      {/* HEADER: Smaller on mobile, constrained height */}
      <h1 className="text-lg md:text-3xl mb-1 text-center text-white/90 tracking-[0.2em] md:tracking-[0.3em] uppercase text-shadow-glow font-bold shrink-0">
        Furettogotchi <span className={theme.highlight}>Pixel</span>
      </h1>

      <div className="flex-1 w-full max-w-[500px] flex flex-col items-center justify-center relative min-h-0">
          
          {/* STATS: MOBILE (Compact grid at top) */}
          <div className="md:hidden w-full grid grid-cols-4 gap-2 mb-1 shrink-0 h-[60px]">
             {renderSideStat("FAME", stats.hunger, "bg-green-500", <Utensils size={10}/>)}
             {renderSideStat("HAPPY", stats.happiness, "bg-pink-500", <Heart size={10}/>)}
             {renderSideStat("RELAX", stats.relax, "bg-blue-500", <Smile size={10}/>)}
             {renderSideStat("CAFFÈ", stats.caffeine, "bg-amber-600", <Coffee size={10}/>)}
          </div>

          {/* STATS: DESKTOP (Absolute Wings) */}
          <div className="hidden md:flex absolute left-[-80px] top-20 flex-col gap-4 p-3 bg-neutral-900/40 backdrop-blur-sm rounded-l-xl border-y border-l border-white/10 z-0">
             {renderSideStat("FAME", stats.hunger, "bg-green-500", <Utensils size={10}/>)}
             {renderSideStat("FELICITÀ", stats.happiness, "bg-pink-500", <Heart size={10}/>)}
          </div>
          <div className="hidden md:flex absolute right-[-80px] top-20 flex-col gap-4 p-3 bg-neutral-900/40 backdrop-blur-sm rounded-r-xl border-y border-r border-white/10 z-0">
             {renderSideStat("RELAX", stats.relax, "bg-blue-500", <Smile size={10}/>)}
             {renderSideStat("CAFFÈ", stats.caffeine, "bg-amber-600", <Coffee size={10}/>)}
          </div>

          {/* SHELL: Responsive container */}
          <div className={`
            relative 
            flex-1 w-full max-h-[600px]
            md:h-[520px] md:aspect-auto md:flex-none
            rounded-[2rem] md:rounded-[50%_50%_45%_45%_/_55%_55%_40%_40%]
            border-[8px] md:border-[12px] 
            flex flex-col items-center 
            pt-4 md:pt-20 pb-2 md:pb-10 
            px-2
            overflow-hidden 
            transition-all duration-700 z-10 
            mb-12 md:mb-0 /* Space for mobile player */
            ${theme.shell} ${theme.shellShadow}
          `}>
            
            {/* SCREEN CONTAINER - Scales with Shell - Flexible */}
            <div className={`
              w-full flex-1 min-h-0
              relative
              flex flex-col items-center justify-center
            `}>
                <div className={`
                   aspect-square h-full max-h-full max-w-full
                   md:w-[260px] md:aspect-auto md:h-[240px]
                   rounded-xl border-4 relative p-3 
                   flex flex-col justify-between 
                   transition-colors duration-700 
                   ${theme.inner}
                `}>
                
                    {/* OVERLAYS */}
                    <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] z-20"></div>
                    
                    {/* GAME AREA */}
                    <div className="flex-1 relative flex flex-col items-center justify-center z-10 w-full h-full overflow-hidden">
                        <div className={`absolute top-1 left-1 right-1 flex justify-between opacity-60 ${theme.textMain} font-bold text-[10px] md:text-xs`}>
                              <div className="flex gap-1">
                                <div className="absolute top-[-5px] right-[-5px] text-4xl md:text-5xl rotate-12 opacity-80 filter drop-shadow-md">
                                  {theme.flag}
                                </div>
                              </div>
                              <div className="flex gap-1">
                                {gameState === GameState.SLEEPING && <Moon size={12} />}
                                {stats.caffeine < 20 && <Coffee size={12} className="animate-pulse" />}
                                {stats.relax < 20 && <div className="text-[9px] animate-pulse">STRESS</div>}
                              </div>
                        </div>

                        {/* MESSAGE */}
                        {isMessageVisible && (
                            <div className={`absolute top-8 md:top-10 w-[95%] p-2 md:p-3 text-[9px] md:text-[10px] leading-tight text-center border-2 shadow-md z-30 rounded-md animate-in fade-in zoom-in duration-300 ${location === Location.VILLA_PANZA ? 'bg-pink-900 text-pink-100 border-pink-500' : 'bg-white text-black border-black'}`}>
                            {message}
                            </div>
                        )}

                        {/* FERRET */}
                        <div className={`w-32 h-32 md:w-40 md:h-40 relative transition-opacity ${menuState !== 'IDLE' ? 'opacity-20' : 'opacity-100'} ${location === Location.VILLA_PANZA ? 'grayscale contrast-125' : ''}`}>
                            <PixelFerret state={gameState} frame={frame} />
                            {stats.poopCount > 0 && <div className="absolute bottom-2 right-0 text-3xl animate-pulse">💩</div>}
                            {interactionEmoji && (
                              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="text-5xl md:text-6xl animate-[bounce_1s_ease-in-out_infinite] opacity-90 filter drop-shadow-lg">
                                  {interactionEmoji}
                                </div>
                              </div>
                            )}
                        </div>

                        {/* MENUS */}
                        {menuState !== 'IDLE' && (
                            <div className="absolute inset-0 flex items-center justify-center z-40">
                                <div className={`border-2 p-3 w-[85%] shadow-[4px_4px_0px_rgba(0,0,0,0.2)] ${location === Location.VILLA_PANZA ? 'bg-black border-pink-500' : 'bg-[#e0f0e0] border-black'}`}>
                                    <ul className={`text-xs md:text-sm font-bold ${theme.textMain}`}>
                                        {getCurrentMenuList().map((opt, i) => (
                                            <li key={opt} className={`px-2 py-1 mb-1 ${i === menuIndex ? (location === Location.VILLA_PANZA ? 'bg-pink-700 text-white' : 'bg-black text-white') : ''}`}>
                                                {i === menuIndex ? '> ' : '  '}{opt}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* BRANDING */}
            <div className={`mt-1 md:mt-4 mb-1 font-bold text-sm md:text-xl tracking-[0.2em] opacity-50 shrink-0 ${location === Location.VILLA_PANZA ? 'text-pink-500 animate-pulse' : 'text-black/40'}`}>
              {theme.branding}
            </div>

            {/* CONTROLS */}
            <div className="flex justify-between w-[90%] md:w-[80%] md:max-w-[300px] mt-1 px-4 pb-1 shrink-0">
                <div className="flex flex-col gap-2 md:gap-3 justify-center">
                      <button onClick={handleUp} className="w-10 h-10 md:w-12 md:h-12 bg-neutral-800 rounded flex items-center justify-center shadow-[0_4px_0_#1a1a1a] active:translate-y-1 active:shadow-none hover:bg-neutral-700 transition-all text-neutral-400 touch-manipulation"><ChevronUp size={20} /></button>
                      <button onClick={handleDown} className="w-10 h-10 md:w-12 md:h-12 bg-neutral-800 rounded flex items-center justify-center shadow-[0_4px_0_#1a1a1a] active:translate-y-1 active:shadow-none hover:bg-neutral-700 transition-all text-neutral-400 touch-manipulation"><ChevronDown size={20} /></button>
                </div>

                <div className="flex gap-4 md:gap-6 items-end mb-1 md:rotate-[-10deg]">
                      <div className="flex flex-col items-center gap-1 md:translate-y-6">
                          <button onClick={handleBack} className="w-12 h-12 md:w-14 md:h-14 bg-red-600 rounded-full shadow-[0_5px_0_#991b1b] active:shadow-none active:translate-y-1 active:bg-red-700 transition-all flex items-center justify-center text-red-900 font-bold text-lg touch-manipulation">B</button>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                          <button onClick={handleConfirm} className="w-12 h-12 md:w-14 md:h-14 bg-blue-600 rounded-full shadow-[0_5px_0_#1e40af] active:shadow-none active:translate-y-1 active:bg-blue-700 transition-all flex items-center justify-center text-blue-900 font-bold text-lg touch-manipulation">A</button>
                      </div>
                </div>
            </div>
          </div>
      </div>

      <MusicPlayer playlist={getCurrentPlaylist()} theme={theme} />

    </div>
  );
};

export default App;
