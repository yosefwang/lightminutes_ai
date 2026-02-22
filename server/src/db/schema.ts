export type SummaryLanguage = 'zh' | 'en' | 'bilingual';

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

export type NewRecording = Omit<Recording, 'id' | 'createdAt'>;

export interface CloudRecording {
  key: string;
  title: string;
  summary: string;
  transcript?: string;
  tags: string[];
  createdAt: number;
  duration?: number;
  url?: string;
}
