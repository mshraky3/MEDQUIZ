// Endocrinology & Infectious Diseases — medical-track section of the summaries catalog.
// Mirrored for the slide viewer in backend/content/summaryHtml (keep the two in sync).
// Inline questions are copied from the SQB bank.
const specialtyEndocrinologyInfectious = {
    id: "endocrinology-infectious",
    title: "Endocrinology & Infectious Diseases",
    title_en: "SMLE Review — 12 Topics",
    icon: "shield-check",
    accent: "#22d3ee",
    intro: "Endocrinology and infectious diseases for SMLE revision: Type 2 Diabetes · DKA, HHS & Hypoglycaemia · Thyroid Function · Sepsis, Line & Soft Tissue Infection · Brucellosis, TB & HIV · Diabetic Complications · Adrenal & Pituitary · Calcium & Bone · Urinary Tract Infection · Malaria, Dengue & Travel · Adult Vaccines & Exposure · Thyroid Nodules.",
    subtopics: [
        {
            id: "edi-diabetes",
            title: "01 — Diabetes: Diagnosis & Long-Term Care",
            title_en: "Criteria · Prevention · Drug choice · Targets",
            summaryHtml: `
<div class="deck-block deck-tbl"><table><thead><tr><th>Test</th><th>Prediabetes (ADA)</th><th>Diabetes</th></tr></thead><tbody>
<tr><td><b>Fasting glucose</b></td><td>5.6–6.9 mmol/L</td><td>7.0 or more</td></tr>
<tr><td><b>2-hour 75 g OGTT</b></td><td>7.8–11.0 mmol/L</td><td>11.1 or more</td></tr>
<tr><td><b>HbA1c</b></td><td>5.7–6.4%</td><td>6.5% or more</td></tr>
<tr><td><b>Random glucose</b></td><td>—</td><td>11.1 or more with classic symptoms</td></tr>
</tbody></table></div>
<ul>
  <li>Without unequivocal hyperglycaemia, <b>confirm an abnormal result</b> by repeat testing or a second abnormal test.</li>
  <li>HbA1c misleads with haemolysis, recent transfusion, haemoglobin variants, pregnancy and advanced kidney disease.</li>
  <li><b>Type 1</b>: autoantibodies (such as anti-GAD), low C-peptide, ketosis tendency. Needs insulin.</li>
</ul>
<h4 class="deck-topic">Prevention levels</h4>
<ul>
  <li><b>Primary</b>: stop disease starting (physical activity, about 150 minutes a week, healthy diet, weight loss of about 7%).</li>
  <li><b>Secondary</b>: screening for early detection. <b>Tertiary</b>: limit complications.</li>
</ul>
<h4 class="deck-topic">Choosing treatment in type 2</h4>
<ul>
  <li>Lifestyle for everyone. <b>Metformin</b> is the usual first drug for glucose lowering. Do not start it at eGFR 30–45; stop below 30.</li>
  <li><b>Established cardiovascular disease, heart failure or kidney disease</b>: add an <b>SGLT2 inhibitor</b> or <b>GLP-1 receptor agonist</b> with proven benefit, whatever the HbA1c (SGLT2 first for heart failure; both help the kidney).</li>
  <li>Weight is a priority: GLP-1 based therapy. Low cost is a priority: sulfonylurea (hypoglycaemia, weight gain) or pioglitazone (oedema; avoid in heart failure).</li>
  <li><b>Insulin</b> when catabolic, ketotic or with very high glucose (HbA1c above about 10%).</li>
  <li>HbA1c below target with hypoglycaemia risk, especially in older people: <b>reduce or stop the sulfonylurea or insulin</b>.</li>
</ul>
<h4 class="deck-topic">Targets and screening</h4>
<ul>
  <li>HbA1c below 7% for many adults; looser for frailty or limited life expectancy.</li>
  <li>BP usually below 130/80; statin for most aged 40–75; ACE inhibitor or ARB for albuminuria with hypertension.</li>
  <li>Eyes: at diagnosis in type 2, within 5 years in type 1. Urine albumin-creatinine ratio, eGFR and foot exam at least yearly (type 1 kidney screening from 5 years).</li>
  <li>Before pregnancy: good glucose control lowers congenital anomalies; add folic acid and review drugs.</li>
</ul>
<div class="sum-key">
  <span class="sum-key-title">نقاط امتحانية</span>
  <ul>
    <li>One borderline-diabetic result without symptoms: repeat it.</li>
    <li>Exercise and weight control are primary prevention; screening is secondary.</li>
    <li>Cardiorenal disease changes drug choice independently of HbA1c.</li>
    <li>Low C-peptide with positive anti-GAD: type 1 diabetes.</li>
  </ul>
</div>
`,
            questions: [
                {
                    "q": "An adult patient with a strong family history of diabetes has occasional thirst and fatigue. Fasting blood glucose is 7.5 mmol/L, with no A1c mentioned. What is the first priority in management?",
                    "options": [
                        "Start metformin as first-line management",
                        "Repeat the blood test to distinguish between prediabetes and diabetes"
                    ],
                    "answer": 1,
                    "explanation": "With only mild, occasional symptoms and a single elevated fasting glucose value (without a second confirmatory abnormal test or A1c), the diagnosis is not yet fully confirmed, so repeating testing to confirm the diagnosis is the appropriate first priority before starting treatment.",
                    "source": "SMLE recall"
                },
                {
                    "q": "Which of the following is the most appropriate intervention for primary prevention of type 2 diabetes?",
                    "options": [
                        "Screening",
                        "Pharmacotherapy",
                        "Physical activity",
                        "Bariatric surgery"
                    ],
                    "answer": 2,
                    "explanation": "T2DM primary prevention = lifestyle (lifestyle beats metformin: DPP trial showed 58% vs 31% reduction). Components: weight loss 5-10%, ≥150 min/week activity, Mediterranean/DASH diet, sleep, stress management.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A 43-year-old man comes to the clinic for a follow-up. He has been recently diagnosed with type 2 diabetes and has been following a plan of lifestyle measures to improve his diet and increase his level of exercise. HbA1c 6.9%. Which of the following is the most appropriate treatment option now?",
                    "options": [
                        "Insulin",
                        "Metformin",
                        "Sulphonylurea",
                        "Further diet and exercise"
                    ],
                    "answer": 1,
                    "explanation": "Core Concept: Initial pharmacological management of newly diagnosed Type 2 Diabetes Mellitus. Clinical Presentation: Polyuria, polydipsia, fatigue, or often asymptomatic. Diagnosis: HbA1c ≥ 6.5% or fasting glucose ≥ 126 mg/dL. Management: Lifestyle modifications are the foundation. Metformin is the gold standard, first-line pharmacological agent for T2DM, initiated alongside lifestyle modifications to preserve beta-cell function and ensure durable glycemic control. It decreases hepatic glucose production and improves insulin sensitivity without causing weight gain or hypoglycemia.",
                    "source": "SMLE bank"
                },
                {
                    "q": "A 16-year-old with no family history presents with symptoms of diabetes. C-peptide is low and anti-GAD antibodies are positive. What is the most likely diagnosis?",
                    "options": [
                        "DM1",
                        "DM2",
                        "MODY",
                        "LADA"
                    ],
                    "answer": 0,
                    "explanation": "Antibody positive + C-peptide low = type 1. Antibody negative + C-peptide preserved + family history = MODY.",
                    "source": "SMLE recall"
                },
                {
                    "q": "Which of the following is considered a secondary prevention for diabetes?",
                    "options": [
                        "Screening",
                        "Chronic diseases management",
                        "Education about healthy lifestyle",
                        "Immunization against infectious diseases"
                    ],
                    "answer": 0,
                    "explanation": "Core Concept: In public health, secondary prevention aims to detect a disease early in its asymptomatic phase and halt its progression. Screening asymptomatic populations for elevated blood glucose is the hallmark of secondary prevention for diabetes. Clinical Presentation: · Often completely asymptomatic in early type 2 diabetes. · Classic symptoms: Polyuria, polydipsia, polyphagia, and unexplained weight loss. · *Complications:* Diabetic retinopathy, nephropathy, neuropathy, and increased risk of major cardiovascular events. Diagnosis: · First-line: Fasting plasma glucose or Hemoglobin A1c (HbA1c) test. · Gold Standard: Oral Glucose Tolerance Test (OGTT), particularly useful in diagnosing gestational diabetes or borderline cases. Management: · Acute: Immediate lifestyle modifications (diet, exercise) and initiation of Metformin if indicated. · Long-term/Definitive: Tight glycemic control, regular monitoring for microvascular complications (fundoscopy, microalbuminuria screening), and management of cardiovascular risk factors.",
                    "source": "SMLE bank"
                }
            ],
        },
        {
            id: "edi-dm-emergencies",
            title: "02 — DKA, HHS & Hypoglycaemia",
            title_en: "Fluids · Potassium before insulin · Rescue glucose",
            summaryHtml: `
<div class="deck-block deck-tbl"><table><thead><tr><th>Feature</th><th>DKA</th><th>HHS</th></tr></thead><tbody>
<tr><td><b>Usual patient</b></td><td>Often type 1; faster onset</td><td>Older type 2; days to weeks</td></tr>
<tr><td><b>Glucose</b></td><td>Raised; can be near normal</td><td>Very high, often above 33 mmol/L</td></tr>
<tr><td><b>Ketones and pH</b></td><td>Ketosis, pH below 7.3 or bicarbonate below 18</td><td>Little ketosis or acidosis</td></tr>
<tr><td><b>Osmolality</b></td><td>Variable</td><td>High (above about 320)</td></tr>
</tbody></table></div>
<p>Find the trigger: <b>infection</b>, missed insulin, new diabetes, infarction, drugs. <b>SGLT2 inhibitors</b> can cause DKA with only mildly raised glucose.</p>
<div class="sum-algo">
  <span class="sum-algo-title">Adult DKA</span>
  <ol>
    <li><b>Isotonic fluid</b> first (about 1 L in the first hour if no contraindication).</li>
    <li>Check <b>potassium</b>. Below 3.5: replace it and <b>delay insulin</b>.</li>
    <li>3.5–5.0 with urine output: add potassium to fluids. Above 5.0: hold potassium and recheck often.</li>
    <li><b>IV regular insulin</b> infusion, commonly 0.1 unit/kg/hour.</li>
    <li>When glucose falls below about 14 mmol/L, <b>add dextrose and continue insulin</b> until ketosis clears.</li>
    <li>Give subcutaneous basal insulin <b>before stopping</b> the infusion, with an overlap.</li>
  </ol>
</div>
<ul>
  <li>Bicarbonate is not routine; consider only in very severe acidosis (pH below 7.0).</li>
  <li>HHS: fluids are the priority; lower osmolality gradually; insulin dosing is gentler and timed after initial fluid.</li>
  <li>Children are managed differently: avoid insulin boluses and watch for cerebral oedema.</li>
</ul>
<h4 class="deck-topic">Hypoglycaemia (below 3.9 mmol/L)</h4>
<ul>
  <li>Awake and able to swallow: <b>15–20 g fast sugar</b>, recheck after 15 minutes, repeat, then eat.</li>
  <li>Reduced consciousness: <b>IV dextrose</b>; no IV access: <b>glucagon</b> (IM or nasal).</li>
  <li>Sulfonylurea hypoglycaemia can recur: observe, often admit.</li>
  <li><b>Exercise</b>: check glucose, take extra carbohydrate and/or reduce insulin beforehand; delayed lows can occur overnight.</li>
  <li>Hypoglycaemia unawareness: relax targets for a while and use closer monitoring.</li>
  <li>Non-diabetic: confirm Whipple triad; measure insulin, C-peptide and drug screen during the episode.</li>
</ul>
<h4 class="deck-topic">In hospital</h4>
<ul>
  <li>Usual glucose target about 7.8–10 mmol/L. Use basal plus mealtime and correction insulin, not sliding scale alone. Never stop basal insulin in type 1.</li>
</ul>
<div class="sum-key">
  <span class="sum-key-title">نقاط امتحانية</span>
  <ul>
    <li>DKA: fluids and insulin, with potassium checked first.</li>
    <li>Low potassium means correct it before insulin.</li>
    <li>Falling glucose with persisting ketosis: add dextrose, keep insulin.</li>
    <li>Unconscious hypoglycaemia: IV dextrose or glucagon, nothing by mouth.</li>
  </ul>
</div>
`,
            questions: [
                {
                    "q": "Very short case A patient presents with diabetic ketoacidosis (DKA). Laboratory results show: Parameter Value Blood glucose: 380 mg/dl pH 7.15 Bicarbonate 15 mEq/L. What is the most appropriate initial management?",
                    "options": [
                        "Intravenous bicarbonate",
                        "Subcutaneous insulin",
                        "IV fluids and regular insulin"
                    ],
                    "answer": 2,
                    "explanation": "Core Concept: Diabetic Ketoacidosis (DKA) is a life-threatening acute complication of diabetes characterized by hyperglycemia, high anion gap metabolic acidosis, and ketonemia. The cornerstone of initial management is volume resuscitation and insulin therapy. Clinical Presentation: · Polyuria, polydipsia, nausea, vomiting, abdominal pain, Kussmaul respirations, and fruity breath odor. · Complications: Cerebral edema, severe dehydration, hypokalemia, coma. Diagnosis: · First-line tool: Capillary blood glucose, venous blood gas (pH < 7.3, bicarb < 18), and serum/urine ketones. · Gold standard: Laboratory confirmation of hyperglycemia, metabolic acidosis, and ketonemia. Management: · Acute: Aggressive IV fluid resuscitation (normal saline) is the absolute first step to restore perfusion, followed by continuous IV regular insulin infusion and careful electrolyte (potassium) replacement. · Long-term/Definitive: Transition to subcutaneous insulin once the anion gap closes and the patient can eat, alongside identifying and treating the precipitating cause (e.g., infection, non-compliance).",
                    "source": "SMLE bank"
                },
                {
                    "q": "A 60-year-old man with type 1 diabetes is on insulin lispro (rapid-acting) and glargine (long-acting). He works out after lunch and recently experienced hypoglycemia after exercise. What is the best way to prevent post-exercise hypoglycemia?",
                    "options": [
                        "Eat more carbohydrates before the workout",
                        "Change both insulins to a sulfonylurea",
                        "Skip lispro when working out",
                        "Dose glargine in the morning"
                    ],
                    "answer": 0,
                    "explanation": "Core Concept: Exercise increases insulin sensitivity and glucose uptake by muscles independently of insulin, increasing the risk of hypoglycemia in patients on insulin therapy. Clinical Presentation: · Sweating, tremors, palpitations, confusion during or after exercise. Diagnosis: · First-line tool: Capillary blood glucose monitoring during and after exercise. · Gold standard: Continuous Glucose Monitoring (CGM) to track trends and prevent hypoglycemic events. Management: · Acute: Consume fast-acting carbohydrates if blood glucose drops below 70 mg/dL. · Long-term/Definitive: To prevent post-exercise hypoglycemia, patients should eat additional carbohydrates before the workout or reduce the pre-exercise rapid-acting insulin dose. Basal insulin (glargine) usually does not need to be skipped.",
                    "source": "SMLE bank"
                }
            ],
        },
        {
            id: "edi-thyroid-function",
            title: "03 — Thyroid Function Disorders",
            title_en: "TFT patterns · Graves · Thyroiditis · Emergencies",
            summaryHtml: `
<div class="deck-block deck-tbl"><table><thead><tr><th>TSH</th><th>Free T4</th><th>Meaning</th></tr></thead><tbody>
<tr><td>High</td><td>Low</td><td>Primary hypothyroidism</td></tr>
<tr><td>High</td><td>Normal</td><td>Subclinical hypothyroidism</td></tr>
<tr><td>Low</td><td>High</td><td>Hyperthyroidism or thyroiditis</td></tr>
<tr><td>Low</td><td>Normal</td><td>Check T3; otherwise subclinical hyperthyroidism</td></tr>
<tr><td>Low or inappropriately normal</td><td>Low</td><td>Central hypothyroidism or severe non-thyroid illness</td></tr>
</tbody></table></div>
<h4 class="deck-topic">Hypothyroidism</h4>
<ul>
  <li><b>Hashimoto</b> is the usual autoimmune cause (anti-TPO). Also neck radiation, surgery, radioiodine, amiodarone, lithium.</li>
  <li>Features: fatigue, cold intolerance, constipation, weight gain, slow-relaxing reflexes, high cholesterol, low sodium.</li>
  <li><b>Levothyroxine</b> on an empty stomach, apart from iron and calcium. Recheck TSH after about 6 weeks. Start low in older or cardiac patients. In pregnancy the need rises.</li>
  <li>Subclinical: usually treat if TSH is 10 or more or in many pregnancy situations; otherwise individualise.</li>
  <li>Central disease: follow free T4, and <b>exclude or treat adrenal insufficiency first</b>.</li>
</ul>
<h4 class="deck-topic">Thyrotoxicosis</h4>
<div class="deck-cards">
  <div class="deck-card diag"><div class="deck-card-h">Graves disease</div><ul><li>Diffuse goitre, eye disease, TSH receptor antibodies</li><li><b>High diffuse uptake</b></li><li>Antithyroid drug, radioiodine or surgery</li></ul></div>
  <div class="deck-card clin"><div class="deck-card-h">Subacute thyroiditis</div><ul><li><b>Painful tender neck</b> after viral illness, <b>high ESR</b></li><li><b>Low uptake</b></li><li>NSAID, steroid if severe, beta blocker; no antithyroid drug</li></ul></div>
  <div class="deck-card mgmt"><div class="deck-card-h">Drug points</div><ul><li><b>Beta blocker</b> for early symptom control</li><li>Carbimazole or methimazole preferred; propylthiouracil in first trimester</li><li>Fever or sore throat: stop and check neutrophils</li></ul></div>
</div>
<ul>
  <li>Radioiodine is contraindicated in pregnancy and breastfeeding and may worsen significant eye disease.</li>
  <li>Toxic nodule or multinodular goitre: focal hot areas; radioiodine or surgery.</li>
</ul>
<h4 class="deck-topic">Emergencies</h4>
<ul>
  <li><b>Thyroid storm</b>: beta blocker, thionamide, then iodine <b>at least 1 hour later</b>, steroid, cooling and treat the trigger.</li>
  <li><b>Myxoedema coma</b>: supportive care, IV hydrocortisone first, then IV thyroid hormone.</li>
</ul>
<div class="sum-key">
  <span class="sum-key-title">نقاط امتحانية</span>
  <ul>
    <li>Painful thyroid with high ESR and suppressed TSH: subacute thyroiditis.</li>
    <li>Early symptom relief in thyrotoxicosis: beta blocker.</li>
    <li>High TSH with low T4: start levothyroxine.</li>
    <li>A near-normal TSH cannot exclude central hypothyroidism: measure free T4.</li>
  </ul>
</div>
`,
            questions: [
                {
                    "q": "A 28-year-old patient presents with a 10-day history of palpitations, sweating, and neck discomfort. BP 110/70, HR 116, temp 37.7, O2 sat 95%. Labs: free T4 76.5 (very elevated), TSH 0.15 (suppressed), WBC 5.2 (normal), ESR 73 (very elevated). Which of the following is the most likely diagnosis?",
                    "options": [
                        "Graves' disease",
                        "Subacute thyroiditis",
                        "Hashimoto's thyroiditis",
                        "Multinodular toxic goiter"
                    ],
                    "answer": 1,
                    "explanation": "Neck discomfort with an acute hyperthyroid phase and a markedly elevated ESR is a hallmark of subacute (de Quervain's) thyroiditis, distinguishing it from Graves' disease, which does not typically cause such a dramatically elevated ESR or neck pain.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A 20-year-old with diffusely enlarged thyroid, irregular pulse, high T4/3, low TSH. Initial symptomatic treatment?",
                    "options": [
                        "Methimazole",
                        "Propylthiouracil",
                        "Beta-blocker",
                        "Radioactive iodine"
                    ],
                    "answer": 2,
                    "explanation": "Separate symptom control from disease control. Beta-blockers act in hours and cover the adrenergic symptoms and the AF; thionamides take weeks because stored hormone must be depleted first; radioiodine and surgery are definitive. PTU is reserved for the first trimester and thyroid storm. Thyrotoxicosis, \"initial symptomatic treatment\" → beta-blocker.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A 45-year-old woman is referred to the Endocrinology Clinic due to abnormal thyroid function tests. Otherwise, she is asymptomatic. On examination, there is no evidence of goiter. TSH 15, T4 6.5. Which of the following is the most appropriate management plan?",
                    "options": [
                        "Reassure and discharge",
                        "Arrange for US of the neck",
                        "Repeat blood tests in 6 months",
                        "Start levothyroxine replacement"
                    ],
                    "answer": 3,
                    "explanation": "Core Concept: Primary hypothyroidism management. Clinical Presentation: Fatigue, weight gain, cold intolerance, and constipation. Diagnosis: First-line is serum TSH. If elevated, check Free T4. Primary hypothyroidism shows high TSH and low Free T4. Management: The gold standard treatment for overt primary hypothyroidism (TSH 15 is significantly elevated) is oral synthetic thyroxine (Levothyroxine) replacement. Even in asymptomatic subclinical hypothyroidism, treatment is indicated if TSH > 10 mIU/L to prevent progression and cardiovascular risks.",
                    "source": "SMLE bank"
                },
                {
                    "q": "A 60-year-old man is evaluated because of fatigue, constipation and cold intolerance for the last 8 months. Medical history is significant for Hodgkin lymphoma treated with radiation therapy 3 years ago and there is no family history of thyroid disorders. On physical examination, he has dry skin with mild periorbital edema and normal thyroid exam (see lab results). Test Result Normal Values Hb 120 130-170 g/L (Male) 120-160 g/L (Female) Sodium 129 134-146 mmol/L Thyroid-Stimulating Hormone 5.0 0.4 - 5.0 U/mL. Which of the following will establish diagnosis of hypothyroidism?",
                    "options": [
                        "Repeat TSH measurement in 4 weeks",
                        "Free thyroxine (T4) measurement",
                        "Thyroid ultrasound",
                        "Thyroid scan"
                    ],
                    "answer": 1,
                    "explanation": "Core Concept: Radiation-induced Hypothyroidism / Central Hypothyroidism suspicion. Clinical Presentation: · Fatigue, cold intolerance, constipation, dry skin, and periorbital edema. Diagnosis: · First-line: Serum TSH. In central hypothyroidism or early failing gland post-radiation, TSH may be inappropriately normal or low. · Gold standard: Free thyroxine (Free T4) measurement to confirm overt hypothyroidism when TSH is borderline/normal but clinical suspicion is high. Management: · Acute: Confirm diagnosis with Free T4. · Long-term/Definitive: Levothyroxine replacement therapy, titrated to normalize Free T4 (and TSH in primary hypothyroidism).",
                    "source": "SMLE bank"
                }
            ],
        },
        {
            id: "edi-sepsis-skin",
            title: "04 — Sepsis, Line & Soft Tissue Infection",
            title_en: "First hour · Vasopressor · MRSA · Necrotising fasciitis",
            summaryHtml: `
<h4 class="deck-topic">Definitions</h4>
<ul>
  <li><b>Sepsis</b>: life-threatening organ dysfunction from a dysregulated response to infection.</li>
  <li><b>Septic shock</b>: despite adequate fluid, needs a vasopressor to keep MAP at least 65 and lactate stays above 2 mmol/L.</li>
</ul>
<div class="sum-algo">
  <span class="sum-algo-title">Early bundle</span>
  <ol>
    <li>Measure <b>lactate</b> and repeat if raised.</li>
    <li><b>Blood cultures before antibiotics</b>, without causing important delay.</li>
    <li><b>Broad-spectrum IV antibiotic</b>, within 1 hour for shock or likely sepsis.</li>
    <li>Crystalloid for hypotension or lactate of 4 or more (often 30 mL/kg), with repeated reassessment.</li>
    <li>Still hypotensive: <b>noradrenaline</b> first; add vasopressin if needed; IV hydrocortisone for ongoing vasopressor need.</li>
    <li><b>Source control</b>: drain, debride or remove the infected device.</li>
  </ol>
</div>
<h4 class="deck-topic">Central line infection</h4>
<ul>
  <li>Fever or shock with a central catheter and no other source, especially with <b>parenteral nutrition</b>.</li>
  <li>Paired cultures from the line and a peripheral vein.</li>
  <li>Empirical cover: often vancomycin plus gram-negative cover; add antifungal if <i>Candida</i> risk is high.</li>
  <li>Remove the line for shock, <i>S. aureus</i>, <i>Candida</i>, <i>Pseudomonas</i>, tunnel infection or persistent bacteraemia.</li>
</ul>
<h4 class="deck-topic">MRSA bacteraemia</h4>
<ul>
  <li><b>Vancomycin</b> or daptomycin (daptomycin does not treat pneumonia). Repeat cultures until clear, echocardiography, find deep foci, treat at least 14 days.</li>
</ul>
<h4 class="deck-topic">Skin and soft tissue</h4>
<ul>
  <li>Non-purulent cellulitis: cover streptococci. <b>Abscess: drain</b>, cover <i>S. aureus</i> as risk indicates.</li>
  <li>Large deep abscess with fever in a diabetic: admit, IV antibiotics and surgical drainage.</li>
  <li><b>Necrotising fasciitis</b>: pain out of proportion, rapid spread beyond redness, bullae, crepitus, toxicity. <b>Urgent surgical debridement</b>; imaging and scores must not delay it. Antibiotics: broad cover (carbapenem or piperacillin-tazobactam), anti-MRSA drug, plus <b>clindamycin</b> to suppress toxin.</li>
  <li>Surgical site infection with pus: open and drain the wound, culture, add antibiotics for spreading or systemic infection.</li>
</ul>
<div class="sum-key">
  <span class="sum-key-title">نقاط امتحانية</span>
  <ul>
    <li>Hypotension after fluids: noradrenaline.</li>
    <li>Fever with parenteral nutrition through a central line: suspect line infection.</li>
    <li>MRSA in blood: vancomycin is the standard answer.</li>
    <li>Suspected necrotising fasciitis goes to theatre quickly.</li>
  </ul>
</div>
`,
            questions: [
                {
                    "q": "A 59-year-old with fever, chills, COPD, and diabetes is given a fluid bolus, and BP remains low. What is next?",
                    "options": [
                        "Dobutamine",
                        "Hydrocortisone",
                        "Norepinephrine",
                        "Another fluid bolus"
                    ],
                    "answer": 2,
                    "explanation": "Norepinephrine is the first-line vasopressor for septic shock refractory to initial fluid resuscitation, per standard sepsis management guidelines.",
                    "source": "SMLE recall"
                },
                {
                    "q": "48 y.o male recently ( didn’t specify the time of surgery) did extensive bowel resection and was on TPN via central line He developed pyrexia 39.2 for the last 12 hrs Vitals: BP 90/60 HR 123 RR 25 Labs: PLT 500 WBC 27 Bicarb 12 What is the cause of fever?",
                    "options": [
                        "Pneumonia",
                        "Central venous line infection",
                        "Deep vein thrombosis",
                        "ARDS"
                    ],
                    "answer": 1,
                    "explanation": "TPN line + sepsis with no other source = line infection. Remove the line in septic shock.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A 67-year-old diabetic patient admitted to Intensive Care Unit with sepsis and urinary tract infection. Blood culture revealed methicillin-resistant staphylococcus aureus. Which of the following is the most appropriate treatment option?",
                    "options": [
                        "Cefuroxime",
                        "Vancomycin",
                        "Gentamycin",
                        "Flucioxacillin"
                    ],
                    "answer": 1,
                    "explanation": "Core Concept: Methicillin-resistant *Staphylococcus aureus* (MRSA) possesses the *mecA* gene, which encodes for penicillin-binding protein 2a (PBP2a), conferring resistance to almost all beta-lactam antibiotics (including penicillins, cephalosporins, and carbapenems). Clinical Presentation: · Sepsis: Fever, tachycardia, tachypnea, hypotension, altered mental status. · Source-specific symptoms (e.g., dysuria and flank pain for UTI, though MRSA UTI is rare and usually implies hematogenous spread or catheterization). Diagnosis: · First-line: Blood and urine cultures, Gram stain (Gram-positive cocci in clusters). · Gold standard: Culture and sensitivity testing confirming resistance to oxacillin/cefoxitin. Management: · Acute: Hemodynamic support, source control, and immediate empiric MRSA coverage. · Long-term/Definitive: Intravenous Vancomycin (a glycopeptide antibiotic) is the cornerstone of therapy for severe MRSA infections. Therapeutic drug monitoring (trough levels) is required. Alternatives include daptomycin or linezolid.",
                    "source": "SMLE bank"
                },
                {
                    "q": "Diabetic patient, came with a pain that is out proportion, Bulle, Crepitus, pain extends further than the erythema I think there was discharge? weak pulse What to do next?",
                    "options": [
                        "LOCAL Debridement and IV Abx",
                        "Conservative wound healing",
                        "Fasciotomy and aggressive multiple Debridement",
                        "X ray"
                    ],
                    "answer": 2,
                    "explanation": "In a diabetic patient, pain out of proportion, bullae, crepitus and tenderness beyond the redness indicate necrotizing soft-tissue infection. This is a surgical emergency: urgent aggressive and repeated debridement, with fasciotomy as needed, plus broad-spectrum IV antibiotics and resuscitation. Limited local debridement or conservative care is inadequate, and an X-ray must not delay surgery.",
                    "source": "SMLE recall"
                }
            ],
        },
        {
            id: "edi-brucella-tb-hiv",
            title: "05 — Brucellosis, Tuberculosis & HIV",
            title_en: "Raw milk fever · Latent TB · Opportunistic prophylaxis",
            summaryHtml: `
<h4 class="deck-topic">Brucellosis</h4>
<ul>
  <li>Source: <b>unpasteurised milk</b> or dairy, livestock contact (farmer, <b>veterinarian</b>, butcher, lab worker).</li>
  <li>Fever, sweats, fatigue, arthralgia, <b>back pain, sacroiliitis</b>, hepatosplenomegaly; counts normal or low. Orchitis, neurological disease and endocarditis occur.</li>
  <li>Diagnosis: <b>serology</b> and blood culture (small gram-negative coccobacilli; warn the lab).</li>
</ul>
<div class="deck-block deck-tbl"><table><thead><tr><th>Patient</th><th>Usual regimen</th></tr></thead><tbody>
<tr><td>Adult, uncomplicated</td><td>Doxycycline 6 weeks plus streptomycin (2–3 weeks) or gentamicin (about 1 week); or doxycycline plus rifampicin 6 weeks</td></tr>
<tr><td>Child under 8 years</td><td><b>Co-trimoxazole plus rifampicin</b>, at least 6 weeks</td></tr>
<tr><td>Spine, brain or heart valve</td><td>Combination of usually 3 drugs, 3 months or longer</td></tr>
</tbody></table></div>
<ul><li>Never use a single drug: relapse is common.</li></ul>
<h4 class="deck-topic">Tuberculosis</h4>
<ul>
  <li>Positive tuberculin skin test: <b>5 mm or more</b> with HIV, close contact, major immunosuppression or old fibrotic changes; 10 mm for other risk groups; 15 mm without risk.</li>
  <li><b>Exclude active TB</b> first (symptoms, chest film).</li>
  <li>Latent TB: short rifamycin-based courses are now often preferred; isoniazid with <b>pyridoxine</b> for 6–9 months is an accepted option. Check interactions with antiretrovirals.</li>
  <li>Drug-sensitive active TB: isoniazid, rifampicin, pyrazinamide, ethambutol for 2 months, then isoniazid and rifampicin for 4. <b>Airborne isolation</b>.</li>
  <li>Toxicity: isoniazid (neuropathy, liver), rifampicin (orange fluids, interactions), pyrazinamide (liver, urate), ethambutol (<b>optic neuritis</b>).</li>
</ul>
<h4 class="deck-topic">HIV</h4>
<ul>
  <li>Screen with a fourth-generation antigen/antibody test, then confirm. Very early infection may need viral RNA.</li>
  <li>Offer <b>antiretroviral therapy to everyone</b> promptly; timing is delayed in some central nervous system infections.</li>
  <li>CD4 below 200: <b>co-trimoxazole</b> for <i>Pneumocystis</i> (it also covers toxoplasma at lower counts).</li>
  <li>Post-exposure prophylaxis: start as soon as possible, <b>within 72 hours</b>, for 28 days.</li>
  <li>Protect confidentiality; counsel and support disclosure to partners, following local notification rules.</li>
</ul>
<div class="sum-key">
  <span class="sum-key-title">نقاط امتحانية</span>
  <ul>
    <li>Raw milk, fever and back pain: brucellosis serology.</li>
    <li>Young child with brucellosis: avoid doxycycline.</li>
    <li>HIV with a 6 mm skin test and clear chest film: treat latent TB.</li>
    <li>Ethambutol: check vision.</li>
  </ul>
</div>
`,
            questions: [
                {
                    "q": "6 years old Patient with clear case of brucellosis. Hx of Drink raw milk patint had pain in the knee. Which if the following is the first line treatment ?",
                    "options": [
                        "Trimethoprim-Sulfamethoxazole + Rifampicin for 6 week",
                        "Doxycycline + Rifampicin for 6 week",
                        "Ciprofloxacin for 4 week",
                        "Ceftriaxone for 4 week"
                    ],
                    "answer": 0,
                    "explanation": "Brucellosis in a child <8 uses TMP-SMX + rifampicin for 6 weeks (doxycycline is avoided under 8). Childhood brucellosis → TMP-SMX + rifampicin (avoid doxycycline).",
                    "source": "SMLE recall"
                },
                {
                    "q": "man presents to ER with fever, rigors and chills He also reports back pain, he has history of drinking unpasteurized milk. What is the most appropriate lab test?",
                    "options": [
                        "TB test",
                        "MRI spine",
                        "Brucellosis serology"
                    ],
                    "answer": 2,
                    "explanation": "Fever, rigors and back pain after drinking unpasteurised milk suggest brucellosis with possible spinal involvement. Brucella serology (agglutination titres) is the key test, supported by blood cultures. MRI spine shows spondylitis but not its cause, and TB testing is the main differential if serology is negative. Treat with combination antibiotics for at least 6 weeks.",
                    "source": "SMLE recall"
                },
                {
                    "q": "An HIV-positive patient has a positive skin test measuring 6 mm. Chest X-ray is normal. What is the most appropriate treatment?",
                    "options": [
                        "Isoniazid (INH) + Pyridoxine for 3 months",
                        "Isoniazid (INH) + Pyridoxine for 9 months",
                        "Full TB treatment for 9 months"
                    ],
                    "answer": 1,
                    "explanation": "In a person with HIV, a tuberculin test of 5 mm or more is positive. A normal chest X-ray (with no symptoms) means latent infection, which is treated with isoniazid plus pyridoxine for 9 months to prevent reactivation; pyridoxine prevents neuropathy. A 3-month course of isoniazid alone is too short, and full multidrug treatment is for active disease. Shorter rifamycin regimens exist but may interact with antiretrovirals.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A 43-year-old veterinarian man presents with 2-months history of progressive fatigue, back pain and fever. He also noticed a recent history of headache, mood /behaviour changes and paraesthesia. He is does not smoke with no history of alcohol or other significant medical history. On examination, he was uncooperative and agitated. Abdomen examination showed mild hepatosplenomegaly and tender right sacroiliac joint. Which of the following is the most likely diagnosis?",
                    "options": [
                        "Syphilis",
                        "Brucellosis",
                        "Tuberculosis",
                        "Toxoplasmosis"
                    ],
                    "answer": 1,
                    "explanation": "Core Concept: Brucellosis is a zoonotic infection caused by *Brucella* species. It is an occupational hazard for veterinarians, farmers, and slaughterhouse workers, transmitted via direct contact with infected animals or consumption of unpasteurized dairy. Clinical Presentation: · Undulant (rising and falling) fever, profuse malodorous sweating, profound fatigue. · Osteoarticular involvement is most common: sacroiliitis (tender SI joint), spondylitis, and peripheral arthritis. · Hepatosplenomegaly and neurobrucellosis (headache, mood changes, neuropathy). Diagnosis: · First-line: Blood cultures (requires prolonged incubation) and serology. · Gold standard: Standard Tube Agglutination (STA) test or bone marrow culture (highest yield). Management: · Acute: Initiation of combination antibiotic therapy to prevent relapse. · Long-term/Definitive: Doxycycline combined with Rifampin or an Aminoglycoside (Streptomycin/Gentamicin) for at least 6 weeks (longer for complicated disease).",
                    "source": "SMLE bank"
                }
            ],
        },
        {
            id: "edi-dm-complications",
            title: "06 — Diabetic Complications & the Foot",
            title_en: "Neuropathy · Ischaemia · Ulcer · Kidney · Gastroparesis",
            summaryHtml: `
<h4 class="deck-topic">Which foot problem?</h4>
<div class="deck-block deck-tbl"><table><thead><tr><th>Feature</th><th>Neuropathic</th><th>Ischaemic</th></tr></thead><tbody>
<tr><td><b>Site</b></td><td>Pressure points, sole</td><td>Toes, edges, heel</td></tr>
<tr><td><b>Pain</b></td><td>Often painless</td><td>May be painful (can be masked)</td></tr>
<tr><td><b>Foot</b></td><td>Warm, pulses present, callus</td><td>Cool, weak or absent pulses</td></tr>
<tr><td><b>Key test</b></td><td><b>10 g monofilament</b></td><td><b>Ankle-brachial index</b></td></tr>
</tbody></table></div>
<ul>
  <li>ABI of 0.9 or less indicates arterial disease. Above about 1.3 suggests stiff calcified arteries: use <b>toe pressures</b> or waveforms.</li>
  <li>Ulcer care: <b>offloading</b>, debridement, moist dressing, infection treatment, glucose control, revascularisation if ischaemic. Total contact cast suits many non-ischaemic, uninfected plantar ulcers.</li>
  <li>Negative pressure (vacuum) therapy helps selected clean, debrided large wounds; not over dead tissue or untreated infection.</li>
  <li>Infection is a <b>clinical</b> diagnosis. Culture deep tissue after cleaning. Probing to bone suggests <b>osteomyelitis</b>: X-ray, then MRI; bone biopsy is the reference.</li>
  <li><b>Charcot foot</b>: warm swollen foot with neuropathy, little pain: immobilise and offload.</li>
</ul>
<h4 class="deck-topic">Neuropathy</h4>
<ul>
  <li>Distal symmetrical sensory loss is commonest. Exclude B12 deficiency (especially on metformin) and other causes.</li>
  <li>Painful neuropathy options: <b>duloxetine, pregabalin, gabapentin</b> or a tricyclic; choose by age, heart and kidney status.</li>
  <li><b>Gastroparesis</b>: early fullness, bloating, vomiting, erratic glucose after meals. Exclude obstruction by endoscopy, then confirm with a <b>gastric emptying scintigraphy study</b>. Small low-fat, low-fibre meals; prokinetic.</li>
  <li>Autonomic signs: postural hypotension, resting tachycardia, bladder and erectile dysfunction.</li>
</ul>
<h4 class="deck-topic">Kidney and eye</h4>
<ul>
  <li>Albuminuria: confirm with 2 of 3 samples over 3–6 months (30 mg/g or more).</li>
  <li>Protect with glucose and BP control, <b>ACE inhibitor or ARB</b> (never both), SGLT2 inhibitor; further agents in selected patients. Check potassium and creatinine.</li>
  <li>Proliferative retinopathy: urgent ophthalmology (anti-VEGF or laser).</li>
</ul>
<div class="sum-key">
  <span class="sum-key-title">نقاط امتحانية</span>
  <ul>
    <li>Numb foot: monofilament.</li>
    <li>Cold pulseless foot: ankle-brachial index first.</li>
    <li>Bloating with unpredictable post-meal glucose in long diabetes: study gastric emptying.</li>
    <li>Offloading is central to healing a neuropathic ulcer.</li>
  </ul>
</div>
`,
            questions: [
                {
                    "q": "A diabetic patient presents with a foot ulcer. The ulcer is well demarcated, and examination shows absent distal pulses and cold extremities. What is the initial diagnostic test?",
                    "options": [
                        "Doppler ultrasound",
                        "Foot pressure points",
                        "Ankle–brachial index (ABI)",
                        "CT angiography"
                    ],
                    "answer": 2,
                    "explanation": "Cold feet, absent pulses and a well-demarcated ulcer suggest an ischemic component. The first test is the ankle-brachial index, a quick, noninvasive measure of arterial supply. Doppler imaging and CT angiography map the lesion later. In diabetes, calcified arteries can falsely raise ABI, so toe pressures may be needed.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A diabetic patient presents with a non-healing foot ulcer and numbness. On examination, the ulcer shows central erythema, and the patient is unable to perceive touch and sensation. What is the most critical test to perform to reach the diagnosis?",
                    "options": [
                        "Ankle-brachial index",
                        "Monofilament test",
                        "Assessment of pressure points"
                    ],
                    "answer": 1,
                    "explanation": "The emphasis on numbness and inability to perceive touch points to peripheral neuropathy as the key underlying factor in this diabetic foot ulcer; the monofilament test is the standard bedside tool to assess and quantify protective sensation loss, confirming diabetic peripheral neuropathy as the diagnosis.",
                    "source": "SMLE recall"
                },
                {
                    "q": "patient ~46 years male with type 1 diabetes mellitus for >20 years, on insulin, presented with abdominal bloating and occasional epigastric discomfort. The question also mentioned something regarding a delayed/late postprandial rise in blood glucose in relation to the insulin response. Most appropriate investigation:",
                    "options": [
                        "US",
                        "CT",
                        "Endoscopy",
                        "Nuclear scan"
                    ],
                    "answer": 3,
                    "explanation": "Long-standing type 1 diabetes with bloating, epigastric discomfort and a delayed rise in glucose after meals suggests diabetic gastroparesis. The key test is a nuclear medicine gastric emptying study (scintigraphy), which measures how fast a meal leaves the stomach. Endoscopy is usually done first to exclude obstruction but cannot measure emptying. Ultrasound and CT are less useful.",
                    "source": "SMLE recall"
                }
            ],
        },
        {
            id: "edi-adrenal-pituitary",
            title: "07 — Adrenal & Pituitary",
            title_en: "Cushing · Insufficiency · Incidentaloma · Prolactinoma",
            summaryHtml: `
<h4 class="deck-topic">Cushing syndrome</h4>
<ol>
  <li>Exclude <b>steroid medicines</b> (commonest cause overall).</li>
  <li>Prove excess with abnormal tests, usually two: 1 mg overnight dexamethasone suppression, 24-hour urine free cortisol, late-night salivary cortisol.</li>
  <li>Measure <b>ACTH</b>. Low: adrenal source, CT. Not suppressed: pituitary or ectopic; pituitary MRI, with further testing or petrosal sinus sampling if unclear.</li>
</ol>
<ul>
  <li>High ACTH: <b>pituitary adenoma</b> (Cushing disease) is most common. Fast onset, low potassium and pigmentation suggest ectopic ACTH.</li>
  <li>After removing a cortisol source the suppressed axis cannot respond: give <b>stress-dose hydrocortisone, then taper</b> slowly with testing.</li>
</ul>
<h4 class="deck-topic">Adrenal insufficiency</h4>
<ul>
  <li><b>Primary</b>: high ACTH, <b>pigmentation, high potassium</b>, low sodium. <b>Secondary</b>: low or normal ACTH, no pigmentation, potassium usually normal. Sudden steroid withdrawal is a common cause.</li>
  <li>Test: morning cortisol, ACTH stimulation.</li>
  <li><b>Crisis</b>: take blood if instant, then <b>IV hydrocortisone 100 mg</b>, ongoing dosing, saline, glucose. Never wait for results.</li>
  <li>Teach sick-day dose increases. Primary disease also needs fludrocortisone.</li>
</ul>
<h4 class="deck-topic">Adrenal incidentaloma</h4>
<ul>
  <li>Most are <b>non-functioning adenomas</b>.</li>
  <li>Test for cortisol excess and phaeochromocytoma (metanephrines; may be omitted for clearly lipid-rich lesions in some guidelines); aldosterone-renin ratio if hypertension or low potassium.</li>
  <li>Surgery for functioning or suspicious lesions. No biopsy before excluding phaeochromocytoma.</li>
  <li>Phaeochromocytoma surgery: <b>alpha blocker before beta blocker</b>.</li>
</ul>
<h4 class="deck-topic">Pituitary</h4>
<ul>
  <li><b>Prolactinoma</b>: galactorrhoea, amenorrhoea, infertility, low libido. First exclude pregnancy, hypothyroidism, kidney failure and drugs (antipsychotics, metoclopramide). <b>Cabergoline</b> is first line, even for most large tumours.</li>
  <li><b>Sheehan syndrome</b>: after postpartum bleeding; no lactation, no periods, fatigue. Replace cortisol before thyroid hormone.</li>
  <li><b>Acromegaly</b>: IGF-1, then glucose suppression test; surgery first.</li>
  <li><b>Diabetes insipidus</b> (arginine vasopressin deficiency or resistance): dilute urine; water deprivation or copeptin testing.</li>
</ul>
<div class="sum-key">
  <span class="sum-key-title">نقاط امتحانية</span>
  <ul>
    <li>Confirm hypercortisolism before looking for its source.</li>
    <li>Small prolactinoma with symptoms: cabergoline.</li>
    <li>Incidental adrenal mass: usually a silent adenoma, but still test hormones.</li>
    <li>After adrenalectomy for cortisol excess: replace steroid and taper.</li>
  </ul>
</div>
`,
            questions: [
                {
                    "q": "A patient has had Cushingoid features for 4 months. Laboratory investigations show: HIGH cortisol and HIGH ACTH. What is the most likely cause?",
                    "options": [
                        "Pituitary adenoma",
                        "Adrenal adenoma",
                        "Iatrogenic",
                        "Carcinoid syndrome"
                    ],
                    "answer": 0,
                    "explanation": "Cushing's syndrome ACTH interpretation: HIGH ACTH (ACTH-dependent) → pituitary adenoma = Cushing's DISEASE (most common, ~80% of ACTH-dependent) or ectopic ACTH (SCLC, carcinoid — very high ACTH, hypokalaemia). LOW ACTH (ACTH-independent) → adrenal adenoma/carcinoma or exogenous steroids (iatrogenic = commonest overall, suppresses ACTH+cortisol). Distinguish pituitary vs ectopic: high-dose dexamethasone suppression, CRH test, petrosal sinus sampling.",
                    "source": "SMLE recall"
                },
                {
                    "q": "adrenalectomy for a cortisol-secreting adenoma causing Cushing’s syndrome. Which of the following postoperative management plans is most appropriate for this patient?",
                    "options": [
                        "stess dose IV hydrocortisone and taper gradually",
                        "Lifelong steroid",
                        "Stop steroids",
                        "Fluconzole to mantine sodium"
                    ],
                    "answer": 0,
                    "explanation": "Core Concept: In Cushing's syndrome caused by a unilateral cortisol-secreting adrenal adenoma, the chronic autonomous hypercortisolism profoundly suppresses the hypothalamic-pituitary-adrenal (HPA) axis and causes atrophy of the contralateral adrenal gland. Clinical Presentation: · Postoperative risk of acute adrenal crisis (hypotension, shock, hypoglycemia) if glucocorticoids are not supplemented. Diagnosis: · First-line tool: Clinical diagnosis of Cushing's syndrome and imaging of the adrenal glands. · Gold standard: Histopathological confirmation of the adenoma post-resection. Management: · Acute: Perioperative stress-dose IV hydrocortisone is mandatory to prevent acute adrenal insufficiency during the surgical stress response. · Long-term/Definitive: Gradual tapering to oral physiological replacement doses of glucocorticoids (e.g., hydrocortisone) until the suppressed HPA axis and contralateral adrenal gland recover, which can take several months to over a year. Lifelong steroids are not needed unless bilateral adrenalectomy was performed.",
                    "source": "SMLE bank"
                },
                {
                    "q": "A 39-year-old man incidentally found to have a 2-cm left adrenal gland mass while undergoing CT of the abdomen to investigate the cause of pelvic pain. Which one of the following is the most common cause of an incidentally detected adrenal mass?",
                    "options": [
                        "Subclinical cushing's disease",
                        "Adrenocortical carcinoma",
                        "Non-functional adenoma",
                        "Conn's syndrome"
                    ],
                    "answer": 2,
                    "explanation": "Most incidentally found adrenal masses (adrenal incidentalomas) are benign, hormonally non-functioning adrenocortical adenomas — but each needs a hormonal screen (cortisol, metanephrines, aldosterone) and imaging assessment. Adrenal incidentaloma → most commonly a non-functional adenoma.",
                    "source": "SMLE recall"
                },
                {
                    "q": "35-year-old women comes to the clinic complaining of infertility for 3 years. She notices excessive breast milk production for 4 months. The physical examination is unremarkable (see lab results and report). Blood pressure 130/80 mmHg Heart rate 80 /min Respiratory rate 18 /min Temperature 37.2° C Test Result Normal Values Thyroxine (T4 free) 12.4 8.5 - 15.2 pmol/L Thyroid-Stimulating Hormone 1.2 0.4 - 5.0 mU/L Prolactin 1452 < 870 pmol/L Brain MRI: Well defined pituitary mass about 0.7 cm, which represent an adenoma. Which of the following is the most appropriate treatment?",
                    "options": [
                        "Surgery",
                        "Cabergoline",
                        "Observation",
                        "Radiotherapy"
                    ],
                    "answer": 1,
                    "explanation": "Core Concept: Prolactinoma, the most common secretory pituitary adenoma, causing hyperprolactinemia which suppresses GnRH leading to hypogonadism (infertility, amenorrhea, galactorrhea). Clinical Presentation: · Galactorrhea, oligomenorrhea/amenorrhea, infertility, decreased libido, and potentially mass effect symptoms (headaches, bitemporal hemianopsia) if it is a macroadenoma (>1 cm). Diagnosis: · First-line: Serum prolactin level (markedly elevated, usually >200 ng/mL). · Gold Standard: Contrast-enhanced pituitary MRI to visualize the adenoma and assess proximity to the optic chiasm. Management: · Acute & Long-term management: Unlike other pituitary tumors, the first-line and gold standard treatment for prolactinomas (both micro and macro) is medical therapy with Dopamine Agonists (Cabergoline or Bromocriptine). These medications rapidly shrink the tumor and normalize prolactin levels. Surgery (transsphenoidal resection) is strictly reserved for patients intolerant of or resistant to dopamine agonists, or those with acute pituitary apoplexy.",
                    "source": "SMLE bank"
                }
            ],
        },
        {
            id: "edi-calcium-bone",
            title: "08 — Calcium & Bone",
            title_en: "PTH logic · Severe hypercalcaemia · Osteoporosis",
            summaryHtml: `
<h4 class="deck-topic">High calcium: check PTH</h4>
<ul>
  <li><b>PTH high or inappropriately normal</b>: primary hyperparathyroidism (usually one adenoma; low phosphate). Also lithium and familial hypocalciuric hypercalcaemia (very low urine calcium; no surgery).</li>
  <li><b>PTH suppressed</b>: malignancy (PTHrP, bone spread, myeloma), granuloma, vitamin D excess, thyrotoxicosis, thiazides can unmask disease.</li>
  <li>Low vitamin D can coexist with primary hyperparathyroidism.</li>
  <li><b>Parathyroidectomy</b>: symptoms or stones; also silent disease with age under 50, calcium over 0.25 mmol/L above normal, osteoporosis or fracture, reduced kidney function, or high urine calcium and renal risk. Imaging is for planning, not diagnosis.</li>
</ul>
<h4 class="deck-topic">Severe hypercalcaemia</h4>
<ol>
  <li><b>IV isotonic saline</b> first.</li>
  <li>Calcitonin for rapid short-lived effect.</li>
  <li>IV bisphosphonate (slower, longer); denosumab if kidney function limits.</li>
  <li>Steroid for vitamin D-driven causes; dialysis if refractory. Loop diuretic only for fluid overload.</li>
</ol>
<h4 class="deck-topic">Low calcium</h4>
<ul>
  <li>After thyroid surgery: perioral tingling, cramps from <b>hypoparathyroidism</b>.</li>
  <li>Chvostek and Trousseau signs, long QT. Severe or symptomatic: <b>IV calcium gluconate</b>; otherwise oral calcium and active vitamin D. Correct magnesium. Correct calcium for albumin or measure ionised.</li>
</ul>
<div class="deck-block deck-tbl"><table><thead><tr><th>Disorder</th><th>Calcium</th><th>Phosphate</th><th>PTH</th><th>ALP</th></tr></thead><tbody>
<tr><td><b>Osteomalacia (low vitamin D)</b></td><td>Low or normal</td><td>Low</td><td>High</td><td>High</td></tr>
<tr><td><b>Hypoparathyroidism</b></td><td>Low</td><td>High</td><td>Low</td><td>Normal</td></tr>
<tr><td><b>Osteoporosis</b></td><td>Normal</td><td>Normal</td><td>Normal</td><td>Normal</td></tr>
<tr><td><b>Paget disease</b></td><td>Normal</td><td>Normal</td><td>Normal</td><td>High</td></tr>
</tbody></table></div>
<h4 class="deck-topic">Osteoporosis</h4>
<ul>
  <li>DEXA <b>T-score of −2.5 or lower</b>, or a typical fragility fracture.</li>
  <li>Screen women from <b>65</b>, earlier after menopause with risk factors (steroids, low weight, smoking, <b>heavy alcohol</b>, parental hip fracture).</li>
  <li>Exercise, fall prevention, calcium and vitamin D; <b>bisphosphonate</b> is usual first line (alendronate: plain water, upright for 30 minutes). Avoid or caution with poor kidney function.</li>
  <li>Do not stop denosumab without follow-on therapy: rebound fractures.</li>
</ul>
<div class="sum-key">
  <span class="sum-key-title">نقاط امتحانية</span>
  <ul>
    <li>Calcium high with PTH not suppressed: primary hyperparathyroidism.</li>
    <li>First treatment for severe hypercalcaemia: IV saline.</li>
    <li>Numbness around the mouth after thyroidectomy: low calcium.</li>
    <li>Isolated raised ALP with bone pain in an older adult: consider Paget disease.</li>
  </ul>
</div>
`,
            questions: [
                {
                    "q": "A patient presents with fatigue and nausea. Serum calcium is 3.5 mmol/L. What is the initial management?",
                    "options": [
                        "IV fluids",
                        "Calcitonin"
                    ],
                    "answer": 0,
                    "explanation": "Calcium of 3.5 mmol/L with symptoms is severe hypercalcemia. First treatment is aggressive IV isotonic saline, because patients are dehydrated and fluids increase renal calcium excretion. Calcitonin gives a fast temporary extra effect, and bisphosphonates are added for sustained control.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A 56-year-old woman presented with generalized muscle and bone ache associated with abdominal cramps that is relieved by drinking cold milk (see lab results). Test Result Normal Values Calcium 2.85 2.15-2.62 mmol/L Calcium ionised 1.9 1.1-1.3 mmol/L Phosphate, inorganic 0.71 0.82-1.51 mmol/L Parathyroid hormone (intact PTH levels) 5.5 1.1-5.3 pmol/L 25-Hydroxy Vitamin D3 (Women) 15 25-90 mol/L Which of the following is the most likely diagnosis?",
                    "options": [
                        "Milk alkali syndrome",
                        "Idiopathic hypercalcemia",
                        "Primary hyperparathyroidism",
                        "Secondary hyperparathyroidism"
                    ],
                    "answer": 2,
                    "explanation": "Primary HPT: ↑Ca + ↓PO4 + ↑PTH. Secondary HPT (CKD, vit D def): ↑PTH but ↓ or normal Ca + ↑PO4 (CKD). Tertiary HPT: autonomous glands after long secondary, ↑Ca + ↑PTH. Symptoms: stones, bones, groans, moans, psychic overtones. Surgery if symptomatic or significant.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A patient after total thyroidectomy present with numbness around the mouth and peripheral limbs. What is the cause?",
                    "options": [
                        "Hypoparathyroidism",
                        "Injury recurrent laryngeal nerve"
                    ],
                    "answer": 0,
                    "explanation": "Core Concept: Transient or permanent hypoparathyroidism is a known complication of total thyroidectomy due to inadvertent removal, trauma, or devascularization of the parathyroid glands, leading to acute hypocalcemia. Clinical Presentation: · Perioral numbness (tingling around the mouth) and peripheral paresthesias (fingertips/toes). · Muscle cramps, carpopedal spasm, and tetany. · Positive Chvostek's sign (facial twitching) and Trousseau's sign (carpal spasm with BP cuff). Diagnosis: · First-line: Serum total and ionized calcium levels (will be low), along with intact PTH (will be inappropriately low or undetectable). · Gold Standard: Correlation of low calcium and low PTH in the post-operative setting. ECG may show a prolonged QT interval. Management: · Acute: IV calcium gluconate for severe, symptomatic hypocalcemia (e.g., tetany, seizures, prolonged QT). · Long-term: Oral calcium supplementation combined with active Vitamin D (calcitriol) to enhance intestinal calcium absorption.",
                    "source": "SMLE bank"
                }
            ],
        },
        {
            id: "edi-uti",
            title: "09 — Urinary Tract Infection",
            title_en: "Bacteriuria · Pyelonephritis · When to image",
            summaryHtml: `
<h4 class="deck-topic">Asymptomatic bacteriuria</h4>
<ul>
  <li>A positive culture without urinary symptoms usually needs <b>no antibiotic</b>: including most older adults, people with diabetes and catheterised patients.</li>
  <li>Main exceptions: <b>pregnancy</b> and before urological procedures that breach the mucosa. Special transplant situations are individualised.</li>
  <li>Postpartum is not pregnancy: an incidental symptom-free result is not treated.</li>
</ul>
<div class="deck-cards">
  <div class="deck-card diag"><div class="deck-card-h">Cystitis</div><ul><li>Dysuria, frequency, no fever or flank pain</li><li>Options: nitrofurantoin (about 5 days), fosfomycin single dose, co-trimoxazole 3 days if resistance is low</li></ul></div>
  <div class="deck-card mgmt"><div class="deck-card-h">Pyelonephritis</div><ul><li>Fever, flank pain</li><li>Culture first; ceftriaxone or a fluoroquinolone where resistance allows</li><li>Admit if unstable, vomiting, pregnant or high risk</li><li>Do not use nitrofurantoin or oral fosfomycin routinely</li></ul></div>
  <div class="deck-card clin"><div class="deck-card-h">Complicating factors</div><ul><li>Obstruction, stones, catheter, abnormal tract</li><li>Immunosuppression, kidney disease, poorly controlled diabetes</li><li>Male patients need careful assessment, including prostatitis</li></ul></div>
</div>
<h4 class="deck-topic">Not improving</h4>
<ul>
  <li>Still febrile after about <b>48–72 hours</b> of an antibiotic the organism is sensitive to: <b>image</b> for obstruction or abscess. Ultrasound is a safe start; CT gives more detail.</li>
  <li>Infected obstructed kidney: <b>urgent decompression</b> (stent or nephrostomy) plus antibiotics.</li>
  <li>Emphysematous pyelonephritis (gas, often diabetes) is an emergency.</li>
</ul>
<h4 class="deck-topic">Special groups</h4>
<ul>
  <li><b>Older adult with delirium</b>: with fever and urinary findings suggesting infection, treat it and the confusion should improve. Do not blame confusion on a positive dipstick alone; look for other causes.</li>
  <li>Catheter infection: replace a long-standing catheter, culture from the new one, remove when possible.</li>
  <li>Pregnancy: treat and confirm clearance; avoid fluoroquinolones, and note trimester limits for other drugs.</li>
  <li><b>Recurrent UTI</b>: confirm with culture; fluids if intake is low, post-intercourse measures, <b>vaginal oestrogen</b> after menopause, then antibiotic prophylaxis if needed.</li>
</ul>
<div class="sum-key">
  <span class="sum-key-title">نقاط امتحانية</span>
  <ul>
    <li>Screen and treat bacteriuria in pregnancy.</li>
    <li>No symptoms outside the exceptions: no treatment.</li>
    <li>Persistent fever despite a sensitive antibiotic: kidney imaging.</li>
    <li>True infection causing delirium: antibiotics correct the cause.</li>
  </ul>
</div>
`,
            questions: [
                {
                    "q": "A 48-year-old woman has persistent fever and flank pain, admitted several days ago for pyelonephritis, with fever persisting after 5 days of appropriate antibiotics. Exam shows left loin tenderness. Urine culture is positive for E. coli susceptible to the antibiotic already started. Which of the following is the most appropriate management?",
                    "options": [
                        "Kidney ultrasound",
                        "Change the antibiotic",
                        "Repeat urine culture",
                        "Continue observation"
                    ],
                    "answer": 0,
                    "explanation": "Treatment failure despite a confirmed susceptible organism raises concern for a complication (renal or perinephric abscess, obstruction), warranting imaging rather than changing an antibiotic that is already appropriate.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A woman presents two weeks after giving birth. She has no urinary symptoms, fever, or other complaints. During routine investigations, a urine culture incidentally grows Escherichia coli (E. coli). What is the most appropriate management?",
                    "options": [
                        "Ceftriaxone",
                        "Nitrofurantoin",
                        "Amoxicillin",
                        "No treatment is required"
                    ],
                    "answer": 3,
                    "explanation": "This is asymptomatic bacteriuria found by chance after delivery. She is no longer pregnant and has no symptoms, so no treatment is needed. Screening and treatment are justified in pregnancy and before urological procedures that breach the mucosa. Treating otherwise adds side effects and resistance without benefit.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A 71-year-old is admitted to the emergency department with symptoms of a urinary tract infection. Shortly after admission the patient becomes confused and unable to recall recent events. There is fever, and urinalysis shows positive nitrites and leukocyte esterase. Laboratory studies show hyperglycaemia, sodium 132 mmol/L (normal >134) and calcium 1.9 mmol/L. Blood pressure is 150 systolic. Brain MRI shows cortical atrophy. What is the most appropriate action to correct the neurological symptoms?",
                    "options": [
                        "Give fluids",
                        "Give antibiotics",
                        "Correct the hyponatraemia"
                    ],
                    "answer": 1,
                    "explanation": "Delirium: acute, fluctuating, inattention, reversible. Always hunt the precipitant - infection (UTI, chest), drugs, retention, constipation, pain, metabolic derangement. Dementia is the RISK FACTOR; the acute illness is the CAUSE. Mild hyponatraemia (130-134) is rarely symptomatic.",
                    "source": "SMLE recall"
                }
            ],
        },
        {
            id: "edi-travel",
            title: "10 — Malaria, Dengue & Travel Illness",
            title_en: "Blood film · Relapse · Prophylaxis · Warning signs",
            summaryHtml: `
<h4 class="deck-topic">Malaria</h4>
<ul>
  <li><b>Fever after travel to an endemic area is malaria until excluded.</b> Spread by female <i>Anopheles</i>.</li>
  <li>Diagnosis: <b>thick and thin blood films</b> (thick detects, thin identifies); rapid antigen test helps. Repeat if negative and suspicion remains.</li>
  <li><i>P. falciparum</i>: most severe (coma, anaemia, kidney injury, hypoglycaemia, lung injury). Severe malaria: <b>IV artesunate</b>.</li>
  <li>Uncomplicated falciparum: artemisinin combination therapy.</li>
  <li><b><i>P. vivax</i> and <i>P. ovale</i></b> leave liver hypnozoites and <b>relapse</b>: add primaquine or tafenoquine <b>after G6PD testing</b>; not in pregnancy.</li>
</ul>
<div class="deck-block deck-tbl"><table><thead><tr><th>Prophylaxis</th><th>Notes</th></tr></thead><tbody>
<tr><td><b>Atovaquone-proguanil</b></td><td>Daily; short tail (7 days after leaving); avoid in severe kidney impairment</td></tr>
<tr><td><b>Doxycycline</b></td><td>Daily; continue 4 weeks after; photosensitivity; not in pregnancy or young children</td></tr>
<tr><td><b>Mefloquine</b></td><td>Weekly; continue 4 weeks after; <b>avoid with psychiatric history</b> or seizures</td></tr>
</tbody></table></div>
<ul><li>Choice depends on destination resistance. Add bite protection: repellent, covering clothes, treated nets. In Saudi Arabia, local risk has centred on the southwest, such as Jazan; check current advice.</li></ul>
<h4 class="deck-topic">Dengue</h4>
<ul>
  <li><i>Aedes</i> mosquito, bites mainly in daytime. In Saudi Arabia reported especially in the western and southwestern regions.</li>
  <li>High fever, retro-orbital headache, severe muscle and joint pain, rash, <b>low white cells and platelets</b>.</li>
  <li>NS1 antigen or PCR early; IgM later.</li>
  <li><b>Supportive</b>: guided fluids, paracetamol. <b>Avoid NSAIDs and aspirin</b>.</li>
  <li><b>Warning signs</b> (often as fever falls): abdominal pain, persistent vomiting, fluid accumulation, mucosal bleeding, lethargy or restlessness, enlarged liver, rising haematocrit with falling platelets. Admit.</li>
</ul>
<h4 class="deck-topic">Other travel and regional infections</h4>
<ul>
  <li><b>Enteric fever</b>: sustained fever and abdominal symptoms after poor food hygiene; blood culture.</li>
  <li><b>MERS</b>: respiratory illness with camel, healthcare or case exposure; isolate with contact and airborne precautions and test.</li>
  <li>Pre-travel advice: safe food and water, vaccines for the destination, plan for chronic medicines.</li>
</ul>
<div class="sum-key">
  <span class="sum-key-title">نقاط امتحانية</span>
  <ul>
    <li>Cyclical fever after Africa: blood film.</li>
    <li>Relapse after treatment: think vivax (or ovale).</li>
    <li>Depression history: do not choose mefloquine.</li>
    <li>Dengue: supportive care without NSAIDs.</li>
  </ul>
</div>
`,
            questions: [
                {
                    "q": "A patient has high-grade fever and malaise. The fever is cyclical and there is a history of travel to Africa. What is the diagnostic test?",
                    "options": [
                        "Blood film",
                        "Blood culture",
                        "Virology screen",
                        "Urine analysis"
                    ],
                    "answer": 0,
                    "explanation": "Cyclical fever plus travel = malaria. THICK film to detect, THIN film to speciate and count parasitaemia. One negative film does not exclude it - repeat three times over 24-48 hours. Falciparum is the emergency: IV artesunate.",
                    "source": "SMLE recall"
                },
                {
                    "q": "Reports show an increase in recurrence of malaria after treatment. Which type of Plasmodium is responsible?",
                    "options": [
                        "Falciparum",
                        "Vivax",
                        "Malariae",
                        "Ovale"
                    ],
                    "answer": 1,
                    "explanation": "HYPNOZOITES = VIVAX and OVALE = relapse = need PRIMAQUINE for radical cure, after checking G6PD. FALCIPARUM = most severe and potentially fatal, no hypnozoites. Distinguish RELAPSE (from the liver, vivax/ovale) from RECRUDESCENCE (surviving blood-stage parasites, falciparum) from REINFECTION (a new mosquito bite).",
                    "source": "SMLE recall"
                },
                {
                    "q": "A 27-year-old soldier going to a military mission at the Southern border of Saudi Arabia. His medical history is insignificant apart from a positive history of depression, which is controlled by medication. He came for counselling regarding malaria prevention. Which of the following is the best malaria chemoprophylaxis regimen?",
                    "options": [
                        "Atovaquone-proguanil",
                        "Doxycycline",
                        "Mefloquine",
                        "Chloroquine"
                    ],
                    "answer": 0,
                    "explanation": "- Core Concept: Malaria chemoprophylaxis selection depends on the destination's resistance patterns and the patient's medical history. Mefloquine is strictly contraindicated in patients with a history of psychiatric disorders (e.g., depression, anxiety, psychosis). · Clinical Presentation: - *Symptoms of Malaria:* Cyclical fevers, chills, sweats, headache, and myalgia. - *Complications:* Cerebral malaria, severe anemia, and multi-organ failure. · Diagnosis: First-line and gold standard for diagnosing malaria is thick and thin peripheral blood smears for parasite identification and quantification. Rapid diagnostic tests (RDTs) are also used. · Management: For prophylaxis in a patient with a history of depression, Atovaquone-proguanil or Doxycycline are the preferred safe options. Acute treatment of malaria involves artemisinin-based combination therapies (ACTs).",
                    "source": "SMLE bank"
                },
                {
                    "q": "A patient presents with high fever, joint pain, and an erythematous rash, with multiple mosquito bites noted, and no abdominal pain. What is the most appropriate management?",
                    "options": [
                        "Ibuprofen for fever",
                        "Prophylactic antibiotics",
                        "Supportive treatment"
                    ],
                    "answer": 2,
                    "explanation": "Fever, arthralgia, and rash following mosquito exposure suggest an arboviral infection such as dengue or chikungunya, for which management is primarily supportive with fluids and rest, using acetaminophen rather than NSAIDs which can worsen bleeding risk in dengue; there is no specific antiviral or antibiotic treatment.",
                    "source": "SMLE recall"
                }
            ],
        },
        {
            id: "edi-vaccines-exposure",
            title: "11 — Adult Vaccines, Isolation & Exposure",
            title_en: "Routine boosters · Wounds · Live vaccines · Meningococcus",
            summaryHtml: `
<p>National schedules differ and change; the points below are general principles.</p>
<h4 class="deck-topic">Adult vaccines</h4>
<ul>
  <li><b>Influenza</b>: every year, especially older adults, chronic disease, pregnancy and health workers.</li>
  <li><b>Pneumococcal</b>: older adults (age threshold varies) and risk groups such as chronic lung, heart, liver or kidney disease, diabetes, asplenia, immunosuppression.</li>
  <li><b>Tetanus-diphtheria booster</b> every 10 years, with pertussis (Tdap) at least once in adulthood; Tdap in each pregnancy.</li>
  <li><b>Recombinant zoster</b> for older adults. Hepatitis B for those not immune.</li>
  <li><b>Asplenia</b>: pneumococcal, meningococcal and <i>H. influenzae</i> b, ideally 2 weeks before planned splenectomy.</li>
</ul>
<h4 class="deck-topic">Tetanus after a wound</h4>
<div class="deck-block deck-tbl"><table><thead><tr><th>History</th><th>Clean minor wound</th><th>Other wound</th></tr></thead><tbody>
<tr><td><b>3 or more doses</b></td><td>Booster if last was 10 or more years ago</td><td>Booster if 5 or more years ago</td></tr>
<tr><td><b>Fewer than 3 or unknown</b></td><td>Vaccine</td><td>Vaccine <b>plus tetanus immunoglobulin</b></td></tr>
</tbody></table></div>
<h4 class="deck-topic">Rules of safety</h4>
<ul>
  <li><b>Live vaccines</b> (MMR, varicella, yellow fever, BCG) are avoided in pregnancy and severe immunosuppression.</li>
  <li><b>Mild illness</b> is not a reason to postpone. Egg allergy does not prevent MMR.</li>
  <li><b>Yellow fever</b>: for travel to risk areas in Africa and South America; some countries require a certificate. Check the destination.</li>
  <li><b>Hajj and Umrah</b>: meningococcal ACWY is required for pilgrims under current Saudi rules; check yearly updates.</li>
</ul>
<h4 class="deck-topic">Meningococcal disease</h4>
<ul>
  <li>Antibiotic immediately. <b>Droplet isolation until 24 hours</b> of effective therapy.</li>
  <li>Close contacts and staff exposed to secretions: prophylaxis with ciprofloxacin, rifampicin or ceftriaxone (local resistance matters).</li>
</ul>
<h4 class="deck-topic">Other exposures</h4>
<ul>
  <li><b>Isolation</b>: airborne for TB, measles, varicella; droplet for influenza, pertussis, meningococcus; contact for <i>C. difficile</i> (wash hands with soap and water) and resistant organisms.</li>
  <li><b>Needlestick</b>: wash, report, test source and staff. Non-immune to hepatitis B: immunoglobulin and vaccine. HIV risk: prophylaxis urgently.</li>
  <li><b>Possible rabies bite</b>: wash thoroughly for about 15 minutes; vaccine, plus rabies immunoglobulin if not previously vaccinated and the exposure breaks skin or contacts mucosa.</li>
</ul>
<div class="sum-key">
  <span class="sum-key-title">نقاط امتحانية</span>
  <ul>
    <li>Garden injury with last tetanus over 10 years ago: booster.</li>
    <li>Minor illness: vaccinate.</li>
    <li>Meningococcus: stop droplet isolation after 24 hours of treatment.</li>
    <li>Travel to a yellow fever area: consider the vaccine if no contraindication.</li>
  </ul>
</div>
`,
            questions: [
                {
                    "q": "54 yrs female diabetes with minor trauma in A Garden. She Is Asymptomatic and the nurse discover the latest vaccine taken for patients 12 yes ago what should u to do?",
                    "options": [
                        "Give tetanus Vaccine (Or Shot?)",
                        "Tdap Booster",
                        "Wait For Her To Develop Tetanus , Then Give Her Vaccine",
                        "No Need"
                    ],
                    "answer": 1,
                    "explanation": "Core Concept: Tetanus prophylaxis in wound management. Clinical Presentation: · Patient presenting with a wound (minor or severe) and an uncertain or incomplete vaccination history. Diagnosis: · Assessment of wound severity and time since last tetanus toxoid-containing vaccine. Management: · For a clean, minor wound, a booster is indicated if it has been ≥ 10 years since the last dose. For all other wounds (dirty, deep, contaminated), a booster is given if ≥ 5 years have passed. Since her last vaccine was 12 years ago, she requires a booster. A Tdap (Tetanus, diphtheria, and acellular pertussis) booster is preferred over Td to provide pertussis immunity if she hasn't received one previously as an adult.",
                    "source": "SMLE bank"
                },
                {
                    "q": "A Saudi girl/family wants to travel to Kenya. Her routine vaccinations are up to date. What vaccine should be given?",
                    "options": [
                        "Malaria vaccine",
                        "Meningococcal vaccine",
                        "No need, her routine vaccination is enough",
                        "Yellow Fever"
                    ],
                    "answer": 3,
                    "explanation": "Kenya is a yellow fever risk country, and yellow fever vaccination is a standard, often required travel vaccine for Kenya specifically, per international health regulations.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A 27-year-old man recently returned from Umrah. Presents to Emergency Department with 1- day history of fever and headache. On examination, positive Kernig's sign and petechial rash on extremities and trunk. He was isolated and started on antibiotics (see lab results and report). Temperature 39 °C Test Result Normal Values Cells 380 0-3 /pL Total protein (Men) 0.9 0.22-0.33 g/L Glucose 1.2 2.50-3.89 mmol/L CSF analysis: WBC differential 87 % neutrophil and 5 % lymphocytes. How many hours after starting antibiotics should isolation be discontinued?",
                    "options": [
                        "12",
                        "24",
                        "48",
                        "72"
                    ],
                    "answer": 1,
                    "explanation": "- Core Concept: Discontinuation of droplet precautions in meningococcal meningitis is based on the eradication of nasopharyngeal carriage by effective antibiotics. · Clinical Presentation: - *Symptoms:* Fever, headache, neck stiffness, and petechial rash. - *Complications:* Sepsis, shock, and severe neurological sequelae. · Diagnosis: CSF analysis and blood cultures confirming Neisseria meningitidis. · Management: Acute management involves droplet isolation and IV antibiotics. The gold standard infection control protocol dictates that droplet precautions can be safely discontinued after the patient has completed 24 hours of effective targeted intravenous antibiotic therapy.",
                    "source": "SMLE bank"
                },
                {
                    "q": "MMR vaccine with child had mild illness what to do",
                    "options": [
                        "Give him mmr",
                        "postpone"
                    ],
                    "answer": 0,
                    "explanation": "Core Concept: Mild acute illnesses are not contraindications to routine childhood immunizations. Delaying vaccines increases the risk of outbreak and leaves the child vulnerable to preventable diseases. Clinical Presentation: · Mild illness includes low-grade fever, mild upper respiratory tract infection (runny nose, cough), or mild diarrhea. · The child is generally active and feeding well. Diagnosis: · First-line: Clinical assessment to distinguish mild illness from moderate/severe illness. · Gold Standard: Reviewing CDC/WHO contraindication guidelines. Management: · Acute: Administer the MMR vaccine as scheduled. True contraindications for the live-attenuated MMR vaccine include severe anaphylactic allergy to a previous dose or vaccine components (e.g., gelatin, neomycin), severe immunodeficiency (e.g., leukemia, high-dose steroids), or pregnancy. · Long-term: Routine adherence to the vaccination schedule ensures optimal herd immunity and individual protection.",
                    "source": "SMLE bank"
                }
            ],
        },
        {
            id: "edi-thyroid-nodule",
            title: "12 — Thyroid Nodules & Cancer",
            title_en: "TSH first · Ultrasound · FNA · Cancer types",
            summaryHtml: `
<div class="sum-algo">
  <span class="sum-algo-title">Working up a nodule</span>
  <ol>
    <li>History, exam and <b>TSH</b>, plus <b>neck ultrasound</b> including lymph nodes.</li>
    <li><b>TSH low</b>: <b>radionuclide scan</b>. A hyperfunctioning (hot) nodule is rarely malignant and usually needs no FNA.</li>
    <li>TSH normal or high: decide on <b>FNA</b> from ultrasound pattern and size.</li>
    <li>Report cytology with the Bethesda system.</li>
  </ol>
</div>
<h4 class="deck-topic">Suspicious ultrasound features</h4>
<ul>
  <li>Solid and <b>hypoechoic</b>, <b>microcalcifications</b>, irregular margins, taller than wide, spread outside the gland, abnormal nodes.</li>
  <li>FNA size limits depend on the system used. In general, suspicious patterns are sampled from about 1 cm; low-risk ones only when larger; pure cysts do not need diagnostic FNA.</li>
  <li>Risk history: childhood neck radiation, family history, rapid growth, hoarseness, fixed mass.</li>
</ul>
<div class="deck-block deck-tbl"><table><thead><tr><th>Bethesda</th><th>Meaning</th><th>Usual next step</th></tr></thead><tbody>
<tr><td><b>I</b></td><td>Non-diagnostic</td><td>Repeat FNA under ultrasound</td></tr>
<tr><td><b>II</b></td><td>Benign</td><td>Follow up</td></tr>
<tr><td><b>III</b></td><td>Atypia of undetermined significance</td><td>Repeat, molecular test, surveillance or lobectomy</td></tr>
<tr><td><b>IV</b></td><td>Follicular neoplasm</td><td>Molecular test or diagnostic lobectomy</td></tr>
<tr><td><b>V</b></td><td>Suspicious for malignancy</td><td>Surgery</td></tr>
<tr><td><b>VI</b></td><td>Malignant</td><td>Surgery (active surveillance for selected tiny tumours)</td></tr>
</tbody></table></div>
<h4 class="deck-topic">Cancer types</h4>
<ul>
  <li><b>Papillary</b>: commonest, lymphatic spread, very good outlook; psammoma bodies and typical nuclear features.</li>
  <li><b>Follicular</b>: spreads by blood. FNA <b>cannot separate</b> adenoma from carcinoma; capsular or vascular invasion on histology does.</li>
  <li><b>Medullary</b>: C cells, <b>calcitonin</b>, RET mutation, MEN2. <b>Exclude phaeochromocytoma before surgery</b>. Test family members.</li>
  <li><b>Anaplastic</b>: older patient, very rapid growth, poor outlook.</li>
  <li><b>Lymphoma</b>: rapidly enlarging gland with long-standing Hashimoto disease.</li>
</ul>
<h4 class="deck-topic">After thyroidectomy</h4>
<ul>
  <li><b>Expanding neck haematoma</b> with breathing difficulty: open the wound immediately and secure the airway.</li>
  <li>Watch for hypocalcaemia and recurrent laryngeal nerve injury (hoarseness).</li>
  <li>For differentiated cancer, follow thyroglobulin and ultrasound; calcitonin for medullary.</li>
</ul>
<div class="sum-key">
  <span class="sum-key-title">نقاط امتحانية</span>
  <ul>
    <li>Normal TSH with a large hypoechoic calcified nodule: FNA.</li>
    <li>Low TSH with a nodule: scan before needling.</li>
    <li>Follicular carcinoma needs histology.</li>
    <li>Medullary carcinoma: check for phaeochromocytoma first.</li>
  </ul>
</div>
`,
            questions: [
                {
                    "q": "A 22-year-old female has a non-tender, mobile, firm thyroid nodule; she is asymptomatic. Ultrasound shows a hypoechoic nodule with microcalcifications, size 3 cm. What is the most appropriate next step?",
                    "options": [
                        "FNA biopsy",
                        "Give thyroxine then reassess in 2 months",
                        "Discharge",
                        "Thyroidectomy"
                    ],
                    "answer": 0,
                    "explanation": "A hypoechoic thyroid nodule with microcalcifications (concerning sonographic features) measuring 3 cm, well above the 1 cm threshold for biopsy, warrants FNA biopsy.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A 39-year-old man found to have thyroid nodule during an annual physical examination. He has no personal or family history of any chronic medical disease, and he takes no medications. On physical examination, vital signs are normal. Palpation of the thyroid reveals left non-tender thyroid nodule, the remainder of the gland is unremarkable, and there is no palpable cervical lymphadenopathy. Other physical examination findings are normal (see lab results and report). Test Result Normal Values Thyroid-Stimulating Hormone 1.7 0.4 - 5.0 wU/mL Thyroxine (T4 free serum) 13.5 8.5 - 15.2 pmol/L Ultrasound of the neck: Shows a left 3-cm hypoechoic nodule with internal microcalcifications. Which of the following is the most appropriate next step in management?",
                    "options": [
                        "Fine-needle aspiration of the nodule",
                        "CT with contrast of the neck",
                        "Levothyroxine therapy",
                        "Thyroid scan"
                    ],
                    "answer": 0,
                    "explanation": "Thyroid nodule workup: first check TSH + ultrasound. If TSH is NORMAL or HIGH and the nodule has SUSPICIOUS ultrasound features (hypoechoic, MICROCALCIFICATIONS, irregular margins, taller-than-wide, ≥1-1.5 cm) → FINE-NEEDLE ASPIRATION (FNA) for cytology. If TSH is LOW → radionuclide uptake scan first (a 'hot'/autonomous nodule is rarely malignant). Solid suspicious nodule + normal TSH → FNA.",
                    "source": "SMLE recall"
                }
            ],
        },
    ],
};

export default specialtyEndocrinologyInfectious;
