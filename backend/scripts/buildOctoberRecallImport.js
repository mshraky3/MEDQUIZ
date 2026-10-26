/**
 * Turn the October parser's raw output (source-material/clean/medical-octoberrecall.json,
 * produced by parseOctoberRecallPdfs.py) into the import payload
 * (medical-octoberrecall-import.json) for POST /admin/import-recall, and write a
 * counts report (OCTOBER_RECALL_IMPORT_REPORT.json).
 *
 * Same rules as September (see buildSeptemberRecallImport.js): nothing is rewritten.
 * Text, options and answer are copied; a short option list is padded to four with the
 * bank's own placeholder ("didn't recall"); a blank option ("B." with no text) is padded
 * the same way.
 *
 * DIFFERENCE from September: the October PDFs are split by DATE, not by specialty, so
 * the specialty (question_type) is NOT in the source. specialtyFor() files each question
 * with transparent keyword rules (OBGYN, then paediatric, then surgery; everything else
 * medicine) and records HOW (`specialty_basis`: 'keyword' | 'default'). This is a
 * proposal for the owner to approve, not a fact from the PDFs.
 *
 * Usage: node scripts/buildOctoberRecallImport.js
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PAD_OPTION, normalizeText, validateQuestion } from '../services/recallImportService.js';
import { cleanText, damageReason } from './buildSeptemberRecallImport.js';
import { specialtyKeys } from '../config/tracks.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CLEAN = path.join(process.env.SOURCE_MATERIAL_DIR || path.join(__dirname, '..', '..', 'source-material'), 'clean');
const RAW = path.join(CLEAN, 'medical-octoberrecall.json');
const OUT = path.join(CLEAN, 'medical-octoberrecall-import.json');
const REPORT = path.join(CLEAN, 'OCTOBER_RECALL_IMPORT_REPORT.json');

export const SOURCE = 'MedicalOctoberRecall';

// Rules are matched on the stem + options. Order: pregnancy/gynae, then paediatric, then surgery; no hit -> medicine.
// A newborn/infant or a patient aged 14 or under goes to paediatrics unless the text is about the mother (pregnancy words).
const MOTHER = /\b(pregnan\w*|gravida\w*|primigravida|antenatal|prenatal|postpartum|labou?r|lactation|cesarean|caesarean|c-section|placenta\w*|eclampsia|preeclampsia|ectopic|fetal|fetus|ctg|amnio\w*|oligohydramnios|polyhydramnios|\d+\s*weeks? (?:of )?gestation|g\d\s?p\d)\b/i;
const GYN = /\b(menstru\w*|menopaus\w*|a?m+enorr?h?ea|amenorrh\w*|ovar(?:y|ian)|uter(?:us|ine)|endometri\w*|fibroids?|pap smear|contracepti\w*|iud|vagin\w*|vulv\w*|cervical (?:ripening|dilat\w+|length)|bishop score|hysterectomy|hysteroscop\w*|pcos|polycystic|d&c|hirsutism|fsh|infertil\w*|mammogra\w*)\b/i;
const BABY = /\b(neonat\w*|newborn|infant|baby|toddler|pedia|pediatric|paediatric|child|children|boy|girl|adolescent|febrile seizure|small for gestational age|\bsga\b|kawasaki|croup|bronchiolitis|intussusception|pyloric stenosis|apgar|milestone\w*|vaccin\w*|immuni[sz]ation|\d+[- ]?(?:month|months|week|weeks|day|days)[- ]old)\b/i;
const SURG = /\b(surgery|surgical|appendic\w*|appendectomy|cholecyst\w*|hernia|laparotom\w*|laparoscop\w*|trauma\w*|fracture\w*|dislocat\w*|burn[s]?|thyroidectomy|mastectomy|colectomy|bowel obstruction|perforat\w*|splenectomy|gastrectomy|hemorrhoid\w*|anal fissure|fistula|biopsy|mva|rta|motor vehicle|stab(?:bed|bing| wound)|gunshot|chest tube|pneumothorax|atls|fast scan|aortic aneurysm|claudication|varicose|compartment syndrome|amputation|tonsillectomy|otolaryngolog\w*|ophthalm\w*|cataract|glaucoma|pelvic (?:binder|fracture)|high[- ]velocity|fell (?:from|down|off)|falls? (?:down|from)|breast (?:mass|lump|clinic)|nipple discharge|polyp|diverticul\w*|thyroid nodule)\b/i;

function ageUnder15(text) {
    const m = text.match(/\b(\d{1,2})[- ]?(?:years?|yrs?|y)[- ]?(?:old|o)\b/i) || text.match(/\b(\d{1,2})\s?(?:years?|yrs?)\b/i);
    return !!m && Number(m[1]) <= 14;
}

export function specialtyFor(raw) {
    const text = [raw.stem, ...Object.values(raw.options)].join(' ');
    const mother = MOTHER.test(text);
    const baby = BABY.test(text) || ageUnder15(raw.stem);
    if (baby && !mother) return ['pediatric', 'keyword'];
    if (mother || GYN.test(text)) return ['obstetrics and gynecology', 'keyword'];
    if (baby) return ['pediatric', 'keyword'];
    if (SURG.test(text)) return ['surgery', 'keyword'];
    return ['medicine', 'default'];
}

// An option that is only the recaller's "I forgot this one" (?, !!, Arabic-only remark, "can't remember", "not recalled")
// carries no content: it becomes the bank's own placeholder, exactly like a missing option. Real text is never touched.
const FILLER = /^(?:[^A-Za-z0-9]*|(?:can['’]?t|don['’]?t|didn['’]?t)\s+(?:remember|recall)\.?|not recalled\.?|didn['’]?t recall)$/i;
export const isFiller = (t) => FILLER.test(String(t ?? '').trim());

/** Options in letter order, padded to four; blank options become the placeholder; the answer is looked up by LETTER. */
export function buildQuestion(raw) {
    const letters = Object.keys(raw.options).sort();
    const isPad = (l) => l !== raw.answer_letter && (!raw.options[l] || isFiller(raw.options[l]));
    const opts = letters.map((l) => (isPad(l) ? PAD_OPTION : raw.options[l]));
    const padded = Math.max(0, 4 - letters.length) + letters.filter(isPad).length;
    while (opts.length < 4) opts.push(PAD_OPTION);
    if (!(raw.answer_letter in raw.options) || !raw.options[raw.answer_letter]) throw new Error(`answer letter missing for ${raw.qid}`);
    const clean = opts.map(cleanText);
    const [type, basis] = specialtyFor(raw);
    return {
        qid: raw.qid,
        question_text: cleanText(raw.stem),
        option1: clean[0], option2: clean[1], option3: clean[2], option4: clean[3],
        correct_option: cleanText(raw.options[raw.answer_letter]),
        question_type: type,
        explanation: null, // the October PDFs carry no explanation (the page notes are recaller comments, kept in the raw file only)
        is_new: false,
        under_review: !!raw.doubt_marker, // the recaller wrote "not sure / I think / unrelated option ..." in the text
        padded,
        _meta: { specialty_basis: basis, source_file: raw.file, source_page: raw.page },
    };
}

