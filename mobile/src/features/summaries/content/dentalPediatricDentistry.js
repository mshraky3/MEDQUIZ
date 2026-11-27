// AUTO-COPIED from my-react-app/src/components/summaries/content/dentalPediatricDentistry.js. Do not edit here:
// change the website's file, then run `npm run sync:summaries` in mobile/.
// Pediatric Dentistry — dental-track section of the summaries catalog.
// Mirrored for the slide viewer in backend/content/summaryHtml (keep the two in sync).
// Inline questions are copied from the SQB bank.
const dentalPediatricDentistry = {
    id: "pediatric-dentistry",
    title: "Pediatric Dentistry",
    title_en: "SDLE Review — 9 Topics",
    icon: "shield-check",
    accent: "#a78bfa",
    intro: "Pediatric Dentistry — focused SDLE revision: Primary Tooth Pulp Therapy · Trauma to Primary Teeth · Full-coverage & Other Restorations · Fluoride, Sealants & Radiographs · Space Management · Anatomy, Eruption & Development · Behaviour, Local Anaesthetic & Drug Doses · Oral Mucosal Disease · Safeguarding, Syndromes & Systemic Warnings.",
    subtopics: [
        {
            id: "pd-pulp",
            title: "01 — Primary Tooth Pulp Therapy",
            title_en: "Indirect cap · pulpotomy · pulpectomy",
            summaryHtml: `
<h4 class="deck-topic">Diagnose first</h4>
<ul>
  <li>Use history, swelling, sinus tract, abnormal mobility, tenderness and radiographs of the furcation and apices. Sensibility tests are unreliable in young children.</li>
  <li>In primary molars, infection often shows first in the <b>furcation</b>.</li>
  <li>A periapical radiograph is useful to see roots, furcation and the permanent successor.</li>
</ul>
<div class="deck-block deck-tbl">
  <table>
    <thead><tr><th>Pulp status</th><th>Treatment</th></tr></thead>
    <tbody>
      <tr><td>Deep caries, no signs of irreversible disease, not exposed</td><td><b>Indirect pulp treatment</b> with a good seal</td></tr>
      <tr><td>Carious exposure, inflammation limited to coronal pulp</td><td><b>Pulpotomy</b></td></tr>
      <tr><td>Irreversible disease of radicular pulp or necrosis, tooth restorable</td><td><b>Pulpectomy</b></td></tr>
      <tr><td>Unrestorable, advanced root resorption, pulp floor destroyed or successor threatened</td><td><b>Extraction</b> and consider space</td></tr>
    </tbody>
  </table>
</div>
<ul>
  <li><b>Direct pulp capping</b> of a carious exposure in a primary tooth is generally avoided; internal resorption is the classic failure.</li>
</ul>
<h4 class="deck-topic">Reading the bleeding during pulpotomy</h4>
<div class="sum-algo">
  <span class="sum-algo-title">After removing coronal pulp</span>
  <ol>
    <li>Check that no tissue tags remain under the roof ledges; they keep bleeding.</li>
    <li>Apply gentle pressure with a moist pellet.</li>
    <li>Bleeding stops in a few minutes: continue pulpotomy.</li>
    <li>Profuse bleeding persists from canal orifices: <b>radicular pulp is inflamed</b>; move to pulpectomy or extraction.</li>
    <li>No bleeding at all: suspect <b>necrosis</b>.</li>
  </ol>
</div>
<ul>
  <li>Pain after treatment alone does not prove that coronal tissue was left behind.</li>
</ul>
<h4 class="deck-topic">Materials</h4>
<ul>
  <li><b>MTA</b> and similar calcium silicate materials show high success; current evidence favours MTA over ferric sulfate by two years.</li>
  <li><b>Ferric sulfate</b> is mainly a hemostatic. <b>Formocresol</b> works but raises long-standing toxicity concerns.</li>
  <li>Possible findings after ferric sulfate include internal resorption and canal obliteration. Obliteration alone is not failure; progressive resorption with furcation radiolucency <b>is failure</b>.</li>
  <li>Pulpectomy fillers must resorb: zinc oxide eugenol or iodoform with calcium hydroxide pastes. ZOE may resorb <b>more slowly than the root</b>.</li>
  <li>Finish with a well-sealed restoration; a <b>stainless-steel crown</b> is usual for a pulp-treated molar.</li>
</ul>
<div class="sum-key">
  <span class="sum-key-title">نقاط امتحانية</span>
  <ul>
    <li>Pulpotomy needs a healthy radicular pulp.</li>
    <li>Uncontrolled orifice bleeding changes the plan.</li>
    <li>Carious exposure plus direct cap risks <b>internal resorption</b>.</li>
    <li>Success depends heavily on the coronal seal.</li>
  </ul>
</div>
      `,
            questions: [
                {
                    "q": "After the chamber is visibly clean, profuse bleeding persists from the canal orifices despite appropriate hemostasis. What is the main concern?",
                    "options": [
                        "Radicular pulp inflammation",
                        "Retained chamber roof",
                        "Enamel hypoplasia",
                        "Tooth ankylosis"
                    ],
                    "answer": 0,
                    "explanation": "Bleeding that arises from the orifices after complete coronal tissue removal suggests disease extending into the radicular pulp rather than a chamber remnant. The planned pulpotomy should be reassessed. Reference: American Association of Endodontists. Position Statement on Vital Pulp Therapy. 2021; American Academy of Pediatric Dentistry. Guideline for Use of Vital Pulp Therapy in Permanent Teeth. 2025.",
                    "source": "SDLE bank"
                },
                {
                    "q": "During attempted pulpotomy of a deeply carious primary tooth, no bleeding occurs after coronal pulp removal. What is the most likely pulpal status?",
                    "options": [
                        "Healthy pulp",
                        "Inflamed vital pulp",
                        "Necrotic pulp",
                        "Hyperemic pulp"
                    ],
                    "answer": 2,
                    "explanation": "Absence of bleeding from the pulp chamber after coronal tissue removal suggests loss of vascular vitality and pulp necrosis. Reference: American Academy of Pediatric Dentistry. Pulp Therapy for Primary and Immature Permanent Teeth. Current best-practice guidance.",
                    "source": "SDLE bank"
                },
                {
                    "q": "Which adverse pulpal consequence is classically associated with direct pulp capping of a cariously exposed primary tooth?",
                    "options": [
                        "Pulp-canal obliteration",
                        "Internal resorption",
                        "External resorption",
                        "Ankylosis"
                    ],
                    "answer": 1,
                    "explanation": "Primary-tooth pulps can show persistent inflammation and odontoclast activation after direct capping, leading to internal resorption. This is one reason direct pulp capping is generally limited to very small, clean mechanical/traumatic exposures in carefully selected primary teeth and is not preferred for carious exposures. Reference: Dean JA, ed. McDonald and Avery’s Dentistry for the Child and Adolescent. 11th ed. Chapter 14, “Treatment of Deep Caries, Vital Pulp Exposure, and Pulpless Teeth”; exact pages require verification. Nowak AJ, Christensen JR, Mabry TR, Townsend JA, Wells MH, eds. Pediatric Dentistry: Infancy Through Adolescence. 6th ed. Chapter on pulp therapy for primary teeth; exact pages require verification.",
                    "source": "SDLE bank"
                },
                {
                    "q": "For vital primary-molar pulpotomy, which material has shown higher 24-month success than ferric sulfate in contemporary evidence?",
                    "options": [
                        "Eugenol alone",
                        "MTA",
                        "Saline",
                        "Gutta-percha"
                    ],
                    "answer": 1,
                    "explanation": "Recent systematic evidence reports higher 24-month success for MTA than ferric sulfate. Current material choice should follow the most recent pediatric vital-pulp guideline and the individual clinical setting. Reference: Coll JA, et al. Primary Tooth Vital Pulp Treatment Interventions: Systematic Review and Meta-Analyses. Pediatr Dent. 2023;45(6):488-505. PMID:38129755; American Academy of Pediatric Dentistry. Use of Vital Pulp Therapies in Primary Teeth. 2024.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A primary molar develops progressive internal resorption and furcation radiolucency after ferric-sulfate pulpotomy. How should this be classified?",
                    "options": [
                        "Normal healing",
                        "Apexogenesis",
                        "Treatment failure",
                        "Pulp canal obliteration"
                    ],
                    "answer": 2,
                    "explanation": "Progressive resorption and furcation disease indicate persistent pathosis rather than stable repair. Management depends on restorability, root resorption, proximity to exfoliation, and the condition of the permanent successor. Reference: American Academy of Pediatric Dentistry. Pulp Therapy for Primary and Immature Permanent Teeth. 2025; Papagiannoulis L. Eur J Paediatr Dent. 2002;3(3):126-132.",
                    "source": "SDLE bank"
                }
            ],
        },
        {
            id: "pd-trauma",
            title: "02 — Trauma to Primary Teeth",
            title_en: "Intrusion · root fracture · successor",
            summaryHtml: `
<h4 class="deck-topic">Priorities</h4>
<ul>
  <li>Rule out head injury, airway risk and inhaled fragments.</li>
  <li>Ask whether the history matches the injury and the child's development.</li>
  <li>The main concern for treatment choice is the child's comfort and safety of the <b>developing permanent successor</b>.</li>
</ul>
<div class="deck-block deck-tbl">
  <table>
    <thead><tr><th>Injury</th><th>Usual approach (IADT-style)</th></tr></thead>
    <tbody>
      <tr><td><b>Avulsion</b></td><td><b>Do not replant</b> a primary tooth</td></tr>
      <tr><td><b>Intrusion</b></td><td>Usually allow <b>spontaneous repositioning</b> and review</td></tr>
      <tr><td><b>Lateral luxation</b></td><td>Often left to reposition; if the bite is blocked, manage by minor adjustment, repositioning or extraction by severity</td></tr>
      <tr><td><b>Severe extrusion</b></td><td>Extraction is commonly chosen if very mobile or markedly displaced</td></tr>
      <tr><td><b>Root fracture</b>, coronal part very mobile and displaced</td><td>Remove the <b>coronal fragment only</b>; leave the apical piece to resorb</td></tr>
    </tbody>
  </table>
</div>
<ul>
  <li>Do not dig for an apical fragment near the successor. A fragment that later becomes infected needs removal; a superficial, easy, infected tip can be taken out gently.</li>
</ul>
<h4 class="deck-topic">Colour change</h4>
<ul>
  <li><b>Gray</b> discoloration may fade. With no pain, swelling, sinus tract or radiographic disease, <b>observe</b>.</li>
  <li>Yellow colour often reflects pulp canal obliteration.</li>
  <li>Signs of infection require extraction or pulp treatment.</li>
</ul>
<h4 class="deck-topic">Effects on the successor</h4>
<ul>
  <li>Enamel discoloration or <b>hypoplasia</b>, crown or root dilaceration and eruption disturbance.</li>
  <li>Risk is higher with intrusion and avulsion at a young age.</li>
</ul>
<h4 class="deck-topic">Chin trauma</h4>
<ul>
  <li>A fall on the chin transmits force to the condyles: examine for a <b>condylar fracture</b> (preauricular pain, limited opening, deviation, open bite) and look for crown-root fractures of back teeth.</li>
</ul>
<h4 class="deck-topic">Home advice</h4>
<ul>
  <li>Soft diet for a short period, gentle brushing, alcohol-free antiseptic applied topically if advised, and return for swelling, fever, pain or increased mobility.</li>
</ul>
<div class="sum-key">
  <span class="sum-key-title">نقاط امتحانية</span>
  <ul>
    <li>Avulsed primary tooth: <b>no replantation</b>.</li>
    <li>Uncomplicated intrusion: wait for re-eruption.</li>
    <li>Quiet gray tooth: monitor.</li>
    <li>Chin blow: check the <b>condyles</b>.</li>
  </ul>
</div>
      `,
            questions: [
                {
                    "q": "After trauma, a primary incisor developed gray discoloration that is now becoming lighter. The child has no pain, swelling, sinus tract, mobility, or radiographic pathology. What is the management?",
                    "options": [
                        "Pulpectomy",
                        "Extraction",
                        "Pulpotomy",
                        "Clinical follow-up"
                    ],
                    "answer": 3,
                    "explanation": "Transient or improving discoloration without clinical or radiographic signs of infection is monitored rather than treated solely on the basis of color. Reference: Day PF, Flores MT, O'Connell AC, et al. International Association of Dental Traumatology guidelines: injuries in the primary dentition. Dent Traumatol. 2020;36(4):343-359.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A primary incisor has a root fracture. The coronal fragment is displaced and excessively mobile, while the apical fragment lies near the successor. What should be extracted?",
                    "options": [
                        "Both fragments",
                        "Coronal fragment only",
                        "Apical fragment only",
                        "Neither fragment"
                    ],
                    "answer": 1,
                    "explanation": "The problematic coronal fragment may be removed, while the apical fragment is left for physiologic resorption to avoid injury to the developing permanent tooth. Reference: Day PF, et al. Dent Traumatol. 2020;36:343-359. Primary-tooth root-fracture recommendations.",
                    "source": "SDLE bank"
                },
                {
                    "q": "Which developmental effect is most commonly reported in a permanent successor after trauma to its primary predecessor?",
                    "options": [
                        "Pulp necrosis",
                        "Enamel hypoplasia",
                        "Root ankylosis",
                        "Cervical resorption"
                    ],
                    "answer": 1,
                    "explanation": "Enamel discoloration and/or hypoplasia is the most frequently reported developmental sequela after trauma to a primary predecessor. Intrusive injuries produce the greatest overall risk because of the close relationship between the primary root and the developing permanent tooth germ. Reference: Lenzi MM, et al. Does Trauma in the Primary Dentition Cause Sequelae in Permanent Successors? A Systematic Review. Dent Traumatol. 2015;31(2):79-88. doi:10.1111/edt.12149; Caeiro-Villasenín L, et al. Developmental Dental Defects in Permanent Teeth Resulting from Trauma in Primary Dentition: A Systematic Review. Int J Environ Res Public Health. 2022;19(2):754. doi:10.3390/ijerph19020754.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A child falls directly onto the chin. Which mandibular fracture should be specifically suspected?",
                    "options": [
                        "Angle fracture",
                        "Coronoid fracture",
                        "Condylar fracture",
                        "Alveolar fracture only"
                    ],
                    "answer": 2,
                    "explanation": "Impact to the chin transmits force posteriorly to the condylar processes and may cause unilateral or bilateral condylar fractures. The chin and symphysis must also be examined for a second fracture. Reference: Hupp JR et al. Contemporary Oral and Maxillofacial Surgery. 8th ed. Pediatric mandibular trauma.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A retained primary root fragment later develops swelling and a radiolucency. What is the best management?",
                    "options": [
                        "Continue observation only",
                        "Place a rigid splint",
                        "Remove the infected fragment",
                        "Apply fluoride varnish"
                    ],
                    "answer": 2,
                    "explanation": "Infection changes the risk-benefit balance and generally requires removal or specialist surgical management. The procedure must still protect the permanent successor. Reference: American Academy of Pediatric Dentistry. Management Considerations for Pediatric Oral Surgery and Oral Pathology. Current Reference Manual.",
                    "source": "SDLE bank"
                }
            ],
        },
        {
            id: "pd-restorations",
            title: "03 — Restoring Primary Teeth",
            title_en: "Stainless-steel crown · Hall · composite",
            summaryHtml: `
<h4 class="deck-topic">Choose by extent, risk and cooperation</h4>
<div class="deck-block deck-tbl">
  <table>
    <thead><tr><th>Situation</th><th>Good choice</th></tr></thead>
    <tbody>
      <tr><td>Small one or two surface lesion, good isolation</td><td>Resin composite</td></tr>
      <tr><td>Difficult moisture control, high risk, interim care</td><td>Glass ionomer based material</td></tr>
      <tr><td><b>Extensive multisurface</b> molar, after pulp therapy, enamel defects</td><td><b>Stainless-steel crown</b></td></tr>
      <tr><td>Extensive anterior caries</td><td>Strip crown, pre-veneered or zirconia crown as conditions allow</td></tr>
    </tbody>
  </table>
</div>
<ul>
  <li>The stainless-steel crown is the most durable full-coverage option for primary molars, particularly in high caries risk or limited cooperation.</li>
</ul>
<h4 class="deck-topic">Conventional crown steps</h4>
<div class="sum-algo">
  <span class="sum-algo-title">Sequence</span>
  <ol>
    <li>Anaesthetise, isolate and remove caries; do pulp treatment if needed.</li>
    <li>Reduce occlusally about 1 to 1.5 mm and open both contacts with smooth, ledge-free slices.</li>
    <li>Choose the size, trim and crimp for a snug margin just below the gingiva.</li>
    <li>At try-in check seating, margins, contacts and any <b>gross high bite</b>.</li>
    <li>Cement, remove all excess (floss the contacts) and recheck occlusion.</li>
  </ol>
</div>
<ul>
  <li>A high spot with good margins and contacts: <b>adjust and polish</b>.</li>
  <li>Resin-modified glass ionomer for cementation gives chemical adhesion, fluoride release and better early properties.</li>
</ul>
<h4 class="deck-topic">Hall technique</h4>
<ul>
  <li>A preformed crown is cemented over the carious primary molar <b>without local anaesthetic, caries removal or preparation</b>.</li>
  <li>Only when there are no clinical or radiographic signs of irreversible pulp disease, the tooth can take a crown and the child can protect the airway.</li>
  <li>A temporary rise in bite usually settles.</li>
  <li>Choosing conventional, Hall or other care depends on pulp diagnosis, restorability, cooperation and consent.</li>
</ul>
<h4 class="deck-topic">Protect the child</h4>
<ul>
  <li>A <b>bite block</b> keeps the mouth open and reduces sudden closure.</li>
  <li>Rotating burs need stable retraction, good vision and a firm finger rest.</li>
  <li>Use rubber dam or other airway protection whenever possible.</li>
</ul>
<div class="sum-key">
  <span class="sum-key-title">نقاط امتحانية</span>
  <ul>
    <li>Multisurface primary molar: <b>stainless-steel crown</b>.</li>
    <li>Small proximal lesion with ideal isolation: composite is acceptable.</li>
    <li>Hall needs a pulp without irreversible signs.</li>
    <li>Check occlusion before final cementation.</li>
  </ul>
</div>
      `,
            questions: [
                {
                    "q": "A 4-year-old primary molar has extensive multisurface caries but is restorable. Which restoration offers the most durable full-coronal coverage?",
                    "options": [
                        "Stainless-steel crown",
                        "Pit-and-fissure sealant",
                        "Preventive resin restoration",
                        "Direct amalgam sealant"
                    ],
                    "answer": 0,
                    "explanation": "A stainless-steel crown provides durable full-coronal coverage for a primary molar with extensive multisurface disease. Reference: American Academy of Pediatric Dentistry. Pediatric Restorative Dentistry. Stainless-steel crown indications. Reference Manual of Pediatric Dentistry. Page",
                    "source": "SDLE bank"
                },
                {
                    "q": "A primary molar has a small two-surface lesion, excellent isolation, and several years before exfoliation. Which restoration is appropriate?",
                    "options": [
                        "Stainless-steel crown in every case",
                        "Extraction",
                        "Fluoride varnish alone for a cavitation",
                        "Resin composite"
                    ],
                    "answer": 3,
                    "explanation": "A conservative bonded restoration is appropriate for a small accessible lesion with reliable isolation. Caries risk, remaining structure, and expected longevity may change the choice. Reference: American Academy of Pediatric Dentistry. Pediatric Restorative Dentistry. Latest edition.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A newly cemented stainless-steel crown is high in occlusion but has acceptable margins and contacts. What is the treatment?",
                    "options": [
                        "Adjust and polish the occlusal high point",
                        "Leave it high indefinitely",
                        "Prescribe antibiotics",
                        "Extract the tooth"
                    ],
                    "answer": 0,
                    "explanation": "A verified premature contact is adjusted carefully without perforating the crown, followed by polishing and reassessment of occlusion. Reference: Dean JA. McDonald and Avery's Dentistry for the Child and Adolescent. 11th ed. Stainless-steel crown placement.",
                    "source": "SDLE bank"
                },
                {
                    "q": "What is a principal advantage of resin-modified glass ionomer cement for luting a stainless-steel crown?",
                    "options": [
                        "No need for moisture control",
                        "Unlimited working time",
                        "Elimination of crown adaptation",
                        "Chemical adhesion with fluoride release and improved early strength"
                    ],
                    "answer": 3,
                    "explanation": "RMGIC provides tooth adhesion, fluoride release, and better early mechanical properties than conventional GIC. Crown fit, isolation, mixing, and cleanup remain essential. Reference: Dean JA. McDonald and Avery's Dentistry for the Child and Adolescent. 11th ed. Stainless-steel crowns and luting cements.",
                    "source": "SDLE bank"
                },
                {
                    "q": "During stainless-steel crown placement, when should occlusion first be evaluated for gross prematurity?",
                    "options": [
                        "Only one week later",
                        "At try-in before cementation",
                        "Before tooth preparation",
                        "Never if the crown seats"
                    ],
                    "answer": 1,
                    "explanation": "Trial seating permits assessment of fit and gross occlusal interference before cementation; occlusion should be verified again immediately after cementation. Reference: Dean JA. McDonald and Avery's Dentistry for the Child and Adolescent. Stainless-steel crown technique. Page",
                    "source": "SDLE bank"
                }
            ],
        },
        {
            id: "pd-prevention",
            title: "04 — Fluoride, Sealants & Radiographs",
            title_en: "Risk-based prevention",
            summaryHtml: `
<h4 class="deck-topic">Home fluoride</h4>
<ul>
  <li>Brush twice daily with fluoride toothpaste from the first tooth, with adult help.</li>
  <li>Under 3 years: a <b>smear</b> (rice-grain size). About 3 to 6 years: <b>pea-sized</b> amount.</li>
  <li>Stop sleeping with a bottle of milk or sweet drinks; reduce sugar frequency.</li>
  <li><b>Dietary supplements</b> are only for selected high-risk children whose water is fluoride deficient. With optimally fluoridated water: <b>none</b>.</li>
</ul>
<h4 class="deck-topic">Professional fluoride</h4>
<ul>
  <li><b>5% sodium fluoride varnish</b> is the preferred topical product for young children: small dose, easy and well tolerated.</li>
  <li>Repeat by risk, commonly every <b>3 to 6 months</b> when risk is high, including medically compromised children.</li>
  <li>Swallowing large amounts of fluoride or a bottle of mouthwash is a poisoning question: assess and <b>contact poison control</b> urgently.</li>
</ul>
<h4 class="deck-topic">Caries bacteria</h4>
<ul>
  <li>Passing cariogenic bacteria from mother or caregiver to child is <b>vertical transmission</b>; between peers is horizontal.</li>
</ul>
<h4 class="deck-topic">Fissures and sealants</h4>
<div class="deck-block deck-tbl">
  <table>
    <thead><tr><th>Finding</th><th>Plan</th></tr></thead>
    <tbody>
      <tr><td>Deep fissure at risk, or <b>non-cavitated</b> lesion</td><td><b>Resin sealant</b> with prevention; sealing arrests early lesions</td></tr>
      <tr><td>Deep stain, doubtful</td><td>Clean, dry and examine for a non-cavitated or cavitated lesion before choosing</td></tr>
      <tr><td>Small cavitation, sound remaining fissures</td><td><b>Preventive resin restoration</b>: restore the lesion and seal the rest</td></tr>
    </tbody>
  </table>
</div>
<ul>
  <li>Resin sealant needs isolation; glass ionomer is an interim option on a partly erupted tooth.</li>
  <li>Check retention at recall and repair losses.</li>
</ul>
<h4 class="deck-topic">Radiographs</h4>
<ul>
  <li>Take them only when they will change care, at an interval set by <b>caries risk and findings</b>.</li>
  <li><b>Horizontal bitewings</b> are best for hidden proximal caries in back teeth when bone is normal.</li>
  <li>Open contacts that can be inspected may make bitewings unnecessary at that visit.</li>
  <li>Use fast receptors, collimation and good positioning.</li>
</ul>
<div class="sum-key">
  <span class="sum-key-title">نقاط امتحانية</span>
  <ul>
    <li>Under 3: <b>smear</b> of fluoride paste.</li>
    <li>High-risk young child: <b>fluoride varnish</b>.</li>
    <li>Non-cavitated occlusal lesion: <b>seal</b>.</li>
    <li>Recall intervals are individual.</li>
  </ul>
</div>
      `,
            questions: [
                {
                    "q": "A caries-free 2-year-old is bottle-fed at night. What amount and type of toothpaste should the caregiver use twice daily?",
                    "options": [
                        "Pea-sized fluoridated toothpaste",
                        "Smear of fluoridated toothpaste",
                        "Smear of nonfluoridated paste",
                        "Pea-sized nonfluoridated paste"
                    ],
                    "answer": 1,
                    "explanation": "Children younger than three should use no more than a smear or rice-sized amount of fluoridated toothpaste under caregiver supervision; nocturnal bottle feeding should also be stopped. Reference: American Academy of Pediatric Dentistry. Fluoride Therapy. Reference Manual of Pediatric Dentistry. Page",
                    "source": "SDLE bank"
                },
                {
                    "q": "A caries-free six-year-old has good oral hygiene and drinks optimally fluoridated water. What dietary fluoride supplement is indicated?",
                    "options": [
                        "None",
                        "0.25 mg/day",
                        "0.5 mg/day",
                        "1 mg/day"
                    ],
                    "answer": 0,
                    "explanation": "Dietary fluoride supplementation is not indicated when drinking water already contains optimal fluoride. Unnecessary supplementation increases fluorosis risk. Reference: American Academy of Pediatric Dentistry. Fluoride Therapy. Reference Manual 2025.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A child at high caries risk attends recall. Which professional topical fluoride is appropriate?",
                    "options": [
                        "Systemic antibiotics",
                        "Phosphoric acid gel only",
                        "Silver amalgam varnish",
                        "5% sodium fluoride varnish at a risk-based interval"
                    ],
                    "answer": 3,
                    "explanation": "Fluoride varnish is effective and limits swallowed dose. Application frequency is individualized, often every three to six months in high-risk children. Reference: American Academy of Pediatric Dentistry. Fluoride Therapy. Reference Manual of Pediatric Dentistry, latest edition.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A 10-year-old has noncavitated superficial occlusal caries in all first permanent molars, with no radiographic dentinal involvement. What is appropriate?",
                    "options": [
                        "Preventive resin restorations with preparation",
                        "Full-coverage crowns",
                        "Surgical exposure",
                        "Resin fissure sealants"
                    ],
                    "answer": 3,
                    "explanation": "Sealants can arrest and prevent progression of noncavitated occlusal lesions when the surface can be cleaned, isolated, and monitored; operative PRR is unnecessary without cavitation or dentinal disease. Reference: American Dental Association, American Academy of Pediatric Dentistry. Evidence-based clinical practice guideline for pit-and- fissure sealants. J Am Dent Assoc. 2016;147(8):672-682.e12.",
                    "source": "SDLE bank"
                },
                {
                    "q": "Which radiograph is most useful for detecting proximal caries in posterior teeth during mixed dentition when bone levels are normal?",
                    "options": [
                        "Vertical bitewing",
                        "Panoramic radiograph",
                        "Horizontal bitewing",
                        "Occlusal radiograph"
                    ],
                    "answer": 2,
                    "explanation": "Horizontal bitewings provide high-resolution views of posterior proximal surfaces and crestal bone; vertical bitewings are used when greater bone coverage is needed. Reference: American Dental Association, US Food and Drug Administration. Dental Radiographic Examinations: Recommendations for Patient Selection and Limiting Radiation Exposure. Page",
                    "source": "SDLE bank"
                }
            ],
        },
        {
            id: "pd-space",
            title: "05 — Space Management",
            title_en: "Band and loop · distal shoe · lingual arch",
            summaryHtml: `
<h4 class="deck-topic">Before any appliance</h4>
<ul>
  <li>Record the tooth lost, side, time since loss, eruption stage, present space, presence of the successor and abutment condition.</li>
  <li>Check root development and bone cover of the successor, crowding, occlusion, hygiene and cooperation.</li>
</ul>
<div class="deck-block deck-tbl">
  <table>
    <thead><tr><th>Appliance</th><th>Typical indication</th></tr></thead>
    <tbody>
      <tr><td><b>Band and loop</b></td><td>One primary molar lost on one side with a sound abutment</td></tr>
      <tr><td><b>Distal shoe</b></td><td>Primary second molar lost <b>before</b> the permanent first molar erupts, to guide it</td></tr>
      <tr><td><b>Lower lingual holding arch</b></td><td>Bilateral or multiple lower molar loss after permanent incisors and first molars erupt</td></tr>
      <tr><td><b>Nance arch / transpalatal arch</b></td><td>Upper arch, holding permanent first molars</td></tr>
      <tr><td><b>Removable</b></td><td>Multiple loss in a cooperative child, also for function and appearance</td></tr>
    </tbody>
  </table>
</div>
<ul>
  <li>The band-and-loop wire should touch the neighbouring tooth at its <b>contact area</b> and stay clear of the gingiva.</li>
  <li>A distal shoe passes into the tissue, so avoid it in children at risk of infective endocarditis, immunocompromise or poor healing, and with poor cooperation or hygiene.</li>
</ul>
<h4 class="deck-topic">Developing occlusion</h4>
<ul>
  <li><b>Leeway space</b>: primary canine and molars are wider than their successors. Classic mean is about <b>1.7 mm per side in the mandible</b> and about 0.9 mm in the maxilla.</li>
  <li><b>Primate spaces</b>: upper mesial to the primary canine, lower distal to it.</li>
  <li>Primary second-molar terminal planes: a distal step tends toward Class II; mesial step toward Class I or III; flush plane may end as Class I or II.</li>
</ul>
<h4 class="deck-topic">Serial extraction</h4>
<div class="sum-algo">
  <span class="sum-algo-title">Severe Class I tooth-size to arch-length shortage</span>
  <ol>
    <li>Primary canines.</li>
    <li>Primary first molars.</li>
    <li>First premolars.</li>
  </ol>
</div>
<ul>
  <li>It requires full diagnosis and follow-up, and later fixed orthodontics is often still needed.</li>
</ul>
<h4 class="deck-topic">Ankylosed primary molar without successor</h4>
<ul>
  <li>Assess infraocclusion, root and bone, neighbouring tipping, age and growth. Plan jointly for retaining and building up, or removing at the right time with space control.</li>
</ul>
<div class="sum-key">
  <span class="sum-key-title">نقاط امتحانية</span>
  <ul>
    <li>Single molar lost, first permanent molar erupted: <b>band and loop</b> is common.</li>
    <li>Unerupted first molar after E loss: <b>distal shoe</b>.</li>
    <li>Bilateral lower loss with permanent incisors: <b>lingual arch</b>.</li>
    <li>Serial extraction order: C, D, first premolar.</li>
  </ul>
</div>
      `,
            questions: [
                {
                    "q": "A single primary molar is lost after the permanent first molar has erupted, and the adjacent abutment is sound. Which appliance is commonly used?",
                    "options": [
                        "Distal shoe",
                        "Band-and-loop",
                        "Transpalatal arch for the mandible",
                        "Palatal crib"
                    ],
                    "answer": 1,
                    "explanation": "A band-and-loop maintains a unilateral bounded space after eruption of the permanent first molar. Eruption of the successor and appliance integrity require follow-up. Reference: Dean JA. McDonald and Avery's Dentistry for the Child and Adolescent. 11th ed. Fixed unilateral space maintainers.",
                    "source": "SDLE bank"
                },
                {
                    "q": "Multiple mandibular primary molars are lost after eruption of the permanent incisors and first molars. Which appliance is appropriate?",
                    "options": [
                        "Distal shoe",
                        "Nance appliance",
                        "Lower lingual holding arch",
                        "Facemask"
                    ],
                    "answer": 2,
                    "explanation": "A bilateral lingual arch can preserve arch length when suitable permanent incisors and molars have erupted. It must not interfere with erupting teeth. Reference: Dean JA. McDonald and Avery's Dentistry for the Child and Adolescent. 11th ed. Bilateral space maintenance.",
                    "source": "SDLE bank"
                },
                {
                    "q": "Where should the wire loop of a band-and-loop space maintainer contact the adjacent tooth?",
                    "options": [
                        "At the proximal contact area",
                        "At the gingival margin",
                        "On the occlusal central fossa",
                        "On the root surface"
                    ],
                    "answer": 0,
                    "explanation": "The loop should contact the adjacent tooth at the contact region to preserve the space without impinging on gingiva or interfering with occlusion. Reference: Dean JA. McDonald and Avery's Dentistry for the Child and Adolescent. Band-and-loop design. Page",
                    "source": "SDLE bank"
                },
                {
                    "q": "What is the average mandibular leeway space per side?",
                    "options": [
                        "0.5 mm",
                        "3.5 mm",
                        "5.0 mm",
                        "1.7 mm"
                    ],
                    "answer": 3,
                    "explanation": "The combined width difference between primary canine and molars and their permanent successors averages about 1.7 mm per side in the mandible. Reference: Proffit WR et al. Contemporary Orthodontics. Leeway space. Page",
                    "source": "SDLE bank"
                },
                {
                    "q": "What is the conventional sequence for serial extraction when a carefully diagnosed severe Class I tooth- size–arch-length discrepancy is present?",
                    "options": [
                        "Primary lateral incisors, primary canines, then second premolars",
                        "Primary second molars, permanent canines, then second premolars",
                        "Primary canines, primary first molars, then first premolars",
                        "Permanent incisors, primary molars, then first molars"
                    ],
                    "answer": 2,
                    "explanation": "The classic C-D-4 sequence first relieves incisor crowding, then accelerates first-premolar eruption so those premolars can be removed to guide canine eruption. Reference: Proffit WR et al. Contemporary Orthodontics. Serial extraction. Page",
                    "source": "SDLE bank"
                }
            ],
        },
        {
            id: "pd-development",
            title: "06 — Anatomy, Eruption & Development",
            title_en: "Primary tooth form · timing · defects",
            summaryHtml: `
<h4 class="deck-topic">Primary versus permanent teeth</h4>
<div class="deck-block deck-tbl">
  <table>
    <thead><tr><th>Primary tooth feature</th><th>Clinical meaning</th></tr></thead>
    <tbody>
      <tr><td>Thinner enamel and dentin</td><td>Caries reaches the pulp sooner</td></tr>
      <tr><td>Relatively large pulp, high horns (especially mesial)</td><td>Easy exposure during preparation</td></tr>
      <tr><td>Bulbous crown, marked cervical constriction</td><td>Affects matrix and crown fit</td></tr>
      <tr><td>Broad flat contacts</td><td>Proximal caries hides well</td></tr>
      <tr><td>Molar roots <b>long, slender and widely divergent</b></td><td>Harder extraction; premolar bud lies between them</td></tr>
    </tbody>
  </table>
</div>
<h4 class="deck-topic">Timing</h4>
<ul>
  <li>First primary teeth, usually lower central incisors, at about <b>6 months</b>; primary dentition is complete at about 2.5 to 3 years.</li>
  <li>Usual primary order: central incisor, lateral incisor, first molar, canine, second molar.</li>
  <li>Permanent eruption starts at about 6 years with first molars and lower centrals.</li>
  <li>A permanent root continues forming for about <b>2 to 3 years after eruption</b>.</li>
  <li><b>Natal tooth</b>: present at birth. <b>Neonatal tooth</b>: appears in the first month.</li>
</ul>
<h4 class="deck-topic">Eruption problems</h4>
<ul>
  <li>Delayed eruption of one central incisor compared with the other needs examination and imaging.</li>
  <li>Obstruction by an <b>odontoma</b> or supernumerary: remove conservatively and plan for eruption, with space and traction if needed.</li>
</ul>
<h4 class="deck-topic">Enamel and root conditions</h4>
<div class="deck-cards">
  <div class="deck-card diag">
    <div class="deck-card-h">Molar-incisor hypomineralisation</div>
    <p>Demarcated opacities in first permanent molars, often incisors; sensitivity and breakdown after eruption. Protect early with fluoride, sealants or crowns according to severity.</p>
  </div>
  <div class="deck-card clin">
    <div class="deck-card-h">Hypophosphatasia</div>
    <p>Early loss of primary incisors <b>with roots intact</b> (defective cementum) and <b>low alkaline phosphatase</b> for age. Refer.</p>
  </div>
</div>
<h4 class="deck-topic">Pierre Robin sequence</h4>
<ul>
  <li><b>Micrognathia</b>, <b>glossoptosis</b> and upper-airway obstruction, often with cleft palate. Airway and feeding come first.</li>
</ul>
<div class="sum-key">
  <span class="sum-key-title">نقاط امتحانية</span>
  <ul>
    <li>Primary molar roots are widely divergent.</li>
    <li>Tooth at birth: <b>natal</b>.</li>
    <li>Premature loss with whole roots and low ALP: <b>hypophosphatasia</b>.</li>
    <li>Small jaw, backward tongue, obstructed airway: Pierre Robin.</li>
  </ul>
</div>
      `,
            questions: [
                {
                    "q": "Compared with permanent molars, how are the roots of primary molars typically shaped?",
                    "options": [
                        "Short and convergent",
                        "Fused and parallel",
                        "Long and widely divergent",
                        "Short and straight"
                    ],
                    "answer": 2,
                    "explanation": "Primary molar roots are slender and flare widely to accommodate the developing permanent successor between them. Reference: Dean JA. McDonald and Avery's Dentistry for the Child and Adolescent. Primary-tooth morphology. Page",
                    "source": "SDLE bank"
                },
                {
                    "q": "What is a tooth present in the mouth at birth called?",
                    "options": [
                        "Neonatal tooth",
                        "Supernumerary tooth",
                        "Eruption cyst",
                        "Natal tooth"
                    ],
                    "answer": 3,
                    "explanation": "A natal tooth is present at birth. A neonatal tooth erupts during the first 30 days of life. Reference: American Academy of Pediatric Dentistry. Management Considerations for Pediatric Oral Pathology.",
                    "source": "SDLE bank"
                },
                {
                    "q": "After a permanent tooth emerges into the mouth, how long does root development commonly continue?",
                    "options": [
                        "It is complete at eruption",
                        "Approximately two to three years",
                        "Ten years in every tooth",
                        "Root formation stops after six months"
                    ],
                    "answer": 1,
                    "explanation": "Permanent teeth usually erupt before root completion, and apical development continues for roughly two to three years. This differs from post-transplant healing or orthodontic movement. Reference: Dean JA. McDonald and Avery's Dentistry for the Child and Adolescent. 11th ed. Tooth development and eruption.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A child has premature loss of primary incisors with roots intact and persistently low age-adjusted serum alkaline phosphatase. What is the most likely diagnosis?",
                    "options": [
                        "Hypophosphatasia",
                        "Papillon-Lefevre syndrome",
                        "Hypophosphatemic rickets",
                        "Scurvy"
                    ],
                    "answer": 0,
                    "explanation": "Hypophosphatasia results from deficient tissue-nonspecific alkaline phosphatase and can cause defective bone and tooth mineralization with premature primary-tooth loss. Low alkaline phosphatase, not merely low phosphate, is the biochemical clue. Reference: NHS Genomics Education Programme. Hypophosphatasia Knowledge Hub. Updated 2025.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A child has demarcated enamel opacities affecting first permanent molars and incisors, with posteruptive breakdown of a molar. What is the diagnosis?",
                    "options": [
                        "Dental fluorosis",
                        "Amelogenesis imperfecta",
                        "Dentinogenesis imperfecta",
                        "Molar-incisor hypomineralization"
                    ],
                    "answer": 3,
                    "explanation": "MIH is a qualitative enamel defect involving one or more first permanent molars, often with permanent incisors. Demarcated opacities and posteruptive enamel breakdown distinguish it from diffuse fluorosis and generalized inherited defects. Reference: European Academy of Paediatric Dentistry. Best Clinical Practice Guidance for Molar-Incisor Hypomineralisation. 2022.",
                    "source": "SDLE bank"
                }
            ],
        },
        {
            id: "pd-behaviour-drugs",
            title: "07 — Behaviour, Local Anaesthetic & Doses",
            title_en: "Weight-based dosing",
            summaryHtml: `
<h4 class="deck-topic">Behaviour guidance</h4>
<ul>
  <li><b>Tell-show-do</b>: explain in simple words, demonstrate, then perform.</li>
  <li><b>Positive reinforcement</b>: praise or a reward after the wanted behaviour.</li>
  <li><b>Distraction</b>, <b>modelling</b> and gradual <b>desensitisation</b> reduce fear.</li>
  <li>Voice control, protective stabilisation, sedation and general anaesthesia need clear indications and informed consent.</li>
</ul>
<h4 class="deck-topic">Dose table (check current local references)</h4>
<div class="deck-block deck-tbl">
  <table>
    <thead><tr><th>Drug</th><th>Usual pediatric guide</th></tr></thead>
    <tbody>
      <tr><td><b>Acetaminophen</b></td><td>10 to 15 mg/kg every 4 to 6 hours, within the daily maximum</td></tr>
      <tr><td><b>Ibuprofen</b></td><td>4 to 10 mg/kg every 6 to 8 hours, within the daily maximum; check age and contraindications</td></tr>
      <tr><td><b>Lidocaine 2% with epinephrine</b></td><td>Conservative dental maximum <b>4.4 mg/kg</b>; other labels allow different limits</td></tr>
      <tr><td><b>Amoxicillin, endocarditis prophylaxis</b></td><td><b>50 mg/kg</b> orally 30 to 60 minutes before, maximum 2 g</td></tr>
    </tbody>
  </table>
</div>
<ul>
  <li>Prophylaxis is only for qualifying high-risk cardiac conditions and relevant procedures.</li>
  <li>Aspirin is avoided in children because of Reye syndrome.</li>
</ul>
<h4 class="deck-topic">Calculations</h4>
<div class="sum-algo">
  <span class="sum-algo-title">Local anaesthetic</span>
  <ol>
    <li>Maximum mg = weight x mg/kg. For 20 kg: 20 x 4.4 = <b>88 mg</b>.</li>
    <li>2% means 20 mg/mL; a 1.8 mL cartridge holds <b>36 mg</b>.</li>
    <li>88 divided by 36 = about <b>2.4 cartridges</b>.</li>
  </ol>
</div>
<ul>
  <li>Liquid medicine: dose in mg divided by concentration. With 160 mg per 5 mL, a 200 mg dose is 6.25 mL.</li>
</ul>
<h4 class="deck-topic">Safety</h4>
<ul>
  <li>Warn about numb lips: a swollen ulcer on the lip soon after treatment under local anaesthesia is usually <b>self-inflicted biting</b>.</li>
  <li>Sedation needs correct weight-based dosing, monitoring, trained staff and rescue ability. Dizziness and slurred speech after a very large oral midazolam dose indicate <b>overdose</b>: stop, support airway and breathing, monitor and call for help.</li>
  <li>Pulp of a primary upper central incisor is supplied by the <b>anterior superior alveolar nerve</b>.</li>
</ul>
<div class="sum-key">
  <span class="sum-key-title">نقاط امتحانية</span>
  <ul>
    <li>Praise after cooperation is positive reinforcement.</li>
    <li>Ibuprofen <b>4 to 10 mg/kg</b>; acetaminophen <b>10 to 15 mg/kg</b>.</li>
    <li>Always convert cartridges to milligrams.</li>
    <li>Amoxicillin prophylaxis is 50 mg/kg.</li>
  </ul>
</div>
      `,
            questions: [
                {
                    "q": "At the end of a pediatric dental visit, the child demonstrates the desired cooperative behavior. Which technique reinforces that behavior?",
                    "options": [
                        "Positive reinforcement",
                        "Punishment",
                        "Protective stabilization",
                        "Voice control only"
                    ],
                    "answer": 0,
                    "explanation": "Specific praise or another appropriate reward immediately following desired behavior increases the likelihood that the behavior will recur. Reference: American Academy of Pediatric Dentistry. Behavior Guidance for the Pediatric Dental Patient. Positive reinforcement. Reference Manual of Pediatric Dentistry. Page",
                    "source": "SDLE bank"
                },
                {
                    "q": "A 20-kg child is to receive 2% lidocaine with epinephrine in 1.8-mL cartridges. Using the conservative pediatric dental maximum of 4.4 mg/kg, what is the cartridge limit?",
                    "options": [
                        "About 2.4 cartridges",
                        "About 3.8 cartridges",
                        "About 5 cartridges",
                        "About 7 cartridges"
                    ],
                    "answer": 0,
                    "explanation": "The dose limit is 88 mg. Each 1.8-mL cartridge of 2% lidocaine contains 36 mg, so 88 divided by 36 is about 2.44 cartridges. The minimum effective dose is used. Reference: American Academy of Pediatric Dentistry. Use of Local Anesthesia for Pediatric Dental Patients. 2024.",
                    "source": "SDLE bank"
                },
                {
                    "q": "When infective-endocarditis prophylaxis is indicated in a child who can take oral penicillin, what is the amoxicillin dose?",
                    "options": [
                        "10 mg/kg",
                        "50 mg/kg",
                        "100 mg/kg",
                        "5 mg/kg"
                    ],
                    "answer": 1,
                    "explanation": "The pediatric oral regimen is amoxicillin 50 mg/kg as a single dose 30-60 minutes before the procedure, not exceeding the adult dose of 2 g. Prophylaxis is limited to qualifying high-risk cardiac conditions and procedures. Reference: American Heart Association. Prevention of Viridans Group Streptococcal Infective Endocarditis. 2021; American Dental Association. Antibiotic Prophylaxis Prior to Dental Procedures. Updated 2026.",
                    "source": "SDLE bank"
                },
                {
                    "q": "One week after a pediatric extraction performed under local anesthesia, a child returns with a swollen ulcerated lower lip. What is the most likely cause?",
                    "options": [
                        "Odontogenic cellulitis",
                        "Self-inflicted lip-biting trauma",
                        "Immediate hematoma",
                        "Allergic angioedema"
                    ],
                    "answer": 1,
                    "explanation": "Children may chew a numb lip after mandibular anesthesia, producing delayed swelling and ulceration that can mimic infection. Reference: American Academy of Pediatric Dentistry. Use of Local Anesthesia for Pediatric Dental Patients.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A 20-kg child needs acetaminophen at 10-15 mg/kg per dose. The liquid contains 160 mg/5 mL. What volume range delivers one dose?",
                    "options": [
                        "1-2 mL",
                        "6.25-9.4 mL",
                        "12-15 mL",
                        "20-25 mL"
                    ],
                    "answer": 1,
                    "explanation": "The dose range is 200-300 mg. At 32 mg/mL, this equals 6.25-9.375 mL. Daily maximums, dosing interval, age, liver status, and all combination products must also be checked. Reference: American Academy of Pediatric Dentistry. Useful Medications for Oral Conditions. 2025.",
                    "source": "SDLE bank"
                }
            ],
        },
        {
            id: "pd-mucosa",
            title: "08 — Oral Mucosal Disease in Children",
            title_en: "Herpes · aphthae · systemic signs",
            summaryHtml: `
<h4 class="deck-topic">Common infections and ulcers</h4>
<div class="deck-block deck-tbl">
  <table>
    <thead><tr><th>Condition</th><th>Clues</th></tr></thead>
    <tbody>
      <tr><td><b>Primary herpetic gingivostomatitis</b></td><td>Fever, malaise, very red painful gingiva, many vesicles and ulcers anywhere in the mouth</td></tr>
      <tr><td><b>Recurrent intraoral herpes</b></td><td>Cluster of small vesicles on <b>hard palate or attached gingiva</b></td></tr>
      <tr><td><b>Recurrent aphthous ulcer</b></td><td>Round ulcers on <b>movable</b> mucosa, no vesicle stage</td></tr>
      <tr><td><b>Herpangina</b></td><td>Coxsackievirus; ulcers at soft palate and fauces</td></tr>
      <tr><td><b>Hand, foot and mouth disease</b></td><td>Oral ulcers with hand and foot rash</td></tr>
      <tr><td><b>Scarlet fever</b></td><td>Streptococcal pharyngitis, diffuse rash, white-coated then red <b>strawberry tongue</b></td></tr>
    </tbody>
  </table>
</div>
<h4 class="deck-topic">Management</h4>
<ul>
  <li><b>Primary herpes</b>: mainly fluids and pain control; antivirals help when started early or when risk is high. Watch for dehydration and avoid spreading to eyes and others.</li>
  <li><b>Frequent minor aphthae in a healthy child</b>: topical corticosteroid started early, plus pain relief and trigger control.</li>
  <li><b>Large frequent ulcers with weight loss or enlarged nodes</b>: investigate iron, folate and B12 status, gut disease, immune and infectious causes.</li>
  <li><b>Scarlet fever</b>: medical referral for antibiotics.</li>
</ul>
<h4 class="deck-topic">Red flags</h4>
<div class="deck-cards">
  <div class="deck-card clin">
    <div class="deck-card-h">Blood disorder</div>
    <p>Widespread petechiae, spontaneous gum bleeding and tiredness without trauma: <b>urgent blood assessment</b> (consider leukaemia or thrombocytopenia).</p>
  </div>
  <div class="deck-card diag">
    <div class="deck-card-h">Sore throat with petechiae</div>
    <p>Palatal petechiae, fever and cervical nodes: think streptococcal pharyngitis or infectious mononucleosis.</p>
  </div>
  <div class="deck-card mgmt">
    <div class="deck-card-h">Immunocompromised</div>
    <p>A persistent, enlarging palatal ulcer with facial or periocular changes needs <b>urgent testing</b> for invasive fungal, viral, bacterial and malignant causes.</p>
  </div>
</div>
<ul>
  <li>Serology for syphilis: a screening non-treponemal test such as VDRL is confirmed by a <b>treponemal test</b>, read with history and stage. In a child this also raises safeguarding questions.</li>
</ul>
<div class="sum-key">
  <span class="sum-key-title">نقاط امتحانية</span>
  <ul>
    <li>Febrile child with gingivitis and vesicles: <b>primary herpes</b>.</li>
    <li>Keratinised site suggests herpes; movable mucosa suggests aphthae.</li>
    <li>Strawberry tongue with rash: scarlet fever.</li>
    <li>Unexplained bleeding and fatigue is urgent.</li>
  </ul>
</div>
      `,
            questions: [
                {
                    "q": "A child has fever, malaise, diffuse painful gingivitis, and multiple oral vesicles and ulcers. What is the most likely diagnosis?",
                    "options": [
                        "Recurrent aphthous stomatitis",
                        "Geographic tongue",
                        "Frictional ulcer",
                        "Primary herpetic gingivostomatitis"
                    ],
                    "answer": 3,
                    "explanation": "Primary HSV infection commonly causes febrile diffuse gingivostomatitis involving keratinized and nonkeratinized mucosa. Hydration and pain control are priorities; early antiviral therapy may be indicated. Reference: Glick M, ed. Burket's Oral Medicine. 13th ed. Herpes simplex infection.",
                    "source": "SDLE bank"
                },
                {
                    "q": "Grouped vesicles recur on the hard palate and attached gingiva after stress. What is the most likely diagnosis?",
                    "options": [
                        "Recurrent intraoral herpes",
                        "Minor aphthae",
                        "Hand-foot-and-mouth disease",
                        "Traumatic fibroma"
                    ],
                    "answer": 0,
                    "explanation": "Recurrent HSV favors keratinized mucosa bound to bone, especially hard palate and attached gingiva. Aphthae favor nonkeratinized mucosa. Reference: Glick M, ed. Burket's Oral Medicine. 13th ed. Recurrent herpes simplex.",
                    "source": "SDLE bank"
                },
                {
                    "q": "Which treatment is appropriate for frequent minor aphthous ulcers without systemic disease?",
                    "options": [
                        "Systemic antibiotics routinely",
                        "Topical corticosteroid started early in the episode",
                        "Surgical excision of every ulcer",
                        "Antifungal therapy only"
                    ],
                    "answer": 1,
                    "explanation": "Topical anti-inflammatory therapy reduces pain and duration. Trigger control and systemic evaluation are added when frequency, severity, or associated symptoms warrant. Reference: Glick M, ed. Burket's Oral Medicine. 13th ed. Treatment of recurrent aphthous stomatitis.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A child has widespread petechiae, spontaneous gingival bleeding, and fatigue without a trauma history. What is the priority?",
                    "options": [
                        "Frenectomy",
                        "Urgent hematologic assessment",
                        "Sealant placement",
                        "Orthodontic expansion"
                    ],
                    "answer": 1,
                    "explanation": "Generalized bleeding signs and fatigue raise thrombocytopenia, leukemia, or another hematologic disorder. Invasive care should wait for urgent medical evaluation. Reference: Glick M, ed. Burket's Oral Medicine. 13th ed. Oral manifestations of hematologic disease.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A child has fever, pharyngotonsillitis, a diffuse trunk rash, and a white-coated tongue that becomes red and bumpy. What is the diagnosis?",
                    "options": [
                        "Varicella",
                        "Measles",
                        "Scarlet fever",
                        "Herpangina"
                    ],
                    "answer": 2,
                    "explanation": "Group A streptococcal scarlet fever combines pharyngitis, a fine erythematous rash, and a strawberry tongue that may initially have a white coating. Confirmation and antibiotic management follow current streptococcal pharyngitis guidance. Reference: Centers for Disease Control and Prevention. Clinical Guidance for Scarlet Fever. 2025.",
                    "source": "SDLE bank"
                }
            ],
        },
        {
            id: "pd-safeguarding",
            title: "09 — Child Protection & Medical Risk",
            title_en: "Abuse · neglect · safe care",
            summaryHtml: `
<h4 class="deck-topic">Warning signs of physical abuse</h4>
<ul>
  <li>History that does not fit the injury, changes between tellers or does not fit the child's development.</li>
  <li>Delay in seeking care without a reasonable explanation.</li>
  <li>Bruises on neck, ears, torso, upper arms or other protected areas; bruising in a non-mobile infant.</li>
  <li>Patterned marks and injuries of different ages.</li>
  <li><b>Torn labial frenum</b> together with other unexplained injuries. A frenal tear alone in a toddler learning to walk is not proof.</li>
</ul>
<h4 class="deck-topic">Dental neglect</h4>
<ul>
  <li>Persistent failure to seek or complete care needed for a child's oral health and function, although the family understands and has <b>access</b>.</li>
  <li>Caries alone or one late visit does not prove neglect. First look for barriers such as transport, cost or lack of knowledge, and help remove them.</li>
</ul>
<h4 class="deck-topic">What the dentist must do</h4>
<div class="sum-algo">
  <span class="sum-algo-title">Reasonable suspicion</span>
  <ol>
    <li>Treat urgent medical and dental needs and keep the child safe.</li>
    <li>Record facts, exact words, measurements, body diagrams and appropriate photographs.</li>
    <li><b>Report</b> through the legally required child-protection pathway. Proof is not needed.</li>
    <li>Do not investigate or accuse; share information only with those who need it.</li>
  </ol>
</div>
<h4 class="deck-topic">Children with medical conditions</h4>
<div class="deck-block deck-tbl">
  <table>
    <thead><tr><th>Group</th><th>Dental point</th></tr></thead>
    <tbody>
      <tr><td><b>Down syndrome</b></td><td>Higher periodontal risk, altered eruption; check heart and neck history; prevention by risk, including varnish</td></tr>
      <tr><td><b>Liver disease or awaiting transplant</b></td><td>Intensive prevention; clear infection early with the physician; check bleeding and drug handling</td></tr>
      <tr><td><b>High-risk heart disease</b></td><td>Excellent hygiene; prophylaxis when indicated</td></tr>
      <tr><td><b>Immunocompromise</b></td><td>Treat suspected infection urgently with the medical team</td></tr>
    </tbody>
  </table>
</div>
<ul>
  <li>High-risk medically compromised children may receive fluoride varnish about every <b>3 months</b>.</li>
</ul>
<div class="sum-key">
  <span class="sum-key-title">نقاط امتحانية</span>
  <ul>
    <li>Suspicion is enough to <b>report</b>.</li>
    <li>Treat urgent needs and document objectively.</li>
    <li>Look for barriers before calling it neglect.</li>
    <li>Injuries in unusual sites raise concern.</li>
  </ul>
</div>
      `,
            questions: [
                {
                    "q": "A child has untreated cavitated caries and poor hygiene plus labial-frenum injury and bruises on the neck and arms. What is the appropriate interpretation?",
                    "options": [
                        "Dental caries alone",
                        "Gingivitis alone",
                        "Normal childhood findings",
                        "Suspected abuse and neglect requiring safeguarding action"
                    ],
                    "answer": 3,
                    "explanation": "Multiple injuries with untreated disease warrant careful documentation, immediate care and safety assessment, and reporting through the child-protection pathway rather than assigning a definitive mechanism independently. Reference: Tate AR et al. Oral and Dental Aspects of Child Abuse and Neglect. Pediatrics. 2024;154(3):e2024068024. doi:10.1542/peds.2024-068024.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A dentist identifies findings that create reasonable suspicion of child abuse. After addressing immediate safety and medical needs, what is required?",
                    "options": [
                        "Wait for definitive proof",
                        "Document and report through the protection pathway",
                        "Confront the suspected person alone",
                        "Schedule routine review only"
                    ],
                    "answer": 1,
                    "explanation": "The clinician should record objective findings and history, provide necessary care, protect confidentiality, and report suspicion promptly; proof is determined by the competent multidisciplinary authorities. Reference: Saudi Ministry of Human Resources and Social Development. Executive Regulations for the Child Protection System, Article 21; health providers must care for and report suspected abuse or neglect. 2024.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A child presents with an abscess of two weeks' duration, and the caregiver sought care as soon as transport became available. Is neglect established?",
                    "options": [
                        "Yes; duration alone proves neglect",
                        "Yes; every abscess proves abuse",
                        "No; dental neglect never occurs",
                        "No; barriers and caregiver response must be assessed"
                    ],
                    "answer": 3,
                    "explanation": "Disease severity and delay prompt careful inquiry, but reasonable efforts, access limitations, health literacy, and follow-through determine whether persistent failure exists. Reference: American Academy of Pediatric Dentistry. Oral and Dental Aspects of Child Abuse and Neglect. Latest edition.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A child with liver disease has heavy plaque and high caries risk. Which professional fluoride plan is appropriate?",
                    "options": [
                        "5% sodium fluoride varnish about every three months",
                        "No topical fluoride",
                        "Systemic fluoride without water-history review",
                        "One application for life"
                    ],
                    "answer": 0,
                    "explanation": "Liver disease does not by itself contraindicate topical fluoride varnish. High-risk children commonly receive 5% sodium fluoride varnish at three-month intervals within comprehensive prevention. Reference: American Academy of Pediatric Dentistry. Fluoride Therapy. Reference Manual 2025.",
                    "source": "SDLE bank"
                }
            ],
        },
    ],
};

export default dentalPediatricDentistry;
