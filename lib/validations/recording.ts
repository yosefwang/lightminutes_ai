import { z } from 'zod';

export const createRecordingSchema = z.object({
  title: z.string().min(1).max(200),
  r2AudioKey: z.string().min(1),
  r2AudioUrl: z.string().url(),
  duration: z.number().int().min(0).optional(),
  summaryLanguage: z.enum(['zh', 'en', 'bilingual']).default('zh'),
  tags: z.array(z.string()).default([]),
});

export const updateRecordingSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  transcript: z.string().optional().nullable(),
  summary: z.string().optional().nullable(),
  status: z.enum(['recording', 'processing', 'completed', 'failed']).optional(),
  cloudStatus: z.enum(['not_uploaded', 'uploading', 'uploaded', 'deleting']).optional(),
  cloudKey: z.string().optional().nullable(),
  cloudUrl: z.string().url().optional().nullable(),
  duration: z.number().int().min(0).optional().nullable(),
  tags: z.array(z.string()).optional(),
  summaryLanguage: z.enum(['zh', 'en', 'bilingual']).optional(),
});

export const presignedUrlSchema = z.object({
  fileExtension: z.enum(['webm', 'm4a', 'wav', 'mp3']).default('webm'),
  mimeType: z.string().min(1),
});

export const regenerateSummarySchema = z.object({
  language: z.enum(['zh', 'en', 'bilingual']).optional(),
  promptTemplate: z.string().optional(),
});

export type CreateRecordingInput = z.infer<typeof createRecordingSchema>;
export type UpdateRecordingInput = z.infer<typeof updateRecordingSchema>;
export type PresignedUrlInput = z.infer<typeof presignedUrlSchema>;
export type RegenerateSummaryInput = z.infer<typeof regenerateSummarySchema>;
