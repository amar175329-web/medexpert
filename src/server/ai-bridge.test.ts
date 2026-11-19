import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { ModelSupervisor, createBridgeServer } from "./ai-bridge";
import http from "http";

describe("AI Bridge & Model Lifecycle (docs/05 & docs/08)", () => {
  it("starts in asleep state and transitions to warming then ready on wake", async () => {
    const supervisor = new ModelSupervisor(300);
    expect(supervisor.getState()).toBe("asleep");

    const wakePromise = supervisor.wake();
    // During wake loading
    expect(["warming", "ready"]).toContain(supervisor.getState());

    await wakePromise;
    expect(supervisor.getState()).toBe("ready");
    expect(supervisor.getIdleSecondsLeft()).toBe(300);

    supervisor.unload();
  });

  it("unloads automatically to asleep state after idle timeout", async () => {
    const supervisor = new ModelSupervisor(0.1); // 100ms idle for fast, real-timer test
    await supervisor.wake();
    expect(supervisor.getState()).toBe("ready");

    // Wait 150ms for idle timer to trigger
    await new Promise((r) => setTimeout(r, 150));

    expect(supervisor.getState()).toBe("asleep");
    expect(supervisor.getIdleSecondsLeft()).toBe(0);
    supervisor.unload();
  });

  it("enforces bearer-token authentication over HTTP", async () => {
    const { server, supervisor } = createBridgeServer({
      port: 0,
      token: "secret-token-123",
      idleSeconds: 300,
      requestTimeoutMs: 5000,
      maxQueueSize: 2,
    });

    await new Promise<void>((resolve) => server.listen(0, resolve));
    const address = server.address() as any;
    const port = address.port;

    try {
      // 1. Request without auth -> 401
      const resUnauthorized = await fetch(`http://127.0.0.1:${port}/health`);
      expect(resUnauthorized.status).toBe(401);

      // 2. Request with valid bearer token -> 200
      const resAuthorized = await fetch(`http://127.0.0.1:${port}/health`, {
        headers: { Authorization: "Bearer secret-token-123" },
      });
      expect(resAuthorized.status).toBe(200);
      const data = await resAuthorized.json();
      expect(data.state).toBe("asleep");
    } finally {
      supervisor.unload();
      server.close();
    }
  });

  it("enforces max queue size (returns 429 when overloaded)", async () => {
    const supervisor = new ModelSupervisor(300);

    // Acquire lock 1
    await supervisor.acquireLock(1);

    // Second lock should wait in queue (queue length = 1)
    let secondLockResolved = false;
    supervisor.acquireLock(1).then(() => {
      secondLockResolved = true;
    });

    // Third request exceeds maxQueueSize 1 -> throws QUEUE_FULL
    await expect(supervisor.acquireLock(1)).rejects.toThrow("QUEUE_FULL");

    supervisor.releaseLock();
    // Allow microtask queue to process
    await new Promise((r) => setTimeout(r, 10));
    expect(secondLockResolved).toBe(true);

    supervisor.releaseLock();
    supervisor.unload();
  });
});
