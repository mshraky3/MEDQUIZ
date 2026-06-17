// Obstetrics & Gynecology topic summary — HTML served (gated) to the viewer.
// Built to match the surgery/pediatrics example decks, grounded in the SMLE
// recall collections in /content (Confirmed/Probably Confirmed Gyn).
// Angle brackets in clinical text are HTML-escaped (&lt; / &gt;).
export default `
<div class="sum-doc" dir="rtl">
  <div class="sum-head">
    <h2>النساء والولادة — ملخص عالي العائد (SMLE)</h2>
    <p class="sum-meta">يغطي الرعاية قبل الولادة · اضطرابات الضغط الحملي · المخاض والولادة · النزف · تمزق الأغشية والخداج · نمو الجنين · ما بعد الولادة · موانع الحمل · أمراض النساء والأورام · الحمل المبكر. للمراجعة الامتحانية فقط.</p>
  </div>

  <section class="topic" dir="ltr">
    <h3>1. Antenatal Care &amp; Screening</h3>
    <ul>
      <li><b>GDM screening</b> at booking if BMI ≥ <b>25</b> with risk factors (general threshold answer in recalls = 25)</li>
      <li><b>Folic acid</b>: standard <b>400 µg</b> (0.4 mg) preconception; <b>5 mg</b> only if high risk — previous NTD baby, diabetes, on anti-epileptics with personal NTD risk. (A cousin with spina bifida + seizure-free on lamotrigine → still 400 µg + multivitamin)</li>
      <li>Preconception vitamin D ≈ 600 IU</li>
      <li>Live vaccines contraindicated in pregnancy (MMR, varicella, <b>HPV</b>); flu (inactivated) &amp; Tdap are given</li>
      <li>X-ray performed before pregnancy recognised → next step is to <b>determine fetal gestational age</b> (assess dose/risk), not proceed blindly</li>
    </ul>
  </section>

  <section class="topic" dir="ltr">
    <h3>2. Rh / Red-cell Alloimmunisation</h3>
    <ul>
      <li>Positive antibody titer (e.g. anti-E/anti-D 1:16) at <b>week 11</b> → <b>follow-up in 4 weeks</b> (cannot do MCA Doppler this early; don't repeat a titer once critical ≥1:16)</li>
      <li>At <b>week 16+</b> with critical titer (≥1:16) → <b>MCA Doppler</b> to detect fetal anaemia</li>
      <li>Anti-D immunoglobulin: routine at 28 weeks + within 72 h of delivery/sensitising events (Rh-negative mother)</li>
    </ul>
  </section>

  <section class="topic" dir="ltr">
    <h3>3. Hypertensive Disorders of Pregnancy</h3>
    <ul>
      <li>Pre-eclampsia = new HTN ≥20 wks + proteinuria/end-organ features; severe ≥160/110 + headache/visual symptoms</li>
      <li><b>Acute</b> severe HTN treatment: IV <b>Labetalol</b> or <b>Hydralazine</b> (or oral nifedipine) — NOT sodium nitroprusside/methyldopa for acute control</li>
      <li>Eclampsia / seizure prophylaxis → <b>Magnesium sulfate</b>; definitive treatment of pre-eclampsia = delivery</li>
      <li>Chronic HTN before pregnancy (e.g. 150/95) → <b>start antihypertensive before conceiving</b> (don't just delay)</li>
      <li>Resolved gestational HTN postpartum: BP 133/88 → treat if it remains high; if normal (120/80) → annual BP check (↑ lifetime chronic-HTN risk)</li>
    </ul>
  </section>

  <section class="topic" dir="ltr">
    <h3>4. Labour &amp; Delivery</h3>
    <ul>
      <li>Stages: 1st (latent &lt;6 cm / active 6→10 cm), 2nd (full dilation→delivery), 3rd (placenta)</li>
      <li>Slow progress, strong contractions, intact membranes (e.g. 4→5 cm over 4 h, fully effaced) → <b>Amniotomy</b></li>
      <li>Early latent / irregular contractions, no cervical change after observation → reassure, <b>return when in active labour</b></li>
      <li>Maternal exhaustion, fetus engaged +2, late decels/minimal variability → <b>operative vaginal delivery</b> (forceps/ventouse); higher station / non-reassuring earlier → CS</li>
      <li><b>Shoulder dystocia</b>: first manoeuvre = <b>suprapubic pressure</b> + McRoberts (then Rubin/Woods)</li>
      <li>Breech at 36 wks → <b>external cephalic version at 37 weeks</b></li>
      <li>Post-term (≥41 wks): main maternal risk = <b>caesarean section</b> (and instrumental delivery)</li>
      <li>Macrosomia / GDM increase shoulder dystocia risk</li>
    </ul>
  </section>

  <section class="topic" dir="ltr">
    <h3>5. Antepartum Haemorrhage</h3>
    <table>
      <thead><tr><th></th><th>Placenta praevia</th><th>Abruption</th></tr></thead>
      <tbody>
        <tr><td>Pain</td><td>painless</td><td><b>painful</b>, tender uterus</td></tr>
        <tr><td>Bleeding</td><td>bright red, may be heavy</td><td>may be concealed</td></tr>
        <tr><td>Mgmt</td><td>no vaginal exam; pelvic rest, avoid intercourse; CS if symptomatic</td><td>resuscitate; unstable/fetal distress → urgent delivery</td></tr>
      </tbody>
    </table>
    <ul>
      <li>Unstable mother + ongoing bleeding + reassuring CTG (e.g. 33 wks) → resuscitate; most appropriate = <b>CS after one dose of dexamethasone</b>; if hypotensive the INITIAL step is <b>blood transfusion/resuscitation</b></li>
    </ul>
  </section>

  <section class="topic" dir="ltr">
    <h3>6. PROM / PPROM &amp; Preterm</h3>
    <ul>
      <li>PPROM &lt;34 wks, stable, no infection → <b>antibiotics</b> (latency, e.g. erythromycin) + <b>antenatal steroids</b> ± expectant management; antibiotics reduce neonatal <b>RDS</b> when given to gain steroid latency at early GA</li>
      <li>At <b>34 wks and above</b>, ruptured membranes (e.g. 6 h, meconium-stained, FGR) → <b>induction of labour</b> (prophylactic antibiotics generally not needed at ≥34 wks)</li>
      <li>Intrapartum infection prophylaxis after prolonged ROM (24 h) → <b>Clindamycin + Gentamicin</b></li>
      <li>CS antibiotic prophylaxis → <b>60 minutes before incision</b></li>
    </ul>
  </section>

  <section class="topic" dir="ltr">
    <h3>7. Fetal Growth &amp; Wellbeing</h3>
    <ul>
      <li>Suspected/known prior FGR → best surveillance = <b>serial growth ultrasound</b>; high-risk intrapartum → <b>continuous electronic fetal monitoring</b></li>
      <li>Umbilical artery Doppler: <b>absent/reversed end-diastolic flow</b> = significant compromise → deliver (CS if at/near term)</li>
      <li>FGR + severe oligohydramnios (AFI 3) WITHOUT absent EDV at 38 wks → <b>induction of labour</b> (oligohydramnios alone is not a CS indication)</li>
      <li><b>TTTS</b> (monochorionic twins, exertional dyspnoea, US confirms) → <b>fetoscopic laser photocoagulation</b> of placental anastomoses</li>
      <li>VTE prophylaxis for CS with risk factors (age, BMI ≥30) → <b>Enoxaparin + compression stockings</b></li>
    </ul>
  </section>

  <section class="topic" dir="ltr">
    <h3>8. Postpartum</h3>
    <ul>
      <li><b>PPH from uterine atony</b> stepwise: therapeutic oxytocin + bimanual massage → <b>Methylergonovine</b> (avoid in HTN) or <b>Carboprost</b> (avoid in asthma) → misoprostol → balloon tamponade → surgery/hysterectomy</li>
      <li>Postpartum <b>blues</b> (mood swings, tearfulness ~1 wk) → reassurance + family support; persistent/severe → screen for depression</li>
      <li>Contraception start: COCs at <b>3 weeks postpartum</b> if no VTE risk; <b>6 weeks</b> if age ≥35 / BMI ≥30 / thrombophilia; progestin-only safe in breastfeeding</li>
    </ul>
  </section>

  <section class="topic" dir="ltr">
    <h3>9. Contraception</h3>
    <ul>
      <li>HTN + heavy menstrual bleeding/anaemia → <b>levonorgestrel IUD (Mirena)</b> (avoid oestrogen)</li>
      <li>After molar pregnancy (post-D&amp;C) → <b>COCs</b> (reliable, allows β-hCG monitoring; avoid IUD until uterus involutes)</li>
      <li>Primary prevention of unintended pregnancy in a sexually active woman → <b>educate about contraception</b></li>
    </ul>
  </section>

  <section class="topic" dir="ltr">
    <h3>10. Menstrual &amp; Benign Gynaecology</h3>
    <ul>
      <li><b>PCOS</b> hirsutism, no fertility desire → first line <b>combined OCP</b> (anti-androgen e.g. spironolactone as add-on)</li>
      <li><b>Endometriosis</b>: infertility + severe dysmenorrhoea unrelieved by NSAIDs → likely diagnosis (laparoscopy gold standard)</li>
      <li><b>Adenomyosis</b>: multiparous, symmetrically enlarged tender uterus, normal endometrial biopsy</li>
      <li><b>Fibroids (leiomyoma)</b>: menorrhagia + irregular enlarged uterus</li>
      <li><b>PMDD</b>: severe mood symptoms (irritability, insomnia, suicidal thoughts) in the luteal phase, resolving with menses → SSRI</li>
    </ul>
  </section>

  <section class="topic" dir="ltr">
    <h3>11. Vaginal Infections</h3>
    <table>
      <thead><tr><th>Infection</th><th>Clue</th><th>Treatment</th></tr></thead>
      <tbody>
        <tr><td>Bacterial vaginosis</td><td>thin milky discharge, fishy odour, +<b>Whiff test</b>, pH &gt;4.5, clue cells</td><td>Metronidazole</td></tr>
        <tr><td>Trichomoniasis</td><td>frothy green discharge, strawberry cervix, motile organisms</td><td>Metronidazole (treat partner)</td></tr>
        <tr><td>Candidiasis</td><td>thick white "cottage cheese", itch, normal pH</td><td>Fluconazole / topical azole</td></tr>
      </tbody>
    </table>
  </section>

  <section class="topic" dir="ltr">
    <h3>12. Cervical Screening &amp; Cancer</h3>
    <ul>
      <li><b>ASCUS</b> → reflex <b>HPV testing</b>; <b>AGC (atypical glandular cells)</b> → <b>Colposcopy</b> + endocervical/endometrial sampling</li>
      <li>Most common HPV subtypes in cervical cancer → <b>16 &amp; 18</b></li>
      <li>Cervical cancer: post-coital bleeding, visible lesion → biopsy; prevention = HPV vaccine + screening</li>
    </ul>
  </section>

  <section class="topic" dir="ltr">
    <h3>13. Abnormal &amp; Postmenopausal Bleeding / Oncology</h3>
    <ul>
      <li><b>Postmenopausal bleeding</b> (esp. obese/diabetic/HRT) → essential test = <b>endometrial biopsy</b> (rule out endometrial carcinoma)</li>
      <li>On <b>tamoxifen</b> with abnormal bleeding + inadequate biopsy → <b>hysteroscopy with directed biopsy</b></li>
      <li><b>Ovarian cancer</b>: older woman, ascites + pleural effusion + adnexal mass → ovarian malignancy (CA-125, imaging)</li>
    </ul>
  </section>

  <section class="topic" dir="ltr">
    <h3>14. Pelvic Floor</h3>
    <ul>
      <li>Stage 3 pelvic organ prolapse, elderly/unfit or on anticoagulation (warfarin) → <b>vaginal pessary</b> (non-surgical); surgery (sacrocolpopexy / Le Fort colpocleisis / vaginal hysterectomy) if fit</li>
    </ul>
  </section>

  <section class="topic" dir="ltr">
    <h3>15. Early Pregnancy</h3>
    <ul>
      <li><b>Ectopic</b>: prior ectopic raises recurrence risk to ~<b>10–15%</b>; β-hCG + TVUS; methotrexate (stable, small, low hCG) vs surgery (rupture/unstable)</li>
      <li><b>Molar pregnancy</b>: snowstorm US, very high β-hCG → suction D&amp;C + serial β-hCG; COCs for contraception during monitoring</li>
      <li><b>IUFD / missed miscarriage</b> management depends on GA: 2nd-trimester demise → <b>Misoprostol</b> (cautious with prior CS); &lt;~13 wks → medical/surgical evacuation</li>
      <li><b>Recurrent pregnancy loss</b>: ≥2–3 losses → workup; <b>antiphospholipid syndrome</b> is a key treatable cause (aspirin + LMWH)</li>
      <li><b>Cervical insufficiency</b> (painless mid-trimester loss, spontaneous dilation) → history-indicated <b>cerclage ~12–14 weeks</b> (ACOG: a single classic episode suffices)</li>
    </ul>
  </section>
</div>
`;
