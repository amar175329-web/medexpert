import { describe, it, expect } from "vitest";

function scrubEvent(event: any) {
  if (event.request) {
    delete event.request.data;
    if (event.request.headers) {
      delete event.request.headers.cookie;
      delete event.request.headers.authorization;
    }
  }
  if (event.user) {
    delete event.user.email;
    delete event.user.ip_address;
    delete event.user.username;
  }
  return event;
}

describe("Sentry PII & Health Data Scrubber (Rule 9)", () => {
  it("scrubs request body data to prevent health data leakage", () => {
    const rawEvent = {
      request: {
        data: { medicine: "Paracetamol", dose: "500mg", symptom: "fever" },
        headers: { cookie: "secret_session", authorization: "Bearer xyz" },
      },
    };

    const scrubbed = scrubEvent(rawEvent);
    expect(scrubbed.request.data).toBeUndefined();
    expect(scrubbed.request.headers.cookie).toBeUndefined();
    expect(scrubbed.request.headers.authorization).toBeUndefined();
  });

  it("scrubs user personal identifiers", () => {
    const rawEvent = {
      user: {
        id: "anon-uuid",
        email: "user@example.com",
        ip_address: "192.168.1.1",
        username: "patient01",
      },
    };

    const scrubbed = scrubEvent(rawEvent);
    expect(scrubbed.user.id).toBe("anon-uuid");
    expect(scrubbed.user.email).toBeUndefined();
    expect(scrubbed.user.ip_address).toBeUndefined();
    expect(scrubbed.user.username).toBeUndefined();
  });
});
