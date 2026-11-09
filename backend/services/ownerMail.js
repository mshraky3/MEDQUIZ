/**
 * ONE layout for every mail the OWNER receives (never used for student mail).
 * ------------------------------------------------------------------
 * Table based, inline CSS, 600 px, no images (nothing to host, nothing to block),
 * readable on a phone, and safe in dark mode: the colours are written inline for
 * clients that ignore <style>, and a prefers-color-scheme block re-colours the
 * classes for clients that honour it.
 *
 * Every mail has the same shape:
 *   status strip (green OK / amber attention / red urgent / blue info)
 *   one plain sentence: the headline
 *   details (key/value tables, lists, tables of checks)
 *   "What to do" (or "Nothing to do")
 *   optional button that links to a REAL admin page
 *
 * renderOwnerMail() returns { html, text }: the plain-text part is built from the
 * same data, so the two can never drift apart. All user-supplied text is escaped
 * here; Arabic text gets dir="auto" so it renders right-to-left on its own.
 *
 * Sending still goes through mailer.js (the gateway). This file only builds text.
 */

export const SITE_URL = 'https://www.smle-question-bank.com';

/** Real admin pages (see my-react-app admin navigation). Never link to a page that does not exist. */
export const ADMIN_LINKS = {
    overview: `${SITE_URL}/admin`,
    growth: `${SITE_URL}/admin/growth`,
    accounting: `${SITE_URL}/admin/accounting`,
    users: `${SITE_URL}/admin/users`,
    reports: `${SITE_URL}/admin/reports`,
};

/** status -> strip colour, light-grey tint, label. */
export const STATUS = {
    ok: { color: '#16a34a', tint: '#f0fdf4', label: 'ALL GOOD' },
    attention: { color: '#d97706', tint: '#fffbeb', label: 'NEEDS A LOOK' },
    urgent: { color: '#dc2626', tint: '#fef2f2', label: 'URGENT' },
    info: { color: '#2563eb', tint: '#eff6ff', label: 'INFO' },
};

