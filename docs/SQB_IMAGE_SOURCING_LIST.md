# SQB — image sourcing list for the anatomy figures

> ## ✅ TIER 1 IS DONE — I sourced and wired all of it myself
> All 8 Tier-1 images are downloaded, licence-checked, resized and live:
> steeple sign · thumbprint sign · epidural CT · subdural CT · urate crystals ·
> CPPD crystals · bowel-obstruction AXR (+ the 2 placenta illustrations).
> Nothing NonCommercial was used; Radiopaedia was avoided on purpose.
> **You don't need to collect anything in Tier 1.**
>
> **What's left for you: Tier 2 (12 images).** Tier 3 I recommend skipping.

You collect the images, I wire them in. **14 figures** still need real imagery.

---

## READ THIS FIRST — licences that are safe vs licences that will bite

SQB is a **paid product**. That kills some licences that look free.

| Licence | Use it? | Why |
|---|---|---|
| **Public domain / CC0 / PD-US** | ✅ best | No attribution needed, no conditions |
| **CC BY** (any version) | ✅ yes | Just needs a visible credit line |
| **CC BY-SA** (any version) | ⚠️ usable | Credit + if you *edit the image*, the edit must be CC BY-SA too. Don't crop/recolour it |
| **CC BY-NC / NC-SA** | ❌ **NO** | "NonCommercial" — SQB charges money, so this is a licence breach |
| **GFDL only** | ❌ avoid | Awkward, needs the full licence text shipped |
| Medscape, UpToDate, Amboss, Osmosis, textbooks, Google Images | ❌ **NO** | Copyrighted. Real takedown risk |

> ⚠️ **Radiopaedia is the big trap.** Most Radiopaedia cases are **CC BY-NC-SA** —
> the NC makes them unusable for SQB. A few are CC BY. Check every single case
> page individually; do not assume.

### For each image, send me these 4 things
1. The **file** itself
2. **Author / attribution string** exactly as the source states it
3. **Licence + version** (e.g. "CC BY 4.0")
4. **Source page URL**

Without 2–4 I can't add the credit line, and without the credit line we're in breach.

### Where to save them
Put files in `my-react-app/public/summaries/` using the **exact filename** in each
row below. If you use a different name just tell me and I'll adjust.
Prefer `.webp` or `.jpg`; keep the long edge ≤ 1600px so pages stay fast.

---

## Good hunting grounds

| Source | Licence | Link |
|---|---|---|
| Wikimedia Commons (MediaSearch) | mixed — check each | https://commons.wikimedia.org/wiki/Special:MediaSearch |
| OpenStax Anatomy & Physiology 2e | CC BY 4.0 | https://openstax.org/details/books/anatomy-and-physiology-2e |
| Gray's Anatomy plates | public domain | https://commons.wikimedia.org/wiki/Category:Gray%27s_Anatomy_plates |
| NCI Visuals Online | mostly public domain | https://visualsonline.cancer.gov/ |
| CDC Public Health Image Library | mostly public domain | https://phil.cdc.gov/ |
| Blausen Medical gallery | CC BY 3.0 | https://commons.wikimedia.org/wiki/Category:Blausen_medical_gallery |

---

# TIER 1 — a drawing genuinely cannot teach these (do these first)

These are "what the actual scan looks like". A schematic is close to useless here.

### 1. Croup — steeple sign
- **Save as:** `croup-steeple-sign.jpg`
- **Must show:** AP neck/chest X-ray, subglottic narrowing tapering to a point
- ✅ **Verified candidate:** https://commons.wikimedia.org/wiki/File:Croup_steeple_sign.jpg
- Also: https://commons.wikimedia.org/wiki/Category:Radiologic_signs

### 2. Epiglottitis — thumbprint sign
- **Save as:** `epiglottitis-thumbprint-sign.jpg`
- **Must show:** *lateral* neck X-ray, swollen epiglottis like a thumb
- ✅ **Verified category:** https://commons.wikimedia.org/wiki/Category:Epiglottitis
- Search: https://commons.wikimedia.org/w/index.php?search=epiglottitis+thumb+sign+lateral+neck&title=Special:MediaSearch&type=image

