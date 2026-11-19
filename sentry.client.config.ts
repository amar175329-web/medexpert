import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  debug: false,
  // Strict PII and health data scrubbing per MedExpert Rule 9
  beforeSend(event) {
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
  },
});
