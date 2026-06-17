// Sub-topic: Cardiology (under Medicine). HTML served (gated) to the slide viewer.
export default `
<div class="sum-doc" dir="rtl">
  <div class="sum-head">
    <h2>أمراض القلب — مراجعة عالية العائد</h2>
    <p class="sum-meta">موضوع فرعي ضمن الباطنة. يغطي القلب الإقفاري · فشل القلب · الصمامات · اضطرابات النظم · الضغط والدهون · التامور والشغاف. للمراجعة الامتحانية فقط.</p>
  </div>

  <section class="topic" dir="ltr">
    <h3>Acute Coronary Syndrome</h3>
    <ul>
      <li>Crushing retrosternal pain ± radiation, diaphoresis, dyspnoea; ECG + troponin</li>
      <li><b>STEMI</b>: ST elevation → <b>primary PCI within 90 min</b> (or thrombolysis if PCI unavailable &lt;12 h)</li>
      <li><b>NSTEMI/UA</b>: dual antiplatelet + anticoagulation + risk stratify (GRACE) → early angiography if high risk</li>
      <li>Immediate: MONA-BASH (morphine, O2 if hypoxic, nitrates, aspirin, beta-blocker, ACEi, statin, heparin)</li>
      <li>Inferior MI (II, III, aVF) + hypotension → suspect <b>RV infarct</b> → fluids, avoid nitrates</li>
    </ul>
  </section>

  <section class="topic" dir="ltr">
    <h3>Stable Angina &amp; Testing</h3>
    <ul>
      <li>Exertional pain relieved by rest, normal resting ECG/enzymes → <b>exercise stress ECG</b></li>
      <li>Unable to exercise (e.g. OA, PAD) → pharmacological stress: <b>dobutamine stress echo</b> or vasodilator MPI</li>
      <li>Can't interpret ECG (LBBB, paced, on digoxin) → imaging stress test</li>
      <li>Management: lifestyle + aspirin + statin + beta-blocker/CCB; refractory → angiography ± revascularisation</li>
    </ul>
  </section>

  <section class="topic" dir="ltr">
    <h3>Heart Failure</h3>
    <ul>
      <li><b>HFrEF</b> (EF ≤40%): mortality benefit from ACEi/ARB(or ARNI) + beta-blocker + MRA + <b>SGLT2 inhibitor</b>; loop diuretic for symptoms</li>
      <li><b>HFpEF</b>: concentric LVH + normal EF + HF symptoms → treat HTN/volume + SGLT2i</li>
      <li>Acute pulmonary oedema: sit up, O2, IV furosemide, nitrates (if not hypotensive), CPAP</li>
      <li>BNP/NT-proBNP elevated; echo to assess EF</li>
    </ul>
  </section>

  <section class="topic" dir="ltr">
    <h3>Valvular Heart Disease</h3>
    <table>
      <thead><tr><th>Lesion</th><th>Murmur</th><th>Key</th></tr></thead>
      <tbody>
        <tr><td>Aortic stenosis</td><td>ejection systolic → carotids</td><td>syncope/angina/HF; asymptomatic + normal EF → <b>follow-up echo</b>; symptomatic → TAVR/SAVR</td></tr>
        <tr><td>Aortic regurg</td><td>early diastolic, wide pulse pressure</td><td>collapsing pulse</td></tr>
        <tr><td>Mitral stenosis</td><td>mid-diastolic rumble</td><td>rheumatic; AF, haemoptysis</td></tr>
        <tr><td>Mitral regurg</td><td>pansystolic → axilla</td><td>MV prolapse, post-MI</td></tr>
      </tbody>
    </table>
  </section>

  <section class="topic" dir="ltr">
    <h3>Arrhythmias &amp; Anticoagulation</h3>
    <ul>
      <li><b>Atrial fibrillation</b>: rate control (beta-blocker/CCB) + anticoagulation by <b>CHA₂DS₂-VASc</b>; unstable → synchronised cardioversion</li>
      <li>Suspected embolic event (e.g. acute mesenteric ischaemia) with normal resting ECG/echo → <b>Holter monitor</b> to capture paroxysmal AF</li>
      <li>SVT: vagal manoeuvres → adenosine; VT with pulse → amiodarone (unstable → cardioversion); pulseless VT/VF → defibrillate</li>
      <li><b>HIT</b>: platelets fall ~day 5–6 on heparin + new thrombosis → stop heparin, start <b>Argatroban</b> (not warfarin/platelets)</li>
    </ul>
  </section>

  <section class="topic" dir="ltr">
    <h3>Hypertension &amp; Dyslipidaemia</h3>
    <ul>
      <li>Lifestyle (Mediterranean diet, salt restriction, exercise) first; thresholds/targets individualised (tighter in DM/CKD)</li>
      <li>Hypertensive emergency (end-organ damage) → controlled IV reduction (labetalol, nicardipine)</li>
      <li>Statin = first-line lipid therapy; on max statin with LDL above target → add <b>Ezetimibe</b> (then PCSK9 inhibitor / Evolocumab)</li>
      <li>Secondary HTN clues: young, resistant, hypokalaemia (Conn's), episodic (phaeo), bruit (renal artery)</li>
    </ul>
  </section>

  <section class="topic" dir="ltr">
    <h3>Pericardial &amp; Endocardial Disease</h3>
    <ul>
      <li><b>Acute pericarditis</b>: pleuritic pain relieved by sitting forward, friction rub, diffuse ST elevation + PR depression → NSAIDs + colchicine</li>
      <li><b>Tamponade</b>: Beck's triad (hypotension + muffled HS + raised JVP), pulsus paradoxus → urgent <b>pericardiocentesis</b></li>
      <li><b>Infective endocarditis</b>: fever + new murmur + emboli; Duke criteria; blood cultures + echo (vegetations) → prolonged IV antibiotics</li>
      <li>Aortic dissection: tearing chest→back pain, BP differential → CT angiography; type A → surgery</li>
    </ul>
  </section>
</div>
`;
