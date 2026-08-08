// Obstetrics & Gynecology — section content for the continuous-scroll summaries
// page. Sourced verbatim from "OB/GYN Comprehensive Modern Summary"
// (summarys/OB_GYN_Modern_Summary_1.pdf). The file's own table of contents defines
// 7 numbered topics; each maps to one subtopic card below. Tables are reproduced
// as real HTML tables. Embedded MCQs become interactive questions (0-based answer
// index + explanation). Angle brackets HTML-escaped.

const obgyn = {
    id: 'obgyn',
    title: 'Obstetrics & Gynecology',
    title_en: 'OB / GYN — Comprehensive Modern Summary',
    icon: 'venus',
    accent: '#f472b6',
    intro: 'OB/GYN comprehensive modern summary — all topics covered: 01 Obstetrics & Postpartum · 02 Labor, Delivery & Shoulder Dystocia · 03 Obstetric Complications & Medical Conditions in Pregnancy · 04 Antenatal Care & Fetal Medicine · 05 Gynecology (incl. Adenomyosis, Adnexal Masses, Asherman) · 06 Urogynecology · 07 Infertility, Contraception, Menopause & Primary Amenorrhea.',
    subtopics: [
        {
            id: 'obgyn-obstetrics',
            title: '01 — Obstetrics',
            title_en: 'Cervical Incompetence · Abortion/IUFD · Hemorrhage · Postpartum Complications',
            summaryHtml: `
                <h3>1.1 Cervical Incompetence</h3>
                <ul>
                    <li><b>Definition</b>: Painless cervical dilation leading to pregnancy loss/preterm birth in absence of other causes</li>
                    <li><b>Timing</b>: 2nd trimester (16–24 weeks)</li>
                    <li><b>C/P</b>: Unexpected rupture of membrane, 2nd trimester loss, fetal membrane herniation</li>
                </ul>
                <table>
                    <thead><tr><th>Scenario</th><th>Action</th></tr></thead>
                    <tbody>
                        <tr><td>No prior 2nd-trimester loss</td><td>US at 20 weeks · CL &gt;25 mm → Routine care · CL &lt;25 mm → Vaginal progesterone</td></tr>
                        <tr><td>Prior 2nd-trimester loss 13–14 weeks</td><td>Prophylactic Cerclage</td></tr>
                        <tr><td>Prior 2nd-trimester loss 15–23 weeks</td><td>Serial TVUS; if CL &lt;25 mm → Cerclage before 24 weeks</td></tr>
                        <tr><td>≥24 weeks</td><td>Cerclage NOT generally recommended</td></tr>
                    </tbody>
                </table>

                <h3>1.2 Abortion / IUFD / IUGR</h3>
                <ul>
                    <li><b>IUFD</b>: Fetal death ≥20 weeks or weight &gt;350 g</li>
                    <li><b>Abortion</b>: Loss of pregnancy &lt;20 weeks</li>
                    <li><b>1st trimester loss</b> (MC cause): Chromosomal abnormalities → next step: <b>karyotyping</b></li>
                    <li><b>2nd trimester loss</b> (MC cause): Cervical incompetence</li>
                    <li>Risk of abortion increases with maternal age, especially after 35 years</li>
                    <li><b>Approach</b>: History &amp; pelvic exam → TVUS → Treatment based on type</li>
                </ul>
                <table>
                    <thead><tr><th>Type</th><th>Cervix</th><th>Bleeding</th><th>Passage of POC</th><th>US Finding</th><th>Management</th></tr></thead>
                    <tbody>
                        <tr><td>Complete</td><td>Closed</td><td>Yes</td><td>Complete</td><td>No POC, no FHR</td><td>OPD follow-up</td></tr>
                        <tr><td>Incomplete</td><td>Dilated</td><td>Yes</td><td>Partial</td><td>Some POC, no FHR</td><td>Expectant (&lt;13 wks) / Medical (≤20 wks)</td></tr>
                        <tr><td>Inevitable</td><td>Dilated</td><td>Yes</td><td>No (POC in canal)</td><td>POC present, FHR may present</td><td>Misoprostol / D&amp;C (≤20 wks)</td></tr>
                        <tr><td>Missed</td><td>Closed</td><td>No</td><td>No</td><td>Dead fetus, no FHR</td><td>Medical/Surgical</td></tr>
                        <tr><td>Threatened</td><td>Closed</td><td>Yes</td><td>No</td><td>POC present, FHR present</td><td>Expectant; resume activity</td></tr>
                    </tbody>
                </table>

                <h3>1.3 Antepartum Hemorrhage</h3>
                <figure class="deck-fig"><div class="deck-fig-title"><span class="deck-tag tag-fig">Diagram</span> Placenta previa vs abruption</div>
                <div class="deck-imgrow">
                    <div class="deck-imgcell">
                        <img class="deck-img" src="/summaries/placenta-previa-openstax.jpg" width="1200" height="763" loading="lazy" decoding="async"
                             alt="Two cross-sections of a pregnant uterus. On the left the placenta lies along the upper uterine wall and the cervix is not obstructed. On the right the placenta lies over the internal os, covering the cervix." />
                        <p class="deck-imgcap"><b>Placenta previa</b> — the placenta covers the internal os
                        <br><span class="deck-hi deck-hi--red">PAINLESS · bright red · NO vaginal exam</span></p>
                    </div>
                    <div class="deck-imgcell">
                        <img class="deck-img" src="/summaries/placental-abruption-blausen.jpg" width="954" height="665" loading="lazy" decoding="async"
                             alt="Two cross-sections of a pregnant uterus with placental abruption. On the left the placenta has separated near the cervix and blood escapes externally; on the right the separation is high on the uterine wall and the blood is trapped behind the placenta as concealed internal bleeding." />
                        <p class="deck-imgcap"><b>Placental abruption</b> — premature separation from the uterine wall
                        <br><span class="deck-hi deck-hi--amber">PAINFUL · dark · may be CONCEALED</span></p>
                    </div>
                </div>
                <figcaption><b>Previa</b> = placenta over the os → <b>painless</b> bright-red bleeding (no digital vaginal exam; confirm with ultrasound). <b>Abruption</b> = premature separation → <b>painful</b> dark bleeding, tender rigid uterus. Note the right-hand abruption panel: if the separation is high, the blood stays trapped and the loss is <b>concealed</b> — the bleeding you see can badly understate the loss.</figcaption>
                <p class="deck-credit">Previa illustration: <a href="https://commons.wikimedia.org/wiki/File:2906_Placenta_Previa-02.jpg" target="_blank" rel="noopener noreferrer">OpenStax College</a>, <a href="https://creativecommons.org/licenses/by/3.0/" target="_blank" rel="noopener noreferrer">CC BY 3.0</a>. Abruption illustration: <a href="https://commons.wikimedia.org/wiki/File:Blausen_0737_PlacentalAbruption.png" target="_blank" rel="noopener noreferrer">Blausen Medical 2014</a>, <a href="https://creativecommons.org/licenses/by/3.0/" target="_blank" rel="noopener noreferrer">CC BY 3.0</a>. Both resized for web; content unmodified.</p></figure>
                <h4>Placenta Previa</h4>
                <ul>
                    <li><b>Definition</b>: Placenta covering the internal OS</li>
                    <li><b>C/P</b>: Painless vaginal bleeding, non-tender abdomen, no ROM</li>
                    <li><b>Risk factors</b>: Previous C-section, multiple gestation</li>
                    <li><b>Diagnosis</b>: TVUS to localize placenta; CTG for fetal HR</li>
                    <li><b>Delivery mode</b>: C-SECTION ONLY</li>
                </ul>
                <div class="sum-callout"><b>AVOID vaginal examination</b> — disrupts placenta and causes severe bleeding.</div>
                <table>
                    <thead><tr><th>Scenario</th><th>Management</th></tr></thead>
                    <tbody>
                        <tr><td>Ideal delivery timing</td><td>36–37 weeks</td></tr>
                        <tr><td>&lt;37 wks: severe bleeding / fetal distress</td><td>Stabilize → Emergency C-section</td></tr>
                        <tr><td>&lt;37 wks: mild bleeding</td><td>Hospitalize 48 h, Steroids (&lt;34 wks), MgSO4 (&lt;32 wks) → C-section at 36–37 wks</td></tr>
                    </tbody>
                </table>
                <h4>Placenta Abruption</h4>
                <ul>
                    <li><b>Definition</b>: Separation of placenta from uterus</li>
                    <li><b>C/P</b>: Painful vaginal bleeding, uterine tenderness</li>
                    <li><b>Risk factors</b>: Hypertension/Pre-eclampsia, Smoking</li>
                    <li><b>Diagnosis</b>: Usually clinical</li>
                </ul>
                <table>
                    <thead><tr><th>Clinical Status</th><th>Fetal Status</th><th>Management</th></tr></thead>
                    <tbody>
                        <tr><td>Unstable mother (any fetus)</td><td>—</td><td>C-section</td></tr>
                        <tr><td>Stable + IUFD</td><td>—</td><td>Induction of labor</td></tr>
                        <tr><td>Stable + reassuring fetus</td><td>&lt;34 wks</td><td>Hospitalize, Steroids, MgSO4, deliver ≥36 wks</td></tr>
                        <tr><td>Stable + reassuring fetus</td><td>34–36 wks contracting</td><td>Deliver now</td></tr>
                        <tr><td>Stable + reassuring fetus</td><td>34–36 wks not contracting</td><td>Deliver at 36 wks</td></tr>
                        <tr><td>Stable + non-reassuring fetus</td><td>—</td><td>C-section</td></tr>
                    </tbody>
                </table>
                <h4>Uterine Rupture</h4>
                <ul>
                    <li><b>C/P</b>: Abdominal pain/tenderness, vaginal bleeding, shock, sudden stop of contractions, loss of fetal station</li>
                    <li><b>Risk factors</b>: Previous uterine scar (C-section/D&amp;C), IOL with oxytocin/prostaglandin, grand parity</li>
                    <li><b>Diagnosis</b>: Clinical</li>
                    <li><b>Treatment</b>: Stop oxytocin/prostaglandin → Laparotomy + C-section</li>
                </ul>

                
                <div class="topic-deck">
<h4 class="deck-topic">Placenta previa</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Placenta covering internal OS</li><li>Painless vaginal bleeding without rupture of membrane, non-tender abdomen</li><li>Risk factors: Previous cesarean section, Multiple gestation</li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>Avoid Vaginal examination (examination will disrupt placenta and causes severe bleeding)</li><li>TVUS: to localize placenta, if placenta covers internal OS avoid SVD and vaginal exam</li><li>CTG: to assess fetal heart rate</li><li>Treatment: (Placenta previa delivery mode is only C-Section)<ul class="sub"><li>Ideal time for delivery → 36-37 weeks (before normal labor)</li><li>&lt;37 weeks:</li><li>Severe active bleeding or fetal distress → stabilization and cesarean section</li><li>Mild bleeding → Hospitalization for 48 hours, Steroid (&lt;34wks), MgSo4 (&lt;32wks) → Cesarean section at 36-37 weeks</li></ul></li></ul></div></div>
<h4 class="deck-topic">Placenta abruption</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Separation of the placenta from the uterus</li><li>Painful vaginal bleeding, uterine tenderness.</li><li>Risk factors: Hypertension or Pre-eclampsia, Smoking</li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>Diagnosis is usually clinical based on the clinical presentation</li><li>Treatment: (Based on the fetal, maternal condition and gestational age)<ul class="sub"><li>Unstable mother (regardless fetus status) → Cesarean section</li><li>Stable mother:</li><li>IUFD → Induction of labor</li><li>Reassuring fetus:</li><li>&lt;34 weeks → Hospitalization, steroid (&lt;34 wks), MgSo4 (&lt;32 wks), deliver at ≥36weeks</li><li>34-36 weeks → if contracting → deliver non-contracting → deliver at 36weeks</li><li>Non-reassuring fetus → Cesarean section</li></ul></li></ul></div></div>
                </div>
<h3>1.4 Postpartum Hemorrhage (PPH)</h3>
                <figure class="deck-fig"><div class="deck-fig-title"><span class="deck-tag tag-fig">Diagram</span> Postpartum haemorrhage — the 4 T's</div>
                <svg viewBox="0 0 700 150" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="The four T's of postpartum haemorrhage: Tone (uterine atony, most common), Trauma (lacerations), Tissue (retained placenta), Thrombin (coagulopathy).">
                <g font-family="system-ui,Arial">
                <rect x="14" y="24" width="162" height="106" rx="10" fill="#fee2e2" stroke="#ef4444"/><text x="95" y="50" text-anchor="middle" font-size="14" font-weight="800" fill="#b91c1c">Tone</text><text x="95" y="76" text-anchor="middle" font-size="11" fill="#334155">uterine atony</text><text x="95" y="98" text-anchor="middle" font-size="11" fill="#334155">~70% · commonest</text><text x="95" y="118" text-anchor="middle" font-size="10" fill="#b91c1c" font-weight="700">massage + oxytocin</text>
                <rect x="184" y="24" width="162" height="106" rx="10" fill="#fef3c7" stroke="#f59e0b"/><text x="265" y="50" text-anchor="middle" font-size="14" font-weight="800" fill="#b45309">Trauma</text><text x="265" y="76" text-anchor="middle" font-size="11" fill="#334155">lacerations</text><text x="265" y="98" text-anchor="middle" font-size="11" fill="#334155">cervix / vagina / uterus</text><text x="265" y="118" text-anchor="middle" font-size="10" fill="#b45309" font-weight="700">repair</text>
                <rect x="354" y="24" width="162" height="106" rx="10" fill="#dbeafe" stroke="#3b82f6"/><text x="435" y="50" text-anchor="middle" font-size="14" font-weight="800" fill="#1d4ed8">Tissue</text><text x="435" y="76" text-anchor="middle" font-size="11" fill="#334155">retained placenta</text><text x="435" y="98" text-anchor="middle" font-size="11" fill="#334155">± accreta</text><text x="435" y="118" text-anchor="middle" font-size="10" fill="#1d4ed8" font-weight="700">manual removal</text>
                <rect x="524" y="24" width="162" height="106" rx="10" fill="#ede9fe" stroke="#8b5cf6"/><text x="605" y="50" text-anchor="middle" font-size="14" font-weight="800" fill="#6d28d9">Thrombin</text><text x="605" y="76" text-anchor="middle" font-size="11" fill="#334155">coagulopathy</text><text x="605" y="98" text-anchor="middle" font-size="11" fill="#334155">DIC · inherited</text><text x="605" y="118" text-anchor="middle" font-size="10" fill="#6d28d9" font-weight="700">correct factors</text>
                </g></svg>
                <figcaption><b>Tone</b> (atony) is the commonest cause — first-line uterine massage + oxytocin/uterotonics. Then check <b>Trauma</b>, <b>Tissue</b> (retained products) and <b>Thrombin</b> (coagulopathy).</figcaption></figure>
                <ul>
                    <li><b>Primary PPH</b>: Bleeding within 24 hours of delivery</li>
                    <li><b>Secondary PPH</b>: Bleeding 24 hours – 12 weeks after delivery</li>
                </ul>
                <p><b>Etiology (4 T's)</b></p>
                <ul>
                    <li><b>Uterine Atony</b> — most common → soft, boggy uterus. RF: Primigravida / multiparity ≥3; large fetus / multiple gestation; prolonged/precipitous labor</li>
                    <li><b>Genital Tract Laceration</b> — 2nd most common</li>
                    <li><b>Retained Placenta</b></li>
                    <li><b>DIC</b></li>
                </ul>
                <p><b>Management</b> — Step 1: Check uterine tone; if boggy → uterine massage + uterotonics; call for help; cross-match.</p>
                <ul>
                    <li><b>Uterotonics:</b></li>
                    <li>Oxytocin 10–40 U (1st line)</li>
                    <li>Methergine 0.2 mg — C/I in Hypertension</li>
                    <li>Carboprost (Hemabate) 0.25 mg — C/I in Bronchial Asthma</li>
                </ul>
                <table>
                    <thead><tr><th>C-Section PPH (if failed → next step)</th><th>SVD PPH (if failed → next step)</th></tr></thead>
                    <tbody>
                        <tr><td>1. Medical<br>2. B-Lynch suture<br>3. Stable → Uterine artery ligation; Unstable / failed ligation → Hysterectomy</td><td>1. Medical<br>2. Bakri balloon<br>3. Stable → Embolization; Unstable → Uterine artery ligation<br>4. Hysterectomy</td></tr>
                    </tbody>
                </table>
                <div class="sum-callout"><b>Active management of 3rd stage of labor PREVENTS PPH.</b></div>

                
                <div class="topic-deck">
<h4 class="deck-topic">Postpartum hemorrhage</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Primary postpartum hemorrhage → bleeding within 24 hours after delivery</li><li>Secondary postpartum hemorrhage → bleeding 24 hours - 12weeks after delivery</li><li>Uterine atony (most common cause) → soft, boggy, uterus on examination Risk factors:<ul class="sub"><li>Related to mother: Primagravida, multiparity ≥3</li><li>Related to fetus: Large fetus, multiple gestation</li><li>Related to labor: prolonged labor, precipitous labor</li></ul></li><li>Genital tract laceration (2 nd most common cause)</li><li>Retained placenta</li><li>Disseminated intravascular coagulation (DIC)</li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>Check uterine tone (to confirm uterine atony)</li><li>If the uterus is soft, boggy → start uterine massage and uterotonics</li><li>Call for help, Cross match</li><li>Uterotonics:<ul class="sub"><li>Oxytocin (10-40 Units, one dose) (first line)</li><li>Methergine (0.2mg) → C/I in Hypertension</li><li>Carboprost - hemabate- (0.25mg) → C/I in bronchial asthma</li></ul></li><li>SVD PPH: (if failed move to next step)<ul class="sub"><li>Medical</li><li>Bakri ballon</li><li>Stable → embolization Unstable → uterine artery ligation</li><li>Hysterectomy Active management of 3 rd stage of labor → Prevents PPH</li></ul></li><li>C-section PPH: (if failed move to next step)<ul class="sub"><li>Medical</li><li>B lynch</li><li>Stable → uterine artery ligation Unstable or failed ligation → Hysterectomy</li></ul></li><li>Check uterine tone (to confirm uterine atony)</li><li>If the uterus is soft, boggy → start uterine massage and uterotonics</li><li>Call for help, Cross match</li><li>Uterotonics:<ul class="sub"><li>Oxytocin (10-40 Units, one dose)</li><li>Methergine (0.2mg) → C/I in Hypertension</li><li>Carboprost - hemabate- (0.25mg) → C/I in bronchial asthma</li></ul></li><li>SVD PPH: (if failed move to next step)<ul class="sub"><li>Medical</li><li>Bakri ballon</li><li>Stable → embolization Unstable → uterine artery ligation</li><li>Hysterectomy Active management of 3 rd stage of labor → Prevents PPH</li></ul></li><li>C-section PPH: (if failed move to next step)<ul class="sub"><li>Medical</li><li>B lynch</li><li>Stable → uterine artery ligation Unstable or failed ligation → Hysterectomy</li></ul></li></ul></div></div>
                </div>
<h3>1.5 Postpartum — Mastitis / Breast Abscess</h3>
                <ul>
                    <li><b>C/P</b>: Tender, indurated, swollen, erythematous breast; malaise; fever; pain during breastfeeding</li>
                    <li><b>Abscess signs</b>: Fluctuant mass + additional skin changes beyond redness</li>
                    <li><b>Organism</b>: Staphylococcus aureus (most common)</li>
                    <li><b>RF</b>: Lactating mother with cracked nipples</li>
                    <li><b>Management</b>: Clinical diagnosis → Anti-staph antibiotics (dicloxacillin/flucloxacillin); US to rule out abscess; CONTINUE breastfeeding</li>
                </ul>

                <h3>1.6 Other Postpartum Complications</h3>
                <table>
                    <thead><tr><th>Problem</th><th>Presentation</th><th>Management</th></tr></thead>
                    <tbody>
                        <tr><td>Vaginal / perineal hematoma</td><td>Bluish, painful perineal collection after episiotomy or laceration</td><td>Surgical evacuation if ≥5 cm, expanding or symptomatic; otherwise RICE (rest, ice, compression, elevation) + observation</td></tr>
                        <tr><td>Postpartum DVT</td><td>Unilateral leg swelling/pain, often after C-section</td><td>Therapeutic anticoagulation — LMWH (enoxaparin). NOT thrombolysis, NOT IVC filter first line</td></tr>
                        <tr><td>Postpartum PE (already anticoagulated)</td><td>Sudden dyspnea, pleuritic pain, loud P2, respiratory alkalosis on ABG</td><td>If <b>stable</b> → continue the same therapeutic dose. Thrombolysis only if <b>unstable</b> (hypotensive)</td></tr>
                        <tr><td>Placenta accreta managed conservatively (placenta left in situ)</td><td>Placenta fails to separate; hysterectomy declined → cord ligated + methotrexate</td><td>Watch for the commonest complication: <b>severe vaginal bleeding</b> (~53%), then sepsis (~6%) which may progress to DIC</td></tr>
                        <tr><td>Sheehan syndrome</td><td>Failure to lactate, fatigue, dizziness months after a PPH</td><td>Pituitary necrosis after severe PPH → hormone replacement</td></tr>
                    </tbody>
                </table>
                <div class="sum-callout"><b>Exam trap:</b> a postpartum PE in a woman <b>already on a therapeutic dose</b> and haemodynamically stable needs <b>no change in management</b> — switching heparins or adding a thrombolytic is the wrong answer unless she is hypotensive.</div>

                
                <div class="topic-deck">
<h4 class="deck-topic">Mastitis / abscess</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Tender, indurated, swollen, erythematous breast Malaise, fever chills</li><li>Pain during breast feeding</li><li>Fluctuant mass, skin changes (beside redness) → Abscess</li><li>Most common organism causes mastitis → staphylococcus aureus Risk factors: Lactating mother → cracked nipples</li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>Mastitis is clinical diagnosis Mastitis → Anti-staph Antibiotics (dicloxacillin, flucloxacillin)</li><li>US to rule out abscess</li><li>Continue breastfeeding</li></ul></div></div>
<h4 class="deck-topic">Physiological changes during pregnancy</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Estrogen: Most common form of estrogen in pregnancy is estriol Human placental lactogen: Increase insulin resistance → increase risk of maternal diabetes</li><li>HCG: high level of HCG stimulates vomiting centers and TSH receptors → Hyperemesis gravidarum</li><li>Hyperemesis gravidarum: persistent vomiting → dehydration and poor oral intake → glycogen depletion → shift from glucose to lipid → lipolysis → ketonemia → ketonuria (Diagnostic)</li><li>Blood volume → start increasing at 6 th week progressively until it reaches 40-45% at 32-34 weeks Serum Creatinine → as eGFR increases during pregnancy → High Cr clearance → fall in serum Cr</li><li>Cardiac output → increases due to high stroke volume and heart rate</li></ul></div></div>
                </div>
<section class="topic deck-enrich">
                    <h3>More from the study deck</h3>
                    <p class="deck-intro">Extra material for this step that spans more than one topic above.</p>
<h4 class="deck-topic">Uterine rupture</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Abdominal pain and tenderness</li><li>Vaginal bleeding, shock</li><li>Sudden stop of uterine contraction</li><li>Loss of fetal station</li><li>Risk factors:<ul class="sub"><li>Previous history of uterine scar (C-section or D&amp;C)</li><li>Induction of labor → Oxytocin or prostaglandin</li><li>Grand parity</li></ul></li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>Clinical diagnosis</li><li>Treatment:<ul class="sub"><li>Stop oxytocin or prostaglandin</li><li>Laparotomy and C-section</li></ul></li></ul></div></div>
                </section>
            `,
            questions: [
                {
                    q: 'A woman had a normal vaginal delivery with an episiotomy. She now has a painful, bluish perineal collection measuring 5 x 3 cm. What is the treatment?',
                    options: ['Packing', 'Needle aspiration', 'Surgical evacuation', 'Observation only'],
                    answer: 2,
                    explanation: 'A vaginal or perineal haematoma is evacuated surgically when it is large (5 cm or more), expanding, or symptomatic. Smaller, stable, asymptomatic haematomas are managed with rest, ice, compression and elevation.'
                },
                {
                    q: 'After a vaginal delivery the placenta fails to separate and cannot be extracted. The patient refuses hysterectomy, so the cord is ligated, the placenta is left in situ and methotrexate is started. What is the commonest complication of this approach?',
                    options: ['Severe vaginal bleeding', 'Infection', 'Disseminated intravascular coagulation', 'Uterine inversion'],
                    answer: 0,
                    explanation: 'Conservative management of placenta accreta with the placenta left in situ is complicated most often by severe vaginal bleeding (about 53%), followed by sepsis (about 6%), which may then progress to DIC.'
                },
                {
                    q: 'A woman 10 days after caesarean section was admitted with a right leg DVT on therapeutic enoxaparin. She develops sudden dyspnoea and pleuritic chest pain; she is normotensive, chest clear, loud P2, and CT confirms a right lower pulmonary artery thrombus. What is the most appropriate next step?',
                    options: ['Switch enoxaparin to unfractionated heparin', 'Thrombolytic therapy', 'Continue the same management', 'Surgical thrombectomy'],
                    answer: 2,
                    explanation: 'She is already anticoagulated at a therapeutic dose and is haemodynamically stable, so no change is needed. Thrombolysis is reserved for the unstable (hypotensive) patient.'
                },
                {
                    q: 'A 32-year-old at 34 weeks has painless vaginal bleeding with a non-tender abdomen and no rupture of membranes. Ultrasound shows the placenta covering the internal os. Which action is contraindicated?',
                    options: ['Cardiotocography for fetal heart rate', 'Digital vaginal examination', 'Administration of antenatal steroids', 'Admission for observation'],
                    answer: 1,
                    explanation: 'In placenta praevia a vaginal examination can disrupt the placenta and cause severe bleeding, so it must be avoided. Diagnosis is by transvaginal ultrasound to localise the placenta, and delivery is by caesarean section only.'
                },
                {
                    q: 'A woman with a soft, boggy uterus has primary postpartum haemorrhage. She has a history of bronchial asthma. Which uterotonic is contraindicated?',
                    options: ['Oxytocin', 'Methylergometrine (Methergine)', 'Carboprost (Hemabate)', 'Misoprostol'],
                    answer: 2,
                    explanation: 'Carboprost is contraindicated in bronchial asthma and methylergometrine is contraindicated in hypertension. Oxytocin 10–40 units is the first-line uterotonic. Uterine atony is the most common cause of primary PPH, so the first step is always to check uterine tone.'
                },
                {
                    q: 'A 20-year-old woman has 3 first-trimester abortions + prior pulmonary embolism. Labs: PT 11 s, APTT 69 s (↑), Platelets 320, Lupus anticoagulant positive. Most likely diagnosis?',
                    options: ['Factor V Leiden', 'Factor V deficiency', 'Protein C deficiency', 'Antiphospholipid syndrome'],
                    answer: 3,
                    explanation: 'Elevated APTT + positive lupus anticoagulant + recurrent pregnancy loss + thrombosis = APS (hypercoagulable state).'
                },
                {
                    q: 'A 34-year-old delivered 5 months ago; failure to breastfeed, dizziness, fatigue. History of vaginal delivery complicated by retained placenta + severe PPH. Most likely diagnosis?',
                    options: ['Pituitary adenoma', "Sheehan's syndrome", 'Lymphocytic hypophysitis', 'Subarachnoid hemorrhage'],
                    answer: 1,
                    explanation: 'Severe PPH → pituitary necrosis → prolactin deficiency → failure of lactation.'
                },
                {
                    q: 'A primipara 1 week postpartum: tearful, spells of crying, lacks appetite and sleep. Most likely diagnosis?',
                    options: ['Anemia', 'Schizophrenia', 'Manic disorders', 'Postnatal depression'],
                    answer: 3,
                    explanation: 'Emotional lability, tearfulness, sleep/appetite changes within days–weeks postpartum.'
                }
            ]
        },
        {
            id: 'obgyn-labor-delivery',
            title: '02 — Labor & Delivery',
            title_en: 'Stages · CTG · Labor Arrest · Bishop Score · Cord Prolapse · Shoulder Dystocia',
            summaryHtml: `
                <h3>2.1 Normal Delivery — Stages</h3>
                <figure class="deck-fig"><div class="deck-fig-title"><span class="deck-tag tag-fig">Diagram</span> The four stages of labour</div>
                <svg viewBox="0 0 700 190" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Stage 1 onset to full dilation with latent and active phases; stage 2 full dilation to delivery of the baby; stage 3 delivery of the placenta; stage 4 first one to two hours postpartum.">
                <g font-family="system-ui,Arial">
                <rect x="20" y="50" width="300" height="46" rx="8" fill="#dbeafe" stroke="#3b82f6"/><text x="170" y="70" text-anchor="middle" font-size="13" font-weight="700" fill="#1d4ed8">Stage 1</text><text x="170" y="88" text-anchor="middle" font-size="10" fill="#475569">onset → 10 cm (latent 0–6 · active 6–10)</text>
                <rect x="326" y="50" width="150" height="46" rx="8" fill="#dcfce7" stroke="#22c55e"/><text x="401" y="70" text-anchor="middle" font-size="13" font-weight="700" fill="#15803d">Stage 2</text><text x="401" y="88" text-anchor="middle" font-size="10" fill="#475569">full dilation → baby</text>
                <rect x="482" y="50" width="110" height="46" rx="8" fill="#fef3c7" stroke="#f59e0b"/><text x="537" y="70" text-anchor="middle" font-size="13" font-weight="700" fill="#b45309">Stage 3</text><text x="537" y="88" text-anchor="middle" font-size="10" fill="#475569">placenta</text>
                <rect x="598" y="50" width="84" height="46" rx="8" fill="#ede9fe" stroke="#8b5cf6"/><text x="640" y="70" text-anchor="middle" font-size="13" font-weight="700" fill="#6d28d9">Stage 4</text><text x="640" y="88" text-anchor="middle" font-size="10" fill="#475569">1–2 h</text>
                <line x1="20" y1="120" x2="682" y2="120" stroke="#94a3b8" stroke-width="2"/><text x="20" y="140" font-size="10.5" fill="#64748b">onset of regular contractions</text><text x="682" y="140" text-anchor="end" font-size="10.5" fill="#64748b">recovery</text>
                </g></svg>
                <figcaption><b>1</b> = cervix to full dilation (longest); <b>2</b> = pushing → delivery; <b>3</b> = placenta (active management: oxytocin + controlled cord traction); <b>4</b> = watch for postpartum haemorrhage.</figcaption></figure>
                <table>
                    <thead><tr><th>Stage</th><th>Phase</th><th>Time Limit</th><th>Action if exceeded</th></tr></thead>
                    <tbody>
                        <tr><td>Stage 1 — Cervical dilation</td><td>Latent (4–&lt;6 cm)</td><td>Nulliparous: 20 h; Multiparous: 14 h</td><td>Spontaneous ROM at ≥37 wks → IOL</td></tr>
                        <tr><td>Stage 1 — Cervical dilation</td><td>Active (≥4–6 cm)</td><td>—</td><td>4 h adequate contractions, no change → C-section; 6 h inadequate contractions → IOL → C-section if failed</td></tr>
                        <tr><td>Stage 2 — Fetal delivery</td><td>—</td><td>Primigravida 3 h (+1 h epidural); Multigravida 2 h (+1 h epidural)</td><td>≥+2 station → Instrumental delivery; Otherwise → C-section</td></tr>
                        <tr><td>Stage 3 — Placental delivery</td><td>—</td><td>30 minutes</td><td>Manual removal → D&amp;C</td></tr>
                    </tbody>
                </table>

                
                <div class="topic-deck">
<h4 class="deck-topic">Normal delivery</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Stage 1 (cervix dilation):<ul class="sub"><li>Latent phase → 4-&lt;6cm (nulliparous → 20 hours, multiparas → 14 hours)</li><li>Spontaneous rupture of membrane, &gt;37 weeks → Induction of labor</li><li>Active phase → &gt;4-6cm.</li><li>4 hours of adequate uterine contraction without cervical change → C-section</li><li>6 hours of inadequate uterine contraction without cervical change → IOL → C-section (if failed)</li></ul></li><li>Stage 2 (delivery of fetus):<ul class="sub"><li>3 hours in primigravida</li><li>2 hours In multigravida</li><li>+1 hour in epidural anesthesia</li><li>if delivery of fetus takes more than that → obstructed labor:</li><li>At station +2 or more → instrumental delivery</li><li>Otherwise → C-section Stage 3 (delivery of placenta): Wait for 30 minutes → manual removal → Dilation and curettage</li></ul></li></ul></div></div>
<h4 class="deck-topic">Labor and delivery</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Early decelerations → fetal head compression → starts as mirror of contraction Variable decelerations → umbilical cord compression → starts at the end of contraction Late decelerations → uteroplacental insufficiency</li><li>C-section indications:<ul class="sub"><li>Fetal distress (non-reassuring CTG)</li><li>Obstructed labor</li><li>After 4 hours of adequate uterine contraction in active phase of labor</li><li>Non - cephalic presentation</li></ul></li><li>Induction of labor → is the process of artificially started labor → indicated before labor onset Augmentation of labor → interventions used to strengthen the labor that already begins → used if uterine contractions are weak or inadequate</li><li>Cat -1 (reassuring CTG) → Fetal CTG shows all of the following:<ul class="sub"><li>Heart rate 110-16</li><li>Accelerations</li><li>Early decelerations</li><li>Treatment → routine surveillance Cat- 2 (non-reassuring CTG) → if CTG is not CAT 1 or 3</li><li>Lateral reposition (improve uteroplacental blood flow and relieve cord compression)</li><li>O2, IV fluid</li><li>Stop oxytocin</li><li>Tocolytic Cat - 3 (non-reassuring CTG) → at least on of the following:</li><li>Absent variability with recurrent variable decelerations.</li><li>Absent variability with recurrent late decelerations.</li><li>Absent variability with bradycardia</li><li>Sinusoidal pattern for at least 20 minutes</li><li>Treatment → in-utero resuscitation + prepare for delivery</li></ul></li></ul></div></div>
                </div>
<h3>2.2 C-Section Indications</h3>
                <ul>
                    <li>Fetal distress (non-reassuring CTG)</li>
                    <li>Obstructed labor</li>
                    <li>After 4 hours of adequate uterine contractions in active phase without progress</li>
                    <li>Non-cephalic presentation (e.g., twin A not cephalic)</li>
                </ul>
                <ul>
                    <li><b>IOL</b>: Artificially starting labor — indicated before labor onset</li>
                    <li><b>Augmentation</b>: Strengthening existing labor when contractions weak/inadequate</li>
                </ul>

                <h3>2.3 Cardiotocography (CTG)</h3>
                <table>
                    <thead><tr><th>Deceleration</th><th>Cause</th><th>Pattern</th></tr></thead>
                    <tbody>
                        <tr><td>Early</td><td>Fetal head compression</td><td>Mirrors contraction (starts with it)</td></tr>
                        <tr><td>Variable</td><td>Umbilical cord compression</td><td>Starts at end of contraction; variable shape</td></tr>
                        <tr><td>Late</td><td>Uteroplacental insufficiency</td><td>Starts after peak of contraction</td></tr>
                    </tbody>
                </table>
                <figure class="deck-fig"><div class="deck-fig-title"><span class="deck-tag tag-fig">Diagram</span> Decelerations — timing vs the contraction</div>
                <svg viewBox="0 0 700 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Early decelerations mirror the contraction; variable are abrupt V-shaped drops; late begin after the contraction peak.">
                <g font-family="system-ui,Arial">
                <text x="120" y="24" text-anchor="middle" font-size="13" font-weight="700" fill="#16a34a">Early — head compression</text>
                <path d="M40,150 Q120,72 200,150" fill="none" stroke="#94a3b8" stroke-width="2.5"/><line x1="40" y1="95" x2="200" y2="95" stroke="#cbd5e1"/><path d="M40,95 Q120,150 200,95" fill="none" stroke="#16a34a" stroke-width="2.8"/>
                <text x="120" y="180" text-anchor="middle" font-size="10.5" fill="#475569">nadir = contraction peak</text>
                <text x="350" y="24" text-anchor="middle" font-size="13" font-weight="700" fill="#d97706">Variable — cord compression</text>
                <path d="M270,150 Q350,72 430,150" fill="none" stroke="#94a3b8" stroke-width="2.5"/><line x1="270" y1="95" x2="430" y2="95" stroke="#cbd5e1"/><path d="M270,95 H334 L348,150 L362,95 H430" fill="none" stroke="#d97706" stroke-width="2.8"/>
                <text x="350" y="180" text-anchor="middle" font-size="10.5" fill="#475569">abrupt V-shape · variable timing</text>
                <text x="580" y="24" text-anchor="middle" font-size="13" font-weight="700" fill="#dc2626">Late — placental insufficiency</text>
                <path d="M500,150 Q580,72 660,150" fill="none" stroke="#94a3b8" stroke-width="2.5"/><line x1="500" y1="95" x2="660" y2="95" stroke="#cbd5e1"/><path d="M500,95 H572 Q620,152 665,95" fill="none" stroke="#dc2626" stroke-width="2.8"/>
                <text x="580" y="180" text-anchor="middle" font-size="10.5" fill="#475569">nadir AFTER the peak</text>
                <rect x="250" y="205" width="16" height="4" fill="#94a3b8"/><text x="272" y="213" font-size="11" fill="#475569">contraction</text><rect x="400" y="205" width="16" height="4" fill="#dc2626"/><text x="422" y="213" font-size="11" fill="#475569">fetal heart rate</text>
                </g></svg>
                <figcaption><b>Early</b> mirrors the contraction (benign, head compression). <b>Variable</b> = abrupt V-shaped drops, any timing (cord). <b>Late</b> starts after the peak — worrying (uteroplacental insufficiency).</figcaption></figure>
                <p><b>Drug Effects on CTG:</b></p>
                <ul>
                    <li>MgSO4 → Minimal or reduced variability</li>
                    <li>Epidural analgesia → Maternal hypotension → Late decelerations</li>
                    <li>Oxytocin → Late or prolonged decelerations + uterine hyperstimulation</li>
                </ul>
                <table>
                    <thead><tr><th>Category</th><th>Criteria</th><th>Management</th></tr></thead>
                    <tbody>
                        <tr><td>Cat-1 (Reassuring)</td><td>HR 110–160, accelerations present, early decels</td><td>Routine surveillance</td></tr>
                        <tr><td>Cat-2 (Non-reassuring)</td><td>Not Cat-1 or Cat-3</td><td>Lateral reposition, O2, IV fluids, stop oxytocin, tocolytic</td></tr>
                        <tr><td>Cat-3 (Ominous)</td><td>Absent variability + recurrent variable/late decels / bradycardia; OR sinusoidal ≥20 min</td><td>In-utero resuscitation + prepare for immediate delivery</td></tr>
                    </tbody>
                </table>

                <h3>2.4 Labor Progress Disorders, Instrumental Delivery &amp; Induction</h3>
                <table>
                    <thead><tr><th>Disorder</th><th>Definition</th><th>Management</th></tr></thead>
                    <tbody>
                        <tr><td>Prolonged active phase</td><td>≥6 cm dilation AND either no cervical change after <b>6 h of inadequate</b> contractions, or after <b>4 h of adequate</b> contractions</td><td>Oxytocin augmentation for hypotonic contractions (with cervical ripening if the cervix is unfavourable) · Amniotomy</td></tr>
                        <tr><td>Arrested active phase</td><td>≥6 cm dilation <b>with ruptured membranes</b> AND no cervical change after ≥4 h of adequate contractions, or &gt;6 h of inadequate contractions despite oxytocin</td><td><b>Cesarean section</b></td></tr>
                        <tr><td>Prolonged 2nd stage</td><td>&gt;3 h in nulliparous, &gt;2 h in multiparous — <b>add 1 extra hour if an epidural is running</b></td><td>Instrumental delivery if criteria met; otherwise C-section</td></tr>
                        <tr><td>Obstructed labor</td><td>Arrest of dilation/descent with a palpable <b>retraction (Bandl) ring</b></td><td>Immediate delivery — C-section</td></tr>
                    </tbody>
                </table>

                <div class="sum-callout"><b>Instrumental delivery (ventouse / forceps) has two non-negotiable prerequisites:</b><ul><li>Cervix <b>fully dilated</b>, AND</li><li>Head engaged at <b>station +2 or beyond</b></li></ul>Never choose ventouse or forceps at a station less than +2. Abandon after <b>3 failed attempts</b> and go to C-section.</div>

                <figure class="deck-block algo-flow"><figcaption><span class="deck-tag tag-algo">Algorithm</span> Prolonged second stage / non-reassuring CTG at full dilation</figcaption><p class="deck-subcap">the station is what decides between an instrument and a knife</p><div class="algo-row"><div class="algo-node start" style="animation-delay:0.00s">Delivery indicated in the second stage</div></div><div class="algo-arrow" style="animation-delay:0.05s"></div><div class="algo-row"><div class="algo-node dec" style="animation-delay:0.12s">Cervix fully dilated AND head at station +2 or beyond?</div></div><div class="algo-arrow" style="animation-delay:0.17s"></div><div class="algo-fork"><div class="algo-branch"><span class="algo-label" style="animation-delay:0.24s">Yes</span><div class="algo-node proc" style="animation-delay:0.24s">Instrumental delivery — ventouse or forceps</div><div class="algo-arrow mini" style="animation-delay:0.38s"></div><div class="algo-node end" style="animation-delay:0.34s">Failed after 3 attempts → C-section</div></div><div class="algo-branch"><span class="algo-label" style="animation-delay:0.44s">No (not fully dilated or station &lt; +2)</span><div class="algo-node end" style="animation-delay:0.44s">Cesarean section</div></div></div></figure>

                <p><b>Meconium-stained liquor</b>: induction of labor + continuous fetal monitoring (expectant management is acceptable if the CTG is reassuring). Meconium alone is not an indication for C-section — the <b>CTG category</b> drives the decision.</p>

                <div class="sum-algo"><div class="sum-algo-title">Late-term &amp; post-term pregnancy — timing of induction (ACOG)</div>
                <ul>
                    <li><b>41+0 → 42+0 weeks</b>: induction <b>may be considered</b></li>
                    <li><b>After 42+0 and by 42+6 weeks</b>: induction is <b>recommended</b> — perinatal morbidity and mortality rise beyond this point</li>
                    <li>Induce earlier if there is hypertension, reduced fetal movements or oligohydramnios</li>
                </ul></div>

                <h3>2.5 Bishop Score</h3>
                <table>
                    <thead><tr><th>Score</th><th>Interpretation</th><th>Action</th></tr></thead>
                    <tbody>
                        <tr><td>≤3</td><td>IOL unlikely to succeed</td><td>Cervical ripening recommended</td></tr>
                        <tr><td>4–5</td><td>Unfavorable cervix</td><td>Cervical ripening recommended</td></tr>
                        <tr><td>6–8</td><td>Moderately favorable</td><td>IOL may succeed → can attempt IOL</td></tr>
                        <tr><td>≥9</td><td>Favorable</td><td>Labor likely spontaneous or IOL will succeed</td></tr>
                    </tbody>
                </table>

                
                <div class="topic-deck">
<div class="deck-block deck-tbl"><div class="deck-cap"><span class="deck-tag tag-tbl">Table</span> Bishop scoring system</div><p class="deck-subcap">assesses cervical favourability for induction of labour</p><table><thead><tr><th>Score</th><th>Dilation (cm)</th><th>Position</th><th>Effacement (%)</th><th>Station (−3 to +3)</th><th>Consistency</th></tr></thead><tbody><tr><td><b>0</b></td><td>Closed</td><td>Posterior</td><td>0–30</td><td>−3</td><td>Firm</td></tr><tr><td><b>1</b></td><td>1–2</td><td>Mid-position</td><td>40–50</td><td>−2</td><td>Medium</td></tr><tr><td><b>2</b></td><td>3–4</td><td>Anterior</td><td>60–70</td><td>−1 to 0</td><td>Soft</td></tr><tr><td><b>3</b></td><td>5–6</td><td>—</td><td>80</td><td>+1, +2</td><td>—</td></tr></tbody></table><ul class="deck-tbl-notes"><li>Bishop ≤3 → unfavourable; induction unlikely to succeed → cervical ripening recommended</li><li>Bishop 4–5 → unfavourable cervix; induction may fail → cervical ripening recommended</li><li>Bishop 6–8 → intermediate / moderately favourable → induction may succeed</li><li>Bishop ≥9 → favourable cervix → labour likely spontaneous or induction likely to succeed</li></ul></div>
                </div>
<h3>2.6 Cord Prolapse</h3>
                <ul>
                    <li><b>Definition</b>: Umbilical cord descends below presenting part after membrane rupture → compression → fetal hypoxia</li>
                    <li><b>C/P</b>: Sudden fetal bradycardia after SROM, polyhydramnios, variable decelerations, visible cord on exam</li>
                    <li><b>Treatment</b>: In-utero resuscitation → if head ≥+2 station: Instrumental delivery; otherwise: C-section</li>
                </ul>

                
                <div class="topic-deck">
<h4 class="deck-topic">Cord Prolapse</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Definition: Occurs when umbilical cord descends below the presenting part of the fetus, after membrane rupture it can lead to cord compression and fetal hypoxia C/P:<ul class="sub"><li>Sudden Fetal bradycardia after spontaneous rupture of the membrane</li><li>Polyhydramnios</li><li>Variable decelerations</li><li>Visible cord at the vaginal exam</li></ul></li></ul></div><div class="deck-card mgmt"><span class="deck-card-h">Management</span><ul><li>In-utero resuscitation Delivery:<ul class="sub"><li>If the head at +2 station or more → Instrumental delivery</li><li>Otherwise → C-section</li></ul></li></ul></div></div>
                </div>
<h3>2.7 Fetal Presentation &amp; Episiotomy</h3>
                <ul>
                    <li><b>Frank breech</b>: Flexed hips + extended knees</li>
                    <li><b>Complete breech</b>: Flexed hips + flexed knees</li>
                    <li><b>Incomplete breech</b>: Partially extended/flexed hips + extended knees</li>
                    <li><b>Mediolateral episiotomy advantage</b>: Reduces risk of anal sphincter injury (incision angled away from sphincters)</li>
                </ul>

                <h3>2.8 Shoulder Dystocia — HELPERR</h3>
                <ul>
                    <li><b>Recognition</b>: the head delivers then retracts against the perineum with each contraction (<b>turtle sign</b>), and the shoulders do not follow</li>
                    <li><b>RF</b>: fetal macrosomia, maternal diabetes (including diet-controlled GDM), prolonged second stage, instrumental delivery, prior shoulder dystocia</li>
                </ul>
                <figure class="deck-fig"><div class="deck-fig-title"><span class="deck-tag tag-fig">Diagram</span> HELPERR — the shoulder dystocia drill, in order</div>
                <svg viewBox="0 0 700 302" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="HELPERR sequence: H call for help, E evaluate for episiotomy, L legs McRoberts manoeuvre, P suprapubic pressure, E enter rotational manoeuvres, R remove the posterior arm, R roll the patient onto hands and knees.">
                <g font-family="system-ui,Arial">
                <rect x="20" y="8" width="660" height="34" rx="9" fill="#eff6ff" stroke="#bfdbfe"/><circle cx="44" cy="25" r="13" fill="#2563eb"/><text x="44" y="30" text-anchor="middle" font-size="14" font-weight="800" fill="#fff">H</text><text x="70" y="30" font-size="12.5" fill="#1e293b"><tspan font-weight="700">Help</tspan> — call for help (obstetrician, paediatrician, anaesthetist)</text>
                <rect x="20" y="46" width="660" height="34" rx="9" fill="#f5f3ff" stroke="#ddd6fe"/><circle cx="44" cy="63" r="13" fill="#7c3aed"/><text x="44" y="68" text-anchor="middle" font-size="14" font-weight="800" fill="#fff">E</text><text x="70" y="68" font-size="12.5" fill="#1e293b"><tspan font-weight="700">Evaluate</tspan> for episiotomy — makes room for the internal manoeuvres</text>
                <rect x="20" y="84" width="660" height="34" rx="9" fill="#ecfdf5" stroke="#a7f3d0"/><circle cx="44" cy="101" r="13" fill="#059669"/><text x="44" y="106" text-anchor="middle" font-size="14" font-weight="800" fill="#fff">L</text><text x="70" y="106" font-size="12.5" fill="#1e293b"><tspan font-weight="700">Legs</tspan> — McRoberts manoeuvre: hyperflex the thighs onto the abdomen and abduct</text>
                <rect x="20" y="122" width="660" height="34" rx="9" fill="#fffbeb" stroke="#fde68a"/><circle cx="44" cy="139" r="13" fill="#d97706"/><text x="44" y="144" text-anchor="middle" font-size="14" font-weight="800" fill="#fff">P</text><text x="70" y="144" font-size="12.5" fill="#1e293b"><tspan font-weight="700">Pressure</tspan> — SUPRAPUBIC pressure (never fundal)</text>
                <rect x="20" y="160" width="660" height="34" rx="9" fill="#f5f3ff" stroke="#ddd6fe"/><circle cx="44" cy="177" r="13" fill="#7c3aed"/><text x="44" y="182" text-anchor="middle" font-size="14" font-weight="800" fill="#fff">E</text><text x="70" y="182" font-size="12.5" fill="#1e293b"><tspan font-weight="700">Enter</tspan> — internal rotational manoeuvres (Rubin, Woods screw)</text>
                <rect x="20" y="198" width="660" height="34" rx="9" fill="#fef2f2" stroke="#fecaca"/><circle cx="44" cy="215" r="13" fill="#dc2626"/><text x="44" y="220" text-anchor="middle" font-size="14" font-weight="800" fill="#fff">R</text><text x="70" y="220" font-size="12.5" fill="#1e293b"><tspan font-weight="700">Remove</tspan> the posterior arm</text>
                <rect x="20" y="236" width="660" height="34" rx="9" fill="#fef2f2" stroke="#fecaca"/><circle cx="44" cy="253" r="13" fill="#dc2626"/><text x="44" y="258" text-anchor="middle" font-size="14" font-weight="800" fill="#fff">R</text><text x="70" y="258" font-size="12.5" fill="#1e293b"><tspan font-weight="700">Roll</tspan> the patient onto her hands and knees (Gaskin manoeuvre)</text>
                <text x="350" y="290" text-anchor="middle" font-size="11.5" fill="#b91c1c" font-weight="700">Fundal pressure is NOT part of the drill — it worsens the impaction</text>
                </g></svg>
                <figcaption>Work down the list in order. <b>Suprapubic</b> pressure helps; <b>fundal</b> pressure drives the anterior shoulder harder into the symphysis and delays delivery.</figcaption></figure>

                <section class="topic deck-enrich">
                    <h3>More from the study deck</h3>
                    <p class="deck-intro">Extra material for this step that spans more than one topic above.</p>
<h4 class="deck-topic">CTG</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Early decelerations → fetal head compression → starts as mirror of contraction Variable decelerations → umbilical cord compression Late decelerations → uteroplacental insufficiency → starts at the end of contraction</li><li>MgSo4: Causes minimal or reduced variability Epidural analgesia: causes maternal hypotension → uteroplacental insufficiency → late decelerations</li><li>Oxytocin: Late or prolonged decelerations + uterine hyperstimulation</li></ul></div></div>
<h4 class="deck-topic">PPROM/ PROM/ Preterm labor</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Premature rupture of membrane (PROM): rupture of the membranes before onset of labor at or after 37 weeks of gestation</li><li>Preterm premature rupture of membrane (PPROM): rupture of the membranes before onset of labor and before 37 weeks of gestation Preterm labor (PL): onset of regular uterine contraction causes cervical dilation before 37 weeks of gestation</li><li>Spontaneous rupture of membrane: natural rupture of membrane lead to amniotic fluid leak during labor</li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>Rupture of membrane confirmed by:<ul class="sub"><li>Sterile speculum examination</li><li>Ferning test</li><li>Nitrazine paper test</li></ul></li></ul></div><div class="deck-card mgmt"><span class="deck-card-h">Management</span><ul><li>PPROM<ul class="sub"><li>&lt;32 weeks → MgSo4</li><li>&lt;34 weeks → Steroids</li><li>Antibiotics → Ampicillin + erythromycin (to prevent infection, prolong time of delivery)</li></ul></li><li>PROM<ul class="sub"><li>Delivery within 24 hours to</li></ul></li><li>reduce infection risk<ul class="sub"><li>GBS prophylaxis if positive or</li></ul></li><li>unknown<ul class="sub"><li>Tocolysis not preferred due to</li></ul></li><li>increase risk of infection</li><li>Delivery in: • Chorioamnionitis • Placental abruption • Non-reassuring CTG • High risk of cord prolapse</li></ul></div></div>
                </section>
            `,
            questions: [
                {
                    q: 'A multiparous woman has been in the second stage of labour for more than 2 hours without an epidural. The cervix is fully dilated but the head is at 0 station. What is the most appropriate management?',
                    options: ['Caesarean delivery', 'Wait another 2 hours', 'Ventouse delivery', 'Forceps delivery'],
                    answer: 0,
                    explanation: 'This is a prolonged second stage (over 2 hours in a multipara, over 3 hours in a nullipara, plus one extra hour with an epidural). Instrumental delivery requires a fully dilated cervix AND a head at station +2 or beyond; at 0 station it is contraindicated, so caesarean section is the answer.'
                },
                {
                    q: 'A primigravida with diet-controlled gestational diabetes has shoulder dystocia. The hips are maximally flexed, one nurse applies suprapubic pressure, another applies fundal pressure, and the doctor performs an episiotomy and delivers the posterior shoulder. Which of these will DELAY delivery?',
                    options: ['Suprapubic pressure', 'Fundal pressure', 'Hip flexion (McRoberts)', 'Delivery of the posterior shoulder'],
                    answer: 1,
                    explanation: 'Fundal pressure is not part of HELPERR - it drives the anterior shoulder harder against the symphysis and worsens the impaction. Suprapubic pressure, McRoberts hip hyperflexion, episiotomy and delivery of the posterior arm are all correct steps.'
                },
                {
                    q: 'A woman induced at 42 weeks is now fully dilated with the head at +2 station. The fetal heart rate falls to 75 bpm and does not recover with in-utero resuscitation. What should be done?',
                    options: ['Caesarean section', 'Start pushing and consider a ventouse', 'Increase oxytocin', 'Continue observation'],
                    answer: 1,
                    explanation: 'Delivery is indicated when resuscitative measures fail to correct the bradycardia. Because the cervix is fully dilated and the head is at +2, the criteria for instrumental delivery are met, and that is faster than a caesarean.'
                },
                {
                    q: 'A woman is 7 cm dilated with ruptured membranes. Despite 4 hours of adequate contractions on oxytocin there has been no cervical change. What is the management?',
                    options: ['Amniotomy', 'More oxytocin for another 6 hours', 'Caesarean section', 'Ventouse delivery'],
                    answer: 2,
                    explanation: 'Arrested active phase - 6 cm or more with ruptured membranes and no cervical change after 4 hours of adequate contractions (or over 6 hours of inadequate contractions on oxytocin) - is managed by caesarean section. A prolonged active phase, in contrast, is managed with augmentation and amniotomy.'
                },
                {
                    q: 'A 35-year-old at 34 wks, cervix 4 cm, CTG done (image showing pattern), BP 135/88. Which best explains the CTG finding?',
                    options: ['Placenta previa', 'Head compression', 'Umbilical cord compression', 'Uteroplacental insufficiency'],
                    answer: 2,
                    explanation: 'Variable decelerations = cord compression.'
                },
                {
                    q: 'A 30-year-old G3P2 at 38 wks, epidural + MgSO4 + oxytocin infusion; cervix 6 cm, BP 90/50. Most likely cause of CTG changes?',
                    options: ['MgSO4 infusion', 'Oxytocin infusion', 'Epidural analgesia', 'Fetal head position'],
                    answer: 2,
                    explanation: 'Epidural → maternal hypotension → uteroplacental insufficiency → late decelerations.'
                },
                {
                    q: 'A G3P2 at 38 wks, MgSO4 + epidural + oxytocin; cervix 6 cm, -1 station, BP 90/50. Most possible cause of CTG findings?',
                    options: ['MgSO4 infusion', 'Epidural analgesia', 'Oxytocin', 'Head position'],
                    answer: 0,
                    explanation: 'MgSO4 → causes minimal or reduced variability.'
                },
                {
                    q: 'A 25-year-old primigravida 38 wks, 5 cm dilated, 70% effaced, -3 station for last 4 hours, not on epidural. Fetal monitoring shows active pattern. Best next step?',
                    options: ['Start MgSO4', 'Start Oxytocin', 'Cesarean section', 'Reassess in 2 hours'],
                    answer: 1,
                    explanation: 'Augmentation with oxytocin for inadequate progress in active phase.'
                },
                {
                    q: 'A G3P2 at 38 wks — ultrasound shows fetal head in fundus, spine parallel to maternal spine, extended knees, flexed hips, arms flexed at elbows. Description of fetal presentation?',
                    options: ['Frank breech', 'Complete breech', 'Compound breech', 'Incomplete breech'],
                    answer: 0,
                    explanation: 'Flexed hips + extended knees = Frank breech.'
                },
                {
                    q: 'A 28-year-old primigravida at 37 wks — cervix 10 cm, head at +3 station, CTG: 120 bpm, accelerations, good variability, prolonged deceleration for 7 min. Most appropriate next step?',
                    options: ['Observation', 'Start oxytocin', 'Instrumental delivery', 'Emergency C-section'],
                    answer: 2,
                    explanation: '+2 or more station + prolonged decel → instrumental delivery.'
                }
            ]
        },
        {
            id: 'obgyn-complications',
            title: '03 — Obstetric Complications',
            title_en: 'Pre-eclampsia · GDM · Multiple Gestation · Immunization · Medical Conditions in Pregnancy',
            summaryHtml: `
                <h3>3.1 Pre-eclampsia / Eclampsia / Gestational Hypertension</h3>
                <figure class="deck-fig"><div class="deck-fig-title"><span class="deck-tag tag-fig">Diagram</span> Hypertension in pregnancy — the 20-week line</div>
                <svg viewBox="0 0 700 250" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Hypertension before 20 weeks is chronic hypertension. After 20 weeks without proteinuria it is gestational hypertension; with proteinuria or end-organ dysfunction it is pre-eclampsia; with seizures it is eclampsia.">
                <g font-family="system-ui,Arial">
                <line x1="330" y1="18" x2="330" y2="176" stroke="#8b5cf6" stroke-width="4" stroke-dasharray="8 5"/>
                <rect x="266" y="182" width="128" height="28" rx="8" fill="#ede9fe" stroke="#8b5cf6"/><text x="330" y="201" text-anchor="middle" font-size="12" font-weight="800" fill="#6d28d9">20 weeks</text>
                <rect x="14" y="60" width="300" height="76" rx="10" fill="#dbeafe" stroke="#3b82f6"/><text x="164" y="88" text-anchor="middle" font-size="13.5" font-weight="800" fill="#1d4ed8">CHRONIC hypertension</text><text x="164" y="112" text-anchor="middle" font-size="11.5" fill="#334155">present before 20 wk or pre-pregnancy</text>
                <rect x="346" y="24" width="340" height="48" rx="10" fill="#dcfce7" stroke="#22c55e"/><text x="516" y="44" text-anchor="middle" font-size="12.5" font-weight="800" fill="#15803d">GESTATIONAL hypertension</text><text x="516" y="63" text-anchor="middle" font-size="11" fill="#334155">no proteinuria, no end-organ damage</text>
                <rect x="346" y="80" width="340" height="48" rx="10" fill="#fef3c7" stroke="#f59e0b"/><text x="516" y="100" text-anchor="middle" font-size="12.5" font-weight="800" fill="#b45309">PRE-ECLAMPSIA</text><text x="516" y="119" text-anchor="middle" font-size="11" fill="#334155">+ proteinuria OR end-organ dysfunction</text>
                <rect x="346" y="136" width="340" height="48" rx="10" fill="#fee2e2" stroke="#ef4444"/><text x="516" y="156" text-anchor="middle" font-size="12.5" font-weight="800" fill="#b91c1c">ECLAMPSIA</text><text x="516" y="175" text-anchor="middle" font-size="11" fill="#334155">severe pre-eclampsia + SEIZURES</text>
                <rect x="14" y="216" width="672" height="30" rx="8" fill="#f1f5f9" stroke="#cbd5e1"/><text x="350" y="236" text-anchor="middle" font-size="11.5" font-weight="700" fill="#334155">Severe features: BP &gt;160/110 · headache/visual change · Cr &gt;1.1 · AST/ALT &gt;2× · platelets &lt;100,000 · pulmonary oedema</text>
                </g></svg>
                <figcaption>The <b>20-week line</b> separates chronic from pregnancy-induced hypertension; <b>proteinuria or end-organ damage</b> then upgrades gestational hypertension to pre-eclampsia.</figcaption></figure>
                <ul>
                    <li><b>Chronic HTN</b>: Hypertension before 20 weeks / before pregnancy</li>
                    <li><b>Gestational HTN</b>: HTN ≥20 weeks, no proteinuria/end-organ damage</li>
                    <li><b>Pre-eclampsia</b>: Gestational HTN + proteinuria OR end-organ dysfunction</li>
                    <li><b>Eclampsia</b>: Severe pre-eclampsia + convulsive seizures</li>
                    <li><b>Pathophysiology</b>: Abnormal placentation → anti-angiogenic factors → endothelial dysfunction → fluid leakage → vasoconstriction → HTN</li>
                    <li>Multiple gestation → 2 placentas → higher anti-angiogenic factors → increased pre-eclampsia risk</li>
                </ul>
                <p><b>Severe Pre-eclampsia Criteria</b> — BP &gt;160/110 OR any end-organ dysfunction:</p>
                <ul>
                    <li><b>CNS</b>: Severe/persistent headache despite analgesics, visual disturbances</li>
                    <li><b>Renal</b>: Cr &gt;1.1 mg/dL</li>
                    <li><b>Hepatic</b>: Transaminases &gt;2× normal, epigastric/RUQ pain (hepatic capsule distension)</li>
                    <li><b>Thrombocytopenia</b>: &lt;100,000 platelets/µL</li>
                    <li><b>Pulmonary edema</b>: Dyspnea, chest pain, SpO2 &lt;93%</li>
                </ul>
                <table>
                    <thead><tr><th>Route</th><th>1st Line</th><th>2nd Line</th></tr></thead>
                    <tbody>
                        <tr><td>Oral</td><td>Labetalol</td><td>Methyldopa</td></tr>
                        <tr><td>IV</td><td>Labetalol</td><td>Hydralazine</td></tr>
                    </tbody>
                </table>
                <table>
                    <thead><tr><th>Type</th><th>Gestation</th><th>Management</th></tr></thead>
                    <tbody>
                        <tr><td>Mild (&lt;140/90)</td><td>&lt;37 wks</td><td>Oral antihypertensive + OPD follow-up</td></tr>
                        <tr><td>Mild (&lt;140/90)</td><td>≥37 wks</td><td>Oral antihypertensive + IOL</td></tr>
                        <tr><td>Mild (&lt;140/90)</td><td>≥34 wks with PPROM</td><td>Oral antihypertensive + IOL</td></tr>
                        <tr><td>Severe (&gt;160/110)</td><td>&lt;34 wks</td><td>Admission, Steroids (&lt;32 wks), MgSO4, IV labetalol</td></tr>
                        <tr><td>Severe (&gt;160/110)</td><td>≥34 wks</td><td>Above + IOL</td></tr>
                    </tbody>
                </table>
                <p><b>Management of Eclampsia</b>: ABC → Magnesium sulphate (to CONTROL seizures) → Delivery → IOL.</p>
                <div class="sum-callout"><b>MgSO4 Toxicity</b>: Loss of reflexes, Respiratory depression → Stop MgSO4 → Give Calcium gluconate → Deliver.</div>

                
                <div class="topic-deck">
<h4 class="deck-topic">Pre-eclampsia - Eclampsia / gHTN</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Chronic hypertension: hypertension starts before 20 weeks of gestation or before pregnancy</li><li>Gestational Hypertension: Hypertension starts after 20 weeks of gestation without proteinuria or end organ dysfunction Pre-eclampsia: gestational hypertension with proteinuria or end-organ dysfunction</li><li>Eclampsia: severe form of pre-eclampsia with convulsive seizure</li><li>Abnormal placentation secretes anti-angiogenic factors lead to endothelial dysfunction → fluid leakage → reduce release of vasodilators → Vasoconstriction → Hypertension</li><li>Multiple gestations → 2 placentas secretes more anti-angiogenic factors → higher risk of Pre-eclampsia</li><li>Blood pressure &gt;160/110 or End-organ dysfunction:</li><li>CNS dysfunction symptoms: Severe headache or persistent headache despite analgesics, Visual disturbance Renal abnormality: Cr &gt;1.1 mg/dl Hepatic abnormality: &gt; 2folds increase of transaminase, epigastric or RUQ pain (secondary to hepatic capsule distension) Thrombocytopenia: &lt;100,000 platelets/microL Pulmonary edema: dyspnea, chest pain, Spo2 &lt;93</li><li>Oral Treatment: First line → labetalol Second line → Methyldopa</li><li>IV Treatment: First line → labetalol Second line → Hydralazine</li><li>Symptoms:<ul class="sub"><li>Loss of reflexes</li><li>Respiratory depression</li></ul></li><li>Management:<ul class="sub"><li>Stop → MgSo4 (To prevent further seizure)</li><li>Start → Calcium gluconate</li><li>Delivery → IOL</li></ul></li><li>Blood pressure &gt;160/110 or End-organ dysfunction:</li><li>CNS dysfunction symptoms: Severe headache or persistent headache despite analgesics, Visual disturbance Renal abnormality: Cr &gt;1.1 mg/dl Hepatic abnormality: &gt; 2folds increase of transaminase, epigastric pain (secondary to hepatic capsule distension) Thrombocytopenia: &lt;100,000 platelets/microL Pulmonary edema: dyspnea, chest pain, Spo2 &lt;93</li></ul></div><div class="deck-card mgmt"><span class="deck-card-h">Management</span><ul><li>Mild pre-eclampsia (&lt;140/90) → out patient treatment:<ul class="sub"><li>&lt;37 weeks → oral treatment + Follow up</li><li>≥ 37 weeks → oral treatment + induction of labor</li><li>≥ 34 weeks with PPROM → oral treatment + induction of labor</li></ul></li><li>Severe pre-eclampsia: (&gt;160/110 or end-organ dysfunction):<ul class="sub"><li>&lt;34 weeks (could be earlier incase of maternal or fetal deterioration): • Admission • Steroid (if &lt;32weeks) • MgSo4 (To prevent eclampsia or seizure) • IV labetalol (to prevent maternal complications like stroke)</li></ul></li><li>&gt;34 weeks: • As above + Induction of labor</li><li>ABC<ul class="sub"><li>Magnesium sulphate (To control seizure)</li><li>Delivery → IOL</li></ul></li></ul></div></div>
                </div>
<h3>3.2 Gestational Diabetes / DM in Pregnancy</h3>
                <ul>
                    <li><b>Pathophysiology</b>: Pregnancy = diabetogenic state; placenta secretes human placental lactogen → ↓insulin sensitivity → more glucose available to fetus</li>
                    <li><b>Screening timing</b>: 24–28 weeks (earlier if prior GDM)</li>
                    <li><b>2-step</b>: 1-hr 50 g OGTT → if positive → 3-hr 100 g OGTT (diagnostic)</li>
                    <li><b>1-step</b>: 2-hr 75 g OGTT</li>
                    <li><b>Treatment</b>: Initial → Diet and exercise; Best → Insulin</li>
                </ul>
                <p><b>Pre-existing Diabetes — Prenatal Care</b></p>
                <ul>
                    <li>Glycemic control: HbA1c &lt;6.5%</li>
                    <li>Folic acid: ≥400 mg</li>
                    <li>Aspirin: 12–28 weeks (to reduce pre-eclampsia risk)</li>
                </ul>
                <p><b>Complications of DM in Pregnancy</b></p>
                <ul>
                    <li>Macrosomia or IUGR</li>
                    <li>Hypertension (pre-eclampsia)</li>
                    <li>Respiratory distress syndrome (insulin inhibits surfactant → impairs lung maturation)</li>
                    <li>Polyhydramnios (fetal osmotic diuresis secondary to maternal hyperglycemia)</li>
                    <li>Single umbilical artery</li>
                </ul>

                
                <div class="topic-deck">
<h4 class="deck-topic">Abortion / IUFD / IUGR</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Intrauterine fetal demise: fetal death≥20 weeks of gestation or weight &gt;350 grams</li><li>Abortion: Loss of pregnancy before 20 weeks of gestation</li><li>Most common cause of: 1 st trimester pregnancy loss → chromosomal abnormalities ( Next step → karyotyping) 2 nd trimester pregnancy loss → cervical incompetence</li><li>Risk of abortion increases with increase maternal age especially after 35.</li><li>Approach to abortion:<ul class="sub"><li>History &amp; Pelvic examination: (assess for cervical dilation, products of conception, other causes of bleeding )</li><li>Transvaginal ultrasound: (assess for fetus cardiac activity and whether it present or not)</li><li>treatment based on the type of abortion and clinical presentation</li></ul></li></ul></div></div>
<h4 class="deck-topic">Gestational diabetes / GDM</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Normal pregnancy is diabetogenic state → Placental secreter human placental lactogen → reduce the insulin sensitivity → this makes glucose more available to the fetus</li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>Time: 24-28 weeks (early screening is recommended if there is a previous history of GDM)</li><li>2 steps approach:<ul class="sub"><li>1 hour 50grams OGTT → If positive go to next step</li><li>3 hours 100 grams OGTT → Diagnostic</li></ul></li><li>1 step approach: • 2 hours 75grams OGTT</li></ul></div><div class="deck-card mgmt"><span class="deck-card-h">Management</span><ul><li>Initial management → diet and exercise</li><li>Best management → Insulin</li></ul></div></div>
<h4 class="deck-topic">Diabetes before pregnancy</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Glycemic control → HbA1c &lt;6.5</li><li>Folic acid → ≥ 400mg</li><li>Aspirin → between 12-28 weeks to reduce risk of pre-eclampsia</li><li>Macrosomia or IUGR</li><li>Hypertension (pre-eclampsia)</li><li>Respiratory distress syndrome (insulin inhibit surfactants which enhance lung maturation) Polyhydramnios (secondary to fetal osmotic diuresis due to maternal hyperglycemia)</li><li>Single umbilical artery</li></ul></div></div>
<h4 class="deck-topic">Ectopic pregnancy</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Definition: implantation of the fertilized ovum outside of the uterus</li><li>Risk factors:<ul class="sub"><li>Previous ectopic pregnancy (the most significant risk factor)</li><li>Pelvic inflammatory disease (PID)</li><li>Previous abdominal or pelvic surgery</li><li>In-vitro fertilization (IVF)</li></ul></li><li>Lower abdominal pain</li><li>Vaginal spotting</li><li>Amenorrhea</li><li>Adnexal mass or tenderness</li><li>If ruptured hemodynamic instability, shoulder pain, guarding or rigidity.</li></ul></div><div class="deck-card mgmt"><span class="deck-card-h">Management</span><ul><li>Positive B-HCG (raises slower than uterine pregnancy</li><li>TVUS:<ul class="sub"><li>No intrauterine gestational sac when B-HCG &gt;1500 IU/L</li><li>Adnexal mass or free fluid (associated with rupture)</li></ul></li><li>Treatment:<ul class="sub"><li>Methotrexate: (if fulfil requirements)</li><li>Hemodynamic stable (no rupture)</li><li>B-HCG ≤ 5000 IU/L</li><li>No fetal cardiac activity</li><li>Ectopic mass &lt; 4cm</li><li>Accessible to a hospital</li><li>Measure B-HCG at day 4,7:</li><li>Plateau or decrease &lt;15% consider second dose of MTX</li><li>Rising B-HCG Surgical management</li><li>Decrease &gt;15% Follow-Up</li></ul></li><li>Surgical management:<ul class="sub"><li>Indicated incase:</li><li>Hemodynamic unstable (Ruptured)</li><li>Contraindications of methotrexate</li><li>Failed medical treatment</li></ul></li><li>Laparoscopy (preferred) or laparotomy (to choose between salpingectomy or salpingostomy)<ul class="sub"><li>Salpingostomy: removal of the ectopic with tube preservation (requires B-HCG follow-up)</li><li>If B-HCG plateau or increased persistent trophoblast single dose of methotrexate</li><li>If decrease &gt;15% weekly F/U until B-HCG undetectable</li></ul></li><li>Salpingectomy: removal of the fallopian tube<ul class="sub"><li>Single B-HCG to confirm B-HCG drop</li></ul></li></ul></div></div>
                </div>
<h3>3.3 PPROM / PROM / Preterm Labor</h3>
                <ul>
                    <li><b>PROM</b>: ROM before onset of labor at ≥37 weeks</li>
                    <li><b>PPROM</b>: ROM before onset of labor at &lt;37 weeks</li>
                    <li><b>Preterm Labor</b>: Regular contractions causing cervical dilation &lt;37 weeks</li>
                    <li><b>Diagnosis</b>: Sterile speculum exam / Ferning test / Nitrazine paper test</li>
                </ul>
                <table>
                    <thead><tr><th>PPROM</th><th>PROM</th><th>Preterm Labor (PL)</th></tr></thead>
                    <tbody>
                        <tr>
                            <td>1. &lt;32 wks → MgSO4<br>2. &lt;34 wks → Steroids<br>3. Antibiotics (Ampicillin + Erythromycin)<br>4. Deliver if: Chorioamnionitis, Abruption, Non-reassuring CTG, High-risk cord prolapse</td>
                            <td>1. Deliver within 24 h (reduce infection)<br>2. GBS prophylaxis if +ve or unknown<br>3. Tocolysis not preferred (infection risk)</td>
                            <td>1. &lt;32 wks → MgSO4<br>2. &lt;34 wks → Steroids<br>3. Tocolytics to allow steroids/MgSO4: &lt;32 wks → Indomethacin; 32–34 wks → Nifedipine<br>4. &gt;34 wks → Deliver if active labor ≥4 cm</td>
                        </tr>
                    </tbody>
                </table>

                
                <div class="topic-deck">
<h4 class="deck-topic">Cervical incompetence</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Painless cervical dilation leads to pregnancy loss or preterm birth in the absence of other causes</li><li>Occurs in second trimester (usually 16-24 weeks)</li><li>C/P: unexpected rupture of the membrane, 2 nd trimester pregnancy loss, fetal membrane herniation</li></ul></div><div class="deck-card mgmt"><span class="deck-card-h">Management</span><ul><li>Previous history of second trimester pregnancy loss?</li><li>No → US screening at 20 weeks of gestation: • Cervical length &gt;25mm → Routine care • Cervical length &lt;25mm → Vaginal progesterone</li><li>Yes → offer prophylactic cerclage based on gestational age: • 13-14 weeks → Cerclage • 15-23 weeks → Serial TVUS (if cervical length &lt;25mm ) → cerclage before 24 weeks</li><li>Cerclage is not generally recommended after 24 weeks</li></ul></div></div>
                </div>
<h3>3.4 Rh Isoimmunization / Immunization</h3>
                <ul>
                    <li><b>Mechanism</b>: Rh− mother + Rh+ fetus → fetal RBCs enter maternal circulation → IgG anti-D antibodies form → future pregnancies: IgG crosses placenta → fetal RBC hemolysis</li>
                    <li><b>Prevention — Anti-D Immunoglobulin (300 µg):</b></li>
                    <li>At 28 weeks of gestation</li>
                    <li>Within 72 hours postpartum if newborn is Rh+</li>
                    <li>After fetomaternal hemorrhage events (trauma, amniocentesis, vaginal bleeding)</li>
                    <li>300 µg anti-D covers up to 30 mL of fetal whole blood</li>
                </ul>

                <h3>3.5 Multiple Gestation</h3>
                <ul>
                    <li><b>Dizygotic (fraternal)</b>: ALWAYS Dichorionic Diamniotic; can be same or different sex</li>
                </ul>
                <table>
                    <thead><tr><th>Monozygotic — Days of division</th><th>Type</th></tr></thead>
                    <tbody>
                        <tr><td>0–3 days</td><td>Dichorionic Diamniotic</td></tr>
                        <tr><td>4–8 days</td><td>Monochorionic Diamniotic</td></tr>
                        <tr><td>9–12 days</td><td>Monochorionic Monoamniotic</td></tr>
                        <tr><td>&gt;13 days</td><td>Conjoined twins</td></tr>
                    </tbody>
                </table>
                <ul>
                    <li><b>SVD</b>: Cephalic–Cephalic or Cephalic–Breech presentation</li>
                    <li><b>C-Section</b>: If Twin A is non-cephalic</li>
                </ul>

                <h3>3.6 Medical &amp; Surgical Conditions in Pregnancy</h3>
                <table>
                    <thead><tr><th>Condition</th><th>Key point</th><th>Management</th></tr></thead>
                    <tbody>
                        <tr><td>Subclinical hypothyroidism, trying to conceive</td><td>High TSH with a <b>normal free T4</b></td><td>Start <b>levothyroxine now</b> — before conception, not once she is pregnant — in women with ovulatory dysfunction or infertility</td></tr>
                        <tr><td>Chloasma</td><td>Brown facial pigmentation appearing <b>during pregnancy</b>; melasma is the same lesion outside pregnancy</td><td>Reassurance; sun protection</td></tr>
                        <tr><td>Hyperemesis gravidarum</td><td>Persistent vomiting → dehydration, dry mouth, oral thrush, ↓ skin turgor</td><td>Diagnosis is confirmed by <b>urine ketones</b> (glycogen depletion → lipolysis → ketonuria). IV fluids + antiemetics</td></tr>
                        <tr><td>Mitral stenosis</td><td>Worsens as cardiac output rises. The dominant physiological driver is the <b>increase in plasma volume</b> (plasma rises far more than red cell mass → physiological anaemia of pregnancy)</td><td>Rate control, diuresis for congestion; risk of pulmonary oedema peaks late 2nd–3rd trimester and in labour</td></tr>
                        <tr><td>Sickle cell disease</td><td>Commonest <b>antenatal</b> complication is <b>IUGR / low birth weight</b></td><td>Serial growth scans, folate, hydration, infection prophylaxis</td></tr>
                        <tr><td>Hepatitis B (HBsAg positive mother)</td><td>Newborn needs <b>passive + active</b> immunisation</td><td><b>Hepatitis B vaccine AND HBIG within 12 hours of delivery</b> — not either one alone</td></tr>
                        <tr><td>Adnexal mass in pregnancy</td><td>51–92% resolve spontaneously; most carry a low risk of malignancy</td><td><b>Expectant management / reassurance</b>. Operate only for an acute abdomen or features suggesting malignancy (see 5.3)</td></tr>
                    </tbody>
                </table>
                <div class="sum-callout"><b>If “increased plasma volume” is not among the options</b> for the pregnancy change that decompensates mitral stenosis, choose <b>increased red cell mass</b> — both raise cardiac output, but plasma volume rises far more.</div>

                
                <div class="topic-deck">
<h4 class="deck-topic">Multiple gestation</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Dizygotic twins → always dichorionic diamniotic twins, can be same same or different sex.</li><li>Monozygotic twins → membranes vary based on timing of division:<ul class="sub"><li>0-3 days → Dichorionic Diamniotic twins</li><li>4-8 days → Monochorionic Diamniotic twins</li><li>9-12 days → Monochorionic Monoamniotic twins</li><li>&gt;13 days → conjoined twins</li></ul></li><li>Based on fetal presentation:<ul class="sub"><li>Spontaneous vaginal delivery → Cephalic - Cephalic or Cephalic - Breech presentation</li><li>Cesarean section → if twin A is presenting in non-cephalic presentation</li></ul></li></ul></div></div>
                </div>
<section class="topic deck-enrich">
                    <h3>More from the study deck</h3>
                    <p class="deck-intro">Extra material for this step that spans more than one topic above.</p>
<div class="deck-block deck-tbl"><div class="deck-cap"><span class="deck-tag tag-tbl">Table</span> Types of abortion</div><p class="deck-subcap">clinical, ultrasound &amp; management differences</p><table><thead><tr><th>Type</th><th>Clinical presentation</th><th>Ultrasound</th><th>Management</th></tr></thead><tbody><tr><td><b>Complete</b></td><td>Cervix closed; bleeding; complete passage of products of conception (POC)</td><td>No POC; no fetal activity</td><td>OPD follow-up</td></tr><tr><td><b>Incomplete</b></td><td>Cervix dilated; partial passage of POC, remainder in cervix/uterus</td><td>Some retained POC; no fetal activity</td><td>Expectant (if &lt;13 wk) · Medical (≤20 wk): misoprostol · D&amp;C (≤20 wk)</td></tr><tr><td><b>Inevitable</b></td><td>Cervix dilated; bleeding; no passage of POC; POC visible in cervical canal</td><td>POC present; fetal activity may be present</td><td>Misoprostol or D&amp;C · surgical D&amp;C if severe hemorrhage / hemodynamic instability</td></tr><tr><td><b>Missed</b></td><td>Cervix closed; no bleeding; no passage of POC</td><td>Fetus dead in utero; no fetal activity</td><td>Misoprostol or D&amp;C</td></tr><tr><td><b>Threatened</b></td><td>Cervix closed; bleeding; no passage of POC</td><td>POC present; fetal activity present</td><td>Expectant · resume normal physical activity</td></tr></tbody></table></div>
<h4 class="deck-topic">Gestational trophoblastic diseases</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>A Group of disorders arising from abnormal proliferation of trophoblastic tissue after abnormal fertilization</li><li>Benign: Complete (precancerous) and partial mole</li><li>Cancerous: choriocarcinoma</li><li>Persistent of irregular vaginal bleeding after pregnancy</li><li>Symptoms of metastasis:<ul class="sub"><li>Lungs hemoptysis</li><li>Vagina fragile bleeding mass</li></ul></li><li>Diagnosis: (clinical diagnosis, without biopsy)<ul class="sub"><li>Staging chest x-ray (lung metastasis)</li></ul></li><li>Treatment: chemotherapy</li><li>First trimester painless vaginal bleeding</li><li>Uterus larger than gestational age</li><li>Hyperemesis gravidarum</li><li>Passes vesicles or tissue</li><li>Diagnosis:<ul class="sub"><li>B-HCG Very high &gt;100,000 IU/L</li><li>US snow storm or cluster of grapes appearance</li></ul></li><li>Treatment:<ul class="sub"><li>Suction and evacuation followed by B-HCG surveillance</li><li>Baseline B-HCG</li><li>Within 48 hours if increasing or plateau refer to oncology for staging and chemotherapy</li><li>Weekly until undetectable (for 3 weeks)</li><li>Monthly (for 6 months)</li></ul></li></ul></div></div>
                </section>
            `,
            questions: [
                {
                    q: 'A woman who wants to conceive has a raised TSH with a normal free T4. What is the most appropriate management?',
                    options: ['Follow-up only', 'Start thyroxine now', 'Start thyroxine once she is pregnant', 'Proceed to pregnancy with no treatment'],
                    answer: 1,
                    explanation: 'Levothyroxine replacement is started before conception in subclinical hypothyroidism (raised TSH with normal free T4) in women who are trying to conceive and who have ovulatory dysfunction or infertility. Waiting until she is pregnant is too late.'
                },
                {
                    q: 'A pregnant woman has repeated vomiting, a dry mouth, oral thrush and reduced skin turgor. Which urinalysis finding confirms the diagnosis?',
                    options: ['Leucocytes', 'Protein', 'Ketones', 'Glucose'],
                    answer: 2,
                    explanation: 'Hyperemesis gravidarum: persistent vomiting causes dehydration and poor intake, glycogen depletion, a shift to lipolysis, and therefore ketonaemia with ketonuria. Urine ketones are the confirmatory finding.'
                },
                {
                    q: 'Which physiological change of pregnancy is most likely to precipitate heart failure in a woman with mitral stenosis?',
                    options: ['Increased minute ventilation', 'Increased red cell mass', 'Increased renal plasma flow', 'Increased plasma volume'],
                    answer: 3,
                    explanation: 'Mitral stenosis decompensates as cardiac output rises. Plasma volume increases far more than red cell mass (which is why pregnancy causes a physiological anaemia), so increased plasma volume is the best answer. If it is not offered, choose increased red cell mass.'
                },
                {
                    q: 'A mother is HBsAg positive. What should the newborn receive within the first 12 hours of life?',
                    options: ['Hepatitis B vaccine plus hepatitis B immunoglobulin', 'Hepatitis B vaccine only', 'Hepatitis B immunoglobulin only', 'Nothing until 6 weeks of age'],
                    answer: 0,
                    explanation: 'Newborns of HBsAg-positive mothers need passive-active immunisation: the first dose of the hepatitis B vaccine series AND one dose of HBIG, both within 12 hours of delivery.'
                },
                {
                    q: 'A pregnant woman with sickle cell disease is counselled about antenatal risks. Which complication is most associated with her condition?',
                    options: ['Low birth weight (IUGR)', 'Chest infection', 'Urinary tract infection', 'Gestational diabetes'],
                    answer: 0,
                    explanation: 'Intrauterine growth restriction with low birth weight is the antenatal complication most linked to sickle cell disease in pregnancy, so serial growth scans are needed.'
                },
                {
                    q: 'An Rh-negative woman is pregnant with an Rh-positive fetus. When should anti-D immunoglobulin be given?',
                    options: ['At 28 weeks, and again within 72 hours of delivery if the newborn is Rh positive', 'Only at delivery', 'Only in the first trimester', 'Every month throughout the pregnancy'],
                    answer: 0,
                    explanation: 'Anti-D immunoglobulin 300 µg is given at 28 weeks of gestation, within 72 hours postpartum if the newborn is Rh positive, and after fetomaternal haemorrhage events such as trauma, amniocentesis or vaginal bleeding. One 300 µg dose covers up to 30 mL of fetal whole blood.'
                },
                {
                    q: 'A 39-year-old primigravida at 39 wks — cervix 2 cm, 90% effaced, 0 station. BP 140/90. Urine dipstick positive for protein. Most appropriate management?',
                    options: ['Induction of labor', 'Immediate C-section', 'Admission for observation', 'Outpatient observation till 40 wks'],
                    answer: 0,
                    explanation: 'Mild pre-eclampsia at ≥37 wks → IOL.'
                }
                ,
                {
                    q: 'A woman at 30 weeks has BP 168/114, a severe persistent headache and platelets of 80,000. What is the correct management package?',
                    options: ['Admit; give MgSO4, IV labetalol and antenatal steroids', 'Discharge on oral methyldopa with weekly follow-up', 'Immediate caesarean without stabilisation', 'Observe only until 37 weeks'],
                    answer: 0,
                    explanation: 'This is severe pre-eclampsia (BP >160/110 plus CNS symptoms and thrombocytopenia <100,000). At <34 weeks: admit, give MgSO4 for seizure prophylaxis, IV labetalol for BP control and steroids (<32 weeks) for fetal lung maturity.'
                },
                {
                    q: 'A woman receiving magnesium sulphate for eclampsia develops loss of deep tendon reflexes and respiratory depression. What is the immediate management?',
                    options: ['Stop MgSO4 and give calcium gluconate', 'Increase the MgSO4 infusion rate', 'Give IV labetalol', 'Give furosemide'],
                    answer: 0,
                    explanation: 'Loss of reflexes and respiratory depression signal magnesium toxicity — stop the infusion and give calcium gluconate as the antidote, then proceed to delivery.'
                },
                {
                    q: 'In eclampsia, what is magnesium sulphate given for?',
                    options: ['To control and prevent seizures', 'To lower blood pressure as first-line', 'To induce labour', 'To mature the fetal lungs'],
                    answer: 0,
                    explanation: 'MgSO4 controls and prevents eclamptic seizures — it is not an antihypertensive. Blood pressure is controlled with IV labetalol (or hydralazine); definitive treatment of eclampsia is delivery.'
                }
            ]
        },
        {
            id: 'obgyn-antenatal',
            title: '04 — Antenatal Care & Fetal Medicine',
            title_en: 'Prenatal Care · Fetal Medicine · Physiological Changes',
            summaryHtml: `
                <h3>4.1 Prenatal Care</h3>
                <figure class="deck-fig"><div class="deck-fig-title"><span class="deck-tag tag-fig">Diagram</span> Antenatal timeline — visits &amp; scans</div>
                <svg viewBox="0 0 700 235" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Dating scan at 10 to 11 weeks by crown-rump length; anomaly scan at 18 to 22 weeks; visits every 4 weeks until 28 weeks, then every 2 weeks until 36 weeks, then weekly until delivery.">
                <g font-family="system-ui,Arial">
                <line x1="40" y1="120" x2="660" y2="120" stroke="#94a3b8" stroke-width="3"/>
                <circle cx="112" cy="120" r="8" fill="#8b5cf6"/><text x="112" y="100" text-anchor="middle" font-size="11.5" font-weight="700" fill="#6d28d9">10–11 wk</text><text x="112" y="146" text-anchor="middle" font-size="10.5" fill="#475569">dating scan (CRL)</text>
                <circle cx="268" cy="120" r="8" fill="#2563eb"/><text x="268" y="100" text-anchor="middle" font-size="11.5" font-weight="700" fill="#1d4ed8">18–22 wk</text><text x="268" y="146" text-anchor="middle" font-size="10.5" fill="#475569">anomaly scan</text>
                <circle cx="432" cy="120" r="8" fill="#16a34a"/><text x="432" y="100" text-anchor="middle" font-size="11.5" font-weight="700" fill="#15803d">28 wk</text><text x="432" y="146" text-anchor="middle" font-size="10.5" fill="#475569">visits → every 2 wk</text>
                <circle cx="560" cy="120" r="8" fill="#f59e0b"/><text x="560" y="100" text-anchor="middle" font-size="11.5" font-weight="700" fill="#b45309">36 wk</text><text x="560" y="146" text-anchor="middle" font-size="10.5" fill="#475569">visits → weekly</text>
                <circle cx="648" cy="120" r="8" fill="#ef4444"/><text x="648" y="100" text-anchor="middle" font-size="11.5" font-weight="700" fill="#b91c1c">40 wk</text>
                <rect x="40" y="24" width="286" height="34" rx="9" fill="#f1f5f9" stroke="#cbd5e1"/><text x="183" y="46" text-anchor="middle" font-size="11.5" font-weight="700" fill="#334155">every 4 weeks until 28 wk</text>
                <rect x="336" y="24" width="164" height="34" rx="9" fill="#f1f5f9" stroke="#cbd5e1"/><text x="418" y="46" text-anchor="middle" font-size="11.5" font-weight="700" fill="#334155">every 2 wk → 36</text>
                <rect x="510" y="24" width="150" height="34" rx="9" fill="#f1f5f9" stroke="#cbd5e1"/><text x="585" y="46" text-anchor="middle" font-size="11.5" font-weight="700" fill="#334155">weekly → delivery</text>
                <rect x="40" y="176" width="620" height="44" rx="10" fill="#dcfce7" stroke="#22c55e"/><text x="350" y="196" text-anchor="middle" font-size="12" font-weight="700" fill="#15803d">Folic acid: 400 µg daily (average risk) · 4 mg daily (previous NTD)</text><text x="350" y="214" text-anchor="middle" font-size="11" fill="#334155">Screen urine culture for asymptomatic bacteriuria — treat if positive regardless of symptoms</text>
                </g></svg>
                <figcaption>Two scans anchor the pregnancy: <b>dating at 10–11 weeks</b> (CRL) and the <b>anomaly scan at 18–22 weeks</b>. Visit frequency then steps up at 28 and 36 weeks.</figcaption></figure>
                <ul>
                    <li><b>Expected delivery date (EDD)</b>: LMP day +7 / month +9 / year +1 or 0. Example: LMP 18/5/2020 → EDD 25/2/2021</li>
                    <li><b>Visit Schedule</b>: Every 4 weeks until 28 weeks; Every 2 weeks until 36 weeks; Weekly thereafter</li>
                    <li><b>Folic Acid</b>: Average risk (NTD) 400 µg (0.4 mg) daily; High risk (prior NTD) 4 mg daily</li>
                </ul>
                <table>
                    <thead><tr><th>Ultrasound</th><th>Timing</th><th>Purpose</th></tr></thead>
                    <tbody>
                        <tr><td>1st US (confirm GA)</td><td>10–11 weeks</td><td>CRL (crown-rump length)</td></tr>
                        <tr><td>2nd US (anomaly scan)</td><td>18–22 weeks</td><td>Rule out congenital anomalies</td></tr>
                        <tr><td>Growth parameter</td><td>After 13+6 weeks</td><td>Abdominal circumference (most sensitive)</td></tr>
                    </tbody>
                </table>
                <ul>
                    <li><b>Urine culture</b>: screen for asymptomatic bacteriuria → treat if positive regardless of symptoms</li>
                </ul>

                
                <div class="topic-deck">
<h4 class="deck-topic">Prenatal care</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Day +7 / Month +9 / year +1 or 0 (Depending on the month)</li><li>Example: LMP 18/5/2020 → 18+7 / 5+9 / 2020 +1 or 0 Estimated delivery date → 25/2/2021</li><li>Prenatal visits: every 4 weeks (until 28weeks), every 2 weeks (until 36 weeks) then weekly</li><li>Folic acid supplements: average risk of neural tube defect → 400 micrograms (0.4mg) High risk of neural tube defects (previous Hx of NTD) → 4mg daily</li><li>First antenatal US to confirm gestational age of pregnancy → at 10-11 weeks Second US (anomaly scan) → at 18-22 weeks ( to R/O congenital anomalies)</li><li>Growth parameters on US: (used to confirm gestational date)<ul class="sub"><li>Crown rump length → First trimester up to 13+6 weeks or unknown</li><li>Abdominal circumference → after 13+6 weeks (most sensitive growth parameter) Urine culture → to rule out asymptomatic bacteruia → start antibiotic if culture is positive regardless symptoms or not</li></ul></li></ul></div></div>
                </div>
<h3>4.2 Physiological Changes During Pregnancy</h3>
                <p><b>Hormonal Changes</b></p>
                <ul>
                    <li><b>Estrogen</b>: Most common form in pregnancy = Estriol</li>
                    <li><b>hPL</b>: ↑Insulin resistance → ↑risk of maternal DM</li>
                    <li><b>hCG</b>: High levels stimulate vomiting center + TSH receptors → Hyperemesis gravidarum</li>
                    <li><b>Hyperemesis gravidarum</b>: Persistent vomiting → dehydration → glycogen depletion → lipolysis → ketonemia → ketonuria (diagnostic)</li>
                </ul>
                <p><b>Blood &amp; CVS Changes</b></p>
                <ul>
                    <li>Blood volume: starts rising at 6 weeks → 40–45% increase by 32–34 weeks</li>
                    <li>Serum Cr: falls due to ↑eGFR</li>
                    <li>Cardiac output: ↑ (↑stroke volume + ↑heart rate)</li>
                </ul>

                <h3>4.3 Fetal Medicine</h3>
                <p><b>Approach to Decreased Fetal Movement</b></p>
                <ol>
                    <li>History</li>
                    <li>Kick count (&lt;10 kicks in 2 hours → proceed)</li>
                    <li>Non-stress test (fetal HR assessment)</li>
                    <li>US or biophysical profile</li>
                    <li>Umbilical artery Doppler (if IUGR/placental insufficiency)</li>
                </ol>
                <table>
                    <thead><tr><th>↑ HIGH</th><th>↓ LOW</th></tr></thead>
                    <tbody>
                        <tr><td>β-hCG</td><td>Estriol</td></tr>
                        <tr><td>Inhibin A</td><td>Maternal serum AFP (MSAFP)</td></tr>
                    </tbody>
                </table>
                <div class="sum-callout"><b>Memory trick</b>: Any marker containing the letter H is HIGH; the others are LOW (hCG, inHibin).</div>
            
                
                <div class="topic-deck">
<h4 class="deck-topic">Fetal medicine</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>High → HCG , Inhibin Low → Estriol, Maternal serum alpha fetoprotein</li><li>To remember → Any marker have H is high , the others are low</li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>History<ul class="sub"><li>Fetal movement assessment: Ask the mother about to perform kick count</li><li>If &lt;10 kicks in 2 hours → proceed to next step</li><li>Non-stress test: to assess Fetal heart rate</li><li>US or biophysical profile</li><li>Umbilical artery doppler: if IUGR or placental insufficiency suspected</li></ul></li></ul></div></div>
                </div>
<section class="topic deck-enrich">
                    <h3>More from the study deck</h3>
                    <p class="deck-intro">Extra material for this step that spans more than one topic above.</p>
<h4 class="deck-topic">Rh isoimmunization</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Occurs when Rh negative mother carries Rh positive fetus</li><li>Fetal RBC enter maternal circulation (During delivery, trauma), then maternal immune system produce IgG anti-d antibodies In future pregnancies: IgG crosses placenta → Hemolysis of fetal RBC</li></ul></div><div class="deck-card mgmt"><span class="deck-card-h">Management</span><ul><li>Administer anti-d immunoglobulin to Rh negative mothers at:<ul class="sub"><li>28 weeks of gestation</li><li>Within 72hours postpartum if newborn is Rh positive</li><li>After events causes fetomaternal hemorrhage (trauma, amniocentesis, maternal vaginal bleeding)</li></ul></li><li>Dosage: • 300 micrograms covers up to 30ml of fetal whole blood</li></ul></div></div>
                </section>
            `,
            questions: [
                {
                    q: 'A 24-year-old primigravida at 12 weeks — renal function tests ordered. Most expected blood test finding?',
                    options: ['Fall in serum creatinine', 'Increased plasma sodium', 'Increased BUN', 'Unaffected BUN'],
                    answer: 0,
                    explanation: 'Pregnancy → ↑eGFR → ↑Cr clearance → ↓serum creatinine.'
                },
                {
                    q: 'A 36-year-old antenatal clinic visit — US shows significant polyhydramnios. Most likely cause?',
                    options: ['Anencephaly', 'Post-term pregnancy', 'Posterior urethral valve', 'Maternal NSAID ingestion'],
                    answer: 0,
                    explanation: 'Anencephaly → lack of swallowing reflex → failure to swallow amniotic fluid → polyhydramnios.'
                }
                ,
                {
                    q: 'A woman planning pregnancy has a previous child with a neural tube defect. What daily dose of folic acid is recommended?',
                    options: ['4 mg daily', '400 µg (0.4 mg) daily', '40 µg daily', 'None is needed'],
                    answer: 0,
                    explanation: 'High-risk women (prior NTD-affected pregnancy) need 4 mg daily; average-risk women need 400 µg (0.4 mg) daily.'
                },
                {
                    q: 'At what gestational age is the anomaly scan performed?',
                    options: ['18–22 weeks', '10–11 weeks', '28–30 weeks', '36–38 weeks'],
                    answer: 0,
                    explanation: 'The anomaly (structural) scan is done at 18–22 weeks. The first ultrasound at 10–11 weeks confirms gestational age using crown-rump length.'
                },
                {
                    q: 'A woman at 9 weeks has persistent vomiting with dehydration. Which finding is diagnostic of hyperemesis gravidarum?',
                    options: ['Ketonuria', 'Glycosuria', 'Proteinuria', 'Leukocyturia'],
                    answer: 0,
                    explanation: 'Persistent vomiting → dehydration → glycogen depletion → lipolysis → ketonemia and ketonuria, which is the diagnostic finding. High hCG stimulates the vomiting centre and TSH receptors.'
                }
            ]
        },
        {
            id: 'obgyn-gynecology',
            title: '05 — Gynecology',
            title_en: 'PCOS · Endometriosis · Fibroids · Adenomyosis · Adnexal Masses · Cervical Cancer · Asherman',
            summaryHtml: `
                <h3>5.1 Polycystic Ovarian Syndrome (PCOS)</h3>
                <p><b>Clinical Features:</b></p>
                <ul>
                    <li>Irregular/absent menstrual cycle</li>
                    <li>Hirsutism, acne, oily skin</li>
                    <li>Obesity and central weight gain</li>
                    <li>Infertility or subfertility</li>
                    <li>Insulin resistance signs: Acanthosis nigricans, hyperglycemia</li>
                </ul>
                <p><b>Diagnosis (2 of 3 Rotterdam criteria):</b> Oligo/anovulation · Clinical or biochemical hyperandrogenism · US showing polycystic ovaries. <b>LH:FSH ratio: 3:1</b></p>
                <table>
                    <thead><tr><th>Problem</th><th>Treatment</th></tr></thead>
                    <tbody>
                        <tr><td>First line for all</td><td>Lifestyle modification</td></tr>
                        <tr><td>Menstrual irregularity</td><td>OCP</td></tr>
                        <tr><td>Infertility</td><td>Clomiphene</td></tr>
                        <tr><td>Insulin resistance</td><td>Metformin</td></tr>
                    </tbody>
                </table>

                
                <div class="topic-deck">
<h4 class="deck-topic">Polycystic ovarian syndrome</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Irregular or absent menstrual cycle</li><li>Hirsutism, acne, oily skin Obesity and central weight gain Infertility or subfertility</li><li>Insulin resistance signs: Acanthosis nigricans, hyperglycemia</li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>Diagnosis: • Required 2 out of:<ul class="sub"><li>Oligo/anovulation</li><li>Clinical or biochemical hyperandrogenism</li><li>US shows polycystic ovaries • LH:FSH ratio 3:1 • Testosterone level → to assess hirsutism • Glucose and lipid profile</li></ul></li></ul></div></div>
                </div>
<h3>5.2 Ectopic Pregnancy</h3>
                <figure class="deck-fig"><div class="deck-fig-title"><span class="deck-tag tag-fig">Diagram</span> Ectopic pregnancy — implantation sites</div>
                <svg viewBox="0 0 680 312" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Most ectopic pregnancies implant in the fallopian tube ampulla (about 70 percent); others in isthmus, fimbria, interstitial or cornual region, ovary, cervix, or abdomen.">
                <path d="M300,150 L380,150 L340,235 Z" fill="#fde68a" stroke="#d97706" stroke-width="2"/><text x="340" y="200" text-anchor="middle" font-size="10" fill="#92400e">uterus</text>
                <path d="M300,150 Q210,110 150,140 Q120,155 130,175" fill="none" stroke="#f472b6" stroke-width="9" stroke-linecap="round"/>
                <path d="M380,150 Q470,110 530,140 Q560,155 550,175" fill="none" stroke="#f472b6" stroke-width="9" stroke-linecap="round"/>
                <circle cx="470" cy="118" r="9" fill="#dc2626"/><text x="470" y="100" text-anchor="middle" font-size="11" font-weight="700" fill="#b91c1c">ampulla ~70%</text>
                <circle cx="405" cy="138" r="7" fill="#f97316"/>
                <circle cx="545" cy="160" r="7" fill="#f59e0b"/>
                <circle cx="372" cy="150" r="7" fill="#7c3aed"/>
                <circle cx="560" cy="180" r="7" fill="#0891b2"/>
                <circle cx="340" cy="232" r="7" fill="#334155"/>
                <line x1="30" y1="252" x2="650" y2="252" stroke="#e2e8f0" stroke-width="1.5"/>
                <circle cx="48" cy="270" r="6" fill="#f97316"/><text x="63" y="274" font-size="11" fill="#c2410c">isthmus ~12%</text>
                <circle cx="268" cy="270" r="6" fill="#f59e0b"/><text x="283" y="274" font-size="11" fill="#b45309">fimbrial ~11%</text>
                <circle cx="488" cy="270" r="6" fill="#7c3aed"/><text x="503" y="274" font-size="11" fill="#6d28d9">interstitial ~2%</text>
                <circle cx="48" cy="294" r="6" fill="#0891b2"/><text x="63" y="298" font-size="11" fill="#155e75">ovarian ~3%</text>
                <circle cx="268" cy="294" r="6" fill="#334155"/><text x="283" y="298" font-size="11" fill="#334155">cervical &lt;1%</text>
                </svg>
                <figcaption>Most implant in the <b>tubal ampulla (~70%)</b>. Classic triad: amenorrhoea + <b>lower abdominal pain</b> + vaginal bleeding; β-hCG that fails to double + no intrauterine sac on TVUS. <b>Interstitial/cornual</b> ruptures late and bleeds massively.</figcaption></figure>
                <ul>
                    <li><b>Definition</b>: Implantation of fertilized ovum outside the uterus</li>
                    <li><b>Risk Factors</b>: Previous ectopic pregnancy (most significant RF), PID, Previous abdominal/pelvic surgery, IVF</li>
                    <li><b>C/P</b>: Lower abdominal pain, vaginal spotting, amenorrhea, adnexal mass/tenderness; if ruptured → hemodynamic instability, shoulder pain, guarding/rigidity</li>
                    <li><b>Diagnosis</b>: β-hCG rises slower than intrauterine pregnancy; TVUS: No IUG sac when β-hCG &gt;1500 IU/L; adnexal mass or free fluid</li>
                </ul>
                <table>
                    <thead><tr><th>Methotrexate (if ALL criteria met)</th><th>Surgical Management</th></tr></thead>
                    <tbody>
                        <tr>
                            <td>Hemodynamically stable (no rupture)<br>β-hCG ≤5000 IU/L<br>No fetal cardiac activity<br>Ectopic mass &lt;4 cm<br>Patient accessible to hospital</td>
                            <td>Hemodynamically unstable (ruptured)<br>Contraindications to MTX<br>Failed medical treatment</td>
                        </tr>
                    </tbody>
                </table>
                <ul>
                    <li><b>Approach</b>: Laparoscopy (preferred) or laparotomy → Salpingostomy (tube preserved; needs B-hCG F/U) → Salpingectomy (tube removed; single B-hCG check)</li>
                    <li><b>MTX follow-up</b>: Check β-hCG at Day 4 and Day 7 · Decrease &gt;15% → Follow-up · Plateau or &lt;15% decrease → 2nd dose MTX · Rising β-hCG → Surgical management</li>
                </ul>

                
                <div class="topic-deck">
<h4 class="deck-topic">Diabetes before pregnancy</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Glycemic control HbA1c &lt;6.5</li><li>Folic acid ≥ 400mg</li><li>Aspirin between 12-28 weeks to reduce risk of pre-eclampsia</li><li>Macrosomia or IUGR</li><li>Hypertension (pre-eclampsia)</li><li>Respiratory distress syndrome (insulin inhibit surfactants which enhance lung maturation)</li><li>Polyhydramnios (secondary to fetal osmotic diuresis due to maternal hyperglycemia)</li><li>Single umbilical artery</li></ul></div></div>
                </div>
<h3>5.3 Ovarian Diseases</h3>
                <table>
                    <thead><tr><th>Condition</th><th>C/P</th><th>Diagnosis</th><th>Treatment</th></tr></thead>
                    <tbody>
                        <tr><td>Ovarian Torsion</td><td>Sudden unilateral pelvic pain, N&amp;V, adnexal tenderness, NO vaginal bleeding</td><td>Pelvic US with Doppler: absent/decreased ovarian blood flow; enlarged edematous ovary</td><td>Detorsion (if viable); Cystectomy/oophorectomy (if malignant suspected)</td></tr>
                        <tr><td>Ovarian Cancer</td><td>Abdominal bloating, early satiety, abdominal pain, weight loss</td><td>TVUS + CA-125 (epithelial tumor) + CT/MRI for staging</td><td>Surgical staging (LN sampling, TAH/oophorectomy) + Adjuvant chemotherapy</td></tr>
                    </tbody>
                </table>

                <p><b>Adnexal masses — reading the ultrasound</b></p>
                <table>
                    <thead><tr><th>Suggests MALIGNANCY</th><th>Reassuring / benign</th></tr></thead>
                    <tbody>
                        <tr><td>Cyst <b>&gt;10 cm</b></td><td>Simple, thin-walled, unilocular</td></tr>
                        <tr><td><b>Papillary or solid components</b> (a hypoechoic mass = more solid tissue)</td><td>Anechoic, purely cystic</td></tr>
                        <tr><td>Irregularity of the wall or septa</td><td>Smooth outline</td></tr>
                        <tr><td>Ascites</td><td>No free fluid</td></tr>
                        <tr><td>High colour Doppler flow</td><td>Low or absent internal flow</td></tr>
                    </tbody>
                </table>
                <div class="sum-callout"><b>Bilaterality and a thin septation alone do not make a mass malignant</b> — solid/hypoechoic tissue does. <b>In pregnancy</b>: manage expectantly (most resolve); operate only for an acute abdomen, or a cyst &gt;10 cm / imaging or tumour markers suggesting malignancy.</div>

                
                <div class="topic-deck">
<h4 class="deck-topic">Ovarian torsion</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>sudden onset of unilateral pelvic pain</li><li>Nausea, vomiting On examination: Adnexal tenderness No vaginal bleeding</li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>Diagnosis:<ul class="sub"><li>Pelvic US with doppler: • Absent or decreased ovarian blood flow • Enlarged, edematous ovary</li></ul></li><li>Treatment: • Detorsion (if viable) • Cystectomy or oophorectomy (if malignant mass suspected)</li></ul></div></div>
                </div>
<h3>5.4 Endometriosis</h3>
                <ul>
                    <li><b>Definition</b>: Endometrial tissue outside the uterus (most commonly ovaries)</li>
                    <li><b>C/P (3 Ds + infertility)</b>: Dysmenorrhea, Dyspareunia, Dyschezia; Infertility, chronic pelvic pain; Exam: immobile retroverted fixed uterus, uterosacral ligament nodularity</li>
                    <li><b>Initial test</b>: TVUS: chocolate cyst = ground-glass appearance</li>
                    <li><b>Confirmatory</b>: Laparoscopy with biopsy</li>
                </ul>
                <table>
                    <thead><tr><th>Medical (1st)</th><th>Surgical (if medical fails)</th></tr></thead>
                    <tbody>
                        <tr><td>1st line: OCP, POP (post-menopause)<br>2nd line: IUD</td><td>1st line: Laparoscopic ablation<br>Definitive: TAH + BSO (refractory/severe, completed family)</td></tr>
                    </tbody>
                </table>

                
                <div class="topic-deck">
<h4 class="deck-topic">Endometriosis</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Definition: is the presence of endometrial tissue outside of the uterus (most commonly ovaries)</li><li>C/P:<ul class="sub"><li>Dysmenorrhea, dyspareunia, dyschezia</li><li>Infertility</li><li>Chronic pelvic pain</li><li>On examination: normal sized, immpbile retroverted fixed uterus, nodularity of uterosacral ligament</li></ul></li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>Diagnosis:<ul class="sub"><li>Initial test TVUS: chocolate cyst appeared as ground glass appearance</li><li>Confirmatory test Laparoscopy with biopsy</li></ul></li><li>Treatment:<ul class="sub"><li>Medical:</li><li>1 st line OCP, POP (post-menopause)</li><li>2 nd line Intra-uterine device</li></ul></li></ul></div></div>
                </div>
<h3>5.5 Uterine Diseases</h3>
                <p><b>Endometrial Hyperplasia</b></p>
                <ul>
                    <li><b>Definition</b>: Proliferation of endometrial glands → thickened endometrium</li>
                    <li><b>RF</b>: Nulliparity, multiparity, early menarche, late menopause, obesity, DM, PCOS (unopposed estrogen)</li>
                    <li><b>Diagnosis</b>: Endometrial biopsy</li>
                    <li>Hyperplasia WITHOUT atypia → Oral progesterone</li>
                    <li>Hyperplasia WITH atypia → TAH; or oral progesterone + F/U (if fertility desired)</li>
                </ul>
                <p><b>Endometrial Cancer</b>: C/P: Abnormal uterine bleeding; enlarged uterus on exam. Diagnosis: Endometrial biopsy. Staging: Laparoscopy + para-aortic LN dissection.</p>
                <ul>
                    <li><b>Risk factors — anything that means unopposed estrogen</b>: obesity, nulliparity, chronic anovulation/PCOS, early menarche, late menopause, diabetes, unopposed estrogen therapy</li>
                    <li><b>Tamoxifen</b> for breast cancer — antagonist in the breast but a partial <b>agonist on the endometrium</b> → endometrial polyps, hyperplasia and carcinoma</li>
                    <li><b>Lynch syndrome (HNPCC)</b> — a hereditary risk factor; endometrial cancer is often the sentinel cancer</li>
                </ul>
                <p><b>Fibroid (Leiomyoma)</b></p>
                <table>
                    <thead><tr><th>Type</th><th>Symptoms</th></tr></thead>
                    <tbody>
                        <tr><td>Submucosal</td><td>Infertility, AUB, pressure/heaviness</td></tr>
                        <tr><td>Subserosal (MC type)</td><td>Pressure/heaviness</td></tr>
                        <tr><td>Intramural</td><td>Pressure/heaviness</td></tr>
                    </tbody>
                </table>
                <ul>
                    <li><b>Asymptomatic incidental</b> → Observation + annual US</li>
                    <li><b>Medical</b>: OCP, GnRH (pre-op to ↓size)</li>
                    <li><b>Uterine artery embolization</b> (if refuses surgery)</li>
                    <li><b>Surgery</b> (large &gt;7cm or failed medical): Hysterectomy; Myomectomy (fertility-sparing): Submucosal → Hysteroscopic; Others → Laparoscopic/laparotomy</li>
                </ul>
                <p><b>Adenomyosis</b></p>
                <ul>
                    <li><b>Definition</b>: Endometrial glands/stroma invade myometrium</li>
                    <li><b>RF</b>: Multiparity · age 40–50 · <b>prior uterine surgery (C-section, myomectomy, D&amp;C)</b> · uterine leiomyomas · endometriosis</li>
                    <li><b>C/P (3 Ds + Menorrhagia)</b>: Dysmenorrhea (secondary), Dyspareunia, Diffuse uterine enlargement, Menorrhagia with clots</li>
                    <li><b>Examination</b>: diffusely enlarged, <b>globular / boggy</b> uterus, symmetrically enlarged, tender immediately before and during menstruation — but <b>the uterus can be normal-sized in some patients</b>, so a normal exam does not exclude it</li>
                    <li><b>Investigations</b>: TVUS <b>first line</b> (and the correct “next step” in an exam stem) → MRI second line → <b>histopathology is definitive</b></li>
                    <li><b>Management — conservative</b> (symptom relief): NSAIDs · LNG-IUD · combined oral contraceptives · uterine artery embolisation</li>
                    <li><b>Management — definitive</b>: <b>Hysterectomy</b>, for women who have completed childbearing, decline or cannot have hormonal therapy, or have failed it</li>
                </ul>
                <div class="sum-callout"><b>Adenomyosis vs leiomyoma:</b> adenomyosis gives a <b>symmetrically</b> enlarged, boggy, <b>tender</b> uterus; fibroids give an <b>irregular, firm, non-tender</b> uterus. The classic adenomyosis stem is a parous woman in her 40s, prior uterine surgery, secondary dysmenorrhoea and heavy menses.</div>
                <p><b>Endometrial Polyp</b></p>
                <ul>
                    <li><b>C/P</b>: Menorrhagia or intermenstrual bleeding</li>
                    <li><b>Diagnosis</b>: Initial: TVUS; Confirmatory: Hysteroscopy</li>
                    <li><b>Management</b>: Asymptomatic small &lt;1cm: observe; Symptomatic/large: Hysteroscopic polypectomy</li>
                </ul>

                
                <div class="topic-deck">
<h4 class="deck-topic">Endometrial hyperplasia</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Definition: proliferation of endometrial glands leading to thickening endometrium</li><li>Risk factors:<ul class="sub"><li>Nulliparity, multiparity</li><li>Early menarche, late menopause</li><li>Obesity, DM, PCOS (leads to unopposed estrogen)</li></ul></li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>Diagnosis : Endometrial biopsy</li><li>Treatment:<ul class="sub"><li>Hyperplasia without atypia oral progesterone</li><li>Hyperplasia with atypia:</li><li>Total abdominal hysterectomy</li><li>If the patient wishes to preserve fertility Oral progesterone with follow up</li></ul></li></ul></div></div>
<h4 class="deck-topic">Fibroid</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Submucosal infertility, Abnormal uterine bleeding, Pressure or heaviness feeling</li><li>Subserosal (MC type) Pressure or heaviness feeling</li><li>Intramural Pressure or heaviness feeling</li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>Diagnosis:<ul class="sub"><li>US initial and diagnostic</li></ul></li><li>Treatment:<ul class="sub"><li>Asymptomatic, incidental finding on US Observation, annual F/U US</li><li>Medical Oral contraceptive pills (OCP), GnRH (used pre-operatively to reduce fibroid size)</li><li>Uterine artery embolization if the patient Refuses surgery</li><li>Surgical (indicated in: Large fibroid (&gt;7cm), failed medical treatment)</li><li>Hysterectomy</li><li>Myomectomy (fertility sparing): • Submucosal fibroid Hysteroscopic resection • Other types Laparoscopic or laparotomy resection</li></ul></li></ul></div></div>
<h4 class="deck-topic">Endometrial polyp</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>C/P:<ul class="sub"><li>Menorrhagia or intermenstrual bleeding</li></ul></li><li>Diagnosis:<ul class="sub"><li>Initial imaging TVUS</li><li>Confirmatory imaging Hysteroscopy</li></ul></li><li>Management:<ul class="sub"><li>Asymptomatic and small (&lt;1cm) observation</li><li>Symptomatic or large Hysteroscopic polypectomy</li></ul></li></ul></div></div>
<h4 class="deck-topic">Adenomyosis</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Definition: occurs when endometrial glands and stroma invades myometrium</li><li>C/P: (3Ds)<ul class="sub"><li>Dysmenorrhea</li><li>Dyspareunia</li><li>Diffuse uterine enlargement</li><li>Menorrhagia</li></ul></li><li>Diagnosis:<ul class="sub"><li>Pelvic exam: diffusely enlarged, boggy uterus</li><li>TVUS: myometrial thickening</li></ul></li><li>Management:<ul class="sub"><li>Medical IUD, OCP</li><li>Definitive (severe/refractory) Hysterectomy</li></ul></li></ul></div></div>
                </div>
<h3>5.6 Abnormal Uterine Bleeding (AUB)</h3>
                <ul>
                    <li><b>Cervical source</b>: Scanty post-coital bleeding</li>
                    <li><b>Uterine source</b>: Profuse vaginal bleeding</li>
                    <li><b>Workup</b>: History + PE → β-hCG (r/o ectopic/abortion) → CBC → TVUS + Endometrial sampling</li>
                    <li><b>When to biopsy</b>: AUB age &gt;45 → always biopsy; Post-menopausal + AUB: if endometrial thickness &gt;5 mm → biopsy, if asymptomatic: if ≥11 mm → biopsy; &lt;45 with AUB: biopsy if chronic unopposed estrogen (PCOS/obesity) OR persistent AUB despite medical management</li>
                </ul>
                <table>
                    <thead><tr><th>Acute AUB</th><th>Chronic AUB</th></tr></thead>
                    <tbody>
                        <tr><td>1st line: IV conjugated estrogen<br>Combined OCP<br>Oral progesterone<br>Tranexamic acid<br>Severe refractory: Therapeutic D&amp;C</td><td>IUD (Mirena)<br>Combined OCP</td></tr>
                    </tbody>
                </table>

                
                <div class="topic-deck">
<h4 class="deck-topic">Abnormal uterine bleeding</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Cervix: Scanty post-coital bleeding</li><li>Uterine: Profuse vaginal bleeding</li><li>1 st line IV conjugated estrogen</li><li>Combined oral contraceptive pills</li><li>Oral progesterone</li><li>Tranexamic acid</li><li>In severe refractory bleeding Therapeutic D and C</li><li>IUD merina</li><li>Combined oral contraceptive pills</li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>History and physical examination</li><li>B-HCG: to rule out pregnancy associated conditions (Ectopic pregnancy, abortion)</li><li>CBC: to assess anemia</li><li>TVUS and Endometrial sampling:<ul class="sub"><li>AUB &gt;45 endometrial biopsy</li><li>US finding in post-menopausal women, Proceed with biopsy if:</li><li>&gt;5mm endometrial thickness + abnormal uterine bleeding</li><li>≥11 endometrial thickness if asymptomatic</li><li>&lt;45 with AUB, proceed with biopsy if:</li><li>Chronic unopposed estrogen (PCOS, obesity)</li><li>Persistent AUB despite medical management</li></ul></li></ul></div></div>
                </div>
<h3>5.7 Pelvic Inflammatory Disease (PID)</h3>
                <ul>
                    <li><b>C/P</b>: Lower abdominal/pelvic pain, abnormal vaginal discharge, dysuria, dyspareunia</li>
                    <li><b>Exam</b>: Cervical motion tenderness, adnexal tenderness</li>
                </ul>
                <table>
                    <thead><tr><th>Scenario</th><th>Treatment</th></tr></thead>
                    <tbody>
                        <tr><td>PID (empirical)</td><td>Ceftriaxone + Doxycycline</td></tr>
                        <tr><td>Tubo-ovarian abscess (stable, unruptured)</td><td>IV antibiotics</td></tr>
                        <tr><td>Tubo-ovarian abscess (unstable / ruptured / &gt;9cm / no improvement 48–72 h)</td><td>Surgical drainage/excision</td></tr>
                    </tbody>
                </table>

                
                <div class="topic-deck">
<h4 class="deck-topic">Pelvic inflammatory disease</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Lower abdominal pain or pelvic pain</li><li>Abnormal vaginal discharge Dysuria, dyspareunia On examination: cervical motion tenderness, adnexal tenderness</li></ul></div><div class="deck-card mgmt"><span class="deck-card-h">Management</span><ul><li>Treatment:<ul class="sub"><li>Empirical antibiotics:</li><li>Ceftriaxone</li><li>Doxycycline</li><li>Tubo-ovarian abscess:</li><li>Stable - unruptured abscess → IV antibiotics</li><li>Unstable, ruptured, &gt;9cm, no improvement after 48-72 H of Abx → abscess drainage</li></ul></li></ul></div></div>
                </div>
<h3>5.8 Cervical Cancer — Screening &amp; Management</h3>
                <table>
                    <thead><tr><th>Age</th><th>Test</th><th>Frequency</th></tr></thead>
                    <tbody>
                        <tr><td>21–29</td><td>PAP smear</td><td>Every 3 years</td></tr>
                        <tr><td>30–65</td><td>Co-test (PAP + HPV)</td><td>Every 5 years</td></tr>
                        <tr><td>30–65</td><td>PAP smear alone</td><td>Every 3 years</td></tr>
                        <tr><td>&gt;65</td><td>No screening</td><td>—</td></tr>
                    </tbody>
                </table>
                <p><b>PAP Smear Results (benign → malignant):</b> 1. ASC-US · 2. ASC-H · 3. LSIL · 4. HSIL · 5. Carcinoma in situ · 6. Invasive carcinoma</p>
                <table>
                    <thead><tr><th>Result</th><th>Action</th></tr></thead>
                    <tbody>
                        <tr><td>Inconclusive</td><td>Repeat in 2–4 months</td></tr>
                        <tr><td>HSIL / ASC-H / Cancer</td><td>Colposcopy</td></tr>
                        <tr><td>LSIL age 21–24</td><td>Repeat PAP in 1 year</td></tr>
                        <tr><td>LSIL age ≥25</td><td>Colposcopy</td></tr>
                        <tr><td>ASC-US age 21–24</td><td>Repeat PAP in 1 year</td></tr>
                        <tr><td>ASC-US age &gt;25: HPV+</td><td>Colposcopy</td></tr>
                        <tr><td>ASC-US age &gt;25: HPV−</td><td>Co-test after 3 years</td></tr>
                    </tbody>
                </table>
                <p><b>Cervical Mass / Colposcopy Results:</b></p>
                <ul>
                    <li>AIS → Cold knife biopsy (preserves fertility)</li>
                    <li>Other carcinoma in situ or invasive cancer → LEEP</li>
                    <li>Non-AIS + wishes to preserve fertility → Cold knife biopsy (fertility = priority)</li>
                </ul>

                
                <div class="topic-deck">
<h4 class="deck-topic">Cervical cancer</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>PAP smear findings ordered from benign to malignant</li><li>ASC-US (Atypical squamous cells of undetermined significance<ul class="sub"><li>ASC-H (Atypical squamous cells, cannot exclude HSIL)</li><li>LSIL (Low grade squamous intraepithelial lesion)</li><li>HSIL (High grade squamous intraepithelial lesion)</li><li>Carcinoma in situ</li><li>Invasive carcinoma</li></ul></li><li>Inconclusive result repeat after 2-4 months<ul class="sub"><li>HSIL, ASCH, cancer Colposcopy</li></ul></li><li>LSIL:<ul class="sub"><li>21-24 Repeat PAP in1 year</li><li>≥25 Colposcopy</li></ul></li><li>ASCUS:<ul class="sub"><li>21-24 Repeat PAP in1 year</li><li>&gt;25= HPV test:</li><li>HPV Positive Colposcopy</li><li>HPV Negative Co-test after 3 years.</li><li>If HPV testing is not a choice Repeat PAP +HPV in 1 year:</li><li>If ASCUS or worse colposcopy</li><li>If Negative Routine screening</li></ul></li><li>Any visible cervical lesion must be evaluated via colposcopy + biopsy to rule out malignancy</li><li>Colposcopy results interpretation:<ul class="sub"><li>Adenocarcinoma in situ (AIS) cold knife biopsy (preserves fertility)</li><li>Other types of carcinoma in situ or invasive cancer LEEP</li></ul></li><li>However, if the patient has non adenocarcinoma in situ and wishes to preserve fertility preserve fertility is the priority proceed with cold knife biopsy</li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>Start screening at age of 21</li><li>21-29 PAP smear (Every 3 years)<ul class="sub"><li>30-65 Co-test (Every 5 years) or PAP smear (Every 3 years)</li><li>&gt;65 Not indicated</li></ul></li></ul></div></div>
<h4 class="deck-topic">Endometrial cancer</h4><div class="deck-cards"><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>C/P: Abnormal uterine bleeding, on examination, enlarged uterus</li><li>Diagnosis : Endometrial biopsy</li><li>Staging:<ul class="sub"><li>Laparoscopy</li><li>Para-aortic lymph node dissection</li></ul></li></ul></div></div>
                </div>
<h3>5.9 Gestational Trophoblastic Disease (GTD)</h3>
                <ul>
                    <li><b>Definition</b>: Disorders from abnormal proliferation of trophoblastic tissue after abnormal fertilization</li>
                    <li><b>Types</b>: Benign: Complete mole (precancerous) / Partial mole; Cancerous: Choriocarcinoma</li>
                </ul>
                <p><b>Complete Mole:</b> 1st trimester painless vaginal bleeding, uterus larger than GA, hyperemesis, passage of vesicles. β-hCG: &gt;100,000 IU/L (very high). US: Snowstorm / cluster of grapes appearance. Treatment: Suction + evacuation → β-hCG surveillance (baseline → weekly until undetectable ×3 weeks → monthly ×6 months).</p>
                <p><b>Choriocarcinoma:</b> Persistent irregular vaginal bleeding after pregnancy; Metastasis: Lungs → hemoptysis; Vagina → fragile bleeding mass. Diagnosis: Clinical (NO biopsy). Staging: Chest X-ray (lung metastasis). Treatment: Chemotherapy.</p>

                <h3>5.10 Asherman Syndrome (Intrauterine Adhesions)</h3>
                <ul>
                    <li><b>Definition</b>: intrauterine adhesions / synechiae (IUAs) that have become <b>symptomatic</b> — infertility, amenorrhoea, hypomenorrhoea, recurrent pregnancy loss</li>
                    <li><b>Mechanism</b>: trauma to the <b>stratum basalis</b> of the endometrium — the regenerative layer. The stratum functionalis is shed every cycle anyway; losing it is not what causes Asherman</li>
                    <li><b>RF</b>: <b>repeated D&amp;C</b> (risk rises with the number of procedures), postpartum curettage, uterine surgery, genital TB</li>
                    <li><b>Diagnosis</b>: hysteroscopy (gold standard); HSG or saline infusion sonography as initial imaging; no withdrawal bleed after a progesterone challenge with normal FSH</li>
                    <li><b>Treatment</b>: hysteroscopic adhesiolysis + oestrogen to re-epithelialise, ± intrauterine barrier to prevent re-adhesion</li>
                </ul>
                <table>
                    <thead><tr><th>Post-D&amp;C amenorrhea — which one?</th><th>Discriminator</th></tr></thead>
                    <tbody>
                        <tr><td><b>Asherman syndrome</b></td><td>Preceded by <b>D&amp;C / uterine instrumentation</b>. Normal FSH, no withdrawal bleed with progesterone</td></tr>
                        <tr><td><b>Sheehan syndrome</b></td><td>Preceded by <b>severe PPH</b>. Failure to lactate + panhypopituitarism, low gonadotropins</td></tr>
                    </tbody>
                </table>
                <div class="sum-callout"><b>Early pregnancy loss stem — read the D&amp;C count.</b> ~50% of early losses are due to <b>fetal chromosomal abnormalities</b>, so a woman with only one prior D&amp;C bleeding at 5 weeks is a chromosomal-abnormality answer. A woman with <b>multiple</b> D&amp;Cs is the Asherman answer — the risk scales with the number of curettages.</div>
            
                <section class="topic deck-enrich">
                    <h3>More from the study deck</h3>
                    <p class="deck-intro">Extra material for this step that spans more than one topic above.</p>
<h4 class="deck-topic">Ovarian cancer</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Abdominal bloating or distension</li><li>Early satiety Abdominal pain Unintentional weight loss</li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>Diagnosis:<ul class="sub"><li>TVUS</li><li>CA-125 (Elevated in epithelial ovarian tumor) • CT scan or MRI: for staging</li></ul></li><li>Treatment:<ul class="sub"><li>Surgical staging (LN sampling, tissue biopsy, total abdominal hysterctomy or oophorectomy)</li><li>Adjuvant chemotherapy (After surgery)</li></ul></li></ul></div></div>
<h4 class="deck-topic">Primary dysmenorrhea</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Definition: painful menstrual affecting daily activities</li><li>Types:<ul class="sub"><li>Primary dysmenorrhea 🡪 occurs without pelvic pathology within 1-2 years of menarche</li><li>Secondary dysmenorrhea 🡪 cause by underlying condition (like endometriosis), &gt;25 years and worsens over time</li></ul></li><li>Crampy lower abdominal pain before or during menstruation, may radiate to the thigh or back</li><li>Nausea, vomiting, diarrhea, headache</li></ul></div><div class="deck-card mgmt"><span class="deck-card-h">Management</span><ul><li>Life style modification: hot packs, exercise</li><li>Non-steroidal anti-inflammatory drugs (NSAID)</li><li>Hormonal therapy: OCP</li></ul></div></div>
<h4 class="deck-topic">Premenstrual syndrome</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Cyclic emotional, physical, behavioral symptoms occurs during luteal phase of menstrual cycle and resolving with menstruation</li><li>C/P:<ul class="sub"><li>Physical symptoms: breast tenderness, bloating, headache, fatigue</li><li>Emotional / behavioral symptoms: mood swings (MC symptom), irritability, anxiety, depression</li></ul></li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>Clinical diagnosis</li><li>Treatment:<ul class="sub"><li>Life style modification</li><li>SSRI</li><li>OCP (if the patient wishes contraception or refractory to SSRI)</li></ul></li></ul></div></div>
<div class="deck-block deck-tbl"><div class="deck-cap"><span class="deck-tag tag-tbl">Table</span> Vaginal infections — comparison</div><p class="deck-subcap">pathogen, discharge, microscopy &amp; treatment</p><table><thead><tr><th></th><th>Bacterial vaginosis</th><th>Trichomoniasis</th><th>Vulvovaginal candidiasis</th><th>Gonorrhoea</th><th>Chlamydia</th></tr></thead><tbody><tr><td><b>Pathogen</b></td><td>Gardnerella vaginalis</td><td>Trichomonas vaginalis</td><td>Candida albicans</td><td>Neisseria gonorrhoeae</td><td>Chlamydia trachomatis</td></tr><tr><td><b>Discharge</b></td><td>Gray/milky; fishy odour</td><td>Frothy, yellow-green; strawberry cervix</td><td>Cottage-cheese; odourless</td><td>Purulent; odourless or malodorous</td><td>Purulent, bloody; malodorous</td></tr><tr><td><b>Microscopy</b></td><td>Clue cells (granular epithelial cells)</td><td>Flagellated protozoa</td><td>Pseudohyphae</td><td>Gram-negative diplococci</td><td>Poorly gram-staining</td></tr><tr><td><b>Treatment</b></td><td>Metronidazole (patient only)</td><td>Metronidazole (treat partners)</td><td>Topical azoles</td><td>Ceftriaxone (treat partners)</td><td>Azithromycin (treat partners)</td></tr></tbody></table></div>
                </section>
            `,
            questions: [
                {
                    q: 'Which ultrasound feature best distinguishes a malignant from a benign ovarian mass?',
                    options: ['A hypoechoic (solid) component', 'Bilateral masses', 'A cyst with a septation', 'A thin, smooth wall'],
                    answer: 0,
                    explanation: 'Features suggesting malignancy are a cyst larger than 10 cm, papillary or solid components (a hypoechoic mass means more solid tissue), irregularity, ascites, and high colour Doppler flow. Bilaterality or a single thin septation alone do not establish malignancy.'
                },
                {
                    q: 'A pregnant woman has vague abdominal pain. Ultrasound shows an ovarian cyst measuring 9 x 7 cm. Her abdomen is soft with no peritonism. How should she be managed?',
                    options: ['Reassurance and expectant management', 'Laparoscopic drainage', 'Immediate laparotomy', 'Analgesia and serial observation'],
                    answer: 0,
                    explanation: 'Most adnexal masses in pregnancy carry a low risk of malignancy or acute complication, and 51-92% resolve during the pregnancy. Surgery is reserved for a symptomatic acute abdomen or imaging or markers suggesting malignancy (for example a cyst over 10 cm).'
                },
                {
                    q: 'A 42-year-old with heavy menstrual bleeding and dysmenorrhoea has a bulky, tender uterus on examination. How is the diagnosis confirmed?',
                    options: ['Transvaginal ultrasound', 'MRI', 'Histopathology', 'Hysterosalpingography'],
                    answer: 2,
                    explanation: 'In adenomyosis transvaginal ultrasound is the first-line investigation and MRI is second line, but histopathology is the definitive (confirmatory) test. Note the wording: "confirm" asks for the definitive test, whereas "next step" asks for the transvaginal ultrasound.'
                },
                {
                    q: 'A 45-year-old with heavy menstrual bleeding and clots, a previous myomectomy and a bulky uterus on examination. What is the NEXT step?',
                    options: ['CT scan', 'Transvaginal ultrasound', 'MRI', 'Hysterectomy'],
                    answer: 1,
                    explanation: 'Transvaginal ultrasound is the first-line investigation for suspected adenomyosis. Hysterectomy is the definitive treatment, not the next diagnostic step.'
                },
                {
                    q: 'A woman with recurrent miscarriages managed by multiple dilatation and curettage procedures is now unable to conceive. Which endometrial layer has been damaged?',
                    options: ['Stratum compactum', 'Stratum spongiosum', 'Stratum functionalis', 'Stratum basalis'],
                    answer: 3,
                    explanation: 'Intrauterine adhesions (Asherman syndrome) result from trauma to the stratum basalis, the regenerative layer. The stratum functionalis is shed physiologically each cycle, so losing it does not cause adhesions.'
                },
                {
                    q: 'A woman at 5 weeks gestation has heavy bleeding with clots. She has had 5 previous second-trimester abortions and multiple dilatation and curettage procedures. What is the most likely cause of her current bleeding?',
                    options: ['Asherman syndrome', 'Cervical incompetence', 'Fetal chromosomal abnormality', 'Ectopic pregnancy'],
                    answer: 0,
                    explanation: 'The risk of Asherman syndrome rises with the number of curettages, and multiple D and C procedures point to it. With only a single prior D and C, fetal chromosomal abnormality would be the better answer, since about 50% of early pregnancy losses are chromosomal.'
                },
                {
                    q: 'A 34-year-old woman is due for cervical cancer screening. Which schedule is appropriate?',
                    options: ['Co-testing (PAP + HPV) every 5 years, or a PAP smear alone every 3 years', 'A PAP smear every year', 'No screening is required until age 40', 'HPV testing every 10 years'],
                    answer: 0,
                    explanation: 'From 30 to 65 the options are co-testing (PAP + HPV) every 5 years or a PAP smear alone every 3 years. Ages 21–29 have a PAP smear every 3 years, and screening stops after 65.'
                },
                {
                    q: 'A 33-year-old with 1-year amenorrhea following D&C for AUB. No response to progesterone or combined E+P withdrawal. FSH normal. Most likely diagnosis?',
                    options: ['Kallmann syndrome', 'Sheehan syndrome', 'Asherman syndrome', 'PCOS'],
                    answer: 2,
                    explanation: 'Post-D&C amenorrhea + no hormonal withdrawal bleed + normal FSH = intrauterine adhesions (Asherman).'
                }
                ,
                {
                    q: 'A 26-year-old has oligomenorrhoea, hirsutism and acanthosis nigricans. How many Rotterdam criteria are required to diagnose PCOS?',
                    options: ['2 of 3', 'All 3', '1 of 3', 'Ultrasound findings alone'],
                    answer: 0,
                    explanation: 'PCOS requires 2 of 3 Rotterdam criteria: oligo/anovulation, clinical or biochemical hyperandrogenism, and polycystic ovaries on ultrasound. The LH:FSH ratio is classically about 3:1.'
                },
                {
                    q: 'A woman with PCOS wants to conceive. After lifestyle modification, what is the first-line treatment for her infertility?',
                    options: ['Clomiphene', 'Combined oral contraceptive pill', 'Metformin alone', 'Immediate IVF'],
                    answer: 0,
                    explanation: 'Lifestyle modification is first-line for all PCOS. Then treat by problem: infertility → clomiphene; menstrual irregularity → OCP; insulin resistance → metformin.'
                },
                {
                    q: 'A haemodynamically stable woman has an unruptured ectopic pregnancy, β-hCG 3000 IU/L, no fetal cardiac activity and a 3 cm adnexal mass. What treatment is appropriate?',
                    options: ['Methotrexate', 'Emergency laparotomy', 'Expectant management with no follow-up', 'Immediate hysterectomy'],
                    answer: 0,
                    explanation: 'Methotrexate is appropriate when ALL criteria are met: haemodynamically stable/unruptured, β-hCG ≤5000 IU/L, no fetal cardiac activity, mass <4 cm and reliable access to hospital follow-up. Instability or rupture mandates surgery.'
                }
            ]
        },
        {
            id: 'obgyn-urogynecology',
            title: '06 — Urogynecology',
            title_en: 'Urinary Incontinence · Pelvic Organ Prolapse',
            summaryHtml: `
                <h3>6.1 Urinary Incontinence</h3>
                <table>
                    <thead><tr><th>Type</th><th>Mechanism</th><th>Symptom</th><th>Diagnosis</th><th>Treatment</th></tr></thead>
                    <tbody>
                        <tr><td>Stress</td><td>↑ Intra-abdominal pressure</td><td>Dribbling with cough/sneeze</td><td>Cough stress test</td><td>1st: Kegel / pelvic floor exercises; Definitive: Surgery (TVT)</td></tr>
                        <tr><td>Urge</td><td>Spontaneous detrusor contraction</td><td>Urgency + leak</td><td>Urodynamics (spontaneous bladder contraction with small filling)</td><td>Anticholinergics (oxybutynin)</td></tr>
                        <tr><td>Overflow</td><td>Urethral blockage</td><td>Constant dribbling, weak stream, incomplete voiding</td><td>Post-void residual (PVR)</td><td>Treat cause of obstruction</td></tr>
                    </tbody>
                </table>
                <div class="sum-callout"><b>Step 1 for all incontinence</b>: Urinalysis + culture to rule out UTI.</div>

                
                <div class="topic-deck">
<h4 class="deck-topic">Urinary incontinence</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Glycemic control HbA1c &lt;6.5</li><li>Folic acid ≥ 400mg</li><li>Aspirin between 12-28 weeks to reduce risk of pre-eclampsia</li><li>Macrosomia or IUGR</li><li>Hypertension (pre-eclampsia)</li><li>Respiratory distress syndrome (insulin inhibit surfactants which enhance lung maturation)</li><li>Polyhydramnios (secondary to fetal osmotic diuresis due to maternal hyperglycemia)</li><li>Single umbilical artery</li><li>Stress incontinence: due to increased intrabdominal pressure dribbling during cough or sneeze</li><li>Urge incontinence due to spontaneous detrusor contraction urgency and leak</li><li>Overflow incontinence due to urethral blockage constant dribbling of urine, weak stream, feel of incomplete voiding</li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>Approach to incontinence:<ul class="sub"><li>Urinalysis and culture (Rule out UTI)</li><li>Stress incontinence cough stress test</li><li>Urge incontinence urodynamics (shows spontaneous bladder contraction with small bladder filling)</li></ul></li><li>Management:<ul class="sub"><li>Stress incontinence:</li><li>First line Lifestyle modification (Kegel or pelvic floor muscles exercise),</li><li>Definitive Surgery (TVT, tension free vaginal tape)</li><li>Urge incontinence anticholinergics (oxybutynin)</li></ul></li></ul></div></div>
                </div>
<h3>6.2 Pelvic Organ Prolapse</h3>
                <figure class="deck-fig"><div class="deck-fig-title"><span class="deck-tag tag-fig">Diagram</span> Prolapse by compartment</div>
                <svg viewBox="-62 0 824 250" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Cystocele is the upper anterior vaginal wall containing bladder; urethrocele is the lower anterior wall; enterocele is the upper posterior vagina containing small bowel; rectocele is the posterior vaginal wall containing rectum; vault prolapse is at the vaginal apex.">
                <g font-family="system-ui,Arial">
                <path d="M330,30 L330,220" stroke="#334155" stroke-width="3"/><text x="336" y="24" font-size="11" fill="#64748b">vagina</text>
                <text x="200" y="24" text-anchor="middle" font-size="12.5" font-weight="800" fill="#b91c1c">ANTERIOR wall</text>
                <rect x="64" y="42" width="252" height="52" rx="9" fill="#fee2e2" stroke="#ef4444"/><text x="80" y="66" font-size="12.5" font-weight="700" fill="#b91c1c">Cystocele</text><text x="80" y="86" font-size="11.5" fill="#334155">upper anterior — BLADDER</text>
                <rect x="64" y="104" width="252" height="52" rx="9" fill="#ffe4e6" stroke="#fb7185"/><text x="80" y="128" font-size="12.5" font-weight="700" fill="#be123c">Urethrocele</text><text x="80" y="148" font-size="11.5" fill="#334155">lower anterior — URETHRA</text>
                <text x="510" y="24" text-anchor="middle" font-size="12.5" font-weight="800" fill="#1d4ed8">POSTERIOR wall</text>
                <rect x="344" y="42" width="252" height="52" rx="9" fill="#dbeafe" stroke="#3b82f6"/><text x="360" y="66" font-size="12.5" font-weight="700" fill="#1d4ed8">Enterocele</text><text x="360" y="86" font-size="11.5" fill="#334155">upper posterior — SMALL BOWEL</text>
                <rect x="344" y="104" width="252" height="52" rx="9" fill="#e0f2fe" stroke="#38bdf8"/><text x="360" y="128" font-size="12.5" font-weight="700" fill="#0369a1">Rectocele</text><text x="360" y="148" font-size="11.5" fill="#334155">posterior — RECTUM</text>
                <rect x="64" y="168" width="532" height="42" rx="9" fill="#ede9fe" stroke="#8b5cf6"/><text x="330" y="194" text-anchor="middle" font-size="12" font-weight="700" fill="#6d28d9">Vaginal vault prolapse — the apex, often after hysterectomy</text>
                <text x="330" y="234" text-anchor="middle" font-size="11.5" fill="#475569">Conservative: pessary + pelvic floor exercises · Surgery: anterior colporrhaphy (cystocele), posterior colporrhaphy (rectocele), sacrospinous fixation (vault)</text>
                </g></svg>
                <figcaption>Name the prolapse by <b>which wall bulges and what sits behind it</b>. Always measure the <b>post-void residual</b> in a cystocele to exclude bladder outlet obstruction.</figcaption></figure>
                <table>
                    <thead><tr><th>Type</th><th>Herniation</th></tr></thead>
                    <tbody>
                        <tr><td>Cystocele</td><td>Upper anterior vaginal wall (bladder)</td></tr>
                        <tr><td>Urethrocele</td><td>Lower anterior vaginal wall (urethra)</td></tr>
                        <tr><td>Rectocele</td><td>Posterior vaginal wall (rectum)</td></tr>
                        <tr><td>Enterocele</td><td>Upper posterior vagina (small intestine + peritoneum)</td></tr>
                        <tr><td>Vaginal vault prolapse</td><td>Vaginal apex (often post-hysterectomy)</td></tr>
                    </tbody>
                </table>
                <ul>
                    <li><b>Symptoms</b>: Vaginal bulge/pressure; urinary symptoms; bowel symptoms; sexual dysfunction; chronic back pain</li>
                    <li><b>Conservative</b> (small defect, asymptomatic, unfit for surgery): Pessary + pelvic floor exercises</li>
                </ul>
                <table>
                    <thead><tr><th>Condition</th><th>Surgical Procedure</th></tr></thead>
                    <tbody>
                        <tr><td>Uterine/vaginal descent</td><td>Sacrospinous ligament fixation</td></tr>
                        <tr><td>Rectocele</td><td>Posterior colporrhaphy</td></tr>
                        <tr><td>Cystocele</td><td>Anterior colporrhaphy</td></tr>
                        <tr><td>Cystocele + Rectocele + Uterine prolapse</td><td>Manchester operation</td></tr>
                    </tbody>
                </table>
                <div class="sum-callout"><b>Cystocele workup</b>: measure post-void residual (PVR) to rule out bladder obstruction.</div>
            
                
                <div class="topic-deck">
<h4 class="deck-topic">Pelvic organ prolapse</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Cystocele herniation into the upper part of anterior vaginal wall</li><li>Urethrocele herniation into the lower part of anterior vaginal wall</li><li>Rectocele herniation into the posterior vaginal wall</li><li>Enterocele herniation of small intestine and peritoneum into upper posterior vagina</li><li>Vaginal vault prolapse descent of vaginal apex, often after hystectomy</li><li>Vaginal bulge or pressure</li><li>Urinary symptoms: incontinence, urgency, incomplete emptying</li><li>Bowel symptoms: constipation, incomplete evacuation</li><li>Sexual dysfunction</li><li>Chronic back pain</li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>Approach to pelvic organ prolapse:<ul class="sub"><li>History and physical examination (speculum exam)</li><li>Cystocele measure post-voiding residual (to rule out bladder obstruction)</li></ul></li><li>If prolapse confirmed; proceed with management: • Conservative management:<ul class="sub"><li>Indicated in: Small defect, asymptomatic prolapse, co-morbid patient (unfit for surgery)</li><li>Pessary, pelvic floor exercise</li></ul></li><li>Surgery<ul class="sub"><li>Indicated in: Large defect , symptomatic prolapse, healthy woman</li><li>Uterine or vaginal descent sacro-spinus ligament fixation</li><li>Rectocele posterior colporrhaphy</li><li>Cystocele Anterior colporrhaphy</li><li>Cystocele + rectocele + uterine prolapse Manchester operation</li></ul></li></ul></div></div>
                </div>

            `,
            questions: [
                {
                    q: 'A 52-year-old multiparous woman leaks urine when she coughs, sneezes or lifts. There is no urgency and post-void residual is normal. After ruling out UTI, what is the best first-line management?',
                    options: ['Pelvic floor (Kegel) exercises', 'Oxybutynin', 'Tension-free vaginal tape (TVT) sling', 'Indwelling catheter'],
                    answer: 0,
                    explanation: 'Leakage with raised intra-abdominal pressure is stress incontinence. First-line management is conservative — pelvic floor muscle training (Kegels). A mid-urethral sling (TVT) is the definitive surgical option if conservative measures fail. Anticholinergics (oxybutynin) treat urge incontinence.'
                },
                {
                    q: 'A woman reports urgency with involuntary leakage; urodynamics show spontaneous detrusor contractions during bladder filling. Which medication class is first-line?',
                    options: ['Anticholinergic (e.g., oxybutynin)', 'Alpha-blocker', 'Topical estrogen alone', 'Loop diuretic'],
                    answer: 0,
                    explanation: 'Urge incontinence (overactive bladder) is due to spontaneous detrusor contractions. After bladder training, anticholinergics such as oxybutynin (or a β3-agonist like mirabegron) are first-line. Always exclude a UTI first with urinalysis and culture.'
                }
                ,
                {
                    q: 'What is the first step in evaluating any woman presenting with urinary incontinence?',
                    options: ['Urinalysis and culture to exclude UTI', 'Urodynamic studies', 'Immediate TVT surgery', 'Start anticholinergics empirically'],
                    answer: 0,
                    explanation: 'A urinalysis and culture to rule out infection is step 1 for all incontinence, because a UTI can cause or mimic incontinence.'
                },
                {
                    q: 'A woman leaks urine when she coughs or sneezes and has a positive cough stress test. What is first-line management?',
                    options: ['Kegel (pelvic floor) exercises', 'Oxybutynin', 'Immediate sling surgery', 'Indwelling catheter'],
                    answer: 0,
                    explanation: 'Stress incontinence is due to raised intra-abdominal pressure; first-line is pelvic floor (Kegel) exercises, with tension-free vaginal tape (TVT) surgery as the definitive option.'
                },
                {
                    q: 'A woman has urgency followed by leakage, and urodynamics show spontaneous detrusor contractions at small filling volumes. Which treatment is indicated?',
                    options: ['Anticholinergics such as oxybutynin', 'Anterior colporrhaphy', 'Pessary insertion', 'Alpha-blocker'],
                    answer: 0,
                    explanation: 'Urge incontinence results from spontaneous detrusor contraction and is treated with anticholinergics (e.g. oxybutynin). Overflow incontinence is instead assessed with post-void residual and treated by relieving the obstruction.'
                }
            ]
        },
        {
            id: 'obgyn-infertility',
            title: '07 — Infertility, Contraception, Menopause & More',
            title_en: 'Infertility · Contraception · Menopause · Primary Amenorrhea · Infections',
            summaryHtml: `
                <h3>7.1 Infertility</h3>
                <figure class="deck-fig"><div class="deck-fig-title"><span class="deck-tag tag-fig">Diagram</span> Infertility workup — the order of investigation</div>
                <svg viewBox="0 0 700 306" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Infertility workup in order: step 1 history and examination confirming at least 12 months of regular unprotected sex; step 2 semen analysis of the male partner — if abnormal do a hormonal profile of FSH, LH and testosterone, if normal proceed to female investigations; step 3 ovulatory assessment with regular cycles plus FSH, LH, prolactin and mid-luteal progesterone; step 4 tubal patency by HSG as the initial test — unilateral blockage is confirmed by laparoscopy and dye test then treated with clomiphene, bilateral blockage is confirmed by laparoscopy and dye test then treated with IVF.">
                <g font-family="system-ui,Arial">
                <rect x="16" y="16" width="668" height="48" rx="10" fill="#f8fafc" stroke="#cbd5e1"/><circle cx="44" cy="40" r="15" fill="#64748b"/><text x="44" y="45" text-anchor="middle" font-size="14" font-weight="800" fill="#fff">1</text><text x="70" y="45" font-size="12.5" font-weight="700" fill="#0f172a">History &amp; examination</text><rect x="300" y="26" width="372" height="28" rx="7" fill="#fff" stroke="#cbd5e1"/><text x="314" y="45" font-size="11" fill="#334155">confirm ≥12 months of regular unprotected sex</text>
                <rect x="16" y="72" width="668" height="76" rx="10" fill="#eff6ff" stroke="#3b82f6"/><circle cx="44" cy="110" r="15" fill="#3b82f6"/><text x="44" y="115" text-anchor="middle" font-size="14" font-weight="800" fill="#fff">2</text><text x="70" y="106" font-size="12.5" font-weight="700" fill="#1d4ed8">Semen analysis</text><text x="70" y="124" font-size="10.5" fill="#475569">male partner FIRST</text><rect x="300" y="80" width="372" height="30" rx="7" fill="#fffbeb" stroke="#f59e0b"/><text x="314" y="100" font-size="11" fill="#334155">abnormal → hormonal profile: FSH · LH · testosterone</text><rect x="300" y="116" width="372" height="30" rx="7" fill="#f0fdf4" stroke="#22c55e"/><text x="314" y="136" font-size="11" fill="#334155">normal → proceed to female investigations</text>
                <rect x="16" y="156" width="668" height="48" rx="10" fill="#f5f3ff" stroke="#8b5cf6"/><circle cx="44" cy="180" r="15" fill="#8b5cf6"/><text x="44" y="185" text-anchor="middle" font-size="14" font-weight="800" fill="#fff">3</text><text x="70" y="185" font-size="12.5" font-weight="700" fill="#6d28d9">Ovulatory assessment</text><rect x="300" y="166" width="372" height="28" rx="7" fill="#fff" stroke="#c4b5fd"/><text x="314" y="185" font-size="10.5" fill="#334155">regular cycles + FSH · LH · prolactin · mid-luteal progesterone</text>
                <rect x="16" y="212" width="668" height="76" rx="10" fill="#fef2f2" stroke="#ef4444"/><circle cx="44" cy="250" r="15" fill="#ef4444"/><text x="44" y="255" text-anchor="middle" font-size="14" font-weight="800" fill="#fff">4</text><text x="70" y="246" font-size="12.5" font-weight="700" fill="#b91c1c">Tubal patency</text><text x="70" y="264" font-size="10.5" fill="#475569">HSG = initial test</text><rect x="300" y="220" width="372" height="30" rx="7" fill="#fff" stroke="#fca5a5"/><text x="314" y="240" font-size="11" fill="#334155">unilateral block → laparoscopy + dye → clomiphene</text><rect x="300" y="256" width="372" height="30" rx="7" fill="#fff" stroke="#fca5a5"/><text x="314" y="276" font-size="11" fill="#334155">bilateral block → laparoscopy + dye → IVF</text>
                </g></svg>
                <figcaption>Investigate the <b>male partner first</b> — a semen analysis is cheap and non-invasive. The tubal result decides the endpoint: <b>unilateral → clomiphene, bilateral → IVF</b>.</figcaption></figure>
                <ul>
                    <li><b>Definition</b>: Failure to conceive after 12 months of regular unprotected sex</li>
                    <li><b>RF</b>: Advanced maternal age (&gt;35), smoking</li>
                    <li><b>Etiology</b>: Ovulatory dysfunction (most common) — PCOS, hypothalamic amenorrhea; Tubal factor — PID, endometriosis; Uterine — fibroids, adhesions; Male factors — sperm abnormalities</li>
                </ul>
                <table>
                    <thead><tr><th>Step</th><th>Action</th><th>Details</th></tr></thead>
                    <tbody>
                        <tr><td>1</td><td>History &amp; PE</td><td>Confirm ≥12 months of inability to conceive</td></tr>
                        <tr><td>2</td><td>Male partner: Semen analysis</td><td>If abnormal → hormonal profile (FSH, LH, Testosterone); If normal → proceed with female investigations</td></tr>
                        <tr><td>3</td><td>Female partner: Ovulatory assessment</td><td>Regular cycles + hormonal profile (FSH, LH, prolactin, mid-luteal progesterone to confirm ovulation)</td></tr>
                        <tr><td>4</td><td>Tubal patency: HSG (initial test)</td><td>Unilateral blockage → confirm with laparoscopy + dye test → clomiphene; Bilateral blockage → confirm with laparoscopy + dye test → IVF</td></tr>
                    </tbody>
                </table>

                
                <div class="topic-deck">
<figure class="deck-block algo-flow"><figcaption><span class="deck-tag tag-algo">Algorithm</span> Infertility — workup approach</figcaption><p class="deck-subcap">inability to conceive after ≥12 months of unprotected intercourse</p><div class="algo-row"><div class="algo-node start" style="animation-delay:0.00s">History &amp; physical examination (both partners)</div></div><div class="algo-arrow" style="animation-delay:0.05s"></div><div class="algo-fork"><div class="algo-branch"><span class="algo-label" style="animation-delay:0.12s">Male partner</span><div class="algo-node proc" style="animation-delay:0.12s">Semen analysis</div><div class="algo-arrow mini" style="animation-delay:0.26s"></div><div class="algo-node proc" style="animation-delay:0.22s">Abnormal → hormone profile (FSH, LH, testosterone)</div><div class="algo-arrow mini" style="animation-delay:0.36s"></div><div class="algo-node end" style="animation-delay:0.32s">Normal → proceed to female workup</div></div><div class="algo-branch"><span class="algo-label" style="animation-delay:0.42s">Female partner</span><div class="algo-node proc" style="animation-delay:0.42s">Ovulation: cycles, FSH/LH/prolactin, mid-luteal progesterone</div><div class="algo-arrow mini" style="animation-delay:0.56s"></div><div class="algo-node proc" style="animation-delay:0.52s">Tubal patency → hysterosalpingogram (HSG) — initial test</div><div class="algo-arrow mini" style="animation-delay:0.66s"></div><div class="algo-node proc" style="animation-delay:0.62s">Unilateral block → laparoscopy + dye → ovulation induction (clomiphene)</div><div class="algo-arrow mini" style="animation-delay:0.76s"></div><div class="algo-node end" style="animation-delay:0.72s">Bilateral block → laparoscopy + dye → IVF</div></div></div></figure>
<h4 class="deck-topic">Infertility</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Definition: Failure to conceive after 12 months of regular, unprotected sexual intercourse</li><li>Risk factors: Advanced maternal age (&gt;35), smoking,</li><li>Ovulatory dysfunction (Most common) (PCOS, hypothalamic amenorrhea)</li><li>Tubal factor: (PID, endometriosis)</li><li>Uterine abnormalities: (fibroids, adhesion)</li><li>Male factors: (Sperm abnormalities)</li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>History &amp; PE Period of inability to conceive is ≥12 months</li><li>Male partner:<ul class="sub"><li>Semen analysis</li><li>If abnormal Hormonal profile (FSH, LH, Testosterone)</li><li>If normal proceed with female investigations</li></ul></li><li>Female partner:<ul class="sub"><li>Ovulatory assessment Regular cycles, Hormonal profile (FSH, LH, prolactin, mid-luteal progesterone - to confirm ovulation -)</li><li>Tubal patency assessment Hysterosalpingogram</li><li>Unilateral tube blockage Confirm with laparoscopy and dye test ovulation induction (clomid)</li><li>Bilateral tube blockage Confirm with laparoscopy and dye test In-vitro fertilization</li></ul></li></ul></div></div>
                </div>
<h3>7.2 Menopause</h3>
                <ul>
                    <li><b>Definition</b>: Permanent cessation of periods = end of ovarian function &amp; reproductive capability</li>
                    <li><b>C/P</b>: Menstrual irregularity at older age; Vasomotor symptoms: hot flushes; Mood changes: irritability, depression; Osteoporosis risk increases; Atrophic vaginitis: vulvar irritation, urological symptoms</li>
                    <li><b>Investigations</b>: FSH: Hallmark of menopause (&gt;30–40 IU/L = suggestive); LH: Also elevated (but less than FSH); Estradiol + Progesterone: Both low (ovarian failure)</li>
                </ul>
                <table>
                    <thead><tr><th>Symptom</th><th>1st Line</th><th>2nd Line</th></tr></thead>
                    <tbody>
                        <tr><td>Vasomotor symptoms</td><td>Lifestyle modification</td><td>HRT</td></tr>
                        <tr><td>Intact uterus + vasomotor</td><td>—</td><td>Estrogen + Progesterone</td></tr>
                        <tr><td>Post-hysterectomy + vasomotor</td><td>—</td><td>Estrogen alone</td></tr>
                        <tr><td>Urogenital symptoms</td><td>Topical estrogen</td><td>—</td></tr>
                    </tbody>
                </table>

                
                <div class="topic-deck">
<h4 class="deck-topic">Menopause</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Definition: the stage of women life when her period stop permanently, it marks the end of ovarian function and reproductive capability</li><li>C/P:<ul class="sub"><li>Menstrual irregularity at old age</li><li>Vasomotor symptoms: hot flushes (</li><li>Mood changes: irritability, depression</li><li>Osteoporosis risk increases</li><li>Atrophic vaginitis: vulvar irritation and excoriation, urological symptoms</li></ul></li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>FSH Hall mark of menopause (&gt;30-40 IU/L suggestive of menopause)</li><li>LH Also elevated but less than FSH</li><li>Low Estradiol and progesterone secondary to ovarian failure</li></ul></div><div class="deck-card mgmt"><span class="deck-card-h">Management</span><ul><li>Vasomotor symptoms:<ul class="sub"><li>First line life style modification</li><li>Second line Hormone replacement therapy</li><li>Intact uterus Estrogen + progesterone</li><li>Post-hysterectomy Estrogen alone</li></ul></li><li>Urogenital symptoms Topical estrogen</li></ul></div></div>
                </div>
<h3>7.3 Contraception</h3>
                <table>
                    <thead><tr><th>Method</th><th>Key Points</th></tr></thead>
                    <tbody>
                        <tr><td>Depo-Provera (DMPA)</td><td>Safe in breastfeeding (start 6 wks postnatal); highly effective; long-acting (2 yrs)</td></tr>
                        <tr><td>Progestogen-only pill (POP)</td><td>Safe in breastfeeding; less effective than DMPA</td></tr>
                        <tr><td>OCP (combined)</td><td>NOT recommended in breastfeeding (↑estrogen suppresses milk); ↑DVT/PE risk; C/I CVD; relieves dysmenorrhea/menorrhagia</td></tr>
                        <tr><td>Vaginal ring</td><td>Contains E+P; NOT recommended in breastfeeding</td></tr>
                        <tr><td>IUD</td><td>Side effect: AUB</td></tr>
                    </tbody>
                </table>

                
                <div class="topic-deck">
<div class="deck-block deck-tbl"><div class="deck-cap"><span class="deck-tag tag-tbl">Table</span> Contraception &amp; breastfeeding</div><p class="deck-subcap">safety and key points during lactation</p><table><thead><tr><th>Method</th><th>Breastfeeding</th><th>Key points</th></tr></thead><tbody><tr><td><b>Depo-Provera (IM)</b></td><td>Safe (start 6 wk postpartum)</td><td>Highly effective; long-acting (~2 years)</td></tr><tr><td><b>Progesterone-only pill</b></td><td>Safe (no estrogen)</td><td>Slightly less effective than Depo-Provera</td></tr><tr><td><b>Combined OCP</b></td><td>Not recommended</td><td>Estrogen suppresses milk; ↑ thromboembolic risk (DVT/PE); C/I in cardiovascular disease; relieves dysmenorrhoea/menorrhagia, regulates cycle</td></tr><tr><td><b>Vaginal ring</b></td><td>Not recommended</td><td>Contains estrogen + progesterone (estrogen suppresses milk)</td></tr><tr><td><b>Intrauterine device (IUD)</b></td><td>Safe</td><td>Side-effect: abnormal uterine bleeding</td></tr></tbody></table></div>
                </div>
<h3>7.4 Menstrual Cycle Disorders</h3>
                <p><b>Primary Dysmenorrhea</b></p>
                <ul>
                    <li><b>Definition</b>: Painful menstruation affecting daily activities without pelvic pathology</li>
                    <li>Primary: within 1–2 years of menarche, no pathology</li>
                    <li>Secondary: caused by underlying condition (e.g., endometriosis); age &gt;25, worsening over time</li>
                    <li><b>C/P</b>: Crampy lower abdominal pain before/during menstruation, may radiate to thigh/back; N&amp;V; diarrhea; headache</li>
                    <li><b>Management</b>: Lifestyle (hot packs, exercise) → NSAIDs → Hormonal (OCP)</li>
                </ul>
                <p><b>Premenstrual Syndrome (PMS)</b></p>
                <ul>
                    <li><b>Definition</b>: Cyclic emotional/physical/behavioral symptoms in luteal phase, resolving with menstruation</li>
                    <li><b>C/P</b>: Physical (breast tenderness, bloating, headache, fatigue); Emotional (mood swings = MC, irritability, anxiety, depression)</li>
                    <li><b>Diagnosis</b>: Clinical</li>
                    <li><b>Treatment</b>: Lifestyle → SSRI → OCP (if contraception desired or refractory to SSRI)</li>
                </ul>

                <h3>7.5 Vaginal Infections</h3>
                <table>
                    <thead><tr><th>Infection</th><th>Pathogen</th><th>Discharge</th><th>Microscopy</th><th>Treatment</th></tr></thead>
                    <tbody>
                        <tr><td>Bacterial vaginosis</td><td>Gardnerella vaginalis</td><td>Gray/milky; fishy odor</td><td>Clue cells (granular epithelial cells)</td><td>Metronidazole (patient only)</td></tr>
                        <tr><td>Trichomoniasis</td><td>Trichomonas vaginalis</td><td>Frothy, yellow-green; strawberry cervix</td><td>Flagellated protozoa</td><td>Metronidazole (treat partner)</td></tr>
                        <tr><td>Vaginal yeast</td><td>Candida albicans</td><td>Cottage cheese; odorless</td><td>Pseudohyphae</td><td>Topical azoles</td></tr>
                        <tr><td>Gonorrhea</td><td>N. gonorrhoeae</td><td>Purulent; odorless/malodorous</td><td>Gram-negative diplococci</td><td>Ceftriaxone (treat partner)</td></tr>
                        <tr><td>Chlamydia</td><td>C. trachomatis</td><td>Purulent, bloody; odorless/malodorous</td><td>Poor gram stain</td><td>Azithromycin (treat partner)</td></tr>
                    </tbody>
                </table>

                <h3>7.6 Puberty, Adolescent Gynecology &amp; Primary Amenorrhea</h3>
                <p>All four classic causes present as a 16–17-year-old who has <b>never</b> menstruated. Breast development, pubic/axillary hair and the <b>testosterone level</b> separate them.</p>
                <table>
                    <thead><tr><th>Diagnosis</th><th>Breasts</th><th>Pubic / axillary hair</th><th>Testosterone</th><th>Other clues</th></tr></thead>
                    <tbody>
                        <tr><td><b>MRKH (Müllerian / vaginal agenesis)</b></td><td>Normal</td><td><b>Normal</b></td><td><b>Normal female</b></td><td>46,XX with normal ovaries and normal ovarian function — the only complaint is primary amenorrhoea. Absent/short vagina, absent uterus</td></tr>
                        <tr><td><b>Complete androgen insensitivity (CAIS)</b></td><td>Normal</td><td><b>Little or none</b></td><td><b>High</b> (male range)</td><td>46,XY, testes present, absent uterus</td></tr>
                        <tr><td><b>Functional hypothalamic hypogonadism</b></td><td>Normal (Tanner 5)</td><td>Normal</td><td>Normal</td><td>Athlete / low body weight / dietary restriction / eating disorder → hypogonadotropic hypogonadism. Uterus and vagina are present</td></tr>
                        <tr><td><b>Transverse vaginal septum</b> (outflow obstruction)</td><td>Normal</td><td>Normal</td><td>Normal</td><td><b>Cyclical lower abdominal pain</b>, urinary retention, bulging bluish membrane at the introitus (cryptomenorrhoea)</td></tr>
                    </tbody>
                </table>
                <div class="sum-callout"><b>The single discriminator between MRKH and CAIS is testosterone.</b> Both have normal breasts and no uterus. <b>Normal</b> testosterone with normal pubic hair → MRKH. <b>High</b> (male-range) testosterone with sparse or absent pubic hair → complete androgen insensitivity.</div>

                <figure class="deck-block algo-flow"><figcaption><span class="deck-tag tag-algo">Algorithm</span> Primary amenorrhea with normal breast development</figcaption><p class="deck-subcap">breasts present means oestrogen is working — so ask about the outflow tract and the androgen axis</p><div class="algo-row"><div class="algo-node start" style="animation-delay:0.00s">16–17 y, never menstruated, breasts Tanner 4–5</div></div><div class="algo-arrow" style="animation-delay:0.05s"></div><div class="algo-row"><div class="algo-node dec" style="animation-delay:0.12s">Uterus present on ultrasound?</div></div><div class="algo-arrow" style="animation-delay:0.17s"></div><div class="algo-fork"><div class="algo-branch"><span class="algo-label" style="animation-delay:0.24s">Uterus ABSENT → check testosterone</span><div class="algo-node proc" style="animation-delay:0.24s">Normal female testosterone + normal pubic hair</div><div class="algo-arrow mini" style="animation-delay:0.38s"></div><div class="algo-node end" style="animation-delay:0.34s">MRKH / Müllerian agenesis (46,XX)</div><div class="algo-arrow mini" style="animation-delay:0.48s"></div><div class="algo-node proc" style="animation-delay:0.44s">High (male-range) testosterone + scant pubic hair</div><div class="algo-arrow mini" style="animation-delay:0.58s"></div><div class="algo-node end" style="animation-delay:0.54s">Complete androgen insensitivity (46,XY)</div></div><div class="algo-branch"><span class="algo-label" style="animation-delay:0.64s">Uterus PRESENT</span><div class="algo-node proc" style="animation-delay:0.64s">Cyclical pain, retention, bulging bluish membrane</div><div class="algo-arrow mini" style="animation-delay:0.78s"></div><div class="algo-node end" style="animation-delay:0.74s">Outflow obstruction — imperforate hymen / transverse vaginal septum</div><div class="algo-arrow mini" style="animation-delay:0.88s"></div><div class="algo-node proc" style="animation-delay:0.84s">No pain; athlete, low weight, dietary restriction</div><div class="algo-arrow mini" style="animation-delay:0.98s"></div><div class="algo-node end" style="animation-delay:0.94s">Functional hypothalamic hypogonadism (low FSH/LH)</div></div></div></figure>

                <h3>7.7 Vulvar Lesions — Quick Reference</h3>
                <table>
                    <thead><tr><th>Lesion</th><th>Key Features</th></tr></thead>
                    <tbody>
                        <tr><td>Bartholin cyst</td><td>Cystic mass at 4–8 o'clock on vaginal introitus; non-tender</td></tr>
                        <tr><td>Bartholin abscess</td><td>Same location; painful, red, fluctuant, infected</td></tr>
                        <tr><td>Chancroid</td><td>Painful ulcer + ragged edges + necrotic base + unilateral tender inguinal nodes (H. ducreyi)</td></tr>
                        <tr><td>Syphilis</td><td>Painless genital ulcer</td></tr>
                        <tr><td>Squamous cell carcinoma vulva</td><td>Postmenopausal; chronic irritation/itching; bleeding; pea-sized lump</td></tr>
                        <tr><td>Skin tags</td><td>Soft, pedunculated, brown papules in skin folds; turn blue when traumatized</td></tr>
                        <tr><td>Condylomata acuminata</td><td>Warty lesions from HPV</td></tr>
                    </tbody>
                </table>
            
                
            `,
            questions: [
                {
                    q: 'A 17-year-old has never menstruated. She has normal breast development, sparse pubic and axillary hair, and a testosterone level in the male range. What is the diagnosis?',
                    options: ['Mayer-Rokitansky-Kuster-Hauser syndrome (Mullerian agenesis)', 'Complete androgen insensitivity', 'Congenital hypothyroidism', 'Polycystic ovary syndrome'],
                    answer: 1,
                    explanation: 'Complete androgen insensitivity: 46,XY with primary amenorrhoea, normal breasts, little or no pubic and axillary hair, and a testosterone level within or above the male range. The raised testosterone is what separates it from MRKH.'
                },
                {
                    q: 'A 17-year-old has never menstruated. Breast development, pubic hair and axillary hair are all normal, and her testosterone level is normal for a woman. What is the diagnosis?',
                    options: ['Mayer-Rokitansky-Kuster-Hauser syndrome (Mullerian agenesis)', 'Complete androgen insensitivity', 'Congenital hypothyroidism', 'Turner syndrome'],
                    answer: 0,
                    explanation: 'MRKH (vaginal or Mullerian agenesis): a normal 46,XX karyotype with normal ovaries and normal ovarian function, so secondary sexual characteristics develop normally. It presents with primary amenorrhoea alone, and the testosterone level is normal.'
                },
                {
                    q: 'A 17-year-old competitive gymnast is medically free, Tanner stage 5 on examination, and has never menstruated. What is the most likely diagnosis?',
                    options: ['Hypothalamic hypogonadism', 'Transverse vaginal septum', 'Gonadal agenesis', 'Testicular feminisation'],
                    answer: 0,
                    explanation: 'Amenorrhoea in a young athlete is commonly functional hypothalamic hypogonadism from energy deficit or dietary restriction, giving hypogonadotropic hypogonadism. A transverse vaginal septum would also cause cyclical lower abdominal pain, urinary retention and a bulging bluish membrane.'
                },
                {
                    q: 'A 45-year-old post-TAH + BSO (benign reason) — acute vasomotor symptoms. Most appropriate HRT?',
                    options: ['Transdermal estrogen only patches', 'Levonorgestrel IUD', 'Cyclical E+P', 'Continuous E+P'],
                    answer: 0,
                    explanation: 'Post-hysterectomy → Estrogen alone (no progesterone needed as no uterus).'
                },
                {
                    q: 'A 38-year-old with dysuria + frequency; allergic to sulfa, penicillin, shellfish. Urine: leukocyte esterase +ve. Most appropriate treatment?',
                    options: ['Nitrofurantoin', 'TMP-SMX', 'Cephalexin', 'Amoxicillin'],
                    answer: 0,
                    explanation: 'Allergic to sulfa (r/o TMP-SMX) and penicillin (r/o amoxicillin) → Nitrofurantoin for uncomplicated UTI.'
                },
                {
                    q: 'A 3-year-old girl: vaginal bleeding + pain; soiling pants for 2 weeks despite being toilet-trained; bruises + blood staining on labia majora. Labs normal. Most likely diagnosis?',
                    options: ['Sexual abuse', 'Herpetic vaginitis', 'Precocious puberty', 'Gonorrheal vaginitis'],
                    answer: 0,
                    explanation: 'Vaginal bleeding in a 3-year-old + bruising + behavioral regression (encopresis) = sexual abuse until proven otherwise.'
                },
                {
                    q: 'A 32-year-old G1 at 25 weeks with severe left calf pain + swelling + positive Homans sign. Primary diagnostic modality?',
                    options: ['MRI', 'D-Dimer', 'Venography', 'Compression ultrasonography'],
                    answer: 3,
                    explanation: 'Clinical presentation strongly suggests DVT → compression US is the primary diagnostic test.'
                },
                {
                    q: 'A neonate at 38 wks: cyanotic, floppy. At 5 min: HR 120, irregular/gasping breathing, coughs/cries with stimulation, arms/legs flexed with little movement, rosy body + blue extremities. Apgar score?',
                    options: ['6', '7', '8', '9'],
                    answer: 1,
                    explanation: 'HR 2 + Breathing 1 + Reflex 2 + Activity 1 + Color 1 = 7.'
                },
                {
                    q: 'A 13-year-old: no menarche. Exam: sparse hair on labia majora (not extending to mons pubis), breast buds + papilla + areolar enlargement, no separation in breast contour. Tanner stage?',
                    options: ['Stage I', 'Stage II', 'Stage III', 'Stage IV'],
                    answer: 1,
                    explanation: 'Breast buds (stage 2) + pubic hair on labia but not mons = Tanner II for both.'
                },
                {
                    q: 'A G3P2 at 38 wks: dizziness, light-headedness, fainting when lying in bed. Hb 95 g/L (low), BP 110/70, HR 100. Best management?',
                    options: ['Blood transfusion', 'Refer neurologist', 'Avoid sleeping on back', 'ECG + echo'],
                    answer: 2,
                    explanation: '3rd trimester supine hypotension syndrome: gravid uterus compresses IVC → ↓venous return → hypotension; resolve by lateral decubitus position.'
                }
            ]
        }
    ]
};

export default obgyn;
