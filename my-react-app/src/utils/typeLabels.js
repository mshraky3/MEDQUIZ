// Arabic display names for the raw question_type values stored in the DB.
// Single source of truth — import this instead of redefining the map.
export const TYPE_AR = {
    pediatric: 'الأطفال',
    'obstetrics and gynecology': 'النساء والولادة',
    medicine: 'الباطنة',
    surgery: 'الجراحة'
};

export function getTypeLabel(type) {
    return TYPE_AR[type] || type;
}
