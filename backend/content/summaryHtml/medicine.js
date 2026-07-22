// Medicine (Internal Medicine) topic summary — HTML served (gated) to the viewer.
// Built to match the surgery/pediatrics example decks, grounded in the SMLE
// recall collections in /content (CONFIRMED Medicine, Probably Confirmed Medicine).
// Angle brackets in clinical text are HTML-escaped (&lt; / &gt;).
export default `
<div class="sum-doc" dir="rtl">
  <div class="sum-head">
    <h2>الباطنة — ملخص عالي العائد (SMLE)</h2>
    <p class="sum-meta">يغطي القلب · الصدر · الجهاز الهضمي والكبد · الغدد الصماء · الكلى · الدم والأورام · الروماتيزم · الأعصاب · الأمراض المعدية · النفسية · الأخلاقيات والإحصاء. للمراجعة الامتحانية فقط.</p>
  </div>

  <section class="topic" dir="ltr">
    <h3>1. Cardiology</h3>
    <h4>Ischaemic heart disease</h4>
    <ul>
      <li>Stable angina, normal resting ECG/enzymes → <b>exercise stress ECG</b>; if unable to exercise (e.g. OA knee) → <b>dobutamine stress echo</b></li>
      <li>ACS: MONA-BASH; STEMI → primary PCI (&lt;90 min) or thrombolysis if PCI unavailable</li>
      <li>Post-MI patient develops DVT and you consider thrombolysis → first ensure <b>no recent bleeding or stroke</b></li>
    </ul>
    <h4>Heart failure &amp; valves</h4>
    <ul>
      <li>HFrEF mortality benefit: ACEi/ARB, beta-blocker, MRA, SGLT2i</li>
      <li>Concentric LVH + normal EF + HF symptoms → <b>HFpEF</b></li>
      <li>Severe aortic stenosis: asymptomatic + normal EF → <b>follow-up echo</b>; symptomatic → valve replacement (TAVR/SAVR)</li>
    </ul>
    <h4>Arrhythmia, lipids, anticoagulation</h4>
    <ul>
      <li>AF: rate control + anticoagulation by CHA₂DS₂-VASc; suspect embolic source (e.g. mesenteric ischaemia, normal resting ECG/echo) → <b>Holter monitor</b></li>
      <li>Post-MI on max-dose statin, LDL still above target → add <b>Ezetimibe</b> (or PCSK9 inhibitor/Evolocumab if available)</li>
      <li>Best dietary advice to ↓ CV risk → <b>Mediterranean diet</b></li>
      <li>Heparin → platelets drop ~day 5–6 + new thrombosis → <b>HIT</b> → stop heparin, start <b>Argatroban</b> (NOT warfarin/platelets)</li>
    </ul>
  </section>

  <section class="topic" dir="ltr">
    <h3>2. Respiratory</h3>
    <ul>
      <li><b>Asthma</b> (reversible obstruction): initiate <b>inhaled corticosteroid</b> as controller (SABA alone is no longer preferred). Stepwise: ICS → ICS+LABA → ↑ICS → add-on (LAMA/LTRA/biologic). Acute: O2 + SABA + ipratropium + systemic steroids; severe → IV Mg sulfate</li>
      <li><b>Cough-variant asthma</b> on ICS, residual cough worse lying down + morning hoarseness → add <b>PPI</b> (GERD)</li>
      <li><b>COPD</b> on LABA/LAMA, progressive dyspnoea, emphysema, no exacerbations → <b>home oxygen</b> (if chronic hypoxaemia); add ICS only if frequent exacerbations/eosinophilia</li>
      <li><b>CAP</b>: CURB-65 for severity; lobar pneumonia → ceftriaxone ± macrolide</li>
      <li><b>Sickle cell — acute chest syndrome</b>: chest pain + fever + new infiltrate → antibiotics + <b>exchange transfusion</b></li>
    </ul>
  </section>

  <section class="topic" dir="ltr">
    <h3>3. Gastroenterology &amp; Hepatology</h3>
    <ul>
      <li><b>Variceal bleeding</b> in cirrhosis: octreotide + endoscopic band ligation, BUT the intervention with the greatest <b>mortality benefit</b> is prophylactic <b>IV ceftriaxone</b> (prevents SBP/sepsis)</li>
      <li><b>Acute liver failure</b>: the test with greatest <b>prognostic value</b> is <b>prothrombin time / INR</b> (and albumin), not the transaminase level</li>
      <li><b>Paracetamol overdose</b>: N-acetylcysteine (± activated charcoal if early); Rumack-Matthew nomogram at 4 h</li>
      <li><b>PUD / perforated duodenal ulcer</b> from chronic NSAIDs → most important prevention is <b>stop NSAIDs</b>; test/treat H. pylori</li>
      <li><b>Choledocholithiasis</b> (RUQ pain + jaundice + abnormal LFTs) → best diagnostic = <b>MRCP</b>; therapeutic = ERCP</li>
      <li><b>Severe ulcerative colitis</b> (≥6 bloody stools/day, systemic features, negative cultures) → <b>IV methylprednisolone</b></li>
    </ul>
  </section>

  <section class="topic" dir="ltr">
    <h3>4. Endocrinology</h3>
    <ul>
      <li>DM diagnosis: fasting ≥126, random ≥200 + symptoms, HbA1c ≥6.5%; young + autoantibodies + low C-peptide → T1DM (vs MODY: strong family history, mild, AD)</li>
      <li>DKA: IV fluids (0.9% NS) + insulin 0.1 IU/kg/hr; <b>delay insulin if K &lt;3.3</b>; replace K</li>
      <li>Thyroid: hyper → beta-blocker + antithyroid (Methimazole; PTU in 1st trimester); hypo → levothyroxine</li>
      <li>Pregnancy with high TSH (hypothyroid) → <b>levothyroxine</b> (increase pre-pregnancy dose)</li>
      <li><b>Osteoporosis</b> screening risk factors: post-menopause, steroids, <b>alcoholism</b>, smoking, low BMI (obesity is protective)</li>
    </ul>
  </section>

  <section class="topic" dir="ltr">
    <h3>5. Nephrology &amp; Electrolytes</h3>
    <table>
      <thead><tr><th>Hyponatraemia</th><th>Volume</th><th>Example</th></tr></thead>
      <tbody>
        <tr><td>Hypovolaemic</td><td>↓</td><td>vomiting/diarrhoea, diuretics</td></tr>
        <tr><td>Euvolaemic</td><td>normal</td><td>SIADH, hypothyroid</td></tr>
        <tr><td>Hypervolaemic</td><td>↑</td><td>HF, cirrhosis, <b>hepatorenal syndrome</b></td></tr>
      </tbody>
    </table>
    <ul>
      <li>CKD + DM + HTN: tight BP target (≈ &lt;130/80, individualised) to reduce CV risk; ACEi/ARB renoprotective</li>
      <li>Hyperkalaemia order: Calcium gluconate (stabilise) → insulin+dextrose → salbutamol/bicarb → elimination (diuretics/Kayexalate) → dialysis</li>
    </ul>
  </section>

  <section class="topic" dir="ltr">
    <h3>6. Haematology &amp; Oncology</h3>
    <ul>
      <li>Microcytic = IDA (↓ferritin) / thalassaemia; macrocytic = B12/folate; always find the source of IDA (&gt;45 + IDA → colonoscopy)</li>
      <li>Thrombocytopenia: <b>ITP</b> (post-viral, isolated) → steroids/IVIG; <b>TTP</b> (MAHA + thrombocytopenia + neuro/renal/fever) → plasma exchange; <b>HUS</b> (E. coli O157, AKI) → supportive, no antibiotics; <b>DIC</b> → treat cause + FFP/platelets</li>
      <li><b>Tumour lysis syndrome</b> (bulky lymphoma post-chemo: ↑K, ↑PO4, ↑uric acid, ↓Ca, AKI) → prevent with <b>Rasburicase</b> (high risk) or allopurinol + hydration</li>
      <li>Sickle cell: hydroxyurea (↑HbF) + prophylactic penicillin; vaso-occlusive → analgesia + hydration</li>
    </ul>
  </section>

  <section class="topic" dir="ltr">
    <h3>7. Rheumatology</h3>
    <ul>
      <li><b>RA</b> on methotrexate with persistent erosive active disease → add a <b>biologic (anti-TNF, e.g. Adalimumab)</b></li>
      <li><b>SLE</b> (arthritis, oral ulcers, low C3/C4, +ANA/anti-dsDNA): <b>Hydroxychloroquine</b> reduces flares &amp; vascular risk for all patients</li>
      <li>Gout (negatively birefringent needles) → NSAIDs/colchicine acute, urate-lowering later; Pseudogout (positively birefringent rhomboids, CPPD)</li>
      <li>Giant cell arteritis: headache + jaw claudication + ↑ESR → high-dose steroids immediately, then biopsy</li>
    </ul>
  </section>

  <section class="topic" dir="ltr">
    <h3>8. Neurology</h3>
    <table>
      <thead><tr><th>Intracranial bleed</th><th>CT appearance</th><th>Typical</th></tr></thead>
      <tbody>
        <tr><td>Epidural</td><td>biconvex (lens), does not cross sutures</td><td>lucid interval, middle meningeal artery</td></tr>
        <tr><td>Subdural</td><td><b>crescent-shaped</b>, crosses sutures</td><td>elderly/alcoholic, fall, confusion</td></tr>
        <tr><td>SAH</td><td>blood in basal cisterns</td><td>thunderclap "worst headache"</td></tr>
      </tbody>
    </table>
    <ul>
      <li>Acute ischaemic stroke: CT to exclude bleed → thrombolysis &lt;4.5 h / thrombectomy for LVO</li>
      <li>Cord compression (back pain + sensory level + weakness + bladder) → urgent <b>MRI spine</b> + steroids</li>
      <li>Seizures: focal → carbamazepine/levetiracetam; generalised → valproate/levetiracetam; status → benzodiazepine first</li>
    </ul>
  </section>

  <section class="topic" dir="ltr">
    <h3>9. Infectious Disease &amp; Sepsis</h3>
    <ul>
      <li><b>Septic shock</b>: after 30 ml/kg crystalloid the BP remains low → start <b>Norepinephrine</b> (first-line vasopressor); add hydrocortisone if refractory</li>
      <li>Empirical antibiotics within 1 h + blood cultures + lactate + source control</li>
      <li>Needlestick transmission risk: HBV ≫ HCV (~3%) ≫ HIV (~0.3%)</li>
      <li>Antibiotic stewardship: de-escalate / stop the unnecessary agent once stable (e.g. stop redundant antibiotic)</li>
    </ul>
  </section>

  <section class="topic" dir="ltr">
    <h3>10. Psychiatry</h3>
    <ul>
      <li>Social phobia / anxiety, low self-esteem from social-media comparison → <b>Cognitive Behavioural Therapy</b> (± limit social media)</li>
      <li>Alzheimer/dementia with prominent <b>visual hallucinations</b> (think Lewy body) on donepezil → add low-dose <b>Quetiapine</b> (avoid typical antipsychotics)</li>
      <li>Postpartum: <b>blues</b> (&lt;2 wks, self-limited) → reassurance/support; <b>depression</b> → SSRI ± therapy; <b>psychosis</b> → emergency admission</li>
      <li>Major depression with suicidal ideation → ensure safety; confidentiality maintained within the mental-health team</li>
    </ul>
  </section>

  <section class="topic" dir="ltr">
    <h3>11. Ethics, Biostatistics &amp; Preventive Medicine</h3>
    <ul>
      <li>Removing/altering data to improve results violates <b>Integrity</b> (research misconduct)</li>
      <li>Combining numerical results of previous studies for a precise pooled estimate → <b>Meta-analysis</b> (vs systematic review = qualitative synthesis)</li>
      <li><b>Odds ratio</b> = (a×d)/(b×c) from the 2×2 table; <b>mode</b> = most frequent value</li>
      <li>IOM quality domains: Safe, Timely, Effective, Efficient, Equitable, <b>Patient-centred</b> (e.g. improving appointment adherence)</li>
      <li>Granting clinical privileges → based on <b>demonstrated competency</b>, not certificate/experience alone</li>
      <li>Outbreak investigation: characterise (person/place/time) → generate hypothesis (often <b>case-control</b>) → test → control</li>
      <li>Adult vaccines: annual influenza; pneumococcal &amp; <b>herpes zoster (shingles)</b> for older/COPD patients</li>
    </ul>
  </section>
</div>
`;
