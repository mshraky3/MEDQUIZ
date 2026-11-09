/**
 * Owner mails that arrive from a public form: contact form and suggestion.
 * Built on the shared owner layout (ownerMail.js). Everything a visitor typed is escaped there.
 */
import { renderOwnerMail, ADMIN_LINKS } from './ownerMail.js';

const CATEGORY_LABELS = {
    feature: 'New feature', improvement: 'Improvement', ui: 'UI / design',
    content: 'Content / questions', bug: 'Bug report', other: 'Other',
};
const PRIORITY_LABELS = { low: 'Nice to have', medium: 'Would be helpful', high: 'Really needs this' };

export function buildContactMail({ name, mobile, username, senderTrack, subject, message, when = new Date(), trackKey }) {
    const mail = renderOwnerMail({
        status: 'info',
        title: 'Contact form',
        headline: `${name} wrote to you through the contact form.`,
        sections: [
            { rows: [
                ['Name', name, { bold: true }],
                ['Mobile', mobile],
                ['Account', username || '—'],
                ['Track', senderTrack],
                ['Subject', subject || 'General Inquiry'],
                ['Received', when.toISOString().replace('T', ' ').slice(0, 16) + ' UTC'],
            ] },
            { title: 'Message', quote: message },
        ],
        todo: 'Reply to the student yourself (WhatsApp on the mobile number above, or by e-mail). Replying to this mail goes nowhere.',
        action: { label: 'Open the admin panel', url: ADMIN_LINKS.users },
    });
    return { subject: `📞 Contact Form - ${subject || 'General Inquiry'} [${trackKey || 'unknown'}]`, ...mail };
}

export function buildSuggestionMail({ id, category, priority, title, description, senderTrack, trackKey, when = new Date() }) {
    const mail = renderOwnerMail({
        status: 'info',
        title: 'Suggestion',
        headline: `New suggestion: ${title}`,
        sections: [
            { rows: [
                ['Type', CATEGORY_LABELS[category] || category, { bold: true }],
                ['Priority', PRIORITY_LABELS[priority] || priority || 'medium'],
                ['Track', senderTrack],
                ['Suggestion no.', `#${id}`],
                ['Received', when.toISOString().replace('T', ' ').slice(0, 16) + ' UTC'],
            ] },
            { title: 'Description', quote: description },
        ],
        todo: 'Read it when you have a moment. It is saved; nothing is lost if you leave it.',
        action: { label: 'Open the admin panel', url: ADMIN_LINKS.overview },
    });
    return { subject: `💡 New Suggestion: ${title} [${trackKey || 'unknown'}]`, ...mail };
}
