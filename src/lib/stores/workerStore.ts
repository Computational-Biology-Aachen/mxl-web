import { browser } from "$app/environment";
import { base } from "$app/paths";

export interface SimulationRequest {
  // Required; don't change!
  requestId: string;
  model: string;
  derived: string;
  initialValues: number[];
  names: Array<string>;
  derivedSelection: Array<string>;
  tEnd: number;
  nTimePoints: number;
  pars: number[];
  method: string;
  calculateDerived: boolean;
  // Optional
  type?: string;
  protocol?: { t_end: number; PFD: number }[];
}

export interface SimulationError {
  message: string;
  hints: Array<String>;
  dxdt?: Array<{ name: string; val: number }>;
  args?: Array<{ name: string; val: number }>;
}

export interface SimulationResult {
  time: number[];
  values: number[][];
  requestId?: string;
  err?: SimulationError;
}

export type MessageHandler = (data: SimulationResult) => void;
export type ErrorHandler = (error: ErrorEvent) => void;

export class WorkerManager {
  private worker: Worker | null = null;
  private messageHandlers = new Set<MessageHandler>();
  private errorHandlers = new Set<ErrorHandler>();
  private initialized = false;

  constructor(private workerUrl: URL) {
    if (browser) {
      this.initialize();
    }
  }

  private initialize() {
    if (this.initialized) return;

    this.worker = new Worker(this.workerUrl, {
      type: "module",
    });
    // Send initialization message with base path
    this.worker.postMessage({
      type: "__INIT__",
      basePath: base,
    });

    this.worker.onmessage = (e: MessageEvent) => {
      this.messageHandlers.forEach((handler) => handler(e.data));
    };

    this.worker.onerror = (e: ErrorEvent) => {
      console.error(`Worker error:`, e);
      this.errorHandlers.forEach((handler) => handler(e));
    };

    this.initialized = true;
  }

  onMessage(handler: MessageHandler) {
    this.messageHandlers.add(handler);
    return () => {
      this.messageHandlers.delete(handler);
    };
  }

  onError(handler: ErrorHandler) {
    this.errorHandlers.add(handler);
    return () => {
      this.errorHandlers.delete(handler);
    };
  }

  postMessage(data: SimulationRequest) {
    if (!this.worker) {
      console.error("Worker not initialized");
      return;
    }
    this.worker.postMessage(data);
  }

  static generateRequestId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  terminate() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
      this.initialized = false;
      this.messageHandlers.clear();
      this.errorHandlers.clear();
    }
  }

  get isReady() {
    return this.initialized && this.worker !== null;
  }
}
