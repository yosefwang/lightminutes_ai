'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
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
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(propDuration && propDuration > 0 ? propDuration : 0);
  const [isMuted, setIsMuted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragTime, setDragTime] = useState(0);
  const [wasPlayingBeforeDrag, setWasPlayingBeforeDrag] = useState(false);
  const [src, setSrc] = useState<string>('');

  const getAudioSrc = useCallback(() => {
    if (audioBase64) {
      return `data:audio/webm;base64,${audioBase64}`;
    }
    if (!audioPath) return '';

    // If it's a cloudflarestorage.com URL, use our proxy instead
    if (audioPath.includes('r2.cloudflarestorage.com')) {
      // Extract the key from the URL
      const url = new URL(audioPath);
      const key = url.pathname.startsWith('/') ? url.pathname.slice(1) : url.pathname;
      return `/api/r2/audio/${key}`;
    }

    // If it looks like a users/... path and not a full URL, use proxy
    if (audioPath.startsWith('users/') && !audioPath.startsWith('http')) {
      return `/api/r2/audio/${audioPath}`;
    }

    return audioPath;
  }, [audioPath, audioBase64]);

  // Update src when inputs change
  useEffect(() => {
    const newSrc = getAudioSrc();
    setSrc(newSrc);
  }, [getAudioSrc]);

  // Update duration from props
  useEffect(() => {
    if (propDuration && propDuration > 0 && isFinite(propDuration)) {
      setDuration(propDuration);
    }
  }, [propDuration]);

  // Handle play/pause
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch(e => console.log('Play failed:', e));
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  // Handle mute
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.muted = isMuted;
    }
  }, [isMuted]);

  const handleLoadedMetadata = useCallback(() => {
    const audio = audioRef.current;
    if (audio && audio.duration && isFinite(audio.duration) && audio.duration > 0) {
      setDuration(audio.duration);
    }
  }, []);

  const handleTimeUpdate = useCallback(() => {
    const audio = audioRef.current;
    if (audio && !isDragging) {
      setCurrentTime(audio.currentTime || 0);
    }
  }, [isDragging]);

  const handleEnded = useCallback(() => {
    onPlayPause();
    setCurrentTime(0);
  }, [onPlayPause]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (!isNaN(time)) {
      const audio = audioRef.current;
      const validDuration = duration > 0 && isFinite(duration) ? duration : 0;
      const clampedTime = validDuration > 0 ? Math.max(0, Math.min(time, validDuration)) : 0;
      setDragTime(clampedTime);
      if (audio && validDuration > 0) {
        audio.currentTime = clampedTime;
      }
    }
  };

  const handleSeekStart = () => {
    setIsDragging(true);
    setDragTime(currentTime);
    setWasPlayingBeforeDrag(isPlaying);
    const audio = audioRef.current;
    if (audio && isPlaying) {
      audio.pause();
    }
  };

  const handleSeekEnd = (e: React.MouseEvent<HTMLInputElement> | React.TouchEvent<HTMLInputElement>) => {
    setIsDragging(false);
    const target = e.target as HTMLInputElement;
    const time = parseFloat(target.value);
    const audio = audioRef.current;
    if (audio && !isNaN(time)) {
      const validDuration = duration > 0 && isFinite(duration) ? duration : 0;
      const clampedTime = validDuration > 0 ? Math.max(0, Math.min(time, validDuration)) : 0;
      if (validDuration > 0) {
        audio.currentTime = clampedTime;
        setCurrentTime(clampedTime);
        if (wasPlayingBeforeDrag) {
          audio.play().catch(e => console.log('Play failed:', e));
        }
      }
    }
  };

  const displayTime = isDragging ? dragTime : currentTime;
  const validDuration = duration > 0 && isFinite(duration) ? duration : 0;
  const remainingTime = validDuration > 0 ? Math.max(0, validDuration - displayTime) : 0;
  const progress = validDuration > 0 ? (displayTime / validDuration) * 100 : 0;
  const hasAudio = !!src;

  return (
    <div className={cn('flex items-center gap-2 sm:gap-3 w-full', className)}>
      <audio
        ref={audioRef}
        src={src}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onCanPlay={handleLoadedMetadata}
        preload="metadata"
      />

      <button
        onClick={onPlayPause}
        disabled={!hasAudio}
        className={cn(
          "flex-shrink-0 w-10 h-10 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-colors",
          hasAudio
            ? "bg-primary text-primary-foreground hover:bg-primary/90"
            : "bg-muted text-muted-foreground cursor-not-allowed"
        )}
      >
        {isPlaying ? (
          <Pause className="w-5 h-5 fill-current" />
        ) : (
          <Play className="w-5 h-5 fill-current ml-0.5" />
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
            disabled={validDuration <= 0 || !hasAudio}
            className={cn(
              "w-full h-2 rounded-lg appearance-none cursor-pointer",
              validDuration > 0 && hasAudio
                ? "accent-primary"
                : "cursor-not-allowed"
            )}
            style={{
              background: validDuration > 0 && hasAudio
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
        disabled={!hasAudio}
        className={cn(
          "flex-shrink-0 p-2 transition-colors",
          hasAudio
            ? "text-muted-foreground hover:text-foreground"
            : "text-muted-foreground/50 cursor-not-allowed"
        )}
      >
        {isMuted ? (
          <VolumeX className="w-5 h-5" />
        ) : (
          <Volume2 className="w-5 h-5" />
        )}
      </button>
    </div>
  );
}
