// AUTO-COPIED from my-react-app/src/components/summaries/content/dentalRestorativeDentistry.js. Do not edit here:
// change the website's file, then run `npm run sync:summaries` in mobile/.
// Restorative Dentistry — dental-track section of the summaries catalog.
// Mirrored for the slide viewer in backend/content/summaryHtml (keep the two in sync).
// Inline questions are copied from the SQB bank.
const dentalRestorativeDentistry = {
    id: "restorative-dentistry",
    title: "Restorative Dentistry",
    title_en: "SDLE Review — 9 Topics",
    icon: "shield-check",
    accent: "#38bdf8",
    intro: "Operative and restorative dentistry revision for SDLE: Caries Risk and Early Lesions · Deep Caries and Pulp Protection · Preparation and Instruments · Amalgam · Composite, Glass Ionomer and Bonding · Contacts, Margins and Occlusion · Isolation and Positioning · Restoring Cracked and Root-Filled Teeth · Tooth Wear, Defects and Bleaching.",
    subtopics: [
        {
            id: "rd-caries",
            title: "01 — Caries Risk and Early Lesions",
            title_en: "Activity · risk · non-invasive care",
            summaryHtml: `
<h4 class="deck-topic">The process</h4>
<ul>
<li>Caries is a <b>biofilm and sugar dependent</b> disease: acid shifts the balance from remineralisation to demineralisation</li>
<li>Critical pH is about <b>5.5 for enamel</b> and higher (about 6.2 to 6.7) for root dentin, so exposed roots are more vulnerable</li>
<li><i>Mutans streptococci</i> are linked with initiation; <i>lactobacilli</i> with progression</li>
</ul>
<h4 class="deck-topic">Judge each lesion twice</h4>
<div class="deck-block deck-tbl"><table>
<thead><tr><th>Question</th><th>Active</th><th>Arrested</th></tr></thead>
<tbody>
<tr><td>Enamel</td><td>Chalky, rough, matt white spot near plaque</td><td>Shiny, smooth, may be brown</td></tr>
<tr><td>Root</td><td>Soft or leathery</td><td>Hard, often dark and smooth</td></tr>
<tr><td>Care</td><td>Control the disease</td><td>Maintain and monitor</td></tr>
</tbody></table></div>
<p>The second question is whether it is <b>cavitated</b> (cannot be cleaned, usually needs restoring) or non-cavitated (can usually be arrested).</p>
<h4 class="deck-topic">Risk assessment</h4>
<ul>
<li>Combine past and present caries, diet, saliva flow, fluoride exposure, plaque control, medical and social factors. No single finding is enough</li>
<li>New or active lesions and low saliva are strong warnings. <b>Mild dental fluorosis</b> alone does not mean high risk</li>
</ul>
<h4 class="deck-topic">Non-invasive and micro-invasive care</h4>
<ul>
<li>Plaque control with fluoride toothpaste, less frequent sugar, professional <b>topical fluoride</b> (varnish)</li>
<li>Sealants for susceptible pits and fissures; resin infiltration for selected proximal lesions</li>
<li>White spots after orthodontics: oral hygiene and fluoride first</li>
<li>An older adult with an arrested, asymptomatic root lesion: fluoride and monitoring, no drilling</li>
<li>Community level: <b>water fluoridation</b> reaches the most people at low cost</li>
<li>The <b>first permanent molars</b> are at early risk because of deep fissures and early eruption</li>
</ul>
<div class="sum-algo"><span class="sum-algo-title">Restore or not?</span><ol>
<li>Assess activity, cavitation, depth and cleansability</li>
<li>Non-cavitated and cleansable: arrest and review</li>
<li>Cavitated, progressing or not cleansable: restore, and still control the cause</li>
</ol></div>
<div class="sum-key"><span class="sum-key-title">نقاط امتحانية</span><ul>
<li>Non-cavitated lesion: fluoride, plaque control and monitoring.</li>
<li>Risk comes from the whole picture, not one sign.</li>
<li>A restoration treats the cavity, not the disease.</li>
<li>Mandibular first molars are among the earliest permanent teeth attacked.</li>
</ul></div>
`,
            questions: [
                {
                    "q": "A proximal white-spot lesion is noncavitated and has no radiographic dentin involvement. What is the preferred initial management?",
                    "options": [
                        "Topical fluoride and monitoring",
                        "Glass-ionomer restoration",
                        "Full-coverage crown",
                        "Endodontic treatment"
                    ],
                    "answer": 0,
                    "explanation": "A noncavitated enamel lesion is managed nonoperatively with fluoride, plaque and diet control, and periodic activity assessment rather than immediate drilling. Reference: American Dental Association. Evidence-based clinical practice guideline on nonrestorative treatments for carious lesions. 2018.",
                    "source": "SDLE bank"
                },
                {
                    "q": "An older adult has an arrested, noncavitated root-caries lesion that is hard and asymptomatic. What is the preferred management?",
                    "options": [
                        "Topical fluoride and monitoring",
                        "Systemic fluoride",
                        "Composite restoration",
                        "Glass-ionomer restoration"
                    ],
                    "answer": 0,
                    "explanation": "An arrested cleansable root lesion does not require operative restoration; topical fluoride, plaque control, risk management, and review are appropriate. Reference: American Dental Association. Evidence-based recommendations for nonrestorative treatment of root caries.",
                    "source": "SDLE bank"
                },
                {
                    "q": "Multiple noncavitated white-spot lesions are present after orthodontic appliance removal. What is the preferred initial management?",
                    "options": [
                        "Improve plaque control and apply topical fluoride",
                        "Restore every lesion",
                        "Perform bleaching immediately",
                        "No preventive care"
                    ],
                    "answer": 0,
                    "explanation": "Initial care aims to arrest and remineralize noncavitated lesions through effective plaque control and topical fluoride before considering minimally invasive esthetic treatment. Reference: American Dental Association. Evidence-based clinical recommendations for nonrestorative treatment of carious lesions. Fejerskov O, Nyvad B, Kidd E. Dental Caries: The Disease and Its Clinical Management.",
                    "source": "SDLE bank"
                },
                {
                    "q": "Which isolated finding does not by itself establish a high caries-risk classification?",
                    "options": [
                        "Multiple new cavitated lesions",
                        "Mild stable dental fluorosis",
                        "Marked hyposalivation",
                        "Recent smooth-surface caries"
                    ],
                    "answer": 1,
                    "explanation": "Fluorosis records a past developmental fluoride exposure and is not itself proof of current caries activity. Current disease, saliva, diet, biofilm, fluoride protection, and socioeconomic or behavioral factors must be assessed. Reference: Fejerskov O, Nyvad B, Kidd E, eds. Dental Caries. 3rd ed. Caries-risk assessment and fluorosis.",
                    "source": "SDLE bank"
                },
                {
                    "q": "Which permanent tooth is most commonly affected by caries early after eruption?",
                    "options": [
                        "Maxillary first molar",
                        "Mandibular first molar",
                        "Maxillary canine",
                        "Mandibular incisor"
                    ],
                    "answer": 1,
                    "explanation": "Mandibular first permanent molars erupt early and have plaque-retentive pits and fissures, making them especially caries prone. Reference: Fejerskov O, Nyvad B, Kidd E. Dental Caries: The Disease and Its Clinical Management. Tooth-specific caries patterns.",
                    "source": "SDLE bank"
                }
            ],
        },
        {
            id: "rd-deep",
            title: "02 — Deep Caries and Pulp Protection",
            title_en: "Selective removal · liners · sandwich",
            summaryHtml: `
<h4 class="deck-topic">Dentin responses</h4>
<ul>
<li><b>Reactionary</b> tertiary dentin: surviving odontoblasts lay it down after a mild stimulus</li>
<li><b>Reparative</b> tertiary dentin: a strong injury destroys the odontoblasts and newly differentiated cells form it</li>
<li>Sclerotic dentin has occluded tubules and lower permeability</li>
</ul>
<h4 class="deck-topic">Selective caries removal</h4>
<p>For a deep lesion in a vital tooth with a normal pulp or reversible pulpitis, the aim is a sealed restoration without exposing the pulp.</p>
<div class="sum-algo"><span class="sum-algo-title">Order of excavation</span><ol>
<li>Start at the <b>periphery</b>: leave sound enamel and hard dentin margins for the seal</li>
<li>Clean the axial and surrounding walls</li>
<li>Over the pulp, stop at soft or firm dentin, depending on depth, to avoid exposure</li>
<li>Restore with a <b>well-sealed</b> restoration and review the pulp</li>
</ol></div>
<ul>
<li><b>Stepwise excavation</b> does this in two visits, with a temporary seal between them</li>
<li>Spontaneous or lingering pain confirmed as irreversible pulpitis: a liner will not solve it; endodontic treatment (or a suitable vital pulp therapy) is needed</li>
<li><b>Atraumatic restorative treatment</b>: hand excavation and high-viscosity glass ionomer</li>
</ul>
<h4 class="deck-topic">Liners and bases</h4>
<div class="deck-block deck-tbl"><table>
<thead><tr><th>Material</th><th>Role and caution</th></tr></thead>
<tbody>
<tr><td><b>Calcium hydroxide</b></td><td>High pH, stimulates tertiary dentin. Weak and soluble: use only on the deepest spot and cover it with RMGI</td></tr>
<tr><td><b>Calcium silicates (MTA type)</b></td><td>Bioactive; direct contact with pulp is acceptable</td></tr>
<tr><td><b>Glass ionomer / RMGI</b></td><td>Chemical bond, fluoride release, good dentin liner or base</td></tr>
<tr><td><b>Zinc oxide eugenol</b></td><td>Sedative, but eugenol <b>inhibits resin polymerisation</b>; clean it off thoroughly or choose a non-eugenol material before bonding</td></tr>
</tbody></table></div>
<h4 class="deck-topic">Sandwich technique</h4>
<ul>
<li>GIC or RMGI replaces dentin (and in the <b>open</b> sandwich reaches the gingival margin); composite covers it for strength and appearance</li>
<li>Useful for a deep margin on dentin where bonding is less reliable and fluoride release helps</li>
</ul>
<div class="sum-key"><span class="sum-key-title">نقاط امتحانية</span><ul>
<li>Excavate the peripheral walls first.</li>
<li>Calcium hydroxide: dentin bridge induction; keep it small and cover it.</li>
<li>Eugenol interferes with resin curing.</li>
<li>Destroyed odontoblasts are followed by reparative dentin.</li>
</ul></div>
`,
            questions: [
                {
                    "q": "During selective caries removal in a deep lesion, where should excavation begin?",
                    "options": [
                        "Deep pulpal floor first",
                        "Pulp horn first",
                        "No peripheral caries removal",
                        "Peripheral and axial walls first"
                    ],
                    "answer": 3,
                    "explanation": "Establishing hard peripheral enamel and dentin permits a durable seal while the deepest pulpal dentin is managed conservatively. Reference: American Dental Association. Evidence-based guideline on restorative treatments for carious lesions.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A deep carious lesion in a mature permanent tooth is removed selectively. A thin layer of affected dentin remains near the pulp, but there is no pulp exposure and the tooth has a normal or reversible pulpal diagnosis. What is the key requirement for the definitive restoration?",
                    "options": [
                        "Complete caries removal over the pulp",
                        "A well-sealed coronal restoration",
                        "Calcium hydroxide without a definitive restoration",
                        "Leaving unsupported peripheral enamel"
                    ],
                    "answer": 1,
                    "explanation": "Selective caries removal near the pulp aims to reduce exposure risk while obtaining sound peripheral margins for a durable seal. The restorative material is chosen from the site, load, isolation, and remaining structure rather than lesion depth alone. Reference: Ritter AV, Boushell LW, Walter R, eds. Sturdevant's Art and Science of Operative Dentistry. 7th ed. Selective caries removal and restoration; Fejerskov O, Nyvad B, Kidd E, eds. Dental Caries. 3rd ed.",
                    "source": "SDLE bank"
                },
                {
                    "q": "During restoration of a very deep Class V lesion with less than 0.5 mm of remaining dentin and no pulp exposure, what is the most appropriate pulpal protection?",
                    "options": [
                        "Calcium hydroxide at the deepest site with an RMGI cover",
                        "Conventional GIC alone",
                        "No liner",
                        "Zinc oxide-eugenol"
                    ],
                    "answer": 0,
                    "explanation": "In a very deep preparation, calcium hydroxide is confined to the deepest pulpal area and may be protected with resin-modified glass ionomer before definitive restoration. Reference: Ritter AV et al. Sturdevant's Art and Science of Operative Dentistry. Pulp protection.",
                    "source": "SDLE bank"
                },
                {
                    "q": "Which biologic property distinguishes calcium hydroxide as a pulp-protective liner?",
                    "options": [
                        "High compressive strength",
                        "Strong enamel bonding",
                        "Fluoride recharge",
                        "Tertiary dentin induction"
                    ],
                    "answer": 3,
                    "explanation": "Calcium hydroxide can stimulate a mineralized reparative barrier at the pulp-dentin interface; the new tissue is tertiary rather than physiologic secondary dentin. Reference: Hilton TJ. Keys to clinical success with pulp capping. Oper Dent. 2009;34:615-625.",
                    "source": "SDLE bank"
                },
                {
                    "q": "After obturation with an eugenol-containing sealer, why should residual sealer be removed from cavity walls before a bonded composite restoration?",
                    "options": [
                        "Eugenol increases enamel etching",
                        "Eugenol can inhibit resin polymerization",
                        "Eugenol strengthens the adhesive layer",
                        "Eugenol releases fluoride"
                    ],
                    "answer": 1,
                    "explanation": "Residual eugenol on bonding surfaces can interfere with free-radical polymerization and reduce resin bond performance, so contaminated dentin and enamel are cleaned before adhesion. Reference: Carvalho CN et al. Effect of eugenol-containing endodontic sealer on resin bonding. J Endod. Adhesive interactions with eugenol.",
                    "source": "SDLE bank"
                }
            ],
        },
        {
            id: "rd-prep",
            title: "03 — Cavity Preparation and Instruments",
            title_en: "Black classes · design · hand instruments",
            summaryHtml: `
<h4 class="deck-topic">G.V. Black classes</h4>
<div class="deck-block deck-tbl"><table>
<thead><tr><th>Class</th><th>Site</th></tr></thead>
<tbody>
<tr><td>I</td><td>Pits and fissures</td></tr>
<tr><td>II</td><td>Proximal surfaces of posterior teeth</td></tr>
<tr><td>III</td><td>Proximal anterior, incisal angle intact</td></tr>
<tr><td>IV</td><td>Proximal anterior involving the incisal angle</td></tr>
<tr><td>V</td><td>Gingival third of facial or lingual surfaces</td></tr>
<tr><td>VI (later addition)</td><td>Cusp tips and incisal edges</td></tr>
</tbody></table></div>
<h4 class="deck-topic">Design differs with the material</h4>
<ul>
<li><b>Amalgam</b>: needs mechanical retention, enough bulk and a cavosurface margin of about <b>90 degrees</b>; walls converge occlusally for retention; unsupported enamel is removed</li>
<li><b>Cast or ceramic inlay / onlay</b>: walls <b>diverge occlusally</b> so the piece can seat without undercuts</li>
<li><b>Composite</b>: conservative, defect-driven. A facial enamel bevel on anterior restorations <b>increases bonding area</b> and blends the shade</li>
<li>Thin, unsupported or undermined cusps need coverage rather than a large intracoronal filling</li>
</ul>
<h4 class="deck-topic">Hand instruments</h4>
<div class="deck-block deck-tbl"><table>
<thead><tr><th>Instrument</th><th>Main use</th></tr></thead>
<tbody>
<tr><td><b>Enamel hatchet</b></td><td>Planing and cleaving unsupported enamel on facial and lingual proximal walls</td></tr>
<tr><td><b>Gingival margin trimmer</b></td><td>Bevelling the gingival enamel margin and rounding the axiopulpal line angle; comes in mesial and distal pairs</td></tr>
<tr><td><b>Spoon excavator</b></td><td>Removing soft carious dentin</td></tr>
<tr><td><b>Chisel</b></td><td>Splitting and planing enamel</td></tr>
</tbody></table></div>
<h4 class="deck-topic">Rotary cutting</h4>
<ul>
<li>Bring a carbide bur to <b>operating speed before it touches the tooth</b> and use light intermittent pressure</li>
<li>Use air-water spray: heat can injure the pulp</li>
<li>Carbide burs cut by blades and give a smoother surface; diamonds grind and are preferred for ceramics and enamel reduction</li>
<li>Pain during cutting within enamel near the junction is often attributed to <b>enamel spindles</b>, odontoblast processes crossing into enamel</li>
</ul>
<div class="sum-key"><span class="sum-key-title">نقاط امتحانية</span><ul>
<li>Conventional amalgam margin: about 90 degree butt joint.</li>
<li>Inlay walls diverge occlusally.</li>
<li>Gingival margin trimmer: gingival floor of the proximal box.</li>
<li>Enamel hatchet: unsupported enamel on proximal walls.</li>
</ul></div>
`,
            questions: [
                {
                    "q": "What cavosurface configuration is required for the occlusal margin of a conventional Class I amalgam preparation?",
                    "options": [
                        "A long enamel bevel",
                        "An approximately 90-degree butt joint",
                        "A feather-edge margin",
                        "A knife-edge finish line"
                    ],
                    "answer": 1,
                    "explanation": "Amalgam requires adequate bulk at the margin, so the preparation should create a butt-joint relationship with supported enamel rods. Beveling the occlusal enamel would leave a thin weak amalgam edge. Reference: Ritter AV, Boushell LW, Walter R, eds. Sturdevant's Art and Science of Operative Dentistry. 7th ed. Amalgam tooth preparation and cavosurface margins.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A planned proximal amalgam is converted to an indirect onlay because the marginal ridge is too weak. How should opposing proximal walls be prepared for the restoration's path of insertion?",
                    "options": [
                        "Converge occlusally",
                        "Create undercuts",
                        "Diverge occlusally",
                        "Keep severe axial convergence"
                    ],
                    "answer": 2,
                    "explanation": "An indirect onlay requires removal of undercuts and slight occlusal divergence of opposing walls so the restoration can seat along one path of insertion. Reference: Rosenstiel SF, Land MF, Fujimoto J. Contemporary Fixed Prosthodontics. Partial-coverage restorations.",
                    "source": "SDLE bank"
                },
                {
                    "q": "Which hand instrument is specifically angled to bevel or refine the gingival enamel margin of a proximal box?",
                    "options": [
                        "Straight chisel",
                        "Spoon excavator",
                        "Burnisher",
                        "Gingival margin trimmer"
                    ],
                    "answer": 3,
                    "explanation": "Gingival margin trimmers are modified enamel hatchets with curved blades and angled cutting edges designed for gingival margin refinement. Right and left pairs are selected according to the proximal box and direction of cutting. Reference: Ritter AV, Boushell LW, Walter R, eds. Sturdevant's Art and Science of Operative Dentistry. 7th ed. Gingival margin trimmers and hand instruments.",
                    "source": "SDLE bank"
                },
                {
                    "q": "Which hand instrument is designed to plane enamel walls and cleave unsupported enamel during cavity preparation?",
                    "options": [
                        "Spoon excavator",
                        "Discoid carver",
                        "Enamel hatchet",
                        "Amalgam condenser"
                    ],
                    "answer": 2,
                    "explanation": "The enamel hatchet has a cutting edge aligned for cleaving and planing enamel. A spoon excavator removes softened dentin, while carvers and condensers manipulate restorative material. Reference: Ritter AV, Boushell LW, Walter R, eds. Sturdevant's Art and Science of Operative Dentistry. 7th ed. Hand-cutting instruments.",
                    "source": "SDLE bank"
                },
                {
                    "q": "How should a carbide bur be brought into contact with tooth structure for efficient cutting?",
                    "options": [
                        "Start the handpiece after contact",
                        "Use heavy continuous pressure",
                        "Reach operating speed before contact",
                        "Keep the bur stationary"
                    ],
                    "answer": 2,
                    "explanation": "Bringing the rotating bur to operating speed before tooth contact promotes efficient cutting and reduces grabbing or chatter. Reference: Ritter AV et al. Sturdevant's Art and Science of Operative Dentistry. Rotary cutting instruments.",
                    "source": "SDLE bank"
                }
            ],
        },
        {
            id: "rd-amalgam",
            title: "04 — Amalgam: Handling, Retention and Failure",
            title_en: "Trituration · pins · repair or replace",
            summaryHtml: `
<h4 class="deck-topic">Handling</h4>
<ul>
<li>Triturate as directed, then condense <b>promptly</b>. A delayed mix loses plasticity, adapts poorly, traps voids and ends up weaker</li>
<li>Condense in small increments with firm force; overfill, then burnish and carve to bring mercury-rich material off the surface</li>
<li><b>High-copper</b> alloys largely eliminate the weak gamma-2 (tin-mercury) phase, so they creep and corrode less</li>
<li>Moisture contamination of a <b>zinc-containing</b> alloy can cause <b>delayed expansion</b> with pain and marginal protrusion</li>
</ul>
<h4 class="deck-topic">Pins and auxiliary retention</h4>
<ul>
<li>Prefer slots, boxes and bonding where possible; pins add stress and crazing and do not strengthen the amalgam</li>
<li>Typical self-threading pin: about <b>2 mm in dentin and 2 mm in amalgam</b>, inside the dentin-enamel junction, following the external surface to avoid pulp or periodontal perforation</li>
<li>Pulling out of dentin suggests <b>inadequate depth</b> or a faulty pinhole</li>
</ul>
<h4 class="deck-topic">Pain after a new filling</h4>
<div class="deck-block deck-tbl"><table>
<thead><tr><th>Clue</th><th>Likely cause</th></tr></thead>
<tbody>
<tr><td>Pain on biting right after placement, high mark</td><td><b>High contact</b>: adjust occlusion</td></tr>
<tr><td>Brief electric shock on touching a dissimilar metal</td><td><b>Galvanic current</b>; usually settles</td></tr>
<tr><td>Short cold sensitivity that is improving</td><td>Dentin sensitivity: review</td></tr>
<tr><td>Spontaneous, lingering pain</td><td>Pulpal disease: test the pulp</td></tr>
</tbody></table></div>
<h4 class="deck-topic">Repair or replace</h4>
<div class="sum-algo"><span class="sum-algo-title">Decision</span><ol>
<li>Small localised marginal defect, rest sound, no deep caries: <b>repair</b></li>
<li>Extensive recurrent caries or leakage: <b>remove</b>, excavate and reassess what tooth remains</li>
<li>Weak or fractured cusp found: change the design to cuspal coverage</li>
<li>Do not replace a sound restoration just for age or surface staining</li>
</ol></div>
<div class="sum-key"><span class="sum-key-title">نقاط امتحانية</span><ul>
<li>Condense soon after mixing.</li>
<li>High-copper alloy means little or no gamma-2.</li>
<li>Electric-type shock after amalgam: galvanism.</li>
<li>Localised defect: repair is the conservative choice.</li>
</ul></div>
`,
            questions: [
                {
                    "q": "What is the consequence of delaying amalgam condensation until eight minutes after trituration?",
                    "options": [
                        "Easier carving",
                        "Residual mercury increases",
                        "Strength increases",
                        "The mix loses plasticity and sets"
                    ],
                    "answer": 3,
                    "explanation": "Condensation must occur within the manufacturer's working time; a prolonged delay allows crystallization to progress, preventing adequate condensation and adaptation. Reference: Anusavice KJ, Shen C, Rawls HR. Phillips' Science of Dental Materials. Dental amalgam manipulation and working time.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A pin-retained amalgam restoration fails after the pin was placed only 0.5 mm into dentin. What is the most likely technical cause?",
                    "options": [
                        "Parallel pin placement",
                        "Placement near the CEJ",
                        "Inadequate pin depth",
                        "Absence of an enamel bevel"
                    ],
                    "answer": 2,
                    "explanation": "A pin embedded only 0.5 mm in dentin lacks adequate engagement; traditional self-threading pin designs generally require about 2 mm of dentinal depth when anatomy permits. Reference: Ritter AV et al. Sturdevant's Art and Science of Operative Dentistry. Pin-retained restorations.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A patient experiences a brief electric-shock sensation only when a newly placed gold onlay contacts an opposing amalgam restoration. Pulp and occlusal tests are otherwise normal. What is the most likely explanation?",
                    "options": [
                        "Acute apical abscess",
                        "Gold hypersensitivity",
                        "Galvanic current",
                        "Vertical root fracture"
                    ],
                    "answer": 2,
                    "explanation": "Contact between dissimilar metallic restorations in saliva can generate a transient galvanic current perceived as a sharp electric sensation. Persistent symptoms require reassessment of the restorations and pulp rather than assuming infection. Reference: Ritter AV, Boushell LW, Walter R, eds. Sturdevant's Art and Science of Operative Dentistry. 7th ed. Dental amalgam and interactions between dissimilar metals.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A large amalgam restoration has a small localized marginal fracture. The remaining restoration is sound, there is no caries, and the tooth is asymptomatic. What is the most conservative treatment?",
                    "options": [
                        "Replace the restoration",
                        "Place a full crown",
                        "Extract the tooth",
                        "Repair the defect"
                    ],
                    "answer": 3,
                    "explanation": "Localized repair preserves sound tooth structure and avoids unnecessarily enlarging the preparation. The cause and extent of the defect must be assessed before repair. Reference: FDI World Dental Federation. Repair of Restorations. Policy Statement. 2019; Hickel R, et al. Revised FDI criteria for evaluating direct and indirect dental restorations. Clin Oral Investig. 2023;27:2573-2591.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A premolar becomes tender when chewing immediately after cementation of a gold onlay. Thermal responses are normal, the radiograph is unremarkable, and articulating film shows a premature contact on the restoration. What is the best treatment?",
                    "options": [
                        "Adjust the occlusion",
                        "Apply topical fluoride",
                        "Remove the pulp",
                        "Prescribe an antibiotic"
                    ],
                    "answer": 0,
                    "explanation": "A premature contact can inflame the periodontal ligament and cause biting tenderness despite a healthy pulp. Selective correction of the confirmed interference is the appropriate first step. Reference: Ritter AV, Boushell LW, Walter R, eds. Sturdevant's Art and Science of Operative Dentistry. 7th ed. Occlusal assessment of indirect restorations.",
                    "source": "SDLE bank"
                }
            ],
        },
        {
            id: "rd-composite",
            title: "05 — Composite, Glass Ionomer and Bonding",
            title_en: "Material choice · adhesion · contamination",
            summaryHtml: `
<h4 class="deck-topic">Adhesion basics</h4>
<ul>
<li>Enamel: phosphoric acid creates microporosities for <b>micromechanical</b> retention; enamel bonding is the most reliable</li>
<li>Dentin: the bond relies on a <b>hybrid layer</b>. Total-etch systems need moist (not wet, not desiccated) dentin; self-etch systems modify the smear layer</li>
<li><b>Blood, saliva or crevicular fluid</b> is a major threat. If isolation cannot be achieved, a bonded restoration is at risk; re-treat a contaminated surface</li>
</ul>
<h4 class="deck-topic">Controlling polymerisation shrinkage</h4>
<ul>
<li>Place increments (or follow bulk-fill instructions), keep the light close and cure for long enough</li>
<li>The C-factor (bonded to unbonded surfaces) is highest in a box-like Class I, which raises stress</li>
<li>Shrinkage stress can give gaps, sensitivity and cusp flexure</li>
</ul>
<div class="deck-block deck-tbl"><table>
<thead><tr><th>Material</th><th>Strengths</th><th>Typical use</th></tr></thead>
<tbody>
<tr><td><b>Resin composite</b></td><td>Best direct aesthetics, polishable, conservative</td><td>Anterior and small to moderate posterior cavities</td></tr>
<tr><td><b>Flowable composite</b></td><td>Wets irregularities; thin tip reduces trapped air. Less filler, more shrinkage</td><td>Preventive resin restorations, small areas</td></tr>
<tr><td><b>Conventional GIC</b></td><td>Chemical bond, fluoride release; weak, moisture sensitive early</td><td>Root caries, ART, interim restorations</td></tr>
<tr><td><b>RMGIC</b></td><td>Light cure, better strength and handling than GIC, still releases fluoride</td><td>Cervical and root lesions in high caries risk, liners, sandwich</td></tr>
<tr><td><b>Amalgam</b></td><td>Tolerant technique, durable</td><td>Posterior where aesthetics is not required, following current mercury rules</td></tr>
</tbody></table></div>
<h4 class="deck-topic">Choosing for cervical and root lesions</h4>
<ul>
<li>High caries activity or difficult moisture control: RMGIC</li>
<li>Visible surface, isolation good, risk controlled: composite</li>
<li>A progressed root lesion with pulp necrosis in a restorable, supported tooth: root canal treatment then restoration</li>
</ul>
<h4 class="deck-topic">Sealants</h4>
<ul>
<li>Retention depends first on <b>clean, etched, dry enamel</b>. A bonding agent under the sealant can help, especially when contamination is a risk</li>
</ul>
<div class="sum-key"><span class="sum-key-title">نقاط امتحانية</span><ul>
<li>Contamination is the quickest way to lose a bond.</li>
<li>Fluoride release plus chemical bond points to glass ionomer materials.</li>
<li>Composite gives the best direct aesthetic polish.</li>
<li>Flowable gains adaptation at the cost of more shrinkage.</li>
</ul></div>
`,
            questions: [
                {
                    "q": "During a Class II composite restoration adjacent to inflamed gingiva, what most directly threatens adhesive success?",
                    "options": [
                        "Increased filler loading",
                        "Reduced curing-light output from gingivitis",
                        "Accelerated composite setting",
                        "Blood or crevicular-fluid contamination"
                    ],
                    "answer": 3,
                    "explanation": "Moisture and blood contamination of conditioned enamel or dentin can reduce adhesive bond quality and marginal seal; it does not beneficially alter polymerization shrinkage. Reference: Ritter AV et al. Sturdevant's Art and Science of Operative Dentistry. Isolation and adhesive contamination.",
                    "source": "SDLE bank"
                },
                {
                    "q": "After removal of recurrent cervical caries, the proximal margin lies on root dentin and moisture control is challenging. The patient has high caries activity and limited occlusal loading at the margin. Which material is generally suitable?",
                    "options": [
                        "Resin-modified glass ionomer",
                        "Feldspathic porcelain",
                        "Zinc phosphate cement",
                        "Unfilled resin sealant"
                    ],
                    "answer": 0,
                    "explanation": "Resin-modified glass ionomer chemically adheres to dentin, releases fluoride, and is relatively tolerant of challenging cervical conditions. The remaining occlusal portion may require a different material in a sandwich design. Reference: Ritter AV, Boushell LW, Walter R, eds. Sturdevant's Art and Science of Operative Dentistry. 7th ed. Glass-ionomer and sandwich restorations.",
                    "source": "SDLE bank"
                },
                {
                    "q": "What is the main placement advantage of a flowable composite in a small preventive resin restoration?",
                    "options": [
                        "Greater filler content",
                        "Lower polymerization shrinkage",
                        "Better adaptation to irregular surfaces",
                        "Greater fracture toughness"
                    ],
                    "answer": 2,
                    "explanation": "Low viscosity improves wetting and adaptation in small conservative preparations, although flowable composites generally contain less filler and may shrink more than packable materials. Reference: Ritter AV et al. Sturdevant's Art and Science of Operative Dentistry. Flowable resin composites.",
                    "source": "SDLE bank"
                },
                {
                    "q": "Which material generally provides superior color matching and polishability for an anterior esthetic restoration?",
                    "options": [
                        "Conventional GIC",
                        "Zinc phosphate",
                        "Resin composite",
                        "Calcium hydroxide"
                    ],
                    "answer": 2,
                    "explanation": "Modern resin composites offer a wider range of shades, translucencies, and surface polish than conventional GIC. They require meticulous bonding and moisture control. Reference: Ritter AV, Boushell LW, Walter R, eds. Sturdevant's Art and Science of Operative Dentistry. 7th ed. Resin composites and glass ionomers.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A small cavitated root lesion is on a visible facial surface. Rubber-dam isolation is excellent, the margin is accessible, caries risk is controlled, and the patient has high esthetic demand. Which material is appropriate?",
                    "options": [
                        "Resin composite",
                        "Resin-modified glass ionomer",
                        "Conventional glass ionomer",
                        "Dental amalgam"
                    ],
                    "answer": 0,
                    "explanation": "Composite can provide superior esthetics and polish when the cervical field is reliably isolated and a durable adhesive margin can be produced. It offers less fluoride release and is more technique-sensitive than glass ionomer. Reference: Ritter AV, Boushell LW, Walter R, eds. Sturdevant's Art and Science of Operative Dentistry. 7th ed. Cervical composite and glass- ionomer selection.",
                    "source": "SDLE bank"
                }
            ],
        },
        {
            id: "rd-contacts",
            title: "06 — Contacts, Margins and Occlusion",
            title_en: "Food impaction · overhang · tissue attachment",
            summaryHtml: `
<h4 class="deck-topic">Class II set-up</h4>
<ul>
<li>A <b>matrix</b> recreates the proximal wall; a <b>wedge</b> seals the gingival margin, prevents overhang and separates the teeth slightly</li>
<li>For composite, a sectional matrix with a separating ring helps form a tight, curved contact</li>
<li>A deep or concave gingival margin needs a wedge shaped or adapted to the anatomy</li>
</ul>
<h4 class="deck-topic">Troubleshooting after placement</h4>
<div class="deck-block deck-tbl"><table>
<thead><tr><th>Finding</th><th>Problem</th><th>Action</th></tr></thead>
<tbody>
<tr><td>Floss passes with no resistance, food packs</td><td><b>Open contact</b></td><td>Re-establish the contact</td></tr>
<tr><td>Floss cannot pass, pressure pain</td><td><b>Excessive contact</b></td><td>Adjust or replace</td></tr>
<tr><td>Contact firm but food still packs sideways</td><td><b>Contour and embrasure</b> form wrong</td><td>Correct anatomy</td></tr>
<tr><td>Ledge on bitewing, bleeding, bone loss</td><td><b>Overhang</b></td><td>Recontour or replace</td></tr>
<tr><td>Opposing cusp forces food between teeth</td><td><b>Plunger cusp</b></td><td>Adjust occlusion and restore marginal ridges</td></tr>
<tr><td>Contacts good but papilla and support lost</td><td>Periodontal disease</td><td>Treat the periodontium</td></tr>
</tbody></table></div>
<h4 class="deck-topic">Supracrestal tissue attachment (biologic width)</h4>
<ul>
<li>Junctional epithelium plus connective tissue attachment average about <b>2 mm</b>; with the sulcus, plan roughly <b>3 mm</b> from margin to bone crest</li>
<li>A margin that invades this zone causes persistent inflammation or bone loss despite good hygiene</li>
<li>Solutions: <b>crown lengthening</b> or <b>orthodontic extrusion</b></li>
</ul>
<h4 class="deck-topic">Occlusion check</h4>
<ul>
<li>Mark contacts before and after. Tenderness on chewing right after a new restoration with a normal radiograph and high marks: <b>adjust</b></li>
<li>A reduced or restored cusp must be checked in maximum intercuspation <b>and</b> in excursions</li>
<li>Before replacing many worn or fractured restorations, <b>assess the occlusion</b> and parafunction first</li>
</ul>
<div class="sum-key"><span class="sum-key-title">نقاط امتحانية</span><ul>
<li>Wedge prevents gingival excess and gives slight separation.</li>
<li>Food impaction with a tight contact: look at contour.</li>
<li>A margin 1 mm from bone violates the tissue attachment.</li>
<li>Overhangs retain plaque and must be removed.</li>
</ul></div>
`,
            questions: [
                {
                    "q": "After placement of a Class II restoration, a patient reports food packing between two teeth. Floss passes freely without resistance, and a bitewing shows no proximal contact. What is the principal restorative defect?",
                    "options": [
                        "Excessive contact tightness",
                        "Occlusal amalgam flash",
                        "Open proximal contact",
                        "Cervical enamel craze line"
                    ],
                    "answer": 2,
                    "explanation": "Loss of proximal contact permits food to be forced into the interdental space and may injure the papilla and periodontium. The restoration should be corrected to establish a properly positioned and shaped contact. Reference: Ritter AV, Boushell LW, Walter R, eds. Sturdevant's Art and Science of Operative Dentistry. 7th ed. Class II proximal contacts and contours.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A Class II restoration has a firm floss contact, but its proximal surface is flat and the facial and lingual embrasures are poorly formed. The patient has lateral food stagnation and gingival inflammation. What should be corrected?",
                    "options": [
                        "Contact tightness alone",
                        "Occlusal marginal-ridge height alone",
                        "Adjacent tooth alignment alone",
                        "Proximal contour and embrasure form"
                    ],
                    "answer": 3,
                    "explanation": "A contact may be tight while the surrounding proximal contour remains defective. Appropriate contour and embrasure form deflect food and permit cleansability without impinging on the papilla. Reference: Ritter AV, Boushell LW, Walter R, eds. Sturdevant's Art and Science of Operative Dentistry. 7th ed. Proximal contact, contour, and embrasures.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A bitewing radiograph shows a prominent proximal overhang on a Class II restoration. The adjacent site has plaque retention, bleeding on probing, and localized crestal bone loss. What is the primary corrective treatment?",
                    "options": [
                        "Perform root canal treatment",
                        "Remove or recontour the overhang",
                        "Apply a pit-and-fissure sealant",
                        "Prescribe antibiotics alone"
                    ],
                    "answer": 1,
                    "explanation": "A proximal overhang creates a plaque-retentive environment that can sustain localized periodontal inflammation and attachment loss. The local irritant must be corrected together with appropriate periodontal debridement and hygiene. Reference: Newman MG, Takei HH, Klokkevold PR, Carranza FA, eds. Carranza's Clinical Periodontology. 13th ed. Local contributing factors and restorative-periodontal relationships.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A deep proximal restorative margin is located 1 mm from the alveolar crest. The site has persistent bleeding and inflammation despite excellent plaque control and a smooth, intact restoration. What is the most likely problem?",
                    "options": [
                        "Reversible pulpitis",
                        "Occlusal attrition",
                        "Supracrestal tissue attachment violation",
                        "Dentin hypersensitivity"
                    ],
                    "answer": 2,
                    "explanation": "Insufficient space between a restorative margin and the alveolar crest can disrupt the supracrestal tissue attachment and produce persistent inflammation. Management requires relocating the margin coronally or creating adequate tooth structure through an appropriate periodontal or orthodontic approach. Reference: Newman MG, Takei HH, Klokkevold PR, Carranza FA, eds. Carranza's Clinical Periodontology. 13th ed. Restorative-periodontal interrelationships; Rosenstiel SF, Land MF, Fujimoto J. Contemporary Fixed Prosthodontics. 6th ed. Biologic considerations of margins.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A posterior tooth has recurrent interdental food impaction. The restorations have correct contacts and contours, but a prominent opposing cusp wedges food directly into the embrasure during function. What should be evaluated for conservative correction?",
                    "options": [
                        "The proximal contact only",
                        "The functional plunger cusp",
                        "The cervical contour only",
                        "The interdental papilla only"
                    ],
                    "answer": 1,
                    "explanation": "An opposing cusp can act as a plunger and force food into an otherwise acceptable proximal area. Any occlusal adjustment must be conservative and based on confirmed functional contacts rather than performed empirically. Reference: Ritter AV, Boushell LW, Walter R, eds. Sturdevant's Art and Science of Operative Dentistry. 7th ed. Occlusal form and food impaction; Newman MG, et al. Carranza's Clinical Periodontology. 13th ed. Local contributing factors.",
                    "source": "SDLE bank"
                }
            ],
        },
        {
            id: "rd-isolation",
            title: "07 — Isolation and Operator Positioning",
            title_en: "Rubber dam · clamps · ergonomics",
            summaryHtml: `
<h4 class="deck-topic">Why the rubber dam</h4>
<ul>
<li>Dry, clean field for adhesion and amalgam; protects airway and soft tissue; improves access and vision; reduces contaminated aerosol</li>
<li>Check for latex allergy and use non-latex sheets when needed</li>
<li>Tie floss to the clamp so it can be retrieved</li>
</ul>
<div class="deck-block deck-tbl"><table>
<thead><tr><th>Clamp (common numbering)</th><th>Typical use</th></tr></thead>
<tbody>
<tr><td><b>212</b></td><td>Retracts gingiva for facial Class V work</td></tr>
<tr><td><b>14A</b></td><td>Partially erupted or irregular molars</td></tr>
</tbody></table></div>
<p>Numbering and jaw shapes vary between makers; choose a clamp that is stable on four points.</p>
<h4 class="deck-topic">Broken-down tooth</h4>
<ul>
<li>When the treated tooth cannot hold a clamp and neighbours are stable, <b>clamp an adjacent tooth</b> and stretch the dam to include the target (split-dam method), sealing gaps with a caulking material</li>
<li>Other options: pre-endodontic build-up, deeper-gripping clamp, or limited crown lengthening</li>
</ul>
<h4 class="deck-topic">Soft-tissue protection in bleaching</h4>
<ul>
<li>High-concentration in-office gel needs a <b>continuous, light-cured gingival barrier with no gaps</b> (or rubber dam)</li>
<li>Rapid whitening of adjacent gingiva after gel contact is a chemical burn: remove the gel and rinse generously</li>
</ul>
<h4 class="deck-topic">Positioning (four-handed, neutral posture)</h4>
<div class="sum-algo"><span class="sum-algo-title">Set up in this order</span><ol>
<li>Sit with a straight back, relaxed shoulders and supported feet</li>
<li><b>Maxillary arch</b>: patient supine, chin raised so the occlusal plane faces you</li>
<li><b>Mandibular arch</b>: chin lowered, chair slightly more upright, lower arch oriented to you</li>
<li>Rotate the patient's head and use <b>mirror vision</b> instead of bending or twisting your neck</li>
</ol></div>
<ul>
<li>A right-handed operator typically works between the 8 and 12 o'clock positions</li>
<li>Adapt for medical needs: patients with heart failure or breathing disease may need a semi-upright position</li>
</ul>
<div class="sum-key"><span class="sum-key-title">نقاط امتحانية</span><ul>
<li>Clamp 212: cervical Class V retraction.</li>
<li>No retention on the target tooth: clamp a neighbour.</li>
<li>Poor view: move the patient and use the mirror.</li>
<li>Bleaching gel needs an unbroken gingival barrier.</li>
</ul></div>
`,
            questions: [
                {
                    "q": "Which rubber-dam clamp is designed to retract gingiva for a cervical Class V restoration?",
                    "options": [
                        "212",
                        "12A",
                        "13A",
                        "W8"
                    ],
                    "answer": 0,
                    "explanation": "The cervical or butterfly 212 clamp provides gingival retraction and isolation for Class V procedures. Reference: Heymann HO, Swift EJ, Ritter AV. Sturdevant's Art and Science of Operative Dentistry.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A tooth requiring endodontic treatment has insufficient coronal structure for direct clamp placement. The adjacent teeth are stable. What is an appropriate isolation method?",
                    "options": [
                        "Use cotton rolls only",
                        "Treat without isolation",
                        "Extract the tooth",
                        "Clamp an adjacent tooth and extend the dam"
                    ],
                    "answer": 3,
                    "explanation": "Anchoring the dental dam on a stable adjacent tooth can isolate the treatment field when the target tooth cannot retain a clamp, provided a secure seal is achieved. Reference: American Association of Endodontists. Position Statement: Dental Dams. 2024.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A dentist is preparing a maxillary posterior tooth. Which patient-position adjustment most directly improves access to the maxillary occlusal and palatal surfaces?",
                    "options": [
                        "Place the patient supine and elevate the chin",
                        "Seat the patient upright with the chin down",
                        "Place the patient semisupine with the chin fully lowered",
                        "Keep the patient upright and rotate the operator posteriorly"
                    ],
                    "answer": 0,
                    "explanation": "A supine position with the maxillary arch oriented for visibility improves access to upper teeth and reduces the need for operator flexion. Small head rotations are then used for the specific quadrant and surface. Reference: Ritter AV, Boushell LW, Walter R, eds. Sturdevant's Art and Science of Operative Dentistry. 7th ed. Patient positioning and visibility.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A right-handed dentist cannot see a posterior surface without marked neck rotation. What is the best ergonomic response?",
                    "options": [
                        "Maintain the position and increase neck flexion",
                        "Reposition the patient and use mirror vision",
                        "Move only the handpiece while keeping the same line of sight",
                        "Raise the shoulders and rotate the trunk toward the field"
                    ],
                    "answer": 1,
                    "explanation": "Patient rotation, chair adjustment, and indirect vision should be used to bring the field into view while preserving a neutral operator posture. Sustained neck, trunk, or shoulder deviation increases musculoskeletal strain. Reference: Ritter AV, Boushell LW, Walter R, eds. Sturdevant's Art and Science of Operative Dentistry. 7th ed. Ergonomics and indirect vision.",
                    "source": "SDLE bank"
                },
                {
                    "q": "Which isolation feature is essential before high-concentration in-office bleaching gel is applied?",
                    "options": [
                        "A continuous light-cured gingival barrier with no gaps",
                        "Cotton rolls without soft-tissue inspection",
                        "Intentional gel contact with the papillae",
                        "Removal of all cervical enamel"
                    ],
                    "answer": 0,
                    "explanation": "A continuous barrier protects gingiva and exposed soft tissues from concentrated peroxide. Isolation must be inspected throughout treatment because movement or leakage can produce rapid chemical injury. Reference: Ritter AV, Boushell LW, Walter R, eds. Sturdevant's Art and Science of Operative Dentistry. 7th ed. In-office bleaching technique.",
                    "source": "SDLE bank"
                }
            ],
        },
        {
            id: "rd-treated",
            title: "08 — Cracked, Weakened and Root-Filled Teeth",
            title_en: "Cuspal coverage · ferrule · posts",
            summaryHtml: `
<h4 class="deck-topic">Cracked or weakened vital tooth</h4>
<ul>
<li>Classic complaint: pain on biting, often <b>on release</b>, with cold sensitivity. Use a bite test, transillumination, dye and magnification</li>
<li>First define how far the crack runs and the pulp and periodontal status</li>
<li>A restorable crack that has not reached the root: <b>bonded cuspal coverage</b> (onlay or crown), with pulp review</li>
<li>Fractured cusp or undermined cusps around a large filling: cuspal-coverage onlay or crown</li>
</ul>
<h4 class="deck-topic">After root canal treatment</h4>
<ul>
<li>The main cause of weakness is <b>lost tooth structure</b></li>
<li>Intact tooth with a small access and no crack: <b>bonded restoration</b> is enough</li>
<li>Posterior tooth that lost marginal ridges: usually cuspal coverage</li>
<li>Defective old restoration around the access: remove it, assess and cover the cusps</li>
</ul>
<h4 class="deck-topic">Post, core and ferrule</h4>
<ul>
<li>Use a post <b>only when the core cannot be retained otherwise</b>; a post does not strengthen the root</li>
<li>In molars, first use the <b>pulp chamber</b> and canal orifices for core retention to save root dentin</li>
<li><b>Ferrule</b>: the crown encircles at least about <b>1.5 to 2 mm</b> of sound tooth above the margin. It strongly improves fracture resistance</li>
<li>No ferrule: gain it by <b>crown lengthening</b> or <b>orthodontic extrusion</b>; extrusion avoids removing support from neighbours, which matters in the aesthetic zone</li>
<li>Keep enough apical root filling (commonly 4 to 5 mm) when preparing post space; bleeding during preparation suggests perforation, so take a radiograph before going further</li>
</ul>
<div class="sum-algo"><span class="sum-algo-title">Restorability check</span><ol>
<li>Vertical root fracture present: hopeless, extract</li>
<li>Caries removed: enough structure and ferrule possible?</li>
<li>Periodontal support and crown-root ratio acceptable?</li>
<li>Endodontic status sound? Then choose core and coverage</li>
</ol></div>
<h4 class="deck-topic">Aesthetic cases</h4>
<ul>
<li>Major changes to front teeth: use a <b>diagnostic wax-up</b>, then provisionals to <b>test appearance, speech and function</b> before the final crowns</li>
</ul>
<div class="sum-key"><span class="sum-key-title">نقاط امتحانية</span><ul>
<li>Post is for the core, not for strength.</li>
<li>Ferrule matters more than post type.</li>
<li>Complete vertical root fracture: not restorable.</li>
<li>Small access in a sound tooth needs only bonded closure.</li>
</ul></div>
`,
            questions: [
                {
                    "q": "When is a post indicated after root canal treatment?",
                    "options": [
                        "To strengthen every root",
                        "To improve apical healing",
                        "In every anterior tooth",
                        "When core retention is inadequate"
                    ],
                    "answer": 3,
                    "explanation": "A post is primarily a core-retention device. It should be avoided when adequate coronal structure can retain the core because post-space preparation removes dentin and introduces procedural risk. Reference: Rosenstiel SF, Land MF, Walter R. Contemporary Fixed Prosthodontics. 6th ed. Post-and-core section.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A root-filled molar has extensive coronal loss, but the pulp chamber provides adequate retention for a bonded core. Which approach best preserves radicular dentin?",
                    "options": [
                        "Prepare posts in all canals",
                        "Use the pulp chamber for core retention",
                        "Remove the chamber floor",
                        "Enlarge the thinnest root canal"
                    ],
                    "answer": 1,
                    "explanation": "Molar pulp chambers often provide sufficient core retention without a radicular post. Avoiding unnecessary post-space preparation preserves root dentin and reduces perforation and fracture risk. Reference: European Society of Endodontology. Position statement: The restoration of root filled teeth. International Endodontic Journal. 2021;54:1974-1981. doi:10.1111/iej.13607.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A root-filled molar has a small endodontic access through an otherwise sound, well-adapted full- coverage crown. There is no recurrent caries or crack, and isolation is adequate. What is the most conservative definitive management of the access?",
                    "options": [
                        "Restore the access with bonded material",
                        "Extract the tooth",
                        "Replace the crown routinely",
                        "Place a cast post through a root"
                    ],
                    "answer": 0,
                    "explanation": "A sound crown does not require automatic replacement solely because endodontic access was made through it. The access can be sealed with an appropriate bonded restoration when crown integrity, retention, and margins remain acceptable. Reference: European Society of Endodontology. Position statement: The restoration of root filled teeth. International Endodontic Journal. 2021;54:1974-1981. doi:10.1111/iej.13607.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A large amalgam restoration is intact, but a crack extends from the restoration across a cusp. The tooth has pain on release during a bite test, and the crack does not extend into the root. What is the preferred restorative principle?",
                    "options": [
                        "Remove all enamel around the tooth",
                        "Perform extraction routinely",
                        "Leave the crack unloaded and untreated",
                        "Provide bonded cuspal coverage after crack assessment"
                    ],
                    "answer": 3,
                    "explanation": "A symptomatic incomplete coronal crack usually requires stabilization and cuspal coverage when the tooth remains restorable. Pulpal diagnosis and crack extent determine whether endodontic treatment is also necessary. Reference: European Society of Endodontology. Position statement on longitudinal cracks and fractures of teeth. International Endodontic Journal. 2025. doi:10.1111/iej.14186; Ritter AV, et al. Sturdevant's Art and Science of Operative Dentistry. 7th ed.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A root-filled incisor lacks ferrule. Controlled coronal movement of the root can expose sound structure without compromising adjacent bone. What is the preferred pre-restorative option?",
                    "options": [
                        "Immediate long post",
                        "Orthodontic extrusion",
                        "Apical surgery",
                        "Internal bleaching only"
                    ],
                    "answer": 1,
                    "explanation": "Orthodontic extrusion may create sound supragingival structure while preserving the periodontal architecture of adjacent teeth. The case must be evaluated for root length, esthetics, and required stabilization. Reference: Rosenstiel SF, Land MF, Walter R. Contemporary Fixed Prosthodontics. 6th ed. Ferrule development and orthodontic extrusion sections.",
                    "source": "SDLE bank"
                }
            ],
        },
        {
            id: "rd-wear",
            title: "09 — Tooth Wear, Defects and Bleaching",
            title_en: "Erosion · attrition · hypoplasia · whitening",
            summaryHtml: `
<div class="deck-block deck-tbl"><table>
<thead><tr><th>Wear</th><th>Cause</th><th>Appearance</th></tr></thead>
<tbody>
<tr><td><b>Attrition</b></td><td>Tooth-to-tooth contact (bruxism)</td><td>Flat facets that <b>match</b> on opposing teeth</td></tr>
<tr><td><b>Abrasion</b></td><td>Mechanical, such as hard brushing</td><td>Cervical notches, often facial</td></tr>
<tr><td><b>Erosion</b></td><td>Non-bacterial acid: diet or reflux, vomiting</td><td>Smooth cupped surfaces; restorations stand proud. Vomiting and reflux often affect <b>palatal</b> maxillary surfaces</td></tr>
<tr><td><b>Abfraction</b> (proposed)</td><td>Occlusal loading and flexure</td><td>Wedge-shaped cervical defect; evidence is debated</td></tr>
</tbody></table></div>
<div class="sum-algo"><span class="sum-algo-title">Severe wear</span><ol>
<li>Treat pain and fractures first</li>
<li>Diagnose the causes and <b>control the source</b> (refer for reflux or eating disorder)</li>
<li>Record, protect and monitor</li>
<li>Rebuild with minimal, <b>additive</b> restorations where feasible</li>
</ol></div>
<h4 class="deck-topic">Developmental defects</h4>
<ul>
<li><b>Amelogenesis imperfecta</b>: hereditary, generalised, both dentitions; dentin and pulp usually normal. Care is staged and long term</li>
<li><b>Turner tooth</b>: one permanent tooth with enamel hypoplasia after infection or trauma of the primary predecessor</li>
<li><b>Tetracycline staining</b>: bands of intrinsic grey or brown colour matching the time of exposure</li>
<li><b>Molar-incisor hypomineralisation</b>: demarcated opacities on first molars and often incisors; severe breakdown needs durable coverage</li>
<li><b>Fluorosis</b>, shallow stain: <b>microabrasion</b>, with bleaching if needed</li>
<li>Small deep pits with good enamel around: conservative bonded composite</li>
</ul>
<h4 class="deck-topic">Bleaching</h4>
<ul>
<li>Agents: hydrogen peroxide, or carbamide peroxide which releases it</li>
<li>Commonest effects: transient <b>sensitivity</b> and gingival irritation. With a history of sensitivity, use desensitiser and shorter or less frequent exposure</li>
<li>Restorations do not change shade. Wait about <b>2 weeks</b> before new bonded composite: residual oxygen weakens the bond and the shade settles</li>
<li>Non-vital internal bleaching carries a risk of <b>external cervical resorption</b>; place a cervical barrier</li>
</ul>
<div class="sum-key"><span class="sum-key-title">نقاط امتحانية</span><ul>
<li>Matching facets mean attrition.</li>
<li>Erosion: control the acid first.</li>
<li>One hypoplastic premolar or incisor after a sick primary tooth: Turner tooth.</li>
<li>Delay composite replacement about two weeks after bleaching.</li>
</ul></div>
`,
            questions: [
                {
                    "q": "Matching flat facets are present on opposing teeth in a patient with bruxism. What is the dominant wear mechanism?",
                    "options": [
                        "Erosion only",
                        "Caries",
                        "External resorption",
                        "Attrition"
                    ],
                    "answer": 3,
                    "explanation": "Tooth-to-tooth contact produces corresponding wear facets. Parafunction, sleep history, muscle symptoms, and restorative risk should be assessed. Reference: Ritter AV, Boushell LW, Walter R, eds. Sturdevant's Art and Science of Operative Dentistry. 7th ed. Attrition and tooth wear.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A patient has active erosive tooth wear associated with uncontrolled reflux. What is the most important first management principle?",
                    "options": [
                        "Identify and control the acid source",
                        "Prepare full crowns immediately for every tooth",
                        "Increase acidic beverage frequency",
                        "Brush immediately after every reflux episode"
                    ],
                    "answer": 0,
                    "explanation": "Disease control requires addressing reflux or other acid exposure, coordinating medical assessment when indicated, and adding protective dietary, salivary, fluoride, and behavioral measures. Definitive restoration is planned after risk control and structural assessment. Reference: Lussi A, Ganss C, eds. Erosive Tooth Wear. 2nd ed. Prevention and management; Ritter AV, et al. Sturdevant's Art and Science of Operative Dentistry. 7th ed.",
                    "source": "SDLE bank"
                },
                {
                    "q": "When should a discolored anterior Class III composite usually be replaced after external tooth bleaching?",
                    "options": [
                        "After about two weeks",
                        "Immediately",
                        "After two hours",
                        "Before bleaching"
                    ],
                    "answer": 0,
                    "explanation": "Waiting about two weeks permits shade stabilization and dissipation of residual oxygen that can transiently impair resin bonding. Reference: Ritter AV et al. Sturdevant's Art and Science of Operative Dentistry. Tooth bleaching and adhesive restoration.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A patient has shallow white and brown fluorotic surface irregularities confined to the outer enamel. Which minimally invasive esthetic treatment is most appropriate?",
                    "options": [
                        "Full-crown preparation",
                        "Root canal treatment",
                        "Surgical crown lengthening",
                        "Enamel microabrasion"
                    ],
                    "answer": 3,
                    "explanation": "Controlled microabrasion removes a very thin superficial enamel layer and can improve shallow fluorotic discoloration and irregularity. Depth must be assessed because deeper defects require additive restoration rather than excessive enamel removal. Reference: Ritter AV, Boushell LW, Walter R, eds. Sturdevant's Art and Science of Operative Dentistry. 7th ed. Enamel microabrasion and esthetic management of discoloration.",
                    "source": "SDLE bank"
                },
                {
                    "q": "All teeth in both dentitions have abnormally thin, pitted enamel. Several family members have the same condition, while dentin and pulp morphology are otherwise normal. What is the most likely diagnosis?",
                    "options": [
                        "Amelogenesis imperfecta",
                        "Dental erosion",
                        "Molar-incisor hypomineralization",
                        "Tetracycline staining"
                    ],
                    "answer": 0,
                    "explanation": "Generalized inherited defects of enamel affecting both dentitions strongly support amelogenesis imperfecta. The exact phenotype may be hypoplastic, hypomaturation, hypocalcified, or mixed. Reference: Neville BW, Damm DD, Allen CM, Chi AC. Oral and Maxillofacial Pathology. 4th ed. Amelogenesis imperfecta; Dean JA, ed. McDonald and Avery's Dentistry for the Child and Adolescent. 11th ed. Hereditary enamel disorders.",
                    "source": "SDLE bank"
                }
            ],
        },
    ],
};

export default dentalRestorativeDentistry;
