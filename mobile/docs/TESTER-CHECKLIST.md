# SQB Android app: tester checklist (2026-10-28)

Honest status: **nothing has been run on a real phone or tablet yet.** The app was tested as a web preview against a fake local
server, plus unit tests, type check, lint and a native bundle export. The first real run is the owner's or a tester's.

## A. Builds (queued 2026-10-28 on the owner's Expo account, free plan, no cash cost)
| Build | What | Link | State when written |
|---|---|---|---|
| `play-preview` APK | installable file, Play mode (no prices), Google button | https://expo.dev/accounts/m_alshraky3/projects/sqb/builds/0dc5ffd2-e584-4cd7-ad8d-076c6cf133c4 | in queue (the free plan queue can take minutes to hours) |
| `production` AAB | the file for the Play closed test (versionCode 2) | https://expo.dev/accounts/m_alshraky3/projects/sqb/builds/c09d6c00-19bf-4ff5-b618-933eb208d1a2 | in queue |
Quota: Free plan, **2 of 30 builds used** this billing period (ends 1 Nov 2026) before these two; after them 4 of 30. No overage cost.
Re-check with `npx eas-cli@latest build:view <id>` or the links.

## B. Steps for the owner (first phone test)
1. Open the `play-preview` link on the phone when it says **finished**, tap Install (allow "install unknown apps", or pause Play Protect, as with Mahfazati).
2. Open SQB. Sign in with an account made on the website (the app does not create accounts in this mode).
3. Run the ten checks below. Note anything odd with a screenshot and the phone model.
4. For the Play closed test: open the `production` link, download the **.aab**, then Play Console > Test and release > Testing > Closed testing >
   Create new release > upload the .aab > add the testers group > send for review. (First upload of an app is manual.)
5. Do NOT ask testers for ratings or reviews, and do not reward them for installing (see `PLAY-LAUNCH-CHECKLIST.md`, section 6).

## C. The 10 things a tester should try
1. **Sign in** with email and password (wrong password gives a clear message; right password lands on Home).
2. **Google sign-in** button (only on the Play-signed build after the Play SHA-1 client exists; on the APK it should work with the EAS key).
3. **A quiz:** Home > Start a quick quiz, answer 5 questions, finish, see the result. Rotate the phone in the middle: nothing is lost.
4. **Exam mode with a timer** (Customise the quiz): the timer counts down, and Previous/Next work.
5. **Summaries:** open the study path, read one lesson, use the highlighter/pen, mark the step done, come back.
6. **Tablet or landscape** (any tablet, a foldable unfolded, or a phone turned sideways): on a wide screen Summaries shows the list beside the lesson,
   and a quiz shows the numbered question palette beside the question; text and buttons are larger; nothing is cut off.
7. **Arabic and English:** switch the language (AR / EN button). Arabic is right-to-left, the lists are on the right, exam questions stay English.
8. **Dark mode:** the app has **no dark theme yet** (it stays light even if the phone is dark). Just confirm text is readable and report if the phone's dark mode makes anything unreadable.
9. **No buying inside the app:** look for prices, "Subscribe" buttons or group plans anywhere (Home, Account, More, a locked lesson, a finished free allowance).
   There must be none; a locked place shows "Account status" instead. Also check Create an account (it explains it is done on the website).
10. **Account and offline:** Account screen shows your status; turn on airplane mode, open the app (it must not crash or sign you out), turn it off and reload.

## D. Short message for the testers (Arabic, owner sends)
> هلا! أحتاج مساعدتك تجرّب تطبيق SQB على أندرويد قبل نزوله في المتجر 🙏
> 1) افتح الرابط من جوالك (نفس حساب Google اللي أرسلته لي) واضغط «أصير مجرّب»، ثم نزّل التطبيق.
> 2) سجّل الدخول بحسابك في الموقع (التطبيق ما ينشئ حساب، الحساب يتسوّى من الموقع).
> 3) جرّب اختبار قصير، وملخّص، وبدّل بين العربي والإنجليزي، ولو عندك تابلت أو دوّرت الجوال بالعرض شف كيف يطلع.
> أهم شيء تخليه في جوالك ١٤ يوم وتفتحه كل كم يوم. لو شفت أي شيء غلط أو ما عجبك، أرسل لي لقطة شاشة وموديل جوالك.
> ما أطلب منك تقييم ولا مراجعة في المتجر، فقط ملاحظاتك. شكراً لك!

## E. For the person who reads the results
- A crash or blank screen: ask for the phone model, Android version and the exact step. There is no crash-reporting tool in the app.
- "Sign in failed with Google": the Play SHA-1 client is missing (see `GOOGLE_SIGN_IN.md`).
- Anything with a price or a buy button in the Play build is a bug, report it immediately.
