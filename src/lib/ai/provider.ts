/**
 * AI Provider Interface and Implementations
 * Requirement: docs/05_AI_LAYER_AND_MODEL_LIFECYCLE.md & docs/08
 */

export type ModelLifecycleState = "asleep" | "warming" | "ready" | "error";

export interface AiProviderHealth {
  state: ModelLifecycleState;
  idleSecondsLeft?: number;
}

export interface AiGenerateRequest {
  system: string;
  prompt: string;
  jsonSchema?: object;
  maxTokens?: number;
  timeoutMs?: number;
}

export interface AiGenerateResponse {
  text: string;
  json?: unknown;
}

export interface AiProvider {
  name: string;
  health(): Promise<AiProviderHealth>;
  wake(): Promise<{ state: ModelLifecycleState }>;
  generate(req: AiGenerateRequest): Promise<AiGenerateResponse>;
}

/**
 * Mock Provider for deterministic tests and CI environments
 */
export class MockAiProvider implements AiProvider {
  name = "mock";
  private currentState: ModelLifecycleState = "ready";

  async health(): Promise<AiProviderHealth> {
    return { state: this.currentState, idleSecondsLeft: 300 };
  }

  async wake(): Promise<{ state: ModelLifecycleState }> {
    this.currentState = "ready";
    return { state: "ready" };
  }

  async generate(req: AiGenerateRequest): Promise<AiGenerateResponse> {
    if (req.jsonSchema) {
      // Mock structured query extraction
      const mockQuery = {
        action: "find_medicine",
        medicine_name: req.prompt.toLowerCase().includes("paracetamol") ? "paracetamol" : undefined,
        intent: "location_or_expiry",
      };
      return {
        text: JSON.stringify(mockQuery),
        json: mockQuery,
      };
    }

    return {
      text: "Based on your verified medicine records: Dolo 650 is kept in the Master Bedroom First Aid Box and expires in April 2027. Please consult a doctor if you feel unwell.",
    };
  }
}

/**
 * Local Bridge Provider connecting to on-device supervisor
 * Exposes /health, /wake, /generate with Bearer token authentication
 */
export class LocalBridgeAiProvider implements AiProvider {
  name = "local-bridge";
  private bridgeUrl: string;
  private bridgeToken: string;
  private defaultTimeout: number;

  constructor(bridgeUrl: string, bridgeToken: string, defaultTimeout = 60000) {
    this.bridgeUrl = bridgeUrl.replace(/\/$/, "");
    this.bridgeToken = bridgeToken;
    this.defaultTimeout = defaultTimeout;
  }

  private getHeaders(): Record<string, string> {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.bridgeToken}`,
    };
  }

  async health(): Promise<AiProviderHealth> {
    try {
      const res = await fetch(`${this.bridgeUrl}/health`, {
        method: "GET",
        headers: this.getHeaders(),
        signal: AbortSignal.timeout(5000),
      });

      if (!res.ok) {
        return { state: "error" };
      }

      return (await res.json()) as AiProviderHealth;
    } catch {
      return { state: "error" };
    }
  }

  async wake(): Promise<{ state: ModelLifecycleState }> {
    try {
      const res = await fetch(`${this.bridgeUrl}/wake`, {
        method: "POST",
        headers: this.getHeaders(),
        signal: AbortSignal.timeout(5000),
      });

      if (!res.ok) {
        return { state: "error" };
      }

      return (await res.json()) as { state: ModelLifecycleState };
    } catch {
      return { state: "error" };
    }
  }

  async generate(req: AiGenerateRequest): Promise<AiGenerateResponse> {
    const timeout = req.timeoutMs || this.defaultTimeout;
    const res = await fetch(`${this.bridgeUrl}/generate`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify({
        system: req.system,
        prompt: req.prompt,
        jsonSchema: req.jsonSchema,
        maxTokens: req.maxTokens,
      }),
      signal: AbortSignal.timeout(timeout),
    });

    if (!res.ok) {
      const errBody = await res.text();
      throw new Error(`AI bridge error ${res.status}: ${errBody}`);
    }

    return (await res.json()) as AiGenerateResponse;
  }
}

export function getAiProvider(): AiProvider {
  const providerType = process.env.AI_PROVIDER || "mock";

  if (providerType === "local-bridge") {
    const url = process.env.AI_BRIDGE_URL || "http://127.0.0.1:3001";
    const token = process.env.AI_BRIDGE_TOKEN || "dev-token";
    const timeout = Number(process.env.AI_REQUEST_TIMEOUT_MS) || 60000;
    return new LocalBridgeAiProvider(url, token, timeout);
  }

  return new MockAiProvider();
}
