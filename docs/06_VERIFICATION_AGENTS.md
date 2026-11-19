# Verification Agents

Decision: verification is done by automated agents working continuously. In a medical product this is only safe with the rules below.

## Rules
1. Verified only when a match exists in an approved authoritative source, recorded with source id, URL, retrieval date and the exact fields matched.
2. Never verify from model memory, from a single weak source or from user input.
3. Matching is rule-based: normalize text; require at least two independent signals (for example brand + manufacturer, or brand + ingredient strength, or barcode + brand). Fuzzy matches below the threshold stay Unverified.
4. Conflict between sources → `needs_review`, stays Unverified.
5. The language model may assist (for example parsing a pack text) but never makes the final decision.
6. A second independent check re-runs the match from stored evidence before publishing.
7. Every step is written to `verification_audit`. Any later source change or detected error triggers re-verification; if it fails, the record rolls back to Unverified automatically and affected users see the status change.
8. Exceptions (`needs_review`) go to an admin queue; the founder is alerted only for those.

## Pipeline
`user_medicine created (unverified)` → job `queued` → agent A finds candidates from approved sources → rule matcher scores → agent B re-checks → `verified` (write catalog rows + facts with citations, link user_medicine.catalog_medicine_id, set status) or `needs_review`/`failed`.

## Schedules
`/api/cron/verify` processes the queue in small batches; `/api/cron/reverify` re-checks oldest verifications and source health daily.

## Approved sources
Not yet decided. Must be listed in `catalog_sources` with trust tier and licence note before any ingestion. See docs/09. Claude Code must not invent sources or catalog data.

## Admin dashboard metrics
Queue size, time to verify, verified count, error and rollback rate, source health, exceptions waiting.