### 3. Small bowel obstruction on AXR
- **Save as:** `sbo-axr.jpg`
- **Must show:** dilated central small bowel loops, valvulae conniventes crossing the full width, air-fluid levels
- ✅ **Verified candidate:** https://commons.wikimedia.org/wiki/File:Upright_abdominal_X-ray_demonstrating_a_bowel_obstruction.jpg
- Search: https://commons.wikimedia.org/w/index.php?search=small+bowel+obstruction+radiograph&title=Special:MediaSearch&type=image

### 4. Large bowel obstruction on AXR
- **Save as:** `lbo-axr.jpg`
- **Must show:** peripheral dilated colon, haustra that do *not* cross the full width
- Search: https://commons.wikimedia.org/w/index.php?search=large+bowel+obstruction+radiograph+colon&title=Special:MediaSearch&type=image

### 5. Epidural (extradural) haematoma on CT
- **Save as:** `epidural-haematoma-ct.jpg`
- **Must show:** lens-shaped / biconvex hyperdense collection, ideally with the skull fracture
- ✅ **Verified candidates:**
  - https://commons.wikimedia.org/wiki/File:EpiduralHematoma.jpg *(CC BY-SA 4.0 — usable, don't edit)*
  - https://commons.wikimedia.org/wiki/File:Epidural_hematoma.png
- Category: https://commons.wikimedia.org/wiki/Category:Epidural_hematoma

### 6. Subdural haematoma on CT
- **Save as:** `subdural-haematoma-ct.jpg`
- **Must show:** crescent-shaped collection following the skull contour
- ✅ **Verified candidate:** https://commons.wikimedia.org/wiki/File:Ct-scan_of_the_brain_with_an_subdural_hematoma.jpg
- ✅ **Verified category:** https://commons.wikimedia.org/wiki/Category:CT_images_of_subdural_hematoma

### 7. Gout — monosodium urate crystals
- **Save as:** `gout-msu-crystals.jpg`
- **Must show:** needle-shaped crystals under polarised light with red compensator
- ✅ **Verified candidate:** https://commons.wikimedia.org/wiki/File:Gout_-_monosodium_urate_crystals_(20X,_polarized,_red_compensator).jpg

### 8. Pseudogout — CPPD crystals
- **Save as:** `pseudogout-cppd-crystals.jpg`
- **Must show:** rhomboid crystals, positively birefringent
- Search: https://commons.wikimedia.org/w/index.php?search=calcium+pyrophosphate+crystals+polarized&title=Special:MediaSearch&type=image
- ⚠️ Harder to find open-licensed than MSU. If you only get one crystal image, get the gout one.

---

# TIER 2 — anatomy the student must recognise

### 9. Ectopic pregnancy — implantation sites
- **Save as:** `ectopic-sites.jpg`
- **Must show:** uterus + tube with the sites labelled (ampulla, isthmus, fimbria, interstitial, ovarian, cervical)
- I searched this one already and rejected 3 candidates — details in the handoff. Options I found:
  - https://commons.wikimedia.org/wiki/File:Ectopic_Pregnancy.png — CC BY-SA 4.0, 1200×685, couldn't confirm all six sites labelled
  - https://commons.wikimedia.org/wiki/File:Ectopic_Pregnancy_Diagram.jpg — CC BY-SA 3.0, shows only the tubal site
  - https://commons.wikimedia.org/wiki/File:Ectopic-pregnancy-area.png — CC BY-SA 3.0 + GFDL, only 234×225 (too small)
- **My suggestion:** grab a clean CC BY illustration of the **uterus + fallopian tubes** instead, and I'll keep the existing percentage legend beside it — the percentages are the exam point and no open image carries them.
  - https://commons.wikimedia.org/wiki/Category:Human_female_reproductive_system

### 10. Inguinal hernia — direct vs indirect
- **Save as:** `inguinal-hernia-direct-indirect.jpg`
- **Must show:** inferior epigastric vessels with the hernia sac medial (direct) vs lateral (indirect)
- Search: https://commons.wikimedia.org/w/index.php?search=inguinal+hernia+direct+indirect+anatomy&title=Special:MediaSearch&type=image

### 11. Breast quadrants
- **Save as:** `breast-quadrants.jpg`
- **Must show:** the four quadrants + axillary tail
- Search: https://commons.wikimedia.org/w/index.php?search=breast+quadrants+anatomy&title=Special:MediaSearch&type=image