function loadBankTexts() {
    // Offline stand-in for the live bank: every medical JSON the earlier imports came from.
    const files = ['medical-confirmed', 'medical-gameboy', 'medical-midgard', 'medical-monthlyrecall',
        'medical-monthlyrecall-jan-jul-undated', 'medical-monthlyrecall-2026-08', 'medical-septemberrecall-import'];
    const map = new Map();
    for (const f of files) {
        const p = path.join(CLEAN, f + '.json');
        if (!fs.existsSync(p)) continue;
        const j = JSON.parse(fs.readFileSync(p, 'utf8'));
        for (const q of j.questions || j) {
            const k = normalizeText(q.question_text);
            if (!map.has(k)) map.set(k, { file: f, correct: normalizeText(q.correct_option) });
        }
    }
    return map;
}

function main() {
    const raw = JSON.parse(fs.readFileSync(RAW, 'utf8'));
    const reason = (r) => damageReason(r) || (!r.options[r.answer_letter] ? 'the correct option has no text in the PDF' : null);
    const heldBack = raw.questions.map((r) => [r, reason(r)]).filter(([, why]) => why);
    const built = raw.questions.filter((r) => !reason(r)).map(buildQuestion);
    // duplicates inside October itself (same text on several days): keep the first, count the rest
    const seen = new Map();
    const out = [];
    const dupInBatch = [];
    for (const q of built) {
        const k = normalizeText(q.question_text);
        if (seen.has(k)) { dupInBatch.push({ qid: q.qid, sameAs: seen.get(k), answerDiffers: normalizeText(out.find((o) => o.qid === seen.get(k)).correct_option) !== normalizeText(q.correct_option) }); continue; }
        seen.set(k, q.qid);
        out.push(q);
    }
    const bank = loadBankTexts();
    let inBank = 0, answerConflicts = 0;
    for (const q of out) {
        const hit = bank.get(normalizeText(q.question_text));
        if (hit) { inBank += 1; if (hit.correct !== normalizeText(q.correct_option)) answerConflicts += 1; }
    }
    const allowed = specialtyKeys('medical');
    const problems = out.map((q) => [q.qid, validateQuestion(q, allowed)]).filter(([, why]) => why);
    if (problems.length) throw new Error(`invalid after build: ${JSON.stringify(problems.slice(0, 5))}`);
    const by = {}, basis = {};
    out.forEach((q) => { by[q.question_type] = (by[q.question_type] || 0) + 1; basis[q._meta.specialty_basis] = (basis[q._meta.specialty_basis] || 0) + 1; });
    fs.writeFileSync(path.join(CLEAN, 'medical-octoberrecall-import-meta.json'), JSON.stringify(out.map((q) => ({ qid: q.qid, ...q._meta })), null, 1));
    out.forEach((q) => { delete q._meta; });
    fs.writeFileSync(OUT, JSON.stringify({ source: SOURCE, track: 'medical', questions: out }, null, 1));
    const rep = {
        parsedQuestions: raw.questions.length, heldBackDamaged: heldBack.map(([r, why]) => ({ qid: r.qid, file: r.file, page: r.page, why })),
        duplicatesInsideOctober: dupInBatch.length, duplicatesWithDifferentAnswer: dupInBatch.filter((d) => d.answerDiffers).length,
        importable: out.length, alreadyInBankOffline: inBank, newOffline: out.length - inBank, answerConflictsWithBankOffline: answerConflicts,
        padded: out.filter((q) => q.padded).length, underReview: out.filter((q) => q.under_review).length,
        bySpecialty: by, specialtyBasis: basis,
    };
    fs.writeFileSync(REPORT, JSON.stringify(rep, null, 1));
    console.log(JSON.stringify(rep, null, 1));
    console.log(`wrote ${out.length} questions -> ${OUT}`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
