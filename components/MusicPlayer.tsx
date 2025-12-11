
import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, SkipForward, Music, AlertCircle } from 'lucide-react';
import { Track } from '../types';

interface MusicPlayerProps {
  playlist: Track[];
  theme: any; // Using any for simplicity in linking with parent theme object
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ playlist, theme }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [error, setError] = useState(false);
  
  // Native HTML5 Audio reference
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = playlist[currentTrackIndex];

  // Handle track changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = currentTrack.src;
      audioRef.current.load();
      setError(false);
      
      if (isPlaying) {
        audioRef.current.play().catch(e => {
            console.warn(`Playback prevented or error for: ${currentTrack.src}`);
            setError(true);
            setIsPlaying(false);
        });
      }
    }
  }, [currentTrackIndex]);

  // Handle Play/Pause toggle
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(e => {
            console.warn("Play prevented");
            setIsPlaying(false);
          });
        }
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % playlist.length);
  };

  const handleError = () => {
    console.error(`Audio Source Error for file: ${currentTrack.src}`);
    setError(true);
    setTimeout(() => { nextTrack(); }, 2000);
  };

  const handleEnded = () => {
    nextTrack();
  };

  // Extract theme colors or default
  const borderColor = theme?.shell?.split(' ')[1] || 'border-neutral-700';
  const iconColor = theme?.highlight?.replace('text-', 'text-') || 'text-green-400';
  const marqueeColor = theme?.highlight?.replace('text-', 'text-') || 'text-green-400';

  return (
    <div className={`mt-10 w-full max-w-[320px] bg-neutral-900 border-4 ${borderColor} rounded-xl p-4 flex flex-col gap-3 shadow-2xl relative overflow-hidden transition-colors duration-700`}>
      <audio ref={audioRef} onEnded={handleEnded} onError={handleError} />

      {/* Decorative Elements */}
      <div className="absolute top-[-10px] right-[-10px] opacity-10 pointer-events-none">
        <div className={`w-24 h-24 rounded-full border-8 border-dashed border-white ${isPlaying ? 'animate-spin' : ''}`} style={{animationDuration: '4s'}}></div>
      </div>

      {/* Screen Area */}
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

      {/* Controls */}
      <div className="flex justify-center gap-8 z-10">
        <button 
          onClick={() => setIsPlaying(!isPlaying)} 
          className="text-neutral-500 hover:text-white active:scale-95 transition-all transform hover:scale-110"
        >
          {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" />}
        </button>
        <button 
          onClick={nextTrack}
          className="text-neutral-500 hover:text-white active:scale-95 transition-all transform hover:scale-110"
        >
          <SkipForward size={32} fill="currentColor" />
        </button>
      </div>
    </div>
  );
};

export default MusicPlayer;
