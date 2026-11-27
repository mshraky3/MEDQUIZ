// Rheumatology — medical-track section of the summaries catalog.
// Mirrored for the slide viewer in backend/content/summaryHtml (keep the two in sync).
// Inline questions are copied from the SQB bank.
const specialtyRheumatology = {
    id: "rheumatology",
    title: "Rheumatology",
    title_en: "SMLE Review — 9 Topics",
    icon: "shield-check",
    accent: "#a78bfa",
    intro: "Rheumatology for SMLE revision: Rheumatoid Arthritis · Lupus Diagnosis & Everyday Care · Severe Lupus & Pregnancy · Spondyloarthritis · Gout & CPPD · Hot Joint & Synovial Fluid · Osteoarthritis, PMR & Fibromyalgia · Vasculitis & Behçet · Scleroderma, Sjogren, Myositis & Overlap.",
    subtopics: [
        {
            id: "rhm-rheumatoid",
            title: "01 — Rheumatoid Arthritis",
            title_en: "Recognition · Methotrexate safety · Step-up therapy",
            summaryHtml: `
<h4 class="deck-topic">Recognise it</h4>
<ul>
  <li><b>Symmetric small-joint arthritis</b>: wrists, MCP, PIP and MTP; <b>DIP usually spared</b>. Morning stiffness often over 1 hour.</li>
  <li><b>Anti-CCP</b> is the more specific antibody; rheumatoid factor can be positive in other diseases. Either may be negative.</li>
  <li>X-ray: periarticular osteopenia, uniform joint space loss, <b>marginal erosions</b>. Ultrasound or MRI find early synovitis.</li>
  <li>Extra-articular: nodules, interstitial lung disease, pleural effusion (very low glucose), scleritis, dry eyes, anaemia, higher cardiovascular risk.</li>
  <li><b>Felty syndrome</b>: RA with <b>neutropenia and splenomegaly</b>; recurrent infections.</li>
  <li>Neck instability (C1–C2): assess before intubation if suspected.</li>
</ul>
<div class="sum-algo">
  <span class="sum-algo-title">Treat to target</span>
  <ol>
    <li>Start a DMARD early: <b>methotrexate</b> is the anchor drug.</li>
    <li>Short bridging corticosteroid if needed, then taper. NSAIDs relieve symptoms but do not stop damage.</li>
    <li>Review disease activity often; aim for remission or low activity.</li>
    <li>Still active: optimise methotrexate, then combine (for example hydroxychloroquine with sulfasalazine) or add a <b>biologic such as an anti-TNF agent</b>, or a targeted drug. Erosions and high antibody titres favour early escalation.</li>
  </ol>
</div>
<ul>
  <li>In selected patients with mild to moderate flares or no poor-prognosis features, combining conventional drugs is reasonable; guidelines differ in the order.</li>
  <li>Before biologic or JAK therapy: screen for <b>latent TB and hepatitis B and C</b>, update vaccines. JAK inhibitors need caution with older age, smoking, clot, cardiac or cancer risk.</li>
</ul>
<h4 class="deck-topic">Methotrexate safety</h4>
<ul>
  <li>Taken <b>once weekly</b> with <b>folic acid</b>. Check blood count, liver and kidney tests regularly.</li>
  <li><b>Mouth ulcers with fever or rigors</b>: think <b>marrow suppression</b>; urgent blood count, stop drug, antibiotics if neutropenic; folinic acid for toxicity.</li>
  <li>Marked liver enzyme rise: <b>stop</b> and investigate.</li>
  <li>New cough and breathlessness: pneumonitis or infection.</li>
  <li>Risk rises with kidney failure, trimethoprim and alcohol (liver). <b>Not in pregnancy</b>.</li>
  <li><b>Hydroxychloroquine</b>: retinal screening (baseline, then yearly after about 5 years, sooner with risks).</li>
</ul>
<div class="sum-key">
  <span class="sum-key-title">نقاط امتحانية</span>
  <ul>
    <li>New RA: methotrexate first line.</li>
    <li>Persistent erosive disease on methotrexate: escalate, commonly with anti-TNF.</li>
    <li>Methotrexate with fever and ulcers: check neutrophils.</li>
    <li>RA, big spleen and low neutrophils: Felty syndrome.</li>
  </ul>
</div>
`,
            questions: [
                {
                    "q": "A patient is diagnosed with rheumatoid arthritis. What is the first-line treatment?",
                    "options": [
                        "Methotrexate",
                        "Biologic medication",
                        "NSAIDs",
                        "Corticosteroids"
                    ],
                    "answer": 0,
                    "explanation": "RHEUMATOID ARTHRITIS: start a DMARD - METHOTREXATE - immediately at diagnosis; do not delay, as erosions occur early. WEEKLY dosing with FOLIC ACID; monitor FBC, LFTs and renal function; teratogenic. Steroids are a short-term BRIDGE only. Escalate to biologics for DMARD failure, screening for LATENT TB and hepatitis B first. Treat-to-target with regular disease activity scoring.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A 35-year-old man with rheumatoid arthritis for 6 months, on methotrexate 20 mg weekly and daily ibuprofen, presents with increasing joint pain in both hands and feet, with morning stiffness for 2 hours. Examination shows active arthritis at both wrists, and hand X-rays show erosions at multiple joints. Labs: Hb 120 g/L, platelets 450 x10^9/L, WBC 8 x10^9/L, ESR 60 mm/h (high), rheumatoid factor 500 kIU/L (high). What is the most appropriate additional treatment option?",
                    "options": [
                        "Azathioprine",
                        "Adalimumab",
                        "Cyclosporine",
                        "Mycophenolate mofetil"
                    ],
                    "answer": 1,
                    "explanation": "Persistent, erosive, active rheumatoid arthritis despite an adequate trial of methotrexate warrants escalation to a biologic disease-modifying agent, such as the TNF-alpha inhibitor adalimumab, rather than switching to another conventional agent like azathioprine, cyclosporine, or mycophenolate mofetil, which are not standard for rheumatoid arthritis.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A patient with rheumatoid arthritis on methotrexate develops chills, mouth ulcers and fever, with otherwise normal vital signs. There is no hepatosplenomegaly. What is the most likely cause?",
                    "options": [
                        "Felty syndrome",
                        "Viral infection",
                        "Methotrexate-induced neutropenia",
                        "Concomitant systemic lupus erythematosus"
                    ],
                    "answer": 2,
                    "explanation": "Methotrexate's dangerous toxicity is MYELOSUPPRESSION - earliest signs are STOMATITIS (mouth ulcers) + NEUTROPENIA (fever/chills). Stop MTX, urgent FBC, FOLINIC ACID rescue, treat infection. Prevent with weekly folic acid + FBC/LFT monitoring; higher risk with renal impairment, trimethoprim, NSAIDs. Felty = RA + SPLENOMEGALY + neutropenia (excluded here by no organomegaly).",
                    "source": "SMLE recall"
                },
                {
                    "q": "A 35-year-old woman with rheumatoid arthritis maintained on methotrexate 15 weekly. She is currently in remission. 4 months ago, her LFTs were normal but the most recent LFTs show: AST 300 (10x normal), ALT 280 (10x normal), Albumin 30 (low). What is the most appropriate action for her abnormal liver function tests?",
                    "options": [
                        "Do ultrasound for the liver",
                        "Start glucocorticoids",
                        "Stop methotrexate",
                        "Order liver biopsy"
                    ],
                    "answer": 2,
                    "explanation": "Methotrexate side effects: HEPATOTOXICITY (10-15% transaminitis, fibrosis with chronic use), bone marrow suppression, pneumonitis (idiosyncratic), mucositis, alopecia, teratogenicity (STOP 3-6 months pre-conception both sexes). Monitor: LFTs + CBC + Cr every 8-12 weeks. Prevent SE: FOLIC ACID 5mg weekly. HOLD if LFTs >3x ULN. Avoid in: liver disease, alcohol abuse, pregnancy, severe renal impairment.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A 50-year-old man presented to the clinic with a 15-year history of multiple joints pain with daily significant moming stiffness that lasts for 3 hours. He has been admitted 3 times during the last year to the local hospital for treatment of bacterial pneumonia. Physical examination reveals multiple rheumatoid nodules and an enlarged spleen. He has active arthritis affecting multiple metacarpophalangeal (MCP) and proximal interphalangeal (PIP) joints symmetrically. Hands x- ray show severe erosive disease of the MCP and PIP joints. Bone marrow aspiration and biopsy reveals an excess of immature forms and maturation arrest with normal differential (see lab results). Test Result Normal Values Hb 90 130-170 g/L (Male) 120-160 g/L (Female) Platelets count 100 150-400 x 109/L WBC 2 4.5-10.5 x 109/L ESR 80 2-10 mm/h (Male) 3-15 mm/h (Female) Rheumatoid factor 400 <58 klU/L Which of the following is the most likely diagnosis?",
                    "options": [
                        "Systemic lupus erythematosus",
                        "Feltys syndrome",
                        "Lymphoma",
                        "Tuberculosis"
                    ],
                    "answer": 1,
                    "explanation": "Core Concept: Felty syndrome is a rare, severe complication of long-standing Rheumatoid Arthritis characterized by the classic triad of RA, splenomegaly, and neutropenia (leading to recurrent bacterial infections). Clinical Presentation: · Severe, erosive, seropositive RA, recurrent infections (e.g., pneumonia, skin infections), splenomegaly, fatigue, weight loss. Diagnosis: · First-line: CBC showing severe neutropenia (<2000/µL), high-titer RF and anti-CCP. · Gold Standard: Clinical triad; bone marrow biopsy rules out primary hematologic malignancies (shows myeloid maturation arrest or hyperplasia). Management: · Acute: G-CSF for severe, life-threatening neutropenia with active infection. · Long-term: Aggressive treatment of the underlying RA with DMARDs (Methotrexate is first-line) or biologics (Rituximab). Splenectomy is reserved for refractory cases.",
                    "source": "SMLE bank"
                }
            ],
        },
        {
            id: "rhm-lupus-basics",
            title: "02 — Lupus: Diagnosis & Everyday Care",
            title_en: "Antibodies · Complement · Hydroxychloroquine · Arthritis",
            summaryHtml: `
<h4 class="deck-topic">When to suspect SLE</h4>
<ul>
  <li>Usually a young woman: fatigue, fever, photosensitive or malar rash (spares nasolabial folds), oral ulcers, hair loss.</li>
  <li>Non-erosive arthritis, serositis, kidney disease, cytopenias, seizures or psychosis, Raynaud.</li>
</ul>
<div class="deck-block deck-tbl"><table><thead><tr><th>Antibody or test</th><th>What it tells you</th></tr></thead><tbody>
<tr><td><b>ANA</b></td><td><b>First test</b>: very sensitive, not specific</td></tr>
<tr><td><b>Anti-dsDNA</b></td><td><b>Specific</b>; often tracks activity, especially kidney</td></tr>
<tr><td><b>Anti-Sm</b></td><td>Highly specific, less sensitive</td></tr>
<tr><td><b>C3 and C4</b></td><td>Low in active immune-complex disease</td></tr>
<tr><td><b>Anti-histone</b></td><td>Typical of drug-induced lupus</td></tr>
<tr><td><b>Anti-Ro (SSA)</b></td><td>Photosensitive rash, neonatal lupus, fetal heart block</td></tr>
<tr><td><b>Antiphospholipid</b></td><td>Clots and pregnancy loss</td></tr>
</tbody></table></div>
<ul>
  <li>Current EULAR/ACR classification requires a positive ANA (at least 1:80) before scoring. It is for classification; diagnosis remains clinical.</li>
  <li><b>Drug-induced lupus</b>: hydralazine, procainamide, isoniazid and others; kidney and brain involvement uncommon; improves after stopping. Anti-TNF drugs can cause a form with anti-dsDNA.</li>
</ul>
<h4 class="deck-topic">At each visit</h4>
<ul>
  <li>Urinalysis, urine protein ratio, creatinine, blood count, complement, anti-dsDNA; blood pressure.</li>
  <li><b>Fever</b>: always exclude infection. A marked CRP rise suggests infection, although serositis and arthritis can raise it.</li>
</ul>
<h4 class="deck-topic">Treatment ladder</h4>
<ul>
  <li><b>Hydroxychloroquine for almost everyone</b>: fewer flares and damage, fewer clots, better survival. Dose by weight (usually no more than 5 mg/kg actual weight daily).</li>
  <li>Sun protection, stop smoking, control BP and lipids, bone protection with steroids.</li>
  <li><b>Persistent arthritis despite hydroxychloroquine</b>: add <b>methotrexate</b> (azathioprine is another option), with short low-dose steroid.</li>
  <li>Belimumab or anifrolumab for selected active disease.</li>
  <li>Keep long-term steroid dose as low as possible, ideally 5 mg prednisolone daily or less, or stop.</li>
</ul>
<div class="sum-key">
  <span class="sum-key-title">نقاط امتحانية</span>
  <ul>
    <li>Initial serology: ANA.</li>
    <li>Confirm with specific antibodies: anti-dsDNA or anti-Sm.</li>
    <li>Hydroxychloroquine is the background drug.</li>
    <li>Active lupus arthritis on hydroxychloroquine: add a steroid-sparing agent such as methotrexate.</li>
  </ul>
</div>
`,
            questions: [
                {
                    "q": "A long case with a classic presentation of SLE. What is the most important INITIAL serology test?",
                    "options": [
                        "Anti-CCP",
                        "ANA",
                        "Anti-dsDNA",
                        "Antiphospholipid antibody"
                    ],
                    "answer": 1,
                    "explanation": "SCREEN with ANA (sensitive, non-specific); CONFIRM with anti-dsDNA and anti-Smith (specific). Anti-Smith is the most specific but least sensitive. Anti-histone points to DRUG-INDUCED lupus. Complement C3 and C4 FALL during active disease.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A patient with signs and symptoms of SLE has a positive lupus anticoagulant. Which test is specific for confirming the diagnosis of SLE?",
                    "options": [
                        "Anti-double-stranded DNA",
                        "Antiphospholipid antibody",
                        "Anti-CCP",
                        "ANA"
                    ],
                    "answer": 0,
                    "explanation": "SLE serology: ANA to SCREEN (sensitive, non-specific); anti-dsDNA and anti-Smith to CONFIRM (specific). Anti-dsDNA correlates with activity and nephritis; anti-Smith is the most specific but least sensitive. Anti-histone points to DRUG-INDUCED lupus (hydralazine, procainamide, isoniazid), which spares the kidneys and CNS.",
                    "source": "SMLE recall"
                },
                {
                    "q": "In a patient with SLE, what treatment is recommended in addition, for remission and to reduce vascular complications?",
                    "options": [
                        "Cyclophosphamide",
                        "Hydroxychloroquine",
                        "NSAIDs"
                    ],
                    "answer": 1,
                    "explanation": "Hydroxychloroquine is well-established baseline SLE therapy for all patients, with specific evidence for reducing vascular/thrombotic complications beyond general disease control.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A 28-year-old man with systemic lupus erythematosus presented with a 1-month history of joint pain and morning stiffness. He has no current skin rash or other systemic features. His current treatment: hydroxychloroquine 400 daily. Examination: active arthritis at both wrists and the second PIP joint of both hands. Hb 125, Platelets 220, WBC 5, ESR 55 (high), Urea 4.5, Creatinine 78, CRP 12 (high), Complement C3 0.9 (normal), C4 0.1 (low). Which of the following agents should be added to control the arthritis?",
                    "options": [
                        "Methotrexate",
                        "Sulfasalazine",
                        "Azathioprine",
                        "Cyclosporine"
                    ],
                    "answer": 0,
                    "explanation": "SLE treatment: HYDROXYCHLOROQUINE = backbone for all (reduces flares, protective). Add agents by manifestation: ARTHRITIS/skin not controlled → METHOTREXATE (steroid-spflaring) ± short steroids. Major organ disease (nephritis, CNS) → high-dose steroids + mycophenolate or cyclophosphamide. Azathioprine = maintenance/pregnancy-safe. Belimumab/rituximab for refractory. Avoid sulfasalazine (can flare lupus). NSAIDs/short steroids for acute symptom relief.",
                    "source": "SMLE recall"
                }
            ],
        },
        {
            id: "rhm-hot-joint",
            title: "03 — The Hot Joint & Synovial Fluid",
            title_en: "Aspirate first · Septic arthritis · Fluid patterns",
            summaryHtml: `
<p><b>An acutely hot, swollen joint is septic until proven otherwise.</b> Fever may be mild or absent, especially with steroids or biologics. In RA, one joint that is much worse than the others is a warning.</p>
<div class="sum-algo">
  <span class="sum-algo-title">Order of actions</span>
  <ol>
    <li><b>Aspirate the joint</b> before antibiotics.</li>
    <li>Send cell count, Gram stain, culture and crystals; draw blood cultures.</li>
    <li>Unless very unlikely, start <b>IV antibiotics</b> right after sampling. In sepsis, do not delay them.</li>
    <li><b>Drain</b> the joint (needle, arthroscopy or open).</li>
    <li>Hold immunosuppressive biologics during infection; do not stop chronic steroids suddenly.</li>
  </ol>
</div>
<div class="deck-block deck-tbl"><table><thead><tr><th>Fluid type</th><th>White cells per mm³ (approximate)</th><th>Examples</th></tr></thead><tbody>
<tr><td><b>Normal</b></td><td>Below 200</td><td>Clear, viscous</td></tr>
<tr><td><b>Non-inflammatory</b></td><td>Below 2,000</td><td>Osteoarthritis, trauma</td></tr>
<tr><td><b>Inflammatory</b></td><td>2,000–50,000</td><td>RA, crystals, reactive</td></tr>
<tr><td><b>Septic range</b></td><td>Often above 50,000, mainly neutrophils</td><td>Bacterial; crystals can mimic</td></tr>
</tbody></table></div>
<ul>
  <li>Ranges overlap: a lower count <b>does not exclude infection</b>, and <b>crystals do not exclude it</b>.</li>
</ul>
<div class="deck-cards">
  <div class="deck-card diag"><div class="deck-card-h">Usual organisms</div><ul><li><i>S. aureus</i> commonest, then streptococci</li><li>Gram-negatives in elderly, immunosuppressed, IV drug use</li><li><i>Brucella</i> with raw milk exposure</li></ul></div>
  <div class="deck-card clin"><div class="deck-card-h">Gonococcal</div><ul><li>Young sexually active adult</li><li>Migratory pain, tenosynovitis, skin pustules</li><li>Test genital and other mucosal sites</li><li>Ceftriaxone; assess for chlamydia</li></ul></div>
  <div class="deck-card mgmt"><div class="deck-card-h">Empirical cover</div><ul><li>Guided by Gram stain and local resistance</li><li>MRSA risk: vancomycin</li><li>Gram-negative risk: third-generation cephalosporin or antipseudomonal drug</li><li>Several weeks of therapy</li></ul></div>
</div>
<ul>
  <li><b>Prosthetic joint</b>: urgent orthopaedic review; if the patient is stable, obtain samples before any antibiotic.</li>
  <li>Normal serum urate, normal blood count or a normal early X-ray do not exclude infection.</li>
  <li>Monoarthritis differential: infection, gout, CPPD, trauma, haemarthrosis, reactive or early inflammatory arthritis.</li>
</ul>
<div class="sum-key">
  <span class="sum-key-title">نقاط امتحانية</span>
  <ul>
    <li>RA patient with one new hot knee: arthrocentesis first.</li>
    <li>Confirmed septic arthritis: IV antibiotics and drainage.</li>
    <li>S. aureus is the usual organism.</li>
    <li>Immunosuppression can hide fever.</li>
  </ul>
</div>
`,
            questions: [
                {
                    "q": "A 33-year-old woman with rheumatoid arthritis for 3 years is evaluated in the Emergency Department with a 3-day history of pain and swelling of the left knee and low-grade fever. There was no history of trauma. Her medications are prednisone, methotrexate, and etanercept. Joint examination reveals a swollen and tender left knee, and mild synovitis is present on the third proximal interphalangeal joint bilaterally. Which of the following is the most appropriate initial management?",
                    "options": [
                        "Bone scan",
                        "Arthrocentesis of the left knee",
                        "Conventional radiology of the left knee",
                        "Magnetic resonance imaging (MRI) of the left knee"
                    ],
                    "answer": 1,
                    "explanation": "Acute monoarthritis (esp. with fever, immunosuppression) = ARTHROCENTESIS first to exclude SEPTIC ARTHRITIS (medical emergency). Synovial fluid: WBC >50,000 (often >100,000) + >90% PMN + positive Gram/culture = septic. Crystals = gout (negative birefringent needles) or pseudogout (positive birefringent rhomboids). Don't assume RA/gout flare in a febrile immunosuppressed patient — aspirate. Septic arthritis Tx: drainage + IV antibiotics.",
                    "source": "SMLE recall"
                },
                {
                    "q": "Old pt with rheumatoid arthritis, now coming with symptoms of septic arthritis, the fluid aspiration from the knee is positive for septic arthritis, what to do next?",
                    "options": [
                        "Give IV antibiotics",
                        "intrarticular steroids injection"
                    ],
                    "answer": 0,
                    "explanation": "Once joint aspiration confirms septic arthritis, and samples for culture have been taken, start IV antibiotics promptly to protect the cartilage, together with joint drainage. Initial choice covers Staphylococcus aureus. Intra-articular steroids are contraindicated in an infected joint.",
                    "source": "SMLE recall"
                }
            ],
        },
        {
            id: "rhm-spondyloarthritis",
            title: "04 — Spondyloarthritis",
            title_en: "Inflammatory back pain · Psoriatic · Reactive",
            summaryHtml: `
<p>Shared features: HLA-B27 link, usually negative rheumatoid factor, <b>sacroiliitis, enthesitis, dactylitis</b>, asymmetric lower-limb arthritis, <b>anterior uveitis</b>.</p>
<h4 class="deck-topic">Inflammatory back pain</h4>
<ul><li>Starts young (before about 45), gradual, over 3 months, long morning stiffness, <b>better with exercise, not with rest</b>, night pain, alternating buttock pain.</li></ul>
<h4 class="deck-topic">Axial spondyloarthritis and ankylosing spondylitis</h4>
<ul>
  <li>Limited spine movement (modified Schober), reduced chest expansion, Achilles tenderness.</li>
  <li>Imaging: <b>pelvic X-ray</b> of the sacroiliac joints is usually first; if normal and suspicion remains, <b>MRI sacroiliac joints</b> detects early inflammation. HLA-B27 supports but does not prove.</li>
  <li>Late: syndesmophytes and bamboo spine. A fused spine can fracture after minor trauma: CT.</li>
  <li>Associations: uveitis, aortic regurgitation, apical lung fibrosis.</li>
  <li>Treatment: exercise and physiotherapy, <b>NSAIDs</b> first; then <b>TNF or IL-17 inhibitor</b>, or JAK inhibitor in suitable patients. Methotrexate does not treat axial disease.</li>
</ul>
<div class="deck-cards">
  <div class="deck-card diag"><div class="deck-card-h">Psoriatic arthritis</div><ul><li><b>DIP</b> disease, <b>sausage digit</b>, nail pitting or onycholysis</li><li>Check scalp, umbilicus, natal cleft; skin disease may follow arthritis</li><li>Pencil-in-cup in advanced disease</li><li>NSAID, methotrexate for peripheral disease, biologics</li></ul></div>
  <div class="deck-card clin"><div class="deck-card-h">Reactive arthritis</div><ul><li>About <b>1–4 weeks after gut or genital infection</b></li><li><i>Salmonella, Shigella, Campylobacter, Yersinia, C. difficile, Chlamydia</i></li><li>May have urethritis, conjunctivitis, skin lesions</li><li>Joint fluid is sterile</li></ul></div>
  <div class="deck-card mgmt"><div class="deck-card-h">Reactive: treatment</div><ul><li><b>NSAID first</b></li><li>Steroid injection for a few joints once infection is excluded</li><li>Persistent disease: <b>sulfasalazine</b> or another DMARD</li><li>Treat active chlamydia and partners</li></ul></div>
</div>
<ul>
  <li><b>IBD-related arthritis</b>: use NSAIDs cautiously (may worsen bowel disease); anti-TNF antibodies treat both. IL-17 inhibitors are avoided in active IBD.</li>
  <li>Psoriasis and gout can coexist; poor response to urate control with new joint patterns should prompt review for psoriatic arthritis.</li>
</ul>
<div class="sum-key">
  <span class="sum-key-title">نقاط امتحانية</span>
  <ul>
    <li>Young man, back pain better with movement: ankylosing spondylitis.</li>
    <li>DIP arthritis with dactylitis: look for psoriasis.</li>
    <li>Arthritis after diarrhoea: reactive, start NSAID.</li>
    <li>Reactive arthritis lasting months despite NSAIDs: consider sulfasalazine.</li>
  </ul>
</div>
`,
            questions: [
                {
                    "q": "A 26-year-old man complained of pain in his buttocks, lower back and stiffness which improved after moving around and doing exercises. The patient had similar complaints a year ago. Which of the following is the most likely diagnosis?",
                    "options": [
                        "Hyperuricemia",
                        "Psoriatic arthritis",
                        "Reactive arthritis",
                        "Ankylosing spondylitis"
                    ],
                    "answer": 3,
                    "explanation": "Inflammatory back pain (IPAIN): Insidious, >3mo, age<40, Improves with exercise (worsens with rest), Night pain. Schober test <5cm = restricted spine. MRI SI joints = earliest. HLA-B27 positive 90%. Treatment: NSAIDs → TNF inhibitors. Exercise/PT essential.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A patient develops arthritis after Clostridioides difficile infection. What is the most likely explanation?",
                    "options": [
                        "Reactive arthritis",
                        "Septic arthritis"
                    ],
                    "answer": 0,
                    "explanation": "Reactive arthritis = STERILE joint AFTER a GI or GU infection (HLA-B27). Septic arthritis = organism IN the joint (aspirate it — it is an emergency). The joint fluid distinguishes them.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A 38-year-old man presented to the clinic complaining of recurrent painful swelling affecting right knee and left ankle for 6-months despite using non-steroidal anti-inflammatory drugs. His past history revealed urinary tract infection 2-weeks prior to onset of his joint pain. On examination, he has active arthritis at right knee and left ankle (see lab results). Test Result Normal Values Hb 160 130-170 g/L (Male) 120-160 g/L (Female) Platelets count 450 150-400 x 109/L WBC 12 4.5-10.5 x 109/L ESR 65 2-10 mm/h (Male) 3-15 mm/h (Female) Urea 4 2.75-7.4 mmol/L Creatinine 100 44-115 mol/1. C-reactive peptide 20 <8.2 /L Rheumatoid factor 13 <58 kJU/L Color clear clear or light yellow Protein absent absent Nitrite absent absent Leukocytes 2 0-3 per high power eld Which of the following is the most appropriate treatment?",
                    "options": [
                        "Sulfasalazine",
                        "Methotrexate",
                        "Azithromycin",
                        "Cyclosporine"
                    ],
                    "answer": 0,
                    "explanation": "Reactive arthritis (sterile asymmetrical lower-limb oligoarthritis + enthesitis, days-weeks AFTER a GI or GU infection, HLA-B27-associated): first-line = NSAIDs; for PERSISTENT/chronic disease not responding to NSAIDs → a DMARD, typically SULFASALAZINE (± methotrexate if refractory). Treat any ongoing triggering infection. Chronic reactive arthritis after NSAID failure → sulfasalazine.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A 40-year-old man with recurrent painful attacks affecting the right big toe was diagnosed with gout and started on allopurinol. He also has known psoriasis. He now presents with recurrent joint pain affecting the right big toe, left ankle, and bilateral knees, despite regular allopurinol use with no improvement. Exam shows active arthritis at the left ankle and bilateral knees. Which of the following is the most likely cause for his joint pain?",
                    "options": [
                        "Active pseudogout arthritis",
                        "Active gout arthritis",
                        "Psoriatic arthritis",
                        "Osteoarthritis"
                    ],
                    "answer": 2,
                    "explanation": "With good allopurinol compliance and a new joint distribution pattern different from his classic gout site, combined with his known psoriasis, psoriatic arthritis is the more likely cause of this new presentation rather than ongoing active gout.",
                    "source": "SMLE recall"
                }
            ],
        },
        {
            id: "rhm-lupus-severe",
            title: "05 — Severe Lupus & Pregnancy",
            title_en: "Nephritis · Neuropsychiatric · Hip pain · Planning",
            summaryHtml: `
<h4 class="deck-topic">Lupus nephritis</h4>
<ul>
  <li>Clues: proteinuria, haematuria, casts, rising creatinine, hypertension, low complement, high anti-dsDNA.</li>
  <li><b>Kidney biopsy</b> guides treatment: usually for persistent proteinuria of about <b>0.5 g/day or more</b>, active sediment or unexplained fall in function.</li>
  <li><b>Proliferative (class III or IV)</b>: corticosteroid plus <b>mycophenolate</b> or low-dose IV <b>cyclophosphamide</b>; current guidance may add belimumab or a calcineurin inhibitor. Then maintenance, often mycophenolate.</li>
  <li>All: hydroxychloroquine, BP control, <b>ACE inhibitor or ARB</b> for proteinuria (not in pregnancy).</li>
  <li>Pure class V is treated according to protein loss.</li>
</ul>
<h4 class="deck-topic">Neuropsychiatric lupus</h4>
<ul>
  <li>Seizure, psychosis, myelitis and others. <b>Exclude infection</b>, metabolic and drug causes; MRI and CSF.</li>
  <li>Severe <b>inflammatory</b> disease: <b>high-dose corticosteroid plus cyclophosphamide</b> (rituximab is an alternative or rescue).</li>
  <li><b>Clot-related</b> events with antiphospholipid antibodies: anticoagulation or antithrombotic therapy.</li>
  <li>Also treat seizures or psychosis symptomatically.</li>
</ul>
<h4 class="deck-topic">Other serious problems</h4>
<ul>
  <li><b>Hip or groin pain on steroids</b>, worse with weight bearing, normal X-ray: <b>avascular necrosis</b>; get <b>MRI</b>.</li>
  <li><b>Haemolytic anaemia</b> (high reticulocytes, LDH; low haptoglobin) and severe thrombocytopenia.</li>
  <li>Breathlessness: infection, pleuritis, pneumonitis, bleeding, embolism, pericardial effusion, shrinking lung.</li>
  <li>Sterile valve vegetations (Libman-Sacks). Early coronary disease.</li>
  <li>Shock in an immunosuppressed patient: treat as sepsis and give stress-dose steroid if on long-term steroids.</li>
</ul>
<h4 class="deck-topic">Pregnancy</h4>
<ul>
  <li>Conceive after about <b>6 months of quiet disease</b>.</li>
  <li><b>Stop mycophenolate</b> in advance (at least 6 weeks) and <b>switch to azathioprine</b>; confirm disease stays stable.</li>
  <li>Keep <b>hydroxychloroquine</b>; azathioprine and low-dose steroid are compatible. Avoid methotrexate and cyclophosphamide when planning.</li>
  <li>Low-dose aspirin for most; LMWH too in antiphospholipid syndrome.</li>
  <li>Test anti-Ro and anti-La: positive mothers need fetal heart rhythm surveillance.</li>
  <li>Nephritis flare and pre-eclampsia can look alike: low complement, rising anti-dsDNA and urinary casts favour lupus.</li>
</ul>
<div class="sum-key">
  <span class="sum-key-title">نقاط امتحانية</span>
  <ul>
    <li>Significant proteinuria: biopsy to class the nephritis.</li>
    <li>Active inflammatory brain lupus: steroids plus cyclophosphamide.</li>
    <li>Planning pregnancy on mycophenolate: change to azathioprine.</li>
    <li>Normal hip film does not exclude avascular necrosis.</li>
  </ul>
</div>
`,
            questions: [
                {
                    "q": "A 26-year-old female with known systemic lupus erythematosus (SLE) presents with photosensitivity, malar rash, and arthritis. Laboratory results show positive Anti-dsDNA and evidence of lupus nephritis. Her blood pressure is 155/90 mmHg. What is the best next step in management?",
                    "options": [
                        "Reassure the patient",
                        "Start corticosteroid therapy",
                        "Control blood pressure",
                        "Perform a renal biopsy"
                    ],
                    "answer": 3,
                    "explanation": "Core Concept: Lupus nephritis is a severe manifestation of Systemic Lupus Erythematosus (SLE). A renal biopsy is essential to classify the type of nephritis, which dictates the intensity of immunosuppressive therapy. Clinical Presentation: · Edema, hypertension, frothy urine (proteinuria), and hematuria in a patient with SLE stigmata (malar rash, arthritis). Diagnosis: · First-line diagnostic plan: Urinalysis (proteinuria, cellular casts), serum creatinine, and serology (Anti-dsDNA, low complement C3/C4). · Gold standard: Percutaneous renal biopsy to determine the ISN/RPS histological class (I-VI). Management: · Acute management: Strict blood pressure control (ACEi/ARB) and prompt renal biopsy to guide therapy. · Gold standard long-term management: Immunosuppression tailored to the biopsy class (e.g., mycophenolate mofetil or cyclophosphamide for Class III/IV), alongside hydroxychloroquine for all SLE patients.",
                    "source": "SMLE bank"
                },
                {
                    "q": "A 28-year-old woman with active neuropsychiatric lupus based on clinical manifestations and workup. Which of the following is the most appropriate first-line therapy?",
                    "options": [
                        "Corticosteroids and cyclophosphamide",
                        "Intravenous cyclophosphamide",
                        "Corticosteroids and rituximab",
                        "Intravenous corticosteroid"
                    ],
                    "answer": 0,
                    "explanation": "Severe organ-threatening (neuropsychiatric) lupus is treated first-line with the combination of corticosteroids plus cyclophosphamide for induction, rather than either agent alone.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A 30-year-old woman with a diagnosis of systemic lupus erythematosus who was maintained on mycophenolate mofetil 1 gm/day, hydroxychloroquine 200 /day, and prednisone 5 /day for the last 1 year. She has had inactive disease for more than 6 months. She is planning to get pregnant (see lab results). Which of the following is the most appropriate action at this time?",
                    "options": [
                        "Discontinue prednisone and start cyclosporine",
                        "Discontinue hydroxychloroquine and start quinacrine",
                        "Discontinue mycophenolate mofetil and start azathioprine",
                        "Discontinue mycophenolate mofetil and start methotrexate"
                    ],
                    "answer": 2,
                    "explanation": "When an SLE patient plans pregnancy, STOP teratogenic drugs (MYCOPHENOLATE, methotrexate, cyclophosphamide) and switch to pregnancy-compatible immunosuppression — AZATHIOPRINE; CONTINUE hydroxychloroquine (safe and reduces flares); and conceive during disease remission. SLE planning pregnancy → switch mycophenolate to azathioprine (continue hydroxychloroquine).",
                    "source": "SMLE recall"
                },
                {
                    "q": "A 30-year-old woman with SLE, on azathioprine, hydroxychloroquine, prednisolone, and lisinopril for the last 5 years, is evaluated for right hip pain that started 3 weeks ago, occurring at night and with walking. Examination is normal except for pain on internal rotation of the right hip. Labs and pelvic/hip X-rays are normal. Which of the following is the most likely cause of her hip pain?",
                    "options": [
                        "Active lupus arthritis",
                        "Septic arthritis affecting the right hip",
                        "Avascular necrosis affecting the right hip",
                        "Degenerative changes affecting the right hip"
                    ],
                    "answer": 2,
                    "explanation": "Long-term corticosteroid use is a major risk factor for avascular necrosis of the femoral head, which classically presents with hip pain worsened by weight-bearing and internal rotation; plain X-rays are often normal in early avascular necrosis, with MRI being more sensitive for early detection.",
                    "source": "SMLE recall"
                }
            ],
        },
        {
            id: "rhm-crystal",
            title: "06 — Gout & CPPD",
            title_en: "Crystals · Acute flare · Urate lowering",
            summaryHtml: `
<div class="deck-block deck-tbl"><table><thead><tr><th>Feature</th><th>Gout</th><th>CPPD (pseudogout)</th></tr></thead><tbody>
<tr><td><b>Crystal</b></td><td><b>Needle-shaped, negatively birefringent</b> urate</td><td>Rhomboid or rod, <b>weakly positive</b></td></tr>
<tr><td><b>Joints</b></td><td>First MTP, midfoot, ankle, knee</td><td>Knee, wrist</td></tr>
<tr><td><b>Patient</b></td><td>Men, postmenopausal women, kidney disease</td><td>Older adults</td></tr>
<tr><td><b>X-ray</b></td><td>Punched-out erosions with overhanging edge</td><td>Chondrocalcinosis</td></tr>
</tbody></table></div>
<ul>
  <li><b>Serum urate may be normal during a flare</b>; high urate alone does not make gout. Recheck later.</li>
  <li>CPPD at a younger age: test calcium and PTH, iron studies, magnesium, phosphate.</li>
  <li>Triggers for gout: alcohol, red meat and seafood, fructose drinks, dehydration, <b>thiazide and loop diuretics</b>, surgery.</li>
</ul>
<h4 class="deck-topic">Acute flare</h4>
<ul>
  <li>Treat early with <b>NSAID, low-dose colchicine or corticosteroid</b> (oral or injected).</li>
  <li>Kidney disease, ulcer, heart failure or anticoagulant: avoid NSAIDs. Colchicine needs dose care in kidney or liver disease and with strong interacting drugs (for example clarithromycin).</li>
  <li><b>Continue existing allopurinol</b> during a flare.</li>
  <li>CPPD flare: aspiration, steroid injection, NSAID or colchicine.</li>
</ul>
<h4 class="deck-topic">Long-term urate lowering</h4>
<ul>
  <li>Indicated for <b>2 or more flares a year, tophi or joint damage</b>; also considered earlier with stones, kidney disease or very high urate.</li>
  <li><b>Allopurinol</b> is first line. Start low (about 100 mg daily, less in advanced kidney disease), increase to target.</li>
  <li>Target urate usually <b>below 360 µmol/L</b> (below 300 with tophi or severe disease).</li>
  <li>Give <b>flare prophylaxis</b> (such as low-dose colchicine) for the first months.</li>
  <li>Starting after the flare settles is traditional; newer guidance also allows starting during it with anti-inflammatory cover.</li>
  <li>Warn about rash: stop and seek care. HLA-B*58:01 testing is advised in high-risk ancestries.</li>
  <li>With <b>azathioprine</b>, allopurinol or febuxostat can cause severe marrow toxicity.</li>
  <li>Febuxostat is an alternative (discuss cardiovascular risk). Do not treat asymptomatic hyperuricaemia routinely.</li>
</ul>
<div class="sum-key">
  <span class="sum-key-title">نقاط امتحانية</span>
  <ul>
    <li>Gout crystal: needle, negative birefringence.</li>
    <li>Repeated flares with high urate: allopurinol.</li>
    <li>Titrate to a urate target, with prophylaxis.</li>
    <li>Cartilage calcification in an older knee: CPPD.</li>
  </ul>
</div>
`,
            questions: [
                {
                    "q": "A 55-year-old man with a history of 4 recurrent gout flares in the past year presents for routine follow-up 4 weeks AFTER his last attack fully resolved. His serum uric acid remains elevated at 540 umol/L. What is the most appropriate long-term management to prevent future attacks?",
                    "options": [
                        "Indomethacin daily",
                        "Allopurinol",
                        "Oral Prednisone",
                        "Acetaminophen"
                    ],
                    "answer": 1,
                    "explanation": "Two or more gout flares a year, tophi or urate stones are the indication to start allopurinol, titrated to a serum urate below 360 umol/L, with flare prophylaxis during titration.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A 30-year-old man presented to the emergency department with acute monoarthritis where joint aspiration was performed. Based on the presence of crystals in the synovial fluid, he was diagnosed with gout. Which of the following is the most likely type of crystal seen?",
                    "options": [
                        "Needle-shaped, negatively birefringent",
                        "Needle-shaped, weakly positively birefringent",
                        "Rhomboidal-shaped, negatively birefringent",
                        "Rhomboidal-shaped, weakly positively birefringent"
                    ],
                    "answer": 0,
                    "explanation": "Monosodium urate crystals in gout are classically needle-shaped and negatively birefringent under polarized light, distinct from the rhomboid, weakly positively birefringent CPPD crystals of pseudogout.",
                    "source": "SMLE recall"
                }
            ],
        },
        {
            id: "rhm-oa-pmr-fibro",
            title: "07 — Osteoarthritis, PMR & Fibromyalgia",
            title_en: "Mechanical pain · Girdle stiffness · Widespread pain",
            summaryHtml: `
<h4 class="deck-topic">Osteoarthritis</h4>
<ul>
  <li>Older age, obesity, injury. Pain with use; morning stiffness usually <b>under 30 minutes</b>; crepitus, bony enlargement.</li>
  <li>Hands: <b>Heberden nodes (DIP)</b>, <b>Bouchard nodes (PIP)</b>, base of thumb. MCP involvement is unusual: think CPPD, haemochromatosis or RA.</li>
  <li>X-ray: <b>uneven joint space loss, osteophytes, subchondral sclerosis and cysts</b>. Symptoms and film severity may not match.</li>
  <li>Inflammatory markers and antibodies are usually normal and not needed for a typical case.</li>
  <li>Treatment: <b>exercise, strengthening, weight loss</b>, education, aids. <b>Topical NSAID</b> for knee or hand; oral NSAID at lowest effective dose after risk review; steroid injection for flares; joint replacement for severe persistent symptoms.</li>
</ul>
<div class="deck-block deck-tbl"><table><thead><tr><th>Clue</th><th>Osteoarthritis</th><th>Rheumatoid arthritis</th></tr></thead><tbody>
<tr><td><b>DIP</b></td><td>Commonly involved</td><td>Usually spared</td></tr>
<tr><td><b>Swelling</b></td><td>Hard, bony</td><td>Soft, boggy synovitis</td></tr>
<tr><td><b>Stiffness</b></td><td>Short</td><td>Long</td></tr>
<tr><td><b>ESR and CRP</b></td><td>Usually normal</td><td>Often raised</td></tr>
</tbody></table></div>
<h4 class="deck-topic">Polymyalgia rheumatica</h4>
<ul>
  <li><b>Age over 50</b>, new bilateral shoulder (and often hip girdle) pain and stiffness.</li>
  <li>High ESR or CRP, <b>normal CK</b>, true strength preserved.</li>
  <li><b>Low-dose prednisolone</b> (about 12.5–25 mg daily) gives rapid improvement; taper slowly. Poor response: reconsider.</li>
  <li>Always ask about <b>giant cell arteritis</b> symptoms.</li>
</ul>
<h4 class="deck-topic">Fibromyalgia</h4>
<ul>
  <li>Widespread pain for over 3 months, <b>fatigue, unrefreshing sleep</b>, poor concentration. No synovitis; basic tests normal.</li>
  <li>Can coexist with inflammatory disease.</li>
  <li><b>Exercise and education</b> are central; treat sleep and mood; psychological therapy. Options: amitriptyline, duloxetine, pregabalin. Avoid steroids and opioids.</li>
</ul>
<h4 class="deck-topic">Weakness or pain?</h4>
<ul>
  <li>True weakness with high CK: myositis or drug myopathy. Weakness on long steroids with normal CK: steroid myopathy. PMR limits movement by pain.</li>
</ul>
<div class="sum-key">
  <span class="sum-key-title">نقاط امتحانية</span>
  <ul>
    <li>Hard DIP nodules, little stiffness, normal ESR: hand osteoarthritis.</li>
    <li>First management of osteoarthritis includes exercise and weight control.</li>
    <li>Older patient, stiff shoulders, high ESR, normal CK: PMR.</li>
    <li>Widespread pain with normal tests and poor sleep: fibromyalgia.</li>
  </ul>
</div>
`,
            questions: [
                {
                    "q": "A 50-year-old woman presented to the clinic with polyarthralgia affecting distal and proximal interphalangeal joints bilaterally for 3 years. She does not have significant early morning stiffness. Clinical examination revealed no active arthritis but non-tender hard nodules over some distal interphalangeal joints. Labs (ESR, CRP, RF) are essentially normal. Which of the following is the most likely rheumatological disease?",
                    "options": [
                        "Seronegative rheumatoid arthritis",
                        "Hand osteoarthritis",
                        "Polyarticular gout",
                        "Reactive arthritis"
                    ],
                    "answer": 1,
                    "explanation": "Heberden's nodes at the DIP joints, minimal morning stiffness, and normal inflammatory markers/RF are the classic presentation of hand osteoarthritis, not inflammatory arthritis.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A 28-year-old woman presented to the clinic with 2-month history of pain and swelling in the hand joints with morning stiffness for 2-hours. She is 3-months postpartum, and taking care of her infant. On examination, she has active arthritis at second and fourth proximal and metacarpophalangeal joints and both wrists (see lab results). Test Result Normal Values Hb 120 130-170 g/L (Male) 120-160 g/L (Female) Platelets count 450 150-400 x 109/L WBC 6 4.5-10.5 x 109/L ESR 70 2-10 mm/h (Male) 3-15 mm/h (Female) C-reactive peptide 18 <8.2 mg/L Which of the following is the most likely diagnosis?",
                    "options": [
                        "Viral arthritis",
                        "Reactive arthritis",
                        "Polyarticular gout",
                        "Rheumatoid arthritis"
                    ],
                    "answer": 3,
                    "explanation": "Core Concept: Rheumatoid arthritis (RA), a chronic systemic autoimmune inflammatory disease primarily affecting the synovial joints. The postpartum period is a known trigger for the onset or exacerbation of autoimmune conditions due to immune reconstitution. Clinical Presentation: · Symmetrical polyarthritis involving the small joints of the hands (MCP, PIP, wrists), prolonged morning stiffness (>1 hour), and elevated inflammatory markers (ESR, CRP, reactive thrombocytosis). · Complications: Joint deformities, erosions, cervical spine instability, and systemic manifestations. Diagnosis: · First-line: Rheumatoid factor (RF), anti-CCP antibodies, and X-rays of the hands/feet. · Gold standard: Clinical diagnosis based on ACR/EULAR classification criteria incorporating joint involvement, serology, and acute phase reactants. Management: · Acute: NSAIDs or low-dose corticosteroids as bridge therapy for rapid symptom relief. · Long-term/Definitive: Early initiation of Disease-Modifying Antirheumatic Drugs (DMARDs). Methotrexate is the gold standard anchor drug (though alternatives like sulfasalazine or hydroxychloroquine are preferred if the patient is actively breastfeeding).",
                    "source": "SMLE bank"
                }
            ],
        },
        {
            id: "rhm-vasculitis",
            title: "08 — Vasculitis & Behçet Disease",
            title_en: "Vessel size · ANCA · Sight and organ threats",
            summaryHtml: `
<p>Think of vasculitis with fever or weight loss plus palpable purpura, neuropathy, kidney sediment, lung bleeding, limb claudication or unexplained organ ischaemia. Exclude infection and mimics.</p>
<div class="deck-block deck-tbl"><table><thead><tr><th>Disease</th><th>Clues</th></tr></thead><tbody>
<tr><td><b>Giant cell arteritis</b></td><td>Over 50; new headache, scalp tenderness, <b>jaw claudication, visual loss</b></td></tr>
<tr><td><b>Takayasu</b></td><td>Young woman; weak pulses, arm pressure difference, bruits</td></tr>
<tr><td><b>Polyarteritis nodosa</b></td><td>Hepatitis B link; neuropathy, gut pain, renal artery aneurysms; spares lung capillaries and glomeruli; ANCA negative</td></tr>
<tr><td><b>Granulomatosis with polyangiitis</b></td><td>Sinus and nose, lung nodules, glomerulonephritis; <b>PR3 (c-ANCA)</b></td></tr>
<tr><td><b>Microscopic polyangiitis</b></td><td>Kidney and lung bleeding, no granulomas; often <b>MPO (p-ANCA)</b></td></tr>
<tr><td><b>Eosinophilic granulomatosis</b></td><td><b>Asthma, eosinophilia</b>, neuropathy; ANCA in only some</td></tr>
<tr><td><b>IgA vasculitis</b></td><td>Leg purpura, arthritis, abdominal pain, nephritis</td></tr>
<tr><td><b>Cryoglobulinaemic</b></td><td>Hepatitis C, purpura, neuropathy, low C4</td></tr>
</tbody></table></div>
<h4 class="deck-topic">Giant cell arteritis: protect sight</h4>
<ul>
  <li>High suspicion: <b>start high-dose corticosteroid at once</b>. With visual symptoms, IV pulses are commonly used.</li>
  <li>Confirm soon with <b>temporal artery biopsy or ultrasound</b>; do not delay treatment for them. Skip lesions can give a negative biopsy.</li>
  <li>Tocilizumab helps spare steroid. Watch later for aortic aneurysm.</li>
</ul>
<h4 class="deck-topic">Organ-threatening ANCA disease</h4>
<ul>
  <li>Pulmonary-renal syndrome needs urgent treatment: corticosteroid with <b>rituximab or cyclophosphamide</b>. Also test anti-GBM antibodies. Biopsy confirms where possible.</li>
</ul>
<h4 class="deck-topic">Behçet disease</h4>
<ul>
  <li>Common along the historical Silk Road, including the Middle East.</li>
  <li><b>Recurrent oral ulcers</b> (core feature), <b>genital ulcers, uveitis</b>, acne-like lesions or erythema nodosum.</li>
  <li><b>Pathergy</b> reaction; HLA-B51 association. Diagnosis is clinical.</li>
  <li>Serious disease: posterior uveitis (blindness), brain involvement, <b>venous thrombosis</b>, pulmonary artery aneurysm.</li>
  <li>Mouth and genital ulcers: topical therapy, colchicine, apremilast. Eye or major organ disease: steroid plus immunosuppressant (azathioprine, anti-TNF).</li>
  <li>Check for pulmonary artery aneurysm before anticoagulating a clot, because of bleeding risk.</li>
</ul>
<div class="sum-key">
  <span class="sum-key-title">نقاط امتحانية</span>
  <ul>
    <li>Jaw claudication or vision symptoms after 50: steroid now.</li>
    <li>Sinus, lung and kidney disease with PR3-ANCA: GPA.</li>
    <li>Asthma plus eosinophilia plus neuropathy: EGPA.</li>
    <li>Mouth and genital ulcers with uveitis: Behçet disease.</li>
  </ul>
</div>
`,
            questions: [
                {
                    "q": "A child previously diagnosed with HSP presents with new-onset abdominal pain, bilateral ankle swelling, and hematuria with proteinuria on urinalysis. There is also a family history of SLE. What is the most likely cause of his current presentation?",
                    "options": [
                        "Early nephritis due to systemic lupus erythematosus",
                        "Juvenile idiopathic arthritis",
                        "Expected with HSP due to systemic vasculitis",
                        "UTI"
                    ],
                    "answer": 2,
                    "explanation": "Core Concept: Henoch-Schönlein Purpura (HSP) / IgA Vasculitis. The most common systemic vasculitis in children, characterized by IgA immune complex deposition in small vessels. It classically affects the skin, joints, gastrointestinal tract, and kidneys. Clinical Presentation: · Palpable purpura (typically on buttocks and lower extremities). · Migratory polyarthritis/arthralgia, colicky abdominal pain (risk of intussusception), and renal involvement (hematuria, proteinuria). Diagnosis: · First-line: Clinical diagnosis based on the classic tetrad of symptoms in a child following a URI. · Gold Standard: Skin or renal biopsy showing leukocytoclastic vasculitis with IgA deposition on immunofluorescence (rarely needed in classic pediatric presentations). Management: · Acute: Supportive care with hydration and NSAIDs for joint pain. Monitor blood pressure and urinalysis closely. Systemic corticosteroids may be used for severe GI pain. · Definitive: Most cases are self-limiting and resolve within weeks. Long-term follow-up is essential to monitor for the development of chronic IgA nephropathy or hypertension.",
                    "source": "SMLE bank"
                }
            ],
        },
        {
            id: "rhm-ctd-overlap",
            title: "09 — Scleroderma, Sjogren, Myositis & Overlap",
            title_en: "Antibody clues · Renal crisis · Muscle and lung",
            summaryHtml: `
<h4 class="deck-topic">Systemic sclerosis</h4>
<div class="deck-block deck-tbl"><table><thead><tr><th>Feature</th><th>Limited cutaneous</th><th>Diffuse cutaneous</th></tr></thead><tbody>
<tr><td><b>Skin</b></td><td>Distal to elbows and knees, face</td><td>Also proximal limbs and trunk</td></tr>
<tr><td><b>Antibody</b></td><td><b>Anticentromere</b></td><td><b>Anti-Scl-70</b> or anti-RNA polymerase III</td></tr>
<tr><td><b>Main concern</b></td><td>Pulmonary arterial hypertension; CREST features</td><td>Lung fibrosis, kidney crisis, heart disease</td></tr>
</tbody></table></div>
<ul>
  <li>Almost all have <b>Raynaud</b>: keep warm, calcium channel blocker. Digital ulcers need escalation.</li>
  <li><b>Scleroderma renal crisis</b>: sudden hypertension, rising creatinine, haemolysis. Give an <b>ACE inhibitor</b> (captopril) promptly. High-dose steroids raise the risk.</li>
  <li>Reflux and poor gut motility: PPI. Screen lungs and pulmonary pressure.</li>
</ul>
<h4 class="deck-topic">Sjogren disease</h4>
<ul>
  <li><b>Dry eyes and dry mouth</b>, parotid swelling, fatigue, arthralgia, dental caries.</li>
  <li><b>Anti-Ro</b> and anti-La; Schirmer or ocular staining; lip salivary gland biopsy.</li>
  <li>Artificial tears, saliva measures, dental care; pilocarpine; immunosuppression for organ disease.</li>
  <li>Higher <b>lymphoma</b> risk: watch persistent gland enlargement. Distal renal tubular acidosis can occur.</li>
</ul>
<h4 class="deck-topic">Inflammatory myopathy</h4>
<ul>
  <li>Painless or mildly painful <b>symmetric proximal weakness</b>, high CK; EMG, MRI, antibodies, muscle biopsy.</li>
  <li><b>Dermatomyositis</b>: heliotrope rash, <b>Gottron papules</b>, shawl sign. <b>Screen for cancer</b> in adults.</li>
  <li><b>Anti-Jo-1</b> (antisynthetase): lung disease, mechanic hands, arthritis, fever, Raynaud.</li>
  <li>Treat with corticosteroid and a steroid-sparing agent; IVIG in selected cases. Check swallowing and breathing.</li>
</ul>
<h4 class="deck-topic">Mixed connective tissue disease</h4>
<ul>
  <li>Overlap of lupus, systemic sclerosis, myositis and arthritis; swollen hands and Raynaud.</li>
  <li>Defining antibody: high-titre <b>anti-U1-RNP</b>.</li>
  <li>Monitor for pulmonary hypertension and lung disease; treat according to the organ involved.</li>
</ul>
<div class="sum-key">
  <span class="sum-key-title">نقاط امتحانية</span>
  <ul>
    <li>Anticentromere: limited disease; anti-Scl-70: diffuse disease with lung fibrosis.</li>
    <li>Renal crisis: ACE inhibitor.</li>
    <li>Dryness with anti-Ro: Sjogren disease.</li>
    <li>Mixed features with anti-U1-RNP: mixed connective tissue disease.</li>
  </ul>
</div>
`,
            questions: [
                {
                    "q": "A 40-year-old woman presents with hand pain and swelling with morning stiffness for 3 months, photosensitivity, hair loss, difficulty climbing stairs, and Raynaud's phenomenon. Exam shows active arthritis at the 2nd and 3rd PIP joints, malar rash, and healed fingertip ulcers, with proximal muscle strength 3/5. ANA titer is 1:2540. Which of the following antibodies will most likely confirm the diagnosis?",
                    "options": [
                        "Anti-Smith (SM)",
                        "Anti-ribonucleoprotein (RNP)",
                        "Anti-double stranded DNA (anti-dsDNA)",
                        "Anti-cyclic citrullinated peptide (anti-CCP)"
                    ],
                    "answer": 1,
                    "explanation": "The overlapping features of lupus (malar rash, photosensitivity, arthritis), myositis (proximal weakness), and scleroderma-like findings (Raynaud's, digital ulcers) together suggest mixed connective tissue disease, whose defining serologic marker is high-titer anti-RNP antibody.",
                    "source": "SMLE recall"
                }
            ],
        },
    ],
};

export default specialtyRheumatology;
