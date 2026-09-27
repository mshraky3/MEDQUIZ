# SQB TikTok ads

Vertical motion-graphics ads (1080×1920, 30 fps, H.264 + AAC). Every `*-silent.mp4` is the same cut with no audio, so a trending sound can be added in the TikTok app.

**Every National Day file below must stop running after 1 Oct 2026**, when the offer ends. Only the evergreen cut stays valid after that.

| Ad | Source | Files | Length |
|---|---|---|---|
| Quiz hook, offer prices | `ad.html?v=offer` | `out/sqb-tiktok-offer*.mp4` | 21 s |
| Quiz hook, regular prices | `ad.html?v=evergreen` | `out/sqb-tiktok-evergreen*.mp4` | 21 s |
| National Day "96 = 96" | `ad-96.html` | `out/sqb-tiktok-nationalday-96*.mp4` | 18 s |
| National Day group chat | `ad-chat.html` | `out/sqb-tiktok-nationalday-chat*.mp4` | 22 s |

## National Day "96 = 96"

Saudi green and gold kinetic typography: a big gold **96** with confetti ("كل عام والوطن بخير") → "وبهالمناسبة… اشتراك 4 أشهر صار": **129** is struck through and falls away, **96** drops in → "والسنة الكاملة؟": a slot machine spins 299 → **196** → group cards: 3 accounts 196 (65 each), 5 accounts 296 (59 each) → a 1 October calendar page + CTA "اشترك قبل نهاية العرض".

> 96 سنة وطن… و96 ريال لـ4 أشهر تحضير 🇸🇦💚
> والسنة كاملة بـ196 بدل 299. العرض ينتهي 1 أكتوبر، الرابط في البايو
> #اليوم_الوطني_96 #SMLE #SNLE #برومترك #هيئة_التخصصات_الصحية #عروض_اليوم_الوطني

## National Day group chat

A dramatized study group chat ("دفعة SMLE 2026"). Messages pop in with typing indicators, and you type into the input bar. Someone recommends SQB and shares the offer card. The group decides to subscribe together (3 for 196 = 65 each, 5 for 296 = 59 each) and asks when it ends: "لين 1 أكتوبر". The chat then blurs into an end card with the group prices + CTA.

> منشن دفعتك 👇 اشتركوا جماعة ووفّروا
> 3 حسابات بـ196 (65 للواحد) · 5 حسابات بـ296 (59 للواحد) — عرض اليوم الوطني لين 1 أكتوبر
> #اليوم_الوطني_96 #SMLE #SNLE #امتياز #طب #تمريض #برومترك

The chat is a dramatization, not real users; its prompt to tag friends is what drives shares.

---

# Quiz hook ad — "5 seconds"

| File | Use |
|---|---|
| `out/sqb-tiktok-offer.mp4` | National Day 96 prices (4 months 96, year 196). **Stop running it after 1 Oct 2026**, when the offer ends. |
| `out/sqb-tiktok-evergreen.mp4` | Regular prices (50/month, 4 months 129 vs 200). Safe to run any time. |
| `*-silent.mp4` | Same cuts with no audio, so you can add a trending TikTok sound in the app. |
| `out/cover.jpg` | Cover frame (the question card). |

## Storyboard

1. **0–3 s hook:** "عندك 5 ثوانٍ — هل تعرف الإجابة؟"
2. **3–10.6 s:** a real public SMLE question (id 25593, aortic dissection) with a 5-second countdown, the answer reveal, and an Arabic explanation.
3. **10.6–14.8 s:** 5,033 questions, an explanation for every answer, weak-spot analytics, and both tracks (SMLE / SNLE).
4. **14.8–18.3 s:** prices (offer or evergreen).
5. **18.3–21 s:** CTA "ابدأ بـ 40 سؤالاً مجاناً" + smle-question-bank.com + "الرابط في البايو".

The main content stays inside y 120–1560, clear of TikTok's caption and button overlays.

## Captions

**Offer:**
> عندك 5 ثوانٍ… جاوبت صح؟ 👀 اكتب إجابتك بالتعليقات
> عرض اليوم الوطني: 4 أشهر بـ96 ريال وسنة بـ196 — ينتهي 1 أكتوبر 🇸🇦
> ابدأ بـ40 سؤال مجاناً، الرابط في البايو
> #SMLE #SNLE #برومترك #هيئة_التخصصات_الصحية #طب #تمريض #اليوم_الوطني_96

**Evergreen:**
> عندك 5 ثوانٍ… جاوبت صح؟ 👀 اكتب إجابتك بالتعليقات
> بنك أسئلة SMLE و SNLE بالعربي، مع تفسير لكل إجابة وتحليل لنقاط ضعفك
> ابدأ بـ40 سؤال مجاناً، الرابط في البايو
> #SMLE #SNLE #برومترك #هيئة_التخصصات_الصحية #طب #تمريض #امتياز

## Rebuilding

```bash
# node render.js <page> <variant> <outDir> [fps] [preview times]
NODE_PATH=/opt/node22/lib/node_modules node render.js ad.html offer frames_offer 30   # or: evergreen
python3 soundtrack.py                         # quiz ad audio -> soundtrack.wav
python3 sfx.py 96 a96.wav                     # or: python3 sfx.py chat achat.wav
ffmpeg -framerate 30 -i frames_offer/f%04d.jpg -i soundtrack.wav -c:v libx264 -crf 18 \
  -pix_fmt yuv420p -movflags +faststart -c:a aac -shortest out/sqb-tiktok-offer.mp4
```

Edit the text, timings or prices in `ad.html`: the `render(t)` function drives every frame. Shared animation helpers are in `anim.js`. Preview single moments with `node render.js ad-96.html x previews 30 4.4,8,13.2`.
