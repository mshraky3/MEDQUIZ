// AUTO-COPIED from my-react-app/src/components/summaries/content/dentalDentalMaterials.js. Do not edit here:
// change the website's file, then run `npm run sync:summaries` in mobile/.
// Dental Materials — dental-track section of the summaries catalog.
// Mirrored for the slide viewer in backend/content/summaryHtml (keep the two in sync).
// Inline questions are copied from the SQB bank.
const dentalDentalMaterials = {
    id: "dental-materials",
    title: "Dental Materials",
    title_en: "SDLE Review — 9 Topics",
    icon: "shield-check",
    accent: "#f472b6",
    intro: "Dental materials revision for SDLE: Elastomeric Impressions · Alginate and Agar · Luting Cements · Glass Ionomer, Composite and Ceramics · Gypsum Products · Dental Amalgam · Acrylic Denture Bases · Alloys, Investments and Casting · Material Properties and Shade.",
    subtopics: [
        {
            id: "dm-elastomers",
            title: "01 — Elastomeric Impression Materials",
            title_en: "PVS · polyether · polysulfide · condensation silicone",
            summaryHtml: `
<div class="deck-block deck-tbl"><table>
<thead><tr><th>Material</th><th>Setting and by-product</th><th>Behaviour</th></tr></thead>
<tbody>
<tr><td><b>Addition silicone (PVS)</b></td><td>Addition polymerisation; no condensation by-product</td><td><b>Best dimensional stability</b>, excellent elastic recovery; can be poured later and more than once</td></tr>
<tr><td><b>Polyether</b></td><td>Cationic ring-opening; no by-product</td><td>Hydrophilic, accurate, <b>stiff</b>; <b>absorbs water</b> and swells, so store dry</td></tr>
<tr><td><b>Condensation silicone</b></td><td>Condensation; releases <b>alcohol</b></td><td>Shrinks as alcohol evaporates: pour promptly</td></tr>
<tr><td><b>Polysulfide</b></td><td>Condensation; releases <b>water</b></td><td>Good tear resistance, long setting, bad smell; pour <b>within about 1 hour</b></td></tr>
</tbody></table></div>
<h4 class="deck-topic">Contamination and surface problems</h4>
<ul>
<li><b>Latex gloves or sulfur compounds</b> can <b>inhibit addition silicone</b>: tacky, unset areas. Mix putty with compatible (for example vinyl or suitable nitrile) gloves, and clean the preparation</li>
<li>Polysulfide is not inhibited by latex in this way</li>
<li>Some PVS releases <b>hydrogen</b> after setting; pouring immediately can cause bubbles on the cast. Follow the maker's waiting time (many products contain a hydrogen absorber)</li>
<li>Good impression but soft or powdery cast surface: check <b>surface contamination and gypsum mixing</b></li>
<li>A raised nodule or defect on a cast usually traces to a void or handling error in the impression or pour</li>
</ul>
<div class="sum-algo"><span class="sum-algo-title">Getting an accurate impression</span><ol>
<li>Healthy tissue, haemostasis and margins exposed</li>
<li>Rigid tray with the right adhesive and even thickness</li>
<li>Correct mix within working time; seat without movement</li>
<li>Remove after full set with a quick, straight pull</li>
<li>Inspect, disinfect with a compatible method, store and pour as directed</li>
</ol></div>
<ul>
<li>For fixed prosthodontics and inlays or onlays, PVS or polyether are usual choices</li>
<li>Disinfect by a protocol suited to the material; long soaking can distort hydrophilic materials</li>
</ul>
<div class="sum-key"><span class="sum-key-title">نقاط امتحانية</span><ul>
<li>Most stable on delayed pouring: addition silicone.</li>
<li>Latex or sulfur inhibits PVS setting.</li>
<li>Polyether dislikes water storage.</li>
<li>Polysulfide should be poured within about an hour.</li>
</ul></div>
`,
            questions: [
                {
                    "q": "Which elastomeric impression material has the best dimensional stability for pouring after approximately one day?",
                    "options": [
                        "Alginate",
                        "Agar",
                        "Impression compound",
                        "Polyvinyl siloxane"
                    ],
                    "answer": 3,
                    "explanation": "Addition silicone or polyvinyl siloxane has excellent elastic recovery and dimensional stability, permitting delayed pouring when stored according to the manufacturer's instructions. Reference: Anusavice KJ, Shen C, Rawls HR. Phillips' Science of Dental Materials. Elastomeric impression materials.",
                    "source": "SDLE bank"
                },
                {
                    "q": "An addition-silicone impression remains tacky and unset in localized areas that contacted material handled with sulfur-contaminated gloves. What occurred?",
                    "options": [
                        "Polymerization inhibition",
                        "Syneresis",
                        "Imbibition",
                        "Gypsum setting expansion"
                    ],
                    "answer": 0,
                    "explanation": "Sulfur-containing contamination can inhibit platinum-catalyzed addition-silicone polymerization and leave an unset surface. The contaminated material must be removed and the impression repeated with compatible handling materials. Reference: Anusavice KJ, Shen C, Rawls HR. Phillips' Science of Dental Materials. 12th ed. Addition silicone setting inhibition.",
                    "source": "SDLE bank"
                },
                {
                    "q": "Which reaction sets polyvinyl siloxane impression material?",
                    "options": [
                        "Addition polymerization",
                        "Condensation polymerization",
                        "Acid-base reaction",
                        "Hydration"
                    ],
                    "answer": 0,
                    "explanation": "Polyvinyl siloxane is an addition silicone that sets by addition polymerization without a volatile by- product. Reference: Anusavice KJ, Shen C, Rawls HR. Phillips' Science of Dental Materials. Elastomeric impression materials.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A polyether impression is stored immersed in water for a prolonged period before pouring. What dimensional problem is most likely?",
                    "options": [
                        "Shrinkage from mercury loss",
                        "Expansion from water absorption",
                        "Distortion from alginate syneresis",
                        "Expansion from gypsum crystallization inside the syringe"
                    ],
                    "answer": 1,
                    "explanation": "Polyether is relatively hydrophilic and may absorb water during prolonged immersion, causing dimensional change. Disinfection and storage must follow the manufacturer's time and method. Reference: Anusavice KJ, Shen C, Rawls HR. Phillips' Science of Dental Materials. 12th ed. Polyether impression materials.",
                    "source": "SDLE bank"
                },
                {
                    "q": "When should a polysulfide impression ordinarily be poured to limit dimensional change?",
                    "options": [
                        "After one week",
                        "After 24 hours",
                        "Within one hour",
                        "After 48 hours"
                    ],
                    "answer": 2,
                    "explanation": "Polysulfide releases water during condensation polymerization and should be poured promptly, conventionally within about one hour. Reference: Anusavice KJ, Shen C, Rawls HR. Phillips' Science of Dental Materials. Polysulfide impressions.",
                    "source": "SDLE bank"
                }
            ],
        },
        {
            id: "dm-hydrocolloid",
            title: "02 — Hydrocolloids: Alginate and Agar",
            title_en: "Mixing · water temperature · storage",
            summaryHtml: `
<h4 class="deck-topic">Two types</h4>
<ul>
<li><b>Agar</b>: <b>reversible</b>; changes between gel and sol with temperature and needs conditioning equipment</li>
<li><b>Alginate</b>: <b>irreversible</b>; a chemical reaction forms calcium alginate. The powder contains a soluble alginate, calcium sulfate as reactor, a phosphate <b>retarder</b> and fillers</li>
<li>In a <b>perforated stock tray</b> alginate is held by <b>mechanical retention</b> through the holes (adhesive is used on non-perforated trays)</li>
</ul>
<h4 class="deck-topic">Setting control</h4>
<ul>
<li>Change the <b>water temperature</b>, not the powder-water ratio</li>
<li><b>Warm water speeds</b> setting (useful with a strong gag reflex); cool water slows it</li>
</ul>
<div class="deck-block deck-tbl"><table>
<thead><tr><th>Defect</th><th>Likely cause</th></tr></thead>
<tbody>
<tr><td>Grainy</td><td>Inadequate spatulation, powder left unmixed, or water too warm shortening the working time</td></tr>
<tr><td>Thin, weak, slow to set</td><td><b>Too much water</b></td></tr>
<tr><td>Poor surface despite good mixing</td><td>Powder spoiled by <b>moisture</b> in an open container</td></tr>
<tr><td>Voids</td><td>Trapped air or saliva</td></tr>
<tr><td>Distortion</td><td>Tray moved during gelation, early removal, slow removal</td></tr>
<tr><td>Tearing</td><td>Thin section, weak mix, removed too early</td></tr>
</tbody></table></div>
<h4 class="deck-topic">Dimensional change</h4>
<ul>
<li><b>Syneresis</b>: fluid is squeezed out of the gel; with evaporation it shrinks</li>
<li><b>Imbibition</b>: gel takes up water and <b>expands</b></li>
</ul>
<div class="sum-algo"><span class="sum-algo-title">After removal</span><ol>
<li>Rinse off saliva and blood</li>
<li>Disinfect with the recommended spray or short protocol</li>
<li>Do not leave in air or soak in water</li>
<li><b>Pour promptly</b>, ideally within about 10 to 15 minutes unless it is an extended-storage product</li>
</ol></div>
<ul>
<li>A cast poured late or against a wet, saliva-covered impression can be distorted, rough or weak</li>
</ul>
<div class="sum-key"><span class="sum-key-title">نقاط امتحانية</span><ul>
<li>Alginate is irreversible; agar is reversible.</li>
<li>Use warmer water for a faster set.</li>
<li>Water uptake is imbibition; fluid loss from the gel is syneresis.</li>
<li>Pour alginate early.</li>
</ul></div>
`,
            questions: [
                {
                    "q": "Which hydrocolloid impression material is reversible?",
                    "options": [
                        "Alginate",
                        "Polyvinyl siloxane",
                        "Polysulfide",
                        "Agar"
                    ],
                    "answer": 3,
                    "explanation": "Agar changes reversibly between sol and gel with temperature, whereas alginate sets by an irreversible chemical reaction. Reference: Anusavice KJ, Shen C, Rawls HR. Phillips' Science of Dental Materials. Hydrocolloids.",
                    "source": "SDLE bank"
                },
                {
                    "q": "How can alginate setting be accelerated for a patient with a strong gag reflex?",
                    "options": [
                        "Use colder mixing water",
                        "Add extra water",
                        "Reduce spatulation",
                        "Use warmer mixing water"
                    ],
                    "answer": 3,
                    "explanation": "Within the manufacturer's permitted range, warmer water increases the reaction rate and shortens alginate setting time. Reference: Anusavice KJ, Shen C, Rawls HR. Phillips' Science of Dental Materials. Alginate impression material.",
                    "source": "SDLE bank"
                },
                {
                    "q": "An alginate impression is left exposed to air and becomes smaller as liquid is expelled from the gel. Which phenomenon occurred?",
                    "options": [
                        "Imbibition",
                        "Hysteresis",
                        "Syneresis",
                        "Wettability"
                    ],
                    "answer": 2,
                    "explanation": "Syneresis is contraction of a gel with expulsion of liquid, causing dimensional shrinkage. Evaporation can add further water loss, which is why alginate should be poured promptly. Reference: Anusavice KJ, Shen C, Rawls HR. Phillips' Science of Dental Materials. 13th ed. Hydrocolloid impression materials.",
                    "source": "SDLE bank"
                },
                {
                    "q": "An alginate impression is left in direct contact with water and becomes larger. Which phenomenon occurred?",
                    "options": [
                        "Syneresis",
                        "Imbibition",
                        "Polymerization",
                        "Creep"
                    ],
                    "answer": 1,
                    "explanation": "Imbibition is absorption of water by a hydrocolloid gel, producing dimensional expansion. Alginate should not be stored in direct contact with liquid water. Reference: Anusavice KJ, Shen C, Rawls HR. Phillips' Science of Dental Materials. 13th ed. Hydrocolloid impression materials.",
                    "source": "SDLE bank"
                },
                {
                    "q": "An alginate impression mix is thin, weak, and slow to develop body. The measured powder amount was correct, but excess water was added. Which error caused the defect?",
                    "options": [
                        "Low water-to-powder ratio",
                        "Excessive tray rigidity",
                        "High water-to-powder ratio",
                        "Inadequate wax relief"
                    ],
                    "answer": 2,
                    "explanation": "Excess water produces a thinner, weaker gel and can reduce detail and tear resistance. The manufacturer's measured water-to-powder ratio should not be altered to control setting time. Reference: Anusavice KJ, Shen C, Rawls HR. Phillips' Science of Dental Materials. 12th ed. Alginate proportioning and properties.",
                    "source": "SDLE bank"
                }
            ],
        },
        {
            id: "dm-cements",
            title: "03 — Dental Cements",
            title_en: "Zinc phosphate · polycarboxylate · GIC · resin",
            summaryHtml: `
<div class="deck-block deck-tbl"><table>
<thead><tr><th>Cement</th><th>Strong points</th><th>Weak points and handling</th></tr></thead>
<tbody>
<tr><td><b>Zinc phosphate</b></td><td>Long record, good film for luting</td><td>Mainly <b>mechanical</b> retention; early <b>acidity</b> may irritate pulp</td></tr>
<tr><td><b>Zinc polycarboxylate</b></td><td><b>Chemical bond</b> to tooth calcium; gentle on pulp</td><td><b>Short working time</b>; mix quickly and seat while glossy</td></tr>
<tr><td><b>Zinc oxide eugenol</b></td><td>Sedative, good seal for temporaries</td><td>Weak; eugenol inhibits resin</td></tr>
<tr><td><b>Glass ionomer</b></td><td>Chemical bond, fluoride release</td><td>Early moisture sensitivity</td></tr>
<tr><td><b>Resin-modified GIC</b></td><td>Stronger, less soluble, fluoride</td><td>Some water expansion; check suitability under weaker ceramics</td></tr>
<tr><td><b>Resin cement</b></td><td>Strongest, aesthetic, supports bonded ceramics</td><td>Technique and isolation sensitive</td></tr>
</tbody></table></div>
<h4 class="deck-topic">Mixing zinc phosphate</h4>
<ul>
<li>Use a <b>cool, dry glass slab</b> (above the dew point)</li>
<li>Add powder in <b>small increments slowly over a long time</b> and spread over a wide area to dissipate heat</li>
<li>The cool slab gives a <b>longer working time</b> and lets <b>more powder</b> be added, which improves properties</li>
<li>Warmer mixing speeds the reaction</li>
<li>In a deep preparation, expect possible <b>postoperative sensitivity</b>; protect the pulp</li>
</ul>
<h4 class="deck-topic">General handling</h4>
<ul>
<li>ZOE: a cool slab extends working time</li>
<li>Hand-mixed or capsule products: follow the <b>maker's ratio, temperature, activation and mixing time</b></li>
<li><b>Glass ionomer type I</b> is for luting; type II for restoration; type III for lining or base</li>
<li>Silicophosphate is a historical fluoride-releasing cement</li>
</ul>
<h4 class="deck-topic">Provisional cementation</h4>
<ul>
<li>When a resin cement is planned later, use a <b>non-eugenol</b> temporary cement</li>
</ul>
<div class="sum-key"><span class="sum-key-title">نقاط امتحانية</span><ul>
<li>Slow incremental mixing on a cool slab: zinc phosphate.</li>
<li>Polycarboxylate bonds chemically and is kinder to the pulp.</li>
<li>Type I glass ionomer is the luting type.</li>
<li>Avoid eugenol before resin bonding.</li>
</ul></div>
`,
            questions: [
                {
                    "q": "Which traditional luting cement requires slow incremental incorporation of powder during mixing?",
                    "options": [
                        "Zinc phosphate cement",
                        "Zinc polycarboxylate cement",
                        "Resin-modified GIC",
                        "Resin cement"
                    ],
                    "answer": 0,
                    "explanation": "Zinc-phosphate powder is incorporated in small increments over a broad cool glass slab to control the exothermic reaction and preserve working time. Reference: Anusavice KJ, Shen C, Rawls HR. Phillips' Science of Dental Materials. Zinc-phosphate cement.",
                    "source": "SDLE bank"
                },
                {
                    "q": "What is the distinctive advantage of zinc polycarboxylate cement over zinc phosphate cement?",
                    "options": [
                        "Higher translucency",
                        "Chemical tooth adhesion",
                        "Fluoride recharge",
                        "Resin polymerization"
                    ],
                    "answer": 1,
                    "explanation": "Zinc polycarboxylate was the first conventional luting cement to chemically adhere to enamel and dentin through interaction of carboxyl groups with calcium. Zinc phosphate relies mainly on mechanical retention and does not chemically bond to tooth structure. Reference: Anusavice KJ, Shen C, Rawls HR. Phillips' Science of Dental Materials. 13th ed. Dental cements; Rosenstiel SF, Land MF, Fujimoto J. Contemporary Fixed Prosthodontics. 6th ed. Luting agents.",
                    "source": "SDLE bank"
                },
                {
                    "q": "Which traditional luting cement has the greatest potential for early pulpal irritation because of its initial acidity?",
                    "options": [
                        "Zinc polycarboxylate cement",
                        "Glass ionomer cement",
                        "Resin cement",
                        "Zinc phosphate cement"
                    ],
                    "answer": 3,
                    "explanation": "Freshly mixed zinc phosphate has a low initial pH and can cause postoperative sensitivity in a deep preparation if dentinal protection is inadequate. Reference: Anusavice KJ, Shen C, Rawls HR. Phillips' Science of Dental Materials. Dental cements.",
                    "source": "SDLE bank"
                },
                {
                    "q": "Which traditional classification of glass-ionomer cement is used for luting indirect restorations?",
                    "options": [
                        "Type I",
                        "Type II",
                        "Type III",
                        "Type IV"
                    ],
                    "answer": 0,
                    "explanation": "Type I glass-ionomer cement is formulated as a luting cement with a low film thickness. Reference: Anusavice KJ, Shen C, Rawls HR. Phillips' Science of Dental Materials. Glass-ionomer classifications.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A zinc polycarboxylate cement mix is prepared for luting. Which manipulation feature is clinically important?",
                    "options": [
                        "It should be mixed until all surface gloss disappears",
                        "It must be light cured before seating",
                        "Its working time is relatively short and prompt mixing is required",
                        "It should be diluted with water during placement"
                    ],
                    "answer": 2,
                    "explanation": "Zinc polycarboxylate cement develops viscosity rapidly and should be mixed efficiently and used while the surface remains glossy. Cooling components can extend working time when permitted by the manufacturer. Reference: Anusavice KJ, Shen C, Rawls HR. Phillips' Science of Dental Materials. 12th ed. Zinc polycarboxylate cement.",
                    "source": "SDLE bank"
                }
            ],
        },
        {
            id: "dm-tooth-coloured",
            title: "04 — Glass Ionomer, Composite and Ceramics",
            title_en: "Setting · filler · etching",
            summaryHtml: `
<h4 class="deck-topic">Glass ionomer</h4>
<ul>
<li>Sets by an <b>acid-base reaction</b> between fluoroaluminosilicate glass and a polyacid</li>
<li><b>Chemical adhesion</b>, <b>fluoride release and recharge</b>, thermal expansion <b>close to tooth structure</b></li>
<li>Weaker and wears more than composite</li>
<li>Protect the fresh conventional material with a coating to control <b>early water gain and loss</b></li>
</ul>
<h4 class="deck-topic">Resin composite</h4>
<ul>
<li>Resin matrix, inorganic filler, silane coupling agent, initiators; light cure commonly uses camphorquinone</li>
<li>More filler: better <b>wear resistance</b>, strength and stiffness; less shrinkage and thermal expansion</li>
<li><b>Nanohybrid or hybrid</b> materials combine strength and polish; highly filled materials suit stress-bearing posterior sites; microfilled polish well but are weaker</li>
<li><b>Class I</b> cavities have the highest C-factor and shrinkage stress</li>
<li>Composite is often counted as the fourth class of dental materials after metals, ceramics and polymers</li>
<li><b>Radiograph brightness alone cannot identify</b> a resin material</li>
</ul>
<h4 class="deck-topic">Ceramics</h4>
<div class="deck-block deck-tbl"><table>
<thead><tr><th>Ceramic</th><th>Character</th><th>Inner surface before bonding</th></tr></thead>
<tbody>
<tr><td><b>Feldspathic</b></td><td>Most glass, most lifelike, weakest</td><td>Hydrofluoric acid, then silane</td></tr>
<tr><td><b>Lithium disilicate</b></td><td>Glass-ceramic, good strength and translucency</td><td><b>Hydrofluoric acid first</b>, rinse and clean, then silane</td></tr>
<tr><td><b>Zirconia</b></td><td>Polycrystalline, strongest; framework or monolithic crown</td><td>Hydrofluoric acid is not effective; gentle air abrasion and an <b>MDP</b> primer or cement when bonding</td></tr>
</tbody></table></div>
<ul>
<li>Fiber posts and other intraradicular materials are identified by their shape and the clinical record as well as their radiographic look</li>
</ul>
<div class="sum-key"><span class="sum-key-title">نقاط امتحانية</span><ul>
<li>Acid-base setting: glass ionomer.</li>
<li>More filler improves wear resistance.</li>
<li>Feldspathic porcelain has the most glass.</li>
<li>Etch lithium disilicate with hydrofluoric acid, then silanate.</li>
</ul></div>
`,
            questions: [
                {
                    "q": "Which restorative material sets primarily through an acid-base reaction?",
                    "options": [
                        "Resin composite",
                        "Conventional glass ionomer",
                        "Compomer",
                        "Unfilled resin"
                    ],
                    "answer": 1,
                    "explanation": "Conventional glass ionomer sets when polyalkenoic acid reacts with fluoroaluminosilicate glass, forming a salt-gel matrix. Reference: Anusavice KJ, Shen C, Rawls HR. Phillips' Science of Dental Materials. Glass-ionomer setting reaction.",
                    "source": "SDLE bank"
                },
                {
                    "q": "Which thermal property of glass-ionomer cement is favorable compared with resin composite?",
                    "options": [
                        "Extremely high thermal conductivity",
                        "Thermal expansion similar to tooth structure",
                        "Zero dimensional change",
                        "Unlimited heat resistance"
                    ],
                    "answer": 1,
                    "explanation": "Glass-ionomer cement has a coefficient of thermal expansion relatively close to that of tooth structure, reducing thermally induced interfacial stress. Reference: Anusavice KJ, Shen C, Rawls HR. Phillips' Science of Dental Materials. Glass-ionomer thermal properties.",
                    "source": "SDLE bank"
                },
                {
                    "q": "Increasing the inorganic filler content of a resin composite generally improves which property?",
                    "options": [
                        "Polymerization shrinkage",
                        "Water sorption",
                        "Wear resistance",
                        "Resin flow"
                    ],
                    "answer": 2,
                    "explanation": "A greater proportion of appropriately bonded inorganic filler generally improves hardness and resistance to occlusal wear while reducing the resin fraction. Reference: Anusavice KJ, Shen C, Rawls HR. Phillips' Science of Dental Materials. Resin composites.",
                    "source": "SDLE bank"
                },
                {
                    "q": "Which ceramic has the greatest glassy-phase content?",
                    "options": [
                        "Lithium disilicate",
                        "Feldspathic porcelain",
                        "Leucite-reinforced ceramic",
                        "Yttria-stabilized zirconia"
                    ],
                    "answer": 1,
                    "explanation": "Feldspathic porcelain is predominantly glass based. Leucite-reinforced and lithium-disilicate ceramics contain larger crystalline fractions, while zirconia is a polycrystalline ceramic with no glassy matrix. Reference: Rosenstiel SF et al. Contemporary Fixed Prosthodontics. Dental ceramic classification and composition. Page",
                    "source": "SDLE bank"
                },
                {
                    "q": "Why is a newly placed conventional glass-ionomer restoration protected with a surface coating?",
                    "options": [
                        "Increase amalgamation",
                        "Eliminate acid-base setting",
                        "Prevent early water imbalance",
                        "Create metallic bonding"
                    ],
                    "answer": 2,
                    "explanation": "During early maturation, glass ionomer is vulnerable to both moisture contamination and dehydration; a varnish or resin coating protects its water balance. Reference: Anusavice KJ, Shen C, Rawls HR. Phillips' Science of Dental Materials. Glass-ionomer cements.",
                    "source": "SDLE bank"
                }
            ],
        },
        {
            id: "dm-gypsum",
            title: "05 — Gypsum Products",
            title_en: "Five types · water ratio · setting time",
            summaryHtml: `
<p>All are mainly calcium sulfate <b>hemihydrate</b> that sets to the <b>dihydrate</b> and gives off heat.</p>
<div class="deck-block deck-tbl"><table>
<thead><tr><th>ADA type</th><th>Name</th><th>Typical use</th></tr></thead>
<tbody>
<tr><td>I</td><td>Impression plaster</td><td>Rarely used now</td></tr>
<tr><td>II</td><td><b>Model plaster</b></td><td>Study casts without high strength needs, mounting, flasking</td></tr>
<tr><td>III</td><td><b>Dental stone</b></td><td>Diagnostic and working casts, denture and RPD work</td></tr>
<tr><td>IV</td><td><b>High strength, low expansion die stone</b></td><td>Crown and bridge dies</td></tr>
<tr><td>V</td><td><b>High strength, high expansion die stone</b></td><td>Compensate for the larger shrinkage of some base-metal alloys</td></tr>
</tbody></table></div>
<h4 class="deck-topic">Water-powder ratio</h4>
<ul>
<li>Plaster particles are porous and irregular and need the most water; die stone needs the least</li>
<li><b>More water</b>: slower set, <b>weaker</b>, less hard cast with less expansion</li>
<li>Vacuum mixing and vibration reduce bubbles</li>
</ul>
<h4 class="deck-topic">Setting time</h4>
<ul>
<li>Accelerate with <b>slurry water</b> (set gypsum crystals act as nuclei) or potassium sulfate; it does so without harming the mix much</li>
<li>Retard with borax and similar additives</li>
<li>Longer or faster spatulation shortens setting and increases expansion</li>
</ul>
<h4 class="deck-topic">Handling</h4>
<ul>
<li>Measure water and powder; sift powder into water; spatulate; vibrate into the impression from one side</li>
<li>Do not separate too early; avoid soaking casts in plain water, which dissolves the surface</li>
<li>Pouring one gypsum section against another: apply a <b>gypsum separator</b></li>
<li>Insufficient bulk or poor mixing makes a section liable to <b>break</b>, for example during flasking</li>
<li>Store powder sealed and dry</li>
</ul>
<div class="sum-key"><span class="sum-key-title">نقاط امتحانية</span><ul>
<li>Dies for cast crowns: type IV.</li>
<li>Need extra expansion: type V.</li>
<li>Slurry water is an accelerator.</li>
<li>Excess water costs strength.</li>
</ul></div>
`,
            questions: [
                {
                    "q": "A die for fabrication of a cast crown requires high strength, high abrasion resistance, and low setting expansion. Which gypsum product is preferred?",
                    "options": [
                        "Type II model plaster",
                        "Type IV high-strength die stone",
                        "Type III dental stone",
                        "Type V high-expansion die stone"
                    ],
                    "answer": 1,
                    "explanation": "Type IV stone combines high strength and surface hardness with relatively low setting expansion, making it suitable for precision fixed-prosthodontic dies. Type V has greater expansion for alloys with higher casting shrinkage. Reference: Anusavice KJ, Shen C, Rawls HR. Phillips' Science of Dental Materials. 12th ed. High-strength dental stones.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A high-shrinkage base-metal alloy is being cast, and the die material must provide greater setting expansion than a conventional Type IV stone. Which gypsum product is designed for this use?",
                    "options": [
                        "Type I impression plaster",
                        "Type II model plaster",
                        "Type V high-expansion die stone",
                        "Type III dental stone"
                    ],
                    "answer": 2,
                    "explanation": "Type V die stone provides high strength with increased setting expansion to help compensate for the greater casting shrinkage of some base-metal alloys. Material selection must match the complete die and investment system. Reference: Anusavice KJ, Shen C, Rawls HR. Phillips' Science of Dental Materials. 12th ed. Type V gypsum and casting compensation.",
                    "source": "SDLE bank"
                },
                {
                    "q": "Which method accelerates the setting of dental stone without materially degrading the mix quality?",
                    "options": [
                        "Hot tap water",
                        "Slurry water",
                        "More mixing water",
                        "Less spatulation"
                    ],
                    "answer": 1,
                    "explanation": "Slurry water contains suspended gypsum nuclei that accelerate crystallization while avoiding the adverse consistency changes caused by altering the water-powder ratio. Reference: Anusavice KJ, Shen C, Rawls HR. Phillips' Science of Dental Materials. Gypsum products.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A working cast for a removable partial denture must resist routine laboratory handling but does not require the precision of a fixed-prosthodontic die. Which gypsum product is most suitable?",
                    "options": [
                        "Type III dental stone",
                        "Type I impression plaster",
                        "Type II model plaster",
                        "Type V die stone"
                    ],
                    "answer": 0,
                    "explanation": "Type III stone provides greater strength and abrasion resistance than model plaster and is commonly used for working casts. Type IV and V stones are reserved for dies and applications requiring higher strength and controlled expansion. Reference: Anusavice KJ, Shen C, Rawls HR. Phillips' Science of Dental Materials. 12th ed. Gypsum products.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A diagnostic cast is needed for examination and treatment planning, with no requirement for high abrasion resistance. Which gypsum type is generally appropriate?",
                    "options": [
                        "Type III dental stone",
                        "Type IV die stone",
                        "Type V die stone",
                        "Type II model plaster"
                    ],
                    "answer": 3,
                    "explanation": "Type II plaster is suitable for many diagnostic casts and flasking procedures where modest strength is adequate. Working casts exposed to greater manipulation generally require dental stone. Reference: Anusavice KJ, Shen C, Rawls HR. Phillips' Science of Dental Materials. 12th ed. Classification and uses of gypsum products.",
                    "source": "SDLE bank"
                }
            ],
        },
        {
            id: "dm-amalgam",
            title: "06 — Dental Amalgam",
            title_en: "Phases · particle shape · handling",
            summaryHtml: `
<h4 class="deck-topic">Composition</h4>
<ul>
<li>Alloy powder of silver, tin and copper (sometimes zinc) mixed with mercury</li>
<li><b>High-copper</b> alloys contain more than about 12% copper</li>
</ul>
<div class="deck-block deck-tbl"><table>
<thead><tr><th>Phase</th><th>Composition</th><th>Meaning</th></tr></thead>
<tbody>
<tr><td><b>Gamma</b></td><td>Silver-tin (unreacted alloy)</td><td><b>Strongest</b></td></tr>
<tr><td><b>Gamma 1</b></td><td>Silver-mercury</td><td>Main matrix</td></tr>
<tr><td><b>Gamma 2</b></td><td>Tin-mercury</td><td><b>Weakest, corrodes most</b>; largely eliminated in high-copper alloy</td></tr>
</tbody></table></div>
<h4 class="deck-topic">Particle shape (separate from copper content)</h4>
<p>Spherical and admixed alloys <b>can both be high-copper</b>.</p>
<div class="deck-block deck-tbl"><table>
<thead><tr><th></th><th>Spherical</th><th>Lathe-cut or admixed</th></tr></thead>
<tbody>
<tr><td>Mercury needed</td><td><b>Less</b> (smaller surface area to wet)</td><td>More</td></tr>
<tr><td>Condensation</td><td><b>Lower pressure, larger condenser</b></td><td>Firmer pressure, smaller condensers</td></tr>
<tr><td>Proximal contact</td><td><b>Harder</b> to establish</td><td>Easier</td></tr>
<tr><td>Early strength</td><td>Usually gains early</td><td>Slower</td></tr>
</tbody></table></div>
<h4 class="deck-topic">Effect of handling</h4>
<ul>
<li>Under or over-trituration changes plasticity, setting and strength</li>
<li>Delayed condensation weakens the restoration</li>
<li>Good condensation removes excess mercury and voids</li>
<li>Moisture with zinc-containing alloy: delayed expansion</li>
<li><b>Creep</b> contributes to marginal breakdown; it is lower with high copper</li>
</ul>
<h4 class="deck-topic">Safety and clinical points</h4>
<ul>
<li>Use capsules, high-volume suction and sealed scrap containers; use amalgam separators and follow current mercury restrictions for children and pregnancy</li>
<li><b>Galvanic pain</b> that persists between amalgam and opposing or touching gold: <b>replace one of the dissimilar metals</b></li>
<li>Amalgam needs no liner purely for bulk when enough sound dentin remains; protect the pulp according to depth</li>
</ul>
<div class="sum-key"><span class="sum-key-title">نقاط امتحانية</span><ul>
<li>Gamma is strongest; gamma 2 is weakest.</li>
<li>Spherical alloy uses less mercury.</li>
<li>With spherical alloy, watch the contact area.</li>
<li>Persistent galvanism: remove the metal mismatch.</li>
</ul></div>
`,
            questions: [
                {
                    "q": "Which phase is the strongest in conventional dental amalgam?",
                    "options": [
                        "Gamma phase",
                        "Gamma-1 phase",
                        "Gamma-2 phase",
                        "Eta-prime phase"
                    ],
                    "answer": 0,
                    "explanation": "The unreacted silver-tin gamma phase is stronger than the silver-mercury gamma-1 phase, while the tin- mercury gamma-2 phase is the weakest and most corrosion prone. Reference: Anusavice KJ, Shen C, Rawls HR. Phillips' Science of Dental Materials. Amalgam phases.",
                    "source": "SDLE bank"
                },
                {
                    "q": "Which statement correctly distinguishes particle shape from copper content in dental amalgam?",
                    "options": [
                        "Every spherical alloy is low copper",
                        "Particle shape alone determines the gamma-2 phase",
                        "Spherical and admixed alloys may both be high copper",
                        "Lathe-cut particles cannot contain copper"
                    ],
                    "answer": 2,
                    "explanation": "Particle morphology and alloy chemistry are separate classifications. High-copper amalgams may be single-composition spherical alloys or admixed systems, and copper content is responsible for eliminating or greatly reducing the weak gamma-2 phase. Reference: Anusavice KJ, Shen C, Rawls HR. Phillips' Science of Dental Materials. 12th ed. Classification and setting reactions of dental amalgam.",
                    "source": "SDLE bank"
                },
                {
                    "q": "Why does a properly manipulated spherical amalgam typically need a lower alloy-to-mercury ratio than a comparable lathe-cut product?",
                    "options": [
                        "Spherical particles chemically produce mercury",
                        "Lathe-cut particles contain no silver",
                        "Copper prevents all wetting of the alloy",
                        "Spherical particles have less total surface area to wet"
                    ],
                    "answer": 3,
                    "explanation": "For a given volume, spherical particles present less total surface area than irregular lathe-cut particles. Less mercury is therefore needed to coat and wet their surfaces sufficiently for a plastic mix. Reference: Anusavice KJ, Shen C, Rawls HR. Phillips' Science of Dental Materials. 12th ed. Particle size and shape in dental amalgam.",
                    "source": "SDLE bank"
                },
                {
                    "q": "Which condensation approach is generally appropriate for a spherical amalgam alloy compared with a lathe-cut alloy?",
                    "options": [
                        "Lower condensation pressure with a larger condenser",
                        "Higher pressure with a needle-point condenser",
                        "No condensation because the alloy self-adapts",
                        "Condensation only after the material sets"
                    ],
                    "answer": 0,
                    "explanation": "Spherical alloys are highly plastic and adapt under lower condensation pressure; a condenser with a larger face helps control the mass without sinking deeply into it. Adequate incremental condensation remains necessary. Reference: Ritter AV, Boushell LW, Walter R, eds. Sturdevant's Art and Science of Operative Dentistry. 7th ed. Condensation of spherical amalgam; Anusavice KJ, et al. Phillips' Science of Dental Materials. 12th ed.",
                    "source": "SDLE bank"
                },
                {
                    "q": "Persistent galvanic pain occurs between an amalgam restoration and an opposing gold restoration. What is the definitive management?",
                    "options": [
                        "Extract both teeth",
                        "Replace one dissimilar-metal restoration",
                        "Apply fluoride varnish",
                        "Observe indefinitely"
                    ],
                    "answer": 1,
                    "explanation": "Removing one member of the dissimilar-metal couple eliminates the electrochemical source when galvanic symptoms persist. Reference: Anusavice KJ, Shen C, Rawls HR. Phillips' Science of Dental Materials. Galvanic corrosion and pain.",
                    "source": "SDLE bank"
                }
            ],
        },
        {
            id: "dm-acrylic",
            title: "07 — Acrylic Denture Base Resins",
            title_en: "Dough stage · porosity · monomer",
            summaryHtml: `
<h4 class="deck-topic">Materials</h4>
<ul>
<li>Powder: mainly polymethyl methacrylate beads with initiator. Liquid: <b>methyl methacrylate</b> monomer with inhibitor and often a cross-linking agent</li>
<li>Common proportion about <b>3 : 1 polymer to monomer by volume</b>; follow the product</li>
</ul>
<div class="sum-algo"><span class="sum-algo-title">Stages after mixing</span><ol>
<li>Wet, sandy</li>
<li>Stringy or sticky</li>
<li><b>Dough: pack here</b></li>
<li>Rubbery</li>
<li>Stiff</li>
</ol></div>
<div class="deck-block deck-tbl"><table>
<thead><tr><th>Error</th><th>Result</th></tr></thead>
<tbody>
<tr><td><b>Too much monomer</b></td><td>More <b>polymerisation shrinkage</b>, possible residual monomer and porosity</td></tr>
<tr><td><b>Too little monomer</b></td><td>Dry, <b>granular</b> mix, beads not wetted</td></tr>
<tr><td>Heating too fast in thick parts</td><td>Heat of reaction <b>boils the monomer</b>: internal porosity</td></tr>
<tr><td>Under-packing or low pressure</td><td>Voids</td></tr>
<tr><td>Fast cooling or early deflasking</td><td>Stress and warping</td></tr>
<tr><td>Incomplete cure</td><td><b>Residual monomer</b>: burning, mucosal sensitivity, weaker base</td></tr>
</tbody></table></div>
<h4 class="deck-topic">Processing the mould</h4>
<ul>
<li>After wax elimination, <b>remove all wax</b> first, then paint a thin even coat of <b>tin-foil substitute</b></li>
<li>The separator stops the resin sticking and limits <b>water exchange</b> with the gypsum</li>
<li>Keep separator <b>off the ridge-lap of acrylic teeth</b>, or their bond to the base suffers</li>
<li><b>Acrylic teeth bond chemically</b> to the base and are easy to adjust; porcelain teeth need mechanical retention</li>
</ul>
<h4 class="deck-topic">Clinical points</h4>
<ul>
<li>Repeated <b>midline fracture</b> of a complete denture: check <b>fit, occlusion, frenal notch, thickness and processing</b> before repairing</li>
<li>A distal-extension RPD that will need relining: <b>acrylic base</b> on the extension. A bounded space with stable ridge and little room: a metal base is rigid and strong while thin</li>
<li>Denture adhesive helps a reasonably fitting denture; it does not replace correction of a poor one</li>
<li>Resilient and tissue-conditioning materials are temporary or need regular review</li>
</ul>
<div class="sum-key"><span class="sum-key-title">نقاط امتحانية</span><ul>
<li>Pack at the dough stage.</li>
<li>Thick-section porosity: monomer boiling.</li>
<li>Residual monomer is the usual irritant.</li>
<li>Find the cause of a midline fracture before repair.</li>
</ul></div>
`,
            questions: [
                {
                    "q": "At which stage should heat-polymerized acrylic denture-base resin be packed into the mold?",
                    "options": [
                        "Dough stage",
                        "Sandy stage",
                        "Stringy stage",
                        "Rubbery stage"
                    ],
                    "answer": 0,
                    "explanation": "At the dough stage the material is cohesive and nonsticky enough to pack and adapt while retaining plasticity. Packing too early or too late increases processing defects. Reference: Anusavice KJ et al. Phillips' Science of Dental Materials. Manipulation of acrylic denture-base resin. Page",
                    "source": "SDLE bank"
                },
                {
                    "q": "What processing error commonly produces internal porosity in a thick acrylic denture base?",
                    "options": [
                        "Adequate long curing cycle",
                        "Correct powder-liquid ratio",
                        "Excessive exothermic heat causing monomer boiling",
                        "Slow cooling in the flask"
                    ],
                    "answer": 2,
                    "explanation": "Rapid high-temperature curing in thick sections may raise resin temperature above monomer boiling point, producing gaseous porosity. Controlled curing reduces this risk. Reference: Anusavice KJ, Shen C, Rawls HR. Phillips' Science of Dental Materials. 12th ed. Acrylic resin processing defects.",
                    "source": "SDLE bank"
                },
                {
                    "q": "What is the most likely effect of insufficient monomer in acrylic resin dough?",
                    "options": [
                        "A dry, granular mix with incomplete particle wetting",
                        "Excessive flow indefinitely",
                        "Increased residual monomer only",
                        "Complete elimination of polymerization heat"
                    ],
                    "answer": 0,
                    "explanation": "Too little liquid prevents adequate wetting and coalescence of polymer beads, producing poor adaptation and a weak or granular base. Reference: Anusavice KJ, Shen C, Rawls HR. Phillips' Science of Dental Materials. 12th ed. Manipulation of acrylic resin.",
                    "source": "SDLE bank"
                },
                {
                    "q": "Why should denture-processing separating medium not coat the ridge-lap surfaces of acrylic denture teeth?",
                    "options": [
                        "It increases gypsum strength excessively",
                        "It may interfere with bonding to the denture-base resin",
                        "It converts acrylic resin to porcelain",
                        "It makes the teeth radiolucent"
                    ],
                    "answer": 1,
                    "explanation": "The tooth surfaces intended to unite with the denture base must remain clean and available for resin bonding. A separating film at that interface can contribute to tooth debonding. Reference: Zarb GA, Hobkirk J, Eckert S, Jacob R. Prosthodontic Treatment for Edentulous Patients. 13th ed. Processing and bonding of denture teeth; Anusavice KJ, et al. Phillips' Science of Dental Materials. 12th ed.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A maxillary acrylic complete denture repeatedly fractures at the midline. What should be evaluated before repair?",
                    "options": [
                        "Fit, occlusion, frenal notch, thickness, and processing defects",
                        "Tooth shade only",
                        "Salivary pH only",
                        "Patient age only"
                    ],
                    "answer": 0,
                    "explanation": "Midline fracture can result from flexure over a resorbed ridge, occlusal imbalance, thin base, deep notch, porosity, or impact. Repair without cause correction invites recurrence. Reference: Anusavice KJ, Shen C, Rawls HR. Phillips' Science of Dental Materials. 12th ed. Denture-base resin failure.",
                    "source": "SDLE bank"
                }
            ],
        },
        {
            id: "dm-metals",
            title: "08 — Alloys, Investments and Casting",
            title_en: "Gold · base metal · titanium · investment",
            summaryHtml: `
<h4 class="deck-topic">Alloys</h4>
<div class="deck-block deck-tbl"><table>
<thead><tr><th>Metal</th><th>Notes</th></tr></thead>
<tbody>
<tr><td><b>Gold</b></td><td>The <b>most ductile and malleable</b> dental metal; resists corrosion</td></tr>
<tr><td><b>Cobalt-chromium</b></td><td>The usual <b>RPD framework</b>: stiff, light, corrosion resistant; hard to adjust</td></tr>
<tr><td>Nickel-chromium</td><td>Used for crowns and metal-ceramic work; ask about <b>nickel allergy</b></td></tr>
<tr><td><b>Titanium (Ti-6Al-4V)</b></td><td>Titanium with 6% <b>aluminium</b> and 4% vanadium; strong, biocompatible through its oxide layer</td></tr>
</tbody></table></div>
<h4 class="deck-topic">Investments</h4>
<div class="deck-block deck-tbl"><table>
<thead><tr><th>Binder</th><th>Use</th></tr></thead>
<tbody>
<tr><td><b>Gypsum-bonded</b></td><td>Conventional lower-fusing <b>gold</b> alloys; gypsum breaks down at high temperature</td></tr>
<tr><td><b>Phosphate-bonded</b></td><td><b>High-fusing metal-ceramic</b> and many base-metal alloys</td></tr>
<tr><td>Silica (ethyl silicate)-bonded</td><td>Some high-fusing base-metal framework alloys</td></tr>
</tbody></table></div>
<ul>
<li>Investment <b>expansion</b> (setting, hygroscopic, thermal) compensates for wax and metal shrinkage</li>
<li>A <b>resilient ring liner</b> allows the investment to expand more evenly</li>
</ul>
<div class="sum-algo"><span class="sum-algo-title">Lost-wax casting</span><ol>
<li>Make the wax pattern and attach the sprue</li>
<li>Invest under correct ratio, preferably vacuum mixed</li>
<li>Burn out the wax</li>
<li>Cast the molten alloy</li>
<li>Recover, finish and check the fit</li>
</ol></div>
<ul>
<li>Common casting faults: porosity (poor sprue design or reservoir), fins (heating too fast, cracked investment), incomplete casting (alloy too cold, poor venting), surface nodules (trapped air)</li>
<li><b>Soldering flux</b> removes and prevents oxides so the solder <b>wets and flows</b>; antiflux limits where it goes</li>
<li>Porcelain bonded to metal needs support: uneven preparation leaving thick unsupported porcelain invites fracture. Alloy and porcelain thermal expansion must be compatible</li>
</ul>
<div class="sum-key"><span class="sum-key-title">نقاط امتحانية</span><ul>
<li>Gold casting: gypsum-bonded investment.</li>
<li>Metal-ceramic alloy: phosphate-bonded.</li>
<li>RPD framework: cobalt-chromium.</li>
<li>Flux improves solder flow.</li>
</ul></div>
`,
            questions: [
                {
                    "q": "A conventional low-fusing gold alloy is being cast. Which material category is commonly selected to invest the wax pattern?",
                    "options": [
                        "Gypsum-bonded investment",
                        "Type II model plaster alone",
                        "Type IV die stone alone",
                        "Polycarboxylate cement"
                    ],
                    "answer": 0,
                    "explanation": "Gypsum-bonded investments are used for many lower-fusing noble alloys. They are distinct from model plaster and die stone because they contain refractory silica to withstand casting procedures and provide expansion. Reference: Anusavice KJ, Shen C, Rawls HR. Phillips' Science of Dental Materials. 12th ed. Gypsum-bonded investments.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A wax pattern for a high-fusing metal-ceramic alloy must be invested before casting. Which investment system is generally appropriate?",
                    "options": [
                        "Model plaster",
                        "Dental stone",
                        "Zinc phosphate cement",
                        "Phosphate-bonded investment"
                    ],
                    "answer": 3,
                    "explanation": "Phosphate-bonded investments tolerate the higher burnout and casting temperatures used with many base-metal and metal-ceramic alloys. Ordinary gypsum cast materials do not function as refractory investments for this application. Reference: Anusavice KJ, Shen C, Rawls HR. Phillips' Science of Dental Materials. 12th ed. Dental casting investments.",
                    "source": "SDLE bank"
                },
                {
                    "q": "What is the purpose of a resilient liner inside a casting ring?",
                    "options": [
                        "Permit more uniform investment expansion",
                        "Prevent all investment shrinkage",
                        "Eliminate burnout",
                        "Increase alloy hardness"
                    ],
                    "answer": 0,
                    "explanation": "The liner reduces restriction by the metal ring and allows more uniform setting and thermal expansion of the investment. Reference: Anusavice KJ, Shen C, Rawls HR. Phillips' Science of Dental Materials. Casting investments.",
                    "source": "SDLE bank"
                },
                {
                    "q": "Which alloy is most commonly used for a cast removable partial denture framework?",
                    "options": [
                        "Pure palladium",
                        "Cobalt-chromium alloy",
                        "Dental amalgam",
                        "Zinc-phosphate alloy"
                    ],
                    "answer": 1,
                    "explanation": "Cobalt-chromium alloys are widely used for cast RPD frameworks because they provide high rigidity and strength at relatively small cross-sectional dimensions. Titanium and noble alloys may be used in selected circumstances. Reference: Anusavice KJ et al. Phillips' Science of Dental Materials. Base-metal alloys for removable partial denture frameworks. Page",
                    "source": "SDLE bank"
                },
                {
                    "q": "Which element is present in the commonly used Ti-6Al-4V dental titanium alloy?",
                    "options": [
                        "Aluminum",
                        "Silver",
                        "Gold",
                        "Palladium"
                    ],
                    "answer": 0,
                    "explanation": "Ti-6Al-4V contains approximately 6% aluminum and 4% vanadium, with titanium forming the balance. Reference: Anusavice KJ, Shen C, Rawls HR. Phillips' Science of Dental Materials. Titanium alloys.",
                    "source": "SDLE bank"
                }
            ],
        },
        {
            id: "dm-properties",
            title: "09 — Material Properties and Colour",
            title_en: "Stress · strain · expansion · shade",
            summaryHtml: `
<h4 class="deck-topic">Mechanical terms</h4>
<div class="deck-block deck-tbl"><table>
<thead><tr><th>Term</th><th>Meaning</th></tr></thead>
<tbody>
<tr><td>Stress / strain</td><td>Internal force per area / relative deformation</td></tr>
<tr><td><b>Modulus of elasticity</b></td><td><b>Stiffness</b>: slope of the elastic part of the stress-strain curve</td></tr>
<tr><td>Elastic limit / yield strength</td><td>Where permanent deformation begins</td></tr>
<tr><td><b>Resilience</b></td><td>Energy absorbed <b>within the elastic limit</b></td></tr>
<tr><td><b>Toughness</b></td><td>Total energy absorbed <b>up to fracture</b></td></tr>
<tr><td><b>Ductility</b></td><td>Deforms under <b>tension</b>: can be drawn into wire</td></tr>
<tr><td><b>Malleability</b></td><td>Deforms under <b>compression</b>: can be hammered into sheet</td></tr>
<tr><td>Brittleness</td><td>Fractures with little plastic deformation</td></tr>
<tr><td>Hardness</td><td>Resistance to indentation</td></tr>
<tr><td>Fatigue</td><td>Failure after repeated loading</td></tr>
<tr><td><b>Creep</b></td><td>Slow time-dependent deformation under load</td></tr>
</tbody></table></div>
<h4 class="deck-topic">Flow and thermal behaviour</h4>
<ul>
<li><b>Thixotropy</b>: viscosity falls when the material is sheared or agitated and recovers at rest. In impression and gel materials this stops dripping until force is applied</li>
<li><b>Coefficient of linear thermal expansion</b>: change in length per unit original length for each 1 degree Celsius. A mismatch with tooth encourages <b>microleakage</b></li>
<li>Low thermal conductivity helps protect the pulp</li>
<li>Wetting: a small contact angle means better spreading, important for adhesives</li>
</ul>
<h4 class="deck-topic">Colour (Munsell terms)</h4>
<ul>
<li><b>Hue</b>: the colour family</li>
<li><b>Chroma</b>: saturation or intensity</li>
<li><b>Value</b>: lightness to darkness. It is usually the most noticeable mismatch; a tooth that looks <b>darker</b> has lower value</li>
<li><b>Metamerism</b>: two shades match under one light and differ under another, so check under more than one source</li>
<li>Choose the shade early, before teeth dehydrate and eyes tire</li>
</ul>
<div class="sum-algo"><span class="sum-algo-title">Choosing a material</span><ol>
<li>Load and wear at the site</li>
<li>Moisture control possible</li>
<li>Pulp and tissue compatibility</li>
<li>Appearance</li>
<li>Handling instructions you can follow</li>
</ol></div>
<div class="sum-key"><span class="sum-key-title">نقاط امتحانية</span><ul>
<li>High modulus means stiff.</li>
<li>Resilience stops at the elastic limit; toughness runs to fracture.</li>
<li>Darker or lighter describes value.</li>
<li>Thixotropic materials thin under shear.</li>
</ul></div>
`,
            questions: [
                {
                    "q": "What mechanical property is quantified by the modulus of elasticity?",
                    "options": [
                        "Resilience",
                        "Stiffness",
                        "Toughness",
                        "Ductility"
                    ],
                    "answer": 1,
                    "explanation": "Elastic modulus is the slope of the elastic stress-strain curve and expresses resistance to elastic deformation. Reference: Anusavice KJ, Shen C, Rawls HR. Phillips' Science of Dental Materials. Mechanical properties.",
                    "source": "SDLE bank"
                },
                {
                    "q": "What is resilience?",
                    "options": [
                        "Energy required for fracture",
                        "Permanent deformation before fracture",
                        "Energy absorbed within the elastic limit",
                        "Resistance to scratching"
                    ],
                    "answer": 2,
                    "explanation": "Resilience is the energy per unit volume a material can absorb elastically and release upon unloading. Reference: Anusavice KJ, Shen C, Rawls HR. Phillips' Science of Dental Materials. Resilience.",
                    "source": "SDLE bank"
                },
                {
                    "q": "What does thixotropy mean?",
                    "options": [
                        "Viscosity increases permanently with heat",
                        "A solid dissolves in water",
                        "A material expands without stress",
                        "Viscosity decreases under shear"
                    ],
                    "answer": 3,
                    "explanation": "A thixotropic material becomes less viscous and flows more readily when shear or repeated pressure is applied, then recovers at rest. Reference: Anusavice KJ, Shen C, Rawls HR. Phillips' Science of Dental Materials. Rheology and thixotropy.",
                    "source": "SDLE bank"
                },
                {
                    "q": "What property describes the change in length per unit original length for each 1°C temperature change?",
                    "options": [
                        "Thermal conductivity",
                        "Specific heat",
                        "Coefficient of linear thermal expansion",
                        "Elastic modulus"
                    ],
                    "answer": 2,
                    "explanation": "The coefficient of linear thermal expansion quantifies fractional length change per degree of temperature change. Reference: Anusavice KJ, Shen C, Rawls HR. Phillips' Science of Dental Materials. Thermal properties.",
                    "source": "SDLE bank"
                },
                {
                    "q": "Which dental metal is the most ductile and malleable?",
                    "options": [
                        "Gold",
                        "Titanium",
                        "Platinum",
                        "Dental amalgam"
                    ],
                    "answer": 0,
                    "explanation": "Pure gold has exceptional ductility and malleability, allowing extensive deformation in tension and compression without fracture. Reference: Anusavice KJ, Shen C, Rawls HR. Phillips' Science of Dental Materials. Noble metals and mechanical properties.",
                    "source": "SDLE bank"
                }
            ],
        },
    ],
};

export default dentalDentalMaterials;
