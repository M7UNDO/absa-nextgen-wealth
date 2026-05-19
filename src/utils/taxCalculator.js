export function calculatePAYE(monthlyIncome) {
  const annual = monthlyIncome * 12;

  let tax = 0;

  if (annual <= 237100) {
    tax = annual * 0.18;
  } else if (annual <= 370500) {
    tax = 42678 + (annual - 237100) * 0.26;
  } else if (annual <= 512800) {
    tax = 77362 + (annual - 370500) * 0.31;
  } else if (annual <= 673000) {
    tax = 121475 + (annual - 512800) * 0.36;
  } else if (annual <= 857900) {
    tax = 179147 + (annual - 673000) * 0.39;
  } else if (annual <= 1817000) {
    tax = 251258 + (annual - 857900) * 0.41;
  } else {
    tax = 644489 + (annual - 1817000) * 0.45;
  }

  const rebate = 17235;

  const finalTax = Math.max(0, tax - rebate);

  return finalTax / 12;
}

export function calculateNetIncome(gross) {
  const paye = calculatePAYE(gross);
  return gross - paye;
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
