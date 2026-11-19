# Prompt for Google Antigravity – connect the local model

Paste everything below into Antigravity.

---
I have a local Google Gemma model on my device. Do not change my app code beyond what is listed. Build a small **model supervisor + bridge** and connect it to the MedExpert app through its AI provider interface (`AiProvider`, docs/05).

Requirements:
1. Detect how my model is run (name, size, runtime/app) and write it into `.env.local` and a short `docs/MODEL_NOTES.md`. If unclear, ask me one question.
2. Implement the HTTP bridge exactly as in docs/05 §3: `GET /health`, `POST /wake`, `POST /generate`, bearer-token auth (`AI_BRIDGE_TOKEN`).
3. **Lifecycle:** the model must NOT stay loaded. It loads only when a request arrives (or `/wake`), and unloads automatically after 300 seconds of no requests (`MODEL_IDLE_SECONDS=300`). Reset the timer on every request. One request at a time, queue up to 5, timeout 60s. Report state `asleep|warming|ready|error` and `idleSecondsLeft` in `/health`.
4. Support JSON-schema constrained output when `jsonSchema` is given; return `{ text, json }`.
5. Do not log prompts or answers (health data). Log only timings and states.
6. Implement the `local-bridge` provider in the app and a `mock` provider for tests. Add tests for: wake, idle unload after the configured time (use a short time in tests), queue limit, auth failure, timeout.
7. Explain how the deployed app can reach the bridge safely (private tunnel with the token) given that Vercel cannot reach a personal phone directly. Set it up for local development first (`localhost`).
8. Give me a 5-line summary: how to start the bridge, how to test it, how to point the app at it, and what is still manual.
---
