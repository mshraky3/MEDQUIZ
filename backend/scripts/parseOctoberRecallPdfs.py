"""
Parse the October 2026 "monthly recall" PDFs (by Alhomrani) into
source-material/clean/medical-octoberrecall.json (+ OCTOBER_RECALL_REPORT.json).

These PDFs are NOT laid out like September's: one question per PAGE (a slide), no
[qNNNNN] tags, no specialty files, no header totals, and the answer is shown in one
of three ways:  "Answer: B"  /  the correct option repeated as the last line
("B. Start apixaban")  /  "A . MG modified" style.  Many pages are plain pictures
(no text layer); those are NOT read here, they are only counted and listed.

Deterministic text extraction only (PyMuPDF). Nothing is generated or paraphrased.
Question text, options and the answer letter come from the text layer exactly; the
only changes are (1) lines the PDF wrapped are joined with one space and (2) page
furniture (the Telegram link line) and a leading "12." page number are dropped.
Every anomaly is reported instead of repaired.

A page becomes a question only when it has lettered options A, B (and so on) in order
AND exactly one answer. Everything else is listed in the report with the reason
(no_answer, conflicting_answer, two_questions_on_page, ...), so a human decides.

Usage: python backend/scripts/parseOctoberRecallPdfs.py [source_dir] [out_dir]
Default source: SQB/monthly recall ; default out: SQB/source-material/clean
"""
import fitz, glob, json, os, re, sys, collections

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
MAIN = os.environ.get('SQB_MAIN', r'C:\Users\muhmo\Desktop\CODE\Projects\working projects\SQB')
SRC = sys.argv[1] if len(sys.argv) > 1 else os.path.join(MAIN, 'monthly recall')
OUTDIR = sys.argv[2] if len(sys.argv) > 2 else os.path.join(MAIN, 'source-material', 'clean')

FURNITURE = re.compile(r'^\s*https?://t\.me/\S+')
OPT = re.compile(r'^\s*([A-F])\s*[\.\)]\s*(.*)$')
ANS = re.compile(r'^\s*(?:Answer|Ans)\s*[:：]?\s*([A-F])\b\s*[\.\)\-:]?\s*(.*)$', re.I)
TAGGED = re.compile(r'^\s*([A-F])\s*[·•]\s*(.*)$')  # "A · MG modified"
LASTTAG = re.compile(r'^\s*([A-F])(?:\s*[·•]\s*|\s+)(\S.{0,29})$')  # last line only: "B Confirmed", "B (Haemolytic) 522"
ANS_TEXT = re.compile(r'^\s*(?:Answer|Ans)\s*[:：]\s*(\S.*)$', re.I)  # "Answer: Colon" (text, no letter)
BARE = re.compile(r'^\s*([A-F])(?:\s+(?:[·•\-–]\s*)?([A-Z]{1,3}(?:\s+(?:modified|edited))?))?\s*$')  # "B" / "C   GB"
LEAD_NO = re.compile(r'^\s*(?:Q\s*)?\d{1,4}\s*[\.\)]\s+')
INVIS = re.compile('[\u200b-\u200f\u2060\ufeff]')
DOUBT = re.compile(r"not sure|i think|\bidk\b|unrelated|not recalled|don'?t remember|can'?t remember|ما اذكر|\(not sure\)", re.I)


def norm(s):
    return re.sub(r'\s+', ' ', INVIS.sub('', s)).strip()


def key(s):
    return re.sub(r'[^a-z0-9]+', ' ', s.lower()).strip()


def page_lines(text):
    """(line, wrapped) pairs: wrapped = the PDF broke this line itself (it ends with a space)."""
    out = []
    for raw in text.split('\n'):
        t = INVIS.sub('', raw)
        if not t.strip() or FURNITURE.match(t):
            continue
        out.append((t.strip(), t.endswith(' ')))
    return out


