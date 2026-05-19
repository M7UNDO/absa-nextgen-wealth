import React, { useState, useEffect } from "react";
import "../styles/FinancialModal.css";

const CURRENT_TAX_YEAR = 2027;

const TAX_TABLES = {
  2027: {
    brackets: [
      { upTo: 245100, base: 0, rate: 0.18, threshold: 0 },
      { upTo: 383100, base: 44118, rate: 0.26, threshold: 245100 },
      { upTo: 530200, base: 79998, rate: 0.31, threshold: 383100 },
      { upTo: 695800, base: 125599, rate: 0.36, threshold: 530200 },
      { upTo: 887000, base: 185215, rate: 0.39, threshold: 695800 },
      { upTo: 1878600, base: 259783, rate: 0.41, threshold: 887000 },
      { upTo: Infinity, base: 666339, rate: 0.45, threshold: 1878600 }
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
      firstTwoMembers: 376,
      additionalMember: 254
    }
  }
};

function getAgeBand(age) {
  if (age >= 75) {
    return "age75Plus";
  }

  if (age >= 65) {
    return "age65To74";
  }

  return "under65";
}

function calculateUIF(monthlyIncome) {
  const UIF_RATE = 0.01;
  const UIF_MONTHLY_CAP = 17712;

  return Math.min(monthlyIncome, UIF_MONTHLY_CAP) * UIF_RATE;
}

function calculateMedicalTaxCredit(
  medicalAidMembers,
  taxYear = CURRENT_TAX_YEAR
) {
  const table = TAX_TABLES[taxYear];
  const members = Math.max(0, medicalAidMembers);

  if (members === 0) {
    return 0;
  }

  if (members <= 2) {
    return members * table.medicalCredits.firstTwoMembers;
  }

  return (
    2 * table.medicalCredits.firstTwoMembers +
    (members - 2) * table.medicalCredits.additionalMember
  );
}

function calculateAnnualTaxBeforeRebates(
  annualTaxableIncome,
  taxYear = CURRENT_TAX_YEAR
) {
  const table = TAX_TABLES[taxYear];

  const bracket = table.brackets.find((item) => {
    return annualTaxableIncome <= item.upTo;
  });

  return bracket.base + (annualTaxableIncome - bracket.threshold) * bracket.rate;
}

function calculatePAYE({
  monthlyIncome,
  monthlyRetirement = 0,
  age = 30,
  medicalAidMembers = 0,
  taxYear = CURRENT_TAX_YEAR
}) {
  const table = TAX_TABLES[taxYear];
  const ageBand = getAgeBand(age);

  const annualIncome = monthlyIncome * 12;
  const annualRetirement = monthlyRetirement * 12;

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
    calculateMedicalTaxCredit(medicalAidMembers, taxYear) * 12;

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

function calculateNetIncome({
  grossIncome,
  retirement = 0,
  age = 30,
  medicalAidMembers = 0,
  taxYear = CURRENT_TAX_YEAR
}) {
  const payeResult = calculatePAYE({
    monthlyIncome: grossIncome,
    monthlyRetirement: retirement,
    age,
    medicalAidMembers,
    taxYear
  });

  const monthlyUIF = calculateUIF(grossIncome);

  const netIncome = grossIncome - payeResult.monthlyPAYE - monthlyUIF;

  return {
    netIncome,
    monthlyPAYE: payeResult.monthlyPAYE,
    monthlyUIF,
    annualPAYE: payeResult.annualPAYE,
    annualTaxableIncome: payeResult.annualTaxableIncome,
    allowedRetirementDeduction: payeResult.allowedRetirementDeduction
  };
}

function FinancialSetupModal({ onComplete, onClose, initialData, isEditing }) {
  const [form, setForm] = useState({
    grossIncome: "",
    rent: "",
    retirement: "",
    vehicle: "",
    age: "",
    medicalAidMembers: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm({
        grossIncome: initialData.grossIncome || "",
        rent: initialData.rent || "",
        retirement: initialData.retirement || "",
        vehicle: initialData.vehicle || "",
        age: initialData.age || "",
        medicalAidMembers: initialData.medicalAidMembers || ""
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!form.grossIncome) {
      setError("Gross income is required");
      return;
    }

    const grossIncome = Number(form.grossIncome);
    const rent = Number(form.rent) || 0;
    const retirement = Number(form.retirement) || 0;
    const vehicle = Number(form.vehicle) || 0;
    const age = Number(form.age) || 30;
    const medicalAidMembers = Number(form.medicalAidMembers) || 0;

    if (grossIncome <= 0) {
      setError("Gross income must be greater than 0");
      return;
    }

    setLoading(true);

    const incomeBreakdown = calculateNetIncome({
      grossIncome,
      retirement,
      age,
      medicalAidMembers,
      taxYear: CURRENT_TAX_YEAR
    });

    const financialData = {
      grossIncome,
      rent,
      retirement,
      vehicle,
      age,
      medicalAidMembers,

      netIncome: incomeBreakdown.netIncome,
      monthlyPAYE: incomeBreakdown.monthlyPAYE,
      monthlyUIF: incomeBreakdown.monthlyUIF,
      annualPAYE: incomeBreakdown.annualPAYE,
      annualTaxableIncome: incomeBreakdown.annualTaxableIncome,
      allowedRetirementDeduction: incomeBreakdown.allowedRetirementDeduction
    };

    setTimeout(() => {
      setLoading(false);
      onComplete(financialData);
    }, 300);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        {isEditing && (
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        )}

        <h2>{initialData ? "Edit Your Finances" : "Set Up Your Finances"}</h2>

        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="gross-income">Gross Monthly Income (ZAR)</label>
            <input
              id="gross-income"
              name="grossIncome"
              type="number"
              min="0"
              placeholder="e.g. 55000"
              value={form.grossIncome}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="rent">Rent</label>
            <input
              id="rent"
              name="rent"
              type="number"
              min="0"
              placeholder="e.g. 12000"
              value={form.rent}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="retirement">Retirement Contribution</label>
            <input
              id="retirement"
              name="retirement"
              type="number"
              min="0"
              placeholder="e.g. 3000"
              value={form.retirement}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="vehicle">Vehicle Finance</label>
            <input
              id="vehicle"
              name="vehicle"
              type="number"
              min="0"
              placeholder="e.g. 4500"
              value={form.vehicle}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="age">Age</label>
            <input
              id="age"
              name="age"
              type="number"
              min="18"
              placeholder="e.g. 30"
              value={form.age}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="medical-aid-members">Medical Aid Members</label>
            <input
              id="medical-aid-members"
              name="medicalAidMembers"
              type="number"
              min="0"
              placeholder="e.g. 1"
              value={form.medicalAidMembers}
              onChange={handleChange}
            />
          </div>

          {error && <p className="modal-error">{error}</p>}

          <button type="submit" disabled={loading} className="setup-btn">
            {loading
              ? "Saving..."
              : initialData
              ? "Update Finances"
              : "Save & Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default FinancialSetupModal;