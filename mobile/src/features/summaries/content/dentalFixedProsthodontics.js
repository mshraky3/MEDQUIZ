// AUTO-COPIED from my-react-app/src/components/summaries/content/dentalFixedProsthodontics.js. Do not edit here:
// change the website's file, then run `npm run sync:summaries` in mobile/.
// Fixed Prosthodontics — dental-track section of the summaries catalog.
// Mirrored for the slide viewer in backend/content/summaryHtml (keep the two in sync).
// Inline questions are copied from the SQB bank.
const dentalFixedProsthodontics = {
    id: "fixed-prosthodontics",
    title: "Fixed Prosthodontics",
    title_en: "SDLE Review — 9 Topics",
    icon: "shield-check",
    accent: "#34d399",
    intro: "Fixed Prosthodontics — focused SDLE revision: Tooth Preparation Principles · Finish Lines & Periodontal Health · FPD Design & Abutments · Pontics · Post, Core & Ferrule · Soft Tissue, Impressions & Provisionals · Occlusion & Articulators · Try-in, Cementation & Failures · Ceramics, Bonding, Shade & Conservative Esthetics.",
    subtopics: [
        {
            id: "fx-preparation",
            title: "01 — Principles of Tooth Preparation",
            title_en: "Retention · resistance · reduction",
            summaryHtml: `
<h4 class="deck-topic">Five aims</h4>
<ul>
  <li>Preserve tooth structure and pulp health.</li>
  <li>Gain <b>retention and resistance</b>.</li>
  <li>Give the material enough space for <b>structural durability</b>.</li>
  <li>Allow accurate, cleanable margins.</li>
  <li>Protect the periodontium.</li>
</ul>
<h4 class="deck-topic">Retention versus resistance</h4>
<ul>
  <li><b>Retention</b> opposes removal along the path of insertion.</li>
  <li><b>Resistance</b> opposes tipping and rotation under oblique and horizontal forces.</li>
  <li>Both improve with greater axial height, more surface area and <b>less convergence</b>.</li>
  <li>About 6 degrees of total convergence is the classic ideal; clinical references accept a wider range, often about 10 to 20 degrees.</li>
  <li>Commonly quoted minimum wall height is about 3 mm for anteriors and premolars and 4 mm for molars.</li>
  <li>Short or over-tapered preparation: add <b>grooves or boxes</b>, reduce taper where possible, or gain height by crown lengthening.</li>
  <li>Walls that diverge toward the occlusal lose mechanical retention and resistance.</li>
</ul>
<h4 class="deck-topic">Typical space needed</h4>
<div class="deck-block deck-tbl">
  <table>
    <thead><tr><th>Restoration</th><th>Occlusal or incisal guide</th><th>Usual margin</th></tr></thead>
    <tbody>
      <tr><td>Full cast metal</td><td>About 1.5 mm on functional cusps, 1 mm on non-functional</td><td>Chamfer</td></tr>
      <tr><td>Metal-ceramic</td><td>About 1.5 to 2 mm where porcelain covers the surface</td><td>Shoulder or deep chamfer on the ceramic side</td></tr>
      <tr><td>All-ceramic</td><td>About 1.5 to 2 mm, material dependent</td><td>Rounded shoulder or deep chamfer, often about 1 mm</td></tr>
    </tbody>
  </table>
</div>
<ul>
  <li>Modern high-strength ceramics may need less; follow the manufacturer.</li>
  <li>A <b>functional cusp bevel</b> and anatomic occlusal reduction give bulk without needless tooth loss.</li>
  <li>Round sharp internal line angles, especially for ceramics.</li>
</ul>
<h4 class="deck-topic">Safety while cutting</h4>
<ul>
  <li>Use water coolant, light intermittent pressure and sharp burs to limit pulpal heat.</li>
  <li>Protect the neighbouring tooth; tilting the bur while breaking contact easily damages it.</li>
  <li>Auxiliary grooves are commonly cut with a tapered fissure bur or tapered diamond.</li>
</ul>
<div class="sum-key">
  <span class="sum-key-title">نقاط امتحانية</span>
  <ul>
    <li>Enough occlusal clearance but short walls: <b>retention and resistance</b> are the problem.</li>
    <li>Too much taper reduces both.</li>
    <li>Repeated debonding: reassess the preparation, fit and occlusion before recementing again.</li>
    <li>Functional cusp bevel mainly serves structural durability.</li>
  </ul>
</div>
      `,
            questions: [
                {
                    "q": "A full-crown preparation has adequate occlusal clearance but only 2 mm of axial-wall height. Which principle is most compromised?",
                    "options": [
                        "Marginal integrity",
                        "Retention and resistance",
                        "Pulp preservation",
                        "Periodontal preservation"
                    ],
                    "answer": 1,
                    "explanation": "Short axial walls reduce surface area and permit tipping or rotational dislodgement of the crown. Adequate occlusal clearance does not compensate for inadequate wall height. Reference: Rosenstiel SF et al. Contemporary Fixed Prosthodontics. Principles of tooth preparation section. Page",
                    "source": "SDLE bank"
                },
                {
                    "q": "A full-crown preparation has opposing axial walls that diverge excessively toward the occlusal surface. What is the main consequence?",
                    "options": [
                        "Reduced retention and resistance",
                        "Increased ferrule height",
                        "Improved marginal adaptation",
                        "Elimination of rotational forces"
                    ],
                    "answer": 0,
                    "explanation": "Excessive total occlusal convergence decreases the ability of axial walls to resist dislodging and rotational forces, especially when the preparation is short. Reference: Rosenstiel SF, Land MF, Fujimoto J. Contemporary Fixed Prosthodontics. 6th ed. Retention and resistance form.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A vital anterior crown has debonded three times. What is the most appropriate next step?",
                    "options": [
                        "Repeat the same cementation",
                        "Perform endodontic treatment",
                        "Reassess and correct the preparation",
                        "Place a post through the vital pulp"
                    ],
                    "answer": 2,
                    "explanation": "Recurrent debonding requires evaluation of preparation height and taper, resistance form, fit, occlusion, contamination, and cement selection. Endodontic treatment and a post are not justified solely to retain a crown on a vital tooth. Reference: Rosenstiel SF et al. Contemporary Fixed Prosthodontics. Retention and resistance form and cementation sections. Page",
                    "source": "SDLE bank"
                },
                {
                    "q": "The bur is tilted toward an adjacent tooth while opening a proximal contact. What complication is most likely?",
                    "options": [
                        "Increased occlusal clearance",
                        "Damage to the adjacent tooth",
                        "Improved path of insertion",
                        "Increased pulpal insulation"
                    ],
                    "answer": 1,
                    "explanation": "Uncontrolled proximal angulation can iatrogenically cut the adjacent enamel. A thin protective matrix and controlled bur orientation reduce this risk. Reference: Rosenstiel SF, Land MF, Fujimoto J. Contemporary Fixed Prosthodontics. 6th ed. Proximal reduction and tooth protection.",
                    "source": "SDLE bank"
                }
            ],
        },
        {
            id: "fx-margins",
            title: "02 — Finish Lines & Periodontal Health",
            title_en: "Chamfer · shoulder · supracrestal attachment",
            summaryHtml: `
<h4 class="deck-topic">Finish line forms</h4>
<div class="deck-block deck-tbl">
  <table>
    <thead><tr><th>Form</th><th>Point to remember</th></tr></thead>
    <tbody>
      <tr><td><b>Chamfer</b></td><td>Made with a round-ended tapered diamond; distinct and conservative; classic for cast metal</td></tr>
      <tr><td><b>Shoulder / rounded shoulder</b></td><td>Gives ceramic bulk; the internal angle is rounded</td></tr>
      <tr><td><b>Shoulder with bevel</b></td><td>Used in some metal margin designs</td></tr>
      <tr><td><b>Knife or feather edge</b></td><td>Very conservative but hard to read and prone to over-contour</td></tr>
    </tbody>
  </table>
</div>
<ul>
  <li>Making a chamfer with more than about half the bur tip leaves an unsupported lip of enamel.</li>
  <li>A <b>collarless</b> metal-ceramic margin has porcelain to the finish line without a visible metal band.</li>
</ul>
<h4 class="deck-topic">Where to place the margin</h4>
<ul>
  <li><b>Supragingival</b> is the healthiest: easier to prepare, record, cement, inspect and clean.</li>
  <li>Go subgingival only for a reason: caries or an old restoration, retention form, esthetics.</li>
  <li>For esthetics, an equigingival or only slightly intrasulcular margin is enough; never aim deep.</li>
</ul>
<h4 class="deck-topic">Supracrestal tissue attachment (biologic width)</h4>
<ul>
  <li>Junctional epithelium plus connective-tissue attachment average about <b>2 mm</b>; it varies between people.</li>
  <li>The traditional safe guide is about <b>3 mm from margin to alveolar crest</b>, which includes the sulcus.</li>
  <li>Violation: persistent bleeding and inflammation, pocketing, recession or bone loss.</li>
  <li>Not enough space: <b>surgical crown lengthening</b> or orthodontic extrusion, after judging restorability, crown-root ratio and esthetics.</li>
</ul>
<h4 class="deck-topic">Inflamed gingiva around a crown</h4>
<div class="sum-algo">
  <span class="sum-algo-title">Check in turn</span>
  <ol>
    <li>Plaque control.</li>
    <li>Retained cement.</li>
    <li>Open, overhanging or rough margins.</li>
    <li>Over-contour and poor emergence profile or closed embrasures.</li>
    <li>Attachment violation; then material sensitivity if nothing else explains it.</li>
  </ol>
</div>
<ul>
  <li>An <b>open margin</b> invites plaque and <b>recurrent caries</b>; a defective carious margin is managed by removing the caries and replacing the restoration.</li>
</ul>
<div class="sum-key">
  <span class="sum-key-title">نقاط امتحانية</span>
  <ul>
    <li>Healthiest margin position: <b>supragingival</b>.</li>
    <li>Round-ended tapered diamond gives a <b>chamfer</b>.</li>
    <li>Recession or chronic inflammation after deep margins: think attachment violation.</li>
    <li>Bulky cervical form that traps food is a poor <b>emergence profile</b>.</li>
  </ul>
</div>
      `,
            questions: [
                {
                    "q": "Which finish line is produced by a round-ended tapered diamond used with its terminal curvature against the tooth?",
                    "options": [
                        "Shoulder",
                        "Chamfer",
                        "Knife edge",
                        "Beveled shoulder"
                    ],
                    "answer": 1,
                    "explanation": "The rounded tip of the instrument forms a concave cervical profile characteristic of a chamfer. A flat- ended instrument is used when a definite shoulder is intended. Reference: Rosenstiel SF et al. Contemporary Fixed Prosthodontics. Finish-line design and rotary instruments. Page",
                    "source": "SDLE bank"
                },
                {
                    "q": "When caries, an existing restoration, and esthetics do not require sulcular extension, where should a crown margin be placed for periodontal health?",
                    "options": [
                        "At the bone crest",
                        "Deep subgingival",
                        "Supragingival",
                        "Within the junctional epithelium"
                    ],
                    "answer": 2,
                    "explanation": "Supragingival margins are easiest to finish, inspect, and clean and have the most favorable periodontal relationship. Subgingival placement should be reserved for a specific restorative or esthetic indication without violating supracrestal tissue attachment. Reference: Rosenstiel SF et al. Contemporary Fixed Prosthodontics. Finish-line location and periodontal considerations sections. Page",
                    "source": "SDLE bank"
                },
                {
                    "q": "What is the principal long-term biological risk of an open crown margin?",
                    "options": [
                        "Enamel regeneration",
                        "Recurrent caries",
                        "Root elongation",
                        "Pulp calcification"
                    ],
                    "answer": 1,
                    "explanation": "A marginal gap retains plaque and permits bacterial and substrate ingress, increasing the risk of caries adjacent to the restoration. Reference: Rosenstiel SF, Land MF, Fujimoto J. Contemporary Fixed Prosthodontics. Marginal integrity.",
                    "source": "SDLE bank"
                },
                {
                    "q": "Floss contact is normal around a new crown, but food accumulates in an overbulked cervical embrasure that is difficult to clean. What is the principal defect?",
                    "options": [
                        "Open proximal contact",
                        "Improper emergence contour",
                        "Inadequate post length",
                        "Excessive occlusal reduction"
                    ],
                    "answer": 1,
                    "explanation": "A contact can be intact while an overcontoured cervical profile traps plaque and food. Correcting emergence contour and cleansability addresses the cause. Reference: Rosenstiel SF, Land MF, Fujimoto J. Contemporary Fixed Prosthodontics. 6th ed. Periodontal form of fixed restorations.",
                    "source": "SDLE bank"
                },
                {
                    "q": "What facial shoulder width is commonly required for an all-ceramic crown?",
                    "options": [
                        "0.2-0.4 mm",
                        "0.5-0.7 mm",
                        "1.0-1.5 mm",
                        "2.0-2.5 mm"
                    ],
                    "answer": 2,
                    "explanation": "Many all-ceramic systems require approximately 1.0-1.5 mm of marginal reduction to provide material bulk and a readable finish line. The exact preparation follows the selected ceramic and manufacturer instructions. Reference: Rosenstiel SF et al. Contemporary Fixed Prosthodontics. All-ceramic crown preparation section. Page",
                    "source": "SDLE bank"
                }
            ],
        },
        {
            id: "fx-design",
            title: "03 — FPD Design & Abutment Selection",
            title_en: "Ante's law · span flexure · connectors",
            summaryHtml: `
<h4 class="deck-topic">Judging an abutment</h4>
<ul>
  <li>Check pulp and periapical status, periodontal health, remaining structure, caries risk, mobility, alignment and occlusal load.</li>
  <li><b>Crown-root ratio</b>: about 2:3 is favourable; 1:1 is often quoted as the minimum in usual conditions.</li>
  <li>Broad, long, divergent or curved roots give more support than short, conical or fused roots.</li>
  <li><b>Ante's law</b> (a guide, not an absolute rule): root surface area of abutments should equal or exceed that of the teeth replaced.</li>
</ul>
<h4 class="deck-topic">Span mechanics</h4>
<ul>
  <li>Deflection rises with the <b>cube of span length</b>: doubling gives 8 times, tripling gives <b>27 times</b>.</li>
  <li>Deflection falls with the <b>cube of occlusogingival thickness</b>: halving thickness gives 8 times more flexure.</li>
  <li>Pontics lying outside the line joining the abutments create a lever arm.</li>
  <li>Replacing a <b>maxillary canine</b> is less favourable than a mandibular canine because forces push the pontic outward on the weaker curve of the arch.</li>
</ul>
<h4 class="deck-topic">Naming the units</h4>
<ul>
  <li>Count every retainer and pontic. Missing 14 and 15 with abutments 13 and 16 is a <b>four-unit</b> prosthesis.</li>
</ul>
<h4 class="deck-topic">Special situations</h4>
<div class="deck-block deck-tbl">
  <table>
    <thead><tr><th>Problem</th><th>Options</th></tr></thead>
    <tbody>
      <tr><td><b>Pier</b> (intermediate) abutment</td><td>Non-rigid connector, usually with the keyway in the distal of the pier retainer</td></tr>
      <tr><td><b>Mesially tilted molar</b></td><td>Orthodontic uprighting, modified preparation, proximal half crown, telescopic design or non-rigid connector</td></tr>
      <tr><td><b>Tooth and implant together</b></td><td>Generally avoided because they move differently; plan separate support when possible</td></tr>
      <tr><td><b>Cantilever</b></td><td>Selected short cases with strong abutment support and controlled occlusion</td></tr>
    </tbody>
  </table>
</div>
<ul>
  <li>Preparing a tilted molar strictly along its own long axis may leave a path of insertion that does not match the other abutment, so the FPD cannot seat.</li>
  <li>A supraerupted opposing tooth with a small excess may be reduced selectively within enamel; larger discrepancies need other treatment.</li>
</ul>
<h4 class="deck-topic">One missing tooth</h4>
<ul>
  <li>Compare a single implant, resin-bonded bridge, conventional bridge, removable denture and orthodontic closure.</li>
  <li>With sound neighbours, completed growth and adequate bone, an implant avoids preparing them. In a growing patient, use a conservative interim option.</li>
</ul>
<div class="sum-key">
  <span class="sum-key-title">نقاط امتحانية</span>
  <ul>
    <li>Flexure follows length <b>cubed</b>.</li>
    <li>Pier abutment: <b>non-rigid connector</b>.</li>
    <li>All abutments of one FPD need a common path of insertion.</li>
    <li>Implant placement waits for growth to finish.</li>
  </ul>
</div>
      `,
            questions: [
                {
                    "q": "If every other variable remains constant, how does the flexure of a fixed dental prosthesis change when pontic-span length is tripled?",
                    "options": [
                        "3-fold increase",
                        "27-fold increase",
                        "6-fold increase",
                        "9-fold increase"
                    ],
                    "answer": 1,
                    "explanation": "Beam deflection is proportional to the cube of span length. Tripling the length therefore increases flexure by 3³, or 27 times, when material and cross-sectional dimensions remain constant. Reference: Rosenstiel SF et al. Contemporary Fixed Prosthodontics. Biomechanical considerations for fixed dental prostheses. Page",
                    "source": "SDLE bank"
                },
                {
                    "q": "Teeth 14 and 15 are missing. Teeth 13 and 16 are restorable, periodontally sound, and suitable as abutments. Which fixed dental prosthesis design replaces both missing teeth?",
                    "options": [
                        "Three-unit FPD from 13 to 15",
                        "Three-unit FPD from 14 to 16",
                        "Four-unit FPD from 13 to 16",
                        "Cantilever FPD from 16"
                    ],
                    "answer": 2,
                    "explanation": "Retainers on 13 and 16 with pontics replacing 14 and 15 form a four-unit fixed dental prosthesis. Final treatment still requires assessment of abutment support, span biomechanics, caries risk, and patient preferences. Reference: Rosenstiel SF et al. Contemporary Fixed Prosthodontics. Fixed dental prosthesis design and abutment selection. Page",
                    "source": "SDLE bank"
                },
                {
                    "q": "Comparable fixed dental prostheses are planned to replace a maxillary canine and a mandibular canine. Which replacement is generally subjected to greater lateral and torquing forces?",
                    "options": [
                        "Mandibular canine prosthesis",
                        "Both are always equal",
                        "Neither receives lateral force",
                        "Maxillary canine prosthesis"
                    ],
                    "answer": 3,
                    "explanation": "Maxillary canine replacement is often more biomechanically demanding because of canine-guidance forces and the pontic's relation to the interabutment axis. Abutment support and the complete occlusal design still govern the final plan. Reference: Rosenstiel SF et al. Contemporary Fixed Prosthodontics. Biomechanics of replacing missing canines. Page",
                    "source": "SDLE bank"
                },
                {
                    "q": "A mesially tilted molar is prepared by aligning every axial wall with the tooth's long axis. The planned fixed partial denture has a different path of insertion. What problem may result?",
                    "options": [
                        "Automatic correction of the tilt",
                        "Increased connector strength",
                        "An incompatible path of insertion",
                        "Elimination of undercuts on all abutments"
                    ],
                    "answer": 2,
                    "explanation": "Abutment preparations must share a clinically achievable path of insertion. Tilted teeth may need modified preparation, orthodontic uprighting, a nonrigid connector, or a different prosthetic plan. Reference: Rosenstiel SF, Land MF, Fujimoto J. Contemporary Fixed Prosthodontics. 6th ed. Pier and tilted abutments.",
                    "source": "SDLE bank"
                },
                {
                    "q": "An adult has one missing central incisor, intact adjacent teeth, adequate bone, and completed growth. Which option best avoids preparing the adjacent teeth?",
                    "options": [
                        "Single implant crown",
                        "Conventional three-unit bridge",
                        "Removable complete denture",
                        "Cast post in the edentulous space"
                    ],
                    "answer": 0,
                    "explanation": "With suitable anatomy, health, esthetic risk assessment, and patient preference, an implant can replace the tooth without sacrificing intact adjacent enamel. It is not automatically superior in every case. Reference: Misch CE. Contemporary Implant Dentistry. 4th ed. Single-tooth implant indications.",
                    "source": "SDLE bank"
                }
            ],
        },
        {
            id: "fx-pontics",
            title: "04 — Pontic Design",
            title_en: "Ovate · modified ridge lap · hygienic",
            summaryHtml: `
<h4 class="deck-topic">What a pontic must do</h4>
<ul>
  <li>Restore function and appearance while leaving the ridge healthy.</li>
  <li>The tissue surface is <b>convex where possible, smooth and cleanable</b>.</li>
  <li>Contact with the ridge is light and passive, without lasting blanching.</li>
  <li>A highly polished or well-glazed surface collects less plaque.</li>
</ul>
<div class="deck-block deck-tbl">
  <table>
    <thead><tr><th>Design</th><th>Strength</th><th>Weakness or usual site</th></tr></thead>
    <tbody>
      <tr><td><b>Ovate</b></td><td>Best natural emergence; supports tissue form after extraction</td><td>Needs enough ridge and a shaped receptor site</td></tr>
      <tr><td><b>Modified ridge lap</b></td><td>Good balance of <b>esthetics and cleaning</b></td><td>Common in the esthetic zone</td></tr>
      <tr><td><b>Hygienic (sanitary)</b></td><td>Easiest to clean; does not touch the ridge</td><td>Poor appearance; mainly lower molar region with enough height</td></tr>
      <tr><td><b>Conical (bullet)</b></td><td>Small tissue contact, cleanable</td><td>Thin ridge, non-esthetic posterior area</td></tr>
      <tr><td><b>Ridge lap / saddle</b></td><td>Looks like a tooth</td><td>Covers both sides of the ridge, <b>cannot be cleaned</b>, causes inflammation; avoid</td></tr>
    </tbody>
  </table>
</div>
<h4 class="deck-topic">Read the stem</h4>
<ul>
  <li>Preserve socket and emergence profile after extraction of an upper lateral: <b>ovate provisional</b>.</li>
  <li>Esthetics plus hygiene on a healed ridge: modified ridge lap, or ovate if the site is developed.</li>
  <li>Maximum access to cleaning in a non-visible lower molar space: hygienic.</li>
</ul>
<h4 class="deck-topic">Tissue problems under a pontic</h4>
<div class="sum-algo">
  <span class="sum-algo-title">Ulcer or continuous blanching</span>
  <ol>
    <li>Check for excessive pressure, roughness, residual cement and plaque.</li>
    <li>With a provisional, <b>reduce the pressure</b>, reshape and polish.</li>
    <li>Teach cleaning under the pontic with floss threader or super floss.</li>
    <li>Review healing before copying the form into the final prosthesis.</li>
  </ol>
</div>
<h4 class="deck-topic">Ridge defects</h4>
<ul>
  <li>Loss of ridge width or height makes a pontic look long and leaves open spaces.</li>
  <li>Options include soft-tissue or bone augmentation, or pink restorative material when the contour stays cleanable.</li>
</ul>
<h4 class="deck-topic">Esthetic proportion</h4>
<ul>
  <li>The golden-proportion guide scales each visible width as you move back by about <b>0.62</b>. A 5 mm visible lateral gives a visible canine of about 3.1 mm. It is a guide, not a biological rule.</li>
</ul>
<div class="sum-key">
  <span class="sum-key-title">نقاط امتحانية</span>
  <ul>
    <li>Hardest to clean: <b>full ridge lap</b>.</li>
    <li>Its main harm is <b>tissue inflammation</b>.</li>
    <li>Emergence profile at an extraction site: <b>ovate</b>.</li>
    <li>Pressure sore under a provisional: relieve and polish.</li>
  </ul>
</div>
      `,
            questions: [
                {
                    "q": "Which provisional pontic design best preserves an extraction socket's emergence profile after removal of a maxillary lateral incisor?",
                    "options": [
                        "Ovate",
                        "Sanitary",
                        "Conical",
                        "Full ridge-lap"
                    ],
                    "answer": 0,
                    "explanation": "A properly contoured ovate provisional pontic can support the healing tissue and preserve a natural emergence form after extraction. Pressure must be controlled to avoid ischemia and the site must remain cleanable. Reference: Rosenstiel SF et al. Contemporary Fixed Prosthodontics. Provisional pontic and tissue-conditioning sections. Page",
                    "source": "SDLE bank"
                },
                {
                    "q": "What is the principal advantage of a modified ridge-lap pontic?",
                    "options": [
                        "Esthetics with cleanability",
                        "Maximum ridge pressure",
                        "No tissue contact",
                        "Minimal connector height"
                    ],
                    "answer": 0,
                    "explanation": "A modified ridge-lap pontic contacts the facial aspect of the ridge to create a natural appearance while keeping the lingual tissue surface convex and accessible for cleaning. It avoids the broad concave contact of a full ridge-lap design. Reference: Rosenstiel SF et al. Contemporary Fixed Prosthodontics. Pontic design section. Page",
                    "source": "SDLE bank"
                },
                {
                    "q": "What is the main biological disadvantage of a full ridge-lap pontic?",
                    "options": [
                        "Excess occlusal clearance",
                        "Poor esthetics",
                        "Lack of connector strength",
                        "Tissue inflammation"
                    ],
                    "answer": 3,
                    "explanation": "A full ridge-lap pontic has a concave tissue surface that is difficult to clean and promotes plaque retention and mucosal inflammation. It is therefore generally avoided in favor of a cleansable pontic contour. Reference: Rosenstiel SF et al. Contemporary Fixed Prosthodontics. Pontic design section. Page",
                    "source": "SDLE bank"
                },
                {
                    "q": "An ovate pontic site is ulcerated and blanches continuously under the provisional. What is the most appropriate correction?",
                    "options": [
                        "Increase tissue compression",
                        "Extend the pontic deeper immediately",
                        "Ignore the ulceration",
                        "Reduce pontic pressure and refine the tissue surface"
                    ],
                    "answer": 3,
                    "explanation": "Excessive pressure or a rough, overextended pontic surface causes ischemia and inflammation. The provisional should provide light, cleansable, well-polished tissue contact and be reassessed. Reference: Rosenstiel SF, Land MF, Fujimoto J. Contemporary Fixed Prosthodontics. 6th ed. Pontic design and tissue conditioning.",
                    "source": "SDLE bank"
                },
                {
                    "q": "Using the golden proportion, what visible canine width corresponds to a lateral-incisor width of 5 mm?",
                    "options": [
                        "5.0 mm",
                        "6.2 mm",
                        "8.1 mm",
                        "3.1 mm"
                    ],
                    "answer": 3,
                    "explanation": "The visible canine width is approximately 0.618 times the lateral-incisor width: 5 × 0.618 ≈ 3.1 mm. Reference: Rosenstiel SF, Ward DH, Rashid RG. Dentists' preferences of anterior tooth proportion. J Prosthodont. 2000;9(3):123-136.",
                    "source": "SDLE bank"
                }
            ],
        },
        {
            id: "fx-post-core",
            title: "05 — Post, Core & Ferrule",
            title_en: "Root-treated teeth · ferrule · root fracture",
            summaryHtml: `
<h4 class="deck-topic">The basic idea</h4>
<ul>
  <li>The main purpose of a post is to <b>retain the core</b>. It does <b>not</b> reliably strengthen the root.</li>
  <li>No post is needed if enough tooth structure can hold the core.</li>
  <li>Root-treated posterior teeth often benefit from <b>cuspal coverage</b>. An intact anterior with only a small access often does not need a crown.</li>
</ul>
<h4 class="deck-topic">Ferrule</h4>
<ul>
  <li>A crown collar around sound dentin apical to the core.</li>
  <li>Aim for about <b>1.5 to 2 mm of height</b>, ideally all round, with adequate wall thickness.</li>
  <li>It greatly improves fracture resistance; a very small ferrule predicts failure.</li>
  <li>To obtain it: crown lengthening or orthodontic extrusion, if the tooth remains restorable.</li>
</ul>
<h4 class="deck-topic">Post design guides</h4>
<ul>
  <li>Keep about <b>4 to 5 mm of apical gutta-percha</b>.</li>
  <li>Aim for adequate length, often at least equal to the clinical crown, extending into bone-supported root, without breaking the apical seal.</li>
  <li>Do not widen the canal just for a bigger post; width should stay about one third of root diameter or less, leaving sound dentin around.</li>
  <li>Longer posts retain better. Parallel posts retain better than tapered ones but need more shaping. Threaded active posts create high stress.</li>
  <li><b>Fiber posts</b> have stiffness nearer to dentin and may be only faintly radiopaque; cast posts show clearly.</li>
</ul>
<h4 class="deck-topic">Complications</h4>
<div class="sum-algo">
  <span class="sum-algo-title">Think and act</span>
  <ol>
    <li><b>Sudden bleeding</b> in the post space: suspect perforation; stop, check the position and take a periapical film (apex locator may help).</li>
    <li><b>Post and crown came out</b>: examine ferrule, caries, fit, occlusion, seal and root fracture before recementing.</li>
    <li><b>Deep narrow isolated pocket, sinus tract or J-shaped bone loss</b>: suspect vertical root fracture; CBCT can help but artefacts limit it.</li>
    <li>A confirmed vertical root fracture generally means the root is unrestorable.</li>
  </ol>
</div>
<ul>
  <li>Soft carious core under a sound-looking crown: remove crown and caries, then reassess restorability.</li>
</ul>
<div class="sum-key">
  <span class="sum-key-title">نقاط امتحانية</span>
  <ul>
    <li>Post function: <b>core retention</b>.</li>
    <li>Fracture with a 0.5 mm collar: <b>inadequate ferrule</b>.</li>
    <li>Leave a 4 to 5 mm apical seal.</li>
    <li>Vertical root fracture rules out a new post.</li>
  </ul>
</div>
      `,
            questions: [
                {
                    "q": "What is the primary purpose of an intraradicular post in an endodontically treated tooth?",
                    "options": [
                        "Retain the core",
                        "Strengthen the root",
                        "Seal the apex",
                        "Prevent caries"
                    ],
                    "answer": 0,
                    "explanation": "A post is indicated when insufficient coronal tooth structure remains to retain a core. It does not reinforce the root, and unnecessary post-space preparation may weaken the tooth. Reference: Rosenstiel SF et al. Contemporary Fixed Prosthodontics. Restoration of endodontically treated teeth. Page",
                    "source": "SDLE bank"
                },
                {
                    "q": "An endodontically treated tooth fractures after restoration. It had only a 0.5-mm ferrule, 5 mm of apical gutta-percha, and an otherwise acceptable post length. What is the most likely structural cause?",
                    "options": [
                        "Excess apical gutta-percha",
                        "Excessive post length",
                        "Normal crown height",
                        "Inadequate ferrule"
                    ],
                    "answer": 3,
                    "explanation": "A circumferential ferrule of roughly 1.5-2 mm of sound coronal dentin substantially improves fracture resistance; 0.5 mm provides inadequate bracing. Reference: Sorensen JA, Engelman MJ. Ferrule design and fracture resistance of endodontically treated teeth. J Prosthet Dent. 1990;63:529-536.",
                    "source": "SDLE bank"
                },
                {
                    "q": "Which finding most strongly contraindicates placement of a new post in a failed anterior restoration?",
                    "options": [
                        "Confirmed vertical root fracture",
                        "Adequate apical seal",
                        "Conserved radicular dentin",
                        "Achievable ferrule"
                    ],
                    "answer": 0,
                    "explanation": "A vertical root fracture makes a single-rooted tooth predictably nonrestorable. Favorable endodontic treatment, ferrule, and remaining dentin instead support retreatment when indicated. Reference: Hargreaves KM, Berman LH, eds. Cohen's Pathways of the Pulp. 12th ed. Vertical root fractures.",
                    "source": "SDLE bank"
                },
                {
                    "q": "Sudden bleeding occurs while preparing a post space. What is the first diagnostic step?",
                    "options": [
                        "Enlarge the post space",
                        "Cement the post immediately",
                        "Take a periapical radiograph",
                        "Continue without irrigation"
                    ],
                    "answer": 2,
                    "explanation": "Unexpected bleeding raises concern for root perforation or deviation from the canal. Instrumentation should stop and the location should be assessed radiographically, supplemented by magnification and other perforation-localization methods when needed. Reference: Hargreaves KM, Berman LH. Cohen's Pathways of the Pulp. Procedural accidents and root-perforation sections. Page",
                    "source": "SDLE bank"
                },
                {
                    "q": "A post-retained anterior crown dislodges two weeks after placement. What should be done before recementation?",
                    "options": [
                        "Recement it unchanged",
                        "Assess the tooth and restoration",
                        "Lengthen the post blindly",
                        "Extract the tooth immediately"
                    ],
                    "answer": 1,
                    "explanation": "Early dislodgement requires evaluation of caries, fracture, ferrule, post fit, preparation resistance, cementation, and occlusion before reuse or remake. Immediate recementation without identifying the cause risks another failure. Reference: Rosenstiel SF et al. Contemporary Fixed Prosthodontics. Restoration of endodontically treated teeth and cementation sections. Page",
                    "source": "SDLE bank"
                }
            ],
        },
        {
            id: "fx-impressions",
            title: "06 — Gingival Displacement, Impressions & Provisionals",
            title_en: "Cord · hemostatics · elastomers",
            summaryHtml: `
<h4 class="deck-topic">Healthy tissue first</h4>
<ul>
  <li>Bleeding and inflammation spoil the margin record. If a provisional is causing it, <b>correct or remake the provisional</b>, clean the area and let tissue heal before the final impression.</li>
  <li>Poor moisture control mainly gives voids and <b>lost margin detail</b>.</li>
</ul>
<h4 class="deck-topic">Displacement methods</h4>
<ul>
  <li>Plain or medicated cord, single or double cord technique, retraction pastes, laser, electrosurgery or rotary curettage in selected cases.</li>
  <li>Excessive force or long contact causes attachment injury and <b>recession</b>.</li>
</ul>
<div class="deck-cards">
  <div class="deck-card mgmt">
    <div class="deck-card-h">Aluminum chloride</div>
    <p>Common hemostatic astringent with little systemic effect; a safe choice in cardiovascular, hyperthyroid or diabetic patients.</p>
  </div>
  <div class="deck-card diag">
    <div class="deck-card-h">Ferric sulfate</div>
    <p>Effective hemostatic; can temporarily discolour tissue. Rinse well before impression or bonding.</p>
  </div>
  <div class="deck-card clin">
    <div class="deck-card-h">Epinephrine cord</div>
    <p>Systemic absorption through abraded tissue. Avoid in significant cardiovascular disease, uncontrolled hypertension, hyperthyroidism and poorly controlled diabetes.</p>
  </div>
</div>
<h4 class="deck-topic">Impression materials</h4>
<div class="deck-block deck-tbl">
  <table>
    <thead><tr><th>Material</th><th>Key point</th></tr></thead>
    <tbody>
      <tr><td><b>Addition silicone (PVS)</b></td><td>Very stable and accurate; sulfur from latex gloves or rubber can inhibit setting</td></tr>
      <tr><td><b>Polyether</b></td><td>Relatively hydrophilic, stiff after setting; absorbs water if stored wet</td></tr>
      <tr><td><b>Condensation silicone</b></td><td>Releases alcohol by-product and shrinks; pour early</td></tr>
      <tr><td><b>Alginate</b></td><td>Not for final crown margins; pour promptly</td></tr>
    </tbody>
  </table>
</div>
<ul>
  <li>A final elastomeric impression needs a <b>rigid tray</b> and a good tray adhesive.</li>
</ul>
<h4 class="deck-topic">Provisional restorations</h4>
<ul>
  <li>Protect pulp, hold tooth position, maintain gingiva and occlusion, and preview esthetics.</li>
  <li><b>PMMA</b> directly on a vital tooth: highest exothermic heat and free monomer, with marked shrinkage. Cool it, lift and reseat during setting, or use an indirect method.</li>
  <li>Bis-acryl composite gives less heat and shrinkage.</li>
  <li>Remove all temporary cement before final cementation; residue reduces seating and bonding.</li>
</ul>
<div class="sum-key">
  <span class="sum-key-title">نقاط امتحانية</span>
  <ul>
    <li>Medical risk with chemical retraction: prefer <b>aluminum chloride</b> over epinephrine.</li>
    <li>Final impression tray must be <b>rigid</b>.</li>
    <li>Direct PMMA is the hardest on a vital pulp.</li>
    <li>Treat inflamed tissue before recording it.</li>
  </ul>
</div>
      `,
            questions: [
                {
                    "q": "Which gingival retraction medicament is preferable for a patient with hyperthyroidism when a chemical agent is needed?",
                    "options": [
                        "Phenylephrine",
                        "Aluminum chloride",
                        "Epinephrine",
                        "Racemic epinephrine"
                    ],
                    "answer": 1,
                    "explanation": "Sympathomimetic retraction agents can provoke cardiovascular stimulation and should be avoided in uncontrolled or clinically significant hyperthyroidism. A locally acting astringent such as aluminum chloride is preferable when compatible with the tissue and product instructions. Reference: Rosenstiel SF et al. Contemporary Fixed Prosthodontics. 6th ed. Gingival displacement; Little and Falace's Dental Management of the Medically Compromised Patient. 10th ed.",
                    "source": "SDLE bank"
                },
                {
                    "q": "Which gingival retraction-cord medicament should generally be avoided in a patient with poorly controlled diabetes because of systemic sympathomimetic effects?",
                    "options": [
                        "Aluminum chloride",
                        "Plain water",
                        "Kaolin clay",
                        "Epinephrine"
                    ],
                    "answer": 3,
                    "explanation": "Epinephrine-impregnated cord can deliver unpredictable systemic catecholamine exposure and worsen cardiovascular and glycemic stress. A locally acting astringent such as aluminum chloride is generally preferred when chemical retraction is needed and compatible with the tissues and product instructions. Reference: Rosenstiel SF et al. Contemporary Fixed Prosthodontics. 6th ed. Gingival displacement; Little and Falace's Dental Management of the Medically Compromised Patient. 10th ed.",
                    "source": "SDLE bank"
                },
                {
                    "q": "Which property is essential for a custom tray used to make a final elastomeric impression?",
                    "options": [
                        "Flexibility",
                        "Solubility",
                        "Ductility",
                        "Rigidity"
                    ],
                    "answer": 3,
                    "explanation": "A rigid custom tray supports the impression material uniformly and resists distortion during removal and cast pouring. Reference: Rosenstiel SF, Land MF, Fujimoto J. Contemporary Fixed Prosthodontics. Custom impression trays.",
                    "source": "SDLE bank"
                },
                {
                    "q": "Which direct provisional material poses the greatest risk of pulpal irritation from polymerization heat and residual monomer on a vital tooth?",
                    "options": [
                        "Bis-acryl composite",
                        "Polymethyl methacrylate",
                        "Polyethyl methacrylate",
                        "Light-cured composite"
                    ],
                    "answer": 1,
                    "explanation": "Directly polymerized PMMA produces relatively high exothermic heat and contains methyl methacrylate monomer that can irritate pulpal tissues. Its shrinkage also increases the risk of marginal discrepancy unless the technique controls polymerization. Reference: Rosenstiel SF et al. Contemporary Fixed Prosthodontics. Provisional restorations section. Page",
                    "source": "SDLE bank"
                },
                {
                    "q": "Gingival bleeding remains uncontrolled after a provisional crown has been worn for two weeks. What should be done before the definitive impression?",
                    "options": [
                        "Take the impression through bleeding",
                        "Use epinephrine in every patient",
                        "Adjust or remake the provisional",
                        "Prepare a deeper subgingival margin"
                    ],
                    "answer": 2,
                    "explanation": "Persistent inflammation suggests a defective provisional contour, margin, contact, surface, or hygiene problem. Correct the cause and delay the final impression until the tissue becomes healthy and stable. Reference: Rosenstiel SF et al. Contemporary Fixed Prosthodontics. Provisional-restoration and gingival-displacement sections. Page",
                    "source": "SDLE bank"
                }
            ],
        },
        {
            id: "fx-occlusion",
            title: "07 — Occlusion & Articulators",
            title_en: "MIP vs CR · interferences · mounting",
            summaryHtml: `
<h4 class="deck-topic">Which jaw position?</h4>
<ul>
  <li><b>Conformative approach</b>: stable, comfortable maximum intercuspation (MIP) and limited work. Build the new restoration into <b>MIP</b>, even if it differs slightly from centric relation.</li>
  <li><b>Reorganised approach</b>: posterior stops lost, unstable MIP or full-mouth rehabilitation. Use <b>centric relation</b> as the reproducible reference.</li>
  <li>Without stable stops, mounting usually needs a <b>face-bow</b> and a centric relation record on record rims or bases.</li>
</ul>
<h4 class="deck-topic">Lateral guidance</h4>
<ul>
  <li><b>Canine guidance</b>: canines disclude all other teeth in excursion.</li>
  <li><b>Group function</b>: working-side canine and posteriors share contact; non-working side is free.</li>
  <li><b>Bilateral balance</b>: both sides touch; used mainly for complete dentures.</li>
</ul>
<h4 class="deck-topic">Interferences</h4>
<div class="deck-block deck-tbl">
  <table>
    <thead><tr><th>Type</th><th>Meaning or inclines</th></tr></thead>
    <tbody>
      <tr><td><b>Centric</b></td><td>Premature contact on closure that deflects the mandible. A forward slide involves mesial inclines of upper against distal inclines of lower</td></tr>
      <tr><td><b>Working</b></td><td>Posterior contact on the side toward which the jaw moves, disturbing smooth guidance</td></tr>
      <tr><td><b>Non-working</b></td><td>Contact on the opposite side, between inner inclines of supporting cusps; particularly destructive</td></tr>
      <tr><td><b>Protrusive</b></td><td>Posterior contact in protrusion: <b>distal inclines of upper</b> and mesial inclines of lower</td></tr>
    </tbody>
  </table>
</div>
<ul>
  <li>A new crown on which shimstock holds while other teeth lose contact is <b>high</b>.</li>
  <li>Check MIP first, then excursions, with marking paper and shimstock; adjust and polish.</li>
</ul>
<h4 class="deck-topic">Articulators</h4>
<ul>
  <li><b>Simple hinge</b>: opening and closing only.</li>
  <li><b>Mean value</b>: fixed average angles.</li>
  <li><b>Semi-adjustable</b>: accepts face-bow and some individual settings; suits most fixed work. In an <b>arcon</b> design the condylar balls are on the lower member, like the patient.</li>
  <li><b>Fully adjustable</b>: reproduces border movements from pantographic or equivalent records.</li>
</ul>
<h4 class="deck-topic">Vertical dimension and bruxism</h4>
<ul>
  <li>Sore muscles and reduced rest space after rehabilitation suggest <b>excessive OVD</b>.</li>
  <li>Bruxism raises the risk of wear and fracture; control the occlusion and consider a protective splint.</li>
</ul>
<div class="sum-key">
  <span class="sum-key-title">نقاط امتحانية</span>
  <ul>
    <li>Single crown with stable MIP: <b>keep MIP</b>.</li>
    <li>Lost posterior support: <b>centric relation</b>.</li>
    <li>Canine plus posteriors on the working side only: <b>group function</b>.</li>
    <li>Protrusive posterior interference: think distal upper inclines.</li>
  </ul>
</div>
      `,
            questions: [
                {
                    "q": "A patient has a stable maximum intercuspal position that differs slightly from centric relation. In which position should a single crown be integrated?",
                    "options": [
                        "Maximum intercuspation",
                        "Centric relation only",
                        "Midway between both",
                        "Edge-to-edge position"
                    ],
                    "answer": 0,
                    "explanation": "A single crown in a stable, comfortable dentition is normally harmonized with the patient's existing maximum intercuspal position. Reorganizing the entire occlusion into centric relation is not justified for one crown without a separate indication. Reference: Okeson JP. Management of Temporomandibular Disorders and Occlusion. Maximum intercuspation and restorative treatment sections. Page",
                    "source": "SDLE bank"
                },
                {
                    "q": "During a lateral excursion, the working-side canine and several posterior teeth share contact while the nonworking side discludes. What is the occlusal scheme?",
                    "options": [
                        "Balanced occlusion",
                        "Group function",
                        "Protrusive interference",
                        "Centric relation interference"
                    ],
                    "answer": 1,
                    "explanation": "Group function distributes lateral contact over multiple teeth on the working side without nonworking interference. It may be selected when canine guidance is unavailable or unsuitable. Reference: Okeson JP. Management of Temporomandibular Disorders and Occlusion. 8th ed. Lateral guidance schemes.",
                    "source": "SDLE bank"
                },
                {
                    "q": "During a right lateral excursion, a posterior contact occurs on the left side between the inner inclines of supporting cusps. How is it classified?",
                    "options": [
                        "Working-side contact",
                        "Nonworking-side interference",
                        "Centric stop",
                        "Protrusive guidance"
                    ],
                    "answer": 1,
                    "explanation": "A contact on the side opposite the direction of mandibular movement is a nonworking or mediotrusive contact. Heavy nonworking contacts can generate unfavorable lateral forces. Reference: Okeson JP. Management of Temporomandibular Disorders and Occlusion. 8th ed. Mediotrusive interferences.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A crown on tooth 26 creates a posterior protrusive interference. Which maxillary surface is commonly adjusted?",
                    "options": [
                        "Mesial incline",
                        "Buccal axial wall",
                        "Cervical margin",
                        "Distal incline"
                    ],
                    "answer": 3,
                    "explanation": "Protrusive posterior interferences occur between distal inclines of maxillary cusps and mesial inclines of mandibular cusps. Adjustment must preserve functional cusp tips and stable centric contacts. Reference: Okeson JP. Management of Temporomandibular Disorders and Occlusion. Selective occlusal adjustment section. Page",
                    "source": "SDLE bank"
                },
                {
                    "q": "Which articulator can reproduce patient-specific mandibular border movements when programmed with pantographic records?",
                    "options": [
                        "Simple hinge articulator",
                        "Mean-value articulator",
                        "Fixed-path articulator",
                        "Fully adjustable articulator"
                    ],
                    "answer": 3,
                    "explanation": "A fully adjustable articulator can be programmed with patient-specific three-dimensional border- movement records. Semi-adjustable instruments reproduce selected determinants but not the full individualized border envelope. Reference: Zarb GA et al. Prosthodontic Treatment for Edentulous Patients. Articulator classification and mandibular movement records. Page",
                    "source": "SDLE bank"
                }
            ],
        },
        {
            id: "fx-tryin-failures",
            title: "08 — Try-in, Cementation & Failures",
            title_en: "Seating · margins · debonding",
            summaryHtml: `
<h4 class="deck-topic">Try-in order</h4>
<div class="sum-algo">
  <span class="sum-algo-title">Usual sequence</span>
  <ol>
    <li>Remove provisional and all temporary cement.</li>
    <li>Adjust <b>proximal contacts</b> so the restoration can seat.</li>
    <li>Check internal seating, stability and <b>margins</b>.</li>
    <li>Check occlusion, contour, pontic contact and appearance.</li>
    <li>Polish adjusted areas, treat the surfaces and cement.</li>
  </ol>
</div>
<ul>
  <li>Incomplete seating: use disclosing media to find the contact. A small <b>positive nodule</b> inside a casting can be removed carefully.</li>
  <li>A rocking FPD framework suggests distortion or soldering error; it may need sectioning, index and reconnection, or remaking.</li>
  <li>A definite <b>open margin</b> is not solved with cement: remake or replace.</li>
  <li>Report a "bubble" fully: nodule, void and porcelain blister are managed differently.</li>
</ul>
<h4 class="deck-topic">Cement choice in brief</h4>
<ul>
  <li><b>Zinc phosphate</b>: long record, mechanical retention only.</li>
  <li><b>Polycarboxylate</b>: gentle on pulp, bonds to calcium.</li>
  <li><b>Glass ionomer / resin-modified</b>: chemical adhesion and fluoride release (conventional and modified forms).</li>
  <li><b>Resin cement</b>: needed for veneers, resin-bonded bridges and many weaker or bonded ceramics; helps low-retention cases; technique sensitive.</li>
</ul>
<h4 class="deck-topic">Problem after delivery</h4>
<div class="deck-block deck-tbl">
  <table>
    <thead><tr><th>Finding</th><th>Likely issue</th></tr></thead>
    <tbody>
      <tr><td>Bubbles and bad odour from under one retainer when pressed</td><td><b>Loose retainer</b> (lost seal); remove promptly to prevent caries</td></tr>
      <tr><td>Floss frays or tears</td><td>Rough margin, ledge, overhang or open margin</td></tr>
      <tr><td>Pain on biting after cementation</td><td>High contact; also assess pulp and cracks</td></tr>
      <tr><td>Redness or burning with no mechanical fault</td><td>Consider chemical, thermal or allergic injury</td></tr>
      <tr><td>Repeated porcelain chipping</td><td>Check occlusion and <b>porcelain support</b> by the framework</td></tr>
    </tbody>
  </table>
</div>
<ul>
  <li><b>Cohesive</b> fracture stays within one material; <b>adhesive</b> fracture occurs at an interface and may expose metal or core.</li>
  <li>A tiny chip may be polished or repaired. A large fracture in a functional and esthetic area is most predictably remade.</li>
  <li>Veneering ceramic chipping is a recognised problem of layered zirconia.</li>
  <li>Soldering <b>flux</b> prevents and dissolves oxides.</li>
</ul>
<div class="sum-key">
  <span class="sum-key-title">نقاط امتحانية</span>
  <ul>
    <li>Contacts first, then seating and margins, then occlusion.</li>
    <li>Open margin: remake.</li>
    <li>Bubbles under a retainer: <b>cement seal lost</b>.</li>
    <li>Chip within porcelain only is cohesive.</li>
  </ul>
</div>
      `,
            questions: [
                {
                    "q": "A fixed partial denture has malodor and air bubbles emerge from beneath one retainer. What is the most likely cause?",
                    "options": [
                        "Pontic fracture",
                        "Loss of retainer seal",
                        "Connector fracture",
                        "Excess occlusal clearance"
                    ],
                    "answer": 1,
                    "explanation": "Air or fluid movement beneath a retainer indicates loss of cement seal or incomplete seating and permits microbial and food ingress. The prosthesis should be assessed for decementation, caries, fracture, fit, and removability. Reference: Rosenstiel SF et al. Contemporary Fixed Prosthodontics. Fixed partial denture failure and cementation sections. Page",
                    "source": "SDLE bank"
                },
                {
                    "q": "At metal-framework try-in for a fixed partial denture, a positive metal nodule prevents complete seating. What is the best management?",
                    "options": [
                        "Identify and remove the internal interference conservatively",
                        "Force the framework to seat",
                        "Reduce the prepared tooth indiscriminately",
                        "Proceed to porcelain application without seating"
                    ],
                    "answer": 0,
                    "explanation": "A casting nodule or internal positive defect can be located with a disclosing medium and adjusted without compromising marginal integrity. The framework is then reevaluated for complete passive seating. Reference: Rosenstiel SF, Land MF, Fujimoto J. Contemporary Fixed Prosthodontics. 6th ed. Metal framework evaluation.",
                    "source": "SDLE bank"
                },
                {
                    "q": "Dental floss repeatedly frays at a rough negative ledge associated with an open margin of a fixed dental prosthesis. What is the definitive management?",
                    "options": [
                        "Polish the margin intraorally",
                        "Seal it with flowable composite",
                        "Apply fluoride varnish",
                        "Remake the prosthesis"
                    ],
                    "answer": 3,
                    "explanation": "An open, deficient margin cannot be predictably converted into a continuous, accurately fitting margin by polishing or adding restorative material. The defective prosthesis should be replaced after correcting its cause. Reference: Rosenstiel SF et al. Contemporary Fixed Prosthodontics. Evaluation of marginal integrity and replacement of defective fixed restorations. Page",
                    "source": "SDLE bank"
                },
                {
                    "q": "A small incisal chip occurs entirely within the veneering porcelain, with no metal exposed. What type of fracture is this?",
                    "options": [
                        "Adhesive fracture",
                        "Root fracture",
                        "Framework fracture",
                        "Cohesive fracture"
                    ],
                    "answer": 3,
                    "explanation": "A fracture contained within the ceramic is cohesive. Exposure of the underlying framework at the interface would instead indicate an adhesive or interfacial failure. Reference: Rosenstiel SF et al. Contemporary Fixed Prosthodontics. Metal-ceramic failure and repair sections. Page",
                    "source": "SDLE bank"
                },
                {
                    "q": "What is the principal function of flux during dental soldering?",
                    "options": [
                        "Prevent and dissolve oxides",
                        "Increase alloy hardness",
                        "Raise solder melting range",
                        "Separate the investment"
                    ],
                    "answer": 0,
                    "explanation": "Flux limits oxide formation and dissolves surface oxides, allowing molten solder to wet and flow across the parent alloy. It does not serve as the joining metal itself. Reference: Rosenstiel SF et al. Contemporary Fixed Prosthodontics. Soldering and laboratory procedures section. Page",
                    "source": "SDLE bank"
                }
            ],
        },
        {
            id: "fx-ceramics",
            title: "09 — Ceramics, Bonding, Shade & Conservative Esthetics",
            title_en: "Etch · silane · value · resin-bonded bridge",
            summaryHtml: `
<h4 class="deck-topic">Surface treatment before bonding</h4>
<div class="deck-block deck-tbl">
  <table>
    <thead><tr><th>Surface</th><th>Typical treatment</th></tr></thead>
    <tbody>
      <tr><td>Enamel</td><td><b>Phosphoric acid</b>, then the adhesive system</td></tr>
      <tr><td>Silica ceramic (feldspathic, leucite, lithium disilicate)</td><td><b>Hydrofluoric acid</b>, then <b>silane</b>, then resin; time depends on the ceramic</td></tr>
      <tr><td>Zirconia</td><td>HF does not etch it usefully; gentle air abrasion and a phosphate monomer (MDP) primer</td></tr>
    </tbody>
  </table>
</div>
<ul>
  <li>Intraoral porcelain repair uses low-percentage HF (commonly about 5 to 10%) with a sealed barrier and rubber dam because HF is hazardous.</li>
  <li>Use a diamond to cut or roughen porcelain, then polish.</li>
</ul>
<h4 class="deck-topic">Porcelain veneers</h4>
<ul>
  <li>Bond is most predictable when the preparation stays <b>mainly in enamel</b>.</li>
  <li>Reduction is conservative, commonly a few tenths of a millimetre, guided by a wax-up or mock-up.</li>
  <li>Keep margins away from heavy contact points where possible.</li>
</ul>
<h4 class="deck-topic">Resin-bonded (Maryland type) bridge</h4>
<ul>
  <li>Good for a short span with sound, enamel-rich abutments, especially one missing incisor in a young patient.</li>
  <li>Minimal enamel preparation; a metal retainer needs space of roughly 0.5 to 1 mm where it meets the opposing tooth.</li>
  <li>Poor choice with large restorations, little enamel, mobile abutments or heavy parafunction. The common failure is <b>debonding</b>.</li>
</ul>
<h4 class="deck-topic">Colour</h4>
<ul>
  <li><b>Hue</b> is the colour family, <b>chroma</b> its saturation, <b>value</b> its lightness. Value matters most in matching.</li>
  <li>A crown that looks gray is usually too <b>low in value</b>. Surface stains mostly lower value, so raising it is difficult and may need new ceramic.</li>
  <li><b>Metamerism</b>: a match under one light fails under another.</li>
  <li>Choose shade early, before teeth dehydrate, under suitable light.</li>
</ul>
<h4 class="deck-topic">Least invasive first</h4>
<ul>
  <li>One dark root-treated tooth may be bleached internally; a sound discoloured <b>vital</b> tooth can often start with external bleaching after diagnosis.</li>
  <li>Move to composite, veneer or crown according to remaining structure and the cause.</li>
</ul>
<div class="sum-key">
  <span class="sum-key-title">نقاط امتحانية</span>
  <ul>
    <li>Lithium disilicate: <b>HF then silane</b>.</li>
    <li>Veneer on enamel: phosphoric acid on the tooth.</li>
    <li>Gray crown: low <b>value</b>.</li>
    <li>Resin-bonded bridges depend on enamel.</li>
  </ul>
</div>
      `,
            questions: [
                {
                    "q": "Before silane application, what is the first surface-conditioning step for the intaglio surface of a lithium- disilicate restoration?",
                    "options": [
                        "Air abrasion with alumina",
                        "Phosphoric-acid etching",
                        "Hydrofluoric-acid etching",
                        "Sodium-hypochlorite treatment"
                    ],
                    "answer": 2,
                    "explanation": "Lithium disilicate is a silica-containing glass ceramic. Its intaglio surface is etched with hydrofluoric acid for the manufacturer-specified time, thoroughly rinsed and dried, and then treated with silane or a compatible ceramic primer. Reference: Manufacturer instructions for use for the selected lithium-disilicate ceramic and resin cement; Rosenstiel SF et al. Contemporary Fixed Prosthodontics. Adhesive cementation of glass ceramics. Product-specific timing",
                    "source": "SDLE bank"
                },
                {
                    "q": "Which agent is used to etch silica-based dental porcelain before adhesive repair?",
                    "options": [
                        "Phosphoric acid",
                        "Hydrofluoric acid",
                        "Nitric acid",
                        "Polyacrylic acid"
                    ],
                    "answer": 1,
                    "explanation": "Hydrofluoric acid selectively dissolves the glassy phase of silica-based ceramics and creates micromechanical retention. Concentration and etching time must follow the ceramic and manufacturer protocol, and zirconia requires a different surface treatment. Reference: Sturdevant CM et al. Sturdevant's Art and Science of Operative Dentistry. Ceramic repair and adhesive treatment sections. Page",
                    "source": "SDLE bank"
                },
                {
                    "q": "For bonding a porcelain veneer primarily to prepared enamel, which etching approach is appropriate?",
                    "options": [
                        "Etch enamel with hydrofluoric acid intraorally",
                        "Avoid all enamel conditioning",
                        "Use sodium hypochlorite as the sole etchant",
                        "Use phosphoric acid for the manufacturer's recommended enamel time"
                    ],
                    "answer": 3,
                    "explanation": "Phosphoric acid creates enamel microporosities for resin bonding. Common protocols are around 15 to 30 seconds, but product instructions and whether enamel is cut or uncut should guide exact timing. Reference: Ritter AV, Boushell LW, Walter R, eds. Sturdevant's Art and Science of Operative Dentistry. 7th ed. Enamel adhesion.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A ceramic crown is too low in value and appears gray. Which change is most appropriate?",
                    "options": [
                        "Add more gray",
                        "Increase translucency only",
                        "Increase value with a lighter, more opaque modification",
                        "Add the complementary hue without considering value"
                    ],
                    "answer": 2,
                    "explanation": "A restoration that is too dark or gray has deficient value. Hue-neutralization alone will not correct value; a lighter or more opaque layer may be required within system limits. Reference: Rosenstiel SF, Land MF, Fujimoto J. Contemporary Fixed Prosthodontics. 6th ed. Hue, chroma, value, and translucency.",
                    "source": "SDLE bank"
                },
                {
                    "q": "What enamel reduction is commonly used to provide space for the metal retainer of a resin-bonded fixed partial denture?",
                    "options": [
                        "1.5-2.0 mm",
                        "2.5-3.0 mm",
                        "0.5-1.0 mm",
                        "More than 3.0 mm"
                    ],
                    "answer": 2,
                    "explanation": "Conservative enamel reduction of approximately 0.5-1.0 mm provides room for a metal retainer while preserving the bondable enamel substrate. Proximal grooves and occlusal clearance are designed according to the tooth and alloy. Reference: Rosenstiel SF et al. Contemporary Fixed Prosthodontics. Resin-bonded fixed partial denture preparation section. Page",
                    "source": "SDLE bank"
                }
            ],
        },
    ],
};

export default dentalFixedProsthodontics;
