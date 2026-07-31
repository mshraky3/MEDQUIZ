// Medical-Surgical Nursing — nursing-track section of the summaries catalog.
//
// Mirror of backend/content/summaryHtml/medicalSurgicalNursing.js (the gated slide viewer's
// copy): same authored prose, split into the guided path's subtopics. Keep the
// two in sync when the content changes.
//
// Questions are real recalls from the SNLE bank (questions.track = 'nursing'),
// matched to the subtopic they belong to. The full bank is reachable from the
// quiz engine; these are the handful shown inline while reading.
const medicalSurgicalNursing = {
    id: "medical-surgical-nursing",
    title: "Medical-Surgical Nursing",
    title_en: "SNLE Review — 16 Topics",
    icon: "stethoscope",
    accent: "#22d3ee",
    intro: "Medical-Surgical Nursing — SNLE revision built from the Saudi nursing licence recall banks: Peri-operative Nursing · Core Laboratory Values · Fluids & Electrolytes · Arterial Blood Gases · Cardiovascular · Peripheral Vascular Disease · Respiratory · Endocrine · Renal & Urinary · Gastrointestinal & Hepatic · Neurological · Haematology & Oncology · Musculoskeletal · Burns · Shock & Emergency · Eye, Ear & Skin.",
    subtopics: [
        {
            id: "ms-periop",
            title: "01 — Peri-operative Nursing",
            title_en: "Pre-operative · Post-operative priorities",
            summaryHtml: `
<h4 class="deck-topic">Pre-operative</h4>
    <ul>
      <li>Verify the <b>signed informed consent</b>, allergies, NPO status (usually 6–8 h for solids, 2 h for clear fluids), baseline vital signs, and remove dentures, jewellery, prostheses and nail polish</li>
      <li>Essential pre-op tests: <b>CBC</b>, electrolytes, blood glucose, <b>type and cross-match</b>, ECG, chest X-ray, and <b>coagulation studies</b></li>
      <li>The most important blood test before surgery is the <b>prothrombin time / coagulation profile</b> — it predicts bleeding risk</li>
      <li>Teach <b>before</b> the operation: deep breathing, incentive spirometry, coughing while splinting the incision, leg exercises, early ambulation and the pain scale</li>
      <li>Hold anticoagulants, aspirin and metformin per protocol; usually continue cardiac and antihypertensive drugs with a sip of water</li>
      <li>Mark the surgical site and complete the <b>surgical safety checklist / time-out</b> immediately before incision</li>
    </ul>
    <h4 class="deck-topic">Post-operative priorities</h4>
    <div class="sum-algo">
      <span class="sum-algo-title">Assessment order in recovery</span>
      <ol>
        <li><b>Respiration / airway</b> — patency, rate, depth, oxygen saturation</li>
        <li><b>Cardiovascular</b> — BP, pulse, bleeding, perfusion</li>
        <li><b>Neurological</b> — level of consciousness, response, movement</li>
        <li><b>Surgical site</b> — dressing, drains, wound</li>
        <li>Then pain, fluid balance, urine output and temperature</li>
      </ol>
    </div>
    <ul>
      <li>Position the unconscious post-op patient <b>side-lying</b> to protect the airway; once awake, semi-Fowler's</li>
      <li><b>Turn, cough and deep breathe every 2 hours</b> and use the incentive spirometer to prevent <b>atelectasis and pneumonia</b> — the commonest post-op respiratory complication (fever in the first 24–48 h)</li>
      <li><b>Early ambulation</b> is the single best prevention of DVT, atelectasis, pneumonia and paralytic ileus</li>
      <li>Expect <b>return of bowel sounds and flatus</b> before starting oral intake; absent bowel sounds with distension = paralytic ileus</li>
      <li>Report urine output <b>&lt;30 mL/hour</b> — the marker of inadequate renal perfusion</li>
      <li><b>Wound dehiscence/evisceration</b>: position supine with knees flexed, cover with a <b>sterile saline-soaked dressing</b>, keep NPO, notify the surgeon — never push the viscera back</li>
      <li>Post-op fever timeline — <b>wind</b> (atelectasis, 1–2 days) → <b>water</b> (UTI, 3–5 days) → <b>wound</b> (infection, 5–7 days) → <b>walking</b> (DVT, 7+ days) → <b>wonder drugs</b></li>
      <li><b>Malignant hyperthermia</b> under anaesthesia: sudden rise in end-tidal CO₂, muscle rigidity, tachycardia, then very high fever → stop the agent, give <b>dantrolene</b>, cool aggressively</li>
      <li><b>Post-mastectomy</b>: no BP, injections or venipuncture in the affected arm; elevate it, start arm exercises as ordered, teach lymphoedema prevention</li>
      <li><b>Post total hip replacement</b>: abduction pillow, <b>no hip flexion beyond 90°</b>, no crossing the legs, no low chairs or toilet seats, use a raised seat and a long-handled reacher. A realistic <b>one-week goal is that the patient sits up unaided three times a day</b> and progresses in mobility</li>
    </ul>
    <div class="sum-key">
      <span class="sum-key-title">نقاط امتحانية</span>
      <ul>
        <li>Post-op assessment sequence = <b>Respiration → Cardiovascular → Neurological → Surgical site</b>.</li>
        <li>Semi-Fowler's is the position after <b>appendectomy</b> and most abdominal surgery — it localises drainage and eases breathing.</li>
        <li>The goal of an NG tube after cholecystectomy or bowel surgery is <b>gastric decompression</b> — to prevent distension, nausea and strain on the suture line.</li>
      </ul>
    </div>
            `,
            questions: [
                {
                    q: "Which of the following patient care plan is the most appropriate for a 37 years old post appendectomy woman who is at risk of pneumonia ?",
                    options: ["Restrict fluid intake","Teach how to use spirometer","Encourage ambulation as tolerated","Avoid coughing and deep breathing"],
                    answer: 2,
                    source: 'SNLE recall',
                },
                {
                    q: "A patient who underwent a left foot amputation post-operative Care Unit and the following assess (see lab results). Blood pressure 110/80 mmHg, Heart rate 65 /min, Respiratory rate 13 /min Temperature37.2C, Oxygen Saturation 98 % on room air Test Result Normal Value Hb 120 120-158 g/L WBC 10.2 4-10.5 ×10 RBC 3.8 3.8-5.1 ×10 Fasting blood sugar 9.3 3.5-6.5 mm LDL 6.5 <4.0 mm Triglycerides 3.8 <2.16 mm Which long-term complication is most likely?",
                    options: ["Pain","Infection","Immobility","Bleeding"],
                    answer: 1,
                    source: 'SNLE recall',
                },
                {
                    q: "A nurse is taking care of a patient who underwent abdominal surgery three days ago. The patient has not been able to breathe deeply and uses to get out of bed since the surgery due to pain. Also, the patient complains of shortness of breath, and the lung sounds are diminished on auscultation. Blood pressure 120/70 mmHg Heart rate 75 /min Respiratory rate 22 /min Temperature 36.4 ℃ Oxygen saturation 89% Which of the following conditions should the nurse suspect?",
                    options: ["Sepsis","Atelectasis","Congestive heart failure","Emphysema"],
                    answer: 1,
                    source: 'SNLE recall',
                },
                {
                    q: "Which of the following the arranged assessment for postoperative patient???",
                    options: ["Cardiovascular, Respiration, Surgery site, Neurological signs","Respiration, Cardiovascular, Neurological signs, Surgery site","Neurological signs, Cardiovascular, Respiration, Surgery site","Surgery site, Respiration, Cardiovascular, Neurological signs"],
                    answer: 1,
                    source: 'SNLE recall',
                },
                {
                    q: "A nurse is caring for a patient receiving skeletal traction. Due to the patients severe limits on mobility, the nurse has identified a risk for atelectasis or pneumonia. What intervention should the nurse provide in order to prevent these complications?",
                    options: ["Perform chest physiotherapy once per shift and as needed","Teach the patient to perform deep breathing and coughing exercises","Administer prophylactic antibiotics as ordered","Administer nebulized bronchodilators and corticosteroids as ordered"],
                    answer: 1,
                    source: 'SNLE recall',
                },
            ],
        },
        {
            id: "ms-labs",
            title: "02 — Core Laboratory Values",
            title_en: "Core Laboratory Values",
            summaryHtml: `
<table>
      <thead><tr><th>Test</th><th>Normal</th><th>Test</th><th>Normal</th></tr></thead>
      <tbody>
        <tr><td>Sodium</td><td>135–145 mEq/L</td><td>WBC</td><td>4,500–11,000 /mm³</td></tr>
        <tr><td>Potassium</td><td><b>3.5–5.0</b> mEq/L</td><td>Platelets</td><td>150,000–450,000 /µL</td></tr>
        <tr><td>Calcium</td><td>9–11 mg/dL</td><td>Hgb</td><td>F 12–16 · M 13–18 g/dL</td></tr>
        <tr><td>Magnesium</td><td>1.5–2.5 mg/dL</td><td>Hct</td><td>F 36–48% · M 39–54% (≈ Hgb × 3)</td></tr>
        <tr><td>Chloride</td><td>95–105 mEq/L</td><td>PT</td><td>10–13 s</td></tr>
        <tr><td>Phosphorus</td><td>2.5–4.5 mg/dL</td><td>aPTT</td><td>25–35 s (on heparin 46–70 s)</td></tr>
        <tr><td><b>BUN</b></td><td>7–20 mg/dL</td><td>INR</td><td>&lt;1.1 (on warfarin 2–3)</td></tr>
        <tr><td><b>Creatinine</b></td><td>0.6–1.2 mg/dL</td><td>GFR</td><td>90–120 mL/min</td></tr>
        <tr><td>Albumin</td><td>3.4–5.4 g/dL</td><td>Specific gravity</td><td>1.010–1.030</td></tr>
        <tr><td>ALT / AST</td><td>7–56 / 5–40 U/L</td><td>Bilirubin</td><td>0.1–1.2 mg/dL</td></tr>
        <tr><td>Amylase / lipase</td><td>30–110 U/L / &lt;200 U/L</td><td>HbA1c</td><td>&lt;5.7% normal · ≥6.5% diabetes</td></tr>
        <tr><td>Total cholesterol</td><td>&lt;200 mg/dL</td><td>LDL / HDL</td><td>&lt;100 / &gt;60 mg/dL</td></tr>
      </tbody>
    </table>
    <ul>
      <li><b>Liver function</b> is assessed by <b>ALT, AST, ALP, bilirubin, albumin and PT/INR</b> — <b>not</b> by BUN, urea or creatinine, which are renal</li>
      <li><b>Kidney function</b> = BUN, creatinine, GFR, urine specific gravity and output</li>
      <li>Glasgow Coma Scale: best 15; <b>≤8 = severe, intubate</b></li>
    </ul>
            `,
            questions: [
                {
                    q: "Which of the following assess effective liver and consider liver function test?",
                    options: ["Creatinine","BUN","Urea","Urine gravity"],
                    answer: 1,
                    source: 'SNLE recall',
                },
                {
                    q: "All the following are normally present in urine result EXCEPT",
                    options: ["Urea","Creatinine","Albumin","Sodium"],
                    answer: 2,
                    source: 'SNLE recall',
                },
                {
                    q: "Patient with acute renal failure (ARF) Lab result NA 120 Potassium 6 Calcium normal result What is the most appropriate diet should nurse provide in food?",
                    options: ["Low NA","High potassium","High phosphate","Low carbohydrate"],
                    answer: 0,
                    source: 'SNLE recall',
                },
                {
                    q: "Which of the following diagnostic studies is essential to differentiate between renal failure and lower renal obstruction that cause urinary retention?",
                    options: ["Cholesterol level","Abdominal X-ray","Complete blood tests","Blood urea nitrogen and serum Creatinine"],
                    answer: 3,
                    source: 'SNLE recall',
                },
                {
                    q: "Why should recommend food with acid base (increase acidity)?",
                    options: ["Prevent kidney stones","Prevent urinary retention","Increase urine output"],
                    answer: 2,
                    source: 'SNLE recall',
                },
            ],
        },
        {
            id: "ms-electro",
            title: "03 — Fluids & Electrolytes",
            title_en: "Fluids & Electrolytes",
            summaryHtml: `
<table>
      <thead><tr><th>Imbalance</th><th>Key signs</th><th>Management</th></tr></thead>
      <tbody>
        <tr><td><b>Hyponatraemia</b> &lt;135</td><td>Confusion, headache, nausea, muscle cramps, <b>seizures</b></td><td>Fluid restriction; hypertonic saline <b>slowly</b> if severe (rapid correction → osmotic demyelination)</td></tr>
        <tr><td><b>Hypernatraemia</b> &gt;145</td><td>Thirst, dry mucous membranes, restlessness, fever</td><td>Hypotonic fluid, free water</td></tr>
        <tr><td><b>Hypokalaemia</b> &lt;3.5</td><td>Muscle weakness, <b>flat T wave and U wave</b>, arrhythmia, ileus, <b>digoxin toxicity</b></td><td>Oral or <b>diluted IV</b> potassium — <b>NEVER IV push</b>; max ~10 mEq/h on a pump; check urine output first</td></tr>
        <tr><td><b>Hyperkalaemia</b> &gt;5.0</td><td>Muscle weakness, <b>peaked T waves</b>, wide QRS, <b>cardiac arrest</b></td><td><b>Calcium gluconate</b> to protect the heart, then insulin + dextrose, salbutamol, bicarbonate, then Kayexalate/dialysis to remove it</td></tr>
        <tr><td><b>Hypocalcaemia</b> &lt;9</td><td><b>Chvostek's and Trousseau's</b> signs, tetany, tingling, laryngospasm, seizure</td><td>Calcium gluconate IV; vitamin D. Classic after <b>thyroidectomy</b> (parathyroid injury)</td></tr>
        <tr><td><b>Hypercalcaemia</b> &gt;11</td><td>"Stones, bones, groans, psychiatric overtones" — weakness, constipation, kidney stones</td><td>Normal saline + loop diuretic, bisphosphonates, calcitonin, mobilise</td></tr>
        <tr><td><b>Hypomagnesaemia</b></td><td>Tremor, hyperreflexia, torsades de pointes; often with alcoholism</td><td>IV magnesium</td></tr>
        <tr><td><b>Hypermagnesaemia</b></td><td><b>Loss of deep tendon reflexes</b>, respiratory depression, hypotension</td><td>Stop the source, <b>calcium gluconate</b></td></tr>
      </tbody>
    </table>
    <ul>
      <li><b>Hypovolaemia</b>: thirst, dry mucosa, poor turgor, weight loss, tachycardia, hypotension, flat neck veins, <b>concentrated urine with high specific gravity</b>, raised BUN → isotonic fluids</li>
      <li><b>Hypervolaemia</b>: weight gain, oedema, <b>crackles</b>, distended neck veins, bounding pulse, dyspnoea, dilute urine → restrict fluid and sodium, diuretics, daily weight, semi-Fowler's</li>
      <li><b>Daily weight is the most reliable indicator of fluid status</b> — same time, same scale, same clothing</li>
    </ul>
            `,
            questions: [
                {
                    q: "Signs and symptoms of early fluid volume deficit, except",
                    options: ["Decreased urine output","Decreased pulse rate","Concentrated urine","Decreased skin turgor"],
                    answer: 1,
                    source: 'SNLE recall',
                },
                {
                    q: "What is the Position after thyroidectomy??",
                    options: ["Lateral flexed","Semi fowler with slight neck flexed","Prone head extended","High Fowler with neck extended"],
                    answer: 1,
                    source: 'SNLE recall',
                },
                {
                    q: "A patient with congestive heart failure and severe peripheral edema has a nursing diagnosis of fluid volume excess What are the two MOST important interventions for the nurse to initiate?",
                    options: ["Diuretic therapy and intake and output","Nutritional education and low-sodium diet","Daily weights and intake and output","Low-sodium diet and elevate legs when in bed"],
                    answer: 2,
                    source: 'SNLE recall',
                },
                {
                    q: "Patient with asthma. What is the most appropriate position?",
                    options: ["Semi fowler","High Fowler"],
                    answer: 1,
                    source: 'SNLE recall',
                },
                {
                    q: "What is Signs of ICP?",
                    options: ["Tachypnia","Intermittent tachycardia","Restlessness"],
                    answer: 2,
                    source: 'SNLE recall',
                },
            ],
        },
        {
            id: "ms-abg",
            title: "04 — Arterial Blood Gases",
            title_en: "Arterial Blood Gases",
            summaryHtml: `
<div class="sum-callout"><b>Normal values:</b> pH 7.35–7.45 · PaCO₂ 35–45 mmHg · HCO₃ 22–26 mEq/L · PaO₂ 80–100 mmHg</div>
    <div class="sum-algo">
      <span class="sum-algo-title">ROME — read it in three steps</span>
      <ol>
        <li>Look at the <b>pH</b>: &lt;7.35 acidosis, &gt;7.45 alkalosis</li>
        <li>Find the cause — <b>R</b>espiratory <b>O</b>pposite (pH and CO₂ move in opposite directions), <b>M</b>etabolic <b>E</b>qual (pH and HCO₃ move in the same direction)</li>
        <li>Check compensation: the <b>other</b> value abnormal too = partially compensated; a <b>normal pH</b> with both abnormal = <b>fully compensated</b></li>
      </ol>
    </div>
    <table>
      <thead><tr><th>Disorder</th><th>Causes</th></tr></thead>
      <tbody>
        <tr><td><b>Respiratory acidosis</b> (↑CO₂)</td><td>Hypoventilation — COPD, opioid or sedative overdose, respiratory arrest, chest trauma, atelectasis</td></tr>
        <tr><td><b>Respiratory alkalosis</b> (↓CO₂)</td><td>Hyperventilation — anxiety/panic, pain, fever, high altitude, over-ventilation</td></tr>
        <tr><td><b>Metabolic acidosis</b> (↓HCO₃)</td><td><b>DKA</b>, renal failure, lactic acidosis/shock, severe <b>diarrhoea</b></td></tr>
        <tr><td><b>Metabolic alkalosis</b> (↑HCO₃)</td><td><b>Vomiting, NG suction</b>, excess antacids, diuretics, <b>bulimia/anorexia with purging</b></td></tr>
      </tbody>
    </table>
    <div class="sum-key">
      <span class="sum-key-title">نقاط امتحانية</span>
      <ul>
        <li>A young underweight woman who repeatedly vomits shows <b>metabolic alkalosis</b>; if her pH has returned to normal while HCO₃ and CO₂ are both abnormal, it is <b>compensated</b>.</li>
        <li>Prolonged NG suction and repeated vomiting → <b>metabolic alkalosis with hypokalaemia and hypochloraemia</b>.</li>
      </ul>
    </div>
            `,
            questions: [
                {
                    q: "Patient ABG PH 7.38, Paco2 50, Hco3 6 normal. What's the ABG interpretation?",
                    options: ["Compensated Metabolic alkalosis","Uncompensated Metabolic acidosis","Compensated Respiratory acidosis","Uncompensated Respiratory alkalosis"],
                    answer: 2,
                    source: 'SNLE recall',
                },
                {
                    q: "ABG results - for an underweight girl 2 times?",
                    options: ["one is ABG disorder - Metabolic Alkalosis","uncompensated metabolic alkalosis","Compensated metabolic acidosis"],
                    answer: 2,
                    source: 'SNLE recall',
                },
                {
                    q: "Nurse is caring for a client with a nasogastric tube that is attached to low suction The nurse monitors the client, knowing that the client is at risk for which acid-base disorder?",
                    options: ["Metabolic acidosis","Metabolic alkalosis","Respiratory acidosis","Respiratory alkalosis"],
                    answer: 1,
                    source: 'SNLE recall',
                },
                {
                    q: "Which of these following indicates signs of severe COPD?",
                    options: ["High p02 and high pC02","Low p02 and low pC02","Low p02 and high pC02","High p02 and low pC02"],
                    answer: 2,
                    source: 'SNLE recall',
                },
                {
                    q: "A patient comes to the emergency unit with cough and severe dyspnea. The patient’s medical history revealed a diagnosis of chronic heart failure and chronic obstructive pulmonary disease. Blood pressure 110/70 mmhg Heart rate 87/min Respiratory rate 23/min Temperature 37.3 C Which of the following diagnostic tests will be most beneficial to a nurse to figure out if there is an exacerbation of heart failure?",
                    options: ["B-type natriuretic peptide (BNP)","arterial blood gas (ABG)","cardiac enzymes (CK-MB)","chest x-ray"],
                    answer: 0,
                    source: 'SNLE recall',
                },
            ],
        },
        {
            id: "ms-cardiac",
            title: "05 — Cardiovascular",
            title_en: "Angina vs myocardial infarction · Heart failure · Rhythms · Other",
            summaryHtml: `
<h4 class="deck-topic">Angina vs myocardial infarction</h4>
    <table>
      <thead><tr><th></th><th>Angina</th><th>Myocardial infarction</th></tr></thead>
      <tbody>
        <tr><td>Trigger</td><td>Exertion, emotion, heavy meal, cold</td><td>May occur at rest</td></tr>
        <tr><td>Duration</td><td>&lt;15 minutes</td><td>&gt;30 minutes</td></tr>
        <tr><td>Relief</td><td><b>Rest and nitroglycerin relieve it</b></td><td><b>Not relieved</b> by rest or nitroglycerin</td></tr>
        <tr><td>Associated</td><td>Few</td><td>Diaphoresis, nausea, dyspnoea, anxiety, sense of doom</td></tr>
        <tr><td>Markers</td><td>Normal</td><td><b>Troponin raised</b> (most specific, rises 3–4 h, stays 10–14 days); CK-MB; ECG ST elevation or depression</td></tr>
      </tbody>
    </table>
    <ul>
      <li>Risk factors: <b>hyperlipidaemia</b>, hypertension, smoking, diabetes, obesity, inactivity, family history, age, male sex, stress</li>
      <li><b>Immediate management of chest pain — MONA</b>: <b>M</b>orphine, <b>O</b>xygen (if hypoxic), <b>N</b>itroglycerin, <b>A</b>spirin (chewed). Plus 12-lead ECG within 10 minutes, IV access, continuous monitoring, bed rest — <b>the first nursing action is to place the patient at rest and give oxygen and nitroglycerin, then obtain the ECG</b></li>
      <li>Women, the elderly and diabetics often have <b>atypical or silent</b> presentation — epigastric pain, fatigue, dyspnoea</li>
      <li><b>ST depression</b> = ischaemia/NSTEMI; <b>ST elevation</b> = injury/STEMI; a <b>pathological Q wave</b> = established infarction. Ischaemia that progresses will show <b>T-wave inversion and then Q waves</b></li>
      <li>Post-MI teaching: cardiac rehabilitation, low-fat low-salt diet, stop smoking, gradual activity, and <b>resume sexual activity when the patient can climb two flights of stairs without symptoms</b>; take nitroglycerin prophylactically and <b>never with sildenafil</b></li>
    </ul>
    <h4 class="deck-topic">Heart failure</h4>
    <ul>
      <li><b>Left-sided → lungs</b>: dyspnoea, orthopnoea, <b>paroxysmal nocturnal dyspnoea</b>, crackles, frothy pink sputum, fatigue</li>
      <li><b>Right-sided → body</b>: <b>peripheral oedema, distended neck veins, hepatomegaly, ascites, weight gain</b></li>
      <li>Management: high Fowler's, oxygen, <b>loop diuretic</b>, ACE inhibitor/ARB, beta blocker, digoxin, <b>daily weight (report a gain of &gt;1 kg/day or 2 kg/week)</b>, fluid and sodium restriction, rest periods</li>
      <li><b>Acute pulmonary oedema</b> is an emergency: sit the patient upright with the legs dependent, high-flow oxygen, IV furosemide, morphine, nitrates</li>
    </ul>
    <h4 class="deck-topic">Rhythms</h4>
    <ul>
      <li><b>Atrial fibrillation</b>: irregularly irregular, no P waves → rate control, <b>anticoagulation</b> (stroke risk); unstable → synchronised cardioversion</li>
      <li><b>Ventricular tachycardia with a pulse</b> → antiarrhythmic and <b>synchronised cardioversion</b> if unstable. <b>Pulseless VT and ventricular fibrillation → immediate DEFIBRILLATION</b> and CPR</li>
      <li><b>Asystole</b> → CPR and adrenaline; <b>never defibrillate asystole</b></li>
      <li><b>Cardioversion is synchronised</b> (for a rhythm with a pulse); <b>defibrillation is unsynchronised</b> (pulseless)</li>
      <li>High-quality CPR in adults: rate 100–120/min, depth 5–6 cm, full recoil, 30:2, minimal interruptions</li>
    </ul>
    <h4 class="deck-topic">Other</h4>
    <ul>
      <li><b>Hypertension</b>: usually asymptomatic; complications are stroke, MI, heart failure, renal failure and retinopathy. Lifestyle first — <b>DASH diet</b>, weight loss, exercise, salt &lt;2 g/day, stop smoking, limit alcohol. Emphasise <b>lifelong adherence even when feeling well</b></li>
      <li><b>Pericarditis</b>: sharp pleuritic chest pain <b>relieved by sitting forward</b>, friction rub, diffuse ST elevation</li>
      <li><b>Cardiac tamponade</b>: <b>Beck's triad</b> — hypotension, muffled heart sounds, distended neck veins — plus pulsus paradoxus → <b>pericardiocentesis</b></li>
      <li><b>Aortic aneurysm</b>: a pulsatile abdominal mass and bruit; sudden tearing back or abdominal pain with <b>hypotension</b> means <b>rupture — an emergency</b>. Do <b>not</b> palpate deeply. The main complication is <b>bleeding and hypotensive shock</b></li>
      <li><b>Swan-Ganz (pulmonary artery) catheter</b> measures pressures used to assess <b>left ventricular function</b> and cardiac output</li>
      <li><b>Central venous pressure</b> reflects right-sided filling/fluid volume status</li>
    </ul>
            `,
            questions: [
                {
                    q: "The nurse prepares cardiac patient for the insertion of a pulmonary artery catheter (Swan-Ganz catheter). The nurse teaches the patient that the catheter will be inserted to provide information about",
                    options: ["Stroke volume","Venous pressure","Cardiac output","left ventricular functioning"],
                    answer: 3,
                    source: 'SNLE recall',
                },
                {
                    q: "What is the goal for cardiac catheterization?",
                    options: ["Obtain venous pressure","Assess Oxygen for heart chambers"],
                    answer: 1,
                    source: 'SNLE recall',
                },
                {
                    q: "A patient returned to the Surgical Unit from the thyroidectomy. The nurse observed that the arousable. Blood pressure 90/60 mmHg Heart rate 108 /min What immediate action should the nurse take?",
                    options: ["Recheck pulse and blood pressure","Administer intravenous fluids as ordered","Place client in modified Trendelenburg's","Assess the back of neck surgical dressing for bleeding"],
                    answer: 3,
                    source: 'SNLE recall',
                },
                {
                    q: "You are preparing the nursing care plan for a middle-aged patient admitted to the intensive care unit for an acute myocardial infarction (heart attack). His symptoms include tachycardia, palpitations, anxiety, jugular vein distention, and fatigue. Which of the following nursing diagnoses is most appropriate?",
                    options: ["Decreased Cardiac Output","Impaired Tissue Perfusion","Impaired Cardiac Contractility","Impaired Activity Tolerance"],
                    answer: 0,
                    source: 'SNLE recall',
                },
                {
                    q: "Nurse is watching the cardiac monitor, and a client’s rhythm suddenly changes. There are no P waves; instead, there are wavy lines. The QRS complexes measure 0.08 second, but they are irregular, with a rate of 120 beats a minute. The nurse interprets this rhythm as",
                    options: ["Sinus tachycardia","Atrial fibrillation","Ventricular tachycardia","Ventricular fibrillation"],
                    answer: 1,
                    source: 'SNLE recall',
                },
            ],
        },
        {
            id: "ms-vascular",
            title: "06 — Peripheral Vascular Disease",
            title_en: "Peripheral Vascular Disease",
            summaryHtml: `
<table>
      <thead><tr><th></th><th>Arterial insufficiency</th><th>Venous insufficiency</th></tr></thead>
      <tbody>
        <tr><td>Pain</td><td><b>Intermittent claudication</b>, worse on elevation, relieved by dangling</td><td>Dull ache, worse on standing, relieved by elevation</td></tr>
        <tr><td>Skin</td><td><b>Pale, cool, shiny, hairless</b>, thick nails, weak/absent pulses</td><td>Brown pigmentation, warm, oedema, pulses present</td></tr>
        <tr><td>Ulcer</td><td>Toes/lateral malleolus, <b>punched-out, painful</b>, little drainage</td><td>Medial malleolus, irregular, heavy drainage</td></tr>
        <tr><td>Position</td><td><b>Dangle</b> the legs (dependent)</td><td><b>Elevate</b> the legs</td></tr>
        <tr><td>Care</td><td>Keep warm (never a heating pad), <b>stop smoking</b>, walking programme, meticulous foot care</td><td>Compression stockings, elevation, avoid prolonged standing</td></tr>
      </tbody>
    </table>
    <ul>
      <li>A smoker with a <b>cool, pale/blue lower limb, absent hair growth and delayed capillary refill</b> has <b>arterial</b> insufficiency — smoking cessation is the single most important intervention</li>
      <li><b>DVT</b>: unilateral calf pain, swelling, warmth and redness → bed rest initially, <b>elevate the limb, do NOT massage</b>, anticoagulation, measure calf circumference; prevention is early ambulation, compression devices and prophylactic anticoagulation</li>
      <li><b>Pulmonary embolism</b>: sudden dyspnoea, pleuritic chest pain, tachycardia, anxiety, haemoptysis → high Fowler's, oxygen, notify immediately, anticoagulation</li>
    </ul>
            `,
            questions: [
                {
                    q: "Cardiac patient smoking. He has blue lower extremity, pale skin and very exhausted. the nurse observe that lower limb without hair. No hair growth in lower limb. What is the appropriate cause of hair loss in his leg ?",
                    options: ["Hermonaldistubance","Impaired tissue perfusion"],
                    answer: 1,
                    source: 'SNLE recall',
                },
                {
                    q: "The patient has joint arthroplasty surgery. The patient with urinary catheter and IV line is attached. He was on oxygen, what needs immediate intervention?",
                    options: ["Pain, redness, and swelling","Shortness of breath and coughing"],
                    answer: 1,
                    source: 'SNLE recall',
                },
                {
                    q: "Patient with unstable angina. The chest pain is ruled out. What is the priority nursing diagnosis?",
                    options: ["Anxiety from threatened disease","Pain related to Angina pectoris"],
                    answer: 1,
                    source: 'SNLE recall',
                },
                {
                    q: "Patient with I. V infusion . The patient is complaining redness swelling pain at infusion site. What should the nurse do?",
                    options: ["Slow rate","Stop and inform doctor","Cold compress"],
                    answer: 1,
                    source: 'SNLE recall',
                },
                {
                    q: "The nurse wants to assess nutritional status of baby 9 month what is the most appropriate measure?",
                    options: ["Head circumference","Arm circumference","Chest circumference"],
                    answer: 1,
                    source: 'SNLE recall',
                },
            ],
        },
        {
            id: "ms-resp",
            title: "07 — Respiratory",
            title_en: "Respiratory",
            summaryHtml: `
<ul>
      <li><b>COPD</b>: barrel chest, pursed-lip breathing, prolonged expiration, chronic productive cough, clubbing, use of accessory muscles. Care — <b>low-flow controlled oxygen (target SpO₂ 88–92%)</b>, tripod/orthopnoeic position, pursed-lip and diaphragmatic breathing, small frequent high-calorie high-protein meals, fluids to loosen secretions, pneumococcal and annual influenza vaccination, smoking cessation</li>
      <li><b>Asthma</b>: expiratory wheeze, cough, chest tightness. SABA rescue + inhaled corticosteroid controller; a <b>silent chest is an emergency</b>. Give the <b>bronchodilator before the steroid inhaler</b> and rinse the mouth after the steroid</li>
      <li><b>Pneumonia</b>: fever, productive cough, pleuritic pain, crackles, consolidation on X-ray. Treatment is effective when the <b>fever settles, the WBC normalises, breath sounds clear and the chest X-ray improves</b>. Encourage fluids, deep breathing, position changes and early mobilisation</li>
      <li><b>Tuberculosis</b>: night sweats, weight loss, chronic cough, haemoptysis. <b>Airborne precautions in a negative-pressure room, N95</b>. Diagnosis by sputum AFB × 3 <b>early morning</b> specimens; a positive Mantoux means exposure, not active disease. Multi-drug therapy (RIPE) for 6–9 months — <b>the priority teaching is adherence to the full course</b>; the patient is no longer infectious after ~2–3 weeks of therapy with 3 negative smears</li>
      <li><b>Pneumothorax</b>: sudden pleuritic pain, dyspnoea, <b>absent breath sounds and hyper-resonance</b> on the affected side. <b>Tension pneumothorax</b> adds <b>tracheal deviation to the opposite side</b>, distended neck veins and severe hypotension → immediate needle decompression then a chest tube</li>
      <li><b>Chest tube</b>: keep the drainage system <b>below chest level</b>, never clamp it routinely, expect <b>tidalling</b> with respiration, <b>continuous bubbling in the water seal = an air leak</b>, gentle bubbling in the suction chamber is normal. If it disconnects, place the end in sterile water; if it is pulled out, cover the site with a sterile dressing taped on <b>three sides</b>. Keep a clamp and sterile water at the bedside</li>
      <li><b>Tracheostomy suctioning</b>: hyper-oxygenate first, sterile technique, apply suction <b>only on withdrawal</b>, ≤10–15 seconds per pass, allow rest between passes. Keep an obturator and a spare tube at the bedside</li>
      <li><b>Mechanical ventilation</b> alarms: <b>high pressure</b> = obstruction (secretions, kinked tubing, biting, bronchospasm, pneumothorax); <b>low pressure</b> = disconnection or a leak in the cuff</li>
      <li><b>Sputum expectorant question</b>: a productive cough with copious sputum is characteristic of <b>chronic bronchitis</b> rather than emphysema or asthma</li>
    </ul>
            `,
            questions: [
                {
                    q: "The nurse is caring for a client who has had a chest tube inserted and connected to water seal drainage. The nurse determines the drainage system is functioning correctly when which of the following is observed",
                    options: ["Continuous bubbling in the water seal chamber","Fluctuation in the water seal chamber","Suction tubing attached to a wall unit","Vesicular breath sounds throughout the lung fields"],
                    answer: 1,
                    source: 'SNLE recall',
                },
                {
                    q: "The nurse is assessing a 65-year-old patient, who reports the fatigue, Weight loss, night sweats, and a productive cough with thick sputum The nurse should immediately initiate isolation precautions for which of the following?",
                    options: ["Influenza","Pertussis","Bacterial pneumonia","Pulmonary tuberculosis"],
                    answer: 3,
                    source: 'SNLE recall',
                },
                {
                    q: "client chest tube is connected to a chest tube drainage system with a water seal. The nurse noted that the water seal c is fluctuating with each breath that client takes. The fluctuation meansthat",
                    options: ["There is an obstruction in the chest tube","The client is developing emphysema","The chest tube system is functioning properly","There is leak in the chest tube system"],
                    answer: 2,
                    source: 'SNLE recall',
                },
                {
                    q: "Which of the following is consider sputum expectorant?",
                    options: ["Emphysema","Asthma","Bronchitis"],
                    answer: 2,
                    source: 'SNLE recall',
                },
                {
                    q: "A patient with chronic obstructive pulmonary disease (COPD) Experiencing frequent dyspnea which of the following exercise would teach the patient how to BETTER control breathing?",
                    options: ["Lower side rib","Segmental","Pursed lip","Diaphragmatic"],
                    answer: 2,
                    source: 'SNLE recall',
                },
            ],
        },
        {
            id: "ms-endo",
            title: "08 — Endocrine",
            title_en: "Endocrine",
            summaryHtml: `
<table>
      <thead><tr><th></th><th>Hyperthyroidism (Graves')</th><th>Hypothyroidism</th></tr></thead>
      <tbody>
        <tr><td>Metabolism</td><td><b>Hypermetabolism</b> from raised T3/T4</td><td>Hypometabolism from low T3/T4</td></tr>
        <tr><td>Signs</td><td>Weight loss with good appetite, heat intolerance, tachycardia, hypertension, tremor, diarrhoea, exophthalmos, goitre, insomnia, irritability</td><td>Weight gain, cold intolerance, bradycardia, constipation, dry skin, hair loss, lethargy, depression, menorrhagia</td></tr>
        <tr><td>Care</td><td>Cool quiet room, high-calorie high-protein diet, avoid caffeine, eye protection</td><td>Warm environment, high-fibre diet, lifelong <b>levothyroxine</b> on an empty stomach in the morning</td></tr>
      </tbody>
    </table>
    <ul>
      <li><b>Thyroid storm</b> after thyroid surgery or stress: <b>very high fever, tachycardia &gt;120, hypertension, restlessness and agitation</b> — this is <b>hypermetabolism from a surge of T3 and T4</b>. Cool the patient, give beta blockers, antithyroid drugs and oxygen; it is an emergency</li>
      <li><b>Post-thyroidectomy</b>: keep the patient in <b>semi-Fowler's</b> with the neck supported, keep a <b>tracheostomy set, oxygen and calcium gluconate at the bedside</b>. Watch for <b>bleeding (check behind the neck)</b>, airway obstruction, <b>hoarseness (laryngeal nerve injury)</b> and <b>tetany with tingling and Chvostek's sign (hypocalcaemia from parathyroid injury)</b></li>
      <li><b>Cushing's syndrome</b> — excess cortisol, most often from <b>long-term corticosteroid therapy (secondary Cushing's, e.g. prednisone)</b>: moon face, buffalo hump, truncal obesity, thin limbs, striae, hypertension, hyperglycaemia, osteoporosis, bruising, poor healing, infection risk</li>
      <li><b>Addison's disease</b> — cortisol deficiency: fatigue, weight loss, <b>hyperpigmentation (the classic sign)</b>, <b>hypotension</b>, hyponatraemia, <b>hyperkalaemia</b>, hypoglycaemia, salt craving. <b>Addisonian crisis</b> is an emergency → IV fluids, hydrocortisone, glucose. Never stop steroids abruptly</li>
      <li><b>SIADH</b> — too much ADH: water retention, <b>dilutional hyponatraemia</b>, concentrated urine, weight gain without oedema → <b>the nursing management is FLUID RESTRICTION</b>, hypertonic saline if severe, daily weight, seizure precautions</li>
      <li><b>Diabetes insipidus</b> — too little ADH: polyuria of very dilute urine, intense thirst, dehydration, hypernatraemia → fluid replacement and <b>desmopressin</b></li>
      <li><b>Type 1 vs type 2 diabetes</b>: absolute insulin deficiency in the young requiring insulin, versus insulin resistance managed with lifestyle and oral agents ± insulin</li>
      <li><b>DKA</b> (type 1): hyperglycaemia, <b>ketones, Kussmaul respiration, acetone breath, metabolic acidosis</b>, dehydration → <b>IV normal saline first</b>, then regular insulin infusion, then potassium replacement as the insulin drives potassium into the cells</li>
      <li><b>HHNS</b> (type 2): extremely high glucose, profound dehydration, <b>no ketones</b>, altered consciousness</li>
      <li><b>Diabetic foot care</b>: inspect the feet daily with a mirror, wash in <b>lukewarm</b> water and dry between the toes, never walk barefoot, never use heating pads or cut corns, cut nails <b>straight across</b>, wear well-fitting shoes and check inside them, report any break in the skin at once</li>
    </ul>
    <div class="sum-key">
      <span class="sum-key-title">نقاط امتحانية</span>
      <ul>
        <li>Restlessness with BP 150/100, HR 120 and temperature 40 °C after subtotal thyroidectomy = <b>hypermetabolism due to increased T3 and T4 (thyroid storm)</b>.</li>
        <li>The classic sign of <b>adrenal insufficiency</b> is <b>hyperpigmentation</b>.</li>
        <li>SIADH nursing management = <b>fluid restriction</b>.</li>
      </ul>
    </div>
            `,
            questions: [
                {
                    q: "Classical sign of adrenal insufficiency?",
                    options: ["Hypernatremia","Hypotension","Hyperpigmentation"],
                    answer: 2,
                    source: 'SNLE recall',
                },
                {
                    q: "Patient immobile 3days science total hip replacement. she will ambulate for the first time after surgery the nurse told her to descent her leg and sit at the side of the bed before bearing her weight in foot. The nurse instructs her to do this to avoid which of the following?",
                    options: ["hypotension","dislocation","hypertension","headache"],
                    answer: 0,
                    source: 'SNLE recall',
                },
                {
                    q: "DM patient at night shift with cold skin, tachycardia, diaphoresis what you will do fist?",
                    options: ["check blood glucose","give him cup of orange juice"],
                    answer: 1,
                    source: 'SNLE recall',
                },
                {
                    q: "Patient with thyroid storm after hyperthyroidism. He has high grade fever. What is the additional expected symptoms?",
                    options: ["protroted eyeballs","increase sensitive to heat"],
                    answer: 1,
                    source: 'SNLE recall',
                },
                {
                    q: "A patient is being prepared for discharge following hip replacement surgery. The nurse is providing him with discharge education. Which of the following information should be taught to him as an effective pain management principle?",
                    options: ["Avoid giving pain medication prior to participating in physical therapy","Give a double dose of pain medication if pain is intolerable","Give pain medication before pain becomes severe","Delay giving pain medication as long as possible"],
                    answer: 2,
                    source: 'SNLE recall',
                },
            ],
        },
        {
            id: "ms-renal",
            title: "09 — Renal & Urinary",
            title_en: "Renal & Urinary",
            summaryHtml: `
<ul>
      <li><b>Acute kidney injury</b>: <b>pre-renal</b> (hypoperfusion — shock, dehydration, heart failure), <b>intra-renal</b> (nephrotoxins, acute tubular necrosis, glomerulonephritis) and <b>post-renal</b> (obstruction — stones, BPH). Phases: onset → <b>oliguric</b> (watch <b>hyperkalaemia</b> and fluid overload) → <b>diuretic</b> (watch dehydration and hypokalaemia) → recovery</li>
      <li><b>Chronic kidney disease</b>: a falling GFR with <b>small shrunken kidneys</b> and a persistently high creatinine indicates irreversible disease → the treatment is <b>haemodialysis</b> (or transplantation), not surgery on the kidney</li>
      <li>CKD picture: <b>anaemia</b> (low erythropoietin — give epoetin), <b>hyperkalaemia, hyperphosphataemia with hypocalcaemia</b>, metabolic acidosis, hypertension, uraemia, renal osteodystrophy, pruritus. Diet — <b>restrict protein, potassium, phosphorus, sodium and fluid</b>; give phosphate binders <b>with meals</b></li>
      <li><b>Haemodialysis access (AV fistula)</b>: <b>feel for a thrill and listen for a bruit</b> every shift; <b>no BP, venipuncture, IV or tight clothing on that arm</b>; hold dialysable medications until after the session; weigh before and after</li>
      <li><b>Peritoneal dialysis</b>: warm the dialysate, use strict aseptic technique, and expect <b>clear, straw-coloured outflow</b>. <b>Cloudy outflow = peritonitis</b> — the major complication; report it. If the outflow is slow, reposition the patient and check for kinks or constipation</li>
      <li><b>Renal calculi</b>: severe flank pain radiating to the groin, haematuria, nausea → <b>analgesia is the priority</b>, high fluid intake 3 L/day, <b>strain all urine</b> and send the stone for analysis, ambulate. Diet depends on the stone type (limit oxalate, purine or calcium accordingly)</li>
      <li><b>UTI</b>: dysuria, frequency, urgency, suprapubic pain, cloudy foul urine; in the elderly it often presents as <b>new confusion</b>. Teach fluids, void after intercourse, front-to-back wiping, cotton underwear and completing the antibiotic course</li>
      <li><b>Catheter care</b>: keep the bag <b>below the level of the bladder</b> and off the floor, maintain a closed system, secure the tubing, no routine irrigation — the main risk is a <b>catheter-associated UTI</b>, so remove it as early as possible</li>
      <li><b>Urine specimen from an indwelling catheter</b>: clamp the tubing briefly, clean the sampling port with alcohol and <b>aspirate with a sterile syringe from the port</b> — never disconnect the system and never take urine from the drainage bag</li>
      <li><b>BPH / post-TURP</b>: expect <b>continuous bladder irrigation</b>; the output must always exceed the irrigant instilled; bright red drainage with clots means <b>haemorrhage</b> → increase the irrigation and notify. Avoid straining, and no rectal temperatures or enemas</li>
    </ul>
            `,
            questions: [
                {
                    q: "Which of the following action is correct when college a urine specimen from a client’s indwelling urinary catheter?",
                    options: ["Collect urine from the drainage collecting bag using sterile. technique","Disconnect the catheter from the drainage tubing to collect urine. using clean technique","Remove the indwelling catheter and insert a sterile straight catheter. to collect urine","Aspirate specimen from the tubing draining port using needle and syringe with sterile technique"],
                    answer: 3,
                    source: 'SNLE recall',
                },
                {
                    q: "Most common cause for acute renal failure?",
                    options: ["pyelonephritis","Tubular destruction","Urinary tract obstruction","Dehydration"],
                    answer: 3,
                    source: 'SNLE recall',
                },
                {
                    q: "How take Urine sample from patient with catheter?",
                    options: ["with syringe","clamp for 30 minutes then take it","Early morning"],
                    answer: 1,
                    source: 'SNLE recall',
                },
                {
                    q: "woman patient admitted with indwelling Foley catheter with a closed drainage system was order collection for sterile urine specimen. Which of the following steps is considered the best way to collect the sterile urine specimen?",
                    options: ["Obtain the specimen from the drainage bag","Obtain the specimen from the aspiration port","Obtain the specimen from the first voiding in the morning","Obtain a clean mid-stream catch cleaning the perineum"],
                    answer: 1,
                    source: 'SNLE recall',
                },
                {
                    q: "Patient with chronic renal failure before performing peritoneal dialysis the nurse should warm the solution before administering to",
                    options: ["Promote abdominal muscle relaxation","Maintain extra body warmth temperature","Encourage the removal of serum urea","Stimulate potassium back into body cells"],
                    answer: 2,
                    source: 'SNLE recall',
                },
            ],
        },
        {
            id: "ms-gi",
            title: "10 — Gastrointestinal & Hepatic",
            title_en: "Gastrointestinal & Hepatic",
            summaryHtml: `
<ul>
      <li><b>GERD</b>: small frequent meals, avoid caffeine, chocolate, alcohol, fat, peppermint and smoking, no lying down for 2–3 hours after eating, <b>elevate the head of the bed</b>, weight loss, PPI</li>
      <li><b>Peptic ulcer</b>: <i>H. pylori</i> and NSAIDs are the causes. <b>Gastric</b> ulcer pain is worse with eating; <b>duodenal</b> ulcer pain is relieved by eating and returns 2–3 h later. Triple therapy = PPI + two antibiotics. <b>Perforation</b> — sudden severe pain with a <b>rigid board-like abdomen</b> and absent bowel sounds — is a surgical emergency</li>
      <li><b>Appendicitis</b>: periumbilical pain migrating to <b>McBurney's point</b>, rebound tenderness, low-grade fever, raised WBC. <b>NPO, no heat, no enemas, no laxatives</b>. <b>Sudden relief of the pain suggests rupture</b> — followed by peritonitis with rigidity and fever</li>
      <li><b>Cholecystitis</b>: RUQ pain radiating to the right shoulder after fatty food, positive Murphy's sign, nausea. Low-fat diet; laparoscopic cholecystectomy. After surgery expect right shoulder pain from residual CO₂ — ambulation helps</li>
      <li><b>Pancreatitis</b>: severe epigastric pain radiating to the back, relieved by <b>leaning forward/knee-chest</b>, raised <b>amylase and lipase</b>, nausea, and in severe cases Cullen's/Grey Turner's signs. Care — <b>NPO with NG suction</b>, IV fluids, analgesia, no alcohol, low-fat diet on resumption</li>
      <li><b>Inflammatory bowel disease</b>: <b>Ulcerative colitis</b> — continuous rectal/colonic mucosal inflammation with <b>bloody diarrhoea</b>, risk of toxic megacolon; cure is total colectomy. <b>Crohn's</b> — skip lesions anywhere from mouth to anus, transmural, <b>fistulae and strictures</b>, steatorrhoea. Both: low-residue high-protein high-calorie diet during flares, avoid trigger foods, corticosteroids and immunosuppressants</li>
      <li><b>Ostomy care</b>: measure and cut the appliance to about <b>3 mm (1/8 inch) larger than the stoma</b>, apply a skin barrier, empty when a third full, change every 3–7 days. A healthy stoma is <b>pink/red and moist</b>; a <b>dusky, purple or black stoma is an emergency</b>. Avoid gas-forming and odour-producing foods. An ileostomy produces liquid output (high fluid and electrolyte loss); a colostomy output is more formed the more distal it is</li>
      <li><b>Cirrhosis</b>: jaundice, ascites, oedema, <b>spider angiomas, palmar erythema</b>, easy bruising (low clotting factors), <b>hepatic encephalopathy with asterixis</b> from raised ammonia. Care — <b>restrict protein when encephalopathic</b>, low sodium, diuretics, <b>lactulose to 2–3 soft stools a day</b>, daily weight and abdominal girth, bleeding precautions, no alcohol or hepatotoxic drugs</li>
      <li><b>Oesophageal varices</b>: massive haematemesis → maintain the airway, large-bore IV, blood products, octreotide, band ligation; avoid straining, coughing and NSAIDs</li>
      <li><b>Hepatitis A</b> — faecal-oral, acute only; <b>B, C, D</b> — blood/body fluid, can become chronic; <b>E</b> — faecal-oral, serious in pregnancy. Hepatitis B is preventable by vaccine; standard precautions plus needle-stick prevention protect the nurse</li>
      <li><b>NG tube</b>: confirm placement by <b>X-ray</b> initially, then by aspirating gastric contents and checking the pH (≤5) and the external mark before every use and feed. Keep the head elevated <b>30–45°</b> during and for 30–60 min after a feed, check residual volume, and flush with water before and after</li>
      <li><b>Colorectal cancer</b>: change in bowel habit, blood in the stool, weight loss, anaemia. Screening — faecal occult blood and <b>colonoscopy</b>. When a lesion cannot be reached or characterised by imaging, <b>direct visualisation (laparoscopy/endoscopy) with biopsy</b> gives the diagnosis</li>
    </ul>
            `,
            questions: [
                {
                    q: "The patient has fever, nuasea, vomiting and rebound tenderness. He is complaining diarrhea with blood and abdominal pain. What is the most appropriate Diagnosis?",
                    options: ["Lower right pain","Appendicitis","Gastroenteritis","Devirticulitis"],
                    answer: 3,
                    source: 'SNLE recall',
                },
                {
                    q: "Which of the following diets would be most appropriate for the client with Crohn's disease?",
                    options: ["High-calorie, low-protein","High-protein, low-residue","Low-fat, high-fiber","Low-sodium, high-carbohydrate"],
                    answer: 1,
                    source: 'SNLE recall',
                },
                {
                    q: "Patient came to ER complain from blood in stool. What is the most common diagnosis??",
                    options: ["GERD","Gastroenteritis","BID bowel inflammatory disease"],
                    answer: 2,
                    source: 'SNLE recall',
                },
                {
                    q: "A female client who received general anesthesia returns from surgery. Postoperatively, which nursing diagnosis takes highest priority for this client?",
                    options: ["Acute pain R/T surgery","Deficient fluid volume R/T blood and fluid loss from surgery","Impaired physical mobility R/T surgery","Risk for aspiration R/T anesthesia"],
                    answer: 3,
                    source: 'SNLE recall',
                },
                {
                    q: "How much of blood volume for patient has a 10% blood loss and his weight is 50kg",
                    options: ["300ml","400ml","3000ml","4000ml"],
                    answer: 1,
                    source: 'SNLE recall',
                },
            ],
        },
        {
            id: "ms-neuro",
            title: "11 — Neurological",
            title_en: "Neurological",
            summaryHtml: `
<ul>
      <li><b>Increased ICP</b>: the earliest sign is a <b>change in the level of consciousness</b>; then headache, vomiting (often projectile, without nausea), pupillary changes, papilloedema, and finally <b>Cushing's triad — hypertension with a widening pulse pressure, bradycardia and irregular respiration</b> (a late, ominous sign). Care — <b>head of bed 30°, head midline</b>, avoid neck and hip flexion, avoid coughing, straining, suctioning for &gt;10 s and clustering activities; give <b>mannitol</b>; keep the environment quiet</li>
      <li><b>Stroke</b>: sudden focal deficit. Act <b>FAST</b> (Face, Arm, Speech, Time) — an urgent <b>non-contrast CT is the first investigation</b> to distinguish ischaemic from haemorrhagic before any thrombolysis. Thrombolysis for ischaemic stroke within the window</li>
      <li>Stroke deficits: <b>left-brain</b> stroke → right-sided weakness and <b>aphasia</b>, slow and cautious behaviour; <b>right-brain</b> stroke → left-sided weakness, <b>neglect of the left side</b>, impulsiveness and poor safety awareness</li>
      <li><b>Dysphagia</b> after stroke: swallow assessment before any oral intake, thickened fluids, sit fully upright, <b>chin-tuck</b>, small bites, food on the unaffected side, and remain upright 30 min after eating — the priority is preventing <b>aspiration</b></li>
      <li><b>Seizure precautions</b>: padded side rails up, bed low, suction and oxygen at the bedside. <b>During</b> a seizure — turn the patient on their side, protect the head, loosen clothing, <b>never restrain and never force anything into the mouth</b>, time the seizure, and observe the pattern. Afterwards — maintain the airway, allow rest, reorient, document</li>
      <li><b>Basal skull fracture</b>: <b>raccoon eyes</b> (periorbital bruising), Battle's sign (mastoid bruising), and <b>CSF rhinorrhoea/otorrhoea with a positive halo sign</b> → do <b>not</b> insert an NG tube or suction the nose, and do not pack the ears or nose</li>
      <li><b>Spinal cord injury</b>: immobilise the whole spine. <b>Autonomic dysreflexia</b> in lesions at or above T6 — <b>sudden severe hypertension, pounding headache, flushing and sweating above the lesion with bradycardia</b>, usually triggered by a <b>blocked catheter or faecal impaction</b>. <b>Sit the patient upright immediately</b>, then find and remove the trigger</li>
      <li><b>Myasthenia gravis</b>: fatigable weakness worse at the end of the day, ptosis and diplopia; risk of respiratory failure. Give anticholinesterases <b>on time and before meals</b></li>
      <li><b>Parkinson's disease</b>: <b>resting tremor, rigidity, bradykinesia and postural instability</b>, mask-like face, shuffling festinating gait, micrographia. Care — safety and fall prevention, small frequent high-calorie soft meals, speech and physiotherapy, allow extra time; levodopa/carbidopa (avoid high protein at the same time)</li>
      <li><b>Multiple sclerosis</b>: relapsing focal deficits, fatigue, visual loss, spasticity → avoid heat and infection, energy conservation, exercise as tolerated</li>
      <li><b>Cranial nerves</b>: I olfactory · II optic (vision) · III oculomotor · IV trochlear · <b>V trigeminal — facial sensation including the gums, teeth and jaw, and chewing</b> · VI abducens · <b>VII facial — facial expression and taste of the anterior tongue</b> · VIII vestibulocochlear (hearing and balance) · <b>IX glossopharyngeal and X vagus — gag and swallow</b> · XI accessory (shoulder shrug) · XII hypoglossal (tongue)</li>
      <li><b>Meningitis</b>: fever, severe headache, photophobia, <b>nuchal rigidity</b>, positive Kernig's and Brudzinski's signs. <b>Neisseria meningitidis and Streptococcus pneumoniae cause about 80% of adult cases</b>. <b>Droplet precautions</b> and immediate antibiotics after cultures; a darkened quiet room</li>
    </ul>
    <div class="sum-key">
      <span class="sum-key-title">نقاط امتحانية</span>
      <ul>
        <li>Gum, tooth and jaw pain maps to the <b>fifth cranial nerve (trigeminal)</b>.</li>
        <li><b>Raccoon eyes</b> = basal skull fracture — and therefore <b>no nasogastric tube</b>.</li>
        <li>The earliest sign of rising ICP is a <b>change in level of consciousness</b>, not the pupils.</li>
      </ul>
    </div>
            `,
            questions: [
                {
                    q: "The nurse received patient from Recovery room PACU. What is the first assessment should the nurse observe?",
                    options: ["Oxygen","Level of consciousness"],
                    answer: 0,
                    source: 'SNLE recall',
                },
                {
                    q: "Patient complained from Loss of consciousness, The patient diagnosed with meningitis. What's the first action for the patient",
                    options: ["Neurological assessment","Observe for seizures"],
                    answer: 0,
                    source: 'SNLE recall',
                },
                {
                    q: "while taking care of the a patient with a spinal cord injury, the patient suddenly complains of pounding headache upon assessment the patient was found to have diaphoresis , drop in heart and elevated blood pressure , autonomic dysreflexia is suspected and the head on the bed is elevate . Which of the following is the most appropriate to important immediately?",
                    options: ["Notify the physician","Assess bladder for distension","Continue to monitor for next hour"],
                    answer: 1,
                    source: 'SNLE recall',
                },
                {
                    q: "Nurse is preparing to insert a nasogastric tube into a client. The nurse places the client in which position for insertion",
                    options: ["Right side","Low Fowler's","High Fowler's","Supine with the head flat"],
                    answer: 2,
                    source: 'SNLE recall',
                },
                {
                    q: "Gum and tooth pain 一 what is the cranial nerve?",
                    options: ["Third nerve","Fifth nerve","Seventh nerve","Ninth nerve"],
                    answer: 1,
                    source: 'SNLE recall',
                },
            ],
        },
        {
            id: "ms-heme",
            title: "12 — Haematology & Oncology",
            title_en: "Haematology & Oncology",
            summaryHtml: `
<ul>
      <li><b>Iron deficiency anaemia</b>: pallor, fatigue, dyspnoea on exertion, <b>glossitis and angular stomatitis</b>, spoon nails. Iron between meals with vitamin C; expect black stools</li>
      <li><b>Pernicious anaemia / B12 deficiency</b>: the combination of a <b>smooth, beefy-red tongue with loss of papillae</b>, pallor, gastric fullness with anorexia, loose stools and <b>numbness and paraesthesia of the feet and lower legs</b> is the classic picture. Confirm with a <b>serum vitamin B12 level</b> (the Schilling test is the historical absorption study). Treatment is <b>lifelong intramuscular B12</b>, because the problem is lack of intrinsic factor — oral replacement will not be absorbed. Neurological damage may be permanent, which is why early recognition matters</li>
      <li><b>Folic acid deficiency</b> gives the same megaloblastic anaemia <b>without</b> the neurological signs</li>
      <li><b>Sickle cell crisis</b>: precipitated by dehydration, hypoxia, infection, cold and stress → <b>hydration, oxygen and adequate analgesia</b>, warmth and rest</li>
      <li><b>Thrombocytopenia</b>: platelets &lt;150,000; spontaneous bleeding risk below ~20,000 → bleeding precautions — soft toothbrush, electric razor, no IM injections, no rectal temperatures or suppositories, no aspirin/NSAIDs, avoid straining</li>
      <li><b>Neutropenia</b>: absolute neutrophil count &lt;1,000 → <b>protective isolation</b>, no fresh flowers or plants, no raw fruit, vegetables or uncooked food, no crowds, no live vaccines; strict hand hygiene. <b>Fever is a medical emergency</b> — cultures and antibiotics immediately</li>
      <li><b>DIC</b>: simultaneous widespread clotting and bleeding with a falling platelet count, prolonged PT/aPTT and raised D-dimer → treat the underlying cause, replace factors</li>
      <li><b>Chemotherapy</b> side effects and care: <b>bone marrow suppression</b> (infection, bleeding, anaemia), nausea and vomiting (antiemetics <b>before</b> the dose), <b>stomatitis</b> (soft brush, saline or bicarbonate rinses, avoid alcohol-based mouthwash, spicy and acidic food), alopecia (temporary, prepare the patient), fatigue, and <b>extravasation of vesicants</b> — stop the infusion at once and follow the antidote protocol</li>
      <li><b>Radiation therapy</b> skin care: do not wash off the markings, wash gently with lukewarm water and mild soap, no lotions, powders, perfumes, deodorants or adhesive tape on the field, no heat or ice, protect from the sun, wear loose cotton clothing</li>
      <li>Internal radiation (brachytherapy) — the principles are <b>time, distance and shielding</b>: limit time in the room, keep the maximum distance, use a lead shield, no pregnant staff or visitors and no children, keep long forceps and a lead container at the bedside for a dislodged implant</li>
      <li><b>Warning signs of cancer — CAUTION</b>: Change in bowel or bladder habits, A sore that does not heal, Unusual bleeding or discharge, Thickening or a lump, Indigestion or difficulty swallowing, Obvious change in a wart or mole, Nagging cough or hoarseness</li>
    </ul>
            `,
            questions: [
                {
                    q: "A 76-year-old woman presents to the clinic with complaints of fatigue. She feels her heart skips beats and becomes irregular with activities such as climbing stairs and walking long distances. She has chest pain with exertion that she rates at a level 5 on a 1-10 scale. The pain subsides with rest. Her skin and nail beds appear pale. An assessment of gait shows imbalance and she admits to episodes of numbness in the hands and feet. The nurse suspects anemia and prepares a care plan. Which test would be the most appropriate?",
                    options: ["Schilling","Folic acid levels","Lymph node biopsy","Bone marrow aspiration"],
                    answer: 0,
                    source: 'SNLE recall',
                },
                {
                    q: "Patient came to ER and diagnosed with meningitis. How should the nurse handle with patient?",
                    options: ["Keep patient in same isolation room","Use mask N95 all times","Limit the visitors"],
                    answer: 0,
                    source: 'SNLE recall',
                },
                {
                    q: "The patient with cancer. He is on I. V infusion the nurse observed there is Extravasation. What should the nurse do?",
                    options: ["Stop the Infusion immediately","Slow the rate","Report the doctor"],
                    answer: 0,
                    source: 'SNLE recall',
                },
                {
                    q: "post- operative patient to be discharged and his temperature is 37.6 at 8:00 - everything else is normal what to do?",
                    options: ["informs the physician to delay discharge","gives aspirin dose earlier than scheduled","temperature is normal because of the time","suspected infection"],
                    answer: 2,
                    source: 'SNLE recall',
                },
                {
                    q: "A patient treated an insect bite with traditional alternative therapy of row garlic juice caused strong skin reaction. The patient agreed not use it again after the nurse explained its harmful effects. What should the nurse instruct him on discharge?",
                    options: ["Refrain self treatment","Medical treatment better than traditional","Avoid communication injury","Change dressing frequently"],
                    answer: 0,
                    source: 'SNLE recall',
                },
            ],
        },
        {
            id: "ms-msk",
            title: "13 — Musculoskeletal",
            title_en: "Musculoskeletal",
            summaryHtml: `
<ul>
      <li><b>Fracture</b>: pain, deformity, swelling, crepitus, loss of function. Immobilise <b>above and below</b> the joint before moving. Complications — <b>compartment syndrome, fat embolism, DVT, infection</b></li>
      <li><b>Neurovascular assessment — the 5 Ps</b>: Pain, Pallor, Pulselessness, Paraesthesia, Paralysis. <b>Pain out of proportion and unrelieved by opioids</b> is the earliest sign of <b>compartment syndrome</b> → report immediately, do <b>not</b> elevate above heart level and do <b>not</b> apply ice; the treatment is fasciotomy</li>
      <li><b>Fat embolism</b>: 24–72 h after a long-bone or pelvic fracture — <b>dyspnoea, confusion and a petechial rash over the chest and axillae</b> → oxygen and supportive care</li>
      <li><b>Cast care</b>: handle a wet cast with the <b>palms</b>, leave it uncovered to air dry, elevate the limb, apply ice for the first 24 h, keep it clean and dry, never insert anything inside to scratch, and report a hot spot, foul smell, drainage, numbness or increasing pain</li>
      <li><b>Traction</b>: weights hang <b>freely</b> and are never removed or lifted, ropes stay in the pulleys, maintain the line of pull and correct body alignment, and give pin-site care</li>
      <li><b>Shoulder dislocation</b>: the arm is held immobile, there is loss of the normal contour, and the affected limb often appears <b>longer than the other side</b> with severe pain on any movement. Check neurovascular status distally before and after reduction, then immobilise in a sling</li>
      <li><b>Osteoporosis</b>: silent until fracture. Calcium and vitamin D, <b>weight-bearing exercise</b>, stop smoking and limit alcohol, fall prevention, bisphosphonates taken <b>first thing in the morning with a full glass of water, then remain upright for 30 minutes</b></li>
      <li><b>Osteoarthritis</b> — degenerative, asymmetrical weight-bearing joints, <b>brief morning stiffness &lt;30 minutes</b>, worse with activity → weight loss, low-impact exercise, heat, paracetamol. <b>Rheumatoid arthritis</b> — autoimmune, <b>symmetrical small joints</b>, <b>morning stiffness &gt;1 hour</b>, systemic fatigue and fever → DMARDs, rest during flares, splints, gentle range-of-motion exercises, cold during a flare and heat between flares</li>
      <li><b>Gout</b>: sudden severe pain in the great toe, hyperuricaemia → colchicine and NSAIDs acutely, <b>allopurinol for prevention (not in an acute attack)</b>, avoid <b>purine-rich foods</b> (organ meat, red meat, sardines, anchovies, shellfish, beer), increase fluids</li>
      <li><b>Amputation</b>: monitor for haemorrhage (keep a tourniquet at the bedside for the first 24 h), elevate the stump for the first 24 h then keep it flat and avoid prolonged sitting to prevent flexion contracture, prone positioning periods, stump wrapping in a figure-of-eight, and acknowledge <b>phantom limb pain as real</b></li>
    </ul>
            `,
            questions: [
                {
                    q: "Patient came to ER with burn on his face and chest. What is the first action for nurse?",
                    options: ["Access I. V line","Give oxygen"],
                    answer: 1,
                    source: 'SNLE recall',
                },
                {
                    q: "A man is to be discharged from the General appendectomy. The precautionary measures, plans are discussed with him. What is the most important desired outcome after discharge?",
                    options: ["Remain free of post-surgical complications","Report fever, redness or drainage from the wound site","Use pain management techniques apropos","Resume gradual activities and avoid weight"],
                    answer: 0,
                    source: 'SNLE recall',
                },
                {
                    q: "25-year-old man presents with a compound fracture in the left leg and profuse bleeding What immediate action should be taken to control the bleeding?",
                    options: ["Elevate the patient's leg","Apply pressure on the femoral artery","Use a tourniquet above the fracture site","Apply direct pressure on the fracture site"],
                    answer: 3,
                    source: 'SNLE recall',
                },
                {
                    q: "Why should the nurse not keep drainage bag at the body level of the patient during transporting him?",
                    options: ["Prevent entry of air","Prevent entry of fluid to patient","Prevent tension pneumothorax"],
                    answer: 1,
                    source: 'SNLE recall',
                },
                {
                    q: "Patient with systemic Lepus arthritis complain pain in the joint She has butterfly rash in her face what is most appropriate nursing action ?",
                    options: ["maintain skin integrity","manage pain discomfort relief"],
                    answer: 1,
                    source: 'SNLE recall',
                },
            ],
        },
        {
            id: "ms-burns",
            title: "14 — Burns",
            title_en: "Depth · Rule of Nines (adult) · Parkland formula · Phases & care",
            summaryHtml: `
<h4 class="deck-topic">Depth</h4>
    <ul>
      <li><b>Superficial (1st degree)</b> — epidermis only, red, painful, no blisters (sunburn)</li>
      <li><b>Partial thickness (2nd degree)</b> — epidermis and dermis, <b>blisters, moist, very painful</b></li>
      <li><b>Full thickness (3rd degree)</b> — through the dermis, dry, leathery, white/black/charred, <b>painless</b> because the nerve endings are destroyed</li>
      <li><b>4th degree</b> — into muscle and bone</li>
    </ul>
    <h4 class="deck-topic">Rule of Nines (adult)</h4>
    <ul>
      <li>Head and neck <b>9%</b> · each arm <b>9%</b> (anterior 4.5 + posterior 4.5) · each leg <b>18%</b> (anterior 9 + posterior 9) · anterior trunk <b>18%</b> · posterior trunk <b>18%</b> · perineum <b>1%</b></li>
      <li>The palm of the patient's own hand ≈ <b>1%</b></li>
    </ul>
    <h4 class="deck-topic">Parkland formula</h4>
    <div class="sum-callout">
      <b>Total fluid in 24 h = 4 mL × body weight (kg) × %TBSA</b> (Lactated Ringer's)<br>
      Give <b>half in the first 8 hours</b> from the <b>time of the burn</b>, and the remaining half over the next 16 hours.
    </div>
    <ul>
      <li><b>Worked example</b>: a 62 kg patient with second-degree burns to the <b>dorsal (posterior) surface of one arm (4.5%) and the dorsal surface of both legs (9% + 9% = 18%)</b> = <b>22.5% TBSA</b> → 4 × 62 × 22.5 = <b>5,580 mL</b> in 24 hours, with 2,790 mL in the first 8 hours</li>
      <li>The most reliable indicator of adequate fluid resuscitation is <b>urine output of 30–50 mL/hour</b> in an adult</li>
    </ul>
    <h4 class="deck-topic">Phases &amp; care</h4>
    <ul>
      <li><b>Emergent/resuscitative phase (first 24–48 h)</b>: the priority is <b>AIRWAY</b> — suspect inhalation injury with facial burns, singed nasal hair, soot in the sputum, hoarseness or stridor, and intubate early. Then fluid resuscitation, pain control with <b>IV opioids only</b> (absorption from muscle is unreliable), and prevention of hypothermia. Fluid shifts <b>out of</b> the vessels cause hypovolaemic shock, <b>hyperkalaemia</b> and haemoconcentration</li>
      <li><b>Acute phase</b>: wound care, escharotomy, infection prevention with <b>reverse/protective isolation</b> and strict aseptic technique, <b>high-calorie high-protein nutrition</b>, and physiotherapy with splinting to prevent contractures</li>
      <li><b>Rehabilitation phase</b>: pressure garments, scar management, exercise, and psychological support for body-image change</li>
      <li><b>Curling's ulcer</b> (stress gastric ulcer) is a classic burn complication — give prophylactic PPI/H2 blocker</li>
    </ul>
            `,
            questions: [
                {
                    q: "The patient came to ER with second degree of burn on his dorsal left arm and dorsal of both leg TBSA. The patient weight is 62 Kg. What is the total intravenous fluids the patient need?",
                    options: ["5580","6580","6680","7680"],
                    answer: 0,
                    source: 'SNLE recall',
                },
                {
                    q: "The patient complained from stomachache continue after eating for 2 to 3 hours. The patient has increased weight 3 kg during short time. Which of the following is the most important nursing diagnosis?",
                    options: ["Imbalance nutrition","Acute pain","Fluid volume deficit"],
                    answer: 1,
                    source: 'SNLE recall',
                },
                {
                    q: "Woman with tabia fracture. What is the priority action for her?",
                    options: ["Elevate and support leg","Pain management"],
                    answer: 0,
                    source: 'SNLE recall',
                },
                {
                    q: "Patient with chest tube drainage. What is the most appropriate nursing diagnosis?",
                    options: ["High risk for infection","Disturbed body image"],
                    answer: 0,
                    source: 'SNLE recall',
                },
                {
                    q: "Why should control of high blood pressure with hypertensive patient. What is the most common complication?",
                    options: ["Hypertensive Encephalopcy","Cardiac decompensation"],
                    answer: 0,
                    source: 'SNLE recall',
                },
            ],
        },
        {
            id: "ms-shock",
            title: "15 — Shock & Emergency",
            title_en: "Shock & Emergency",
            summaryHtml: `
<table>
      <thead><tr><th>Type</th><th>Cause</th><th>Distinguishing features</th></tr></thead>
      <tbody>
        <tr><td><b>Hypovolaemic</b></td><td>Haemorrhage, burns, dehydration, trauma</td><td>Pale, cool, clammy, <b>tachycardia, hypotension, tachypnoea</b>, flat neck veins, low urine output, altered mental state → <b>fluids and blood</b></td></tr>
        <tr><td><b>Cardiogenic</b></td><td>Pump failure — MI, arrhythmia</td><td>Same low output picture but with <b>distended neck veins and crackles</b> → inotropes, not large fluid boluses</td></tr>
        <tr><td><b>Septic</b> (distributive)</td><td>Infection</td><td>Early <b>warm, flushed skin with fever</b> and a wide pulse pressure, then cold shock → cultures, <b>broad-spectrum antibiotics within 1 hour</b>, fluids, vasopressors</td></tr>
        <tr><td><b>Neurogenic</b> (distributive)</td><td>Spinal cord injury, spinal anaesthesia</td><td><b>Hypotension with BRADYCARDIA</b> and warm dry skin — the one shock without tachycardia</td></tr>
        <tr><td><b>Anaphylactic</b> (distributive)</td><td>Allergen</td><td>Urticaria, angio-oedema, <b>stridor and bronchospasm</b>, hypotension → <b>adrenaline IM immediately</b>, airway, oxygen, fluids, antihistamine, steroid</td></tr>
        <tr><td><b>Obstructive</b></td><td>Tension pneumothorax, tamponade, massive PE</td><td>Relieve the obstruction</td></tr>
      </tbody>
    </table>
    <ul>
      <li>A trauma patient who is <b>pale, diaphoretic and incoherent with HR 130, RR 34 and BP 50/40</b> after abdominal injury and a femoral fracture has <b>hypovolaemic shock</b></li>
      <li>Compensatory stage: the BP may still be normal — <b>tachycardia, tachypnoea, restlessness and reduced urine output come first</b>. Restlessness and anxiety are early signs of cerebral hypoxia</li>
      <li>Trauma priorities — <b>ABCDE</b>: Airway with cervical spine control, Breathing, Circulation and haemorrhage control, Disability (GCS, pupils), Exposure with temperature control</li>
      <li><b>Triage</b>: red/immediate (life-threatening but survivable), yellow/delayed, green/minor (walking wounded), black/expectant</li>
      <li><b>Poisoning</b>: identify the substance, contact the poison centre, do <b>not</b> routinely induce vomiting; activated charcoal if indicated and the airway is protected</li>
      <li><b>Heat stroke</b>: hot dry skin, temperature &gt;40 °C, altered consciousness → rapid active cooling and IV fluids</li>
      <li><b>Alkhurma haemorrhagic fever</b> — a <b>Flaviviridae</b> virus of regional importance, transmitted by tick bite and contact with infected livestock; treat supportively with standard plus contact precautions</li>
    </ul>
            `,
            questions: [
                {
                    q: "A patient is admitted to the emergency department after sustaining abdominal injuries and a broken femur from a motor vehicle accident. The patient is pale, diaphoretic, and is not talking coherently. Vital signs upon admission are temperature 98.0 F (36.3 C), heart rate 130 beats/minute, respiratory rate 34 breaths/minute, blood pressure 50/40mmHg. The healthcare provider suspects which type of shock?",
                    options: ["Distributi ve","Neurogenic","Cardiogenic","Hypovolemic"],
                    answer: 3,
                    source: 'SNLE recall',
                },
                {
                    q: "The baby has asthma and complaining with cough, fever and secretions . He is lethargic and cyanosis around his dry and crackles lips and anorexic. Wahati the first action?",
                    options: ["Assess skin turger and dehydration","Assess Oxygen saturation and child behavior","The last 24 hour intake and output"],
                    answer: 1,
                    source: 'SNLE recall',
                },
                {
                    q: "A 21-year-old in oversized clothing presents to the hospital with of felling dizzy and faint. The hair and nail appear thin and dry. The skin appears pale, and she has sunken eye sockets and tenting skin. Her body mass index is 16. She often induces vomiting after eating blood is collected for analysis (see lab results). *Blood pressure 90/52 mmHg, Heart rate 118 /min, Respiratory rate 26/min, * Temperature 37.2 ͦ C, Oxygen saturation 97%. ABG Test Result Normal value HCO ₃ 31 22 – 88mmol/L PCO ₂ 10.3 4.7-6.0 kPa PH 7.50 7.36-7.45 Which nursing problems stem is the most appropriate?",
                    options: ["Impaired nutrition","Decreased cardiac output","Infective airway clearance","Ineffective breathing pattern"],
                    answer: 1,
                    source: 'SNLE recall',
                },
                {
                    q: "Patient with ABG ph low, pco2 high, hco3 normal what is expected signs and symptoms for the patient ?",
                    options: ["Vomiting and difficult breathing SOB","Headache and vomiting","Shallow, rapid breath and vomiting","Kaussmal respiration"],
                    answer: 0,
                    source: 'SNLE recall',
                },
                {
                    q: "*What is Early sign of portal hypertension?",
                    options: ["Bradycardia","Hypotension","Flat jugular vein"],
                    answer: 1,
                    source: 'SNLE recall',
                },
            ],
        },
        {
            id: "ms-sensory",
            title: "16 — Eye, Ear & Skin",
            title_en: "Eye, Ear & Skin",
            summaryHtml: `
<ul>
      <li><b>Cataract</b> — painless progressive blurring with glare and a cloudy lens. After surgery: avoid bending, lifting more than ~5 kg, straining, coughing and sneezing; wear an eye shield especially at night; sleep on the <b>unaffected</b> side; report <b>sudden pain, flashes of light or a curtain over the vision</b></li>
      <li><b>Glaucoma</b> — raised intraocular pressure with gradual <b>loss of peripheral vision (tunnel vision)</b>; the damage is <b>permanent</b>, so lifelong eye drops are essential. <b>Acute angle-closure</b> — sudden severe eye pain, halos, a fixed mid-dilated pupil and nausea — is an emergency. <b>Anticholinergics and mydriatics are contraindicated</b></li>
      <li><b>Retinal detachment</b>: floaters, flashes of light and a curtain/shadow across the visual field → keep the patient quiet, cover the eye, and prepare for urgent surgery</li>
      <li>A child after eye surgery who is irritable and pulling at the shield, with <b>swelling, redness and tearing</b>, needs the eye protected — apply elbow restraints as ordered and report the signs, since rubbing threatens the surgical repair</li>
      <li><b>Ménière's disease</b>: episodic vertigo, tinnitus and fluctuating hearing loss → low-salt diet, diuretics, safety during attacks, no sudden head movements</li>
      <li><b>Otosclerosis</b> causes conductive hearing loss; a <b>stapedectomy</b> is the surgical treatment — afterwards avoid blowing the nose, sudden movement and air travel</li>
      <li>Communicating with a hearing-impaired patient: face them directly in good light, speak <b>clearly at a normal pace and slightly lower pitch</b>, do not shout, reduce background noise, and use written information</li>
      <li><b>Cellulitis</b>: spreading erythema, warmth, swelling and tenderness → elevate the limb, mark the border, antibiotics</li>
      <li><b>Herpes zoster (shingles)</b>: a painful vesicular rash in a <b>dermatomal</b> distribution → antivirals early, analgesia, and <b>airborne plus contact precautions if disseminated</b> (contact precautions if localised and covered)</li>
      <li><b>Melanoma — ABCDE</b>: Asymmetry, Border irregularity, Colour variation, Diameter &gt;6 mm, Evolving. Teach sun protection and monthly skin self-examination</li>
      <li>Skin assessment in dark-skinned patients: check the <b>conjunctiva, oral mucosa, palms, soles and nail beds</b> for pallor, cyanosis and jaundice</li>
    </ul>
            `,
            questions: [
                {
                    q: "After left retinal detachment surgery. Which of the following is the most appropriate health education ?",
                    options: ["avoid bowel straining","talk with pt from right side"],
                    answer: 0,
                    source: 'SNLE recall',
                },
                {
                    q: "A 43-year-old man in the post-surgical area complains of abdominal pain radiating to the naval which is increasing with examination his abdomen is guarded with marked tender lower quadrant. What is the immediate goal of care to do?",
                    options: ["Teach abdominal splinting during coughing","Administer pain medication as ordered","Assess pain and report immediately","Position on the left lateral side"],
                    answer: 2,
                    source: 'SNLE recall',
                },
                {
                    q: "42 year-old patient went to the clinic for an eye consult . Patient complained of blurred vision , ocular pain and head active . During assessment tonometry was done ( see results ) . Test Result Normal Values Intraocular pressure 34 10-20mmHg . Which surgical procedure is the most appropriate ?",
                    options: ["Laminectomy","Laser trabeculoplasty","Incision and drainage","Extra capsular cataract extraction"],
                    answer: 1,
                    source: 'SNLE recall',
                },
                {
                    q: "A 17-year-old arrived at the emergency room complaining abdominal pain on right lower quadrant. Pain was rated as 9 numeric scale with positive rebound tenderness over the pain. Blood pressure 120/70 Heart rate 100 Respiratory rate 22 Which of the following interventions has the highest priority?",
                    options: ["keep NPO","secure an IV access","prepares for ultrasound","prepares for abdominal surgery"],
                    answer: 0,
                    source: 'SNLE recall',
                },
                {
                    q: "56-year-old present to the emergency department experiencing left sides eye discomfort for the past 3 hours, left eye was blurred while vision in the right eye remained examination showed increased intra-ocular pressure in the left eye pupil of the left also reacted slowly to light. which is the most likely health problem?",
                    options: ["Detached retina","Macular hole","Glaucoma"],
                    answer: 2,
                    source: 'SNLE recall',
                },
            ],
        },
    ],
};

export default medicalSurgicalNursing;
