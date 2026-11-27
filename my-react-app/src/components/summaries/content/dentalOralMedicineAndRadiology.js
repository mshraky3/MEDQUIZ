// Oral Medicine and Radiology — dental-track section of the summaries catalog.
// Mirrored for the slide viewer in backend/content/summaryHtml (keep the two in sync).
// Inline questions are copied from the SQB bank.
const dentalOralMedicineAndRadiology = {
    id: "oral-medicine-and-radiology",
    title: "Oral Medicine and Radiology",
    title_en: "SDLE Review — 9 Topics",
    icon: "shield-check",
    accent: "#f472b6",
    intro: "Oral medicine, pathology and radiology revision for SDLE: Ulcers and Blistering Diseases · White, Red and Pigmented Lesions · Oral Infections · Salivary Glands and Soft-Tissue Swellings · TMD and Orofacial Pain · Systemic Disease in the Mouth · Developmental Tooth Anomalies · Jaw Lesions · Dental Radiography.",
    subtopics: [
        {
            id: "om-ulcers",
            title: "01 — Ulcers and Blistering Diseases",
            title_en: "Pemphigus · pemphigoid · lichen planus · EM · aphthae",
            summaryHtml: `
<div class="deck-block deck-tbl"><table>
<thead><tr><th>Disease</th><th>Clinical clues</th><th>Tissue findings</th></tr></thead>
<tbody>
<tr><td><b>Pemphigus vulgaris</b></td><td>Fragile bullae, widespread painful erosions, often starts in the mouth; <b>positive Nikolsky</b></td><td>Antibodies to desmoglein; <b>suprabasal acantholysis</b>; DIF intercellular "fishnet"</td></tr>
<tr><td><b>Mucous membrane pemphigoid</b></td><td>Desquamative gingivitis; eye scarring risk</td><td><b>Subepithelial</b> split; linear deposits at the basement membrane</td></tr>
<tr><td><b>Lichen planus</b></td><td>Often <b>bilateral</b> buccal white striae; erosive or atrophic forms; desquamative gingivitis</td><td>Band-like lymphocytes, basal cell damage</td></tr>
<tr><td><b>Erythema multiforme</b></td><td>Abrupt onset, <b>target lesions</b>, crusted bleeding lips; often follows HSV or a drug</td><td>Clinical diagnosis, biopsy supports</td></tr>
<tr><td><b>Recurrent aphthae</b></td><td>Round ulcers with red halo on <b>non-keratinised</b> mucosa</td><td>Look for deficiency or systemic disease if severe</td></tr>
</tbody></table></div>
<ul>
<li>For suspected autoimmune blistering disease take a <b>perilesional</b> biopsy for direct immunofluorescence, plus a specimen in formalin for histology</li>
<li>Refer for eye assessment in suspected pemphigoid; pemphigus needs specialist systemic therapy</li>
</ul>
<h4 class="deck-topic">Aphthous types and care</h4>
<ul>
<li><b>Minor</b>: under 10 mm, heals in about 1 to 2 weeks without scar. <b>Major</b>: larger, deeper, slow, may scar. <b>Herpetiform</b>: many tiny ulcers (not caused by herpes)</li>
<li>Topical corticosteroid first; severe major ulcers may need systemic therapy after assessment. Stopping smoking can be followed by aphthae</li>
<li>Oral plus genital ulcers with eye or skin disease suggests <b>Behçet disease</b>; a pathergy test supports it</li>
<li>Crohn disease: cobblestone mucosa, linear ulcers, lip swelling, non-caseating granulomas; pyostomatitis vegetans occurs with inflammatory bowel disease</li>
</ul>
<h4 class="deck-topic">Other causes</h4>
<ul>
<li>Trauma or chemical burn (lozenges, aspirin): strong caustics cause coagulative necrosis with a white slough</li>
<li>Sudden blood blister that bursts, with normal blood tests: <b>angina bullosa haemorrhagica</b></li>
<li>A single ulcer that persists beyond about 2 weeks after removing causes: <b>biopsy</b></li>
</ul>
<div class="sum-key"><span class="sum-key-title">نقاط امتحانية</span><ul>
<li>Suprabasal acantholysis: pemphigus. Subepithelial split: pemphigoid.</li>
<li>Target lesions point to erythema multiforme.</li>
<li>Aphthae favour movable, non-keratinised mucosa.</li>
<li>Immunofluorescence needs a perilesional sample.</li>
</ul></div>
`,
            questions: [
                {
                    "q": "Fragile oral bullae rupture into widespread erosions, and gentle pressure produces epithelial separation. Which disease is most likely?",
                    "options": [
                        "Mucocele",
                        "Actinic cheilitis",
                        "Pemphigus vulgaris",
                        "Fordyce granules"
                    ],
                    "answer": 2,
                    "explanation": "Intraepithelial acantholysis produces fragile bullae and a positive Nikolsky sign. Perilesional direct immunofluorescence shows intercellular IgG deposition. Reference: Glick M, ed. Burket's Oral Medicine. 13th ed. Pemphigus vulgaris.",
                    "source": "SDLE bank"
                },
                {
                    "q": "Suprabasal acantholysis within the prickle-cell layer is characteristic of which disease?",
                    "options": [
                        "Mucous membrane pemphigoid",
                        "Erythema multiforme",
                        "Pemphigus vulgaris",
                        "Epidermolysis bullosa"
                    ],
                    "answer": 2,
                    "explanation": "Pemphigus vulgaris shows suprabasal epithelial separation with loss of keratinocyte adhesion and acantholytic cells. Direct immunofluorescence demonstrates intercellular IgG and C3 in a net-like pattern. Reference: Neville BW et al. Oral and Maxillofacial Pathology. 5th ed. Pemphigus vulgaris.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A patient develops abrupt target-like skin lesions, hemorrhagic lip crusting, and widespread painful oral erosions. What is the most likely diagnosis?",
                    "options": [
                        "Pemphigus vulgaris",
                        "Erythema multiforme",
                        "White sponge nevus",
                        "Geographic tongue"
                    ],
                    "answer": 1,
                    "explanation": "The acute onset of target lesions with severe oral ulceration and crusted lips is characteristic of erythema multiforme, often triggered by herpes simplex infection or medication. Reference: Neville BW et al. Oral and Maxillofacial Pathology. 5th ed. Erythema multiforme.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A patient has recurrent round painful ulcers on nonkeratinized labial mucosa without preceding vesicles or systemic disease. What is the most likely diagnosis?",
                    "options": [
                        "Recurrent aphthous stomatitis",
                        "Recurrent intraoral herpes",
                        "Necrotizing gingivitis",
                        "Erythroplakia"
                    ],
                    "answer": 0,
                    "explanation": "Recurrent aphthae typically affect nonkeratinized movable mucosa and begin as ulcers rather than grouped vesicles. Recurrent disease may warrant assessment for hematinic, gastrointestinal, immune, or medication-related associations. Reference: Glick M, ed. Burket's Oral Medicine. 13th ed. Recurrent aphthous stomatitis; Neville BW, et al. Oral and Maxillofacial Pathology. 4th ed.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A patient has recurrent painful erosions and desquamative gingivitis with ocular symptoms. What investigation is most important for suspected autoimmune vesiculobullous disease?",
                    "options": [
                        "Pulp sensibility testing only",
                        "Salivary pH alone",
                        "Perilesional biopsy for direct immunofluorescence",
                        "Tooth-shade analysis"
                    ],
                    "answer": 2,
                    "explanation": "Direct immunofluorescence on perilesional tissue is central to distinguishing pemphigoid, pemphigus, and related immune-mediated disease. Ocular involvement requires prompt specialist assessment. Reference: Glick M, ed. Burket's Oral Medicine. 13th ed. Vesiculobullous disease; Neville BW, et al. Oral and Maxillofacial Pathology. 4th ed.",
                    "source": "SDLE bank"
                }
            ],
        },
        {
            id: "om-white",
            title: "02 — White, Red and Pigmented Lesions",
            title_en: "Leukoplakia · biopsy · benign mimics",
            summaryHtml: `
<h4 class="deck-topic">Does it wipe off, and is there a cause?</h4>
<div class="deck-block deck-tbl"><table>
<thead><tr><th>Lesion</th><th>Clue</th><th>Action</th></tr></thead>
<tbody>
<tr><td><b>Leukoplakia</b></td><td>White patch, does not wipe off, no other diagnosis (a clinical term)</td><td>Remove risk factors; biopsy</td></tr>
<tr><td><b>Erythroplakia</b></td><td>Velvety red patch; high risk of dysplasia or carcinoma</td><td>Biopsy</td></tr>
<tr><td><b>Leukoedema</b></td><td>Diffuse grey-white, <b>fades on stretching</b></td><td>Reassure</td></tr>
<tr><td><b>Morsicatio</b></td><td>Shredded surface along the bite line</td><td>Habit control</td></tr>
<tr><td><b>Geographic tongue</b></td><td>Migrating red areas with white wavy border</td><td>Reassure; treat symptoms. It does not explain dysphagia</td></tr>
<tr><td><b>Pseudomembranous candidiasis</b></td><td>Plaques that <b>wipe off</b></td><td>Antifungal, correct cause</td></tr>
<tr><td><b>Hairy leukoplakia</b></td><td>Lateral tongue, does not wipe off; Epstein-Barr virus, immunosuppression</td><td>Check immune status; often no local treatment</td></tr>
</tbody></table></div>
<h4 class="deck-topic">Warning signs of malignancy</h4>
<ul>
<li>Induration, fixation, non-healing ulcer, mixed red and white surface, bleeding, unexplained numbness, firm fixed lymph node</li>
<li>High-risk sites: <b>lateral and ventral tongue, floor of mouth</b></li>
<li>Main factors: tobacco, alcohol, areca nut; high-risk <b>HPV is linked to oropharyngeal</b> carcinoma; sun for the lip (actinic cheilitis)</li>
<li>Exfoliative cytology only samples surface cells; it <b>does not replace biopsy</b></li>
</ul>
<h4 class="deck-topic">Biopsy</h4>
<ul>
<li>Small benign-looking lesion: excisional. Large or suspicious: incisional from a representative area, then refer</li>
<li>Put tissue in formalin; transport in a <b>sealed leakproof container inside a biohazard bag</b> with the request form</li>
</ul>
<h4 class="deck-topic">Pigmentation</h4>
<ul>
<li><b>Physiological</b>: symmetric and stable</li>
<li><b>Amalgam tattoo</b>: blue-black macule near a restoration; radiopaque fragments may show</li>
<li>A new or unexplained solitary dark spot, especially on the palate, needs biopsy to exclude melanoma</li>
<li>Diffuse pigmentation with weakness and low blood pressure: think of Addison disease</li>
<li>Heavy metals can give a gingival pigment line</li>
</ul>
<div class="sum-key"><span class="sum-key-title">نقاط امتحانية</span><ul>
<li>A persistent unexplained white or red lesion is biopsied.</li>
<li>Disappears when stretched: leukoedema.</li>
<li>Smoker with indurated lesion: diagnostic biopsy, no trial and wait.</li>
<li>Symmetric stable pigment is usually physiological.</li>
</ul></div>
`,
            questions: [
                {
                    "q": "An irregular shredded white patch lies along the bite line and the patient admits cheek biting. What is the diagnosis?",
                    "options": [
                        "Morsicatio buccarum",
                        "White sponge nevus",
                        "Leukoplakia",
                        "Lichen sclerosus"
                    ],
                    "answer": 0,
                    "explanation": "Chronic chewing produces a ragged, macerated surface at accessible occlusal areas. Removal of the habit should lead to improvement. Reference: Neville BW, Damm DD, Allen CM, Chi AC. Oral and Maxillofacial Pathology. 5th ed. Frictional and factitial keratoses.",
                    "source": "SDLE bank"
                },
                {
                    "q": "An asymptomatic diffuse gray-white buccal mucosal change disappears when the cheek is stretched. What is the diagnosis?",
                    "options": [
                        "Leukoedema",
                        "Leukoplakia",
                        "Oral candidiasis",
                        "Lichen planus"
                    ],
                    "answer": 0,
                    "explanation": "Leukoedema is a benign normal variation that typically affects the buccal mucosa bilaterally and diminishes or disappears on stretching. Leukoplakia and keratotic disease do not show this behavior. Reference: Neville BW et al. Oral and Maxillofacial Pathology. 5th ed. Leukoedema.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A smoker has a persistent homogeneous white plaque that cannot be wiped off and has no identifiable local cause. What is the clinical diagnosis?",
                    "options": [
                        "Candidiasis",
                        "Leukoplakia",
                        "Herpes",
                        "Mucocele"
                    ],
                    "answer": 1,
                    "explanation": "Leukoplakia is a clinical exclusion diagnosis. Risk-factor control and biopsy are based on site, size, texture, erythema, persistence, and patient risk. Reference: Neville BW, Damm DD, Allen CM, Chi AC. Oral and Maxillofacial Pathology. 5th ed. Leukoplakia and epithelial dysplasia.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A 55-year-old has a persistent, unexplained nonwipeable white plaque on the lateral tongue. What is appropriate management?",
                    "options": [
                        "Observation without documentation",
                        "Antifungal therapy indefinitely",
                        "Diagnostic biopsy",
                        "Laser destruction without histology"
                    ],
                    "answer": 2,
                    "explanation": "A persistent unexplained lateral-tongue leukoplakia requires biopsy because clinical appearance cannot reliably exclude dysplasia or carcinoma. Reference: American Dental Association. Evaluation of Potentially Malignant Oral Disorders; WHO Classification of Head and Neck Tumours. 5th ed.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A blue-black gingival macule lies beside an old amalgam restoration and radiography shows fine metallic fragments. What is the diagnosis?",
                    "options": [
                        "Melanoma",
                        "Amalgam tattoo",
                        "Kaposi sarcoma",
                        "Hemangioma"
                    ],
                    "answer": 1,
                    "explanation": "Exogenous metal can produce a localized blue-gray macule and radiopaque particles. Biopsy is needed when the history or appearance is not diagnostic. Reference: Neville BW, Damm DD, Allen CM, Chi AC. Oral and Maxillofacial Pathology. 5th ed. Exogenous pigmentation.",
                    "source": "SDLE bank"
                }
            ],
        },
        {
            id: "om-infection",
            title: "03 — Oral and Dentally Relevant Infections",
            title_en: "Herpes viruses · candida · TB · hepatitis B",
            summaryHtml: `
<h4 class="deck-topic">Viruses</h4>
<ul>
<li><b>Primary herpetic gingivostomatitis</b>: child with fever, nodes, vesicles and ulcers plus acute gingivitis. Supportive care; antiviral works best early</li>
<li><b>Recurrent HSV</b>: grouped vesicles on the lip or on <b>keratinised</b> mucosa (hard palate, attached gingiva)</li>
<li><b>Varicella-zoster</b>: unilateral, dermatomal pain and vesicles; pain may come first</li>
<li><b>Ramsay Hunt syndrome</b>: zoster with <b>facial palsy</b> and ear or mouth vesicles, often with hearing or balance symptoms. Bell palsy has no rash. Treat promptly</li>
<li><b>Herpangina</b>: coxsackievirus; ulcers on soft palate and fauces</li>
<li><b>HHV-8</b>: Kaposi sarcoma</li>
</ul>
<h4 class="deck-topic">Candidiasis</h4>
<ul>
<li>Risks: inhaled or topical <b>corticosteroids</b>, antibiotics, dentures, dry mouth, diabetes, immune suppression</li>
<li>Forms: pseudomembranous, erythematous, denture stomatitis, angular cheilitis</li>
<li>Mild: topical (nystatin, clotrimazole, miconazole). Moderate to severe in HIV: <b>systemic fluconazole</b></li>
<li>Azoles, including miconazole gel, can strongly interact with <b>warfarin</b></li>
<li>After inhaled steroid, rinse the mouth</li>
<li>Uncontrolled diabetes with black palatal necrosis: <b>invasive fungal infection (mucormycosis)</b>, an emergency</li>
</ul>
<h4 class="deck-topic">Tuberculosis</h4>
<ul>
<li>Suspected or active disease: <b>defer elective care</b> and refer. Urgent care needs airborne precautions (fitted respirator, isolation room); a surgical mask is not enough</li>
<li><b>Scrofula</b>: tuberculous cervical lymphadenitis; unpasteurised milk is linked with <i>M. bovis</i></li>
</ul>
<h4 class="deck-topic">Hepatitis B</h4>
<div class="deck-block deck-tbl"><table>
<thead><tr><th>Marker</th><th>Meaning</th></tr></thead>
<tbody>
<tr><td>HBsAg + IgM anti-HBc</td><td>Acute infection</td></tr>
<tr><td>HBsAg + HBeAg</td><td>Active replication, high infectivity</td></tr>
<tr><td>Anti-HBs alone</td><td>Immunity from vaccination</td></tr>
<tr><td>Anti-HBs + anti-HBc</td><td>Immunity after past infection</td></tr>
</tbody></table></div>
<ul>
<li>Spread by blood and body fluids, such as <b>needlestick</b>. The virus stays infectious on surfaces for at least <b>7 days</b></li>
</ul>
<div class="sum-key"><span class="sum-key-title">نقاط امتحانية</span><ul>
<li>Ear rash plus facial palsy: varicella-zoster.</li>
<li>Removable white plaques in a steroid user: candidiasis.</li>
<li>Active TB: postpone elective dentistry.</li>
<li>HBeAg means high infectivity.</li>
</ul></div>
`,
            questions: [
                {
                    "q": "A child has fever, lymphadenopathy, diffuse painful oral vesicles and ulcers, and generalized acute gingivitis. What is the most likely diagnosis?",
                    "options": [
                        "Recurrent aphthous stomatitis",
                        "Local traumatic ulcer",
                        "Primary herpetic gingivostomatitis",
                        "Chronic periodontitis"
                    ],
                    "answer": 2,
                    "explanation": "Primary HSV infection may cause systemic symptoms, generalized gingivitis, and widespread vesiculoulcerative lesions on keratinized and nonkeratinized mucosa. Hydration, pain control, timing, and medical risk guide management. Reference: Glick M, ed. Burket's Oral Medicine. 13th ed. Primary herpes simplex infection; Neville BW, et al. Oral and Maxillofacial Pathology. 4th ed.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A patient has unilateral facial paralysis with a painful vesicular rash around the ear. Which virus is responsible?",
                    "options": [
                        "Epstein-Barr virus",
                        "Varicella-zoster virus",
                        "Cytomegalovirus",
                        "Human papillomavirus"
                    ],
                    "answer": 1,
                    "explanation": "Varicella-zoster reactivation in the geniculate ganglion can produce Ramsay Hunt syndrome with peripheral facial palsy and auricular vesicles. Reference: Centers for Disease Control and Prevention. Clinical Overview of Shingles; Burket's Oral Medicine. 13th ed.",
                    "source": "SDLE bank"
                },
                {
                    "q": "An asthma patient using an inhaled corticosteroid develops burning palatal erythema and removable white plaques. What is the diagnosis?",
                    "options": [
                        "Lichen planus",
                        "Oral candidiasis",
                        "Nicotine stomatitis",
                        "Pemphigus vulgaris"
                    ],
                    "answer": 1,
                    "explanation": "Inhaled corticosteroids predispose to oropharyngeal candidiasis, especially without rinsing or a spacer. Treat candidiasis and improve inhaler technique without stopping controller therapy arbitrarily. Reference: Global Initiative for Asthma. GINA 2026; Glick M, ed. Burket's Oral Medicine. 13th ed.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A patient is positive for both HBsAg and HBeAg. What does this pattern indicate?",
                    "options": [
                        "Vaccine-induced immunity",
                        "Resolved infection only",
                        "Current infection with high replication and infectivity",
                        "No prior HBV exposure"
                    ],
                    "answer": 2,
                    "explanation": "HBsAg indicates current HBV infection, and HBeAg correlates with active viral replication and higher infectivity. Quantitative HBV DNA is the more direct contemporary measure of viral load. Reference: Centers for Disease Control and Prevention. Clinical Testing and Diagnosis for Hepatitis B. 2025; CDC Pink Book: Hepatitis B. 2024.",
                    "source": "SDLE bank"
                },
                {
                    "q": "An adult with HIV has moderate white oral plaques that wipe away, leaving erythematous mucosa. What is the preferred systemic treatment?",
                    "options": [
                        "Oral fluconazole",
                        "Oral acyclovir",
                        "Topical steroid",
                        "Oral amoxicillin"
                    ],
                    "answer": 0,
                    "explanation": "The wipeable plaques are consistent with pseudomembranous candidiasis. Oral fluconazole is the preferred systemic treatment for oropharyngeal candidiasis in adults with HIV; topical agents are reasonable alternatives for mild localized disease. Reference: NIH Clinicalinfo. Guidelines for the Prevention and Treatment of Opportunistic Infections in Adults and Adolescents With HIV: Candidiasis. Reviewed 2026.",
                    "source": "SDLE bank"
                }
            ],
        },
        {
            id: "om-salivary",
            title: "04 — Salivary Glands and Soft-Tissue Swellings",
            title_en: "Sjögren · cysts · tumours · reactive growths",
            summaryHtml: `
<h4 class="deck-topic">Sjögren disease</h4>
<ul>
<li>Autoimmune: dry eyes and dry mouth; may accompany rheumatoid arthritis or lupus</li>
<li>Tests: anti-Ro/SSA antibody, <b>Schirmer</b> (5 mm or less in 5 minutes is abnormal), salivary flow, ocular staining, ultrasound; minor gland biopsy shows <b>focal lymphocytic sialadenitis</b></li>
<li>Oral effects: <b>rapid cervical, root and coronal caries</b>, candidiasis</li>
<li>Serious complication: <b>lymphoma</b></li>
</ul>
<h4 class="deck-topic">Other gland conditions</h4>
<ul>
<li><b>Mucocele</b>: soft bluish fluctuant swelling, usually lower lip, after trauma</li>
<li><b>Ranula</b>: mucocele of the floor of mouth</li>
<li><b>Sialadenosis</b>: painless bilateral parotid enlargement with <b>acinar hypertrophy</b>; diabetes, alcohol, eating disorders</li>
<li>Sialolith: mealtime swelling and pain, most often submandibular</li>
</ul>
<div class="deck-block deck-tbl"><table>
<thead><tr><th>Tumour</th><th>Clues</th></tr></thead>
<tbody>
<tr><td><b>Pleomorphic adenoma</b></td><td>Commonest; slow, painless, firm; parotid or palate</td></tr>
<tr><td><b>Warthin tumour</b></td><td>Parotid tail, <b>smokers</b>, may be bilateral, papillary cystic with lymphoid stroma</td></tr>
<tr><td><b>Mucoepidermoid carcinoma</b></td><td>Commonest malignant salivary tumour</td></tr>
<tr><td><b>Adenoid cystic carcinoma</b></td><td>Pain and <b>perineural spread</b>; cribriform pattern</td></tr>
</tbody></table></div>
<p>A firm palatal mass needs imaging as indicated and <b>tissue diagnosis</b>.</p>
<h4 class="deck-topic">Reactive and vascular lesions</h4>
<ul>
<li><b>Pyogenic granuloma</b>: red, bleeds easily, granulation tissue rich in capillaries; common in pregnancy, where observation is reasonable if symptoms are minor</li>
<li><b>Peripheral giant cell granuloma</b>: gingiva or alveolar ridge, bluish-red; giant cells and haemosiderin</li>
<li><b>Venous malformation</b>: soft, blue, <b>blanches</b> on pressure</li>
<li><b>Papilloma</b>: cauliflower-like surface</li>
<li><b>Angioedema</b>: sudden non-pitting lip or face swelling (allergy, <b>ACE inhibitors</b>); airway first</li>
</ul>
<h4 class="deck-topic">Neck nodes</h4>
<ul>
<li>A persistent, firm, fixed or supraclavicular node without an oral cause needs <b>urgent medical evaluation</b></li>
</ul>
<div class="sum-key"><span class="sum-key-title">نقاط امتحانية</span><ul>
<li>Sjögren: watch for caries and lymphoma.</li>
<li>Male smoker with bilateral parotid tail masses: Warthin.</li>
<li>Blue lower-lip swelling after trauma: mucocele.</li>
<li>Blanching blue lesion is vascular.</li>
</ul></div>
`,
            questions: [
                {
                    "q": "Which oral complication is strongly associated with Sjogren syndrome?",
                    "options": [
                        "Rapid coronal and root caries from hyposalivation",
                        "Protection from dental caries",
                        "Increased salivary buffering",
                        "Permanent absence of oral infection"
                    ],
                    "answer": 0,
                    "explanation": "Autoimmune salivary-gland dysfunction causes marked hyposalivation, raising the risk of cervical and root caries, candidiasis, mucosal discomfort, and difficulty chewing and swallowing. A universal independent increase in periodontitis is less certain. Reference: Glick M, ed. Burket's Oral Medicine. 13th ed. Sjogren syndrome; Sjogren's Foundation oral-care guidance.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A smoker has painless bilateral parotid-tail masses and imaging shows papillary cystic lesions. What tumor is most likely?",
                    "options": [
                        "Mucocele",
                        "Ranula",
                        "Fibroma",
                        "Warthin tumor"
                    ],
                    "answer": 3,
                    "explanation": "Warthin tumor is strongly associated with smoking and can be bilateral or multifocal in the parotid. Tissue diagnosis is required. Reference: Neville BW, Damm DD, Allen CM, Chi AC. Oral and Maxillofacial Pathology. 5th ed. Warthin tumor.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A fluctuant blue translucent swelling occurs on the lower lip after trauma. What is the most likely diagnosis?",
                    "options": [
                        "Pleomorphic adenoma",
                        "Mucocele",
                        "Fibroma",
                        "Lipoma"
                    ],
                    "answer": 1,
                    "explanation": "Mucus extravasation after minor salivary duct trauma commonly produces a bluish fluctuant lower-lip lesion. It contains spilled mucin surrounded by granulation tissue. Reference: Neville BW, Damm DD, Allen CM, Chi AC. Oral and Maxillofacial Pathology. 5th ed. Mucocele.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A floor-of-mouth bluish fluctuant lesion raises the tongue. What is the most likely diagnosis?",
                    "options": [
                        "Ranula",
                        "Lower-lip mucocele",
                        "Torus mandibularis",
                        "Geographic tongue"
                    ],
                    "answer": 0,
                    "explanation": "A ranula is a mucus extravasation or retention lesion arising from the sublingual gland. A plunging ranula extends through or around the mylohyoid into the neck. Reference: Neville BW, Damm DD, Allen CM, Chi AC. Oral and Maxillofacial Pathology. 5th ed. Ranula.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A long-standing soft bluish lip lesion blanches with pressure. What is the most likely lesion type?",
                    "options": [
                        "Amalgam tattoo",
                        "Melanoma",
                        "Fibroma",
                        "Venous malformation"
                    ],
                    "answer": 3,
                    "explanation": "Compressibility and blanching support a vascular lesion. Doppler imaging may be used before intervention; biopsy without vascular assessment can cause severe bleeding. Reference: Neville BW, Damm DD, Allen CM, Chi AC. Oral and Maxillofacial Pathology. 5th ed. Vascular malformations.",
                    "source": "SDLE bank"
                }
            ],
        },
        {
            id: "om-tmd",
            title: "05 — TMD and Orofacial Pain",
            title_en: "Disc displacement · myalgia · neuralgia · headache",
            summaryHtml: `
<h4 class="deck-topic">Temporomandibular disorders</h4>
<div class="deck-block deck-tbl"><table>
<thead><tr><th>Condition</th><th>Findings</th></tr></thead>
<tbody>
<tr><td><b>Disc displacement with reduction</b></td><td>Click on opening and closing (reciprocal); usually full range; opening path may deviate and return</td></tr>
<tr><td><b>Without reduction, limited opening</b></td><td>Previous click <b>stops</b>, closed lock, <b>deflection to the affected side</b></td></tr>
<tr><td><b>Myofascial pain / myalgia</b></td><td>Familiar pain on muscle palpation; may refer; joint sounds absent</td></tr>
<tr><td><b>Arthritis</b></td><td>Pain, crepitus, imaging changes</td></tr>
</tbody></table></div>
<ul>
<li>First-line care is conservative and <b>reversible</b>: education, soft diet, self-care, jaw exercises, physiotherapy, short analgesics, stabilisation appliance when indicated</li>
<li>Do not start irreversible occlusal changes. One click does not give a surgical stage</li>
<li>The <b>lateral pterygoid</b> inserts into the condylar neck (pterygoid fovea), with fibres to the disc and capsule; it helps open and protrude</li>
</ul>
<h4 class="deck-topic">Pain patterns</h4>
<div class="deck-block deck-tbl"><table>
<thead><tr><th>Disorder</th><th>Pattern</th><th>Note</th></tr></thead>
<tbody>
<tr><td><b>Trigeminal neuralgia</b></td><td>Electric shocks lasting seconds (up to about 2 minutes), set off by light touch, one side</td><td>Carbamazepine first line; young or bilateral cases: consider multiple sclerosis</td></tr>
<tr><td><b>Cluster headache</b></td><td>Severe one-sided orbital pain, 15 to 180 minutes, often at night, with tearing and congestion</td><td><b>100% oxygen</b> or sumatriptan</td></tr>
<tr><td><b>Migraine</b></td><td>Throbbing for hours, nausea, light sensitivity</td><td>May mimic toothache</td></tr>
<tr><td><b>Giant cell arteritis</b></td><td>Age over 50, new headache, jaw claudication, visual symptoms</td><td>Emergency: risk of blindness</td></tr>
<tr><td><b>Burning mouth syndrome</b></td><td>Burning with normal-looking mucosa</td><td>Diagnosis after excluding other causes</td></tr>
</tbody></table></div>
<ul>
<li><b>Fibromyalgia</b> is diagnosed on clinical criteria after considering other causes</li>
<li>Chewing difficulty with weight loss and neurological signs needs a search for systemic or neuromuscular disease</li>
</ul>
<div class="sum-key"><span class="sum-key-title">نقاط امتحانية</span><ul>
<li>Reciprocal click with normal range: displacement with reduction.</li>
<li>Click lost plus limited opening: without reduction.</li>
<li>Oxygen relief is characteristic of cluster headache.</li>
<li>Start TMD care with reversible measures.</li>
</ul></div>
`,
            questions: [
                {
                    "q": "A painless reciprocal click occurs during both opening and closing, with normal range of motion. What is the most likely diagnosis?",
                    "options": [
                        "Disc displacement without reduction",
                        "Disc displacement with reduction",
                        "TMJ ankylosis",
                        "Myositis"
                    ],
                    "answer": 1,
                    "explanation": "Reciprocal clicking reflects reduction of an anteriorly displaced disc during opening and redisplacement during closing. Symptoms and dysfunction, not sound alone, determine treatment need. Reference: Okeson JP. Management of Temporomandibular Disorders and Occlusion. 8th ed. Disc displacement with reduction.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A patient had clicking that stopped abruptly when mouth opening became limited to 25 mm with deviation to the affected side. What is the likely diagnosis?",
                    "options": [
                        "Subluxation",
                        "Bilateral condylar hypermobility",
                        "Disc displacement without reduction with limited opening",
                        "Trigeminal neuralgia"
                    ],
                    "answer": 2,
                    "explanation": "A closed lock follows failure of the disc to reduce. Contralateral excursion is restricted and the jaw deviates toward the affected joint. Reference: Okeson JP. Management of Temporomandibular Disorders and Occlusion. 8th ed. Closed lock.",
                    "source": "SDLE bank"
                },
                {
                    "q": "Myofascial pain is reproduced by palpation of the masseter and temporalis, with no joint noise or locking. What is the initial treatment?",
                    "options": [
                        "TMJ surgery",
                        "Education, self-care, soft diet, exercises, and reversible therapy",
                        "Irreversible full-mouth adjustment",
                        "Antibiotics"
                    ],
                    "answer": 1,
                    "explanation": "Most muscular TMD is treated conservatively with behavior modification, physiotherapy, sleep and habit assessment, analgesia when safe, and sometimes a stabilizing appliance. Reference: Okeson JP. Management of Temporomandibular Disorders and Occlusion. 8th ed. Masticatory muscle disorders.",
                    "source": "SDLE bank"
                },
                {
                    "q": "Severe unilateral retro-orbital pain lasts 45 minutes, occurs nightly in clusters, and is accompanied by tearing and nasal congestion. What is the diagnosis?",
                    "options": [
                        "Migraine without aura",
                        "Cluster headache",
                        "Trigeminal neuralgia",
                        "Tension-type headache"
                    ],
                    "answer": 1,
                    "explanation": "Short, excruciating unilateral orbital attacks with ipsilateral autonomic signs and circadian clustering are characteristic. Reference: International Headache Society. International Classification of Headache Disorders, 3rd ed. Cluster headache.",
                    "source": "SDLE bank"
                },
                {
                    "q": "Which muscle has fibers that attach to the articular disc and capsule of the temporomandibular joint?",
                    "options": [
                        "Medial pterygoid",
                        "Lateral pterygoid",
                        "Masseter",
                        "Mylohyoid"
                    ],
                    "answer": 1,
                    "explanation": "The superior head of the lateral pterygoid inserts partly into the anterior articular disc and capsule, while other fibers attach to the condylar neck. The medial pterygoid does not insert into the TMJ capsule. Reference: Standring S, ed. Gray's Anatomy. 43rd ed. Temporomandibular joint and muscles of mastication.",
                    "source": "SDLE bank"
                }
            ],
        },
        {
            id: "om-systemic",
            title: "06 — Systemic Disease and Oral Signs",
            title_en: "Deficiencies · lupus · uraemia · cancer therapy",
            summaryHtml: `
<h4 class="deck-topic">Nutrition and blood</h4>
<ul>
<li><b>Smooth, atrophic, sore tongue</b>: check <b>complete blood count, ferritin, vitamin B12 and folate</b></li>
<li><b>Scurvy</b> (vitamin C): swollen bleeding gingiva, poor healing, easy bruising</li>
<li>Persistent bleeding, ulcers, infections or unexplained gingival swelling: test blood to exclude leukaemia or a platelet or clotting disorder</li>
</ul>
<h4 class="deck-topic">Autoimmune and kidney disease</h4>
<ul>
<li><b>Lupus</b>: malar butterfly rash, oral ulcers or lichenoid patches. ANA is a sensitive screening test; <b>anti-dsDNA and anti-Smith</b> are specific</li>
<li><b>Uraemia</b>: salivary urea breaks down to <b>ammonia</b>, giving odour, altered taste and uraemic stomatitis</li>
<li><b>Diabetes</b>: periodontitis, candida, dry mouth, slow healing</li>
<li><b>Eating disorders or reflux</b>: erosion, especially palatal surfaces; parotid enlargement</li>
</ul>
<h4 class="deck-topic">Cancer therapy and antiresorptives</h4>
<ul>
<li>Chemotherapy commonly causes <b>mucositis</b>, infection and bleeding risk</li>
<li>Before intensive chemotherapy: remove clear sources of infection early, <b>coordinate with oncology</b> and allow healing time</li>
<li>During therapy, check current blood counts and the oncology plan before procedures; with normal counts, routine non-invasive care can proceed carefully</li>
<li>Head and neck radiotherapy: dry mouth, radiation caries, trismus, <b>osteoradionecrosis</b> risk; give fluoride and treat teeth beforehand</li>
<li><b>MRONJ</b>: current or past antiresorptive or antiangiogenic drug, exposed bone (or bone probed through a fistula) for <b>more than 8 weeks</b>, no radiotherapy to the jaws or jaw metastasis</li>
<li>A suspicious lesion after cancer treatment needs prompt evaluation</li>
</ul>
<div class="sum-algo"><span class="sum-algo-title">Unexplained oral sign</span><ol>
<li>Full history, drugs and general symptoms</li>
<li>Look for local causes</li>
<li>Order or request targeted tests, biopsy if indicated</li>
<li>Refer with findings</li>
</ol></div>
<div class="sum-key"><span class="sum-key-title">نقاط امتحانية</span><ul>
<li>Smooth tongue: haematinic tests.</li>
<li>Anti-dsDNA and anti-Smith confirm the lupus direction.</li>
<li>Uraemic breath and mucosa come from ammonia.</li>
<li>Hopeless infected tooth before chemotherapy: extract early with the oncologist.</li>
</ul></div>
`,
            questions: [
                {
                    "q": "A patient has a smooth painful tongue with loss of filiform papillae. What is the appropriate initial evaluation?",
                    "options": [
                        "Exfoliative cytology alone",
                        "Immediate tongue resection",
                        "No medical history",
                        "CBC, ferritin, vitamin B12, and folate assessment"
                    ],
                    "answer": 3,
                    "explanation": "Atrophic glossitis may reflect iron, B12, or folate deficiency, candidiasis, xerostomia, systemic disease, or local irritation. History, examination, and targeted laboratory testing precede biopsy unless a focal suspicious lesion exists. Reference: Glick M, ed. Burket's Oral Medicine. 13th ed. Atrophic glossitis.",
                    "source": "SDLE bank"
                },
                {
                    "q": "Which autoantibodies are highly specific for systemic lupus erythematosus?",
                    "options": [
                        "Rheumatoid factor alone",
                        "Anti-dsDNA and anti-Smith",
                        "Anti-mitochondrial antibody",
                        "Anti-centromere antibody only"
                    ],
                    "answer": 1,
                    "explanation": "Anti-double-stranded DNA and anti-Smith antibodies are highly specific for SLE. Diagnosis integrates clinical criteria, ANA, complement, blood counts, urinalysis, and organ assessment. Reference: American College of Rheumatology; EULAR/ACR SLE classification guidance.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A patient with severe untreated uremia develops ammonia odor and white-yellow oral pseudomembranes. What causes this finding?",
                    "options": [
                        "Candida invasion in every case",
                        "Deposition of bilirubin",
                        "Conversion of salivary urea to ammonia",
                        "A lichenoid drug reaction"
                    ],
                    "answer": 2,
                    "explanation": "High salivary urea can be hydrolyzed by bacterial urease to ammonia, producing chemical mucosal injury and the ammonia odor associated with uremic stomatitis. Infection and other white lesions still require clinical exclusion. Reference: Glick M, ed. Burket's Oral Medicine. 13th ed. Renal disease and uremic stomatitis.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A patient will begin intensive chemotherapy in two weeks and has a hopeless infected tooth. What is the preferred approach?",
                    "options": [
                        "Wait for profound neutropenia",
                        "Extract promptly with oncology coordination and allow healing time",
                        "Perform elective implants first",
                        "Ignore active infection"
                    ],
                    "answer": 1,
                    "explanation": "Dental infection sources are managed before immunosuppression when feasible. Healing interval, blood counts, cancer urgency, and medication-related jaw risk determine timing. Reference: Little JW, Miller CS, Rhodus NL. Dental Management of the Medically Compromised Patient. 9th ed. Pretreatment dental assessment in cancer.",
                    "source": "SDLE bank"
                },
                {
                    "q": "What is a common acute oral adverse effect of cytotoxic chemotherapy?",
                    "options": [
                        "Oral mucositis",
                        "Torus formation",
                        "Dentinogenesis imperfecta",
                        "Natal teeth"
                    ],
                    "answer": 0,
                    "explanation": "Cytotoxic therapy damages rapidly dividing oral epithelium and commonly causes painful erythema and ulcerative mucositis, often during the neutropenic nadir. Reference: National Cancer Institute. Oral Complications of Cancer Therapies; MASCC/ISOO mucositis guidance.",
                    "source": "SDLE bank"
                }
            ],
        },
        {
            id: "om-anomalies",
            title: "07 — Developmental Tooth Anomalies",
            title_en: "Enamel · dentin · shape · colour",
            summaryHtml: `
<h4 class="deck-topic">Enamel and dentin</h4>
<div class="deck-block deck-tbl"><table>
<thead><tr><th>Condition</th><th>Key features</th></tr></thead>
<tbody>
<tr><td><b>Enamel hypoplasia</b></td><td>Deficient <b>quantity</b> of enamel: pits, grooves, thin areas</td></tr>
<tr><td><b>Hypomineralisation</b></td><td>Normal thickness, poor <b>quality</b>: opacities</td></tr>
<tr><td><b>Amelogenesis imperfecta</b></td><td>Hereditary; all teeth in both dentitions; dentin normal</td></tr>
<tr><td><b>Dentinogenesis imperfecta</b></td><td>Opalescent grey or amber teeth, <b>bulbous crowns, cervical constriction, obliterated pulps, short roots</b>; type I accompanies osteogenesis imperfecta (blue sclera possible). The rarer type III may show large "shell" chambers</td></tr>
<tr><td><b>Regional odontodysplasia</b></td><td>Localised: enamel, dentin and pulp all affected; faint "ghost teeth"</td></tr>
<tr><td><b>Turner tooth</b></td><td>Single permanent tooth damaged by infection or trauma of the primary tooth</td></tr>
</tbody></table></div>
<h4 class="deck-topic">Shape and number</h4>
<ul>
<li><b>Gemination</b>: one bud tries to divide; bifid or large crown, usually one root and canal; tooth count normal when it is counted as one</li>
<li><b>Fusion</b>: two buds join; tooth count is one short when counted as one; roots or canals are often separate</li>
<li><b>Concrescence</b>: roots joined by cementum only</li>
<li><b>Dens invaginatus</b>: infolding, classic in the maxillary lateral incisor</li>
<li><b>Dens evaginatus</b>: extra tubercle with possible pulp horn, classic in the <b>mandibular second premolar</b>, especially in Asian populations</li>
<li>Many missing teeth with sparse hair and reduced sweating: <b>ectodermal dysplasia</b></li>
<li><b>Pierre Robin sequence</b>: micrognathia, tongue falling back, airway problem, often cleft palate</li>
<li>Typical unilateral cleft lip: failed fusion of the <b>medial nasal and maxillary</b> processes</li>
</ul>
<h4 class="deck-topic">Intrinsic staining</h4>
<ul>
<li><b>Tetracycline</b>: bands following the time of exposure; <b>fluoresces</b> under ultraviolet light. Avoid during tooth development when alternatives exist</li>
<li>Fluorosis: symmetric diffuse white or brown mottling</li>
</ul>
<div class="sum-key"><span class="sum-key-title">نقاط امتحانية</span><ul>
<li>Hypoplasia is a quantity defect.</li>
<li>Obliterated pulp and short roots favour dentinogenesis imperfecta.</li>
<li>All dental tissues affected in one region: regional odontodysplasia.</li>
<li>Count the teeth to separate gemination from fusion.</li>
</ul></div>
`,
            questions: [
                {
                    "q": "What is the term for a quantitative deficiency of enamel?",
                    "options": [
                        "Enamel hypomaturation",
                        "Enamel hypocalcification",
                        "Dentinogenesis imperfecta",
                        "Enamel hypoplasia"
                    ],
                    "answer": 3,
                    "explanation": "Enamel hypoplasia is reduced enamel quantity caused by defective matrix formation. Hypomaturation and hypocalcification are primarily qualitative defects in mineralization or maturation. Reference: Neville BW et al. Oral and Maxillofacial Pathology. 5th ed. Enamel defects.",
                    "source": "SDLE bank"
                },
                {
                    "q": "Which finding favors dentinogenesis imperfecta over amelogenesis imperfecta?",
                    "options": [
                        "Abnormal enamel only",
                        "Pulpal obliteration with short roots",
                        "Normal dentin in every tooth",
                        "A single enamel pit"
                    ],
                    "answer": 1,
                    "explanation": "Dentinogenesis imperfecta affects dentin and commonly produces bulbous crowns, cervical constriction, short roots, and progressive pulpal obliteration. Amelogenesis imperfecta primarily affects enamel. Reference: Neville BW et al. Oral and Maxillofacial Pathology. 5th ed. Hereditary dental defects.",
                    "source": "SDLE bank"
                },
                {
                    "q": "Which developmental anomaly can affect enamel, dentin, and pulp in one tooth or a localized region?",
                    "options": [
                        "Amelogenesis imperfecta",
                        "Dentinogenesis imperfecta",
                        "Regional odontodysplasia",
                        "Dental fluorosis"
                    ],
                    "answer": 2,
                    "explanation": "Regional odontodysplasia is a localized developmental defect involving ectodermal and mesodermal tooth tissues, producing thin poorly mineralized ghost teeth with large pulps. Reference: Neville BW et al. Oral and Maxillofacial Pathology. 5th ed. Regional odontodysplasia.",
                    "source": "SDLE bank"
                },
                {
                    "q": "Which tooth is most commonly affected by dens evaginatus in many Asian populations?",
                    "options": [
                        "Maxillary central incisor",
                        "Mandibular canine",
                        "Primary molar",
                        "Mandibular second premolar"
                    ],
                    "answer": 3,
                    "explanation": "Dens evaginatus most often affects mandibular premolars, especially second premolars, although prevalence and distribution vary by population. Reference: Neville BW et al. Oral and Maxillofacial Pathology. 5th ed. Dens evaginatus.",
                    "source": "SDLE bank"
                },
                {
                    "q": "Failure of fusion between which facial processes produces a typical unilateral cleft lip?",
                    "options": [
                        "Lateral nasal and mandibular processes",
                        "Two mandibular processes",
                        "Medial nasal and maxillary processes",
                        "Palatal shelves only"
                    ],
                    "answer": 2,
                    "explanation": "The upper lip forms when each maxillary process fuses with the merged medial nasal processes. Failure of this fusion creates a cleft lip. Reference: Sadler TW. Langman's Medical Embryology. 15th ed. Development of the face and palate.",
                    "source": "SDLE bank"
                }
            ],
        },
        {
            id: "om-jaws",
            title: "08 — Jaw Cysts, Tumours and Bone Disease",
            title_en: "Radiolucent · radiopaque · mixed",
            summaryHtml: `
<h4 class="deck-topic">Describe first</h4>
<p>Site, size, shape, border, internal density, relation to teeth and canals, effect on cortex and roots. Then test pulp vitality.</p>
<div class="deck-block deck-tbl"><table>
<thead><tr><th>Lesion</th><th>Typical clue</th></tr></thead>
<tbody>
<tr><td><b>Radicular cyst / granuloma</b></td><td>Apex of a <b>non-vital</b> tooth</td></tr>
<tr><td><b>Dentigerous cyst</b></td><td>Around the crown of an unerupted tooth, attached near the CEJ</td></tr>
<tr><td><b>Odontogenic keratocyst</b></td><td>Often posterior mandible, grows along the bone; <b>high recurrence</b></td></tr>
<tr><td><b>Lateral periodontal cyst</b></td><td>Beside vital mandibular premolar-canine roots; round or teardrop</td></tr>
<tr><td><b>Nasopalatine duct cyst</b></td><td>Midline between vital central incisors; round or heart-shaped</td></tr>
<tr><td><b>Simple bone cavity</b></td><td>Young patient; scalloping between vital roots</td></tr>
<tr><td><b>Stafne defect</b></td><td>Corticated, <b>below</b> the mandibular canal near the angle; no treatment</td></tr>
<tr><td><b>Ameloblastoma</b></td><td>Soap-bubble or honeycomb, expansion, root resorption. <b>Unicystic</b> type often looks like a dentigerous cyst</td></tr>
<tr><td><b>Periapical cemento-osseous dysplasia</b></td><td>Middle-aged Black women, anterior mandible, <b>vital</b> teeth; observe</td></tr>
<tr><td><b>Fibrous dysplasia</b></td><td><b>Ground-glass</b> or orange-peel, ill-defined margins</td></tr>
<tr><td><b>Paget disease</b></td><td>Older patient, enlarging jaws, spacing, cotton-wool bone, <b>high alkaline phosphatase</b></td></tr>
<tr><td><b>Osteoid osteoma</b></td><td>Small nidus with sclerosis; night pain eased by NSAIDs</td></tr>
<tr><td><b>Osteosarcoma</b></td><td>Sunburst periosteal pattern, widened ligament space</td></tr>
<tr><td><b>Multiple myeloma</b></td><td>Multiple <b>punched-out</b> lucencies, skull and jaws</td></tr>
</tbody></table></div>
<ul>
<li>A central giant cell lesion: check calcium and parathyroid hormone to exclude <b>hyperparathyroidism</b></li>
<li>Low <b>alkaline phosphatase</b> with early loss of primary teeth points to hypophosphatasia</li>
<li>An unexplained lesion that moves roots apart needs localisation and a <b>histological diagnosis</b></li>
<li>Aspirate before opening a lesion that could be vascular</li>
</ul>
<div class="sum-key"><span class="sum-key-title">نقاط امتحانية</span><ul>
<li>Keratocyst is remembered for recurrence.</li>
<li>Vital teeth argue against a radicular cyst.</li>
<li>Punched-out multiple lesions: myeloma.</li>
<li>Sunburst appearance: osteosarcoma.</li>
</ul></div>
`,
            questions: [
                {
                    "q": "Which odontogenic cyst has a notably high recurrence tendency after treatment?",
                    "options": [
                        "Radicular cyst",
                        "Dentigerous cyst",
                        "Lateral periodontal cyst",
                        "Odontogenic keratocyst"
                    ],
                    "answer": 3,
                    "explanation": "Odontogenic keratocysts recur more often than most common odontogenic cysts because of their thin friable lining, satellite cysts, and growth behavior. Long-term surveillance is important. Reference: WHO Classification of Head and Neck Tumours. 5th ed. Odontogenic cysts; Neville et al. Oral and Maxillofacial Pathology. 5th ed.",
                    "source": "SDLE bank"
                },
                {
                    "q": "Which disease classically can produce multiple punched-out radiolucencies in the jaws and skull?",
                    "options": [
                        "Gorlin syndrome",
                        "Fibrous dysplasia",
                        "Multiple myeloma",
                        "Florid cemento-osseous dysplasia"
                    ],
                    "answer": 2,
                    "explanation": "Multiple myeloma can produce multiple discrete punched-out radiolucencies from plasma-cell bone destruction. Gorlin syndrome produces multiple odontogenic keratocysts rather than the same classic skeletal pattern. Reference: Neville BW et al. Oral and Maxillofacial Pathology. 5th ed. Plasma-cell neoplasms.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A large unilocular pericoronal lesion has ameloblastic epithelial lining with intraluminal tumor nodules. What is the diagnosis?",
                    "options": [
                        "Dentigerous cyst",
                        "Odontogenic keratocyst",
                        "Unicystic ameloblastoma",
                        "Traumatic bone cyst"
                    ],
                    "answer": 2,
                    "explanation": "Histologic ameloblastic epithelium and tumor proliferation establish unicystic ameloblastoma. Treatment depends on luminal, intraluminal, or mural invasion and recurrence risk. Reference: Neville BW, Damm DD, Allen CM, Chi AC. Oral and Maxillofacial Pathology. 5th ed. Unicystic ameloblastoma.",
                    "source": "SDLE bank"
                },
                {
                    "q": "Which bone lesion classically has a small painful nidus surrounded by prominent reactive sclerosis?",
                    "options": [
                        "Simple bone cyst",
                        "Fibrous dysplasia",
                        "Osteoid osteoma",
                        "Central giant cell granuloma"
                    ],
                    "answer": 2,
                    "explanation": "Osteoid osteoma is a small osteoid-forming lesion with a radiolucent or mineralized nidus and surrounding reactive sclerotic bone. The characteristic pain is often worse at night and relieved by NSAIDs. Reference: WHO Classification of Tumours Editorial Board. Soft Tissue and Bone Tumours. 5th ed. Osteoid osteoma.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A small well-defined radiolucency lies between vital mandibular incisors and causes divergence without resorption. What is the next step?",
                    "options": [
                        "Perform root canal treatment on all incisors",
                        "Localize the lesion and establish histologic diagnosis if persistent or enlarging",
                        "Diagnose a radicular cyst",
                        "Ignore growth"
                    ],
                    "answer": 1,
                    "explanation": "Vitality excludes a routine inflammatory periapical lesion. Lateral periodontal cyst, odontogenic keratocyst, early cemento-osseous dysplasia, and other lesions require correlation. Reference: White SC, Pharoah MJ. Oral Radiology: Principles and Interpretation. 8th ed. Interradicular radiolucencies.",
                    "source": "SDLE bank"
                }
            ],
        },
        {
            id: "om-radiology",
            title: "09 — Dental Radiography and Interpretation",
            title_en: "Projections · errors · protection · landmarks",
            summaryHtml: `
<h4 class="deck-topic">Choose the view</h4>
<div class="deck-block deck-tbl"><table>
<thead><tr><th>View</th><th>Best for</th></tr></thead>
<tbody>
<tr><td><b>Bitewing</b></td><td>Proximal caries, crestal bone, overhangs (vertical bitewings show more bone loss)</td></tr>
<tr><td><b>Periapical</b></td><td>Roots, apices and surrounding bone</td></tr>
<tr><td><b>Panoramic</b></td><td>Overview of jaws, third molars, large lesions; less fine detail</td></tr>
<tr><td><b>Occlusal</b></td><td>Buccolingual position, expansion, floor of mouth stones</td></tr>
<tr><td><b>CBCT</b></td><td>3D hard tissue: implants, impactions near nerves, complex roots; only when it changes management</td></tr>
<tr><td><b>CT with contrast</b></td><td>Deep-space infection</td></tr>
<tr><td><b>MRI</b></td><td>Soft tissue and TMJ disc</td></tr>
</tbody></table></div>
<h4 class="deck-topic">Geometry</h4>
<ul>
<li><b>Paralleling</b> technique gives the most accurate shape and length</li>
<li>Sharpness improves with a small focal spot, long source-to-object distance and short object-to-receptor distance, with no movement</li>
<li>Too <b>little</b> vertical angle: elongation. Too <b>much</b>: foreshortening</li>
<li>Wrong <b>horizontal</b> angle: overlapped contacts. Beam off the receptor: cone cut</li>
<li><b>SLOB rule</b>: with a tube shift, the lingual object moves the Same way as the tube; the buccal moves Opposite</li>
</ul>
<h4 class="deck-topic">Radiation protection</h4>
<ul>
<li><b>Justify</b> each exposure and keep dose as low as reasonably achievable</li>
<li>Dose reducers: rectangular collimation, digital or fast receptors, correct exposure, avoiding retakes</li>
<li>Operator stands behind a barrier, or at least about 2 m away and 90 to 135 degrees from the primary beam; never holds the receptor</li>
<li>A justified dental radiograph may be taken in pregnancy with optimisation. Follow current local rules on shielding</li>
</ul>
<h4 class="deck-topic">Normal anatomy that mimics disease</h4>
<ul>
<li><b>Maxillary sinus</b> over premolar and molar apices with intact lamina dura</li>
<li>Mental foramen near premolar apices; incisive foramen between central incisors</li>
<li>Radiopaque line over the posterior mandible: external oblique ridge (above the mylohyoid ridge)</li>
<li>Thinnest facial cortex to note: <b>labial maxillary incisors</b></li>
</ul>
<div class="sum-key"><span class="sum-key-title">نقاط امتحانية</span><ul>
<li>Proximal caries: bitewing.</li>
<li>Overlap is horizontal; length distortion is vertical.</li>
<li>Intact lamina dura and vital tooth: think normal anatomy.</li>
<li>CBCT is not a routine screening film.</li>
</ul></div>
`,
            questions: [
                {
                    "q": "A radiolucency lies above maxillary premolar roots, has a corticated border, and the lamina dura remains intact. What is the most likely explanation?",
                    "options": [
                        "Periapical abscess",
                        "Vertical root fracture",
                        "Internal resorption",
                        "Maxillary sinus anatomy"
                    ],
                    "answer": 3,
                    "explanation": "Superimposed sinus recesses can mimic periapical disease. Pulp vitality, lamina dura continuity, angled imaging, and symptoms prevent unnecessary endodontic treatment. Reference: White SC, Pharoah MJ. Oral Radiology: Principles and Interpretation. 8th ed. Maxillary sinus and periapical diagnosis.",
                    "source": "SDLE bank"
                },
                {
                    "q": "Which jaw region usually has the thinnest facial cortical plate?",
                    "options": [
                        "Buccal aspect of mandibular molars",
                        "Labial aspect of maxillary incisors",
                        "Lingual aspect of mandibular molars",
                        "Posterior hard palate"
                    ],
                    "answer": 1,
                    "explanation": "The facial cortex over maxillary anterior roots is characteristically thin and can be fenestrated or dehiscent, which affects extraction and implant planning. Reference: Standring S, ed. Gray's Anatomy. 43rd ed.; implant surgical anatomy references.",
                    "source": "SDLE bank"
                }
            ],
        },
    ],
};

export default dentalOralMedicineAndRadiology;
