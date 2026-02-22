'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Mic, Square, Loader2, CheckCircle2, XCircle, AlertCircle, Settings, UploadCloud } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

interface RecorderProps {
  onUploadComplete?: (id: string) => void;
}

type RecorderState = 'idle' | 'recording' | 'uploading' | 'success' | 'error' | 'permission-denied';

const CHUNK_UPLOAD_THRESHOLD_SECONDS = 30;
const CHUNK_UPLOAD_INTERVAL_MS = 30000;

export function Recorder({ onUploadComplete }: RecorderProps) {
  const { t, lang } = useApp();
  const [state, setState] = useState<RecorderState>('idle');
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const accumulatedChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunkTimerRef = useRef<number | null>(null);
  const sessionIdRef = useRef<string | null>(null);
  const chunkIndexRef = useRef(0);
  const lastUploadDurationRef = useRef(0);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getMimeType = (): string => {
    if (typeof MediaRecorder === 'undefined') return 'audio/mp4';
    const types = ['audio/mp4', 'audio/m4a', 'audio/webm', 'audio/wav'];
    for (const type of types) {
      try {
        if (MediaRecorder.isTypeSupported(type)) return type;
      } catch (e) {}
    }
    return 'audio/mp4';
  };

  const getExtension = (mimeType: string): string => {
    if (mimeType.includes('mp4') || mimeType.includes('m4a')) return 'm4a';
    if (mimeType.includes('webm')) return 'webm';
    if (mimeType.includes('wav')) return 'wav';
    return 'm4a';
  };

  const generateSessionId = () => {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const uploadChunk = useCallback(async (isFinal: boolean = false) => {
    if (accumulatedChunksRef.current.length === 0 && !isFinal) return;

    const mimeType = getMimeType();
    const ext = getExtension(mimeType);

    if (!sessionIdRef.current) {
      sessionIdRef.current = generateSessionId();
    }

    const blob = new Blob(accumulatedChunksRef.current, { type: mimeType });
    accumulatedChunksRef.current = [];

    const formData = new FormData();
    formData.append('chunk', blob, `chunk_${chunkIndexRef.current}.${ext}`);
    formData.append('sessionId', sessionIdRef.current);
    formData.append('chunkIndex', chunkIndexRef.current.toString());
    formData.append('duration', duration.toString());
    formData.append('mimeType', mimeType);
    formData.append('language', lang);
    formData.append('ext', ext);
    formData.append('isFinal', isFinal ? 'true' : 'false');

    try {
      const response = await fetch('/api/upload-chunk', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Chunk upload failed');

      const data = await response.json();
      chunkIndexRef.current++;

      if (data.completed && data.id) {
        return data.id;
      }
    } catch (err) {
      console.error('Chunk upload failed:', err);
      // Don't fail the whole recording for chunk upload issues - we'll upload everything at the end
    }

    return null;
  }, [duration, lang]);

  const startRecording = useCallback(async () => {
    try {
      setError(null);
      chunksRef.current = [];
      accumulatedChunksRef.current = [];
      sessionIdRef.current = null;
      chunkIndexRef.current = 0;
      lastUploadDurationRef.current = 0;
      setUploadProgress(0);

      // Check for MediaRecorder support
      if (typeof MediaRecorder === 'undefined') {
        throw new Error(lang === 'zh' ? '您的浏览器不支持录音功能，请使用最新版Chrome、Safari或Firefox' : 'Your browser doesn\'t support recording. Please use the latest Chrome, Safari, or Firefox.');
      }

      // Check if mediaDevices is available - defensive check
      const mediaDevices = (navigator as any).mediaDevices;
      if (!mediaDevices || typeof mediaDevices.getUserMedia !== 'function') {
        const userAgent = (navigator as any).userAgent || '';
        const isIOS = /iPad|iPhone|iPod/.test(userAgent);
        if (isIOS) {
          throw new Error(
            lang === 'zh'
              ? '请确保通过 HTTPS 访问此网站，iOS Safari 要求 HTTPS 才能使用麦克风'
              : 'Please access this website over HTTPS - iOS Safari requires HTTPS for microphone access'
          );
        }
        throw new Error(lang === 'zh' ? '您的浏览器不支持录音功能，请使用最新版Chrome、Safari或Firefox' : 'Your browser doesn\'t support recording. Please use the latest Chrome, Safari, or Firefox.');
      }

      // Use modern API
      const stream = await mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });

      streamRef.current = stream;

      const mimeType = getMimeType();
      let mediaRecorder: MediaRecorder;
      try {
        mediaRecorder = new MediaRecorder(stream, { mimeType });
      } catch (e) {
        mediaRecorder = new MediaRecorder(stream);
      }

      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunksRef.current.push(e.data);
          accumulatedChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.start(500);
      setDuration(0);
      setState('recording');

      timerRef.current = window.setInterval(() => {
        setDuration((d) => d + 1);
      }, 1000);

      // Set up periodic chunk upload for long recordings
      chunkTimerRef.current = window.setInterval(async () => {
        if (duration - lastUploadDurationRef.current >= CHUNK_UPLOAD_THRESHOLD_SECONDS) {
          lastUploadDurationRef.current = duration;
          setUploadProgress((p) => Math.min(p + 10, 90));
          await uploadChunk(false);
        }
      }, CHUNK_UPLOAD_INTERVAL_MS);
    } catch (err: any) {
      console.error('Failed to start recording:', err);

      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }

      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setState('permission-denied');
        const userAgent = (navigator as any).userAgent || '';
        const isIOS = /iPad|iPhone|iPod/.test(userAgent);
        setError(isIOS
          ? (lang === 'zh' ? '请在 iPhone "设置" > "Safari浏览器" > "麦克风" 中开启权限' : 'Please enable microphone in Settings > Safari > Microphone')
          : (lang === 'zh' ? '请在浏览器设置中开启麦克风权限' : 'Please enable microphone permission in browser settings')
        );
      } else {
        setState('error');
        setError(err.message || String(err));
      }
    }
  }, [t, lang, duration, uploadChunk]);

  const stopRecording = useCallback(async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (chunkTimerRef.current) {
      clearInterval(chunkTimerRef.current);
      chunkTimerRef.current = null;
    }

    if (mediaRecorderRef.current && state === 'recording') {
      const stopPromise = new Promise<void>((resolve) => {
        if (mediaRecorderRef.current) {
          mediaRecorderRef.current.onstop = () => resolve();
          mediaRecorderRef.current.stop();
        } else {
          resolve();
        }
      });

      await stopPromise;

      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }

      setState('uploading');
      setUploadProgress(50);

      // Try chunked upload first if we have a session
      let recordingId: string | null = null;
      if (sessionIdRef.current && chunkIndexRef.current > 0) {
        try {
          recordingId = await uploadChunk(true);
        } catch (err) {
          console.error('Final chunk upload failed, falling back to full upload:', err);
        }
      }

      // Fallback to traditional upload if chunked didn't work
      if (!recordingId) {
        const mimeType = getMimeType();
        const extension = getExtension(mimeType);
        const blob = new Blob(chunksRef.current, { type: mimeType });
        recordingId = await uploadAudio(blob, extension);
      }

      if (recordingId) {
        setUploadProgress(100);
        setState('success');
        fetch(`/api/process/${recordingId}`, { method: 'POST' });
        onUploadComplete?.(recordingId);

        setTimeout(() => {
          setState('idle');
          setDuration(0);
          setUploadProgress(0);
        }, 2000);
      }
    }
  }, [state, uploadChunk, onUploadComplete]);

  const uploadAudio = async (blob: Blob, extension: string): Promise<string | null> => {
    try {
      const mimeType = getMimeType();
      const formData = new FormData();
      formData.append('audio', blob, `recording_${Date.now()}.${extension}`);
      formData.append('duration', duration.toString());
      formData.append('mimeType', mimeType);
      formData.append('language', lang);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');
      const data = await response.json();
      return data.id;
    } catch (err) {
      console.error('Upload failed:', err);
      setError(t('recorder.uploadError'));
      setState('error');
      return null;
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (chunkTimerRef.current) clearInterval(chunkTimerRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <Card>
      <CardHeader className="pb-2">
        <h2 className="text-center text-lg font-semibold">{t('recorder.title')}</h2>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-col items-center gap-5 py-4">
          <div className="relative">
            {state === 'idle' && (
              <button
                onClick={startRecording}
                className={cn(
                  "w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-primary hover:bg-primary/90 flex items-center justify-center shadow-md transition-all"
                )}
              >
                <Mic className="w-8 h-8 sm:w-10 sm:h-10 text-primary-foreground" />
              </button>
            )}

            {state === 'recording' && (
              <button
                onClick={stopRecording}
                className={cn(
                  "w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-destructive flex items-center justify-center shadow-md animate-pulse"
                )}
              >
                <Square className="w-7 h-7 sm:w-8 sm:h-8 text-destructive-foreground fill-current" />
              </button>
            )}

            {state === 'uploading' && (
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-muted flex items-center justify-center">
                <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 text-primary animate-spin" />
              </div>
            )}

            {state === 'success' && (
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-600 dark:text-emerald-400" />
              </div>
            )}

            {(state === 'error' || state === 'permission-denied') && (
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                {state === 'permission-denied' ? (
                  <Settings className="w-8 h-8 sm:w-10 sm:h-10 text-red-600 dark:text-red-400" />
                ) : (
                  <XCircle className="w-8 h-8 sm:w-10 sm:h-10 text-red-600 dark:text-red-400" />
                )}
              </div>
            )}
          </div>

          {state === 'recording' && (
            <div className="text-3xl sm:text-4xl font-mono text-destructive font-bold tracking-tight">
              {formatDuration(duration)}
            </div>
          )}

          {state === 'idle' && (
            <p className="text-muted-foreground text-center text-sm sm:text-base">
              {t('recorder.start')}
            </p>
          )}

          {state === 'recording' && (
            <p className="text-destructive font-medium text-sm sm:text-base">
              {t('recorder.recording')}
            </p>
          )}

          {state === 'uploading' && (
            <div className="text-center w-full max-w-xs">
              <p className="text-primary font-medium text-sm sm:text-base mb-2 flex items-center justify-center gap-2">
                <UploadCloud className="w-4 h-4" />
                {t('recorder.uploading')}
              </p>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${Math.max(uploadProgress, 10)}%` }}
                />
              </div>
            </div>
          )}

          {state === 'recording' && duration > 0 && duration % 30 === 0 && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <UploadCloud className="w-3 h-3" />
              <span>Auto-saving...</span>
            </div>
          )}

          {state === 'success' && (
            <p className="text-emerald-600 dark:text-emerald-400 font-medium text-sm sm:text-base">
              {t('recorder.uploadSuccess')}
            </p>
          )}

          {(state === 'error' || state === 'permission-denied') && (
            <div className="text-center max-w-xs">
              <div className="flex items-center justify-center gap-2 text-destructive font-medium text-sm sm:text-base mb-2">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setState('idle')}
                className="text-primary hover:text-primary/90"
              >
                {t('recorder.cancel')}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
