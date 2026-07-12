// Internal Medicine — section content for the continuous-scroll summaries page.
// Structured as subtopics, each with a high-yield summary (HTML using the
// .sum-doc conventions) followed by interactive questions. Sourced from the
// recall-derived study decks in /content + UpToDate/Harrison-level knowledge,
// with algorithms. Angle brackets are HTML-escaped (&lt; / &gt;). Questions are
// authored (no duplicates) with answer index (0-based) + explanation.

const medicine = {
    id: 'medicine',
    title: 'Internal Medicine',
    title_en: 'High-Yield SMLE Review — 8 Core Systems',
    icon: 'stethoscope',
    accent: '#22d3ee',
    intro: 'Internal Medicine high-yield SMLE review — 8 core systems with algorithms, comparison tables and interactive MCQs: Cardiology · Pulmonology · Gastroenterology & Hepatology · Endocrinology · Nephrology & Electrolytes · Haematology & Oncology · Infectious Disease & Sepsis · Rheumatology & Neurology.',
    subtopics: [
        {
            id: 'med-cardiology',
            title: '01 — Cardiology',
            title_en: 'IHD & ACS · Heart Failure · Valves · Arrhythmias · Lipids',
            summaryHtml: `
                <h3>Ischaemic Heart Disease &amp; ACS</h3>
                <ul>
                    <li><b>Stable angina</b>, normal resting ECG/enzymes → <b>exercise stress ECG</b>; unable to exercise (OA knee, PAD) → <b>dobutamine stress echo</b> / vasodilator MPI; uninterpretable ECG (LBBB, paced) → imaging stress test</li>
                    <li><b>Anti-anginal</b>: beta-blocker (1st line) + GTN PRN; add CCB / long-acting nitrate; all get aspirin + statin</li>
                    <li><b>ACS initial therapy</b> = MONA-BASH: Morphine, O₂ (only if SpO₂ &lt;90%), Nitrates, Aspirin 300 mg + 2nd antiplatelet, Beta-blocker, ACEi, Statin (high-intensity), Heparin</li>
                    <li>Inferior MI (II, III, aVF) + hypotension → suspect <b>RV infarct</b> → IV fluids, <b>AVOID nitrates</b></li>
                </ul>
                <table>
                    <thead><tr><th>Type</th><th>ECG</th><th>Troponin</th><th>Reperfusion / strategy</th></tr></thead>
                    <tbody>
                        <tr><td><b>STEMI</b></td><td>ST elevation / new LBBB</td><td>Raised</td><td><b>Primary PCI &lt;90 min</b> (thrombolysis if PCI &gt;120 min away &amp; onset &lt;12 h)</td></tr>
                        <tr><td><b>NSTEMI</b></td><td>ST depression / T inversion</td><td>Raised</td><td>Antithrombotics + GRACE score → early angiography (&lt;24–72 h) if high risk</td></tr>
                        <tr><td><b>Unstable angina</b></td><td>± ST depression</td><td>Normal</td><td>Antithrombotics + risk stratify</td></tr>
                    </tbody>
                </table>

                <h3>Heart Failure</h3>
                <ul>
                    <li><b>HFrEF</b> (EF ≤40%) — four pillars with mortality benefit: <b>ARNI/ACEi/ARB + beta-blocker + MRA + SGLT2 inhibitor</b>; loop diuretic for congestion (symptoms only, no mortality benefit)</li>
                    <li><b>HFpEF</b> (EF ≥50%, concentric LVH, diastolic dysfunction): treat HTN/volume + <b>SGLT2 inhibitor</b></li>
                    <li><b>Acute pulmonary oedema</b>: sit up, O₂/CPAP, IV furosemide, nitrates (if not hypotensive); avoid fluids/IV beta-blocker</li>
                    <li>Persistent EF ≤35% + NYHA II–III on optimal therapy → consider <b>ICD</b>; QRS &gt;150 ms LBBB → <b>CRT</b></li>
                </ul>

                <h3>Valvular Disease</h3>
                <table>
                    <thead><tr><th>Lesion</th><th>Murmur</th><th>Key point / management</th></tr></thead>
                    <tbody>
                        <tr><td>Aortic stenosis</td><td>Ejection systolic → carotids; soft S2</td><td>Syncope/Angina/Dyspnoea = poor prognosis; symptomatic or EF &lt;50% → <b>SAVR/TAVR</b>; asymptomatic → serial echo</td></tr>
                        <tr><td>Aortic regurgitation</td><td>Early diastolic; wide pulse pressure</td><td>Vasodilators; surgery if symptomatic or LV dilation</td></tr>
                        <tr><td>Mitral stenosis</td><td>Mid-diastolic rumble, opening snap</td><td>Rheumatic; AF common → rate control + anticoagulate; balloon valvotomy</td></tr>
                        <tr><td>Mitral regurgitation</td><td>Pansystolic → axilla</td><td>Surgery if symptomatic or EF 30–60%</td></tr>
                    </tbody>
                </table>

                <h3>Arrhythmias</h3>
                <ul>
                    <li><b>Atrial fibrillation</b>: rate control (beta-blocker/CCB) + anticoagulate by <b>CHA₂DS₂-VASc</b> (≥2 men / ≥3 women → DOAC); unstable → synchronised DC cardioversion; occult paroxysmal AF with normal ECG → <b>Holter monitor</b></li>
                    <li><b>SVT</b> (regular narrow-complex): vagal manoeuvres → IV adenosine; unstable → cardioversion</li>
                    <li><b>VT</b>: unstable → synchronised cardioversion; pulseless VT/VF → defibrillate; stable monomorphic → amiodarone</li>
                    <li><b>Bradycardia / complete heart block</b>: atropine → transcutaneous pacing → permanent pacemaker (Mobitz II / 3rd-degree)</li>
                    <li><b>Torsades de pointes</b> (long QT): <b>IV magnesium</b>, stop QT-prolonging drugs</li>
                </ul>

                <h3>Lipids, Prevention &amp; Other</h3>
                <ul>
                    <li>On maximal statin, LDL above target → add <b>ezetimibe</b> → then <b>PCSK9 inhibitor</b> (evolocumab)</li>
                    <li><b>HIT</b>: platelets fall ~day 5–10 on heparin + new thrombosis → stop heparin, start <b>argatroban/fondaparinux</b> (never warfarin or platelets acutely)</li>
                    <li><b>Pericarditis</b>: pleuritic pain relieved sitting forward, diffuse saddle ST elevation, PR depression → NSAID + colchicine; large effusion → tamponade (Beck triad, pulsus paradoxus) → <b>pericardiocentesis</b></li>
                    <li><b>Aortic dissection</b>: tearing chest→back pain, BP differential → CT angiography; type A → surgery, type B → control BP (labetalol)</li>
                </ul>
                <div class="sum-callout">
                    <b>Algorithm — chest pain / suspected ACS</b>
                    <ol>
                        <li>ECG within 10 min + serial high-sensitivity troponin</li>
                        <li>ST elevation / new LBBB → <b>STEMI</b> → reperfusion (PCI &lt;90 min)</li>
                        <li>ST depression / T inversion / +troponin → <b>NSTEMI</b> → antithrombotic + GRACE risk stratify</li>
                        <li>Normal ECG + normal serial troponin + low risk → stress testing / CT coronary angiography</li>
                    </ol>
                </div>
            `,
            questions: [
                {
                    q: 'A 58-year-old man with exertional chest pain, a normal resting ECG and negative troponins is unable to exercise because of severe knee osteoarthritis. What is the most appropriate next investigation?',
                    options: ['Exercise treadmill ECG', 'Dobutamine stress echocardiography', 'Resting echocardiography', 'Coronary CT calcium score only'],
                    answer: 1,
                    explanation: 'When a patient cannot exercise, use a pharmacological stress test — dobutamine stress echo (or vasodilator MPI) — to provoke and image ischaemia.'
                },
                {
                    q: 'A patient with an inferior STEMI (ST elevation in II, III, aVF) becomes hypotensive after sublingual nitroglycerin. What is the most likely explanation?',
                    options: ['Anaphylaxis to nitrates', 'Right ventricular infarction', 'Acute mitral regurgitation', 'Pericardial tamponade'],
                    answer: 1,
                    explanation: 'Inferior MI often involves the RV, which is preload-dependent; nitrates drop preload and cause hypotension. Treat with IV fluids and avoid nitrates.'
                },
                {
                    q: 'A patient on a maximally tolerated statin after MI still has an LDL above target. What is the next step?',
                    options: ['Add ezetimibe', 'Add fenofibrate', 'Stop the statin and start a PCSK9 inhibitor', 'Add niacin'],
                    answer: 0,
                    explanation: 'After a maximal statin, add ezetimibe next; a PCSK9 inhibitor (e.g. evolocumab) is reserved for those still above target on statin + ezetimibe.'
                },
                {
                    q: 'On day 6 of unfractionated heparin a patient develops a 50% fall in platelets and a new DVT. What is the best management?',
                    options: ['Continue heparin and transfuse platelets', 'Stop heparin and start warfarin', 'Stop heparin and start argatroban', 'Stop heparin and observe'],
                    answer: 2,
                    explanation: 'This is heparin-induced thrombocytopenia (HIT) with thrombosis. Stop all heparin and start a non-heparin anticoagulant such as argatroban; never give warfarin or platelets acutely.'
                },
                {
                    q: 'An elderly man has severe aortic stenosis on echo but is completely asymptomatic with a normal ejection fraction. What is the most appropriate management?',
                    options: ['Immediate surgical valve replacement', 'TAVR within 2 weeks', 'Regular clinical and echo follow-up', 'Start a vasodilator to reduce afterload'],
                    answer: 2,
                    explanation: 'Asymptomatic severe AS with preserved EF is followed with serial echo; intervention (SAVR/TAVR) is indicated once symptomatic or EF declines.'
                },
                {
                    q: 'A 70-year-old with non-valvular atrial fibrillation, hypertension and diabetes (CHA2DS2-VASc score 4) needs stroke prevention. What is most appropriate?',
                    options: ['Aspirin alone', 'A direct oral anticoagulant (DOAC)', 'Rate control only', 'No antithrombotic therapy'],
                    answer: 1,
                    explanation: 'A CHA2DS2-VASc score of 2 or more (men) warrants oral anticoagulation; a DOAC is preferred over aspirin (ineffective for stroke prevention) and over warfarin in non-valvular AF.'
                },
                {
                    q: 'A patient with acute decompensated heart failure has pulmonary oedema, SpO2 86% and BP 155/95. What is the best initial management?',
                    options: ['Sit upright, oxygen/CPAP, IV furosemide and nitrates', 'Rapid large-volume IV fluid bolus', 'IV beta-blocker', 'Immediate intubation'],
                    answer: 0,
                    explanation: 'Acute cardiogenic pulmonary oedema is treated by sitting the patient up with oxygen/CPAP, IV loop diuretic and nitrates (if not hypotensive); fluids and IV beta-blockers worsen it.'
                },
                {
                    q: 'A haemodynamically stable patient has a regular narrow-complex tachycardia at 180/min (SVT). What is the first step?',
                    options: ['Vagal manoeuvres, then IV adenosine', 'Immediate synchronised cardioversion', 'IV amiodarone', 'Oral beta-blocker'],
                    answer: 0,
                    explanation: 'Stable SVT is treated first with vagal manoeuvres, then IV adenosine; synchronised cardioversion is reserved for haemodynamic instability.'
                }
            ]
        },
        {
            id: 'med-pulmonology',
            title: '02 — Pulmonology',
            title_en: 'Asthma · COPD · Pneumonia · PE · Pleural Disease',
            summaryHtml: `
                <h3>Asthma</h3>
                <ul>
                    <li>Reversible airflow obstruction; diagnose with spirometry <b>FEV₁/FVC &lt;0.7</b> + bronchodilator reversibility (↑FEV₁ ≥12% &amp; 200 mL)</li>
                    <li>Chronic step-up: <b>ICS-formoterol</b> (MART) — SABA-only no longer preferred → ICS+LABA → add LAMA/LTRA → biologic (anti-IgE omalizumab / anti-IL5) for severe eosinophilic</li>
                    <li>Residual cough worse lying down + morning hoarseness on ICS → coexisting <b>GERD</b> → add PPI</li>
                </ul>
                <table>
                    <thead><tr><th>Acute severity</th><th>Features</th></tr></thead>
                    <tbody>
                        <tr><td>Moderate</td><td>PEF 50–75%, talking normally</td></tr>
                        <tr><td>Severe</td><td>PEF 33–50%, RR ≥25, HR ≥110, can't complete sentences</td></tr>
                        <tr><td>Life-threatening</td><td>PEF &lt;33%, <b>silent chest</b>, cyanosis, exhaustion, <b>normal/rising CO₂</b>, bradycardia, hypotension</td></tr>
                    </tbody>
                </table>

                <h3>COPD</h3>
                <ul>
                    <li>Diagnosis: post-bronchodilator <b>FEV₁/FVC &lt;0.7</b> (non-reversible); smoking cessation is the single most important intervention</li>
                    <li>Inhaled step-up: LABA + LAMA; add <b>ICS</b> only if frequent exacerbations or blood eosinophilia</li>
                    <li>Chronic hypoxaemia (PaO₂ ≤55 mmHg, or ≤59 with cor pulmonale/polycythaemia) → <b>long-term oxygen therapy</b> — with smoking cessation, the only measures that improve survival</li>
                    <li><b>Exacerbation</b>: controlled O₂ (target SpO₂ 88–92%), nebulised bronchodilators, oral prednisolone, antibiotics if purulent sputum; persistent respiratory acidosis → <b>NIV (BiPAP)</b></li>
                </ul>

                <h3>Pneumonia</h3>
                <ul>
                    <li><b>CURB-65</b> (Confusion, Urea &gt;7, RR ≥30, BP &lt;90/60, age ≥65): 0–1 home, 2 ward, ≥3 consider ICU</li>
                    <li>CAP: outpatient amoxicillin; ward → <b>ceftriaxone + macrolide</b> (or respiratory fluoroquinolone)</li>
                    <li>Atypicals: <i>Legionella</i> (hyponatraemia, diarrhoea, urinary antigen), <i>Mycoplasma</i> (young, cold agglutinins), <i>Pneumocystis</i> (HIV, exertional desaturation)</li>
                </ul>

                <h3>Pulmonary Embolism &amp; Pleural Disease</h3>
                <ul>
                    <li><b>PE</b>: pleuritic pain + dyspnoea + tachycardia; two-level <b>Wells</b> → likely: <b>CT pulmonary angiography</b>; unlikely: D-dimer to exclude</li>
                    <li>Stable PE → anticoagulate (DOAC); massive/haemodynamically unstable → <b>thrombolysis</b>; anticoagulation contraindicated → IVC filter</li>
                    <li><b>Pleural effusion — Light criteria</b> = exudate if pleural/serum protein &gt;0.5, pleural/serum LDH &gt;0.6, or pleural LDH &gt;⅔ upper serum limit</li>
                    <li><b>Pneumothorax</b>: tension (deviated trachea, hypotension) → immediate needle decompression → chest drain</li>
                </ul>
                <div class="sum-callout">
                    <b>Algorithm — acute severe asthma</b>
                    <ol>
                        <li>O₂ to SpO₂ 94–98% + continuous/nebulised <b>SABA + ipratropium</b></li>
                        <li>Systemic corticosteroids early (oral = IV)</li>
                        <li>Poor response → <b>IV magnesium sulfate</b></li>
                        <li>Exhaustion, rising CO₂, silent chest → ICU / ventilation</li>
                    </ol>
                </div>
            `,
            questions: [
                {
                    q: 'A patient in the ED with acute severe asthma remains tachypnoeic and wheezy despite continuous nebulised salbutamol, ipratropium and IV hydrocortisone. What is the next appropriate step?',
                    options: ['IV magnesium sulfate', 'Oral montelukast', 'Empirical IV antibiotics', 'A long-acting beta-agonist inhaler'],
                    answer: 0,
                    explanation: 'When acute severe asthma fails to respond to bronchodilators and systemic steroids, IV magnesium sulfate is the next step.'
                },
                {
                    q: 'A patient with emphysematous COPD on LABA/LAMA has progressive dyspnoea, no exacerbations, and resting PaO₂ 54 mmHg. Which intervention improves survival?',
                    options: ['Add an inhaled corticosteroid', 'Long-term home oxygen therapy', 'Add a leukotriene receptor antagonist', 'Daily azithromycin'],
                    answer: 1,
                    explanation: 'In COPD with chronic hypoxaemia, long-term oxygen therapy (with smoking cessation) is the intervention shown to prolong survival.'
                },
                {
                    q: 'A 30-year-old woman develops sudden pleuritic chest pain and dyspnoea 5 days after a long flight; she is haemodynamically stable. After a high Wells score, what is the best diagnostic test?',
                    options: ['D-dimer', 'CT pulmonary angiography', 'Lower-limb venous ultrasound', 'Ventilation–perfusion scan'],
                    answer: 1,
                    explanation: 'With a high pre-test probability, go straight to CT pulmonary angiography; D-dimer is only useful to rule out PE when probability is low/intermediate.'
                },
                {
                    q: 'A patient with well-controlled asthma on inhaled corticosteroid still has a dry cough that is worse when lying down, with morning hoarseness. What should be added?',
                    options: ['A proton pump inhibitor', 'An additional short course of oral steroids', 'A long-acting muscarinic antagonist', 'An antihistamine'],
                    answer: 0,
                    explanation: 'Nocturnal cough with hoarseness suggests coexisting GERD; a PPI is appropriate.'
                },
                {
                    q: 'A patient with a COPD exacerbation has increased dyspnoea and purulent sputum. Besides bronchodilators and steroids, what oxygen strategy is correct?',
                    options: ['Controlled (low-flow) oxygen titrated to SpO2 88–92%', 'High-flow 100% oxygen', 'No oxygen unless SpO2 below 80%', 'Immediate non-invasive ventilation for everyone'],
                    answer: 0,
                    explanation: 'In COPD, give controlled oxygen targeting 88–92% to avoid CO2 retention; antibiotics are added when sputum is purulent. NIV is used for persistent respiratory acidosis.'
                },
                {
                    q: 'A patient with a confirmed pulmonary embolism is haemodynamically stable. What is the first-line treatment?',
                    options: ['A direct oral anticoagulant', 'Systemic thrombolysis', 'IVC filter', 'Aspirin'],
                    answer: 0,
                    explanation: 'Stable PE is treated with anticoagulation (a DOAC); thrombolysis is reserved for massive/haemodynamically unstable PE, and IVC filters for when anticoagulation is contraindicated.'
                },
                {
                    q: 'A unilateral pleural effusion is aspirated; the pleural-fluid-to-serum protein ratio is 0.7 with a high LDH. By Light criteria this is:',
                    options: ['A transudate', 'An exudate', 'A normal finding', 'A haemothorax'],
                    answer: 1,
                    explanation: 'A protein ratio above 0.5 or LDH ratio above 0.6 (Light criteria) defines an exudate, which has a different differential (infection, malignancy, TB) from a transudate.'
                }
            ]
        },
        {
            id: 'med-gastro',
            title: '03 — Gastroenterology & Hepatology',
            title_en: 'GI Bleed · Liver Disease · IBD · Pancreatitis · Biliary · GERD/PUD',
            summaryHtml: `
                <h3>Upper GI Bleeding</h3>
                <ul>
                    <li>Resuscitate first (restrictive transfusion target Hb ~7–8 g/dL); risk-score with <b>Glasgow-Blatchford</b> (pre-endoscopy) / Rockall (post)</li>
                    <li><b>Peptic ulcer bleed</b>: IV PPI + endoscopic haemostasis (adrenaline + clip/thermal); test &amp; treat <i>H. pylori</i></li>
                    <li><b>Variceal bleed</b> in cirrhosis: the step with the greatest <b>mortality benefit</b> is prophylactic <b>IV ceftriaxone</b> (prevents SBP/sepsis) — plus terlipressin/octreotide + band ligation</li>
                </ul>

                <h3>Liver Disease</h3>
                <ul>
                    <li><b>Acute liver failure</b>: best <b>prognostic</b> marker is <b>PT/INR</b> (synthetic function), not the transaminase level; paracetamol → <b>N-acetylcysteine</b> (Rumack-Matthew nomogram at 4 h)</li>
                    <li><b>Decompensated cirrhosis</b> complications: <b>SBP</b> (ascitic neutrophils ≥250 → cefotaxime + albumin), <b>hepatic encephalopathy</b> (lactulose + rifaximin, treat precipitant), <b>hepatorenal syndrome</b> (terlipressin + albumin), variceal bleeding</li>
                </ul>
                <table>
                    <thead><tr><th>Serology</th><th>Interpretation</th></tr></thead>
                    <tbody>
                        <tr><td>HBsAg +</td><td>Active hepatitis B infection (acute or chronic)</td></tr>
                        <tr><td>Anti-HBs +</td><td>Immunity (vaccination or cleared infection)</td></tr>
                        <tr><td>Anti-HBc IgM +</td><td>Acute/recent infection</td></tr>
                        <tr><td>Isolated anti-HBc</td><td>Past infection / window period / occult</td></tr>
                    </tbody>
                </table>

                <h3>Inflammatory Bowel Disease</h3>
                <table>
                    <thead><tr><th>Feature</th><th>Ulcerative colitis</th><th>Crohn disease</th></tr></thead>
                    <tbody>
                        <tr><td>Distribution</td><td>Continuous, rectum → colon</td><td>Skip lesions, mouth → anus</td></tr>
                        <tr><td>Depth / histology</td><td>Mucosal; crypt abscesses</td><td>Transmural; non-caseating granulomas</td></tr>
                        <tr><td>Complications</td><td>Toxic megacolon, ↑colorectal cancer</td><td>Fistulae, strictures, perianal disease</td></tr>
                    </tbody>
                </table>
                <ul>
                    <li><b>Acute severe UC</b> (≥6 bloody stools/day + systemic features, negative cultures) → <b>IV methylprednisolone</b>; rescue infliximab/ciclosporin if no response by day 3; colectomy for toxic megacolon/perforation</li>
                </ul>

                <h3>Pancreatico-Biliary</h3>
                <ul>
                    <li><b>Acute pancreatitis</b> (lipase &gt;3× ULN): cornerstone is <b>aggressive IV fluids</b> (Ringer lactate) + analgesia; antibiotics only for infected necrosis; gallstone + cholangitis → ERCP</li>
                    <li><b>Choledocholithiasis</b> (RUQ pain + jaundice + abnormal LFTs): best diagnostic = <b>MRCP</b>; therapeutic = ERCP</li>
                    <li><b>Ascending cholangitis</b> (Charcot triad: fever, jaundice, RUQ pain) → IV antibiotics + urgent biliary drainage (ERCP)</li>
                </ul>

                <h3>GERD &amp; PUD</h3>
                <ul>
                    <li><b>GERD</b>: lifestyle + PPI; <b>alarm features</b> (dysphagia, weight loss, anaemia, GI bleed, age &gt;55) → urgent endoscopy</li>
                    <li>Failed PPI with confirmed oesophagitis → 24-h pH study before considering fundoplication; Barrett oesophagus → surveillance endoscopy</li>
                    <li>Perforated/bleeding ulcer from chronic NSAIDs → most important prevention is <b>stop NSAIDs</b>; refractory PUD + diarrhoea + high gastrin → <b>Zollinger-Ellison</b></li>
                </ul>
                <div class="sum-callout">
                    <b>Algorithm — upper GI bleed in cirrhosis</b>
                    <ol>
                        <li>Resuscitate (restrictive transfusion, target Hb ~7–8 g/dL)</li>
                        <li><b>IV ceftriaxone</b> prophylaxis + IV terlipressin/octreotide</li>
                        <li>Endoscopy &lt;12 h → band ligation</li>
                        <li>Uncontrolled → balloon tamponade → TIPS</li>
                    </ol>
                </div>
            `,
            questions: [
                {
                    q: 'A cirrhotic patient is admitted with bleeding oesophageal varices. Besides endoscopic band ligation and a vasoactive drug, which intervention most reduces mortality?',
                    options: ['Prophylactic IV ceftriaxone', 'High-volume packed red cell transfusion', 'Proton pump inhibitor infusion', 'Fresh frozen plasma'],
                    answer: 0,
                    explanation: 'Prophylactic antibiotics (e.g. IV ceftriaxone) reduce infection and death in cirrhotic variceal bleeding and are a key mortality-reducing step.'
                },
                {
                    q: 'A patient with acute liver failure after paracetamol overdose has markedly raised ALT. Which laboratory parameter best reflects prognosis?',
                    options: ['ALT level', 'Prothrombin time / INR', 'Serum bilirubin alone', 'Alkaline phosphatase'],
                    answer: 1,
                    explanation: 'INR/PT reflects hepatic synthetic function and is the key prognostic marker; transaminase magnitude does not correlate with outcome.'
                },
                {
                    q: 'A patient has RUQ pain, jaundice and a dilated common bile duct on ultrasound with stones suspected but not clearly seen. What is the best diagnostic test?',
                    options: ['Repeat transabdominal ultrasound', 'MRCP', 'Diagnostic ERCP', 'CT abdomen without contrast'],
                    answer: 1,
                    explanation: 'MRCP is the best non-invasive test for choledocholithiasis; ERCP is reserved for therapy once a stone is confirmed or for cholangitis.'
                },
                {
                    q: 'A patient with severe ulcerative colitis (8 bloody stools/day, fever, raised CRP, negative stool cultures) is admitted. What is the first-line treatment?',
                    options: ['Oral mesalazine', 'IV methylprednisolone', 'Immediate colectomy', 'Oral antibiotics'],
                    answer: 1,
                    explanation: 'Acute severe UC is treated first with IV corticosteroids; infliximab or ciclosporin is rescue therapy if there is no response by ~day 3.'
                },
                {
                    q: 'A cirrhotic with ascites develops fever and abdominal pain; ascitic fluid shows 350 neutrophils/mm3. What is the diagnosis and treatment?',
                    options: ['Spontaneous bacterial peritonitis — IV cefotaxime', 'Tuberculous peritonitis — anti-TB therapy', 'Portal hypertension — propranolol', 'Observation only'],
                    answer: 0,
                    explanation: 'An ascitic neutrophil count of 250/mm3 or more diagnoses spontaneous bacterial peritonitis; treat empirically with IV cefotaxime (plus albumin).'
                },
                {
                    q: 'A patient develops profuse watery diarrhoea after antibiotics and stool is positive for Clostridioides difficile toxin. What is the first-line treatment?',
                    options: ['Oral vancomycin (or fidaxomicin)', 'Loperamide', 'Continue the original antibiotic', 'IV gentamicin'],
                    answer: 0,
                    explanation: 'C. difficile colitis is now treated first-line with oral vancomycin or fidaxomicin; stop the offending antibiotic and avoid antimotility agents.'
                },
                {
                    q: 'A 50-year-old presents with severe epigastric pain radiating to the back and a lipase 5x the upper limit. What is the most important initial therapy?',
                    options: ['Aggressive IV fluid resuscitation (Ringer lactate)', 'Immediate ERCP for all patients', 'Early broad-spectrum antibiotics', 'Urgent laparotomy'],
                    answer: 0,
                    explanation: 'Early aggressive IV fluid resuscitation is the cornerstone of acute pancreatitis; antibiotics are only for infected necrosis and urgent ERCP only for concurrent cholangitis.'
                }
            ]
        },
        {
            id: 'med-endocrine',
            title: '04 — Endocrinology',
            title_en: 'Diabetes & DKA · Thyroid · Adrenal · Pituitary · Bone',
            summaryHtml: `
                <h3>Diabetes Mellitus</h3>
                <ul>
                    <li><b>Diagnosis</b>: fasting ≥126 mg/dL (7.0 mmol/L), random ≥200 + symptoms, HbA1c ≥6.5%, or OGTT 2-h ≥200; young + autoantibodies + low C-peptide → T1DM</li>
                    <li><b>T2DM management</b>: lifestyle + <b>metformin</b> first-line; add <b>SGLT2 inhibitor</b> (CV/renal disease, HF) or <b>GLP-1 agonist</b> (obesity, ASCVD); target HbA1c ~7%</li>
                    <li><b>Complication screening</b>: annual retinopathy, nephropathy (ACR), foot/neuropathy; statin + ACEi for renoprotection</li>
                </ul>
                <table>
                    <thead><tr><th>Feature</th><th>DKA</th><th>HHS</th></tr></thead>
                    <tbody>
                        <tr><td>Type</td><td>T1DM (usually)</td><td>T2DM (elderly)</td></tr>
                        <tr><td>Glucose</td><td>&gt;250 mg/dL</td><td>&gt;600 mg/dL</td></tr>
                        <tr><td>Ketones / acidosis</td><td>Present; pH &lt;7.3, HCO₃ &lt;18</td><td>Absent/minimal; pH &gt;7.3</td></tr>
                        <tr><td>Osmolality</td><td>Variable</td><td>Markedly ↑ (&gt;320)</td></tr>
                        <tr><td>Treatment</td><td colspan="2">IV fluids + fixed-rate insulin + K⁺ replacement; treat precipitant</td></tr>
                    </tbody>
                </table>

                <h3>Thyroid Disorders</h3>
                <ul>
                    <li><b>Hyperthyroidism</b> (Graves most common): beta-blocker (symptoms) + antithyroid (<b>carbimazole/methimazole</b>; <b>PTU in 1st trimester</b>); definitive radioiodine/surgery</li>
                    <li><b>Thyroid storm</b>: beta-blocker → <b>PTU</b> → iodine (given <b>after</b> PTU) → hydrocortisone</li>
                    <li><b>Hypothyroidism</b>: levothyroxine; <b>pregnancy</b> increases requirement → raise dose to keep TSH in trimester target</li>
                    <li><b>Thyroid nodule</b>: TSH + ultrasound → <b>FNA</b> if suspicious features</li>
                </ul>

                <h3>Adrenal &amp; Pituitary</h3>
                <ul>
                    <li><b>Cushing syndrome</b>: ↑late-night salivary cortisol / failed low-dose dexamethasone suppression / ↑24-h urinary cortisol → then ACTH to localise (pituitary/ectopic vs adrenal)</li>
                    <li><b>Adrenal insufficiency</b>: fatigue, hypotension, ↓Na, ↑K, hyperpigmentation (primary/Addison) → <b>short Synacthen test</b> → hydrocortisone + fludrocortisone; <b>stress-dose</b> in illness; crisis → IV hydrocortisone + fluids</li>
                    <li><b>Primary hyperaldosteronism (Conn)</b>: resistant HTN + hypokalaemia → <b>aldosterone:renin ratio</b> → spironolactone/adrenalectomy</li>
                    <li><b>Phaeochromocytoma</b>: episodic headache, palpitations, sweating → plasma/urine metanephrines → <b>alpha-block before beta-block</b></li>
                    <li><b>Prolactinoma</b>: galactorrhoea, amenorrhoea → dopamine agonist (cabergoline); <b>Acromegaly</b> → IGF-1 + OGTT (fails to suppress GH)</li>
                </ul>

                <h3>Bone &amp; Calcium</h3>
                <ul>
                    <li><b>Osteoporosis</b> risk: post-menopause, steroids, <b>alcohol</b>, smoking, low BMI; DEXA T-score ≤−2.5 → <b>bisphosphonate</b> first-line (obesity is protective)</li>
                    <li><b>Primary hyperparathyroidism</b>: ↑Ca + ↑PTH ("stones, bones, groans, psychiatric moans") → parathyroidectomy if symptomatic</li>
                </ul>
                <div class="sum-callout">
                    <b>Algorithm — DKA management</b>
                    <ol>
                        <li>IV 0.9% saline resuscitation</li>
                        <li>Check K⁺ → if &lt;3.3 replace K and <b>hold insulin</b>; otherwise start fixed-rate insulin 0.1 U/kg/hr</li>
                        <li>Add potassium once K⁺ 3.3–5.3 with urine output</li>
                        <li>Switch fluids to dextrose-containing when glucose &lt;~14 mmol/L (250 mg/dL); treat the trigger</li>
                    </ol>
                </div>
            `,
            questions: [
                {
                    q: 'A patient in DKA has an initial serum potassium of 3.0 mmol/L. What is the most appropriate immediate action?',
                    options: ['Start the insulin infusion immediately', 'Replace potassium and delay insulin until K ≥3.3', 'Give IV sodium bicarbonate', 'Give a large insulin bolus'],
                    answer: 1,
                    explanation: 'Insulin drives potassium intracellularly; with K &lt;3.3 it can precipitate fatal hypokalaemia. Replace potassium first and hold insulin until K ≥3.3.'
                },
                {
                    q: 'A pregnant woman with known hypothyroidism has a rising TSH at her booking visit. What is the appropriate management?',
                    options: ['Stop levothyroxine', 'Increase the levothyroxine dose', 'Add methimazole', 'Reassure and recheck after delivery'],
                    answer: 1,
                    explanation: 'Levothyroxine requirements rise in pregnancy; the dose should be increased to keep TSH within the trimester-specific target.'
                },
                {
                    q: 'A 30-year-old presents with hyperthyroidism in the first trimester of pregnancy. Which antithyroid drug is preferred?',
                    options: ['Methimazole', 'Propylthiouracil', 'Radioactive iodine', 'Carbimazole'],
                    answer: 1,
                    explanation: 'PTU is preferred in the first trimester (methimazole is teratogenic early); switch to methimazole after the first trimester.'
                },
                {
                    q: 'Which of the following is a recognised risk factor for osteoporosis?',
                    options: ['Obesity', 'Chronic alcohol excess', 'High calcium intake', 'Regular weight-bearing exercise'],
                    answer: 1,
                    explanation: 'Alcohol excess (with smoking, steroids, low BMI and post-menopausal state) increases osteoporosis risk; higher body weight is relatively protective.'
                },
                {
                    q: 'A hyperthyroid patient develops fever, agitation, atrial fibrillation and heart failure after an infection. In what order are drugs given for thyroid storm?',
                    options: ['Beta-blocker + PTU, then iodine (after PTU), + hydrocortisone', 'Iodine first, then PTU', 'Radioactive iodine immediately', 'Levothyroxine'],
                    answer: 0,
                    explanation: 'Thyroid storm: beta-blocker for symptoms, PTU to block synthesis, iodine given AFTER PTU to block release, plus hydrocortisone; iodine before PTU can worsen it.'
                },
                {
                    q: 'A patient has resistant hypertension with unexplained hypokalaemia. What is the best screening test?',
                    options: ['Plasma aldosterone-to-renin ratio', '24-hour urinary cortisol', 'Plasma metanephrines', 'Renal ultrasound'],
                    answer: 0,
                    explanation: 'Resistant hypertension with hypokalaemia suggests primary hyperaldosteronism (Conn); screen with the aldosterone-to-renin ratio.'
                },
                {
                    q: 'A type 1 diabetic is found unconscious with a capillary glucose of 2.0 mmol/L. What is the immediate treatment?',
                    options: ['IV dextrose (or IM glucagon if no access)', 'Oral glucose gel', 'A bolus of insulin', 'Observation and recheck in 1 hour'],
                    answer: 0,
                    explanation: 'Severe hypoglycaemia with reduced consciousness needs IV dextrose (or IM glucagon if no IV access); oral treatment is unsafe when consciousness is impaired.'
                }
            ]
        },
        {
            id: 'med-nephrology',
            title: '05 — Nephrology & Electrolytes',
            title_en: 'AKI · CKD · Hyponatraemia · Hyperkalaemia · Acid–Base',
            summaryHtml: `
                <h3>Acute Kidney Injury</h3>
                <table>
                    <thead><tr><th>Category</th><th>Clue</th><th>Examples / action</th></tr></thead>
                    <tbody>
                        <tr><td>Pre-renal</td><td>↑urea:creatinine, <b>FeNa &lt;1%</b>, bland urine</td><td>Hypovolaemia, sepsis, HF → restore perfusion</td></tr>
                        <tr><td>Intrinsic (ATN)</td><td><b>Muddy-brown casts</b>, FeNa &gt;2%</td><td>Ischaemia, nephrotoxins (contrast, aminoglycosides)</td></tr>
                        <tr><td>Post-renal</td><td>Hydronephrosis on US</td><td>Stones, BPH, tumour → relieve obstruction</td></tr>
                    </tbody>
                </table>
                <ul>
                    <li>Contrast-induced nephropathy: best prevention is peri-procedure <b>isotonic IV hydration</b></li>
                    <li><b>Emergent dialysis (AEIOU)</b>: severe <b>A</b>cidosis · refractory <b>E</b>lectrolytes (hyperkalaemia) · <b>I</b>ntoxication · fluid <b>O</b>verload · <b>U</b>raemia (pericarditis/encephalopathy)</li>
                </ul>

                <h3>Chronic Kidney Disease</h3>
                <ul>
                    <li>Staged by eGFR + albuminuria; leading causes DM &amp; HTN</li>
                    <li><b>ACEi/ARB</b> renoprotective (accept ≤30% creatinine rise) + <b>SGLT2 inhibitor</b>; BP target individualised (~&lt;130/80)</li>
                    <li>Complications: anaemia (EPO + iron), renal bone disease (↑PO₄, ↓Ca, ↑PTH → phosphate binders + vit D), metabolic acidosis, hyperkalaemia</li>
                </ul>

                <h3>Sodium &amp; Potassium</h3>
                <table>
                    <thead><tr><th>Hyponatraemia by volume</th><th>Examples</th><th>Treatment</th></tr></thead>
                    <tbody>
                        <tr><td>Hypovolaemic</td><td>Vomiting/diarrhoea, diuretics</td><td>Isotonic (0.9%) saline</td></tr>
                        <tr><td>Euvolaemic</td><td>SIADH, hypothyroid</td><td>Fluid restriction (treat cause)</td></tr>
                        <tr><td>Hypervolaemic</td><td>HF, cirrhosis, nephrotic</td><td>Fluid + salt restriction</td></tr>
                    </tbody>
                </table>
                <ul>
                    <li>Correct hyponatraemia <b>slowly (&lt;8–10 mmol/L per 24 h)</b> to avoid osmotic demyelination; severe symptomatic (seizures) → 3% hypertonic saline</li>
                    <li><b>Hypokalaemia</b>: weakness, U waves → replace K (+ Mg); <b>hyperkalaemia</b>: peaked T waves → see algorithm</li>
                </ul>
                <div class="sum-callout">
                    <b>Algorithm — severe hyperkalaemia</b>
                    <ol>
                        <li><b>IV calcium gluconate</b> — cardiac membrane stabilisation (first)</li>
                        <li><b>Insulin + dextrose</b> (± nebulised salbutamol) — shift K⁺ into cells</li>
                        <li>Sodium bicarbonate if acidotic</li>
                        <li>Elimination: loop diuretic / K-binder; <b>haemodialysis</b> if refractory</li>
                    </ol>
                </div>
            `,
            questions: [
                {
                    q: 'A patient has a serum potassium of 7.2 mmol/L with peaked T waves on ECG. What is the first drug to give?',
                    options: ['Insulin with dextrose', 'IV calcium gluconate', 'Nebulised salbutamol', 'Sodium polystyrene sulfonate'],
                    answer: 1,
                    explanation: 'IV calcium gluconate is given first to stabilise the myocardium; insulin/dextrose and salbutamol then shift potassium intracellularly.'
                },
                {
                    q: 'A hypovolaemic patient with vomiting has a sodium of 124 mmol/L. What is the appropriate initial treatment?',
                    options: ['Fluid restriction', 'Isotonic (0.9%) saline', 'Hypertonic 3% saline bolus', 'A vasopressin receptor antagonist'],
                    answer: 1,
                    explanation: 'Hypovolaemic hyponatraemia is corrected with isotonic saline; hypertonic saline is reserved for severe symptomatic (seizing) hyponatraemia, and correction must be slow.'
                },
                {
                    q: 'A diabetic with CKD and hypertension is started on an ACE inhibitor and the creatinine rises by 20%. What is the best action?',
                    options: ['Stop the ACE inhibitor immediately', 'Continue the ACE inhibitor and monitor', 'Switch to a calcium channel blocker', 'Halve the dose and add a diuretic'],
                    answer: 1,
                    explanation: 'A creatinine rise of up to ~30% after starting an ACEi/ARB is acceptable and expected; the drug is renoprotective and should be continued with monitoring.'
                },
                {
                    q: 'A patient with chronic hyponatraemia is corrected too rapidly and days later develops dysarthria and quadriparesis. What is the cause?',
                    options: ['Cerebral oedema', 'Osmotic demyelination syndrome', 'Wernicke encephalopathy', 'Subdural haematoma'],
                    answer: 1,
                    explanation: 'Over-rapid correction of chronic hyponatraemia (&gt;8–10 mmol/L/24 h) causes osmotic demyelination (central pontine myelinolysis).'
                },
                {
                    q: 'A patient with acute kidney injury has muddy-brown granular casts on urine microscopy and a fractional excretion of sodium above 2%. What is the diagnosis?',
                    options: ['Acute tubular necrosis', 'Prerenal azotaemia', 'Postrenal obstruction', 'Acute glomerulonephritis'],
                    answer: 0,
                    explanation: 'Muddy-brown granular casts with FeNa above 2% indicate intrinsic AKI from acute tubular necrosis; prerenal AKI has a FeNa below 1% and bland sediment.'
                },
                {
                    q: 'A patient with chronic kidney disease needs a contrast-enhanced CT. What best reduces the risk of contrast-induced nephropathy?',
                    options: ['IV isotonic fluid hydration before and after contrast', 'Prophylactic furosemide', 'Routine N-acetylcysteine alone', 'IV mannitol'],
                    answer: 0,
                    explanation: 'Peri-procedure isotonic IV hydration is the best-supported measure; diuretics and mannitol can worsen it and routine NAC is not reliably effective.'
                },
                {
                    q: 'Which finding is an indication for urgent (emergent) dialysis?',
                    options: ['Refractory hyperkalaemia or pulmonary oedema or uraemic pericarditis', 'Stable CKD with eGFR 40', 'Isolated proteinuria', 'Asymptomatic mildly raised urea'],
                    answer: 0,
                    explanation: 'Emergent dialysis indications (AEIOU): severe Acidosis, Electrolyte disturbance (refractory hyperkalaemia), Intoxication, Overload (pulmonary oedema), and Uraemia (pericarditis/encephalopathy).'
                }
            ]
        },
        {
            id: 'med-heme-onc',
            title: '06 — Haematology & Oncology',
            title_en: 'Anaemias · TTP/HUS/DIC · Leukaemias · Oncologic Emergencies',
            summaryHtml: `
                <h3>Anaemias</h3>
                <table>
                    <thead><tr><th>MCV</th><th>Causes</th><th>Key clue</th></tr></thead>
                    <tbody>
                        <tr><td>Microcytic</td><td>Iron deficiency, thalassaemia, ACD, sideroblastic</td><td>IDA: ↓ferritin, ↑TIBC, ↑RDW; β-thal trait: ↑HbA2, normal ferritin</td></tr>
                        <tr><td>Normocytic</td><td>Acute bleed, haemolysis, ACD, CKD, marrow failure</td><td>↑reticulocytes = bleeding/haemolysis</td></tr>
                        <tr><td>Macrocytic</td><td>B12/folate deficiency, alcohol, hypothyroid, myelodysplasia</td><td>B12: hypersegmented neutrophils + neuro signs</td></tr>
                    </tbody>
                </table>
                <ul>
                    <li>Always find the source of IDA — age &gt;45–50 with IDA and no obvious cause → <b>upper + lower GI endoscopy</b> (occult malignancy)</li>
                    <li><b>Sickle cell</b>: hydroxyurea (↑HbF) + prophylactic penicillin; vaso-occlusive crisis → analgesia + hydration + O₂; acute chest syndrome → antibiotics + exchange transfusion</li>
                </ul>

                <h3>Thrombocytopenia &amp; Microangiopathies</h3>
                <table>
                    <thead><tr><th>Condition</th><th>Features</th><th>Management</th></tr></thead>
                    <tbody>
                        <tr><td><b>ITP</b></td><td>Isolated ↓platelets, post-viral (children)</td><td>Observe / steroids / IVIG</td></tr>
                        <tr><td><b>TTP</b></td><td>MAHA + ↓platelets + neuro + renal + fever (ADAMTS13 ↓)</td><td>Urgent <b>plasma exchange</b>; avoid platelets</td></tr>
                        <tr><td><b>HUS</b></td><td>MAHA + ↓platelets + AKI (E. coli O157)</td><td>Supportive; avoid antibiotics</td></tr>
                        <tr><td><b>DIC</b></td><td>↓platelets, ↑PT/APTT, ↑D-dimer, ↓fibrinogen</td><td>Treat cause + FFP/platelets/cryo</td></tr>
                    </tbody>
                </table>
                <ul>
                    <li>Warfarin major bleed → <b>PCC + IV vitamin K</b>; DOAC → idarucizumab (dabigatran) / andexanet</li>
                </ul>

                <h3>Haematological Malignancies</h3>
                <ul>
                    <li><b>ALL</b> — children, marrow failure; <b>AML</b> — adults, Auer rods; <b>CLL</b> — elderly, mature lymphocytosis + <b>smudge cells</b>; <b>CML</b> — ↑↑WBC, <b>Philadelphia t(9;22)</b> → imatinib</li>
                    <li><b>Polycythaemia vera</b> (JAK2, aquagenic pruritus, splenomegaly) → venesection + aspirin; multiple myeloma → CRAB (hyperCalcaemia, Renal, Anaemia, Bone lesions) + paraprotein</li>
                </ul>

                <h3>Oncologic Emergencies</h3>
                <ul>
                    <li><b>Neutropenic sepsis</b>: fever + neutrophils &lt;0.5 → broad-spectrum antibiotics (piperacillin-tazobactam) within 1 h — an emergency</li>
                    <li><b>Tumour lysis syndrome</b> (post-chemo: ↑K, ↑PO₄, ↑urate, ↓Ca, AKI) → hydration + <b>rasburicase</b> (high risk) / allopurinol</li>
                    <li><b>Malignant spinal cord compression</b> → dexamethasone + urgent MRI + radiotherapy/surgery; <b>SVC obstruction</b> → dyspnoea, facial swelling → CT + treat tumour</li>
                    <li><b>Hypercalcaemia of malignancy</b> → IV fluids then bisphosphonate</li>
                </ul>
                <div class="sum-callout">
                    <b>Algorithm — microcytic anaemia</b>
                    <ol>
                        <li>Check ferritin → low = <b>iron deficiency</b> → find the source (GI workup if age &gt;45 or no obvious cause)</li>
                        <li>Normal/high ferritin + raised HbA2 → <b>β-thalassaemia trait</b></li>
                        <li>Consider anaemia of chronic disease (ferritin normal/high, low TIBC)</li>
                    </ol>
                </div>
            `,
            questions: [
                {
                    q: 'A patient on chemotherapy for bulky lymphoma develops AKI with high potassium, phosphate and uric acid and low calcium. What preventive agent is most appropriate for high-risk patients?',
                    options: ['Allopurinol only', 'Rasburicase', 'Loop diuretics', 'Calcium supplements'],
                    answer: 1,
                    explanation: 'This is tumour lysis syndrome; rasburicase (plus aggressive hydration) is preferred for high-risk patients, while allopurinol is used for lower-risk prophylaxis.'
                },
                {
                    q: 'A woman has fever, confusion, thrombocytopenia, microangiopathic haemolytic anaemia and renal impairment. What is the most appropriate urgent treatment?',
                    options: ['Platelet transfusion', 'Plasma exchange', 'Broad-spectrum antibiotics', 'High-dose aspirin'],
                    answer: 1,
                    explanation: 'The pentad suggests TTP; urgent plasma exchange is life-saving. Platelet transfusion is avoided unless life-threatening bleeding.'
                },
                {
                    q: 'A 62-year-old man is found to have iron-deficiency anaemia with no obvious bleeding source. What is the most important next investigation?',
                    options: ['Repeat full blood count in 3 months', 'Colonoscopy (and upper GI endoscopy)', 'Bone marrow biopsy', 'Serum erythropoietin'],
                    answer: 1,
                    explanation: 'Unexplained IDA in a patient over 45–50 must be investigated for GI malignancy with endoscopy/colonoscopy.'
                },
                {
                    q: 'A neutropenic patient on chemotherapy spikes a fever of 38.5°C. What is the most important immediate action?',
                    options: ['Wait for blood culture results', 'Start broad-spectrum IV antibiotics within 1 hour', 'Give paracetamol and observe', 'Give G-CSF alone'],
                    answer: 1,
                    explanation: 'Neutropenic sepsis is an emergency — empirical broad-spectrum antibiotics (e.g. piperacillin-tazobactam) within an hour, after taking cultures.'
                },
                {
                    q: 'A patient on warfarin presents with a major gastrointestinal bleed and an INR of 6. What is the best reversal strategy?',
                    options: ['Prothrombin complex concentrate plus IV vitamin K', 'Oral vitamin K alone', 'Fresh frozen plasma given slowly only', 'Stop warfarin and observe'],
                    answer: 0,
                    explanation: 'Life-threatening warfarin-related bleeding is reversed rapidly with prothrombin complex concentrate plus IV vitamin K; FFP is slower and less effective.'
                },
                {
                    q: 'An elderly patient is found to have a marked mature lymphocytosis with smudge cells on the blood film. What is the most likely diagnosis?',
                    options: ['Chronic lymphocytic leukaemia', 'Chronic myeloid leukaemia', 'Acute lymphoblastic leukaemia', 'A reactive lymphocytosis'],
                    answer: 0,
                    explanation: 'Mature lymphocytosis with smudge (smear) cells in an older adult is characteristic of CLL, confirmed by flow cytometry.'
                },
                {
                    q: 'A patient has a high haemoglobin, generalised itching after a hot shower, splenomegaly and a JAK2 mutation. What is the mainstay of treatment?',
                    options: ['Therapeutic phlebotomy plus low-dose aspirin', 'Iron supplementation', 'Anticoagulation alone', 'Observation'],
                    answer: 0,
                    explanation: 'Polycythaemia vera is managed with venesection (target haematocrit below 0.45) and low-dose aspirin, with cytoreduction (hydroxycarbamide) in high-risk patients.'
                }
            ]
        },
        {
            id: 'med-infectious',
            title: '07 — Infectious Disease & Sepsis',
            title_en: 'Sepsis & Septic Shock · Meningitis · Endocarditis · TB · HIV',
            summaryHtml: `
                <h3>Sepsis &amp; Septic Shock</h3>
                <ul>
                    <li><b>Sepsis-6 (surviving sepsis)</b>: <i>take</i> blood cultures, lactate, urine output; <i>give</i> O₂, IV broad-spectrum antibiotics &lt;1 h, IV crystalloid 30 ml/kg</li>
                    <li><b>Septic shock</b>: persistent hypotension after fluids (or lactate ≥4) → <b>norepinephrine</b> (first-line vasopressor) targeting MAP ≥65; add vasopressin then hydrocortisone if refractory</li>
                    <li><b>Source control</b>: drain abscess, remove infected line/device</li>
                </ul>

                <h3>Meningitis</h3>
                <table>
                    <thead><tr><th>CSF</th><th>Bacterial</th><th>Viral</th><th>TB</th></tr></thead>
                    <tbody>
                        <tr><td>Appearance</td><td>Turbid</td><td>Clear</td><td>Fibrin web</td></tr>
                        <tr><td>Cells</td><td>↑↑ neutrophils</td><td>↑ lymphocytes</td><td>↑ lymphocytes</td></tr>
                        <tr><td>Glucose</td><td>Low</td><td>Normal</td><td>Very low</td></tr>
                        <tr><td>Protein</td><td>High</td><td>Normal/↑</td><td>Very high</td></tr>
                    </tbody>
                </table>
                <ul>
                    <li>LP promptly (CT first only if focal deficit / ↓GCS / papilloedema / seizure); do <b>not</b> delay antibiotics for imaging</li>
                    <li>Empirical: <b>ceftriaxone + vancomycin + dexamethasone</b>; add <b>ampicillin</b> for Listeria risk (elderly, immunosuppressed, neonates); meningococcal contacts → ciprofloxacin prophylaxis</li>
                </ul>

                <h3>Endocarditis, TB &amp; HIV</h3>
                <ul>
                    <li><b>Infective endocarditis</b>: fever + new murmur; <b>Duke criteria</b>; blood cultures ×3 + echo (TOE) → prolonged IV antibiotics; surgery for HF, abscess, large vegetation or resistant organism</li>
                    <li><b>Tuberculosis</b>: <b>2 months RIPE</b> (rifampicin, isoniazid, pyrazinamide, ethambutol) → <b>4 months RI</b>; watch hepatotoxicity, isoniazid → give pyridoxine, ethambutol → optic neuritis</li>
                </ul>
                <table>
                    <thead><tr><th>HIV CD4 count</th><th>Prophylaxis</th></tr></thead>
                    <tbody>
                        <tr><td>&lt;200</td><td>Co-trimoxazole — <i>Pneumocystis</i> (PCP)</td></tr>
                        <tr><td>&lt;100</td><td>Co-trimoxazole also covers <i>Toxoplasma</i></td></tr>
                        <tr><td>&lt;50</td><td>Azithromycin — <i>Mycobacterium avium</i> complex</td></tr>
                    </tbody>
                </table>

                <h3>Occupational &amp; Stewardship</h3>
                <ul>
                    <li>Needlestick transmission risk: <b>HBV (~30%) ≫ HCV (~3%) ≫ HIV (~0.3%)</b>; start HIV PEP within hours if source high-risk</li>
                    <li><b>Necrotising fasciitis</b>: pain out of proportion, crepitus, systemic toxicity → <b>urgent surgical debridement</b> + broad-spectrum antibiotics</li>
                    <li><b>Stewardship</b>: de-escalate / stop antibiotics once culture-directed and clinically stable</li>
                </ul>
                <div class="sum-callout">
                    <b>Algorithm — suspected sepsis</b>
                    <ol>
                        <li>Take: blood cultures, lactate, urine output</li>
                        <li>Give: O₂, IV broad-spectrum antibiotics &lt;1 h, IV fluids 30 ml/kg</li>
                        <li>Persistent hypotension/lactate ≥4 → vasopressors (<b>norepinephrine</b>) targeting MAP ≥65</li>
                        <li>Source control (drain abscess, remove line)</li>
                    </ol>
                </div>
            `,
            questions: [
                {
                    q: 'A septic patient remains hypotensive (MAP 58 mmHg) after 30 ml/kg of crystalloid. What is the first-line vasopressor?',
                    options: ['Dopamine', 'Norepinephrine', 'Adrenaline', 'Phenylephrine'],
                    answer: 1,
                    explanation: 'Norepinephrine is the first-line vasopressor in septic shock; vasopressin and then hydrocortisone are added if it remains refractory.'
                },
                {
                    q: 'A healthcare worker sustains a needlestick from a source patient with unknown serology. Which bloodborne virus carries the highest transmission risk per exposure?',
                    options: ['HIV', 'Hepatitis C', 'Hepatitis B', 'Hepatitis A'],
                    answer: 2,
                    explanation: 'Hepatitis B has the highest per-exposure transmission risk (up to ~30% if e-antigen positive), far higher than HCV (~3%) or HIV (~0.3%).'
                },
                {
                    q: 'A patient with suspected bacterial meningitis has no focal neurological deficit, normal conscious level and no papilloedema. What is the best next step?',
                    options: ['CT head before any treatment', 'Lumbar puncture then empirical antibiotics + dexamethasone', 'Empirical antibiotics and discharge', 'MRI brain'],
                    answer: 1,
                    explanation: 'Without features of raised ICP/focal deficit, perform LP promptly; do not delay antibiotics + dexamethasone. CT first is reserved for those with red flags.'
                },
                {
                    q: 'A patient is diagnosed with new smear-positive pulmonary tuberculosis. What is the standard initial treatment?',
                    options: ['Rifampicin, isoniazid, pyrazinamide and ethambutol for 2 months, then rifampicin + isoniazid for 4 months', 'Rifampicin alone for 6 months', 'A macrolide for 2 weeks', 'No treatment if the patient is well'],
                    answer: 0,
                    explanation: 'Standard TB therapy is 2 months of RIPE (rifampicin, isoniazid, pyrazinamide, ethambutol) followed by 4 months of rifampicin + isoniazid.'
                },
                {
                    q: 'An HIV-positive patient has a CD4 count below 200 cells/mm3. Which prophylaxis is indicated?',
                    options: ['Co-trimoxazole against Pneumocystis pneumonia', 'Aciclovir against CMV', 'No prophylaxis is needed', 'Isoniazid against MAC'],
                    answer: 0,
                    explanation: 'At CD4 below 200, start co-trimoxazole prophylaxis against Pneumocystis jirovecii pneumonia (and Toxoplasma at lower counts).'
                },
                {
                    q: 'A diabetic has a rapidly spreading, exquisitely painful skin infection with crepitus, skin discolouration and systemic toxicity. What is the priority?',
                    options: ['Urgent surgical debridement plus broad-spectrum antibiotics', 'Oral flucloxacillin and discharge', 'Limb elevation only', 'Topical antibiotics'],
                    answer: 0,
                    explanation: 'Pain out of proportion, crepitus and systemic toxicity suggest necrotising fasciitis — a surgical emergency requiring immediate debridement plus broad-spectrum antibiotics.'
                }
            ]
        },
        {
            id: 'med-rheum-neuro',
            title: '08 — Rheumatology & Neurology',
            title_en: 'RA · SLE · Gout · GCA · Stroke · Intracranial Bleeds',
            summaryHtml: `
                <h3>Rheumatology</h3>
                <ul>
                    <li><b>Rheumatoid arthritis</b>: symmetric small-joint pain, morning stiffness, +anti-CCP/RF; <b>methotrexate</b> first-line DMARD → add a <b>biologic (anti-TNF, e.g. adalimumab)</b> if persistent erosive disease</li>
                    <li><b>SLE</b> (arthritis, malar rash, oral ulcers, serositis, low C3/C4, +ANA/anti-dsDNA): <b>hydroxychloroquine</b> for all; immunosuppression for organ involvement; <b>antiphospholipid syndrome</b> (recurrent VTE/miscarriage) → anticoagulation</li>
                    <li><b>Giant cell arteritis</b>: headache + jaw claudication + ↑ESR (vision threat) → <b>high-dose steroids immediately</b>, then temporal artery biopsy (stays positive for days)</li>
                    <li><b>Septic arthritis</b> (can't-miss): hot swollen joint + fever → <b>aspirate</b> before antibiotics; IV antibiotics + washout</li>
                    <li><b>Ankylosing spondylitis</b>: young man, inflammatory back pain, HLA-B27, bamboo spine → exercise + NSAIDs → anti-TNF</li>
                </ul>
                <table>
                    <thead><tr><th>Crystal</th><th>Microscopy</th><th>Management</th></tr></thead>
                    <tbody>
                        <tr><td><b>Gout</b> (urate)</td><td>Negatively birefringent needles</td><td>Acute: NSAID/colchicine/steroid; later urate-lowering (allopurinol)</td></tr>
                        <tr><td><b>Pseudogout</b> (CPPD)</td><td>Positively birefringent rhomboids</td><td>NSAID/colchicine/steroid; treat underlying cause</td></tr>
                    </tbody>
                </table>

                <h3>Neurology — Stroke &amp; Intracranial Bleeds</h3>
                <ul>
                    <li><b>Acute ischaemic stroke</b>: non-contrast CT to exclude bleed → <b>IV thrombolysis &lt;4.5 h</b> (no contraindication) ± <b>thrombectomy</b> for large-vessel occlusion &lt;6–24 h; then aspirin/clopidogrel, statin, manage risk factors</li>
                    <li><b>TIA</b>: ABCD² risk, start antiplatelet + imaging carotids; <b>SAH</b> → CT then LP for xanthochromia if CT negative &gt;6–12 h → nimodipine + coiling</li>
                </ul>
                <table>
                    <thead><tr><th>Bleed</th><th>CT appearance</th><th>Typical</th></tr></thead>
                    <tbody>
                        <tr><td>Epidural</td><td>Biconvex lens, no suture crossing</td><td>Lucid interval, middle meningeal artery</td></tr>
                        <tr><td>Subdural</td><td><b>Crescent</b>, crosses sutures</td><td>Elderly/alcoholic/anticoagulated, fall</td></tr>
                        <tr><td>Subarachnoid</td><td>Blood in basal cisterns</td><td>Thunderclap "worst headache", berry aneurysm</td></tr>
                    </tbody>
                </table>

                <h3>Neurology — Other Emergencies</h3>
                <ul>
                    <li><b>Status epilepticus</b>: ABC, glucose → IV lorazepam → IV levetiracetam/phenytoin → anaesthesia (RSI)</li>
                    <li><b>Neuromuscular respiratory failure</b> (GBS, myasthenic crisis): monitor <b>forced vital capacity</b> — falling FVC (~15 mL/kg or 1 L) prompts elective intubation before SpO₂ drops; treat with IVIG/plasma exchange</li>
                    <li><b>Malignant cord compression</b> (back pain + sensory level + weakness + bladder/bowel) → urgent <b>MRI spine</b> + dexamethasone</li>
                    <li><b>Headache red flags</b>: thunderclap, morning/valsalva-worsened, focal deficit, papilloedema, age &gt;50 with ↑ESR → image</li>
                </ul>
            `,
            questions: [
                {
                    q: 'A 72-year-old woman has a new temporal headache, jaw claudication and an ESR of 90 mm/hr. What is the most appropriate immediate management?',
                    options: ['Arrange temporal artery biopsy before treatment', 'Start high-dose corticosteroids immediately', 'Prescribe a triptan', 'Start prophylactic propranolol'],
                    answer: 1,
                    explanation: 'Giant cell arteritis threatens vision; start high-dose steroids immediately to prevent blindness, then arrange biopsy (which stays positive for days).'
                },
                {
                    q: 'A patient with rheumatoid arthritis has persistent active, erosive disease despite an adequate trial of methotrexate. What is the next step?',
                    options: ['Add a TNF-alpha inhibitor (biologic)', 'Switch to long-term oral steroids', 'Stop all therapy and observe', 'Add high-dose NSAIDs only'],
                    answer: 0,
                    explanation: 'When conventional DMARD therapy (methotrexate) fails to control RA, a biologic such as an anti-TNF agent is added.'
                },
                {
                    q: 'An elderly man on warfarin presents with progressive confusion 3 weeks after a fall. CT shows a crescent-shaped extra-axial collection crossing suture lines. What is the diagnosis?',
                    options: ['Epidural haematoma', 'Subdural haematoma', 'Subarachnoid haemorrhage', 'Intraparenchymal haemorrhage'],
                    answer: 1,
                    explanation: 'A crescent-shaped collection that crosses sutures in an elderly/anticoagulated patient after trauma is a subdural haematoma (bridging vein rupture).'
                },
                {
                    q: 'A patient presents 3 hours after sudden left-sided weakness; CT excludes haemorrhage and there is no contraindication. What is the best treatment?',
                    options: ['Aspirin only', 'IV thrombolysis (alteplase/tenecteplase)', 'Warfarin', 'Observation for 24 hours'],
                    answer: 1,
                    explanation: 'Acute ischaemic stroke within 4.5 hours, with haemorrhage excluded and no contraindication, is treated with IV thrombolysis (± thrombectomy for large-vessel occlusion).'
                },
                {
                    q: 'A patient has an acutely hot, swollen first toe; aspiration shows negatively birefringent needle-shaped crystals. What is appropriate acute management?',
                    options: ['NSAID, colchicine or a short course of corticosteroid', 'Start allopurinol immediately', 'High-dose aspirin', 'IV antibiotics'],
                    answer: 0,
                    explanation: 'Acute gout is treated with an NSAID, colchicine or steroids; urate-lowering therapy (allopurinol) is started later and not initiated during an acute flare.'
                },
                {
                    q: 'A patient has a sudden "worst headache of my life"; a CT done 12 hours later is normal. What is the next step?',
                    options: ['Lumbar puncture looking for xanthochromia', 'Reassure and discharge', 'Start a triptan', 'MRI of the spine'],
                    answer: 0,
                    explanation: 'If CT is negative but subarachnoid haemorrhage is still suspected, perform LP after ~12 hours to detect xanthochromia.'
                },
                {
                    q: 'A patient with a neuromuscular crisis (Guillain-Barré or myasthenia) needs monitoring to decide on ventilation. Which bedside measure is most useful?',
                    options: ['Forced vital capacity (FVC)', 'Peak expiratory flow', 'Oxygen saturation alone', 'Respiratory rate alone'],
                    answer: 0,
                    explanation: 'Serial FVC best predicts neuromuscular respiratory failure; a falling FVC (around 15 mL/kg or 1 L) prompts elective intubation before SpO2 drops.'
                }
            ]
        }
    ]
};

export default medicine;
