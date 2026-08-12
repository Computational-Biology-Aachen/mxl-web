import { browser } from "$app/environment";
import { base } from "$app/paths";
import type {
  FitChunkRequest,
  FitFreeRequest,
  FitInitRequest,
  FitInitResult,
  FitProgress,
} from "@computational-biology-aachen/mxlweb-core";
import fitWorkerUrlString from "@computational-biology-aachen/mxlweb-core/backends/wasm/fitWorker.ts?worker&url";

const fitWorkerUrl = browser
  ? new URL(fitWorkerUrlString, import.meta.url)
  : new URL("http://localhost");

let nextRequestId = 0;
function generateRequestId(): string {
  nextRequestId += 1;
  return `fit-${nextRequestId}`;
}

/**
 * One dedicated fitWorker.ts instance for a single fit session (ADR 0004,
 * mxlweb-core). Unlike WorkerPool (used for plain simulations), a fit's WASM
 * session lives inside one specific worker across every chunk — it can't be
 * load-balanced across a pool. `cancel()` terminates the worker outright
 * (the simplest way to guarantee an immediate stop even mid-chunk); starting
 * another fit creates a fresh one.
 */
export class FitSession {
  private worker: Worker | null = null;
  private requestId = generateRequestId();

  private progressHandlers = new Set<(p: FitProgress) => void>();
  private initHandlers = new Set<(r: FitInitResult) => void>();

  constructor() {
    if (!browser) return;
    this.worker = new Worker(fitWorkerUrl, { type: "module" });
    this.worker.postMessage({ type: "__INIT__", basePath: base });
    this.worker.onmessage = (e: MessageEvent) => {
      const data = e.data as (FitInitResult | FitProgress) & { type: string };
      switch (data.type) {
        case "FIT_INIT_RESULT":
          this.initHandlers.forEach((h) => h(data as FitInitResult));
          break;
        case "FIT_PROGRESS":
          this.progressHandlers.forEach((h) => h(data as FitProgress));
          break;
        default:
          break; // e.g. FIT_FREE_RESULT — nothing needs to react to it
      }
    };
  }

  onInitResult(handler: (r: FitInitResult) => void): () => void {
    this.initHandlers.add(handler);
    return () => this.initHandlers.delete(handler);
  }

  onProgress(handler: (p: FitProgress) => void): () => void {
    this.progressHandlers.add(handler);
    return () => this.progressHandlers.delete(handler);
  }

  init(req: Omit<FitInitRequest, "requestId">) {
    this.worker?.postMessage({
      type: "FIT_INIT",
      requestId: this.requestId,
      ...req,
    });
  }

  chunk(maxfev: number) {
    const req: FitChunkRequest & { type: string } = {
      type: "FIT_CHUNK",
      requestId: this.requestId,
      maxfev,
    };
    this.worker?.postMessage(req);
  }

  free() {
    const req: FitFreeRequest & { type: string } = {
      type: "FIT_FREE",
      requestId: this.requestId,
    };
    this.worker?.postMessage(req);
  }

  /** Terminates the worker immediately — the fastest possible cancel, since
   * it doesn't wait for the in-flight chunk to return. */
  cancel() {
    this.worker?.terminate();
    this.worker = null;
  }
}
