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
                <figure class="deck-fig"><div class="deck-fig-title"><span class="deck-tag tag-fig">Diagram</span> Acyanotic (left-to-right shunt) — VSD · ASD · PDA</div>
                <svg viewBox="0 0 700 160" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="VSD gives a harsh holosystolic murmur at the lower left sternal border; ASD gives a wide fixed split S2 at the upper left sternal border; PDA gives a continuous machinery murmur with wide pulse pressure.">
                <g font-family="system-ui,Arial">
                <rect x="16" y="24" width="216" height="112" rx="10" fill="#dbeafe" stroke="#3b82f6"/><text x="124" y="50" text-anchor="middle" font-size="14" font-weight="800" fill="#1d4ed8">VSD</text><text x="124" y="76" text-anchor="middle" font-size="11" fill="#334155">harsh holosystolic · LLSB</text><text x="124" y="98" text-anchor="middle" font-size="11" fill="#334155">loud P2 if large</text><text x="124" y="122" text-anchor="middle" font-size="10.5" fill="#1d4ed8" font-weight="700">commonest CHD overall</text>
                <rect x="242" y="24" width="216" height="112" rx="10" fill="#dbeafe" stroke="#3b82f6"/><text x="350" y="50" text-anchor="middle" font-size="14" font-weight="800" fill="#1d4ed8">ASD</text><text x="350" y="76" text-anchor="middle" font-size="11" fill="#334155">systolic ejection · LUSB</text><text x="350" y="98" text-anchor="middle" font-size="11" fill="#334155">wide FIXED split S2</text><text x="350" y="122" text-anchor="middle" font-size="10.5" fill="#1d4ed8" font-weight="700">the fixed split is the clue</text>
                <rect x="468" y="24" width="216" height="112" rx="10" fill="#dbeafe" stroke="#3b82f6"/><text x="576" y="50" text-anchor="middle" font-size="14" font-weight="800" fill="#1d4ed8">PDA</text><text x="576" y="76" text-anchor="middle" font-size="11" fill="#334155">continuous machinery · LUSB</text><text x="576" y="98" text-anchor="middle" font-size="11" fill="#334155">wide pulse pressure · bounding</text><text x="576" y="122" text-anchor="middle" font-size="10.5" fill="#1d4ed8" font-weight="700">indomethacin closes it</text>
                </g></svg>
                <figcaption>All are left-to-right (acyanotic). Hallmarks: <b>VSD</b> holosystolic · <b>ASD</b> wide fixed split S2 · <b>PDA</b> machinery murmur with bounding pulses.</figcaption></figure>
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
                <figure class="deck-fig"><div class="deck-fig-title"><span class="deck-tag tag-fig">Diagram</span> Cyanotic CHD — the 5 T's</div>
                <svg viewBox="0 0 700 150" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="The five T's of cyanotic congenital heart disease: 1 Truncus arteriosus, 2 Transposition of the great arteries, 3 Tricuspid atresia, 4 Tetralogy of Fallot, 5 Total anomalous pulmonary venous return.">
                <g font-family="system-ui,Arial">
                <rect x="14" y="24" width="128" height="102" rx="10" fill="#e0f2fe" stroke="#38bdf8"/><circle cx="78" cy="52" r="15" fill="#0ea5e9"/><text x="78" y="57" text-anchor="middle" font-size="15" font-weight="800" fill="#fff">1</text><text x="78" y="90" text-anchor="middle" font-size="11" font-weight="700" fill="#0369a1">Truncus</text><text x="78" y="108" text-anchor="middle" font-size="9.5" fill="#475569">one vessel</text>
                <rect x="150" y="24" width="128" height="102" rx="10" fill="#e0f2fe" stroke="#38bdf8"/><circle cx="214" cy="52" r="15" fill="#0ea5e9"/><text x="214" y="57" text-anchor="middle" font-size="15" font-weight="800" fill="#fff">2</text><text x="214" y="90" text-anchor="middle" font-size="11" font-weight="700" fill="#0369a1">Transposition</text><text x="214" y="108" text-anchor="middle" font-size="9.5" fill="#475569">2 swapped</text>
                <rect x="286" y="24" width="128" height="102" rx="10" fill="#e0f2fe" stroke="#38bdf8"/><circle cx="350" cy="52" r="15" fill="#0ea5e9"/><text x="350" y="57" text-anchor="middle" font-size="15" font-weight="800" fill="#fff">3</text><text x="350" y="90" text-anchor="middle" font-size="11" font-weight="700" fill="#0369a1">Tricuspid atresia</text><text x="350" y="108" text-anchor="middle" font-size="9.5" fill="#475569">tri = 3</text>
                <rect x="422" y="24" width="128" height="102" rx="10" fill="#e0f2fe" stroke="#38bdf8"/><circle cx="486" cy="52" r="15" fill="#0ea5e9"/><text x="486" y="57" text-anchor="middle" font-size="15" font-weight="800" fill="#fff">4</text><text x="486" y="90" text-anchor="middle" font-size="11" font-weight="700" fill="#0369a1">Tetralogy</text><text x="486" y="108" text-anchor="middle" font-size="9.5" fill="#475569">4 features</text>
                <rect x="558" y="24" width="128" height="102" rx="10" fill="#e0f2fe" stroke="#38bdf8"/><circle cx="622" cy="52" r="15" fill="#0ea5e9"/><text x="622" y="57" text-anchor="middle" font-size="15" font-weight="800" fill="#fff">5</text><text x="622" y="90" text-anchor="middle" font-size="11" font-weight="700" fill="#0369a1">TAPVR</text><text x="622" y="108" text-anchor="middle" font-size="9.5" fill="#475569">5 words</text>
                </g></svg>
                <figcaption>The <b>number</b> is the hook: <b>1</b> Truncus · <b>2</b> Transposition · <b>3</b> Tricuspid atresia · <b>4</b> Tetralogy of Fallot · <b>5</b> TAPVR. All cause cyanosis that does not correct with oxygen.</figcaption></figure>
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

                
                <div class="topic-deck">
<h4 class="deck-topic">Teratology of fallot</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Cyanosis worsens with crying or feeding</li><li>Tet spells: Hypoxic spells relieved by squatting</li><li>Poor feeding, failure to thrive</li><li>Murmur of VSD: loud pan-systolic murmur on left upper sternal border</li><li>Pulmonary stenosis</li><li>Right ventricular hypertrophy</li><li>Overriding aorta</li><li>VSD</li><li>Pulmonary stenosis</li><li>Right ventricular hypertrophy</li><li>Overriding aorta</li><li>VSD</li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>Echocardiography (TTE) Confirmatory test for anatomical defects</li><li>CXR: Boot shaped heart, Decrease Vascular marking</li><li>ECG: right axis deviation, RVH</li><li>Oxygenation, Squatting, Morphine, Beta blocker, IV fluid</li><li>Surgery at 3-6 months</li><li>Echocardiography (TTE) Confirmatory test</li><li>ECG: LVH or biventricular hypertrophy</li><li>Small, Asymptomatic VSD may close spontaneously Observation</li><li>Large VSD: Diuretics, VSD, Surgery if not improving after 6-12 months</li><li>Echocardiography (TTE) Confirmatory test</li><li>ECG: LVH or biventricular hypertrophy</li><li>Small, Asymptomatic VSD may close spontaneously Observation</li><li>Large VSD: Diuretics, VSD, Surgery if not improving after 6-12 months</li></ul></div></div>
<h4 class="deck-topic">Transposition of great arteries</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Postnatal cyanosis (first few days)</li><li>Tachypnea</li><li>Single loud S2</li><li>Diminished femoral pulses</li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>Echocardiography (TTE) Confirmatory test for anatomical defects</li><li>CXR: Egg shaped heart, Increase Vascular marking</li><li>Prostaglandin E1 to prevent closure of PDA</li><li>Surgical correction in first 2 weeks of life</li></ul></div></div>
<h4 class="deck-topic">Teratology of fallot</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Pulmonary stenosis</li><li>Right ventricular hypertrophy</li><li>Overriding aorta</li><li>VSD</li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>Echocardiography (TTE) Confirmatory test</li><li>ECG: LVH or biventricular hypertrophy</li><li>Small, Asymptomatic VSD may close spontaneously Observation</li><li>Large VSD: Diuretics, VSD, Surgery if not improving after 6-12 months</li></ul></div></div>
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

                
                <div class="topic-deck">
<h4 class="deck-topic">Coarctation of aorta</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Lower limb cyanosis</li><li>Weak femoral pulse</li><li>Blood pressure in upper extremities &gt; Lower extremities</li><li>Systolic ejection murmur at the left posterior hemithorax</li><li>First step Keep PDA open (PGE1)</li><li>Second step Management of HF (inotropic support, respiratory support)</li><li>Third step Surgical management</li></ul></div></div>
                </div>
<h3>Murmurs &amp; Rheumatic Fever</h3>
                <figure class="deck-fig"><div class="deck-fig-title"><span class="deck-tag tag-fig">Diagram</span> Acute rheumatic fever — JONES major criteria</div>
                <svg viewBox="0 0 700 205" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="JONES major criteria: J joints migratory polyarthritis, O carditis, N subcutaneous nodules, E erythema marginatum, S Sydenham chorea.">
                <g font-family="system-ui,Arial">
                <rect x="20" y="18" width="46" height="34" rx="8" fill="#ef4444"/><text x="43" y="42" text-anchor="middle" font-size="18" font-weight="800" fill="#fff">J</text><text x="78" y="40" font-size="12.5" fill="#334155"><tspan font-weight="700">Joints</tspan> — migratory polyarthritis (large joints)</text>
                <rect x="20" y="56" width="46" height="34" rx="8" fill="#f97316"/><text x="43" y="80" text-anchor="middle" font-size="18" font-weight="800" fill="#fff">O</text><text x="78" y="78" font-size="12.5" fill="#334155"><tspan font-weight="700">carditis</tspan> — pancarditis (the ♥, most serious)</text>
                <rect x="20" y="94" width="46" height="34" rx="8" fill="#22c55e"/><text x="43" y="118" text-anchor="middle" font-size="18" font-weight="800" fill="#fff">N</text><text x="78" y="116" font-size="12.5" fill="#334155"><tspan font-weight="700">Nodules</tspan> — subcutaneous, over extensors</text>
                <rect x="20" y="132" width="46" height="34" rx="8" fill="#3b82f6"/><text x="43" y="156" text-anchor="middle" font-size="18" font-weight="800" fill="#fff">E</text><text x="78" y="154" font-size="12.5" fill="#334155"><tspan font-weight="700">Erythema marginatum</tspan> — trunk rash</text>
                <rect x="20" y="170" width="46" height="30" rx="8" fill="#8b5cf6"/><text x="43" y="192" text-anchor="middle" font-size="18" font-weight="800" fill="#fff">S</text><text x="78" y="190" font-size="12.5" fill="#334155"><tspan font-weight="700">Sydenham chorea</tspan> — involuntary movements</text>
                </g></svg>
                <figcaption>Diagnosis = <b>2 major</b>, or <b>1 major + 2 minor</b>, PLUS evidence of preceding group-A strep. Treat with penicillin + long-term prophylaxis.</figcaption></figure>
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
            
                
                <div class="topic-deck">
<h4 class="deck-topic">Rheumatic fever</h4><div class="deck-cards"><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>Echocardiography to assess carditis</li><li>Eradication of GAS Penicillin</li><li>Anti-inflammatory therapy Aspirin or Glucocorticoids (incase of severe carditis)</li><li>Management of HF Diuretics</li></ul></div><div class="deck-card mgmt"><span class="deck-card-h">Management</span><ul><li>Rheumatic fever without carditis 5 years or until 21 Y.O (Which is longer)</li><li>Rheumatic fever with carditis 10 years or until 21 Y.O (Which is longer)</li><li>Rheumatic fever with carditis and residual heart disease 10 years or until 40 Y.O (Which is longer)</li></ul></div></div>
                </div>
<section class="topic deck-enrich">
                    <h3>More from the study deck</h3>
                    <p class="deck-intro">Extra material for this step that spans more than one topic above.</p>
