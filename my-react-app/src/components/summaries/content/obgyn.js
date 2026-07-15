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
    intro: 'OB/GYN comprehensive modern summary — all topics covered: 01 Obstetrics · 02 Labor & Delivery · 03 Obstetric Complications · 04 Antenatal Care & Fetal Medicine · 05 Gynecology · 06 Urogynecology · 07 Infertility, Contraception, Menopause & More.',
    subtopics: [
        {
            id: 'obgyn-obstetrics',
            title: '01 — Obstetrics',
            title_en: 'Cervical Incompetence · Abortion/IUFD · Hemorrhage · Preterm Labor',
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

                <h3>1.4 Postpartum Hemorrhage (PPH)</h3>
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

                <h3>1.5 Postpartum — Mastitis / Breast Abscess</h3>
                <ul>
                    <li><b>C/P</b>: Tender, indurated, swollen, erythematous breast; malaise; fever; pain during breastfeeding</li>
                    <li><b>Abscess signs</b>: Fluctuant mass + additional skin changes beyond redness</li>
                    <li><b>Organism</b>: Staphylococcus aureus (most common)</li>
                    <li><b>RF</b>: Lactating mother with cracked nipples</li>
                    <li><b>Management</b>: Clinical diagnosis → Anti-staph antibiotics (dicloxacillin/flucloxacillin); US to rule out abscess; CONTINUE breastfeeding</li>
                </ul>
            
                <section class="topic deck-enrich">
                    <h3>Study-deck deep dive</h3>
                    <p class="deck-intro">Every comparison table, animated algorithm and clinical pearl from the high-yield SMLE deck for this topic.</p>
<h4 class="deck-topic">Placenta previa</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Placenta covering internal OS</li><li>Painless vaginal bleeding without rupture of membrane, non-tender abdomen</li><li>Risk factors: Previous cesarean section, Multiple gestation</li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>Avoid Vaginal examination (examination will disrupt placenta and causes severe bleeding)</li><li>TVUS: to localize placenta, if placenta covers internal OS avoid SVD and vaginal exam</li><li>CTG: to assess fetal heart rate</li><li>Treatment: (Placenta previa delivery mode is only C-Section)<ul class="sub"><li>Ideal time for delivery → 36-37 weeks (before normal labor)</li><li>&lt;37 weeks:</li><li>Severe active bleeding or fetal distress → stabilization and cesarean section</li><li>Mild bleeding → Hospitalization for 48 hours, Steroid (&lt;34wks), MgSo4 (&lt;32wks) → Cesarean section at 36-37 weeks</li></ul></li></ul></div></div><h4 class="deck-topic">Placenta abruption</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Separation of the placenta from the uterus</li><li>Painful vaginal bleeding, uterine tenderness.</li><li>Risk factors: Hypertension or Pre-eclampsia, Smoking</li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>Diagnosis is usually clinical based on the clinical presentation</li><li>Treatment: (Based on the fetal, maternal condition and gestational age)<ul class="sub"><li>Unstable mother (regardless fetus status) → Cesarean section</li><li>Stable mother:</li><li>IUFD → Induction of labor</li><li>Reassuring fetus:</li><li>&lt;34 weeks → Hospitalization, steroid (&lt;34 wks), MgSo4 (&lt;32 wks), deliver at ≥36weeks</li><li>34-36 weeks → if contracting → deliver non-contracting → deliver at 36weeks</li><li>Non-reassuring fetus → Cesarean section</li></ul></li></ul></div></div><h4 class="deck-topic">Uterine rupture</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Abdominal pain and tenderness</li><li>Vaginal bleeding, shock</li><li>Sudden stop of uterine contraction</li><li>Loss of fetal station</li><li>Risk factors:<ul class="sub"><li>Previous history of uterine scar (C-section or D&amp;C)</li><li>Induction of labor → Oxytocin or prostaglandin</li><li>Grand parity</li></ul></li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>Clinical diagnosis</li><li>Treatment:<ul class="sub"><li>Stop oxytocin or prostaglandin</li><li>Laparotomy and C-section</li></ul></li></ul></div></div><h4 class="deck-topic">Postpartum hemorrhage</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Primary postpartum hemorrhage → bleeding within 24 hours after delivery</li><li>Secondary postpartum hemorrhage → bleeding 24 hours - 12weeks after delivery</li><li>Uterine atony (most common cause) → soft, boggy, uterus on examination Risk factors:<ul class="sub"><li>Related to mother: Primagravida, multiparity ≥3</li><li>Related to fetus: Large fetus, multiple gestation</li><li>Related to labor: prolonged labor, precipitous labor</li></ul></li><li>Genital tract laceration (2 nd most common cause)</li><li>Retained placenta</li><li>Disseminated intravascular coagulation (DIC)</li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>Check uterine tone (to confirm uterine atony)</li><li>If the uterus is soft, boggy → start uterine massage and uterotonics</li><li>Call for help, Cross match</li><li>Uterotonics:<ul class="sub"><li>Oxytocin (10-40 Units, one dose) (first line)</li><li>Methergine (0.2mg) → C/I in Hypertension</li><li>Carboprost - hemabate- (0.25mg) → C/I in bronchial asthma</li></ul></li><li>SVD PPH: (if failed move to next step)<ul class="sub"><li>Medical</li><li>Bakri ballon</li><li>Stable → embolization Unstable → uterine artery ligation</li><li>Hysterectomy Active management of 3 rd stage of labor → Prevents PPH</li></ul></li><li>C-section PPH: (if failed move to next step)<ul class="sub"><li>Medical</li><li>B lynch</li><li>Stable → uterine artery ligation Unstable or failed ligation → Hysterectomy</li></ul></li><li>Check uterine tone (to confirm uterine atony)</li><li>If the uterus is soft, boggy → start uterine massage and uterotonics</li><li>Call for help, Cross match</li><li>Uterotonics:<ul class="sub"><li>Oxytocin (10-40 Units, one dose)</li><li>Methergine (0.2mg) → C/I in Hypertension</li><li>Carboprost - hemabate- (0.25mg) → C/I in bronchial asthma</li></ul></li><li>SVD PPH: (if failed move to next step)<ul class="sub"><li>Medical</li><li>Bakri ballon</li><li>Stable → embolization Unstable → uterine artery ligation</li><li>Hysterectomy Active management of 3 rd stage of labor → Prevents PPH</li></ul></li><li>C-section PPH: (if failed move to next step)<ul class="sub"><li>Medical</li><li>B lynch</li><li>Stable → uterine artery ligation Unstable or failed ligation → Hysterectomy</li></ul></li></ul></div></div><h4 class="deck-topic">Mastitis / abscess</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Tender, indurated, swollen, erythematous breast Malaise, fever chills</li><li>Pain during breast feeding</li><li>Fluctuant mass, skin changes (beside redness) → Abscess</li><li>Most common organism causes mastitis → staphylococcus aureus Risk factors: Lactating mother → cracked nipples</li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>Mastitis is clinical diagnosis Mastitis → Anti-staph Antibiotics (dicloxacillin, flucloxacillin)</li><li>US to rule out abscess</li><li>Continue breastfeeding</li></ul></div></div><h4 class="deck-topic">Physiological changes during pregnancy</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Estrogen: Most common form of estrogen in pregnancy is estriol Human placental lactogen: Increase insulin resistance → increase risk of maternal diabetes</li><li>HCG: high level of HCG stimulates vomiting centers and TSH receptors → Hyperemesis gravidarum</li><li>Hyperemesis gravidarum: persistent vomiting → dehydration and poor oral intake → glycogen depletion → shift from glucose to lipid → lipolysis → ketonemia → ketonuria (Diagnostic)</li><li>Blood volume → start increasing at 6 th week progressively until it reaches 40-45% at 32-34 weeks Serum Creatinine → as eGFR increases during pregnancy → High Cr clearance → fall in serum Cr</li><li>Cardiac output → increases due to high stroke volume and heart rate</li></ul></div></div>
                </section>
            `,
            questions: [
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
            title_en: 'Stages · CTG · Cord Prolapse · Bishop Score · Episiotomy',
            summaryHtml: `
                <h3>2.1 Normal Delivery — Stages</h3>
                <table>
                    <thead><tr><th>Stage</th><th>Phase</th><th>Time Limit</th><th>Action if exceeded</th></tr></thead>
                    <tbody>
                        <tr><td>Stage 1 — Cervical dilation</td><td>Latent (4–&lt;6 cm)</td><td>Nulliparous: 20 h; Multiparous: 14 h</td><td>Spontaneous ROM at ≥37 wks → IOL</td></tr>
                        <tr><td>Stage 1 — Cervical dilation</td><td>Active (≥4–6 cm)</td><td>—</td><td>4 h adequate contractions, no change → C-section; 6 h inadequate contractions → IOL → C-section if failed</td></tr>
                        <tr><td>Stage 2 — Fetal delivery</td><td>—</td><td>Primigravida 3 h (+1 h epidural); Multigravida 2 h (+1 h epidural)</td><td>≥+2 station → Instrumental delivery; Otherwise → C-section</td></tr>
                        <tr><td>Stage 3 — Placental delivery</td><td>—</td><td>30 minutes</td><td>Manual removal → D&amp;C</td></tr>
                    </tbody>
                </table>

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

                <h3>2.6 Cord Prolapse</h3>
                <ul>
                    <li><b>Definition</b>: Umbilical cord descends below presenting part after membrane rupture → compression → fetal hypoxia</li>
                    <li><b>C/P</b>: Sudden fetal bradycardia after SROM, polyhydramnios, variable decelerations, visible cord on exam</li>
                    <li><b>Treatment</b>: In-utero resuscitation → if head ≥+2 station: Instrumental delivery; otherwise: C-section</li>
                </ul>

                <h3>2.7 Fetal Presentation &amp; Episiotomy</h3>
                <ul>
                    <li><b>Frank breech</b>: Flexed hips + extended knees</li>
                    <li><b>Complete breech</b>: Flexed hips + flexed knees</li>
                    <li><b>Incomplete breech</b>: Partially extended/flexed hips + extended knees</li>
                    <li><b>Mediolateral episiotomy advantage</b>: Reduces risk of anal sphincter injury (incision angled away from sphincters)</li>
                </ul>
            
                <section class="topic deck-enrich">
                    <h3>Study-deck deep dive</h3>
                    <p class="deck-intro">Every comparison table, animated algorithm and clinical pearl from the high-yield SMLE deck for this topic.</p>
<div class="deck-block deck-tbl"><div class="deck-cap"><span class="deck-tag tag-tbl">Table</span> Bishop scoring system</div><p class="deck-subcap">assesses cervical favourability for induction of labour</p><table><thead><tr><th>Score</th><th>Dilation (cm)</th><th>Position</th><th>Effacement (%)</th><th>Station (−3 to +3)</th><th>Consistency</th></tr></thead><tbody><tr><td><b>0</b></td><td>Closed</td><td>Posterior</td><td>0–30</td><td>−3</td><td>Firm</td></tr><tr><td><b>1</b></td><td>1–2</td><td>Mid-position</td><td>40–50</td><td>−2</td><td>Medium</td></tr><tr><td><b>2</b></td><td>3–4</td><td>Anterior</td><td>60–70</td><td>−1 to 0</td><td>Soft</td></tr><tr><td><b>3</b></td><td>5–6</td><td>—</td><td>80</td><td>+1, +2</td><td>—</td></tr></tbody></table><ul class="deck-tbl-notes"><li>Bishop ≤3 → unfavourable; induction unlikely to succeed → cervical ripening recommended</li><li>Bishop 4–5 → unfavourable cervix; induction may fail → cervical ripening recommended</li><li>Bishop 6–8 → intermediate / moderately favourable → induction may succeed</li><li>Bishop ≥9 → favourable cervix → labour likely spontaneous or induction likely to succeed</li></ul></div><h4 class="deck-topic">Normal delivery</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Stage 1 (cervix dilation):<ul class="sub"><li>Latent phase → 4-&lt;6cm (nulliparous → 20 hours, multiparas → 14 hours)</li><li>Spontaneous rupture of membrane, &gt;37 weeks → Induction of labor</li><li>Active phase → &gt;4-6cm.</li><li>4 hours of adequate uterine contraction without cervical change → C-section</li><li>6 hours of inadequate uterine contraction without cervical change → IOL → C-section (if failed)</li></ul></li><li>Stage 2 (delivery of fetus):<ul class="sub"><li>3 hours in primigravida</li><li>2 hours In multigravida</li><li>+1 hour in epidural anesthesia</li><li>if delivery of fetus takes more than that → obstructed labor:</li><li>At station +2 or more → instrumental delivery</li><li>Otherwise → C-section Stage 3 (delivery of placenta): Wait for 30 minutes → manual removal → Dilation and curettage</li></ul></li></ul></div></div><h4 class="deck-topic">Labor and delivery</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Early decelerations → fetal head compression → starts as mirror of contraction Variable decelerations → umbilical cord compression → starts at the end of contraction Late decelerations → uteroplacental insufficiency</li><li>C-section indications:<ul class="sub"><li>Fetal distress (non-reassuring CTG)</li><li>Obstructed labor</li><li>After 4 hours of adequate uterine contraction in active phase of labor</li><li>Non - cephalic presentation</li></ul></li><li>Induction of labor → is the process of artificially started labor → indicated before labor onset Augmentation of labor → interventions used to strengthen the labor that already begins → used if uterine contractions are weak or inadequate</li><li>Cat -1 (reassuring CTG) → Fetal CTG shows all of the following:<ul class="sub"><li>Heart rate 110-16</li><li>Accelerations</li><li>Early decelerations</li><li>Treatment → routine surveillance Cat- 2 (non-reassuring CTG) → if CTG is not CAT 1 or 3</li><li>Lateral reposition (improve uteroplacental blood flow and relieve cord compression)</li><li>O2, IV fluid</li><li>Stop oxytocin</li><li>Tocolytic Cat - 3 (non-reassuring CTG) → at least on of the following:</li><li>Absent variability with recurrent variable decelerations.</li><li>Absent variability with recurrent late decelerations.</li><li>Absent variability with bradycardia</li><li>Sinusoidal pattern for at least 20 minutes</li><li>Treatment → in-utero resuscitation + prepare for delivery</li></ul></li></ul></div></div><h4 class="deck-topic">Cord Prolapse</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Definition: Occurs when umbilical cord descends below the presenting part of the fetus, after membrane rupture it can lead to cord compression and fetal hypoxia C/P:<ul class="sub"><li>Sudden Fetal bradycardia after spontaneous rupture of the membrane</li><li>Polyhydramnios</li><li>Variable decelerations</li><li>Visible cord at the vaginal exam</li></ul></li></ul></div><div class="deck-card mgmt"><span class="deck-card-h">Management</span><ul><li>In-utero resuscitation Delivery:<ul class="sub"><li>If the head at +2 station or more → Instrumental delivery</li><li>Otherwise → C-section</li></ul></li></ul></div></div><h4 class="deck-topic">CTG</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Early decelerations → fetal head compression → starts as mirror of contraction Variable decelerations → umbilical cord compression Late decelerations → uteroplacental insufficiency → starts at the end of contraction</li><li>MgSo4: Causes minimal or reduced variability Epidural analgesia: causes maternal hypotension → uteroplacental insufficiency → late decelerations</li><li>Oxytocin: Late or prolonged decelerations + uterine hyperstimulation</li></ul></div></div><h4 class="deck-topic">PPROM/ PROM/ Preterm labor</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Premature rupture of membrane (PROM): rupture of the membranes before onset of labor at or after 37 weeks of gestation</li><li>Preterm premature rupture of membrane (PPROM): rupture of the membranes before onset of labor and before 37 weeks of gestation Preterm labor (PL): onset of regular uterine contraction causes cervical dilation before 37 weeks of gestation</li><li>Spontaneous rupture of membrane: natural rupture of membrane lead to amniotic fluid leak during labor</li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>Rupture of membrane confirmed by:<ul class="sub"><li>Sterile speculum examination</li><li>Ferning test</li><li>Nitrazine paper test</li></ul></li></ul></div><div class="deck-card mgmt"><span class="deck-card-h">Management</span><ul><li>PPROM<ul class="sub"><li>&lt;32 weeks → MgSo4</li><li>&lt;34 weeks → Steroids</li><li>Antibiotics → Ampicillin + erythromycin (to prevent infection, prolong time of delivery)</li></ul></li><li>PROM<ul class="sub"><li>Delivery within 24 hours to</li></ul></li><li>reduce infection risk<ul class="sub"><li>GBS prophylaxis if positive or</li></ul></li><li>unknown<ul class="sub"><li>Tocolysis not preferred due to</li></ul></li><li>increase risk of infection</li><li>Delivery in: • Chorioamnionitis • Placental abruption • Non-reassuring CTG • High risk of cord prolapse</li></ul></div></div>
                </section>
            `,
            questions: [
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
            title_en: 'Pre-eclampsia · GDM · DM · Multiple Gestation · Immunization',
            summaryHtml: `
                <h3>3.1 Pre-eclampsia / Eclampsia / Gestational Hypertension</h3>
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
            
                <section class="topic deck-enrich">
                    <h3>Study-deck deep dive</h3>
                    <p class="deck-intro">Every comparison table, animated algorithm and clinical pearl from the high-yield SMLE deck for this topic.</p>
<div class="deck-block deck-tbl"><div class="deck-cap"><span class="deck-tag tag-tbl">Table</span> Types of abortion</div><p class="deck-subcap">clinical, ultrasound &amp; management differences</p><table><thead><tr><th>Type</th><th>Clinical presentation</th><th>Ultrasound</th><th>Management</th></tr></thead><tbody><tr><td><b>Complete</b></td><td>Cervix closed; bleeding; complete passage of products of conception (POC)</td><td>No POC; no fetal activity</td><td>OPD follow-up</td></tr><tr><td><b>Incomplete</b></td><td>Cervix dilated; partial passage of POC, remainder in cervix/uterus</td><td>Some retained POC; no fetal activity</td><td>Expectant (if &lt;13 wk) · Medical (≤20 wk): misoprostol · D&amp;C (≤20 wk)</td></tr><tr><td><b>Inevitable</b></td><td>Cervix dilated; bleeding; no passage of POC; POC visible in cervical canal</td><td>POC present; fetal activity may be present</td><td>Misoprostol or D&amp;C · surgical D&amp;C if severe hemorrhage / hemodynamic instability</td></tr><tr><td><b>Missed</b></td><td>Cervix closed; no bleeding; no passage of POC</td><td>Fetus dead in utero; no fetal activity</td><td>Misoprostol or D&amp;C</td></tr><tr><td><b>Threatened</b></td><td>Cervix closed; bleeding; no passage of POC</td><td>POC present; fetal activity present</td><td>Expectant · resume normal physical activity</td></tr></tbody></table></div><h4 class="deck-topic">Cervical incompetence</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Painless cervical dilation leads to pregnancy loss or preterm birth in the absence of other causes</li><li>Occurs in second trimester (usually 16-24 weeks)</li><li>C/P: unexpected rupture of the membrane, 2 nd trimester pregnancy loss, fetal membrane herniation</li></ul></div><div class="deck-card mgmt"><span class="deck-card-h">Management</span><ul><li>Previous history of second trimester pregnancy loss?</li><li>No → US screening at 20 weeks of gestation: • Cervical length &gt;25mm → Routine care • Cervical length &lt;25mm → Vaginal progesterone</li><li>Yes → offer prophylactic cerclage based on gestational age: • 13-14 weeks → Cerclage • 15-23 weeks → Serial TVUS (if cervical length &lt;25mm ) → cerclage before 24 weeks</li><li>Cerclage is not generally recommended after 24 weeks</li></ul></div></div><h4 class="deck-topic">Abortion / IUFD / IUGR</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Intrauterine fetal demise: fetal death≥20 weeks of gestation or weight &gt;350 grams</li><li>Abortion: Loss of pregnancy before 20 weeks of gestation</li><li>Most common cause of: 1 st trimester pregnancy loss → chromosomal abnormalities ( Next step → karyotyping) 2 nd trimester pregnancy loss → cervical incompetence</li><li>Risk of abortion increases with increase maternal age especially after 35.</li><li>Approach to abortion:<ul class="sub"><li>History &amp; Pelvic examination: (assess for cervical dilation, products of conception, other causes of bleeding )</li><li>Transvaginal ultrasound: (assess for fetus cardiac activity and whether it present or not)</li><li>treatment based on the type of abortion and clinical presentation</li></ul></li></ul></div></div><h4 class="deck-topic">Gestational diabetes / GDM</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Normal pregnancy is diabetogenic state → Placental secreter human placental lactogen → reduce the insulin sensitivity → this makes glucose more available to the fetus</li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>Time: 24-28 weeks (early screening is recommended if there is a previous history of GDM)</li><li>2 steps approach:<ul class="sub"><li>1 hour 50grams OGTT → If positive go to next step</li><li>3 hours 100 grams OGTT → Diagnostic</li></ul></li><li>1 step approach: • 2 hours 75grams OGTT</li></ul></div><div class="deck-card mgmt"><span class="deck-card-h">Management</span><ul><li>Initial management → diet and exercise</li><li>Best management → Insulin</li></ul></div></div><h4 class="deck-topic">Diabetes before pregnancy</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Glycemic control → HbA1c &lt;6.5</li><li>Folic acid → ≥ 400mg</li><li>Aspirin → between 12-28 weeks to reduce risk of pre-eclampsia</li><li>Macrosomia or IUGR</li><li>Hypertension (pre-eclampsia)</li><li>Respiratory distress syndrome (insulin inhibit surfactants which enhance lung maturation) Polyhydramnios (secondary to fetal osmotic diuresis due to maternal hyperglycemia)</li><li>Single umbilical artery</li></ul></div></div><h4 class="deck-topic">Multiple gestation</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Dizygotic twins → always dichorionic diamniotic twins, can be same same or different sex.</li><li>Monozygotic twins → membranes vary based on timing of division:<ul class="sub"><li>0-3 days → Dichorionic Diamniotic twins</li><li>4-8 days → Monochorionic Diamniotic twins</li><li>9-12 days → Monochorionic Monoamniotic twins</li><li>&gt;13 days → conjoined twins</li></ul></li><li>Based on fetal presentation:<ul class="sub"><li>Spontaneous vaginal delivery → Cephalic - Cephalic or Cephalic - Breech presentation</li><li>Cesarean section → if twin A is presenting in non-cephalic presentation</li></ul></li></ul></div></div><h4 class="deck-topic">Pre-eclampsia - Eclampsia / gHTN</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Chronic hypertension: hypertension starts before 20 weeks of gestation or before pregnancy</li><li>Gestational Hypertension: Hypertension starts after 20 weeks of gestation without proteinuria or end organ dysfunction Pre-eclampsia: gestational hypertension with proteinuria or end-organ dysfunction</li><li>Eclampsia: severe form of pre-eclampsia with convulsive seizure</li><li>Abnormal placentation secretes anti-angiogenic factors lead to endothelial dysfunction → fluid leakage → reduce release of vasodilators → Vasoconstriction → Hypertension</li><li>Multiple gestations → 2 placentas secretes more anti-angiogenic factors → higher risk of Pre-eclampsia</li><li>Blood pressure &gt;160/110 or End-organ dysfunction:</li><li>CNS dysfunction symptoms: Severe headache or persistent headache despite analgesics, Visual disturbance Renal abnormality: Cr &gt;1.1 mg/dl Hepatic abnormality: &gt; 2folds increase of transaminase, epigastric or RUQ pain (secondary to hepatic capsule distension) Thrombocytopenia: &lt;100,000 platelets/microL Pulmonary edema: dyspnea, chest pain, Spo2 &lt;93</li><li>Oral Treatment: First line → labetalol Second line → Methyldopa</li><li>IV Treatment: First line → labetalol Second line → Hydralazine</li><li>Symptoms:<ul class="sub"><li>Loss of reflexes</li><li>Respiratory depression</li></ul></li><li>Management:<ul class="sub"><li>Stop → MgSo4 (To prevent further seizure)</li><li>Start → Calcium gluconate</li><li>Delivery → IOL</li></ul></li><li>Blood pressure &gt;160/110 or End-organ dysfunction:</li><li>CNS dysfunction symptoms: Severe headache or persistent headache despite analgesics, Visual disturbance Renal abnormality: Cr &gt;1.1 mg/dl Hepatic abnormality: &gt; 2folds increase of transaminase, epigastric pain (secondary to hepatic capsule distension) Thrombocytopenia: &lt;100,000 platelets/microL Pulmonary edema: dyspnea, chest pain, Spo2 &lt;93</li></ul></div><div class="deck-card mgmt"><span class="deck-card-h">Management</span><ul><li>Mild pre-eclampsia (&lt;140/90) → out patient treatment:<ul class="sub"><li>&lt;37 weeks → oral treatment + Follow up</li><li>≥ 37 weeks → oral treatment + induction of labor</li><li>≥ 34 weeks with PPROM → oral treatment + induction of labor</li></ul></li><li>Severe pre-eclampsia: (&gt;160/110 or end-organ dysfunction):<ul class="sub"><li>&lt;34 weeks (could be earlier incase of maternal or fetal deterioration): • Admission • Steroid (if &lt;32weeks) • MgSo4 (To prevent eclampsia or seizure) • IV labetalol (to prevent maternal complications like stroke)</li></ul></li><li>&gt;34 weeks: • As above + Induction of labor</li><li>ABC<ul class="sub"><li>Magnesium sulphate (To control seizure)</li><li>Delivery → IOL</li></ul></li></ul></div></div><h4 class="deck-topic">Ectopic pregnancy</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Definition: implantation of the fertilized ovum outside of the uterus</li><li>Risk factors:<ul class="sub"><li>Previous ectopic pregnancy (the most significant risk factor)</li><li>Pelvic inflammatory disease (PID)</li><li>Previous abdominal or pelvic surgery</li><li>In-vitro fertilization (IVF)</li></ul></li><li>Lower abdominal pain</li><li>Vaginal spotting</li><li>Amenorrhea</li><li>Adnexal mass or tenderness</li><li>If ruptured hemodynamic instability, shoulder pain, guarding or rigidity.</li></ul></div><div class="deck-card mgmt"><span class="deck-card-h">Management</span><ul><li>Positive B-HCG (raises slower than uterine pregnancy</li><li>TVUS:<ul class="sub"><li>No intrauterine gestational sac when B-HCG &gt;1500 IU/L</li><li>Adnexal mass or free fluid (associated with rupture)</li></ul></li><li>Treatment:<ul class="sub"><li>Methotrexate: (if fulfil requirements)</li><li>Hemodynamic stable (no rupture)</li><li>B-HCG ≤ 5000 IU/L</li><li>No fetal cardiac activity</li><li>Ectopic mass &lt; 4cm</li><li>Accessible to a hospital</li><li>Measure B-HCG at day 4,7:</li><li>Plateau or decrease &lt;15% consider second dose of MTX</li><li>Rising B-HCG Surgical management</li><li>Decrease &gt;15% Follow-Up</li></ul></li><li>Surgical management:<ul class="sub"><li>Indicated incase:</li><li>Hemodynamic unstable (Ruptured)</li><li>Contraindications of methotrexate</li><li>Failed medical treatment</li></ul></li><li>Laparoscopy (preferred) or laparotomy (to choose between salpingectomy or salpingostomy)<ul class="sub"><li>Salpingostomy: removal of the ectopic with tube preservation (requires B-HCG follow-up)</li><li>If B-HCG plateau or increased persistent trophoblast single dose of methotrexate</li><li>If decrease &gt;15% weekly F/U until B-HCG undetectable</li></ul></li><li>Salpingectomy: removal of the fallopian tube<ul class="sub"><li>Single B-HCG to confirm B-HCG drop</li></ul></li></ul></div></div><h4 class="deck-topic">Gestational trophoblastic diseases</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>A Group of disorders arising from abnormal proliferation of trophoblastic tissue after abnormal fertilization</li><li>Benign: Complete (precancerous) and partial mole</li><li>Cancerous: choriocarcinoma</li><li>Persistent of irregular vaginal bleeding after pregnancy</li><li>Symptoms of metastasis:<ul class="sub"><li>Lungs hemoptysis</li><li>Vagina fragile bleeding mass</li></ul></li><li>Diagnosis: (clinical diagnosis, without biopsy)<ul class="sub"><li>Staging chest x-ray (lung metastasis)</li></ul></li><li>Treatment: chemotherapy</li><li>First trimester painless vaginal bleeding</li><li>Uterus larger than gestational age</li><li>Hyperemesis gravidarum</li><li>Passes vesicles or tissue</li><li>Diagnosis:<ul class="sub"><li>B-HCG Very high &gt;100,000 IU/L</li><li>US snow storm or cluster of grapes appearance</li></ul></li><li>Treatment:<ul class="sub"><li>Suction and evacuation followed by B-HCG surveillance</li><li>Baseline B-HCG</li><li>Within 48 hours if increasing or plateau refer to oncology for staging and chemotherapy</li><li>Weekly until undetectable (for 3 weeks)</li><li>Monthly (for 6 months)</li></ul></li></ul></div></div>
                </section>
            `,
            questions: [
                {
                    q: 'A 39-year-old primigravida at 39 wks — cervix 2 cm, 90% effaced, 0 station. BP 140/90. Urine dipstick positive for protein. Most appropriate management?',
                    options: ['Induction of labor', 'Immediate C-section', 'Admission for observation', 'Outpatient observation till 40 wks'],
                    answer: 0,
                    explanation: 'Mild pre-eclampsia at ≥37 wks → IOL.'
                }
            ]
        },
        {
            id: 'obgyn-antenatal',
            title: '04 — Antenatal Care & Fetal Medicine',
            title_en: 'Prenatal Care · Fetal Medicine · Physiological Changes',
            summaryHtml: `
                <h3>4.1 Prenatal Care</h3>
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
            
                <section class="topic deck-enrich">
                    <h3>Study-deck deep dive</h3>
                    <p class="deck-intro">Every comparison table, animated algorithm and clinical pearl from the high-yield SMLE deck for this topic.</p>
<h4 class="deck-topic">Rh isoimmunization</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Occurs when Rh negative mother carries Rh positive fetus</li><li>Fetal RBC enter maternal circulation (During delivery, trauma), then maternal immune system produce IgG anti-d antibodies In future pregnancies: IgG crosses placenta → Hemolysis of fetal RBC</li></ul></div><div class="deck-card mgmt"><span class="deck-card-h">Management</span><ul><li>Administer anti-d immunoglobulin to Rh negative mothers at:<ul class="sub"><li>28 weeks of gestation</li><li>Within 72hours postpartum if newborn is Rh positive</li><li>After events causes fetomaternal hemorrhage (trauma, amniocentesis, maternal vaginal bleeding)</li></ul></li><li>Dosage: • 300 micrograms covers up to 30ml of fetal whole blood</li></ul></div></div><h4 class="deck-topic">Prenatal care</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Day +7 / Month +9 / year +1 or 0 (Depending on the month)</li><li>Example: LMP 18/5/2020 → 18+7 / 5+9 / 2020 +1 or 0 Estimated delivery date → 25/2/2021</li><li>Prenatal visits: every 4 weeks (until 28weeks), every 2 weeks (until 36 weeks) then weekly</li><li>Folic acid supplements: average risk of neural tube defect → 400 micrograms (0.4mg) High risk of neural tube defects (previous Hx of NTD) → 4mg daily</li><li>First antenatal US to confirm gestational age of pregnancy → at 10-11 weeks Second US (anomaly scan) → at 18-22 weeks ( to R/O congenital anomalies)</li><li>Growth parameters on US: (used to confirm gestational date)<ul class="sub"><li>Crown rump length → First trimester up to 13+6 weeks or unknown</li><li>Abdominal circumference → after 13+6 weeks (most sensitive growth parameter) Urine culture → to rule out asymptomatic bacteruia → start antibiotic if culture is positive regardless symptoms or not</li></ul></li></ul></div></div><h4 class="deck-topic">Fetal medicine</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>High → HCG , Inhibin Low → Estriol, Maternal serum alpha fetoprotein</li><li>To remember → Any marker have H is high , the others are low</li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>History<ul class="sub"><li>Fetal movement assessment: Ask the mother about to perform kick count</li><li>If &lt;10 kicks in 2 hours → proceed to next step</li><li>Non-stress test: to assess Fetal heart rate</li><li>US or biophysical profile</li><li>Umbilical artery doppler: if IUGR or placental insufficiency suspected</li></ul></li></ul></div></div>
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
            ]
        },
        {
            id: 'obgyn-gynecology',
            title: '05 — Gynecology',
            title_en: 'PCOS · Endometriosis · Fibroids · Cervical Cancer · Ectopic',
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

                <h3>5.2 Ectopic Pregnancy</h3>
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

                <h3>5.3 Ovarian Diseases</h3>
                <table>
                    <thead><tr><th>Condition</th><th>C/P</th><th>Diagnosis</th><th>Treatment</th></tr></thead>
                    <tbody>
                        <tr><td>Ovarian Torsion</td><td>Sudden unilateral pelvic pain, N&amp;V, adnexal tenderness, NO vaginal bleeding</td><td>Pelvic US with Doppler: absent/decreased ovarian blood flow; enlarged edematous ovary</td><td>Detorsion (if viable); Cystectomy/oophorectomy (if malignant suspected)</td></tr>
                        <tr><td>Ovarian Cancer</td><td>Abdominal bloating, early satiety, abdominal pain, weight loss</td><td>TVUS + CA-125 (epithelial tumor) + CT/MRI for staging</td><td>Surgical staging (LN sampling, TAH/oophorectomy) + Adjuvant chemotherapy</td></tr>
                    </tbody>
                </table>

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
                    <li><b>C/P (3 Ds + Menorrhagia)</b>: Dysmenorrhea, Dyspareunia, Diffuse uterine enlargement, Menorrhagia</li>
                    <li><b>Diagnosis</b>: Pelvic exam: diffuse boggy uterus; TVUS: myometrial thickening</li>
                    <li><b>Management</b>: Medical: IUD/OCP; Definitive: Hysterectomy</li>
                </ul>
                <p><b>Endometrial Polyp</b></p>
                <ul>
                    <li><b>C/P</b>: Menorrhagia or intermenstrual bleeding</li>
                    <li><b>Diagnosis</b>: Initial: TVUS; Confirmatory: Hysteroscopy</li>
                    <li><b>Management</b>: Asymptomatic small &lt;1cm: observe; Symptomatic/large: Hysteroscopic polypectomy</li>
                </ul>

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

                <h3>5.9 Gestational Trophoblastic Disease (GTD)</h3>
                <ul>
                    <li><b>Definition</b>: Disorders from abnormal proliferation of trophoblastic tissue after abnormal fertilization</li>
                    <li><b>Types</b>: Benign: Complete mole (precancerous) / Partial mole; Cancerous: Choriocarcinoma</li>
                </ul>
                <p><b>Complete Mole:</b> 1st trimester painless vaginal bleeding, uterus larger than GA, hyperemesis, passage of vesicles. β-hCG: &gt;100,000 IU/L (very high). US: Snowstorm / cluster of grapes appearance. Treatment: Suction + evacuation → β-hCG surveillance (baseline → weekly until undetectable ×3 weeks → monthly ×6 months).</p>
                <p><b>Choriocarcinoma:</b> Persistent irregular vaginal bleeding after pregnancy; Metastasis: Lungs → hemoptysis; Vagina → fragile bleeding mass. Diagnosis: Clinical (NO biopsy). Staging: Chest X-ray (lung metastasis). Treatment: Chemotherapy.</p>
            
                <section class="topic deck-enrich">
                    <h3>Study-deck deep dive</h3>
                    <p class="deck-intro">Every comparison table, animated algorithm and clinical pearl from the high-yield SMLE deck for this topic.</p>
<h4 class="deck-topic">Polycystic ovarian syndrome</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Irregular or absent menstrual cycle</li><li>Hirsutism, acne, oily skin Obesity and central weight gain Infertility or subfertility</li><li>Insulin resistance signs: Acanthosis nigricans, hyperglycemia</li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>Diagnosis: • Required 2 out of:<ul class="sub"><li>Oligo/anovulation</li><li>Clinical or biochemical hyperandrogenism</li><li>US shows polycystic ovaries • LH:FSH ratio 3:1 • Testosterone level → to assess hirsutism • Glucose and lipid profile</li></ul></li></ul></div></div><h4 class="deck-topic">Ovarian torsion</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>sudden onset of unilateral pelvic pain</li><li>Nausea, vomiting On examination: Adnexal tenderness No vaginal bleeding</li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>Diagnosis:<ul class="sub"><li>Pelvic US with doppler: • Absent or decreased ovarian blood flow • Enlarged, edematous ovary</li></ul></li><li>Treatment: • Detorsion (if viable) • Cystectomy or oophorectomy (if malignant mass suspected)</li></ul></div></div><h4 class="deck-topic">Ovarian cancer</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Abdominal bloating or distension</li><li>Early satiety Abdominal pain Unintentional weight loss</li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>Diagnosis:<ul class="sub"><li>TVUS</li><li>CA-125 (Elevated in epithelial ovarian tumor) • CT scan or MRI: for staging</li></ul></li><li>Treatment:<ul class="sub"><li>Surgical staging (LN sampling, tissue biopsy, total abdominal hysterctomy or oophorectomy)</li><li>Adjuvant chemotherapy (After surgery)</li></ul></li></ul></div></div><h4 class="deck-topic">Pelvic inflammatory disease</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Lower abdominal pain or pelvic pain</li><li>Abnormal vaginal discharge Dysuria, dyspareunia On examination: cervical motion tenderness, adnexal tenderness</li></ul></div><div class="deck-card mgmt"><span class="deck-card-h">Management</span><ul><li>Treatment:<ul class="sub"><li>Empirical antibiotics:</li><li>Ceftriaxone</li><li>Doxycycline</li><li>Tubo-ovarian abscess:</li><li>Stable - unruptured abscess → IV antibiotics</li><li>Unstable, ruptured, &gt;9cm, no improvement after 48-72 H of Abx → abscess drainage</li></ul></li></ul></div></div><h4 class="deck-topic">Cervical cancer</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>PAP smear findings ordered from benign to malignant</li><li>ASC-US (Atypical squamous cells of undetermined significance<ul class="sub"><li>ASC-H (Atypical squamous cells, cannot exclude HSIL)</li><li>LSIL (Low grade squamous intraepithelial lesion)</li><li>HSIL (High grade squamous intraepithelial lesion)</li><li>Carcinoma in situ</li><li>Invasive carcinoma</li></ul></li><li>Inconclusive result repeat after 2-4 months<ul class="sub"><li>HSIL, ASCH, cancer Colposcopy</li></ul></li><li>LSIL:<ul class="sub"><li>21-24 Repeat PAP in1 year</li><li>≥25 Colposcopy</li></ul></li><li>ASCUS:<ul class="sub"><li>21-24 Repeat PAP in1 year</li><li>&gt;25= HPV test:</li><li>HPV Positive Colposcopy</li><li>HPV Negative Co-test after 3 years.</li><li>If HPV testing is not a choice Repeat PAP +HPV in 1 year:</li><li>If ASCUS or worse colposcopy</li><li>If Negative Routine screening</li></ul></li><li>Any visible cervical lesion must be evaluated via colposcopy + biopsy to rule out malignancy</li><li>Colposcopy results interpretation:<ul class="sub"><li>Adenocarcinoma in situ (AIS) cold knife biopsy (preserves fertility)</li><li>Other types of carcinoma in situ or invasive cancer LEEP</li></ul></li><li>However, if the patient has non adenocarcinoma in situ and wishes to preserve fertility preserve fertility is the priority proceed with cold knife biopsy</li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>Start screening at age of 21</li><li>21-29 PAP smear (Every 3 years)<ul class="sub"><li>30-65 Co-test (Every 5 years) or PAP smear (Every 3 years)</li><li>&gt;65 Not indicated</li></ul></li></ul></div></div><h4 class="deck-topic">Abnormal uterine bleeding</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Cervix: Scanty post-coital bleeding</li><li>Uterine: Profuse vaginal bleeding</li><li>1 st line IV conjugated estrogen</li><li>Combined oral contraceptive pills</li><li>Oral progesterone</li><li>Tranexamic acid</li><li>In severe refractory bleeding Therapeutic D and C</li><li>IUD merina</li><li>Combined oral contraceptive pills</li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>History and physical examination</li><li>B-HCG: to rule out pregnancy associated conditions (Ectopic pregnancy, abortion)</li><li>CBC: to assess anemia</li><li>TVUS and Endometrial sampling:<ul class="sub"><li>AUB &gt;45 endometrial biopsy</li><li>US finding in post-menopausal women, Proceed with biopsy if:</li><li>&gt;5mm endometrial thickness + abnormal uterine bleeding</li><li>≥11 endometrial thickness if asymptomatic</li><li>&lt;45 with AUB, proceed with biopsy if:</li><li>Chronic unopposed estrogen (PCOS, obesity)</li><li>Persistent AUB despite medical management</li></ul></li></ul></div></div><h4 class="deck-topic">Endometriosis</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Definition: is the presence of endometrial tissue outside of the uterus (most commonly ovaries)</li><li>C/P:<ul class="sub"><li>Dysmenorrhea, dyspareunia, dyschezia</li><li>Infertility</li><li>Chronic pelvic pain</li><li>On examination: normal sized, immpbile retroverted fixed uterus, nodularity of uterosacral ligament</li></ul></li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>Diagnosis:<ul class="sub"><li>Initial test TVUS: chocolate cyst appeared as ground glass appearance</li><li>Confirmatory test Laparoscopy with biopsy</li></ul></li><li>Treatment:<ul class="sub"><li>Medical:</li><li>1 st line OCP, POP (post-menopause)</li><li>2 nd line Intra-uterine device</li></ul></li></ul></div></div><h4 class="deck-topic">Endometrial hyperplasia</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Definition: proliferation of endometrial glands leading to thickening endometrium</li><li>Risk factors:<ul class="sub"><li>Nulliparity, multiparity</li><li>Early menarche, late menopause</li><li>Obesity, DM, PCOS (leads to unopposed estrogen)</li></ul></li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>Diagnosis : Endometrial biopsy</li><li>Treatment:<ul class="sub"><li>Hyperplasia without atypia oral progesterone</li><li>Hyperplasia with atypia:</li><li>Total abdominal hysterectomy</li><li>If the patient wishes to preserve fertility Oral progesterone with follow up</li></ul></li></ul></div></div><h4 class="deck-topic">Endometrial cancer</h4><div class="deck-cards"><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>C/P: Abnormal uterine bleeding, on examination, enlarged uterus</li><li>Diagnosis : Endometrial biopsy</li><li>Staging:<ul class="sub"><li>Laparoscopy</li><li>Para-aortic lymph node dissection</li></ul></li></ul></div></div><h4 class="deck-topic">Fibroid</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Submucosal infertility, Abnormal uterine bleeding, Pressure or heaviness feeling</li><li>Subserosal (MC type) Pressure or heaviness feeling</li><li>Intramural Pressure or heaviness feeling</li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>Diagnosis:<ul class="sub"><li>US initial and diagnostic</li></ul></li><li>Treatment:<ul class="sub"><li>Asymptomatic, incidental finding on US Observation, annual F/U US</li><li>Medical Oral contraceptive pills (OCP), GnRH (used pre-operatively to reduce fibroid size)</li><li>Uterine artery embolization if the patient Refuses surgery</li><li>Surgical (indicated in: Large fibroid (&gt;7cm), failed medical treatment)</li><li>Hysterectomy</li><li>Myomectomy (fertility sparing): • Submucosal fibroid Hysteroscopic resection • Other types Laparoscopic or laparotomy resection</li></ul></li></ul></div></div><h4 class="deck-topic">Endometrial polyp</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>C/P:<ul class="sub"><li>Menorrhagia or intermenstrual bleeding</li></ul></li><li>Diagnosis:<ul class="sub"><li>Initial imaging TVUS</li><li>Confirmatory imaging Hysteroscopy</li></ul></li><li>Management:<ul class="sub"><li>Asymptomatic and small (&lt;1cm) observation</li><li>Symptomatic or large Hysteroscopic polypectomy</li></ul></li></ul></div></div><h4 class="deck-topic">Adenomyosis</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Definition: occurs when endometrial glands and stroma invades myometrium</li><li>C/P: (3Ds)<ul class="sub"><li>Dysmenorrhea</li><li>Dyspareunia</li><li>Diffuse uterine enlargement</li><li>Menorrhagia</li></ul></li><li>Diagnosis:<ul class="sub"><li>Pelvic exam: diffusely enlarged, boggy uterus</li><li>TVUS: myometrial thickening</li></ul></li><li>Management:<ul class="sub"><li>Medical IUD, OCP</li><li>Definitive (severe/refractory) Hysterectomy</li></ul></li></ul></div></div><h4 class="deck-topic">Primary dysmenorrhea</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Definition: painful menstrual affecting daily activities</li><li>Types:<ul class="sub"><li>Primary dysmenorrhea 🡪 occurs without pelvic pathology within 1-2 years of menarche</li><li>Secondary dysmenorrhea 🡪 cause by underlying condition (like endometriosis), &gt;25 years and worsens over time</li></ul></li><li>Crampy lower abdominal pain before or during menstruation, may radiate to the thigh or back</li><li>Nausea, vomiting, diarrhea, headache</li></ul></div><div class="deck-card mgmt"><span class="deck-card-h">Management</span><ul><li>Life style modification: hot packs, exercise</li><li>Non-steroidal anti-inflammatory drugs (NSAID)</li><li>Hormonal therapy: OCP</li></ul></div></div><h4 class="deck-topic">Premenstrual syndrome</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Cyclic emotional, physical, behavioral symptoms occurs during luteal phase of menstrual cycle and resolving with menstruation</li><li>C/P:<ul class="sub"><li>Physical symptoms: breast tenderness, bloating, headache, fatigue</li><li>Emotional / behavioral symptoms: mood swings (MC symptom), irritability, anxiety, depression</li></ul></li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>Clinical diagnosis</li><li>Treatment:<ul class="sub"><li>Life style modification</li><li>SSRI</li><li>OCP (if the patient wishes contraception or refractory to SSRI)</li></ul></li></ul></div></div><div class="deck-block deck-tbl"><div class="deck-cap"><span class="deck-tag tag-tbl">Table</span> Vaginal infections — comparison</div><p class="deck-subcap">pathogen, discharge, microscopy &amp; treatment</p><table><thead><tr><th></th><th>Bacterial vaginosis</th><th>Trichomoniasis</th><th>Vulvovaginal candidiasis</th><th>Gonorrhoea</th><th>Chlamydia</th></tr></thead><tbody><tr><td><b>Pathogen</b></td><td>Gardnerella vaginalis</td><td>Trichomonas vaginalis</td><td>Candida albicans</td><td>Neisseria gonorrhoeae</td><td>Chlamydia trachomatis</td></tr><tr><td><b>Discharge</b></td><td>Gray/milky; fishy odour</td><td>Frothy, yellow-green; strawberry cervix</td><td>Cottage-cheese; odourless</td><td>Purulent; odourless or malodorous</td><td>Purulent, bloody; malodorous</td></tr><tr><td><b>Microscopy</b></td><td>Clue cells (granular epithelial cells)</td><td>Flagellated protozoa</td><td>Pseudohyphae</td><td>Gram-negative diplococci</td><td>Poorly gram-staining</td></tr><tr><td><b>Treatment</b></td><td>Metronidazole (patient only)</td><td>Metronidazole (treat partners)</td><td>Topical azoles</td><td>Ceftriaxone (treat partners)</td><td>Azithromycin (treat partners)</td></tr></tbody></table></div><h4 class="deck-topic">Diabetes before pregnancy</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Glycemic control HbA1c &lt;6.5</li><li>Folic acid ≥ 400mg</li><li>Aspirin between 12-28 weeks to reduce risk of pre-eclampsia</li><li>Macrosomia or IUGR</li><li>Hypertension (pre-eclampsia)</li><li>Respiratory distress syndrome (insulin inhibit surfactants which enhance lung maturation)</li><li>Polyhydramnios (secondary to fetal osmotic diuresis due to maternal hyperglycemia)</li><li>Single umbilical artery</li></ul></div></div>
                </section>
            `,
            questions: [
                {
                    q: 'A 33-year-old with 1-year amenorrhea following D&C for AUB. No response to progesterone or combined E+P withdrawal. FSH normal. Most likely diagnosis?',
                    options: ['Kallmann syndrome', 'Sheehan syndrome', 'Asherman syndrome', 'PCOS'],
                    answer: 2,
                    explanation: 'Post-D&C amenorrhea + no hormonal withdrawal bleed + normal FSH = intrauterine adhesions (Asherman).'
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

                <h3>6.2 Pelvic Organ Prolapse</h3>
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
            
                <section class="topic deck-enrich">
                    <h3>Study-deck deep dive</h3>
                    <p class="deck-intro">Every comparison table, animated algorithm and clinical pearl from the high-yield SMLE deck for this topic.</p>
<h4 class="deck-topic">Urinary incontinence</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Glycemic control HbA1c &lt;6.5</li><li>Folic acid ≥ 400mg</li><li>Aspirin between 12-28 weeks to reduce risk of pre-eclampsia</li><li>Macrosomia or IUGR</li><li>Hypertension (pre-eclampsia)</li><li>Respiratory distress syndrome (insulin inhibit surfactants which enhance lung maturation)</li><li>Polyhydramnios (secondary to fetal osmotic diuresis due to maternal hyperglycemia)</li><li>Single umbilical artery</li><li>Stress incontinence: due to increased intrabdominal pressure dribbling during cough or sneeze</li><li>Urge incontinence due to spontaneous detrusor contraction urgency and leak</li><li>Overflow incontinence due to urethral blockage constant dribbling of urine, weak stream, feel of incomplete voiding</li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>Approach to incontinence:<ul class="sub"><li>Urinalysis and culture (Rule out UTI)</li><li>Stress incontinence cough stress test</li><li>Urge incontinence urodynamics (shows spontaneous bladder contraction with small bladder filling)</li></ul></li><li>Management:<ul class="sub"><li>Stress incontinence:</li><li>First line Lifestyle modification (Kegel or pelvic floor muscles exercise),</li><li>Definitive Surgery (TVT, tension free vaginal tape)</li><li>Urge incontinence anticholinergics (oxybutynin)</li></ul></li></ul></div></div><h4 class="deck-topic">Pelvic organ prolapse</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Cystocele herniation into the upper part of anterior vaginal wall</li><li>Urethrocele herniation into the lower part of anterior vaginal wall</li><li>Rectocele herniation into the posterior vaginal wall</li><li>Enterocele herniation of small intestine and peritoneum into upper posterior vagina</li><li>Vaginal vault prolapse descent of vaginal apex, often after hystectomy</li><li>Vaginal bulge or pressure</li><li>Urinary symptoms: incontinence, urgency, incomplete emptying</li><li>Bowel symptoms: constipation, incomplete evacuation</li><li>Sexual dysfunction</li><li>Chronic back pain</li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>Approach to pelvic organ prolapse:<ul class="sub"><li>History and physical examination (speculum exam)</li><li>Cystocele measure post-voiding residual (to rule out bladder obstruction)</li></ul></li><li>If prolapse confirmed; proceed with management: • Conservative management:<ul class="sub"><li>Indicated in: Small defect, asymptomatic prolapse, co-morbid patient (unfit for surgery)</li><li>Pessary, pelvic floor exercise</li></ul></li><li>Surgery<ul class="sub"><li>Indicated in: Large defect , symptomatic prolapse, healthy woman</li><li>Uterine or vaginal descent sacro-spinus ligament fixation</li><li>Rectocele posterior colporrhaphy</li><li>Cystocele Anterior colporrhaphy</li><li>Cystocele + rectocele + uterine prolapse Manchester operation</li></ul></li></ul></div></div>
                </section>
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
            ]
        },
        {
            id: 'obgyn-infertility',
            title: '07 — Infertility, Contraception, Menopause & More',
            title_en: 'Infertility · Contraception · Menopause · GTD · Infections',
            summaryHtml: `
                <h3>7.1 Infertility</h3>
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
            
                <section class="topic deck-enrich">
                    <h3>Study-deck deep dive</h3>
                    <p class="deck-intro">Every comparison table, animated algorithm and clinical pearl from the high-yield SMLE deck for this topic.</p>
<div class="deck-block deck-tbl"><div class="deck-cap"><span class="deck-tag tag-tbl">Table</span> Contraception &amp; breastfeeding</div><p class="deck-subcap">safety and key points during lactation</p><table><thead><tr><th>Method</th><th>Breastfeeding</th><th>Key points</th></tr></thead><tbody><tr><td><b>Depo-Provera (IM)</b></td><td>Safe (start 6 wk postpartum)</td><td>Highly effective; long-acting (~2 years)</td></tr><tr><td><b>Progesterone-only pill</b></td><td>Safe (no estrogen)</td><td>Slightly less effective than Depo-Provera</td></tr><tr><td><b>Combined OCP</b></td><td>Not recommended</td><td>Estrogen suppresses milk; ↑ thromboembolic risk (DVT/PE); C/I in cardiovascular disease; relieves dysmenorrhoea/menorrhagia, regulates cycle</td></tr><tr><td><b>Vaginal ring</b></td><td>Not recommended</td><td>Contains estrogen + progesterone (estrogen suppresses milk)</td></tr><tr><td><b>Intrauterine device (IUD)</b></td><td>Safe</td><td>Side-effect: abnormal uterine bleeding</td></tr></tbody></table></div><figure class="deck-block algo-flow"><figcaption><span class="deck-tag tag-algo">Algorithm</span> Infertility — workup approach</figcaption><p class="deck-subcap">inability to conceive after ≥12 months of unprotected intercourse</p><div class="algo-row"><div class="algo-node start" style="animation-delay:0.00s">History &amp; physical examination (both partners)</div></div><div class="algo-arrow" style="animation-delay:0.05s"></div><div class="algo-fork"><div class="algo-branch"><span class="algo-label" style="animation-delay:0.12s">Male partner</span><div class="algo-node proc" style="animation-delay:0.12s">Semen analysis</div><div class="algo-arrow mini" style="animation-delay:0.26s"></div><div class="algo-node proc" style="animation-delay:0.22s">Abnormal → hormone profile (FSH, LH, testosterone)</div><div class="algo-arrow mini" style="animation-delay:0.36s"></div><div class="algo-node end" style="animation-delay:0.32s">Normal → proceed to female workup</div></div><div class="algo-branch"><span class="algo-label" style="animation-delay:0.42s">Female partner</span><div class="algo-node proc" style="animation-delay:0.42s">Ovulation: cycles, FSH/LH/prolactin, mid-luteal progesterone</div><div class="algo-arrow mini" style="animation-delay:0.56s"></div><div class="algo-node proc" style="animation-delay:0.52s">Tubal patency → hysterosalpingogram (HSG) — initial test</div><div class="algo-arrow mini" style="animation-delay:0.66s"></div><div class="algo-node proc" style="animation-delay:0.62s">Unilateral block → laparoscopy + dye → ovulation induction (clomiphene)</div><div class="algo-arrow mini" style="animation-delay:0.76s"></div><div class="algo-node end" style="animation-delay:0.72s">Bilateral block → laparoscopy + dye → IVF</div></div></div></figure><h4 class="deck-topic">Infertility</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Definition: Failure to conceive after 12 months of regular, unprotected sexual intercourse</li><li>Risk factors: Advanced maternal age (&gt;35), smoking,</li><li>Ovulatory dysfunction (Most common) (PCOS, hypothalamic amenorrhea)</li><li>Tubal factor: (PID, endometriosis)</li><li>Uterine abnormalities: (fibroids, adhesion)</li><li>Male factors: (Sperm abnormalities)</li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>History &amp; PE Period of inability to conceive is ≥12 months</li><li>Male partner:<ul class="sub"><li>Semen analysis</li><li>If abnormal Hormonal profile (FSH, LH, Testosterone)</li><li>If normal proceed with female investigations</li></ul></li><li>Female partner:<ul class="sub"><li>Ovulatory assessment Regular cycles, Hormonal profile (FSH, LH, prolactin, mid-luteal progesterone - to confirm ovulation -)</li><li>Tubal patency assessment Hysterosalpingogram</li><li>Unilateral tube blockage Confirm with laparoscopy and dye test ovulation induction (clomid)</li><li>Bilateral tube blockage Confirm with laparoscopy and dye test In-vitro fertilization</li></ul></li></ul></div></div><h4 class="deck-topic">Menopause</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Definition: the stage of women life when her period stop permanently, it marks the end of ovarian function and reproductive capability</li><li>C/P:<ul class="sub"><li>Menstrual irregularity at old age</li><li>Vasomotor symptoms: hot flushes (</li><li>Mood changes: irritability, depression</li><li>Osteoporosis risk increases</li><li>Atrophic vaginitis: vulvar irritation and excoriation, urological symptoms</li></ul></li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>FSH Hall mark of menopause (&gt;30-40 IU/L suggestive of menopause)</li><li>LH Also elevated but less than FSH</li><li>Low Estradiol and progesterone secondary to ovarian failure</li></ul></div><div class="deck-card mgmt"><span class="deck-card-h">Management</span><ul><li>Vasomotor symptoms:<ul class="sub"><li>First line life style modification</li><li>Second line Hormone replacement therapy</li><li>Intact uterus Estrogen + progesterone</li><li>Post-hysterectomy Estrogen alone</li></ul></li><li>Urogenital symptoms Topical estrogen</li></ul></div></div>
                </section>
            `,
            questions: [
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
