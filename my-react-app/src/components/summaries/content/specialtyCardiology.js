// Cardiology — medical-track section of the summaries catalog.
// Mirrored for the slide viewer in backend/content/summaryHtml (keep the two in sync).
// Inline questions are copied from the SQB bank.
const specialtyCardiology = {
    id: "cardiology",
    title: "Cardiology",
    title_en: "SMLE Review — 10 Topics",
    icon: "shield-check",
    accent: "#a78bfa",
    intro: "A deeper cardiology pass for the SMLE: hypertension, acute coronary syndromes, stable chest pain, heart failure, atrial fibrillation, other arrhythmias, valve disease, pericardium and aorta, shock, and lipids with prevention.",
    subtopics: [
        {
            id: "crd-hypertension",
            title: "01 — Hypertension",
            title_en: "Confirm · drug choice · secondary causes · emergencies",
            summaryHtml: `
<h4 class="deck-topic">Confirm before you label</h4>
<ul>
<li>Use repeated, correctly measured readings. Office thresholds differ: <b>140/90</b> in many guidelines, <b>130/80</b> in the ACC/AHA guideline.</li>
<li>Confirm with <b>ambulatory (ABPM)</b> or home monitoring when the diagnosis is uncertain. <b>White-coat</b> = high in clinic, normal outside. <b>Masked</b> = normal in clinic, high outside.</li>
<li>Baseline work-up: kidney function, electrolytes, urinalysis and urine albumin, glucose, lipids, TSH, ECG.</li>
</ul>
<h4 class="deck-topic">Choosing the drug</h4>
<p>First line: <b>ACE inhibitor or ARB</b>, <b>dihydropyridine calcium channel blocker</b>, <b>thiazide or thiazide-like diuretic</b>. When pressure is well above target (stage 2), start two drugs from different classes. Never combine an ACE inhibitor with an ARB.</p>
<div class="deck-block deck-tbl"><table><thead><tr><th>Situation</th><th>Think</th></tr></thead><tbody>
<tr><td>Diabetes with albuminuria, or proteinuric CKD</td><td>ACE inhibitor or ARB</td></tr>
<tr><td>HF with reduced EF</td><td>ACEi/ARNI/ARB, evidence-based beta-blocker, MRA, SGLT2 inhibitor</td></tr>
<tr><td>Dry cough on an ACE inhibitor</td><td>Switch to an ARB such as losartan</td></tr>
<tr><td>Gout</td><td>Avoid thiazides if possible; losartan lowers urate</td></tr>
<tr><td>Pregnancy</td><td>Labetalol, nifedipine, methyldopa; no ACEi or ARB</td></tr>
<tr><td>Uncontrolled on two drugs</td><td>Check adherence, then complete the trio: RAS blocker + CCB + thiazide-like diuretic</td></tr>
<tr><td>Resistant despite three drugs including a diuretic</td><td>Look for secondary causes; usual add-on is spironolactone (watch K)</td></tr>
</tbody></table></div>
<h4 class="deck-topic">Secondary hypertension clues</h4>
<ul>
<li><b>Primary aldosteronism</b>: resistant pressure, low or low-normal K. Screen with the aldosterone-to-renin ratio.</li>
<li><b>Renovascular</b>: abdominal bruit, young woman (fibromuscular dysplasia), older atherosclerotic patient, flash pulmonary oedema, marked creatinine rise after an ACEi.</li>
<li><b>Phaeochromocytoma</b>: episodic headache, sweating, palpitations; metanephrines; alpha block before beta block.</li>
<li>Also: sleep apnoea, kidney parenchymal disease, coarctation (weak delayed femorals), NSAIDs, steroids, oestrogen pills.</li>
</ul>
<div class="sum-algo"><span class="sum-algo-title">Very high blood pressure</span><ol>
<li>Look for acute organ damage: brain, retina, heart, aorta, kidney.</li>
<li>No damage: oral drugs, gradual lowering, early follow-up.</li>
<li>Damage (emergency): IV titratable drug in a monitored bed; usually lower mean pressure by no more than about 25% in the first hour.</li>
<li>Exceptions with their own targets: aortic dissection (fast and low), intracerebral haemorrhage, ischaemic stroke.</li>
</ol></div>
<div class="sum-key"><span class="sum-key-title">نقاط امتحانية</span><ul>
<li>Uncertain office readings: confirm with ambulatory monitoring.</li>
<li>Diabetes with hypertension, especially with albuminuria: ACE inhibitor or ARB.</li>
<li>ACE inhibitor cough: change to an ARB.</li>
<li>On ARB plus CCB and still high: add a thiazide-like diuretic.</li>
</ul></div>`,
            questions: [
                {
                    "q": "A 60-year-old man is found to have elevated blood pressure during a routine checkup. He has no symptoms, and physical examination is unremarkable. ECG, CBC, electrolytes, renal function tests, and urine analysis are normal. Which of the following is the most appropriate next option in management?",
                    "options": [
                        "Request echocardiogram",
                        "Start antihypertensive medication",
                        "Perform ambulatory blood pressure measurement",
                        "Repeat office blood pressure measurement in 3 months"
                    ],
                    "answer": 2,
                    "explanation": "Core Concept: Office blood pressure measurements can be falsely elevated due to 'white-coat hypertension'. Current guidelines recommend out-of-office BP measurements to confirm the diagnosis of hypertension before initiating lifelong pharmacotherapy. Clinical Presentation: · Asymptomatic elevated BP in the clinic. Diagnosis: · First-line diagnostic plan: Repeated office BP measurements. · Gold standard: Ambulatory Blood Pressure Monitoring (ABPM) or Home Blood Pressure Monitoring (HBPM) to confirm sustained hypertension and rule out white-coat effect. Management: · Acute management: Order ABPM. · Gold standard long-term management: If ABPM confirms hypertension, initiate lifestyle modifications and antihypertensive medications based on the patient's overall cardiovascular risk profile.",
                    "source": "SMLE bank"
                },
                {
                    "q": "A 50-year-old newly diagnosed hypertensive patient was prescribed an ACE inhibitor and developed a dry cough. Which drug can he be switched to?",
                    "options": [
                        "Another ACE inhibitor",
                        "Losartan",
                        "Nifedipine",
                        "Bendroflumethiazide"
                    ],
                    "answer": 1,
                    "explanation": "ACE-inhibitor dry cough = BRADYKININ accumulation (ACE also degrades bradykinin) in 10-20%; it is a CLASS effect, so another ACEi will recur. Switch to an ARB (losartan) - blocks the receptor, does not affect bradykinin, keeps the renal/cardiac benefit. Also bradykinin-mediated: ANGIOEDEMA (rare, dangerous - ARBs only with caution afterwards).",
                    "source": "SMLE recall"
                },
                {
                    "q": "A 66-year-old man with hypertension comes to the clinic for a follow-up. He is currently taking a combination of losartan and amlodipine, which is failing to keep his blood pressure within target. Examination is unremarkable. His blood test and renal function profile were within the normal limits. What is the most appropriate next step assuming he has no relevant contraindications?",
                    "options": [
                        "Add ramipril 1.25mg od",
                        "Add atenolol 50mg od",
                        "Add doxazosin 1mg od",
                        "Add indapamide MR 1.5mg od"
                    ],
                    "answer": 3,
                    "explanation": "Core Concept: Stepwise pharmacological management of essential hypertension. When blood pressure remains uncontrolled on dual therapy (an ARB and a CCB), the guidelines recommend adding a thiazide-like diuretic. Clinical Presentation: · Hypertension: Typically asymptomatic, but can present with headaches, dizziness, or epistaxis. · Complications: Left ventricular hypertrophy, stroke, myocardial infarction, chronic kidney disease. Diagnosis: · First-line: Ambulatory or home blood pressure monitoring to confirm the diagnosis and rule out white-coat hypertension. · Gold standard: 24-hour ambulatory blood pressure monitoring (ABPM). Management: · Acute: Lifestyle modifications (DASH diet, sodium restriction, exercise, weight loss). · Long-term/Definitive: Step 1 (monotherapy), Step 2 (dual therapy), Step 3 (triple therapy: ACEi/ARB + CCB + Thiazide-like diuretic like indapamide). Step 4 involves considering spironolactone or alpha/beta-blockers for resistant hypertension.",
                    "source": "SMLE bank"
                },
                {
                    "q": "Known htn patient presented to the clinic after failed to reach target blood pressure. He is on amlodipine and losartan. His cbc and kidney function are normal. What to add",
                    "options": [
                        "Ace i",
                        "A blocker",
                        "Diuretic",
                        "BB"
                    ],
                    "answer": 2,
                    "explanation": "The standard third antihypertensive is a thiazide diuretic (CCB + ARB/ACE-I + diuretic) — don't combine an ARB with an ACE inhibitor. On CCB + ARB, not at target → add a diuretic.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A 60-year-old man is evaluated during a follow-up visit for management of newly diagnosed hypertension and diabetes mellitus started on metformin and gliclazide but not started on antihypertensive therapy. Physical examination is unremarkable (see lab results). Blood pressure 155/95 mmH Heart rate 80 /min BMI 32.5 kg/m2 Test Result Normal Values Blood urea nitrogen 5 2.8 to 8.9 mmol/L Creatinine 100 44-115 mol/L Random Glucose 6 3.9-5.5 mmol/L НА1C 6.9 4.7-5.6 % tf Protein Present absent Glucose Absent absent Which of the following is the most appropriate antihypertensive treatment for this patient?",
                    "options": [
                        "Lisinopril",
                        "Atenolol",
                        "Amlodipine",
                        "Hydrochlorothiazide"
                    ],
                    "answer": 0,
                    "explanation": "In a hypertensive DIABETIC with PROTEINURIA (diabetic nephropathy), an ACE INHIBITOR (e.g., lisinopril) — or an ARB — is FIRST-LINE: it lowers BP AND is RENOPROTECTIVE (reduces proteinuria, slows progression of diabetic kidney disease). Diabetic + hypertension + proteinuria → ACE inhibitor (or ARB).",
                    "source": "SMLE recall"
                }
            ],
        },
        {
            id: "crd-acs",
            title: "02 — Acute Coronary Syndromes: Decisions",
            title_en: "Reperfusion · NSTEMI timing · complications · HIT",
            summaryHtml: `
<h4 class="deck-topic">STEMI: open the artery</h4>
<ul>
<li>ECG within 10 minutes of arrival. Do not wait for troponin when ST elevation fits the story.</li>
<li><b>Primary PCI</b> is preferred: aim for first medical contact to device within about 90 minutes (about 120 when transfer is needed).</li>
<li>If timely PCI is not possible and symptoms started within 12 hours, give a <b>fibrinolytic</b> (door-to-needle about 30 minutes), then transfer for angiography.</li>
<li>Fibrinolysis is ruled out by: any previous intracranial haemorrhage, recent ischaemic stroke (within 3 months), intracranial tumour or vascular lesion, suspected dissection, active bleeding, recent major head or face trauma. PCI stays an option.</li>
<li>Typical symptoms with a <b>new left bundle branch block</b>: manage as a possible acute occlusion; urgent angiography. Sgarbossa criteria help read the ECG.</li>
</ul>
<h4 class="deck-topic">NSTEMI and unstable angina</h4>
<p>Aspirin, a P2Y12 inhibitor, an anticoagulant and a high-intensity statin. <b>No fibrinolytics.</b> Angiography is <b>immediate</b> for refractory pain, shock, acute heart failure, or dangerous ventricular arrhythmia; otherwise it is timed by risk score.</p>
<ul>
<li>Oxygen only for hypoxaemia. Nitrates are avoided with hypotension, RV infarction, or recent PDE-5 inhibitor use.</li>
<li>Delay beta-blockers in acute heart failure, shock, bradycardia or heart block.</li>
<li><b>RV infarct</b>: inferior MI, hypotension, raised JVP, clear lungs. Give careful fluids; no nitrates.</li>
</ul>
<h4 class="deck-topic">Mechanical complications</h4>
<div class="deck-block deck-tbl"><table><thead><tr><th>Complication</th><th>Clue (often first week)</th></tr></thead><tbody>
<tr><td>Papillary muscle rupture</td><td>Sudden pulmonary oedema, new mitral regurgitation, often after inferior MI</td></tr>
<tr><td>Septal rupture</td><td>New harsh holosystolic murmur at the left sternal edge, oxygen step-up in the RV</td></tr>
<tr><td>Free wall rupture</td><td>Tamponade or pulseless electrical activity</td></tr>
<tr><td>LV aneurysm (later)</td><td>Persistent ST elevation, heart failure, mural thrombus</td></tr>
<tr><td>Dressler syndrome (weeks)</td><td>Fever, pleuritic pain, pericardial rub</td></tr>
</tbody></table></div>
<h4 class="deck-topic">After the event</h4>
<p>Dual antiplatelet therapy (usually 12 months, adjusted for bleeding risk), high-intensity statin, ACE inhibitor or ARB, beta-blocker (strongest case with reduced EF), mineralocorticoid antagonist for low EF with heart failure or diabetes, smoking cessation, cardiac rehabilitation.</p>
<p><b>HIT</b>: platelets fall by about half, typically 5 to 10 days after starting heparin, often with new clots. Stop all heparin including flushes, start a non-heparin anticoagulant (for example argatroban), and test for PF4 antibodies. Do not start warfarin until platelets recover.</p>
<div class="sum-key"><span class="sum-key-title">نقاط امتحانية</span><ul>
<li>Previous stroke or other lytic contraindication pushes firmly towards angiography.</li>
<li>NSTEMI never receives fibrinolytics.</li>
<li>New murmur with sudden collapse after MI: think mechanical complication, get an echo.</li>
<li>Falling platelets on heparin: stop it and switch class.</li>
</ul></div>`,
            questions: [
                {
                    "q": "60 years old man complaining of rest chest pain, hypertension, and dyslipidemia. ECG shows no ST-segment elevation. Troponin is high. Most appropriate management:",
                    "options": [
                        "Aspirin, clopidogrel, heparin",
                        "Aspirin, clopidogrel, and thrombolysis",
                        "Beta-blocker and high-dose statin",
                        "Primary angioplasty"
                    ],
                    "answer": 0,
                    "explanation": "Rest pain with raised troponin and no ST elevation is NSTEMI. Initial treatment is dual antiplatelet therapy plus anticoagulation: aspirin, clopidogrel and heparin, followed by risk-based angiography. Thrombolysis is harmful in NSTEMI, and immediate primary PCI is for STEMI or very high-risk features.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A patient presents with typical chest pain and sweating. ECG shows sinus tachycardia with a NEW left bundle branch block; the previous ECG was normal. He has been started on aspirin, atorvastatin, nitroglycerin, a beta-blocker and morphine. Cardiac enzymes are pending. What is the next step?",
                    "options": [
                        "Intravenous lidocaine",
                        "Wait for cardiac enzymes",
                        "Coronary angiography",
                        "Discharge home"
                    ],
                    "answer": 2,
                    "explanation": "NEW LBBB + ischaemic chest pain = STEMI EQUIVALENT → IMMEDIATE angiography/PCI. NEVER wait for troponin — time is muscle. LBBB masks ST changes; use SGARBOSSA criteria. An OLD LBBB is not an indication.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A patient with ST-elevation on ECG and a previous stroke. What is the most appropriate management?",
                    "options": [
                        "CT angiography",
                        "Coronary angiography",
                        "Thrombolysis"
                    ],
                    "answer": 1,
                    "explanation": "A history of prior stroke raises concern for a contraindication to thrombolytic therapy due to hemorrhagic transformation risk; primary PCI via coronary angiography is the preferred reperfusion strategy in this setting.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A 59-year-old man has diabetes, hypertension, dyslipidemia and chronic renal impairment. He was admitted 5 days ago to the Coronary Care Unit for a non-ST-elevation myocardial infarction (NSTEMI). He is receiving unfractionated heparin. His labs upon admission were normal. Day 5 of his admission, labs as shown (see lab results). Test Result Normal Values Hb 13.1 130-170 g/L (Male) 120-160 g/L (Female) Platelets count 65 150-400 x 109/L WBC 10.3 4.5-10.5 x 109/L Creatinine 88 44-115 umol/L APTT 36 30-40 sec INR 1.1 0.8-1.2 Prothrombin time 11 10-13 sec Which of the following is the most likely cause of his thrombocytopenia?",
                    "options": [
                        "Immune thrombocytopenia (ITP)",
                        "Heparin induced thrombocytopenia (HIT)",
                        "Thrombotic thrombocytopenic purpura (TTP)",
                        "Disseminated intravascular coagulopathy (DIC)"
                    ],
                    "answer": 1,
                    "explanation": "A sudden and significant drop in platelets occurring 5 to 10 days after starting heparin therapy is the classic presentation of Heparin-Induced Thrombocytopenia (HIT). This is an allergic-like immune reaction to the drug that paradoxically increases the risk of forming new, dangerous blood clots.",
                    "source": "SMLE bank"
                },
                {
                    "q": "A 59-year-old man is admitted to the hospital with infero-lateral myocardial infarction. Which of the following medications would improve his survival?",
                    "options": [
                        "Hydrochlorothiazide",
                        "Metoprolol",
                        "Morphine",
                        "Warfarin"
                    ],
                    "answer": 1,
                    "explanation": "Core Concept: Beta-blockers are a cornerstone of post-myocardial infarction therapy. They reduce myocardial oxygen demand, limit infarct size, and decrease the incidence of lethal ventricular arrhythmias and adverse cardiac remodeling. Clinical Presentation: · Chest pain, dyspnea, diaphoresis, and ECG changes (ST-segment elevation or depression, T-wave inversions). · Complications: Cardiogenic shock, mechanical complications (e.g., papillary muscle rupture), and sudden cardiac death. Diagnosis: · First-line: 12-lead ECG and serial high-sensitivity troponins. · Gold Standard: Coronary angiography to identify and treat the culprit lesion. Management: · Acute: Reperfusion therapy (PCI or thrombolytics), dual antiplatelet therapy (DAPT), and anticoagulation. · Long-term/definitive: Oral beta-blockers (e.g., metoprolol, carvedilol), ACE inhibitors/ARBs, high-intensity statins, and aldosterone antagonists (if LVEF ≤ 40%) are proven to significantly improve long-term survival and reduce mortality post-MI.",
                    "source": "SMLE bank"
                }
            ],
        },
        {
            id: "crd-heart-failure",
            title: "03 — Heart Failure",
            title_en: "EF classes · NYHA · foundational drugs · add-ons",
            summaryHtml: `
<h4 class="deck-topic">Diagnosis</h4>
<ul>
<li><b>BNP or NT-proBNP</b> is most useful to rule out heart failure in a breathless patient. Raised by age, AF, kidney disease and PE; lowered by obesity.</li>
<li><b>Echocardiography</b> defines the type: reduced EF (40% or less), mildly reduced (41 to 49%), preserved (50% or more).</li>
<li><b>NYHA</b>: I no limitation; II slight limitation, symptoms with ordinary activity; III marked limitation, symptoms with less than ordinary activity; IV symptoms at rest.</li>
</ul>
<h4 class="deck-topic">Reduced EF: the foundation</h4>
<ul>
<li><b>ARNI</b> (or ACEi / ARB) + <b>beta-blocker</b> (bisoprolol, carvedilol, metoprolol succinate) + <b>MRA</b> + <b>SGLT2 inhibitor</b>. All improve outcomes.</li>
<li><b>Loop diuretic</b> relieves congestion; it has not been shown to reduce mortality.</li>
<li>Leave 36 hours between an ACE inhibitor and sacubitril-valsartan (angioedema).</li>
<li>MRA: check potassium and kidney function. Spironolactone gynaecomastia: change to eplerenone. High potassium: reduce or stop.</li>
</ul>
<h4 class="deck-topic">Add-ons</h4>
<div class="deck-block deck-tbl"><table><thead><tr><th>Option</th><th>When</th></tr></thead><tbody>
<tr><td>Ivabradine</td><td>EF 35% or less, sinus rhythm, rate 70 or more despite the highest tolerated beta-blocker dose</td></tr>
<tr><td>Hydralazine + nitrate</td><td>Persistent symptoms in Black patients, or RAS blockers cannot be used</td></tr>
<tr><td>Digoxin</td><td>Persistent symptoms or AF rate; fewer admissions, no survival gain</td></tr>
<tr><td>ICD</td><td>EF 35% or less despite months of therapy, with reasonable expected survival (wait after a recent MI)</td></tr>
<tr><td>Resynchronisation</td><td>Low EF with wide QRS, best with LBBB of 150 ms or more in sinus rhythm</td></tr>
</tbody></table></div>
<p><b>Avoid</b> in reduced EF: NSAIDs, diltiazem and verapamil, pioglitazone, class I antiarrhythmics.</p>
<h4 class="deck-topic">Preserved EF</h4>
<p>Typical patient: older, hypertensive, obese or diabetic, often in AF, with diastolic dysfunction. Use diuretics for congestion, an SGLT2 inhibitor, and treat pressure, rhythm and weight.</p>
<h4 class="deck-topic">Acute decompensation</h4>
<p>Sit upright, treat hypoxaemia (non-invasive ventilation for distress), <b>IV loop diuretic</b>, vasodilator if pressure allows. Search for the trigger: ischaemia, arrhythmia, infection, non-adherence, drugs. Hypotension with cold limbs means cardiogenic shock; do not start or increase a beta-blocker.</p>
<div class="sum-key"><span class="sum-key-title">نقاط امتحانية</span><ul>
<li>Symptoms of failure with normal EF: heart failure with preserved EF.</li>
<li>Orthopnoea with congestion in a known patient: decompensation.</li>
<li>Ivabradine needs sinus rhythm.</li>
<li>BNP is the quick blood test; echo is the key imaging test.</li>
</ul></div>`,
            questions: [
                {
                    "q": "A patient has shortness of breath and fatigue, with normal ejection fraction (EF 60% What is the most likely diagnosis?",
                    "options": [
                        "Restrictive cardiomyopathy",
                        "Constrictive pericarditis",
                        "Heart failure with preserved ejection fraction (HFpEF)"
                    ],
                    "answer": 2,
                    "explanation": "HFpEF: symptoms + EF >=50% + raised natriuretic peptides/structural change. Treat congestion with diuretics, control hypertension/AF; SGLT2 inhibitors improve outcomes.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A 45 old woman obese with hypertension, came complaining of exertional dyspnea. Echocardiogram shows LV hypertrophy with normal ejection fraction. What could be the diagnosis?",
                    "options": [
                        "High output heart failure",
                        "Heart failure with preserved EF",
                        "Restrictive cardiomyopathy",
                        "Dilated cardiomyopathy"
                    ],
                    "answer": 1,
                    "explanation": "Core Concept: Heart Failure with preserved Ejection Fraction (HFpEF) occurs when the left ventricle becomes stiff (often due to hypertrophy from chronic hypertension or obesity), impairing diastolic filling despite a normal ejection fraction. Clinical Presentation: · Exertional dyspnea, fatigue, orthopnea, peripheral edema. · Often seen in older, obese, hypertensive, or diabetic women. Diagnosis: · First-line tool: Echocardiography showing LVEF ≥ 50%, LV hypertrophy, left atrial enlargement, and diastolic dysfunction. · Gold standard: Elevated BNP/NT-proBNP and echocardiographic evidence of diastolic dysfunction; invasive hemodynamics if diagnosis is uncertain. Management: · Acute: Diuretics for volume overload. · Long-term/Definitive: SGLT2 inhibitors, MRAs, and strict management of comorbidities (HTN, obesity, AFib).",
                    "source": "SMLE bank"
                },
                {
                    "q": "A 58-year-old man known to have type 2 diabetes, hypertension, and ischemic heart disease works as a car mechanic. For the last 4 months, he has noticed exertional shortness of breath that interferes with his job but does not limit him from doing it; at rest he is fine. Which of the following is the NYHA class of his shortness of breath?",
                    "options": [
                        "Class I",
                        "Class II",
                        "Class III",
                        "Class IV"
                    ],
                    "answer": 1,
                    "explanation": "Slight limitation of physical activity with comfort at rest, where ordinary activity results in symptoms but does not prevent the activity, defines NYHA Class II.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A 61-year-old man comes to the clinic with a 2-day history of dyspnoea on exertion. He has long-standing hypertension. Which investigation is most appropriate?",
                    "options": [
                        "B-type natriuretic peptide (BNP)",
                        "C-reactive protein (CRP)",
                        "Creatinine kinase (CK)",
                        "Troponin T"
                    ],
                    "answer": 0,
                    "explanation": "Suspected heart failure → BNP/NT-proBNP first; a normal level effectively rules it out. Raised BNP → echocardiography. Troponin is for acute coronary syndrome, not chronic heart failure.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A patient admitted with heart failure was started on sacubitril/valsartan, spironolactone, and metoprolol, and discharged. On follow-up he is fully normal, asymptomatic, but labs show mild hyperkalemia (K 5.6). What to do?",
                    "options": [
                        "Discontinue sacubitril/valsartan",
                        "Reduced dose of spironolactone"
                    ],
                    "answer": 1,
                    "explanation": "For mild, asymptomatic hyperkalemia while on comprehensive GDMT, dose-adjusting the most likely contributing agent (the MRA spironolactone) is preferred over discontinuing the mortality-benefiting ARNI (sacubitril/valsartan).",
                    "source": "SMLE recall"
                }
            ],
        },
        {
            id: "crd-af",
            title: "04 — Atrial Fibrillation & Anticoagulation",
            title_en: "Stability · rate vs rhythm · stroke prevention · reversal",
            summaryHtml: `
<p>Irregularly irregular rhythm with no distinct P waves. Find triggers: hypertension, mitral disease, heart failure, <b>thyrotoxicosis</b> (check thyroid function), alcohol, infection, sleep apnoea, surgery.</p>
<div class="sum-algo"><span class="sum-algo-title">Approach</span><ol>
<li>Unstable (shock, ischaemia, acute pulmonary oedema caused by the rhythm): <b>synchronised cardioversion</b>.</li>
<li>Stable: control the rate, assess stroke risk, then decide about rhythm control.</li>
<li>Rate drugs: beta-blocker, or diltiazem / verapamil when EF is normal; digoxin as an add-on or when pressure limits other drugs.</li>
<li>Planned cardioversion with long or unknown duration: at least 3 weeks of anticoagulation or a transoesophageal echo first, and at least 4 weeks afterwards. The short-duration cut-off differs between guidelines (48 or 24 hours).</li>
</ol></div>
<ul>
<li><b>AF with heart failure and reduced EF</b>, stable: an evidence-based beta-blocker such as carvedilol; avoid diltiazem and verapamil.</li>
<li>A lenient resting rate target (below about 110) is acceptable if symptoms are mild and EF is preserved.</li>
</ul>
<h4 class="deck-topic">Stroke prevention</h4>
<ul>
<li><b>CHA2DS2-VASc</b>: heart failure, hypertension, age 75 or more (2 points), diabetes, stroke or TIA (2), vascular disease, age 65 to 74, female sex. Some newer guidance drops the sex point.</li>
<li>Anticoagulation is recommended at about 2 or more in men and 3 or more in women. Paroxysmal AF counts the same as persistent.</li>
<li>Aspirin is not an adequate substitute. A high bleeding score means correct the bleeding risks, not automatically stop.</li>
<li>A <b>DOAC</b> is preferred, except with a <b>mechanical valve</b> or <b>moderate to severe mitral stenosis</b>: use <b>warfarin</b>. Usual INR 2 to 3; many mechanical mitral valves need a higher range.</li>
</ul>
<h4 class="deck-topic">Major bleeding: reversal</h4>
<div class="deck-block deck-tbl"><table><thead><tr><th>Drug</th><th>Reversal</th></tr></thead><tbody>
<tr><td>Warfarin</td><td>4-factor PCC + IV vitamin K (plasma if PCC unavailable)</td></tr>
<tr><td>Dabigatran</td><td>Idarucizumab</td></tr>
<tr><td>Apixaban, rivaroxaban</td><td>Specific agent where available, or PCC</td></tr>
<tr><td>Unfractionated heparin</td><td>Protamine</td></tr>
</tbody></table></div>
<p>Warfarin interactions: enzyme inducers (rifampicin, carbamazepine) lower the INR; inhibitors (many azoles, macrolides, metronidazole, amiodarone) raise it.</p>
<div class="sum-key"><span class="sum-key-title">نقاط امتحانية</span><ul>
<li>Rheumatic mitral stenosis with AF: warfarin.</li>
<li>Urgent warfarin bleed: PCC works faster than plasma.</li>
<li>New AF with weight loss or tremor: thyroid tests.</li>
<li>Newly found irregular pulse in an older patient: confirm on ECG and address anticoagulation.</li>
</ul></div>`,
            questions: [
                {
                    "q": "A patient with heart failure and atrial fibrillation complains of palpitations, without acute decompensation. What is the most appropriate management?",
                    "options": [
                        "Carvedilol",
                        "Diltiazem",
                        "Digoxin"
                    ],
                    "answer": 0,
                    "explanation": "In heart failure with reduced ejection fraction and atrial fibrillation without acute decompensation, one of the evidence-based beta blockers proven to improve heart failure outcomes, such as carvedilol, is preferred over digoxin for rate control, since these beta blockers provide additional mortality benefit in heart failure.",
                    "source": "SMLE recall"
                },
                {
                    "q": "Elderly with a severe mitral stenosis secondary to rheumatic heart disease presents with atrial fibrillation. What is the best management for stroke prevention?",
                    "options": [
                        "Warfarin",
                        "Apixaban",
                        "Clopidogrel"
                    ],
                    "answer": 0,
                    "explanation": "Core Concept: Atrial fibrillation (AF) in the presence of moderate-to-severe mitral stenosis (valvular AF) carries a very high risk of thromboembolism. Vitamin K antagonists are the only approved anticoagulants for this specific population. Clinical Presentation: · Palpitations, dyspnea, fatigue, and signs of heart failure or systemic embolization (e.g., stroke). Diagnosis: · First-line tool: 12-lead ECG showing absent P waves and irregularly irregular R-R intervals. · Gold standard: Echocardiography to assess the severity of mitral stenosis and rule out left atrial appendage thrombus. Management: · Acute: Rate control (beta-blockers, calcium channel blockers, or digoxin) and immediate anticoagulation. · Long-term/Definitive: Warfarin (target INR 2.0-3.0) is the gold standard for stroke prevention in valvular AF. Direct oral anticoagulants (DOACs like apixaban) are contraindicated in moderate-to-severe rheumatic mitral stenosis.",
                    "source": "SMLE bank"
                },
                {
                    "q": "A 62-year-old woman with atrial fibrillation on warfarin develops a subdural hematoma. Her INR is 3.9, and she has already received vitamin K. The hematoma requires urgent surgical evacuation. What is the most appropriate next step in management?",
                    "options": [
                        "Restart warfarin",
                        "Fresh frozen plasma (FFP)",
                        "Activated Factor VII (rFVIIa)",
                        "4-Factor Prothrombin Complex Concentrate (PCC)"
                    ],
                    "answer": 3,
                    "explanation": "For life-threatening bleeding requiring urgent surgery in a warfarin-anticoagulated patient, 4-factor PCC provides the fastest and most complete reversal of anticoagulation, more rapidly than FFP, and is preferred over recombinant factor VIIa, which does not replace all the vitamin K-dependent factors.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A 61-year-old woman comes to the clinic complaining of palpitations. She has also noticed some weight loss over the last 2 months. On clinical examination, she has an irregularly irregular pulse and a fine tremor. Her ECG shows atrial fibrillation. Which of the following is the next most appropriate investigation to do?",
                    "options": [
                        "Carotid Ultrasound",
                        "Thyroid function tests",
                        "Exercise tolerance test",
                        "24 hours ECG monitoring"
                    ],
                    "answer": 1,
                    "explanation": "Core Concept: Secondary causes of Atrial Fibrillation, specifically Thyrotoxicosis (Hyperthyroidism). Clinical Presentation: · Palpitations, unintentional weight loss, fine tremor, and an irregularly irregular pulse (AFib). Diagnosis: · First-line: Thyroid Function Tests (TSH and Free T4) to evaluate for hyperthyroidism. TSH will be suppressed, and Free T4/T3 will be elevated. Management: · Acute management: Rate control (beta-blockers) for AFib symptoms. · Definitive management: Treat the underlying hyperthyroidism (e.g., Methimazole, radioactive iodine, or surgery), which often leads to the resolution of the secondary atrial fibrillation.",
                    "source": "SMLE bank"
                },
                {
                    "q": "A 31-year-old woman known to have rheumatic mitral stenosis recently developed atrial fibrillation, for which she was placed on warfarin therapy. What is the most appropriate target of the international normalized ratio (INR) range?",
                    "options": [
                        "<1.0",
                        "1.0-1.5",
                        "2.0-3.0",
                        ">3.0"
                    ],
                    "answer": 2,
                    "explanation": "Core Concept: Rheumatic mitral stenosis combined with atrial fibrillation creates a highly thrombogenic environment in the left atrium, significantly increasing the risk of systemic thromboembolism (e.g., ischemic stroke). Clinical Presentation: · Palpitations, dyspnea, fatigue, and risk of sudden focal neurological deficits. Diagnosis: · First-line: ECG confirming AFib and Echocardiography assessing MS severity and left atrial size. Management: · Acute/Long-term: Vitamin K Antagonists (Warfarin) are the gold standard and strictly indicated for patients with rheumatic mitral stenosis and AFib (Direct Oral Anticoagulants/DOACs are generally contraindicated or not recommended in moderate-to-severe rheumatic MS). The target INR for native valve AFib is typically 2.0-3.0. (A higher target of 2.5-3.5 is reserved for mechanical mitral valves or patients with recurrent emboli despite therapeutic INR).",
                    "source": "SMLE bank"
                }
            ],
        },
        {
            id: "crd-valves",
            title: "05 — Valves, Murmurs & Endocarditis",
            title_en: "Bedside patterns · surgery triggers · prophylaxis",
            summaryHtml: `
<div class="deck-block deck-tbl"><table><thead><tr><th>Lesion</th><th>Murmur and signs</th></tr></thead><tbody>
<tr><td>Aortic stenosis</td><td>Ejection systolic, right upper edge to carotids; slow-rising weak pulse; angina, syncope, dyspnoea</td></tr>
<tr><td>Aortic regurgitation</td><td>Early diastolic decrescendo, best leaning forward in expiration; collapsing pulse, wide pulse pressure, displaced apex</td></tr>
<tr><td>Mitral stenosis</td><td>Opening snap, mid-diastolic rumble at apex; mostly rheumatic; AF</td></tr>
<tr><td>Mitral regurgitation</td><td>Holosystolic at apex to axilla</td></tr>
<tr><td>Hypertrophic obstructive cardiomyopathy</td><td>Systolic ejection at left edge, jerky pulse; louder with Valsalva or standing, softer with squatting</td></tr>
<tr><td>Right-sided lesions</td><td>Generally louder with inspiration; pulmonary regurgitation is common after tetralogy of Fallot repair</td></tr>
</tbody></table></div>
<h4 class="deck-topic">When to intervene</h4>
<ul>
<li><b>Echo</b> is the test for any diastolic murmur or a symptomatic systolic murmur.</li>
<li><b>Severe symptomatic aortic stenosis</b>: valve replacement (surgical or transcatheter, chosen by age and risk). Medicines do not fix the obstruction; use vasodilators cautiously.</li>
<li><b>Severe aortic regurgitation</b>: operate for symptoms or falling LV function, or marked LV dilatation.</li>
<li><b>Mitral stenosis</b>: balloon commissurotomy when symptomatic, valve shape is suitable, with no left atrial clot and no significant regurgitation.</li>
<li><b>HCM</b>: beta-blocker first; avoid dehydration and strong vasodilators; assess sudden-death risk and screen family. Syncope in a young person with this murmur is a warning.</li>
</ul>
<h4 class="deck-topic">Rheumatic fever and endocarditis</h4>
<ul>
<li>Acute rheumatic carditis most typically causes <b>mitral regurgitation</b>; stenosis appears years later. Diagnosis uses the Jones criteria with evidence of recent streptococcal infection.</li>
<li>Endocarditis: fever plus murmur. Take <b>blood cultures before antibiotics</b>, then echo (transoesophageal is more sensitive, important for prosthetic valves). Use the Duke criteria.</li>
<li>Injection drug use: think tricuspid valve and <i>Staphylococcus aureus</i>.</li>
<li><b>Prophylaxis</b> is for the highest risk only: prosthetic valve or repair material, previous endocarditis, certain congenital heart disease, transplant valvulopathy. For dental work on gums or root tips: <b>amoxicillin 2 g</b> orally, 30 to 60 minutes before (adults, no penicillin allergy).</li>
</ul>
<div class="sum-key"><span class="sum-key-title">نقاط امتحانية</span><ul>
<li>Older patient with exertional syncope and ejection murmur: aortic stenosis.</li>
<li>Collapsing pulse with early diastolic murmur: aortic regurgitation.</li>
<li>Young patient, jerky pulse, syncope: hypertrophic obstructive cardiomyopathy.</li>
<li>Mechanical valve before a dental procedure: amoxicillin prophylaxis.</li>
</ul></div>`,
            questions: [
                {
                    "q": "A 78-year-old woman presents with exertional syncope. On examination, she has a slow-rising carotid pulse and a loud ejection systolic murmur at the upper right sternal edge, radiating to the carotids. Which of the following is the most likely cause of these findings?",
                    "options": [
                        "Mitral stenosis",
                        "Aortic stenosis",
                        "Mitral valve prolapse",
                        "Tricuspid regurgitation"
                    ],
                    "answer": 1,
                    "explanation": "A slow-rising carotid pulse combined with a loud ejection systolic murmur radiating to the carotids, and exertional syncope, is a classic presentation of severe aortic stenosis, in which a fixed, narrowed valve limits the ability to increase cardiac output during exertion.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A 25-year-old college student comes for a routine checkup with no active complaints. Examination reveals a diastolic murmur heard at the base of the heart, which increases when the patient leans forward in full expiration. Which of the following is the most likely diagnosis?",
                    "options": [
                        "Aortic stenosis",
                        "Mitral regurgitation",
                        "Aortic regurgitation",
                        "Tricuspid regurgitation"
                    ],
                    "answer": 2,
                    "explanation": "A diastolic murmur at the base of the heart that is accentuated by leaning forward and exhaling is the classic maneuver used to best hear aortic regurgitation, since it brings the aortic valve closer to the chest wall and increases the audibility of the regurgitant flow.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A 60-year-old man is evaluated in the clinic for a 6-month history of exertional shortness of breath. Clinical examination reveals a positive Corrigan's pulse, an early diastolic murmur at the left upper sternal border, and bilateral fine basal crepitations. Echocardiogram shows severe aortic regurgitation with an ejection fraction of 40%. Which of the following is the most appropriate treatment?",
                    "options": [
                        "Diuretics",
                        "Calcium channel blockers",
                        "Surgical valve replacement (AVR)",
                        "Angiotensin-converting enzyme (ACE) inhibitors"
                    ],
                    "answer": 2,
                    "explanation": "Severe symptomatic aortic regurgitation with reduced ejection fraction (below 50-55%) is a class I indication for surgical valve replacement, which is definitive, unlike medical therapy alone.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A patient with a mechanical valve and rheumatic heart disease is to undergo a dental procedure. What prophylaxis is appropriate?",
                    "options": [
                        "Erythromycin or azithromycin",
                        "Amoxicillin before the procedure",
                        "No treatment"
                    ],
                    "answer": 1,
                    "explanation": "Endocarditis prophylaxis is given ONLY to high-risk patients - prosthetic valve or prosthetic repair material, previous endocarditis, specified congenital heart disease, transplant valvulopathy - and ONLY for dental procedures involving gingival manipulation or oral mucosal perforation. Regimen: amoxicillin 2 g orally, 30-60 minutes before, single dose. Penicillin allergy: clindamycin, azithromycin, cephalexin or doxycycline. Emphasise oral hygiene.",
                    "source": "SMLE recall"
                },
                {
                    "q": "An 18-year-old boy presents with recurrent syncope with exercise. Physical examination showed normal JVP, jerky carotid pulsations and thrusting apex. There is an ejection systolic murmur, which is best heard in the left parasternal area that increases in intensity with standing and reduced during handgrip (see report). Blood pressure 110/70 mmHg Heart rate 76 /min Electrocardiogram: Shows left ventricular hypertrophy. Which of the following is the most likely diagnosis?",
                    "options": [
                        "Aortic stenosis",
                        "Pulmonary stenosis",
                        "Ventricular septal Defect",
                        "Hypertrophic obstructive cardiomyopathy"
                    ],
                    "answer": 3,
                    "explanation": "Core Concept: Hypertrophic Obstructive Cardiomyopathy (HOCM). Clinical Presentation: · Exertional syncope, angina, dyspnea, or sudden cardiac death in young athletes. · Harsh systolic murmur that increases with decreased preload (standing, Valsalva). Diagnosis: · First-line: ECG showing LVH and deep, narrow Q waves. · Gold standard: Echocardiogram showing asymmetric septal hypertrophy and systolic anterior motion (SAM) of the mitral valve. Management: · Acute: Beta-blockers or non-dihydropyridine CCBs to increase diastolic filling time. Avoid dehydration and strenuous exertion. · Long-term: ICD placement for primary prevention of sudden cardiac death if high-risk. Surgical myectomy or alcohol septal ablation for refractory symptoms.",
                    "source": "SMLE bank"
                }
            ],
        },
        {
            id: "crd-pericardium-aorta",
            title: "06 — Pericardium & Aorta",
            title_en: "Pericarditis · tamponade · constriction · dissection",
            summaryHtml: `
<h4 class="deck-topic">Acute pericarditis</h4>
<p>Sharp chest pain, worse lying down and on inspiration, eased by sitting forward. Friction rub. ECG: <b>widespread ST elevation with PR depression</b>. Usual treatment is an <b>NSAID plus colchicine</b> (after MI, aspirin is preferred). Viral causes are common; also uraemia, autoimmune disease, TB, cancer.</p>
<h4 class="deck-topic">Tamponade</h4>
<ul>
<li>Fluid in the pericardial space limits filling. <b>Beck triad</b>: hypotension, raised JVP, muffled sounds.</li>
<li><b>Pulsus paradoxus</b>, tachycardia, clear lungs; ECG low voltage or electrical alternans.</li>
<li>Test: urgent echo. Unstable: <b>pericardiocentesis</b> (surgical drainage after trauma or for aortic or cardiac rupture). IV fluid is only a bridge.</li>
<li>Uraemic pericarditis needs dialysis; haemodynamic compromise needs drainage.</li>
</ul>
<h4 class="deck-topic">Constriction</h4>
<ul>
<li>Stiff pericardium after <b>tuberculosis</b>, cardiac surgery, radiotherapy or repeated pericarditis.</li>
<li>Mostly right-sided congestion: oedema, ascites, raised JVP that rises on inspiration (<b>Kussmaul sign</b>), pericardial knock. Calcification may show on imaging.</li>
<li>Chronic symptomatic disease: pericardiectomy.</li>
</ul>
<h4 class="deck-topic">Aortic dissection</h4>
<ul>
<li>Sudden severe tearing pain to the back; hypertension or connective tissue disease; pulse or arm pressure difference, new aortic regurgitation, neurological signs, wide mediastinum.</li>
<li>The start is a <b>tear in the intima</b> that lets blood into the media.</li>
<li>Imaging: <b>CT angiography</b> if stable enough; transoesophageal echo at the bedside or in theatre if unstable.</li>
<li>First drug: <b>IV beta-blocker</b> (aim heart rate about 60 and systolic about 100 to 120), analgesia, then a vasodilator if still high. A vasodilator alone first increases shear.</li>
<li><b>Type A</b> (ascending aorta): emergency surgery. <b>Type B</b>: medical, with intervention for malperfusion, rupture or refractory symptoms.</li>
</ul>
<h4 class="deck-topic">Abdominal aortic aneurysm</h4>
<p>Risk: older male smoker. Rupture: abdominal or back pain, hypotension, pulsatile mass; unstable patients with a known or ultrasound-confirmed aneurysm go straight to repair. Ultrasound is the screening test.</p>
<div class="sum-key"><span class="sum-key-title">نقاط امتحانية</span><ul>
<li>Muffled sounds, high JVP, low pressure: tamponade; drain it.</li>
<li>Old TB with right-sided congestion: constrictive pericarditis.</li>
<li>Tearing pain with wide mediastinum: dissection.</li>
<li>In dissection, control heart rate before adding a vasodilator.</li>
</ul></div>`,
            questions: [
                {
                    "q": "Patient with hypertension, diabetes, dyslipidemia, and end-stage kidney disease presents with muffled heart sounds. Echocardiogram shows pericardial effusion. BP: 86/... (Was Frankly Hypotensive) What is the Most Appropriate Next Step?",
                    "options": [
                        "IV furosemide",
                        "Pericardiocentesis",
                        "Hemodialysis"
                    ],
                    "answer": 1,
                    "explanation": "Tamponade = obstructive shock → DRAIN IT. Beck's triad, pulsus paradoxus, electrical alternans. NEVER give diuretics or vasodilators — they drop preload and can kill. Uraemia is a classic cause.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A 65-year-old woman comes to the ER complaining of sudden epigastric pain radiating to the back. X-ray shows a widened mediastinum. What is the diagnosis?",
                    "options": [
                        "Aortic dissection",
                        "Esophageal rupture",
                        "GERD",
                        "Pancreatitis"
                    ],
                    "answer": 0,
                    "explanation": "Tearing pain radiating to the back combined with a widened mediastinum on chest X-ray is the classic presentation and radiographic finding of aortic dissection.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A 38-year-old Indian man presents with progressive dyspnea for 3 months. He has past history of old tuberculosis. He has no other medical problems and not on any medications. His JVP was elevated and rises further on inspiration. Cardiac examination was normal with no murmurs. Blood pressure 105/60 mmH, Heart rate 120 /min, Oxygen saturation 93 %. Which of the following is the most likely diagnosis?",
                    "options": [
                        "Myocarditis",
                        "Corpulmonale",
                        "Cardiomyopathy",
                        "Constrictive Pericarditis"
                    ],
                    "answer": 3,
                    "explanation": "Core Concept: Constrictive pericarditis occurs when a thickened, fibrotic, and often calcified pericardium restricts the diastolic filling of the heart. In developing nations or endemic areas, prior tuberculosis is a leading cause. Clinical Presentation: · Signs of isolated right-sided heart failure: Elevated jugular venous pressure (JVP), hepatomegaly, ascites, and peripheral edema. · Kussmaul's sign: A paradoxical rise in JVP during inspiration. · Complications: Cardiac cirrhosis, severe cachexia, and low cardiac output syndrome. Diagnosis: · First-line: Echocardiography showing septal bounce, dilated IVC, and preserved systolic function. · Gold Standard: Cardiac MRI or CT scan demonstrating pericardial thickening (> 4 mm) and calcification. Management: · Acute: Diuretics for careful volume management (avoiding excessive preload reduction which can severely drop cardiac output). · Long-term/definitive: Surgical pericardiectomy (pericardial stripping) is the definitive treatment for symptomatic patients.",
                    "source": "SMLE bank"
                },
                {
                    "q": "A 52-year-old man develops sudden severe retrosternal chest pain that radiates to his back. Within minutes, he became unconscious. He is a heavy smoker and has history of hypertension. Blood pressure 85/56 mmHg Heart rate 92 /min. Which of the following is the most likely diagnosis?",
                    "options": [
                        "Vasovagal attacks",
                        "Pulmonary embolism",
                        "Tear in the aortic intima",
                        "Acute myocardial infarction"
                    ],
                    "answer": 2,
                    "explanation": "Core Concept: Acute Aortic Dissection (likely Type A involving the ascending aorta, given the rapid hemodynamic collapse, possibly from cardiac tamponade or aortic rupture). Clinical Presentation: · Sudden, severe, 'tearing' or 'ripping' chest pain radiating to the back, followed by rapid hemodynamic instability (hypotension, shock, syncope). Risk factors include chronic hypertension and smoking. · Complications: Aortic rupture, cardiac tamponade, acute aortic regurgitation, stroke, and death. Diagnosis: · First-line: Bedside echocardiography (to check for pericardial effusion/tamponade and aortic root dilation) or CT angiography of the chest if the patient is stable enough. · Gold standard: Transesophageal echocardiography (TEE) or CTA. Management: · Acute: Immediate fluid resuscitation and emergent surgical repair. (Note: While BP control with IV beta-blockers is standard for hypertensive dissection, this patient is hypotensive/shocky, requiring immediate surgical intervention).",
                    "source": "SMLE bank"
                },
                {
                    "q": "A 42-year-old man presented to the hospital complaining of shortness of breath, fever, and fatigue for the past few days. Examination showed he has high JVP, pulsus paradoxus, and distant heart sounds. Lung auscultation was clear (see reports). ECG: Low voltage. Chest X-ray: An increase in cardiac silhouette. Which area of the heart is most likely involved?",
                    "options": [
                        "Valves",
                        "Pericardium",
                        "Myocardium",
                        "Coronary arteries"
                    ],
                    "answer": 1,
                    "explanation": "Core Concept: The patient presents with classic signs of a large pericardial effusion leading to Cardiac Tamponade. The accumulation of fluid in the pericardial space restricts cardiac filling. Clinical Presentation: · Beck's Triad: Hypotension, Jugular Venous Distension (high JVP), and muffled/distant heart sounds. · Pulsus paradoxus (an exaggerated drop in systolic BP >10 mmHg during inspiration). Diagnosis: · First-line: ECG showing low QRS voltage and electrical alternans. CXR showing an enlarged, 'water-bottle' shaped cardiac silhouette. · Gold Standard: Transthoracic Echocardiography (TTE) showing pericardial fluid and right ventricular diastolic collapse. Management: · Acute: The Pericardium is the involved structure. Immediate management involves IV fluid resuscitation to maintain preload and urgent pericardiocentesis or a pericardial window to relieve the tamponade. · Long-term: Treat the underlying cause (e.g., viral pericarditis, malignancy, uremia, or bacterial infection).",
                    "source": "SMLE bank"
                }
            ],
        },
        {
            id: "crd-shock",
            title: "07 — Shock",
            title_en: "Four types · haemodynamics · first actions",
            summaryHtml: `
<p>Shock is inadequate tissue perfusion: hypotension or raised lactate with confusion, low urine output or abnormal skin. Sort it by the pump, the volume, the pipes and any obstruction.</p>
<div class="deck-block deck-tbl"><table><thead><tr><th>Type</th><th>Cardiac output</th><th>Vascular resistance</th><th>Wedge pressure</th></tr></thead><tbody>
<tr><td>Hypovolaemic</td><td>Low</td><td>High</td><td>Low</td></tr>
<tr><td>Cardiogenic (LV)</td><td>Low</td><td>High</td><td>High</td></tr>
<tr><td>Obstructive</td><td>Low</td><td>High</td><td>Depends: high in tamponade, normal or low in PE</td></tr>
<tr><td>Early septic</td><td>High (can fall later)</td><td>Low</td><td>Low or normal</td></tr>
<tr><td>Neurogenic</td><td>Low or normal</td><td>Low</td><td>Low or normal</td></tr>
</tbody></table></div>
<h4 class="deck-topic">Bedside clues</h4>
<ul>
<li><b>Hypovolaemic</b>: bleeding, vomiting, diarrhoea, burns; flat neck veins, cold skin, tachycardia (beta-blockers may hide it).</li>
<li><b>Cardiogenic</b>: large MI, acute mitral regurgitation, arrhythmia; raised JVP, crackles, cold limbs.</li>
<li><b>Obstructive</b>: tamponade, tension pneumothorax, massive PE; raised JVP. Treat the obstruction.</li>
<li><b>Septic</b>: infection with warm skin early on and bounding pulse.</li>
<li><b>Anaphylaxis</b>: wheeze, urticaria, swelling; <b>intramuscular adrenaline</b> first.</li>
<li><b>Neurogenic</b>: spinal cord injury with hypotension and bradycardia.</li>
</ul>
<div class="sum-algo"><span class="sum-algo-title">Septic shock bundle</span><ol>
<li>Measure lactate and take cultures without delaying treatment.</li>
<li>Broad-spectrum antibiotics, within 1 hour when shock is present.</li>
<li>Balanced crystalloid; about 30 mL/kg early for hypoperfusion, reassessing response, with caution in heart or kidney failure.</li>
<li><b>Noradrenaline</b> first-line vasopressor, aiming for mean pressure 65 mmHg.</li>
<li>Control the source. Consider hydrocortisone if vasopressor need continues.</li>
</ol></div>
<p><b>Definition</b>: septic shock is sepsis needing vasopressors to keep mean pressure at 65 or more, with lactate above 2 mmol/L despite adequate fluid.</p>
<h4 class="deck-topic">Bleeding patient</h4>
<p>Airway, two large-bore lines, crossmatch, restore volume and give blood for significant haemorrhage, correct coagulopathy, and stop the source. In suspected variceal bleeding add a vasoactive drug and antibiotics, resuscitate carefully with a restrictive transfusion strategy, and arrange endoscopy once stabilised. Resuscitation comes before diagnostic endoscopy.</p>
<div class="sum-key"><span class="sum-key-title">نقاط امتحانية</span><ul>
<li>Early septic shock: high output, low resistance.</li>
<li>Cardiogenic shock: low output, high filling pressure.</li>
<li>Postural drop with bleeding: fluid resuscitation first.</li>
<li>Persisting hypotension after fluid in sepsis: noradrenaline.</li>
</ul></div>`,
            questions: [
                {
                    "q": "A patient with pneumonia needs excessive fluid and norepinephrine to maintain a normal blood pressure. What is this condition?",
                    "options": [
                        "SIRS",
                        "Sepsis",
                        "Septicemia",
                        "Septic shock"
                    ],
                    "answer": 3,
                    "explanation": "Septic shock is specifically defined by the need for vasopressor support to maintain blood pressure despite adequate fluid resuscitation.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A patient with pneumonia develops sepsis/septic shock/ SIRS. Which of the following hemodynamic changes would most likely be seen?",
                    "options": [
                        "Increased cardiac output",
                        "Increased central venous pressure",
                        "Increased systemic vascular resistance"
                    ],
                    "answer": 0,
                    "explanation": "Septic shock from pneumonia is mainly distributive: inflammatory mediators dilate vessels and lower systemic vascular resistance. In the early, volume-resuscitated phase the heart compensates, so cardiac output is increased. Central venous pressure is usually low or normal because of venous pooling and capillary leak. This pattern separates sepsis from cardiogenic shock.",
                    "source": "SMLE recall"
                },
                {
                    "q": "An elderly patient presents with chest pain, shortness of breath, and hypotension. On examination, there is a systolic murmur radiating to the axilla. ECG shows ST elevation in leads V2–V4, and troponin is markedly elevated. What is the most likely cause of hypotension?",
                    "options": [
                        "Cardiogenic shock",
                        "Pulmonary embolism",
                        "septic shock"
                    ],
                    "answer": 0,
                    "explanation": "Core Concept: Acute myocardial infarction (anterolateral STEMI, indicated by V2-V4 ST elevation) can be complicated by mechanical complications such as papillary muscle rupture, leading to acute severe mitral regurgitation (systolic murmur radiating to the axilla) and subsequent cardiogenic shock. Clinical Presentation: Sudden hemodynamic collapse (hypotension, tachycardia, pulmonary edema) days after an MI, accompanied by a new holosystolic murmur. Complications include multi-organ failure and death. Diagnosis: First-line diagnostic tool is bedside transthoracic echocardiography (TTE), which will show severe mitral regurgitation, a flail leaflet, and reduced LV function. The gold standard for defining coronary anatomy is urgent cardiac catheterization. Management: Acute management involves hemodynamic support (inotropes, vasopressors, intra-aortic balloon pump) to stabilize the patient. Long-term/definitive management requires emergent surgical mitral valve repair or replacement, often combined with CABG.",
                    "source": "SMLE bank"
                },
                {
                    "q": "A 53-year-old man with liver cirrhosis presents with several episodes of haematemesis and melaena. Blood pressure: Supine 105/60 mmHg, Sitting 85/50 mmHg. Heart rate: Supine 90/min, Sitting 110/min. Which of the following is the most appropriate next step in management?",
                    "options": [
                        "Nasogastric tube placement",
                        "Urgent upper GI endoscopy",
                        "Resuscitation with adequate IV fluids",
                        "Intravenous infusion of H2 receptor antagonists"
                    ],
                    "answer": 2,
                    "explanation": "Upper GI bleed approach: 1) ABC + IV access x 2 + crossmatch. 2) Resuscitate (crystalloid, transfuse if Hb <7-8 or hemodynamically unstable). 3) If cirrhotic: IV octreotide + ceftriaxone. 4) Urgent endoscopy within 12h. 5) Variceal band ligation or sclerotherapy. 6) PPI IV for non-variceal.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A dehydrated patient has a very low blood pressure of approximately 50 mmHg systolic. What is the most likely diagnosis?",
                    "options": [
                        "Mild dehydration",
                        "Moderate dehydration",
                        "Severe dehydration",
                        "Hypovolemic shock"
                    ],
                    "answer": 3,
                    "explanation": "A severely low blood pressure indicating hemodynamic compromise, rather than dehydration alone, defines hypovolemic shock, the point at which fluid loss has become severe enough to cause inadequate tissue perfusion, distinguishing it from milder stages of dehydration that do not yet cause hypotension.",
                    "source": "SMLE recall"
                }
            ],
        },
        {
            id: "crd-stable-angina",
            title: "08 — Stable Chest Pain: Picking the Test",
            title_en: "Stress testing · imaging · vasospasm · therapy",
            summaryHtml: `
<p><b>Typical angina</b>: pressing retrosternal discomfort, brought on by exertion or stress, relieved by rest or nitrate. Rest pain that is new, prolonged or crescendo is an acute coronary syndrome until proved otherwise: no stress test.</p>
<h4 class="deck-topic">Which test</h4>
<p>Choice depends on pretest probability, ability to exercise, the resting ECG and local expertise. Newer guidelines favour <b>CT coronary angiography</b> or stress imaging; the plain exercise ECG is still a common exam answer for a patient who can exercise and has a normal resting ECG.</p>
<div class="deck-block deck-tbl"><table><thead><tr><th>Patient</th><th>Reasonable test</th></tr></thead><tbody>
<tr><td>Can exercise, interpretable ECG</td><td>Exercise ECG</td></tr>
<tr><td>Can exercise, uninterpretable ECG (baseline ST changes, digoxin, LVH with strain)</td><td>Exercise with imaging</td></tr>
<tr><td>Cannot exercise (arthritis, claudication, frailty)</td><td>Drug stress imaging (dobutamine echo or vasodilator perfusion)</td></tr>
<tr><td>LBBB or paced rhythm</td><td>Vasodilator perfusion imaging or CT angiography</td></tr>
<tr><td>High-risk result or refractory symptoms</td><td>Invasive coronary angiography</td></tr>
</tbody></table></div>
<ul>
<li>Vasodilator stress (adenosine, regadenoson) is avoided with active bronchospasm or high-grade AV block. Dobutamine is an alternative.</li>
<li>Do not stress: acute MI or unstable angina, symptomatic severe aortic stenosis, uncontrolled arrhythmia or heart failure, dissection, acute PE, acute myocarditis or pericarditis.</li>
</ul>
<h4 class="deck-topic">Treatment</h4>
<ul>
<li>Prognosis: antiplatelet, statin, pressure and glucose control, no smoking, exercise.</li>
<li>Symptoms: short-acting nitrate for attacks; beta-blocker or calcium channel blocker first line; then long-acting nitrate or other agents.</li>
<li>Revascularisation for symptoms despite therapy. Survival benefit is strongest with <b>left main</b> disease and extensive multivessel disease, especially with diabetes or low EF, where CABG is often preferred.</li>
</ul>
<h4 class="deck-topic">Vasospastic angina</h4>
<p>Rest pain, often at night or early morning, with <b>transient ST elevation</b> that settles; younger patients and smokers. After excluding obstructive disease: <b>calcium channel blocker</b> and nitrates, stop smoking. Avoid non-selective beta-blockers.</p>
<div class="sum-key"><span class="sum-key-title">نقاط امتحانية</span><ul>
<li>Cannot walk because of joint disease: pharmacological stress test.</li>
<li>Exertional pain, normal ECG, able to walk: exercise ECG is the classic answer.</li>
<li>Transient ST elevation with spasm: calcium channel blocker.</li>
<li>Never stress test an ongoing acute coronary syndrome.</li>
</ul></div>`,
            questions: [
                {
                    "q": "A 60-year-old man with a history of osteoarthritis of the left knee presents with chest pain on exertion relieved by rest. Resting ECG and cardiac enzymes are normal. Which of the following is the most appropriate next step in evaluation?",
                    "options": [
                        "Exercise stress ECG",
                        "Echocardiogram",
                        "CT coronary angiography",
                        "Dobutamine stress echocardiogram"
                    ],
                    "answer": 3,
                    "explanation": "His knee osteoarthritis likely limits his ability to achieve adequate exercise for a standard treadmill test, so pharmacologic stress testing (dobutamine stress echo) is more appropriate than exercise stress ECG.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A 38-year-old man has episodic chest pain. He states that the pain feels like tightness, located right behind his sternum, lasts less than 3 minutes and is relieved with rest. He takes no medications. He has no family history of coronary disease and has never smoked. His ECG in the office is normal. What is the most appropriate test to exclude cardiac ischemia?",
                    "options": [
                        "Cardiac CT",
                        "Exercise ECG",
                        "Resting echocardiogram",
                        "Creatine kinase enzyme"
                    ],
                    "answer": 1,
                    "explanation": "Core Concept: Stable angina pectoris is characterized by predictable, exertional chest pain relieved by rest, caused by fixed atherosclerotic coronary artery stenosis. Clinical Presentation: · Retrosternal pressure or tightness lasting <10 minutes, triggered by physical exertion or emotional stress. · Complications: Acute coronary syndrome (MI) and sudden cardiac death. Diagnosis: · First-line: Resting 12-lead ECG (often normal when asymptomatic). · Gold Standard: For patients with an intermediate pre-test probability of CAD and a normal baseline ECG capable of exercising, an Exercise ECG (treadmill stress test) is the most appropriate initial non-invasive test to provoke and document ischemic ST-segment changes. Management: · Acute: Sublingual nitroglycerin for immediate symptom relief. · Long-term/definitive: Antianginal therapy (beta-blockers, calcium channel blockers), high-intensity statins, aspirin, and aggressive lifestyle modification.",
                    "source": "SMLE bank"
                },
                {
                    "q": "A 62-year-old man presents to Outpatient Clinic with recurrent episodes of steal chest tightness, which occurs mainly after heavy physical exertion. He has no chronic medical problems. Clinical examination and baseline ECG were normal. Which of the following is the most appropriate next step in diagnosis?",
                    "options": [
                        "Exercise ECG",
                        "Echocardiography",
                        "Coronary arteriography",
                        "Myocardial perfusion scintigraphy"
                    ],
                    "answer": 0,
                    "explanation": "Core Concept: Stable angina pectoris is caused by fixed atherosclerotic coronary artery stenosis leading to a predictable supply-demand mismatch of myocardial oxygen during exertion. Clinical Presentation: · Retrosternal chest tightness or pressure triggered by physical exertion or emotional stress, and relieved by rest or nitroglycerin. · Complications: Acute coronary syndrome (myocardial infarction) and sudden cardiac death. Diagnosis: · First-line: For patients with an intermediate pre-test probability of CAD, a normal baseline ECG, and the ability to exercise, an Exercise ECG (treadmill stress test) is the most appropriate initial non-invasive diagnostic test. · Gold Standard: Invasive coronary angiography to definitively visualize coronary anatomy and allow for percutaneous intervention. Management: · Acute: Sublingual nitroglycerin for symptom relief. · Long-term/definitive: Antianginal therapy (beta-blockers, calcium channel blockers), high-intensity statins, aspirin, and aggressive lifestyle modification.",
                    "source": "SMLE bank"
                }
            ],
        },
        {
            id: "crd-arrhythmias",
            title: "09 — Other Arrhythmias & Drug Toxicity",
            title_en: "SVT · pre-excitation · VT · bradycardia · digoxin",
            summaryHtml: `
<div class="sum-algo"><span class="sum-algo-title">Any tachycardia with a pulse</span><ol>
<li>Unstable: synchronised cardioversion.</li>
<li>Stable: is the QRS narrow or wide, regular or irregular?</li>
<li>Regular narrow: vagal manoeuvre, then <b>adenosine</b> by rapid IV push (6 mg, then 12 mg).</li>
<li>Regular wide: treat as ventricular tachycardia unless proved otherwise; antiarrhythmic such as amiodarone or procainamide.</li>
<li>No pulse (VF or pulseless VT): CPR and unsynchronised defibrillation.</li>
</ol></div>
<ul>
<li><b>SVT</b>: sudden regular narrow-complex rhythm, often 150 to 250 per minute, P waves hidden.</li>
<li><b>Torsades de pointes</b>: polymorphic VT with long QT; give <b>magnesium</b>, correct K, stop culprit drugs. Pulseless: defibrillate.</li>
<li><b>Wolff-Parkinson-White</b>: short PR, delta wave. In irregular wide-complex <b>pre-excited AF</b>, avoid AV-nodal blockers (adenosine, beta-blocker, diltiazem, verapamil, digoxin) and IV amiodarone; use procainamide or ibutilide, or cardiovert. Definitive treatment for symptomatic patients is <b>catheter ablation</b>.</li>
</ul>
<h4 class="deck-topic">Bradycardia and block</h4>
<div class="deck-block deck-tbl"><table><thead><tr><th>Block</th><th>ECG</th></tr></thead><tbody>
<tr><td>First degree</td><td>Long fixed PR, every P conducts</td></tr>
<tr><td>Mobitz I</td><td>PR lengthens then a beat drops; often benign</td></tr>
<tr><td>Mobitz II</td><td>Fixed PR with sudden dropped beats; pacemaker usually needed</td></tr>
<tr><td>Complete</td><td>P and QRS independent; pacemaker unless a reversible cause</td></tr>
</tbody></table></div>
<p>Symptomatic bradycardia: look for reversible causes (ischaemia, drugs, potassium, hypothyroidism), give <b>atropine</b> (check local protocol dose), then pacing or adrenaline / dopamine infusion.</p>
<h4 class="deck-topic">Digoxin toxicity</h4>
<ul>
<li>Nausea, vomiting, confusion, <b>visual disturbance</b> (blurred or yellow-tinted), almost any arrhythmia; atrial tachycardia with block and bidirectional VT are characteristic.</li>
<li>Risks: kidney impairment, old age, <b>low potassium</b> or magnesium, amiodarone, verapamil, some macrolides.</li>
<li>Stop the drug, check level and potassium; <b>digoxin-specific antibody</b> for dangerous arrhythmia, severe hyperkalaemia or organ compromise. High potassium is a marker of severe acute poisoning.</li>
</ul>
<h4 class="deck-topic">Hyperkalaemia on the ECG</h4>
<p>Peaked T waves, then flat P, wide QRS, sine wave. With ECG changes give <b>IV calcium</b> first to protect the heart, then shift and remove potassium.</p>
<div class="sum-key"><span class="sum-key-title">نقاط امتحانية</span><ul>
<li>Unstable tachycardia with a pulse: synchronised shock.</li>
<li>Narrow regular rate near 220 without P waves: SVT.</li>
<li>Visual symptoms and nausea on heart drugs: digoxin toxicity.</li>
<li>Do not block the AV node in pre-excited AF.</li>
</ul></div>`,
            questions: [
                {
                    "q": "A patient presents with an absent P wave, narrow QRS complex, and a ventricular rate of 220 bpm. What is the most likely rhythm?",
                    "options": [
                        "Atrial flutter",
                        "Ventricular tachycardia",
                        "Supraventricular tachycardia (SVT)"
                    ],
                    "answer": 2,
                    "explanation": "A narrow QRS complex tachycardia without clearly visible P waves at a very rapid rate is characteristic of supraventricular tachycardia; ventricular tachycardia typically shows a wide QRS complex, and atrial flutter classically shows a sawtooth flutter wave pattern.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A 45-year-old man presents to the ER with palpitations. Initially conscious and oriented, he then becomes less responsive, with his blood pressure dropping to 80/45 mmHg. ECG shows supraventricular tachycardia (SVT). Which of the following is the most appropriate immediate action?",
                    "options": [
                        "Pacemaker",
                        "Cardioversion",
                        "Propranolol",
                        "Radiofrequency ablation"
                    ],
                    "answer": 1,
                    "explanation": "An unstable tachyarrhythmia, here SVT with hypotension and decreased responsiveness, requires immediate synchronized electrical cardioversion, rather than pharmacologic rate or rhythm control, which is reserved for hemodynamically stable patients.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A 40-year-old woman presents to the Emergency Department with vomiting and generalized abdominal pain. She does not know her medications. She states that her vision has been slightly yellow tinged recently (see image). Blood pressure 90/50 mmHg, Heart rate 60 /min, Respiratory rate 16 /min, Temperature 37° C. Which of the following is the most likely diagnosis?",
                    "options": [
                        "Anterolateral MI",
                        "Digoxin toxicity",
                        "Hypokalaemia",
                        "Hypothermia"
                    ],
                    "answer": 1,
                    "explanation": "Core Concept: Digoxin toxicity occurs when serum concentrations of digoxin exceed therapeutic windows, often precipitated by renal insufficiency, electrolyte disturbances (hypokalemia), or drug interactions, leading to cardiac and neuro-gastrointestinal poisoning. Clinical Presentation: * Symptoms: Gastrointestinal distress (nausea, vomiting, abdominal pain), neurological complaints, and classic visual disturbances such as xanthopsia (yellow-tinged vision), alongside bradycardia. * Complications: Life-threatening cardiac arrhythmias (e.g., ventricular tachycardia, ventricular fibrillation, complete heart block) and hyperkalemia. Diagnosis: * First-line: 12-lead electrocardiogram (ECG) showing characteristic findings such as scooping of the ST segment (\"Salvador Dali mustache\"), atrial tachycardia with AV block, or sinus bradycardia. * Gold Standard: Serum digoxin level assay (interpreted alongside timing of last dose, potassium, and renal function). Management: * Acute: Discontinue digoxin immediately, correct electrolyte imbalances (especially potassium), and administer Digoxin-Specific Antibody Fragments (DigiFab) in cases of severe toxicity, hemodynamic instability, or life-threatening arrhythmias. * Definitive/Long-term: Careful titration of restarted medication doses, rigorous monitoring of renal function and serum drug levels, and patient education on toxicity signs.",
                    "source": "SMLE bank"
                }
            ],
        },
        {
            id: "crd-lipids-prevention",
            title: "10 — Lipids & Cardiovascular Prevention",
            title_en: "Statins · add-ons · side effects · lifestyle",
            summaryHtml: `
<h4 class="deck-topic">Who benefits from a statin</h4>
<ul>
<li>Established atherosclerotic disease (coronary, stroke or TIA, peripheral): <b>high-intensity statin</b>.</li>
<li>Very high LDL (190 mg/dL or more): high-intensity statin and think familial hypercholesterolaemia.</li>
<li>Most people with diabetes aged 40 to 75: at least moderate intensity, higher with extra risk.</li>
<li>Other primary prevention: estimate global risk and share the decision.</li>
</ul>
<p><b>High intensity</b>: atorvastatin 40 to 80 mg or rosuvastatin 20 to 40 mg daily. LDL targets differ between guidelines and have tightened: below 70 mg/dL (1.8 mmol/L) is a common exam figure for established disease, with below 55 mg/dL advised for very high risk by several bodies.</p>
<div class="sum-algo"><span class="sum-algo-title">LDL still above goal</span><ol>
<li>Check adherence and the dose actually taken.</li>
<li>Maximise the tolerated statin.</li>
<li>Add <b>ezetimibe</b>.</li>
<li>Consider a PCSK9-directed therapy if still high in a high-risk patient.</li>
</ol></div>
<h4 class="deck-topic">Adverse effects</h4>
<ul>
<li><b>Statin muscle symptoms</b>: check CK and thyroid function; review interactions (clarithromycin, azoles, some HIV drugs, gemfibrozil, grapefruit). Hold the statin for marked CK rise or rhabdomyolysis; mild symptoms can often be re-challenged at a lower dose or with another statin.</li>
<li>Liver enzymes are checked at baseline and when clinically indicated. Statins are generally stopped in pregnancy except in selected very high-risk cases.</li>
<li><b>Niacin</b>: flushing, high glucose and urate; no longer routinely used.</li>
<li><b>Fibrate with gemfibrozil + statin</b>: higher myopathy risk.</li>
</ul>
<h4 class="deck-topic">Triglycerides</h4>
<p>Look for diabetes, alcohol, obesity, hypothyroidism, kidney disease and drugs. At very high levels (around 500 mg/dL or more) the immediate concern is <b>pancreatitis</b>: very low fat diet, no alcohol, fibrate and/or omega-3 therapy. At moderate levels the statin and lifestyle come first.</p>
<h4 class="deck-topic">Lifestyle</h4>
<ul>
<li><b>Mediterranean-style</b> or DASH eating: vegetables, fruit, whole grains, legumes, nuts, fish, olive oil; less processed food and red meat.</li>
<li>Stop smoking: the single most powerful change for a smoker.</li>
<li>At least 150 minutes of moderate activity weekly, weight control, less salt, limit or avoid alcohol.</li>
<li>Aspirin is no longer routine for primary prevention.</li>
</ul>
<div class="sum-key"><span class="sum-key-title">نقاط امتحانية</span><ul>
<li>LDL high on a statin: add ezetimibe once the statin is optimised.</li>
<li>Muscle ache on a statin: think statin myopathy, check CK.</li>
<li>Flushing after a lipid drug: niacin.</li>
<li>Best diet answer for risk reduction: Mediterranean pattern.</li>
</ul></div>`,
            questions: [
                {
                    "q": "A 55-year-old man with type 2 diabetes mellitus is currently taking the maximum tolerated dose of a statin for dyslipidemia. His recent lipid profile shows high LDL. What is the most appropriate next step in management?",
                    "options": [
                        "Stop statin and start fibrates",
                        "Add ezetimibe to the current statin therapy",
                        "Switch to a lower dose of statin and monitor",
                        "Reassure and continuous same"
                    ],
                    "answer": 1,
                    "explanation": "Core Concept: In patients with high cardiovascular risk (e.g., Type 2 Diabetes) whose LDL cholesterol remains above target despite maximally tolerated statin therapy, guidelines recommend stepwise addition of non-statin lipid-lowering agents. Clinical Presentation: · Asymptomatic dyslipidemia, but carrying a high long-term risk for atherosclerotic cardiovascular disease (ASCVD). · Complications: Myocardial infarction, ischemic stroke, and peripheral arterial disease. Diagnosis: · First-line & Gold Standard: Fasting or non-fasting lipid panel to calculate ASCVD risk and track LDL-C levels against target thresholds (often < 70 mg/dL or < 55 mg/dL for very high-risk diabetics). Management: · Acute: Assess medication adherence and lifestyle factors (diet, exercise). · Long-term/definitive: Ezetimibe, a cholesterol absorption inhibitor, is the recommended first-line add-on therapy due to its proven cardiovascular benefit, safety profile, and low cost. If LDL remains uncontrolled after adding ezetimibe, a PCSK9 inhibitor (e.g., evolocumab) is the next step.",
                    "source": "SMLE bank"
                },
                {
                    "q": "A 45-year-old man under investigation for hypertension was prescribed a drug for his lipid disorder. One week later, he returned with intense facial flushing after taking the medication, which was completely relieved by taking a full dose of aspirin three times daily instead of a low dose once daily. Labs: HDL 0.72 (low), LDL 5.30 (high), total cholesterol 6.12 (high), triglycerides 2.20, ALT 35, CK 205. Which drug was he prescribed?",
                    "options": [
                        "Niacin",
                        "Clofibrate",
                        "Atorvastatin",
                        "Cholestyramine"
                    ],
                    "answer": 0,
                    "explanation": "Prostaglandin-mediated flushing is a classic niacin side effect, which can be reduced by pre-treating with aspirin, blocking prostaglandin synthesis; this is a well-known drug-side-effect pairing.",
                    "source": "SMLE recall"
                },
                {
                    "q": "Which diet is best to reduce cardiovascular risk?",
                    "options": [
                        "Ketogenic diet",
                        "Mediterranean diet including fruits, vegetables, and whole grains",
                        "Rely only on medication",
                        "Salt intake less than 2 g/day"
                    ],
                    "answer": 1,
                    "explanation": "Core Concept: Lifestyle and dietary modifications for the primary and secondary prevention of Atherosclerotic Cardiovascular Disease (ASCVD). Clinical Presentation: · Patient seeking dietary counseling for cardiovascular risk reduction. Diagnosis: · ASCVD risk assessment. Management: · Definitive management: The Mediterranean diet (rich in fruits, vegetables, whole grains, legumes, nuts, olive oil, and fish; low in red meat and processed foods) has the strongest, most robust evidence base (e.g., PREDIMED trial) for significantly reducing major cardiovascular events, myocardial infarction, and stroke compared to other dietary patterns.",
                    "source": "SMLE bank"
                }
            ],
        },
    ],
};

export default specialtyCardiology;
