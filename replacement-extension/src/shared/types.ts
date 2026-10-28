/**
 * Shared types for Moodle Quiz Solver
 * BYOK (Bring Your Own Key) - supports any AI provider
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

// Complete question structure (matches v2 schema for structured output)
export interface Question {
  qtype: QuestionType;
  content: ContentBlock[];
  fields: Record<string, Field>;
  assets: Record<string, ImageAsset>;
}

// AI Provider types
export type AIProvider = 'openai' | 'anthropic' | 'openrouter' | 'ollama' | 'custom';

// Provider configuration
export interface ProviderConfig {
  provider: AIProvider;
  baseUrl: string;           // e.g. "https://openrouter.ai/api/v1", "http://localhost:11434/v1"
  apiKey: string;            // User's API key (empty for local models)
  model: string;             // Model ID (e.g. "openai/gpt-4o-mini", "llama3.1")
  reasoning?: string;        // "low" | "medium" | "high" (OpenRouter specific)
  temperature?: number;      // Optional temperature
  maxTokens?: number;        // Optional max tokens
  extraHeaders?: Record<string, string>; // For custom auth (e.g. OpenRouter referrer)
}

// Extension configuration
export interface ExtensionConfig {
  provider: ProviderConfig;
  fillOnClick: boolean;
  cursor: boolean;
  context: string;           // Optional user-provided context
  stealthMode: boolean;      // Minimal visual indicators
}

// Answer request (internal format, converted to provider format)
export interface AnswerRequest {
  request_id: string;
  snapshot_id: string;
  model: string;
  reasoning?: string;
  context: string;
  question: Question;
}

// Answer response (internal format)
export interface AnswerResponse {
  answer: Record<string, unknown>;
  explanation?: string;
  confidence?: number;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
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

// Preset providers for easy selection
export const PROVIDER_PRESETS: Record<AIProvider, { name: string; baseUrl: string; defaultModel: string }> = {
  openai: { name: 'OpenAI', baseUrl: 'https://api.openai.com/v1', defaultModel: 'gpt-4o-mini' },
  anthropic: { name: 'Anthropic', baseUrl: 'https://api.anthropic.com/v1', defaultModel: 'claude-3-5-sonnet-20241022' },
  openrouter: { name: 'OpenRouter', baseUrl: 'https://openrouter.ai/api/v1', defaultModel: 'openai/gpt-4o-mini' },
  ollama: { name: 'Ollama (Local)', baseUrl: 'http://localhost:11434/v1', defaultModel: 'llama3.1' },
  custom: { name: 'Custom OpenAI-Compatible', baseUrl: '', defaultModel: '' },
};