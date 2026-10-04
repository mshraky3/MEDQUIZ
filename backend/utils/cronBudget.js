/**
 * Time budget for scheduled jobs.
 *
 * Since 2026-10-04 the API runs as a non-Fluid Vercel function, which on Hobby
 * stops at 60 s (Fluid allowed 300 s). The cron routes send one email or
 * message at a time, so a busy day could run past the limit and be killed
 * mid-send. Every job stamps its own dedupe column per recipient, so stopping
 * early and letting the next run carry on is safe; being killed is not (a send
 * may go out without its stamp).
 *
 * Usage: `const outOfTime = cronDeadline();` once per request, then
 * `if (outOfTime()) break;` before each send.
 */
export const CRON_BUDGET_MS = Number(process.env.CRON_BUDGET_MS || 45_000);

export function cronDeadline(ms = CRON_BUDGET_MS) {
    const end = Date.now() + ms;
    return () => Date.now() >= end;
}
