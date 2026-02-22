export type RecordingStatus = 'recording' | 'processing' | 'completed' | 'failed';
export type CloudStatus = 'not_uploaded' | 'uploading' | 'uploaded' | 'deleting';
export type SummaryLanguage = 'zh' | 'en' | 'bilingual';

export interface Recording {
  id: string;
  title: string;
  audioPath: string;
  transcript: string | null;
  summary: string | null;
  status: RecordingStatus;
  duration: number | null;
  createdAt: number;
  cloudStatus: CloudStatus;
  cloudKey: string | null;
  cloudUrl: string | null;
  tags: string[];
  summaryLanguage: SummaryLanguage;
}

export interface Database {
  recordings: Recording[];
}

export const defaultDatabase: Database = {
  recordings: [],
};
