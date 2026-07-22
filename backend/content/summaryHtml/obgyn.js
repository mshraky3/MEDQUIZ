// Obstetrics & Gynecology topic summary — HTML served (gated) to the viewer.
// Expanded from the "All-in-One OB/GYN (SMLE by Hassan)" recall deck: every
// topic carries the source's management ALGORITHM plus an exam KEY-POINTS box.
// Clinical text is LTR English; framing/headers are Arabic (RTL).
// Angle brackets in clinical text are HTML-escaped (&lt; / &gt;).
export default `
<div class="sum-doc" dir="rtl">
  <div class="sum-head">
    <h2>النساء والولادة — ملخص عالي العائد (SMLE)</h2>
    <p class="sum-meta">مبني على تجميعة "All-in-One OB/GYN". يغطي التوليد (الرعاية قبل الولادة، النزف، المخاض، الخداج) وأمراض النساء (الأورام، العقم، منع الحمل، اضطرابات الحوض). لكل موضوع: خوارزمية إدارة + نقاط امتحانية عالية العائد. للمراجعة الامتحانية فقط.</p>
  </div>

  <figure class="sum-fig" dir="ltr" aria-label="Female reproductive anatomy">
    <svg viewBox="0 0 460 300" xmlns="http://www.w3.org/2000/svg" role="img">
      <title>Female internal reproductive organs (frontal view)</title>
      <!-- uterus body -->
      <path d="M175 120 Q175 90 230 90 Q285 90 285 120 L278 195 Q230 220 182 195 Z" fill="#fbe3ea" stroke="#c9506f" stroke-width="2.5"/>
      <!-- endometrial cavity -->
      <path d="M205 118 Q230 108 255 118 L248 180 Q230 192 212 180 Z" fill="#f5c2d1" stroke="#c9506f" stroke-width="1.2"/>
      <!-- cervix -->
      <path d="M205 195 L212 232 Q230 240 248 232 L255 195 Q230 210 205 195 Z" fill="#e79db4" stroke="#c9506f" stroke-width="2.5"/>
      <!-- vagina -->
      <path d="M212 232 L214 272 Q230 280 246 272 L248 232 Q230 244 212 232 Z" fill="#f3d4de" stroke="#c9506f" stroke-width="2"/>
      <!-- left tube -->
      <path d="M175 118 Q120 96 96 118 Q84 130 92 140" fill="none" stroke="#c9506f" stroke-width="4" stroke-linecap="round"/>
      <!-- right tube -->
      <path d="M285 118 Q340 96 364 118 Q376 130 368 140" fill="none" stroke="#c9506f" stroke-width="4" stroke-linecap="round"/>
      <!-- fimbriae -->
      <path d="M92 140 l-8 -4 M92 140 l-9 2 M92 140 l-4 8" stroke="#c9506f" stroke-width="2" stroke-linecap="round"/>
      <path d="M368 140 l8 -4 M368 140 l9 2 M368 140 l4 8" stroke="#c9506f" stroke-width="2" stroke-linecap="round"/>
      <!-- ovaries -->
      <ellipse cx="110" cy="150" rx="20" ry="13" fill="#dfe9fb" stroke="#236ded" stroke-width="2"/>
      <ellipse cx="350" cy="150" rx="20" ry="13" fill="#dfe9fb" stroke="#236ded" stroke-width="2"/>
      <!-- labels -->
      <g font-family="system-ui, sans-serif" font-size="12" fill="#1e293b">
        <text x="230" y="78" text-anchor="middle" font-weight="700">Fundus</text>
        <text x="300" y="105" fill="#c9506f">Fallopian tube</text>
        <text x="350" y="185" text-anchor="middle" fill="#236ded" font-weight="700">Ovary</text>
        <text x="110" y="185" text-anchor="middle" fill="#236ded" font-weight="700">Ovary</text>
        <text x="300" y="165" fill="#1e293b">Uterus</text>
        <text x="270" y="228" fill="#1e293b">Cervix</text>
        <text x="255" y="268" fill="#1e293b">Vagina</text>
      </g>
    </svg>
    <figcaption>التشريح الأساسي للجهاز التناسلي الأنثوي — يوضّح <b>الرحم، عنق الرحم، قناتي فالوب، والمبيضين</b> (مرجع للمواضيع التالية).</figcaption>
  </figure>

  <nav class="sum-toc" dir="rtl" aria-label="جدول المحتويات">
    <h3>جدول المحتويات</h3>
    <ol>
      <li><a href="#t-prenatal">Prenatal &amp; Antenatal Care</a></li>
      <li><a href="#t-physio">Physiological Changes in Pregnancy</a></li>
      <li><a href="#t-gdm">Diabetes &amp; GDM</a></li>
      <li><a href="#t-rh">Rh Isoimmunization &amp; Immunization</a></li>
      <li><a href="#t-cervical">Cervical Incompetence</a></li>
      <li><a href="#t-abortion">Abortion / IUFD / IUGR</a></li>
      <li><a href="#t-aph">Antepartum Haemorrhage</a></li>
      <li><a href="#t-preterm">Preterm Labour / PROM / PPROM</a></li>
      <li><a href="#t-multiple">Multiple Gestation</a></li>
      <li><a href="#t-fetal">Fetal Medicine &amp; Surveillance</a></li>
      <li><a href="#t-cord">Cord Prolapse</a></li>
      <li><a href="#t-bishop">Bishop Score &amp; Induction</a></li>
      <li><a href="#t-ctg">CTG Interpretation</a></li>
      <li><a href="#t-pph">Postpartum Haemorrhage</a></li>
      <li><a href="#t-postpartum">Postpartum (Mastitis / Blues)</a></li>
      <li><a href="#t-pcos">PCOS</a></li>
      <li><a href="#t-aub">Abnormal Uterine Bleeding</a></li>
      <li><a href="#t-endometriosis">Endometriosis</a></li>
      <li><a href="#t-adenomyosis">Adenomyosis</a></li>
      <li><a href="#t-fibroid">Fibroid (Leiomyoma)</a></li>
      <li><a href="#t-polyp">Endometrial Polyp</a></li>
      <li><a href="#t-hyperplasia">Endometrial Hyperplasia / Cancer</a></li>
      <li><a href="#t-torsion">Ovarian Torsion</a></li>
      <li><a href="#t-cyst">Ovarian Cyst</a></li>
      <li><a href="#t-ovca">Ovarian Cancer</a></li>
      <li><a href="#t-pid">Pelvic Inflammatory Disease</a></li>
      <li><a href="#t-asherman">Asherman's Syndrome</a></li>
      <li><a href="#t-infertility">Infertility</a></li>
      <li><a href="#t-menopause">Menopause</a></li>
      <li><a href="#t-contraception">Contraception</a></li>
      <li><a href="#t-incontinence">Urinary Incontinence</a></li>
      <li><a href="#t-prolapse">Pelvic Organ Prolapse</a></li>
      <li><a href="#t-vaginitis">Vaginal Infections</a></li>
    </ol>
  </nav>

  <section class="topic" id="t-prenatal" dir="ltr">
    <h3>1. Prenatal &amp; Antenatal Care</h3>
    <ul>
      <li><b>Visit schedule</b>: every 4 wks until 28 wks → every 2 wks until 36 wks → weekly thereafter</li>
      <li><b>EDD (Naegele)</b>: LMP day <b>+7</b>, month <b>+9</b> (or −3), year +1 as needed. e.g. LMP 18/5/2020 → EDD 25/2/2021</li>
      <li><b>Folic acid</b>: <b>400 µg</b> (0.4 mg) standard; <b>4–5 mg</b> if high risk (previous NTD baby, diabetes, anti-epileptics)</li>
      <li><b>Dating US</b> at <b>10–11 wks</b> (confirm GA). <b>Anomaly scan</b> at <b>18–22 wks</b></li>
      <li>Growth parameter for dating: <b>Crown-rump length</b> ≤13+6 wks; <b>abdominal circumference</b> after 13+6 wks (most sensitive)</li>
      <li><b>Asymptomatic bacteriuria</b>: treat with antibiotics if urine culture positive — even without symptoms</li>
      <li>Live vaccines (MMR, varicella, <b>HPV</b>) contraindicated in pregnancy; inactivated flu &amp; Tdap are given</li>
    </ul>
    <div class="sum-key">
      <span class="sum-key-title">نقاط امتحانية</span>
      <ul>
        <li>Folic acid default is <b>400 µg</b> — jump to 4 mg only for a clear high-risk history (prior NTD).</li>
        <li>Positive urine culture in pregnancy → <b>treat regardless of symptoms</b> (prevents pyelonephritis/preterm labour).</li>
        <li>X-ray done before pregnancy was recognised → next step is to <b>determine gestational age / dose</b>, not act blindly.</li>
      </ul>
    </div>
  </section>

  <section class="topic" id="t-physio" dir="ltr">
    <h3>2. Physiological Changes in Pregnancy</h3>
    <ul>
      <li><b>Human placental lactogen</b> ↑ insulin resistance → diabetogenic state (basis of GDM)</li>
      <li><b>Blood volume</b> ↑ from wk 6, peaking <b>40–45%</b> at 32–34 wks → dilutional anaemia</li>
      <li><b>eGFR ↑</b> → high creatinine clearance → <b>serum creatinine falls</b></li>
      <li><b>Cardiac output ↑</b> via ↑ stroke volume &amp; heart rate</li>
      <li>Dominant estrogen in pregnancy is <b>estriol</b></li>
      <li><b>Hyperemesis gravidarum</b>: high hCG stimulates vomiting centre &amp; TSH receptors → dehydration → lipolysis → <b>ketonuria (diagnostic)</b></li>
    </ul>
    <div class="sum-key">
      <span class="sum-key-title">نقاط امتحانية</span>
      <ul>
        <li>A "normal" creatinine may actually be high in pregnancy — expect it to <b>fall</b>.</li>
        <li>Hyperemesis is confirmed by <b>ketonuria</b>; first step is IV fluids + antiemetics, check electrolytes/TSH.</li>
      </ul>
    </div>
  </section>

  <section class="topic" id="t-gdm" dir="ltr">
    <h3>3. Diabetes &amp; GDM</h3>
    <ul>
      <li><b>Screen at 24–28 wks</b> (earlier if previous GDM)</li>
      <li><b>2-step</b>: 50 g 1-h OGTT (screen) → if positive, 100 g 3-h OGTT (diagnostic). <b>1-step</b>: 75 g 2-h OGTT</li>
      <li>GDM treatment: <b>diet &amp; exercise first</b>; if uncontrolled → <b>insulin</b> (best/safest)</li>
    </ul>
    <div class="sum-algo">
      <span class="sum-algo-title">Pre-existing diabetes — antenatal care</span>
      <ol>
        <li>Optimise glycaemic control: <b>HbA1c &lt; 6.5%</b> preconception</li>
        <li><b>Folic acid</b> (≥400 µg; high-dose given diabetes) + <b>aspirin 12–28 wks</b> (pre-eclampsia prophylaxis)</li>
        <li>Watch complications: macrosomia/IUGR, pre-eclampsia, <b>RDS</b> (insulin inhibits surfactant), polyhydramnios, single umbilical artery</li>
      </ol>
    </div>
    <div class="sum-key">
      <span class="sum-key-title">نقاط امتحانية</span>
      <ul>
        <li>Positive 50 g screen → <b>next step is the 100 g 3-h test</b>, not straight to treatment.</li>
        <li>GDM uncontrolled on diet → <b>insulin</b> is the answer (not oral agents by default in exams).</li>
        <li>Diabetic mother's neonate at risk of <b>RDS</b> even near term — insulin suppresses surfactant.</li>
      </ul>
    </div>
  </section>

  <section class="topic" id="t-rh" dir="ltr">
    <h3>4. Rh Isoimmunization &amp; Immunization</h3>
    <ul>
      <li>Rh-negative mother + Rh-positive fetus → fetal RBCs enter maternal blood → maternal <b>IgG anti-D</b> → crosses placenta in future pregnancies → fetal haemolysis</li>
      <li><b>Anti-D immunoglobulin</b>: at <b>28 wks</b>, within <b>72 h</b> postpartum if newborn Rh+, and after any sensitising event (trauma, amniocentesis, bleeding)</li>
      <li>Dose: <b>300 µg covers ~30 mL</b> fetal whole blood</li>
    </ul>
    <div class="sum-algo">
      <span class="sum-algo-title">Positive antibody titre</span>
      <ol>
        <li>Critical titre (≥ 1:16) at <b>week 11</b> → too early for MCA Doppler → <b>repeat/follow up in 4 weeks</b></li>
        <li>At <b>week 16+</b> with critical titre → <b>MCA Doppler</b> for fetal anaemia</li>
        <li>Do not keep repeating a titre once it is already critical</li>
      </ol>
    </div>
    <div class="sum-key">
      <span class="sum-key-title">نقاط امتحانية</span>
      <ul>
        <li>MCA Doppler only from <b>~16 wks</b>; before that, follow up the titre.</li>
        <li>Give anti-D within <b>72 h</b> of any sensitising event — a favourite trigger detail.</li>
      </ul>
    </div>
  </section>

  <section class="topic" id="t-cervical" dir="ltr">
    <h3>5. Cervical Incompetence</h3>
    <ul>
      <li><b>Painless</b> cervical dilation → 2nd-trimester loss / preterm birth, no other cause. Usually <b>16–24 wks</b></li>
      <li>C/P: unexpected membrane rupture, painless 2nd-trimester loss, membrane herniation through the os</li>
    </ul>
    <figure class="sum-fig" dir="ltr" aria-label="Cervical length and cerclage">
      <svg viewBox="0 0 460 210" xmlns="http://www.w3.org/2000/svg" role="img">
        <title>Competent cervix vs incompetent cervix with cerclage</title>
        <!-- LEFT: competent, closed -->
        <g>
          <text x="115" y="20" text-anchor="middle" font-family="system-ui" font-size="12" font-weight="700" fill="#059669">Competent (&gt;25 mm)</text>
          <path d="M70 35 Q115 25 160 35 L150 120 Q115 135 80 120 Z" fill="#fbe3ea" stroke="#c9506f" stroke-width="2.5"/>
          <!-- long closed cervical canal -->
          <path d="M110 120 L112 185 Q115 190 118 185 L120 120" fill="#f3d4de" stroke="#c9506f" stroke-width="2"/>
          <line x1="140" y1="122" x2="140" y2="185" stroke="#059669" stroke-width="1.4"/>
          <path d="M136 122 h8 M136 185 h8" stroke="#059669" stroke-width="1.4"/>
          <text x="148" y="158" font-family="system-ui" font-size="9.5" fill="#059669">long</text>
        </g>
        <!-- RIGHT: incompetent + cerclage -->
        <g>
          <text x="345" y="20" text-anchor="middle" font-family="system-ui" font-size="12" font-weight="700" fill="#dc2626">Incompetent (&lt;25 mm)</text>
          <path d="M300 35 Q345 25 390 35 L380 120 Q345 135 310 120 Z" fill="#fbe3ea" stroke="#c9506f" stroke-width="2.5"/>
          <!-- short funnelled canal -->
          <path d="M330 120 Q345 150 360 120 L354 155 Q345 165 336 155 Z" fill="#f3d4de" stroke="#c9506f" stroke-width="2"/>
          <!-- cerclage suture -->
          <ellipse cx="345" cy="128" rx="30" ry="8" fill="none" stroke="#236ded" stroke-width="2.5" stroke-dasharray="5 4"/>
          <text x="345" y="185" text-anchor="middle" font-family="system-ui" font-size="9.5" fill="#236ded" font-weight="700">cerclage stitch</text>
        </g>
      </svg>
      <figcaption>Serial TVUS measures cervical length; <b>&lt;25 mm</b> (with prior 2nd-trimester loss, before 24 wks) → place a <b>cerclage</b> to hold the internal os closed.</figcaption>
    </figure>
    <div class="sum-algo">
      <span class="sum-algo-title">Management by history</span>
      <ol>
        <li><b>Previous 2nd-trimester loss?</b></li>
        <li><b>No</b> → US screen cervical length at 20 wks: &gt;25 mm → routine care; &lt;25 mm → <b>vaginal progesterone</b></li>
        <li><b>Yes</b> → prophylaxis by GA: 13–14 wks → <b>cerclage</b>; 15–23 wks → serial TVUS, cerclage if length &lt;25 mm</li>
        <li>Cerclage <b>not recommended after 24 wks</b></li>
      </ol>
    </div>
    <div class="sum-key">
      <span class="sum-key-title">نقاط امتحانية</span>
      <ul>
        <li>Cerclage trigger = <b>cervical length &lt; 25 mm</b> (with prior 2nd-trimester loss), before 24 wks.</li>
        <li>Sudden painless mid-trimester membrane rupture + expulsion = <b>cervical incompetence</b> (not septic/threatened abortion).</li>
        <li>Diagnosed case, manage by GA: &lt;24 wks → cerclage.</li>
      </ul>
    </div>
  </section>

  <section class="topic" id="t-abortion" dir="ltr">
    <h3>6. Abortion / IUFD / IUGR</h3>
    <ul>
      <li><b>Abortion</b>: pregnancy loss &lt;20 wks. <b>IUFD</b>: fetal death ≥20 wks or &gt;350 g</li>
      <li>Most common cause of loss: <b>1st trimester → chromosomal</b> (next step = karyotyping); <b>2nd trimester → cervical incompetence</b></li>
      <li>Risk ↑ with maternal age, especially &gt;35</li>
    </ul>
    <table>
      <thead><tr><th>Type</th><th>Cervix</th><th>POC / fetal activity</th><th>Management</th></tr></thead>
      <tbody>
        <tr><td>Threatened</td><td>closed</td><td>POC present, FHR present, bleeding</td><td>expectant, resume activity</td></tr>
        <tr><td>Inevitable</td><td>dilated</td><td>no passage yet, bleeding</td><td>medical / surgical evacuation</td></tr>
        <tr><td>Incomplete</td><td>dilated</td><td>partial passage, no FHR</td><td>expectant (&lt;13 wk) / misoprostol / D&amp;C</td></tr>
        <tr><td>Missed</td><td>closed</td><td>fetus dead, no bleeding</td><td>medical / surgical evacuation</td></tr>
        <tr><td>Complete</td><td>closed</td><td>full passage, no FHR</td><td>OPD follow-up</td></tr>
      </tbody>
    </table>
    <div class="sum-algo">
      <span class="sum-algo-title">Approach to bleeding early pregnancy</span>
      <ol>
        <li>History &amp; pelvic exam (cervical dilation, POC, other bleeding sources)</li>
        <li><b>TVUS</b> for fetal cardiac activity</li>
        <li>Treat by type &amp; stability; moderate-severe haemorrhage or instability → <b>D&amp;C</b></li>
      </ol>
    </div>
    <div class="sum-key">
      <span class="sum-key-title">نقاط امتحانية</span>
      <ul>
        <li>Recurrent 1st-trimester loss → <b>karyotyping</b> (parental/products).</li>
        <li>Haemodynamically unstable incomplete abortion → <b>surgical evacuation (D&amp;C)</b> over expectant.</li>
      </ul>
    </div>
  </section>

  <section class="topic" id="t-aph" dir="ltr">
    <h3>7. Antepartum Haemorrhage</h3>
    <table>
      <thead><tr><th></th><th>Placenta praevia</th><th>Abruption</th><th>Uterine rupture</th></tr></thead>
      <tbody>
        <tr><td>Pain</td><td><b>painless</b></td><td><b>painful</b>, tender uterus</td><td>severe pain, then contractions stop</td></tr>
        <tr><td>Bleeding</td><td>bright red</td><td>may be concealed</td><td>vaginal bleeding + shock, loss of station</td></tr>
        <tr><td>Key RF</td><td>previous CS, multiple gestation</td><td>HTN/pre-eclampsia, smoking</td><td>prior uterine scar, oxytocin, grand parity</td></tr>
      </tbody>
    </table>
    <figure class="sum-fig" dir="ltr" aria-label="Placenta praevia versus abruption">
      <svg viewBox="0 0 460 240" xmlns="http://www.w3.org/2000/svg" role="img">
        <title>Placenta praevia vs placental abruption</title>
        <!-- PRAEVIA (left) -->
        <g>
          <path d="M40 40 Q110 20 180 40 L172 165 Q110 210 48 165 Z" fill="#fdeef2" stroke="#c9506f" stroke-width="2.5"/>
          <!-- fetus -->
          <circle cx="110" cy="95" r="24" fill="#dfe9fb" stroke="#236ded" stroke-width="1.6"/>
          <circle cx="110" cy="128" r="16" fill="#dfe9fb" stroke="#236ded" stroke-width="1.6"/>
          <!-- placenta covering the os (bottom) -->
          <path d="M60 150 Q110 185 160 150 L155 170 Q110 200 65 170 Z" fill="#8e3d55" stroke="#6d2c40" stroke-width="1.5"/>
          <!-- cervical os -->
          <rect x="103" y="185" width="14" height="20" rx="3" fill="#f3d4de" stroke="#c9506f" stroke-width="1.5"/>
          <text x="110" y="30" text-anchor="middle" font-family="system-ui" font-size="13" font-weight="700" fill="#1e293b">Placenta praevia</text>
          <text x="110" y="228" text-anchor="middle" font-family="system-ui" font-size="10.5" fill="#64748b">painless bleeding · covers os</text>
        </g>
        <!-- ABRUPTION (right) -->
        <g>
          <path d="M280 40 Q350 20 420 40 L412 165 Q350 210 288 165 Z" fill="#fdeef2" stroke="#c9506f" stroke-width="2.5"/>
          <circle cx="350" cy="95" r="24" fill="#dfe9fb" stroke="#236ded" stroke-width="1.6"/>
          <circle cx="350" cy="128" r="16" fill="#dfe9fb" stroke="#236ded" stroke-width="1.6"/>
          <!-- placenta at fundus, separating with retroplacental blood -->
          <path d="M305 55 Q350 42 395 55 L390 78 Q350 90 310 78 Z" fill="#8e3d55" stroke="#6d2c40" stroke-width="1.5"/>
          <!-- retroplacental clot -->
          <path d="M318 78 Q350 96 382 78 Q368 92 350 92 Q332 92 318 78 Z" fill="#c62828" stroke="#8e1a1a" stroke-width="1.2"/>
          <text x="350" y="30" text-anchor="middle" font-family="system-ui" font-size="13" font-weight="700" fill="#1e293b">Abruption</text>
          <text x="350" y="228" text-anchor="middle" font-family="system-ui" font-size="10.5" fill="#64748b">painful · retroplacental clot</text>
        </g>
      </svg>
      <figcaption><b>Praevia</b>: placenta covers the internal os → painless bleeding, never do a vaginal exam. <b>Abruption</b>: fundal placenta separates → painful bleeding + tender uterus (blood may be concealed).</figcaption>
    </figure>
    <div class="sum-algo">
      <span class="sum-algo-title">Praevia — delivery</span>
      <ol>
        <li><b>No vaginal exam.</b> TVUS to localise; if covering os → CS only (never SVD)</li>
        <li>Ideal delivery <b>36–37 wks</b></li>
        <li>&lt;37 wks: severe bleeding/fetal distress → stabilise + CS; mild → admit 48 h, steroids (&lt;34 wk), MgSO₄ (&lt;32 wk) → CS at 36–37 wks</li>
      </ol>
    </div>
    <div class="sum-algo">
      <span class="sum-algo-title">Abruption — delivery</span>
      <ol>
        <li>Unstable mother (any fetal status) → <b>CS</b></li>
        <li>Stable + IUFD → <b>induction</b>; stable + reassuring fetus &lt;34 wk → admit, steroids/MgSO₄, deliver ≥36 wk</li>
        <li>Non-reassuring fetus → <b>CS</b></li>
        <li>Uterine rupture → stop oxytocin/prostaglandin → <b>laparotomy + CS</b></li>
      </ol>
    </div>
    <div class="sum-key">
      <span class="sum-key-title">نقاط امتحانية</span>
      <ul>
        <li>Suspected praevia → <b>no vaginal/speculum exam</b> — the classic wrong option.</li>
        <li>Hypotensive mother with ongoing APH → <b>resuscitate/transfuse first</b>, then CS (after one dexamethasone dose if time).</li>
        <li>Painful bleeding + tender uterus + HTN = <b>abruption</b>; painless = praevia.</li>
      </ul>
    </div>
  </section>

  <section class="topic" id="t-preterm" dir="ltr">
    <h3>8. Preterm Labour / PROM / PPROM</h3>
    <ul>
      <li><b>PROM</b>: membrane rupture before labour, ≥37 wks. <b>PPROM</b>: before 37 wks. <b>Preterm labour</b>: regular contractions + cervical change &lt;37 wks</li>
      <li>Confirm rupture: sterile <b>speculum</b>, ferning, nitrazine test</li>
    </ul>
    <div class="sum-algo">
      <span class="sum-algo-title">PPROM / Preterm labour</span>
      <ol>
        <li><b>&lt;32 wks</b> → <b>MgSO₄</b> (neuroprotection) + tocolysis (indomethacin)</li>
        <li><b>&lt;34 wks</b> → <b>antenatal steroids</b>; 32–34 wks tocolysis = nifedipine</li>
        <li>PPROM antibiotics: <b>ampicillin + erythromycin</b> (latency, ↓ neonatal RDS)</li>
        <li>Deliver if: chorioamnionitis, abruption, non-reassuring CTG, cord-prolapse risk; PL ≥34 wks with active labour (≥4 cm) → deliver</li>
        <li>PROM ≥37 wks → deliver within 24 h; GBS prophylaxis if positive/unknown</li>
      </ol>
    </div>
    <div class="sum-key">
      <span class="sum-key-title">نقاط امتحانية</span>
      <ul>
        <li><b>MgSO₄ &lt;32 wks, steroids &lt;34 wks</b> — memorise the two cut-offs.</li>
        <li>Confirm ROM with <b>sterile speculum</b> first — avoid digital exam (infection).</li>
        <li>Antibiotics in PPROM are for <b>latency + ↓ RDS</b>, not just infection.</li>
      </ul>
    </div>
  </section>

  <section class="topic" id="t-multiple" dir="ltr">
    <h3>9. Multiple Gestation</h3>
    <ul>
      <li><b>Dizygotic</b> → always dichorionic-diamniotic</li>
      <li><b>Monozygotic</b> by split timing: 0–3 d DCDA · 4–8 d MCDA · 9–12 d MCMA · &gt;13 d conjoined</li>
    </ul>
    <figure class="sum-fig" dir="ltr" aria-label="Monozygotic twin chorionicity by timing of division">
      <svg viewBox="0 0 460 170" xmlns="http://www.w3.org/2000/svg" role="img">
        <title>Chorionicity by day of division</title>
        <g font-family="system-ui, sans-serif" font-size="10.5">
          <!-- timeline -->
          <line x1="30" y1="140" x2="440" y2="140" stroke="#cbd5e1" stroke-width="2"/>
          <!-- 0-3 DCDA -->
          <circle cx="70" cy="60" r="18" fill="none" stroke="#236ded" stroke-width="2"/>
          <circle cx="70" cy="60" r="11" fill="#dfe9fb" stroke="#c9506f" stroke-width="1.4"/>
          <circle cx="110" cy="60" r="18" fill="none" stroke="#236ded" stroke-width="2"/>
          <circle cx="110" cy="60" r="11" fill="#dfe9fb" stroke="#c9506f" stroke-width="1.4"/>
          <text x="90" y="110" text-anchor="middle" font-weight="700" fill="#1e293b">DCDA</text>
          <text x="90" y="155" text-anchor="middle" fill="#64748b">0–3 d</text>
          <!-- 4-8 MCDA -->
          <ellipse cx="200" cy="60" rx="40" ry="20" fill="none" stroke="#236ded" stroke-width="2"/>
          <circle cx="184" cy="60" r="10" fill="#dfe9fb" stroke="#c9506f" stroke-width="1.4"/>
          <circle cx="216" cy="60" r="10" fill="#dfe9fb" stroke="#c9506f" stroke-width="1.4"/>
          <text x="200" y="110" text-anchor="middle" font-weight="700" fill="#1e293b">MCDA</text>
          <text x="200" y="155" text-anchor="middle" fill="#64748b">4–8 d</text>
          <!-- 9-12 MCMA -->
          <ellipse cx="310" cy="60" rx="38" ry="20" fill="#dfe9fb" stroke="#236ded" stroke-width="2"/>
          <circle cx="296" cy="60" r="9" fill="#fbe3ea" stroke="#c9506f" stroke-width="1.4"/>
          <circle cx="324" cy="60" r="9" fill="#fbe3ea" stroke="#c9506f" stroke-width="1.4"/>
          <text x="310" y="110" text-anchor="middle" font-weight="700" fill="#1e293b">MCMA</text>
          <text x="310" y="155" text-anchor="middle" fill="#64748b">9–12 d</text>
          <!-- >13 conjoined -->
          <ellipse cx="410" cy="60" rx="30" ry="20" fill="#dfe9fb" stroke="#236ded" stroke-width="2"/>
          <path d="M398 52 a9 9 0 1 1 0 16 a9 9 0 1 1 24 0 a9 9 0 1 1 0 -16 a9 9 0 1 1 -24 0" fill="#fbe3ea" stroke="#c9506f" stroke-width="1.2"/>
          <text x="410" y="110" text-anchor="middle" font-weight="700" fill="#1e293b">Conjoined</text>
          <text x="410" y="155" text-anchor="middle" fill="#64748b">&gt;13 d</text>
        </g>
      </svg>
      <figcaption>انقسام التوأم أحادي الزيجوت حسب اليوم: كل ما تأخّر الانقسام قلّ عدد الأغشية. <b>0–3d DCDA · 4–8d MCDA · 9–12d MCMA · &gt;13d conjoined</b>.</figcaption>
    </figure>
    <div class="sum-algo">
      <span class="sum-algo-title">Delivery by presentation</span>
      <ol>
        <li>Twin A cephalic (cephalic-cephalic or cephalic-breech) → <b>vaginal delivery</b> possible</li>
        <li>Twin A <b>non-cephalic</b> → <b>caesarean section</b></li>
      </ol>
    </div>
    <div class="sum-key">
      <span class="sum-key-title">نقاط امتحانية</span>
      <ul>
        <li>Chorionicity is decided by the <b>day of division</b> — know the 3/8/13-day boundaries.</li>
        <li>Mode of delivery hinges on <b>twin A's presentation</b>.</li>
        <li>TTTS (monochorionic) → <b>fetoscopic laser</b> photocoagulation.</li>
      </ul>
    </div>
  </section>

  <section class="topic" id="t-fetal" dir="ltr">
    <h3>10. Fetal Medicine &amp; Surveillance</h3>
    <div class="sum-algo">
      <span class="sum-algo-title">Decreased fetal movement</span>
      <ol>
        <li>History → <b>kick count</b>: &lt;10 in 2 h → proceed</li>
        <li><b>Non-stress test</b> (FHR)</li>
        <li>US / <b>biophysical profile</b></li>
        <li><b>Umbilical artery Doppler</b> if IUGR/placental insufficiency suspected</li>
      </ol>
    </div>
    <ul>
      <li><b>FGR surveillance</b>: serial growth US; high-risk labour → continuous EFM</li>
      <li>Umbilical Doppler <b>absent/reversed end-diastolic flow</b> = compromise → deliver (CS near term)</li>
      <li><b>Down syndrome (2nd-trimester) markers</b>: high hCG &amp; inhibin; low estriol &amp; AFP. Mnemonic: the marker with an <b>H</b> is High, the rest are low</li>
    </ul>
    <div class="sum-key">
      <span class="sum-key-title">نقاط امتحانية</span>
      <ul>
        <li>Kick count &lt;10/2 h → escalate to <b>NST</b>, not reassurance.</li>
        <li>Absent/reversed EDV on umbilical Doppler = <b>deliver</b>.</li>
        <li>Oligohydramnios alone is not a CS indication → <b>induce</b> if no absent-EDV at term.</li>
      </ul>
    </div>
  </section>

  <section class="topic" id="t-cord" dir="ltr">
    <h3>11. Cord Prolapse</h3>
    <ul>
      <li>Cord descends below presenting part after ROM → compression → hypoxia</li>
      <li>C/P: sudden <b>fetal bradycardia</b> after ROM, variable decelerations, palpable/visible cord, polyhydramnios</li>
    </ul>
    <div class="sum-algo">
      <span class="sum-algo-title">Management</span>
      <ol>
        <li><b>In-utero resuscitation</b> (elevate presenting part, knee-chest, stop oxytocin)</li>
        <li>Head at <b>+2 station or lower</b> → instrumental delivery</li>
        <li>Otherwise → <b>emergency CS</b></li>
      </ol>
    </div>
    <div class="sum-key">
      <span class="sum-key-title">نقاط امتحانية</span>
      <ul>
        <li>Bradycardia immediately after ROM = cord prolapse → <b>relieve pressure + emergency delivery</b>.</li>
      </ul>
    </div>
  </section>

  <section class="topic" id="t-bishop" dir="ltr">
    <h3>12. Bishop Score &amp; Induction</h3>
    <div class="sum-algo">
      <span class="sum-algo-title">Bishop score → method</span>
      <ol>
        <li><b>≤3</b> unfavourable / <b>4–5</b> unfavourable → <b>cervical ripening</b> (vaginal <b>prostaglandin E2</b>)</li>
        <li><b>6–8</b> moderately favourable → <b>induce</b> (oxytocin)</li>
        <li><b>≥9</b> favourable → amniotomy / spontaneous onset likely</li>
      </ol>
    </div>
    <div class="sum-key">
      <span class="sum-key-title">نقاط امتحانية</span>
      <ul>
        <li>Low Bishop (≤5, closed cervix) → <b>vaginal prostaglandin E2</b> for ripening (not oxytocin, not amniotomy).</li>
        <li>Bishop ≥9 → cervix is ready → <b>amniotomy</b>.</li>
      </ul>
    </div>
  </section>

  <section class="topic" id="t-ctg" dir="ltr">
    <h3>13. CTG Interpretation</h3>
    <figure class="sum-fig" dir="ltr" aria-label="CTG deceleration patterns">
      <svg viewBox="0 0 460 260" xmlns="http://www.w3.org/2000/svg" role="img">
        <title>Early, variable and late decelerations</title>
        <g font-family="system-ui, sans-serif">
          <!-- EARLY -->
          <text x="70" y="18" text-anchor="middle" font-size="12" font-weight="700" fill="#059669">Early</text>
          <text x="70" y="235" text-anchor="middle" font-size="9.5" fill="#64748b">head compression</text>
          <path d="M20 60 H120" stroke="#cbd5e1" stroke-width="1" stroke-dasharray="3 3"/>
          <path d="M20 60 Q45 60 55 85 Q70 110 85 85 Q95 60 120 60" fill="none" stroke="#236ded" stroke-width="2.5"/>
          <path d="M20 175 Q45 175 55 150 Q70 125 85 150 Q95 175 120 175" fill="none" stroke="#94a3b8" stroke-width="2"/>
          <text x="126" y="64" font-size="9" fill="#236ded">FHR</text>
          <text x="126" y="178" font-size="9" fill="#94a3b8">UC</text>

          <!-- VARIABLE -->
          <text x="230" y="18" text-anchor="middle" font-size="12" font-weight="700" fill="#d97706">Variable</text>
          <text x="230" y="235" text-anchor="middle" font-size="9.5" fill="#64748b">cord compression</text>
          <path d="M180 60 H280" stroke="#cbd5e1" stroke-width="1" stroke-dasharray="3 3"/>
          <path d="M180 60 H210 L216 100 L224 100 L230 60 H240 L246 95 L252 60 H280" fill="none" stroke="#236ded" stroke-width="2.5" stroke-linejoin="round"/>
          <path d="M180 175 Q205 175 215 150 Q230 128 245 150 Q255 175 280 175" fill="none" stroke="#94a3b8" stroke-width="2"/>

          <!-- LATE -->
          <text x="390" y="18" text-anchor="middle" font-size="12" font-weight="700" fill="#dc2626">Late</text>
          <text x="390" y="235" text-anchor="middle" font-size="9.5" fill="#64748b">uteroplacental insuff.</text>
          <path d="M340 60 H440" stroke="#cbd5e1" stroke-width="1" stroke-dasharray="3 3"/>
          <!-- FHR dip shifted AFTER the contraction peak -->
          <path d="M340 60 Q365 60 380 85 Q398 112 415 85 Q425 62 440 60" fill="none" stroke="#236ded" stroke-width="2.5"/>
          <path d="M340 175 Q360 175 370 150 Q383 128 396 150 Q406 175 440 175" fill="none" stroke="#94a3b8" stroke-width="2"/>
          <!-- offset arrow -->
          <line x1="383" y1="128" x2="398" y2="112" stroke="#dc2626" stroke-width="1.4" stroke-dasharray="2 2"/>
        </g>
      </svg>
      <figcaption><b>Early</b> = mirror of contraction (benign, head compression). <b>Variable</b> = sharp V, no relation to contraction (cord). <b>Late</b> = dip begins <b>after</b> the contraction peak (uteroplacental insufficiency — non-reassuring).</figcaption>
    </figure>
    <ul>
      <li><b>Early decelerations</b> → fetal head compression (mirror the contraction) — benign</li>
      <li><b>Variable decelerations</b> → umbilical cord compression</li>
      <li><b>Late decelerations</b> → uteroplacental insufficiency (start at end of contraction)</li>
      <li><b>MgSO₄</b> → reduced/minimal variability; <b>epidural</b> → maternal hypotension → late decels; <b>oxytocin</b> → late/prolonged decels + hyperstimulation</li>
    </ul>
    <div class="sum-key">
      <span class="sum-key-title">نقاط امتحانية</span>
      <ul>
        <li>Late decels → think <b>uteroplacental insufficiency</b>; first act = reposition, stop oxytocin, O₂, IV fluids.</li>
        <li>Variable decels → <b>cord compression</b>; recurrent minimal variability after MgSO₄ can be drug effect.</li>
      </ul>
    </div>
  </section>

  <section class="topic" id="t-pph" dir="ltr">
    <h3>14. Postpartum Haemorrhage</h3>
    <ul>
      <li><b>Primary PPH</b>: &lt;24 h; <b>secondary</b>: 24 h–12 wks</li>
      <li>Causes: <b>uterine atony (most common — soft boggy uterus)</b> &gt; genital laceration &gt; retained placenta &gt; DIC</li>
      <li><b>Active management of 3rd stage prevents PPH</b></li>
    </ul>
    <div class="sum-algo">
      <span class="sum-algo-title">Atony — uterotonics (stepwise)</span>
      <ol>
        <li>Massage + <b>oxytocin</b> (first line)</li>
        <li><b>Methylergonovine</b> (avoid in HTN)</li>
        <li><b>Carboprost</b> (avoid in asthma) → misoprostol</li>
      </ol>
    </div>
    <div class="sum-algo">
      <span class="sum-algo-title">If medical fails</span>
      <ol>
        <li><b>SVD</b>: Bakri balloon → embolisation (stable) / uterine artery ligation (unstable) → hysterectomy</li>
        <li><b>CS</b>: B-Lynch → uterine artery ligation (stable) → hysterectomy (unstable/failed)</li>
      </ol>
    </div>
    <div class="sum-key">
      <span class="sum-key-title">نقاط امتحانية</span>
      <ul>
        <li>Soft boggy uterus → atony → <b>massage + oxytocin</b> first.</li>
        <li>Drug contraindications are favourite distractors: <b>methylergonovine in HTN, carboprost in asthma</b>.</li>
        <li>Firm uterus but ongoing bleeding → think <b>laceration</b> (2nd most common).</li>
      </ul>
    </div>
  </section>

  <section class="topic" id="t-postpartum" dir="ltr">
    <h3>15. Postpartum — Mastitis &amp; Mood</h3>
    <ul>
      <li><b>Mastitis</b> (lactating, cracked nipples): tender erythematous breast + fever; organism = <b>S. aureus</b> → <b>anti-staph antibiotics</b> (dicloxacillin/flucloxacillin), <b>continue breastfeeding</b></li>
      <li><b>Abscess</b> (fluctuant mass) → US + drainage</li>
      <li><b>Postpartum blues</b> (~1 wk, tearful, mood swings) → reassurance + support; persistent/severe → screen for depression</li>
    </ul>
    <div class="sum-key">
      <span class="sum-key-title">نقاط امتحانية</span>
      <ul>
        <li>Mastitis → keep breastfeeding + <b>anti-staph antibiotic</b>; stop only for drained abscess if needed.</li>
        <li>Blues resolve by ~2 wks with support; beyond that consider <b>postpartum depression</b>.</li>
      </ul>
    </div>
  </section>

  <section class="topic" id="t-pcos" dir="ltr">
    <h3>16. Polycystic Ovarian Syndrome</h3>
    <ul>
      <li><b>Rotterdam</b> — 2 of 3: oligo/anovulation, clinical/biochemical hyperandrogenism, polycystic ovaries on US</li>
      <li>Labs: LH:FSH ≈ 3:1, testosterone (hirsutism), glucose &amp; lipid profile; signs of insulin resistance (acanthosis nigricans)</li>
    </ul>
    <div class="sum-algo">
      <span class="sum-algo-title">Treatment by goal</span>
      <ol>
        <li><b>Lifestyle modification</b> (first line, all)</li>
        <li>Menstrual irregularity / hirsutism → <b>combined OCP</b> (± spironolactone)</li>
        <li>Wants fertility → <b>clomiphene / letrozole</b></li>
        <li>Insulin resistance → <b>metformin</b></li>
      </ol>
    </div>
    <div class="sum-key">
      <span class="sum-key-title">نقاط امتحانية</span>
      <ul>
        <li>Hirsutism + no fertility desire → <b>combined OCP</b>; wants pregnancy → <b>clomiphene/letrozole</b>.</li>
        <li>PCOS + obesity → unopposed estrogen → endometrial hyperplasia risk (see topic 21).</li>
      </ul>
    </div>
  </section>

  <section class="topic" id="t-aub" dir="ltr">
    <h3>17. Abnormal Uterine Bleeding</h3>
    <div class="sum-algo">
      <span class="sum-algo-title">Work-up</span>
      <ol>
        <li>History/exam, <b>β-hCG</b> (exclude pregnancy), CBC (anaemia)</li>
        <li>TVUS + <b>endometrial sampling</b> if: age &gt;45; post-menopausal with ET &gt;5 mm + bleeding (or ≥11 mm asymptomatic); &lt;45 with unopposed-estrogen risk (PCOS/obesity) or failed medical therapy</li>
      </ol>
    </div>
    <div class="sum-algo">
      <span class="sum-algo-title">Treatment</span>
      <ol>
        <li><b>Acute</b>: IV conjugated estrogen (1st line) → COCP / oral progesterone → refractory → therapeutic D&amp;C</li>
        <li><b>Chronic</b>: <b>LNG-IUD (Mirena)</b>, COCP, tranexamic acid</li>
      </ol>
    </div>
    <div class="sum-key">
      <span class="sum-key-title">نقاط امتحانية</span>
      <ul>
        <li>Any AUB &gt;45, or post-menopausal bleeding → <b>endometrial biopsy</b> to exclude cancer.</li>
        <li>Acute severe AUB, haemodynamically stable → <b>IV estrogen</b> first line.</li>
      </ul>
    </div>
  </section>

  <section class="topic" id="t-endometriosis" dir="ltr">
    <h3>18. Endometriosis</h3>
    <ul>
      <li>Endometrial tissue outside the uterus (commonly ovaries). C/P: <b>dysmenorrhoea, dyspareunia, dyschezia</b>, infertility, chronic pelvic pain; fixed retroverted uterus, uterosacral nodularity</li>
      <li>Diagnosis: TVUS (chocolate cyst, ground-glass) → <b>laparoscopy + biopsy (confirmatory/gold standard)</b></li>
    </ul>
    <div class="sum-algo">
      <span class="sum-algo-title">Treatment</span>
      <ol>
        <li>Medical: <b>OCP/POP</b> (1st line) → IUD (2nd)</li>
        <li>Surgical (failed medical): <b>laparoscopic ablation</b> → definitive <b>TAH + BSO</b> (severe, family complete)</li>
      </ol>
    </div>
    <div class="sum-key">
      <span class="sum-key-title">نقاط امتحانية</span>
      <ul>
        <li>Infertility + severe dysmenorrhoea unrelieved by NSAIDs → endometriosis; <b>laparoscopy</b> confirms.</li>
      </ul>
    </div>
  </section>

  <section class="topic" id="t-adenomyosis" dir="ltr">
    <h3>19. Adenomyosis</h3>
    <ul>
      <li>Endometrial glands invade myometrium. <b>3 Ds</b>: dysmenorrhoea, dyspareunia, diffuse uterine enlargement (+ menorrhagia)</li>
      <li>Exam: diffusely enlarged, <b>boggy</b> uterus; TVUS: myometrial thickening (normal endometrial biopsy)</li>
    </ul>
    <div class="sum-key">
      <span class="sum-key-title">نقاط امتحانية</span>
      <ul>
        <li>Multiparous woman, symmetrically enlarged tender/boggy uterus, normal biopsy → <b>adenomyosis</b>; definitive = <b>hysterectomy</b>.</li>
      </ul>
    </div>
  </section>

  <section class="topic" id="t-fibroid" dir="ltr">
    <h3>20. Fibroid (Leiomyoma)</h3>
    <ul>
      <li><b>Submucosal</b> → infertility &amp; AUB; <b>subserosal (most common)</b> &amp; <b>intramural</b> → pressure/heaviness. US = initial &amp; diagnostic</li>
    </ul>
    <div class="sum-algo">
      <span class="sum-algo-title">Treatment</span>
      <ol>
        <li>Asymptomatic incidental → observe, annual US</li>
        <li>Medical: <b>OCP</b>; <b>GnRH agonist</b> pre-op to shrink</li>
        <li>Refuses surgery → <b>uterine artery embolisation</b></li>
        <li>Surgical (&gt;7 cm / failed medical): hysterectomy, or <b>myomectomy</b> (fertility-sparing) — submucosal → hysteroscopic resection</li>
      </ol>
    </div>
    <div class="sum-key">
      <span class="sum-key-title">نقاط امتحانية</span>
      <ul>
        <li>Menorrhagia + irregularly enlarged uterus → fibroid; <b>GnRH agonist</b> is the pre-operative shrinking answer.</li>
        <li>Wants fertility → <b>myomectomy</b> (submucosal → hysteroscopic).</li>
      </ul>
    </div>
  </section>

  <section class="topic" id="t-polyp" dir="ltr">
    <h3>21. Endometrial Polyp</h3>
    <ul>
      <li>C/P: menorrhagia / intermenstrual bleeding. Initial: TVUS → confirm: <b>hysteroscopy</b></li>
      <li>Management: asymptomatic &amp; &lt;1 cm → observe; symptomatic/large → <b>hysteroscopic polypectomy</b></li>
    </ul>
  </section>

  <section class="topic" id="t-hyperplasia" dir="ltr">
    <h3>22. Endometrial Hyperplasia / Cancer</h3>
    <ul>
      <li>RF (all → <b>unopposed estrogen</b>): nulliparity, early menarche/late menopause, obesity, DM, PCOS. Diagnosis: <b>endometrial biopsy</b></li>
    </ul>
    <div class="sum-algo">
      <span class="sum-algo-title">Hyperplasia management</span>
      <ol>
        <li>Without atypia → <b>oral progesterone</b></li>
        <li>With atypia → <b>TAH</b>; if fertility desired → progesterone + close follow-up</li>
        <li>Endometrial cancer: biopsy diagnoses; stage with laparoscopy + para-aortic LN dissection</li>
      </ol>
    </div>
    <div class="sum-key">
      <span class="sum-key-title">نقاط امتحانية</span>
      <ul>
        <li>Atypical hyperplasia → <b>hysterectomy</b> (progestin only if fertility must be preserved).</li>
        <li>Post-menopausal bleeding is endometrial cancer until proven otherwise → <b>biopsy</b>.</li>
      </ul>
    </div>
  </section>

  <section class="topic" id="t-torsion" dir="ltr">
    <h3>23. Ovarian Torsion</h3>
    <ul>
      <li>Sudden unilateral pelvic pain, nausea/vomiting, adnexal tenderness, no vaginal bleeding</li>
      <li>Diagnosis: <b>pelvic US with Doppler</b> — absent/decreased ovarian flow, enlarged oedematous ovary</li>
    </ul>
    <div class="sum-algo">
      <span class="sum-algo-title">Management</span>
      <ol>
        <li>Viable ovary → <b>detorsion</b> (surgical, ovary-sparing)</li>
        <li>Suspected malignancy → cystectomy / oophorectomy</li>
      </ol>
    </div>
    <div class="sum-key">
      <span class="sum-key-title">نقاط امتحانية</span>
      <ul>
        <li>Torsion is a <b>surgical emergency</b> — Doppler supports but must not delay theatre; detorse to save the ovary.</li>
      </ul>
    </div>
  </section>

  <section class="topic" id="t-cyst" dir="ltr">
    <h3>24. Ovarian Cyst</h3>
    <ul>
      <li>Simple, young, small → observe/repeat US. <b>Ruptured cyst</b> (acute worsening pain, complex mass) → stabilise, usually conservative if stable</li>
    </ul>
    <div class="sum-algo">
      <span class="sum-algo-title">Complex adnexal mass</span>
      <ol>
        <li>Complex/multiloculated solid mass + <b>very high CA-125</b>, esp. post-menopausal → <b>gynae-oncology referral / malignancy work-up</b></li>
        <li>Do not do a simple cystectomy on a suspicious mass</li>
      </ol>
    </div>
    <div class="sum-key">
      <span class="sum-key-title">نقاط امتحانية</span>
      <ul>
        <li>Post-menopausal complex mass + high CA-125 → <b>refer to gyn-onc</b>, not blind cystectomy.</li>
      </ul>
    </div>
  </section>

  <section class="topic" id="t-ovca" dir="ltr">
    <h3>25. Ovarian Cancer</h3>
    <ul>
      <li>C/P: bloating/distension, early satiety, abdominal pain, weight loss (vague → late presentation)</li>
      <li>Diagnosis: TVUS + <b>CA-125</b> (epithelial); CT/MRI for staging</li>
      <li>Treatment: <b>surgical staging</b> (TAH-BSO, LN sampling, biopsy) → adjuvant chemotherapy</li>
    </ul>
    <div class="sum-key">
      <span class="sum-key-title">نقاط امتحانية</span>
      <ul>
        <li>CA-125 tracks <b>epithelial</b> ovarian tumours; staging is <b>surgical</b>.</li>
      </ul>
    </div>
  </section>

  <section class="topic" id="t-pid" dir="ltr">
    <h3>26. Pelvic Inflammatory Disease</h3>
    <ul>
      <li>Lower abdominal/pelvic pain, abnormal discharge, dysuria, dyspareunia; exam: <b>cervical motion tenderness</b>, adnexal tenderness</li>
    </ul>
    <div class="sum-algo">
      <span class="sum-algo-title">Treatment</span>
      <ol>
        <li>Empirical antibiotics: <b>ceftriaxone + doxycycline</b> (± metronidazole)</li>
        <li>Tubo-ovarian abscess: stable/unruptured → IV antibiotics; unstable/ruptured/&gt;9 cm/no improvement at 48–72 h → <b>drainage</b></li>
      </ol>
    </div>
    <div class="sum-key">
      <span class="sum-key-title">نقاط امتحانية</span>
      <ul>
        <li>Cervical motion tenderness → treat PID <b>empirically</b>; don't wait for cultures.</li>
      </ul>
    </div>
  </section>

  <section class="topic" id="t-asherman" dir="ltr">
    <h3>27. Asherman's Syndrome</h3>
    <ul>
      <li>Intrauterine adhesions after trauma to the <b>endometrial basalis</b> (vigorous D&amp;C, especially post-abortion)</li>
      <li>C/P: <b>secondary amenorrhoea + infertility</b> after D&amp;C, <b>no bleed on estrogen+progesterone withdrawal</b>, normal FSH</li>
      <li>Diagnosis/treatment: <b>hysteroscopy</b> (adhesiolysis)</li>
    </ul>
    <div class="sum-key">
      <span class="sum-key-title">نقاط امتحانية</span>
      <ul>
        <li>Amenorrhoea after D&amp;C + <b>negative progesterone/estrogen withdrawal</b> + normal FSH = Asherman (damaged <b>basalis</b> layer).</li>
      </ul>
    </div>
  </section>

  <section class="topic" id="t-infertility" dir="ltr">
    <h3>28. Infertility</h3>
    <ul>
      <li>Failure to conceive after <b>12 months</b> of regular unprotected intercourse. Causes: <b>ovulatory dysfunction (most common)</b>, tubal (PID/endometriosis), uterine, male factor</li>
    </ul>
    <div class="sum-algo">
      <span class="sum-algo-title">Work-up</span>
      <ol>
        <li>Male: <b>semen analysis</b> first; abnormal → hormonal profile</li>
        <li>Female: ovulation (regular cycles, mid-luteal progesterone) + tubal patency (<b>hysterosalpingogram</b>)</li>
        <li>Unilateral tubal block → confirm laparoscopy + dye → <b>ovulation induction (clomid)</b></li>
        <li>Bilateral block → confirm → <b>IVF</b></li>
      </ol>
    </div>
    <div class="sum-key">
      <span class="sum-key-title">نقاط امتحانية</span>
      <ul>
        <li>Start the couple's work-up with <b>semen analysis</b> (cheap, non-invasive).</li>
        <li>Bilateral tubal disease → <b>IVF</b> bypasses the tubes.</li>
      </ul>
    </div>
  </section>

  <section class="topic" id="t-menopause" dir="ltr">
    <h3>29. Menopause</h3>
    <ul>
      <li>Permanent cessation of periods; C/P: menstrual irregularity at older age, <b>vasomotor hot flushes</b>, mood changes, osteoporosis, atrophic vaginitis</li>
      <li>Labs: <b>FSH &gt;30–40 (hallmark)</b>, LH elevated (less than FSH), low estradiol/progesterone</li>
    </ul>
    <div class="sum-algo">
      <span class="sum-algo-title">Treatment</span>
      <ol>
        <li>Vasomotor: lifestyle → <b>HRT</b> — intact uterus = estrogen + progesterone; post-hysterectomy = <b>estrogen alone</b></li>
        <li>Urogenital symptoms → <b>topical estrogen</b></li>
      </ol>
    </div>
    <div class="sum-key">
      <span class="sum-key-title">نقاط امتحانية</span>
      <ul>
        <li>Intact uterus → <b>never give unopposed estrogen</b> (endometrial cancer risk) — add progesterone.</li>
        <li>Isolated atrophic/urogenital symptoms → <b>topical estrogen</b>.</li>
      </ul>
    </div>
  </section>

  <section class="topic" id="t-contraception" dir="ltr">
    <h3>30. Contraception</h3>
    <table>
      <thead><tr><th>Method</th><th>Key points</th></tr></thead>
      <tbody>
        <tr><td>Progesterone-only / Depo</td><td><b>safe in breastfeeding</b>; Depo long-acting, start 6 wks postpartum</td></tr>
        <tr><td>COCP / vaginal ring</td><td>estrogen-containing → <b>not in breastfeeding</b>; ↑ VTE; C/I in CVD; relieves dysmenorrhoea/menorrhagia</td></tr>
        <tr><td>LNG-IUD (Mirena)</td><td>best for HTN + heavy bleeding (no estrogen); side-effect = irregular bleeding</td></tr>
      </tbody>
    </table>
    <div class="sum-key">
      <span class="sum-key-title">نقاط امتحانية</span>
      <ul>
        <li>Breastfeeding → <b>progestin-only</b> (estrogen suppresses milk + VTE risk).</li>
        <li>HTN + heavy menstrual bleeding → <b>LNG-IUD</b>, avoid estrogen.</li>
        <li>Post-molar (post-D&amp;C) → <b>COCP</b> (reliable, allows β-hCG monitoring; avoid IUD until uterus involutes).</li>
        <li>Postpartum COCP start: 3 wks if no VTE risk; <b>6 wks</b> if age ≥35 / BMI ≥30 / thrombophilia.</li>
      </ul>
    </div>
  </section>

  <section class="topic" id="t-incontinence" dir="ltr">
    <h3>31. Urinary Incontinence</h3>
    <table>
      <thead><tr><th>Type</th><th>Mechanism / clue</th><th>Management</th></tr></thead>
      <tbody>
        <tr><td>Stress</td><td>↑ intra-abdominal pressure → leak on cough/sneeze</td><td>Kegel (1st) → <b>TVT surgery</b> (definitive)</td></tr>
        <tr><td>Urge</td><td>detrusor overactivity → urgency</td><td><b>anticholinergics</b> (oxybutynin)</td></tr>
        <tr><td>Overflow</td><td>obstruction → dribbling, weak stream, incomplete voiding</td><td>relieve obstruction</td></tr>
      </tbody>
    </table>
    <div class="sum-algo">
      <span class="sum-algo-title">Approach</span>
      <ol>
        <li>Urinalysis + culture (exclude UTI)</li>
        <li>Stress → <b>cough stress test</b>; Urge → <b>urodynamics</b></li>
      </ol>
    </div>
    <div class="sum-key">
      <span class="sum-key-title">نقاط امتحانية</span>
      <ul>
        <li>Leak on cough = stress → start <b>pelvic floor exercises</b>; surgery (TVT) if fails.</li>
        <li>Urgency/frequency = urge → <b>anticholinergic</b>; confirm with urodynamics.</li>
      </ul>
    </div>
  </section>

  <section class="topic" id="t-prolapse" dir="ltr">
    <h3>32. Pelvic Organ Prolapse</h3>
    <ul>
      <li>Cystocele (anterior, urinary sx) · rectocele (posterior, bowel sx) · enterocele · <b>vault prolapse</b> (post-hysterectomy)</li>
      <li>Cystocele → measure <b>post-void residual</b> (exclude obstruction)</li>
    </ul>
    <figure class="sum-fig" dir="ltr" aria-label="Pelvic organ prolapse types">
      <svg viewBox="0 0 460 240" xmlns="http://www.w3.org/2000/svg" role="img">
        <title>Cystocele, uterine prolapse and rectocele (sagittal view)</title>
        <!-- vaginal canal -->
        <path d="M215 40 Q205 130 220 215" fill="none" stroke="#c9506f" stroke-width="2.5"/>
        <path d="M250 40 Q262 130 248 215" fill="none" stroke="#c9506f" stroke-width="2.5"/>
        <!-- bladder with cystocele bulge into anterior vaginal wall -->
        <path d="M150 70 Q120 110 160 150 Q205 165 218 120 Q206 90 200 70 Q175 58 150 70 Z" fill="#dfe9fb" stroke="#236ded" stroke-width="2"/>
        <text x="150" y="100" font-family="system-ui" font-size="11" font-weight="700" fill="#236ded">Bladder</text>
        <!-- uterus descending from top -->
        <path d="M215 40 Q233 20 250 40 Q248 70 233 78 Q220 70 215 40 Z" fill="#fbe3ea" stroke="#c9506f" stroke-width="2"/>
        <!-- rectum with rectocele bulge into posterior wall -->
        <path d="M320 70 Q350 110 300 150 Q255 165 250 120 Q262 90 268 70 Q295 58 320 70 Z" fill="#fef0d6" stroke="#d97706" stroke-width="2"/>
        <text x="300" y="100" font-family="system-ui" font-size="11" font-weight="700" fill="#b45309">Rectum</text>
        <!-- arrows to bulges -->
        <g font-family="system-ui" font-size="10.5" fill="#1e293b">
          <text x="120" y="180" fill="#236ded" font-weight="700">Cystocele</text>
          <line x1="160" y1="172" x2="185" y2="150" stroke="#236ded" stroke-width="1.2"/>
          <text x="300" y="180" fill="#b45309" font-weight="700">Rectocele</text>
          <line x1="320" y1="172" x2="285" y2="150" stroke="#b45309" stroke-width="1.2"/>
          <text x="233" y="14" text-anchor="middle" fill="#c9506f" font-weight="700">Uterine descent</text>
        </g>
      </svg>
      <figcaption><b>Cystocele</b> = bladder bulges into the anterior wall (urinary symptoms). <b>Rectocele</b> = rectum bulges into the posterior wall (bowel symptoms). Apical <b>uterine/vault</b> descent comes from above.</figcaption>
    </figure>
    <div class="sum-algo">
      <span class="sum-algo-title">Management</span>
      <ol>
        <li>Conservative (small/asymptomatic/unfit): <b>pessary</b>, pelvic floor exercises</li>
        <li>Surgery (large/symptomatic/fit): uterine/vaginal descent → sacrospinous fixation; rectocele → posterior colporrhaphy; cystocele → anterior colporrhaphy</li>
      </ol>
    </div>
    <div class="sum-key">
      <span class="sum-key-title">نقاط امتحانية</span>
      <ul>
        <li>Unfit/comorbid patient or mild prolapse → <b>pessary</b> before surgery.</li>
      </ul>
    </div>
  </section>

  <section class="topic" id="t-vaginitis" dir="ltr">
    <h3>33. Vaginal Infections</h3>
    <table>
      <thead><tr><th>Infection</th><th>Discharge / clue</th><th>Microscopy</th><th>Treatment</th></tr></thead>
      <tbody>
        <tr><td>Bacterial vaginosis</td><td>grey, fishy odour</td><td><b>clue cells</b></td><td>metronidazole (patient only)</td></tr>
        <tr><td>Trichomoniasis</td><td>frothy yellow-green, <b>strawberry cervix</b></td><td>flagellated protozoa</td><td>metronidazole (treat partner)</td></tr>
        <tr><td>Candida</td><td>cottage-cheese, odourless</td><td>pseudohyphae</td><td>topical azole</td></tr>
        <tr><td>Gonorrhoea</td><td>purulent</td><td>Gram-neg diplococci</td><td>ceftriaxone (treat partner)</td></tr>
        <tr><td>Chlamydia</td><td>purulent/bloody, often silent</td><td>poorly Gram-stained</td><td>azithromycin (treat partner)</td></tr>
      </tbody>
    </table>
    <div class="sum-key">
      <span class="sum-key-title">نقاط امتحانية</span>
      <ul>
        <li>Clue cells → BV (partner not treated); strawberry cervix → trichomonas (<b>treat partner</b>).</li>
        <li>Gonorrhoea + chlamydia are commonly co-treated (<b>ceftriaxone + azithromycin</b>).</li>
      </ul>
    </div>
  </section>

</div>
`;
