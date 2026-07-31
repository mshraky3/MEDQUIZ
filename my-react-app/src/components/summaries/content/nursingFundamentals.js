// Fundamentals of Nursing — nursing-track section of the summaries catalog.
//
// Mirror of backend/content/summaryHtml/nursingFundamentals.js (the gated slide viewer's
// copy): same authored prose, split into the guided path's subtopics. Keep the
// two in sync when the content changes.
//
// Questions are real recalls from the SNLE bank (questions.track = 'nursing'),
// matched to the subtopic they belong to. The full bank is reachable from the
// quiz engine; these are the handful shown inline while reading.
const nursingFundamentals = {
    id: "nursing-fundamentals",
    title: "Fundamentals of Nursing",
    title_en: "SNLE Review — 14 Topics",
    icon: "shield-check",
    accent: "#38bdf8",
    intro: "Fundamentals of Nursing — SNLE revision built from the Saudi nursing licence recall banks: Nursing Process & Priority Setting · Vital Signs & Baseline Values · Documentation & Incident Reports · Ethics, Law & Informed Consent · Delegation & Scope of Practice · Leadership, Management & Change · Infection Control & Precautions · Community Health Nursing & Prevention · Patient Safety, Falls & Restraints · Positioning — high-yield table · Oxygen Delivery · IV Therapy, Fluids & Transfusion · Pressure Injuries & Wound Care · Quality, Evaluation & Nursing Research.",
    subtopics: [
        {
            id: "nf-process",
            title: "01 — Nursing Process & Priority Setting",
            title_en: "ADPIE · Which answer is the \"priority\"?",
            summaryHtml: `
<h4 class="deck-topic">ADPIE</h4>
    <ul>
      <li><b>A</b>ssess (collect + verify data) → <b>D</b>iagnose (NANDA nursing diagnosis) → <b>P</b>lan (SMART goals) → <b>I</b>mplement → <b>E</b>valuate</li>
      <li><b>Assessment is always the first step</b> — unless the patient is unstable/ABC is threatened, then act</li>
      <li>Evaluation compares the actual outcome against the goal; it is a <b>continuous feedback</b> process, not a one-off</li>
      <li><b>Subjective</b> = what the patient <i>says</i> (pain, nausea, history). <b>Objective</b> = what you can measure/observe (VS, bleeding, vomiting)</li>
    </ul>
    <h4 class="deck-topic">Which answer is the "priority"?</h4>
    <div class="sum-algo">
      <span class="sum-algo-title">Priority algorithm</span>
      <ol>
        <li><b>ABC</b> — Airway, then Breathing, then Circulation</li>
        <li><b>Maslow</b> — physiological needs before safety, love, esteem, self-actualisation</li>
        <li><b>Actual</b> problem before a <b>risk for</b> problem</li>
        <li><b>Unstable / unexpected</b> patient before the stable, expected one</li>
        <li>Least invasive, reversible action first (reposition before intubate)</li>
      </ol>
    </div>
    <ul>
      <li>Trigger words for a priority question: <i>first, initial, most important, immediate, best</i></li>
      <li><b>Pain is not the priority</b> over an airway or circulation problem — pain rarely kills</li>
      <li>Maslow physiological = oxygen, fluid, nutrition, elimination, shelter, rest</li>
    </ul>
    <div class="sum-key">
      <span class="sum-key-title">نقاط امتحانية</span>
      <ul>
        <li>Post-operative assessment sequence follows ABC: <b>Respiration → Cardiovascular → Neurological → Surgical site</b>.</li>
        <li>If the stem gives you an abnormal finding and asks "what first" — <b>assess/verify</b> before you notify or document, unless the airway is at risk.</li>
        <li>"Risk for" diagnoses never outrank an actual physiological problem.</li>
      </ul>
    </div>
            `,
            questions: [
                {
                    q: "Nursing diagnosis done and the nurse set priorities for all NANDA. Which step in nursing process the nurse doing??",
                    options: ["Planning","Diagnosis","Evaluation","Implementation"],
                    answer: 0,
                    source: 'SNLE recall',
                },
                {
                    q: "What is the priority patient for triage nurse to assess?",
                    options: ["Patient with Sever chest pain","Patient with Sever bleeding"],
                    answer: 1,
                    source: 'SNLE recall',
                },
                {
                    q: "Patient in triage area. What is the first subjective data should triage nurse Obtain?",
                    options: ["Chief compliance","Level of pain","Family history"],
                    answer: 0,
                    source: 'SNLE recall',
                },
                {
                    q: "According to Maslow's hierarchy of needs, which nursing diagnosis has the lowest priority for a client admitted to the intensive care unit with a diagnosis of congestive heart failure?",
                    options: ["Impaired urinary elimination","Ineffective airway clearance","Ineffective coping","Risk for body image disturbance"],
                    answer: 3,
                    source: 'SNLE recall',
                },
                {
                    q: "What is the function of Maslow hierarchy for nursing??",
                    options: ["Set priority","Helping establish nursing diagnosis NANDA"],
                    answer: 0,
                    source: 'SNLE recall',
                },
            ],
        },
        {
            id: "nf-vitals",
            title: "02 — Vital Signs & Baseline Values",
            title_en: "Vital Signs & Baseline Values",
            summaryHtml: `
<table>
      <thead><tr><th>Sign</th><th>Adult normal</th><th>Abnormal terms</th></tr></thead>
      <tbody>
        <tr><td>Blood pressure</td><td>120/80 mmHg</td><td>Hypotension / Hypertension</td></tr>
        <tr><td>Heart rate</td><td>60–100 bpm</td><td>Bradycardia &lt;60 · Tachycardia &gt;100</td></tr>
        <tr><td>Respiratory rate</td><td>12–20 /min</td><td>Bradypnoea &lt;12 · Tachypnoea &gt;20</td></tr>
        <tr><td>Temperature</td><td>36.5–37.2 °C</td><td>Hypothermia &lt;35 °C · Hyperthermia &gt;40 °C</td></tr>
        <tr><td>SpO₂</td><td>95–100%</td><td>COPD target may be as low as <b>88%</b></td></tr>
        <tr><td>MAP</td><td>70–100 mmHg</td><td>&lt;65 = organ hypoperfusion</td></tr>
      </tbody>
    </table>
    <ul>
      <li><b>Blood pressure</b> = force of blood against the arterial wall</li>
      <li><b>Pulse deficit</b> = difference between the apical and the peripheral (radial) pulse</li>
      <li><b>Orthostatic (postural) hypotension</b>: on standing, systolic falls <b>&gt;20 mmHg</b> or diastolic <b>&gt;10 mmHg</b> — measure lying, then sitting, then standing</li>
      <li>Apical pulse is counted for a <b>full minute</b> before digoxin and in infants/irregular rhythms</li>
      <li>Do not take BP in an arm with an AV fistula, a post-mastectomy/lymph-node-dissection side, an IV line, or a paralysed limb — use the opposite arm</li>
    </ul>
    <div class="sum-key">
      <span class="sum-key-title">نقاط امتحانية</span>
      <ul>
        <li>Post right mastectomy → take BP in the <b>left</b> arm.</li>
        <li>A cuff that is too narrow gives a <b>falsely high</b> reading; too wide gives a falsely low one.</li>
      </ul>
    </div>
            `,
            questions: [
                {
                    q: "Patient came to a scheduled appointment for follow up when the nurse checks the vital signs BP: 130/92 RR: 18 HR: 86T: 37Which of the vital signs is abnormal?",
                    options: ["Temperature","Heart rate","Respiratory rate","Blood pressure"],
                    answer: 3,
                    source: 'SNLE recall',
                },
                {
                    q: "Patient is complaining from hypostatic hypotension Before that, his blood pressure was 110/70, the pulse was 76 b/m What is the expected vital signs?",
                    options: ["BP 90/60 HR 69","BP 88/60 HR 100"],
                    answer: 1,
                    source: 'SNLE recall',
                },
                {
                    q: "Orthostatic hypotension",
                    options: ["80/60","90/70","110/75"],
                    answer: 0,
                    source: 'SNLE recall',
                },
                {
                    q: "Patient came to ER after motor accident. The patient has sever bleeding with urine output 30 ml /hr and normal vital signs Normal Bl. P, normal HR, Normal respiration). The doctor ask the nurse to assess good tissue perfusion. Which of the following signs detect that?",
                    options: ["heart rate","Respiration rate","Urine output","Blood pressure"],
                    answer: 2,
                    source: 'SNLE recall',
                },
                {
                    q: "A nurse wants to delegate a post op patient from major surgery to assistant nurse, what task she will delegate?",
                    options: ["ambulate the patient","obtain vital signs","check patency of NGT"],
                    answer: 0,
                    source: 'SNLE recall',
                },
            ],
        },
        {
            id: "nf-doc",
            title: "03 — Documentation & Incident Reports",
            title_en: "Documentation & Incident Reports",
            summaryHtml: `
<ul>
      <li>Document <b>factually, objectively, promptly</b> and in ink; never chart in advance and never chart for someone else</li>
      <li>Correcting an error: <b>draw a single line through it</b>, write "error", initial and date, then write the correct entry — <b>never erase, scribble out or use correction fluid</b></li>
      <li><b>Incident / OVR report</b> (fall, medication error, needle-stick, broken equipment): completed for risk-management purposes, in clear legible handwriting</li>
      <li>The incident report is <b>NOT part of the medical record</b> and you do <b>not</b> chart "an incident report was filed" in the patient notes — you chart only the objective facts and the patient's condition</li>
      <li><b>SBAR</b> (Situation, Background, Assessment, Recommendation) is the standard hand-off/communication tool</li>
      <li>Only accept verbal/telephone orders in an emergency: write it down, <b>read it back</b>, and have it signed within the facility's time limit</li>
    </ul>
    <div class="sum-key">
      <span class="sum-key-title">نقاط امتحانية</span>
      <ul>
        <li>Patient found on the floor beside the bed → assess the patient, then document the objective findings in the notes <b>and</b> complete an <b>incident report</b>.</li>
        <li>Broken infusion pump → <b>tag/label it and report it</b>; remove it from service. Do not simply return it to the store area.</li>
        <li>Faulty equipment involved in an injury must be kept for investigation, not repaired or discarded.</li>
      </ul>
    </div>
            `,
            questions: [
                {
                    q: "The nurse found the Patient fell down on the floor beside the bed. Where should the nurse documentation the action?",
                    options: ["Care plan","Kardex","Incident report","Patient file"],
                    answer: 2,
                    source: 'SNLE recall',
                },
                {
                    q: "Patient fell down on the floor. The patient found by nurse Assistant, What should the nurse do ?",
                    options: ["file incident report","Document in file and have assistant do an incident report","Document in patient file and do incident report"],
                    answer: 2,
                    source: 'SNLE recall',
                },
                {
                    q: "first thing for nurse after needle stick injury will do",
                    options: ["squeeze her finger","write incident report"],
                    answer: 1,
                    source: 'SNLE recall',
                },
                {
                    q: "Patient fall and has injury ... what should nurse do to decrease liability to fall?",
                    options: ["Just inform the coming nurse","Write incident report","Document what happened ... inform...and follow up patient"],
                    answer: 2,
                    source: 'SNLE recall',
                },
                {
                    q: "The nurse found the patient fell down on the floor. After she helped the patient to get the bed. Do assessment and the patient is good. What is the next first action?",
                    options: ["Write incident report","Set bed alarm","Call the Witness client tobe side the patient","Inform the manager"],
                    answer: 1,
                    source: 'SNLE recall',
                },
            ],
        },
        {
            id: "nf-ethics",
            title: "04 — Ethics, Law & Informed Consent",
            title_en: "Informed consent · Legal terms",
            summaryHtml: `
<table>
      <thead><tr><th>Principle</th><th>Meaning</th></tr></thead>
      <tbody>
        <tr><td>Autonomy</td><td>The patient's right to decide for themselves (including refusing treatment)</td></tr>
        <tr><td>Beneficence</td><td>Actively doing good for the patient</td></tr>
        <tr><td>Non-maleficence</td><td>Do no harm</td></tr>
        <tr><td>Justice</td><td>Fair, equal treatment and distribution of resources</td></tr>
        <tr><td>Veracity</td><td>Truthfulness / honesty</td></tr>
        <tr><td>Fidelity</td><td>Keeping promises, loyalty to the patient</td></tr>
        <tr><td>Accountability</td><td>Taking responsibility for your own actions and errors</td></tr>
      </tbody>
    </table>
    <h4 class="deck-topic">Informed consent</h4>
    <ul>
      <li>The <b>physician/surgeon</b> explains the procedure, benefits, risks, alternatives and answers questions. The <b>nurse witnesses the signature</b> and verifies it was voluntary and that the patient understands</li>
      <li>The nurse may <b>clarify</b> what the surgeon said but may <b>not add new information</b></li>
      <li>If the patient says "I don't really know what they are going to do" → <b>stop and notify the surgeon</b>; do not let them sign</li>
      <li>Consent is invalid if the patient is sedated, intoxicated, or cognitively impaired</li>
      <li>Not required for a true life-saving emergency (implied consent)</li>
      <li>Minors: parent/legal guardian consents — except for emancipated minors and, in many settings, care of STI/pregnancy</li>
      <li>If the surgeon operates on a site <b>not</b> covered by the consent form → that is <b>battery</b>; report through the chain of command and file an incident report</li>
    </ul>
    <h4 class="deck-topic">Legal terms</h4>
    <ul>
      <li><b>Negligence</b> = failure to act as a reasonably prudent nurse would. <b>Malpractice</b> = professional negligence</li>
      <li><b>Assault</b> = threat; <b>battery</b> = actual unconsented touching; <b>false imprisonment</b> = restraining without order/consent</li>
      <li><b>Confidentiality</b>: discuss the patient only with the team involved in their care; never in corridors, lifts or on social media</li>
      <li><b>Advance directives</b>: living will (the patient's own written wishes) and durable power of attorney (a named proxy decides)</li>
    </ul>
    <div class="sum-key">
      <span class="sum-key-title">نقاط امتحانية</span>
      <ul>
        <li>Accessing the record of a patient you are <b>not</b> caring for is a breach of confidentiality even if you tell nobody.</li>
        <li>A competent adult may refuse treatment (autonomy) even when refusal is harmful — document and notify the provider.</li>
        <li>Veracity is the principle behind telling a patient the truth about their diagnosis when they ask.</li>
      </ul>
    </div>
            `,
            questions: [
                {
                    q: "While the nurse checking patient file to transefer him to operation room. She found that the doctor didn't get the patient's signature in informed consent. What is this consider?",
                    options: ["Negligence","Malpractice"],
                    answer: 0,
                    source: 'SNLE recall',
                },
                {
                    q: "During operation procedure for patient with inguinal hernia. The doctor explored another site for hernia not included in the informed consent. What is the most appropriate action?",
                    options: ["Do the extra operation then get consent later after patient aware","Wait for procedure until patient signed another consent","Call for client's medical power attorney to provide additional informed consent For additional procedure","Additional informed consent and document in patient care"],
                    answer: 2,
                    source: 'SNLE recall',
                },
                {
                    q: "Nurse administer medication to wrong patient , she wrote incident report .Which one is the appropriate?",
                    options: ["Put the incident report in patient file","Give a copy to physician","Document entery in patient file the concern of incident","Give incident to patient family"],
                    answer: 2,
                    source: 'SNLE recall',
                },
                {
                    q: "A patient fell in bathroom and his left leg was fractured, in order to communicate information about the patient to next shift.Which of the following documentation should be used by the nurse at the end of the shift?",
                    options: ["Kardex record","Assignment record","Shift report","Incident report"],
                    answer: 0,
                    source: 'SNLE recall',
                },
                {
                    q: "Bioeffects report claims that obstetrical scanning may be harmful to a particular group of patients. What should be the response of the medical community?",
                    options: ["Perform the exams on all patients when the risks outweigh the benefits","Stop all diagnostic exams","Ignore the report","Perform exams on all patients when the benefits outweigh the risks"],
                    answer: 3,
                    source: 'SNLE recall',
                },
            ],
        },
        {
            id: "nf-delegation",
            title: "05 — Delegation & Scope of Practice",
            title_en: "Delegation & Scope of Practice",
            summaryHtml: `
<div class="sum-algo">
      <span class="sum-algo-title">The 5 rights of delegation</span>
      <ol>
        <li>Right <b>task</b></li>
        <li>Right <b>circumstance</b> (stable, predictable patient)</li>
        <li>Right <b>person</b></li>
        <li>Right <b>direction / communication</b></li>
        <li>Right <b>supervision / evaluation</b></li>
      </ol>
    </div>
    <ul>
      <li><b>Never delegate</b> the nursing process itself: assessment, nursing diagnosis, planning, evaluation, teaching, or the care of an <b>unstable</b> patient</li>
      <li><b>UAP / assistant nurse</b> may do: bathing, feeding a patient without swallowing problems, ambulating, positioning, vital signs on a <b>stable</b> patient, intake/output, weights, specimen collection</li>
      <li><b>LPN/LVN</b> may additionally: give most oral/IM medications, dressing changes, tube feeds, suctioning, reinforce teaching — but not the initial assessment or IV push in most settings</li>
      <li>Delegating does <b>not</b> transfer accountability — the RN remains accountable for supervision and outcome</li>
      <li><b>Float nurse</b> should be given the <b>most stable, least complex</b> patients within their competence</li>
    </ul>
    <div class="sum-key">
      <span class="sum-key-title">نقاط امتحانية</span>
      <ul>
        <li>Post-op major surgery patient → do <b>not</b> delegate the assessment; delegate only comfort/hygiene tasks.</li>
        <li>When a physician insists on a dose that exceeds the recommended range → <b>call/clarify with the physician first</b>; if he insists, <b>hold the dose and notify the nursing supervisor</b> (chain of command). Never simply administer it.</li>
      </ul>
    </div>
            `,
            questions: [
                {
                    q: "The nurse has been set priorities for health problem. She is starting to management of time board. Which of the following step of nursing process?",
                    options: ["Planning","Diagnosis","Intervention","Assessment"],
                    answer: 0,
                    source: 'SNLE recall',
                },
                {
                    q: "The hospital director attended to ward for evaluation of staff regarding vital signs follow up during blood transfusion. What is the most appropriate action for monitoring vital signs during blood transfusion depends on?",
                    options: ["According to physician order","According to nursing supervisor instructions","According to hospital policy","According to blood bank staff instruction"],
                    answer: 2,
                    source: 'SNLE recall',
                },
                {
                    q: "The head nurse of a Coronary Care Unit delegated the staff a senior nurse in that unit What initial step must the head nurse implement before?",
                    options: ["Check the hospital policies for delegating tasks","Explain the task to the senior nurse","Negotiate with the senior nurse","Take the signature of the senior nurse"],
                    answer: 0,
                    source: 'SNLE recall',
                },
                {
                    q: "Postoperative patient is complaining pain. The pain level is 8 from 10. The nurse is busy. What's the task should the nurse delegate for assistant nurse?",
                    options: ["Determine pain level","Assess pain while checking vitals","Give anelgesic","Teach patient breathing exercise to releive pain"],
                    answer: 3,
                    source: 'SNLE recall',
                },
                {
                    q: "Nurse A want to take a break and delegate her task to Nurse B, during that time the patient falling. As a nurse, who is responsible and be accountable for fall",
                    options: ["Head nurse","Nurse A","Nurse B","Nurse A and B"],
                    answer: 3,
                    source: 'SNLE recall',
                },
            ],
        },
        {
            id: "nf-leadership",
            title: "06 — Leadership, Management & Change",
            title_en: "Management functions · Types of power · Nursing care delivery systems",
            summaryHtml: `
<table>
      <thead><tr><th>Style</th><th>Behaviour</th><th>Best used</th></tr></thead>
      <tbody>
        <tr><td>Autocratic</td><td>Leader decides alone, gives orders</td><td>Emergency, code, disaster</td></tr>
        <tr><td>Democratic</td><td>Involves the team, shares decisions</td><td>Day-to-day unit, staff development</td></tr>
        <tr><td>Laissez-faire</td><td>Hands off, minimal direction</td><td>Highly expert, self-directed teams</td></tr>
        <tr><td>Transformational</td><td>Inspires a shared vision, motivates change</td><td>Culture change, quality initiatives</td></tr>
      </tbody>
    </table>
    <h4 class="deck-topic">Management functions</h4>
    <ul>
      <li><b>Planning</b> (goals, budget) → <b>Organising</b> (structure, org chart, staffing mix) → <b>Directing/leading</b> (guiding staff to do the work most effectively) → <b>Controlling</b> (evaluating, comparing to standards)</li>
      <li><b>Lewin's change theory</b>: <b>Unfreezing</b> (recognise the need) → <b>Moving/changing</b> (implement the new way) → <b>Refreezing</b> (make it the norm)</li>
    </ul>
    <h4 class="deck-topic">Types of power</h4>
    <ul>
      <li><b>Legitimate</b> — from the position itself · <b>Reward</b> — ability to give benefits · <b>Coercive</b> — ability to punish/discipline · <b>Expert</b> — knowledge · <b>Referent</b> — respect and personal influence</li>
    </ul>
    <h4 class="deck-topic">Nursing care delivery systems</h4>
    <ul>
      <li><b>Functional</b>: each nurse does one task for all patients (task-oriented)</li>
      <li><b>Team</b>: an RN leads a mixed team caring for a group of patients</li>
      <li><b>Total patient care</b>: one nurse gives <b>all</b> the care for her patients during the shift</li>
      <li><b>Primary nursing</b>: one nurse is accountable for the patient's care <b>from admission to discharge</b>, 24 hours</li>
      <li><b>Case management</b>: coordinates the whole episode of care across the continuum</li>
    </ul>
    <div class="sum-key">
      <span class="sum-key-title">نقاط امتحانية</span>
      <ul>
        <li>"Leading staff in the most effective method" = <b>Directing</b>. "Comparing results to standards" = <b>Controlling</b>.</li>
        <li>Discipline/evaluation used as a threat = <b>coercive</b> power.</li>
        <li>A nurse giving complete care to her assigned patients this shift = <b>total patient care</b>, not primary nursing.</li>
      </ul>
    </div>
            `,
            questions: [
                {
                    q: "She came across a theory which states that the leadership style is effective dependent on the situation. Which of the following styles best fits a situation when the followers are self-directed, experts and are matured individuals?",
                    options: ["Democratic","Authoritarian","Laissez faire","Bureaucratic"],
                    answer: 2,
                    source: 'SNLE recall',
                },
                {
                    q: "The head nurse wants to improve quality system in her department among nursing staff. What is this considering?",
                    options: ["Case management","Quality roles team"],
                    answer: 1,
                    source: 'SNLE recall',
                },
                {
                    q: "Newly promoted (nurse manager) ... what's priority for her?",
                    options: ["Supervise patient care delivered by staff","Complete evaluation of nursing staff","Make unit plan and operational plan"],
                    answer: 1,
                    source: 'SNLE recall',
                },
                {
                    q: "Ms. Caputo is newly promoted to a patient care manager position. She updates her knowledge on the theories in management and leadership in order to become effective in her new role. She learns that some managers have low concern for services and high concern for staff. Which style of management refers to this?",
                    options: ["Organization Man","Impoverished Management","Country Club Management","Team Management"],
                    answer: 2,
                    source: 'SNLE recall',
                },
                {
                    q: "Nursing supervisor newly elected Wants to use\" disciplinary evaluation to nurses’ behavior \" What type of power she is using?",
                    options: ["Reward","Coercive","legitimate","Formal"],
                    answer: 1,
                    source: 'SNLE recall',
                },
            ],
        },
        {
            id: "nf-infection",
            title: "07 — Infection Control & Precautions",
            title_en: "Infection Control & Precautions",
            summaryHtml: `
<ul>
      <li><b>Hand hygiene is the single most effective</b> measure to prevent transmission — before and after every patient contact</li>
      <li>Use <b>soap and water</b> (not alcohol rub) for <i>C. difficile</i>, spores, and visibly soiled hands</li>
      <li><b>Chain of infection</b>: agent → reservoir → portal of exit → mode of transmission → portal of entry → susceptible host. Breaking any link stops the infection</li>
      <li><b>Nosocomial (healthcare-associated) infection</b> = acquired in hospital, appearing &gt;48 h after admission; <b>UTI from indwelling catheters</b> is the classic example</li>
      <li><b>Incubation period</b>: the interval from exposure to first symptoms — the person is often already infectious with non-specific symptoms</li>
    </ul>
    <table>
      <thead><tr><th>Precaution</th><th>PPE / room</th><th>Examples</th></tr></thead>
      <tbody>
        <tr><td>Standard</td><td>Gloves ± gown/mask by risk; applies to <b>every</b> patient</td><td>All body fluids</td></tr>
        <tr><td>Contact</td><td>Gown + gloves, private room, dedicated equipment</td><td>MRSA, VRE, <i>C. difficile</i>, scabies, <b>RSV</b>, wound drainage</td></tr>
        <tr><td>Droplet</td><td>Surgical mask within ~1–2 m, private room</td><td>Influenza, pertussis, mumps, rubella, <b>meningococcal meningitis</b>, group A strep</td></tr>
        <tr><td>Airborne</td><td><b>N95</b> + <b>negative-pressure</b> room, door closed</td><td><b>M</b>easles, <b>T</b>B, <b>V</b>aricella (My Tiny Vampire), disseminated zoster, MERS-CoV</td></tr>
        <tr><td>Protective / reverse isolation</td><td><b>Positive-pressure</b> room, no fresh flowers/raw food, no sick visitors</td><td><b>Neutropenia</b>, transplant, <b>major burns</b>, chemotherapy</td></tr>
      </tbody>
    </table>
    <ul>
      <li>Order for donning: <b>gown → mask → goggles → gloves</b>. Removing: <b>gloves → goggles → gown → mask</b> (gloves are dirtiest, mask comes off last, outside the room)</li>
      <li><b>Sputum specimen</b>: collect <b>early in the morning</b>, after rinsing the mouth with water, before eating; TB requires 3 morning specimens</li>
      <li>Suspected TB → the highest-priority action is to <b>place the patient in a negative-pressure room on airborne precautions</b>, then investigate</li>
    </ul>
    <div class="sum-key">
      <span class="sum-key-title">نقاط امتحانية</span>
      <ul>
        <li><b>RSV / bronchiolitis → CONTACT</b> isolation (not airborne, not droplet).</li>
        <li>A major burns patient needs <b>reverse (protective)</b> isolation — you are protecting the patient, not the ward.</li>
        <li>An outbreak where affected and unaffected people cannot be separated → apply <b>cohorting</b> plus standard + transmission-based precautions to all.</li>
      </ul>
    </div>
            `,
            questions: [
                {
                    q: "The hospital observed MERS-COV infection spreed to many persons. The hospital not identified the affected from non-affected person. What should do to reduce the risk?",
                    options: ["Isolate all patients","Prevent visiting","Apply standard precautions to all patients","Wear protective equipments"],
                    answer: 2,
                    source: 'SNLE recall',
                },
                {
                    q: "A patient in surgical was transferred to isolation room after the wound swab confirmed to have methicillin Resistant staphylococcus Atreus MRSA. Which of the following measures should the nurse take to prevent infection in the ward?",
                    options: ["Clean the Room three times a day","Discard all soiled dressing into waste bag","Instruct the patient to wash hands regularly","Wear gloves and gown on every entry into the room"],
                    answer: 3,
                    source: 'SNLE recall',
                },
                {
                    q: "Suspect patient with TB what is the highest priority nursing action?",
                    options: ["Isolate the patient in private negative pressure room","Take nasal swab"],
                    answer: 0,
                    source: 'SNLE recall',
                },
                {
                    q: "What is the Ministry of health in saudiarabiaprecutions regarding H5N1?",
                    options: ["Hand washing before enter patient room","Be cautious with patient things","Wear gloves and gown","Don't follow precautions"],
                    answer: 0,
                    source: 'SNLE recall',
                },
                {
                    q: "Patient with fever, cough with blood. The nurse call to infection center to provide precaution to the patient. Which precaution should the nurse Apply?",
                    options: ["Airborne","Droplet","Contact","Precaution until the confirm of diagnosis"],
                    answer: 0,
                    source: 'SNLE recall',
                },
            ],
        },
        {
            id: "nf-community",
            title: "08 — Community Health Nursing & Prevention",
            title_en: "Home visit",
            summaryHtml: `
<ul>
      <li>Community health nursing is <b>community-based</b>: the service is given in the <b>natural environment of the people</b> (home, school, workplace), and the <b>family is the unit of care</b></li>
      <li>The most prominent feature of <b>public health nursing</b> is its focus on <b>preventive rather than curative</b> services, for populations rather than individuals</li>
      <li>Priority setting in the community is based on the <b>magnitude/seriousness of the problem</b>, the number of people affected, and the availability of resources</li>
    </ul>
    <table>
      <thead><tr><th>Level</th><th>Aim</th><th>Examples</th></tr></thead>
      <tbody>
        <tr><td>Primary</td><td><b>Prevent the disease occurring</b></td><td>Immunisation, health education, sanitation, seat belts, premarital counselling</td></tr>
        <tr><td>Secondary</td><td><b>Early detection</b> and prompt treatment</td><td>Screening (BP, mammography, Pap, blood glucose), contact tracing, Adam's forward-bend test for scoliosis at school</td></tr>
        <tr><td>Tertiary</td><td>Limit disability, <b>rehabilitate</b></td><td>Stroke rehab, cardiac rehab, prosthesis training, support groups</td></tr>
      </tbody>
    </table>
    <h4 class="deck-topic">Home visit</h4>
    <ul>
      <li>Sequence: plan/review the record → greet and establish rapport → assess the family and environment → give care/teaching → record → plan the next visit</li>
      <li>Bag technique: place the bag on a <b>clean surface over a barrier</b>, perform hand hygiene before and after touching contents; the bag is never placed on the floor</li>
      <li>Visit the <b>non-infectious/most susceptible</b> family first and the infectious case last</li>
      <li>Epidemiology basics: <b>incidence</b> = new cases in a period; <b>prevalence</b> = all existing cases at a point in time; <b>endemic</b> = constantly present; <b>epidemic</b> = sudden rise above expected; <b>pandemic</b> = across countries/continents</li>
    </ul>
    <div class="sum-key">
      <span class="sum-key-title">نقاط امتحانية</span>
      <ul>
        <li>Counselling a couple before marriage about health and obligations = <b>health education</b> (primary prevention).</li>
        <li>To reduce chronic disease in a community you <b>monitor risk factors in each family member</b> — risk-factor surveillance beats treating cases.</li>
        <li>Leading causes of death in Saudi Arabia: <b>ischaemic heart disease and road traffic accidents</b>.</li>
        <li>Elderly immunisation priorities: <b>influenza (yearly) and pneumococcal</b>. Vaccine cold chain is stored at <b>2–8 °C</b>.</li>
      </ul>
    </div>
            `,
            questions: [
                {
                    q: "CHN is a community-based practice. Which best explains this statement?",
                    options: ["The service is provided in the natural environment of people","The nurse has to conduct community diagnosis to determine nursing needs and problems","The service are based on the available resources within the community","Priority setting is based on the magnitude of the health problems identified"],
                    answer: 1,
                    source: 'SNLE recall',
                },
                {
                    q: "How we can reduce chronic cases in the community?",
                    options: ["Evaluate the strategies with outcomes","Monitor risk in each family members"],
                    answer: 1,
                    source: 'SNLE recall',
                },
                {
                    q: "Which of the following is the most prominent feature of public health nursing?",
                    options: ["It involves providing home care to sick people who are not confined in the hospital","Services are provided free of charge to people within the catchment area","The public health nurse functions as part of a team providing a public health nursing service","Public health nursing focuses on preventive, not curative services"],
                    answer: 3,
                    source: 'SNLE recall',
                },
                {
                    q: "Which goal is an aim of public surveillance?",
                    options: ["To rapidly detect the introduction and early cases of a pandemic disease","To serve as an early warning system to detect increases in illness in the community","To monitor a pandemic's impact on health","To track trends in community disease activity and identify populations that are severely affected"],
                    answer: 0,
                    source: 'SNLE recall',
                },
                {
                    q: "A 36-year-old son is the primary caregiver to his 76-year-old has many chronic diseases and need full time assistance discussed with the community nurse the idea of referring his of the elderly day care centers. The nurse explains the case to such services which of the following elderly groups this patient belongs to this service?",
                    options: ["With busy caregivers who need an assistance","Who are bored staying at home and need socialization","Who have been diagnosed with Alzheimer","Who want to engage in handcraft activities and art"],
                    answer: 0,
                    source: 'SNLE recall',
                },
            ],
        },
        {
            id: "nf-safety",
            title: "09 — Patient Safety, Falls & Restraints",
            title_en: "Patient Safety, Falls & Restraints",
            summaryHtml: `
<ul>
      <li>Identify every patient with <b>two identifiers</b> (name + medical record number/date of birth) — never the room number</li>
      <li>Fall prevention: bed in the <b>lowest position</b>, <b>brakes locked</b>, call bell and belongings within reach, non-slip footwear, adequate light, orient to the room, toilet regularly, keep the pathway clear</li>
      <li>Elderly patients who use a walker and need the toilet several times a night → keep a <b>clear, lit path to the bathroom</b> and a bedside commode; do not restrain</li>
      <li><b>Restraints are a last resort</b> after all alternatives fail. They need a <b>time-limited provider order</b> (never PRN), a quick-release knot tied to the <b>bed frame</b> (not the side rail), neurovascular checks and release every <b>2 hours</b>, and continuous documentation</li>
      <li>Fire response = <b>RACE</b>: Rescue → Alarm → Confine → Extinguish. Extinguisher = <b>PASS</b>: Pull, Aim, Squeeze, Sweep</li>
      <li>Body mechanics: bend at the <b>knees, not the waist</b>; keep the load close; use a wide base; push rather than pull; get help/use a lift for heavy patients</li>
    </ul>
            `,
            questions: [
                {
                    q: "What is the best system that help nursing in data interpertation for patient care?",
                    options: ["Patient documentation system","Nursing documentation system"],
                    answer: 0,
                    source: 'SNLE recall',
                },
                {
                    q: "A nurse manager in medical unit is not satisfied with the way things in her unit. Patient satisfaction rate seductive months and staff morale is at its lowest. He decides to plan and initiate changes that will push for a turnaround in the condition of the unit. Which of the following actions is a priority for Henry?",
                    options: ["Call for a staff meeting and take this up in the agenda","Seek help from her manager","Develop a strategic action on how to deal with these concerns","Ignore the issues since these will be resolved naturally"],
                    answer: 0,
                    source: 'SNLE recall',
                },
                {
                    q: "Position of flatulent??",
                    options: ["Flat","Side lying","Knee chest"],
                    answer: 2,
                    source: 'SNLE recall',
                },
                {
                    q: "After accessing patients' medical records, which behavior nurseshows that patient’s confidentiality has been breached?",
                    options: ["Reviews patients medical record","Read patients care plan","Disclosing patient’s information","Documents medication administered"],
                    answer: 2,
                    source: 'SNLE recall',
                },
                {
                    q: "New manager promoted to position. Which of the following is the most appropriate action?",
                    options: ["Assess patient care","Interview for new staff","Ask help from head nurse"],
                    answer: 1,
                    source: 'SNLE recall',
                },
            ],
        },
        {
            id: "nf-position",
            title: "10 — Positioning — high-yield table",
            title_en: "Positioning — high-yield table",
            summaryHtml: `
<table>
      <thead><tr><th>Situation</th><th>Position</th></tr></thead>
      <tbody>
        <tr><td>Respiratory distress / dyspnoea / after tonsillectomy in the awake child</td><td><b>High Fowler's</b> (upright)</td></tr>
        <tr><td>After appendectomy / most abdominal surgery / NG tube feeding</td><td><b>Semi-Fowler's</b> (30–45°)</td></tr>
        <tr><td>Unconscious, post-op before fully awake, post-tonsillectomy bleeding risk, seizure</td><td><b>Side-lying (lateral / recovery)</b></td></tr>
        <tr><td>Shock / hypovolaemia</td><td><b>Supine with legs elevated</b> (modified Trendelenburg)</td></tr>
        <tr><td>Air embolism, or after a central-line insertion accident</td><td><b>Left lateral Trendelenburg</b></td></tr>
        <tr><td>Lumbar puncture</td><td>Curled on the side, knees to chest; lie <b>flat</b> afterwards</td></tr>
        <tr><td>Endoscopy / EGD</td><td><b>Supine</b> for insertion, then left lateral</td></tr>
        <tr><td>After liver biopsy</td><td><b>Right</b> side-lying to tamponade the site</td></tr>
        <tr><td>Increased ICP</td><td>HOB <b>30°</b>, head midline, avoid neck flexion and hip flexion</td></tr>
        <tr><td>Autonomic dysreflexia</td><td>Sit the patient <b>upright</b> immediately, then find the trigger</td></tr>
        <tr><td>Total hip replacement</td><td>Abduction pillow, <b>no hip flexion &gt;90°</b>, no crossing legs, no internal rotation</td></tr>
        <tr><td>Prolapsed umbilical cord</td><td><b>Knee-chest</b> or Trendelenburg, lift the presenting part off the cord</td></tr>
      </tbody>
    </table>
            `,
            questions: [
                {
                    q: "Position that increases heart Murmur",
                    options: ["High Fowler","Sideline","Trendelenburg"],
                    answer: 2,
                    source: 'SNLE recall',
                },
                {
                    q: "Position for lumbar puncture?!",
                    options: ["Lateral recumbent position","Prone position","Supine position"],
                    answer: 0,
                    source: 'SNLE recall',
                },
                {
                    q: "Patient has ulcers in his foot. What is most important nursing diagnosis??",
                    options: ["High risk for injury","Altered body image"],
                    answer: 0,
                    source: 'SNLE recall',
                },
                {
                    q: "The head nurse gives low evaluation to the nurse because of her late. What is the type of her evaluation effect?",
                    options: ["Halo effect","Horn effect","Central tendency"],
                    answer: 1,
                    source: 'SNLE recall',
                },
                {
                    q: "Managerscreate a new position patient educator work with head nurse, what organizational relationship?",
                    options: ["square","solid line","matrix","Dotted line"],
                    answer: 3,
                    source: 'SNLE recall',
                },
            ],
        },
        {
            id: "nf-oxygen",
            title: "11 — Oxygen Delivery",
            title_en: "Oxygen Delivery",
            summaryHtml: `
<table>
      <thead><tr><th>Device</th><th>Flow</th><th>FiO₂</th><th>Notes</th></tr></thead>
      <tbody>
        <tr><td>Nasal cannula</td><td>1–6 L/min</td><td>24–44%</td><td>Patient can eat and talk; humidify above 4 L</td></tr>
        <tr><td>Simple mask</td><td>6–10 L/min</td><td>40–60%</td><td>Minimum 6 L to flush CO₂</td></tr>
        <tr><td>Partial rebreather</td><td>6–11 L/min</td><td>60–75%</td><td>Keep the reservoir bag inflated</td></tr>
        <tr><td>Non-rebreather</td><td>10–15 L/min</td><td>80–95%</td><td>Highest non-invasive concentration; emergencies</td></tr>
        <tr><td><b>Venturi mask</b></td><td>Per colour-coded adaptor</td><td>24–60% <b>precise</b></td><td>Device of choice in <b>COPD</b> — exact, controlled FiO₂</td></tr>
      </tbody>
    </table>
    <ul>
      <li>Oxygen supports combustion: <b>no smoking, no open flame</b>, avoid oil-based products and wool/synthetic blankets (static)</li>
      <li>In COPD the drive to breathe may be hypoxic — give controlled low-flow O₂ and watch for CO₂ narcosis (drowsiness, confusion)</li>
    </ul>
            `,
            questions: [
                {
                    q: "The nurse wittiness for another nurse while entering to the isolated pt room with airborne precautions and she wear only gown andgloves, what is the appropriate action from the wittiness nurse to do?",
                    options: ["Talk with the nurse about wearing mask","Talk with the education nurse to introduce lecture for staff about PPE","Inform the head department about the nurse","Ignored the nurse action"],
                    answer: 0,
                    source: 'SNLE recall',
                },
                {
                    q: "The patient asked nurse to check his temperature then the nurse ignore the patient and she did not give him care?",
                    options: ["Malpractice","Negligence","Slander"],
                    answer: 1,
                    source: 'SNLE recall',
                },
            ],
        },
        {
            id: "nf-fluids",
            title: "12 — IV Therapy, Fluids & Transfusion",
            title_en: "IV solutions · Complications of IV therapy · Blood transfusion",
            summaryHtml: `
<h4 class="deck-topic">IV solutions</h4>
    <table>
      <thead><tr><th>Type</th><th>Examples</th><th>Effect / use</th></tr></thead>
      <tbody>
        <tr><td><b>Isotonic</b></td><td>0.9% NaCl, <b>Lactated Ringer's</b>, D5W (in the bag)</td><td>Expands the <b>extracellular/intravascular</b> volume — shock, dehydration, blood loss</td></tr>
        <tr><td><b>Hypotonic</b></td><td>0.45% NaCl, 0.33% NaCl</td><td>Moves fluid <b>into</b> the cell — cellular dehydration, DKA after initial resuscitation. Risk: cerebral oedema</td></tr>
        <tr><td><b>Hypertonic</b></td><td>3% NaCl, D10W, D5 ½NS</td><td>Pulls fluid <b>out</b> of the cell into the vessel — severe hyponatraemia, cerebral oedema. Risk: fluid overload</td></tr>
        <tr><td><b>Colloids</b></td><td>Albumin, dextran, hetastarch</td><td>Large molecules that hold fluid in the vessel — volume expansion</td></tr>
      </tbody>
    </table>
    <h4 class="deck-topic">Complications of IV therapy</h4>
    <ul>
      <li><b>Infiltration</b>: cool, pale, swollen, no blood return → stop, remove, elevate, warm/cool compress</li>
      <li><b>Phlebitis</b>: red, warm, tender, a palpable cord along the vein → stop, remove, warm compress, restart elsewhere</li>
      <li><b>Extravasation</b> of a vesicant → stop immediately, do <b>not</b> remove the cannula until you aspirate, notify the provider (antidote)</li>
      <li><b>Air embolism</b>: sudden dyspnoea, chest pain → clamp the line, <b>left lateral Trendelenburg</b>, oxygen, notify</li>
      <li><b>Fluid overload</b>: dyspnoea, crackles, raised JVP, bounding pulse, weight gain → slow the rate, sit the patient up, oxygen, notify</li>
    </ul>
    <h4 class="deck-topic">Blood transfusion</h4>
    <ul>
      <li>Verify with a <b>second nurse</b>: patient identity, blood group, unit number, expiry</li>
      <li>Prime with <b>0.9% normal saline only</b> — never dextrose (haemolysis) or Ringer's (calcium → clotting)</li>
      <li>Start slowly and <b>stay with the patient for the first 15 minutes</b>; take baseline VS, then per protocol</li>
      <li>Infuse one unit within <b>4 hours</b>; use a filtered blood set</li>
      <li>Any reaction (fever, chills, flank/back pain, hypotension, dyspnoea, rash) → <b>STOP the transfusion immediately, keep the line open with normal saline via new tubing</b>, take VS, notify the provider and the blood bank, return the unit and tubing</li>
      <li><b>O negative</b> = universal donor; <b>AB positive</b> = universal recipient</li>
    </ul>
    <div class="sum-key">
      <span class="sum-key-title">نقاط امتحانية</span>
      <ul>
        <li>Lactated Ringer's <b>expands extracellular fluid</b> — the classic answer for its action.</li>
        <li>Intake/output: count all fluids <b>in</b> (IV, oral, tube feed, flushes, IV medications) and all <b>out</b> (urine, emesis, drains, blood loss, liquid stool). Blood loss counts as output; irrigant instilled counts as intake.</li>
        <li>Leaving a tourniquet on too long before venipuncture causes <b>haemoconcentration</b> and falsely elevated results.</li>
      </ul>
    </div>
            `,
            questions: [
                {
                    q: "Nurse was documenting, and she documented wrongly (Error), what she should do?",
                    options: ["Review policy of how to correct wrong documentation","A- use liquid and Waite until dry then write the correct one above it","use liquid and write the correct one beside","do line then write the correct beside"],
                    answer: 3,
                    source: 'SNLE recall',
                },
                {
                    q: "Woman came to outpatient for follow up. She complained from dizzness and fatigue. The nurse refered her to relax inside empty room. She suddenly fell down on the floor then she has faintaing and loss of conciousness. The nurse examined her and assessed vital signs. Bl. P 90/50 mmhg , HR 120 b/m, RR 23 b/m.What is the first intervention for her?",
                    options: ["Notify the doctor","Elevate her leg","Check Physical assessment and vital signs"],
                    answer: 1,
                    source: 'SNLE recall',
                },
                {
                    q: "A nurse is caring for a client with syndrome of inappropriate antidiuretic hormone (SIDH). Which of the following should be a priority intervention for the client?",
                    options: ["Monitoring hourly intake and output","Pressure ulcer prevention strategies","Encourage client to eat foods rich in potassium","Restricting fluid intake of the client to less than 1000ml per day"],
                    answer: 3,
                    source: 'SNLE recall',
                },
                {
                    q: "Alteration in nutrition: More than body requirements for 14 months. The patient has reached ideal body weight and reports enjoying a new life style(see table) *Alteration in nutrition, more than body requirements. Short term goals. The Patient will : *Lose 4 pounds each week. *Eat a healthy well-balanced diet daily *Exercise for 30 minutes 5 days each week. Which of the following is the best action should the nurse take?",
                    options: ["Continue the care plan as written for another year","Discontinue the care plan since the patient has met all goals","Change the long-term goal for altered nutrition to maintain current weight","Discontinue the care plan and add new diagnosis of health seeking behavior"],
                    answer: 2,
                    source: 'SNLE recall',
                },
                {
                    q: "A nurse cares for a group of clients in a long-term care facility. Which situation represents a situation in which the nurse supports the client's autonomy?",
                    options: ["A client falls and fractures a hip. The nurse contacts the health care. provider for a prescription for pain medication prior to transfer for treatment","A client reports to the nurse regarding observing staff smoking on facility grounds when it was banned for residents and family members","A competent client who has received a terminal diagnosis request. the nurse to not reveal the diagnosis to the family due to fear of them. seeking long-term mechanical ventilation","A client wishes to have a do not resuscitate (DNR) order to prevent heroic measures by the health care team in the event of cardiac or respiratory arrest"],
                    answer: 3,
                    source: 'SNLE recall',
                },
            ],
        },
        {
            id: "nf-skin",
            title: "13 — Pressure Injuries & Wound Care",
            title_en: "Pressure Injuries & Wound Care",
            summaryHtml: `
<table>
      <thead><tr><th>Stage</th><th>Finding</th></tr></thead>
      <tbody>
        <tr><td>Stage 1</td><td>Intact skin, <b>non-blanchable erythema</b></td></tr>
        <tr><td>Stage 2</td><td>Partial-thickness loss — shallow open ulcer or intact/ruptured <b>blister</b>; dermis exposed</td></tr>
        <tr><td>Stage 3</td><td>Full-thickness loss, <b>subcutaneous fat visible</b>, no bone/tendon/muscle</td></tr>
        <tr><td>Stage 4</td><td>Full-thickness with exposed <b>bone, tendon or muscle</b></td></tr>
        <tr><td>Unstageable</td><td>Base covered by slough/eschar — depth cannot be determined</td></tr>
      </tbody>
    </table>
    <ul>
      <li>Prevention: reposition <b>every 2 hours</b> (every 1 h in a chair), pressure-redistributing mattress, keep skin clean and dry, adequate <b>protein and fluids</b>, <b>Braden scale</b> for risk, do <b>not</b> massage a reddened bony prominence</li>
      <li>Wound healing needs protein, vitamin C, zinc and adequate perfusion</li>
      <li><b>Dehiscence</b> (wound edges separate) / <b>evisceration</b> (viscera protrude) → place the patient <b>supine with knees flexed</b>, cover the organs with a <b>sterile saline-soaked dressing</b>, keep NPO and notify the surgeon immediately — never push the organs back</li>
      <li>A sterile item that falls to the floor, is below waist level, or is out of your line of vision is <b>contaminated</b> — discard it and get a new one</li>
    </ul>
    <div class="sum-key">
      <span class="sum-key-title">نقاط امتحانية</span>
      <ul>
        <li>A staple/instrument that falls on the floor is contaminated — do not retrieve and reuse it; <b>cover the wound with a sterile dressing</b> and inform the surgeon.</li>
      </ul>
    </div>
            `,
            questions: [
                {
                    q: "Patient came to ER with cold clammy skin and loss of hair in leg. He has pressure ulcer in both leg. What is the most appropriate nursing diagnosis?",
                    options: ["Risk for immobility","Risk for injury","Risk for fall"],
                    answer: 1,
                    source: 'SNLE recall',
                },
                {
                    q: "Bedridden PT nurse is doing pathing for him and she used lotion after bathing to prevent pressure ulcer for patient. What is appropriate action??",
                    options: ["Dry patient after bathing","Use Air mattress","Keep the sheet loosely"],
                    answer: 1,
                    source: 'SNLE recall',
                },
                {
                    q: "year-old woman patient was brought to the Outpatient for the removal of stitches on her left cheek which was treated nine days back after being involved in road traffic accident. She covers her face completely and requests to be seen by a female doctor. The site of the wound was red, swollen and some pussy points were visible. She states that she did not wash her face since her accident and kept her face covered all the time as she did not want anyone to see it. What is the most appropriate nursing diagnosis?",
                    options: ["Hopelessness","Social isolation","Anxiety","Powerlessness"],
                    answer: 1,
                    source: 'SNLE recall',
                },
                {
                    q: "Nurse plan community program to those who experienced a disease And assess the recovery or rehabilitation or dis abilityWhich level of prevention?",
                    options: ["primary","secondary","tertiary"],
                    answer: 2,
                    source: 'SNLE recall',
                },
                {
                    q: "The comatosed patient with NGT for feeding and positioned in low fowler. The nurse enter the patient room. She found the patient in supine position. She auscultated lung sound with diventure. What is the most appropriate nursing diagnosis?",
                    options: ["Risk for injury","Risk for aspiration due to NGT"],
                    answer: 1,
                    source: 'SNLE recall',
                },
            ],
        },
        {
            id: "nf-quality",
            title: "14 — Quality, Evaluation & Nursing Research",
            title_en: "Quality, Evaluation & Nursing Research",
            summaryHtml: `
<ul>
      <li><b>Evaluation</b> is a systematic, continuous process that judges worth/value against defined criteria and feeds back into planning</li>
      <li><b>Donabedian</b> quality framework: <b>Structure</b> (resources, staffing, equipment) → <b>Process</b> (what is done, adherence to protocol) → <b>Outcome</b> (infection rate, mortality, satisfaction)</li>
      <li><b>Root-cause analysis</b> is done <b>after</b> a sentinel event to find the system cause, not to blame an individual</li>
      <li><b>Sentinel event</b> = unexpected death or serious physical/psychological injury — always investigated</li>
      <li><b>Evidence-based practice</b> ranks evidence: systematic review/meta-analysis &gt; RCT &gt; cohort &gt; case-control &gt; expert opinion</li>
      <li><b>Quantitative</b> research measures numbers (questionnaire scores, rates); <b>qualitative</b> explores meaning/experience (interviews, focus groups)</li>
      <li>Research ethics: informed consent, confidentiality/anonymity, right to withdraw, IRB approval</li>
    </ul>
    <div class="sum-key">
      <span class="sum-key-title">نقاط امتحانية</span>
      <ul>
        <li>"A questionnaire measuring nursing job satisfaction" = <b>quantitative</b> design.</li>
        <li>Evaluating actions by comparing the achieved outcomes with the planned objectives = the <b>controlling/evaluation</b> function.</li>
      </ul>
    </div>
            `,
            questions: [
                {
                    q: "The first step in the qualitative research process?",
                    options: ["Data analysis","Review of literature","Sample","Study design"],
                    answer: 1,
                    source: 'SNLE recall',
                },
                {
                    q: "Which type of study design provides the strongest evidence?",
                    options: ["Qualitative study","Randomized control trial","Systematic review of descriptive studies","Systematic review of correlational studies"],
                    answer: 1,
                    source: 'SNLE recall',
                },
                {
                    q: "Qualitative research with evidence",
                    options: ["survey with ranking","interview one to one","collect data from system"],
                    answer: 1,
                    source: 'SNLE recall',
                },
                {
                    q: "During the research process, when should a hypothesis be developed by the researcher?",
                    options: ["Before any statistical analysis","After a research design is determined","Before development of the research question","After development of the research question"],
                    answer: 3,
                    source: 'SNLE recall',
                },
                {
                    q: "All the following are considered steps in the qualitative research process, except?",
                    options: ["Literature review","Data collection","Sample","Hypothesis"],
                    answer: 3,
                    source: 'SNLE recall',
                },
            ],
        },
    ],
};

export default nursingFundamentals;
