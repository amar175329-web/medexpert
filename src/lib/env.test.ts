import { describe, it, expect } from "vitest";
import { env } from "./env";

describe("Environment Validation", () => {
  it("parses client env with default fallback", () => {
    const client = env.client();
    expect(client.NEXT_PUBLIC_SUPABASE_URL).toBeDefined();
    expect(client.NEXT_PUBLIC_SUPABASE_ANON_KEY).toBeDefined();
    expect(client.NEXT_PUBLIC_APP_URL).toBeDefined();
  });

  it("parses server env with default fallback", () => {
    const server = env.server();
    expect(server.NODE_ENV).toBeDefined();
    expect(server.AI_PROVIDER).toBe("mock");
    expect(server.MODEL_IDLE_SECONDS).toBe(300);
  });
});
