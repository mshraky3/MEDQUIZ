// Pediatrics — section content for the continuous-scroll summaries page.
// Sourced from "Pediatrics SMLE Summary" (Nelson Essentials 7th Ed.) + recall
// decks, with algorithms. Angle brackets HTML-escaped. Questions authored
// (no duplicates) with 0-based answer index + explanation.

const pediatrics = {
    id: 'pediatrics',
    title: 'طب الأطفال',
    title_en: 'Pediatrics',
    icon: '🧒',
    accent: '#f59e0b',
    intro: 'أهم مواضيع طب الأطفال عالية العائد: حديثو الولادة · النمو والتطعيمات · القلب والصدر · الهضم والتغذية · الأمراض المعدية · الدم والأورام · الأعصاب والكلى · الطوارئ — مبني على Nelson Essentials.',
    subtopics: [
        {
            id: 'peds-neonatology',
            title: 'حديثو الولادة',
            title_en: 'Neonatology',
            summaryHtml: `
                <h4>Delivery room &amp; resuscitation</h4>
                <ul>
                    <li>APGAR (1 &amp; 5 min): Appearance, Pulse, Grimace, Activity, Respiration</li>
                    <li>Warm/dry/stimulate → apnoea or HR &lt;100 → PPV; HR &lt;60 despite effective ventilation → chest compressions (3:1) → adrenaline</li>
                    <li><b>HIE</b>: perinatal asphyxia + encephalopathy (term ≥36 wks) → <b>therapeutic hypothermia within 6 h</b></li>
                </ul>
                <h4>Respiratory distress</h4>
                <table>
                    <thead><tr><th>Condition</th><th>Clue</th><th>Management</th></tr></thead>
                    <tbody>
                        <tr><td>RDS</td><td>premature; ground-glass + air bronchograms</td><td>CPAP + surfactant; prevent: antenatal steroids</td></tr>
                        <tr><td>TTN</td><td>term/C-section; fluid in fissures; resolves 24–72 h</td><td>supportive O2</td></tr>
                        <tr><td>Meconium aspiration</td><td>post-term; hyperinflation, patchy infiltrates</td><td>ventilation; ECMO if refractory</td></tr>
                    </tbody>
                </table>
                <h4>Jaundice, sepsis, NEC</h4>
                <ul>
                    <li><b>Pathological jaundice</b>: &lt;24 h, rising fast, conjugated, or &gt;2 weeks. &lt;24 h → haemolysis (ABO/Rh, G6PD) → Coombs; high unconjugated → phototherapy → exchange (prevent <b>kernicterus</b>); conjugated + pale stools → <b>biliary atresia</b> → Kasai &lt;60 days</li>
                    <li><b>Sepsis</b>: early (&lt;72 h, GBS/E. coli) → <b>Ampicillin + Gentamicin</b>; late (&gt;72 h, Staph epidermidis/Listeria) → Vancomycin + Gentamicin</li>
                    <li><b>NEC</b> (premature + formula): distension, bloody stool, <b>pneumatosis intestinalis</b> → NPO, IV antibiotics, TPN; surgery if perforation</li>
                </ul>
            `,
            questions: [
                {
                    q: 'A term newborn with perinatal asphyxia has a 5-minute APGAR of 3 and develops encephalopathy. Within what window should therapeutic hypothermia be started to improve outcome?',
                    options: ['Within 6 hours of birth', 'Within 24 hours of birth', 'After 48 hours', 'Only after seizures occur'],
                    answer: 0,
                    explanation: 'Therapeutic hypothermia for moderate–severe HIE in infants ≥36 weeks must begin within 6 hours of birth for neuroprotective benefit.'
                },
                {
                    q: 'A premature neonate develops worsening abdominal distension and bloody stools; the abdominal X-ray shows pneumatosis intestinalis. What is the diagnosis?',
                    options: ['Hirschsprung disease', 'Necrotising enterocolitis', 'Duodenal atresia', 'Pyloric stenosis'],
                    answer: 1,
                    explanation: 'Pneumatosis intestinalis (intramural gas) in a premature, formula-fed neonate with distension and bloody stools is pathognomonic of NEC.'
                },
                {
                    q: 'A neonate develops jaundice in the first 12 hours of life. What does this timing most suggest?',
                    options: ['Physiological jaundice', 'Breast-milk jaundice', 'Haemolytic disease', 'Biliary atresia'],
                    answer: 2,
                    explanation: 'Jaundice within 24 hours is always pathological and most often reflects haemolysis (ABO/Rh incompatibility, G6PD) — check Coombs, group and blood film.'
                },
                {
                    q: 'Which empirical antibiotic combination is first-line for suspected early-onset (&lt;72 h) neonatal sepsis?',
                    options: ['Vancomycin + gentamicin', 'Ampicillin + gentamicin', 'Ceftriaxone alone', 'Meropenem alone'],
                    answer: 1,
                    explanation: 'Early-onset sepsis (GBS, E. coli, Listeria) is covered with ampicillin + gentamicin; vancomycin + gentamicin is used for late-onset (line-associated) sepsis.'
                },
                {
                    q: 'A 3-week-old has prolonged jaundice with pale stools, dark urine and a raised conjugated bilirubin. What is the priority?',
                    options: ['Reassurance — this is breast-milk jaundice', 'Urgent evaluation for biliary atresia (ultrasound/HIDA)', 'Start phototherapy', 'Exchange transfusion'],
                    answer: 1,
                    explanation: 'Conjugated (direct) jaundice with pale stools is never physiological — investigate urgently for biliary atresia, as the Kasai procedure must be done before 60 days.'
                },
                {
                    q: 'An infant of a diabetic mother is jittery 2 hours after birth with a glucose of 1.8 mmol/L. What is the management?',
                    options: ['Feed (or IV dextrose) and recheck glucose', 'Give insulin', 'Reassurance only', 'Start phenobarbital'],
                    answer: 0,
                    explanation: 'Neonatal hypoglycaemia (common in infants of diabetic mothers) is treated with feeding or IV dextrose and glucose monitoring.'
                }
            ]
        },
        {
            id: 'peds-growth-dev',
            title: 'النمو والتطور والتطعيمات',
            title_en: 'Growth, Development & Vaccines',
            summaryHtml: `
                <table>
                    <thead><tr><th>Age</th><th>Gross motor</th><th>Language</th><th>Social</th></tr></thead>
                    <tbody>
                        <tr><td>2 mo</td><td>lifts head 45°</td><td>coos</td><td>social smile</td></tr>
                        <tr><td>6 mo</td><td>sits with support; rolls</td><td>babbles</td><td>stranger anxiety</td></tr>
                        <tr><td>9 mo</td><td>cruises</td><td>mama/dada (non-specific)</td><td>separation anxiety</td></tr>
                        <tr><td>12 mo</td><td>walks alone</td><td>1–3 words</td><td>waves bye-bye</td></tr>
                        <tr><td>2 yr</td><td>jumps; kicks ball</td><td>2-word phrases</td><td>parallel play</td></tr>
                        <tr><td>3 yr</td><td>tricycle; copies circle</td><td>3-word sentences</td><td>group play</td></tr>
                    </tbody>
                </table>
                <ul>
                    <li><b>SIDS</b>: peak 2–4 mo; prone sleeping = strongest risk → <b>supine "Back to Sleep"</b>, firm flat surface, room-sharing not bed-sharing</li>
                    <li><b>Short stature</b>: bone age is the key initial test — constitutional delay (MC, +FHx) vs GH deficiency (↓IGF-1) vs hypothyroidism vs Turner (karyotype)</li>
                    <li><b>Dehydration</b>: mild → ORS 50 ml/kg; moderate → 100 ml/kg; severe (≥10%, AMS) → IV NS 20 ml/kg bolus. Holliday-Segar maintenance 100/50/20 ml/kg/day</li>
                </ul>
                <div class="sum-callout">
                    <b>VACCINE RULES</b>: all viral vaccines are LIVE except HepB, HepA, IPV, inactivated influenza, HPV. Live vaccines are contraindicated in pregnancy &amp; significant immunocompromise. NOT contraindications: mild illness, recent antibiotics, stable chronic disease.
                </div>
            `,
            questions: [
                {
                    q: 'Parents of a healthy 2-month-old ask how to reduce the risk of sudden infant death syndrome. What is the single most effective advice?',
                    options: ['Place the baby to sleep on the back (supine)', 'Use a soft pillow for comfort', 'Have the baby sleep in the parents’ bed', 'Keep the room warm with extra blankets'],
                    answer: 0,
                    explanation: 'Supine sleeping ("Back to Sleep") is the strongest modifiable factor against SIDS; soft bedding, bed-sharing and overheating increase risk.'
                },
                {
                    q: 'A short 8-year-old boy has a strong family history of "late bloomers" and is otherwise well. What is the most useful initial investigation?',
                    options: ['Bone age (left wrist X-ray)', 'Karyotype', 'Growth hormone stimulation test', 'Brain MRI'],
                    answer: 0,
                    explanation: 'Bone age separates constitutional growth delay (delayed bone age, good prognosis) from other causes and guides further testing.'
                },
                {
                    q: 'A 1-year-old with leukaemia in remission is due routine immunisations. Which vaccine is contraindicated while significantly immunocompromised?',
                    options: ['Inactivated influenza', 'MMR (live)', 'Hepatitis B', 'Inactivated polio (IPV)'],
                    answer: 1,
                    explanation: 'Live vaccines such as MMR and varicella are contraindicated in significant immunocompromise; inactivated vaccines are safe.'
                },
                {
                    q: 'A 2-year-old with gastroenteritis has moderate dehydration and is tolerating oral fluids. What is the preferred rehydration approach?',
                    options: ['IV normal saline bolus', 'Oral rehydration solution', 'Withhold all fluids for 24 hours', 'Plain water only'],
                    answer: 1,
                    explanation: 'Oral rehydration solution is first-line for mild–moderate dehydration; IV fluids are reserved for severe dehydration or failure of oral therapy.'
                },
                {
                    q: 'By which age should a healthy infant be able to sit without support, such that failure to do so warrants developmental assessment?',
                    options: ['9 months', '4 months', '6 months', '15 months'],
                    answer: 0,
                    explanation: 'Not sitting unsupported by 9 months is a recognised gross-motor red flag warranting evaluation.'
                },
                {
                    q: 'A child is due routine vaccines but has a mild upper respiratory infection with a low-grade fever. What should be done?',
                    options: ['Proceed with vaccination', 'Defer all vaccines for 2 weeks', 'Give only inactivated vaccines today', 'Defer until completely symptom-free for a month'],
                    answer: 0,
                    explanation: 'Mild illness with low-grade fever is NOT a contraindication to vaccination; vaccines should be given on schedule.'
                }
            ]
        },
        {
            id: 'peds-cardio-resp',
            title: 'القلب والجهاز التنفسي',
            title_en: 'Cardiology & Respiratory',
            summaryHtml: `
                <h4>Congenital heart disease</h4>
                <ul>
                    <li><b>VSD</b> (MC CHD): harsh pansystolic LLSB; small → observe, large → diuretics/surgery</li>
                    <li><b>ASD</b>: <b>fixed wide split S2</b> → device/surgical closure</li>
                    <li><b>TOF</b> (MC cyanotic &gt;1 yr): boot-shaped heart; Tet spell → knee-chest, O2, morphine, propranolol, fluids</li>
                    <li><b>TGA</b>: cyanosis at birth not improving with O2 → <b>PGE1</b> → balloon septostomy → arterial switch</li>
                    <li><b>CoA</b>: BP upper ≫ lower, weak femoral pulses; assoc Turner → PGE1 if duct-dependent</li>
                </ul>
                <div class="sum-callout"><b>Duct-dependent lesion</b> (e.g. TGA, critical CoA, pulmonary atresia) → keep the duct open with <b>Prostaglandin E1</b> until definitive repair.</div>
                <h4>Respiratory infections</h4>
                <table>
                    <thead><tr><th>Condition</th><th>Clue</th><th>Management</th></tr></thead>
                    <tbody>
                        <tr><td>Croup</td><td>parainfluenza; barking cough, stridor; steeple sign</td><td>dexamethasone; severe → nebulised adrenaline</td></tr>
                        <tr><td>Epiglottitis</td><td>Hib; drooling, tripod; thumbprint sign</td><td><b>do NOT examine throat</b>; secure airway → ceftriaxone</td></tr>
                        <tr><td>Bronchiolitis</td><td>RSV &lt;2 yr; crackles + wheeze</td><td>supportive O2/feeding</td></tr>
                    </tbody>
                </table>
                <ul>
                    <li><b>Asthma</b>: stepwise PRN SABA → low-dose ICS → ICS+LABA; acute severe → O2 + SABA + ipratropium + steroids; <b>silent chest = impending respiratory failure</b></li>
                </ul>
            `,
            questions: [
                {
                    q: 'A neonate becomes deeply cyanotic within hours of birth with no improvement on 100% oxygen; the chest X-ray shows an "egg-on-a-string" heart. What is the immediate life-saving drug?',
                    options: ['Indomethacin', 'Prostaglandin E1', 'Adenosine', 'Furosemide'],
                    answer: 1,
                    explanation: 'Transposition of the great arteries is duct-dependent; prostaglandin E1 keeps the ductus arteriosus open to allow mixing until balloon septostomy/repair.'
                },
                {
                    q: 'A 3-year-old has a barking cough, inspiratory stridor and a "steeple sign" on neck X-ray. What is the appropriate treatment?',
                    options: ['Corticosteroids (dexamethasone)', 'Immediate intubation', 'IV ceftriaxone and avoid examining the throat', 'Salbutamol nebuliser'],
                    answer: 0,
                    explanation: 'This is croup (laryngotracheitis); dexamethasone is given, with nebulised adrenaline for severe stridor. Throat examination caution applies to epiglottitis, not croup.'
                },
                {
                    q: 'On routine exam, a child is found to have a fixed, widely split second heart sound. Which lesion does this classically indicate?',
                    options: ['Ventricular septal defect', 'Atrial septal defect', 'Patent ductus arteriosus', 'Tetralogy of Fallot'],
                    answer: 1,
                    explanation: 'A fixed, widely split S2 is the classic sign of an atrial septal defect.'
                },
                {
                    q: 'A toddler with tetralogy of Fallot turns acutely cyanotic and irritable (a "tet spell"). What is the first manoeuvre?',
                    options: ['Place the child in a knee-to-chest position', 'Give IV furosemide', 'Give IV adenosine', 'Lay the child flat'],
                    answer: 0,
                    explanation: 'Knee-to-chest positioning increases systemic vascular resistance and reduces right-to-left shunting; add oxygen, morphine, fluids and beta-blocker as needed.'
                },
                {
                    q: 'An 8-month-old with RSV bronchiolitis has mild respiratory distress but is feeding and maintaining saturations. What is the appropriate management?',
                    options: ['Supportive care (monitoring, feeding/oxygen support as needed)', 'Nebulised salbutamol', 'Oral corticosteroids', 'Empirical antibiotics'],
                    answer: 0,
                    explanation: 'Bronchiolitis is managed supportively; bronchodilators, steroids and antibiotics are not routinely effective.'
                },
                {
                    q: 'A 4-year-old has a high fever, drooling, muffled voice and a tripod posture. What is the correct approach?',
                    options: ['Do not examine the throat; secure the airway and give IV ceftriaxone', 'Examine the throat with a tongue depressor', 'Give nebulised adrenaline and discharge', 'Oral antibiotics at home'],
                    answer: 0,
                    explanation: 'This is epiglottitis — avoid throat examination (can precipitate complete obstruction); secure the airway in a controlled setting and give IV antibiotics.'
                }
            ]
        },
        {
            id: 'peds-gi',
            title: 'الجهاز الهضمي والتغذية',
            title_en: 'GI & Nutrition',
            summaryHtml: `
                <ul>
                    <li><b>Pyloric stenosis</b>: 2–8 wk, non-bilious <b>projectile</b> vomiting, hungry, olive mass → US → <b>hypochloraemic hypokalaemic metabolic alkalosis</b> → correct electrolytes FIRST → pyloromyotomy</li>
                    <li><b>Intussusception</b>: 6 mo–3 yr, colicky pain (knees to chest), <b>currant-jelly stool</b>, sausage RUQ mass → US <b>target sign</b> → air/contrast enema (diagnostic + therapeutic); surgery if peritonitis/perforation/failed</li>
                    <li><b>Hirschsprung</b>: failure to pass meconium &lt;48 h → contrast enema transition zone → <b>suction rectal biopsy</b> (gold standard) → pull-through</li>
                    <li><b>Malrotation/volvulus</b>: <b>bilious vomiting</b> in a neonate → urgent upper GI contrast → emergency surgery (Ladd procedure)</li>
                    <li><b>Coeliac</b>: anti-tTG IgA screen, duodenal biopsy (villous atrophy) → gluten-free diet (assoc Down, T1DM)</li>
                    <li><b>GERD</b> (infant): normal growth/exam → reassurance &amp; positioning; failure to thrive/complications → PPI</li>
                </ul>
                <div class="sum-callout">
                    <b>Algorithm — bilious vomiting in a neonate</b>
                    <ol>
                        <li>Bilious vomiting = surgical until proven otherwise</li>
                        <li>Resuscitate (NPO, NG, IV fluids) + surgical consult</li>
                        <li>Stable → <b>upper GI contrast</b> (rule out malrotation/volvulus)</li>
                        <li>Volvulus / peritonitis → emergency laparotomy</li>
                    </ol>
                </div>
            `,
            questions: [
                {
                    q: 'A 5-week-old has progressive non-bilious projectile vomiting and is hungry after feeds. Blood gas shows a hypochloraemic hypokalaemic metabolic alkalosis. What is the immediate priority before surgery?',
                    options: ['Urgent pyloromyotomy', 'Correct fluid and electrolyte abnormalities', 'Start IV antibiotics', 'Barium enema'],
                    answer: 1,
                    explanation: 'Pyloric stenosis is corrected medically first — rehydration and electrolyte correction — because pyloromyotomy is not an emergency and operating before correction is dangerous.'
                },
                {
                    q: 'A 9-month-old has episodes of drawing up the legs in pain, a "currant-jelly" stool and a sausage-shaped right-sided mass. What is the best initial diagnostic and therapeutic step (no peritonitis)?',
                    options: ['Immediate laparotomy', 'Air (or contrast) enema', 'Oral rehydration and observation', 'Upper GI endoscopy'],
                    answer: 1,
                    explanation: 'Intussusception without peritonitis is both diagnosed and reduced by air/contrast enema; surgery is reserved for failure, perforation or peritonitis.'
                },
                {
                    q: 'A 2-day-old neonate has not passed meconium and now has abdominal distension; a contrast enema shows a transition zone. What is the gold-standard diagnostic test?',
                    options: ['Suction rectal biopsy', 'Abdominal ultrasound', 'Anorectal manometry alone', 'Stool culture'],
                    answer: 0,
                    explanation: 'Hirschsprung disease is confirmed by suction rectal biopsy showing absent ganglion cells.'
                },
                {
                    q: 'A previously well neonate suddenly develops bilious (green) vomiting. What is the most important consideration?',
                    options: ['Physiological reflux — reassure', 'Malrotation with midgut volvulus — surgical emergency', 'Overfeeding', 'Cow’s milk protein allergy'],
                    answer: 1,
                    explanation: 'Bilious vomiting in a neonate is a surgical emergency until malrotation/volvulus is excluded with an urgent upper GI contrast study.'
                },
                {
                    q: 'A 2-year-old has painless, brick-red rectal bleeding. A Meckel diverticulum is suspected. What is the best diagnostic test?',
                    options: ['Technetium-99m pertechnetate (Meckel) scan', 'Colonoscopy', 'Barium enema', 'Abdominal ultrasound'],
                    answer: 0,
                    explanation: 'A Meckel diverticulum with ectopic gastric mucosa is identified by a technetium-99m pertechnetate scan.'
                },
                {
                    q: 'A thriving 6-week-old has frequent effortless regurgitation after feeds with a normal examination and good weight gain. What is the management?',
                    options: ['Reassurance and positional/feeding advice', 'Start a proton pump inhibitor', 'Abdominal ultrasound for pyloric stenosis', 'Switch to nasogastric feeding'],
                    answer: 0,
                    explanation: 'Physiological infant GERD with normal growth needs only reassurance and conservative measures; medication is reserved for complications or failure to thrive.'
                }
            ]
        },
        {
            id: 'peds-infectious',
            title: 'الأمراض المعدية والطفح',
            title_en: 'Infectious Diseases & Exanthems',
            summaryHtml: `
                <table>
                    <thead><tr><th>Disease</th><th>Pathogen</th><th>Key</th></tr></thead>
                    <tbody>
                        <tr><td>Measles</td><td>Paramyxovirus</td><td>Koplik spots; 3Cs (cough, coryza, conjunctivitis); descending rash</td></tr>
                        <tr><td>Rubella</td><td>Togavirus</td><td>post-auricular LAD; teratogenic 1st trimester</td></tr>
                        <tr><td>Roseola</td><td>HHV-6</td><td>high fever 3–5 d → rash as fever breaks; febrile seizure</td></tr>
                        <tr><td>Fifth disease</td><td>Parvovirus B19</td><td>slapped cheek; aplastic crisis in SCD</td></tr>
                        <tr><td>Scarlet fever</td><td>GAS</td><td>sandpaper rash, strawberry tongue → penicillin</td></tr>
                    </tbody>
                </table>
                <ul>
                    <li><b>Kawasaki</b>: fever &gt;5 d + 4/5 (conjunctivitis, mucositis, rash, cervical LAD, extremity changes); <b>coronary aneurysm</b> is the feared complication → <b>IVIG + aspirin within 10 days</b> + echo</li>
                    <li><b>Otitis media</b>: S. pneumoniae MC; &lt;2 yr → amoxicillin; &gt;2 yr only if severe</li>
                    <li><b>Bloody diarrhoea — E. coli O157:H7</b>: NO antibiotics (HUS risk)</li>
                    <li><b>Septic arthritis</b> (hip MC, refuses to bear weight) → arthrocentesis (WBC &gt;50,000) → Staph aureus → IV antibiotics</li>
                </ul>
            `,
            questions: [
                {
                    q: 'A 3-year-old has had fever for 6 days with bilateral non-purulent conjunctivitis, cracked red lips, a polymorphous rash, cervical lymphadenopathy and red swollen hands. What is the most important treatment?',
                    options: ['Oral antibiotics', 'IVIG plus aspirin', 'Supportive care only', 'Oral aciclovir'],
                    answer: 1,
                    explanation: 'This is Kawasaki disease; IVIG plus aspirin within 10 days reduces the risk of coronary artery aneurysms — the major complication.'
                },
                {
                    q: 'A child develops bloody diarrhoea and is found to have E. coli O157:H7. What is the appropriate management?',
                    options: ['Empirical ciprofloxacin', 'Supportive care without antibiotics', 'Loperamide to reduce stools', 'Azithromycin'],
                    answer: 1,
                    explanation: 'Antibiotics (and antimotility agents) increase the risk of haemolytic uraemic syndrome in E. coli O157:H7 infection; management is supportive.'
                },
                {
                    q: 'A child has high fever with cough, coryza and conjunctivitis, followed by blue-white spots on the buccal mucosa and then a descending rash. What is the diagnosis?',
                    options: ['Rubella', 'Measles', 'Roseola', 'Scarlet fever'],
                    answer: 1,
                    explanation: 'Koplik spots and the 3 Cs with a descending maculopapular rash are classic for measles.'
                },
                {
                    q: 'A 1-year-old has 3–4 days of high fever; as the fever resolves a maculopapular rash appears on the trunk. The child looks well. What is the diagnosis?',
                    options: ['Roseola (HHV-6)', 'Measles', 'Rubella', 'Meningococcaemia'],
                    answer: 0,
                    explanation: 'High fever for several days that breaks just as a rash appears, in a well-looking infant, is roseola infantum (HHV-6), a common cause of febrile seizures.'
                },
                {
                    q: 'A child has a fine "sandpaper" rash, a strawberry tongue, perioral pallor and pharyngitis. What is the treatment?',
                    options: ['Penicillin (or amoxicillin)', 'Supportive care only', 'Aciclovir', 'IVIG'],
                    answer: 0,
                    explanation: 'Scarlet fever (group A streptococcus) is treated with penicillin/amoxicillin to prevent rheumatic fever.'
                }
            ]
        },
        {
            id: 'peds-heme-onc',
            title: 'الدم والأورام',
            title_en: 'Haematology & Oncology',
            summaryHtml: `
                <table>
                    <thead><tr><th>Disorder</th><th>Platelet</th><th>PT/PTT</th><th>Key / Tx</th></tr></thead>
                    <tbody>
                        <tr><td>ITP</td><td>↓↓</td><td>normal</td><td>post-viral; no splenomegaly → observe / IVIG / steroids</td></tr>
                        <tr><td>HUS</td><td>↓↓</td><td>normal</td><td>E. coli O157; haemolysis + AKI → supportive, NO antibiotics</td></tr>
                        <tr><td>Haemophilia A/B</td><td>normal</td><td>↑PTT only</td><td>Factor VIII / IX; avoid aspirin/IM</td></tr>
                        <tr><td>Von Willebrand</td><td>normal/↓</td><td>↑PTT</td><td>MC inherited bleeding disorder → DDAVP</td></tr>
                    </tbody>
                </table>
                <ul>
                    <li><b>Sickle cell</b>: vaso-occlusive crisis → analgesia + IV hydration + O2; aplastic crisis (Parvovirus B19); splenic sequestration → urgent transfusion; prevention: hydroxyurea + prophylactic penicillin</li>
                </ul>
                <table>
                    <thead><tr><th>Tumour</th><th>Age</th><th>Clue</th></tr></thead>
                    <tbody>
                        <tr><td>ALL (MC)</td><td>2–5 yr</td><td>pallor, bruising, bone pain, hepatosplenomegaly</td></tr>
                        <tr><td>Wilms</td><td>3–5 yr</td><td>abdominal mass; WT1 → nephrectomy + chemo</td></tr>
                        <tr><td>Neuroblastoma</td><td>&lt;5 yr</td><td>mass + calcifications; raccoon eyes; ↑urinary catecholamines</td></tr>
                        <tr><td>Retinoblastoma</td><td>&lt;3 yr</td><td><b>leukocoria</b> (white reflex) → urgent referral</td></tr>
                    </tbody>
                </table>
            `,
            questions: [
                {
                    q: 'A 4-year-old presents with painless white pupillary reflex (leukocoria) noticed in photographs. What is the appropriate action?',
                    options: ['Reassure — a normal variant', 'Urgent ophthalmology referral (suspected retinoblastoma)', 'Prescribe antibiotic eye drops', 'Repeat photographs in 6 months'],
                    answer: 1,
                    explanation: 'Leukocoria is retinoblastoma until proven otherwise and needs urgent ophthalmology referral.'
                },
                {
                    q: 'A well 4-year-old develops isolated bruising and petechiae 2 weeks after a viral illness. Platelets are very low but the blood film and other counts are normal with no hepatosplenomegaly. What is the most likely diagnosis?',
                    options: ['Acute lymphoblastic leukaemia', 'Immune thrombocytopenic purpura', 'Haemophilia A', 'Disseminated intravascular coagulation'],
                    answer: 1,
                    explanation: 'Post-viral isolated thrombocytopenia with an otherwise normal child and film is typical of ITP; many cases are managed with observation.'
                },
                {
                    q: 'A boy with a prolonged APTT, normal platelets and normal PT has spontaneous haemarthroses. What is the most likely diagnosis?',
                    options: ['Von Willebrand disease', 'Haemophilia', 'Immune thrombocytopenia', 'Vitamin K deficiency'],
                    answer: 1,
                    explanation: 'An isolated prolonged APTT with haemarthroses in a boy indicates haemophilia (factor VIII or IX deficiency); treat with factor replacement and avoid aspirin/IM injections.'
                },
                {
                    q: 'A 3-year-old has pallor, easy bruising, bone pain and hepatosplenomegaly; the blood film shows blasts. What is the most likely diagnosis?',
                    options: ['Acute lymphoblastic leukaemia', 'Iron-deficiency anaemia', 'Immune thrombocytopenia', 'Infectious mononucleosis'],
                    answer: 0,
                    explanation: 'ALL is the commonest childhood malignancy; pallor, bruising, bone pain and organomegaly with circulating blasts are typical.'
                },
                {
                    q: 'A toddler has an abdominal mass that crosses the midline, periorbital bruising ("raccoon eyes") and raised urinary catecholamines. What is the diagnosis?',
                    options: ['Neuroblastoma', 'Wilms tumour', 'Hepatoblastoma', 'Lymphoma'],
                    answer: 0,
                    explanation: 'Neuroblastoma typically crosses the midline, may cause periorbital metastatic bruising, and secretes catecholamines (raised urinary VMA/HVA); Wilms tumour usually does not cross the midline.'
                }
            ]
        },
        {
            id: 'peds-neuro-nephro',
            title: 'الأعصاب والكلى',
            title_en: 'Neurology & Nephrology',
            summaryHtml: `
                <h4>Neurology</h4>
                <ul>
                    <li><b>Febrile seizure (simple)</b>: 6 mo–5 yr, &lt;15 min, generalised → reassurance + antipyretics; NO anticonvulsants</li>
                    <li><b>Absence</b> (3 Hz spike-wave, provoked by hyperventilation) → ethosuximide; <b>infantile spasms (West)</b> (hypsarrhythmia) → ACTH/vigabatrin; <b>status</b> (&gt;5 min) → benzodiazepine first</li>
                    <li><b>Meningitis</b>: empirical ceftriaxone + vancomycin + dexamethasone; neonates add ampicillin (Listeria). <b>Purpuric rash + shock → antibiotics immediately, before LP</b></li>
                </ul>
                <h4>Nephrology</h4>
                <ul>
                    <li><b>Nephrotic</b> (proteinuria, oedema, hypoalbuminaemia, hyperlipidaemia): MC child = <b>minimal change disease</b> → prednisolone</li>
                    <li><b>Nephritic</b> (haematuria, HTN, RBC casts): <b>PSGN</b> 1–6 wk post-GAS, ↓C3, +ASO → supportive; <b>IgA nephropathy</b> = haematuria during/after URI, normal C3</li>
                    <li><b>UTI</b>: urine culture gold standard; after first febrile UTI → renal US (± VCUG); VUR is the commonest structural abnormality</li>
                </ul>
                <div class="sum-callout">RBC casts = nephritic · fatty casts = nephrotic · meningococcal sepsis (purpura + shock) = antibiotics before LP.</div>
            `,
            questions: [
                {
                    q: 'A previously well 18-month-old has a single generalised seizure lasting 2 minutes during a febrile illness and recovers fully. What is the appropriate management?',
                    options: ['Start long-term sodium valproate', 'Reassurance and antipyretics', 'Urgent CT head', 'Lumbar puncture in all cases'],
                    answer: 1,
                    explanation: 'A simple febrile seizure (6 months–5 years, &lt;15 min, generalised, full recovery) needs only reassurance and fever control; anticonvulsants are not indicated.'
                },
                {
                    q: 'A 5-year-old develops generalised oedema, heavy proteinuria, hypoalbuminaemia and hyperlipidaemia. What is the most likely diagnosis and first-line treatment?',
                    options: ['Post-streptococcal glomerulonephritis — antibiotics', 'Minimal change disease — corticosteroids', 'IgA nephropathy — ACE inhibitor', 'Alport syndrome — transplant'],
                    answer: 1,
                    explanation: 'Nephrotic syndrome in young children is most often minimal change disease, which is highly steroid-responsive.'
                },
                {
                    q: 'A 6-year-old has tea-coloured urine, periorbital oedema and hypertension 2 weeks after a sore throat, with a low C3 and positive ASO titre. What is the diagnosis?',
                    options: ['IgA nephropathy', 'Post-streptococcal glomerulonephritis', 'Minimal change disease', 'Henoch-Schönlein nephritis'],
                    answer: 1,
                    explanation: 'A nephritic picture 1–6 weeks after a streptococcal infection with low C3 and raised ASO is PSGN; management is supportive.'
                },
                {
                    q: 'A child arrives with fever, a rapidly spreading non-blanching purpuric rash and signs of shock. What should be done first?',
                    options: ['Lumbar puncture before any treatment', 'Immediate IV antibiotics (e.g. ceftriaxone)', 'CT head then antibiotics', 'Wait for blood culture results'],
                    answer: 1,
                    explanation: 'Meningococcal sepsis is an emergency — give parenteral antibiotics immediately; do not delay for LP or imaging when there is purpura and shock.'
                },
                {
                    q: 'A 6-year-old has frequent brief staring spells with eyelid flutter, provoked by hyperventilation; EEG shows 3-Hz spike-and-wave. What is the first-line drug?',
                    options: ['Ethosuximide', 'Carbamazepine', 'Phenytoin', 'Vigabatrin'],
                    answer: 0,
                    explanation: 'Childhood absence epilepsy (3-Hz spike-wave) is treated first-line with ethosuximide (or valproate).'
                },
                {
                    q: 'An infant has a first febrile urinary tract infection confirmed on culture. What imaging is recommended?',
                    options: ['Renal/bladder ultrasound (with VCUG if abnormal or recurrent)', 'CT abdomen', 'No imaging ever', 'Immediate DMSA scan for all'],
                    answer: 0,
                    explanation: 'After a first febrile UTI in young children, renal ultrasound is recommended, with VCUG (to look for vesicoureteric reflux) if it is abnormal or infections recur.'
                }
            ]
        },
        {
            id: 'peds-emergencies',
            title: 'الطوارئ والتسمم',
            title_en: 'Emergencies & Toxicology',
            summaryHtml: `
                <table>
                    <thead><tr><th>Shock</th><th>Key features</th><th>First-line treatment</th></tr></thead>
                    <tbody>
                        <tr><td>Septic</td><td>warm early/cool late; ↓SVR</td><td>20 ml/kg NS boluses + antibiotics + norepinephrine</td></tr>
                        <tr><td>Hypovolaemic</td><td>cool peripheries, ↑HR</td><td>crystalloid bolus; blood if haemorrhage</td></tr>
                        <tr><td>Anaphylactic</td><td>urticaria, wheeze, ↓BP</td><td><b>IM adrenaline</b> (first-line)</td></tr>
                        <tr><td>Obstructive</td><td>tension PTX / tamponade</td><td>needle decompression / pericardiocentesis</td></tr>
                    </tbody>
                </table>
                <table>
                    <thead><tr><th>Toxin</th><th>Antidote</th></tr></thead>
                    <tbody>
                        <tr><td>Paracetamol</td><td>N-acetylcysteine (Rumack-Matthew nomogram)</td></tr>
                        <tr><td>Opioids</td><td>Naloxone</td></tr>
                        <tr><td>Organophosphates</td><td>Atropine + pralidoxime (SLUDGE/DUMBELS)</td></tr>
                        <tr><td>TCA</td><td>Sodium bicarbonate (wide QRS)</td></tr>
                        <tr><td>Iron</td><td>Deferoxamine</td></tr>
                    </tbody>
                </table>
                <div class="sum-callout">Foreign body: airway below the cords → rigid bronchoscopy; oesophageal coin → flexible endoscopy; a <b>button battery in the oesophagus is an emergency</b> (removes within hours — risk of perforation).</div>
            `,
            questions: [
                {
                    q: 'A child develops urticaria, wheeze and hypotension minutes after a peanut exposure. What is the first-line treatment?',
                    options: ['IV hydrocortisone', 'Intramuscular adrenaline (epinephrine)', 'Oral antihistamine', 'Nebulised salbutamol'],
                    answer: 1,
                    explanation: 'Anaphylaxis is treated first with intramuscular adrenaline; steroids and antihistamines are adjuncts, not the priority.'
                },
                {
                    q: 'A toddler is brought in drooling and distressed; an X-ray shows a coin-like object with a "double-ring/halo" in the oesophagus. What is the appropriate management?',
                    options: ['Observe and allow it to pass', 'Emergency removal — suspected button battery', 'Oral laxatives', 'Repeat X-ray in 24 hours'],
                    answer: 1,
                    explanation: 'A double-ring (halo) appearance suggests a button battery, which causes oesophageal burns within hours and must be removed emergently.'
                },
                {
                    q: 'A child with organophosphate poisoning has salivation, lacrimation, miosis and bronchorrhoea. What is the key antidote?',
                    options: ['Atropine (with pralidoxime)', 'Naloxone', 'N-acetylcysteine', 'Sodium bicarbonate'],
                    answer: 0,
                    explanation: 'Organophosphate (cholinergic) toxicity is reversed with atropine plus pralidoxime.'
                },
                {
                    q: 'A child with septic shock remains hypotensive after appropriate fluid boluses and antibiotics. What is the next step?',
                    options: ['Start a vasopressor (e.g. norepinephrine)', 'Give a further 60 ml/kg bolus rapidly', 'Start corticosteroids alone', 'Withhold further treatment'],
                    answer: 0,
                    explanation: 'Fluid-refractory septic shock requires vasopressor support (e.g. norepinephrine), with stress-dose steroids if it remains catecholamine-resistant.'
                },
                {
                    q: 'A teenager who ingested a tricyclic antidepressant has a widened QRS on the ECG. What is the key antidote?',
                    options: ['Sodium bicarbonate', 'Naloxone', 'Flumazenil', 'Atropine'],
                    answer: 0,
                    explanation: 'TCA cardiotoxicity (wide QRS, arrhythmia) is treated with IV sodium bicarbonate.'
                },
                {
                    q: 'An unconscious child has pinpoint pupils and a respiratory rate of 6 after a suspected opioid ingestion. What is the antidote?',
                    options: ['Naloxone', 'Flumazenil', 'N-acetylcysteine', 'Deferoxamine'],
                    answer: 0,
                    explanation: 'Opioid toxicity (miosis, respiratory depression, reduced consciousness) is reversed with naloxone.'
                }
            ]
        }
    ]
};

export default pediatrics;
