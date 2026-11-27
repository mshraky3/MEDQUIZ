// AUTO-COPIED from my-react-app/src/components/summaries/content/specialtyPulmonology.js. Do not edit here:
// change the website's file, then run `npm run sync:summaries` in mobile/.
// Pulmonology — medical-track section of the summaries catalog.
// Mirrored for the slide viewer in backend/content/summaryHtml (keep the two in sync).
// Inline questions are copied from the SQB bank.
const specialtyPulmonology = {
    id: "pulmonology",
    title: "Pulmonology",
    title_en: "SMLE Review — 10 Topics",
    icon: "shield-check",
    accent: "#38bdf8",
    intro: "A deeper respiratory pass for the SMLE: stable and acute asthma, stable COPD and its exacerbations, pneumonia, pleural disease, pulmonary embolism, tuberculosis, lung nodules and cancer, and interstitial, sleep and critical care lung disease.",
    subtopics: [
        {
            id: "pul-asthma",
            title: "01 — Asthma: Diagnosis & Long-Term Control",
            title_en: "Testing · step therapy · poor control · special forms",
            summaryHtml: `
<h4 class="deck-topic">Prove variable airflow limitation</h4>
<ul>
<li>Episodic wheeze, cough, chest tightness and dyspnoea, often at night or with triggers.</li>
<li><b>Spirometry with bronchodilator</b> first: obstruction that improves (adult rise in FEV1 of at least 12% and 200 mL is the classic criterion).</li>
<li>Normal spirometry but suggestive history: <b>methacholine challenge</b>. A negative test makes asthma unlikely.</li>
<li><b>Cough-variant asthma</b>: chronic dry cough as the main symptom.</li>
</ul>
<h4 class="deck-topic">Treatment ladder</h4>
<ul>
<li>Inhaled corticosteroid (ICS) is the base of control. Current GINA advice prefers <b>low-dose ICS-formoterol</b> as the reliever in adults and adolescents and no longer supports reliever-only SABA treatment. Older exam stems may still use the SABA-first ladder.</li>
<li>Persisting symptoms on low-dose ICS: add a <b>long-acting beta-agonist</b> in a combination inhaler, then raise the ICS dose.</li>
<li><b>A LABA is never used without an ICS</b> in asthma.</li>
<li>Other add-ons: leukotriene receptor antagonist, long-acting antimuscarinic, and specialist biologics for severe disease; oral steroids last.</li>
</ul>
<div class="sum-algo"><span class="sum-algo-title">Before stepping up</span><ol>
<li>Check <b>inhaler technique</b>.</li>
<li>Check adherence.</li>
<li>Look for triggers: smoke, allergens, work exposure, beta-blockers, NSAIDs.</li>
<li>Treat comorbidity: rhinitis, reflux, obesity.</li>
<li>Question the diagnosis, including vocal cord dysfunction.</li>
</ol></div>
<h4 class="deck-topic">Special situations</h4>
<ul>
<li><b>Aspirin-exacerbated disease</b>: asthma, nasal polyps, reaction to NSAIDs. Avoid the culprits; a leukotriene modifier helps.</li>
<li><b>Occupational asthma</b>: better away from work. Confirm with <b>serial peak flows at work and at home</b>.</li>
<li><b>Inducible laryngeal obstruction</b>: exercise-related stridor or throat tightness; laryngoscopy by ENT.</li>
<li><b>Oral candidiasis</b> from ICS: topical antifungal such as nystatin; rinse the mouth and use a spacer.</li>
<li>Pregnancy: keep controller therapy going.</li>
</ul>
<div class="sum-key"><span class="sum-key-title">نقاط امتحانية</span><ul>
<li>Normal examination and spirometry with a typical story: methacholine challenge.</li>
<li>Poor control: inhaler technique is checked first.</li>
<li>Symptoms not controlled on ICS: add a LABA.</li>
<li>NSAID wheeze with polyps: stop NSAIDs and consider montelukast.</li>
</ul></div>`,
            questions: [
                {
                    "q": "A 26-year-old man presents to the clinic with shortness of breath and occasional wheeze occurring several times per week. He develops significant shortness of breath when playing football. He notes that it takes several minutes to recover his breath when this occurs. He also has cough during exercise. He takes no medications. Vital signs are normal. Mild nasal congestion. Systemic examinations unremarkable. CXR normal. Spirometry findings within normal parameters. Which of the following is the most appropriate next step in assessment?",
                    "options": [
                        "Repeat spirometry",
                        "Clinical observation",
                        "Methacholine challenge test",
                        "Helical (spiral) computed tomography (CT) for the chest"
                    ],
                    "answer": 2,
                    "explanation": "Asthma diagnosis when spirometry normal: 1) PEAK FLOW DIARY — diurnal variation ≥20%, morning dips, response to bronchodilator (≥12% FEV1↑) or 2-4 wk ICS trial. 2) METHACHOLINE CHALLENGE — gold standard if normal spirometry (sensitive but not specific). 3) Exercise challenge, mannitol, EVH for EIB. 4) FeNO >50 ppb suggests eosinophilic asthma.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A male patient has recently been diagnosed with asthma and is using inhaled salbutamol and an inhaled corticosteroid (ICS), but his symptoms have not improved. What is the next best step?",
                    "options": [
                        "Start oral corticosteroids",
                        "Reassess inhaler technique and use"
                    ],
                    "answer": 1,
                    "explanation": "When asthma stays uncontrolled on an inhaled corticosteroid and salbutamol, first check inhaler technique and adherence, along with triggers and the diagnosis. Poor technique is very common. Only then step up treatment, for example by adding a long-acting beta agonist. Oral steroids are for exacerbations or severe disease.",
                    "source": "SMLE recall"
                },
                {
                    "q": "24-year-old woman is reviewed in the Asthma Clinic. She currently uses a salbutamol inhaler 100 mcg prn combined with a beclometasone dipropionate inhaler 400 mcg bd. Despite this, she is having frequent exacerbations of her asthma that required frequent courses of prednisolone and hospitalization three times in the last 6 months. What is the most appropriate next step in management?",
                    "options": [
                        "Switch beclometasone to fluticasone",
                        "Start to take the salbutamol regularly",
                        "Add long-acting B2 agonist (Salmeterol)",
                        "Add long-acting anticholinergic bronchodilator"
                    ],
                    "answer": 2,
                    "explanation": "She has frequent exacerbations despite a regular inhaled corticosteroid. The next step is to add a long-acting beta2 agonist such as salmeterol, preferably in a combined inhaler so that it is never taken without the steroid. Switching to fluticasone or using salbutamol regularly does not give the same benefit, and a long-acting anticholinergic is a later add-on. Check adherence and technique too.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A 44-year-old woman is seen in the clinic with difficult-to-control asthma despite being on high-dose inhaled steroids and frequent courses of systemic steroids. She also has a history of allergic rhinitis and nasal polyps. She claims to use aspirin and ibuprofen for migraine almost daily. She is a non-smoker and works in a school. Examination reveals nasal polyps and bilateral expiratory wheezing on chest auscultation (see report). Chest X-ray: Normal. Which of the following is the most appropriate next step in management?",
                    "options": [
                        "Chest CT scan",
                        "Direct laryngoscopy to assess upper airways",
                        "Blood eosinophil count and serum IgE level",
                        "Discontinue aspirin and ibuprofen and start Montelukast"
                    ],
                    "answer": 3,
                    "explanation": "Core Concept: Aspirin-Exacerbated Respiratory Disease (AERD), also known as Samter's Triad, consists of asthma, chronic rhinosinusitis with nasal polyposis, and hypersensitivity to COX-1 inhibitors (aspirin/NSAIDs). Clinical Presentation: Severe asthma exacerbations, nasal congestion, anosmia, and rhinorrhea triggered by NSAID ingestion. Complications include recurrent nasal polyps, chronic sinusitis, and life-threatening asthma attacks. Diagnosis: The clinical triad is highly suggestive. The gold standard for definitive confirmation is an aspirin challenge test performed in a monitored clinical setting. Management: Acute management requires strict avoidance of all non-selective NSAIDs and aspirin. Acetaminophen or COX-2 selective inhibitors can be used for analgesia. Long-term management includes leukotriene receptor antagonists (e.g., Montelukast), intranasal corticosteroids, and potentially aspirin desensitization followed by daily high-dose aspirin therapy. Biologics (e.g., dupilumab) are an option for severe polyposis.",
                    "source": "SMLE bank"
                },
                {
                    "q": "A 28-year-old wood worker presents to the clinic complaining of episodic shortness of breath. He describes feeling wheezy and having a tendency to cough. A diagnosis of occupation asthma is suspected. Which of the following is the most appropriate diagnostic investigation?",
                    "options": [
                        "Serial peak flow measurements at work and at home",
                        "Specific IgE measurements",
                        "Skin prick test",
                        "Patch testing"
                    ],
                    "answer": 0,
                    "explanation": "Core Concept: Occupational asthma is caused by sensitization to specific airborne agents in the workplace (e.g., wood dust, isocyanates). The hallmark is a temporal relationship between symptoms and workplace exposure. Clinical Presentation: · Wheeze, cough, chest tightness, and shortness of breath that worsen during the workweek and improve on weekends or holidays. Diagnosis: · First-line: Serial peak expiratory flow (PEF) measurements recorded every 2 hours during waking hours for several weeks, both at work and away from work. · Gold standard: Specific inhalation challenge testing (rarely done due to complexity) or specific IgE/skin prick tests to the suspected occupational allergen. Management: · Acute: Standard asthma reliever therapy (SABA) for symptom control. · Long-term/Definitive: Complete avoidance of the offending occupational agent (most definitive), standard asthma controller medications (ICS/LABA), and potentially changing occupation.",
                    "source": "SMLE bank"
                }
            ],
        },
        {
            id: "pul-acute-asthma",
            title: "02 — Acute Asthma",
            title_en: "Severity grading · treatment · when to ventilate",
            summaryHtml: `
<p>Grade every attack by speech, work of breathing, rate, pulse, saturation, peak flow and mental state. The cut-offs below follow the British (BTS/SIGN) scheme; other guidelines group them slightly differently.</p>
<div class="deck-block deck-tbl"><table><thead><tr><th>Grade</th><th>Features</th></tr></thead><tbody>
<tr><td>Moderate</td><td>Peak flow above 50% up to 75% of best or predicted, no severe feature</td></tr>
<tr><td>Acute severe (any one)</td><td>Peak flow 33 to 50%, respiratory rate 25 or more, pulse 110 or more, cannot complete a sentence</td></tr>
<tr><td>Life-threatening (any one)</td><td>Peak flow below 33%, saturation below 92%, silent chest, cyanosis, weak effort, exhaustion, confusion, arrhythmia, hypotension, a "normal" PaCO2</td></tr>
<tr><td>Near fatal</td><td>Raised PaCO2 or need for ventilation</td></tr>
</tbody></table></div>
<h4 class="deck-topic">Why a normal CO2 is bad</h4>
<p>An asthmatic who is hyperventilating should have a <b>low</b> PaCO2. A normal or rising value means the patient is tiring and ventilation is failing.</p>
<div class="sum-algo"><span class="sum-algo-title">Treatment</span><ol>
<li>Controlled oxygen to a safe saturation (targets of about 93 to 98% are quoted for adults).</li>
<li>Repeated or continuous <b>short-acting beta-agonist</b>.</li>
<li>Add <b>ipratropium</b> in severe attacks.</li>
<li><b>Systemic corticosteroid</b> early (oral works as well as IV if the patient can swallow).</li>
<li>Severe or poorly responding: <b>IV magnesium sulfate</b>.</li>
<li>Failing: call intensive care.</li>
</ol></div>
<h4 class="deck-topic">Ventilation</h4>
<ul>
<li><b>Intubate</b> for arrest, exhaustion, falling consciousness, silent chest with cyanosis, or worsening hypoxaemia, hypercapnia and acidosis despite therapy.</li>
<li>Non-invasive ventilation is <b>not</b> routine in acute asthma and must not delay intubation. This differs from COPD.</li>
<li>Ventilate with a long expiratory time to limit air trapping. Sudden hypotension on the ventilator: think dynamic hyperinflation or tension pneumothorax.</li>
<li>Avoid sedatives outside a monitored airway plan.</li>
</ul>
<h4 class="deck-topic">Discharge</h4>
<p>Stable, off frequent nebulisers, with improved peak flow. Give an oral steroid course, make sure a controller inhaler is prescribed, check technique, provide a written action plan and early follow-up. Previous intensive care admission or intubation marks a high-risk patient with a low threshold for admission.</p>
<div class="sum-key"><span class="sum-key-title">نقاط امتحانية</span><ul>
<li>Silent chest, cyanosis or drowsiness: life-threatening.</li>
<li>Normal PaCO2 in a distressed asthmatic: warning of failure.</li>
<li>Cannot speak a sentence is at least severe.</li>
<li>Exhausted and cyanosed asthmatic: intubate.</li>
</ul></div>`,
            questions: [
                {
                    "q": "A 30-year-old asthmatic has severe dyspnoea after paint-fume inhalation. In respiratory distress, CANNOT COMPLETE A SENTENCE, CYANOSED, reduced breath sounds bilaterally. SpO2 85%. ABG: pH 7.3 (acidosis), PCO2 7.8 (HIGH/RISING), PO2 7.5 (low) — life-threatening/near-fatal asthma with a RISING CO2. What is the best immediate action?",
                    "options": [
                        "Intravenous magnesium infusion",
                        "Intravenous aminophylline infusion",
                        "Intubation and mechanical ventilation",
                        "Nasal continuous positive airway pressure ventilation"
                    ],
                    "answer": 2,
                    "explanation": "Near-fatal/life-threatening asthma — RED FLAGS: RISING or NORMAL PCO2 (should be low; rising = tiring → respiratory failure), exhaustion, SILENT CHEST, cyagnosis, altered consciousness, bradycardia/hypotension. → INTUBATION + mechanical ventilation (ICU). Alongside: high-flow O2, back-to-back nebulized salbutamol/ipratropium, IV/oral steroids, IV magnesium sulfate. A normalizing PCO2 in an asthmatic is OMINOUS (not reassuring).",
                    "source": "SMLE recall"
                },
                {
                    "q": "A 33-year-old woman has been assessed in the Emergency Department with an acute exacerbation of asthma. Which of the following features is most likely to indicate a life-threatening attack?",
                    "options": [
                        "Failure to improve after nebulized salbutamol 5 mg",
                        "Oxygen saturations of 94% on room air",
                        "Peak flow of 30% best or predicted",
                        "Respiratory rate of 28/min"
                    ],
                    "answer": 2,
                    "explanation": "Core Concept: Acute asthma exacerbations are classified into moderate, severe, and life-threatening based on clinical signs and objective measurements like Peak Expiratory Flow (PEF). Clinical Presentation: · Severe: PEF 33-50% predicted, RR >= 25, HR >= 110, inability to complete sentences · Life-threatening: PEF < 33% predicted, SpO2 < 92%, silent chest, cyanosis, poor respiratory effort, altered consciousness, or normal/high PaCO2 Diagnosis: · First-line diagnostic plan: Peak flow meter reading and pulse oximetry · Gold standard: Arterial blood gas (ABG) to check for normocapnia or hypercapnia, which indicates respiratory muscle fatigue and impending failure Management: · Acute management: High-flow oxygen, continuous nebulized salbutamol + ipratropium, IV hydrocortisone, and IV magnesium sulfate · Gold standard long-term management: Review inhaler technique, adherence, and step-up controller therapy post-discharge. A PEF < 33% is a defining criterion for a life-threatening asthma attack.",
                    "source": "SMLE bank"
                },
                {
                    "q": "A 31-year-old man with asthma complaining of increasing wheeze in the past few hours. He rarely attends asthma clinic and his previous best peak flow readings has been 400 L/min. Which of the following would suggest acute severe asthma?",
                    "options": [
                        "02 saturation <95%",
                        "Respiratory rate >25",
                        "Carotid pulse > 100 bpm",
                        "Peak flow rate <300 L/min"
                    ],
                    "answer": 1,
                    "explanation": "Core Concept: British Thoracic Society (BTS) guidelines for recognizing acute severe asthma. The criteria include specific thresholds for respiratory rate, heart rate, and peak flow. Clinical Presentation: · Respiratory rate >= 25 breaths/min. · Heart rate >= 110 bpm. · Inability to complete sentences in one breath. · PEF 33-50% of best (33-50% of 400 L/min = 132-200 L/min). Diagnosis: · First-line: Clinical parameters, PEF, and pulse oximetry. · Gold standard: Arterial blood gas (ABG) to assess for hypoxia and hypercapnia if the patient is deteriorating. Management: · Acute: High-flow oxygen, nebulized salbutamol and ipratropium, and systemic corticosteroids. · Long-term/Definitive: Step up asthma preventer therapy (ICS/LABA) and review inhaler technique.",
                    "source": "SMLE bank"
                }
            ],
        },
        {
            id: "pul-copd-stable",
            title: "03 — Stable COPD",
            title_en: "Diagnosis · phenotypes · what prolongs life · oxygen criteria",
            summaryHtml: `
<h4 class="deck-topic">Diagnosis</h4>
<ul>
<li>Chronic cough, sputum or progressive exertional dyspnoea with exposure: smoking, biomass smoke, occupational dust.</li>
<li><b>Spirometry</b>: post-bronchodilator <b>FEV1/FVC below 0.70</b>. FEV1 percent predicted grades airflow limitation.</li>
<li><b>Chronic bronchitis</b> (clinical): productive cough for 3 months in each of 2 consecutive years.</li>
<li><b>Emphysema</b> (structural): destroyed alveoli, hyperinflation, quiet breath sounds, low diffusing capacity.</li>
<li>Check <b>alpha-1 antitrypsin</b>, especially with early onset, little smoking, basal emphysema or family history; many guidelines advise testing all patients once.</li>
</ul>
<h4 class="deck-topic">Management</h4>
<ul>
<li><b>Stop smoking</b>: the key step at every stage; it slows decline and improves survival.</li>
<li>Vaccines according to local schedule: influenza, pneumococcal, COVID-19, pertussis, RSV and recombinant zoster where eligible.</li>
<li><b>Pulmonary rehabilitation</b> improves symptoms and exercise capacity.</li>
</ul>
<div class="deck-block deck-tbl"><table><thead><tr><th>Situation</th><th>Inhaled therapy (GOLD direction)</th></tr></thead><tbody>
<tr><td>Mild symptoms, few exacerbations</td><td>A bronchodilator, long-acting preferred if regular</td></tr>
<tr><td>Significant symptoms or exacerbations</td><td>LABA + LAMA</td></tr>
<tr><td>Single long-acting drug not enough</td><td>Combine both classes, for example add tiotropium to salmeterol</td></tr>
<tr><td>Exacerbations with raised blood eosinophils, or asthma features</td><td>Add ICS (triple therapy)</td></tr>
</tbody></table></div>
<p>ICS raises pneumonia risk; do not use it alone in COPD.</p>
<h4 class="deck-topic">Long-term oxygen</h4>
<p>Assess when clinically stable, with repeat confirmation. It improves survival in severe resting hypoxaemia:</p>
<ul>
<li><b>PaO2 55 mmHg (7.3 kPa) or less</b>, or saturation 88% or less.</li>
<li>PaO2 about 56 to 59 mmHg (up to 8 kPa) with <b>cor pulmonale</b>, right heart failure signs or polycythaemia.</li>
<li>Use it at least 15 hours daily. The patient must not smoke around oxygen.</li>
</ul>
<div class="sum-key"><span class="sum-key-title">نقاط امتحانية</span><ul>
<li>Smoker with chronic cough: confirm with spirometry.</li>
<li>Best single intervention: stop smoking.</li>
<li>Cor pulmonale with qualifying hypoxaemia: long-term oxygen.</li>
<li>Still symptomatic on a LABA: add a LAMA.</li>
</ul></div>`,
            questions: [
                {
                    "q": "A 30-year-old man, a smoker, is newly diagnosed with COPD. Normal vitals, only chronic cough. What is the next management step?",
                    "options": [
                        "Stop smoking",
                        "Oral ipratropium",
                        "Steroid"
                    ],
                    "answer": 0,
                    "explanation": "Smoking cessation is the single most important intervention for any COPD patient, the only measure proven to slow disease progression, and should be prioritized first for mild symptoms.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A 55-year-old man is evaluated for an 18-month history of intermittent nonproductive chronic cough and exertional dyspnea, with no fever, chest pain, heartburn, or weight loss. He has smoked 1 pack daily for 30 years. Examination shows no jugular venous distention, normal heart sounds, clear lungs, and no edema; chest radiograph and ECG are normal. Which of the following is the most appropriate next diagnostic test?",
                    "options": [
                        "Sleep study",
                        "Spirometry",
                        "Chest CT scan",
                        "Bronchoscopy"
                    ],
                    "answer": 1,
                    "explanation": "A long-term heavy smoker with chronic cough and exertional dyspnea and a normal chest X-ray should first be evaluated with spirometry to assess for airflow obstruction and diagnose COPD, before proceeding to more invasive or advanced imaging studies.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A 70-year-old man known to have chronic obstructive pulmonary disease (COPD). Examination revealed evidence of cor pulmonale with a significant degree of lower limb edema. His FEV1 is 40% (see lab result). Which of the following interventions is most associated with increased survival?",
                    "options": [
                        "Heart-lung transplant",
                        "Corticosteroid therapy",
                        "Pulmonary rehabilitation",
                        "Long-term oxygen therapy"
                    ],
                    "answer": 3,
                    "explanation": "Core Concept: Chronic Obstructive Pulmonary Disease (COPD) is characterized by progressive, poorly reversible airflow limitation. Chronic hypoxemia can lead to pulmonary hypertension and subsequent right-sided heart failure (cor pulmonale). Clinical Presentation: Classic symptoms include chronic exertional dyspnea, chronic cough, and sputum production. Signs of advanced disease include pursed-lip breathing, barrel chest, cyanosis, and signs of cor pulmonale (jugular venous distention, hepatomegaly, lower extremity edema). Complications include acute exacerbations, pneumothorax, and respiratory failure. Diagnosis: First-line and gold standard diagnostic test is spirometry, which demonstrates an obstructive pattern (FEV1/FVC ratio < 0.70 post-bronchodilator). Additional evaluations include chest X-ray, arterial blood gas (ABG), and pulse oximetry to assess for hypoxemia and hypercapnia. Management: Acute management of exacerbations involves short-acting bronchodilators, systemic corticosteroids, antibiotics (if indicated), and supplemental oxygen or non-invasive ventilation. Long-term management includes smoking cessation, pulmonary rehabilitation, inhaled bronchodilators (LAMA/LABA), and inhaled corticosteroids. However, the ONLY interventions proven to decrease mortality (increase survival) in COPD patients are smoking cessation and Long-Term Oxygen Therapy (LTOT) in patients with severe resting hypoxemia (PaO2 ≤ 55 mmHg or SaO2 ≤ 88%, or PaO2 56-59 mmHg with evidence of cor pulmonale/polycythemia).",
                    "source": "SMLE bank"
                },
                {
                    "q": "A 58-year-old man with chronic obstructive pulmonary disease (COPD) is ready to be discharged home after acute exacerbation of the disease. Which of the following parameters indicate offering long-term oxygen therapy?",
                    "options": [
                        "1 arterial blood gas measurement with p02 < 7,7 kPa",
                        "2 arterial blood gases measurements with p02 < 7.3 kPa",
                        "1 arterial blood gas measurement with p02 < 8.0 kPa",
                        "2 arterial blood gases measurements with p02 < 6.3 kPa"
                    ],
                    "answer": 1,
                    "explanation": "Core Concept: Long-Term Oxygen Therapy (LTOT) improves survival in patients with severe chronic hypoxemia due to COPD by preventing or delaying the progression of pulmonary hypertension and cor pulmonale. Clinical Presentation: · Classic symptoms: Chronic exertional dyspnea, fatigue, signs of right heart failure (peripheral edema). · Complications: Cor pulmonale, secondary polycythemia, and cognitive impairment. Diagnosis: · Diagnostic algorithm: Assessment of resting oxygenation in a clinically stable patient (not during an acute exacerbation, as transient hypoxemia may resolve). · First-line diagnostic plan: Arterial Blood Gas (ABG) analysis. · Gold standard criteria for LTOT: Two ABG measurements taken at least 3 weeks apart showing a resting PaO2 < 7.3 kPa (55 mmHg), OR a PaO2 between 7.3 and 8.0 kPa (55-60 mmHg) with evidence of cor pulmonale, secondary polycythemia, or nocturnal hypoxemia. Management: · Acute management: Treat any underlying acute exacerbation or infection before assessing for LTOT to ensure baseline stability. · Long-term/Definitive management: Prescription of home oxygen to be used for at least 15 hours a day, alongside optimal inhaled bronchodilator therapy, pulmonary rehabilitation, and smoking cessation.",
                    "source": "SMLE bank"
                },
                {
                    "q": "A 76-year-old man with chronic obstructive pulmonary disease (COPD) comes to the clinic for a follow-up. He is currently taking salmeterol, using albuterol rescue inhaler 2 to 3 times per day for the past 3 months. He has been hospitalized for COPD exacerbations twice in the past 6 months. Which of the following medications should be added to the maintenance regimen?",
                    "options": [
                        "Montelukast",
                        "Prednisone",
                        "Tiotropium",
                        "Formoterol"
                    ],
                    "answer": 2,
                    "explanation": "Core Concept: Chronic Obstructive Pulmonary Disease (COPD) management follows a stepwise approach based on symptom burden and exacerbation history, as outlined by the GOLD guidelines. Clinical Presentation: · Progressive dyspnea, chronic cough, and sputum production. · Exacerbations: Acute worsening of respiratory symptoms requiring additional therapy or hospitalization. Diagnosis: · First-line: Spirometry demonstrating a post-bronchodilator FEV1/FVC ratio < 0.70, confirming persistent airflow limitation. · Gold standard: Spirometry. Management: · Acute: Short-acting bronchodilators (SABA/SAMA), systemic corticosteroids, and antibiotics for acute exacerbations. · Definitive/Maintenance: This patient remains highly symptomatic and has a history of frequent severe exacerbations (GOLD Group E). Step-up therapy requires adding a Long-Acting Muscarinic Antagonist (LAMA) like tiotropium to his current LABA. Triple therapy (LABA + LAMA + Inhaled Corticosteroid) may also be considered if exacerbations continue.",
                    "source": "SMLE bank"
                }
            ],
        },
        {
            id: "pul-copd-exacerbation",
            title: "04 — COPD Exacerbation & Respiratory Failure",
            title_en: "Controlled oxygen · blood gases · NIV · intubation",
            summaryHtml: `
<p>More dyspnoea, more sputum or more purulent sputum, usually from infection. Exclude mimics: pneumonia, pulmonary embolism, heart failure, pneumothorax, arrhythmia.</p>
<h4 class="deck-topic">Reading the gas</h4>
<div class="deck-block deck-tbl"><table><thead><tr><th>Pattern</th><th>Meaning</th></tr></thead><tbody>
<tr><td>Low PaO2, normal or low PaCO2</td><td>Type 1 respiratory failure</td></tr>
<tr><td>Low PaO2, high PaCO2</td><td>Type 2 respiratory failure</td></tr>
<tr><td>High CO2, near-normal pH, high bicarbonate</td><td>Chronic compensated retention</td></tr>
<tr><td>High CO2 with low pH</td><td>Acute or acute-on-chronic respiratory acidosis</td></tr>
</tbody></table></div>
<div class="sum-algo"><span class="sum-algo-title">Initial care</span><ol>
<li><b>Controlled oxygen</b>, target saturation <b>88 to 92%</b>; a <b>Venturi mask</b> gives a predictable concentration.</li>
<li>Short-acting beta-agonist with or without ipratropium.</li>
<li>Short systemic steroid course (commonly prednisolone about 40 mg for 5 days).</li>
<li>Antibiotic when sputum is more purulent or ventilation is needed.</li>
<li>Repeat the blood gas after starting oxygen and after each change.</li>
<li>VTE prophylaxis.</li>
</ol></div>
<h4 class="deck-topic">Oxygen-induced hypercapnia</h4>
<p>Worsening drowsiness and acidosis after high-flow oxygen: <b>titrate the oxygen down</b> to the target range. Do not remove oxygen completely, because dangerous hypoxaemia follows. If acidosis persists, ventilate.</p>
<h4 class="deck-topic">Non-invasive ventilation (BiPAP)</h4>
<ul>
<li>Start when <b>pH is 7.35 or less with PaCO2 45 mmHg (6 kPa) or more</b> despite initial therapy; also severe distress with fatigue.</li>
<li>It lowers intubation and death rates. Recheck gases within about 1 to 2 hours.</li>
<li>A very low pH is not by itself a bar to a monitored trial in an alert patient.</li>
</ul>
<h4 class="deck-topic">Invasive ventilation</h4>
<ul>
<li>Respiratory or cardiac arrest, inability to protect the airway, <b>heavy secretions</b> or vomiting, severely reduced consciousness, haemodynamic instability, or NIV failure.</li>
<li>Drowsiness from CO2 alone may still be tried on NIV in a monitored unit.</li>
<li>A valid, informed do-not-intubate decision by the patient must be respected, even if relatives disagree.</li>
</ul>
<div class="sum-key"><span class="sum-key-title">نقاط امتحانية</span><ul>
<li>COPD oxygen target: 88 to 92%.</li>
<li>Deterioration on high-flow oxygen: reduce it in a controlled way.</li>
<li>Hypercapnic acidosis despite treatment: BiPAP.</li>
<li>Unable to clear secretions and drowsy: intubate if consistent with the patient's wishes.</li>
</ul></div>`,
            questions: [
                {
                    "q": "A patient with a COPD exacerbation received his medications in the emergency department and was given HIGH-FLOW oxygen, after which he deteriorated. Arterial blood gas shows a high PaO2 and pH 7.14. What is the next step?",
                    "options": [
                        "Intubation",
                        "Decrease the oxygen"
                    ],
                    "answer": 1,
                    "explanation": "COPD and oxygen: target saturations 88-92%, using a VENTURI mask. Uncontrolled oxygen worsens hypercapnia via V/Q mismatch, the HALDANE effect and reduced respiratory drive. Acidosis pathway: optimise medical therapy and CONTROL the oxygen -> NIV for pH 7.25-7.35 -> INTUBATION for pH below 7.25 unresponsive to NIV, reduced consciousness, or an unprotected airway. Never let a patient become hypoxic in the effort to avoid hypercapnia - hypoxia kills faster.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A 65-year-old male, known case of severe COPD, presents with exertional dyspnea, drowsiness and cyanosis for the last 2 days. On examination he is alert but somnolent with bilateral wheezing. No fever, BP 100/60, RR 10, O2 sat 84%. ABG: hypercapnic and hypoxemic, pH 7.25. Which of the following is the most appropriate next step?",
                    "options": [
                        "Intubation and mechanical ventilation",
                        "Continuous oxygen 15 L/minute via non-rebreather",
                        "Non-invasive ventilation (BiPAP)"
                    ],
                    "answer": 2,
                    "explanation": "COPD exacerbation with hypercapnic acidosis (pH 7.25 to 7.35) in a rousable patient gets BiPAP; intubate if NIV fails or the patient cannot protect the airway, and never give uncontrolled high-flow oxygen.",
                    "source": "SMLE recall"
                },
                {
                    "q": "An elderly man, known to have COPD, is brought to the Emergency Department with severe respiratory distress, cyanosis, and drowsiness. His upper airways are full of secretions. Vitals: BP: 90/60 mmHg, HR: 110/min, RR: 18/min, Temp: 38.0 °C, O₂ saturation: 74% ABG Results: HCO₃⁻: 36 mmol/L (↑, normal 22–28), PCO₂: 7.99 kPa (↑, normal 4.7–6.0) pH: 7.24 (↓, acidemia) PO₂: 8.99 kPa (↓, normal 10.6–14.2) What is the best option in management?",
                    "options": [
                        "Nasal CPAP",
                        "Mechanical ventilation",
                        "Aminophylline infusion",
                        "Oxygen administration via face mask"
                    ],
                    "answer": 1,
                    "explanation": "Core Concept: The patient is experiencing an acute exacerbation of COPD complicated by acute-on-chronic hypercapnic respiratory failure (severe acidemia pH 7.24, high PCO2) and hypoxemia. Clinical Presentation: · Severe dyspnea, cyanosis, and critically, drowsiness (altered mental status) with copious upper airway secretions. Diagnosis: · First-line: Arterial Blood Gas (ABG) showing severe respiratory acidosis. · Gold Standard: Clinical assessment of airway protection and work of breathing. Management: · Acute: While Non-Invasive Ventilation (NIV/BiPAP) is usually first-line for COPD exacerbations with respiratory acidosis, it is strictly contraindicated in patients with depressed consciousness (drowsiness), inability to protect the airway, or copious secretions due to the high risk of aspiration. Therefore, immediate endotracheal intubation and invasive mechanical ventilation is the best and safest option. · Long-term: Treat the underlying trigger (e.g., antibiotics and steroids for pneumonia/exacerbation) and optimize maintenance inhalers.",
                    "source": "SMLE bank"
                },
                {
                    "q": "A patient with known COPD presents with dyspnea. ABG shows hypercapnia, hypoxia, and acidosis. What is the diagnosis?",
                    "options": [
                        "COPD with type 1 respiratory failure",
                        "COPD with type 2 respiratory failure",
                        "COPD with chronic respiratory failure"
                    ],
                    "answer": 1,
                    "explanation": "Type 2 respiratory failure is defined by both hypoxia and hypercapnia, typically with respiratory acidosis from CO2 retention, which is common in COPD exacerbations due to inadequate ventilation; type 1 respiratory failure, by contrast, involves hypoxia with normal or low CO2.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A COPD patient with recorded Do Not Intubate (DNI) his case deteriorated. The team thinks intubating him might prolong his life. What would you do in this case?",
                    "options": [
                        "Respect his DNI",
                        "Consult his family before making a decision",
                        "Proceed with intubation as it may prolong his life",
                        "Intubate the patient regardless of his DNI"
                    ],
                    "answer": 0,
                    "explanation": "Core Concept: Advance directives, such as a Do Not Intubate (DNI) order, are legally and ethically binding documents that reflect a patient's autonomous wishes regarding end-of-life care. Clinical Presentation: A patient with advanced COPD or terminal illness experiencing acute respiratory failure or disease exacerbation. Diagnosis: Verify the validity of the advance directive, ensure it applies to the current clinical situation, and confirm the patient lacks the capacity to make a new, informed decision in the acute setting. Management: Acute management involves strictly respecting the patient's DNI order, focusing on non-invasive comfort measures, palliative oxygen, and symptom control (e.g., opioids for dyspnea). Long-term management involves ensuring clear communication of the patient's goals of care with the entire healthcare team and family to prevent unwanted, invasive interventions.",
                    "source": "SMLE bank"
                }
            ],
        },
        {
            id: "pul-pneumonia",
            title: "05 — Pneumonia",
            title_en: "Severity · organisms · empiric therapy · special hosts",
            summaryHtml: `
<p>Fever, cough, sputum, pleuritic pain, focal crackles or bronchial breathing, with a <b>new infiltrate</b>. Lobar consolidation with air bronchograms points to <i>Streptococcus pneumoniae</i>, the leading bacterial cause of community-acquired pneumonia.</p>
<h4 class="deck-topic">CURB-65</h4>
<p>One point each: <b>C</b>onfusion, <b>U</b>rea above 7 mmol/L, <b>R</b>espiratory rate 30 or more, <b>B</b>lood pressure systolic below 90 or diastolic 60 or less, age <b>65</b> or more. 0 to 1: usually outpatient; 2: consider admission; 3 or more: severe. Hypoxaemia and clinical judgement can override the score.</p>
<h4 class="deck-topic">Empiric therapy (adjust to local protocol)</h4>
<div class="deck-block deck-tbl"><table><thead><tr><th>Setting</th><th>Typical choice</th></tr></thead><tbody>
<tr><td>Outpatient, healthy</td><td>Amoxicillin or doxycycline; macrolide alone only where pneumococcal resistance is low</td></tr>
<tr><td>Outpatient with comorbidity</td><td>Beta-lactam + macrolide or doxycycline, or a respiratory fluoroquinolone</td></tr>
<tr><td>Ward</td><td>Ceftriaxone + azithromycin, or a respiratory fluoroquinolone</td></tr>
<tr><td>Intensive care</td><td>Beta-lactam plus a macrolide or fluoroquinolone; add MRSA or Pseudomonas cover for risk factors</td></tr>
</tbody></table></div>
<p>Think of TB before giving a fluoroquinolone. Switch to oral when stable and treat for at least 5 days.</p>
<h4 class="deck-topic">Clues to the organism</h4>
<ul>
<li><b>Mycoplasma</b>: young adult, dry cough, extrapulmonary features, cold agglutinin haemolysis.</li>
<li><b>Legionella</b>: water source, diarrhoea, confusion, low sodium.</li>
<li><b>Aspiration</b>: swallowing problem, reduced consciousness.</li>
<li><b>Pneumocystis</b>: advanced HIV, gradual dyspnoea, dry cough, exertional desaturation, diffuse interstitial shadows. Treat with <b>co-trimoxazole</b>; add steroids for significant hypoxaemia (PaO2 below 70 mmHg).</li>
<li><b>Fungi</b>: prolonged neutropenia or transplant with fever not settling on broad antibiotics.</li>
</ul>
<h4 class="deck-topic">Severe disease and prevention</h4>
<ul>
<li>Hypotension persisting after adequate fluid: <b>noradrenaline</b>.</li>
<li>Failure to improve: check the diagnosis, resistance, empyema or abscess.</li>
<li><b>Ventilator-associated pneumonia</b> prevention: <b>head of bed up 30 to 45 degrees</b>, daily sedation break and weaning assessment, hand hygiene, oral care.</li>
</ul>
<div class="sum-key"><span class="sum-key-title">نقاط امتحانية</span><ul>
<li>Lobar pneumonia: pneumococcus.</li>
<li>Admitted ward patient: beta-lactam plus macrolide.</li>
<li>HIV with hypoxaemia and diffuse shadows: Pneumocystis.</li>
<li>Ventilated patient: elevate the head of the bed.</li>
</ul></div>`,
            questions: [
                {
                    "q": "A patient has symptoms of pneumonia, and chest X-ray shows consolidation with air bronchograms. What is the most common causative organism?",
                    "options": [
                        "Streptococcus pneumoniae",
                        "Staphylococcus aureus"
                    ],
                    "answer": 0,
                    "explanation": "Streptococcus pneumoniae is the most common cause of community-acquired bacterial pneumonia overall, typically producing lobar consolidation with air bronchograms on chest X-ray; Staphylococcus aureus pneumonia is less common and more often associated with cavitation or a preceding viral illness such as influenza.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A 42-year-old man presents to the emergency room with productive cough, fever, and dyspnea for 3 days. Chest examination reveals evidence of consolidation at the right lower lung field. Which of the following is the most appropriate empiric antimicrobial regimen?",
                    "options": [
                        "Meropenem and azithromycin",
                        "Ceftriaxone and azithromycin",
                        "Vancomycin and azithromycin",
                        "Oseltamivir and azithromycin"
                    ],
                    "answer": 1,
                    "explanation": "Standard empiric coverage for typical, non-severe community-acquired pneumonia is a beta-lactam (ceftriaxone) plus a macrolide (azithromycin for atypical coverage).",
                    "source": "SMLE recall"
                },
                {
                    "q": "A young man with HIV was admitted to the ICU with progressive shortness of breath, cough, and fever, dyspneic and cyanosed. Chest X-ray shows signs of ARDS. Which of the following is the most likely causative organism?",
                    "options": [
                        "Staphylococcus aureus",
                        "Pneumocystis jirovecii",
                        "Pseudomonas aeruginosa",
                        "Streptococcus pneumoniae"
                    ],
                    "answer": 1,
                    "explanation": "Pneumocystis jirovecii pneumonia is the classic opportunistic infection causing a diffuse, ARDS-like picture in HIV/immunocompromised patients.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A patient with COPD or asthma on mechanical ventilation develops fever and purulent discharge from the trachea after a couple of days. How can this be prevented?",
                    "options": [
                        "Elevate the bed 30-45 degrees",
                        "Suctioning every hour",
                        "Change the plastic tube daily",
                        "Give prophylactic antibiotics"
                    ],
                    "answer": 0,
                    "explanation": "Head-of-bed elevation is a well-established, standard component of the ventilator-associated pneumonia prevention bundle, reducing aspiration risk, unlike routine hourly suctioning, frequent tube changes, or prophylactic antibiotics, none of which are recommended VAP prevention measures.",
                    "source": "SMLE recall"
                },
                {
                    "q": "Very long case about Patient came with S/S of pneumonia and admitted to ICU then deteriorated, She received iv fluid bolus 30ml/KG and antibiotic, but BP still low 80/40 What is the next step in management?",
                    "options": [
                        "Another dose of IV fluid bolus",
                        "Norepinephrine"
                    ],
                    "answer": 1,
                    "explanation": "Core Concept: Septic shock is defined as sepsis with persisting hypotension requiring vasopressors to maintain a Mean Arterial Pressure (MAP) ≥ 65 mmHg and having a serum lactate level > 2 mmol/L despite adequate volume resuscitation. Clinical Presentation: · Profound hypotension, tachycardia, oliguria, altered mental status, and cold/mottled extremities. · Complications: Multi-organ dysfunction syndrome (MODS), ARDS, and death. Diagnosis: · First-line: Serum lactate, blood cultures, and hemodynamic monitoring. · Gold Standard: Clinical diagnosis based on Sepsis-3 criteria (refractory hypotension post-fluids). Management: · Acute management: According to the Surviving Sepsis Campaign guidelines, if hypotension persists after the initial 30 mL/kg crystalloid fluid bolus, the immediate next step is to initiate vasopressors. Norepinephrine is the first-line vasopressor of choice to restore vascular tone and organ perfusion. · Long-term/definitive: Source control, targeted antibiotics, and ICU supportive care.",
                    "source": "SMLE bank"
                }
            ],
        },
        {
            id: "pul-pleura",
            title: "06 — Pleural Disease",
            title_en: "Signs · Light criteria · empyema · pneumothorax",
            summaryHtml: `
<h4 class="deck-topic">Effusion at the bedside</h4>
<p>Stony dull percussion, reduced breath sounds and <b>reduced vocal fremitus</b>; a large effusion pushes the trachea away. Ultrasound confirms and guides <b>thoracentesis</b>, the key test for an unexplained effusion. Bilateral effusions with clear heart failure can be treated first.</p>
<h4 class="deck-topic">Light criteria: exudate if any one</h4>
<ul>
<li>Pleural / serum protein <b>above 0.5</b>.</li>
<li>Pleural / serum LDH <b>above 0.6</b>.</li>
<li>Pleural LDH above two thirds of the upper normal serum value.</li>
</ul>
<p>Transudates: heart failure, cirrhosis, nephrotic syndrome. Exudates: infection, cancer, TB, embolism, autoimmune disease, pancreatitis. Diuretics can make a cardiac effusion look exudative.</p>
<div class="deck-block deck-tbl"><table><thead><tr><th>Fluid finding</th><th>Think / do</th></tr></thead><tbody>
<tr><td>Pus, organisms, or <b>pH below 7.2</b> in infection (low glucose supports)</td><td>Complicated effusion or empyema: antibiotics <b>plus chest drain</b></td></tr>
<tr><td>Lymphocytic with high adenosine deaminase</td><td>Tuberculosis; pleural biopsy helps confirm</td></tr>
<tr><td>Very low glucose</td><td>Rheumatoid disease, empyema</td></tr>
<tr><td>High amylase</td><td>Pancreatitis, oesophageal rupture, some cancers</td></tr>
<tr><td>Older smoker, weight loss, large effusion</td><td>Malignancy: send cytology</td></tr>
</tbody></table></div>
<p><b>Recurrent symptomatic malignant effusion</b>: indwelling pleural catheter or <b>pleurodesis</b> if the lung re-expands.</p>
<h4 class="deck-topic">Pneumothorax</h4>
<ul>
<li>Sudden pain and dyspnoea, hyper-resonance, absent breath sounds.</li>
<li><b>Tension</b>: hypotension, distended neck veins, trachea pushed away. Clinical diagnosis: <b>immediate decompression</b>, then chest drain. Do not wait for imaging.</li>
<li><b>Primary spontaneous</b> with few symptoms: observation is acceptable; symptomatic cases get aspiration, a small drain or an ambulatory device.</li>
<li><b>Secondary</b> (COPD and other lung disease): lower threshold to drain and admit.</li>
<li>Significant traumatic pneumothorax: chest tube.</li>
<li>No flying until resolved.</li>
</ul>
<div class="sum-key"><span class="sum-key-title">نقاط امتحانية</span><ul>
<li>Infected effusion with pH below 7.2: drain it.</li>
<li>LDH ratio above 0.6 means exudate.</li>
<li>Pneumonia with a moderate effusion: sample the fluid and give antibiotics.</li>
<li>Repeated malignant effusion: definitive control such as pleurodesis.</li>
</ul></div>`,
            questions: [
                {
                    "q": "A 71-year-old man is admitted to the hospital because of high fever and dyspnea associated with purulent sputum. Physical examination reveals dullness on percussion on the right lower chest and rales on auscultation (see reports). Chest radiography: Pneumonic infiltrate in the right upper lobe and a pleural effusion. Aspiration: Pending result. Which of the following pleural fluid analyses will most likely indicate the need for chest-tube drainage?",
                    "options": [
                        "pH < 7.2",
                        "Glucose > 60 mmol/L",
                        "Negative Gram stain",
                        "Serosanguineous appearance"
                    ],
                    "answer": 0,
                    "explanation": "Core Concept: Parapneumonic effusions are exudative pleural effusions associated with bacterial pneumonia. They are classified as uncomplicated or complicated, with complicated effusions and empyema requiring prompt drainage. Clinical Presentation: Fever, pleuritic chest pain, dyspnea, and productive cough. Complications include loculated effusions, empyema, sepsis, and pleural thickening (fibrothorax). Diagnosis: First-line evaluation includes a chest radiograph and bedside ultrasound to quantify the fluid. Diagnostic thoracentesis is the gold standard for fluid analysis. Indications for chest-tube drainage (complicated parapneumonic effusion or empyema) include: pleural fluid pH < 7.2, glucose < 60 mg/dL, positive Gram stain or culture, or frank pus. Management: Acute management involves targeted intravenous antibiotics and immediate tube thoracostomy (chest tube drainage) if complicated criteria are met. Long-term management includes completing the antibiotic course and follow-up imaging. Surgical decortication may be required if the effusion becomes organized and loculated.",
                    "source": "SMLE bank"
                },
                {
                    "q": "A 54-year-old man presents with shortness of breath and fever for 1 week. On physical examination, the patient is febrile and dyspneic. His oxygen's saturation is 89% on room air. Chest examination shows absent breath sounds and dullness to percussion over right lung field. Chest radiography confirms a large right-sided pleural effusion. Which of the following is the most useful to establish a diagnosis of exudative pleural effusion?",
                    "options": [
                        "Pleural fluid protein/ serum protein < 0.5",
                        "Pleural fluid pLDH/ serum LDH > 0.6",
                        "Pleural fluid LDH >1/3 normal upper limit for serum",
                        "Pleural fluid white cell count > 1000"
                    ],
                    "answer": 1,
                    "explanation": "Core Concept: Light's criteria are the gold standard used to differentiate exudative pleural effusions (caused by local inflammation, infection, or malignancy) from transudative effusions (caused by systemic hydrostatic or oncotic pressure imbalances). Clinical Presentation: · Dyspnea, pleuritic chest pain, dullness to percussion, and decreased breath sounds. · Complications: Empyema, lung entrapment, and respiratory failure. Diagnosis: · First-line and Gold Standard: Diagnostic thoracentesis. An effusion is classified as an exudate if it meets at least one of Light's criteria: 1) Pleural fluid protein / Serum protein > 0.5, 2) Pleural fluid LDH / Serum LDH > 0.6, or 3) Pleural fluid LDH > 2/3 the upper limit of normal for serum LDH. Management: · Acute: Therapeutic thoracentesis for symptomatic relief. · Long-term/definitive: Treat the underlying cause (e.g., antibiotics for parapneumonic effusion, chemotherapy for malignancy, or chest tube drainage if complicated/empyema).",
                    "source": "SMLE bank"
                },
                {
                    "q": "36-year-old man presents to Emergency Department with 5day history of fever, productive cough and shortness of breath. On examination, he is febrile with temperature 38.5 C and his lung examination reveals dullness to percussion with markedly diminished breath sound over half of the lung field on the right side. Chest radiography shows right lower and middle lobes consolidation and moderate pleural effusion. Which of the following is the most appropriate management?",
                    "options": [
                        "Start azithromycin and ceftriaxone",
                        "Start azithromycin, ceftriaxone and oseltamivir",
                        "Start azithromycin, ceftriaxone and do thoracocentesis",
                        "Start azithromycin, ceftriaxone and do CT scan of the chest"
                    ],
                    "answer": 2,
                    "explanation": "Core Concept: Community-acquired pneumonia (CAP) complicated by a moderate parapneumonic effusion. Clinical Presentation: · Fever, productive cough, dullness to percussion, diminished breath sounds, and CXR showing consolidation with a moderate pleural effusion. · Complications: Empyema, complicated parapneumonic effusion requiring chest tube drainage, sepsis. Diagnosis: · First-line: Chest X-ray. · Gold standard: Diagnostic thoracentesis with pleural fluid analysis (Light's criteria, pH, glucose, Gram stain, culture) to differentiate uncomplicated from complicated parapneumonic effusion or empyema. Management: · Acute/Definitive: Empiric IV antibiotics (e.g., ceftriaxone + azithromycin) PLUS diagnostic thoracentesis. A moderate-to-large effusion must be sampled to rule out infection (empyema) which would mandate chest tube drainage.",
                    "source": "SMLE bank"
                },
                {
                    "q": "A 60-year-old man with advanced squamous cell bronchogenic carcinoma presents with massive malignant right pleural effusion. He has been admitted several times with similar findings for which he underwent several therapeutic pleural taps. Which of the following is the next best option in management?",
                    "options": [
                        "Diuretics",
                        "Ultrafiltration",
                        "Chemical pleurodesis",
                        "Low salt human albumin"
                    ],
                    "answer": 2,
                    "explanation": "Malignant pleural effusion management: 1) Therapeutic thoracentesis (slow, ≤1.5L) — initial. 2) Recurrent → PLEURODESIS (talc 90% success) — needs lung re-expansion. 3) Trapped lung or pleurodesis failure → INDWELLING PLEURAL CATHETER (outpatient drainage). 4) Systemic therapy for underlying cancer. Lung CA #1 cause. Other: breast, lymphoma, ovarian, timesothelioma.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A patient with active rheumatoid arthritis presents with pleural effusion. Which of the following is typical finding in the pleural fluid analysis?",
                    "options": [
                        "Hemorrhagic",
                        "Transudative",
                        "High pH, > 7.64",
                        "Glucose content of 1 mmol/L"
                    ],
                    "answer": 3,
                    "explanation": "Core Concept: Rheumatoid pleurisy causing an exudative pleural effusion, typically seen in patients with long-standing, seropositive rheumatoid arthritis (more common in men with rheumatoid nodules). Clinical Presentation: · Pleuritic chest pain, dyspnea, and dry cough. · Often associated with active systemic joint disease and subcutaneous rheumatoid nodules. Diagnosis: · First-line: Thoracentesis with pleural fluid analysis meeting Light's criteria for an exudate. · Gold Standard: Pleural fluid analysis showing a classic triad: profoundly low glucose (< 30 mg/dL or < 1.6 mmol/L), markedly elevated LDH (often > 1000 U/L), and low pH (< 7.20). High rheumatoid factor titers in the fluid are also characteristic. Management: · Acute management: Therapeutic thoracentesis for symptomatic relief of dyspnea. · Long-term/Definitive management: Optimization of systemic immunosuppressive therapy for rheumatoid arthritis (e.g., DMARDs, biologics). Systemic corticosteroids or pleurodesis may be required for chronic, refractory, or loculated effusions.",
                    "source": "SMLE bank"
                }
            ],
        },
        {
            id: "pul-pe",
            title: "07 — Pulmonary Embolism",
            title_en: "Pretest probability · imaging · pregnancy · treatment",
            summaryHtml: `
<p>Sudden dyspnoea, pleuritic pain, haemoptysis, tachycardia, hypoxaemia or syncope, especially after surgery, immobility, cancer, pregnancy, oestrogen therapy or previous VTE. The commonest ECG finding is sinus tachycardia.</p>
<div class="sum-algo"><span class="sum-algo-title">Diagnosis in a stable patient</span><ol>
<li>Estimate probability (Wells or similar).</li>
<li>Very low risk: PERC rule may remove the need for tests.</li>
<li>PE unlikely: <b>D-dimer</b>; negative excludes it.</li>
<li>PE likely or D-dimer positive: <b>CT pulmonary angiography</b>.</li>
<li>CT unsuitable (contrast allergy, poor kidneys): V/Q scan.</li>
<li>High suspicion and low bleeding risk: anticoagulate while waiting.</li>
</ol></div>
<h4 class="deck-topic">Pregnancy</h4>
<ul>
<li>Leg symptoms: compression ultrasound first; a confirmed DVT is enough to treat.</li>
<li>Otherwise a chest X-ray; if it is normal, a <b>perfusion or V/Q scan</b> is a good choice. CT angiography is used when the film is abnormal or V/Q is unavailable or inconclusive. Do not withhold imaging.</li>
<li>Treatment is <b>low molecular weight heparin</b>. Warfarin and DOACs are avoided.</li>
</ul>
<h4 class="deck-topic">Treatment by risk</h4>
<div class="deck-block deck-tbl"><table><thead><tr><th>Patient</th><th>Treatment</th></tr></thead><tbody>
<tr><td>Haemodynamically stable</td><td>Anticoagulation: DOAC usual; LMWH when preferred</td></tr>
<tr><td>Hypotension or shock (high risk)</td><td><b>Systemic thrombolysis</b> if no contraindication; unfractionated heparin is the usual companion</td></tr>
<tr><td>Thrombolysis contraindicated or failed</td><td>Catheter-directed or surgical removal</td></tr>
<tr><td>Anticoagulation impossible</td><td>IVC filter</td></tr>
<tr><td>Cancer</td><td>LMWH or a suitable factor Xa inhibitor (watch bleeding, especially some GI tumours)</td></tr>
<tr><td>Severe kidney failure</td><td>Unfractionated heparin, then a suitable oral agent</td></tr>
</tbody></table></div>
<p>Right ventricular strain with raised troponin but normal pressure: anticoagulate and monitor closely, with rescue reperfusion if the patient deteriorates.</p>
<p>Duration: at least 3 months. A PE provoked by a major temporary factor can usually stop then; unprovoked or persisting-risk events often continue.</p>
<div class="sum-key"><span class="sum-key-title">نقاط امتحانية</span><ul>
<li>Stable patient with likely PE: CT angiography.</li>
<li>Pregnancy with clear lungs on film: V/Q is a strong answer.</li>
<li>Stable confirmed PE: anticoagulate.</li>
<li>Shock from PE: reperfuse.</li>
</ul></div>`,
            questions: [
                {
                    "q": "A 35-year-old woman presents to the emergency room with sudden onset of shortness of breath associated with pleuritic chest pain. Her past medical history is unremarkable. She is using oral contraceptives regularly. Physical examination is unremarkable. Which of the following is the most appropriate investigation to establish the diagnosis?",
                    "options": [
                        "D-dimer",
                        "Echocardiography",
                        "Chest CT angiography",
                        "Ventilation-perfusion (VQ) scan"
                    ],
                    "answer": 2,
                    "explanation": "CT pulmonary angiography is the standard, most direct/definitive test to establish a PE diagnosis, unlike D-dimer (a screening, not confirmatory test) or echocardiography (indirect signs only).",
                    "source": "SMLE recall"
                },
                {
                    "q": "A 30-year-old woman is evaluated for new-onset nonproductive cough and dyspnea on exertion. She is pregnant at 30 weeks gestation. Medical history is unremarkable. Her only medication is a prenatal vitamin. Cardiopulmonary examination is normal. She has a gravid uterus and 2+ edema of the lower extremities without calf tenderness. Doppler ultrasonography of both legs is negative for deep venous thrombosis (see lab results). Which of the following is the most appropriate diagnostic test to perform next?",
                    "options": [
                        "D-dimer assay",
                        "CT angiography",
                        "Pulmonary function testing",
                        "Ventilation-perfusion lung scan"
                    ],
                    "answer": 3,
                    "explanation": "Suspected pulmonary embolism in pregnancy (negative leg Doppler): with a NORMAL chest X-ray, a VENTILATION-PERFUSION (V/Q) scan is often preferred (less radiation to maternal breast tissue than CTPA); use CTPA if the CXR is abnormal or V/Q is non-diagnostic. D-dimer is unreliable (physiologically raised) in pregnancy. Suspected PE in pregnancy + normal CXR → V/Q scan.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A woman, medically free, on oral contraceptive pills presented with symptoms of pulmonary embolism. She was vitally stable with no signs of massive pulmonary embolism. What is the management?",
                    "options": [
                        "Anticoagulants",
                        "Thrombolytics",
                        "IVC filter",
                        "Embolectomy"
                    ],
                    "answer": 0,
                    "explanation": "A haemodynamically stable pulmonary embolism is treated with anticoagulation alone; thrombolysis, filters and embolectomy each require a specific extra indication that this stem deliberately removes.",
                    "source": "SMLE recall"
                },
                {
                    "q": "Case of pulmonary embolism after hip surgery and immobility for 5 days. RR about 22, BP normal, O2 saturation 92%. What is the best initial step?",
                    "options": [
                        "LMWH",
                        "Duplex ultrasound"
                    ],
                    "answer": 0,
                    "explanation": "High clinical probability of PE in a stable patient: anticoagulate with LMWH first and image second; thrombolysis is reserved for haemodynamic compromise.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A 59-year-old man is evaluated in the hospital for progressive shortness of breath and hypoxia 20 hours after undergoing surgery for colonic adenocarcinoma with known liver metastases. CT angiography shows a right lower lobe pulmonary embolism. Which of the following is the most appropriate initial treatment?",
                    "options": [
                        "Warfarin",
                        "Enoxaparin",
                        "Rivaroxaban",
                        "Fondaparinux"
                    ],
                    "answer": 1,
                    "explanation": "Cancer-associated VTE: LMWH (enoxaparin/dalteparin) first-line (CLOT trial). DOAC alternative (apixaban best evidence — Caravaggio trial). Avoid DOACs if luminal GI/GU CA (bleeding risk). Duration: AT LEAST 6 months, often indefinite while cancer active. Warfarin inferior in cancer. Post-op PE: LMWH preferred initially.",
                    "source": "SMLE recall"
                }
            ],
        },
        {
            id: "pul-tuberculosis",
            title: "08 — Tuberculosis",
            title_en: "Diagnosis · isolation · drugs and toxicity · latent infection",
            summaryHtml: `
<p>Cough for more than 2 to 3 weeks, fever, night sweats, weight loss, haemoptysis, upper lobe infiltrate or cavity. Contact history and immunosuppression raise suspicion.</p>
<h4 class="deck-topic">Diagnosis and safety</h4>
<ul>
<li>Sputum for <b>acid-fast smear, nucleic acid test and culture</b> (usually repeated samples), with drug susceptibility.</li>
<li>Offer HIV testing.</li>
<li>Suspected pulmonary or laryngeal TB: <b>airborne precautions</b> in addition to standard ones, negative-pressure room, fitted N95 for staff.</li>
<li>Skin test and interferon-gamma release assay show infection; they do not separate latent from active disease.</li>
</ul>
<h4 class="deck-topic">Standard treatment (drug-susceptible)</h4>
<p><b>2 months</b> isoniazid, rifampicin, pyrazinamide, ethambutol, then <b>4 months</b> isoniazid and rifampicin. Meningitis needs a longer course plus corticosteroid. Check baseline liver tests and vision.</p>
<div class="deck-block deck-tbl"><table><thead><tr><th>Drug</th><th>Key toxicity</th></tr></thead><tbody>
<tr><td>Isoniazid</td><td><b>Peripheral neuropathy</b> (give pyridoxine), hepatitis</td></tr>
<tr><td>Rifampicin</td><td><b>Orange-red body fluids</b>, enzyme induction (warfarin, contraceptive pills), liver injury</td></tr>
<tr><td>Pyrazinamide</td><td><b>High uric acid</b>, joint pain, liver injury</td></tr>
<tr><td>Ethambutol</td><td><b>Optic neuritis</b>: acuity and colour vision</td></tr>
</tbody></table></div>
<p>Symptomatic hepatitis, or a large rise in transaminases (about 3 times normal with symptoms, 5 times without), means stopping the hepatotoxic drugs and seeking expert advice.</p>
<h4 class="deck-topic">Latent infection</h4>
<ul>
<li>First exclude active disease with symptoms and chest film.</li>
<li>Positive skin test: <b>5 mm</b> or more in HIV, close contacts, significant immunosuppression or old fibrotic changes; <b>10 mm</b> for other risk groups such as health-care workers and people from high-burden areas; <b>15 mm</b> with no risk factor.</li>
<li>Current guidance often prefers short <b>rifamycin-based regimens</b>. Isoniazid for 6 to 9 months with pyridoxine remains an accepted alternative. Check interactions, especially with HIV drugs.</li>
</ul>
<div class="sum-key"><span class="sum-key-title">نقاط امتحانية</span><ul>
<li>Suspected active TB: airborne isolation.</li>
<li>Pins and needles on therapy: isoniazid.</li>
<li>High uric acid: pyrazinamide.</li>
<li>Warn patients that rifampicin colours urine and tears.</li>
</ul></div>`,
            questions: [
                {
                    "q": "A patient with tuberculosis on treatment has a uric acid level of 600 (elevated). Which medication caused this finding?",
                    "options": [
                        "Isoniazid",
                        "Rifampicin",
                        "Ethambutol",
                        "Pyrazinamide"
                    ],
                    "answer": 3,
                    "explanation": "Pyrazinamide, one of the standard first-line anti-tuberculosis drugs, commonly causes hyperuricemia by inhibiting renal excretion of uric acid, which can occasionally precipitate gout even without causing symptoms in most patients.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A 40-year-old man diagnosed with pulmonary TB who started treatment 3 months ago, presents to the clinic with a week's history of pins and needles in his hands and feet with associated numbness. He tells that his symptoms started since he stopped taking the vitamins given to him at the start of his TB treatment. Which of the following drugs is responsible for the symptoms described by the patient?",
                    "options": [
                        "Pyrazinamide",
                        "Ethambutol",
                        "Rifampicin",
                        "Isoniazid"
                    ],
                    "answer": 3,
                    "explanation": "Core Concept: Isoniazid (INH) is a cornerstone first-line anti-tuberculosis drug. It structurally resembles pyridoxine (Vitamin B6) and increases its urinary excretion, leading to Vitamin B6 deficiency and subsequent peripheral neuropathy. Clinical Presentation: · Symmetrical 'stocking-glove' paresthesias, numbness, and tingling in the distal extremities Diagnosis: · First-line diagnostic plan: Clinical history of INH use, especially without concurrent B6 supplementation · Gold standard: Clinical diagnosis; nerve conduction studies/EMG if the presentation is atypical Management: · Acute management: Initiate or increase Pyridoxine (Vitamin B6) supplementation to reverse the neuropathy · Gold standard long-term management: Continue INH for the duration of the TB treatment while maintaining B6 prophylaxis. High-risk patients (diabetics, HIV, pregnant women, malnourished) should receive B6 routinely from the start of therapy",
                    "source": "SMLE bank"
                },
                {
                    "q": "A patient with highly suspicious pulmonary tuberculosis is evaluated in the Emergency Department. Standard universal precautions are taken. Which of the following is the most appropriate infection control precaution during the assessment?",
                    "options": [
                        "Standard precautions",
                        "Standard and droplet precautions",
                        "Standard and contact precautions",
                        "Standard and airborne precautions"
                    ],
                    "answer": 3,
                    "explanation": "AIRBORNE (negative pressure + N95): TB, measles, varicella. DROPLET (surgical mask): influenza, meningococcus, pertussis. CONTACT (gown/gloves): MRSA, C. difficile, scabies.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A 32-year-old man with HIV presents for follow-up, generally doing well. His Mantoux tuberculin test (PPD) after 48 hours is 6 mm, and chest radiography is unremarkable. Which of the following is the best preventive measure for this patient?",
                    "options": [
                        "No need for preventive treatment",
                        "Isoniazid and pyridoxine for 9 months",
                        "Isoniazid and pyridoxine for 3 months"
                    ],
                    "answer": 1,
                    "explanation": "In HIV-positive patients, a PPD of 5 mm or greater is considered positive due to the lower threshold used for immunocompromised individuals; with a normal chest X-ray confirming latent rather than active disease, the standard treatment is isoniazid with pyridoxine (to prevent peripheral neuropathy) for 9 months, the longer standard duration given their higher risk of progression to active disease.",
                    "source": "SMLE recall"
                }
            ],
        },
        {
            id: "pul-nodule-cancer",
            title: "09 — Lung Nodules & Cancer",
            title_en: "Screening · follow-up · types · paraneoplastic effects",
            summaryHtml: `
<h4 class="deck-topic">Screening</h4>
<p>Test of choice: <b>annual low-dose CT</b>, never chest X-ray. The widely quoted USPSTF rule is age 50 to 80 with 20 pack-years or more, currently smoking or quit within 15 years; some bodies have dropped the quit-time limit.</p>
<h4 class="deck-topic">Solitary solid nodule (incidental, adult)</h4>
<ul>
<li>Compare old images first. A solid nodule <b>stable for 2 years</b> or more is generally benign: no further follow-up.</li>
<li>Under 6 mm in a low-risk person: usually no routine follow-up.</li>
<li>6 to 8 mm: repeat CT after an interval.</li>
<li>Over 8 mm: assess risk; short-interval CT, PET-CT or tissue.</li>
<li>Suspicious: growth, spiculation, upper lobe, larger size, older smoker. Diffuse, central or popcorn calcification favours benign.</li>
<li>Ground-glass nodules and patients with cancer or immunosuppression follow different rules.</li>
</ul>
<div class="deck-block deck-tbl"><table><thead><tr><th>Type</th><th>Typical associations</th></tr></thead><tbody>
<tr><td>Adenocarcinoma</td><td>Commonest; usually peripheral; includes never-smokers</td></tr>
<tr><td>Squamous cell</td><td>Central, cavitates; <b>high calcium</b> from PTH-related protein</td></tr>
<tr><td>Small cell</td><td>Central, strongly smoking-related, early spread; <b>SIADH</b>, ectopic ACTH, Lambert-Eaton syndrome; mainly systemic therapy</td></tr>
</tbody></table></div>
<h4 class="deck-topic">Local clues</h4>
<ul>
<li>Smoker with clubbing, weight loss, haemoptysis or a pneumonia that will not clear: investigate for cancer.</li>
<li><b>Superior vena cava obstruction</b>: face and arm swelling, headache, distended veins; lung cancer, notably small cell, and lymphoma. Stridor or brain symptoms make it urgent.</li>
<li>Apical tumour: shoulder pain, hand weakness, Horner syndrome.</li>
</ul>
<h4 class="deck-topic">Work-up</h4>
<p>Tissue and staging together; sample the site that gives the highest stage safely. Central lesions suit bronchoscopy, peripheral ones CT-guided biopsy, nodes endobronchial ultrasound. Before lung resection, check <b>pulmonary function</b> to confirm enough reserve.</p>
<p><b>SIADH</b> with mild or no symptoms: fluid restriction. Severe neurological symptoms: hypertonic saline.</p>
<div class="sum-key"><span class="sum-key-title">نقاط امتحانية</span><ul>
<li>Screening tool: low-dose CT in the eligible group.</li>
<li>Long-stable small solid nodule: stop imaging.</li>
<li>Before lobectomy: pulmonary function tests.</li>
<li>Face swelling with a lung mass: SVC obstruction.</li>
</ul></div>`,
            questions: [
                {
                    "q": "What is the best screening for lung cancer?",
                    "options": [
                        "Plain radiograph",
                        "Low dose CT",
                        "Bronchoscopy",
                        "Sputum"
                    ],
                    "answer": 1,
                    "explanation": "Screening for lung cancer means annual low dose CT in high risk smokers; chest radiograph and sputum cytology were tested and failed to reduce mortality.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A 79-year-old man is followed for a 2-mm solitary pulmonary nodule incidentally found 4 years ago, with follow-up chest CT scans at 1, 2, and 3 years all showing the nodule unchanged. He is a never-smoker, feels well, and has no respiratory symptoms. Which of the following is the most appropriate recommendation?",
                    "options": [
                        "Repeat chest CT in 1 year",
                        "Repeat chest CT in 2 years",
                        "Repeat chest CT in 5 years",
                        "No further imaging is necessary"
                    ],
                    "answer": 3,
                    "explanation": "A very small pulmonary nodule that has remained stable over multiple years of serial imaging in a never-smoker has an extremely low likelihood of malignancy, and surveillance guidelines support discontinuing further imaging once stability has been clearly demonstrated over this length of time.",
                    "source": "SMLE recall"
                },
                {
                    "q": "Chest X-ray shows a 5-cm irregular mass in the right upper lobe. Bronchoscopy shows a tumor in the right upper lobe bronchus, and biopsy confirms squamous cell carcinoma. Whole-body FDG-PET is negative for metastasis. Which of the following is the most appropriate action while preparing him for surgery?",
                    "options": [
                        "Repeat PET scan in 3 months",
                        "Pulmonary function tests",
                        "Chemotherapy",
                        "Radiotherapy"
                    ],
                    "answer": 1,
                    "explanation": "Pulmonary function testing is standard pre-operative workup for lung resection surgery, assessing whether the patient has adequate pulmonary reserve to tolerate the planned lobectomy or pneumonectomy for this resectable cancer.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A 55-year-old man presents with progressive dyspnea and cough for 6 weeks. He is a heavy smoker. 2 weeks ago, he started having headaches and noticed swelling of his face. Physical examination reveals prominent non-pulsating neck veins, puffiness of the face and edema of the upper limbs (see report). Chest X-ray: Shows a prominence of the right hilum. Which of the following types of lung cancer is the most commonly associated with this clinical presentation?",
                    "options": [
                        "Adenocarcinoma of the lung",
                        "Carcinoid tumor of the lung",
                        "Squamous cell lung cancer",
                        "Small cell lung cancer"
                    ],
                    "answer": 3,
                    "explanation": "Core Concept: Superior Vena Cava (SVC) Syndrome is an oncologic emergency caused by obstruction of SVC blood flow, most commonly by a central lung malignancy. Clinical Presentation: Facial and upper extremity edema, plethora, distended non-pulsatile neck veins, dyspnea, and headaches worsening when bending forward. Diagnosis: First-line is a contrast-enhanced CT chest confirming the obstruction and mass. The gold standard is a tissue biopsy for histological diagnosis. Management: Acute management includes head elevation and potentially endovascular stenting. Small Cell Lung Cancer (SCLC) is the most common subtype associated with SVC syndrome and central masses, and the gold standard long-term management is systemic chemotherapy and radiation therapy.",
                    "source": "SMLE bank"
                },
                {
                    "q": "A male patient known case of small cell lung cancer came with complaint of lethargy and fatigue (no change in level of consciousness or any sign of that). He has no complaints of polydipsia or lower limb oedema. Labs were stable and the only abnormal finding was a sodium of 126 (no urine or serum osmolality or anything else provided). Which of the following is the most appropriate management?",
                    "options": [
                        "Hypertonic saline",
                        "Fluid restriction",
                        "Give salt tablets"
                    ],
                    "answer": 1,
                    "explanation": "Euvolaemic hyponatraemia from SIADH without neurological symptoms is treated by fluid restriction; hypertonic saline is only for seizures or coma, and correction never exceeds about 8 to 10 mmol/L per day.",
                    "source": "SMLE recall"
                }
            ],
        },
        {
            id: "pul-ild-sleep-icu",
            title: "10 — Interstitial, Sleep & Critical Lung Disease",
            title_en: "Fibrosis · sarcoid · pulmonary hypertension · OSA · ARDS",
            summaryHtml: `
<h4 class="deck-topic">Interstitial lung disease</h4>
<ul>
<li>Progressive dyspnoea, dry cough, fine bibasal crackles, sometimes clubbing.</li>
<li>Spirometry is <b>restrictive</b> (normal or raised FEV1/FVC, low volumes) with a <b>low diffusing capacity</b>.</li>
<li>Key test: <b>high-resolution CT</b>.</li>
<li>Look for exposures, drugs (amiodarone, methotrexate, nitrofurantoin, bleomycin) and connective tissue disease. Idiopathic pulmonary fibrosis is treated with antifibrotics, not routine steroids.</li>
</ul>
<h4 class="deck-topic">Sarcoidosis</h4>
<ul>
<li><b>Bilateral hilar lymphadenopathy</b>; skin, eye, heart and nerve disease; high calcium.</li>
<li>Tissue shows non-caseating granulomas; exclude TB and lymphoma.</li>
<li>Asymptomatic isolated hilar nodes with a typical picture can be <b>observed</b>. Fever, erythema nodosum, ankle arthritis and hilar nodes (Lofgren syndrome) is recognisable without biopsy.</li>
<li>Treat organ threat or significant symptoms with steroids.</li>
</ul>
<h4 class="deck-topic">Pulmonary hypertension and cor pulmonale</h4>
<p>Loud P2, parasternal heave, raised JVP, oedema. <b>Tricuspid regurgitation</b> gives a systolic murmur louder on inspiration, large v waves and a pulsatile liver. Echo screens; right heart catheterisation confirms.</p>
<h4 class="deck-topic">Obstructive sleep apnoea</h4>
<p>Snoring, witnessed pauses, daytime sleepiness, obesity, resistant hypertension, polycythaemia. Diagnose with a <b>sleep study</b>. Treat with <b>CPAP</b>, weight loss, and avoid alcohol and sedatives.</p>
<h4 class="deck-topic">ARDS</h4>
<ul>
<li>Within about a week of an insult (sepsis, pneumonia, aspiration, pancreatitis, trauma): <b>bilateral opacities and hypoxaemia</b> not explained mainly by heart failure or fluid.</li>
<li>Treat the cause. <b>Low tidal volume</b> ventilation (about 6 mL/kg predicted weight), limit plateau pressure to 30, adequate PEEP, <b>prone position</b> for severe hypoxaemia, conservative fluids once shock resolves.</li>
<li><b>TRALI</b>: acute hypoxaemia within 6 hours of transfusion, often with fever and hypotension. Stop the transfusion and support. <b>Circulatory overload</b> instead raises pressure and JVP and responds to diuretics.</li>
</ul>
<div class="sum-key"><span class="sum-key-title">نقاط امتحانية</span><ul>
<li>Bibasal crackles with clubbing: high-resolution CT.</li>
<li>Symptom-free bilateral hilar nodes: observation may be right.</li>
<li>Loud snoring with sleepiness: CPAP after confirming sleep apnoea.</li>
<li>Low pressure and hypoxaemia soon after blood: TRALI.</li>
</ul></div>`,
            questions: [
                {
                    "q": "A 55-year-old man, a plumber, presented with a 1-year history of dry cough and progressive exertional breathlessness. Examination shows finger clubbing and bilateral basal crackles (see reports). Chest X-ray: Bilateral reticular shadowing at the lower zone of the lungs. Which of the following has the highest diagnostic value?",
                    "options": [
                        "Trans-Bronchial Biopsy",
                        "Measures diffusion capacity on PFT",
                        "High-resolution CT scan of the chest",
                        "Serum angiotensin-converting enzyme"
                    ],
                    "answer": 2,
                    "explanation": "Core Concept: The patient's occupational history (plumber = asbestos exposure), chronic dry cough, progressive dyspnea, finger clubbing, and basal crackles strongly suggest Asbestosis or Idiopathic Pulmonary Fibrosis (IPF), both of which are fibrotic interstitial lung diseases (ILDs). Clinical Presentation: · Insidious onset of exertional dyspnea, non-productive cough, 'Velcro-like' fine end-inspiratory crackles at the lung bases, and digital clubbing. Diagnosis: · First-line: Pulmonary function tests (PFTs) showing a restrictive pattern and decreased DLCO. · Gold Standard: High-Resolution CT (HRCT) scan of the chest is the most valuable diagnostic tool. It can identify the classic Usual Interstitial Pneumonia (UIP) pattern (subpleural, basal predominance, reticular opacities, honeycombing, and traction bronchiectasis), often precluding the need for a lung biopsy. Management: · Acute: Supplemental oxygen if hypoxemic and pulmonary rehabilitation. · Long-term: Antifibrotic medications (pirfenidone, nintedanib) for IPF, strict avoidance of further occupational exposures, and evaluation for lung transplantation.",
                    "source": "SMLE bank"
                },
                {
                    "q": "A 38-year-old woman with no known medical illness is referred to the clinic for a chest X-ray showing prominent bilateral hilar structures. She has an on-and-off cough but denies shortness of breath, sputum, chest pain, skin lesions, weight loss, fever, or sick contacts, and is a non-smoker. CT chest confirms bilateral hilar lymphadenopathy with clear lung parenchyma, and CT-guided biopsy shows noncaseating granuloma. Which of the following is the most appropriate next step in management?",
                    "options": [
                        "Observe",
                        "Start prednisone",
                        "Start azithromycin",
                        "Start anti-tuberculosis therapy"
                    ],
                    "answer": 0,
                    "explanation": "This is stage I sarcoidosis, confirmed by noncaseating granuloma on biopsy; treatment with steroids is reserved for patients with significant dyspnea, progressive lung involvement, hypercalcemia, or ocular, cardiac, or neurologic involvement, none of which are present here, so observation alone is appropriate.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A 55-year-old obese non-smoker man presents with loud snoring, daytime somnolence and exertional dyspnea for 4 years. Examination revealed central cyanosis: suffused conjunctivae and clear chest (see lab results). BMI 40 kg/m2 Test Result Normal Values ABG HCO3- 38 22-28 mmol/L ABG PCO2 6.9 4.7-6.0 kPa pH 7.38 7.36-7.45 ABG PO2 9 10.6-14.2 ka Which of the following is the best treatment after polysomnography?",
                    "options": [
                        "Home oxygen by venturi mask",
                        "Inhaled tiotropium",
                        "Home nasal CPAP",
                        "Oral prednisone"
                    ],
                    "answer": 2,
                    "explanation": "- Core Concept: Obesity Hypoventilation Syndrome (OHS) and severe Obstructive Sleep Apnea (OSA) leading to chronic hypercapnic respiratory failure (elevated HCO3-, high PCO2, low PO2). · Clinical Presentation: - *Symptoms:* Daytime hypercapnia, severe obesity, sleep-disordered breathing. - *Signs:* Right heart failure signs, cyanosis, plethoric face. - *Complications:* Cor pulmonale and severe pulmonary hypertension. · Diagnosis: Polysomnography confirms OSA. Awake arterial blood gas (ABG) confirms daytime hypercapnia (PaCO2 > 45 mmHg). · Management: While oxygen alone can worsen hypercapnia, the gold standard definitive management for OSA and OHS is non-invasive positive pressure ventilation, specifically Home nasal CPAP (or BiPAP if CPAP fails or hypercapnia persists). Weight loss is also a critical long-term intervention.",
                    "source": "SMLE bank"
                },
                {
                    "q": "A 60-year-old man was admitted to the hospital because of community-acquired pneumonia. On hospital day 3, he developed increasing shortness of breath and became severely hypoxic, necessitating mechanical ventilation with a PaO2/FiO2 of 180 (see report).\nChest X-ray: Bilateral lung infiltrates.\nWhich of the following is the most likely diagnosis?",
                    "options": [
                        "Myocardial infarction (MI)",
                        "Acute respiratory distress syndrome (ARDS)",
                        "Pleural effusion",
                        "Pulmonary hypertension"
                    ],
                    "answer": 1,
                    "explanation": "Core Concept: Acute Respiratory Distress Syndrome (ARDS) is a form of non-cardiogenic pulmonary edema characterized by diffuse alveolar-capillary injury, often triggered by severe infections like pneumonia or sepsis. Clinical Presentation: · Acute onset of severe dyspnea and refractory hypoxemia · Bilateral crackles on auscultation without signs of left heart failure Diagnosis: · First-line diagnostic plan: Chest X-ray showing bilateral opacities and arterial blood gas (ABG) assessing oxygenation. · Gold standard: Berlin Criteria (acute onset within 1 week, bilateral opacities not fully explained by effusions/heart failure, and PaO2/FiO2 ratio <= 300 mmHg with PEEP >= 5 cmH2O). A ratio of 180 indicates moderate ARDS. Management: · Acute management: Lung-protective mechanical ventilation (low tidal volumes of 6 mL/kg predicted body weight) and treating the underlying trigger. · Gold standard long-term management: ICU supportive care, prone positioning for severe hypoxemia, and post-ICU rehabilitation.",
                    "source": "SMLE bank"
                },
                {
                    "q": "Fifteen minutes after starting a blood transfusion, a patient becomes hypotensive with an oxygen saturation of 88%. What is the diagnosis?",
                    "options": [
                        "Acute hemolytic transfusion reaction",
                        "Acute lung injury (TRALI)",
                        "Allergic reaction"
                    ],
                    "answer": 1,
                    "explanation": "Transfusion-related acute lung injury presents with acute respiratory distress and hypoxia, often with hypotension, occurring within a few hours of transfusion, caused by donor antibodies triggering an inflammatory reaction in the recipient's lungs; this differs from an acute hemolytic reaction, which presents with fever and back pain, or a simple allergic reaction, which usually presents with urticaria.",
                    "source": "SMLE recall"
                }
            ],
        },
    ],
};

export default specialtyPulmonology;
