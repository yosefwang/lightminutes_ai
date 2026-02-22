'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Cloud,
  Loader2,
  Search,
  Tag,
  Calendar,
  Clock,
  Trash2,
  FolderOpen,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { AudioPlayer } from './AudioPlayer';

export interface CloudRecording {
  key: string;
  title: string;
  summary: string;
  transcript?: string;
  tags: string[];
  createdAt: number;
  duration?: number;
  lastModified?: number;
  hasAudio?: boolean;
  audioBase64?: string;
  uploadOption?: 'audio' | 'summary' | 'both';
}

interface CloudTabProps {
  refreshTrigger?: number;
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

export function CloudTab({ refreshTrigger = 0 }: CloudTabProps) {
  const { t } = useApp();
  const [recordings, setRecordings] = useState<CloudRecording[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [groupBy, setGroupBy] = useState<'none' | 'year' | 'month' | 'tag'>('month');
  const [deletingKey, setDeletingKey] = useState<string | null>(null);
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const [playingKey, setPlayingKey] = useState<string | null>(null);
  const [r2Configured, setR2Configured] = useState(true);

  const fetchRecordings = async () => {
    setLoading(true);
    try {
      const healthRes = await fetch('/api/health');
      if (healthRes.ok) {
        const health = await healthRes.json();
        setR2Configured(health.r2Configured);
      }

      const res = await fetch('/api/cloud/list');
      if (res.ok) {
        const data = await res.json();
        setRecordings(data.recordings || []);
      }
    } catch (err) {
      console.error('Failed to fetch cloud recordings:', err);
      setR2Configured(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecordings();
  }, [refreshTrigger]);

  const deleteRecording = async (key: string) => {
    if (!window.confirm(t('cloud.deleteConfirm'))) return;
    if (playingKey === key) {
      setPlayingKey(null);
    }
    setDeletingKey(key);
    try {
      const res = await fetch(`/api/cloud/record/${encodeURIComponent(key)}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setRecordings((prev) => prev.filter((r) => r.key !== key));
      }
    } catch (err) {
      console.error('Failed to delete cloud recording:', err);
    } finally {
      setDeletingKey(null);
    }
  };

  const handlePlayPause = (key: string) => {
    setPlayingKey(playingKey === key ? null : key);
  };

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    recordings.forEach((r) => r.tags?.forEach((t) => tags.add(t)));
    return Array.from(tags).sort();
  }, [recordings]);

  const filteredRecordings = useMemo(() => {
    return recordings.filter((r) => {
      const matchesSearch =
        !searchQuery ||
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (r.summary && r.summary.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesTag = !selectedTag || r.tags?.includes(selectedTag);
      return matchesSearch && matchesTag;
    });
  }, [recordings, searchQuery, selectedTag]);

  const groupedRecordings = useMemo(() => {
    if (groupBy === 'none') {
      return { All: filteredRecordings };
    }

    const groups: Record<string, CloudRecording[]> = {};

    filteredRecordings.forEach((r) => {
      let key: string;
      const date = new Date(r.createdAt);

      switch (groupBy) {
        case 'year':
          key = `${date.getFullYear()}`;
          break;
        case 'month':
          key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          break;
        case 'tag':
          (r.tags?.length ? r.tags : ['无标签']).forEach((tag) => {
            if (!groups[tag]) groups[tag] = [];
            groups[tag].push(r);
          });
          return;
        default:
          key = 'All';
      }

      if (!groups[key]) groups[key] = [];
      groups[key].push(r);
    });

    return Object.fromEntries(Object.entries(groups).sort(([a], [b]) => b.localeCompare(a)));
  }, [filteredRecordings, groupBy]);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const formatDuration = (seconds: number | undefined) => {
    if (!seconds) return '';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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

  if (!r2Configured) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="text-center py-12"
      >
        <Cloud className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
        <h3 className="text-lg font-medium text-foreground">
          {t('cloud.notConfigured')}
        </h3>
      </motion.div>
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
        <Cloud className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
        <h3 className="text-lg font-medium text-foreground">
          {t('cloud.empty')}
        </h3>
        <p className="text-muted-foreground mt-2">
          {t('cloud.emptyDesc')}
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={t('cloud.search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-9 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </div>

        <select
          value={groupBy}
          onChange={(e) => setGroupBy(e.target.value as any)}
          className="flex h-10 w-full sm:w-40 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <option value="none">{t('cloud.all')}</option>
          <option value="year">{t('cloud.groupYear')}</option>
          <option value="month">{t('cloud.groupMonth')}</option>
          <option value="tag">{t('cloud.groupTag')}</option>
        </select>
      </motion.div>

      {allTags.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex flex-wrap gap-2"
        >
          <Button
            variant={!selectedTag ? 'default' : 'secondary'}
            size="sm"
            onClick={() => setSelectedTag(null)}
          >
            {t('cloud.all')}
          </Button>
          {allTags.map((tag) => (
            <Button
              key={tag}
              variant={selectedTag === tag ? 'default' : 'secondary'}
              size="sm"
              onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
            >
              {tag}
            </Button>
          ))}
        </motion.div>
      )}

      <div className="space-y-4">
        {Object.entries(groupedRecordings).map(([group, items]) => (
          <div key={group}>
            <motion.h3
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2"
            >
              <FolderOpen className="w-4 h-4" />
              {group}
              <span className="text-xs font-normal">({items.length})</span>
            </motion.h3>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="space-y-3"
            >
              {items.map((recording) => {
                const isPlaying = playingKey === recording.key;
                const hasAudio = !!recording.hasAudio;
                const isExpanded = expandedKey === recording.key;

                return (
                  <motion.div key={recording.key} variants={itemVariants}>
                    <Card className="overflow-hidden">
                      <CardHeader
                        className="pb-3 cursor-pointer hover:bg-accent/50 transition-colors"
                        onClick={() =>
                          setExpandedKey(isExpanded ? null : recording.key)
                        }
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium truncate">{recording.title}</h4>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
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
                            {recording.tags?.length > 0 && (
                              <div className="flex items-center gap-1.5 flex-wrap mt-2">
                                <Tag className="w-3.5 h-3.5 text-muted-foreground" />
                                {recording.tags.slice(0, 3).map((tag, i) => (
                                  <span
                                    key={i}
                                    className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-1 ml-2 shrink-0">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteRecording(recording.key);
                              }}
                              disabled={deletingKey === recording.key}
                              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                              title={t('cloud.delete')}
                            >
                              {deletingKey === recording.key ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                              ) : (
                                <Trash2 className="w-5 h-5" />
                              )}
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
                          {hasAudio && (
                            <AudioPlayer
                              audioBase64={recording.audioBase64}
                              isPlaying={isPlaying}
                              onPlayPause={() => handlePlayPause(recording.key)}
                              className="py-2"
                            />
                          )}
                          <div
                            className="prose prose-sm dark:prose-invert text-sm text-foreground"
                            dangerouslySetInnerHTML={{
                              __html: renderMarkdown(recording.summary || ''),
                            }}
                          />
                        </CardContent>
                      )}
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
}
