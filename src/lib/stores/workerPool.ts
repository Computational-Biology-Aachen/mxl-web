import { browser } from "$app/environment";
import type { WorkerMessage } from "./workerStore";
import { WorkerManager } from "./workerStore";

import type { SimulationRequest } from "$lib/workers/pyWorker";
import pyWorkerUrlString from "../workers/pyWorker.ts?worker&url";

const pyWorkerUrl = new URL(pyWorkerUrlString, import.meta.url);

type MessageHandler = (data: WorkerMessage) => void;
type ErrorHandler = (error: ErrorEvent) => void;

export class WorkerPool {
  private workers: WorkerManager[] = [];
  private idleWorkers: WorkerManager[] = [];
  private jobQueue: SimulationRequest[] = [];
  private messageHandlers = new Set<MessageHandler>();
  private errorHandlers = new Set<ErrorHandler>();

  constructor(workerUrl: URL, size?: number) {
    if (browser) {
      const poolSize = size ?? Math.min(navigator.hardwareConcurrency ?? 2, 4);
      for (let i = 0; i < poolSize; i++) {
        const worker = new WorkerManager(workerUrl);
        this.workers.push(worker);
        this.idleWorkers.push(worker);
        worker.onMessage((data) => this.handleWorkerMessage(worker, data));
        worker.onError((e) => this.errorHandlers.forEach((h) => h(e)));
      }
    }
  }

  private handleWorkerMessage(worker: WorkerManager, data: WorkerMessage) {
    this.messageHandlers.forEach((h) => h(data));
    this.idleWorkers.push(worker);
    this.dispatchNext();
  }

  private dispatchNext() {
    if (this.jobQueue.length === 0 || this.idleWorkers.length === 0) return;
    const worker = this.idleWorkers.shift()!;
    const job = this.jobQueue.shift()!;
    worker.postMessage(job);
  }

  postMessage(data: SimulationRequest) {
    if (this.idleWorkers.length > 0) {
      const worker = this.idleWorkers.shift()!;
      worker.postMessage(data);
    } else {
      this.jobQueue.push(data);
    }
  }

  onMessage(handler: MessageHandler): () => void {
    this.messageHandlers.add(handler);
    return () => {
      this.messageHandlers.delete(handler);
    };
  }

  onError(handler: ErrorHandler): () => void {
    this.errorHandlers.add(handler);
    return () => {
      this.errorHandlers.delete(handler);
    };
  }

  get poolSize(): number {
    return this.workers.length;
  }

  get queueLength(): number {
    return this.jobQueue.length;
  }

  get isReady(): boolean {
    return this.workers.some((w) => w.isReady);
  }

  terminate() {
    this.workers.forEach((w) => w.terminate());
    this.workers = [];
    this.idleWorkers = [];
    this.jobQueue = [];
    this.messageHandlers.clear();
    this.errorHandlers.clear();
  }

  static generateRequestId(): string {
    return WorkerManager.generateRequestId();
  }
}

export const pyWorkerPool: WorkerPool = new WorkerPool(pyWorkerUrl);