def parse_page(lines):
    """Return (question_dict | None, reason | None)."""
    idx = [i for i, (l, _) in enumerate(lines) if OPT.match(l)]
    # options must start with A then B
    first = None
    for i in idx:
        if OPT.match(lines[i][0]).group(1) == 'A' and any(OPT.match(lines[j][0]).group(1) == 'B' for j in idx if j > i):
            first = i
            break
    if first is None:
        return None, 'no_lettered_options'
    stem_lines = [l for l, _ in lines[:first]]
    stem = norm(' '.join(stem_lines))
    stem = norm(LEAD_NO.sub('', stem, count=1))
    options, order, cur = {}, [], None
    answers, notes = [], []
    prev_wrapped = False
    extra_option_start = False
    for i in range(first, len(lines)):
        l, wrapped = lines[i]
        ma, mt, mo = ANS.match(l), TAGGED.match(l), OPT.match(l)
        if not ma and order and not mo:
            mx = ANS_TEXT.match(l)
            cand = norm(mx.group(1)) if mx else (norm(l) if not prev_wrapped else '')
            hit = [k for k, v in options.items() if cand and key(v) == key(cand)] if cand else []
            if len(hit) == 1 and (mx or i == len(lines) - 1) and (cur is None or i == len(lines) - 1):
                answers.append((hit[0], norm(options[hit[0]]), 'answer_by_text'))
                cur = None
                prev_wrapped = wrapped
                continue
        if ma:
            answers.append((ma.group(1), norm(ma.group(2)), 'answer_line'))
            cur = None
        elif mo and mo.group(1) not in options and ((not order and mo.group(1) == 'A') or (order and ord(mo.group(1)) == ord(order[-1]) + 1)):
            cur = mo.group(1)
            options[cur] = mo.group(2)
            order.append(cur)
        elif mo and mo.group(1) in options:
            # a letter we already have: the repeated correct option (answer), unless its text differs and it is a new "A"
            t = norm(mo.group(2))
            o = norm(options[mo.group(1)])
            if t == o or o.startswith(t) or t.startswith(o) or (not t):
                answers.append((mo.group(1), t, 'repeated_option'))
            elif mo.group(1) == 'A':
                extra_option_start = True
            else:
                answers.append((mo.group(1), t, 'repeated_option_differs'))
            cur = None
        elif mt and order and mt.group(1) in options:
            answers.append((mt.group(1), norm(mt.group(2)), 'tagged_letter'))
            cur = None
        elif order and not prev_wrapped and BARE.match(l) and BARE.match(l).group(1) in options:
            answers.append((BARE.match(l).group(1), '', 'bare_letter'))
            cur = None
        elif order and not prev_wrapped and i == len(lines) - 1 and LASTTAG.match(l) and LASTTAG.match(l).group(1) in options:
            answers.append((LASTTAG.match(l).group(1), '', 'letter_with_tag'))
            cur = None
        elif cur and prev_wrapped:
            options[cur] += ' ' + l
        else:
            notes.append(l)
            cur = None
        prev_wrapped = wrapped
    if extra_option_start:
        return None, 'two_questions_on_page'
    options = {k: norm(v) for k, v in options.items()}
    if len(options) < 2 or order != sorted(order) or order[0] != 'A':
        return None, 'options_not_in_order'
    letters = {a[0] for a in answers}
    if not answers:
        return {'stem': stem, 'options': options, 'notes': [norm(n) for n in notes]}, 'no_answer'
    if len(letters) > 1:
        return None, 'conflicting_answer'
    letter = answers[0][0]
    if letter not in options:
        return None, 'answer_letter_not_in_options'
    if any(a[2] == 'repeated_option_differs' for a in answers):
        return None, 'repeated_option_text_differs'
    atext = max((a[1] for a in answers if a[2] in ('answer_line', 'repeated_option', 'answer_by_text')), key=len, default='')
    ot = options[letter]
    mismatch = bool(atext) and not (key(ot).startswith(key(atext)) or key(atext).startswith(key(ot)) or key(atext) in key(ot) or key(ot) in key(atext))
    if len(re.findall(r'[A-Za-z]', stem)) < 15:
        return None, 'stem_is_not_a_question'
    if any(re.search(r'(^|\s)[B-F]\s*[\.\)]\s', v) for v in options.values()):
        return None, 'option_text_contains_another_option_marker'
    blank = [k for k, v in options.items() if not v]
    return {
        'stem': stem, 'options': options, 'answer_letter': letter, 'answer_text': ot,
        'answer_form': answers[0][2], 'answer_text_disagrees': mismatch,
        'blank_options': blank, 'notes': [norm(n) for n in notes],
        'doubt_marker': bool(DOUBT.search(stem) or any(DOUBT.search(v) for v in options.values()) or any(DOUBT.search(n) for n in notes)),
    }, None