### 12. Acute scrotum / testicular torsion
- **Save as:** `testicular-torsion.jpg`
- **Must show:** twisted spermatic cord, ideally vs normal
- Search: https://commons.wikimedia.org/w/index.php?search=testicular+torsion+anatomy&title=Special:MediaSearch&type=image

### 13. Pelvic organ prolapse by compartment
- **Save as:** `pelvic-prolapse-compartments.jpg`
- **Must show:** cystocele (anterior), rectocele (posterior), uterine/vault (apical)
- Search: https://commons.wikimedia.org/w/index.php?search=pelvic+organ+prolapse+cystocele+rectocele&title=Special:MediaSearch&type=image

### 14. Paediatric hip disorders (DDH / Perthes / SCFE)
- **Save as:** `hip-ddh.jpg`, `hip-perthes.jpg`, `hip-scfe.jpg` *(or one combined image)*
- **Must show:** SCFE especially — the femoral head slipping posteroinferiorly, "ice cream off the cone"
- Search: https://commons.wikimedia.org/w/index.php?search=slipped+capital+femoral+epiphysis+radiograph&title=Special:MediaSearch&type=image

### 15. Oesophageal cancer — location
- **Save as:** `oesophagus-anatomy.jpg`
- **Must show:** oesophagus divided into upper/middle/lower thirds with the GE junction
- Search: https://commons.wikimedia.org/w/index.php?search=esophagus+anatomy+thirds&title=Special:MediaSearch&type=image

### 16. Penetrating neck trauma — zones
- **Save as:** `neck-zones.jpg`
- **Must show:** zones I / II / III boundaries on a neck
- Search: https://commons.wikimedia.org/w/index.php?search=neck+trauma+zones+anatomy&title=Special:MediaSearch&type=image

### 17. Appendicitis — McBurney's point
- **Save as:** `mcburney-point.jpg`
- **Must show:** the point at the outer ⅓ of the umbilicus-to-ASIS line
- Search: https://commons.wikimedia.org/w/index.php?search=McBurney+point&title=Special:MediaSearch&type=image

### 18. Paediatric hernias — inguinal vs umbilical
- **Save as:** `paediatric-hernias.jpg`
- **Must show:** an infant umbilical hernia and/or inguinal hernia
- Search: https://commons.wikimedia.org/w/index.php?search=umbilical+hernia+infant&title=Special:MediaSearch&type=image

### 19. Solitary thyroid nodule
- **Save as:** `thyroid-anatomy.jpg`
- **Must show:** thyroid gland anatomy, ideally with a nodule
- Search: https://commons.wikimedia.org/w/index.php?search=thyroid+gland+anatomy+nodule&title=Special:MediaSearch&type=image

### 20. Four stages of labour
- **Save as:** `labour-stages.jpg`
- **Must show:** fetal descent/rotation through the pelvis
- Search: https://commons.wikimedia.org/w/index.php?search=stages+of+labor+fetal+descent&title=Special:MediaSearch&type=image

---

# TIER 3 — optional, these work fine as schematics

I'd **leave these as drawings**. They're maps, ladders and mnemonics rather than
anatomy you must visually recognise — a photo would make them *worse*, not better.
Listed only so nothing is unaccounted for.

| Figure | Why a drawing is fine |
|---|---|
| Coronary territories & ECG leads | It's an artery→lead mapping table drawn as a wheel |
| Rule of Nines | A percentage map, not anatomy |
| Nerve palsies — deformity & site | A lookup table |
| Anal canal clock | A clock-face position map |
| Acute limb ischaemia — 6 Ps | A mnemonic list |
| Meningitis — reading the CSF | A numbers table |

If you disagree on any of these, say so and I'll source them too.

---

## Summary of what to collect

- **Tier 1: 8 images** — highest value, do first
- **Tier 2: 12 images** (a couple of figures may want 2–3)
- **Tier 3: 0** — recommend leaving as-is

Drop them in `my-react-app/public/summaries/` with the filenames above, send me
the author + licence + source URL for each, and I'll rebuild each figure around
the image with the required credit line and keep the clinical text that's
currently carrying the teaching points.
