/**
 * Shared utilities for Moodle Quiz Solver
 */

/**
 * Generate a UUID v4
 */
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Deep clone an object
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Sleep utility
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retry with exponential backoff
 */
export async function retry<T>(
  fn: () => Promise<T>,
  options: { maxAttempts?: number; baseDelay?: number; maxDelay?: number } = {}
): Promise<T> {
  const { maxAttempts = 3, baseDelay = 1000, maxDelay = 10000 } = options;
  let lastError: Error;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (attempt < maxAttempts - 1) {
        const delay = Math.min(baseDelay * 2 ** attempt, maxDelay);
        await sleep(delay);
      }
    }
  }

  throw lastError!;
}

/**
 * Check if we're in a Moodle quiz attempt page
 */
export function isQuizAttemptPage(): boolean {
  return (
    window.location.pathname.includes('/mod/quiz/attempt.php') ||
    window.location.href.includes('/mod/quiz/attempt.php')
  );
}

/**
 * Sanitize HTML for safe insertion
 */
export function sanitizeHTML(html: string): string {
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
}

/**
 * Convert file to base64
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Convert blob to base64
 */
export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Fetch image and convert to base64
 */
export async function fetchImageAsBase64(url: string): Promise<{ data: string; mime: string } | null> {
  try {
    const response = await fetch(url, { credentials: 'include' });
    if (!response.ok) return null;
    const blob = await response.blob();
    const base64 = await blobToBase64(blob);
    return { data: base64, mime: blob.type };
  } catch {
    return null;
  }
}

/**
 * Simple event emitter
 */
export class EventEmitter<EventMap extends Record<string, unknown>> {
  private listeners: Map<keyof EventMap, Set<Function>> = new Map();

  on<K extends keyof EventMap>(event: K, listener: (data: EventMap[K]) => void): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(listener);
    return () => this.off(event, listener);
  }

  off<K extends keyof EventMap>(event: K, listener: (data: EventMap[K]) => void): void {
    this.listeners.get(event)?.delete(listener);
  }

  emit<K extends keyof EventMap>(event: K, data: EventMap[K]): void {
    this.listeners.get(event)?.forEach((listener) => {
      try {
        listener(data);
      } catch (error) {
        console.error(`Error in event listener for ${String(event)}:`, error);
      }
    });
  }
}

/**
 * Storage wrapper with type safety
 */
export class TypedStorage<T extends Record<string, unknown>> {
  constructor(private prefix: string = '') {}

  private getKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  async get<K extends keyof T>(key: K): Promise<T[K] | null> {
    return new Promise((resolve) => {
      chrome.storage.local.get(this.getKey(key as string), (result) => {
        resolve(result[this.getKey(key as string)] ?? null);
      });
    });
  }

  async set<K extends keyof T>(key: K, value: T[K]): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.local.set({ [this.getKey(key as string)]: value }, resolve);
    });
  }

  async remove(key: string): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.local.remove(this.getKey(key), resolve);
    });
  }

  async clear(): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.local.clear(resolve);
    });
  }
}

/**
 * Message port wrapper for content script <-> background communication
 */
export class MessagePort {
  private port: chrome.runtime.Port | null = null;
  private handlers: Map<string, (message: unknown) => void | Promise<void>> = new Map();
  private pendingRequests: Map<string, { resolve: (value: unknown) => void; reject: (reason: unknown) => void }> = new Map();

  connect(name: string): void {
    this.port = chrome.runtime.connect({ name });
    this.port.onMessage.addListener(this.handleMessage.bind(this));
    this.port.onDisconnect.addListener(() => {
      this.port = null;
      this.rejectAll(new Error('Port disconnected'));
    });
  }

  private handleMessage(message: unknown): void {
    if (!message || typeof message !== 'object') return;

    const msg = message as { id?: string; type?: string; payload?: unknown; error?: string };

    if (msg.id && this.pendingRequests.has(msg.id)) {
      const { resolve, reject } = this.pendingRequests.get(msg.id)!;
      this.pendingRequests.delete(msg.id);
      if (msg.error) {
        reject(new Error(msg.error));
      } else {
        resolve(msg.payload);
      }
      return;
    }

    if (msg.type && this.handlers.has(msg.type)) {
      this.handlers.get(msg.type)!(msg.payload);
    }
  }

  on<T>(type: string, handler: (payload: T) => void | Promise<void>): void {
    this.handlers.set(type, handler as (message: unknown) => void | Promise<void>);
  }

  off(type: string): void {
    this.handlers.delete(type);
  }

  async send<T>(type: string, payload: unknown): Promise<T> {
    if (!this.port) throw new Error('Port not connected');

    const id = generateUUID();
    return new Promise((resolve, reject) => {
      this.pendingRequests.set(id, { resolve: resolve as (value: unknown) => void, reject });
      this.port!.postMessage({ id, type, payload });
      setTimeout(() => {
        if (this.pendingRequests.has(id)) {
          this.pendingRequests.delete(id);
          reject(new Error('Request timeout'));
        }
      }, 30000);
    });
  }

  private rejectAll(error: Error): void {
    for (const [, { reject }] of this.pendingRequests) {
      reject(error);
    }
    this.pendingRequests.clear();
  }

  disconnect(): void {
    this.port?.disconnect();
    this.port = null;
  }
}