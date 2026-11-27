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
// Dental track and medicine specialties
import restorativeDentistry from './restorativeDentistry.js';
import endodontics from './endodontics.js';
import periodontics from './periodontics.js';
import oralSurgery from './oralSurgery.js';
import oralMedicineAndRadiology from './oralMedicineAndRadiology.js';
import medicalDentistry from './medicalDentistry.js';
import pediatricDentistry from './pediatricDentistry.js';
import orthodontics from './orthodontics.js';
import removableProsthodontics from './removableProsthodontics.js';
import fixedProsthodontics from './fixedProsthodontics.js';
import implantDentistry from './implantDentistry.js';
import dentalMaterials from './dentalMaterials.js';
import professionalismAndInfectionControl from './professionalismAndInfectionControl.js';
import pulmonology from './pulmonology.js';
import nephrology from './nephrology.js';
import neurology from './neurology.js';
import gastroenterology from './gastroenterology.js';
import hematology from './hematology.js';
import endocrinologyInfectious from './endocrinologyInfectious.js';
import rheumatology from './rheumatology.js';

const summaryContent = {
    'restorative-dentistry': restorativeDentistry,
    endodontics,
    periodontics,
    'oral-surgery': oralSurgery,
    'oral-medicine-and-radiology': oralMedicineAndRadiology,
    'medical-dentistry': medicalDentistry,
    'pediatric-dentistry': pediatricDentistry,
    orthodontics,
    'removable-prosthodontics': removableProsthodontics,
    'fixed-prosthodontics': fixedProsthodontics,
    'implant-dentistry': implantDentistry,
    'dental-materials': dentalMaterials,
    'professionalism-and-infection-control': professionalismAndInfectionControl,
    pulmonology,
    nephrology,
    neurology,
    gastroenterology,
    hematology,
    'endocrinology-infectious': endocrinologyInfectious,
    rheumatology,
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
