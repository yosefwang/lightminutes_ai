'use client';

import { useState, useEffect } from 'react';
import { X, Save, Plus, Trash2, Check, Edit2, CheckCircle2, Type, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/contexts/AppContext';
import { usePromptSettings, type PromptTemplate } from '@/contexts/PromptSettingsContext';
import { Button } from './ui/button';
import { Card, CardHeader, CardContent } from './ui/card';
import { cn } from '@/lib/utils';

interface PromptSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ViewTab = 'transcribe' | 'summary';
type MobileView = 'list' | 'editor';

export function PromptSettingsModal({ isOpen, onClose }: PromptSettingsModalProps) {
  const { t, lang } = useApp();
  const {
    prompts,
    activeTranscribePromptId,
    activeSummaryPromptId,
    setActiveTranscribePromptId,
    setActiveSummaryPromptId,
    updatePrompt,
    addPrompt,
    deletePrompt,
    getPromptsByType,
  } = usePromptSettings();

  const [viewTab, setViewTab] = useState<ViewTab>('summary');
  const [selectedPromptId, setSelectedPromptId] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState('');
  const [editedName, setEditedName] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newPromptName, setNewPromptName] = useState('');
  const [mobileView, setMobileView] = useState<MobileView>('list');

  const currentPrompts = getPromptsByType(viewTab);
  const activeId = viewTab === 'transcribe' ? activeTranscribePromptId : activeSummaryPromptId;

  useEffect(() => {
    const defaultId = viewTab === 'transcribe' ? activeTranscribePromptId : activeSummaryPromptId;
    const prompt = prompts.find((p) => p.id === defaultId && p.type === viewTab);
    const targetPrompt = prompt || prompts.find((p) => p.type === viewTab);

    if (targetPrompt) {
      setSelectedPromptId(targetPrompt.id);
      setEditedContent(targetPrompt.content);
      setEditedName(targetPrompt.name);
    } else {
      setSelectedPromptId(null);
      setEditedContent('');
      setEditedName('');
    }
    setIsEditingName(false);
    setMobileView('list');
  }, [isOpen, viewTab, prompts, activeTranscribePromptId, activeSummaryPromptId]);

  useEffect(() => {
    if (selectedPromptId) {
      const prompt = prompts.find((p) => p.id === selectedPromptId);
      if (prompt) {
        setEditedContent(prompt.content);
        setEditedName(prompt.name);
      }
    }
  }, [selectedPromptId, prompts]);

  const handleSave = () => {
    if (!selectedPromptId) return;
    setIsSaving(true);
    updatePrompt(selectedPromptId, { name: editedName, content: editedContent });
    setTimeout(() => {
      setIsSaving(false);
      setShowSaved(true);
      setTimeout(() => setShowSaved(false), 1500);
    }, 300);
  };

  const handleSelectPrompt = (prompt: PromptTemplate) => {
    setSelectedPromptId(prompt.id);
    setIsEditingName(false);
    setMobileView('editor');
  };

  const handleActivatePrompt = (prompt: PromptTemplate) => {
    if (prompt.type === 'transcribe') {
      setActiveTranscribePromptId(prompt.id);
    } else {
      setActiveSummaryPromptId(prompt.id);
    }
  };

  const handleAddPrompt = () => {
    if (!newPromptName.trim()) return;
    const defaultContent = lang === 'zh'
      ? (viewTab === 'transcribe'
          ? '请准确转录以下音频内容。'
          : '请将以下转录内容整理成一份清晰的摘要。')
      : (viewTab === 'transcribe'
          ? 'Please transcribe the following audio accurately.'
          : 'Please summarize the following transcript clearly.');
    addPrompt(newPromptName.trim(), defaultContent, viewTab);
    setNewPromptName('');
    setIsAdding(false);
  };

  const handleDeletePrompt = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    deletePrompt(id);
    if (selectedPromptId === id) {
      const remaining = currentPrompts.find((p) => p.id !== id);
      if (remaining) {
        setSelectedPromptId(remaining.id);
      } else {
        setMobileView('list');
      }
    }
  };

  const handleSaveName = () => {
    if (!selectedPromptId) return;
    updatePrompt(selectedPromptId, { name: editedName });
    setIsEditingName(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center"
             style={{
               paddingTop: 'env(safe-area-inset-top)',
               paddingBottom: 'env(safe-area-inset-bottom)',
             }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-[10000] w-full max-w-5xl mx-2 sm:mx-4"
          >
            <Card className="flex flex-col"
                  style={{
                    maxHeight: 'calc(100vh - 100px)',
                  }}>
              <CardHeader className="flex flex-row items-center justify-between pb-4 border-b shrink-0">
                <div className="min-w-0">
                  <h2 className="text-lg sm:text-xl font-semibold truncate">{t('nav.promptSettings')}</h2>
                  <p className="text-xs sm:text-sm text-muted-foreground truncate hidden sm:block">
                    {lang === 'zh' ? '管理用于转录和摘要的提示词模板' : 'Manage prompt templates for transcription and summary'}
                  </p>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose}
                        className="min-h-[2.5rem] min-w-[2.5rem]">
                  <X className="w-5 h-5" />
                </Button>
              </CardHeader>

              <CardContent className="p-0 flex-1 overflow-hidden flex flex-col">
                {/* View Tabs */}
                <div className="flex border-b shrink-0">
                  <button
                    onClick={() => setViewTab('transcribe')}
                    className={cn(
                      'flex-1 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 min-h-[2.75rem]',
                      viewTab === 'transcribe'
                        ? 'text-primary border-b-2 border-primary'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <Type className="w-4 h-4" />
                    <span>{lang === 'zh' ? '转录' : 'Transcribe'}</span>
                  </button>
                  <button
                    onClick={() => setViewTab('summary')}
                    className={cn(
                      'flex-1 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 min-h-[2.75rem]',
                      viewTab === 'summary'
                        ? 'text-primary border-b-2 border-primary'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{lang === 'zh' ? '摘要' : 'Summary'}</span>
                  </button>
                </div>

                {/* Desktop: Two column layout */}
                <div className="hidden md:flex flex-1 overflow-hidden" style={{ minHeight: '400px' }}>
                  <div className="w-64 border-r p-4 overflow-y-auto shrink-0">
                    <div className="space-y-2">
                      {currentPrompts.map((prompt) => (
                        <button
                          key={prompt.id}
                          onClick={() => handleSelectPrompt(prompt)}
                          className={cn(
                            'w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg text-left transition-colors group min-h-[2.75rem]',
                            selectedPromptId === prompt.id
                              ? 'bg-primary text-primary-foreground'
                              : 'hover:bg-accent text-foreground'
                          )}
                        >
                          <span className="text-sm font-medium truncate flex-1">{prompt.name}</span>
                          <div className="flex items-center gap-1 shrink-0">
                            {activeId === prompt.id && (
                              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                            )}
                            {currentPrompts.length > 1 && (
                              <button
                                onClick={(e) => handleDeletePrompt(e, prompt.id)}
                                className={cn(
                                  'p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity min-h-[2rem] min-w-[2rem]',
                                  selectedPromptId === prompt.id
                                    ? 'hover:bg-primary-foreground/20'
                                    : 'hover:bg-muted'
                                )}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>

                    {isAdding ? (
                      <div className="mt-4 space-y-2">
                        <input
                          type="text"
                          value={newPromptName}
                          onChange={(e) => setNewPromptName(e.target.value)}
                          placeholder={lang === 'zh' ? '模板名称' : 'Template name'}
                          className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm min-h-[2.75rem]"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleAddPrompt();
                            if (e.key === 'Escape') setIsAdding(false);
                          }}
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={handleAddPrompt} className="flex-1 min-h-[2.5rem]">
                            {lang === 'zh' ? '添加' : 'Add'}
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => setIsAdding(false)}
                                  className="min-h-[2.5rem]">
                            {lang === 'zh' ? '取消' : 'Cancel'}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full mt-4 justify-start text-muted-foreground hover:text-foreground min-h-[2.75rem]"
                        onClick={() => setIsAdding(true)}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        {lang === 'zh' ? '新建模板' : 'New Template'}
                      </Button>
                    )}
                  </div>

                  <div className="flex-1 flex flex-col p-4 overflow-hidden">
                    {selectedPromptId ? (
                      <EditorContent
                        editedName={editedName}
                        editedContent={editedContent}
                        setEditedName={setEditedName}
                        setEditedContent={setEditedContent}
                        isEditingName={isEditingName}
                        setIsEditingName={setIsEditingName}
                        handleSaveName={handleSaveName}
                        handleSave={handleSave}
                        handleActivatePrompt={handleActivatePrompt}
                        isSaving={isSaving}
                        showSaved={showSaved}
                        selectedPromptId={selectedPromptId}
                        prompts={prompts}
                        activeId={activeId}
                        lang={lang}
                      />
                    ) : (
                      <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
                        {lang === 'zh' ? '请选择一个提示词模板' : 'Please select a prompt template'}
                      </div>
                    )}
                  </div>
                </div>

                {/* Mobile: Stacked layout with navigation */}
                <div className="md:hidden flex-1 overflow-hidden flex flex-col" style={{ minHeight: '450px' }}>
                  <AnimatePresence mode="wait">
                    {mobileView === 'list' ? (
                      <motion.div
                        key="list"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex-1 overflow-y-auto p-4"
                      >
                        <div className="space-y-2">
                          {currentPrompts.map((prompt) => (
                            <button
                              key={prompt.id}
                              onClick={() => handleSelectPrompt(prompt)}
                              className={cn(
                                'w-full flex items-center justify-between gap-2 px-4 py-3.5 rounded-lg text-left transition-colors group min-h-[3rem]',
                                selectedPromptId === prompt.id
                                  ? 'bg-primary text-primary-foreground'
                                  : 'hover:bg-accent text-foreground'
                              )}
                            >
                              <div className="flex flex-col items-start min-w-0 flex-1">
                                <span className="font-medium truncate">{prompt.name}</span>
                                {activeId === prompt.id && (
                                  <span className="text-xs opacity-80">
                                    {lang === 'zh' ? '✓ 当前使用' : '✓ Active'}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-1 shrink-0">
                                {activeId === prompt.id && (
                                  <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                                )}
                                <ChevronRight className="w-5 h-5 opacity-60" />
                              </div>
                            </button>
                          ))}
                        </div>

                        {isAdding ? (
                          <div className="mt-4 space-y-3">
                            <input
                              type="text"
                              value={newPromptName}
                              onChange={(e) => setNewPromptName(e.target.value)}
                              placeholder={lang === 'zh' ? '模板名称' : 'Template name'}
                              className="w-full px-4 py-3 rounded-lg border bg-background min-h-[3rem]"
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleAddPrompt();
                                if (e.key === 'Escape') setIsAdding(false);
                              }}
                            />
                            <div className="flex gap-2">
                              <Button size="sm" onClick={handleAddPrompt} className="flex-1 min-h-[2.75rem]">
                                {lang === 'zh' ? '添加' : 'Add'}
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => setIsAdding(false)}
                                      className="min-h-[2.75rem]">
                                {lang === 'zh' ? '取消' : 'Cancel'}
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full mt-4 justify-start text-muted-foreground hover:text-foreground min-h-[3rem]"
                            onClick={() => setIsAdding(true)}
                          >
                            <Plus className="w-5 h-5 mr-2" />
                            {lang === 'zh' ? '新建模板' : 'New Template'}
                          </Button>
                        )}
                      </motion.div>
                    ) : (
                      <motion.div
                        key="editor"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="flex-1 flex flex-col overflow-hidden"
                      >
                        <div className="flex items-center gap-2 p-3 border-b shrink-0">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setMobileView('list')}
                            className="min-h-[2.75rem] min-w-[2.75rem]"
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </Button>
                          <span className="font-medium truncate flex-1">{editedName}</span>
                        </div>

                        {selectedPromptId && (
                          <EditorContent
                            editedName={editedName}
                            editedContent={editedContent}
                            setEditedName={setEditedName}
                            setEditedContent={setEditedContent}
                            isEditingName={isEditingName}
                            setIsEditingName={setIsEditingName}
                            handleSaveName={handleSaveName}
                            handleSave={handleSave}
                            handleActivatePrompt={handleActivatePrompt}
                            isSaving={isSaving}
                            showSaved={showSaved}
                            selectedPromptId={selectedPromptId}
                            prompts={prompts}
                            activeId={activeId}
                            lang={lang}
                            isMobile={true}
                          />
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// Editor content component - shared between mobile and desktop
function EditorContent({
  editedName,
  editedContent,
  setEditedName,
  setEditedContent,
  isEditingName,
  setIsEditingName,
  handleSaveName,
  handleSave,
  handleActivatePrompt,
  isSaving,
  showSaved,
  selectedPromptId,
  prompts,
  activeId,
  lang,
  isMobile = false,
}: {
  editedName: string;
  editedContent: string;
  setEditedName: (v: string) => void;
  setEditedContent: (v: string) => void;
  isEditingName: boolean;
  setIsEditingName: (v: boolean) => void;
  handleSaveName: () => void;
  handleSave: () => void;
  handleActivatePrompt: (p: PromptTemplate) => void;
  isSaving: boolean;
  showSaved: boolean;
  selectedPromptId: string;
  prompts: PromptTemplate[];
  activeId: string | null;
  lang: 'zh' | 'en';
  isMobile?: boolean;
}) {
  const prompt = prompts.find((p) => p.id === selectedPromptId);
  const isActive = prompt && activeId === prompt.id;

  return (
    <>
      <div className={cn("mb-3 flex items-center justify-between shrink-0 flex-wrap gap-2", isMobile && "px-3 pt-3")}>
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {isEditingName ? (
            <div className="flex items-center gap-2 w-full">
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="px-2 py-1.5 rounded border bg-background text-sm font-medium flex-1 min-h-[2.5rem]"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveName();
                  if (e.key === 'Escape') {
                    const prompt = prompts.find((p) => p.id === selectedPromptId);
                    if (prompt) setEditedName(prompt.name);
                    setIsEditingName(false);
                  }
                }}
              />
              <Button size="sm" variant="ghost" onClick={handleSaveName}
                      className="min-h-[2.5rem] min-w-[2.5rem]">
                <Check className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2 min-w-0">
              <h3 className={cn("font-medium truncate", isMobile ? "text-base" : "text-lg")}>
                {editedName}
              </h3>
              {!isMobile && (
                <button
                  onClick={() => setIsEditingName(true)}
                  className="p-1 hover:bg-accent rounded text-muted-foreground hover:text-foreground min-h-[2rem] min-w-[2rem]"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
        <div className={cn("flex items-center gap-2 shrink-0", isMobile && "w-full justify-between mt-2 pb-2 border-b")}>
          {showSaved && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-sm text-emerald-500 flex items-center gap-1"
            >
              <Check className="w-4 h-4" />
              {lang === 'zh' ? '已保存' : 'Saved'}
            </motion.span>
          )}
          {isMobile && <div className="flex-1" />}
          {prompt && (
            <Button
              size={isMobile ? "sm" : "sm"}
              variant={isActive ? 'secondary' : 'default'}
              onClick={() => handleActivatePrompt(prompt)}
              disabled={isActive}
              className="min-h-[2.5rem]"
            >
              {isActive ? (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-1.5" />
                  <span>{lang === 'zh' ? '已激活' : 'Active'}</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-1.5" />
                  <span>{lang === 'zh' ? '激活' : 'Activate'}</span>
                </>
              )}
            </Button>
          )}
          <Button size={isMobile ? "sm" : "sm"} onClick={handleSave} disabled={isSaving}
                  className="min-h-[2.5rem]">
            <Save className="w-4 h-4 mr-1.5" />
            <span>{lang === 'zh' ? '保存' : 'Save'}</span>
          </Button>
        </div>
      </div>
      <textarea
        value={editedContent}
        onChange={(e) => setEditedContent(e.target.value)}
        className={cn(
          "flex-1 w-full p-4 rounded-lg border bg-background resize-none text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary overflow-y-auto",
          isMobile && "border-x-0 rounded-none"
        )}
        placeholder={lang === 'zh' ? '输入提示词内容...' : 'Enter prompt content...'}
      />
      <p className={cn("text-xs text-muted-foreground shrink-0", isMobile ? "px-3 py-2" : "mt-2")}>
        {lang === 'zh'
          ? '提示词会自动保存到本地存储中'
          : 'Prompts are automatically saved to local storage'}
      </p>
    </>
  );
}
