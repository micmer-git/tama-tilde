
import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, SkipForward, Music, AlertCircle } from 'lucide-react';
import { Track } from '../types';

interface MusicPlayerProps {
  playlist: Track[];
  theme: any;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ playlist, theme }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [error, setError] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const currentTrack = playlist[currentTrackIndex];

  // Colors
  const borderColor = theme?.shell?.split(' ')[1] || 'border-neutral-700';
  const marqueeColor = theme?.highlight?.replace('text-', 'text-') || 'text-green-400';

  // Autoplay on mount
  useEffect(() => {
    const attemptAutoplay = async () => {
      if (audioRef.current) {
        try {
          await audioRef.current.play();
          setIsPlaying(true);
        } catch (err) {
          console.warn("Autoplay blocked by browser policy:", err);
          setIsPlaying(false);
        }
      }
    };
    attemptAutoplay();
  }, []);

  // Handle track changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = currentTrack.src;
      audioRef.current.load();
      setError(false);
      
      if (isPlaying) {
        audioRef.current.play().catch(e => {
            console.warn(`Playback prevented: ${currentTrack.src}`);
            setError(true);
            setIsPlaying(false);
        });
      }
    }
  }, [currentTrackIndex]);

  // Handle Play/Pause toggle state sync
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % playlist.length);
  };

  const handleError = () => {
    setError(true);
    setTimeout(() => { nextTrack(); }, 2000);
  };

  return (
    <>
      <audio ref={audioRef} onEnded={nextTrack} onError={handleError} />
      
      {/* DESKTOP VIEW: Retro Card */}
      <div className={`hidden md:flex mt-4 w-full max-w-[320px] bg-neutral-900 border-4 ${borderColor} rounded-xl p-4 flex-col gap-3 shadow-2xl relative overflow-hidden transition-colors duration-700`}>
        <div className="absolute top-[-10px] right-[-10px] opacity-10 pointer-events-none">
          <div className={`w-24 h-24 rounded-full border-8 border-dashed border-white ${isPlaying ? 'animate-spin' : ''}`} style={{animationDuration: '4s'}}></div>
        </div>
        <div className="bg-black/50 rounded p-2 border border-white/10 flex items-center justify-between text-xs font-mono z-10">
          <div className={`flex items-center gap-2 overflow-hidden whitespace-nowrap w-full ${marqueeColor}`}>
             {error ? <AlertCircle size={14} className="text-red-500 shrink-0" /> : <Music size={14} className={`shrink-0 ${isPlaying ? "animate-pulse" : ""}`} />}
             <div className="w-full overflow-hidden relative">
               <span className="marquee block uppercase tracking-wider">
                  {error ? `ERR: ${currentTrack.src}` : `${currentTrack.artist} - ${currentTrack.title}`}
               </span>
             </div>
          </div>
        </div>
        <div className="flex justify-center gap-8 z-10">
          <button onClick={() => setIsPlaying(!isPlaying)} className="text-neutral-500 hover:text-white active:scale-95 transition-all transform hover:scale-110">
            {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" />}
          </button>
          <button onClick={nextTrack} className="text-neutral-500 hover:text-white active:scale-95 transition-all transform hover:scale-110">
            <SkipForward size={32} fill="currentColor" />
          </button>
        </div>
      </div>

      {/* MOBILE VIEW: Compact Bottom Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-neutral-900/90 backdrop-blur-md border-t border-white/10 flex items-center px-4 justify-between z-50 pb-safe">
         <div className="flex items-center gap-3 overflow-hidden flex-1 mr-4">
            <div className={`w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center border border-white/10 shrink-0 ${isPlaying ? 'animate-spin-slow' : ''}`}>
               <Music size={14} className={marqueeColor} />
            </div>
            <div className="flex flex-col overflow-hidden">
               <span className={`text-[10px] uppercase font-bold truncate ${marqueeColor}`}>{currentTrack.title}</span>
               <span className="text-[9px] text-neutral-500 truncate">{currentTrack.artist}</span>
            </div>
         </div>
         <div className="flex items-center gap-4 shrink-0">
             <button onClick={() => setIsPlaying(!isPlaying)} className="text-white active:scale-90 transition-transform">
               {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
             </button>
             <button onClick={nextTrack} className="text-white active:scale-90 transition-transform">
               <SkipForward size={24} fill="currentColor" />
             </button>
         </div>
      </div>
      <style>{`
        .pb-safe { padding-bottom: env(safe-area-inset-bottom); }
        .animate-spin-slow { animation: spin 4s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </>
  );
};

export default MusicPlayer;

