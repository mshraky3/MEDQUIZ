// Removable Prosthodontics — dental-track section of the summaries catalog.
// Mirrored for the slide viewer in backend/content/summaryHtml (keep the two in sync).
// Inline questions are copied from the SQB bank.
const dentalRemovableProsthodontics = {
    id: "removable-prosthodontics",
    title: "Removable Prosthodontics",
    title_en: "SDLE Review — 9 Topics",
    icon: "shield-check",
    accent: "#818cf8",
    intro: "Removable Prosthodontics — focused SDLE revision: Clasps & Direct Retainers · Kennedy Classification · Major & Minor Connectors · Surveying, Rests & Indirect Retention · Complete Denture Anatomy & Impressions · Jaw Relations & Phonetics · Retention & Post-insertion Complaints · Tooth Arrangement & Occlusion · Tissue Lesions, Immediate Dentures, Relines, Repairs & Overdentures.",
    subtopics: [
        {
            id: "rp-clasps",
            title: "01 — Clasps & Direct Retainers",
            title_en: "RPI · RPA · wrought wire · ring clasp",
            summaryHtml: `
<h4 class="deck-topic">What every clasp assembly must give</h4>
<ul>
  <li><b>Support</b> (rest), <b>retention</b> (retentive tip below the survey line), <b>stability</b> (rigid parts), <b>reciprocation</b>, <b>encirclement</b> of more than 180 degrees, and <b>passivity</b> when fully seated.</li>
  <li>Only the terminal part of the retentive arm enters the undercut. The reciprocal element is rigid, sits on or above the height of contour and braces the tooth while the retentive arm flexes.</li>
  <li>Flexibility rises with a longer, thinner, tapered arm. Round wrought wire flexes in all directions, more than a cast half-round arm.</li>
  <li>Usual undercut: about <b>0.01 inch</b> for a cast cobalt-chromium arm and about <b>0.02 inch</b> for wrought wire.</li>
</ul>
<h4 class="deck-topic">Choosing the design</h4>
<div class="deck-block deck-tbl">
  <table>
    <thead><tr><th>Clasp</th><th>Typical use</th></tr></thead>
    <tbody>
      <tr><td><b>Akers</b> (circumferential)</td><td>First choice on a tooth-supported (bounded) abutment with the undercut away from the edentulous space</td></tr>
      <tr><td><b>RPI</b></td><td>Distal extension: mesial <b>R</b>est, distal <b>P</b>roximal plate, <b>I</b>-bar. Releases under load and limits torque</td></tr>
      <tr><td><b>RPA</b></td><td>Distal extension when an I-bar cannot be used: mesial rest, proximal plate, Akers arm</td></tr>
      <tr><td><b>Combination</b></td><td>Wrought-wire retentive arm with cast rest and reciprocation; flexible, kinder to a terminal or weaker abutment</td></tr>
      <tr><td><b>Ring</b></td><td>Tilted molar, classically a mandibular molar with a mesiolingual undercut</td></tr>
      <tr><td><b>Embrasure</b></td><td>Dentate side with no edentulous space (for example unmodified Class II or III); needs enough tooth reduction for bulk</td></tr>
    </tbody>
  </table>
</div>
<h4 class="deck-topic">When to avoid an I-bar</h4>
<ul>
  <li>Severe <b>soft-tissue undercut</b> below the abutment.</li>
  <li><b>Shallow vestibule</b> or a high frenum crossing the path of the approach arm.</li>
  <li>The alternatives are an RPA assembly or a wrought-wire circumferential arm, depending on where the undercut is.</li>
</ul>
<h4 class="deck-topic">Problems</h4>
<ul>
  <li>A retentive arm that is not reciprocated while it passes over the height of contour pushes the tooth during every insertion and removal.</li>
  <li>An active (non-passive) clasp or a framework that is not fully seated causes tooth pain and mobility.</li>
</ul>
<div class="sum-key">
  <span class="sum-key-title">نقاط امتحانية</span>
  <ul>
    <li>Distal extension: think <b>stress release</b> (RPI, RPA or wrought wire).</li>
    <li>I-bar blocked by tissue undercut: move to <b>RPA</b> if a suprabulge design suits the tooth.</li>
    <li>Midbuccal 0.02 inch undercut with infrabulge unsuitable: <b>wrought-wire</b> retentive arm.</li>
    <li>Tilted lower molar with an inaccessible undercut: <b>ring clasp</b>.</li>
  </ul>
</div>
      `,
            questions: [
                {
                    "q": "An RPD abutment has a favorable 0.02-inch midbuccal undercut, and an infrabulge approach is unsuitable. Which retentive arm is most appropriate?",
                    "options": [
                        "Cast cobalt-chromium arm",
                        "Wrought-wire arm",
                        "Rigid reciprocal arm",
                        "Lingual plate"
                    ],
                    "answer": 1,
                    "explanation": "A round wrought-wire retentive arm is more flexible than a comparable cast arm and can engage a deeper 0.02-inch undercut with less torque. It is commonly incorporated into a combination clasp. Reference: Carr AB et al. McCracken's Removable Partial Prosthodontics. Wrought-wire and combination clasp design. Page",
                    "source": "SDLE bank"
                },
                {
                    "q": "An I-bar approach arm would cross a severe soft-tissue undercut. Which alternative distal-extension assembly is commonly used?",
                    "options": [
                        "Hairpin clasp with distal rest",
                        "Double Akers on one tooth",
                        "RPA assembly",
                        "No rest or guide plane"
                    ],
                    "answer": 2,
                    "explanation": "An RPA uses a mesial rest and proximal plate with a wrought or cast circumferential retentive arm when an I-bar is contraindicated, while preserving stress-release principles. Reference: Carr AB, Brown DT. McCracken's Removable Partial Prosthodontics. 13th ed. RPA clasp assembly.",
                    "source": "SDLE bank"
                },
                {
                    "q": "Which clasp is classically used to encircle a tilted mandibular molar and engage an undercut inaccessible to a conventional circumferential clasp?",
                    "options": [
                        "Embrasure clasp",
                        "Ring clasp",
                        "Hairpin clasp",
                        "I-bar clasp"
                    ],
                    "answer": 1,
                    "explanation": "A ring clasp nearly encircles a tilted molar to approach a favorable undercut from the appropriate direction. Adequate bracing and auxiliary support are required because of its long flexible arm. Reference: Carr AB et al. McCracken's Removable Partial Prosthodontics. Ring clasp indications and design. Page",
                    "source": "SDLE bank"
                },
                {
                    "q": "Which description defines a combination clasp in removable partial denture design?",
                    "options": [
                        "Cast retentive and reciprocal arms",
                        "Wrought-wire retentive arm with cast reciprocal components",
                        "Two I-bars on one abutment",
                        "Ring clasp without a rest"
                    ],
                    "answer": 1,
                    "explanation": "A combination clasp joins a flexible round wrought-wire retentive arm to cast framework components such as the rest, minor connector, and reciprocal arm or plate. Reference: Carr AB et al. McCracken's Removable Partial Prosthodontics. Combination clasp assembly. Page",
                    "source": "SDLE bank"
                },
                {
                    "q": "Which finding is an absolute local contraindication to use of an I-bar clasp because it blocks the gingival approach path?",
                    "options": [
                        "High esthetic demand",
                        "Favorable cervical tooth undercut",
                        "Adequate vestibular depth",
                        "Severe soft-tissue undercut"
                    ],
                    "answer": 3,
                    "explanation": "A severe tissue undercut can prevent a bar clasp from approaching the tooth without impinging on movable mucosa. Other contraindications include inadequate vestibular depth and an interfering frenum. Reference: Carr AB et al. McCracken's Removable Partial Prosthodontics. Bar clasp indications and contraindications. Page",
                    "source": "SDLE bank"
                }
            ],
        },
        {
            id: "rp-kennedy",
            title: "02 — Kennedy Classification",
            title_en: "Four classes · Applegate rules · modifications",
            summaryHtml: `
<h4 class="deck-topic">The four classes</h4>
<div class="deck-block deck-tbl">
  <table>
    <thead><tr><th>Class</th><th>Edentulous pattern</th><th>Support</th></tr></thead>
    <tbody>
      <tr><td><b>I</b></td><td>Bilateral areas posterior to the remaining natural teeth</td><td>Tooth and tissue</td></tr>
      <tr><td><b>II</b></td><td>Unilateral area posterior to the remaining teeth</td><td>Tooth and tissue</td></tr>
      <tr><td><b>III</b></td><td>Unilateral area with natural teeth both in front and behind</td><td>Mainly tooth</td></tr>
      <tr><td><b>IV</b></td><td>One bilateral area anterior to the remaining teeth, crossing the midline</td><td>Depends on span and length</td></tr>
    </tbody>
  </table>
</div>
<h4 class="deck-topic">Applegate rules</h4>
<ol>
  <li>Classify <b>after</b> any planned extractions.</li>
  <li>A missing third molar that will not be replaced is ignored.</li>
  <li>A third molar that is present and used as an abutment is counted.</li>
  <li>A missing second molar that will not be replaced is ignored.</li>
  <li>The <b>most posterior</b> edentulous area decides the class.</li>
  <li>Every other edentulous area is a <b>modification</b>.</li>
  <li>Count the number of extra areas, not how many teeth each one contains.</li>
  <li><b>Class IV has no modifications</b>; a more posterior space would change the class.</li>
</ol>
<h4 class="deck-topic">How to solve a stem</h4>
<div class="sum-algo">
  <span class="sum-algo-title">Four steps</span>
  <ol>
    <li>Remove teeth listed for extraction and ignore molars that will not be replaced.</li>
    <li>Draw the arch and mark each separate gap.</li>
    <li>Find the most posterior gap: free end on both sides is I, free end on one side is II, bounded is III.</li>
    <li>Add one modification number for each remaining gap.</li>
  </ol>
</div>
<ul>
  <li>Example: teeth 35 and 36 missing with 37 present gives a <b>Class III</b> space.</li>
  <li>Example: missing anterior teeth that do <b>not</b> cross the midline, with teeth on both sides, form a Class III space, not Class IV.</li>
</ul>
<h4 class="deck-topic">Why it matters for design</h4>
<ul>
  <li>Distal extensions (I and II) rotate around a fulcrum line, so they need broad base coverage, stress-releasing clasping and indirect retention.</li>
  <li>The ridge is far more compressible than the periodontal ligament, so the base must be well adapted to the ridge. The <b>altered-cast</b> impression is classically used for the mandibular Class I.</li>
  <li>Class III behaves much like a fixed support system; broad tissue support and indirect retainers are usually less critical.</li>
</ul>
<div class="sum-key">
  <span class="sum-key-title">نقاط امتحانية</span>
  <ul>
    <li>The most posterior space always decides the class.</li>
    <li>One anterior space crossing the midline with all posterior teeth present is <b>Class IV</b>.</li>
    <li>Third molars that are not replaced do not create a distal extension.</li>
    <li>Altered-cast technique: think <b>mandibular Class I</b>.</li>
  </ul>
</div>
      `,
            questions: [
                {
                    "q": "A patient lost teeth 12, 11, 21, and 22 in trauma. All posterior teeth remain, leaving one anterior edentulous area that crosses the midline. What is the Kennedy classification?",
                    "options": [
                        "Class IV",
                        "Class I",
                        "Class II",
                        "Class III"
                    ],
                    "answer": 0,
                    "explanation": "Kennedy Class IV is a single bilateral edentulous area located anterior to the remaining natural teeth and crossing the midline. It has no modification spaces by definition. Reference: Carr AB et al. McCracken's Removable Partial Prosthodontics. Kennedy classification. Page",
                    "source": "SDLE bank"
                },
                {
                    "q": "Teeth 35, 38, and 48 are absent, but neither third molar will be replaced. Tooth 35 forms a single bounded edentulous space. What is the Kennedy classification?",
                    "options": [
                        "Class I",
                        "Class II",
                        "Class III modification 2",
                        "Class III"
                    ],
                    "answer": 3,
                    "explanation": "Missing third molars not planned for replacement are ignored in Kennedy classification. The remaining tooth-bounded space at 35 is therefore a Class III arch without modification. Reference: Carr AB et al. McCracken's Removable Partial Prosthodontics. Applegate rules for Kennedy classification. Page",
                    "source": "SDLE bank"
                },
                {
                    "q": "A patient is missing teeth #35 and #36. According to Kennedy classification, what is the classification?",
                    "options": [
                        "Class I",
                        "Class II",
                        "Class III",
                        "Class IV"
                    ],
                    "answer": 2,
                    "explanation": "Missing 35 and 36 with teeth present on both sides is a bounded saddle, Kennedy Class III. Key takeaway: Class III is unilateral bounded.",
                    "source": "SDLE recall"
                },
                {
                    "q": "In which situation is the altered-cast impression technique classically most useful?",
                    "options": [
                        "Mandibular Kennedy Class I",
                        "Tooth-supported Class III",
                        "Single anterior Class IV",
                        "Bounded Class III modification"
                    ],
                    "answer": 0,
                    "explanation": "The altered cast records distal-extension tissue support under controlled loading while preserving the framework-tooth relationship; it is used for Class I and II distal extensions, especially mandibular cases. Reference: Carr AB et al. McCracken's Removable Partial Prosthodontics. Altered-cast technique. Page",
                    "source": "SDLE bank"
                }
            ],
        },
        {
            id: "rp-connectors",
            title: "03 — Major & Minor Connectors",
            title_en: "Lingual bar · lingual plate · palatal designs",
            summaryHtml: `
<h4 class="deck-topic">Rules for any major connector</h4>
<ul>
  <li>It must be <b>rigid</b> so that force is shared across the arch.</li>
  <li>It must not impinge on gingiva, movable tissue, tori or bony prominences; relieve where needed.</li>
  <li>Classic border clearance from gingival margins: about <b>6 mm</b> in the maxilla and <b>3 mm</b> in the mandible. If this is impossible, plate onto the teeth with proper rest support.</li>
</ul>
<h4 class="deck-topic">Mandibular choices</h4>
<div class="deck-block deck-tbl">
  <table>
    <thead><tr><th>Connector</th><th>Use when</th></tr></thead>
    <tbody>
      <tr><td><b>Lingual bar</b></td><td>Enough functional depth: about 7 to 8 mm from gingival margin to the active floor of the mouth. Simplest and most hygienic</td></tr>
      <tr><td><b>Lingual plate</b></td><td>Shallow floor of mouth, high lingual frenum, periodontally weak anteriors needing bracing, expected further tooth loss, or tori that cannot be removed</td></tr>
      <tr><td><b>Sublingual bar</b></td><td>Limited height where the sulcus form allows a bar placed more inferiorly and posteriorly</td></tr>
      <tr><td><b>Labial bar</b></td><td>Teeth or tissues so lingually inclined that no lingual connector can seat</td></tr>
      <tr><td><b>Swing-lock</b></td><td>Few, weak or poorly contoured teeth that cannot be clasped conventionally; needs good hygiene and an adequate labial vestibule</td></tr>
    </tbody>
  </table>
</div>
<ul>
  <li>A lingual plate needs positive rests at each end. With those rests it can contribute to indirect retention.</li>
  <li>It covers more tissue, so plaque control matters.</li>
</ul>
<h4 class="deck-topic">Maxillary choices</h4>
<ul>
  <li><b>Palatal strap</b>: short bounded spaces.</li>
  <li><b>Anteroposterior strap</b>: very rigid; useful around a palatal torus and with longer spans.</li>
  <li><b>Complete palatal plate</b>: long distal extensions or few remaining teeth that need maximum support.</li>
  <li><b>Horseshoe (U-shaped)</b>: used mainly when an inoperable torus or strong gag problem limits other designs; it is the least rigid.</li>
</ul>
<h4 class="deck-topic">Minor connectors and finish lines</h4>
<ul>
  <li>Join rests, clasps and denture bases to the major connector; they are rigid and usually cross the gingiva at a right angle with relief.</li>
  <li>Place them in embrasures where possible so the tongue notices less bulk.</li>
  <li>The junction of a denture-base minor connector with the major connector is a distinct <b>butt-type finish line</b>, so acrylic finishes flush without a thin weak edge.</li>
  <li>The distal-extension mandibular framework has a <b>tissue stop</b> to keep its position during packing.</li>
</ul>
<div class="sum-key">
  <span class="sum-key-title">نقاط امتحانية</span>
  <ul>
    <li>Only about 6 mm of lingual depth: choose a <b>lingual plate</b>, not a lingual bar.</li>
    <li>Mobile anteriors needing splinting: <b>lingual plate</b> with rests.</li>
    <li>Severely lingually inclined teeth: consider a labial or <b>swing-lock</b> design.</li>
    <li>Rigidity is the first requirement of a major connector.</li>
  </ul>
</div>
      `,
            questions: [
                {
                    "q": "A mandibular Kennedy Class I patient has mobile remaining anterior teeth. Which major connector can provide indirect retention and splinting?",
                    "options": [
                        "Lingual bar",
                        "Lingual plate",
                        "Labial bar",
                        "Acrylic mesh"
                    ],
                    "answer": 1,
                    "explanation": "Broad contact with the anterior teeth allows the lingual plate to provide bracing, splinting, and potential indirect retention in a distal-extension RPD. Reference: Carr AB et al. McCracken's Removable Partial Prosthodontics. Lingual plate functions. Page",
                    "source": "SDLE bank"
                },
                {
                    "q": "Only 6 mm separates the mandibular gingival margins from the functional floor of mouth. Which connector is preferred?",
                    "options": [
                        "Lingual bar",
                        "Labial bar",
                        "Lingual plate",
                        "Double lingual bar"
                    ],
                    "answer": 2,
                    "explanation": "Six millimeters is generally inadequate for both gingival clearance and a rigid lingual bar; a lingual plate is preferred when otherwise suitable. Reference: Carr AB et al. McCracken's Removable Partial Prosthodontics. Lingual plate indications. Page",
                    "source": "SDLE bank"
                },
                {
                    "q": "A mandibular arch retains only severely lingually inclined anterior teeth whose contours prevent conventional clasping, while the maxillary dentition is intact. Which RPD design can engage the remaining teeth from a labial approach?",
                    "options": [
                        "Swing-lock RPD",
                        "Conventional lingual-bar RPD",
                        "Immediate denture",
                        "Palatal plate RPD"
                    ],
                    "answer": 0,
                    "explanation": "A swing-lock design uses a hinged labial bar with multiple struts and may be indicated when unfavorable tooth inclination or distribution prevents conventional clasping. Esthetics, vestibular depth, periodontal health, dexterity, and hygiene must be suitable. Reference: Carr AB et al. McCracken's Removable Partial Prosthodontics. Swing-lock removable partial dentures. Page",
                    "source": "SDLE bank"
                },
                {
                    "q": "Why must an RPD major connector have adequate rigidity?",
                    "options": [
                        "To engage every tissue undercut",
                        "To replace all rests",
                        "To move independently on each side",
                        "To distribute forces across the arch without flexing"
                    ],
                    "answer": 3,
                    "explanation": "Rigidity allows support, bracing, and occlusal forces to be shared among selected teeth and tissues. A flexible connector concentrates stress and destabilizes components. Reference: Carr AB, Brown DT. McCracken's Removable Partial Prosthodontics. 13th ed. Major connector principles.",
                    "source": "SDLE bank"
                }
            ],
        },
        {
            id: "rp-survey-rests",
            title: "04 — Surveying, Rests & Indirect Retention",
            title_en: "Surveyor tools · rest seats · fulcrum line",
            summaryHtml: `
<h4 class="deck-topic">The dental surveyor</h4>
<ul>
  <li>Used to choose the <b>path of insertion</b>, mark the height of contour, locate and measure undercuts, find tooth and tissue interferences, and plan guide planes and esthetics.</li>
  <li><b>Analyzing rod</b>: tests parallelism. <b>Carbon marker</b>: draws the survey line. <b>Undercut gauge</b>: measures undercut depth (0.01, 0.02, 0.03 inch). <b>Wax knife</b>: trims blockout.</li>
  <li>Retention cannot be created reliably by tilting the cast; a useful undercut must also exist relative to the horizontal occlusal plane.</li>
</ul>
<h4 class="deck-topic">Order of mouth preparation on abutments</h4>
<div class="sum-algo">
  <span class="sum-algo-title">Usual sequence</span>
  <ol>
    <li>Guide planes.</li>
    <li>Adjust the height of contour and any needed retentive area.</li>
    <li>Rest seats last, then polish and make the final impression.</li>
  </ol>
</div>
<ul>
  <li>Preparing the rest seat first and the guide plane afterwards can remove the marginal ridge and leave a poor rest seat.</li>
  <li>When fixed restorations are also planned, design the RPD <b>first</b> so crowns carry the correct guide planes, contours and rest seats.</li>
</ul>
<h4 class="deck-topic">Occlusal rest seat</h4>
<ul>
  <li>Rounded triangle with its base at the marginal ridge; floor smooth and <b>spoon shaped</b>.</li>
  <li>About <b>1.5 mm</b> of metal thickness is needed over the lowered marginal ridge.</li>
  <li>The angle between the rest floor and the vertical minor connector is <b>less than 90 degrees</b>, directing force along the long axis.</li>
  <li>On a tilted molar an extended rest helps direct load along the axis.</li>
  <li>Anterior teeth: a <b>cingulum rest</b> (best on a maxillary canine) is preferred over an incisal rest for leverage and appearance.</li>
</ul>
<h4 class="deck-topic">Indirect retainer</h4>
<ul>
  <li>Resists movement of an extension base <b>away</b> from the tissues as it rotates about the fulcrum line.</li>
  <li>Placed as far from the extension base as practical, ideally on a line at right angles to the fulcrum line.</li>
  <li>It is usually a rest on a sound tooth; weak incisor inclines are poor sites.</li>
  <li>A simple bounded Class III space usually does not require one.</li>
</ul>
<h4 class="deck-topic">Faults</h4>
<ul>
  <li>Framework not seating, rest not down and a clasp binding high: the framework is not fully seated or is distorted; disclose and correct before adjusting occlusion.</li>
  <li>A broad, uneven survey line with a stable tilt suggests a worn or blunt marker.</li>
</ul>
<div class="sum-key">
  <span class="sum-key-title">نقاط امتحانية</span>
  <ul>
    <li>Undercut depth is measured with the <b>undercut gauge</b>.</li>
    <li>Guide planes come before rest seats.</li>
    <li>Rest to minor connector angle is acute.</li>
    <li>Indirect retention is mainly a distal-extension problem.</li>
  </ul>
</div>
      `,
            questions: [
                {
                    "q": "What are two principal uses of a dental surveyor when designing an RPD?",
                    "options": [
                        "Locate undercuts and determine path of insertion",
                        "Measure vertical dimension and centric relation",
                        "Record borders and posterior palatal seal",
                        "Select shade and tooth mould"
                    ],
                    "answer": 0,
                    "explanation": "Surveying identifies relative tooth and tissue contours, usable undercuts, guiding surfaces, and the most favorable path of placement and removal. Reference: Carr AB et al. McCracken's Removable Partial Prosthodontics. Surveying. Page",
                    "source": "SDLE bank"
                },
                {
                    "q": "Which dental-surveyor instrument measures the depth of a tooth undercut below the survey line?",
                    "options": [
                        "Analyzing rod",
                        "Carbon marker",
                        "Undercut gauge",
                        "Wax knife"
                    ],
                    "answer": 2,
                    "explanation": "Calibrated undercut gauges identify specified horizontal depths, commonly 0.01, 0.02, or 0.03 inch, below the height of contour. The analyzing rod evaluates contours and parallelism but does not quantify undercut depth. Reference: Carr AB et al. McCracken's Removable Partial Prosthodontics. Dental surveyor instruments. Page",
                    "source": "SDLE bank"
                },
                {
                    "q": "What minimum metal thickness should generally be available for a conventional cast occlusal rest at the marginal ridge?",
                    "options": [
                        "0.5 mm",
                        "1.0 mm",
                        "3.0 mm",
                        "1.5 mm"
                    ],
                    "answer": 3,
                    "explanation": "Approximately 1.5 mm of metal thickness is required at the marginal ridge to provide adequate strength without occlusal interference. The rest-seat preparation must create this space while preserving positive support form. Reference: Carr AB et al. McCracken's Removable Partial Prosthodontics. Occlusal rest-seat dimensions; conventional metal-rest design uses approximately 1.5 mm thickness.",
                    "source": "SDLE bank"
                },
                {
                    "q": "Teeth 35 and 36 are missing, creating a bounded tooth-supported Kennedy Class III space. Is an indirect retainer required solely for this edentulous area?",
                    "options": [
                        "Yes, on tooth 43",
                        "No indirect retainer is required",
                        "Yes, on tooth 33",
                        "Yes, on the contralateral molar"
                    ],
                    "answer": 1,
                    "explanation": "Indirect retention counters rotational lifting of distal-extension bases. A bounded tooth-supported Class III saddle lacks that tissueward fulcrum behavior and does not require an indirect retainer solely because of the space. Reference: Carr AB et al. McCracken's Removable Partial Prosthodontics. Indirect retention and Kennedy classification. Page",
                    "source": "SDLE bank"
                },
                {
                    "q": "A partially edentulous patient will receive both fixed restorations and an RPD. What should be completed before definitive fixed restorations are designed?",
                    "options": [
                        "RPD insertion",
                        "Definitive RPD design",
                        "Denture-base processing",
                        "Fixed treatment without surveying"
                    ],
                    "answer": 1,
                    "explanation": "The definitive RPD design and surveyed path of insertion must be established first so crowns and other fixed restorations can incorporate appropriate guide planes, rests, contours, and retentive undercuts. Reference: Carr AB et al. McCracken's Removable Partial Prosthodontics. Diagnosis and sequencing of fixed and removable treatment. Page",
                    "source": "SDLE bank"
                }
            ],
        },
        {
            id: "rp-impressions",
            title: "05 — Complete Denture Anatomy & Impressions",
            title_en: "Support areas · flanges · posterior palatal seal",
            summaryHtml: `
<h4 class="deck-topic">Support and relief</h4>
<ul>
  <li><b>Mandible</b>: the <b>buccal shelf</b> is the primary stress-bearing area. The retromolar pad helps support and border seal.</li>
  <li><b>Maxilla</b>: the residual ridge and the hard palate on both sides of the midline give support.</li>
  <li>Relieve when needed: incisive papilla, midpalatine raphe or torus, sharp mylohyoid ridge and a superficial mental foramen.</li>
  <li>Severe mandibular resorption can leave the mental foramen near the crest; pressure causes lower-lip numbness.</li>
</ul>
<h4 class="deck-topic">What shapes the borders</h4>
<div class="deck-block deck-tbl">
  <table>
    <thead><tr><th>Region</th><th>Main influence</th></tr></thead>
    <tbody>
      <tr><td>Anterior lingual</td><td>Genioglossus and lingual frenum</td></tr>
      <tr><td>Middle lingual (premolar and molar)</td><td>Mylohyoid</td></tr>
      <tr><td>Distolingual and retromylohyoid</td><td>Superior pharyngeal constrictor, with palatoglossus</td></tr>
      <tr><td>Distobuccal</td><td>Masseter pressing through the buccinator</td></tr>
      <tr><td>Maxillary posterolateral limit</td><td>Hamular (pterygomaxillary) notch</td></tr>
    </tbody>
  </table>
</div>
<ul>
  <li>The <b>pterygomandibular raphe</b> is a posterior landmark that can be recognised during both upper and lower impressions.</li>
  <li>The lower base should extend over the retromolar pad (generally two thirds or more) as function allows.</li>
</ul>
<h4 class="deck-topic">Impression steps</h4>
<ul>
  <li>Preliminary impression, then custom tray with borders kept about 2 mm short of the vestibule, then border moulding, then final wash.</li>
  <li><b>Low-fusing modelling compound</b> can be reheated and corrected section by section.</li>
  <li>Wash materials include zinc oxide eugenol paste, light-body elastomers and others, chosen to match tissues and undercuts.</li>
</ul>
<h4 class="deck-topic">Pressure philosophies</h4>
<ul>
  <li><b>Mucocompressive</b>: tissue recorded under load.</li>
  <li><b>Mucostatic</b>: minimal displacement; suited to a <b>flabby ridge</b> (often with a windowed tray).</li>
  <li><b>Selective pressure</b>: loads stress-bearing areas and relieves sensitive ones.</li>
  <li>Severely resorbed lower ridge with firm mucosa: an <b>admixed</b> compound technique is a classic choice.</li>
</ul>
<h4 class="deck-topic">Posterior palatal seal</h4>
<ul>
  <li>Soft compressible tissue near the junction of hard and soft palate, between the vibrating lines, extending toward the hamular notches.</li>
  <li>Find the notches with a <b>T-burnisher</b>; watch the vibrating line while the patient says "ah". The foveae palatinae are only a guide.</li>
  <li>It maintains border contact during function and compensates for resin processing shrinkage.</li>
</ul>
<div class="sum-key">
  <span class="sum-key-title">نقاط امتحانية</span>
  <ul>
    <li>Lower primary support: <b>buccal shelf</b>.</li>
    <li>Middle lingual flange: <b>mylohyoid</b>.</li>
    <li>Flabby tissue: record it with <b>minimal pressure</b>.</li>
    <li>Upper denture ends in the posterior vibrating-line region, including the hamular notches.</li>
  </ul>
</div>
      `,
            questions: [
                {
                    "q": "Which muscle is the principal determinant of the middle lingual flange in the mandibular premolar region?",
                    "options": [
                        "Mylohyoid",
                        "Buccinator",
                        "Masseter",
                        "Levator labii superioris"
                    ],
                    "answer": 0,
                    "explanation": "The middle lingual flange must accommodate the functional position of the mylohyoid and floor of the mouth. Overextension can lift the mandibular denture during tongue movement. Reference: Zarb GA, Hobkirk J, Eckert S, Jacob R. Prosthodontic Treatment for Edentulous Patients. 13th ed. Lingual flange anatomy.",
                    "source": "SDLE bank"
                },
                {
                    "q": "Which structure defines the posterolateral extent of a maxillary complete denture?",
                    "options": [
                        "Retromolar pad",
                        "Buccal shelf",
                        "Pear-shaped pad",
                        "Hamular notch"
                    ],
                    "answer": 3,
                    "explanation": "The maxillary posterior border extends through each hamular notch across the posterior palatal seal region. The retromolar pad is mandibular anatomy. Reference: Zarb GA, Hobkirk J, Eckert S, Jacob R. Prosthodontic Treatment for Edentulous Patients. 13th ed. Maxillary denture borders.",
                    "source": "SDLE bank"
                },
                {
                    "q": "Which impression technique is especially useful for a severely resorbed mandibular ridge covered by firm mucosa?",
                    "options": [
                        "Admix technique",
                        "Neutral-zone record only",
                        "Heavy compression only",
                        "Alginate wash only"
                    ],
                    "answer": 0,
                    "explanation": "The admix technique uses low-fusing compound and impression compound to record a highly resorbed mandibular foundation functionally; neutral-zone recording addresses tooth and polished-surface position. Reference: Zarb GA et al. Prosthodontic Treatment for Edentulous Patients. Resorbed mandibular ridge impressions. Page",
                    "source": "SDLE bank"
                },
                {
                    "q": "Which material is commonly used for border molding because it can be reheated and corrected segmentally?",
                    "options": [
                        "Zinc phosphate cement",
                        "Low-fusing modeling compound",
                        "Inlay wax as the final wash",
                        "Amalgam"
                    ],
                    "answer": 1,
                    "explanation": "Low-fusing compound can be softened, shaped by functional movement, cooled, evaluated, and corrected. Other elastomeric materials may also be used according to technique. Reference: Zarb GA, Hobkirk J, Eckert S, Jacob R. Prosthodontic Treatment for Edentulous Patients. 13th ed. Border molding materials.",
                    "source": "SDLE bank"
                },
                {
                    "q": "Which impression philosophy minimizes displacement of a flabby residual ridge?",
                    "options": [
                        "Mucostatic",
                        "Mucocompressive",
                        "Admix compression",
                        "Heavy-body only"
                    ],
                    "answer": 0,
                    "explanation": "A mucostatic or selective window technique records mobile tissue with minimal pressure to reduce distortion and rebound. Reference: Zarb GA et al. Prosthodontic Treatment for Edentulous Patients. Flabby-ridge impressions. Page",
                    "source": "SDLE bank"
                }
            ],
        },
        {
            id: "rp-jaw-relations",
            title: "06 — Jaw Relations & Phonetics",
            title_en: "VDO · freeway space · centric relation",
            summaryHtml: `
<h4 class="deck-topic">Vertical relations</h4>
<ul>
  <li><b>RVD</b>: face height with the mandible at rest. <b>OVD</b>: face height with the teeth or rims in contact.</li>
  <li><b>Interocclusal (freeway) space = RVD minus OVD</b>, commonly about 2 to 4 mm in the premolar region.</li>
  <li>No single method is exact. Combine measurements, appearance, swallowing, phonetics and old-denture assessment.</li>
</ul>
<div class="deck-cards">
  <div class="deck-card clin">
    <div class="deck-card-h">OVD too high</div>
    <ul>
      <li>Little or no freeway space</li>
      <li>Clicking teeth, strained lips</li>
      <li>Muscle fatigue and generalised sore ridges</li>
      <li>Difficulty swallowing and speaking, possible gagging</li>
    </ul>
  </div>
  <div class="deck-card diag">
    <div class="deck-card-h">OVD too low</div>
    <ul>
      <li>Excessive freeway space</li>
      <li>Aged look, shortened lower face</li>
      <li>Folds at mouth corners, angular cheilitis</li>
      <li>Prominent chin, reduced chewing force</li>
    </ul>
  </div>
</div>
<h4 class="deck-topic">Horizontal relation</h4>
<ul>
  <li><b>Centric relation</b> is a repeatable jaw position independent of tooth contact, so it is the reference for the edentulous patient.</li>
  <li>An interocclusal record must capture a <b>reproducible maxillomandibular relationship</b> without moving teeth or tipping the record bases.</li>
  <li>A <b>face-bow</b> transfers the relation of the maxilla to the hinge axis onto the articulator.</li>
  <li>In RPD cases, mount in maximum intercuspation when it is stable and acceptable; when there is no reliable tooth stop, use centric relation with rims on the framework or bases.</li>
  <li>Aluwax is often used to <b>refine</b> a record after controlled warming.</li>
</ul>
<h4 class="deck-topic">Phonetic checks</h4>
<ul>
  <li><b>F and V</b>: upper incisal edges touch the lower lip near the <b>wet-dry line</b>. If they fall well short, the teeth are too short or too far palatal.</li>
  <li><b>S</b>: shows the closest speaking space; the teeth come very close, about 1 to 1.5 mm, without touching. Clicking on S suggests too much height.</li>
  <li><b>M</b> and relaxed breathing help to locate the rest position.</li>
</ul>
<h4 class="deck-topic">Slide into position</h4>
<ul>
  <li>For a deflective contact producing a forward slide on closure, the classic rule is to adjust <b>mesial inclines of upper</b> and distal inclines of lower teeth.</li>
</ul>
<div class="sum-key">
  <span class="sum-key-title">نقاط امتحانية</span>
  <ul>
    <li>Freeway space is <b>rest height minus occlusal height</b>.</li>
    <li>Clicking and sore muscles point to excessive OVD.</li>
    <li>Wrinkled corners and short lower face point to reduced OVD.</li>
    <li>F sounds guide upper incisor length and labiolingual position.</li>
  </ul>
</div>
      `,
            questions: [
                {
                    "q": "How is freeway space calculated clinically for a complete-denture patient?",
                    "options": [
                        "RVD minus OVD",
                        "OVD minus RVD",
                        "OVD plus RVD",
                        "Facial height minus OVD"
                    ],
                    "answer": 0,
                    "explanation": "Freeway space is the difference between the vertical dimension at physiologic rest and the vertical dimension of occlusion. Both measurements should be repeated because rest position varies. Reference: Zarb GA et al. Prosthodontic Treatment for Edentulous Patients. Vertical dimension and interocclusal rest space. Page",
                    "source": "SDLE bank"
                },
                {
                    "q": "An old complete denture produces an aged appearance with reduced lower facial height and wrinkles at the mouth corners. Which vertical-dimension change is indicated in the new denture after verification?",
                    "options": [
                        "Increase freeway space",
                        "Maintain the reduced OVD",
                        "Eliminate tooth display",
                        "Decrease freeway space"
                    ],
                    "answer": 3,
                    "explanation": "These signs suggest loss of occlusal vertical dimension and excessive interocclusal rest space. Restoring an appropriate OVD decreases freeway space while supporting facial form, subject to phonetic and physiologic verification. Reference: Zarb GA et al. Prosthodontic Treatment for Edentulous Patients. Vertical dimension assessment. Page",
                    "source": "SDLE bank"
                },
                {
                    "q": "The maxillary incisors fail to approach the lower lip during “F” sounds. What is the likely error?",
                    "options": [
                        "Incisal edges are too long only",
                        "Posterior palatal seal is excessive",
                        "Incisal edges are too short or positioned too palatally",
                        "Retromolar pad coverage is excessive"
                    ],
                    "answer": 2,
                    "explanation": "Lack of normal labiodental contact suggests deficient length or an overly palatal position. Speech findings are interpreted with esthetics and lip support. Reference: Zarb GA, Hobkirk J, Eckert S, Jacob R. Prosthodontic Treatment for Edentulous Patients. 13th ed. Speech sounds in denture construction.",
                    "source": "SDLE bank"
                },
                {
                    "q": "What should an interocclusal record capture?",
                    "options": [
                        "A reproducible maxillomandibular relationship without tooth displacement",
                        "The facebow hinge axis by itself",
                        "The final denture border",
                        "The tissue undercut depth"
                    ],
                    "answer": 0,
                    "explanation": "An interocclusal record relates the arches in a chosen jaw position. It is distinct from a facebow transfer and should be stable, accurate, and as thin as practical. Reference: Zarb GA, Hobkirk J, Eckert S, Jacob R. Prosthodontic Treatment for Edentulous Patients. 13th ed. Jaw-relation records.",
                    "source": "SDLE bank"
                }
            ],
        },
        {
            id: "rp-retention-complaints",
            title: "07 — Retention & Post-insertion Complaints",
            title_en: "Retention · stability · sore spots",
            summaryHtml: `
<h4 class="deck-topic">Three words that are tested</h4>
<ul>
  <li><b>Retention</b>: resists movement away from the tissues.</li>
  <li><b>Stability</b>: resists horizontal and rotational movement.</li>
  <li><b>Support</b>: resists movement toward the tissues.</li>
</ul>
<h4 class="deck-topic">Sources of retention</h4>
<ul>
  <li><b>Adhesion</b>: attraction between unlike substances (saliva to base and to mucosa).</li>
  <li><b>Cohesion</b>: attraction within the saliva film.</li>
  <li>Interfacial surface tension, atmospheric pressure with an intact border seal, close adaptation, neuromuscular control and favourable undercuts.</li>
  <li>With a flat ridge and a technically sound denture, an adhesive may be offered; implants are the stronger option when suitable.</li>
  <li>Adhesive must not be used to hide a faulty denture.</li>
</ul>
<h4 class="deck-topic">Complaint to cause</h4>
<div class="deck-block deck-tbl">
  <table>
    <thead><tr><th>Complaint</th><th>Think of</th></tr></thead>
    <tbody>
      <tr><td>Loose at rest</td><td>Poor border seal, poor adaptation or overextension</td></tr>
      <tr><td>Moves only during chewing</td><td>Occlusal interference or unstable tooth position</td></tr>
      <tr><td>Drops when the lip is pulled or smiles</td><td>Frenum or flange not relieved</td></tr>
      <tr><td>Single ulcer under a flange</td><td>Overextension or sharp edge: disclose, relieve, polish, review</td></tr>
      <tr><td>Ulcer at lower labial frenum</td><td>Overextended flange in the frenal area</td></tr>
      <tr><td>Soreness over the whole ridge</td><td>Occlusal error or excessive OVD</td></tr>
      <tr><td>Pain on swallowing (lower)</td><td>Overextended distolingual flange</td></tr>
      <tr><td>Cheek biting</td><td>Too little posterior horizontal overlap</td></tr>
    </tbody>
  </table>
</div>
<h4 class="deck-topic">Follow-up facts</h4>
<ul>
  <li>A traumatic ulcer from a new denture usually shows within <b>1 to 2 days</b>, which is why an early review is booked.</li>
  <li>Immediate denture removed on the first night and impossible to reinsert: <b>post-extraction swelling</b>. Patients are usually told to keep it in until the first review.</li>
  <li>An acrylic denture stored dry can <b>change dimension</b> and stop seating well; store it moist.</li>
  <li>Dentures should be cleaned after meals and rested overnight once healing allows.</li>
</ul>
<div class="sum-algo">
  <span class="sum-algo-title">Adjustment order</span>
  <ol>
    <li>Examine the tissue and ask when the problem occurs.</li>
    <li>Check the fitting surface and borders with a disclosing medium.</li>
    <li>Check occlusion, ideally with a remount if errors are large.</li>
    <li>Adjust only the proven spot, then polish and review.</li>
  </ol>
</div>
<div class="sum-key">
  <span class="sum-key-title">نقاط امتحانية</span>
  <ul>
    <li>Horizontal resistance is <b>stability</b>.</li>
    <li>Loose at rest suggests borders and seal; loose in function suggests occlusion too.</li>
    <li>A localised ulcer needs local relief, not grinding of the whole base.</li>
    <li>First-morning failure to seat an immediate denture means swelling.</li>
  </ul>
</div>
      `,
            questions: [
                {
                    "q": "Which physical mechanism contributes to retention when a well-adapted complete denture base remains closely opposed to a saliva-coated mucosa?",
                    "options": [
                        "Polymerization shrinkage",
                        "Occlusal pivoting",
                        "Magnetic attraction",
                        "Adhesion"
                    ],
                    "answer": 3,
                    "explanation": "Adhesion is attraction between unlike molecules at the saliva-denture and saliva-mucosa interfaces. Cohesion and surface tension also contribute, but harmful suction chambers are not required. Reference: Zarb GA et al. Prosthodontic Treatment for Edentulous Patients. Physical factors in complete-denture retention. Page",
                    "source": "SDLE bank"
                },
                {
                    "q": "A pressure-related traumatic ulcer from a newly inserted complete denture most commonly becomes clinically evident within what interval?",
                    "options": [
                        "3–4 days",
                        "1–2 days",
                        "5–6 days",
                        "7–8 days"
                    ],
                    "answer": 1,
                    "explanation": "Localized pressure and border overextension commonly produce soreness or ulceration within the first 24–48 hours, which is why an early post-insertion review is important. The denture should be adjusted according to the identified pressure area. Reference: Zarb GA et al. Prosthodontic Treatment for Edentulous Patients. Post-insertion adjustment of complete dentures. Page",
                    "source": "SDLE bank"
                },
                {
                    "q": "A complete-denture patient develops a traumatic ulcer in the lower labial-frenum region. What is the most likely denture error?",
                    "options": [
                        "Underextended lingual flange",
                        "Inadequate posterior palatal seal",
                        "Overextended lower labial flange",
                        "Short maxillary buccal flange"
                    ],
                    "answer": 2,
                    "explanation": "An overextended or insufficiently relieved lower labial flange is displaced by frenum movement and traumatizes the adjacent mucosa. Pressure-indicator and functional border evaluation guide the required reduction. Reference: Zarb GA et al. Prosthodontic Treatment for Edentulous Patients. Post-insertion sore spots and border overextension. Page",
                    "source": "SDLE bank"
                },
                {
                    "q": "A patient removes an immediate complete denture during the first postoperative night and cannot reinsert it the next morning. What is the most likely cause?",
                    "options": [
                        "Postoperative swelling",
                        "Lack of frenum relief",
                        "Poor insertion skill",
                        "Balanced-occlusion error"
                    ],
                    "answer": 0,
                    "explanation": "Edema develops after extractions or alveoloplasty and can prevent reinsertion when an immediate denture is removed during the initial postoperative period. The patient should be reviewed promptly rather than force the denture into place. Reference: Zarb GA et al. Prosthodontic Treatment for Edentulous Patients. Immediate dentures and postoperative care. Page",
                    "source": "SDLE bank"
                },
                {
                    "q": "A complete denture stored dry overnight no longer seats fully the next morning. What is the likely cause?",
                    "options": [
                        "New bone formation overnight",
                        "Dimensional change from dehydration",
                        "Increased freeway space only",
                        "Immediate candidiasis"
                    ],
                    "answer": 1,
                    "explanation": "Acrylic dentures should generally be stored in water when out of the mouth unless a cleanser directs otherwise. Dehydration may cause dimensional change; persistent nonseating requires evaluation for distortion or tissue change. Reference: Anusavice KJ, Shen C, Rawls HR. Phillips' Science of Dental Materials. 12th ed. Water sorption and dimensional behavior of acrylic resin.",
                    "source": "SDLE bank"
                }
            ],
        },
        {
            id: "rp-occlusion",
            title: "08 — Tooth Arrangement & Occlusion",
            title_en: "Balanced · lingualized · monoplane · crossbite",
            summaryHtml: `
<h4 class="deck-topic">Goals for complete dentures</h4>
<ul>
  <li>Even bilateral contacts in centric relation at the chosen OVD.</li>
  <li>Teeth placed in the <b>neutral zone</b> and related to the ridge, so that load tends to seat the bases.</li>
  <li>Many designs aim for <b>bilateral balanced occlusion</b>: contacts on both sides in excursions to limit tipping.</li>
</ul>
<div class="deck-block deck-tbl">
  <table>
    <thead><tr><th>Scheme</th><th>Idea</th><th>Often chosen for</th></tr></thead>
    <tbody>
      <tr><td><b>Anatomic balanced</b></td><td>Cusped teeth with balancing contacts</td><td>Good ridges and repeatable jaw relation; better appearance</td></tr>
      <tr><td><b>Lingualized</b></td><td>Upper palatal cusps contact shallow lower teeth</td><td>Combines appearance with less lateral force</td></tr>
      <tr><td><b>Monoplane</b></td><td>Cuspless teeth</td><td>Severe resorption, poor neuromuscular control, uncertain jaw relation, some skeletal discrepancies</td></tr>
    </tbody>
  </table>
</div>
<p>More than one scheme can be defensible for a difficult ridge; read the stem for the deciding feature.</p>
<h4 class="deck-topic">Position rules</h4>
<ul>
  <li>If the lower posterior ridges lie <b>buccal</b> to the upper ridges on both sides, set a <b>bilateral posterior crossbite</b> instead of moving teeth far off the ridge.</li>
  <li>Do not set lower molars on the <b>steep rising slope</b> toward the retromolar pad. Biting there makes the lower denture slide forward and loads the tissue on the lingual side of the anterior ridge.</li>
  <li>Teeth set too far buccally or lingually disturb the tongue and cheeks and tip the base.</li>
  <li>Upper posterior teeth need enough buccal overlap to hold the cheek away.</li>
</ul>
<h4 class="deck-topic">Tooth material</h4>
<ul>
  <li><b>Acrylic teeth</b>: chemical bond to the base, easy to adjust, tougher against fracture, quieter; wear faster.</li>
  <li><b>Porcelain teeth</b>: wear resistant but brittle, noisy, need mechanical retention and can wear opposing enamel.</li>
</ul>
<h4 class="deck-topic">RPD occlusion</h4>
<ul>
  <li>When natural teeth guide the jaw, the RPD occlusion must agree with them without raising the bite.</li>
  <li>When an RPD opposes a complete denture, <b>bilateral balance</b> helps keep the complete denture stable.</li>
  <li>The shape and area of the denture base strongly affect how much force reaches ridge and abutments: broad coverage spreads load.</li>
  <li><b>Horizontal</b> forces are the most damaging to an abutment.</li>
</ul>
<div class="sum-key">
  <span class="sum-key-title">نقاط امتحانية</span>
  <ul>
    <li>Wide lower arch relative to upper: <b>crossbite set-up</b>.</li>
    <li>Cuspless teeth lower lateral stress and forgive jaw-relation error.</li>
    <li>Acrylic teeth bond better to the base than porcelain.</li>
    <li>Keep lower molars off the retromolar incline.</li>
  </ul>
</div>
      `,
            questions: [
                {
                    "q": "In an edentulous patient, both mandibular posterior ridges lie buccal to the maxillary ridges. How should the posterior teeth be arranged?",
                    "options": [
                        "Unilateral crossbite",
                        "Class I buccal overlap",
                        "Bilateral crossbite",
                        "Canine guidance only"
                    ],
                    "answer": 2,
                    "explanation": "Bilateral posterior crossbite positions teeth over the supporting ridges and limits destabilizing leverage when the mandibular ridge lies buccal to the maxillary ridge on both sides. Reference: Zarb GA et al. Prosthodontic Treatment for Edentulous Patients. Posterior tooth arrangement. Page",
                    "source": "SDLE bank"
                },
                {
                    "q": "Mandibular denture teeth are arranged on a slope extending to the retromolar pad. What is the most likely consequence?",
                    "options": [
                        "Improved denture retention",
                        "Improved chewing efficiency",
                        "Pressure on the lingual aspect of the anterior mandible",
                        "Reduced vertical dimension"
                    ],
                    "answer": 2,
                    "explanation": "Teeth placed too far back on the slope towards the retromolar pad direct force to the lingual anterior mandible, which can cause pressure and instability. It does not improve retention or chewing. Key takeaway: keep teeth on the flat area of the ridge.",
                    "source": "SDLE recall"
                },
                {
                    "q": "What is the advantage of using acrylic teeth instead of ceramic teeth in CD.",
                    "options": [
                        "Stain resistant",
                        "Wear resistance",
                        "Esthetic",
                        "Better Bond to the base"
                    ],
                    "answer": 3,
                    "explanation": "Acrylic teeth bond chemically to the acrylic denture base, while porcelain teeth are held mechanically. Stain resistance, wear resistance and esthetics favour ceramic. Key takeaway: acrylic teeth bond to the base.",
                    "source": "SDLE recall"
                },
                {
                    "q": "Which direction of force is generally most damaging to an RPD abutment tooth?",
                    "options": [
                        "Horizontal force",
                        "Axial force",
                        "Vertical force toward the ridge",
                        "Vertical force near the long axis"
                    ],
                    "answer": 0,
                    "explanation": "Periodontal support tolerates forces directed along the tooth's long axis better than lateral or torquing forces. RPD design aims to minimize horizontal leverage on abutments through support, bracing, reciprocation, and stress control. Reference: Carr AB et al. McCracken's Removable Partial Prosthodontics. Biomechanics and control of forces on abutments. Page",
                    "source": "SDLE bank"
                }
            ],
        },
        {
            id: "rp-tissue-repair",
            title: "09 — Tissue Lesions, Relines, Repairs & Overdentures",
            title_en: "Stomatitis · epulis · immediate denture · overdenture",
            summaryHtml: `
<h4 class="deck-topic">Denture-related tissue changes</h4>
<div class="deck-cards">
  <div class="deck-card diag">
    <div class="deck-card-h">Denture stomatitis</div>
    <p>Redness under the base, often painless. Linked to Candida, continuous wear, poor hygiene and trauma. Remove at night, clean the denture, correct fit and use antifungals when indicated.</p>
  </div>
  <div class="deck-card clin">
    <div class="deck-card-h">Papillary hyperplasia</div>
    <p>Many small red nodules on the central hard palate. Improve hygiene, rest tissue and treat infection; persistent tissue may need surgery.</p>
  </div>
  <div class="deck-card mgmt">
    <div class="deck-card-h">Epulis fissuratum</div>
    <p>Folds of fibrous tissue beside an overextended unstable flange. Shorten the flange and rest or condition the tissue; remove persistent fibrous folds surgically before the new denture.</p>
  </div>
</div>
<ul>
  <li>A <b>tissue conditioner</b> is temporary: it helps inflamed tissue under an ill-fitting base recover before definitive work.</li>
  <li><b>Combination (Kelly) syndrome</b>: upper complete denture against lower anterior natural teeth with a distal-extension RPD. Look for anterior maxillary bone loss, enlarged tuberosities, palatal hyperplasia, extruded lower anteriors and posterior mandibular resorption.</li>
</ul>
<h4 class="deck-topic">Immediate dentures</h4>
<ul>
  <li>Inserted on the day of extraction: keeps appearance and function and protects the wound.</li>
  <li>Bone and soft tissue remodel, so soft liners and later a <b>definitive reline</b> or a new denture are expected after healing.</li>
</ul>
<h4 class="deck-topic">Reline, rebase or remake</h4>
<ul>
  <li><b>Reline</b>: new fitting surface when adaptation is poor but tooth position, occlusion, OVD and appearance are acceptable. A laboratory reline is the usual long-term choice.</li>
  <li><b>Rebase</b>: replaces most or all of the base and keeps the teeth.</li>
  <li><b>Remake</b>: when occlusion, OVD, teeth or design are unacceptable.</li>
</ul>
<h4 class="deck-topic">Conservative RPD repairs</h4>
<ul>
  <li>Broken cast retentive arm or I-bar on a sound framework: a <b>wrought-wire</b> arm embedded in the base is a common repair.</li>
  <li>Additional lost tooth on a serviceable acrylic RPD: add the tooth, with a wrought-wire clasp if more retention is needed.</li>
</ul>
<h4 class="deck-topic">Overdentures</h4>
<ul>
  <li>Retained roots keep bone and some <b>proprioception</b> and improve support. Their weak point is <b>caries and periodontal disease</b>, so fluoride and hygiene are essential.</li>
  <li>For the edentulous mandible, a <b>two-implant overdenture</b> is widely recommended (McGill consensus) where the patient is suitable.</li>
  <li>Attachments include ball, stud (Locator type) and bar; choice depends on space, implant angulation and maintenance. In a precision attachment, <b>patrix</b> is the male part and <b>matrix</b> the female.</li>
</ul>
<div class="sum-key">
  <span class="sum-key-title">نقاط امتحانية</span>
  <ul>
    <li>Folds at an overextended flange: <b>epulis fissuratum</b>.</li>
    <li>Healed immediate denture, good occlusion, poor fit: <b>reline</b>.</li>
    <li>Heal abnormal tissue before the final impression.</li>
    <li>Patrix is the male component.</li>
  </ul>
</div>
      `,
            questions: [
                {
                    "q": "Hyperplastic folds occur in the vestibule beside an overextended, unstable denture flange. What is the diagnosis?",
                    "options": [
                        "Denture stomatitis",
                        "Median rhomboid glossitis",
                        "Leukoplakia",
                        "Epulis fissuratum"
                    ],
                    "answer": 3,
                    "explanation": "Chronic flange irritation can produce redundant fibrous folds called epulis fissuratum. Small early lesions may improve after correction; established fibrous tissue often requires excision and prosthesis revision. Reference: Glick M, ed. Burket's Oral Medicine. 13th ed. Reactive hyperplasia associated with dentures.",
                    "source": "SDLE bank"
                },
                {
                    "q": "An edentulous patient has multiple pinpoint erythematous papillary elevations on the central hard palate under a long-worn denture. What is the most likely diagnosis?",
                    "options": [
                        "Traumatic fibroma",
                        "Inflammatory papillary hyperplasia",
                        "Torus palatinus",
                        "Necrotizing sialometaplasia"
                    ],
                    "answer": 1,
                    "explanation": "A pebbly or papillary palatal surface beneath a chronically worn denture is characteristic of inflammatory papillary hyperplasia, often with Candida and continuous wear. Reference: Glick M, ed. Burket's Oral Medicine. 13th ed. Reactive lesions associated with dentures.",
                    "source": "SDLE bank"
                },
                {
                    "q": "Which condition is an appropriate indication for temporary use of a tissue conditioner?",
                    "options": [
                        "Stable healthy mucosa and ideal fit",
                        "Inflamed mucosa beneath an ill-fitting denture",
                        "Definitive framework fracture repair",
                        "Increasing cusp height"
                    ],
                    "answer": 1,
                    "explanation": "A resilient conditioner redistributes load while traumatized tissues recover before definitive impressions or reline/remake. Reference: Zarb GA et al. Prosthodontic Treatment for Edentulous Patients. Tissue conditioners. Page",
                    "source": "SDLE bank"
                },
                {
                    "q": "An immediate complete denture has poor retention 6–7 months after extraction healing, while tooth position and occlusion remain acceptable. What is the most appropriate treatment?",
                    "options": [
                        "Increase vertical dimension",
                        "Add denture adhesive permanently",
                        "Replace all teeth only",
                        "Laboratory reline"
                    ],
                    "answer": 3,
                    "explanation": "Residual-ridge remodeling after extraction commonly creates loss of adaptation. Once healing has stabilized, a definitive laboratory reline can refit a satisfactory denture base; severe design or occlusal defects may instead require remake. Reference: Zarb GA et al. Prosthodontic Treatment for Edentulous Patients. Immediate-denture maintenance and relining. Page",
                    "source": "SDLE bank"
                },
                {
                    "q": "A retentive clasp arm fractures from an otherwise serviceable RPD while the reciprocal component remains intact. What is the most conservative repair?",
                    "options": [
                        "Add a wrought-wire arm",
                        "Recast the complete framework",
                        "Remove the reciprocal arm",
                        "Fabricate a new denture immediately"
                    ],
                    "answer": 0,
                    "explanation": "A new wrought-wire retentive arm can often be attached to or incorporated into a repair of the existing framework. The abutment undercut, clasp design, metal fatigue, and cause of fracture must be corrected. Reference: Carr AB et al. McCracken's Removable Partial Prosthodontics. Repair of fractured clasp arms. Page",
                    "source": "SDLE bank"
                }
            ],
        },
    ],
};

export default dentalRemovableProsthodontics;
