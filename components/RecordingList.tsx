'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  FileText,
  Trash2,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Loader2,
  Clock,
  Calendar,
  UploadCloud,
  Cloud,
  CloudOff,
  Trash,
  Tag,
  Folder,
  RefreshCw,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useApp } from '@/contexts/AppContext';
import { usePromptSettings } from '@/contexts/PromptSettingsContext';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { AudioPlayer } from './AudioPlayer';
import { cn } from '@/lib/utils';

export type SummaryLanguage = 'zh' | 'en' | 'bilingual';
export type UploadOption = 'audio' | 'summary' | 'both';

export interface Recording {
  id: string;
  title: string;
  audioPath: string;
  transcript: string | null;
  summary: string | null;
  status: 'recording' | 'processing' | 'completed' | 'failed';
  duration: number | null;
  createdAt: number;
  cloudStatus: 'not_uploaded' | 'uploading' | 'uploaded' | 'deleting';
  cloudKey: string | null;
  cloudUrl: string | null;
  tags: string[];
  summaryLanguage: SummaryLanguage;
}

interface RecordingListProps {
  refreshTrigger?: number;
  onRefresh?: () => void;
}

const containerVariants: any = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants: any = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } },
};

export function RecordingList({ refreshTrigger = 0, onRefresh }: RecordingListProps) {
  const { t, lang } = useApp();
  const { getActiveSummaryPrompt } = usePromptSettings();
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showTranscript, setShowTranscript] = useState<Record<string, boolean>>({});
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteAllLoading, setDeleteAllLoading] = useState(false);
  const [uploadOptions, setUploadOptions] = useState<Record<string, UploadOption>>({});
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [regenerationState, setRegenerationState] = useState<Record<string, 'idle' | 'regenerating' | 'completed'>>({});

  const doFetch = async () => {
    try {
      const res = await fetch('/api/history');
      if (res.ok) {
        const data = await res.json();
        setRecordings(data);
      }
    } catch (err) {
      console.error('Failed to fetch recordings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    doFetch();
  }, [refreshTrigger]);

  // Poll for updates when there are processing recordings
  useEffect(() => {
    const hasProcessing = recordings.some((r) => r.status === 'processing');
    if (!hasProcessing) return;

    const interval = setInterval(() => {
      doFetch();
    }, 2000);

    return () => clearInterval(interval);
  }, [recordings]);

  const deleteRecording = async (id: string) => {
    if (!window.confirm(t('history.deleteConfirm'))) return;
    if (playingId === id) {
      setPlayingId(null);
    }
    try {
      const res = await fetch(`/api/recording/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setRecordings((prev) => prev.filter((r) => r.id !== id));
        onRefresh?.();
      }
    } catch (err) {
      console.error('Failed to delete recording:', err);
    }
  };

  const deleteAllRecordings = async () => {
    if (!window.confirm(t('history.deleteAllConfirm'))) return;
    setPlayingId(null);
    setDeleteAllLoading(true);
    try {
      const res = await fetch('/api/recordings/all', { method: 'DELETE' });
      if (res.ok) {
        setRecordings([]);
        onRefresh?.();
      }
    } catch (err) {
      console.error('Failed to delete all recordings:', err);
    } finally {
      setDeleteAllLoading(false);
    }
  };

  const uploadToCloud = async (id: string, option: UploadOption = 'both') => {
    setUploadingId(id);
    try {
      const res = await fetch(`/api/cloud/upload/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uploadOption: option }),
      });
      if (res.ok) {
        await doFetch();
        onRefresh?.();
      }
    } catch (err) {
      console.error('Failed to upload to cloud:', err);
    } finally {
      setUploadingId(null);
    }
  };

  const removeFromCloud = async (id: string) => {
    if (!window.confirm(t('cloud.removeConfirm'))) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/cloud/delete/${id}`, { method: 'DELETE' });
      if (res.ok) {
        await doFetch();
        onRefresh?.();
      }
    } catch (err) {
      console.error('Failed to remove from cloud:', err);
    } finally {
      setDeletingId(null);
    }
  };

  const regenerateSummary = async (id: string, promptTemplate?: string) => {
    // Set state to regenerating
    setRegenerationState((prev) => ({ ...prev, [id]: 'regenerating' }));

    try {
      // First, update the recording status locally to processing
      setRecordings((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, status: 'processing', summary: null } : r
        )
      );

      // Prepare the prompt template - make sure it has the transcript placeholder
      let processedPrompt = promptTemplate;
      if (processedPrompt && !processedPrompt.includes('{transcript}')) {
        processedPrompt = processedPrompt + '\n\nTranscript:\n{transcript}';
      }

      // Call the regenerate API
      const res = await fetch(`/api/regenerate-summary/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: lang,
          promptTemplate: processedPrompt,
        }),
      });

      if (res.ok) {
        // Poll for updates until completed or timeout
        let pollCount = 0;
        const maxPolls = 60; // 30 seconds max

        const pollInterval = setInterval(async () => {
          pollCount++;

          // Fetch fresh data directly
          try {
            const pollRes = await fetch('/api/history');
            if (pollRes.ok) {
              const data = await pollRes.json();
              setRecordings(data);

              // Check if the recording is completed
              const updatedRecording = data.find((r: Recording) => r.id === id);
              if (updatedRecording && updatedRecording.status === 'completed' && updatedRecording.summary) {
                clearInterval(pollInterval);
                setRegenerationState((prev) => ({ ...prev, [id]: 'completed' }));

                // Show completed for 2 seconds, then back to idle
                setTimeout(() => {
                  setRegenerationState((prev) => ({ ...prev, [id]: 'idle' }));
                }, 2000);
              } else if (pollCount >= maxPolls) {
                clearInterval(pollInterval);
                setRegenerationState((prev) => ({ ...prev, [id]: 'idle' }));
              }
            }
          } catch (e) {
            console.error('Poll error:', e);
          }
        }, 500);
      }
    } catch (err) {
      console.error('Failed to regenerate summary:', err);
      setRegenerationState((prev) => ({ ...prev, [id]: 'idle' }));
    }
  };

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handlePlayPause = (id: string) => {
    setPlayingId(playingId === id ? null : id);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return '';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'recording':
        return 'destructive';
      case 'processing':
        return 'secondary';
      case 'completed':
        return 'success';
      case 'failed':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const renderMarkdown = (markdown: string) => {
    return markdown
      .replace(/^### (.*$)/gim, '<h3 class="text-sm font-semibold mt-3 mb-1.5">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-base font-bold mt-4 mb-2">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-lg font-bold mt-5 mb-3">$1</h1>')
      .replace(/\*\*(.*)\*\*/gim, '<strong class="font-semibold">$1</strong>')
      .replace(/\*(.*)\*/gim, '<em class="italic">$1</em>')
      .replace(/^\- (.*$)/gim, '<li class="ml-4 list-disc">$1</li>')
      .replace(/\n\n/g, '</p><p class="my-2">')
      .replace(/\n/g, '<br>');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (recordings.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="text-center py-12"
      >
        <FileText className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
        <h3 className="text-lg font-medium text-foreground">
          {t('history.empty')}
        </h3>
        <p className="text-muted-foreground mt-2">
          {t('history.emptyDesc')}
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{t('history.title')}</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={deleteAllRecordings}
          disabled={deleteAllLoading}
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          {deleteAllLoading ? (
            <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
          ) : (
            <Trash className="w-4 h-4 mr-1.5" />
          )}
          <span className="hidden sm:inline">{t('history.deleteAll')}</span>
        </Button>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-3"
      >
        {recordings.map((recording) => {
          const isUploadDisabled = recording.status !== 'completed';
          const isUploading = uploadingId === recording.id || recording.cloudStatus === 'uploading';
          const isDeleting = deletingId === recording.id || recording.cloudStatus === 'deleting';
          const isUploaded = recording.cloudStatus === 'uploaded';
          const isPlaying = playingId === recording.id;
          const uploadOption = uploadOptions[recording.id] || 'both';
          const isExpanded = expandedId === recording.id;
          const regenState = regenerationState[recording.id] || 'idle';
          const isProcessing = recording.status === 'processing' || regenState === 'regenerating';

          return (
            <motion.div key={recording.id} variants={itemVariants}>
              <Card className="overflow-hidden">
                <CardHeader
                  className="pb-3 cursor-pointer hover:bg-accent/50 transition-colors"
                  onClick={() => setExpandedId(isExpanded ? null : recording.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <h3 className="font-medium truncate">{recording.title}</h3>
                        <Badge variant={getStatusVariant(recording.status)}>
                          {t(`status.${recording.status}`)}
                        </Badge>
                        {isUploaded && (
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <Cloud className="w-3 h-3" />
                            <span>{t('cloud.uploaded')}</span>
                          </Badge>
                        )}
                      </div>

                      {recording.tags.length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap mb-2">
                          <Tag className="w-3.5 h-3.5 text-muted-foreground" />
                          {recording.tags.slice(0, 3).map((tag, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {recording.tags.length > 3 && (
                            <span className="text-xs text-muted-foreground">+{recording.tags.length - 3}</span>
                          )}
                        </div>
                      )}

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(recording.createdAt)}</span>
                        </div>
                        {recording.duration && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{formatDuration(recording.duration)}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 ml-2 shrink-0">
                      {isUploaded ? (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFromCloud(recording.id);
                          }}
                          disabled={isDeleting}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          title={t('cloud.remove')}
                        >
                          {isDeleting ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <CloudOff className="w-5 h-5" />
                          )}
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            uploadToCloud(recording.id, uploadOption);
                          }}
                          disabled={isUploadDisabled || isUploading}
                          className={cn(
                            !isUploadDisabled && 'text-primary hover:text-primary hover:bg-primary/10'
                          )}
                          title={t('cloud.upload')}
                        >
                          {isUploading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <UploadCloud className="w-5 h-5" />
                          )}
                        </Button>
                      )}

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteRecording(recording.id);
                        }}
                        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        title={t('history.delete')}
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>

                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </CardHeader>

                {isExpanded && (
                  <CardContent className="pt-0 space-y-4">
                    <AudioPlayer
                      audioPath={recording.audioPath}
                      duration={recording.duration}
                      isPlaying={isPlaying}
                      onPlayPause={() => handlePlayPause(recording.id)}
                      className="py-2"
                    />

                    {recording.status === 'completed' && !isUploaded && (
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 pb-3 border-t border-border pt-2">
                        <div className="flex items-center gap-2">
                          <Folder className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {t('cloud.uploadOptions')}:
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {(['audio', 'summary', 'both'] as const).map((opt) => (
                            <Button
                              key={opt}
                              variant={uploadOption === opt ? 'default' : 'secondary'}
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setUploadOptions((prev) => ({ ...prev, [recording.id]: opt }));
                              }}
                            >
                              {t(`cloud.${opt === 'audio' ? 'audioOnly' : opt === 'summary' ? 'summaryOnly' : 'both'}`)}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}

                    {recording.status === 'completed' && (
                      <div className="flex items-center justify-between gap-3 pb-3 border-b">
                        <div className="flex items-center gap-2">
                          <RefreshCw className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {lang === 'zh' ? '当前模板：' : 'Current template:'}
                          </span>
                          <span className="text-sm font-medium">
                            {getActiveSummaryPrompt().name}
                          </span>
                        </div>
                        <Button
                          variant={regenState === 'completed' ? 'default' : 'secondary'}
                          size="sm"
                          onClick={() => regenerateSummary(recording.id, getActiveSummaryPrompt().content)}
                          disabled={isProcessing}
                        >
                          {isProcessing ? (
                            <span className="flex items-center gap-1">
                              <Loader2 className="w-3 h-3 animate-spin" />
                              <span>{lang === 'zh' ? '正在重新生成...' : 'Regenerating...'}</span>
                            </span>
                          ) : regenState === 'completed' ? (
                            <span className="flex items-center gap-1">
                              <Check className="w-3 h-3" />
                              <span>{lang === 'zh' ? '已完成' : 'Completed'}</span>
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <RefreshCw className="w-3 h-3" />
                              <span>{lang === 'zh' ? '重新生成' : 'Regenerate'}</span>
                            </span>
                          )}
                        </Button>
                      </div>
                    )}

                    {recording.summary && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-primary">
                            {t('summary.title')}
                          </h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(recording.summary!, recording.id)}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            {copiedId === recording.id ? (
                              <>
                                <Check className="w-4 h-4 text-emerald-500 mr-1.5" />
                                <span>{t('history.copied')}</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-4 h-4 mr-1.5" />
                                <span>{t('history.copy')}</span>
                              </>
                            )}
                          </Button>
                        </div>
                        <div
                          className="prose prose-sm dark:prose-invert bg-muted/30 rounded-lg p-4 text-sm text-foreground"
                          dangerouslySetInnerHTML={{
                            __html: renderMarkdown(recording.summary),
                          }}
                        />
                      </div>
                    )}

                    {recording.status === 'processing' && !recording.summary && (
                      <div className="flex items-center gap-2 text-primary">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>{t('summary.generating')}</span>
                      </div>
                    )}

                    {recording.transcript && (
                      <div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setShowTranscript((prev) => ({
                              ...prev,
                              [recording.id]: !prev[recording.id],
                            }))
                          }
                          className="text-muted-foreground hover:text-foreground p-0 h-auto"
                        >
                          {showTranscript[recording.id]
                            ? t('history.hideTranscript')
                            : t('history.showTranscript')}
                        </Button>
                        {showTranscript[recording.id] && (
                          <div className="mt-2 bg-muted/30 rounded-lg p-4 text-sm text-muted-foreground whitespace-pre-wrap">
                            {recording.transcript}
                          </div>
                        )}
                      </div>
                    )}

                    {!recording.summary && recording.status === 'completed' && (
                      <p className="text-muted-foreground text-sm">
                        {t('history.noSummary')}
                      </p>
                    )}
                  </CardContent>
                )}
              </Card>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
