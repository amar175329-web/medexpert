# AI Layer and Model Lifecycle

## 1. Provider interface (TypeScript)
```ts
export interface AiProvider {
  name: string;
  health(): Promise<{ state: 'asleep' | 'warming' | 'ready' | 'error' }>;
  generate(req: { system: string; prompt: string; jsonSchema?: object; maxTokens?: number; timeoutMs?: number }):
    Promise<{ text: string; json?: unknown }>;
}
```
Providers: `local-bridge` (default), `mock` (tests). A future cloud provider is added by implementing the same interface and changing config (`AI_PROVIDER`). UI never calls a model directly.

## 2. Model lifecycle (requirement: wake on message, sleep after 5 minutes)
The model is NOT always on, because it hangs the phone. Lifecycle is controlled by a small **supervisor** running where the model runs:
- States: `asleep → warming → ready → asleep`.
- On a request while `asleep`: start/load the model, return `warming` quickly, process when ready.
- Every request resets an idle timer. After **300 seconds** with no request, unload the model and return to `asleep`. Idle seconds configurable (`MODEL_IDLE_SECONDS=300`).
- Only one request runs at a time; extra requests queue (max queue length 5, then reject with 429).
- Hard request timeout (default 60s); if exceeded, abort and return error.

## 3. Bridge HTTP contract (supervisor exposes)
- `GET /health` → `{ "state": "asleep|warming|ready|error", "idleSecondsLeft": number }`
- `POST /wake` → starts loading, returns immediately `{ "state": "warming" }`
- `POST /generate` → body `{ system, prompt, jsonSchema?, maxTokens? }` → `{ text, json? }` (wakes the model if needed)
- All calls require header `Authorization: Bearer <BRIDGE_TOKEN>`; reject otherwise. Rate limit and log without prompt contents.

## 4. App behaviour
- Web app calls the provider only from server code, never from the browser.
- UI shows "warming up" (docs/03) and the Search fallback whenever state is not ready within 8 seconds.
- Reminders, search, alerts and records never depend on the model.
- Guardrails in TRD §6 always apply; the model output is validated and filtered.

## 5. Reaching the model from Vercel (important)
A Vercel server cannot reach a model on a personal phone directly. Options, in order of safety and simplicity:
1. Run the bridge + model on a computer or small server and expose it through a private tunnel (for example Tailscale Funnel or Cloudflare Tunnel) with the bearer token. Recommended for testing and early use.
2. Run the model on the same machine as the developer for local-only development (`localhost`), and use the `mock` provider in production until a hosted bridge exists.
3. If the model must stay on the phone, the phone needs an app/server that exposes `/health`, `/wake`, `/generate` and a stable tunnel; this is fragile for public users. Treat it as testing only.
The exact local model name, size and hosting app must be recorded in `.env` and docs/08 by the founder or Antigravity. Do not assume a model name.

## 6. Environment variables
`AI_PROVIDER=local-bridge`, `AI_BRIDGE_URL=`, `AI_BRIDGE_TOKEN=`, `AI_REQUEST_TIMEOUT_MS=60000`, `MODEL_IDLE_SECONDS=300`.
