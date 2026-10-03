"""
Parse the seven "SMLE September 2026 recalls" PDFs (source-material/monthly/)
into source-material/clean/medical-septemberrecall.json.

Deterministic text extraction only (PyMuPDF): nothing is generated, guessed or
paraphrased. Question text, options, the answer and the explanation are copied
from the PDF text layer exactly; the only change is that lines the PDF wrapped
are joined with a single space. Page furniture (Telegram link, "page N") and the
subtopic heading lines are dropped.

Every anomaly is reported instead of repaired: a question whose answer letter is
not among its options, whose answer text differs from the option text, or whose
count disagrees with the PDF's own header total.

Usage: python backend/scripts/parseSeptemberRecallPdfs.py
"""
import fitz, glob, json, os, re, sys, collections

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
SRC = os.path.join(ROOT, 'source-material', 'monthly')
OUT = os.path.join(ROOT, 'source-material', 'clean', 'medical-septemberrecall.json')
REPORT = os.path.join(ROOT, 'source-material', 'clean', 'SEPTEMBER_RECALL_REPORT.json')

FURNITURE = re.compile(r'^(Telegram: t\.me/|https://t\.me/|page \d+$|=====PAGE)')
START = re.compile(r'^(\d+)\.\s+(.*)$')
OPT = re.compile(r'^([A-F])\)\s*(.*)$')
ANS = re.compile(r'^Answer:\s*([A-F])\)\s*(.*)$')


def norm(s):
    return re.sub(r'\s+', ' ', s).strip()


def is_heading(line):
    """A subtopic heading: a short title line with no sentence period, e.g. 'Asthma (paediatric)'."""
    line = line.strip()
    return (0 < len(line) < 70 and '.' not in line and line[0].isupper()
            and not OPT.match(line) and not ANS.match(line) and not line.endswith(('?', ',', ';')))


def read_lines(pdf):
    doc = fitz.open(pdf)
    lines = []
    for p in doc:
        for l in p.get_text().split('\n'):
            l = l.rstrip()
            if l and not FURNITURE.match(l.strip()):
                lines.append(l)
    return lines


def tag_end(lines, i):
    """Return (tag_text, last_line_index) if lines[i..] holds '[qNNNNN - ...]' before any option."""
    buf = ''
    for j in range(i, min(i + 14, len(lines))):
        if OPT.match(lines[j]) and j > i:
            return None
        buf += (' ' if buf else '') + lines[j]
        m = re.search(r'\[q(\d+)\s*-\s*([^\]]*)\]', buf)
        if m:
            return m, j
    return None


