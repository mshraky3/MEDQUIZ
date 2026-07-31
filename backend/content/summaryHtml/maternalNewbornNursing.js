// Maternal & Newborn Nursing — nursing-track topic summary, served (gated) to
// the slide viewer. Antepartum → intrapartum → newborn → postpartum, in the
// order the exam walks through them. Angle brackets escaped (&lt; / &gt;).
export default `
<div class="sum-doc" dir="rtl">
  <div class="sum-head">
    <h2>تمريض الأمومة والمواليد — ملخص عالي العائد (SNLE)</h2>
    <p class="sum-meta">يغطي متابعة الحمل والتغيرات الفسيولوجية · مضاعفات الحمل · مراحل المخاض ومراقبة الجنين · العناية بالمولود · فترة النفاس والرضاعة · الصحة الإنجابية وتنظيم الأسرة. للمراجعة الامتحانية فقط.</p>
  </div>

  <nav class="sum-toc" dir="rtl" aria-label="جدول المحتويات">
    <h3>جدول المحتويات</h3>
    <ol>
      <li><a href="#m-antenatal">Antenatal Care, GTPAL &amp; Dating</a></li>
      <li><a href="#m-physio">Physiological Changes &amp; Nutrition</a></li>
      <li><a href="#m-tests">Tests During Pregnancy</a></li>
      <li><a href="#m-complications">High-Risk Pregnancy</a></li>
      <li><a href="#m-bleeding">Antepartum Haemorrhage</a></li>
      <li><a href="#m-labor">Labour: Stages &amp; the 5 Ps</a></li>
      <li><a href="#m-fetal">Fetal Monitoring</a></li>
      <li><a href="#m-drugs">Drugs Used in Labour</a></li>
      <li><a href="#m-newborn">Newborn Assessment &amp; Care</a></li>
      <li><a href="#m-postpartum">Postpartum Assessment &amp; Complications</a></li>
      <li><a href="#m-feeding">Breastfeeding &amp; Formula</a></li>
      <li><a href="#m-repro">Contraception &amp; Reproductive Health</a></li>
    </ol>
  </nav>

  <section class="topic" id="m-antenatal" dir="ltr">
    <h3>1. Antenatal Care, GTPAL &amp; Dating</h3>
    <ul>
      <li><b>GTPAL</b> — <b>G</b>ravida (total pregnancies incl. current) · <b>T</b>erm (≥37 wk) · <b>P</b>reterm (20–36⁶ wk) · <b>A</b>bortions (&lt;20 wk) · <b>L</b>iving children. Twins count as <b>one</b> pregnancy but <b>two</b> living children</li>
      <li><b>Naegele's rule</b> for EDD: first day of the LMP <b>− 3 months + 7 days (+ 1 year)</b></li>
      <li>Pregnancy = <b>280 days / 40 weeks / 10 lunar months</b>; trimesters 1–13, 14–27, 28–40 weeks</li>
      <li>Terminology by stage: <b>zygote</b> (fertilisation–2 wk) → <b>embryo</b> (<b>3–8 weeks</b>, organogenesis, most vulnerable to teratogens) → <b>fetus</b> (9 weeks–birth)</li>
      <li><b>Fusion/fertilisation</b>: sperm penetrates the ovum in the ampulla of the fallopian tube. <b>Capacitation</b> = the biochemical activation of sperm that makes fertilisation possible</li>
      <li>Visit schedule: <b>every 4 weeks</b> to 28 wk → <b>every 2 weeks</b> to 36 wk → <b>weekly</b> until delivery</li>
    </ul>
    <h4>Signs of pregnancy</h4>
    <table>
      <thead><tr><th>Category</th><th>Signs</th></tr></thead>
      <tbody>
        <tr><td><b>Presumptive</b> (subjective, felt by the mother)</td><td>Amenorrhoea, nausea/vomiting, breast tenderness, fatigue, urinary frequency, quickening</td></tr>
        <tr><td><b>Probable</b> (observed by the examiner)</td><td><b>Goodell's</b> (soft cervix), <b>Hegar's</b> (soft lower uterine segment), <b>Chadwick's</b> (bluish vagina/cervix), Braxton Hicks, ballottement, positive pregnancy test</td></tr>
        <tr><td><b>Positive</b> (only these confirm)</td><td><b>Fetal heart tones</b>, <b>fetal movement felt by the examiner</b>, <b>visualisation of the fetus on ultrasound</b></td></tr>
      </tbody>
    </table>
    <h4>Fundal height landmarks</h4>
    <ul>
      <li><b>12 weeks</b> — at the symphysis pubis · <b>16 weeks</b> — midway between symphysis and umbilicus · <b>20 weeks</b> — at the umbilicus · <b>36 weeks</b> — at the <b>xiphoid process</b> · then it drops with lightening</li>
      <li>From 20–36 weeks, fundal height in cm ≈ gestational age in weeks (±2)</li>
    </ul>
    <div class="sum-key">
      <span class="sum-key-title">نقاط امتحانية</span>
      <ul>
        <li>Only <b>fetal heart tones, examiner-felt movement, and ultrasound</b> are <b>positive</b> signs — a positive urine test is only <i>probable</i>.</li>
        <li>The embryonic period (<b>3–8 weeks</b>) is when teratogens cause structural anomalies.</li>
        <li>A full-term newborn weighs <b>2.5–4 kg</b>.</li>
      </ul>
    </div>
  </section>

  <section class="topic" id="m-physio" dir="ltr">
    <h3>2. Physiological Changes &amp; Nutrition</h3>
    <ul>
      <li><b>Blood volume rises ~40–50%</b> → physiological (dilutional) anaemia; Hgb &lt;11 g/dL in the 1st/3rd trimester is true anaemia</li>
      <li>Cardiac output ↑, HR ↑ ~10–15 bpm, BP <b>falls</b> in the 2nd trimester then returns to baseline</li>
      <li><b>Supine hypotensive syndrome</b>: the uterus compresses the vena cava → dizziness, pallor, hypotension → turn the mother to the <b>left lateral</b> position</li>
      <li>GFR ↑ → <b>BUN and creatinine fall</b>; a "normal" creatinine may in fact be high in pregnancy</li>
      <li>Progesterone relaxes smooth muscle → constipation, GERD/heartburn, urinary stasis (UTI risk), gallstones</li>
      <li>Hypercoagulable state → higher DVT/PE risk</li>
      <li>Weight gain: <b>11–16 kg</b> for a normal BMI (~1–2 kg in the 1st trimester, then ~0.5 kg/week)</li>
    </ul>
    <h4>Nutrition &amp; what to avoid</h4>
    <ul>
      <li><b>Folic acid 400 µg</b> daily from before conception (<b>4 mg</b> if a previous neural-tube defect) — prevents NTDs</li>
      <li>Iron, calcium, protein increased; ~<b>+300 kcal/day</b> in pregnancy and <b>+500 kcal/day</b> while breastfeeding</li>
      <li><b>Avoid</b>: raw/undercooked meat, eggs and fish (toxoplasmosis, listeria, salmonella), unpasteurised milk and soft cheese, high-mercury fish (shark, swordfish, king mackerel), liver (excess vitamin A), alcohol, smoking, <b>cat litter</b>, hot tubs/saunas</li>
      <li>Wash fruit and vegetables well; cooked fish and chicken are safe</li>
      <li>Caffeine limited to &lt;200 mg/day</li>
      <li>Exercise is encouraged (walking, swimming), avoid supine exercise after the 1st trimester and contact sports</li>
    </ul>
    <div class="sum-key">
      <span class="sum-key-title">نقاط امتحانية</span>
      <ul>
        <li>The classic "avoid during pregnancy" answer is <b>raw / uncooked meat</b>.</li>
        <li>Emotional lability — crying without any cause — is a <b>normal</b> psychological change; <b>ambivalence</b> is the normal first-trimester feeling about the pregnancy.</li>
        <li>Hyperemesis gravidarum is confirmed by <b>ketonuria</b>; treat with IV fluids, antiemetics, and correct electrolytes.</li>
      </ul>
    </div>
  </section>

  <section class="topic" id="m-tests" dir="ltr">
    <h3>3. Tests During Pregnancy</h3>
    <table>
      <thead><tr><th>Test</th><th>Timing</th><th>Purpose / nursing point</th></tr></thead>
      <tbody>
        <tr><td>Ultrasound</td><td>Any</td><td>Dating, viability, anomaly scan (18–20 wk), placental location. Full bladder needed for early transabdominal scans</td></tr>
        <tr><td><b>Chorionic villus sampling</b></td><td><b>10–13 weeks</b></td><td>Earlier result, chromosomal only; small limb-defect and miscarriage risk</td></tr>
        <tr><td><b>Amniocentesis</b></td><td><b>15–20 weeks</b> (or 3rd trim. for lung maturity)</td><td>Chromosomes + <b>AFP</b> + <b>L/S ratio ≥2 = mature lungs</b>. Empty bladder before the later procedure; monitor FHR and contractions after; give <b>Rho(D) immune globulin if Rh-negative</b></td></tr>
        <tr><td>Maternal serum AFP / quad screen</td><td>15–20 weeks</td><td>↑ AFP → neural-tube defect; ↓ AFP → Down syndrome</td></tr>
        <tr><td>1-hour 50 g glucose challenge</td><td><b>24–28 weeks</b></td><td>Screening. If abnormal → <b>3-hour 100 g OGTT</b> confirms GDM</td></tr>
        <tr><td>Group B streptococcus swab</td><td><b>35–37 weeks</b></td><td>If positive → <b>IV penicillin in labour</b></td></tr>
        <tr><td>Non-stress test (NST)</td><td>3rd trimester</td><td><b>Reactive = reassuring</b>: ≥2 accelerations of ≥15 bpm lasting ≥15 s in 20 min</td></tr>
        <tr><td>Contraction stress test (CST)</td><td>3rd trimester</td><td><b>Negative = good</b> (no late decelerations). Positive = late decelerations → uteroplacental insufficiency</td></tr>
        <tr><td>Biophysical profile</td><td>3rd trimester</td><td>5 components × 2 points; 8–10 reassuring, ≤4 → deliver</td></tr>
      </tbody>
    </table>
    <div class="sum-key">
      <span class="sum-key-title">نقاط امتحانية</span>
      <ul>
        <li>Reactive NST and <b>negative</b> CST are the reassuring results — the wording is deliberately confusing.</li>
        <li><b>L/S ratio 2:1</b> = fetal lung maturity. <b>Dexamethasone/betamethasone</b> is given to the mother to <b>promote fetal lung maturation</b>.</li>
      </ul>
    </div>
  </section>

  <section class="topic" id="m-complications" dir="ltr">
    <h3>4. High-Risk Pregnancy</h3>
    <h4>Hypertensive disorders</h4>
    <ul>
      <li><b>Gestational hypertension</b>: BP ≥140/90 after 20 weeks, <b>no</b> proteinuria</li>
      <li><b>Pre-eclampsia</b>: hypertension + proteinuria (or end-organ signs) after 20 weeks. Severe features: BP ≥160/110, <b>headache, visual disturbance, epigastric/RUQ pain, hyperreflexia, oliguria, thrombocytopenia</b></li>
      <li><b>Eclampsia</b> = pre-eclampsia + <b>seizure</b>. <b>HELLP</b> = Haemolysis, Elevated Liver enzymes, Low Platelets</li>
      <li>Management: quiet dim room, left lateral, seizure precautions, <b>magnesium sulfate</b> for seizure prophylaxis, antihypertensives (labetalol, hydralazine, methyldopa/nifedipine). <b>Definitive treatment = delivery</b></li>
      <li><b>Magnesium toxicity</b>: loss of the <b>patellar/deep tendon reflex first</b>, then RR &lt;12, urine output &lt;30 mL/h, ↓ LOC → stop the infusion and give the antidote <b>calcium gluconate</b></li>
    </ul>
    <h4>Endocrine &amp; medical conditions</h4>
    <ul>
      <li><b>GDM</b>: diet first, then <b>insulin</b> if uncontrolled. Risks — macrosomia, shoulder dystocia, birth trauma, <b>neonatal hypoglycaemia</b>, RDS (insulin suppresses surfactant), polyhydramnios</li>
      <li><b>Hypothyroidism</b> in pregnancy → <b>preterm labour</b>, miscarriage, impaired fetal neurodevelopment; continue and often increase levothyroxine</li>
      <li><b>Hyperthyroidism</b> in pregnancy → <b>pre-eclampsia</b>, preterm birth, thyroid storm; treat with propylthiouracil in the first trimester</li>
      <li><b>Rh incompatibility</b>: Rh-negative mother, Rh-positive fetus → give <b>Rho(D) immune globulin at 28 weeks and within 72 hours of delivery</b>, and after any bleeding, amniocentesis, abortion or ectopic. Indirect Coombs on the mother, direct Coombs on the baby</li>
      <li><b>TORCH</b> infections: Toxoplasmosis, Other (syphilis, varicella, parvovirus), Rubella, Cytomegalovirus, Herpes — all cause congenital anomalies. Rubella vaccine is <b>contraindicated in pregnancy</b> and is given <b>postpartum</b>, avoiding pregnancy for 28 days</li>
    </ul>
    <h4>Other complications</h4>
    <ul>
      <li><b>Ectopic pregnancy</b>: unilateral lower abdominal pain, <b>adnexal tenderness</b>, vaginal spotting, positive pregnancy test, no intrauterine sac on scan → risk of rupture and shock; surgical or methotrexate management</li>
      <li><b>Hydatidiform (molar) pregnancy</b>: <b>very high hCG</b>, uterus larger than dates, grape-like vesicles, no fetal heart, hyperemesis, early pre-eclampsia → evacuation + <b>hCG follow-up for a year</b>, avoid pregnancy during follow-up</li>
      <li><b>Incompetent cervix</b>: painless dilatation in the 2nd trimester → <b>cerclage</b></li>
      <li><b>Preterm labour</b> (20–37 wk): tocolytics, <b>corticosteroids for lung maturity</b>, magnesium sulfate for neuroprotection</li>
      <li><b>PROM</b>: check for cord prolapse, temperature and fetal heart; nitrazine paper turns <b>blue</b> (alkaline amniotic fluid); infection risk rises after 24 h</li>
    </ul>
    <div class="sum-key">
      <span class="sum-key-title">نقاط امتحانية</span>
      <ul>
        <li>Hypothyroid mother → <b>preterm labour</b>. Hyperthyroid mother → <b>pre-eclampsia</b>. These two are asked as a pair.</li>
        <li>The <b>first</b> sign of magnesium toxicity is loss of the deep tendon reflexes; the antidote is <b>calcium gluconate</b>.</li>
        <li>GDM makes labour more <b>difficult</b> (macrosomia, shoulder dystocia), not faster or easier.</li>
      </ul>
    </div>
  </section>

  <section class="topic" id="m-bleeding" dir="ltr">
    <h3>5. Antepartum Haemorrhage</h3>
    <table>
      <thead><tr><th></th><th>Placenta previa</th><th>Abruptio placentae</th></tr></thead>
      <tbody>
        <tr><td>Definition</td><td>Placenta implanted in the <b>lower uterine segment</b>, near or over the cervical os instead of the fundus</td><td><b>Premature separation</b> of a normally implanted placenta before the fetus is born</td></tr>
        <tr><td>Bleeding</td><td><b>Painless</b>, bright red, sudden</td><td><b>Painful</b>, dark red; may be concealed</td></tr>
        <tr><td>Uterus</td><td>Soft, non-tender, relaxed</td><td><b>Rigid, board-like, very tender</b></td></tr>
        <tr><td>Risk factors</td><td>Previous C-section/uterine scar, multiparity, advanced age, smoking</td><td><b>Hypertension</b>, trauma, cocaine, PROM, short cord</td></tr>
        <tr><td>Key nursing rule</td><td><b>NO vaginal examination</b> — it can cause massive haemorrhage. Ultrasound first</td><td>Watch for <b>DIC</b> and shock; prepare for emergency delivery</td></tr>
      </tbody>
    </table>
    <ul>
      <li>Any third-trimester bleeding: large-bore IV, type and cross-match, continuous fetal monitoring, left lateral position, count and weigh pads, <b>no vaginal exam until previa is excluded</b></li>
    </ul>
  </section>

  <section class="topic" id="m-labor" dir="ltr">
    <h3>6. Labour: Stages &amp; the 5 Ps</h3>
    <h4>True vs false labour</h4>
    <table>
      <thead><tr><th></th><th>True labour</th><th>False labour</th></tr></thead>
      <tbody>
        <tr><td>Contractions</td><td>Regular, increasing in frequency, duration and intensity</td><td>Irregular, do not intensify</td></tr>
        <tr><td>Pain site</td><td>Starts in the <b>back</b> and radiates to the abdomen</td><td>Abdomen/groin only</td></tr>
        <tr><td>Walking</td><td><b>Intensifies</b> the contractions</td><td>Relieves them</td></tr>
        <tr><td>Cervix</td><td><b>Progressive dilatation and effacement</b></td><td>No change</td></tr>
      </tbody>
    </table>
    <h4>Stages of labour</h4>
    <ul>
      <li><b>First stage</b> — onset of true labour to <b>full dilatation (10 cm)</b>
        <ul>
          <li><b>Latent</b> 0–3 cm — mild contractions <b>every 15–30 min</b>; talkative, excited. The <b>longest</b> phase</li>
          <li><b>Active</b> 4–7 cm — moderate contractions <b>every 3–5 min, lasting 30–60 s</b>; serious, focused, needs coaching (a woman at <b>6 cm is in the first stage</b>)</li>
          <li><b>Transition</b> 8–10 cm — strong contractions <b>every 2–3 min, lasting 60–90 s</b>; irritable, nausea, rectal pressure, urge to push, shaking</li>
        </ul>
      </li>
      <li><b>Second stage</b> — full dilatation to <b>birth of the baby</b>; pushing, crowning</li>
      <li><b>Third stage</b> — birth of the baby to <b>delivery of the placenta</b> (usually 5–30 min). Signs of separation: gush of blood, lengthening cord, uterus changes from oval to <b>globular</b> and firm. Beyond <b>30 minutes it is a retained placenta</b>. Always examine the placenta for completeness and confirm the cord has <b>two arteries and one vein</b> — a single artery is associated with congenital anomalies</li>
      <li><b>Fourth stage</b> — the first <b>1–4 hours</b> after delivery; the highest risk period for <b>haemorrhage</b>. Check fundus, lochia, BP and pulse every 15 min in the first hour</li>
    </ul>
    <h4>The 5 Ps affecting labour</h4>
    <ul>
      <li><b>P</b>assenger (fetus: size, lie, presentation, position, attitude) · <b>P</b>assageway (pelvis and soft tissue) · <b>P</b>owers (contractions and pushing) · <b>P</b>osition of the mother · <b>P</b>sychological response</li>
      <li><b>Effacement</b> = <b>thinning/shortening of the cervix</b> (%) · <b>Dilatation</b> = opening of the os (cm)</li>
      <li><b>Station</b> = the presenting part relative to the <b>ischial spines</b>, from <b>−5 (high) through 0 to +5 (crowning)</b>. <b>Station 0 = engaged</b>. Engagement happens at about <b>38 weeks in a nullipara</b>, but may not occur until labour starts in a multipara</li>
      <li>Fetal head: <b>biparietal diameter 9.25 cm</b> at term (the largest transverse diameter); <b>general flexion</b> — chin on chest — presents the smallest diameter. <b>Moulding</b> lets the skull bones overlap to fit the birth canal</li>
    </ul>
    <h4>Assessing contractions — the normal numbers</h4>
    <table>
      <thead><tr><th>Parameter</th><th>Definition</th><th>Normal</th><th>Worrying</th></tr></thead>
      <tbody>
        <tr><td><b>Frequency</b></td><td>Start of one contraction to the <b>start</b> of the next</td><td>2–5 in 20 minutes</td><td>More often than every <b>2 minutes</b></td></tr>
        <tr><td><b>Duration</b></td><td>Start to end of the <b>same</b> contraction</td><td>45–80 seconds</td><td>Longer than <b>90 seconds</b></td></tr>
        <tr><td><b>Intensity</b></td><td>Strength at the peak (palpate the fundus: nose = mild, chin = moderate, forehead = strong)</td><td>25–50 mmHg</td><td>Above <b>80 mmHg</b></td></tr>
        <tr><td><b>Resting tone</b></td><td>Tension <b>between</b> contractions — this is when the fetus is oxygenated</td><td>~10 mmHg, uterus feels <b>soft</b></td><td>Above <b>20 mmHg</b> or a uterus that stays firm</td></tr>
      </tbody>
    </table>
    <ul>
      <li><b>Intensity and resting tone can only be measured accurately by an internal IUPC</b>; external monitoring gives frequency and duration only, and intensity by palpation</li>
      <li><b>Tachysystole/hypertonic labour</b>: more than 5 contractions in 10 minutes, duration &gt;90 s, or a resting tone that never relaxes → <b>stop oxytocin</b>, left lateral, O₂, IV fluids, notify</li>
    </ul>
    <h4>Emergencies in labour</h4>
    <ul>
      <li><b>Prolapsed cord</b>: <b>call for help, glove up and lift the presenting part off the cord</b>, place the mother in <b>knee-chest or Trendelenburg</b>, give O₂, keep the cord moist, prepare for immediate C-section. Never push the cord back</li>
      <li><b>Shoulder dystocia</b>: <b>McRoberts manoeuvre</b> (hyperflex the thighs onto the abdomen) + <b>suprapubic</b> (not fundal) pressure</li>
      <li><b>Uterine rupture</b>: sudden sharp pain, loss of contractions, fetal bradycardia, shock → emergency laparotomy</li>
      <li><b>Amniotic fluid embolism</b>: sudden dyspnoea, cyanosis, hypotension, DIC → resuscitate, O₂, CPR</li>
    </ul>
    <div class="sum-key">
      <span class="sum-key-title">نقاط امتحانية</span>
      <ul>
        <li>Contractions every 3 minutes lasting 60–90 s with severe pain radiating to the symphysis = <b>active first stage</b>.</li>
        <li>Caesarean section requires: informed consent, IV access, <b>indwelling urinary catheter</b>, abdominal preparation, and a cross-matched blood sample.</li>
        <li>After an epidural the first complication to watch for is <b>maternal hypotension</b> → preload with IV fluid, left lateral, ephedrine if needed.</li>
      </ul>
    </div>
  </section>

  <section class="topic" id="m-fetal" dir="ltr">
    <h3>7. Fetal Monitoring</h3>
    <ul>
      <li><b>Normal baseline FHR = 110–160 bpm</b> (the notes often quote 120–160). Bradycardia &lt;110, tachycardia &gt;160 for &gt;10 minutes</li>
      <li><b>External</b> monitoring (ultrasound transducer + tocodynamometer) is non-invasive and can be used with intact membranes, but moves with the mother and gives no true intensity. <b>Internal</b> monitoring (fetal scalp electrode + IUPC) is accurate and measures intensity, but <b>requires ruptured membranes</b> and carries an infection risk</li>
      <li><b>Accelerations</b> — always reassuring. Defined as a rise of <b>15 bpm for 15 seconds after 32 weeks</b>, but only <b>10 bpm for 10 seconds before 32 weeks</b>. A rise lasting more than 10 minutes is a change in baseline, not an acceleration</li>
    </ul>
    <h4>Variability — the best single indicator of fetal well-being</h4>
    <table>
      <thead><tr><th>Grade</th><th>Amplitude</th><th>Means</th></tr></thead>
      <tbody>
        <tr><td><b>Absent</b></td><td>Undetectable — a flat line</td><td><b>Fetal hypoxaemia</b>; the fetus is not tolerating labour. Most concerning</td></tr>
        <tr><td><b>Minimal</b></td><td>&lt;5 bpm</td><td>Fetal sleep cycle, maternal opioids or magnesium, prematurity, or hypoxia</td></tr>
        <tr><td><b>Moderate</b></td><td><b>6–25 bpm</b></td><td><b>Normal — the most desired finding</b></td></tr>
        <tr><td><b>Marked</b></td><td>&gt;25 bpm</td><td>Cause uncertain; may follow acute hypoxia or cord compression</td></tr>
      </tbody>
    </table>
    <table>
      <thead><tr><th>Deceleration</th><th>Shape / timing</th><th>Cause</th><th>Action</th></tr></thead>
      <tbody>
        <tr><td><b>Early</b></td><td>Mirrors the contraction, nadir with the peak</td><td><b>H</b>ead compression</td><td>Benign — continue to observe</td></tr>
        <tr><td><b>Variable</b></td><td>V/W-shaped, no relation to contractions</td><td><b>C</b>ord compression</td><td><b>Reposition</b> the mother (left lateral/knee-chest), O₂, amnioinfusion; check for prolapse</td></tr>
        <tr><td><b>Late</b></td><td>Begins after the peak, returns after the contraction ends</td><td><b>P</b>lacental insufficiency — the ominous one</td><td><b>STOP oxytocin</b>, turn to the left side, O₂ 8–10 L by mask, IV fluid bolus, notify the provider, prepare for delivery</td></tr>
      </tbody>
    </table>
    <div class="sum-callout"><b>Memory:</b> <b>VEAL CHOP</b> — <b>V</b>ariable/<b>C</b>ord, <b>E</b>arly/<b>H</b>ead, <b>A</b>ccelerations/<b>O</b>K, <b>L</b>ate/<b>P</b>lacental insufficiency.</div>
    <div class="sum-key">
      <span class="sum-key-title">نقاط امتحانية</span>
      <ul>
        <li>For <b>late</b> decelerations the first nursing action is to <b>reposition to the left side and stop oxytocin</b> — before oxygen, before calling.</li>
        <li>Variable decelerations are graded <b>Category II</b> and are managed by position change first.</li>
      </ul>
    </div>
  </section>

  <section class="topic" id="m-drugs" dir="ltr">
    <h3>8. Drugs Used in Labour &amp; Postpartum</h3>
    <table>
      <thead><tr><th>Drug</th><th>Use</th><th>Key nursing point</th></tr></thead>
      <tbody>
        <tr><td><b>Oxytocin (Pitocin)</b></td><td>Induce/augment labour; control PPH</td><td>Monitor contractions and FHR continuously; <b>stop</b> for tachysystole or late decelerations. Risk of water intoxication</td></tr>
        <tr><td><b>Methylergonovine (Methergine)</b></td><td>Postpartum haemorrhage</td><td><b>Check the BP first — contraindicated in hypertension</b></td></tr>
        <tr><td><b>Magnesium sulfate</b></td><td>Seizure prophylaxis in pre-eclampsia; tocolysis</td><td>Monitor <b>reflexes, RR &gt;12, urine output &gt;30 mL/h</b>; antidote <b>calcium gluconate</b></td></tr>
        <tr><td><b>Betamethasone / dexamethasone</b></td><td>Fetal lung maturity 24–34 wk</td><td><b>Promotes surfactant production</b>; 2 doses 24 h apart</td></tr>
        <tr><td><b>Terbutaline</b></td><td>Tocolysis</td><td>Maternal tachycardia; hold if HR &gt;120</td></tr>
        <tr><td><b>Rho(D) immune globulin</b></td><td>Rh-negative mother</td><td>28 weeks and within <b>72 h</b> of delivery</td></tr>
        <tr><td><b>Vitamin K (phytonadione)</b></td><td>Every newborn</td><td><b>0.5–1 mg IM</b> in the vastus lateralis at birth — prevents haemorrhagic disease</td></tr>
        <tr><td><b>Erythromycin eye ointment</b></td><td>Every newborn</td><td>Prevents ophthalmia neonatorum; may be delayed ~1 h for bonding</td></tr>
      </tbody>
    </table>
  </section>

  <section class="topic" id="m-newborn" dir="ltr">
    <h3>9. Newborn Assessment &amp; Care</h3>
    <h4>APGAR — at 1 and 5 minutes</h4>
    <table>
      <thead><tr><th>Sign</th><th>0</th><th>1</th><th>2</th></tr></thead>
      <tbody>
        <tr><td><b>A</b>ppearance (colour)</td><td>Blue/pale</td><td>Body pink, extremities blue</td><td>Completely pink</td></tr>
        <tr><td><b>P</b>ulse</td><td>Absent</td><td>&lt;100</td><td>&gt;100</td></tr>
        <tr><td><b>G</b>rimace (reflex)</td><td>None</td><td>Grimace</td><td>Cry, cough, sneeze</td></tr>
        <tr><td><b>A</b>ctivity (tone)</td><td>Limp</td><td>Some flexion</td><td>Active motion</td></tr>
        <tr><td><b>R</b>espiration</td><td>Absent</td><td>Slow, irregular, weak cry</td><td>Good, strong cry</td></tr>
      </tbody>
    </table>
    <ul>
      <li><b>7–10</b> = good condition · <b>4–6</b> = moderately depressed, needs stimulation and O₂ · <b>0–3</b> = severely depressed, resuscitate</li>
      <li><b>Acrocyanosis</b> (blue hands and feet) is <b>normal</b> in the first 24–48 h; <b>central cyanosis is not</b></li>
    </ul>
    <h4>Immediate priorities after birth</h4>
    <div class="sum-algo">
      <span class="sum-algo-title">First actions</span>
      <ol>
        <li><b>Establish and maintain a patent airway</b> — suction the <b>mouth before the nose</b> as soon as the head is delivered (stimulating the nose first causes a gasp and aspiration)</li>
        <li>Dry thoroughly and remove the wet linen — <b>prevent heat loss</b></li>
        <li>Skin-to-skin with the mother under a warm blanket, hat on</li>
        <li>Clamp/cut the cord, APGAR, identification bands, vitamin K and eye prophylaxis</li>
      </ol>
    </div>
    <h4>Heat loss</h4>
    <table>
      <thead><tr><th>Mechanism</th><th>Example</th><th>Prevention</th></tr></thead>
      <tbody>
        <tr><td><b>Evaporation</b></td><td>Wet skin/amniotic fluid after birth or a bath</td><td><b>Dry the baby immediately</b> and remove wet linen</td></tr>
        <tr><td><b>Conduction</b></td><td>Cold scale, cold mattress, cold hands</td><td>Pre-warm surfaces, cover the scale</td></tr>
        <tr><td><b>Convection</b></td><td>Draught from a fan, air conditioner or open door</td><td>Keep away from draughts, control room temperature</td></tr>
        <tr><td><b>Radiation</b></td><td>Cot next to a cold window or outside wall</td><td>Move the cot away from cold surfaces</td></tr>
      </tbody>
    </table>
    <ul>
      <li>Newborns cannot shiver — they use <b>non-shivering thermogenesis (brown fat)</b>; cold stress → hypoglycaemia, acidosis and respiratory distress</li>
    </ul>
    <h4>Normal newborn values &amp; findings</h4>
    <ul>
      <li>HR <b>120–160</b> bpm · RR <b>30–60</b> /min, irregular with short pauses · Temperature <b>36.5–37.5 °C</b> axillary · Weight <b>2.5–4 kg</b>; loses up to <b>10%</b> in the first week and regains it by 10–14 days</li>
      <li>Fontanelles: <b>anterior</b> diamond, closes at <b>12–18 months</b>; <b>posterior</b> triangle, closes at <b>2–3 months</b>. <b>Sunken</b> = dehydration, <b>bulging</b> = raised ICP</li>
      <li>Normal findings: milia, Mongolian spots, erythema toxicum, vernix, lanugo, caput succedaneum (crosses suture lines, resolves in days) vs <b>cephalohaematoma</b> (does <b>not</b> cross suture lines, resolves in weeks, jaundice risk)</li>
      <li>First stool <b>meconium within 24 h</b>; first void within 24 h</li>
    </ul>
    <h4>Reflexes</h4>
    <ul>
      <li><b>Moro (startle)</b> — disappears ~4–6 months · <b>Rooting &amp; sucking</b> — ~4 months · <b>Palmar grasp</b> — ~3–4 months · <b>Plantar grasp</b> — ~9 months · <b>Babinski (fanning toes)</b> — <b>normal until ~1–2 years</b> · <b>Tonic neck (fencing)</b> — ~3–4 months · <b>Stepping</b> — ~4 weeks</li>
      <li>An <b>asymmetric Moro</b> suggests a fractured clavicle or brachial plexus injury</li>
    </ul>
    <h4>Hyperbilirubinaemia</h4>
    <ul>
      <li><b>Physiological jaundice</b>: appears <b>after 24 hours</b>, peaks day 3–5, resolves within a week</li>
      <li><b>Pathological jaundice</b>: appears <b>within the first 24 hours</b> — always abnormal (haemolysis, ABO/Rh incompatibility, sepsis)</li>
      <li><b>Breastfeeding jaundice</b> (early, from inadequate intake) → <b>feed more often, 8–12 times a day</b>; do <b>not</b> stop breastfeeding or give water</li>
      <li>Phototherapy: eyes covered, minimal clothing, turn frequently, extra fluids, monitor temperature and stools (loose green)</li>
      <li><b>Kernicterus</b> = bilirubin encephalopathy — the complication being prevented</li>
    </ul>
    <div class="sum-key">
      <span class="sum-key-title">نقاط امتحانية</span>
      <ul>
        <li>Immediately after the head is delivered the priority is to <b>suction the mouth then the nose</b> to establish a clear airway and a good cry.</li>
        <li>Heat loss by <b>evaporation</b> is prevented by <b>drying the newborn at once</b> — the single most asked newborn item.</li>
        <li>Skin-to-skin contact <b>regulates the temperature of both mother and baby</b> and facilitates early breastfeeding.</li>
        <li>Give <b>egg yolk</b> (not egg white) at around 8 months — whites are withheld until 12 months because of allergy.</li>
      </ul>
    </div>
  </section>

  <section class="topic" id="m-postpartum" dir="ltr">
    <h3>10. Postpartum Assessment &amp; Complications</h3>
    <h4>BUBBLE-HE</h4>
    <ul>
      <li><b>B</b>reasts · <b>U</b>terus (fundus) · <b>B</b>ladder · <b>B</b>owel · <b>L</b>ochia · <b>E</b>pisiotomy/perineum · <b>H</b>oman's sign/DVT · <b>E</b>motional state</li>
      <li><b>Fundus</b>: firm, midline, at the umbilicus right after delivery, then <b>descends ~1 cm (1 fingerbreadth) per day</b>; not palpable by day 10</li>
      <li>A <b>boggy fundus displaced to the right</b> = <b>full bladder</b> → have the mother void (or catheterise), then re-assess</li>
      <li><b>Lochia</b>: <b>rubra</b> (dark red, days 1–3) → <b>serosa</b> (pink/brown, days 4–10) → <b>alba</b> (white/yellow, up to 6 weeks). Should never return to bright red, never have a foul odour, never contain large clots</li>
      <li>Saturating a perineal pad in <b>less than 1 hour</b> is excessive bleeding</li>
    </ul>
    <h4>Postpartum haemorrhage</h4>
    <ul>
      <li>Definition: <b>&gt;500 mL</b> after vaginal delivery or <b>&gt;1000 mL</b> after caesarean</li>
      <li>Causes — the <b>4 Ts</b>: <b>T</b>one (uterine atony, the commonest), <b>T</b>rauma (laceration), <b>T</b>issue (retained placenta), <b>T</b>hrombin (coagulopathy)</li>
      <li><b>First action = massage the fundus</b>. If it firms up and bleeding slows, the cause was atony. If it is <b>already firm</b> and bright red bleeding continues → suspect a <b>laceration</b> → notify the provider</li>
      <li>Then: empty the bladder, oxytocin infusion, methylergonovine (check BP), carboprost, bimanual compression, fluids, type and cross-match</li>
      <li>Late PPH (24 h – 6 weeks) is usually <b>retained placental fragments</b> or subinvolution</li>
    </ul>
    <h4>Postpartum infection &amp; other complications</h4>
    <ul>
      <li><b>Endometritis</b>: fever &gt;38 °C after the first 24 h, uterine tenderness, <b>foul-smelling lochia</b>, tachycardia → cultures + IV antibiotics</li>
      <li><b>Mastitis</b>: usually unilateral, a red, hot, wedge-shaped tender area, fever, flu-like symptoms → <b>continue breastfeeding or pump</b>, warm compress before feeding, antibiotics, rest and fluids</li>
      <li><b>UTI</b> and <b>wound infection</b> are common; <b>DVT</b> presents with unilateral calf pain, warmth and swelling</li>
      <li><b>Postpartum blues</b>: days 3–5, mild, self-limiting, resolves within 2 weeks — needs reassurance. <b>Postpartum depression</b>: lasts &gt;2 weeks, impairs function — needs treatment. <b>Postpartum psychosis</b>: hallucinations/delusions, risk of harm to the infant — <b>a psychiatric emergency, never leave the mother alone with the baby</b></li>
    </ul>
    <div class="sum-key">
      <span class="sum-key-title">نقاط امتحانية</span>
      <ul>
        <li>Before giving <b>methylergonovine</b> for PPH the priority assessment is the <b>blood pressure</b>.</li>
        <li>A saturated pad with a <b>firm</b> fundus on postpartum day 2 points to a <b>cervical/vaginal laceration</b>, not atony.</li>
        <li>The <b>fourth stage / first hour</b> is when haemorrhage is most likely — check fundus and lochia every 15 minutes.</li>
      </ul>
    </div>
  </section>

  <section class="topic" id="m-feeding" dir="ltr">
    <h3>11. Breastfeeding &amp; Formula</h3>
    <ul>
      <li><b>Exclusive breastfeeding for the first 6 months</b>, then complementary foods with continued breastfeeding to 2 years</li>
      <li><b>Colostrum</b> (first 2–4 days): yellow, thick, rich in <b>protein and IgA antibodies</b>, laxative effect; mature milk comes in day 3–5</li>
      <li>Signs of adequate intake: <b>6–8 wet nappies a day</b>, regular stools, audible swallowing, weight regained by 2 weeks, contented baby after feeds</li>
      <li>Correct latch: the baby takes the <b>whole areola</b>, not just the nipple — a poor latch is the cause of sore/cracked nipples</li>
      <li>Feed <b>8–12 times a day</b> on demand; empty one breast before offering the other; break suction with a clean finger</li>
      <li>Engorgement → feed frequently, warm compress <b>before</b> feeding, cold compress after; do not skip feeds</li>
      <li>Breastfeeding also promotes <b>uterine involution</b> (oxytocin release) and reduces PPH</li>
      <li>Formula: <b>never microwave</b> a bottle (uneven heating and burns) — warm in a bowl of warm water and test on the wrist. Hold the baby <b>semi-upright</b>, keep the teat full of milk, never prop the bottle, discard leftover milk after a feed, no honey before 1 year</li>
      <li>Store breast milk: ~4 hours at room temperature, ~4 days in the fridge, ~6 months in the freezer; thaw in the fridge or warm water, never boiling or microwave</li>
    </ul>
    <div class="sum-key">
      <span class="sum-key-title">نقاط امتحانية</span>
      <ul>
        <li>"I will put the bottle in the microwave if it came out of the fridge" is the statement that shows the mother <b>needs more teaching</b>.</li>
        <li>Breast milk protects the newborn mainly through <b>secretory IgA</b>.</li>
      </ul>
    </div>
  </section>

  <section class="topic" id="m-repro" dir="ltr">
    <h3>12. Contraception &amp; Reproductive Health</h3>
    <ul>
      <li><b>Copper IUD</b>: effective for up to 10 years, hormone-free, can be used while breastfeeding. <b>Disadvantages — heavier, longer and more painful periods</b>, plus risk of expulsion, PID in the first weeks and perforation. Teach the woman to check the string monthly and report fever, pain, or a missing string</li>
      <li><b>Combined oral contraceptives</b>: contraindicated in smokers &gt;35 years, migraine with aura, history of thromboembolism, breast cancer, uncontrolled hypertension. Warning signs = <b>ACHES</b> (Abdominal pain, Chest pain, Headache, Eye problems, Severe leg pain)</li>
      <li><b>Progestin-only pill / implant / depot</b>: safe while breastfeeding; depot may cause irregular bleeding and reduced bone density</li>
      <li><b>Lactational amenorrhoea</b> only works if fully breastfeeding, amenorrhoeic, and &lt;6 months postpartum</li>
      <li>Menstrual cycle: ovulation occurs about <b>14 days before</b> the next period; the ovum survives ~24 h and sperm ~72 h. Basal body temperature <b>rises 0.3–0.6 °C after</b> ovulation</li>
      <li><b>Menopause</b> = 12 consecutive months of amenorrhoea; hot flushes, vaginal dryness, osteoporosis risk → calcium, vitamin D and weight-bearing exercise</li>
      <li>Infertility work-up: the simplest and <b>first</b> test is <b>semen analysis</b>, then ovulation confirmation (mid-luteal progesterone), then tubal patency (HSG)</li>
      <li><b>Cervical cancer screening</b>: Pap smear — no douching, intercourse or vaginal medication for 24–48 h before; do not schedule during menstruation. HPV vaccine is primary prevention</li>
    </ul>
    <div class="sum-key">
      <span class="sum-key-title">نقاط امتحانية</span>
      <ul>
        <li>The named disadvantage of the copper IUD is <b>increased menstrual bleeding and cramping</b>.</li>
        <li>An asymptomatic positive chlamydia result found on routine screening is described as <b>sub-clinical</b> disease.</li>
        <li>In an infertility work-up, <b>semen analysis</b> comes before invasive female testing.</li>
      </ul>
    </div>
  </section>
</div>
`;
