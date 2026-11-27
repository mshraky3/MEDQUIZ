// Implant Dentistry — dental-track section of the summaries catalog.
// Mirrored for the slide viewer in backend/content/summaryHtml (keep the two in sync).
// Inline questions are copied from the SQB bank.
const dentalImplantDentistry = {
    id: "implant-dentistry",
    title: "Implant Dentistry",
    title_en: "SDLE Review — 9 Topics",
    icon: "shield-check",
    accent: "#f59e0b",
    intro: "Implant Dentistry — focused SDLE revision: Peri-implant Health & Disease · Spacing & Safety Distances · Patient Selection · Bone, Osseointegration & Loading · Components & Impressions · Implant Restorations & Occlusion · Surgical Planning & Complications · Bone & Soft-tissue Augmentation · Implant Overdentures.",
    subtopics: [
        {
            id: "im-periimplant",
            title: "01 — Peri-implant Health, Disease & Maintenance",
            title_en: "Mucositis · peri-implantitis · recall",
            summaryHtml: `
<h4 class="deck-topic">Tell them apart</h4>
<div class="deck-block deck-tbl">
  <table>
    <thead><tr><th>Condition</th><th>Inflammation (bleeding or pus on gentle probing)</th><th>Bone loss beyond initial remodelling</th></tr></thead>
    <tbody>
      <tr><td><b>Health</b></td><td>Absent</td><td>None</td></tr>
      <tr><td><b>Peri-implant mucositis</b></td><td>Present</td><td><b>None</b></td></tr>
      <tr><td><b>Peri-implantitis</b></td><td>Present, usually with deeper probing</td><td><b>Yes</b>, often a saucer or crater shape</td></tr>
    </tbody>
  </table>
</div>
<ul>
  <li>Compare with <b>baseline</b> probing and radiographs taken after the restoration has settled.</li>
  <li>Mucositis is reversible with plaque control and removal of the cause.</li>
  <li><b>Mobility</b> of the fixture is not a feature of early disease: it means osseointegration is lost.</li>
  <li>Thread exposure under a thin mucosa with no inflammation or progressive bone loss is a <b>soft-tissue dehiscence or recession</b>, not automatically peri-implantitis.</li>
</ul>
<h4 class="deck-topic">Risk factors</h4>
<ul>
  <li>Poor plaque control, history of periodontitis, missed maintenance.</li>
  <li>Smoking and poor glycaemic control.</li>
  <li><b>Residual cement</b>, a non-cleansable prosthesis, malposition.</li>
</ul>
<h4 class="deck-topic">Management</h4>
<div class="sum-algo">
  <span class="sum-algo-title">Stepwise approach</span>
  <ol>
    <li>Diagnose and look for the cause (cement, contour, loose part, plaque).</li>
    <li>Oral hygiene and professional decontamination; modify the prosthesis if it cannot be cleaned.</li>
    <li>For peri-implantitis, reassess; persistent disease often needs <b>surgical access</b>, with resective or regenerative treatment by defect shape.</li>
    <li>Hopeless or mobile implant: remove it.</li>
  </ol>
</div>
<ul>
  <li>Suppuration with a deep pocket and a small cervical radiopacity under a cemented crown: suspect <b>retained cement</b> and remove it, taking the crown off if needed for access.</li>
</ul>
<h4 class="deck-topic">Instruments and recall</h4>
<ul>
  <li>Plastic curettes scratch smooth titanium least; titanium curettes and ultrasonic tips with suitable sleeves are also used.</li>
  <li>Air polishing uses low-abrasive powders such as glycine or erythritol. Coarse powders can be abrasive, and subgingival spray needs the proper nozzle because of emphysema risk. It is only an <b>adjunct</b>.</li>
  <li>Recall follows risk. A patient with past periodontitis is often seen every <b>3 to 4 months</b>.</li>
  <li>At matching force, a probe tends to penetrate deeper around an implant than a tooth, because the fibre attachment differs.</li>
</ul>
<div class="sum-key">
  <span class="sum-key-title">نقاط امتحانية</span>
  <ul>
    <li>Bleeding without bone loss: <b>mucositis</b>.</li>
    <li>Bleeding or pus plus progressive bone loss: <b>peri-implantitis</b>.</li>
    <li>Mobile fixture: failed integration.</li>
    <li>Always consider excess cement around a cemented implant crown.</li>
  </ul>
</div>
      `,
            questions: [
                {
                    "q": "An implant has bleeding on probing and erythema but no suppuration, increasing probing depth, or bone loss beyond initial remodeling. What is the diagnosis?",
                    "options": [
                        "Peri-implantitis",
                        "Peri-implant mucositis",
                        "Failed osseointegration",
                        "Implant fracture"
                    ],
                    "answer": 1,
                    "explanation": "Peri-implant mucositis is inflammation confined to the peri-implant mucosa without progressive supporting-bone loss. Peri-implantitis requires inflammation plus progressive bone loss. Reference: Berglundh T, Armitage G, Araujo MG, et al. Peri-implant diseases and conditions: consensus report of Workgroup 4 of the 2017 World Workshop. J Clin Periodontol. 2018;45(Suppl 20):S286-S291.",
                    "source": "SDLE bank"
                },
                {
                    "q": "An implant has bleeding and suppuration, increasing probing depth, and radiographic bone loss beyond the initial remodeling level. What is the diagnosis?",
                    "options": [
                        "Peri-implant mucositis",
                        "Normal osseointegration",
                        "Peri-implantitis",
                        "Reversible screw loosening"
                    ],
                    "answer": 2,
                    "explanation": "The combination of peri-implant inflammation, increased probing depth, and progressive supporting- bone loss is diagnostic of peri-implantitis. Reference: Berglundh T, Armitage G, Araujo MG, et al. J Clin Periodontol. 2018;45(Suppl 20):S286-S291. Peri-implant disease definitions.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A cement-retained implant crown has localized bleeding, suppuration, and a deep facial pocket. Radiography shows a small cervical radiopacity. What is the most appropriate next step?",
                    "options": [
                        "Tighten the abutment screw without investigation",
                        "Replace the implant immediately",
                        "Observe without debridement",
                        "Remove the crown or access the margin and eliminate residual cement"
                    ],
                    "answer": 3,
                    "explanation": "The localized inflammatory pattern and cervical radiopacity make residual submucosal cement a leading cause. The area should be exposed as needed, cement removed, debrided, and then reassessed. Reference: Misch CE. Dental Implant Prosthetics. 3rd ed. Cement-retained restorations and peri-implant complications.",
                    "source": "SDLE bank"
                },
                {
                    "q": "Which manual instrument can debride a smooth titanium implant surface with minimal scratching?",
                    "options": [
                        "Plastic curette",
                        "Diamond bur",
                        "Steel sickle scaler",
                        "Carbon-steel curette"
                    ],
                    "answer": 0,
                    "explanation": "A plastic curette is nonmetallic and is less likely to scratch a smooth titanium surface during routine debridement. Instrument selection still depends on surface roughness, access, deposit type, and the intended procedure. Reference: Newman MG et al. Newman and Carranza's Clinical Periodontology. Implant maintenance section.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A patient with a history of periodontitis has stable implants after the first year but remains high risk. Which maintenance interval is most appropriate?",
                    "options": [
                        "Every 1-2 months",
                        "Every 3-4 months",
                        "Every 6-7 months",
                        "Every 8-9 months"
                    ],
                    "answer": 1,
                    "explanation": "High-risk patients require individualized, close supportive peri-implant care, commonly at 3-4-month intervals. The interval should be adjusted to disease history, inflammation, plaque control, smoking, diabetes, prosthesis cleansability, and adherence. Reference: Newman MG et al. Newman and Carranza's Clinical Periodontology. Supportive periodontal and peri-implant care sections.",
                    "source": "SDLE bank"
                }
            ],
        },
        {
            id: "im-spacing",
            title: "02 — Spacing & Safety Distances",
            title_en: "1.5 mm · 3 mm · 2 mm · papilla",
            summaryHtml: `
<h4 class="deck-topic">Commonly taught minimums</h4>
<div class="deck-block deck-tbl">
  <table>
    <thead><tr><th>Relationship</th><th>Guide</th></tr></thead>
    <tbody>
      <tr><td>Implant to natural tooth</td><td>About <b>1.5 mm</b></td></tr>
      <tr><td>Implant to implant</td><td>About <b>3 mm</b></td></tr>
      <tr><td>Implant to inferior alveolar canal</td><td>About <b>2 mm</b> safety margin</td></tr>
      <tr><td>Anterior to the mental foramen</td><td>A common zone is about 5 mm when the anterior loop is not mapped; imaging decides</td></tr>
      <tr><td>Facial and lingual bone</td><td>At least about 1 mm each side; more is preferred facially in the esthetic zone</td></tr>
    </tbody>
  </table>
</div>
<h4 class="deck-topic">Space calculation</h4>
<div class="sum-algo">
  <span class="sum-algo-title">Between two teeth</span>
  <ol>
    <li>Single implant: required mesiodistal space = diameter + 1.5 + 1.5.</li>
    <li>So a 4 mm implant needs about <b>7 mm</b>.</li>
    <li>Largest diameter = space minus 3 mm.</li>
    <li>Two implants: add both diameters + 3 mm to the teeth + 3 mm between implants.</li>
  </ol>
</div>
<ul>
  <li>Example: two 4 mm implants need about 14 mm.</li>
  <li>Also measure at root level: converging roots can make a good crown space unusable.</li>
  <li>Space too narrow: reassess orthodontic space opening and narrow implant options, or choose another replacement.</li>
</ul>
<h4 class="deck-topic">Diameter groups</h4>
<ul>
  <li>Cut-offs differ between manufacturers. About <b>3.5 to 4.5 mm</b> is commonly called regular; smaller is narrow and larger is wide.</li>
</ul>
<h4 class="deck-topic">Papilla</h4>
<ul>
  <li>Between a tooth and an implant, complete papilla fill is likely when the contact point is about <b>5 mm or less</b> from the bone crest. The bone on the tooth side matters most.</li>
  <li>Between two adjacent implants the papilla is shorter and less predictable; about 3 to 4 mm of soft tissue above the crest is typical.</li>
</ul>
<h4 class="deck-topic">When distances are broken</h4>
<ul>
  <li>Too close to a tooth: proximal bone loss, lost papilla, root injury, even external resorption if touching.</li>
  <li>Too close together: loss of inter-implant bone.</li>
  <li>An affected tooth is managed by its own diagnosis: monitor if vital and stable, treat the pulp if necrotic, and extract only if unrestorable.</li>
</ul>
<h4 class="deck-topic">Three dimensions</h4>
<ul>
  <li>Check <b>mesiodistal</b> space, <b>buccolingual</b> ridge width and <b>vertical</b> bone height separately.</li>
  <li>A 4 mm implant in a 4 mm wide ridge has no facial or lingual bone: width is the problem.</li>
</ul>
<div class="sum-key">
  <span class="sum-key-title">نقاط امتحانية</span>
  <ul>
    <li>Tooth to implant <b>1.5 mm</b>; implant to implant <b>3 mm</b>.</li>
    <li>Inferior alveolar canal margin <b>2 mm</b>.</li>
    <li>Tooth-side papilla: contact to bone <b>5 mm or less</b>.</li>
    <li>Subtract 3 mm from a single-tooth space to get the maximum diameter.</li>
  </ul>
</div>
      `,
            questions: [
                {
                    "q": "What minimum horizontal distance is commonly recommended between an implant and an adjacent natural tooth root?",
                    "options": [
                        "0.2 mm",
                        "5 mm",
                        "8 mm",
                        "1.5 mm"
                    ],
                    "answer": 3,
                    "explanation": "About 1.5 mm between the implant and adjacent root is a common planning guideline to protect the periodontal ligament and preserve proximal bone. Three-dimensional imaging and anatomy may require more. Reference: Misch CE. Contemporary Implant Dentistry. 4th ed. Mesiodistal implant spacing.",
                    "source": "SDLE bank"
                },
                {
                    "q": "For two adjacent implants, what minimum horizontal distance is commonly recommended between implant platforms to help preserve interimplant bone?",
                    "options": [
                        "0.5 mm",
                        "1 mm",
                        "3 mm",
                        "7 mm"
                    ],
                    "answer": 2,
                    "explanation": "Approximately 3 mm between adjacent implant platforms is a widely used planning guideline to reduce overlapping crestal bone remodeling and support interimplant tissue. Reference: Tarnow DP, Cho SC, Wallace SS. The effect of inter-implant distance on the height of inter-implant bone crest. J Periodontol. 2000;71:546-549.",
                    "source": "SDLE bank"
                },
                {
                    "q": "An implant with a diameter of 4 mm is planned between two natural teeth. What is the minimum mesiodistal space required?",
                    "options": [
                        "6 mm",
                        "7 mm",
                        "8 mm",
                        "9 mm"
                    ],
                    "answer": 1,
                    "explanation": "A 4 mm implant needs 1.5 mm on each side from the teeth, so 4 + 1.5 + 1.5 = 7 mm. Key takeaway: add 1.5 mm on each side of the implant diameter.",
                    "source": "SDLE recall"
                },
                {
                    "q": "Between a natural tooth and a single implant, complete papilla fill is most likely when the distance from the contact point to the crestal bone is approximately:",
                    "options": [
                        "5 mm or less",
                        "9 mm or more",
                        "Exactly 12 mm",
                        "Unrelated to bone height"
                    ],
                    "answer": 0,
                    "explanation": "Papilla presence is strongly influenced by contact-to-bone distance; fill is most predictable at about 5 mm or less. Tissue phenotype, tooth form, and proximal bone also matter. Reference: Tarnow DP, Magner AW, Fletcher P. The effect of the distance from the contact point to the crest of bone on the presence or absence of the interproximal dental papilla. J Periodontol. 1992;63:995-996.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A mandibular first-molar site has 8 mm of mesiodistal space. What is the largest implant diameter that preserves about 1.5 mm from each adjacent tooth?",
                    "options": [
                        "6 mm",
                        "5 mm",
                        "7 mm",
                        "8 mm"
                    ],
                    "answer": 1,
                    "explanation": "Subtracting approximately 1.5 mm on each side from an 8-mm space leaves about 5 mm for implant diameter. Reference: Misch CE. Contemporary Implant Dentistry. Mesiodistal implant spacing.",
                    "source": "SDLE bank"
                }
            ],
        },
        {
            id: "im-selection",
            title: "03 — Patient Selection & Treatment Choice",
            title_en: "Growth · diabetes · antiresorptives",
            summaryHtml: `
<h4 class="deck-topic">Assessment</h4>
<ul>
  <li>Medical history, medicines, smoking, expectations and ability to maintain hygiene.</li>
  <li>Caries and periodontal status: <b>control active disease first</b>.</li>
  <li>Occlusion and parafunction, restorative space, bone and soft tissue.</li>
</ul>
<h4 class="deck-topic">Medical factors</h4>
<div class="deck-cards">
  <div class="deck-card clin">
    <div class="deck-card-h">Diabetes</div>
    <p>Well-controlled diabetes is <b>not</b> an absolute contraindication. Poor control raises infection and failure risk, so improve control and complete disease therapy before elective grafting and implants.</p>
  </div>
  <div class="deck-card diag">
    <div class="deck-card-h">Antiresorptive drugs</div>
    <p><b>High-dose intravenous therapy for cancer</b>: avoid elective implants because of jaw osteonecrosis risk. Low-dose osteoporosis therapy needs individual risk assessment and consent.</p>
  </div>
  <div class="deck-card mgmt">
    <div class="deck-card-h">Other risks</div>
    <p>Heavy smoking, head and neck radiotherapy, immunosuppression, severe xerostomia with high caries risk, and unstable systemic disease need planning with the physician.</p>
  </div>
</div>
<h4 class="deck-topic">Growth</h4>
<ul>
  <li>An implant does not erupt. It behaves like an <b>ankylosed tooth</b> and becomes infraoccluded as growth continues.</li>
  <li>Delay definitive implants until facial growth is complete. Age alone is a poor test.</li>
  <li>Interim options: removable partial denture, resin-bonded bridge or space maintenance.</li>
</ul>
<h4 class="deck-topic">Keep the tooth or replace it?</h4>
<ul>
  <li>A <b>restorable tooth with a good prognosis</b> should generally be preserved. An implant is not automatically better than endodontic care.</li>
  <li>Extraction is favoured with a confirmed vertical root fracture, no achievable ferrule or hopeless periodontal support.</li>
</ul>
<h4 class="deck-topic">Replacement options</h4>
<ul>
  <li>Single implant: spares neighbouring teeth, but needs bone, space, surgery and healing.</li>
  <li>Fixed bridge: useful when neighbours already need crowns.</li>
  <li>Resin-bonded bridge: conservative for a short enamel-supported span.</li>
  <li>Removable denture: quick and economical; can replace missing soft-tissue contour.</li>
  <li>The usual modern implant is the <b>endosteal root-form</b> type. Subperiosteal designs are mainly special or historical solutions.</li>
</ul>
<div class="sum-key">
  <span class="sum-key-title">نقاط امتحانية</span>
  <ul>
    <li>Controlled diabetes: implants are possible with risk control.</li>
    <li>IV high-dose bisphosphonate for cancer: <b>avoid elective implants</b>.</li>
    <li>Incomplete growth: <b>delay</b> the implant.</li>
    <li>Do not extract a predictable tooth just to place an implant.</li>
  </ul>
</div>
      `,
            questions: [
                {
                    "q": "Is well-controlled diabetes an absolute contraindication to implant-supported tooth replacement?",
                    "options": [
                        "Yes, implants are always prohibited",
                        "Only removable dentures are allowed",
                        "No dental replacement is possible",
                        "No, implants may be considered with risk control"
                    ],
                    "answer": 3,
                    "explanation": "Controlled diabetes is not an absolute contraindication, but glycemic status, periodontal stability, healing risk, and maintenance must be assessed. Reference: European Federation of Periodontology. Diabetes and periodontitis recommendations; implant risk assessment.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A patient with cancer is receiving high-dose intravenous bisphosphonate therapy. What is the recommendation for elective implant placement?",
                    "options": [
                        "Place implants without risk discussion",
                        "Stop the drug for two days and proceed",
                        "Give antibiotics and ignore MRONJ risk",
                        "Avoid elective implant placement"
                    ],
                    "answer": 3,
                    "explanation": "AAOMS advises avoiding implant placement in oncology patients receiving parenteral antiresorptive or antiangiogenic therapy because of the higher MRONJ risk and uncertain long-term implant behavior. Reference: American Association of Oral and Maxillofacial Surgeons. MRONJ Position Paper—2022 Update.",
                    "source": "SDLE bank"
                },
                {
                    "q": "An implant placed in a growing adolescent later appears infraoccluded while adjacent natural teeth continue to erupt. What best explains this finding?",
                    "options": [
                        "The implant behaves like an ankylosed unit during continued growth",
                        "Normal implant eruption is delayed",
                        "Pulp necrosis develops inside the implant",
                        "The abutment undergoes orthodontic intrusion"
                    ],
                    "answer": 0,
                    "explanation": "An osseointegrated implant does not erupt or follow dentoalveolar growth like a natural tooth. Placement before growth completion can therefore produce progressive infraocclusion and esthetic discrepancy. Reference: Misch CE. Contemporary Implant Dentistry. 4th ed. Implant treatment in growing patients.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A nonrestorable anterior tooth is lost in a patient whose facial growth is incomplete. Which definitive replacement should generally be delayed?",
                    "options": [
                        "Osseointegrated implant",
                        "Removable interim prosthesis",
                        "Resin-bonded provisional restoration",
                        "Orthodontic space management"
                    ],
                    "answer": 0,
                    "explanation": "An implant behaves like an ankylosed unit and does not follow continued dentoalveolar growth. Interim tooth replacement and space preservation are used until growth is sufficiently complete. Reference: Misch CE. Contemporary Implant Dentistry. 4th ed. Implants in adolescents and growth considerations.",
                    "source": "SDLE bank"
                },
                {
                    "q": "When comparing endodontic retreatment with extraction and implant placement, which principle is most appropriate?",
                    "options": [
                        "Replace every root-filled tooth with an implant",
                        "Select treatment from radiographic appearance alone",
                        "Ignore patient preferences and maintenance needs",
                        "Preserve a restorable tooth with a favorable prognosis"
                    ],
                    "answer": 3,
                    "explanation": "The decision integrates restorability, periodontal and endodontic prognosis, cracks, strategic value, adjacent structures, implant-site anatomy, systemic factors, cost, time, and informed patient preference. Reference: Hargreaves KM, Berman LH, eds. Cohen's Pathways of the Pulp. 12th ed. Treatment planning and retention of the natural tooth.",
                    "source": "SDLE bank"
                }
            ],
        },
        {
            id: "im-bone-loading",
            title: "04 — Bone, Osseointegration & Loading",
            title_en: "Stability · D1 to D4 · success criteria",
            summaryHtml: `
<h4 class="deck-topic">Osseointegration</h4>
<ul>
  <li>Direct structural and functional contact between living bone and the loaded implant surface, without a fibrous layer at light-microscope level.</li>
  <li><b>Primary stability</b>: mechanical grip at placement.</li>
  <li><b>Secondary stability</b>: biological stability from bone healing and remodelling.</li>
  <li>Excessive micromovement during healing leads to fibrous encapsulation.</li>
  <li>Helpful factors: biocompatible surface, gentle surgery, heat control, good fit and controlled load. Bone injury rises sharply around 47 degrees Celsius for about one minute.</li>
</ul>
<h4 class="deck-topic">Bone density (Misch type scale)</h4>
<div class="deck-block deck-tbl">
  <table>
    <thead><tr><th>Type</th><th>Character</th><th>Concern</th></tr></thead>
    <tbody>
      <tr><td><b>D1</b></td><td>Mostly dense cortex, often anterior mandible</td><td>Heat during drilling, limited blood supply</td></tr>
      <tr><td><b>D2 / D3</b></td><td>Mix of cortex and trabecular bone</td><td>Generally favourable</td></tr>
      <tr><td><b>D4</b></td><td>Very soft trabecular bone, often posterior maxilla</td><td><b>Low primary stability</b></td></tr>
    </tbody>
  </table>
</div>
<ul>
  <li>In soft bone, surgeons may under-prepare the site, choose a suitable implant design and allow longer healing.</li>
</ul>
<h4 class="deck-topic">Measuring stability</h4>
<ul>
  <li>Insertion torque, careful clinical testing and <b>resonance frequency analysis</b> (reported as ISQ).</li>
  <li>RFA assesses stability or stiffness; it does not directly measure the percentage of bone contact.</li>
</ul>
<h4 class="deck-topic">When to load</h4>
<ul>
  <li>Immediate, early and conventional (delayed) protocols exist.</li>
  <li>There is no single waiting time. Decide by <b>stability, bone quality, grafting, implant system, load control and patient risk</b>.</li>
  <li>One-stage surgery leaves a <b>healing abutment</b> through the mucosa. Two-stage surgery buries the fixture under a <b>cover screw</b> and uncovers it later.</li>
  <li>If one implant is mobile with crestal bone loss at second-stage surgery, remove it.</li>
</ul>
<h4 class="deck-topic">Classic success criteria (Albrektsson era)</h4>
<ul>
  <li>No clinical mobility and no continuous peri-implant radiolucency.</li>
  <li>No persistent pain, infection or neuropathy.</li>
  <li>Historically about <b>1 to 1.5 mm</b> of bone remodelling accepted in year one, then less than about 0.2 mm each year. Modern goals aim to keep bone stable.</li>
</ul>
<div class="sum-key">
  <span class="sum-key-title">نقاط امتحانية</span>
  <ul>
    <li>D4 problem: <b>primary stability</b>.</li>
    <li>Early failure risk in the posterior maxilla rises when stability is poor.</li>
    <li>Loading depends on stability and protocol, not the calendar alone.</li>
    <li>A mobile fixture surrounded by radiolucency or bone has failed if it truly moves.</li>
  </ul>
</div>
      `,
            questions: [
                {
                    "q": "Why is D4 bone particularly challenging for implant placement?",
                    "options": [
                        "Excessive cortical density",
                        "Low primary stability",
                        "No blood supply",
                        "Guaranteed overheating"
                    ],
                    "answer": 1,
                    "explanation": "D4 bone has sparse trabeculation and minimal cortical support, reducing mechanical engagement at placement. Reference: Misch CE. Contemporary Implant Dentistry. Bone-density classification.",
                    "source": "SDLE bank"
                },
                {
                    "q": "Which intraoperative finding most directly increases the risk of early implant failure in the posterior maxilla?",
                    "options": [
                        "High blood supply",
                        "Light centric contact",
                        "Insufficient primary stability",
                        "Thick keratinized mucosa"
                    ],
                    "answer": 2,
                    "explanation": "Low-density posterior maxillary bone can make adequate primary stability difficult to obtain. Excessive micromotion during healing can prevent predictable osseointegration and produce fibrous encapsulation. Reference: Misch CE. Contemporary Implant Dentistry. Bone density, primary stability, and healing sections.",
                    "source": "SDLE bank"
                },
                {
                    "q": "What does resonance-frequency analysis assess around a dental implant?",
                    "options": [
                        "Pulp vitality",
                        "Implant stability",
                        "Gingival color",
                        "Crown shade"
                    ],
                    "answer": 1,
                    "explanation": "RFA measures stiffness of the implant-bone complex and reports an implant stability quotient rather than simple visual mobility. Reference: Meredith N. Assessment of implant stability as a prognostic determinant. Int J Prosthodont. 1998;11:491-501.",
                    "source": "SDLE bank"
                },
                {
                    "q": "At four months after placement, an implant is asymptomatic, immobile, and has stable crestal bone. What determines whether it may be restored?",
                    "options": [
                        "Completion of exactly six months in every patient",
                        "Clinical stability and the loading protocol, not time alone",
                        "Presence of a wide healing abutment only",
                        "Patient preference without examination"
                    ],
                    "answer": 1,
                    "explanation": "Healing time is influenced by primary stability, site, bone quality, surface, grafting, and loading protocol. There is no universal six-month requirement for every implant. Reference: Misch CE. Contemporary Implant Dentistry. 4th ed. Osseointegration and loading protocols.",
                    "source": "SDLE bank"
                },
                {
                    "q": "Under the classic implant-success criteria, how much crestal remodeling was historically accepted during the first year after loading?",
                    "options": [
                        "About 1-1.5 mm",
                        "About 4-5 mm",
                        "No bone remodeling ever",
                        "More than 6 mm"
                    ],
                    "answer": 0,
                    "explanation": "Classic criteria accepted approximately 1.5 mm during the first year and about 0.2 mm annually thereafter; contemporary systems and baseline-based diagnosis may show less. Reference: Albrektsson T et al. The long-term efficacy of currently used dental implants. Int J Oral Maxillofac Implants. 1986;1:11-25.",
                    "source": "SDLE bank"
                }
            ],
        },
        {
            id: "im-components",
            title: "05 — Components & Impressions",
            title_en: "Cover screw · coping · analog",
            summaryHtml: `
<h4 class="deck-topic">Know each part</h4>
<div class="deck-block deck-tbl">
  <table>
    <thead><tr><th>Part</th><th>Job</th></tr></thead>
    <tbody>
      <tr><td><b>Fixture</b></td><td>The part placed in bone</td></tr>
      <tr><td><b>Cover screw</b></td><td>Seals the connection under the mucosa during submerged healing</td></tr>
      <tr><td><b>Healing abutment</b></td><td>Keeps an opening through the mucosa and shapes tissue</td></tr>
      <tr><td><b>Abutment</b></td><td>Connects fixture and restoration</td></tr>
      <tr><td><b>Prosthetic screw</b></td><td>Holds the abutment or screw-retained crown</td></tr>
      <tr><td><b>Impression coping</b></td><td>Records the implant position in an impression</td></tr>
      <tr><td><b>Implant analog</b></td><td>Copies the implant position inside the master cast</td></tr>
      <tr><td><b>Scan body</b></td><td>Records the position in a digital scan</td></tr>
    </tbody>
  </table>
</div>
<h4 class="deck-topic">Open or closed tray</h4>
<div class="deck-cards">
  <div class="deck-card diag">
    <div class="deck-card-h">Closed tray (transfer)</div>
    <p>The coping <b>stays on the implant</b> when the tray comes out. It is removed, joined to an analog and repositioned in the impression. Helpful with limited opening or access.</p>
  </div>
  <div class="deck-card mgmt">
    <div class="deck-card-h">Open tray (pick-up)</div>
    <p>The tray has a window. The guide pin is loosened and the coping <b>comes out inside the impression</b>. Favoured for long copings, multiple or divergent implants and when accuracy is critical.</p>
  </div>
</div>
<ul>
  <li>Confirm every coping is fully seated, usually with a radiograph when the junction cannot be seen.</li>
  <li>Multiple implants for one splinted prosthesis may have copings joined with a rigid material before pick-up.</li>
</ul>
<h4 class="deck-topic">Soft-tissue contour</h4>
<ul>
  <li>A <b>customised healing abutment</b> or provisional crown shapes the emergence profile.</li>
  <li>To copy a developed provisional contour into the final cast, use a <b>customised impression coping</b> before the tissue collapses.</li>
</ul>
<h4 class="deck-topic">Connections</h4>
<ul>
  <li>Connections may be external or internal. The classic regular Branemark <b>external hex</b> is about 0.7 mm high and 2.7 mm across the flats.</li>
  <li>Parts are system specific: do not mix incompatible components, and use the recommended torque.</li>
</ul>
<h4 class="deck-topic">Something is loose</h4>
<ul>
  <li>Only the crown moves and the fixture is stable: check the <b>prosthetic screw or cement</b>.</li>
  <li>Crown, abutment and fixture move together: <b>loss of osseointegration</b>.</li>
</ul>
<div class="sum-key">
  <span class="sum-key-title">نقاط امتحانية</span>
  <ul>
    <li>Analog goes in the cast.</li>
    <li>Cover screw is submerged; healing abutment passes through the gum.</li>
    <li>Long or divergent copings: think <b>open tray</b>.</li>
    <li>Preserve an esthetic contour with a custom coping.</li>
  </ul>
</div>
      `,
            questions: [
                {
                    "q": "Which component seals the implant connection beneath the mucosa during a two-stage submerged- healing protocol?",
                    "options": [
                        "Implant analog",
                        "Impression coping",
                        "Provisional cylinder",
                        "Cover screw"
                    ],
                    "answer": 3,
                    "explanation": "A low-profile cover screw closes the implant connection while the flap is closed over the fixture. It is replaced by a healing or restorative component at second-stage surgery. Reference: Misch CE. Contemporary Implant Dentistry. 4th ed. One-stage and two-stage healing.",
                    "source": "SDLE bank"
                },
                {
                    "q": "Which component is embedded in a master cast to reproduce the three-dimensional position of an implant?",
                    "options": [
                        "Healing abutment",
                        "Cover screw",
                        "Torque wrench",
                        "Implant analog"
                    ],
                    "answer": 3,
                    "explanation": "An implant analog is the laboratory replica of the implant connection and is incorporated into the cast after an impression or digital transfer. Reference: Misch CE. Dental Implant Prosthetics. 3rd ed. Implant impression components and laboratory analogs.",
                    "source": "SDLE bank"
                },
                {
                    "q": "Which impression component is removed from the implant after a closed-tray impression and then repositioned into the impression with an analog?",
                    "options": [
                        "Open-tray pick-up coping",
                        "Closed-tray transfer coping",
                        "Cover screw",
                        "Final abutment screw"
                    ],
                    "answer": 1,
                    "explanation": "A closed-tray coping stays intraorally when the impression is removed. It is then connected to an analog and accurately reseated in the impression. Reference: Misch CE. Dental Implant Prosthetics. 3rd ed. Closed-tray transfer impression technique.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A provisional implant crown has developed an ideal esthetic-zone tissue contour. Which component best transfers that contour to the definitive cast?",
                    "options": [
                        "Stock cover screw",
                        "Implant analog alone",
                        "Customized impression coping",
                        "Standard healing cap only"
                    ],
                    "answer": 2,
                    "explanation": "A customized coping supports the established emergence profile during impression making and records it for the laboratory. Reference: Hinds KF. Custom impression coping for exact registration of healed tissue. J Prosthet Dent. 1997;77:575-578.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A long implant impression coping projects through the planned tray path. Which impression technique is indicated?",
                    "options": [
                        "Closed tray without relief",
                        "Alginate study cast only",
                        "Bite registration only",
                        "Open-tray pick-up impression"
                    ],
                    "answer": 3,
                    "explanation": "The coping screw is accessed through an opening in the tray, allowing the coping to remain locked in the impression during removal. Reference: Misch CE. Dental Implant Prosthetics. Open-tray impression technique.",
                    "source": "SDLE bank"
                }
            ],
        },
        {
            id: "im-restoration",
            title: "06 — Implant Restorations & Occlusion",
            title_en: "Screw vs cement · space · occlusion",
            summaryHtml: `
<h4 class="deck-topic">Screw-retained or cemented</h4>
<div class="deck-block deck-tbl">
  <table>
    <thead><tr><th></th><th>Screw-retained</th><th>Cement-retained</th></tr></thead>
    <tbody>
      <tr><td>Retrievability</td><td><b>Easy</b></td><td>Limited</td></tr>
      <tr><td>Small vertical space</td><td><b>Preferred</b></td><td>Needs enough abutment height and more space</td></tr>
      <tr><td>Excess cement risk</td><td>None at the gum margin</td><td>Present</td></tr>
      <tr><td>Angulation</td><td>Access hole must emerge acceptably, or use an angled channel</td><td>Hides moderate angulation differences</td></tr>
    </tbody>
  </table>
</div>
<ul>
  <li>With about 4 mm of vertical space, a <b>screw-retained</b> design is usually the feasible choice, if the system allows it.</li>
  <li>Any space value is meaningful only with its landmarks, implant system, retention type and material.</li>
  <li><b>Crown height space</b> is measured from the bone crest or implant platform (state which) to the occlusal plane.</li>
  <li>With cement, keep margins accessible, use little cement and remove all excess.</li>
</ul>
<h4 class="deck-topic">Passive fit</h4>
<ul>
  <li>A multi-unit screw-retained framework must seat <b>passively</b>. Forcing it down with screws loads screws, components and bone and leads to loosening or fracture.</li>
</ul>
<h4 class="deck-topic">Occlusion</h4>
<ul>
  <li>An implant has <b>no periodontal ligament</b>, so it moves far less and gives less tactile feedback than a tooth.</li>
  <li>Aim to reduce overload: <b>narrow occlusal table</b>, flatter cusps, load near the long axis, light single-crown contacts, avoid heavy excursive contacts and minimise cantilevers.</li>
  <li>With bruxism, consider a protective appliance.</li>
</ul>
<h4 class="deck-topic">Esthetics</h4>
<ul>
  <li>Plan the <b>position from the final tooth</b>.</li>
  <li>Gray show-through under thin mucosa: a <b>zirconia</b> abutment or tooth-coloured design can help; thickening the soft tissue may also be needed.</li>
  <li>A facially inclined implant can put the screw hole on the labial face.</li>
  <li>A badly malpositioned implant with loss of the facial plate and severe recession may need removal and reconstruction, not only a soft-tissue graft.</li>
</ul>
<div class="sum-key">
  <span class="sum-key-title">نقاط امتحانية</span>
  <ul>
    <li>Need retrievability or have little height: <b>screw retained</b>.</li>
    <li>Splinted screw prosthesis: <b>passive fit</b>.</li>
    <li>Gray margin: consider zirconia and tissue thickness.</li>
    <li>Narrow table and axial load protect the implant.</li>
  </ul>
</div>
      `,
            questions: [
                {
                    "q": "A single implant crown has only 4 mm of available vertical restorative space. Which retention design is most feasible?",
                    "options": [
                        "Cement-retained crown",
                        "Screw-retained crown",
                        "Bar overdenture",
                        "Telescopic crown"
                    ],
                    "answer": 1,
                    "explanation": "A direct screw-retained implant crown can often be designed within approximately 4-5 mm of vertical space. Cement retention generally requires greater height for an abutment, cement space, and restorative material. Reference: Misch CE. Dental Implant Prosthetics. Crown-height space and retention sections.",
                    "source": "SDLE bank"
                },
                {
                    "q": "What technical complication is especially important when fabricating a screw-retained multi-unit implant prosthesis?",
                    "options": [
                        "Excess luting cement",
                        "Lack of passive framework fit",
                        "Inability to retrieve the prosthesis",
                        "Guaranteed screw stability"
                    ],
                    "answer": 1,
                    "explanation": "A multi-unit framework that does not seat passively can transmit strain to screws, components, and supporting bone. Reference: Misch CE. Dental Implant Prosthetics. Passive fit of implant frameworks.",
                    "source": "SDLE bank"
                },
                {
                    "q": "Which occlusal design reduces lateral load on a posterior implant crown?",
                    "options": [
                        "Wide occlusal table",
                        "Narrow occlusal table",
                        "Steep cusps",
                        "Heavy eccentric contacts"
                    ],
                    "answer": 1,
                    "explanation": "A narrower table and reduced cusp inclines decrease cantilever-like leverage and nonaxial forces on the implant restoration. Reference: Misch CE. Dental Implant Prosthetics. Implant-protective occlusion.",
                    "source": "SDLE bank"
                },
                {
                    "q": "Which abutment material is preferred when a gray cervical show-through compromises an anterior implant restoration?",
                    "options": [
                        "Titanium",
                        "Cobalt-chromium",
                        "Gold alloy",
                        "Zirconia"
                    ],
                    "answer": 3,
                    "explanation": "Zirconia is tooth-colored and reduces gray shine-through in an esthetically demanding anterior site, especially with thin peri-implant tissues. Connection design, strength, implant position, and restorative space must also be assessed. Reference: Misch CE. Dental Implant Prosthetics. Esthetic abutment-selection section.",
                    "source": "SDLE bank"
                },
                {
                    "q": "An anterior implant is facially inclined, and a straight screw-access channel would emerge through the labial surface. What is the main restorative problem?",
                    "options": [
                        "Unacceptable screw-access position",
                        "Excessive osseointegration",
                        "Increased papilla height",
                        "Pulpal exposure"
                    ],
                    "answer": 0,
                    "explanation": "Facial implant angulation can direct the access channel through the visible facial surface. An angled screw-channel component, cemented solution, or surgical correction may be considered according to system limits and case design. Reference: Misch CE. Dental Implant Prosthetics. 3rd ed. Implant angulation and screw-access design.",
                    "source": "SDLE bank"
                }
            ],
        },
        {
            id: "im-surgery",
            title: "07 — Surgical Planning & Complications",
            title_en: "CBCT · guides · nerves",
            summaryHtml: `
<h4 class="deck-topic">Planning</h4>
<ul>
  <li><b>Prosthetically driven</b>: design the tooth first, then choose implant position, depth and angle.</li>
  <li><b>CBCT</b> shows bone width and height, canal, foramina, sinus and concavities in three dimensions.</li>
  <li>A surgical guide transfers the planned position and angulation to the mouth.</li>
</ul>
<h4 class="deck-topic">Guided surgery safety</h4>
<ul>
  <li>Confirm the guide is <b>fully seated and stable</b> before drilling.</li>
  <li>Long sleeves can restrict irrigation and cause <b>heat</b>: irrigate well, pump the drill and keep it sharp.</li>
  <li>A guide does not replace anatomical knowledge; errors can build up.</li>
</ul>
<h4 class="deck-topic">Structures at risk</h4>
<div class="deck-block deck-tbl">
  <table>
    <thead><tr><th>Region</th><th>Main risk</th></tr></thead>
    <tbody>
      <tr><td>Lower molar</td><td><b>Inferior alveolar nerve</b>; lingual undercut perforation</td></tr>
      <tr><td>Lower premolar</td><td><b>Mental nerve</b> and the anterior loop</td></tr>
      <tr><td>Anterior mandible</td><td>Lingual perforation and floor-of-mouth bleeding, which can threaten the airway</td></tr>
      <tr><td>Posterior maxilla</td><td>Sinus membrane and implant displacement into the sinus</td></tr>
      <tr><td>Anterior maxilla</td><td>Nasopalatine canal, nasal floor, facial plate</td></tr>
    </tbody>
  </table>
</div>
<ul>
  <li>The region between the mental foramina avoids the main inferior alveolar canal, but it is <b>not</b> free of vessels or nerve branches.</li>
</ul>
<h4 class="deck-topic">Altered sensation</h4>
<div class="sum-algo">
  <span class="sum-algo-title">Numb lip after placement</span>
  <ol>
    <li>Assess early, once local anaesthetic should have worn off.</li>
    <li>Map the area and image the implant in relation to the nerve.</li>
    <li>If the implant is impinging, prompt removal or repositioning (backing out) is considered.</li>
    <li>Document, follow up and refer early when indicated.</li>
  </ol>
</div>
<h4 class="deck-topic">Injury to a neighbouring tooth</h4>
<ul>
  <li>An implant touching a root can cause <b>iatrogenic</b> damage, including progressive external resorption.</li>
  <li>Test the tooth, image over time and treat it according to pulp and periodontal findings.</li>
</ul>
<h4 class="deck-topic">Asepsis</h4>
<ul>
  <li>Implant placement is a surgical procedure: use surgical hand antisepsis, sterile gloves, sterile instruments and sterile irrigation.</li>
</ul>
<div class="sum-key">
  <span class="sum-key-title">نقاط امتحانية</span>
  <ul>
    <li>Purpose of a guide: transfer <b>position and angulation</b>.</li>
    <li>Premolar region with lip and chin numbness: <b>mental nerve</b>.</li>
    <li>Seat the guide before any drilling.</li>
    <li>Restricted irrigation means thermal risk.</li>
  </ul>
</div>
      `,
            questions: [
                {
                    "q": "What is the primary purpose of a prosthetically driven implant surgical guide?",
                    "options": [
                        "Diagnose pulp vitality",
                        "Measure periodontal attachment loss",
                        "Replace the definitive prosthesis",
                        "Transfer the planned implant position and angulation to surgery"
                    ],
                    "answer": 3,
                    "explanation": "A surgical guide links the restorative plan to osteotomy preparation and implant placement. Its degree of control depends on whether it guides position only, pilot drilling, or the full drilling sequence. Reference: Misch CE. Contemporary Implant Dentistry. 4th ed. Prosthetically driven planning and surgical guides.",
                    "source": "SDLE bank"
                },
                {
                    "q": "Before beginning guided implant drilling, what must be verified intraorally?",
                    "options": [
                        "Crown shade only",
                        "Implant torque after final restoration",
                        "Complete guide seating and stability",
                        "Papilla height on the contralateral side only"
                    ],
                    "answer": 2,
                    "explanation": "An incompletely seated or mobile guide transfers positional error to every guided step. Fit, support, fixation, access, planned depth, and adjacent anatomy must be confirmed before drilling. Reference: Misch CE. Contemporary Implant Dentistry. 4th ed. Clinical verification of surgical guides.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A fully guided osteotomy is performed through a long sleeve. Which safety issue requires particular attention?",
                    "options": [
                        "Increased pulp vitality",
                        "Restricted irrigation and heat generation",
                        "Spontaneous papilla formation",
                        "Elimination of drilling error"
                    ],
                    "answer": 1,
                    "explanation": "Sleeves and keys can limit coolant access and visibility. Intermittent drilling, sharp drills, prescribed speed, adequate irrigation, and depth verification reduce thermal injury. Reference: Misch CE. Contemporary Implant Dentistry. 4th ed. Risks and limitations of guided surgery.",
                    "source": "SDLE bank"
                },
                {
                    "q": "Persistent lower-lip and chin numbness begins immediately after implants are placed in the mandibular premolar region. Which structure was most likely injured?",
                    "options": [
                        "Buccal nerve",
                        "Lingual nerve",
                        "Mylohyoid nerve",
                        "Mental nerve"
                    ],
                    "answer": 3,
                    "explanation": "The mental nerve exits near the mandibular premolars and supplies sensation to the lower lip and chin. Immediate postoperative numbness in that distribution requires urgent neurosensory assessment and imaging. Reference: Misch CE. Contemporary Implant Dentistry. Mandibular anatomy and neurosensory-complication sections.",
                    "source": "SDLE bank"
                },
                {
                    "q": "Implant surgery at tooth 37 causes neurosensory symptoms involving the ipsilateral mandibular distribution. Which nerve is most at risk?",
                    "options": [
                        "Incisive nerve",
                        "Infraorbital nerve",
                        "Greater palatine nerve",
                        "Inferior alveolar nerve"
                    ],
                    "answer": 3,
                    "explanation": "The mandibular canal and inferior alveolar neurovascular bundle lie in the posterior mandible near molar implant sites. Reference: Misch CE. Contemporary Implant Dentistry. Posterior mandibular anatomy.",
                    "source": "SDLE bank"
                }
            ],
        },
        {
            id: "im-augmentation",
            title: "08 — Bone & Soft-tissue Augmentation",
            title_en: "GBR · sinus lift · connective-tissue graft",
            summaryHtml: `
<h4 class="deck-topic">Why augment</h4>
<ul>
  <li>To place the implant in the <b>prosthetically correct position</b> with bone around it, and to support stable, esthetic soft tissue.</li>
  <li>Control periodontal disease and risk factors before elective grafting.</li>
</ul>
<h4 class="deck-topic">Graft sources</h4>
<div class="deck-block deck-tbl">
  <table>
    <thead><tr><th>Graft</th><th>Origin</th></tr></thead>
    <tbody>
      <tr><td><b>Autograft</b></td><td>Same patient; has living cells and growth factors; needs a donor site</td></tr>
      <tr><td><b>Allograft</b></td><td>Another human</td></tr>
      <tr><td><b>Xenograft</b></td><td>Another species</td></tr>
      <tr><td><b>Alloplast</b></td><td>Synthetic</td></tr>
    </tbody>
  </table>
</div>
<ul>
  <li><b>Osteogenesis</b> (living cells), <b>osteoinduction</b> (signals recruit and differentiate cells), <b>osteoconduction</b> (scaffold). Fresh autograft can offer all three.</li>
</ul>
<h4 class="deck-topic">Ridge defects</h4>
<ul>
  <li><b>Guided bone regeneration</b>: a barrier membrane keeps soft tissue out while bone fills the space.</li>
  <li>Larger vertical or combined defects need good space maintenance, for example a <b>titanium-reinforced</b> membrane or a block graft. These are demanding procedures.</li>
  <li>Success needs primary closure, graft stability, blood supply and space.</li>
</ul>
<h4 class="deck-topic">Posterior maxilla</h4>
<ul>
  <li><b>Transcrestal (internal) sinus elevation</b>: for a modest gain when useful residual height remains, for example about 7 mm.</li>
  <li><b>Lateral window</b>: for greater gain or little residual height. Cut-offs differ between texts.</li>
  <li>Short implants can be an alternative in selected cases.</li>
</ul>
<h4 class="deck-topic">Infected failed site</h4>
<ul>
  <li>With acute pus, a large non-contained defect and no chance of stability: <b>remove, debride, reconstruct as needed, heal, then replace later</b>.</li>
</ul>
<h4 class="deck-topic">Soft tissue</h4>
<ul>
  <li>Thin facial mucosa with recession around a <b>well-positioned, stable, clean</b> implant with intact bone: a <b>connective-tissue graft</b> is the usual choice.</li>
  <li>Wrong implant position must be recognised first, because a graft cannot move the fixture.</li>
  <li>A free gingival graft is used mainly to gain keratinised tissue where color match matters less.</li>
</ul>
<div class="sum-key">
  <span class="sum-key-title">نقاط امتحانية</span>
  <ul>
    <li>Membrane principle: <b>guided bone regeneration</b>.</li>
    <li>About 7 mm below the sinus with small gain needed: <b>transcrestal lift</b>.</li>
    <li>Thin tissue and correct implant: <b>connective-tissue graft</b>.</li>
    <li>Deficient width: augment or change the plan; do not force a wide implant.</li>
  </ul>
</div>
      `,
            questions: [
                {
                    "q": "A maxillary molar extraction site has approximately 7 mm of residual bone below the sinus and needs a modest vertical gain. Which approach is appropriate?",
                    "options": [
                        "Mandibular nerve lateralization",
                        "No implant planning",
                        "Block graft in every case",
                        "Transcrestal sinus elevation"
                    ],
                    "answer": 3,
                    "explanation": "With moderate residual height and a limited elevation requirement, a crestal or internal sinus-lift approach may be appropriate if primary stability is achievable. Reference: ITI Treatment Guide. Sinus Floor Elevation Procedures.",
                    "source": "SDLE bank"
                },
                {
                    "q": "An implant with recession is correctly positioned, stable, plaque-free, and surrounded by an intact facial plate, but the facial mucosa is thin. Which treatment is most appropriate when the patient requests improved tissue thickness?",
                    "options": [
                        "Implant removal",
                        "Connective-tissue grafting",
                        "Apically positioned flap",
                        "Occlusal reduction alone"
                    ],
                    "answer": 1,
                    "explanation": "When implant position and bone support are favorable, soft-tissue augmentation with a connective- tissue graft may increase thickness and improve recession coverage. Outcomes are less predictable when the fixture is severely facially malpositioned. Reference: Zucchelli G, Tavelli L, McGuire MK, et al. Autogenous soft tissue grafting for periodontal and peri-implant plastic surgical reconstruction. J Periodontol. 2020;91:9-16.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A failed implant is removed from a site with acute suppuration, extensive noncontained bone loss, and no possibility of primary stability. What is the preferred sequence?",
                    "options": [
                        "Place an implant immediately without debridement",
                        "Cement a crown into the defect",
                        "Observe the infection indefinitely",
                        "Debride and reconstruct the site before delayed reimplantation"
                    ],
                    "answer": 3,
                    "explanation": "Active infection, a large noncontained defect, and inability to achieve stability favor removal, thorough debridement, site reconstruction, healing, and later reassessment rather than immediate replacement. Reference: Misch CE. Contemporary Implant Dentistry. 4th ed. Implant failure, explantation, and site redevelopment.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A 4-mm-diameter implant is planned where ridge width is only 4 mm, while mesiodistal and vertical dimensions are adequate. Which dimension is compromised?",
                    "options": [
                        "Buccolingual width",
                        "Mesiodistal space",
                        "Vertical height",
                        "Interocclusal clearance"
                    ],
                    "answer": 0,
                    "explanation": "A ridge equal to implant diameter leaves no facial or lingual bone envelope, so augmentation or a different plan is needed. Reference: Buser D et al. 20 Years of Guided Bone Regeneration in Implant Dentistry. Three-dimensional implant positioning.",
                    "source": "SDLE bank"
                }
            ],
        },
        {
            id: "im-overdenture",
            title: "09 — Implant Overdentures",
            title_en: "Two implants · attachments · maintenance",
            summaryHtml: `
<h4 class="deck-topic">Mandible</h4>
<ul>
  <li><b>Two implants</b> between the mental foramina with an overdenture is the widely accepted minimum standard (McGill consensus).</li>
  <li>It improves retention, stability, comfort and function over a conventional lower denture.</li>
  <li>The prosthesis is still partly <b>tissue supported</b>, so the base must be properly extended and fit the ridge.</li>
</ul>
<h4 class="deck-topic">Maxilla</h4>
<ul>
  <li>Softer bone and different forces: more implants are generally planned, commonly at least four.</li>
</ul>
<h4 class="deck-topic">Attachments</h4>
<div class="deck-block deck-tbl">
  <table>
    <thead><tr><th>Type</th><th>Features</th></tr></thead>
    <tbody>
      <tr><td><b>Ball</b></td><td>Simple stud with a matching housing</td></tr>
      <tr><td><b>Locator type</b></td><td>Low-profile stud with replaceable colour-coded nylon inserts</td></tr>
      <tr><td><b>Bar</b></td><td>Splints implants and can give cross-arch support; needs more space and hygiene access</td></tr>
      <tr><td><b>Magnet</b></td><td>Easy to seat; lower retention and possible corrosion</td></tr>
    </tbody>
  </table>
</div>
<ul>
  <li>Choice depends on restorative space, implant angulation and spread, jaw form, dexterity, cost and maintenance.</li>
  <li><b>Divergent implants</b> strain stud inserts: expect difficult seating, early wear or deformation of the matrix and loss of retention.</li>
</ul>
<h4 class="deck-topic">Troubleshooting</h4>
<div class="sum-algo">
  <span class="sum-algo-title">Loose overdenture</span>
  <ol>
    <li>First check that each implant is stable and the tissue is healthy.</li>
    <li>Check attachments: loose abutment, worn insert, debonded housing.</li>
    <li>Check the base: rocking from ridge resorption.</li>
    <li>Check occlusion.</li>
  </ol>
</div>
<ul>
  <li><b>Debonded housing</b> with sound parts: seat it correctly on the attachment and <b>pick it up</b> again with enough resin support.</li>
  <li><b>Good attachments but rotating base</b>: <b>reline</b> after checking occlusion and the denture, keeping it seated on the tissues in the correct position.</li>
  <li><b>Mobile implant</b>: this takes priority; assess for lost osseointegration.</li>
</ul>
<h4 class="deck-topic">Maintenance</h4>
<ul>
  <li>Teach cleaning of abutments and bar, remove the denture overnight unless advised otherwise, and recall regularly to change inserts and check tissue.</li>
</ul>
<div class="sum-key">
  <span class="sum-key-title">نقاط امتحانية</span>
  <ul>
    <li>Edentulous mandible: <b>two-implant overdenture</b>.</li>
    <li>Low-profile nylon inserts: <b>Locator type</b>.</li>
    <li>Splinting attachment: <b>bar</b>.</li>
    <li>Base rotating with good attachments: reline.</li>
  </ul>
</div>
      `,
            questions: [
                {
                    "q": "What is the widely accepted minimum implant treatment for an edentulous mandible receiving an overdenture?",
                    "options": [
                        "Four implants are always mandatory",
                        "Two-implant overdenture",
                        "One implant is the universal standard",
                        "Six implants are required"
                    ],
                    "answer": 1,
                    "explanation": "The McGill consensus identified the two-implant mandibular overdenture as the minimum first-choice implant treatment for many edentulous patients. Reference: Feine JS et al. The McGill consensus statement. Int J Prosthodont. 2002;15:413-414.",
                    "source": "SDLE bank"
                },
                {
                    "q": "Which attachment has a low-profile stud with replaceable color-coded nylon inserts?",
                    "options": [
                        "Hader bar only",
                        "Magnet only",
                        "Telescope only",
                        "Locator-type attachment"
                    ],
                    "answer": 3,
                    "explanation": "Locator-type attachments use a low-profile abutment and replaceable polymer inserts offering different retention. A photograph without visible geometry cannot confirm the type. Reference: Misch CE. Dental Implant Prosthetics. 3rd ed. Stud attachments for overdentures.",
                    "source": "SDLE bank"
                },
                {
                    "q": "Which overdenture attachment splints multiple implants and can provide cross-arch support?",
                    "options": [
                        "Bar attachment",
                        "Isolated ball attachment",
                        "Healing abutment",
                        "Cover screw"
                    ],
                    "answer": 0,
                    "explanation": "A bar connects implants and can improve stability and control the path of insertion, but it requires restorative space, hygiene access, and passive fit. Reference: Misch CE. Dental Implant Prosthetics. 3rd ed. Bar-retained overdentures.",
                    "source": "SDLE bank"
                },
                {
                    "q": "An overdenture has adequate attachment retention but rotates because the distal tissue-bearing base no longer fits the ridge. What is the appropriate treatment?",
                    "options": [
                        "Replace the inserts only",
                        "Reline the base after verifying implant and occlusal conditions",
                        "Remove the bar",
                        "Shorten all borders"
                    ],
                    "answer": 1,
                    "explanation": "Tissue-supported rotation persists when the base loses adaptation even if attachments retain. A functional reline or rebase restores support after diagnosis. Reference: Misch CE. Dental Implant Prosthetics. 3rd ed. Maintenance of implant-retained overdentures.",
                    "source": "SDLE bank"
                },
                {
                    "q": "An implant overdenture is loose because a metal housing has debonded from the acrylic base. What is the appropriate management?",
                    "options": [
                        "Replace the implant",
                        "Ignore the housing",
                        "Reposition and pick up the housing with adequate resin support",
                        "Increase vertical dimension automatically"
                    ],
                    "answer": 2,
                    "explanation": "A loose housing is a prosthetic complication. It should be cleaned, correctly seated with blockout, reattached, and the base thickness and occlusion verified. Reference: Misch CE. Dental Implant Prosthetics. 3rd ed. Chairside pickup of overdenture attachments.",
                    "source": "SDLE bank"
                }
            ],
        },
    ],
};

export default dentalImplantDentistry;
