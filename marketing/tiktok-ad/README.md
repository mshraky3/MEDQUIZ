# SQB TikTok ad — "5 seconds" quiz hook

Vertical motion-graphics ad (1080×1920, 21 s, 30 fps, H.264 + AAC).

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
NODE_PATH=/opt/node22/lib/node_modules node render.js offer frames_offer 30   # or: evergreen
python3 soundtrack.py                                                         # writes soundtrack.wav
ffmpeg -framerate 30 -i frames_offer/f%04d.jpg -i soundtrack.wav -c:v libx264 -crf 18 \
  -pix_fmt yuv420p -movflags +faststart -c:a aac -shortest out/sqb-tiktok-offer.mp4
```

Edit the text, timings or prices in `ad.html`: the `render(t)` function drives every frame. Preview single moments with `node render.js offer previews 30 6,9.5,16.9`.
