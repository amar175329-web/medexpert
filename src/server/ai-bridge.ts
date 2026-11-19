/**
 * Standalone Local Model Supervisor & HTTP Bridge
 * Requirements: docs/05_AI_LAYER_AND_MODEL_LIFECYCLE.md & docs/08
 * - States: asleep -> warming -> ready -> asleep
 * - Idle unload after MODEL_IDLE_SECONDS (default 300s)
 * - Single concurrency with queue (max 5)
 * - Bearer token authorization
 * - Strict zero-log of prompt/answer health data
 */

import http from "http";

export type BridgeState = "asleep" | "warming" | "ready" | "error";

export interface BridgeConfig {
  port: number;
  token: string;
  idleSeconds: number;
  requestTimeoutMs: number;
  maxQueueSize: number;
}

export class ModelSupervisor {
  private state: BridgeState = "asleep";
  private idleSeconds: number;
  private idleSecondsLeft: number;
  private idleTimer: NodeJS.Timeout | null = null;
  private queue: Array<{ resolve: () => void; reject: (err: Error) => void }> = [];
  private isProcessing = false;

  constructor(idleSeconds = 300) {
    this.idleSeconds = idleSeconds;
    this.idleSecondsLeft = idleSeconds;
  }

  public getState(): BridgeState {
    return this.state;
  }

  public getIdleSecondsLeft(): number {
    return this.state === "ready" ? this.idleSecondsLeft : 0;
  }

  public async wake(): Promise<BridgeState> {
    if (this.state === "ready") {
      this.resetIdleTimer();
      return "ready";
    }

    if (this.state === "warming") {
      return "warming";
    }

    this.state = "warming";
    console.log(`[ModelSupervisor] Waking model. State transition: asleep -> warming`);

    // Simulate / execute model load (e.g. llama.cpp / Gemma runtime)
    await new Promise((r) => setTimeout(r, 400));
    this.state = "ready";
    console.log(`[ModelSupervisor] Model ready. State transition: warming -> ready`);
    this.resetIdleTimer();
    return "ready";
  }

  public unload() {
    this.state = "asleep";
    if (this.idleTimer) {
      clearInterval(this.idleTimer);
      this.idleTimer = null;
    }
    this.idleSecondsLeft = this.idleSeconds;
    console.log(`[ModelSupervisor] Model idle timeout reached. Unloaded to save RAM. State: asleep`);
  }

  public resetIdleTimer() {
    this.idleSecondsLeft = this.idleSeconds;
    if (this.idleTimer) clearInterval(this.idleTimer);

    const stepMs = this.idleSeconds < 1 ? Math.max(10, Math.floor(this.idleSeconds * 1000)) : 1000;
    const stepSeconds = stepMs / 1000;

    this.idleTimer = setInterval(() => {
      this.idleSecondsLeft -= stepSeconds;
      if (this.idleSecondsLeft <= 0) {
        this.unload();
      }
    }, stepMs);
  }

  public async acquireLock(maxQueue: number): Promise<void> {
    if (!this.isProcessing && this.queue.length === 0) {
      this.isProcessing = true;
      return;
    }

    if (this.queue.length >= maxQueue) {
      throw new Error("QUEUE_FULL");
    }

    return new Promise((resolve, reject) => {
      this.queue.push({
        resolve: () => {
          this.isProcessing = true;
          resolve();
        },
        reject,
      });
    });
  }

  public releaseLock() {
    this.resetIdleTimer();
    if (this.queue.length > 0) {
      const next = this.queue.shift();
      next?.resolve();
    } else {
      this.isProcessing = false;
    }
  }
}

export function createBridgeServer(config: BridgeConfig) {
  const supervisor = new ModelSupervisor(config.idleSeconds);

  const server = http.createServer(async (req, res) => {
    // Bearer token validation
    const authHeader = req.headers.authorization;
    if (!authHeader || authHeader !== `Bearer ${config.token}`) {
      res.writeHead(401, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Unauthorized. Missing or invalid Bearer token." }));
      return;
    }

    const url = req.url || "/";

    // GET /health
    if (req.method === "GET" && url === "/health") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          state: supervisor.getState(),
          idleSecondsLeft: supervisor.getIdleSecondsLeft(),
        })
      );
      return;
    }

    // POST /wake
    if (req.method === "POST" && url === "/wake") {
      supervisor.wake().catch(() => {});
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ state: "warming" }));
      return;
    }

    // POST /generate
    if (req.method === "POST" && url === "/generate") {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk;
      });

      req.on("end", async () => {
        const startTime = Date.now();
        try {
          // Lock acquisition
          await supervisor.acquireLock(config.maxQueueSize);

          // Ensure model is ready
          await supervisor.wake();

          const parsed = JSON.parse(body || "{}");

          // Simulate model inference with json schema enforcement
          let resultText = "Your verified medicine Dolo 650 is kept in the Bedroom cabinet.";
          let resultJson: unknown = undefined;

          if (parsed.jsonSchema) {
            resultJson = {
              action: "search_shelf",
              filters: { term: "fever" },
              found_in_shelf: true,
            };
            resultText = JSON.stringify(resultJson);
          }

          // Rule 9: NEVER log health data or prompt contents!
          const duration = Date.now() - startTime;
          console.log(`[ModelSupervisor] Request processed in ${duration}ms (status: 200)`);

          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              text: resultText,
              json: resultJson,
            })
          );
        } catch (err: any) {
          if (err.message === "QUEUE_FULL") {
            res.writeHead(429, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Model request queue full. Please retry." }));
          } else {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: err.message || "Inference error" }));
          }
        } finally {
          supervisor.releaseLock();
        }
      });
      return;
    }

    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Endpoint not found" }));
  });

  return { server, supervisor };
}
