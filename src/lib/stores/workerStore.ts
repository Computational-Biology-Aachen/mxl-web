import { browser } from "$app/environment";
import { base } from "$app/paths";

interface WorkerMessage {
  time: number[];
  values: number[][];
  requestId?: string;
}

interface SimulationRequest {
  model: string;
  initialValues: number[];
  tEnd: number;
  pars: number[];
  method?: string;
  requestId?: string;
}

type MessageHandler = (data: WorkerMessage) => void;
type ErrorHandler = (error: ErrorEvent) => void;


const pyWorkerUrl = new URL("../workers/pyWorker.ts", import.meta.url);
const jsWorkerUrl = new URL("../workers/jsWorker.ts", import.meta.url);

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
      type: '__INIT__',
      basePath: base
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

// Create singleton instances
export let pyWorkerManager: WorkerManager = new WorkerManager(pyWorkerUrl);
export let jsWorkerManager: WorkerManager = new WorkerManager(jsWorkerUrl);


