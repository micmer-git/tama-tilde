
import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, SkipForward, Music, AlertCircle, FolderOpen } from 'lucide-react';
import { Track } from '../types';

interface MusicPlayerProps {
  playlist: Track[];
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ playlist }) => {
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
            console.error("Playback error:", e);
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
            console.error("Play prevented:", e);
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
    setError(true);
    // Auto skip after 2 seconds if file missing
    setTimeout(() => {
       if (error) nextTrack(); 
    }, 2000);
  };

  const handleEnded = () => {
    nextTrack();
  };

  return (
    <div className="mt-6 w-full max-w-[280px] bg-neutral-900 border-2 border-neutral-700 rounded-lg p-3 flex flex-col gap-2 shadow-lg relative overflow-hidden">
      {/* Hidden Audio Element */}
      <audio 
        ref={audioRef} 
        onEnded={handleEnded} 
        onError={handleError}
      />

      {/* Decorative Tape Reel Background */}
      <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
        <div className={`w-16 h-16 rounded-full border-4 border-dashed border-white ${isPlaying ? 'animate-spin' : ''}`} style={{animationDuration: '3s'}}></div>
      </div>

      <div className="flex items-center justify-between text-green-400 text-xs font-mono border-b border-green-900 pb-2 z-10">
        <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap w-full">
           {error ? <AlertCircle size={12} className="text-red-500 shrink-0" /> : <Music size={12} className={`shrink-0 ${isPlaying ? "animate-pulse" : ""}`} />}
           <div className="w-full overflow-hidden relative">
             <span className="marquee block">
                {error ? `FILE NOT FOUND: ${currentTrack.src}` : `${currentTrack.artist} - ${currentTrack.title}`}
             </span>
           </div>
        </div>
      </div>

      <div className="flex justify-center gap-6 z-10">
        <button 
          onClick={() => setIsPlaying(!isPlaying)} 
          className="text-neutral-400 hover:text-green-400 active:scale-95 transition-all"
          title={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
        </button>
        <button 
          onClick={nextTrack}
          className="text-neutral-400 hover:text-green-400 active:scale-95 transition-all"
          title="Next Track"
        >
          <SkipForward size={24} fill="currentColor" />
        </button>
      </div>
      
      {error && (
        <div className="text-[8px] text-red-400 text-center font-mono mt-1">
          Make sure '{currentTrack.src}' exists in /audio folder
        </div>
      )}
    </div>
  );
};

export default MusicPlayer;
