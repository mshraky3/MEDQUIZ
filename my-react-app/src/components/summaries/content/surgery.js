// Surgery — section content for the continuous-scroll summaries page.
// Sourced from the user's Surgical_Summary (Bailey & Love 26th Ed.) + recall
// decks, with algorithms. Angle brackets HTML-escaped. Questions authored
// (no duplicates) with 0-based answer index + explanation.

const surgery = {
    id: 'surgery',
    title: 'الجراحة',
    title_en: 'Surgery',
    icon: 'scalpel',
    accent: '#fb7185',
    intro: 'أهم مواضيع الجراحة عالية العائد: الرضوح والطوارئ · البطن الحاد · الكبد والمرارة والبنكرياس · القولون والشرج · الثدي والغدد · الأوعية · المريء والفتوق · المسالك والعظام — مع الخوارزميات والأسئلة.',
    subtopics: [
        {
            id: 'surg-trauma',
            title: 'الرضوح والطوارئ',
            title_en: 'Trauma & Emergencies',
            summaryHtml: `
                <h4>Primary survey (ABCDE)</h4>
                <ul>
                    <li><b>A</b> (+C-spine): GCS ≤8 / aspiration / SpO2 &lt;88% → intubate; facial/laryngeal disruption → cricothyroidotomy</li>
                    <li><b>B</b>: tension pneumothorax → needle decompression → chest tube; open wound → 3-sided dressing</li>
                    <li><b>C</b>: two large-bore IV, control haemorrhage (pressure, pelvic binder, tourniquet), balanced transfusion</li>
                    <li><b>D</b>: GCS, pupils, glucose · <b>E</b>: expose, prevent hypothermia</li>
                </ul>
                <h4>Key emergencies</h4>
                <ul>
                    <li><b>Massive haemothorax</b>: &gt;1500 ml initial drain or &gt;200 ml/hr → thoracotomy</li>
                    <li><b>Cardiac tamponade</b>: Beck's triad → pericardiocentesis / thoracotomy</li>
                    <li><b>Compartment syndrome</b>: pain on passive stretch / out of proportion → <b>fasciotomy</b> (don't wait for pulselessness)</li>
                    <li><b>Burns — Parkland</b>: 4 ml × kg × %TBSA Ringer's lactate, half in first 8 h; intubate early if facial burns/soot/stridor</li>
                </ul>
                <div class="sum-callout">
                    <b>Algorithm — blunt abdominal trauma</b>
                    <ol>
                        <li><b>Stable</b> → CT abdomen/pelvis</li>
                        <li><b>Unstable</b> → FAST: positive → laparotomy; negative → seek other source (± DPL)</li>
                        <li>Peritonitis / evisceration / unstable penetrating → laparotomy</li>
                    </ol>
                </div>
            `,
            questions: [
                {
                    q: 'A trauma patient has absent breath sounds and hyperresonance on the right, tracheal deviation to the left, distended neck veins and hypotension. What is the immediate management?',
                    options: ['Urgent chest X-ray', 'Needle decompression followed by chest tube', 'Pericardiocentesis', 'Intubation first'],
                    answer: 1,
                    explanation: 'Tension pneumothorax is a clinical diagnosis treated immediately with needle decompression then a chest tube — do not wait for imaging.'
                },
                {
                    q: 'A hypotensive patient after blunt abdominal trauma remains unstable despite fluids. A FAST scan shows free intraperitoneal fluid. What is the next step?',
                    options: ['CT abdomen with contrast', 'Exploratory laparotomy', 'Diagnostic peritoneal lavage', 'Observation and repeat FAST'],
                    answer: 1,
                    explanation: 'An unstable patient with a positive FAST needs emergency laparotomy; CT is only for haemodynamically stable patients.'
                },
                {
                    q: 'A patient with a tibial fracture has severe pain on passive toe extension that is out of proportion to the injury, with a tense swollen calf. What is the most appropriate action?',
                    options: ['Elevate the limb and reassess in 4 hours', 'Urgent fasciotomy', 'Apply a tighter cast', 'Wait until pulses disappear'],
                    answer: 1,
                    explanation: 'Pain on passive stretch and pain out of proportion are early signs of compartment syndrome — perform fasciotomy without waiting for pulselessness (a late sign).'
                },
                {
                    q: 'An 80 kg adult has 30% total body surface area burns. Using the Parkland formula, how much of the calculated fluid is given in the first 8 hours?',
                    options: ['All of it', 'Half of the 24-hour volume', 'One quarter', 'None until day 2'],
                    answer: 1,
                    explanation: 'Parkland = 4 ml × weight × %TBSA of Ringer\'s lactate over 24 h, with half given in the first 8 hours and the rest over the next 16, titrated to urine output.'
                },
                {
                    q: 'A chest drain inserted for a traumatic haemothorax immediately drains 1600 mL of blood. What is the appropriate next step?',
                    options: ['Urgent thoracotomy', 'Clamp the drain and observe', 'Repeat chest X-ray in 6 hours', 'Remove the drain'],
                    answer: 0,
                    explanation: 'An initial drainage above ~1500 mL (or ongoing 200 mL/hr) is an indication for thoracotomy.'
                },
                {
                    q: 'A head-injured patient develops hypertension, bradycardia and irregular breathing. What does this triad indicate?',
                    options: ['Raised intracranial pressure (Cushing reflex)', 'Hypovolaemic shock', 'Spinal (neurogenic) shock', 'Fat embolism'],
                    answer: 0,
                    explanation: 'The Cushing reflex (hypertension, bradycardia, irregular respiration) signals dangerously raised ICP and impending herniation — needs urgent measures and neurosurgery.'
                }
            ]
        },
        {
            id: 'surg-acute-abdomen',
            title: 'البطن الحاد والانسداد',
            title_en: 'Acute Abdomen & Obstruction',
            summaryHtml: `
                <ul>
                    <li><b>Appendicitis</b>: periumbilical pain migrating to RLQ, anorexia, low-grade fever, rebound at McBurney's; children/pregnant → US first, adults → CT; uncomplicated → laparoscopic appendectomy; abscess → percutaneous drainage + IV antibiotics + interval appendectomy</li>
                    <li><b>Diverticulitis</b>: LLQ pain + fever → CT with contrast; colonoscopy after 6–8 wks; abscess → drainage; perforation/peritonitis → Hartmann's</li>
                    <li><b>SBO</b>: colicky periumbilical pain, early vomiting, late distension (adhesions MC); <b>LBO</b>: distension early, feculent vomiting late (cancer MC)</li>
                    <li>Initial imaging: erect CXR + AXR → confirm with <b>CT abdomen/pelvis with contrast</b>; manage with NPO + IV fluids + NG decompression</li>
                    <li>Laparotomy if: peritonitis, strangulation, or failed conservative management</li>
                    <li><b>Mesenteric ischaemia</b>: AF/known emboli, pain out of proportion to exam → CT angiography</li>
                </ul>
                <div class="sum-callout">
                    <b>Algorithm — bowel obstruction</b>
                    <ol>
                        <li>Resuscitate: NPO, IV fluids, NG tube, correct electrolytes</li>
                        <li>Confirm with CT; identify cause &amp; site</li>
                        <li>No peritonitis/strangulation → trial of conservative management</li>
                        <li>Peritonitis, strangulation, or failure → surgery</li>
                    </ol>
                </div>
            `,
            questions: [
                {
                    q: 'A 25-year-old man has 24 hours of periumbilical pain that has now localised to the right iliac fossa with anorexia, low-grade fever and rebound tenderness. What is the best initial imaging?',
                    options: ['CT abdomen/pelvis', 'Abdominal ultrasound', 'Plain abdominal X-ray', 'MRI abdomen'],
                    answer: 0,
                    explanation: 'In a non-pregnant adult, CT has the best accuracy for appendicitis; ultrasound is preferred first in children and pregnant women to avoid radiation.'
                },
                {
                    q: 'A patient with adhesional small bowel obstruction has no peritonitis or signs of strangulation. What is the appropriate initial management?',
                    options: ['Immediate laparotomy', 'NPO, IV fluids and nasogastric decompression', 'Oral laxatives', 'Colonoscopic decompression'],
                    answer: 1,
                    explanation: 'Uncomplicated adhesional SBO is initially managed conservatively (NPO, IV fluids, NG decompression); surgery is for strangulation, peritonitis or failure to resolve.'
                },
                {
                    q: 'A patient with atrial fibrillation develops sudden severe abdominal pain that is markedly out of proportion to a relatively unremarkable examination. What is the best diagnostic test?',
                    options: ['Erect chest X-ray', 'CT angiography of the mesenteric vessels', 'Abdominal ultrasound', 'Colonoscopy'],
                    answer: 1,
                    explanation: 'Pain out of proportion with an embolic source (AF) suggests acute mesenteric ischaemia; CT angiography is the diagnostic test of choice.'
                },
                {
                    q: 'A patient presents late with appendicitis and CT shows a walled-off appendiceal abscess. What is the best initial management?',
                    options: ['Percutaneous drainage plus IV antibiotics (± interval appendectomy)', 'Immediate open appendectomy', 'Oral antibiotics at home', 'Colonoscopy'],
                    answer: 0,
                    explanation: 'An appendiceal abscess is managed initially with percutaneous drainage and antibiotics; interval appendectomy may follow.'
                },
                {
                    q: 'An elderly nursing-home resident has marked abdominal distension and a "coffee-bean" loop on X-ray pointing to the right upper quadrant. What is the initial management of sigmoid volvulus?',
                    options: ['Endoscopic (flexible sigmoidoscopic) decompression', 'Immediate Hartmann procedure', 'Barium enema', 'Observation'],
                    answer: 0,
                    explanation: 'Uncomplicated sigmoid volvulus is decompressed endoscopically with flatus tube placement; surgery is for ischaemia, perforation or recurrence.'
                }
            ]
        },
        {
            id: 'surg-hepatobiliary',
            title: 'الكبد والمرارة والبنكرياس',
            title_en: 'Hepatobiliary & Pancreas',
            summaryHtml: `
                <ul>
                    <li><b>Acute cholecystitis</b>: RUQ pain &gt;4–6 h, fever, +Murphy's; US → NPO + IV fluids + analgesia + antibiotics + <b>laparoscopic cholecystectomy ≤72 h</b>; unfit/acalculous → percutaneous cholecystostomy</li>
                    <li><b>Ascending cholangitis</b>: Charcot's triad (fever + RUQ pain + jaundice); Reynolds pentad adds hypotension + confusion → resuscitate + antibiotics + urgent <b>ERCP</b> for biliary decompression</li>
                    <li><b>Acute pancreatitis</b>: 2 of 3 (pain, amylase/lipase ≥3× ULN, imaging); aggressive Ringer's lactate; biliary cause → ERCP + cholecystectomy before discharge; antibiotics only for infected necrosis</li>
                    <li><b>Pancreatic cancer</b>: painless obstructive jaundice + palpable non-tender gallbladder (<b>Courvoisier's law</b>) → CT/MRCP</li>
                </ul>
                <div class="sum-callout">
                    <b>Algorithm — obstructive jaundice</b>
                    <ol>
                        <li>Dark urine + pale stool + pruritus → <b>ultrasound first</b></li>
                        <li>Dilated CBD + stone + cholangitis → <b>ERCP</b></li>
                        <li>Dilated CBD + painless + Courvoisier gallbladder → suspect <b>pancreatic head cancer</b> → CT/MRCP</li>
                        <li>No duct dilatation → medical/hepatocellular cause → LFT &amp; haemolysis screen</li>
                    </ol>
                </div>
            `,
            questions: [
                {
                    q: 'A patient has fever, right upper quadrant pain and jaundice (Charcot\'s triad) with a dilated common bile duct and a stone. After resuscitation and antibiotics, what is the definitive next step?',
                    options: ['Laparoscopic cholecystectomy now', 'Urgent ERCP for biliary decompression', 'Percutaneous cholecystostomy', 'Observation'],
                    answer: 1,
                    explanation: 'Ascending cholangitis requires biliary decompression — urgent ERCP — alongside antibiotics and resuscitation.'
                },
                {
                    q: 'A patient with painless progressive jaundice has a palpable, non-tender gallbladder. What does Courvoisier\'s law suggest?',
                    options: ['Gallstone disease', 'A malignant biliary/pancreatic head obstruction', 'Acute cholecystitis', 'Viral hepatitis'],
                    answer: 1,
                    explanation: 'A palpable non-tender gallbladder with painless jaundice suggests malignant obstruction (e.g. pancreatic head cancer), not stones.'
                },
                {
                    q: 'A patient with gallstone pancreatitis recovers with conservative care. What should be done to prevent recurrence before discharge (or shortly after)?',
                    options: ['Long-term prophylactic antibiotics', 'Cholecystectomy (with ERCP clearance of the duct if needed)', 'A low-fat diet only', 'Repeat amylase in 6 weeks'],
                    answer: 1,
                    explanation: 'After gallstone pancreatitis, cholecystectomy (with ERCP for retained duct stones) prevents recurrence and is recommended during the same admission when possible.'
                },
                {
                    q: 'A patient has acute calculous cholecystitis confirmed on ultrasound and is fit for surgery. What is the definitive management?',
                    options: ['Early laparoscopic cholecystectomy (within ~72 hours)', 'Antibiotics alone with elective surgery in 3 months', 'ERCP', 'Percutaneous cholecystostomy'],
                    answer: 0,
                    explanation: 'Early laparoscopic cholecystectomy (ideally within 72 hours) is the standard for acute cholecystitis in fit patients.'
                },
                {
                    q: 'A critically ill ICU patient develops acalculous cholecystitis but is too unstable for surgery. What is the appropriate management?',
                    options: ['Percutaneous cholecystostomy', 'Immediate open cholecystectomy', 'ERCP with sphincterotomy', 'Oral ursodeoxycholic acid'],
                    answer: 0,
                    explanation: 'In an unfit/critically ill patient, percutaneous cholecystostomy drains the gallbladder as a temporising measure.'
                }
            ]
        },
        {
            id: 'surg-colorectal',
            title: 'القولون والمستقيم والشرج',
            title_en: 'Colorectal & Anorectal',
            summaryHtml: `
                <ul>
                    <li><b>Any patient &gt;45 with rectal bleeding or iron-deficiency anaemia → COLONOSCOPY</b> (rule out colorectal cancer)</li>
                    <li><b>Haemorrhoids</b>: painless bright-red bleeding after defecation; Grade I–III → banding/sclerotherapy (internal only); Grade IV → haemorrhoidectomy</li>
                    <li><b>Anal fissure</b>: severe pain on defecation, posterior midline; acute → topical CCB (diltiazem)/GTN; chronic → lateral internal sphincterotomy</li>
                    <li><b>Perianal abscess</b> → incision &amp; drainage; <b>fistula</b> → fistulotomy (complex/Crohn's → seton ± infliximab)</li>
                    <li><b>Colon cancer</b>: CT chest/abdomen/pelvis for staging; obstruction with suspected cancer → surgery first; colonoscopy contraindicated in acute obstruction (perforation risk)</li>
                    <li><b>UC — toxic megacolon</b> (transverse colon &gt;6 cm) → medical therapy → failure → subtotal colectomy + end ileostomy</li>
                </ul>
                <div class="sum-callout">
                    <b>Red flags for colonoscopy</b>: age &gt;45–50 with rectal bleeding, iron-deficiency anaemia, change in bowel habit, weight loss, or a family history of colorectal cancer.
                </div>
            `,
            questions: [
                {
                    q: 'A 60-year-old man reports a change in bowel habit and dark blood mixed with stool, and is found to be iron-deficient. What is the most appropriate investigation?',
                    options: ['Colonoscopy', 'Anoscopy only', 'Barium enema', 'CT abdomen without contrast'],
                    answer: 0,
                    explanation: 'New rectal bleeding or iron-deficiency anaemia in a patient over 45–50 mandates colonoscopy to exclude colorectal cancer.'
                },
                {
                    q: 'A patient has severe pain on defecation with a small amount of bright-red blood and a tear at the posterior midline of the anus, present for 8 weeks. What is the definitive treatment for this chronic lesion?',
                    options: ['Rubber band ligation', 'Lateral internal sphincterotomy', 'Haemorrhoidectomy', 'Incision and drainage'],
                    answer: 1,
                    explanation: 'A chronic anal fissure (&gt;6 weeks) that fails medical therapy is treated with lateral internal sphincterotomy; topical agents are first-line for acute fissures.'
                },
                {
                    q: 'A patient presents with a large-bowel obstruction and a suspected obstructing colonic cancer. Why should colonoscopy be avoided acutely?',
                    options: ['It cannot reach the lesion', 'It risks perforation in an acutely obstructed colon', 'It is less accurate than barium enema', 'It requires general anaesthesia'],
                    answer: 1,
                    explanation: 'Colonoscopy is contraindicated in acute large-bowel obstruction because of the high perforation risk; manage the obstruction first.'
                },
                {
                    q: 'A patient has severe perianal pain with a tender, purplish lump that appeared 24 hours ago (thrombosed external haemorrhoid). What is the best management?',
                    options: ['Surgical excision (within ~72 hours)', 'Rubber-band ligation', 'Sclerotherapy', 'Lateral internal sphincterotomy'],
                    answer: 0,
                    explanation: 'An acutely thrombosed external haemorrhoid presenting within ~72 hours is best treated by excision; banding/sclerotherapy are for internal haemorrhoids.'
                },
                {
                    q: 'A patient with Crohn disease has a complex perianal fistula. What is the most appropriate management?',
                    options: ['Seton drainage plus medical therapy (e.g. anti-TNF)', 'Wide fistulotomy', 'Observation only', 'Proctectomy as first line'],
                    answer: 0,
                    explanation: 'Complex/Crohn-related fistulas are managed with seton drainage plus medical therapy; wide fistulotomy risks incontinence and poor healing.'
                }
            ]
        },
        {
            id: 'surg-breast-endocrine',
            title: 'الثدي والغدد الصماء',
            title_en: 'Breast & Endocrine Surgery',
            summaryHtml: `
                <h4>Breast</h4>
                <ul>
                    <li><b>Triple assessment</b> = clinical + imaging (US if &lt;35, mammogram ± US if ≥35) + biopsy (core for solid, FNA for cystic)</li>
                    <li><b>Fibroadenoma</b>: young, mobile, painless; <b>intraductal papilloma</b>: MC cause of bloody nipple discharge → excision</li>
                    <li><b>Breast cancer</b>: hard, irregular, fixed mass; skin tethering, peau d'orange, nipple retraction → core biopsy → staging + sentinel lymph node biopsy</li>
                    <li><b>Breast abscess</b>: ≥5 cm or necrotic skin → I&amp;D; otherwise → aspiration + antibiotics</li>
                </ul>
                <h4>Endocrine</h4>
                <ul>
                    <li><b>Thyroid nodule</b>: TSH → if normal/high, US + FNA (Bethesda) → guides hemithyroidectomy vs total thyroidectomy</li>
                    <li>Post-thyroidectomy: <b>haematoma</b> (airway emergency) → open at bedside; <b>hoarseness</b> → recurrent laryngeal nerve; <b>tetany</b> → hypocalcaemia (parathyroid injury)</li>
                    <li><b>Phaeochromocytoma</b>: episodic HTN, palpitations, sweating → ↑metanephrines → CT → <b>alpha-blockade FIRST</b>, then beta-blockade, then surgery</li>
                </ul>
            `,
            questions: [
                {
                    q: 'A 55-year-old woman has a hard, irregular, fixed breast lump with overlying skin dimpling. What is the most appropriate diagnostic biopsy?',
                    options: ['Fine-needle aspiration cytology', 'Core needle biopsy', 'Excisional biopsy first', 'Repeat clinical exam in 3 months'],
                    answer: 1,
                    explanation: 'A suspicious solid breast mass is sampled by core needle biopsy (part of triple assessment), which gives histology and receptor status; FNA is used for cystic lesions.'
                },
                {
                    q: 'A patient develops a tense, expanding neck swelling with stridor a few hours after total thyroidectomy. What is the immediate action?',
                    options: ['Urgent CT neck', 'Open the wound at the bedside to evacuate the haematoma', 'Nebulised adrenaline', 'IV calcium gluconate'],
                    answer: 1,
                    explanation: 'A post-thyroidectomy haematoma can rapidly obstruct the airway; the sutures must be opened immediately at the bedside before definitive theatre management.'
                },
                {
                    q: 'A patient with a phaeochromocytoma is being prepared for adrenalectomy. Which drug must be started first?',
                    options: ['A beta-blocker', 'An alpha-blocker (e.g. phenoxybenzamine)', 'A calcium channel blocker', 'An ACE inhibitor'],
                    answer: 1,
                    explanation: 'Alpha-blockade must precede beta-blockade in phaeochromocytoma; giving a beta-blocker first risks unopposed alpha vasoconstriction and hypertensive crisis.'
                },
                {
                    q: 'A patient develops perioral tingling and carpopedal spasm the day after total thyroidectomy. What is the cause and treatment?',
                    options: ['Hypocalcaemia from parathyroid injury — give calcium', 'Hypoglycaemia — give dextrose', 'Recurrent laryngeal nerve injury — observe', 'Anxiety — reassure'],
                    answer: 0,
                    explanation: 'Inadvertent parathyroid injury causes hypocalcaemia (paraesthesia, Chvostek/Trousseau signs, tetany); treat with calcium (and vitamin D).'
                },
                {
                    q: 'A 45-year-old woman has unilateral, single-duct, spontaneous bloody nipple discharge with no palpable mass. What is the most likely cause?',
                    options: ['Intraductal papilloma', 'Fibroadenoma', 'Duct ectasia', 'Fat necrosis'],
                    answer: 0,
                    explanation: 'An intraductal papilloma is the commonest cause of bloody single-duct discharge; it is investigated and treated by ductal excision (microdochectomy) after imaging.'
                }
            ]
        },
        {
            id: 'surg-vascular',
            title: 'الأوعية الدموية',
            title_en: 'Vascular Surgery',
            summaryHtml: `
                <ul>
                    <li><b>AAA</b>: pulsatile expansile mass; screen/assess with US; confirm anatomy with CT angiography; repair if &gt;5.5 cm (men) / &gt;5 cm (women) or symptomatic/ruptured</li>
                    <li><b>Ruptured AAA</b>: hypotension + back/abdominal pain + pulsatile mass → straight to theatre (don't delay for imaging if unstable)</li>
                    <li><b>Acute limb ischaemia (6 Ps)</b>: Pain, Pallor, Paraesthesia, Pulselessness, Perishing cold, Paralysis → IV heparin; embolic (AF) → embolectomy; thrombotic → angiography/thrombolysis; irreversible (fixed mottling/paralysis) → amputation</li>
                    <li><b>Chronic PAD / claudication</b>: ABI → exercise + risk-factor control + antiplatelet + statin; critical ischaemia/rest pain → revascularisation</li>
                    <li><b>Ulcers</b>: arterial (punched-out, absent pulses) vs venous (gaiter area, oedema) → compression for venous (after excluding arterial disease)</li>
                </ul>
                <div class="sum-callout"><b>Acute limb ischaemia</b>: start IV heparin immediately; viability (motor/sensory + Doppler signals) determines whether to revascularise or amputate.</div>
            `,
            questions: [
                {
                    q: 'An elderly man presents with sudden severe back and abdominal pain, hypotension and a pulsatile abdominal mass. What is the most appropriate management?',
                    options: ['CT angiography before any intervention', 'Immediate transfer to theatre for repair', 'Observation with serial ultrasounds', 'Start antihypertensives and admit'],
                    answer: 1,
                    explanation: 'A haemodynamically unstable patient with a suspected ruptured AAA goes straight to theatre; imaging is only for stable patients.'
                },
                {
                    q: 'A patient with atrial fibrillation develops a sudden cold, pale, pulseless and painful leg with intact movement and sensation. After starting IV heparin, what is the definitive treatment?',
                    options: ['Embolectomy', 'Primary amputation', 'Compression bandaging', 'Long-term warfarin only'],
                    answer: 0,
                    explanation: 'Acute embolic limb ischaemia from AF with a still-viable limb is treated with surgical embolectomy after immediate heparinisation.'
                },
                {
                    q: 'A diabetic has a shallow ulcer over the medial gaiter area with surrounding oedema and haemosiderin staining; foot pulses are present. What is the most appropriate treatment?',
                    options: ['Compression therapy', 'Urgent arterial bypass', 'Amputation', 'Topical antibiotics only'],
                    answer: 0,
                    explanation: 'This is a venous ulcer; once significant arterial disease is excluded (palpable pulses / adequate ABI), compression therapy is the mainstay.'
                },
                {
                    q: 'An asymptomatic abdominal aortic aneurysm is found in a man. At what maximum diameter is elective repair generally indicated?',
                    options: ['5.5 cm or greater', '3.0 cm', '4.0 cm', '8.0 cm'],
                    answer: 0,
                    explanation: 'Elective AAA repair is offered at 5.5 cm or more in men (or 5.0 cm in women), or with rapid growth or symptoms.'
                },
                {
                    q: 'A patient has a recent TIA and is found to have 80% symptomatic stenosis of the ipsilateral internal carotid artery. What is the management?',
                    options: ['Carotid endarterectomy plus best medical therapy', 'Anticoagulation alone', 'Observation', 'Bilateral carotid stenting routinely'],
                    answer: 0,
                    explanation: 'Symptomatic carotid stenosis of 70–99% benefits from carotid endarterectomy (done early) alongside antiplatelet and statin therapy.'
                }
            ]
        },
        {
            id: 'surg-upper-gi-hernia',
            title: 'المريء والمعدة والفتوق',
            title_en: 'Upper GI & Hernia',
            summaryHtml: `
                <div class="sum-callout">
                    <b>Endoscopy red flags</b>: new dyspepsia &gt;60 yrs · GI bleeding (haematemesis/melaena) · iron-deficiency anaemia · weight loss/anorexia · persistent vomiting · dysphagia · upper-GI cancer in a first-degree relative.
                </div>
                <ul>
                    <li><b>Perforated peptic ulcer</b>: sudden severe epigastric pain + free air under the diaphragm on erect CXR → resuscitation + surgery (omental patch)</li>
                    <li><b>Mallory-Weiss</b>: haematemesis after forceful vomiting → usually conservative (PPI); <b>Boerhaave's</b>: vomiting + chest pain + surgical emphysema (full-thickness rupture) → surgical/endoscopic repair</li>
                    <li><b>Oesophageal cancer</b>: progressive dysphagia + weight loss → endoscopy + biopsy → staging CT; adeno (lower, Barrett's) vs SCC (upper, smoking/alcohol)</li>
                    <li><b>Hernia anatomy</b>: indirect = lateral to inferior epigastric vessels; direct = medial (Hesselbach's triangle); femoral = below &amp; lateral to pubic tubercle (high strangulation risk)</li>
                    <li>Severity: reducible → irreducible → obstructed → <b>strangulated</b> (surgical emergency); all symptomatic hernias → repair</li>
                </ul>
            `,
            questions: [
                {
                    q: 'A patient with chronic NSAID use develops sudden severe epigastric pain with a rigid abdomen; an erect chest X-ray shows free air under the diaphragm. What is the diagnosis?',
                    options: ['Acute pancreatitis', 'Perforated peptic ulcer', 'Acute cholecystitis', 'Mesenteric ischaemia'],
                    answer: 1,
                    explanation: 'Sudden severe epigastric pain with pneumoperitoneum (free air under the diaphragm) indicates a perforated peptic ulcer requiring resuscitation and surgery.'
                },
                {
                    q: 'A 65-year-old has progressive dysphagia to solids then liquids with weight loss. What is the best initial investigation?',
                    options: ['Barium swallow', 'Upper GI endoscopy with biopsy', 'CT chest', 'Oesophageal manometry'],
                    answer: 1,
                    explanation: 'Progressive dysphagia with weight loss requires upper GI endoscopy and biopsy first to diagnose oesophageal cancer; staging CT follows.'
                },
                {
                    q: 'A groin hernia that lies below and lateral to the pubic tubercle is more concerning because of which feature?',
                    options: ['It is always painless', 'A high risk of strangulation', 'It never requires surgery', 'It only occurs in men'],
                    answer: 1,
                    explanation: 'A femoral hernia (below and lateral to the pubic tubercle) has a high risk of strangulation and should be repaired.'
                },
                {
                    q: 'An irreducible groin hernia is now tender and erythematous with overlying skin changes and signs of peritonism. What is the management?',
                    options: ['Emergency surgical exploration', 'Outpatient elective repair', 'Manual reduction and discharge', 'Ultrasound and review in clinic'],
                    answer: 0,
                    explanation: 'Features of strangulation (tenderness, erythema, peritonism) make this a surgical emergency to prevent bowel necrosis.'
                },
                {
                    q: 'A patient has forceful vomiting followed by severe chest pain, with subcutaneous emphysema and pneumomediastinum on imaging. What is the diagnosis?',
                    options: ['Boerhaave syndrome (oesophageal rupture)', 'Mallory-Weiss tear', 'Myocardial infarction', 'Spontaneous pneumothorax'],
                    answer: 0,
                    explanation: 'Full-thickness oesophageal rupture after vomiting (Boerhaave) causes mediastinal/subcutaneous emphysema and needs urgent surgical or endoscopic repair; a Mallory-Weiss tear is mucosal and usually self-limiting.'
                }
            ]
        },
        {
            id: 'surg-urology-ortho',
            title: 'المسالك البولية والعظام',
            title_en: 'Urology & Orthopedics',
            summaryHtml: `
                <h4>Urology</h4>
                <ul>
                    <li><b>Testicular torsion</b>: sudden severe pain, high-riding horizontal testis, absent cremasteric reflex → <b>surgical exploration WITHOUT imaging</b> (salvage falls after 6 h)</li>
                    <li><b>Renal colic</b>: loin-to-groin pain → non-contrast CT KUB (first-line); manage pain + most &lt;5 mm pass; obstruction + infection → emergency decompression</li>
                    <li><b>BPH</b>: LUTS → alpha-blocker ± 5-alpha-reductase inhibitor; refractory → TURP; acute retention → catheterise</li>
                    <li><b>Urethral injury</b> (pelvic trauma, blood at meatus, high-riding prostate): retrograde urethrogram → suprapubic catheter; Foley contraindicated</li>
                </ul>
                <h4>Orthopaedics</h4>
                <ul>
                    <li><b>Open fracture</b>: IV antibiotics + tetanus → irrigation &amp; debridement → fixation</li>
                    <li><b>Supracondylar fracture</b> (child): pink pulseless hand → urgent reduction; persistent → exploration</li>
                    <li><b>Nerve palsies</b>: radial = wrist drop; common peroneal = foot drop; median = thenar wasting; ulnar = claw hand</li>
                </ul>
            `,
            questions: [
                {
                    q: 'A 15-year-old has sudden severe testicular pain with a high-riding, horizontal testis and an absent cremasteric reflex. What is the most appropriate management?',
                    options: ['Doppler ultrasound first, then decide', 'Immediate surgical exploration', 'Antibiotics and scrotal support', 'Urinalysis and observation'],
                    answer: 1,
                    explanation: 'Suspected testicular torsion warrants immediate surgical exploration; imaging delays salvage, which falls sharply after 6 hours.'
                },
                {
                    q: 'A patient with classic loin-to-groin renal colic needs imaging to confirm a stone. What is the first-line investigation?',
                    options: ['Non-contrast CT of the kidneys, ureters and bladder', 'Plain abdominal X-ray', 'IV urography', 'Renal ultrasound only'],
                    answer: 0,
                    explanation: 'Non-contrast CT KUB is the first-line imaging for suspected renal/ureteric stones.'
                },
                {
                    q: 'A man with a pelvic fracture has blood at the urethral meatus and a high-riding prostate. What is the appropriate management of the urinary tract?',
                    options: ['Insert a urethral (Foley) catheter', 'Retrograde urethrogram and a suprapubic catheter', 'Forced diuresis', 'Immediate cystoscopy with stenting'],
                    answer: 1,
                    explanation: 'Signs of urethral injury contraindicate a urethral catheter; a retrograde urethrogram confirms the injury and a suprapubic catheter is used for drainage.'
                },
                {
                    q: 'A patient has an open tibial fracture with a contaminated wound. What are the immediate priorities?',
                    options: ['IV antibiotics and tetanus prophylaxis, then irrigation/debridement and fixation', 'Apply a cast and discharge', 'Delay antibiotics until after surgery', 'Primary skin closure in the ED'],
                    answer: 0,
                    explanation: 'Open fractures need early IV antibiotics, tetanus cover and urgent wound irrigation/debridement followed by stabilisation.'
                },
                {
                    q: 'An older man presents with sudden inability to pass urine and a tender, palpable suprapubic mass (acute urinary retention). What is the first step?',
                    options: ['Urethral (or suprapubic) catheterisation to decompress the bladder', 'Immediate TURP', 'Loop diuretic', 'Fluid restriction'],
                    answer: 0,
                    explanation: 'Acute retention is relieved first by bladder catheterisation; definitive management (e.g. alpha-blocker, treat the cause, possible TURP) follows.'
                }
            ]
        }
    ]
};

export default surgery;
