
import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, SkipForward, Music, AlertCircle, Shuffle } from 'lucide-react';
import { Track } from '../types';

interface MusicPlayerProps {
  playlist: Track[];
  theme: any;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ playlist, theme }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [error, setError] = useState(false);
  const [hasAutoStarted, setHasAutoStarted] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const currentTrack = playlist[currentTrackIndex];

  // Colors
  const borderColor = theme?.shell?.split(' ')[1] || 'border-neutral-700';
  const marqueeColor = theme?.highlight?.replace('text-', 'text-') || 'text-green-400';

  const pickRandomIndex = () => {
    if (!playlist.length) return 0;
    return Math.floor(Math.random() * playlist.length);
  };

  useEffect(() => {
    setHasAutoStarted(false);
  }, [playlist]);

  // Autoplay on mount
  useEffect(() => {
    if (!playlist.length || hasAutoStarted) return;
    const startIndex = pickRandomIndex();
    setCurrentTrackIndex(startIndex);
    setIsPlaying(true);
    setHasAutoStarted(true);
  }, [playlist, hasAutoStarted]);

  // Handle track changes
  useEffect(() => {
    if (!audioRef.current || !currentTrack?.src) return;
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
  }, [currentTrackIndex, currentTrack?.src, isPlaying]);

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
    if (!playlist.length) return;
    setCurrentTrackIndex((prev) => (prev + 1) % playlist.length);
  };

  const shuffleTrack = () => {
    if (!playlist.length) return;
    setCurrentTrackIndex(pickRandomIndex());
  };

  const handleError = () => {
    setError(true);
    setTimeout(() => { nextTrack(); }, 2000);
  };

  return (
    <>
      <audio ref={audioRef} onEnded={nextTrack} onError={handleError} />
      
      {/* DESKTOP VIEW: Retro Card */}
      <div className={`hidden md:flex mt-2 w-full max-w-[320px] bg-neutral-900 border-4 ${borderColor} rounded-xl p-4 flex-col gap-3 shadow-2xl relative overflow-hidden transition-colors duration-700`}>
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
          <button onClick={shuffleTrack} className="text-neutral-500 hover:text-white active:scale-95 transition-all transform hover:scale-110">
            <Shuffle size={28} />
          </button>
        </div>
      </div>

      {/* MOBILE VIEW: Compact Integrated Card */}
      <div className="md:hidden w-full bg-neutral-900/80 backdrop-blur-md border border-white/10 rounded-xl p-3 flex items-center justify-between gap-3 shadow-lg">
         <div className="flex items-center gap-3 overflow-hidden flex-1 mr-2">
            <div className={`w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center border border-white/10 shrink-0 ${isPlaying ? 'animate-spin-slow' : ''}`}>
               <Music size={16} className={marqueeColor} />
            </div>
            <div className="flex flex-col overflow-hidden">
               <span className={`text-[11px] uppercase font-bold truncate ${marqueeColor}`}>{currentTrack.title}</span>
               <span className="text-[10px] text-neutral-400 truncate">{currentTrack.artist}</span>
            </div>
         </div>
         <div className="flex items-center gap-3 shrink-0">
             <button onClick={shuffleTrack} className="text-white active:scale-90 transition-transform" aria-label="Shuffle track">
               <Shuffle size={20} />
             </button>
             <button onClick={() => setIsPlaying(!isPlaying)} className="text-white active:scale-90 transition-transform" aria-label={isPlaying ? 'Pause' : 'Play'}>
               {isPlaying ? <Pause size={22} fill="currentColor" /> : <Play size={22} fill="currentColor" />}
             </button>
             <button onClick={nextTrack} className="text-white active:scale-90 transition-transform" aria-label="Next track">
               <SkipForward size={22} fill="currentColor" />
             </button>
         </div>
      </div>
      <style>{`
        .animate-spin-slow { animation: spin 4s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </>
  );
};

export default MusicPlayer;

