// Medical Dentistry — dental-track section of the summaries catalog.
// Mirrored for the slide viewer in backend/content/summaryHtml (keep the two in sync).
// Inline questions are copied from the SQB bank.
const dentalMedicalDentistry = {
    id: "medical-dentistry",
    title: "Medical Dentistry",
    title_en: "SDLE Review — 9 Topics",
    icon: "shield-check",
    accent: "#22d3ee",
    intro: "Medicine for dentistry, SDLE revision: Medical Emergencies · Ischaemic Heart Disease, Blood Pressure and Stroke · Infective Endocarditis Prophylaxis · Diabetes, Thyroid and Adrenal · Respiratory Disease and Chair Position · Bleeding and Blood Disorders · Liver, Kidney, Gut and Bloodborne Infection · Prescribing Safety · Pregnancy and Immunocompromise.",
    subtopics: [
        {
            id: "md-emergency",
            title: "01 — Medical Emergencies in the Dental Chair",
            title_en: "ABC approach · first drug · position",
            summaryHtml: `
<div class="sum-algo"><span class="sum-algo-title">Every collapse</span><ol>
<li>Stop treatment, clear the mouth, call for help</li>
<li>Assess <b>airway, breathing, circulation</b>, consciousness; check glucose</li>
<li>Position, oxygen when indicated, monitor</li>
<li>Give the specific drug; activate emergency services early</li>
<li>No normal breathing: start CPR (30:2, 100 to 120 per minute) and attach a defibrillator</li>
</ol></div>
<div class="deck-block deck-tbl"><table>
<thead><tr><th>Event</th><th>Clues</th><th>Key action</th></tr></thead>
<tbody>
<tr><td><b>Vasovagal syncope</b> (commonest)</td><td>Anxiety, pallor, sweating, slow pulse</td><td>Supine, legs raised</td></tr>
<tr><td><b>Hypoglycaemia</b></td><td>Sweating, tremor, confusion, aggression</td><td>Conscious: oral fast sugar. Unable to swallow: IM glucagon or IV glucose; nothing by mouth</td></tr>
<tr><td><b>Anaphylaxis</b></td><td>Urticaria or swelling, hoarseness, wheeze, low pressure</td><td><b>IM adrenaline</b> 1:1000 in the outer thigh (adult 0.5 mg), repeat after about 5 minutes if needed</td></tr>
<tr><td><b>Asthma attack</b></td><td>Wheeze, dyspnoea</td><td>Upright, <b>short-acting beta-2 agonist</b>, oxygen; call EMS if it fails, repeat doses</td></tr>
<tr><td><b>Seizure</b></td><td>Tonic-clonic movements</td><td>Chair flat and low, protect, do not restrain or put anything in the mouth. Over 5 minutes: EMS and benzodiazepine</td></tr>
<tr><td><b>Adrenal crisis</b></td><td>Weakness, hypotension, confusion in a steroid-dependent patient</td><td><b>Hydrocortisone</b> (adult 100 mg IM or IV), fluids, EMS</td></tr>
<tr><td><b>Chest pain</b></td><td>Pressure, radiation, sweating</td><td>See the cardiac topic</td></tr>
</tbody></table></div>
<ul>
<li><b>Unknown cause of unconsciousness</b>: do not guess a drug; assess ABC and glucose</li>
<li>Suspected neck injury: open the airway with <b>jaw thrust</b></li>
<li>Latex reaction of immediate type is <b>IgE mediated (type I)</b>; contact dermatitis to rubber chemicals is type IV. Stop exposure and assess</li>
<li>Hyperventilation: reassure and coach slow breathing</li>
<li>Sympathetic activation dilates the pupils; opioids typically make them pinpoint</li>
</ul>
<div class="sum-key"><span class="sum-key-title">نقاط امتحانية</span><ul>
<li>Anaphylaxis: intramuscular adrenaline first.</li>
<li>Confused diabetic after insulin: treat as hypoglycaemia.</li>
<li>Syncope is the most frequent dental emergency.</li>
<li>A seizure beyond five minutes is an emergency needing a benzodiazepine.</li>
</ul></div>
`,
            questions: [
                {
                    "q": "Which medical emergency is reported most often in dental practice?",
                    "options": [
                        "Hypoglycemia",
                        "Vasovagal syncope",
                        "Seizure",
                        "Angina"
                    ],
                    "answer": 1,
                    "explanation": "Vasovagal syncope is the most frequently encountered medical emergency in dental practice. Anxiety, pain, and upright positioning are common triggers in the dental setting. Reference: Malamed SF. Medical Emergencies in the Dental Office. 8th ed. Syncope; American Academy of Pediatric Dentistry. Management of Medical Emergencies. Reference Manual 2025-2026.",
                    "source": "SDLE bank"
                },
                {
                    "q": "After antibiotic prophylaxis, a patient develops hoarseness and facial swelling. What is the first-line drug?",
                    "options": [
                        "Intramuscular epinephrine",
                        "Oral antihistamine alone",
                        "Topical corticosteroid",
                        "Metronidazole"
                    ],
                    "answer": 0,
                    "explanation": "Hoarseness and swelling indicate possible upper-airway anaphylaxis. Intramuscular epinephrine in the anterolateral thigh is first-line, with emergency activation, airway and oxygen support, monitoring, and repeat dosing as needed. Reference: Resuscitation Council UK. Emergency Treatment of Anaphylaxis. 2021; World Allergy Organization. Anaphylaxis Guidance. 2020.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A patient has a severe asthma attack and the rescue inhaler is ineffective. What is the immediate management?",
                    "options": [
                        "Give a long-acting beta agonist only",
                        "Wait without monitoring",
                        "Place the patient supine",
                        "Activate emergency services, repeat SABA, and give oxygen"
                    ],
                    "answer": 3,
                    "explanation": "An attack that does not respond promptly to a short-acting bronchodilator may be life-threatening. Sit the patient upright, repeat salbutamol according to protocol, give oxygen, monitor, and activate emergency services; intramuscular epinephrine is used when anaphylaxis is suspected. Reference: Global Initiative for Asthma. GINA Strategy Report 2026; Resuscitation Council UK dental emergencies guidance.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A generalized seizure lasts longer than five minutes. What is the next step?",
                    "options": [
                        "Wait indefinitely",
                        "Activate emergency services and administer a rescue benzodiazepine per protocol",
                        "Continue dental treatment",
                        "Give nitroglycerin"
                    ],
                    "answer": 1,
                    "explanation": "Prolonged or repeated seizures without recovery constitute status epilepticus and require emergency airway support and anticonvulsant treatment. Reference: Malamed SF. Medical Emergencies in the Dental Office. 8th ed. Status epilepticus.",
                    "source": "SDLE bank"
                },
                {
                    "q": "During treatment, a steroid-dependent patient develops severe weakness, vomiting, hypotension, and confusion. What is the suspected emergency?",
                    "options": [
                        "Adrenal crisis",
                        "Thyroid storm",
                        "Hyperventilation",
                        "Local infection"
                    ],
                    "answer": 0,
                    "explanation": "Stop treatment, activate emergency services, support airway and circulation, give oxygen, and administer emergency corticosteroid according to training and protocol. Reference: Malamed SF. Medical Emergencies in the Dental Office. 8th ed. Acute adrenal insufficiency.",
                    "source": "SDLE bank"
                }
            ],
        },
        {
            id: "md-cardiac",
            title: "02 — Heart Disease, Blood Pressure and Stroke",
            title_en: "MI · angina · failure · hypertension",
            summaryHtml: `
<h4 class="deck-topic">Before treating a cardiac patient</h4>
<ul>
<li>Most useful: <b>current symptoms, functional capacity, medications and complications</b>, not only the date of the event</li>
<li><b>Recent myocardial infarction</b> (for example weeks ago): defer elective care. For severe pain give <b>urgent, conservative care</b> with medical coordination, monitoring and stress reduction</li>
<li>The old rule was to wait 6 months; current advice is more individual, and a stable patient may be treated earlier after medical review</li>
<li>Unstable angina or uncontrolled arrhythmia: no elective care</li>
</ul>
<div class="sum-algo"><span class="sum-algo-title">Chest pain during treatment</span><ol>
<li>Stop and seat comfortably; check vital signs</li>
<li><b>Nitroglycerin</b> sublingually if not hypotensive and no recent PDE-5 inhibitor (such as sildenafil)</li>
<li>No history of angina, or pain not relieved after about 5 minutes: <b>activate emergency services</b>; follow the current protocol for repeat doses</li>
<li>Chewed aspirin if infarction is suspected and not contraindicated; oxygen if hypoxaemic</li>
</ol></div>
<p>Common nitroglycerin effects: <b>headache and low blood pressure</b>.</p>
<h4 class="deck-topic">Heart failure</h4>
<ul>
<li>Dyspnoea, <b>orthopnoea</b>, paroxysmal night dyspnoea, ankle oedema, fatigue</li>
<li>Treat <b>semi-supine or upright</b>. Signs of decompensation: medical evaluation before elective care</li>
</ul>
<h4 class="deck-topic">Blood pressure (2025 ACC/AHA adult categories)</h4>
<div class="deck-block deck-tbl"><table>
<thead><tr><th>Category</th><th>Systolic / diastolic</th></tr></thead>
<tbody>
<tr><td>Normal</td><td>Under 120 and under 80</td></tr>
<tr><td>Elevated</td><td>120 to 129 and under 80</td></tr>
<tr><td>Stage 1</td><td>130 to 139 or 80 to 89</td></tr>
<tr><td>Stage 2</td><td>140 or more, or 90 or more</td></tr>
</tbody></table></div>
<ul>
<li>Many dental protocols defer elective care around 180/110 or above; very high pressure with symptoms is an emergency</li>
<li>Dizziness on standing with antihypertensives: check <b>seated and standing</b> pressure, pulse and drugs</li>
<li>Cardiac patients: aspirate, use good anaesthesia and limit adrenaline; <b>0.04 mg</b> is a common cautious limit</li>
<li>Avoid adrenaline-impregnated retraction cord in cardiovascular disease</li>
<li><b>Recent stroke</b> (such as one month): defer elective surgery until neurologically and medically stable; many references advise about 6 months</li>
</ul>
<div class="sum-key"><span class="sum-key-title">نقاط امتحانية</span><ul>
<li>Three weeks after infarction: no elective crown.</li>
<li>135/80 is stage 1 in the American system.</li>
<li>Do not lay a patient with orthopnoea flat.</li>
<li>Ask about PDE-5 inhibitors before giving nitrates.</li>
</ul></div>
`,
            questions: [
                {
                    "q": "Before elective treatment of a patient with a remote myocardial infarction, which information is most important?",
                    "options": [
                        "Current symptoms, functional status, medications, and medical stability",
                        "Tooth shade only",
                        "Date of the last prophylaxis only",
                        "Handedness only"
                    ],
                    "answer": 0,
                    "explanation": "Time since infarction is only one factor. Current angina, heart failure, rhythm, exercise tolerance, blood pressure, antithrombotic therapy, and physician recommendations determine risk. Reference: Little JW, Miller CS, Rhodus NL. Dental Management of the Medically Compromised Patient. 9th ed. Cardiovascular risk assessment.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A patient had an uncomplicated myocardial infarction three weeks ago and requests elective crown preparation. What is the best action?",
                    "options": [
                        "Proceed with a long elective visit",
                        "Defer elective care and obtain medical coordination",
                        "Stop all cardiac medication",
                        "Use general anesthesia routinely"
                    ],
                    "answer": 1,
                    "explanation": "The early post-infarction period carries elevated cardiovascular risk. Elective treatment should be postponed while urgent care, if necessary, is delivered conservatively in coordination with the medical team. Reference: Little JW, Miller CS, Rhodus NL. Dental Management of the Medically Compromised Patient. 9th ed. Ischemic heart disease and myocardial infarction.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A patient had an uncomplicated myocardial infarction three weeks ago and has severe dental pain. What is the appropriate approach?",
                    "options": [
                        "Provide urgent conservative care with medical coordination; defer elective care",
                        "Perform prolonged elective surgery",
                        "Stop antiplatelet medication",
                        "Ignore the pain"
                    ],
                    "answer": 0,
                    "explanation": "Recent MI increases cardiovascular risk. Urgent infection and pain are managed with stress reduction, monitoring, and physician coordination in an appropriate setting. Reference: Little JW, Miller CS, Rhodus NL. Dental Management of the Medically Compromised Patient. 9th ed. Recent myocardial infarction.",
                    "source": "SDLE bank"
                },
                {
                    "q": "According to the 2025 ACC/AHA adult blood-pressure categories, how is 135/80 mm Hg classified?",
                    "options": [
                        "Normal blood pressure",
                        "Elevated blood pressure only",
                        "Stage 1 hypertension",
                        "Stage 2 hypertension"
                    ],
                    "answer": 2,
                    "explanation": "Stage 1 hypertension is systolic 130-139 mm Hg or diastolic 80-89 mm Hg. A diagnosis should be based on properly measured repeated readings, not a single value. Reference: American Heart Association. 2025 High Blood Pressure Guideline and Blood Pressure Categories. Reviewed August 2025.",
                    "source": "SDLE bank"
                },
                {
                    "q": "What common adverse effect can sublingual nitroglycerin cause?",
                    "options": [
                        "Hyperglycemia",
                        "Gingival hyperplasia",
                        "Headache and hypotension",
                        "Bronchospasm in every patient"
                    ],
                    "answer": 2,
                    "explanation": "Vasodilation commonly causes headache, flushing, dizziness, and reduced blood pressure. Concomitant phosphodiesterase-5 inhibitors can cause dangerous hypotension. Reference: Brunton LL, Hilal-Dandan R, Knollmann BC, eds. Goodman & Gilman's. 14th ed. Organic nitrates.",
                    "source": "SDLE bank"
                }
            ],
        },
        {
            id: "md-endocarditis",
            title: "03 — Infective Endocarditis Prophylaxis",
            title_en: "Who · which procedures · regimen",
            summaryHtml: `
<h4 class="deck-topic">Who (AHA guidance)</h4>
<ul>
<li><b>Prosthetic heart valve</b> (including transcatheter) or prosthetic material used for valve repair</li>
<li><b>Previous infective endocarditis</b></li>
<li>Selected congenital heart disease: unrepaired cyanotic disease; complete repair with prosthetic material or device in the first 6 months; repaired disease with residual defects</li>
<li>Heart transplant recipient who develops valve disease</li>
</ul>
<h4 class="deck-topic">Not routinely needed</h4>
<ul>
<li>Native valve disease such as <b>aortic stenosis</b> or mitral prolapse, hypertension, coronary stents, bypass grafts, <b>pacemakers</b> and defibrillators</li>
<li>Guidance differs: UK advice does not give prophylaxis routinely. For exams, check which guideline the question follows</li>
</ul>
<h4 class="deck-topic">Which procedures (in the high-risk group)</h4>
<ul>
<li>Manipulation of <b>gingival tissue or the periapical region</b>, or perforation of the oral mucosa: extraction, scaling, periodontal surgery</li>
<li>Not needed for anaesthetic injection through non-infected tissue, radiographs, shedding primary teeth or adjusting appliances</li>
</ul>
<h4 class="deck-topic">Regimen: one dose 30 to 60 minutes before</h4>
<div class="deck-block deck-tbl"><table>
<thead><tr><th>Situation</th><th>Adult</th><th>Child</th></tr></thead>
<tbody>
<tr><td>Standard oral</td><td><b>Amoxicillin 2 g</b></td><td>50 mg/kg</td></tr>
<tr><td>Cannot take oral</td><td>Ampicillin 2 g IM or IV, or cefazolin or ceftriaxone 1 g</td><td>50 mg/kg</td></tr>
<tr><td>Penicillin allergy, oral</td><td>Cephalexin 2 g*, or azithromycin or clarithromycin 500 mg, or doxycycline 100 mg</td><td>Weight based</td></tr>
</tbody></table></div>
<p>*Avoid cephalosporins after penicillin anaphylaxis, angioedema or urticaria. Since 2021 the AHA <b>no longer recommends clindamycin</b>.</p>
<ul>
<li>If the dose was missed, it may be given up to about 2 hours after the procedure</li>
<li>Main target: <b>viridans group streptococci</b></li>
<li>Good oral health and regular care matter more than any single dose, because everyday bacteraemia is frequent</li>
<li>A patient already on a penicillin-type antibiotic: choose another class or, if possible, wait about 10 days after it ends</li>
<li>Prophylaxis does not replace treatment of an active infection</li>
</ul>
<div class="sum-key"><span class="sum-key-title">نقاط امتحانية</span><ul>
<li>Prosthetic valve plus extraction: give prophylaxis.</li>
<li>Adult standard: amoxicillin 2 g before.</li>
<li>Aortic stenosis alone does not qualify.</li>
<li>Pacemaker: no endocarditis prophylaxis.</li>
</ul></div>
`,
            questions: [
                {
                    "q": "Which cardiac condition carries the highest adverse outcome risk if infective endocarditis develops and therefore qualifies for dental prophylaxis under current guidance?",
                    "options": [
                        "Isolated controlled hypertension",
                        "Previous coronary bypass alone",
                        "Prosthetic cardiac valve",
                        "Innocent murmur"
                    ],
                    "answer": 2,
                    "explanation": "Prophylaxis is reserved for a small highest-risk group and relevant gingival or periapical procedures. It is not based on the frequency of transient bacteremia alone. Reference: American Heart Association. Prevention of Viridans Group Streptococcal Infective Endocarditis. Scientific statement and current wallet-card guidance.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A patient with a prosthetic cardiac valve and no penicillin allergy needs a dental extraction. What is the standard adult oral prophylactic regimen?",
                    "options": [
                        "Penicillin V 1 g",
                        "Amoxicillin 2 g",
                        "Clindamycin 600 mg",
                        "Metronidazole 500 mg"
                    ],
                    "answer": 1,
                    "explanation": "For a qualifying procedure in a high-risk patient who can take oral medication, amoxicillin 2 g is given 30- 60 minutes before treatment. Clindamycin is no longer recommended as an alternative because of more frequent and severe adverse reactions. Reference: American Dental Association. Antibiotic Prophylaxis Prior to Dental Procedures. Updated 2026; American Heart Association. Prevention of Viridans Group Streptococcal Infective Endocarditis. 2021.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A patient with a prosthetic cardiac valve is scheduled for dental extraction. Which preventive measure is indicated?",
                    "options": [
                        "Automatic anticoagulant cessation",
                        "Routine hospital admission",
                        "No cardiovascular assessment",
                        "Infective-endocarditis antibiotic prophylaxis"
                    ],
                    "answer": 3,
                    "explanation": "A prosthetic cardiac valve is a highest-risk cardiac condition for which antibiotic prophylaxis is reasonable before procedures that manipulate gingiva, the periapical region, or perforate oral mucosa. Anticoagulant management is assessed separately and medication is not stopped automatically. Reference: American Dental Association. Antibiotic Prophylaxis Prior to Dental Procedures. Updated 2026; American Heart Association. Prevention of Viridans Group Streptococcal Infective Endocarditis. 2021.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A patient with hypertension and native aortic stenosis needs a dental extraction. Is infective- endocarditis prophylaxis indicated solely for these conditions?",
                    "options": [
                        "Amoxicillin 2 g is mandatory",
                        "Amoxicillin 1 g is mandatory",
                        "No prophylaxis is indicated",
                        "Metronidazole is mandatory"
                    ],
                    "answer": 2,
                    "explanation": "Native aortic stenosis and hypertension alone are not among the highest-risk cardiac conditions for which dental IE prophylaxis is recommended. Cardiovascular stability and anesthetic planning still require assessment. Reference: American Dental Association. Antibiotic Prophylaxis Prior to Dental Procedures. Updated 2026; American Heart Association. 2021 IE prevention statement.",
                    "source": "SDLE bank"
                },
                {
                    "q": "Which organisms most commonly cause dental-associated infective endocarditis targeted by prophylaxis?",
                    "options": [
                        "Plasmodium species",
                        "Candida in every case",
                        "Mycobacterium tuberculosis",
                        "Viridans group streptococci"
                    ],
                    "answer": 3,
                    "explanation": "Dental prophylaxis recommendations target viridans streptococci in high-risk cardiac patients. Staphylococci are important overall causes of endocarditis but are not the dental prophylaxis target. Reference: American Heart Association. Prevention of Viridans Group Streptococcal Infective Endocarditis. Current scientific statement.",
                    "source": "SDLE bank"
                }
            ],
        },
        {
            id: "md-endocrine",
            title: "04 — Diabetes, Thyroid and Adrenal",
            title_en: "Glucose control · thyroid crises · steroids",
            summaryHtml: `
<h4 class="deck-topic">Diabetes</h4>
<ul>
<li><b>HbA1c</b> reflects average glucose over about <b>2 to 3 months</b>; a finger-prick reading shows the present</li>
<li>Controlled type 2: <b>morning visit, usual breakfast and usual medication</b>; keep fast sugar at hand and ask about recent hypoglycaemia</li>
<li>Insulin or <b>sulfonylurea</b> users are at most risk of hypoglycaemia. NSAIDs can add to sulfonylurea effect</li>
<li>Oral signs of poor control: periodontitis, candida, dry mouth, parotid enlargement, delayed healing</li>
<li>Poor control with spreading infection is urgent. Dusky, rapidly spreading, very painful skin suggests <b>necrotising infection</b>: hospital, surgery and IV antibiotics</li>
<li><b>Glucocorticoids raise blood glucose</b></li>
</ul>
<h4 class="deck-topic">Thyroid</h4>
<div class="deck-block deck-tbl"><table>
<thead><tr><th></th><th>Hyperthyroid</th><th>Hypothyroid</th></tr></thead>
<tbody>
<tr><td>Features</td><td>Heat intolerance, tremor, tachycardia, weight loss</td><td>Cold intolerance, slowness, weight gain, slow pulse</td></tr>
<tr><td>Crisis</td><td><b>Thyroid storm</b>: fever, fast pulse, agitation</td><td><b>Myxoedema coma</b>: <b>hypothermia</b>, slow breathing, low pressure, reduced consciousness</td></tr>
<tr><td>Dental caution</td><td>Uncontrolled: avoid <b>adrenaline</b></td><td>Caution with sedatives and opioids</td></tr>
</tbody></table></div>
<ul>
<li>Unexplained tachycardia with goitre: start with <b>serum TSH</b></li>
</ul>
<h4 class="deck-topic">Long-term corticosteroids</h4>
<ul>
<li>The adrenal axis may be suppressed</li>
<li>Routine treatment and minor surgery under local anaesthetic in a stable patient: <b>continue the usual dose</b>, reduce stress, control pain, monitor. Routine doubling is not needed</li>
<li>Major surgery, general anaesthesia, severe illness or primary adrenal insufficiency may need <b>supplemental cover</b> agreed with the physician</li>
<li>Never stop steroids suddenly</li>
<li>Excess steroid: moon face, central obesity, buffalo hump, growth delay in children, high glucose, infection risk</li>
</ul>
<div class="sum-key"><span class="sum-key-title">نقاط امتحانية</span><ul>
<li>HbA1c is the long-term test.</li>
<li>Normal meal and medicine before a routine visit.</li>
<li>Hypothermia points to myxoedema coma.</li>
<li>Minor dentistry on steroids: usual dose, watch for crisis.</li>
</ul></div>
`,
            questions: [
                {
                    "q": "Which test estimates average glycemia over approximately the preceding two to three months?",
                    "options": [
                        "HbA1c",
                        "Fasting plasma glucose",
                        "Random plasma glucose",
                        "Urine glucose"
                    ],
                    "answer": 0,
                    "explanation": "HbA1c reflects glycation over the lifespan of circulating erythrocytes and approximates mean glycemia over the previous two to three months, with greater weighting toward recent weeks. Anemia and altered red-cell turnover can affect interpretation. Reference: American Diabetes Association. Standards of Care in Diabetes—2026. Glycemic assessment.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A well-controlled patient with type 2 diabetes is scheduled for routine dental treatment. What preparation is appropriate?",
                    "options": [
                        "Skip breakfast and medication",
                        "Add insulin without advice",
                        "Morning visit after the usual breakfast and medication",
                        "Fast overnight"
                    ],
                    "answer": 2,
                    "explanation": "Normal meals and prescribed medication reduce hypoglycemia risk. Morning appointments are often convenient, and glucose is checked when symptoms or procedure risk indicate. Reference: American Diabetes Association. Standards of Care in Diabetes—2026; Little and Falace. 10th ed.",
                    "source": "SDLE bank"
                },
                {
                    "q": "Which dental drug can precipitate severe thyrotoxicosis in a patient with uncontrolled hyperthyroidism?",
                    "options": [
                        "Nystatin",
                        "Epinephrine",
                        "Amoxicillin",
                        "Topical fluoride"
                    ],
                    "answer": 1,
                    "explanation": "Excess adrenergic stimulation can provoke severe tachycardia, hypertension, arrhythmia, or thyrotoxic crisis in uncontrolled hyperthyroidism. Elective care is deferred until control is established. Reference: American Thyroid Association hyperthyroidism guidance; Little and Falace. 10th ed.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A patient with severe hypothyroidism becomes hypothermic, bradycardic, hypoventilated, and obtunded. What is the suspected emergency?",
                    "options": [
                        "Thyroid storm",
                        "Hyperglycemia only",
                        "Anaphylaxis",
                        "Myxedema coma"
                    ],
                    "answer": 3,
                    "explanation": "Activate emergency services, support ventilation and circulation, keep the patient warm, and avoid respiratory depressants. Definitive thyroid and supportive treatment is hospital-based. Reference: Malamed SF. Medical Emergencies in the Dental Office. 8th ed. Hypothyroid emergency.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A stable patient uses low-dose prednisone chronically and needs one uncomplicated extraction under local anesthesia. What is generally appropriate?",
                    "options": [
                        "Stop prednisone abruptly",
                        "Give a universal large steroid dose",
                        "Cancel all dental care",
                        "Continue the usual steroid dose with stress reduction"
                    ],
                    "answer": 3,
                    "explanation": "Many minor procedures do not require supplemental dosing when the patient is stable and takes the usual medication. Major surgery, high doses, or adrenal symptoms require medical coordination. Reference: Little JW, Miller CS, Rhodus NL. Dental Management of the Medically Compromised Patient. 9th ed. Perioperative glucocorticoids.",
                    "source": "SDLE bank"
                }
            ],
        },
        {
            id: "md-respiratory",
            title: "05 — Respiratory Disease and Chair Position",
            title_en: "Asthma · COPD · positioning",
            summaryHtml: `
<h4 class="deck-topic">Asthma</h4>
<ul>
<li>Ask about triggers, night symptoms, admissions, oral steroid use. Have the patient bring the reliever inhaler</li>
<li>After treatment is established, <b>severity</b> is judged by the <b>level of treatment needed to keep control</b>; current symptoms show control</li>
<li>Analgesic: <b>paracetamol</b>. Aspirin and NSAIDs can trigger attacks in sensitive patients</li>
<li>Some patients react to the <b>sulfite</b> preservative in vasoconstrictor anaesthetics</li>
<li>Anxiety with well-controlled asthma: <b>nitrous oxide-oxygen</b> may be used after assessment</li>
<li>Inhaled steroids: candidiasis and hoarseness, so rinse after use. Dry mouth, caries and mouth breathing may occur</li>
<li><b>Theophylline</b> levels rise with erythromycin and some other antibiotics such as ciprofloxacin</li>
</ul>
<h4 class="deck-topic">COPD</h4>
<ul>
<li>Position <b>semi-supine or upright</b></li>
<li>Avoid respiratory depressants. If sedation is essential, use a low dose with medical advice and monitoring; avoid nitrous oxide in significant or severe disease</li>
<li>Monitor with <b>pulse oximetry</b>; give oxygen carefully, with a target agreed for patients who retain carbon dioxide, but never withhold it in an emergency</li>
<li>New productive cough, fever or breathlessness: <b>defer elective care</b> and arrange medical review</li>
<li>A rubber dam may be poorly tolerated in severe disease</li>
</ul>
<h4 class="deck-topic">Tuberculosis</h4>
<ul>
<li>Lung disease with caseating granulomas. Active disease: postpone elective care; urgent care only with airborne precautions</li>
</ul>
<h4 class="deck-topic">Chair position summary</h4>
<div class="deck-block deck-tbl"><table>
<thead><tr><th>Patient</th><th>Position</th></tr></thead>
<tbody>
<tr><td>Acute asthma, conscious</td><td><b>Upright</b>, comfortable</td></tr>
<tr><td>COPD, heart failure</td><td>Semi-supine or upright</td></tr>
<tr><td>Syncope or low blood pressure</td><td>Supine, legs raised</td></tr>
<tr><td>Late pregnancy, light-headed</td><td><b>Left lateral tilt</b></td></tr>
<tr><td>Rheumatoid arthritis</td><td>Supported in comfort, short breaks, neck care</td></tr>
</tbody></table></div>
<div class="sum-key"><span class="sum-key-title">نقاط امتحانية</span><ul>
<li>Safest usual analgesic in asthma: paracetamol.</li>
<li>Acute asthma: sit up.</li>
<li>An ill COPD patient waits for elective work.</li>
<li>Erythromycin and theophylline is a classic interaction.</li>
</ul></div>
`,
            questions: [
                {
                    "q": "How is asthma severity determined after treatment has been established?",
                    "options": [
                        "By treatment needed for control",
                        "By chest radiography alone",
                        "By one oxygen-saturation reading",
                        "By age alone"
                    ],
                    "answer": 0,
                    "explanation": "GINA defines asthma severity retrospectively, after two to three months of treatment, by the intensity of therapy required to control symptoms and exacerbations. Symptom control, future risk, lung function, adherence, technique, and comorbidity are assessed separately. Reference: Global Initiative for Asthma. Global Strategy for Asthma Management and Prevention. 2025 update.",
                    "source": "SDLE bank"
                },
                {
                    "q": "Which chair position is appropriate for a conscious patient having an acute asthma attack in the dental clinic?",
                    "options": [
                        "Upright in a position of comfort",
                        "Flat supine",
                        "Trendelenburg",
                        "Prone"
                    ],
                    "answer": 0,
                    "explanation": "The procedure is stopped and the conscious patient is kept upright or in the position that best supports breathing. A rapid-acting inhaled bronchodilator is given, oxygen and vital signs are monitored, and emergency services are activated for severe or nonresponsive symptoms. Reference: Global Initiative for Asthma. Global Strategy for Asthma Management and Prevention. 2025; American Dental Association. Medical-emergency guidance.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A severely anxious patient has well-controlled asthma and cannot take diazepam because of allergy. Which sedation option may be used after routine assessment?",
                    "options": [
                        "Nitrous oxide-oxygen",
                        "Unmonitored deep sedation",
                        "General anesthesia in the clinic",
                        "No anxiety management"
                    ],
                    "answer": 0,
                    "explanation": "Nitrous oxide-oxygen minimal sedation can be used in a cooperative patient with well-controlled asthma when nasal breathing is adequate and no contraindication is present. Active wheezing or poorly controlled disease requires postponement and medical optimization. Reference: American Academy of Pediatric Dentistry. Use of Nitrous Oxide for Pediatric Dental Patients. Latest revision 2023; Little and Falace's Dental Management of the Medically Compromised Patient. 10th ed.",
                    "source": "SDLE bank"
                },
                {
                    "q": "Which antibiotic should be used cautiously with theophylline because it can increase toxicity?",
                    "options": [
                        "Penicillin V",
                        "Amoxicillin",
                        "Erythromycin",
                        "Cephalexin"
                    ],
                    "answer": 2,
                    "explanation": "Theophylline has a narrow therapeutic index. Macrolide and fluoroquinolone interactions vary by agent, so medication-specific checking is required. Reference: Brunton LL, Hilal-Dandan R, Knollmann BC, eds. Goodman & Gilman's. 14th ed. Theophylline interactions.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A patient with COPD has a new productive cough and a resting oxygen saturation of 90% before routine dental treatment. What should be done?",
                    "options": [
                        "Proceed with a long supine appointment",
                        "Give a sedative and continue",
                        "Defer elective care and arrange prompt medical assessment",
                        "Ignore the oxygen saturation"
                    ],
                    "answer": 2,
                    "explanation": "A new productive cough and low resting oxygen saturation may indicate an exacerbation or infection. Elective care should be deferred while the patient receives prompt medical assessment; urgent dental needs require a coordinated setting. Reference: Global Initiative for Chronic Obstructive Lung Disease. GOLD Report 2026; Little and Falace. 10th ed.",
                    "source": "SDLE bank"
                }
            ],
        },
        {
            id: "md-blood",
            title: "06 — Bleeding and Blood Disorders",
            title_en: "Tests · haemophilia · platelets · anaemia",
            summaryHtml: `
<div class="deck-block deck-tbl"><table>
<thead><tr><th>Test</th><th>Checks</th><th>Abnormal in</th></tr></thead>
<tbody>
<tr><td><b>PT / INR</b></td><td>Extrinsic and common pathway</td><td>Warfarin, liver disease, vitamin K lack</td></tr>
<tr><td><b>aPTT</b></td><td>Intrinsic and common pathway</td><td>Haemophilia A and B, heparin</td></tr>
<tr><td><b>Platelet count</b></td><td>Number</td><td>Thrombocytopenia</td></tr>
<tr><td>Platelet function and von Willebrand tests</td><td>Quality and adhesion</td><td>vWD, platelet disorders</td></tr>
</tbody></table></div>
<ul>
<li>Normal PT, aPTT and count do <b>not</b> exclude von Willebrand disease or a platelet function defect</li>
<li><b>Small spots, purpura, gum and nose bleeding</b> suggest a platelet problem; deep muscle and joint bleeds suggest factor deficiency</li>
<li><b>Haemophilia</b>: A = factor VIII, B = factor IX. Below 1% activity is <b>severe</b></li>
<li>Haemophilia care: haematology plan, avoid blocks and IM injections without cover (infiltration or intraligamentary are safer), local haemostasis, <b>tranexamic acid</b> (including as a mouthwash), no NSAIDs or aspirin</li>
<li>No single platelet number is safe for everything; the procedure, platelet function and other factors matter</li>
</ul>
<h4 class="deck-topic">Warning picture</h4>
<ul>
<li>Spontaneous gingival bleeding, purpura, fatigue and fever: <b>urgent blood count</b> and medical referral (possible leukaemia or marrow failure)</li>
<li>Chemotherapy with severe neutropenia: defer non-urgent surgery and plan with oncology and haematology</li>
</ul>
<h4 class="deck-topic">Anaemia</h4>
<ul>
<li><b>Low MCV (below about 80)</b>: iron deficiency is commonest; also thalassaemia</li>
<li><b>High MCV</b>: B12 or folate deficiency. <b>Pernicious anaemia</b> is B12 deficiency from lack of intrinsic factor</li>
<li><b>Normocytic</b>: use the reticulocyte count with clinical findings to separate loss or haemolysis from poor production</li>
<li><b>Sickle cell disease</b>: keep hydrated and oxygenated; avoid stress, pain, cold and infection</li>
</ul>
<div class="sum-key"><span class="sum-key-title">نقاط امتحانية</span><ul>
<li>Haemophilia A: long aPTT.</li>
<li>Under 1% factor VIII is severe haemophilia A.</li>
<li>Normal screening tests can hide von Willebrand disease.</li>
<li>Unexplained bleeding with fever needs a same-day blood count.</li>
</ul></div>
`,
            questions: [
                {
                    "q": "Which routine coagulation test is typically prolonged in hemophilia A?",
                    "options": [
                        "Prothrombin time",
                        "Activated partial thromboplastin time",
                        "Thrombin time",
                        "Platelet count"
                    ],
                    "answer": 1,
                    "explanation": "Factor VIII deficiency affects the intrinsic pathway, so aPTT is typically prolonged while PT and platelet count are normal. Mild disease may require factor assays because screening aPTT can occasionally be normal. Reference: World Federation of Hemophilia. Guidelines for the Management of Hemophilia. 3rd ed. Laboratory diagnosis.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A patient has factor VIII activity below 1%. What is the diagnosis?",
                    "options": [
                        "Hemophilia B",
                        "Severe hemophilia A",
                        "von Willebrand disease",
                        "Factor XI deficiency"
                    ],
                    "answer": 1,
                    "explanation": "Hemophilia A is factor VIII deficiency; activity below 1% is classified as severe. Reference: World Federation of Hemophilia. Guidelines for the Management of Hemophilia. 3rd ed.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A patient reports lifelong prolonged bleeding. PT and aPTT are normal, but platelet-function testing is abnormal. What disorder is most likely?",
                    "options": [
                        "von Willebrand disease or platelet dysfunction",
                        "Severe hemophilia A",
                        "Vitamin K deficiency only",
                        "Liver failure only"
                    ],
                    "answer": 0,
                    "explanation": "Mucocutaneous bleeding with normal routine screening can reflect von Willebrand disease or a platelet- function defect. Specific vWF and platelet studies are required. Reference: Little JW, Miller CS, Rhodus NL. Dental Management of the Medically Compromised Patient. 9th ed. Bleeding disorders.",
                    "source": "SDLE bank"
                },
                {
                    "q": "What platelet count is universally safe for every dental procedure?",
                    "options": [
                        "Exactly 20,000/µL",
                        "Exactly 50,000/µL for all care",
                        "Exactly 100,000/µL for all care",
                        "No single threshold; procedure and patient factors determine planning"
                    ],
                    "answer": 3,
                    "explanation": "Bleeding history, platelet function, trend, procedure invasiveness, local control, comorbidity, and hematology guidance matter. Higher-risk surgery generally requires a higher target than noninvasive care. Reference: Little JW, Miller CS, Rhodus NL. Dental Management of the Medically Compromised Patient. 9th ed. Thrombocytopenia.",
                    "source": "SDLE bank"
                },
                {
                    "q": "Spontaneous gingival bleeding, purpura, fatigue, and fever are present. What is the priority?",
                    "options": [
                        "Scaling without laboratory tests",
                        "Diagnose plaque gingivitis only",
                        "Urgent complete blood count and medical evaluation",
                        "Prescribe aspirin"
                    ],
                    "answer": 2,
                    "explanation": "Thrombocytopenia, leukemia, marrow failure, or systemic infection may present this way. Invasive treatment is deferred until bleeding and infection risks are defined. Reference: Glick M, ed. Burket's Oral Medicine. 13th ed. Oral manifestations of hematologic disease.",
                    "source": "SDLE bank"
                }
            ],
        },
        {
            id: "md-organ",
            title: "07 — Liver, Kidney, Gut and Bloodborne Infection",
            title_en: "Cirrhosis · renal care · needlestick",
            summaryHtml: `
<h4 class="deck-topic">Liver disease</h4>
<ul>
<li>Extraction risks: <b>coagulopathy, low platelets, infection and impaired drug handling</b></li>
<li>Check INR, platelets and liver status with the physician</li>
<li>Analgesic: <b>paracetamol at a reduced total daily dose</b> is generally preferred in stable cirrhosis; avoid NSAIDs. In decompensated disease use the lowest suitable dose with medical advice</li>
<li>Jaundice, ascites and oedema: medical evaluation before elective care</li>
</ul>
<h4 class="deck-topic">Kidney disease</h4>
<ul>
<li><b>Avoid NSAIDs</b> and other nephrotoxic drugs; paracetamol is generally preferred</li>
<li>Adjust renally cleared drugs; haemodialysis patients are usually treated the <b>day after dialysis</b>; protect the fistula arm</li>
<li>Transplant recipients: avoid nephrotoxic choices and check interactions with immunosuppressants. Tacrolimus and ciclosporin levels rise with macrolides and azoles</li>
</ul>
<h4 class="deck-topic">Gut disease</h4>
<ul>
<li>Crohn disease: review <b>immunosuppressants, biologics, steroids</b> and disease activity; prefer paracetamol to NSAIDs</li>
<li>Reflux: erosion; upright position may help</li>
</ul>
<h4 class="deck-topic">Bloodborne viruses</h4>
<div class="sum-algo"><span class="sum-algo-title">Needlestick or sharp injury</span><ol>
<li>Stop, wash with soap and running water (flush mucosa); do not squeeze hard or use bleach</li>
<li><b>Report immediately</b> and get urgent occupational assessment</li>
<li>Test source (with consent rules) and the injured person</li>
<li><b>HIV prophylaxis</b>: as soon as possible, ideally within hours and not later than 72 hours, for <b>28 days</b></li>
<li>HBV: act on vaccine response (anti-HBs of at least 10 mIU/mL is protective); non-immune may need immunoglobulin and vaccine</li>
<li>HCV: no immune prophylaxis; follow-up testing and early treatment</li>
</ol></div>
<ul>
<li>Transmission risk from one injury is highest for <b>HBV</b>, then HCV, then HIV</li>
<li>HBV can remain infectious on surfaces for at least 7 days. Standard precautions apply to <b>every patient</b></li>
<li><b>AIDS</b>: CD4 below <b>200 cells per microlitre</b> or an AIDS-defining illness. Hairy leukoplakia often needs only immune assessment and follow-up</li>
</ul>
<div class="sum-key"><span class="sum-key-title">نقاط امتحانية</span><ul>
<li>Kidney disease: no routine NSAIDs.</li>
<li>Cirrhosis affects clotting, platelets and drug metabolism.</li>
<li>HIV prophylaxis lasts four weeks and is time critical.</li>
<li>CD4 under 200 meets the AIDS threshold.</li>
</ul></div>
`,
            questions: [
                {
                    "q": "A patient has jaundice and cirrhosis. What increases extraction risk?",
                    "options": [
                        "Coagulopathy, thrombocytopenia, infection, and impaired drug metabolism",
                        "Increased enamel hardness",
                        "Faster local anesthetic clearance",
                        "Reduced bleeding risk"
                    ],
                    "answer": 0,
                    "explanation": "Current INR, platelets, liver function, decompensation, medications, and procedure risk should be reviewed. Drug dose and selection require caution. Reference: Little JW, Miller CS, Rhodus NL. Dental Management of the Medically Compromised Patient. 9th ed. Liver disease.",
                    "source": "SDLE bank"
                },
                {
                    "q": "Which analgesic is generally preferred for short-term dental pain in stable cirrhosis when used at a reduced total daily dose?",
                    "options": [
                        "Ibuprofen",
                        "Aspirin",
                        "Diclofenac",
                        "Acetaminophen"
                    ],
                    "answer": 3,
                    "explanation": "Acetaminophen is generally preferred to NSAIDs in cirrhosis because NSAIDs can worsen renal perfusion, sodium retention, and bleeding. Many experts limit acetaminophen to 2 g/day, with further reduction or avoidance based on alcohol use and liver status. Reference: AASLD clinical guidance; Little and Falace. 10th ed. Liver disease.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A patient with diabetic nephropathy needs a nonopioid analgesic and has no liver contraindication. Which is generally preferred?",
                    "options": [
                        "Ibuprofen",
                        "Diclofenac",
                        "Aspirin",
                        "Acetaminophen"
                    ],
                    "answer": 3,
                    "explanation": "At recommended doses, acetaminophen is generally preferred over NSAIDs in chronic kidney disease because NSAIDs can reduce renal perfusion and worsen kidney injury. Total dose, liver status, combination products, renal stage, and duration still require review. Reference: National Kidney Foundation. Pain Medicines and Kidney Disease. Updated 2025; Little and Falace's Dental Management of the Medically Compromised Patient. 10th ed.",
                    "source": "SDLE bank"
                },
                {
                    "q": "Which analgesic principle is most important for a renal-transplant recipient with impaired graft function?",
                    "options": [
                        "Use NSAIDs at maximum dose automatically",
                        "Stop antirejection therapy",
                        "Ignore renal dosing",
                        "Avoid nephrotoxic choices and check immunosuppressant interactions"
                    ],
                    "answer": 3,
                    "explanation": "NSAIDs may impair renal perfusion and interact with calcineurin inhibitors. Drug selection and dosing should reflect current renal function and transplant-team advice. Reference: Little JW, Miller CS, Rhodus NL. Dental Management of the Medically Compromised Patient. 9th ed. Dental pharmacology in renal disease.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A patient with Crohn disease requires endodontic treatment. What is the most important medication review?",
                    "options": [
                        "Tooth shade only",
                        "Immunosuppressants, biologics, steroids, and current disease activity",
                        "Root length only",
                        "Crohn disease automatically contraindicates treatment"
                    ],
                    "answer": 1,
                    "explanation": "Infection risk, adrenal suppression, healing, anemia, nutrition, and NSAID intolerance may affect care. Endodontic treatment itself is not automatically contraindicated. Reference: Little JW, Miller CS, Rhodus NL. Dental Management of the Medically Compromised Patient. 9th ed. Inflammatory bowel disease.",
                    "source": "SDLE bank"
                }
            ],
        },
        {
            id: "md-drugs",
            title: "08 — Prescribing Safety and Interactions",
            title_en: "Antibiotics · analgesics · interactions",
            summaryHtml: `
<h4 class="deck-topic">Analgesics</h4>
<ul>
<li><b>NSAIDs</b>: caution in heart disease (raise the risk of <b>infarction</b> and stroke), heart failure, kidney disease, ulcers, anticoagulant use, sensitive asthma and late pregnancy</li>
<li>After myocardial infarction: prefer <b>paracetamol</b> and avoid routine ibuprofen</li>
</ul>
<h4 class="deck-topic">Antibiotic actions</h4>
<div class="deck-block deck-tbl"><table>
<thead><tr><th>Drug</th><th>Mechanism or note</th></tr></thead>
<tbody>
<tr><td><b>Penicillins</b> (beta-lactams)</td><td>Block peptidoglycan cross-linking in the cell wall</td></tr>
<tr><td><b>Metronidazole</b></td><td>Reduced inside anaerobes to products that damage <b>DNA</b></td></tr>
<tr><td><b>Clindamycin, macrolides</b></td><td>Inhibit the 50S ribosomal subunit</td></tr>
<tr><td><b>Tetracyclines</b></td><td>Inhibit 30S; stain developing teeth</td></tr>
</tbody></table></div>
<ul>
<li>Significant diarrhoea during or after antibiotics (classically clindamycin, but amoxicillin too): think of <b><i>Clostridioides difficile</i></b>; stop an unnecessary antibiotic and get medical care; avoid antimotility drugs until assessed</li>
</ul>
<h4 class="deck-topic">Interactions to know</h4>
<div class="deck-block deck-tbl"><table>
<thead><tr><th>Combination</th><th>Risk</th></tr></thead>
<tbody>
<tr><td>Warfarin + <b>metronidazole</b>, azoles or macrolides</td><td>Higher INR, bleeding</td></tr>
<tr><td>Warfarin + NSAIDs</td><td>Bleeding</td></tr>
<tr><td><b>Non-selective beta blocker</b> + adrenaline</td><td>Hypertension with reflex bradycardia</td></tr>
<tr><td><b>Digoxin</b> + adrenaline</td><td>Arrhythmia</td></tr>
<tr><td>Sulfonylurea + NSAID</td><td>Hypoglycaemia</td></tr>
<tr><td>Theophylline + erythromycin</td><td>Toxicity</td></tr>
<tr><td>Metronidazole + alcohol</td><td>Advise avoiding alcohol</td></tr>
</tbody></table></div>
<h4 class="deck-topic">Adverse oral effects</h4>
<ul>
<li>Gingival enlargement: nifedipine, phenytoin, ciclosporin</li>
<li>Lichenoid reaction: thiazides, NSAIDs, some antihypertensives</li>
<li><b>Angioedema</b>: ACE inhibitors, even after long use. Check the airway first</li>
<li>Dry mouth: many antidepressants, antihistamines and antihypertensives</li>
</ul>
<div class="sum-algo"><span class="sum-algo-title">Before you prescribe</span><ol>
<li>Is it needed? Antibiotics do not treat pain without spreading infection</li>
<li>Allergy, pregnancy, age, kidney, liver</li>
<li>Full drug list and interactions</li>
<li>Shortest effective course with clear review</li>
</ol></div>
<div class="sum-key"><span class="sum-key-title">نقاط امتحانية</span><ul>
<li>Metronidazole strengthens warfarin.</li>
<li>Antibiotic diarrhoea: consider C. difficile.</li>
<li>Penicillin targets cell wall synthesis.</li>
<li>Lip swelling on an ACE inhibitor: drug angioedema.</li>
</ul></div>
`,
            questions: [
                {
                    "q": "A warfarin-treated patient develops a high INR after starting metronidazole. What is the likely mechanism?",
                    "options": [
                        "Immediate vitamin K production",
                        "Potentiation of warfarin effect",
                        "Reduced anticoagulation",
                        "Platelet transfusion"
                    ],
                    "answer": 1,
                    "explanation": "Metronidazole can inhibit warfarin metabolism and increase bleeding risk. Coordinate INR monitoring and use an alternative when appropriate. Reference: Brunton LL, Hilal-Dandan R, Knollmann BC, eds. Goodman & Gilman's. 14th ed. Warfarin drug interactions.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A patient takes a nonselective beta blocker and requires local anesthetic with epinephrine. What is the concern?",
                    "options": [
                        "Hypertensive response with reflex bradycardia",
                        "Guaranteed anaphylaxis",
                        "Severe hypoglycemia in every case",
                        "Loss of local anesthesia"
                    ],
                    "answer": 0,
                    "explanation": "Unopposed alpha-adrenergic vasoconstriction is possible. Use the lowest effective vasoconstrictor dose, aspirate, inject slowly, and monitor blood pressure and pulse. Reference: Little JW, Miller CS, Rhodus NL. Dental Management of the Medically Compromised Patient. 9th ed. Cardiovascular drug interactions.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A patient develops frequent watery diarrhea and abdominal pain while taking clindamycin. What diagnosis must be considered?",
                    "options": [
                        "Irritable bowel syndrome only",
                        "Clostridioides difficile colitis",
                        "Viral hepatitis",
                        "Acute appendicitis in every case"
                    ],
                    "answer": 1,
                    "explanation": "Clindamycin is a high-risk antibiotic for C. difficile infection. Stop unnecessary antibiotics, assess severity, test symptomatic patients appropriately, and arrange prompt medical treatment. Reference: Centers for Disease Control and Prevention. C. diff: Facts for Clinicians. Updated April 2026.",
                    "source": "SDLE bank"
                },
                {
                    "q": "Which analgesic approach is preferable for dental pain in a patient with prior myocardial infarction?",
                    "options": [
                        "Use high-dose ibuprofen routinely",
                        "Use diclofenac indefinitely",
                        "Stop cardiac medicines",
                        "Prefer acetaminophen and avoid routine ibuprofen"
                    ],
                    "answer": 3,
                    "explanation": "Nonaspirin NSAIDs increase cardiovascular thrombotic risk and may worsen blood pressure, renal function, or heart failure. Acetaminophen is usually preferred when appropriate; analgesia is individualized. Reference: U.S. Food and Drug Administration. NSAID Cardiovascular Risk Communication; American Heart Association guidance.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A patient on a sulfonylurea receives ibuprofen for several days. What adverse effect should be monitored?",
                    "options": [
                        "Hyperthyroid crisis",
                        "Local anesthetic toxicity",
                        "Oral candidiasis only",
                        "Hypoglycemia"
                    ],
                    "answer": 3,
                    "explanation": "NSAIDs can enhance sulfonylurea effect in some patients, while renal impairment can further increase risk. Glucose monitoring and safer analgesic selection may be appropriate. Reference: Brunton LL, Hilal-Dandan R, Knollmann BC, eds. Goodman & Gilman's. 14th ed. Sulfonylurea drug interactions.",
                    "source": "SDLE bank"
                }
            ],
        },
        {
            id: "md-special",
            title: "09 — Pregnancy and the Immunocompromised",
            title_en: "Timing · safe drugs · cancer and transplant",
            summaryHtml: `
<h4 class="deck-topic">Pregnancy</h4>
<ul>
<li><b>Urgent care and infection treatment must not be delayed</b> in any trimester</li>
<li>The <b>second trimester</b> is the most comfortable time for elective care; prevention is useful throughout</li>
<li>First trimester: organ formation, nausea. Third: supine hypotension; tilt to the <b>left</b> by raising the right hip</li>
<li>Analgesic: <b>paracetamol</b> at proper doses. Avoid NSAIDs especially from about 20 weeks unless the obstetrician advises</li>
<li>Antibiotics generally acceptable when indicated and no allergy: <b>amoxicillin</b>, penicillin, cephalosporins; clindamycin for selected allergy. Avoid tetracyclines</li>
<li>Lidocaine with adrenaline can be used with aspiration and normal dose limits</li>
<li>Necessary radiographs are acceptable with dose optimisation</li>
<li>The old letter categories (A, B, C, D, X) have been replaced by narrative labelling in the US</li>
<li><b>Folic acid</b> before and in early pregnancy prevents neural tube defects and is advised for all</li>
</ul>
<h4 class="deck-topic">Transplant patients</h4>
<ul>
<li>Ideally complete dental treatment before transplantation</li>
<li>In the <b>early months</b> after transplant: <b>defer elective care</b> and coordinate with the transplant team</li>
<li>Later: watch for infection, candida, drug-related gingival enlargement, lichenoid or viral lesions and malignancy</li>
<li>A new red-white burning lesion: examine for candidiasis, lichenoid reaction, viral disease and, if persistent, biopsy</li>
</ul>
<h4 class="deck-topic">Cancer therapy</h4>
<ul>
<li>Before therapy: remove infection sources early and allow healing</li>
<li>During: check blood counts, defer routine surgery when counts are low, coordinate timing</li>
<li>Radiotherapy mouth ulcers within weeks are an early tissue reaction (mucositis); osteoradionecrosis is a late risk</li>
<li>Antiresorptives: ask about drug, dose, route and duration before any extraction</li>
</ul>
<div class="sum-algo"><span class="sum-algo-title">Medically complex patient</span><ol>
<li>Is the dental problem urgent?</li>
<li>Is the medical condition stable?</li>
<li>Elective and unstable: defer and consult</li>
<li>Urgent and unstable: safest limited care, often in hospital</li>
</ol></div>
<div class="sum-key"><span class="sum-key-title">نقاط امتحانية</span><ul>
<li>Light-headed in late pregnancy: left lateral tilt.</li>
<li>Paracetamol and amoxicillin are the usual pregnancy choices.</li>
<li>Two weeks after transplant: no elective dentistry.</li>
<li>Severe neutropenia: postpone non-urgent extraction.</li>
</ul></div>
`,
            questions: [
                {
                    "q": "A patient in late pregnancy becomes light-headed while lying flat in the dental chair. Which position change is appropriate?",
                    "options": [
                        "Left lateral tilt",
                        "Flat supine",
                        "Trendelenburg",
                        "Right lateral tilt"
                    ],
                    "answer": 0,
                    "explanation": "The gravid uterus can compress the inferior vena cava in the supine position. Turning the patient toward the left or placing a wedge under the right hip relieves aortocaval compression. Reference: American College of Obstetricians and Gynecologists. Physical Activity and Exercise During Pregnancy and the Postpartum Period. Supine-position guidance; Little and Falace's Dental Management of the Medically Compromised Patient. 10th ed.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A pregnant patient with odontogenic infection has no drug allergy. Which antibiotic is generally acceptable when indicated?",
                    "options": [
                        "Tetracycline",
                        "Isotretinoin",
                        "Warfarin",
                        "Amoxicillin"
                    ],
                    "answer": 3,
                    "explanation": "Penicillins are commonly used in pregnancy when clinically indicated. Definitive source control remains primary, and drug choice considers allergy, gestation, severity, and obstetric factors. Reference: Little JW, Miller CS, Rhodus NL. Dental Management of the Medically Compromised Patient. 9th ed. Pregnancy and dental medications.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A patient is two weeks after organ transplantation and requests elective dental treatment. What is the best action?",
                    "options": [
                        "Proceed without blood counts",
                        "Stop immunosuppressants",
                        "Defer elective care and coordinate with the transplant team",
                        "Prescribe antibiotics routinely without indication"
                    ],
                    "answer": 2,
                    "explanation": "Early post-transplant immunosuppression carries high infection, bleeding, and interaction risk. Urgent treatment is coordinated; elective care waits for medical stability. Reference: Little JW, Miller CS, Rhodus NL. Dental Management of the Medically Compromised Patient. 9th ed. Solid-organ transplantation.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A patient with chemotherapy-induced severe neutropenia and thrombocytopenia needs nonurgent extraction. What is the best action?",
                    "options": [
                        "Extract without laboratory review",
                        "Defer and coordinate timing with oncology and hematology",
                        "Give aspirin",
                        "Stop cancer therapy independently"
                    ],
                    "answer": 1,
                    "explanation": "Elective invasive care is timed to marrow recovery. Urgent infection may require hospital-based coordinated treatment with antimicrobial and transfusion support as indicated. Reference: Little JW, Miller CS, Rhodus NL. Dental Management of the Medically Compromised Patient. 9th ed. Dental care during chemotherapy.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A renal-transplant recipient has red-and-white oral lesions and burning. What is the next step?",
                    "options": [
                        "Prescribe steroids automatically",
                        "Ignore persistent lesions",
                        "Examine for candidiasis, lichenoid reaction, viral disease, and malignancy",
                        "Diagnose allergy from color alone"
                    ],
                    "answer": 2,
                    "explanation": "Immunosuppressed patients can have overlapping infections, drug reactions, immune disease, and increased malignancy risk. Persistent or indurated lesions require definitive diagnosis. Reference: Glick M, ed. Burket's Oral Medicine. 13th ed. Oral complications of transplantation.",
                    "source": "SDLE bank"
                }
            ],
        },
    ],
};

export default dentalMedicalDentistry;
