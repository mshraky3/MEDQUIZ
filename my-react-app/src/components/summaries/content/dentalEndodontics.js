// Endodontics — dental-track section of the summaries catalog.
// Mirrored for the slide viewer in backend/content/summaryHtml (keep the two in sync).
// Inline questions are copied from the SQB bank.
const dentalEndodontics = {
    id: "endodontics",
    title: "Endodontics",
    title_en: "SDLE Review — 9 Topics",
    icon: "shield-check",
    accent: "#818cf8",
    intro: "Endodontics revision for SDLE: Pulp and Periapical Diagnosis · Dental Trauma · Vital Pulp Therapy and Immature Teeth · Canal Anatomy and Access · Instruments and Shaping · Irrigation and Medicaments · Obturation and Outcomes · Procedural Accidents · Resorption, Root Fracture and Endo-Perio Lesions.",
    subtopics: [
        {
            id: "en-diagnosis",
            title: "01 — Pulp and Periapical Diagnosis",
            title_en: "Pulp status · apical status · tests",
            summaryHtml: `
<h4 class="deck-topic">Always give two diagnoses: pulpal and apical</h4>
<div class="deck-block deck-tbl"><table>
<thead><tr><th>Pulp diagnosis</th><th>Typical findings</th></tr></thead>
<tbody>
<tr><td><b>Normal</b></td><td>No symptoms; brief, mild response to testing</td></tr>
<tr><td><b>Reversible pulpitis</b></td><td>Sharp pain provoked by cold or sweets; stops within seconds of removing the stimulus; no spontaneous pain</td></tr>
<tr><td><b>Symptomatic irreversible pulpitis</b></td><td>Lingering thermal pain and/or spontaneous pain; may wake the patient</td></tr>
<tr><td><b>Asymptomatic irreversible pulpitis</b></td><td>No symptoms, but caries or trauma has produced inflammation judged unable to heal (classically exposure on caries removal)</td></tr>
<tr><td><b>Necrosis</b></td><td>Usually no response to sensibility tests</td></tr>
</tbody></table></div>
<h4 class="deck-topic">Apical diagnosis</h4>
<ul>
<li><b>Normal apical tissues</b>: not tender to percussion or palpation; uniform ligament space, intact lamina dura</li>
<li><b>Symptomatic apical periodontitis</b>: pain on biting or percussion; radiolucency may or may not be present</li>
<li><b>Asymptomatic apical periodontitis</b>: radiolucency of pulpal origin without symptoms</li>
<li><b>Acute apical abscess</b>: rapid onset, spontaneous pain, pus, swelling</li>
<li><b>Chronic apical abscess</b>: little or no discomfort with a <b>sinus tract</b></li>
</ul>
<h4 class="deck-topic">Tests and what they tell you</h4>
<ul>
<li><b>Cold and electric tests</b> are <i>sensibility</i> tests: they test nerve response, not blood flow. Compare with control teeth</li>
<li><b>Percussion</b> localises inflammation in the periodontal ligament. Pulpal pain alone is often poorly localised; proprioception appears once the ligament is involved</li>
<li><b>A-delta fibres</b>: fast, sharp, well-localised dentinal pain. <b>C fibres</b>: dull, aching, throbbing pain of pulpal inflammation</li>
<li>Trace a sinus tract with a <b>gutta-percha point</b> and take a radiograph to find the source</li>
<li>A <b>vital</b> tooth with a periapical radiolucency: think of a non-endodontic cause (periodontal, cemento-osseous dysplasia or another lesion). Do not start RCT on the radiograph alone</li>
</ul>
<div class="sum-algo"><span class="sum-algo-title">Diagnostic order</span><ol>
<li>Chief complaint and pain history; reproduce the complaint</li>
<li>Examine, probe, check mobility and restorations</li>
<li>Pulp tests, then percussion, palpation and bite tests</li>
<li>Radiographs; if the data are missing or conflict, the diagnosis is incomplete: do not treat irreversibly</li>
</ol></div>
<div class="sum-key"><span class="sum-key-title">نقاط امتحانية</span><ul>
<li>Pain that lingers or starts on its own points to irreversible pulpitis.</li>
<li>A sinus tract with a non-responsive tooth means necrosis with chronic apical abscess.</li>
<li>History alone never completes a diagnosis; testing and imaging are needed.</li>
<li>A sharp, quick pain is carried by A-delta fibres.</li>
</ul></div>
`,
            questions: [
                {
                    "q": "A tooth has spontaneous pain, lingering pain to cold testing, and periapical radiolucency. What is the diagnosis?",
                    "options": [
                        "Reversible pulpitis",
                        "Symptomatic irreversible pulpitis with apical periodontitis",
                        "Normal pulp",
                        "Necrotic pulp only"
                    ],
                    "answer": 1,
                    "explanation": "Spontaneous pain, lingering response to cold and a periapical radiolucency indicate symptomatic irreversible pulpitis with apical periodontitis. Reversible pulpitis does not give spontaneous pain and a normal or necrotic pulp would not linger to cold. Key takeaway: spontaneous and lingering pain means irreversible pulpitis.",
                    "source": "SDLE recall"
                },
                {
                    "q": "A nonresponsive tooth has little discomfort and an intermittently draining sinus tract traced to its apex. What is the diagnosis?",
                    "options": [
                        "Necrosis / acute apical abscess",
                        "Symptomatic irreversible / symptomatic AP",
                        "Necrosis / chronic apical abscess",
                        "Previously initiated / normal apical"
                    ],
                    "answer": 2,
                    "explanation": "A chronic apical abscess has gradual onset, little or no discomfort, and intermittent drainage through a sinus tract. The infected source tooth is typically necrotic. Reference: American Association of Endodontists. Consensus Conference Recommended Diagnostic Terminology. J Endod. 2009;35(12):1634.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A traumatized tooth has throbbing pain and percussion tenderness but no swelling. The pulp is reproducibly nonresponsive and a periapical radiolucency is present. Which diagnostic pair is most appropriate?",
                    "options": [
                        "Pulp necrosis with symptomatic apical periodontitis",
                        "Normal pulp with normal apical tissues",
                        "Reversible pulpitis with condensing osteitis",
                        "Previously treated with acute abscess"
                    ],
                    "answer": 0,
                    "explanation": "Corroborated loss of pulpal response after trauma with apical pain supports pulp necrosis and symptomatic apical periodontitis. The absence of swelling or pus argues against an acute apical abscess. Reference: American Association of Endodontists. Glossary of Endodontic Terms. 11th ed.; Berman LH, Hargreaves KM, eds. Cohen's Pathways of the Pulp. 12th ed. Diagnosis section.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A symptom-free tooth responds normally and briefly to cold. It is not tender to percussion or palpation, and the periodontal ligament space is uniform. What is the diagnosis?",
                    "options": [
                        "Reversible pulpitis / normal apical",
                        "Normal pulp / normal apical",
                        "Necrosis / asymptomatic AP",
                        "Previously treated / normal apical"
                    ],
                    "answer": 1,
                    "explanation": "A normal pulp is symptom-free and responds normally to sensibility testing. Normal apical tissues are not tender and show an intact lamina dura with a uniform ligament space. Reference: American Association of Endodontists. Consensus Conference Recommended Diagnostic Terminology. J Endod. 2009;35(12):1634; AAE. Endodontic Diagnosis. Colleagues for Excellence, 2013.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A patient reports spontaneous throbbing tooth pain, but no examination or imaging is available. What can be concluded?",
                    "options": [
                        "Pulp necrosis is certain",
                        "Diagnosis is incomplete",
                        "Abscess is certain",
                        "Root fracture is certain"
                    ],
                    "answer": 1,
                    "explanation": "Pain quality alone is not diagnostic. History, sensibility testing, percussion, palpation, probing, swelling assessment, and radiographs are required to establish pulpal and apical diagnoses. Reference: Berman LH, Hargreaves KM, eds. Cohen's Pathways of the Pulp. 12th ed. Endodontic diagnosis section.",
                    "source": "SDLE bank"
                }
            ],
        },
        {
            id: "en-trauma",
            title: "02 — Dental Trauma",
            title_en: "Fractures · luxation · avulsion · splint times",
            summaryHtml: `
<h4 class="deck-topic">Crown and root fractures (permanent teeth)</h4>
<ul>
<li><b>Uncomplicated crown fracture</b>: enamel with or without dentin, no pulp exposure. Seal exposed dentin and restore or bond the fragment</li>
<li><b>Complicated crown fracture</b>: pulp exposed. Keep the pulp vital when possible; <b>partial (Cvek) pulpotomy</b> or pulp capping, especially with an open apex</li>
<li><b>Horizontal root fracture</b>: reposition the coronal fragment if displaced and apply a passive flexible splint. A <b>cervical</b> fracture has the poorest outlook. Do not start RCT immediately; monitor the pulp</li>
<li><b>Crown-root fracture</b> that cannot be restored, with vertical extension and poor support: extraction</li>
</ul>
<h4 class="deck-topic">Splinting guide (IADT 2020)</h4>
<div class="deck-block deck-tbl"><table>
<thead><tr><th>Injury</th><th>Passive flexible splint</th></tr></thead>
<tbody>
<tr><td>Concussion</td><td>None needed</td></tr>
<tr><td>Subluxation</td><td>Only if very mobile or tender; up to 2 weeks</td></tr>
<tr><td>Extrusion</td><td>2 weeks</td></tr>
<tr><td>Lateral luxation</td><td>4 weeks</td></tr>
<tr><td>Avulsion (replanted)</td><td>About 2 weeks</td></tr>
<tr><td>Apical or middle third root fracture</td><td>4 weeks</td></tr>
<tr><td>Cervical third root fracture</td><td>Longer, up to 4 months</td></tr>
<tr><td>Alveolar fracture</td><td>4 weeks</td></tr>
</tbody></table></div>
<h4 class="deck-topic">Avulsed permanent tooth</h4>
<div class="sum-algo"><span class="sum-algo-title">Steps</span><ol>
<li>Best action at the scene: <b>replant immediately</b>, holding the tooth by the crown</li>
<li>If not possible, store in milk; alternatives are Hank balanced salt solution, saliva or saline. Avoid dry storage and water</li>
<li>In the clinic: gently rinse, replant, check position, splint, suture lacerations</li>
<li>Consider systemic antibiotic (amoxicillin or penicillin is first choice) and check tetanus status</li>
<li>Closed apex: start RCT within about 2 weeks. Open apex: monitor for revascularisation and treat if necrosis or infection appears</li>
</ol></div>
<ul>
<li>Extra-oral dry time above about 60 minutes makes ligament survival unlikely and ankylosis likely</li>
<li><b>Primary teeth are not replanted</b>. An intruded primary tooth is usually left to reposition spontaneously, with follow-up</li>
</ul>
<div class="sum-key"><span class="sum-key-title">نقاط امتحانية</span><ul>
<li>Pulp exposure is what makes a crown fracture "complicated".</li>
<li>Replanted avulsion: flexible splint for about 2 weeks.</li>
<li>Middle third root fracture: 4 weeks; cervical may need up to 4 months.</li>
<li>Never replant an avulsed primary tooth.</li>
</ul></div>
`,
            questions: [
                {
                    "q": "A crown fracture involving enamel, dentin, and pulp exposure is classified as:",
                    "options": [
                        "Uncomplicated crown fracture",
                        "Complicated crown fracture",
                        "Root fracture",
                        "Concussion"
                    ],
                    "answer": 1,
                    "explanation": "A crown fracture with enamel, dentin and pulp exposure is a complicated crown fracture. Uncomplicated means no pulp exposure, and root fracture and concussion are different injuries. Key takeaway: pulp exposure makes it complicated.",
                    "source": "SDLE recall"
                },
                {
                    "q": "A permanent incisor is avulsed at a sports field, and immediate replantation is feasible. What is the best action?",
                    "options": [
                        "Replant immediately",
                        "Keep it dry",
                        "Perform RCT first",
                        "Wait for radiographs"
                    ],
                    "answer": 0,
                    "explanation": "Immediate replantation provides the best chance of preserving viable periodontal ligament cells and is the preferred emergency action for an avulsed permanent tooth. Reference: Fouad AF, et al. IADT Guidelines: Avulsion of Permanent Teeth. Dent Traumatol. 2020;36:331-342.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A young patient presents after trauma to a maxillary central incisor. The coronal fragment is displaced palatally, and radiographic examination confirms a mid-root fracture. After gentle repositioning of the coronal fragment, what is the most appropriate immediate stabilization?",
                    "options": [
                        "No splinting",
                        "A rigid splint for 4 months",
                        "A flexible or semirigid splint for 4 weeks",
                        "Immediate root canal treatment of both fragments"
                    ],
                    "answer": 2,
                    "explanation": "An intra-alveolar mid-root fracture should be repositioned promptly when displaced and stabilized with a physiologic flexible/semirigid splint, generally for about 4 weeks. Endodontic treatment is not performed prophylactically; pulp status and healing are monitored, and only a necrotic coronal segment is treated if necrosis develops. Reference: Hargreaves KM, Cohen S, eds. Cohen’s Pathways of the Pulp. 10th ed. Chapter 17, “The Role of Endodontics After Dental Traumatic Injuries,” root-fracture treatment section, pp.621 onward Andreasen JO, Andreasen FM, Andersson L, eds. Textbook and Color Atlas of Traumatic Injuries to the Teeth. 5th ed. Chapter 15, “Root Fractures,” pp.377-412",
                    "source": "SDLE bank"
                },
                {
                    "q": "An avulsed permanent tooth is replanted after 45 minutes, and there is no alveolar fracture. How long should it be stabilized with a passive flexible splint?",
                    "options": [
                        "4 weeks",
                        "6 weeks",
                        "2 weeks",
                        "8 weeks"
                    ],
                    "answer": 2,
                    "explanation": "A replanted avulsed tooth is generally stabilized with a passive flexible splint for two weeks when no associated alveolar fracture requires longer stabilization. Reference: American Association of Endodontists. Recommended Guidelines for the Treatment of Traumatic Dental Injuries. 2026. Avulsion section.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A primary incisor is intruded toward the developing permanent tooth germ. What is the current recommended initial management?",
                    "options": [
                        "Immediate extraction",
                        "Surgical repositioning",
                        "Root canal treatment",
                        "Allow spontaneous repositioning"
                    ],
                    "answer": 3,
                    "explanation": "Current IADT guidance allows an intruded primary tooth to reposition spontaneously regardless of displacement direction. Improvement usually occurs within six months and may take up to one year; rapid referral to an experienced pediatric team is advised. Reference: Day PF, et al. IADT Guidelines for the Management of Traumatic Dental Injuries: 3. Injuries in the Primary Dentition. Dent Traumatol. 2020;36(4):343-359. doi:10.1111/edt.12576.",
                    "source": "SDLE bank"
                }
            ],
        },
        {
            id: "en-vpt",
            title: "03 — Vital Pulp Therapy and Immature Teeth",
            title_en: "Capping · pulpotomy · regeneration · apexification",
            summaryHtml: `
<h4 class="deck-topic">Keeping the pulp alive</h4>
<div class="deck-cards">
<div class="deck-card"><div class="deck-card-h">Direct pulp cap</div><p>A biocompatible material on a small exposure with healthy-looking pulp and controllable bleeding, followed by a well-sealed restoration.</p></div>
<div class="deck-card mgmt"><div class="deck-card-h">Partial (Cvek) pulpotomy</div><p>Remove a few millimetres of inflamed pulp under the exposure, obtain haemostasis, cover with MTA or another calcium silicate material, then seal. Classic for traumatic exposure in young teeth.</p></div>
<div class="deck-card clin"><div class="deck-card-h">Full pulpotomy</div><p>Remove the whole coronal pulp. If bleeding from the canal orifices cannot be controlled, the radicular pulp is inflamed and the plan must change.</p></div>
</div>
<ul>
<li>Bleeding on exposure guides the decision: no bleeding suggests necrosis; uncontrollable bleeding suggests deeper inflammation</li>
<li><b>MTA</b>: excellent seal and biocompatibility, sets in moisture. Drawbacks: <b>long setting time</b>, difficult handling, possible discolouration</li>
<li>Success depends heavily on the <b>coronal seal</b> and asepsis (rubber dam)</li>
</ul>
<h4 class="deck-topic">Immature permanent tooth</h4>
<div class="deck-block deck-tbl"><table>
<thead><tr><th>Pulp</th><th>Goal</th><th>Procedure</th></tr></thead>
<tbody>
<tr><td>Vital</td><td><b>Apexogenesis</b>: root continues to develop</td><td>Pulp cap or pulpotomy</td></tr>
<tr><td>Necrotic</td><td>Further root development and healing</td><td><b>Regenerative endodontics</b> in a restorable tooth with a suitable patient</td></tr>
<tr><td>Necrotic, regeneration not suitable</td><td><b>Apexification</b>: create an apical barrier</td><td>MTA apical plug, or long-term calcium hydroxide (older method)</td></tr>
</tbody></table></div>
<ul>
<li>Regeneration: minimal instrumentation, gentle disinfection, intracanal medicament, then at a later visit induce bleeding to form a clot scaffold and seal with a calcium silicate material</li>
<li>Thin dentinal walls: <b>minimise instrumentation</b> to avoid further weakening</li>
<li>Apexification closes the apex but does not thicken the walls, so the root stays fracture-prone</li>
<li>Primary tooth pulpectomy needs a <b>resorbable</b> filling, for example non-reinforced zinc oxide-eugenol or a suitable calcium hydroxide-iodoform paste</li>
</ul>
<div class="sum-key"><span class="sum-key-title">نقاط امتحانية</span><ul>
<li>Vital immature tooth: apexogenesis. Necrotic immature tooth: regeneration or apexification.</li>
<li>Uncontrolled bleeding after coronal pulp removal means the radicular pulp is inflamed.</li>
<li>The main practical weakness of conventional MTA is its long setting time.</li>
<li>Immature canals: disinfect more by irrigation, file as little as possible.</li>
</ul></div>
`,
            questions: [
                {
                    "q": "A 14-year-old presents one day after a complicated crown fracture with a small pulp exposure. The tooth is restorable, the pulp is vital, and bleeding is controllable. What is the preferred treatment?",
                    "options": [
                        "Root canal treatment",
                        "Direct pulp cap",
                        "Partial pulpotomy",
                        "Indirect pulp cap"
                    ],
                    "answer": 2,
                    "explanation": "A partial or Cvek pulpotomy removes superficially inflamed tissue and preserves healthy pulp after traumatic exposure. Reference: American Association of Endodontists. Recommended Guidelines for the Treatment of Traumatic Dental Injuries. 2026. Complicated crown-fracture section.",
                    "source": "SDLE bank"
                },
                {
                    "q": "After complete removal of coronal pulp tissue during pulpotomy, profuse bleeding from the canal orifices cannot be controlled with the planned hemostatic protocol. What does this most strongly suggest?",
                    "options": [
                        "Pulp necrosis",
                        "Normal pulp",
                        "Inflamed radicular pulp",
                        "Pulp calcification"
                    ],
                    "answer": 2,
                    "explanation": "Persistent uncontrolled bleeding after proper tissue removal and hemostatic measures suggests that inflammation extends into the remaining pulp. The clinician should reassess whether deeper pulpotomy or root canal treatment is indicated rather than placing a capping material over uncontrolled hemorrhage. Reference: American Association of Endodontists. Position Statement on Vital Pulp Therapy. 2021; American Academy of Pediatric Dentistry. Guideline for Use of Vital Pulp Therapy in Permanent Teeth. 2025.",
                    "source": "SDLE bank"
                },
                {
                    "q": "At follow-up, an immature permanent incisor has confirmed pulp necrosis, an open apex, and apical periodontitis. The tooth is restorable and suitable for biologically based treatment. What is preferred?",
                    "options": [
                        "Partial pulpotomy",
                        "Direct pulp cap",
                        "Conventional RCT",
                        "Regenerative endodontics"
                    ],
                    "answer": 3,
                    "explanation": "Regenerative endodontic treatment controls infection while offering the possibility of continued root maturation and dentinal-wall thickening. This addresses the structural weakness of a necrotic immature tooth. Reference: American Association of Endodontists. Regenerative Endodontics. ENDODONTICS: Colleagues for Excellence. Winter 2026.",
                    "source": "SDLE bank"
                },
                {
                    "q": "How should mechanical instrumentation be modified in an immature tooth with thin dentinal walls?",
                    "options": [
                        "Enlarge aggressively",
                        "Minimize instrumentation",
                        "Remove cervical dentin",
                        "Create a parallel canal"
                    ],
                    "answer": 1,
                    "explanation": "Aggressive shaping can weaken already thin root walls and damage apical tissues. Disinfection relies heavily on gentle irrigation and intracanal medication, especially in regenerative procedures. Reference: American Association of Endodontists. Clinical Considerations for a Regenerative Procedure; Berman LH, Hargreaves KM, eds. Cohen's Pathways of the Pulp. 12th ed. Immature-tooth management.",
                    "source": "SDLE bank"
                },
                {
                    "q": "Which disadvantage of conventional MTA most directly complicates same-visit restoration after direct pulp capping?",
                    "options": [
                        "High solubility after set",
                        "Long setting time",
                        "No calcium release",
                        "Lack of biocompatibility"
                    ],
                    "answer": 1,
                    "explanation": "Conventional MTA sets slowly, so the overlying restorative step must avoid disturbing the unset material. Newer hydraulic calcium silicate products may have shorter setting times. Reference: Hanna SN, et al. Direct Pulp Capping Procedures—Evidence and Practice. Jpn Dent Sci Rev. 2023;59:48-61. doi:10.1016/j.jdsr.2023.02.002; American Association of Endodontists. Position Statement on Vital Pulp Therapy. 2021.",
                    "source": "SDLE bank"
                }
            ],
        },
        {
            id: "en-anatomy",
            title: "04 — Canal Anatomy, Access and Isolation",
            title_en: "Canal numbers · access shape · rubber dam",
            summaryHtml: `
<h4 class="deck-topic">Usual canal patterns (variation is common)</h4>
<div class="deck-block deck-tbl"><table>
<thead><tr><th>Tooth</th><th>Usual pattern</th></tr></thead>
<tbody>
<tr><td>Maxillary central incisor and canine</td><td>Almost always one canal</td></tr>
<tr><td>Mandibular incisors</td><td>One, but a second is frequent; look <b>lingually</b></td></tr>
<tr><td>Maxillary first premolar</td><td>Usually two (buccal and palatal)</td></tr>
<tr><td>Mandibular first premolar</td><td>Most often one</td></tr>
<tr><td>Maxillary first molar</td><td>Three roots; a second mesiobuccal canal (<b>MB2</b>) is very common</td></tr>
<tr><td>Mandibular first molar</td><td>Usually three canals (two mesial, one distal), often four</td></tr>
</tbody></table></div>
<ul>
<li>A treated maxillary molar with persistent disease at the mesiobuccal root: suspect a <b>missed MB2</b></li>
<li>The <b>apical constriction</b> is the narrowest part of the canal and the usual end point of preparation. It is normally short of the radiographic apex</li>
</ul>
<h4 class="deck-topic">Access cavity</h4>
<ul>
<li>Aims: remove the whole roof, give straight-line access, keep as much tooth structure as possible</li>
<li>Outline follows the chamber: incisors triangular or oval, premolars oval buccolingually, maxillary molars triangular (rhomboidal when MB2 is sought), mandibular molars trapezoidal</li>
<li>Through ceramic: start with a <b>round diamond bur</b> and water coolant</li>
<li>Calcified orifices: magnification, good light, ultrasonic tips, dyes and the <b>champagne-bubble test</b> (NaOCl bubbles over remaining tissue). Use small stiff files such as C-files for tight canals</li>
<li>If the canal cannot be located safely, <b>refer before perforating</b></li>
</ul>
<h4 class="deck-topic">Rubber dam</h4>
<ul>
<li>It is the <b>standard of care</b> for all non-surgical root canal treatment: prevents aspiration and ingestion, controls contamination and protects soft tissue</li>
<li>Asthma is not a reason to omit it; adjust position and clamp technique and keep the airway comfortable</li>
<li>A patient who declines it needs an explanation; do not carry out root canal treatment without safe isolation</li>
</ul>
<h4 class="deck-topic">Case difficulty</h4>
<ul>
<li>Extra roots, severe curvature, canals not visible and limited access raise difficulty. A general dentist should refer when the case exceeds their skill or equipment</li>
</ul>
<div class="sum-key"><span class="sum-key-title">نقاط امتحانية</span><ul>
<li>MB2 is the classic missed canal.</li>
<li>Maxillary first premolar: two canals. Mandibular first premolar: usually one.</li>
<li>Asthma: use the dam for the whole procedure.</li>
<li>Extra root plus limited experience: refer.</li>
</ul></div>
`,
            questions: [
                {
                    "q": "A maxillary first molar was treated with obturation of three canals. A radiolucency persists adjacent to the mesiobuccal root. What is the most likely cause?",
                    "options": [
                        "Vertical root fracture",
                        "Missed MB2 canal",
                        "Root perforation",
                        "Overfilling"
                    ],
                    "answer": 1,
                    "explanation": "A persisting lesion next to the mesiobuccal root of a maxillary first molar treated with three canals is most often due to a missed second mesiobuccal canal (MB2). Vertical fracture, perforation and overfill are possible but less likely. Key takeaway: always look for MB2.",
                    "source": "SDLE recall"
                },
                {
                    "q": "How many canals does a mandibular first premolar most commonly have?",
                    "options": [
                        "Two",
                        "Three",
                        "One",
                        "Four"
                    ],
                    "answer": 2,
                    "explanation": "The mandibular first premolar most commonly has one canal, although a clinically important minority has two or more canals. Reference: Berman LH, Hargreaves KM, eds. Cohen’s Pathways of the Pulp. 12th ed. Mandibular first-premolar canal anatomy.",
                    "source": "SDLE bank"
                },
                {
                    "q": "Which chairside finding can help locate a calcified canal orifice after access preparation?",
                    "options": [
                        "Electric pulp test",
                        "Percussion test",
                        "Champagne-bubble test",
                        "Bitewing radiograph"
                    ],
                    "answer": 2,
                    "explanation": "Sodium hypochlorite may effervesce where it contacts residual organic tissue at a concealed canal orifice, helping guide conservative exploration under magnification. Reference: Berman LH, Hargreaves KM, eds. Cohen’s Pathways of the Pulp. 12th ed. Calcified canals and canal-orifice location.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A general dentist cannot safely locate a severely calcified canal and lacks magnification or guided-access capability. What is the best next step?",
                    "options": [
                        "Continue blind drilling",
                        "Refer before perforation",
                        "Enlarge the access widely",
                        "Extract without discussion"
                    ],
                    "answer": 1,
                    "explanation": "Continuing without reliable landmarks can cause excessive dentin removal, perforation, or loss of restorability. Timely referral is safer than proceeding beyond competence. Reference: American Association of Endodontists. Endodontic Competency: Executive Summary. 2019; American Association of Endodontists. Case Difficulty Assessment Form and Guidelines.",
                    "source": "SDLE bank"
                },
                {
                    "q": "What isolation method is required for root canal treatment of a maxillary anterior tooth in a patient with asthma?",
                    "options": [
                        "Dental dam throughout",
                        "Cotton rolls throughout",
                        "Cotton rolls until obturation",
                        "Dental dam only during access"
                    ],
                    "answer": 0,
                    "explanation": "Dental-dam isolation is the standard of care throughout nonsurgical endodontic treatment. A nonlatex dam may be selected when latex sensitivity is a concern. Reference: American Association of Endodontists. Position Statement: Dental Dams. 2024. American Association of Endodontists. Treatment Standards: Executive Summary. 2019.",
                    "source": "SDLE bank"
                }
            ],
        },
        {
            id: "en-instruments",
            title: "05 — Instruments and Canal Shaping",
            title_en: "ISO files · broach · NiTi · technique",
            summaryHtml: `
<h4 class="deck-topic">ISO hand file standards</h4>
<ul>
<li>The size number is the tip diameter in hundredths of a millimetre (size 25 = 0.25 mm)</li>
<li>Standard taper <b>0.02</b>: diameter grows 0.02 mm for every millimetre of working part</li>
<li>Working (cutting) part is at least <b>16 mm</b></li>
<li>Handle colours from size 15: <b>white, yellow, red, blue, green, black</b>, repeating at 45 to 80. So 30 and 60 are blue. Small sizes: 06 pink, 08 grey, 10 purple</li>
</ul>
<div class="deck-block deck-tbl"><table>
<thead><tr><th>Instrument</th><th>Use and features</th></tr></thead>
<tbody>
<tr><td><b>K-file</b></td><td>Twisted square or triangular blank; filing and watch-winding</td></tr>
<tr><td><b>K-reamer</b></td><td>Fewer flutes than a K-file; used in rotation; more flexible than a K-file of the same size</td></tr>
<tr><td><b>H-file (Hedstrom)</b></td><td>Ground from a round blank, tear-drop cross-section; cuts on the pull stroke; do not rotate forcefully (fractures)</td></tr>
<tr><td><b>Barbed broach</b></td><td>Removes soft tissue, cotton or paper; not for shaping dentin</td></tr>
<tr><td><b>Gates Glidden</b></td><td>Coronal flaring. Tip sizes 1 to 6: 0.5, 0.7, <b>0.9</b>, 1.1, 1.3, 1.5 mm</td></tr>
<tr><td><b>Spreader / plugger</b></td><td>Spreader: pointed, lateral compaction. Plugger: flat end, vertical compaction</td></tr>
</tbody></table></div>
<h4 class="deck-topic">Nickel-titanium</h4>
<ul>
<li>Main advantage: <b>low modulus of elasticity</b> (high flexibility), so it follows curves with less transportation</li>
<li>Can separate without visible warning: <b>cyclic fatigue</b> in curves, <b>torsional</b> failure when the tip binds. Excessive apical force greatly raises torsional risk</li>
<li>Prevent: make a glide path, use recommended speed and torque, light pressure, limit reuse</li>
</ul>
<div class="sum-algo"><span class="sum-algo-title">Shaping sequence</span><ol>
<li>Straight-line access and coronal pre-flare</li>
<li>Negotiate with a small file; set working length with an <b>apex locator</b> and confirm radiographically</li>
<li>Create a glide path</li>
<li>Prepare crown-down towards the apex, irrigating and recapitulating after each instrument</li>
</ol></div>
<ul>
<li>Preparing the coronal and middle thirds first reduces apical <b>blockage</b>, improves irrigant penetration and tactile control</li>
<li>Common errors in curved canals: ledge, zip, transportation, strip perforation. Pre-curve stainless steel files and never force them</li>
</ul>
<div class="sum-key"><span class="sum-key-title">نقاط امتحانية</span><ul>
<li>ISO hand file taper is 0.02.</li>
<li>Barbed broach removes soft contents.</li>
<li>Gates Glidden number 3 is 0.9 mm.</li>
<li>NiTi's key property is flexibility from a low elastic modulus.</li>
</ul></div>
`,
            questions: [
                {
                    "q": "What is the standardized taper of a conventional ISO hand K-file?",
                    "options": [
                        "0.2 mm increase in diameter per millimeter",
                        "2 mm increase in diameter per millimeter",
                        "0.04 mm increase in diameter per millimeter",
                        "0.02 mm increase in diameter per millimeter of cutting length"
                    ],
                    "answer": 3,
                    "explanation": "Conventional standardized ISO K-files have a 2% taper, meaning the instrument diameter increases by 0.02 mm for each millimeter from D0 along the cutting flutes. The ISO tip size is a separate value: for example, a size 25 file has a D0 diameter of 0.25 mm. Reference: Hargreaves KM, Cohen S, eds. Cohen’s Pathways of the Pulp. 10th ed. Chapter 8, “Instruments, Materials, and Devices,” pp.223- 282. Chandra BS, Gopikrishna V, eds. Grossman’s Endodontic Practice. 13th ed. Chapter 13, “Shaping and Cleaning of the Radicular Space: Instruments and Techniques,” pp.287-321.",
                    "source": "SDLE bank"
                },
                {
                    "q": "What is the ISO handle color of a size 60 H-file?",
                    "options": [
                        "Blue",
                        "Green",
                        "Black",
                        "Red"
                    ],
                    "answer": 0,
                    "explanation": "The ISO color sequence repeats after size 40; size 60 is coded blue. Reference: International Organization for Standardization. ISO 3630-1, Dentistry - Endodontic instruments. Berman LH, Hargreaves KM, eds. Cohen’s Pathways of the Pulp. 12th ed. ISO instrument color coding.",
                    "source": "SDLE bank"
                },
                {
                    "q": "What is the primary function of a barbed broach?",
                    "options": [
                        "Remove soft canal contents",
                        "Enlarge the coronal orifice",
                        "Carry sealer",
                        "Prepare post space"
                    ],
                    "answer": 0,
                    "explanation": "The projecting barbs engage soft pulp tissue or loose canal contents so they can be withdrawn from a sufficiently wide and straight canal. Reference: Berman LH, Hargreaves KM, eds. Cohen’s Pathways of the Pulp. 12th ed. Barbed broaches and endodontic instruments.",
                    "source": "SDLE bank"
                },
                {
                    "q": "Size of gates glidden 3?",
                    "options": [
                        "0.5",
                        "0.7",
                        "0.9 mm"
                    ],
                    "answer": 2,
                    "explanation": "Gates Glidden drills increase in size: No. 1 is 0.5 mm, No. 2 is 0.7 mm and No. 3 is 0.9 mm. Key takeaway: size 3 equals 0.9 mm.",
                    "source": "SDLE recall"
                },
                {
                    "q": "Which operator action most increases torsional file-separation risk?",
                    "options": [
                        "Excessive apical force",
                        "Frequent flute cleaning",
                        "Copious irrigation",
                        "Gentle pecking motion"
                    ],
                    "answer": 0,
                    "explanation": "Excessive apical force promotes tip locking while the shaft continues to rotate, increasing torsional loading. Light controlled strokes and withdrawal for cleaning reduce binding. Reference: American Association of Endodontists. Separation Anxiety? Eleven Tips for Working with NiTi Files. 2020.",
                    "source": "SDLE bank"
                }
            ],
        },
        {
            id: "en-irrigation",
            title: "06 — Irrigation and Intracanal Medicaments",
            title_en: "NaOCl · EDTA · chlorhexidine · calcium hydroxide",
            summaryHtml: `
<div class="deck-block deck-tbl"><table>
<thead><tr><th>Agent</th><th>Key points</th></tr></thead>
<tbody>
<tr><td><b>Sodium hypochlorite</b></td><td>Main irrigant: antimicrobial and <b>dissolves organic tissue</b>. Strongly alkaline (about pH 11 to 12). Toxic beyond the apex</td></tr>
<tr><td><b>EDTA 17%</b></td><td>Chelator: removes the <b>inorganic</b> part of the smear layer</td></tr>
<tr><td><b>Chlorhexidine</b></td><td>Antimicrobial with substantivity; <b>no tissue-dissolving</b> action. Mixing with NaOCl makes a brown precipitate</td></tr>
</tbody></table></div>
<h4 class="deck-topic">Smear layer</h4>
<ul>
<li>Organic and inorganic debris, which may contain bacteria, left on instrumented walls</li>
<li>Removing it opens <b>dentinal tubules</b> so that irrigants, medicaments and sealer can penetrate and adapt better</li>
<li>Use NaOCl during shaping and EDTA to finish, <b>sequentially</b>, usually with a final rinse to suit the protocol</li>
</ul>
<h4 class="deck-topic">Sodium hypochlorite accident</h4>
<ul>
<li>Typical cause: the needle is <b>wedged</b> in the canal and solution is forced through the apex; wide apices and perforations add risk</li>
<li>Signs: sudden severe pain, rapid swelling, bruising, profuse bleeding through the canal</li>
<li>Prevent: <b>loose side-vented needle</b> short of working length, gentle finger pressure, constant movement. With an open apex, apical negative-pressure irrigation lowers apical pressure further</li>
</ul>
<div class="sum-algo"><span class="sum-algo-title">If it happens</span><ol>
<li>Stop, inform the patient, let the canal drain and dilute gently with saline</li>
<li>Control pain (local anaesthetic, analgesics); cold compresses early</li>
<li>Monitor closely; consider antibiotics when infection risk is present</li>
<li>Refer urgently if the airway, eye or a spreading swelling is involved</li>
</ol></div>
<h4 class="deck-topic">Medicaments and persistent bacteria</h4>
<ul>
<li><b>Calcium hydroxide</b>: the usual interappointment dressing; high pH, antimicrobial, needs contact time of days to weeks (protocols vary)</li>
<li><b>Ledermix</b>: corticosteroid plus tetracycline antibiotic (triamcinolone with demeclocycline)</li>
<li><i><b>Enterococcus faecalis</b></i> is classically linked with persistent infection in failed treatment; it tolerates a high pH</li>
<li>Systemic antibiotics are an <b>adjunct</b> for spread or systemic signs (fever, lymphadenopathy, cellulitis); they never replace debridement or drainage</li>
</ul>
<div class="sum-key"><span class="sum-key-title">نقاط امتحانية</span><ul>
<li>NaOCl dissolves tissue; chlorhexidine does not.</li>
<li>EDTA targets the inorganic smear layer.</li>
<li>A wedged needle is the classic cause of a hypochlorite accident.</li>
<li>Retreatment organism asked most: E. faecalis.</li>
</ul></div>
`,
            questions: [
                {
                    "q": "Which gel may be used as an intracanal antimicrobial adjunct but lacks tissue-dissolving activity?",
                    "options": [
                        "EDTA gel",
                        "Chlorhexidine gel",
                        "Petroleum jelly",
                        "Phosphoric acid gel"
                    ],
                    "answer": 1,
                    "explanation": "Chlorhexidine gel can provide antimicrobial activity and substantivity as an intracanal adjunct. It does not dissolve necrotic tissue and therefore cannot replace sodium hypochlorite-based cleaning. Reference: Berman LH, Hargreaves KM, eds. Cohen’s Pathways of the Pulp. 12th ed. Intracanal-disinfection section.",
                    "source": "SDLE bank"
                },
                {
                    "q": "How should sodium hypochlorite and EDTA be incorporated into an irrigation protocol?",
                    "options": [
                        "Alternated in one syringe",
                        "Premixed",
                        "Simultaneously",
                        "Sequentially"
                    ],
                    "answer": 3,
                    "explanation": "EDTA rapidly reduces free available chlorine and diminishes sodium hypochlorite’s tissue-dissolving capacity. They should be used as separate sequential irrigants rather than stored or delivered as a mixture. Reference: Berman LH, Hargreaves KM, eds. Cohen’s Pathways of the Pulp. 12th ed. Irrigant chemistry and sequencing section.",
                    "source": "SDLE bank"
                },
                {
                    "q": "Which irrigation setup is safest for a tooth with a wide open apex?",
                    "options": [
                        "Binding open-ended needle",
                        "Wedged needle at the apex",
                        "Loose side-vented needle",
                        "High-pressure apical injection"
                    ],
                    "answer": 2,
                    "explanation": "A loose side-vented or closed-ended needle placed short of working length reduces apical pressure and directs irrigant laterally. Irrigation must remain gentle because an open apex offers little resistance to extrusion. Reference: American Association of Endodontists. Clinical Considerations for a Regenerative Procedure. Irrigation protocol; Berman LH, Hargreaves KM, eds. Cohen's Pathways of the Pulp. 12th ed. Irrigation safety section.",
                    "source": "SDLE bank"
                },
                {
                    "q": "Which intracanal medicament combines a corticosteroid with a tetracycline antibiotic?",
                    "options": [
                        "Chlorhexidine gel",
                        "Calcium hydroxide",
                        "Ledermix",
                        "Iodoform paste"
                    ],
                    "answer": 2,
                    "explanation": "Ledermix combines triamcinolone with demeclocycline for short-term anti-inflammatory and antimicrobial effects. It is an adjunct for selected cases, not a replacement for adequate debridement and disinfection. Reference: Chandra BS, Gopikrishna V, eds. Grossman’s Endodontic Practice. 13th ed. Chapter 14, corticosteroid-antibiotic medicaments, pp.324-341.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A necrotic four-rooted mandibular molar is associated with diffuse swelling, fever, and lymphadenopathy. What is the appropriate management?",
                    "options": [
                        "Local treatment plus antibiotics",
                        "Antibiotics only",
                        "Observation",
                        "Pulpotomy"
                    ],
                    "answer": 0,
                    "explanation": "Systemic involvement requires operative control of the endodontic source together with systemic antimicrobial therapy. Drainage, debridement, and urgent escalation are selected according to the severity and spread of infection. Reference: American Dental Association. Evidence-Based Clinical Practice Guideline on Antibiotic Use for Urgent Management of Pulpal- and Periapical-Related Dental Pain and Intraoral Swelling. 2019.",
                    "source": "SDLE bank"
                }
            ],
        },
        {
            id: "en-obturation",
            title: "07 — Obturation, Restoration and Follow-up",
            title_en: "Compaction methods · seal · retreatment · surgery",
            summaryHtml: `
<h4 class="deck-topic">When to obturate</h4>
<ul>
<li>The canal is shaped and disinfected, can be dried, and the tooth has no uncontrolled exudate or swelling</li>
<li>Goal: a dense, well-adapted fill to the working length with a sealer, then a sound <b>coronal seal</b></li>
</ul>
<h4 class="deck-topic">Techniques</h4>
<div class="deck-cards">
<div class="deck-card"><div class="deck-card-h">Cold lateral compaction</div><p>Master cone, then a <b>finger spreader</b> placed beside it to about 1 mm short of working length, followed by accessory cones. Good length control.</p></div>
<div class="deck-card clin"><div class="deck-card-h">Warm vertical compaction</div><p>Softened gutta-percha adapts well to irregularities, such as an <b>internal resorption</b> cavity.</p></div>
<div class="deck-card mgmt"><div class="deck-card-h">Choosing</div><p>No single method suits every canal. The technique depends on anatomy, apex size and operator control.</p></div>
</div>
<ul>
<li><b>Extrusion</b> of gutta-percha is mainly due to <b>loss of apical control</b>: wrong length, over-instrumentation, no apical stop or excessive force</li>
<li>Pre-fabricated post: insert slowly with a vented path so cement can escape and <b>hydraulic pressure</b> stays low</li>
<li>Restore early. Posterior treated teeth usually need cuspal coverage; a post is for core retention and does not strengthen the root</li>
</ul>
<h4 class="deck-topic">Reviewing the result</h4>
<ul>
<li>Healing is judged by symptoms, clinical signs and radiographs over time; large lesions may take years</li>
<li>No symptoms, good seal, lesion shrinking or stable at an early review: <b>continue follow-up</b></li>
<li>An extruded material or fragment that is stable and causes no symptoms: monitor</li>
</ul>
<div class="sum-algo"><span class="sum-algo-title">Persistent or recurrent disease</span><ol>
<li>Is the tooth restorable and without a root fracture? If not, extraction</li>
<li>Poor fill, missed canal or coronal leakage: <b>non-surgical retreatment</b> and a new seal</li>
<li>Orthograde access impractical or already optimal: <b>apical microsurgery</b></li>
</ol></div>
<div class="sum-key"><span class="sum-key-title">نقاط امتحانية</span><ul>
<li>Internal resorption: warm vertical compaction.</li>
<li>Lateral compaction uses a spreader; vertical uses a plugger.</li>
<li>Leakage plus new lesion: retreat and reseal.</li>
<li>Retreatment not practical in a restorable tooth: apical microsurgery.</li>
</ul></div>
`,
            questions: [
                {
                    "q": "Before lateral compaction, which instrument is prefitted to confirm that the prepared canal has sufficient flare to penetrate alongside the master cone to approximately 1-2 mm from working length?",
                    "options": [
                        "Master apical file",
                        "Patency file",
                        "Finger spreader",
                        "Master gutta-percha cone"
                    ],
                    "answer": 2,
                    "explanation": "In lateral compaction, a spreader is prefitted so it can penetrate beside the seated master cone to within about 1-2 mm of working length. This confirms adequate space for controlled lateral compaction and accessory-cone placement. The source wording “check canal flaring after preparation” is made specific to this obturation context. Reference: Hargreaves KM, Cohen S, eds. Cohen’s Pathways of the Pulp. 10th ed. Chapter 10, root-canal obturation and lateral compaction, pp.349 onward. Chandra BS, Gopikrishna V, eds. Grossman’s Endodontic Practice. 13th ed. Chapter on obturation of the radicular space; exact pages require verification.",
                    "source": "SDLE bank"
                },
                {
                    "q": "Which technique best adapts gutta-percha to an irregular internal-resorption cavity after adequate debridement?",
                    "options": [
                        "Warm vertical compaction",
                        "Single rigid cone",
                        "Silver-point filling",
                        "Paste-only filling"
                    ],
                    "answer": 0,
                    "explanation": "Thermoplasticized gutta-percha can flow into irregularities that a cold single cone may not fill predictably. Apical control and avoidance of extrusion remain essential. Reference: Berman LH, Hargreaves KM, eds. Cohen's Pathways of the Pulp. 12th ed. Sections on internal resorption and thermoplasticized obturation.",
                    "source": "SDLE bank"
                },
                {
                    "q": "What is the principal procedural cause of gutta-percha extrusion beyond the apical foramen?",
                    "options": [
                        "Short root length",
                        "Obturation technique alone",
                        "Loss of apical control",
                        "Long root length"
                    ],
                    "answer": 2,
                    "explanation": "An absent or disrupted apical constriction, over-instrumentation, or inadequate length and material control allows gutta-percha to extend beyond the canal terminus. Reference: Berman LH, Hargreaves KM, eds. Cohen’s Pathways of the Pulp. 12th ed. Obturation length and apical control.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A previously treated tooth has recurrent caries, a leaking crown margin, and a new apical lesion. What is the appropriate plan?",
                    "options": [
                        "Crown replacement",
                        "Retreatment and resealing",
                        "Antibiotic therapy",
                        "Periodic review"
                    ],
                    "answer": 1,
                    "explanation": "Coronal leakage can recontaminate the root-canal system and contribute to secondary apical disease. Both the endodontic infection and the defective restoration must be addressed. Reference: American Association of Endodontists. Endodontic Retreatment Explained. Causes of post-treatment disease section.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A restorable tooth has persistent symptomatic apical disease after technically adequate retreatment. Further orthograde access is impractical. What is the preferred tooth-preserving option?",
                    "options": [
                        "Antibiotics alone",
                        "Periodontal scaling",
                        "Apical microsurgery",
                        "Internal bleaching"
                    ],
                    "answer": 2,
                    "explanation": "Apical microsurgery may be considered when persistent apical disease cannot be predictably corrected nonsurgically. It permits removal of diseased apical tissue, root-end resection, and retrograde sealing while retaining a restorable tooth. Reference: Duncan HF, et al. Int Endod J. 2023;56(Suppl 3). doi:10.1111/iej.13974; Kang M, et al. Outcome of Nonsurgical Retreatment and Endodontic Microsurgery: A Meta-Analysis. Clin Oral Investig. 2015;19(3):569-582. doi:10.1007/s00784-015-1398-3.",
                    "source": "SDLE bank"
                }
            ],
        },
        {
            id: "en-accidents",
            title: "08 — Procedural Accidents and Professional Duties",
            title_en: "Separated file · perforation · referral",
            summaryHtml: `
<h4 class="deck-topic">Separated instrument</h4>
<div class="sum-algo"><span class="sum-algo-title">First steps</span><ol>
<li><b>Tell the patient</b> what happened and the options, and document it</li>
<li>Take radiographs to locate the fragment</li>
<li>Decide: bypass, remove, fill to the fragment, refer, surgery or monitor</li>
<li>Arrange follow-up</li>
</ol></div>
<ul>
<li>Prognosis depends mainly on <b>when</b> it broke (how well the canal was already disinfected) and whether a <b>periapical lesion</b> exists. Position and access decide whether it can be removed</li>
<li>A fragment in a well-disinfected canal of an asymptomatic tooth can often be monitored</li>
<li>A fragment blocking access to an infected apex: referral to an endodontist</li>
<li>If key facts are unknown, the prognosis is <b>indeterminate</b>; do not guess</li>
<li>A fragment beyond the apex near the inferior alveolar canal: 3D imaging and specialist referral</li>
</ul>
<h4 class="deck-topic">Perforation</h4>
<ul>
<li>Warning signs: sudden bleeding, pain despite anaesthesia, an unexpected apex-locator reading, a file leaving the canal path</li>
<li>Repair as soon as possible with a calcium silicate material such as <b>MTA</b></li>
</ul>
<div class="deck-block deck-tbl"><table>
<thead><tr><th>Factor</th><th>Better</th><th>Worse</th></tr></thead>
<tbody>
<tr><td>Time</td><td>Immediate repair</td><td>Long delay, contamination</td></tr>
<tr><td>Size</td><td>Small</td><td>Large</td></tr>
<tr><td>Site</td><td>Away from the crestal bone and sulcus</td><td>Crestal, communicating with the pocket</td></tr>
</tbody></table></div>
<h4 class="deck-topic">Professional conduct</h4>
<ul>
<li>Work within your competence. If you cannot finish safely, stabilise the tooth, control symptoms and <b>refer</b> (urgently when needed)</li>
<li>Consent covers risks, alternatives (including extraction) and cost</li>
<li>Several problems at once: sequence by <b>urgency and risk</b>. Spreading infection with fever, dysphagia or airway concern needs immediate hospital care</li>
</ul>
<div class="sum-key"><span class="sum-key-title">نقاط امتحانية</span><ul>
<li>After any accident: disclose, document, then manage.</li>
<li>A large, old crestal perforation with a deep defect has an unfavourable prognosis.</li>
<li>Missing information gives an indeterminate prognosis.</li>
<li>MTA is the usual perforation repair material.</li>
</ul></div>
`,
            questions: [
                {
                    "q": "What is the immediate professional duty after an instrument is displaced beyond the apex?",
                    "options": [
                        "Conceal the event",
                        "Inform and document",
                        "Alter the radiograph",
                        "Dismiss the patient"
                    ],
                    "answer": 1,
                    "explanation": "The event, implications, alternatives, proposed management, and referral need should be disclosed and documented. Concealment violates patient autonomy and veracity. Reference: American Dental Association. Principles of Ethics and Code of Professional Conduct. Patient autonomy and veracity sections; American Association of Endodontists. Informed Consent Guidelines.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A separated instrument blocks access to an infected apical segment, and the tooth has persistent apical periodontitis. What is the appropriate initial plan?",
                    "options": [
                        "Crown fabrication",
                        "Routine recall",
                        "Extraction",
                        "Specialist retreatment"
                    ],
                    "answer": 3,
                    "explanation": "The disease and inaccessible infected segment justify active treatment. A specialist should assess retrieval, bypass, or alternative disinfection before surgical or extraction options are selected. Reference: American Association of Endodontists. Treatment Standards White Paper. Retreatment complexity and specialist-referral section.",
                    "source": "SDLE bank"
                },
                {
                    "q": "Which material is commonly used to repair a subcrestal root perforation?",
                    "options": [
                        "Zinc phosphate",
                        "MTA",
                        "Composite resin",
                        "Amalgam"
                    ],
                    "answer": 1,
                    "explanation": "MTA is a biocompatible sealing material used to repair perforations, even where moisture or blood is present. Zinc phosphate, composite and amalgam seal poorly there. Key takeaway: MTA for perforations.",
                    "source": "SDLE recall"
                },
                {
                    "q": "A large crestal perforation was left open for several weeks and now has a deep probing defect with bone loss. What is the prognosis?",
                    "options": [
                        "Unfavorable",
                        "Excellent",
                        "Favorable",
                        "Unaffected"
                    ],
                    "answer": 0,
                    "explanation": "Large size, delayed repair, contamination, crestal location, and periodontal breakdown combine to reduce the probability of healing. Restorability and surgical access must be evaluated before attempting repair. Reference: American Association of Endodontists. Treatment Options for the Compromised Tooth. Perforation prognosis table; Berman LH, Hargreaves KM, eds. Cohen's Pathways of the Pulp. 12th ed.",
                    "source": "SDLE bank"
                },
                {
                    "q": "An extruded file fragment lies close to the inferior alveolar canal. What is the best next step?",
                    "options": [
                        "Blind ultrasonic retrieval",
                        "Push it farther apically",
                        "CBCT and specialist referral",
                        "Immediate obturation only"
                    ],
                    "answer": 2,
                    "explanation": "Three-dimensional imaging establishes the fragment’s relationship to the neurovascular canal and guides risk assessment. Retrieval near critical anatomy should be planned by an experienced endodontic or surgical team rather than attempted blindly. Reference: American Association of Endodontists. JOE Review: Early 2026. Section on migration of separated instruments beyond the root canal system; European Society of Endodontology. S3-Level Clinical Practice Guideline. 2023.",
                    "source": "SDLE bank"
                }
            ],
        },
        {
            id: "en-resorption",
            title: "09 — Resorption, Root Fracture and Endo-Perio Lesions",
            title_en: "Internal vs external · VRF · lesion origin",
            summaryHtml: `
<h4 class="deck-topic">Resorption</h4>
<div class="deck-block deck-tbl"><table>
<thead><tr><th>Type</th><th>Clues</th><th>Management</th></tr></thead>
<tbody>
<tr><td><b>Internal</b></td><td>Smooth, symmetrical widening of the canal; stays centred when the X-ray angle changes; may give a pink tooth</td><td>Root canal treatment promptly</td></tr>
<tr><td><b>External cervical</b></td><td>Irregular cervical lesion that <b>shifts</b> with angle; canal outline still traceable. Linked to trauma, orthodontics and non-vital bleaching</td><td>Assess with CBCT; repair, monitor or extract by extent</td></tr>
<tr><td><b>External inflammatory</b></td><td>Rapid bowl-shaped root and bone loss after trauma with infected pulp</td><td><b>Disinfect the canal</b> urgently</td></tr>
<tr><td><b>Replacement (ankylosis)</b></td><td>Root replaced by bone, lost ligament space, metallic percussion note, no mobility</td><td>Monitor; plan for infraocclusion in growing patients</td></tr>
</tbody></table></div>
<h4 class="deck-topic">Cracks and vertical root fracture (VRF)</h4>
<ul>
<li><b>Craze line</b>: enamel only; transmitted light passes through. A <b>crack</b> into dentin blocks the light</li>
<li>VRF clues: root-filled tooth, often with a post; isolated narrow deep pocket; sinus tract near the gingival margin; <b>J-shaped or halo</b> radiolucency</li>
<li>CBCT often shows the <b>pattern of bone loss</b> more reliably than the fine fracture line, especially beside root filling materials. Confirmation may need direct visualisation</li>
<li>A confirmed VRF in a single-rooted tooth has a hopeless prognosis: extract</li>
</ul>
<h4 class="deck-topic">Endo-perio lesions (classic classification)</h4>
<ul>
<li><b>Primary endodontic</b>: non-vital pulp; narrow tract through the ligament; heals with RCT</li>
<li><b>Primary periodontal</b>: usually vital pulp; broad pockets, calculus, generalised bone loss</li>
<li><b>Primary periodontal, secondary endodontic</b>: long periodontitis reaches the apex or accessory canals and the pulp dies later</li>
<li><b>True combined</b>: two independent lesions that join. Usual order: <b>endodontic first</b>, then periodontal</li>
<li>A <b>palatogingival groove</b> on a maxillary lateral incisor can cause a deep isolated defect with a vital pulp</li>
<li>The 2017 periodontal classification now groups endo-periodontal lesions by root damage and periodontitis status</li>
</ul>
<div class="sum-key"><span class="sum-key-title">نقاط امتحانية</span><ul>
<li>A lesion that stays centred is internal; one that moves is external.</li>
<li>Non-vital bleaching risks external cervical resorption.</li>
<li>Isolated narrow pocket with J-shaped bone loss suggests VRF.</li>
<li>Combined lesion: pulp testing guides origin; treat the canal first.</li>
</ul></div>
`,
            questions: [
                {
                    "q": "Angled periapical radiographs show a smooth balloon-like enlargement that remains centered on the root canal. What is the most likely diagnosis?",
                    "options": [
                        "External cervical resorption",
                        "Replacement resorption",
                        "Surface resorption",
                        "Internal resorption"
                    ],
                    "answer": 3,
                    "explanation": "Internal resorption is continuous with and centered on the canal, so the lesion remains aligned with the canal on angled views. External lesions shift relative to the canal. Reference: American Association of Endodontists. Differentiating Resorption. 2020; Berman LH, Hargreaves KM, eds. Cohen's Pathways of the Pulp. 12th ed.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A pink cervical lesion shifts relative to the canal on angled radiographs, and the canal outline remains traceable through it. What is the more likely diagnosis?",
                    "options": [
                        "External cervical resorption",
                        "Internal resorption",
                        "Pulp canal obliteration",
                        "Apical scar"
                    ],
                    "answer": 0,
                    "explanation": "An external lesion moves relative to the canal with tube shift, while the canal outline may remain visible through the defect. Clinical probing and selected CBCT can define the external extent. Reference: American Association of Endodontists. Differentiating Resorption. 2020; Patel S, et al. European Society of Endodontology Position Statement: External Cervical Resorption. Int Endod J. 2018;51:1323-1326.",
                    "source": "SDLE bank"
                },
                {
                    "q": "Four months after replantation, a tooth shows rapidly enlarging scooped-out radiolucencies on the external root surface. What is the most likely diagnosis?",
                    "options": [
                        "External inflammatory resorption",
                        "Internal resorption",
                        "Replacement resorption",
                        "Pulp canal obliteration"
                    ],
                    "answer": 0,
                    "explanation": "Moderate-to-large scooped-out external defects after severe trauma are characteristic of external inflammatory root resorption. The process is driven by periodontal injury plus infected necrotic pulp. Reference: Berman LH, Hargreaves KM, eds. Cohen's Pathways of the Pulp. 12th ed. Trauma-related root resorption section; American Association of Endodontists. Differentiating Resorption. 2020.",
                    "source": "SDLE bank"
                },
                {
                    "q": "What is the difference between Craze and Crack line?",
                    "options": [
                        "No difference.",
                        "Crack block the light transmission.",
                        "Craze block light."
                    ],
                    "answer": 1,
                    "explanation": "A crack blocks light transmission, whereas a craze line (enamel only) allows light to pass. Key takeaway: crack blocks light, craze does not.",
                    "source": "SDLE recall"
                },
                {
                    "q": "A vital maxillary lateral incisor has an isolated deep palatal pocket and a radiolucent defect extending apically along the root. What is the most likely local factor?",
                    "options": [
                        "Palatogingival groove",
                        "Root fracture",
                        "Pulp necrosis",
                        "Mental foramen"
                    ],
                    "answer": 0,
                    "explanation": "A palatogingival groove can create a plaque-retentive pathway from the palatal surface along the root of a maxillary lateral incisor. The resulting localized periodontal destruction may extend apically while the pulp remains responsive until secondary pulpal involvement occurs. Reference: American Association of Endodontists. Endodontic Periodontic Lesions. 2024; Berman LH, Hargreaves KM, eds. Cohen's Pathways of the Pulp. 12th ed. Endodontic-periodontal interrelationships.",
                    "source": "SDLE bank"
                }
            ],
        },
    ],
};

export default dentalEndodontics;
