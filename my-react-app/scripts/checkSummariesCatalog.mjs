// Smoke test for the per-track summaries catalog (async since the content was
// split into per-track chunks). Verifies both tracks load, the guided path is
// built and memoised, deep links resolve, and — the invariant that matters —
// that a slug from one track never resolves for a student on the other.
//
//   node scripts/checkSummariesCatalog.mjs

import { loadPath, EMPTY_PATH_SHAPE } from '../src/components/summaries/pathMeta.js';
import { loadSections, findSubtopic } from '../src/components/summaries/content/index.js';

let bad = 0;
const ok = (c, m) => { console.log((c?'  ok   ':'  FAIL ')+m); if(!c) bad++; };

ok(EMPTY_PATH_SHAPE.totalSteps === 0 && Array.isArray(EMPTY_PATH_SHAPE.milestones),
   'EMPTY_PATH_SHAPE is fully shaped and empty');

for (const track of ['medical','nursing']) {
  const secs = await loadSections(track);
  const p = await loadPath(track);
  ok(secs.length > 0, `${track}: ${secs.length} sections load`);
  ok(p.totalSteps > 0, `${track}: path has ${p.totalSteps} steps, ${p.totalQuestions} questions`);
  ok(p.milestones.length === secs.length, `${track}: one milestone per section`);
  ok(Object.keys(p.stepById).length === p.totalSteps, `${track}: stepById complete`);
  ok(await loadPath(track) === p, `${track}: path is memoised (same object)`);

  // deep link resolves within the track...
  const sub = secs[0].subtopics[0];
  const hit = await findSubtopic(sub.id, track);
  ok(hit && hit.subtopic.id === sub.id, `${track}: deep link "${sub.id}" resolves`);
  ok(await findSubtopic(secs[0].id, track) !== null, `${track}: section id resolves`);
  ok(await findSubtopic('no-such-slug', track) === null, `${track}: unknown slug -> null`);
}

// ...and must NOT leak across tracks
const medSecs = await loadSections('medical');
const nurSecs = await loadSections('nursing');
ok(await findSubtopic(medSecs[0].subtopics[0].id, 'nursing') === null,
   'a medical slug does not resolve for a nursing student');
ok(await findSubtopic(nurSecs[0].subtopics[0].id, 'medical') === null,
   'a nursing slug does not resolve for a medical student');

console.log(bad ? `\n${bad} FAILED` : '\nall passed');
process.exit(bad?1:0);
