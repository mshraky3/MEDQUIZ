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
                <figure class="deck-fig"><div class="deck-fig-title"><span class="deck-tag tag-fig">Diagram</span> The anal canal clock — who sits where</div>
                <svg viewBox="0 0 700 250" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Internal haemorrhoids sit at the 3, 7 and 11 o'clock positions of the anal canal and cause painless bright red bleeding after defecation. An anal fissure sits in the anterior or posterior midline, 12 and 6 o'clock, and causes sharp severe pain during defecation. An external haemorrhoid is a tender purplish mass with severe perianal pain.">
                <g font-family="system-ui,Arial">
                <circle cx="180" cy="124" r="80" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/><circle cx="180" cy="124" r="34" fill="#f1f5f9" stroke="#e2e8f0"/>
                <circle cx="180" cy="44" r="13" fill="#ef4444"/><text x="180" y="49" text-anchor="middle" font-size="11" font-weight="800" fill="#fff">12</text>
                <circle cx="220" cy="55" r="13" fill="#e2e8f0"/><text x="220" y="59" text-anchor="middle" font-size="11" fill="#94a3b8">1</text>
                <circle cx="249" cy="84" r="13" fill="#e2e8f0"/><text x="249" y="88" text-anchor="middle" font-size="11" fill="#94a3b8">2</text>
                <circle cx="260" cy="124" r="13" fill="#3b82f6"/><text x="260" y="128" text-anchor="middle" font-size="11" font-weight="800" fill="#fff">3</text>
                <circle cx="249" cy="164" r="13" fill="#e2e8f0"/><text x="249" y="168" text-anchor="middle" font-size="11" fill="#94a3b8">4</text>
                <circle cx="220" cy="193" r="13" fill="#e2e8f0"/><text x="220" y="197" text-anchor="middle" font-size="11" fill="#94a3b8">5</text>
                <circle cx="180" cy="204" r="13" fill="#ef4444"/><text x="180" y="208" text-anchor="middle" font-size="11" font-weight="800" fill="#fff">6</text>
                <circle cx="140" cy="193" r="13" fill="#3b82f6"/><text x="140" y="197" text-anchor="middle" font-size="11" font-weight="800" fill="#fff">7</text>
                <circle cx="111" cy="164" r="13" fill="#e2e8f0"/><text x="111" y="168" text-anchor="middle" font-size="11" fill="#94a3b8">8</text>
                <circle cx="100" cy="124" r="13" fill="#e2e8f0"/><text x="100" y="128" text-anchor="middle" font-size="11" fill="#94a3b8">9</text>
                <circle cx="111" cy="84" r="13" fill="#e2e8f0"/><text x="111" y="88" text-anchor="middle" font-size="11" fill="#94a3b8">10</text>
                <circle cx="140" cy="55" r="13" fill="#3b82f6"/><text x="140" y="59" text-anchor="middle" font-size="11" font-weight="800" fill="#fff">11</text>
                <text x="180" y="236" text-anchor="middle" font-size="10.5" font-weight="700" fill="#64748b">anal canal — clock positions</text>
                <rect x="330" y="24" width="354" height="62" rx="9" fill="#eff6ff" stroke="#3b82f6"/><circle cx="352" cy="46" r="8" fill="#3b82f6"/><text x="368" y="50" font-size="12.5" font-weight="800" fill="#1d4ed8">Internal haemorrhoids — 3, 7, 11</text><text x="346" y="72" font-size="10.5" fill="#334155">painless bright-red bleeding after defecation</text>
                <rect x="330" y="96" width="354" height="62" rx="9" fill="#fef2f2" stroke="#ef4444"/><circle cx="352" cy="118" r="8" fill="#ef4444"/><text x="368" y="122" font-size="12.5" font-weight="800" fill="#b91c1c">Anal fissure — midline, 12 &amp; 6</text><text x="346" y="144" font-size="10.5" fill="#334155">sharp severe pain during defecation + bright-red blood</text>
                <rect x="330" y="168" width="354" height="62" rx="9" fill="#f8fafc" stroke="#94a3b8"/><circle cx="352" cy="190" r="8" fill="#94a3b8"/><text x="368" y="194" font-size="12.5" font-weight="800" fill="#475569">External haemorrhoid — no clock position</text><text x="346" y="216" font-size="10.5" fill="#334155">severe perianal PAIN + tender purplish mass</text>
                </g></svg>
                <figcaption>Pain is the divider: <b>painless bleeding = internal haemorrhoid</b> (3, 7, 11 o'clock); <b>severe pain on defecation = fissure</b> in the anterior or posterior midline.</figcaption></figure>
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

                
                <div class="topic-deck">
<h4 class="deck-topic">Hemorrhoids</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Internal hemorrhoids: Painless bright red bleeding after defecation 🔑</li><li>Perianal mass at 3,7,11 O'clock, pruritus</li><li>Perianal discharge</li><li>External hemorrhoids: severe perianal pain and a tender purplish mucosal mass</li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>History, physical examination (DRE), Anoscopy +- proctoscopy (inconclusive Diagnosis on examination)</li><li>Colonoscopy Age &gt;45, Risk factors or red flags of colon cancer</li><li>Grade IV internal hemorrhoid Open hemorrhoidectomy</li><li>Post-op complications: Pain, Urine retention , fecal impaction, bleeding</li><li>External hemorrhoids: Surgical excision (Pain &lt; 3-4 days) Medical treatment (Late presentation)</li></ul></div></div>
                </div>
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

                
                <div class="topic-deck">
<h4 class="deck-topic">Anal fissure</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Sharp, severe pain during defecation</li><li>Bright red blood in stool</li><li>Perianal pruritus</li><li>Chronic constipation</li><li>Common in anterior or posterior midline 6 or 12 o'clock</li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>Clinical diagnosis</li><li>Life style treatment of constipation</li><li>Acute fissure &lt;6weeks Pharmacological treatment: Topical CCB (Diltiazem)</li><li>Chronic fissure &gt; 6weeks lateral internal sphincterotomy</li></ul></div></div>
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
            
                <section class="topic deck-enrich">
                    <h3>More from the study deck</h3>
                    <p class="deck-intro">Extra material for this step that spans more than one topic above.</p>
<h4 class="deck-topic">Anal diseases</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Anal abscess Painful, tender swelling / mass associated with fever, leukocytosis</li><li>Anal hematoma Painful swelling, vitally stable, no leukocytosis</li><li>low-lying simple fistula Anal swelling &amp; discharge may rupture fistulotomy</li><li>complex fistula (Recurrent, multiple fistulas):<ul class="sub"><li>Knows case of Crohn's? Yes MRI (To assess fistula tract), No Colonoscopy to confirm Crohn’s</li><li>IV antibiotics</li><li>Infliximab (in refractory cases)</li></ul></li><li>Solitary cauliflower like mass, friable to touch Rectal/ Anal cancer.<ul class="sub"><li>Anal cancer: &lt;2cm mass, pain, bleeding, mass seen at the anal verge</li><li>Rectal cancer: ≥2cm mass, associated with change in bowel habits, systemic symptoms.</li></ul></li><li>Multiple cauliflower like masses condyloma accuminata</li></ul></div></div>
                </section>
            `,
            questions: [
                {
                    q: 'A 52-year-old is found to have internal haemorrhoids on anoscopy after presenting with rectal bleeding. Which additional investigation should be considered?',
                    options: ['CT angiography of the mesenteric vessels', 'Colonoscopy', 'Barium swallow', 'No further investigation is required'],
                    answer: 1,
                    explanation: 'Colonoscopy is indicated when a patient with haemorrhoids is over 45, has risk factors, or has red flags for colon cancer — haemorrhoids must not be assumed to be the only source of rectal bleeding.'
                },
                {
                    q: 'A patient has a painful, tender perianal swelling with fever and a leukocytosis. What is the management?',
                    options: ['Incision and drainage', 'Conservative management with analgesia alone', 'Fistulotomy', 'Infliximab'],
                    answer: 0,
                    explanation: 'Fever with a leukocytosis and a painful tender perianal swelling indicates an anal abscess, treated by incision and drainage. An anal haematoma is painful but the patient is vitally stable with no leukocytosis, and a simple fistula is treated by fistulotomy.'
                },
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
                <figure class="deck-fig"><div class="deck-fig-title"><span class="deck-tag tag-fig">Diagram</span> Choosing the operation — sleeve vs Roux-en-Y</div>
                <svg viewBox="0 0 700 264" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Bariatric surgery indications are BMI 40 or above, BMI 35 or above with comorbidities such as diabetes, hypertension or obstructive sleep apnoea, or failed medical weight-loss therapy. Essential workup is upper GI endoscopy, which decides the operation, plus CBC, LFT, HbA1c, TSH and psychiatric evaluation. Severe GERD or a large hiatal hernia leads to Roux-en-Y gastric bypass; no reflux or a preference for a less invasive procedure leads to a gastric sleeve.">
                <g font-family="system-ui,Arial">
                <rect x="16" y="12" width="668" height="72" rx="10" fill="#f8fafc" stroke="#cbd5e1"/><text x="32" y="32" font-size="12.5" font-weight="800" fill="#0f172a">1 · Indications (any one)</text><rect x="32" y="42" width="200" height="30" rx="7" fill="#fff" stroke="#cbd5e1"/><text x="132" y="62" text-anchor="middle" font-size="11" fill="#334155">BMI ≥ 40</text><rect x="244" y="42" width="212" height="30" rx="7" fill="#fff" stroke="#cbd5e1"/><text x="350" y="62" text-anchor="middle" font-size="11" fill="#334155">BMI ≥ 35 + DM / HTN / OSA</text><rect x="468" y="42" width="200" height="30" rx="7" fill="#fff" stroke="#cbd5e1"/><text x="568" y="62" text-anchor="middle" font-size="11" fill="#334155">failed medical therapy</text>
                <rect x="16" y="94" width="668" height="62" rx="10" fill="#f5f3ff" stroke="#8b5cf6"/><text x="32" y="114" font-size="12.5" font-weight="800" fill="#6d28d9">2 · Essential workup</text><rect x="32" y="122" width="320" height="28" rx="7" fill="#ede9fe" stroke="#8b5cf6"/><text x="192" y="141" text-anchor="middle" font-size="11" font-weight="800" fill="#4c1d95">UPPER GI ENDOSCOPY — decides the operation</text><rect x="364" y="122" width="304" height="28" rx="7" fill="#fff" stroke="#c4b5fd"/><text x="516" y="141" text-anchor="middle" font-size="10.5" fill="#334155">CBC · LFT · HbA1c · TSH · psychiatric eval</text>
                <rect x="16" y="166" width="330" height="86" rx="10" fill="#fffbeb" stroke="#f59e0b"/><text x="181" y="190" text-anchor="middle" font-size="11.5" font-weight="700" fill="#92400e">severe GERD or large hiatal hernia</text><text x="181" y="210" text-anchor="middle" font-size="12" fill="#94a3b8">▼</text><rect x="40" y="216" width="282" height="28" rx="7" fill="#f59e0b"/><text x="181" y="235" text-anchor="middle" font-size="12.5" font-weight="800" fill="#fff">Roux-en-Y gastric bypass</text>
                <rect x="354" y="166" width="330" height="86" rx="10" fill="#f0fdf4" stroke="#22c55e"/><text x="519" y="190" text-anchor="middle" font-size="11.5" font-weight="700" fill="#166534">no reflux / less invasive preferred</text><text x="519" y="210" text-anchor="middle" font-size="12" fill="#94a3b8">▼</text><rect x="378" y="216" width="282" height="28" rx="7" fill="#22c55e"/><text x="519" y="235" text-anchor="middle" font-size="12.5" font-weight="800" fill="#fff">Gastric sleeve</text>
                </g></svg>
                <figcaption>The endoscopy is the decision point — it detects reflux, hernia and ulcers, and <b>severe GERD or a large hiatal hernia sends the patient to bypass rather than sleeve</b>.</figcaption></figure>
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

                
                <div class="topic-deck">
<h4 class="deck-topic">Bariatric surgery</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>BMI ≥40</li><li>BMI ≥35 with comorbidities (Diabetes, Hypertension, OSA)</li><li>Failed medical therapy of weight loss</li><li>Upper GI Endoscopy Detects reflux, hernia, ulcers (most important step to guide surgery type)</li><li>CBC, LFT, HbA1C, TSH</li><li>Psychiatric evaluation</li><li>Severe GERD, Large hiatal hernia Roux-en-Y gastric bypass</li><li>No reflux, prefer less invasive procedure Gastric sleeve</li></ul></div></div>
                </div>
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
                ,
                {
                    q: 'Which preoperative investigation is most important in guiding the choice of bariatric procedure?',
                    options: ['Upper GI endoscopy', 'Abdominal ultrasound', 'Chest X-ray', 'Colonoscopy'],
                    answer: 0,
                    explanation: 'Upper GI endoscopy detects reflux, hiatal hernia and ulcers, which determine whether a sleeve or a bypass is appropriate.'
                },
                {
                    q: 'A patient with a BMI of 42 has severe GERD and a large hiatal hernia. Which operation is preferred?',
                    options: ['Roux-en-Y gastric bypass', 'Gastric sleeve', 'Intragastric balloon only', 'Adjustable band'],
                    answer: 0,
                    explanation: 'A sleeve gastrectomy can worsen reflux, so severe GERD or a large hiatal hernia favours Roux-en-Y gastric bypass.'
                },
                {
                    q: 'On post-operative day 2 after bariatric surgery a patient develops tachycardia, fever and abdominal pain. What is the earliest sign and the most likely diagnosis?',
                    options: ['Tachycardia — anastomotic/staple-line leak', 'Fever — wound infection', 'Bradycardia — vagal reaction', 'Hypertension — pain response'],
                    answer: 0,
                    explanation: 'Tachycardia is the earliest sign of an anastomotic or staple-line leak (POD 1–5). Confirm with CT/contrast study and treat with re-operation or drainage. VTE/PE remains the leading cause of post-operative death.'
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

                
                <div class="topic-deck">
<h4 class="deck-topic">Mastitis / abscess</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Tender, indurated, swollen, erythematous breast</li><li>Malaise, fever chills</li><li>Pain during breast feeding</li><li>Fluctuant mass, skin changes (beside redness) Abscess</li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>Mastitis is clinical diagnosis</li><li>Mastitis Anti-staph Antibiotics (dicloxacillin, flucloxacillin)</li><li>Multiple abscesses = 5cm abscess, thinned, ischemic, necrotic skin Incision &amp; Drainage</li><li>Otherwise Aspiration</li></ul></div></div>
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

                
                <div class="topic-deck">
<h4 class="deck-topic">Benign breast diseases</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Fibroadenoma: young age, oval shape, mobile painless mass, related to menstrual cycle</li><li>Ductal ectasia: inverted nipple, greenish discharge</li><li>Fibrocystic change: multiple bilateral small masses, milky/greenish discharge / painful, related to menstrual cycle</li><li>Intraductal papilloma: most common cause of non-lactating bloody nipple discharge.</li></ul></div><div class="deck-card mgmt"><span class="deck-card-h">Management</span><ul><li>Fibroadenoma &gt;2-3cm size, growing mass Wide local excision</li><li>Ductal ectasia, Intraductal papilloma intraductal excision</li><li>Fibrocystic changes Conservative (NSAID or hormonal treatment incase of intolerable pain)</li><li>Atypical ductal hyperplasia on Biopsy Wide local excision</li></ul></div></div>
                </div>
<h3>Breast Cancer</h3>
                <figure class="deck-fig"><div class="deck-fig-title"><span class="deck-tag tag-fig">Diagram</span> Breast quadrants &amp; triple assessment</div>
                <svg viewBox="0 0 706 260" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Most breast cancers arise in the upper outer quadrant. Triple assessment comprises clinical examination, imaging with ultrasound or mammography, and biopsy.">
                <g font-family="system-ui,Arial">
                <circle cx="150" cy="130" r="98" fill="#ffffff" stroke="#334155" stroke-width="2"/>
                <line x1="52" y1="130" x2="248" y2="130" stroke="#cbd5e1"/><line x1="150" y1="32" x2="150" y2="228" stroke="#cbd5e1"/>
                <path d="M150,130 L150,32 A98,98 0 0,0 52,130 Z" fill="#ef4444" opacity="0.28"/>
                <circle cx="150" cy="130" r="11" fill="#fecdd3" stroke="#334155"/>
                <text x="100" y="80" text-anchor="middle" font-size="12" font-weight="800" fill="#b91c1c">UOQ ~50%</text>
                <text x="200" y="80" text-anchor="middle" font-size="11" fill="#64748b">UIQ</text><text x="100" y="190" text-anchor="middle" font-size="11" fill="#64748b">LOQ</text><text x="200" y="190" text-anchor="middle" font-size="11" fill="#64748b">LIQ</text>
                <text x="150" y="248" text-anchor="middle" font-size="10.5" fill="#475569">(right breast, patient's view)</text>
                <text x="286" y="44" font-size="13.5" font-weight="800" fill="#0f1e3d">Triple assessment</text>
                <rect x="286" y="58" width="386" height="42" rx="9" fill="#dbeafe" stroke="#3b82f6"/><text x="300" y="79" font-size="11.5" fill="#334155"><tspan font-weight="700">1 · Clinical</tspan> — hard, immobile, irregular lump;</text><text x="300" y="93" font-size="11.5" fill="#334155">skin tethering, peau d'orange</text>
                <rect x="286" y="108" width="386" height="42" rx="9" fill="#dcfce7" stroke="#22c55e"/><text x="300" y="135" font-size="12" fill="#334155"><tspan font-weight="700">2 · Imaging</tspan> — US if &lt;35 y or pregnant; mammogram if ≥35 y</text>
                <rect x="286" y="158" width="386" height="42" rx="9" fill="#ede9fe" stroke="#8b5cf6"/><text x="300" y="185" font-size="12" fill="#334155"><tspan font-weight="700">3 · Biopsy</tspan> — core needle biopsy for histology + receptors</text>
                <text x="286" y="226" font-size="11" fill="#b91c1c" font-weight="700">Red flags: bloody nipple discharge · nipple retraction · fixed axillary nodes</text>
                </g></svg>
                <figcaption>The <b>upper outer quadrant</b> holds the most breast tissue and hosts roughly half of cancers. Any suspicious lump needs the full <b>triple assessment</b> — clinical, imaging and biopsy — never imaging alone.</figcaption></figure>
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

                
                <div class="topic-deck">
<h4 class="deck-topic">Breast cancer</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Breast lump: Hard, immobile, irregular in the upper outer quadrant</li><li>Skin changes: skin tethering, peaudorange, ulceration</li><li>Nipple changes: Retraction or inversion, bloody spontaneous unilateral discharge</li><li>Palpable Axillary LN</li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>Mammogram:<ul class="sub"><li>All women aged between 40-50 every 2 years</li><li>All women aged between 50-69 every 1-2 years</li></ul></li><li>History, physical examination, imaging &amp; biopsy</li><li>Imaging:<ul class="sub"><li>Age &gt;30 or FHx of 1 st degree relative of breast cancer 10 years older Mammogram +- US</li><li>Age &lt;30 US</li></ul></li><li>Solid mass Core needle biopsy</li><li>Cystic mass Fine needle aspiration</li><li>TNM (Tumor, node, metastasis)</li><li>CT chest/abdomen/ pelvis with contrast Distant metastasis</li><li>Clinical examination &amp; sentinel lymph node biopsy Lymph Node metastasis</li></ul></div></div>
<h4 class="deck-topic">Breast cancer</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Tender, indurated, swollen, erythematous breast</li><li>Malaise, fever chills</li><li>Pain during breast feeding</li><li>Fluctuant mass, skin changes (beside redness) Abscess</li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>Mastitis is clinical diagnosis</li><li>Mastitis Anti-staph Antibiotics (dicloxacillin, flucloxacillin)</li><li>Multiple abscesses, ≥ 5cm abscess, thinned, ischemic, necrotic skin Incision &amp; Drainage</li><li>Otherwise Aspiration</li></ul></div></div>
                </div>
<h3>Phyllodes Tumor</h3>
                <ul>
                    <li>Young women (20–30s), <b>rapidly growing</b> large mass, NOT cyclical, skin thinning, firm/well-circumscribed/mobile/lobulated</li>
                    <li>Diagnosis: core needle biopsy · Staging: CT CAP (hematogenous spread)</li>
                    <li>Small → wide local excision with ≥1 cm margins · &gt;8 cm → simple mastectomy</li>
                </ul>
            
                
                <div class="topic-deck">
<h4 class="deck-topic">Phyllode tumor</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Young women (20-30s)</li><li>Rapidly growing large breast mass, Not related to the menstrual cycle</li><li>Skin thinning (Due to pressure of the tumor)</li><li>Firm, well circumscribed, mobile smooth or lobulated mass</li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>Diagnosis Core needle biopsy</li><li>Staging CT chest/abdomen/ pelvis with contrast (Hematogenous spread)</li><li>Treatment:<ul class="sub"><li>Small tumors Wide local excision with at least 1cm clear margins</li><li>&gt;8cm tumors Simple mastectomy</li></ul></li></ul></div></div>
                </div>

            `,
            questions: [
                {
                    q: 'A breastfeeding woman with mastitis now has a single fluctuant 3 cm breast mass. The overlying skin is intact and not necrotic. What is the appropriate management?',
                    options: ['Incision and drainage', 'Simple mastectomy', 'Aspiration', 'Observation alone'],
                    answer: 2,
                    explanation: 'A breast abscess is drained by incision and drainage when there are multiple abscesses, it is 5 cm or larger, or the overlying skin is thinned, ischaemic or necrotic. Otherwise aspiration is appropriate.'
                },
                {
                    q: 'A 26-year-old with no family history of breast cancer has a discrete breast lump. Which imaging should be arranged first?',
                    options: ['Mammogram alone', 'MRI of the breast', 'CT chest, abdomen and pelvis', 'Ultrasound'],
                    answer: 3,
                    explanation: 'Under the age of 30 the initial imaging is ultrasound. A mammogram (with or without ultrasound) is used from age 30, or earlier if a first-degree relative had breast cancer 10 years younger.'
                },
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

                
                <div class="topic-deck">
<h4 class="deck-topic">Abdominal Aortic aneurysm</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Abdominal aortic aneurysm • C/P<ul class="sub"><li>Pulsatile supraumbilical mass.</li><li>Epigastric pain radiated to the back</li><li>Bruit on auscultation</li></ul></li><li>Diagnosis :<ul class="sub"><li>Initial imaging → US (Asymptomatic or unstable)</li><li>Confirmatory → CT-Angio (stable and symptomatic patient)</li></ul></li><li>Treatment:<ul class="sub"><li>Observation → Asymptomatic, below the threshold of repair</li><li>AAA Repair → Diameter &gt;5.5 in men or &gt;5 in women, ruptured or symptomatic aneurysm</li></ul></li></ul></div></div>
                </div>
<h3>Acute Limb Ischemia — the 6 Ps</h3>
                <figure class="deck-fig"><div class="deck-fig-title"><span class="deck-tag tag-fig">Diagram</span> Acute limb ischaemia — the 6 Ps</div>
                <svg viewBox="0 0 700 230" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="The six Ps of acute limb ischaemia are pain, pallor, paraesthesia, pulselessness, perishing cold and paralysis. Paraesthesia and paralysis are late signs indicating a threatened limb.">
                <g font-family="system-ui,Arial">
                <rect x="14" y="20" width="212" height="52" rx="9" fill="#fef3c7" stroke="#f59e0b"/><text x="34" y="52" font-size="20" font-weight="800" fill="#b45309">P</text><text x="56" y="52" font-size="13" fill="#334155">ain — first symptom</text>
                <rect x="240" y="20" width="212" height="52" rx="9" fill="#fef3c7" stroke="#f59e0b"/><text x="260" y="52" font-size="20" font-weight="800" fill="#b45309">P</text><text x="282" y="52" font-size="13" fill="#334155">allor</text>
                <rect x="466" y="20" width="220" height="52" rx="9" fill="#fef3c7" stroke="#f59e0b"/><text x="486" y="52" font-size="20" font-weight="800" fill="#b45309">P</text><text x="508" y="52" font-size="13" fill="#334155">ulselessness</text>
                <rect x="14" y="82" width="212" height="52" rx="9" fill="#fee2e2" stroke="#ef4444"/><text x="34" y="114" font-size="20" font-weight="800" fill="#b91c1c">P</text><text x="56" y="114" font-size="13" fill="#334155">erishing cold</text>
                <rect x="240" y="82" width="212" height="52" rx="9" fill="#fee2e2" stroke="#ef4444"/><text x="260" y="114" font-size="20" font-weight="800" fill="#b91c1c">P</text><text x="282" y="114" font-size="13" font-weight="700" fill="#b91c1c">araesthesia — LATE</text>
                <rect x="466" y="82" width="220" height="52" rx="9" fill="#fee2e2" stroke="#ef4444"/><text x="486" y="114" font-size="20" font-weight="800" fill="#b91c1c">P</text><text x="508" y="114" font-size="13" font-weight="700" fill="#b91c1c">aralysis — LATEST</text>
                <rect x="14" y="146" width="672" height="70" rx="10" fill="#dbeafe" stroke="#3b82f6"/>
                <text x="350" y="170" text-anchor="middle" font-size="12.5" font-weight="700" fill="#1d4ed8">Immediate heparin · US initial · CT-angio is gold standard</text>
                <text x="350" y="192" text-anchor="middle" font-size="11.5" fill="#334155">AF/cardiac source → embolectomy · thrombosis → catheter thrombolysis</text>
                <text x="350" y="210" text-anchor="middle" font-size="11.5" font-weight="700" fill="#b91c1c">Skip imaging if the limb is already paralysed — go straight to intervention</text>
                </g></svg>
                <figcaption><b>Paraesthesia and paralysis are late</b> — their presence means a threatened or non-salvageable limb. A paralysed limb with ABI &lt;0.3 and irreversible changes may require amputation.</figcaption></figure>
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

                
                <div class="topic-deck">
<h4 class="deck-topic">Approach to limb ischemia</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Acute limb ischemia: • Symptoms: 6Ps<ul class="sub"><li>Pain, pallor, parasthesia.</li><li>Pulselessness, perishing cold, paralysis</li></ul></li><li>Approach to limb ischemia : (In order)<ul class="sub"><li>Heparin</li><li>US (initial imaging)</li><li>CT-Angio (gold standard)</li></ul></li><li>Treatment: (Skip imaging incase of paralyzed limb)<ul class="sub"><li>Amputation → acute on top of chronic limb ischemia with ABI &lt;0.3, irreversible paralyzed limb</li><li>Atrial fibrillation or cardiac cause → Embolectomy</li><li>Arterial thrombosis → catheter thrombolysis</li></ul></li></ul></div></div>
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
            
                
                <div class="topic-deck">
<h4 class="deck-topic">Foot Ulcer</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Foot ulcers:<ul class="sub"><li>Check pulse • Absent pulse → Arterial ulcer → Arterial US • Intact pulse → Venous ulcer (associated with dark discoloration) → Venous US</li></ul></li></ul></div></div>
                </div>
<section class="topic deck-enrich">
                    <h3>More from the study deck</h3>
                    <p class="deck-intro">Extra material for this step that spans more than one topic above.</p>
<h4 class="deck-topic">PAD</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Approach to peripheral arterial disease: • Symptoms: Intermittent claudication, rest pain (improves on hanging feet off the bed), Absent or diminished pulse<ul class="sub"><li>ABI</li><li>US (ABI &amp;US → Non-invasive vascular lab exam)</li><li>CT-Angiography</li></ul></li><li>Treatment<ul class="sub"><li>Supervised exercise program</li><li>Treat the medical risk factors (DM, HTN, Atherosclerosis)</li><li>Aspirin to prevent Cardiovascular events (MI is the most common cause of death in PAD patients)</li></ul></li><li>Leriche syndrome: • Symptoms: Intermittent claudication, Decreased femoral pulse, Erectile dysfunction • Treatment: Surgical bypass (aorto-femoral bypass)</li></ul></div></div>
<h4 class="deck-topic">Miscellaneous</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Indications of venous duplex US: (incase of spider vein or varicosities)<ul class="sub"><li>Asymptomatic, cosmetic treatment → No investigation needed</li><li>Symptomatic (Pain, edema, skin changes, visible varicosities) → Venous US</li></ul></li><li>Spider veins (small lesion, cosmetic) → Sclerotherapy</li><li>Significant varicosities or symptomatic → endovascular ablation</li><li>Hard sign for vascular injury:<ul class="sub"><li>Absent pulse</li><li>Bruit or palpable thrill</li><li>Active hemorrhage</li><li>Expanding hematoma</li><li>Distal ischemia (6Ps) • Next step → Urgent surgical exploration</li></ul></li></ul></div></div>
                </section>
            `,
            questions: [
                {
                    q: 'A patient has an acutely ischaemic limb that is already paralysed. What is the correct next step?',
                    options: ['Proceed to urgent intervention without waiting for imaging', 'Arrange an outpatient CT angiogram', 'Start supervised exercise therapy', 'Repeat the ankle-brachial index in 24 hours'],
                    answer: 0,
                    explanation: 'Imaging is skipped once the limb is paralysed — that signals urgent intervention is needed. An ABI below 0.3 with an irreversibly paralysed limb means amputation; a cardiac/embolic cause needs embolectomy and arterial thrombosis needs catheter thrombolysis.'
                },
                {
                    q: 'A leg ulcer is pale and punched-out and painful, and the distal pulses are absent. Which ulcer is it and which imaging is appropriate?',
                    options: ['Venous ulcer — venous ultrasound', 'Venous ulcer — arterial ultrasound', 'Arterial ulcer — arterial ultrasound', 'Arterial ulcer — venous ultrasound'],
                    answer: 2,
                    explanation: 'Arterial ulcers are pale, punched-out and painful with absent pulses, and are investigated with arterial ultrasound. Venous ulcers are superficial and painless with dark discolouration and intact pulses, investigated with venous ultrasound.'
                },
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
                <figure class="deck-fig"><div class="deck-fig-title"><span class="deck-tag tag-fig">Diagram</span> SBO vs LBO on abdominal X-ray</div>
                <svg viewBox="0 0 680 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Small bowel obstruction: central loops with valvulae conniventes crossing the full lumen. Large bowel obstruction: peripheral loops framing the abdomen with partial haustra.">
                <rect x="20" y="30" width="300" height="240" rx="10" fill="#ffffff" stroke="#d9d0f2"/><text x="170" y="55" text-anchor="middle" font-size="15" font-weight="700" fill="#0f1e3d">Small bowel (SBO)</text>
                <rect x="90" y="80" width="160" height="34" rx="14" fill="#fde2e4" stroke="#ef4444"/><rect x="90" y="128" width="160" height="34" rx="14" fill="#fde2e4" stroke="#ef4444"/><rect x="90" y="176" width="160" height="34" rx="14" fill="#fde2e4" stroke="#ef4444"/>
                <g stroke="#b91c1c" stroke-width="1.4"><line x1="90" y1="97" x2="250" y2="97"/><line x1="90" y1="145" x2="250" y2="145"/><line x1="90" y1="193" x2="250" y2="193"/></g>
                <text x="170" y="238" text-anchor="middle" font-size="12" fill="#b91c1c" font-weight="700">Central · valvulae conniventes</text><text x="170" y="256" text-anchor="middle" font-size="11" fill="#475569">cross full lumen · dilated &gt;3 cm</text>
                <rect x="360" y="30" width="300" height="240" rx="10" fill="#ffffff" stroke="#d9d0f2"/><text x="510" y="55" text-anchor="middle" font-size="15" font-weight="700" fill="#0f1e3d">Large bowel (LBO)</text>
                <path d="M400,80 H620 V210 H400 Z" fill="none" stroke="#2563eb" stroke-width="18" opacity="0.22" stroke-linejoin="round"/><path d="M400,80 H620 V210 H400 Z" fill="none" stroke="#2563eb" stroke-width="2"/>
                <g stroke="#1d4ed8" stroke-width="1.4"><line x1="450" y1="71" x2="450" y2="89"/><line x1="510" y1="71" x2="510" y2="89"/><line x1="570" y1="71" x2="570" y2="89"/><line x1="611" y1="130" x2="629" y2="130"/><line x1="611" y1="165" x2="629" y2="165"/></g>
                <text x="510" y="238" text-anchor="middle" font-size="12" fill="#1d4ed8" font-weight="700">Peripheral · haustra (partial)</text><text x="510" y="256" text-anchor="middle" font-size="11" fill="#475569">frames abdomen · caecum &gt;9 cm</text>
                </svg>
                <div class="deck-imgcell" style="max-width:340px;margin:12px auto 0">
                    <img class="deck-img" src="/summaries/bowel-obstruction-axr.webp" width="964" height="1200" loading="lazy" decoding="async"
                         alt="Upright plain abdominal radiograph showing several dilated, gas-filled bowel loops with multiple horizontal air-fluid levels stacked across the abdomen." />
                    <p class="deck-imgcap">A real obstructed abdomen: dilated gas-filled loops with multiple <b>air-fluid levels</b> on the upright film</p>
                </div>
                <figcaption><b>SBO</b>: central loops, <b>valvulae conniventes</b> cross the whole lumen. <b>LBO</b>: peripheral loops, <b>haustra</b> only partly cross. Early vomiting → SBO; early distension → LBO. The photograph shows the finding that puts obstruction on the table in the first place — <b>stacked air-fluid levels on an upright film</b>; the schematic above is what you then use to decide small vs large.</figcaption>
                <p class="deck-credit">Abdominal radiograph: <a href="https://commons.wikimedia.org/wiki/File:Upright_abdominal_X-ray_demonstrating_a_bowel_obstruction.jpg" target="_blank" rel="noopener noreferrer">James Heilman, MD</a>, <a href="https://creativecommons.org/licenses/by-sa/3.0/" target="_blank" rel="noopener noreferrer">CC BY-SA 3.0</a>. Resized for web; content unmodified.</p></figure>
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

                
                <div class="topic-deck">
<h4 class="deck-topic">Bowel obstruction</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Hernia: protrusion of an organ through a weakness in the surrounding wall</li><li>Indirect inguinal hernia: Passes through a deep inguinal ring lateral to inferior epigastric vessels</li><li>Direct inguinal hernia: Passes directly from the abdominal wall Medial to inferior epigastric vessels</li><li>Femoral hernia: Below &amp; lateral to pubic tubercle</li><li>Cardinal symptoms of bowel obstruction: Abdominal pain, Abdominal distention, Constipation/Obstipation, Vomiting.</li><li>Small bowel obstruction: Colicky periumbilical pain, Early onset of vomiting , Late onset of constipation &amp; abdominal distension</li><li>Large bowel obstruction: Colicky abdominal pain, Late onset of vomiting (bilious then feculent vomitus, Early and significant abdominal distension &amp; constipation.</li><li>Paralytic ileus: • Definition: Temporal impaired peristalsis of the GIT in the absence of mechanical obstruction • Etiology: Intra-abdominal surgery, Electrolyte disturbance (Hypokalemia) • Diagnosis: Clinical diagnosis, Abdominal X-ray (Figure-1) • Treatment: Supportive treatment, surgery incase of perforation</li><li>Ogilvie syndrome: • Definition: Acute dilation of the colon , in the absence of mechanical obstruction • Etiology: As paralytic ileus • Diagnosis: Abdominal X-ray (Figure-2) • Treatment: Supportive treatment, neostigmine (Prokinetic agent), colonoscopic decompression</li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>History &amp; examination (Location, elation to pubic tubercle, cough impulse, tenderness, reducibility)</li><li>Cough impulse: Positive = Hernia</li><li>Location: Above inguinal ligament Inguinal hernia, Below inguinal ligament Femoral Hernia</li><li>Ultrasound : First investigation in groin mass, CT if uncertainty or Bowel obstruction suspected</li><li>Initial imaging Erect CXR (to assess under diaphragm), Abdominal X-ray (Supine &amp; upright)</li><li>Confirmatory imaging CT abdomen &amp; pelvis with IV contrast</li><li>ABC Supportive treatment (IV fluid, electrolyte correction, NG decompression, antiemetics)</li><li>Treat the underlying cause (Hernia, Adhesion, Volvulus, intussusceptions)</li><li>Laparotomy indications: Peritonitis, strangulation, failure of conservative management</li></ul></div></div>
                </div>
<h3>Hernia</h3>
                <figure class="deck-fig"><div class="deck-fig-title"><span class="deck-tag tag-fig">Diagram</span> Inguinal hernia — direct vs indirect</div>
                <svg viewBox="0 0 680 280" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Indirect inguinal hernia passes lateral to the inferior epigastric vessels through the deep ring toward the scrotum; direct hernia bulges medial to the vessels through Hesselbach triangle.">
                <line x1="345" y1="55" x2="315" y2="235" stroke="#7c3aed" stroke-width="5"/><text x="352" y="52" font-size="12" font-weight="700" fill="#7c3aed">inferior epigastric vessels</text>
                <text x="500" y="34" text-anchor="middle" font-size="13.5" font-weight="700" fill="#ef4444">Lateral → INDIRECT</text>
                <circle cx="470" cy="120" r="28" fill="none" stroke="#ef4444" stroke-width="2.5"/><text x="470" y="124" text-anchor="middle" font-size="10.5" fill="#b91c1c" font-weight="700">deep ring</text>
                <path d="M470,148 Q512,200 496,246" fill="none" stroke="#ef4444" stroke-width="9" opacity="0.3"/><path d="M470,148 Q512,200 496,246" fill="none" stroke="#ef4444" stroke-width="2"/>
                <text x="500" y="266" text-anchor="middle" font-size="11" fill="#475569">via canal → may reach scrotum · congenital</text>
                <text x="175" y="34" text-anchor="middle" font-size="13.5" font-weight="700" fill="#2563eb">Medial → DIRECT</text>
                <path d="M110,150 L245,120 L245,180 Z" fill="#dbeafe" stroke="#2563eb" stroke-width="2"/><text x="180" y="157" text-anchor="middle" font-size="10.5" fill="#1d4ed8" font-weight="700">Hesselbach</text>
                <text x="175" y="266" text-anchor="middle" font-size="11" fill="#475569">through weak canal floor · acquired</text>
                <rect x="196" y="66" width="276" height="24" rx="12" fill="#f1f5f9"/><text x="334" y="83" text-anchor="middle" font-size="11" font-weight="700" fill="#334155">MDs don't LIe — Medial=Direct, Lateral=Indirect</text>
                </svg>
                <figcaption><b>Indirect</b> (lateral to the vessels, via the deep ring) is congenital and can reach the scrotum; <b>direct</b> (medial, through Hesselbach's triangle) is acquired.</figcaption></figure>
                <ul>
                    <li><b>Indirect inguinal</b>: through deep ring, <b>lateral</b> to inferior epigastric vessels</li>
                    <li><b>Direct inguinal</b>: <b>medial</b> to inferior epigastric vessels (Hesselbach triangle)</li>
                    <li><b>Femoral</b>: below &amp; lateral to the pubic tubercle (high strangulation risk)</li>
                    <li>Severity: reducible → irreducible → obstructed → <b>strangulated</b> (tense, very tender, reddish, systemic signs); US first investigation</li>
                </ul>

                
                <div class="topic-deck">
<h4 class="deck-topic">Hernia</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Hernia: protrusion of an organ through a weakness in the surrounding wall</li><li>Indirect inguinal hernia: Passes through a deep inguinal ring lateral to inferior epigastric vessels</li><li>Direct inguinal hernia: Passes directly from the abdominal wall Medial to inferior epigastric vessels</li><li>Femoral hernia: Below &amp; lateral to pubic tubercle</li><li>Reducible hernia is soft, non-tender, has a positive cough impulse, and can be pushed back in.</li><li>Irreducible hernia cannot be reduced but is not tender or obstructed.</li><li>Obstructed hernia irreducible, tender, with signs of bowel obstruction (vomiting, distension)</li><li>Strangulated hernia tense, severely tender, irreducible, reddish discoloration, and shows systemic signs due to compromised blood supply.</li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>History &amp; examination (Location, elation to pubic tubercle, cough impulse, tenderness, reducibility)</li><li>Cough impulse: Positive = Hernia</li><li>Location: Above inguinal ligament Inguinal hernia, Below inguinal ligament Femoral Hernia</li><li>Ultrasound : First investigation in groin mass, CT if uncertainty or Bowel obstruction suspected</li></ul></div><div class="deck-card mgmt"><span class="deck-card-h">Management</span><ul><li>Hernia = surgery (open mesh repair or laparoscopic repair)</li><li>Open mesh repair First line procedure especially when laparoscopic is Contraindicated (strangulated hernia, large or complex hernia Open repair)</li><li>Laparoscopic repair (Bilateral , Recurrent, patient desire to quicker recovery or post-op pain, asymptomatic femoral)</li></ul></div></div>
                </div>
<h3>Appendicitis</h3>
                <figure class="deck-fig"><div class="deck-fig-title"><span class="deck-tag tag-fig">Diagram</span> Appendicitis — McBurney's point &amp; signs</div>
                <svg viewBox="0 0 680 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="McBurney's point lies two-thirds from the umbilicus toward the right anterior superior iliac spine; Rovsing, psoas and obturator signs support the diagnosis.">
                <rect x="360" y="24" width="290" height="200" rx="34" fill="#ffffff" stroke="#334155" stroke-width="2"/>
                <circle cx="500" cy="86" r="5" fill="#334155"/><text x="500" y="76" text-anchor="middle" font-size="10" fill="#475569">umbilicus</text>
                <circle cx="596" cy="168" r="5" fill="#334155"/><text x="600" y="188" font-size="10" fill="#475569">ASIS</text>
                <line x1="500" y1="86" x2="596" y2="168" stroke="#94a3b8" stroke-dasharray="4 3"/>
                <circle cx="564" cy="141" r="12" fill="#ef4444"/><text x="564" y="145" text-anchor="middle" font-size="9" fill="#fff" font-weight="700">MB</text><text x="520" y="122" text-anchor="middle" font-size="10.5" fill="#b91c1c" font-weight="700">McBurney (⅔ to ASIS)</text>
                <g font-size="12" fill="#334155"><text x="24" y="52" font-weight="700" fill="#0f1e3d">Supporting signs</text>
                <text x="24" y="82">Rovsing — LLQ press → RLQ pain</text><text x="24" y="110">Psoas — pain on hip extension</text><text x="24" y="138">Obturator — pain on internal rotation</text><text x="24" y="166">Rebound / guarding (peritonism)</text><text x="24" y="200" font-size="11" fill="#b91c1c" font-weight="700">migrates periumbilical → RLQ</text></g>
                </svg>
                <figcaption>Pain migrates <b>periumbilical → RLQ</b> (McBurney's point). Supportive: Rovsing, psoas, obturator, rebound. Diagnosis is clinical (± US in children/pregnancy, CT in adults) → appendicectomy.</figcaption></figure>
                <ul>
                    <li>RLQ pain (starts periumbilical, migrates), nausea/vomiting/anorexia, low-grade fever, rebound at McBurney's</li>
                    <li>Diagnosis: US (pediatric/pregnant), CT abdomen (best sensitivity); uncomplicated → laparoscopic appendectomy; abscess → percutaneous drainage + IV antibiotics + interval appendectomy; phlegmon → conservative IV antibiotics</li>
                </ul>

                
                <div class="topic-deck">
<h4 class="deck-topic">Appendicitis</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>RLQ pain, start as periumbilical thin migrates</li><li>Nausea, Vomiting, Anorexia</li><li>Low grade fever</li><li>Rebound tenderness at Mc-Burney point</li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>Ultrasound pediatric, Pregnant patient</li><li>CT abdomen: Best sensitivity</li><li>Uncomplicated appendicitis Laparoscopic appendectomy</li><li>Appendiceal abscess Percutaneous drainage + IV antibiotics + Interval appendectomy</li><li>Appendiceal Phlegmon (mass without collection) Conservative management (IV antibiotics)</li></ul></div></div>
                </div>
<h3>Diverticulitis</h3>
                <p>LLQ pain + fever + change in bowel habits → CT abdomen with contrast → colonoscopy after 6–8 weeks (R/O cancer). Abscess → image-guided drainage ± antibiotics (Hinchey); perforation → exploratory laparotomy.</p>

                
                <div class="topic-deck">
<h4 class="deck-topic">Diverticulitis</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>LLQ pain</li><li>Fever</li><li>Change in bowel habits (Diarrhea, constipation)</li><li>Tenderness +- guarding, rebound tenderness</li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>CT Abdomen with contrast (to diagnose diverticulitis, abscess , perforation)</li><li>Colonoscopy: after 6-8 weeks to R/O colon cancer</li><li>Abscess (Post-Op spikes of fever) Imaging guided drainage (most of abscesses) or according to Hinchey classification +- Antibiotics</li><li>Perforation Exploratory laparotomy</li></ul></div></div>
                </div>
<h3>Colon Cancer &amp; Mesenteric Ischemia</h3>
                <div class="sum-callout"><b>Key rule</b>: any patient &gt;45 with GI bleeding or anemia → <b>colonoscopy</b> → if cancer: CT CAP → treat per stage. In obstruction with suspected cancer: <b>surgery first</b> (colonoscopy contraindicated in acute obstruction — perforation risk).</div>
                <ul>
                    <li><b>Mesenteric ischemia</b>: cardiac source (A.fib/MI/VHD) + pain <b>out of proportion</b> to exam → CT-angiography</li>
                    <li><b>Ischemic colitis</b>: X-ray <b>thumb-printing</b> in the watershed descending/sigmoid colon</li>
                </ul>

                
                <div class="topic-deck">
<h4 class="deck-topic">Appendiceal cancer</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Adenocarcinoma Right hemicolectomy</li><li>Carcinoid tumor:</li><li>Observation if:<ul class="sub"><li>&lt;2cm mass</li><li>At the tip of the appendix</li><li>No mesothelium or LN invasion</li></ul></li><li>Right hemicolectomy if :<ul class="sub"><li>&gt;2cm mass</li><li>At the base of the appendix</li><li>Mesothelium or LN invasion</li></ul></li></ul></div></div>
<h4 class="deck-topic">Colon cancer</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Any patient &gt;45 years old with GI bleeding or anemia : • Colonoscopy (To R/O colon cancer) • CT Chest/abdomen/pelvis (if diagnosed) • Treatment according to the stage</li><li>Incase of bowel obstruction with suspected cancer Surgery (to relive obstruction) Colonoscopy</li><li>Colonoscopy is contraindicated in acute obstruction due to high risk of perforation</li></ul></div></div>
<h4 class="deck-topic">Acute mesenteric ischemia</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Etiology: Cardiac diseases (A.fib, MI, VHD)</li><li>Severe abdominal pain, out of proportion of the physical examination</li><li>Diarrhea; bloody in the lates stages</li><li>Nausea, vomiting, abdominal bloating</li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>WBC: leukocytosis (inflammatory response secondary to bowel ischemia)</li><li>Confirmed by CT-Angiography (Shows embolus or thrombus, dilated lumen, thick wall, fat stranding)</li><li>Note: Cardiovascular disease + Old age + acute severe abdominal pain Acute mesenteric ischemia or ischemic colitis</li></ul></div></div>
                </div>
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
            
                
                <div class="topic-deck">
<h4 class="deck-topic">Inflammatory bowel disease</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Complications: Abscess, perforation, strictures causes SBO, perianal fistula, anal fissure</li><li>Abscess: simple tender swelling, fever, leukocytosis I&amp;D (Percutaneous drainage)</li><li>Strictures: SBO symptoms (vomiting, abdominal pain and distension) Resection of segment, Stricturoplasty (second line surgery)</li><li>Complications: Toxic megacolon, bleeding, colon cancer</li><li>Toxic megacolon: • C/P: Bloody diarrhea, vomiting, Abdominal distension and pain, signs of sepsis: fever, tachycardia, hypotension • Diagnosis: Abdominal X-ray shows (transverse colon dilation &gt;6cm, Loss of haustration) • Treatment: failed medical management, high risk of perforation (&gt;10 cm dilation) Surgery (Subtotal colectomy with end ileostomy)</li></ul></div></div>
                </div>

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
                <figure class="deck-fig"><div class="deck-fig-title"><span class="deck-tag tag-fig">Diagram</span> Hyperkalaemia with ECG changes — stabilise, shift, remove</div>
                <svg viewBox="0 0 700 236" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Hyperkalaemia with ECG changes is treated in three phases. Stabilise: IV calcium gluconate first, which stabilises the cardiac membrane. Shift potassium into cells: insulin with dextrose, sodium bicarbonate if acidotic, and beta-agonists. Remove potassium: loop diuretics or Kayexalate, and haemodialysis as the definitive treatment for severe or refractory cases. On ECG hyperkalaemia gives a peaked T-wave and hypokalaemia gives a flattened T-wave.">
                <g font-family="system-ui,Arial">
                <rect x="16" y="18" width="214" height="150" rx="10" fill="#fef2f2" stroke="#ef4444"/><rect x="16" y="18" width="214" height="34" rx="10" fill="#ef4444"/><text x="123" y="41" text-anchor="middle" font-size="13" font-weight="800" fill="#fff">1 · STABILISE</text><text x="123" y="80" text-anchor="middle" font-size="12" font-weight="800" fill="#b91c1c">IV calcium gluconate</text><text x="123" y="104" text-anchor="middle" font-size="10.5" fill="#334155">stabilises the cardiac</text><text x="123" y="120" text-anchor="middle" font-size="10.5" fill="#334155">membrane</text><rect x="40" y="134" width="166" height="24" rx="6" fill="#fff" stroke="#ef4444"/><text x="123" y="150" text-anchor="middle" font-size="10.5" font-weight="800" fill="#b91c1c">ALWAYS FIRST</text>
                <rect x="240" y="18" width="214" height="150" rx="10" fill="#fffbeb" stroke="#f59e0b"/><rect x="240" y="18" width="214" height="34" rx="10" fill="#f59e0b"/><text x="347" y="41" text-anchor="middle" font-size="13" font-weight="800" fill="#fff">2 · SHIFT INTO CELLS</text><text x="347" y="76" text-anchor="middle" font-size="11.5" font-weight="700" fill="#92400e">insulin + dextrose</text><text x="347" y="100" text-anchor="middle" font-size="10.5" fill="#334155">sodium bicarbonate</text><text x="347" y="116" text-anchor="middle" font-size="10.5" fill="#334155">(if acidotic)</text><text x="347" y="140" text-anchor="middle" font-size="10.5" fill="#334155">beta-agonists</text>
                <rect x="464" y="18" width="220" height="150" rx="10" fill="#f0fdf4" stroke="#22c55e"/><rect x="464" y="18" width="220" height="34" rx="10" fill="#22c55e"/><text x="574" y="41" text-anchor="middle" font-size="13" font-weight="800" fill="#fff">3 · REMOVE</text><text x="574" y="76" text-anchor="middle" font-size="11" fill="#334155">loop diuretics /</text><text x="574" y="92" text-anchor="middle" font-size="11" fill="#334155">Kayexalate</text><text x="574" y="120" text-anchor="middle" font-size="11.5" font-weight="800" fill="#15803d">haemodialysis</text><text x="574" y="140" text-anchor="middle" font-size="10" fill="#334155">definitive — severe / refractory</text>
                <rect x="16" y="180" width="668" height="46" rx="9" fill="#f8fafc" stroke="#cbd5e1"/>
                <text x="34" y="209" font-size="11" font-weight="800" fill="#b91c1c">Hyperkalaemia — peaked T</text><polyline points="200,212 216,212 222,200 228,220 234,212 250,212 262,186 274,212 320,212" fill="none" stroke="#b91c1c" stroke-width="2"/>
                <text x="368" y="209" font-size="11" font-weight="800" fill="#1d4ed8">Hypokalaemia — flattened T</text><polyline points="536,212 552,212 558,200 564,220 570,212 586,212 598,207 610,212 656,212" fill="none" stroke="#1d4ed8" stroke-width="2"/>
                </g></svg>
                <figcaption><b>Calcium first</b> — it changes nothing about the potassium level but protects the heart while the shifting and removing agents work.</figcaption></figure>
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

                
                <div class="topic-deck">
<div class="deck-block deck-tbl"><div class="deck-cap"><span class="deck-tag tag-tbl">Table</span> Hyperkalaemia — treatment</div><p class="deck-subcap">especially if ECG changes are present</p><table><thead><tr><th>Step</th><th>Treatment</th><th>Action</th></tr></thead><tbody><tr><td><b>1</b></td><td>IV calcium gluconate</td><td>First step — stabilises the cardiac membrane</td></tr><tr><td><b>2</b></td><td>Insulin + dextrose</td><td>Drives potassium into cells</td></tr><tr><td><b>3</b></td><td>Sodium bicarbonate</td><td>Useful in acidosis; shifts K+ intracellularly</td></tr><tr><td><b>4</b></td><td>Beta-agonists (e.g. albuterol)</td><td>Shift K+ intracellularly</td></tr><tr><td><b>5</b></td><td>Loop diuretics or cation-exchange resin (e.g. Kayexalate)</td><td>Promote K+ excretion</td></tr><tr><td><b>6</b></td><td>Haemodialysis</td><td>Definitive treatment in severe / refractory hyperkalaemia</td></tr></tbody></table></div>
<h4 class="deck-topic">Dehydration / Electrolyte imbalance</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Severe Vomiting Hypochloermic, hypokalemic, metabolic alkalosis with paradoxical aciduria. Treatment Normal saline</li><li>Severe diarrhea Hypokalemic, metabolic acidosis (loss of HCO3) Treatment Ringer lactate</li><li>ECG: Hypokalemia flattening T-Wave Hyperkalemia Peaked T-Wave</li><li>Normal urine output: • &gt;0.5 ml/kg/Hr in adults (if the weight non-mentioned assume ideal body weight 70kg) • &gt; 1 ml/kg/Hr in pediatrics</li></ul></div></div>
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
            
                
                <div class="topic-deck">
<h4 class="deck-topic">Nutrition</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>First step: Check GIT function Non-functioning Parenteral Nutrition Functioning Enteral feeding</li><li>Acute case (Less than 1 month): Start with nasogastric tube At risk of aspiration NJG</li><li>Chronic case (more than 1 month): Start with gastrostomy At risk of aspiration jejunostomy</li><li>Refeeding syndrome: Metabolic condition that occur when nutrition is reintroduced after prolonged fasting or malnutrition It Causes Hypokalemia, Hypomagnesemia, Hypophosphatemia</li><li>Absorption sites:</li><li>Duodenum Iron</li><li>Jejunum Folic acid</li><li>Terminal ileum Vitamin B12 &amp; Bile salts</li></ul></div></div>
                </div>

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
                ,
                {
                    q: 'A patient has a potassium of 7.2 mEq/L with peaked T-waves on ECG. What is the FIRST drug to give?',
                    options: ['IV calcium gluconate', 'Insulin with dextrose', 'Sodium bicarbonate', 'Kayexalate'],
                    answer: 0,
                    explanation: 'IV calcium gluconate is given first to stabilise the cardiac membrane. Insulin + dextrose, bicarbonate and beta-agonists then shift K+ intracellularly, and loop diuretics/Kayexalate or dialysis remove it.'
                },
                {
                    q: 'A patient with several days of severe vomiting has which acid-base and electrolyte picture, and which fluid is preferred?',
                    options: ['Hypochloremic, hypokalemic metabolic alkalosis — normal saline', 'Hypokalemic metabolic acidosis — Ringer lactate', 'Respiratory alkalosis — dextrose 5%', 'Hyperchloremic acidosis — sodium bicarbonate'],
                    answer: 0,
                    explanation: 'Vomiting loses HCl → hypochloremic, hypokalemic metabolic alkalosis with paradoxical aciduria; treat with normal saline. Severe diarrhoea instead causes hypokalemic metabolic acidosis (HCO3 loss) treated with Ringer lactate.'
                },
                {
                    q: 'After extensive terminal ileal resection, which deficiency should be anticipated long term?',
                    options: ['Vitamin B12', 'Iron', 'Folic acid', 'Vitamin C'],
                    answer: 0,
                    explanation: 'Vitamin B12 and bile salts are absorbed in the terminal ileum. Iron is absorbed in the duodenum and folic acid in the jejunum.'
                }
            ]
        },
        {
            id: 'surg-endocrine',
            title: '07 — Endocrine Surgery',
            title_en: 'Thyroid (Bethesda, Complications) · Parathyroid · Adrenal',
            summaryHtml: `
                <h3>Thyroid &amp; Neck Mass</h3>
                <figure class="deck-fig"><div class="deck-fig-title"><span class="deck-tag tag-fig">Diagram</span> Solitary thyroid nodule — workup</div>
                <svg viewBox="0 0 700 250" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="First check TSH. Low TSH leads to a radionuclide scan where hot nodules are usually benign; normal or high TSH leads to ultrasound and fine-needle aspiration.">
                <g font-family="system-ui,Arial">
                <rect x="270" y="18" width="160" height="40" rx="10" fill="#e0e7ff" stroke="#6366f1"/><text x="350" y="43" text-anchor="middle" font-size="12.5" font-weight="700" fill="#4338ca">Solitary thyroid nodule</text>
                <rect x="300" y="76" width="100" height="34" rx="10" fill="#fff7ed" stroke="#f59e0b"/><text x="350" y="98" text-anchor="middle" font-size="12" font-weight="700" fill="#b45309">check TSH</text>
                <line x1="350" y1="58" x2="350" y2="76" stroke="#94a3b8" stroke-width="2"/>
                <line x1="350" y1="110" x2="160" y2="140" stroke="#94a3b8" stroke-width="2"/><line x1="350" y1="110" x2="540" y2="140" stroke="#94a3b8" stroke-width="2"/>
                <rect x="60" y="140" width="200" height="34" rx="10" fill="#fee2e2" stroke="#ef4444"/><text x="160" y="162" text-anchor="middle" font-size="11.5" font-weight="700" fill="#b91c1c">Low TSH → uptake scan</text>
                <rect x="440" y="140" width="200" height="34" rx="10" fill="#dbeafe" stroke="#3b82f6"/><text x="540" y="162" text-anchor="middle" font-size="11.5" font-weight="700" fill="#1d4ed8">Normal/high → US + FNA</text>
                <line x1="160" y1="174" x2="160" y2="196" stroke="#94a3b8" stroke-width="2"/><rect x="40" y="196" width="240" height="40" rx="10" fill="#f1f5f9" stroke="#cbd5e1"/><text x="160" y="221" text-anchor="middle" font-size="11" fill="#334155">hot = usually benign · cold → FNA</text>
                <line x1="540" y1="174" x2="540" y2="196" stroke="#94a3b8" stroke-width="2"/><rect x="420" y="196" width="240" height="40" rx="10" fill="#f1f5f9" stroke="#cbd5e1"/><text x="540" y="221" text-anchor="middle" font-size="11" fill="#334155">Bethesda category → surgery if malignant</text>
                </g></svg>
                <figcaption>First step is <b>TSH</b>. Low → radionuclide scan (<b>hot</b> nodules are rarely malignant). Normal/high → <b>ultrasound + FNA</b> (Bethesda) to characterise.</figcaption></figure>
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

                
                <div class="topic-deck">
<h4 class="deck-topic">Neck nodule</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Goiter: Tracheal and esophageal compression by midline mass dysphagia, dyspnea</li><li>Thyroglossal cyst (central neck mass) moves with tongue protrusion surgery</li><li>Cystic hygroma (lateral neck mass) has clear lymphatic fluid sclerotherapy surgery</li><li>Autoimmune thyroiditis associated with Lymphoma (Most commonly) then papillary</li><li>Papillary thyroid cancer: Lymphatic metastasis, Papillary architecture (could be follicular</li><li>papillary and follicular monitoring Thyroglobulin</li><li>Medullary thyroid cancer<ul class="sub"><li>Monitoring calcitonin</li><li>Treatment Total thyroidectomy</li></ul></li><li>The Bethesda system for reporting thyroid cytopathology is 6-category classification to interpretate the results of FNA.</li><li>Bethesda -1 repeat FNA Bethesda -4 hemithyroidectomy Bethesda -2 Follow up with US Bethesda -5 as 4 or 6 Bethesda -3 repeat FNA Bethesda -6 near total thyroidectomy</li><li>Hematoma: neck swelling &amp; neck swelling few hours post-op bedside wound explorations</li><li>Nerve injury:<ul class="sub"><li>High pitched voice Superior laryngeal nerve</li><li>Hoarseness Recurrent laryngeal nerve</li></ul></li><li>Hypocalcemia: Post-operative spasms</li></ul></div></div>
<h4 class="deck-topic">Approach to thyroid nodule</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Distributive shock (Septic, Neurogenic shock) peripheral vasodilation (Low peripheral resistance) which increase blood flow to the skin Warm extremities.</li><li>Neurogenic shock common after spinal cord trauma, Hypotension without reflex tachycardia, focal neurological deficit</li><li>Septic shock: suspected source of infection, hypotension with reflex tachycardia, high cardiac output</li><li>External hemorrhoids: similar manifestation to internal hemorrhoids, with severe perianal pain and a tender purplish mucosal mass</li><li>TIRAD &lt;3 &lt;1cm nodule</li><li>TIRAD ≥ 3 ≥1cm nodule</li></ul></div></div>
<h4 class="deck-topic">Thyroid disorders</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Thyroid scan:<ul class="sub"><li>No uptake subacute thyroiditis</li><li>Diffuse uptake graves disease</li></ul></li><li>Near total thyroidectomy indications:<ul class="sub"><li>Presence of eye symptoms</li><li>Failed medical treatment</li><li>Compressive symptoms</li></ul></li><li>Hot nodule: start anti-thyroid treatment to reach euthryroid status.</li><li>Medical treatment:<ul class="sub"><li>Beta blocker (symptomatic patient)</li><li>Antithyroid drugs</li></ul></li></ul></div></div>
                </div>
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
                    q: 'Fine-needle aspiration of a thyroid nodule returns Bethesda category IV (follicular neoplasm). What is the appropriate management?',
                    options: ['Repeat the FNA', 'Hemithyroidectomy', 'Follow up with ultrasound', 'Near-total thyroidectomy'],
                    answer: 1,
                    explanation: 'Bethesda IV (follicular neoplasm) is managed by hemithyroidectomy. Categories I and III are repeated, II is followed up with ultrasound, and VI (malignant) needs near-total thyroidectomy.'
                },
                {
                    q: 'The day after a total thyroidectomy a patient develops perioral tingling, muscle spasms and carpopedal tetany. What is the cause and the treatment?',
                    options: ['Recurrent laryngeal nerve injury — observe', 'Superior laryngeal nerve injury — speech therapy', 'Neck haematoma — bedside exploration', 'Hypocalcaemia — calcium replacement'],
                    answer: 3,
                    explanation: 'Post-thyroidectomy spasms and tetany indicate hypocalcaemia and are treated with calcium replacement. Hoarseness suggests recurrent laryngeal nerve injury, a high-pitched voice suggests superior laryngeal nerve injury, and a painful neck swelling within hours of surgery is a haematoma needing bedside exploration.'
                },
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

                
                <div class="topic-deck">
<h4 class="deck-topic">Mallory Weiss syndrome</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Definition: UGIB caused by tear at the gastro-esophageal junction</li><li>May be asymptomatic</li><li>Epigastric or backpain</li><li>Hematemesis preceded by forceful or repeated vomiting</li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>Esophagogastroduodenoscopy Gold standard (indicated to all patients)</li><li>If the patient actively bleeding UGIB Treatment</li><li>If the patient not-actively bleeding Conservative management (PPI, antiemetics)</li></ul></div></div>
<h4 class="deck-topic">Boerhaave's syndrome</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Pathophysiology: Severe vomiting/ high intrathoracic pressure Transmural perforation</li><li>Mackler triad: Vomiting/retching, Retrosternal Chest pain, Subcutaneous or mediastinal emphysema</li><li>Dysphagia</li><li>Dyspnea, tachypnea, tachycardia</li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>Chest X-ray Widened or pneumomediastinum, pneumothorax, pneumoperitoneum</li><li>Neck X-ray SC emphysema</li><li>Contrast esophagography Contrast leak at the site of perforation</li><li>Treatment (See next slide)</li></ul></div></div>
                </div>
<h3>Esophageal Cancer</h3>
                <figure class="deck-fig"><div class="deck-fig-title"><span class="deck-tag tag-fig">Diagram</span> Oesophageal cancer — location tells you the type</div>
                <svg viewBox="0 0 700 310" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Squamous cell carcinoma arises in the upper oesophagus and its risk factors are achalasia, smoking and alcohol. Adenocarcinoma arises in the lower oesophagus and its risk factors are Barrett's oesophagus, GERD, male sex and age 50 to 60. Progressive dysphagia with weight loss is investigated by EGD with biopsy then CT of the chest and abdomen for staging.">
                <g font-family="system-ui,Arial">
                <rect x="118" y="20" width="52" height="90" rx="12" fill="#fee2e2" stroke="#ef4444"/><text x="144" y="70" text-anchor="middle" font-size="10" font-weight="800" fill="#b91c1c">UPPER</text>
                <rect x="118" y="108" width="52" height="94" rx="12" fill="#dbeafe" stroke="#3b82f6"/><text x="144" y="160" text-anchor="middle" font-size="10" font-weight="800" fill="#1d4ed8">LOWER</text>
                <line x1="104" y1="204" x2="184" y2="204" stroke="#64748b" stroke-width="1.5" stroke-dasharray="4 3"/><text x="190" y="199" font-size="9.5" fill="#64748b">GE junction</text>
                <ellipse cx="144" cy="234" rx="52" ry="26" fill="#f1f5f9" stroke="#cbd5e1"/><text x="144" y="238" text-anchor="middle" font-size="10" fill="#64748b">stomach</text>
                <line x1="170" y1="66" x2="250" y2="66" stroke="#fca5a5" stroke-width="2"/><line x1="170" y1="158" x2="250" y2="158" stroke="#93c5fd" stroke-width="2"/>
                <rect x="250" y="28" width="434" height="84" rx="10" fill="#fef2f2" stroke="#ef4444"/><text x="270" y="56" font-size="13.5" font-weight="800" fill="#b91c1c">Squamous cell carcinoma</text><text x="270" y="78" font-size="11.5" font-weight="800" fill="#0f172a">UPPER oesophagus</text><text x="270" y="99" font-size="10.5" fill="#334155">risk: achalasia · smoking · alcohol</text>
                <rect x="250" y="124" width="434" height="84" rx="10" fill="#eff6ff" stroke="#3b82f6"/><text x="270" y="152" font-size="13.5" font-weight="800" fill="#1d4ed8">Adenocarcinoma</text><text x="270" y="174" font-size="11.5" font-weight="800" fill="#0f172a">LOWER oesophagus</text><text x="270" y="195" font-size="10.5" fill="#334155">risk: Barrett's · GERD · male · 50–60</text>
                <rect x="16" y="262" width="668" height="36" rx="8" fill="#f8fafc" stroke="#cbd5e1"/><text x="350" y="285" text-anchor="middle" font-size="11.5" fill="#334155">progressive dysphagia + weight loss → <tspan font-weight="800" fill="#0f172a">EGD with biopsy</tspan> → CT chest/abdomen for staging</text>
                </g></svg>
                <figcaption>Location is the shortcut: <b>upper = squamous</b> (achalasia, smoking, alcohol), <b>lower = adenocarcinoma</b> (Barrett's, GERD).</figcaption></figure>
                <table>
                    <thead><tr><th>Type</th><th>Location</th><th>Risk factors</th></tr></thead>
                    <tbody>
                        <tr><td>Adenocarcinoma</td><td>Lower esophagus</td><td>Barrett's, GERD, male, 50–60</td></tr>
                        <tr><td>Squamous cell</td><td>Upper esophagus</td><td>Achalasia, smoking, alcohol</td></tr>
                    </tbody>
                </table>
                <p>Progressive dysphagia + weight loss → EGD with biopsy → CT chest/abdomen staging. High-grade dysplasia/non-metastatic → resection; locally advanced → neoadjuvant chemo → surgery; metastatic → palliative.</p>

                
                <div class="topic-deck">
<h4 class="deck-topic">Approach to dysphagia</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Sleeping on the stomach side</li><li>Soft bedding or overheating</li><li>Maternal smoke during pregnancy</li><li>Premature infant or low birth weight</li></ul></div><div class="deck-card mgmt"><span class="deck-card-h">Management</span><ul><li>Place baby on back to sleep (Best strategy)</li><li>Use a firm mattress</li><li>Keep sleeping area separate to the parents but in the same room</li><li>Pacifier at bed time</li></ul></div></div>
<h4 class="deck-topic">Esophageal cancer</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Adenocarcinoma (Lower esophagus) Barret's esophagus, GERD, Male, 50-60 Age</li><li>Squamous cell carcinoma (Upper esophagus) Achalasia, Smoking, Alcohol.</li><li>General signs: Unintentional weight loss, Dyspepsia, Signs of anemia</li><li>Signs of Advanced disease: Progressive dysphagia, retrosternal chest pain, hoarssness</li><li>Cervical lymphadenopathy</li><li>Upper gastrointestinal bleeding: Hematemesis, melena</li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>EGD with biopsy initial and confirmatory test</li><li>Staging CT Chest/Abdomen with IV contrast</li><li>Treatment According to the stage:<ul class="sub"><li>Esophageal resection High grade dysplasia, non-metastasized tumors</li><li>Neoadjuvant chemotherapy Locally advanced disease followed by surgery</li><li>Palliative distant metastatic tumor</li></ul></li></ul></div></div>
<h4 class="deck-topic">Gastric cancer</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>General signs: Unintentional weight loss, loss of appetite, indigestion, Signs of anemia.</li><li>Palpable epigastric tumor, left supraclavicular adenopathy (Virchow node)</li><li>UGIB: Hematemesis, melena</li><li>Signs of gastric outlet obstruction: Vomiting, abdominal pain, early satiety</li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>EGD with biopsy Gold standard</li><li>Staging CT CAP with contrast, PET/CT</li></ul></div></div>
                </div>
<h3>Peptic Ulcer Disease &amp; Perforation</h3>
                <ul>
                    <li>PUD: epigastric/back pain, may bleed → EGD (gold standard)</li>
                    <li><b>Perforated viscus</b>: sudden severe pain + rigidity + rebound + absent bowel sounds; erect CXR → <b>free air under the diaphragm</b> → exploratory laparotomy (duodenal → Graham omental patch; antral → partial distal gastrectomy)</li>
                    <li><b>Gastrinoma (Zollinger-Ellison)</b>: diarrhea + PUD refractory to PPI + positive secretin test; ↑fasting serum gastrin</li>
                </ul>
                <p><b>Gastric cancer</b>: weight loss, anemia, palpable epigastric mass, <b>Virchow's node</b> → EGD with biopsy (gold standard) → CT CAP / PET-CT staging.</p>
            
                
                <div class="topic-deck">
<h4 class="deck-topic">Peptic Ulcer disease</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Definition: UGIB caused by tear at the gastro-esophageal junction</li><li>May be asymptomatic</li><li>Epigastric or backpain</li><li>Hematemesis preceded by forceful or repeated vomiting</li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>Esophagogastroduodenoscopy Gold standard (indicated to all patients)</li><li>If the patient actively bleeding UGIB Treatment</li><li>If the patient not-actively bleeding Conservative management (PPI, antiemetics)</li></ul></div></div>
<h4 class="deck-topic">Perforated Viscus &amp; peritonitis</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Sudden severe abdominal pain (epigastric &amp; radiated to the back incase of PUD)</li><li>Rigidity, Rebound tenderness</li><li>Absent bowel sounds</li><li>Tachycardia, Hypotension</li><li>Erect CXR Free air under diaphragm</li><li>Abdominal X-Ray pneumoperitoneum</li></ul></div><div class="deck-card mgmt"><span class="deck-card-h">Management</span><ul><li>Exploratory laparotomy:<ul class="sub"><li>Duodenal ulcer Omental patch closure</li><li>Antral ulcer Partial distal gastrectomy</li></ul></li></ul></div></div>
                </div>
<section class="topic deck-enrich">
                    <h3>More from the study deck</h3>
                    <p class="deck-intro">Extra material for this step that spans more than one topic above.</p>
<h4 class="deck-topic">Indications of endoscopy</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>New onset of dyspepsia in patient &gt;60 years</li><li>Evidence of GI bleeding (Hematemesis, melena)</li><li>Iron deficiency anemia</li><li>Anorexia or unexplained weight loss</li><li>Persistent vomiting</li><li>Gastrointestinal cancer in 1 st degree relative</li></ul></div></div>
<h4 class="deck-topic">Indications of endoscopy</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>New onset of dyspepsia in patient &gt;60 years</li><li>Evidence of GI bleeding (Hematemesis, melena)</li><li>Iron deficiency anemia</li><li>Anorexia or unexplained weight loss</li><li>Persistent vomiting</li><li>Gastrointestinal cancer in 1 st degree relative</li><li>New onset of dyspepsia in patient &gt;60 years</li><li>Evidence of GI bleeding (Hematemesis, melena)</li><li>Iron deficiency anemia</li><li>Anorexia or unexplained weight loss</li><li>Persistent vomiting</li><li>Gastrointestinal cancer in 1 st degree relative</li></ul></div></div>
                </section>
            `,
            questions: [
                {
                    q: 'After forceful vomiting a patient has retrosternal chest pain and subcutaneous emphysema; the chest X-ray shows a widened mediastinum with pneumomediastinum. What is the diagnosis and the confirmatory test?',
                    options: ['Mallory-Weiss tear — EGD', 'Boerhaave perforation — contrast oesophagography', 'Gastric cancer — EGD with biopsy', 'Peptic ulcer perforation — erect chest X-ray'],
                    answer: 1,
                    explanation: 'The Mackler triad — vomiting, retrosternal chest pain and subcutaneous or mediastinal emphysema — with a widened mediastinum indicates a Boerhaave transmural perforation. Contrast oesophagography demonstrates the leak, and treatment is surgical or endoscopic repair. A Mallory-Weiss tear is only mucosal and is diagnosed at EGD.'
                },
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

                
                <div class="topic-deck">
<div class="deck-block deck-tbl"><div class="deck-cap"><span class="deck-tag tag-tbl">Table</span> Biliary colic vs acute cholecystitis</div><table><thead><tr><th>Feature</th><th>Biliary colic</th><th>Acute cholecystitis</th></tr></thead><tbody><tr><td><b>Pain</b></td><td>Spasmodic central epigastric pain, sometimes felt on the right</td><td>Constant sharp/stabbing RUQ pain; may radiate to right shoulder/back</td></tr><tr><td><b>Fever</b></td><td>No fever (may have tachycardia if pain is severe)</td><td>Fever, tachycardia</td></tr><tr><td><b>Examination</b></td><td>Tender over gallbladder if distended</td><td>RUQ tenderness; Murphy's sign (guarding in RUQ on inspiration)</td></tr></tbody></table></div>
<h4 class="deck-topic">Acute cholecystitis</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>RUQ pain, prolonged (&gt;4 hours) and more severe than biliary colic</li><li>Fever</li><li>Nausea, Vomiting.</li><li>Positive murphy sign</li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>WBC: Leukocytosis</li><li>First line imaging US abdomen (gall stones, pericholecystic fluid, sonographic murphy, gall bladder wall thickening)</li><li>NPO, IV fluid, Analgesia, IV antibiotics</li><li>Laparoscopic cholecystectomy: preferred within 72 hours of symptoms onset</li><li>Percutaneous cholecystostomy: for high risk surgical candidates &amp; acalculous cholecystitis</li></ul></div></div>
                </div>
<h3>Ascending Cholangitis</h3>
                <figure class="deck-fig"><div class="deck-fig-title"><span class="deck-tag tag-fig">Diagram</span> Charcot triad → Reynolds pentad</div>
                <svg viewBox="0 0 700 230" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Charcot triad is fever, right upper quadrant pain and jaundice. Reynolds pentad adds hypotension and altered mental status, indicating severe suppurative cholangitis.">
                <g font-family="system-ui,Arial">
                <rect x="16" y="20" width="330" height="130" rx="12" fill="#fef3c7" stroke="#f59e0b"/><text x="181" y="46" text-anchor="middle" font-size="14" font-weight="800" fill="#b45309">Charcot TRIAD</text>
                <circle cx="60" cy="76" r="13" fill="#f59e0b"/><text x="60" y="81" text-anchor="middle" font-size="12" font-weight="800" fill="#fff">1</text><text x="84" y="81" font-size="12.5" fill="#334155">Fever</text>
                <circle cx="60" cy="106" r="13" fill="#f59e0b"/><text x="60" y="111" text-anchor="middle" font-size="12" font-weight="800" fill="#fff">2</text><text x="84" y="111" font-size="12.5" fill="#334155">RUQ pain</text>
                <circle cx="60" cy="136" r="13" fill="#f59e0b"/><text x="60" y="141" text-anchor="middle" font-size="12" font-weight="800" fill="#fff">3</text><text x="84" y="141" font-size="12.5" fill="#334155">Jaundice</text>
                <text x="330" y="88" text-anchor="end" font-size="24" fill="#94a3b8">→</text>
                <rect x="360" y="20" width="324" height="130" rx="12" fill="#fee2e2" stroke="#ef4444"/><text x="522" y="46" text-anchor="middle" font-size="14" font-weight="800" fill="#b91c1c">Reynolds PENTAD</text>
                <text x="382" y="76" font-size="12" fill="#475569">Charcot triad PLUS:</text>
                <circle cx="400" cy="106" r="13" fill="#ef4444"/><text x="400" y="111" text-anchor="middle" font-size="12" font-weight="800" fill="#fff">4</text><text x="424" y="111" font-size="12.5" font-weight="700" fill="#b91c1c">Hypotension</text>
                <circle cx="400" cy="136" r="13" fill="#ef4444"/><text x="400" y="141" text-anchor="middle" font-size="12" font-weight="800" fill="#fff">5</text><text x="424" y="141" font-size="12.5" font-weight="700" fill="#b91c1c">Altered mental status</text>
                <rect x="16" y="164" width="668" height="50" rx="9" fill="#dbeafe" stroke="#3b82f6"/><text x="350" y="184" text-anchor="middle" font-size="12" font-weight="700" fill="#1d4ed8">Labs: leukocytosis · ↑bilirubin · ↑ALP/GGT — Ultrasound FIRST, then ERCP</text><text x="350" y="204" text-anchor="middle" font-size="11.5" fill="#334155">ERCP is both diagnostic and therapeutic — it decompresses the obstructed duct</text>
                </g></svg>
                <figcaption>Reynolds pentad signals <b>suppurative cholangitis</b> — a septic emergency needing resuscitation, antibiotics and urgent biliary decompression by <b>ERCP</b>.</figcaption></figure>
                <ul>
                    <li><b>Charcot triad</b>: fever + RUQ pain + jaundice · <b>Reynolds pentad</b> adds hypotension + altered mental status</li>
                    <li>Labs: leukocytosis, hyperbilirubinemia, ↑ALP/GGT; US first → <b>ERCP</b> (therapeutic decompression + diagnostic)</li>
                </ul>

                
                <div class="topic-deck">
<h4 class="deck-topic">Ascending cholangitis</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Fever</li><li>RUQ pain</li><li>Jaundice</li><li>Hypotension, Altered mental status + Charcot triad= Raynaud pentad (Indicated sepsis)</li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>Leukocytosis, Hyperbilirubinemia, High ALP &amp; GGT</li><li>US abdomen (first line imaging) gallstones, bile duct dilation</li><li>ERCP: Therapeutic decompression &amp; diagnostic</li></ul></div></div>
                </div>
<h3>Liver Lesions</h3>
                <table>
                    <thead><tr><th>Feature</th><th>Hydatid disease</th><th>Amoebic liver abscess</th></tr></thead>
                    <tbody>
                        <tr><td>Organism</td><td>Echinococcus granulosus</td><td>Entamoeba histolytica</td></tr>
                        <tr><td>Initial treatment</td><td>Albendazole</td><td>Metronidazole</td></tr>
                        <tr><td>Definitive</td><td>Surgical deroofing if ≥5 cm/complicated/daughter cysts</td><td>US/CT percutaneous drainage if &gt;5 cm or septations</td></tr>
                    </tbody>
                </table>

                
                <div class="topic-deck">
<h4 class="deck-topic">Liver diseases</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Organism: Echinococcus granulosus</li><li>Initial treatment Albendazole</li><li>Definitive treatment Surgical deroofing (especially if daughter cyst present) (Large ≥ 5cm, complicated cyst)</li><li>US/CT percutaneous drainage in combination with albendazole &gt;5cm mass or septations</li><li>Organism: Entamoeba Histolytica</li><li>History of travelling to endemic area (India/Mexico)</li><li>Dysentery (Bloody diarrhea)</li><li>CT: Solitary hypodense cystic lesions</li><li>Treatment: Metronidazole</li></ul></div></div>
                </div>
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
            
                
                <div class="topic-deck">
<h4 class="deck-topic">Acute pancreatitis</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Gall stones</li><li>Alcoholic</li><li>Hypertriglyceridemia</li><li>Trauma, medications (Azathioprine, Valporate)</li><li>Severe epigastric pain radiated to the back, improves when leaning forward</li><li>Nausea, Vomiting, Fever</li><li>Jaundice (in biliary pancreatitis)</li><li>Signs of shock: tachycardia, hypotension</li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>Two out of three following criteria should be met to diagnose acute pancreatitis:<ul class="sub"><li>Characteristic abdominal pain</li><li>3 folds or more increase on upper limit of normal serum Amylase or lipase</li><li>Characteristic finding of acute pancreatitis on CT or US</li></ul></li><li>Initial imaging US abdomen.</li><li>Unclear Diagnosis or to assess severity CT abdomen</li></ul></div><div class="deck-card mgmt"><span class="deck-card-h">Management</span><ul><li>IV fluid (Ringer lactate is preferred)</li><li>Management of the underlying cause: (Biliary pancreatitis ERCP &amp; cholecystectomy before discharge)</li><li>Antibiotics NOT used unless a definitive source of infection identified</li><li>Supportive management: (Analgesics, Antiemetics, electrolyte repletion)</li></ul></div></div>
<h4 class="deck-topic">Pancreatitis complications</h4><div class="deck-cards"><div class="deck-card mgmt"><span class="deck-card-h">Management</span><ul><li>Pseudocyst • Homogenous fluid develops after 4 weeks of acute pancreatitis presents with:<ul class="sub"><li>Early satiety, mass on the epigastric area</li><li>Abdominal pain, vomiting</li><li>After recovery from acute pancreatitis</li><li>CT scan Homogenous, well defined collection, thin wall (Initial and best imaging modality)</li><li>Treatment:</li><li>asymptomatic or &lt;6cm or &lt;6 weeks Observation</li><li>&gt;6cm or &gt;6 weeks, growing mass Endoscopic Drainage</li><li>Incase of infected pseudocyst &amp; abscess Percutaneous drainage (Regardless time &amp; size)</li></ul></li><li>Pancreatic abscess:<ul class="sub"><li>systemic symptoms: (fever, leukocytosis, tachycardia)</li><li>CT shows Gas bubbles, heterogenous content, thick &amp; irregular wall</li></ul></li></ul></div></div>
                </div>

            `,
            questions: [
                {
                    q: 'A patient with acute gallstone pancreatitis is admitted. Which statement about initial management is correct?',
                    options: ['IV Ringer lactate is the preferred fluid, and antibiotics are not given unless an infected source is identified', 'Prophylactic antibiotics should be started in every patient', 'Normal saline is preferred and cholecystectomy should be deferred for 6 months', 'CT is the initial imaging of choice in every case'],
                    answer: 0,
                    explanation: 'IV Ringer lactate is the preferred fluid and antibiotics are NOT used unless an infected source is identified. Ultrasound is the initial imaging (CT if unclear or severe), and biliary pancreatitis needs ERCP plus cholecystectomy before discharge.'
                },
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
                <figure class="deck-fig"><div class="deck-fig-title"><span class="deck-tag tag-fig">Diagram</span> Epidural vs subdural haematoma on CT</div>
                <div class="deck-imgrow deck-imgrow--scan">
                    <div class="deck-imgcell">
                        <img class="deck-img" src="/summaries/epidural-haematoma-ct.webp" width="784" height="963" loading="lazy" decoding="async"
                             alt="Axial head CT. An arrow points to a bright, lens-shaped biconvex collection pressed against the inner skull on the patient's left, bulging inward and pushing the brain away." />
                        <p class="deck-imgcap"><b>EPIDURAL</b> (extradural) — <b>LENS-shaped, biconvex</b>
                        <br>middle meningeal <b>ARTERY</b> · LUCID INTERVAL then deterioration
                        <br>temporal fracture common · ipsilateral dilated pupil
                        <br><span class="deck-hi deck-hi--red">arterial — urgent evacuation</span></p>
                    </div>
                    <div class="deck-imgcell">
                        <img class="deck-img" src="/summaries/subdural-haematoma-ct.webp" width="344" height="410" loading="lazy" decoding="async"
                             alt="Axial head CT. Arrows point to a bright crescent-shaped collection that hugs and follows the curve of the inner skull over a long distance, rather than bulging inward." />
                        <p class="deck-imgcap"><b>SUBDURAL</b> — <b>CRESCENT-shaped</b>, follows the skull
                        <br>bridging <b>VEINS</b> · GRADUAL deterioration
                        <br>skull fracture less common · pupil variable
                        <br><span class="deck-hi deck-hi--blue">venous — slower onset</span></p>
                    </div>
                </div>
                <figcaption>The <b>shape</b> settles it on CT: an epidural bleed is stopped by the skull sutures so it bulges inward as a <b>lens</b>; a subdural bleed spreads under the dura and drapes along the skull as a <b>crescent</b>. Head trauma + <b>lucid interval</b> + deteriorating consciousness + a unilateral dilated pupil + temporal fracture = <b>epidural haematoma</b>, an arterial bleed needing urgent evacuation.</figcaption>
                <p class="deck-credit">Epidural CT: <a href="https://commons.wikimedia.org/wiki/File:EpiduralHematoma.jpg" target="_blank" rel="noopener noreferrer">James Heilman, MD</a>, <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener noreferrer">CC BY-SA 4.0</a>. Subdural CT: <a href="https://commons.wikimedia.org/wiki/File:Ct-scan_of_the_brain_with_an_subdural_hematoma.jpg" target="_blank" rel="noopener noreferrer">Lucien Monfils</a>, <a href="https://creativecommons.org/licenses/by-sa/3.0/" target="_blank" rel="noopener noreferrer">CC BY-SA 3.0</a>. Both resized for web; content unmodified.</p></figure>
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
                    q: 'A head CT shows a crescent-shaped extra-axial collection in a patient who has deteriorated gradually. Which vessels have bled?',
                    options: ['Bridging veins', 'The middle meningeal artery', 'The anterior communicating artery', 'The vertebral artery'],
                    answer: 0,
                    explanation: 'A crescent-shaped collection with gradual deterioration is a subdural haematoma from torn bridging veins. An epidural haematoma is lens-shaped (biconvex), arises from the middle meningeal artery and classically follows a lucid interval with a temporal fracture.'
                },
                {
                    q: 'A skull base fracture passes through the optic canal. Which deficit is expected?',
                    options: ['Ipsilateral vocal cord paralysis', 'Ipsilateral facial droop', 'Vision loss', 'Loss of hearing'],
                    answer: 2,
                    explanation: 'The optic canal transmits cranial nerve II and the ophthalmic artery, so injury causes vision loss. The jugular foramen transmits cranial nerves IX, X and XI with the jugular vein, and injury there causes ipsilateral vocal cord paralysis.'
                },
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

                
                <div class="topic-deck">
<h4 class="deck-topic">Fractures</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Urgent reduction</li><li>Pink and warm limb K-wire</li><li>Pale, cold or absent pulse (ischemic limb) surgical exploration</li><li>IV antibiotics then closed reduction</li><li>Irrigation &amp; Surgical debridement (within 24 hours)</li><li>Definitive management: intramedullary nail or external fixation (if extensive soft tissue damage)</li><li>Pain (first sign due to nerve hypoxia) Paresthesia pallor pulselessness paralysis</li><li>Treatment urgent fasciotomy.</li><li>Adult: closed reduction with intramedullary nail</li><li>Children:<ul class="sub"><li>Less than 6 months Pavlik harness</li><li>6 months to 5 years Hip spica</li><li>More than 5 years intramedullary nail</li></ul></li><li>Most common shoulder dislocation anterior dislocation (abduction and external rotation) Posterior shoulder dislocation is common in epileptic patients (adduction and internal rotation)</li><li>Most common Hip dislocation Posterior dislocation (adduction and internal rotation)</li></ul></div></div>
                </div>
<h3>Dislocations</h3>
                <ul>
                    <li><b>Shoulder anterior</b> (abduction + external rotation): most common</li>
                    <li><b>Shoulder posterior</b>: epileptic/electrocution (adduction + internal rotation)</li>
                    <li><b>Hip</b>: posterior (adduction + internal rotation)</li>
                </ul>

                <h3>Nerve Palsy</h3>
                <figure class="deck-fig"><div class="deck-fig-title"><span class="deck-tag tag-fig">Diagram</span> Nerve palsies — deformity &amp; site</div>
                <svg viewBox="0 0 700 235" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Radial nerve injury at the spiral groove causes wrist drop. Median nerve injury at the carpal tunnel causes ape hand. Common peroneal nerve injury at the fibular neck causes foot drop.">
                <g font-family="system-ui,Arial">
                <rect x="14" y="20" width="220" height="196" rx="11" fill="#fee2e2" stroke="#ef4444"/><text x="124" y="46" text-anchor="middle" font-size="13.5" font-weight="800" fill="#b91c1c">Radial</text>
                <path d="M60,74 L60,120 L104,120" fill="none" stroke="#b91c1c" stroke-width="4" stroke-linecap="round"/><path d="M104,120 Q124,124 122,150" fill="none" stroke="#b91c1c" stroke-width="4" stroke-linecap="round"/>
                <text x="124" y="176" text-anchor="middle" font-size="12.5" font-weight="700" fill="#b91c1c">WRIST DROP</text><text x="124" y="200" text-anchor="middle" font-size="11.5" fill="#475569">spiral groove of humerus</text>
                <rect x="244" y="20" width="220" height="196" rx="11" fill="#dbeafe" stroke="#3b82f6"/><text x="354" y="46" text-anchor="middle" font-size="13.5" font-weight="800" fill="#1d4ed8">Median</text>
                <path d="M300,80 L300,132" fill="none" stroke="#1d4ed8" stroke-width="4" stroke-linecap="round"/><path d="M300,132 L340,132 M300,120 L338,116 M300,144 L336,148" fill="none" stroke="#1d4ed8" stroke-width="3.5" stroke-linecap="round"/>
                <text x="354" y="176" text-anchor="middle" font-size="12.5" font-weight="700" fill="#1d4ed8">APE HAND</text><text x="354" y="200" text-anchor="middle" font-size="11.5" fill="#475569">carpal tunnel</text>
                <rect x="474" y="20" width="212" height="196" rx="11" fill="#dcfce7" stroke="#22c55e"/><text x="580" y="46" text-anchor="middle" font-size="13.5" font-weight="800" fill="#15803d">Common peroneal</text>
                <path d="M556,72 L556,128" fill="none" stroke="#15803d" stroke-width="4" stroke-linecap="round"/><path d="M556,128 Q560,152 578,158" fill="none" stroke="#15803d" stroke-width="4" stroke-linecap="round"/>
                <text x="580" y="180" text-anchor="middle" font-size="12.5" font-weight="700" fill="#15803d">FOOT DROP</text><text x="580" y="202" text-anchor="middle" font-size="11.5" fill="#475569">fibular neck</text>
                </g></svg>
                <figcaption>Match the <b>deformity to the site</b>: wrist drop → radial at the spiral groove (classic with a humeral shaft fracture); ape hand → median at the carpal tunnel; foot drop → common peroneal at the fibular neck.</figcaption></figure>
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
            
                
                <div class="topic-deck">
<div class="deck-block deck-tbl"><div class="deck-cap"><span class="deck-tag tag-tbl">Table</span> Nerve palsies — motor &amp; deformity summary</div><table><thead><tr><th></th><th>Common peroneal</th><th>Deep peroneal</th><th>Tibial</th><th>Median</th><th>Radial</th><th>Ulnar</th><th>Axillary</th></tr></thead><tbody><tr><td><b>Muscles</b></td><td>Tibialis anterior</td><td>—</td><td>Gastrocnemius, soleus</td><td>Thenar muscles</td><td>Wrist &amp; finger extensors</td><td>Palmar interossei</td><td>—</td></tr><tr><td><b>Deformity</b></td><td>Foot drop</td><td>—</td><td>—</td><td>Ape hand</td><td>Wrist drop</td><td>Claw hand</td><td>—</td></tr><tr><td><b>Site</b></td><td>Around fibular neck</td><td>Anterior leg</td><td>Posterior aspect of leg</td><td>Carpal tunnel</td><td>Spiral groove of humerus</td><td>Medial aspect of arm</td><td>Surgical neck of humerus</td></tr><tr><td><b>Action lost</b></td><td>—</td><td>Ankle dorsiflexion</td><td>Plantar flexion</td><td>—</td><td>Arm &amp; forearm extension</td><td>Adduction of fingers</td><td>—</td></tr></tbody></table></div>
                </div>

            `,
            questions: [
                {
                    q: 'A patient has a wrist drop after a humeral shaft fracture. Which nerve is injured, and where?',
                    options: ['Radial nerve at the spiral groove of the humerus', 'Ulnar nerve in the medial arm', 'Axillary nerve at the surgical neck', 'Median nerve in the carpal tunnel'],
                    answer: 0,
                    explanation: 'Wrist drop is a radial nerve palsy at the spiral groove of the humerus. Claw hand is ulnar (medial arm), ape hand is median (carpal tunnel), loss of abduction is axillary (surgical neck) and foot drop is common peroneal (fibular neck).'
                },
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
                <figure class="deck-fig"><div class="deck-fig-title"><span class="deck-tag tag-fig">Diagram</span> Paediatric hernias — inguinal vs umbilical</div>
                <svg viewBox="0 0 700 216" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A paediatric inguinal hernia is a groin swelling extending to the scrotum that becomes prominent with crying or coughing and is treated by herniotomy. An umbilical hernia is an umbilical mass covered by skin that reduces when supine and is managed conservatively because 90 percent close by age 2, with surgery only if it has not closed by 4 to 5 years or is larger than 2 centimetres.">
                <g font-family="system-ui,Arial">
                <rect x="16" y="18" width="330" height="182" rx="10" fill="#eff6ff" stroke="#3b82f6"/><rect x="16" y="18" width="330" height="32" rx="10" fill="#3b82f6"/><text x="181" y="40" text-anchor="middle" font-size="13" font-weight="800" fill="#fff">Inguinal hernia</text>
                <rect x="36" y="64" width="74" height="104" rx="14" fill="#fff" stroke="#cbd5e1"/><circle cx="58" cy="144" r="9" fill="#3b82f6"/><ellipse cx="58" cy="166" rx="9" ry="7" fill="#bfdbfe" stroke="#3b82f6"/><text x="73" y="186" text-anchor="middle" font-size="8.5" fill="#64748b">groin → scrotum</text>
                <text x="124" y="88" font-size="10.5" fill="#334155">• groin swelling extending</text><text x="124" y="104" font-size="10.5" fill="#334155">&#160;&#160;to the scrotum</text><text x="124" y="126" font-size="10.5" fill="#334155">• prominent with crying</text><text x="124" y="142" font-size="10.5" fill="#334155">&#160;&#160;or coughing</text><rect x="124" y="156" width="206" height="30" rx="7" fill="#3b82f6"/><text x="227" y="176" text-anchor="middle" font-size="12.5" font-weight="800" fill="#fff">Herniotomy</text>
                <rect x="354" y="18" width="330" height="182" rx="10" fill="#f0fdf4" stroke="#22c55e"/><rect x="354" y="18" width="330" height="32" rx="10" fill="#22c55e"/><text x="519" y="40" text-anchor="middle" font-size="13" font-weight="800" fill="#fff">Umbilical hernia</text>
                <rect x="374" y="64" width="74" height="104" rx="14" fill="#fff" stroke="#cbd5e1"/><circle cx="411" cy="112" r="11" fill="#22c55e"/><text x="411" y="186" text-anchor="middle" font-size="8.5" fill="#64748b">umbilicus</text>
                <text x="462" y="88" font-size="10.5" fill="#334155">• umbilical mass covered</text><text x="462" y="104" font-size="10.5" fill="#334155">&#160;&#160;by skin</text><text x="462" y="126" font-size="10.5" fill="#334155">• reduces when supine</text><rect x="462" y="140" width="206" height="46" rx="7" fill="#22c55e"/><text x="565" y="159" text-anchor="middle" font-size="11" font-weight="800" fill="#fff">Conservative — 90% close by 2 y</text><text x="565" y="176" text-anchor="middle" font-size="10" font-weight="700" fill="#dcfce7">surgery if open at 4–5 y or &gt;2 cm</text>
                </g></svg>
                <figcaption>Inguinal hernias are <b>always repaired</b>; umbilical hernias are <b>watched</b> — most close on their own by age 2.</figcaption></figure>
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
            
                <section class="topic deck-enrich">
                    <h3>Study-deck deep dive</h3>
                    <p class="deck-intro">Every comparison table, animated algorithm and clinical pearl from the high-yield SMLE deck for this topic.</p>
<h4 class="deck-topic">Hernia</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Inguinal Hernia: groin swelling, extended to the scrotum, prominence during increase intra- abdominal pressure (crying, coughing) Herniotomy</li><li>Umbilical hernia: Umbilical mass covered by skin, prominence during increase intra-abdominal pressure (crying, coughing), reduces in recumbent position • Treatment: • Conservative (90% will close spontaneously at age of<ul class="sub"><li>• Surgery:</li><li>No evidence of closure at age of 4-5</li><li>Large umbilical hernia &gt;2cm in &gt;2-3 years old</li></ul></li></ul></div></div>
                </section>
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
                ,
                {
                    q: 'A healthy 1-year-old has a 1 cm umbilical hernia that reduces when supine. What is the correct management?',
                    options: ['Conservative observation — most close by age 2', 'Immediate herniotomy', 'Urgent laparotomy', 'Truss application'],
                    answer: 0,
                    explanation: 'About 90% of umbilical hernias close spontaneously by age 2. Surgery is reserved for failure to close by 4–5 years or a defect >2 cm. In contrast, an inguinal hernia in a child requires herniotomy.'
                },
                {
                    q: 'A 1-year-old boy has a non-palpable undescended testis. What is the next step?',
                    options: ['Diagnostic laparoscopy', 'Immediate scrotal orchidopexy', 'Observation until puberty', 'Hormonal therapy only'],
                    answer: 0,
                    explanation: 'A palpable undescended testis is treated with orchidopexy; a NON-palpable testis requires diagnostic laparoscopy to locate it.'
                },
                {
                    q: 'A 3-year-old has a large abdominal mass arising from the kidney, and imaging shows pulmonary metastases. Most likely diagnosis and management?',
                    options: ['Wilms tumour — nephrectomy plus chemotherapy/radiation', 'Neuroblastoma — observation alone', 'Renal cyst — aspiration', 'Hydronephrosis — stenting'],
                    answer: 0,
                    explanation: 'Wilms tumour presents as a large mass arising from the kidney, and lung metastases are the commonest site of spread. Treatment is nephrectomy with chemotherapy ± radiotherapy.'
                }
            ]
        },
        {
            id: 'surg-plastic',
            title: '13 — Plastic Surgery & Skin',
            title_en: 'Burns & Inhalation Injury · Skin Tumors · Skin Infections · Wound Closure',
            summaryHtml: `
                <h3>Burns &amp; Inhalational Injury</h3>
                <figure class="deck-fig"><div class="deck-fig-title"><span class="deck-tag tag-fig">Diagram</span> Rule of Nines — adult %TBSA</div>
                <svg viewBox="0 0 360 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Adult rule of nines: head 9 percent, each arm 9 percent, anterior torso 18 percent, posterior torso 18 percent, each leg 18 percent, perineum 1 percent.">
                <circle cx="180" cy="42" r="24" fill="#fee2e2" stroke="#ef4444"/><text x="180" y="47" text-anchor="middle" font-size="12" font-weight="700" fill="#b91c1c">9%</text><text x="180" y="16" text-anchor="middle" font-size="10.5" fill="#475569">head</text>
                <rect x="150" y="72" width="60" height="108" rx="10" fill="#fee2e2" stroke="#ef4444"/><text x="180" y="112" text-anchor="middle" font-size="12" font-weight="700" fill="#b91c1c">18%</text><text x="180" y="130" text-anchor="middle" font-size="9.5" fill="#475569">front</text><text x="302" y="120" text-anchor="middle" font-size="9" fill="#475569">back also 18%</text>
                <rect x="112" y="74" width="30" height="98" rx="10" fill="#ffedd5" stroke="#f97316"/><text x="127" y="126" text-anchor="middle" font-size="11" font-weight="700" fill="#c2410c">9%</text>
                <rect x="218" y="74" width="30" height="98" rx="10" fill="#ffedd5" stroke="#f97316"/><text x="233" y="126" text-anchor="middle" font-size="11" font-weight="700" fill="#c2410c">9%</text>
                <rect x="150" y="186" width="26" height="104" rx="10" fill="#dbeafe" stroke="#3b82f6"/><text x="163" y="242" text-anchor="middle" font-size="11" font-weight="700" fill="#1d4ed8">18%</text>
                <rect x="184" y="186" width="26" height="104" rx="10" fill="#dbeafe" stroke="#3b82f6"/><text x="197" y="242" text-anchor="middle" font-size="11" font-weight="700" fill="#1d4ed8">18%</text>
                <text x="270" y="185" text-anchor="middle" font-size="10" fill="#7c3aed" font-weight="700">perineum 1%</text>
                </svg>
                <figcaption>Adult: head <b>9</b>, each arm <b>9</b>, front torso <b>18</b>, back <b>18</b>, each leg <b>18</b>, perineum <b>1</b>. Children have relatively larger heads — use a Lund–Browder chart.</figcaption></figure>
                <p><b>Intubation indications</b>: facial burn · airway swelling/edema · respiratory failure · soot/carbonaceous material in airway · extensive burns · GCS &lt;8.</p>
                <div class="sum-callout"><b>Parkland formula</b> = 4 mL × weight (kg) × %TBSA. Half in the first 8 hours, half over the next 16. Example: 70 kg, both lower limbs (~36%) = 4 × 70 × 36 = 10,080 mL → ~5 L in 8 h + ~5 L over 16 h.</div>

                
                <div class="topic-deck">
<h4 class="deck-topic">Burn / Inhalational injury</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Indications of intubation: (incase of inhalational injury)<ul class="sub"><li>Facial burn</li><li>Airway swelling or edema</li><li>Respiratory failure (Hypoxia / hypercapnia)</li><li>Soot or carbonaceous material in airway</li><li>Extensive burns</li><li>Altered mental status (GCS&gt;8)</li></ul></li></ul></div></div>
                </div>
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

                
                <div class="topic-deck">
<h4 class="deck-topic">Tumors</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Excisional biopsy: if the lesion is small enough (&lt;2cm) to close the defect primarily</li><li>Incisional biopsy: if the lesion is large to close the defect primarily</li><li>Big lesion incisional biopsy, Except:<ul class="sub"><li>&lt;2cm in the body excision</li><li>&lt;1cm in the head excision</li></ul></li><li>Melanoma: • C/P: (ABCDE<ul class="sub"><li>A (Asymmetrical)</li><li>B (Borders) irregular borders &amp; indistinct margins</li><li>C (Color) variety of pigmentation in the same lesion</li><li>D (Diameter) &gt;6mm diameter</li><li>E (Evolving) a lesion that changes in size, color, shape • Diagnosis: Full thickness excisional biopsy. (to assess</li></ul></li><li>Limb sarcoma Core needle biopsy Staging (CT Chest/abdomen/pelvis)</li><li>Basal cell carcinoma MC site is the face</li><li>Liposarcoma MC sites are limbs &amp; retroperitoneum Very large lobulated tumors (&gt;10cm), compress surrounding organs</li><li>Squamous cell carcinoma: pseudoepitheliomatous hyperplasia resembles SCC, so if detected in suspicious chronic lesion repeat biopsy to rule out malignancy</li></ul></div></div>
                </div>
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
            
                <section class="topic deck-enrich">
                    <h3>More from the study deck</h3>
                    <p class="deck-intro">Extra material for this step that spans more than one topic above.</p>
<h4 class="deck-topic">Plastic / skin diseases</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Cellulitis: • Organism: Staphylococcus aureus, streptococcus pyogenes • C/P: progressive redness after minor trauma, fever</li><li>Furuncle Single infected hair follicle</li><li>Carbuncle multiple infected hair follicles with multiple discharging sinuses, common on the neck</li><li>Hidradenitis suppuritiva: chronic infected skin lesions on the areas containing multiple apocrine sweat glands (groin folds, axillae, gluteal cleft)</li><li>Wound closure:<ul class="sub"><li>Open scalp laceration primary closure/suturing</li><li>Injury reached the tendons and nerves primary repair of the structures</li><li>Exposed necrotic skin Debridement and secondary closure or grafting</li><li>Non-healing wound or at risk of non-healing (Diabetic foot ulcer, bed sores) VAC</li></ul></li></ul></div></div>
                </section>
            `,
            questions: [
                {
                    q: 'Which finding in a burns patient is an indication for immediate intubation?',
                    options: ['A blistering burn to the hand', 'Soot or carbonaceous material in the airway', 'Pain requiring opioid analgesia', 'A 5% TBSA burn to one forearm'],
                    answer: 1,
                    explanation: 'Indications for intubation include facial burns, airway swelling or oedema, respiratory failure, soot or carbonaceous material in the airway, extensive burns, and a GCS below 8.'
                },
                {
                    q: 'An elderly patient has a slowly growing pearly papule with overlying telangiectasia on the nose. What is the most likely diagnosis?',
                    options: ['Basal cell carcinoma', 'Melanoma', 'Liposarcoma', 'Hidradenitis suppurativa'],
                    answer: 0,
                    explanation: 'A pearly papule with telangiectasia on the face is the classic description of basal cell carcinoma; the diagnosis is confirmed by biopsy.'
                },
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

                
                <div class="topic-deck">
<h4 class="deck-topic">Pulmonary embolism</h4><div class="deck-cards"><div class="deck-card mgmt"><span class="deck-card-h">Management</span><ul><li>LMWH ( Enoxaparin ) incase of hemodynamic stable P.E.</li><li>Mechanical prophylaxis Incase of High risk bleeding but anticoagulation is required ( major surgery)</li><li>IVC filter incase of DVT/PE &amp; anticoagulation is contraindicated</li><li>Note: incase of Heparin induced thrombocytopenia:<ul class="sub"><li>Stop Heparin</li><li>Start lepirudin , Fondaparinux or DOACs</li></ul></li></ul></div></div>
                </div>
<h3>Post-Operative Infections</h3>
                <figure class="deck-fig"><div class="deck-fig-title"><span class="deck-tag tag-fig">Diagram</span> Intra-abdominal collection — escalation by size and stability</div>
                <svg viewBox="0 0 700 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A small intra-abdominal collection is treated with antibiotics. A collection of 4 by 4 centimetres or more needs percutaneous drainage. Multiple collections need laparoscopy. An unstable patient needs laparotomy.">
                <g font-family="system-ui,Arial">
                <text x="16" y="18" font-size="10.5" font-weight="700" fill="#94a3b8">more invasive ▲</text>
                <rect x="16" y="112" width="158" height="112" rx="10" fill="#f0fdf4" stroke="#22c55e"/><circle cx="95" cy="136" r="14" fill="#22c55e"/><text x="95" y="141" text-anchor="middle" font-size="14" font-weight="800" fill="#fff">1</text><text x="95" y="171" text-anchor="middle" font-size="10.5" font-weight="700" fill="#0f172a">collection (small)</text><line x1="36" y1="188" x2="154" y2="188" stroke="#bbf7d0" stroke-width="1.5"/><text x="95" y="209" text-anchor="middle" font-size="11" font-weight="800" fill="#15803d">ANTIBIOTICS</text>
                <rect x="186" y="84" width="158" height="112" rx="10" fill="#eff6ff" stroke="#3b82f6"/><circle cx="265" cy="108" r="14" fill="#3b82f6"/><text x="265" y="113" text-anchor="middle" font-size="14" font-weight="800" fill="#fff">2</text><text x="265" y="143" text-anchor="middle" font-size="10.5" font-weight="700" fill="#0f172a">collection ≥ 4 × 4</text><line x1="206" y1="160" x2="324" y2="160" stroke="#bfdbfe" stroke-width="1.5"/><text x="265" y="178" text-anchor="middle" font-size="11" font-weight="800" fill="#1d4ed8">PERCUTANEOUS</text><text x="265" y="192" text-anchor="middle" font-size="11" font-weight="800" fill="#1d4ed8">DRAINAGE</text>
                <rect x="356" y="56" width="158" height="112" rx="10" fill="#fffbeb" stroke="#f59e0b"/><circle cx="435" cy="80" r="14" fill="#f59e0b"/><text x="435" y="85" text-anchor="middle" font-size="14" font-weight="800" fill="#fff">3</text><text x="435" y="109" text-anchor="middle" font-size="10.5" font-weight="700" fill="#0f172a">multiple</text><text x="435" y="125" text-anchor="middle" font-size="10.5" font-weight="700" fill="#0f172a">collections</text><line x1="376" y1="136" x2="494" y2="136" stroke="#fde68a" stroke-width="1.5"/><text x="435" y="155" text-anchor="middle" font-size="11" font-weight="800" fill="#b45309">LAPAROSCOPY</text>
                <rect x="526" y="28" width="158" height="112" rx="10" fill="#fef2f2" stroke="#ef4444"/><circle cx="605" cy="52" r="14" fill="#ef4444"/><text x="605" y="57" text-anchor="middle" font-size="14" font-weight="800" fill="#fff">4</text><text x="605" y="81" text-anchor="middle" font-size="10.5" font-weight="800" fill="#b91c1c">UNSTABLE</text><text x="605" y="97" text-anchor="middle" font-size="10.5" font-weight="700" fill="#0f172a">patient</text><line x1="546" y1="108" x2="664" y2="108" stroke="#fecaca" stroke-width="1.5"/><text x="605" y="127" text-anchor="middle" font-size="11" font-weight="800" fill="#b91c1c">LAPAROTOMY</text>
                </g></svg>
                <figcaption>Size and stability choose the rung. <b>Haemodynamic instability skips straight to laparotomy</b>, whatever the imaging shows.</figcaption></figure>
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

                
                <div class="topic-deck">
<div class="deck-block deck-tbl"><div class="deck-cap"><span class="deck-tag tag-tbl">Table</span> Post-operative infections — management</div><table><thead><tr><th>Complication</th><th>Management</th></tr></thead><tbody><tr><td><b>Surgical site infection (SSI)</b></td><td>Open the wound → CT to assess deep infection → percutaneous drainage under imaging</td></tr><tr><td><b>Wound abscess</b></td><td>Incision and drainage</td></tr><tr><td><b>Seroma (common after hernia repair; swelling without pain/fever/leukocytosis)</b></td><td>Wound exploration &amp; irrigation; leave wound open to prevent re-accumulation; regular dressing</td></tr><tr><td><b>Intra-abdominal collection</b></td><td>Small → antibiotics; ≥4×4 cm → percutaneous drainage; multiple collections → laparoscopy; unstable → laparotomy</td></tr></tbody></table></div>
<h4 class="deck-topic">Post operative fever</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Sleeping on the stomach side</li><li>Soft bedding or overheating</li><li>Maternal smoke during pregnancy</li><li>Premature infant or low birth weight</li></ul></div><div class="deck-card mgmt"><span class="deck-card-h">Management</span><ul><li>Place baby on back to sleep (Best strategy)</li><li>Use a firm mattress</li><li>Keep sleeping area separate to the parents but in the same room</li><li>Pacifier at bed time</li></ul></div></div>
                </div>
<h3>High-Yield Post-Op Pitfalls</h3>
                <ul>
                    <li><b>Surgical emphysema after ERCP</b>: duodenal perforation → retroperitoneal air tracking to chest/neck</li>
                    <li><b>Subphrenic abscess</b>: post-op RUQ/LUQ pain worse on inspiration, hiccups, fever; common after splenectomy</li>
                    <li><b>Massive transfusion</b>: bleeding from incision/NGT/venipuncture sites → dilutional thrombocytopenia (stored blood lacks functional platelets)</li>
                </ul>
            
                
            `,
            questions: [
                {
                    q: 'A stable post-operative patient has a single 5 × 5 cm intra-abdominal collection on CT. What is the appropriate management?',
                    options: ['Antibiotics alone', 'Laparoscopy', 'Percutaneous drainage', 'Laparotomy'],
                    answer: 2,
                    explanation: 'A small collection is treated with antibiotics; a collection of 4 × 4 cm or larger needs percutaneous drainage. Multiple collections need laparoscopy, and an unstable patient needs laparotomy.'
                },
                {
                    q: 'A post-operative patient on heparin develops thrombocytopenia consistent with heparin-induced thrombocytopenia. What is the correct management?',
                    options: ['Continue heparin at a lower dose', 'Stop heparin and start lepirudin, fondaparinux or a DOAC', 'Stop heparin and give a platelet transfusion', 'Switch to a higher dose of unfractionated heparin'],
                    answer: 1,
                    explanation: 'In HIT the heparin must be stopped and an alternative anticoagulant started — lepirudin, fondaparinux or a DOAC.'
                },
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
                <figure class="deck-fig"><div class="deck-fig-title"><span class="deck-tag tag-fig">Diagram</span> Shock types — CO, SVR &amp; skin</div>
                <svg viewBox="0 0 700 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Hypovolaemic, cardiogenic and obstructive shock: low cardiac output, high SVR, cold skin. Septic distributive shock: high cardiac output, low SVR, warm skin.">
                <g font-family="system-ui,Arial">
                <rect x="18" y="24" width="158" height="150" rx="10" fill="#eff6ff" stroke="#bfdbfe"/><text x="97" y="48" text-anchor="middle" font-size="13" font-weight="700" fill="#1d4ed8">Hypovolaemic</text><text x="97" y="80" text-anchor="middle" font-size="12" fill="#334155">CO ↓↓ · SVR ↑</text><text x="97" y="104" text-anchor="middle" font-size="12" fill="#334155">CVP ↓</text><text x="97" y="150" text-anchor="middle" font-size="11" font-weight="700" fill="#2563eb">cold · haemorrhage</text>
                <rect x="184" y="24" width="158" height="150" rx="10" fill="#eff6ff" stroke="#bfdbfe"/><text x="263" y="48" text-anchor="middle" font-size="13" font-weight="700" fill="#1d4ed8">Cardiogenic</text><text x="263" y="80" text-anchor="middle" font-size="12" fill="#334155">CO ↓↓ · SVR ↑</text><text x="263" y="104" text-anchor="middle" font-size="12" fill="#334155">CVP ↑</text><text x="263" y="150" text-anchor="middle" font-size="11" font-weight="700" fill="#2563eb">cold · pump failure</text>
                <rect x="350" y="24" width="158" height="150" rx="10" fill="#fef2f2" stroke="#fecaca"/><text x="429" y="48" text-anchor="middle" font-size="13" font-weight="700" fill="#b91c1c">Distributive (septic)</text><text x="429" y="80" text-anchor="middle" font-size="12" fill="#334155">CO ↑ · SVR ↓↓</text><text x="429" y="104" text-anchor="middle" font-size="12" fill="#334155">CVP ↓</text><text x="429" y="150" text-anchor="middle" font-size="11" font-weight="700" fill="#dc2626">warm · vasodilation</text>
                <rect x="516" y="24" width="166" height="150" rx="10" fill="#eff6ff" stroke="#bfdbfe"/><text x="599" y="48" text-anchor="middle" font-size="13" font-weight="700" fill="#1d4ed8">Obstructive</text><text x="599" y="80" text-anchor="middle" font-size="12" fill="#334155">CO ↓ · SVR ↑</text><text x="599" y="104" text-anchor="middle" font-size="12" fill="#334155">JVP ↑↑</text><text x="599" y="150" text-anchor="middle" font-size="10.5" font-weight="700" fill="#2563eb">PE · tamponade · tension PTX</text>
                </g></svg>
                <figcaption>Only <b>distributive/septic</b> shock is <b>warm</b> with <b>high CO / low SVR</b>; the others are cold with low CO and high SVR. Obstructive → look for ↑JVP.</figcaption></figure>
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

                
                <div class="topic-deck">
<div class="deck-block deck-tbl"><div class="deck-cap"><span class="deck-tag tag-tbl">Table</span> Classification of shock</div><table><thead><tr><th>Type</th><th>Mechanism</th><th>Causes / examples</th></tr></thead><tbody><tr><td><b>Distributive</b></td><td>↓ vascular tone; vasodilation &amp; capillary leak</td><td>Septic; anaphylactic / anaphylactoid; neurogenic</td></tr><tr><td><b>Hypovolaemic</b></td><td>Loss of intravascular volume</td><td>Haemorrhagic (blood loss); non-haemorrhagic (GI fluid loss, plasma loss in burns)</td></tr><tr><td><b>Cardiogenic</b></td><td>Pump failure (↓ cardiac output)</td><td>Myocardial (MI), arrhythmias, valvular heart disease</td></tr><tr><td><b>Obstructive</b></td><td>Impaired filling / obstruction to output</td><td>Cardiac tamponade, massive PE, tension pneumothorax</td></tr></tbody></table></div>
<h4 class="deck-topic">Shock</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Distributive shock (Septic, Neurogenic shock) peripheral vasodilation (Low peripheral resistance) which increase blood flow to the skin → Warm extremities.</li><li>Neurogenic shock → common after spinal cord trauma, Hypotension without reflex tachycardia, focal neurological deficit</li><li>Septic shock: suspected source of infection, hypotension with reflex tachycardia, high cardiac output</li><li>Cardiac tamponade: • Beck's triad: Hypotension, muffled heart sound, distended VJP • Treatment:<ul class="sub"><li>Unstable → pericardiocentesis</li><li>Stable → Treat the underlying cause</li></ul></li></ul></div></div>
                </div>
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
                    q: 'A hypotensive patient has warm extremities, a high cardiac output and a reflex tachycardia. Which type of shock is this?',
                    options: ['Hypovolaemic shock', 'Septic (distributive) shock', 'Cardiogenic shock', 'Obstructive shock'],
                    answer: 1,
                    explanation: 'Septic shock is distributive: vasodilation lowers systemic resistance, giving warm extremities, hypotension with a reflex tachycardia and a high output. Hypovolaemic and cardiogenic shock both produce a low output with cold, clammy skin; neurogenic shock also gives warm extremities but WITHOUT a reflex tachycardia.'
                },
                {
                    q: 'A patient has sepsis and remains hypotensive despite adequate fluid resuscitation. Which term describes this state?',
                    options: ['SIRS', 'Sepsis', 'Severe sepsis', 'Septic shock'],
                    answer: 3,
                    explanation: 'SIRS is the systemic inflammatory response; sepsis is SIRS plus a suspected source of infection; severe sepsis adds organ dysfunction; septic shock is sepsis with hypotension that persists despite fluid resuscitation.'
                },
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
                <figure class="deck-fig"><div class="deck-fig-title"><span class="deck-tag tag-fig">Diagram</span> Penetrating neck trauma — zones</div>
                <svg viewBox="0 0 480 260" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Zone I from clavicle to cricoid, zone II from cricoid to angle of mandible, zone III from angle of mandible to skull base.">
                <rect x="70" y="30" width="150" height="56" fill="#ede9fe" stroke="#c4b5fd"/><text x="145" y="63" text-anchor="middle" font-size="15" font-weight="800" fill="#6d28d9">III</text><text x="240" y="55" font-size="12" font-weight="700" fill="#6d28d9">Zone III</text><text x="240" y="72" font-size="10.5" fill="#475569">mandible angle → skull base</text>
                <rect x="70" y="86" width="150" height="82" fill="#dcfce7" stroke="#86efac"/><text x="145" y="133" text-anchor="middle" font-size="15" font-weight="800" fill="#15803d">II</text><text x="240" y="123" font-size="12" font-weight="700" fill="#15803d">Zone II</text><text x="240" y="140" font-size="10.5" fill="#475569">cricoid → mandible (most common)</text>
                <rect x="70" y="168" width="150" height="56" fill="#fee2e2" stroke="#fca5a5"/><text x="145" y="201" text-anchor="middle" font-size="15" font-weight="800" fill="#b91c1c">I</text><text x="240" y="193" font-size="12" font-weight="700" fill="#b91c1c">Zone I</text><text x="240" y="210" font-size="10.5" fill="#475569">clavicle → cricoid</text>
                <text x="145" y="22" text-anchor="middle" font-size="10.5" fill="#64748b">↑ skull base</text><text x="145" y="240" text-anchor="middle" font-size="10.5" fill="#64748b">↓ clavicle</text>
                </svg>
                <figcaption><b>Zone II</b> (cricoid → mandible angle) is most common and surgically accessible. Stable zone I/III → CT angiography; unstable or hard signs → surgical exploration.</figcaption></figure>
                <table>
                    <thead><tr><th>Zone</th><th>Boundaries</th><th>Management</th></tr></thead>
                    <tbody>
                        <tr><td>I</td><td>Below cricoid</td><td>CT-angio; vascular → endovascular; aerodigestive → open repair</td></tr>
                        <tr><td>II</td><td>Cricoid to angle of mandible</td><td>Symptomatic (bleeding) → open repair (most dangerous); asymptomatic → observe</td></tr>
                        <tr><td>III</td><td>Above angle of mandible</td><td>Symptomatic → CT-angio → endovascular repair</td></tr>
                    </tbody>
                </table>
                <p>Unstable (any zone): expanding hematoma / uncontrolled hemorrhage → artery ligation.</p>

                
                <div class="topic-deck">
<h4 class="deck-topic">Neck trauma</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Zone I CT-angio Vascular injury detected Endovascular Bronchogram or esophagogram injury detected Open repair</li><li>Zone III Symptomatic (Bleeding or other symptoms) CT-angio Vascular injury detected endovascular repair</li><li>Zone II Symptomatic (Bleeding or other symptoms) Open repair (most dangerous area)</li><li>Zone II or III asymptomatic Observation</li><li>Unstable injury (Expanding hematoma, uncontrolled hemorrhage) artery ligation (in all zones)</li></ul></div></div>
                </div>
<h3>Chest Trauma</h3>
                <ul>
                    <li><b>Tension pneumothorax</b>: hyperresonance, decreased breath sounds, tracheal shift away, raised JVP, hypotension → needle decompression → chest tube</li>
                    <li><b>Flail chest</b>: multiple rib fractures + paradoxical breathing → supportive (analgesia, ventilation)</li>
                    <li><b>Emergency thoracotomy</b>: initial chest tube &gt;1500 mL · 200–300 mL/hr for 4 h · decompensation after stabilization</li>
                </ul>

                
                <div class="topic-deck">
<h4 class="deck-topic">Chest trauma</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Tension pneumothorax: Hyperresonance chest, decrease breath sound on the same side, tracheal shifting to opposite side, Raised JVP, hypotension. Treatment Intubate (if indicated) needle decompression chest tube</li><li>Flail chest Multiple rib fractures + Paradoxical breathing Treatment supportive (analgesia, assisted ventilation)</li><li>Indications of emergency thoracotomy<ul class="sub"><li>Initial chest tube output of &gt;1500ml blood</li><li>Drainage of 200-300 ml/hr for 4 hours</li><li>Patients who decompensate after initial stabilization</li></ul></li></ul></div></div>
                </div>
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
            
                
                <div class="topic-deck">
<h4 class="deck-topic">Abdominal trauma</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Stable patient CT abdomen • Unstable patient: Stab or blunt? • Stab Laparotomy • Blunt FAST (assesses for presence of intraperitoneal free fluid)</li><li>Approach to management after FAST: • Stable &amp; Positive CT • Stable &amp; negative Routine examination • Unstable &amp; positive Laparotomy • Unstable &amp; negative Diagnostic peritoneal lavage (DPL)</li><li>Indication of laparotomy:<ul class="sub"><li>Positive CT findings or positive FAST (if unstable)</li><li>Omentum is seen</li><li>Evisceration</li><li>Peritonitis</li></ul></li><li>Hepatic injury: Stable Conservative treatment Unstable Perihepatic packing resection or angioembolization (if packing failed)</li><li>Splenic injury<ul class="sub"><li>Stable Conservative treatment</li><li>Unstable Splenectomy</li></ul></li></ul></div></div>
                </div>
<section class="topic deck-enrich">
                    <h3>More from the study deck</h3>
                    <p class="deck-intro">Extra material for this step that spans more than one topic above.</p>
<h4 class="deck-topic">ABC</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>A: Airway Indication of intubation: O2 saturation &lt;88%, GCS 8≥, Unconscious, at risk of aspiration (profuse oral bleeding or secretions) endotracheal intubation Indication of intubation + Facial injury (mandibular fracture) cricothyroidotomy</li><li>B: Breathing Tension Pneumothorax: Intubation needle decompression</li><li>C: Circulation IV fluid and circulation control stop bleeding direct pressure on the wound, Pelvic binder.</li><li>D: Disabilities proceed to imaging no disabilities CT scan most appropriate imaging to clear spine injury</li></ul></div></div>
                </section>
            `,
            questions: [
                {
                    q: 'A haemodynamically unstable patient after blunt abdominal trauma has a negative FAST scan. What is the next step?',
                    options: ['CT of the abdomen', 'Immediate laparotomy', 'Diagnostic peritoneal lavage', 'Routine examination and observation'],
                    answer: 2,
                    explanation: 'Unstable with a positive FAST means laparotomy; unstable with a negative FAST means diagnostic peritoneal lavage. A stable patient goes to CT.'
                },
                {
                    q: 'A chest tube inserted for a traumatic haemothorax drains 1,800 mL immediately. What does this indicate?',
                    options: ['Emergency thoracotomy is indicated', 'The tube should be clamped and the patient observed', 'A second chest tube should be inserted', 'The patient can be managed with analgesia alone'],
                    answer: 0,
                    explanation: 'Emergency thoracotomy is indicated for an initial chest tube output above 1,500 mL, an ongoing output of 200–300 mL/hr for 4 hours, or decompensation after initial stabilisation.'
                },
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
                <figure class="deck-fig"><div class="deck-fig-title"><span class="deck-tag tag-fig">Diagram</span> The ligament of Treitz divides upper from lower</div>
                <svg viewBox="0 0 700 250" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Upper GI bleeding is proximal to the ligament of Treitz causing haematemesis and melena with a raised BUN to creatinine ratio, investigated by EGD. Lower GI bleeding is distal, causing haematochezia with a normal BUN to creatinine ratio, investigated by colonoscopy.">
                <g font-family="system-ui,Arial">
                <line x1="350" y1="20" x2="350" y2="236" stroke="#8b5cf6" stroke-width="4" stroke-dasharray="8 5"/>
                <rect x="238" y="112" width="224" height="30" rx="8" fill="#ede9fe" stroke="#8b5cf6"/><text x="350" y="132" text-anchor="middle" font-size="12" font-weight="800" fill="#6d28d9">Ligament of Treitz</text>
                <rect x="14" y="24" width="316" height="76" rx="10" fill="#fee2e2" stroke="#ef4444"/><text x="172" y="48" text-anchor="middle" font-size="13.5" font-weight="800" fill="#b91c1c">UPPER GI bleed (proximal)</text><text x="172" y="70" text-anchor="middle" font-size="11.5" fill="#334155">haematemesis · coffee-ground · melena</text><text x="172" y="90" text-anchor="middle" font-size="11.5" font-weight="700" fill="#b91c1c">↑ BUN:creatinine &gt;20–30:1</text>
                <rect x="14" y="154" width="316" height="82" rx="10" fill="#fef2f2" stroke="#fca5a5"/><text x="172" y="176" text-anchor="middle" font-size="11.5" font-weight="700" fill="#b91c1c">Commonest: peptic ulcer disease</text><text x="172" y="196" text-anchor="middle" font-size="11" fill="#475569">varices · Mallory-Weiss · Dieulafoy</text><text x="172" y="222" text-anchor="middle" font-size="11.5" font-weight="700" fill="#334155">EGD within 24 h</text>
                <rect x="370" y="24" width="316" height="76" rx="10" fill="#dbeafe" stroke="#3b82f6"/><text x="528" y="48" text-anchor="middle" font-size="13.5" font-weight="800" fill="#1d4ed8">LOWER GI bleed (distal)</text><text x="528" y="70" text-anchor="middle" font-size="11.5" fill="#334155">haematochezia (bright red PR)</text><text x="528" y="90" text-anchor="middle" font-size="11.5" font-weight="700" fill="#1d4ed8">BUN:creatinine usually normal</text>
                <rect x="370" y="154" width="316" height="82" rx="10" fill="#eff6ff" stroke="#93c5fd"/><text x="528" y="176" text-anchor="middle" font-size="11.5" font-weight="700" fill="#1d4ed8">Commonest: diverticulosis</text><text x="528" y="196" text-anchor="middle" font-size="11" fill="#475569">angiodysplasia in the elderly</text><text x="528" y="222" text-anchor="middle" font-size="11.5" font-weight="700" fill="#334155">colonoscopy after resuscitation</text>
                </g></svg>
                <figcaption>A raised <b>BUN:creatinine ratio</b> betrays an upper source — digested blood is absorbed protein. Resuscitate first; scope second.</figcaption></figure>
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
                    q: 'A patient presents with melena and a BUN-to-creatinine ratio above 30:1. Where is the bleeding, and what is the most common cause?',
                    options: ['Distal to the ligament of Treitz — diverticulosis', 'Proximal to the ligament of Treitz — peptic ulcer disease', 'Distal to the ligament of Treitz — angiodysplasia', 'Proximal to the ligament of Treitz — Mallory-Weiss tear'],
                    answer: 1,
                    explanation: 'A raised BUN:creatinine ratio with melena indicates an upper GI bleed, which by definition is proximal to the ligament of Treitz; peptic ulcer disease is the most common cause. Lower GI bleeding presents with haematochezia, a usually normal BUN:creatinine ratio, and is most often diverticular.'
                },
                {
                    q: 'A patient with portal hypertension has bleeding oesophageal varices confirmed at endoscopy. Which management is appropriate?',
                    options: ['PPI infusion alone', 'Sclerotherapy plus warfarin', 'Band ligation with octreotide and prophylactic antibiotics', 'Immediate splenectomy'],
                    answer: 2,
                    explanation: 'Bleeding oesophageal varices are treated with band ligation (fundal varices with sclerotherapy), together with octreotide and prophylactic antibiotics. A PPI infusion plus endoscopic therapy is the treatment for a bleeding peptic ulcer.'
                },
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
                <figure class="deck-fig"><div class="deck-fig-title"><span class="deck-tag tag-fig">Diagram</span> The acute scrotum — three causes</div>
                <svg viewBox="0 0 700 220" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Testicular torsion shows a high-riding horizontal testis with absent cremasteric reflex and absent Doppler flow, requiring immediate surgery. Appendage torsion shows a blue-dot sign treated conservatively. Epididymo-orchitis shows increased Doppler vascularity treated with antibiotics.">
                <g font-family="system-ui,Arial">
                <rect x="14" y="20" width="220" height="150" rx="11" fill="#fee2e2" stroke="#ef4444"/><text x="124" y="46" text-anchor="middle" font-size="13.5" font-weight="800" fill="#b91c1c">Torsion</text><text x="124" y="72" text-anchor="middle" font-size="11.5" fill="#334155">sudden SEVERE pain</text><text x="124" y="94" text-anchor="middle" font-size="11.5" fill="#334155">high-riding, horizontal</text><text x="124" y="116" text-anchor="middle" font-size="11.5" font-weight="700" fill="#b91c1c">absent cremasteric reflex</text><text x="124" y="138" text-anchor="middle" font-size="11.5" font-weight="700" fill="#b91c1c">Doppler: NO flow</text><text x="124" y="160" text-anchor="middle" font-size="11" font-weight="700" fill="#b91c1c">→ THEATRE, no imaging delay</text>
                <rect x="244" y="20" width="212" height="150" rx="11" fill="#dbeafe" stroke="#3b82f6"/><text x="350" y="46" text-anchor="middle" font-size="13.5" font-weight="800" fill="#1d4ed8">Appendage torsion</text><text x="350" y="76" text-anchor="middle" font-size="11.5" fill="#334155">pain &lt;1 day, UPPER pole</text><circle cx="350" cy="104" r="11" fill="#1d4ed8"/><text x="350" y="130" text-anchor="middle" font-size="11.5" font-weight="700" fill="#1d4ed8">"BLUE DOT" sign</text><text x="350" y="158" text-anchor="middle" font-size="11" font-weight="700" fill="#1d4ed8">→ conservative (NSAID)</text>
                <rect x="466" y="20" width="220" height="150" rx="11" fill="#dcfce7" stroke="#22c55e"/><text x="576" y="46" text-anchor="middle" font-size="13.5" font-weight="800" fill="#15803d">Epididymo-orchitis</text><text x="576" y="76" text-anchor="middle" font-size="11.5" fill="#334155">pain &lt;1 day, oedematous</text><text x="576" y="100" text-anchor="middle" font-size="11.5" fill="#334155">cremasteric reflex present</text><text x="576" y="126" text-anchor="middle" font-size="11.5" font-weight="700" fill="#15803d">Doppler: ↑ vascularity</text><text x="576" y="158" text-anchor="middle" font-size="11" font-weight="700" fill="#15803d">→ antibiotics + NSAID</text>
                <rect x="14" y="182" width="672" height="30" rx="8" fill="#fef3c7" stroke="#f59e0b"/><text x="350" y="202" text-anchor="middle" font-size="11.5" font-weight="700" fill="#b45309">Doppler flow is the discriminator — but never delay surgery for imaging when torsion is suspected</text>
                </g></svg>
                <figcaption>Absent flow and an absent cremasteric reflex mean <b>torsion</b> — explore immediately (salvage &gt;90% within 6 hours). Increased flow points to infection.</figcaption></figure>
                <table>
                    <thead><tr><th>Condition</th><th>Features</th><th>Management</th></tr></thead>
                    <tbody>
                        <tr><td>Testicular torsion</td><td>Severe pain, horizontal high-riding testis, absent cremasteric reflex; Doppler absent flow</td><td>Surgical exploration (no imaging delay if suspected)</td></tr>
                        <tr><td>Appendage torsion</td><td>Pain &lt;1 day at upper pole, blue-dot sign</td><td>Conservative (NSAID)</td></tr>
                        <tr><td>Epididymo-orchitis</td><td>Pain &lt;1 day, edematous testis; Doppler ↑vascularity</td><td>Antibiotics + NSAID</td></tr>
                    </tbody>
                </table>

                
                <div class="topic-deck">
<div class="deck-block deck-tbl"><div class="deck-cap"><span class="deck-tag tag-tbl">Table</span> Testicular diseases — comparison</div><table><thead><tr><th>Disease</th><th>Clinical presentation</th><th>Diagnosis</th><th>Treatment</th></tr></thead><tbody><tr><td><b>Testicular torsion</b></td><td>Severe testicular pain, tenderness, horizontal high-riding testis, absent cremasteric reflex</td><td>Clinical diagnosis; US Doppler (if uncertain) → absent blood flow</td><td>Surgical exploration (without imaging when torsion suspected)</td></tr><tr><td><b>Testicular appendage torsion</b></td><td>Pain &lt;1 day at upper pole, vertical position, 'blue dot' sign</td><td>US Doppler → decreased vascularity</td><td>Conservative (NSAIDs)</td></tr><tr><td><b>Epididymo-orchitis</b></td><td>Pain &lt;1 day, oedematous testis</td><td>US Doppler → increased vascularity</td><td>Antibiotics + pain management (NSAIDs)</td></tr></tbody></table></div>
<h4 class="deck-topic">Testicular diseases</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Symptoms:<ul class="sub"><li>Painless, bilateral scrotal swelling and redness</li><li>Extension to both groins</li><li>No tenderness • Diagnosis &amp; Treatment:</li><li>Clinical diagnosis or US (if uncertain)</li><li>Supportive treatment</li></ul></li><li>Palpable testis outside the scrotum → orchidopexy</li><li>Non-palpable testis outside the scrotum → Diagnostic laparoscopy</li></ul></div></div>
                </div>
<h3>Renal Stones &amp; Urethral Injury</h3>
                <ul>
                    <li><b>Renal colic</b>: severe unilateral colicky flank pain + hematuria + unable to sit still → <b>CT abdomen/pelvis WITHOUT contrast</b> (first-line)</li>
                    <li><b>Uric acid stones</b>: radiolucent on X-ray, acoustic shadowing on US (tumors/clots/sloughed papilla do NOT shadow)</li>
                    <li><b>Urethral injury</b>: membranous urethra most susceptible; blood at meatus → retrograde urethrogram → <b>suprapubic catheter</b> (Foley contraindicated)</li>
                </ul>

                
                <div class="topic-deck">
<h4 class="deck-topic">Renal stones</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Severe unilateral colicky flank pain</li><li>Hematuria, dysuria</li><li>Nausea/Vomiting • Unable to sit, still move around frequently</li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>First line imaging → CT abdomen and pelvis without contrast (used also to evaluate renal masses)</li><li>Non-palpable testis outside the scrotum → Diagnostic laparoscopy</li></ul></div></div>
                </div>
<h3>BPH &amp; Prostate Cancer</h3>
                <div class="sum-callout">
                    <b>BPH algorithm</b>: LUTS (retention, hematuria) → diagnosis by US; acute retention → Foley + urine culture; medical → alpha-blocker (initial); definitive → TURP.
                </div>
                <p><b>Prostate cancer</b>: LUTS + constitutional + metastatic symptoms; most common metastasis site is the <b>spine</b> (back pain + urinary symptoms in an elderly man). <b>Overflow incontinence</b>: bladder fills beyond capacity and leaks small amounts (secondary to obstruction as in BPH).</p>
            
                <section class="topic deck-enrich">
                    <h3>More from the study deck</h3>
                    <p class="deck-intro">Extra material for this step that spans more than one topic above.</p>
<h4 class="deck-topic">Urology</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Urethral diseases: • Most susceptible part of urethral injury → Membranous urethra • Urethral injury → retrograde urethrogram → suprapubic catheter (to allow bladder drainage without using the injured urethra) • Foley catheter C/I in urethral injury</li><li>Autosomal dominant polycystic kidney disease (ADPKD) • Symptoms:<ul class="sub"><li>Recurrent UTI, Hematuria</li><li>Back or side pain</li><li>Abdominal distension • US: Bilateral multiple, anechoic, round renal cysts throughout the parenchyma</li></ul></li><li>Benign prostatic hyperplasia (BPH) • Symptoms: Lower urinary tract symptoms: Urinary retention, hematuria. • Diagnosis: US • Treatment:<ul class="sub"><li>In urine retention → Foley catheterization &amp; urine culture (to rule out UTI)</li><li>Alpha blocker therapy → initial treatment</li><li>Trans-urethral resection of the prostate → Definitive treatment</li></ul></li><li>Prostate cancer: • Symptoms:<ul class="sub"><li>Lower urinary tract symptoms: Urinary retention, hematuria.</li><li>Constitutional symptoms</li><li>Metastatic symptoms: Bone pain, Lymphedema</li></ul></li><li>Note: Most common site of prostate cancer metastasis → Spine • Back pain + Urinary symptoms (Think about metastasized prostate cancer)</li></ul></div></div>
                </section>
            `,
            questions: [
                {
                    q: 'A patient has severe unilateral colicky flank pain with haematuria and cannot sit still. What is the first-line investigation?',
                    options: ['Ultrasound of the kidneys', 'CT of the abdomen and pelvis WITHOUT contrast', 'CT urogram with contrast', 'Plain abdominal X-ray'],
                    answer: 1,
                    explanation: 'Renal colic is investigated first with a non-contrast CT of the abdomen and pelvis. Uric acid stones are radiolucent on plain X-ray but cast an acoustic shadow on ultrasound, unlike tumours, clots or a sloughed papilla.'
                },
                {
                    q: 'A man with lower urinary tract symptoms from benign prostatic hyperplasia has failed conservative measures. What is the initial medical treatment and the definitive option?',
                    options: ['Alpha-blocker initially; TURP definitively', 'Antibiotics initially; TURP definitively', 'Alpha-blocker initially; radical prostatectomy definitively', 'Foley catheter initially; radiotherapy definitively'],
                    answer: 0,
                    explanation: 'An alpha-blocker is the initial medical treatment for BPH and TURP is the definitive procedure. Acute retention is managed with a Foley catheter plus a urine culture; diagnosis is by ultrasound.'
                },
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
