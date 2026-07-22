// Surgery topic summary — HTML content served (gated) to the in-app viewer.
// Source: the user's Surgical_Summary.pdf (Bailey & Love 26th Ed.-based study file).
// Authored as an HTML string so it bundles reliably on serverless. Angle brackets
// in clinical text are HTML-escaped (&lt; / &gt;).
export default `
<div class="sum-doc" dir="rtl">
  <div class="sum-head">
    <h2>الجراحة — ملخص شامل</h2>
    <p class="sum-meta">مبني على ملفك الدراسي وكتاب Bailey &amp; Love's Short Practice of Surgery (26th Ed.). للمراجعة الامتحانية فقط — راجع دائماً مع مرجعك المعتمد.</p>
    <p class="sum-meta">المواضيع: القولون والمستقيم · الثدي · الأوعية · الغدد الصماء · الجهاز الهضمي · الكبد والبنكرياس · الإصابات · العظام · المسالك · الأطفال · التجميل · العناية حول العملية.</p>
  </div>

  <section class="topic" dir="ltr">
    <h3>1. Hemorrhoids</h3>
    <h4>Internal hemorrhoids</h4>
    <ul>
      <li><b>Painless bright red rectal bleeding</b> after defecation (KEY sign)</li>
      <li>Perianal mass at 3, 7, 11 o'clock; pruritus, perianal discharge</li>
      <li>Classified Grades I–IV (Bailey &amp; Love)</li>
    </ul>
    <h4>External hemorrhoids</h4>
    <ul><li>Severe perianal pain; tender purplish mucosal mass</li></ul>
    <h4>Diagnosis &amp; management</h4>
    <ul>
      <li>History + DRE + Anoscopy ± Proctoscopy; Colonoscopy if age &gt;45, risk factors or red flags</li>
      <li>Grade I–III → rubber band ligation / sclerotherapy (internal only)</li>
      <li>Grade IV → open hemorrhoidectomy</li>
      <li>External → surgical excision if &lt;3–4 days; medical if late</li>
      <li>Post-op complications: pain, urinary retention, fecal impaction, bleeding</li>
    </ul>
    <div class="sum-callout">
      <b>KEY POINTS</b>
      <ul>
        <li>Sclerotherapy/banding → INTERNAL hemorrhoids only</li>
        <li>External thrombosed → excision if &lt;72–96 hrs</li>
        <li>Rule out colorectal cancer in any patient &gt;45 with rectal bleeding</li>
      </ul>
    </div>
  </section>

  <section class="topic" dir="ltr">
    <h3>2. Anal Diseases</h3>
    <h4>Anal fissure</h4>
    <ul>
      <li>C/P: sharp severe pain during defecation, bright red blood, pruritus, constipation</li>
      <li>Location: posterior midline (6 o'clock) &gt; anterior (12 o'clock)</li>
      <li>Acute (&lt;6 wks) → lifestyle + topical CCB (Diltiazem)</li>
      <li>Chronic (&gt;6 wks) → lateral internal sphincterotomy (gold standard)</li>
    </ul>
    <h4>Abscess / fistula / other</h4>
    <ul>
      <li>Anal abscess: painful tender swelling, fever, leukocytosis → I&amp;D</li>
      <li>Anal hematoma: painful swelling, stable, NO leukocytosis</li>
      <li>Simple fistula: swelling &amp; discharge → fistulotomy</li>
      <li>Complex fistula (Crohn's): MRI tract → IV antibiotics → Infliximab if refractory</li>
      <li>Fournier's gangrene: immunocompromised, crepitus, foul smell → URGENT surgical debridement</li>
      <li>Condyloma accuminata: cauliflower-like masses → HPV</li>
      <li>Rectal cancer: ≥2 cm mass, change in bowel habits, systemic symptoms</li>
      <li>Anal cancer: &lt;2 cm, pain, bleeding, mass at anal verge</li>
    </ul>
  </section>

  <section class="topic" dir="ltr">
    <h3>3. Bariatric Surgery</h3>
    <ul>
      <li>Indications: BMI ≥40; BMI ≥35 with comorbidities (DM, HTN, OSA); failed medical weight loss</li>
      <li>Pre-op: Upper GI endoscopy (most important — guides choice), CBC, LFT, HbA1c, TSH, psychiatric eval</li>
      <li>Severe GERD / large hiatal hernia → Roux-en-Y Gastric Bypass</li>
      <li>No reflux / less invasive → Sleeve Gastrectomy (irreversible, higher GERD risk)</li>
      <li>RYGB: malabsorptive + restrictive; best for diabetics</li>
      <li>Post-op deficiencies: Fe, B12, Ca, Vit D</li>
    </ul>
  </section>

  <section class="topic" dir="ltr">
    <h3>4. Breast Diseases</h3>
    <h4>Benign — keywords</h4>
    <ul>
      <li>Fibroadenoma: young women, oval mobile painless mass, cycle-related → WLE if &gt;2–3 cm</li>
      <li>Ductal ectasia: inverted nipple, greenish discharge → intraductal excision</li>
      <li>Fibrocystic change: multiple bilateral small painful masses → conservative (NSAID/hormonal)</li>
      <li>Intraductal papilloma: MC cause of non-lactating bloody nipple discharge → intraductal excision</li>
      <li>Atypical ductal hyperplasia on biopsy → wide local excision</li>
    </ul>
    <h4>Mastitis / abscess</h4>
    <ul>
      <li>Mastitis → clinical → anti-staph antibiotics (dicloxacillin/flucloxacillin)</li>
      <li>Fluctuant / skin changes → abscess; ≥5 cm or necrotic skin → I&amp;D; otherwise → aspiration</li>
    </ul>
    <h4>Breast cancer</h4>
    <ul>
      <li>Hard, irregular, immobile mass (upper outer quadrant); skin tethering, peau d'orange, nipple retraction, unilateral bloody discharge, axillary LN</li>
      <li>Screening (MOH): 40–50 every 2 yrs; 50–69 every 1–2 yrs</li>
      <li>Age &gt;30 or FHx → mammogram ± US; age &lt;30 → US</li>
      <li>Solid mass → core needle biopsy; cystic → FNA</li>
      <li>Staging: TNM + CT chest/abdomen/pelvis; sentinel lymph node biopsy</li>
      <li>Phyllodes: young (20–30s), rapidly growing, NOT cycle-related → core biopsy; small → WLE (≥1 cm margins), &gt;8 cm → simple mastectomy</li>
    </ul>
  </section>

  <section class="topic" dir="ltr">
    <h3>5. Vascular Surgery</h3>
    <h4>AAA</h4>
    <ul>
      <li>Pulsatile supraumbilical mass; epigastric pain to back; bruit</li>
      <li>Initial: US (asymptomatic/unstable); confirm: CT-Angio (stable + symptomatic)</li>
      <li>Repair: &gt;5.5 cm (men), &gt;5 cm (women), or ruptured/symptomatic</li>
    </ul>
    <h4>PAD / Leriche</h4>
    <ul>
      <li>Leriche: claudication + ↓femoral pulse + erectile dysfunction</li>
      <li>ABI → US → CT-Angio; Tx: exercise + risk control + Aspirin; Leriche → aorto-femoral bypass</li>
    </ul>
    <h4>Acute limb ischaemia (6 Ps)</h4>
    <ul>
      <li>Pain, Pallor, Paraesthesia, Pulselessness, Perishing cold, Paralysis</li>
      <li>Heparin → US → CT-Angio</li>
      <li>AF/cardiac → embolectomy; thrombosis → catheter thrombolysis; irreversible paralysis / ABI &lt;0.3 → amputation</li>
    </ul>
    <h4>Foot ulcer</h4>
    <ul><li>Absent pulse → arterial ulcer → arterial US; intact pulse → venous ulcer (dark) → venous US</li></ul>
    <div class="sum-callout">
      <b>KEY POINTS</b>
      <ul>
        <li>Hard signs of vascular injury (absent pulse/bruit/thrill/expanding haematoma/6Ps) → urgent surgical exploration</li>
        <li>Symptomatic varicosities → venous US → endovascular ablation</li>
        <li>Spider veins (cosmetic) → no investigation → sclerotherapy</li>
      </ul>
    </div>
  </section>

  <section class="topic" dir="ltr">
    <h3>6. Bowel Obstruction &amp; Hernia</h3>
    <ul>
      <li>SBO: periumbilical colicky pain, early vomiting, late distension</li>
      <li>LBO: pain, early significant distension, late bilious/feculent vomiting</li>
      <li>Initial: erect CXR + AXR; confirm: CT abdomen/pelvis with IV contrast</li>
      <li>Mgmt: ABC + IV fluids + electrolytes + NG decompression; treat cause</li>
      <li>Laparotomy if: peritonitis, strangulation, failed conservative Rx</li>
      <li>Post-op ileus → AXR dilated loops → supportive</li>
      <li>Ogilvie (acute colonic pseudo-obstruction): caecum &gt;10 cm → Neostigmine / colonoscopic decompression</li>
    </ul>
    <h4>Hernia</h4>
    <ul>
      <li>Indirect inguinal: through deep ring, lateral to inferior epigastric vessels</li>
      <li>Direct inguinal: through Hesselbach triangle, medial to vessels</li>
      <li>Femoral: below &amp; lateral to pubic tubercle</li>
      <li>Severity: Reducible &gt; Irreducible &gt; Obstructed &gt; Strangulated</li>
      <li>All hernias → surgery (open mesh or laparoscopic); open first-line for strangulated/large/complex; laparoscopic for bilateral/recurrent/asymptomatic femoral</li>
      <li>Groin mass: US first; CT if uncertainty / obstruction</li>
    </ul>
  </section>

  <section class="topic" dir="ltr">
    <h3>7. Appendix &amp; Diverticular Disease</h3>
    <ul>
      <li>Appendicitis: RLQ pain (migrates from periumbilical), N/V, anorexia, low-grade fever, rebound at McBurney's</li>
      <li>US: paediatric/pregnant; CT abdomen: best sensitivity</li>
      <li>Uncomplicated → laparoscopic appendectomy; abscess → percutaneous drainage + IV Abx + interval appendectomy; phlegmon → conservative IV Abx</li>
      <li>Appendiceal tumours: adenocarcinoma → right hemicolectomy; carcinoid &lt;2 cm at tip → observe; &gt;2 cm/base/LN → right hemicolectomy</li>
      <li>Diverticulitis: LLQ pain, fever → CT with contrast; colonoscopy after 6–8 wks; abscess → drainage; perforation → Hartmann's</li>
    </ul>
  </section>

  <section class="topic" dir="ltr">
    <h3>8. Colon Cancer, IBD &amp; Mesenteric Ischaemia</h3>
    <ul>
      <li><b>Any patient &gt;45 with GI bleeding or iron-deficiency anaemia → COLONOSCOPY</b></li>
      <li>CT CAP with contrast if diagnosed; obstruction with suspected cancer → surgery first then colonoscopy</li>
      <li>Colonoscopy CONTRAINDICATED in acute obstruction (perforation risk)</li>
      <li>FAP (carpeted polyps, young) → total colectomy</li>
      <li>Crohn's complications: abscess → drainage; strictures → resection/stricturoplasty; perianal fistula</li>
      <li>UC: toxic megacolon (transverse colon &gt;6 cm, loss of haustration) → medical → failed/&gt;10 cm → subtotal colectomy + end ileostomy</li>
      <li>Acute mesenteric ischaemia: AF/MI, pain out of proportion → CT-Angiography; ischaemic colitis: thumbprinting at watershed (splenic flexure/sigmoid)</li>
    </ul>
  </section>

  <section class="topic" dir="ltr">
    <h3>9. Fluid, Electrolytes &amp; Nutrition</h3>
    <ul>
      <li>Vomiting: hypochloraemic, hypokalaemic metabolic alkalosis, paradoxical aciduria → Normal Saline</li>
      <li>Diarrhoea: hypokalaemic metabolic acidosis → Ringer's Lactate</li>
      <li>ECG: hypokalaemia → flat/inverted T; hyperkalaemia → peaked T (treat urgently)</li>
      <li>Urine output: &gt;0.5 ml/kg/hr adults; &gt;1 ml/kg/hr paeds</li>
    </ul>
    <h4>Hyperkalaemia (in order)</h4>
    <ol>
      <li>IV Calcium Gluconate (membrane stabilisation — FIRST)</li>
      <li>Insulin + Dextrose (shift)</li>
      <li>Sodium Bicarbonate (if acidosis)</li>
      <li>Beta-agonist (albuterol)</li>
      <li>Loop diuretics / Kayexalate (elimination)</li>
      <li>Haemodialysis (definitive)</li>
    </ol>
    <h4>Nutrition</h4>
    <ul>
      <li>Non-functioning GI → TPN; functioning → enteral</li>
      <li>Acute (&lt;1 mo), no aspiration risk → NG; at risk → NJ</li>
      <li>Chronic (&gt;1 mo), no risk → gastrostomy; at risk → jejunostomy</li>
      <li>Refeeding syndrome: ↓K, ↓Mg, ↓phosphate after starvation</li>
      <li>Absorption: Iron–duodenum; Folate–jejunum; B12 &amp; bile salts–terminal ileum</li>
    </ul>
  </section>

  <section class="topic" dir="ltr">
    <h3>10. Endocrine Surgery</h3>
    <ul>
      <li>Thyroglossal cyst: central neck, moves with tongue protrusion → surgery</li>
      <li>Cystic hygroma: lateral neck, clear lymphatic fluid → sclerotherapy → surgery</li>
      <li>Bethesda (FNA): I &amp; III → repeat FNA; II → US follow-up; IV → hemithyroidectomy; V → hemi/total; VI → near total thyroidectomy</li>
      <li>Monitoring: Papillary/Follicular → thyroglobulin; Medullary → calcitonin</li>
      <li>Hyperthyroid (low TSH): no uptake → subacute thyroiditis; diffuse uptake → Graves'</li>
      <li>Near-total thyroidectomy if: eye symptoms, failed medical Tx, compressive symptoms</li>
    </ul>
    <h4>Post-thyroidectomy complications</h4>
    <ul>
      <li>Haematoma (hours post-op) → bedside wound exploration</li>
      <li>High-pitched voice → superior laryngeal nerve injury</li>
      <li>Hoarseness → recurrent laryngeal nerve injury</li>
      <li>Spasms/tetany → hypocalcaemia (parathyroid injury)</li>
    </ul>
    <h4>Adrenal</h4>
    <ul>
      <li>Phaeochromocytoma: episodic HTN, palpitations, sweating → ↑catecholamines → CT → <b>Alpha-blockers FIRST</b> (before surgery/beta-blockade)</li>
      <li>Adrenal insufficiency post-surgery: hypotension, hypoglycaemia, hyperkalaemia → IV hydrocortisone</li>
      <li>Cushing's: ACTH-dependent (pituitary/ectopic) vs independent (adrenal)</li>
    </ul>
  </section>

  <section class="topic" dir="ltr">
    <h3>11. Oesophageal &amp; Gastric Diseases</h3>
    <div class="sum-callout">
      <b>Endoscopy red flags</b>
      <ul><li>New dyspepsia &gt;60 yrs · GI bleeding (haematemesis/melaena) · iron-deficiency anaemia · anorexia/weight loss · persistent vomiting · GI cancer in 1st-degree relative</li></ul>
    </div>
    <ul>
      <li>Mallory-Weiss: tear at GEJ, haematemesis PRECEDED by forceful vomiting; EGD gold standard; not bleeding → conservative (PPI + antiemetics)</li>
      <li>Boerhaave's: Mackler's triad (vomiting + retrosternal pain + SC emphysema); CXR pneumomediastinum; Dx contrast esophagography → surgical repair ± drainage</li>
      <li>Oesophageal Ca: adeno (lower, Barrett's/GERD) vs SCC (upper, achalasia/smoking/alcohol); progressive dysphagia + weight loss → EGD + biopsy → CT → resection/neoadjuvant/palliation</li>
      <li>PUD/perforation: sudden severe epigastric pain → erect CXR free air; duodenal → omental patch; antral → partial distal gastrectomy</li>
      <li>Gastric Ca: weight loss, dyspepsia, Virchow's node, UGIB → EGD + biopsy → CT CAP ± PET</li>
      <li>Gastrinoma (Zollinger-Ellison): refractory PUD + diarrhoea → ↑fasting gastrin + secretin test</li>
    </ul>
  </section>

  <section class="topic" dir="ltr">
    <h3>12. Hepato-Biliary &amp; Pancreatic Surgery</h3>
    <ul>
      <li>Acute cholecystitis: RUQ pain &gt;4 hrs, fever, +Murphy's; US → NPO + IV fluid + analgesia + IV Abx + lap chole ≤72 hrs; high-risk/acalculous → percutaneous cholecystostomy</li>
      <li>Ascending cholangitis: Charcot's triad (fever + RUQ pain + jaundice); Reynolds pentad adds hypotension + AMS → ERCP (first-line decompression)</li>
      <li>Acute pancreatitis: 2 of 3 (pain, amylase/lipase ≥3× ULN, CT); Ringer's lactate + treat cause (biliary → ERCP + chole before discharge); antibiotics only if infection; pseudocyst &gt;6 cm or &gt;6 wks → endoscopic drainage; Grey Turner's/Cullen's → necrotising</li>
      <li>Pancreatic cancer: obstructive jaundice + palpable NON-tender gallbladder (Courvoisier's)</li>
      <li>Hydatid cyst: Albendazole → surgical deroofing; Amoebic abscess: travel + dysentery → Metronidazole</li>
      <li>CBD injury post-chole (above cystic duct) → hepatico-jejunostomy</li>
    </ul>
  </section>

  <section class="topic" dir="ltr">
    <h3>13. Trauma — Primary Survey &amp; Abdominal</h3>
    <h4>ABCDE</h4>
    <ul>
      <li>A: SpO2 &lt;88% / GCS ≤8 / aspiration risk → ETI; facial fracture → cricothyroidotomy</li>
      <li>B: tension pneumothorax → needle decompression → chest tube</li>
      <li>C: IV fluid + direct pressure / pelvic binder</li>
      <li>D: no deficit → CT spine clearance</li>
    </ul>
    <h4>Chest / neck</h4>
    <ul>
      <li>Tension PTX: hyperresonance + absent BS + tracheal shift + raised JVP + hypotension → needle decompression → chest tube</li>
      <li>Flail chest: multiple rib fractures + paradoxical breathing → analgesia + assisted ventilation</li>
      <li>Emergency thoracotomy: initial output &gt;1500 ml, or &gt;200–300 ml/hr ×4 hrs</li>
      <li>Neck Zone I → CT-angio; Zone II symptomatic → open repair; Zone III → CT-angio; asymptomatic II/III → observe</li>
    </ul>
    <h4>Abdominal</h4>
    <ul>
      <li>Stable → CT abdomen; unstable stab → laparotomy; unstable blunt → FAST</li>
      <li>Stable + FAST+ → CT; unstable + FAST+ → laparotomy; unstable + FAST− → DPL</li>
      <li>Hepatic/splenic: stable → conservative; unstable → packing / splenectomy</li>
      <li>Seat belt sign → bladder/bowel (duodenal MC) + chance fracture</li>
    </ul>
  </section>

  <section class="topic" dir="ltr">
    <h3>14. Shock</h3>
    <ul>
      <li>Distributive: peripheral vasodilation → warm extremities. Septic = infection + reflex tachycardia + high CO; Neurogenic = spinal trauma, hypotension WITHOUT tachycardia</li>
      <li>Cardiac tamponade: Beck's triad (hypotension + muffled HS + distended JVP); unstable → pericardiocentesis</li>
      <li>Low SvO2 → excess extraction; high SvO2 → severe sepsis (impaired extraction)</li>
      <li>Class II haemorrhage (15–30%): ↓urine output (earliest sensitive sign), ↓pulse pressure, ↑RR</li>
    </ul>
  </section>

  <section class="topic" dir="ltr">
    <h3>15. Orthopaedics &amp; Nerve Palsy</h3>
    <ul>
      <li>Supracondylar fracture: urgent reduction; pink/warm → K-wire; pale/pulseless → OR exploration</li>
      <li>Open fracture: IV Abx → irrigation &amp; debridement ≤24 hrs → IM nail / external fixation</li>
      <li>Compartment syndrome: Pain → Paraesthesia → Pallor → Pulselessness → Paralysis → FASCIOTOMY</li>
      <li>Dislocations: shoulder MC anterior; posterior shoulder → epileptics; hip MC posterior</li>
    </ul>
    <h4>Nerve palsies</h4>
    <ul>
      <li>Radial (spiral groove): wrist drop</li>
      <li>Median (carpal tunnel): ape hand, thenar wasting</li>
      <li>Ulnar (medial humerus): claw hand</li>
      <li>Common peroneal (fibular neck): foot drop</li>
      <li>Axillary (surgical neck humerus): deltoid weakness</li>
      <li>Tibial (posterior leg): plantar flexion loss</li>
    </ul>
  </section>

  <section class="topic" dir="ltr">
    <h3>16. Urology</h3>
    <ul>
      <li>Testicular torsion: severe pain, horizontal high-riding testis, absent cremasteric reflex → surgical exploration WITHOUT imaging if suspected</li>
      <li>Epididymo-orchitis: pain, oedema, ↑vascularity on Doppler → Abx + NSAID</li>
      <li>Appendage torsion: blue dot sign → conservative</li>
      <li>Renal stones: CT abdomen/pelvis WITHOUT contrast (first-line); uric acid stones radiolucent on X-ray</li>
      <li>BPH: LUTS → US; retention → Foley + culture; initial → alpha-blocker; definitive → TURP</li>
      <li>Prostate Ca: LUTS + bone pain → MC metastasis to spine</li>
      <li>Urethral injury: retrograde urethrogram → suprapubic catheter; Foley CONTRAINDICATED</li>
    </ul>
  </section>

  <section class="topic" dir="ltr">
    <h3>17. Paediatric Surgery</h3>
    <ul>
      <li>Pyloric stenosis: 2–6 wk, non-bilious projectile vomiting, olive mass → hypochloraemic hypokalaemic alkalosis → rehydrate FIRST → pyloromyotomy</li>
      <li>Intussusception: 6 m–2 yr, colicky pain, redcurrant-jelly stool, target sign → air/hydrostatic enema; fail → surgery</li>
      <li>Congenital lobar emphysema: neonatal distress, hyperlucent lobe, mediastinal shift → lobectomy</li>
      <li>Wilms' tumour: &lt;5 yr, large abdominal mass, pulmonary nodules → nephrectomy + chemo</li>
      <li>Inguinal hernia: → herniotomy (not mesh); umbilical hernia: 90% resolve by age 2</li>
      <li>Phimosis (scarred, ballooning) → circumcision</li>
      <li>Undescended testis: palpable → orchidopexy; non-palpable → diagnostic laparoscopy</li>
    </ul>
  </section>

  <section class="topic" dir="ltr">
    <h3>18. Burns, Plastic &amp; Skin Tumours</h3>
    <h4>Burns — intubation indications</h4>
    <ul><li>Facial burns · airway oedema · respiratory failure · soot in airway · extensive burns · altered mental status</li></ul>
    <div class="sum-callout">
      <b>Parkland formula</b>: 4 ml × weight (kg) × %TBSA of Ringer's lactate — 50% in first 8 hrs, 50% in next 16 hrs.
    </div>
    <ul>
      <li>Melanoma (ABCDE) → full-thickness excisional biopsy</li>
      <li>BCC: MC on face, slow-growing → excision; SCC: chronic ulcer → repeat biopsy</li>
      <li>Liposarcoma: limbs/retroperitoneum, &gt;10 cm → core needle biopsy → staging CT</li>
      <li>Biopsy: lesion &lt;2 cm body / &lt;1 cm head → excisional; larger → incisional</li>
      <li>Non-healing wound (diabetic foot, pressure ulcer) → VAC dressing</li>
    </ul>
  </section>

  <section class="topic" dir="ltr">
    <h3>19. Peri-operative Care</h3>
    <div class="sum-callout">
      <b>Post-op fever — 5 Ws</b>
      <ul>
        <li>Wind (D1–2): atelectasis/pneumonia</li>
        <li>Water (D3–5): UTI</li>
        <li>Wound (D5–7): SSI</li>
        <li>Walking (D5–7): DVT/PE</li>
        <li>Wonder drugs (anytime): drug fever, C. difficile</li>
      </ul>
    </div>
    <ul>
      <li>PE: stable → LMWH (Enoxaparin); high bleeding risk → mechanical prophylaxis; anticoagulation contraindicated → IVC filter; HIT → stop heparin → fondaparinux/DOAC</li>
      <li>SSI → CT → percutaneous drainage; wound abscess → I&amp;D; seroma → exploration + irrigation, leave open</li>
      <li>Intra-abdominal collection: small → Abx; ≥4×4 cm → percutaneous drainage; multiple → laparoscopy; unstable → laparotomy</li>
      <li>Massive transfusion (&gt;10 units) → dilutional thrombocytopenia → bleeding</li>
    </ul>
  </section>

  <section class="topic" dir="ltr">
    <h3>20. UGIB / LGIB</h3>
    <ul>
      <li>Haemobilia (post-hepatic procedure → UGIB) → angiography (NOT endoscopy first)</li>
      <li>Splenic vein thrombosis (post-pancreatitis): isolated fundal varices + normal portal vein → splenectomy (curative)</li>
      <li>Dieulafoy's lesion: aberrant submucosal artery → massive UGIB, no obvious lesion first endoscopy</li>
      <li>Oesophageal varices: band ligation + non-selective beta-blocker; TIPS if refractory</li>
      <li>LGIB: elderly MC diverticulosis; young IBD/polyps → colonoscopy after resuscitation</li>
    </ul>
  </section>

  <section class="topic" dir="ltr">
    <h3>Quick Reference — Key Algorithms</h3>
    <h4>Obstructive jaundice</h4>
    <ul>
      <li>Dark urine + pale stool + pruritus → US (first-line) → dilated CBD?</li>
      <li>Dilated + non-tender gallbladder (Courvoisier) → pancreatic Ca → CT/MRCP</li>
      <li>Dilated + stones → ascending cholangitis → ERCP</li>
      <li>No dilation → medical jaundice → LFTs / haemolytic screen</li>
    </ul>
    <h4>Dysphagia</h4>
    <ul>
      <li>Progressive + weight loss + age &gt;60 → EGD FIRST</li>
      <li>Oropharyngeal/motility → barium swallow; mucosal lesion → biopsy → staging CT; achalasia → manometry</li>
    </ul>
  </section>
</div>
`;
