import React from "react";
import {PieChart, Pie, Cell, ResponsiveContainer, Tooltip} from "recharts";
import "../styles/ExpensesChart.css";

import {useFinancials} from "../context/FinancialContext";
import {calculateNetIncome} from "../utils/taxCalculator";
import {formatCurrency} from "../utils/formatCurrency";

function ExpensesChart() {
  const {financials} = useFinancials();

  if (!financials) {
    return null;
  }

  const grossIncome = Number(financials.grossIncome) || 0;
  const rent = Number(financials.rent) || 0;
  const retirement = Number(financials.retirement) || 0;
  const vehicle = Number(financials.vehicle) || 0;
  const age = Number(financials.age) || 30;
  const medicalAidMembers = Number(financials.medicalAidMembers) || 0;

  const incomeBreakdown = calculateNetIncome({
    grossIncome,
    retirement,
    age,
    medicalAidMembers,
  });

  const netIncome = incomeBreakdown.netIncome;

  const totalExpenses = rent + retirement + vehicle;
  const remainingCash = Math.max(0, netIncome - totalExpenses);

  const expensesPercentage = netIncome > 0 ? (totalExpenses / netIncome) * 100 : 0;

  const remainingPercentage = netIncome > 0 ? (remainingCash / netIncome) * 100 : 0;

  const chartData = [
    {
      name: "Expenses",
      value: totalExpenses,
      color: "#ff4d4f",
    },
    {
      name: "Remaining Cash",
      value: remainingCash,
      color: "#1890ff",
    },
  ];

  const renderPercentageLabel = ({cx, cy, midAngle, innerRadius, outerRadius, percent}) => {
    if (percent === 0 || percent < 0.08) return null;

    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;

    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="#ffffff"
        textAnchor="middle"
        dominantBaseline="central"
        className="chart-percentage-label"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const renderCenterLabel = () => {
    return (
      <>
        <text x="50%" y="46%" textAnchor="middle" dominantBaseline="central" className="chart-centre-label-title">
          Net Income
        </text>

        <text x="50%" y="56%" textAnchor="middle" dominantBaseline="central" className="chart-centre-label-value">
          {formatCurrency(netIncome)}
        </text>
      </>
    );
  };

  return (
    <div className="chart-card">
      <div className="chart-card-header">
        <h4 className="cashflow-title">Cash Flow Overview</h4>
        <p>Fixed costs vs remaining monthly cash</p>
      </div>

      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={320}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={78}
              outerRadius={110}
              paddingAngle={2}
              cornerRadius={8}
              stroke="none"
              labelLine={false}
              label={renderPercentageLabel}
            >
              {chartData.map((item, index) => (
                <Cell key={index} fill={item.color} />
              ))}
            </Pie>

            {renderCenterLabel()}

            <Tooltip
              formatter={(value, name) => [formatCurrency(value), name]}
              contentStyle={{
                borderRadius: "1rem",
                background: "var(--background-colour)",
                border: "0.1rem solid var(--light-border)",
                boxShadow: "0 1rem 3rem rgba(0, 0, 0, 0.08)",
                fontSize: "1.3rem",
                fontWeight: "700",
                fontFamily: "var(--numbers-font)"
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-legend">
        <div className="legend-item">
          <span className="legend-dot expenses-dot"></span>
          <span>Expenses</span>
        </div>

        <div className="legend-item">
          <span className="legend-dot remaining-dot"></span>
          <span>Remaining Cash</span>
        </div>
      </div>

      <div className="expense-breakdown">
        <div className="breakdown-row">
          <span>Rent</span>
          <span>{formatCurrency(rent)}</span>
        </div>

        <div className="breakdown-row">
          <span>Retirement</span>
          <span>{formatCurrency(retirement)}</span>
        </div>

        <div className="breakdown-row">
          <span>Vehicle</span>
          <span>{formatCurrency(vehicle)}</span>
        </div>

        <div className="breakdown-divider"></div>

        <div className="breakdown-row">
          <span>PAYE Estimated</span>
          <span>{formatCurrency(incomeBreakdown.monthlyPAYE)}</span>
        </div>

        <div className="breakdown-row">
          <span>UIF Estimated</span>
          <span>{formatCurrency(incomeBreakdown.monthlyUIF)}</span>
        </div>

        <div className="breakdown-divider"></div>

        <div className="breakdown-row breakdown-strong">
          <span>Total Expenses</span>
          <span id="total-expenses">
            {formatCurrency(totalExpenses)} ({expensesPercentage.toFixed(0)}%)
          </span>
        </div>

        <div className="breakdown-row breakdown-strong">
          <span>Remaining After Expenses</span>
          <span id="remaining-cash">
            {formatCurrency(remainingCash)} ({remainingPercentage.toFixed(0)}%)
          </span>
        </div>
      </div>
    </div>
  );
}

export default ExpensesChart;