<div class="deck-block deck-tbl"><div class="deck-cap"><span class="deck-tag tag-tbl">Table</span> Congenital heart disease — acyanotic vs cyanotic</div><table><thead><tr><th>Acyanotic (L→R shunt)</th><th>Cyanotic (R→L shunt)</th></tr></thead><tbody><tr><td>Ventricular septal defect (VSD)</td><td>Tetralogy of Fallot</td></tr><tr><td>Atrial septal defect (ASD)</td><td>Transposition of the great arteries</td></tr><tr><td>Patent ductus arteriosus (PDA)</td><td>Tricuspid atresia</td></tr><tr><td>Coarctation of the aorta</td><td>Truncus arteriosus</td></tr><tr><td>Aortic valve stenosis</td><td></td></tr></tbody></table></div>
<div class="deck-block deck-tbl"><div class="deck-cap"><span class="deck-tag tag-tbl">Table</span> Innocent murmur — the 8 S's</div><p class="deck-subcap">features suggesting a benign (innocent) murmur</p><table><thead><tr><th>The 8 S's</th><th>Meaning</th></tr></thead><tbody><tr><td><b>Soft</b></td><td>Soft intensity</td></tr><tr><td><b>Systolic</b></td><td>Systolic (never purely diastolic)</td></tr><tr><td><b>Short</b></td><td>Short duration</td></tr><tr><td><b>Sounds normal</b></td><td>S1 &amp; S2 normal</td></tr><tr><td><b>Symptomless</b></td><td>No cardiac symptoms</td></tr><tr><td><b>Special tests normal</b></td><td>Normal chest X-ray &amp; ECG</td></tr><tr><td><b>Standing / Sitting</b></td><td>Varies with position</td></tr><tr><td><b>Sternal depression</b></td><td>No thrill / left sternal border location</td></tr></tbody></table></div>
<h4 class="deck-topic">Ventricular septal defect</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Asymptomatic if small</li><li>Large VSD: tachypnea, poor feeding, failure to thrive, frequent infections</li><li>Harsh systolic murmur at left lower sternal border</li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>Echocardiography (TTE) Confirmatory test</li><li>ECG: LVH or biventricular hypertrophy</li><li>Small, Asymptomatic VSD may close spontaneously Observation</li><li>Large VSD: Diuretics, VSD, Surgery if not improving after 6-12 months</li></ul></div></div>
<h4 class="deck-topic">Atrial septal defect</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Asymptomatic if small</li><li>Recurrent respiratory infections</li><li>Wide, fixed split S2, systolic murmur at left upper sternal border</li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>Echocardiography (TTE) Confirmatory test</li><li>ECG: Right axis deviation/RBBB</li><li>Observation if small</li><li>Secondum AST Transcatheter closure.</li><li>Other types Surgery at 4-5 Years</li></ul></div></div>
                </section>
            `,
            questions: [
                {
                    q: 'A neonate has weak, delayed femoral pulses and an upper-limb blood pressure more than 20 mmHg higher than the lower limbs. Which syndrome is classically associated?',
                    options: ['Turner syndrome', 'Down syndrome', 'Marfan syndrome', 'Williams syndrome'],
                    answer: 0,
                    explanation: 'Coarctation of the aorta causes lower-limb cyanosis, weak or delayed femoral pulses and an upper-limb blood pressure more than 20 mmHg above the lower limbs; it is classically associated with Turner syndrome. In a critical neonatal coarctation the first step is prostaglandin E1 to keep the duct open.'
                },
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
                },
                {
                    q: 'A 3-year-old with tetralogy of Fallot suddenly becomes deeply cyanotic and irritable while crying. What is the immediate first maneuver?',
                    options: ['Place in the knee-chest (squatting) position', 'Give IV furosemide', 'Start chest compressions', 'Administer sublingual nitroglycerin'],
                    answer: 0,
                    explanation: 'A hypercyanotic "tet spell" is first relieved by the knee-chest / squatting position, which raises systemic vascular resistance and reduces the right-to-left shunt. Then add oxygen, morphine, IV fluids and a beta-blocker.'
                },
                {
                    q: 'A 6-year-old is asymptomatic but has a systolic ejection murmur at the upper left sternal border with a wide, fixed split S2. Most likely diagnosis?',
                    options: ['Ventricular septal defect', 'Atrial septal defect', 'Patent ductus arteriosus', 'Tetralogy of Fallot'],
                    answer: 1,
                    explanation: 'A wide, FIXED split S2 is the hallmark of an ASD (it does not vary with respiration). A VSD gives a harsh holosystolic murmur; a PDA gives a continuous machinery murmur.'
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
                <figure class="deck-fig"><div class="deck-fig-title"><span class="deck-tag tag-fig">Diagram</span> Dehydration severity — clinical signs</div>
                <svg viewBox="0 0 700 210" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Mild dehydration 3 to 5 percent with slightly dry mucosa and normal turgor; moderate 6 to 9 percent with sunken eyes and reduced turgor; severe 10 percent or more with shock requiring an IV bolus.">
                <g font-family="system-ui,Arial" font-size="11">
                <rect x="16" y="20" width="216" height="176" rx="10" fill="#dcfce7" stroke="#22c55e"/><text x="124" y="44" text-anchor="middle" font-size="13" font-weight="700" fill="#15803d">Mild (3–5%)</text><text x="124" y="72" text-anchor="middle" fill="#334155">mucosa slightly dry</text><text x="124" y="96" text-anchor="middle" fill="#334155">cap refill &lt;2 s · normal turgor</text><text x="124" y="120" text-anchor="middle" fill="#334155">urine slightly ↓</text><text x="124" y="170" text-anchor="middle" fill="#15803d" font-weight="700">alert · oral rehydration</text>
                <rect x="242" y="20" width="216" height="176" rx="10" fill="#fef3c7" stroke="#f59e0b"/><text x="350" y="44" text-anchor="middle" font-size="13" font-weight="700" fill="#b45309">Moderate (6–9%)</text><text x="350" y="72" text-anchor="middle" fill="#334155">dry mucosa · sunken eyes</text><text x="350" y="96" text-anchor="middle" fill="#334155">cap refill 2–3 s · ↓ turgor</text><text x="350" y="120" text-anchor="middle" fill="#334155">sunken fontanelle · oliguria</text><text x="350" y="170" text-anchor="middle" fill="#b45309" font-weight="700">irritable · ORS ± IV</text>
                <rect x="468" y="20" width="216" height="176" rx="10" fill="#fee2e2" stroke="#ef4444"/><text x="576" y="44" text-anchor="middle" font-size="13" font-weight="700" fill="#b91c1c">Severe (≥10%)</text><text x="576" y="72" text-anchor="middle" fill="#334155">parched · tachycardia</text><text x="576" y="96" text-anchor="middle" fill="#334155">cap refill &gt;3 s · skin tenting</text><text x="576" y="120" text-anchor="middle" fill="#334155">anuria · weak pulse · ↓ BP</text><text x="576" y="170" text-anchor="middle" fill="#b91c1c" font-weight="700">lethargic · IV bolus 20 mL/kg</text>
                </g></svg>
                <figcaption>Grade from <b>capillary refill</b>, skin turgor, mucous membranes, fontanelle and mental status. <b>Severe = shock</b> → immediate isotonic <b>bolus 20 mL/kg</b>.</figcaption></figure>
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

                
                <div class="topic-deck">
<h4 class="deck-topic">Management of dehydration</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Uses in mild to moderate dehydration</li><li>Dose: 50-100 mL/Kg over 4-6 Hours, 10mL/Kg per stool or vomit</li><li>Monitoring for improvement, if not improved start IVF</li><li>Deficit (ml) = Weight (Kg) * Dehydration % * 10</li></ul></div><div class="deck-card mgmt"><span class="deck-card-h">Management</span><ul><li>severe dehydration</li><li>Not tolerating orally</li><li>Unresponsive to ORS</li><li>Avoid anti-diarrheal &amp; anti-emetics unless there is confirmed bacterial infection</li><li>First 10 kg weight = 100ml/Kg/D</li><li>Second 10 kg weight = 50ml/Kg/D</li><li>For every Kg more than 20 Kg = 2ml/Kg/D</li></ul></div></div>
<h4 class="deck-topic">Management of dehydration</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Deficit (ml) = Weight (Kg) * Dehydration % * 10</li></ul></div><div class="deck-card mgmt"><span class="deck-card-h">Management</span><ul><li>First 10 kg weight = 100ml/Kg/D</li><li>Second 10 kg weight = 50ml/Kg/D</li><li>For every Kg more than 20 Kg = 2ml/Kg/D</li></ul></div></div>
                </div>
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
            
                
                <div class="topic-deck">
<div class="deck-block deck-tbl"><div class="deck-cap"><span class="deck-tag tag-tbl">Table</span> Paracetamol toxicity — clinical stages</div><table><thead><tr><th></th><th>Stage 1</th><th>Stage 2</th><th>Stage 3</th><th>Stage 4</th></tr></thead><tbody><tr><td><b>Timing</b></td><td>First 24 h</td><td>Days 2–3</td><td>Days 3–4</td><td>After day 5</td></tr><tr><td><b>Clinical</b></td><td>Anorexia, nausea, vomiting, malaise</td><td>Improvement in N/V; abdominal pain; hepatic tenderness</td><td>Recurrence of N/V; encephalopathy; anuria; jaundice</td><td>Recovery (7–8 d) OR deterioration to multi-organ failure &amp; death</td></tr><tr><td><b>Labs</b></td><td>—</td><td>↑ transaminases; ↑ bilirubin &amp; prolonged PT if severe</td><td>Hepatic failure, metabolic acidosis, coagulopathy, renal failure, pancreatitis</td><td>Improvement &amp; resolution OR continued deterioration</td></tr></tbody></table></div>
<figure class="deck-block algo-flow"><figcaption><span class="deck-tag tag-algo">Algorithm</span> Foreign body ingestion — paediatric approach</figcaption><p class="deck-subcap">high-risk FB: button battery, magnets, sharp, large (&gt;6 cm long / &gt;2.5 cm wide) or toxic object</p><div class="algo-row"><div class="algo-node start" style="animation-delay:0.00s">Suspected foreign body (FB) ingestion</div></div><div class="algo-arrow" style="animation-delay:0.05s"></div><div class="algo-row"><div class="algo-node dec" style="animation-delay:0.12s">High-risk FB, or child unwell / symptomatic (drooling, respiratory distress), GI abnormality, food bolus not passing, or unable to eat &amp; drink?</div></div><div class="algo-arrow" style="animation-delay:0.17s"></div><div class="algo-fork"><div class="algo-branch"><span class="algo-label" style="animation-delay:0.24s">No</span><div class="algo-node end" style="animation-delay:0.24s">Discharge with advice</div></div><div class="algo-branch"><span class="algo-label" style="animation-delay:0.34s">Yes to any</span><div class="algo-node proc" style="animation-delay:0.34s">X-ray neck, chest &amp; abdomen (if not radio-opaque → discuss ENT / surgery / GI)</div><div class="algo-arrow mini" style="animation-delay:0.48s"></div><div class="algo-node proc" style="animation-delay:0.44s">FB in oesophagus, or high-risk → urgent removal (ENT / surgery / GI)</div><div class="algo-arrow mini" style="animation-delay:0.58s"></div><div class="algo-node end" style="animation-delay:0.54s">FB in stomach or beyond &amp; child well → observe / discharge with advice</div></div></div></figure>
<figure class="deck-block algo-flow"><figcaption><span class="deck-tag tag-algo">Algorithm</span> Paracetamol (APAP) toxicity — management</figcaption><div class="algo-row"><div class="algo-node start" style="animation-delay:0.00s">Paracetamol (APAP) ingestion</div></div><div class="algo-arrow" style="animation-delay:0.05s"></div><div class="algo-fork"><div class="algo-branch"><span class="algo-label" style="animation-delay:0.12s">&lt;4 h</span><div class="algo-node proc" style="animation-delay:0.12s">GI decontamination</div><div class="algo-arrow mini" style="animation-delay:0.26s"></div><div class="algo-node proc" style="animation-delay:0.22s">Send 4-h APAP level → plot on Rumack-Matthew nomogram</div><div class="algo-arrow mini" style="animation-delay:0.36s"></div><div class="algo-node end" style="animation-delay:0.32s">Toxic → N-acetylcysteine (NAC); not toxic → symptomatic care</div></div><div class="algo-branch"><span class="algo-label" style="animation-delay:0.42s">4–24 h</span><div class="algo-node proc" style="animation-delay:0.42s">Send APAP level</div><div class="algo-arrow mini" style="animation-delay:0.56s"></div><div class="algo-node end" style="animation-delay:0.52s">Give 1st dose NAC if level not available by 8 h</div></div><div class="algo-branch"><span class="algo-label" style="animation-delay:0.62s">&gt;24 h / unknown</span><div class="algo-node proc" style="animation-delay:0.62s">GI decontamination; send APAP + LFTs (AST/ALT/PT); give 1st dose NAC</div><div class="algo-arrow mini" style="animation-delay:0.76s"></div><div class="algo-node proc" style="animation-delay:0.72s">APAP &gt;10 µg/mL or ↑ AST/ALT → continue NAC; else supportive</div><div class="algo-arrow mini" style="animation-delay:0.86s"></div><div class="algo-node end" style="animation-delay:0.82s">If pH&lt;7.3, PT&gt;100, Cr&gt;3.3 or AMS → refer to liver transplant unit</div></div></div></figure>
                </div>
<section class="topic deck-enrich">
                    <h3>More from the study deck</h3>
                    <p class="deck-intro">Extra material for this step that spans more than one topic above.</p>
<h4 class="deck-topic">DKA</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Signs of dehydration: Dry mucous membrane, tachycardia, hypotension, sunken eyes</li><li>Symptoms of diabetes: Polyuria, polydipsia, polyphagia, weight loss</li><li>Abdominal pain, vomiting</li><li>Lethargy, AMS, cerebral edema</li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>Ketosis in blood &amp; urine</li><li>Metabolic Acidosis PH &lt;7.3</li><li>Hyperglycemia &gt;200 mg/dl</li><li>HCO3 &lt;15 mmol/L</li></ul></div></div>
<h4 class="deck-topic">DKA</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Signs of dehydration: Dry mucous membrane, tachycardia, hypotension, sunken eyes</li><li>Symptoms of diabetes: Polyuria, polydipsia, polyphagia, weight loss</li><li>Abdominal pain, vomiting</li><li>Lethargy, AMS, cerebral edema</li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>Ketosis in blood &amp; urine</li><li>Metabolic Acidosis PH &lt;7.3</li><li>Hyperglycemia &gt;200 mg/dl</li><li>HCO3 &lt;15 mmol/L</li></ul></div><div class="deck-card mgmt"><span class="deck-card-h">Management</span><ul><li>Fluid Replacement: 0.9% Normal saline</li><li>Insulin therapy: 0.1 IU/Kg/Hr to lower glucose &amp; stop ketogenesis (Delay insulin if K+ &lt;3.3)</li><li>Electrolyte correction</li><li>Monitor for complications: Hypoglycemia, Electrolyte abnormality, Cerebral edema</li></ul></div></div>
                </section>
            `,
            questions: [
                {
                    q: 'A child is brought in 6 hours after a paracetamol overdose. Which statement about management is correct?',
                    options: ['N-acetylcysteine is most effective when given within 8 hours of ingestion', 'N-acetylcysteine is only useful once jaundice appears', 'Treatment should be withheld until stage III hepatotoxicity', 'Activated charcoal is the definitive antidote'],
                    answer: 0,
                    explanation: 'N-acetylcysteine is the antidote and is most effective within 8 hours of ingestion; the level is plotted on the Rumack-Matthew nomogram. Stage III (72–96 h) is peak hepatotoxicity with jaundice, coagulopathy and encephalopathy — far too late to wait for.'
                },
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
                },
                {
                    q: 'A child in DKA has a serum potassium of 3.0 mEq/L. What must be done before starting the insulin infusion?',
                    options: ['Start insulin immediately at 0.1 U/kg/hr', 'Give a sodium bicarbonate bolus first', 'Replace potassium and hold insulin until K+ ≥3.3', 'Give a dextrose bolus'],
                    answer: 2,
                    explanation: 'Insulin drives K+ into cells and can cause fatal hypokalemia. If K+ <3.3, hold insulin and replace potassium first, then start the infusion.'
                },
                {
                    q: 'Using the Holliday-Segar method, what is the daily maintenance fluid requirement for a 24-kg child?',
                    options: ['1000 mL/day', '1500 mL/day', '1580 mL/day', '2400 mL/day'],
                    answer: 2,
                    explanation: 'First 10 kg ×100 = 1000 mL; next 10 kg ×50 = 500 mL; remaining 4 kg ×20 = 80 mL → 1580 mL/day.'
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

                
                <div class="topic-deck">
<h4 class="deck-topic">Diabetes type 1</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>polyuria</li><li>polydipsia</li><li>Polyphagia, unexplained weight loss</li><li>DKA (First presentation)</li><li>Hyperglycemia crisis (DKA), Hypoglycemia (Adverse effect of insulin)</li><li>Macrovascular complications (CAD, CVA, Peripheral artery disease)</li><li>Microvascular complications (Retinopathy, neuropathy, nephropathy)</li><li>Associations: (Celiac disease, hypothyroidism, vitiligo)</li><li>Microvascular complications screening 3-5 years after diagnosis then yearly</li><li>Abdominal pain, Vomiting</li><li>polydipsia</li><li>Fruity odor on the breath, kussmaul breath</li><li>Symptoms of Diabetes (polyuria, polydipsia, polyphagia, weight loss)</li></ul></div><div class="deck-card mgmt"><span class="deck-card-h">Management</span><ul><li>Lifestyle modification</li><li>Insulin</li><li>Screening for complications</li><li>Monitoring for glycemic control</li></ul></div></div>
<h4 class="deck-topic">Diabetes type 1</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>polyuria</li><li>polydipsia</li><li>Polyphagia, unexplained weight loss</li><li>DKA (First presentation)</li></ul></div><div class="deck-card mgmt"><span class="deck-card-h">Management</span><ul><li>Lifestyle modification</li><li>Insulin</li><li>Screening for complications</li><li>Monitoring for glycemic control</li></ul></div></div>
<h4 class="deck-topic">Diabetes insipidus</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Polyuria</li><li>polydipsia</li><li>nocturia</li><li>Possible dehydrations symptoms</li><li>Hyperglycemia crisis (DKA), Hypoglycemia (Adverse effect of insulin)</li><li>Macrovascular complications (CAD, CVA, Peripheral artery disease)</li><li>Microvascular complications (Retinopathy, neuropathy, nephropathy)</li><li>Associations: (Celiac disease, hypothyroidism, vitiligo)</li><li>Microvascular complications screening 3-5 years after diagnosis then yearly</li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>Low urine osmolarity despite high serum osmolarity</li><li>Water deprivation test</li><li>Desmopressin replacement test improves in central DI</li><li>Central DI Desmopressin</li><li>Nephrogenic DI Thiazide, low salt diet</li><li>Abdominal pain, Vomiting</li><li>polydipsia</li><li>Fruity odor on the breath, kussmaul breath</li><li>Symptoms of Diabetes (polyuria, polydipsia, polyphagia, weight loss)</li></ul></div></div>
<h4 class="deck-topic">Diabetes type 1</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Hyperglycemia crisis (DKA), Hypoglycemia (Adverse effect of insulin)</li><li>Macrovascular complications (CAD, CVA, Peripheral artery disease)</li><li>Microvascular complications (Retinopathy, neuropathy, nephropathy)</li><li>Associations: (Celiac disease, hypothyroidism, vitiligo)</li><li>Microvascular complications screening 3-5 years after diagnosis then yearly</li><li>Abdominal pain, Vomiting</li><li>polydipsia</li><li>Fruity odor on the breath, kussmaul breath</li><li>Symptoms of Diabetes (polyuria, polydipsia, polyphagia, weight loss)</li></ul></div></div>
                </div>
<h3>Thyroid Disorders</h3>
                <figure class="deck-fig"><div class="deck-fig-title"><span class="deck-tag tag-fig">Diagram</span> Reading TSH and free T4 together</div>
                <svg viewBox="0 0 700 190" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Primary hypothyroidism: high TSH with low free T4. Primary hyperthyroidism: low TSH with high free T4. Central hypothyroidism: low or normal TSH with low free T4. Subclinical hypothyroidism: high TSH with a normal free T4.">
                <g font-family="system-ui,Arial">
                <rect x="16" y="24" width="162" height="150" rx="10" fill="#f8fafc" stroke="#cbd5e1"/><text x="97" y="46" text-anchor="middle" font-size="11.5" font-weight="800" fill="#0f172a">Primary hypothyroid</text><rect x="28" y="58" width="138" height="30" rx="7" fill="#fee2e2" stroke="#ef4444"/><text x="97" y="78" text-anchor="middle" font-size="12" font-weight="700" fill="#b91c1c">TSH ↑ high</text><rect x="28" y="94" width="138" height="30" rx="7" fill="#dbeafe" stroke="#3b82f6"/><text x="97" y="114" text-anchor="middle" font-size="12" font-weight="700" fill="#1d4ed8">free T4 ↓ low</text><text x="97" y="148" text-anchor="middle" font-size="10" fill="#475569">Hashimoto · congenital</text>
                <rect x="182" y="24" width="162" height="150" rx="10" fill="#f8fafc" stroke="#cbd5e1"/><text x="263" y="46" text-anchor="middle" font-size="11.5" font-weight="800" fill="#0f172a">Primary hyperthyroid</text><rect x="194" y="58" width="138" height="30" rx="7" fill="#dbeafe" stroke="#3b82f6"/><text x="263" y="78" text-anchor="middle" font-size="12" font-weight="700" fill="#1d4ed8">TSH ↓ low</text><rect x="194" y="94" width="138" height="30" rx="7" fill="#fee2e2" stroke="#ef4444"/><text x="263" y="114" text-anchor="middle" font-size="12" font-weight="700" fill="#b91c1c">free T4 ↑ high</text><text x="263" y="148" text-anchor="middle" font-size="10" fill="#475569">Graves · ↑TSI</text>
                <rect x="348" y="24" width="162" height="150" rx="10" fill="#f8fafc" stroke="#cbd5e1"/><text x="429" y="46" text-anchor="middle" font-size="11.5" font-weight="800" fill="#0f172a">Central hypothyroid</text><rect x="360" y="58" width="138" height="30" rx="7" fill="#e2e8f0" stroke="#94a3b8"/><text x="429" y="78" text-anchor="middle" font-size="12" font-weight="700" fill="#475569">TSH low / normal</text><rect x="360" y="94" width="138" height="30" rx="7" fill="#dbeafe" stroke="#3b82f6"/><text x="429" y="114" text-anchor="middle" font-size="12" font-weight="700" fill="#1d4ed8">free T4 ↓ low</text><text x="429" y="148" text-anchor="middle" font-size="10" fill="#475569">TSH fails to rise</text>
                <rect x="514" y="24" width="162" height="150" rx="10" fill="#f8fafc" stroke="#cbd5e1"/><text x="595" y="46" text-anchor="middle" font-size="11.5" font-weight="800" fill="#0f172a">Subclinical hypothyroid</text><rect x="526" y="58" width="138" height="30" rx="7" fill="#fee2e2" stroke="#ef4444"/><text x="595" y="78" text-anchor="middle" font-size="12" font-weight="700" fill="#b91c1c">TSH ↑ high</text><rect x="526" y="94" width="138" height="30" rx="7" fill="#e2e8f0" stroke="#94a3b8"/><text x="595" y="114" text-anchor="middle" font-size="12" font-weight="700" fill="#475569">free T4 normal</text><text x="595" y="148" text-anchor="middle" font-size="10" fill="#475569">T4 still normal</text>
                </g></svg>
                <figcaption>TSH alone is not enough. A <b>low/normal TSH with a low free T4</b> is the trap — that is <b>central</b> hypothyroidism, not a normal result.</figcaption></figure>
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

                
                <div class="topic-deck">
<h4 class="deck-topic">Congenital adrenal hyperplasia</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Simple virilizing Ambiguous genitalia in girls, early puberty in boys</li><li>Late onset menarche, hirsutism</li><li>Salt wasting Vomiting, dehydration, hyponatremia, hyperkalemia, shock, hypoglycemia</li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>Elevated 17 hydroxy-progestrone</li><li>21-alpha hydroxylase deficiency</li><li>Electrolyte abnormalities ( hyperkalemia, hyponatremia)</li><li>ACTH stimulation test</li><li>Treatment: Hydrocortisone, fluid &amp; electrolyte correction</li></ul></div></div>
                </div>
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
                    <h3>More from the study deck</h3>
                    <p class="deck-intro">Extra material for this step that spans more than one topic above.</p>
<figure class="deck-block algo-flow"><figcaption><span class="deck-tag tag-algo">Algorithm</span> Cushing's syndrome — diagnostic approach</figcaption><div class="algo-row"><div class="algo-node start" style="animation-delay:0.00s">Clinical suspicion of Cushing's syndrome</div></div><div class="algo-arrow" style="animation-delay:0.05s"></div><div class="algo-row"><div class="algo-node proc" style="animation-delay:0.12s">Screen: 24-h urinary free cortisol (×3), low-dose dexamethasone suppression test, midnight cortisol</div></div><div class="algo-arrow" style="animation-delay:0.17s"></div><div class="algo-row"><div class="algo-node proc" style="animation-delay:0.24s">Confirmed Cushing's → measure ACTH</div></div><div class="algo-arrow" style="animation-delay:0.29s"></div><div class="algo-fork"><div class="algo-branch"><span class="algo-label" style="animation-delay:0.36s">ACTH &lt;10 (independent)</span><div class="algo-node proc" style="animation-delay:0.36s">CT/MRI adrenals</div><div class="algo-arrow mini" style="animation-delay:0.50s"></div><div class="algo-node end" style="animation-delay:0.46s">Adrenal adenoma / carcinoma or nodular hyperplasia</div></div><div class="algo-branch"><span class="algo-label" style="animation-delay:0.56s">ACTH &gt;20 (dependent)</span><div class="algo-node proc" style="animation-delay:0.56s">High-dose dexamethasone suppression + CRH test</div><div class="algo-arrow mini" style="animation-delay:0.70s"></div><div class="algo-node proc" style="animation-delay:0.66s">Suppresses → MRI pituitary → Cushing's disease</div><div class="algo-arrow mini" style="animation-delay:0.80s"></div><div class="algo-node end" style="animation-delay:0.76s">No suppression → BIPSS; if negative → CT/MRI chest/abdo/pelvis → ectopic ACTH</div></div><div class="algo-branch"><span class="algo-label" style="animation-delay:0.86s">ACTH 10–20</span><div class="algo-node end" style="animation-delay:0.86s">Further testing (CRH test)</div></div></div></figure>
<h4 class="deck-topic">Diabetic ketoacidosis</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Hyperglycemia 200 mg/dl</li><li>Metabolic acidosis PH &lt;7.3, HCO3 &lt;15 mmol/l</li><li>Ketosis Positive ketones in urine or blood</li></ul></div><div class="deck-card mgmt"><span class="deck-card-h">Management</span><ul><li>Fluid resuscitation: 0.9% NS bolus 10-20ml/kg/Hr</li><li>Regular Insulin: 0.1U/kg/Hr (Do not start insulin until K &gt;3.3)</li><li>Glucose monitoring (When glucose 200 or less, add 5% dextrose)</li><li>Acidosis monitoring: (Do not stop insulin until acidosis resolves)</li></ul></div></div>
                </section>
            `,
            questions: [
                {
                    q: 'A newborn has prolonged jaundice, a large anterior fontanelle, macroglossia, an umbilical hernia and constipation. The newborn screen shows a high TSH with a low T4. What is the most important next step?',
                    options: ['Repeat the screening test at 6 months', 'Start methimazole', 'Start levothyroxine as soon as possible', 'Reassure the parents — this resolves spontaneously'],
                    answer: 2,
                    explanation: 'Congenital hypothyroidism is screened at 24–48 hours precisely so that levothyroxine can be started immediately — early treatment is critical for neurodevelopment.'
                },
                {
                    q: 'A conscious 8-year-old with type 1 diabetes has a capillary glucose of 55 mg/dL. According to the 15-15 rule, what should be done first?',
                    options: ['Give IM glucagon 1 mg', 'Give 15 g of fast-acting carbohydrate and recheck in 15 minutes', 'Start a D5 infusion', 'Give a D25 IV push'],
                    answer: 1,
                    explanation: 'A conscious child gets 15 g of fast-acting carbohydrate (glucose tablets or juice), rechecked after 15 minutes and repeated if still below 70. Glucagon IM/SC and IV dextrose are reserved for the unconscious child.'
                },
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

                
                <div class="topic-deck">
<h4 class="deck-topic">Gastro-esophageal reflux</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Movement of stomach content into esophagus due to transient lower esophageal sphincter relaxation</li><li>Spitting up or regurgitation shortly after feeding</li><li>Physiological reflux → Normal physical examination, Normal feeding and weight gain</li><li>GERD → Poor feeding, weight loss, Sandifer syndrome, torticollis</li><li>Pacifier at bed time</li><li>Movement of stomach content into esophagus due to transient lower esophageal sphincter relaxation</li><li>Spitting up or regurgitation shortly after feeding</li><li>Physiological reflux → Normal physical examination, Normal feeding and weight gain</li><li>GERD → Poor feeding, weight loss, Sandifer syndrome, torticollis</li><li>Pacifier at bed time</li></ul></div><div class="deck-card mgmt"><span class="deck-card-h">Management</span><ul><li>Physiological reflux → Reassurance &amp; reflux precautions</li></ul></div></div>
<h4 class="deck-topic">Pyloric stenosis</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>2-8 weeks non-bilious projectile vomiting, hungry after vomiting P/E: Hypertrophied-non tender pylorus (Described as olive-like mass)</li><li>Late stage: Dehydration, poor weight gain, failure to thrive</li><li>Diagnosis &amp; management Ultrasound abdomen (Diagnostic)</li><li>Abdominal X-ray → Single bubble sign (due to accumulation of air In stomach)</li><li>Labs: Hypochloremic, hypochalemic, metabolic alkalosis</li><li>Correct electrolyte &amp; fluid status → Pyloromyotomy</li></ul></div></div>
                </div>
<h3>Malrotation, Intussusception &amp; Hirschsprung</h3>
                <figure class="deck-fig"><div class="deck-fig-title"><span class="deck-tag tag-fig">Diagram</span> Infant vomiting — bilious or not?</div>
                <svg viewBox="0 0 700 250" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Bilious vomiting in a newborn means malrotation with volvulus until proven otherwise, needing an upper GI series and Ladd procedure. Non-bilious projectile vomiting at 2 to 8 weeks suggests pyloric stenosis, diagnosed by ultrasound and treated by pyloromyotomy.">
                <g font-family="system-ui,Arial">
                <rect x="256" y="14" width="188" height="34" rx="9" fill="#e0e7ff" stroke="#6366f1"/><text x="350" y="37" text-anchor="middle" font-size="12.5" font-weight="800" fill="#4338ca">Vomiting infant</text>
                <line x1="350" y1="48" x2="160" y2="76" stroke="#94a3b8" stroke-width="2"/><line x1="350" y1="48" x2="540" y2="76" stroke="#94a3b8" stroke-width="2"/>
                <rect x="16" y="76" width="292" height="150" rx="11" fill="#dcfce7" stroke="#22c55e"/><text x="162" y="102" text-anchor="middle" font-size="13.5" font-weight="800" fill="#15803d">GREEN / BILIOUS</text><text x="162" y="128" text-anchor="middle" font-size="12" font-weight="700" fill="#b91c1c">SURGICAL EMERGENCY</text><text x="162" y="152" text-anchor="middle" font-size="11.5" fill="#334155">Malrotation with volvulus</text><text x="162" y="176" text-anchor="middle" font-size="11.5" fill="#334155">UGI series → corkscrew duodenum</text><text x="162" y="204" text-anchor="middle" font-size="11.5" font-weight="700" fill="#15803d">Ladd procedure</text>
                <rect x="392" y="76" width="292" height="150" rx="11" fill="#dbeafe" stroke="#3b82f6"/><text x="538" y="102" text-anchor="middle" font-size="13.5" font-weight="800" fill="#1d4ed8">NON-bilious, projectile</text><text x="538" y="128" text-anchor="middle" font-size="12" fill="#334155">2–8 weeks · hungry after vomiting</text><text x="538" y="152" text-anchor="middle" font-size="11.5" font-weight="700" fill="#1d4ed8">hypochloraemic metabolic alkalosis</text><text x="538" y="176" text-anchor="middle" font-size="11.5" fill="#334155">US: muscle &gt;3–4 mm · RUQ "olive"</text><text x="538" y="204" text-anchor="middle" font-size="11.5" font-weight="700" fill="#1d4ed8">correct electrolytes → pyloromyotomy</text>
                </g></svg>
                <figcaption>The colour of the vomit is the triage step: <b>bilious in a newborn = volvulus until proven otherwise</b>. Non-bilious projectile vomiting at 2–8 weeks points to pyloric stenosis — always correct the alkalosis before theatre.</figcaption></figure>
                <ul>
                    <li><b>Malrotation/volvulus</b>: <b>bilious vomiting in newborn</b> (always investigate!); UGI series corkscrew duodenum → surgical emergency (Ladd procedure)</li>
                    <li><b>Intussusception</b>: 6 mo–3 y, colicky pain, <b>currant jelly stool</b>, sausage-shaped mass; US target sign → air/contrast enema (diagnostic + therapeutic); surgery if fails/perforation</li>
                    <li><b>Hirschsprung</b>: delayed meconium (&gt;48 h), constipation, distension; rectal suction biopsy shows absent ganglion cells → surgical pull-through</li>
                </ul>

                
                <div class="topic-deck">
<h4 class="deck-topic">Hirschsprung disease</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Delayed passage of meconium (24-48H)</li><li>Symptoms of distal intestinal obstruction: Abdominal distension, bilious vomiting</li><li>DRE: Tight anal sphincter, Empty rectum, Squire sign (Gush of stool after DRE)</li><li>Diagnosis &amp; management Abdominal X-ray (contrast enema) → Initial</li><li>Rectal biopsy → Confirmatory</li><li>Treatment: Surgical resection on non-ganglionic portion of colon</li><li>Delayed passage of meconium (24-48H)</li><li>Symptoms of distal intestinal obstruction: Abdominal distension, bilious vomiting</li><li>DRE: Tight anal sphincter, Empty rectum, Squire sign (Gush of stool after DRE)</li><li>Diagnosis &amp; management Abdominal X-ray (contrast enema) → Initial</li><li>Rectal biopsy → Confirmatory</li><li>Keep sleeping area separate to the parents but in the same room</li><li>Pacifier at bed time</li></ul></div></div>
                </div>
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
            
                
                <div class="topic-deck">
<div class="deck-block deck-tbl"><div class="deck-cap"><span class="deck-tag tag-tbl">Table</span> Ulcerative colitis vs Crohn's disease</div><table><thead><tr><th>Feature</th><th>Ulcerative colitis</th><th>Crohn's disease</th></tr></thead><tbody><tr><td><b>Age</b></td><td>Any</td><td>Any</td></tr><tr><td><b>Gender</b></td><td>M = F</td><td>Slight female preponderance</td></tr><tr><td><b>Incidence</b></td><td>Stable</td><td>Increasing</td></tr><tr><td><b>Ethnicity</b></td><td>Any</td><td>More common in Ashkenazi Jews</td></tr><tr><td><b>Genetics</b></td><td>HLA-DR*103; colonic barrier genes (HNF4a, LAMB1, CDH1)</td><td>Defective innate immunity &amp; autophagy (NOD2, ATG16L1, IRGM)</td></tr><tr><td><b>Risk factors</b></td><td>More common in non-/ex-smokers; appendicectomy protects</td><td>More common in smokers</td></tr><tr><td><b>Distribution</b></td><td>Colon only; from anorectal margin with proximal extension</td><td>Any part of GIT; perianal disease; patchy skip lesions</td></tr><tr><td><b>Extra-intestinal</b></td><td>Common</td><td>Common</td></tr><tr><td><b>Presentation</b></td><td>Bloody diarrhoea</td><td>Variable: pain, diarrhoea, weight loss</td></tr><tr><td><b>Histology</b></td><td>Mucosal inflammation; crypt distortion/abscesses; loss of goblet cells</td><td>Submucosal/transmural; deep fissuring ulcers, fistulae; patchy; granulomas</td></tr><tr><td><b>Management</b></td><td>5-ASA, steroids, azathioprine, biologics; colectomy is curative</td><td>Steroids, azathioprine, methotrexate, biologics, nutrition; surgery not curative; 5-ASA ineffective</td></tr></tbody></table></div>
<h4 class="deck-topic">Celiac disease</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Chronic diarrhea, Nausea/Vomiting Flatulence, abdominal distension</li><li>Malabsorption symptoms: steatorrhea, failure to thrive, weight loss, vitamin deficiency.</li><li>Dermatological association: Dermatitis Herpetiformis</li><li>Diagnosis &amp; management Initial test → Serology (IgA tissue transglutaminase - Anti-endomysial AB)</li><li>Confirmatory test → endoscopy with Duodenal Biopsy (Don’t stop gluten before EGD)</li><li>Treatment: Gluten free diet</li></ul></div></div>
                </div>
<section class="topic deck-enrich">
                    <h3>More from the study deck</h3>
                    <p class="deck-intro">Extra material for this step that spans more than one topic above.</p>
<h4 class="deck-topic">Intussusceptions</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Abdominal pain, associated with knees drawn toward chest Vomiting (could be bilious)</li><li>Red current jelly stool</li><li>Sausage shaped abdominal mass</li><li>Diagnosis &amp; management Ultrasound abdomen (Initial &amp; best diagnostic modality) → Target sign</li><li>Enemas → diagnostic &amp; therapeutic</li><li>Treatment: IVF resuscitation, correct electrolyte abnormalities, Enemas</li><li>Surgery: Signs of peritonitis, refractory to enemas</li></ul></div></div>
<h4 class="deck-topic">Acute Appendicitis</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Migrating abdominal pain (Peri-umbilical to RLQ) Nausea/Vomiting, Low grade fever</li><li>Rebound tenderness, Rovsing sign</li><li>Diagnosis &amp; management Non-pregnant adults → CT (Best) or US</li><li>Pregnant or children → US</li><li>Appendicitis complication (Abscess, phlegmon) → CT regardless age</li><li>Symptomatic management + Empirical antibiotics + Appendectomy</li></ul></div></div>
                </section>
            `,
            questions: [
                {
                    q: 'A 5-week-old has persistent jaundice with conjugated hyperbilirubinaemia, acholic stools and dark urine. HIDA shows no excretion. What is the key management point?',
                    options: ['Reassure — this is physiological jaundice', 'Start phototherapy', 'Perform the Kasai procedure before 60 days of age', 'Begin a gluten-free diet'],
                    answer: 2,
                    explanation: 'Jaundice persisting beyond 2 weeks with CONJUGATED hyperbilirubinaemia, acholic stools and non-excretion on HIDA indicates biliary atresia. The Kasai portoenterostomy must be done before 60 days of age; transplantation follows if it fails.'
                },
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
                },
                {
                    q: 'A 9-month-old has episodic colicky pain (drawing the legs up), passes "currant jelly" stool, and US shows a target sign. Best initial management?',
                    options: ['Air (or contrast) enema — diagnostic and therapeutic', 'Immediate laparotomy', 'IV antibiotics only', 'Oral rehydration then discharge'],
                    answer: 0,
                    explanation: 'Intussusception (6 mo–3 y): currant-jelly stool, sausage-shaped mass, US target sign. An air/contrast enema is both diagnostic and therapeutic; surgery only if it fails or there is perforation.'
                },
                {
                    q: 'A newborn develops bilious vomiting on day 2 of life. What is the priority concern?',
                    options: ['Physiologic reflux', 'Malrotation with midgut volvulus (surgical emergency)', 'Overfeeding', 'Pyloric stenosis'],
                    answer: 1,
                    explanation: 'Bilious vomiting in a newborn is malrotation with volvulus until proven otherwise (UGI series → corkscrew duodenum) — a surgical emergency (Ladd procedure). Pyloric stenosis causes NON-bilious vomiting.'
                }
            ]
        },
        {
            id: 'peds-general',
            title: '05 — General Pediatrics',
            title_en: 'SIDS · Animal & Human Bites · Envenomation',
            summaryHtml: `
                <h3>Sudden Infant Death Syndrome (SIDS)</h3>
                <figure class="deck-fig"><div class="deck-fig-title"><span class="deck-tag tag-fig">Diagram</span> SIDS — risk factors vs prevention</div>
                <svg viewBox="0 0 700 246" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="SIDS risk factors: prone or stomach sleeping, soft bedding, overheating, maternal smoking, prematurity or low birth weight, and co-sleeping. Prevention: back to sleep, firm mattress, separate sleep surface in the same room, pacifier at bedtime, avoid overheating, and smoking cessation. Peak incidence is 2 to 4 months.">
                <g font-family="system-ui,Arial">
                <rect x="16" y="18" width="330" height="176" rx="10" fill="#fef2f2" stroke="#ef4444"/><rect x="16" y="18" width="330" height="30" rx="10" fill="#ef4444"/><text x="181" y="39" text-anchor="middle" font-size="13" font-weight="800" fill="#fff">RISK — increases SIDS</text>
                <text x="36" y="72" font-size="11.5" fill="#7f1d1d">✕ prone / stomach sleeping</text><text x="36" y="94" font-size="11.5" fill="#7f1d1d">✕ soft bedding</text><text x="36" y="116" font-size="11.5" fill="#7f1d1d">✕ overheating</text><text x="36" y="138" font-size="11.5" fill="#7f1d1d">✕ maternal smoking</text><text x="36" y="160" font-size="11.5" fill="#7f1d1d">✕ prematurity / low birth weight</text><text x="36" y="182" font-size="11.5" fill="#7f1d1d">✕ co-sleeping</text>
                <rect x="354" y="18" width="330" height="176" rx="10" fill="#f0fdf4" stroke="#22c55e"/><rect x="354" y="18" width="330" height="30" rx="10" fill="#22c55e"/><text x="519" y="39" text-anchor="middle" font-size="13" font-weight="800" fill="#fff">PREVENTION — "Back to Sleep"</text>
                <text x="374" y="72" font-size="11.5" fill="#14532d">✓ place baby on the BACK</text><text x="374" y="94" font-size="11.5" fill="#14532d">✓ firm mattress</text><text x="374" y="116" font-size="11.5" fill="#14532d">✓ separate surface, same room</text><text x="374" y="138" font-size="11.5" fill="#14532d">✓ pacifier at bedtime</text><text x="374" y="160" font-size="11.5" fill="#14532d">✓ avoid overheating</text><text x="374" y="182" font-size="11.5" fill="#14532d">✓ smoking cessation</text>
                <rect x="16" y="204" width="668" height="30" rx="8" fill="#fffbeb" stroke="#f59e0b"/><text x="350" y="224" text-anchor="middle" font-size="12" font-weight="700" fill="#92400e">Peak incidence: 2–4 months of age</text>
                </g></svg>
                <figcaption>Every prevention point is the mirror image of a risk factor. The single highest-yield answer is <b>supine (back) sleeping on a firm, separate surface</b>.</figcaption></figure>
                <ul>
                    <li><b>Risk factors</b>: prone/stomach sleeping, soft bedding, overheating, maternal smoking, prematurity/LBW, co-sleeping; peak 2–4 months</li>
                    <li><b>Prevention ("Back to Sleep")</b>: place baby on <b>back</b>, firm mattress, separate sleep surface in same room, pacifier at bedtime, avoid overheating, smoking cessation</li>
                </ul>

                
                <div class="topic-deck">
<h4 class="deck-topic">Sudden infant death syndrome</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Sleeping on the stomach side</li><li>Soft bedding or overheating</li><li>Maternal smoke during pregnancy</li><li>Premature infant or low birth weight</li></ul></div><div class="deck-card mgmt"><span class="deck-card-h">Management</span><ul><li>Place baby on back to sleep (Best strategy)</li><li>Use a firm mattress</li><li>Keep sleeping area separate to the parents but in the same room</li><li>Pacifier at bed time</li></ul></div></div>
                </div>
<h3>Bites &amp; Envenomation</h3>
                <ul>
                    <li><b>Dog bites</b>: irrigation/debridement; primary closure only for facial wounds; <b>amoxicillin-clavulanate</b> prophylaxis; tetanus; rabies prophylaxis if stray/unknown</li>
                    <li><b>Rabies post-exposure</b>: unknown/unvaccinated/stray animal or bat exposure → rabies immunoglobulin (into wound) + vaccine (days 0, 3, 7, 14)</li>
                    <li><b>Snake bite</b>: immobilize limb below heart level; do <b>NOT</b> cut, suck venom, tourniquet or ice; antivenom if envenomation</li>
                    <li><b>Scorpion sting</b>: supportive/analgesia; antivenom for severe systemic symptoms</li>
                </ul>
            
                
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
                ,
                {
                    q: 'Which single intervention most reduces the risk of sudden infant death syndrome (SIDS)?',
                    options: ['Placing the infant supine (on the back) to sleep', 'Using soft bedding and pillows', 'Co-sleeping in the parents’ bed', 'Keeping the room warm with extra blankets'],
                    answer: 0,
                    explanation: 'The "Back to Sleep" campaign — supine sleeping on a firm mattress, on a separate sleep surface in the parents’ room, with a pacifier and no overheating or smoke exposure. Prone sleeping, soft bedding and co-sleeping are risk factors; the peak incidence is 2–4 months.'
                },
                {
                    q: 'A child is bitten by an unknown stray dog. Besides wound care and tetanus cover, what post-exposure prophylaxis is required?',
                    options: ['Rabies immunoglobulin into the wound plus vaccine on days 0, 3, 7 and 14', 'Rabies vaccine alone at a single visit', 'No prophylaxis unless the child develops fever', 'Antivenom'],
                    answer: 0,
                    explanation: 'Exposure to a stray/unknown or unvaccinated animal (or a bat) requires rabies immunoglobulin infiltrated into the wound PLUS vaccine on days 0, 3, 7 and 14. Amoxicillin-clavulanate is given for bacterial prophylaxis; primary closure is reserved for facial wounds.'
                },
                {
                    q: 'A child is bitten by a snake on the leg. Which action is correct?',
                    options: ['Immobilise the limb below heart level and transfer for antivenom if envenomated', 'Apply a tight tourniquet above the bite', 'Incise the wound and suck out the venom', 'Pack the limb in ice'],
                    answer: 0,
                    explanation: 'Immobilise the limb below heart level and transport. Do NOT cut, suck, apply a tourniquet or use ice — these worsen local injury without removing venom.'
                }
            ]
        },
        {
            id: 'peds-genetics',
            title: '06 — Genetics',
            title_en: 'Down Syndrome · Other Genetic Syndromes',
            summaryHtml: `
                <h3>Down Syndrome (Trisomy 21)</h3>
                <figure class="deck-fig"><div class="deck-fig-title"><span class="deck-tag tag-fig">Diagram</span> The three trisomies — 21 vs 18 vs 13</div>
                <svg viewBox="0 0 700 214" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Trisomy 21 Down syndrome: flat facial profile, upslanting palpebral fissures, single palmar crease, hypotonia, AV septal defect and duodenal atresia. Trisomy 18 Edwards syndrome: clenched fists with overlapping fingers, rocker-bottom feet, micrognathia and VSD. Trisomy 13 Patau syndrome: polydactyly, microphthalmia, holoprosencephaly and cutis aplasia.">
                <g font-family="system-ui,Arial">
                <rect x="16" y="18" width="218" height="178" rx="10" fill="#eff6ff" stroke="#3b82f6"/><circle cx="125" cy="48" r="19" fill="#3b82f6"/><text x="125" y="55" text-anchor="middle" font-size="15" font-weight="800" fill="#fff">21</text><text x="125" y="88" text-anchor="middle" font-size="13" font-weight="800" fill="#1d4ed8">Down</text><text x="34" y="112" font-size="10.5" fill="#334155">• flat facies, upslanting fissures</text><text x="34" y="132" font-size="10.5" fill="#334155">• single palmar crease, hypotonia</text><text x="34" y="152" font-size="10.5" fill="#334155">• AV septal defect (commonest)</text><text x="34" y="172" font-size="10.5" fill="#334155">• duodenal atresia — double bubble</text>
                <rect x="241" y="18" width="218" height="178" rx="10" fill="#f5f3ff" stroke="#8b5cf6"/><circle cx="350" cy="48" r="19" fill="#8b5cf6"/><text x="350" y="55" text-anchor="middle" font-size="15" font-weight="800" fill="#fff">18</text><text x="350" y="88" text-anchor="middle" font-size="13" font-weight="800" fill="#6d28d9">Edwards</text><text x="259" y="112" font-size="10.5" fill="#334155">• clenched fists,</text><text x="259" y="132" font-size="10.5" fill="#334155">&#160;&#160;overlapping fingers</text><text x="259" y="152" font-size="10.5" fill="#334155">• rocker-bottom feet, micrognathia</text><text x="259" y="172" font-size="10.5" fill="#334155">• VSD</text>
                <rect x="466" y="18" width="218" height="178" rx="10" fill="#fef2f2" stroke="#ef4444"/><circle cx="575" cy="48" r="19" fill="#ef4444"/><text x="575" y="55" text-anchor="middle" font-size="15" font-weight="800" fill="#fff">13</text><text x="575" y="88" text-anchor="middle" font-size="13" font-weight="800" fill="#b91c1c">Patau</text><text x="484" y="112" font-size="10.5" fill="#334155">• polydactyly</text><text x="484" y="132" font-size="10.5" fill="#334155">• microphthalmia</text><text x="484" y="152" font-size="10.5" fill="#334155">• holoprosencephaly</text><text x="484" y="172" font-size="10.5" fill="#334155">• cutis aplasia</text>
                </g></svg>
                <figcaption>Hands and feet separate 18 from 13: <b>clenched fists with overlapping fingers + rocker-bottom feet = Edwards (18)</b>; <b>polydactyly = Patau (13)</b>. Karyotype confirms all three.</figcaption></figure>
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

                
                <div class="topic-deck">
<h4 class="deck-topic">Down syndrome</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>CNS: Hypotonia, Developmental delay, seizure, intellectual disability</li><li>CVS: Atrioventricular septal defect (MC), VSD, ASD</li><li>Endocrine: Congenital Hypothyroidism</li><li>GI: Duodenal atresia</li><li>Sleeping on the stomach side</li><li>Soft bedding or overheating</li><li>Maternal smoke during pregnancy</li><li>Premature infant or low birth weight</li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>Trisomy 21 1% + age related risk of the mother at time of next pregancy</li><li>Translocation karyotyping to both parents to calculate the recurrence risk</li><li>Mosaicism Usually not inherited</li></ul></div><div class="deck-card mgmt"><span class="deck-card-h">Management</span><ul><li>Place baby on back to sleep (Best strategy)</li><li>Use a firm mattress</li><li>Keep sleeping area separate to the parents but in the same room</li><li>Pacifier at bed time</li></ul></div></div>
                </div>
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
            
                
            `,
            questions: [
                {
                    q: 'A newborn has a cardiac defect, abnormal facies, a cleft palate, hypocalcaemic seizures and thymic hypoplasia. Which microdeletion is responsible?',
                    options: ['22q11.2', '7q11.23', 'Paternal 15q', 'Maternal 15q'],
                    answer: 0,
                    explanation: 'This is DiGeorge syndrome, a 22q11.2 microdeletion — CATCH-22: Cardiac, Abnormal facies, Thymic hypoplasia, Cleft palate, Hypocalcaemia. 7q11.23 is Williams, a paternal 15q deletion is Prader-Willi and a maternal 15q deletion is Angelman.'
                },
                {
                    q: 'A child with elfin facies, supravalvular aortic stenosis, friendly personality, and hypercalcemia. Diagnosis?',
                    options: ['Noonan syndrome', 'Williams syndrome (microdeletion 7q11.23)', 'DiGeorge syndrome', 'Turner syndrome'],
                    answer: 1,
                    explanation: 'Williams = elfin facies, supravalvular AS, friendly personality, hypercalcemia, developmental delay. Caused by ELN gene deletion.'
                }
                ,
                {
                    q: 'A newborn with Down syndrome (trisomy 21) is being screened. Which cardiac lesion is the most common association?',
                    options: ['Atrioventricular septal defect', 'Tetralogy of Fallot', 'Coarctation of the aorta', 'Transposition of the great arteries'],
                    answer: 0,
                    explanation: 'AV septal (endocardial cushion) defect is the classic cardiac lesion of trisomy 21. Also screen for duodenal atresia (double bubble), hypothyroidism (annual TSH), leukemia and atlantoaxial instability (avoid neck hyperextension).'
                },
                {
                    q: 'A 15-year-old girl has short stature, a webbed neck, primary amenorrhea and a history of coarctation of the aorta. Expected karyotype?',
                    options: ['45,X (Turner syndrome)', '47,XXY (Klinefelter)', 'Trisomy 18 (Edwards)', '22q11.2 microdeletion (DiGeorge)'],
                    answer: 0,
                    explanation: 'Turner syndrome (monosomy X, 45,X): short stature, webbed neck, lymphedema, coarctation, streak ovaries and primary amenorrhea.'
                },
                {
                    q: 'An infant had marked hypotonia and failure to thrive in infancy, then developed hyperphagia and obesity in early childhood, with hypogonadism. Most likely diagnosis?',
                    options: ['Prader-Willi syndrome (paternal 15q deletion)', 'Angelman syndrome (maternal 15q deletion)', 'Williams syndrome', 'Noonan syndrome'],
                    answer: 0,
                    explanation: 'Prader-Willi (imprinting, paternal 15q deletion): infantile hypotonia/FTT → hyperphagia, obesity, hypogonadism. Angelman (maternal deletion) causes severe ID, absent speech, ataxia and paroxysmal laughter.'
                }
            ]
        },
        {
            id: 'peds-growth',
            title: '07 — Growth & Development',
            title_en: 'Milestones · Primitive Reflexes · Infantile Colic',
            summaryHtml: `
                <h3>Key Developmental Milestones</h3>
                <figure class="deck-fig"><div class="deck-fig-title"><span class="deck-tag tag-fig">Diagram</span> Milestone timeline (gross motor + social)</div>
                <svg viewBox="0 0 700 230" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Milestone timeline: social smile 2 months, rolls 4, sits 6, crawls and pincer 9, first steps and words 12, runs 18, two-word phrases 24 months.">
                <line x1="45" y1="118" x2="655" y2="118" stroke="#94a3b8" stroke-width="3"/>
                <g font-family="system-ui,Arial" font-size="11.5">
                <circle cx="70" cy="118" r="7" fill="#22c55e"/><text x="70" y="146" text-anchor="middle" font-weight="700" fill="#0f1e3d">2 mo</text><text x="70" y="100" text-anchor="middle" fill="#475569">social smile</text>
                <circle cx="162" cy="118" r="7" fill="#22c55e"/><text x="162" y="146" text-anchor="middle" font-weight="700" fill="#0f1e3d">4 mo</text><text x="162" y="100" text-anchor="middle" fill="#475569">rolls · laughs</text>
                <circle cx="256" cy="118" r="7" fill="#0ea5e9"/><text x="256" y="146" text-anchor="middle" font-weight="700" fill="#0f1e3d">6 mo</text><text x="256" y="100" text-anchor="middle" fill="#475569">sits unsupported</text>
                <circle cx="352" cy="118" r="7" fill="#0ea5e9"/><text x="352" y="146" text-anchor="middle" font-weight="700" fill="#0f1e3d">9 mo</text><text x="352" y="100" text-anchor="middle" fill="#475569">crawls · pincer</text>
                <circle cx="450" cy="118" r="7" fill="#2563eb"/><text x="450" y="146" text-anchor="middle" font-weight="700" fill="#0f1e3d">12 mo</text><text x="450" y="100" text-anchor="middle" fill="#475569">steps · 1–2 words</text>
                <circle cx="550" cy="118" r="7" fill="#7c3aed"/><text x="550" y="146" text-anchor="middle" font-weight="700" fill="#0f1e3d">18 mo</text><text x="550" y="100" text-anchor="middle" fill="#475569">runs · scribbles</text>
                <circle cx="640" cy="118" r="7" fill="#7c3aed"/><text x="640" y="146" text-anchor="middle" font-weight="700" fill="#0f1e3d">24 mo</text><text x="640" y="100" text-anchor="middle" fill="#475569">2-word phrases</text>
                </g>
                <text x="350" y="200" text-anchor="middle" font-size="11" fill="#64748b">Red flags: no social smile by 3 mo · not sitting by 9 mo · not walking / no words by 18 mo</text>
                </svg>
                <figcaption>High-yield gross-motor &amp; social milestones. Memorise the <b>red-flag</b> ages — delayed walking or no words by <b>18 months</b> warrants evaluation.</figcaption></figure>
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
            
                
                <div class="topic-deck">
<h4 class="deck-topic">Infantile colic</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Paroxysms of irritability, fussing or crying that last more than 3 hours/day, occur more than 3 days/ week, persists for more than 3 weeks in otherwise health defined patient.</li><li>Paroxysms of irritability, fussing or crying that last more than 3 hours/day, occur more than 3 days/ week, persists for more than 3 weeks in otherwise health defined patient.</li></ul></div><div class="deck-card mgmt"><span class="deck-card-h">Management</span><ul><li>Supportive &amp; behavioral adaptation</li><li>Supportive &amp; behavioral adaptation</li></ul></div></div>
                </div>
<section class="topic deck-enrich">
                    <h3>More from the study deck</h3>
                    <p class="deck-intro">Extra material for this step that spans more than one topic above.</p>
<div class="deck-block deck-tbl"><div class="deck-cap"><span class="deck-tag tag-tbl">Table</span> Rickets &amp; metabolic bone disease — biochemistry</div><p class="deck-subcap">↑ high · ↓ low · − normal</p><table><thead><tr><th>Condition</th><th>Genetics</th><th>Ca</th><th>PO₄</th><th>ALP</th><th>PTH</th><th>Vit D</th><th>1,25(OH)₂D</th></tr></thead><tbody><tr><td><b>Vit D-resistant rickets (hypophosphataemic)</b></td><td>X-linked dominant</td><td>−</td><td>↓</td><td>↑</td><td>−</td><td>−</td><td></td></tr><tr><td><b>Vit D-deficiency rickets (nutritional)</b></td><td>Nutritional</td><td>−/↓</td><td>↓</td><td>↑</td><td>↑</td><td>↓</td><td></td></tr><tr><td><b>Type I vit D-dependent</b></td><td>AR</td><td>↓</td><td>↓</td><td>↑</td><td>↑</td><td></td><td>↓↓</td></tr><tr><td><b>Type II vit D-dependent</b></td><td>AR</td><td>↓</td><td>↓</td><td>↑</td><td></td><td></td><td>↑↑</td></tr><tr><td><b>Hypophosphatasia</b></td><td>AR</td><td>↑</td><td>↑</td><td>↓↓</td><td>−</td><td>−</td><td></td></tr><tr><td><b>Renal osteodystrophy</b></td><td>Renal disease</td><td>↓</td><td>↑</td><td>↑</td><td>↑</td><td></td><td></td></tr><tr><td><b>Hyperparathyroidism</b></td><td>90% adenoma</td><td>↑</td><td>↓</td><td>↑</td><td>↑</td><td></td><td></td></tr></tbody></table></div>
<h4 class="deck-topic">Management of dehydration</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Uses in mild to moderate dehydration</li><li>Dose: 50-100 mL/Kg over 4-6 Hours, 10mL/Kg per stool or vomit</li><li>Monitoring for improvement, if not improved start IVF</li></ul></div><div class="deck-card mgmt"><span class="deck-card-h">Management</span><ul><li>severe dehydration</li><li>Not tolerating orally</li><li>Unresponsive to ORS</li><li>Avoid anti-diarrheal &amp; anti-emetics unless there is confirmed bacterial infection</li></ul></div></div>
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
                ,
                {
                    q: 'A child rides a tricycle, copies a circle, speaks in 3-word sentences and engages in group play. What is the approximate developmental age?',
                    options: ['3 years', '18 months', '4 years', '5 years'],
                    answer: 0,
                    explanation: 'At 3 years: rides a tricycle, stands on one foot, copies a circle, uses 3-word sentences and plays in groups. Copying a cross and hopping on one foot is 4 years; copying a triangle and skipping is 5 years.'
                },
                {
                    q: 'Which finding in a 16-month-old is a developmental RED FLAG requiring referral?',
                    options: ['No words yet', 'Not yet running', 'Cannot copy a circle', 'Not yet using a spoon'],
                    answer: 0,
                    explanation: 'No words by 15 months is a red flag. Other red flags: no social smile by 3 months, no babbling by 9 months, no pointing by 18 months, no 2-word phrases by 24 months, or loss of acquired skills (regression).'
                },
                {
                    q: 'A thriving 6-week-old cries inconsolably for more than 3 hours a day, more than 3 days a week, with a normal examination. What does this describe?',
                    options: ['Infantile colic (Wessel rule of 3s)', 'Intussusception', 'Cow’s-milk protein allergy with failure to thrive', 'Meningitis'],
                    answer: 0,
                    explanation: 'Infantile colic is defined by the Wessel "rule of 3s" — crying >3 hours/day, >3 days/week, in an otherwise healthy, well-growing infant with a normal examination.'
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

                
                <div class="topic-deck">
<h4 class="deck-topic">Iron Deficiency Anemia</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Fatigue, lethargy</li><li>Pallor, PICA, koilonychia</li><li>Cardiac: tachycardia</li><li>Angular cheilitis, Atrophic glossitis</li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>CBC: Low Hb ( men &lt;13, women &lt;12)</li><li>Low: Hb, ferritin, MCV, HCT.</li><li>High: TIBC, Platelet (reactive thrombocytosis), RDW (differentiate between IDA &amp; Thalassemia)</li><li>Trial of oral iron therapy</li></ul></div></div>
                </div>
<h3>Sickle Cell Disease</h3>
                <figure class="deck-fig"><div class="deck-fig-title"><span class="deck-tag tag-fig">Diagram</span> Sickle cell — the four crises</div>
                <svg viewBox="0 0 700 230" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Vaso-occlusive crisis causes bone pain and dactylitis treated with hydration, analgesia and oxygen. Aplastic crisis from parvovirus B19 causes anaemia without reticulocytosis. Splenic sequestration causes splenomegaly with hypotension. Acute chest syndrome causes fever, chest pain, hypoxia and a new infiltrate.">
                <g font-family="system-ui,Arial">
                <rect x="14" y="20" width="164" height="146" rx="10" fill="#fef3c7" stroke="#f59e0b"/><text x="96" y="46" text-anchor="middle" font-size="12.5" font-weight="800" fill="#b45309">Vaso-occlusive</text><text x="96" y="74" text-anchor="middle" font-size="11" fill="#334155">bone/joint pain</text><text x="96" y="94" text-anchor="middle" font-size="11" fill="#334155">dactylitis</text><text x="96" y="130" text-anchor="middle" font-size="11" font-weight="700" fill="#b45309">hydration ·</text><text x="96" y="148" text-anchor="middle" font-size="11" font-weight="700" fill="#b45309">analgesia · O₂</text>
                <rect x="188" y="20" width="164" height="146" rx="10" fill="#dbeafe" stroke="#3b82f6"/><text x="270" y="46" text-anchor="middle" font-size="12.5" font-weight="800" fill="#1d4ed8">Aplastic</text><text x="270" y="74" text-anchor="middle" font-size="11" font-weight="700" fill="#1d4ed8">Parvovirus B19</text><text x="270" y="96" text-anchor="middle" font-size="11" fill="#334155">NO reticulocytosis</text><text x="270" y="118" text-anchor="middle" font-size="11" fill="#334155">pancytopenia</text><text x="270" y="148" text-anchor="middle" font-size="11" font-weight="700" fill="#1d4ed8">transfusion</text>
                <rect x="362" y="20" width="164" height="146" rx="10" fill="#ede9fe" stroke="#8b5cf6"/><text x="444" y="46" text-anchor="middle" font-size="12.5" font-weight="800" fill="#6d28d9">Splenic sequestration</text><text x="444" y="76" text-anchor="middle" font-size="11" fill="#334155">splenomegaly</text><text x="444" y="98" text-anchor="middle" font-size="11" fill="#334155">severe anaemia</text><text x="444" y="120" text-anchor="middle" font-size="11" font-weight="700" fill="#6d28d9">hypotension</text><text x="444" y="150" text-anchor="middle" font-size="11" font-weight="700" fill="#6d28d9">transfusion ± splenectomy</text>
                <rect x="536" y="20" width="150" height="146" rx="10" fill="#fee2e2" stroke="#ef4444"/><text x="611" y="46" text-anchor="middle" font-size="12.5" font-weight="800" fill="#b91c1c">Acute chest</text><text x="611" y="74" text-anchor="middle" font-size="11" fill="#334155">fever · chest pain</text><text x="611" y="96" text-anchor="middle" font-size="11" fill="#334155">hypoxia</text><text x="611" y="118" text-anchor="middle" font-size="11" font-weight="700" fill="#b91c1c">NEW infiltrate</text><text x="611" y="150" text-anchor="middle" font-size="10.5" font-weight="700" fill="#b91c1c">exchange transfusion + abx</text>
                <rect x="14" y="180" width="672" height="34" rx="8" fill="#dcfce7" stroke="#22c55e"/><text x="350" y="202" text-anchor="middle" font-size="11.5" font-weight="700" fill="#15803d">Chronic care: penicillin prophylaxis 2 mo–5 y · hydroxyurea (↑HbF) · vaccines · annual transcranial Doppler · folic acid</text>
                </g></svg>
                <figcaption>The <b>reticulocyte count</b> separates them: high in sequestration/haemolysis, <b>low in aplastic crisis</b> (parvovirus B19). Acute chest syndrome is the leading cause of death.</figcaption></figure>
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

                
                <div class="topic-deck">
<figure class="deck-block algo-flow"><figcaption><span class="deck-tag tag-algo">Algorithm</span> Approach to anaemia (by MCV)</figcaption><div class="algo-row"><div class="algo-node start" style="animation-delay:0.00s">Anaemia → check MCV</div></div><div class="algo-arrow" style="animation-delay:0.05s"></div><div class="algo-fork"><div class="algo-branch"><span class="algo-label" style="animation-delay:0.12s">Microcytic (&lt;80)</span><div class="algo-node end" style="animation-delay:0.12s">Iron deficiency, thalassaemia, anaemia of chronic disease, sideroblastic anaemia</div></div><div class="algo-branch"><span class="algo-label" style="animation-delay:0.22s">Normocytic (80–100)</span><div class="algo-node proc" style="animation-delay:0.22s">Check reticulocyte count</div><div class="algo-arrow mini" style="animation-delay:0.36s"></div><div class="algo-node proc" style="animation-delay:0.32s">Low retic → marrow failure, aplastic, myelofibrosis, leukaemia / metastasis, renal failure, ACD</div><div class="algo-arrow mini" style="animation-delay:0.46s"></div><div class="algo-node end" style="animation-delay:0.42s">High retic → SCD, G6PD, hereditary spherocytosis, AIHA, PNH</div></div><div class="algo-branch"><span class="algo-label" style="animation-delay:0.52s">Macrocytic (&gt;100)</span><div class="algo-node end" style="animation-delay:0.52s">Megaloblastic (B12 / folate deficiency); alcoholic liver disease</div></div></div></figure>
<h4 class="deck-topic">Sickle cell disease</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Vaso-occlusive crisis: sudden severe pain in hands and feet</li><li>Aplastic crisis (Parvo B19 infection): Pancytopenia W/O reticulocytosis</li><li>Splenic sequestration crisis: Splenomegaly, Severe anemia, hypotension, tachycardia, pallor</li><li>Hemolytic crisis: Jaundice, dark urine, reticulocytosis.</li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>Initially Blood smear (target cells), Confirmatory Hb electrophoresis</li><li>Vaso-occlusive crisis: Analgesia (Usually opioids), Hydration, Oxygen if hypoxic</li><li>Splenic sequestration crisis: Urgent blood transfusion, Splenectomy (in recurrent cases)</li><li>Hemolytic and Aplastic Supportive management, Transfusion if indicated</li></ul></div></div>
<h4 class="deck-topic">Acute chest syndrome</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Fever</li><li>cough</li><li>Chest pain, murmur</li><li>Dyspnea</li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>Chest x-ray: New pulmonary infiltrate</li><li>Broad spectrum antibiotics</li><li>Oxygen, Pain control</li><li>Simple or exchange transfusion</li><li>Prophylaxis: Penicillin, immunization (Pneumococci), Folic acid, Hydroxyurea</li></ul></div></div>
<h4 class="deck-topic">Sickle cell disease</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Symptoms of anemia, Jaundice</li><li>Pallor, PICA, koilonychia</li><li>Cardiac: tachycardia</li><li>Angular cheilitis, Atrophic glossitis</li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>CBC: Low Hb ( men &lt;13, women &lt;12)</li><li>Low: Hb, ferritin, MCV, HCT.</li><li>High: TIBC, Platelet (reactive thrombocytosis), RDW (differentiate between IDA &amp; Thalassemia)</li><li>Trial of oral iron therapy</li></ul></div></div>
                </div>
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
            
                
            `,
            questions: [
                {
                    q: 'A 4-year-old has widespread bruising and petechiae two weeks after a viral illness. Examination is otherwise normal and the CBC shows an isolated platelet count of 45,000 with a normal haemoglobin and white cell count. There is no active bleeding. What is the best management?',
                    options: ['Urgent splenectomy', 'Platelet transfusion', 'Bone marrow transplant', 'Observation'],
                    answer: 3,
                    explanation: 'This is ITP — isolated thrombocytopenia after a viral illness with an otherwise normal examination. Most cases resolve within 6 months, so observation is appropriate when there is no active bleeding; IVIG, steroids or anti-D are used for active bleeding or a count below 10,000.'
                },
                {
                    q: 'Which of the following is part of routine chronic care for a child with sickle cell disease?',
                    options: ['Penicillin prophylaxis from 2 months to 5 years of age', 'Lifelong warfarin', 'Routine splenectomy at diagnosis', 'Iron supplementation for every patient'],
                    answer: 0,
                    explanation: 'Chronic sickle cell care includes penicillin prophylaxis from 2 months to 5 years, hydroxyurea to raise HbF, pneumococcal and meningococcal vaccination, annual transcranial Doppler and folic acid.'
                },
                {
                    q: 'How to differentiate iron deficiency anemia from thalassemia trait?',
                    options: ['RDW is elevated in IDA, normal in thalassemia', 'MCV is lower in thalassemia', 'Ferritin is low in both', 'Iron levels are normal in thalassemia'],
                    answer: 0,
                    explanation: 'RDW is the key differentiator: elevated in IDA (anisocytosis), normal in thalassemia (uniform microcytosis). Ferritin is normal in thalassemia trait.'
                },
                {
                    q: 'A child with sickle cell disease develops sudden severe anemia with a very low reticulocyte count after a viral illness. Most likely trigger?',
                    options: ['Parvovirus B19 (aplastic crisis)', 'Salmonella osteomyelitis', 'Splenic sequestration', 'Iron overload'],
                    answer: 0,
                    explanation: 'Parvovirus B19 infects erythroid precursors → aplastic crisis: severe anemia with LOW reticulocytes (no reticulocytosis). Treat with transfusion.'
                },
                {
                    q: 'A child with sickle cell disease has fever, chest pain, hypoxia and a new pulmonary infiltrate. Diagnosis and key treatment?',
                    options: ['Acute chest syndrome — exchange transfusion + antibiotics + oxygen', 'Simple pneumonia — oral antibiotics only', 'Vaso-occlusive crisis — analgesia only', 'Pulmonary embolism — anticoagulation only'],
                    answer: 0,
                    explanation: 'Acute chest syndrome (fever, chest pain, hypoxia, new infiltrate) is a leading cause of death in SCD — treat with exchange transfusion, antibiotics, oxygen and analgesia.'
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
                <figure class="deck-fig"><div class="deck-fig-title"><span class="deck-tag tag-fig">Diagram</span> Immunodeficiency — which arm is broken?</div>
                <svg viewBox="0 0 700 252" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="B-cell antibody defects such as Bruton agammaglobulinaemia and CVID cause sinopulmonary infections after 6 months. Combined T and B cell defects such as SCID cause severe infections in the first months. Phagocyte defects such as chronic granulomatous disease cause abscesses with catalase-positive organisms.">
                <g font-family="system-ui,Arial">
                <rect x="14" y="20" width="216" height="164" rx="11" fill="#dbeafe" stroke="#3b82f6"/><text x="122" y="46" text-anchor="middle" font-size="13" font-weight="800" fill="#1d4ed8">B cell / antibody</text><text x="122" y="72" text-anchor="middle" font-size="11" fill="#334155">recurrent SINOPULMONARY</text><text x="122" y="92" text-anchor="middle" font-size="11" font-weight="700" fill="#1d4ed8">starts AFTER 6 months</text><text x="122" y="112" text-anchor="middle" font-size="10.5" fill="#475569">(maternal IgG wanes)</text><text x="122" y="140" text-anchor="middle" font-size="11" fill="#334155">Bruton (no B cells, no tonsils)</text><text x="122" y="160" text-anchor="middle" font-size="11" fill="#334155">CVID (↓IgG/IgA/IgM)</text><text x="122" y="178" text-anchor="middle" font-size="10.5" font-weight="700" fill="#1d4ed8">→ IVIG replacement</text>
                <rect x="242" y="20" width="216" height="164" rx="11" fill="#fee2e2" stroke="#ef4444"/><text x="350" y="46" text-anchor="middle" font-size="13" font-weight="800" fill="#b91c1c">T cell / combined</text><text x="350" y="72" text-anchor="middle" font-size="11" font-weight="700" fill="#b91c1c">FIRST months of life</text><text x="350" y="94" text-anchor="middle" font-size="11" fill="#334155">FTT · chronic diarrhoea</text><text x="350" y="114" text-anchor="middle" font-size="11" fill="#334155">no thymic shadow</text><text x="350" y="142" text-anchor="middle" font-size="11" fill="#334155">SCID ("bubble boy")</text><text x="350" y="162" text-anchor="middle" font-size="11" fill="#334155">DiGeorge (22q11, ↓Ca²⁺)</text><text x="350" y="178" text-anchor="middle" font-size="10.5" font-weight="700" fill="#b91c1c">→ HSCT · NO live vaccines</text>
                <rect x="470" y="20" width="216" height="164" rx="11" fill="#dcfce7" stroke="#22c55e"/><text x="578" y="46" text-anchor="middle" font-size="13" font-weight="800" fill="#15803d">Phagocyte</text><text x="578" y="72" text-anchor="middle" font-size="11" fill="#334155">deep ABSCESSES</text><text x="578" y="94" text-anchor="middle" font-size="11" font-weight="700" fill="#15803d">catalase-POSITIVE organisms</text><text x="578" y="114" text-anchor="middle" font-size="10.5" fill="#475569">S. aureus · Serratia · Aspergillus</text><text x="578" y="144" text-anchor="middle" font-size="11" fill="#334155">CGD — abnormal DHR/NBT</text><text x="578" y="172" text-anchor="middle" font-size="10.5" font-weight="700" fill="#15803d">→ TMP-SMX, itraconazole, IFN-γ</text>
                <rect x="14" y="198" width="672" height="42" rx="8" fill="#fef3c7" stroke="#f59e0b"/><text x="350" y="216" text-anchor="middle" font-size="11" font-weight="700" fill="#b45309">Suspect immunodeficiency: ≥8 ear infections/yr · ≥2 serious sinus infections or pneumonias/yr</text><text x="350" y="232" text-anchor="middle" font-size="11" font-weight="700" fill="#b45309">unusual organisms · FTT with infections</text>
                </g></svg>
                <figcaption>The <b>timing and organism</b> localise the defect: after 6 months with encapsulated bacteria → antibody; first months with everything → combined; abscesses with catalase-positive organisms → phagocyte.</figcaption></figure>
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
                    <h3>More from the study deck</h3>
                    <p class="deck-intro">Extra material for this step that spans more than one topic above.</p>
<h4 class="deck-topic">Down syndrome</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>CNS: Hypotonia, Developmental delay, seizure, intellectual disability</li><li>CVS: Atrioventricular septal defect (MC), VSD, ASD</li><li>Endocrine: Congenital Hypothyroidism</li><li>GI: Duodenal atresia</li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>Trisomy 21 1% + age related risk of the mother at time of next pregancy</li><li>Translocation karyotyping to both parents to calculate the recurrence risk</li><li>Mosaicism Usually not inherited</li></ul></div></div>
                </section>
            `,
            questions: [
                {
                    q: 'A teenager has recurrent episodes of non-pruritic, non-urticarial swelling of the face and airway that do not respond to antihistamines or adrenaline. C4 is low. Which treatment is appropriate?',
                    options: ['High-dose oral antihistamines', 'Repeated IM adrenaline', 'C1 esterase inhibitor concentrate or icatibant', 'IVIG replacement'],
                    answer: 2,
                    explanation: 'Hereditary angioedema from C1 esterase inhibitor deficiency is bradykinin-mediated, so it does not respond to antihistamines or adrenaline. Treat with C1-INH concentrate or icatibant; C4 is characteristically low.'
                },
                {
                    q: 'A male infant still has not separated his umbilical cord at 6 weeks of age. He has had recurrent skin infections that produce no pus, and his white cell count is markedly elevated. What is the diagnosis?',
                    options: ['Severe combined immunodeficiency', 'Leukocyte adhesion deficiency (LAD-1)', 'Chronic granulomatous disease', 'Common variable immunodeficiency'],
                    answer: 1,
                    explanation: 'Delayed umbilical cord separation beyond 30 days, absent pus formation and a marked leukocytosis with recurrent skin and mucosal infections are the classic features of leukocyte adhesion deficiency type 1.'
                },
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
                <figure class="deck-fig"><div class="deck-fig-title"><span class="deck-tag tag-fig">Diagram</span> Neonatal jaundice — timing tells the cause</div>
                <svg viewBox="0 0 700 195" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Jaundice within 24 hours is always pathological; physiological jaundice appears day 2 to 3 and peaks day 3 to 5; jaundice persisting beyond 2 weeks is prolonged and pathological.">
                <g font-family="system-ui,Arial">
                <line x1="40" y1="130" x2="660" y2="130" stroke="#94a3b8" stroke-width="3"/>
                <rect x="40" y="66" width="86" height="64" fill="#fee2e2" stroke="#ef4444"/><text x="83" y="56" text-anchor="middle" font-size="11" font-weight="700" fill="#b91c1c">&lt;24 h</text><text x="83" y="100" text-anchor="middle" font-size="9.5" fill="#b91c1c">ALWAYS pathologic</text><text x="83" y="150" text-anchor="middle" font-size="9" fill="#475569">haemolysis · sepsis</text>
                <rect x="126" y="78" width="330" height="52" fill="#dcfce7" stroke="#22c55e"/><text x="291" y="56" text-anchor="middle" font-size="11" font-weight="700" fill="#15803d">day 2–5 · physiologic</text><text x="291" y="108" text-anchor="middle" font-size="9.5" fill="#15803d">appears day 2–3 · peaks 3–5 · unconjugated</text>
                <rect x="456" y="78" width="118" height="52" fill="#fef3c7" stroke="#f59e0b"/><text x="515" y="108" text-anchor="middle" font-size="9.5" fill="#b45309">resolves ~1–2 wk</text>
                <rect x="574" y="66" width="86" height="64" fill="#fee2e2" stroke="#ef4444"/><text x="617" y="56" text-anchor="middle" font-size="11" font-weight="700" fill="#b91c1c">&gt;2 wk</text><text x="617" y="100" text-anchor="middle" font-size="9.5" fill="#b91c1c">prolonged</text><text x="617" y="150" text-anchor="middle" font-size="8.5" fill="#475569">biliary atresia · hypothyroid</text>
                <text x="40" y="172" font-size="10" fill="#64748b">birth</text><text x="660" y="172" text-anchor="end" font-size="10" fill="#64748b">age →</text>
                </g></svg>
                <figcaption><b>&lt;24 h → always pathological</b> (ABO/Rh haemolysis, sepsis). Physiological peaks day 3–5 (unconjugated). <b>&gt;2 weeks (prolonged)</b> → biliary atresia (conjugated) or hypothyroidism.</figcaption></figure>
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
                    <h3>More from the study deck</h3>
                    <p class="deck-intro">Extra material for this step that spans more than one topic above.</p>
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
                ,
                {
                    q: 'A newborn has chorioretinitis, hydrocephalus and diffuse intracranial calcifications. Which congenital infection is most likely?',
                    options: ['Toxoplasmosis', 'Cytomegalovirus', 'Rubella', 'Syphilis'],
                    answer: 0,
                    explanation: 'The classic toxoplasmosis triad is chorioretinitis, hydrocephalus and (diffuse) intracranial calcifications. CMV instead causes PERIVENTRICULAR calcifications with microcephaly and sensorineural hearing loss.'
                },
                {
                    q: 'A term neonate develops sepsis at 24 hours of life after prolonged rupture of membranes. Which organism is most likely and what is the empiric therapy?',
                    options: ['Group B Streptococcus — ampicillin plus gentamicin', 'Coagulase-negative Staphylococcus — vancomycin alone', 'Pseudomonas — ceftazidime alone', 'Candida — fluconazole alone'],
                    answer: 0,
                    explanation: 'Early-onset sepsis (<72 h) is most often GBS (then E. coli), with risk factors of maternal GBS colonisation, chorioamnionitis and ROM >18 h. Empiric therapy is ampicillin + gentamicin.'
                },
                {
                    q: 'A premature formula-fed neonate develops abdominal distension and bloody stools. Which radiographic finding confirms the diagnosis?',
                    options: ['Pneumatosis intestinalis', 'Double bubble sign', 'Corkscrew duodenum', 'Ground-glass lungs'],
                    answer: 0,
                    explanation: 'Pneumatosis intestinalis (intramural gas) is diagnostic of necrotising enterocolitis; prematurity is the most important risk factor. Manage with NPO, NG decompression and antibiotics; portal venous gas or pneumoperitoneum indicates perforation requiring surgery.'
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

                
                <div class="topic-deck">
<h4 class="deck-topic">Nephrotic syndrome</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Massive proteinuria &gt;3.5g/day</li><li>Edema (periorbital edema)</li><li>Hypoalbuminemia</li><li>Hyperlipidemia</li><li>Remission: 3 consecutive days of negative urine dipstick for proteinuria</li><li>Steroid resistant nephrotic syndrome: Inability to induce remission within 4 weeks of steroid therapy</li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>Confirmation of nephrotic range proteinuria ( 24-Hour urine protein test)</li><li>Urine microscopy (Fatty cast)</li><li>Hyperlipidemia (High LDL, TG)</li><li>Low total protein &amp; albumin</li><li>Renal biopsy (not indicated in minimal change disease)</li></ul></div><div class="deck-card mgmt"><span class="deck-card-h">Management</span><ul><li>Edema: Fluid &amp; protein restrictions</li><li>Proteinuria: ACEI Or ARBs</li><li>Dyslipidemia: Atorvastatin</li><li>Minimal change disease: Prednisolone</li></ul></div></div>
                </div>
<h3>Nephritic Syndrome &amp; PSGN</h3>
                <figure class="deck-fig"><div class="deck-fig-title"><span class="deck-tag tag-fig">Diagram</span> PSGN vs IgA nephropathy vs HSP</div>
                <svg viewBox="0 0 700 224" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="PSGN follows strep by one to three weeks, has a low C3 that normalises, and no rash. IgA nephropathy occurs during a concurrent upper respiratory infection, has a normal C3, and no rash. HSP follows a URI, has a normal C3, and shows palpable purpura.">
                <g font-family="system-ui,Arial">
                <rect x="140" y="18" width="178" height="34" rx="8" fill="#dbeafe" stroke="#3b82f6"/><text x="229" y="41" text-anchor="middle" font-size="13" font-weight="800" fill="#1d4ed8">PSGN</text>
                <rect x="322" y="18" width="178" height="34" rx="8" fill="#f5f3ff" stroke="#8b5cf6"/><text x="411" y="41" text-anchor="middle" font-size="13" font-weight="800" fill="#6d28d9">IgA nephropathy</text>
                <rect x="504" y="18" width="180" height="34" rx="8" fill="#fef2f2" stroke="#ef4444"/><text x="594" y="41" text-anchor="middle" font-size="13" font-weight="800" fill="#b91c1c">HSP</text>
                <rect x="16" y="56" width="118" height="50" rx="8" fill="#f1f5f9" stroke="#cbd5e1"/><text x="75" y="86" text-anchor="middle" font-size="12" font-weight="700" fill="#334155">Trigger</text>
                <rect x="140" y="56" width="178" height="50" rx="8" fill="#f8fafc" stroke="#cbd5e1"/><text x="229" y="80" text-anchor="middle" font-size="10.5" fill="#334155">strep infection</text><text x="229" y="96" text-anchor="middle" font-size="10.5" font-weight="700" fill="#0f172a">1–3 wk BEFORE</text>
                <rect x="322" y="56" width="178" height="50" rx="8" fill="#f8fafc" stroke="#cbd5e1"/><text x="411" y="80" text-anchor="middle" font-size="10.5" fill="#334155">concurrent URI</text><text x="411" y="96" text-anchor="middle" font-size="10.5" font-weight="700" fill="#0f172a">(synpharyngitic)</text>
                <rect x="504" y="56" width="180" height="50" rx="8" fill="#f8fafc" stroke="#cbd5e1"/><text x="594" y="86" text-anchor="middle" font-size="10.5" fill="#334155">URI</text>
                <rect x="16" y="110" width="118" height="50" rx="8" fill="#f1f5f9" stroke="#cbd5e1"/><text x="75" y="140" text-anchor="middle" font-size="12" font-weight="700" fill="#334155">C3</text>
                <rect x="140" y="110" width="178" height="50" rx="8" fill="#fee2e2" stroke="#ef4444"/><text x="229" y="134" text-anchor="middle" font-size="12" font-weight="800" fill="#b91c1c">LOW ↓</text><text x="229" y="150" text-anchor="middle" font-size="10" fill="#7f1d1d">normalises in 6–8 wk</text>
                <rect x="322" y="110" width="178" height="50" rx="8" fill="#f0fdf4" stroke="#22c55e"/><text x="411" y="140" text-anchor="middle" font-size="12" font-weight="800" fill="#15803d">normal</text>
                <rect x="504" y="110" width="180" height="50" rx="8" fill="#f0fdf4" stroke="#22c55e"/><text x="594" y="140" text-anchor="middle" font-size="12" font-weight="800" fill="#15803d">normal</text>
                <rect x="16" y="164" width="118" height="50" rx="8" fill="#f1f5f9" stroke="#cbd5e1"/><text x="75" y="194" text-anchor="middle" font-size="12" font-weight="700" fill="#334155">Rash</text>
                <rect x="140" y="164" width="178" height="50" rx="8" fill="#f8fafc" stroke="#cbd5e1"/><text x="229" y="194" text-anchor="middle" font-size="11" fill="#64748b">none</text>
                <rect x="322" y="164" width="178" height="50" rx="8" fill="#f8fafc" stroke="#cbd5e1"/><text x="411" y="194" text-anchor="middle" font-size="11" fill="#64748b">none</text>
                <rect x="504" y="164" width="180" height="50" rx="8" fill="#fee2e2" stroke="#ef4444"/><text x="594" y="194" text-anchor="middle" font-size="11.5" font-weight="800" fill="#b91c1c">palpable purpura</text>
                </g></svg>
                <figcaption>Two discriminators do all the work: <b>C3 is low only in PSGN</b>, and <b>palpable purpura means HSP</b>. Timing separates PSGN (1–3 weeks after) from IgA (during the URI).</figcaption></figure>
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
            
                
                <div class="topic-deck">
<h4 class="deck-topic">Urinary tract infection</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Infants: Fever, poor feeding, irritability, vomiting</li><li>Toddlers: Abdominal pain, fever, foul smelling urine</li><li>Older children: dysuria, frequency, urgency, suprapubic/flank pain</li><li>Edema</li><li>Constipation</li><li>Anatomical abnormalities: VUR, posterior urethral valve,</li><li>Uncircumscribed</li><li>Incomplete bladder emptying</li><li>Oral antibiotics: (Cefixime, Amoxicillin)</li><li>Alternatives: TMP-SMS , Nitrofurantoin</li><li>IV antibiotics: (Ceftriaxone or cefotaxime) incase of severe infection, &gt;3Months, intolerate orally</li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>Urine culture → gold standard</li><li>Positive if: clean catch (≥100,000 CFU)</li><li>catheter specimen (≥ 50,000 CFU)</li><li>Suprapubic aspiration (most accurate method) Urinalysis: Positive for: (Pyuria, nitrate, leukocyte esterase)</li></ul></div></div>
                </div>
<section class="topic deck-enrich">
                    <h3>More from the study deck</h3>
                    <p class="deck-intro">Extra material for this step that spans more than one topic above.</p>
<h4 class="deck-topic">Post streptococcal glomerulonephritis</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Symptoms occur after 1-6 weeks following acute infection</li><li>Hematuria (tea - cola colored urine), oliguria</li><li>Hypertension</li><li>Edema</li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>Urinalysis &amp; microscopy: Hematuria, proteinuria, RBC cast → first step</li><li>Creatinine level</li><li>Low C3, Normal C4</li><li>Treatment: Supportive care (Fluid &amp; salt restriction) Anti- hypertensive: ACEI or ARBs or CCB</li></ul></div></div>
                </section>
            `,
            questions: [
                {
                    q: 'A child with nephrotic syndrome develops fever, abdominal pain and peritonitis. Which organism is the classic cause?',
                    options: ['Streptococcus pneumoniae', 'Escherichia coli', 'Staphylococcus aureus', 'Pseudomonas aeruginosa'],
                    answer: 0,
                    explanation: 'Spontaneous bacterial peritonitis in nephrotic syndrome is classically caused by Streptococcus pneumoniae. The other complications to remember are thrombosis (from antithrombin III loss) and infection generally (from IgG loss).'
                },
                {
                    q: 'Nephrotic syndrome in a child with normal complement and excellent response to steroids. Diagnosis?',
                    options: ['Minimal change disease', 'FSGS', 'MPGN', 'PSGN'],
                    answer: 0,
                    explanation: 'MCD = normal C3/C4, steroid-responsive, most common in children 2-6 years. FSGS and MPGN are typically steroid-resistant.'
                }
                ,
                {
                    q: 'A 4-year-old has periorbital edema, massive proteinuria and hypoalbuminemia, with normal C3/C4, no hypertension and no hematuria. Most likely diagnosis and first-line treatment?',
                    options: ['Minimal change disease — oral prednisone', 'FSGS — immediate renal biopsy', 'PSGN — salt restriction only', 'IgA nephropathy — ACE inhibitor'],
                    answer: 0,
                    explanation: 'Minimal change disease causes ~80% of childhood nephrotic syndrome (peak 2–6 y): normal complement, no HTN or hematuria, and it is steroid-responsive. Steroid resistance or hematuria/HTN suggests FSGS and warrants biopsy.'
                },
                {
                    q: 'A 7-year-old develops tea-colored urine, edema and hypertension two weeks after streptococcal pharyngitis. Which laboratory pattern is expected?',
                    options: ['Low C3 with normal C4, elevated ASO', 'Low C3 and low C4', 'Normal C3 with elevated IgA', 'Normal complement with positive ANCA'],
                    answer: 0,
                    explanation: 'PSGN classically shows a LOW C3 with normal C4 plus evidence of prior strep (↑ASO). C3 normalizes within 6–8 weeks. Management is supportive with salt and fluid restriction.'
                },
                {
                    q: 'An 8-month-old completes treatment for a first febrile urinary tract infection. What imaging is indicated next?',
                    options: ['Renal and bladder ultrasound', 'VCUG for every child immediately', 'CT abdomen with contrast', 'No imaging is ever needed'],
                    answer: 0,
                    explanation: 'A renal/bladder ultrasound is obtained after the first febrile UTI; a VCUG is reserved for an abnormal ultrasound or recurrent febrile UTIs. Urine culture remains the diagnostic gold standard.'
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

                
                <div class="topic-deck">
<h4 class="deck-topic">Myasthenia graves</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Autoimmune disorder caused by A.Ch receptor antibody at neuromuscular junction Impaired neuromuscular transmission which causes</li><li>Fluctuating muscle weakness in descending pattern, improves with rest, worsens with activity</li><li>Ptosis, diplopia, facial weakness, fatigue</li><li>Normal reflexes and sensation</li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>A.Ch receptor antibody testing</li><li>Edrophonium test</li><li>Pyridostigmine</li><li>IVIG or PLEX in severe cases</li></ul></div></div>
                </div>
<h3>Seizure Disorders</h3>
                <ul>
                    <li><b>Febrile seizures</b>: 6 mo–5 y; simple = generalized, &lt;15 min, once/24 h → no AED, treat fever; LP if &lt;12 mo or meningeal signs</li>
                    <li><b>Infantile spasms (West)</b>: 4–8 mo, salaam seizures, <b>hypsarrhythmia</b> on EEG → ACTH or vigabatrin (vigabatrin if tuberous sclerosis)</li>
                </ul>
                <figure class="deck-fig"><div class="deck-fig-title"><span class="deck-tag tag-fig">Diagram</span> Status epilepticus — escalation ladder</div>
                <svg viewBox="0 0 700 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Status epilepticus escalation: step 1 ABCs with airway, oxygen, IV access and glucose check; step 2 a benzodiazepine, lorazepam 0.1 mg per kg IV or midazolam 0.2 mg per kg IM; step 3 a loading antiepileptic, fosphenytoin or phenytoin 20 mg per kg or levetiracetam 40 to 60 mg per kg; step 4 refractory, midazolam infusion, phenobarbital or propofol with intubation.">
                <g font-family="system-ui,Arial">
                <line x1="34" y1="24" x2="34" y2="180" stroke="#94a3b8" stroke-width="2.5"/><path d="M27,179 L41,179 L34,193 Z" fill="#94a3b8"/>
                <circle cx="34" cy="36" r="15" fill="#22c55e"/><text x="34" y="41" text-anchor="middle" font-size="14" font-weight="800" fill="#fff">1</text><rect x="60" y="18" width="624" height="36" rx="8" fill="#f0fdf4" stroke="#22c55e"/><text x="76" y="41" font-size="12.5" fill="#334155"><tspan font-weight="800" fill="#15803d">ABCs</tspan> — airway · oxygen · IV access · check glucose</text>
                <circle cx="34" cy="80" r="15" fill="#3b82f6"/><text x="34" y="85" text-anchor="middle" font-size="14" font-weight="800" fill="#fff">2</text><rect x="60" y="62" width="624" height="36" rx="8" fill="#eff6ff" stroke="#3b82f6"/><text x="76" y="85" font-size="12.5" fill="#334155"><tspan font-weight="800" fill="#1d4ed8">Benzodiazepine</tspan> — lorazepam 0.1 mg/kg IV or midazolam 0.2 mg/kg IM</text>
                <circle cx="34" cy="124" r="15" fill="#f59e0b"/><text x="34" y="129" text-anchor="middle" font-size="14" font-weight="800" fill="#fff">3</text><rect x="60" y="106" width="624" height="36" rx="8" fill="#fffbeb" stroke="#f59e0b"/><text x="76" y="129" font-size="12.5" fill="#334155"><tspan font-weight="800" fill="#b45309">Loading AED</tspan> — fosphenytoin/phenytoin 20 mg/kg or levetiracetam 40–60 mg/kg</text>
                <circle cx="34" cy="168" r="15" fill="#ef4444"/><text x="34" y="173" text-anchor="middle" font-size="14" font-weight="800" fill="#fff">4</text><rect x="60" y="150" width="624" height="36" rx="8" fill="#fef2f2" stroke="#ef4444"/><text x="76" y="173" font-size="12.5" fill="#334155"><tspan font-weight="800" fill="#b91c1c">Refractory</tspan> — midazolam infusion · phenobarbital or propofol + intubation</text>
                </g></svg>
                <figcaption>Never skip a rung. <b>A benzodiazepine comes before any loading AED</b>, and airway/glucose come before both.</figcaption></figure>
                <div class="sum-callout">
                    <b>Algorithm — status epilepticus</b>
                    <ol>
                        <li>ABCs — airway, oxygen, IV access, check glucose</li>
                        <li>Benzodiazepine — lorazepam 0.1 mg/kg IV or midazolam 0.2 mg/kg IM</li>
                        <li>Loading AED — fosphenytoin/phenytoin 20 mg/kg or levetiracetam 40–60 mg/kg</li>
                        <li>Refractory — midazolam infusion, phenobarbital or propofol + intubation</li>
                    </ol>
                </div>

                
                <div class="topic-deck">
<div class="deck-block deck-tbl"><div class="deck-cap"><span class="deck-tag tag-tbl">Table</span> Hypoxic-ischaemic encephalopathy (HIE) — signs</div><table><thead><tr><th>Timing</th><th>Signs &amp; symptoms</th></tr></thead><tbody><tr><td><b>Before delivery</b></td><td>Decreased fetal movement, severe maternal cramping, abnormal fetal heart rate, vaginal bleeding, abnormal maternal weight gain, maternal hypertension</td></tr><tr><td><b>At birth</b></td><td>Low Apgar (&gt;5 min), seizures, difficulty feeding, breathing problems, metabolic / mixed acidaemia, hypotonia, organ problems, abnormal response to light, altered consciousness, coma, weak/absent cry</td></tr><tr><td><b>During infancy</b></td><td>Impaired motor function, delayed development, seizure disorders, delayed growth, hearing &amp; visual impairment</td></tr></tbody></table></div>
                </div>
<h3>Cerebral Palsy &amp; Headache</h3>
                <ul>
                    <li><b>Cerebral palsy</b>: non-progressive motor disorder from perinatal brain injury; spastic (~80%); multidisciplinary therapy, baclofen, botulinum toxin</li>
                    <li><b>Migraine</b>: pulsating, ± aura, nausea/photophobia; acute NSAIDs/triptans (&gt;6 y); prophylaxis cyproheptadine, propranolol, topiramate</li>
                </ul>
                <div class="sum-callout"><b>Headache red flags (image)</b>: thunderclap, morning headache with vomiting, wakes from sleep, progressive, neuro deficits, seizures, papilledema, age &lt;3 y.</div>
            
                
                <div class="topic-deck">
<div class="deck-block deck-tbl"><div class="deck-cap"><span class="deck-tag tag-tbl">Table</span> Migraine — the four phases</div><table><thead><tr><th>Phase</th><th>Timing</th><th>Symptoms</th></tr></thead><tbody><tr><td><b>Prodrome</b></td><td>Up to 24 h before</td><td>Mood changes, trouble sleeping, difficulty concentrating</td></tr><tr><td><b>Aura</b></td><td>5–60 min before/during</td><td>Muscle weakness, vision changes, tinnitus</td></tr><tr><td><b>Headache attack</b></td><td>4–72 h</td><td>Nausea/vomiting, severe one-sided head pain, sensitivity to sound/light/odours</td></tr><tr><td><b>Postdrome</b></td><td>Up to 48 h</td><td>Fatigue, neck stiffness, trouble focusing</td></tr></tbody></table></div>
<div class="deck-block deck-tbl"><div class="deck-cap"><span class="deck-tag tag-tbl">Table</span> Tension headache — episodic vs chronic</div><p class="deck-subcap">the most common type of headache</p><table><thead><tr><th></th><th>Episodic</th><th>Chronic</th></tr></thead><tbody><tr><td><b>Duration</b></td><td>30 minutes to a week</td><td>Several hours or continuous</td></tr><tr><td><b>Frequency</b></td><td>&lt;15 days/month for 3 months</td><td>&gt;15 days/month for ≥3 months</td></tr></tbody></table><ul class="deck-tbl-notes"><li>Symptoms: mild–moderate pressing/tightening ('tight band' around the head); tenderness of scalp, neck &amp; shoulder muscles.</li></ul></div>
                </div>
<section class="topic deck-enrich">
                    <h3>More from the study deck</h3>
                    <p class="deck-intro">Extra material for this step that spans more than one topic above.</p>
<h4 class="deck-topic">Guillain barre syndrome</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Ascending symmetrical weakness</li><li>Areflexia, hyporeflexia</li><li>paresthesia</li><li>Symptoms preceded by infection (Campylobacter jejuni mostly)</li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>CSF: High protein, normal WBC</li><li>Nerve conduction velocity: Slowed response</li><li>IVIG First line</li><li>Plasmapheresis in severe cases</li></ul></div></div>
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
                ,
                {
                    q: 'A 6-month-old has clusters of sudden flexion "salaam" spasms, and the EEG shows hypsarrhythmia. What is the treatment?',
                    options: ['ACTH (or vigabatrin, especially with tuberous sclerosis)', 'Phenytoin', 'Carbamazepine', 'Reassurance only'],
                    answer: 0,
                    explanation: 'Infantile spasms (West syndrome) occur at 4–8 months with salaam seizures and hypsarrhythmia on EEG. Treat with ACTH or vigabatrin — vigabatrin is preferred when associated with tuberous sclerosis.'
                },
                {
                    q: 'A child develops ascending symmetric weakness with areflexia two weeks after a diarrhoeal illness. CSF shows raised protein with normal cell count. Diagnosis and treatment?',
                    options: ['Guillain-Barré syndrome — IVIG or plasmapheresis with respiratory monitoring', 'Myasthenia gravis — pyridostigmine', 'Cerebral palsy — physiotherapy', 'Transverse myelitis — no treatment'],
                    answer: 0,
                    explanation: 'GBS follows infection (classically Campylobacter) with ascending symmetric paralysis, areflexia and albuminocytologic dissociation in CSF. Treat with IVIG or plasmapheresis and monitor respiratory function closely.'
                },
                {
                    q: 'A child in status epilepticus has had ABCs secured, oxygen given, IV access obtained and glucose checked. What is the next drug?',
                    options: ['A benzodiazepine (lorazepam IV or midazolam IM)', 'Fosphenytoin immediately', 'Propofol infusion', 'Phenobarbital infusion'],
                    answer: 0,
                    explanation: 'After ABCs and glucose, a benzodiazepine is first-line (lorazepam 0.1 mg/kg IV or midazolam 0.2 mg/kg IM). If seizures persist, load with fosphenytoin/phenytoin or levetiracetam; refractory cases need midazolam infusion, phenobarbital or propofol with intubation.'
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
                <figure class="deck-fig"><div class="deck-fig-title"><span class="deck-tag tag-fig">Diagram</span> Asthma controller ladder (ages 5–11)</div>
                <svg viewBox="0 0 700 252" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Asthma controller steps for ages 5 to 11: step 1 none, SABA as needed; step 2 low-dose inhaled corticosteroid daily; step 3 low-dose ICS plus LABA or medium-dose ICS; step 4 medium-dose ICS plus LABA with or without a leukotriene receptor antagonist; step 5 high-dose ICS plus LABA plus omalizumab or systemic steroids.">
                <g font-family="system-ui,Arial">
                <rect x="16" y="128" width="126" height="110" rx="10" fill="#eff6ff" stroke="#93c5fd"/><circle cx="79" cy="152" r="14" fill="#1d4ed8"/><text x="79" y="157" text-anchor="middle" font-size="14" font-weight="800" fill="#fff">1</text><text x="79" y="182" text-anchor="middle" font-size="10.5" font-weight="700" fill="#0f172a">None</text><text x="79" y="198" text-anchor="middle" font-size="9.5" fill="#334155">SABA as needed</text>
                <rect x="150" y="104" width="126" height="110" rx="10" fill="#dbeafe" stroke="#60a5fa"/><circle cx="213" cy="128" r="14" fill="#1d4ed8"/><text x="213" y="133" text-anchor="middle" font-size="14" font-weight="800" fill="#fff">2</text><text x="213" y="158" text-anchor="middle" font-size="10.5" font-weight="700" fill="#0f172a">Low-dose ICS</text><text x="213" y="174" text-anchor="middle" font-size="9.5" fill="#334155">daily</text>
                <rect x="284" y="80" width="126" height="110" rx="10" fill="#bfdbfe" stroke="#3b82f6"/><circle cx="347" cy="104" r="14" fill="#1d4ed8"/><text x="347" y="109" text-anchor="middle" font-size="14" font-weight="800" fill="#fff">3</text><text x="347" y="134" text-anchor="middle" font-size="10.5" font-weight="700" fill="#0f172a">Low-dose ICS</text><text x="347" y="150" text-anchor="middle" font-size="9.5" fill="#334155">+ LABA</text><text x="347" y="166" text-anchor="middle" font-size="9.5" fill="#334155">OR medium ICS</text>
                <rect x="418" y="56" width="126" height="110" rx="10" fill="#93c5fd" stroke="#2563eb"/><circle cx="481" cy="80" r="14" fill="#1d4ed8"/><text x="481" y="85" text-anchor="middle" font-size="14" font-weight="800" fill="#fff">4</text><text x="481" y="110" text-anchor="middle" font-size="10.5" font-weight="700" fill="#0f172a">Medium ICS</text><text x="481" y="126" text-anchor="middle" font-size="9.5" fill="#1e293b">+ LABA</text><text x="481" y="142" text-anchor="middle" font-size="9.5" fill="#1e293b">(± LTRA)</text>
                <rect x="552" y="32" width="126" height="110" rx="10" fill="#60a5fa" stroke="#1d4ed8"/><circle cx="615" cy="56" r="14" fill="#1e3a8a"/><text x="615" y="61" text-anchor="middle" font-size="14" font-weight="800" fill="#fff">5</text><text x="615" y="86" text-anchor="middle" font-size="10.5" font-weight="700" fill="#0f172a">High-dose ICS</text><text x="615" y="102" text-anchor="middle" font-size="9.5" fill="#1e293b">+ LABA +</text><text x="615" y="118" text-anchor="middle" font-size="9.5" fill="#1e293b">omalizumab /</text><text x="615" y="134" text-anchor="middle" font-size="9.5" fill="#1e293b">systemic steroids</text>
                <text x="16" y="20" font-size="10.5" font-weight="700" fill="#94a3b8">more treatment ▲</text>
                </g></svg>
                <figcaption>Each rung adds intensity: <b>ICS at step 2</b>, <b>a LABA at step 3</b>, then higher ICS doses, and only at <b>step 5</b> a biologic or systemic steroid.</figcaption></figure>
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

                
                <div class="topic-deck">
<h4 class="deck-topic">Bronchial Asthma</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Persistent dry cough</li><li>Shortness of breath</li><li>End Expiratory wheeze</li><li>Features of atopy: Allergic rhinitis, allergic conjunctivitis, eczema.</li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>Spirometry is the gold standard diagnostic tool</li><li>Showed: FEV1/FVC &lt;70% Obstructive lung disease</li><li>Response to bronchodilation FEV1 ≤12% &amp; ≥ 200ml</li><li>Methacholine challenge test: FEV1 =&gt;20% drop from baseline spirometry</li></ul></div><div class="deck-card mgmt"><span class="deck-card-h">Management</span><ul><li>Nebulized SABA (Salbutamol)</li><li>Nebulized SAMA (Ipratropium bromide)</li><li>Systemic steroid</li><li>Single dose of IV Magnesium sulphate</li><li>Step1: ICS PRN when SABA used</li><li>Step2: Low dose ICS</li><li>Step3: Low dose ICS + LABA</li><li>Step4 : Medium - high dose ICS + LABA (+ - Leukotriene modifier)</li><li>Step5: Step 4 + Omalizumab or systemic steroids</li></ul></div></div>
                </div>
<h3>Foreign Body Aspiration &amp; Cystic Fibrosis</h3>
                <ul>
                    <li><b>FB aspiration</b>: choking → cough/wheeze, unilateral decreased breath sounds; most common site <b>right main bronchus</b>; CXR air trapping → bronchoscopy (rigid); no blind finger sweep</li>
                    <li><b>Cystic fibrosis</b>: chronic cough, recurrent pneumonia (Pseudomonas/S. aureus), meconium ileus, pancreatic insufficiency, salty skin; <b>sweat chloride ≥60</b> (gold standard), F508del → chest physio, pancreatic enzymes, high-calorie diet, CFTR modulators</li>
                </ul>
            
                
                <div class="topic-deck">
<h4 class="deck-topic">Cystic fibrosis</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Chronic respiratory symptoms: Wet cough, large volume sputum</li><li>Poor growth/ poor weight gain</li><li>GIT: meconium ileus, steatorrhea (Greasy stool)</li><li>Sinusitis, Pneumonia, Nasal polyp</li></ul></div><div class="deck-card mgmt"><span class="deck-card-h">Management</span><ul><li>Step1: ICS PRN when SABA used</li><li>Step2: Low dose ICS</li><li>Step3: Low dose ICS + LABA</li><li>Step4 : Medium - high dose ICS + LABA (+ - Leukotriene modifier)</li><li>Step5: Step 4 + Omalizumab or systemic steroids</li></ul></div></div>
                </div>
<section class="topic deck-enrich">
                    <h3>More from the study deck</h3>
                    <p class="deck-intro">Extra material for this step that spans more than one topic above.</p>
<h4 class="deck-topic">Sudden infant death syndrome</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Sleeping on the stomach side</li><li>Soft bedding or overheating</li><li>Maternal smoke during pregnancy</li><li>Premature infant or low birth weight</li></ul></div><div class="deck-card mgmt"><span class="deck-card-h">Management</span><ul><li>Place baby on back to sleep (Best strategy)</li><li>Use a firm mattress</li><li>Keep sleeping area separate to the parents but in the same room</li><li>Pacifier at bed time</li></ul></div></div>
<h4 class="deck-topic">Tracheomalacia/ Laryngomalacia</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Expiratory wheeze</li><li>Cough</li><li>Stridor</li><li>Noisy breath. Tracheomalacia Disappears in Supine position. Laryngomalacia Disappears in Prone position.</li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>Tracheomalacia Bronchoscopy</li><li>Laryngomalacia Laryngoscopy</li><li>Self limiting by 1-2 years old</li></ul></div></div>
                </section>
            `,
            questions: [
                {
                    q: 'Which spirometry result supports a diagnosis of asthma?',
                    options: ['FEV1/FVC below 0.70 with an FEV1 rise of at least 12% after a bronchodilator', 'A normal FEV1/FVC with no bronchodilator response', 'A restrictive pattern with a reduced total lung capacity', 'An isolated reduction in diffusing capacity'],
                    answer: 0,
                    explanation: 'Asthma is variable, reversible obstruction: an FEV1/FVC below 0.70 with a bronchodilator response of at least a 12% rise in FEV1.'
                },
                {
                    q: 'A 6-year-old with acute asthma attack, RR 20, HR 97, SpO2 88% after initial stabilization. Reason for admission?',
                    options: ['Hypoxia (SpO2 <92% indicates severe asthma)', 'Patient age', 'Hypotension (BP is normal 110/70)', 'Asthma attack (not a reason by itself)'],
                    answer: 0,
                    explanation: 'SpO2 <92% after initial bronchodilator therapy indicates severe asthma and is an indication for hospitalization. Other criteria: persistent moderate-severe symptoms, incomplete response after 1 hour.'
                }
                ,
                {
                    q: 'A toddler had a sudden choking episode while eating peanuts and now has unilateral decreased breath sounds. Which site is most commonly involved?',
                    options: ['Right main bronchus', 'Left main bronchus', 'Trachea', 'Left lower lobe'],
                    answer: 0,
                    explanation: 'The right main bronchus is wider and more vertical, so aspirated foreign bodies lodge there most often. CXR may show air trapping; rigid bronchoscopy is both diagnostic and therapeutic. Never perform a blind finger sweep.'
                },
                {
                    q: 'Which test is the gold standard for diagnosing cystic fibrosis?',
                    options: ['Sweat chloride ≥60 mmol/L', 'Chest CT', 'Serum immunoreactive trypsinogen alone', 'Bronchoalveolar lavage culture'],
                    answer: 0,
                    explanation: 'A sweat chloride ≥60 mmol/L is the gold standard (F508del is the commonest mutation). Features include recurrent Pseudomonas/S. aureus pneumonia, meconium ileus, pancreatic insufficiency and salty-tasting skin.'
                },
                {
                    q: 'A child with a severe acute asthma exacerbation has not improved after oxygen, three nebulized SABA doses, ipratropium and systemic steroids. What is the next appropriate step?',
                    options: ['Single dose of IV magnesium sulfate', 'Start a long-acting beta-agonist alone', 'Oral montelukast', 'Discharge home on inhaled steroids'],
                    answer: 0,
                    explanation: 'For severe exacerbations not responding to O2, SABA, ipratropium and systemic steroids, a single dose of IV magnesium sulfate is added. Admit if SpO2 <92% or symptoms persist.'
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
                <figure class="deck-fig"><div class="deck-fig-title"><span class="deck-tag tag-fig">Diagram</span> JIA subtypes — oligo vs poly vs systemic</div>
                <svg viewBox="0 0 700 196" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Oligoarticular JIA is the most common subtype: one to four large joints, uveitis risk and ANA positive. Polyarticular JIA affects five or more joints and if rheumatoid factor positive resembles adult rheumatoid arthritis with a worse prognosis. Systemic JIA, Still disease, has daily quotidian fever, an evanescent salmon-pink rash, hepatosplenomegaly and serositis.">
                <g font-family="system-ui,Arial">
                <rect x="16" y="18" width="218" height="160" rx="10" fill="#f0fdf4" stroke="#22c55e"/><rect x="16" y="18" width="218" height="32" rx="10" fill="#22c55e"/><text x="125" y="40" text-anchor="middle" font-size="12.5" font-weight="800" fill="#fff">Oligoarticular</text><text x="125" y="70" text-anchor="middle" font-size="10" font-weight="800" fill="#15803d">MOST COMMON</text><text x="34" y="96" font-size="10.5" fill="#334155">• 1–4 joints</text><text x="34" y="118" font-size="10.5" fill="#334155">• large joints</text><text x="34" y="140" font-size="10.5" font-weight="700" fill="#0f172a">• uveitis risk</text><text x="34" y="162" font-size="10.5" fill="#334155">• ANA positive</text>
                <rect x="241" y="18" width="218" height="160" rx="10" fill="#eff6ff" stroke="#3b82f6"/><rect x="241" y="18" width="218" height="32" rx="10" fill="#3b82f6"/><text x="350" y="40" text-anchor="middle" font-size="12.5" font-weight="800" fill="#fff">Polyarticular</text><text x="350" y="70" text-anchor="middle" font-size="10" font-weight="800" fill="#1d4ed8">≥ 5 JOINTS</text><text x="259" y="96" font-size="10.5" fill="#334155">• 5 or more joints</text><text x="259" y="118" font-size="10.5" fill="#334155">• RF positive form resembles</text><text x="259" y="140" font-size="10.5" fill="#334155">&#160;&#160;adult rheumatoid arthritis</text><text x="259" y="162" font-size="10.5" font-weight="700" fill="#0f172a">• worse prognosis</text>
                <rect x="466" y="18" width="218" height="160" rx="10" fill="#fef2f2" stroke="#ef4444"/><rect x="466" y="18" width="218" height="32" rx="10" fill="#ef4444"/><text x="575" y="40" text-anchor="middle" font-size="12.5" font-weight="800" fill="#fff">Systemic (Still)</text><text x="575" y="70" text-anchor="middle" font-size="10" font-weight="800" fill="#b91c1c">SICK CHILD + FEVER</text><text x="484" y="96" font-size="10.5" font-weight="700" fill="#0f172a">• daily quotidian fever</text><text x="484" y="118" font-size="10.5" fill="#334155">• evanescent salmon-pink rash</text><text x="484" y="140" font-size="10.5" fill="#334155">• hepatosplenomegaly</text><text x="484" y="162" font-size="10.5" fill="#334155">• serositis</text>
                </g></svg>
                <figcaption>Count the joints first. <b>Oligo (1–4) carries the uveitis risk</b> and needs regular slit-lamp exams; <b>systemic</b> is the one with quotidian fever and the salmon-pink rash.</figcaption></figure>
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
                    q: 'A 4-year-old has daily spiking fevers, an evanescent salmon-pink rash, hepatosplenomegaly and serositis. Which subtype of juvenile idiopathic arthritis is this?',
                    options: ['Oligoarticular', 'Polyarticular, RF positive', 'Systemic (Still disease)', 'Polyarticular, RF negative'],
                    answer: 2,
                    explanation: 'Daily quotidian fever with an evanescent salmon-pink rash, hepatosplenomegaly and serositis is systemic JIA (Still disease). Oligoarticular JIA involves 1–4 large joints and carries the uveitis risk with ANA positivity; polyarticular involves 5 or more joints.'
                },
                {
                    q: 'A 5-year-old with fever, bilateral conjunctivitis, strawberry tongue, cracked lips, rash on trunk, and swollen hands. Coronary artery aneurysm on echo. Diagnosis?',
                    options: ['Kawasaki disease', 'Scarlet fever', 'Stevens-Johnson syndrome', 'Measles'],
                    answer: 0,
                    explanation: 'Kawasaki: fever >5 days + bilateral conjunctivitis + mucosal changes + rash + extremity changes + lymphadenopathy. Treat with IVIG to prevent coronary artery aneurysms.'
                }
                ,
                {
                    q: 'A 3-year-old has fever for 6 days, bilateral non-exudative conjunctivitis, cracked lips with a strawberry tongue, a polymorphous rash and swollen hands. What treatment most reduces the risk of coronary artery aneurysms?',
                    options: ['IVIG 2 g/kg plus aspirin', 'Oral prednisone alone', 'Ibuprofen alone', 'Oral antibiotics'],
                    answer: 0,
                    explanation: 'Kawasaki disease = fever ≥5 days plus 4 of 5 criteria. IVIG 2 g/kg (with aspirin) markedly reduces coronary aneurysm risk. Echocardiography is done at diagnosis and on follow-up.'
                },
                {
                    q: 'A 6-year-old has palpable purpura over the buttocks and lower limbs, joint pain and abdominal pain. What follow-up is essential?',
                    options: ['Monitor urinalysis and blood pressure for 6 months', 'Lifelong steroids', 'Immediate renal transplant workup', 'No follow-up — always benign'],
                    answer: 0,
                    explanation: 'Henoch-Schönlein purpura (IgA vasculitis) tetrad: palpable purpura, arthritis, abdominal pain and renal involvement. It is usually self-limited (4–6 weeks), but urinalysis and BP must be monitored for 6 months to detect nephritis.'
                },
                {
                    q: 'A 4-year-old girl has arthritis of two large joints and is ANA positive. Which complication requires regular slit-lamp screening?',
                    options: ['Chronic anterior uveitis', 'Coronary aneurysm', 'Glomerulonephritis', 'Pulmonary fibrosis'],
                    answer: 0,
                    explanation: 'Oligoarticular JIA (1–4 joints, ANA positive) carries a significant risk of asymptomatic chronic uveitis, so regular slit-lamp examinations are mandatory to prevent vision loss.'
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
                <figure class="deck-fig"><div class="deck-fig-title"><span class="deck-tag tag-fig">Diagram</span> Paediatric hip disorders by age</div>
                <svg viewBox="0 0 700 212" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Developmental dysplasia of the hip presents from newborn to 18 months with Ortolani and Barlow tests, ultrasound under 4 to 6 months, and a Pavlik harness under 6 months. Legg-Calvé-Perthes is avascular necrosis of the femoral head at 4 to 10 years treated by containment and activity restriction. SCFE occurs in the obese adolescent with limited internal rotation and is treated by in-situ pinning without reduction.">
                <g font-family="system-ui,Arial">
                <rect x="16" y="18" width="214" height="136" rx="10" fill="#eff6ff" stroke="#3b82f6"/><text x="123" y="42" text-anchor="middle" font-size="13.5" font-weight="800" fill="#1d4ed8">DDH</text><text x="123" y="62" text-anchor="middle" font-size="10.5" font-weight="800" fill="#0f172a">newborn – 18 months</text><text x="32" y="88" font-size="10" fill="#334155">• female · breech · family history</text><text x="32" y="108" font-size="10" font-weight="700" fill="#0f172a">• Ortolani / Barlow tests</text><text x="32" y="128" font-size="10" fill="#334155">• US if &lt;4–6 mo</text><text x="32" y="146" font-size="10" fill="#334155">• Pavlik &lt;6 mo · reduction 6–18 mo</text>
                <rect x="240" y="18" width="200" height="136" rx="10" fill="#f0fdf4" stroke="#22c55e"/><text x="340" y="42" text-anchor="middle" font-size="13.5" font-weight="800" fill="#15803d">Legg-Calvé-Perthes</text><text x="340" y="62" text-anchor="middle" font-size="10.5" font-weight="800" fill="#0f172a">4 – 10 years</text><text x="256" y="88" font-size="10" font-weight="700" fill="#0f172a">• avascular necrosis of</text><text x="256" y="106" font-size="10" font-weight="700" fill="#0f172a">&#160;&#160;the femoral head</text><text x="256" y="128" font-size="10" fill="#334155">• containment +</text><text x="256" y="146" font-size="10" fill="#334155">&#160;&#160;activity restriction</text>
                <rect x="450" y="18" width="234" height="136" rx="10" fill="#fef2f2" stroke="#ef4444"/><text x="567" y="42" text-anchor="middle" font-size="13.5" font-weight="800" fill="#b91c1c">SCFE</text><text x="567" y="62" text-anchor="middle" font-size="10.5" font-weight="800" fill="#0f172a">obese adolescent</text><text x="466" y="88" font-size="10" fill="#334155">• hip or KNEE pain</text><text x="466" y="108" font-size="10" font-weight="700" fill="#0f172a">• limited internal rotation</text><text x="466" y="128" font-size="10" fill="#334155">• Drehmann sign</text><text x="466" y="146" font-size="10" fill="#334155">• in-situ pinning — do NOT reduce</text>
                <line x1="16" y1="176" x2="668" y2="176" stroke="#94a3b8" stroke-width="2.5"/><path d="M667,169 L667,183 L681,176 Z" fill="#94a3b8"/><text x="16" y="200" font-size="10.5" font-weight="700" fill="#64748b">birth</text><text x="350" y="200" text-anchor="middle" font-size="10.5" font-weight="700" fill="#94a3b8">AGE</text><text x="676" y="200" text-anchor="end" font-size="10.5" font-weight="700" fill="#64748b">adolescence</text>
                </g></svg>
                <figcaption>Age is the fastest discriminator. <b>Reducing a SCFE causes avascular necrosis</b> — pin it in situ. A limping 4–10-year-old is Perthes until proven otherwise.</figcaption></figure>
                <ul>
                    <li><b>DDH</b>: RF female, breech, FHx; <b>Ortolani/Barlow</b> tests; US &lt;4–6 mo → Pavlik harness (&lt;6 mo), closed reduction/spica (6–18 mo)</li>
                    <li><b>SCFE</b>: obese adolescent, hip/knee pain, limited internal rotation, Drehmann sign → <b>in-situ pinning</b> (do NOT reduce — AVN risk)</li>
                    <li><b>Legg-Calvé-Perthes</b>: avascular necrosis of femoral head, 4–10 y → containment/activity restriction</li>
                    <li><b>Osgood-Schlatter</b>: tibial tubercle apophysitis in active adolescents → rest, ice, NSAIDs (self-limited)</li>
                </ul>
            `,
            questions: [
                {
                    q: 'A 9-month-old boy has a unilateral testis that has never descended into the scrotum. What is the appropriate management?',
                    options: ['Continue observation until puberty', 'Orchiopexy at 6–12 months of age', 'Immediate orchidectomy', 'Start testosterone therapy'],
                    answer: 1,
                    explanation: 'Cryptorchidism is observed to 6 months, then treated with orchiopexy at 6–12 months (and before 18 months) to preserve fertility and reduce malignancy risk.'
                },
                {
                    q: 'A 14-year-old obese boy with limp and hip pain. Hip flexion causes external rotation (Drehmann sign). Diagnosis?',
                    options: ['Legg-Calvé-Perthes disease', 'SCFE (Slipped Capital Femoral Epiphysis)', 'DDH', 'Septic arthritis'],
                    answer: 1,
                    explanation: 'SCFE: adolescent, obesity, Drehmann sign (external rotation with hip flexion), limited internal rotation. In-situ pinning required — do NOT attempt reduction.'
                }
                ,
                {
                    q: 'A 14-year-old boy has sudden severe scrotal pain with a high-riding, horizontal testis and an absent cremasteric reflex. What is the correct management?',
                    options: ['Immediate surgical exploration and detorsion', 'Ultrasound first, then reassess in the morning', 'Oral antibiotics for epididymitis', 'Scrotal support and analgesia only'],
                    answer: 0,
                    explanation: 'Testicular torsion is a surgical emergency — salvage exceeds 90% if operated within 6 hours. Do not delay for imaging; bilateral orchiopexy is performed.'
                },
                {
                    q: 'A newborn has a ventral urethral meatus with chordee. Which instruction is essential?',
                    options: ['Do NOT circumcise — the foreskin is needed for repair', 'Circumcise immediately at birth', 'Repair must be delayed until age 5 years', 'No treatment is ever required'],
                    answer: 0,
                    explanation: 'In hypospadias the foreskin is used for surgical reconstruction, so circumcision must be avoided. Repair is typically performed at 6–18 months.'
                },
                {
                    q: 'An obese 13-year-old has hip and knee pain with limited internal rotation of the hip. What is the correct treatment?',
                    options: ['In-situ pinning without reduction', 'Closed reduction then spica cast', 'Pavlik harness', 'Activity restriction alone'],
                    answer: 0,
                    explanation: 'SCFE (slipped capital femoral epiphysis) in an obese adolescent is treated by in-situ pinning. Reduction must be avoided because it risks avascular necrosis of the femoral head.'
                }
            ]
        },
        {
            id: 'peds-vaccination',
            title: '16 — Vaccination',
            title_en: 'Schedule · Vaccine Types · Contraindications',
            summaryHtml: `
                <h3>Pediatric Vaccination Schedule</h3>
                <figure class="deck-fig"><div class="deck-fig-title"><span class="deck-tag tag-fig">Diagram</span> The schedule as a timeline</div>
                <svg viewBox="0 0 700 156" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Vaccination timeline: at birth hepatitis B dose 1 within 24 hours; 2 months DTaP, IPV, Hib, PCV, rotavirus and hepatitis B dose 2; 4 months DTaP, IPV, Hib, PCV and rotavirus; 6 months DTaP, IPV, Hib, PCV, hepatitis B dose 3 and yearly influenza; 12 months MMR dose 1, varicella dose 1, PCV dose 4 and Hib dose 4; 12 to 23 months hepatitis A doses 1 and 2 six months apart; 4 to 6 years DTaP dose 5, IPV dose 4, MMR dose 2 and varicella dose 2; 11 to 12 years Tdap, meningococcal ACWY and HPV.">
                <g font-family="system-ui,Arial">
                <line x1="26" y1="54" x2="674" y2="54" stroke="#cbd5e1" stroke-width="3"/>
                <text x="40" y="30" text-anchor="middle" font-size="10.5" font-weight="800" fill="#0f172a">Birth</text><circle cx="40" cy="54" r="11" fill="#3b82f6"/><text x="40" y="82" text-anchor="middle" font-size="9" fill="#334155">HepB #1</text><text x="40" y="97" text-anchor="middle" font-size="9" fill="#334155">within 24 h</text>
                <text x="128" y="30" text-anchor="middle" font-size="10.5" font-weight="800" fill="#0f172a">2 mo</text><circle cx="128" cy="54" r="11" fill="#3b82f6"/><text x="128" y="82" text-anchor="middle" font-size="9" fill="#334155">DTaP · IPV</text><text x="128" y="97" text-anchor="middle" font-size="9" fill="#334155">Hib · PCV</text><text x="128" y="112" text-anchor="middle" font-size="9" fill="#334155">Rotavirus</text><text x="128" y="127" text-anchor="middle" font-size="9" fill="#334155">HepB #2</text>
                <text x="216" y="30" text-anchor="middle" font-size="10.5" font-weight="800" fill="#0f172a">4 mo</text><circle cx="216" cy="54" r="11" fill="#3b82f6"/><text x="216" y="82" text-anchor="middle" font-size="9" fill="#334155">DTaP · IPV</text><text x="216" y="97" text-anchor="middle" font-size="9" fill="#334155">Hib · PCV</text><text x="216" y="112" text-anchor="middle" font-size="9" fill="#334155">Rotavirus</text>
                <text x="304" y="30" text-anchor="middle" font-size="10.5" font-weight="800" fill="#0f172a">6 mo</text><circle cx="304" cy="54" r="11" fill="#3b82f6"/><text x="304" y="82" text-anchor="middle" font-size="9" fill="#334155">DTaP · IPV</text><text x="304" y="97" text-anchor="middle" font-size="9" fill="#334155">Hib · PCV</text><text x="304" y="112" text-anchor="middle" font-size="9" fill="#334155">HepB #3</text><text x="304" y="127" text-anchor="middle" font-size="9" fill="#334155">Influenza (yearly)</text>
                <text x="392" y="30" text-anchor="middle" font-size="10.5" font-weight="800" fill="#0f172a">12 mo</text><circle cx="392" cy="54" r="11" fill="#8b5cf6"/><text x="392" y="82" text-anchor="middle" font-size="9" font-weight="700" fill="#6d28d9">MMR #1</text><text x="392" y="97" text-anchor="middle" font-size="9" font-weight="700" fill="#6d28d9">Varicella #1</text><text x="392" y="112" text-anchor="middle" font-size="9" fill="#334155">PCV #4 · Hib #4</text>
                <text x="480" y="30" text-anchor="middle" font-size="10.5" font-weight="800" fill="#0f172a">12–23 mo</text><circle cx="480" cy="54" r="11" fill="#8b5cf6"/><text x="480" y="82" text-anchor="middle" font-size="9" fill="#334155">HepA #1, #2</text><text x="480" y="97" text-anchor="middle" font-size="9" fill="#334155">6 months apart</text>
                <text x="568" y="30" text-anchor="middle" font-size="10.5" font-weight="800" fill="#0f172a">4–6 y</text><circle cx="568" cy="54" r="11" fill="#f59e0b"/><text x="568" y="82" text-anchor="middle" font-size="9" fill="#334155">DTaP #5 · IPV #4</text><text x="568" y="97" text-anchor="middle" font-size="9" fill="#334155">MMR #2</text><text x="568" y="112" text-anchor="middle" font-size="9" fill="#334155">Varicella #2</text>
                <text x="656" y="30" text-anchor="middle" font-size="10.5" font-weight="800" fill="#0f172a">11–12 y</text><circle cx="656" cy="54" r="11" fill="#ef4444"/><text x="656" y="82" text-anchor="middle" font-size="9" fill="#334155">Tdap</text><text x="656" y="97" text-anchor="middle" font-size="9" fill="#334155">MenACWY</text><text x="656" y="112" text-anchor="middle" font-size="9" fill="#334155">HPV</text>
                </g></svg>
                <figcaption>The <b>12-month visit</b> is the live-vaccine milestone (MMR + varicella) — the same vaccines that are contraindicated in severe immunocompromise and pregnancy.</figcaption></figure>
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

                
                <div class="topic-deck">
<h4 class="deck-topic">Vaccination Types</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>All viral vaccines are live attenuated except: HepB, HepA, IPV, Inactivated influenza</li><li>All bacterial vaccines are killed except: BCG &amp; typhoid</li><li>Toxoid: Diphtheria, Tetanus</li></ul></div></div>
                </div>
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
                    <h3>More from the study deck</h3>
                    <p class="deck-intro">Extra material for this step that spans more than one topic above.</p>
<h4 class="deck-topic">Down syndrome</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>CNS: Hypotonia, Developmental delay, seizure, intellectual disability</li><li>CVS: Atrioventricular septal defect (MC), VSD, ASD</li><li>Endocrine: Congenital Hypothyroidism</li><li>GI: Duodenal atresia</li><li>CNS: Hypotonia, Developmental delay, seizure, intellectual disability</li><li>CVS: Atrioventricular septal defect (MC), VSD, ASD</li><li>Endocrine: Congenital Hypothyroidism</li><li>GI: Duodenal atresia</li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>Trisomy 21 1% + age related risk of the mother at time of next pregancy</li><li>Translocation karyotyping to both parents to calculate the recurrence risk</li><li>Mosaicism Usually not inherited</li><li>Trisomy 21 1% + age related risk of the mother at time of next pregancy</li><li>Translocation karyotyping to both parents to calculate the recurrence risk</li><li>Mosaicism Usually not inherited</li></ul></div></div>
                </section>
            `,
            questions: [
                {
                    q: 'A 4-month-old is due for vaccination but has a runny nose with a temperature of 37.8 °C and is taking an antibiotic for otitis media. What should be done?',
                    options: ['Vaccinate as scheduled', 'Delay all vaccines until the antibiotic course is finished', 'Give only inactivated vaccines today', 'Delay for 4 weeks after the fever settles'],
                    answer: 0,
                    explanation: 'Mild illness with a low-grade fever and current antibiotic use are NOT contraindications to vaccination. True contraindications are anaphylaxis to a component or a prior dose, live vaccines in severe immunocompromise or pregnancy, and DTaP after encephalopathy within 7 days of a previous dose.'
                },
                {
                    q: 'A 6-month-old with active seizures on anti-epileptics, dysmorphic features, hypotonia. How should the immunization schedule be modified?',
                    options: ['Give IPV instead of OPV', 'Defer the DTP vaccine (unstable neurological disorder)', 'Defer all live vaccines', 'Defer all vaccines'],
                    answer: 1,
                    explanation: 'Unstable/progressive neurologic disease is a precaution for DTaP/DTP. Stable neurologic conditions (cerebral palsy, controlled seizures) are NOT contraindications.'
                }
                ,
                {
                    q: 'Which of the following is a TRUE contraindication to giving a live attenuated vaccine such as MMR or varicella?',
                    options: ['Severe immunocompromise or pregnancy', 'A mild upper respiratory illness with low-grade fever', 'Currently taking antibiotics', 'A history of penicillin allergy'],
                    answer: 0,
                    explanation: 'Live vaccines (MMR, varicella, rotavirus, LAIV) are contraindicated in severe immunocompromise and pregnancy. Mild illness, antibiotics, prematurity and penicillin allergy are NOT contraindications.'
                },
                {
                    q: 'At which visit are MMR #1 and Varicella #1 normally given?',
                    options: ['12 months', 'Birth', '6 months', '4–6 years'],
                    answer: 0,
                    explanation: 'MMR #1 and Varicella #1 are given at 12 months (with PCV #4 and Hib #4). The second doses of MMR and varicella are given at 4–6 years.'
                },
                {
                    q: 'A child had encephalopathy within 7 days of a previous DTaP dose. What does this represent?',
                    options: ['A true contraindication to further DTaP', 'A reason to simply delay the next dose one week', 'An expected reaction requiring no change', 'An indication to double the next dose'],
                    answer: 0,
                    explanation: 'Encephalopathy within 7 days of a prior dose is a true contraindication to further DTaP, alongside anaphylaxis to a vaccine component or prior dose.'
                }
            ]
        },
        {
            id: 'peds-infectious',
            title: '17 — Infectious Disease / Dermatology',
            title_en: 'Croup vs Epiglottitis · Exanthems · Meningitis · Skin',
            summaryHtml: `
                <h3>Respiratory Infections</h3>
                <figure class="deck-fig"><div class="deck-fig-title"><span class="deck-tag tag-fig">Diagram</span> Croup vs epiglottitis — steeple vs thumbprint</div>
                <div class="deck-imgrow deck-imgrow--scan">
                    <div class="deck-imgcell">
                        <img class="deck-img" src="/summaries/croup-steeple-sign.webp" width="426" height="429" loading="lazy" decoding="async"
                             alt="Anteroposterior neck radiograph of a child. An arrow points to the subglottic trachea, where the air column tapers symmetrically to a narrow point instead of keeping its normal shoulders — the steeple sign." />
                        <p class="deck-imgcap"><b>Croup</b> — STEEPLE sign on the <b>AP</b> neck film
                        <br>6 mo – 3 y · gradual onset · BARKING (seal) cough · drooling rare · parainfluenza
                        <br><span class="deck-hi deck-hi--green">dexamethasone ± nebulised adrenaline</span></p>
                    </div>
                    <div class="deck-imgcell">
                        <img class="deck-img" src="/summaries/epiglottitis-thumbprint-sign.webp" width="400" height="628" loading="lazy" decoding="async"
                             alt="Lateral neck radiograph. An arrow points to a markedly swollen, rounded epiglottis bulging into the airway, shaped like the tip of a thumb — the thumbprint sign." />
                        <p class="deck-imgcap"><b>Epiglottitis</b> — THUMBPRINT sign on the <b>lateral</b> neck film
                        <br>2 – 7 y · SUDDEN onset · drooling · tripod · cough usually absent · H. influenzae type B
                        <br><span class="deck-hi deck-hi--red">secure airway in OR + IV antibiotics</span></p>
                    </div>
                </div>
                <div class="deck-warn">Never examine the throat or distress a child with suspected epiglottitis — it can precipitate total airway obstruction</div>
                <figcaption><b>The view itself is a clue</b>: the steeple sign is looked for on the <b>AP</b> film, the thumbprint sign on the <b>lateral</b>. Clinically — <b>drooling + tripod + sudden onset</b> = epiglottitis (airway emergency); <b>barking cough + gradual onset</b> = croup, treated with dexamethasone.</figcaption>
                <p class="deck-credit">Steeple sign radiograph: <a href="https://commons.wikimedia.org/wiki/File:Croup_steeple_sign.jpg" target="_blank" rel="noopener noreferrer">Frank Gaillard</a>, <a href="https://creativecommons.org/licenses/by-sa/3.0/" target="_blank" rel="noopener noreferrer">CC BY-SA 3.0</a>. Thumbprint sign radiograph: <a href="https://commons.wikimedia.org/wiki/File:Epiglottitis.jpg" target="_blank" rel="noopener noreferrer">Med Chaos</a>, <a href="https://creativecommons.org/publicdomain/zero/1.0/" target="_blank" rel="noopener noreferrer">CC0 1.0</a>. Both resized for web; content unmodified.</p></figure>
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

                
                <div class="topic-deck">
<h4 class="deck-topic">Croup</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Barking cough Low grade fever</li><li>Inspiratory stridor (due to subglottic narrowing)</li><li>URTI symptoms (Sneezing, rhinitis, sore throat) as it caused by Parainfluenza virus</li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>CXR showed steeple sign due to subglottic narrowing (next slide)</li><li>Dexamethasone is the primary management</li><li>Racemic epinephrine in severe croup (repeated after 30 minutes if no response)</li></ul></div></div>
<h4 class="deck-topic">Epiglottitis</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Respiratory distress Drooling of saliva</li><li>High grade fever &amp; toxic appearance patient</li><li>Tripod position</li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>Empirical antibiotics (3 rd generation cephalosporin) &amp; blood culture</li><li>Prepare for possible intubation</li><li>Supportive therapy (oxygenation, control of fever)</li></ul></div></div>
<h4 class="deck-topic">Bronchiolitis</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Symptoms of URTI (Rhinorrhea, cough, low grade fever) followed by LRTI (Crackles , wheeze) Most common cause is Respiratory syncytial virus (RSV)</li><li>Severe respiratory distress (Usually in &lt;2y old patient)</li><li>Signs of respiratory distress (Tachypnea, nasal flaring, prolonged expiration, cyanosis )</li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>Blood gases: hypoxemia &amp; hypercapnia</li><li>Treatment by respiratory support if indicated</li></ul></div></div>
<h4 class="deck-topic">Pertussis</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Symptoms or URTI Paroxysmal high pitched whooping cough</li><li>may followed by cyanosis or postussive vomiting (puts patient at risk of aspiration pneumonia)</li><li>Diagnosis &amp; management Nasopharyngeal PCR , Bacterial culture (Gold standard)</li><li>Treatment &amp; chemoprophylaxis to close contact: Macrolides</li></ul></div></div>
                </div>
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

                
                <div class="topic-deck">
<h4 class="deck-topic">Varicella</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Stages of skin lesion: Papule → vesicles → pustule → scabs fall &amp; dried (non-contagious at this stage) After resolution of symptoms → inactivated at the dorsal root ganglia → Shingles (if reactivated)</li><li>Starts centrally (face, trunk) then spread peripherally</li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>prophylaxis based on immune status of the patient</li><li>Immunocompetent: Vaccinated → observation, non vaccinated or unknown status → Vaccination</li><li>Immunocompromised: symptomatic → IV acyclovir, Asymptomatic → IVIG</li></ul></div></div>
<h4 class="deck-topic">Measles &amp; rubella</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>3Cs: Coryza, cough, conjunctivitis Fever</li><li>Koplik spots (Shown in the picture)</li><li>Generalized lymphadenopathy Erythematous Maculopapular rash on the face &amp; upper body</li><li>Prodromal phase: post-auricular, suboccipital lymphadenopathy</li><li>Exanthem phase: Maculopapular rash starts behind ear then to peripheries, sparing palms&amp; soles</li><li>Forcheimer spot on the soft palate (See next slide)</li><li>Coryza, cough, conjunctivitis Fever</li><li>Koplik spots (Shown in the picture)</li><li>Generalized lymphadenopathy Erythematous Maculopapular rash on the face &amp; upper body</li><li>Prodromal phase: post-auricular, suboccipital lymphadenopathy</li><li>Exanthem phase: Maculopapular rash starts behind ear then to peripheries, sparing palms&amp; soles</li><li>Forcheimer spot on the soft palate (See next slide)</li></ul></div></div>
                </div>
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

                
                <div class="topic-deck">
<h4 class="deck-topic">Viral gastroenteritis</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Fever Vomiting</li><li>Profuse watery diarrhea</li><li>Signs of dehydration</li><li>PCR</li><li>Supportive management</li></ul></div></div>
<h4 class="deck-topic">Meningitis</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Headache Neck stiffness</li><li>Kernig's and Brudzinski sign</li><li>Nausea &amp; vomiting</li><li>Headache Neck stiffness</li><li>Kernig's and Brudzinski sign</li><li>Nausea &amp; vomiting</li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>CXR showed steeple sign due to subglottic narrowing (next slide)</li><li>Dexamethasone is the primary management</li><li>Racemic epinephrine in severe croup (repeated after 30 minutes if no response)</li></ul></div><div class="deck-card mgmt"><span class="deck-card-h">Management</span><ul><li>Prophylaxis Treated by empirical antibiotic: Ceftriaxone, Vancomycin, dexamethasone ( Avoid hearing loss)</li><li>Prophylaxis: 2doses of rifampicin to close contacts</li></ul></div></div>
                </div>
<h3>Skin &amp; Soft Tissue / Misc</h3>
                <ul>
                    <li><b>Impetigo</b>: honey-colored crusts (S. aureus/GAS) → topical mupirocin or oral antibiotics</li>
                    <li><b>Orbital cellulitis</b>: painful/restricted eye movement, proptosis, ↓vision (vs preseptal) — from ethmoid sinusitis → CT + IV antibiotics</li>
                    <li><b>Lyme</b>: erythema migrans (bull's-eye) → doxycycline (&gt;8 y) or amoxicillin</li>
                    <li><b>RMSF</b>: rash starts wrists/ankles → centripetal; <b>doxycycline at any age</b>, treat empirically</li>
                </ul>
            
                
                <div class="topic-deck">
<div class="deck-block deck-tbl"><div class="deck-cap"><span class="deck-tag tag-tbl">Table</span> Preseptal vs orbital cellulitis</div><table><thead><tr><th>Feature</th><th>Preseptal cellulitis</th><th>Orbital cellulitis</th></tr></thead><tbody><tr><td><b>History</b></td><td>Insect bite or trauma around the eye</td><td>URTI, toothache, earache, headache</td></tr><tr><td><b>Proptosis</b></td><td>Absent</td><td>Present</td></tr><tr><td><b>Eye movement</b></td><td>Normal</td><td>Painful, restricted</td></tr><tr><td><b>Visual acuity</b></td><td>Normal</td><td>Reduced in severe cases</td></tr><tr><td><b>Colour vision</b></td><td>Normal</td><td>Reduced in severe cases</td></tr><tr><td><b>Pupil (RAPD)</b></td><td>Normal</td><td>Present in severe cases</td></tr></tbody></table></div>
                </div>
<section class="topic deck-enrich">
                    <h3>More from the study deck</h3>
                    <p class="deck-intro">Extra material for this step that spans more than one topic above.</p>
<h4 class="deck-topic">Herpes simplex virus HSV-1</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Gingivostomatitis: painful ulceration on perioral skin &amp; oral mucosa Submandibular &amp; or cervical lymphadenopathy</li><li>Cluster of vesicles peri orally, tonsils, or on posterior pharynx.</li><li>Symptoms of viral infection (Nausea, fever, malaise)</li><li>Diagnosis &amp; management Clinically suspected &amp; confirmed by viral culture or PCR</li><li>Treatment: Acyclovir</li><li>1 st line : orally</li><li>Incase of dysphagia, odynophagia or Herpes encephalitis: IV acyclovir</li></ul></div></div>
<h4 class="deck-topic">Eczema</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Intense pruritus &amp; dry skin Infantile Eczema &lt;6Months: Face, head and scalp</li><li>6months - 2 years: extensor surfaces, face</li><li>2-12 years: flexural creases (popliteal &amp; antecubital fossa)</li><li>&gt;12 years: flexural surfaces, perioral region</li></ul></div><div class="deck-card mgmt"><span class="deck-card-h">Management</span><ul><li>Cornerstone of treatment is topical corticosteroids moisturizers Non-soap cleaners</li></ul></div></div>
<h4 class="deck-topic">Helicobacter Pylori</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Abdominal distension, flatulence Nausea</li><li>Weight loss, loss of appetite</li><li>Heartburn</li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>Triple therapy: PPI + Amoxicillin (Or metronidazole) + clarithromycin</li><li>Quadruple therapy: PPI + Bismuth salicylate + Metronidazole + Tetracycline</li></ul></div></div>
<h4 class="deck-topic">Giardia lamblia</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Prolonged diarrhea Abdominal cramps / bloating</li><li>malabsorption</li><li>Pale/greasy stool (steatorrhea)</li><li>PCR</li><li>Antigen detection on stool (ELISA)</li><li>Metronidazole/tinidazole is the best management</li></ul></div></div>
<h4 class="deck-topic">Septic arthritis</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Fever Acute mono-articular joint pain (Hip) or refusal to move</li><li>Decrease range of motion</li><li>Tenderness, warmth</li></ul></div><div class="deck-card diag"><span class="deck-card-h">Diagnosis · best test</span><ul><li>Arthrocentesis</li><li>Blood culture (Staph aureus is the most common organism)</li><li>Treatment: Empirical antibiotic (Vancomycin)</li></ul></div></div>
<h4 class="deck-topic">Otitis media</h4><div class="deck-cards"><div class="deck-card clin"><span class="deck-card-h">Clinical</span><ul><li>Ear pain / otalgia Hearing loss</li><li>Fever</li><li>Otorrhea, bulging or perforated tympanic membrane</li><li>Children &lt;2 years → Give antibiotic</li><li>Children &gt;2 years → give antibiotic incase of severe infection</li><li>Oral amoxicillin is the antibiotic of choice</li><li>Ear pain / otalgia Hearing loss</li><li>Fever</li><li>Otorrhea, bulging or perforated tympanic membrane</li><li>Children &lt;2 years → Give antibiotic</li><li>Children &gt;2 years → give antibiotic incase of severe infection</li><li>Oral amoxicillin is the antibiotic of choice</li></ul></div></div>
                </section>
            `,
            questions: [
                {
                    q: 'An 18-month-old has a two-day history of a barking, seal-like cough with stridor and no drooling. The neck film shows a steeple sign. Which treatment is indicated?',
                    options: ['Dexamethasone, with nebulised adrenaline if severe', 'Securing the airway in the operating room', 'IV ceftriaxone alone', 'Palivizumab'],
                    answer: 0,
                    explanation: 'Gradual onset, a barking cough, absent drooling and the steeple sign identify croup (parainfluenza), treated with dexamethasone and nebulised adrenaline. Sudden onset with drooling, a tripod position and a thumbprint sign would indicate epiglottitis, which needs the airway secured in theatre.'
                },
                {
                    q: 'A lumbar puncture returns cloudy CSF with 2,500 white cells that are predominantly neutrophils, a glucose of 25 mg/dL and a protein of 180 mg/dL. Which pattern is this?',
                    options: ['Normal CSF', 'Viral meningitis', 'Tuberculous meningitis', 'Bacterial meningitis'],
                    answer: 3,
                    explanation: 'Bacterial CSF is cloudy or purulent with more than 1,000 white cells (PMNs), a low glucose (below 40) and a high protein (above 100). Viral CSF is clear with fewer than 500 lymphocytes and a normal glucose; TB CSF has 100–500 lymphocytes with a low glucose and high protein.'
                },
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