def parse_file(pdf):
    lines = read_lines(pdf)
    header = ' '.join(lines[:6])
    claim = re.search(r'(\d+) questions sighted', header)
    claim_new = re.search(r'(\d+) new this month', header)
    claimed = int(claim.group(1)) if claim else None

    # 1. find question starts: sequential number AND a [qNNNNN - ...] tag before the first option
    starts = []
    expected = 1
    for i, l in enumerate(lines):
        m = START.match(l)
        if m and int(m.group(1)) == expected and tag_end(lines, i):
            starts.append(i)
            expected += 1
    out, problems = [], []
    heading = None
    prev_heading_for = {}
    for k, s in enumerate(starts):
        e = starts[k + 1] if k + 1 < len(starts) else len(lines)
        block = lines[s:e]
        tag, tl = tag_end(lines, s)
        rel_tag_end = tl - s
        stem_lines = block[:rel_tag_end + 1]
        stem = norm(' '.join(stem_lines))
        stem = re.sub(r'^\d+\.\s*', '', stem)
        stem = norm(re.sub(r'\[q\d+\s*-\s*[^\]]*\]', '', stem))
        qid = 'q' + tag.group(1)
        kind_raw = norm(tag.group(2))
        under_review = 'under review' in kind_raw.lower()
        is_new = kind_raw.upper().startswith('NEW')
        rest = block[rel_tag_end + 1:]
        # options
        options, idx = {}, 0
        cur = None
        while idx < len(rest):
            l = rest[idx]
            if ANS.match(l):
                break
            mo = OPT.match(l)
            if mo and mo.group(1) not in options:
                cur = mo.group(1)
                options[cur] = mo.group(2)
            elif cur:
                options[cur] += ' ' + l.strip()
            else:
                problems.append((qid, 'text between stem and first option', l[:60]))
            idx += 1
        options = {a: norm(b) for a, b in options.items()}
        if idx >= len(rest):
            problems.append((qid, 'no Answer line', ''))
            continue
        ma = ANS.match(rest[idx])
        letter, atext = ma.group(1), ma.group(2)
        idx += 1
        # the answer text may wrap onto following lines: absorb while it is still a prefix of the option text
        opt_text = options.get(letter)
        full = norm(atext)
        if opt_text is not None:
            while norm(full) != opt_text and opt_text.startswith(norm(full)) and idx < len(rest):
                trial = norm(full + ' ' + rest[idx])
                if opt_text.startswith(trial):
                    full = trial
                    idx += 1
                else:
                    break
        answer_mismatch = opt_text is None or norm(full) != opt_text
        expl_lines = rest[idx:]
        # trailing subtopic heading: short line without terminal punctuation directly before the next question
        sub = None
        if k + 1 < len(starts) and expl_lines:
            last = expl_lines[-1].strip()
            if is_heading(last):
                sub = last
                expl_lines = expl_lines[:-1]
        if k == 0:
            pass
        explanation = norm(' '.join(expl_lines))
        # the heading that applies to a question is the one stated BEFORE it
        out.append({
            'qid': qid, 'num': k + 1, 'is_new': is_new, 'under_review': under_review,
            'stem': stem, 'options': options, 'answer_letter': letter, 'answer_text': norm(full),
            'answer_mismatch': answer_mismatch, 'explanation': explanation,
            '_heading_after': sub,
        })
    # headings: line stated before question k+1 belongs to question k+1
    cur = None
    # first heading sits before Q1 (between header block and Q1)
    first = lines[starts[0] - 1].strip() if starts and starts[0] > 0 else None
    cur = first if first and is_heading(first) else None
    for q in out:
        q['subtopic'] = cur
        if q['_heading_after']:
            cur = q['_heading_after']
        del q['_heading_after']
    return out, claimed, int(claim_new.group(1)) if claim_new else None, problems


def main():
    all_q, report = [], {}
    for pdf in sorted(glob.glob(os.path.join(SRC, '*.pdf'))):
        name = os.path.basename(pdf)[:-4]
        qs, claimed, claimed_new, problems = parse_file(pdf)
        for q in qs:
            q['file'] = name
        n_new = sum(1 for q in qs if q['is_new'])
        report[name] = {
            'parsed': len(qs), 'claimed_in_pdf': claimed, 'new_parsed': n_new, 'new_claimed': claimed_new,
            'under_review': sum(1 for q in qs if q['under_review']),
            'fewer_than_4_options': sum(1 for q in qs if len(q['options']) < 4),
            'answer_mismatch': [q['qid'] for q in qs if q['answer_mismatch']],
            'answer_letter_not_in_options': [q['qid'] for q in qs if q['answer_letter'] not in q['options']],
            'no_explanation': sum(1 for q in qs if not q['explanation']),
            'problems': problems[:20], 'n_problems': len(problems),
            'subtopics': collections.Counter(q['subtopic'] for q in qs),
        }
        all_q += qs
    json.dump({'source': 'MedicalSeptemberRecall', 'track': 'medical', 'raw': True, 'questions': all_q},
              open(OUT, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    json.dump(report, open(REPORT, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    for name, r in report.items():
        print(f"{name}: parsed {r['parsed']}/{r['claimed_in_pdf']} (new {r['new_parsed']}/{r['new_claimed']}), "
              f"under review {r['under_review']}, <4 options {r['fewer_than_4_options']}, "
              f"answer text != option text {len(r['answer_mismatch'])}, letter missing {len(r['answer_letter_not_in_options'])}, "
              f"no explanation {r['no_explanation']}, problems {r['n_problems']}")
    print('TOTAL', len(all_q))


if __name__ == '__main__':
    sys.stdout.reconfigure(encoding='utf-8')
    main()
