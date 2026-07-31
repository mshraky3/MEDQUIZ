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
// Nursing track
import nursingFundamentals from './nursingFundamentals.js';
import medicalSurgicalNursing from './medicalSurgicalNursing.js';
import maternalNewbornNursing from './maternalNewbornNursing.js';
import pediatricNursing from './pediatricNursing.js';
import mentalHealthNursing from './mentalHealthNursing.js';
import nursingPharmacology from './nursingPharmacology.js';

const summaryContent = {
    surgery,
    pediatrics,
    medicine,
    obgyn,
    cardiology,
    trauma,
    neonatology,
    'high-risk-obstetrics': highRiskObstetrics,
    // Nursing track — slugs must match the rows seeded in scripts/insertNursingContent.js
    'nursing-fundamentals': nursingFundamentals,
    'medical-surgical-nursing': medicalSurgicalNursing,
    'maternal-newborn-nursing': maternalNewbornNursing,
    'pediatric-nursing': pediatricNursing,
    'mental-health-nursing': mentalHealthNursing,
    'nursing-pharmacology': nursingPharmacology,
};

export default summaryContent;
