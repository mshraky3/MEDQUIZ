// Gastroenterology (medical). HTML served (gated) to the slide viewer.
export default `
<div class="sum-doc" dir="rtl">
  <div class="sum-head">
    <h2>الجهاز الهضمي — ملخص عالي العائد</h2>
    <p class="sum-meta">للمراجعة الامتحانية.</p>
  </div>

  <section class="topic" id="gi-viral-hepatitis" dir="ltr">
    <h3>1. Viral Hepatitis</h3>
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
  </section>

  <section class="topic" id="gi-cirrhosis-ascites" dir="ltr">
    <h3>2. Cirrhosis, Ascites &amp; Encephalopathy</h3>
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
  </section>

  <section class="topic" id="gi-bleeding-varices" dir="ltr">
    <h3>3. Variceal &amp; Upper GI Bleeding</h3>
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
  </section>

  <section class="topic" id="gi-ibd" dir="ltr">
    <h3>4. Inflammatory Bowel Disease</h3>
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
  </section>

  <section class="topic" id="gi-pancreatitis" dir="ltr">
    <h3>5. Pancreatitis &amp; Its Complications</h3>
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
  </section>

  <section class="topic" id="gi-esophagus-stomach" dir="ltr">
    <h3>6. Oesophagus &amp; Stomach</h3>
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
  </section>

  <section class="topic" id="gi-diarrhoea-coeliac" dir="ltr">
    <h3>7. Diarrhoea, Coeliac Disease &amp; IBS</h3>
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
  </section>

  <section class="topic" id="gi-liver-diseases" dir="ltr">
    <h3>8. Jaundice &amp; Specific Liver Diseases</h3>
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
  </section>

  <section class="topic" id="gi-liver-masses" dir="ltr">
    <h3>9. Liver Cancer &amp; Liver Abscess</h3>
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
  </section>

  <section class="topic" id="gi-colon-vascular" dir="ltr">
    <h3>10. Colon, Lower GI Bleeding &amp; Gut Ischaemia</h3>
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
  </section>
</div>
`;
