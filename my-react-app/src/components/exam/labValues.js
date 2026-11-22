/**
 * Adult reference ranges for the lab-values drawer. "Reference, not exam
 * content": only widely used adult ranges, in conventional units with SI in
 * brackets where it helps. Real laboratories differ slightly, which the drawer
 * says. Test names and units are English as written on a lab report (exam
 * material, so never translated); the group headings come from the copy file
 * by `group` key.
 */
export const LAB_GROUPS = [
    {
        group: 'chemistry',
        rows: [
            ['Sodium', '135 to 145', 'mmol/L'],
            ['Potassium', '3.5 to 5.0', 'mmol/L'],
            ['Chloride', '98 to 106', 'mmol/L'],
            ['Bicarbonate', '22 to 28', 'mmol/L'],
            ['Urea nitrogen (BUN)', '7 to 20', 'mg/dL (2.5 to 7.1 mmol/L)'],
            ['Creatinine', '0.6 to 1.2', 'mg/dL (53 to 106 umol/L)'],
            ['Glucose, fasting', '70 to 99', 'mg/dL (3.9 to 5.5 mmol/L)'],
            ['Calcium, total', '8.5 to 10.5', 'mg/dL (2.1 to 2.6 mmol/L)'],
            ['Magnesium', '1.7 to 2.2', 'mg/dL (0.7 to 0.9 mmol/L)'],
            ['Phosphate', '2.5 to 4.5', 'mg/dL (0.8 to 1.45 mmol/L)'],
            ['Albumin', '3.5 to 5.0', 'g/dL'],
            ['Bilirubin, total', '0.1 to 1.2', 'mg/dL'],
            ['HbA1c', 'below 5.7 normal; 6.5 or more diabetes', '%'],
        ],
    },
    {
        group: 'haematology',
        rows: [
            ['Haemoglobin, men', '13.5 to 17.5', 'g/dL'],
            ['Haemoglobin, women', '12.0 to 15.5', 'g/dL'],
            ['Haematocrit, men', '41 to 53', '%'],
            ['Haematocrit, women', '36 to 46', '%'],
            ['White cell count', '4.5 to 11', 'x10^9/L'],
            ['Platelets', '150 to 400', 'x10^9/L'],
            ['MCV', '80 to 100', 'fL'],
            ['INR', '0.8 to 1.1', ''],
            ['PT', '11 to 13.5', 'seconds'],
            ['aPTT', '25 to 35', 'seconds'],
        ],
    },
    {
        group: 'bloodGas',
        rows: [
            ['pH (arterial)', '7.35 to 7.45', ''],
            ['PaCO2', '35 to 45', 'mmHg'],
            ['PaO2', '80 to 100', 'mmHg'],
            ['HCO3 (arterial)', '22 to 26', 'mmol/L'],
        ],
    },
    {
        group: 'endocrineLipids',
        rows: [
            ['TSH', '0.4 to 4.0', 'mIU/L'],
            ['Free T4', '0.8 to 1.8', 'ng/dL'],
            ['Total cholesterol', 'below 200 desirable', 'mg/dL'],
            ['LDL cholesterol', 'below 100 optimal', 'mg/dL'],
            ['HDL cholesterol', 'above 40 (men), above 50 (women)', 'mg/dL'],
            ['Triglycerides', 'below 150', 'mg/dL'],
        ],
    },
];
