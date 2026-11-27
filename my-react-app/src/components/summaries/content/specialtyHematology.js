// Hematology — medical-track section of the summaries catalog.
// Mirrored for the slide viewer in backend/content/summaryHtml (keep the two in sync).
// Inline questions are copied from the SQB bank.
const specialtyHematology = {
    id: "hematology",
    title: "Hematology",
    title_en: "SMLE Review — 9 Topics",
    icon: "shield-check",
    accent: "#f472b6",
    intro: "Hematology for SMLE revision: Microcytic Anaemia & Iron · Macrocytic Anaemia & Marrow Failure · Haemolysis · Sickle Cell Disease & Thalassaemia · Thrombocytopenia & HIT · Venous Thrombosis & Anticoagulation · Bleeding Disorders & Transfusion Reactions · Blood Cancers · Febrile Neutropenia & Oncology Emergencies.",
    subtopics: [
        {
            id: "hem-microcytic",
            title: "01 — Anaemia Approach & Iron Deficiency",
            title_en: "MCV · Iron studies · Source of loss · Replacement",
            summaryHtml: `
<h4 class="deck-topic">Start with two numbers</h4>
<ul>
  <li><b>MCV</b>: microcytic (below 80), normocytic (80–100), macrocytic (above 100).</li>
  <li><b>Reticulocyte response</b>: high means bleeding or haemolysis (or recovery); low means the marrow is not producing enough.</li>
</ul>
<h4 class="deck-topic">Microcytic anaemia</h4>
<div class="deck-block deck-tbl"><table><thead><tr><th>Test</th><th>Iron deficiency</th><th>Anaemia of inflammation</th><th>Thalassaemia trait</th></tr></thead><tbody>
<tr><td><b>Ferritin</b></td><td>Low</td><td>Normal or high</td><td>Normal</td></tr>
<tr><td><b>TIBC</b></td><td>High</td><td>Low or low-normal</td><td>Normal</td></tr>
<tr><td><b>Transferrin saturation</b></td><td>Low</td><td>Low</td><td>Normal</td></tr>
<tr><td><b>RBC count / RDW</b></td><td>Low count, high RDW</td><td>Often normocytic</td><td>High count, RDW often normal</td></tr>
</tbody></table></div>
<ul>
  <li><b>Low ferritin</b> is the most useful and specific blood test for iron deficiency. Because ferritin rises with inflammation and liver disease, a normal value does not always exclude it.</li>
  <li>MCV divided by RBC count below 13 favours thalassaemia trait; it is only a screening clue.</li>
  <li><b>Sideroblastic anaemia</b>: iron-loaded, ring sideroblasts in marrow; think of alcohol, isoniazid, lead or myelodysplasia.</li>
  <li>Marrow iron stain is the classic reference but is rarely needed.</li>
</ul>
<h4 class="deck-topic">Find the cause</h4>
<ul>
  <li>Adults: <b>chronic blood loss</b> is the main cause. <b>Men and postmenopausal women need GI evaluation</b>, usually upper and lower endoscopy, plus coeliac testing.</li>
  <li>Do not blame haemorrhoids without examining the colon, especially in middle age or later.</li>
  <li>Young women: menstrual loss and pregnancy. Children: poor intake and excess cow milk.</li>
  <li>Screening in infancy is commonly done at about <b>12 months</b>.</li>
</ul>
<h4 class="deck-topic">Treatment</h4>
<ul>
  <li><b>Oral iron</b> first, once daily or on alternate days; more doses add side effects. Take away from tea, calcium and antacids.</li>
  <li>Reticulocytes rise within about a week; Hb rises over the following weeks. Continue about <b>3 months after Hb is normal</b> to refill stores.</li>
  <li><b>IV iron</b>: intolerance, poor response, malabsorption, active IBD, chronic kidney disease on dialysis, or need for fast repletion.</li>
  <li>No response: check adherence, ongoing loss, absorption and the diagnosis.</li>
  <li>Transfuse for instability or significant symptoms, not for a number alone in a stable young patient.</li>
</ul>
<div class="sum-key">
  <span class="sum-key-title">نقاط امتحانية</span>
  <ul>
    <li>Low ferritin = iron deficiency.</li>
    <li>Iron deficiency in an adult man = look for blood loss.</li>
    <li>High TIBC points to iron deficiency; low TIBC points to inflammation.</li>
    <li>Very low MCV with a high red cell count suggests thalassaemia trait.</li>
  </ul>
</div>
`,
            questions: [
                {
                    "q": "In iron deficiency anaemia, which is the MOST SPECIFIC test to establish the diagnosis?",
                    "options": [
                        "Low ferritin",
                        "Low serum iron",
                        "High total iron-binding capacity"
                    ],
                    "answer": 0,
                    "explanation": "Iron deficiency: LOW FERRITIN is the most specific test - but it is an acute-phase reactant and may be falsely normal in inflammation. Iron deficiency: low ferritin, high TIBC, low transferrin saturation. Chronic disease: normal/high ferritin, LOW TIBC.",
                    "source": "SMLE recall"
                },
                {
                    "q": "What is the most common cause of iron deficiency anaemia in an adult male?",
                    "options": [
                        "Poor dietary intake",
                        "Chronic blood loss",
                        "Haemolysis",
                        "Vitamin B12 deficiency"
                    ],
                    "answer": 1,
                    "explanation": "Iron deficiency anaemia in an adult male or a postmenopausal woman = GI blood loss until proven otherwise - scope both ends, looking for colorectal cancer. Diet is a cause in infants and strict vegetarians. Haemolysis recycles iron; B12 deficiency is macrocytic. Low ferritin confirms.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A 47-year-old female presents with iron deficiency anemia. She has 3rd degree hemorrhoids. Which of the following is the most appropriate next step?",
                    "options": [
                        "Colonoscopy",
                        "Hemorrhoidectomy",
                        "MRI abdomen",
                        "CT abdomen"
                    ],
                    "answer": 0,
                    "explanation": "Never blame iron deficiency anaemia on haemorrhoids — always scope to exclude colorectal cancer. IDA + haemorrhoids → colonoscopy anyway.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A 59-year-old woman comes to the clinic with headache, dyspnea on exertion and occasional palpitations (see lab results). Test Result Normal Values Hb 95 130-170 g/L (Male) 120-160 g/L (Female) MCV 68 80-95 f1 Platelets count 530 150-400 x 109/L Total iron binding capacity 30 11.6-31.3 mol. (Male) 9-30.4 pmol/L (Female) Ferritin 3 20-300 g/L (Male) 20-120 pg/L (Female) Which of the following is the most likely diagnosis?",
                    "options": [
                        "B12 deficiency",
                        "Folate deficiency",
                        "Iron deficiency anemia",
                        "Anemia of chronic disease"
                    ],
                    "answer": 2,
                    "explanation": "The lab results show low hemoglobin, small red blood cells (low MCV), and extremely low ferritin (the body's iron storage protein). This combination is the textbook definition of iron deficiency anemia. The elevated platelet count is a common, reactive response by the bone marrow to severe iron deficiency.",
                    "source": "SMLE bank"
                }
            ],
        },
        {
            id: "hem-sickle-thal",
            title: "02 — Sickle Cell Disease & Thalassaemia",
            title_en: "Diagnosis · Crises · Acute chest · Prevention",
            summaryHtml: `
<h4 class="deck-topic">Diagnosis</h4>
<ul>
  <li><b>Haemoglobin electrophoresis or HPLC</b> confirms. In HbSS: mainly HbS, variable HbF and <b>no HbA</b> (unless recently transfused).</li>
  <li>Trait has both HbA and HbS, with more A. A solubility screen cannot separate trait from disease.</li>
  <li>Two carriers: each child has a <b>25% chance of disease</b>, 50% of being a carrier. Test both partners before marriage or pregnancy.</li>
</ul>
<div class="deck-block deck-tbl"><table><thead><tr><th>Complication</th><th>Clue</th><th>Action</th></tr></thead><tbody>
<tr><td><b>Vaso-occlusive pain</b></td><td>Dactylitis (hand-foot swelling) is an early sign in infants</td><td>Rapid analgesia, often opioid; fluids without overload; look for trigger</td></tr>
<tr><td><b>Acute chest syndrome</b></td><td>New lung infiltrate with fever, chest pain or hypoxia</td><td>Oxygen, antibiotics including atypical cover, analgesia, spirometry, transfusion</td></tr>
<tr><td><b>Stroke</b></td><td>Any focal deficit</td><td>Urgent imaging and exchange transfusion</td></tr>
<tr><td><b>Splenic sequestration</b></td><td>Large spleen, sudden Hb fall, shock</td><td>Careful urgent transfusion</td></tr>
<tr><td><b>Aplastic crisis</b></td><td>Parvovirus B19; <b>low reticulocytes</b></td><td>Support, transfuse if needed</td></tr>
</tbody></table></div>
<ul>
  <li><b>Exchange transfusion</b> is used for severe or worsening acute chest syndrome (marked hypoxia despite treatment, multilobar disease) and for stroke.</li>
  <li>Other problems: gallstones, priapism, avascular necrosis, kidney injury, and infection by encapsulated organisms. <i>Salmonella</i> osteomyelitis is a classic association, alongside <i>S. aureus</i>.</li>
</ul>
<h4 class="deck-topic">Long-term care</h4>
<ul>
  <li><b>Hydroxyurea</b> raises HbF and reduces pain crises, <b>acute chest syndrome</b> and transfusion need. Monitor counts.</li>
  <li>Penicillin prophylaxis in young children, full vaccination, folic acid.</li>
  <li>Yearly <b>transcranial Doppler</b> from about 2 to 16 years; high velocity leads to regular transfusion.</li>
</ul>
<h4 class="deck-topic">Thalassaemia</h4>
<ul>
  <li><b>Beta trait</b>: mild microcytosis, <b>raised HbA2</b>. Iron deficiency can lower HbA2 and hide it. No iron unless deficient.</li>
  <li><b>Beta major</b>: severe anaemia after infancy when HbF falls, hepatosplenomegaly, bone changes. Regular transfusion with <b>iron chelation</b>; stem cell transplant can cure.</li>
  <li><b>Alpha trait</b>: electrophoresis is often normal; genetic testing confirms. HbH disease = three genes lost.</li>
</ul>
<div class="sum-key">
  <span class="sum-key-title">نقاط امتحانية</span>
  <ul>
    <li>HbSS has no HbA.</li>
    <li>Hydroxyurea prevents acute chest syndrome.</li>
    <li>Worsening hypoxia in acute chest syndrome: exchange transfusion.</li>
    <li>Raised HbA2 = beta-thalassaemia trait.</li>
  </ul>
</div>
`,
            questions: [
                {
                    "q": "A patient with known sickle cell disease presents with chest pain. Vital signs show hypoxia, with oxygen saturation of 80% on room air. He is started on IV fluids and antibiotics (piperacillin-tazobactam and vancomycin). Despite this, he continues to deteriorate clinically, with worsening hypoxia. What is the most appropriate next step in management?",
                    "options": [
                        "Add levofloxacin",
                        "Exchange transfusion"
                    ],
                    "answer": 1,
                    "explanation": "Acute chest syndrome that keeps worsening on oxygen, antibiotics and fluids needs exchange transfusion to cut the HbS fraction; escalating antibiotics does not address the sickling that is driving the hypoxia.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A patient with sickle cell disease and acute chest syndrome is shown on chest X-ray. Which drug decreases the risk of this complication?",
                    "options": [
                        "Hydroxyurea",
                        "Antibiotic",
                        "Folic acid",
                        "Vaccination"
                    ],
                    "answer": 0,
                    "explanation": "Sickle acute chest syndrome (top cause of death). PREVENTION = HYDROXYUREA (raises HbF, cuts sickling, fewer crises and ACS, mortality benefit). Don't confuse the other axes: penicillin/vaccines prevent infection in the asplenic patient; folic acid supports haemolytic turnover. ACUTE severe ACS = exchange transfusion.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A patient has sickle cell anemia. Which type of hemoglobin is not found on electrophoresis?",
                    "options": [
                        "Hemoglobin A",
                        "Hemoglobin B",
                        "Hemoglobin C",
                        "Hemoglobin D"
                    ],
                    "answer": 0,
                    "explanation": "In sickle cell anemia (homozygous HbSS), no normal adult hemoglobin A is produced, since both beta-globin alleles carry the sickle mutation; electrophoresis instead shows predominantly hemoglobin S, along with hemoglobin F and A2.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A child known to have sickle cell anaemia develops painful swelling of the hands and fingers. What is this called?",
                    "options": [
                        "Cellulitis",
                        "Dactylitis"
                    ],
                    "answer": 1,
                    "explanation": "DACTYLITIS (hand-foot syndrome): often the FIRST sign of sickle cell disease, at 6 months to 2 years, from vaso-occlusion in the small bones of the hands and feet - symmetrical, painful, non-erythematous swelling. Treat as a vaso-occlusive crisis: hydration, analgesia, warmth, oxygen. In a FEBRILE sickle cell child, also consider OSTEOMYELITIS (Salmonella is characteristic) and septic arthritis. Long-term: penicillin prophylaxis, vaccination (functional asplenia), and hydroxyurea.",
                    "source": "SMLE recall"
                },
                {
                    "q": "Haemoglobin electrophoresis shows markedly increased HbA2. What is the diagnosis?",
                    "options": [
                        "Beta-thalassaemia trait",
                        "Sickle cell anaemia"
                    ],
                    "answer": 0,
                    "explanation": "Beta-thalassaemia trait: RAISED HbA2 on electrophoresis, microcytosis out of proportion to the anaemia, HIGH red-cell count, normal ferritin. Distinguish from iron deficiency (low RBC count, low ferritin). Counsel about carrier risk; do NOT give iron.",
                    "source": "SMLE recall"
                }
            ],
        },
        {
            id: "hem-platelets",
            title: "03 — Thrombocytopenia: ITP, TTP, HIT & DIC",
            title_en: "Smear first · What to stop · What not to transfuse",
            summaryHtml: `
<p>Repeat the count and check a <b>blood film</b>: clumping causes false low counts; schistocytes change urgency.</p>
<div class="deck-block deck-tbl"><table><thead><tr><th>Condition</th><th>Coagulation tests</th><th>Key clue</th></tr></thead><tbody>
<tr><td><b>ITP</b></td><td>Normal</td><td>Well patient, isolated low platelets</td></tr>
<tr><td><b>TTP</b></td><td>Usually normal</td><td>Haemolysis with schistocytes, often neurological signs</td></tr>
<tr><td><b>HUS</b></td><td>Usually normal</td><td>Haemolysis with kidney injury, often after bloody diarrhoea</td></tr>
<tr><td><b>DIC</b></td><td>PT and aPTT prolonged</td><td>Low fibrinogen, high D-dimer, serious underlying illness</td></tr>
<tr><td><b>HIT</b></td><td>No specific change</td><td>Fall after heparin exposure; thrombosis</td></tr>
</tbody></table></div>
<h4 class="deck-topic">ITP</h4>
<ul>
  <li>Diagnosis of exclusion; check HIV and hepatitis C in adults and review drugs.</li>
  <li>Adults: treat for significant bleeding or a very low count (commonly below 30). <b>Corticosteroids</b> first; add <b>IVIG</b> when a fast rise is needed.</li>
  <li>Persistent disease: thrombopoietin receptor agonist, rituximab or splenectomy.</li>
  <li>Children with only skin bleeding are usually observed.</li>
  <li>Platelet transfusion is kept for life-threatening bleeding, with other therapy.</li>
</ul>
<h4 class="deck-topic">TTP and HUS</h4>
<ul>
  <li>TTP: severe <b>ADAMTS13 deficiency</b> (activity below 10%). The full pentad is uncommon. Thrombocytopenia plus microangiopathic haemolysis is enough to act.</li>
  <li><b>Urgent plasma exchange</b> with steroids; rituximab and caplacizumab are added where available. Do not transfuse platelets routinely.</li>
  <li>Shiga toxin HUS: supportive care. Complement-mediated HUS: complement inhibitor.</li>
</ul>
<h4 class="deck-topic">Heparin-induced thrombocytopenia</h4>
<ul>
  <li>Typically a <b>fall of more than 50%, 5–10 days</b> after starting; sooner after recent exposure. More common with unfractionated heparin.</li>
  <li>Estimate with the 4T score; test PF4 antibodies, then confirm with a functional assay.</li>
  <li><b>Stop all heparin</b> (including LMWH and flushes) <b>and start a non-heparin anticoagulant</b>: argatroban, bivalirudin, fondaparinux or a DOAC, chosen by kidney, liver and bleeding status.</li>
  <li>Do not start warfarin until platelets recover (usually at least 150).</li>
</ul>
<h4 class="deck-topic">DIC</h4>
<p>Triggers: sepsis, trauma, obstetric disasters, acute promyelocytic leukaemia, cancer. <b>Treat the cause.</b> Give platelets, plasma or cryoprecipitate (for low fibrinogen) for bleeding or before procedures, not for numbers alone.</p>
<div class="sum-key">
  <span class="sum-key-title">نقاط امتحانية</span>
  <ul>
    <li>Isolated severe thrombocytopenia, normal PT and aPTT, well patient: ITP.</li>
    <li>Schistocytes with low platelets: think TTP and start plasma exchange urgently.</li>
    <li>Suspected HIT: stop heparin first, then replace it with another anticoagulant.</li>
    <li>HIT causes clots more than bleeding.</li>
  </ul>
</div>
`,
            questions: [
                {
                    "q": "A patient known to have hypertension on amlodipine presents with purpura and easy bleeding after brushing his teeth. All labs are normal except platelets 5. PT and APTT are normal. What is the most likely diagnosis?",
                    "options": [
                        "Thrombotic thrombocytopenic purpura",
                        "Immune mediated thrombocytopenia"
                    ],
                    "answer": 1,
                    "explanation": "Isolated severe thrombocytopenia with normal haemoglobin, film and coagulation is ITP - TTP requires microangiopathic haemolysis and cannot be diagnosed with otherwise normal labs.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A DVT patient started LMW heparin a few days ago and had thrombocytopenia. What's the initial action?",
                    "options": [
                        "Stop heparin",
                        "Switch to UFH",
                        "Switch to rivaroxaban"
                    ],
                    "answer": 0,
                    "explanation": "A fall in platelets a few days after starting low molecular weight heparin raises concern for heparin-induced thrombocytopenia, which causes clotting rather than just bleeding; the typical onset is days 5 to 10. The first action is to stop all heparin. Switching to unfractionated heparin is contraindicated. Then start a non-heparin anticoagulant and send HIT antibody tests.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A 76-year-old man was admitted with a deep vein thrombosis and started on unfractionated heparin. His admission labs were normal. On the sixth day his left foot became cold and his platelet count dropped to 16 x 10^9/L. What is the best initial treatment?",
                    "options": [
                        "Stop unfractionated heparin",
                        "Stop unfractionated heparin and give protamine",
                        "Platelet transfusion",
                        "Stop unfractionated heparin and switch to low molecular weight heparin"
                    ],
                    "answer": 0,
                    "explanation": "HIT type II: platelet fall >50% at DAY 5-10 with NEW THROMBOSIS (not bleeding), from anti-heparin/PF4 antibodies. STOP ALL heparin AND start a non-heparin anticoagulant (argatroban, bivalirudin, danaparoid, fondaparinux). NEVER switch to LMWH (cross-reacts), NEVER transfuse platelets, delay warfarin until platelets recover.",
                    "source": "SMLE recall"
                }
            ],
        },
        {
            id: "hem-vte",
            title: "04 — Venous Thrombosis & Anticoagulation",
            title_en: "Diagnosis · Duration · APS · Thrombolysis limits",
            summaryHtml: `
<h4 class="deck-topic">Diagnosing DVT</h4>
<ul>
  <li>Estimate probability (Wells score).</li>
  <li><b>Unlikely</b>: D-dimer; a negative result excludes it.</li>
  <li><b>Likely</b>: <b>compression duplex ultrasound</b>. A positive D-dimer alone proves nothing.</li>
</ul>
<h4 class="deck-topic">Choosing the drug</h4>
<ul>
  <li><b>DOAC</b> is preferred for most patients. Apixaban and rivaroxaban need no initial heparin; dabigatran and edoxaban start after parenteral treatment.</li>
  <li><b>Warfarin</b>: overlap with heparin for at least <b>5 days</b> and until INR is 2 or more for 24 hours. <b>Target INR 2–3</b> for venous thrombosis.</li>
  <li><b>Pregnancy</b>: LMWH. Warfarin and DOACs are avoided.</li>
  <li><b>Mechanical valve</b>: warfarin, not a DOAC.</li>
  <li>Severe kidney failure limits LMWH and DOACs.</li>
  <li><b>IVC filter</b> only when anticoagulation cannot be given (or in selected failures).</li>
</ul>
<h4 class="deck-topic">How long?</h4>
<div class="deck-block deck-tbl"><table><thead><tr><th>Setting</th><th>Usual duration</th></tr></thead><tbody>
<tr><td>Provoked by major temporary factor (surgery)</td><td>3 months</td></tr>
<tr><td><b>Unprovoked</b> proximal DVT or PE</td><td>At least 3 months, then <b>continue long term if bleeding risk allows</b>, with regular review</td></tr>
<tr><td>Active cancer</td><td>While cancer is active; DOAC or LMWH</td></tr>
</tbody></table></div>
<h4 class="deck-topic">Antiphospholipid syndrome</h4>
<ul>
  <li>Venous or <b>arterial clots</b>, <b>pregnancy loss</b>, low platelets; may occur with lupus.</li>
  <li><b>Prolonged aPTT</b> that does not correct on mixing, yet the patient clots.</li>
  <li>Tests: lupus anticoagulant, anticardiolipin, anti-beta-2 glycoprotein I; positive twice at least <b>12 weeks</b> apart.</li>
  <li>Thrombotic APS: warfarin (avoid DOACs, especially if triple positive). Pregnancy: LMWH with low-dose aspirin.</li>
</ul>
<ul>
  <li>Inherited thrombophilia testing is not routine; consider it only if it would change care. Factor V Leiden is the classic inherited cause in many populations.</li>
</ul>
<h4 class="deck-topic">Absolute contraindications to systemic thrombolysis (STEMI or PE)</h4>
<ul>
  <li><b>Any previous intracranial haemorrhage</b></li>
  <li>Known brain tumour or structural cerebral vascular lesion</li>
  <li>Recent ischaemic stroke (commonly within 3 months), recent major head injury or brain or spinal surgery</li>
  <li>Suspected aortic dissection, active internal bleeding</li>
</ul>
<p>In life-threatening PE the balance is judged individually. Acute ischaemic stroke has its own checklist.</p>
<div class="sum-key">
  <span class="sum-key-title">نقاط امتحانية</span>
  <ul>
    <li>Suspected DVT with high probability: duplex ultrasound.</li>
    <li>Warfarin target for DVT: INR 2–3.</li>
    <li>Unprovoked DVT with low bleeding risk: extended anticoagulation.</li>
    <li>Clots, miscarriages and long aPTT: antiphospholipid syndrome.</li>
  </ul>
</div>
`,
            questions: [
                {
                    "q": "A patient presents with unilateral leg swelling and calf tenderness, raising suspicion of deep vein thrombosis. What is the most appropriate initial assessment?",
                    "options": [
                        "Intravenous low-molecular-weight heparin",
                        "Duplex ultrasonography"
                    ],
                    "answer": 1,
                    "explanation": "Suspected DVT is confirmed by compression duplex ultrasonography before anticoagulation; treatment precedes imaging only when the scan will be delayed and clinical probability is high.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A 48-year-old man develops right popliteal vein thrombosis post-sleeve surgery. He is started on enoxaparin and warfarin. What is the target therapeutic international normalization ratio range for this patient?",
                    "options": [
                        "1-1.9",
                        "2-3",
                        "3.1-4",
                        "No need for monitoring"
                    ],
                    "answer": 1,
                    "explanation": "Core Concept: Warfarin is a vitamin K antagonist used for the long-term treatment and secondary prevention of venous thromboembolism (VTE), including deep vein thrombosis (DVT). Clinical Presentation: · DVT: Unilateral leg swelling, pain, warmth, and erythema. · Complications: Pulmonary embolism (PE) and post-thrombotic syndrome. Diagnosis: · First-line: Venous duplex compression ultrasound of the lower extremities. · Gold standard: Contrast venography (historically, though rarely used today). Management: · Acute: Initial parenteral anticoagulation (e.g., LMWH like enoxaparin) bridged with warfarin, or use of a Direct Oral Anticoagulant (DOAC). · Definitive: Long-term oral anticoagulation. For a standard unprovoked or provoked DVT/PE, the target International Normalized Ratio (INR) for warfarin therapy is strictly 2.0 to 3.0.",
                    "source": "SMLE bank"
                },
                {
                    "q": "A patient had an episode of unprovoked deep vein thrombosis. He has no personal or family history of related diseases. He has been on warfarin for three months and is tolerating it well. His current INR is 2.5. What is the appropriate management for this patient?",
                    "options": [
                        "Discontinue warfarin now",
                        "Continue warfarin for a total of 6 months",
                        "Continue warfarin indefinitely",
                        "Discontinue warfarin and perform thrombophilia testing"
                    ],
                    "answer": 2,
                    "explanation": "A first unprovoked VTE carries a higher recurrence risk, and standard guidelines recommend extended/indefinite anticoagulation for appropriate candidates, rather than stopping at 3 or 6 months or basing the decision on thrombophilia testing.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A 35-year-old woman presents with bilateral leg deep vein thrombosis. She has a history of recurrent still births (see lab result). Test Result Normal Value: APTT 55 30-40 sec. Which of the following is the most likely diagnosis?",
                    "options": [
                        "Antiphospholipid syndrome",
                        "Antithrombin deficiency",
                        "Protein S deficiency",
                        "Protein C deficiency"
                    ],
                    "answer": 0,
                    "explanation": "1. Core Concept: Antiphospholipid syndrome (APS) is an acquired autoimmune hypercoagulable state characterized by the presence of antiphospholipid antibodies that cause paradoxical aPTT prolongation in vitro but thrombosis in vivo. 2. Clinical Presentation: · Recurrent venous or arterial thrombosis (e.g., bilateral deep vein thrombosis). · Pregnancy morbidity, such as recurrent miscarriages or stillbirths. · Complications include pulmonary embolism, stroke, and multi-organ failure (catastrophic APS). 3. Diagnosis: * First-line: Clinical evaluation of symptoms and an initial coagulation panel demonstrating a prolonged aPTT that does not correct with mixing studies. * Gold Standard: Confirmatory testing for antiphospholipid antibodies (lupus anticoagulant, anticardiolipin antibodies, anti-beta-2-glycoprotein I) on two separate occasions at least 12 weeks apart. 4. Management: * Acute: Immediate anticoagulation with Low Molecular Weight Heparin (LMWH) or unfractionated heparin. * Long-term: LMWH and low-dose aspirin are the definitive management during pregnancy to prevent fetal loss; lifelong Warfarin is the gold standard for non-pregnant patients with a history of thrombosis.",
                    "source": "SMLE bank"
                },
                {
                    "q": "Which of the following is an absolute contraindication for thrombolytic therapy?",
                    "options": [
                        "Pregnancy",
                        "Intracranial hemorrhage 2 years ago",
                        "Cardiopulmonary resuscitation for 10 min",
                        "Blood pressure at presentation of 180/110 mmH"
                    ],
                    "answer": 1,
                    "explanation": "Core Concept: Thrombolytic (fibrinolytic) therapy is used to dissolve thrombi in conditions like STEMI, massive pulmonary embolism, and acute ischemic stroke. However, it carries a significant risk of severe bleeding. Clinical Presentation (of indications): STEMI (chest pain, ST elevation), ischemic stroke (focal neurologic deficits), massive PE (hemodynamic instability). · Complications of therapy: Major hemorrhage, particularly intracranial hemorrhage (ICH). Diagnosis: · Diagnostic algorithm: Rapid clinical assessment and ECG/imaging to confirm the indication, followed by screening for contraindications. · First-line diagnostic plan: ECG for STEMI, CT head for stroke. · Gold standard: Coronary angiography for STEMI (PCI is preferred over thrombolysis if available within 120 minutes). Management: · Acute management: Administration of fibrinolytics (e.g., tenecteplase, alteplase) if primary PCI is unavailable or delayed. · Long-term/Definitive management: Secondary prevention of atherosclerosis or thrombosis. · Contraindications: Absolute contraindications include *any* prior intracranial hemorrhage, known structural cerebral vascular lesion, known malignant intracranial neoplasm, ischemic stroke within the last 3 months (except acute ischemic stroke within 4.5 hours), suspected aortic dissection, active bleeding or bleeding diathesis, and significant closed-head or facial trauma within 3 months. Therefore, an ICH 2 years ago is an absolute contraindication.",
                    "source": "SMLE bank"
                }
            ],
        },
        {
            id: "hem-haemolysis",
            title: "05 — Haemolytic Anaemia",
            title_en: "Markers · Coombs test · G6PD · Spherocytosis",
            summaryHtml: `
<h4 class="deck-topic">Is it haemolysis?</h4>
<ul>
  <li>High <b>reticulocytes</b>, high <b>LDH</b>, high <b>indirect bilirubin</b>, low <b>haptoglobin</b>.</li>
  <li>Intravascular: haemoglobinuria and urine haemosiderin. Extravascular: splenomegaly is common.</li>
  <li>Long-standing haemolysis causes pigment gallstones and raises folate need.</li>
</ul>
<p>Next: <b>blood film</b> and <b>direct antiglobulin (Coombs) test</b>. A positive direct test shows antibody or complement on the red cell. The indirect test finds free antibody in serum.</p>
<h4 class="deck-topic">Autoimmune haemolysis</h4>
<div class="deck-cards">
  <div class="deck-card diag"><div class="deck-card-h">Warm</div><ul><li>IgG on cells; spherocytes</li><li>Lupus, CLL, lymphoma, drugs or idiopathic</li><li><b>Corticosteroids</b>, then rituximab; splenectomy later</li></ul></div>
  <div class="deck-card mgmt"><div class="deck-card-h">Cold agglutinin</div><ul><li>IgM; test shows complement (C3)</li><li><i>Mycoplasma</i>, EBV, lymphoproliferative disease</li><li>Keep warm, treat cause; rituximab-based therapy if severe; steroids work poorly</li></ul></div>
</div>
<ul>
  <li>Do not withhold urgently needed blood only because crossmatch is difficult; work with the blood bank.</li>
</ul>
<h4 class="deck-topic">G6PD deficiency</h4>
<ul>
  <li>X-linked, so mainly males. Common in parts of Saudi Arabia.</li>
  <li>Triggers: infection, <b>fava beans</b>, primaquine, dapsone, rasburicase, nitrofurantoin, naphthalene.</li>
  <li>Sudden jaundice and dark urine; <b>bite cells</b> and Heinz bodies.</li>
  <li>Enzyme level can look <b>falsely normal during an attack</b>; repeat about 3 months later.</li>
  <li>Stop and avoid triggers; supportive care and transfusion if severe.</li>
</ul>
<h4 class="deck-topic">Other causes</h4>
<ul>
  <li><b>Hereditary spherocytosis</b>: family history, spleen, gallstones, high MCHC, spherocytes, <b>negative direct test</b>. EMA binding test. Folate; splenectomy for significant disease, with vaccination first.</li>
  <li><b>Microangiopathic</b> (schistocytes): TTP, HUS, DIC, severe hypertension, HELLP, mechanical valve.</li>
  <li><b>Paroxysmal nocturnal haemoglobinuria</b>: haemolysis, unusual-site thrombosis, cytopenias; flow cytometry for CD55 and CD59; complement inhibitors.</li>
  <li>Malaria must be excluded in a febrile traveller with haemolysis.</li>
</ul>
<div class="sum-key">
  <span class="sum-key-title">نقاط امتحانية</span>
  <ul>
    <li>Reticulocytes and LDH up with haptoglobin down: haemolysis.</li>
    <li>Positive direct Coombs test: immune haemolysis.</li>
    <li>Spherocytes occur in both autoimmune and hereditary disease; the Coombs test separates them.</li>
    <li>Episodic haemolysis after fava beans or oxidant drugs: G6PD deficiency.</li>
  </ul>
</div>
`,
            questions: [
                {
                    "q": "Labs show a positive direct Coombs test, positive indirect Coombs test, low haemoglobin, and high reticulocytes. What is the most likely diagnosis?",
                    "options": [
                        "Spherocytosis",
                        "Autoimmune hemolytic anemia",
                        "Fanconi anemia",
                        "G6PD"
                    ],
                    "answer": 1,
                    "explanation": "A positive direct Coombs test with anaemia and reticulocytosis indicates autoimmune haemolytic anaemia (antibody-mediated red-cell destruction) — unlike Coombs-negative haemolysis (spherocytosis, G6PD). Positive Coombs + haemolysis → autoimmune haemolytic anaemia.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A patient with SLE presents with fatigue. Labs show low hemoglobin, high reticulocyte count, and high lactate dehydrogenase, with low haptoglobin. What type of anemia is this?",
                    "options": [
                        "Hemolytic anemia",
                        "Anemia of chronic disease"
                    ],
                    "answer": 0,
                    "explanation": "A low hemoglobin with an elevated reticulocyte count, indicating the bone marrow is appropriately responding to red cell loss, along with elevated LDH and low haptoglobin from red cell breakdown, is the classic pattern of hemolytic anemia, which can occur as an autoimmune complication of SLE.",
                    "source": "SMLE recall"
                }
            ],
        },
        {
            id: "hem-macrocytic",
            title: "06 — Macrocytic Anaemia & Marrow Failure",
            title_en: "B12 vs folate · Pernicious anaemia · Pancytopenia",
            summaryHtml: `
<h4 class="deck-topic">Megaloblastic anaemia</h4>
<ul>
  <li>High MCV, <b>hypersegmented neutrophils</b>, sometimes pancytopenia. LDH and indirect bilirubin can be high from ineffective production.</li>
  <li>Glossitis, mild jaundice, fatigue.</li>
</ul>
<div class="deck-block deck-tbl"><table><thead><tr><th>Feature</th><th>B12 deficiency</th><th>Folate deficiency</th></tr></thead><tbody>
<tr><td><b>Causes</b></td><td>Pernicious anaemia, gastrectomy, ileal disease or resection, vegan diet, metformin, long acid suppression</td><td>Poor diet, alcohol, pregnancy, haemolysis, malabsorption, methotrexate and some antiepileptics</td></tr>
<tr><td><b>Neurology</b></td><td>Yes</td><td>Usually not the classic cord syndrome</td></tr>
<tr><td><b>Homocysteine</b></td><td>High</td><td>High</td></tr>
<tr><td><b>Methylmalonic acid</b></td><td><b>High</b></td><td>Normal</td></tr>
</tbody></table></div>
<h4 class="deck-topic">Neurology of B12 deficiency</h4>
<ul>
  <li><b>Subacute combined degeneration</b>: loss of vibration and joint position sense, sensory ataxia, weakness with <b>Babinski sign</b>, while ankle reflexes may be absent (neuropathy).</li>
  <li>Memory or mood change can occur, even without anaemia.</li>
</ul>
<h4 class="deck-topic">Pernicious anaemia</h4>
<ul>
  <li>Autoimmune; linked with vitiligo and thyroid disease.</li>
  <li><b>Intrinsic factor antibodies</b> are highly specific. Parietal cell antibodies are more sensitive but less specific. A negative intrinsic factor result does not exclude it.</li>
  <li>Raises the risk of gastric neoplasia.</li>
</ul>
<h4 class="deck-topic">Treatment</h4>
<ul>
  <li><b>Intramuscular B12</b>, especially with neurological signs; high-dose oral therapy works in selected patients. Lifelong for pernicious anaemia.</li>
  <li>Never give <b>folate alone</b> when B12 status is unknown: blood improves while nerve damage can progress. Replace B12 first or together.</li>
  <li>Watch potassium early in severe cases.</li>
</ul>
<h4 class="deck-topic">Non-megaloblastic macrocytosis and pancytopenia</h4>
<ul>
  <li>Alcohol, liver disease, hypothyroidism, reticulocytosis, drugs, <b>myelodysplasia</b> (older patient with cytopenias and dysplastic cells).</li>
  <li><b>Aplastic anaemia</b>: pancytopenia, low reticulocytes, <b>hypocellular marrow</b>, usually no splenomegaly. Causes include drugs, toxins, viruses, immune or inherited disease. Severe disease: stem cell transplant in suitable younger patients with a donor, otherwise antithymocyte globulin with ciclosporin.</li>
</ul>
<div class="sum-key">
  <span class="sum-key-title">نقاط امتحانية</span>
  <ul>
    <li>Raised methylmalonic acid separates B12 from folate deficiency.</li>
    <li>Anaemia with posterior column signs and Babinski: B12 deficiency.</li>
    <li>Low B12 with vitiligo: test intrinsic factor antibodies.</li>
    <li>Treat B12 before or with folate.</li>
  </ul>
</div>
`,
            questions: [
                {
                    "q": "A 46-year-old man comes to the clinic with dyspnea on exertion and palpitations. On examination, he has patches of vitiligo (see lab results). Test Result Normal Values Hb 89 130-170 g/L (Male) 120-160 g/L (Female) MCV 103 80-95 fl Platelets count 128 150-400 x 109/L Ferritin 105 20-300 g/L (Male) 20-120 g/L (Female) Vitamin B12 (Men) 122 160-900 ng/L Folic Acid (Men) 8 <4 ug/L Which of the following is the most appropriate test to be ordered next?",
                    "options": [
                        "Gastroscopy and antral biopsy",
                        "Intrinsic factor antibodies",
                        "Anti-gliadin antibodies",
                        "Colonoscopy"
                    ],
                    "answer": 1,
                    "explanation": "The patient has large red blood cells (high MCV), low Vitamin B12, and vitiligo (an autoimmune skin condition). This points to pernicious anemia, an autoimmune disease where the body attacks the stomach cells that produce intrinsic factor, a protein strictly required to absorb Vitamin B12 from food. Testing for intrinsic factor antibodies confirms the diagnosis.",
                    "source": "SMLE bank"
                },
                {
                    "q": "A 46-year-old man has dyspnea on exertion and palpitations. On examination, he has patches of vitiligo and has absent reflexes with positive Babinski in the lower limbs (see lab results). Test Result Normal Values Hb 91 130-170 g/L (Male) 120-160 g/L (Female) MCV 103 80-95 f1 Platelets count 129 150-400 × 109/L Ferritin 120 20-300 g/. (Male) 20-120 g/L (Female) Vitamin B12 (Men) 124 160-900 ng/L Folic Acid (Men) 6 <4 ug/L Which of the following is the most appropriate management?",
                    "options": [
                        "Oral iron supplement",
                        "Oral b12 supplement",
                        "Folate supplement",
                        "Parenteral b12 supplement"
                    ],
                    "answer": 3,
                    "explanation": "The patient has signs of nerve damage from severe Vitamin B12 deficiency, likely due to pernicious anemia (an autoimmune condition linked to his vitiligo). Because pernicious anemia destroys the stomach's ability to absorb B12 from food or pills, the vitamin must be given via injections (parenteral) to bypass the gut and enter the bloodstream directly.",
                    "source": "SMLE bank"
                }
            ],
        },
        {
            id: "hem-bleeding-transfusion",
            title: "07 — Coagulation Disorders & Transfusion Reactions",
            title_en: "PT vs aPTT · vWD · Haemophilia · Reversal",
            summaryHtml: `
<h4 class="deck-topic">Pattern of bleeding</h4>
<ul>
  <li><b>Platelet or vWF problem</b>: petechiae, gum and nose bleeding, heavy periods, immediate bleeding after cuts.</li>
  <li><b>Factor problem</b>: deep haematomas, joint bleeding, delayed bleeding.</li>
</ul>
<div class="deck-block deck-tbl"><table><thead><tr><th>Result</th><th>Think of</th></tr></thead><tbody>
<tr><td><b>PT only long</b></td><td>Factor VII deficiency, early warfarin effect or vitamin K lack</td></tr>
<tr><td><b>aPTT only long</b></td><td>Factors VIII, IX, XI, XII; heparin; lupus anticoagulant; severe vWD</td></tr>
<tr><td><b>Both long</b></td><td>Liver disease, DIC, marked vitamin K deficiency, common pathway defect</td></tr>
<tr><td><b>All normal but bleeding</b></td><td>vWD, platelet function defect, factor XIII deficiency</td></tr>
</tbody></table></div>
<ul>
  <li><b>Mixing study</b>: correction suggests deficiency; no correction suggests an inhibitor.</li>
  <li><b>vWD</b>: commonest inherited bleeding disorder. aPTT may be normal. Test vWF antigen, activity and factor VIII. Desmopressin (especially type 1), vWF concentrate, tranexamic acid.</li>
  <li><b>Haemophilia A</b> (VIII) and <b>B</b> (IX): X-linked. Replace the factor early; emicizumab prevents bleeds in type A. Avoid IM injections and NSAIDs.</li>
  <li><b>Newborn vitamin K deficiency</b>: umbilical, gut or brain bleeding with long PT. Prevent with IM vitamin K at birth.</li>
</ul>
<h4 class="deck-topic">Reversal</h4>
<ul>
  <li>Warfarin with major bleeding: <b>prothrombin complex concentrate plus IV vitamin K</b> (plasma if no PCC).</li>
  <li>High INR without bleeding: hold warfarin; low-dose oral vitamin K if very high.</li>
  <li>Heparin: protamine (partial for LMWH). Dabigatran: idarucizumab. Factor Xa inhibitors: PCC or a specific agent, depending on availability.</li>
</ul>
<h4 class="deck-topic">Transfusion reactions</h4>
<p>For any new fever, hypotension, pain or breathing difficulty: <b>stop the transfusion immediately</b>, keep the line open with saline, check patient and bag identity, inform the blood bank.</p>
<ul>
  <li><b>Acute haemolytic</b> (usually ABO error): fever, flank pain, dark urine, shock, DIC. Fluids and support kidneys.</li>
  <li><b>Febrile non-haemolytic</b>: diagnosis after excluding haemolysis and sepsis.</li>
  <li><b>Urticaria only</b>: pause, antihistamine; may resume cautiously. <b>Anaphylaxis</b>: adrenaline; consider IgA deficiency.</li>
  <li><b>TACO</b>: overload, raised BP and JVP; diuretic. <b>TRALI</b>: lung injury within 6 hours without overload; respiratory support.</li>
  <li><b>Irradiated</b> components prevent transfusion graft-versus-host disease in at-risk patients.</li>
</ul>
<div class="sum-key">
  <span class="sum-key-title">نقاط امتحانية</span>
  <ul>
    <li>Fever during transfusion: stop first, then investigate.</li>
    <li>Isolated long aPTT with joint bleeds in a boy: haemophilia.</li>
    <li>Long PT with newborn bleeding: vitamin K deficiency.</li>
    <li>Raised pressure points to TACO; hypotension and fever favour TRALI.</li>
  </ul>
</div>
`,
            questions: [
                {
                    "q": "A patient with sickle cell disease presents with acute chest syndrome. While receiving a blood transfusion, he suddenly develops fever and chills. What is the most appropriate immediate action?",
                    "options": [
                        "Hydroxyurea",
                        "Stop transfusion immediately",
                        "Hydration",
                        "ABC"
                    ],
                    "answer": 1,
                    "explanation": "Fever and chills during a transfusion may signal an acute haemolytic reaction or bacterial contamination, so the first action is to stop the transfusion immediately. Keep the line open with saline through new tubing, assess airway, breathing and circulation, check identity and send samples to the blood bank. Many cases prove to be febrile non-haemolytic reactions.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A neonate presents with BLEEDING FROM THE UMBILICAL STUMP. Coagulation studies are abnormal (prolonged PT).",
                    "options": [
                        "hemophilia A",
                        "Von Willebrand disease",
                        "vit K deficiency",
                        "Thrombocytopenia"
                    ],
                    "answer": 2,
                    "explanation": "Umbilical stump/mucosal bleeding in a neonate with a prolonged PT = vitamin K deficiency bleeding — prevented by IM vitamin K at birth. Vitamin K → factors II, VII, IX, X.",
                    "source": "SMLE recall"
                }
            ],
        },
        {
            id: "hem-malignancy",
            title: "08 — Leukaemia, Lymphoma, Myeloma & MPN",
            title_en: "Recognition clues · Confirming tests · First steps",
            summaryHtml: `
<h4 class="deck-topic">Leukaemia</h4>
<div class="deck-block deck-tbl"><table><thead><tr><th>Type</th><th>Typical clues</th><th>Notes</th></tr></thead><tbody>
<tr><td><b>ALL</b></td><td>Child; bone pain, cytopenias, blasts</td><td>Marrow with immunophenotype; protect the CNS</td></tr>
<tr><td><b>AML</b></td><td>Adult; blasts, <b>Auer rods</b></td><td>Marrow with genetics</td></tr>
<tr><td><b>APL</b></td><td>t(15;17), bleeding with DIC</td><td>Emergency: start <b>ATRA</b> on suspicion</td></tr>
<tr><td><b>CML</b></td><td>High WBC with all myeloid stages, basophilia, large spleen</td><td><b>BCR-ABL</b>, t(9;22); tyrosine kinase inhibitor</td></tr>
<tr><td><b>CLL</b></td><td>Older adult, lymphocytosis, <b>smudge cells</b></td><td>Flow cytometry; early disease often observed</td></tr>
</tbody></table></div>
<ul>
  <li>Child with fever, bone pain, large liver or spleen and cytopenias: examine the <b>marrow</b>. Do not give steroids before leukaemia is excluded.</li>
</ul>
<h4 class="deck-topic">Lymphoma</h4>
<ul>
  <li>Painless firm lymph nodes. <b>B symptoms</b>: fever, night sweats, weight loss over 10% in 6 months.</li>
  <li>Preferred diagnosis: <b>excisional node biopsy</b>; fine needle aspiration is usually not enough.</li>
  <li><b>Hodgkin</b>: <b>Reed-Sternberg cells</b>, often young adult, contiguous spread, mediastinal mass; high cure rate.</li>
  <li><b>Non-Hodgkin</b>: diffuse large B-cell is aggressive but curable; follicular is usually slow. Burkitt grows very fast, with high lysis risk.</li>
</ul>
<h4 class="deck-topic">Multiple myeloma</h4>
<ul>
  <li><b>CRAB</b>: hypercalcaemia, renal injury, anaemia, bone lesions. Back pain in an older adult, recurrent infection, rouleaux, high ESR, wide protein gap.</li>
  <li>Tests: serum protein electrophoresis with immunofixation, free light chains, urine protein studies, marrow plasma cells.</li>
  <li>Lytic lesions: use low-dose whole-body CT, PET-CT or MRI; isotope bone scan can miss them.</li>
  <li><b>MGUS</b>: small paraprotein without organ damage; follow up.</li>
</ul>
<h4 class="deck-topic">Myeloproliferative neoplasms</h4>
<ul>
  <li><b>Polycythaemia vera</b>: JAK2 mutation, low erythropoietin, itch after bathing, thrombosis. Venesection to haematocrit below 45% and aspirin; cytoreduction if high risk.</li>
  <li><b>Essential thrombocythaemia</b>: persistent high platelets after excluding iron deficiency and inflammation.</li>
  <li><b>Myelofibrosis</b>: teardrop cells, huge spleen, dry marrow tap.</li>
</ul>
<div class="sum-key">
  <span class="sum-key-title">نقاط امتحانية</span>
  <ul>
    <li>Reed-Sternberg cells: Hodgkin lymphoma.</li>
    <li>Auer rods: myeloid leukaemia.</li>
    <li>BCR-ABL: CML, treated with a tyrosine kinase inhibitor.</li>
    <li>Anaemia, bone pain and kidney injury in an older adult: test for myeloma.</li>
  </ul>
</div>
`,
            questions: [
                {
                    "q": "12 years old presented with fever and night sweat and painless cervical lymph nodes enlargement FNA: show Reed–Sternberg cells What the diagnosis?",
                    "options": [
                        "AML",
                        "Hodgkin lymphoma"
                    ],
                    "answer": 1,
                    "explanation": "Reed-Sternberg ('owl's eye') cells = HODGKIN lymphoma. Painless lymphadenopathy + B symptoms (fever, night sweats, weight loss). Auer rods = AML.",
                    "source": "SMLE recall"
                },
                {
                    "q": "4 years old started experiencing bone pain and fever for 3 weeks. Examination: abdominal hepatosplenomegaly only. Labs: platelet 70, WBC 30, Hgb low (between 8-11 (?)). What is the indicated diagnostic test?",
                    "options": [
                        "Epstein-Barr PCR",
                        "Bone marrow biopsy"
                    ],
                    "answer": 1,
                    "explanation": "Childhood ALL: bone pain + fever + hepatosplenomegaly + marrow failure (low Hb, low platelets, high WBC with blasts). BONE MARROW confirms it. Bone pain is the tell-tale sign.",
                    "source": "SMLE recall"
                }
            ],
        },
        {
            id: "hem-onc-emergencies",
            title: "09 — Febrile Neutropenia & Oncology Emergencies",
            title_en: "First-hour antibiotics · Tumour lysis · Calcium · Cord",
            summaryHtml: `
<h4 class="deck-topic">Febrile neutropenia</h4>
<ul>
  <li>Neutrophils <b>below 500/mm³</b> (or expected to fall there), with temperature 38.3°C once or 38.0°C sustained over an hour. Signs of infection may be few.</li>
  <li>Take <b>cultures</b> (peripheral and each catheter lumen), then give an <b>IV antipseudomonal beta-lactam within 1 hour</b>: cefepime, piperacillin-tazobactam or a carbapenem. Local resistance guides the choice.</li>
  <li>Unstable or resistant organism risk: a carbapenem and added cover may be needed.</li>
  <li>Add <b>vancomycin</b> for specific reasons: haemodynamic instability, suspected catheter or skin infection, pneumonia, MRSA colonisation, or a gram-positive blood culture. Fever alone in a stable patient is not enough.</li>
  <li>Fever continuing about <b>4–7 days</b> despite antibiotics with ongoing neutropenia: reassess, image (chest CT) and add <b>antifungal</b> therapy as risk indicates.</li>
  <li>Avoid rectal examination and rectal temperature.</li>
</ul>
<h4 class="deck-topic">Tumour lysis syndrome</h4>
<ul>
  <li>High <b>potassium, phosphate, uric acid</b>; low <b>calcium</b>; acute kidney injury, arrhythmia or seizure.</li>
  <li>Highest risk: bulky, fast-growing tumours (Burkitt, acute leukaemia with high count), especially after starting treatment.</li>
  <li>Prevent with <b>IV hydration</b> and monitoring. <b>Allopurinol</b> stops new uric acid formation (lower or intermediate risk).</li>
  <li><b>Rasburicase</b> breaks down existing uric acid: high risk or established hyperuricaemia. <b>Contraindicated in G6PD deficiency.</b></li>
  <li>Treat potassium urgently. Give calcium only for symptoms or cardiac effects. Dialysis if refractory.</li>
</ul>
<div class="deck-cards">
  <div class="deck-card clin"><div class="deck-card-h">Hypercalcaemia of malignancy</div><ul><li>Confusion, constipation, polyuria</li><li>Saline, calcitonin for quick short effect, IV bisphosphonate; denosumab if needed</li></ul></div>
  <div class="deck-card diag"><div class="deck-card-h">Spinal cord compression</div><ul><li>New back pain, weakness, sensory level, bladder change</li><li><b>Dexamethasone</b> (if no reason to delay for tissue diagnosis), urgent whole-spine MRI, surgery or radiotherapy</li></ul></div>
  <div class="deck-card mgmt"><div class="deck-card-h">Superior vena cava syndrome</div><ul><li>Face and arm swelling, distended veins</li><li>Secure airway; get tissue diagnosis if stable; stent if severe</li></ul></div>
</div>
<ul>
  <li><b>Hyperleukocytosis with leukostasis</b> (breathless, confused): urgent cytoreduction and hydration; avoid unnecessary red cell transfusion.</li>
</ul>
<div class="sum-key">
  <span class="sum-key-title">نقاط امتحانية</span>
  <ul>
    <li>Neutropenic fever: cultures and broad antibiotic without delay.</li>
    <li>Still febrile after several days of broad antibiotics: think fungus.</li>
    <li>Tumour lysis: K, phosphate and urate up, calcium down.</li>
    <li>Prevention is allopurinol or rasburicase with hydration, according to risk.</li>
  </ul>
</div>
`,
            questions: [
                {
                    "q": "An 18-year-old boy receiving chemotherapy for acute lymphoblastic leukaemia develops fever on day 17 of chemotherapy. He has no focus of infection. Heart rate 110/min, Temperature 38.9°C. Platelets 25 (low), WBC 0.6 (very LOW — neutropenia), Neutrophils 60%, Lymphocytes 20%. Which of the following is the most appropriate management?",
                    "options": [
                        "Send blood, urine, sputum cultures",
                        "Send blood, urine, sputum cultures and start paracetamol",
                        "Send blood, urine, sputum cultures and start oral broad spectrum antibiotics",
                        "Send blood, urine, sputum cultures and start intravenous broad spectrum antibiotics"
                    ],
                    "answer": 3,
                    "explanation": "FEBRILE NEUTROPENIA (neutropenic sepsis) = fever (≥38.3°C, or ≥38°C sustained) + ANC <0.5 (or <1.0 and falling), usually post-chemotherapy = EMERGENCY. Take blood/urine/sputum cultures THEN start empirical IV BROAD-SPECTRUM antibiotics IMMEDIATELY (within 1 hour) — antipseudomonal beta-lactam (piperacillin-tazobactam, cefepime, meropenem). Don't wait for cultures. Add vancomycin if line infection/MRSA risk; antifungals if persistent fever.",
                    "source": "SMLE recall"
                },
                {
                    "q": "Breast cancer patient developed febrile neutropenia, given IV piperacillin-tazobactam AND VANCOMYCIN, still no improvement for 5 days. ANC 400, what is the best next step?",
                    "options": [
                        "IV antifungal",
                        "IVIG",
                        "Continue same plan and monitor",
                        "IV fluoroquinolone"
                    ],
                    "answer": 0,
                    "explanation": "Persistent neutropenic fever after 4-7 days of broad-spectrum antibacterials: add antifungal cover.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A 50-year-old man 24 hours after starting chemotherapy for B-cell lymphoma develops nausea and vomiting. Labs show normal sodium, potassium 6 (high), low calcium, high phosphate, and urea/uric acid 570 (very high), consistent with tumor lysis syndrome. What can prevent this presentation?",
                    "options": [
                        "Thiazide",
                        "Allopurinol",
                        "Furosemide"
                    ],
                    "answer": 1,
                    "explanation": "Allopurinol reduces uric acid production by inhibiting xanthine oxidase and is used prophylactically before and during chemotherapy in patients at high risk of tumor lysis syndrome, such as those with bulky hematologic malignancies, to prevent the metabolic derangements seen here.",
                    "source": "SMLE recall"
                },
                {
                    "q": "Pt with lymphoma present with decreased urine output after chemotherapy What to give?",
                    "options": [
                        "Thiazide",
                        "Rasburicase",
                        "Beta blocker"
                    ],
                    "answer": 1,
                    "explanation": "Core Concept: Tumor Lysis Syndrome (TLS) is an oncologic emergency caused by the massive, rapid destruction of malignant cells following chemotherapy (especially in bulky, highly proliferative tumors like lymphomas and leukemias), releasing intracellular contents into the bloodstream. Clinical Presentation: · Acute kidney injury (decreased urine output), cardiac arrhythmias, seizures, and muscle cramps. · Labs: Hyperuricemia, hyperkalemia, hyperphosphatemia, and secondary hypocalcemia. Diagnosis: · First-line: Comprehensive metabolic panel showing the classic electrolyte derangements. · Gold Standard: Cairo-Bishop criteria for laboratory and clinical TLS. Management: · Acute: Aggressive IV hydration. For high-risk patients or those with established hyperuricemia and AKI, Rasburicase (a recombinant urate oxidase) is administered to rapidly convert uric acid into highly soluble allantoin, preventing uric acid crystal nephropathy. · Long-term: Allopurinol is used for prophylaxis in lower-risk patients prior to starting chemotherapy.",
                    "source": "SMLE bank"
                }
            ],
        },
    ],
};

export default specialtyHematology;
