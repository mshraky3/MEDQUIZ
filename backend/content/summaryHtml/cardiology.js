// Cardiology (medical). HTML served (gated) to the slide viewer.
export default `
<div class="sum-doc" dir="rtl">
  <div class="sum-head">
    <h2>أمراض القلب — ملخص عالي العائد</h2>
    <p class="sum-meta">للمراجعة الامتحانية.</p>
  </div>

  <section class="topic" id="crd-hypertension" dir="ltr">
    <h3>1. Hypertension</h3>
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
</ul></div>
  </section>

  <section class="topic" id="crd-acs" dir="ltr">
    <h3>2. Acute Coronary Syndromes: Decisions</h3>
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
</ul></div>
  </section>

  <section class="topic" id="crd-heart-failure" dir="ltr">
    <h3>3. Heart Failure</h3>
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
</ul></div>
  </section>

  <section class="topic" id="crd-af" dir="ltr">
    <h3>4. Atrial Fibrillation &amp; Anticoagulation</h3>
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
</ul></div>
  </section>

  <section class="topic" id="crd-valves" dir="ltr">
    <h3>5. Valves, Murmurs &amp; Endocarditis</h3>
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
</ul></div>
  </section>

  <section class="topic" id="crd-pericardium-aorta" dir="ltr">
    <h3>6. Pericardium &amp; Aorta</h3>
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
</ul></div>
  </section>

  <section class="topic" id="crd-shock" dir="ltr">
    <h3>7. Shock</h3>
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
</ul></div>
  </section>

  <section class="topic" id="crd-stable-angina" dir="ltr">
    <h3>8. Stable Chest Pain: Picking the Test</h3>
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
</ul></div>
  </section>

  <section class="topic" id="crd-arrhythmias" dir="ltr">
    <h3>9. Other Arrhythmias &amp; Drug Toxicity</h3>
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
</ul></div>
  </section>

  <section class="topic" id="crd-lipids-prevention" dir="ltr">
    <h3>10. Lipids &amp; Cardiovascular Prevention</h3>
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
</ul></div>
  </section>
</div>
`;
