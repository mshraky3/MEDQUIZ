// Obstetrics & Gynecology — section content for the continuous-scroll summaries
// page. Sourced from the Confirmed/Probably Confirmed Gyn recall decks +
// ACOG/UpToDate-level knowledge, with algorithms. Angle brackets HTML-escaped.
// Questions authored (no duplicates) with 0-based answer index + explanation.

const obgyn = {
    id: 'obgyn',
    title: 'النساء والولادة',
    title_en: 'Obstetrics & Gynecology',
    icon: '🤰',
    accent: '#f472b6',
    intro: 'أهم مواضيع النساء والولادة عالية العائد: الرعاية قبل الولادة · اضطرابات الضغط والسكري · المخاض والولادة · النزف التوليدي · النزيف الرحمي و PCOS · التهابات النساء · الأورام والكشف · الحمل المبكر وموانع الحمل.',
    subtopics: [
        {
            id: 'obgyn-antenatal',
            title: 'الرعاية قبل الولادة والفحص',
            title_en: 'Antenatal Care & Screening',
            summaryHtml: `
                <ul>
                    <li><b>Folic acid</b>: standard <b>400 µg</b> preconception; <b>5 mg</b> only if high risk (previous NTD, diabetes, on anti-epileptics)</li>
                    <li><b>GDM screening</b>: by risk at booking + 75 g OGTT at 24–28 weeks; manage with diet/exercise → <b>insulin</b> (first-line pharmacotherapy) ± metformin</li>
                    <li>Live vaccines (MMR, varicella, HPV) contraindicated in pregnancy; inactivated influenza &amp; Tdap are recommended</li>
                    <li><b>Rh alloimmunisation</b>: critical titre (≥1:16) at week 11 → repeat/follow-up in 4 weeks (too early for MCA Doppler); week 16+ → <b>MCA Doppler</b> for fetal anaemia. Anti-D at 28 weeks + within 72 h of delivery/sensitising events</li>
                </ul>
                <div class="sum-callout">
                    <b>Algorithm — GDM management</b>
                    <ol>
                        <li>Diagnose with 75 g OGTT at 24–28 weeks (earlier if high risk)</li>
                        <li>Diet + exercise + glucose monitoring</li>
                        <li>Targets not met → <b>insulin</b> (first-line) ± metformin</li>
                        <li>Surveil for macrosomia, polyhydramnios; neonatal hypoglycaemia after birth</li>
                    </ol>
                </div>
            `,
            questions: [
                {
                    q: 'A healthy woman with no risk factors is planning pregnancy and asks about folic acid. What is the recommended preconception dose?',
                    options: ['400 micrograms daily', '5 mg daily', 'No supplementation needed', '5 mg only in the third trimester'],
                    answer: 0,
                    explanation: 'Standard preconception folic acid is 400 µg daily; the high dose of 5 mg is reserved for high-risk women (previous NTD, diabetes, antiepileptic drugs).'
                },
                {
                    q: 'A woman with gestational diabetes does not reach glycaemic targets despite diet and exercise. What is the first-line pharmacological treatment?',
                    options: ['Insulin', 'Glibenclamide', 'A sulfonylurea', 'Empagliflozin'],
                    answer: 0,
                    explanation: 'Insulin is the first-line pharmacotherapy for GDM when lifestyle measures fail; metformin may be used as an adjunct/alternative in selected cases.'
                },
                {
                    q: 'An Rh-negative woman with a critical anti-D titre (1:16) at 16 weeks needs assessment for fetal anaemia. What is the appropriate test?',
                    options: ['Repeat antibody titre only', 'Middle cerebral artery Doppler', 'Amniocentesis for karyotype', 'Cordocentesis immediately'],
                    answer: 1,
                    explanation: 'From around 16–18 weeks, MCA peak systolic velocity Doppler non-invasively detects fetal anaemia; titres are not repeated once critical.'
                },
                {
                    q: 'When is routine antenatal anti-D immunoglobulin given to a non-sensitised Rh-negative woman?',
                    options: ['At 28 weeks and within 72 hours of delivery (and after sensitising events)', 'Only at delivery', 'Monthly throughout pregnancy', 'It is not required'],
                    answer: 0,
                    explanation: 'Routine anti-D is given at 28 weeks and within 72 hours of birth of an Rh-positive baby, plus after any sensitising event (bleeding, trauma, procedures).'
                },
                {
                    q: 'A baby is born to a mother with poorly controlled gestational diabetes. Which neonatal complication should be anticipated in the first hours of life?',
                    options: ['Hypoglycaemia', 'Hyperglycaemia', 'Hypernatraemia', 'Polycythaemia is the only concern'],
                    answer: 0,
                    explanation: 'Fetal hyperinsulinaemia from maternal hyperglycaemia causes neonatal hypoglycaemia after the cord is cut; monitor and feed early.'
                }
            ]
        },
        {
            id: 'obgyn-htn',
            title: 'اضطرابات ضغط الحمل',
            title_en: 'Hypertensive Disorders of Pregnancy',
            summaryHtml: `
                <ul>
                    <li><b>Pre-eclampsia</b> = new HTN ≥20 wks + proteinuria/end-organ features; <b>severe</b> ≥160/110 or symptoms (headache, visual changes, RUQ pain, ↑LFTs, low platelets = HELLP)</li>
                    <li><b>Acute severe HTN</b>: IV <b>labetalol</b> or <b>hydralazine</b> (or oral nifedipine) — not nitroprusside/methyldopa for acute control</li>
                    <li><b>Magnesium sulfate</b> for eclampsia treatment &amp; seizure prophylaxis in severe pre-eclampsia (monitor reflexes/RR/urine; antidote = <b>calcium gluconate</b>)</li>
                    <li>Definitive treatment of pre-eclampsia = <b>delivery</b> (timing by severity &amp; gestation; corticosteroids if preterm)</li>
                    <li>Chronic HTN before pregnancy → optimise/start safe antihypertensives before conceiving</li>
                </ul>
                <div class="sum-callout">
                    <b>Algorithm — severe pre-eclampsia / eclampsia</b>
                    <ol>
                        <li>ABC; control BP with IV labetalol or hydralazine (target &lt;160/110)</li>
                        <li><b>Magnesium sulfate</b> loading + maintenance for seizure control/prophylaxis</li>
                        <li>Corticosteroids if &lt;34 weeks</li>
                        <li><b>Deliver</b> — the only cure (stabilise mother first)</li>
                    </ol>
                </div>
            `,
            questions: [
                {
                    q: 'A woman at 34 weeks has a BP of 170/115, a severe headache and visual disturbance. Besides controlling blood pressure, which drug is given to prevent seizures?',
                    options: ['Magnesium sulfate', 'Phenytoin', 'Diazepam infusion', 'Levetiracetam'],
                    answer: 0,
                    explanation: 'Magnesium sulfate is the agent of choice for seizure prophylaxis in severe pre-eclampsia and for treating eclamptic seizures.'
                },
                {
                    q: 'A pregnant woman needs urgent treatment for a blood pressure of 165/112. Which is an appropriate first-line acute antihypertensive?',
                    options: ['IV labetalol', 'Sodium nitroprusside', 'Oral methyldopa for immediate control', 'IV furosemide'],
                    answer: 0,
                    explanation: 'Acute severe hypertension in pregnancy is treated with IV labetalol or hydralazine (or oral nifedipine); methyldopa is too slow for emergencies and nitroprusside is avoided.'
                },
                {
                    q: 'A woman receiving a magnesium sulfate infusion for eclampsia becomes areflexic with a falling respiratory rate. What is the antidote?',
                    options: ['Calcium gluconate', 'Sodium bicarbonate', 'Naloxone', 'Flumazenil'],
                    answer: 0,
                    explanation: 'Magnesium toxicity (loss of reflexes, respiratory depression) is reversed with IV calcium gluconate; stop the infusion and support ventilation.'
                },
                {
                    q: 'What is the only definitive treatment of pre-eclampsia?',
                    options: ['Delivery of the fetus and placenta', 'Magnesium sulfate', 'Antihypertensives', 'Bed rest'],
                    answer: 0,
                    explanation: 'Delivery is the only cure for pre-eclampsia; magnesium and antihypertensives are stabilising measures while timing delivery by gestation and severity.'
                },
                {
                    q: 'A woman has several risk factors for pre-eclampsia. What reduces her risk during pregnancy?',
                    options: ['Low-dose aspirin started in the first trimester (around 12 weeks)', 'Routine bed rest', 'Salt restriction', 'High-dose vitamin C and E'],
                    answer: 0,
                    explanation: 'Low-dose aspirin from ~12 weeks reduces pre-eclampsia risk in high-risk women; calcium helps in low-intake populations, but vitamins C/E do not.'
                }
            ]
        },
        {
            id: 'obgyn-labor',
            title: 'المخاض والولادة',
            title_en: 'Labor & Delivery',
            summaryHtml: `
                <ul>
                    <li>Stages: 1st (latent &lt;6 cm / active 6→10 cm), 2nd (full dilation→delivery), 3rd (placenta)</li>
                    <li>Slow progress, strong contractions, intact membranes → <b>amniotomy</b>; early latent/irregular with no change → reassure, return in active labour</li>
                    <li><b>Shoulder dystocia</b>: first manoeuvre = <b>McRoberts + suprapubic pressure</b> (then Rubin/Woods screw); risk ↑ with macrosomia/GDM</li>
                    <li>Maternal exhaustion, fetus engaged, late decels → operative vaginal delivery; higher station / non-reassuring earlier → CS</li>
                    <li><b>Breech at 36 wks</b> → external cephalic version at <b>37 weeks</b></li>
                    <li>Fetal surveillance: known FGR → serial growth US; high-risk intrapartum → continuous EFM; umbilical artery <b>absent/reversed end-diastolic flow</b> = deliver</li>
                </ul>
                <div class="sum-callout">
                    <b>Algorithm — shoulder dystocia (HELPERR)</b>
                    <ol>
                        <li>Call for Help; Evaluate for episiotomy</li>
                        <li><b>Legs (McRoberts)</b> + suprapubic <b>Pressure</b></li>
                        <li>Enter manoeuvres (Rubin/Woods); Remove posterior arm</li>
                        <li>Roll the patient (all-fours); last-resort manoeuvres</li>
                    </ol>
                </div>
            `,
            questions: [
                {
                    q: 'During delivery the fetal head retracts against the perineum (turtle sign) and the shoulders do not deliver. What is the appropriate first manoeuvre?',
                    options: ['McRoberts manoeuvre with suprapubic pressure', 'Immediate caesarean section', 'Fundal pressure', 'Vacuum extraction'],
                    answer: 0,
                    explanation: 'For shoulder dystocia, McRoberts positioning with suprapubic pressure is the first step; fundal pressure is contraindicated as it worsens impaction.'
                },
                {
                    q: 'A woman at 37 weeks has a confirmed breech presentation with no contraindications. What is the most appropriate next step?',
                    options: ['Offer external cephalic version', 'Schedule immediate caesarean', 'Plan a vaginal breech delivery without intervention', 'Bed rest until labour'],
                    answer: 0,
                    explanation: 'External cephalic version is offered at around 37 weeks for breech presentation to enable a vaginal cephalic delivery.'
                },
                {
                    q: 'In a fetus with growth restriction, umbilical artery Doppler shows absent end-diastolic flow near term. What does this indicate?',
                    options: ['Normal finding — continue monitoring', 'Significant placental compromise — plan delivery', 'Maternal dehydration', 'A reason to delay delivery for 4 weeks'],
                    answer: 1,
                    explanation: 'Absent or reversed end-diastolic flow signals serious placental insufficiency and is an indication to deliver (often by caesarean near term).'
                },
                {
                    q: 'A woman in active labour has adequate contractions but no cervical change over 4 hours; the membranes are still intact. What is the appropriate next step?',
                    options: ['Amniotomy (artificial rupture of membranes), then oxytocin if needed', 'Immediate caesarean section', 'Reassure and send home', 'Operative vaginal delivery'],
                    answer: 0,
                    explanation: 'For arrest of dilation with intact membranes, amniotomy is the next step, augmenting with oxytocin if progress remains slow.'
                },
                {
                    q: 'Immediately after the membranes rupture, the CTG shows profound fetal bradycardia and a pulsating cord is felt in the vagina. What is the immediate management?',
                    options: ['Elevate the presenting part and arrange emergency caesarean section', 'Augment labour with oxytocin', 'Reassure and continue monitoring', 'Apply forceps immediately'],
                    answer: 0,
                    explanation: 'Cord prolapse is an emergency: relieve cord compression (elevate the presenting part, knee-chest/Trendelenburg) and deliver urgently, usually by caesarean.'
                }
            ]
        },
        {
            id: 'obgyn-hemorrhage',
            title: 'النزف التوليدي',
            title_en: 'Obstetric Hemorrhage',
            summaryHtml: `
                <table>
                    <thead><tr><th></th><th>Placenta praevia</th><th>Abruption</th></tr></thead>
                    <tbody>
                        <tr><td>Pain</td><td>painless</td><td><b>painful</b>, tender uterus</td></tr>
                        <tr><td>Bleeding</td><td>bright red, may be heavy</td><td>may be concealed</td></tr>
                        <tr><td>Mgmt</td><td>NO vaginal exam; pelvic rest; CS if symptomatic/term</td><td>resuscitate; fetal distress/instability → urgent delivery</td></tr>
                    </tbody>
                </table>
                <ul>
                    <li><b>PPH</b> causes (4 Ts): <b>Tone</b> (atony, MC), Trauma, Tissue (retained placenta), Thrombin (coagulopathy)</li>
                    <li>Unstable + ongoing antepartum bleeding (preterm) → resuscitate; CS after one dose of dexamethasone if fetal viability allows</li>
                </ul>
                <div class="sum-callout">
                    <b>Algorithm — PPH from uterine atony</b>
                    <ol>
                        <li>Call for help, resuscitate (two large-bore IV, fluids, cross-match), bimanual massage</li>
                        <li><b>Oxytocin</b> → <b>ergometrine/methylergonovine</b> (avoid in HTN) → <b>carboprost</b> (avoid in asthma) → misoprostol</li>
                        <li>Refractory → intrauterine balloon tamponade</li>
                        <li>Still bleeding → surgery (B-Lynch suture, uterine artery ligation, hysterectomy)</li>
                    </ol>
                </div>
            `,
            questions: [
                {
                    q: 'A woman at 32 weeks presents with sudden painless bright-red vaginal bleeding. The fetus is stable. What examination must be avoided until placenta praevia is excluded?',
                    options: ['Abdominal palpation', 'Digital vaginal examination', 'Ultrasound', 'Maternal blood pressure measurement'],
                    answer: 1,
                    explanation: 'Painless antepartum bleeding suggests placenta praevia; a digital vaginal examination can provoke catastrophic haemorrhage and must be avoided until praevia is excluded by ultrasound.'
                },
                {
                    q: 'A woman with postpartum haemorrhage from uterine atony does not respond to oxytocin and uterine massage. She is asthmatic. Which uterotonic should be avoided?',
                    options: ['Carboprost (prostaglandin F2-alpha)', 'Misoprostol', 'Oxytocin infusion', 'Intrauterine balloon'],
                    answer: 0,
                    explanation: 'Carboprost can cause bronchospasm and is avoided in asthmatics; ergometrine is avoided in hypertension. Misoprostol or a balloon can be used next.'
                },
                {
                    q: 'What is the most common cause of primary postpartum haemorrhage?',
                    options: ['Genital tract trauma', 'Uterine atony', 'Retained placental tissue', 'Coagulopathy'],
                    answer: 1,
                    explanation: 'Uterine atony (the first "T" of the 4 Ts) is the commonest cause of primary PPH.'
                },
                {
                    q: 'A woman at 34 weeks has painful vaginal bleeding with a tender, rigid ("woody-hard") uterus and fetal distress. What is the diagnosis and immediate action?',
                    options: ['Placental abruption — resuscitate and deliver urgently', 'Placenta praevia — perform a vaginal examination', 'Vasa praevia — reassure', 'Uterine atony — give oxytocin'],
                    answer: 0,
                    explanation: 'A painful, tender, rigid uterus with bleeding and fetal compromise indicates abruption; resuscitate the mother and deliver urgently.'
                },
                {
                    q: 'What is the first-line uterotonic for postpartum haemorrhage caused by uterine atony?',
                    options: ['Oxytocin (with uterine massage)', 'Carboprost', 'Misoprostol', 'Tranexamic acid alone'],
                    answer: 0,
                    explanation: 'Oxytocin plus bimanual uterine massage is first-line; ergometrine, carboprost and misoprostol are subsequent agents, with tranexamic acid as an adjunct.'
                }
            ]
        },
        {
            id: 'obgyn-benign-gyn',
            title: 'النزيف الرحمي و PCOS',
            title_en: 'Abnormal Bleeding & PCOS',
            summaryHtml: `
                <ul>
                    <li><b>PCOS</b> (Rotterdam: 2 of 3 — oligo/anovulation, hyperandrogenism, polycystic ovaries): hirsutism without fertility desire → <b>combined OCP</b> (± spironolactone); fertility desired → weight loss + letrozole</li>
                    <li><b>Endometriosis</b>: cyclical pelvic pain, dysmenorrhoea, dyspareunia, infertility; laparoscopy = gold standard → NSAIDs/hormonal suppression</li>
                    <li><b>Adenomyosis</b>: multiparous, symmetrically enlarged tender "boggy" uterus, heavy painful periods</li>
                    <li><b>Fibroids (leiomyoma)</b>: menorrhagia + irregularly enlarged uterus; heavy bleeding + anaemia + wish to preserve fertility → medical/myomectomy; <b>levonorgestrel IUD</b> good for heavy bleeding (esp. with HTN avoiding oestrogen)</li>
                    <li><b>PMDD</b>: severe luteal-phase mood symptoms resolving with menses → SSRI</li>
                </ul>
                <div class="sum-callout">A levonorgestrel intrauterine system (Mirena) is an excellent first choice for heavy menstrual bleeding, especially when oestrogen is contraindicated (e.g. hypertension, migraine with aura).</div>
            `,
            questions: [
                {
                    q: 'A woman with PCOS has troublesome hirsutism and irregular periods but does not currently wish to conceive. What is the first-line treatment?',
                    options: ['Combined oral contraceptive pill', 'Letrozole', 'Metformin alone', 'Clomiphene citrate'],
                    answer: 0,
                    explanation: 'For PCOS hirsutism/menstrual control without fertility desire, the combined OCP is first-line (an antiandrogen such as spironolactone can be added); ovulation induction agents are used when pregnancy is desired.'
                },
                {
                    q: 'A hypertensive woman has heavy menstrual bleeding causing anaemia and wishes to avoid oestrogen. What is the most appropriate management?',
                    options: ['Levonorgestrel intrauterine system', 'Combined oral contraceptive pill', 'Immediate hysterectomy', 'Tranexamic acid only, indefinitely'],
                    answer: 0,
                    explanation: 'The levonorgestrel IUS effectively reduces heavy menstrual bleeding and avoids oestrogen, making it ideal in hypertension.'
                },
                {
                    q: 'A young woman has severe cyclical pelvic pain, dyspareunia and infertility not relieved by NSAIDs. What is the gold-standard diagnostic test for the likely condition?',
                    options: ['Transvaginal ultrasound', 'Laparoscopy', 'Endometrial biopsy', 'CA-125 level'],
                    answer: 1,
                    explanation: 'The clinical picture suggests endometriosis; laparoscopy (with visualisation ± biopsy of lesions) is the gold-standard diagnosis.'
                },
                {
                    q: 'A woman with PCOS wishes to conceive. What is the first-line approach to induce ovulation?',
                    options: ['Weight optimisation plus letrozole (or clomifene)', 'Combined oral contraceptive pill', 'Metformin alone indefinitely', 'In vitro fertilisation as first step'],
                    answer: 0,
                    explanation: 'For fertility in PCOS, lifestyle/weight optimisation with letrozole (or clomifene) is first-line ovulation induction.'
                },
                {
                    q: 'A 38-year-old has heavy menstrual bleeding from symptomatic fibroids and strongly wishes to preserve fertility. Which surgical option is appropriate?',
                    options: ['Myomectomy', 'Hysterectomy', 'Endometrial ablation', 'Bilateral salpingo-oophorectomy'],
                    answer: 0,
                    explanation: 'Myomectomy removes fibroids while preserving the uterus and fertility; hysterectomy and ablation are unsuitable when fertility must be retained.'
                }
            ]
        },
        {
            id: 'obgyn-infections',
            title: 'التهابات النساء',
            title_en: 'Gynecologic Infections',
            summaryHtml: `
                <table>
                    <thead><tr><th>Infection</th><th>Clue</th><th>Treatment</th></tr></thead>
                    <tbody>
                        <tr><td>Bacterial vaginosis</td><td>thin grey discharge, fishy odour, +<b>whiff test</b>, pH &gt;4.5, clue cells</td><td>Metronidazole</td></tr>
                        <tr><td>Trichomoniasis</td><td>frothy green discharge, strawberry cervix, motile flagellates</td><td>Metronidazole (treat partner)</td></tr>
                        <tr><td>Candidiasis</td><td>thick white "cottage cheese", itch, normal pH</td><td>Fluconazole / topical azole</td></tr>
                    </tbody>
                </table>
                <ul>
                    <li><b>PID</b>: lower abdominal pain + cervical motion tenderness + discharge → empirical ceftriaxone + doxycycline ± metronidazole; complication = tubo-ovarian abscess, infertility, ectopic risk</li>
                    <li><b>Chlamydia/gonorrhoea</b>: often asymptomatic → NAAT; treat both partners; gonorrhoea = ceftriaxone, chlamydia = doxycycline/azithromycin</li>
                </ul>
            `,
            questions: [
                {
                    q: 'A woman has a thin grey vaginal discharge with a fishy odour; the pH is 5.0, the whiff test is positive and clue cells are seen. What is the treatment?',
                    options: ['Metronidazole', 'Fluconazole', 'Ceftriaxone', 'Aciclovir'],
                    answer: 0,
                    explanation: 'Clue cells, pH &gt;4.5 and a positive whiff test indicate bacterial vaginosis, treated with metronidazole.'
                },
                {
                    q: 'A sexually active woman has lower abdominal pain, vaginal discharge and marked cervical motion tenderness. What is the most appropriate management?',
                    options: ['Empirical antibiotics for pelvic inflammatory disease', 'Reassurance and analgesia', 'Antifungal pessary', 'Wait for culture results before any treatment'],
                    answer: 0,
                    explanation: 'Cervical motion tenderness with pelvic pain indicates PID; empirical broad antibiotics (e.g. ceftriaxone + doxycycline ± metronidazole) are started promptly to protect fertility.'
                },
                {
                    q: 'A woman has a frothy green-yellow vaginal discharge and a "strawberry cervix". What is the causative organism and treatment?',
                    options: ['Candida — fluconazole', 'Trichomonas vaginalis — metronidazole (treat partner)', 'Gardnerella — clindamycin only', 'HSV — aciclovir'],
                    answer: 1,
                    explanation: 'A frothy discharge with a strawberry cervix is trichomoniasis; treat with metronidazole and treat the sexual partner.'
                },
                {
                    q: 'A woman has a thick white "cottage cheese" vaginal discharge with intense itch and a normal vaginal pH. What is the treatment?',
                    options: ['Fluconazole (or a topical azole)', 'Metronidazole', 'Ceftriaxone', 'Aciclovir'],
                    answer: 0,
                    explanation: 'Vulvovaginal candidiasis (thick white discharge, itch, normal pH) is treated with an antifungal such as fluconazole or a topical azole.'
                },
                {
                    q: 'A woman with mucopurulent cervicitis tests positive for Neisseria gonorrhoeae. What is the appropriate treatment?',
                    options: ['Ceftriaxone (plus cover for chlamydia, and treat the partner)', 'Metronidazole', 'Fluconazole', 'Nitrofurantoin'],
                    answer: 0,
                    explanation: 'Gonorrhoea is treated with ceftriaxone; co-treat for chlamydia (e.g. doxycycline) and manage sexual partners.'
                }
            ]
        },
        {
            id: 'obgyn-oncology',
            title: 'أورام النساء والكشف',
            title_en: 'Gyn Oncology & Screening',
            summaryHtml: `
                <ul>
                    <li><b>Cervical screening</b>: ASCUS → reflex HPV testing; AGC (atypical glandular cells) → <b>colposcopy + endocervical/endometrial sampling</b>; high-grade lesion → colposcopy/LLETZ. HPV 16 &amp; 18 cause most cervical cancers (prevention = HPV vaccine + screening)</li>
                    <li><b>Postmenopausal bleeding</b> (esp. obese/diabetic/on HRT) → essential test = <b>endometrial biopsy</b> (rule out endometrial carcinoma); transvaginal US measures endometrial thickness</li>
                    <li>On <b>tamoxifen</b> with abnormal bleeding + inadequate biopsy → hysteroscopy with directed biopsy</li>
                    <li><b>Ovarian cancer</b>: older woman, ascites + adnexal mass ± pleural effusion → CA-125 + imaging → surgical staging; often presents late</li>
                </ul>
                <div class="sum-callout"><b>Key rule</b>: any postmenopausal bleeding is endometrial cancer until proven otherwise — investigate with transvaginal ultrasound and endometrial biopsy.</div>
            `,
            questions: [
                {
                    q: 'A 58-year-old obese woman with diabetes presents with postmenopausal vaginal bleeding. What is the essential investigation?',
                    options: ['Reassurance and review in 6 months', 'Endometrial biopsy', 'Cervical smear only', 'CA-125 level'],
                    answer: 1,
                    explanation: 'Postmenopausal bleeding must be investigated to exclude endometrial carcinoma; endometrial biopsy (with transvaginal ultrasound) is essential.'
                },
                {
                    q: 'A cervical screening result shows atypical glandular cells (AGC). What is the appropriate next step?',
                    options: ['Repeat smear in 3 years', 'Colposcopy with endocervical and endometrial sampling', 'Reassurance', 'HPV vaccination only'],
                    answer: 1,
                    explanation: 'AGC carries a risk of glandular neoplasia (cervical or endometrial), so it requires colposcopy plus endocervical and endometrial sampling rather than simple repeat cytology.'
                },
                {
                    q: 'Which two HPV genotypes are responsible for the majority of cervical cancers?',
                    options: ['HPV 6 and 11', 'HPV 16 and 18', 'HPV 31 and 33', 'HPV 1 and 2'],
                    answer: 1,
                    explanation: 'HPV 16 and 18 cause around 70% of cervical cancers; HPV 6 and 11 cause genital warts.'
                },
                {
                    q: 'A routine cervical smear is reported as ASCUS (atypical squamous cells of undetermined significance). What is the recommended next step?',
                    options: ['Reflex HPV testing', 'Immediate hysterectomy', 'Repeat smear in 5 years', 'Cold-knife conisation'],
                    answer: 0,
                    explanation: 'ASCUS is triaged with reflex HPV testing; HPV-positive results proceed to colposcopy, HPV-negative return to routine screening.'
                },
                {
                    q: 'Which is the strongest risk factor for endometrial carcinoma?',
                    options: ['Obesity / unopposed oestrogen exposure', 'Multiparity', 'Combined oral contraceptive use', 'Cigarette smoking'],
                    answer: 0,
                    explanation: 'Prolonged unopposed oestrogen (obesity, anovulation, oestrogen-only HRT, tamoxifen) drives endometrial cancer; COCs, multiparity and smoking are associated with lower risk.'
                }
            ]
        },
        {
            id: 'obgyn-early-pregnancy',
            title: 'الحمل المبكر وموانع الحمل',
            title_en: 'Early Pregnancy & Contraception',
            summaryHtml: `
                <ul>
                    <li><b>Ectopic pregnancy</b>: amenorrhoea + pain + bleeding; β-hCG + TVUS (empty uterus with hCG above discriminatory zone); <b>methotrexate</b> if stable/small/low hCG, <b>surgery</b> if ruptured/unstable</li>
                    <li><b>Molar pregnancy</b>: very high β-hCG + "snowstorm" US → suction D&amp;C + serial β-hCG; use <b>COCs</b> for contraception during monitoring (avoid IUD until uterus involutes)</li>
                    <li><b>Miscarriage / IUFD</b>: management depends on gestation — expectant, medical (misoprostol), or surgical evacuation (caution with prior CS)</li>
                    <li><b>Recurrent pregnancy loss</b>: ≥2–3 losses → workup; <b>antiphospholipid syndrome</b> is a key treatable cause (aspirin + LMWH)</li>
                    <li><b>Cervical insufficiency</b>: painless mid-trimester loss → history-indicated cerclage ~12–14 weeks</li>
                    <li><b>Contraception</b>: progestin-only safe in breastfeeding; COCs from 3 weeks postpartum (6 weeks if age ≥35 / BMI ≥30 / thrombophilia)</li>
                </ul>
                <div class="sum-callout">
                    <b>Algorithm — suspected ectopic pregnancy</b>
                    <ol>
                        <li>β-hCG + transvaginal ultrasound</li>
                        <li>Empty uterus + hCG above discriminatory zone → suspect ectopic</li>
                        <li>Stable, small, unruptured, low hCG → <b>methotrexate</b></li>
                        <li>Rupture / haemodynamic instability → <b>emergency surgery</b></li>
                    </ol>
                </div>
            `,
            questions: [
                {
                    q: 'A haemodynamically stable woman has a small unruptured tubal ectopic pregnancy with a low beta-hCG and no fetal cardiac activity. What is an appropriate treatment?',
                    options: ['Methotrexate', 'Emergency laparotomy', 'Expectant management with no follow-up', 'Dilation and curettage'],
                    answer: 0,
                    explanation: 'A stable, small, unruptured ectopic with low/declining hCG can be managed medically with methotrexate; surgery is for rupture or instability.'
                },
                {
                    q: 'A woman is found to have a complete molar pregnancy and undergoes suction evacuation. Which contraceptive is recommended during beta-hCG monitoring?',
                    options: ['Combined oral contraceptive pill', 'Copper intrauterine device immediately', 'No contraception needed', 'Permanent sterilisation'],
                    answer: 0,
                    explanation: 'COCs are reliable and allow β-hCG to be monitored for persistent trophoblastic disease; an IUD is avoided until the uterus has involuted.'
                },
                {
                    q: 'A woman has had three first-trimester miscarriages. Which treatable condition should be specifically tested for?',
                    options: ['Antiphospholipid syndrome', 'Iron-deficiency anaemia', 'Gestational diabetes', 'Hypothyroidism only'],
                    answer: 0,
                    explanation: 'Antiphospholipid syndrome is a key treatable cause of recurrent pregnancy loss; treatment with aspirin and LMWH improves outcomes.'
                },
                {
                    q: 'A woman at 8 weeks has light vaginal bleeding; the cervical os is closed and ultrasound confirms a viable intrauterine pregnancy. What is the diagnosis?',
                    options: ['Threatened miscarriage', 'Inevitable miscarriage', 'Missed miscarriage', 'Complete miscarriage'],
                    answer: 0,
                    explanation: 'Bleeding with a closed os and a viable intrauterine pregnancy is a threatened miscarriage; management is expectant with safety-netting.'
                },
                {
                    q: 'A woman has a positive pregnancy test, an empty uterus on transvaginal ultrasound and a beta-hCG above the discriminatory zone. What is the most concerning diagnosis?',
                    options: ['Ectopic pregnancy', 'Normal early intrauterine pregnancy', 'Complete miscarriage', 'Molar pregnancy'],
                    answer: 0,
                    explanation: 'An empty uterus with hCG above the discriminatory level should be treated as an ectopic pregnancy until proven otherwise.'
                }
            ]
        }
    ]
};

export default obgyn;
