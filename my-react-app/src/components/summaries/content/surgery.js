// Surgery — section content for the summaries page. Sourced verbatim from
// "Surgery Comprehensive Summary — All-in-One Surgery Review"
// (summarys/Surgery_Comprehensive_Summary.pdf, 62 pages). The file's table of
// contents defines 18 numbered topics; each maps to one subtopic card below.
// Tables are reproduced as real HTML tables, algorithms as ordered callouts, and
// the file's 30 "Key MCQs" become interactive questions (0-based answer index +
// explanation), supplemented by authored high-yield questions. Angle brackets
// HTML-escaped.

const surgery = {
    id: 'surgery',
    title: 'Surgery',
    title_en: 'Comprehensive Surgery Review — 18 Topics',
    icon: 'scalpel',
    accent: '#fb7185',
    intro: 'Surgery comprehensive review — 18 high-yield topics with algorithms, tables and MCQs: Anal & Perianal · Bariatric · Breast · Vascular & Cardiothoracic · Colon · Fluid/Electrolyte & Nutrition · Endocrine · Gastro-Esophageal & Gastric · Hepato-Biliary & Pancreatic · Neurosurgery · Orthopedics · Pediatric Surgery · Plastic & Skin · Pre/Post-Op Care · Shock · Trauma · UGIB/LGIB · Urology.',
    subtopics: [
        {
            id: 'surg-anal',
            title: '01 — Anal & Perianal Diseases',
            title_en: 'Hemorrhoids · Anal Fissure · Abscess & Fistula · Anal/Rectal Cancer',
            summaryHtml: `
                <h3>Hemorrhoids</h3>
                <ul>
                    <li><b>Internal</b>: painless bright-red bleeding after defecation; perianal mass at <b>3, 7, 11 o'clock</b>, pruritus, discharge</li>
                    <li><b>External</b>: severe perianal pain with a tender purplish mucosal mass</li>
                </ul>
                <table>
                    <thead><tr><th>Step</th><th>Details</th></tr></thead>
                    <tbody>
                        <tr><td>Diagnosis</td><td>History, DRE, anoscopy ± proctoscopy</td></tr>
                        <tr><td>Further workup</td><td>Colonoscopy if age &gt;45, risk factors, or red flags for colon cancer</td></tr>
                        <tr><td>Grade IV internal</td><td>Open hemorrhoidectomy</td></tr>
                        <tr><td>External</td><td>Surgical excision if pain &lt;3–4 days; medical treatment for late presentation</td></tr>
                        <tr><td>Post-op complications</td><td>Pain, urine retention, fecal impaction, bleeding</td></tr>
                    </tbody>
                </table>
                <div class="sum-callout"><b>High-yield</b>: sclerosing therapy is most indicated for <b>internal</b> hemorrhoids (not external, prolapsed, or thrombosed).</div>

                <h3>Anal Fissure</h3>
                <ul>
                    <li>Sharp severe pain during defecation, bright-red blood, pruritus, chronic constipation</li>
                    <li>Commonly at the <b>anterior or posterior midline</b> (6 or 12 o'clock)</li>
                </ul>
                <div class="sum-callout">
                    <b>Algorithm — anal fissure</b>
                    <ol>
                        <li>Clinical diagnosis + lifestyle treatment of constipation</li>
                        <li>Acute (&lt;6 weeks) → topical CCB (diltiazem)</li>
                        <li>Chronic (&gt;6 weeks) → lateral internal sphincterotomy</li>
                    </ol>
                </div>

                <h3>Anal Abscess &amp; Fistula</h3>
                <table>
                    <thead><tr><th>Condition</th><th>Features</th><th>Management</th></tr></thead>
                    <tbody>
                        <tr><td>Anal abscess</td><td>Painful tender swelling + fever, leukocytosis</td><td>Incision &amp; drainage</td></tr>
                        <tr><td>Anal hematoma</td><td>Painful swelling, vitally stable, no leukocytosis</td><td>Conservative or evacuation</td></tr>
                        <tr><td>Simple fistula</td><td>Anal swelling &amp; discharge, may rupture</td><td>Fistulotomy</td></tr>
                    </tbody>
                </table>
                <div class="sum-callout">
                    <b>Complex fistula</b>: 1) Known Crohn's? → MRI (assess tract) → colonoscopy to confirm; 2) IV antibiotics; 3) Infliximab (refractory).
                </div>

                <h3>Anal &amp; Rectal Cancer</h3>
                <table>
                    <thead><tr><th>Feature</th><th>Anal cancer</th><th>Rectal cancer</th><th>Condyloma acuminata</th></tr></thead>
                    <tbody>
                        <tr><td>Size</td><td>&lt;2 cm</td><td>≥2 cm</td><td>Multiple</td></tr>
                        <tr><td>Symptoms</td><td>Pain, bleeding, mass at anal verge</td><td>Change in bowel habits, systemic</td><td>Multiple warty masses</td></tr>
                        <tr><td>Appearance</td><td>Solitary, friable</td><td>Solitary, friable</td><td>Multiple cauliflower-like</td></tr>
                    </tbody>
                </table>
                <div class="sum-callout"><b>Fournier's gangrene</b>: immunocompromised + acute painful perineal swelling + erythematous fluctuant area + crepitus + foul-smelling discharge → <b>emergency surgical debridement</b> (not just antibiotics).</div>
            `,
            questions: [
                {
                    q: 'A 30-year-old has PR bleeding and swelling at the 3 and 7 o\'clock positions. Sclerosing therapy is planned. It is most indicated for which type of hemorrhoid?',
                    options: ['External hemorrhoids', 'Internal hemorrhoids', 'Prolapsed hemorrhoids', 'Thrombosed hemorrhoids'],
                    answer: 1,
                    explanation: 'Sclerotherapy is indicated for internal hemorrhoids; external, prolapsed and thrombosed hemorrhoids require other management.'
                },
                {
                    q: 'An immunocompromised patient has acute painful perineal swelling with an erythematous fluctuant area, crepitus and foul-smelling discharge. What is the management?',
                    options: ['Penicillin G infusion', 'Emergency surgical debridement', 'Aspiration of the collection', 'Topical polymyxin ointment'],
                    answer: 1,
                    explanation: 'Crepitus + foul-smelling discharge in an immunocompromised patient is Fournier\'s gangrene (necrotizing fasciitis), which requires emergency surgical debridement.'
                },
                {
                    q: 'A patient has a chronic posterior-midline anal fissure present for 8 weeks that has failed topical therapy. What is the definitive treatment?',
                    options: ['Rubber-band ligation', 'Lateral internal sphincterotomy', 'Topical diltiazem', 'Hemorrhoidectomy'],
                    answer: 1,
                    explanation: 'A chronic fissure (>6 weeks) is treated with lateral internal sphincterotomy; topical CCB/GTN is first-line for acute fissures.'
                }
            ]
        },
        {
            id: 'surg-bariatric',
            title: '02 — Bariatric Surgery',
            title_en: 'Indications · Pre-Operative Workup · Procedure Selection',
            summaryHtml: `
                <h3>Indications</h3>
                <ul>
                    <li>BMI ≥40</li>
                    <li>BMI ≥35 with comorbidities (DM, HTN, OSA)</li>
                    <li>Failed medical weight-loss therapy</li>
                </ul>
                <table>
                    <thead><tr><th>Step</th><th>Details</th></tr></thead>
                    <tbody>
                        <tr><td>Essential workup</td><td>Upper GI endoscopy (detects reflux, hernia, ulcers), CBC, LFT, HbA1c, TSH, psychiatric evaluation</td></tr>
                        <tr><td>Severe GERD / large hiatal hernia</td><td>Roux-en-Y gastric bypass</td></tr>
                        <tr><td>No reflux / less invasive preferred</td><td>Gastric sleeve</td></tr>
                    </tbody>
                </table>
                <div class="sum-callout"><b>Note</b>: upper GI endoscopy is the most important step to guide the type of surgery.</div>

                <h3>Post-Operative Complications</h3>
                <table>
                    <thead><tr><th>Timing</th><th>Complication</th><th>Key clue / management</th></tr></thead>
                    <tbody>
                        <tr><td>Early</td><td>Anastomotic/staple-line leak</td><td>Tachycardia + fever + abdominal pain on POD 1–5; tachycardia is the earliest sign → CT/contrast study, re-operation or drainage</td></tr>
                        <tr><td>Early</td><td>VTE (PE)</td><td>Leading cause of post-op death — VTE prophylaxis, early mobilization</td></tr>
                        <tr><td>Late</td><td>Dumping syndrome</td><td>Post-prandial cramps, diarrhea, flushing, palpitations after high-sugar meals → dietary modification (small, low-simple-sugar meals)</td></tr>
                        <tr><td>Late</td><td>Nutritional deficiencies</td><td><b>Iron, B12, folate, calcium, vitamin D, thiamine (B1)</b> — lifelong supplementation and monitoring; thiamine deficiency → Wernicke encephalopathy</td></tr>
                        <tr><td>Late</td><td>Internal hernia / marginal ulcer / gallstones</td><td>Bypass anatomy predisposes to internal hernia (obstruction) and marginal ulcers; rapid weight loss → gallstones</td></tr>
                    </tbody>
                </table>
            `,
            questions: [
                {
                    q: 'Which patient meets the criteria for bariatric surgery?',
                    options: ['BMI 28 with no comorbidities', 'BMI 32 who has not tried diet', 'BMI 36 with type 2 diabetes and hypertension after failed medical therapy', 'BMI 34 with no comorbidities'],
                    answer: 2,
                    explanation: 'Indications: BMI ≥40, or BMI ≥35 with comorbidities (DM, HTN, OSA) after failed medical weight loss.'
                },
                {
                    q: 'A patient is being worked up for bariatric surgery. Which investigation is the single most important step in guiding the choice of procedure?',
                    options: ['Upper GI endoscopy', 'HbA1c', 'Thyroid function tests', 'Liver function tests'],
                    answer: 0,
                    explanation: 'Upper GI endoscopy detects reflux, hiatal hernia and ulcers and is the most important step in selecting the procedure (e.g. Roux-en-Y for severe GERD/large hiatal hernia vs sleeve otherwise).'
                }
            ]
        },
        {
            id: 'surg-breast',
            title: '03 — Breast Diseases',
            title_en: 'Mastitis & Abscess · Benign Disease · Breast Cancer · Phyllodes',
            summaryHtml: `
                <h3>Mastitis &amp; Breast Abscess</h3>
                <ul>
                    <li>Tender, indurated, swollen, erythematous breast + malaise, fever, chills + pain during breastfeeding</li>
                </ul>
                <div class="sum-callout">
                    <b>Algorithm</b>: Mastitis → anti-staph antibiotics (dicloxacillin, flucloxacillin). Fluctuant mass + skin changes → abscess: multiple abscesses / ≥5 cm / thinned-ischemic-necrotic skin → <b>I&amp;D</b>; otherwise → <b>aspiration</b>.
                </div>

                <h3>Benign Breast Diseases</h3>
                <table>
                    <thead><tr><th>Condition</th><th>Key features</th><th>Management</th></tr></thead>
                    <tbody>
                        <tr><td>Fibroadenoma</td><td>Young, oval, mobile, painless, cyclical</td><td>&gt;2–3 cm or growing → wide local excision</td></tr>
                        <tr><td>Ductal ectasia</td><td>Inverted nipple, greenish discharge</td><td>Intraductal excision</td></tr>
                        <tr><td>Fibrocystic change</td><td>Multiple bilateral small masses, milky/greenish discharge, painful, menstrual-related</td><td>Conservative (NSAID/hormonal for severe pain)</td></tr>
                        <tr><td>Intraductal papilloma</td><td>Most common cause of non-lactating bloody nipple discharge</td><td>Intraductal excision</td></tr>
                        <tr><td>Atypical ductal hyperplasia</td><td>On biopsy</td><td>Wide local excision</td></tr>
                    </tbody>
                </table>

                <h3>Breast Cancer</h3>
                <ul>
                    <li><b>Lump</b>: hard, immobile, irregular, upper outer quadrant</li>
                    <li><b>Skin</b>: tethering, peau d'orange, ulceration · <b>Nipple</b>: retraction, bloody spontaneous unilateral discharge · palpable axillary nodes</li>
                    <li><b>Screening (MOH)</b>: mammogram age 40–50 every 2 yrs; 50–69 every 1–2 yrs</li>
                </ul>
                <table>
                    <thead><tr><th>Step</th><th>Criteria</th><th>Investigation</th></tr></thead>
                    <tbody>
                        <tr><td>Imaging</td><td>Age &gt;30 OR 1st-degree relative with BC 10 yrs older</td><td>Mammogram ± US</td></tr>
                        <tr><td>Imaging</td><td>Age &lt;30</td><td>US</td></tr>
                        <tr><td>Biopsy</td><td>Solid mass</td><td>Core needle biopsy</td></tr>
                        <tr><td>Biopsy</td><td>Cystic mass</td><td>Fine needle aspiration</td></tr>
                        <tr><td>Staging</td><td colspan="2">TNM; CT CAP for distant mets; sentinel LN biopsy for nodal staging</td></tr>
                    </tbody>
                </table>

                <h3>Phyllodes Tumor</h3>
                <ul>
                    <li>Young women (20–30s), <b>rapidly growing</b> large mass, NOT cyclical, skin thinning, firm/well-circumscribed/mobile/lobulated</li>
                    <li>Diagnosis: core needle biopsy · Staging: CT CAP (hematogenous spread)</li>
                    <li>Small → wide local excision with ≥1 cm margins · &gt;8 cm → simple mastectomy</li>
                </ul>
            `,
            questions: [
                {
                    q: 'A 55-year-old woman has a hard, irregular, immobile breast lump with overlying skin dimpling. What is the most appropriate biopsy?',
                    options: ['Fine-needle aspiration', 'Core needle biopsy', 'Excisional biopsy first', 'Repeat exam in 3 months'],
                    answer: 1,
                    explanation: 'A suspicious solid mass is sampled by core needle biopsy (histology + receptor status); FNA is used for cystic lesions.'
                },
                {
                    q: 'A 45-year-old woman has spontaneous, unilateral, single-duct bloody nipple discharge with no palpable mass and is not lactating. What is the most likely cause?',
                    options: ['Intraductal papilloma', 'Fibroadenoma', 'Ductal ectasia', 'Fat necrosis'],
                    answer: 0,
                    explanation: 'Intraductal papilloma is the most common cause of non-lactating bloody nipple discharge; treated by intraductal excision.'
                },
                {
                    q: 'A woman in her 20s has a rapidly enlarging, firm, well-circumscribed breast mass with skin thinning that is unrelated to her menstrual cycle. Which diagnosis should be suspected?',
                    options: ['Phyllodes tumor', 'Simple cyst', 'Fibrocystic change', 'Lipoma'],
                    answer: 0,
                    explanation: 'A rapidly growing, large, mobile, lobulated mass not related to the cycle suggests a phyllodes tumor; core needle biopsy is diagnostic, with wide local excision (≥1 cm margins) or mastectomy for >8 cm.'
                }
            ]
        },
        {
            id: 'surg-vascular',
            title: '04 — Vascular & Cardiothoracic Surgery',
            title_en: 'AAA · Acute Limb Ischemia · PAD · Foot Ulcers · Venous Disease',
            summaryHtml: `
                <h3>Abdominal Aortic Aneurysm (AAA)</h3>
                <ul>
                    <li>Pulsatile supraumbilical mass, epigastric pain radiating to the back, bruit</li>
                </ul>
                <table>
                    <thead><tr><th>Scenario</th><th>Investigation</th><th>Management</th></tr></thead>
                    <tbody>
                        <tr><td>Asymptomatic / unstable</td><td>US (initial)</td><td>Observe if below repair threshold; unstable + suspected rupture → theatre</td></tr>
                        <tr><td>Stable &amp; symptomatic</td><td>CT-angio (confirmatory)</td><td>Repair if &gt;5.5 cm (men) / &gt;5 cm (women), ruptured, or symptomatic</td></tr>
                    </tbody>
                </table>

                <h3>Acute Limb Ischemia — the 6 Ps</h3>
                <p><b>P</b>ain · <b>P</b>allor · <b>P</b>aresthesia · <b>P</b>ulselessness · <b>P</b>erishing cold · <b>P</b>aralysis</p>
                <div class="sum-callout">
                    <b>Approach</b>
                    <ol>
                        <li>Heparin</li>
                        <li>US (initial imaging)</li>
                        <li>CT-angio (gold standard)</li>
                        <li>Treat by cause: ABI &lt;0.3 + irreversible paralyzed limb → amputation; A.fib/cardiac → embolectomy; arterial thrombosis → catheter thrombolysis</li>
                    </ol>
                    Skip imaging if the limb is paralyzed — URGENT intervention needed.
                </div>

                <h3>Peripheral Arterial Disease (PAD)</h3>
                <ul>
                    <li>Intermittent claudication, rest pain (improves hanging feet off bed), absent/diminished pulse</li>
                    <li>Workup: ABI → US → CT-angiography · Treat: supervised exercise, risk-factor control, <b>aspirin</b> (MI is the commonest cause of death in PAD)</li>
                    <li><b>Leriche syndrome</b>: claudication + decreased femoral pulse + erectile dysfunction → aorto-femoral bypass</li>
                </ul>

                <h3>Foot Ulcers &amp; Venous Disease</h3>
                <table>
                    <thead><tr><th>Feature</th><th>Arterial ulcer</th><th>Venous ulcer</th></tr></thead>
                    <tbody>
                        <tr><td>Pulse</td><td>Absent</td><td>Intact</td></tr>
                        <tr><td>Appearance</td><td>Pale, punched-out, painful</td><td>Dark discoloration, superficial, painless</td></tr>
                        <tr><td>Investigation</td><td>Arterial US</td><td>Venous US</td></tr>
                    </tbody>
                </table>
                <div class="sum-callout"><b>Hard signs of vascular injury → urgent exploration</b>: absent pulse · bruit/palpable thrill · active hemorrhage · expanding hematoma · distal ischemia (6 Ps).</div>
            `,
            questions: [
                {
                    q: 'An asymptomatic AAA is found in a man. At what maximum diameter is elective repair generally indicated?',
                    options: ['5.5 cm or greater', '3.0 cm', '4.0 cm', '8.0 cm'],
                    answer: 0,
                    explanation: 'Elective repair is offered at >5.5 cm in men (>5 cm in women), or if ruptured/symptomatic.'
                },
                {
                    q: 'A patient with atrial fibrillation develops a sudden cold, pale, pulseless, painful leg with still-intact movement and sensation. After IV heparin, what is the definitive treatment?',
                    options: ['Embolectomy', 'Primary amputation', 'Catheter thrombolysis', 'Compression bandaging'],
                    answer: 0,
                    explanation: 'Acute embolic limb ischemia from AF with a viable limb is treated by embolectomy after immediate heparinization; thrombolysis is for thrombotic cases and amputation for irreversible ischemia.'
                },
                {
                    q: 'A man has intermittent claudication, a decreased femoral pulse and erectile dysfunction. What is this triad called?',
                    options: ['Leriche syndrome', 'Buerger disease', 'Raynaud phenomenon', 'May-Thurner syndrome'],
                    answer: 0,
                    explanation: 'Leriche syndrome (aortoiliac occlusive disease) = claudication + decreased femoral pulses + erectile dysfunction; treated with aorto-femoral bypass.'
                }
            ]
        },
        {
            id: 'surg-colon',
            title: '05 — Colon Diseases',
            title_en: 'Obstruction · Hernia · Appendicitis · Diverticulitis · Colon Cancer · Mesenteric Ischemia · IBD',
            summaryHtml: `
                <h3>Bowel Obstruction</h3>
                <p>Cardinal symptoms: pain + distension + constipation/obstipation + vomiting.</p>
                <table>
                    <thead><tr><th>Feature</th><th>Small bowel (SBO)</th><th>Large bowel (LBO)</th></tr></thead>
                    <tbody>
                        <tr><td>Pain</td><td>Colicky periumbilical</td><td>Colicky abdominal</td></tr>
                        <tr><td>Vomiting</td><td>Early</td><td>Late (bilious then feculent)</td></tr>
                        <tr><td>Constipation/distension</td><td>Late</td><td>Early &amp; significant</td></tr>
                    </tbody>
                </table>
                <div class="sum-callout">
                    <b>Management</b>
                    <ol>
                        <li>Initial: erect CXR + abdominal X-ray</li>
                        <li>Confirm: CT abdomen/pelvis with IV contrast</li>
                        <li>ABC + supportive: IV fluids, electrolyte correction, NG decompression, antiemetics</li>
                        <li>Treat cause (hernia, adhesion, volvulus, intussusception)</li>
                        <li>Laparotomy if: peritonitis, strangulation, or failed conservative management</li>
                    </ol>
                </div>
                <p><b>Paralytic ileus</b>: impaired peristalsis w/o mechanical obstruction (post-op/hypokalemia); X-ray dilated small &amp; large bowel, air-fluid levels, no transition point → supportive. <b>Ogilvie syndrome</b>: acute colonic pseudo-obstruction; cecum &gt;10 cm (perforation risk) → supportive, neostigmine, colonoscopic decompression.</p>

                <h3>Hernia</h3>
                <ul>
                    <li><b>Indirect inguinal</b>: through deep ring, <b>lateral</b> to inferior epigastric vessels</li>
                    <li><b>Direct inguinal</b>: <b>medial</b> to inferior epigastric vessels (Hesselbach triangle)</li>
                    <li><b>Femoral</b>: below &amp; lateral to the pubic tubercle (high strangulation risk)</li>
                    <li>Severity: reducible → irreducible → obstructed → <b>strangulated</b> (tense, very tender, reddish, systemic signs); US first investigation</li>
                </ul>

                <h3>Appendicitis</h3>
                <ul>
                    <li>RLQ pain (starts periumbilical, migrates), nausea/vomiting/anorexia, low-grade fever, rebound at McBurney's</li>
                    <li>Diagnosis: US (pediatric/pregnant), CT abdomen (best sensitivity); uncomplicated → laparoscopic appendectomy; abscess → percutaneous drainage + IV antibiotics + interval appendectomy; phlegmon → conservative IV antibiotics</li>
                </ul>

                <h3>Diverticulitis</h3>
                <p>LLQ pain + fever + change in bowel habits → CT abdomen with contrast → colonoscopy after 6–8 weeks (R/O cancer). Abscess → image-guided drainage ± antibiotics (Hinchey); perforation → exploratory laparotomy.</p>

                <h3>Colon Cancer &amp; Mesenteric Ischemia</h3>
                <div class="sum-callout"><b>Key rule</b>: any patient &gt;45 with GI bleeding or anemia → <b>colonoscopy</b> → if cancer: CT CAP → treat per stage. In obstruction with suspected cancer: <b>surgery first</b> (colonoscopy contraindicated in acute obstruction — perforation risk).</div>
                <ul>
                    <li><b>Mesenteric ischemia</b>: cardiac source (A.fib/MI/VHD) + pain <b>out of proportion</b> to exam → CT-angiography</li>
                    <li><b>Ischemic colitis</b>: X-ray <b>thumb-printing</b> in the watershed descending/sigmoid colon</li>
                </ul>

                <h3>Inflammatory Bowel Disease</h3>
                <table>
                    <thead><tr><th>Feature</th><th>Crohn's</th><th>Ulcerative colitis</th></tr></thead>
                    <tbody>
                        <tr><td>Distribution</td><td>Skip lesions, any part of GI</td><td>Continuous, colon only</td></tr>
                        <tr><td>X-ray</td><td>String sign</td><td>Lead-pipe colon</td></tr>
                        <tr><td>Complications</td><td>Abscess, perforation, strictures (SBO), perianal fistula</td><td>Toxic megacolon, bleeding, colon cancer</td></tr>
                    </tbody>
                </table>
                <div class="sum-callout"><b>Toxic megacolon</b>: bloody diarrhea + distension + sepsis; X-ray transverse colon &gt;6 cm, loss of haustration → failed medical therapy OR &gt;10 cm → <b>subtotal colectomy + end ileostomy</b>.</div>
            `,
            questions: [
                {
                    q: 'A 61-year-old has fatigue, streaks of blood in the stool, pallor, Hb 8.3 g/dL and second-degree piles. What is the most likely diagnosis?',
                    options: ['Cecal cancer', 'Rectal cancer', 'Sigmoid (colorectal) cancer', 'Chronically bleeding hemorrhoids'],
                    answer: 2,
                    explanation: 'Anemia with GI bleeding in a patient >45 requires colonoscopy to exclude malignancy; hemorrhoids do not cause significant anemia.'
                },
                {
                    q: 'A 28-year-old with bloody stools undergoes colonoscopy showing a carpet of hundreds of polyps throughout the colon and rectum. What is the most likely diagnosis?',
                    options: ['Ulcerative colitis', 'Diverticulosis coli', 'Familial adenomatous polyposis', 'HPV-related change'],
                    answer: 2,
                    explanation: 'A carpeted colon with hundreds of polyps in a young patient is classic for familial adenomatous polyposis (FAP).'
                },
                {
                    q: 'A 52-year-old with prior ventral hernia repair has distension and vomiting; CT shows a "target sign" at the terminal ileum. What is the most likely cause of the obstruction?',
                    options: ['Small bowel cancer', 'Adhesion to the mesh', 'Meckel\'s diverticulum', 'Late-onset Crohn disease'],
                    answer: 1,
                    explanation: 'Prior abdominal surgery + bowel obstruction = adhesive SBO, the most common cause; the target/whirl sign supports it.'
                },
                {
                    q: 'A 72-year-old diabetic has LLQ pain and bloody diarrhea; X-ray shows thumb-printing in the descending/sigmoid colon. What is the diagnosis?',
                    options: ['Crohn disease', 'Ischemic colitis', 'Ulcerative colitis', 'Acute diverticulitis'],
                    answer: 1,
                    explanation: 'Elderly + cardiovascular risk + acute pain + bloody diarrhea + thumb-printing in the watershed area = ischemic colitis.'
                },
                {
                    q: 'A 19-year-old woman has acute RLQ pain with rebound tenderness, LMP 2 weeks ago and a normal WBC of 9.8. What is the most likely diagnosis?',
                    options: ['Ureterocele', 'Ovarian torsion', 'Honeymoon cystitis', 'Pelvic inflammatory disease'],
                    answer: 1,
                    explanation: 'Acute unilateral pelvic pain in a reproductive-age woman with a normal WBC suggests ovarian torsion — an important appendicitis mimic and the commonest gynecologic emergency.'
                },
                {
                    q: 'A 75-year-old develops severe diarrhea, distension and tenderness after 2 weeks of antibiotics. What is the most appropriate next step?',
                    options: ['CT scan of the chest', 'Diagnostic laparoscopy', 'Exploratory laparotomy', 'Stool for C. difficile toxins'],
                    answer: 3,
                    explanation: 'Recent antibiotic use + diarrhea = C. difficile infection; test the stool for C. difficile toxins.'
                }
            ]
        },
        {
            id: 'surg-fluid',
            title: '06 — Fluid, Electrolyte & Nutrition',
            title_en: 'Dehydration & Electrolytes · Hyperkalemia · Nutrition & Feeding',
            summaryHtml: `
                <h3>Fluid &amp; Electrolyte Changes</h3>
                <table>
                    <thead><tr><th>Condition</th><th>Changes</th><th>Treatment</th></tr></thead>
                    <tbody>
                        <tr><td>Severe vomiting</td><td>Hypochloremic, hypokalemic metabolic alkalosis with paradoxical aciduria</td><td>Normal saline</td></tr>
                        <tr><td>Severe diarrhea</td><td>Hypokalemic metabolic acidosis (HCO3 loss)</td><td>Ringer lactate</td></tr>
                    </tbody>
                </table>
                <table>
                    <thead><tr><th>Condition</th><th>ECG finding</th></tr></thead>
                    <tbody>
                        <tr><td>Hypokalemia</td><td>Flattened T-wave</td></tr>
                        <tr><td>Hyperkalemia</td><td>Peaked T-wave</td></tr>
                    </tbody>
                </table>
                <p><b>Normal urine output</b>: adults &gt;0.5 mL/kg/hr (assume 70 kg if not stated); pediatrics &gt;1 mL/kg/hr.</p>
                <div class="sum-callout">
                    <b>Hyperkalemia with ECG changes</b>
                    <ol>
                        <li>IV calcium gluconate — first (stabilizes cardiac membrane)</li>
                        <li>Insulin + dextrose — shift K+ into cells</li>
                        <li>Sodium bicarbonate (in acidosis), beta-agonists — shift K+ intracellularly</li>
                        <li>Loop diuretics / Kayexalate — promote excretion</li>
                        <li>Hemodialysis — definitive for severe/refractory</li>
                    </ol>
                </div>

                <h3>Nutrition &amp; Feeding</h3>
                <div class="sum-callout"><b>Algorithm</b>: check GIT function → non-functioning GIT → parenteral nutrition; functioning GIT → enteral feeding (preferred).</div>
                <table>
                    <thead><tr><th>Duration</th><th>Standard</th><th>Aspiration risk</th></tr></thead>
                    <tbody>
                        <tr><td>Acute (&lt;1 month)</td><td>Nasogastric tube</td><td>Nasojejunal (NJ) tube</td></tr>
                        <tr><td>Chronic (&gt;1 month)</td><td>Gastrostomy</td><td>Jejunostomy</td></tr>
                    </tbody>
                </table>
                <p><b>Refeeding syndrome</b>: hypokalemia, hypomagnesemia, hypophosphatemia when nutrition is reintroduced after prolonged fasting. <b>Absorption sites</b>: iron — duodenum; folic acid — jejunum; vitamin B12 &amp; bile salts — terminal ileum.</p>
            `,
            questions: [
                {
                    q: 'A patient with hyperkalemia has peaked T-waves on the ECG. What is the first step in management?',
                    options: ['IV calcium gluconate', 'Insulin and dextrose', 'Hemodialysis', 'Salbutamol nebulizer'],
                    answer: 0,
                    explanation: 'With ECG changes, IV calcium gluconate is given first to stabilize the cardiac membrane; insulin/dextrose, bicarbonate, beta-agonists then shift K+, with dialysis as definitive therapy.'
                },
                {
                    q: 'A patient with prolonged severe vomiting (e.g. pyloric obstruction) develops which acid-base/electrolyte picture, and what is the fluid of choice?',
                    options: ['Hypochloremic hypokalemic metabolic alkalosis — normal saline', 'Hyperchloremic metabolic acidosis — Ringer lactate', 'Respiratory alkalosis — dextrose', 'Hyperkalemic acidosis — normal saline'],
                    answer: 0,
                    explanation: 'Severe vomiting causes a hypochloremic, hypokalemic metabolic alkalosis with paradoxical aciduria; it is corrected with normal saline.'
                }
            ]
        },
        {
            id: 'surg-endocrine',
            title: '07 — Endocrine Surgery',
            title_en: 'Thyroid (Bethesda, Complications) · Parathyroid · Adrenal',
            summaryHtml: `
                <h3>Thyroid &amp; Neck Mass</h3>
                <table>
                    <thead><tr><th>Condition</th><th>Key features</th><th>Management</th></tr></thead>
                    <tbody>
                        <tr><td>Goiter</td><td>Midline mass, tracheal/esophageal compression</td><td>Surgery if compressive</td></tr>
                        <tr><td>Thyroglossal cyst</td><td>Central, moves with tongue protrusion</td><td>Surgery</td></tr>
                        <tr><td>Cystic hygroma</td><td>Lateral, clear lymphatic fluid</td><td>Sclerotherapy or surgery</td></tr>
                    </tbody>
                </table>
                <table>
                    <thead><tr><th>Bethesda</th><th>Result</th><th>Action</th></tr></thead>
                    <tbody>
                        <tr><td>I</td><td>Nondiagnostic</td><td>Repeat FNA</td></tr>
                        <tr><td>II</td><td>Benign</td><td>Follow up with US</td></tr>
                        <tr><td>III</td><td>AUS/FLUS</td><td>Repeat FNA</td></tr>
                        <tr><td>IV</td><td>Follicular neoplasm</td><td>Hemithyroidectomy</td></tr>
                        <tr><td>V</td><td>Suspicious for malignancy</td><td>As IV or VI</td></tr>
                        <tr><td>VI</td><td>Malignant</td><td>Near-total thyroidectomy</td></tr>
                    </tbody>
                </table>
                <div class="sum-callout"><b>Post-thyroidectomy</b>: neck swelling + pain hours post-op → <b>hematoma</b> → bedside wound exploration (airway emergency); hoarseness → recurrent laryngeal nerve; high-pitched voice → superior laryngeal nerve; post-op spasms/tetany → hypocalcemia → calcium replacement.</div>
                <p><b>Nodule workup</b>: TIRADS ≥3 + ≥1 cm → FNA (else observe). Low TSH + thyroid scan: no uptake → subacute thyroiditis; diffuse uptake → Graves.</p>

                <h3>Parathyroid</h3>
                <table>
                    <thead><tr><th>Type</th><th>Key features</th></tr></thead>
                    <tbody>
                        <tr><td>Primary</td><td>↑Ca + ↑PTH + low phosphate</td></tr>
                        <tr><td>Secondary</td><td>Low Ca + ↑PTH (compensatory)</td></tr>
                        <tr><td>Tertiary</td><td>Post-transplant, ↑Ca + ↑PTH</td></tr>
                    </tbody>
                </table>
                <p>Persistently ↑Ca and ↑PTH months after parathyroidectomy → missed adenoma/hyperplasia → re-exploration.</p>

                <h3>Adrenal</h3>
                <ul>
                    <li><b>Pheochromocytoma</b>: episodic HTN (resistant), sweating, palpitations → ↑catecholamines, adrenal mass → <b>alpha-blockade FIRST</b> (never beta-blocker first — risk of hypertensive crisis)</li>
                    <li><b>Addisonian crisis</b>: post-op patient on chronic steroids + hypotension + hyponatremia + <b>hyperkalemia</b> + hypoglycemia</li>
                </ul>
            `,
            questions: [
                {
                    q: 'A 33-year-old with papillary thyroid cancer is planned for total thyroidectomy and has mitral valve prolapse with mild regurgitation. What antibiotic prophylaxis is indicated?',
                    options: ['Amoxicillin to prevent endocarditis', 'Cefazolin to prevent wound infection', 'No indication for antibiotic prophylaxis', 'Both cefazolin and amoxicillin'],
                    answer: 2,
                    explanation: 'Infective-endocarditis prophylaxis is only for certain high-risk cardiac lesions undergoing high-risk procedures; MVP with MR is not an indication, and thyroidectomy is clean surgery.'
                },
                {
                    q: 'A patient develops a tense, expanding neck swelling with pain a few hours after total thyroidectomy. What is the immediate action?',
                    options: ['Urgent CT neck', 'Open the wound at the bedside to evacuate the hematoma', 'Nebulized adrenaline', 'IV calcium gluconate'],
                    answer: 1,
                    explanation: 'A post-thyroidectomy hematoma can rapidly obstruct the airway; open the wound immediately at the bedside before definitive theatre management.'
                },
                {
                    q: 'A patient with a pheochromocytoma is being prepared for adrenalectomy. Which drug class must be started first?',
                    options: ['Alpha-blocker', 'Beta-blocker', 'Calcium channel blocker', 'ACE inhibitor'],
                    answer: 0,
                    explanation: 'Alpha-blockade must precede beta-blockade; starting a beta-blocker first risks unopposed alpha vasoconstriction and a hypertensive crisis.'
                }
            ]
        },
        {
            id: 'surg-gastro',
            title: '08 — Gastro-Esophageal & Gastric Diseases',
            title_en: 'Endoscopy Red Flags · Mallory-Weiss & Boerhaave · Esophageal/Gastric Cancer · PUD',
            summaryHtml: `
                <div class="sum-callout"><b>Endoscopy red flags</b>: new dyspepsia &gt;60 yrs · GI bleeding (hematemesis/melena) · iron-deficiency anemia · anorexia/weight loss · persistent vomiting · 1st-degree relative with GI cancer.</div>

                <h3>Mallory-Weiss vs Boerhaave</h3>
                <ul>
                    <li><b>Mallory-Weiss</b>: hematemesis after forceful vomiting (mucosal tear at GE junction) → EGD (gold standard); active bleed → UGIB treatment; not bleeding → conservative (PPI, antiemetics)</li>
                    <li><b>Boerhaave's</b>: transmural perforation; <b>Mackler triad</b> = vomiting + retrosternal chest pain + subcutaneous/mediastinal emphysema; CXR widened mediastinum/pneumomediastinum → contrast esophagography shows leak → surgical/endoscopic repair</li>
                </ul>

                <h3>Esophageal Cancer</h3>
                <table>
                    <thead><tr><th>Type</th><th>Location</th><th>Risk factors</th></tr></thead>
                    <tbody>
                        <tr><td>Adenocarcinoma</td><td>Lower esophagus</td><td>Barrett's, GERD, male, 50–60</td></tr>
                        <tr><td>Squamous cell</td><td>Upper esophagus</td><td>Achalasia, smoking, alcohol</td></tr>
                    </tbody>
                </table>
                <p>Progressive dysphagia + weight loss → EGD with biopsy → CT chest/abdomen staging. High-grade dysplasia/non-metastatic → resection; locally advanced → neoadjuvant chemo → surgery; metastatic → palliative.</p>

                <h3>Peptic Ulcer Disease &amp; Perforation</h3>
                <ul>
                    <li>PUD: epigastric/back pain, may bleed → EGD (gold standard)</li>
                    <li><b>Perforated viscus</b>: sudden severe pain + rigidity + rebound + absent bowel sounds; erect CXR → <b>free air under the diaphragm</b> → exploratory laparotomy (duodenal → Graham omental patch; antral → partial distal gastrectomy)</li>
                    <li><b>Gastrinoma (Zollinger-Ellison)</b>: diarrhea + PUD refractory to PPI + positive secretin test; ↑fasting serum gastrin</li>
                </ul>
                <p><b>Gastric cancer</b>: weight loss, anemia, palpable epigastric mass, <b>Virchow's node</b> → EGD with biopsy (gold standard) → CT CAP / PET-CT staging.</p>
            `,
            questions: [
                {
                    q: 'A 47-year-old vomits repeatedly after food poisoning and now vomits fresh blood; there is mild epigastric tenderness and the NG tube drains bloody fluid. What is the diagnosis?',
                    options: ['Gastritis', 'Dieulafoy lesion', 'Peptic ulcer disease', 'Mallory-Weiss syndrome'],
                    answer: 3,
                    explanation: 'Forceful vomiting followed by hematemesis indicates a Mallory-Weiss tear at the gastroesophageal junction.'
                },
                {
                    q: 'A 40-year-old woman has heartburn and regurgitation despite PPIs; endoscopy shows reflux esophagitis. What is the next step?',
                    options: ['Manometry study', '24-hour pH monitoring', 'Lifestyle modification', 'Nissen fundoplication'],
                    answer: 1,
                    explanation: 'Failed PPI therapy with esophagitis warrants 24-hour pH monitoring to confirm GERD before considering anti-reflux surgery.'
                },
                {
                    q: 'A man has diarrhea and persistent peptic ulcer disease refractory to PPIs, with a positive secretin stimulation test. What is the diagnosis?',
                    options: ['VIPoma', 'Gastrinoma (Zollinger-Ellison syndrome)', 'Glucagonoma', 'Carcinoid tumor'],
                    answer: 1,
                    explanation: 'Refractory PUD + diarrhea + positive secretin test = gastrinoma; a high fasting serum gastrin confirms it.'
                },
                {
                    q: 'A chronic NSAID user develops sudden severe epigastric pain with a rigid abdomen; an erect chest X-ray shows free air under the diaphragm. What is the diagnosis?',
                    options: ['Acute pancreatitis', 'Perforated peptic ulcer', 'Acute cholecystitis', 'Mesenteric ischemia'],
                    answer: 1,
                    explanation: 'Sudden severe epigastric pain with pneumoperitoneum indicates a perforated peptic ulcer needing resuscitation and laparotomy (Graham omental patch for a duodenal ulcer).'
                }
            ]
        },
        {
            id: 'surg-hepatobiliary',
            title: '09 — Hepato-Biliary & Pancreatic Surgery',
            title_en: 'Cholecystitis · Cholangitis · Liver Lesions · Pancreatitis · Pancreatic Cancer',
            summaryHtml: `
                <h3>Acute Cholecystitis</h3>
                <ul>
                    <li>RUQ pain &gt;4 h (more severe than biliary colic) + fever + nausea + positive Murphy sign; labs: leukocytosis</li>
                    <li>1st-line imaging: US (gallstones, pericholecystic fluid, sonographic Murphy, wall thickening)</li>
                    <li>Initial: NPO, IV fluids, analgesia, IV antibiotics → <b>laparoscopic cholecystectomy within 72 h</b>; high-risk/acalculous → percutaneous cholecystostomy</li>
                </ul>
                <div class="sum-callout"><b>CBD transection post-cholecystectomy</b>: above the cystic duct → hepatico-jejunostomy; below the cystic duct → choledocho-jejunostomy.</div>

                <h3>Ascending Cholangitis</h3>
                <ul>
                    <li><b>Charcot triad</b>: fever + RUQ pain + jaundice · <b>Reynolds pentad</b> adds hypotension + altered mental status</li>
                    <li>Labs: leukocytosis, hyperbilirubinemia, ↑ALP/GGT; US first → <b>ERCP</b> (therapeutic decompression + diagnostic)</li>
                </ul>

                <h3>Liver Lesions</h3>
                <table>
                    <thead><tr><th>Feature</th><th>Hydatid disease</th><th>Amoebic liver abscess</th></tr></thead>
                    <tbody>
                        <tr><td>Organism</td><td>Echinococcus granulosus</td><td>Entamoeba histolytica</td></tr>
                        <tr><td>Initial treatment</td><td>Albendazole</td><td>Metronidazole</td></tr>
                        <tr><td>Definitive</td><td>Surgical deroofing if ≥5 cm/complicated/daughter cysts</td><td>US/CT percutaneous drainage if &gt;5 cm or septations</td></tr>
                    </tbody>
                </table>

                <h3>Acute Pancreatitis</h3>
                <p>Risk factors <b>GET SMASHED</b>: Gallstones, Ethanol, Trauma, Steroids, Mumps, Autoimmune, Scorpion, Hyperlipidemia/Hypothermia, ERCP, Drugs. Diagnosis = 2 of 3: characteristic pain · amylase/lipase ≥3× ULN · CT/US findings.</p>
                <table>
                    <thead><tr><th>Step</th><th>Details</th></tr></thead>
                    <tbody>
                        <tr><td>Imaging</td><td>US (initial); CT if unclear/severe</td></tr>
                        <tr><td>Fluids</td><td>IV Ringer lactate (preferred)</td></tr>
                        <tr><td>Cause</td><td>Biliary → ERCP + cholecystectomy before discharge</td></tr>
                        <tr><td>Antibiotics</td><td>NOT used unless infected source identified</td></tr>
                    </tbody>
                </table>
                <p><b>Grey Turner's sign</b> (flank ecchymosis) → retroperitoneal hemorrhage in necrotizing pancreatitis. <b>Pseudocyst</b>: &gt;6 cm or &gt;6 weeks → endoscopic drainage; infected → percutaneous drainage regardless.</p>
                <div class="sum-callout"><b>Pancreatic cancer — Courvoisier's sign</b>: painless jaundice + palpable non-tender gallbladder → suspect pancreatic head cancer (not stones). Obstructive jaundice: dark urine, pale stool, pruritus.</div>
            `,
            questions: [
                {
                    q: 'After a cholecystectomy, the common bile duct is transected above the cystic duct. What is the appropriate reconstruction?',
                    options: ['Hepatico-jejunostomy', 'Hepatico-duodenostomy', 'Choledocho-jejunostomy', 'Choledocho-duodenostomy'],
                    answer: 0,
                    explanation: 'A proximal CBD injury (above the cystic duct) requires hepatico-jejunostomy; more distal injuries can use choledocho-jejunostomy.'
                },
                {
                    q: 'A 65-year-old has progressive painless jaundice, weight loss and a palpable, non-tender gallbladder (Courvoisier sign). What is the most likely diagnosis?',
                    options: ['Liver cancer', 'Pancreatic (head) cancer', 'Primary choledocholithiasis', 'Secondary choledocholithiasis'],
                    answer: 1,
                    explanation: 'Courvoisier\'s sign (painless jaundice + palpable non-tender gallbladder) suggests malignant obstruction such as pancreatic head cancer, not gallstones.'
                },
                {
                    q: 'A 40-year-old has diffuse abdominal pain with flank ecchymosis (Grey Turner\'s sign). What is the diagnosis?',
                    options: ['Acute porphyria', 'Mesenteric ischemia', 'Necrotizing pancreatitis', 'Ruptured aortic aneurysm'],
                    answer: 2,
                    explanation: 'Grey Turner\'s sign indicates retroperitoneal hemorrhage, classically seen in necrotizing pancreatitis.'
                },
                {
                    q: 'A patient has Charcot\'s triad (fever, RUQ pain, jaundice) with a dilated CBD and a stone. After resuscitation and antibiotics, what is the definitive next step?',
                    options: ['Laparoscopic cholecystectomy now', 'Urgent ERCP for biliary decompression', 'Percutaneous cholecystostomy', 'Observation'],
                    answer: 1,
                    explanation: 'Ascending cholangitis requires biliary decompression by urgent ERCP alongside antibiotics and resuscitation.'
                }
            ]
        },
        {
            id: 'surg-neuro',
            title: '10 — Neurosurgery',
            title_en: 'Epidural vs Subdural · Skull Base Foramina · Glasgow Coma Scale',
            summaryHtml: `
                <h3>Head Injury — Hematomas</h3>
                <table>
                    <thead><tr><th>Feature</th><th>Epidural</th><th>Subdural</th></tr></thead>
                    <tbody>
                        <tr><td>Bleeding source</td><td>Middle meningeal artery</td><td>Bridging veins</td></tr>
                        <tr><td>Shape on CT</td><td>Lens-shaped (biconvex)</td><td>Crescent-shaped</td></tr>
                        <tr><td>Presentation</td><td>Lucid interval then deterioration</td><td>Gradual deterioration</td></tr>
                        <tr><td>Skull fracture</td><td>Temporal fracture common</td><td>Less common</td></tr>
                        <tr><td>Pupil</td><td>Ipsilateral dilated</td><td>Variable</td></tr>
                    </tbody>
                </table>
                <div class="sum-callout"><b>Key pattern</b>: head trauma + lucid interval + deterioration + unilateral dilated pupil + temporal fracture → <b>epidural hematoma</b>.</div>

                <h3>Skull Base Foramina</h3>
                <table>
                    <thead><tr><th>Foramen</th><th>Structures</th><th>Deficit if injured</th></tr></thead>
                    <tbody>
                        <tr><td>Jugular foramen</td><td>CN IX, X, XI; jugular vein</td><td>Ipsilateral vocal cord paralysis</td></tr>
                        <tr><td>Optic canal</td><td>CN II, ophthalmic artery</td><td>Vision loss</td></tr>
                    </tbody>
                </table>

                <h3>Glasgow Coma Scale</h3>
                <ul>
                    <li><b>Eye (E)</b>: 4 spontaneous · 3 to speech · 2 to pain · 1 none</li>
                    <li><b>Verbal (V)</b>: 5 oriented · 4 confused · 3 inappropriate words · 2 incomprehensible · 1 none</li>
                    <li><b>Motor (M)</b>: 6 obeys · 5 localizes · 4 withdraws · 3 flexion (decorticate) · 2 extension (decerebrate) · 1 none</li>
                </ul>
                <p>Example: incomprehensible sounds (V2) + eyes to pain (E2) + flexion to pain (M3) = <b>GCS 7</b>.</p>
            `,
            questions: [
                {
                    q: 'A 31-year-old after a road accident has GCS 15 initially, then a period of unresponsiveness, then loses consciousness with a dilated left pupil; CT shows a temporal fracture. What is the diagnosis?',
                    options: ['Ruptured AVM', 'Subdural hematoma', 'Epidural hematoma', 'Basal skull fracture'],
                    answer: 2,
                    explanation: 'Lucid interval + deterioration + unilateral dilated pupil + temporal fracture = epidural hematoma (middle meningeal artery).'
                },
                {
                    q: 'A patient has a skull base fracture through the jugular foramen. What is the most likely resulting deficit?',
                    options: ['Loss of eye abduction', 'Ipsilateral vocal cord paralysis', 'Sensory loss over the zygoma', 'Paralysis of the muscles of mastication'],
                    answer: 1,
                    explanation: 'The jugular foramen transmits CN IX, X, XI; injury causes ipsilateral vocal cord paralysis (CN X).'
                },
                {
                    q: 'A 28-year-old after a road accident makes incomprehensible sounds, opens eyes to pain and flexes limbs to pain. What is the GCS?',
                    options: ['5', '6', '7', '8'],
                    answer: 2,
                    explanation: 'Eyes to pain (E2) + incomprehensible sounds (V2) + flexion to pain (M3) = GCS 7.'
                }
            ]
        },
        {
            id: 'surg-ortho',
            title: '11 — Orthopedic Surgery',
            title_en: 'Supracondylar/Open Fractures · Compartment Syndrome · Dislocations · Nerve Palsy',
            summaryHtml: `
                <h3>Fractures &amp; Complications</h3>
                <div class="sum-callout"><b>Supracondylar fracture</b>: urgent reduction → pink/warm limb → K-wire fixation; pale/cold/pulseless (ischemic) → surgical exploration.</div>
                <p><b>Open fracture</b>: 1) IV antibiotics; 2) closed reduction; 3) irrigation &amp; debridement (within 24 h); 4) definitive IM nail or external fixation. <b>Compartment syndrome</b> (6 Ps progression, pain first): urgent <b>fasciotomy</b>.</p>
                <table>
                    <thead><tr><th>Femoral fracture — age</th><th>Management</th></tr></thead>
                    <tbody>
                        <tr><td>Adult</td><td>Closed reduction + IM nail</td></tr>
                        <tr><td>&lt;6 months</td><td>Pavlik harness</td></tr>
                        <tr><td>6 months – 5 years</td><td>Hip spica</td></tr>
                        <tr><td>&gt;5 years</td><td>IM nail</td></tr>
                    </tbody>
                </table>

                <h3>Dislocations</h3>
                <ul>
                    <li><b>Shoulder anterior</b> (abduction + external rotation): most common</li>
                    <li><b>Shoulder posterior</b>: epileptic/electrocution (adduction + internal rotation)</li>
                    <li><b>Hip</b>: posterior (adduction + internal rotation)</li>
                </ul>

                <h3>Nerve Palsy</h3>
                <table>
                    <thead><tr><th>Nerve</th><th>Deformity</th><th>Site</th></tr></thead>
                    <tbody>
                        <tr><td>Common peroneal</td><td>Foot drop</td><td>Fibular neck</td></tr>
                        <tr><td>Median</td><td>Ape hand</td><td>Carpal tunnel</td></tr>
                        <tr><td>Radial</td><td>Wrist drop</td><td>Spiral groove of humerus</td></tr>
                        <tr><td>Ulnar</td><td>Claw hand</td><td>Medial arm</td></tr>
                        <tr><td>Axillary</td><td>Loss of abduction</td><td>Surgical neck of humerus</td></tr>
                    </tbody>
                </table>
                <p><b>Carpal tunnel</b> (median): thumb/index/middle numbness worse at night, +Tinel/Phalen. <b>Thoracic outlet</b> (ulnar): little/ring fingers, worse with arms raised, +elevated-arm stress test.</p>
            `,
            questions: [
                {
                    q: 'A 13-year-old boy has a knee flexion contracture and recurrent hemarthrosis. What is the most likely underlying disorder?',
                    options: ['Hemophilia', 'Aplastic anemia', 'Wilson disease', 'Henoch-Schönlein purpura'],
                    answer: 0,
                    explanation: 'Hemophilia (X-linked recessive, affects males) classically causes hemarthrosis and joint contractures.'
                },
                {
                    q: 'A 26-year-old footballer is hit on the lateral side of the left knee, which buckles; there is medial-sided swelling and laxity on valgus stress, with negative Lachman and McMurray tests. What is the injury?',
                    options: ['Lateral meniscus tear', 'Medial meniscus tear', 'Lateral collateral ligament sprain', 'Medial collateral ligament sprain'],
                    answer: 3,
                    explanation: 'Valgus stress tests the MCL; a lateral blow causes medial-sided (MCL) injury. Negative Lachman (ACL) and McMurray (meniscus) exclude those.'
                },
                {
                    q: 'A 23-year-old sustains a hyperextension injury to a finger and cannot flex the distal phalanx; there is tenderness on the volar aspect. What is the injury?',
                    options: ['Rupture of flexor digitorum profundus tendon', 'Rupture of flexor digitorum superficialis tendon', 'Extra-articular fracture of the distal phalanx', 'Intra-articular fracture of the middle phalanx'],
                    answer: 0,
                    explanation: 'Inability to flex the distal phalanx (jersey finger) indicates FDP rupture, since the FDP inserts on the distal phalanx.'
                },
                {
                    q: 'A patient with a tibial fracture has pain on passive stretch out of proportion to the injury with a tense, swollen calf. What is the most appropriate action?',
                    options: ['Elevate and reassess in 4 hours', 'Urgent fasciotomy', 'Apply a tighter cast', 'Wait until pulses disappear'],
                    answer: 1,
                    explanation: 'Pain on passive stretch and out of proportion are early signs of compartment syndrome; perform fasciotomy without waiting for pulselessness (a late sign).'
                }
            ]
        },
        {
            id: 'surg-pediatric',
            title: '12 — Pediatric Surgery',
            title_en: 'Pediatric Hernias · Pyloric Stenosis · Wilms · Undescended Testis',
            summaryHtml: `
                <table>
                    <thead><tr><th>Type</th><th>Features</th><th>Management</th></tr></thead>
                    <tbody>
                        <tr><td>Inguinal hernia</td><td>Groin swelling extending to scrotum, prominent with crying/coughing</td><td>Herniotomy</td></tr>
                        <tr><td>Umbilical hernia</td><td>Umbilical mass covered by skin, reduces supine</td><td>Conservative (90% close by age 2); surgery if no closure at 4–5 yrs or &gt;2 cm</td></tr>
                    </tbody>
                </table>
                <table>
                    <thead><tr><th>Condition</th><th>Key features</th><th>Management</th></tr></thead>
                    <tbody>
                        <tr><td>Pyloric stenosis</td><td>Non-bilious vomiting, olive-shaped epigastric mass, dehydration</td><td>Pyloromyotomy (Ramstedt)</td></tr>
                        <tr><td>Wilms tumor</td><td>Large abdominal mass from the kidney, lung mets common</td><td>Nephrectomy + chemo/radiation</td></tr>
                        <tr><td>Phimosis</td><td>Foreskin ballooning on voiding, white scarred ring, cannot retract</td><td>Circumcision / topical steroids</td></tr>
                        <tr><td>Congenital lobar emphysema</td><td>Newborn respiratory distress, hyperlucent lobe, mediastinal shift</td><td>Thoracotomy + lobectomy</td></tr>
                    </tbody>
                </table>
                <div class="sum-callout"><b>Undescended testis</b>: palpable testis outside the scrotum → orchidopexy; non-palpable testis → diagnostic laparoscopy.</div>
            `,
            questions: [
                {
                    q: 'A 5-month-old has non-bilious projectile vomiting, dehydration and an olive-shaped epigastric mass. What is the management?',
                    options: ['Ramstedt pyloromyotomy', 'Balloon dilatation', 'Gastrojejunostomy', 'Conservative observation'],
                    answer: 0,
                    explanation: 'Non-bilious vomiting + olive-shaped mass = hypertrophic pyloric stenosis, treated with Ramstedt pyloromyotomy after correcting fluids/electrolytes.'
                },
                {
                    q: 'A 1-year-old has a reducible umbilical hernia covered by skin that prominences with crying. What is the appropriate management?',
                    options: ['Conservative observation', 'Urgent herniotomy', 'Truss application', 'Immediate mesh repair'],
                    answer: 0,
                    explanation: 'Most umbilical hernias close spontaneously by age 2; surgery is reserved for no closure by 4–5 years or a defect >2 cm.'
                }
            ]
        },
        {
            id: 'surg-plastic',
            title: '13 — Plastic Surgery & Skin',
            title_en: 'Burns & Inhalation Injury · Skin Tumors · Skin Infections · Wound Closure',
            summaryHtml: `
                <h3>Burns &amp; Inhalational Injury</h3>
                <p><b>Intubation indications</b>: facial burn · airway swelling/edema · respiratory failure · soot/carbonaceous material in airway · extensive burns · GCS &lt;8.</p>
                <div class="sum-callout"><b>Parkland formula</b> = 4 mL × weight (kg) × %TBSA. Half in the first 8 hours, half over the next 16. Example: 70 kg, both lower limbs (~36%) = 4 × 70 × 36 = 10,080 mL → ~5 L in 8 h + ~5 L over 16 h.</div>

                <h3>Skin Tumors</h3>
                <table>
                    <thead><tr><th>Tumor</th><th>Key features</th><th>Diagnosis</th></tr></thead>
                    <tbody>
                        <tr><td>Melanoma</td><td>ABCDE: Asymmetry, Border, Color, Diameter &gt;6 mm, Evolving</td><td>Full-thickness excisional biopsy</td></tr>
                        <tr><td>Basal cell carcinoma</td><td>Face, pearly papule with telangiectasia</td><td>Biopsy</td></tr>
                        <tr><td>Squamous cell carcinoma</td><td>Chronic lesions; pseudoepitheliomatous hyperplasia mimics</td><td>Repeat biopsy if suspicious</td></tr>
                        <tr><td>Liposarcoma</td><td>Very large (&gt;10 cm), lobulated; limbs &amp; retroperitoneum</td><td>Core needle biopsy</td></tr>
                    </tbody>
                </table>
                <p><b>Biopsy rules</b>: excisional if &lt;2 cm and closeable; incisional if too large; exception — &lt;2 cm on body or &lt;1 cm on head → excise regardless.</p>

                <h3>Skin Infections &amp; Wound Closure</h3>
                <table>
                    <thead><tr><th>Condition</th><th>Feature</th></tr></thead>
                    <tbody>
                        <tr><td>Cellulitis</td><td>Staph aureus / Strep pyogenes — progressive redness + fever</td></tr>
                        <tr><td>Furuncle</td><td>Single infected hair follicle</td></tr>
                        <tr><td>Carbuncle</td><td>Multiple infected follicles, multiple discharging sinuses (neck)</td></tr>
                        <tr><td>Hidradenitis suppurativa</td><td>Chronic apocrine infection — groin, axillae, gluteal cleft</td></tr>
                    </tbody>
                </table>
                <p>Non-healing wound (diabetic foot, bed sores) → VAC (negative-pressure wound therapy). Exposed necrotic skin → debridement + secondary closure/grafting.</p>
            `,
            questions: [
                {
                    q: 'An 18-year-old has second-degree burns to both lower limbs and weighs 70 kg. Using the Parkland formula, what fluid regimen is correct?',
                    options: ['LR 200 mL/hr for 24 hours', 'NS 1 L bolus then 120 mL/hr', 'LR 5 L over the first 8 hrs then 5 L over the next 16 hrs', 'LR 2.5 L over the first 8 hrs then 2.5 L over the next 16 hrs'],
                    answer: 2,
                    explanation: 'Both lower limbs ≈ 36% TBSA. Parkland = 4 × 70 × 36 = 10,080 mL; half (~5 L) in the first 8 hours and half over the next 16.'
                },
                {
                    q: 'A 50-year-old diabetic has a progressively painful 5×6 cm swelling on the back of the neck with redness and multiple discharging openings. What is the diagnosis?',
                    options: ['Abscess', 'Cellulitis', 'Furuncle', 'Carbuncle'],
                    answer: 3,
                    explanation: 'Multiple discharging openings indicate a carbuncle (multiple interconnected furuncles), common on the neck in diabetics.'
                },
                {
                    q: 'A pigmented skin lesion shows asymmetry, irregular borders, color variation and a diameter >6 mm with recent change. What is the appropriate diagnostic biopsy?',
                    options: ['Full-thickness excisional biopsy', 'Shave biopsy', 'Fine-needle aspiration', 'Punch biopsy of the center only'],
                    answer: 0,
                    explanation: 'Suspected melanoma (ABCDE) is diagnosed with a full-thickness excisional biopsy to allow accurate Breslow depth measurement.'
                }
            ]
        },
        {
            id: 'surg-periop',
            title: '14 — Pre/Post-Operative Care',
            title_en: 'PE & VTE · HIT · Post-Op Infections · Surgical Emphysema · Transfusion',
            summaryHtml: `
                <h3>Pulmonary Embolism &amp; VTE</h3>
                <div class="sum-callout"><b>PE management</b>: hemodynamically stable → LMWH (enoxaparin); high bleeding risk but anticoagulation needed → mechanical prophylaxis; DVT/PE + anticoagulation contraindicated → IVC filter.</div>
                <p><b>Heparin-induced thrombocytopenia (HIT)</b>: 1) stop heparin; 2) start lepirudin, fondaparinux, or a DOAC.</p>

                <h3>Post-Operative Infections</h3>
                <table>
                    <thead><tr><th>Type</th><th>Management</th></tr></thead>
                    <tbody>
                        <tr><td>SSI</td><td>Open wound → CT for deep infection → percutaneous drainage</td></tr>
                        <tr><td>Wound abscess</td><td>Incision &amp; drainage</td></tr>
                        <tr><td>Seroma (after hernia repair)</td><td>Exploration, irrigation, leave open, regular dressing</td></tr>
                        <tr><td>Intra-abdominal collection (small)</td><td>Antibiotics</td></tr>
                        <tr><td>Intra-abdominal collection (≥4×4)</td><td>Percutaneous drainage</td></tr>
                        <tr><td>Multiple collections</td><td>Laparoscopy</td></tr>
                        <tr><td>Unstable patient</td><td>Laparotomy</td></tr>
                    </tbody>
                </table>

                <h3>High-Yield Post-Op Pitfalls</h3>
                <ul>
                    <li><b>Surgical emphysema after ERCP</b>: duodenal perforation → retroperitoneal air tracking to chest/neck</li>
                    <li><b>Subphrenic abscess</b>: post-op RUQ/LUQ pain worse on inspiration, hiccups, fever; common after splenectomy</li>
                    <li><b>Massive transfusion</b>: bleeding from incision/NGT/venipuncture sites → dilutional thrombocytopenia (stored blood lacks functional platelets)</li>
                </ul>
            `,
            questions: [
                {
                    q: 'A 46-year-old develops extensive surgical emphysema of the abdomen, chest and neck after ERCP. What is the most likely injury?',
                    options: ['Gastric perforation', 'Tracheal injury', 'Duodenal perforation', 'Esophageal perforation'],
                    answer: 2,
                    explanation: 'ERCP instruments the duodenum and biliary tree; duodenal perforation causes retroperitoneal air that tracks to the chest and neck.'
                },
                {
                    q: 'A 42-year-old after splenectomy has left-sided chest/abdominal pain worse on inspiration, decreased air entry, dullness and a fever of 38.6 °C. What is the diagnosis?',
                    options: ['Gastric stasis', 'Subphrenic abscess', 'Lower-lobe pneumonia', 'Overwhelming post-splenectomy infection'],
                    answer: 1,
                    explanation: 'Post-splenectomy LUQ pain worse on inspiration with fever (and often hiccups) is a classic subphrenic abscess.'
                },
                {
                    q: 'A hemodynamically stable patient is diagnosed with an acute pulmonary embolism and has no contraindication to anticoagulation. What is the appropriate treatment?',
                    options: ['Low-molecular-weight heparin (enoxaparin)', 'IVC filter', 'Mechanical prophylaxis only', 'Immediate surgical embolectomy'],
                    answer: 0,
                    explanation: 'A stable PE without bleeding risk is treated with therapeutic anticoagulation (LMWH); IVC filters are for when anticoagulation is contraindicated.'
                }
            ]
        },
        {
            id: 'surg-shock',
            title: '15 — Shock',
            title_en: 'Types of Shock · Cardiac Tamponade · SvO2 · Sepsis Definitions',
            summaryHtml: `
                <h3>Types of Shock</h3>
                <table>
                    <thead><tr><th>Type</th><th>Mechanism</th><th>Key features</th></tr></thead>
                    <tbody>
                        <tr><td>Hypovolemic</td><td>Decreased volume</td><td>Low output, cold/clammy, tachycardia</td></tr>
                        <tr><td>Septic (distributive)</td><td>Vasodilation (low resistance)</td><td>Warm extremities, hypotension with reflex tachycardia, high output</td></tr>
                        <tr><td>Neurogenic (distributive)</td><td>Vasodilation</td><td>Warm extremities, hypotension <b>without</b> reflex tachycardia, focal neuro deficit, post-spinal trauma</td></tr>
                        <tr><td>Cardiogenic</td><td>Pump failure</td><td>Low output, cold/clammy, pulmonary edema</td></tr>
                        <tr><td>Obstructive</td><td>Obstruction to flow</td><td>Tamponade, tension pneumothorax, PE</td></tr>
                    </tbody>
                </table>
                <div class="sum-callout"><b>Cardiac tamponade — Beck's triad</b>: hypotension + muffled heart sounds + distended JVP. Unstable → pericardiocentesis; stable → treat the cause.</div>
                <p><b>SvO2</b>: low → tissues extracting more O2 (inadequate perfusion); high → normal perfusion OR impaired extraction (severe sepsis). Blood loss &gt;25% → decreased urine output and pulse pressure.</p>

                <h3>Sepsis Definitions</h3>
                <table>
                    <thead><tr><th>Term</th><th>Definition</th></tr></thead>
                    <tbody>
                        <tr><td>SIRS</td><td>Systemic inflammatory response (fever, tachycardia, tachypnea, leukocytosis/leukopenia)</td></tr>
                        <tr><td>Sepsis</td><td>SIRS + suspected source of infection</td></tr>
                        <tr><td>Severe sepsis</td><td>Sepsis + organ dysfunction</td></tr>
                        <tr><td>Septic shock</td><td>Sepsis + hypotension despite fluid resuscitation</td></tr>
                    </tbody>
                </table>
            `,
            questions: [
                {
                    q: 'A 45-year-old after CBD exploration has chills and rigors; BP 110/70, HR 80, RR 18, Temp 38 °C, WBC 9. What best describes this state?',
                    options: ['Sepsis', 'Bacteremia', 'Severe sepsis', 'SIRS'],
                    answer: 3,
                    explanation: 'Meeting SIRS criteria (e.g. temperature + mild HR change) without a confirmed source or organ dysfunction is SIRS, not sepsis.'
                },
                {
                    q: 'A trauma patient has hypotension and warm extremities WITHOUT reflex tachycardia, plus a focal neurological deficit after spinal injury. What type of shock is this?',
                    options: ['Hypovolemic', 'Neurogenic (distributive)', 'Cardiogenic', 'Obstructive'],
                    answer: 1,
                    explanation: 'Neurogenic shock from spinal injury causes vasodilation with warm skin and hypotension but no compensatory tachycardia (loss of sympathetic tone).'
                },
                {
                    q: 'A hypotensive patient has muffled heart sounds and distended neck veins (Beck\'s triad) and is hemodynamically unstable. What is the immediate management?',
                    options: ['Pericardiocentesis', 'Needle decompression', 'IV fluids only and observe', 'Urgent CT chest'],
                    answer: 0,
                    explanation: 'Beck\'s triad indicates cardiac tamponade (obstructive shock); an unstable patient needs immediate pericardiocentesis.'
                }
            ]
        },
        {
            id: 'surg-trauma',
            title: '16 — Trauma',
            title_en: 'Primary Survey (ABC) · Neck Zones · Chest Trauma · Abdominal Trauma & FAST',
            summaryHtml: `
                <h3>Primary Survey — ABC</h3>
                <ul>
                    <li><b>A</b> Airway: SpO2 &lt;88%, GCS ≤8, unconscious, aspiration risk → intubate; + facial injury (mandibular fracture) → cricothyroidotomy</li>
                    <li><b>B</b> Breathing: tension pneumothorax → needle decompression then chest tube</li>
                    <li><b>C</b> Circulation: IV fluids, control bleeding (direct pressure/pelvic binder)</li>
                    <li><b>D</b> Disability: no deficits → CT to clear spine</li>
                </ul>

                <h3>Neck Trauma — Zones</h3>
                <table>
                    <thead><tr><th>Zone</th><th>Boundaries</th><th>Management</th></tr></thead>
                    <tbody>
                        <tr><td>I</td><td>Below cricoid</td><td>CT-angio; vascular → endovascular; aerodigestive → open repair</td></tr>
                        <tr><td>II</td><td>Cricoid to angle of mandible</td><td>Symptomatic (bleeding) → open repair (most dangerous); asymptomatic → observe</td></tr>
                        <tr><td>III</td><td>Above angle of mandible</td><td>Symptomatic → CT-angio → endovascular repair</td></tr>
                    </tbody>
                </table>
                <p>Unstable (any zone): expanding hematoma / uncontrolled hemorrhage → artery ligation.</p>

                <h3>Chest Trauma</h3>
                <ul>
                    <li><b>Tension pneumothorax</b>: hyperresonance, decreased breath sounds, tracheal shift away, raised JVP, hypotension → needle decompression → chest tube</li>
                    <li><b>Flail chest</b>: multiple rib fractures + paradoxical breathing → supportive (analgesia, ventilation)</li>
                    <li><b>Emergency thoracotomy</b>: initial chest tube &gt;1500 mL · 200–300 mL/hr for 4 h · decompensation after stabilization</li>
                </ul>

                <h3>Abdominal Trauma</h3>
                <div class="sum-callout">Stable → CT abdomen. Unstable: stab wound → laparotomy; blunt → FAST.</div>
                <table>
                    <thead><tr><th>Status</th><th>FAST</th><th>Action</th></tr></thead>
                    <tbody>
                        <tr><td>Stable</td><td>Positive</td><td>CT</td></tr>
                        <tr><td>Stable</td><td>Negative</td><td>Routine examination</td></tr>
                        <tr><td>Unstable</td><td>Positive</td><td>Laparotomy</td></tr>
                        <tr><td>Unstable</td><td>Negative</td><td>Diagnostic peritoneal lavage (DPL)</td></tr>
                    </tbody>
                </table>
                <p><b>Solid organ injury</b>: stable → conservative; unstable hepatic → packing → resection/angioembolization; unstable splenic → splenectomy. <b>Seat-belt sign</b>: lower abdominal wall ecchymosis → bladder/bowel (often duodenal) injury + Chance (lumbar) fracture.</p>
            `,
            questions: [
                {
                    q: 'A 36-year-old has a knife stab to the left neck below the cricoid (Zone I) with diffuse subcutaneous emphysema but is hemodynamically stable. What is the next step?',
                    options: ['Neck exploration', 'Close observation', 'CT of the neck and chest', 'Interventional-radiology embolization'],
                    answer: 2,
                    explanation: 'A stable Zone I injury with an aerodigestive sign (SC emphysema) is worked up with CT of the neck and chest to define the anatomy before any intervention.'
                },
                {
                    q: 'A hypotensive patient after blunt abdominal trauma remains unstable; FAST shows free intraperitoneal fluid. What is the next step?',
                    options: ['CT abdomen with contrast', 'Exploratory laparotomy', 'Diagnostic peritoneal lavage', 'Observation and repeat FAST'],
                    answer: 1,
                    explanation: 'An unstable patient with a positive FAST needs emergency laparotomy; CT is only for stable patients.'
                },
                {
                    q: 'A trauma patient has absent breath sounds and hyperresonance on the right, tracheal deviation to the left, distended neck veins and hypotension. What is the immediate management?',
                    options: ['Urgent chest X-ray', 'Needle decompression then chest tube', 'Pericardiocentesis', 'CT chest'],
                    answer: 1,
                    explanation: 'Tension pneumothorax is a clinical diagnosis treated immediately with needle decompression followed by a chest tube.'
                }
            ]
        },
        {
            id: 'surg-gib',
            title: '17 — Upper & Lower GI Bleeding',
            title_en: 'UGIB & LGIB Causes & Management · Hemobilia · Fundal Varices',
            summaryHtml: `
                <h3>Upper vs Lower GI Bleeding</h3>
                <table>
                    <thead><tr><th>Feature</th><th>Upper GI bleed (proximal to ligament of Treitz)</th><th>Lower GI bleed (distal to ligament of Treitz)</th></tr></thead>
                    <tbody>
                        <tr><td>Presentation</td><td>Hematemesis, "coffee-ground" vomit, melena</td><td>Hematochezia (bright red blood per rectum)</td></tr>
                        <tr><td>Most common cause</td><td>Peptic ulcer disease</td><td>Diverticulosis (adults); angiodysplasia in elderly</td></tr>
                        <tr><td>Blood test clue</td><td>↑ BUN:creatinine ratio (&gt;20–30:1)</td><td>Usually normal BUN:creatinine</td></tr>
                        <tr><td>First-line scope</td><td>EGD within 24 h</td><td>Colonoscopy (after resuscitation ± prep)</td></tr>
                    </tbody>
                </table>

                <h3>Upper GI Bleeding</h3>
                <ul>
                    <li>Causes: peptic ulcer disease (most common), varices (portal hypertension), Mallory-Weiss tear, malignancy, <b>Dieulafoy lesion</b> (large tortuous submucosal artery → sudden massive painless bleed)</li>
                </ul>
                <div class="sum-callout">
                    <b>Management</b>
                    <ol>
                        <li>Resuscitation (2 large-bore IVs, IV fluids, transfuse if needed) — stabilize first</li>
                        <li>EGD within 24 hours (diagnostic + therapeutic)</li>
                        <li>PUD → PPI infusion + endoscopic therapy; varices → band ligation (esophageal) / sclerotherapy (fundal), octreotide + prophylactic antibiotics</li>
                    </ol>
                </div>

                <h3>Lower GI Bleeding</h3>
                <ul>
                    <li>Causes: <b>diverticulosis</b> (most common, painless brisk bleed), angiodysplasia, colorectal cancer/polyps, ischemic/infectious colitis, IBD, hemorrhoids (anorectal)</li>
                    <li>Most LGIB stops spontaneously; exclude an anorectal source and a brisk upper source (NG lavage/EGD) when bleeding is massive</li>
                </ul>
                <div class="sum-callout">
                    <b>Management</b>
                    <ol>
                        <li>Resuscitate and correct coagulopathy</li>
                        <li>Hemodynamically stable → colonoscopy (diagnostic + therapeutic)</li>
                        <li>Brisk/ongoing bleeding, unstable → CT angiography or tagged-RBC scan → angio-embolization; surgery if uncontrolled</li>
                    </ol>
                </div>

                <h3>Special Scenarios</h3>
                <ul>
                    <li><b>Hemobilia</b>: post-PTC/ERCP/liver trauma + upper GI bleeding (bleeding from the biliary tract into the duodenum); classic triad = RUQ pain + jaundice + GI bleeding; suspect in post-hepatic-intervention patients with melena/hematemesis</li>
                    <li><b>Isolated fundal varices + splenic vein thrombosis</b>: normal portal vein + splenomegaly + thrombosed splenic vein + isolated fundal varices → <b>splenectomy</b> (not shunt surgery)</li>
                </ul>
            `,
            questions: [
                {
                    q: 'A 73-year-old develops upper GI bleeding 24 hours after percutaneous transhepatic cholangiography for obstructive jaundice. What is the most appropriate next step?',
                    options: ['CT scan', 'Endoscopy', 'Ultrasound', 'Angiography'],
                    answer: 1,
                    explanation: 'Post-hepatic intervention + UGIB suggests hemobilia; endoscopy confirms the source and may allow therapeutic intervention.'
                },
                {
                    q: 'A patient has isolated gastric fundal varices with splenomegaly, a thrombosed splenic vein and a normal portal vein. What is the definitive treatment?',
                    options: ['Splenectomy', 'TIPS (portosystemic shunt)', 'Beta-blocker only', 'Liver transplantation'],
                    answer: 0,
                    explanation: 'Isolated fundal varices from splenic vein thrombosis (left-sided/sinistral portal hypertension) are cured by splenectomy, not a portosystemic shunt.'
                },
                {
                    q: 'A hemodynamically stable 68-year-old passes a large volume of bright red blood per rectum. The bleeding has slowed. After resuscitation, what is the best diagnostic and potentially therapeutic step?',
                    options: ['Colonoscopy', 'Immediate exploratory laparotomy', 'Barium enema', 'Repeat CBC and observe only'],
                    answer: 0,
                    explanation: 'In a stable patient with lower GI bleeding (most commonly diverticular), colonoscopy is both diagnostic and therapeutic. CT angiography or a tagged-RBC scan is reserved for brisk, ongoing bleeding in an unstable patient; surgery is a last resort.'
                }
            ]
        },
        {
            id: 'surg-urology',
            title: '18 — Urology',
            title_en: 'Testicular Torsion · Renal Stones · Urethral Injury · BPH & Prostate Cancer',
            summaryHtml: `
                <h3>Testicular Conditions</h3>
                <table>
                    <thead><tr><th>Condition</th><th>Features</th><th>Management</th></tr></thead>
                    <tbody>
                        <tr><td>Testicular torsion</td><td>Severe pain, horizontal high-riding testis, absent cremasteric reflex; Doppler absent flow</td><td>Surgical exploration (no imaging delay if suspected)</td></tr>
                        <tr><td>Appendage torsion</td><td>Pain &lt;1 day at upper pole, blue-dot sign</td><td>Conservative (NSAID)</td></tr>
                        <tr><td>Epididymo-orchitis</td><td>Pain &lt;1 day, edematous testis; Doppler ↑vascularity</td><td>Antibiotics + NSAID</td></tr>
                    </tbody>
                </table>

                <h3>Renal Stones &amp; Urethral Injury</h3>
                <ul>
                    <li><b>Renal colic</b>: severe unilateral colicky flank pain + hematuria + unable to sit still → <b>CT abdomen/pelvis WITHOUT contrast</b> (first-line)</li>
                    <li><b>Uric acid stones</b>: radiolucent on X-ray, acoustic shadowing on US (tumors/clots/sloughed papilla do NOT shadow)</li>
                    <li><b>Urethral injury</b>: membranous urethra most susceptible; blood at meatus → retrograde urethrogram → <b>suprapubic catheter</b> (Foley contraindicated)</li>
                </ul>

                <h3>BPH &amp; Prostate Cancer</h3>
                <div class="sum-callout">
                    <b>BPH algorithm</b>: LUTS (retention, hematuria) → diagnosis by US; acute retention → Foley + urine culture; medical → alpha-blocker (initial); definitive → TURP.
                </div>
                <p><b>Prostate cancer</b>: LUTS + constitutional + metastatic symptoms; most common metastasis site is the <b>spine</b> (back pain + urinary symptoms in an elderly man). <b>Overflow incontinence</b>: bladder fills beyond capacity and leaks small amounts (secondary to obstruction as in BPH).</p>
            `,
            questions: [
                {
                    q: 'A 70-year-old man has urinary incontinence with a distended bladder after voiding and hesitancy. What type of incontinence is this?',
                    options: ['Urge', 'Stress', 'Reflex', 'Overflow'],
                    answer: 3,
                    explanation: 'Overflow incontinence occurs when the bladder fills beyond capacity and leaks, secondary to urethral obstruction (e.g. BPH in an elderly man).'
                },
                {
                    q: 'A 15-year-old has sudden severe testicular pain with a high-riding, horizontal testis and an absent cremasteric reflex. What is the most appropriate management?',
                    options: ['Doppler ultrasound first, then decide', 'Immediate surgical exploration', 'Antibiotics and scrotal support', 'Urinalysis and observation'],
                    answer: 1,
                    explanation: 'Suspected testicular torsion warrants immediate surgical exploration; imaging delays salvage, which falls sharply after 6 hours.'
                },
                {
                    q: 'A man with a pelvic fracture has blood at the urethral meatus. What is the appropriate management of the urinary tract?',
                    options: ['Insert a urethral (Foley) catheter', 'Retrograde urethrogram then a suprapubic catheter', 'Forced diuresis', 'Immediate cystoscopy with stenting'],
                    answer: 1,
                    explanation: 'Signs of urethral injury contraindicate a urethral catheter; a retrograde urethrogram confirms the injury and a suprapubic catheter provides drainage.'
                }
            ]
        }
    ]
};

export default surgery;
