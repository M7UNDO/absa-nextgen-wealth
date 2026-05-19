// src/utils/taxCalculations.js

const TAX_TABLES = {
  2027: {
    brackets: [
      { upTo: 245100, base: 0, rate: 0.18, threshold: 0 },
      { upTo: 383100, base: 44118, rate: 0.26, threshold: 245100 },
      { upTo: 530200, base: 79998, rate: 0.31, threshold: 383100 },
      { upTo: 695800, base: 125599, rate: 0.36, threshold: 530200 },
      { upTo: 875000, base: 185215, rate: 0.39, threshold: 695800 },
      { upTo: 1859000, base: 255103, rate: 0.41, threshold: 875000 },
      { upTo: Infinity, base: 658543, rate: 0.45, threshold: 1859000 }
    ],
    rebates: {
      under65: 17820,
      age65To74: 17820 + 9765,
      age75Plus: 17820 + 9765 + 3249
    },
    thresholds: {
      under65: 99000,
      age65To74: 153250,
      age75Plus: 171300
    },
    medicalCredits: {
      firstTwoDependants: 376,
      additionalDependant: 254
    }
  },

  2026: {
    brackets: [
      { upTo: 237100, base: 0, rate: 0.18, threshold: 0 },
      { upTo: 370500, base: 42678, rate: 0.26, threshold: 237100 },
      { upTo: 512800, base: 77362, rate: 0.31, threshold: 370500 },
      { upTo: 673000, base: 121475, rate: 0.36, threshold: 512800 },
      { upTo: 857900, base: 179147, rate: 0.39, threshold: 673000 },
      { upTo: 1817000, base: 251258, rate: 0.41, threshold: 857900 },
      { upTo: Infinity, base: 644489, rate: 0.45, threshold: 1817000 }
    ],
    rebates: {
      under65: 17235,
      age65To74: 17235 + 9444,
      age75Plus: 17235 + 9444 + 3145
    },
    thresholds: {
      under65: 95750,
      age65To74: 148217,
      age75Plus: 165689
    },
    medicalCredits: {
      firstTwoDependants: 364,
      additionalDependant: 246
    }
  }
};

function getAgeBand(age = 30) {
  if (age >= 75) return "age75Plus";
  if (age >= 65) return "age65To74";
  return "under65";
}

export function calculateUIF(monthlyIncome) {
  const UIF_RATE = 0.01;
  const UIF_MONTHLY_CAP = 17712;

  return Math.min(monthlyIncome, UIF_MONTHLY_CAP) * UIF_RATE;
}

export function calculateMedicalTaxCredit(dependants = 0, taxYear = 2027) {
  const table = TAX_TABLES[taxYear];
  const totalPeople = Math.max(0, dependants);

  if (totalPeople === 0) return 0;

  if (totalPeople <= 2) {
    return totalPeople * table.medicalCredits.firstTwoDependants;
  }

  return (
    2 * table.medicalCredits.firstTwoDependants +
    (totalPeople - 2) * table.medicalCredits.additionalDependant
  );
}

export function calculateAnnualTaxBeforeRebates(annualTaxableIncome, taxYear = 2027) {
  const table = TAX_TABLES[taxYear];

  const bracket = table.brackets.find(
    (item) => annualTaxableIncome <= item.upTo
  );

  return bracket.base + (annualTaxableIncome - bracket.threshold) * bracket.rate;
}

export function calculatePAYE({
  monthlyIncome,
  monthlyRetirement = 0,
  age = 30,
  medicalDependants = 0,
  taxYear = 2027
}) {
  const table = TAX_TABLES[taxYear];
  const ageBand = getAgeBand(age);

  const annualIncome = monthlyIncome * 12;

  const annualRetirement = monthlyRetirement * 12;

  // Simplified retirement deduction cap:
  // SARS allows deductions up to 27.5% of remuneration/taxable income,
  // capped annually. This keeps your calculator closer to real-world logic.
  const retirementDeductionCap = Math.min(annualIncome * 0.275, 350000);
  const allowedRetirementDeduction = Math.min(
    annualRetirement,
    retirementDeductionCap
  );

  const annualTaxableIncome = Math.max(
    0,
    annualIncome - allowedRetirementDeduction
  );

  if (annualTaxableIncome <= table.thresholds[ageBand]) {
    return {
      monthlyPAYE: 0,
      annualPAYE: 0,
      annualTaxableIncome,
      allowedRetirementDeduction
    };
  }

  const taxBeforeRebates = calculateAnnualTaxBeforeRebates(
    annualTaxableIncome,
    taxYear
  );

  const rebate = table.rebates[ageBand];
  const annualMedicalCredit =
    calculateMedicalTaxCredit(medicalDependants, taxYear) * 12;

  const annualPAYE = Math.max(
    0,
    taxBeforeRebates - rebate - annualMedicalCredit
  );

  return {
    monthlyPAYE: annualPAYE / 12,
    annualPAYE,
    annualTaxableIncome,
    allowedRetirementDeduction
  };
}

