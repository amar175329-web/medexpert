# Local Model & Supervisor Bridge Notes

## Architecture Overview
The MedExpert local model runs on-demand behind the Model Supervisor bridge (`src/server/ai-bridge.ts`).
To protect device battery and RAM, the model is **never left loaded indefinitely**.

### Lifecycle States
- **asleep**: Unloaded from memory (0% RAM/GPU usage).
- **warming**: Loading weights into memory (triggered by `POST /wake` or incoming request).
- **ready**: Inference active. Resets a 300-second idle countdown on every interaction.
- **asleep**: Once 300 seconds elapse with no requests, the supervisor unloads the model automatically.

## How to Run & Connect

```bash
# 1. Start the Model Supervisor Bridge on port 3001
npx tsx src/server/ai-bridge.ts

# 2. Run automated lifecycle & queue tests
npx vitest run src/server/ai-bridge.test.ts

# 3. Configure MedExpert to use the local bridge (.env.local)
AI_PROVIDER=local-bridge
AI_BRIDGE_URL=http://127.0.0.1:3001
AI_BRIDGE_TOKEN=your-bridge-secret-token

# 4. For remote Vercel deployments reaching local device
# Expose the bridge securely via Cloudflare Tunnel or Tailscale Funnel:
cloudflared tunnel --url http://localhost:3001
```
