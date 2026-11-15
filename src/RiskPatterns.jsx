
import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";
import riskData from "./risk_patterns.json";

export default function RiskPatterns() {
  const patterns = riskData.patterns.map((item) => ({
    name: item["Financial warning sign"],
    bankrupt: item["Bankrupt (%)"],
    nonBankrupt: item["Non-bankrupt (%)"],
    bankruptSample: item["Bankrupt sample size"],
    nonBankruptSample: item["Non-bankrupt sample size"]
  }));

  return (
    <div className="risk-dashboard">
      <div className="risk-heading">
        <h1>Financial Risk Patterns</h1>
        <p>
          Explore financial warning signs observed in
          companies with and without a one-year
          bankruptcy label.
        </p>
      </div>

      <div className="risk-summary">
        <div className="risk-stat">
          <span>Dataset</span>
          <strong>OpenFundEx</strong>
        </div>

        <div className="risk-stat">
          <span>Training records</span>
          <strong>
            {riskData.total_records.toLocaleString()}
          </strong>
        </div>

        <div className="risk-stat">
          <span>Warning signs analyzed</span>
          <strong>{patterns.length}</strong>
        </div>
      </div>

      <div className="risk-chart-card">
        <h2>Financial Warning Signs Comparison</h2>
        <p>
          Percentage of eligible records exhibiting
          each warning sign.
        </p>

        <div style={{ width: "100%", height: 390 }}>
          <ResponsiveContainer>
            <BarChart
              data={patterns}
              margin={{ top: 20, right: 20, bottom: 85, left: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                interval={0}
                angle={-25}
                textAnchor="end"
                height={110}
                tick={{ fontSize: 11 }}
              />
              <YAxis domain={[0, 100]} unit="%" />
              <Tooltip formatter={(value) => `${value}%`} />
              <Legend verticalAlign="top" height={40} />
              <Bar
                dataKey="bankrupt"
                name="Bankrupt within 1 year"
                fill="#D49B45"
                radius={[5, 5, 0, 0]}
              />
              <Bar
                dataKey="nonBankrupt"
                name="Not bankrupt within 1 year"
                fill="#237A57"
                radius={[5, 5, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="risk-chart-card">
        <h2>Individual Financial Patterns</h2>

        <div className="risk-pattern-grid">
          {patterns.map((item) => (
            <div className="risk-pattern-card" key={item.name}>
              <h3>{item.name}</h3>

              <div className="risk-comparison">
                <div>
                  <span>Bankrupt within 1 year</span>
                  <strong>{item.bankrupt}%</strong>
                  <small>Valid records: {item.bankruptSample?.toLocaleString()}</small>
                </div>

                <div>
                  <span>Not bankrupt within 1 year</span>
                  <strong>{item.nonBankrupt}%</strong>
                  <small>Valid records: {item.nonBankruptSample?.toLocaleString()}</small>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="risk-disclaimer">
        <strong>Understanding these statistics</strong>
        <p>
          These results describe associations in the
          OpenFundEx training dataset. They do not
          establish causes of bankruptcy or represent
          individual bankruptcy probabilities.
          Sample sizes vary because some financial
          indicators are missing.
        </p>
      </div>
    </div>
  );
}
