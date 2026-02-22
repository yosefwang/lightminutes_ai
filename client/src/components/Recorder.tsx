import { useState, useRef, useEffect, useCallback } from 'react';
import { Mic, Square, Loader2, CheckCircle2, XCircle, AlertCircle, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { useApp } from '../contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { cn } from '../lib/utils';

interface RecorderProps {
  onUploadComplete?: (id: string) => void;
}

type RecorderState = 'idle' | 'recording' | 'uploading' | 'success' | 'error' | 'permission-denied';

export function Recorder({ onUploadComplete }: RecorderProps) {
  const { t, lang } = useApp();
  const [state, setState] = useState<RecorderState>('idle');
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

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

  const startRecording = useCallback(async () => {
    try {
      setError(null);
      chunksRef.current = [];

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
        }
      };

      mediaRecorder.start(500);
      setDuration(0);
      setState('recording');

      timerRef.current = window.setInterval(() => {
        setDuration((d) => d + 1);
      }, 1000);
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
  }, [t, lang]);

  const stopRecording = useCallback(async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
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

      const mimeType = getMimeType();
      const extension = getExtension(mimeType);
      const blob = new Blob(chunksRef.current, { type: mimeType });
      await uploadAudio(blob, extension);
    }
  }, [state, duration]);

  const uploadAudio = async (blob: Blob, extension: string) => {
    setState('uploading');
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

      setState('success');

      if (data.id) {
        fetch(`/api/process/${data.id}`, { method: 'POST' });
      }

      onUploadComplete?.(data.id);

      setTimeout(() => {
        setState('idle');
        setDuration(0);
      }, 2000);
    } catch (err) {
      console.error('Upload failed:', err);
      setError(t('recorder.uploadError'));
      setState('error');
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <Card className="overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-center text-lg">{t('recorder.title')}</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-col items-center gap-6 py-4">
            <div className="relative">
              {state === 'idle' && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={startRecording}
                  className={cn(
                    "w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-destructive hover:bg-destructive/90 flex items-center justify-center shadow-lg transition-all",
                    "min-h-[5rem] min-w-[5rem]"
                  )}
                >
                  <Mic className="w-8 h-8 sm:w-10 sm:h-10 text-destructive-foreground" />
                </motion.button>
              )}

              {state === 'recording' && (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={stopRecording}
                  className={cn(
                    "w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-destructive flex items-center justify-center shadow-lg animate-pulse-subtle",
                    "min-h-[5rem] min-w-[5rem]"
                  )}
                >
                  <Square className="w-7 h-7 sm:w-8 sm:h-8 text-destructive-foreground fill-current" />
                </motion.button>
              )}

              {state === 'uploading' && (
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-muted flex items-center justify-center">
                  <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 text-primary animate-spin" />
                </div>
              )}

              {state === 'success' && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center"
                >
                  <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-600" />
                </motion.div>
              )}

              {(state === 'error' || state === 'permission-denied') && (
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  {state === 'permission-denied' ? (
                    <Settings className="w-8 h-8 sm:w-10 sm:h-10 text-red-600" />
                  ) : (
                    <XCircle className="w-8 h-8 sm:w-10 sm:h-10 text-red-600" />
                  )}
                </div>
              )}
            </div>

            {state === 'recording' && (
              <motion.div
                key="duration"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl sm:text-4xl font-mono text-destructive font-bold tracking-tight"
              >
                {formatDuration(duration)}
              </motion.div>
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
              <p className="text-primary font-medium text-sm sm:text-base">
                {t('recorder.uploading')}
              </p>
            )}

            {state === 'success' && (
              <p className="text-emerald-600 font-medium text-sm sm:text-base">
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
                  className="text-primary hover:text-primary/90 min-h-[2.5rem] min-w-[5rem]"
                >
                  {t('recorder.cancel')}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
