'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AudioPlayerProps {
  audioPath?: string;
  audioBase64?: string;
  isPlaying: boolean;
  onPlayPause: () => void;
  className?: string;
  duration?: number | null;
}

const formatTime = (seconds: number): string => {
  if (!isFinite(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const formatRemainingTime = (seconds: number): string => {
  if (!isFinite(seconds) || seconds < 0) return '-0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `-${mins}:${secs.toString().padStart(2, '0')}`;
};

export function AudioPlayer({ audioPath, audioBase64, isPlaying, onPlayPause, className, duration: propDuration }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(propDuration && propDuration > 0 ? propDuration : 0);
  const [isMuted, setIsMuted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragTime, setDragTime] = useState(0);
  const [wasPlayingBeforeDrag, setWasPlayingBeforeDrag] = useState(false);

  const getAudioSrc = () => {
    if (audioBase64) {
      return `data:audio/webm;base64,${audioBase64}`;
    }
    return audioPath || '';
  };

  useEffect(() => {
    if (propDuration && propDuration > 0 && isFinite(propDuration)) {
      setDuration(propDuration);
    }
  }, [propDuration]);

  useEffect(() => {
    const src = getAudioSrc();
    if (!src) return;

    if (!audioRef.current) {
      audioRef.current = new Audio();
    }

    const audio = audioRef.current;

    const handleLoadedMetadata = () => {
      if (audio.duration && isFinite(audio.duration) && audio.duration > 0) {
        setDuration(audio.duration);
      }
    };

    const handleTimeUpdate = () => {
      if (!isDragging) {
        setCurrentTime(audio.currentTime || 0);
      }
      if (duration === 0 || !isFinite(duration)) {
        handleLoadedMetadata();
      }
    };

    const handleEnded = () => {
      onPlayPause();
      setCurrentTime(0);
    };

    const handleCanPlay = () => {
      handleLoadedMetadata();
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    if (audio.src !== src) {
      audio.src = src;
    }

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [audioPath, audioBase64, onPlayPause, duration]);

  useEffect(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.play().catch(e => console.log('Play failed:', e));
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (!isNaN(time)) {
      const validDuration = duration > 0 && isFinite(duration) ? duration : 0;
      const clampedTime = validDuration > 0 ? Math.max(0, Math.min(time, validDuration)) : 0;
      setDragTime(clampedTime);
      if (audioRef.current && validDuration > 0) {
        audioRef.current.currentTime = clampedTime;
      }
    }
  };

  const handleSeekStart = () => {
    setIsDragging(true);
    setDragTime(currentTime);
    setWasPlayingBeforeDrag(isPlaying);
    if (audioRef.current && isPlaying) {
      audioRef.current.pause();
    }
  };

  const handleSeekEnd = (e: React.MouseEvent<HTMLInputElement> | React.TouchEvent<HTMLInputElement>) => {
    setIsDragging(false);
    const target = e.target as HTMLInputElement;
    const time = parseFloat(target.value);
    if (audioRef.current && !isNaN(time)) {
      const validDuration = duration > 0 && isFinite(duration) ? duration : 0;
      const clampedTime = validDuration > 0 ? Math.max(0, Math.min(time, validDuration)) : 0;
      if (validDuration > 0) {
        audioRef.current.currentTime = clampedTime;
        setCurrentTime(clampedTime);
        if (wasPlayingBeforeDrag) {
          audioRef.current.play().catch(e => console.log('Play failed:', e));
        }
      }
    }
  };

  const displayTime = isDragging ? dragTime : currentTime;
  const validDuration = duration > 0 && isFinite(duration) ? duration : 0;
  const remainingTime = validDuration > 0 ? Math.max(0, validDuration - displayTime) : 0;
  const progress = validDuration > 0 ? (displayTime / validDuration) * 100 : 0;

  return (
    <div className={cn('flex items-center gap-2 sm:gap-3 w-full', className)}>
      <button
        onClick={onPlayPause}
        className="flex-shrink-0 w-11 h-11 sm:w-10 sm:h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors shadow-sm min-h-[2.75rem] min-w-[2.75rem] active:scale-[0.97]"
      >
        {isPlaying ? (
          <Pause className="w-5.5 h-5.5 sm:w-5 sm:h-5 fill-current" />
        ) : (
          <Play className="w-5.5 h-5.5 sm:w-5 sm:h-5 fill-current ml-0.5" />
        )}
      </button>

      <div className="flex-1">
        <div className="w-full">
          <input
            type="range"
            min={0}
            max={validDuration > 0 ? validDuration : 1}
            step={0.1}
            value={validDuration > 0 ? displayTime : 0}
            onChange={handleInput}
            onMouseDown={validDuration > 0 ? handleSeekStart : undefined}
            onMouseUp={validDuration > 0 ? handleSeekEnd : undefined}
            onTouchStart={validDuration > 0 ? handleSeekStart : undefined}
            onTouchEnd={validDuration > 0 ? handleSeekEnd : undefined}
            disabled={validDuration <= 0}
            className={cn(
              "w-full h-2.5 sm:h-2 rounded-lg appearance-none accent-primary touch-none",
              validDuration > 0
                ? "bg-muted cursor-pointer"
                : "bg-muted/50 cursor-not-allowed"
            )}
            style={{
              background: validDuration > 0
                ? `linear-gradient(to right, hsl(var(--primary)) ${progress}%, hsl(var(--muted)) ${progress}%)`
                : undefined,
            }}
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>{formatTime(displayTime)}</span>
          <span>{formatRemainingTime(remainingTime)}</span>
        </div>
      </div>

      <button
        onClick={() => setIsMuted(!isMuted)}
        className="flex-shrink-0 p-2.5 sm:p-2 text-muted-foreground hover:text-foreground transition-colors min-h-[2.75rem] min-w-[2.75rem] active:scale-[0.97]"
      >
        {isMuted ? (
          <VolumeX className="w-5.5 h-5.5 sm:w-5 sm:h-5" />
        ) : (
          <Volume2 className="w-5.5 h-5.5 sm:w-5 sm:h-5" />
        )}
      </button>
    </div>
  );
}
