
import React, { useState } from "react";
import { analyzeFinances } from "./api";

const fields = [
  ["total_assets", "Total assets"],
  ["total_liabilities", "Total liabilities"],
  ["current_assets", "Current assets"],
  ["current_liabilities", "Current liabilities"],
  ["revenue", "Annual revenue"],
  ["net_income", "Net income"],
  ["operating_cash_flow", "Operating cash flow"],
  ["previous_revenue", "Previous year's revenue"]
];

const example = {
  total_assets: 500000,
  total_liabilities: 420000,
  current_assets: 90000,
  current_liabilities: 150000,
  revenue: 350000,
  net_income: -25000,
  operating_cash_flow: -18000,
  previous_revenue: 420000
};

export default function FinancialAnalysis() {
  const [values, setValues] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function updateField(key, value) {
    setValues(prev => ({ ...prev, [key]: value }));
    setResult(null);
    setError("");
  }

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const data = Object.fromEntries(
        Object.entries(values)
          .filter(([, value]) => value !== "")
          .map(([key, value]) => [key, Number(value)])
      );

      const response = await analyzeFinances(data);
      setResult(response);
    } catch (err) {
      setError(err.message || "Analysis failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="analysis-page">
      <section className="analysis-panel">
        <div className="section-heading">
          <h2>Company financial information</h2>
          <p>
            Enter your financial figures to identify potential
            weaknesses and explore preventive actions.
          </p>
        </div>

        <form onSubmit={submit}>
          <div className="financial-form-grid">
            {fields.map(([key, label]) => (
              <label className="financial-field" key={key}>
                <span>{label}</span>
                <input
                  type="number"
                  step="any"
                  required
                  value={values[key] ?? ""}
                  onChange={event =>
                    updateField(key, event.target.value)
                  }
                  placeholder="Enter amount"
                />
              </label>
            ))}
          </div>

          <div className="analysis-actions">
            <button
              className="primary-button"
              type="button"
              onClick={() => {
                setValues(example);
                setResult(null);
                setError("");
              }}
            >
              Load example company
            </button>

            <button
              className="primary-button"
              type="submit"
              disabled={loading}
            >
              {loading ? "Analyzing..." : "Analyze finances"}
            </button>
          </div>
        </form>

        <p className="analysis-note">
          This is an educational decision-support prototype.
          Use fictional company figures for testing.
          Financial indicators are not a guarantee of future outcomes.
        </p>
      </section>

      {error && (
        <div className="analysis-error" role="alert">
          {error}
        </div>
      )}

      {result && (
        <section className="analysis-results" aria-live="polite">
          <div className="section-heading">
            <h2>Financial analysis results</h2>
            <p>
              {result.issues_identified} financial warning signs
              identified.
            </p>
          </div>

          <div className="financial-metrics">
            {Object.entries(
              result.financial_indicators || {}
            ).map(([key, value]) => (
              <div className="metric-card" key={key}>
                <span>{key.replaceAll("_", " ")}</span>
                <strong>
                  {typeof value === "number"
                    ? value.toLocaleString(undefined, {
                        maximumFractionDigits: 3
                      })
                    : "Unavailable"}
                </strong>
              </div>
            ))}
          </div>

          <div className="model-status">
            <strong>AI prediction status:</strong>{" "}
            {result.prediction_status === "insufficient_data"
              ? "More financial data is required for model scoring."
              : "Provisional model assessment available."}
          </div>

          <h2>Identified problems and recommendations</h2>

          <div className="recommendation-grid">
            {(result.recommendations || []).map((item, index) => (
              <article className="recommendation-card" key={index}>
                <h3>{item.problem}</h3>
                <p>{item.explanation}</p>
                <strong>Recommended actions</strong>
                <ul>
                  {(item.recommended_actions || []).map(
                    (action, i) => <li key={i}>{action}</li>
                  )}
                </ul>
                <small>Monitor: {item.monitor}</small>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
