// Mental Health Nursing — nursing-track topic summary, served (gated) to the
// slide viewer. Therapeutic communication and the speech/thought-disorder
// vocabulary come first: the bank tests those terms more than any diagnosis.
// Angle brackets escaped (&lt; / &gt;).
export default `
<div class="sum-doc" dir="rtl">
  <div class="sum-head">
    <h2>تمريض الصحة النفسية — ملخص عالي العائد (SNLE)</h2>
    <p class="sum-meta">يغطي التواصل العلاجي · الحيل الدفاعية · الفصام واضطرابات التفكير · الاضطراب الوجداني والاكتئاب · القلق والوسواس والرهاب · اضطرابات الأكل · الأعراض الجسدية · الهذيان والخرف · الإدمان والانسحاب · الانتحار والعدوانية والتقييد · العلاجات النفسية. للمراجعة الامتحانية فقط.</p>
  </div>

  <nav class="sum-toc" dir="rtl" aria-label="جدول المحتويات">
    <h3>جدول المحتويات</h3>
    <ol>
      <li><a href="#h-neuro">Neurotransmitters</a></li>
      <li><a href="#h-comm">Therapeutic Communication</a></li>
      <li><a href="#h-defense">Defence Mechanisms</a></li>
      <li><a href="#h-terms">Thought &amp; Speech Terminology</a></li>
      <li><a href="#h-schizo">Schizophrenia Spectrum</a></li>
      <li><a href="#h-mood">Mood Disorders</a></li>
      <li><a href="#h-anxiety">Anxiety, OCD &amp; Phobia</a></li>
      <li><a href="#h-somatic">Somatic Symptom &amp; Conversion</a></li>
      <li><a href="#h-eating">Eating Disorders</a></li>
      <li><a href="#h-cognitive">Delirium, Dementia &amp; Alzheimer's</a></li>
      <li><a href="#h-substance">Substance Use &amp; Withdrawal</a></li>
      <li><a href="#h-crisis">Suicide, Aggression &amp; Restraint</a></li>
      <li><a href="#h-personality">Personality Disorders</a></li>
      <li><a href="#h-therapy">Therapies &amp; Legal Issues</a></li>
    </ol>
  </nav>

  <section class="topic" id="h-neuro" dir="ltr">
    <h3>1. Neurotransmitters</h3>
    <p>Every psychiatric drug question is easier once you know which chemical the drug is moving, and in which direction.</p>
    <table>
      <thead><tr><th>Neurotransmitter</th><th>Controls</th><th>Too little</th><th>Too much</th></tr></thead>
      <tbody>
        <tr><td><b>Acetylcholine</b></td><td>Memory, learning, attention, muscle movement</td><td><b>Alzheimer's</b>, memory loss, dementia</td><td>Depression, anxiety, muscle paralysis</td></tr>
        <tr><td><b>Dopamine</b></td><td>Mood and pleasure/reward, movement, libido, sleep</td><td><b>Parkinson's</b>, depression, lack of motivation</td><td><b>Schizophrenia, hallucinations</b>, mania</td></tr>
        <tr><td><b>Serotonin</b></td><td>Mood, sleep, appetite, libido</td><td><b>Depression</b>, anxiety, fatigue</td><td><b>Serotonin syndrome</b></td></tr>
        <tr><td><b>Norepinephrine</b></td><td>Attention, mood, motivation, energy</td><td>Depression, ADHD, postpartum depression</td><td>Anxiety, panic, overstimulation</td></tr>
        <tr><td><b>GABA</b></td><td>Calm, sleep regulation — the main <b>inhibitory</b> transmitter</td><td>Anxiety, panic disorder, PTSD, seizures</td><td>Sedation, hypersomnia</td></tr>
        <tr><td><b>Glutamate</b></td><td>Memory, nerve transmission — the main <b>excitatory</b> transmitter</td><td>Fatigue, poor concentration</td><td>Anxiety, insomnia, restlessness</td></tr>
      </tbody>
    </table>
    <ul>
      <li><b>Antipsychotics block dopamine</b> — which is why they relieve hallucinations but produce parkinsonian extrapyramidal side effects</li>
      <li><b>Antidepressants raise serotonin</b> (and noradrenaline) — which is why combining two of them risks serotonin syndrome</li>
      <li><b>Benzodiazepines enhance GABA</b> — hence sedation and the additive danger with alcohol and opioids</li>
    </ul>
    <div class="sum-callout"><b>Memory:</b> <b>l</b>ow <b>s</b>erotonin → <b>l</b>ow and <b>s</b>ad; <b>h</b>igh serotonin → <b>h</b>appy (and, too high, <b>h</b>yperthermic — serotonin syndrome).</div>
  </section>

  <section class="topic" id="h-comm" dir="ltr">
    <h3>2. Therapeutic Communication</h3>
    <table>
      <thead><tr><th>Technique</th><th>Example</th></tr></thead>
      <tbody>
        <tr><td><b>Offering self</b></td><td><b>"I will stay here with you."</b></td></tr>
        <tr><td>Broad opening</td><td>"What would you like to talk about?"</td></tr>
        <tr><td>Silence</td><td>Sitting quietly, letting the patient set the pace</td></tr>
        <tr><td>Restating</td><td>Patient: "I can't sleep." Nurse: "You are having trouble sleeping."</td></tr>
        <tr><td>Reflecting</td><td>"You sound angry about that."</td></tr>
        <tr><td>Clarifying / seeking validation</td><td>"I'm not sure I follow — can you explain what you mean?"</td></tr>
        <tr><td>Exploring</td><td>"Tell me more about that."</td></tr>
        <tr><td>Focusing</td><td>"Let's come back to what you said about your mother."</td></tr>
        <tr><td>Presenting reality</td><td>"I don't hear the voices, but I understand that you do."</td></tr>
        <tr><td>Making observations</td><td>"I notice that you are pacing."</td></tr>
      </tbody>
    </table>
    <h4>Non-therapeutic — always the wrong answer</h4>
    <ul>
      <li><b>"Why" questions</b> — they demand justification and make the patient defensive</li>
      <li><b>False reassurance</b> — "Everything will be fine", "Don't worry"</li>
      <li><b>Giving advice</b> — "If I were you I would…"</li>
      <li><b>Approving/disapproving, agreeing/disagreeing</b>, defending the staff or the hospital</li>
      <li><b>Changing the subject</b> or minimising the patient's feelings</li>
      <li>Closed yes/no questions when exploration is needed; asking for personal opinions</li>
    </ul>
    <div class="sum-callout"><b>Rule of thumb:</b> the correct option is almost always the one that is <b>open-ended, focuses on the patient's feelings, and keeps the nurse present</b> — not the one that explains, reassures, or solves.</div>
    <div class="sum-key">
      <span class="sum-key-title">نقاط امتحانية</span>
      <ul>
        <li>"I will stay here with you" = <b>offering self</b> — the single most-tested technique.</li>
        <li>A frightened, anxious patient saying "I am going to die" → do <b>not</b> say yes or no; <b>stay with them and explore the feeling</b> ("You are frightened. Tell me what you are feeling.").</li>
        <li>When a patient with dementia or delusion misidentifies you (calls you "my sister"), respond with <b>gentle reality orientation</b> without arguing.</li>
      </ul>
    </div>
  </section>

  <section class="topic" id="h-defense" dir="ltr">
    <h3>3. Defence Mechanisms</h3>
    <table>
      <thead><tr><th>Mechanism</th><th>Definition</th><th>Example</th></tr></thead>
      <tbody>
        <tr><td><b>Denial</b></td><td>Refusing to accept a painful reality</td><td>A newly diagnosed cancer patient says "The lab made a mistake"</td></tr>
        <tr><td><b>Repression</b></td><td><b>Unconscious</b> blocking of a painful memory</td><td>No memory of a traumatic accident</td></tr>
        <tr><td><b>Suppression</b></td><td><b>Conscious</b> putting aside of a thought</td><td>"I will think about the biopsy result after my exam"</td></tr>
        <tr><td><b>Projection</b></td><td>Attributing one's own unacceptable feelings to someone else</td><td>An angry patient says "The nurses hate me"</td></tr>
        <tr><td><b>Displacement</b></td><td>Shifting a feeling onto a safer target</td><td>Shouted at by the doctor, the nurse snaps at a student</td></tr>
        <tr><td><b>Rationalisation</b></td><td>Making an acceptable excuse for unacceptable behaviour</td><td>"I only drink because of the stress at work"</td></tr>
        <tr><td><b>Regression</b></td><td>Returning to an earlier developmental behaviour</td><td>A toilet-trained hospitalised child starts bed-wetting</td></tr>
        <tr><td><b>Sublimation</b></td><td>Channelling an unacceptable impulse into an acceptable outlet</td><td>An aggressive person takes up boxing</td></tr>
        <tr><td><b>Compensation</b></td><td>Overachieving in one area to make up for a deficit in another</td><td>A short boy becomes an outstanding student</td></tr>
        <tr><td><b>Reaction formation</b></td><td>Behaving the opposite of what one feels</td><td>Being excessively kind to a colleague one dislikes</td></tr>
        <tr><td><b>Conversion</b></td><td>Anxiety turned into a <b>physical symptom</b></td><td>Blindness or paralysis with no organic cause after a trauma</td></tr>
        <tr><td><b>Identification</b></td><td>Taking on the qualities of an admired person</td><td>A student nurse imitating a respected preceptor</td></tr>
      </tbody>
    </table>
    <div class="sum-key">
      <span class="sum-key-title">نقاط امتحانية</span>
      <ul>
        <li>"Anxiety turned into a physical symptom" = <b>conversion</b>.</li>
        <li>Denial is the first stage of Kübler-Ross grief: <b>Denial → Anger → Bargaining → Depression → Acceptance</b>. The nurse's role in denial is to <b>stay available without confronting it</b>.</li>
      </ul>
    </div>
  </section>

  <section class="topic" id="h-terms" dir="ltr">
    <h3>4. Thought &amp; Speech Terminology</h3>
    <table>
      <thead><tr><th>Term</th><th>Definition</th></tr></thead>
      <tbody>
        <tr><td><b>Word salad</b></td><td><b>Words or phrases connected together meaninglessly</b>, with no logical link — the most severe disorganisation</td></tr>
        <tr><td><b>Neologism</b></td><td>A <b>newly invented word</b> that has meaning only to the patient</td></tr>
        <tr><td><b>Clang association</b></td><td>Words chosen for their <b>rhyme or sound</b>, not meaning — "kite, night, right, height, fright"</td></tr>
        <tr><td><b>Loose association</b></td><td>Ideas shift from one unrelated subject to another — "sea, airport, bus"</td></tr>
        <tr><td><b>Flight of ideas</b></td><td>Rapid, continuous speech jumping between topics with a thin connection — typical of <b>mania</b></td></tr>
        <tr><td><b>Echolalia</b></td><td><b>Repeating</b> the words of another person</td></tr>
        <tr><td><b>Echopraxia</b></td><td>Imitating another person's <b>movements</b></td></tr>
        <tr><td><b>Perseveration</b></td><td><b>Repeating the same word or phrase</b> over and over — "boat, boat, boat"</td></tr>
        <tr><td><b>Circumstantiality</b></td><td>Excessive detail but eventually reaches the point</td></tr>
        <tr><td><b>Tangentiality</b></td><td>Wanders off and <b>never</b> reaches the point</td></tr>
        <tr><td><b>Thought blocking</b></td><td>Speech stops abruptly mid-sentence</td></tr>
        <tr><td><b>Delusion</b></td><td>A <b>fixed false belief</b> not corrected by evidence (grandeur, persecution, reference, somatic)</td></tr>
        <tr><td><b>Hallucination</b></td><td>A <b>sensory perception with no external stimulus</b> — auditory is the commonest in schizophrenia</td></tr>
        <tr><td><b>Illusion</b></td><td><b>Misinterpretation of a real</b> stimulus — a curtain seen as a person</td></tr>
        <tr><td><b>Depersonalisation</b></td><td>Feeling <b>detached from one's own body</b> — "my arms don't feel like mine, I don't feel alive"</td></tr>
        <tr><td><b>Derealisation</b></td><td>The surroundings feel unreal or dreamlike</td></tr>
        <tr><td><b>Anhedonia</b></td><td>Loss of pleasure in previously enjoyed activities</td></tr>
        <tr><td><b>Avolition / apathy</b></td><td>Loss of motivation and goal-directed behaviour</td></tr>
        <tr><td><b>Anosognosia</b></td><td>Lack of insight — the patient does not believe they are ill</td></tr>
      </tbody>
    </table>
  </section>

  <section class="topic" id="h-schizo" dir="ltr">
    <h3>5. Schizophrenia Spectrum</h3>
    <ul>
      <li><b>Positive symptoms</b> (added to normal experience): hallucinations, delusions, disorganised speech and behaviour, agitation — these respond best to antipsychotics</li>
      <li><b>Negative symptoms</b> (taken away): <b>flat affect, alogia (poverty of speech), avolition, anhedonia, social withdrawal, poor grooming</b> — harder to treat, respond better to atypicals</li>
      <li>Admission assessment often shows <b>poor hygiene and dishevelled appearance</b>, a flat affect and odd posturing</li>
      <li><b>Catatonia</b>: immobility, waxy flexibility or extreme agitation</li>
    </ul>
    <h4>Nursing management</h4>
    <div class="sum-algo">
      <span class="sum-algo-title">Responding to hallucinations and delusions</span>
      <ol>
        <li><b>Assess for command hallucinations</b> first — "What are the voices telling you to do?" Safety comes before everything</li>
        <li><b>Do not argue with or reinforce</b> the delusion; do not pretend to see or hear it</li>
        <li><b>Present reality calmly</b>: "I do not hear those voices, but I understand they are real to you"</li>
        <li><b>Acknowledge the feeling</b>, then redirect to a reality-based activity</li>
        <li>Approach from the front, one nurse at a time, in a calm low voice, with clear simple sentences and adequate personal space</li>
      </ol>
    </div>
    <ul>
      <li>A patient shouting at everyone on the ward → remain calm, keep a safe distance, <b>speak in a quiet unhurried voice, take them to a low-stimulus area</b>, and offer PRN medication before considering restraint</li>
      <li>Build trust with <b>short, frequent, consistent</b> contacts; be honest and reliable</li>
    </ul>
    <h4>Antipsychotic side effects</h4>
    <table>
      <thead><tr><th></th><th>Typical / first generation (haloperidol, chlorpromazine, fluphenazine)</th><th>Atypical / second generation (risperidone, olanzapine, quetiapine, clozapine)</th></tr></thead>
      <tbody>
        <tr><td>Best for</td><td>Positive symptoms</td><td>Positive <b>and negative</b> symptoms</td></tr>
        <tr><td>Main problem</td><td><b>Extrapyramidal side effects (EPS)</b> — far more than the atypicals</td><td><b>Metabolic syndrome</b> — weight gain, hyperglycaemia, dyslipidaemia</td></tr>
      </tbody>
    </table>
    <ul>
      <li><b>EPS</b> — <b>acute dystonia</b> (muscle spasm, torticollis, oculogyric crisis — treat urgently with benztropine/diphenhydramine), <b>akathisia</b> (motor restlessness, cannot sit still), <b>pseudoparkinsonism</b> (tremor, rigidity, shuffling gait, mask face), and <b>tardive dyskinesia</b> (late, involuntary lip-smacking and tongue movements — often <b>irreversible</b>, so report at the first sign)</li>
      <li><b>Neuroleptic malignant syndrome</b>: <b>high fever, severe muscle rigidity, altered consciousness, autonomic instability, raised CPK</b> → <b>STOP the drug immediately</b>, cool the patient, IV fluids, dantrolene/bromocriptine. It is life-threatening</li>
      <li><b>Clozapine</b> → risk of <b>agranulocytosis</b>: monitor the <b>WBC/ANC regularly</b> and report a sore throat, fever or flu-like illness</li>
      <li>Teach: take medication consistently even when feeling well, avoid alcohol, rise slowly (orthostatic hypotension), use sun protection, report a stiff neck or fever</li>
    </ul>
    <div class="sum-key">
      <span class="sum-key-title">نقاط امتحانية</span>
      <ul>
        <li>The drug class most associated with <b>extrapyramidal side effects</b> is the <b>typical (first-generation) antipsychotics</b>.</li>
        <li>"Kite, night, right, height" = <b>clang association</b>. "Boat, boat, boat" = <b>perseveration</b>. "Sea, airport, bus" = <b>loose association</b>.</li>
        <li>Feeling that the limbs are detached and that one is not alive = <b>depersonalisation</b>.</li>
      </ul>
    </div>
  </section>

  <section class="topic" id="h-mood" dir="ltr">
    <h3>6. Mood Disorders</h3>
    <h4>Major depression</h4>
    <ul>
      <li>Depressed mood or anhedonia for ≥2 weeks plus <b>SIG E CAPS</b> — Sleep change, Interest loss, Guilt/worthlessness, Energy loss, Concentration difficulty, Appetite/weight change, Psychomotor change, Suicidal ideation</li>
      <li>Nursing approach: spend time with the patient <b>even in silence</b>, use simple direct statements, and <b>plan the day's activities WITH the patient</b> — start with simple, achievable, structured activities rather than large group or competitive ones</li>
      <li><b>Do not</b> push a severely depressed patient into a demanding social activity (like a group movie) as a first step, and do not use false cheerfulness</li>
      <li><b>The highest suicide risk is when the depression starts to lift</b> — energy returns before the mood does, giving the patient the ability to act</li>
      <li>Monitor nutrition, hydration, elimination and sleep — physical needs come first</li>
    </ul>
    <h4>Bipolar disorder / mania</h4>
    <ul>
      <li><b>Mania</b>: euphoric or irritable mood, <b>grandiosity, pressured speech, flight of ideas, decreased need for sleep, hyperactivity and talkativeness, distractibility, risky behaviour</b> — with a normal physical examination</li>
      <li>Nursing care: <b>low-stimulus environment</b>, set firm consistent limits, <b>high-calorie finger foods and fluids</b> that can be eaten on the move (the patient will not sit to eat), encourage rest, redirect energy into non-competitive physical activity, remove hazards and protect from exploitation</li>
      <li><b>Lithium</b>: therapeutic level <b>0.6–1.2 mEq/L</b>; toxic above 1.5. Needs <b>consistent salt and fluid intake (2–3 L/day)</b> — dehydration, low sodium, diuretics and NSAIDs raise the level. Early toxicity: nausea, vomiting, diarrhoea, fine tremor; later: coarse tremor, ataxia, confusion, seizure. Monitor lithium levels, renal function and thyroid function</li>
      <li><b>Valproate and carbamazepine</b> are alternative mood stabilisers — both are teratogenic and need liver/blood monitoring</li>
    </ul>
    <div class="sum-key">
      <span class="sum-key-title">نقاط امتحانية</span>
      <ul>
        <li>For a patient with major depression, the correct activity answer is to <b>plan today's activities with the patient</b> — it restores control and is achievable.</li>
        <li>Euphoric, hyperactive and talkative with a normal physical exam = <b>manic episode of bipolar disorder</b>.</li>
      </ul>
    </div>
  </section>

  <section class="topic" id="h-anxiety" dir="ltr">
    <h3>7. Anxiety, OCD &amp; Phobia</h3>
    <table>
      <thead><tr><th>Level</th><th>Perception</th><th>Nursing action</th></tr></thead>
      <tbody>
        <tr><td>Mild</td><td>Alert, perception widened, learning is best</td><td>This is the level for teaching</td></tr>
        <tr><td>Moderate</td><td>Narrowed focus, selective inattention</td><td>Redirect, help focus</td></tr>
        <tr><td>Severe</td><td>Greatly reduced focus, detail only</td><td>Calm, short simple directions; <b>no teaching</b></td></tr>
        <tr><td>Panic</td><td>Disorganised, loss of control, may harm self/others</td><td><b>Stay with the patient</b>, quiet environment, short simple firm sentences, PRN medication</td></tr>
      </tbody>
    </table>
    <ul>
      <li><b>Panic attack</b>: abrupt palpitations, sweating, trembling, dyspnoea, chest pain, fear of dying, peaking within ~10 minutes. Priority = <b>never leave the patient alone</b>, stay calm, remain in a quiet setting and guide slow breathing</li>
      <li><b>Generalised anxiety disorder</b>: excessive worry most days for ≥6 months. Treat with SSRIs plus cognitive behavioural therapy; benzodiazepines only short term</li>
      <li><b>OCD</b>: obsessions (intrusive thoughts) and compulsions (repetitive acts that relieve the anxiety). <b>Do not stop the ritual abruptly</b> — allow time for it initially, set reasonable limits, and gradually reduce it. First-line treatment is SSRI + exposure and response prevention</li>
      <li><b>Phobia</b>: an irrational fear of a specific object/situation with avoidance → <b>systematic desensitisation</b> and CBT</li>
      <li><b>PTSD</b>: re-experiencing (flashbacks, nightmares), avoidance, negative mood, hyperarousal, lasting &gt;1 month after trauma → trauma-focused CBT and SSRIs; provide safety and predictability</li>
      <li>Benzodiazepines (diazepam, lorazepam, alprazolam): risk of sedation, falls, dependence and respiratory depression; never with alcohol; taper — do not stop abruptly. Antidote = <b>flumazenil</b></li>
    </ul>
  </section>

  <section class="topic" id="h-somatic" dir="ltr">
    <h3>8. Somatic Symptom &amp; Conversion Disorders</h3>
    <ul>
      <li><b>Somatic symptom disorder</b>: real distressing physical symptoms with excessive thoughts and health anxiety, out of proportion to any finding. The symptoms are <b>not intentionally produced</b> — do not tell the patient "there is nothing wrong with you"</li>
      <li>Approach: one consistent provider, <b>scheduled brief regular appointments</b> rather than PRN visits, acknowledge the symptom, complete the necessary work-up once, then shift the focus to coping, stress and function rather than the symptom</li>
      <li>Somatisation puts the patient at <b>high risk of unnecessary tests, procedures and medications</b> — and of a real illness being missed</li>
      <li><b>Conversion disorder</b>: a neurological deficit (paralysis, blindness, aphonia, seizure) with no organic cause, often after acute stress, sometimes with <b>la belle indifférence</b> (surprising lack of concern)</li>
      <li><b>Factitious disorder</b> = symptoms deliberately produced for the <b>sick role</b> (no external reward). <b>Malingering</b> = deliberately produced for an <b>external gain</b> (money, sick leave)</li>
      <li><b>Hypochondriasis / illness anxiety</b>: preoccupation with having a serious disease despite reassurance</li>
    </ul>
  </section>

  <section class="topic" id="h-eating" dir="ltr">
    <h3>9. Eating Disorders</h3>
    <table>
      <thead><tr><th></th><th>Anorexia nervosa</th><th>Bulimia nervosa</th><th>Binge eating disorder</th></tr></thead>
      <tbody>
        <tr><td>Pattern</td><td>Restriction of intake, obsessive monitoring</td><td><b>Binge then purge</b> (vomiting, laxatives, diuretics, over-exercise)</td><td>Binge <b>without</b> purging — the <b>commonest</b> eating disorder</td></tr>
        <tr><td>Weight</td><td><b>Underweight, BMI &lt;18.5</b>; intense fear of gaining weight, distorted body image</td><td>Usually <b>normal or slightly above</b> — easier to hide</td><td>Usually <b>overweight or obese</b></td></tr>
        <tr><td>Signs</td><td>Amenorrhoea, bradycardia, hypotension, hypothermia, <b>lanugo</b>, dry skin, constipation, osteoporosis</td><td><b>Eroded dental enamel</b>, parotid swelling, halitosis, <b>Russell's sign</b> (knuckle calluses), oesophageal injury, frequent trips to the bathroom after meals</td><td>Eating in secret and at night, guilt after eating, bloating, hypertension, dyslipidaemia, <b>type 2 diabetes</b></td></tr>
        <tr><td>Labs</td><td>Electrolyte disturbance, bradycardia, arrhythmia</td><td><b>Low potassium and sodium</b>, <b>raised amylase</b> (parotitis), raised BUN/creatinine (AKI), metabolic alkalosis</td><td>Irregular glucose</td></tr>
        <tr><td>Drugs</td><td>Antidepressants/anxiolytics as adjuncts; no drug treats the disorder itself</td><td><b>Fluoxetine is the only approved SSRI</b>; <b>bupropion is contraindicated</b> (seizure risk in purging patients)</td><td>SSRIs, SNRIs, stimulants (watch appetite suppression)</td></tr>
      </tbody>
    </table>
    <ul>
      <li>Nursing care: <b>the physiological consequences are the priority</b> — weight, vital signs, electrolytes and cardiac rhythm come before insight work</li>
      <li><b>Refeeding syndrome</b>: reintroducing calories <b>too quickly</b> causes a dangerous shift of phosphate, potassium and magnesium into the cells, plus erratic glucose and <b>thiamine deficiency</b> — it can be fatal. Reintroduce nutrition <b>slowly</b> and monitor electrolytes daily</li>
      <li>Structured mealtimes, <b>stay with the patient during meals and for 1 hour afterwards</b> (to prevent purging), do not bargain over food, do not praise weight or appearance</li>
      <li>Weighing: same time each morning, same scale, after voiding, in the same minimal clothing — and stand the patient <b>facing away from the scale display</b>, because seeing the number is itself triggering</li>
      <li>A school nurse who notices a student with features of anorexia should <b>assess privately and refer</b> to the physician and mental-health service, and involve the family — not confront in front of peers</li>
    </ul>
    <div class="sum-key">
      <span class="sum-key-title">نقاط امتحانية</span>
      <ul>
        <li>Bulimia's low labs come from <b>e</b>lectro<b>l</b>ytes <b>l</b>eaving the body — potassium and sodium fall, amylase rises.</li>
        <li>Refeeding syndrome is caused by feeding <b>too fast</b>, not by feeding at all — the answer is a slow, monitored increase.</li>
      </ul>
    </div>
  </section>

  <section class="topic" id="h-cognitive" dir="ltr">
    <h3>10. Delirium, Dementia &amp; Alzheimer's</h3>
    <table>
      <thead><tr><th></th><th>Delirium</th><th>Dementia</th></tr></thead>
      <tbody>
        <tr><td>Onset</td><td><b>Sudden</b> (hours to days)</td><td><b>Gradual</b> (months to years)</td></tr>
        <tr><td>Course</td><td>Fluctuates, worse at night</td><td>Slowly progressive</td></tr>
        <tr><td>Consciousness</td><td><b>Impaired / clouded</b></td><td>Clear until late</td></tr>
        <tr><td>Cause</td><td><b>Reversible</b> — infection (especially UTI in the elderly), hypoxia, drugs, electrolytes, dehydration, pain, post-op</td><td>Irreversible, degenerative</td></tr>
        <tr><td>Priority</td><td><b>Find and treat the underlying cause</b></td><td>Maintain function, safety and dignity</td></tr>
      </tbody>
    </table>
    <ul>
      <li><b>Alzheimer's disease</b> — the commonest dementia. Early: short-term memory loss, word-finding difficulty, misplacing things. Later: <b>apraxia, agnosia, aphasia</b>, wandering, <b>sundowning</b> (agitation in the late afternoon/evening), and finally total dependence</li>
      <li>Nursing care: <b>consistent routine and caregiver</b>, a familiar simple environment, one instruction at a time in short sentences, clocks and calendars for orientation, labels on doors, adequate lighting to reduce sundowning, do <b>not</b> argue or quiz the patient ("do you remember me?")</li>
      <li>Safety: <b>wandering</b> is the greatest risk — use an identification bracelet, door alarms, secured exits, remove car keys and stove knobs, supervise medication and hot water</li>
      <li>Support the <b>caregiver</b>: caregiver burnout, respite care and support groups are frequently the correct answer</li>
      <li>An elderly patient with Alzheimer's who has <b>bruises and repeated unexplained injuries</b> → suspect <b>elder abuse or neglect</b>: interview the patient alone, document objectively and report it as required by law</li>
      <li>Medications: cholinesterase inhibitors (donepezil, rivastigmine) and memantine <b>slow</b> the decline but do not cure it</li>
    </ul>
  </section>

  <section class="topic" id="h-substance" dir="ltr">
    <h3>11. Substance Use &amp; Withdrawal</h3>
    <ul>
      <li><b>Alcohol withdrawal</b>: begins 6–24 h after the last drink — tremor, anxiety, sweating, tachycardia, hypertension, nausea. <b>Delirium tremens</b> at 48–72 h — confusion, <b>visual/tactile hallucinations</b>, severe agitation, fever, seizures; it can be fatal</li>
      <li>Treatment: <b>benzodiazepines</b> (chlordiazepoxide/lorazepam) on a CIWA-guided schedule, <b>thiamine before glucose</b> (to prevent Wernicke's encephalopathy), folate and multivitamins, fluids, quiet well-lit room, seizure precautions</li>
      <li><b>Wernicke's encephalopathy</b> (confusion, ataxia, ophthalmoplegia) is reversible with thiamine; <b>Korsakoff psychosis</b> (memory loss with confabulation) is not</li>
      <li><b>Disulfiram</b>: causes severe flushing, vomiting and hypotension with any alcohol — including mouthwash, cough syrup, sauces and aftershave. Teach the patient to read every label</li>
      <li><b>Opioid overdose</b>: <b>pinpoint pupils, respiratory depression, coma</b> → antidote <b>naloxone</b>. Withdrawal is very unpleasant but not usually life-threatening — yawning, lacrimation, dilated pupils, cramps, diarrhoea, gooseflesh</li>
      <li><b>Stimulant (amphetamine/methylphenidate/cocaine) overdose</b>: agitation, dilated pupils, tachycardia, hypertension, hyperthermia, chest pain, seizure and psychosis → supportive care, cooling, benzodiazepines, cardiac monitoring</li>
      <li>Attitude: be <b>matter-of-fact and non-judgemental</b>, set firm limits, confront denial and manipulation consistently, and involve the family and a support group (Alcoholics/Narcotics Anonymous)</li>
    </ul>
  </section>

  <section class="topic" id="h-crisis" dir="ltr">
    <h3>12. Suicide, Aggression &amp; Restraint</h3>
    <h4>Suicide risk</h4>
    <ul>
      <li><b>Always ask directly</b>: "Are you thinking of killing yourself? Do you have a plan?" Asking does <b>not</b> plant the idea — it is the single most important assessment</li>
      <li>Highest risk: a <b>specific plan with available means</b>, a previous attempt, hopelessness, giving away possessions, a sudden calm after a period of depression, substance use, recent loss, and living alone</li>
      <li>Interventions: <b>one-to-one continuous observation</b> for active ideation, remove all hazards (belts, laces, sharps, glass, medication), a <b>no-self-harm/safety agreement</b>, involve the family, never promise to keep suicidal plans secret</li>
    </ul>
    <h4>Aggression &amp; de-escalation</h4>
    <div class="sum-algo">
      <span class="sum-algo-title">Escalation ladder — always in this order</span>
      <ol>
        <li><b>Verbal de-escalation</b> — calm quiet voice, keep a safe distance and an open exit, do not touch, acknowledge the feeling, offer choices</li>
        <li><b>Reduce stimulation</b> — move the patient to a quiet low-stimulus area</li>
        <li><b>Offer voluntary PRN medication</b></li>
        <li><b>Seclusion</b> — least restrictive of the physical measures</li>
        <li><b>Restraint</b> — the absolute last resort</li>
      </ol>
    </div>
    <ul>
      <li>Restraint requires a <b>time-limited provider order (never PRN)</b>, continuous or very frequent observation, release and <b>neurovascular/skin checks, toileting, fluids and range of motion every 2 hours</b>, and full documentation of the behaviour, alternatives tried and the patient's response</li>
      <li>Restraining a patient without an order or a genuine emergency is <b>false imprisonment</b></li>
    </ul>
  </section>

  <section class="topic" id="h-personality" dir="ltr">
    <h3>13. Personality Disorders</h3>
    <ul>
      <li><b>Cluster A — odd/eccentric</b>: paranoid (suspicious, mistrustful), schizoid (detached loner), schizotypal (magical thinking, odd beliefs)</li>
      <li><b>Cluster B — dramatic/erratic</b>: <b>borderline</b> (unstable relationships, fear of abandonment, self-harm, <b>splitting</b>), antisocial (disregard for rights, no remorse, manipulative), histrionic (attention-seeking), narcissistic (grandiose, needs admiration)</li>
      <li><b>Cluster C — anxious/fearful</b>: avoidant, dependent, obsessive-compulsive personality</li>
      <li>Key nursing strategy for <b>borderline and antisocial</b> patients: <b>set clear, firm, consistent limits and make sure the whole team applies them identically</b> — inconsistency feeds splitting and manipulation. Be matter-of-fact, avoid rescuing or personal disclosure, and address self-harm as a safety priority</li>
    </ul>
  </section>

  <section class="topic" id="h-therapy" dir="ltr">
    <h3>14. Therapies &amp; Legal Issues</h3>
    <ul>
      <li><b>Milieu therapy</b>: the whole ward environment is used as the treatment — structure, routine, safety, group norms and peer feedback</li>
      <li><b>Cognitive behavioural therapy</b>: identifies and challenges distorted thoughts; the evidence-based first-line psychotherapy for depression, anxiety, OCD and PTSD</li>
      <li><b>Behaviour therapy</b>: systematic desensitisation, flooding, aversion therapy, token economy, positive reinforcement</li>
      <li><b>Group therapy</b> gives universality ("I am not the only one") and peer support; <b>family therapy</b> treats the family system</li>
      <li><b>Electroconvulsive therapy (ECT)</b>: for severe treatment-resistant depression, especially with psychosis or refusal to eat, and for catatonia. Pre-ECT — informed consent, <b>NPO after midnight</b>, remove dentures/jewellery, empty the bladder, atropine, anaesthetic and a muscle relaxant. Post-ECT — <b>side-lying position, monitor the airway and vital signs, reorient frequently</b>. The commonest side effects are <b>temporary confusion and short-term memory loss</b></li>
      <li><b>Self-awareness</b> — the nurse knowing their <b>own strengths, weaknesses, values and biases</b> — is the foundation of a therapeutic relationship</li>
      <li><b>Transference</b> = the patient projects feelings about someone else onto the nurse. <b>Counter-transference</b> = the nurse's emotional reaction to the patient; recognise it and seek supervision</li>
      <li>Phases of the nurse-patient relationship: <b>pre-orientation → orientation (establish trust, set the contract) → working (the bulk of the therapeutic work) → termination (planned from the start)</b></li>
      <li>Legal: patients retain the <b>right to refuse treatment</b> unless committed and legally determined to lack capacity; <b>voluntary</b> admission allows the patient to request discharge; <b>involuntary</b> admission requires danger to self or others. Confidentiality is broken only for a serious, credible <b>threat to an identified person</b> (duty to warn) or suspected abuse</li>
    </ul>
    <div class="sum-key">
      <span class="sum-key-title">نقاط امتحانية</span>
      <ul>
        <li>A nurse recognising her own strengths and weaknesses is demonstrating <b>self-awareness</b>.</li>
        <li>After ECT the priority is <b>airway and side-lying positioning</b>, then reorientation.</li>
      </ul>
    </div>
  </section>
</div>
`;
