# Handoff: SQB TikTok ads (read this first)

Written 2026-09-27 at the end of a cloud session. Give this file to the next session. Everything below is already done and pushed, so there is no need to research the site again.

## Where everything is

- Repo: `mshraky3/medquiz`, branch **`claude/ecstatic-edison-f15ugm`** (not merged to `main`, no PR).
  Get it locally with `git fetch origin claude/ecstatic-edison-f15ugm && git checkout claude/ecstatic-edison-f15ugm`.
- Folder: `marketing/tiktok-ad/`
  - `out/`: the **finished videos** (1080×1920 MP4, H.264 + AAC, ready for TikTok) and cover images.
  - `README.md`: storyboards, captions, and how to rebuild the videos.
  - `ad.html`, `ad-96.html`, `ad-chat.html`: animation sources (`render(t)` drives every frame).
  - `anim.js` holds the shared helpers, `render.js` is the Playwright frame renderer, and `soundtrack.py` / `sfx.py` generate the audio (stdlib Python).

## Status

| Step | State |
|---|---|
| Research the product and offer | done |
| Make 4 ads (8 files: with sound + silent) | done, approved by the owner ("perfect") |
| Commit + push | done |
| **Upload to TikTok** | **NOT done. This is the next task** (local session + Chrome extension) |

## The videos

| # | File (in `out/`) | Length | Valid until | Cover |
|---|---|---|---|---|
| 1 | `sqb-tiktok-nationalday-96.mp4` | 18 s | **1 Oct 2026** | `cover-nationalday-96.jpg` |
| 2 | `sqb-tiktok-nationalday-chat.mp4` | 22 s | **1 Oct 2026** | `cover-nationalday-chat.jpg` |
| 3 | `sqb-tiktok-offer.mp4` (quiz hook + offer prices) | 21 s | **1 Oct 2026** | `cover.jpg` |
| 4 | `sqb-tiktok-evergreen.mp4` (quiz hook, regular prices) | 21 s | any time | `cover.jpg` |

Each one also has a `*-silent.mp4` twin. Use the silent version if the owner wants to add a trending TikTok sound in the app.

**Suggested order:** post the National Day ads first (1 → 2 → 3), because the offer only has days left. Hold #4 (evergreen) until after 1 October, or post it any time.

## Captions (paste exactly)

**#1 `sqb-tiktok-nationalday-96.mp4`**
```
96 سنة وطن… و96 ريال لـ4 أشهر تحضير 🇸🇦💚
والسنة كاملة بـ196 بدل 299. العرض ينتهي 1 أكتوبر، الرابط في البايو
#اليوم_الوطني_96 #SMLE #SNLE #برومترك #هيئة_التخصصات_الصحية #عروض_اليوم_الوطني
```

**#2 `sqb-tiktok-nationalday-chat.mp4`**
```
منشن دفعتك 👇 اشتركوا جماعة ووفّروا
3 حسابات بـ196 (65 للواحد) · 5 حسابات بـ296 (59 للواحد) — عرض اليوم الوطني لين 1 أكتوبر
#اليوم_الوطني_96 #SMLE #SNLE #امتياز #طب #تمريض #برومترك
```

**#3 `sqb-tiktok-offer.mp4`**
```
عندك 5 ثوانٍ… جاوبت صح؟ 👀 اكتب إجابتك بالتعليقات
عرض اليوم الوطني: 4 أشهر بـ96 ريال وسنة بـ196 — ينتهي 1 أكتوبر 🇸🇦
ابدأ بـ40 سؤال مجاناً، الرابط في البايو
#SMLE #SNLE #برومترك #هيئة_التخصصات_الصحية #طب #تمريض #اليوم_الوطني_96
```

**#4 `sqb-tiktok-evergreen.mp4`**
```
عندك 5 ثوانٍ… جاوبت صح؟ 👀 اكتب إجابتك بالتعليقات
بنك أسئلة SMLE و SNLE بالعربي، مع تفسير لكل إجابة وتحليل لنقاط ضعفك
ابدأ بـ40 سؤال مجاناً، الرابط في البايو
#SMLE #SNLE #برومترك #هيئة_التخصصات_الصحية #طب #تمريض #امتياز
```

## Upload procedure (Chrome extension)

1. The owner is already logged in to TikTok in Chrome. Open `https://www.tiktok.com/tiktokstudio/upload`.
2. Choose the video file from the local checkout's `marketing/tiktok-ad/out/`.
3. Paste the matching caption from above.
4. Cover: choose the frame showing the headline or price, or upload the matching cover image if TikTok offers that.
5. Leave visibility at the owner's default (ask if unsure). Comments on (the captions ask for comments).
6. **Stop before pressing Post and let the owner confirm.** Do one video at a time.
7. After posting, confirm the caption and link-in-bio match. The bio link should point to `https://www.smle-question-bank.com`, and the owner sets that themselves if it's missing.

## Facts the ads rely on (don't change without checking)

- Site: `https://www.smle-question-bank.com`, brand **SQB**, Arabic prep for **SMLE** (medicine) and **SNLE** (nursing).
- 5,033 questions in the bank, every one with an explanation. 40 free questions, no card needed.
- **National Day offer** (`docs/NATIONAL_DAY_OFFER_2026-09.md`; the code is `NATIONAL_DAY_OFFER` in `backend/services/paymentService.js`):
  - 4 months **96** (normally 129) · year **196** (normally 299 live / 300 in code)
  - group of 3 **196** (65 each, normally 250) · group of 5 **296** (59 each, normally 299)
  - monthly stays **50** (not discounted)
  - **ends 1 Oct 2026, 23:59 Riyadh time** (`NATIONAL_DAY_OFFER_ENDS_AT`)
- Regular prices shown in the evergreen ad: 50/month, 4 months 129 (compare-at 200), group 3 = 250, group 5 = 299.
- The quiz ad uses public question id 25593 (aortic dissection; the answer is C).

## After 1 October

- Delete or hide videos #1–#3 on TikTok, since their prices will be wrong. Keep #4.
- If the offer is extended or prices change, edit the prices in the HTML sources and re-render (next section).

## Re-rendering (only if edits are needed)

The Windows paths differ from the cloud container's. You need Node + Playwright (with a Chromium) and ffmpeg.

1. In `render.js`, point `executablePath` at the local Chrome/Chromium, or delete that option so Playwright uses its own.
2. Run `node render.js ad-96.html x frames96 30`. Preview single moments with `node render.js ad-96.html x prev 30 4.4,8,13.2`.
3. Run `python3 sfx.py 96 a96.wav` (or `chat`); `python3 soundtrack.py` makes the quiz-ad audio.
4. Encode with `ffmpeg -framerate 30 -i frames96/f%04d.jpg -i a96.wav -c:v libx264 -crf 18 -pix_fmt yuv420p -movflags +faststart -c:a aac -shortest out/<name>.mp4`.

Fonts (Cairo, Inter) are bundled in `fonts/`, so no network is needed.
