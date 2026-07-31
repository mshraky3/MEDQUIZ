// Pharmacology & Dosage Calculation — nursing-track section of the summaries catalog.
//
// Mirror of backend/content/summaryHtml/nursingPharmacology.js (the gated slide viewer's
// copy): same authored prose, split into the guided path's subtopics. Keep the
// two in sync when the content changes.
//
// Questions are real recalls from the SNLE bank (questions.track = 'nursing'),
// matched to the subtopic they belong to. The full bank is reachable from the
// quiz engine; these are the handful shown inline while reading.
const nursingPharmacology = {
    id: "nursing-pharmacology",
    title: "Pharmacology & Dosage Calculation",
    title_en: "SNLE Review — 16 Topics",
    icon: "pill",
    accent: "#34d399",
    intro: "Pharmacology & Dosage Calculation — SNLE revision built from the Saudi nursing licence recall banks: Conversions · Dosage Formulas & Worked Examples · IV Flow Rates · Pharmacokinetics, Half-Life & Therapeutic Index · Medication Safety & Routes · Suffixes & Drug Classes · Therapeutic Levels & Antidotes · Cardiovascular Drugs · Anticoagulants · Analgesics & Opioids · Antimicrobials · Endocrine & Insulin · Gastrointestinal & Respiratory Drugs · Psychotropics — quick recall · Herbal Supplements · Drugs in Pregnancy & Lactation.",
    subtopics: [
        {
            id: "ph-convert",
            title: "01 — Conversions",
            title_en: "Conversions",
            summaryHtml: `
<ul>
      <li>1 kg = <b>2.2 lb</b> · 1 lb = 16 oz · <b>lb → kg: divide by 2.2</b> · kg → lb: multiply by 2.2</li>
      <li>1 g = 1,000 mg · 1 mg = 1,000 mcg · 1 L = 1,000 mL</li>
      <li>1 tsp = <b>5 mL</b> · 1 tbsp = <b>15 mL</b> = 3 tsp · 1 oz = <b>30 mL</b> · 1 cup = 8 oz = 240 mL</li>
      <li>1 hour = 60 minutes · 1 grain (gr) ≈ 60 mg</li>
      <li><b>Larger unit → move the decimal LEFT</b> (mcg → mg → g). Smaller unit → move it right. <i>1500 mcg = 1.5 mg</i></li>
      <li>Always convert to a <b>single common unit before</b> doing the arithmetic, and <b>never round until the final answer</b></li>
    </ul>
            `,
            questions: [
                {
                    q: "The doctor order 600 ml of drug during 10 hours. How many minutes for 15 ml of the drug?",
                    options: ["15","20","25","30"],
                    answer: 0,
                    source: 'SNLE recall',
                },
                {
                    q: "Doctor order 1000 unit heparin in 5 ml. The available 5000 unit. How many ml should the nurse give?",
                    options: ["1","2","3"],
                    answer: 0,
                    source: 'SNLE recall',
                },
            ],
        },
        {
            id: "ph-formula",
            title: "02 — Dosage Formulas & Worked Examples",
            title_en: "Example 1 — unit conversion inside the problem · Example 2 — weight-based dose, answer in grams · Example 3 — weight in pounds · Example 4 — units · Example 5 — concentration to rate",
            summaryHtml: `
<div class="sum-callout">
      <b>Desired over Have:</b> Amount to give = ( <b>D</b> ÷ <b>H</b> ) × <b>V</b><br>
      <b>D</b> = dose ordered · <b>H</b> = dose on hand (strength available) · <b>V</b> = volume/form that strength comes in
    </div>
    <h4 class="deck-topic">Example 1 — unit conversion inside the problem</h4>
    <ul>
      <li>Ordered <b>0.2 g</b>; available <b>400 mg in 10 mL</b>. How many mL?</li>
      <li>Convert first: 0.2 g = <b>200 mg</b>. Then (200 ÷ 400) × 10 = <b>5 mL</b></li>
    </ul>
    <h4 class="deck-topic">Example 2 — weight-based dose, answer in grams</h4>
    <ul>
      <li>Patient <b>67 kg</b>, drug <b>30 mg/kg/24 h</b>. How many grams in 24 h?</li>
      <li>67 × 30 = 2,010 mg = <b>≈ 2 g</b></li>
    </ul>
    <h4 class="deck-topic">Example 3 — weight in pounds</h4>
    <ul>
      <li>Ibuprofen <b>3 mg/kg</b> for a child weighing <b>73 lb</b>; supplied as <b>50 mg/2 mL</b></li>
      <li>73 ÷ 2.2 = 33.18 kg → 33.18 × 3 = 99.5 mg → (99.5 ÷ 50) × 2 = <b>≈ 4 mL</b></li>
    </ul>
    <h4 class="deck-topic">Example 4 — units</h4>
    <ul>
      <li>Ordered <b>1,000 units</b> of heparin; available <b>5,000 units in 5 mL</b></li>
      <li>(1,000 ÷ 5,000) × 5 = <b>1 mL</b></li>
    </ul>
    <h4 class="deck-topic">Example 5 — concentration to rate</h4>
    <ul>
      <li><b>500 mg</b> in <b>250 mL</b> D5NS, ordered at <b>20 mg/hour</b></li>
      <li>Concentration = 500 ÷ 250 = 2 mg/mL → 20 ÷ 2 = <b>10 mL/h</b></li>
    </ul>
    <h4 class="deck-topic">Intake &amp; output</h4>
    <ul>
      <li><b>Intake</b> = all fluids in: IV fluids, IV medications and flushes, oral fluids, ice chips (count as half), tube feeds and water flushes, irrigant instilled and not returned</li>
      <li><b>Output</b> = urine, emesis, diarrhoea, drain and chest-tube output, <b>blood loss</b>, wound drainage, and irrigant returned</li>
      <li>Worked example: in theatre — 1,500 mL Ringer's + 50 mL antibiotic + 50 mL NG feed = <b>intake 1,600 mL</b>; blood loss 500 mL + urine 120 mL = <b>output 620 mL</b></li>
    </ul>
            `,
            questions: [
                {
                    q: "The patient weight 67 kg. He is receiving drug 30mg /kg/24hr. How many grams should the nurse give for 24 hr.?",
                    options: ["5 g","1.5g","1 g","2g"],
                    answer: 3,
                    source: 'SNLE recall',
                },
                {
                    q: "The doctor ordered medication 5000 mg. The nurse deluted in 250 ml of D5N5 and modified dose on infusion pump to 20mg/hr. How many ml should the nurse give per hour?",
                    options: ["5","10","15","20"],
                    answer: 3,
                    source: 'SNLE recall',
                },
                {
                    q: "Which of the following drug should the doctor give Instruction for patient when using?",
                    options: ["Antiemetic's","Steroids","Antibiotic","Paracetamol"],
                    answer: 1,
                    source: 'SNLE recall',
                },
                {
                    q: "Patient is receiving chemotherapy. When should the nurse give antiemetic to avoid side effect?",
                    options: ["Before session","During session","Half hour After session"],
                    answer: 0,
                    source: 'SNLE recall',
                },
                {
                    q: "Patient with vital signs. Blood pressure 100/70., T 40 °c, HR 89, Hgb 11.7 g/dl. What is the first action for the nurse?",
                    options: ["Corticosteroid for inflammation","Antibiotics for infection","I. V fluids for blood pressure","Blood transfusion for Hgb"],
                    answer: 1,
                    source: 'SNLE recall',
                },
            ],
        },
        {
            id: "ph-flow",
            title: "03 — IV Flow Rates",
            title_en: "IV Flow Rates",
            summaryHtml: `
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
            `,
            questions: [
                {
                    q: "MD writes an order for Ibuprofen 3 mg/kg by mouth every 6 hours for pain for a child. The child weighs 73 lb. Pharmacy dispenses you with 50 mg/2 ml. How many ml will you administer per dose? *",
                    options: ["1 ml/dose","3.9 ml/dose","2.9 ml/dose","6 ml/dose"],
                    answer: 1,
                    source: 'SNLE recall',
                },
                {
                    q: "The doctor order 0.2 g, the available 400 mg in quantity 10 ml, how many ml needed??",
                    options: ["2.5ml","5ml","2ml","4ml"],
                    answer: 1,
                    source: 'SNLE recall',
                },
                {
                    q: "A patient complains of severe pain which he stated to be 9/10, the physician ordered morphine 50 mg IV every 4 hours, the last dose was given 2 hours ago, what is the best action his caring nurse would take",
                    options: ["Give another dose of morphine","Inform the doctor to change the order","Distract the patient by TV, radio or games for 2 hours","Ignore the patient completely"],
                    answer: 1,
                    source: 'SNLE recall',
                },
            ],
        },
        {
            id: "ph-kinetics",
            title: "04 — Pharmacokinetics, Half-Life & Therapeutic Index",
            title_en: "ADME — what the body does to the drug · Half-life · Therapeutic index",
            summaryHtml: `
<h4 class="deck-topic">ADME — what the body does to the drug</h4>
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
    <h4 class="deck-topic">Half-life</h4>
    <ul>
      <li>The time for the drug concentration to fall by <b>half (50%)</b>. It takes about <b>4–5 half-lives</b> to reach a steady state, and the same again to clear the drug</li>
      <li><b>Short half-life</b> (rapid insulin, midazolam, oxycodone): fast on, fast off — good for acute relief, needs frequent dosing, lower toxicity risk but higher dependence risk</li>
      <li><b>Long half-life</b> (glargine, fluoxetine, clonazepam, digoxin, amiodarone): slower to take effect, once-daily dosing, <b>higher risk of accumulation and toxicity</b>, especially with renal or hepatic impairment</li>
    </ul>
    <h4 class="deck-topic">Therapeutic index</h4>
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
            `,
            questions: [
                {
                    q: "Which patient is a contraindicated for enema??",
                    options: ["Gluocoma","hypertensive","renal failure","liver disease"],
                    answer: 2,
                    source: 'SNLE recall',
                },
                {
                    q: "Doctor order new antibiotics first thing to do before administering medication",
                    options: ["check the order in the system","do CBC","Obtain blood cultures","administration first dose when standard medication time"],
                    answer: 2,
                    source: 'SNLE recall',
                },
                {
                    q: "CSF contains NOT all of the following except",
                    options: ["Insulin","RBC","WBC","Protein"],
                    answer: 0,
                    source: 'SNLE recall',
                },
                {
                    q: "A patient was on a course of lithium carbonate drug. During the nurse found that he complained from nystagmus visual hallucination, and oliguria Which of the following drug related complications best symptoms?",
                    options: ["Overdose","Mild toxicity","Severe toxicity","Moderate toxic"],
                    answer: 2,
                    source: 'SNLE recall',
                },
                {
                    q: "A patient is admitted to the hospital with klebsiellapneumoniae. During the initial intravenous dose of Amikacin (amikacin sulfate), the patient develops severe respiratory distress. This is most likely",
                    options: ["A side effect","An indication of drug tolerance","A drug allergy","A toxic effect"],
                    answer: 3,
                    source: 'SNLE recall',
                },
            ],
        },
        {
            id: "ph-safety",
            title: "05 — Medication Safety & Routes",
            title_en: "The rights of medication administration · Error-prone abbreviations — never write these · Routes & technique",
            summaryHtml: `
<h4 class="deck-topic">The rights of medication administration</h4>
    <ul>
      <li>Right <b>patient</b> (two identifiers) · <b>drug</b> · <b>dose</b> · <b>route</b> · <b>time</b> · <b>documentation</b> · <b>reason/indication</b> · <b>response</b> · the patient's <b>right to refuse</b></li>
      <li>Check the label <b>three times</b>: taking it from storage, preparing it, and returning/discarding it</li>
      <li><b>Never</b> give a medication that someone else prepared, and never chart a dose before giving it</li>
      <li>High-alert drugs (insulin, heparin, opioids, potassium, chemotherapy) need an <b>independent double check</b></li>
      <li><b>Concentrated potassium chloride is NEVER given IV push</b> — always diluted and infused on a pump</li>
    </ul>
    <h4 class="deck-topic">Error-prone abbreviations — never write these</h4>
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
    <h4 class="deck-topic">Routes &amp; technique</h4>
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
            `,
            questions: [
                {
                    q: "A nurse is preparing to administer 25 mg iron dextran inject patient with iron deficiency anemia .the nurse knows this d to subcutaneous tissue and wants to administer the drug safely which of the best administration techniques ?",
                    options: ["Z-track","deep im","use large gauge","insert needle at 45 angle"],
                    answer: 0,
                    source: 'SNLE recall',
                },
                {
                    q: "Doctor's order excessed the recommended dose what to do?",
                    options: ["Call the doctor to clarify","Administer the dose","Hold the dose","Talk with supervisor"],
                    answer: 0,
                    source: 'SNLE recall',
                },
                {
                    q: "pt. has difficulty taking liquid medications from a cup. How should the nurse administer the medications?",
                    options: ["Request that the physician change the order to the IV route","Administer the medication by the IM route","Use a needleless syringe to place the medication in the side of the mouth","Add the dose to a small amount of food or beverage to facilitate swallowing"],
                    answer: 2,
                    source: 'SNLE recall',
                },
                {
                    q: "A nurse is preparing scheduled medications due at 6 pm. If a doctor orders paracetamol tab 1g QID, and it was supplied from the pharmacy in 250 mg tablets. Which of the following is the most appropriate nursing actions?",
                    options: ["Ask the pharmacy to provide 1g tablets","Call the doctor to recheck the dosage","Give the patient four 250 mg tablets","Hold the medication and document in nursing notes"],
                    answer: 2,
                    source: 'SNLE recall',
                },
                {
                    q: "Which of the following needle's angle for insulin injection?",
                    options: ["A","B","C"],
                    answer: 1,
                    source: 'SNLE recall',
                },
            ],
        },
        {
            id: "ph-suffix",
            title: "06 — Suffixes & Drug Classes",
            title_en: "Suffixes & Drug Classes",
            summaryHtml: `
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
            `,
            questions: [
                {
                    q: "Extrapyramidal adverse effects and symptoms are most often associated with which of the following drug classes?",
                    options: ["Antidepressants","Antipsychotics","Antihypertensives","Antidysrhythmic"],
                    answer: 1,
                    source: 'SNLE recall',
                },
                {
                    q: "500mg dilutedin ml 250ml D5NS with infusion pump then she modified the dose to 20mg/hr. How many ml/hr. should the nurse give??",
                    options: ["5","10","15","20"],
                    answer: 1,
                    source: 'SNLE recall',
                },
                {
                    q: "Which of the following drug contraindication during pregnancy?",
                    options: ["Antibiotic","Analgesic","Steroids"],
                    answer: 2,
                    source: 'SNLE recall',
                },
                {
                    q: "What is the drug to minimize intracranial pressure?",
                    options: ["Warfarin","Morphine","Potassium","Dulcolax"],
                    answer: 3,
                    source: 'SNLE recall',
                },
            ],
        },
        {
            id: "ph-levels",
            title: "07 — Therapeutic Levels & Antidotes",
            title_en: "Therapeutic Levels & Antidotes",
            summaryHtml: `
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
            `,
            questions: [
                {
                    q: "Patient has given digoxin then the doctor ordered Digibind which of the following vital signs is most likely the patient have",
                    options: ["Bp ….. HR 69","Bp ….. HR 80","Bp ….. HR 90","Bp ….. HR 120"],
                    answer: 3,
                    source: 'SNLE recall',
                },
                {
                    q: "is the dose of vitamin k according to WHO 2017?",
                    options: ["0.2","0.5","1","2"],
                    answer: 2,
                    source: 'SNLE recall',
                },
                {
                    q: "Patient during intraoperative period while administering anesethia. The patient complained from reaction. The vital signs Bl. P 110/70 mmhg, HR 140 b/m, RR 24 b/m. Which of the following drug should the nurse administer?",
                    options: ["I. M epinephrine","I. V atropine"],
                    answer: 0,
                    source: 'SNLE recall',
                },
                {
                    q: "Which drug would be used to treat a patient who has increased intracranial pressure (ICP) resulting from head trauma after an accident",
                    options: ["Mannitol","Atropine sulphate","epinephrine hydrochloride","Sodium bicarbonate"],
                    answer: 0,
                    source: 'SNLE recall',
                },
                {
                    q: "Patient scheduled to perform venacava filter surgery. The doctor ordered to stop medication before one day of operation for preoperative preparation. Which of the following drug should be stopped?",
                    options: ["Warfarin","Sodium bicarb","Potassium"],
                    answer: 0,
                    source: 'SNLE recall',
                },
            ],
        },
        {
            id: "ph-cardiac",
            title: "08 — Cardiovascular Drugs",
            title_en: "Cardiovascular Drugs",
            summaryHtml: `
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
            `,
            questions: [
                {
                    q: "Nurse administer digoxin to patient and dr order subsequent dose of digitalis ...nurse assess apical pulse before administering medication When nurse should withholding it and notify dr?",
                    options: ["heart rate 57","120","87"],
                    answer: 0,
                    source: 'SNLE recall',
                },
                {
                    q: "Patient with (HF) he is on Digoxin, when the nurse checks vital signs, she noticed pulse was 110. what is the nurse intervention?",
                    options: ["hold digoxin medication","inform doctor","recheck pulse","give medication"],
                    answer: 3,
                    source: 'SNLE recall',
                },
                {
                    q: "Patient post heart valve replacement. What is the expected drug for the patient after operation?",
                    options: ["Nitrates","Beta blockers","Anticoagulant"],
                    answer: 2,
                    source: 'SNLE recall',
                },
                {
                    q: "During a night shift a medical doctor complains of back pain and asks the t nurse to give him morphine 5 mg IM. Which of the following actions indicates professionalism in handing the ation by the nurse?",
                    options: ["Call another doctor to manage","Refer him to Emergency Room","Administer morphine to doctor","Ask him to write a prescription first"],
                    answer: 1,
                    source: 'SNLE recall',
                },
                {
                    q: "Patient was complaining sever pain. The nurse gave to him I. V morphine but there is no effect with him. What should the nurse do?",
                    options: ["Ask the patient for drug abuse","Give another dose","Ignore the patient"],
                    answer: 0,
                    source: 'SNLE recall',
                },
            ],
        },
        {
            id: "ph-coag",
            title: "09 — Anticoagulants",
            title_en: "Anticoagulants",
            summaryHtml: `
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
            `,
            questions: [
                {
                    q: "Float nurse from medicine floor. Came to telemetry unite Which patient she receives?",
                    options: ["MI patient in heparin infusion","Hypertensivepatient on Lasix","Atrial Fibrational with anticoagulant drug"],
                    answer: 2,
                    source: 'SNLE recall',
                },
                {
                    q: "The nurse is caring for patient with deep vein thrombosis (DVT). The patient’s heparin sodium infusion has been discontinued and the patient is receiving prescribed warfarin sodium (Coumadin). The nurse should advise the patient that which of the following needs to be continued?",
                    options: ["Daily complete blood count (CBC)","Laboratory tests for partial thromboplastin time (PTT)","Strict bed rest","Wearing elasticized support stockings"],
                    answer: 2,
                    source: 'SNLE recall',
                },
            ],
        },
        {
            id: "ph-pain",
            title: "10 — Analgesics & Opioids",
            title_en: "Analgesics & Opioids",
            summaryHtml: `
<ul>
      <li><b>Opioids (morphine, fentanyl, pethidine, codeine)</b>: assess the <b>respiratory rate before and after</b> — hold and notify if RR &lt;12 (&lt;10 in some protocols). Side effects: respiratory depression, sedation, <b>constipation (never tolerated — always give a stool softener/laxative)</b>, nausea, urinary retention, pruritus, <b>pinpoint pupils</b>. Antidote <b>naloxone</b></li>
      <li>An order such as "morphine 50 mg IV every 4 hours" is <b>far outside the normal range</b> (usual adult IV dose 2–10 mg) — <b>hold and clarify with the prescriber</b>, do not give it</li>
      <li>Do not give an opioid early because the patient asks — check the time of the last dose, assess the pain, and use non-pharmacological measures and adjuvants meanwhile</li>
      <li><b>PCA pump</b>: only the <b>patient</b> presses the button — never the family or the nurse</li>
      <li><b>NSAIDs (ibuprofen, diclofenac, ketorolac)</b>: GI bleeding and ulcer, renal impairment, fluid retention, raised BP → take <b>with food</b>, avoid in peptic ulcer and renal disease, avoid combining with anticoagulants</li>
      <li><b>Aspirin</b>: antiplatelet; causes GI bleeding and <b>tinnitus</b> at toxic levels; <b>contraindicated in children with a viral illness (Reye's syndrome)</b>; stop before surgery per protocol</li>
      <li><b>Paracetamol/acetaminophen</b>: no anti-inflammatory effect, <b>hepatotoxic</b> above 4 g/day and much less with alcohol; check all combination cold remedies for hidden paracetamol</li>
    </ul>
            `,
            questions: [
                {
                    q: "What are the symptoms of the BCG vaccination side effect?",
                    options: ["Diarrhea","Skin ulcer or scar","no symptoms","Seizure"],
                    answer: 1,
                    source: 'SNLE recall',
                },
                {
                    q: "What is Thyroxine side effect?",
                    options: ["Depression","Fever","Weight gain","Increase appetite"],
                    answer: 3,
                    source: 'SNLE recall',
                },
                {
                    q: "side effects of bCG vaccination",
                    options: ["cold and small scar","diarrhea C- rash for three days"],
                    answer: 0,
                    source: 'SNLE recall',
                },
                {
                    q: "Patient is taking streptokinase. Suddenly he is complaining fever, shortness of breathing. What should the nurse expect that effect?",
                    options: ["Side effect","Allergic reaction","Normal response"],
                    answer: 1,
                    source: 'SNLE recall',
                },
                {
                    q: "What is the side effects of isoniazid?",
                    options: ["Urecemia","Photosensitivity","Nerve inflamation"],
                    answer: 1,
                    source: 'SNLE recall',
                },
            ],
        },
        {
            id: "ph-abx",
            title: "11 — Antimicrobials",
            title_en: "Antimicrobials",
            summaryHtml: `
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
            `,
            questions: [
                {
                    q: "Contraindication for oral contraceptives?",
                    options: ["Hypotension","Hypertension","Anemia","Infection"],
                    answer: 1,
                    source: 'SNLE recall',
                },
                {
                    q: "What is the side effect of baclofen if given for diabetic patient?",
                    options: ["Blurred vision","Increase of insulin demand","Fever"],
                    answer: 1,
                    source: 'SNLE recall',
                },
                {
                    q: "Patient diagnosed with nephrotic syndrome his lab results showed that he had protein in urinalysis Which of the following medication should give",
                    options: ["Immune spirits","Cortisone","Diuretic"],
                    answer: 1,
                    source: 'SNLE recall',
                },
                {
                    q: "A nurse prepares to administer a vitamin K injection to a full term the mother wants to know the importance of the injection Which of the following is the best nurse response to the mother",
                    options: ["needed for blood clotting to prevent hemorrhage","accelerate the growth and development of infants","help in maintain healthy gut and passage of meconium","protect the infant from developing sever respiratory distress"],
                    answer: 0,
                    source: 'SNLE recall',
                },
                {
                    q: "What is the Contraindication of baby vaccine?",
                    options: ["Antiemetic","Antibiotics","Steroid"],
                    answer: 2,
                    source: 'SNLE recall',
                },
            ],
        },
        {
            id: "ph-endo",
            title: "12 — Endocrine & Insulin",
            title_en: "Endocrine & Insulin",
            summaryHtml: `
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
            `,
            questions: [
                {
                    q: "client is diagnosed as having secondary Cushing’s syndrome. The nurse knows that the client has most likely been taking which medication",
                    options: ["Estrogen","Penicillin","Lovastatin","Prednisone"],
                    answer: 3,
                    source: 'SNLE recall',
                },
                {
                    q: "Patient recieves (Psychotrophicmedication ). The Patient develop agranulocytosis. This side effects to which medication cause ?",
                    options: ["Typical antipsychotic","Atypical antipsychotic","Sertonin reuptake inhibitor","Noradrenaline reuptake inhibitor"],
                    answer: 1,
                    source: 'SNLE recall',
                },
                {
                    q: "A 71-year-old woman who resides in a long-term nursing home fell while walking downstairs. The attending nurse arrives to find the patient sitting motionless on the stairs. She is alert and oriented but wishes to rest. While she rests, the nurse reviews the chart and notes that her medication regimen includes metformin, loratadine, warfarin and diclofenac. Which medication is most likely to increase the patient's risk of injury?",
                    options: ["Metformin","Loratadine","Warfarin","Diclofenac"],
                    answer: 1,
                    source: 'SNLE recall',
                },
                {
                    q: "Quinine sulphate drug side effects",
                    options: ["Ringing in ears","Blindness","Hypotension","Insomnia"],
                    answer: 0,
                    source: 'SNLE recall',
                },
                {
                    q: "A male client has received a prescription for orlistat for weight and nutrition management. In addition to the medication, client states plan to take a multivitamin. what teaching should a nurse provide?",
                    options: ["Following a well-balanced diet is a much healthier approach to good nutrition than depending on a multivitamin. Be sure to take the multivitamin and the medication at least two hours apart","As a nutritional supplement, orlistat contains all the recommended daily vitamins and minerals","Multivitamins are contraindicated during treatment with weight control medications such","as orlistat"],
                    answer: 0,
                    source: 'SNLE recall',
                },
            ],
        },
        {
            id: "ph-gi",
            title: "13 — Gastrointestinal & Respiratory Drugs",
            title_en: "Gastrointestinal & Respiratory Drugs",
            summaryHtml: `
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
            `,
            questions: [

            ],
        },
        {
            id: "ph-psych",
            title: "14 — Psychotropics — quick recall",
            title_en: "Psychotropics — quick recall",
            summaryHtml: `
<ul>
      <li><b>SSRIs (fluoxetine, sertraline, escitalopram)</b>: first-line for depression and anxiety; take <b>2–4 weeks</b> to work; sexual dysfunction, GI upset, insomnia. <b>Serotonin syndrome</b> (agitation, hyperthermia, hyperreflexia, tremor, diarrhoea) if combined with another serotonergic drug — never combine with an <b>MAOI</b>; leave a washout of at least 2 weeks (5 weeks after fluoxetine)</li>
      <li><b>TCAs (amitriptyline)</b>: anticholinergic effects (dry mouth, constipation, urinary retention, blurred vision), orthostatic hypotension, <b>lethal in overdose (cardiac arrhythmia)</b> — limit the amount dispensed to a suicidal patient</li>
      <li><b>MAOIs (phenelzine, tranylcypromine)</b>: <b>avoid tyramine</b> — aged cheese, cured/smoked meat, pickled and fermented foods, soy sauce, red wine, draught beer, overripe fruit → <b>hypertensive crisis</b> (severe throbbing headache, palpitations, sharply raised BP)</li>
      <li><b>Antipsychotics</b>: typicals → <b>extrapyramidal side effects</b>; atypicals → <b>metabolic syndrome</b>; both → <b>neuroleptic malignant syndrome</b> (fever, rigidity, altered consciousness — stop the drug immediately). <b>Clozapine</b> → agranulocytosis, monitor the WBC</li>
      <li><b>Lithium</b>: level 0.6–1.2 mEq/L; needs stable sodium and 2–3 L of fluid daily; toxicity with dehydration, low-salt diet, NSAIDs, diuretics and ACE inhibitors</li>
      <li><b>Benzodiazepines</b>: short-term only; dependence and rebound anxiety; do not combine with alcohol or opioids; antidote <b>flumazenil</b></li>
      <li><b>Methylphenidate</b> for ADHD: give in the morning (and not late in the day) to avoid insomnia; monitor <b>growth, weight and appetite</b>; risk of abuse and, in overdose, agitation, tachycardia and seizure</li>
    </ul>
            `,
            questions: [
                {
                    q: "45 years old Woman with uterine fibroid. The doctor prescribed for her Gonadotropin-releasing hormone (GnRH) agonists. What is the side effect for hcg hormone?",
                    options: ["Depression","Anorexia","Osteoarthritis","Menopause"],
                    answer: 0,
                    source: 'SNLE recall',
                },
                {
                    q: "A hospitalized 72-years-old man who uses a walker is received medication and must use the bathroom several times each night. To promote the safety of the patient, which of the following appropriate nursing action?",
                    options: ["Keep the side rails up","Leave the bathroom light on","Provide a bedside commode","Withhold the patient’s diuretic medicat ion"],
                    answer: 2,
                    source: 'SNLE recall',
                },
            ],
        },
        {
            id: "ph-herbal",
            title: "15 — Herbal Supplements",
            title_en: "Herbal Supplements",
            summaryHtml: `
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
            `,
            questions: [

            ],
        },
        {
            id: "ph-preg",
            title: "16 — Drugs in Pregnancy & Lactation",
            title_en: "Drugs in Pregnancy & Lactation",
            summaryHtml: `
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
            `,
            questions: [

            ],
        },
    ],
};

export default nursingPharmacology;