export function calculateNetIncome({
  grossIncome,
  retirement = 0,
  age = 30,
  medicalDependants = 0,
  taxYear = 2027
}) {
  const payeResult = calculatePAYE({
    monthlyIncome: grossIncome,
    monthlyRetirement: retirement,
    age,
    medicalDependants,
    taxYear
  });

  const monthlyUIF = calculateUIF(grossIncome);

  const netIncome = grossIncome - payeResult.monthlyPAYE - monthlyUIF;

  return {
    grossIncome,
    netIncome,
    monthlyPAYE: payeResult.monthlyPAYE,
    monthlyUIF,
    annualPAYE: payeResult.annualPAYE,
    annualTaxableIncome: payeResult.annualTaxableIncome,
    allowedRetirementDeduction: payeResult.allowedRetirementDeduction
  };
}
/*Current tax tables (2026) tables no changes

Taxable income (R)	Rates of tax (R)
1 – 237 100 	18% of taxable income
237 101 – 370 500	42 678 + 26% of taxable income above 237 100
370 501 – 512 800	77 362 + 31% of taxable income above 370 500
512 801 – 673 000	121 475 + 36% of taxable income above 512 800
673 001 – 857 900	179 147 + 39% of taxable income above 673 000
857 901 – 1 817 000	251 258 + 41% of taxable income above 857 900
1 817 001 and above	644 489 + 45% of taxable income above 1 817 000

Tax Rebates: Tax Rebates
25 February 2026 – See changes:

Tax Rebate	 	 	 	 	 
 	2027	2026	   2025 	2024	    2023
Primary	R17 820	R17 235 	R17 235   	 R17 235 	R16 425
Secondary (65 and older)	R9 765	R9 444	R9 444	R9 444	R9 000
Tertiary (75 and older)	R3 249	R3 145	R3 145	R3 145	R2 997

Tax Thresholds
25 February 2026 – See changes:

           Age                    	 	 Tax Year	 	 	 
 	2027	2026	2025	2024	2023 
Under 65	R99 000	R95 750	R95 750	R95 750	R91 250
65 and older	R153 250	R148 217	R148 217	R148 217	R141 250
75 and older	R171 300	R165 689	R165 689	R165 689	R157 900

/*
Medical Credit

Medical Tax Credit Rates 
25 February 2026 – See changes:

​Per month (R)	2027 	2026 	2025	2024	2023	2022​​
​For the taxpayer; or for a dependant who is a member of a medical scheme or fund, where the taxpayer him- or herself is not a member of a medical scheme or fund	R376	R364	R364	R364	R347	​R332
​​For the taxpayer and one dependant; or in respect of two dependants where the taxpayer him- or herself is not a member of a medical scheme or fund	R752	R728	R728	R728	R694	​R664
​​For each additional dependant	R254	R246	R246	R246	R234	​R224


UIF Cap: 
Rabates:
RA Cap Amount

Tax cap anyone earing lower than R95 000 a year does not get taxed
Max formula: 

-MAX(0, IF(W2<=226000,W2*0.18, IF(W2<=353100, 40680+(W2-226000)*0.26, IF(W2<-488700, 73726+(W2-353100) *0.31, IF(W2<=641400, 115762+(W2-488700)*
0.36, IF(W2<=817600,170734+(W2-641400)*0.39, IF(W2<=1731600,239452+(W2-817600)*0.41,614192+(W2-1731600)*0.45)))))) - 16425)

SARS:
Consider threshold:
under 65:  R99 000 or less no tax
over 65 : R163 250 or less

75 years and older: R171 300 or less

*/
