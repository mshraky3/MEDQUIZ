// AUTO-COPIED from my-react-app/src/components/summaries/content/dentalOralSurgery.js. Do not edit here:
// change the website's file, then run `npm run sync:summaries` in mobile/.
// Oral and Maxillofacial Surgery — dental-track section of the summaries catalog.
// Mirrored for the slide viewer in backend/content/summaryHtml (keep the two in sync).
// Inline questions are copied from the SQB bank.
const dentalOralSurgery = {
    id: "oral-surgery",
    title: "Oral and Maxillofacial Surgery",
    title_en: "SDLE Review — 9 Topics",
    icon: "shield-check",
    accent: "#f59e0b",
    intro: "Oral surgery revision for SDLE: Odontogenic Infections and Fascial Spaces · Extraction Complications · Local Anaesthesia · Bleeding Risk and Medical Precautions · MRONJ · Third Molars and Flap Design · Maxillofacial Trauma · Biopsy, Cysts and Tumours · Deformities and Clefts.",
    subtopics: [
        {
            id: "os-infection",
            title: "01 — Odontogenic Infections and Fascial Spaces",
            title_en: "Source control · spaces · airway",
            summaryHtml: `
<h4 class="deck-topic">Principles</h4>
<ul>
<li>Usually <b>mixed, anaerobe-rich</b> infections</li>
<li><b>Cellulitis</b>: diffuse, firm, painful, spreading, little pus. <b>Abscess</b>: localised, fluctuant, pus</li>
<li>The key treatment is <b>source control</b> (drainage, endodontics or extraction). Antibiotics alone do not cure</li>
<li>Add antibiotics for <b>rapidly spreading cellulitis</b>, fever, malaise, lymphadenopathy, trismus or immune compromise</li>
<li>Localised infection in a healthy or penicillin-allergic patient without spread: drainage and source control are the main treatment</li>
</ul>
<div class="sum-algo"><span class="sum-algo-title">Assessment order</span><ol>
<li><b>Airway</b>: drooling, muffled voice, dysphagia, raised tongue, stridor, cannot lie flat</li>
<li>Systemic state: temperature, pulse, hydration, diabetes and immunity</li>
<li>Spaces involved and speed of spread</li>
<li>Refer or admit if airway, deep space, eye or severe systemic features</li>
<li>Drain, remove the cause, support, review early</li>
</ol></div>
<h4 class="deck-topic">Spaces</h4>
<div class="deck-block deck-tbl"><table>
<thead><tr><th>Space</th><th>Clue</th></tr></thead>
<tbody>
<tr><td><b>Sublingual</b></td><td>Lingual perforation <b>above</b> mylohyoid; raised floor of mouth</td></tr>
<tr><td><b>Submandibular</b></td><td>Lingual perforation <b>below</b> mylohyoid, classically second and third molars</td></tr>
<tr><td><b>Submasseteric</b></td><td>Swelling over ramus and angle with marked trismus</td></tr>
<tr><td><b>Pterygomandibular</b></td><td>Trismus with little external swelling</td></tr>
<tr><td><b>Ludwig angina</b></td><td><b>Bilateral</b> submandibular, sublingual and submental cellulitis; airway emergency</td></tr>
</tbody></table></div>
<ul>
<li>Spread to the <b>cavernous sinus</b> travels through <b>valveless</b> facial and ophthalmic veins; watch for eye swelling, proptosis and cranial nerve signs</li>
<li>Incision for a fluctuant abscess: healthy accessible tissue at the most <b>dependent point of fluctuance</b>, avoiding vital structures. Use blunt dissection and a drain as needed</li>
<li>Imaging: intraoral film or panoramic for the source; <b>contrast CT</b> for deep-space spread, only once the airway is safe</li>
<li><b>Actinomycosis</b>: chronic sinus with yellow "sulfur" granules; needs debridement and prolonged antibiotic</li>
</ul>
<div class="sum-key"><span class="sum-key-title">نقاط امتحانية</span><ul>
<li>Airway comes before imaging and antibiotics.</li>
<li>Source control is essential in every odontogenic infection.</li>
<li>Muffled voice with bilateral floor swelling: emergency referral.</li>
<li>The mylohyoid attachment decides sublingual or submandibular spread.</li>
</ul></div>
`,
            questions: [
                {
                    "q": "An odontogenic infection causes bilateral submandibular and sublingual swelling, elevated tongue, dysphagia, and muffled voice. What is the priority?",
                    "options": [
                        "Emergency airway management and hospital referral",
                        "Oral antibiotics at home only",
                        "Routine extraction in the dental chair",
                        "Observation"
                    ],
                    "answer": 0,
                    "explanation": "This is compatible with Ludwig angina and impending airway compromise. Secure airway, intravenous antimicrobials, and surgical drainage are hospital priorities. Reference: Hupp JR, Ellis E, Tucker MR. Contemporary Oral and Maxillofacial Surgery. 7th ed. Deep neck infection.",
                    "source": "SDLE bank"
                },
                {
                    "q": "Which presentation most clearly supports adjunctive systemic antibiotics for an odontogenic infection?",
                    "options": [
                        "Localized pulpitis",
                        "Draining sinus only",
                        "Apical pain alone",
                        "Rapidly spreading cellulitis"
                    ],
                    "answer": 3,
                    "explanation": "Rapidly spreading cellulitis indicates extension beyond a localized dental source and supports systemic antibiotics in addition to prompt source control. Antibiotics do not replace drainage, endodontic treatment, or extraction when those measures are indicated. Reference: American Dental Association. Evidence-Based Clinical Practice Guideline on Antibiotic Use for Urgent Management of Pulpal- and Periapical-Related Dental Pain and Intraoral Swelling. 2019; Hupp JR et al. Contemporary Oral and Maxillofacial Surgery. 8th ed. Odontogenic infections.",
                    "source": "SDLE bank"
                },
                {
                    "q": "Infection from a mandibular first molar perforates lingual cortex below the mylohyoid line. Which space is involved?",
                    "options": [
                        "Sublingual space",
                        "Submandibular space",
                        "Canine space",
                        "Temporal space"
                    ],
                    "answer": 1,
                    "explanation": "Spread below the mylohyoid enters the submandibular space; spread above it enters the sublingual space. Reference: Hupp JR, Ellis E, Tucker MR. Contemporary Oral and Maxillofacial Surgery. 7th ed. Fascial-space infections.",
                    "source": "SDLE bank"
                },
                {
                    "q": "How can a maxillary odontogenic infection spread to the cavernous sinus?",
                    "options": [
                        "Through the inferior alveolar canal only",
                        "Through the parotid duct",
                        "Through the TMJ disc",
                        "Through valveless facial and ophthalmic venous pathways"
                    ],
                    "answer": 3,
                    "explanation": "Canine-space and midface infections can spread retrograde through angular and ophthalmic veins. Ocular signs, severe headache, or neurologic symptoms require emergency hospital care. Reference: Hupp JR, Ellis E, Tucker MR. Contemporary Oral and Maxillofacial Surgery. 7th ed. Cavernous sinus thrombosis.",
                    "source": "SDLE bank"
                },
                {
                    "q": "Ludwig angina commonly involves which fascial spaces?",
                    "options": [
                        "Bilateral submandibular, sublingual, and submental spaces",
                        "Buccal and canine spaces",
                        "Infratemporal and temporal spaces",
                        "Masseteric space only"
                    ],
                    "answer": 0,
                    "explanation": "Ludwig angina involves both submandibular spaces, both sublingual spaces and the submental space. The other options list spaces that are not part of it. Key takeaway: bilateral submandibular, sublingual and submental spaces.",
                    "source": "SDLE recall"
                }
            ],
        },
        {
            id: "os-extraction",
            title: "02 — Extraction Complications",
            title_en: "Bleeding · dry socket · oroantral opening",
            summaryHtml: `
<h4 class="deck-topic">Bleeding after extraction</h4>
<div class="sum-algo"><span class="sum-algo-title">Steps</span><ol>
<li>Check vital signs and take a drug and bleeding history</li>
<li><b>Firm local pressure</b> with gauze</li>
<li>Inspect: remove liver clot, find the source; haemostatic agent and suture</li>
<li>Still bleeding: reassess the socket <b>and systemic haemostasis</b> while keeping pressure; test and refer</li>
</ol></div>
<h4 class="deck-topic">Pain after extraction</h4>
<div class="deck-block deck-tbl"><table>
<thead><tr><th></th><th>Alveolar osteitis (dry socket)</th><th>Infection</th></tr></thead>
<tbody>
<tr><td>Timing</td><td>About 2 to 4 days</td><td>Any time, often several days</td></tr>
<tr><td>Findings</td><td><b>Empty socket</b>, exposed bone, severe radiating pain, bad odour</td><td>Swelling, pus, fever</td></tr>
<tr><td>Care</td><td><b>Gentle irrigation, soothing dressing, analgesia</b></td><td>Drainage, debridement, antibiotic if indicated</td></tr>
</tbody></table></div>
<ul>
<li>Dry socket risks: smoking, traumatic mandibular molar surgery, oral contraceptives, previous dry socket. Routine antibiotics are not the treatment</li>
</ul>
<h4 class="deck-topic">Oroantral communication</h4>
<ul>
<li>Choice depends on <b>size</b>, sinus disease, time since creation and epithelialisation, and ability to close</li>
<li>Very small (about 2 mm) with a healthy sinus: protect the clot, figure-of-eight suture, sinus precautions</li>
<li>Large (roughly 7 mm or more) or persistent: surgical flap closure, such as a buccal advancement flap</li>
<li>Precautions: no nose blowing or straws, sneeze with the mouth open</li>
</ul>
<h4 class="deck-topic">During extraction</h4>
<ul>
<li>Root fracture risk rises with curved, divergent, thin or ankylosed roots</li>
<li>A third molar or root displaced into a deep space: <b>stop blind probing</b>, image and refer</li>
<li>Usual order for several teeth: maxillary before mandibular, posterior before anterior</li>
<li>Wrong tooth or other error: tell the patient honestly, manage and document (a freshly removed wrong tooth is handled like an avulsion)</li>
</ul>
<div class="sum-key"><span class="sum-key-title">نقاط امتحانية</span><ul>
<li>Pressure is always the first haemostatic step.</li>
<li>Pain on day three with an empty socket and no fever: dry socket.</li>
<li>Small fresh sinus opening: conservative protection.</li>
<li>Never chase a displaced tooth blindly.</li>
</ul></div>
`,
            questions: [
                {
                    "q": "A socket continues to bleed immediately after an extraction. What should be done first?",
                    "options": [
                        "Order screening blood tests first",
                        "Discharge without review",
                        "Prescribe an antifungal",
                        "Apply firm local pressure"
                    ],
                    "answer": 3,
                    "explanation": "Initial management is direct local control: inspect the socket, remove excess clot if needed, identify the source, and apply firm pressure with an appropriate local hemostatic measure. Persistent or disproportionate bleeding then requires further local treatment, medical-history review, laboratory assessment when indicated, and escalation. Reference: Hupp JR et al. Contemporary Oral and Maxillofacial Surgery. 8th ed. Postextraction hemorrhage.",
                    "source": "SDLE bank"
                },
                {
                    "q": "Severe throbbing pain begins three days after extraction, with an empty socket and no swelling or fever. What is the diagnosis?",
                    "options": [
                        "Alveolar osteitis",
                        "Acute abscess",
                        "Osteoradionecrosis",
                        "MRONJ"
                    ],
                    "answer": 0,
                    "explanation": "Loss of the clot produces intense radiating pain and exposed socket bone, typically without purulence or systemic infection. Treatment is irrigation, medicated dressing, analgesia, and review. Reference: Hupp JR, Ellis E, Tucker MR. Contemporary Oral and Maxillofacial Surgery. 7th ed. Alveolar osteitis.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A fresh approximately 2-mm oroantral communication is detected after maxillary molar extraction, with no sinus disease. What is appropriate management?",
                    "options": [
                        "Leave the socket open and probe it",
                        "Protect the clot and place a figure-eight suture",
                        "Create a Caldwell-Luc opening",
                        "Pack the sinus tightly with gauze"
                    ],
                    "answer": 1,
                    "explanation": "A small fresh communication with a healthy sinus can usually be managed by preserving the socket clot, adding an absorbable hemostatic or collagen support if needed, placing a figure-eight suture, giving sinus precautions, and arranging review. Larger or persistent defects require surgical closure. Reference: Hupp JR et al. Contemporary Oral and Maxillofacial Surgery. 8th ed. Oroantral communications.",
                    "source": "SDLE bank"
                },
                {
                    "q": "An oroantral communication is detected immediately after extraction of a maxillary molar. What determines management?",
                    "options": [
                        "Antibiotics alone",
                        "Tooth shade",
                        "Patient age alone",
                        "Defect size, sinus disease, epithelialization, and ability to obtain closure"
                    ],
                    "answer": 3,
                    "explanation": "Small fresh communications may heal with clot protection; larger defects need surgical closure. Sinus precautions and antibiotics are individualized rather than universally curative. Reference: Hupp JR, Ellis E, Tucker MR. Contemporary Oral and Maxillofacial Surgery. 7th ed. Oroantral communication.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A third molar is deeply displaced toward the submandibular space during attempted extraction. What is the appropriate action?",
                    "options": [
                        "Stop blind retrieval, image, and refer for controlled specialist removal",
                        "Chase it through soft tissue",
                        "Leave without informing the patient",
                        "Prescribe antibiotics only"
                    ],
                    "answer": 0,
                    "explanation": "Blind manipulation can displace the tooth farther and injure neurovascular structures. Location and symptoms determine urgency and surgical approach. Reference: Hupp JR, Ellis E, Tucker MR. Contemporary Oral and Maxillofacial Surgery. 7th ed. Displaced tooth complications.",
                    "source": "SDLE bank"
                }
            ],
        },
        {
            id: "os-la",
            title: "03 — Local Anaesthesia and Its Complications",
            title_en: "Dose · blocks · adverse events",
            summaryHtml: `
<h4 class="deck-topic">Dose arithmetic</h4>
<ul>
<li>2% lidocaine = 20 mg/mL, so a 1.8 mL cartridge holds <b>36 mg</b></li>
<li>Maximum mg = weight x mg/kg limit, capped by the absolute maximum; divide by 36 for cartridges and round down in practice</li>
<li>Published lidocaine limits differ (for example 4.4 mg/kg up to 300 mg, or 7 mg/kg up to 500 mg with adrenaline): use the limit given in the question or your local protocol</li>
<li>Adrenaline 1:100,000 is about 0.018 mg per 1.8 mL. A commonly quoted cautious limit in significant cardiac disease is <b>0.04 mg</b></li>
</ul>
<h4 class="deck-topic">Technique</h4>
<ul>
<li><b>Aspirate and inject slowly in increments</b></li>
<li>Conventional inferior alveolar block passes through mucosa and <b>buccinator</b> into the pterygomandibular space; contact bone before injecting</li>
<li>Limited mouth opening: <b>Vazirani-Akinosi</b> closed-mouth block</li>
<li>Gow-Gates targets the neck of the condyle</li>
<li>Infected area: deposit in healthy tissue away from the swelling, using a block when suitable</li>
<li>Lip numb but tooth still sensitive: <b>accessory innervation</b> or an incomplete pulpal block; add a supplemental technique</li>
<li>Upper molars: posterior superior alveolar nerve; the middle superior alveolar nerve, when present, supplies premolars and often the mesiobuccal root of the first molar</li>
<li>The long buccal nerve supplies buccal mucosa and gingiva beside lower molars</li>
</ul>
<div class="deck-block deck-tbl"><table>
<thead><tr><th>Event</th><th>Explanation / action</th></tr></thead>
<tbody>
<tr><td><b>Facial palsy right after block</b></td><td>Solution in the <b>parotid</b> (needle too posterior); temporary. Protect the eye, reassure</td></tr>
<tr><td><b>Trismus days later, no fever</b></td><td>Muscle trauma (medial pterygoid): analgesia, heat, gentle exercise</td></tr>
<tr><td><b>Haematoma</b></td><td>Classic with posterior superior alveolar block; pressure and cold</td></tr>
<tr><td><b>Vasovagal syncope</b></td><td>Pale, sweaty, nauseated, slow pulse: stop, lay flat with legs raised, airway and oxygen as needed, monitor</td></tr>
<tr><td><b>Systemic toxicity</b></td><td>Slurred speech, tingling, agitation, seizures, then depression: stop, call help, support airway and circulation</td></tr>
</tbody></table></div>
<div class="sum-key"><span class="sum-key-title">نقاط امتحانية</span><ul>
<li>One 1.8 mL cartridge of 2% lidocaine is 36 mg.</li>
<li>Aspiration reduces intravascular injection.</li>
<li>Immediate facial weakness means a parotid deposit.</li>
<li>Closed-mouth block for trismus: Vazirani-Akinosi.</li>
</ul></div>
`,
            questions: [
                {
                    "q": "A healthy 50-kg adult is to receive 2% lidocaine with epinephrine in 1.8-mL cartridges. Using a maximum of 7 mg/kg, what is the calculated cartridge limit?",
                    "options": [
                        "About 9.7 cartridges",
                        "About 6.3 cartridges",
                        "About 12 cartridges",
                        "About 18 cartridges"
                    ],
                    "answer": 0,
                    "explanation": "Two-percent lidocaine contains 20 mg/mL, so each 1.8-mL cartridge contains 36 mg. Seven mg/kg for 50 kg is 350 mg; 350 divided by 36 is about 9.7 cartridges. Use the lowest applicable patient-specific limit and the minimum effective dose. Reference: Manufacturer prescribing information for lidocaine with epinephrine; Malamed SF. Handbook of Local Anesthesia. 8th ed.",
                    "source": "SDLE bank"
                },
                {
                    "q": "Which technique most directly reduces the risk of intravascular local anesthetic administration?",
                    "options": [
                        "Aspirate before slow incremental injection",
                        "Inject rapidly under high pressure",
                        "Use the entire cartridge at once",
                        "Avoid reviewing the maximum dose"
                    ],
                    "answer": 0,
                    "explanation": "Aspiration in two planes, slow incremental injection, close observation, and dose calculation reduce the chance and impact of intravascular administration. A negative aspiration does not eliminate risk. Reference: American Academy of Pediatric Dentistry. Use of Local Anesthesia. 2024; Malamed SF. Handbook of Local Anesthesia. 8th ed.",
                    "source": "SDLE bank"
                },
                {
                    "q": "Immediately after an inferior alveolar nerve block, the patient cannot close the eyelid or wrinkle the forehead on that side. What is the most likely cause?",
                    "options": [
                        "Mental nerve anesthesia",
                        "Hematoma of the lip",
                        "Anesthetic deposited in the parotid region",
                        "Allergy to topical anesthetic"
                    ],
                    "answer": 2,
                    "explanation": "Injection too posteriorly can place solution within the parotid gland and transiently block branches of the facial nerve. The eye must be protected until motor function returns. Reference: Malamed SF. Handbook of Local Anesthesia. 8th ed. Facial nerve paralysis following mandibular block.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A patient develops marked trismus one day after repeated mandibular injections. Which technique permits mandibular anesthesia with the mouth closed?",
                    "options": [
                        "Gow-Gates block",
                        "Conventional IAN block",
                        "Vazirani-Akinosi block",
                        "Mental nerve block"
                    ],
                    "answer": 2,
                    "explanation": "The Vazirani-Akinosi technique is a closed-mouth mandibular block and is especially useful when trismus prevents the wide opening needed for a conventional inferior alveolar nerve block. It can anesthetize the main mandibular dental nerves without requiring the patient to open widely. Reference: Malamed SF. Handbook of Local Anesthesia. 7th ed. Chapter 14, Techniques of Mandibular Anesthesia.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A patient becomes pale, sweaty, nauseated, and bradycardic before an injection. What is the most likely event?",
                    "options": [
                        "Local anesthetic toxicity",
                        "Hyperthyroid crisis",
                        "Vasovagal syncope",
                        "Acute infection"
                    ],
                    "answer": 2,
                    "explanation": "Presyncope typically includes pallor, diaphoresis, nausea, and bradycardia. Stop care, place supine with legs elevated as tolerated, maintain airway, give oxygen as needed, and monitor. Reference: Malamed SF. Medical Emergencies in the Dental Office. 8th ed. Syncope.",
                    "source": "SDLE bank"
                }
            ],
        },
        {
            id: "os-medical",
            title: "04 — Bleeding Risk and Medical Precautions",
            title_en: "Anticoagulants · haemophilia · steroids · diabetes",
            summaryHtml: `
<h4 class="deck-topic">Antithrombotic drugs</h4>
<ul>
<li>Do not stop these drugs on your own: thrombosis is usually the greater danger</li>
<li><b>Aspirin</b> or antiplatelet therapy, including after coronary stents: usually <b>continue</b> and use local haemostasis; check how long since the stent and ask the cardiologist when unsure</li>
<li><b>Warfarin</b>: check the <b>INR</b>, ideally within 24 hours. A stable INR below about 4 (UK SDCEP guidance; some protocols use 3.5) allows simple extraction with warfarin continued and local measures</li>
<li><b>Direct oral anticoagulants</b>: plan by bleeding risk and kidney function; INR does not measure them</li>
<li>Local measures: atraumatic technique, haemostatic packing, sutures, pressure, early-day appointment, limit the number of sites. Avoid NSAIDs for pain when bleeding risk is high</li>
</ul>
<h4 class="deck-topic">Coagulation disorders</h4>
<div class="deck-block deck-tbl"><table>
<thead><tr><th>Disorder</th><th>Key point</th></tr></thead>
<tbody>
<tr><td><b>Haemophilia A</b></td><td>Factor VIII deficiency; prolonged aPTT</td></tr>
<tr><td><b>Haemophilia B</b></td><td>Factor IX deficiency; prolonged aPTT</td></tr>
<tr><td><b>Von Willebrand disease</b></td><td>Platelet adhesion problem; may lower factor VIII</td></tr>
<tr><td><b>Liver disease</b></td><td>Check <b>INR and platelet count</b></td></tr>
<tr><td><b>Leukaemia / marrow disease</b></td><td>Low platelets, infection risk</td></tr>
</tbody></table></div>
<p>Plan factor cover with the haematologist; avoid deep blocks without it.</p>
<h4 class="deck-topic">Other conditions</h4>
<ul>
<li><b>Diabetes, well controlled</b>: morning appointment after the usual meal and medication; keep glucose available</li>
<li>Poor control with <b>acute infection</b>: do not delay urgent source control; give indicated antibiotics, monitor glucose, coordinate care</li>
<li><b>Long-term corticosteroids</b>, stable, minor surgery: usually continue the <b>usual daily dose</b>; extra cover depends on adrenal risk and procedure stress</li>
<li><b>Hypertension</b>: repeat the reading; staging depends on pressure, control, urgency and complexity</li>
<li><b>Sickle cell disease</b>: avoid dehydration, hypoxia, acidosis, cold, pain and stress</li>
<li><b>Opioid overdose</b> (unresponsive, slow breathing, pinpoint pupils): call help, <b>ventilate</b>, give naloxone</li>
</ul>
<div class="sum-key"><span class="sum-key-title">نقاط امتحانية</span><ul>
<li>Warfarin is monitored by INR.</li>
<li>Haemophilia A needs factor VIII; B needs factor IX.</li>
<li>Stable aspirin therapy usually continues.</li>
<li>Poor diabetic control never justifies leaving pus undrained.</li>
</ul></div>
`,
            questions: [
                {
                    "q": "A patient taking warfarin has a stable recent INR of 2.5 and needs one uncomplicated extraction. What is appropriate?",
                    "options": [
                        "Stop warfarin for one week",
                        "Cancel solely because of INR",
                        "Continue warfarin and use local hemostasis",
                        "Give vitamin K routinely"
                    ],
                    "answer": 2,
                    "explanation": "A single uncomplicated extraction can generally proceed without interrupting warfarin when the INR is within the therapeutic range. Mechanical pressure, suturing, hemostatic material, and tranexamic acid when appropriate control local bleeding; individual comorbidity and interacting drugs still require review. Reference: American Dental Association. Oral Anticoagulant and Antiplatelet Medications and Dental Procedures. 2026; Scottish Dental Clinical Effectiveness Programme. Management of Dental Patients Taking Anticoagulants or Antiplatelet Drugs. 2nd ed. 2022.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A patient had a coronary stent placed three years ago and takes aspirin 325 mg daily. A simple extraction is planned. What is appropriate management?",
                    "options": [
                        "Stop aspirin for seven days",
                        "Give antibiotic prophylaxis for the stent",
                        "Delay dental care permanently",
                        "Continue aspirin and use local hemostatic measures"
                    ],
                    "answer": 3,
                    "explanation": "Aspirin is generally continued for simple extraction because thrombotic harm from interruption outweighs manageable local bleeding. Coronary stenting alone is not an indication for infective- endocarditis prophylaxis. Reference: American Dental Association. Oral Anticoagulant and Antiplatelet Medications and Dental Procedures. Current 2026 guidance.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A patient with hemophilia A develops severe bleeding after third-molar extraction. Which replacement factor is indicated?",
                    "options": [
                        "Factor VIII",
                        "Factor IX",
                        "Vitamin K",
                        "Platelets alone"
                    ],
                    "answer": 0,
                    "explanation": "Hemophilia A is factor VIII deficiency. Severe bleeding requires urgent hemophilia-team-directed factor VIII replacement plus local hemostasis and an antifibrinolytic when appropriate; aminocaproic acid alone is an adjunct, not the missing factor. Reference: World Federation of Hemophilia. Guidelines for the Management of Hemophilia. 3rd ed.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A patient with liver cirrhosis needs a simple extraction. Which preoperative laboratory assessment is most relevant?",
                    "options": [
                        "Serum amylase only",
                        "Skin-prick testing",
                        "Current INR and platelet count",
                        "No laboratory review"
                    ],
                    "answer": 2,
                    "explanation": "Cirrhosis can impair coagulation-factor synthesis and reduce platelet count. INR, CBC with platelets, medications, liver and renal status, clinical bleeding history, and local hemostatic planning are interpreted together. Reference: AASLD guidance on procedural bleeding in cirrhosis; Little and Falace. 10th ed.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A medically stable patient on prolonged systemic corticosteroids needs a low-stress minor oral procedure and has no adrenal symptoms. What is appropriate?",
                    "options": [
                        "Stop steroids abruptly",
                        "Give 75 mg hydrocortisone routinely",
                        "Continue the usual daily dose",
                        "Give 25 mg without assessment"
                    ],
                    "answer": 2,
                    "explanation": "Routine low-stress procedures generally do not require automatic supplementation. Continue the usual dose; larger surgical stress or suspected adrenal insufficiency requires individualized medical planning. Reference: Endocrine Society and European Society of Endocrinology. Glucocorticoid-Induced Adrenal Insufficiency Guideline. 2024.",
                    "source": "SDLE bank"
                }
            ],
        },
        {
            id: "os-mronj",
            title: "05 — Medication-Related Osteonecrosis (MRONJ)",
            title_en: "Definition · stages · prevention",
            summaryHtml: `
<h4 class="deck-topic">Definition (all three)</h4>
<ul>
<li>Current or past <b>antiresorptive</b> (bisphosphonate, denosumab), alone or with immune or antiangiogenic therapy</li>
<li>Exposed bone, or bone probed through a fistula, for <b>more than 8 weeks</b></li>
<li>No radiotherapy to the jaws and no obvious metastatic disease there</li>
</ul>
<p>Risk is far higher with <b>high-dose intravenous</b> therapy for cancer (for example zoledronic acid) than with oral therapy for osteoporosis. The mandible is affected more often.</p>
<h4 class="deck-topic">Staging (AAOMS 2022)</h4>
<div class="deck-block deck-tbl"><table>
<thead><tr><th>Stage</th><th>Findings</th><th>Care</th></tr></thead>
<tbody>
<tr><td>At risk</td><td>On the drug, no disease</td><td>Education, prevention</td></tr>
<tr><td>0</td><td>No exposed bone; unexplained symptoms or imaging changes</td><td>Symptom control, close review</td></tr>
<tr><td>1</td><td>Exposed bone, <b>no symptoms and no infection</b></td><td>Antimicrobial rinse, follow-up</td></tr>
<tr><td>2</td><td>Exposed bone with <b>pain and infection</b></td><td>Rinse, antibiotics, pain control; surgery when appropriate</td></tr>
<tr><td>3</td><td>Plus spread beyond alveolar bone, <b>pathological fracture</b>, extraoral fistula or oroantral or oronasal opening</td><td>Infection control and surgery, possibly <b>resection and reconstruction</b></td></tr>
</tbody></table></div>
<h4 class="deck-topic">Dental care</h4>
<ul>
<li>Best prevention: dental assessment and treatment <b>before</b> therapy, good hygiene and regular review</li>
<li>During high-dose therapy, prefer <b>non-surgical options</b> such as root canal treatment when they are predictable; avoid elective implants</li>
<li>An unavoidable extraction: discuss risk, <b>coordinate with the oncologist</b>, be atraumatic and follow until healed</li>
<li>Antibiotic prophylaxis is <b>not automatic</b> for everyone; treat infection, and individualise</li>
<li>Drug holidays are debated and are the prescriber's decision</li>
<li>Exposed bone after local trauma with no drug or radiation history needs assessment for other causes (ischaemia, infection, sequestrum, systemic disease)</li>
<li><b>Chronic suppurative osteomyelitis</b> differs: pus, sinus tracts and <b>sequestrum</b> formation</li>
</ul>
<div class="sum-key"><span class="sum-key-title">نقاط امتحانية</span><ul>
<li>The time threshold is more than eight weeks.</li>
<li>Quiet exposed bone is stage 1; infected is stage 2; fracture or fistula is stage 3.</li>
<li>Radiotherapy history points to osteoradionecrosis instead.</li>
<li>High-dose IV therapy: avoid extraction if a safe alternative exists.</li>
</ul></div>
`,
            questions: [
                {
                    "q": "Exposed jaw bone persists for more than eight weeks in an antiresorptive-treated patient with no jaw radiation history. What diagnosis should be considered?",
                    "options": [
                        "Alveolar osteitis",
                        "Recurrent aphthous ulcer",
                        "Medication-related osteonecrosis of the jaw",
                        "Geographic tongue"
                    ],
                    "answer": 2,
                    "explanation": "MRONJ criteria include relevant medication exposure, exposed or probeable bone persisting over eight weeks, and no jaw radiation or metastatic disease to the jaw explaining it. Reference: Ruggiero SL, Dodson TB, Aghaloo T, et al. AAOMS Position Paper—2022 Update.",
                    "source": "SDLE bank"
                },
                {
                    "q": "An antiresorptive-treated patient has exposed bone without pain or infection. Which stage is most consistent?",
                    "options": [
                        "Stage 0 only",
                        "Stage 3 MRONJ",
                        "Alveolar osteitis",
                        "Stage 1 MRONJ"
                    ],
                    "answer": 3,
                    "explanation": "Stage 1 has exposed necrotic bone or a fistula probing to bone without infection or symptoms. Education, topical care, hygiene, and surveillance are typical. Reference: Ruggiero SL, Dodson TB, Aghaloo T, et al. AAOMS Position Paper—2022 Update.",
                    "source": "SDLE bank"
                },
                {
                    "q": "Exposed necrotic bone is painful with erythema and purulent drainage but no pathologic fracture. Which stage is most consistent?",
                    "options": [
                        "Stage 2 MRONJ",
                        "Stage 1 MRONJ",
                        "Stage 0 MRONJ",
                        "Normal healing"
                    ],
                    "answer": 0,
                    "explanation": "Stage 2 includes exposed or probeable necrotic bone with infection and symptoms. Antimicrobial measures, pain control, removal of irritants, and surgical management are individualized. Reference: Ruggiero SL, Dodson TB, Aghaloo T, et al. AAOMS Position Paper—2022 Update.",
                    "source": "SDLE bank"
                },
                {
                    "q": "MRONJ extends to the inferior mandibular border with a pathologic fracture and extraoral fistula. Which stage is most consistent?",
                    "options": [
                        "Stage 1 MRONJ",
                        "Stage 3 MRONJ",
                        "Stage 0 MRONJ",
                        "Reversible mucositis"
                    ],
                    "answer": 1,
                    "explanation": "Advanced extension beyond alveolar bone, pathologic fracture, extraoral fistula, or oroantral communication meets stage 3 features and often requires specialist surgical management. Reference: Ruggiero SL, Dodson TB, Aghaloo T, et al. AAOMS Position Paper—2022 Update.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A cancer patient receiving high-dose intravenous zoledronic acid has a nonrestorable but asymptomatic tooth. What is the preferred principle?",
                    "options": [
                        "Avoid extraction if a predictable nonoperative alternative can control disease",
                        "Extract routinely without consultation",
                        "Stop zoledronic acid independently",
                        "Place an implant immediately"
                    ],
                    "answer": 0,
                    "explanation": "Cancer-dose antiresorptive therapy carries high MRONJ risk. Endodontic treatment with crown removal or other nonoperative stabilization may be preferred when feasible. Reference: Ruggiero SL, Dodson TB, Aghaloo T, et al. AAOMS Position Paper on Medication-Related Osteonecrosis of the Jaws—2022 Update. J Oral Maxillofac Surg. 2022;80:920-943.",
                    "source": "SDLE bank"
                }
            ],
        },
        {
            id: "os-third",
            title: "06 — Third Molars, Flaps and Surgical Principles",
            title_en: "Pericoronitis · nerve risk · flap design",
            summaryHtml: `
<h4 class="deck-topic">Pericoronitis</h4>
<ul>
<li>Localised: <b>irrigate, debride</b>, hygiene advice, analgesia; manage a traumatic opposing tooth</li>
<li>Fever, swelling, trismus, fast pulse or spread: urgent source control, systemic assessment, antibiotics and referral as needed</li>
<li>Recurrent episodes with <b>no room to erupt</b>: remove the third molar after the acute phase</li>
<li>Also remove for unrestorable caries, damage or resorption of the second molar, or associated pathology</li>
</ul>
<h4 class="deck-topic">Impaction and nerve risk</h4>
<ul>
<li>Angulation (Winter): mesioangular, horizontal, vertical, distoangular. Pell and Gregory describes depth and relation to the ramus. In the mandible, distoangular is usually the hardest</li>
<li>Panoramic warning signs: darkened or deflected roots, interrupted canal cortex, diverted or narrowed canal</li>
<li>Limited-field <b>CBCT</b> when doubt remains and it will change management</li>
<li>Close relation: specialist risk discussion of options, including <b>coronectomy</b> for a suitable vital, non-infected tooth</li>
<li>Nerves at risk: inferior alveolar (lip and chin) and <b>lingual</b> (tongue). Lingual nerve is also at risk when reducing the mylohyoid ridge</li>
</ul>
<h4 class="deck-topic">Flaps</h4>
<div class="deck-block deck-tbl"><table>
<thead><tr><th>Flap</th><th>Description</th></tr></thead>
<tbody>
<tr><td>Envelope</td><td>Sulcular incision without vertical release</td></tr>
<tr><td><b>Triangular</b></td><td><b>One</b> vertical releasing incision</td></tr>
<tr><td>Trapezoidal</td><td>Two releasing incisions</td></tr>
<tr><td>Full thickness</td><td>Mucosa plus <b>periosteum</b></td></tr>
<tr><td>Partial thickness</td><td>Epithelium and connective tissue; periosteum stays on bone</td></tr>
</tbody></table></div>
<ul>
<li>Base wider than the free margin, closure over sound bone, releases at line angles, protect mental and lingual nerves, reflect gently and close without tension</li>
<li>Bone removal needs a sharp bur with copious sterile irrigation; section the tooth to save bone</li>
</ul>
<div class="sum-key"><span class="sum-key-title">نقاط امتحانية</span><ul>
<li>Local pericoronitis: local care first.</li>
<li>One releasing incision makes a triangular flap.</li>
<li>CBCT is for a decision, not for routine.</li>
<li>A broad flap base protects blood supply.</li>
</ul></div>
`,
            questions: [
                {
                    "q": "A partially erupted third molar has localized painful inflamed operculum without fever, trismus, or spread. What is initial treatment?",
                    "options": [
                        "Irrigation, debridement, hygiene, and analgesia",
                        "Systemic antibiotics routinely",
                        "Hospital admission",
                        "Ignore the site"
                    ],
                    "answer": 0,
                    "explanation": "Localized pericoronitis is primarily treated by local measures. Antibiotics are reserved for systemic involvement, spreading infection, or high-risk patients. Reference: Hupp JR, Ellis E, Tucker MR. Contemporary Oral and Maxillofacial Surgery. 7th ed. Pericoronitis.",
                    "source": "SDLE bank"
                },
                {
                    "q": "Pericoronitis recurs around a horizontally impacted third molar with no eruption potential and distal bone loss on the second molar. What is definitive treatment?",
                    "options": [
                        "Repeated operculectomy",
                        "Antibiotics alone",
                        "Third-molar extraction after acute control",
                        "Extract the first molar"
                    ],
                    "answer": 2,
                    "explanation": "A pathologic nonfunctional third molar with damage to the second molar is generally removed when surgical risk is acceptable. Reference: Hupp JR, Ellis E, Tucker MR. Contemporary Oral and Maxillofacial Surgery. 7th ed. Indications for third-molar removal.",
                    "source": "SDLE bank"
                },
                {
                    "q": "What imaging is preferred when mandibular third-molar roots appear superimposed on the inferior alveolar canal and surgical risk is uncertain?",
                    "options": [
                        "Bitewing only",
                        "No imaging",
                        "MRI in every case",
                        "Limited-field CBCT when it will change management"
                    ],
                    "answer": 3,
                    "explanation": "CBCT can define buccolingual nerve relationship and signs of intimate contact. It is justified selectively rather than used routinely. Reference: White SC, Pharoah MJ. Oral Radiology: Principles and Interpretation. 8th ed. Third-molar imaging.",
                    "source": "SDLE bank"
                },
                {
                    "q": "Which nerve is at risk during surgical reduction of a prominent posterior mandibular mylohyoid ridge?",
                    "options": [
                        "Lingual nerve",
                        "Mental nerve",
                        "Infraorbital nerve",
                        "Long buccal nerve"
                    ],
                    "answer": 0,
                    "explanation": "The lingual nerve lies close to the medial mandibular periosteum in the posterior mandible and must be protected during lingual flap elevation and mylohyoid-ridge reduction. Careful subperiosteal technique and controlled instrumentation reduce injury risk. Reference: Hupp JR et al. Contemporary Oral and Maxillofacial Surgery. 8th ed. Preprosthetic surgery and lingual anatomy.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A partial-thickness flap includes:",
                    "options": [
                        "Epithelium and connective tissue only",
                        "Epithelium, connective tissue, and periosteum",
                        "Periosteum only",
                        "Bone and periosteum"
                    ],
                    "answer": 0,
                    "explanation": "A partial-thickness (split) flap keeps the periosteum on the bone and lifts only the epithelium and some connective tissue. A full-thickness flap includes periosteum. Key takeaway: partial thickness leaves the periosteum.",
                    "source": "SDLE recall"
                }
            ],
        },
        {
            id: "os-trauma",
            title: "07 — Maxillofacial Trauma",
            title_en: "Primary survey · mandible · midface",
            summaryHtml: `
<div class="sum-algo"><span class="sum-algo-title">Primary survey first</span><ol>
<li><b>Airway</b> with cervical spine protection</li>
<li>Breathing</li>
<li>Circulation and bleeding control</li>
<li>Neurological status</li>
<li>Then examine the face and occlusion</li>
</ol></div>
<h4 class="deck-topic">Mandible</h4>
<ul>
<li>Signs: changed occlusion, step, mobility, pain, <b>sublingual haematoma</b>, lip numbness, deviation on opening</li>
<li><b>A fall or blow on the chin</b> classically fractures the <b>condyle</b> (check both) with or without the symphysis</li>
<li>Unilateral condyle: deviation <b>toward</b> the injured side. Bilateral displaced condyles: anterior open bite</li>
<li>Names: a <b>symphysis</b> fracture is at the midline; a <b>parasymphysis</b> fracture is in the anterior tooth-bearing region just beside the midline</li>
<li>Minimally displaced condyles with <b>good occlusion</b>: soft diet, mobilisation, guiding elastics and close review. Surgery for selected displacement, malocclusion or loss of ramus height</li>
<li>Displaced fractures of the tooth-bearing mandible: usually <b>reduction and internal fixation</b> with plates</li>
<li>Frequency of fracture sites varies with population and mechanism</li>
</ul>
<h4 class="deck-topic">Midface and orbit</h4>
<div class="deck-block deck-tbl"><table>
<thead><tr><th>Injury</th><th>Clues</th></tr></thead>
<tbody>
<tr><td><b>Zygomaticomaxillary complex</b></td><td>Flat cheek, orbital rim step, subconjunctival bleeding, infraorbital numbness, <b>diplopia, upper buccal sulcus ecchymosis</b>, trismus</td></tr>
<tr><td><b>Orbital blowout</b></td><td><b>Diplopia on upward gaze</b> (entrapment), enophthalmos, infraorbital numbness</td></tr>
<tr><td>Le Fort I</td><td>Tooth-bearing maxilla mobile</td></tr>
<tr><td>Le Fort II</td><td>Pyramidal, involves nasal bridge and infraorbital rims</td></tr>
<tr><td>Le Fort III</td><td>Craniofacial separation</td></tr>
</tbody></table></div>
<ul>
<li>Suspected orbital or midface fracture: <b>thin-section CT</b></li>
<li>Urgent eye signs: falling vision, severe pain, proptosis (retrobulbar haemorrhage)</li>
<li>Dentoalveolar fracture: reposition and apply a flexible splint for about <b>4 weeks</b></li>
</ul>
<div class="sum-key"><span class="sum-key-title">نقاط امتحانية</span><ul>
<li>Airway first in every trauma stem.</li>
<li>Chin trauma: look at the condyles.</li>
<li>Upward gaze double vision suggests blowout entrapment.</li>
<li>Alveolar fracture splint: four weeks.</li>
</ul></div>
`,
            questions: [
                {
                    "q": "What is a mandibular fracture through the midline called?",
                    "options": [
                        "Angle fracture",
                        "Symphysis fracture",
                        "Subcondylar fracture",
                        "Coronoid fracture"
                    ],
                    "answer": 1,
                    "explanation": "A fracture through the mandibular midline is a symphysis fracture. Fractures immediately lateral to the midline in the canine region are commonly described as parasymphysis fractures. Reference: Hupp JR et al. Contemporary Oral and Maxillofacial Surgery. 8th ed. Mandibular fracture classification.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A fracture passes through the tooth-bearing anterior mandible between the canine regions but not exactly at the midline. How is it classified?",
                    "options": [
                        "Angle fracture",
                        "Condylar fracture",
                        "Parasymphyseal fracture",
                        "Coronoid fracture"
                    ],
                    "answer": 2,
                    "explanation": "Symphyseal fractures involve the midline, while parasymphyseal fractures lie adjacent in the anterior tooth-bearing region. Reference: Hupp JR, Ellis E, Tucker MR. Contemporary Oral and Maxillofacial Surgery. 7th ed. Mandibular fracture classification.",
                    "source": "SDLE bank"
                },
                {
                    "q": "After trauma to the right midface, a patient has diplopia and upper-buccal sulcus ecchymosis. Which fracture is most likely?",
                    "options": [
                        "Le Fort I fracture",
                        "Zygomaticomaxillary complex fracture",
                        "Isolated mandibular angle fracture",
                        "Nasal fracture"
                    ],
                    "answer": 1,
                    "explanation": "A ZMC fracture can involve the orbital floor and rim, causing diplopia, infraorbital sensory change, malar flattening, and buccal sulcus ecchymosis or step deformity. Thin-section CT and urgent ocular assessment are indicated. Reference: Hupp JR et al. Contemporary Oral and Maxillofacial Surgery. 8th ed. Zygomaticomaxillary complex fractures.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A patient has periorbital trauma, bleeding, and ecchymosis. Which imaging study is preferred when an orbital fracture is suspected?",
                    "options": [
                        "Thin-section CT",
                        "Panoramic radiograph",
                        "Submentovertex radiograph",
                        "Occlusal radiograph"
                    ],
                    "answer": 0,
                    "explanation": "Thin-section CT with multiplanar reconstructions best assesses orbital walls, globe and muscle entrapment, displaced bone, and associated facial fractures. Imaging does not replace urgent ocular examination when vision-threatening injury is possible. Reference: American College of Radiology. ACR Appropriateness Criteria: Orbits, Vision, and Visual Loss. Suspected orbital injury. 2026.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A child falls directly on the chin. Which fracture is most commonly associated?",
                    "options": [
                        "Zygomatic fracture",
                        "Condylar fracture",
                        "Le Fort fracture",
                        "Nasal fracture"
                    ],
                    "answer": 1,
                    "explanation": "A blow to the chin transmits force to the condyles, so condylar fractures are most commonly associated. The zygoma, nose and Le Fort levels are less linked. Key takeaway: chin trauma, think condyle.",
                    "source": "SDLE recall"
                }
            ],
        },
        {
            id: "os-pathology",
            title: "08 — Biopsy, Cysts and Jaw Tumours",
            title_en: "Aspiration · incisional · enucleation · resection",
            summaryHtml: `
<h4 class="deck-topic">Before cutting</h4>
<ul>
<li>History, examination, pulp tests and imaging; use cross-sectional imaging for large lesions</li>
<li>Before opening a <b>radiolucent intraosseous lesion, aspirate</b> to exclude a vascular lesion and learn about the contents</li>
</ul>
<div class="deck-block deck-tbl"><table>
<thead><tr><th>Aspirate</th><th>Suggests</th></tr></thead>
<tbody>
<tr><td>Bright pulsating or abundant blood</td><td>Vascular lesion: <b>do not proceed</b>, refer</td></tr>
<tr><td>Straw-coloured fluid</td><td>Cyst</td></tr>
<tr><td>Thick keratin-like material</td><td>Keratocyst</td></tr>
<tr><td>Pus</td><td>Infection: drain and treat while getting a diagnosis</td></tr>
<tr><td>Air</td><td>Empty cavity or sinus</td></tr>
</tbody></table></div>
<h4 class="deck-topic">Biopsy type</h4>
<ul>
<li><b>Incisional</b>: large (for example several centimetres) or suspicious lesions, before definitive surgery</li>
<li><b>Excisional</b>: small lesions likely benign</li>
<li>Persistent induration, ulceration or fixation, or a white plaque that stays two weeks after removing trauma: biopsy or specialist referral</li>
</ul>
<h4 class="deck-topic">Treatment patterns</h4>
<div class="deck-cards">
<div class="deck-card mgmt"><div class="deck-card-h">Enucleation</div><p>Remove the whole lining. Dentigerous cyst with a tooth not being kept: enucleate and extract.</p></div>
<div class="deck-card clin"><div class="deck-card-h">Marsupialisation / decompression</div><p>For very large cysts near nerve, sinus or with fracture risk, or to let a useful tooth erupt. The lesion shrinks and needs follow-up.</p></div>
<div class="deck-card diag"><div class="deck-card-h">Resection</div><p>Conventional solid or multicystic <b>ameloblastoma</b>: resection with a bony margin.</p></div>
<div class="deck-card"><div class="deck-card-h">Others</div><p>Simple bone cyst: explore and curette to cause bleeding. Persistent mucocele: excise with the adjacent minor glands. Odontoma blocking eruption: surgical removal.</p></div>
</div>
<ul>
<li>A pregnant patient's pyogenic granuloma that is minor may be observed; if it <b>interferes with function</b> or bleeds significantly, excision with removal of irritants can be done, accepting possible recurrence</li>
</ul>
<div class="sum-key"><span class="sum-key-title">نقاط امتحانية</span><ul>
<li>Aspirate before entering a jaw radiolucency.</li>
<li>Large lesion: incisional biopsy first.</li>
<li>Huge cyst with fracture risk: marsupialise or decompress.</li>
<li>Conventional ameloblastoma is not treated by simple curettage.</li>
</ul></div>
`,
            questions: [
                {
                    "q": "A large jaw radiolucency expands bone and produces an “egg-shell” crackling. Before incision, which test can help exclude a vascular lesion?",
                    "options": [
                        "Electric pulp test only",
                        "Percussion only",
                        "Aspiration",
                        "Shade matching"
                    ],
                    "answer": 2,
                    "explanation": "Aspiration may reveal blood, cystic fluid, pus, or an empty cavity and is critical when vascularity is possible. It does not replace imaging and histology. Reference: Hupp JR, Ellis E, Tucker MR. Contemporary Oral and Maxillofacial Surgery. 7th ed. Evaluation and biopsy of jaw lesions.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A large 8 × 6-cm intraosseous jaw lesion causes cortical expansion, tooth displacement, and root resorption. Which biopsy approach is generally appropriate before definitive treatment?",
                    "options": [
                        "Excisional biopsy",
                        "Brush cytology",
                        "No tissue diagnosis",
                        "Incisional biopsy"
                    ],
                    "answer": 3,
                    "explanation": "A large destructive lesion should not ordinarily be removed blindly. After adequate imaging and aspiration when indicated, a representative incisional biopsy establishes the diagnosis and guides definitive management. Reference: American Association of Oral and Maxillofacial Surgeons. Clinical Practice Guidelines for Oral and Maxillofacial Surgery. Pathologic conditions; Neville et al. Oral and Maxillofacial Pathology. 5th ed.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A very large benign cystic lesion risks fracture and damage to adjacent structures if fully removed. What initial surgical approach may be chosen?",
                    "options": [
                        "Radical resection automatically",
                        "Observation without diagnosis",
                        "Endodontic treatment of all teeth",
                        "Marsupialization or decompression"
                    ],
                    "answer": 3,
                    "explanation": "Decompression reduces intracystic pressure and lesion size, preserves structures, and may permit later enucleation. Histologic diagnosis and adherence are essential. Reference: Hupp JR, Ellis E, Tucker MR. Contemporary Oral and Maxillofacial Surgery. 7th ed. Management of jaw cysts.",
                    "source": "SDLE bank"
                },
                {
                    "q": "What is standard treatment for a conventional solid or multicystic ameloblastoma of the mandible?",
                    "options": [
                        "Resection with an adequate bony margin",
                        "Observation only",
                        "Antibiotics alone",
                        "Simple aspiration"
                    ],
                    "answer": 0,
                    "explanation": "Conventional ameloblastoma has infiltrative microscopic extensions and a high recurrence rate after simple curettage. Resection with an appropriate margin is standard, tailored to site, size, and reconstructive plan. Reference: WHO Classification of Head and Neck Tumours. 5th ed.; Hupp JR et al. 8th ed.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A persistent recurrent lower-lip mucocele requires definitive treatment. What is the standard approach?",
                    "options": [
                        "Blind aspiration only",
                        "Systemic antibiotics",
                        "Excision with adjacent minor salivary glands",
                        "Bone curettage"
                    ],
                    "answer": 2,
                    "explanation": "A persistent lower-lip mucocele is excised together with the associated minor salivary glands to reduce recurrence. Because most are extravasation pseudocysts without an epithelial lining, simple enucleation is not the most accurate description. Reference: Neville BW et al. Oral and Maxillofacial Pathology. 5th ed. Mucocele.",
                    "source": "SDLE bank"
                }
            ],
        },
        {
            id: "os-deformity",
            title: "09 — Dentofacial Deformities and Clefts",
            title_en: "Orthognathic planning · cleft description",
            summaryHtml: `
<h4 class="deck-topic">Locate the problem</h4>
<ul>
<li>Use facial analysis, occlusion and cephalometry: <b>SNA</b> relates the maxilla and <b>SNB</b> the mandible to the cranial base; <b>ANB</b> compares the two</li>
<li>Typical reference values are near SNA 82, SNB 80, ANB 2 degrees (population norms vary)</li>
</ul>
<div class="deck-block deck-tbl"><table>
<thead><tr><th>Problem</th><th>Usual jaw procedure</th></tr></thead>
<tbody>
<tr><td>Maxillary deficiency (low SNA, normal SNB)</td><td><b>Maxillary advancement</b> (Le Fort I)</td></tr>
<tr><td><b>Vertical maxillary excess</b>, large gummy smile, open bite</td><td><b>Le Fort I impaction</b></td></tr>
<tr><td>Mandibular deficiency or excess</td><td><b>Bilateral sagittal split osteotomy</b> (advance or set back)</td></tr>
<tr><td>Chin position</td><td>Genioplasty</td></tr>
</tbody></table></div>
<ul>
<li>Elective orthognathic surgery in adolescents is usually timed after <b>growth is complete</b>, and combined with orthodontics</li>
<li>Check the cause of a gummy smile first: gingival enlargement, altered passive eruption, short lip or skeletal excess need different care</li>
<li>BSSO risk: inferior alveolar nerve sensory change</li>
</ul>
<h4 class="deck-topic">Clefts</h4>
<ul>
<li>The <b>incisive foramen</b> separates the <b>primary palate</b> (lip, alveolus, premaxilla) from the <b>secondary palate</b> (hard palate behind it and soft palate)</li>
<li>Soft palate only: cleft of the secondary palate</li>
<li>Through lip and alveolus up to the incisive foramen, one side: complete unilateral cleft of the primary palate</li>
<li>Describe as: side, complete or incomplete, structures involved</li>
</ul>
<div class="sum-algo"><span class="sum-algo-title">Broad cleft care (timing varies by team)</span><ol>
<li>Feeding support and team assessment from birth</li>
<li>Lip repair in early infancy</li>
<li>Palate repair around the first year, to help speech</li>
<li>Alveolar bone graft in the mixed dentition, commonly before the canine erupts</li>
<li>Orthodontics, then orthognathic surgery after growth if needed</li>
</ol></div>
<h4 class="deck-topic">Family history</h4>
<ul>
<li>Several relatives with missing teeth and no other abnormality suggests <b>non-syndromic familial hypodontia</b></li>
</ul>
<div class="sum-key"><span class="sum-key-title">نقاط امتحانية</span><ul>
<li>Gummy smile from vertical maxillary excess: maxillary impaction.</li>
<li>Mandibular retrognathia in an adult: sagittal split advancement.</li>
<li>The incisive foramen divides primary and secondary palate.</li>
<li>Normal SNB with low SNA points to the maxilla.</li>
</ul></div>
`,
            questions: [
                {
                    "q": "A 25-year-old patient has a normal SNB angle and a decreased SNA angle. What is the appropriate surgical treatment?",
                    "options": [
                        "Mandibular setback",
                        "Maxillary advancement",
                        "Maxillary setback",
                        "Mandibular advancement"
                    ],
                    "answer": 1,
                    "explanation": "A decreased SNA means the maxilla is retrusive, so maxillary advancement is the surgical option. Key takeaway: SNA relates to the maxilla.",
                    "source": "SDLE recall"
                },
                {
                    "q": "Patient with gummy smile , about 9mm of gingiva appears with incompetent lips , patient has normal upper lip length , what is the best treatment option in this case ?",
                    "options": [
                        "Botox injection",
                        "Lefort osteotomy",
                        "Lefort I impaction",
                        "Lip repositioning"
                    ],
                    "answer": 2,
                    "explanation": "A gummy smile of 9 mm with incompetent lips and normal lip length indicates vertical maxillary excess, treated by Le Fort I impaction. Botox or lip repositioning treat milder cases. Key takeaway: severe gummy smile = Le Fort I impaction.",
                    "source": "SDLE recall"
                },
                {
                    "q": "A cleft involves the soft palate only. How is it described anatomically?",
                    "options": [
                        "Cleft primary palate",
                        "Isolated cleft lip",
                        "Cleft secondary palate",
                        "Median mandibular cleft"
                    ],
                    "answer": 2,
                    "explanation": "The secondary palate includes hard palate posterior to the incisive foramen and the soft palate. The primary palate includes lip and alveolus anterior to the foramen. Reference: Neville BW, Damm DD, Allen CM, Chi AC. Oral and Maxillofacial Pathology. 5th ed. Cleft lip and palate.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A unilateral cleft extends through the lip and alveolus to the incisive foramen but not the secondary palate. What is the classification?",
                    "options": [
                        "Isolated secondary-palate cleft",
                        "Bilateral complete cleft",
                        "Submucous cleft only",
                        "Complete unilateral cleft of the primary palate"
                    ],
                    "answer": 3,
                    "explanation": "Extent relative to the incisive foramen and laterality define the anatomic description. Photographs and operative records are needed for exact classification. Reference: Neville BW, Damm DD, Allen CM, Chi AC. Oral and Maxillofacial Pathology. 5th ed. Orofacial clefts.",
                    "source": "SDLE bank"
                }
            ],
        },
    ],
};

export default dentalOralSurgery;
