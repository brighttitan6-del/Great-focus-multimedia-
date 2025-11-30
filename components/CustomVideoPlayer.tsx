import React, { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, Loader2, RotateCcw } from 'lucide-react';

interface CustomVideoPlayerProps {
  url: string;
  autoPlay?: boolean;
}

export const CustomVideoPlayer: React.FC<CustomVideoPlayerProps> = ({ url, autoPlay = false }) => {
  const [hasWindow, setHasWindow] = useState(false);
  const playerRef = useRef<ReactPlayer>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [playing, setPlaying] = useState(autoPlay);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [played, setPlayed] = useState(0);
  const [loaded, setLoaded] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    setHasWindow(true);
    
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const formatTime = (seconds: number) => {
    if (!seconds) return '00:00';
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = date.getUTCSeconds().toString().padStart(2, '0');
    if (hh) {
      return `${hh}:${mm.toString().padStart(2, '0')}:${ss}`;
    }
    return `${mm}:${ss}`;
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    if (playing) {
      controlsTimeoutRef.current = window.setTimeout(() => setShowControls(false), 3000);
    }
  };

  const togglePlay = () => setPlaying(!playing);
  
  const toggleMute = () => setMuted(!muted);
  
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlayed(parseFloat(e.target.value));
  };

  const handleSeekMouseDown = () => {
    setIsSeeking(true);
  };

  const handleSeekMouseUp = (e: React.MouseEvent<HTMLInputElement>) => {
    setIsSeeking(false);
    if (playerRef.current) {
      playerRef.current.seekTo(parseFloat((e.target as HTMLInputElement).value));
    }
  };

  const handleProgress = (state: { played: number; loaded: number }) => {
    if (!isSeeking) {
      setPlayed(state.played);
      setLoaded(state.loaded);
    }
  };

  if (!hasWindow) return null;

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full bg-black group overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => playing && setShowControls(false)}
    >
      <ReactPlayer
        ref={playerRef}
        url={url}
        width="100%"
        height="100%"
        playing={playing}
        volume={volume}
        muted={muted}
        onProgress={handleProgress}
        onDuration={setDuration}
        onBuffer={() => setIsBuffering(true)}
        onBufferEnd={() => setIsBuffering(false)}
        onEnded={() => setPlaying(false)}
        config={{
          file: {
             attributes: {
                controlsList: 'nodownload'
             }
          },
          youtube: {
             playerVars: { showinfo: 0, controls: 0, modestbranding: 1, rel: 0 }
          }
        }}
      />

      {/* Buffering Indicator */}
      {isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <Loader2 className="w-12 h-12 text-brand-primary animate-spin" />
        </div>
      )}

      {/* Click Overlay (Play/Pause) */}
      <div 
         className="absolute inset-0 z-10"
         onClick={togglePlay} 
      />

      {/* Custom Controls */}
      <div 
        className={`absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/90 via-black/60 to-transparent px-4 py-4 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}
      >
        {/* Progress Bar */}
        <div className="group/progress relative h-1 bg-gray-600 rounded-full mb-4 cursor-pointer">
           <div 
              className="absolute top-0 left-0 h-full bg-gray-400 rounded-full" 
              style={{ width: `${loaded * 100}%` }} 
           />
           <div 
              className="absolute top-0 left-0 h-full bg-brand-primary rounded-full relative" 
              style={{ width: `${played * 100}%` }}
           >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full scale-0 group-hover/progress:scale-100 transition-transform shadow-md" />
           </div>
           <input
            type="range"
            min={0}
            max={0.999999}
            step="any"
            value={played}
            onMouseDown={handleSeekMouseDown}
            onChange={handleSeekChange}
            onMouseUp={handleSeekMouseUp}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={togglePlay} className="text-white hover:text-brand-primary transition-colors relative z-30">
              {playing ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current" />}
            </button>
            
            <div className="flex items-center gap-2 group/volume relative z-30">
              <button onClick={toggleMute} className="text-white hover:text-brand-primary transition-colors">
                {muted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
              <div className="w-0 overflow-hidden group-hover/volume:w-20 transition-all duration-300">
                <input
                  type="range"
                  min={0}
                  max={1}
                  step="any"
                  value={volume}
                  onChange={(e) => {
                    setVolume(parseFloat(e.target.value));
                    setMuted(parseFloat(e.target.value) === 0);
                  }}
                  className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-brand-primary"
                />
              </div>
            </div>

            <div className="text-xs text-gray-300 font-medium font-mono select-none">
              {formatTime(duration * played)} / {formatTime(duration)}
            </div>
          </div>

          <div className="flex items-center gap-3 relative z-30">
             <button 
                onClick={() => {
                   playerRef.current?.seekTo(0);
                   setPlaying(true);
                }} 
                className="text-white hover:text-brand-primary transition-colors"
                title="Replay"
             >
                <RotateCcw className="w-4 h-4" />
             </button>
             <button onClick={toggleFullscreen} className="text-white hover:text-brand-primary transition-colors">
               {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}