/**
 * Where operational mail goes.
 *
 * Every owner-facing notification — payments, errors, reports, question
 * reports, contact-form submissions, suggestions, admin account creation —
 * lands in ONE inbox. It used to be split between two addresses, which meant
 * some alerts silently went to a mailbox that wasn't being read.
 *
 * Import from here rather than writing an address inline, so there is exactly
 * one place to change it.
 */

/** The owner's inbox. Everything operational goes here. */
export const OWNER_EMAIL = process.env.OWNER_EMAIL || 'alshraky3@gmail.com';

/**
 * Recipients for backend error alerts. Defaults to the owner; DEVELOPER_EMAILS
 * (comma-separated) can add others without touching code.
 */
export const developerEmails = () => {
    const raw = process.env.DEVELOPER_EMAILS;
    const list = raw
        ? raw.split(',').map((s) => s.trim()).filter(Boolean)
        : [OWNER_EMAIL];
    return list.length ? list : [OWNER_EMAIL];
};
