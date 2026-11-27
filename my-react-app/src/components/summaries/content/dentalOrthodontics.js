// Orthodontics — dental-track section of the summaries catalog.
// Mirrored for the slide viewer in backend/content/summaryHtml (keep the two in sync).
// Inline questions are copied from the SQB bank.
const dentalOrthodontics = {
    id: "orthodontics",
    title: "Orthodontics",
    title_en: "SDLE Review — 9 Topics",
    icon: "shield-check",
    accent: "#38bdf8",
    intro: "Orthodontics — focused SDLE revision: Diagnosis & Cephalometrics · Class II Treatment · Class III Treatment · Transverse Problems & Expansion · Deep Bite & Open Bite · Habits & Interceptive Care · Diastema & Impacted Teeth · Biomechanics & Space Planning · Safety, Emergencies & Retention.",
    subtopics: [
        {
            id: "or-diagnosis",
            title: "01 — Classification & Cephalometrics",
            title_en: "Angle · SNA · SNB · ANB",
            summaryHtml: `
<h4 class="deck-topic">Angle classification (first molars)</h4>
<div class="deck-block deck-tbl">
  <table>
    <thead><tr><th>Class</th><th>Relationship</th></tr></thead>
    <tbody>
      <tr><td><b>I</b></td><td>Upper first-molar mesiobuccal cusp meets the lower first-molar buccal groove; malocclusion comes from crowding, spacing, rotations or bite problems</td></tr>
      <tr><td><b>II</b></td><td>Lower molar sits distal. <b>Division 1</b>: proclined upper incisors with increased overjet. <b>Division 2</b>: retroclined upper centrals, usually deep bite</td></tr>
      <tr><td><b>III</b></td><td>Lower molar sits mesial; often edge-to-edge or reverse overjet</td></tr>
    </tbody>
  </table>
</div>
<ul>
  <li>Angle classes describe teeth. Skeletal class is judged separately from the face and cephalogram.</li>
  <li><b>Class I</b> is the most common group, and crowding is a frequent complaint within it.</li>
  <li>Patients with repaired cleft lip and palate often show a <b>skeletal Class III</b> pattern from maxillary deficiency.</li>
</ul>
<h4 class="deck-topic">Key angles (common Steiner means)</h4>
<ul>
  <li><b>SNA</b> about 82 degrees: maxilla to cranial base.</li>
  <li><b>SNB</b> about 80 degrees: mandible to cranial base.</li>
  <li><b>ANB</b> about 2 degrees: jaw relation. Clearly higher suggests skeletal II; near zero or negative suggests skeletal III.</li>
  <li>Norms vary with population and age, and ANB is affected by the position of nasion and jaw rotation.</li>
</ul>
<h4 class="deck-topic">Locate the fault</h4>
<div class="sum-algo">
  <span class="sum-algo-title">Reading the numbers</span>
  <ol>
    <li>Look at ANB for the jaw relation.</li>
    <li>Use SNA to judge the maxilla and SNB to judge the mandible.</li>
    <li>Normal SNA with low SNB: <b>retrognathic mandible</b>.</li>
    <li>Then read incisor inclination and the vertical pattern.</li>
  </ol>
</div>
<h4 class="deck-topic">Full diagnosis and growth</h4>
<ul>
  <li>History, face (front and profile), smile, occlusion in three planes, space analysis, periodontal and caries status, photographs, models and justified radiographs.</li>
  <li>Check for a <b>functional shift</b> between first contact and maximum intercuspation.</li>
  <li>Cervical vertebral or hand-wrist maturity helps estimate growth stage. To confirm that growth has <b>finished</b>, superimposed serial lateral cephalograms are the usual reference.</li>
  <li>The Index of Orthodontic Treatment Need grades need; <b>grade 5</b> is very great need and includes clefts.</li>
</ul>
<div class="sum-key">
  <span class="sum-key-title">نقاط امتحانية</span>
  <ul>
    <li>Class I molars with crowding is still <b>Class I malocclusion</b>.</li>
    <li>Low SNB with normal SNA: mandibular retrognathia.</li>
    <li>Reverse overjet commonly goes with Class III.</li>
    <li>Cleft lip and palate: think maxillary deficiency.</li>
  </ul>
</div>
      `,
            questions: [
                {
                    "q": "Which finding defines an Angle Class I malocclusion?",
                    "options": [
                        "Distal molar relationship with normal alignment",
                        "Class I molar relationship with malaligned teeth",
                        "Mesial molar relationship with reverse overjet",
                        "Perfect alignment without an occlusal discrepancy"
                    ],
                    "answer": 1,
                    "explanation": "Angle Class I malocclusion retains the normal anteroposterior first-molar relationship while crowding, spacing, rotations, or other malalignment is present. Reference: Proffit WR et al. Contemporary Orthodontics. Angle classification. Page",
                    "source": "SDLE bank"
                },
                {
                    "q": "What is the most common type of malocclusion?",
                    "options": [
                        "Class I malocclusion",
                        "Class II malocclusion",
                        "Class III malocclusion",
                        "Open bite"
                    ],
                    "answer": 0,
                    "explanation": "Class I is the most common malocclusion, followed by Class II. Key takeaway: Class I is most common.",
                    "source": "SDLE recall"
                },
                {
                    "q": "Cephalometric analysis shows a normal SNA angle and a decreased SNB angle. What is the diagnosis?",
                    "options": [
                        "Prognathic maxilla",
                        "Retrognathic maxilla",
                        "Prognathic mandible",
                        "Retrognathic mandible"
                    ],
                    "answer": 3,
                    "explanation": "A normal SNA means the maxilla is in a normal position and a decreased SNB means the mandible is retrognathic. Key takeaway: SNB tells you about the mandible.",
                    "source": "SDLE recall"
                },
                {
                    "q": "Reverse overjet is most commonly associated with:",
                    "options": [
                        "Class III malocclusion",
                        "Class II Division 1",
                        "Class II Division 2",
                        "Class I malocclusion"
                    ],
                    "answer": 0,
                    "explanation": "Reverse overjet means the lower incisors are in front of the upper incisors, which is seen in Class III malocclusion. Key takeaway: Class III has a reverse overjet.",
                    "source": "SDLE recall"
                },
                {
                    "q": "Patients with cleft lip and palate commonly present with which skeletal malocclusion?",
                    "options": [
                        "Class I",
                        "Class II",
                        "Class III",
                        "Class IV"
                    ],
                    "answer": 2,
                    "explanation": "Cleft lip and palate often leads to maxillary hypoplasia after repair, so a skeletal Class III pattern is typical. Key takeaway: clefts give Class III.",
                    "source": "SDLE recall"
                }
            ],
        },
        {
            id: "or-class2",
            title: "02 — Class II Treatment",
            title_en: "Headgear · functional appliances",
            summaryHtml: `
<h4 class="deck-topic">First decide</h4>
<ul>
  <li>Dental or skeletal?</li>
  <li>Maxillary excess, mandibular deficiency, or both?</li>
  <li>Is the patient still growing, and what is the vertical pattern?</li>
</ul>
<h4 class="deck-topic">Headgear: maxillary excess in a growing child</h4>
<div class="deck-block deck-tbl">
  <table>
    <thead><tr><th>Pull</th><th>Vertical effect</th><th>Choose for</th></tr></thead>
    <tbody>
      <tr><td><b>Cervical (low)</b></td><td>Tends to extrude upper molars</td><td>Low-angle face, deep bite</td></tr>
      <tr><td><b>High pull</b></td><td>Resists eruption or intrudes</td><td><b>High-angle</b>, long face, open-bite tendency</td></tr>
      <tr><td><b>Combination</b></td><td>More horizontal result</td><td>Average vertical pattern</td></tr>
    </tbody>
  </table>
</div>
<h4 class="deck-topic">Functional appliances: mandibular deficiency</h4>
<ul>
  <li>Hold the mandible forward and use muscle force while the child is growing. Examples: <b>Twin Block</b>, <b>Bionator</b>, activator, Frankel II and the fixed Herbst.</li>
  <li>Best timed around the <b>pubertal growth spurt</b>.</li>
  <li>Much of the correction is dentoalveolar: upper incisors tip back and lower incisors tip forward, with a modest skeletal effect.</li>
  <li>So proclined upper with upright or <b>retroclined lower incisors</b> is a favourable pattern; already very proclined lower incisors are not.</li>
  <li>A Twin Block is two separate blocks, well tolerated and worn for long hours. Cooperation is essential.</li>
  <li>Division 2 often needs the upper incisors proclined first so the mandible can be postured forward.</li>
</ul>
<h4 class="deck-topic">After growth</h4>
<ul>
  <li><b>Camouflage</b>: move teeth (often with premolar extractions or temporary anchorage) when the skeletal problem is mild and the profile allows.</li>
  <li><b>Orthognathic surgery</b> with orthodontics for a severe discrepancy; mandibular advancement, commonly a bilateral sagittal split, treats mandibular deficiency.</li>
</ul>
<div class="sum-algo">
  <span class="sum-algo-title">Quick choice</span>
  <ol>
    <li>Growing, large maxilla: headgear matched to face height.</li>
    <li>Growing, small mandible: functional appliance.</li>
    <li>Adult mild: camouflage.</li>
    <li>Adult severe: combined surgical care.</li>
  </ol>
</div>
<div class="sum-key">
  <span class="sum-key-title">نقاط امتحانية</span>
  <ul>
    <li>Hyperdivergent Class II with maxillary excess: <b>high-pull headgear</b>.</li>
    <li>Bionator and Twin Block are <b>functional</b> appliances.</li>
    <li>Growth modification needs remaining growth.</li>
    <li>Always check lower incisor angulation before a functional appliance.</li>
  </ul>
</div>
      `,
            questions: [
                {
                    "q": "What is the appliance of choice for a Class II patient with a high vertical growth pattern?",
                    "options": [
                        "Cervical headgear",
                        "Reverse pull headgear",
                        "High-pull headgear",
                        "Twin block"
                    ],
                    "answer": 2,
                    "explanation": "High-pull headgear controls vertical growth in a Class II hyperdivergent patient. Cervical headgear extrudes molars, reverse-pull is for Class III and Twin Block is for horizontal growers. Key takeaway: high-pull for high angle.",
                    "source": "SDLE recall"
                },
                {
                    "q": "Which of the following is a functional appliance?",
                    "options": [
                        "Bionater",
                        "bite block",
                        "Headgear"
                    ],
                    "answer": 0,
                    "explanation": "The Bionator is a removable functional appliance. A bite block is only a bite plane and headgear is an extraoral force device. Key takeaway: Bionator = functional appliance.",
                    "source": "SDLE recall"
                },
                {
                    "q": "Which appliance is commonly used to correct a skeletal Class II malocclusion due to maxillary protrusion?",
                    "options": [
                        "Headgear",
                        "Reverse pull headgear",
                        "Twin block",
                        "Chin cup"
                    ],
                    "answer": 0,
                    "explanation": "Headgear restrains forward growth of the maxilla in a skeletal Class II due to maxillary protrusion. Reverse-pull headgear and chin cup are for Class III, and Twin Block is for mandibular deficiency. Key takeaway: maxillary excess needs headgear.",
                    "source": "SDLE recall"
                },
                {
                    "q": "11 yo male px with deficient mandible and retroclined lower anterior which appliance is suitable?",
                    "options": [
                        "twin block",
                        "herpes",
                        "Frankel"
                    ],
                    "answer": 0,
                    "explanation": "An 11-year-old with a deficient mandible is in the growth period, so a functional appliance that holds the mandible forward is suitable. The twin block is popular, comfortable and effective for Class II, and it can also help with the retroclined lower incisors by tipping them forward. Herbst and Frankel are other functional options.",
                    "source": "SDLE recall"
                }
            ],
        },
        {
            id: "or-class3",
            title: "03 — Class III & Pseudo-Class III",
            title_en: "Facemask · functional shift · surgery",
            summaryHtml: `
<h4 class="deck-topic">Rule out a functional shift</h4>
<ul>
  <li><b>Pseudo-Class III</b>: an incisor interference makes the child slide the mandible forward into reverse bite.</li>
  <li>Guided back into centric relation, the incisors often reach edge to edge and the profile looks better.</li>
  <li>Treat early by removing the cause, usually correcting the incisor inclination or interference.</li>
</ul>
<div class="deck-cards">
  <div class="deck-card diag">
    <div class="deck-card-h">Pseudo</div>
    <p>Forward slide on closure, near-normal jaw relation in centric relation, often retroclined upper incisors.</p>
  </div>
  <div class="deck-card clin">
    <div class="deck-card-h">True skeletal</div>
    <p>Reverse relation also in centric relation; small maxilla, large mandible or both. Often a family history. Incisors may compensate.</p>
  </div>
</div>
<h4 class="deck-topic">Growing patient</h4>
<ul>
  <li>Maxillary deficiency: <b>reverse-pull headgear (facemask)</b> to protract the maxilla, often with expansion when the maxilla is narrow.</li>
  <li>Better skeletal response when started <b>early</b>, usually in the early mixed dentition.</li>
  <li>Alternatives in selected cases: Frankel III, chin cup, or bone-anchored protraction. Chin-cup effect on final mandibular size is limited.</li>
  <li>Warn parents that later mandibular growth can cause relapse, so follow-up continues until growth ends.</li>
</ul>
<h4 class="deck-topic">Non-growing patient</h4>
<div class="deck-block deck-tbl">
  <table>
    <thead><tr><th>Severity</th><th>Approach</th></tr></thead>
    <tbody>
      <tr><td><b>Mild</b></td><td>Orthodontic camouflage, for example lower-arch extractions or distalisation with elastics, if gum and bone allow</td></tr>
      <tr><td><b>Severe</b></td><td><b>Orthognathic surgery</b>: maxillary advancement (Le Fort I), mandibular setback, or both, with orthodontics before and after</td></tr>
    </tbody>
  </table>
</div>
<ul>
  <li>Before surgery, orthodontics usually <b>removes dental compensation</b>, which may make the reverse overjet look worse.</li>
  <li>Definitive jaw surgery waits until growth, particularly mandibular growth, is complete.</li>
</ul>
<h4 class="deck-topic">Single anterior crossbite</h4>
<ul>
  <li>With Class I jaws it is usually dental. Make room, free the bite if needed, then move the tooth with a spring appliance or limited fixed braces (for example 2x4).</li>
</ul>
<div class="sum-key">
  <span class="sum-key-title">نقاط امتحانية</span>
  <ul>
    <li>Growing child with maxillary retrusion: <b>facemask</b>.</li>
    <li>Functional forward shift: <b>pseudo-Class III</b>.</li>
    <li>Severe adult discrepancy: surgery.</li>
    <li>Always examine in centric relation.</li>
  </ul>
</div>
      `,
            questions: [
                {
                    "q": "Which appliance is indicated for a patient with skeletal Class III malocclusion due to maxillary deficiency?",
                    "options": [
                        "High-pull headgear",
                        "Reverse pull headgear",
                        "Twin block appliance",
                        "Chin cup"
                    ],
                    "answer": 1,
                    "explanation": "Reverse-pull headgear (facemask) moves a deficient maxilla forward in a growing patient with Class III. High-pull headgear and Twin Block are for Class II and a chin cup restrains the mandible. Key takeaway: maxillary deficiency needs protraction.",
                    "source": "SDLE recall"
                },
                {
                    "q": "The treatment of a growing patient with skeletal Class III malocclusion is:",
                    "options": [
                        "Headgear",
                        "Facemask therapy",
                        "Twin block",
                        "Herbst appliance"
                    ],
                    "answer": 1,
                    "explanation": "Facemask (reverse-pull headgear) therapy moves the maxilla forward and is used in growing skeletal Class III patients. Headgear, Twin Block and Herbst are used for Class II. Key takeaway: Class III growing patient, use a facemask.",
                    "source": "SDLE recall"
                },
                {
                    "q": "Which description best defines a pseudo-Class III malocclusion?",
                    "options": [
                        "Functional anterior mandibular shift from an occlusal interference",
                        "Fixed skeletal mandibular prognathism without a shift",
                        "Maxillary protrusion with increased overjet",
                        "Bilateral posterior open bite from ankylosis"
                    ],
                    "answer": 0,
                    "explanation": "In pseudo-Class III, premature contacts guide the mandible forward on closure, creating an anterior crossbite that can mimic skeletal Class III. Reference: Proffit WR et al. Contemporary Orthodontics. Class III malocclusion and functional shifts. Page",
                    "source": "SDLE bank"
                },
                {
                    "q": "A 14-year-old patient presents with a single anterior crossbite. What is the most appropriate treatment?",
                    "options": [
                        "Posterior bite plate",
                        "Lingual arch",
                        "2×4 fixed orthodontic appliance",
                        "Removable Hawley appliance"
                    ],
                    "answer": 2,
                    "explanation": "A single anterior crossbite in a permanent dentition is corrected with a fixed 2x4 appliance. Posterior bite plate and lingual arch do not correct it, and a Hawley may also work in some cases. Key takeaway: 2x4 for localised anterior crossbite.",
                    "source": "SDLE recall"
                }
            ],
        },
        {
            id: "or-transverse",
            title: "04 — Posterior Crossbite & Expansion",
            title_en: "Functional shift · quad helix · RPE",
            summaryHtml: `
<h4 class="deck-topic">The classic trap</h4>
<ul>
  <li>A child who looks to have a <b>unilateral</b> crossbite with a lower midline shift usually has a <b>bilateral</b> maxillary constriction.</li>
  <li>The teeth meet edge to edge, so the mandible slides to one side to find a comfortable bite.</li>
  <li>If the midline centres in centric relation and the arches then show a symmetrical narrowness, <b>expand the maxilla bilaterally</b>.</li>
  <li>Treat early to remove the shift.</li>
  <li>In the primary dentition, a shift caused only by a primary-canine contact may be treated by <b>selective grinding</b>.</li>
  <li>A true unilateral crossbite without shift often reflects asymmetry and needs a different plan.</li>
</ul>
<h4 class="deck-topic">Dental or skeletal</h4>
<ul>
  <li>Dental: tipped teeth on an adequate base.</li>
  <li>Skeletal: narrow basal arch, often high palate; molars may already be flared buccally to compensate.</li>
</ul>
<div class="deck-block deck-tbl">
  <table>
    <thead><tr><th>Method</th><th>Key point</th></tr></thead>
    <tbody>
      <tr><td><b>Quad helix / W-arch</b></td><td>Slow expansion by pre-activated wire; adjusted by the clinician; opens the suture to some degree in young children</td></tr>
      <tr><td><b>Rapid palatal expander</b></td><td>Jackscrew (Hyrax or Haas) turned at a prescribed rate to open the midpalatal suture</td></tr>
      <tr><td><b>Mini-implant assisted</b></td><td>Selected adolescents and young adults</td></tr>
      <tr><td><b>Surgically assisted</b></td><td>Mature suture with severe skeletal deficiency, especially when tipping would endanger the periodontium</td></tr>
    </tbody>
  </table>
</div>
<h4 class="deck-topic">Activation and follow-up</h4>
<ul>
  <li>Many screws give about 0.25 mm per quarter turn, but the <b>schedule depends</b> on the intended rate, skeletal maturity, appliance design and response.</li>
  <li>During rapid expansion a midline diastema often appears and usually closes later.</li>
  <li>Overcorrect modestly and then <b>retain</b> to let bone fill and limit relapse.</li>
  <li>Age is only a guide: sutural maturity varies, so a young adult may still respond without surgery in a mild case.</li>
  <li>A retainer such as a Hawley can hold a corrected crossbite when needed.</li>
</ul>
<div class="sum-key">
  <span class="sum-key-title">نقاط امتحانية</span>
  <ul>
    <li>Unilateral crossbite plus shift: <b>bilateral expansion</b>.</li>
    <li>It is a typical reason for early treatment.</li>
    <li>Mature suture, severe deficiency: <b>surgically assisted</b> expansion.</li>
    <li>Quad helix is activated by adjusting the wire.</li>
  </ul>
</div>
      `,
            questions: [
                {
                    "q": "A child appears to have a unilateral posterior crossbite in maximum intercuspation, but the lower midline centers when guided into centric relation and bilateral maxillary constriction becomes evident. What is the diagnosis?",
                    "options": [
                        "True unilateral mandibular hyperplasia",
                        "Skeletal open bite",
                        "Bilateral constriction with functional shift",
                        "Class II subdivision"
                    ],
                    "answer": 2,
                    "explanation": "Occlusal interference can displace the mandible laterally, creating an apparent unilateral crossbite. Early correction helps remove the functional shift and asymmetric growth environment. Reference: Proffit WR, Fields HW, Larson B, Sarver DM. Contemporary Orthodontics. 7th ed. Functional posterior crossbite.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A 4-year-old has a functional mandibular shift caused by a premature primary-canine contact. What is the appropriate interceptive treatment?",
                    "options": [
                        "Wait until permanent dentition",
                        "Mandibular advancement appliance",
                        "Selective equilibration of the interference",
                        "Orthognathic surgery"
                    ],
                    "answer": 2,
                    "explanation": "Removing a clearly identified premature contact can eliminate the functional shift; broader transverse discrepancy may require appliance therapy instead. Reference: American Academy of Pediatric Dentistry. Management of the Developing Dentition and Occlusion. Reference Manual of Pediatric Dentistry. 2025:497-515.",
                    "source": "SDLE bank"
                },
                {
                    "q": "An adult has a severe skeletal transverse maxillary deficiency with mature sutures and significant periodontal risk from dental tipping. Which approach is most appropriate?",
                    "options": [
                        "Heavy removable expansion without monitoring",
                        "Extract one mandibular incisor",
                        "Skeletally assisted or surgically assisted expansion",
                        "Observe indefinitely"
                    ],
                    "answer": 2,
                    "explanation": "Severe mature skeletal constriction may exceed safe dentoalveolar compensation. MARPE or surgically assisted expansion is selected according to anatomy, maturity, magnitude, and team assessment. Reference: Proffit WR, Fields HW, Larson B, Sarver DM. Contemporary Orthodontics. 7th ed. Adult transverse correction.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A fixed rapid palatal expander has a jackscrew calibrated to 0.25 mm per quarter turn. What determines the prescribed activation schedule?",
                    "options": [
                        "Patient age alone",
                        "Tooth shade",
                        "One universal number for all expanders",
                        "Desired rate, skeletal maturity, appliance design, and clinician protocol"
                    ],
                    "answer": 3,
                    "explanation": "The amount per turn is device-specific, while daily activation and total expansion depend on the diagnosis, maturity, tissue response, and treatment objective. Reference: Proffit WR, Fields HW, Larson B, Sarver DM. Contemporary Orthodontics. 7th ed. Rapid and slow maxillary expansion.",
                    "source": "SDLE bank"
                },
                {
                    "q": "How is a quad-helix primarily activated?",
                    "options": [
                        "By controlled wire adjustment and expansion",
                        "By turning a midline jackscrew daily",
                        "By elastics from chin to forehead",
                        "By cutting the midpalatal suture"
                    ],
                    "answer": 0,
                    "explanation": "A quad-helix is a fixed spring appliance activated by adjustment of its wire arms and helices. It does not use the daily screw-turn protocol of a hyrax-type expander. Reference: Proffit WR, Fields HW, Larson B, Sarver DM. Contemporary Orthodontics. 7th ed. Slow expansion appliances.",
                    "source": "SDLE bank"
                }
            ],
        },
        {
            id: "or-vertical",
            title: "05 — Deep Bite, Open Bite & Face Height",
            title_en: "Intrude · extrude · vertical control",
            summaryHtml: `
<h4 class="deck-topic">Growth patterns</h4>
<div class="deck-cards">
  <div class="deck-card clin">
    <div class="deck-card-h">Hyperdivergent (long face)</div>
    <ul>
      <li>Steep mandibular plane, long lower face</li>
      <li>Lip incompetence, open-bite tendency</li>
    </ul>
  </div>
  <div class="deck-card diag">
    <div class="deck-card-h">Hypodivergent (short face)</div>
    <ul>
      <li>Flat mandibular plane, short lower face</li>
      <li>Deep-bite tendency, strong bite force</li>
    </ul>
  </div>
</div>
<h4 class="deck-topic">Correcting a deep bite</h4>
<div class="deck-block deck-tbl">
  <table>
    <thead><tr><th>Mechanic</th><th>Use when</th></tr></thead>
    <tbody>
      <tr><td><b>Intrude incisors</b></td><td>Over-erupted incisors, excessive incisor or gum display, normal or long lower face</td></tr>
      <tr><td><b>Extrude posteriors</b></td><td><b>Short face</b>, low angle, growing patient, acceptable incisor display; an anterior bite plane can help</td></tr>
      <tr><td><b>Procline incisors</b></td><td>Retroclined incisors with periodontal room</td></tr>
    </tbody>
  </table>
</div>
<ul>
  <li>Decide <b>which arch</b> is at fault from the smile and the curve of Spee. A big upper incisor display points to upper intrusion; an over-erupted lower segment points to lower intrusion.</li>
</ul>
<h4 class="deck-topic">Open bite</h4>
<ul>
  <li>Causes: sucking habit, forward tongue posture, skeletal pattern, trauma, airway factors.</li>
  <li>A dental open bite from a habit often improves if the habit stops while the incisors are still erupting.</li>
  <li>A growing long-face child: <b>control posterior eruption</b> (high-pull headgear, bite blocks) and avoid mechanics that extrude molars.</li>
  <li>Adults: posterior intrusion with temporary anchorage devices in suitable cases, or surgery.</li>
</ul>
<h4 class="deck-topic">Vertical maxillary excess</h4>
<ul>
  <li>Long lower third, large gummy display and lip incompetence.</li>
  <li>When severe in a mature patient, the usual definitive correction is <b>Le Fort I impaction</b>; the mandible then autorotates upward and forward.</li>
</ul>
<div class="sum-key">
  <span class="sum-key-title">نقاط امتحانية</span>
  <ul>
    <li>Deep bite with gummy smile: <b>intrude</b> incisors.</li>
    <li>Deep bite with short face: posterior <b>extrusion</b> may help.</li>
    <li>Long face and open bite: never let molars extrude further.</li>
    <li>Severe maxillary vertical excess in adults: maxillary impaction.</li>
  </ul>
</div>
      `,
            questions: [
                {
                    "q": "A patient has increased lower facial height, lip incompetence, a steep mandibular plane, and anterior open bite. What is the growth pattern?",
                    "options": [
                        "Hyperdivergent long-face pattern",
                        "Hypodivergent short-face pattern",
                        "Isolated transverse deficiency",
                        "Class II subdivision only"
                    ],
                    "answer": 0,
                    "explanation": "These findings describe a vertical hyperdivergent phenotype. They do not by themselves establish mouth breathing as the cause. Reference: Proffit WR, Fields HW, Larson B, Sarver DM. Contemporary Orthodontics. 7th ed. Vertical facial problems.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A deep bite is caused mainly by supraerupted incisors in a patient with excessive gingival display. Which mechanic is favored?",
                    "options": [
                        "Posterior intrusion",
                        "Incisor intrusion",
                        "Molar extraction automatically",
                        "Maxillary expansion only"
                    ],
                    "answer": 1,
                    "explanation": "True incisor intrusion can reduce overbite and gingival display when incisor position is the cause. Posterior extrusion may be avoided in long-face patients. Reference: Proffit WR, Fields HW, Larson B, Sarver DM. Contemporary Orthodontics. 7th ed. Deep-bite correction.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A deep bite occurs in a low-angle adolescent with deficient lower facial height and acceptable incisor display. Which mechanic may be useful?",
                    "options": [
                        "Incisor intrusion in every case",
                        "Surgical impaction",
                        "Controlled posterior extrusion",
                        "No vertical diagnosis"
                    ],
                    "answer": 2,
                    "explanation": "Bite opening by posterior eruption may suit a hypodivergent growing patient, whereas it can worsen a hyperdivergent pattern. Smile and vertical diagnosis guide the method. Reference: Proffit WR, Fields HW, Larson B, Sarver DM. Contemporary Orthodontics. 7th ed. Vertical problems and bite opening.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A growing hyperdivergent patient has an open bite. Which treatment principle is most important?",
                    "options": [
                        "Extrude posterior teeth indiscriminately",
                        "Control posterior vertical eruption",
                        "Increase lower facial height",
                        "Ignore habits and airway"
                    ],
                    "answer": 1,
                    "explanation": "Posterior eruption rotates the mandible down and back and can worsen a skeletal open bite. Growth, habits, airway, molar position, and skeletal severity determine the appliance or surgical plan. Reference: Proffit WR, Fields HW, Larson B, Sarver DM. Contemporary Orthodontics. 7th ed. Open-bite mechanics.",
                    "source": "SDLE bank"
                },
                {
                    "q": "An adult has vertical maxillary excess, excessive gingival display, and a long lower facial third. Which definitive skeletal correction is commonly indicated when severe?",
                    "options": [
                        "Facemask therapy",
                        "Cervical headgear",
                        "Maxillary impaction surgery",
                        "Mandibular expansion only"
                    ],
                    "answer": 2,
                    "explanation": "Le Fort I impaction can correct severe vertical maxillary excess and may permit autorotation of the mandible. The surgical plan depends on complete facial and cephalometric diagnosis. Reference: Proffit WR, Fields HW, Larson B, Sarver DM. Contemporary Orthodontics. 7th ed. Surgical correction of vertical maxillary excess.",
                    "source": "SDLE bank"
                }
            ],
        },
        {
            id: "or-habits",
            title: "06 — Habits, Airway & Interceptive Care",
            title_en: "Thumb sucking · tongue posture · mouth breathing",
            summaryHtml: `
<h4 class="deck-topic">What makes a habit harmful</h4>
<ul>
  <li><b>Duration</b> matters more than force: long daily hours move teeth. Frequency and intensity also count.</li>
  <li>Typical effects of digit sucking: proclined upper and retroclined lower incisors, increased overjet, anterior open bite, narrow maxilla and posterior crossbite.</li>
  <li>Constant forward <b>tongue resting posture</b> affects tooth position more than the brief contact of an occasional tongue thrust.</li>
</ul>
<h4 class="deck-topic">Managing digit sucking</h4>
<div class="sum-algo">
  <span class="sum-algo-title">Stepwise</span>
  <ol>
    <li>Very young child (about 2 years): reassure and observe.</li>
    <li>When the child is old enough to cooperate and the habit persists: explanation, praise and reward without punishment.</li>
    <li>Reminders such as a glove, bandage or other agreed cue.</li>
    <li>If it still persists as permanent incisors approach and the child wants help: a reminder appliance such as a <b>palatal crib</b> or bluegrass.</li>
  </ol>
</div>
<ul>
  <li>Many dental effects improve by themselves if the habit stops before the permanent incisors fully erupt.</li>
  <li>Exact age thresholds differ between references.</li>
  <li>A crib that causes a sore should first be inspected and adjusted.</li>
</ul>
<h4 class="deck-topic">Mouth breathing and long face</h4>
<ul>
  <li>Do not blame the face shape on mouth breathing without evidence of <b>persistent airway obstruction</b> and altered breathing.</li>
  <li>Refer for ENT or medical assessment when obstruction or sleep-disordered breathing is suspected.</li>
  <li>Expansion is for a <b>transverse dental or skeletal indication</b>. Normal width and no crossbite is not an indication just because the child breathes through the mouth.</li>
</ul>
<h4 class="deck-topic">What to treat early</h4>
<ul>
  <li>Crossbite with functional shift, damaging anterior crossbite, harmful persistent habits, space problems after early tooth loss, severe skeletal problems suited to growth modification and prominent incisors at high trauma or social risk.</li>
  <li>When several problems exist in a young child, a <b>transverse deficiency with crossbite</b> is commonly addressed first.</li>
</ul>
<div class="sum-key">
  <span class="sum-key-title">نقاط امتحانية</span>
  <ul>
    <li>Forward tongue posture is more important than rare thrusting.</li>
    <li>Toddler thumb sucking: reassurance and observation.</li>
    <li>Fixed reminder appliance: <b>palatal crib</b>.</li>
    <li>Mouth breathing alone is not a reason to expand.</li>
  </ul>
</div>
      `,
            questions: [
                {
                    "q": "A 7-year-old has an anterior open bite. The tongue rests forward continuously, thumb sucking is occasional, and tongue thrust occurs rarely during swallowing. Which factor is most likely maintaining the open bite?",
                    "options": [
                        "Forward resting tongue posture",
                        "Occasional thumb sucking",
                        "Rare tongue-thrust swallow",
                        "Normal incisor eruption"
                    ],
                    "answer": 0,
                    "explanation": "A low continuous force acting for many hours has more influence on tooth position than a brief intermittent swallowing force or an occasional habit. Reference: American Academy of Pediatric Dentistry. Management of the Developing Dentition and Occlusion. Reference Manual of Pediatric Dentistry. 2025:497-515.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A patient breathes through the mouth but has normal transverse maxillary width and no crossbite. Is expansion indicated solely for the breathing pattern?",
                    "options": [
                        "No; airway cause and transverse diagnosis must be established",
                        "Yes; expand every mouth breather",
                        "Yes; use surgery immediately",
                        "No; airway assessment is never relevant"
                    ],
                    "answer": 0,
                    "explanation": "Mouth breathing is multifactorial and does not by itself establish maxillary constriction or prove that expansion will correct the airway problem. ENT assessment may be appropriate. Reference: Proffit WR, Fields HW, Larson B, Sarver DM. Contemporary Orthodontics. 7th ed. Respiratory pattern and dentofacial development.",
                    "source": "SDLE bank"
                },
                {
                    "q": "Which finding is required before attributing a long-face pattern to mouth breathing?",
                    "options": [
                        "Evidence of persistent airway obstruction and altered respiratory function",
                        "A gummy smile alone",
                        "Lip incompetence alone",
                        "Increased facial height alone"
                    ],
                    "answer": 0,
                    "explanation": "The phenotype is not etiologically specific. History, nasal examination, medical assessment, and functional findings are needed before assigning causation. Reference: Proffit WR, Fields HW, Larson B, Sarver DM. Contemporary Orthodontics. 7th ed. Environmental influences on dentofacial growth.",
                    "source": "SDLE bank"
                },
                {
                    "q": "Case of pedo pt having thumb sucking habit what appliance you will choose?",
                    "options": [
                        "W arch",
                        "Palatal crib",
                        "Hass"
                    ],
                    "answer": 1,
                    "explanation": "For a child with a persistent thumb-sucking habit, a palatal crib is the classic fixed habit-breaking appliance: it blocks the thumb from resting on the palate and removes the pleasure of sucking. A W arch or Haas appliance is used mainly for expansion of a narrow maxilla. Counselling and positive reinforcement are tried first.",
                    "source": "SDLE recall"
                }
            ],
        },
        {
            id: "or-eruption",
            title: "07 — Diastema, Canines & Supernumeraries",
            title_en: "Frenum · impaction · localisation",
            summaryHtml: `
<h4 class="deck-topic">Midline diastema</h4>
<ul>
  <li>Often normal in the mixed dentition (<b>ugly duckling stage</b>).</li>
  <li>A small space, commonly quoted as <b>2 mm or less</b>, often closes as the lateral incisors and canines erupt. Observe.</li>
  <li>Look for causes: mesiodens, missing or small laterals, habit, tooth-size discrepancy, flared incisors, low thick frenum.</li>
  <li><b>Blanch test</b>: pulling the lip blanches the papilla behind the incisors when the frenum attaches there.</li>
</ul>
<div class="sum-algo">
  <span class="sum-algo-title">Persistent gap after canines erupt</span>
  <ol>
    <li>Remove or manage any <b>mesiodens</b> first and reassess.</li>
    <li>Close the space orthodontically.</li>
    <li>Then do the <b>frenectomy</b> if the frenum is the cause.</li>
    <li><b>Retain</b> long term, often with a bonded wire.</li>
  </ol>
</div>
<ul>
  <li>Cutting the frenum first may leave scar tissue that hinders closure.</li>
</ul>
<h4 class="deck-topic">Maxillary canines</h4>
<ul>
  <li>Palpate the buccal canine bulge from about <b>10 years</b>. Asymmetry or no bulge calls for investigation.</li>
  <li>To find buccal or palatal position use <b>two radiographs at different angles</b> (parallax). <b>SLOB</b>: same lingual, opposite buccal.</li>
  <li><b>CBCT</b> is justified when position or root resorption cannot be settled and the answer changes treatment.</li>
  <li>Extracting the primary canine can improve a palatally displaced canine in a suitable young patient with space.</li>
</ul>
<div class="deck-block deck-tbl">
  <table>
    <thead><tr><th>Option for impaction</th><th>When</th></tr></thead>
    <tbody>
      <tr><td><b>Observe</b></td><td>Selected cases with no pathology, with monitoring</td></tr>
      <tr><td><b>Expose and apply traction</b></td><td>Favourable position and space</td></tr>
      <tr><td><b>Autotransplant</b></td><td>Selected cases where traction is unsuitable and the tooth can be removed atraumatically</td></tr>
      <tr><td><b>Remove</b></td><td>Ankylosis, severe dilaceration, very poor position or damage to neighbours</td></tr>
    </tbody>
  </table>
</div>
<h4 class="deck-topic">Early loss of primary incisors</h4>
<ul>
  <li>Space loss is usually limited. With acceptable speech and appearance and no habit, observation is usually enough.</li>
</ul>
<div class="sum-key">
  <span class="sum-key-title">نقاط امتحانية</span>
  <ul>
    <li>Sequence for frenum diastema: <b>close, then frenectomy</b>, then retain.</li>
    <li>Mesiodens is dealt with first.</li>
    <li>Localise with <b>parallax</b>.</li>
    <li>Ankylosed damaging canine may need removal.</li>
  </ul>
</div>
      `,
            questions: [
                {
                    "q": "An adolescent has a persistent maxillary midline diastema, fully erupted canines, a thick low frenum, and a positive blanch test. What is the preferred sequence?",
                    "options": [
                        "Frenectomy years before space closure",
                        "Orthodontically close the space, then perform frenectomy if indicated",
                        "Extract the lateral incisors",
                        "Observe indefinitely"
                    ],
                    "answer": 1,
                    "explanation": "Closing the space before or in coordination with frenectomy reduces scar-related interference and allows the need for surgery to be reassessed. Retention is important because relapse risk remains. Reference: Proffit WR, Fields HW, Larson B, Sarver DM. Contemporary Orthodontics. 7th ed. Frenum-associated diastema.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A midline diastema is associated with a mesiodens on radiography. What is the first etiologic treatment?",
                    "options": [
                        "Frenectomy only",
                        "Expand the mandible",
                        "Manage the supernumerary tooth and then reassess the space",
                        "Intrude the molars"
                    ],
                    "answer": 2,
                    "explanation": "A supernumerary tooth can physically maintain the diastema or displace incisors. Its removal and timing are coordinated with eruption and orthodontic alignment. Reference: Dean JA. McDonald and Avery's Dentistry for the Child and Adolescent. 11th ed. Supernumerary teeth and eruption disturbance.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A maxillary canine is unerupted, and a periapical radiograph shows overlap with the lateral incisor. What is the next imaging step for buccolingual localization?",
                    "options": [
                        "Bitewing only",
                        "A second radiograph with tube shift or CBCT when indicated",
                        "Cephalogram only",
                        "No further imaging"
                    ],
                    "answer": 1,
                    "explanation": "Parallax using the SLOB principle can localize the canine; CBCT is justified when two-dimensional imaging cannot answer position, root resorption, or surgical planning questions. Reference: Proffit WR, Fields HW, Larson B, Sarver DM. Contemporary Orthodontics. 7th ed. Impacted canine diagnosis and localization.",
                    "source": "SDLE bank"
                },
                {
                    "q": "An impacted canine is severely dilacerated, ankylosed, and causing resorption of the lateral-incisor root. What management may be required?",
                    "options": [
                        "Forceful traction without reassessment",
                        "Observation despite progressive resorption",
                        "Extraction of all premolars automatically",
                        "Removal of the canine with replacement or space-closure planning"
                    ],
                    "answer": 3,
                    "explanation": "Poor position, ankylosis, pathology, or damage to adjacent teeth can make orthodontic alignment unfavorable. Extraction must be integrated with the final occlusal and esthetic plan. Reference: Proffit WR, Fields HW, Larson B, Sarver DM. Contemporary Orthodontics. 7th ed. Prognosis of impacted teeth.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A 4-year-old loses the maxillary primary incisors prematurely after trauma. Speech and esthetics are acceptable and no habit is developing. What is usually required?",
                    "options": [
                        "Fixed space maintainer in every case",
                        "Distal shoe appliance",
                        "Rapid palatal expansion",
                        "Observation without a space maintainer"
                    ],
                    "answer": 3,
                    "explanation": "Primary anterior tooth loss usually causes little space loss because the canines have erupted. An esthetic or functional appliance is optional when speech, habit, or psychosocial needs justify it. Reference: Dean JA. McDonald and Avery's Dentistry for the Child and Adolescent. 11th ed. Premature loss of primary anterior teeth.",
                    "source": "SDLE bank"
                }
            ],
        },
        {
            id: "or-biomechanics",
            title: "08 — Tooth Movement & Space Planning",
            title_en: "Centre of resistance · force · anchorage",
            summaryHtml: `
<h4 class="deck-topic">Biology</h4>
<ul>
  <li><b>Pressure side</b>: bone resorption by osteoclasts. <b>Tension side</b>: bone deposition.</li>
  <li>Light continuous force favours frontal resorption.</li>
  <li>Heavy force crushes the ligament (hyalinisation), causing delayed <b>undermining resorption</b>, pain and more risk to roots.</li>
  <li><b>Bisphosphonates</b> reduce osteoclast activity and can <b>slow</b> tooth movement; they matter for extraction risk too.</li>
</ul>
<h4 class="deck-topic">Types of movement</h4>
<div class="deck-block deck-tbl">
  <table>
    <thead><tr><th>Movement</th><th>Idea</th></tr></thead>
    <tbody>
      <tr><td><b>Uncontrolled tipping</b></td><td>Single force at the bracket with no counter-moment: crown and apex move opposite ways</td></tr>
      <tr><td><b>Controlled tipping</b></td><td>A partial counter-moment keeps the apex nearly still</td></tr>
      <tr><td><b>Bodily movement</b></td><td>Force effectively through the centre of resistance: crown and root move equally; needs more force</td></tr>
      <tr><td><b>Root movement / torque</b></td><td>Root moves more than the crown</td></tr>
      <tr><td><b>Intrusion</b></td><td>Needs the <b>lightest</b> force because stress concentrates at the apex</td></tr>
    </tbody>
  </table>
</div>
<ul>
  <li>For a single-rooted tooth the centre of resistance lies on the root, roughly a third to half of the way down from the bone crest. It moves apically when bone is lost.</li>
</ul>
<h4 class="deck-topic">Anchorage</h4>
<ul>
  <li>Resistance to unwanted movement. Reinforce with more teeth, transpalatal or lingual arches, headgear or <b>temporary anchorage devices</b>.</li>
</ul>
<h4 class="deck-topic">Extraction or not</h4>
<ul>
  <li>Crowding in millimetres alone does not decide. Combine <b>space analysis, profile, lips, incisor position, skeletal pattern, periodontal limits and growth</b>.</li>
  <li>A missing first-molar space may be closed by moving molars forward when the space is suitable, the third molar is favourable and anchorage and profile goals fit.</li>
  <li><b>Molar uprighting</b> time depends on the movement needed, force system, anchorage, bone and periodontal response.</li>
  <li>Corticotomy to speed treatment is invasive; offer only after a balanced discussion of limited, mostly short-term evidence, risks and alternatives.</li>
</ul>
<div class="sum-key">
  <span class="sum-key-title">نقاط امتحانية</span>
  <ul>
    <li>Force away from the centre of resistance without a couple: <b>tipping</b>.</li>
    <li>Intrusion uses very light force.</li>
    <li>Bisphosphonates slow movement.</li>
    <li>Extraction decisions need the whole diagnosis.</li>
  </ul>
</div>
      `,
            questions: [
                {
                    "q": "A single force is applied to a bracket away from the center of resistance with no counter-moment. What movement occurs?",
                    "options": [
                        "Translation",
                        "Pure rotation about the center of resistance",
                        "Uncontrolled tipping",
                        "Intrusion only"
                    ],
                    "answer": 2,
                    "explanation": "Because the line of force does not pass through the center of resistance, a moment is created and crown and root move in opposite directions around a center of rotation near the center of resistance. Reference: Proffit WR, Fields HW, Larson B, Sarver DM. Contemporary Orthodontics. 7th ed. Force systems and centers of rotation.",
                    "source": "SDLE bank"
                },
                {
                    "q": "What effect do bisphosphonates have on orthodontic tooth movement?",
                    "options": [
                        "Accelerate tooth movement",
                        "Slow tooth movement",
                        "No effect on tooth movement",
                        "Increase root resorption"
                    ],
                    "answer": 1,
                    "explanation": "Bisphosphonates reduce bone turnover and slow tooth movement. They do not speed up movement or increase resorption. Key takeaway: antiresorptive drugs slow orthodontics.",
                    "source": "SDLE recall"
                },
                {
                    "q": "An arch has 9 mm of crowding with a full profile and protrusive incisors. What information is required before choosing extractions?",
                    "options": [
                        "Crowding number alone",
                        "Molar classification alone",
                        "Patient age alone",
                        "Complete space, profile, skeletal, periodontal, and anchorage analysis"
                    ],
                    "answer": 3,
                    "explanation": "The same crowding can be managed differently depending on incisor position, facial esthetics, arch form, growth, tooth size, periodontal limits, and treatment goals. Reference: Proffit WR, Fields HW, Larson B, Sarver DM. Contemporary Orthodontics. 7th ed. Extraction decision and space analysis.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A missing first-molar space is small, the third molar is favorable, and the profile and anchorage goals support mesial movement. What may be considered?",
                    "options": [
                        "Mandatory implant placement",
                        "Extraction of the second molar",
                        "Orthodontic space closure",
                        "No treatment planning"
                    ],
                    "answer": 2,
                    "explanation": "Closure versus reopening depends on space, root position, third molar, anchorage, treatment time, facial profile, ridge anatomy, and restorative objectives. Reference: Proffit WR, Fields HW, Larson B, Sarver DM. Contemporary Orthodontics. 7th ed. Management of missing permanent molars.",
                    "source": "SDLE bank"
                },
                {
                    "q": "What primarily determines the duration of adult molar uprighting?",
                    "options": [
                        "Required movement, force system, anchorage, bone, and periodontal response",
                        "Chronologic age alone",
                        "Tooth shade",
                        "A universal two-month schedule"
                    ],
                    "answer": 0,
                    "explanation": "Duration varies with root position, amount of tipping, space, appliance, cortical limits, occlusion, and patient response. A recall without these variables cannot support a fixed time. Reference: Proffit WR, Fields HW, Larson B, Sarver DM. Contemporary Orthodontics. 7th ed. Adult orthodontic movement.",
                    "source": "SDLE bank"
                }
            ],
        },
        {
            id: "or-safety",
            title: "09 — Safety, Emergencies & Retention",
            title_en: "Disease control · ulcers · relapse",
            summaryHtml: `
<h4 class="deck-topic">Before braces</h4>
<ul>
  <li><b>Control active disease first</b>: caries, pulp infection, periodontal inflammation and poor plaque control.</li>
  <li>Urgent endodontic and caries care is never postponed until after orthodontics.</li>
  <li>If movement will change a tooth position or gum margin, use a well-fitting <b>provisional</b> restoration and place the final crown afterwards.</li>
</ul>
<h4 class="deck-topic">During treatment</h4>
<div class="deck-cards">
  <div class="deck-card diag">
    <div class="deck-card-h">White spot lesions</div>
    <p>Increase plaque control and fluoride, reduce sugar frequency and review; consider stopping treatment if control stays poor.</p>
  </div>
  <div class="deck-card clin">
    <div class="deck-card-h">Gingival enlargement</div>
    <p>Mostly plaque-induced inflammation: professional cleaning and better hygiene.</p>
  </div>
  <div class="deck-card mgmt">
    <div class="deck-card-h">Root resorption</div>
    <p>Higher risk with heavy force, long treatment and abnormal root shape. Monitor when indicated, lighten or pause force.</p>
  </div>
</div>
<h4 class="deck-topic">Emergencies</h4>
<div class="deck-block deck-tbl">
  <table>
    <thead><tr><th>Problem</th><th>Action</th></tr></thead>
    <tbody>
      <tr><td>Rubbing bracket or band</td><td>Orthodontic <b>wax</b> as temporary cover; adjust if faulty</td></tr>
      <tr><td>Long wire end hurting, visit far away</td><td><b>Shorten or tuck in</b> and secure it, catching the cut piece</td></tr>
      <tr><td>Appliance arm or crib ulcer</td><td>Adjust away from tissue and review healing</td></tr>
      <tr><td>Diffuse burning where nickel alloy touches</td><td>Consider contact <b>allergy</b>; assess and use nickel-free options if confirmed</td></tr>
      <tr><td>Ulcer still present about 2 weeks after the cause is removed</td><td><b>Investigate or refer</b>; biopsy may be needed</td></tr>
    </tbody>
  </table>
</div>
<ul>
  <li>Swallowed or inhaled parts with cough or breathing difficulty are an emergency.</li>
</ul>
<h4 class="deck-topic">Retention</h4>
<ul>
  <li>Teeth tend to relapse, so retention is planned from the start.</li>
  <li>Options: <b>Hawley</b>, clear vacuum-formed retainer, bonded lingual wire.</li>
  <li>High relapse risk: rotations, closed diastema and lower incisor alignment.</li>
  <li>Bonded retainers need floss access and long-term checks.</li>
</ul>
<div class="sum-key">
  <span class="sum-key-title">نقاط امتحانية</span>
  <ul>
    <li>Active caries first, braces later.</li>
    <li>New white spots: act on plaque and fluoride immediately.</li>
    <li>Non-healing ulcer after correction: do not keep waiting.</li>
    <li>Retention is part of treatment.</li>
  </ul>
</div>
      `,
            questions: [
                {
                    "q": "A patient beginning orthodontics has active cavitated caries and poor plaque control. What should occur first?",
                    "options": [
                        "Bond full appliances immediately",
                        "Delay all treatment until orthodontics ends",
                        "Control disease before comprehensive orthodontic mechanics",
                        "Ignore caries if asymptomatic"
                    ],
                    "answer": 2,
                    "explanation": "Active disease should be stabilized with hygiene, caries control, and necessary periodontal or pulpal treatment. Appliances increase plaque-retentive surfaces and complicate definitive restoration. Reference: Proffit WR, Fields HW, Larson B, Sarver DM. Contemporary Orthodontics. 7th ed. Pretreatment dental health.",
                    "source": "SDLE bank"
                },
                {
                    "q": "During orthodontics, a patient develops new white-spot lesions around brackets. What is the most important response?",
                    "options": [
                        "Increase orthodontic force",
                        "Ignore lesions until debonding",
                        "Intensify plaque and fluoride control and reassess treatment risk",
                        "Extract affected teeth"
                    ],
                    "answer": 2,
                    "explanation": "White-spot lesions indicate active enamel demineralization. Hygiene, dietary counseling, topical fluoride, bracket-area cleaning, and possibly pausing treatment are appropriate. Reference: Dean JA. McDonald and Avery's Dentistry for the Child and Adolescent. 11th ed. Caries prevention during orthodontics.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A distal orthodontic wire end is traumatizing the mucosa, and the next scheduled visit is in two weeks. What is the best immediate measure?",
                    "options": [
                        "Remove the entire appliance",
                        "Wait for the scheduled visit",
                        "Prescribe antibiotics",
                        "Shorten and secure the wire"
                    ],
                    "answer": 3,
                    "explanation": "Promptly removing or securing the sharp source prevents continued injury; wax is a temporary adjunct and the orthodontist should be notified. Reference: American Association of Orthodontists. What is an Orthodontic Emergency? 2026. https://aaoinfo.org/whats-trending/what-is- an-orthodontic-emergency/.",
                    "source": "SDLE bank"
                },
                {
                    "q": "An orthodontic ulcer does not heal two weeks after the appliance is corrected. What is the next step?",
                    "options": [
                        "Continue wax indefinitely",
                        "Increase wire activation",
                        "Ignore it",
                        "Investigate or refer for definitive diagnosis"
                    ],
                    "answer": 3,
                    "explanation": "Persistent ulceration after removal of a presumed traumatic cause requires evaluation for infection, immune disease, dysplasia, or malignancy. Reference: Glick M, ed. Burket's Oral Medicine. 13th ed. Persistent oral ulcers.",
                    "source": "SDLE bank"
                },
                {
                    "q": "Which restorative treatment generally should not be postponed until after orthodontics?",
                    "options": [
                        "Elective final reshaping of an intact tooth",
                        "Definitive veneer for a space being changed",
                        "Final crown contour that depends on tooth position",
                        "Treatment of active pulpal infection"
                    ],
                    "answer": 3,
                    "explanation": "Infection, pain, active caries, and structural instability require timely care. Elective definitive esthetic contours may wait until orthodontic objectives are complete. Reference: Proffit WR, Fields HW, Larson B, Sarver DM. Contemporary Orthodontics. 7th ed. Dental disease and treatment sequencing.",
                    "source": "SDLE bank"
                }
            ],
        },
    ],
};

export default dentalOrthodontics;