def answer_from_next_page(lines, options):
    """The answer page that follows a question page: ONLY option-like lines that match exactly."""
    found = set()
    texts = [l for l, _ in lines]
    if not texts or len(texts) > 4:
        return None
    for l in texts:
        ma, mo = ANS.match(l), OPT.match(l)
        if ma and ma.group(1) in options:
            found.add(ma.group(1))
        elif mo and mo.group(1) in options:
            t, o = norm(mo.group(2)), options[mo.group(1)]
            if key(t) == key(o) or (key(t) and key(o).startswith(key(t))):
                found.add(mo.group(1))
            else:
                return None
        elif BARE.match(l) and BARE.match(l).group(1) in options:
            found.add(BARE.match(l).group(1))
        else:
            hit = [k for k, v in options.items() if key(v) == key(l)]
            if len(hit) == 1:
                found.add(hit[0])
            else:
                return None
    return found.pop() if len(found) == 1 else None


def main():
    out, report, held, other = [], {}, [], []
    for pdf in sorted(glob.glob(os.path.join(SRC, '*.pdf'))):
        name = os.path.basename(pdf)[:-4].strip()
        doc = fitz.open(pdf)
        r = collections.Counter()
        r['pages'] = len(doc)
        pages = [page_lines(pg.get_text()) for pg in doc]
        pending = None   # a no_answer question waiting for the next page
        for pno, page in enumerate(doc):
            lines = pages[pno]
            if pending is not None:
                letter = answer_from_next_page(lines, pending['options']) if lines else None
                pq, pq_pno = pending, pno
                pending = None
                if letter:
                    pq.update({'answer_letter': letter, 'answer_text': pq['options'][letter], 'answer_form': 'answer_on_next_page',
                               'answer_text_disagrees': False, 'file': name, 'page': pq_pno,
                               'blank_options': [k for k, v in pq['options'].items() if not v],
                               'doubt_marker': bool(DOUBT.search(pq['stem']) or any(DOUBT.search(v) for v in pq['options'].values()))})
                    out.append(pq)
                    r['questions'] += 1
                    r['answer_on_next_page'] += 1
                    continue
                held.append({'file': name, 'page': pq_pno, 'why': 'no_answer', 'text': norm(' '.join([pq['stem']] + list(pq['options'].values())))[:400]})
                r['held_no_answer'] += 1
            if pno == 0 and not any(OPT.match(l) for l, _ in lines):
                r['title_page'] += 1
                continue
            if not lines:
                r['image_only_page'] += 1
                other.append({'file': name, 'page': pno + 1, 'kind': 'image_only'})
                continue
            q, why = parse_page(lines)
            if q and not why:
                q['file'], q['page'] = name, pno + 1
                out.append(q)
                r['questions'] += 1
            elif why == 'no_answer':
                pending = q  # the answer may be on the NEXT page
            elif why == 'no_lettered_options':
                r['text_page_without_options'] += 1
                other.append({'file': name, 'page': pno + 1, 'kind': 'text_without_options', 'text': norm(' '.join(l for l, _ in lines))[:300]})
            else:
                r['held_' + why] += 1
                held.append({'file': name, 'page': pno + 1, 'why': why, 'text': norm(' '.join(l for l, _ in lines))[:400]})
        if pending is not None:
            held.append({'file': name, 'page': len(doc), 'why': 'no_answer', 'text': norm(pending['stem'])[:400]})
            r['held_no_answer'] += 1
        report[name] = dict(r)
    os.makedirs(OUTDIR, exist_ok=True)
    for i, q in enumerate(out):
        q['qid'] = f"oct{i + 1:05d}"
    json.dump({'source': 'MedicalOctoberRecall', 'track': 'medical', 'raw': True, 'questions': out},
              open(os.path.join(OUTDIR, 'medical-octoberrecall.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    json.dump({'per_file': report, 'held_pages': held, 'other_pages': other},
              open(os.path.join(OUTDIR, 'OCTOBER_RECALL_REPORT.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    for n, r in report.items():
        print(n, dict(r))
    print('TOTAL questions', len(out), '| held pages', len(held), '| other pages', len(other))
    print('held by reason', dict(collections.Counter(h['why'] for h in held)))
    print('answer forms', dict(collections.Counter(q['answer_form'] for q in out)))
    print('fewer than 4 options', sum(1 for q in out if len(q['options']) < 4),
          '| blank option', sum(1 for q in out if q['blank_options']),
          '| answer text disagrees', sum(1 for q in out if q['answer_text_disagrees']),
          '| with notes', sum(1 for q in out if q['notes']), '| doubt markers', sum(1 for q in out if q['doubt_marker']))


if __name__ == '__main__':
    sys.stdout.reconfigure(encoding='utf-8')
    main()
