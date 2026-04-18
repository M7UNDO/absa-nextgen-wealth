import React from "react";
import { PieChart, Pie, Cell } from "recharts";

function ExpensesChart({ data }) {
  const fixedCosts = data.rent + data.retirement + data.vehicle;
  const disposable = data.grossIncome - fixedCosts;

  const chartData = [
    { name: "Fixed Costs", value: fixedCosts },
    { name: "Disposable", value: disposable }
  ];

  return (
    <div className="chart-card">
      <h4>Cash Flow Overview</h4>

      <PieChart width={250} height={250}>
        <Pie
          data={chartData}
          dataKey="value"
          innerRadius={70}
          outerRadius={100}
        >
          <Cell fill="#ff4d4f" />
          <Cell fill="#1890ff" />
        </Pie>
      </PieChart>

      <div className="expense-breakdown">
        <p>Rent: R {data.rent}</p>
        <p>Retirement: R {data.retirement}</p>
        <p>Vehicle: R {data.vehicle}</p>
        <h3>Total Fixed: R {fixedCosts}</h3>
      </div>
    </div>
  );
}

export default ExpensesChart;