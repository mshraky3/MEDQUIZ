// Periodontics — dental-track section of the summaries catalog.
// Mirrored for the slide viewer in backend/content/summaryHtml (keep the two in sync).
// Inline questions are copied from the SQB bank.
const dentalPeriodontics = {
    id: "periodontics",
    title: "Periodontics",
    title_en: "SDLE Review — 9 Topics",
    icon: "shield-check",
    accent: "#34d399",
    intro: "Periodontics revision for SDLE: Examination and the 2017 Classification · Plaque, Microbiology and Risk Factors · Scaling, Root Planing and Instruments · Treatment Phases, Home Care and Maintenance · Acute Conditions and Gingival Enlargement · Furcation and Regeneration · Periodontal Surgery and Crown Lengthening · Recession and Mucogingival Care · Periodontics with Restorations, Orthodontics and Implants.",
    subtopics: [
        {
            id: "pe-classify",
            title: "01 — Examination and the 2017 Classification",
            title_en: "CAL · staging · grading · mobility",
            summaryHtml: `
<h4 class="deck-topic">Measurements</h4>
<ul>
<li><b>Probing depth (PD)</b>: gingival margin to base of pocket</li>
<li><b>Clinical attachment level (CAL)</b>: <b>CEJ</b> to base of pocket</li>
<li>With recession: CAL = PD + recession (5 + 2 = 7 mm). With the margin coronal to the CEJ: CAL = PD minus that distance. PD equals CAL when the margin is at the CEJ</li>
<li>A deep reading from swollen or overgrown gingiva without attachment loss is a <b>pseudopocket</b></li>
<li><b>Bleeding on probing</b> shows inflammation; its repeated absence is a good sign of stability. Smoking can hide it</li>
<li><b>Mobility (Miller, as commonly taught)</b>: I = slight, up to about 1 mm; II = more than 1 mm horizontally without vertical movement; III = severe horizontal and/or vertical (depressible)</li>
<li><b>Fremitus</b>: tooth movement felt during occlusion, used when checking occlusal trauma</li>
</ul>
<h4 class="deck-topic">Stage: severity and complexity</h4>
<div class="deck-block deck-tbl"><table>
<thead><tr><th>Stage</th><th>Interdental CAL (worst site)</th><th>Radiographic bone loss</th><th>Other</th></tr></thead>
<tbody>
<tr><td>I</td><td>1 to 2 mm</td><td>Coronal third, below 15%</td><td>No tooth loss from periodontitis</td></tr>
<tr><td>II</td><td>3 to 4 mm</td><td>Coronal third, 15 to 33%</td><td>No such tooth loss</td></tr>
<tr><td>III</td><td>5 mm or more</td><td>Middle third or beyond</td><td>Up to 4 teeth lost; PD 6 mm or more, class II or III furcation, vertical defects</td></tr>
<tr><td>IV</td><td>5 mm or more</td><td>Middle third or beyond</td><td>5 or more teeth lost, or need for complex rehabilitation</td></tr>
</tbody></table></div>
<p>Extent: localised (under 30% of teeth), generalised, or molar-incisor pattern.</p>
<h4 class="deck-topic">Grade: rate of progression</h4>
<div class="deck-block deck-tbl"><table>
<thead><tr><th></th><th>A slow</th><th>B moderate</th><th>C rapid</th></tr></thead>
<tbody>
<tr><td>Loss over 5 years</td><td>None</td><td>Under 2 mm</td><td>2 mm or more</td></tr>
<tr><td>% bone loss / age</td><td>Under 0.25</td><td>0.25 to 1.0</td><td>Over 1.0</td></tr>
<tr><td>Smoking</td><td>Non-smoker</td><td>Under 10 a day</td><td>10 or more a day</td></tr>
<tr><td>Diabetes</td><td>None</td><td>HbA1c under 7%</td><td>HbA1c 7% or more</td></tr>
</tbody></table></div>
<div class="sum-key"><span class="sum-key-title">نقاط امتحانية</span><ul>
<li>CAL is measured from the CEJ, so it is more reliable than PD over time.</li>
<li>Stage describes how bad and complex; grade describes how fast.</li>
<li>No loss over five years supports grade A.</li>
<li>Risk factors can raise the grade.</li>
</ul></div>
`,
            questions: [
                {
                    "q": "A site has 5 mm probing depth and 2 mm gingival recession. What is the clinical attachment loss?",
                    "options": [
                        "5 mm",
                        "3 mm",
                        "2 mm",
                        "7 mm"
                    ],
                    "answer": 3,
                    "explanation": "With an apically displaced gingival margin, CAL equals probing depth plus recession: 5 mm + 2 mm = 7 mm. Reference: Newman MG et al. Newman and Carranza's Clinical Periodontology. Clinical attachment level.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A site has a probing depth of 5 mm because the gingival margin is enlarged 3 mm coronal to the cemento-enamel junction. The probe reaches only 2 mm apical to the CEJ. What is the condition?",
                    "options": [
                        "Gingival pseudopocket",
                        "Five millimeters of attachment loss",
                        "Vertical root fracture",
                        "Apical abscess"
                    ],
                    "answer": 0,
                    "explanation": "Probing depth measures margin to pocket base, while clinical attachment level is referenced to the CEJ. Coronal enlargement can create a deep sulcus without equivalent attachment loss. Reference: Newman MG, Takei HH, Klokkevold PR, Carranza FA, eds. Carranza's Clinical Periodontology. 13th ed. Probing depth and clinical attachment level.",
                    "source": "SDLE bank"
                },
                {
                    "q": "Five-year records show no attachment or bone loss progression, bone-loss-to-age ratio is under 0.25, and heavy biofilm has produced little destruction. Which grade is most consistent?",
                    "options": [
                        "Grade A",
                        "Grade B",
                        "Grade C",
                        "Grade cannot be assigned under any circumstances"
                    ],
                    "answer": 0,
                    "explanation": "Grade A reflects slow progression demonstrated by no loss over five years or a low indirect progression ratio, together with a phenotype showing limited destruction relative to biofilm. Smoking and diabetes modifiers must also be considered. Reference: Newman MG, Takei HH, Klokkevold PR, Carranza FA, eds. Carranza's Clinical Periodontology. 13th ed. Periodontitis grading; Tonetti MS, et al. J Clin Periodontol. 2018;45(Suppl 20):S149-S161.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A tooth has 1.5 mm of horizontal mobility without vertical depressibility. What Miller mobility grade is recorded?",
                    "options": [
                        "Grade I",
                        "Grade III",
                        "Grade II",
                        "Physiologic mobility"
                    ],
                    "answer": 2,
                    "explanation": "Horizontal movement greater than 1 mm without vertical movement is Miller Grade II. Reference: Newman MG et al. Newman and Carranza's Clinical Periodontology. Tooth mobility.",
                    "source": "SDLE bank"
                },
                {
                    "q": "What does fremitus assess?",
                    "options": [
                        "Vertical bone height on radiographs",
                        "Pulp vitality",
                        "Gingival-fluid volume",
                        "Functional tooth movement during occlusion"
                    ],
                    "answer": 3,
                    "explanation": "Fremitus is palpable or visible movement of a tooth when the patient contacts or moves the teeth functionally. It complements, but does not replace, static mobility measurement and occlusal analysis. Reference: Newman MG, Takei HH, Klokkevold PR, Carranza FA, eds. Carranza's Clinical Periodontology. 13th ed. Occlusal trauma and fremitus.",
                    "source": "SDLE bank"
                }
            ],
        },
        {
            id: "pe-etiology",
            title: "02 — Plaque, Microbiology and Risk Factors",
            title_en: "Biofilm · complexes · host factors",
            summaryHtml: `
<h4 class="deck-topic">Healthy periodontium</h4>
<ul>
<li>Pink firm gingiva, no bleeding, shallow sulcus. Histology still shows a <b>mild lymphocytic and neutrophil presence</b></li>
<li>Classic histometric means: sulcus about 0.69 mm, <b>junctional epithelium about 0.97 mm</b>, connective tissue attachment about 1.07 mm</li>
<li><b>Gingival crevicular fluid increases</b> with inflammation</li>
</ul>
<h4 class="deck-topic">Biofilm</h4>
<ul>
<li><b>Dental plaque</b>: an adherent, soft, yellowish biofilm that a water spray cannot remove (unlike food debris or materia alba). Calculus is mineralised plaque</li>
<li>Periodontitis needs a dysbiotic biofilm <b>and a susceptible host</b>; most tissue destruction comes from the host response</li>
</ul>
<div class="deck-block deck-tbl"><table>
<thead><tr><th>Organisms</th><th>Association</th></tr></thead>
<tbody>
<tr><td><b>Red complex</b>: <i>P. gingivalis, T. forsythia, T. denticola</i></td><td>Strongly linked with periodontitis</td></tr>
<tr><td><i>A. actinomycetemcomitans</i></td><td>Molar-incisor pattern disease in the young</td></tr>
<tr><td><i>P. intermedia</i></td><td>Pregnancy-associated gingivitis</td></tr>
<tr><td>Spirochaetes and fusiform bacteria</td><td>Necrotising periodontal diseases</td></tr>
</tbody></table></div>
<p>When a microbiological question concerns one deep pocket, take a <b>site-specific subgingival</b> sample.</p>
<h4 class="deck-topic">Systemic risk</h4>
<ul>
<li><b>Diabetes</b>: poor control raises risk and speed of destruction; advanced glycation end products accumulate and amplify inflammation. The link works both ways, and successful periodontal therapy gives a <b>modest HbA1c reduction</b>. Coordinate care with the physician</li>
<li><b>Smoking</b>: more disease and poorer healing, with less visible bleeding</li>
<li>Others: stress, immune compromise, genetics, hormonal changes, some drugs</li>
</ul>
<h4 class="deck-topic">Local plaque-retentive factors</h4>
<ul>
<li>Calculus, <b>overhangs</b>, rough or open margins, open contacts with food impaction, crowding, root grooves and concavities, enamel projections</li>
<li>One severely affected site among healthy ones: look for a local cause</li>
</ul>
<div class="sum-key"><span class="sum-key-title">نقاط امتحانية</span><ul>
<li>Red complex: gingivalis, forsythia, denticola.</li>
<li>Diabetes and periodontitis affect each other.</li>
<li>A smoker's quiet gums can hide deep disease.</li>
<li>Isolated bone loss beside a restoration: check for an overhang.</li>
</ul></div>
`,
            questions: [
                {
                    "q": "Which microbial complex includes Porphyromonas gingivalis, Tannerella forsythia, and Treponema denticola?",
                    "options": [
                        "Red complex",
                        "Yellow complex",
                        "Purple complex",
                        "Actinomyces complex"
                    ],
                    "answer": 0,
                    "explanation": "These three anaerobic species constitute the classic red complex and are strongly associated with advanced periodontal pockets and disease. Microbial findings supplement but do not replace the clinical diagnosis. Reference: Newman MG, Takei HH, Klokkevold PR, Carranza FA, eds. Carranza's Clinical Periodontology. 13th ed. Periodontal microbial complexes.",
                    "source": "SDLE bank"
                },
                {
                    "q": "Yellowish soft tooth deposits are adherent and cannot be readily removed by a water spray. What are they?",
                    "options": [
                        "Materia alba",
                        "Acquired pellicle",
                        "Dental plaque",
                        "Calculus"
                    ],
                    "answer": 2,
                    "explanation": "Plaque is an organized adherent biofilm that resists simple water rinsing; materia alba is a loosely attached accumulation that is more readily displaced. Reference: Newman MG et al. Newman and Carranza's Clinical Periodontology. Dental plaque biofilm.",
                    "source": "SDLE bank"
                },
                {
                    "q": "How does gingival crevicular fluid change during gingival inflammation?",
                    "options": [
                        "It decreases to zero",
                        "It increases",
                        "It remains unchanged",
                        "It disappears permanently"
                    ],
                    "answer": 1,
                    "explanation": "Inflammation increases vascular permeability and fluid flow into the sulcus, increasing GCF volume. Reference: Newman MG et al. Newman and Carranza's Clinical Periodontology. Gingival crevicular fluid.",
                    "source": "SDLE bank"
                },
                {
                    "q": "Tooth 16 has generalized periodontal risk factors but disproportionately severe mesial bone loss beside a restoration overhang. Which local factor best explains the site-specific destruction?",
                    "options": [
                        "Diabetes alone",
                        "Plaque-retentive overhang",
                        "Pulp vitality",
                        "Fluoride exposure"
                    ],
                    "answer": 1,
                    "explanation": "Diabetes modifies susceptibility, but the overhang creates a local plaque-retentive niche corresponding to the localized mesial defect. Reference: Newman MG et al. Newman and Carranza's Clinical Periodontology. Local contributing factors and systemic modifiers.",
                    "source": "SDLE bank"
                },
                {
                    "q": "What systemic metabolic effect may follow successful periodontal treatment in a patient with type 2 diabetes?",
                    "options": [
                        "Modest reduction in HbA1c",
                        "Permanent cure of diabetes",
                        "Immediate insulin independence",
                        "Guaranteed normal glucose"
                    ],
                    "answer": 0,
                    "explanation": "Periodontal therapy can produce a modest improvement in glycemic control, but it complements rather than replaces medical diabetes care. Reference: European Federation of Periodontology. Diabetes and periodontitis recommendations for the oral healthcare team.",
                    "source": "SDLE bank"
                }
            ],
        },
        {
            id: "pe-instruments",
            title: "03 — Scaling, Root Planing and Instruments",
            title_en: "Curettes · angulation · fulcrum",
            summaryHtml: `
<div class="deck-block deck-tbl"><table>
<thead><tr><th>Feature</th><th>Universal curette</th><th>Gracey (area-specific)</th></tr></thead>
<tbody>
<tr><td>Cutting edges used</td><td><b>Both</b></td><td>One (the lower, outer edge)</td></tr>
<tr><td>Blade face to terminal shank</td><td>About <b>90 degrees</b></td><td><b>Offset</b>, about 60 to 70 degrees</td></tr>
<tr><td>Use</td><td>Most surfaces</td><td>Specific teeth and surfaces</td></tr>
</tbody></table></div>
<h4 class="deck-topic">Gracey numbers</h4>
<ul>
<li>1-2 and 3-4: anteriors; 5-6: anteriors and premolars</li>
<li>7-8 and 9-10: posterior facial and lingual</li>
<li><b>11-12: posterior mesial</b>; <b>13-14: posterior distal</b></li>
<li><b>After Five</b>: longer terminal shank for deep pockets. <b>Mini Five</b>: longer shank plus a blade about half the length for deep, narrow or furcation sites</li>
</ul>
<h4 class="deck-topic">Technique</h4>
<ul>
<li>Keep the <b>terminal shank parallel</b> to the surface being treated</li>
<li>Insert with the face almost closed (near 0 degrees); work at more than 45 and less than 90 degrees</li>
<li><b>Modified pen grasp</b> gives the best control and touch</li>
<li>A stable <b>finger rest</b> gives leverage, control and safety. If an intraoral rest is impossible, use a reinforced, cross-arch or properly supported extraoral fulcrum</li>
<li>Check smoothness and remaining deposits by <b>tactile exploration with a fine explorer</b>, even when radiographs suggest calculus</li>
</ul>
<h4 class="deck-topic">Powered scalers</h4>
<ul>
<li>Efficient for heavy calculus with water irrigation; they create <b>aerosols</b></li>
<li>With an airborne infection, defer elective care; if care is necessary, hand instruments lower aerosol under airborne precautions</li>
<li>Around implants use implant-safe tips</li>
</ul>
<h4 class="deck-topic">Hard places</h4>
<ul>
<li>Maxillary first premolar: deep <b>mesial concavity</b></li>
<li>Maxillary molar furcations, especially <b>distal and mesial entrances</b> with root concavities; furcation entrances are often narrower than a curette blade</li>
</ul>
<div class="sum-key"><span class="sum-key-title">نقاط امتحانية</span><ul>
<li>Offset blade identifies a Gracey curette.</li>
<li>Gracey 11/12 mesial, 13/14 distal.</li>
<li>Explorer is the tool to judge root smoothness.</li>
<li>Sensitivity after root planing is common and usually temporary.</li>
</ul></div>
`,
            questions: [
                {
                    "q": "Which feature identifies a universal curette?",
                    "options": [
                        "One usable lower cutting edge with an offset blade",
                        "A pointed tip and triangular cross-section",
                        "A straight blade designed only for enamel",
                        "Two usable cutting edges with the face at 90 degrees to the lower shank"
                    ],
                    "answer": 3,
                    "explanation": "A universal curette has a rounded toe and back with two cutting edges on each blade, and the face is perpendicular to the lower shank. It can be adapted to multiple tooth surfaces. Reference: Newman MG, Takei HH, Klokkevold PR, Carranza FA, eds. Carranza's Clinical Periodontology. 13th ed. Periodontal instruments and curettes.",
                    "source": "SDLE bank"
                },
                {
                    "q": "Which Gracey curette is conventionally selected for mesial surfaces of posterior teeth?",
                    "options": [
                        "Gracey 1/2",
                        "Gracey 11/12",
                        "Gracey 7/8",
                        "Gracey 13/14"
                    ],
                    "answer": 1,
                    "explanation": "Gracey 11/12 is designed for mesial posterior surfaces, while Gracey 13/14 is designed for distal posterior surfaces. Correct working-end selection and terminal-shank alignment remain essential. Reference: Newman MG, Takei HH, Klokkevold PR, Carranza FA, eds. Carranza's Clinical Periodontology. 13th ed. Area-specific curettes.",
                    "source": "SDLE bank"
                },
                {
                    "q": "During scaling with a Gracey curette, how should the lower shank be aligned for correct working-edge adaptation?",
                    "options": [
                        "Perpendicular to the treated surface",
                        "Parallel to the floor",
                        "At 90 degrees to the occlusal plane",
                        "Parallel to the treated surface"
                    ],
                    "answer": 3,
                    "explanation": "Parallel alignment of the lower shank with the target surface places the area-specific working edge at the correct angulation. Reference: Nield-Gehrig JS. Fundamentals of Periodontal Instrumentation. Gracey curette adaptation.",
                    "source": "SDLE bank"
                },
                {
                    "q": "Which instrument is used tactually to evaluate root-surface smoothness after scaling and root planing?",
                    "options": [
                        "Hoe scaler",
                        "Chisel scaler",
                        "Explorer",
                        "Mouth mirror"
                    ],
                    "answer": 2,
                    "explanation": "A fine explorer provides tactile detection of residual calculus and surface irregularities after instrumentation. Reference: Nield-Gehrig JS. Fundamentals of Periodontal Instrumentation. Explorers and root-surface evaluation.",
                    "source": "SDLE bank"
                },
                {
                    "q": "Which design modification distinguishes a Mini Five curette from a standard Gracey curette?",
                    "options": [
                        "A pointed toe and triangular cross-section",
                        "A longer terminal shank and blade approximately half standard length",
                        "A shorter terminal shank and double-width blade",
                        "A blade with no cutting edge"
                    ],
                    "answer": 1,
                    "explanation": "Mini Five curettes combine an extended terminal shank for deeper access with a shortened blade for narrow pockets, furcations, and developmental concavities. They do not eliminate the need for correct adaptation and stroke control. Reference: Newman MG, Takei HH, Klokkevold PR, Carranza FA, eds. Carranza's Clinical Periodontology. 13th ed. Extended-shank and mini- bladed curettes.",
                    "source": "SDLE bank"
                }
            ],
        },
        {
            id: "pe-plan",
            title: "04 — Treatment Phases, Home Care and Maintenance",
            title_en: "Sequence · interdental aids · recall",
            summaryHtml: `
<div class="sum-algo"><span class="sum-algo-title">Order of care</span><ol>
<li><b>Emergency</b>: pain, spreading infection</li>
<li><b>Disease control</b>: education, plaque control, risk factors, supra and subgingival instrumentation, remove overhangs, treat caries, extract hopeless teeth</li>
<li><b>Re-evaluate</b> after healing (commonly 4 to 8 weeks or more)</li>
<li><b>Surgery</b> for sites that need access, regeneration or correction</li>
<li><b>Definitive restorations</b>, orthodontics and prostheses on healthy tissue</li>
<li><b>Supportive periodontal care</b></li>
</ol></div>
<ul>
<li>Even with very deep pockets, untreated periodontitis starts with <b>instrumentation and risk control</b></li>
<li>Surgery does not compensate for poor plaque control</li>
<li>Spreading infection with dysphagia or breathing difficulty: <b>airway and hospital first</b></li>
</ul>
<h4 class="deck-topic">Home care</h4>
<ul>
<li><b>Bass</b> (sulcular) brushing: bristles at 45 degrees into the sulcus with small vibratory strokes. With recession or heavy force, correct the technique and use a soft brush gently</li>
<li>Clean between teeth every day, matched to the space and the patient's ability</li>
</ul>
<div class="deck-block deck-tbl"><table>
<thead><tr><th>Situation</th><th>Aid</th></tr></thead>
<tbody>
<tr><td>Tight contacts with intact papillae</td><td>Floss</td></tr>
<tr><td>Open embrasures, concavities</td><td>Interdental brush</td></tr>
<tr><td>Under a bridge pontic</td><td><b>Super floss</b> or threader</td></tr>
<tr><td>Poor dexterity</td><td>Floss holder, handled brushes, powered brush</td></tr>
<tr><td>Around implants</td><td>Interdental brush with coated or non-metal wire</td></tr>
</tbody></table></div>
<h4 class="deck-topic">Antimicrobials</h4>
<ul>
<li>Chlorhexidine is a short-term aid; it stains teeth and can alter taste</li>
<li>Local delivery (for example minocycline microspheres, active about <b>14 days</b>) is an adjunct for selected residual pockets, not a replacement for debridement</li>
</ul>
<h4 class="deck-topic">Maintenance</h4>
<ul>
<li>Interval is individual, often <b>about every 3 months</b> after periodontitis</li>
<li>Multiple residual bleeding or deep sites mean a <b>higher recurrence risk</b></li>
<li>Recession exposes roots, so reassess caries risk too</li>
</ul>
<div class="sum-key"><span class="sum-key-title">نقاط امتحانية</span><ul>
<li>Control disease before definitive prosthodontic or surgical work.</li>
<li>Under a bridge: super floss.</li>
<li>Limited dexterity: change the aid, do not just repeat advice.</li>
<li>Airway danger outranks all periodontal care.</li>
</ul></div>
`,
            questions: [
                {
                    "q": "After removal of a failed bridge, the abutments are carious and the surrounding gingiva is inflamed. What should precede definitive impressions or crown lengthening?",
                    "options": [
                        "Immediate final impression",
                        "Immediate definitive bridge",
                        "Esthetic surgery before caries control",
                        "Disease-control phase"
                    ],
                    "answer": 3,
                    "explanation": "Caries, pulpal and periodontal inflammation, plaque control, and provisionalization must be stabilized before definitive restorative or surgical decisions. Reference: Rosenstiel SF, Land MF, Fujimoto J. Contemporary Fixed Prosthodontics. Diagnosis and treatment sequencing.",
                    "source": "SDLE bank"
                },
                {
                    "q": "Which interdental cleaning aid is specifically designed to pass beneath a fixed dental bridge?",
                    "options": [
                        "Standard waxed floss alone",
                        "Super floss",
                        "Wooden wedge",
                        "Rubber-dam floss"
                    ],
                    "answer": 1,
                    "explanation": "Its stiffened end can be threaded under a pontic, and its spongy segment cleans the underside and adjacent abutment surfaces. Reference: Newman MG et al. Newman and Carranza's Clinical Periodontology. Interdental plaque control.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A patient has limited manual dexterity and cannot use string floss effectively. Which strategy is most appropriate?",
                    "options": [
                        "Abandon interdental cleaning entirely",
                        "Use a sharp periodontal instrument at home",
                        "Increase brushing force until bleeding occurs",
                        "Select an easier aid such as a holder brush or powered device"
                    ],
                    "answer": 3,
                    "explanation": "Home care should be individualized to dexterity, embrasure anatomy, motivation, and prostheses. A practical device used consistently is preferable to an idealized method the patient cannot perform. Reference: Newman MG, Takei HH, Klokkevold PR, Carranza FA, eds. Carranza's Clinical Periodontology. 13th ed. Individualized mechanical plaque control.",
                    "source": "SDLE bank"
                },
                {
                    "q": "After active periodontal therapy, multiple residual pockets deeper than 5 mm persist at supportive-care visits. What does this finding indicate?",
                    "options": [
                        "Low recurrence risk",
                        "Complete periodontal stability",
                        "Increased recurrence risk",
                        "Guaranteed tooth loss"
                    ],
                    "answer": 2,
                    "explanation": "Persistent deep pockets, especially when bleeding, retain a pathogenic environment and signal incomplete treatment endpoints and greater risk of progression or recurrence. Reference: European Federation of Periodontology. S3-level clinical practice guideline for treatment of stage I-III periodontitis. J Clin Periodontol. 2020.",
                    "source": "SDLE bank"
                },
                {
                    "q": "Generalized 7-11 mm periodontal pockets and radiographic bone loss are present. What is the essential initial active treatment?",
                    "options": [
                        "Antibiotics alone for one week",
                        "Subgingival instrumentation and risk control",
                        "Immediate implant placement",
                        "Observation only"
                    ],
                    "answer": 1,
                    "explanation": "Stepwise periodontal therapy begins with behavior and risk-factor control plus thorough subgingival instrumentation; systemic antibiotics are selective adjuncts rather than automatic monotherapy. Reference: European Federation of Periodontology. S3 guideline for treatment of stage I-III periodontitis. J Clin Periodontol. 2020.",
                    "source": "SDLE bank"
                }
            ],
        },
        {
            id: "pe-acute",
            title: "05 — Acute Conditions and Gingival Enlargement",
            title_en: "Necrotising disease · abscess · overgrowth",
            summaryHtml: `
<h4 class="deck-topic">Necrotising periodontal diseases</h4>
<ul>
<li><b>Pain</b>, bleeding, <b>punched-out necrotic papillae</b>, often a grey pseudomembrane and fetor; lymph nodes or fever may occur</li>
<li>Linked with stress, smoking, poor hygiene, malnutrition, immune suppression</li>
<li>Gingivitis: no attachment loss. Periodontitis: attachment and bone loss</li>
<li>Core care: <b>gentle debridement</b>, oral hygiene, antiseptic rinse, pain relief and risk control. Add systemic antibiotic (often metronidazole) for fever, lymphadenopathy or immune compromise</li>
</ul>
<h4 class="deck-topic">Abscesses: test the pulp</h4>
<div class="deck-block deck-tbl"><table>
<thead><tr><th></th><th>Periodontal abscess</th><th>Acute apical abscess</th></tr></thead>
<tbody>
<tr><td>Pulp</td><td>Usually vital</td><td>Necrotic</td></tr>
<tr><td>Pocket</td><td>Deep, often pre-existing</td><td>Often normal probing</td></tr>
<tr><td>First care</td><td><b>Drain</b> (usually through the pocket) and debride</td><td>Drain through canal or incision; RCT or extraction</td></tr>
</tbody></table></div>
<ul>
<li>Add antibiotics with fever, malaise, lymphadenopathy or spread, and assess urgently</li>
<li>A foreign body such as excess <b>cement</b> or impacted debris must be removed</li>
</ul>
<h4 class="deck-topic">Gingival enlargement</h4>
<ul>
<li>Drugs: <b>phenytoin, cyclosporine, calcium channel blockers</b> such as nifedipine</li>
<li>First: plaque control and debridement; discuss a drug change with the physician (never stop it yourself)</li>
<li>Fibrotic tissue that remains, with enough attached gingiva and no need to reach bone: <b>external-bevel gingivectomy</b>. Otherwise use a flap</li>
<li>Generalised firm enlargement in a young healthy person with no causative drug: think of <b>hereditary or idiopathic gingival fibromatosis</b></li>
</ul>
<h4 class="deck-topic">Other presentations</h4>
<ul>
<li>Diffuse smooth bright-red gingiva after a new flavouring or toothpaste: suspect <b>plasma cell gingivitis</b>; withdraw the trigger and follow up; biopsy if unclear or persistent</li>
<li><b>Linear gingival erythema</b>: red marginal band that responds poorly to plaque control in an immunocompromised patient</li>
<li>Peeling, erosive "desquamative gingivitis" suggests a mucocutaneous disease (lichen planus, pemphigoid, pemphigus): biopsy</li>
</ul>
<div class="sum-key"><span class="sum-key-title">نقاط امتحانية</span><ul>
<li>Painful punched-out papillae: necrotising disease.</li>
<li>Vital pulp with a deep pocket favours periodontal abscess.</li>
<li>Drug-induced overgrowth: hygiene and physician liaison first.</li>
<li>Systemic signs justify antibiotics as an addition to local care.</li>
</ul></div>
`,
            questions: [
                {
                    "q": "A patient has necrotizing ulcerative gingivitis without fever or systemic compromise. What is the core initial treatment?",
                    "options": [
                        "Root-canal treatment",
                        "Immediate extraction",
                        "Antibiotics alone",
                        "Gentle nonsurgical debridement"
                    ],
                    "answer": 3,
                    "explanation": "Local debridement, antiseptic rinsing, pain control, oral-hygiene support, and risk-factor management are central; systemic antibiotics are reserved for systemic involvement or selected cases. Reference: Newman MG et al. Newman and Carranza's Clinical Periodontology. Necrotizing periodontal diseases.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A vital tooth with a pre-existing deep periodontal pocket develops sudden pain, lateral swelling, suppuration, and increased tooth mobility. What is the most likely diagnosis?",
                    "options": [
                        "Periodontal abscess",
                        "Gingival abscess",
                        "Acute apical abscess",
                        "Irreversible pulpitis"
                    ],
                    "answer": 0,
                    "explanation": "Acute purulence arising within an existing periodontal pocket around a vital tooth supports a periodontal abscess. Treatment includes drainage and debridement with assessment of systemic spread and the underlying periodontal lesion. Reference: Newman MG, Takei HH, Klokkevold PR, Carranza FA, eds. Carranza's Clinical Periodontology. 13th ed. Periodontal abscesses.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A localized fluctuant periodontal abscess has a drainable collection of pus. What is the immediate local management?",
                    "options": [
                        "Root-canal treatment in every case",
                        "Establish drainage and debride",
                        "Extract every involved tooth",
                        "Observe without treatment"
                    ],
                    "answer": 1,
                    "explanation": "Acute care establishes drainage through the pocket or an incision as appropriate and disrupts the local cause; prognosis and definitive periodontal treatment follow assessment. Reference: Herrera D et al. Acute periodontal lesions. J Clin Periodontol. Consensus report.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A patient with a periodontal abscess has fever, malaise, rapidly spreading facial swelling, and lymphadenopathy. What additional management is indicated?",
                    "options": [
                        "Observation without drainage",
                        "Urgent systemic assessment and appropriate antibiotics with source control",
                        "Elective bleaching",
                        "Delay treatment for one month"
                    ],
                    "answer": 1,
                    "explanation": "Systemic signs and spreading infection require urgent assessment, drainage or other source control, and antimicrobial therapy according to allergy, local guidance, and severity. Airway or deep-space concern requires emergency referral. Reference: Newman MG, Takei HH, Klokkevold PR, Carranza FA, eds. Carranza's Clinical Periodontology. 13th ed. Periodontal emergencies; Hupp JR, Ellis E, Tucker MR. Contemporary Oral and Maxillofacial Surgery. 7th ed. Odontogenic infection.",
                    "source": "SDLE bank"
                },
                {
                    "q": "Which surgical technique removes a fibrotic gingival enlargement when there is adequate attached gingiva and no need for osseous access?",
                    "options": [
                        "Coronally advanced flap",
                        "Semilunar flap",
                        "Guided tissue regeneration",
                        "External-bevel gingivectomy"
                    ],
                    "answer": 3,
                    "explanation": "External-bevel gingivectomy excises excess suprabony gingival tissue when pocket elimination is needed without flap access to bone. Reference: Newman MG et al. Newman and Carranza's Clinical Periodontology. Gingivectomy.",
                    "source": "SDLE bank"
                }
            ],
        },
        {
            id: "pe-furcation",
            title: "06 — Furcation, Resection and Regeneration",
            title_en: "Glickman grades · GTR · root resection",
            summaryHtml: `
<h4 class="deck-topic">Glickman furcation grades</h4>
<div class="deck-block deck-tbl"><table>
<thead><tr><th>Grade</th><th>Finding</th><th>Usual options</th></tr></thead>
<tbody>
<tr><td>I</td><td>Early flute involvement</td><td>Debridement, odontoplasty if needed</td></tr>
<tr><td>II</td><td>Partial (cul-de-sac) bone loss</td><td>Open debridement; <b>regeneration</b> works best in suitable buccal or lingual mandibular and buccal maxillary defects</td></tr>
<tr><td>III</td><td>Through-and-through, still covered by gingiva</td><td>Maintain, tunnel, resect or extract</td></tr>
<tr><td>IV</td><td>Through-and-through and clinically visible</td><td>As grade III</td></tr>
</tbody></table></div>
<ul>
<li>Probe with a curved <b>Nabers probe</b></li>
<li>A through-and-through furcation is not automatically hopeless: if restorable and cleanable, <b>treat and maintain</b></li>
<li>Bone between the roots of a multirooted tooth is <b>interradicular</b></li>
</ul>
<h4 class="deck-topic">Resective choices</h4>
<ul>
<li><b>Root resection (amputation)</b>: remove one badly affected root, often of a maxillary molar. Remaining support, endodontics and restoration must be favourable</li>
<li><b>Hemisection</b>: split a mandibular molar and remove one half</li>
<li>Endodontic treatment is normally done before planned resection</li>
<li>Consider root separation, root trunk length and keratinised tissue</li>
<li>A <b>short root trunk</b> opens the furcation early, but once opened it is easier to reach; it also raises the risk of exposing the furcation during crown lengthening</li>
</ul>
<h4 class="deck-topic">Regeneration</h4>
<ul>
<li><b>Guided tissue regeneration</b>: a membrane <b>excludes fast-growing epithelium and gingival connective tissue</b> and keeps space so that cells from the ligament and bone repopulate: new cementum, ligament and bone</li>
<li>Best defects are contained: deep, narrow, <b>three-wall</b></li>
<li>Success needs plaque control, no smoking, defect stability and <b>tension-free primary closure</b></li>
<li><b>Alveolar ridge preservation</b>: grafting a fresh socket to limit ridge shrinkage</li>
<li>Assess ridge width and undercuts in three dimensions with <b>CBCT</b></li>
</ul>
<div class="sum-key"><span class="sum-key-title">نقاط امتحانية</span><ul>
<li>Grade II furcation is the classic GTR question.</li>
<li>The membrane's job is cell exclusion and space maintenance.</li>
<li>One hopeless root with the others sound: resection.</li>
<li>Passive primary closure protects the graft.</li>
</ul></div>
`,
            questions: [
                {
                    "q": "What is the principal function of a barrier membrane in guided regeneration?",
                    "options": [
                        "Exclude rapidly migrating soft-tissue cells and maintain space",
                        "Create pulp vitality",
                        "Dissolve cortical bone",
                        "Replace the need for wound stability"
                    ],
                    "answer": 0,
                    "explanation": "A membrane protects the wound compartment, supports space maintenance, and limits epithelial and connective-tissue invasion while regenerative cells repopulate the site. Primary closure, stability, blood supply, and infection control remain necessary. Reference: Newman MG, Takei HH, Klokkevold PR, Carranza FA, eds. Carranza's Clinical Periodontology. 13th ed. Principles of guided regeneration; Misch CE. Contemporary Implant Dentistry. 3rd ed.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A barrier membrane is placed around a periodontally involved tooth to exclude epithelium and favor regeneration of periodontal ligament cementum and bone. What is the procedure?",
                    "options": [
                        "Guided bone regeneration",
                        "Socket shield",
                        "Guided tissue regeneration",
                        "Vestibuloplasty"
                    ],
                    "answer": 2,
                    "explanation": "Guided tissue regeneration targets regeneration of the tooth-supporting periodontal attachment apparatus. It is used in selected intrabony and furcation defects with favorable patient and defect characteristics. Reference: Newman MG, Takei HH, Klokkevold PR, Carranza FA, eds. Carranza's Clinical Periodontology. 13th ed. Guided tissue regeneration.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A molar has a through-and-through furcation that is clinically visible because of gingival recession, but the tooth remains restorable and maintainable. Which principle is correct?",
                    "options": [
                        "Furcation alone mandates extraction",
                        "Root canal treatment is mandatory",
                        "Observation without debridement is enough",
                        "Periodontal treatment is appropriate"
                    ],
                    "answer": 3,
                    "explanation": "A clinically visible through-and-through lesion corresponds to advanced furcation involvement, but furcation status alone is not a reason for extraction. Maintainability, root anatomy, support, mobility, restorability, and patient control determine the treatment plan. Reference: Sanz M, et al. J Clin Periodontol. 2020;47(Suppl 22):4-60. doi:10.1111/jcpe.13290. Furcation-management recommendations.",
                    "source": "SDLE bank"
                },
                {
                    "q": "One root of a maxillary molar has severe localized periodontal destruction, while the remaining roots have adequate support and the tooth is endodontically and restoratively maintainable. Which procedure may be considered?",
                    "options": [
                        "Pulpotomy",
                        "Root resection",
                        "Gingivectomy only",
                        "Internal bleaching"
                    ],
                    "answer": 1,
                    "explanation": "Selective root resection may retain a multirooted tooth when disease is confined to one root and the remaining roots, endodontic status, restoration, occlusion, and hygiene are favorable. It is not selected from furcation grade alone. Reference: Sanz M, et al. J Clin Periodontol. 2020;47(Suppl 22):4-60. doi:10.1111/jcpe.13290. Resective furcation therapy.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A ridge defect requires grafting and membrane placement. Which flap endpoint most supports uneventful healing?",
                    "options": [
                        "Closure under maximal tension",
                        "Passive tension-free primary closure",
                        "Intentional membrane exposure in every case",
                        "Excision of all keratinized tissue"
                    ],
                    "answer": 1,
                    "explanation": "Passive primary closure protects the graft and membrane and reduces dehiscence or exposure risk. Periosteal release may be used carefully when additional advancement is needed without compromising flap blood supply. Reference: Misch CE. Contemporary Implant Dentistry. 3rd ed. Flap management for guided bone regeneration; Newman MG, et al. Carranza's Clinical Periodontology. 13th ed.",
                    "source": "SDLE bank"
                }
            ],
        },
        {
            id: "pe-surgery",
            title: "07 — Flaps, Gingivectomy and Crown Lengthening",
            title_en: "Incisions · tissue attachment · biopsy",
            summaryHtml: `
<h4 class="deck-topic">Main procedures</h4>
<div class="deck-block deck-tbl"><table>
<thead><tr><th>Procedure</th><th>Purpose</th></tr></thead>
<tbody>
<tr><td>Open flap debridement</td><td>Access to roots and defects</td></tr>
<tr><td><b>Resective (flap with osseous surgery)</b></td><td>Reshape bone (ostectomy, osteoplasty) and reduce pockets</td></tr>
<tr><td>Gingivectomy</td><td>Remove excess soft tissue when bone access is unnecessary</td></tr>
<tr><td>Regenerative</td><td>Rebuild lost support</td></tr>
</tbody></table></div>
<ul>
<li><b>Internal bevel</b> incision keeps keratinised tissue in flap surgery; the <b>sulcular (crevicular)</b> incision preserves the most tissue, useful when the flap will be advanced coronally</li>
<li>Gingivectomy is avoided with little attached gingiva, a pocket base apical to the mucogingival junction or bony defects</li>
<li>Releasing incisions go at line angles, away from the defect and the middle of a papilla or facial surface; keep a broad base for blood supply</li>
<li>Distal wedge design (triangular, linear, H-shaped) depends on <b>tissue volume and the underlying defect</b></li>
<li>Excisional biopsy for primary closure: <b>elliptical</b> incision</li>
</ul>
<h4 class="deck-topic">Crown lengthening</h4>
<ul>
<li>Goals: expose sound tooth for retention and ferrule, respect the <b>supracrestal tissue attachment</b>, or improve a gummy smile</li>
<li>Plan about 3 mm between the future margin and the bone crest; this often requires bone removal</li>
<li>Check root length, crown-root ratio, <b>root trunk and furcation</b>, neighbours and aesthetics</li>
<li>In the aesthetic zone where surgery would leave a long tooth: <b>orthodontic extrusion</b>. For a non-vital tooth: root canal treatment, extrusion (then stabilise), then the crown, with soft-tissue correction if needed</li>
<li>Short worn teeth with <b>normal bone and gingiva</b> may need restorative and occlusal rehabilitation planning, not periodontal surgery alone</li>
</ul>
<div class="sum-algo"><span class="sum-algo-title">Before any elective surgery</span><ol>
<li>Inflammation and plaque controlled</li>
<li>Medical status and smoking assessed</li>
<li>Tooth restorable and strategically worth keeping</li>
<li>Consent, then plan the flap and closure</li>
</ol></div>
<div class="sum-key"><span class="sum-key-title">نقاط امتحانية</span><ul>
<li>Resective surgery includes removing supporting bone.</li>
<li>Short root trunk: beware of furcation exposure.</li>
<li>Aesthetic zone fracture: think of extrusion.</li>
<li>Elliptical incision closes well after excisional biopsy.</li>
</ul></div>
`,
            questions: [
                {
                    "q": "During crown lengthening of a maxillary molar with a short root trunk, which anatomic complication is the main concern?",
                    "options": [
                        "Enamel hypoplasia",
                        "Furcation exposure",
                        "Root elongation",
                        "Pulpal calcification"
                    ],
                    "answer": 1,
                    "explanation": "Osseous resection around a short root trunk can rapidly approach or expose the furcation, worsening cleansability and periodontal prognosis. Reference: Newman MG et al. Newman and Carranza's Clinical Periodontology. Surgical crown lengthening.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A fractured anterior tooth requires additional coronal tooth structure for a ferrule, but esthetic crown lengthening would create an unfavorable long tooth and compromise adjacent bone. Which alternative may preserve the periodontal architecture?",
                    "options": [
                        "Gingivectomy only",
                        "Remove adjacent papillae",
                        "Orthodontic extrusion",
                        "Deepen the preparation below bone"
                    ],
                    "answer": 2,
                    "explanation": "Orthodontic extrusion can expose sound tooth structure while avoiding extensive osseous resection around adjacent teeth. Root length, periodontal support, esthetics, treatment time, and restorability determine feasibility. Reference: Rosenstiel SF, Land MF, Fujimoto J. Contemporary Fixed Prosthodontics. 6th ed. Management of inadequate clinical crown height; Newman MG, et al. Carranza's Clinical Periodontology. 13th ed. Crown lengthening.",
                    "source": "SDLE bank"
                },
                {
                    "q": "Which incision design is preferred for an excisional soft-tissue biopsy that will be closed by primary intention?",
                    "options": [
                        "Semilunar incision",
                        "Envelope flap",
                        "Vertical releasing incision alone",
                        "Elliptical incision"
                    ],
                    "answer": 3,
                    "explanation": "An ellipse permits complete lesion removal with converging margins that can be approximated without tissue redundancy for primary closure. Reference: Hupp JR et al. Contemporary Oral and Maxillofacial Surgery. Principles of biopsy.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A nonvital tooth requires orthodontic extrusion before definitive crown placement. What is the appropriate sequence?",
                    "options": [
                        "Crown, extrusion, then endodontic treatment",
                        "Extrusion after definitive crown placement",
                        "Extraction without assessment",
                        "Endodontic treatment, extrusion, then crown"
                    ],
                    "answer": 3,
                    "explanation": "Endodontic treatment and a provisional attachment are completed as needed before extrusion; the definitive post-core and crown follow stabilization and periodontal recontouring. Reference: Rosenstiel SF, Land MF, Fujimoto J. Contemporary Fixed Prosthodontics. Orthodontic extrusion of compromised teeth.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A deep distal defect on a terminal molar is difficult to visualize during surgery. What is the most appropriate access principle?",
                    "options": [
                        "Use the same incision for every posterior site",
                        "Avoid reflecting tissue over the target surface",
                        "Remove bone before locating the defect",
                        "Design the flap and releases around the defect and adjacent anatomy"
                    ],
                    "answer": 3,
                    "explanation": "Flap extension and release placement are chosen to provide visibility and passive access while preserving blood supply and important anatomy. The design should follow the treatment objective rather than a memorized tooth label. Reference: Newman MG, Takei HH, Klokkevold PR, Carranza FA, eds. Carranza's Clinical Periodontology. 13th ed. Principles of periodontal flap surgery.",
                    "source": "SDLE bank"
                }
            ],
        },
        {
            id: "pe-recession",
            title: "08 — Recession and Mucogingival Care",
            title_en: "Cairo · Miller · phenotype · grafts",
            summaryHtml: `
<h4 class="deck-topic">Classifications</h4>
<div class="deck-block deck-tbl"><table>
<thead><tr><th>Cairo (used by the 2017 system)</th><th>Interproximal attachment</th></tr></thead>
<tbody>
<tr><td><b>RT1</b></td><td>No loss</td></tr>
<tr><td><b>RT2</b></td><td>Loss equal to or less than the buccal loss</td></tr>
<tr><td><b>RT3</b></td><td>Loss greater than the buccal loss</td></tr>
</tbody></table></div>
<ul>
<li><b>Miller I</b>: does not reach the mucogingival junction, no interdental loss</li>
<li><b>Miller II</b>: reaches or passes the junction, no interdental loss</li>
<li><b>Miller III</b>: some interdental bone or tissue loss, or malposition; only partial coverage expected</li>
<li><b>Miller IV</b>: severe interdental loss; coverage not predictable</li>
</ul>
<h4 class="deck-topic">Causes and phenotype</h4>
<ul>
<li>Traumatic brushing, inflammation, tooth position outside the bony housing, habits, frenal pull, orthodontic movement</li>
<li><b>Thin phenotype</b>: thin scalloped tissue and thin bone, prone to <b>recession, dehiscence and fenestration</b></li>
<li>Estimate thickness by <b>probe visibility through the margin</b>: if it shows through, the tissue is thin</li>
<li>Thin tissue risks recession and visible margins with subgingival restorations</li>
<li>After exposing a buccally impacted canine, watch for <b>recession</b>; keeping keratinised tissue matters</li>
</ul>
<div class="sum-algo"><span class="sum-algo-title">Management</span><ol>
<li>Remove the cause and control inflammation</li>
<li>Record and monitor if stable and not troubling</li>
<li>Treat for aesthetics, sensitivity, progression, caries risk or difficult cleaning</li>
</ol></div>
<h4 class="deck-topic">Coverage options</h4>
<div class="deck-cards">
<div class="deck-card mgmt"><div class="deck-card-h">Coronally advanced flap + connective tissue graft</div><p>Most predictable for single RT1 defects, and adds thickness.</p></div>
<div class="deck-card"><div class="deck-card-h">Lateral pedicle flap</div><p>One defect with thick, wide keratinised tissue next to it.</p></div>
<div class="deck-card"><div class="deck-card-h">Semilunar flap</div><p>Shallow maxillary recession with intact papillae and adequate vestibule and tissue thickness.</p></div>
<div class="deck-card clin"><div class="deck-card-h">Multiple coronally advanced flap or tunnel</div><p>Several adjacent recessions in one field.</p></div>
</div>
<p>A <b>free gingival graft</b> is mainly used to increase keratinised and attached tissue; its colour match is poorer.</p>
<div class="sum-key"><span class="sum-key-title">نقاط امتحانية</span><ul>
<li>No interproximal loss is RT1, with the best chance of full coverage.</li>
<li>Connective tissue graft with coronal advancement is the usual reference method.</li>
<li>Donor tissue beside the defect allows a lateral pedicle.</li>
<li>Thin phenotype goes with fenestration and dehiscence.</li>
</ul></div>
`,
            questions: [
                {
                    "q": "A recession defect has interproximal attachment loss greater than the facial attachment loss. What is the Cairo classification?",
                    "options": [
                        "RT1",
                        "RT2",
                        "RT3",
                        "Miller Class II only"
                    ],
                    "answer": 2,
                    "explanation": "RT3 is defined by interproximal attachment loss greater than the facial loss. Predictable complete root coverage is limited because interdental support is substantially reduced. Reference: Newman MG, Takei HH, Klokkevold PR, Carranza FA, eds. Carranza's Clinical Periodontology. 13th ed. Gingival recession; Cairo F. Periodontol 2000. 2017;75:296-316.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A healthy patient has a single Cairo RT1 recession with adequate vestibular depth and no cervical restoration. Which procedure offers the most predictable root coverage?",
                    "options": [
                        "Gingivectomy",
                        "Apically positioned flap",
                        "Coronally advanced flap with connective-tissue graft",
                        "Distal wedge"
                    ],
                    "answer": 2,
                    "explanation": "For a suitable RT1 defect, a coronally advanced flap combined with a connective-tissue graft provides highly predictable root coverage and tissue-thickness gain. Patient, tooth, and surgical factors still affect the result. Reference: Newman MG, Takei HH, Klokkevold PR, Carranza FA, eds. Carranza's Clinical Periodontology. 13th ed. Root-coverage procedures; Zucchelli G, Mounssif I. Periodontal plastic surgery. Periodontology 2000. 2015;68:333-368.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A single recession has abundant thick keratinized tissue immediately adjacent to the defect. Which procedure rotates neighboring attached tissue over the exposed root while retaining its blood supply?",
                    "options": [
                        "Free gingival graft",
                        "Lateral pedicle flap",
                        "Gingivectomy",
                        "Apicoectomy"
                    ],
                    "answer": 1,
                    "explanation": "A lateral pedicle flap uses adjacent donor tissue and maintains a vascular base, making it useful for selected isolated defects. Donor-site recession and tissue availability limit its use. Reference: Newman MG, Takei HH, Klokkevold PR, Carranza FA, eds. Carranza's Clinical Periodontology. 13th ed. Lateral pedicle grafts.",
                    "source": "SDLE bank"
                },
                {
                    "q": "Which alveolar-bone morphology is most commonly associated with a thin periodontal phenotype?",
                    "options": [
                        "Thick buccal plate everywhere",
                        "Generalized hypercementosis",
                        "Fenestration and dehiscence",
                        "Condensing osteitis"
                    ],
                    "answer": 2,
                    "explanation": "Thin facial tissues and a thin cortical plate are more susceptible to underlying fenestrations and dehiscences. Reference: Lindhe J, Lang NP. Clinical Periodontology and Implant Dentistry. Periodontal phenotype.",
                    "source": "SDLE bank"
                },
                {
                    "q": "Which clinical method is commonly used to estimate gingival thickness at the sulcus?",
                    "options": [
                        "Tooth percussion only",
                        "Probe transparency through the gingival margin",
                        "Pulp sensibility testing",
                        "Panoramic magnification only"
                    ],
                    "answer": 1,
                    "explanation": "Visibility of a periodontal probe through the marginal tissue provides a practical categorical assessment of thin versus thick phenotype. Direct transgingival measurement or ultrasonography may provide quantitative thickness. Reference: Newman MG, Takei HH, Klokkevold PR, Carranza FA, eds. Carranza's Clinical Periodontology. 13th ed. Assessment of gingival phenotype.",
                    "source": "SDLE bank"
                }
            ],
        },
        {
            id: "pe-interdisc",
            title: "09 — Restorations, Orthodontics and Implants",
            title_en: "Margins · tooth movement · peri-implant disease",
            summaryHtml: `
<h4 class="deck-topic">Restorations and the gingiva</h4>
<ul>
<li>Supragingival margins are the easiest to keep healthy</li>
<li>A rough or overhanging subgingival margin: <b>finish it if possible, otherwise remake</b></li>
<li>Residual cement causes localised inflammation: <b>remove it and debride</b></li>
<li>If a crown margin is good but plaque is heavy around many teeth, the problem is <b>plaque and periodontal disease</b>, not the crown</li>
<li>Lingering thermal pain and percussion tenderness with healthy gingiva point to <b>pulpal and apical disease</b></li>
<li>An open contact allows food impaction and local breakdown</li>
</ul>
<h4 class="deck-topic">Orthodontics</h4>
<ul>
<li>Teeth should be moved only with <b>controlled inflammation</b>: disease control first, then orthodontics, then any further correction</li>
<li>When teeth separate, the interdental gingiva <b>remodels</b> over the underlying bone</li>
<li>Moving a root outside the bone envelope, especially with thin tissue, risks recession</li>
<li>For a future implant, create the space <b>and correct the root positions</b> before placement</li>
</ul>
<h4 class="deck-topic">Occlusal trauma</h4>
<ul>
<li>Occlusal trauma alone does not start gingivitis or pockets; with periodontitis it may add to mobility and breakdown</li>
<li><b>Primary</b>: excessive force on normal support. <b>Secondary</b>: normal or excessive force on reduced support</li>
</ul>
<h4 class="deck-topic">Peri-implant disease</h4>
<div class="deck-block deck-tbl"><table>
<thead><tr><th>Condition</th><th>Findings</th><th>Initial care</th></tr></thead>
<tbody>
<tr><td><b>Mucositis</b></td><td>Bleeding or suppuration, <b>no progressive bone loss</b></td><td>Mechanical debridement and hygiene; check cement and prosthesis cleansability</td></tr>
<tr><td><b>Peri-implantitis</b></td><td>Inflammation <b>with progressive bone loss</b></td><td>Debridement and risk control, often surgery</td></tr>
</tbody></table></div>
<ul>
<li>Compare with baseline probing and radiographs taken after the prosthesis was fitted</li>
<li>Maintenance is essential, especially with a history of periodontitis or smoking</li>
</ul>
<h4 class="deck-topic">Root fracture</h4>
<ul>
<li>A root-filled tooth with a post, an isolated narrow pocket and a confirmed vertical fracture is <b>hopeless</b></li>
</ul>
<div class="sum-key"><span class="sum-key-title">نقاط امتحانية</span><ul>
<li>No bone loss around an inflamed implant means mucositis.</li>
<li>Periodontal health comes before orthodontic movement.</li>
<li>Faulty margins are a treatable local factor.</li>
<li>Separate pulpal from periodontal pain with pulp tests.</li>
</ul></div>
`,
            questions: [
                {
                    "q": "A crown margin is rough and overhanging below the gingiva. Floss catches, and inflammation is localized to that surface. What is the appropriate treatment?",
                    "options": [
                        "Finish the margin if feasible or remake the crown",
                        "Leave the overhang and prescribe rinse only",
                        "Extract the tooth immediately",
                        "Perform internal bleaching"
                    ],
                    "answer": 0,
                    "explanation": "A rough or overhanging margin retains plaque and cannot be corrected with medication alone. The defective surface must be made cleansable and the periodontal tissues treated. Reference: Newman MG, Takei HH, Klokkevold PR, Carranza FA, eds. Carranza's Clinical Periodontology. 13th ed. Iatrogenic restorative factors; Rosenstiel SF, et al. Contemporary Fixed Prosthodontics. 6th ed.",
                    "source": "SDLE bank"
                },
                {
                    "q": "Localized marginal erythema and bleeding persist beside a new crown. A radiograph shows residual subgingival cement, while other sites are healthy. What is the primary management?",
                    "options": [
                        "Prescribe antifungal therapy",
                        "Remove the residual cement and debride the site",
                        "Perform root canal treatment",
                        "Observe without correcting the cause"
                    ],
                    "answer": 1,
                    "explanation": "Retained subgingival cement is a plaque-retentive local irritant and should be removed. Crown contour, margin location, contact, probing, occlusion, and implant or tooth status should also be evaluated. Reference: Newman MG, Takei HH, Klokkevold PR, Carranza FA, eds. Carranza's Clinical Periodontology. 13th ed. Restorative local factors and periodontal inflammation.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A recent implant has a 5-mm inflamed peri-implant pocket without documented progressive bone loss. What is the appropriate initial management?",
                    "options": [
                        "Local antibiotics alone",
                        "Implant removal",
                        "Mechanical debridement and hygiene reinforcement",
                        "Bone graft before diagnosis"
                    ],
                    "answer": 2,
                    "explanation": "Peri-implant mucosal inflammation is initially managed by disrupting biofilm, correcting plaque- retentive factors, and reinforcing self-care; antimicrobials are selective adjuncts. Reference: Berglundh T et al. Peri-implant diseases and conditions: consensus report. J Clin Periodontol. 2018;45(Suppl 20):S286-S291.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A patient needs orthodontic movement and an implant in the same edentulous region. What is the usual sequencing principle?",
                    "options": [
                        "Complete space development and root positioning before implant placement",
                        "Place the implant before deciding final tooth positions",
                        "Move the osseointegrated implant orthodontically",
                        "Ignore restorative space requirements"
                    ],
                    "answer": 0,
                    "explanation": "An osseointegrated implant does not move orthodontically like a tooth, so adjacent roots and prosthetic space should be established first. Implant timing also depends on growth completion, bone anatomy, and the restorative plan. Reference: Proffit WR, Fields HW, Larson B, Sarver DM. Contemporary Orthodontics. 6th ed. Orthodontic-implant coordination; Misch CE. Contemporary Implant Dentistry. 3rd ed. Interdisciplinary implant planning.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A crown is well contoured with a supragingival margin and no residual cement. Generalized inflammation is present around many teeth with heavy plaque. What is the primary treatment?",
                    "options": [
                        "Replace the single crown",
                        "Perform endodontic surgery",
                        "Comprehensive plaque control and periodontal therapy",
                        "Add subgingival crown contour"
                    ],
                    "answer": 2,
                    "explanation": "Generalized plaque-associated inflammation with no local crown defect should be managed as periodontal disease. Replacing a sound crown does not address the generalized cause. Reference: Newman MG, Takei HH, Klokkevold PR, Carranza FA, eds. Carranza's Clinical Periodontology. 13th ed. Plaque-induced gingivitis and initial therapy.",
                    "source": "SDLE bank"
                }
            ],
        },
    ],
};

export default dentalPeriodontics;
