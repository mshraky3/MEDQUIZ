// AUTO-COPIED from my-react-app/src/components/summaries/content/specialtyNephrology.js. Do not edit here:
// change the website's file, then run `npm run sync:summaries` in mobile/.
// Nephrology — medical-track section of the summaries catalog.
// Mirrored for the slide viewer in backend/content/summaryHtml (keep the two in sync).
// Inline questions are copied from the SQB bank.
const specialtyNephrology = {
    id: "nephrology",
    title: "Nephrology",
    title_en: "SMLE Review — 9 Topics",
    icon: "shield-check",
    accent: "#818cf8",
    intro: "A deeper kidney pass for the SMLE: acute kidney injury, potassium and magnesium, sodium and water, chronic kidney disease and its complications, glomerular disease, acid-base disorders, tumour lysis and myeloma, and stones, haematuria and urinary infection.",
    subtopics: [
        {
            id: "nph-aki",
            title: "01 — Acute Kidney Injury",
            title_en: "Pre-renal · ATN · interstitial nephritis · obstruction · contrast",
            summaryHtml: `
<p><b>KDIGO definition</b>: creatinine up by at least 26.5 µmol/L (0.3 mg/dL) within 48 hours, or to 1.5 times baseline within 7 days, or urine below 0.5 mL/kg/h for 6 hours.</p>
<div class="sum-algo"><span class="sum-algo-title">Work through it</span><ol>
<li>Check for emergencies: potassium, ECG, acid-base, fluid overload.</li>
<li>Assess volume, pressure and urine output; compare with old creatinine.</li>
<li>Review every drug and recent contrast.</li>
<li>Urinalysis and microscopy.</li>
<li>Ultrasound when obstruction is possible or the cause is unclear; relieve obstruction promptly.</li>
</ol></div>
<div class="deck-block deck-tbl"><table><thead><tr><th>Marker</th><th>Pre-renal</th><th>Acute tubular necrosis</th></tr></thead><tbody>
<tr><td>Urea : creatinine (mg/dL units)</td><td>Often above 20</td><td>Often 10 to 15</td></tr>
<tr><td>Urine sodium</td><td>Below 20</td><td>Above 40</td></tr>
<tr><td>Fractional sodium excretion</td><td>Below 1%</td><td>Above 2%</td></tr>
<tr><td>Urine osmolality</td><td>Concentrated, above 500</td><td>Near plasma, below about 350</td></tr>
<tr><td>Sediment</td><td>Bland</td><td>Muddy brown casts</td></tr>
</tbody></table></div>
<p>These are guides: diuretics, CKD and contrast distort them. An upper GI bleed also raises urea.</p>
<h4 class="deck-topic">Common causes</h4>
<ul>
<li><b>Pre-renal</b>: dehydration, bleeding, heart failure, cirrhosis. NSAIDs, ACE inhibitors, ARBs and diuretics worsen it. Give fluid if depleted; diuretics if congested.</li>
<li><b>ATN</b>: prolonged hypoperfusion, sepsis, <b>aminoglycosides</b>, contrast, pigment (rhabdomyolysis), cisplatin, amphotericin. Remove the insult and support.</li>
<li><b>Acute interstitial nephritis</b>: antibiotics (penicillins, cephalosporins), NSAIDs, proton pump inhibitors, allopurinol. Fever, rash, joint pain, <b>eosinophilia</b>, sterile pyuria, white cell casts; the full triad is often absent. <b>Stop the drug</b>; steroids in selected cases.</li>
<li><b>Cholesterol emboli</b>: after angiography; livedo, blue toes, eosinophilia.</li>
</ul>
<h4 class="deck-topic">Contrast protection</h4>
<p>For high-risk patients: use contrast only if needed, lowest dose of low or iso-osmolar agent, avoid nephrotoxins, and give <b>isotonic saline</b> before and after unless overloaded. Injury usually appears within a few days.</p>
<div class="sum-key"><span class="sum-key-title">نقاط امتحانية</span><ul>
<li>Dehydration with high urea-to-creatinine ratio: pre-renal.</li>
<li>Rising creatinine on aminoglycoside: stop it.</li>
<li>New antibiotic plus eosinophilia and AKI: interstitial nephritis.</li>
<li>CKD patient needing contrast: isotonic saline.</li>
</ul></div>`,
            questions: [
                {
                    "q": "A 28-year-old man who recently joined military service and underwent excessive military training presents to the emergency department with lightheadedness on standing and fatigue. Physical examination reveals postural hypotension. Urine osmolality is elevated at >500 mOsm/kg. What is the most likely etiology of his acute kidney injury?",
                    "options": [
                        "Pre-renal azotemia",
                        "Acute interstitial nephritis",
                        "Acute glomerulonephritis",
                        "Acute tubular necrosis (ATN)"
                    ],
                    "answer": 0,
                    "explanation": "Heavy training causes fluid loss, shown by postural hypotension and lightheadedness. Urine osmolality above 500 means the kidneys can still concentrate urine, which indicates prerenal azotemia. In acute tubular necrosis, concentrating ability is lost. Exertional rhabdomyolysis should also be checked.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A 70-year-old man presents with generalized fatigability. Two days ago, he had a CT brain with contrast for a possible TIA. Physical exam is unremarkable. BP 130/70, HR 76. Hb 170. Urea 30.4. Creatinine 378 (markedly elevated). Which of the following is the most likely mechanism for the renal impairment?",
                    "options": [
                        "Pre-renal azotemia",
                        "Acute tubular necrosis",
                        "Acute interstitial nephritis",
                        "Acute glomerular nephritis"
                    ],
                    "answer": 1,
                    "explanation": "A sharp rise in creatinine within 1-3 days following administration of IV contrast is characteristic of contrast-induced nephropathy, a form of acute tubular necrosis caused by direct tubular toxicity and renal vasoconstriction from the contrast agent.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A patient started on amoxicillin for a respiratory tract infection develops a skin rash after several days of treatment. Investigations show peripheral EOSINOPHILIA and a rising serum creatinine. Urinalysis shows STERILE PYURIA and WHITE CELL CASTS, with no significant proteinuria. What is the most likely renal pathology?",
                    "options": [
                        "Acute tubular necrosis",
                        "Acute interstitial nephritis",
                        "Post-streptococcal glomerulonephritis",
                        "Minimal change disease"
                    ],
                    "answer": 1,
                    "explanation": "A drug, a rash, eosinophilia, sterile pyuria and white cell casts with only modest proteinuria is acute interstitial nephritis - stop the drug. Muddy-brown granular casts mean acute tubular necrosis, red cell casts mean glomerulonephritis, and heavy proteinuria means a nephrotic lesion.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A 67-year-old male is hospitalized for a severe bacterial infection and is receiving intravenous aminoglycoside therapy. After several days of treatment, his clinical condition progressively deteriorates. Laboratory investigations reveal an increase in serum creatinine from 1.0 to 2.8 mg/dL and a reduction in urine output. His serum potassium is 4.6 mmol/L, and he is hemodynamically stable. What is the most appropriate next step in management?",
                    "options": [
                        "Discontinue aminoglycoside therapy",
                        "Initiate hemodialysis",
                        "Continue the current antibiotic regimen",
                        "Increase intravenous fluid administration"
                    ],
                    "answer": 0,
                    "explanation": "Creatinine rising from 1.0 to 2.8 with low urine output during aminoglycoside therapy indicates drug-induced acute tubular injury. First stop the aminoglycoside and choose a non-nephrotoxic antibiotic, then optimize volume, follow electrolytes and adjust other drug doses. Dialysis is not needed with potassium 4.6 and stable hemodynamics, and continuing the drug worsens injury.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A 65-year-old man has been admitted with abdominal pain and he need urgent contrast- enhanced CT but there is a concern regarding his kidney status as he has chronic kidney disease stage 3 (see lab results). Test Result Normal Values Sodium 143 134-146 mmol/L Potassium 4.5 3.5-5.1 mmol/L Blood urea nitrogen 9 2.8 to 8.9 mmol/L Creatinine 160 44-115 mol/L Which of the following is the most important step in reducing the risk of contrast-induced nephropathy?",
                    "options": [
                        "Oral N-acetylcysteine",
                        "Oral sodium bicarbonate",
                        "Intravenous furosemide pre-procedure",
                        "Intravenous 0.9% sodium chloride pre- and post-procedure"
                    ],
                    "answer": 3,
                    "explanation": "The most effective way to prevent contrast-induced nephropathy (in CKD/diabetes/elderly) is IV ISOTONIC (0.9%) SALINE HYDRATION before and after the contrast study (maintains renal perfusion) — plus using the lowest contrast dose and stopping nephrotoxins. N-acetylcysteine/bicarbonate are of doubtful benefit; avoid diuretics (they worsen it). Prevent contrast nephropathy → IV isotonic saline hydration.",
                    "source": "SMLE recall"
                }
            ],
        },
        {
            id: "nph-potassium",
            title: "02 — Potassium & Magnesium",
            title_en: "Emergency treatment · causes · refractory hypokalaemia",
            summaryHtml: `
<h4 class="deck-topic">Hyperkalaemia</h4>
<p>Weakness, palpitations, arrhythmia, or no symptoms. ECG: peaked T, long PR, lost P, wide QRS, sine wave. A normal ECG does not make it safe. Unexpected result: exclude a haemolysed sample, but do not delay treatment in a high-risk patient.</p>
<div class="sum-algo"><span class="sum-algo-title">Three jobs, in order</span><ol>
<li><b>Protect the heart</b>: IV calcium gluconate (or chloride) when there are ECG changes; many protocols also give it for very high levels. It does not lower potassium.</li>
<li><b>Shift into cells</b>: IV regular <b>insulin with glucose</b> (check glucose repeatedly); nebulised salbutamol adds to it; bicarbonate is mainly for significant acidosis.</li>
<li><b>Remove</b>: loop diuretic if urine is made, potassium binder, <b>dialysis</b> if refractory or in severe kidney failure.</li>
<li>Stop sources and culprit drugs; recheck the level.</li>
</ol></div>
<p><b>Causes</b>: kidney failure, <b>ACE inhibitor, ARB</b>, spironolactone, trimethoprim, NSAIDs, heparin, ciclosporin or tacrolimus, acidosis, insulin lack, tissue breakdown, low aldosterone.</p>
<h4 class="deck-topic">Hypokalaemia</h4>
<ul>
<li>Weakness, cramps, ileus, arrhythmia; ECG: flat T, ST depression, <b>U waves</b>.</li>
<li><b>Gut loss</b>: diarrhoea, stimulant laxative abuse such as senna.</li>
<li><b>Kidney loss</b>: loop and thiazide diuretics, hyperaldosteronism, tubular disorders. Vomiting and gastric suction lose potassium mainly through the kidney, with alkalosis.</li>
<li><b>Shift</b>: insulin, beta-agonists, alkalosis, periodic paralysis.</li>
<li>Hypertension with unexplained low potassium: test aldosterone and renin.</li>
<li>Replace orally when possible; IV for severe or symptomatic cases at a controlled rate with monitoring. Never give potassium as an IV push. Avoid glucose-based diluent early on.</li>
</ul>
<h4 class="deck-topic">Magnesium</h4>
<p><b>Potassium that will not correct despite replacement</b>: check magnesium. Low magnesium causes urinary potassium wasting, and low calcium by impairing parathyroid hormone. Typical settings: diarrhoea, Crohn disease, alcohol use, proton pump inhibitors, diuretics. <b>Repair magnesium</b> first or together.</p>
<h4 class="deck-topic">Refeeding syndrome</h4>
<p>Feeding after starvation drives insulin, which pulls <b>phosphate, potassium and magnesium</b> into cells. Give thiamine, start calories cautiously, monitor and replace electrolytes daily.</p>
<div class="sum-key"><span class="sum-key-title">نقاط امتحانية</span><ul>
<li>ECG changes of hyperkalaemia: calcium first.</li>
<li>High potassium on several drugs: suspect the ACE inhibitor or similar agent.</li>
<li>Refractory low potassium: give magnesium.</li>
<li>Low phosphate, potassium and magnesium after feeding: refeeding syndrome.</li>
</ul></div>`,
            questions: [
                {
                    "q": "A patient is found to have a serum potassium level of 6.6 mmol/L. There are no ECG changes, no arrhythmia, and no signs of severe renal failure or refractory hyperkalemia. What is the most appropriate initial management?",
                    "options": [
                        "Start normal saline infusion",
                        "Start IV insulin with glucose",
                        "Hemodialysis"
                    ],
                    "answer": 1,
                    "explanation": "A potassium level of 6.5 mmol/L or higher is itself considered a hyperkalemic emergency requiring urgent treatment, regardless of ECG findings; IV insulin with glucose is used to rapidly shift potassium into cells, while IV calcium gluconate is added specifically when ECG changes are present, to stabilize the cardiac membrane.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A patient is taking multiple medications and is found to have hyperkalemia. Which medication is the most likely cause?",
                    "options": [
                        "ACE inhibitor",
                        "Hydrochlorothiazide"
                    ],
                    "answer": 0,
                    "explanation": "Anything blocking the renin angiotensin aldosterone axis raises potassium; thiazides lower it, so in a patient on both the ACE inhibitor is the cause.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A 30-year-old woman with Crohn's disease presents with hypokalaemia refractory to aggressive parenteral and oral KCl supplementation. Which of the following is the next step in management?",
                    "options": [
                        "Assess her serum plasma aldosterone to plasma renin ratio",
                        "IV magnesium sulfate",
                        "Start spironolactone",
                        "Observation"
                    ],
                    "answer": 1,
                    "explanation": "Refractory hypokalaemia or hypocalcaemia → CHECK Mg first. Hypomagnesaemia causes both via impaired tubular K reabsorption + impaired PTH function. Causes of hypoMg: IBD, diarrhoea, alcoholism, PPIs, diuretics, aminoglycosides. Replace with IV MgSO4.",
                    "source": "SMLE recall"
                },
                {
                    "q": "Senna syrup is used to treat chronic constipation. Which of the following is a serious adverse effect?",
                    "options": [
                        "Diarrhoea",
                        "Abdominal cramps",
                        "Hypokalaemia (low potassium)",
                        "Synergistic effect"
                    ],
                    "answer": 2,
                    "explanation": "Laxative classes: stimulant (senna, bisacodyl) - hypokalaemia with chronic use; osmotic (lactulose, PEG); bulk (ispaghula); softener (docusate). Chronic stimulant use risks electrolyte depletion.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A 17-year-old girl with anorexia nervosa is admitted for initiation of nutrition. Blood samples reveal hypophosphatemia, hypokalemia, and hypomagnesemia. What is the cause of these laboratory findings?",
                    "options": [
                        "Wrong protocol of nutrition",
                        "Wrong test",
                        "Refeeding syndrome",
                        "Wrong kit in lab"
                    ],
                    "answer": 2,
                    "explanation": "Reintroducing nutrition too quickly in a severely malnourished patient causes a rapid intracellular shift of phosphate, potassium, and magnesium driven by insulin release, resulting in the electrolyte pattern of refeeding syndrome; nutrition must therefore be reintroduced slowly in these patients, with close electrolyte monitoring.",
                    "source": "SMLE recall"
                }
            ],
        },
        {
            id: "nph-sodium",
            title: "03 — Sodium & Water",
            title_en: "Hyponatraemia by volume · SIADH · safe correction · DI",
            summaryHtml: `
<div class="sum-algo"><span class="sum-algo-title">Low sodium</span><ol>
<li>How sick? Seizure or coma means treat now.</li>
<li>Serum osmolality: low is true hypotonic hyponatraemia. High usually means glucose (or mannitol); normal suggests a laboratory artefact. Some irrigation fluids also matter.</li>
<li>Urine osmolality: very dilute (below 100) points to excess water intake or poor solute intake.</li>
<li>Assess volume status and urine sodium.</li>
</ol></div>
<div class="deck-block deck-tbl"><table><thead><tr><th>Volume</th><th>Causes</th><th>Direction of therapy</th></tr></thead><tbody>
<tr><td>Low</td><td>Vomiting, diarrhoea, diuretics, adrenal failure</td><td>Isotonic saline; replace hormones if needed</td></tr>
<tr><td>Normal</td><td>SIADH, hypothyroidism, cortisol lack, some drugs</td><td>Treat cause; fluid restriction</td></tr>
<tr><td>High (oedema, ascites)</td><td>Heart failure, cirrhosis, kidney failure, nephrotic state</td><td>Restrict water, loop diuretic, treat cause</td></tr>
</tbody></table></div>
<h4 class="deck-topic">SIADH</h4>
<ul>
<li>Low serum osmolality, <b>inappropriately concentrated urine</b>, urine sodium usually raised, clinically euvolaemic, normal thyroid and adrenal function.</li>
<li>Causes: small cell lung cancer, lung infection, brain disease or tumour, surgery and pain, SSRIs, carbamazepine, cyclophosphamide.</li>
<li>Mild or chronic: <b>fluid restriction</b>.</li>
</ul>
<p><b>Hospital-acquired</b> hyponatraemia often follows <b>hypotonic fluid</b> such as 5% dextrose in a post-operative patient. Stop it.</p>
<h4 class="deck-topic">Speed limit</h4>
<ul>
<li>Severe symptoms: small boluses of <b>3% saline</b>, aiming for an early rise of about 4 to 6 mmol/L.</li>
<li>Generally keep the rise to no more than about <b>8 to 10 mmol/L in 24 hours</b>, lower in high-risk patients (alcohol use, malnutrition, low potassium, very low sodium).</li>
<li>Too fast: <b>osmotic demyelination</b> (central pontine myelinolysis), with delayed dysarthria, dysphagia, weakness.</li>
</ul>
<h4 class="deck-topic">Diabetes insipidus</h4>
<p>Large volumes of dilute urine and thirst. On water deprivation the urine stays dilute. After desmopressin, a clear concentrating response means <b>central</b>; little response means <b>nephrogenic</b> (lithium, high calcium, low potassium). Nephrogenic: treat cause, low salt, thiazide; amiloride for lithium. Correct long-standing high sodium gradually.</p>
<div class="sum-key"><span class="sum-key-title">نقاط امتحانية</span><ul>
<li>Oedema or ascites with low sodium: hypervolaemic.</li>
<li>Euvolaemia with concentrated urine: SIADH.</li>
<li>Post-operative dextrose water can cause hyponatraemia.</li>
<li>Rapid correction risks pontine and extrapontine demyelination.</li>
</ul></div>`,
            questions: [
                {
                    "q": "A 60-year-old man presents to the ER with symptomatic hyponatremia. Which of the following is the most serious consequence of rapid correction of hyponatremia?",
                    "options": [
                        "Hypokalemia",
                        "Hypernatremia",
                        "Volume overload",
                        "Central pontine myelinolysis"
                    ],
                    "answer": 3,
                    "explanation": "Correcting chronic hyponatremia too rapidly causes osmotic demyelination, most notably of the pons, resulting in central pontine myelinolysis, which can cause irreversible neurological damage; sodium correction should therefore be limited to a safe daily rate.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A patient presents with lower limb oedema, ascites and an overall picture of volume overload. Vital signs are normal and sodium is low. What type of hyponatraemia is this?",
                    "options": [
                        "Hypervolaemic hyponatraemia",
                        "Euvolaemic hyponatraemia",
                        "Pseudohyponatraemia",
                        "Hypovolaemic hyponatraemia"
                    ],
                    "answer": 0,
                    "explanation": "Classify hyponatraemia by VOLUME STATUS first: HYPOVOLAEMIC (vomiting, diarrhoea, diuretics, Addison's) -> give saline. EUVOLAEMIC (SIADH, hypothyroidism) -> fluid restrict. HYPERVOLAEMIC (heart failure, cirrhosis, nephrotic syndrome) -> restrict fluid AND sodium, give diuretics. Correct no faster than 8-10 mmol/L per 24 hours to avoid osmotic demyelination.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A patient has had seizures for 3 days. Laboratory studies show sodium 130 mmol/L with a normal potassium of 4.4 mmol/L. Urinalysis shows a urine osmolality of 890 mOsm/kg. What is the diagnosis?",
                    "options": [
                        "Conn's syndrome",
                        "Addison's disease",
                        "Cushing syndrome",
                        "SIADH"
                    ],
                    "answer": 3,
                    "explanation": "SIADH = hyponatraemia + EUVOLAEMIA + inappropriately concentrated urine (osmolality above 100) + urine sodium above 40 + normal thyroid, adrenal and renal function. Treat with FLUID RESTRICTION. Correct no faster than 8-10 mmol/L per 24 hours - over-rapid correction causes OSMOTIC DEMYELINATION SYNDROME.",
                    "source": "SMLE recall"
                }
            ],
        },
        {
            id: "nph-ckd",
            title: "04 — Chronic Kidney Disease: Staging & Progression",
            title_en: "GFR and albuminuria · kidney protection · dialysis · transplant",
            summaryHtml: `
<p><b>CKD</b>: abnormal kidney structure or function for <b>more than 3 months</b>: eGFR below 60, or markers of damage such as albuminuria.</p>
<div class="deck-block deck-tbl"><table><thead><tr><th>Stage</th><th>eGFR (mL/min/1.73 m²)</th></tr></thead><tbody>
<tr><td>G1</td><td>90 or more, with damage</td></tr>
<tr><td>G2</td><td>60 to 89, with damage</td></tr>
<tr><td>G3a / G3b</td><td>45 to 59 / 30 to 44</td></tr>
<tr><td>G4</td><td>15 to 29</td></tr>
<tr><td>G5</td><td>Below 15</td></tr>
</tbody></table></div>
<p>Albuminuria (urine albumin/creatinine ratio): A1 below 30 mg/g, A2 30 to 300, A3 above 300.</p>
<h4 class="deck-topic">Screening in diabetes</h4>
<p>Yearly <b>urine albumin/creatinine ratio</b> plus eGFR: from diagnosis in type 2, and from about 5 years after diagnosis in type 1. Confirm an abnormal ratio on repeat samples.</p>
<h4 class="deck-topic">Slow progression</h4>
<ul>
<li>Blood pressure control (targets differ; below 130/80 or lower when tolerated).</li>
<li><b>ACE inhibitor or ARB</b>, especially with albuminuria. A creatinine rise up to about 30% can be accepted; a bigger rise needs review, including renal artery stenosis. Check potassium.</li>
<li><b>SGLT2 inhibitor</b> for eligible patients, with or without diabetes.</li>
<li>Glucose control; finerenone in selected type 2 diabetes with albuminuria.</li>
<li>Statin, no smoking, less salt, avoid nephrotoxins.</li>
</ul>
<p>The leading cause of death is <b>cardiovascular disease</b>.</p>
<h4 class="deck-topic">Kidney replacement</h4>
<ul>
<li>Urgent dialysis (<b>AEIOU</b>): <b>A</b>cidosis, <b>E</b>lectrolytes (potassium), <b>I</b>ngestion of dialysable toxin, <b>O</b>verload, <b>U</b>raemia, when refractory or serious.</li>
<li>Uraemic <b>pericarditis, encephalopathy or neuropathy</b> are indications. A creatinine number alone is not.</li>
<li>Plan early: an <b>arteriovenous fistula</b> is usually the preferred haemodialysis access and needs time to mature. Protect arm veins.</li>
<li>Transplant is generally best for suitable patients and can be pre-emptive.</li>
<li><b>Ciclosporin</b>: <b>gum overgrowth</b>, hair growth, hypertension, nephrotoxicity. <b>Tacrolimus</b>: tremor, diabetes, nephrotoxicity.</li>
</ul>
<div class="sum-key"><span class="sum-key-title">نقاط امتحانية</span><ul>
<li>eGFR 15 to 29: stage 4.</li>
<li>First kidney test in new type 2 diabetes: urine albumin/creatinine ratio.</li>
<li>Uraemic neuropathy: start dialysis.</li>
<li>Gum hypertrophy after transplant: ciclosporin.</li>
</ul></div>`,
            questions: [
                {
                    "q": "A patient has a glomerular filtration rate (GFR) of 28 mL/min/1.73 m2. Which stage of chronic kidney disease does the patient have?",
                    "options": [
                        "Stage 2",
                        "Stage 3",
                        "Stage 4",
                        "Stage 5"
                    ],
                    "answer": 2,
                    "explanation": "Learn the cut points 90, 60, 30 and 15; a GFR of 28 is stage 4, the stage at which preparation for renal replacement therapy begins.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A 45-year-old man diagnosed with type 2 diabetes 3 months ago, started on metformin 500 TDS, comes for his first follow-up. Blood pressure 125/75 mmHg, Heart rate 80/min. Glucose fasting 7.4, Creatinine 125 (mildly high), HbA1c 6.8%. Which of the following investigations is recommended to assess his renal function/diabetic kidney disease annually?",
                    "options": [
                        "Serum creatinine",
                        "Urine microalbumin",
                        "Urine albumin/creatinine ratio",
                        "Estimated glomerular filtration rate"
                    ],
                    "answer": 2,
                    "explanation": "Diabetic kidney disease screening: annual URINE ALBUMIN/CREATININE RATIO (ACR) — detects EARLIEST damage (moderately increased albuminuria/'microalbuminuria' ACR 3-30 mg/mmol) before creatinine rises — PLUS eGFR. Screen from diagnosis in T2DM (from 5 yr in T1DM). ACR > plain microalbumin (corrects for urine concentration). Treat with ACEi/ARB (renoprotective) + SGLT2 inhibitor + BP/glycaemic control.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A 51-year-old man with chronic and progressing renal disease. His GF is decreasing and most likely he will need dialysis sometime within the next year. Which of the following will be the most likely cause of death in his case?",
                    "options": [
                        "Renal failure",
                        "Coagulopathy",
                        "Pulmonary edema",
                        "Cardiovascular disease"
                    ],
                    "answer": 3,
                    "explanation": "Core Concept: Mortality in Chronic Kidney Disease (CKD). Patients with CKD are at a significantly higher risk of dying from cardiovascular disease (CVD) than progressing to end-stage renal disease (ESRD). The uremic milieu accelerates atherosclerosis and cardiovascular events. Clinical Presentation: · CKD symptoms: fatigue, edema, anorexia, nausea, pruritus, bone pain. · CVD symptoms: angina, dyspnea, claudication, heart failure symptoms. Diagnosis: · First-line: eGFR calculation, urine albumin-to-creatinine ratio (UACR). · Gold standard for CVD risk assessment: Comprehensive cardiovascular risk profiling, stress testing, or coronary angiography if symptomatic. Management: · Acute: Management of acute complications (hyperkalemia, fluid overload). · Long-term/Definitive: Strict CV risk factor modification (statins, BP control, glycemic control), RAAS blockade, SGLT2 inhibitors, and preparation for renal replacement therapy (dialysis or transplant).",
                    "source": "SMLE bank"
                },
                {
                    "q": "A 50-year-old male with a 3-year history of chronic kidney disease presents with numbness in his hands and legs. On physical examination: bilateral lower limb loss/diminished sensation up to the knees and absent reflexes. Lab results: K= 6.3 Creatinine and urea: very high Hb = 9 RBC =4 What is the management?",
                    "options": [
                        "Erythropoietin",
                        "Vitamin B12 complex",
                        "Initiate dialysis"
                    ],
                    "answer": 2,
                    "explanation": "Uraemic neuropathy (numbness, reduced sensation, absent reflexes) together with a potassium of 6.3 and very high urea and creatinine are indications to start dialysis. Erythropoietin treats the anaemia of chronic kidney disease (Hb 9) but does not treat uraemic complications or hyperkalaemia, and vitamin B12 would not explain the very high urea and creatinine.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A patient post renal transplant presents with gum hypertrophy (gingival hyperplasia). What is the cause?",
                    "options": [
                        "Vitamin D",
                        "Cyclosporin A",
                        "Pantoprazole"
                    ],
                    "answer": 1,
                    "explanation": "Cyclosporine, a commonly used post-transplant immunosuppressant, is a well-established cause of gingival hyperplasia.",
                    "source": "SMLE recall"
                }
            ],
        },
        {
            id: "nph-ckd-complications",
            title: "05 — CKD Complications & Safe Prescribing",
            title_en: "Anaemia · phosphate and PTH · diet · drug choice",
            summaryHtml: `
<h4 class="deck-topic">Anaemia</h4>
<ul>
<li>Mainly <b>erythropoietin deficiency</b>: normocytic, low reticulocytes, more common as GFR falls.</li>
<li>It is a diagnosis after other causes: check <b>iron studies</b> (ferritin, transferrin saturation), B12, folate and blood loss.</li>
<li><b>Replace iron first</b> (IV is often needed on dialysis). Then consider an erythropoiesis-stimulating agent.</li>
<li>Do not aim for a normal haemoglobin: high targets raise stroke and cardiovascular risk. Watch blood pressure; use great care with cancer or previous stroke.</li>
</ul>
<h4 class="deck-topic">Mineral and bone disorder</h4>
<div class="sum-algo"><span class="sum-algo-title">Mechanism of secondary hyperparathyroidism</span><ol>
<li>Phosphate is retained and FGF23 rises.</li>
<li>Activation of vitamin D falls (less calcitriol).</li>
<li>Calcium absorption and level fall.</li>
<li>PTH rises and bone turnover increases.</li>
</ol></div>
<ul>
<li>Typical: <b>high phosphate, low or low-normal calcium, high PTH</b>.</li>
<li><b>High phosphate</b>: dietary restriction (especially additives), then a binder taken with meals: calcium-based, or <b>non-calcium</b> such as sevelamer; limit calcium load.</li>
<li>Correct vitamin D lack. <b>Calcitriol</b> or an analogue treats significant, progressive hyperparathyroidism, mainly in advanced CKD and dialysis; it raises calcium and phosphate, so monitor. Current guidance does not advise it routinely before dialysis.</li>
<li>Calcimimetics for selected dialysis patients.</li>
<li><b>Tertiary</b>: long-standing stimulation becomes autonomous, with <b>high calcium</b>.</li>
</ul>
<h4 class="deck-topic">Diet</h4>
<p>With high potassium, limit rich sources: tomatoes, potatoes, bananas, oranges, dates, dried fruit. Restrict salt. Avoid salt substitutes containing potassium.</p>
<h4 class="deck-topic">Drugs</h4>
<div class="deck-block deck-tbl"><table><thead><tr><th>Need</th><th>In reduced GFR</th></tr></thead><tbody>
<tr><td>Pain</td><td><b>Paracetamol</b> preferred; avoid NSAIDs</td></tr>
<tr><td>Metformin</td><td>Reduce below eGFR 45; stop below 30</td></tr>
<tr><td>Heparin</td><td>LMWH accumulates; adjust dose or use unfractionated heparin</td></tr>
<tr><td>Nitrofurantoin</td><td>Avoid when GFR is markedly low</td></tr>
<tr><td>Opioids</td><td>Avoid morphine in advanced disease (active metabolites)</td></tr>
</tbody></table></div>
<div class="sum-key"><span class="sum-key-title">نقاط امتحانية</span><ul>
<li>Pale CKD patient: check iron before erythropoietin.</li>
<li>Main mechanism of renal anaemia: low erythropoietin.</li>
<li>Phosphate high despite diet: add a binder such as sevelamer.</li>
<li>Pain with raised creatinine: paracetamol.</li>
</ul></div>`,
            questions: [
                {
                    "q": "A 55-year-old man with stage 2 chronic kidney disease is evaluated because of anemia. He is complaining of fatigue. His physical examination reveals pale skin, otherwise unremarkable (see lab results). Which of the following is the most appropriate investigation to be done?",
                    "options": [
                        "Serum iron studies",
                        "Reticulocyte count",
                        "Serum erythropoietin level",
                        "Bone marrow aspiration"
                    ],
                    "answer": 0,
                    "explanation": "In CKD anaemia, first check iron studies (ferritin, transferrin saturation) to identify/correct iron deficiency and exclude other causes before attributing it to erythropoietin deficiency or starting an ESA (which needs adequate iron) — especially in mild (stage 2) CKD. CKD anaemia → serum iron studies first.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A 70-year-old woman presents with fatigue and exertional dyspnea for several months. Medical history includes longstafinding hypertension and chronic kidney disease, and she is not adherent to her medications. Examination reveals pale mucous membranes and nail beds (see lab results and report). Kidney ultrasonography: Showed small kidneys bilaterally with echographic features suggesting chronic kidney disease. Which of the following is the most likely cause of this patient's anemia?",
                    "options": [
                        "Erythropoietin deficiency",
                        "Myelodysplastic syndrome",
                        "Iron deficiency",
                        "Inflammation"
                    ],
                    "answer": 0,
                    "explanation": "Anaemia of chronic kidney disease is mainly caused by ERYTHROPOIETIN DEFICIENCY (diseased kidneys produce less EPO) → a normocytic, normochromic anaemia. Treat with erythropoiesis-stimulating agents (EPO) plus iron (ensure iron stores are adequate). CKD + anaemia → erythropoietin deficiency.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A 50-year-old with IgA nephritis causing chronic kidney disease. Creatinine 150, urea 8.8, phosphate 1.7, PTH 10.2, GFR 50. How to deal with the phosphate?",
                    "options": [
                        "Calcitriol",
                        "Sevelamer"
                    ],
                    "answer": 1,
                    "explanation": "In chronic kidney disease control the phosphate first with dietary restriction and a binder; active vitamin D raises phosphate absorption and belongs only after the phosphate is controlled.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A patient with knee osteoarthritis (knee pain with reduced movement and joint space narrowing) has an elevated creatinine (about 180). What should be given to control the symptoms?",
                    "options": [
                        "Paracetamol",
                        "Ibuprofen"
                    ],
                    "answer": 0,
                    "explanation": "In osteoarthritis with renal impairment, paracetamol is first line and NSAIDs are contraindicated. PUD, GERD & H. pylori",
                    "source": "SMLE recall"
                }
            ],
        },
        {
            id: "nph-glomerular",
            title: "06 — Glomerular Disease & Lupus Nephritis",
            title_en: "Nephrotic vs nephritic · IgA · complement · biopsy",
            summaryHtml: `
<div class="deck-block deck-tbl"><table><thead><tr><th>Nephrotic</th><th>Nephritic</th></tr></thead><tbody>
<tr><td>Proteinuria above 3.5 g/day, low albumin, oedema, <b>high cholesterol</b></td><td>Haematuria, dysmorphic red cells or <b>red cell casts</b>, hypertension, oliguria, raised creatinine</td></tr>
</tbody></table></div>
<h4 class="deck-topic">Nephrotic causes</h4>
<ul>
<li><b>Minimal change</b>: commonest in children, usually steroid-responsive; in adults ask about <b>NSAIDs</b> and lymphoma.</li>
<li><b>Membranous</b>: adults; PLA2R antibody, cancer, hepatitis B, lupus, drugs; high clot risk.</li>
<li><b>Focal segmental sclerosis</b>: HIV, obesity, scarring.</li>
<li>Diabetes and amyloidosis.</li>
</ul>
<p>Always take a drug history and ask about infection, autoimmune disease, diabetes and cancer. Complications: <b>thrombosis</b>, infection, AKI, hyperlipidaemia. Support with salt restriction, diuretic, ACEi or ARB, and lipid and clot risk management.</p>
<h4 class="deck-topic">Nephritic clues</h4>
<ul>
<li><b>IgA nephropathy</b>: visible haematuria <b>within a day or two</b> of a throat infection; complement usually normal; recurrent.</li>
<li><b>Post-streptococcal</b>: 1 to 3 weeks after throat (longer after skin) infection; <b>low C3</b> that recovers over weeks; supportive care.</li>
<li>Other low-complement states: lupus, membranoproliferative disease, endocarditis, cryoglobulinaemia.</li>
<li><b>Rapidly progressive</b> disease (crescents): anti-GBM (with lung bleeding: Goodpasture), ANCA vasculitis, immune complex. Urgent biopsy and immunosuppression.</li>
</ul>
<h4 class="deck-topic">Lupus nephritis</h4>
<ul>
<li>Screen every lupus patient: urine, protein ratio, creatinine, pressure, even without symptoms.</li>
<li>New significant proteinuria (about 0.5 g/day or more), active sediment or unexplained fall in function: <b>kidney biopsy</b>. The class decides therapy.</li>
<li>Hydroxychloroquine for nearly all.</li>
<li><b>Proliferative classes III and IV</b>: <b>glucocorticoid plus mycophenolate</b> or low-dose cyclophosphamide, with newer add-ons in some regimens.</li>
<li>Mild mesangial disease: kidney protection and pressure control; immunosuppression guided by the rest of the lupus. Class V depends on protein level.</li>
</ul>
<div class="sum-key"><span class="sum-key-title">نقاط امتحانية</span><ul>
<li>Heavy proteinuria comes with hypercholesterolaemia.</li>
<li>Haematuria a day after sore throat: IgA nephropathy.</li>
<li>Lupus with new proteinuria: biopsy.</li>
<li>Nephrotic patient: ask about NSAIDs and other drugs.</li>
</ul></div>`,
            questions: [
                {
                    "q": "A patient with heavy proteinuria and hypoalbuminaemia (nephrotic syndrome) is assessed. Which of the following is most expected to be found in this patient?",
                    "options": [
                        "Hypokalemia",
                        "Hypernatremia",
                        "Metabolic acidosis",
                        "Hypercholesterolemia"
                    ],
                    "answer": 3,
                    "explanation": "Nephrotic syndrome (heavy proteinuria, hypoalbuminaemia, oedema) causes hypercholesterolaemia/hyperlipidaemia — the low oncotic pressure drives hepatic lipoprotein synthesis. Nephrotic syndrome → hypercholesterolaemia.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A patient is diagnosed with nephrotic syndrome. What important question should be asked related to this diagnosis?",
                    "options": [
                        "History of diabetes and hypertension",
                        "History of medication use, such as NSAIDs, and previous conditions",
                        "History of infection such as hepatitis B or C",
                        "History of connective tissue disease such as arthritis or skin rashes"
                    ],
                    "answer": 1,
                    "explanation": "While hepatitis B/C and connective tissue disease can also cause nephrotic syndrome, they are typically identified through laboratory testing regardless of history; NSAID-induced kidney injury, however, can only be identified by specifically asking about medication history, making this an essential and uniquely history-dependent question in the workup of nephrotic syndrome.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A 20-year-old man presents with hematuria, 1-day following a throat infection. Which of the following is the most likely diagnosis?",
                    "options": [
                        "IgA nephropathy",
                        "Membranous nephropathy",
                        "Post-infectious glomerular nephritis",
                        "Focal segmental glomerulosclerosis"
                    ],
                    "answer": 0,
                    "explanation": "Core Concept: IgA Nephropathy (Berger's disease), the most common primary glomerulonephritis worldwide, characterized by the deposition of IgA immune complexes in the renal mesangium. Clinical Presentation: · Episodic gross hematuria occurring *concurrently* or within 1-2 days (synpharyngitic) of an upper respiratory or gastrointestinal infection. · Flank pain during episodes of gross hematuria. Diagnosis: · First-line: Urinalysis showing dysmorphic RBCs and RBC casts, indicating a nephritic source. · Gold Standard: Renal biopsy demonstrating mesangial hypercellularity with dominant IgA deposits on immunofluorescence. Management: · Acute management: Supportive care during episodes of macroscopic hematuria. · Long-term/Definitive management: Strict blood pressure and proteinuria control using ACE inhibitors or ARBs. Immunosuppressive therapy (e.g., systemic corticosteroids) may be considered in high-risk patients with persistent proteinuria > 1g/day despite optimized supportive care.",
                    "source": "SMLE bank"
                },
                {
                    "q": "A 45-year-old woman with systemic lupus erythematosus, asymptomatic and on no medications, comes for routine follow-up. Her blood pressure is 140/90 mmHg. Labs show significant proteinuria, an active urinary sediment with elevated white cells, and elevated urea and creatinine. Which of the following is the most appropriate next step in management?",
                    "options": [
                        "Anti Ds-DNA",
                        "Renal biopsy",
                        "Doppler renal ultrasound",
                        "Repeat urine analysis in next visit"
                    ],
                    "answer": 1,
                    "explanation": "New hypertension, significant proteinuria, an active urinary sediment, and rising creatinine in a patient with SLE raise strong suspicion for lupus nephritis; renal biopsy is the definitive next step, since it determines the histologic class and directly guides the choice and intensity of immunosuppressive therapy.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A 30-year-old woman presented to the clinic with polyarthralgia, malar rash and mucosal ulcerations for 2-months. Examination revealed active malar rash and arthritis affecting several joints. She has positive anti-nuclear antibody with high titer (see lab results). Test Result Normal Values Hb 100 130-170 g/L (Male) 120-160 g/L (Female) Platelets count 90 150-400 × 109/L WBC 3.5 4.5-10.5 x 109/L ESR 60 2-10 mm/h (Male) 3-15 mm/h (Female) Urea 5 2.75-7.4 mmol/L Creatinine 150 44-115 mol/L Protein 1200 0-150 mg/24 hr Complement C3 0.4 0.7-1.5 g/L Complement C4 0.1 0.15-0.45 g/L Which of the following is the best high dose treatment option at this time?",
                    "options": [
                        "Steroid and mycophenolate mofetil",
                        "Steroid and hydroxychloroquine",
                        "Steroid and methotrexate",
                        "Steroid and cyclosporine"
                    ],
                    "answer": 0,
                    "explanation": "Core Concept: This patient has SLE complicated by Lupus Nephritis, evidenced by elevated creatinine (150 µmol/L) and significant proteinuria (1200 mg/24 hr). Clinical Presentation: · Edema, hypertension, foamy urine, active urinary sediment, alongside systemic SLE symptoms and hypocomplementemia. Diagnosis: · First-line: Urinalysis, urine protein-to-creatinine ratio, renal function tests. · Gold Standard: Renal biopsy to classify the type of lupus nephritis (Class I-VI), which guides therapy. Management: · Acute: High-dose corticosteroids (e.g., IV methylprednisolone pulses followed by oral prednisone). · Long-term: Induction immunosuppression with Mycophenolate Mofetil (MMF) or IV Cyclophosphamide is the gold standard for proliferative lupus nephritis (Class III/IV). MMF is often preferred due to a better side-effect profile and comparable efficacy.",
                    "source": "SMLE bank"
                }
            ],
        },
        {
            id: "nph-acid-base",
            title: "07 — Acid-Base & Renal Tubular Acidosis",
            title_en: "Stepwise gas reading · anion gap · alkalosis · RTA types",
            summaryHtml: `
<div class="sum-algo"><span class="sum-algo-title">Read the gas</span><ol>
<li>pH: acidaemia or alkalaemia?</li>
<li>Which moved to explain it: bicarbonate (metabolic) or PaCO2 (respiratory)?</li>
<li>Is compensation appropriate? In metabolic acidosis expected PaCO2 (mmHg) is about 1.5 × bicarbonate + 8, give or take 2.</li>
<li>In metabolic acidosis, calculate the anion gap: Na minus (Cl + bicarbonate).</li>
</ol></div>
<p>Compensation moves in the same direction and rarely returns pH fully to normal. In metabolic alkalosis the PaCO2 <b>rises</b>. A raised PaCO2 with high bicarbonate and high pH is therefore metabolic alkalosis with respiratory compensation. Watch units: normal PaCO2 is about 35 to 45 mmHg, or 4.7 to 6 kPa.</p>
<h4 class="deck-topic">Metabolic acidosis</h4>
<ul>
<li><b>High anion gap</b>: ketoacidosis, lactate, kidney failure, toxins (methanol, ethylene glycol, salicylate).</li>
<li><b>Normal gap</b>: <b>diarrhoea</b> (with low potassium), renal tubular acidosis, large saline volumes.</li>
</ul>
<h4 class="deck-topic">Metabolic alkalosis</h4>
<ul>
<li><b>Vomiting or nasogastric suction</b>: loss of acid and chloride; volume depletion keeps it going; potassium falls.</li>
<li>Low urine chloride: saline-responsive; give <b>isotonic saline plus potassium</b>.</li>
<li>High urine chloride: hyperaldosteronism and related states, or current diuretic effect.</li>
</ul>
<h4 class="deck-topic">Renal tubular acidosis (normal anion gap)</h4>
<div class="deck-block deck-tbl"><table><thead><tr><th>Type</th><th>Defect</th><th>Clues</th></tr></thead><tbody>
<tr><td>1 distal</td><td>Cannot secrete acid</td><td>Urine pH stays above 5.5, low K, stones and nephrocalcinosis; <b>Sjogren</b>, amphotericin</td></tr>
<tr><td>2 proximal</td><td>Bicarbonate wasting</td><td>Low K, Fanconi features, bone disease; myeloma, tenofovir; urine can acidify once serum bicarbonate is low</td></tr>
<tr><td>4</td><td>Aldosterone lack or resistance</td><td><b>High K</b>; diabetic kidney disease, ACEi, heparin, trimethoprim</td></tr>
</tbody></table></div>
<p>Treatment: alkali, correct potassium (especially before alkali when it is low) and treat the cause. Type 4 needs potassium lowering.</p>
<div class="sum-key"><span class="sum-key-title">نقاط امتحانية</span><ul>
<li>Diarrhoea: normal-gap acidosis with low potassium.</li>
<li>Vomiting or gastric suction: alkalosis with low potassium.</li>
<li>Sjogren syndrome: distal (type 1) tubular acidosis.</li>
<li>Normal-gap acidosis with high potassium: type 4.</li>
</ul></div>`,
            questions: [
                {
                    "q": "A 30-year-old woman with Sjogren's syndrome on hydroxychloroquine is evaluated for fatigue. Physical examination is unremarkable. Which type of renal tubular acidosis is the most likely cause of her hypokalemia?",
                    "options": [
                        "Type 1",
                        "Type 2",
                        "Type 3",
                        "Type 4"
                    ],
                    "answer": 0,
                    "explanation": "Distal (type 1) renal tubular acidosis is classically associated with autoimmune conditions such as Sjogren's syndrome, causing impaired distal urinary acidification, hypokalemia, and metabolic acidosis.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A patient presented with frequent vomiting due to gastric outlet obstruction. Which of the following is the most expected metabolic abnormality?",
                    "options": [
                        "Metabolic acidosis with hyperkalaemia",
                        "Metabolic alkalosis with hypokalaemia",
                        "Metabolic acidosis with hypokalaemia",
                        "Metabolic alkalosis with hyperkalaemia"
                    ],
                    "answer": 1,
                    "explanation": "VOMITING (gastric outlet obstruction): HYPOKALAEMIC HYPOCHLORAEMIC METABOLIC ALKALOSIS (lose H+, Cl- → alkalosis; volume depletion → aldosterone → renal K+/H+ loss → hypokalaemia + paradoxical aciduria). DIARRHOEA (lower GI): metabolic ACIDOSIS + hypokalaemia (lose bicarbonate). Treat vomiting alkalosis: IV saline (volume + Cl-) + K+ replacement.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A post-operative patient who underwent a subtotal colectomy has a nasogastric tube set to high-level continuous suction. Laboratory evaluation reveals a serum potassium level of 2.8 mmol/L (low). What is the primary cause of this patient's hypokalemia?",
                    "options": [
                        "Nasogastric (nasal) suctioning",
                        "Inadequate dietary intake",
                        "Renal potassium wasting due to aldosterone",
                        "Intraoperative fluid shift"
                    ],
                    "answer": 0,
                    "explanation": "Prolonged NG suction -> loss of K+/H+/Cl- -> hypokalaemic hypochloraemic metabolic alkalosis. Replace potassium and chloride.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A patient presented with severe diarrhoea. Which of the following is the most expected abnormalities?",
                    "options": [
                        "Metabolic acidosis with hypokalaemia",
                        "Metabolic acidosis with hyperkalaemia",
                        "Metabolic alkalosis with hypokalaemia",
                        "Metabolic alkalosis with hyperkalaemia"
                    ],
                    "answer": 0,
                    "explanation": "Core Concept: Severe diarrhea results in the massive loss of bicarbonate-rich intestinal fluids, leading to a normal anion gap (hyperchloremic) metabolic acidosis. The high volume fluid loss also drives secondary hyperaldosteronism and direct fecal potassium loss, resulting in concurrent hypokalemia. Clinical Presentation: · Profuse watery stools, dehydration, generalized weakness, muscle cramps, and lethargy. Diagnosis: · First-line: Comprehensive metabolic panel (showing low bicarbonate, low potassium) and ABG. · Gold standard: Stool studies (culture, O&P, C. difficile toxin, fecal leukocytes) to identify the specific etiology. Management: · Acute: Aggressive oral or IV rehydration with balanced electrolyte solutions (e.g., Ringer's lactate or WHO ORS) and potassium replacement. · Long-term/Definitive: Treat the underlying cause of diarrhea (e.g., targeted antibiotics for bacterial infections, anti-parasitics, or management of IBD).",
                    "source": "SMLE bank"
                },
                {
                    "q": "A patient's ABG shows pH 7.55, PCO2 8 kPa (elevated), and bicarbonate 44 mmol/L (elevated). What is the interpretation?",
                    "options": [
                        "Combined metabolic and respiratory acidosis",
                        "Uncompensated metabolic alkalosis",
                        "Metabolic alkalosis with respiratory compensation",
                        "Respiratory acidosis"
                    ],
                    "answer": 2,
                    "explanation": "An elevated pH with elevated bicarbonate indicates a primary metabolic alkalosis; the appropriately elevated PCO2 reflects the expected respiratory compensation, in which the body hypoventilates to retain CO2 and blunt the rise in pH, rather than an uncompensated or mixed disturbance.",
                    "source": "SMLE recall"
                }
            ],
        },
        {
            id: "nph-tls-myeloma",
            title: "08 — Tumour Lysis & Myeloma Kidney",
            title_en: "Electrolyte pattern · prevention · rasburicase · light chains",
            summaryHtml: `
<h4 class="deck-topic">Tumour lysis syndrome</h4>
<p>Massive tumour cell death, usually soon after treatment of bulky, fast-growing tumours: Burkitt and other aggressive lymphomas, acute leukaemia, high white counts. It can also occur spontaneously.</p>
<div class="deck-block deck-tbl"><table><thead><tr><th>Goes up</th><th>Goes down</th></tr></thead><tbody>
<tr><td><b>Potassium</b>, <b>phosphate</b>, <b>uric acid</b>, LDH</td><td><b>Calcium</b> (bound by phosphate)</td></tr>
</tbody></table></div>
<ul>
<li>Complications: arrhythmia, seizures, <b>AKI</b> from urate and calcium-phosphate deposits.</li>
<li>Weakness and palpitations in this setting point first to <b>hyperkalaemia</b>.</li>
</ul>
<h4 class="deck-topic">Prevention and treatment</h4>
<ul>
<li>Stratify risk before chemotherapy.</li>
<li><b>Vigorous IV isotonic fluid</b> with urine output monitoring; frequent chemistry.</li>
<li><b>Allopurinol</b> prevents new urate in lower-risk patients; it does not remove urate already present.</li>
<li><b>Rasburicase</b> breaks down existing urate: high risk or established hyperuricaemia with kidney injury. Contraindicated in <b>G6PD deficiency</b> (haemolysis, methaemoglobinaemia), so screen when possible.</li>
<li>Routine urine alkalinisation is not advised.</li>
<li>Replace calcium only for symptoms (extra calcium can precipitate with phosphate).</li>
<li>Refractory potassium, phosphate, overload or oliguria: dialysis. A truly blocked outflow also needs relief.</li>
</ul>
<h4 class="deck-topic">Myeloma kidney</h4>
<ul>
<li>Older patient with <b>back pain</b>, anaemia, high calcium, raised creatinine, high total protein or recurrent infection (<b>CRAB</b>: calcium, renal, anaemia, bone).</li>
<li>Main lesion: <b>cast nephropathy</b> from filtered <b>monoclonal light chains</b>. Others: AL amyloid, light chain deposition, hypercalcaemia, NSAIDs, infection.</li>
<li>The standard dipstick mainly detects albumin and can <b>miss light chains</b>.</li>
<li>Tests: serum and urine electrophoresis with immunofixation, serum free light chains, marrow.</li>
<li>Care: fluids, correct calcium, avoid NSAIDs and unnecessary contrast, and start anti-myeloma therapy quickly.</li>
</ul>
<div class="sum-key"><span class="sum-key-title">نقاط امتحانية</span><ul>
<li>Tumour lysis: high potassium, phosphate, urate; low calcium.</li>
<li>First supportive step: IV fluids.</li>
<li>Severe hyperuricaemia with oliguria after chemotherapy: rasburicase, after considering G6PD.</li>
<li>Bone pain with kidney failure and plasma cells: light chain injury.</li>
</ul></div>`,
            questions: [
                {
                    "q": "A patient in tumor lysis syndrome presents with nausea, palpitations, and muscle weakness. What is causing it?",
                    "options": [
                        "Hyperkalemia",
                        "Hypocalcemia",
                        "Hyperuricemia",
                        "Hypomagnesemia"
                    ],
                    "answer": 0,
                    "explanation": "Palpitations combined with muscle weakness in tumor lysis syndrome are classic symptoms of hyperkalemia, reflecting the cardiac arrhythmia risk and neuromuscular effects of elevated potassium released from lysed tumor cells.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A 23-year-old man known to have Hodgkin's lymphoma, undergoing chemotherapy, developed tumor lysis syndrome.\nWhich of the following is the most likely expected disturbance?",
                    "options": [
                        "Hypokalemia and hypocalcemia",
                        "Hypokalemia and hypercalcemia",
                        "Hyperkalemia and hypocalcemia",
                        "Hyperkalemia and hypercalcemia"
                    ],
                    "answer": 2,
                    "explanation": "Core Concept: Tumor Lysis Syndrome (TLS) is an oncologic emergency caused by the massive and rapid destruction of cancer cells, releasing their intracellular contents into the systemic circulation. Clinical Presentation: · Nausea, vomiting, muscle cramps, and tetany · Cardiac arrhythmias, seizures, and acute oliguric kidney injury Diagnosis: · First-line diagnostic plan: Comprehensive metabolic panel showing the classic tetrad: hyperkalemia, hyperphosphatemia, hyperuricemia, and secondary hypocalcemia. · Gold standard: Cairo-Bishop criteria defining laboratory and clinical TLS. Management: · Acute management: Aggressive IV hydration, rasburicase (or allopurinol) to lower uric acid, and correction of electrolyte abnormalities (e.g., calcium gluconate for symptomatic hypocalcemia). · Gold standard long-term management: Prophylactic hydration and hypouricemic agents prior to initiating cytotoxic chemotherapy in high-risk patients.",
                    "source": "SMLE bank"
                },
                {
                    "q": "A man diagnosed with non-Hodgkin lymphoma is found in clinic to have a high uric acid and a high creatinine. What is the initial step in management?",
                    "options": [
                        "IV fluids",
                        "Allopurinol",
                        "Furosemide (Lasix)"
                    ],
                    "answer": 0,
                    "explanation": "Tumour lysis: HIGH potassium, phosphate, urate; LOW calcium; rising creatinine. HYDRATION is the cornerstone. Allopurinol prevents new urate; rasburicase degrades existing urate (avoid in G6PD deficiency). Do not alkalinise the urine.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A patient with Burkitt lymphoma (or DLBCL) is receiving chemotherapy (B-CHOP/R-CHOP). Labs show hyperkalemia (6) and hypocalcemia, with inability to urinate. What is the most appropriate management, in addition to hydration?",
                    "options": [
                        "Lasix (furosemide)",
                        "Thiazide",
                        "Rasburicase"
                    ],
                    "answer": 2,
                    "explanation": "This presentation, hyperkalemia, hypocalcemia, and acute kidney injury shortly after starting chemotherapy for a high-grade lymphoma, is classic for tumor lysis syndrome; rasburicase, which rapidly breaks down uric acid, is preferred over allopurinol for established or high-risk tumor lysis syndrome, especially when acute kidney injury is already present.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A patient presents with severe back pain that has been ongoing for weeks, with no features of hyperviscosity. Basic chemistry shows a low creatinine clearance, and bone marrow examination shows 20% plasma cells. What is the cause of the renal impairment in this case?",
                    "options": [
                        "Accumulation of monoclonal light chains",
                        "Waldenstrom macroglobulinaemia",
                        "Renal artery stenosis",
                        "Acute tubular necrosis from sepsis"
                    ],
                    "answer": 0,
                    "explanation": "Myeloma renal failure = CAST NEPHROPATHY from monoclonal FREE LIGHT CHAINS precipitating with Tamm-Horsfall protein in distal tubules. Light chains are MISSED by urine dipstick (which detects albumin) - use urine electrophoresis / serum free light chains. Treat with hydration, avoid nephrotoxins, correct calcium, treat the myeloma. CRAB = Calcium, Renal, Anaemia, Bone.",
                    "source": "SMLE recall"
                }
            ],
        },
        {
            id: "nph-stones-haematuria",
            title: "09 — Stones, Haematuria & Urinary Infection",
            title_en: "Imaging · expectant care · cancer work-up · scarring",
            summaryHtml: `
<h4 class="deck-topic">Renal colic</h4>
<ul>
<li>Sudden loin-to-groin colic, restlessness, nausea, haematuria (its absence does not exclude a stone).</li>
<li>Urinalysis and kidney function for all.</li>
<li>Most accurate common test in adults: <b>non-contrast CT KUB</b>. <b>Ultrasound first</b> in pregnancy and children.</li>
<li>Analgesia: NSAID if kidney function and other risks allow.</li>
<li>Small ureteric stone (about <b>5 mm or less</b>), controlled pain, no infection, good function: <b>conservative management</b> with follow-up. An alpha-blocker may help selected distal stones, mainly the larger ones.</li>
<li><b>Obstruction plus infection</b> is an emergency: antibiotics and urgent decompression (stent or nephrostomy). Also urgent: single kidney with obstruction, AKI, uncontrolled pain.</li>
<li>Prevention: high fluid intake, less salt, normal dietary calcium.</li>
</ul>
<h4 class="deck-topic">Haematuria</h4>
<ul>
<li>Confirm with urine microscopy; exclude infection, menstruation, drugs or food colouring.</li>
<li>Casts, dysmorphic cells, proteinuria: glomerular; refer to nephrology.</li>
<li><b>Painless visible haematuria in an older adult or smoker</b> is bladder cancer until excluded: <b>cystoscopy</b> plus upper tract imaging (CT urography when suitable).</li>
<li>A negative urine cytology does not replace cystoscopy.</li>
</ul>
<h4 class="deck-topic">Urinary infection</h4>
<ul>
<li>Typical symptoms in a healthy woman: treat empirically; positive nitrite supports it.</li>
<li>Cystitis options: nitrofurantoin or fosfomycin, guided by local resistance and allergy. Nitrofurantoin is not for pyelonephritis.</li>
<li>Fever, loin pain, pregnancy, male sex, catheter, obstruction or immunosuppression: culture and broader approach.</li>
<li>Asymptomatic bacteriuria is treated in pregnancy and before invasive urological procedures, not routinely otherwise.</li>
<li><b>Renal scarring</b> after childhood infection: <b>DMSA scan</b>.</li>
</ul>
<div class="sum-key"><span class="sum-key-title">نقاط امتحانية</span><ul>
<li>Adult with suspected stone: non-contrast CT.</li>
<li>4 mm ureteric stone without complications: conservative care.</li>
<li>Painless haematuria in an older patient: cystoscopy.</li>
<li>Scar assessment: DMSA.</li>
</ul></div>`,
            questions: [
                {
                    "q": "A 50-year-old male comes to the clinic concerned about seeing blood in his urine, with right flank pain, no history of trauma or prior stones. Exam shows right flank tenderness and an enlarged prostate on DRE. Urinalysis shows 20 RBCs. What is the most appropriate investigation?",
                    "options": [
                        "Cystoscopy",
                        "CT KUB",
                        "X-ray"
                    ],
                    "answer": 1,
                    "explanation": "The presence of flank pain suggests a possible upper urinary tract source (kidney or ureter); CT KUB provides comprehensive imaging of both the upper and lower urinary tract, unlike cystoscopy alone, which would only assess the bladder.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A 25 year came to ED complaining of left flank pain with no history of fever or hematuria CT scan: a 4 mm left ureteric stone. What is the most appropriate next step?",
                    "options": [
                        "Ureteroscopy",
                        "Conservative management",
                        "double J stent",
                        "shock wave lithotripsy"
                    ],
                    "answer": 1,
                    "explanation": "A 4 mm ureteric stone without fever or other complications usually passes on its own, so conservative management with analgesia, fluids and follow-up is appropriate. Intervention is for infection with obstruction, intractable pain, kidney injury, large stones or failure to pass.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A 67-year-old male presents with painless hematuria. What is the most appropriate diagnostic test?",
                    "options": [
                        "Cystoscopy",
                        "CT abdomen",
                        "IV pyelogram",
                        "Ultrasound"
                    ],
                    "answer": 0,
                    "explanation": "PAINLESS gross HAEMATURIA in an adult (especially >50 years, smokers, occupational exposures) = BLADDER (urothelial) CANCER until proven otherwise → CYSTOSCOPY is the most appropriate/gold-standard diagnostic test (direct visualization + biopsy of the bladder). Complete the workup with CT UROGRAPHY (upper tracts — kidneys/ureters) + urine cytology. Painless haematuria in an older adult → cystoscopy.",
                    "source": "SMLE recall"
                },
                {
                    "q": "What is the most diagnostic investigation for renal scarring?",
                    "options": [
                        "Ultrasound",
                        "Renal MAG3 scan",
                        "DMSA"
                    ],
                    "answer": 2,
                    "explanation": "DMSA renal scan is the gold-standard imaging specifically sensitive for detecting cortical renal scarring, more sensitive than ultrasound or MAG3 (better for assessing drainage/obstruction).",
                    "source": "SMLE recall"
                },
                {
                    "q": "A 20-year-old woman presents with dysuria and suprapubic pain. Urinalysis shows positive nitrites and 10 WBCs. What is the most appropriate management?",
                    "options": [
                        "No intervention",
                        "Start empiric antibiotics",
                        "Send urine for culture and start empiric antibiotics"
                    ],
                    "answer": 1,
                    "explanation": "In a young woman with classic symptoms of uncomplicated cystitis and a urinalysis supporting a UTI, empiric antibiotics can be started without a urine culture, since culture is not routinely needed for simple, uncomplicated cystitis in women and would only delay treatment.",
                    "source": "SMLE recall"
                }
            ],
        },
    ],
};

export default specialtyNephrology;
