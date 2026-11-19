import { z } from "zod";

const serverEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  CRON_SECRET: z.string().min(1).default("dev-cron-secret"),
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  WHATSAPP_TOKEN: z.string().optional(),
  WHATSAPP_PHONE_NUMBER_ID: z.string().optional(),
  VAPID_PUBLIC_KEY: z.string().optional(),
  VAPID_PRIVATE_KEY: z.string().optional(),
  VAPID_SUBJECT: z.string().optional(),
  AI_PROVIDER: z.enum(["local-bridge", "mock"]).default("mock"),
  AI_BRIDGE_URL: z.string().url().default("http://127.0.0.1:3001"),
  AI_BRIDGE_TOKEN: z.string().min(1).default("dev-token"),
  AI_REQUEST_TIMEOUT_MS: z.coerce.number().default(60000),
  MODEL_IDLE_SECONDS: z.coerce.number().default(300),
});

const clientEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().default("http://127.0.0.1:54321"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).default("dev-anon-key"),
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_SENTRY_DSN: z.string().optional(),
});

export const env = {
  server: () => serverEnvSchema.parse(process.env),
  client: () =>
    clientEnvSchema.parse({
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
      NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
    }),
};
