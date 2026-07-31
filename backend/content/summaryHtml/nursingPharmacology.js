// Pharmacology & Dosage Calculation — nursing-track topic summary, served
// (gated) to the slide viewer. Calculation comes first because it is the one
// section a student can gain marks on with certainty.
// Angle brackets escaped (&lt; / &gt;).
export default `
<div class="sum-doc" dir="rtl">
  <div class="sum-head">
    <h2>الأدوية وحسابات الجرعات — ملخص عالي العائد (SNLE)</h2>
    <p class="sum-meta">يغطي التحويلات وقوانين حساب الجرعات ومعدل التنقيط · قواعد سلامة الدواء وطرق الإعطاء · اللواحق والبادئات · المستويات العلاجية والترياقات · أدوية القلب والتخثر · الجهاز الهضمي والتنفسي · المسكنات والمضادات الحيوية · الغدد والأنسولين · الأدوية النفسية. للمراجعة الامتحانية فقط.</p>
  </div>

  <nav class="sum-toc" dir="rtl" aria-label="جدول المحتويات">
    <h3>جدول المحتويات</h3>
    <ol>
      <li><a href="#d-convert">Conversions</a></li>
      <li><a href="#d-formula">Dosage Formulas &amp; Worked Examples</a></li>
      <li><a href="#d-flow">IV Flow Rates</a></li>
      <li><a href="#d-kinetics">Pharmacokinetics, Half-Life &amp; Therapeutic Index</a></li>
      <li><a href="#d-safety">Medication Safety &amp; Routes</a></li>
      <li><a href="#d-suffix">Suffixes &amp; Drug Classes</a></li>
      <li><a href="#d-levels">Therapeutic Levels &amp; Antidotes</a></li>
      <li><a href="#d-cardiac">Cardiovascular Drugs</a></li>
      <li><a href="#d-coag">Anticoagulants</a></li>
      <li><a href="#d-pain">Analgesics &amp; Opioids</a></li>
      <li><a href="#d-abx">Antimicrobials</a></li>
      <li><a href="#d-endo">Endocrine &amp; Insulin</a></li>
      <li><a href="#d-gi">GI &amp; Respiratory</a></li>
      <li><a href="#d-psych">Psychotropics</a></li>
      <li><a href="#d-herbal">Herbal Supplements</a></li>
      <li><a href="#d-preg">Drugs in Pregnancy &amp; Lactation</a></li>
    </ol>
  </nav>

  <section class="topic" id="d-convert" dir="ltr">
    <h3>1. Conversions</h3>
    <ul>
      <li>1 kg = <b>2.2 lb</b> · 1 lb = 16 oz · <b>lb → kg: divide by 2.2</b> · kg → lb: multiply by 2.2</li>
      <li>1 g = 1,000 mg · 1 mg = 1,000 mcg · 1 L = 1,000 mL</li>
      <li>1 tsp = <b>5 mL</b> · 1 tbsp = <b>15 mL</b> = 3 tsp · 1 oz = <b>30 mL</b> · 1 cup = 8 oz = 240 mL</li>
      <li>1 hour = 60 minutes · 1 grain (gr) ≈ 60 mg</li>
      <li><b>Larger unit → move the decimal LEFT</b> (mcg → mg → g). Smaller unit → move it right. <i>1500 mcg = 1.5 mg</i></li>
      <li>Always convert to a <b>single common unit before</b> doing the arithmetic, and <b>never round until the final answer</b></li>
    </ul>
  </section>

  <section class="topic" id="d-formula" dir="ltr">
    <h3>2. Dosage Formulas &amp; Worked Examples</h3>
    <div class="sum-callout">
      <b>Desired over Have:</b> Amount to give = ( <b>D</b> ÷ <b>H</b> ) × <b>V</b><br>
      <b>D</b> = dose ordered · <b>H</b> = dose on hand (strength available) · <b>V</b> = volume/form that strength comes in
    </div>
    <h4>Example 1 — unit conversion inside the problem</h4>
    <ul>
      <li>Ordered <b>0.2 g</b>; available <b>400 mg in 10 mL</b>. How many mL?</li>
      <li>Convert first: 0.2 g = <b>200 mg</b>. Then (200 ÷ 400) × 10 = <b>5 mL</b></li>
    </ul>
    <h4>Example 2 — weight-based dose, answer in grams</h4>
    <ul>
      <li>Patient <b>67 kg</b>, drug <b>30 mg/kg/24 h</b>. How many grams in 24 h?</li>
      <li>67 × 30 = 2,010 mg = <b>≈ 2 g</b></li>
    </ul>
    <h4>Example 3 — weight in pounds</h4>
    <ul>
      <li>Ibuprofen <b>3 mg/kg</b> for a child weighing <b>73 lb</b>; supplied as <b>50 mg/2 mL</b></li>
      <li>73 ÷ 2.2 = 33.18 kg → 33.18 × 3 = 99.5 mg → (99.5 ÷ 50) × 2 = <b>≈ 4 mL</b></li>
    </ul>
    <h4>Example 4 — units</h4>
    <ul>
      <li>Ordered <b>1,000 units</b> of heparin; available <b>5,000 units in 5 mL</b></li>
      <li>(1,000 ÷ 5,000) × 5 = <b>1 mL</b></li>
    </ul>
    <h4>Example 5 — concentration to rate</h4>
    <ul>
      <li><b>500 mg</b> in <b>250 mL</b> D5NS, ordered at <b>20 mg/hour</b></li>
      <li>Concentration = 500 ÷ 250 = 2 mg/mL → 20 ÷ 2 = <b>10 mL/h</b></li>
    </ul>
    <h4>Intake &amp; output</h4>
    <ul>
      <li><b>Intake</b> = all fluids in: IV fluids, IV medications and flushes, oral fluids, ice chips (count as half), tube feeds and water flushes, irrigant instilled and not returned</li>
      <li><b>Output</b> = urine, emesis, diarrhoea, drain and chest-tube output, <b>blood loss</b>, wound drainage, and irrigant returned</li>
      <li>Worked example: in theatre — 1,500 mL Ringer's + 50 mL antibiotic + 50 mL NG feed = <b>intake 1,600 mL</b>; blood loss 500 mL + urine 120 mL = <b>output 620 mL</b></li>
    </ul>
  </section>

  <section class="topic" id="d-flow" dir="ltr">
    <h3>3. IV Flow Rates</h3>
    <div class="sum-callout">
      <b>mL/hour</b> = total mL ÷ total hours &nbsp;·&nbsp; if the order is in minutes: (mL ÷ minutes) × 60<br>
      <b>gtt/min</b> = (total mL ÷ total minutes) × drop factor (gtt/mL)
    </div>
    <ul>
      <li><b>Example A</b>: 1,000 mL over 3 hours → 1,000 ÷ 3 = <b>333 mL/h</b></li>
      <li><b>Example B</b>: 1,000 mL of saline over 6 hours → <b>167 mL/h</b></li>
      <li><b>Example C</b>: 50 mL over 30 minutes → (50 ÷ 30) × 60 = <b>100 mL/h</b></li>
      <li><b>Example D</b>: 100 mL over 45 min, drop factor 10 gtt/mL → (100 ÷ 45) × 10 = <b>22 gtt/min</b></li>
      <li><b>Example E</b>: 50 mL/h with a 5 gtt/mL set → (50 ÷ 60) × 5 = <b>4 gtt/min</b></li>
      <li><b>Macrodrip</b> sets = 10, 15 or 20 gtt/mL (adults, fast rates). <b>Microdrip</b> = <b>60 gtt/mL</b> (paediatrics, precise low rates) — with a microdrip set, <b>gtt/min = mL/h</b></li>
      <li>Both mL/h and gtt/min are always <b>rounded to the nearest whole number</b> at the end</li>
    </ul>
  </section>

  <section class="topic" id="d-kinetics" dir="ltr">
    <h3>4. Pharmacokinetics, Half-Life &amp; Therapeutic Index</h3>
    <h4>ADME — what the body does to the drug</h4>
    <table>
      <thead><tr><th>Phase</th><th>Meaning</th><th>What changes it</th></tr></thead>
      <tbody>
        <tr><td><b>A</b>bsorption</td><td>From the site of administration into the bloodstream</td><td>Route: <b>IV is fastest, oral is slowest</b>; SubQ/IM depend on perfusion at the site — <b>poor perfusion (shock, haemorrhage) means poor absorption</b>, which is why burns and shock get IV drugs</td></tr>
        <tr><td><b>D</b>istribution</td><td>Carried in body fluid to the target tissue</td><td>Circulation, membrane permeability, <b>plasma protein binding</b> — a low albumin leaves more free (active) drug and raises toxicity risk</td></tr>
        <tr><td><b>M</b>etabolism</td><td>Broken down, mostly in the <b>liver</b></td><td>Age (infants and the elderly metabolise poorly), liver disease, nutrition, drug interactions</td></tr>
        <tr><td><b>E</b>xcretion</td><td>Removed, mostly by the <b>kidneys</b></td><td><b>Renal impairment prolongs and intensifies</b> every drug response — the reason doses are reduced in CKD</td></tr>
      </tbody>
    </table>
    <div class="sum-callout"><b>First-pass effect:</b> an oral drug is absorbed from the gut and passes through the liver, where enzymes inactivate part of it before it ever reaches the circulation — so the oral dose is larger than the IV dose of the same drug. Parenteral routes (IV, IM, SubQ) and the sublingual route <b>bypass</b> the first pass, which is why sublingual nitroglycerin works in minutes.</div>
    <h4>Half-life</h4>
    <ul>
      <li>The time for the drug concentration to fall by <b>half (50%)</b>. It takes about <b>4–5 half-lives</b> to reach a steady state, and the same again to clear the drug</li>
      <li><b>Short half-life</b> (rapid insulin, midazolam, oxycodone): fast on, fast off — good for acute relief, needs frequent dosing, lower toxicity risk but higher dependence risk</li>
      <li><b>Long half-life</b> (glargine, fluoxetine, clonazepam, digoxin, amiodarone): slower to take effect, once-daily dosing, <b>higher risk of accumulation and toxicity</b>, especially with renal or hepatic impairment</li>
    </ul>
    <h4>Therapeutic index</h4>
    <ul>
      <li>The gap between the effective level and the toxic level</li>
      <li><b>Narrow therapeutic index = must be monitored by serum level</b>: <b>digoxin, lithium, phenytoin, theophylline, warfarin, aminoglycosides (gentamicin), vancomycin</b></li>
      <li><b>Trough</b> is drawn immediately <b>before</b> the next dose (the lowest level, tells you about toxicity); <b>peak</b> is drawn after administration per protocol (tells you about effectiveness)</li>
    </ul>
    <div class="sum-key">
      <span class="sum-key-title">نقاط امتحانية</span>
      <ul>
        <li>Renal failure → the drug is not excreted → <b>the effect lasts longer and becomes toxic</b>. That single sentence answers most "which patient needs a reduced dose" questions.</li>
        <li>The sublingual and IV routes are correct when the stem stresses <b>speed</b> — both skip the first-pass effect.</li>
      </ul>
    </div>
  </section>

  <section class="topic" id="d-safety" dir="ltr">
    <h3>5. Medication Safety &amp; Routes</h3>
    <h4>The rights of medication administration</h4>
    <ul>
      <li>Right <b>patient</b> (two identifiers) · <b>drug</b> · <b>dose</b> · <b>route</b> · <b>time</b> · <b>documentation</b> · <b>reason/indication</b> · <b>response</b> · the patient's <b>right to refuse</b></li>
      <li>Check the label <b>three times</b>: taking it from storage, preparing it, and returning/discarding it</li>
      <li><b>Never</b> give a medication that someone else prepared, and never chart a dose before giving it</li>
      <li>High-alert drugs (insulin, heparin, opioids, potassium, chemotherapy) need an <b>independent double check</b></li>
      <li><b>Concentrated potassium chloride is NEVER given IV push</b> — always diluted and infused on a pump</li>
    </ul>
    <h4>Error-prone abbreviations — never write these</h4>
    <table>
      <thead><tr><th>Do not use</th><th>Because it is read as</th><th>Write instead</th></tr></thead>
      <tbody>
        <tr><td><b>U</b></td><td>0 (zero) or cc — a 4 U dose becomes 40</td><td>unit</td></tr>
        <tr><td><b>IU</b></td><td>IV or 10</td><td>international unit</td></tr>
        <tr><td><b>QD, QOD</b></td><td>Mistaken for each other</td><td>daily / every other day</td></tr>
        <tr><td><b>Trailing zero</b> (1.0 mg)</td><td>10 mg if the point is missed</td><td>1 mg</td></tr>
        <tr><td><b>No leading zero</b> (.5 mg)</td><td>5 mg</td><td>0.5 mg</td></tr>
        <tr><td><b>MS, MSO4, MgSO4</b></td><td>Morphine vs magnesium confusion</td><td>morphine sulfate / magnesium sulfate</td></tr>
        <tr><td><b>cc</b> · <b>@</b></td><td>u (units) · 2</td><td>mL · at</td></tr>
      </tbody>
    </table>
    <div class="sum-algo">
      <span class="sum-algo-title">When the order looks wrong</span>
      <ol>
        <li><b>Do not give it.</b> Hold the dose</li>
        <li>Call the prescriber to <b>clarify</b> — quote the recommended range</li>
        <li>If he insists and it is still unsafe, <b>notify the nurse supervisor / follow the chain of command</b></li>
        <li>Document the whole sequence objectively</li>
      </ol>
    </div>
    <h4>Routes &amp; technique</h4>
    <table>
      <thead><tr><th>Route</th><th>Angle / needle</th><th>Volume &amp; sites</th></tr></thead>
      <tbody>
        <tr><td><b>Intradermal</b> (TB test, allergy)</td><td><b>5–15°</b>, bevel up, raise a wheal</td><td>0.01–0.1 mL, inner forearm. Do not massage</td></tr>
        <tr><td><b>Subcutaneous</b> (insulin, heparin)</td><td><b>45–90°</b>, 25–27 G</td><td>≤1 mL; abdomen, upper arm, thigh. <b>Do not aspirate or massage heparin</b></td></tr>
        <tr><td><b>Intramuscular</b></td><td><b>90°</b>, 21–23 G</td><td>Adults ≤3 mL (deltoid ≤1 mL); <b>ventrogluteal</b> is the safest adult site, <b>vastus lateralis</b> for infants</td></tr>
        <tr><td><b>Z-track IM</b></td><td>90°, pull the skin laterally, inject, wait 10 s, release</td><td>For irritating/staining drugs (iron dextran) — prevents leakage into subcutaneous tissue</td></tr>
      </tbody>
    </table>
    <ul>
      <li><b>Insulin injection angle is 90°</b> (45° only for a very thin patient); rotate sites within one region — the abdomen absorbs fastest</li>
      <li><b>Enteric-coated, sustained-release and extended-release tablets must never be crushed, chewed or split</b></li>
      <li>Sublingual tablets dissolve under the tongue — do not swallow or drink with them</li>
      <li>Patient unable to swallow liquid from a cup → <b>use an oral syringe/dropper into the side of the mouth</b> or ask for the form to be changed; do not automatically jump to IM or IV</li>
      <li>Ear drops: pull the pinna <b>down and back in a child under 3</b>, <b>up and back in an adult</b>; warm the drops to room temperature</li>
      <li>Eye drops: into the <b>lower conjunctival sac</b>, wait <b>5 minutes</b> between different drops, drops before ointment, apply punctal pressure</li>
      <li>Give <b>two IM injections in different sites</b>; never mix incompatible drugs in one syringe</li>
    </ul>
  </section>

  <section class="topic" id="d-suffix" dir="ltr">
    <h3>6. Suffixes &amp; Drug Classes</h3>
    <table>
      <thead><tr><th>Suffix</th><th>Class</th><th>Example</th></tr></thead>
      <tbody>
        <tr><td>-pril</td><td>ACE inhibitor</td><td>Captopril, lisinopril, enalapril</td></tr>
        <tr><td>-sartan</td><td>ARB</td><td>Losartan, valsartan</td></tr>
        <tr><td>-olol</td><td>Beta blocker</td><td>Metoprolol, atenolol, propranolol</td></tr>
        <tr><td>-dipine</td><td>Calcium channel blocker</td><td>Amlodipine, nifedipine</td></tr>
        <tr><td>-statin</td><td>HMG-CoA reductase inhibitor</td><td>Atorvastatin, simvastatin</td></tr>
        <tr><td>-osin</td><td>Alpha blocker</td><td>Doxazosin, tamsulosin</td></tr>
        <tr><td>-parin</td><td>Low-molecular-weight heparin</td><td>Enoxaparin, dalteparin</td></tr>
        <tr><td>-ase</td><td>Thrombolytic</td><td>Alteplase, streptokinase</td></tr>
        <tr><td>-prazole</td><td>Proton pump inhibitor</td><td>Omeprazole, pantoprazole</td></tr>
        <tr><td>-tidine</td><td>H2 receptor antagonist</td><td>Ranitidine, famotidine</td></tr>
        <tr><td>-cillin</td><td>Penicillin</td><td>Amoxicillin, ampicillin</td></tr>
        <tr><td>cef- / ceph-</td><td>Cephalosporin</td><td>Ceftriaxone, cefazolin</td></tr>
        <tr><td>-mycin / -micin</td><td>Aminoglycoside or macrolide</td><td>Gentamicin, vancomycin, erythromycin</td></tr>
        <tr><td>-floxacin</td><td>Fluoroquinolone</td><td>Ciprofloxacin, levofloxacin</td></tr>
        <tr><td>-cycline</td><td>Tetracycline</td><td>Doxycycline</td></tr>
        <tr><td>-vir</td><td>Antiviral</td><td>Acyclovir, oseltamivir</td></tr>
        <tr><td>-azole</td><td>Antifungal</td><td>Fluconazole, ketoconazole</td></tr>
        <tr><td>-sone / -solone</td><td>Corticosteroid</td><td>Prednisone, methylprednisolone, dexamethasone</td></tr>
        <tr><td>-terol</td><td>Beta-2 agonist bronchodilator</td><td>Salbutamol/albuterol, salmeterol</td></tr>
        <tr><td>-ide (loop)</td><td>Loop diuretic</td><td>Furosemide, bumetanide</td></tr>
        <tr><td>-pam / -lam</td><td>Benzodiazepine</td><td>Diazepam, lorazepam, alprazolam</td></tr>
        <tr><td>-caine</td><td>Local anaesthetic</td><td>Lidocaine, bupivacaine</td></tr>
        <tr><td>-tropin</td><td>Pituitary hormone</td><td>Somatropin</td></tr>
      </tbody>
    </table>
  </section>

  <section class="topic" id="d-levels" dir="ltr">
    <h3>7. Therapeutic Levels &amp; Antidotes</h3>
    <table>
      <thead><tr><th>Drug</th><th>Therapeutic level</th><th>Antidote / reversal</th></tr></thead>
      <tbody>
        <tr><td><b>Digoxin</b></td><td>0.5–2.0 ng/mL</td><td>Digoxin immune Fab (Digibind)</td></tr>
        <tr><td><b>Lithium</b></td><td>0.6–1.2 mEq/L</td><td>No antidote — fluids, stop the drug, dialysis if severe</td></tr>
        <tr><td><b>Phenytoin</b></td><td>10–20 mcg/mL</td><td>Supportive</td></tr>
        <tr><td><b>Theophylline</b></td><td>10–20 mcg/mL</td><td>Supportive</td></tr>
        <tr><td><b>Heparin</b></td><td>aPTT 1.5–2.5 × control (46–70 s)</td><td><b>Protamine sulfate</b></td></tr>
        <tr><td><b>Warfarin</b></td><td><b>INR 2–3</b></td><td><b>Vitamin K</b> (phytonadione); FFP if bleeding</td></tr>
        <tr><td><b>Opioids</b></td><td>—</td><td><b>Naloxone</b></td></tr>
        <tr><td><b>Benzodiazepines</b></td><td>—</td><td><b>Flumazenil</b></td></tr>
        <tr><td><b>Paracetamol/acetaminophen</b></td><td>Max 4 g/day adult</td><td><b>N-acetylcysteine</b></td></tr>
        <tr><td><b>Magnesium sulfate</b></td><td>4–7 mEq/L in obstetrics</td><td><b>Calcium gluconate</b></td></tr>
        <tr><td><b>Iron</b></td><td>—</td><td>Deferoxamine</td></tr>
        <tr><td><b>Organophosphates</b></td><td>—</td><td>Atropine + pralidoxime</td></tr>
      </tbody>
    </table>
  </section>

  <section class="topic" id="d-cardiac" dir="ltr">
    <h3>8. Cardiovascular Drugs</h3>
    <ul>
      <li><b>Digoxin</b>: increases contractility, slows the heart rate. <b>Take the apical pulse for a full minute and HOLD if &lt;60 bpm in an adult</b> (&lt;70 child, &lt;90–110 infant) — then notify the provider. Toxicity: anorexia, nausea, vomiting, <b>visual halos/yellow-green vision</b>, bradycardia, arrhythmia. <b>Hypokalaemia potentiates toxicity</b>, so watch potassium, especially with a loop diuretic. A pulse of <b>110</b> is not a reason to hold digoxin — assess the cause of the tachycardia and notify</li>
      <li><b>ACE inhibitors (-pril)</b>: dry persistent <b>cough</b>, first-dose hypotension, <b>hyperkalaemia</b>, angio-oedema, renal impairment. Avoid salt substitutes (potassium). Contraindicated in pregnancy</li>
      <li><b>ARBs (-sartan)</b>: same uses, <b>no cough</b></li>
      <li><b>Beta blockers (-olol)</b>: <b>hold if HR &lt;60 or systolic BP &lt;90</b>; mask the signs of hypoglycaemia in diabetics; caution in asthma/COPD (bronchospasm); <b>never stop abruptly</b> — rebound hypertension and angina</li>
      <li><b>Calcium channel blockers (-dipine)</b>: headache, flushing, <b>peripheral oedema</b>, constipation (verapamil); avoid grapefruit juice</li>
      <li><b>Nitroglycerin</b>: sublingual tablet every 5 min up to <b>3 doses</b> — call emergency services if the pain is not relieved. Store in the original dark glass container; expect headache and flushing. <b>Absolutely contraindicated with sildenafil</b> (fatal hypotension). Remove the patch for 8–12 h at night to prevent tolerance; wear gloves to apply the ointment</li>
      <li><b>Statins</b>: take in the evening; report <b>muscle pain/weakness (rhabdomyolysis)</b>; monitor liver enzymes; avoid grapefruit</li>
      <li><b>Diuretics</b> — loop (furosemide): potent, causes <b>hypokalaemia</b>, ototoxicity, dehydration; give in the morning; monitor daily weight and potassium. Thiazide: hypokalaemia, hyperglycaemia, hyperuricaemia. <b>Potassium-sparing (spironolactone)</b>: <b>hyperkalaemia</b>, gynaecomastia — no potassium supplements or salt substitutes. <b>Mannitol</b> (osmotic): the drug for <b>raised intracranial pressure</b> — monitor urine output, osmolality and for crystals in the bag</li>
    </ul>
    <div class="sum-key">
      <span class="sum-key-title">نقاط امتحانية</span>
      <ul>
        <li>Before every digoxin dose: <b>apical pulse for one full minute</b>. That is the assessment being tested.</li>
        <li>The drug for increased ICP after head trauma is <b>mannitol</b>.</li>
        <li>A dry cough on an antihypertensive = <b>ACE inhibitor</b> → switch to an ARB.</li>
      </ul>
    </div>
  </section>

  <section class="topic" id="d-coag" dir="ltr">
    <h3>9. Anticoagulants</h3>
    <table>
      <thead><tr><th></th><th>Heparin</th><th>Warfarin</th></tr></thead>
      <tbody>
        <tr><td>Route / onset</td><td>IV or SubQ, <b>immediate</b></td><td>Oral, <b>3–5 days</b> to act (overlap with heparin)</td></tr>
        <tr><td>Monitor</td><td><b>aPTT</b> (target 1.5–2.5 × control)</td><td><b>PT / INR</b> (target 2–3)</td></tr>
        <tr><td>Antidote</td><td><b>Protamine sulfate</b></td><td><b>Vitamin K</b></td></tr>
        <tr><td>Pregnancy</td><td><b>Safe</b> — does not cross the placenta</td><td><b>Contraindicated</b> — teratogenic</td></tr>
        <tr><td>Key teaching</td><td>SubQ into the abdomen, <b>do not aspirate or massage</b>, rotate sites</td><td>Keep <b>vitamin K intake consistent</b> — do not suddenly increase green leafy vegetables; many drug interactions; regular INR checks</td></tr>
      </tbody>
    </table>
    <ul>
      <li><b>HIT</b> (heparin-induced thrombocytopenia): platelets fall around day 5–6 with new thrombosis → <b>stop all heparin</b> and start a direct thrombin inhibitor (argatroban) — not warfarin alone and not platelet transfusion</li>
      <li>Bleeding precautions on any anticoagulant: soft toothbrush, electric razor, no NSAIDs or aspirin without advice, no contact sports, report black stools, haematuria, bruising, gum bleeding, or a severe headache</li>
    </ul>
  </section>

  <section class="topic" id="d-pain" dir="ltr">
    <h3>10. Analgesics &amp; Opioids</h3>
    <ul>
      <li><b>Opioids (morphine, fentanyl, pethidine, codeine)</b>: assess the <b>respiratory rate before and after</b> — hold and notify if RR &lt;12 (&lt;10 in some protocols). Side effects: respiratory depression, sedation, <b>constipation (never tolerated — always give a stool softener/laxative)</b>, nausea, urinary retention, pruritus, <b>pinpoint pupils</b>. Antidote <b>naloxone</b></li>
      <li>An order such as "morphine 50 mg IV every 4 hours" is <b>far outside the normal range</b> (usual adult IV dose 2–10 mg) — <b>hold and clarify with the prescriber</b>, do not give it</li>
      <li>Do not give an opioid early because the patient asks — check the time of the last dose, assess the pain, and use non-pharmacological measures and adjuvants meanwhile</li>
      <li><b>PCA pump</b>: only the <b>patient</b> presses the button — never the family or the nurse</li>
      <li><b>NSAIDs (ibuprofen, diclofenac, ketorolac)</b>: GI bleeding and ulcer, renal impairment, fluid retention, raised BP → take <b>with food</b>, avoid in peptic ulcer and renal disease, avoid combining with anticoagulants</li>
      <li><b>Aspirin</b>: antiplatelet; causes GI bleeding and <b>tinnitus</b> at toxic levels; <b>contraindicated in children with a viral illness (Reye's syndrome)</b>; stop before surgery per protocol</li>
      <li><b>Paracetamol/acetaminophen</b>: no anti-inflammatory effect, <b>hepatotoxic</b> above 4 g/day and much less with alcohol; check all combination cold remedies for hidden paracetamol</li>
    </ul>
  </section>

  <section class="topic" id="d-abx" dir="ltr">
    <h3>11. Antimicrobials</h3>
    <ul>
      <li>Always <b>obtain cultures before the first dose</b>, then start empirical therapy; teach the patient to <b>complete the full course</b> even when feeling better</li>
      <li><b>Penicillins / cephalosporins</b>: ask about allergy first; ~10% cross-reactivity. Watch for anaphylaxis — keep the patient for 30 min after the first parenteral dose</li>
      <li><b>Aminoglycosides (gentamicin, amikacin)</b>: <b>nephrotoxic and ototoxic</b> — monitor peak and trough levels, creatinine, and report tinnitus, hearing loss or vertigo</li>
      <li><b>Vancomycin</b>: monitor trough levels and renal function; infuse slowly over at least 60 minutes — a rapid infusion causes <b>"red man" syndrome</b> (flushing of the face and neck, not a true allergy)</li>
      <li><b>Tetracyclines/doxycycline</b>: <b>photosensitivity</b>; do not take with dairy, antacids or iron; <b>avoid in pregnancy and in children under 8</b> (stains teeth)</li>
      <li><b>Fluoroquinolones (-floxacin)</b>: <b>tendon rupture</b> and tendinitis, photosensitivity, QT prolongation; avoid with antacids and dairy</li>
      <li><b>Macrolides (erythromycin, azithromycin)</b>: GI upset, QT prolongation, many interactions</li>
      <li><b>Sulfonamides (sulfamethoxazole, sulfadiazine, sulfisoxazole, sulfapyridine)</b>: a patient with a <b>sulfa allergy must avoid all of them</b>; risk of <b>Stevens-Johnson syndrome</b> and crystalluria — drink plenty of fluids</li>
      <li><b>Metronidazole</b>: strict <b>no alcohol</b> — disulfiram-like reaction; metallic taste, dark urine</li>
      <li><b>Isoniazid (TB)</b>: <b>hepatotoxicity</b> and <b>peripheral neuropathy</b> — give <b>pyridoxine (vitamin B6)</b> to prevent it; avoid alcohol; report jaundice. <b>Rifampicin</b> turns urine, sweat and tears <b>orange-red</b> and stains contact lenses; it reduces the effect of oral contraceptives. <b>Ethambutol</b> → optic neuritis (colour vision). <b>Pyrazinamide</b> → hyperuricaemia</li>
      <li><b>Nystatin</b> for oral candidiasis: <b>swish and hold in the mouth, then swallow or spit</b>; nothing to eat or drink for 30 minutes afterwards</li>
      <li>Broad-spectrum antibiotics → superinfection: oral/vaginal candidiasis and <b><i>C. difficile</i> diarrhoea</b> (contact precautions and soap-and-water hand hygiene)</li>
    </ul>
  </section>

  <section class="topic" id="d-endo" dir="ltr">
    <h3>12. Endocrine &amp; Insulin</h3>
    <table>
      <thead><tr><th>Insulin</th><th>Onset</th><th>Peak</th><th>Duration</th></tr></thead>
      <tbody>
        <tr><td><b>Rapid</b> — lispro, aspart</td><td>15 min</td><td>1 h</td><td>3–4 h — give <b>with the meal in front of the patient</b></td></tr>
        <tr><td><b>Short</b> — regular</td><td>30–60 min</td><td>2–4 h</td><td>6–8 h — the <b>only insulin that can be given IV</b></td></tr>
        <tr><td><b>Intermediate</b> — NPH</td><td>1–2 h</td><td><b>4–12 h</b></td><td>12–18 h — cloudy</td></tr>
        <tr><td><b>Long</b> — glargine, detemir</td><td>1–2 h</td><td><b>No peak</b></td><td>24 h — <b>never mix with another insulin</b></td></tr>
      </tbody>
    </table>
    <ul>
      <li>Mixing: <b>draw up the CLEAR (regular) before the CLOUDY (NPH)</b> — "clear before cloudy", air into NPH first</li>
      <li><b>Hypoglycaemia</b> (&lt;70 mg/dL): shaky, sweaty, tachycardic, confused, irritable → conscious patient gets <b>15 g of fast-acting carbohydrate</b>, recheck in 15 minutes, repeat, then give a protein/complex-carbohydrate snack. Unconscious → IV dextrose 50% or IM/SubQ <b>glucagon</b>. <b>Treat hypoglycaemia before hyperglycaemia</b> — it kills faster</li>
      <li>The risk of hypoglycaemia is highest at the insulin's <b>peak</b> — this is the classic timing question</li>
      <li>Sick-day rules: <b>never stop insulin</b>, monitor glucose and ketones more often, keep hydrated, take small carbohydrate-containing fluids</li>
      <li><b>Metformin</b>: does not cause hypoglycaemia alone; GI upset; risk of <b>lactic acidosis</b>; <b>hold for 48 h before and after IV contrast</b>; check renal function</li>
      <li><b>Sulfonylureas (glibenclamide, glipizide)</b>: <b>do</b> cause hypoglycaemia; take with food; avoid alcohol</li>
      <li><b>Levothyroxine</b>: take <b>on an empty stomach in the early morning</b>, 30–60 min before food, at the same time daily, separated from calcium/iron/antacids by 4 h. Lifelong; report palpitations, weight loss, insomnia and heat intolerance (over-replacement)</li>
      <li><b>Antithyroid drugs (propylthiouracil, methimazole)</b>: report <b>sore throat and fever</b> — agranulocytosis. PTU is preferred in the first trimester of pregnancy</li>
      <li><b>Corticosteroids (prednisone)</b>: take <b>with food in the morning</b>; <b>never stop abruptly</b> — taper to avoid adrenal crisis. Effects: hyperglycaemia, hypertension, weight gain, moon face, osteoporosis, <b>immunosuppression and masked infection</b>, mood change, cataract, GI ulcer, poor wound healing. Report signs of infection immediately</li>
    </ul>
    <div class="sum-key">
      <span class="sum-key-title">نقاط امتحانية</span>
      <ul>
        <li>The insulin injection angle is <b>90°</b>; rotate sites within one anatomical region.</li>
        <li>Regular insulin is the only one given <b>IV</b>; glargine is <b>never mixed</b>.</li>
        <li>A "secondary Cushing's syndrome" in the stem points to long-term <b>prednisone</b>.</li>
      </ul>
    </div>
  </section>

  <section class="topic" id="d-gi" dir="ltr">
    <h3>13. Gastrointestinal &amp; Respiratory Drugs</h3>
    <ul>
      <li><b>Antacids</b>: take <b>1–2 hours apart</b> from other drugs — they impair absorption. Aluminium → constipation; magnesium → diarrhoea</li>
      <li><b>PPIs (-prazole)</b>: take <b>before breakfast</b>; long-term use risks fracture, hypomagnesaemia, B12 deficiency and <i>C. difficile</i></li>
      <li><b>H2 blockers (-tidine)</b>: give at bedtime; cimetidine has many interactions and can cause confusion in the elderly</li>
      <li><b>Lactulose</b>: for hepatic encephalopathy — it traps ammonia in the gut. The <b>goal is 2–3 soft stools per day</b>; monitor ammonia and potassium</li>
      <li><b>Metoclopramide</b>: prokinetic antiemetic — risk of <b>extrapyramidal symptoms and tardive dyskinesia</b></li>
      <li><b>Ondansetron</b>: antiemetic of choice; watch QT prolongation and headache</li>
      <li><b>Orlistat</b> blocks fat absorption → oily stools, flatus and reduced absorption of the <b>fat-soluble vitamins A, D, E and K</b> — take a multivitamin at least 2 hours apart from the dose</li>
      <li><b>Bronchodilators</b>: <b>SABA (salbutamol) is the rescue</b> inhaler, <b>LABA (salmeterol) is never used alone</b> for rescue. When both an inhaled bronchodilator and a steroid are ordered, <b>give the bronchodilator FIRST</b>, wait 5 minutes, then the steroid</li>
      <li><b>Inhaled corticosteroids</b>: <b>rinse the mouth after every use</b> to prevent oral candidiasis; use a spacer; it is a preventer, not a reliever</li>
      <li><b>Theophylline</b>: narrow therapeutic index (10–20 mcg/mL); toxicity = tachycardia, nausea, restlessness, seizure; avoid caffeine</li>
      <li><b>Expectorants/mucolytics</b>: increase fluid intake to loosen secretions. Antitussives suppress the cough — not for a productive cough</li>
    </ul>
  </section>

  <section class="topic" id="d-psych" dir="ltr">
    <h3>14. Psychotropics — quick recall</h3>
    <ul>
      <li><b>SSRIs (fluoxetine, sertraline, escitalopram)</b>: first-line for depression and anxiety; take <b>2–4 weeks</b> to work; sexual dysfunction, GI upset, insomnia. <b>Serotonin syndrome</b> (agitation, hyperthermia, hyperreflexia, tremor, diarrhoea) if combined with another serotonergic drug — never combine with an <b>MAOI</b>; leave a washout of at least 2 weeks (5 weeks after fluoxetine)</li>
      <li><b>TCAs (amitriptyline)</b>: anticholinergic effects (dry mouth, constipation, urinary retention, blurred vision), orthostatic hypotension, <b>lethal in overdose (cardiac arrhythmia)</b> — limit the amount dispensed to a suicidal patient</li>
      <li><b>MAOIs (phenelzine, tranylcypromine)</b>: <b>avoid tyramine</b> — aged cheese, cured/smoked meat, pickled and fermented foods, soy sauce, red wine, draught beer, overripe fruit → <b>hypertensive crisis</b> (severe throbbing headache, palpitations, sharply raised BP)</li>
      <li><b>Antipsychotics</b>: typicals → <b>extrapyramidal side effects</b>; atypicals → <b>metabolic syndrome</b>; both → <b>neuroleptic malignant syndrome</b> (fever, rigidity, altered consciousness — stop the drug immediately). <b>Clozapine</b> → agranulocytosis, monitor the WBC</li>
      <li><b>Lithium</b>: level 0.6–1.2 mEq/L; needs stable sodium and 2–3 L of fluid daily; toxicity with dehydration, low-salt diet, NSAIDs, diuretics and ACE inhibitors</li>
      <li><b>Benzodiazepines</b>: short-term only; dependence and rebound anxiety; do not combine with alcohol or opioids; antidote <b>flumazenil</b></li>
      <li><b>Methylphenidate</b> for ADHD: give in the morning (and not late in the day) to avoid insomnia; monitor <b>growth, weight and appetite</b>; risk of abuse and, in overdose, agitation, tachycardia and seizure</li>
    </ul>
  </section>

  <section class="topic" id="d-herbal" dir="ltr">
    <h3>15. Herbal Supplements</h3>
    <ul>
      <li>Always ask about herbal products, vitamins and over-the-counter medicines during <b>medication reconciliation on admission</b> — patients rarely volunteer them because they consider them "natural", not drugs</li>
      <li><b>Stop herbal supplements 2–3 weeks before surgery</b> — they alter bleeding risk and the response to anaesthesia</li>
    </ul>
    <table>
      <thead><tr><th>Supplement</th><th>Taken for</th><th>Interaction to know</th></tr></thead>
      <tbody>
        <tr><td><b>St John's wort</b></td><td>Depression, anxiety</td><td><b>Serotonin syndrome</b> with antidepressants; <b>reduces the effect of warfarin, digoxin, statins and oral contraceptives</b></td></tr>
        <tr><td><b>The four Gs</b> — <b>G</b>inkgo, <b>G</b>arlic, <b>G</b>inger, <b>G</b>inseng</td><td>Memory, immunity, nausea, circulation</td><td><b>Increased bleeding risk</b> with anticoagulants and antiplatelets — and before any surgery</td></tr>
        <tr><td><b>Saw palmetto</b></td><td>Benign prostatic hyperplasia</td><td>Increased bleeding risk</td></tr>
        <tr><td><b>Milk thistle</b></td><td>Liver and gallbladder problems</td><td>Interferes with liver enzymes, so it changes how other drugs are broken down</td></tr>
      </tbody>
    </table>
    <div class="sum-callout"><b>Memory:</b> the <b>G</b>s make you bleed, and <b>St John's wort goes to WAR</b> with <b>WAR</b>farin.</div>
  </section>

  <section class="topic" id="d-preg" dir="ltr">
    <h3>16. Drugs in Pregnancy &amp; Lactation</h3>
    <ul>
      <li><b>Contraindicated in pregnancy</b>: <b>warfarin</b>, ACE inhibitors and ARBs, <b>tetracyclines</b>, fluoroquinolones, isotretinoin, methotrexate, statins, live vaccines (MMR, varicella), high-dose vitamin A, and NSAIDs in the third trimester</li>
      <li><b>Safe / preferred</b>: heparin and LMWH for anticoagulation, paracetamol for pain and fever, methyldopa/labetalol/nifedipine for hypertension, penicillins and cephalosporins for infection, <b>insulin</b> for diabetes, and folic acid/iron supplementation</li>
      <li><b>Alcohol</b> in pregnancy → fetal alcohol syndrome; <b>smoking</b> → low birth weight and placental problems; there is no known safe amount of either</li>
      <li>The <b>embryonic period (3–8 weeks)</b> is when a teratogen causes the most structural damage</li>
      <li>In breastfeeding, most drugs pass into milk in small amounts — check each drug, and where possible take it <b>immediately after a feed</b> to minimise the infant's exposure</li>
    </ul>
    <div class="sum-key">
      <span class="sum-key-title">نقاط امتحانية</span>
      <ul>
        <li>"Which drug is contraindicated in pregnancy?" — the answer is nearly always <b>warfarin</b> or a <b>tetracycline</b>.</li>
        <li>Heparin is safe in pregnancy because it <b>does not cross the placenta</b>.</li>
      </ul>
    </div>
  </section>
</div>
`;
