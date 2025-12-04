import React, { useState, useEffect, useRef } from 'react';
import PixelFerret from './components/PixelFerret';
import MusicPlayer from './components/MusicPlayer';
import { GameState, Stats, FoodType, Quote } from './types';
import { QUOTES, PLAYLIST } from './constants';
import { Utensils, Zap, Heart, Trash2, Moon, MessageSquare } from 'lucide-react';

const USER_NAME = "Tilde";

// More robust starting stats - Start fully happy
const INITIAL_STATS: Stats = {
  hunger: 100,
  happiness: 100,
  energy: 100,
  poopCount: 0
};

const App: React.FC = () => {
  // --- STATE ---
  const [stats, setStats] = useState<Stats>(INITIAL_STATS);
  const [gameState, setGameState] = useState<GameState>(GameState.IDLE);
  const [frame, setFrame] = useState(0); // Animation frame 0 or 1
  const [activeMenu, setActiveMenu] = useState<'NONE' | 'FOOD' | 'ACTION'>('NONE');
  const [message, setMessage] = useState<string>("");
  const [isMessageVisible, setIsMessageVisible] = useState(false);
  const [foodSelection, setFoodSelection] = useState<number>(0);
  
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

  const showQuote = (forcedQuote?: string) => {
    if (gameState === GameState.DEAD) return;
    
    let text = "";
    if (forcedQuote) {
      text = forcedQuote;
    } else {
      const q = getRandomQuote();
      // 40% chance to address Tilde directly in random quotes
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
    }, 5000);
  };

  // --- GAME LOOP ---
  useEffect(() => {
    tickRef.current = window.setInterval(() => {
      setFrame(f => (f === 0 ? 1 : 0));

      if (gameState !== GameState.DEAD) {
        setStats(prev => {
          // DRASTICALLY SLOWED DECAY for better UX
          // Hunger drops 0.02 per sec => ~1.5 hours to starve
          const newHunger = Math.max(0, prev.hunger - 0.02); 
          
          // Happiness drops 0.02 per sec
          const newHappiness = Math.max(0, prev.happiness - 0.02);

          // Energy management
          let newEnergy = prev.energy;
          if (gameState === GameState.SLEEPING) {
             newEnergy = Math.min(100, prev.energy + 1.5); // Sleep recovers fast
          } else {
             newEnergy = Math.max(0, prev.energy - 0.005); // Awake drains very slow
          }
          
          // Chance to poop (reduced)
          let newPoop = prev.poopCount;
          if (prev.hunger > 20 && Math.random() < 0.001 && prev.poopCount < 4 && gameState !== GameState.SLEEPING) {
            newPoop += 1;
          }

          // Death check
          if (newHunger <= 0 || newHappiness <= 0) {
            setGameState(GameState.DEAD);
            setMessage(`Addio, ${USER_NAME}.`);
            setIsMessageVisible(true);
          }

          // Auto wake up
          if (gameState === GameState.SLEEPING && newEnergy >= 100) {
            setGameState(GameState.IDLE);
            showQuote(`Buongiorno ${USER_NAME}, ho fame.`);
          }

          return {
            hunger: newHunger,
            energy: newEnergy,
            happiness: newHappiness,
            poopCount: newPoop
          };
        });
      }
    }, 1000);

    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, [gameState]);


  // --- INTERACTION HANDLERS ---

  const handleFeed = () => {
    if (gameState === GameState.SLEEPING || gameState === GameState.DEAD) return;
    setActiveMenu('FOOD');
  };

  const confirmFood = () => {
    const foods = Object.values(FoodType);
    const selected = foods[foodSelection];
    
    setGameState(GameState.EATING);
    setActiveMenu('NONE');
    
    setTimeout(() => {
      setStats(prev => ({
        ...prev,
        hunger: Math.min(100, prev.hunger + 40), // Food fills more
        happiness: Math.min(100, prev.happiness + 15)
      }));
      setGameState(GameState.IDLE);
      
      if (selected === FoodType.AVOCADO) showQuote(`${USER_NAME}, less is more, ma l'avocado è extra.`);
      if (selected === FoodType.UOVA_PEPE) showQuote("Proteine per il design, grazie Tilde.");
      if (selected === FoodType.CAFFE) showQuote(`Il caffè è nero come il mio pixel, ${USER_NAME}.`);

    }, 2000);
  };

  const handleClean = () => {
    if (gameState === GameState.SLEEPING || gameState === GameState.DEAD) return;
    if (stats.poopCount > 0) {
      setStats(prev => ({ ...prev, poopCount: 0, happiness: prev.happiness + 20 }));
      showQuote(`Spazio, luce, ordine. Grazie ${USER_NAME}.`);
    } else {
      showQuote(`È già pulito, ${USER_NAME}.`);
    }
  };

  const handleLight = () => {
    if (gameState === GameState.DEAD) return;
    if (gameState === GameState.SLEEPING) {
      setGameState(GameState.IDLE);
      showQuote("Troppa luce.");
    } else {
      setGameState(GameState.SLEEPING);
    }
  };

  const handleTalk = () => {
    if (gameState === GameState.SLEEPING || gameState === GameState.DEAD) return;
    showQuote();
  };

  // --- BUTTON INPUTS ---
  
  const btnA = () => {
    // Select / Cycle
    if (activeMenu === 'FOOD') {
      setFoodSelection(prev => (prev + 1) % 3);
    }
  };

  const btnB = () => {
    // Confirm / Action
    if (activeMenu === 'FOOD') {
      confirmFood();
    } else if (activeMenu === 'NONE') {
      handleTalk(); // Default action if no menu
    }
  };

  const btnC = () => {
    // Cancel / Back
    if (activeMenu !== 'NONE') {
      setActiveMenu('NONE');
    }
  };

  // --- RENDER HELPERS ---
  const foods = Object.values(FoodType);

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

            {/* STATUS BAR */}
            <div className="flex justify-between px-1 pt-1 z-10 text-[8px] text-[#4a5043]">
               <div className="flex gap-1">
                 {gameState === GameState.DEAD ? <span className="animate-pulse text-red-900">DEAD</span> : (
                   <>
                     <Utensils size={10} className={stats.hunger < 30 ? "animate-bounce text-red-800" : "opacity-30"} />
                     <Heart size={10} className={stats.happiness < 30 ? "animate-bounce text-red-800" : "opacity-30"} />
                   </>
                 )}
               </div>
               <div className="flex gap-1">
                  {gameState === GameState.SLEEPING && <Moon size={10} className="text-blue-900" />}
               </div>
            </div>

            {/* MAIN GAME AREA */}
            <div className="flex-1 relative flex flex-col items-center justify-center z-10">
              
              {/* SPEECH BUBBLE */}
              {isMessageVisible && (
                <div className="absolute top-0 left-0 right-0 bg-[#4a5043] text-[#9ea792] p-2 text-[8px] leading-tight text-center border border-[#2d3129] shadow-md z-30 animate-fade-in">
                  {message}
                </div>
              )}

              {/* PIXEL ART CANVAS */}
              <div className="w-32 h-32 relative">
                <PixelFerret state={gameState} frame={frame} />
                
                {/* POOP RENDER */}
                {stats.poopCount > 0 && (
                  <div className="absolute bottom-2 right-0 text-xl animate-pulse">
                    💩
                  </div>
                )}
                {stats.poopCount > 1 && (
                  <div className="absolute bottom-2 left-0 text-xl animate-pulse">
                    💩
                  </div>
                )}
              </div>

              {/* OVERLAY MENU */}
              {activeMenu === 'FOOD' && (
                <div className="absolute bottom-0 w-full bg-[#4a5043] text-[#9ea792] p-2 text-[10px] z-40">
                  <div className="text-center mb-1 border-b border-[#9ea792] pb-1">MENU</div>
                  {foods.map((f, i) => (
                    <div key={f} className={`flex justify-between px-2 ${i === foodSelection ? 'bg-[#9ea792] text-[#4a5043] animate-pulse' : ''}`}>
                       <span>{f}</span>
                       {i === foodSelection && <span>&lt;</span>}
                    </div>
                  ))}
                </div>
              )}

            </div>
        </div>

        {/* BUTTON LABELS */}
        <div className="flex w-[200px] justify-between text-[8px] font-bold text-gray-400 mt-2 px-4">
           <span>A</span>
           <span>B</span>
           <span>C</span>
        </div>

        {/* PHYSICAL BUTTONS */}
        <div className="flex gap-4 mt-1">
          <button 
            onClick={btnA}
            className="w-10 h-10 bg-yellow-400 rounded-full shadow-[0_4px_0_#b45309] active:shadow-none active:translate-y-1 active:bg-yellow-500 transition-all"
            aria-label="Select"
          ></button>
          <button 
            onClick={btnB}
            className="w-10 h-10 bg-yellow-400 rounded-full shadow-[0_4px_0_#b45309] active:shadow-none active:translate-y-1 active:bg-yellow-500 transition-all mt-4"
             aria-label="Confirm"
          ></button>
          <button 
            onClick={btnC}
            className="w-10 h-10 bg-yellow-400 rounded-full shadow-[0_4px_0_#b45309] active:shadow-none active:translate-y-1 active:bg-yellow-500 transition-all"
             aria-label="Cancel"
          ></button>
        </div>

      </div>

      {/* EXTERNAL CONTROLS (ICONS) */}
      <div className="mt-8 flex gap-4">
          <button onClick={handleFeed} className="p-3 bg-white/10 rounded-lg hover:bg-white/20 active:scale-95 transition-all text-pink-300">
            <Utensils size={24} />
          </button>
          <button onClick={handleClean} className="p-3 bg-white/10 rounded-lg hover:bg-white/20 active:scale-95 transition-all text-blue-300">
            <Trash2 size={24} />
          </button>
          <button onClick={handleLight} className="p-3 bg-white/10 rounded-lg hover:bg-white/20 active:scale-95 transition-all text-yellow-300">
             {gameState === GameState.SLEEPING ? <Zap size={24} /> : <Moon size={24} />}
          </button>
          <button onClick={handleTalk} className="p-3 bg-white/10 rounded-lg hover:bg-white/20 active:scale-95 transition-all text-green-300">
            <MessageSquare size={24} />
          </button>
      </div>

      <MusicPlayer playlist={PLAYLIST} />

      <div className="mt-8 text-[8px] text-gray-500 text-center max-w-xs">
        <p>Use buttons A/B/C for authentic controls or icons for shortcuts.</p>
        <p className="mt-2">Ciao {USER_NAME}.</p>
      </div>

    </div>
  );
};

export default App;