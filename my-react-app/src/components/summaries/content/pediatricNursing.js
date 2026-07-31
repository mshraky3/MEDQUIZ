// Pediatric Nursing — nursing-track section of the summaries catalog.
//
// Mirror of backend/content/summaryHtml/pediatricNursing.js (the gated slide viewer's
// copy): same authored prose, split into the guided path's subtopics. Keep the
// two in sync when the content changes.
//
// Questions are real recalls from the SNLE bank (questions.track = 'nursing'),
// matched to the subtopic they belong to. The full bank is reachable from the
// quiz engine; these are the handful shown inline while reading.
const pediatricNursing = {
    id: "pediatric-nursing",
    title: "Pediatric Nursing",
    title_en: "SNLE Review — 14 Topics",
    icon: "baby",
    accent: "#f59e0b",
    intro: "Pediatric Nursing — SNLE revision built from the Saudi nursing licence recall banks: Growth, Development & Play · Immunisation · Vital Signs & Anatomical Differences · Paediatric CPR & Choking · Fever, Febrile Seizures & Pain · Respiratory Conditions · Congenital Heart Disease & Rheumatic Fever · Gastrointestinal Conditions · Dehydration & Fluid Balance · Renal & Urinary · Neurological & Musculoskeletal · Haematology & Oncology · Communicable Diseases · Safety, SIDS & Child Abuse.",
    subtopics: [
        {
            id: "pn-growth",
            title: "01 — Growth, Development & Play",
            title_en: "Age groups · Erikson's psychosocial stages · Kohlberg's moral development · Piaget's cognitive stages · Play",
            summaryHtml: `
<h4 class="deck-topic">Age groups</h4>
    <ul>
      <li><b>Neonate</b> 0–28 days · <b>Infant</b> 1–12 months · <b>Toddler</b> 1–3 years · <b>Preschool</b> 3–5 years · <b>School-age</b> 5–12 years · <b>Adolescent</b> 12–19 years</li>
    </ul>
    <h4 class="deck-topic">Erikson's psychosocial stages</h4>
    <table>
      <thead><tr><th>Age</th><th>Stage</th><th>Nursing implication</th></tr></thead>
      <tbody>
        <tr><td>Infant</td><td><b>Trust vs mistrust</b></td><td>Consistent caregiver, respond promptly, feed on demand, allow the parent to stay</td></tr>
        <tr><td>Toddler</td><td><b>Autonomy vs shame &amp; doubt</b></td><td>Offer <b>limited choices</b>, allow self-feeding/dressing, expect negativism and ritualism</td></tr>
        <tr><td>Preschool</td><td><b>Initiative vs guilt</b></td><td>Let them help with their own care, use <b>fantasy/therapeutic play</b> and dolls; magical thinking means they may see illness as punishment</td></tr>
        <tr><td>School-age</td><td><b>Industry vs inferiority</b></td><td>Give tasks they can master, explain with simple diagrams, encourage schoolwork and peers</td></tr>
        <tr><td>Adolescent</td><td><b>Identity vs role confusion</b></td><td>Respect <b>privacy and confidentiality</b>, involve peers, allow control over decisions</td></tr>
      </tbody>
    </table>
    <h4 class="deck-topic">Kohlberg's moral development</h4>
    <ul>
      <li><b>Pre-conventional</b> (~4–10 y) — behaviour is driven by <b>punishment and reward</b>: "I won't do it because I'll get into trouble"</li>
      <li><b>Conventional</b> (~10–13 y) — driven by <b>pleasing others and obeying rules</b> for social approval and order</li>
      <li><b>Post-conventional</b> (adolescence onward) — driven by <b>internal principles and conscience</b>; the child recognises that rules can be flexible and can be questioned</li>
    </ul>
    <h4 class="deck-topic">Piaget's cognitive stages</h4>
    <ul>
      <li><b>Sensorimotor</b> (0–2 y) — object permanence develops around 9 months</li>
      <li><b>Preoperational</b> (2–7 y) — egocentric, <b>magical thinking</b>, animism</li>
      <li><b>Concrete operational</b> (7–11 y) — logical about concrete things, understands cause and effect</li>
      <li><b>Formal operational</b> (11+ y) — abstract reasoning</li>
    </ul>
    <h4 class="deck-topic">Play</h4>
    <ul>
      <li><b>Solitary</b> (infant) → <b>Parallel</b> (toddler — beside but not with others) → <b>Associative</b> (preschool — together, no formal rules) → <b>Cooperative</b> (school-age — organised, with rules)</li>
      <li><b>Therapeutic play</b>: letting a preschooler handle equipment or play with a doll before a procedure reduces fear and gives a sense of control</li>
    </ul>
    <h4 class="deck-topic">Milestones</h4>
    <ul>
      <li><b>2 mo</b> social smile · <b>4 mo</b> rolls front to back, holds head steady · <b>6 mo</b> sits with support, transfers objects, <b>birth weight doubles</b> · <b>8 mo</b> sits unsupported · <b>9 mo</b> crawls, pincer grasp, object permanence · <b>10 mo</b> pulls to stand · <b>12 mo</b> walks with help, 1–3 words, <b>birth weight triples</b>, birth length +50%</li>
      <li><b>15 mo</b> walks alone · <b>18 mo</b> runs, 10 words, feeds self · <b>2 y</b> 2-word sentences, climbs stairs both feet, half of adult height · <b>3 y</b> rides a tricycle, dresses self, speech understandable · <b>4 y</b> hops on one foot, draws a person with 3 parts · <b>5 y</b> skips, ties shoelaces</li>
      <li><b>Posterior fontanelle</b> closes at <b>2–3 months</b>; <b>anterior fontanelle</b> at <b>12–18 months</b></li>
      <li>Teeth erupt from ~6 months; ~<b>6 teeth by 1 year</b></li>
    </ul>
    <h4 class="deck-topic">Nutrition</h4>
    <ul>
      <li>Solids start at <b>6 months</b>, one new food at a time and wait <b>4–7 days</b> before the next to detect allergy</li>
      <li>Order: iron-fortified cereal → vegetables → fruits → meats → <b>egg yolk around 8 months</b>; <b>egg white, cow's milk, honey and nuts after 12 months</b> (honey → infant botulism)</li>
      <li>Toddlers have <b>physiological anorexia</b> and food jags — offer small portions and finger foods, do not force</li>
      <li>Choking hazards to avoid under 3: whole grapes, nuts, popcorn, hot dogs, hard sweets, raw carrot</li>
    </ul>
    <div class="sum-key">
      <span class="sum-key-title">نقاط امتحانية</span>
      <ul>
        <li>Encouraging <b>fantasy play</b> and letting the child take part in their own care is the developmental approach for the <b>preschooler (3–5 years)</b>.</li>
        <li>The toddler's need for <b>autonomy</b> is met by giving <b>two acceptable choices</b>, never an open-ended question.</li>
        <li>Hospitalised toddlers fear <b>separation</b> most; preschoolers fear <b>bodily harm</b>; adolescents fear <b>loss of control and body-image change</b>.</li>
      </ul>
    </div>
            `,
            questions: [
                {
                    q: "Encouraging fantasy play and participation by children in their own care is a useful ?developmental approach for which pediatric age-group",
                    options: ["Preschool age (3 to 5 years)","Adolescence (10 to 19 years)","School-age (5 to 10 years)","Toddler (1 to 3 years)"],
                    answer: 0,
                    source: 'SNLE recall',
                },
                {
                    q: "A 6 months old infant mother decided to wean her child. Which of the following is the best principle of weaning process?",
                    options: ["Start the weaning process by 8 month of life","Gradually replace one breast session at a time","Discontinues the nighttime feeding first","Allow the child to take a bottle of milk or juice bed"],
                    answer: 1,
                    source: 'SNLE recall',
                },
                {
                    q: "Mother has 8 months child wants to give her baby an egg to eat what is the kind of egg she should give?",
                    options: ["Give whole egg","Don’t give for child until 1 year","Give white egg without yolk","Give yolk egg without white"],
                    answer: 3,
                    source: 'SNLE recall',
                },
                {
                    q: "Offer ....... medical equipment to encourage the child to expression of his feelings about new hospitalization experience and illness",
                    options: ["Imitation","Toys","Material","Rules"],
                    answer: 1,
                    source: 'SNLE recall',
                },
                {
                    q: "27 years old female brought to the Emergency Room accompanied by her husband. He described that she had marked Weight loss with episodes of emesis in the past three months. She is diagnosed as having anorexia. She reported feeling Febrile but had not measured her temperature. Her White Blood Count was 11,000/mm3. Which of the following most Likely describe her diagnostic criteria for her anorexia?",
                    options: ["Restricting food intake","Fear of gaining weight","Problems with body image","Binge eating disorder"],
                    answer: 1,
                    source: 'SNLE recall',
                },
            ],
        },
        {
            id: "pn-vaccine",
            title: "02 — Immunisation",
            title_en: "Immunisation",
            summaryHtml: `
<ul>
      <li><b>Birth</b>: BCG, hepatitis B (1st dose)</li>
      <li><b>2, 4, 6 months</b>: DTaP, IPV, Hib, PCV, rotavirus, hepatitis B</li>
      <li><b>12 months</b>: <b>MMR</b>, varicella, hepatitis A; PCV and Hib boosters</li>
      <li><b>18 months / 4–6 years</b>: DTaP and IPV boosters, MMR 2nd dose</li>
      <li>Influenza yearly from 6 months; HPV in adolescence; Tdap booster</li>
      <li><b>Live vaccines</b> — MMR, varicella, rotavirus, BCG, oral polio: <b>contraindicated</b> in pregnancy, severe immunosuppression, high-dose steroids and active malignancy on chemotherapy</li>
      <li>A <b>mild illness with low-grade fever is NOT a contraindication</b>; a true anaphylactic reaction to a previous dose or component is</li>
      <li>Store vaccines at <b>2–8 °C</b> (cold chain); do not freeze</li>
      <li>Injection site: <b>vastus lateralis</b> in infants, <b>deltoid</b> from about 3 years</li>
      <li>Teach parents to expect low-grade fever and local soreness → paracetamol and a cool compress; report a high fever, persistent crying &gt;3 h or a seizure</li>
    </ul>
            `,
            questions: [
                {
                    q: "How to prevent Rheumatic fever?",
                    options: ["Give vaccines the pregnant women during pregnancy","Isolation the children with tonsillitis","Give 9 months vaccination","Treat the children with rheumatic fever antibiotics full course"],
                    answer: 3,
                    source: 'SNLE recall',
                },
                {
                    q: "A 6-month-old infant receives a diphtheria, tetanus, and acellular pertussis (DTAP) immunization at a well-baby clinic. The mother returns home and calls the clinic to report that the infant has developed swelling and redness at the site of injection. A nurse tells the mother",
                    options: ["Monitor the infant for a fever","Bring the infant back to the clinic","Apply a hot pack to the injection site","Apply an ice pack to the injection site"],
                    answer: 3,
                    source: 'SNLE recall',
                },
                {
                    q: "A 10-month-old infant was admitted with recurrent otitis made with in months. On assessment, the nurse noticed that the parents lock knowledge about the condition. Health teaching is planned. Which risk factor should the nurse include in health teaching?",
                    options: ["High fever","Painful ear","Foreign body","Respiratory infection"],
                    answer: 3,
                    source: 'SNLE recall',
                },
                {
                    q: "the child fears of being alone and some machine sound during hospitalization at age",
                    options: ["5 months","8 months","9 months","7years"],
                    answer: 3,
                    source: 'SNLE recall',
                },
                {
                    q: "How to teach a child to give insulin injection?",
                    options: ["Teach him to give a stuffed animal","it is too early to teach him to give"],
                    answer: 1,
                    source: 'SNLE recall',
                },
            ],
        },
        {
            id: "pn-vitals",
            title: "03 — Vital Signs & Anatomical Differences",
            title_en: "Other system differences worth knowing",
            summaryHtml: `
<table>
      <thead><tr><th>Age</th><th>HR (bpm)</th><th>RR (/min)</th><th>Systolic BP</th></tr></thead>
      <tbody>
        <tr><td>Newborn</td><td>120–160</td><td>30–60</td><td>~60–80</td></tr>
        <tr><td>Infant</td><td>100–150</td><td>25–40</td><td>~80–100</td></tr>
        <tr><td>Toddler / preschool</td><td>90–130</td><td>20–30</td><td>~90–105</td></tr>
        <tr><td>School-age</td><td>70–110</td><td>18–25</td><td>~95–110</td></tr>
        <tr><td>Adolescent</td><td>60–100</td><td>12–20</td><td>~110–120</td></tr>
      </tbody>
    </table>
    <ul>
      <li>Count the <b>apical pulse for a full minute</b> in children under 2, and the respiratory rate before disturbing the child</li>
      <li>Assess in order of <b>least to most distressing</b>: observe first, auscultate the chest while the child is quiet, and leave the ears, mouth and painful area for last</li>
      <li>Airway differences: larger head and tongue, <b>narrower airway</b>, funnel-shaped larynx, obligate nose-breathers until ~4 months, horizontal short eustachian tube (<b>more otitis media</b>), fewer alveoli — children desaturate fast and tire quickly</li>
      <li>Higher proportion of total body water and a larger surface area → <b>dehydrate faster</b> and lose heat faster</li>
    </ul>
    <h4 class="deck-topic">Other system differences worth knowing</h4>
    <ul>
      <li><b>GI</b>: a newborn's stomach holds only <b>10–20 mL</b>; the lower oesophageal sphincter is immature until about 1 month, so regurgitation is expected</li>
      <li><b>Skin</b>: a thinner, more fragile epidermis tears easily and blood vessels sit closer to the surface, so heat and water are lost quickly</li>
      <li><b>Cardiovascular</b>: a child compensates for blood loss by raising the heart rate and can <b>hold a normal blood pressure until they are severely depleted</b> — <b>hypotension is a very late sign</b> and deterioration is then rapid</li>
      <li><b>Bones</b> are not fully ossified, so they <b>bend rather than break</b> (greenstick fracture); the growth plate sits at the end of the bone and injury there can affect future growth</li>
    </ul>
            `,
            questions: [
                {
                    q: "A 10-year-old child is brought to the hospital with high fever and chills. The nurse records the vital signs and finds that her temperature is 104° F (40° C), blood pressure is 130/85 mm Hg, and pulse rate is 120/min. The fever remains mostly high but is interspersed with periods of normal body temperature. What pattern of fever does the child have?",
                    options: ["Sustained","Intermittent","Remittent","Relapsing"],
                    answer: 1,
                    source: 'SNLE recall',
                },
                {
                    q: "Nursing student training under the supervision of Staff Nurse 3-month-old infant came to a normal checkup and the student assessed the pulse it is 165 b/m What should you do?",
                    options: ["Inform the doctor","Ask parents about a history of heart disease","The staff nurse should check all the vital signs and repeat assessment","Ask the student nurse to check child's file"],
                    answer: 2,
                    source: 'SNLE recall',
                },
                {
                    q: "Child 2 years old has acute otitis media. What is the sign while the nurse observing child, confirm the diagnosis??",
                    options: ["Otorrhea","Roll head side to side"],
                    answer: 1,
                    source: 'SNLE recall',
                },
                {
                    q: "The immunity system of the child reaches normal full mature level, at age",
                    options: ["10 years","9 years","12 months","15 years"],
                    answer: 2,
                    source: 'SNLE recall',
                },
                {
                    q: "When messure Blood pressure for adult patient with using child cuff. What is the expected result?",
                    options: ["False high reading","False low reading","Normal reading"],
                    answer: 0,
                    source: 'SNLE recall',
                },
            ],
        },
        {
            id: "pn-cpr",
            title: "04 — Paediatric CPR & Choking",
            title_en: "Paediatric CPR & Choking",
            summaryHtml: `
<div class="sum-callout"><b>Why paediatric CPR differs:</b> cardiac arrest in a child is nearly always <i>respiratory</i> in origin, not cardiac — which is why the airway and ventilation matter more than they do in adult CPR.</div>
    <table>
      <thead><tr><th></th><th>Infant (&lt;1 year)</th><th>Child (1 year–puberty)</th></tr></thead>
      <tbody>
        <tr><td>Pulse check (max 10 s)</td><td><b>Brachial</b></td><td><b>Carotid</b> (or femoral)</td></tr>
        <tr><td>Compression technique</td><td>2 fingers (one rescuer) or <b>2 thumbs encircling</b> (two rescuers)</td><td>Heel of one or two hands</td></tr>
        <tr><td>Depth</td><td>About <b>4 cm (1.5 inches)</b> — one third of chest depth</td><td>About <b>5 cm (2 inches)</b> — one third of chest depth</td></tr>
        <tr><td>Rate</td><td colspan="2"><b>100–120 compressions per minute</b>, with full recoil between each</td></tr>
        <tr><td>Compression : breath</td><td colspan="2"><b>30:2 with one rescuer · 15:2 with two rescuers</b></td></tr>
      </tbody>
    </table>
    <ul>
      <li>Sequence: check responsiveness → shout for help and send someone for the AED → check the pulse (≤10 s) → begin compressions. <b>Alone with an unwitnessed arrest, give 2 minutes of CPR before leaving to get the AED</b></li>
      <li><b>Choking</b>: a conscious <b>infant</b> gets <b>5 back blows then 5 chest thrusts</b> — never abdominal thrusts. A conscious <b>child</b> gets abdominal thrusts (Heimlich). If the child can still cough forcefully, <b>encourage coughing and do not intervene</b>; act only when the cough becomes silent or ineffective</li>
      <li>Never perform a blind finger sweep — it can push the object deeper</li>
    </ul>
            `,
            questions: [
                {
                    q: "A 2-year-old child is admitted to the pediatric unit with a diagnosed pneumonia. Which of the following intervention would be a nursing priority?",
                    options: ["Encourage coughing","Encourage exercise","Perform postural drainage","Avoid food high in carbohydrates"],
                    answer: 2,
                    source: 'SNLE recall',
                },
                {
                    q: "When should stop performing sponges bathing for febrile infant?",
                    options: ["Shivering","Tachycardia","Mettled skin","Increase respiratory rate"],
                    answer: 0,
                    source: 'SNLE recall',
                },
                {
                    q: "child with sickle cell crisis and take oxygen, how to know oxygen was eFFective?",
                    options: ["by heart rate","pain level","respiratory rate"],
                    answer: 2,
                    source: 'SNLE recall',
                },
                {
                    q: "In the middle of providing care for the patient by the nurse. Father of child came to her from another room and told her that his child has sever abdominal pain. What should the nurse do?",
                    options: ["Ask him to wait for 10 minutes","Leave the patient and go to child","Go to room after the shift"],
                    answer: 1,
                    source: 'SNLE recall',
                },
                {
                    q: "A 2-year-old child is admitted to pediatric ward. The mother cannot stay the child and she will visit him in the weakened only. Which of the following nursing action indicates an understanding of the emotional needs this? child?",
                    options: ["Give her a warm bath to calm down","Allow the child to suck on a pacifier","Ask the parents to bring the child favorite toy","Tell he parents that frequently visiting is unnecessary"],
                    answer: 2,
                    source: 'SNLE recall',
                },
            ],
        },
        {
            id: "pn-fever",
            title: "05 — Fever, Febrile Seizures & Pain",
            title_en: "Fever, Febrile Seizures & Pain",
            summaryHtml: `
<ul>
      <li>Treat fever with <b>paracetamol (acetaminophen)</b> or ibuprofen (over 6 months), light clothing, extra fluids, tepid sponging <b>only</b> if the child is uncomfortable — never cold water or alcohol rubs (shivering raises the temperature)</li>
      <li><b>Aspirin is contraindicated in children</b> with a viral illness → <b>Reye's syndrome</b> (encephalopathy + fatty liver, vomiting and altered consciousness after influenza/varicella)</li>
      <li><b>Febrile seizure</b>: 6 months–5 years, with a rapid rise of temperature; usually benign and generalised, lasting &lt;15 minutes. Priority = <b>protect the airway and prevent injury</b> — turn the child on their side, nothing in the mouth, do not restrain, time the seizure, then reduce the fever</li>
      <li>Pain assessment tools: <b>FLACC</b> (non-verbal, &lt;3 y), <b>Wong-Baker FACES</b> (3+ y), numeric scale (7+ y). Infants show pain by a high-pitched cry, facial grimace, rigid body and physiological changes</li>
      <li>Non-pharmacological pain relief in the infant: <b>breastfeeding</b>, skin-to-skin, sucrose on a pacifier, swaddling and holding — the classic answer for circumcision or heel-stick pain</li>
    </ul>
            `,
            questions: [
                {
                    q: "4 years old Child with cast. What is the nursing care for cast?",
                    options: ["Put in hot water","Put infront of fan or cooller to dry fast","Put in cold water to dry fast","Put powder on the edges of the cast to prevent itching"],
                    answer: 1,
                    source: 'SNLE recall',
                },
                {
                    q: "10 years old child die is expected. What should the nurse do?",
                    options: ["Withdraw medication die anyway","Give medication even if there is pain","Withdraw medication to prevent pain"],
                    answer: 1,
                    source: 'SNLE recall',
                },
                {
                    q: "Sudden infantdeath syndrome (SIDS) is one of the most common causes of death in infants. To prevent this syndrome, the nurse should keep infant inside incubators in which position??",
                    options: ["Left side","Back","Prone","Right side"],
                    answer: 1,
                    source: 'SNLE recall',
                },
                {
                    q: "child with rheumatic fever how can prevent for recurrent?",
                    options: ["isolate the infected child","give vaccine for mother","let them complete the antibiotic course","give vaccine in 9 months"],
                    answer: 2,
                    source: 'SNLE recall',
                },
                {
                    q: "Sudden infantdeath syndrome (SIDS) is one of the most common causes of death in infants. Which of the following position should the nurse avoid for infant that cause SIDS??",
                    options: ["Left side","Back","Prone","Right side"],
                    answer: 2,
                    source: 'SNLE recall',
                },
            ],
        },
        {
            id: "pn-resp",
            title: "06 — Respiratory Conditions",
            title_en: "Respiratory Conditions",
            summaryHtml: `
<table>
      <thead><tr><th></th><th>Croup (laryngotracheobronchitis)</th><th>Epiglottitis</th></tr></thead>
      <tbody>
        <tr><td>Cause / onset</td><td><b>Viral</b> (parainfluenza), gradual, 6 mo–3 y</td><td><b>Bacterial</b> (H. influenzae type B), <b>sudden</b>, 2–7 y</td></tr>
        <tr><td>Cough</td><td><b>Barking, seal-like</b>, inspiratory stridor, worse at night</td><td>Absent or muffled</td></tr>
        <tr><td>Signs</td><td>Low-grade fever, hoarse voice</td><td><b>4 Ds</b>: Drooling, Dysphagia, Dysphonia, Distress; <b>tripod position</b>, high fever, toxic look</td></tr>
        <tr><td>Management</td><td>Cool mist/humidified air, <b>nebulised epinephrine</b>, <b>dexamethasone</b>, keep the child calm</td><td><b>MEDICAL EMERGENCY</b>: <b>never inspect the throat or take a throat swab</b>, never place the child supine. Keep them upright with the parent, call for the airway team, prepare for intubation, then IV antibiotics</td></tr>
      </tbody>
    </table>
    <ul>
      <li><b>RSV / bronchiolitis</b>: infants &lt;2 years, wheeze, tachypnoea, nasal flaring, poor feeding. Management is <b>supportive</b> — humidified O₂, suction the nares before feeds, fluids, upright positioning. <b>CONTACT isolation</b>; palivizumab is prophylaxis for high-risk infants</li>
      <li><b>Asthma</b>: SABA (salbutamol) as the reliever, inhaled corticosteroid as the controller — <b>rinse the mouth after the steroid inhaler</b>; use a spacer; peak flow monitoring. A <b>silent chest</b> is an ominous sign of severe obstruction</li>
      <li><b>Cystic fibrosis</b>: autosomal recessive, thick secretions. Diagnosed by the <b>sweat chloride test (&gt;60 mmol/L)</b>. Presents with <b>meconium ileus</b>, steatorrhoea, failure to thrive and recurrent chest infection. Treat with chest physiotherapy, <b>pancreatic enzymes with every meal and snack</b>, high-calorie high-protein diet and fat-soluble vitamins (A, D, E, K)</li>
      <li><b>Tonsillectomy</b>: post-op position <b>prone or side-lying</b> to drain secretions; watch for <b>frequent swallowing</b> — the earliest sign of bleeding. Give cool clear fluids and ice cream; avoid red/brown fluids, straws, coughing and throat clearing</li>
      <li><b>Otitis media</b>: ear pain, pulling at the ear, fever, irritability, bulging tympanic membrane. After myringotomy tubes — keep water out of the ears</li>
    </ul>
    <div class="sum-key">
      <span class="sum-key-title">نقاط امتحانية</span>
      <ul>
        <li>Suspected epiglottitis → <b>do not put anything in the mouth</b> and do not lay the child flat.</li>
        <li>Isolation for RSV is <b>contact</b> precautions.</li>
        <li>A barking cough that improves in cool night air is <b>croup</b>.</li>
      </ul>
    </div>
            `,
            questions: [
                {
                    q: "A 15-month-old child is admitted for hypospadias repair. After surgery, which of the following instruction should be given to the parents?",
                    options: ["Limit activity for 2 weeks","Avoid apply ointment or powder","Give a child a diet that is high in protein","Isolate the child from other children with the infection"],
                    answer: 0,
                    source: 'SNLE recall',
                },
                {
                    q: "The nurse is assessing a 2 -years-old child with Wilms surgery Which of the following should the nurse avoid?",
                    options: ["Putting the child in lateral position","Palpating the child's abdomen","Putting the child in a private room","Provide mouth hygiene 30 minutes after meal"],
                    answer: 1,
                    source: 'SNLE recall',
                },
                {
                    q: "Child complaining Wheezing, crackle and nasal flaring. The doctor ordered Pulmicort 0.5 mg and 1 mg salbutamol. What is the most appropriate cause or What should the nurse expect diagnosis ?",
                    options: ["Viral bronchitis","Asthma","Rhinitis","Because his parents are smoking"],
                    answer: 0,
                    source: 'SNLE recall',
                },
                {
                    q: "Child with recurrent UTI , What is the most risk factors ?",
                    options: ["abdominal distention","Abdominal pain","Chronic constipation"],
                    answer: 2,
                    source: 'SNLE recall',
                },
                {
                    q: "Child with Ductus arterioses. What should the nurse consulting parent??",
                    options: ["follow up 6 month","vital sign every day"],
                    answer: 0,
                    source: 'SNLE recall',
                },
            ],
        },
        {
            id: "pn-cardiac",
            title: "07 — Congenital Heart Disease & Rheumatic Fever",
            title_en: "Fetal circulation — three shunts · Classification",
            summaryHtml: `
<h4 class="deck-topic">Fetal circulation — three shunts</h4>
    <ul>
      <li><b>Ductus venosus</b> — umbilical vein to the inferior vena cava, bypassing the liver</li>
      <li><b>Foramen ovale</b> — right atrium to left atrium, bypassing the lungs</li>
      <li><b>Ductus arteriosus</b> — pulmonary artery to the aorta, bypassing the lungs</li>
      <li>All close after birth when the lungs expand and pulmonary resistance falls</li>
    </ul>
    <h4 class="deck-topic">Classification</h4>
    <table>
      <thead><tr><th>Group</th><th>Defects</th><th>Haemodynamics</th></tr></thead>
      <tbody>
        <tr><td><b>Increased pulmonary blood flow</b> (acyanotic, left→right shunt)</td><td><b>ASD, VSD, PDA</b></td><td>Blood shunts from the high-pressure left side to the right → <b>increased pulmonary blood flow</b>, murmur, CHF signs, poor feeding, failure to thrive, frequent chest infections</td></tr>
        <tr><td><b>Decreased pulmonary blood flow</b> (cyanotic)</td><td><b>Tetralogy of Fallot</b>, tricuspid atresia</td><td>Cyanosis, hypoxic "tet" spells, clubbing, polycythaemia</td></tr>
        <tr><td><b>Obstructive</b></td><td><b>Coarctation of the aorta</b>, aortic/pulmonary stenosis</td><td>Coarctation: <b>high BP and bounding pulses in the arms, low BP and weak/absent femoral pulses in the legs</b></td></tr>
        <tr><td><b>Mixed</b></td><td><b>Transposition of the great arteries</b>, truncus arteriosus</td><td>Severe cyanosis at birth; TGA survival depends on a patent shunt — <b>prostaglandin E1 keeps the ductus open</b></td></tr>
      </tbody>
    </table>
    <ul>
      <li><b>Tetralogy of Fallot — 4 features</b>: <b>P</b>ulmonary stenosis, <b>R</b>ight ventricular hypertrophy, <b>O</b>verriding aorta, <b>V</b>SD. A <b>tet spell</b> (crying, feeding) → place the infant in the <b>knee-chest position</b>, give oxygen, calm and comfort, then morphine/fluids as ordered. Older children <b>squat</b> instinctively</li>
      <li><b>Signs of CHF in an infant</b>: <b>tachypnoea, tachycardia, diaphoresis while feeding, tiring during feeds, poor weight gain, hepatomegaly</b> and periorbital oedema. Nursing care — small frequent feeds, feed for no more than 30 minutes, higher-calorie formula, cluster care to allow rest, upright positioning</li>
      <li><b>Digoxin</b> in infants: check the <b>apical pulse for a full minute and hold if &lt;90–110 bpm</b> in an infant (&lt;70 in an older child); never repeat a dose after vomiting; watch for bradycardia, vomiting and anorexia as toxicity</li>
      <li><b>Kawasaki disease</b>: fever &gt;5 days, bilateral non-purulent conjunctivitis, <b>strawberry tongue</b>, cracked lips, polymorphous rash, cervical lymphadenopathy, <b>peeling of the hands and feet</b>. Complication = <b>coronary artery aneurysm</b>. Treat with <b>IVIG + high-dose aspirin</b> (the one paediatric exception to the aspirin rule); delay live vaccines for 11 months after IVIG</li>
      <li><b>Acute rheumatic fever</b>: follows untreated <b>group A beta-haemolytic streptococcal</b> pharyngitis by 2–3 weeks. <b>Jones criteria</b> — <b>carditis, polyarthritis (migratory), chorea, erythema marginatum, subcutaneous nodules</b> + fever, raised ESR/CRP, prolonged PR, positive <b>ASO titre</b>. Treat with penicillin, anti-inflammatories and bed rest; <b>long-term monthly penicillin prophylaxis</b> prevents recurrence and permanent <b>mitral valve</b> damage. Primary prevention = <b>treat strep throat with the full antibiotic course</b></li>
    </ul>
    <div class="sum-key">
      <span class="sum-key-title">نقاط امتحانية</span>
      <ul>
        <li>VSD blood flow characteristic = <b>increased pulmonary blood flow</b> (left-to-right shunt).</li>
        <li>The parent of a child with a patent ductus arteriosus is counselled to attend <b>regular follow-up</b> and to report feeding difficulty and poor weight gain.</li>
        <li>The most important teaching in strep throat is to <b>complete the whole antibiotic course</b> to prevent rheumatic fever and glomerulonephritis.</li>
      </ul>
    </div>
            `,
            questions: [
                {
                    q: "Child with VSD. What is blood flow characteristic?",
                    options: ["mixes atrium blood","decreased pulmonary blood flow","increase pulmonary blood flow"],
                    answer: 2,
                    source: 'SNLE recall',
                },
                {
                    q: "Infant 2 months with patent ductus arteriosus. What is the expected signs and symptoms for infant?",
                    options: ["Acrocyanosis","Central cyanosis","Tachycardia and tachypnea","Tachypnea"],
                    answer: 2,
                    source: 'SNLE recall',
                },
                {
                    q: "What is drug that prevent recurrence of rheumatic fever?",
                    options: ["Penicillin","Corticosteroids","Salicylates"],
                    answer: 0,
                    source: 'SNLE recall',
                },
                {
                    q: "Mother came to the Outpatient Department with an infant having cleft and palate. The infant was underweight, so the nurse has to consider Teaching the proper way of feeding the child in the treatment plan. Which of the following is the proper way of feeding",
                    options: ["Use a non-squeezable bottle during feeding","Feed infant in an upright, sitting position","Enlarge nipple holes of bottle to allow more milk to pass through","Feed infant longer than 45 minutes to allow more food to be small"],
                    answer: 1,
                    source: 'SNLE recall',
                },
                {
                    q: "How can we know that this child has intussusception??",
                    options: ["Baby crying &vomiting","Baby pull knee to chest"],
                    answer: 1,
                    source: 'SNLE recall',
                },
            ],
        },
        {
            id: "pn-gi",
            title: "08 — Gastrointestinal Conditions",
            title_en: "Gastrointestinal Conditions",
            summaryHtml: `
<table>
      <thead><tr><th>Condition</th><th>Presentation</th><th>Management</th></tr></thead>
      <tbody>
        <tr><td><b>Hypertrophic pyloric stenosis</b></td><td>2–8 weeks old, <b>projectile non-bilious vomiting</b> right after feeding, <b>hungry immediately after vomiting</b>, olive-shaped RUQ mass, visible peristalsis, dehydration, <b>hypochloraemic metabolic alkalosis</b></td><td><b>Rehydration and correction of electrolytes first, then pyloromyotomy</b>. Post-op: small frequent feeds starting 4–6 h after surgery, upright after feeds</td></tr>
        <tr><td><b>Intussusception</b></td><td>3 mo–3 y, sudden severe <b>colicky abdominal pain with drawing up of the knees</b>, <b>sausage-shaped mass</b>, vomiting, <b>"currant jelly" stool</b> (blood and mucus)</td><td><b>Air or barium enema</b> is both diagnostic and therapeutic; surgery if it fails. <b>The passage of a normal brown stool means the intussusception has reduced — report it immediately</b></td></tr>
        <tr><td><b>Hirschsprung disease</b></td><td><b>Absence of ganglion cells</b> in the distal colon → functional obstruction. <b>Failure to pass meconium in 24–48 h</b>, ribbon-like foul stools, abdominal distension, <b>bile-stained vomiting</b></td><td>Rectal biopsy confirms. Temporary colostomy then pull-through surgery. Watch for <b>enterocolitis</b> — explosive diarrhoea and fever is an emergency</td></tr>
        <tr><td><b>Cleft lip &amp; palate</b></td><td>Failure of fusion; feeding difficulty, aspiration and otitis media risk</td><td><b>Lip repair at ~2–6 months</b>, palate repair ~9–18 months. Feed upright with a wide-based/special teat, burp frequently. Post-op: <b>no straws, spoons, pacifiers or anything into the mouth</b>; use elbow restraints, clean the suture line, and position <b>supine after lip repair</b> and <b>prone or side-lying after palate repair</b></td></tr>
        <tr><td><b>GERD</b></td><td>Effortless regurgitation, arching, poor weight gain</td><td>Small thickened feeds, upright 30 min after feeding, do not overfeed</td></tr>
        <tr><td><b>Celiac disease</b></td><td>Symptoms start when cereals are introduced — steatorrhoea, distension, wasted buttocks, irritability</td><td>Lifelong <b>gluten-free diet</b> — no wheat, barley, rye, oats; rice, maize and potato are safe</td></tr>
      </tbody>
    </table>
            `,
            questions: [
                {
                    q: "1 month-old infant is admitted to the surgical unit with hypertrophic pyloric stenosis and scheduled for the surgery. Which of the following is the findings of abdominal examination?",
                    options: ["palpable olive-like mass in the left side","palpable olive-like mass in the right side","Palpable olive-like mass moved from left to right","Palpable olive-like mass moved from right to left"],
                    answer: 1,
                    source: 'SNLE recall',
                },
                {
                    q: "The nurse is assessing a child (an infant) with pyloric stenosis. which of the following is likely to note?",
                    options: ["Diarrhea","Projectile vomiting","Swallowing difficulties","Currant jelly like stool"],
                    answer: 1,
                    source: 'SNLE recall',
                },
                {
                    q: "A 5-week-old newborn was admitted to pediatric Ward with pyloric stenosis, the newborn has weight loss, and projectile vomiting during feeding. They scheduled surgical repair of pyloric stenosis Which of the following. postoperative intervention for this",
                    options: ["IV fluid infant is retaining adequate amount by mouth","Administration of proper analgesia until infant discomfort resolve","Start feeding immediately after postoperative","Vomiting is uncommon in the first24-48 hrs"],
                    answer: 0,
                    source: 'SNLE recall',
                },
                {
                    q: "A 5year-old child was seen to the Emergency Department abdominal pain, palpable sauge-shaped mass, and Intussusception is suspected Which of the following is the best diagnostic evaluation to?",
                    options: ["X-ray","endoscopy","Rectal biopsy","Ultrasonograph"],
                    answer: 3,
                    source: 'SNLE recall',
                },
                {
                    q: "After repairing for child with cleft lip left side. Which of the following position should the nurse put the baby to prevent Aspiration?",
                    options: ["Prone","On stomach","Right lateral","Left lateral"],
                    answer: 2,
                    source: 'SNLE recall',
                },
            ],
        },
        {
            id: "pn-fluid",
            title: "09 — Dehydration & Fluid Balance",
            title_en: "Dehydration & Fluid Balance",
            summaryHtml: `
<ul>
      <li>Signs of dehydration in an infant: <b>sunken fontanelle and eyes, dry mucous membranes, no tears, poor skin turgor, decreased urine output (fewer than 6 wet nappies a day), tachycardia, weight loss, prolonged capillary refill &gt;2 s, lethargy</b></li>
      <li><b>Weight is the single most accurate indicator</b> of fluid loss and of the degree of dehydration — 1 kg lost = 1 L of fluid</li>
      <li>Mild/moderate → <b>oral rehydration solution in small frequent amounts</b>. Severe or shocked → <b>IV isotonic fluid bolus (normal saline or Ringer's lactate)</b></li>
      <li>Avoid plain water, fizzy drinks and fruit juice — they worsen electrolyte loss</li>
      <li>Continue breastfeeding throughout an episode of gastroenteritis</li>
      <li>Minimum acceptable urine output in a child ≈ <b>1–2 mL/kg/h</b> (infants at the higher end)</li>
    </ul>
            `,
            questions: [
                {
                    q: "6month-old boy with hydrocephalus is admitted to the pediatric surgical Ward for ventriculoperitoneal Shunt (VPS) insertion. Which of the following findings should be of the most concern when assessing the child postoperative?",
                    options: ["Sunken fontanelle and irritability","decreased head circumference","poor feeding and pupillary change","headache and excessive sleepiness"],
                    answer: 2,
                    source: 'SNLE recall',
                },
                {
                    q: "A child with thalassemia was given deferoxamine (Deferral); which of the following should alert the nurse to notify the physician?",
                    options: ["Decreased hearing","Hypertension","Red urine","Vomiting"],
                    answer: 0,
                    source: 'SNLE recall',
                },
                {
                    q: "Child with pyloric stenosis and re-hydration. What should the nurse do?",
                    options: ["Induces Vomiting for child","Give oral feeding","Start rehydration by nasogastric tube"],
                    answer: 2,
                    source: 'SNLE recall',
                },
                {
                    q: "2 years old girl came to ER with perant. She experienced frequent urination. She lost 3 kg of her weight. Which of the following is the best diagnostic tests?",
                    options: ["CT","CBC","Fat","Blood glucose level"],
                    answer: 3,
                    source: 'SNLE recall',
                },
                {
                    q: "Patient with Rheumatic fever. what the accurate test for Rheumatic Fever?",
                    options: ["Ant streptolysin Test","Blood cultures","Urine culture"],
                    answer: 0,
                    source: 'SNLE recall',
                },
            ],
        },
        {
            id: "pn-renal",
            title: "10 — Renal & Urinary",
            title_en: "Renal & Urinary",
            summaryHtml: `
<table>
      <thead><tr><th></th><th>Nephrotic syndrome</th><th>Acute glomerulonephritis</th></tr></thead>
      <tbody>
        <tr><td>Onset</td><td>Insidious, 2–6 years</td><td><b>1–3 weeks after a strep</b> throat or skin infection</td></tr>
        <tr><td>Urine</td><td><b>Massive proteinuria</b>, frothy, <b>no blood</b></td><td><b>Haematuria — tea/cola-coloured</b>, mild proteinuria</td></tr>
        <tr><td>Oedema</td><td>Severe, generalised, <b>periorbital in the morning</b>, ascites</td><td>Mild periorbital</td></tr>
        <tr><td>Blood pressure</td><td>Normal or low</td><td><b>Hypertension</b></td></tr>
        <tr><td>Blood</td><td>Low albumin, <b>high cholesterol</b></td><td>Raised ASO titre, low complement, raised BUN/creatinine</td></tr>
        <tr><td>Treatment</td><td><b>Corticosteroids</b>, albumin, diuretics, low-salt diet, <b>daily weight and abdominal girth</b>, infection precautions</td><td>Supportive: antihypertensives, fluid and <b>sodium restriction</b>, antibiotics for residual infection, monitor for renal failure</td></tr>
      </tbody>
    </table>
    <ul>
      <li><b>UTI</b>: in an infant it presents non-specifically — fever, irritability, poor feeding, foul urine, and sometimes new <b>incontinence in a previously toilet-trained child</b>. WBCs and nitrites in the urine. Teach wiping front to back, cotton underwear, adequate fluids, no bubble baths, and complete voiding</li>
      <li>A febrile child with a UTI and stable vital signs → the appropriate action is to <b>document the findings and continue treatment</b>, not to escalate</li>
      <li><b>Enuresis</b>: involuntary voiding beyond the age of expected control (~5 years). Manage with reassurance, limiting evening fluids, bladder training and an enuresis alarm; never punish or shame the child</li>
      <li><b>Wilms tumour (nephroblastoma)</b>: a firm, non-tender, unilateral abdominal mass. <b>DO NOT PALPATE THE ABDOMEN</b> — palpation can rupture the capsule and seed the tumour. Post a sign above the bed</li>
    </ul>
            `,
            questions: [
                {
                    q: "child has urine incontinence two day ago with WBC in urine.?",
                    options: ["psychological abuse","urinary trac infection","genitalia defect"],
                    answer: 1,
                    source: 'SNLE recall',
                },
                {
                    q: "5-year-old child was admitted with Nephrotic Syndrome. A nurse noticed that the child has slight facial puffiness with mild pitting edema on his hands and feet. there was no distended abdomen diet the nurse should order for the child",
                    options: ["High protein, high salt diet","Low protein, low fiber diet","Low protein, normal salt diet","Normal protein, low salt diet"],
                    answer: 3,
                    source: 'SNLE recall',
                },
                {
                    q: "Child has urine incontinence two day ago with increase WBC in urine. What is the cause??",
                    options: ["Psychological abuse","Urinary tract infection","Genitalia defect"],
                    answer: 1,
                    source: 'SNLE recall',
                },
                {
                    q: "Child with Pyloric stenosis. What is the expected signs and symptoms postoperative?",
                    options: ["Abdominal pain","Watery stool","Vomiting","Urinary"],
                    answer: 2,
                    source: 'SNLE recall',
                },
                {
                    q: "A nurse is collecting a urine of a 4-year-old child with nephrotic syndrome. Which of following observation about the color of the child's urine the nurse expected to? will chart",
                    options: ["Bright red","Amber","Dark, frothy","Orang"],
                    answer: 2,
                    source: 'SNLE recall',
                },
            ],
        },
        {
            id: "pn-neuro",
            title: "11 — Neurological & Musculoskeletal",
            title_en: "Neurological & Musculoskeletal",
            summaryHtml: `
<ul>
      <li><b>Neural tube defects</b> — <b>spina bifida occulta</b> (a dimple or tuft of hair only), <b>meningocele</b> (meninges in the sac) and <b>myelomeningocele</b> (meninges + spinal cord — neurological deficit, bladder/bowel involvement). Prevented by maternal <b>folic acid</b></li>
      <li><b>Care of the sac before repair</b>: place the infant <b>PRONE</b>, cover the sac with a <b>sterile, moist (normal saline) non-adherent dressing</b> — never let it dry out and never apply a dry dressing or pressure. Keep the area free of stool and urine, measure head circumference daily (hydrocephalus risk), and use <b>latex-free</b> equipment</li>
      <li><b>Hydrocephalus</b>: bulging fontanelle, rapidly increasing head circumference, separated sutures, <b>"sunset" eyes</b>, high-pitched cry, irritability then lethargy, vomiting. Treated with a <b>ventriculoperitoneal shunt</b>. After insertion, position the infant <b>flat on the unoperated side</b> to prevent rapid CSF drainage; report fever, vomiting and irritability — signs of shunt infection or malfunction</li>
      <li><b>Increased ICP in a child</b>: infants — bulging fontanelle, high-pitched cry, poor feeding, increasing head circumference; older children — headache worse in the morning, vomiting, diplopia, behaviour change, then bradycardia, hypertension and irregular respiration (<b>Cushing's triad — a late sign</b>)</li>
      <li><b>Bacterial meningitis</b>: fever, headache, photophobia, <b>nuchal rigidity</b>, positive <b>Kernig's and Brudzinski's</b> signs; infants show a bulging fontanelle and paradoxical irritability. <b>Droplet precautions</b> plus antibiotics immediately after cultures. <b>Neisseria meningitidis and Streptococcus pneumoniae account for about 80% of adult cases</b>; a purpuric rash suggests meningococcaemia</li>
      <li><b>Down syndrome (trisomy 21)</b>: hypotonia, single palmar crease, upslanting palpebral fissures, protruding tongue, short stature, intellectual disability. Screen for <b>congenital heart defects (endocardial cushion defect)</b>, hypothyroidism, hearing loss, leukaemia and <b>atlantoaxial instability</b>. The goal of care is to help the child <b>reach their maximum potential</b> with early intervention and family support</li>
      <li><b>Cerebral palsy</b>: non-progressive motor disorder; persistent primitive reflexes, scissoring, delayed milestones. Multidisciplinary — physiotherapy, aids, nutrition, seizure control</li>
      <li><b>Developmental dysplasia of the hip</b>: asymmetric thigh/gluteal folds, limited abduction, positive <b>Ortolani/Barlow</b>, shortened limb. Treated with a <b>Pavlik harness</b> (keeps the hips flexed and abducted) — check skin, do not adjust the straps</li>
      <li><b>Scoliosis</b>: lateral curvature. Screened with the <b>Adam's forward-bend test</b> at school. Braces (Boston/Milwaukee) worn 18–23 h/day for curves 25–40°; surgery (spinal fusion) beyond ~45°. Post-op: <b>log-roll</b>, neurovascular checks, pain control</li>
      <li><b>Fractures &amp; casts</b>: neurovascular checks — the <b>5 Ps</b> (Pain, Pallor, Pulselessness, Paraesthesia, Paralysis). Elevate the limb, apply ice for the first 24 h, keep the cast <b>dry and uncovered while drying</b>, handle a wet cast with the <b>palms not the fingertips</b>, never insert anything inside to scratch. <b>Unrelieved pain not helped by analgesia</b> = <b>compartment syndrome</b> → report immediately. Suspect abuse in a <b>spiral fracture</b> in a non-ambulatory child</li>
    </ul>
    <div class="sum-key">
      <span class="sum-key-title">نقاط امتحانية</span>
      <ul>
        <li>Spina bifida sac care = <b>sterile MOIST dressing, prone position</b>. "Cover with a sterile dry dressing" is the distractor.</li>
        <li>After a VP shunt the classic finding to report is a <b>bulging fontanelle with vomiting and irritability</b>.</li>
        <li>The <b>Adam's forward-bend test</b> is the school screening test for scoliosis.</li>
      </ul>
    </div>
            `,
            questions: [
                {
                    q: "6month-oldboys with hydrocephalus is admitted to surgical Ward post ventriculoperitoneal Shunt (VPS) What is the priority postoperative assessment???",
                    options: ["Neurological Assessment","decreased head circumference","poor feeding and pupillary change","headache and excessive sleepiness"],
                    answer: 0,
                    source: 'SNLE recall',
                },
                {
                    q: "A 4 - month - old infant returned immediately from OR room post cleft lip repair which of the following nursing intervention should be considered . ?",
                    options: ["Apply elbow restrain","Apply suction when needed","Measure temperature","Put infant in prone position"],
                    answer: 0,
                    source: 'SNLE recall',
                },
                {
                    q: "Which of the following vitamin supplements can decrease the incidence of Neural tube defects such as anencephaly and spina bifida new-born or congenital anomalies?",
                    options: ["Vitamin A","Riboflavin","Folic Acid","Vitamin K"],
                    answer: 2,
                    source: 'SNLE recall',
                },
                {
                    q: "Which of the following vitamin supplements can decrease the incidence of Neural tube defects such as anencephaly and spina bifida new-born?",
                    options: ["Vitamin A","Riboflavin","Folic Acid","Vitamin K"],
                    answer: 2,
                    source: 'SNLE recall',
                },
                {
                    q: "Infant with Spina Bafida admitted to NICU. What is the sac care should the nurse do?",
                    options: ["cover with sterile ointment (moist)","cover with sterile dry"],
                    answer: 0,
                    source: 'SNLE recall',
                },
            ],
        },
        {
            id: "pn-heme",
            title: "12 — Haematology & Oncology",
            title_en: "Haematology & Oncology",
            summaryHtml: `
<ul>
      <li><b>Iron deficiency anaemia</b> — the commonest childhood anaemia. Pallor, fatigue, irritability, pica. Give iron <b>between meals with vitamin C (orange juice)</b>, through a straw or dropper at the back of the mouth to avoid staining teeth; expect <b>black tarry stools</b>; keep out of reach (overdose is lethal). Limit cow's milk to &lt;24 oz/day</li>
      <li><b>Thalassaemia</b>: chronic severe anaemia with pallor, fatigue and activity intolerance, frontal bossing, hepatosplenomegaly. Treated with regular <b>packed red cell transfusion</b> plus <b>iron chelation (deferoxamine)</b> because the transfusions cause iron overload</li>
      <li><b>Sickle cell disease</b>: vaso-occlusive crisis triggered by <b>dehydration, infection, hypoxia, cold and stress</b>. Priority = <b>hydration, oxygenation and analgesia (opioids — do not under-treat)</b>, warmth, rest. Prevent by fluids, avoiding high altitude and strenuous exertion, penicillin prophylaxis and full immunisation. Complications: acute chest syndrome, splenic sequestration, stroke</li>
      <li><b>Haemophilia</b>: X-linked, factor VIII/IX deficiency. Bleeding into joints (<b>haemarthrosis</b>). Give the factor concentrate; <b>RICE</b> — rest, ice, compression, elevation. <b>No aspirin/NSAIDs, no IM injections, no contact sports</b>; use a soft toothbrush</li>
      <li><b>Acute lymphoblastic leukaemia</b> — the commonest childhood cancer. Fever, pallor, bruising, petechiae, bone pain, lymphadenopathy, hepatosplenomegaly. Nursing priority during chemotherapy is <b>infection prevention</b> (neutropenic/protective isolation, no live vaccines, no raw fruit or fresh flowers), bleeding precautions, mouth care with a soft brush and antiemetics</li>
      <li>A child receiving chemotherapy with a <b>fever is a medical emergency</b> — cultures and antibiotics without delay</li>
    </ul>
            `,
            questions: [
                {
                    q: "child with thalassemia pale and activity intolerance what the priority?",
                    options: ["RBC transfusion","oxygen administration"],
                    answer: 1,
                    source: 'SNLE recall',
                },
                {
                    q: "A child has an abdominal pain and Hepatomegaly, what should the nurse expect?",
                    options: ["Hepatitis","Cancer","Liver damage","Low level of hemoglobin"],
                    answer: 0,
                    source: 'SNLE recall',
                },
                {
                    q: "Child came to ER with his mother complained from sever pain after playing football. The pain is relieved. Which of the following cause expected?",
                    options: ["Infection","Exercise pressure"],
                    answer: 1,
                    source: 'SNLE recall',
                },
                {
                    q: "The mother and her husband are sickle cell anemia carrier. What is the child percentage to be carrier?",
                    options: ["25 %","50 %","75%","100 %"],
                    answer: 1,
                    source: 'SNLE recall',
                },
                {
                    q: "Neonate in NICU with spina bifida. What is intervention regarding feeding ?",
                    options: ["Give feeding at scheduled time","Limit feeding for neonate","Stop feeding. When baby feel back pain during feeding"],
                    answer: 0,
                    source: 'SNLE recall',
                },
            ],
        },
        {
            id: "pn-infect",
            title: "13 — Communicable Diseases",
            title_en: "Communicable Diseases",
            summaryHtml: `
<table>
      <thead><tr><th>Disease</th><th>Hallmark</th><th>Precaution</th></tr></thead>
      <tbody>
        <tr><td><b>Measles (rubeola)</b></td><td><b>Koplik spots</b> on the buccal mucosa, <b>high fever</b>, cough, coryza, conjunctivitis, then a rash spreading head → down</td><td><b>Airborne</b></td></tr>
        <tr><td><b>German measles (rubella)</b></td><td>Mild low-grade fever, pink rash, <b>posterior auricular/occipital lymphadenopathy</b>; teratogenic in pregnancy</td><td>Droplet</td></tr>
        <tr><td><b>Chickenpox (varicella)</b></td><td>Lesions in <b>all stages at once</b> (macule, papule, vesicle, crust); very itchy</td><td><b>Airborne + contact</b></td></tr>
        <tr><td><b>Mumps</b></td><td><b>Parotid swelling</b>; complications orchitis, meningitis</td><td>Droplet</td></tr>
        <tr><td><b>Scarlet fever</b></td><td>Group A strep, <b>sandpaper rash</b>, <b>strawberry tongue</b>, circumoral pallor, peeling</td><td>Droplet until 24 h of antibiotics</td></tr>
        <tr><td><b>Pertussis</b></td><td>Paroxysmal cough with an inspiratory <b>"whoop"</b>, post-tussive vomiting</td><td>Droplet</td></tr>
        <tr><td><b>Diphtheria</b></td><td><b>Grey-white pseudomembrane</b> on the pharynx, airway obstruction</td><td>Droplet</td></tr>
      </tbody>
    </table>
    <ul>
      <li>The distinguishing feature between measles and German measles is <b>Koplik spots and high fever</b> in measles</li>
      <li>Chickenpox care: keep nails short, cool baths with oatmeal/bicarbonate, calamine, antihistamines — and <b>no aspirin</b> (Reye's syndrome)</li>
      <li>An immunocompromised child (e.g. HIV/AIDS) exposed to <b>measles or varicella</b> needs <b>immune globulin</b> — contact the physician for the order</li>
    </ul>
            `,
            questions: [
                {
                    q: "Child came to ER confirmed german measles. What is the best intervention for child ?",
                    options: ["Antipyretics for low grade fever","Start I. V antibiotics","Antihistamine for itching"],
                    answer: 0,
                    source: 'SNLE recall',
                },
                {
                    q: "A nurse is caring for a child who sustained a head injury after falling from a tree. On assessment of the child, the nurse notes the presence of a watery discharge from the child's nose. The nurse will immediately test the discharge for the presence of which of the following substance?",
                    options: ["Glucose","b. Protein","c. White blood cells","d. Neutrophils"],
                    answer: 0,
                    source: 'SNLE recall',
                },
                {
                    q: "The nurse is reviewing the health care provider’s prescriptions for a child with a streptococcal infection and notes that an antistreptolysin O titer is prescribed. Based on this prescription, which disorder would the nurse suspect in the child?",
                    options: ["Rheumatic Fever RF","Aortic valve diseases","pulmonic valve diseases","congestive heart failure"],
                    answer: 0,
                    source: 'SNLE recall',
                },
                {
                    q: "What is the complication that needs observation after the birth of the child for diabetic mother?",
                    options: ["Preterm labor","Term labor","Macrosomia","Hyperglycemia"],
                    answer: 2,
                    source: 'SNLE recall',
                },
                {
                    q: "When messure Blood pressure for child patient with using adult cuff. What is the expected result?",
                    options: ["False high reading","False low reading","Normal reading"],
                    answer: 1,
                    source: 'SNLE recall',
                },
            ],
        },
        {
            id: "pn-safety",
            title: "14 — Safety, SIDS & Child Abuse",
            title_en: "Safety, SIDS & Child Abuse",
            summaryHtml: `
<ul>
      <li>Leading cause of death by age: <b>infants</b> — congenital anomalies and SIDS; <b>1–4 years</b> — drowning; <b>over 5 years and adolescents</b> — <b>motor vehicle accidents</b> (unintentional injury overall)</li>
      <li><b>SIDS prevention</b>: <b>"Back to Sleep"</b> — supine on a firm mattress, no pillows, bumpers or soft toys, no co-sleeping in the parents' bed, avoid overheating and smoke exposure, offer a pacifier, and give supervised tummy time while awake</li>
      <li>Car seats: <b>rear-facing in the back seat</b> until at least 2 years, then forward-facing with a harness, then a booster; never in front of an airbag</li>
      <li>Poisoning: keep medicines and cleaners locked away in original containers; <b>call the poison centre first</b> — do not induce vomiting</li>
      <li><b>Child abuse — warning signs</b>: an injury inconsistent with the history or the child's developmental stage, a delay in seeking care, a changing story, bruises at different stages of healing or in unusual sites, <b>spiral or multiple fractures</b>, cigarette burns or immersion burns in a stocking/glove distribution, and a child who is <b>watchful, withdrawn, does not cry with painful procedures, and shows no preference for the parent</b></li>
      <li>Nursing response: <b>ensure the child's safety, document objectively (exact words, body maps, photographs as per policy), and report — reporting suspected abuse is a legal obligation</b>. Interview the child <b>alone</b>, in simple language, with open-ended non-leading questions; do not accuse the caregiver or promise to keep secrets</li>
      <li>Suspected abuse of a mother and child noticed on a home visit → ask an open, non-judgemental question in private, such as asking the mother directly whether anyone at home is hurting her or the child</li>
    </ul>
            `,
            questions: [
                {
                    q: "which of the following is the leading cause of injury for children who are more than five years old?",
                    options: ["accidental suffocation","motor vehicle","congenital anomalies","drowning"],
                    answer: 1,
                    source: 'SNLE recall',
                },
                {
                    q: "Child came to the ER with his parents to report as a witness about one victim from their neighbours. What should the nurse consider when question the child?",
                    options: ["Developmental activity","His awareness of the incident"],
                    answer: 1,
                    source: 'SNLE recall',
                },
                {
                    q: "During clinical assessment, the nurse suspected that a child has been psychological abuse. Which statement by the child is most likely support the suspicion",
                    options: ["My parents tell me that I amstupid","My parents hurt me to get attention from the doctors","My mother forces do not give meals on times","My uncle shows me picture of nude people"],
                    answer: 0,
                    source: 'SNLE recall',
                },
                {
                    q: "Mother of nine children, three of them with congenital anomalies down syndrome; she is a primary school graduate, with low first status. She is not using any method of family planning. According to primary health care nurse has referred her counselling. Which of the following phases of home visit accomplishes intervention?",
                    options: ["Initial","Closing","Action","Terminal"],
                    answer: 0,
                    source: 'SNLE recall',
                },
                {
                    q: "Community Nursing nurse is planning a follow-up visit to a family after their firstborn 18) child died from Sudden Infant Death-Syndrome (SIDS). Which action is the most important for the nurse to include in the initial visit??",
                    options: ["Help the family in planning for future children","Make a referral for genetic counselling and education","Allow time for the parents to express their anger an","Educate the family on the causes of SIDS"],
                    answer: 2,
                    source: 'SNLE recall',
                },
            ],
        },
    ],
};

export default pediatricNursing;
