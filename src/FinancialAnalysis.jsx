
import React, { useState } from "react";
import { analyzeFinances } from "./api";

const fields = [
  ["total_assets", "Total assets"],
  ["total_liabilities", "Total liabilities"],
  ["current_assets", "Current assets"],
  ["current_liabilities", "Current liabilities"],
  ["cash_and_equivalents", "Cash and equivalents"],
  ["revenue", "Annual revenue"],
  ["net_income", "Net income"],
  ["total_equity", "Total equity (optional)"],
  ["operating_cash_flow", "Operating cash flow"],
  ["previous_revenue", "Previous year's revenue"]
];

const example = {
  total_assets: 500000,
  total_liabilities: 420000,
  current_assets: 90000,
  current_liabilities: 150000,
  cash_and_equivalents: 20000,
  revenue: 350000,
  net_income: -25000,
  total_equity: 80000,
  operating_cash_flow: -18000,
  previous_revenue: 420000
};

function safeRatio(a, b) {
  if (
    !Number.isFinite(a) ||
    !Number.isFinite(b) ||
    b <= 0
  ) {
    return null;
  }

  return a / b;
}

function prepareFinancialData(values) {
  const data = {};

  for (const [key, value] of Object.entries(values)) {
    if (value === "" || value === null || value === undefined) {
      continue;
    }

    const number = Number(value);

    if (Number.isFinite(number)) {
      data[key] = number;
    }
  }

  const {
    total_assets,
    total_liabilities,
    current_assets,
    current_liabilities,
    revenue,
    net_income
  } = data;

  const equity =
    Number.isFinite(data.total_equity)
      ? data.total_equity
      : (
          Number.isFinite(total_assets) &&
          Number.isFinite(total_liabilities)
            ? total_assets - total_liabilities
            : null
        );

  const netMargin = safeRatio(net_income, revenue);
  const roa = safeRatio(net_income, total_assets);
  const roe = safeRatio(net_income, equity);
  const currentRatio = safeRatio(
    current_assets,
    current_liabilities
  );

  if (netMargin !== null) data.net_margin = netMargin;
  if (roa !== null) data.roa = roa;
  if (roe !== null) data.roe = roe;
  if (currentRatio !== null) {
    data.current_ratio = currentRatio;
  }

  return data;
}

function formatValue(value) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return "Unavailable";
  }

  return value.toLocaleString(undefined, {
    maximumFractionDigits: 3
  });
}

export default function FinancialAnalysis({
  analysisResult,
  setAnalysisResult
}) {
  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const result = analysisResult;
  const setResult = setAnalysisResult;

  function updateField(key, value) {
    setValues(prev => ({
      ...prev,
      [key]: value
    }));
    setResult(null);
    setError("");
  }

  async function submit(event) {
    event.preventDefault();

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const data = prepareFinancialData(values);
      const response = await analyzeFinances(data);
      setResult(response);
    } catch (err) {
      setError(
        err.message || "Financial analysis failed."
      );
    } finally {
      setLoading(false);
    }
  }

  const scoreAvailable =
    result &&
    typeof result.model_score === "number" &&
    Number.isFinite(result.model_score);

  return (
    <div className="analysis-page">
      <section className="analysis-panel">
        <div className="section-heading">
          <h2>Company financial information</h2>
          <p>
            Enter your company's financial figures to
            identify potential weaknesses and explore
            preventive actions.
          </p>
        </div>

        <form onSubmit={submit}>
          <div className="financial-form-grid">
            {fields.map(([key, label]) => (
              <label
                className="financial-field"
                key={key}
              >
                <span>{label}</span>

                <input
                  type="number"
                  step="any"
                  required={key !== "total_equity"}
                  value={values[key] ?? ""}
                  onChange={event =>
                    updateField(
                      key,
                      event.target.value
                    )
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
              {loading
                ? "Analyzing..."
                : "Analyze finances"}
            </button>
          </div>
        </form>

        <p className="analysis-note">
          This is an educational financial
          decision-support prototype.
          Use fictional company figures for testing.
          Model predictions are not guaranteed outcomes.
        </p>
      </section>

      {error && (
        <div
          className="analysis-error"
          role="alert"
        >
          {error}
        </div>
      )}

      {result && (
        <section
          className="analysis-results"
          aria-live="polite"
        >
          <div className="section-heading">
            <h2>Financial analysis results</h2>
            <p>
              {result.issues_identified ?? 0} financial
              warning signs identified.
            </p>
          </div>

          <div className="financial-metrics">
            {Object.entries(
              result.financial_indicators || {}
            ).map(([key, value]) => (
              <div
                className="metric-card"
                key={key}
              >
                <span>
                  {key.replaceAll("_", " ")}
                </span>
                <strong>
                  {formatValue(value)}
                </strong>
              </div>
            ))}
          </div>

          <div className="model-status">
            <h3>WealthGuard AI assessment</h3>

            {scoreAvailable ? (
              <>
                <p>
                  <strong>Model score: </strong>
                  {formatValue(result.model_score)}
                </p>

                <p>
                  <strong>Warning status: </strong>
                  {result.warning_triggered
                    ? "Warning threshold reached"
                    : "Warning threshold not reached"}
                </p>

                <p>
                  <strong>Feature coverage: </strong>
                  {typeof result.feature_coverage === "number"
                    ? `${Math.round(
                        result.feature_coverage * 100
                      )}%`
                    : "Unavailable"}
                </p>

                <p>
                  <strong>Prediction status: </strong>
                  {result.prediction_status || "Provisional"}
                </p>

                <small>
                  The model score is uncalibrated and
                  must not be interpreted as a
                  bankruptcy probability.
                </small>
              </>
            ) : (
              <p>
                More financial information is needed
                to generate an AI model score.
              </p>
            )}
          </div>

          <h2>
            Identified problems and recommendations
          </h2>

          <div className="recommendation-grid">
            {(result.recommendations || []).length > 0 ? (
              result.recommendations.map(
                (item, index) => (
                  <article
                    className="recommendation-card"
                    key={index}
                  >
                    <h3>{item.problem}</h3>

                    <p>{item.explanation}</p>

                    <strong>
                      Recommended actions
                    </strong>

                    <ul>
                      {(item.recommended_actions || [])
                        .map((action, i) => (
                          <li key={i}>
                            {action}
                          </li>
                        ))}
                    </ul>

                    <small>
                      Monitor: {item.monitor}
                    </small>
                  </article>
                )
              )
            ) : (
              <p>
                No warning signs were identified
                by the current financial rules
                using the supplied information.
              </p>
            )}
          </div>

          {result.disclaimer && (
            <p className="analysis-note">
              {result.disclaimer}
            </p>
          )}
        </section>
      )}
    </div>
  );
}
