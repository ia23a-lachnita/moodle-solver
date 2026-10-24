/**
 * Shared types for Moodle Quiz Solver
 * Matches the API schema from the original extension
 */

// Question types supported by Moodle
export type QuestionType =
  | 'multichoice'
  | 'truefalse'
  | 'shortanswer'
  | 'numerical'
  | 'calculated'
  | 'calculatedsimple'
  | 'calculatedmulti'
  | 'match'
  | 'randomsamatch'
  | 'multianswer'
  | 'gapselect'
  | 'ddwtos'
  | 'ddimageortext'
  | 'ddmarker'
  | 'ordering'
  | 'essay'
  | 'description'
  | 'missingtype';

// Content block types for question content
export interface ContentBlock {
  type: 'text' | 'image' | 'audio' | 'video' | 'math' | 'code' | 'table' | 'list';
  content: string;
  metadata?: Record<string, unknown>;
}

// Form field definition
export interface Field {
  name: string;
  type: 'text' | 'number' | 'select' | 'radio' | 'checkbox' | 'textarea' | 'hidden';
  required?: boolean;
  options?: Array<{ value: string; label: string }>;
  validation?: Record<string, unknown>;
}

// Image asset reference
export interface ImageAsset {
  mime_type: 'image/png' | 'image/jpeg';
  data: string; // base64
  width?: number;
  height?: number;
}

// Complete question structure
export interface Question {
  qtype: QuestionType;
  content: ContentBlock[];
  fields: Record<string, Field>;
  assets: Record<string, ImageAsset>;
}

// Answer request to API
export interface AnswerRequest {
  schema_version: '2.0';
  request_id: string; // UUID
  snapshot_id: string;
  model: string;
  reasoning: string;
  context: string;
  question: Question;
}

// Answer response from API
export interface AnswerResponse {
  answer: Record<string, unknown>;
  explanation?: string;
  confidence?: number;
}

// Extension configuration
export interface ExtensionConfig {
  apiKey: string;
  apiEndpoint: string;
  model: string;
  fillOnClick: boolean;
  cursor: boolean;
  reasoning?: string;
}

// Storage keys
export const STORAGE_KEYS = {
  CONFIG: 'quiz_solver_config',
  CACHE: 'quiz_solver_cache',
} as const;

// Message types for content script <-> background communication
export interface BridgeMessage {
  source: 'quiz-solver-v2';
  direction: 'request' | 'response' | 'cancel';
  id: string;
  root_id?: string;
  command?: string;
  args?: unknown;
  ok?: boolean;
  result?: unknown;
  error?: string;
}

// Bridge commands
export type BridgeCommand =
  | 'ready'
  | 'composite.clear'
  | 'composite.set'
  | 'ordering.set'
  | 'marker.set'
  | 'dirty'
  | 'essay.read'
  | 'essay.write'
  | 'essay.restore'
  | 'essay.ready';

// Adapter result
export interface AdapterResult {
  success: boolean;
  value?: unknown;
  error?: string;
}

// Question state for tracking
export interface QuestionState {
  root: HTMLElement;
  stem: HTMLElement | null;
  info: HTMLElement;
  type: QuestionType;
  formulation: HTMLElement | null;
  originalCursor: string;
  originalCursorPriority: string;
  nativeHover: boolean;
  phase: 'ready' | 'generating' | 'applying' | 'pending';
  revision: number;
  controller?: AbortController;
  pending?: {
    snapshot: QuestionSnapshot;
    answer: Record<string, unknown>;
    revision: number;
  };
  frames: Map<HTMLIFrameElement, () => void>;
  cursor: boolean;
}

// Question snapshot for answer application
export interface QuestionSnapshot {
  rootId: string;
  type: QuestionType;
  fields: Record<string, FieldValue>;
  assets: Record<string, ImageAsset>;
  timestamp: number;
}

export type FieldValue = string | number | boolean | string[] | null;

// Adapter interface
export interface QuestionAdapter {
  type: QuestionType;
  extract(root: HTMLElement): QuestionSnapshot | null;
  apply(root: HTMLElement, snapshot: QuestionSnapshot, answer: Record<string, unknown>, signal: AbortSignal): Promise<AdapterResult>;
  ready?(root: HTMLElement, signal: AbortSignal): Promise<boolean>;
}

// Error classes
export class AdapterError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly recoverable = false
  ) {
    super(message);
    this.name = 'AdapterError';
  }
}

export class APIError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly retryable = false
  ) {
    super(message);
    this.name = 'APIError';
  }
}