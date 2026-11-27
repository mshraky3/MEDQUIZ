// AUTO-COPIED from my-react-app/src/components/summaries/content/specialtyGastroenterology.js. Do not edit here:
// change the website's file, then run `npm run sync:summaries` in mobile/.
// Gastroenterology — medical-track section of the summaries catalog.
// Mirrored for the slide viewer in backend/content/summaryHtml (keep the two in sync).
// Inline questions are copied from the SQB bank.
const specialtyGastroenterology = {
    id: "gastroenterology",
    title: "Gastroenterology",
    title_en: "SMLE Review — 10 Topics",
    icon: "shield-check",
    accent: "#f59e0b",
    intro: "Gastroenterology and hepatology for SMLE revision: Viral Hepatitis · Cirrhosis & Ascites · Variceal and Upper GI Bleeding · Inflammatory Bowel Disease · Pancreatitis · Oesophagus & Stomach · Diarrhoea, Coeliac Disease & IBS · Jaundice and Specific Liver Diseases · Liver Masses & Abscess · Colon, Lower GI Bleeding & Gut Ischaemia.",
    subtopics: [
        {
            id: "gi-viral-hepatitis",
            title: "01 — Viral Hepatitis",
            title_en: "HBV serology · Who to treat · HCV cure · Exposure",
            summaryHtml: `
<h4 class="deck-topic">What each HBV marker means</h4>
<ul>
  <li><b>HBsAg</b>: virus present now. Persisting for more than 6 months = chronic infection.</li>
  <li><b>Anti-HBs</b>: protection, from vaccine or from recovery.</li>
  <li><b>Anti-HBc</b>: only follows real infection (the vaccine has no core antigen). <b>IgM</b> points to recent infection; it can also rise in a flare of chronic disease.</li>
  <li><b>HBeAg</b> and <b>HBV DNA</b>: show replication and infectivity.</li>
</ul>
<div class="deck-block deck-tbl"><table><thead><tr><th>State</th><th>HBsAg</th><th>Anti-HBs</th><th>Anti-HBc</th></tr></thead><tbody>
<tr><td><b>Vaccinated</b></td><td>−</td><td>+</td><td>−</td></tr>
<tr><td><b>Recovered infection</b></td><td>−</td><td>+</td><td>IgG +</td></tr>
<tr><td><b>Acute infection</b></td><td>+</td><td>−</td><td>IgM +</td></tr>
<tr><td><b>Window period</b></td><td>−</td><td>−</td><td>IgM +</td></tr>
<tr><td><b>Chronic infection</b></td><td>+</td><td>−</td><td>IgG +, IgM −</td></tr>
</tbody></table></div>
<h4 class="deck-topic">Treating chronic hepatitis B</h4>
<ul>
  <li>Decide using HBV DNA, ALT, HBeAg status and fibrosis. Treat <b>cirrhosis with detectable DNA</b> and <b>active disease</b> (raised ALT with high viral load or significant fibrosis). Recent guidelines have widened eligibility, and exact cut-offs differ.</li>
  <li>First line: <b>entecavir</b> or <b>tenofovir</b>. Tenofovir is preferred after lamivudine resistance and in pregnancy.</li>
  <li>Pregnancy with a high viral load: tenofovir in the third trimester. Newborn of an HBsAg-positive mother: <b>vaccine + HBIG</b>, ideally within 12 hours.</li>
  <li>Test HBsAg and anti-HBc before chemotherapy, rituximab or other strong immunosuppression, because HBV can reactivate.</li>
</ul>
<h4 class="deck-topic">Hepatitis C</h4>
<ul>
  <li>Screen with anti-HCV, then confirm active infection with <b>HCV RNA</b>. Assess fibrosis before treatment.</li>
  <li><b>Direct-acting antivirals</b> cure most patients. Pangenotypic choices: sofosbuvir/velpatasvir or glecaprevir/pibrentasvir.</li>
  <li>Cure (SVR) = undetectable RNA 12 weeks after treatment. Anti-HCV stays positive and does not protect against reinfection.</li>
  <li>Needlestick risk, approximate: HBV is highest (much higher if HBeAg positive), HCV about 2% (older sources say 3%), HIV about 0.3%. There is no vaccine or routine prophylaxis for HCV: follow up with testing.</li>
</ul>
<div class="sum-key">
  <span class="sum-key-title">نقاط امتحانية</span>
  <ul>
    <li>Isolated anti-HBs = vaccination.</li>
    <li>Anti-HBs with IgG anti-HBc = past infection with immunity.</li>
    <li>HBsAg positive, IgG anti-HBc positive, IgM negative = chronic hepatitis B.</li>
    <li>Hepatitis A and E spread by the faeco-oral route; hepatitis E can be severe in pregnancy.</li>
    <li>Hepatitis D needs HBsAg to infect.</li>
  </ul>
</div>
`,
            questions: [
                {
                    "q": "A 34-year-old previously healthy man brings hepatitis B lab results from a private clinic: HBsAg negative, HBeAg negative, anti-HBs positive, anti-HBc IgG negative. What clinical state do these results indicate?",
                    "options": [
                        "Previous hepatitis B infection",
                        "Acute hepatitis B infection",
                        "Chronic hepatitis B infection",
                        "Previous hepatitis B immunization"
                    ],
                    "answer": 3,
                    "explanation": "Isolated positive anti-HBs with a negative anti-HBc indicates immunity from vaccination, since natural infection, past or current, would also produce a positive anti-HBc (core antibody), which is absent here.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A 40-year-old woman is noticed to be jaundiced (see lab results: Anti-HBs Negative, Anti-HBc Positive, Bs antigen Positive, IgM anti-HBc Negative). What is the patient's hepatitis B status?",
                    "options": [
                        "Chronic hepatitis B",
                        "Acute hepatitis B infection",
                        "Previous hepatitis B infection",
                        "Previous immunisation to hepatitis B"
                    ],
                    "answer": 0,
                    "explanation": "Core Concept: Hepatitis B serology interpretation. The presence of Hepatitis B surface antigen (HBsAg) indicates active infection. The absence of IgM anti-HBc indicates that the infection is not acute (i.e., it has been present for > 6 months), defining it as chronic. (Anti-HBs is negative because the surface antigen is still present and neutralizing antibodies have not formed). Clinical Presentation: · Classic symptoms: Often asymptomatic. May present with fatigue, right upper quadrant discomfort, or signs of cirrhosis if advanced. · Complications: Cirrhosis, hepatic decompensation, and hepatocellular carcinoma (HCC). Diagnosis: · Diagnostic algorithm: Hepatitis B panel (HBsAg, anti-HBs, total anti-HBc, IgM anti-HBc). · First-line diagnostic plan: Serology showing HBsAg (+), Total anti-HBc (+), IgM anti-HBc (-), and anti-HBs (-). · Gold standard: Persistence of HBsAg in the serum for greater than 6 months. Management: · Acute management: Evaluate liver function (ALT/AST), viral load (HBV DNA), and stage liver fibrosis (e.g., FibroScan or biopsy). · Long-term/Definitive management: Antiviral therapy (e.g., Entecavir, Tenofovir) if there is active viral replication with elevated ALT or significant fibrosis. Regular HCC surveillance with liver ultrasound every 6 months is mandatory.",
                    "source": "SMLE bank"
                },
                {
                    "q": "An individual who has received all 3 doses of hepatitis B vaccine and has never had hepatitis B virus infection. Which of the following serologic markers is expected to be positive?",
                    "options": [
                        "HBcAb",
                        "HBSAb",
                        "HBeAb",
                        "HBeAb and HBsAb"
                    ],
                    "answer": 1,
                    "explanation": "- Core Concept: The Hepatitis B vaccine contains only the recombinant Hepatitis B surface antigen (HBsAg). Therefore, a vaccinated individual will develop antibodies against the surface antigen (anti-HBs / HBsAb) but will NOT have antibodies against the core antigen (anti-HBc), which only forms after exposure to the actual whole virus. · Clinical Presentation: - *Symptoms:* Asymptomatic, fully immune. - *Complications:* None; protected against HBV infection. · Diagnosis: Serologic panel: HBsAg (negative), anti-HBc (negative), anti-HBs / HBsAb (positive, >10 mIU/mL). · Management: No treatment or further vaccination is needed; immunity is successfully established.",
                    "source": "SMLE bank"
                }
            ],
        },
        {
            id: "gi-cirrhosis-ascites",
            title: "02 — Cirrhosis, Ascites & Encephalopathy",
            title_en: "SAAG · SBP · Diuretics · Hepatorenal syndrome",
            summaryHtml: `
<h4 class="deck-topic">Reading the ascitic tap</h4>
<p>Tap every new ascites and every admitted cirrhotic patient with ascites. <b>SAAG</b> = serum albumin minus ascitic albumin.</p>
<div class="deck-block deck-tbl"><table><thead><tr><th>SAAG 1.1 g/dL or more (portal hypertension)</th><th>SAAG below 1.1 g/dL</th></tr></thead><tbody>
<tr><td>Cirrhosis (ascitic protein usually low)</td><td>Peritoneal carcinomatosis</td></tr>
<tr><td>Heart failure (ascitic protein usually high)</td><td>Tuberculous peritonitis</td></tr>
<tr><td>Budd-Chiari syndrome, massive liver metastases</td><td>Nephrotic syndrome, pancreatic ascites</td></tr>
</tbody></table></div>
<ul>
  <li><b>TB peritonitis</b>: lymphocyte-rich, high-protein, low-SAAG fluid. Check <b>adenosine deaminase</b>; laparoscopic peritoneal biopsy is the most definitive test. Underlying cirrhosis can blur the SAAG and protein pattern.</li>
</ul>
<h4 class="deck-topic">Ascites treatment</h4>
<ul>
  <li>Salt restriction (about 2 g sodium daily), stop alcohol, avoid NSAIDs.</li>
  <li><b>Spironolactone</b>, adding <b>furosemide</b> when needed (usual ratio 100 mg : 40 mg). Watch potassium, sodium and creatinine.</li>
  <li>Tense ascites: large-volume paracentesis; give <b>albumin</b> if more than 5 L is removed.</li>
  <li>Refractory ascites: repeat paracentesis, consider TIPS, refer for transplant.</li>
</ul>
<h4 class="deck-topic">Spontaneous bacterial peritonitis</h4>
<ul>
  <li>Diagnosis: ascitic <b>neutrophils 250/mm³ or more</b>. Fever or pain may be absent.</li>
  <li>Treat at once with a third-generation cephalosporin (cefotaxime or ceftriaxone); adjust if hospital-acquired or resistant organisms are likely. <b>IV albumin</b> lowers kidney injury and death, especially in higher-risk patients.</li>
  <li>After one episode give secondary antibiotic prophylaxis.</li>
</ul>
<h4 class="deck-topic">Encephalopathy and kidneys</h4>
<ul>
  <li>Find the trigger: infection, GI bleed, constipation, dehydration or diuretics, low potassium, sedatives, TIPS.</li>
  <li>Treat the trigger and give <b>lactulose</b> to 2–3 soft stools a day; add <b>rifaximin</b> for recurrence. Do not routinely restrict protein. Ammonia level alone does not make the diagnosis.</li>
  <li><b>Hepatorenal syndrome</b> is a diagnosis of exclusion: stop diuretics and nephrotoxins, give albumin; if criteria are met, add a vasoconstrictor (terlipressin or noradrenaline). Transplant is definitive.</li>
</ul>
<div class="sum-key">
  <span class="sum-key-title">نقاط امتحانية</span>
  <ul>
    <li>High SAAG means portal hypertension.</li>
    <li>Neutrophils of 250 or more: start antibiotics without waiting for culture.</li>
    <li>Lymphocytic low-SAAG ascites: think TB or malignancy.</li>
    <li>Child-Pugh uses bilirubin, albumin, INR, ascites and encephalopathy; MELD ranks transplant priority.</li>
  </ul>
</div>
`,
            questions: [
                {
                    "q": "A man known to have chronic viral hepatitis presented with ascites and was found to have a high serum ascites albumin gradient (SAAG) of more than 1.1. Which of the following is the most likely cause?",
                    "options": [
                        "Pancreatitis",
                        "Tuberculosis",
                        "Liver cirrhosis",
                        "Nephrotic syndrome"
                    ],
                    "answer": 2,
                    "explanation": "SAAG ≥1.1 = portal hypertension (cirrhosis, heart failure, Budd-Chiari); SAAG <1.1 = peritoneal causes (TB, malignancy, pancreatitis, nephrotic). High SAAG + hepatitis → cirrhosis.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A patient with chronic hepatitis C presents with ascites and abdominal pain. Ascitic fluid analysis shows a neutrophil count of 300 cells/mm³. What is the most appropriate management?",
                    "options": [
                        "Systemic antibiotics",
                        "Steroids",
                        "Treat hepatitis C",
                        "Transjugular intrahepatic portosystemic shunt (TIPS)"
                    ],
                    "answer": 0,
                    "explanation": "Ascitic neutrophils ≥250/mm³ = spontaneous bacterial peritonitis → IV cefotaxime + albumin immediately. Ascitic PMN ≥250 → antibiotics (SBP).",
                    "source": "SMLE recall"
                },
                {
                    "q": "A 68-year-old female known to have cirrhosis came with large ascites and no organomegaly. Labs are mostly normal (Hb, platelets, etc). Paracentesis: ascitic fluid WBC 2700 with 75% lymphocytes, protein 3.2 mg/dL, SAAG 1.0. What is the most appropriate investigation?",
                    "options": [
                        "Peritoneal biopsy",
                        "Peritoneal fluid gram stain",
                        "CT abdomen and pelvis",
                        "Adenosine deaminase activity in ascitic fluid"
                    ],
                    "answer": 3,
                    "explanation": "A low SAAG with high-protein, lymphocyte-rich ascites in a cirrhotic points away from portal hypertension and toward peritoneal disease - send adenosine deaminase for tuberculous peritonitis before resorting to biopsy.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A patient with cirrhosis due to hepatitis C has a history of recurrent ascites despite repeated drainage. What is the best dietary advice?",
                    "options": [
                        "Sodium restriction less than 2 g per day",
                        "Fluid restriction less than 2 L per day",
                        "High protein diet restriction",
                        "High fat diet restriction"
                    ],
                    "answer": 0,
                    "explanation": "Sodium restriction is the most impactful dietary intervention for managing cirrhotic ascites, more important than fluid restriction, which is secondary and mainly relevant when significant hyponatremia is present.",
                    "source": "SMLE recall"
                }
            ],
        },
        {
            id: "gi-bleeding-varices",
            title: "03 — Variceal & Upper GI Bleeding",
            title_en: "Resuscitation · Octreotide · Antibiotics · Endoscopy · Prevention",
            summaryHtml: `
<h4 class="deck-topic">Acute variceal bleeding</h4>
<div class="sum-algo">
  <span class="sum-algo-title">Order of actions</span>
  <ol>
    <li><b>Airway</b>: intubate for massive haematemesis, reduced consciousness or aspiration risk.</li>
    <li>Two large-bore lines, cross-match, careful fluids.</li>
    <li><b>Restrictive transfusion</b>: usual threshold Hb 7 g/dL (target about 7–8), higher if clinically needed.</li>
    <li>Start a <b>vasoactive drug</b> (octreotide, terlipressin or somatostatin) before endoscopy.</li>
    <li>Give <b>prophylactic antibiotic</b>, typically ceftriaxone.</li>
    <li><b>Endoscopy within about 12 hours</b> once resuscitated: band ligation for oesophageal varices; tissue glue for gastric fundal varices.</li>
    <li>Failed control: balloon tamponade or stent as a bridge, then <b>TIPS</b>. Early TIPS is considered in selected high-risk patients.</li>
  </ol>
</div>
<ul>
  <li>Antibiotics in a cirrhotic bleeder reduce infection, rebleeding and <b>mortality</b>.</li>
  <li>Do not correct INR routinely with plasma: it adds volume and raises portal pressure.</li>
  <li>Beta blockers are not given during the unstable acute bleed.</li>
</ul>
<h4 class="deck-topic">Prevention</h4>
<ul>
  <li><b>Primary</b> (large or high-risk varices, never bled): a non-selective beta blocker (carvedilol, propranolol, nadolol) <i>or</i> band ligation.</li>
  <li><b>Secondary</b> (after a bleed): non-selective beta blocker <b>plus</b> repeated band ligation until varices are cleared.</li>
</ul>
<h4 class="deck-topic">Isolated gastric varices</h4>
<p>Gastric varices with splenomegaly and <b>normal liver tests</b> suggest splenic vein thrombosis, usually after pancreatic disease (<b>left-sided portal hypertension</b>). Splenectomy treats it when it causes bleeding.</p>
<h4 class="deck-topic">Non-variceal upper GI bleeding</h4>
<ul>
  <li>Peptic ulcer is the commonest cause. A raised urea relative to creatinine supports an upper source.</li>
  <li>Glasgow-Blatchford score helps pick very low-risk patients for outpatient care.</li>
  <li>Resuscitate, then endoscopy within 24 hours. High-risk ulcers (active bleeding, visible vessel) need <b>combined or definitive therapy</b> (clips or thermal, adrenaline not alone), then high-dose PPI.</li>
  <li>Rebleeding: repeat endoscopy; if it fails, embolisation or surgery.</li>
  <li>Test for <i>H. pylori</i> and review NSAIDs and antithrombotics. A negative test during an acute bleed should be repeated.</li>
  <li><b>Mallory-Weiss tear</b>: bleeding after forceful retching, usually settles on its own.</li>
</ul>
<div class="sum-key">
  <span class="sum-key-title">نقاط امتحانية</span>
  <ul>
    <li>Threatened airway comes before drugs and endoscopy.</li>
    <li>Suspected varices: vasoactive drug plus antibiotic early, then band ligation.</li>
    <li>Long-term after variceal bleeding: beta blocker with repeat banding.</li>
    <li>Isolated gastric varices after pancreatitis: splenic vein thrombosis.</li>
  </ul>
</div>
`,
            questions: [
                {
                    "q": "A patient with known liver cirrhosis presents with a large amount of hematemesis. Examination shows a pale, dizzy, and drowsy patient with frothy blood coming from the mouth. What is the appropriate next step in management?",
                    "options": [
                        "Endoscopy",
                        "Octreotide",
                        "Intubation",
                        "IV fluids"
                    ],
                    "answer": 2,
                    "explanation": "A drowsy patient with massive hematemesis is at high risk of airway compromise and aspiration; securing the airway with intubation takes priority over other interventions such as fluid resuscitation, octreotide, or endoscopy, which should follow once the airway is protected.",
                    "source": "SMLE recall"
                },
                {
                    "q": "From the following medications used to treat esophageal varices in vitally unstable (tachycardia and hypotension) patient, which one is improving the mortality:",
                    "options": [
                        "Ceftriaxone",
                        "PPI",
                        "Octreotide",
                        "Packed RBC"
                    ],
                    "answer": 0,
                    "explanation": "In cirrhotic patients with variceal bleeding, prophylactic antibiotics such as ceftriaxone reduce bacterial infection, rebleeding and mortality. Octreotide helps control bleeding but has little proven survival benefit, and proton pump inhibitors do not treat variceal bleeding. Packed red cells are needed for resuscitation, using a restrictive threshold of about 7 g/dL once stable.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A 70-year-old gentleman known to have liver cirrhosis with esophageal varices underwent endoscopic variceal ligation 1 month ago.\nWhich of the following is the best long-term intervention to decrease the risk of recurrent variceal bleeding?",
                    "options": [
                        "B blocker",
                        "H2 blocker",
                        "Proton pump inhibitor",
                        "No further intervention"
                    ],
                    "answer": 0,
                    "explanation": "Core Concept: Esophageal varices develop due to portal hypertension in liver cirrhosis. After an episode of variceal hemorrhage (secondary prophylaxis), long-term reduction of portal pressures is critical to prevent recurrent, potentially fatal bleeding. Clinical Presentation: · Often asymptomatic until rupture, presenting as painless, massive upper gastrointestinal bleeding (hematemesis, melena). · Complications: Hemorrhagic shock, hepatic encephalopathy, aspiration, death. Diagnosis: · First-line tool: Esophagogastroduodenoscopy (EGD) for screening and diagnosis of varices. · Gold standard: EGD is both diagnostic and therapeutic. Hepatic venous pressure gradient (HVPG) measurement via catheterization is the physiological gold standard for portal hypertension. Management: · Acute: Hemodynamic resuscitation, IV octreotide, prophylactic antibiotics, and emergent EGD for band ligation. · Long-term/Definitive: Non-selective beta-blockers (e.g., nadolol, propranolol) are the gold standard for secondary prophylaxis to reduce portal venous inflow and pressure via splanchnic vasoconstriction. Serial EGD with band ligation is also used in combination.",
                    "source": "SMLE bank"
                },
                {
                    "q": "48 years old male patient known with hyperlipidemia with recurrent history of acute pancreatitis for the last 10 years. presented with vomiting blood 1 day ago, all labs are normal, and on examination, the patient had splenomegaly, on radiological examination, esophageal varices are found. What is the diagnosis?",
                    "options": [
                        "Angiodysplasia",
                        "Arteriovenous shunt portal vein",
                        "Left-sided portal hypertension",
                        "Splenic aneurysm"
                    ],
                    "answer": 2,
                    "explanation": "Chronic pancreatitis → splenic vein thrombosis → left-sided (sinistral) portal hypertension with ISOLATED GASTRIC varices, splenomegaly, and NORMAL liver function — cured by splenectomy. Pancreatitis + varices + normal LFTs → sinistral portal hypertension.",
                    "source": "SMLE recall"
                }
            ],
        },
        {
            id: "gi-ibd",
            title: "04 — Inflammatory Bowel Disease",
            title_en: "Crohn vs UC · Acute severe colitis · Fistulae · PSC",
            summaryHtml: `
<div class="deck-block deck-tbl"><table><thead><tr><th>Feature</th><th>Crohn disease</th><th>Ulcerative colitis</th></tr></thead><tbody>
<tr><td><b>Site</b></td><td>Mouth to anus; ileocolonic is common; rectum often spared</td><td>Starts at rectum, spreads upward in continuity</td></tr>
<tr><td><b>Pattern</b></td><td>Skip lesions, deep linear ulcers, cobblestones</td><td>Continuous, friable mucosa, pseudopolyps</td></tr>
<tr><td><b>Histology</b></td><td>Transmural; non-caseating granulomas</td><td>Mucosal; crypt abscesses (not specific)</td></tr>
<tr><td><b>Complications</b></td><td>Strictures, fistulae, perianal disease, B12 deficiency</td><td>Toxic megacolon, colorectal cancer</td></tr>
<tr><td><b>Smoking</b></td><td>Makes it worse</td><td>Associated with lower risk</td></tr>
</tbody></table></div>
<h4 class="deck-topic">Acute severe ulcerative colitis</h4>
<ul>
  <li><b>Truelove and Witts</b>: 6 or more bloody stools a day plus at least one of pulse above 90, temperature above 37.8°C, Hb below 10.5 g/dL, ESR above 30 (many versions also use CRP above 30).</li>
  <li>Admit, correct fluids and potassium, and give <b>IV corticosteroid</b> (methylprednisolone or hydrocortisone).</li>
  <li>Send stool culture and <b>C. difficile</b> test; get an abdominal film; limited flexible sigmoidoscopy can assess severity and CMV.</li>
  <li>Give <b>VTE prophylaxis</b> even with bloody stool. Avoid opioids and antimotility drugs.</li>
  <li>Reassess around <b>day 3</b>: poor response needs infliximab or ciclosporin, with early surgical review.</li>
  <li>Toxic megacolon failing medical care, perforation or massive bleeding: colectomy.</li>
</ul>
<h4 class="deck-topic">Other management points</h4>
<ul>
  <li>Mild to moderate UC: <b>5-ASA</b> (topical for distal disease, plus oral if more extensive).</li>
  <li><i>C. difficile</i> on top of IBD: <b>oral vancomycin</b> (fidaxomicin is an alternative in suitable cases).</li>
  <li><b>Perianal Crohn</b>: MRI and surgical assessment; <b>drain any abscess</b> first (seton if needed), then anti-TNF such as <b>infliximab</b>, often with antibiotics.</li>
  <li>Before biologics screen for latent TB and hepatitis B. Steroids induce remission but are not maintenance drugs. Check TPMT before azathioprine.</li>
</ul>
<h4 class="deck-topic">Beyond the bowel</h4>
<ul>
  <li>Erythema nodosum, peripheral large-joint arthritis and episcleritis often follow bowel activity. PSC and axial arthritis run independently.</li>
  <li><b>PSC</b>: cholestatic enzymes, pruritus, MRCP with multifocal strictures and beading. It raises the risk of cholangiocarcinoma and colorectal cancer; with IBD, colonoscopy surveillance starts at PSC diagnosis and is usually yearly.</li>
</ul>
<div class="sum-key">
  <span class="sum-key-title">نقاط امتحانية</span>
  <ul>
    <li>Skip lesions and granulomas = Crohn disease.</li>
    <li>Acute severe UC: IV steroids, then rescue therapy if no response.</li>
    <li>UC with high alkaline phosphatase: think PSC and order MRCP.</li>
    <li>Control perianal sepsis before immunosuppression.</li>
  </ul>
</div>
`,
            questions: [
                {
                    "q": "A patient with a history of ulcerative colitis (UC) presents with severe abdominal pain, high-grade fever, and 7–8 episodes of bloody diarrhea per day. Laboratory tests show elevated inflammatory markers (ESR/CRP) and leukocytosis. What is the next best step in management?",
                    "options": [
                        "Sulfasalazine",
                        "Oral prednisolone",
                        "IV methylprednisolone"
                    ],
                    "answer": 2,
                    "explanation": "At least 6 bloody stools a day with fever, leukocytosis and high inflammatory markers is acute severe ulcerative colitis. Admit and give IV corticosteroids such as methylprednisolone, with VTE prophylaxis and testing for infection. Oral drugs are inadequate; failure after a few days calls for rescue therapy or surgery.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A patient with known ulcerative colitis develops Clostridioides difficile infection. How should this be managed?",
                    "options": [
                        "Oral vancomycin",
                        "IV cefuroxime",
                        "IV metronidazole"
                    ],
                    "answer": 0,
                    "explanation": "Oral vancomycin, or fidaxomicin, is now preferred first-line treatment for C. difficile infection over metronidazole, since it achieves higher colonic concentrations and has been shown to have better clinical outcomes and lower recurrence rates.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A 32-year-old man with ileocolonic Crohn's disease, on steroids and mesalamine for 3 months, develops perianal pain and discharge for 3 weeks. His abdominal symptoms are well controlled. Examination shows 2 perianal fistulas, and MRI pelvis confirms perianal fistulae. Which of the following is the best next step in management?",
                    "options": [
                        "Methotrexate",
                        "Azathioprine",
                        "Budesonide",
                        "Infliximab"
                    ],
                    "answer": 3,
                    "explanation": "Infliximab, and other anti-TNF biologics, is the treatment of choice for perianal fistulizing Crohn's disease, since it is particularly effective at promoting fistula healing, unlike methotrexate, azathioprine, or budesonide.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A patient presents with weight loss and diarrhea, sometimes with blood. Colonoscopy shows linear ulcers, stricture, and segmental involvement with alternating normal and inflamed mucosa. What is the diagnosis?",
                    "options": [
                        "Crohn's disease",
                        "Ulcerative colitis",
                        "Irritable bowel syndrome"
                    ],
                    "answer": 0,
                    "explanation": "Segmental involvement with skip lesions, linear ulcers, and strictures are classic endoscopic features of Crohn's disease, distinguishing it from ulcerative colitis, which characteristically causes continuous inflammation starting from the rectum without skip areas.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A 35-year-old man with a 7-year history of ulcerative colitis. presented with insidious onset of progressive fatigue, pruritus and jaundice. He underwent MRCP, which demonstrates multiple short strictures of biliary tree at both intrahepatic and extrahepatic ducts (see lab results). Test Result Normal Values Alkaline phosphatase 785 39-117 IU/L Alanine aminotransferase 60 5-40 IU/L Aspartate aminotransferase 40 12-40 IU/L Creatinine kinase 34 24-170 IU/L (Female) 24-195 IU/L (Male) Which of the following is the most likely diagnosis?",
                    "options": [
                        "Liver cirrhosis",
                        "Bile duct atresia",
                        "Primary biliary cholangitis",
                        "Primary sclerosing cholangitis"
                    ],
                    "answer": 3,
                    "explanation": "PSC = UC + cholestasis + 'beaded' multifocal strictures on MRCP. p-ANCA often positive. Risk of cholangiocarcinoma. PBC = middle-aged women + AMA + intrahepatic only.",
                    "source": "SMLE recall"
                }
            ],
        },
        {
            id: "gi-pancreatitis",
            title: "05 — Pancreatitis & Its Complications",
            title_en: "Diagnosis · Fluids · Collections · Chronic pancreatitis",
            summaryHtml: `
<h4 class="deck-topic">Acute pancreatitis</h4>
<ul>
  <li><b>Diagnosis needs 2 of 3</b>: typical epigastric pain (often to the back), amylase or lipase at least 3 times the upper limit, and imaging findings.</li>
  <li>Lipase is more specific. The height of the enzyme does not measure severity.</li>
  <li>Causes: <b>gallstones</b> and alcohol first; then high triglycerides (usually above 1000 mg/dL), hypercalcaemia, post-ERCP, drugs, trauma.</li>
  <li>First imaging: <b>ultrasound</b> for gallstones. CT is not needed at once if the diagnosis is clear; use it for doubt, or after 48–72 hours if not improving.</li>
</ul>
<h4 class="deck-topic">Early care</h4>
<ul>
  <li><b>Goal-directed IV fluid</b>, lactated Ringer preferred, with frequent reassessment. Overly aggressive volumes can harm. Avoid Ringer if hypercalcaemia is the cause.</li>
  <li>Analgesia, then <b>early oral feeding</b> as tolerated; use enteral rather than parenteral nutrition if needed.</li>
  <li><b>No prophylactic antibiotics</b>.</li>
  <li>Urgent ERCP for <b>cholangitis</b>; consider it for persistent biliary obstruction. Mild gallstone pancreatitis: cholecystectomy in the same admission.</li>
  <li><b>Severe</b> disease = organ failure lasting more than 48 hours.</li>
</ul>
<h4 class="deck-topic">Collections</h4>
<div class="deck-block deck-tbl"><table><thead><tr><th>Content</th><th>First 4 weeks</th><th>After about 4 weeks</th></tr></thead><tbody>
<tr><td><b>Fluid only</b></td><td>Acute fluid collection</td><td>Pseudocyst</td></tr>
<tr><td><b>With necrosis</b></td><td>Acute necrotic collection</td><td>Walled-off necrosis</td></tr>
</tbody></table></div>
<ul>
  <li>No or mild symptoms and no complication: <b>observe</b>; size alone is not an indication to drain.</li>
  <li>Persistent significant symptoms, obstruction or infection: drain, usually endoscopically once the wall is mature.</li>
  <li>New mass or pain after recent pancreatitis: define the collection with <b>contrast CT</b>.</li>
  <li>Infected necrosis (fever, gas on CT): antibiotics that penetrate necrosis, then delayed step-up drainage.</li>
</ul>
<h4 class="deck-topic">Chronic pancreatitis</h4>
<ul>
  <li>Recurrent or constant pain, often with alcohol and smoking; enzymes may be near normal.</li>
  <li>Late features: <b>steatorrhoea</b>, weight loss and diabetes. CT shows calcification, duct dilatation or atrophy; faecal elastase is low.</li>
  <li>Stop alcohol and smoking, analgesia, <b>pancreatic enzyme replacement with meals</b>, replace fat-soluble vitamins. Watch for pancreatic cancer.</li>
</ul>
<div class="sum-key">
  <span class="sum-key-title">نقاط امتحانية</span>
  <ul>
    <li>Two of three criteria make the diagnosis.</li>
    <li>Fluids, analgesia and early feeding; no routine antibiotics.</li>
    <li>A quiet collection is watched, whatever its size.</li>
    <li>Alcohol with repeated pain and mildly raised amylase: chronic pancreatitis.</li>
  </ul>
</div>
`,
            questions: [
                {
                    "q": "Patient diagnosed with acute pancreatitis 3 weeks ago, now present to ER Complain of mild abdominal pain and tenderness, showed cyst measure 4 cm. How you will manage?",
                    "options": [
                        "Observation",
                        "Internal drainage",
                        "External drainage",
                        "Surgical remove"
                    ],
                    "answer": 0,
                    "explanation": "A small (<6 cm), mildly symptomatic pancreatic pseudocyst is observed (most resolve); drain if large/persistent/complicated. Small pancreatic pseudocyst → observation.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A patient who had pancreatitis was discharged from hospital two weeks ago and returned today with an epigastric mass and abdominal pain. Ultrasound shows free fluid around the pancreas. What is the next step?",
                    "options": [
                        "CT",
                        "Laparotomy",
                        "Antibiotics",
                        "Drainage"
                    ],
                    "answer": 0,
                    "explanation": "A mass appearing weeks after pancreatitis is a pseudocyst; characterise it with contrast CT before any drainage, because immature collections often resolve and a pseudoaneurysm must never be punctured.",
                    "source": "SMLE recall"
                },
                {
                    "q": "An alcoholic patient has recurrent epigastric pain with multiple admissions and a mildly elevated amylase. What is the most likely diagnosis?",
                    "options": [
                        "Biliary colic",
                        "Chronic pancreatitis",
                        "Acute cholecystitis"
                    ],
                    "answer": 1,
                    "explanation": "CHRONIC PANCREATITIS: recurrent epigastric pain radiating to the back, alcohol in most cases, amylase and lipase only MILDLY raised or NORMAL (the acinar tissue is gone). Late features are steatorrhoea and diabetes. Diagnose on CT or MRCP showing calcification, a dilated duct and atrophy - not on enzymes. Treat with alcohol cessation, analgesia, PANCREATIC ENZYME REPLACEMENT and fat-soluble vitamins.",
                    "source": "SMLE recall"
                }
            ],
        },
        {
            id: "gi-esophagus-stomach",
            title: "06 — Oesophagus & Stomach",
            title_en: "GERD · Barrett · H. pylori · Dysphagia · Perforation",
            summaryHtml: `
<h4 class="deck-topic">Reflux disease</h4>
<ul>
  <li>Typical symptoms and no alarm features: trial of a <b>PPI before a meal</b> for about 8 weeks, plus weight loss and head-of-bed elevation.</li>
  <li><b>Alarm features</b> need endoscopy: dysphagia, weight loss, bleeding or iron deficiency, persistent vomiting, mass, or new symptoms at older age.</li>
  <li>Refractory symptoms: check adherence and timing, optimise the PPI, endoscopy; if normal, <b>reflux (pH-impedance) monitoring</b>.</li>
  <li><b>Barrett oesophagus</b> (intestinal metaplasia) is the key precursor of adenocarcinoma. Keep a PPI; surveillance interval depends on length and dysplasia. Confirm dysplasia by expert pathology; high-grade dysplasia is treated endoscopically, and low-grade is treated or closely watched.</li>
</ul>
<h4 class="deck-topic">Dyspepsia and H. pylori</h4>
<ul>
  <li>Younger patient without alarm features: <b>test and treat</b>. Age cut-offs for direct endoscopy vary (often 60).</li>
  <li><b>Urea breath test</b> or stool antigen diagnose and confirm cure. Stop PPI for 2 weeks and antibiotics or bismuth for 4 weeks first.</li>
  <li>With unknown resistance, <b>bismuth quadruple therapy for 14 days</b> is preferred in current guidance. Clarithromycin triple therapy is best kept for proven susceptibility.</li>
  <li>Always confirm eradication, at least 4 weeks after treatment. A gastric ulcer needs biopsy and follow-up.</li>
</ul>
<h4 class="deck-topic">Dysphagia</h4>
<div class="deck-cards">
  <div class="deck-card diag"><div class="deck-card-h">Solids then liquids</div><ul><li>Mechanical narrowing</li><li>Older age with weight loss: <b>oesophageal cancer</b></li><li>Endoscopy with biopsy</li></ul></div>
  <div class="deck-card diag"><div class="deck-card-h">Solids and liquids from the start</div><ul><li>Motility disorder</li><li><b>Achalasia</b>: regurgitation, bird-beak barium swallow</li><li>Manometry confirms; endoscopy excludes a mimicking tumour</li></ul></div>
  <div class="deck-card clin"><div class="deck-card-h">Young, atopic, food impaction</div><ul><li><b>Eosinophilic oesophagitis</b></li><li>Biopsy: 15 or more eosinophils per high-power field</li><li>PPI, topical steroid or elimination diet</li></ul></div>
</div>
<ul>
  <li>Achalasia treatment: <b>pneumatic dilatation</b>, Heller myotomy or POEM; botulinum toxin for frail patients.</li>
</ul>
<h4 class="deck-topic">Perforation</h4>
<ul>
  <li>Chest pain, fever, voice change or surgical emphysema <b>after dilatation or vomiting</b>: oesophageal perforation. Use water-soluble contrast study or CT.</li>
  <li>Sudden epigastric pain with peritonism: perforated ulcer. First film is an <b>erect chest X-ray</b>; CT if it is negative and suspicion remains. Do not do endoscopy.</li>
</ul>
<div class="sum-key">
  <span class="sum-key-title">نقاط امتحانية</span>
  <ul>
    <li>Normal endoscopy with refractory heartburn: pH-impedance monitoring.</li>
    <li>Progressive dysphagia with weight loss: exclude cancer.</li>
    <li>Confirm H. pylori cure with a breath or stool test, not serology.</li>
    <li>Peritonism after sudden pain: erect chest film.</li>
  </ul>
</div>
`,
            questions: [
                {
                    "q": "A 45-year-old man with a diagnosis of gastroesophageal reflux disease who is taking a maximum dose of pantoprazole for several weeks presents to the clinic with heartburn that is minimally improved with treatment. The patient verified that he is taking the medication 30 minutes before meals. He takes no other medications. His physical examination is unremarkable. Upper endoscopy findings are normal. Which of the following is the most appropriate next step in the management?",
                    "options": [
                        "Repeat endoscopy",
                        "Barium esophagogram",
                        "Esophageal manometry",
                        "Ambulatory pH impedance monitoring"
                    ],
                    "answer": 3,
                    "explanation": "Core Concept: Refractory GERD symptoms despite maximal PPI therapy and a normal endoscopy require objective evidence of acid or non-acid reflux before considering anti-reflux surgery or diagnosing functional heartburn. Clinical Presentation: · Persistent heartburn and regurgitation despite compliance with BID PPI therapy. Diagnosis: · First-line tool: Upper endoscopy to rule out erosive esophagitis, strictures, or Barrett's esophagus. · Gold standard: Ambulatory pH impedance monitoring (off or on PPI) to correlate symptoms with acidic or non-acidic reflux events. Management: · Acute: Diagnostic testing to confirm the presence of pathological reflux. · Long-term/Definitive: If true refractory reflux is confirmed, consider surgical (fundoplication) or endoscopic interventions. If pH monitoring is normal, diagnose functional heartburn and treat with neuromodulators (e.g., TCAs).",
                    "source": "SMLE bank"
                },
                {
                    "q": "A 30 years old male with 4 month epigastric pain worse after meal No family history of gastric and esophageal cancer. BMI 35 What is the next step?",
                    "options": [
                        "H.pylori testing",
                        "Endoscopy",
                        "Abdominal CT",
                        "Barium"
                    ],
                    "answer": 0,
                    "explanation": "Dyspepsia workup: <50yr + no alarm features = test-and-treat H. pylori. Alarm features ('VBAD'): Vomiting persistent, Bleeding (haematemesis/melaena), Anaemia, Dysphagia/odynophagia/weight loss → endoscopy.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A patient with progressive dysphagia is diagnosed with achalasia. What is the most appropriate management?",
                    "options": [
                        "Pneumatic dilatation",
                        "Calcium channel blocker"
                    ],
                    "answer": 0,
                    "explanation": "Achalasia: absent peristalsis with failure of lower oesophageal sphincter relaxation ('bird-beak' on barium). Definitive treatment = pneumatic dilatation, Heller myotomy or POEM. Drugs/botox are for the unfit.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A 62-year-old woman presents with dysphagia. Her symptoms were first noticed a few months ago and have steadily worsened. Initially she had difficulty swallowing solids but over recent weeks has also been having difficulty swallowing liquids. She lost 5 Kg over 5 weeks. On examination, she looks thin and slightly pale. Which of the following is the most likely diagnosis?",
                    "options": [
                        "Achalasia",
                        "Pharyngeal pouch",
                        "Oesophageal cancer",
                        "Gastro-oesophageal reflux disease"
                    ],
                    "answer": 2,
                    "explanation": "Core Concept: Esophageal carcinoma (typically adenocarcinoma or squamous cell carcinoma). Clinical Presentation: · Progressive dysphagia (classically starting with solids and progressing to liquids as the lumen narrows), significant unintentional weight loss, and anemia (pallor from chronic occult bleeding). · Complications: Complete esophageal obstruction, malnutrition, fistula formation, and metastasis. Diagnosis: · First-line: Barium swallow (showing stricture, 'apple-core' lesion, or mass). · Gold standard: Upper GI endoscopy (EGD) with biopsy for histopathological confirmation. Endoscopic ultrasound (EUS) for T-staging, and CT/PET for M-staging. Management: · Acute: Nutritional support (enteral feeding tube or stenting if severe dysphagia). · Long-term/Definitive: Multimodal therapy including neoadjuvant chemoradiation followed by surgical esophagectomy for localized disease, or palliative stenting/chemotherapy for advanced/metastatic disease.",
                    "source": "SMLE bank"
                },
                {
                    "q": "A 32-year-old man presented to the Emergency Department with a 6-hour history of severe, sudden epigastric pain. Physical examination confirmed diffuse severe abdominal tenderness with sluggish bowel sounds (peritonism). WBC 13.8 (high), Amylase 300 (mildly raised). Which of the following is the most appropriate next step in management?",
                    "options": [
                        "Erect chest X-ray",
                        "Abdominal X ray",
                        "CT scan abdomen",
                        "Ultrasound abdomen"
                    ],
                    "answer": 0,
                    "explanation": "Perforated peptic ulcer/viscus: sudden severe pain + peritonitis (rigid abdomen, rebound, sluggish/absent bowel sounds) + leukocytosis. First investigation: ERECT CHEST X-RAY → free air under the diaphragm (pneumoperitoneum). CT abdomen if CXR equivocal (more sensitive). Note: amylase can be mildly raised in perforation (not only pancreatitis). Mx: resuscitate, IV fluids, NG tube, IV antibiotics, analgesia, urgent SURGERY.",
                    "source": "SMLE recall"
                }
            ],
        },
        {
            id: "gi-diarrhoea-coeliac",
            title: "07 — Diarrhoea, Coeliac Disease & IBS",
            title_en: "tTG testing · Gluten · Rome criteria · Travel diarrhoea",
            summaryHtml: `
<h4 class="deck-topic">Coeliac disease</h4>
<ul>
  <li>Clues: chronic diarrhoea or bloating, <b>iron deficiency</b>, low folate, low calcium or bone disease, mildly raised transaminases, family history, type 1 diabetes, Down syndrome.</li>
  <li><b>Dermatitis herpetiformis</b>: itchy vesicles on elbows and knees; strongly linked.</li>
  <li>First test: <b>tissue transglutaminase IgA with total IgA</b>. If IgA deficient, use IgG-based tests.</li>
  <li>Adults: confirm with <b>duodenal biopsy</b>: villous atrophy, crypt hyperplasia, increased intraepithelial lymphocytes.</li>
  <li>All tests must be done <b>while eating gluten</b>. Someone already gluten-free needs a gluten challenge. HLA DQ2 and DQ8 negative makes the disease very unlikely.</li>
  <li>Treatment: lifelong avoidance of <b>wheat, barley and rye</b>. Check iron, folate, vitamin D and bone health.</li>
  <li>Follow antibodies to assess response and adherence. Persistent symptoms: first look for hidden gluten; think of refractory disease or lymphoma if truly adherent.</li>
</ul>
<h4 class="deck-topic">Irritable bowel syndrome</h4>
<ul>
  <li><b>Rome IV</b>: recurrent abdominal pain on average at least 1 day a week in the last 3 months, onset at least 6 months ago, with 2 of: related to defecation, change in frequency, change in stool form.</li>
  <li>No alarm features: night symptoms, bleeding, anaemia, weight loss, late onset, family history of colon cancer or IBD.</li>
  <li>In diarrhoea-type symptoms screen for coeliac disease; faecal calprotectin helps exclude IBD.</li>
  <li>Explain, soluble fibre, diet advice (low-FODMAP trial), then symptom-directed drugs.</li>
</ul>
<h4 class="deck-topic">Infective diarrhoea</h4>
<ul>
  <li>Most acute cases need <b>oral rehydration</b> only.</li>
  <li><b>Giardia</b>: prolonged watery, greasy stool with bloating after travel or unsafe water. One stool sample can miss it; use antigen or PCR. Treat with tinidazole or metronidazole.</li>
  <li><b>Amoebic colitis</b>: bloody stool; metronidazole followed by a luminal agent.</li>
  <li><b>Campylobacter</b>: bloody diarrhoea, linked with Guillain-Barré and reactive arthritis. Azithromycin when treatment is needed.</li>
  <li>Suspected Shiga toxin <i>E. coli</i>: avoid antibiotics and antimotility drugs (haemolytic uraemic syndrome).</li>
  <li><b>Travel</b>: advise safe water, no ice, hot cooked food and hand hygiene. Routine antibiotic prophylaxis is <b>not recommended</b>.</li>
</ul>
<div class="sum-key">
  <span class="sum-key-title">نقاط امتحانية</span>
  <ul>
    <li>Never diagnose coeliac disease on a gluten-free diet.</li>
    <li>Itchy elbow rash with bloating and anaemia: coeliac disease.</li>
    <li>IBS is a positive diagnosis only when alarm features are absent.</li>
    <li>Traveller prophylaxis: hygiene advice, not routine antibiotics.</li>
  </ul>
</div>
`,
            questions: [
                {
                    "q": "A 21-year-old patient presents with a 4-month history of itchy rash over the elbows, abdominal bloating, and diarrhea. He has a cousin with similar symptoms. Endoscopy reveals multiple duodenal erosions with scalloping in the first and second parts of the duodenum. Duodenal biopsy shows subtotal villous atrophy. Lab results show anemia (Hb 10.9), low calcium (1.9 mmol/L), and elevated liver enzymes. Ileocolonoscopy is normal. What is the best treatment option?",
                    "options": [
                        "Oral steroid",
                        "IV pantoprazole",
                        "Start gluten-free diet",
                        "Oral iron tablets and repeat endoscopy in 3 months"
                    ],
                    "answer": 2,
                    "explanation": "Coeliac disease: gluten-sensitive enteropathy — diarrhoea/bloating, malabsorption (anaemia, low calcium/vitamins), DERMATITIS HERPETIFORMIS (itchy extensor/elbow rash), family history. Duodenal biopsy = villous atrophy + crypt hyperplasia + scalloping; anti-tTG/anti-endomysial antibodies. Treatment = strict lifelong GLUTEN-FREE DIET (wheat, barley, rye) — heals villi, resolves symptoms + dermatitis herpetiformis (± dapsone for the rash). Complications: osteoporosis, T-cell lymphoma.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A 28-year-old woman comes to the clinic for a check-up. She believes that she is allergic to wheat; her symptoms of abdominal bloating and loose stool have improved over the past few months by eating a gluten-free diet. Which of the following is the most appropriate advice to her?",
                    "options": [
                        "Dietician referral",
                        "Gastroenterology referral",
                        "No need to Continue on gluten-free diet",
                        "Resume eating gluten, bloods for celiac screen"
                    ],
                    "answer": 3,
                    "explanation": "Core Concept: The diagnosis of celiac disease relies on the detection of specific autoantibodies (e.g., tTG IgA) and characteristic duodenal histopathology (villous atrophy). These markers normalize when gluten is removed from the diet, leading to false-negative results if the patient is already on a gluten-free diet. Clinical Presentation: · Classic symptoms: Chronic diarrhea, bloating, weight loss, fatigue, and iron deficiency anemia. · Complications: Malnutrition, osteoporosis, and increased risk of GI lymphomas. Diagnosis: · Diagnostic algorithm: Patients must be on a gluten-containing diet for accurate testing. If they have already started a gluten-free diet (GFD), they must undergo a \"gluten challenge.\" · First-line diagnostic plan: Serology (IgA tTG and total IgA) while consuming gluten. · Gold standard: Upper GI endoscopy with multiple duodenal biopsies showing villous atrophy, crypt hyperplasia, and intraepithelial lymphocytosis. Management: · Acute management: Advise the patient to resume eating gluten daily for at least 6 weeks (gluten challenge) prior to serological testing and endoscopy to avoid a false-negative diagnosis. · Long-term/Definitive management: If testing confirms celiac disease, strict lifelong adherence to a gluten-free diet is required. If negative, alternative diagnoses (e.g., non-celiac gluten sensitivity, IBS) can be explored.",
                    "source": "SMLE bank"
                },
                {
                    "q": "A 22-year-old woman with chronic diarrhea and malabsorption is suspected of having celiac disease, a jejunal biopsy taken. Which of the following histological finding is expected?",
                    "options": [
                        "Flattened crypts",
                        "Subtotal villous atrophy",
                        "Epithelial cells with fat globules",
                        "Fissures and ulcers penetrating into submucosa"
                    ],
                    "answer": 1,
                    "explanation": "Core Concept: Celiac disease is an autoimmune enteropathy triggered by gluten ingestion in genetically susceptible individuals, leading to small intestinal mucosal damage and malabsorption. Clinical Presentation: · Chronic diarrhea, weight loss, bloating, fatigue, iron deficiency anemia, and dermatitis herpetiformis. · Complications: Osteoporosis, infertility, and enteropathy-associated T-cell lymphoma. Diagnosis: · First-line: Serology (IgA anti-tissue transglutaminase and total IgA). · Gold Standard: Duodenal/jejunal biopsy showing intraepithelial lymphocytosis, crypt hyperplasia, and villous atrophy (partial, subtotal, or total). Management: · Acute: Nutritional repletion (iron, calcium, vitamins). · Long-term: Strict, lifelong gluten-free diet.",
                    "source": "SMLE bank"
                },
                {
                    "q": "A traveller is planning to travel and asks about prophylaxis for traveller's diarrhoea. Which of the following is the most appropriate option?",
                    "options": [
                        "Bismuth subsalicylate",
                        "Fluoroquinolone",
                        "No medication",
                        "Probiotics"
                    ],
                    "answer": 2,
                    "explanation": "Traveller's diarrhoea: do NOT give routine antibiotic prophylaxis (resistance, ESBL colonisation, C. difficile, adverse effects). Advise food/water hygiene + ORAL REHYDRATION + a STANDBY antibiotic to self-treat if it occurs (azithromycin for South/Southeast Asia - Campylobacter resists fluoroquinolones). Reserve prophylaxis for the immunosuppressed or high-stakes travel.",
                    "source": "SMLE recall"
                }
            ],
        },
        {
            id: "gi-liver-diseases",
            title: "08 — Jaundice & Specific Liver Diseases",
            title_en: "Patterns · Paracetamol · Autoimmune · Metabolic",
            summaryHtml: `
<h4 class="deck-topic">Pattern first</h4>
<ul>
  <li><b>Hepatocellular</b>: ALT and AST dominate. Values in the thousands suggest viral, drug or toxin, or ischaemic injury.</li>
  <li><b>AST:ALT of 2 or more</b> with modest values suggests alcohol.</li>
  <li><b>Cholestatic</b>: ALP and GGT dominate. Ultrasound first to look for dilated ducts.</li>
  <li><b>Gilbert syndrome</b>: mild isolated unconjugated bilirubin rising with illness or fasting; normal enzymes and no haemolysis. Reassure.</li>
  <li><b>INR</b> shows synthetic function. Raised INR with encephalopathy in a liver without known chronic disease = acute liver failure: contact a transplant centre.</li>
</ul>
<h4 class="deck-topic">Paracetamol injury</h4>
<ul>
  <li>Single timed ingestion: measure the level from <b>4 hours</b> and plot it on the nomogram.</li>
  <li>Give <b>N-acetylcysteine</b> if above the treatment line, and without waiting if the result will be late, or with liver injury after excess intake. Staggered or unknown timing is not suited to the nomogram.</li>
  <li>It still helps when liver injury is already present. Existing liver disease and alcohol lower the safety margin.</li>
</ul>
<div class="deck-block deck-tbl"><table><thead><tr><th>Disease</th><th>Clues</th><th>Treatment</th></tr></thead><tbody>
<tr><td><b>Autoimmune hepatitis</b></td><td>ANA, anti-smooth muscle, high IgG; biopsy shows interface hepatitis</td><td>Steroid, usually with azathioprine</td></tr>
<tr><td><b>Primary biliary cholangitis</b></td><td>Middle-aged woman, itch, high ALP, antimitochondrial antibody</td><td>Ursodeoxycholic acid</td></tr>
<tr><td><b>Primary sclerosing cholangitis</b></td><td>Man with UC, beaded ducts on MRCP</td><td>Monitor, treat strictures, transplant</td></tr>
<tr><td><b>Wilson disease</b></td><td>Young; liver plus tremor or psychiatric signs; low ceruloplasmin, high 24-hour urine copper, Kayser-Fleischer rings</td><td>Chelator (penicillamine or trientine) or zinc</td></tr>
<tr><td><b>Haemochromatosis</b></td><td>Pigmentation, diabetes, arthropathy; high ferritin and transferrin saturation; HFE testing</td><td>Venesection; screen relatives</td></tr>
</tbody></table></div>
<ul>
  <li>In Wilson disease, penicillamine can <b>worsen neurological signs</b> at the start, so many specialists prefer another agent for neurological presentations. Fulminant failure needs transplant.</li>
  <li><b>Fatty liver disease</b> (now called MASLD): linked with obesity and diabetes; weight loss is central, and fibrosis stage decides prognosis.</li>
  <li><b>Alpha-1 antitrypsin deficiency</b>: liver disease with early emphysema.</li>
</ul>
<div class="sum-key">
  <span class="sum-key-title">نقاط امتحانية</span>
  <ul>
    <li>Positive autoantibodies with hepatitis: biopsy confirms autoimmune hepatitis.</li>
    <li>Young patient with liver and movement signs: test for Wilson disease.</li>
    <li>Isolated indirect bilirubin after a viral illness, normal blood film: Gilbert.</li>
    <li>Paracetamol liver injury: give N-acetylcysteine even if late.</li>
  </ul>
</div>
`,
            questions: [
                {
                    "q": "A 32-year-old woman presents with dark urine and jaundice, denying any history of travel or alcohol use. She has right upper quadrant tenderness and scleral icterus. ANA and anti-smooth-muscle antibodies are positive; anti-GAD and anti-ICA are negative. Bilirubin is 85, AST 900 with a markedly raised ALT, and ALP 135. What is the next best step to confirm the diagnosis?",
                    "options": [
                        "Liver biopsy",
                        "Mri and mrcp to identify the biliary obstruction",
                        "24 hour urine copper",
                        "Alpha fetoprotein"
                    ],
                    "answer": 0,
                    "explanation": "Autoimmune hepatitis: ANA/ASMA positive, hepatitic enzymes, confirmed by biopsy showing interface hepatitis.",
                    "source": "SMLE recall"
                },
                {
                    "q": "An 18-year-old girl brought by her parents to the Gastroenterology Clinic as they noticed her to have a fine tremor of both hands. Further examination showed jaundice and just palpable spleen. Copper low, Direct bilirubin 22.32, Total bilirubin 38.2, AST 243, ALT 165, Albumin 23, Serum ceruloplasmin Low, 24 hours urine copper High. Which of the following is the most appropriate treatment?",
                    "options": [
                        "Corticosteroid",
                        "D-penicillamine",
                        "Desferrioxamine",
                        "Ursodeoxycholic acid"
                    ],
                    "answer": 1,
                    "explanation": "Core Concept: Wilson's Disease, an autosomal recessive disorder of copper metabolism. Clinical Presentation: Hepatic involvement (jaundice, cirrhosis), neurological symptoms (tremor), and Kayser-Fleischer rings. Diagnosis: Low serum ceruloplasmin and elevated 24-hour urinary copper. Gold standard is liver biopsy showing elevated hepatic copper or ATP7B genetic testing. Management: Copper chelation therapy is the gold standard medical treatment. D-penicillamine or Trientine are first-line oral chelators that promote urinary copper excretion. Oral zinc therapy is also used to interfere with intestinal copper absorption.",
                    "source": "SMLE bank"
                },
                {
                    "q": "A 29-year-old man presented with painless jaundice after resolution of upper respiratory tract viral infection, otherwise he is asymptomatic. Clinical abdominal examination is unremarkable. Peripheral blood smear is normal (see lab results). Test Result Normal Values RBC 5.1 4.7-6.1 x 1012/L (Male) 4.2-5.4 x 1012/L. (Female) Hb 133 130-170 g/L. (Male) 120-160 g/L (Female) MCV 88 80-95 fl Reticulocyte 0.21 0.2-1.2 % Platelets count 220 150-400 x 109/L WBC 5.2 4.5-10.5 x 109/L Alkaline phosphatase 41 39-117 1U/L Alanine aminotransferase 12 5-40 IU/L Aspartate aminotransferase 20 12-40 IU/L Indirect bilirubin 18 3.2-12.1 mol/L Direct bilirubin 1.51 1.5-6.5 mol/L Total bilirubin 19.51 3.5-16.5 mol/L HCT 0.44 0.42-0.52 (Male) 0.37-0.48 (Female) Which of the following is the most likely cause of his jaundice?",
                    "options": [
                        "Hemolytic anemia",
                        "Fatty liver disease",
                        "Gilbert syndrome",
                        "Common bile duct obstruction"
                    ],
                    "answer": 2,
                    "explanation": "Core Concept: Gilbert syndrome, a benign, autosomal recessive condition characterized by mildly decreased UDP-glucuronosyltransferase (UGT1A1) activity. Clinical Presentation: · Mild, intermittent, unconjugated (indirect) hyperbilirubinemia that is often triggered by stress, fasting, illness (e.g., viral URI), or physical exertion. Patients are otherwise asymptomatic with normal liver enzymes and no hemolysis (normal smear, normal reticulocytes). · Complications: None; it is a benign condition. Diagnosis: · First-line: Liver function tests showing isolated elevated indirect bilirubin with normal AST, ALT, ALP, and normal CBC/smear. Management: · Long-term: Reassurance. Gilbert syndrome requires no treatment, dietary restrictions, or follow-up.",
                    "source": "SMLE bank"
                },
                {
                    "q": "A patient with known chronic hepatitis B complains of fatigue, altered level of consciousness, and jaundice for 2 days after using excessive amounts of paracetamol for knee pain. Labs show high ALT/AST and INR of 2. What is the most appropriate management?",
                    "options": [
                        "IV corticosteroid",
                        "Acetylcysteine",
                        "Entecavir to treat acute hepatitis B",
                        "Plasmapheresis with penicillamine"
                    ],
                    "answer": 1,
                    "explanation": "N-acetylcysteine is the specific antidote for acetaminophen-induced hepatotoxicity, which is clearly the acute cause here given the explicit history of excessive paracetamol use, regardless of the underlying chronic hepatitis B comorbidity.",
                    "source": "SMLE recall"
                }
            ],
        },
        {
            id: "gi-liver-masses",
            title: "09 — Liver Cancer & Liver Abscess",
            title_en: "HCC surveillance · Staging · Amoebic vs pyogenic · Hydatid",
            summaryHtml: `
<h4 class="deck-topic">Hepatocellular carcinoma</h4>
<ul>
  <li>Main risks: cirrhosis of any cause, chronic HBV (even without cirrhosis), HCV, alcohol, fatty liver disease.</li>
  <li><b>Surveillance</b>: <b>ultrasound every 6 months</b>, with or without AFP. In HCV cirrhosis it <b>continues after viral cure</b>.</li>
  <li>New nodule: multiphase CT or MRI. In an at-risk liver, <b>arterial enhancement with washout</b> in a lesion of 1 cm or more can diagnose HCC without biopsy.</li>
  <li>AFP can be normal.</li>
</ul>
<h4 class="deck-topic">Choosing treatment</h4>
<p>Depends on tumour burden, liver function, portal hypertension and performance status (BCLC approach). Decide in a multidisciplinary team.</p>
<div class="deck-block deck-tbl"><table><thead><tr><th>Situation</th><th>Usual option</th></tr></thead><tbody>
<tr><td>Single tumour, preserved function, no significant portal hypertension</td><td>Resection</td></tr>
<tr><td>Within Milan criteria (one up to 5 cm, or up to 3 each 3 cm or less), unfit to resect</td><td>Transplant</td></tr>
<tr><td>Very small or early tumour, not for surgery</td><td>Ablation</td></tr>
<tr><td>Multinodular, no vascular invasion or spread, adequate function</td><td>Transarterial chemoembolisation</td></tr>
<tr><td>Vascular invasion or spread, adequate function</td><td>Systemic therapy (immunotherapy combinations)</td></tr>
<tr><td>Poor function or performance, not a transplant candidate</td><td>Supportive care</td></tr>
</tbody></table></div>
<ul>
  <li>Ascites means decompensation, which usually argues against resection.</li>
</ul>
<h4 class="deck-topic">Liver abscess and cysts</h4>
<div class="deck-cards">
  <div class="deck-card diag"><div class="deck-card-h">Amoebic</div><ul><li>Young man from or visiting an endemic area</li><li>Often one right-lobe abscess</li><li>Serology; <b>metronidazole then a luminal agent</b></li><li>Aspirate only for poor response, rupture risk or doubt</li></ul></div>
  <div class="deck-card mgmt"><div class="deck-card-h">Pyogenic</div><ul><li>Often biliary disease, diabetes or older age</li><li>Fever, may be multiple</li><li>Blood cultures, broad antibiotics and <b>drainage</b></li><li>Look for the source</li></ul></div>
  <div class="deck-card clin"><div class="deck-card-h">Hydatid (Echinococcus)</div><ul><li>Sheep or dog contact</li><li>Daughter cysts, wall calcification</li><li>Albendazole with PAIR or surgery by cyst type</li><li>Leakage can cause anaphylaxis</li></ul></div>
</div>
<ul>
  <li><b>Haemangioma</b> is the commonest benign solid-appearing lesion: peripheral nodular enhancement that fills in. Observe.</li>
  <li><b>Adenoma</b>: linked with oestrogens and anabolic steroids; risk of bleeding. <b>Focal nodular hyperplasia</b>: central scar, leave alone.</li>
</ul>
<div class="sum-key">
  <span class="sum-key-title">نقاط امتحانية</span>
  <ul>
    <li>Cirrhosis follow-up: ultrasound every 6 months, even after HCV cure.</li>
    <li>Liver function matters as much as tumour size.</li>
    <li>Travel history with a single right-lobe abscess: think amoebic.</li>
    <li>Do not needle a possible hydatid cyst casually.</li>
  </ul>
</div>
`,
            questions: [
                {
                    "q": "A 64-year-old man with liver cirrhosis secondary to chronic hepatitis C has completed treatment and now has undetectable HCV RNA 12 weeks post-treatment. He is asymptomatic, with a few spider angiomata and mild splenomegaly on exam. Labs show low platelets and low albumin. Which of the following is the most appropriate follow-up option?",
                    "options": [
                        "MRI abdomen yearly",
                        "Reassurance and follow-up",
                        "Liver ultrasound every 6 months",
                        "Alpha-fetoprotein every 3 months"
                    ],
                    "answer": 2,
                    "explanation": "Even after successful eradication of hepatitis C, a patient with established cirrhosis remains at risk for hepatocellular carcinoma and requires ongoing surveillance; ultrasound every 6 months is the standard surveillance strategy, rather than yearly MRI or AFP testing alone.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A 25-year-old male recently arrived from India presents to the Emergency Room with right upper quadrant pain, night sweats, malaise and fever. Ultrasound shows a hypoechoic collection in the right lobe of the liver. CT shows a thick-walled abscess without septations. Which of the following is the diagnosis?",
                    "options": [
                        "Amoebic liver abscess",
                        "Pyogenic liver abscess",
                        "Hydatid cyst",
                        "TB abscess"
                    ],
                    "answer": 0,
                    "explanation": "Young traveller from an endemic area with a solitary right-lobe abscess and normal bilirubin = amoebic.",
                    "source": "SMLE recall"
                }
            ],
        },
        {
            id: "gi-colon-vascular",
            title: "10 — Colon, Lower GI Bleeding & Gut Ischaemia",
            title_en: "Screening · Polyps · Diverticular bleed · Mesenteric ischaemia",
            summaryHtml: `
<h4 class="deck-topic">Colorectal screening</h4>
<ul>
  <li>Average risk: many current guidelines start at <b>45 years</b> (some still use 50). Options include colonoscopy every 10 years or regular faecal immunochemical testing.</li>
  <li>First-degree relative with colorectal cancer before 60: colonoscopy from <b>40, or 10 years before</b> the relative's age at diagnosis (whichever is earlier), usually every 5 years.</li>
  <li>Familial adenomatous polyposis: APC gene, hundreds of polyps, screening from childhood. <b>Lynch syndrome</b>: mismatch repair genes, early cancer, also endometrial.</li>
  <li>A positive faecal test needs colonoscopy.</li>
</ul>
<h4 class="deck-topic">After polyp removal</h4>
<p>Figures follow the US multi-society guidance and assume a complete, good-quality examination; other guidelines differ.</p>
<div class="deck-block deck-tbl"><table><thead><tr><th>Adenoma findings</th><th>Next colonoscopy</th></tr></thead><tbody>
<tr><td>1–2 tubular, under 10 mm</td><td>7–10 years</td></tr>
<tr><td>3–4, under 10 mm</td><td>3–5 years</td></tr>
<tr><td>5–10 adenomas</td><td>3 years</td></tr>
<tr><td>10 mm or more, villous, or high-grade dysplasia</td><td>3 years</td></tr>
</tbody></table></div>
<h4 class="deck-topic">Lower GI bleeding</h4>
<ul>
  <li><b>Diverticulosis</b>: sudden, painless, sometimes large bleed in an older patient; often stops by itself.</li>
  <li>Other causes: angiodysplasia, haemorrhoids, cancer, colitis, ischaemic colitis. In the young, consider IBD, polyps and Meckel diverticulum.</li>
  <li>Resuscitate first. With haemodynamic instability, exclude a brisk <b>upper source</b>; use <b>CT angiography</b> to localise active bleeding, then embolisation. Stable patients usually have colonoscopy.</li>
  <li>New iron deficiency in a man or postmenopausal woman needs GI evaluation.</li>
</ul>
<h4 class="deck-topic">Intestinal ischaemia</h4>
<div class="deck-cards">
  <div class="deck-card diag"><div class="deck-card-h">Acute mesenteric ischaemia</div><ul><li>Atrial fibrillation or vascular disease</li><li><b>Pain out of proportion</b> to examination</li><li>High lactate is late and non-specific</li><li><b>CT angiography</b></li></ul></div>
  <div class="deck-card mgmt"><div class="deck-card-h">Management</div><ul><li>Fluids, antibiotics, anticoagulation unless contraindicated</li><li>Urgent revascularisation</li><li>Peritonitis or dead bowel: laparotomy</li></ul></div>
  <div class="deck-card clin"><div class="deck-card-h">Ischaemic colitis</div><ul><li>Crampy left-sided pain then bloody stool</li><li>After hypotension, often at watershed areas</li><li>Mostly supportive care</li></ul></div>
</div>
<ul>
  <li><b>Chronic mesenteric ischaemia</b>: pain after meals, fear of eating and weight loss.</li>
</ul>
<div class="sum-key">
  <span class="sum-key-title">نقاط امتحانية</span>
  <ul>
    <li>Atrial fibrillation with severe pain and a soft abdomen: CT angiography.</li>
    <li>Massive painless rectal bleeding in the elderly: diverticular source is most likely.</li>
    <li>An adenoma of 10 mm or more is advanced: recheck in 3 years.</li>
    <li>Family history moves screening earlier.</li>
  </ul>
</div>
`,
            questions: [
                {
                    "q": "A 75 year old female K/C of Afib and recent unintentional weight loss, presented to the ER with severe abdominal pain that is described as out of proportion, on examination the abdomen was soft but tender with decreased bowel sound.",
                    "options": [
                        "Lactate levels",
                        "X ray of the abdomen",
                        "Abdominal ultrasound",
                        "Abdominal CT angiography"
                    ],
                    "answer": 3,
                    "explanation": "Pain out of proportion with atrial fibrillation is acute mesenteric ischaemia → CT angiography is the diagnostic test. Pain out of proportion + AF → CT angiography (mesenteric ischaemia).",
                    "source": "SMLE recall"
                },
                {
                    "q": "An elderly patient presents with massive lower gastrointestinal bleeding. What is the most likely aetiology?",
                    "options": [
                        "Angiodysplasia",
                        "Diverticulosis",
                        "Colon cancer",
                        "Ulcerative colitis"
                    ],
                    "answer": 1,
                    "explanation": "Massive lower GI bleeding in the elderly: angiodysplasia (recurrent, right colon, linked to aortic stenosis and CKD) and diverticulosis (single large painless bleed, stops in 80%) are the two answers - read the wording. Always exclude a brisk UPPER GI source first.",
                    "source": "SMLE recall"
                },
                {
                    "q": "A 40-year-old healthy man came to the clinic requesting a screening colonoscopy. He is asymptomatic with no family history of colon cancer. Clinical examination is unremarkable (see lab results). Test Result Normal Values RBC 4 4.7-6.1 x 1012/L (Male) 4.2-5.4 x 1012/L (Female) Hb 13.3 130-170 g/L (Male) 120-160 g/L (Female) Platelets count 321 150-400 x 109/L WBC 4 4.5-10.5 x 109/L Based on the latest recommendation from local and international gastroenterology associations, what is the recommended age of screening colonoscopy for this average risk patients?",
                    "options": [
                        "45",
                        "55",
                        "65",
                        "Order for him now"
                    ],
                    "answer": 0,
                    "explanation": "Core Concept: Colorectal cancer (CRC) screening guidelines have been updated to lower the starting age for average-risk individuals due to the rising incidence of early-onset CRC. Clinical Presentation: · Preventative screening; asymptomatic. Diagnosis: · First-line: Stool-based tests (FIT, FIT-DNA) or direct visualization. · Gold Standard: Colonoscopy. Management: · Acute/Long-term: Major gastroenterology and oncology societies (e.g., USPSTF, ACS, ACG) now recommend initiating CRC screening at age 45 for average-risk individuals. Screening continues until age 75, with individualized decisions up to age 85.",
                    "source": "SMLE bank"
                },
                {
                    "q": "A 42-year-old patient undergoes colonoscopy for evaluation of gastrointestinal symptoms. A 1.3 cm colonic polyp is identified and removed. Histopathology reveals a tubular adenoma. What is the most appropriate follow-up colonoscopy interval?",
                    "options": [
                        "After 10 years",
                        "Every 3 months",
                        "Not needed",
                        "After 3 years"
                    ],
                    "answer": 3,
                    "explanation": "A polyp size of 1.3 cm exceeds the 1 cm threshold that would otherwise qualify for a longer 7-10 year interval, requiring closer 3-year follow-up surveillance per standard guidance.",
                    "source": "SMLE recall"
                }
            ],
        },
    ],
};

export default specialtyGastroenterology;
