// Aggregated HTML content for topic summaries, keyed by summary slug.
// Imported by app.js and synced into summaries.content_html on startup.
import surgery from './surgery.js';
import pediatrics from './pediatrics.js';
import medicine from './medicine.js';
import obgyn from './obgyn.js';
// Sub-topic decks
import cardiology from './cardiology.js';
import trauma from './trauma.js';
import neonatology from './neonatology.js';
import highRiskObstetrics from './highRiskObstetrics.js';

const summaryContent = {
    surgery,
    pediatrics,
    medicine,
    obgyn,
    cardiology,
    trauma,
    neonatology,
    'high-risk-obstetrics': highRiskObstetrics,
};

export default summaryContent;
