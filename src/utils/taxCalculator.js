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