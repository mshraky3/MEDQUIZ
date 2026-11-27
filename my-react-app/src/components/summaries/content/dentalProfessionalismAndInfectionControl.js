// Professionalism and Infection Control — dental-track section of the summaries catalog.
// Mirrored for the slide viewer in backend/content/summaryHtml (keep the two in sync).
// Inline questions are copied from the SQB bank.
const dentalProfessionalismAndInfectionControl = {
    id: "professionalism-and-infection-control",
    title: "Professionalism and Infection Control",
    title_en: "SDLE Review — 10 Topics",
    icon: "shield-check",
    accent: "#22d3ee",
    intro: "Professionalism and Infection Control — focused SDLE revision: Sharps Injury & Post-exposure Care · Standard Precautions & PPE · Disease Transmission & TB · Instrument Processing & Sterilization · Sterilizer Monitoring · Disinfection, Surfaces & Waste · Informed Consent & Capacity · Ethical Principles & Conduct · Confidentiality & Patient Safety · Occupational Safety & Professional Roles.",
    subtopics: [
        {
            id: "pic-exposure",
            title: "01 — Sharps Injury & Post-exposure Care",
            title_en: "First aid · report · HBV · HIV · HCV",
            summaryHtml: `
<h4 class="deck-topic">Do this first</h4>
<div class="sum-algo">
  <span class="sum-algo-title">Exposure steps</span>
  <ol>
    <li>Stop safely. <b>Wash the wound with soap and running water</b>; flush eyes or mouth with water or saline.</li>
    <li>Do not scrub, cut, suck or apply harsh chemicals.</li>
    <li><b>Report immediately</b> according to facility policy.</li>
    <li>Urgent medical assessment: type of injury, device, fluid and the source patient.</li>
    <li>Baseline testing, source testing under policy and consent, prophylaxis, counselling, follow-up and documentation.</li>
  </ol>
</div>
<ul>
  <li>For an eye splash, <b>irrigate at once</b>; do not delay flushing. Contact lenses are then removed and handled safely.</li>
  <li>A source reported as treated, inactive or undetectable does <b>not</b> cancel the need to wash, report and be assessed urgently.</li>
</ul>
<h4 class="deck-topic">Virus by virus</h4>
<div class="deck-block deck-tbl">
  <table>
    <thead><tr><th>Virus</th><th>Needlestick risk (approximate)</th><th>Post-exposure action</th></tr></thead>
    <tbody>
      <tr><td><b>HBV</b></td><td>Highest of the three; can reach about 30% from a highly infectious source in a non-immune person</td><td>Depends on vaccine status and response: HBIG and/or vaccine</td></tr>
      <tr><td><b>HCV</b></td><td>About 2% or lower</td><td>No routine prophylaxis or vaccine; test and follow up so infection is treated early</td></tr>
      <tr><td><b>HIV</b></td><td>About 0.3%</td><td>When indicated, antiretroviral prophylaxis <b>as soon as possible</b>, generally within 72 hours, usually for 28 days</td></tr>
    </tbody>
  </table>
</div>
<h4 class="deck-topic">Hepatitis B decisions</h4>
<ul>
  <li><b>Documented responder</b> (anti-HBs at least <b>10 mIU/mL</b> after the series): no HBV prophylaxis needed.</li>
  <li><b>Unvaccinated</b>, source HBsAg positive: <b>HBIG and start vaccination</b> promptly.</li>
  <li><b>Vaccinated, response never documented</b>, source positive or unknown: test the exposed worker for <b>anti-HBs</b> and manage by the result.</li>
  <li>Occupationally exposed staff should be vaccinated and have their response checked, usually 1 to 2 months after the series.</li>
</ul>
<div class="sum-key">
  <span class="sum-key-title">نقاط امتحانية</span>
  <ul>
    <li>First action after needlestick: <b>wash the site</b>.</li>
    <li>Then report and get urgent assessment; do not wait for symptoms.</li>
    <li>Protective anti-HBs: <b>10 mIU/mL or more</b>.</li>
    <li>HBV is the most readily transmitted of the three by sharps.</li>
  </ul>
</div>
      `,
            questions: [
                {
                    "q": "A dental worker sustains a needlestick from a used anesthetic needle. What is the first action?",
                    "options": [
                        "Squeeze the wound aggressively with bleach",
                        "Wash the site and immediately report for exposure assessment",
                        "Finish the week before reporting",
                        "Take sick leave only"
                    ],
                    "answer": 1,
                    "explanation": "Prompt first aid and reporting allow source assessment, baseline testing, and time-sensitive HIV, HBV, or HCV management. Caustic chemicals should not be applied. Reference: Centers for Disease Control and Prevention. Best Practices for Occupational Exposure to Blood and U.S. Public Health Service exposure guidance.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A vaccinated dental worker has written documentation of a complete hepatitis B series and postvaccination anti-HBs of 25 mIU/mL. After a needlestick, what HBV prophylaxis is needed?",
                    "options": [
                        "HBIG plus vaccine",
                        "HBIG only",
                        "None",
                        "Restart the full series"
                    ],
                    "answer": 2,
                    "explanation": "A documented responder with anti-HBs at least 10 mIU/mL requires no HBV post-exposure prophylaxis regardless of source HBsAg status. Reference: Centers for Disease Control and Prevention. Responding to HBV Exposures in Health Care Settings.",
                    "source": "SDLE bank"
                },
                {
                    "q": "An unvaccinated clinician is exposed to blood from an HBsAg-positive source. What is the appropriate management?",
                    "options": [
                        "Observe without action",
                        "Give HBIG and begin hepatitis B vaccination promptly",
                        "Give oral antivirals only",
                        "Wait for symptoms"
                    ],
                    "answer": 1,
                    "explanation": "Both passive and active immunization are recommended as soon as possible for a susceptible person exposed to a positive source. Reference: Centers for Disease Control and Prevention. Responding to HBV Exposures in Health Care Settings.",
                    "source": "SDLE bank"
                },
                {
                    "q": "After immediate wound care and reporting, a vaccinated clinician has a needlestick from an HBsAg- positive patient but has no documented vaccine response. Which test guides HBV post-exposure management?",
                    "options": [
                        "Clinician HBeAg alone",
                        "Needle culture",
                        "Clinician anti-HBs level",
                        "No testing"
                    ],
                    "answer": 2,
                    "explanation": "When a completed vaccine series is documented but post-vaccination response is unknown, the clinician's anti-HBs and source HBsAg are assessed promptly. HBIG and revaccination decisions depend on whether anti-HBs is at least 10 mIU/mL and on the source status. Reference: Centers for Disease Control and Prevention. Responding to HBV Exposures in Health Care Settings. 2024.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A dentist sustains a needlestick from a patient with treated HIV and a reported inactive viral load. What should the dentist do?",
                    "options": [
                        "Force the wound to bleed",
                        "Refer only the source patient",
                        "Take no action",
                        "Wash, report, and seek urgent exposure assessment"
                    ],
                    "answer": 3,
                    "explanation": "The injury requires immediate washing, reporting, and urgent occupational-health evaluation. Viral suppression informs the risk assessment but does not replace it; PEP is started promptly when indicated. Reference: Centers for Disease Control and Prevention. HIV Occupational Transmission. 2024.",
                    "source": "SDLE bank"
                }
            ],
        },
        {
            id: "pic-precautions",
            title: "02 — Standard Precautions, Hand Hygiene & PPE",
            title_en: "All patients · gloves · eye protection",
            summaryHtml: `
<h4 class="deck-topic">Standard precautions</h4>
<ul>
  <li>Apply to <b>all patients</b>, whatever their known infection status.</li>
  <li>Include hand hygiene, PPE by risk, respiratory hygiene, sharps safety, safe injection practice, instrument reprocessing and environmental cleaning.</li>
  <li><b>Transmission-based precautions</b> (contact, droplet, airborne) are added on top.</li>
</ul>
<h4 class="deck-topic">Hand hygiene</h4>
<div class="deck-cards">
  <div class="deck-card mgmt">
    <div class="deck-card-h">Soap and water</div>
    <p>For visibly soiled or contaminated hands, after the toilet and for spore-forming organisms. WHO total time about <b>40 to 60 seconds</b>.</p>
  </div>
  <div class="deck-card diag">
    <div class="deck-card-h">Alcohol handrub</div>
    <p>Suitable when hands are not visibly soiled; about 20 to 30 seconds until dry.</p>
  </div>
</div>
<ul>
  <li>WHO moments: before touching a patient, before a clean or aseptic task, after body-fluid risk, after touching a patient, after touching surroundings.</li>
  <li>Do hand hygiene before gloving and <b>immediately after glove removal</b>.</li>
  <li><b>Rings</b> and long or artificial nails harbour organisms, hinder hand hygiene and can tear gloves.</li>
</ul>
<h4 class="deck-topic">PPE</h4>
<ul>
  <li>For splash or spray: <b>gloves, mask, eye protection and protective gown</b>; a face shield adds protection and does not replace the mask.</li>
  <li>The patient also wears eye protection, for example when wire is cut.</li>
  <li><b>Remove contaminated PPE before leaving the clinical area</b>, including for breaks.</li>
  <li>Torn or punctured glove: stop safely, remove, perform hand hygiene and put on a new pair.</li>
  <li>Never wash or disinfect disposable gloves for reuse.</li>
  <li>Use heavy-duty <b>utility gloves</b> for instrument cleaning.</li>
</ul>
<h4 class="deck-topic">Safer sharps</h4>
<ul>
  <li>Pass sharps through a <b>neutral zone</b>, not hand to hand.</li>
  <li>Avoid two-handed recapping; use a safety device or one-handed technique.</li>
  <li>Activate safety features and discard into a puncture-resistant container at the point of use.</li>
  <li>Close and replace a sharps container at the fill line, or about <b>three quarters full</b>.</li>
</ul>
<div class="sum-key">
  <span class="sum-key-title">نقاط امتحانية</span>
  <ul>
    <li>Standard precautions are for <b>everyone</b>.</li>
    <li>Visible soil: soap and water.</li>
    <li>PPE never leaves the clinical area.</li>
    <li>Torn glove: replace with hand hygiene in between.</li>
  </ul>
</div>
      `,
            questions: [
                {
                    "q": "To whom do Standard Precautions apply in dental care?",
                    "options": [
                        "All patients",
                        "Only known infectious patients",
                        "Only immunocompromised patients",
                        "Only cardiac patients"
                    ],
                    "answer": 0,
                    "explanation": "Standard Precautions are the minimum infection-prevention practices for every patient, regardless of known or suspected infection status. Reference: Centers for Disease Control and Prevention. Standard Precautions in Dental Settings. 2024.",
                    "source": "SDLE bank"
                },
                {
                    "q": "What is the WHO-recommended total duration for handwashing with soap and water in health care?",
                    "options": [
                        "10-15 seconds",
                        "20-30 seconds",
                        "40-60 seconds",
                        "90-120 seconds"
                    ],
                    "answer": 2,
                    "explanation": "WHO recommends 40-60 seconds for the entire soap-and-water handwashing procedure. Alcohol-based handrubbing is shorter, generally 20-30 seconds until dry. Reference: World Health Organization. WHO Guidelines on Hand Hygiene in Health Care. Handwashing and handrubbing technique.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A dental assistant is leaving the treatment area for a lunch break while wearing a contaminated clinical gown. What should be done?",
                    "options": [
                        "Wear it into the lunch area",
                        "Cover it with a coat",
                        "Remove the PPE before leaving",
                        "Keep it on for five minutes"
                    ],
                    "answer": 2,
                    "explanation": "Potentially contaminated PPE should be removed before entering nonclinical areas such as break rooms. Hand hygiene should follow removal to avoid transferring contamination to staff or the environment. Reference: Centers for Disease Control and Prevention. Guidelines for Infection Control in Dental Health-Care Settings. PPE removal and prevention of cross-contamination.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A dentist notices a torn glove during surgery. What should be done?",
                    "options": [
                        "Apply alcohol over the torn glove",
                        "Stop, remove it, perform hand hygiene, and regloves",
                        "Continue until the procedure ends",
                        "Wash the glove and reuse it"
                    ],
                    "answer": 1,
                    "explanation": "A damaged glove no longer provides an effective barrier. It should be removed promptly, hand hygiene performed using soap and water if visibly soiled or handrub otherwise, and a new sterile glove donned before resuming surgery. Reference: Centers for Disease Control and Prevention. Standard Precautions in Dental Settings. Glove use and hand hygiene. 2024.",
                    "source": "SDLE bank"
                },
                {
                    "q": "Which work practice helps prevent sharps injury after a local-anesthetic injection?",
                    "options": [
                        "Transfer the syringe through a neutral zone",
                        "Pass it over the patient's face",
                        "Hand it behind the operator",
                        "Leave it uncapped on the tray edge"
                    ],
                    "answer": 0,
                    "explanation": "A defined neutral transfer zone reduces simultaneous handling and accidental sticks. A one-handed scoop or safety device is used for recapping when necessary. Reference: Centers for Disease Control and Prevention. Sharps Safety in Dental Settings; OSAP guidance.",
                    "source": "SDLE bank"
                }
            ],
        },
        {
            id: "pic-transmission",
            title: "03 — Transmission Routes & Tuberculosis",
            title_en: "Contact · droplet · airborne",
            summaryHtml: `
<h4 class="deck-topic">Routes</h4>
<div class="deck-block deck-tbl">
  <table>
    <thead><tr><th>Route</th><th>Meaning</th></tr></thead>
    <tbody>
      <tr><td><b>Direct contact</b></td><td>Person or body fluid to person with no object between</td></tr>
      <tr><td><b>Indirect contact</b></td><td>Through contaminated hands, instruments or surfaces</td></tr>
      <tr><td><b>Droplet</b></td><td>Larger respiratory particles at close range, for example influenza</td></tr>
      <tr><td><b>Airborne</b></td><td>Fine particles that stay suspended and travel, for example <b>TB, measles, varicella</b></td></tr>
      <tr><td><b>Percutaneous</b></td><td>Needle or sharp injury with blood</td></tr>
    </tbody>
  </table>
</div>
<ul>
  <li>Influenza spreads mainly by respiratory particles at close contact, with some role for contact and aerosols.</li>
  <li><b>HBV</b> can remain infectious on surfaces for at least <b>7 days</b>, even without visible blood.</li>
  <li>Prions resist ordinary disinfection and sterilization and need special protocols.</li>
</ul>
<h4 class="deck-topic">Active tuberculosis</h4>
<ul>
  <li><i>Mycobacterium tuberculosis</i> travels in droplet nuclei that can stay in the air for hours.</li>
  <li>A surgical mask is <b>not</b> respiratory protection for staff against TB.</li>
  <li><b>Elective treatment is deferred</b> until a physician confirms the patient is no longer infectious.</li>
  <li><b>Urgent care that cannot wait</b>: refer to a facility with an <b>airborne infection isolation room</b>; staff wear a fit-tested <b>N95</b> or higher respirator.</li>
  <li>The patient wears a surgical mask when not being treated.</li>
  <li>A past, treated case confirmed non-infectious by the physician is managed with standard precautions, while staying alert for symptoms.</li>
</ul>
<div class="sum-algo">
  <span class="sum-algo-title">Triage of a coughing patient</span>
  <ol>
    <li>Ask about cough duration, blood in sputum, fever, night sweats, weight loss and TB history.</li>
    <li>If suspected: mask the patient and separate from others.</li>
    <li>Defer elective care and refer for medical evaluation.</li>
    <li>Arrange isolation-capable care for true emergencies.</li>
  </ol>
</div>
<h4 class="deck-topic">Protecting others</h4>
<ul>
  <li>Tell the receiving team, through proper confidential channels, about precautions needed for an infectious patient. Hiding it endangers colleagues and other patients, and notifiable diseases must be reported.</li>
</ul>
<div class="sum-key">
  <span class="sum-key-title">نقاط امتحانية</span>
  <ul>
    <li>Contaminated surface to patient via hands: <b>indirect contact</b>.</li>
    <li>HBV survives about a week or longer on surfaces.</li>
    <li>Urgent care in active TB: <b>airborne isolation and N95</b>.</li>
    <li>Elective care in active TB waits.</li>
  </ul>
</div>
      `,
            questions: [
                {
                    "q": "Hands transfer organisms from a contaminated environmental surface to another patient. Which route is this?",
                    "options": [
                        "Airborne transmission only",
                        "Vector transmission",
                        "Vertical transmission",
                        "Indirect contact transmission"
                    ],
                    "answer": 3,
                    "explanation": "A contaminated intermediate object or hands can transmit organisms indirectly. Hand hygiene and surface barrier or disinfection interrupt this route. Reference: Centers for Disease Control and Prevention. Summary of Infection Prevention Practices in Dental Settings.",
                    "source": "SDLE bank"
                },
                {
                    "q": "For at least how long can hepatitis B virus remain infectious on environmental surfaces?",
                    "options": [
                        "4 hours",
                        "24 hours",
                        "7 days",
                        "1 month"
                    ],
                    "answer": 2,
                    "explanation": "HBV can remain infectious on environmental surfaces for at least seven days, even when blood is not visible. The recalled answer of one month is not the standard CDC figure. Reference: Centers for Disease Control and Prevention. Chapter 4: Hepatitis B, Manual for the Surveillance of Vaccine-Preventable Diseases. 2025.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A coughing patient with active pulmonary tuberculosis and hemoptysis has severe dental pain requiring urgent care. What is appropriate?",
                    "options": [
                        "Refer to an airborne-isolation-capable facility",
                        "Treat in a routine outpatient operatory",
                        "Use only a surgical mask",
                        "Delay exactly one month"
                    ],
                    "answer": 0,
                    "explanation": "Urgent treatment that cannot be deferred belongs in a facility with airborne infection isolation and staff using fit-tested N95 or higher-level respiratory protection. A filtering respirator alone does not compensate for an unsuitable open outpatient environment. Reference: Centers for Disease Control and Prevention. Standard Precautions in Dental Settings. 2024; Guidelines for Preventing the Transmission of Mycobacterium tuberculosis in Health-Care Settings.",
                    "source": "SDLE bank"
                },
                {
                    "q": "What is the predominant transmission route for influenza in dental settings?",
                    "options": [
                        "Needlestick only",
                        "Respiratory droplets and aerosols with close contact",
                        "Foodborne spread only",
                        "Vector-borne spread"
                    ],
                    "answer": 1,
                    "explanation": "Influenza is primarily respiratory. Source control, vaccination, hand hygiene, ventilation, and appropriate PPE reduce risk. Reference: Centers for Disease Control and Prevention. Infection Control Guidance for Seasonal Influenza in Healthcare Settings.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A dentist fails to inform the operating room staff that an emergency patient has influenza. Which ethical duty has been neglected?",
                    "options": [
                        "Infection control",
                        "Duty to protect colleagues",
                        "Duty to protect the community",
                        "Duty to report to the infectious disease center"
                    ],
                    "answer": 1,
                    "explanation": "Failing to alert the team about an infectious case neglects the duty to protect colleagues. Key takeaway: communicate infection risks.",
                    "source": "SDLE recall"
                }
            ],
        },
        {
            id: "pic-sterilization",
            title: "04 — Instrument Processing & Sterilization",
            title_en: "Spaulding · cleaning · autoclave",
            summaryHtml: `
<h4 class="deck-topic">Spaulding classes</h4>
<div class="deck-block deck-tbl">
  <table>
    <thead><tr><th>Class</th><th>Contact</th><th>Processing</th></tr></thead>
    <tbody>
      <tr><td><b>Critical</b></td><td>Penetrates soft tissue or bone (forceps, scalpel, burs, scalers)</td><td><b>Sterilize</b></td></tr>
      <tr><td><b>Semi-critical</b></td><td>Touches mucosa (mirror, tray, cheek retractor)</td><td><b>Heat sterilize</b> if heat tolerant; high-level disinfection only for heat-sensitive items</td></tr>
      <tr><td><b>Non-critical</b></td><td>Intact skin only</td><td>Intermediate or low-level disinfection, or barrier</td></tr>
    </tbody>
  </table>
</div>
<ul>
  <li>Dental <b>handpieces</b> are heat sterilized between patients.</li>
</ul>
<h4 class="deck-topic">Workflow (one direction, dirty to clean)</h4>
<div class="sum-algo">
  <span class="sum-algo-title">Reprocessing</span>
  <ol>
    <li>Transport safely in a closed, puncture-resistant container.</li>
    <li><b>Clean thoroughly</b>: debris shields microbes.</li>
    <li>Rinse, dry, inspect and maintain.</li>
    <li>Package and label.</li>
    <li>Sterilize without overloading, let packs dry, then store.</li>
  </ol>
</div>
<ul>
  <li>An <b>automated washer-disinfector</b> or ultrasonic cleaner is safer than hand scrubbing.</li>
  <li>If hand brushing is needed: utility gloves, mask, eye protection, gown, long brush and instruments <b>fully submerged</b>.</li>
</ul>
<h4 class="deck-topic">Methods and typical cycles</h4>
<ul>
  <li><b>Steam autoclave</b>: saturated steam under pressure. About <b>121 degrees C at about 15 psi</b>; about 126 degrees C at about 20 psi; about 132 to 134 degrees C at about 30 psi.</li>
  <li>A validated <b>prevacuum cycle at 132 degrees C</b> needs at least about <b>4 minutes</b> exposure for wrapped instruments. Times for other cycles differ; follow validated instructions.</li>
  <li>Steam can <b>corrode</b> unprotected carbon steel.</li>
  <li><b>Dry heat</b>: no moisture corrosion but slow; for example <b>160 degrees C for 120 minutes</b> or 170 degrees C for 60 minutes (exposure only).</li>
  <li><b>Unsaturated chemical vapour</b>: less rusting; needs ventilation.</li>
  <li>Always follow the instrument and sterilizer manufacturers.</li>
</ul>
<div class="sum-key">
  <span class="sum-key-title">نقاط امتحانية</span>
  <ul>
    <li><b>Cleaning comes before</b> sterilization.</li>
    <li>Heat-tolerant semi-critical items are heat sterilized.</li>
    <li>Autoclave agent: saturated steam under pressure.</li>
    <li>132 degrees C prevacuum: about 4 minutes.</li>
  </ul>
</div>
      `,
            questions: [
                {
                    "q": "A reusable cheek retractor is heat tolerant according to its manufacturer. How should it be reprocessed after patient use?",
                    "options": [
                        "Clean and heat sterilize according to its instructions",
                        "Wipe with alcohol only",
                        "Store without cleaning",
                        "Use a procedure based on appearance alone"
                    ],
                    "answer": 0,
                    "explanation": "Reusable semicritical items that tolerate heat should be cleaned and heat sterilized. Heat-sensitive items require an FDA-cleared or locally authorized method specified by the manufacturer. Reference: Centers for Disease Control and Prevention. Sterilization and Disinfection in Dental Settings.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A reusable bur has visible debris after use. What must occur before sterilization?",
                    "options": [
                        "Immediate packaging without cleaning",
                        "Thorough cleaning according to the manufacturer's instructions",
                        "Sodium-nitrite immersion regardless of material",
                        "Surface wiping only"
                    ],
                    "answer": 1,
                    "explanation": "Organic debris can shield microorganisms and compromise processing. Burs require validated cleaning, drying, inspection, packaging, and heat sterilization if reusable. Reference: Centers for Disease Control and Prevention. Sterilization and Disinfection in Dental Settings.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A validated prevacuum steam sterilizer processes wrapped instruments at 132°C. What is the recognized minimum exposure time?",
                    "options": [
                        "4 minutes",
                        "1 minute",
                        "2 minutes",
                        "3 minutes"
                    ],
                    "answer": 0,
                    "explanation": "For wrapped instruments in a dynamic-air-removal or prevacuum sterilizer at 132°C, the recognized minimum exposure time is four minutes. Drying time is additional, and the sterilizer and device manufacturer instructions remain controlling. Reference: Centers for Disease Control and Prevention. Guideline for Disinfection and Sterilization in Healthcare Facilities. Table 7; updated 2024.",
                    "source": "SDLE bank"
                },
                {
                    "q": "Which recognized dry-heat exposure cycle uses 160°C (320°F)?",
                    "options": [
                        "30 minutes",
                        "60 minutes",
                        "240 minutes",
                        "120 minutes"
                    ],
                    "answer": 3,
                    "explanation": "A commonly recognized hot-air sterilization relationship is 160°C for 120 minutes. Exposure time begins after the load reaches the target temperature, and the sterilizer and device instructions remain controlling. Reference: Centers for Disease Control and Prevention. Other Sterilization Methods: Dry Heat. 2024.",
                    "source": "SDLE bank"
                },
                {
                    "q": "Which method is preferred for cleaning contaminated instrument trays before inspection, packaging, and heat sterilization?",
                    "options": [
                        "Bare-hand brushing",
                        "Glutaraldehyde soaking alone",
                        "Direct autoclaving without cleaning",
                        "Automated washer-disinfector"
                    ],
                    "answer": 3,
                    "explanation": "Automated cleaning equipment improves reproducibility and reduces sharps exposure compared with manual scrubbing. Cleaning must precede inspection, packaging, and sterilization; chemical soaking does not replace removal of debris. Reference: Centers for Disease Control and Prevention. Best Practices for Sterilization in Dental Settings. Cleaning and automated equipment. 2024.",
                    "source": "SDLE bank"
                }
            ],
        },
        {
            id: "pic-monitoring",
            title: "05 — Sterilizer Monitoring & Storage",
            title_en: "Mechanical · chemical · biological",
            summaryHtml: `
<h4 class="deck-topic">Three kinds of monitoring</h4>
<div class="deck-cards">
  <div class="deck-card diag">
    <div class="deck-card-h">Mechanical (physical)</div>
    <p>Time, temperature and pressure read from gauges, printouts or records for <b>every load</b>.</p>
  </div>
  <div class="deck-card clin">
    <div class="deck-card-h">Chemical</div>
    <p>Colour change. The external indicator separates processed from unprocessed packs; internal indicators show whether the agent reached inside for the set parameters.</p>
  </div>
  <div class="deck-card mgmt">
    <div class="deck-card-h">Biological</div>
    <p>Resistant bacterial <b>spores</b>: the most direct test that the sterilizer kills.</p>
  </div>
</div>
<ul>
  <li>An external tape or pouch mark changing colour does <b>not prove sterility</b>. It only reached that indicator's endpoint.</li>
  <li>Check the maker's colour key; colours differ between products.</li>
  <li>If an indicator or reading fails, do not use the pack: investigate and reprocess.</li>
</ul>
<h4 class="deck-topic">Spore tests</h4>
<div class="deck-block deck-tbl">
  <table>
    <thead><tr><th>Sterilizer</th><th>Test organism</th></tr></thead>
    <tbody>
      <tr><td>Steam and chemical vapour</td><td><i>Geobacillus stearothermophilus</i></td></tr>
      <tr><td>Dry heat and ethylene oxide</td><td><i>Bacillus atrophaeus</i></td></tr>
    </tbody>
  </table>
</div>
<ul>
  <li>Test at least <b>weekly</b>, and for each load containing an implantable device; also after repair or installation as policy requires.</li>
  <li>A positive spore test: remove the sterilizer from service according to protocol, check operator error and loading, retest, and recall affected items when indicated.</li>
</ul>
<h4 class="deck-topic">Records</h4>
<ul>
  <li>Cycle or load number, date, operator, time, temperature, pressure and indicator results, so items can be traced and recalled.</li>
</ul>
<h4 class="deck-topic">Packaging and shelf life</h4>
<ul>
  <li>Let packs dry inside the sterilizer; wet packs are easily contaminated.</li>
  <li>Store clean, dry and protected.</li>
  <li>In <b>event-related</b> storage, usability depends on <b>package integrity, storage conditions and facility policy</b>, not an arbitrary number of days. Torn, wet or open packs are reprocessed.</li>
  <li>Some facilities use dated expiry; then local policy applies.</li>
</ul>
<div class="sum-key">
  <span class="sum-key-title">نقاط امتحانية</span>
  <ul>
    <li>Best proof of killing: <b>biological indicator</b>.</li>
    <li>External colour change means exposed, not sterile.</li>
    <li>Record parameters for every load.</li>
    <li>Compromised package: reprocess.</li>
  </ul>
</div>
      `,
            questions: [
                {
                    "q": "Which monitor most directly assesses microbial killing in a sterilizer?",
                    "options": [
                        "External process tape",
                        "Package date",
                        "Biological spore indicator",
                        "Operator memory"
                    ],
                    "answer": 2,
                    "explanation": "Biological indicators use resistant spores and are the accepted direct monitor of sterilization efficacy. Mechanical and chemical monitoring are also required. Reference: Centers for Disease Control and Prevention. Best Practices for Sterilization Monitoring in Dental Settings.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A sterilization pouch external indicator changes from blue to black. What can be concluded?",
                    "options": [
                        "That every organism was killed",
                        "Only that the indicator reached its manufacturer-defined endpoint",
                        "That the package will remain sterile for 30 days",
                        "That biological monitoring is unnecessary"
                    ],
                    "answer": 1,
                    "explanation": "Color meanings are product-specific. A chemical indicator demonstrates exposure to one or more parameters but does not prove sterility. Reference: Centers for Disease Control and Prevention. Best Practices for Sterilization Monitoring in Dental Settings.",
                    "source": "SDLE bank"
                },
                {
                    "q": "Which parameters should be documented for every steam-sterilizer load?",
                    "options": [
                        "Pouch color only",
                        "Operator name only",
                        "Patient age only",
                        "Time, temperature, pressure, cycle or load identification, and indicator results"
                    ],
                    "answer": 3,
                    "explanation": "Mechanical, chemical, and scheduled biological records permit verification and recall if a failure occurs. Equipment maintenance records are also retained. Reference: Centers for Disease Control and Prevention. Best Practices for Sterilization Monitoring in Dental Settings.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A sterilized package is dry and intact but has passed an arbitrary 30-day date in an event-related system. What determines use?",
                    "options": [
                        "Facility policy, package integrity, storage, and manufacturer instructions",
                        "The sterilizer being Type B alone",
                        "Indicator color alone",
                        "Instrument cost"
                    ],
                    "answer": 0,
                    "explanation": "Sterilizer class does not create a universal shelf life. An event-related system treats intact properly stored packaging as sterile until a compromising event, subject to local policy. Reference: Centers for Disease Control and Prevention. Best Practices for Sterilization in Dental Settings.",
                    "source": "SDLE bank"
                }
            ],
        },
        {
            id: "pic-disinfection",
            title: "06 — Disinfection, Surfaces, Impressions & Waste",
            title_en: "Levels · barriers · segregation",
            summaryHtml: `
<h4 class="deck-topic">Definitions</h4>
<div class="deck-block deck-tbl">
  <table>
    <thead><tr><th>Term</th><th>Meaning</th></tr></thead>
    <tbody>
      <tr><td><b>Sterilization</b></td><td>Destroys <b>all</b> microbial life, including bacterial spores</td></tr>
      <tr><td><b>High-level disinfection</b></td><td>Kills all microorganisms but not necessarily large numbers of spores</td></tr>
      <tr><td><b>Intermediate level</b></td><td>Includes a tuberculocidal claim; kills most bacteria, fungi and viruses</td></tr>
      <tr><td><b>Low level</b></td><td>Kills most vegetative bacteria and some fungi and viruses</td></tr>
      <tr><td><b>Antisepsis</b></td><td>Reducing microbes on living tissue</td></tr>
    </tbody>
  </table>
</div>
<h4 class="deck-topic">Clinical contact surfaces</h4>
<ul>
  <li>Light handles, switches and controls: protect with a <b>barrier changed between patients</b>, or clean and disinfect after each patient.</li>
  <li><b>Clean first</b>, then disinfect for the full contact time.</li>
  <li>Surfaces with visible blood need at least an <b>intermediate-level</b> product.</li>
  <li>Floors and walls are housekeeping surfaces: usually detergent or low-level products; blood spills need a stronger spill protocol.</li>
</ul>
<h4 class="deck-topic">Impressions and appliances</h4>
<ul>
  <li>Rinse away blood and saliva, disinfect, rinse as directed, label and tell the laboratory, to prevent <b>cross-contamination</b>.</li>
  <li>Choose the disinfectant by <b>material compatibility</b>, label claim, contact time and the maker's instructions.</li>
  <li>Blood-borne viruses such as HBV, HCV and HIV are concerns with contaminated items.</li>
</ul>
<h4 class="deck-topic">Water</h4>
<ul>
  <li>Maintain dental unit waterlines; flush handpiece and syringe lines briefly between patients.</li>
  <li>For surgical bone cutting use <b>sterile saline or sterile water</b> through a sterile delivery system.</li>
</ul>
<h4 class="deck-topic">Waste and specimens</h4>
<ul>
  <li><b>Sharps</b> (needles, blades, burs, used cartridges that are broken or blood-contaminated, wires): puncture-resistant container; many policies place all used cartridges there.</li>
  <li>Blood-soaked material and tissue: regulated clinical waste.</li>
  <li><b>Extracted teeth with amalgam</b>: never into heat-treated or incinerated waste; follow mercury or recycler rules.</li>
  <li>Specimen container contaminated outside: place in a labelled, leak-proof secondary bag or container, or clean it as protocol directs.</li>
</ul>
<div class="sum-key">
  <span class="sum-key-title">نقاط امتحانية</span>
  <ul>
    <li>Spores destroyed reliably: <b>sterilization</b>.</li>
    <li>Impression disinfectant depends on the material and label.</li>
    <li>Amalgam teeth stay out of incineration.</li>
    <li>Bone surgery irrigant must be sterile.</li>
  </ul>
</div>
      `,
            questions: [
                {
                    "q": "Which process destroys all forms of microbial life, including bacterial spores?",
                    "options": [
                        "Disinfection",
                        "Sterilization",
                        "Antisepsis",
                        "Routine cleaning"
                    ],
                    "answer": 1,
                    "explanation": "Sterilization destroys or eliminates all forms of microbial life. Disinfection does not ordinarily eliminate bacterial spores, and cleaning primarily removes soil. Reference: Centers for Disease Control and Prevention. Glossary: Disinfection and Sterilization. 2024.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A dental light handle is touched during treatment and has no barrier. What is required between patients?",
                    "options": [
                        "Sterilize the entire light in an autoclave",
                        "Wipe only if blood is visible",
                        "Do nothing because it is not inside the mouth",
                        "Clean and disinfect with a compatible health-care disinfectant"
                    ],
                    "answer": 3,
                    "explanation": "A touched clinical contact surface is barrier-protected or cleaned and disinfected between patients. Material compatibility and contact time follow the product and equipment instructions. Reference: Centers for Disease Control and Prevention. Environmental Infection Prevention and Control in Dental Settings.",
                    "source": "SDLE bank"
                },
                {
                    "q": "An elastomeric impression is contaminated with saliva and blood. How is the disinfectant selected?",
                    "options": [
                        "By impression material, compatible product label, contact time, and laboratory protocol",
                        "Use one chemical for every material",
                        "Autoclave every impression",
                        "Send it without cleaning"
                    ],
                    "answer": 0,
                    "explanation": "The impression is rinsed or cleaned, disinfected without distorting the material, and communicated safely to the laboratory. The manufacturer instructions govern concentration and time. Reference: Centers for Disease Control and Prevention. Guidelines for Infection Control in Dental Health-Care Settings. Dental laboratory items.",
                    "source": "SDLE bank"
                },
                {
                    "q": "How should a discarded extracted tooth containing an amalgam restoration be managed?",
                    "options": [
                        "Place it in an incinerated red bag",
                        "Autoclave and incinerate it",
                        "Put it in ordinary trash",
                        "Follow mercury-waste or recycler requirements"
                    ],
                    "answer": 3,
                    "explanation": "An amalgam-containing extracted tooth should not enter a waste stream that will be incinerated because mercury may be released. Local rules and an approved amalgam or metal recycler determine the disposal pathway. Reference: Centers for Disease Control and Prevention. Best Practices for Handling Extracted Teeth. 2023.",
                    "source": "SDLE bank"
                },
                {
                    "q": "Which irrigant is appropriate when cooling bone during an invasive oral surgical procedure?",
                    "options": [
                        "Tap water",
                        "Hydrogen peroxide",
                        "Sterile saline",
                        "Nonsterile mouthrinse"
                    ],
                    "answer": 2,
                    "explanation": "Sterile saline or sterile water is used as a coolant or irrigant for procedures involving incision, reflection of a flap, or exposure of normally sterile bone. Conventional dental-unit water is not used for surgical irrigation. Reference: Centers for Disease Control and Prevention. Dental Unit Water Quality. Surgical procedures. 2024.",
                    "source": "SDLE bank"
                }
            ],
        },
        {
            id: "pic-consent",
            title: "07 — Informed Consent & Capacity",
            title_en: "Disclosure · minors · emergencies",
            summaryHtml: `
<h4 class="deck-topic">Valid consent</h4>
<ul>
  <li><b>Capacity</b>, <b>adequate information</b>, understanding and a <b>voluntary</b> choice.</li>
  <li>Explain diagnosis, proposed treatment, benefits, material risks, <b>reasonable alternatives including no treatment</b>, likely outcomes and cost.</li>
  <li>Use plain language and an interpreter when needed.</li>
  <li>A signature is evidence, not the whole process. Consent can be withdrawn.</li>
  <li>Never hide a serious risk because the patient might refuse.</li>
  <li><b>Renew</b> consent after a long delay or when the condition, plan or risks change.</li>
</ul>
<h4 class="deck-topic">Capacity</h4>
<ul>
  <li>It is <b>specific to the decision and the time</b>: understand, retain, weigh and communicate a choice.</li>
  <li>Disability, old age or a diagnosis does <b>not</b> by itself remove capacity.</li>
  <li>A capable adult decides personally. A spouse or relative does not replace that consent, including for a capable woman or a pregnant patient.</li>
  <li>Temporary incapacity such as delirium: <b>defer non-urgent care</b> and reassess.</li>
</ul>
<h4 class="deck-topic">Minors</h4>
<ul>
  <li>The parent or legal guardian consents; involve the child and seek <b>assent</b>. Local law sets the age of consent and exceptions.</li>
  <li>If a calm, capable adolescent persistently refuses an <b>elective</b> procedure, pause, listen and discuss again rather than force it.</li>
</ul>
<h4 class="deck-topic">Emergency</h4>
<div class="sum-algo">
  <span class="sum-algo-title">No one can consent</span>
  <ol>
    <li>Is delay likely to cause death or serious harm?</li>
    <li>Try reasonably to reach a representative without dangerous delay.</li>
    <li>Give the <b>necessary</b> treatment in the patient's best interest, following law and policy.</li>
    <li>Document reasons and inform the patient or guardian as soon as possible.</li>
    <li>Leave non-urgent choices until consent is possible.</li>
  </ol>
</div>
<ul>
  <li>A known valid advance decision or refusal must be considered under local law. A valid current <b>do-not-resuscitate order</b> is followed even if relatives ask otherwise; communicate with them compassionately.</li>
</ul>
<div class="sum-key">
  <span class="sum-key-title">نقاط امتحانية</span>
  <ul>
    <li>Capable adult: consent comes from the <b>patient</b>.</li>
    <li>Capacity is <b>decision specific</b>.</li>
    <li>Airway threat with no representative: treat the emergency.</li>
    <li>Alternatives must be offered, not only the dentist's favourite.</li>
  </ul>
</div>
      `,
            questions: [
                {
                    "q": "Which information is essential before a guardian can authorize treatment for a minor?",
                    "options": [
                        "Only the fee and appointment duration",
                        "Only the dentist's preferred procedure",
                        "A guarantee of a successful outcome",
                        "Diagnosis proposed treatment material risks benefits and alternatives"
                    ],
                    "answer": 3,
                    "explanation": "Valid informed permission requires disclosure of the diagnosis, nature and purpose of treatment, material risks and benefits, reasonable alternatives, and consequences of no treatment. Questions must be allowed and the decision documented voluntarily. Reference: American Academy of Pediatric Dentistry. Informed Consent. The Reference Manual of Pediatric Dentistry. Current edition; Ozar DT, Sokol DJ, Patthoff DE. Dental Ethics at Chairside. 3rd ed.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A 30-year-old with mild intellectual disability is assessed as capable of making the treatment decision. Who signs the consent?",
                    "options": [
                        "The patient",
                        "A parent automatically",
                        "The psychologist",
                        "The clinic manager"
                    ],
                    "answer": 0,
                    "explanation": "A capable adult gives consent personally. Intellectual disability does not automatically remove capacity; communication support should be provided, and a representative is used only when legally indicated. Reference: Saudi Ministry of Health. Saudi Guidelines for Informed Consent. Capable adults and representatives. 2019.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A patient with dementia can explain a simple filling but cannot understand a complex high-risk surgery. What does this illustrate?",
                    "options": [
                        "Capacity is decision-specific",
                        "Dementia always removes all capacity",
                        "Capacity is determined by age",
                        "One assessment applies permanently"
                    ],
                    "answer": 0,
                    "explanation": "The abilities required depend on the complexity and consequences of the decision. Communication support, timing, reversible impairment, prior wishes, and a lawful representative are considered. Reference: Saudi Ministry of Health and Saudi Patient Safety Center. Saudi Guidelines for Informed Consent. Assessment of competence and authorization.",
                    "source": "SDLE bank"
                },
                {
                    "q": "An unconscious patient has a rapidly spreading odontogenic infection threatening the airway. No representative can be reached. What is the appropriate action?",
                    "options": [
                        "Wait until irreversible harm occurs",
                        "Provide elective cosmetic treatment",
                        "Obtain consent from an unrelated bystander",
                        "Provide immediately necessary emergency treatment and document the basis"
                    ],
                    "answer": 3,
                    "explanation": "When delay threatens life or major function and consent cannot be obtained, emergency treatment may proceed under the applicable emergency exception, with documentation and notification as soon as possible. Reference: Saudi Ministry of Health and Saudi Patient Safety Center. Saudi Guidelines for Informed Consent. Emergency exceptions.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A patient signs consent but postpones treatment for six months. What should the dentist do before proceeding?",
                    "options": [
                        "Reassess and update or renew consent",
                        "Use the old signature without review",
                        "Proceed despite clinical changes",
                        "Ask a relative instead"
                    ],
                    "answer": 0,
                    "explanation": "Consent is an ongoing communication process. After a substantial delay, the dentist should reassess diagnosis, capacity, preferences, risks, alternatives, and any changed circumstances, then document updated consent according to policy. Reference: Saudi Ministry of Health. Saudi Guidelines for Informed Consent. Validity, changed circumstances, and documentation. 2019.",
                    "source": "SDLE bank"
                }
            ],
        },
        {
            id: "pic-ethics",
            title: "08 — Ethical Principles & Professional Conduct",
            title_en: "Autonomy · justice · integrity",
            summaryHtml: `
<h4 class="deck-topic">The core principles</h4>
<div class="deck-block deck-tbl">
  <table>
    <thead><tr><th>Principle</th><th>Meaning</th><th>Example of breach</th></tr></thead>
    <tbody>
      <tr><td><b>Autonomy</b></td><td>Respect an informed choice</td><td>Pushing braces on someone who refuses</td></tr>
      <tr><td><b>Beneficence</b></td><td>Act for the patient's good</td><td>Refusing simple help that could safely be given</td></tr>
      <tr><td><b>Non-maleficence</b></td><td>Do no harm</td><td>Careless or unjustified treatment</td></tr>
      <tr><td><b>Justice</b></td><td>Fair treatment and resource use</td><td>Moving friends up a waiting list</td></tr>
      <tr><td><b>Veracity</b></td><td>Tell the truth</td><td>Misleading a patient</td></tr>
      <tr><td><b>Fidelity</b></td><td>Keep trust and commitments</td><td>Abandoning ongoing care</td></tr>
    </tbody>
  </table>
</div>
<ul>
  <li>The World Medical Association ethics manual highlights <b>compassion, competence and autonomy</b> as core values.</li>
</ul>
<h4 class="deck-topic">Common scenarios</h4>
<ul>
  <li><b>Patient wants more invasive treatment</b>: explain conservative options and consequences. Autonomy does not oblige harmful or unjustified care; decline respectfully and offer another opinion.</li>
  <li><b>Insurance does not cover the best option</b>: still discuss all feasible options and costs honestly.</li>
  <li><b>VIP or relative of a manager</b>: use the same clinical priority; favouritism is an abuse of position.</li>
  <li><b>Gifts or payments from companies</b> that can sway prescribing or product choice: a <b>conflict of interest</b>; follow disclosure and refusal rules.</li>
  <li><b>Beyond your competence</b>: refer, explain why and hand over relevant information.</li>
  <li><b>Faulty earlier work</b>: describe present findings objectively; do not guess or insult a colleague. Unsafe practice is raised through proper channels.</li>
</ul>
<h4 class="deck-topic">Research integrity</h4>
<ul>
  <li>Report results honestly, including unfavourable ones. Hiding, inventing or altering data is misconduct.</li>
  <li>Research needs ethics approval, consent and protection of identifiable data; do not ship original identifiable charts without authorisation and safeguards.</li>
</ul>
<div class="sum-key">
  <span class="sum-key-title">نقاط امتحانية</span>
  <ul>
    <li>"Do no harm" is <b>non-maleficence</b>.</li>
    <li>Queue jumping breaches <b>justice</b>.</li>
    <li>Respecting an informed refusal is autonomy.</li>
    <li>Suppressing results breaks research integrity.</li>
  </ul>
</div>
      `,
            questions: [
                {
                    "q": "Which ethical principle means \"do no harm\"?",
                    "options": [
                        "Non-maleficence",
                        "Beneficence",
                        "Justice",
                        "Autonomy"
                    ],
                    "answer": 0,
                    "explanation": "Non-maleficence means do no harm, beneficence means do good, justice means fairness and autonomy means respecting choice. Key takeaway: non-maleficence equals do no harm.",
                    "source": "SDLE recall"
                },
                {
                    "q": "A senior consultant moves a relative ahead of equal-priority patients on a waiting list. What is the clearest ethical breach?",
                    "options": [
                        "Breach of confidentiality",
                        "Failure of informed consent",
                        "Abuse of position and unfair allocation",
                        "Research misconduct"
                    ],
                    "answer": 2,
                    "explanation": "Using authority to give a relative preferential access without a clinical basis is a conflict of interest and an unjust allocation of care. Clinical urgency, not personal relationship, should determine priority. Reference: American Dental Association. Principles of Ethics and Code of Professional Conduct. Justice and professional integrity. 2026.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A patient has bleeding and inflammation beside an overhanging restoration placed elsewhere. How should the new dentist communicate?",
                    "options": [
                        "Attack the previous dentist",
                        "Hide the overhang",
                        "Promise a complaint outcome",
                        "Explain objective findings without disparagement"
                    ],
                    "answer": 3,
                    "explanation": "The dentist should describe the overhang, its likely relationship to inflammation, and appropriate corrective care using objective language. Unsupported criticism of a colleague should be avoided, while genuine concerns are documented and handled professionally. Reference: World Medical Association. Medical Ethics Manual. Relationships with colleagues; American Dental Association. Veracity.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A researcher suppresses unfavorable drug-study results to protect personal reputation. What has been violated?",
                    "options": [
                        "Patient scheduling",
                        "Clinical privilege",
                        "Research integrity",
                        "Resource allocation"
                    ],
                    "answer": 2,
                    "explanation": "Researchers must report results honestly, including unfavorable or inconclusive findings. Suppression based on reputation creates publication bias and violates scientific and research integrity. Reference: World Medical Association. Medical Ethics Manual. Ethical requirements for medical research and honest reporting of results. 3rd ed.",
                    "source": "SDLE bank"
                },
                {
                    "q": "Which three values are identified as core features of medical ethics in the World Medical Association ethics manual?",
                    "options": [
                        "Compassion, competence, autonomy",
                        "Profit, prestige, authority",
                        "Speed, volume, efficiency",
                        "Secrecy, obedience, hierarchy"
                    ],
                    "answer": 0,
                    "explanation": "The WMA identifies compassion, competence, and autonomy as core values expected to be exemplified to a high degree by health professionals. Reference: World Medical Association. Medical Ethics Manual. Principal features of medical ethics. 3rd ed., 2015.",
                    "source": "SDLE bank"
                }
            ],
        },
        {
            id: "pic-safety-disclosure",
            title: "09 — Confidentiality, Patient Safety & Disclosure",
            title_en: "Privacy · adverse events · honesty",
            summaryHtml: `
<h4 class="deck-topic">Confidentiality</h4>
<ul>
  <li>Share identifiable information only with consent or another lawful reason, and only the minimum needed.</li>
  <li>Photographs, radiographs and case stories on social media need <b>explicit consent</b>; removing a name may not remove identity.</li>
  <li>An email with radiographs sent to the wrong person is a privacy breach: contain it, report it and follow policy.</li>
  <li>Exceptions defined by law include child protection, notifiable disease, court orders and some serious risks to others.</li>
</ul>
<h4 class="deck-topic">Safety words</h4>
<div class="deck-block deck-tbl">
  <table>
    <thead><tr><th>Term</th><th>Meaning</th></tr></thead>
    <tbody>
      <tr><td><b>Near miss</b></td><td>An error or event caught before it reaches the patient</td></tr>
      <tr><td><b>Adverse event</b></td><td>Harm related to healthcare rather than the disease itself</td></tr>
      <tr><td><b>Active failure</b></td><td>An unsafe act or omission by a front-line person</td></tr>
      <tr><td><b>Latent condition</b></td><td>A hidden system weakness, such as no process for checking staff vaccination</td></tr>
    </tbody>
  </table>
</div>
<ul>
  <li>Wrong tooth or wrong site is a serious, preventable event. Prevent it with identity check, matching records and images, marked tooth number and a <b>time-out</b>.</li>
</ul>
<h4 class="deck-topic">After something goes wrong</h4>
<div class="sum-algo">
  <span class="sum-algo-title">Open disclosure</span>
  <ol>
    <li>Make the patient safe and give needed care.</li>
    <li>Tell the patient promptly and honestly what is known; express regret or apologise.</li>
    <li>Explain consequences, options and follow-up.</li>
    <li>Document facts accurately; never alter earlier notes.</li>
    <li>File an incident report so the system can learn.</li>
  </ol>
</div>
<ul>
  <li>Disclose an injury even when the anaesthetised patient did not notice it.</li>
  <li>Tell the patient about a significant new finding, such as damage to an adjacent molar, even if the referral was for another tooth.</li>
</ul>
<div class="sum-key">
  <span class="sum-key-title">نقاط امتحانية</span>
  <ul>
    <li>Social media use of patient images needs consent.</li>
    <li>Unnoticed harm still requires <b>disclosure</b>.</li>
    <li>Unsafe act by staff is an <b>active failure</b>.</li>
    <li>Reporting aims at learning and prevention.</li>
  </ul>
</div>
      `,
            questions: [
                {
                    "q": "Posting a patient’s photograph on social media without consent is considered:",
                    "options": [
                        "A violation of patient privacy.",
                        "Patient information disclosure.",
                        "Professional communication.",
                        "Informed consent."
                    ],
                    "answer": 0,
                    "explanation": "Posting a patient's photo without consent violates privacy and confidentiality. It is not professional communication and it is not informed consent. Key takeaway: get written consent before sharing images.",
                    "source": "SDLE recall"
                },
                {
                    "q": "A clinician sends identifiable radiographs to the wrong email address. Which duty is breached?",
                    "options": [
                        "Nonmaleficence only",
                        "Sterility assurance",
                        "Confidentiality",
                        "Occlusal stability"
                    ],
                    "answer": 2,
                    "explanation": "Identifiable health information should be sent only to verified authorized recipients using approved secure systems and the minimum necessary content. A misdirected message requires incident response. Reference: Saudi Commission for Health Specialties. Code of Ethics for Healthcare Practitioners. Patient confidentiality; institutional information-security policy.",
                    "source": "SDLE bank"
                },
                {
                    "q": "During general anesthesia, a dentist extracts tooth 11 instead of tooth 21, replants 11, and then extracts 21. What must follow?",
                    "options": [
                        "Say nothing because 11 was replanted",
                        "Disclose, document, report, and arrange care",
                        "Record only the intended extraction",
                        "Tell staff but not the patient"
                    ],
                    "answer": 1,
                    "explanation": "Replantation does not erase the wrong-site adverse event or its risks. After recovery, the patient or authorized representative must be informed, the event documented and reported, and appropriate monitoring and remedial care arranged. Reference: The Joint Commission. Sentinel Event FAQs. Wrong-site procedures; Saudi Patient Safety Center, adverse-event disclosure principles.",
                    "source": "SDLE bank"
                },
                {
                    "q": "During treatment, a patient moves and the dentist causes a small floor-of-mouth injury that the anesthetized patient does not notice. What should the dentist do?",
                    "options": [
                        "Disclose, document, manage, and follow up",
                        "Conceal it because the patient felt nothing",
                        "Alter the record",
                        "Wait for the patient to discover it"
                    ],
                    "answer": 0,
                    "explanation": "An unintended injury should be assessed and managed, explained honestly to the patient, documented accurately, and followed until resolution. Lack of immediate sensation does not remove the duty to disclose. Reference: American Dental Association. Principles of Ethics and Code of Professional Conduct. Veracity and patient autonomy; patient- safety disclosure principles.",
                    "source": "SDLE bank"
                },
                {
                    "q": "A clinician discards a suture needle hidden in a bloody swab into a plastic waste bag, and a cleaner is injured. How is the unsafe disposal act classified?",
                    "options": [
                        "Active failure",
                        "Latent condition only",
                        "Near miss",
                        "Expected complication"
                    ],
                    "answer": 0,
                    "explanation": "Putting an exposed sharp into an ordinary waste bag is an unsafe frontline action with an immediate effect, so it is an active failure. System factors may also contribute, but the described act itself is not merely latent, and harm means it is not a near miss. Reference: World Health Organization. Patient Safety Curriculum Guide: Multi-professional Edition. Human factors, active failures, and latent conditions; WHO sharps-disposal guidance.",
                    "source": "SDLE bank"
                }
            ],
        },
        {
            id: "pic-occupational",
            title: "10 — Occupational Safety, Roles & Public Health",
            title_en: "Hierarchy of controls · CanMEDS",
            summaryHtml: `
<h4 class="deck-topic">Risk assessment</h4>
<div class="sum-algo">
  <span class="sum-algo-title">Cycle</span>
  <ol>
    <li><b>Identify</b> the hazard and who may be harmed.</li>
    <li><b>Evaluate</b> the risk and decide on controls.</li>
    <li><b>Record</b> findings and actions.</li>
    <li><b>Review</b> and update.</li>
  </ol>
</div>
<h4 class="deck-topic">Hierarchy of controls (most to least effective)</h4>
<div class="deck-block deck-tbl">
  <table>
    <thead><tr><th>Level</th><th>Dental example</th></tr></thead>
    <tbody>
      <tr><td><b>Elimination</b></td><td>Remove an unnecessary sharp or step</td></tr>
      <tr><td><b>Substitution</b></td><td>Replace a hazardous product with a safer one</td></tr>
      <tr><td><b>Engineering</b></td><td>Safety syringe, sharps container, suction, ventilation</td></tr>
      <tr><td><b>Administrative</b></td><td>Training, policy, scheduling, neutral-zone routine</td></tr>
      <tr><td><b>PPE</b></td><td>Gloves, mask, eye protection; the last line</td></tr>
    </tbody>
  </table>
</div>
<h4 class="deck-topic">Staff health</h4>
<ul>
  <li>Employers should review indicated immunisations, especially <b>hepatitis B</b>, with documented response; skipping this leaves staff open to preventable occupational infection.</li>
  <li>Report work injuries even if they seem minor or the worker has gone home.</li>
</ul>
<h4 class="deck-topic">CanMEDS roles</h4>
<ul>
  <li><b>Medical (dental) expert</b>: central clinical role.</li>
  <li><b>Communicator</b>: gathers information and includes the patient and family view.</li>
  <li><b>Collaborator</b>: works in teams. <b>Leader</b>: improves systems and resources.</li>
  <li><b>Health advocate</b>, <b>Scholar</b> (learning, teaching, evidence) and <b>Professional</b> (ethics and accountability).</li>
</ul>
<h4 class="deck-topic">Fluoride in public health</h4>
<ul>
  <li><b>Community water fluoridation</b> is the most widely used population-level systemic method and is generally regarded as highly cost-effective.</li>
  <li>The commonly quoted <b>probably toxic dose</b> is <b>5 mg fluoride ion per kg</b>: arrange urgent assessment.</li>
</ul>
<div class="sum-key">
  <span class="sum-key-title">نقاط امتحانية</span>
  <ul>
    <li>If a hazard cannot be eliminated, consider <b>substitution</b> next.</li>
    <li>PPE is the lowest level of control.</li>
    <li>Gathering the patient view is the <b>communicator</b> role.</li>
    <li>Fluoride toxic threshold: 5 mg/kg.</li>
  </ul>
</div>
      `,
            questions: [
                {
                    "q": "Which sequence best describes a complete workplace risk assessment?",
                    "options": [
                        "Identify and record only",
                        "Treat first and assess later",
                        "Report without evaluating",
                        "Identify, evaluate, record, and review"
                    ],
                    "answer": 3,
                    "explanation": "A defensible risk assessment identifies hazards, evaluates likelihood and severity, records significant findings and controls, and is reviewed periodically or when circumstances change. Reference: World Health Organization. HealthWISE Action Manual. Identifying hazards, assessing risks, controlling hazards, and reviewing workplace safety.",
                    "source": "SDLE bank"
                },
                {
                    "q": "In the hierarchy of controls, what should be considered after eliminating a hazard is not feasible?",
                    "options": [
                        "Substitution",
                        "Personal protective equipment",
                        "Administrative warning",
                        "Incident concealment"
                    ],
                    "answer": 0,
                    "explanation": "The preferred order is elimination, substitution, engineering controls, administrative controls, and PPE. A safer substitute should therefore be considered before lower-level controls. Reference: National Institute for Occupational Safety and Health. Hierarchy of Controls. 2024.",
                    "source": "SDLE bank"
                },
                {
                    "q": "In CanMEDS, which role elicits and synthesizes relevant information while incorporating patient and family perspectives?",
                    "options": [
                        "Communicator",
                        "Scholar",
                        "Health Advocate",
                        "Leader"
                    ],
                    "answer": 0,
                    "explanation": "The Communicator role includes eliciting and synthesizing accurate, relevant information and incorporating the perspectives of patients and families. Communication with professional colleagues also draws on the Collaborator role. Reference: Royal College of Physicians and Surgeons of Canada. CanMEDS 2015 Physician Competency Framework. Communicator role.",
                    "source": "SDLE bank"
                },
                {
                    "q": "Which method is the most widely used population-based systemic fluoride delivery approach?",
                    "options": [
                        "Community water fluoridation",
                        "Fluoride toothpaste",
                        "Fluoride mouthrinse",
                        "Fluoride varnish"
                    ],
                    "answer": 0,
                    "explanation": "Community water fluoridation is the principal population-wide systemic delivery program, although its anticaries benefit is now understood to be largely topical through frequent low-level exposure after eruption. Toothpaste, rinses, and varnish are topical methods. Reference: Centers for Disease Control and Prevention. Community Water Fluoridation Recommendations. 2024.",
                    "source": "SDLE bank"
                },
                {
                    "q": "What is the probably toxic dose of fluoride requiring urgent assessment?",
                    "options": [
                        "0.05 mg/kg",
                        "0.5 mg total in every child",
                        "5 mg fluoride ion/kg body weight",
                        "50 mg regardless of weight"
                    ],
                    "answer": 2,
                    "explanation": "Toxicity is weight-based and expressed as fluoride ion, not compound mass. Any symptomatic or potentially toxic ingestion requires poison-center or emergency guidance. Reference: Dean JA. McDonald and Avery's Dentistry for the Child and Adolescent. 11th ed. Acute fluoride toxicity.",
                    "source": "SDLE bank"
                }
            ],
        },
    ],
};

export default dentalProfessionalismAndInfectionControl;
