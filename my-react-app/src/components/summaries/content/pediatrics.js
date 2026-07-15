// Pediatrics — section content for the summaries page. Sourced verbatim from
// "Pediatrics Complete Review — SMLE All-in-One Summary" (90 pages, 17 major
// sections). Each numbered section maps to one subtopic card below; tables are
// reproduced as real HTML tables, algorithms as ordered callouts, and the file's
// embedded MCQs become interactive questions (0-based answer index). Angle
// brackets HTML-escaped.

const pediatrics = {
    id: 'pediatrics',
    title: 'Pediatrics',
    title_en: 'Complete SMLE Review — 17 Systems',
    icon: 'baby',
    accent: '#f59e0b',
    intro: 'Pediatrics complete SMLE review — 17 high-yield systems with algorithms, tables and MCQs: Cardiology · ER/ICU Fluids · Endocrinology · Gastroenterology · General Peds · Genetics · Growth & Development · Heme/Onc · Immunology · Neonatology · Nephrology · Neurology · Pulmonology · Rheumatology · Urology/Ophtho/Ortho · Vaccination · Infectious Disease.',
    subtopics: [
        {
            id: 'peds-cardiology',
            title: '01 — Cardiology',
            title_en: 'Congenital Heart Disease · Murmurs · Rheumatic Fever',
            summaryHtml: `
                <h3>Acyanotic Congenital Heart Disease</h3>
                <ul>
                    <li><b>VSD</b>: small → asymptomatic, may close spontaneously; large → tachypnea, poor feeding, FTT. Harsh <b>holosystolic</b> murmur at LLSB. Small → observe; large → diuretics, surgical closure if not improving by 6–12 months</li>
                    <li><b>ASD</b>: often asymptomatic; <b>wide, fixed split S2</b>; systolic ejection murmur at LUSB. Secundum → transcatheter closure; others → surgery at 4–5 y</li>
                    <li><b>PDA</b>: wide pulse pressure, bounding pulses, continuous <b>"machinery"</b> murmur at LUSB. Indomethacin/ibuprofen (C/I if coarctation or TGA); surgical ligation if medical fails</li>
                </ul>
                <table>
                    <thead><tr><th>Feature</th><th>VSD</th><th>ASD</th><th>PDA</th></tr></thead>
                    <tbody>
                        <tr><td>Murmur</td><td>Harsh holosystolic (LLSB)</td><td>Systolic ejection (LUSB)</td><td>Continuous machinery (LUSB)</td></tr>
                        <tr><td>Key finding</td><td>Loud P2 if large</td><td>Wide fixed split S2</td><td>Wide pulse pressure, bounding pulses</td></tr>
                        <tr><td>ECG</td><td>LVH/BVH</td><td>RAD, RBBB</td><td>LVH</td></tr>
                        <tr><td>Definitive test</td><td colspan="3">Echocardiography (TTE)</td></tr>
                    </tbody>
                </table>

                <h3>Cyanotic Congenital Heart Disease</h3>
                <ul>
                    <li><b>Tetralogy of Fallot</b> (most common cyanotic, <b>PROV</b>: Pulmonary stenosis, RVH, Overriding aorta, VSD): cyanosis worse with crying/feeding; <b>tet spells</b> relieved by squatting. CXR <b>boot-shaped heart</b></li>
                    <li><b>TGA</b>: postnatal cyanosis (first days), single loud S2; CXR <b>egg-shaped heart</b>. Prostaglandin E1 to keep PDA open → arterial switch in first 2 weeks</li>
                    <li><b>Truncus arteriosus</b>: single great vessel, cyanosis + CHF early → surgery</li>
                    <li><b>TAPVR</b>: all pulmonary veins drain to RA/systemic veins, needs ASD → surgery</li>
                    <li><b>Tricuspid atresia</b>: absent tricuspid valve, needs ASD + VSD</li>
                </ul>
                <div class="sum-callout">
                    <b>Algorithm — Tet spell management</b>
                    <ol>
                        <li>Knee-chest position (squatting) — increases SVR</li>
                        <li>Oxygen therapy</li>
                        <li>Morphine (reduces catecholamine surge)</li>
                        <li>IV fluids (volume expansion)</li>
                        <li>Beta-blockers (propranolol) — reduces infundibular spasm</li>
                        <li>Phenylephrine (increases SVR)</li>
                    </ol>
                    Definitive: surgery at 3–6 months
                </div>

                <h3>Vasculopathy — Coarctation of Aorta</h3>
                <ul>
                    <li>Lower-limb cyanosis, weak/delayed femoral pulses, BP <b>upper &gt; lower (&gt;20 mmHg)</b>; associated with <b>Turner syndrome</b></li>
                </ul>
                <div class="sum-callout">
                    <b>Critical coarctation in neonate</b>
                    <ol>
                        <li>Keep PDA open — Prostaglandin E1</li>
                        <li>Manage heart failure — inotropic + respiratory support</li>
                        <li>Surgical repair</li>
                    </ol>
                </div>

                <h3>Murmurs &amp; Rheumatic Fever</h3>
                <table>
                    <thead><tr><th>Feature</th><th>Innocent</th><th>Pathologic</th></tr></thead>
                    <tbody>
                        <tr><td>Timing</td><td>Systolic</td><td>Diastolic or pansystolic</td></tr>
                        <tr><td>Quality</td><td>Soft, musical/vibratory</td><td>Harsh, loud</td></tr>
                        <tr><td>Grade</td><td>1–2/6</td><td>≥3/6</td></tr>
                        <tr><td>Position</td><td>Changes with position</td><td>Fixed</td></tr>
                    </tbody>
                </table>
                <ul>
                    <li><b>Rheumatic fever — Jones (JONES major)</b>: Joints (migratory polyarthritis), carditis, Nodules (subcutaneous), Erythema marginatum, Sydenham chorea. Minor: fever, arthralgia, ↑ESR/CRP, prolonged PR. Need 2 major OR 1 major + 2 minor + evidence of prior GAS</li>
                    <li><b>Treatment</b>: penicillin (eradicate GAS), aspirin/NSAIDs, glucocorticoids for severe carditis, diuretics for HF, haloperidol/valproate for chorea</li>
                </ul>
                <table>
                    <thead><tr><th>RF prophylaxis</th><th>Duration</th></tr></thead>
                    <tbody>
                        <tr><td>Without carditis</td><td>5 years or until age 21 (whichever is longer)</td></tr>
                        <tr><td>With carditis</td><td>10 years or until age 21 (whichever is longer)</td></tr>
                        <tr><td>With carditis + residual heart disease</td><td>10 years or until age 40 (whichever is longer)</td></tr>
                    </tbody>
                </table>
            
                <section class="topic deck-enrich">
                    <h3>Study-deck deep dive</h3>
                    <p class="deck-intro">Every comparison table, animated algorithm and clinical pearl from the high-yield SMLE deck for this topic.</p>
<div class="deck-block deck-tbl"><div class="deck-cap"><span class="deck-tag tag-tbl">Table</span> Congenital heart disease — acyanotic vs cyanotic</div><table><thead><tr><th>Acyanotic (L→R shunt)</th><th>Cyanotic (R→L shunt)</th></tr></thead><tbody><tr><td>Ventricular septal defect (VSD)</td><td>Tetralogy of Fallot</td></tr><tr><td>Atrial septal defect (ASD)</td><td>Transposition of the great arteries</td></tr><tr><td>Patent ductus arteriosus (PDA)</td><td>Tricuspid atresia</td></tr><tr><td>Coarctation of the aorta</td><td>Truncus arteriosus</td></tr><tr><td>Aortic valve stenosis</td><td></td></tr></tbody></table></div><div class="deck-block deck-tbl"><div class="deck-cap"><span class="deck-tag tag-tbl">Table</span> Innocent murmur — the 8 S's</div><p class="deck-subcap">features suggesting a benign (innocent) murmur</p><table><thead><tr><th>The 8 S's</th><th>Meaning</th></tr></thead><tbody><tr><td><b>Soft</b></td><td>Soft intensity</td></tr><tr><td><b>Systolic</b></td><td>Systolic (never purely diastolic)</td></tr><tr><td><b>Short</b></td><td>Short duration</td></tr><tr><td><b>Sounds normal</b></td><td>S1 &amp; S2 normal</td></tr><tr><td><b>Symptomless</b></td><td>No cardiac symptoms</td></tr><tr><td><b>Special tests normal</b></td><td>Normal chest X-ray &amp; ECG</td></tr><tr><td><b>Standing / Sitting</b></td><td>Varies with position</td></tr><tr><td><b>Sternal depression</b></td><td>No thrill / left sternal border location</td></tr></tbody></table></div><h4 class="deck-topic">Ventricular septal defect</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Asymptomatic if small</li><li>Large VSD: tachypnea, poor feeding, failure to thrive, frequent infections</li><li>Harsh systolic murmur at left lower sternal border</li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>Echocardiography (TTE) Confirmatory test</li><li>ECG: LVH or biventricular hypertrophy</li><li>Small, Asymptomatic VSD may close spontaneously Observation</li><li>Large VSD: Diuretics, VSD, Surgery if not improving after 6-12 months</li></ul></div></div><h4 class="deck-topic">Atrial septal defect</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Asymptomatic if small</li><li>Recurrent respiratory infections</li><li>Wide, fixed split S2, systolic murmur at left upper sternal border</li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>Echocardiography (TTE) Confirmatory test</li><li>ECG: Right axis deviation/RBBB</li><li>Observation if small</li><li>Secondum AST Transcatheter closure.</li><li>Other types Surgery at 4-5 Years</li></ul></div></div><h4 class="deck-topic">Teratology of fallot</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Cyanosis worsens with crying or feeding</li><li>Tet spells: Hypoxic spells relieved by squatting</li><li>Poor feeding, failure to thrive</li><li>Murmur of VSD: loud pan-systolic murmur on left upper sternal border</li><li>Pulmonary stenosis</li><li>Right ventricular hypertrophy</li><li>Overriding aorta</li><li>VSD</li><li>Pulmonary stenosis</li><li>Right ventricular hypertrophy</li><li>Overriding aorta</li><li>VSD</li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>Echocardiography (TTE) Confirmatory test for anatomical defects</li><li>CXR: Boot shaped heart, Decrease Vascular marking</li><li>ECG: right axis deviation, RVH</li><li>Oxygenation, Squatting, Morphine, Beta blocker, IV fluid</li><li>Surgery at 3-6 months</li><li>Echocardiography (TTE) Confirmatory test</li><li>ECG: LVH or biventricular hypertrophy</li><li>Small, Asymptomatic VSD may close spontaneously Observation</li><li>Large VSD: Diuretics, VSD, Surgery if not improving after 6-12 months</li><li>Echocardiography (TTE) Confirmatory test</li><li>ECG: LVH or biventricular hypertrophy</li><li>Small, Asymptomatic VSD may close spontaneously Observation</li><li>Large VSD: Diuretics, VSD, Surgery if not improving after 6-12 months</li></ul></div></div><h4 class="deck-topic">Transposition of great arteries</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Postnatal cyanosis (first few days)</li><li>Tachypnea</li><li>Single loud S2</li><li>Diminished femoral pulses</li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>Echocardiography (TTE) Confirmatory test for anatomical defects</li><li>CXR: Egg shaped heart, Increase Vascular marking</li><li>Prostaglandin E1 to prevent closure of PDA</li><li>Surgical correction in first 2 weeks of life</li></ul></div></div><h4 class="deck-topic">Teratology of fallot</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Pulmonary stenosis</li><li>Right ventricular hypertrophy</li><li>Overriding aorta</li><li>VSD</li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>Echocardiography (TTE) Confirmatory test</li><li>ECG: LVH or biventricular hypertrophy</li><li>Small, Asymptomatic VSD may close spontaneously Observation</li><li>Large VSD: Diuretics, VSD, Surgery if not improving after 6-12 months</li></ul></div></div><h4 class="deck-topic">Coarctation of aorta</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Lower limb cyanosis</li><li>Weak femoral pulse</li><li>Blood pressure in upper extremities &gt; Lower extremities</li><li>Systolic ejection murmur at the left posterior hemithorax</li><li>First step Keep PDA open (PGE1)</li><li>Second step Management of HF (inotropic support, respiratory support)</li><li>Third step Surgical management</li></ul></div></div><h4 class="deck-topic">Rheumatic fever</h4><div class="deck-cards"><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>Echocardiography to assess carditis</li><li>Eradication of GAS Penicillin</li><li>Anti-inflammatory therapy Aspirin or Glucocorticoids (incase of severe carditis)</li><li>Management of HF Diuretics</li></ul></div><div class="deck-card mgmt"><span class="deck-card-h">Management</span><ul><li>Rheumatic fever without carditis 5 years or until 21 Y.O (Which is longer)</li><li>Rheumatic fever with carditis 10 years or until 21 Y.O (Which is longer)</li><li>Rheumatic fever with carditis and residual heart disease 10 years or until 40 Y.O (Which is longer)</li></ul></div></div>
                </section>
            `,
            questions: [
                {
                    q: 'A 10-year-old boy is diagnosed with acute rheumatic fever with cardiac involvement. For how many years is rheumatic fever prophylaxis recommended?',
                    options: ['1 year', '5 years', '10 years (or until 21, whichever is longer)', '15 years'],
                    answer: 2,
                    explanation: 'RF with carditis requires 10 years or until age 21 (whichever is longer). Without carditis: 5 years or until 21. With residual heart disease: 10 years or until 40.'
                },
                {
                    q: 'A 12-year-old boy with myopia, scoliosis, pectus excavatum, height >90th percentile, weight <25th percentile. Echo shows MVP and dilated ascending aorta. Diagnosis?',
                    options: ['Aortic dissection', 'Marfan syndrome', 'Congenital syphilis', 'CHARGE association'],
                    answer: 1,
                    explanation: 'Marfan: tall stature, arachnodactyly, pectus excavatum, scoliosis, myopia, MVP, aortic root dilation. AD, FBN1 mutation.'
                }
            ]
        },
        {
            id: 'peds-er-icu',
            title: '02 — ER/ICU & Fluid Replacement',
            title_en: 'DKA · Dehydration & Fluids · Toxicities',
            summaryHtml: `
                <h3>Diabetic Ketoacidosis (DKA)</h3>
                <ul>
                    <li><b>Diagnosis (2 of 3)</b>: glucose ≥200 mg/dL · metabolic acidosis (pH &lt;7.3, HCO3 &lt;15) · ketosis</li>
                    <li><b>Clues</b>: dehydration, polyuria/polydipsia, abdominal pain/vomiting, <b>Kussmaul respirations</b>, fruity breath, altered mental status; <b>cerebral edema</b> = most dangerous complication</li>
                </ul>
                <div class="sum-callout">
                    <b>Algorithm — DKA management</b>
                    <ol>
                        <li>Fluid resuscitation: 0.9% NS 10–20 mL/kg bolus in first hour</li>
                        <li>Insulin: regular insulin 0.1 U/kg/hr IV — <b>do NOT start if K+ &lt;3.3</b></li>
                        <li>Potassium: &lt;3.3 hold insulin &amp; replace; 3.3–5.3 add KCl; &gt;5.3 recheck q2h</li>
                        <li>Add dextrose (D5W) when glucose ≤200–250; continue insulin until acidosis resolves</li>
                        <li>Monitor hourly glucose/vitals, q2–4h electrolytes; watch for cerebral edema</li>
                    </ol>
                    <b>Cerebral edema</b>: headache, altered mental status, bradycardia + hypertension (Cushing), papilledema → reduce fluids, elevate head, <b>mannitol 1 g/kg</b> or 3% hypertonic saline
                </div>

                <h3>Dehydration &amp; Fluid Therapy</h3>
                <table>
                    <thead><tr><th>Parameter</th><th>Mild (3–5%)</th><th>Moderate (6–9%)</th><th>Severe (≥10%)</th></tr></thead>
                    <tbody>
                        <tr><td>Mental status</td><td>Alert</td><td>Irritable, restless</td><td>Lethargic, obtunded</td></tr>
                        <tr><td>Heart rate</td><td>Normal</td><td>Tachycardia</td><td>Tachycardia + weak pulses</td></tr>
                        <tr><td>Blood pressure</td><td>Normal</td><td>Normal to low</td><td>Hypotension (shock)</td></tr>
                        <tr><td>Skin turgor</td><td>Normal</td><td>Decreased</td><td>Tenting</td></tr>
                        <tr><td>Cap refill</td><td>&lt;2 s</td><td>2–4 s</td><td>&gt;4 s</td></tr>
                        <tr><td>Urine output</td><td>Decreased</td><td>Oliguria</td><td>Anuria</td></tr>
                    </tbody>
                </table>
                <table>
                    <thead><tr><th>Holliday-Segar (maintenance)</th><th>Daily</th><th>Hourly</th></tr></thead>
                    <tbody>
                        <tr><td>First 10 kg</td><td>100 mL/kg/day</td><td>4 mL/kg/hr</td></tr>
                        <tr><td>Second 10 kg</td><td>50 mL/kg/day</td><td>2 mL/kg/hr</td></tr>
                        <tr><td>Each kg &gt;20 kg</td><td>20 mL/kg/day</td><td>1 mL/kg/hr</td></tr>
                    </tbody>
                </table>
                <ul>
                    <li><b>Deficit (mL)</b> = weight (kg) × dehydration % × 10</li>
                    <li><b>ORS</b>: mild–moderate; 50–100 mL/kg over 4–6 h; replace 10 mL/kg per stool/vomit</li>
                    <li><b>IV</b>: severe/shock → 0.9% NS or LR 20 mL/kg boluses (up to 3×); maintenance D5 ½ NS + 20 mEq/L KCl</li>
                </ul>
                <div class="sum-callout">Avoid anti-diarrheal and anti-emetic medications unless confirmed bacterial infection — they can worsen outcomes.</div>

                <h3>Toxicities</h3>
                <table>
                    <thead><tr><th>Paracetamol stage</th><th>Time</th><th>Features</th></tr></thead>
                    <tbody>
                        <tr><td>I</td><td>0–24 h</td><td>Nausea, vomiting, anorexia (may be asymptomatic)</td></tr>
                        <tr><td>II</td><td>24–72 h</td><td>RUQ pain, hepatomegaly, ↑LFTs</td></tr>
                        <tr><td>III</td><td>72–96 h</td><td>Jaundice, coagulopathy, encephalopathy, peak hepatotoxicity</td></tr>
                        <tr><td>IV</td><td>4 d–2 wk</td><td>Recovery or fulminant hepatic failure</td></tr>
                    </tbody>
                </table>
                <ul>
                    <li><b>Paracetamol</b>: NAC antidote (most effective within 8 h); plot level on Rumack-Matthew nomogram</li>
                    <li><b>Foreign body</b>: esophageal button battery → emergency removal; sharp objects → endoscopic; most gastric objects pass spontaneously</li>
                </ul>
            
                <section class="topic deck-enrich">
                    <h3>Study-deck deep dive</h3>
                    <p class="deck-intro">Every comparison table, animated algorithm and clinical pearl from the high-yield SMLE deck for this topic.</p>
<div class="deck-block deck-tbl"><div class="deck-cap"><span class="deck-tag tag-tbl">Table</span> Paracetamol toxicity — clinical stages</div><table><thead><tr><th></th><th>Stage 1</th><th>Stage 2</th><th>Stage 3</th><th>Stage 4</th></tr></thead><tbody><tr><td><b>Timing</b></td><td>First 24 h</td><td>Days 2–3</td><td>Days 3–4</td><td>After day 5</td></tr><tr><td><b>Clinical</b></td><td>Anorexia, nausea, vomiting, malaise</td><td>Improvement in N/V; abdominal pain; hepatic tenderness</td><td>Recurrence of N/V; encephalopathy; anuria; jaundice</td><td>Recovery (7–8 d) OR deterioration to multi-organ failure &amp; death</td></tr><tr><td><b>Labs</b></td><td>—</td><td>↑ transaminases; ↑ bilirubin &amp; prolonged PT if severe</td><td>Hepatic failure, metabolic acidosis, coagulopathy, renal failure, pancreatitis</td><td>Improvement &amp; resolution OR continued deterioration</td></tr></tbody></table></div><figure class="deck-block algo-flow"><figcaption><span class="deck-tag tag-algo">Algorithm</span> Foreign body ingestion — paediatric approach</figcaption><p class="deck-subcap">high-risk FB: button battery, magnets, sharp, large (&gt;6 cm long / &gt;2.5 cm wide) or toxic object</p><div class="algo-row"><div class="algo-node start" style="animation-delay:0.00s">Suspected foreign body (FB) ingestion</div></div><div class="algo-arrow" style="animation-delay:0.05s"></div><div class="algo-row"><div class="algo-node dec" style="animation-delay:0.12s">High-risk FB, or child unwell / symptomatic (drooling, respiratory distress), GI abnormality, food bolus not passing, or unable to eat &amp; drink?</div></div><div class="algo-arrow" style="animation-delay:0.17s"></div><div class="algo-fork"><div class="algo-branch"><span class="algo-label" style="animation-delay:0.24s">No</span><div class="algo-node end" style="animation-delay:0.24s">Discharge with advice</div></div><div class="algo-branch"><span class="algo-label" style="animation-delay:0.34s">Yes to any</span><div class="algo-node proc" style="animation-delay:0.34s">X-ray neck, chest &amp; abdomen (if not radio-opaque → discuss ENT / surgery / GI)</div><div class="algo-arrow mini" style="animation-delay:0.48s"></div><div class="algo-node proc" style="animation-delay:0.44s">FB in oesophagus, or high-risk → urgent removal (ENT / surgery / GI)</div><div class="algo-arrow mini" style="animation-delay:0.58s"></div><div class="algo-node end" style="animation-delay:0.54s">FB in stomach or beyond &amp; child well → observe / discharge with advice</div></div></div></figure><figure class="deck-block algo-flow"><figcaption><span class="deck-tag tag-algo">Algorithm</span> Paracetamol (APAP) toxicity — management</figcaption><div class="algo-row"><div class="algo-node start" style="animation-delay:0.00s">Paracetamol (APAP) ingestion</div></div><div class="algo-arrow" style="animation-delay:0.05s"></div><div class="algo-fork"><div class="algo-branch"><span class="algo-label" style="animation-delay:0.12s">&lt;4 h</span><div class="algo-node proc" style="animation-delay:0.12s">GI decontamination</div><div class="algo-arrow mini" style="animation-delay:0.26s"></div><div class="algo-node proc" style="animation-delay:0.22s">Send 4-h APAP level → plot on Rumack-Matthew nomogram</div><div class="algo-arrow mini" style="animation-delay:0.36s"></div><div class="algo-node end" style="animation-delay:0.32s">Toxic → N-acetylcysteine (NAC); not toxic → symptomatic care</div></div><div class="algo-branch"><span class="algo-label" style="animation-delay:0.42s">4–24 h</span><div class="algo-node proc" style="animation-delay:0.42s">Send APAP level</div><div class="algo-arrow mini" style="animation-delay:0.56s"></div><div class="algo-node end" style="animation-delay:0.52s">Give 1st dose NAC if level not available by 8 h</div></div><div class="algo-branch"><span class="algo-label" style="animation-delay:0.62s">&gt;24 h / unknown</span><div class="algo-node proc" style="animation-delay:0.62s">GI decontamination; send APAP + LFTs (AST/ALT/PT); give 1st dose NAC</div><div class="algo-arrow mini" style="animation-delay:0.76s"></div><div class="algo-node proc" style="animation-delay:0.72s">APAP &gt;10 µg/mL or ↑ AST/ALT → continue NAC; else supportive</div><div class="algo-arrow mini" style="animation-delay:0.86s"></div><div class="algo-node end" style="animation-delay:0.82s">If pH&lt;7.3, PT&gt;100, Cr&gt;3.3 or AMS → refer to liver transplant unit</div></div></div></figure><h4 class="deck-topic">DKA</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Signs of dehydration: Dry mucous membrane, tachycardia, hypotension, sunken eyes</li><li>Symptoms of diabetes: Polyuria, polydipsia, polyphagia, weight loss</li><li>Abdominal pain, vomiting</li><li>Lethargy, AMS, cerebral edema</li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>Ketosis in blood &amp; urine</li><li>Metabolic Acidosis PH &lt;7.3</li><li>Hyperglycemia &gt;200 mg/dl</li><li>HCO3 &lt;15 mmol/L</li></ul></div></div><h4 class="deck-topic">Management of dehydration</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Uses in mild to moderate dehydration</li><li>Dose: 50-100 mL/Kg over 4-6 Hours, 10mL/Kg per stool or vomit</li><li>Monitoring for improvement, if not improved start IVF</li><li>Deficit (ml) = Weight (Kg) * Dehydration % * 10</li></ul></div><div class="deck-card mgmt"><span class="deck-card-h">Management</span><ul><li>severe dehydration</li><li>Not tolerating orally</li><li>Unresponsive to ORS</li><li>Avoid anti-diarrheal &amp; anti-emetics unless there is confirmed bacterial infection</li><li>First 10 kg weight = 100ml/Kg/D</li><li>Second 10 kg weight = 50ml/Kg/D</li><li>For every Kg more than 20 Kg = 2ml/Kg/D</li></ul></div></div><h4 class="deck-topic">DKA</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Signs of dehydration: Dry mucous membrane, tachycardia, hypotension, sunken eyes</li><li>Symptoms of diabetes: Polyuria, polydipsia, polyphagia, weight loss</li><li>Abdominal pain, vomiting</li><li>Lethargy, AMS, cerebral edema</li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>Ketosis in blood &amp; urine</li><li>Metabolic Acidosis PH &lt;7.3</li><li>Hyperglycemia &gt;200 mg/dl</li><li>HCO3 &lt;15 mmol/L</li></ul></div><div class="deck-card mgmt"><span class="deck-card-h">Management</span><ul><li>Fluid Replacement: 0.9% Normal saline</li><li>Insulin therapy: 0.1 IU/Kg/Hr to lower glucose &amp; stop ketogenesis (Delay insulin if K+ &lt;3.3)</li><li>Electrolyte correction</li><li>Monitor for complications: Hypoglycemia, Electrolyte abnormality, Cerebral edema</li></ul></div></div><h4 class="deck-topic">Management of dehydration</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Deficit (ml) = Weight (Kg) * Dehydration % * 10</li></ul></div><div class="deck-card mgmt"><span class="deck-card-h">Management</span><ul><li>First 10 kg weight = 100ml/Kg/D</li><li>Second 10 kg weight = 50ml/Kg/D</li><li>For every Kg more than 20 Kg = 2ml/Kg/D</li></ul></div></div>
                </section>
            `,
            questions: [
                {
                    q: 'A 4-year-old with DKA is being treated. Which complication is most concerning and should be watched for?',
                    options: ['Hypoglycemia', 'Kidney failure', 'Cerebral edema (most dangerous, can be fatal)', 'Metabolic alkalosis'],
                    answer: 2,
                    explanation: 'Cerebral edema is the most feared complication of DKA treatment. Watch for headache, bradycardia, hypertension. Treat with mannitol or hypertonic saline.'
                },
                {
                    q: 'Which of the following is continuously monitored as trans-cutaneous in pediatric critical care?',
                    options: ['Blood pressure (measured invasively)', 'Fluid balance (measured clinically)', 'Glasgow coma scale (clinical assessment)', 'Arterial oxygen saturation'],
                    answer: 3,
                    explanation: 'SpO2 is measured continuously via pulse oximetry (transcutaneous). BP in PICU is measured invasively (arterial line), fluid balance by I/O charting, GCS by clinical assessment.'
                }
            ]
        },
        {
            id: 'peds-endocrinology',
            title: '03 — Endocrinology',
            title_en: 'Diabetes · Thyroid · CAH · Puberty · Short Stature',
            summaryHtml: `
                <h3>Diabetes Mellitus</h3>
                <ul>
                    <li><b>Type 1</b>: polyuria/polydipsia/polyphagia, weight loss; DKA first presentation in 25–40%. Lifelong insulin + lifestyle + glucose monitoring; screen microvascular complications 3–5 y after diagnosis. Associations: celiac, hypothyroidism, vitiligo, Addison</li>
                </ul>
                <div class="sum-callout">
                    <b>Hypoglycemia — 15-15 rule</b>
                    <ol>
                        <li>Conscious: 15 g fast-acting carbs (glucose tablets, juice)</li>
                        <li>Recheck in 15 min; repeat if still &lt;70</li>
                        <li>Unconscious: glucagon 0.5 mg (&lt;25 kg) or 1 mg (≥25 kg) IM/SC</li>
                        <li>IV access: D10/D25 push, then D5 infusion</li>
                    </ol>
                </div>

                <h3>Thyroid Disorders</h3>
                <ul>
                    <li><b>Congenital hypothyroidism</b>: prolonged jaundice, large fontanelle, macroglossia, umbilical hernia, hypotonia, constipation. Newborn screen (TSH/T4) at 24–48 h → <b>levothyroxine ASAP</b> (critical for neurodevelopment)</li>
                    <li><b>Hashimoto</b>: firm non-tender goiter, fatigue, cold intolerance; ↑TSH, ↓T4, anti-TPO → levothyroxine lifelong</li>
                    <li><b>Graves</b>: weight loss, tachycardia, exophthalmos, goiter; ↑T3/T4, ↓TSH, ↑TSI → methimazole (1st line), propranolol; definitive RAI or thyroidectomy</li>
                </ul>
                <table>
                    <thead><tr><th>Condition</th><th>TSH</th><th>Free T4</th></tr></thead>
                    <tbody>
                        <tr><td>Primary hypothyroidism</td><td>High</td><td>Low</td></tr>
                        <tr><td>Primary hyperthyroidism</td><td>Low</td><td>High</td></tr>
                        <tr><td>Central hypothyroidism</td><td>Low/Normal</td><td>Low</td></tr>
                        <tr><td>Subclinical hypothyroidism</td><td>High</td><td>Normal</td></tr>
                    </tbody>
                </table>

                <h3>Congenital Adrenal Hyperplasia (21-OH deficiency, 95%)</h3>
                <ul>
                    <li>Classic salt-wasting: ambiguous genitalia (females), salt-wasting crisis at 1–3 wk, hyperpigmentation, <b>hyponatremia + hyperkalemia + acidosis</b></li>
                    <li>Dx: ↑17-OHP, ↓cortisol, ↑ACTH. Rx: hydrocortisone + fludrocortisone + NaCl; stress-dose steroids when ill</li>
                </ul>

                <h3>Disorders of Puberty &amp; Short Stature</h3>
                <ul>
                    <li><b>First sign</b>: girls — thelarche; boys — testicular enlargement (&gt;4 mL). Precocious: girls &lt;8 y, boys &lt;9 y. Delayed: girls &gt;13 y, boys &gt;14 y</li>
                    <li>Workup precocious: bone age, LH/FSH, estradiol/testosterone, GnRH stim test, pelvic US</li>
                </ul>
                <table>
                    <thead><tr><th>Precocious puberty</th><th>Central (GnRH-dependent)</th><th>Peripheral</th></tr></thead>
                    <tbody>
                        <tr><td>Cause</td><td>Hypothalamic-pituitary activation</td><td>Adrenal/ovarian/testicular</td></tr>
                        <tr><td>LH/FSH</td><td>Elevated</td><td>Suppressed</td></tr>
                        <tr><td>Treatment</td><td>GnRH agonist (leuprolide)</td><td>Treat underlying cause</td></tr>
                    </tbody>
                </table>
                <ul>
                    <li><b>Short stature</b>: growth velocity &lt;4–5 cm/yr abnormal; bone age vs chronological. Delayed bone age → GH deficiency, hypothyroidism, malnutrition, chronic illness; normal bone age → familial / constitutional</li>
                </ul>
            
                <section class="topic deck-enrich">
                    <h3>Study-deck deep dive</h3>
                    <p class="deck-intro">Every comparison table, animated algorithm and clinical pearl from the high-yield SMLE deck for this topic.</p>
<figure class="deck-block algo-flow"><figcaption><span class="deck-tag tag-algo">Algorithm</span> Cushing's syndrome — diagnostic approach</figcaption><div class="algo-row"><div class="algo-node start" style="animation-delay:0.00s">Clinical suspicion of Cushing's syndrome</div></div><div class="algo-arrow" style="animation-delay:0.05s"></div><div class="algo-row"><div class="algo-node proc" style="animation-delay:0.12s">Screen: 24-h urinary free cortisol (×3), low-dose dexamethasone suppression test, midnight cortisol</div></div><div class="algo-arrow" style="animation-delay:0.17s"></div><div class="algo-row"><div class="algo-node proc" style="animation-delay:0.24s">Confirmed Cushing's → measure ACTH</div></div><div class="algo-arrow" style="animation-delay:0.29s"></div><div class="algo-fork"><div class="algo-branch"><span class="algo-label" style="animation-delay:0.36s">ACTH &lt;10 (independent)</span><div class="algo-node proc" style="animation-delay:0.36s">CT/MRI adrenals</div><div class="algo-arrow mini" style="animation-delay:0.50s"></div><div class="algo-node end" style="animation-delay:0.46s">Adrenal adenoma / carcinoma or nodular hyperplasia</div></div><div class="algo-branch"><span class="algo-label" style="animation-delay:0.56s">ACTH &gt;20 (dependent)</span><div class="algo-node proc" style="animation-delay:0.56s">High-dose dexamethasone suppression + CRH test</div><div class="algo-arrow mini" style="animation-delay:0.70s"></div><div class="algo-node proc" style="animation-delay:0.66s">Suppresses → MRI pituitary → Cushing's disease</div><div class="algo-arrow mini" style="animation-delay:0.80s"></div><div class="algo-node end" style="animation-delay:0.76s">No suppression → BIPSS; if negative → CT/MRI chest/abdo/pelvis → ectopic ACTH</div></div><div class="algo-branch"><span class="algo-label" style="animation-delay:0.86s">ACTH 10–20</span><div class="algo-node end" style="animation-delay:0.86s">Further testing (CRH test)</div></div></div></figure><h4 class="deck-topic">Diabetes type 1</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>polyuria</li><li>polydipsia</li><li>Polyphagia, unexplained weight loss</li><li>DKA (First presentation)</li><li>Hyperglycemia crisis (DKA), Hypoglycemia (Adverse effect of insulin)</li><li>Macrovascular complications (CAD, CVA, Peripheral artery disease)</li><li>Microvascular complications (Retinopathy, neuropathy, nephropathy)</li><li>Associations: (Celiac disease, hypothyroidism, vitiligo)</li><li>Microvascular complications screening 3-5 years after diagnosis then yearly</li><li>Abdominal pain, Vomiting</li><li>polydipsia</li><li>Fruity odor on the breath, kussmaul breath</li><li>Symptoms of Diabetes (polyuria, polydipsia, polyphagia, weight loss)</li></ul></div><div class="deck-card mgmt"><span class="deck-card-h">Management</span><ul><li>Lifestyle modification</li><li>Insulin</li><li>Screening for complications</li><li>Monitoring for glycemic control</li></ul></div></div><h4 class="deck-topic">Diabetic ketoacidosis</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Hyperglycemia 200 mg/dl</li><li>Metabolic acidosis PH &lt;7.3, HCO3 &lt;15 mmol/l</li><li>Ketosis Positive ketones in urine or blood</li></ul></div><div class="deck-card mgmt"><span class="deck-card-h">Management</span><ul><li>Fluid resuscitation: 0.9% NS bolus 10-20ml/kg/Hr</li><li>Regular Insulin: 0.1U/kg/Hr (Do not start insulin until K &gt;3.3)</li><li>Glucose monitoring (When glucose 200 or less, add 5% dextrose)</li><li>Acidosis monitoring: (Do not stop insulin until acidosis resolves)</li></ul></div></div><h4 class="deck-topic">Diabetes type 1</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>polyuria</li><li>polydipsia</li><li>Polyphagia, unexplained weight loss</li><li>DKA (First presentation)</li></ul></div><div class="deck-card mgmt"><span class="deck-card-h">Management</span><ul><li>Lifestyle modification</li><li>Insulin</li><li>Screening for complications</li><li>Monitoring for glycemic control</li></ul></div></div><h4 class="deck-topic">Diabetes insipidus</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Polyuria</li><li>polydipsia</li><li>nocturia</li><li>Possible dehydrations symptoms</li><li>Hyperglycemia crisis (DKA), Hypoglycemia (Adverse effect of insulin)</li><li>Macrovascular complications (CAD, CVA, Peripheral artery disease)</li><li>Microvascular complications (Retinopathy, neuropathy, nephropathy)</li><li>Associations: (Celiac disease, hypothyroidism, vitiligo)</li><li>Microvascular complications screening 3-5 years after diagnosis then yearly</li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>Low urine osmolarity despite high serum osmolarity</li><li>Water deprivation test</li><li>Desmopressin replacement test improves in central DI</li><li>Central DI Desmopressin</li><li>Nephrogenic DI Thiazide, low salt diet</li><li>Abdominal pain, Vomiting</li><li>polydipsia</li><li>Fruity odor on the breath, kussmaul breath</li><li>Symptoms of Diabetes (polyuria, polydipsia, polyphagia, weight loss)</li></ul></div></div><h4 class="deck-topic">Diabetes type 1</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Hyperglycemia crisis (DKA), Hypoglycemia (Adverse effect of insulin)</li><li>Macrovascular complications (CAD, CVA, Peripheral artery disease)</li><li>Microvascular complications (Retinopathy, neuropathy, nephropathy)</li><li>Associations: (Celiac disease, hypothyroidism, vitiligo)</li><li>Microvascular complications screening 3-5 years after diagnosis then yearly</li><li>Abdominal pain, Vomiting</li><li>polydipsia</li><li>Fruity odor on the breath, kussmaul breath</li><li>Symptoms of Diabetes (polyuria, polydipsia, polyphagia, weight loss)</li></ul></div></div><h4 class="deck-topic">Congenital adrenal hyperplasia</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Simple virilizing Ambiguous genitalia in girls, early puberty in boys</li><li>Late onset menarche, hirsutism</li><li>Salt wasting Vomiting, dehydration, hyponatremia, hyperkalemia, shock, hypoglycemia</li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>Elevated 17 hydroxy-progestrone</li><li>21-alpha hydroxylase deficiency</li><li>Electrolyte abnormalities ( hyperkalemia, hyponatremia)</li><li>ACTH stimulation test</li><li>Treatment: Hydrocortisone, fluid &amp; electrolyte correction</li></ul></div></div>
                </section>
            `,
            questions: [
                {
                    q: 'A 9-year-old boy with recurrent vomiting, lethargy, brown pigmentation of gums/skin creases, growth failure. Labs: Na 130, K 6, 8 AM cortisol low. Best management?',
                    options: ['Daily hydrocortisone', 'Daily thyroxine', 'Daily vitamin D', 'Daily vitamin B6'],
                    answer: 0,
                    explanation: 'Hyperpigmentation + low cortisol + hyponatremia + hyperkalemia = Addison disease (primary adrenal insufficiency). Treatment: hydrocortisone (glucocorticoid) + fludrocortisone (mineralocorticoid).'
                },
                {
                    q: 'Which is usually the first sign of puberty in boys?',
                    options: ['Acne', 'Pubic hair', 'Penile enlargement', 'Testicular enlargement (>4 mL volume)'],
                    answer: 3,
                    explanation: 'In boys, testicular enlargement (>4 mL or >2.5 cm) is the first sign of puberty (Tanner stage 2), preceding pubic hair and penile growth.'
                },
                {
                    q: 'A 5-year-old girl with pubic hair and adult body odor, height 75th percentile, weight 95th percentile. No acne or clitoromegaly. Most important initial screening?',
                    options: ['DHEAS (to rule out adrenal source)', 'FSH', '17-hydroxyprogesterone', 'Testosterone'],
                    answer: 0,
                    explanation: 'Premature adrenarche (pubic hair, body odor) without breast development suggests an adrenal source. DHEAS is the best initial screening test to evaluate adrenal androgens.'
                }
            ]
        },
        {
            id: 'peds-gastroenterology',
            title: '04 — Gastroenterology',
            title_en: 'GERD · Pyloric Stenosis · Intussusception · Liver · IBD',
            summaryHtml: `
                <h3>GER vs GERD &amp; Pyloric Stenosis</h3>
                <ul>
                    <li><b>Physiologic GER</b>: spitting up, normal exam &amp; weight gain, resolves by 12–18 mo → reassurance, reflux precautions</li>
                    <li><b>GERD</b>: poor feeding, FTT, <b>Sandifer syndrome</b>, respiratory symptoms → thickened feeds, PPI/H2 blocker; refractory → Nissen fundoplication</li>
                    <li><b>Pyloric stenosis</b>: 2–8 wk, <b>non-bilious projectile vomiting</b>, hungry after vomiting, <b>hypochloremic metabolic alkalosis</b>; US (muscle &gt;3–4 mm) diagnostic; palpable olive in RUQ → correct electrolytes → Ramstedt pyloromyotomy</li>
                </ul>

                <h3>Malrotation, Intussusception &amp; Hirschsprung</h3>
                <ul>
                    <li><b>Malrotation/volvulus</b>: <b>bilious vomiting in newborn</b> (always investigate!); UGI series corkscrew duodenum → surgical emergency (Ladd procedure)</li>
                    <li><b>Intussusception</b>: 6 mo–3 y, colicky pain, <b>currant jelly stool</b>, sausage-shaped mass; US target sign → air/contrast enema (diagnostic + therapeutic); surgery if fails/perforation</li>
                    <li><b>Hirschsprung</b>: delayed meconium (&gt;48 h), constipation, distension; rectal suction biopsy shows absent ganglion cells → surgical pull-through</li>
                </ul>

                <h3>Liver Diseases</h3>
                <ul>
                    <li><b>Biliary atresia</b>: jaundice &gt;2 wk (<b>conjugated</b>), acholic stools, dark urine; HIDA no excretion → <b>Kasai before 60 days</b>; transplant if fails</li>
                </ul>
                <table>
                    <thead><tr><th>Acholic stools — DDx</th><th>Key feature</th></tr></thead>
                    <tbody>
                        <tr><td>Biliary atresia</td><td>Jaundice &gt;2 wk, acholic stools (HIDA, biopsy)</td></tr>
                        <tr><td>Choledochal cyst</td><td>Cystic dilation of bile duct (US)</td></tr>
                        <tr><td>Alagille syndrome</td><td>Butterfly vertebrae, posterior embryotoxon, cardiac murmur (JAG1)</td></tr>
                    </tbody>
                </table>

                <h3>IBD &amp; Celiac Disease</h3>
                <ul>
                    <li><b>Celiac</b>: chronic diarrhea/steatorrhea, FTT, refractory IDA, dermatitis herpetiformis; <b>IgA TTG</b> first-line (+ total IgA), duodenal biopsy villous atrophy → lifelong gluten-free diet</li>
                </ul>
                <table>
                    <thead><tr><th>Feature</th><th>Crohn disease</th><th>Ulcerative colitis</th></tr></thead>
                    <tbody>
                        <tr><td>Location</td><td>Mouth to anus, skip lesions</td><td>Colon only, continuous</td></tr>
                        <tr><td>Depth</td><td>Transmural</td><td>Mucosal only</td></tr>
                        <tr><td>Rectal bleeding</td><td>Less common</td><td>Common (bloody diarrhea)</td></tr>
                        <tr><td>Perianal disease</td><td>Common (fistulas, abscess)</td><td>Rare</td></tr>
                        <tr><td>Cancer risk</td><td>Slightly increased</td><td>Increased (colorectal)</td></tr>
                    </tbody>
                </table>
            
                <section class="topic deck-enrich">
                    <h3>Study-deck deep dive</h3>
                    <p class="deck-intro">Every comparison table, animated algorithm and clinical pearl from the high-yield SMLE deck for this topic.</p>
<div class="deck-block deck-tbl"><div class="deck-cap"><span class="deck-tag tag-tbl">Table</span> Ulcerative colitis vs Crohn's disease</div><table><thead><tr><th>Feature</th><th>Ulcerative colitis</th><th>Crohn's disease</th></tr></thead><tbody><tr><td><b>Age</b></td><td>Any</td><td>Any</td></tr><tr><td><b>Gender</b></td><td>M = F</td><td>Slight female preponderance</td></tr><tr><td><b>Incidence</b></td><td>Stable</td><td>Increasing</td></tr><tr><td><b>Ethnicity</b></td><td>Any</td><td>More common in Ashkenazi Jews</td></tr><tr><td><b>Genetics</b></td><td>HLA-DR*103; colonic barrier genes (HNF4a, LAMB1, CDH1)</td><td>Defective innate immunity &amp; autophagy (NOD2, ATG16L1, IRGM)</td></tr><tr><td><b>Risk factors</b></td><td>More common in non-/ex-smokers; appendicectomy protects</td><td>More common in smokers</td></tr><tr><td><b>Distribution</b></td><td>Colon only; from anorectal margin with proximal extension</td><td>Any part of GIT; perianal disease; patchy skip lesions</td></tr><tr><td><b>Extra-intestinal</b></td><td>Common</td><td>Common</td></tr><tr><td><b>Presentation</b></td><td>Bloody diarrhoea</td><td>Variable: pain, diarrhoea, weight loss</td></tr><tr><td><b>Histology</b></td><td>Mucosal inflammation; crypt distortion/abscesses; loss of goblet cells</td><td>Submucosal/transmural; deep fissuring ulcers, fistulae; patchy; granulomas</td></tr><tr><td><b>Management</b></td><td>5-ASA, steroids, azathioprine, biologics; colectomy is curative</td><td>Steroids, azathioprine, methotrexate, biologics, nutrition; surgery not curative; 5-ASA ineffective</td></tr></tbody></table></div><h4 class="deck-topic">Gastro-esophageal reflux</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Movement of stomach content into esophagus due to transient lower esophageal sphincter relaxation</li><li>Spitting up or regurgitation shortly after feeding</li><li>Physiological reflux → Normal physical examination, Normal feeding and weight gain</li><li>GERD → Poor feeding, weight loss, Sandifer syndrome, torticollis</li><li>Pacifier at bed time</li><li>Movement of stomach content into esophagus due to transient lower esophageal sphincter relaxation</li><li>Spitting up or regurgitation shortly after feeding</li><li>Physiological reflux → Normal physical examination, Normal feeding and weight gain</li><li>GERD → Poor feeding, weight loss, Sandifer syndrome, torticollis</li><li>Pacifier at bed time</li></ul></div><div class="deck-card mgmt"><span class="deck-card-h">Management</span><ul><li>Physiological reflux → Reassurance &amp; reflux precautions</li></ul></div></div><h4 class="deck-topic">Pyloric stenosis</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>2-8 weeks non-bilious projectile vomiting, hungry after vomiting P/E: Hypertrophied-non tender pylorus (Described as olive-like mass)</li><li>Late stage: Dehydration, poor weight gain, failure to thrive</li><li>Diagnosis &amp; management Ultrasound abdomen (Diagnostic)</li><li>Abdominal X-ray → Single bubble sign (due to accumulation of air In stomach)</li><li>Labs: Hypochloremic, hypochalemic, metabolic alkalosis</li><li>Correct electrolyte &amp; fluid status → Pyloromyotomy</li></ul></div></div><h4 class="deck-topic">Intussusceptions</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Abdominal pain, associated with knees drawn toward chest Vomiting (could be bilious)</li><li>Red current jelly stool</li><li>Sausage shaped abdominal mass</li><li>Diagnosis &amp; management Ultrasound abdomen (Initial &amp; best diagnostic modality) → Target sign</li><li>Enemas → diagnostic &amp; therapeutic</li><li>Treatment: IVF resuscitation, correct electrolyte abnormalities, Enemas</li><li>Surgery: Signs of peritonitis, refractory to enemas</li></ul></div></div><h4 class="deck-topic">Celiac disease</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Chronic diarrhea, Nausea/Vomiting Flatulence, abdominal distension</li><li>Malabsorption symptoms: steatorrhea, failure to thrive, weight loss, vitamin deficiency.</li><li>Dermatological association: Dermatitis Herpetiformis</li><li>Diagnosis &amp; management Initial test → Serology (IgA tissue transglutaminase - Anti-endomysial AB)</li><li>Confirmatory test → endoscopy with Duodenal Biopsy (Don’t stop gluten before EGD)</li><li>Treatment: Gluten free diet</li></ul></div></div><h4 class="deck-topic">Hirschsprung disease</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Delayed passage of meconium (24-48H)</li><li>Symptoms of distal intestinal obstruction: Abdominal distension, bilious vomiting</li><li>DRE: Tight anal sphincter, Empty rectum, Squire sign (Gush of stool after DRE)</li><li>Diagnosis &amp; management Abdominal X-ray (contrast enema) → Initial</li><li>Rectal biopsy → Confirmatory</li><li>Treatment: Surgical resection on non-ganglionic portion of colon</li><li>Delayed passage of meconium (24-48H)</li><li>Symptoms of distal intestinal obstruction: Abdominal distension, bilious vomiting</li><li>DRE: Tight anal sphincter, Empty rectum, Squire sign (Gush of stool after DRE)</li><li>Diagnosis &amp; management Abdominal X-ray (contrast enema) → Initial</li><li>Rectal biopsy → Confirmatory</li><li>Keep sleeping area separate to the parents but in the same room</li><li>Pacifier at bed time</li></ul></div></div><h4 class="deck-topic">Acute Appendicitis</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Migrating abdominal pain (Peri-umbilical to RLQ) Nausea/Vomiting, Low grade fever</li><li>Rebound tenderness, Rovsing sign</li><li>Diagnosis &amp; management Non-pregnant adults → CT (Best) or US</li><li>Pregnant or children → US</li><li>Appendicitis complication (Abscess, phlegmon) → CT regardless age</li><li>Symptomatic management + Empirical antibiotics + Appendectomy</li></ul></div></div>
                </section>
            `,
            questions: [
                {
                    q: 'A 4-week-old with projectile vomiting. Labs show hypochloremia, hypokalemia, metabolic alkalosis. Diagnosis?',
                    options: ['Pyloric stenosis', 'GERD', 'Intussusception', 'Malrotation'],
                    answer: 0,
                    explanation: 'Pyloric stenosis causes loss of HCl in vomitus leading to hypochloremic metabolic alkalosis with hypokalemia. Ultrasound is diagnostic.'
                },
                {
                    q: 'A 4-month-old with chronic constipation since birth, delayed meconium passage, abdominal distension. Diagnosis?',
                    options: ['Functional constipation', 'Hirschsprung disease (aganglionic colon)', 'Hypothyroidism', 'Cystic fibrosis'],
                    answer: 1,
                    explanation: 'Hirschsprung: delayed meconium (>48h), chronic constipation, abdominal distension. Rectal suction biopsy shows absent ganglion cells.'
                }
            ]
        },
        {
            id: 'peds-general',
            title: '05 — General Pediatrics',
            title_en: 'SIDS · Animal & Human Bites · Envenomation',
            summaryHtml: `
                <h3>Sudden Infant Death Syndrome (SIDS)</h3>
                <ul>
                    <li><b>Risk factors</b>: prone/stomach sleeping, soft bedding, overheating, maternal smoking, prematurity/LBW, co-sleeping; peak 2–4 months</li>
                    <li><b>Prevention ("Back to Sleep")</b>: place baby on <b>back</b>, firm mattress, separate sleep surface in same room, pacifier at bedtime, avoid overheating, smoking cessation</li>
                </ul>

                <h3>Bites &amp; Envenomation</h3>
                <ul>
                    <li><b>Dog bites</b>: irrigation/debridement; primary closure only for facial wounds; <b>amoxicillin-clavulanate</b> prophylaxis; tetanus; rabies prophylaxis if stray/unknown</li>
                    <li><b>Rabies post-exposure</b>: unknown/unvaccinated/stray animal or bat exposure → rabies immunoglobulin (into wound) + vaccine (days 0, 3, 7, 14)</li>
                    <li><b>Snake bite</b>: immobilize limb below heart level; do <b>NOT</b> cut, suck venom, tourniquet or ice; antivenom if envenomation</li>
                    <li><b>Scorpion sting</b>: supportive/analgesia; antivenom for severe systemic symptoms</li>
                </ul>
            
                <section class="topic deck-enrich">
                    <h3>Study-deck deep dive</h3>
                    <p class="deck-intro">Every comparison table, animated algorithm and clinical pearl from the high-yield SMLE deck for this topic.</p>
<h4 class="deck-topic">Sudden infant death syndrome</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Sleeping on the stomach side</li><li>Soft bedding or overheating</li><li>Maternal smoke during pregnancy</li><li>Premature infant or low birth weight</li></ul></div><div class="deck-card mgmt"><span class="deck-card-h">Management</span><ul><li>Place baby on back to sleep (Best strategy)</li><li>Use a firm mattress</li><li>Keep sleeping area separate to the parents but in the same room</li><li>Pacifier at bed time</li></ul></div></div>
                </section>
            `,
            questions: [
                {
                    q: 'Parents of a healthy 2-month-old ask how to lower the risk of sudden infant death syndrome (SIDS). Which is the single most important advice?',
                    options: ['Place the infant to sleep on the back on a firm surface', 'Put the infant to sleep prone so it does not choke', 'Use soft bedding and pillows for comfort', 'Have the infant co-sleep in the parents\' bed'],
                    answer: 0,
                    explanation: 'The "Back to Sleep" campaign — supine sleep on a firm, separate surface — is the most effective SIDS-prevention measure. Prone/side sleeping, soft bedding, overheating and bed-sharing all INCREASE risk. Peak incidence is 2–4 months.'
                },
                {
                    q: 'A 6-year-old is bitten on the hand by a neighbour\'s dog with an unknown vaccination status. After irrigation and debridement, which antibiotic is the best prophylaxis?',
                    options: ['Amoxicillin-clavulanate', 'Oral vancomycin', 'Ciprofloxacin monotherapy', 'No antibiotic — close the wound primarily'],
                    answer: 0,
                    explanation: 'Amoxicillin-clavulanate covers Pasteurella multocida plus skin flora and is first-line for mammalian bites. Non-facial bite wounds are generally left open (not primarily closed); give tetanus prophylaxis, and rabies prophylaxis for a stray/unknown animal.'
                }
            ]
        },
        {
            id: 'peds-genetics',
            title: '06 — Genetics',
            title_en: 'Down Syndrome · Other Genetic Syndromes',
            summaryHtml: `
                <h3>Down Syndrome (Trisomy 21)</h3>
                <ul>
                    <li><b>Features</b>: flat facial profile, upslanting palpebral fissures, epicanthal folds, protruding tongue, single palmar crease, clinodactyly, hypotonia, intellectual disability</li>
                    <li><b>Associations</b>: AV septal defect (most common cardiac), duodenal atresia (double bubble), hypothyroidism (annual TSH), ↑leukemia risk, atlantoaxial instability (avoid neck hyperextension), hearing loss</li>
                    <li>Dx: karyotyping (confirm); prenatal NIPT, quad screen, nuchal translucency</li>
                </ul>
                <table>
                    <thead><tr><th>Recurrence</th><th>Risk</th><th>Evaluation</th></tr></thead>
                    <tbody>
                        <tr><td>Trisomy 21</td><td>1% + maternal age risk</td><td>Karyotype affected child</td></tr>
                        <tr><td>Translocation (Robertsonian)</td><td>Higher</td><td>Karyotype both parents</td></tr>
                        <tr><td>Mosaicism</td><td>Usually not inherited</td><td>Genetic counseling</td></tr>
                    </tbody>
                </table>

                <h3>Other Genetic Syndromes</h3>
                <table>
                    <thead><tr><th>Syndrome</th><th>Karyotype</th><th>Key features</th></tr></thead>
                    <tbody>
                        <tr><td>Turner (45,X)</td><td>Monosomy X</td><td>Short stature, webbed neck, lymphedema, coarctation, streak ovaries, primary amenorrhea</td></tr>
                        <tr><td>Klinefelter (47,XXY)</td><td>XXY</td><td>Tall, small testes, gynecomastia, infertility, learning disabilities</td></tr>
                        <tr><td>Patau (T13)</td><td>Trisomy 13</td><td>Polydactyly, microphthalmia, holoprosencephaly, cutis aplasia</td></tr>
                        <tr><td>Edwards (T18)</td><td>Trisomy 18</td><td>Clenched fists, overlapping fingers, rocker-bottom feet, micrognathia, VSD</td></tr>
                        <tr><td>DiGeorge (22q11.2)</td><td>Microdeletion</td><td>CATCH-22: Cardiac, Abnormal facies, Thymic hypoplasia, Cleft palate, Hypocalcemia</td></tr>
                        <tr><td>Williams (7q11.23, ELN)</td><td>Microdeletion</td><td>Elfin facies, supravalvular AS, friendly personality, hypercalcemia</td></tr>
                        <tr><td>Prader-Willi (del 15q paternal)</td><td>Imprinting</td><td>Infantile hypotonia/FTT → hyperphagia, obesity, hypogonadism</td></tr>
                        <tr><td>Angelman (del 15q maternal)</td><td>Imprinting</td><td>Severe ID, absent speech, ataxia, paroxysmal laughter ("happy puppet")</td></tr>
                        <tr><td>Noonan (PTPN11, AD)</td><td>—</td><td>Short stature, webbed neck, pulmonic stenosis, bleeding disorder</td></tr>
                    </tbody>
                </table>
            
                <section class="topic deck-enrich">
                    <h3>Study-deck deep dive</h3>
                    <p class="deck-intro">Every comparison table, animated algorithm and clinical pearl from the high-yield SMLE deck for this topic.</p>
<h4 class="deck-topic">Down syndrome</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>CNS: Hypotonia, Developmental delay, seizure, intellectual disability</li><li>CVS: Atrioventricular septal defect (MC), VSD, ASD</li><li>Endocrine: Congenital Hypothyroidism</li><li>GI: Duodenal atresia</li><li>Sleeping on the stomach side</li><li>Soft bedding or overheating</li><li>Maternal smoke during pregnancy</li><li>Premature infant or low birth weight</li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>Trisomy 21 1% + age related risk of the mother at time of next pregancy</li><li>Translocation karyotyping to both parents to calculate the recurrence risk</li><li>Mosaicism Usually not inherited</li></ul></div><div class="deck-card mgmt"><span class="deck-card-h">Management</span><ul><li>Place baby on back to sleep (Best strategy)</li><li>Use a firm mattress</li><li>Keep sleeping area separate to the parents but in the same room</li><li>Pacifier at bed time</li></ul></div></div>
                </section>
            `,
            questions: [
                {
                    q: 'A child with elfin facies, supravalvular aortic stenosis, friendly personality, and hypercalcemia. Diagnosis?',
                    options: ['Noonan syndrome', 'Williams syndrome (microdeletion 7q11.23)', 'DiGeorge syndrome', 'Turner syndrome'],
                    answer: 1,
                    explanation: 'Williams = elfin facies, supravalvular AS, friendly personality, hypercalcemia, developmental delay. Caused by ELN gene deletion.'
                }
            ]
        },
        {
            id: 'peds-growth',
            title: '07 — Growth & Development',
            title_en: 'Milestones · Primitive Reflexes · Infantile Colic',
            summaryHtml: `
                <h3>Key Developmental Milestones</h3>
                <table>
                    <thead><tr><th>Age</th><th>Gross motor</th><th>Fine motor / language</th><th>Social</th></tr></thead>
                    <tbody>
                        <tr><td>2 mo</td><td>Lifts head prone</td><td>Cooing</td><td>Social smile</td></tr>
                        <tr><td>6 mo</td><td>Sits without support, rolls both ways</td><td>Transfers hand to hand, babble</td><td>Stranger anxiety begins</td></tr>
                        <tr><td>9 mo</td><td>Crawls, pulls to stand, cruises</td><td>Pincer grasp, "mama/dada" nonspecific</td><td>Waves bye-bye, peek-a-boo</td></tr>
                        <tr><td>12 mo</td><td>Walks independently</td><td>1–2 words with meaning</td><td>Imitates actions</td></tr>
                        <tr><td>18 mo</td><td>Runs, throws ball</td><td>10–25 words, 2-word phrases</td><td>Spoon feeding</td></tr>
                        <tr><td>2 y</td><td>Up/down stairs, jumps</td><td>2-word sentences, 50+ words</td><td>Parallel play</td></tr>
                        <tr><td>3 y</td><td>Rides tricycle, stands on one foot</td><td>Copies circle, 3-word sentences</td><td>Group play</td></tr>
                        <tr><td>4 y</td><td>Hops on one foot</td><td>Copies cross, knows 4 colors</td><td>Cooperative play</td></tr>
                        <tr><td>5 y</td><td>Skips, jumps rope</td><td>Copies triangle, counts to 10</td><td>Dresses independently</td></tr>
                    </tbody>
                </table>
                <div class="sum-callout"><b>Red flags (refer)</b>: no social smile by 3 mo · no babbling by 9 mo · no words by 15 mo · no 2-word phrases by 24 mo · no pointing by 18 mo · loss of acquired skills (regression).</div>

                <h3>Primitive Reflexes</h3>
                <table>
                    <thead><tr><th>Reflex</th><th>Stimulus → response</th><th>Disappears</th></tr></thead>
                    <tbody>
                        <tr><td>Moro (startle)</td><td>Head drop → extension then abduction of arms</td><td>3–4 mo</td></tr>
                        <tr><td>Rooting</td><td>Stroke cheek → turns head toward</td><td>3–4 mo</td></tr>
                        <tr><td>Palmar grasp</td><td>Object in palm → finger flexion</td><td>4–6 mo</td></tr>
                        <tr><td>Tonic neck (fencing)</td><td>Turn head → ipsilateral limb extension</td><td>4–6 mo</td></tr>
                        <tr><td>Plantar grasp</td><td>Object against sole → toe flexion</td><td>9–12 mo</td></tr>
                    </tbody>
                </table>

                <h3>Infantile Colic</h3>
                <ul>
                    <li><b>Wessel rule of 3s</b>: crying &gt;3 h/day, &gt;3 days/week, &gt;3 weeks; age 2 wk–4 mo; otherwise healthy</li>
                    <li>Management: reassurance (resolves by 3–4 mo), <b>5 S's</b> (Swaddling, Side/stomach, Shushing, Swinging, Sucking), probiotics (L. reuteri), simethicone</li>
                </ul>
            
                <section class="topic deck-enrich">
                    <h3>Study-deck deep dive</h3>
                    <p class="deck-intro">Every comparison table, animated algorithm and clinical pearl from the high-yield SMLE deck for this topic.</p>
<div class="deck-block deck-tbl"><div class="deck-cap"><span class="deck-tag tag-tbl">Table</span> Rickets &amp; metabolic bone disease — biochemistry</div><p class="deck-subcap">↑ high · ↓ low · − normal</p><table><thead><tr><th>Condition</th><th>Genetics</th><th>Ca</th><th>PO₄</th><th>ALP</th><th>PTH</th><th>Vit D</th><th>1,25(OH)₂D</th></tr></thead><tbody><tr><td><b>Vit D-resistant rickets (hypophosphataemic)</b></td><td>X-linked dominant</td><td>−</td><td>↓</td><td>↑</td><td>−</td><td>−</td><td></td></tr><tr><td><b>Vit D-deficiency rickets (nutritional)</b></td><td>Nutritional</td><td>−/↓</td><td>↓</td><td>↑</td><td>↑</td><td>↓</td><td></td></tr><tr><td><b>Type I vit D-dependent</b></td><td>AR</td><td>↓</td><td>↓</td><td>↑</td><td>↑</td><td></td><td>↓↓</td></tr><tr><td><b>Type II vit D-dependent</b></td><td>AR</td><td>↓</td><td>↓</td><td>↑</td><td></td><td></td><td>↑↑</td></tr><tr><td><b>Hypophosphatasia</b></td><td>AR</td><td>↑</td><td>↑</td><td>↓↓</td><td>−</td><td>−</td><td></td></tr><tr><td><b>Renal osteodystrophy</b></td><td>Renal disease</td><td>↓</td><td>↑</td><td>↑</td><td>↑</td><td></td><td></td></tr><tr><td><b>Hyperparathyroidism</b></td><td>90% adenoma</td><td>↑</td><td>↓</td><td>↑</td><td>↑</td><td></td><td></td></tr></tbody></table></div><h4 class="deck-topic">Management of dehydration</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Uses in mild to moderate dehydration</li><li>Dose: 50-100 mL/Kg over 4-6 Hours, 10mL/Kg per stool or vomit</li><li>Monitoring for improvement, if not improved start IVF</li></ul></div><div class="deck-card mgmt"><span class="deck-card-h">Management</span><ul><li>severe dehydration</li><li>Not tolerating orally</li><li>Unresponsive to ORS</li><li>Avoid anti-diarrheal &amp; anti-emetics unless there is confirmed bacterial infection</li></ul></div></div><h4 class="deck-topic">Infantile colic</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Paroxysms of irritability, fussing or crying that last more than 3 hours/day, occur more than 3 days/ week, persists for more than 3 weeks in otherwise health defined patient.</li><li>Paroxysms of irritability, fussing or crying that last more than 3 hours/day, occur more than 3 days/ week, persists for more than 3 weeks in otherwise health defined patient.</li></ul></div><div class="deck-card mgmt"><span class="deck-card-h">Management</span><ul><li>Supportive &amp; behavioral adaptation</li><li>Supportive &amp; behavioral adaptation</li></ul></div></div>
                </section>
            `,
            questions: [
                {
                    q: 'A mother is worried that her 18-month-old is not yet speaking. Which finding is a genuine developmental red flag requiring referral?',
                    options: ['No two-word phrases at 18 months', 'No pointing to objects by 18 months', 'Walking independently since 13 months', 'A vocabulary of about 10 words at 18 months'],
                    answer: 1,
                    explanation: 'Absent pointing (a joint-attention skill) by 18 months is a red flag, notably for autism spectrum disorder. Two-word phrases are expected by 24 months, and ~10 words at 18 months is normal — so those are not red flags.'
                },
                {
                    q: 'On exam of a healthy 5-month-old, which primitive reflex would be abnormal if it were still ABSENT — i.e., is normally still present at this age?',
                    options: ['Moro reflex', 'Plantar grasp reflex', 'Rooting reflex', 'Palmar grasp — should have just disappeared'],
                    answer: 1,
                    explanation: 'The plantar grasp persists until 9–12 months, so it is normally present at 5 months. The Moro and rooting reflexes disappear by 3–4 months, and the palmar grasp by 4–6 months. Persistence of primitive reflexes beyond their expected age suggests a CNS problem.'
                }
            ]
        },
        {
            id: 'peds-heme-onc',
            title: '08 — Hematology / Oncology',
            title_en: 'Anemia · Sickle Cell · Thalassemia · Bleeding · Leukemia',
            summaryHtml: `
                <h3>Iron Deficiency Anemia</h3>
                <ul>
                    <li>Pallor, PICA, koilonychia; CBC microcytic hypochromic, <b>low ferritin, high TIBC, ↑RDW</b> (differentiates from thalassemia)</li>
                    <li>Rx: oral iron 3–6 mg/kg/day elemental (+ vit C); reticulocytosis in 3–5 days; continue 3–6 mo after Hb normalizes</li>
                </ul>

                <h3>Sickle Cell Disease</h3>
                <table>
                    <thead><tr><th>Crisis</th><th>Features</th><th>Management</th></tr></thead>
                    <tbody>
                        <tr><td>Vaso-occlusive (pain)</td><td>Bone/joint/abdominal pain; dactylitis</td><td>Hydration, analgesia, oxygen</td></tr>
                        <tr><td>Aplastic</td><td>Parvovirus B19; pancytopenia, no reticulocytosis</td><td>Transfusion</td></tr>
                        <tr><td>Splenic sequestration</td><td>Splenomegaly, severe anemia, hypotension</td><td>Transfusion ± splenectomy</td></tr>
                        <tr><td>Acute chest syndrome</td><td>Fever, chest pain, hypoxia, new infiltrate</td><td>Exchange transfusion, antibiotics</td></tr>
                    </tbody>
                </table>
                <ul>
                    <li><b>Chronic care</b>: penicillin prophylaxis 2 mo–5 y, hydroxyurea (↑HbF), pneumococcal/meningococcal vaccines, annual transcranial Doppler, folic acid</li>
                </ul>

                <h3>Thalassemia &amp; Bleeding Disorders</h3>
                <ul>
                    <li><b>Alpha</b> (chr 16, 4 genes): 4-gene deletion = Bart's hydrops (lethal in utero); <b>Beta</b> (chr 11): major = Cooley anemia (transfusion-dependent)</li>
                    <li><b>ITP</b>: isolated thrombocytopenia after viral illness, normal exam; most resolve in 6 mo; observe if no bleeding, IVIG/steroids/anti-D if active bleeding or &lt;10,000</li>
                    <li><b>Hemophilia A</b> (X-linked, factor VIII): hemarthrosis, ↑aPTT normal PT → factor VIII ± DDAVP (mild)</li>
                    <li><b>von Willebrand</b> (most common, AD): mucocutaneous bleeding, ↑bleeding time, ↓vWF</li>
                </ul>

                <h3>Leukemia &amp; Lymphoma</h3>
                <ul>
                    <li><b>ALL</b> (most common childhood cancer): fever, pallor, bone pain, HSM; bone marrow &gt;25% blasts → multi-agent chemo + intrathecal CNS prophylaxis</li>
                    <li><b>AML</b>: Auer rods (MPO+), gum hypertrophy, chloromas</li>
                    <li><b>Hodgkin</b>: painless rubbery cervical nodes, B symptoms, <b>Reed-Sternberg cells</b></li>
                    <li><b>Burkitt</b>: starry-sky histology, jaw (endemic), EBV, t(8;14) c-myc</li>
                </ul>
            
                <section class="topic deck-enrich">
                    <h3>Study-deck deep dive</h3>
                    <p class="deck-intro">Every comparison table, animated algorithm and clinical pearl from the high-yield SMLE deck for this topic.</p>
<figure class="deck-block algo-flow"><figcaption><span class="deck-tag tag-algo">Algorithm</span> Approach to anaemia (by MCV)</figcaption><div class="algo-row"><div class="algo-node start" style="animation-delay:0.00s">Anaemia → check MCV</div></div><div class="algo-arrow" style="animation-delay:0.05s"></div><div class="algo-fork"><div class="algo-branch"><span class="algo-label" style="animation-delay:0.12s">Microcytic (&lt;80)</span><div class="algo-node end" style="animation-delay:0.12s">Iron deficiency, thalassaemia, anaemia of chronic disease, sideroblastic anaemia</div></div><div class="algo-branch"><span class="algo-label" style="animation-delay:0.22s">Normocytic (80–100)</span><div class="algo-node proc" style="animation-delay:0.22s">Check reticulocyte count</div><div class="algo-arrow mini" style="animation-delay:0.36s"></div><div class="algo-node proc" style="animation-delay:0.32s">Low retic → marrow failure, aplastic, myelofibrosis, leukaemia / metastasis, renal failure, ACD</div><div class="algo-arrow mini" style="animation-delay:0.46s"></div><div class="algo-node end" style="animation-delay:0.42s">High retic → SCD, G6PD, hereditary spherocytosis, AIHA, PNH</div></div><div class="algo-branch"><span class="algo-label" style="animation-delay:0.52s">Macrocytic (&gt;100)</span><div class="algo-node end" style="animation-delay:0.52s">Megaloblastic (B12 / folate deficiency); alcoholic liver disease</div></div></div></figure><h4 class="deck-topic">Iron Deficiency Anemia</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Fatigue, lethargy</li><li>Pallor, PICA, koilonychia</li><li>Cardiac: tachycardia</li><li>Angular cheilitis, Atrophic glossitis</li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>CBC: Low Hb ( men &lt;13, women &lt;12)</li><li>Low: Hb, ferritin, MCV, HCT.</li><li>High: TIBC, Platelet (reactive thrombocytosis), RDW (differentiate between IDA &amp; Thalassemia)</li><li>Trial of oral iron therapy</li></ul></div></div><h4 class="deck-topic">Sickle cell disease</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Vaso-occlusive crisis: sudden severe pain in hands and feet</li><li>Aplastic crisis (Parvo B19 infection): Pancytopenia W/O reticulocytosis</li><li>Splenic sequestration crisis: Splenomegaly, Severe anemia, hypotension, tachycardia, pallor</li><li>Hemolytic crisis: Jaundice, dark urine, reticulocytosis.</li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>Initially Blood smear (target cells), Confirmatory Hb electrophoresis</li><li>Vaso-occlusive crisis: Analgesia (Usually opioids), Hydration, Oxygen if hypoxic</li><li>Splenic sequestration crisis: Urgent blood transfusion, Splenectomy (in recurrent cases)</li><li>Hemolytic and Aplastic Supportive management, Transfusion if indicated</li></ul></div></div><h4 class="deck-topic">Acute chest syndrome</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Fever</li><li>cough</li><li>Chest pain, murmur</li><li>Dyspnea</li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>Chest x-ray: New pulmonary infiltrate</li><li>Broad spectrum antibiotics</li><li>Oxygen, Pain control</li><li>Simple or exchange transfusion</li><li>Prophylaxis: Penicillin, immunization (Pneumococci), Folic acid, Hydroxyurea</li></ul></div></div><h4 class="deck-topic">Sickle cell disease</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Symptoms of anemia, Jaundice</li><li>Pallor, PICA, koilonychia</li><li>Cardiac: tachycardia</li><li>Angular cheilitis, Atrophic glossitis</li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>CBC: Low Hb ( men &lt;13, women &lt;12)</li><li>Low: Hb, ferritin, MCV, HCT.</li><li>High: TIBC, Platelet (reactive thrombocytosis), RDW (differentiate between IDA &amp; Thalassemia)</li><li>Trial of oral iron therapy</li></ul></div></div>
                </section>
            `,
            questions: [
                {
                    q: 'How to differentiate iron deficiency anemia from thalassemia trait?',
                    options: ['RDW is elevated in IDA, normal in thalassemia', 'MCV is lower in thalassemia', 'Ferritin is low in both', 'Iron levels are normal in thalassemia'],
                    answer: 0,
                    explanation: 'RDW is the key differentiator: elevated in IDA (anisocytosis), normal in thalassemia (uniform microcytosis). Ferritin is normal in thalassemia trait.'
                }
            ]
        },
        {
            id: 'peds-immunology',
            title: '09 — Immunology',
            title_en: 'Primary Immunodeficiency Disorders',
            summaryHtml: `
                <h3>When to Suspect Primary Immunodeficiency</h3>
                <ul>
                    <li>≥8 ear infections / year · ≥2 serious sinus infections or pneumonias / year · recurrent deep abscesses · infections with unusual organisms · FTT with infections · autoimmune phenomena</li>
                </ul>

                <h3>Key Disorders</h3>
                <ul>
                    <li><b>CVID</b>: low IgG/IgA/IgM, recurrent sinopulmonary infections, autoimmune disease, bronchiectasis → IVIG replacement + antibiotic prophylaxis</li>
                    <li><b>X-linked agammaglobulinemia (Bruton)</b>: absent B cells, very low Ig, infections after 6 mo (maternal IgG wanes), <b>no tonsils/lymph nodes</b>; live vaccines C/I</li>
                    <li><b>SCID</b>: defective T &amp; B cells, infections in first months, FTT, chronic diarrhea, <b>no thymic shadow</b> ("bubble boy") → HSCT is the only cure; no live vaccines</li>
                    <li><b>Wiskott-Aldrich</b> (X-linked): triad of thrombocytopenia (small platelets) + eczema + recurrent infections</li>
                    <li><b>DiGeorge (22q11.2)</b>: CATCH-22 — Cardiac, Abnormal facies, Thymic hypoplasia (T-cell), Cleft palate, Hypocalcemia</li>
                    <li><b>Chronic granulomatous disease (CGD)</b>: defective NADPH oxidase → recurrent infections with <b>catalase-positive</b> organisms (S. aureus, Serratia, Burkholderia, Aspergillus, Nocardia); abnormal <b>DHR flow cytometry / nitroblue-tetrazolium (NBT)</b> test → prophylactic TMP-SMX + itraconazole ± interferon-γ</li>
                    <li><b>Leukocyte adhesion deficiency (LAD-1)</b>: delayed umbilical cord separation (&gt;30 days), no pus, marked leukocytosis, recurrent skin/mucosal infections</li>
                </ul>

                <h3>Complement Deficiencies</h3>
                <ul>
                    <li><b>Terminal complement (C5–C9) deficiency</b>: recurrent <b>Neisseria</b> (meningococcal/gonococcal) infections → meningococcal vaccination</li>
                    <li><b>C1 esterase inhibitor deficiency</b>: hereditary angioedema — recurrent non-pruritic, non-urticarial swelling of face/airway/gut; C4 low → C1-INH concentrate / icatibant (bradykinin-mediated, does NOT respond to antihistamines/epinephrine)</li>
                </ul>
            
                <section class="topic deck-enrich">
                    <h3>Study-deck deep dive</h3>
                    <p class="deck-intro">Every comparison table, animated algorithm and clinical pearl from the high-yield SMLE deck for this topic.</p>
<h4 class="deck-topic">Down syndrome</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>CNS: Hypotonia, Developmental delay, seizure, intellectual disability</li><li>CVS: Atrioventricular septal defect (MC), VSD, ASD</li><li>Endocrine: Congenital Hypothyroidism</li><li>GI: Duodenal atresia</li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>Trisomy 21 1% + age related risk of the mother at time of next pregancy</li><li>Translocation karyotyping to both parents to calculate the recurrence risk</li><li>Mosaicism Usually not inherited</li></ul></div></div>
                </section>
            `,
            questions: [
                {
                    q: 'A boy has recurrent abscesses and pneumonia caused by Staphylococcus aureus, Serratia and Aspergillus. A dihydrorhodamine (DHR)/nitroblue-tetrazolium test is abnormal. Diagnosis?',
                    options: ['Chronic granulomatous disease', 'X-linked agammaglobulinemia', 'Terminal complement deficiency', 'Wiskott-Aldrich syndrome'],
                    answer: 0,
                    explanation: 'CGD results from defective NADPH oxidase, so phagocytes cannot kill catalase-positive organisms (S. aureus, Serratia, Burkholderia, Aspergillus, Nocardia). The DHR/NBT test is diagnostic. Manage with prophylactic TMP-SMX, itraconazole and interferon-γ.'
                },
                {
                    q: 'A 9-month-old boy has had recurrent sinopulmonary infections since about 6 months of age. Exam shows absent tonsils and no palpable lymph nodes; labs show very low immunoglobulins of all classes with absent B cells. Diagnosis?',
                    options: ['X-linked (Bruton) agammaglobulinemia', 'Chronic granulomatous disease', 'DiGeorge syndrome', 'C1 esterase inhibitor deficiency'],
                    answer: 0,
                    explanation: 'Bruton agammaglobulinemia: a BTK defect halts B-cell maturation, so B cells and all immunoglobulins are absent and there is no lymphoid tissue (tonsils/nodes). Infections begin around 6 months as maternal IgG wanes. Live vaccines are contraindicated.'
                },
                {
                    q: 'A male infant presents with the triad of eczema, recurrent infections, and easy bruising; the blood film shows small platelets with thrombocytopenia. Which X-linked disorder is most likely?',
                    options: ['Wiskott-Aldrich syndrome', 'Severe combined immunodeficiency (SCID)', 'Common variable immunodeficiency', 'Ataxia-telangiectasia'],
                    answer: 0,
                    explanation: 'Wiskott-Aldrich syndrome (X-linked WAS gene) classically presents with the triad of thrombocytopenia with SMALL platelets, eczema, and recurrent infections. SCID presents in the first months with FTT, chronic diarrhea and an absent thymic shadow.'
                }
            ]
        },
        {
            id: 'peds-neonatology',
            title: '10 — Neonatology',
            title_en: 'TORCH · Sepsis · NEC · Jaundice · Respiratory Distress',
            summaryHtml: `
                <h3>Congenital (TORCH) Infections</h3>
                <table>
                    <thead><tr><th>Infection</th><th>Key features</th></tr></thead>
                    <tbody>
                        <tr><td>Toxoplasmosis</td><td>Chorioretinitis, hydrocephalus, intracranial calcifications (triad)</td></tr>
                        <tr><td>Rubella (1st trim worst)</td><td>Sensorineural deafness, cataracts, PDA, blueberry muffin rash</td></tr>
                        <tr><td>CMV</td><td>SNHL, microcephaly, periventricular calcifications, petechiae, IUGR</td></tr>
                        <tr><td>HSV (perinatal)</td><td>Skin vesicles, encephalitis, DIC; localized/CNS/disseminated</td></tr>
                        <tr><td>Syphilis</td><td>Snuffles, rash on palms/soles, Hutchinson teeth, saddle nose, saber shins</td></tr>
                    </tbody>
                </table>

                <h3>Neonatal Sepsis &amp; NEC</h3>
                <ul>
                    <li><b>Early-onset (&lt;72 h)</b>: GBS (most common), E. coli; RF maternal GBS, chorioamnionitis, prolonged ROM &gt;18 h → <b>ampicillin + gentamicin</b></li>
                    <li><b>Late-onset (3 d–3 mo)</b>: GBS, S. aureus/CONS, Listeria → <b>vancomycin + cefotaxime</b></li>
                    <li><b>NEC</b>: prematurity (most important), formula feeding; bloody stools, <b>pneumatosis intestinalis</b>; portal venous gas/pneumoperitoneum (perforation) → NPO, NG decompression, antibiotics, surgery if perforation</li>
                </ul>

                <h3>Neonatal Jaundice</h3>
                <ul>
                    <li><b>Physiologic</b>: after 24 h, peaks 3–5 d, unconjugated, &lt;15 mg/dL term</li>
                    <li><b>Pathologic (red flags)</b>: jaundice in first 24 h, rapid rise (&gt;5 mg/dL/day), conjugated, &gt;15 mg/dL, persisting &gt;2 wk</li>
                    <li><b>Rh/ABO incompatibility</b>: jaundice &lt;24 h, anemia, <b>positive Coombs</b> → phototherapy → IVIG → exchange transfusion</li>
                </ul>

                <h3>Respiratory Distress &amp; Seizures</h3>
                <ul>
                    <li><b>RDS</b> (preterm, surfactant deficiency): ground-glass CXR, air bronchograms → surfactant + CPAP; antenatal steroids</li>
                    <li><b>TTN</b> (term, C/S): delayed lung fluid clearance, perihilar streaking, resolves 24–72 h</li>
                    <li><b>Meconium aspiration</b>: term/post-term, patchy infiltrates → suction if non-vigorous, NO for PPHN</li>
                    <li><b>Neonatal seizures</b>: most common cause HIE; 1st-line <b>phenobarbital</b>; treat glucose/calcium</li>
                </ul>
            
                <section class="topic deck-enrich">
                    <h3>Study-deck deep dive</h3>
                    <p class="deck-intro">Every comparison table, animated algorithm and clinical pearl from the high-yield SMLE deck for this topic.</p>
<h4 class="deck-topic">Necrotizing enterocolitis</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Prematurity</li><li>Low birth weight</li><li>Formula feeding</li><li>Intestinal ischemia/Hypoxia</li><li>Feeding intolerance/Vomiting</li><li>Abdominal distension/discoloration</li><li>Rectal bleeding</li><li>Unstable vital signs: Fever, Bradypnea, Bradycardia</li></ul></div></div>
                </section>
            `,
            questions: [
                {
                    q: 'A 3-week-old premature infant on formula feeds develops abdominal distension, bloody stools, and lethargy. Abdominal X-ray shows pneumatosis intestinalis. What is the most appropriate initial management?',
                    options: ['Make NPO, start NG decompression, IV fluids and broad-spectrum antibiotics', 'Continue feeds and give oral rehydration solution', 'Immediate laparotomy regardless of findings', 'Start a stool softener and observe'],
                    answer: 0,
                    explanation: 'This is necrotizing enterocolitis (NEC) — prematurity and formula feeding are the key risks and pneumatosis intestinalis is diagnostic. Initial care is bowel rest (NPO), NG decompression, IV fluids and antibiotics. Surgery is reserved for perforation (pneumoperitoneum) or clinical deterioration.'
                },
                {
                    q: 'A term newborn develops visible jaundice at 12 hours of life with anemia and a positive direct Coombs test. Which statement is correct?',
                    options: ['Jaundice within the first 24 hours is pathologic and needs urgent evaluation', 'This is physiologic jaundice and needs only reassurance', 'Phototherapy is contraindicated with a positive Coombs test', 'It is caused by breast-milk jaundice'],
                    answer: 0,
                    explanation: 'Jaundice appearing in the first 24 hours is always pathologic. A positive Coombs with anemia indicates isoimmune hemolysis (Rh/ABO incompatibility). Escalation is phototherapy → IVIG → exchange transfusion. Physiologic jaundice appears after 24 h and peaks on days 3–5.'
                }
            ]
        },
        {
            id: 'peds-nephrology',
            title: '11 — Nephrology',
            title_en: 'Nephrotic · Nephritic / PSGN · UTI',
            summaryHtml: `
                <h3>Nephrotic Syndrome</h3>
                <ul>
                    <li><b>Tetrad</b>: massive proteinuria (&gt;3.5 g/day), hypoalbuminemia (&lt;2.5), edema, hyperlipidemia</li>
                    <li><b>Minimal change disease</b> (~80% in children, age 2–6 y): normal C3/C4, no HTN/hematuria, <b>steroid-responsive</b> → prednisone 60 mg/m²/day 4–6 wk then taper</li>
                    <li><b>FSGS</b>: steroid-resistant, may have hematuria/HTN → renal biopsy</li>
                    <li><b>Complications</b>: SBP (S. pneumoniae), thrombosis (↓antithrombin III), infection (↓IgG)</li>
                </ul>

                <h3>Nephritic Syndrome &amp; PSGN</h3>
                <ul>
                    <li><b>PSGN</b>: 1–3 wk after strep (skin 3–6 wk), tea-colored urine, edema, HTN; <b>low C3 normal C4</b>, ↑ASO; C3 normalizes in 6–8 wk → supportive, salt/fluid restriction</li>
                </ul>
                <table>
                    <thead><tr><th>Feature</th><th>PSGN</th><th>IgA nephropathy</th><th>HSP</th></tr></thead>
                    <tbody>
                        <tr><td>Trigger</td><td>Strep 1–3 wk prior</td><td>Concurrent URI (synpharyngitic)</td><td>URI</td></tr>
                        <tr><td>C3</td><td>Low (normalizes)</td><td>Normal</td><td>Normal</td></tr>
                        <tr><td>Rash</td><td>No</td><td>No</td><td>Palpable purpura</td></tr>
                    </tbody>
                </table>

                <h3>Urinary Tract Infection</h3>
                <ul>
                    <li>Infants: fever, poor feeding, irritability, vomiting; older: dysuria, frequency, flank pain</li>
                    <li><b>Urine culture = gold standard</b> (clean catch ≥100,000; catheter ≥50,000; suprapubic any growth); UA pyuria/nitrites/LE</li>
                    <li>Oral antibiotics (TMP-SMX, cephalosporins); IV if &lt;2 mo, toxic, vomiting, pyelonephritis. <b>Renal/bladder US after first febrile UTI</b>; VCUG if abnormal US/recurrent</li>
                </ul>
            
                <section class="topic deck-enrich">
                    <h3>Study-deck deep dive</h3>
                    <p class="deck-intro">Every comparison table, animated algorithm and clinical pearl from the high-yield SMLE deck for this topic.</p>
<h4 class="deck-topic">Nephrotic syndrome</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Massive proteinuria &gt;3.5g/day</li><li>Edema (periorbital edema)</li><li>Hypoalbuminemia</li><li>Hyperlipidemia</li><li>Remission: 3 consecutive days of negative urine dipstick for proteinuria</li><li>Steroid resistant nephrotic syndrome: Inability to induce remission within 4 weeks of steroid therapy</li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>Confirmation of nephrotic range proteinuria ( 24-Hour urine protein test)</li><li>Urine microscopy (Fatty cast)</li><li>Hyperlipidemia (High LDL, TG)</li><li>Low total protein &amp; albumin</li><li>Renal biopsy (not indicated in minimal change disease)</li></ul></div><div class="deck-card mgmt"><span class="deck-card-h">Management</span><ul><li>Edema: Fluid &amp; protein restrictions</li><li>Proteinuria: ACEI Or ARBs</li><li>Dyslipidemia: Atorvastatin</li><li>Minimal change disease: Prednisolone</li></ul></div></div><h4 class="deck-topic">Post streptococcal glomerulonephritis</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Symptoms occur after 1-6 weeks following acute infection</li><li>Hematuria (tea - cola colored urine), oliguria</li><li>Hypertension</li><li>Edema</li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>Urinalysis &amp; microscopy: Hematuria, proteinuria, RBC cast → first step</li><li>Creatinine level</li><li>Low C3, Normal C4</li><li>Treatment: Supportive care (Fluid &amp; salt restriction) Anti- hypertensive: ACEI or ARBs or CCB</li></ul></div></div><h4 class="deck-topic">Urinary tract infection</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Infants: Fever, poor feeding, irritability, vomiting</li><li>Toddlers: Abdominal pain, fever, foul smelling urine</li><li>Older children: dysuria, frequency, urgency, suprapubic/flank pain</li><li>Edema</li><li>Constipation</li><li>Anatomical abnormalities: VUR, posterior urethral valve,</li><li>Uncircumscribed</li><li>Incomplete bladder emptying</li><li>Oral antibiotics: (Cefixime, Amoxicillin)</li><li>Alternatives: TMP-SMS , Nitrofurantoin</li><li>IV antibiotics: (Ceftriaxone or cefotaxime) incase of severe infection, &gt;3Months, intolerate orally</li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>Urine culture → gold standard</li><li>Positive if: clean catch (≥100,000 CFU)</li><li>catheter specimen (≥ 50,000 CFU)</li><li>Suprapubic aspiration (most accurate method) Urinalysis: Positive for: (Pyuria, nitrate, leukocyte esterase)</li></ul></div></div>
                </section>
            `,
            questions: [
                {
                    q: 'Nephrotic syndrome in a child with normal complement and excellent response to steroids. Diagnosis?',
                    options: ['Minimal change disease', 'FSGS', 'MPGN', 'PSGN'],
                    answer: 0,
                    explanation: 'MCD = normal C3/C4, steroid-responsive, most common in children 2-6 years. FSGS and MPGN are typically steroid-resistant.'
                }
            ]
        },
        {
            id: 'peds-neurology',
            title: '12 — Neurology',
            title_en: 'MG & GBS · Seizures · Cerebral Palsy · Headache',
            summaryHtml: `
                <h3>Myasthenia Gravis &amp; GBS</h3>
                <ul>
                    <li><b>Myasthenia gravis</b>: anti-AChR antibodies, fluctuating weakness worse with activity, descending (ptosis/diplopia first); → pyridostigmine, prednisone; IVIG/plasmapheresis for crisis</li>
                    <li><b>GBS</b>: <b>ascending</b> symmetric paralysis after infection (Campylobacter), areflexia; CSF <b>albuminocytologic dissociation</b> → IVIG or plasmapheresis; monitor respiration</li>
                </ul>

                <h3>Seizure Disorders</h3>
                <ul>
                    <li><b>Febrile seizures</b>: 6 mo–5 y; simple = generalized, &lt;15 min, once/24 h → no AED, treat fever; LP if &lt;12 mo or meningeal signs</li>
                    <li><b>Infantile spasms (West)</b>: 4–8 mo, salaam seizures, <b>hypsarrhythmia</b> on EEG → ACTH or vigabatrin (vigabatrin if tuberous sclerosis)</li>
                </ul>
                <div class="sum-callout">
                    <b>Algorithm — status epilepticus</b>
                    <ol>
                        <li>ABCs — airway, oxygen, IV access, check glucose</li>
                        <li>Benzodiazepine — lorazepam 0.1 mg/kg IV or midazolam 0.2 mg/kg IM</li>
                        <li>Loading AED — fosphenytoin/phenytoin 20 mg/kg or levetiracetam 40–60 mg/kg</li>
                        <li>Refractory — midazolam infusion, phenobarbital or propofol + intubation</li>
                    </ol>
                </div>

                <h3>Cerebral Palsy &amp; Headache</h3>
                <ul>
                    <li><b>Cerebral palsy</b>: non-progressive motor disorder from perinatal brain injury; spastic (~80%); multidisciplinary therapy, baclofen, botulinum toxin</li>
                    <li><b>Migraine</b>: pulsating, ± aura, nausea/photophobia; acute NSAIDs/triptans (&gt;6 y); prophylaxis cyproheptadine, propranolol, topiramate</li>
                </ul>
                <div class="sum-callout"><b>Headache red flags (image)</b>: thunderclap, morning headache with vomiting, wakes from sleep, progressive, neuro deficits, seizures, papilledema, age &lt;3 y.</div>
            
                <section class="topic deck-enrich">
                    <h3>Study-deck deep dive</h3>
                    <p class="deck-intro">Every comparison table, animated algorithm and clinical pearl from the high-yield SMLE deck for this topic.</p>
<div class="deck-block deck-tbl"><div class="deck-cap"><span class="deck-tag tag-tbl">Table</span> Migraine — the four phases</div><table><thead><tr><th>Phase</th><th>Timing</th><th>Symptoms</th></tr></thead><tbody><tr><td><b>Prodrome</b></td><td>Up to 24 h before</td><td>Mood changes, trouble sleeping, difficulty concentrating</td></tr><tr><td><b>Aura</b></td><td>5–60 min before/during</td><td>Muscle weakness, vision changes, tinnitus</td></tr><tr><td><b>Headache attack</b></td><td>4–72 h</td><td>Nausea/vomiting, severe one-sided head pain, sensitivity to sound/light/odours</td></tr><tr><td><b>Postdrome</b></td><td>Up to 48 h</td><td>Fatigue, neck stiffness, trouble focusing</td></tr></tbody></table></div><div class="deck-block deck-tbl"><div class="deck-cap"><span class="deck-tag tag-tbl">Table</span> Tension headache — episodic vs chronic</div><p class="deck-subcap">the most common type of headache</p><table><thead><tr><th></th><th>Episodic</th><th>Chronic</th></tr></thead><tbody><tr><td><b>Duration</b></td><td>30 minutes to a week</td><td>Several hours or continuous</td></tr><tr><td><b>Frequency</b></td><td>&lt;15 days/month for 3 months</td><td>&gt;15 days/month for ≥3 months</td></tr></tbody></table><ul class="deck-tbl-notes"><li>Symptoms: mild–moderate pressing/tightening ('tight band' around the head); tenderness of scalp, neck &amp; shoulder muscles.</li></ul></div><div class="deck-block deck-tbl"><div class="deck-cap"><span class="deck-tag tag-tbl">Table</span> Hypoxic-ischaemic encephalopathy (HIE) — signs</div><table><thead><tr><th>Timing</th><th>Signs &amp; symptoms</th></tr></thead><tbody><tr><td><b>Before delivery</b></td><td>Decreased fetal movement, severe maternal cramping, abnormal fetal heart rate, vaginal bleeding, abnormal maternal weight gain, maternal hypertension</td></tr><tr><td><b>At birth</b></td><td>Low Apgar (&gt;5 min), seizures, difficulty feeding, breathing problems, metabolic / mixed acidaemia, hypotonia, organ problems, abnormal response to light, altered consciousness, coma, weak/absent cry</td></tr><tr><td><b>During infancy</b></td><td>Impaired motor function, delayed development, seizure disorders, delayed growth, hearing &amp; visual impairment</td></tr></tbody></table></div><h4 class="deck-topic">Myasthenia graves</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Autoimmune disorder caused by A.Ch receptor antibody at neuromuscular junction Impaired neuromuscular transmission which causes</li><li>Fluctuating muscle weakness in descending pattern, improves with rest, worsens with activity</li><li>Ptosis, diplopia, facial weakness, fatigue</li><li>Normal reflexes and sensation</li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>A.Ch receptor antibody testing</li><li>Edrophonium test</li><li>Pyridostigmine</li><li>IVIG or PLEX in severe cases</li></ul></div></div><h4 class="deck-topic">Guillain barre syndrome</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Ascending symmetrical weakness</li><li>Areflexia, hyporeflexia</li><li>paresthesia</li><li>Symptoms preceded by infection (Campylobacter jejuni mostly)</li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>CSF: High protein, normal WBC</li><li>Nerve conduction velocity: Slowed response</li><li>IVIG First line</li><li>Plasmapheresis in severe cases</li></ul></div></div>
                </section>
            `,
            questions: [
                {
                    q: 'A 4-year-old is brought in with progressive, symmetric, ascending weakness and absent deep-tendon reflexes about two weeks after a diarrheal illness. Lumbar puncture shows high protein with a normal cell count. What is the diagnosis and best treatment?',
                    options: ['Guillain-Barré syndrome — IVIG or plasmapheresis', 'Myasthenia gravis — pyridostigmine', 'Botulism — antitoxin', 'Transverse myelitis — high-dose steroids'],
                    answer: 0,
                    explanation: 'Ascending symmetric paralysis with areflexia after infection (often Campylobacter) plus CSF albuminocytologic dissociation (high protein, normal cells) is Guillain-Barré syndrome. Treat with IVIG or plasmapheresis and monitor respiratory function closely.'
                },
                {
                    q: 'A 6-month-old has clusters of sudden flexor "jackknife" spasms. EEG shows hypsarrhythmia. What is the diagnosis and first-line therapy?',
                    options: ['Infantile spasms (West syndrome) — ACTH or vigabatrin', 'Simple febrile seizure — antipyretics only', 'Absence epilepsy — ethosuximide', 'Breath-holding spells — reassurance'],
                    answer: 0,
                    explanation: 'Salaam/jackknife spasms at 4–8 months with hypsarrhythmia on EEG define infantile spasms (West syndrome). First-line therapy is ACTH or vigabatrin (vigabatrin is preferred when associated with tuberous sclerosis).'
                }
            ]
        },
        {
            id: 'peds-pulmonology',
            title: '13 — Pulmonology',
            title_en: 'Asthma · Foreign Body Aspiration · Cystic Fibrosis',
            summaryHtml: `
                <h3>Bronchial Asthma</h3>
                <ul>
                    <li>Recurrent wheeze/cough/SOB, variable reversible obstruction, worse at night/exercise/allergens; spirometry FEV1/FVC &lt;0.70, bronchodilator response ↑FEV1 ≥12%</li>
                </ul>
                <div class="sum-callout">
                    <b>Algorithm — acute asthma (ED)</b>
                    <ol>
                        <li>O2 — maintain SpO2 &gt;92%</li>
                        <li>SABA — albuterol nebulizer (q20 min × 3)</li>
                        <li>Ipratropium (SAMA) — add for moderate-severe</li>
                        <li>Systemic steroids — oral prednisone or IV methylprednisolone</li>
                        <li>IV magnesium sulfate — single dose if severe</li>
                        <li>Admit if SpO2 &lt;92% or persistent severe symptoms</li>
                    </ol>
                </div>
                <table>
                    <thead><tr><th>Step (5–11 y)</th><th>Controller</th></tr></thead>
                    <tbody>
                        <tr><td>1</td><td>None (SABA as needed)</td></tr>
                        <tr><td>2</td><td>Low-dose ICS daily</td></tr>
                        <tr><td>3</td><td>Low-dose ICS + LABA OR medium-dose ICS</td></tr>
                        <tr><td>4</td><td>Medium-dose ICS + LABA (± LTRA)</td></tr>
                        <tr><td>5</td><td>High-dose ICS + LABA + omalizumab/systemic steroids</td></tr>
                    </tbody>
                </table>

                <h3>Foreign Body Aspiration &amp; Cystic Fibrosis</h3>
                <ul>
                    <li><b>FB aspiration</b>: choking → cough/wheeze, unilateral decreased breath sounds; most common site <b>right main bronchus</b>; CXR air trapping → bronchoscopy (rigid); no blind finger sweep</li>
                    <li><b>Cystic fibrosis</b>: chronic cough, recurrent pneumonia (Pseudomonas/S. aureus), meconium ileus, pancreatic insufficiency, salty skin; <b>sweat chloride ≥60</b> (gold standard), F508del → chest physio, pancreatic enzymes, high-calorie diet, CFTR modulators</li>
                </ul>
            
                <section class="topic deck-enrich">
                    <h3>Study-deck deep dive</h3>
                    <p class="deck-intro">Every comparison table, animated algorithm and clinical pearl from the high-yield SMLE deck for this topic.</p>
<h4 class="deck-topic">Bronchial Asthma</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Persistent dry cough</li><li>Shortness of breath</li><li>End Expiratory wheeze</li><li>Features of atopy: Allergic rhinitis, allergic conjunctivitis, eczema.</li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>Spirometry is the gold standard diagnostic tool</li><li>Showed: FEV1/FVC &lt;70% Obstructive lung disease</li><li>Response to bronchodilation FEV1 ≤12% &amp; ≥ 200ml</li><li>Methacholine challenge test: FEV1 =&gt;20% drop from baseline spirometry</li></ul></div><div class="deck-card mgmt"><span class="deck-card-h">Management</span><ul><li>Nebulized SABA (Salbutamol)</li><li>Nebulized SAMA (Ipratropium bromide)</li><li>Systemic steroid</li><li>Single dose of IV Magnesium sulphate</li><li>Step1: ICS PRN when SABA used</li><li>Step2: Low dose ICS</li><li>Step3: Low dose ICS + LABA</li><li>Step4 : Medium - high dose ICS + LABA (+ - Leukotriene modifier)</li><li>Step5: Step 4 + Omalizumab or systemic steroids</li></ul></div></div><h4 class="deck-topic">Cystic fibrosis</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Chronic respiratory symptoms: Wet cough, large volume sputum</li><li>Poor growth/ poor weight gain</li><li>GIT: meconium ileus, steatorrhea (Greasy stool)</li><li>Sinusitis, Pneumonia, Nasal polyp</li></ul></div><div class="deck-card mgmt"><span class="deck-card-h">Management</span><ul><li>Step1: ICS PRN when SABA used</li><li>Step2: Low dose ICS</li><li>Step3: Low dose ICS + LABA</li><li>Step4 : Medium - high dose ICS + LABA (+ - Leukotriene modifier)</li><li>Step5: Step 4 + Omalizumab or systemic steroids</li></ul></div></div><h4 class="deck-topic">Sudden infant death syndrome</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Sleeping on the stomach side</li><li>Soft bedding or overheating</li><li>Maternal smoke during pregnancy</li><li>Premature infant or low birth weight</li></ul></div><div class="deck-card mgmt"><span class="deck-card-h">Management</span><ul><li>Place baby on back to sleep (Best strategy)</li><li>Use a firm mattress</li><li>Keep sleeping area separate to the parents but in the same room</li><li>Pacifier at bed time</li></ul></div></div><h4 class="deck-topic">Tracheomalacia/ Laryngomalacia</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Expiratory wheeze</li><li>Cough</li><li>Stridor</li><li>Noisy breath. Tracheomalacia Disappears in Supine position. Laryngomalacia Disappears in Prone position.</li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>Tracheomalacia Bronchoscopy</li><li>Laryngomalacia Laryngoscopy</li><li>Self limiting by 1-2 years old</li></ul></div></div>
                </section>
            `,
            questions: [
                {
                    q: 'A 6-year-old with acute asthma attack, RR 20, HR 97, SpO2 88% after initial stabilization. Reason for admission?',
                    options: ['Hypoxia (SpO2 <92% indicates severe asthma)', 'Patient age', 'Hypotension (BP is normal 110/70)', 'Asthma attack (not a reason by itself)'],
                    answer: 0,
                    explanation: 'SpO2 <92% after initial bronchodilator therapy indicates severe asthma and is an indication for hospitalization. Other criteria: persistent moderate-severe symptoms, incomplete response after 1 hour.'
                }
            ]
        },
        {
            id: 'peds-rheumatology',
            title: '14 — Rheumatology',
            title_en: 'HSP · Juvenile Idiopathic Arthritis · Kawasaki',
            summaryHtml: `
                <h3>Henoch-Schönlein Purpura (IgA Vasculitis)</h3>
                <ul>
                    <li><b>Tetrad</b>: palpable purpura (lower extremities/buttocks), arthritis/arthralgia, abdominal pain, renal involvement (hematuria/proteinuria)</li>
                    <li>Clinical diagnosis; usually self-limited (4–6 wk); NSAIDs for arthritis, steroids for severe GI/renal; <b>monitor UA &amp; BP for 6 months</b></li>
                </ul>

                <h3>Juvenile Idiopathic Arthritis (JIA)</h3>
                <ul>
                    <li><b>Oligoarticular</b> (most common): 1–4 joints, large joints, <b>uveitis risk</b>, ANA+</li>
                    <li><b>Polyarticular</b>: ≥5 joints; RF+ resembles adult RA (worse prognosis)</li>
                    <li><b>Systemic (Still)</b>: daily quotidian fever, evanescent salmon-pink rash, HSM, serositis</li>
                    <li>Rx: NSAIDs (1st), methotrexate, biologics; <b>regular slit-lamp exams</b> for uveitis</li>
                </ul>

                <h3>Kawasaki Disease</h3>
                <ul>
                    <li><b>Fever ≥5 days + 4 of 5</b>: bilateral non-exudative conjunctivitis, mucosal changes (strawberry tongue, cracked lips), cervical lymphadenopathy, polymorphous rash, extremity changes (erythema/edema → periungual desquamation)</li>
                    <li>Rx: <b>IVIG 2 g/kg</b> (reduces coronary aneurysm risk) + aspirin; echo at diagnosis &amp; follow-up</li>
                </ul>
            `,
            questions: [
                {
                    q: 'A 5-year-old with fever, bilateral conjunctivitis, strawberry tongue, cracked lips, rash on trunk, and swollen hands. Coronary artery aneurysm on echo. Diagnosis?',
                    options: ['Kawasaki disease', 'Scarlet fever', 'Stevens-Johnson syndrome', 'Measles'],
                    answer: 0,
                    explanation: 'Kawasaki: fever >5 days + bilateral conjunctivitis + mucosal changes + rash + extremity changes + lymphadenopathy. Treat with IVIG to prevent coronary artery aneurysms.'
                }
            ]
        },
        {
            id: 'peds-uro-ophtho-ortho',
            title: '15 — Urology / Ophthalmology / Orthopedics',
            title_en: 'Cryptorchidism · Amblyopia · DDH · SCFE',
            summaryHtml: `
                <h3>Urology</h3>
                <ul>
                    <li><b>Cryptorchidism</b>: most common congenital genital abnormality; observe to 6 mo → <b>orchiopexy by 6–12 mo</b> (before 18 mo to preserve fertility/reduce malignancy)</li>
                    <li><b>Hypospadias</b>: ventral urethral opening, chordee; <b>do NOT circumcise</b> (foreskin used for repair); repair 6–18 mo</li>
                    <li><b>Testicular torsion</b>: acute severe pain, absent cremasteric reflex, high-riding/horizontal testis → <b>surgical emergency</b> (salvage &gt;90% if &lt;6 h); bilateral orchiopexy</li>
                    <li><b>Posterior urethral valves</b>: most common bladder outlet obstruction in boys; VCUG diagnostic → cystoscopic valve ablation</li>
                </ul>

                <h3>Ophthalmology</h3>
                <ul>
                    <li><b>Amblyopia</b>: most common cause of childhood vision loss; correct cause + <b>patch stronger eye</b> (critical period &lt;7–8 y)</li>
                    <li><b>Congenital cataract</b>: remove within first 6 weeks (critical for visual development); causes include galactosemia, TORCH</li>
                    <li><b>ROP</b>: prematurity + hyperoxia; screen &lt;30 wk GA or &lt;1500 g → laser/anti-VEGF for severe</li>
                </ul>

                <h3>Orthopedics</h3>
                <ul>
                    <li><b>DDH</b>: RF female, breech, FHx; <b>Ortolani/Barlow</b> tests; US &lt;4–6 mo → Pavlik harness (&lt;6 mo), closed reduction/spica (6–18 mo)</li>
                    <li><b>SCFE</b>: obese adolescent, hip/knee pain, limited internal rotation, Drehmann sign → <b>in-situ pinning</b> (do NOT reduce — AVN risk)</li>
                    <li><b>Legg-Calvé-Perthes</b>: avascular necrosis of femoral head, 4–10 y → containment/activity restriction</li>
                    <li><b>Osgood-Schlatter</b>: tibial tubercle apophysitis in active adolescents → rest, ice, NSAIDs (self-limited)</li>
                </ul>
            `,
            questions: [
                {
                    q: 'A 14-year-old obese boy with limp and hip pain. Hip flexion causes external rotation (Drehmann sign). Diagnosis?',
                    options: ['Legg-Calvé-Perthes disease', 'SCFE (Slipped Capital Femoral Epiphysis)', 'DDH', 'Septic arthritis'],
                    answer: 1,
                    explanation: 'SCFE: adolescent, obesity, Drehmann sign (external rotation with hip flexion), limited internal rotation. In-situ pinning required — do NOT attempt reduction.'
                }
            ]
        },
        {
            id: 'peds-vaccination',
            title: '16 — Vaccination',
            title_en: 'Schedule · Vaccine Types · Contraindications',
            summaryHtml: `
                <h3>Pediatric Vaccination Schedule</h3>
                <table>
                    <thead><tr><th>Age</th><th>Vaccines</th></tr></thead>
                    <tbody>
                        <tr><td>Birth</td><td>Hepatitis B #1 (within 24 h)</td></tr>
                        <tr><td>2 months</td><td>DTaP, IPV, Hib, PCV, Rotavirus, Hep B #2</td></tr>
                        <tr><td>4 months</td><td>DTaP, IPV, Hib, PCV, Rotavirus</td></tr>
                        <tr><td>6 months</td><td>DTaP, IPV, Hib, PCV, Hep B #3, Influenza (yearly)</td></tr>
                        <tr><td>12 months</td><td>MMR #1, Varicella #1, PCV #4, Hib #4</td></tr>
                        <tr><td>12–23 months</td><td>Hepatitis A #1, #2 (6 months apart)</td></tr>
                        <tr><td>4–6 years</td><td>DTaP #5, IPV #4, MMR #2, Varicella #2</td></tr>
                        <tr><td>11–12 years</td><td>Tdap, Meningococcal (MenACWY), HPV</td></tr>
                    </tbody>
                </table>

                <h3>Vaccine Types</h3>
                <table>
                    <thead><tr><th></th><th>Live attenuated</th><th>Inactivated/killed</th></tr></thead>
                    <tbody>
                        <tr><td>Examples</td><td>LAIV, MMR, Varicella, Rotavirus</td><td>IPV, DTaP, Hib, PCV, Hep B/A</td></tr>
                        <tr><td>Immunocompromised</td><td>Contraindicated</td><td>Safe</td></tr>
                        <tr><td>Pregnancy</td><td>Contraindicated</td><td>Generally safe</td></tr>
                        <tr><td>Boosters</td><td>Usually longer immunity</td><td>May need boosters</td></tr>
                    </tbody>
                </table>
                <div class="sum-callout">
                    <b>TRUE contraindications</b>: anaphylaxis to component/prior dose · live vaccines in severe immunocompromise or pregnancy · DTaP if encephalopathy within 7 days of prior dose.<br>
                    <b>NOT contraindications</b>: mild illness/low-grade fever, current antibiotics, prematurity, nonspecific allergies, penicillin allergy, stable neurologic conditions (CP, controlled seizures).
                </div>
            
                <section class="topic deck-enrich">
                    <h3>Study-deck deep dive</h3>
                    <p class="deck-intro">Every comparison table, animated algorithm and clinical pearl from the high-yield SMLE deck for this topic.</p>
<h4 class="deck-topic">Down syndrome</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>CNS: Hypotonia, Developmental delay, seizure, intellectual disability</li><li>CVS: Atrioventricular septal defect (MC), VSD, ASD</li><li>Endocrine: Congenital Hypothyroidism</li><li>GI: Duodenal atresia</li><li>CNS: Hypotonia, Developmental delay, seizure, intellectual disability</li><li>CVS: Atrioventricular septal defect (MC), VSD, ASD</li><li>Endocrine: Congenital Hypothyroidism</li><li>GI: Duodenal atresia</li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>Trisomy 21 1% + age related risk of the mother at time of next pregancy</li><li>Translocation karyotyping to both parents to calculate the recurrence risk</li><li>Mosaicism Usually not inherited</li><li>Trisomy 21 1% + age related risk of the mother at time of next pregancy</li><li>Translocation karyotyping to both parents to calculate the recurrence risk</li><li>Mosaicism Usually not inherited</li></ul></div></div><h4 class="deck-topic">Vaccination Types</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>All viral vaccines are live attenuated except: HepB, HepA, IPV, Inactivated influenza</li><li>All bacterial vaccines are killed except: BCG &amp; typhoid</li><li>Toxoid: Diphtheria, Tetanus</li></ul></div></div>
                </section>
            `,
            questions: [
                {
                    q: 'A 6-month-old with active seizures on anti-epileptics, dysmorphic features, hypotonia. How should the immunization schedule be modified?',
                    options: ['Give IPV instead of OPV', 'Defer the DTP vaccine (unstable neurological disorder)', 'Defer all live vaccines', 'Defer all vaccines'],
                    answer: 1,
                    explanation: 'Unstable/progressive neurologic disease is a precaution for DTaP/DTP. Stable neurologic conditions (cerebral palsy, controlled seizures) are NOT contraindications.'
                }
            ]
        },
        {
            id: 'peds-infectious',
            title: '17 — Infectious Disease / Dermatology',
            title_en: 'Croup vs Epiglottitis · Exanthems · Meningitis · Skin',
            summaryHtml: `
                <h3>Respiratory Infections</h3>
                <table>
                    <thead><tr><th>Feature</th><th>Croup</th><th>Epiglottitis</th></tr></thead>
                    <tbody>
                        <tr><td>Age</td><td>6 mo–3 y</td><td>2–7 y</td></tr>
                        <tr><td>Onset</td><td>Gradual</td><td>Sudden, rapid</td></tr>
                        <tr><td>Cough</td><td>Barking (seal-like)</td><td>Usually absent</td></tr>
                        <tr><td>Drooling</td><td>Rare</td><td>Common (tripod position)</td></tr>
                        <tr><td>X-ray</td><td>Steeple sign</td><td>Thumbprint sign</td></tr>
                        <tr><td>Cause</td><td>Parainfluenza</td><td>H. influenzae type B</td></tr>
                        <tr><td>Management</td><td>Dexamethasone, neb epinephrine</td><td>Secure airway in OR, IV antibiotics</td></tr>
                    </tbody>
                </table>
                <ul>
                    <li><b>Bronchiolitis</b> (&lt;2 y, RSV): supportive (oxygen, hydration, hypertonic saline); no routine bronchodilators/steroids; palivizumab for high-risk preterm</li>
                    <li><b>Pertussis</b>: catarrhal → paroxysmal (whoop, post-tussive vomiting, apnea); azithromycin; prophylaxis for contacts</li>
                </ul>

                <h3>Childhood Exanthems</h3>
                <table>
                    <thead><tr><th>Disease</th><th>Key identifying feature</th></tr></thead>
                    <tbody>
                        <tr><td>Measles</td><td>Koplik spots, cough/coryza/conjunctivitis, cephalocaudal rash</td></tr>
                        <tr><td>Rubella</td><td>Post-auricular lymphadenopathy, mild illness</td></tr>
                        <tr><td>Varicella</td><td>Crops in different stages, "dewdrop on rose petal"</td></tr>
                        <tr><td>Roseola (HHV-6)</td><td>High fever 3–5 d, rash appears as fever resolves; febrile seizures</td></tr>
                        <tr><td>Fifth disease (Parvo B19)</td><td>Slapped cheeks, lacy reticular rash; aplastic crisis in sickle cell</td></tr>
                        <tr><td>Hand-foot-mouth (Coxsackie)</td><td>Vesicles on palms, soles, oral mucosa</td></tr>
                        <tr><td>Scarlet fever (GAS)</td><td>Sandpaper rash, Pastia lines, strawberry tongue</td></tr>
                    </tbody>
                </table>

                <h3>Sepsis &amp; Meningitis</h3>
                <table>
                    <thead><tr><th>CSF</th><th>Bacterial</th><th>Viral</th><th>TB</th></tr></thead>
                    <tbody>
                        <tr><td>Appearance</td><td>Cloudy/purulent</td><td>Clear</td><td>Clear/fibrin web</td></tr>
                        <tr><td>WBC</td><td>&gt;1000 (PMNs)</td><td>&lt;500 (lymphocytes)</td><td>100–500 (lymphocytes)</td></tr>
                        <tr><td>Glucose</td><td>Low (&lt;40)</td><td>Normal</td><td>Low</td></tr>
                        <tr><td>Protein</td><td>High (&gt;100)</td><td>Normal/↑</td><td>High</td></tr>
                    </tbody>
                </table>
                <ul>
                    <li><b>Empiric by age</b>: 0–1 mo ampicillin + cefotaxime ± gentamicin (Listeria); 1–23 mo vancomycin + 3rd-gen cephalosporin; add <b>dexamethasone</b> before/with first antibiotic</li>
                    <li><b>Meningococcemia</b>: rapidly progressive sepsis, purpuric non-blanching rash, DIC, Waterhouse-Friderichsen → immediate ceftriaxone; chemoprophylaxis for close contacts</li>
                </ul>

                <h3>Skin &amp; Soft Tissue / Misc</h3>
                <ul>
                    <li><b>Impetigo</b>: honey-colored crusts (S. aureus/GAS) → topical mupirocin or oral antibiotics</li>
                    <li><b>Orbital cellulitis</b>: painful/restricted eye movement, proptosis, ↓vision (vs preseptal) — from ethmoid sinusitis → CT + IV antibiotics</li>
                    <li><b>Lyme</b>: erythema migrans (bull's-eye) → doxycycline (&gt;8 y) or amoxicillin</li>
                    <li><b>RMSF</b>: rash starts wrists/ankles → centripetal; <b>doxycycline at any age</b>, treat empirically</li>
                </ul>
            
                <section class="topic deck-enrich">
                    <h3>Study-deck deep dive</h3>
                    <p class="deck-intro">Every comparison table, animated algorithm and clinical pearl from the high-yield SMLE deck for this topic.</p>
<div class="deck-block deck-tbl"><div class="deck-cap"><span class="deck-tag tag-tbl">Table</span> Preseptal vs orbital cellulitis</div><table><thead><tr><th>Feature</th><th>Preseptal cellulitis</th><th>Orbital cellulitis</th></tr></thead><tbody><tr><td><b>History</b></td><td>Insect bite or trauma around the eye</td><td>URTI, toothache, earache, headache</td></tr><tr><td><b>Proptosis</b></td><td>Absent</td><td>Present</td></tr><tr><td><b>Eye movement</b></td><td>Normal</td><td>Painful, restricted</td></tr><tr><td><b>Visual acuity</b></td><td>Normal</td><td>Reduced in severe cases</td></tr><tr><td><b>Colour vision</b></td><td>Normal</td><td>Reduced in severe cases</td></tr><tr><td><b>Pupil (RAPD)</b></td><td>Normal</td><td>Present in severe cases</td></tr></tbody></table></div><h4 class="deck-topic">Croup</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Barking cough Low grade fever</li><li>Inspiratory stridor (due to subglottic narrowing)</li><li>URTI symptoms (Sneezing, rhinitis, sore throat) as it caused by Parainfluenza virus</li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>CXR showed steeple sign due to subglottic narrowing (next slide)</li><li>Dexamethasone is the primary management</li><li>Racemic epinephrine in severe croup (repeated after 30 minutes if no response)</li></ul></div></div><h4 class="deck-topic">Epiglottitis</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Respiratory distress Drooling of saliva</li><li>High grade fever &amp; toxic appearance patient</li><li>Tripod position</li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>Empirical antibiotics (3 rd generation cephalosporin) &amp; blood culture</li><li>Prepare for possible intubation</li><li>Supportive therapy (oxygenation, control of fever)</li></ul></div></div><h4 class="deck-topic">Bronchiolitis</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Symptoms of URTI (Rhinorrhea, cough, low grade fever) followed by LRTI (Crackles , wheeze) Most common cause is Respiratory syncytial virus (RSV)</li><li>Severe respiratory distress (Usually in &lt;2y old patient)</li><li>Signs of respiratory distress (Tachypnea, nasal flaring, prolonged expiration, cyanosis )</li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>Blood gases: hypoxemia &amp; hypercapnia</li><li>Treatment by respiratory support if indicated</li></ul></div></div><h4 class="deck-topic">Herpes simplex virus HSV-1</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Gingivostomatitis: painful ulceration on perioral skin &amp; oral mucosa Submandibular &amp; or cervical lymphadenopathy</li><li>Cluster of vesicles peri orally, tonsils, or on posterior pharynx.</li><li>Symptoms of viral infection (Nausea, fever, malaise)</li><li>Diagnosis &amp; management Clinically suspected &amp; confirmed by viral culture or PCR</li><li>Treatment: Acyclovir</li><li>1 st line : orally</li><li>Incase of dysphagia, odynophagia or Herpes encephalitis: IV acyclovir</li></ul></div></div><h4 class="deck-topic">Varicella</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Stages of skin lesion: Papule → vesicles → pustule → scabs fall &amp; dried (non-contagious at this stage) After resolution of symptoms → inactivated at the dorsal root ganglia → Shingles (if reactivated)</li><li>Starts centrally (face, trunk) then spread peripherally</li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>prophylaxis based on immune status of the patient</li><li>Immunocompetent: Vaccinated → observation, non vaccinated or unknown status → Vaccination</li><li>Immunocompromised: symptomatic → IV acyclovir, Asymptomatic → IVIG</li></ul></div></div><h4 class="deck-topic">Measles &amp; rubella</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>3Cs: Coryza, cough, conjunctivitis Fever</li><li>Koplik spots (Shown in the picture)</li><li>Generalized lymphadenopathy Erythematous Maculopapular rash on the face &amp; upper body</li><li>Prodromal phase: post-auricular, suboccipital lymphadenopathy</li><li>Exanthem phase: Maculopapular rash starts behind ear then to peripheries, sparing palms&amp; soles</li><li>Forcheimer spot on the soft palate (See next slide)</li><li>Coryza, cough, conjunctivitis Fever</li><li>Koplik spots (Shown in the picture)</li><li>Generalized lymphadenopathy Erythematous Maculopapular rash on the face &amp; upper body</li><li>Prodromal phase: post-auricular, suboccipital lymphadenopathy</li><li>Exanthem phase: Maculopapular rash starts behind ear then to peripheries, sparing palms&amp; soles</li><li>Forcheimer spot on the soft palate (See next slide)</li></ul></div></div><h4 class="deck-topic">Eczema</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Intense pruritus &amp; dry skin Infantile Eczema &lt;6Months: Face, head and scalp</li><li>6months - 2 years: extensor surfaces, face</li><li>2-12 years: flexural creases (popliteal &amp; antecubital fossa)</li><li>&gt;12 years: flexural surfaces, perioral region</li></ul></div><div class="deck-card mgmt"><span class="deck-card-h">Management</span><ul><li>Cornerstone of treatment is topical corticosteroids moisturizers Non-soap cleaners</li></ul></div></div><h4 class="deck-topic">Viral gastroenteritis</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Fever Vomiting</li><li>Profuse watery diarrhea</li><li>Signs of dehydration</li><li>PCR</li><li>Supportive management</li></ul></div></div><h4 class="deck-topic">Helicobacter Pylori</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Abdominal distension, flatulence Nausea</li><li>Weight loss, loss of appetite</li><li>Heartburn</li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>Triple therapy: PPI + Amoxicillin (Or metronidazole) + clarithromycin</li><li>Quadruple therapy: PPI + Bismuth salicylate + Metronidazole + Tetracycline</li></ul></div></div><h4 class="deck-topic">Giardia lamblia</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Prolonged diarrhea Abdominal cramps / bloating</li><li>malabsorption</li><li>Pale/greasy stool (steatorrhea)</li><li>PCR</li><li>Antigen detection on stool (ELISA)</li><li>Metronidazole/tinidazole is the best management</li></ul></div></div><h4 class="deck-topic">Meningitis</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Headache Neck stiffness</li><li>Kernig's and Brudzinski sign</li><li>Nausea &amp; vomiting</li><li>Headache Neck stiffness</li><li>Kernig's and Brudzinski sign</li><li>Nausea &amp; vomiting</li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>CXR showed steeple sign due to subglottic narrowing (next slide)</li><li>Dexamethasone is the primary management</li><li>Racemic epinephrine in severe croup (repeated after 30 minutes if no response)</li></ul></div><div class="deck-card mgmt"><span class="deck-card-h">Management</span><ul><li>Prophylaxis Treated by empirical antibiotic: Ceftriaxone, Vancomycin, dexamethasone ( Avoid hearing loss)</li><li>Prophylaxis: 2doses of rifampicin to close contacts</li></ul></div></div><h4 class="deck-topic">Septic arthritis</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Fever Acute mono-articular joint pain (Hip) or refusal to move</li><li>Decrease range of motion</li><li>Tenderness, warmth</li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>Arthrocentesis</li><li>Blood culture (Staph aureus is the most common organism)</li><li>Treatment: Empirical antibiotic (Vancomycin)</li></ul></div></div><h4 class="deck-topic">Otitis media</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Ear pain / otalgia Hearing loss</li><li>Fever</li><li>Otorrhea, bulging or perforated tympanic membrane</li><li>Children &lt;2 years → Give antibiotic</li><li>Children &gt;2 years → give antibiotic incase of severe infection</li><li>Oral amoxicillin is the antibiotic of choice</li><li>Ear pain / otalgia Hearing loss</li><li>Fever</li><li>Otorrhea, bulging or perforated tympanic membrane</li><li>Children &lt;2 years → Give antibiotic</li><li>Children &gt;2 years → give antibiotic incase of severe infection</li><li>Oral amoxicillin is the antibiotic of choice</li></ul></div></div><h4 class="deck-topic">Pertussis</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Symptoms or URTI Paroxysmal high pitched whooping cough</li><li>may followed by cyanosis or postussive vomiting (puts patient at risk of aspiration pneumonia)</li><li>Diagnosis &amp; management Nasopharyngeal PCR , Bacterial culture (Gold standard)</li><li>Treatment &amp; chemoprophylaxis to close contact: Macrolides</li></ul></div></div>
                </section>
            `,
            questions: [
                {
                    q: 'A 3-year-old has an abrupt high fever, drooling, and is sitting forward in a tripod position with muffled voice and no cough. Which action is most appropriate?',
                    options: ['Keep the child calm and secure the airway in a controlled setting (OR) before any invasive procedure', 'Examine the throat immediately with a tongue depressor', 'Give nebulized epinephrine and discharge', 'Obtain a lateral neck X-ray before doing anything else'],
                    answer: 0,
                    explanation: 'Sudden fever, drooling and tripod positioning without a barking cough suggest epiglottitis (H. influenzae type B). Do NOT agitate the child or examine the throat — this can precipitate complete airway obstruction. Secure the airway in the OR, then give IV antibiotics.'
                },
                {
                    q: 'A previously well 5-year-old presents with fever, headache and a rapidly spreading non-blanching purpuric rash and is becoming hypotensive. What is the immediate priority?',
                    options: ['Immediate IV/IM ceftriaxone without delay', 'Wait for the lumbar puncture and culture results before antibiotics', 'Start oral amoxicillin and review in 24 hours', 'Give IVIG as first-line therapy'],
                    answer: 0,
                    explanation: 'A non-blanching purpuric rash with sepsis suggests meningococcemia. Antibiotics (ceftriaxone) must be given immediately — do not delay for LP. Watch for DIC and Waterhouse-Friderichsen syndrome, and give chemoprophylaxis to close contacts.'
                },
                {
                    q: 'A child develops a rash after several days of high fever; the rash appears just as the fever breaks. Which organism is responsible?',
                    options: ['Human herpesvirus 6 (roseola)', 'Measles virus', 'Parvovirus B19', 'Group A streptococcus'],
                    answer: 0,
                    explanation: 'Roseola infantum (HHV-6) causes 3–5 days of high fever followed by a rash that erupts as the fever resolves; it can trigger febrile seizures. Measles rash accompanies fever with Koplik spots; parvovirus B19 gives slapped-cheek rash; GAS causes scarlet fever.'
                }
            ]
        }
    ]
};

export default pediatrics;
