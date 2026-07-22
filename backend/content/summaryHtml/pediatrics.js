// Pediatrics topic summary — HTML content served (gated) to the in-app viewer.
// Source: the user's "Pediatrics SMLE Summary.pdf" (Nelson Essentials 7th Ed.-based).
// Angle brackets in clinical text are HTML-escaped (&lt; / &gt;).
export default `
<div class="sum-doc" dir="rtl">
  <div class="sum-head">
    <h2>طب الأطفال — ملخص عالي العائد (SMLE)</h2>
    <p class="sum-meta">مبني على Nelson Essentials of Pediatrics (7th Ed.). للمراجعة الامتحانية فقط.</p>
  </div>

  <div class="sum-callout" dir="ltr">
    <b>SMLE TIPS</b>
    <ul>
      <li>Echo (TTE) = confirmatory for all CHD</li>
      <li>CXR: Boot (TOF), Egg (TGA), Snowman (TAPVR)</li>
      <li>Fixed wide split S2 = ASD · Squatting relieves TOF spells</li>
      <li>Always Prostaglandin E1 for duct-dependent lesions</li>
    </ul>
  </div>

  <section class="topic" dir="ltr">
    <h3>Cardiology — Congenital Heart Disease</h3>
    <table>
      <thead><tr><th>Category</th><th>Lesion</th><th>Key feature</th><th>CXR/ECG clue</th></tr></thead>
      <tbody>
        <tr><td>Acyanotic (L→R)</td><td>VSD</td><td>Harsh systolic murmur LLSB; large = FTT</td><td>LVH/BiVH</td></tr>
        <tr><td>Acyanotic (L→R)</td><td>ASD</td><td>Fixed wide split S2; LUSB systolic murmur</td><td>RAD/RBBB</td></tr>
        <tr><td>Acyanotic (L→R)</td><td>PDA</td><td>Continuous machine murmur; bounding pulse</td><td>LVH; cardiomegaly</td></tr>
        <tr><td>Obstructive</td><td>CoA</td><td>BP upper &gt; lower; weak femoral pulse</td><td>Rib notching</td></tr>
        <tr><td>Cyanotic (R→L)</td><td>TOF</td><td>Boot-shaped heart; Tet spells relieved by squatting</td><td>RVH; RAD</td></tr>
        <tr><td>Cyanotic (R→L)</td><td>TGA</td><td>Egg-shaped heart; immediate neonatal cyanosis</td><td>↑vascularity</td></tr>
        <tr><td>Cyanotic (R→L)</td><td>Truncus</td><td>Single arterial trunk; early CHF + cyanosis</td><td>Cardiomegaly</td></tr>
      </tbody>
    </table>
    <ul>
      <li><b>VSD</b> (MC CHD): small → observe (may close); large → diuretics, surgery if not improving 6–12 mo. Eisenmenger = L→R reverses to R→L (inoperable)</li>
      <li><b>ASD</b>: wide FIXED split S2; secundum → transcatheter closure; others → surgery at 4–5 yrs</li>
      <li><b>TOF</b> (MC cyanotic &gt;1 yr): PROVE (PS + RVH + Overriding aorta + VSD); Tet spell → O2, knee-chest, morphine, IV propranolol, IV fluids; repair 3–6 mo</li>
      <li><b>TGA</b>: profound cyanosis at birth, no improvement with 100% O2 → PGE1 (life-saving) → balloon atrial septostomy → arterial switch within 2 wks</li>
      <li><b>CoA</b>: differential cyanosis, weak femoral pulse, BP upper≫lower; assoc Turner + bicuspid AV → PGE1 → manage HF → repair/balloon</li>
    </ul>
    <h4>Rheumatic fever (Jones)</h4>
    <ul>
      <li>Major (SPACE): Sydenham chorea, Polyarthritis migratory, Carditis (most dangerous), Erythema marginatum, Subcutaneous nodules</li>
      <li>Minor: fever, ↑ESR/CRP, prolonged PR, arthralgia; + evidence of GAS (ASO/throat culture)</li>
      <li>2 major OR 1 major + 2 minor + GAS evidence = diagnosis</li>
      <li>Tx: IM benzathine penicillin; Aspirin (arthritis); steroids (severe carditis); monthly penicillin prophylaxis</li>
    </ul>
  </section>

  <section class="topic" dir="ltr">
    <h3>Endocrinology</h3>
    <ul>
      <li><b>T1DM</b>: polyuria/polydipsia/polyphagia + weight loss; anti-GAD/islet Ab; fasting ≥126, random ≥200, HbA1c ≥6.5% → basal-bolus insulin</li>
      <li><b>DKA</b>: dehydration, Kussmaul breathing, fruity breath; glucose &gt;200, pH &lt;7.3, HCO3 &lt;15, ketones → 0.9% NS bolus + IV insulin 0.1 IU/kg/hr (delay if K &lt;3.3). <b>Cerebral edema = most feared</b> → mannitol/hypertonic saline; avoid rapid fluids</li>
      <li><b>CAH</b> (21-hydroxylase def, AR): ↑17-OHP; ambiguous genitalia (girls); salt-wasting (↓Na, ↑K, shock) → hydrocortisone + fludrocortisone + fluids</li>
      <li><b>DI</b>: polyuria (dilute), hypernatraemia; water deprivation → central responds to DDAVP, nephrogenic does not (thiazides + low Na/protein)</li>
    </ul>
    <table>
      <thead><tr><th>Thyroid</th><th>Hypo</th><th>Hyper (Graves)</th></tr></thead>
      <tbody>
        <tr><td>Cause</td><td>Hashimoto (anti-TPO)</td><td>Graves (TSI)</td></tr>
        <tr><td>C/P</td><td>weight gain, cold intolerance, constipation, delayed DTR</td><td>weight loss, heat intolerance, tachycardia, exophthalmos, goiter</td></tr>
        <tr><td>Congenital</td><td>prolonged jaundice, large tongue, umbilical hernia, hypotonia</td><td>neonatal Graves (maternal Ab)</td></tr>
        <tr><td>Tx</td><td>Levothyroxine</td><td>PTU/Methimazole; beta-blocker; radioiodine/surgery</td></tr>
      </tbody>
    </table>
    <div class="sum-callout">SHORT STATURE: bone age is the KEY initial test. Constitutional delay (MC, +FHx) vs GH deficiency (↓IGF-1 → GH therapy) vs hypothyroidism (TSH) vs Turner (karyotype). Precocious puberty: girls &lt;8, boys &lt;9 → GnRH agonist (leuprolide) for central.</div>
  </section>

  <section class="topic" dir="ltr">
    <h3>Gastroenterology</h3>
    <ul>
      <li><b>GERD vs pyloric stenosis</b>: physiologic GERD = normal exam/weight → reassurance; pathologic → PPI. Pyloric stenosis: 2–8 wk, non-bilious PROJECTILE vomiting, hungry, olive mass → US + single bubble AXR → <b>hypochloraemic hypokalaemic metabolic ALKALOSIS</b> → correct electrolytes FIRST → pyloromyotomy</li>
      <li><b>Intussusception</b>: 6 mo–3 yr, colicky pain knees-to-chest, currant-jelly stool, sausage RUQ mass → US target sign → air/barium enema (diagnostic + therapeutic, 80–90%); surgery if peritonitis/perforation/failed</li>
      <li><b>Hirschsprung</b>: failure to pass meconium &lt;48 hr, aganglionic rectosigmoid → barium enema transition zone, suction rectal biopsy (gold standard) → pull-through</li>
      <li><b>NEC</b>: prematurity + formula; feeding intolerance, distension, rectal bleeding; <b>pneumatosis intestinalis</b> on AXR → NPO, IV ampicillin + gentamicin + metronidazole; surgery if perforation</li>
      <li><b>Celiac</b>: gluten sensitivity → anti-tTG IgA (screen), duodenal biopsy villous atrophy (gold standard) → gluten-free diet (assoc Down, Turner, T1DM)</li>
      <li><b>Appendicitis</b>: children/pregnant → US first; non-pregnant adults → CT</li>
      <li><b>Biliary atresia</b>: neonatal jaundice + pale stools → US/HIDA/biopsy → Kasai &lt;60 days</li>
      <li>Hepatitis A: faecal-oral, no chronicity, supportive; Hepatitis B: perinatal (MC in children) → HBIG + vaccine at birth</li>
    </ul>
    <table>
      <thead><tr><th>IBD</th><th>Crohn's</th><th>UC</th></tr></thead>
      <tbody>
        <tr><td>Site</td><td>mouth→anus; transmural; skip lesions</td><td>colon only; mucosal; continuous from rectum</td></tr>
        <tr><td>C/P</td><td>RLQ pain, fistulas, perianal disease</td><td>bloody diarrhoea, tenesmus, mucus</td></tr>
        <tr><td>Biopsy</td><td>granulomas; cobblestone</td><td>crypt abscesses; continuous</td></tr>
        <tr><td>Key</td><td>MRI enterography; anti-TNF</td><td>PSC association; colectomy curative</td></tr>
      </tbody>
    </table>
  </section>

  <section class="topic" dir="ltr">
    <h3>Growth, Development &amp; General Pediatrics</h3>
    <table>
      <thead><tr><th>Age</th><th>Gross motor</th><th>Language</th><th>Social</th></tr></thead>
      <tbody>
        <tr><td>2 mo</td><td>lifts head 45°</td><td>coos</td><td>social smile</td></tr>
        <tr><td>6 mo</td><td>sits with support; rolls both ways</td><td>babbles</td><td>stranger anxiety begins</td></tr>
        <tr><td>9 mo</td><td>stands with support; cruises</td><td>mama/dada (non-specific)</td><td>separation anxiety</td></tr>
        <tr><td>12 mo</td><td>walks alone</td><td>1–3 words</td><td>waves bye-bye</td></tr>
        <tr><td>18 mo</td><td>runs; up stairs</td><td>10–25 words</td><td>parallel play</td></tr>
        <tr><td>2 yr</td><td>jumps; kicks ball</td><td>2-word phrases; 50+ words</td><td>associative play</td></tr>
        <tr><td>3 yr</td><td>tricycle; copies circle</td><td>3-word sentences</td><td>group play</td></tr>
        <tr><td>4 yr</td><td>hops 1 foot; copies cross</td><td>tells stories</td><td>cooperative play</td></tr>
      </tbody>
    </table>
    <h4>Primitive reflexes</h4>
    <ul>
      <li>Moro (birth→4–6 mo): absent = brachial plexus injury; asymmetric = clavicle fracture</li>
      <li>Palmar grasp / tonic neck persistence → cerebral palsy</li>
      <li>Babinski: positive normal &lt;2 yr; positive after 2 yr = UMN lesion</li>
      <li>Parachute (8–9 mo, stays): absence = neurological issue</li>
    </ul>
    <div class="sum-callout"><b>SIDS</b>: peak 2–4 mo; prone sleeping strongest risk → <b>supine "Back to Sleep"</b> (best prevention), firm flat surface, room-sharing not bed-sharing, pacifier, avoid smoking/overheating.</div>
    <div class="sum-callout"><b>Infantile colic</b>: crying &gt;3 hr/day, &gt;3 days/wk, &gt;3 wks (Rule of 3s); healthy infant → supportive; self-resolves by 3–4 mo.</div>
    <table>
      <thead><tr><th>Syndrome</th><th>Genetics</th><th>Key features / associations</th></tr></thead>
      <tbody>
        <tr><td>Down</td><td>Trisomy 21</td><td>flat face, single palmar crease, hypotonia; AVSD, duodenal atresia, Hirschsprung, ALL, hypothyroidism</td></tr>
        <tr><td>Turner</td><td>45,X</td><td>short stature, webbed neck, primary amenorrhea; CoA, bicuspid AV, horseshoe kidney</td></tr>
        <tr><td>Klinefelter</td><td>47,XXY</td><td>tall, small testes, infertility, gynecomastia → testosterone</td></tr>
        <tr><td>Marfan</td><td>FBN1 (AD)</td><td>tall, arachnodactyly, lens subluxation; aortic root dilation → echo + beta-blocker</td></tr>
        <tr><td>Fragile X</td><td>FMR1 CGG</td><td>MC inherited intellectual disability; macroorchidism, long face</td></tr>
        <tr><td>NF1</td><td>chr 17 (AD)</td><td>≥6 café-au-lait, axillary freckling, Lisch nodules; optic glioma</td></tr>
      </tbody>
    </table>
    <div class="sum-callout"><b>Dehydration / fluids</b>: Mild → ORS 50 ml/kg; moderate → ORS 100 ml/kg; severe (≥10%, AMS) → IV NS 20 ml/kg bolus. Holliday-Segar maintenance: 100/50/20 ml/kg/day for first 10 / next 10 / each kg &gt;20.</div>
  </section>

  <section class="topic" dir="ltr">
    <h3>Hematology &amp; Oncology</h3>
    <table>
      <thead><tr><th>Anemia</th><th>MCV</th><th>Key lab</th><th>Tx</th></tr></thead>
      <tbody>
        <tr><td>IDA</td><td>low</td><td>↓ferritin, ↑TIBC, ↑RDW</td><td>oral iron; find blood loss</td></tr>
        <tr><td>Thalassemia</td><td>low</td><td>normal/↑ferritin; ↑HbA2 (β)</td><td>transfusion (major); folate</td></tr>
        <tr><td>B12/folate</td><td>high</td><td>hypersegmented neutrophils</td><td>B12 IM / folate</td></tr>
        <tr><td>Hemolytic</td><td>normal/high</td><td>↑LDH, ↑indirect bili, ↑retics</td><td>treat cause; transfuse</td></tr>
        <tr><td>Aplastic</td><td>normal</td><td>pancytopenia; ↓retics</td><td>BMT / immunosuppression</td></tr>
      </tbody>
    </table>
    <ul>
      <li><b>Sickle cell</b>: vaso-occlusive crisis → analgesia/opioids + IV hydration + O2; aplastic (Parvovirus B19); splenic sequestration → urgent transfusion; acute chest → antibiotics + exchange transfusion. Prevention: hydroxyurea + prophylactic penicillin until age 5</li>
    </ul>
    <table>
      <thead><tr><th>Disorder</th><th>Platelet</th><th>PT/PTT</th><th>Key / Tx</th></tr></thead>
      <tbody>
        <tr><td>ITP</td><td>↓↓</td><td>normal</td><td>post-viral; no splenomegaly → IVIG/steroids</td></tr>
        <tr><td>HUS</td><td>↓↓</td><td>normal</td><td>E. coli O157:H7; hemolysis + AKI → supportive, <b>NO antibiotics</b></td></tr>
        <tr><td>DIC</td><td>↓↓</td><td>↑↑</td><td>↓fibrinogen → FFP, platelets, treat cause</td></tr>
        <tr><td>Hemophilia A/B</td><td>normal</td><td>↑PTT only</td><td>Factor VIII / IX replacement; avoid aspirin</td></tr>
        <tr><td>Von Willebrand</td><td>normal/↓</td><td>↑PTT</td><td>MC inherited bleeding disorder → DDAVP (type 1)</td></tr>
      </tbody>
    </table>
    <table>
      <thead><tr><th>Tumor</th><th>Age</th><th>Clue</th></tr></thead>
      <tbody>
        <tr><td>ALL (MC)</td><td>2–5 yr</td><td>pallor, bruising, bone pain, HSM; Down assoc</td></tr>
        <tr><td>AML</td><td>any</td><td>Auer rods; gum hyperplasia (M5)</td></tr>
        <tr><td>Wilms</td><td>3–5 yr</td><td>abdominal mass; WAGR, WT1 → nephrectomy + chemo</td></tr>
        <tr><td>Neuroblastoma</td><td>&lt;5 yr</td><td>mass + calcifications; raccoon eyes; ↑urinary catecholamines; N-MYC</td></tr>
        <tr><td>Hodgkin</td><td>15–25 yr</td><td>painless cervical LAD + B symptoms; Reed-Sternberg</td></tr>
        <tr><td>Medulloblastoma</td><td>5–10 yr</td><td>posterior fossa; morning headache, ataxia (MC malignant brain tumor)</td></tr>
      </tbody>
    </table>
  </section>

  <section class="topic" dir="ltr">
    <h3>Immunology &amp; Neonatology</h3>
    <ul>
      <li>SCID: presents &lt;6 mo, all organisms → BMT (curative)</li>
      <li>X-linked agammaglobulinemia (Bruton): bacterial from 6–9 mo, absent B cells → IVIG</li>
      <li>DiGeorge (22q11): thymic aplasia, hypocalcaemia, cardiac defects → FISH 22q11</li>
      <li>Chronic granulomatous disease: catalase-positive organisms → DHR/NBT test → TMP-SMX + itraconazole + IFN-γ</li>
      <li>Wiskott-Aldrich: eczema + thrombocytopenia + infections (small platelets) → BMT</li>
    </ul>
    <table>
      <thead><tr><th>Neonatal</th><th>Clue</th><th>Management</th></tr></thead>
      <tbody>
        <tr><td>TTN</td><td>C-section; fluid in fissures; resolves 24–72 hr</td><td>supportive O2</td></tr>
        <tr><td>RDS</td><td>premature; ground-glass + air bronchograms</td><td>surfactant + CPAP; prevent: antenatal steroids</td></tr>
        <tr><td>Meconium aspiration</td><td>post-term; hyperinflation + patchy infiltrates</td><td>suction, ventilation; ECMO if refractory</td></tr>
        <tr><td>Sepsis &lt;72 hr</td><td>GBS, E. coli</td><td>Ampicillin + Gentamicin</td></tr>
        <tr><td>Sepsis &gt;72 hr</td><td>Staph epidermidis, Listeria</td><td>Vancomycin + Gentamicin</td></tr>
      </tbody>
    </table>
  </section>

  <section class="topic" dir="ltr">
    <h3>Nephrology</h3>
    <ul>
      <li><b>Nephrotic</b> ("too much protein"): proteinuria &gt;3.5 g/day, periorbital/pitting edema, hypoalbuminemia, hyperlipidemia, fatty casts. MC child = Minimal Change Disease → prednisone (tacrolimus if steroid-resistant)</li>
      <li><b>Nephritic</b> ("blood + inflammation"): hematuria (tea/cola urine), HTN, oliguria, RBC casts. PSGN: 1–6 wk post-GAS, ↓C3 normal C4, +ASO → supportive. IgA nephropathy (Berger): hematuria during/after URI (synpharyngitic), normal C3</li>
      <li>UTI: gold standard urine culture (midstream ≥100,000 CFU); empiric TMP-SMX/cephalosporin; after first UTI → renal US, VCUG if abnormal/recurrent (VUR = MC structural abnormality)</li>
      <li>Nocturnal enuresis &gt;5 yr → reassurance + behavioral; DDAVP or alarm therapy (most effective long-term)</li>
    </ul>
    <div class="sum-callout">RBC casts = nephritic · Fatty casts = nephrotic · Waxy/broad casts = chronic renal failure.</div>
  </section>

  <section class="topic" dir="ltr">
    <h3>Neurology</h3>
    <table>
      <thead><tr><th>Seizure</th><th>Clue</th><th>Treatment</th></tr></thead>
      <tbody>
        <tr><td>Generalized tonic-clonic</td><td>full LOC, post-ictal confusion</td><td>valproate / levetiracetam</td></tr>
        <tr><td>Absence (petit mal)</td><td>3 Hz spike-wave; provoked by hyperventilation</td><td>ethosuximide</td></tr>
        <tr><td>Infantile spasms (West)</td><td>&lt;1 yr; hypsarrhythmia; regression</td><td>ACTH or vigabatrin</td></tr>
        <tr><td>Febrile (simple)</td><td>&lt;15 min, 6 mo–5 yr</td><td>reassurance + antipyretics; NO anticonvulsants</td></tr>
        <tr><td>Status epilepticus</td><td>&gt;5 min</td><td>benzo → phenytoin/LEV → phenobarb → ICU</td></tr>
      </tbody>
    </table>
    <ul>
      <li><b>Meningitis</b>: nuchal rigidity, Kernig/Brudzinski, photophobia; petechiae/purpura → meningococcal. LP (CT first if focal deficit/↑ICP). Bacterial: ↑PMN, ↑protein, ↓glucose. Empiric: Ceftriaxone + Vancomycin + Dexamethasone; neonates add Ampicillin (Listeria). Prophylaxis contacts: Rifampin. <b>Purpuric rash + shock → antibiotics IMMEDIATELY before LP</b></li>
      <li><b>MG</b>: AChR Ab, ptosis/diplopia worse with activity, normal reflexes → pyridostigmine; crisis → IVIG/plasmapheresis</li>
      <li><b>GBS</b>: ascending weakness + areflexia, post-Campylobacter; CSF cytoalbuminous dissociation (↑protein, normal WBC) → IVIG/plasmapheresis (NO steroids); monitor FVC</li>
      <li><b>Cerebral palsy</b>: non-progressive perinatal injury; spastic MC → MRI; PT/OT, baclofen, botulinum; ophthalmology eval</li>
    </ul>
  </section>

  <section class="topic" dir="ltr">
    <h3>Pulmonology</h3>
    <ul>
      <li><b>Asthma</b>: nocturnal dry cough, end-expiratory wheeze, atopy. Spirometry FEV1/FVC &lt;0.7, reversibility ↑≥12%. Acute: O2 + SABA + ipratropium + systemic steroids; severe → IV Mg sulfate. Stepwise: PRN SABA → low ICS → ICS+LABA → med/high ICS+LABA → omalizumab. <b>Silent chest = impending respiratory failure</b></li>
      <li><b>Cystic fibrosis</b>: CFTR (chr 7, ΔF508, AR); chronic wet cough, meconium ileus, steatorrhea, recurrent pneumonia (Pseudomonas/Staph), male infertility. Sweat chloride &gt;60 (diagnostic); IRT newborn screen → airway clearance, dornase alfa, CFTR modulators, pancreatic enzymes + ADEK</li>
    </ul>
    <table>
      <thead><tr><th>Condition</th><th>Clue</th><th>Management</th></tr></thead>
      <tbody>
        <tr><td>Croup</td><td>parainfluenza; barking cough, stridor; steeple sign</td><td>dexamethasone; severe → racemic epinephrine</td></tr>
        <tr><td>Epiglottitis</td><td>Hib; high fever, drooling, tripod; thumbprint sign</td><td><b>DO NOT examine throat</b>; secure airway → ceftriaxone</td></tr>
        <tr><td>Bronchiolitis</td><td>RSV; &lt;2 yr; crackles + wheeze</td><td>supportive O2; palivizumab for high-risk preterm</td></tr>
        <tr><td>Laryngomalacia</td><td>MC cause of stridor in infants; worse supine</td><td>self-limiting by 12–24 mo; reassurance</td></tr>
      </tbody>
    </table>
  </section>

  <section class="topic" dir="ltr">
    <h3>Rheumatology</h3>
    <ul>
      <li><b>JIA</b>: arthritis &gt;6 wks, &lt;16 yr; systemic JIA = fever + salmon rash + arthritis → NSAIDs + methotrexate + biologic</li>
      <li><b>SLE</b> (SOAP BRAIN MD): ANA (sensitive), anti-dsDNA &amp; anti-Smith (specific), ↓C3/C4 → HCQ, steroids, immunosuppression</li>
      <li><b>HSP (IgA vasculitis)</b>: palpable purpura (buttocks/legs) + arthritis + abdominal pain + nephritis; normal platelets → supportive; steroids for severe</li>
      <li><b>Kawasaki</b>: fever &gt;5 d + 4/5 (conjunctivitis, mucositis, rash, LAD, extremity changes); coronary aneurysm = most serious → IVIG + Aspirin within 10 days; echo at dx + 2 wks</li>
    </ul>
  </section>

  <section class="topic" dir="ltr">
    <h3>Infectious Diseases — Childhood Exanthems</h3>
    <table>
      <thead><tr><th>Disease</th><th>Pathogen</th><th>Rash / key</th></tr></thead>
      <tbody>
        <tr><td>Measles</td><td>Paramyxovirus</td><td>Koplik spots; 3Cs (coryza, cough, conjunctivitis); descending rash</td></tr>
        <tr><td>Rubella</td><td>Togavirus</td><td>post-auricular LAD; TERATOGENIC (1st trimester)</td></tr>
        <tr><td>Varicella</td><td>VZV</td><td>pleomorphic (all stages); acyclovir if severe/immunocompromised</td></tr>
        <tr><td>Roseola</td><td>HHV-6</td><td>high fever 3–5 d → rash after fever breaks; MC febrile seizure</td></tr>
        <tr><td>Fifth disease</td><td>Parvovirus B19</td><td>slapped cheek; aplastic crisis in SCD; hydrops in pregnancy</td></tr>
        <tr><td>Scarlet fever</td><td>GAS</td><td>sandpaper rash, strawberry tongue, Pastia lines → penicillin</td></tr>
        <tr><td>Hand-foot-mouth</td><td>Coxsackie A16</td><td>oral ulcers + palms/soles rash; supportive</td></tr>
      </tbody>
    </table>
    <ul>
      <li>Pertussis: catarrhal → paroxysmal whoop + post-tussive vomiting → nasopharyngeal PCR → macrolides (treat + prophylaxis)</li>
      <li>Otitis media: S. pneumoniae MC; &lt;2 yr always antibiotics (amoxicillin); &gt;2 yr only if severe</li>
      <li>Bloody diarrhoea: E. coli O157:H7 (NO antibiotics — HUS risk), Salmonella, Shigella, Campylobacter</li>
      <li>Giardia: greasy stool, campers/daycare → metronidazole; H. pylori → urea breath test → triple therapy (PPI + amoxicillin + clarithromycin)</li>
      <li>Septic arthritis: hip MC, refuses to bear weight → arthrocentesis (WBC &gt;50,000) → Staph aureus → vancomycin (+ ceftriaxone neonates)</li>
    </ul>
  </section>

  <section class="topic" dir="ltr">
    <h3>Vaccination (Saudi schedule highlights)</h3>
    <ul>
      <li>Birth: BCG, HepB-1 · 2/4/6 mo: DTaP, IPV, Hib, PCV, Rota (+HepB) · 12 mo: MMR-1, Varicella-1, HepA-1 · 18 mo: DTaP-4, HepA-2, Varicella-2 · 4–6 yr: DTaP-5, IPV-4, MMR-2 · 11–12 yr: Tdap, HPV, MenACWY · annually: influenza from 6 mo</li>
    </ul>
    <div class="sum-callout">
      <b>VACCINE RULES</b>: All viral vaccines LIVE except HepB, HepA, IPV, inactivated influenza, HPV. All bacterial vaccines KILLED except BCG &amp; oral typhoid (live). Toxoids: diphtheria, tetanus. Live vaccines contraindicated in immunocompromised &amp; pregnancy. NOT contraindications: mild illness, recent antibiotics, stable chronic disease.
    </div>
  </section>

  <section class="topic" dir="ltr">
    <h3>ER/ICU — Shock &amp; Toxicology</h3>
    <table>
      <thead><tr><th>Shock</th><th>Key features</th><th>Treatment</th></tr></thead>
      <tbody>
        <tr><td>Septic</td><td>warm early, cool late; ↓SVR</td><td>30 ml/kg NS + antibiotics + norepinephrine</td></tr>
        <tr><td>Hypovolemic</td><td>cool extremities; ↑HR</td><td>crystalloid bolus; blood if hemorrhage</td></tr>
        <tr><td>Cardiogenic</td><td>pulmonary edema, ↑JVP</td><td>dobutamine; diuretics</td></tr>
        <tr><td>Obstructive</td><td>tension PTX / tamponade</td><td>needle decompression / pericardiocentesis</td></tr>
        <tr><td>Anaphylactic</td><td>urticaria, bronchospasm, ↓BP</td><td>IM epinephrine (1st line)</td></tr>
      </tbody>
    </table>
    <table>
      <thead><tr><th>Toxin</th><th>Antidote</th></tr></thead>
      <tbody>
        <tr><td>Paracetamol</td><td>N-acetylcysteine (best &lt;8–10 hr; Rumack-Matthew nomogram)</td></tr>
        <tr><td>Opioids</td><td>Naloxone</td></tr>
        <tr><td>Organophosphates</td><td>Atropine + Pralidoxime (SLUDGE/DUMBELS)</td></tr>
        <tr><td>TCAs</td><td>Sodium bicarbonate (wide QRS)</td></tr>
        <tr><td>Iron</td><td>Deferoxamine</td></tr>
        <tr><td>Lead</td><td>chelation (DMSA; CaNa2EDTA + dimercaprol if encephalopathy)</td></tr>
      </tbody>
    </table>
    <div class="sum-callout">Foreign body: airway below cords → rigid bronchoscopy; oesophageal coin (en face on AP) → flexible endoscopy; <b>button battery = emergency</b>.</div>
  </section>

  <section class="topic" dir="ltr">
    <h3>Urology, Orthopedics &amp; Ophthalmology</h3>
    <ul>
      <li>Cryptorchidism → orchidopexy at 6–18 mo; Hypospadias → repair 6–18 mo, NO neonatal circumcision</li>
      <li><b>Testicular torsion</b>: absent cremasteric reflex, high-riding testis → surgical exploration within 6 hr (salvage 100% &lt;6 hr → 10% &gt;24 hr)</li>
      <li>Legg-Calvé-Perthes (4–10 yr, painless limp) vs SCFE (obese adolescent; "ice cream off cone" → pin fixation)</li>
      <li>DDH: Barlow/Ortolani → US &lt;6 mo → Pavlik harness</li>
      <li>Osgood-Schlatter: tibial tuberosity pain → rest/NSAIDs (self-limiting)</li>
      <li><b>Retinoblastoma</b>: leukocoria (white reflex) → urgent ophthalmology; Rb gene 13q14</li>
      <li>Orbital cellulitis (proptosis, restricted EOM, pain on movement) → CT + IV antibiotics ± surgery; periorbital → oral antibiotics</li>
    </ul>
  </section>

  <section class="topic" dir="ltr">
    <h3>Rapid-Fire Must-Know Associations</h3>
    <table>
      <thead><tr><th>Condition</th><th>Buzzword</th></tr></thead>
      <tbody>
        <tr><td>TOF</td><td>boot-shaped heart + Tet spells relieved by squatting</td></tr>
        <tr><td>TGA</td><td>egg-shaped heart + PGE1 emergency</td></tr>
        <tr><td>ASD</td><td>fixed wide split S2</td></tr>
        <tr><td>Pyloric stenosis</td><td>2–8 wk, projectile vomiting, hypochloraemic metabolic ALKALOSIS</td></tr>
        <tr><td>Intussusception</td><td>currant-jelly stool + target sign → air enema</td></tr>
        <tr><td>Hirschsprung</td><td>no meconium &lt;48 hr → suction rectal biopsy</td></tr>
        <tr><td>HUS</td><td>E. coli O157:H7 + AKI → NO antibiotics</td></tr>
        <tr><td>Croup</td><td>barking cough + steeple sign → dexamethasone</td></tr>
        <tr><td>Epiglottitis</td><td>thumbprint sign + drooling → secure airway first</td></tr>
        <tr><td>Measles</td><td>Koplik spots + 3Cs</td></tr>
        <tr><td>Kawasaki</td><td>strawberry tongue + coronary aneurysm → IVIG + Aspirin</td></tr>
        <tr><td>DKA</td><td>watch for cerebral edema</td></tr>
        <tr><td>PSGN</td><td>post-GAS + RBC casts + ↓C3</td></tr>
        <tr><td>Retinoblastoma</td><td>leukocoria → urgent referral</td></tr>
        <tr><td>SIDS</td><td>peak 2–4 mo → Back to Sleep</td></tr>
        <tr><td>GBS</td><td>ascending paralysis + ↑CSF protein → IVIG</td></tr>
      </tbody>
    </table>
  </section>
</div>
`;
