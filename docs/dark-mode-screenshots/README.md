# Dark mode screenshots

Every page of the SQB web app in **light** and **dark**, at **phone** (390×844)
and **desktop** (1280×800) width — 48 screens × 2 themes × 2 widths = 192
files — plus 6 more quiz/payment states at phone width only (12 files), named `<screen>--<theme>--<width>.jpg`. First screenful only (not the
full scroll), JPEG quality 45 to keep the folder small (about 6.6 MB).

How they were made (2026-10-17, branch `claude/dark-mode`): the Vite dev
server, headless Chromium, the browser's clock frozen at
2026-10-17 09:00 Riyadh time, reduced motion on, and every API call answered
with **made-up demo data** (user `demo@sqb.test`, three sample questions,
round-number admin figures). No real account, database or personal data was
touched. Nothing ran against production.

What they cannot show:

- **The Moyasar card form.** Its script comes from Moyasar's CDN, which this
  environment could not reach, so `subscribe--*` shows the "card form failed
  to load" state. In dark the real form sits inside a white frame — check it
  on the running branch.
- **Google sign-in button** (Google's own iframe, not loaded here).
- Screens that only exist mid-flow (a live payment, a real offer window).

Some data on these screens is odd because it is fake (e.g. "undefined" in a
group-plan label, "0%" accuracy) — judge the colours, not the numbers.

| Screen name | Route / state |
|---|---|
| landing | `/` |
| login, signup, forgot-password | `/login`, `/signup`, `/forgot-password` |
| contact, about, faq, privacy, terms, refund-policy, suggestions | public pages |
| groups | `/groups` (guest view) |
| guides, guide-article, exams | `/guides`, `/guides/smle-study-plan`, `/exams` |
| questions, questions-specialty, past-papers, success-stories | public library |
| not-found | any unknown URL |
| cookie-consent | `/about` with the cookie banner showing |
| quizs-hub, quiz-launcher | `/quizs`, `/quizs?view=custom` |
| quiz-question, quiz-selected | exam mode, before / after choosing an answer |
| quiz-study-answered | study mode, a wrong answer chosen (✗ red, ✓ green) |
| quiz-report-modal, quiz-result | report-a-question modal, end-of-quiz review |
| analysis, overlay-user-menu, overlay-notifications | `/analysis`, with the user menu / notifications open |
| wrong-questions | `/wrong-questions` |
| summaries, summary-reader | `/summaries`, a topic opened (diagram on its light backing) |
| subscribe, payment-callback-failed | `/subscribe`, `/payment/callback?status=failed` |
| account | `/account` (the exam-date question pops up for a user with no date) |
| admin, admin-* | every admin screen |
| quiz-paywall-402, quiz-category-done, quiz-load-error | quiz: free allowance spent, section finished, load failure (phone only) |
| launcher-congratulations, launcher-mock-exam-modal | launcher: section-finished popup, mock-exam type picker (phone only) |
| payment-callback-success | `/payment/callback` after a successful payment (phone only) |
| announcement-{phone,desktop}-{ar,en}-{light,dark} | the "dark mode is here" card on the landing page, cropped to the card |