export function esc(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

/** Escaped, newlines kept. */
export function escMultiline(value) {
    return esc(value).replace(/\r?\n/g, '<br>');
}

const FONT = "-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";

/** Builds one detail block. Kinds: rows [[label,value]], table {head,rows}, text, list, checks. */
function renderSection(sec) {
    const title = sec.title
        ? `<div class="m-muted" style="font-size:12px;font-weight:700;letter-spacing:.6px;text-transform:uppercase;color:#64748b;padding:18px 0 6px">${esc(sec.title)}</div>`
        : '';
    let body = '';
    if (sec.rows) {
        body = `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse">${sec.rows
            .map(([k, v, opts]) => `<tr>
              <td class="m-muted m-line" valign="top" style="padding:7px 12px 7px 0;border-bottom:1px solid #e2e8f0;font-size:14px;color:#64748b;width:38%">${esc(k)}</td>
              <td class="m-text m-line" dir="auto" valign="top" style="text-align:left;padding:7px 0;border-bottom:1px solid #e2e8f0;font-size:14px;color:#0f172a;${opts?.bold ? 'font-weight:700;' : ''}${opts?.mono ? 'font-family:Consolas,Menlo,monospace;font-size:12px;' : ''}">${esc(v)}</td>
            </tr>`).join('')}</table>`;
    } else if (sec.checks) {
        // [{ok:true|false, name, meaning, detail}] - a tick or a count for each question asked.
        body = `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse">${sec.checks
            .map((c) => {
                const mark = c.state === 'ok' ? '&#10003;' : c.state === 'known' ? '&#9679;' : '!';
                const col = c.state === 'ok' ? '#16a34a' : c.state === 'known' ? '#64748b' : (c.state === 'urgent' ? '#dc2626' : '#d97706');
                return `<tr>
                  <td class="m-line" valign="top" style="padding:9px 10px 9px 0;border-bottom:1px solid #e2e8f0;width:26px;font-size:16px;font-weight:700;color:${col}">${mark}</td>
                  <td class="m-line" valign="top" style="padding:9px 0;border-bottom:1px solid #e2e8f0;font-size:14px;line-height:1.45">
                    <span class="m-text" style="color:#0f172a;font-weight:600">${esc(c.name)}</span>
                    <span style="color:${col};font-weight:700"> &middot; ${esc(c.result)}</span><br>
                    <span class="m-muted" style="color:#64748b;font-size:13px">${esc(c.meaning)}</span>
                    ${c.detail ? `<br><span class="m-text" style="color:#0f172a;font-size:13px">${escMultiline(c.detail)}</span>` : ''}
                  </td></tr>`;
            }).join('')}</table>`;
    } else if (sec.list) {
        body = `<ul style="margin:0;padding:0 0 0 20px;font-size:14px;line-height:1.55;color:#0f172a" class="m-text">${sec.list.map((i) => `<li dir="auto">${esc(i)}</li>`).join('')}</ul>`;
    } else if (sec.quote != null) {
        body = `<div class="m-quote" dir="auto" style="background:#f1f5f9;border-radius:8px;padding:12px 14px;font-size:14px;line-height:1.55;color:#0f172a">${escMultiline(sec.quote)}</div>`;
    } else if (sec.text != null) {
        body = `<div class="m-text" dir="auto" style="font-size:14px;line-height:1.55;color:#0f172a">${escMultiline(sec.text)}</div>`;
    }
    return title + body;
}

function sectionToText(sec) {
    const out = [];
    if (sec.title) out.push(sec.title.toUpperCase());
    if (sec.rows) for (const [k, v] of sec.rows) out.push(`  ${k}: ${v}`);
    if (sec.checks) {
        for (const c of sec.checks) {
            const mark = c.state === 'ok' ? '[ok]' : c.state === 'known' ? '[known]' : '[!]';
            out.push(`  ${mark} ${c.name} - ${c.result}`);
            out.push(`      ${c.meaning}`);
            if (c.detail) out.push(`      ${c.detail}`);
        }
    }
    if (sec.list) for (const i of sec.list) out.push(`  - ${i}`);
    if (sec.quote != null) out.push(...String(sec.quote).split(/\r?\n/).map((l) => `  > ${l}`));
    if (sec.text != null) out.push(String(sec.text));
    return out.join('\n');
}

/**
 * @param {object} m
 * @param {'ok'|'attention'|'urgent'|'info'} m.status
 * @param {string} m.title        small label next to the strip, e.g. "Integrity check"
 * @param {string} m.headline     ONE plain sentence, the first thing read
 * @param {string} [m.intro]      optional second sentence of context
 * @param {Array}  [m.sections]   see renderSection
 * @param {string} [m.todo]       "what to do"; omit for "Nothing to do."
 * @param {{label:string,url:string}} [m.action]
 * @param {string} [m.footer]
 */
export function renderOwnerMail(m) {
    const st = STATUS[m.status] || STATUS.info;
    const todo = m.todo || 'Nothing to do.';
    const sections = m.sections || [];
    const preheader = esc(m.headline);

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="color-scheme" content="light dark">
<meta name="supported-color-schemes" content="light dark">
<title>${esc(m.title)}</title>
<style>
  @media only screen and (max-width:620px) { .m-wrap { width:100% !important; } .m-pad { padding-left:18px !important; padding-right:18px !important; } }
  @media (prefers-color-scheme: dark) {
    .m-bg { background:#0b1220 !important; }
    .m-card { background:#111a2e !important; border-color:#24324d !important; }
    .m-text { color:#e5e9f2 !important; }
    .m-muted { color:#94a3b8 !important; }
    .m-line { border-color:#24324d !important; }
    .m-quote { background:#1a2540 !important; color:#e5e9f2 !important; }
    .m-todo { background:#1a2540 !important; }
    .m-foot { color:#7d8aa5 !important; }
  }
</style>
</head>
<body class="m-bg" style="margin:0;padding:0;background:#f1f5f9;font-family:${FONT}">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent">${preheader}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="m-bg" style="background:#f1f5f9">
<tr><td align="center" style="padding:20px 10px">
  <table role="presentation" width="600" cellpadding="0" cellspacing="0" class="m-wrap m-card" style="width:600px;max-width:100%;background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden">
    <tr><td bgcolor="${st.color}" style="background:${st.color};padding:12px 28px;font-size:12px;font-weight:700;letter-spacing:1px;color:#ffffff" class="m-pad">
      SQB &middot; ${esc(m.title).toUpperCase()} <span style="float:right">${st.label}</span>
    </td></tr>
    <tr><td class="m-pad" style="padding:24px 28px 8px">
      <div class="m-text" dir="ltr" style="font-size:21px;line-height:1.35;font-weight:700;color:#0f172a">${esc(m.headline)}</div>
      ${m.intro ? `<div class="m-muted" dir="ltr" style="margin-top:8px;font-size:14px;line-height:1.55;color:#475569">${escMultiline(m.intro)}</div>` : ''}
    </td></tr>
    <tr><td class="m-pad" style="padding:0 28px 8px">${sections.map(renderSection).join('')}</td></tr>
    <tr><td class="m-pad" style="padding:14px 28px 6px">
      <div class="m-todo" style="background:${st.tint};border-left:4px solid ${st.color};border-radius:6px;padding:12px 14px">
        <div class="m-muted" style="font-size:12px;font-weight:700;letter-spacing:.6px;text-transform:uppercase;color:#64748b;margin-bottom:4px">${m.todo ? 'What to do' : 'Nothing to do'}</div>
        <div class="m-text" style="font-size:14px;line-height:1.55;color:#0f172a">${escMultiline(todo)}</div>
      </div>
    </td></tr>
    ${m.action ? `<tr><td class="m-pad" style="padding:14px 28px 4px"><a href="${esc(m.action.url)}" style="display:inline-block;background:#2563eb;color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;padding:11px 20px;border-radius:8px">${esc(m.action.label)} &rarr;</a></td></tr>` : ''}
    <tr><td class="m-pad m-foot" style="padding:22px 28px 22px;font-size:12px;line-height:1.5;color:#94a3b8">${esc(m.footer || 'Sent automatically by the SQB server to you only. Nothing was changed by this mail.')}</td></tr>
  </table>
</td></tr>
</table>
</body>
</html>`;

    const textParts = [
        `SQB - ${m.title} [${st.label}]`,
        '',
        m.headline,
    ];
    if (m.intro) textParts.push('', m.intro);
    for (const s of sections) textParts.push('', sectionToText(s));
    textParts.push('', m.todo ? `WHAT TO DO\n  ${todo}` : 'NOTHING TO DO');
    if (m.action) textParts.push('', `${m.action.label}: ${m.action.url}`);
    textParts.push('', '--', m.footer || 'Sent automatically by the SQB server to you only. Nothing was changed by this mail.');

    return { html, text: textParts.join('\n') };
}
