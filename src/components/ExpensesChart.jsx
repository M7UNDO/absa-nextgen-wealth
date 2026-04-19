import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip
} from "recharts";
import "../styles/ExpensesChart.css";

import { calculateNetIncome } from "../utils/taxCalculator";

function ExpensesChart({ data }) {
  const totalExpenses =
    data.rent + data.retirement + data.vehicle;

  const netIncome = calculateNetIncome(data.grossIncome);

  const remainingCash = Math.max(
    0,
    netIncome - totalExpenses
  );

  const chartData = [
    {
      name: "Expenses",
      value: totalExpenses,
      color: "#ff4d4f"
    },
    {
      name: "Remaining Cash",
      value: remainingCash,
      color: "#1890ff"
    }
  ];

  const formatCurrency = (value) =>
    `R ${value.toLocaleString("en-ZA")}`;

  return (
    <div className="chart-card">
      <h4>Cash Flow Overview</h4>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            innerRadius={70}
            outerRadius={100}
          >
            {chartData.map((item, index) => (
              <Cell
                key={index}
                fill={item.color}
              />
            ))}
          </Pie>

          <Tooltip
            formatter={(value) =>
              formatCurrency(value)
            }
          />
        </PieChart>
      </ResponsiveContainer>

      <div className="expense-breakdown">
        <p>Rent: {formatCurrency(data.rent)}</p>
        <p>
          Retirement:{" "}
          {formatCurrency(data.retirement)}
        </p>
        <p>
          Vehicle: {formatCurrency(data.vehicle)}
        </p>

        <h3>
          Total Expenses:{" "}
          {formatCurrency(totalExpenses)}
        </h3>

        <h3>
          Remaining After Expenses:{" "}
          {formatCurrency(remainingCash)}
        </h3>
      </div>
    </div>
  );
}

export default ExpensesChart;