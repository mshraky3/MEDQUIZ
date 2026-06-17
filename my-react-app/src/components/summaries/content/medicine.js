// Internal Medicine — section content for the continuous-scroll summaries page.
// Structured as subtopics, each with a high-yield summary (HTML using the
// .sum-doc conventions) followed by interactive questions. Sourced from the
// recall-derived study decks in /content + UpToDate/Harrison-level knowledge,
// with algorithms. Angle brackets are HTML-escaped (&lt; / &gt;). Questions are
// authored (no duplicates) with answer index (0-based) + explanation.

const medicine = {
    id: 'medicine',
    title: 'الباطنة',
    title_en: 'Internal Medicine',
    icon: '🩺',
    accent: '#22d3ee',
    intro: 'أهم مواضيع الباطنة عالية العائد في SMLE: القلب · الصدر · الجهاز الهضمي والكبد · الغدد · الكلى · الدم والأورام · الأمراض المعدية · الروماتيزم والأعصاب — مع الخوارزميات والأسئلة التفاعلية.',
    subtopics: [
        {
            id: 'med-cardiology',
            title: 'أمراض القلب',
            title_en: 'Cardiology',
            summaryHtml: `
                <h4>Ischaemic heart disease &amp; ACS</h4>
                <ul>
                    <li>Stable angina, normal resting ECG/enzymes → <b>exercise stress ECG</b>; unable to exercise (e.g. OA knee, PAD) → <b>dobutamine stress echo</b> / vasodilator MPI; uninterpretable ECG (LBBB, paced) → imaging stress test</li>
                    <li><b>ACS</b> = MONA-BASH (morphine, O2 if hypoxic, nitrates, aspirin, beta-blocker, ACEi, statin, heparin)</li>
                    <li><b>STEMI</b> → primary PCI within 90 min (or thrombolysis if PCI unavailable &amp; &lt;12 h); <b>NSTEMI/UA</b> → dual antiplatelet + anticoagulation + GRACE risk → early angiography if high risk</li>
                    <li>Inferior MI (II, III, aVF) + hypotension → suspect <b>RV infarct</b> → fluids, AVOID nitrates</li>
                </ul>
                <h4>Heart failure &amp; valves</h4>
                <ul>
                    <li><b>HFrEF</b> (EF ≤40%) mortality benefit: ACEi/ARB(or ARNI) + beta-blocker + MRA + <b>SGLT2 inhibitor</b>; loop diuretic for symptoms only</li>
                    <li>Concentric LVH + normal EF + HF symptoms → <b>HFpEF</b> (treat HTN/volume + SGLT2i)</li>
                    <li>Severe <b>aortic stenosis</b>: asymptomatic + normal EF → follow-up echo; symptomatic (syncope/angina/HF) → TAVR/SAVR</li>
                </ul>
                <h4>Arrhythmia, lipids, anticoagulation</h4>
                <ul>
                    <li><b>AF</b>: rate control (beta-blocker/CCB) + anticoagulate by <b>CHA₂DS₂-VASc</b>; unstable → synchronised cardioversion; suspect paroxysmal embolic source with normal resting ECG → <b>Holter monitor</b></li>
                    <li>On max-dose statin, LDL still above target → add <b>Ezetimibe</b> → then PCSK9 inhibitor (Evolocumab)</li>
                    <li><b>HIT</b>: platelets fall ~day 5–6 on heparin + new thrombosis → stop heparin, start <b>Argatroban</b> (NOT warfarin/platelets)</li>
                </ul>
                <div class="sum-callout">
                    <b>Algorithm — chest pain / suspected ACS</b>
                    <ol>
                        <li>ECG within 10 min + serial troponin</li>
                        <li>ST elevation → <b>STEMI</b> → reperfusion (PCI &lt;90 min)</li>
                        <li>ST depression / T inversion / +troponin → <b>NSTEMI</b> → antithrombotic + risk stratify</li>
                        <li>Normal ECG + normal troponin + low risk → stress testing</li>
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
            title: 'أمراض الجهاز التنفسي',
            title_en: 'Pulmonology',
            summaryHtml: `
                <ul>
                    <li><b>Asthma</b> (reversible obstruction): start an <b>inhaled corticosteroid</b> controller (SABA alone no longer preferred). Step-up: ICS → ICS+LABA → ↑ICS → add-on (LAMA/LTRA/biologic). Acute: O2 + SABA + ipratropium + systemic steroids; severe → <b>IV magnesium sulfate</b></li>
                    <li><b>Cough-variant asthma</b> on ICS with residual cough worse lying down + morning hoarseness → add <b>PPI</b> (GERD)</li>
                    <li><b>COPD</b> on LABA/LAMA, progressive dyspnoea, emphysema, no exacerbations + chronic hypoxaemia → <b>long-term home oxygen</b> (the only therapy + smoking cessation that improves survival); add ICS only if frequent exacerbations/eosinophilia</li>
                    <li><b>CAP</b>: CURB-65 for severity/disposition; ward → ceftriaxone + macrolide (or respiratory fluoroquinolone)</li>
                    <li><b>PE</b>: pleuritic pain + dyspnoea + tachycardia; Wells score → D-dimer (low risk) or <b>CT pulmonary angiography</b>; stable → anticoagulate (DOAC/LMWH); massive/unstable → thrombolysis</li>
                    <li><b>Pleural effusion</b>: Light's criteria distinguish exudate vs transudate; tap any new significant effusion</li>
                </ul>
                <div class="sum-callout">
                    <b>Algorithm — acute severe asthma</b>
                    <ol>
                        <li>O2 to SpO2 94–98% + continuous/nebulised <b>SABA + ipratropium</b></li>
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
            title: 'الجهاز الهضمي والكبد',
            title_en: 'Gastroenterology & Hepatology',
            summaryHtml: `
                <ul>
                    <li><b>Variceal bleeding</b> in cirrhosis: octreotide + endoscopic band ligation, but the step with the greatest <b>mortality benefit</b> is prophylactic <b>IV ceftriaxone</b> (prevents SBP/sepsis)</li>
                    <li><b>Acute liver failure</b>: the best <b>prognostic</b> marker is <b>PT/INR</b> (synthetic function), not the transaminase level</li>
                    <li><b>Paracetamol overdose</b>: N-acetylcysteine (± activated charcoal if early); Rumack-Matthew nomogram at 4 h</li>
                    <li><b>PUD / perforated duodenal ulcer</b> from chronic NSAIDs → most important prevention is <b>stop NSAIDs</b>; test &amp; treat H. pylori</li>
                    <li><b>Choledocholithiasis</b> (RUQ pain + jaundice + abnormal LFTs): best diagnostic = <b>MRCP</b>; therapeutic = ERCP</li>
                    <li><b>Severe ulcerative colitis</b> (≥6 bloody stools/day, systemic features, negative cultures) → <b>IV methylprednisolone</b>; rescue infliximab/ciclosporin if no response by day 3</li>
                    <li><b>GERD</b>: lifestyle + PPI; alarm features (dysphagia, weight loss, anaemia, age &gt;60) → endoscopy</li>
                </ul>
                <div class="sum-callout">
                    <b>Algorithm — upper GI bleed in cirrhosis</b>
                    <ol>
                        <li>Resuscitate (restrictive transfusion, target Hb ~7–8)</li>
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
            title: 'الغدد الصماء',
            title_en: 'Endocrinology',
            summaryHtml: `
                <ul>
                    <li><b>DM diagnosis</b>: fasting ≥126, random ≥200 + symptoms, or HbA1c ≥6.5%; young + autoantibodies + low C-peptide → T1DM</li>
                    <li><b>DKA</b>: IV fluids (0.9% NS) + insulin 0.1 IU/kg/hr; <b>delay insulin if K &lt;3.3</b> and replace potassium first; treat the precipitant</li>
                    <li><b>Thyroid</b>: hyper → beta-blocker + antithyroid (Methimazole; PTU in 1st trimester); hypo → levothyroxine; pregnancy with high TSH → increase levothyroxine</li>
                    <li><b>Cushing's</b>: ↑late-night salivary cortisol / failed dexamethasone suppression; ACTH-dependent (pituitary/ectopic) vs independent (adrenal)</li>
                    <li><b>Adrenal insufficiency</b>: fatigue, hypotension, ↓Na, ↑K, hyperpigmentation (primary) → short Synacthen test → hydrocortisone (stress-dose in illness)</li>
                    <li><b>Osteoporosis</b> risk: post-menopause, steroids, <b>alcohol</b>, smoking, low BMI; bisphosphonate first-line (obesity is protective)</li>
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
            title: 'الكلى والسوائل والكهارل',
            title_en: 'Nephrology & Electrolytes',
            summaryHtml: `
                <table>
                    <thead><tr><th>Hyponatraemia</th><th>Volume</th><th>Example</th></tr></thead>
                    <tbody>
                        <tr><td>Hypovolaemic</td><td>↓</td><td>vomiting/diarrhoea, diuretics</td></tr>
                        <tr><td>Euvolaemic</td><td>normal</td><td>SIADH, hypothyroid</td></tr>
                        <tr><td>Hypervolaemic</td><td>↑</td><td>HF, cirrhosis, hepatorenal syndrome</td></tr>
                    </tbody>
                </table>
                <ul>
                    <li><b>AKI</b>: pre-renal (↑urea:creatinine, FeNa &lt;1%) vs intrinsic (ATN, muddy-brown casts) vs post-renal (hydronephrosis → relieve obstruction)</li>
                    <li><b>CKD + DM + HTN</b>: tight BP target (≈ &lt;130/80, individualised); <b>ACEi/ARB</b> renoprotective (accept ≤30% creatinine rise); add SGLT2i</li>
                    <li>Correct hyponatraemia slowly (&lt;8–10 mmol/L per 24 h) to avoid osmotic demyelination</li>
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
            title: 'أمراض الدم والأورام',
            title_en: 'Haematology & Oncology',
            summaryHtml: `
                <ul>
                    <li><b>Microcytic</b> = IDA (↓ferritin) / thalassaemia; <b>macrocytic</b> = B12/folate; always find the source of IDA (age &gt;45 + IDA → colonoscopy)</li>
                    <li><b>ITP</b> (post-viral, isolated thrombocytopenia) → steroids/IVIG; <b>TTP</b> (MAHA + thrombocytopenia + neuro/renal/fever) → urgent <b>plasma exchange</b>; <b>HUS</b> (E. coli O157, AKI) → supportive, no antibiotics; <b>DIC</b> → treat cause + FFP/platelets</li>
                    <li><b>Tumour lysis syndrome</b> (bulky lymphoma post-chemo: ↑K, ↑PO4, ↑uric acid, ↓Ca, AKI) → prevent with <b>Rasburicase</b> (high risk) or allopurinol + hydration</li>
                    <li><b>Sickle cell</b>: hydroxyurea (↑HbF) + prophylactic penicillin; vaso-occlusive crisis → analgesia + hydration + O2; acute chest → antibiotics + exchange transfusion</li>
                    <li><b>Neutropenic sepsis</b>: fever + neutrophils &lt;0.5 → broad-spectrum antibiotics (piperacillin-tazobactam) within 1 h — a medical emergency</li>
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
            title: 'الأمراض المعدية والإنتان',
            title_en: 'Infectious Disease & Sepsis',
            summaryHtml: `
                <ul>
                    <li><b>Sepsis-6 / surviving sepsis</b>: blood cultures + lactate, empirical antibiotics within 1 h, IV crystalloid 30 ml/kg; reassess</li>
                    <li><b>Septic shock</b>: after fluids the MAP stays low → start <b>Norepinephrine</b> (first-line vasopressor); add vasopressin then hydrocortisone if refractory</li>
                    <li><b>Meningitis</b>: LP (CT first only if focal deficit/↓GCS/papilloedema); empirical ceftriaxone + vancomycin + dexamethasone; add ampicillin if Listeria risk (elderly, immunosuppressed)</li>
                    <li><b>Infective endocarditis</b>: fever + new murmur; Duke criteria; blood cultures ×3 + echo → prolonged IV antibiotics</li>
                    <li>Needlestick transmission risk: <b>HBV ≫ HCV (~3%) ≫ HIV (~0.3%)</b></li>
                    <li><b>Stewardship</b>: de-escalate / stop unnecessary antibiotics once culture-directed and stable</li>
                </ul>
                <div class="sum-callout">
                    <b>Algorithm — suspected sepsis</b>
                    <ol>
                        <li>Take: blood cultures, lactate, urine output</li>
                        <li>Give: O2, IV broad-spectrum antibiotics &lt;1 h, IV fluids 30 ml/kg</li>
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
            title: 'الروماتيزم والأعصاب',
            title_en: 'Rheumatology & Neurology',
            summaryHtml: `
                <h4>Rheumatology</h4>
                <ul>
                    <li><b>RA</b> on methotrexate with persistent erosive disease → add a <b>biologic (anti-TNF, e.g. adalimumab)</b></li>
                    <li><b>SLE</b> (arthritis, oral ulcers, low C3/C4, +ANA/anti-dsDNA): <b>Hydroxychloroquine</b> for all; immunosuppression for organ involvement</li>
                    <li><b>Gout</b> (negatively birefringent needles) → NSAIDs/colchicine acute, urate-lowering (allopurinol) later; <b>Pseudogout</b> (positively birefringent rhomboids, CPPD)</li>
                    <li><b>Giant cell arteritis</b>: headache + jaw claudication + ↑ESR → <b>high-dose steroids immediately</b>, then temporal artery biopsy</li>
                </ul>
                <h4>Neurology</h4>
                <table>
                    <thead><tr><th>Bleed</th><th>CT</th><th>Typical</th></tr></thead>
                    <tbody>
                        <tr><td>Epidural</td><td>biconvex lens, no suture crossing</td><td>lucid interval, middle meningeal artery</td></tr>
                        <tr><td>Subdural</td><td><b>crescent</b>, crosses sutures</td><td>elderly/alcoholic, fall</td></tr>
                        <tr><td>SAH</td><td>blood in basal cisterns</td><td>thunderclap "worst headache"</td></tr>
                    </tbody>
                </table>
                <ul>
                    <li>Acute ischaemic stroke: CT to exclude bleed → <b>thrombolysis &lt;4.5 h</b> / thrombectomy for large-vessel occlusion</li>
                    <li>Cord compression (back pain + sensory level + weakness + bladder) → urgent <b>MRI spine</b> + steroids</li>
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
