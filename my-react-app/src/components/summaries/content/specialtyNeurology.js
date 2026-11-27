// Neurology — medical-track section of the summaries catalog.
// Mirrored for the slide viewer in backend/content/summaryHtml (keep the two in sync).
// Inline questions are copied from the SQB bank.
const specialtyNeurology = {
    id: "neurology",
    title: "Neurology",
    title_en: "SMLE Review — 10 Topics",
    icon: "shield-check",
    accent: "#34d399",
    intro: "A deeper neurology pass for the SMLE: acute ischaemic stroke, stroke localisation, TIA and secondary prevention, intracranial bleeding, central nervous system infection, seizures, multiple sclerosis, spinal cord and neuromuscular emergencies, dementia and delirium, and headache with movement disorders.",
    subtopics: [
        {
            id: "nrl-acute-stroke",
            title: "01 — Acute Ischaemic Stroke",
            title_en: "First test · reperfusion windows · blood pressure · early care",
            summaryHtml: `
<p>Sudden focal deficit is stroke until proved otherwise. The most important history item is the time the patient was <b>last known well</b>.</p>
<div class="sum-algo"><span class="sum-algo-title">First minutes</span><ol>
<li>Airway, breathing, circulation.</li>
<li><b>Capillary glucose</b>: hypoglycaemia mimics stroke.</li>
<li>Stroke scale (NIHSS).</li>
<li><b>Non-contrast CT head</b> to exclude haemorrhage.</li>
<li>CT angiography to look for a large vessel occlusion, without delaying thrombolysis.</li>
</ol></div>
<p>An early CT can look normal in ischaemic stroke.</p>
<h4 class="deck-topic">Reperfusion</h4>
<ul>
<li><b>IV thrombolysis</b> (alteplase or tenecteplase, per protocol): disabling deficit within <b>4.5 hours</b> and no contraindication. Selected later or wake-up cases can qualify by advanced imaging.</li>
<li>Exclusions include haemorrhage on CT, previous intracranial haemorrhage, recent serious head trauma or stroke, active internal bleeding, important coagulopathy or effective anticoagulation.</li>
<li>Pressure must be <b>below 185/110</b> before treatment and kept below 180/105 for the next 24 hours.</li>
<li><b>Mechanical thrombectomy</b>: large vessel occlusion with salvageable brain; standard early (within 6 hours) and extended <b>up to 24 hours</b> in imaging-selected patients. Eligibility keeps widening. Give thrombolysis too when eligible.</li>
</ul>
<h4 class="deck-topic">If no reperfusion</h4>
<ul>
<li>Allow <b>permissive hypertension</b>: usually treat only above <b>220/120</b>, unless another condition requires lower (dissection, heart failure, acute coronary syndrome).</li>
<li><b>Aspirin</b> within 24 to 48 hours once bleeding is excluded; after thrombolysis wait about 24 hours and repeat imaging.</li>
<li>Full-dose anticoagulation is not started immediately for most strokes.</li>
</ul>
<h4 class="deck-topic">Stroke unit basics</h4>
<ul>
<li><b>Swallow screen</b> before food or tablets.</li>
<li>Treat fever; keep glucose roughly 140 to 180 mg/dL and avoid hypoglycaemia.</li>
<li>VTE prevention (intermittent compression early), early rehabilitation.</li>
<li>Sudden decline: repeat CT for bleeding or swelling. A large cerebellar or malignant MCA infarct needs early neurosurgical review.</li>
</ul>
<div class="sum-key"><span class="sum-key-title">نقاط امتحانية</span><ul>
<li>First imaging: CT head without contrast.</li>
<li>Large vessel occlusion with salvageable tissue, even hours later: assess for thrombectomy.</li>
<li>No lysis planned: do not lower pressure unless about 220/120 or another reason exists.</li>
<li>Thrombolysis needs pressure under 185/110.</li>
</ul></div>`,
            questions: [
                {
                    "q": "A 70-year-old comes to the ER after 12 hours of right-sided weakness. CT shows posterior artery occlusion with a mild to moderate ischemic core. What is the most appropriate management?",
                    "options": [
                        "tPA",
                        "Observe",
                        "Mechanical thrombectomy",
                        "tPA with mechanical thrombectomy"
                    ],
                    "answer": 2,
                    "explanation": "Beyond the tPA time window but within the extended thrombectomy window, up to 24 hours in select patients with a favorable ischemic core on imaging, mechanical thrombectomy can be offered for a large vessel occlusion with persistent symptoms and a small-to-moderate infarct core.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A woman in her 80s , presented to ER with Lt sided weakness of face , arm, and leg PE revealed Lt sided hemiplegia CT : age related changes with no hemorrhagic changes At which threshold should antihypertensives be initiated ?",
                    "options": [
                        "140/90",
                        "150/100",
                        "220/120",
                        "240/125"
                    ],
                    "answer": 2,
                    "explanation": "In acute ischemic stroke without thrombolysis, blood pressure is allowed to stay high to keep blood flowing to the penumbra. Treatment is usually started only if it exceeds 220/120 mmHg, or if there is another urgent indication such as aortic dissection or heart failure. If thrombolysis is planned, the limit is lower, below 185/110. Routine targets like 140/90 apply later.",
                    "source": "SMLE recall"
                }
            ],
        },
        {
            id: "nrl-localisation",
            title: "02 — Stroke Localisation",
            title_en: "Cortex · lacunes · brainstem · cerebellum",
            summaryHtml: `
<h4 class="deck-topic">Two rules</h4>
<ul>
<li>Hemisphere lesions give <b>contralateral</b> signs; <b>cortical</b> signs are aphasia, neglect, gaze preference and field loss.</li>
<li>Brainstem lesions give <b>crossed</b> signs: cranial nerve signs on one side, body signs on the other. Cerebellar signs are <b>same-sided</b>.</li>
</ul>
<div class="deck-block deck-tbl"><table><thead><tr><th>Territory</th><th>Pattern</th></tr></thead><tbody>
<tr><td><b>Middle cerebral</b></td><td>Face and arm more than leg, sensory loss, field defect; aphasia if dominant (usually left), neglect if non-dominant</td></tr>
<tr><td><b>Anterior cerebral</b></td><td>Leg more than arm, apathy, behaviour change</td></tr>
<tr><td><b>Posterior cerebral</b></td><td>Contralateral homonymous hemianopia, often with macular sparing</td></tr>
<tr><td><b>Lacunar</b> (small penetrating branches)</td><td>Pure motor, pure sensory, ataxic hemiparesis, clumsy hand with dysarthria; no cortical signs. Hypertension and diabetes</td></tr>
</tbody></table></div>
<h4 class="deck-topic">Posterior circulation</h4>
<div class="deck-block deck-tbl"><table><thead><tr><th>Syndrome</th><th>Key features</th></tr></thead><tbody>
<tr><td><b>Lateral medulla</b> (PICA, often vertebral disease)</td><td>Same-side facial pain and temperature loss, Horner, ataxia; <b>dysphagia, hoarseness</b>; opposite-side body pain and temperature loss; vertigo; strength usually spared</td></tr>
<tr><td><b>Lateral pons</b> (AICA)</td><td>Same-side <b>facial weakness and hearing loss</b>, vertigo, ataxia, crossed sensory loss</td></tr>
<tr><td><b>Pons / basilar</b></td><td>Quadriplegia, <b>pinpoint pupils</b>, gaze palsy, dysarthria, coma; <b>locked-in</b> state with preserved awareness and vertical eye movement</td></tr>
<tr><td><b>Midbrain</b></td><td>Third nerve palsy with opposite hemiplegia</td></tr>
<tr><td><b>Cerebellar hemisphere</b></td><td>Same-side limb ataxia, intention tremor, dysmetria, nystagmus</td></tr>
</tbody></table></div>
<h4 class="deck-topic">Face weakness</h4>
<ul>
<li><b>Upper motor neuron</b>: forehead spared.</li>
<li><b>Lower motor neuron</b> (Bell palsy, or a pontine lesion of the nerve nucleus or fascicle): whole half of face including forehead. Other brainstem signs argue against Bell palsy.</li>
</ul>
<p>A swelling cerebellar stroke can compress the brainstem and cause hydrocephalus: watch consciousness closely. Dizziness with new severe gait ataxia needs a stroke assessment, and CT can miss posterior fossa infarcts, so MRI helps.</p>
<div class="sum-key"><span class="sum-key-title">نقاط امتحانية</span><ul>
<li>Dysphagia, Horner and crossed pain loss: lateral medulla, PICA.</li>
<li>Facial weakness with hearing loss: AICA.</li>
<li>Pinpoint pupils and quadriplegia: pons.</li>
<li>Aphasia with right face and arm weakness: left MCA.</li>
</ul></div>`,
            questions: [
                {
                    "q": "A 73-year-old diabetic man presents with right-sided weakness. The weakness is equal in the right face, arm and leg. Sensation, speech and comprehension are intact. Which of the following arteries is affected?",
                    "options": [
                        "Vertebral artery",
                        "Mid-basilar artery",
                        "Anterior cerebral artery",
                        "Penetrating branch, middle cerebral artery"
                    ],
                    "answer": 3,
                    "explanation": "Core Concept: Lacunar stroke syndrome, specifically Pure Motor Hemiparesis. Clinical Presentation: · Unilateral weakness equally affecting the face, arm, and leg, without 'cortical' signs (no aphasia, neglect, agnosia, or visual field defects) and no sensory deficits. · Complications: Long-term disability, recurrent strokes. Diagnosis: · First-line: Non-contrast CT head to rule out hemorrhage. · Gold standard: MRI brain (diffusion-weighted imaging) to detect small deep infarcts (lacunes), typically in the posterior limb of the internal capsule or corona radiata. Management: · Acute: Thrombolysis if within the time window, antiplatelet therapy, statin, and permissive hypertension. · Long-term: Secondary stroke prevention (antiplatelets, strict blood pressure control, and diabetes management). The lesion is typically located in the internal capsule, which is supplied by the lenticulostriate arteries (deep penetrating branches of the middle cerebral artery).",
                    "source": "SMLE bank"
                },
                {
                    "q": "A stroke patient presents with facial weakness and hearing loss. Which artery territory is affected?",
                    "options": [
                        "Internal carotid artery",
                        "Middle cerebral artery",
                        "Anterior inferior cerebellar artery",
                        "Posterior cerebral artery"
                    ],
                    "answer": 2,
                    "explanation": "Facial weakness + HEARING LOSS = AICA (lateral pontine syndrome) - AICA supplies the labyrinthine artery, so it is the stroke that causes DEAFNESS, with an LMN facial palsy (forehead involved). Add ipsilateral Horner, ataxia, vertigo, facial sensory loss + CONTRALATERAL body pain/temperature loss. PICA (lateral medullary/Wallenberg) = same crossed pattern + dysphagia/hoarseness, NO deafness.",
                    "source": "SMLE recall"
                },
                {
                    "q": "Imaging shows a haemorrhagic stroke. The patient can move his eyes but the pupils are pinpoint, and he cannot speak or move his body. Where is the lesion?",
                    "options": [
                        "Pons",
                        "Medulla",
                        "Basal ganglia"
                    ],
                    "answer": 0,
                    "explanation": "Pontine haemorrhage: PINPOINT (reactive) pupils, quadriplegia, anarthria, preserved vertical eye movements/blinking (locked-in syndrome). Pinpoint pupils localise to the pons.",
                    "source": "SMLE recall"
                },
                {
                    "q": "Case of stroke RT side hemiplegia and power 0/5 Left side facial palsy aphasia and he is Dominant in the RT hand.",
                    "options": [
                        "right side MCA",
                        "Left MCA",
                        "Lateral medullary syndrome"
                    ],
                    "answer": 1,
                    "explanation": "Core Concept: An ischemic stroke involving the Middle Cerebral Artery (MCA) is the most common type of stroke, typically affecting the lateral convexity of the cerebral hemisphere. Clinical Presentation: · Contralateral hemiplegia and hemisensory loss (face and upper extremity > lower extremity). · Aphasia (expressive, receptive, or global) if the dominant hemisphere (usually the left) is involved. · Hemineglect and anosognosia if the non-dominant hemisphere (usually the right) is involved. · Complications: Cerebral edema, hemorrhagic transformation, and seizures. Diagnosis: · First-line: Non-contrast CT scan of the head to rapidly rule out intracranial hemorrhage. · Gold Standard: MRI of the brain with Diffusion-Weighted Imaging (DWI) and MR Angiography (MRA) to identify the exact location and extent of the infarct and vascular occlusion. Management: · Acute: Intravenous thrombolysis (alteplase/tenecteplase) if within 4.5 hours of symptom onset, or mechanical thrombectomy for large vessel occlusions up to 24 hours. · Long-term/definitive: Antiplatelet therapy, high-intensity statins, blood pressure control, and comprehensive physical/speech rehabilitation.",
                    "source": "SMLE bank"
                }
            ],
        },
        {
            id: "nrl-tia-prevention",
            title: "03 — TIA & Secondary Prevention",
            title_en: "Urgent work-up · antithrombotics · carotid disease · rehabilitation",
            summaryHtml: `
<p><b>TIA</b>: a brief focal neurological episode from ischaemia <b>without infarction on imaging</b>. Symptoms resolving does not make it benign: early stroke risk is high. <b>Amaurosis fugax</b> (transient loss of vision in one eye) points to the same-side carotid.</p>
<h4 class="deck-topic">Urgent work-up</h4>
<ul>
<li>Brain imaging (MRI with diffusion is best).</li>
<li><b>Neck vessel imaging</b>: duplex, CT or MR angiography.</li>
<li>ECG and rhythm monitoring for AF; echo when a heart source is possible.</li>
<li>Glucose, lipids, blood count, coagulation.</li>
</ul>
<h4 class="deck-topic">Antithrombotic choice</h4>
<div class="deck-block deck-tbl"><table><thead><tr><th>Mechanism</th><th>Treatment</th></tr></thead><tbody>
<tr><td>Non-cardioembolic TIA or stroke</td><td>Single antiplatelet long term</td></tr>
<tr><td>High-risk TIA or minor stroke, early</td><td><b>Aspirin + clopidogrel</b> for a short course (about 21 days), then one agent</td></tr>
<tr><td><b>Atrial fibrillation</b></td><td>Oral anticoagulant (DOAC unless a mechanical valve or significant mitral stenosis); timing after stroke depends on size and bleeding risk</td></tr>
</tbody></table></div>
<p>Long-term dual antiplatelet therapy mainly adds bleeding.</p>
<h4 class="deck-topic">Carotid stenosis (symptomatic side)</h4>
<ul>
<li><b>70 to 99%</b>: <b>endarterectomy</b>, ideally within 2 weeks of a non-disabling event, if operative risk is acceptable. Stenting is an alternative in selected patients.</li>
<li><b>50 to 69%</b>: surgery for selected patients, weighing age, sex and surgical risk.</li>
<li><b>Below 50%</b>: medical therapy only.</li>
<li>Complete occlusion is generally not operated on.</li>
</ul>
<p>Always confirm that the symptoms match the narrowed artery. Exam stems that give a figure just under 50% expect medical care and surveillance.</p>
<h4 class="deck-topic">Risk factors</h4>
<ul>
<li><b>Blood pressure</b> control is central (often below 130/80); ACE inhibitor, ARB, CCB or thiazide-type drugs are suitable.</li>
<li>High-intensity statin; an LDL goal below 70 mg/dL is widely used.</li>
<li>Diabetes control, stop smoking, diet, activity, sleep apnoea treatment.</li>
</ul>
<h4 class="deck-topic">Prevention levels</h4>
<ul>
<li><b>Primary</b>: stop disease before it starts.</li>
<li><b>Secondary</b>: detect early or screen.</li>
<li><b>Tertiary</b>: reduce disability from established disease, such as <b>physiotherapy after stroke</b>.</li>
</ul>
<p>Clinicians also call drugs that prevent another stroke "secondary prevention".</p>
<div class="sum-key"><span class="sum-key-title">نقاط امتحانية</span><ul>
<li>Recent TIA with about 70% matching carotid stenosis: endarterectomy.</li>
<li>Stenosis under 50%: no surgery.</li>
<li>AF is treated with anticoagulation, not aspirin alone.</li>
<li>Stroke rehabilitation is tertiary prevention.</li>
</ul></div>`,
            questions: [
                {
                    "q": "Older man has transient unilateral weakness resolving after approximately 20 minutes. Brain imaging normal. Carotid stenosis around 70%.",
                    "options": [
                        "Aspirin",
                        "Apixaban",
                        "Warfarin",
                        "Carotid endarterectomy"
                    ],
                    "answer": 3,
                    "explanation": "A TIA with symptomatic carotid stenosis of 70 per cent or more needs carotid endarterectomy within two weeks on top of antiplatelet and statin therapy; anticoagulation is for cardioembolic disease, not for carotid plaque.",
                    "source": "SMLE recall"
                },
                {
                    "q": "Pt w recent stroke, carotid stenosis is 48%, already started on medical stroke prevention. What to do for carotid stenosis:",
                    "options": [
                        "endarectomy",
                        "observe",
                        "insert stent"
                    ],
                    "answer": 1,
                    "explanation": "For symptomatic carotid stenosis below 50%, surgery or stenting gives no benefit over its risks. With 48% stenosis he should continue medical therapy and be observed with follow-up. Endarterectomy is clearly beneficial at 70 to 99% stenosis and may be considered at 50 to 69%.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A post-stroke patient has weakness and is undergoing physical therapy while also continuing primary prevention measures. What type of prevention is his physical therapy?",
                    "options": [
                        "Tertiary",
                        "Secondary",
                        "Primary",
                        "Rehabilitation, not prevention"
                    ],
                    "answer": 0,
                    "explanation": "Rehabilitation aimed at minimizing disability and complications from an already-established disease, such as a stroke, is classified as tertiary prevention, distinct from primary prevention (preventing disease onset) or secondary prevention (early detection).",
                    "source": "SMLE recall"
                }
            ],
        },
        {
            id: "nrl-haemorrhage",
            title: "04 — Intracranial Bleeding",
            title_en: "Subarachnoid · intracerebral · epidural · subdural",
            summaryHtml: `
<h4 class="deck-topic">Subarachnoid haemorrhage</h4>
<div class="sum-algo"><span class="sum-algo-title">Thunderclap headache</span><ol>
<li><b>Non-contrast CT</b>; very sensitive in the first 6 hours.</li>
<li>CT negative but suspicion remains (especially presenting later): <b>lumbar puncture</b> for xanthochromia, best from about 12 hours (or follow the agreed alternative pathway).</li>
<li>Blood confirmed: <b>CT angiography</b> to find the aneurysm, with catheter angiography as needed.</li>
</ol></div>
<ul>
<li>"Worst headache of life", neck stiffness, vomiting, collapse.</li>
<li>Care: neurosurgical centre, <b>secure the aneurysm early</b> (coil or clip), control pressure, <b>nimodipine</b> to improve outcome from delayed ischaemia.</li>
<li>Complications: rebleeding, <b>delayed ischaemia from vasospasm</b> (about days 3 to 14), hydrocephalus, seizures, low sodium (SIADH or salt wasting).</li>
</ul>
<h4 class="deck-topic">Intracerebral haemorrhage</h4>
<ul>
<li>Hypertension is the leading cause; deep sites, above all the <b>basal ganglia</b> (putamen), also thalamus, pons, cerebellum. Lobar bleeds in older adults suggest amyloid angiopathy.</li>
<li><b>Reverse anticoagulation</b> immediately.</li>
<li>Lower raised pressure smoothly. Current AHA guidance aims for a systolic of about <b>140 (range 130 to 150)</b> in mild to moderate bleeds presenting at 150 to 220; avoid going below 130. Many exam options read "about 140" or "140 to 160".</li>
<li>Surgery: cerebellar bleed that is large (over about 3 cm) or causes brainstem compression or hydrocephalus; other sites selectively.</li>
</ul>
<h4 class="deck-topic">Traumatic collections</h4>
<div class="deck-block deck-tbl"><table><thead><tr><th>Epidural</th><th>Subdural</th></tr></thead><tbody>
<tr><td>Usually middle meningeal artery with skull fracture; lucid interval; <b>lens-shaped</b>, limited by sutures</td><td>Bridging veins; elderly, alcohol, anticoagulants; <b>crescent</b>, crosses sutures; may be slow</td></tr>
</tbody></table></div>
<p>Expanding collection with falling consciousness or focal signs: <b>urgent evacuation</b>.</p>
<h4 class="deck-topic">Raised intracranial pressure</h4>
<p>Head up 30 degrees, airway and oxygenation, avoid hypotension, mannitol or hypertonic saline, brief hyperventilation only as a bridge to definitive treatment. Cushing triad (high pressure, slow pulse, irregular breathing) is late.</p>
<div class="sum-key"><span class="sum-key-title">نقاط امتحانية</span><ul>
<li>Sudden worst headache: CT without contrast first.</li>
<li>After CT shows subarachnoid blood: CT angiography.</li>
<li>Commonest hypertensive bleed site: basal ganglia.</li>
<li>Child with epidural haematoma and weakness: evacuate.</li>
</ul></div>`,
            questions: [
                {
                    "q": "A weightlifter presents with the worst headache of his life and vomiting. What is the most appropriate management?",
                    "options": [
                        "CT angiogram",
                        "CT without contrast"
                    ],
                    "answer": 1,
                    "explanation": "Worst headache of life goes straight to non-contrast CT; angiography is for locating the aneurysm after blood is confirmed, and a negative CT with a convincing story means lumbar puncture.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A patient came to the ER after losing consciousness; after regaining it, he experiences a severe headache, describing it as the worst headache he has ever had. Plain CT shows subarachnoid hemorrhage and hydrocephalus. How would you investigate the affected artery?",
                    "options": [
                        "MRI with contrast",
                        "Lumbar puncture",
                        "CT angiography",
                        "Transcranial Doppler ultrasound"
                    ],
                    "answer": 2,
                    "explanation": "Once subarachnoid hemorrhage is already confirmed on non-contrast CT, CT angiography is used to localize the source, such as a ruptured aneurysm, and guide further management; lumbar puncture is reserved for cases where CT is negative or inconclusive but SAH is still suspected, which is not the case here.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A 75-year-old man presents with headache, slurred speech and left-sided weakness. BP 165/95. CT shows a thalamic hematoma. What is the most appropriate management to prevent extension of the hematoma?",
                    "options": [
                        "Emergent surgical evacuation",
                        "High flow oxygen",
                        "Head elevation",
                        "reduce systolic BP to 140"
                    ],
                    "answer": 3,
                    "explanation": "In acute intracerebral haemorrhage the measure that limits haematoma expansion is early blood pressure lowering to a systolic of about 140 mmHg; deep thalamic bleeds are not operated on.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A child fell down and he became sleepy and started to vomit. Upon examination there is swelling on the head, leftsided weakness CT showed: epidural hematoma What is “the best management” ?",
                    "options": [
                        "Hematoma evacuation",
                        "Intubation and secure the airway",
                        "Admit for observation",
                        "MRI"
                    ],
                    "answer": 0,
                    "explanation": "Core Concept: An Epidural Hematoma (EDH) is an accumulation of blood between the skull and the dura mater, typically caused by the rupture of the middle meningeal artery following temporal bone trauma. Clinical Presentation: · Classic 'lucid interval' followed by rapid neurological deterioration, headache, vomiting, altered consciousness (sleepy/drowsy), and focal neurological deficits (e.g., contralateral hemiparesis) due to brain compression and herniation. · Complications: Uncal herniation, brainstem compression, and death. Diagnosis: · First-line & Gold Standard: Non-contrast CT scan of the head, revealing a biconvex (lens-shaped) hyperdense extra-axial collection that does not cross suture lines. Management: · Acute: While securing the ABCs (Airway, Breathing, Circulation) is always the immediate first step in any trauma, the definitive and 'best' specific management for a symptomatic, space-occupying EDH causing focal deficits and depressed consciousness is emergent surgical hematoma evacuation (craniotomy) to relieve intracranial pressure. · Long-term/definitive: Post-operative neurocritical care, seizure prophylaxis, and neurorehabilitation.",
                    "source": "SMLE bank"
                }
            ],
        },
        {
            id: "nrl-cns-infection",
            title: "05 — Meningitis & Encephalitis",
            title_en: "CSF patterns · empiric therapy · HSV · prophylaxis",
            summaryHtml: `
<p>Fever, headache and neck stiffness suggest meningitis; <b>behaviour change, confusion, seizures or focal signs</b> suggest encephalitis. <b>Kernig</b>: pain resisting knee extension with the hip flexed. <b>Brudzinski</b>: flexing the neck makes the hips and knees flex. A negative sign does not exclude disease.</p>
<div class="sum-algo"><span class="sum-algo-title">Do not delay treatment</span><ol>
<li>Blood cultures.</li>
<li>CT before lumbar puncture if: immunocompromise, known CNS disease, new seizure, papilloedema, focal deficit or reduced consciousness.</li>
<li>If the puncture will be delayed, give treatment first.</li>
<li>Adults: <b>dexamethasone</b> with or just before the first antibiotic, plus <b>ceftriaxone and vancomycin</b>. Add <b>ampicillin</b> for Listeria cover if over about 50, pregnant or immunocompromised.</li>
<li>Possible encephalitis: add IV <b>aciclovir</b>.</li>
</ol></div>
<div class="deck-block deck-tbl"><table><thead><tr><th>CSF</th><th>Cells</th><th>Glucose</th><th>Protein</th></tr></thead><tbody>
<tr><td>Bacterial</td><td>Neutrophils, high; cloudy</td><td>Low</td><td>High</td></tr>
<tr><td>Viral</td><td>Lymphocytes</td><td>Usually normal</td><td>Normal or mildly high</td></tr>
<tr><td>Tuberculous</td><td>Lymphocytes</td><td>Low</td><td>High, often very</td></tr>
<tr><td>Fungal</td><td>Lymphocytes</td><td>Low</td><td>High; high opening pressure</td></tr>
</tbody></table></div>
<ul>
<li>Pneumococcus is the leading cause of adult bacterial meningitis.</li>
<li><b>HSV encephalitis</b>: <b>temporal lobe</b> changes on MRI; CSF lymphocytes, sometimes red cells; send HSV PCR and start <b>aciclovir</b> without waiting. An early negative test with strong suspicion may need repeating.</li>
<li><b>Tuberculous</b>: weeks of fever and headache, cranial nerve palsy; anti-TB therapy <b>plus steroid</b>.</li>
</ul>
<h4 class="deck-topic">Meningococcus</h4>
<ul>
<li>Gram-negative diplococcus; purpuric rash and shock.</li>
<li><b>Droplet precautions</b> until about 24 hours of effective antibiotics.</li>
<li><b>Chemoprophylaxis</b> promptly for household and close contacts and staff exposed to respiratory secretions: rifampicin, ciprofloxacin or ceftriaxone (consider resistance, age, pregnancy).</li>
<li>Pilgrims: quadrivalent ACWY vaccine at least <b>10 days before</b> travel for Hajj; follow the current Saudi Ministry of Health rules.</li>
</ul>
<div class="sum-key"><span class="sum-key-title">نقاط امتحانية</span><ul>
<li>Fever with confusion and temporal changes: aciclovir.</li>
<li>Bacterial meningitis empiric core: ceftriaxone plus vancomycin.</li>
<li>Subacute illness, low glucose, lymphocytes: think TB.</li>
<li>Meningococcal contacts need prophylaxis.</li>
</ul></div>`,
            questions: [
                {
                    "q": "A 22-year-old man recently returned from Umrah presents with 1 day of fever and headache, then develops seizures on the right extremities. He has a positive Kernig's sign. Temperature is 39°C. CSF analysis shows elevated cells and protein, with a differential of 87% neutrophils and 5% lymphocytes. Which of the following is the most appropriate intravenous treatment?",
                    "options": [
                        "Ceftriaxone, vancomycin, and steroid",
                        "Ceftriaxone and vancomycin",
                        "Ceftriaxone and IV acyclovir",
                        "Acyclovir and steroid"
                    ],
                    "answer": 1,
                    "explanation": "A neutrophil-predominant CSF pattern with an acute 1-day onset, especially with a history of recent mass gathering travel such as Umrah, is classic for acute bacterial meningitis; empiric ceftriaxone plus vancomycin covers the likely pathogens including resistant pneumococcus.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A 22-year-old man presents with 4 days of fever, headache, and confusion, with a positive Kernig's sign. Temperature is 39°C. CSF analysis shows elevated cells and protein, with a differential of 5% neutrophils and 90% lymphocytes. Which of the following is the most appropriate intravenous treatment?",
                    "options": [
                        "Ceftriaxone, vancomycin, and steroid",
                        "Ceftriaxone and vancomycin",
                        "Ceftriaxone",
                        "Acyclovir"
                    ],
                    "answer": 3,
                    "explanation": "A lymphocyte-predominant CSF pattern over a several-day course of fever, headache, and confusion argues against acute bacterial meningitis (which is typically neutrophil-predominant) and instead favors viral meningoencephalitis such as HSV, for which empiric acyclovir is the appropriate treatment.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A patient is admitted with meningococcal meningitis. The family asks what should be done to protect the household contacts who live with the patient. Which of the following is the most appropriate action?",
                    "options": [
                        "Isolate the patient",
                        "Give chemoprophylaxis to the contacts",
                        "Treat the patient",
                        "None"
                    ],
                    "answer": 1,
                    "explanation": "Household and respiratory-secretion contacts of meningococcal disease need chemoprophylaxis within 24 hours - ciprofloxacin single dose, rifampicin for two days, or ceftriaxone in pregnancy. Isolating or treating the index patient protects the ward and the patient, not the people already exposed at home.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A patient with meningitis undergoes passive flexion of the neck by the doctor, which causes involuntary flexion of the hips and knees while supine. What is this sign called?",
                    "options": [
                        "Kernig sign",
                        "Chvostek sign",
                        "Babinski sign",
                        "Brudzinski sign"
                    ],
                    "answer": 3,
                    "explanation": "Brudzinski's sign is elicited by passively flexing the patient's neck, which causes involuntary flexion of the hips and knees, and is a classic sign of meningeal irritation, as seen in meningitis.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A 60-year-old man from India presented to the Emergency Department with headache and low-grade fever for 3-weeks. The headache became worse over the last 2-days and was associated with vomiting. In the emergency room, he developed generalized seizures (see lab results and reports), Test Result Normal Values WBC 19 4.5-10.5 x 109/L Pressure 280 200-250 mmH20 (Male) 300-400 mmH20 (Female) Cells 380 0-3 /ML Total protein (Men) 3 0.22-0.33 g/L Glucose 1.2 2.50-3.89 mmol/L CSF differential WBC count: 73% lymphocytes and 13 % neutrophils. CSF culture: Pending. Which of the following is the most likely diagnosis?",
                    "options": [
                        "Neurocysticercosis",
                        "Tuberculous meningitis",
                        "Bacterial meningitis",
                        "Viral meningitis"
                    ],
                    "answer": 1,
                    "explanation": "- Core Concept: Tuberculous (TB) meningitis is a severe, subacute form of extrapulmonary tuberculosis affecting the meninges, typically characterized by basilar meningeal inflammation and cranial nerve involvement. · Clinical Presentation: - *Symptoms:* Subacute/chronic headache, low-grade fever, neck stiffness, vomiting, altered mental status, and seizures. - *Complications:* Hydrocephalus, cranial nerve palsies, stroke, and severe neurological deficits. · Diagnosis: First-line is neuroimaging (CT/MRI) showing basilar exudates and hydrocephalus, followed by lumbar puncture. CSF analysis classically shows lymphocytic pleocytosis, high protein, and low glucose. The gold standard for definitive diagnosis is CSF mycobacterial culture or PCR. · Management: Acute management requires immediate initiation of empiric anti-TB therapy (RIPE regimen) and adjunctive corticosteroids (dexamethasone) to reduce inflammation and mortality. Definitive management is completing a prolonged course (9-12 months) of anti-TB drugs.",
                    "source": "SMLE bank"
                }
            ],
        },
        {
            id: "nrl-seizures",
            title: "06 — Seizures & Status Epilepticus",
            title_en: "First seizure · timed protocol · syndromes · drug choice",
            summaryHtml: `
<h4 class="deck-topic">First seizure</h4>
<ul>
<li>Immediately: <b>glucose</b> and electrolytes (sodium, calcium, magnesium), vital signs.</li>
<li>Look for provokers: drugs, alcohol withdrawal, infection, trauma, pregnancy.</li>
<li>Adult first unprovoked seizure: brain imaging (CT in emergencies, MRI preferred electively) and EEG.</li>
<li>Mimics: syncope, hypoglycaemia, functional attacks.</li>
</ul>
<div class="sum-algo"><span class="sum-algo-title">Status epilepticus: 5 minutes or more, or repeated without recovery</span><ol>
<li>Airway, oxygen, IV access, glucose (thiamine first or with it if deficiency is possible).</li>
<li><b>Benzodiazepine</b> in full dose: IV lorazepam or diazepam, or IM midazolam.</li>
<li>Still seizing: IV <b>levetiracetam, fosphenytoin (or phenytoin) or valproate</b>.</li>
<li>Refractory: intensive care, anaesthetic infusion and continuous EEG.</li>
</ol></div>
<p>Under-dosing the benzodiazepine is a common error. Persisting coma after movements stop needs EEG.</p>
<div class="deck-block deck-tbl"><table><thead><tr><th>Seizure type</th><th>Features</th><th>Drug direction</th></tr></thead><tbody>
<tr><td>Focal impaired awareness (often <b>temporal</b>)</td><td>Warning sensation, staring, <b>lip smacking</b>, picking, confusion afterwards</td><td>Lamotrigine or levetiracetam; carbamazepine</td></tr>
<tr><td>Childhood <b>absence</b></td><td>Brief blank spells with immediate return; <b>3 Hz spike-and-wave</b>, provoked by hyperventilation</td><td><b>Ethosuximide</b>; valproate if other types coexist</td></tr>
<tr><td>Myoclonic</td><td>Brief jerks; juvenile form on waking</td><td>Valproate or levetiracetam depending on patient</td></tr>
<tr><td>Generalised tonic-clonic</td><td>Loss of consciousness, post-ictal phase</td><td>Valproate, lamotrigine or levetiracetam depending on patient</td></tr>
</tbody></table></div>
<ul>
<li>Carbamazepine can <b>worsen absence and myoclonic</b> seizures.</li>
<li>Persisting seizures: check adherence, triggers, diagnosis and interactions; <b>optimise the dose</b> of one suitable drug as tolerated before switching or combining.</li>
<li><b>Valproate</b> is avoided where possible in anyone who could become pregnant. Plan pregnancy, give folic acid, and do not stop therapy abruptly.</li>
<li>Counsel on driving, swimming, heights and sleep.</li>
</ul>
<div class="sum-key"><span class="sum-key-title">نقاط امتحانية</span><ul>
<li>Status epilepticus: benzodiazepine first.</li>
<li>First step after a new seizure: check glucose and electrolytes.</li>
<li>Automatisms with confusion: temporal lobe origin.</li>
<li>Child with brief staring and instant recovery: absence.</li>
</ul></div>`,
            questions: [
                {
                    "q": "An adult man with a history of epilepsy has three seizures in a row without regaining consciousness in between. What should be given?",
                    "options": [
                        "Sodium valproate",
                        "Benzodiazepines"
                    ],
                    "answer": 1,
                    "explanation": "Recurrent seizures without recovery of consciousness between them define status epilepticus, a neurological emergency requiring immediate treatment with a benzodiazepine, followed by a longer-acting antiepileptic such as sodium valproate to prevent recurrence.",
                    "source": "SMLE recall"
                },
                {
                    "q": "34 yearold male, medically free, brought by his wife for first onset tonic clonic seizure that lasted 3 minutes. No history of trauma. What is the initial management?",
                    "options": [
                        "Electrolytes and glucose",
                        "Eeg",
                        "Brain MRI",
                        "Unrelated/ maybe chest CT (wasnt brain)"
                    ],
                    "answer": 0,
                    "explanation": "First seizure: glucose and electrolytes first. Provoked seizures are not epilepsy.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A 30-year-old man is brought by his family because of behavioral changes. He has episodes of emotional lability, lip smacking, and grimacing. Sometimes, following these episodes, he becomes agitated. What is the most likely diagnosis?",
                    "options": [
                        "Temporal lobe epilepsy",
                        "Absence seizure",
                        "Amnesia",
                        "Other"
                    ],
                    "answer": 0,
                    "explanation": "Episodes with lip smacking, grimacing (automatisms) and emotional changes, sometimes followed by agitation, are typical of focal impaired-awareness seizures from the temporal lobe. Absence seizures are very brief, mainly in children, and end without post-ictal agitation. Amnesia is a symptom rather than a diagnosis. Evaluate with EEG and MRI.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A 6 years old was brought by his parents with history of sudden abrupt loss of environmental awareness with lip smacking followed by sudden return to normal baseline. Brain Imaging= Normal, EEG= 3-Hz spikes. Which of the following is the most appropriate diagnosis?",
                    "options": [
                        "complicated febrile seizure",
                        "Absence seizure",
                        "Infantile spasm",
                        "Cerebral Palsy"
                    ],
                    "answer": 1,
                    "explanation": "Core Concept: Childhood Absence Epilepsy, a type of generalized seizure disorder. Clinical Presentation: · Brief (5-10 seconds) staring spells with abrupt onset and offset. · Automatisms (e.g., lip smacking, chewing motions) may occur. · No post-ictal confusion; the child immediately returns to baseline activity. Diagnosis: · First-line/Gold Standard: Electroencephalogram (EEG) showing the classic, pathognomonic 3-Hertz (3 per second) generalized spike-and-wave discharges. Hyperventilation during the EEG often provokes the seizure. Management: · Acute/Definitive management: Ethosuximide is the first-line medication of choice for isolated absence seizures. Valproic acid is an alternative if the patient also has generalized tonic-clonic seizures.",
                    "source": "SMLE bank"
                },
                {
                    "q": "A patient on carbamazepine 600 mg BID still has 1-2 seizure episodes monthly. The carbamazepine level is 40 (normal range 20-50). What is the next step in management?",
                    "options": [
                        "Increase dose to 800 BID",
                        "Add lamotrigine 100 mg"
                    ],
                    "answer": 0,
                    "explanation": "Optimise monotherapy to the maximum tolerated dose or the top of the therapeutic range before adding a second antiepileptic - a mid-range level with ongoing seizures means room to titrate, not failure.",
                    "source": "SMLE recall"
                }
            ],
        },
        {
            id: "nrl-ms",
            title: "07 — Multiple Sclerosis",
            title_en: "Space and time · eye signs · relapse · long-term therapy",
            summaryHtml: `
<p>Immune demyelination of the central nervous system, more common in young women. Diagnosis rests on lesions separated in <b>space</b> and, classically, in <b>time</b> (McDonald criteria, which have been revised to allow more imaging and CSF evidence), with other causes excluded.</p>
<h4 class="deck-topic">Presentations</h4>
<ul>
<li><b>Optic neuritis</b>: painful loss of vision in one eye over days, reduced colour vision, relative afferent pupil defect.</li>
<li>Sensory or motor symptoms, <b>partial myelitis</b>, bladder symptoms.</li>
<li><b>Lhermitte sign</b>: electric feeling down the back on neck flexion.</li>
<li>Brainstem and cerebellum: diplopia, ataxia, vertigo.</li>
<li><b>Internuclear ophthalmoplegia</b>: one eye fails to adduct while the other, abducting eye has nystagmus. Lesion is in the <b>medial longitudinal fasciculus</b> on the side of the eye that cannot adduct. Bilateral cases in a young adult strongly suggest MS.</li>
<li><b>Uhthoff phenomenon</b>: old symptoms worsen with heat, exercise or fever because conduction fails in demyelinated fibres; it settles with cooling and is not a new relapse.</li>
</ul>
<h4 class="deck-topic">Tests</h4>
<ul>
<li><b>MRI brain and spinal cord</b>, the key test: periventricular, cortical or juxtacortical, infratentorial and cord lesions.</li>
<li>Gadolinium enhancement indicates active lesions; old and new lesions together support dissemination in time. A <b>new lesion on follow-up MRI</b> does too.</li>
<li>CSF <b>oligoclonal bands</b> not found in serum.</li>
<li>Check mimics: B12 lack, neuromyelitis optica and MOG antibody disease, lupus, infection.</li>
</ul>
<h4 class="deck-topic">Relapse</h4>
<p>New or worse neurological symptoms lasting more than 24 hours, without fever or infection.</p>
<div class="sum-algo"><span class="sum-algo-title">Suspected relapse</span><ol>
<li>Exclude infection (especially urine) and heat effect.</li>
<li>Disabling relapse: <b>high-dose methylprednisolone</b> (commonly 1 g daily for 3 to 5 days). It speeds recovery but does not clearly change long-term disability.</li>
<li>Severe and steroid-unresponsive: <b>plasma exchange</b>.</li>
</ol></div>
<h4 class="deck-topic">Long term</h4>
<ul>
<li><b>Disease-modifying therapy</b> started early reduces relapses and new lesions. Steroids are not maintenance therapy.</li>
<li>Check pregnancy plans and infection risk before choosing; teriflunomide is not used in pregnancy. Natalizumab carries PML risk.</li>
<li>Treat spasticity, fatigue, bladder and mood problems.</li>
</ul>
<div class="sum-key"><span class="sum-key-title">نقاط امتحانية</span><ul>
<li>Failed adduction with abducting nystagmus: medial longitudinal fasciculus.</li>
<li>Heat-related worsening: Uhthoff phenomenon.</li>
<li>CSF support: oligoclonal bands.</li>
<li>Disabling relapse with active lesion: IV methylprednisolone.</li>
</ul></div>`,
            questions: [
                {
                    "q": "Patient with MS come with UL weakness, diplopia Left eye not go medially , Nystagmus in right eye when abduction where is the site of lesion?",
                    "options": [
                        "Lateral thalamic nuclei",
                        "Abducens nerve nucleus",
                        "Frontal lobe",
                        "medial longitudinal fasciculus"
                    ],
                    "answer": 3,
                    "explanation": "INO = impaired adduction + nystagmus in the abducting eye = MLF lesion. In a young adult, think MS.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A patient presents with numbness, and MRI of the brain shows white matter demyelinating lesions (sclerosis). Which of the following will support the diagnosis of multiple sclerosis?",
                    "options": [
                        "CSF oligoclonal band",
                        "Nerve conduction study",
                        "Brain biopsy",
                        "Viral serology"
                    ],
                    "answer": 0,
                    "explanation": "Multiple sclerosis support: CSF OLIGOCLONAL BANDS (intrathecal IgG, present in CSF not serum — 85-95% of MS). MRI: periventricular/juxtacortical/infratentorial/spinal cord plaques (Dawson's fingers), gadolinium enhancement = active. Visual evoked potentials (delayed). McDonald criteria: dissemination in space + time. Nerve conduction studies are for PERIPHERAL neuropathy (normal in MS — a central/CNS disease).",
                    "source": "SMLE recall"
                },
                {
                    "q": "A patient with relapsing-remitting multiple sclerosis presents with sudden-onset left arm weakness (power 4/5). Labs are normal. Brain scan shows a 4 mm gadolinium-enhancing lesion and a stable hyperintense lesion. What is the most appropriate management?",
                    "options": [
                        "Observation",
                        "Change to biologic",
                        "High dose methylprednisolone",
                        "Add [not recalled]"
                    ],
                    "answer": 2,
                    "explanation": "A new deficit with a new gadolinium-enhancing lesion in MS is an acute relapse - treat with high-dose IV methylprednisolone, and reconsider disease-modifying therapy separately once the attack is over.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A 25-year-old woman with multiple sclerosis, in remission on teriflunomide, reports transient worsening of her symptoms when exposed to heat. What is the explanation for her symptoms?",
                    "options": [
                        "Relapse of MS",
                        "Lhermitte sign",
                        "Uhthoff phenomenon",
                        "Acute disseminated encephalomyelitis (ADEM)"
                    ],
                    "answer": 2,
                    "explanation": "Uhthoff phenomenon is the well-known temporary worsening of MS symptoms with increased body temperature due to temperature-sensitive conduction in demyelinated axons, distinct from a true relapse involving new inflammatory activity.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A 22-year-old patient has had symptoms suggestive of multiple sclerosis (pain on eye movement and tingling in an upper limb) for 4 months and is now asymptomatic. What is the initial diagnostic test?",
                    "options": [
                        "CSF analysis",
                        "MRI spine and brain",
                        "CT brain"
                    ],
                    "answer": 1,
                    "explanation": "Multiple sclerosis is primarily a clinical diagnosis supported by MRI of the brain and spine, which can demonstrate lesions disseminated in time and space; cerebrospinal fluid analysis is reserved for cases where the clinical history and MRI findings are equivocal, not as the initial test.",
                    "source": "SMLE recall"
                }
            ],
        },
        {
            id: "nrl-cord-neuromuscular",
            title: "08 — Spinal Cord & Neuromuscular Emergencies",
            title_en: "Compression · Guillain-Barre · myasthenia · neuropathy",
            summaryHtml: `
<h4 class="deck-topic">Localise the weakness</h4>
<div class="deck-block deck-tbl"><table><thead><tr><th>Level</th><th>Clues</th></tr></thead><tbody>
<tr><td>Spinal cord</td><td><b>Sensory level</b>, bladder and bowel problems, upper motor neuron signs below (early shock may be flaccid)</td></tr>
<tr><td>Cauda equina</td><td>Saddle anaesthesia, retention, lower motor neuron leg signs</td></tr>
<tr><td>Peripheral nerve</td><td>Reduced reflexes, distal sensory loss</td></tr>
<tr><td>Neuromuscular junction</td><td>Fatigable weakness, normal sensation</td></tr>
<tr><td>Muscle</td><td>Proximal weakness, normal sensation, CK often raised</td></tr>
</tbody></table></div>
<h4 class="deck-topic">Cord compression</h4>
<ul>
<li>Causes: metastasis (prostate, breast, lung, myeloma), disc, abscess, haematoma, trauma.</li>
<li>Back pain, worse lying down or at night, then weakness and sensory level.</li>
<li><b>Urgent MRI of the whole spine</b>.</li>
<li>Suspected malignant compression: give <b>IV dexamethasone</b> immediately while arranging MRI, then surgery or radiotherapy with oncology. If lymphoma is possible and tissue is not yet obtained, discuss before steroids.</li>
<li>Neurological function at treatment predicts outcome.</li>
</ul>
<p>With a sensory level and no compression on MRI, think <b>transverse myelitis</b>: lumbar puncture and antibody tests.</p>
<h4 class="deck-topic">Guillain-Barre syndrome</h4>
<ul>
<li>Rapid, roughly symmetrical weakness, often ascending, with <b>reduced or absent reflexes</b>, after gut or respiratory infection (<i>Campylobacter</i> is classic). Autonomic instability.</li>
<li>CSF: <b>high protein with few cells</b>; may be normal in the first week.</li>
<li>Monitor <b>vital capacity</b>, swallow and heart rhythm; falling values (vital capacity near 20 mL/kg) mean intensive care and likely ventilation.</li>
<li>Treat with <b>IV immunoglobulin or plasma exchange</b>. Steroids do not help.</li>
</ul>
<h4 class="deck-topic">Myasthenia gravis</h4>
<ul>
<li>Fatigable ptosis, diplopia, bulbar and proximal weakness; reflexes preserved.</li>
<li>Acetylcholine receptor or MuSK antibodies; chest imaging for <b>thymoma</b>.</li>
<li>Pyridostigmine plus immunotherapy. <b>Crisis</b> (breathing failure): airway support and IVIG or plasma exchange.</li>
<li>Triggers: infection, aminoglycosides, fluoroquinolones, IV magnesium.</li>
</ul>
<h4 class="deck-topic">Practical points</h4>
<ul>
<li>Painless ulcer at a pressure point, warm foot, good pulses: <b>neuropathic</b> pattern.</li>
<li>A walking stick goes in the hand <b>opposite</b> the painful or weak leg.</li>
</ul>
<div class="sum-key"><span class="sum-key-title">نقاط امتحانية</span><ul>
<li>Sensory level with retention: urgent spine MRI.</li>
<li>Known cancer with compression signs: dexamethasone at once.</li>
<li>Guillain-Barre: IVIG or plasma exchange.</li>
<li>Left hip arthritis: cane in the right hand.</li>
</ul></div>`,
            questions: [
                {
                    "q": "A 60-year-old man with prostate cancer presents with lower back pain, gradual bilateral lower-limb weakness, urinary incontinence and a sensory level at T8. What is the most appropriate next step?",
                    "options": [
                        "IV dexamethasone (then urgent MRI)",
                        "Analgesia only",
                        "Discharge and schedule outpatient MRI"
                    ],
                    "answer": 0,
                    "explanation": "Metastatic cord compression: dexamethasone immediately + urgent whole-spine MRI + radiotherapy/surgery within 24 hours. Pain worse lying flat or at night precedes neurology. Commonest primaries: prostate, breast, lung, myeloma, renal.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A patient presents with lower limb weakness, back pain, and urinary incontinence, with a T10 sensory level on examination. What is the most appropriate test to diagnose the cause?",
                    "options": [
                        "MRI spine",
                        "CT spine",
                        "Urine culture"
                    ],
                    "answer": 0,
                    "explanation": "A sensory level with lower limb weakness and urinary incontinence indicates a spinal cord lesion at that level; MRI of the spine is the most appropriate test to visualize the spinal cord directly and identify the underlying cause, such as compression, transverse myelitis, or an abscess.",
                    "source": "SMLE recall"
                },
                {
                    "q": "68 years old came to the er with 3 days history of bilateral leg weakness and brisk movements reflexes in both legs, with urine retention and inability to walk and sensory level of T10 What is the diagnosis?",
                    "options": [
                        "Transverse myelitis",
                        "GBS",
                        "Cauda equina syndrome",
                        "Cord compression"
                    ],
                    "answer": 3,
                    "explanation": "Sensory LEVEL + UMN signs + retention = CORD lesion. Brisk reflexes exclude GBS and cauda equina (both LMN). In the elderly, exclude COMPRESSION first with urgent MRI.",
                    "source": "SMLE recall"
                },
                {
                    "q": "In a patient with Guillain Barre Syndrome, which of the following is the best treatment option?",
                    "options": [
                        "Pulse steroid",
                        "Cyclosporine",
                        "Plasmapheresis",
                        "Cyclophosphamide"
                    ],
                    "answer": 2,
                    "explanation": "Core Concept: Guillain-Barré Syndrome (GBS). Clinical Presentation: · Ascending, symmetric muscle weakness and areflexia. · Autonomic dysfunction and possible respiratory failure. Diagnosis: · First-line: Lumbar puncture showing albuminocytologic dissociation (elevated protein with normal WBC count). · Gold standard: Nerve conduction studies/EMG showing demyelination. Management: · Acute: IV Immunoglobulin (IVIG) or Plasmapheresis (plasma exchange). Corticosteroids are NOT recommended. · Long-term: Supportive care, DVT prophylaxis, monitoring of vital capacity, and physical rehabilitation.",
                    "source": "SMLE bank"
                },
                {
                    "q": "A 75-year-old man with difficulty walking and left-sided leg weaknesses due to osteoarthritis of the hip. In which hand should a cane be used by this patient?",
                    "options": [
                        "Left hand",
                        "Right hand",
                        "Either hand",
                        "Both hands simultaneously"
                    ],
                    "answer": 1,
                    "explanation": "Core Concept: Proper use of assistive devices like a cane is crucial for maintaining balance, reducing joint loading, and preventing falls in patients with unilateral lower extremity weakness or pain. Clinical Presentation: · Antalgic gait (limping to avoid pain) · Decreased stance phase on the affected side · Difficulty with weight-bearing and increased risk of falls Diagnosis: · First-line diagnostic plan: Clinical observation of gait and functional mobility. · Gold standard: Comprehensive physical therapy assessment to determine exact biomechanical needs and proper device fitting. Management: · Acute management: Pain control and immediate fall prevention strategies. · Gold standard long-term management: Physical therapy for strengthening and proper training in assistive device use. A cane must be held in the hand contralateral (opposite) to the affected/weak leg (in this case, the right hand for a left-sided leg weakness) to widen the base of support and shift weight away from the affected hip during the stance phase.",
                    "source": "SMLE bank"
                }
            ],
        },
        {
            id: "nrl-dementia",
            title: "09 — Dementia & Delirium",
            title_en: "Telling types apart · work-up · drugs · safety",
            summaryHtml: `
<div class="deck-block deck-tbl"><table><thead><tr><th>Feature</th><th>Delirium</th><th>Dementia</th></tr></thead><tbody>
<tr><td>Onset</td><td>Hours to days, fluctuating</td><td>Months to years</td></tr>
<tr><td>Attention and consciousness</td><td><b>Disturbed</b></td><td>Usually preserved until late</td></tr>
<tr><td>Action</td><td>Urgently find the cause: infection, drugs, metabolic, hypoxia, retention, pain, withdrawal</td><td>Structured assessment and support</td></tr>
</tbody></table></div>
<p><b>Work-up</b> for new cognitive decline: history from family, cognitive test, function, medicines, depression screen, <b>B12, thyroid</b>, basic bloods and brain imaging.</p>
<div class="deck-block deck-tbl"><table><thead><tr><th>Type</th><th>Pattern</th></tr></thead><tbody>
<tr><td><b>Alzheimer</b></td><td>Gradual recent-memory loss first, then language and daily skills; medial temporal (hippocampal) atrophy</td></tr>
<tr><td>Vascular</td><td>Vascular risks, stepwise or patchy decline, executive problems, focal signs</td></tr>
<tr><td><b>Lewy body</b></td><td>Fluctuation, detailed <b>visual hallucinations</b>, parkinsonism, dream enactment, falls</td></tr>
<tr><td><b>Frontotemporal</b></td><td>Younger onset; <b>personality, behaviour or language</b> change before memory</td></tr>
<tr><td>Normal pressure hydrocephalus</td><td>Gait disturbance, urinary incontinence, cognitive decline; large ventricles</td></tr>
</tbody></table></div>
<p>Parkinson disease dementia: motor disease comes at least a year before dementia. Normal ageing forgetfulness does not impair independence.</p>
<h4 class="deck-topic">Medicines</h4>
<ul>
<li><b>Cholinesterase inhibitors</b> (donepezil, rivastigmine, galantamine): Alzheimer disease; watch for nausea, bradycardia, syncope. Rivastigmine and donepezil are used in Lewy body disease.</li>
<li><b>Memantine</b>: moderate to severe Alzheimer disease. When disease progresses on donepezil, guidelines commonly <b>add</b> memantine if the first drug is tolerated; switch if it is not.</li>
<li>These help symptoms; they do not cure.</li>
<li>They are not useful for typical frontotemporal dementia.</li>
</ul>
<h4 class="deck-topic">Behaviour and safety</h4>
<ul>
<li>First look for pain, infection, constipation, drugs and environmental triggers; use <b>non-drug measures</b> first: routine, distraction, reorientation, daylight activity.</li>
<li>Antipsychotics raise stroke and death risk; reserve for dangerous or very distressing symptoms. In <b>Lewy body</b> disease they can cause severe reactions.</li>
<li>Wandering: door alarms and motion sensors. Falls: good lighting and hazard removal.</li>
<li>Driving needs a formal assessment, including on the road where available.</li>
<li>Plan decisions early and support the carer.</li>
</ul>
<div class="sum-key"><span class="sum-key-title">نقاط امتحانية</span><ul>
<li>Altered consciousness favours delirium.</li>
<li>Hallucinations with parkinsonism and cognitive decline: Lewy body disease.</li>
<li>Early behaviour or language change: frontotemporal.</li>
<li>Progressing Alzheimer disease on donepezil: consider adding memantine.</li>
</ul></div>`,
            questions: [
                {
                    "q": "Which of the following is the main difference between delirium and dementia?",
                    "options": [
                        "Disturbance of consciousness",
                        "Multiple cognitive deficits",
                        "Memory impairment",
                        "Aphasia"
                    ],
                    "answer": 0,
                    "explanation": "Delirium is distinguished from dementia by a disturbance of consciousness/attention (acute, fluctuating, reversible) — whereas dementia is chronic, progressive cognitive decline with a clear level of consciousness until late. Delirium vs dementia → disturbance of consciousness.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A 78-year-old man has a 2-year history of slow, progressive memory decline. He can still perform some activities of daily living, including dressing and bathing. His personality has changed from kind and caring to having periods of agitation and aggression. Neurologic and musculoskeletal examination cannot be performed. Which of the following is the most likely diagnosis?",
                    "options": [
                        "Mixed dementia",
                        "Alzheimer's disease",
                        "Multi-infarct dementia",
                        "Major depressive disorder"
                    ],
                    "answer": 1,
                    "explanation": "A gradual, progressive decline in memory over years, with personality changes and behavioral symptoms such as agitation, in the absence of a stepwise course or focal neurological signs that would suggest vascular dementia, is characteristic of Alzheimer's disease.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A 65-year-old man presented with 6-month symptoms of Parkinsonism, early dementia. fluctuations in cognition and visual hallucinations. Which of the following is the most likely diagnosis?",
                    "options": [
                        "Parkinson disease",
                        "Alzheimer disease",
                        "Corticobasal syndrome",
                        "Dementia with Lewy bodies"
                    ],
                    "answer": 3,
                    "explanation": "Core Concept: Dementia with Lewy Bodies (DLB) is a progressive neurodegenerative disorder characterized by the abnormal accumulation of alpha-synuclein proteins (Lewy bodies) in the cortex and brainstem. Clinical Presentation: · Core features: Fluctuating cognition and alertness, recurrent and well-formed visual hallucinations, and spontaneous parkinsonism (bradykinesia, rigidity). · Supportive features: REM sleep behavior disorder and severe neuroleptic sensitivity. Diagnosis: · First-line: Detailed clinical history, neurologic examination, and cognitive testing (McKeith criteria). · Gold standard: DaTscan (dopamine transporter SPECT imaging) showing reduced striatal dopamine transporter uptake, or polysomnography confirming REM sleep without atonia. Management: · Acute/Symptomatic: Cholinesterase inhibitors (e.g., rivastigmine, donepezil) are first-line for cognitive and behavioral symptoms. · Definitive: Cautious use of low-dose levodopa for motor symptoms (often less effective than in Parkinson's disease). Avoid typical antipsychotics; use quetiapine or pimavanserin if psychosis requires treatment.",
                    "source": "SMLE bank"
                },
                {
                    "q": "A 42-year-old man comes to the clinic with his brother. The brother is concerned that he has been acting strangely over the past 4 months. In particular, he has been irritable and criticizes everyone at home. The changes were subtle at first but now arguments arise every other day. He has difficulty initiating conversation and even pauses halfway through sentences. There is no family history of note and he is not taking any medications. Which of the following is the most likely diagnosis?",
                    "options": [
                        "Alzheimer's disease",
                        "Vascular dementia",
                        "Huntington's disease",
                        "Frontotemporal dementia"
                    ],
                    "answer": 3,
                    "explanation": "Core Concept: Frontotemporal Dementia (FTD), specifically the behavioral variant (bvFTD), characterized by early and prominent changes in personality, social comportment, and language, with relative sparing of memory early in the disease. Clinical Presentation: · Early onset (typically < 65 years). · Behavioral changes: Apathy, disinhibition, irritability, loss of empathy, and hyperorality. · Language deficits: Primary progressive aphasia (hesitation, word-finding difficulties). Diagnosis: · First-line: Clinical neuropsychological evaluation demonstrating executive dysfunction with preserved visuospatial skills. · Gold Standard: MRI of the brain showing asymmetric or symmetric frontal and/or temporal lobe atrophy. FDG-PET scan can confirm hypometabolism in these specific regions. Management: · Acute management: Low-dose atypical antipsychotics or SSRIs may be used off-label to manage severe behavioral disturbances, irritability, or compulsions. · Long-term/Definitive management: No disease-modifying therapies exist. Management relies heavily on caregiver support, environmental behavioral modifications, and speech-language therapy for language variants.",
                    "source": "SMLE bank"
                },
                {
                    "q": "A patient with Alzheimer's disease has been on donepezil for 6 months with no improvement. Her MMSE was 19 six months ago and is now 12. MRI shows hippocampal atrophy. What is the next best step in management?",
                    "options": [
                        "Add sertraline",
                        "Add memantine",
                        "Add rivastigmine",
                        "Switch donepezil to memantine"
                    ],
                    "answer": 1,
                    "explanation": "When a patient with progressing Alzheimer's disease continues to decline despite an adequate trial of a cholinesterase inhibitor like donepezil, memantine is added for moderate to severe disease rather than switching agents or adding a second cholinesterase inhibitor.",
                    "source": "SMLE recall"
                }
            ],
        },
        {
            id: "nrl-headache-movement",
            title: "10 — Headache, Facial Pain & Movement Disorders",
            title_en: "Red flags · migraine · neuralgia · Parkinson · Wilson",
            summaryHtml: `
<h4 class="deck-topic">Headache red flags</h4>
<p>Thunderclap onset, fever or neck stiffness, new deficit or seizure, papilloedema, new headache after about 50, cancer or immunosuppression, pregnancy, change with posture or straining, steadily progressive course.</p>
<div class="deck-block deck-tbl"><table><thead><tr><th>Type</th><th>Pattern</th><th>Treatment</th></tr></thead><tbody>
<tr><td>Migraine</td><td>Throbbing, nausea, light and sound sensitivity, worse with activity, with or without aura</td><td>Acute: NSAID or paracetamol, <b>triptan</b>. Prevention: propranolol, amitriptyline, topiramate, CGRP drugs</td></tr>
<tr><td>Tension</td><td>Bilateral band, mild to moderate</td><td>Simple analgesia, stress and sleep</td></tr>
<tr><td>Cluster</td><td>Severe one-sided orbital attacks, tearing, restlessness</td><td>High-flow oxygen, SC sumatriptan; verapamil prevention</td></tr>
</tbody></table></div>
<ul>
<li>Avoid triptans in coronary disease, stroke or uncontrolled hypertension.</li>
<li>Frequent painkillers cause medication-overuse headache.</li>
<li>Over 50 with scalp pain, jaw claudication or visual symptoms: <b>giant cell arteritis</b>; give steroid without waiting for biopsy.</li>
</ul>
<h4 class="deck-topic">Trigeminal neuralgia</h4>
<ul>
<li>Brief electric facial pain triggered by touch, chewing or brushing.</li>
<li>First drug: <b>carbamazepine</b> (or oxcarbazepine); check HLA-B*1502 where relevant to ancestry.</li>
<li><b>MRI with gadolinium</b> looks for MS, tumour or vessel compression, urgently with young age, sensory loss, weakness or bilateral pain.</li>
</ul>
<h4 class="deck-topic">Movement disorders</h4>
<ul>
<li><b>Parkinson disease</b>: bradykinesia with rest tremor and/or rigidity, usually asymmetric; loss of dopamine neurons in the <b>substantia nigra</b>. Levodopa with carbidopa is the most effective therapy.</li>
<li><b>Drug-induced parkinsonism</b>: dopamine receptor blockade by antipsychotics or metoclopramide. Review and change the drug with the prescriber.</li>
<li><b>Essential tremor</b>: action and postural tremor; propranolol or primidone.</li>
<li><b>Cerebellar</b>: intention tremor, dysmetria on the same side.</li>
</ul>
<h4 class="deck-topic">Wilson disease</h4>
<ul>
<li>Young person with liver disease plus tremor, dysarthria, abnormal movements or psychiatric change.</li>
<li><b>Low ceruloplasmin</b>, high urinary copper, <b>Kayser-Fleischer rings</b> on slit lamp.</li>
<li>Treat with chelation (penicillamine or trientine) or zinc, lifelong; screen siblings. Neurological symptoms can worsen early on penicillamine, so specialist monitoring matters.</li>
</ul>
<div class="sum-key"><span class="sum-key-title">نقاط امتحانية</span><ul>
<li>Acute migraine specific drug: triptan.</li>
<li>Facial neuralgia with limb weakness: MRI with gadolinium.</li>
<li>Parkinson disease site: substantia nigra.</li>
<li>Liver and movement disorder with corneal ring: Wilson disease.</li>
</ul></div>`,
            questions: [
                {
                    "q": "A middle-aged patient with migraine headaches asks about medication. What medication is used for acute attacks?",
                    "options": [
                        "Triptans",
                        "NSAIDs",
                        "SSRIs"
                    ],
                    "answer": 0,
                    "explanation": "Triptans are the classic, migraine-specific first-line abortive treatment for acute migraine attacks.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A 20-year-old woman presents with right upper-limb weakness and numbness for 1 week, associated with severe left facial pain, especially when brushing her teeth. What is the most appropriate investigation?",
                    "options": [
                        "Nerve conduction study",
                        "Lumbar puncture (LP)",
                        "CT brain with iodinated contrast",
                        "MRI brain with gadolinium contrast"
                    ],
                    "answer": 3,
                    "explanation": "A young woman with limb weakness and numbness plus trigeminal neuralgia suggests multiple sclerosis. MRI of the brain with gadolinium shows demyelinating plaques, distinguishes active from old lesions and excludes other causes. CT is insensitive, and lumbar puncture is supportive only.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A 55-year-old with resting tremor, bradykinesia, and shuing gait. Site of degeneration responsible?",
                    "options": [
                        "Basal ganglia",
                        "Cerebellum",
                        "Substantia nigra",
                        "Cerebral cortex"
                    ],
                    "answer": 2,
                    "explanation": "Parkinson disease is degeneration of the dopaminergic neurons of the substantia nigra pars compacta, with Lewy bodies as the histological hallmark and symptoms emerging after 60-80% neuronal loss. When a question offers both 'basal ganglia' and 'substantia nigra' it is testing precision - name the nucleus. A resting tremor is nigral; an intention tremor with ataxia is cerebellar.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A patient with schizophrenia treated with haloperidol subsequently develops rigidity, resting tremor, and bradykinesia. Which of the following is most likely responsible for these symptoms?",
                    "options": [
                        "Dopamine antagonism (blocking dopamine receptors)",
                        "Antipsychotic drug effect (nonspecific)"
                    ],
                    "answer": 0,
                    "explanation": "Antipsychotics such as haloperidol block dopamine D2 receptors in the nigrostriatal pathway, producing drug-induced parkinsonism, characterized by rigidity, tremor, and bradykinesia, similar to idiopathic Parkinson's disease.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A 20-year-old man with a history of high liver function test in the past presents, with tremors and dysarthria and dyskinesia. Slit-lamp examination reveals a greenish-brown ring at comeoscleral junction. Which of the following is the most likely diagnosis?",
                    "options": [
                        "Antitrypsin deficiency",
                        "Hepatic hemangioma",
                        "Hemochromatosis",
                        "Wilsons disease"
                    ],
                    "answer": 3,
                    "explanation": "Core Concept: Wilson's disease, an autosomal recessive disorder of copper metabolism (ATP7B gene mutation) leading to toxic copper accumulation in the liver, brain, and cornea. Clinical Presentation: · Classic symptoms: Hepatic (hepatitis, cirrhosis), Neurologic (tremor, dystonia, dysarthria, parkinsonism), Psychiatric (depression, personality changes), and Kayser-Fleischer rings. · Complications: Fulminant liver failure, irreversible neurological deficits, and renal tubular acidosis. Diagnosis: · Diagnostic algorithm: Screen with serum ceruloplasmin and 24-hour urinary copper, followed by an ophthalmologic exam and potentially a liver biopsy. · First-line diagnostic plan: Serum ceruloplasmin (typically low) and 24-hour urinary copper excretion (elevated). · Gold standard: Slit-lamp examination demonstrating Kayser-Fleischer rings (copper deposition in Descemet's membrane) and quantitative hepatic copper content on liver biopsy (>250 mcg/g dry weight). Management: · Acute management: Copper chelation therapy (D-penicillamine or trientine) to promote urinary copper excretion, and zinc supplementation (which interferes with intestinal copper absorption). · Long-term/Definitive management: Lifelong copper chelation/zinc therapy, strict dietary copper restriction, and liver transplantation for fulminant hepatic failure or end-stage cirrhosis.",
                    "source": "SMLE bank"
                }
            ],
        },
    ],
};

export default specialtyNeurology;
