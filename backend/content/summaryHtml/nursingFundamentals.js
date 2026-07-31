// Fundamentals of Nursing — nursing-track topic summary, served (gated) to the
// slide viewer. Same house style as the medical decks: RTL shell, LTR clinical
// body, numbered topics, "نقاط امتحانية" key boxes.
//
// Scope was chosen from what the nursing question bank actually tests: priority
// setting, ethics/consent, documentation and incident reporting, delegation and
// leadership, infection control, community health, and safety/positioning.
// Angle brackets in clinical text are HTML-escaped (&lt; / &gt;).
export default `
<div class="sum-doc" dir="rtl">
  <div class="sum-head">
    <h2>أساسيات التمريض — ملخص عالي العائد (SNLE)</h2>
    <p class="sum-meta">يغطي عملية التمريض والأولويات · العلامات الحيوية · التوثيق وتقارير الحوادث · الأخلاقيات والقانون والموافقة المستنيرة · التفويض والقيادة والإدارة · مكافحة العدوى والعزل · صحة المجتمع والوقاية · سلامة المريض والوضعيات · الأكسجين والسوائل ونقل الدم · الجودة والبحث العلمي. للمراجعة الامتحانية فقط.</p>
  </div>

  <nav class="sum-toc" dir="rtl" aria-label="جدول المحتويات">
    <h3>جدول المحتويات</h3>
    <ol>
      <li><a href="#f-process">Nursing Process &amp; Priority Setting</a></li>
      <li><a href="#f-vitals">Vital Signs &amp; Baseline Values</a></li>
      <li><a href="#f-doc">Documentation &amp; Incident Reports</a></li>
      <li><a href="#f-ethics">Ethics, Law &amp; Informed Consent</a></li>
      <li><a href="#f-delegation">Delegation &amp; Scope of Practice</a></li>
      <li><a href="#f-leadership">Leadership, Management &amp; Change</a></li>
      <li><a href="#f-infection">Infection Control &amp; Precautions</a></li>
      <li><a href="#f-community">Community Health &amp; Prevention</a></li>
      <li><a href="#f-safety">Patient Safety, Falls &amp; Restraints</a></li>
      <li><a href="#f-position">Positioning</a></li>
      <li><a href="#f-oxygen">Oxygen Delivery</a></li>
      <li><a href="#f-fluids">IV Therapy, Fluids &amp; Transfusion</a></li>
      <li><a href="#f-skin">Pressure Injuries &amp; Wound Care</a></li>
      <li><a href="#f-quality">Quality, Evaluation &amp; Research</a></li>
    </ol>
  </nav>

  <section class="topic" id="f-process" dir="ltr">
    <h3>1. Nursing Process &amp; Priority Setting</h3>
    <h4>ADPIE</h4>
    <ul>
      <li><b>A</b>ssess (collect + verify data) → <b>D</b>iagnose (NANDA nursing diagnosis) → <b>P</b>lan (SMART goals) → <b>I</b>mplement → <b>E</b>valuate</li>
      <li><b>Assessment is always the first step</b> — unless the patient is unstable/ABC is threatened, then act</li>
      <li>Evaluation compares the actual outcome against the goal; it is a <b>continuous feedback</b> process, not a one-off</li>
      <li><b>Subjective</b> = what the patient <i>says</i> (pain, nausea, history). <b>Objective</b> = what you can measure/observe (VS, bleeding, vomiting)</li>
    </ul>
    <h4>Which answer is the "priority"?</h4>
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
  </section>

  <section class="topic" id="f-vitals" dir="ltr">
    <h3>2. Vital Signs &amp; Baseline Values</h3>
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
  </section>

  <section class="topic" id="f-doc" dir="ltr">
    <h3>3. Documentation &amp; Incident Reports</h3>
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
  </section>

  <section class="topic" id="f-ethics" dir="ltr">
    <h3>4. Ethics, Law &amp; Informed Consent</h3>
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
    <h4>Informed consent</h4>
    <ul>
      <li>The <b>physician/surgeon</b> explains the procedure, benefits, risks, alternatives and answers questions. The <b>nurse witnesses the signature</b> and verifies it was voluntary and that the patient understands</li>
      <li>The nurse may <b>clarify</b> what the surgeon said but may <b>not add new information</b></li>
      <li>If the patient says "I don't really know what they are going to do" → <b>stop and notify the surgeon</b>; do not let them sign</li>
      <li>Consent is invalid if the patient is sedated, intoxicated, or cognitively impaired</li>
      <li>Not required for a true life-saving emergency (implied consent)</li>
      <li>Minors: parent/legal guardian consents — except for emancipated minors and, in many settings, care of STI/pregnancy</li>
      <li>If the surgeon operates on a site <b>not</b> covered by the consent form → that is <b>battery</b>; report through the chain of command and file an incident report</li>
    </ul>
    <h4>Legal terms</h4>
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
  </section>

  <section class="topic" id="f-delegation" dir="ltr">
    <h3>5. Delegation &amp; Scope of Practice</h3>
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
  </section>

  <section class="topic" id="f-leadership" dir="ltr">
    <h3>6. Leadership, Management &amp; Change</h3>
    <table>
      <thead><tr><th>Style</th><th>Behaviour</th><th>Best used</th></tr></thead>
      <tbody>
        <tr><td>Autocratic</td><td>Leader decides alone, gives orders</td><td>Emergency, code, disaster</td></tr>
        <tr><td>Democratic</td><td>Involves the team, shares decisions</td><td>Day-to-day unit, staff development</td></tr>
        <tr><td>Laissez-faire</td><td>Hands off, minimal direction</td><td>Highly expert, self-directed teams</td></tr>
        <tr><td>Transformational</td><td>Inspires a shared vision, motivates change</td><td>Culture change, quality initiatives</td></tr>
      </tbody>
    </table>
    <h4>Management functions</h4>
    <ul>
      <li><b>Planning</b> (goals, budget) → <b>Organising</b> (structure, org chart, staffing mix) → <b>Directing/leading</b> (guiding staff to do the work most effectively) → <b>Controlling</b> (evaluating, comparing to standards)</li>
      <li><b>Lewin's change theory</b>: <b>Unfreezing</b> (recognise the need) → <b>Moving/changing</b> (implement the new way) → <b>Refreezing</b> (make it the norm)</li>
    </ul>
    <h4>Types of power</h4>
    <ul>
      <li><b>Legitimate</b> — from the position itself · <b>Reward</b> — ability to give benefits · <b>Coercive</b> — ability to punish/discipline · <b>Expert</b> — knowledge · <b>Referent</b> — respect and personal influence</li>
    </ul>
    <h4>Nursing care delivery systems</h4>
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
  </section>

  <section class="topic" id="f-infection" dir="ltr">
    <h3>7. Infection Control &amp; Precautions</h3>
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
  </section>

  <section class="topic" id="f-community" dir="ltr">
    <h3>8. Community Health Nursing &amp; Prevention</h3>
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
    <h4>Home visit</h4>
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
  </section>

  <section class="topic" id="f-safety" dir="ltr">
    <h3>9. Patient Safety, Falls &amp; Restraints</h3>
    <ul>
      <li>Identify every patient with <b>two identifiers</b> (name + medical record number/date of birth) — never the room number</li>
      <li>Fall prevention: bed in the <b>lowest position</b>, <b>brakes locked</b>, call bell and belongings within reach, non-slip footwear, adequate light, orient to the room, toilet regularly, keep the pathway clear</li>
      <li>Elderly patients who use a walker and need the toilet several times a night → keep a <b>clear, lit path to the bathroom</b> and a bedside commode; do not restrain</li>
      <li><b>Restraints are a last resort</b> after all alternatives fail. They need a <b>time-limited provider order</b> (never PRN), a quick-release knot tied to the <b>bed frame</b> (not the side rail), neurovascular checks and release every <b>2 hours</b>, and continuous documentation</li>
      <li>Fire response = <b>RACE</b>: Rescue → Alarm → Confine → Extinguish. Extinguisher = <b>PASS</b>: Pull, Aim, Squeeze, Sweep</li>
      <li>Body mechanics: bend at the <b>knees, not the waist</b>; keep the load close; use a wide base; push rather than pull; get help/use a lift for heavy patients</li>
    </ul>
  </section>

  <section class="topic" id="f-position" dir="ltr">
    <h3>10. Positioning — high-yield table</h3>
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
  </section>

  <section class="topic" id="f-oxygen" dir="ltr">
    <h3>11. Oxygen Delivery</h3>
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
  </section>

  <section class="topic" id="f-fluids" dir="ltr">
    <h3>12. IV Therapy, Fluids &amp; Transfusion</h3>
    <h4>IV solutions</h4>
    <table>
      <thead><tr><th>Type</th><th>Examples</th><th>Effect / use</th></tr></thead>
      <tbody>
        <tr><td><b>Isotonic</b></td><td>0.9% NaCl, <b>Lactated Ringer's</b>, D5W (in the bag)</td><td>Expands the <b>extracellular/intravascular</b> volume — shock, dehydration, blood loss</td></tr>
        <tr><td><b>Hypotonic</b></td><td>0.45% NaCl, 0.33% NaCl</td><td>Moves fluid <b>into</b> the cell — cellular dehydration, DKA after initial resuscitation. Risk: cerebral oedema</td></tr>
        <tr><td><b>Hypertonic</b></td><td>3% NaCl, D10W, D5 ½NS</td><td>Pulls fluid <b>out</b> of the cell into the vessel — severe hyponatraemia, cerebral oedema. Risk: fluid overload</td></tr>
        <tr><td><b>Colloids</b></td><td>Albumin, dextran, hetastarch</td><td>Large molecules that hold fluid in the vessel — volume expansion</td></tr>
      </tbody>
    </table>
    <h4>Complications of IV therapy</h4>
    <ul>
      <li><b>Infiltration</b>: cool, pale, swollen, no blood return → stop, remove, elevate, warm/cool compress</li>
      <li><b>Phlebitis</b>: red, warm, tender, a palpable cord along the vein → stop, remove, warm compress, restart elsewhere</li>
      <li><b>Extravasation</b> of a vesicant → stop immediately, do <b>not</b> remove the cannula until you aspirate, notify the provider (antidote)</li>
      <li><b>Air embolism</b>: sudden dyspnoea, chest pain → clamp the line, <b>left lateral Trendelenburg</b>, oxygen, notify</li>
      <li><b>Fluid overload</b>: dyspnoea, crackles, raised JVP, bounding pulse, weight gain → slow the rate, sit the patient up, oxygen, notify</li>
    </ul>
    <h4>Blood transfusion</h4>
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
  </section>

  <section class="topic" id="f-skin" dir="ltr">
    <h3>13. Pressure Injuries &amp; Wound Care</h3>
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
  </section>

  <section class="topic" id="f-quality" dir="ltr">
    <h3>14. Quality, Evaluation &amp; Nursing Research</h3>
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
  </section>
</div>
`;
