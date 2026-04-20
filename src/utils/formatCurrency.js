export function formatCurrency(amount) {
  if (amount === null || amount === undefined || isNaN(amount)) return "R0";

  return `R${Number(amount).toLocaleString("en-ZA", {
    maximumFractionDigits: 0,
  })}`;
}